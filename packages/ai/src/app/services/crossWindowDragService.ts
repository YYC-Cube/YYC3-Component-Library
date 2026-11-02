/**
 * @file crossWindowDragService.ts
 * @description 跨窗口面板拖拽服务 v2.0 — 完整 Tab meta 传输 + 面板状态无损迁移
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.0.0
 * @created 2026-03-18
 * @updated 2026-03-19
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags cross-window, drag-drop, panel, ipc, meta-transfer
 */

/* ─── Tab 元数据（完整状态快照） ─── */
export interface TabMetaSnapshot {
  tabId: string;
  title: string;
  type: string;
  isPinned: boolean;
  isModified: boolean;
  isUnsaved: boolean;
  hasError: boolean;
  /** 扩展元信息（文件路径、编辑器光标、滚动位置等） */
  meta?: Record<string, unknown>;
}

/* ─── 编辑器状态快照（用于 code-editor 面板） ─── */
export interface EditorStateSnapshot {
  /** 文件路径 */
  filePath?: string;
  /** 编辑器语言 */
  language?: string;
  /** 光标位置 */
  cursorPosition?: { lineNumber: number; column: number };
  /** 滚动位置 */
  scrollPosition?: { scrollTop: number; scrollLeft: number };
  /** 选区范围 */
  selections?: Array<{
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  }>;
  /** 文件内容（可选，大文件不传） */
  content?: string;
  /** 视图状态（折叠区域等） */
  viewState?: Record<string, unknown>;
}

/* ─── 面板状态快照（全部需要迁移的数据） ─── */
export interface PanelStateSnapshot {
  panelId: string;
  panelType: string;
  panelTitle: string;
  /** 面板下所有 Tab 的元信息 */
  tabs: TabMetaSnapshot[];
  /** 当前活跃 Tab ID */
  activeTabId: string | null;
  /** 面板级别锁定/最大化/最小化状态 */
  isLocked: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  /** code-editor 类型的编辑器状态 */
  editorStates?: Record<string, EditorStateSnapshot>;
  /** AI chat 面板的对话上下文 */
  chatContext?: {
    conversationId?: string;
    messageCount?: number;
    lastMessage?: string;
  };
  /** 终端面板的工作目录 */
  terminalCwd?: string;
  /** 数据库面板的当前连接 */
  dbConnectionId?: string;
  /** 预览面板的设备配置 */
  previewDevice?: { width: number; height: number; name: string };
}

/* ─── 跨窗口拖拽消息类型 ─── */
export interface CrossWindowDragMessage {
  type: "drag-start" | "drag-over" | "drag-end" | "drag-cancel" | "panel-transfer" | "panel-state-sync";
  sourceWindowId: string;
  targetWindowId?: string;
  panelId: string;
  panelType: string;
  /** v2.0: 完整面板状态快照 */
  panelSnapshot?: PanelStateSnapshot;
  panelData?: Record<string, unknown>;
  position?: { x: number; y: number };
  timestamp: number;
}

/* ─── 跨窗口拖拽回调 ─── */
export type CrossWindowDragHandler = (message: CrossWindowDragMessage) => void;

/* ─── 服务实现 ─── */
class CrossWindowDragServiceImpl {
  private channel: BroadcastChannel | null = null;
  private windowId: string;
  private handlers: Map<string, CrossWindowDragHandler[]> = new Map();
  private isDragging = false;
  private currentDragPanel: string | null = null;
  /** v2.0: 缓存当前拖拽的面板完整状态快照 */
  private currentDragSnapshot: PanelStateSnapshot | null = null;

  constructor() {
    this.windowId = `window-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  /** 初始化通道 */
  init(): void {
    if (this.channel) return;
    this.channel = new BroadcastChannel("yyc3-cross-window-drag");
    this.channel.onmessage = (event: MessageEvent<CrossWindowDragMessage>) => {
      const msg = event.data;
      if (msg.sourceWindowId === this.windowId) return; // 忽略自身消息
      const typeHandlers = this.handlers.get(msg.type) || [];
      typeHandlers.forEach((handler) => handler(msg));
    };
  }

  /** 销毁通道 */
  destroy(): void {
    this.channel?.close();
    this.channel = null;
    this.handlers.clear();
    this.currentDragSnapshot = null;
  }

  /** 注册事件处理器 */
  on(type: CrossWindowDragMessage["type"], handler: CrossWindowDragHandler): () => void {
    const list = this.handlers.get(type) || [];
    list.push(handler);
    this.handlers.set(type, list);
    return () => {
      const updated = (this.handlers.get(type) || []).filter((h) => h !== handler);
      this.handlers.set(type, updated);
    };
  }

  /**
   * 开始拖拽面板（v2.0 — 含完整面板状态快照）
   * @param panelId 面板 ID
   * @param panelType 面板类型
   * @param panelData 兼容旧版简单数据
   * @param snapshot 完整面板状态快照
   */
  startDrag(
    panelId: string,
    panelType: string,
    panelData?: Record<string, unknown>,
    snapshot?: PanelStateSnapshot,
  ): void {
    this.isDragging = true;
    this.currentDragPanel = panelId;
    this.currentDragSnapshot = snapshot || null;
    this.broadcast({
      type: "drag-start",
      sourceWindowId: this.windowId,
      panelId,
      panelType,
      panelSnapshot: snapshot,
      panelData,
      timestamp: Date.now(),
    });
  }

  /** 拖拽移动 */
  dragOver(position: { x: number; y: number }): void {
    if (!this.isDragging || !this.currentDragPanel) return;
    this.broadcast({
      type: "drag-over",
      sourceWindowId: this.windowId,
      panelId: this.currentDragPanel,
      panelType: "",
      position,
      timestamp: Date.now(),
    });
  }

  /**
   * 拖拽完成 — 将面板转移至目标窗口（v2.0 含完整状态）
   */
  endDrag(targetWindowId: string): void {
    if (!this.currentDragPanel) return;
    this.broadcast({
      type: "panel-transfer",
      sourceWindowId: this.windowId,
      targetWindowId,
      panelId: this.currentDragPanel,
      panelType: this.currentDragSnapshot?.panelType || "",
      panelSnapshot: this.currentDragSnapshot || undefined,
      timestamp: Date.now(),
    });
    this.isDragging = false;
    this.currentDragPanel = null;
    this.currentDragSnapshot = null;
  }

  /** 取消拖拽 */
  cancelDrag(): void {
    if (!this.currentDragPanel) return;
    this.broadcast({
      type: "drag-cancel",
      sourceWindowId: this.windowId,
      panelId: this.currentDragPanel,
      panelType: "",
      timestamp: Date.now(),
    });
    this.isDragging = false;
    this.currentDragPanel = null;
    this.currentDragSnapshot = null;
  }

  /** 获取当前窗口 ID */
  getWindowId(): string {
    return this.windowId;
  }

  /** 是否正在拖拽 */
  getIsDragging(): boolean {
    return this.isDragging;
  }

  /** 获取当前拖拽的面板快照 */
  getCurrentSnapshot(): PanelStateSnapshot | null {
    return this.currentDragSnapshot;
  }

  /**
   * v2.0: 构建面板状态快照的辅助方法
   * 由 UI 组件调用，收集当前面板的完整状态
   */
  static buildSnapshot(opts: {
    panelId: string;
    panelType: string;
    panelTitle: string;
    tabs: TabMetaSnapshot[];
    activeTabId: string | null;
    isLocked?: boolean;
    isMinimized?: boolean;
    isMaximized?: boolean;
    editorStates?: Record<string, EditorStateSnapshot>;
    chatContext?: PanelStateSnapshot["chatContext"];
    terminalCwd?: string;
    dbConnectionId?: string;
    previewDevice?: PanelStateSnapshot["previewDevice"];
  }): PanelStateSnapshot {
    return {
      panelId: opts.panelId,
      panelType: opts.panelType,
      panelTitle: opts.panelTitle,
      tabs: opts.tabs,
      activeTabId: opts.activeTabId,
      isLocked: opts.isLocked ?? false,
      isMinimized: opts.isMinimized ?? false,
      isMaximized: opts.isMaximized ?? false,
      editorStates: opts.editorStates,
      chatContext: opts.chatContext,
      terminalCwd: opts.terminalCwd,
      dbConnectionId: opts.dbConnectionId,
      previewDevice: opts.previewDevice,
    };
  }

  private broadcast(message: CrossWindowDragMessage): void {
    this.channel?.postMessage(message);
  }
}

export const crossWindowDragService = new CrossWindowDragServiceImpl();
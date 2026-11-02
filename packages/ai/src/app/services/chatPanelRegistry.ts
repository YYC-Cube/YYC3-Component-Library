/**
 * @file chatPanelRegistry.ts
 * @description AI Chat 面板状态注册表 — 用于跨窗口拖拽时提取当前对话上下文快照
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-19
 * @updated 2026-03-19
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags chat, registry, cross-window, snapshot
 */

/* ─── 对话消息（轻量化传输格式） ─── */
export interface ChatMsgSnapshot {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  model?: string;
  tokenCount?: number;
  parentId?: string;
  childrenIds?: string[];
  activeChildIdx?: number;
  branchLabel?: string;
  attachments?: Array<{
    id: string;
    name: string;
    path: string;
    language: string;
    size: number;
    preview: string;
  }>;
}

/* ─── 对话快照 ─── */
export interface ConversationSnapshot {
  id: string;
  title: string;
  messages: ChatMsgSnapshot[];
  createdAt: number;
  activePath: string[];
}

/* ─── 面板级别聊天上下文快照 ─── */
export interface ChatContextSnapshot {
  /** 所有对话 */
  conversations: ConversationSnapshot[];
  /** 当前活跃对话 ID */
  activeConvId: string;
  /** 输入框文本 */
  input: string;
  /** 附件列表 */
  attachments: Array<{
    id: string;
    name: string;
    path: string;
    language: string;
    size: number;
    preview: string;
  }>;
  /** 快照时间戳 */
  snapshotAt: number;
}

/**
 * ChatPanelRegistry — 全局单例注册表
 *
 * AIChatPanel 在每次关键状态变化时调用 `register()` 写入最新状态,
 * TabBar 在构建拖拽快照时调用 `getSnapshot()` 提取对话上下文
 */
class ChatPanelRegistryImpl {
  /** key = tabId or panelId, value = 最新快照 */
  private registry: Map<string, ChatContextSnapshot> = new Map();

  /** 注册/更新某 Tab 的聊天上下文 */
  register(tabId: string, snapshot: ChatContextSnapshot): void {
    this.registry.set(tabId, snapshot);
  }

  /** 获取某 Tab 的聊天上下文快照 */
  getSnapshot(tabId: string): ChatContextSnapshot | null {
    return this.registry.get(tabId) || null;
  }

  /** 移除某 Tab 的记录（Tab 关闭时调用） */
  unregister(tabId: string): void {
    this.registry.delete(tabId);
  }

  /** 清空所有记录 */
  clear(): void {
    this.registry.clear();
  }

  /** 获取已注册的 Tab 数量（调试用） */
  get size(): number {
    return this.registry.size;
  }
}

export const chatPanelRegistry = new ChatPanelRegistryImpl();

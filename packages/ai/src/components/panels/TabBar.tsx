/**
 * @file TabBar.tsx
 * @description Tab 标签栏 v2.0 — 同面板拖拽排序 + 跨面板拖拽移动 + 插入指示线 + 上下文菜单
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags tab, bar, dnd, drag-sort, panel, reorder
 */

import React, { useRef, useState, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  X, Pin, Circle, TriangleAlert,
  Code, FolderTree, Eye, Terminal as TerminalIcon, Bot,
  Bug, FileOutput, Search, Database, GitBranch,
  Settings, Activity, Puzzle, Palette, Keyboard, Gauge,
  LayoutDashboard,
  House, ListTodo,
} from "lucide-react";
import { Tab, PanelType, useLayoutStore } from "../../stores/layoutStore";
import { useContextMenu, PanelContextMenu } from "./PanelContextMenu";
import { crossWindowDragService } from "../../services/crossWindowDragService";
import { chatPanelRegistry } from "../../services/chatPanelRegistry";

const DND_TAB = "YYC3_TAB";

/* ─── 视口边缘检测阈值（像素） ─── */
const EDGE_THRESHOLD = 30;

const typeIcons: Record<PanelType, React.ElementType> = {
  "code-editor": Code,
  "file-browser": FolderTree,
  preview: Eye,
  terminal: TerminalIcon,
  "ai-chat": Bot,
  debug: Bug,
  output: FileOutput,
  search: Search,
  database: Database,
  "version-control": GitBranch,
  "ai-provider": Settings,
  "ai-monitor": Activity,
  "plugin-manager": Puzzle,
  "theme-editor": Palette,
  "shortcut-editor": Keyboard,
  "performance-monitor": Gauge,
  dashboard: LayoutDashboard,
  welcome: House,
  "task-board": ListTodo,
};

/* ─── 拖拽数据 ─── */
interface TabDragItem {
  tabId: string;
  panelId: string;
  index: number;
}

/* ─── 单个 Tab 项 ─── */
const TabItem: React.FC<{
  tab: Tab;
  index: number;
  isActive: boolean;
  panelId: string;
  onContextMenu: (e: React.MouseEvent) => void;
}> = ({ tab, index, isActive, panelId, onContextMenu }) => {
  const { switchTab, closeTab, pinTab, moveTab, reorderTabs } = useLayoutStore();
  const Icon = typeIcons[tab.type] || Code;
  const ref = useRef<HTMLDivElement>(null);
  const [dropSide, setDropSide] = useState<"left" | "right" | null>(null);

  /* 拖拽源 — 支持跨窗口拖拽（拖至视口边缘时触发） */
  const [{ isDragging }, dragRef] = useDrag({
    type: DND_TAB,
    item: (): TabDragItem & { type: PanelType; title: string } => ({
      tabId: tab.id,
      panelId: tab.panelId,
      index,
      type: tab.type,
      title: tab.title,
    }),
    end: (_item, monitor) => {
      if (!monitor.didDrop()) {
        // Tab 被拖到了非放置区域 → 触发跨窗口拖拽广播
        const offset = monitor.getClientOffset();
        if (offset) {
          const nearEdge =
            offset.x < EDGE_THRESHOLD ||
            offset.x > window.innerWidth - EDGE_THRESHOLD ||
            offset.y < EDGE_THRESHOLD ||
            offset.y > window.innerHeight - EDGE_THRESHOLD;
          if (nearEdge) {
            // v2.0: 构建完整面板状态快照并广播
            const store = useLayoutStore.getState();
            const sourcePanel = store.panels[tab.panelId];
            const panelTabs = sourcePanel
              ? sourcePanel.tabs.map((tid) => store.tabs[tid]).filter(Boolean)
              : [];
            // 构建 Tab 元信息快照
            const tabSnapshots = panelTabs.map((t) => ({
              tabId: t.id,
              title: t.title,
              type: t.type,
              isPinned: t.isPinned,
              isModified: t.isModified,
              isUnsaved: t.isUnsaved,
              hasError: t.hasError,
              meta: t.meta as Record<string, unknown> | undefined,
            }));
            // 提取编辑器状态（从 meta 中收集）
            const editorStates: Record<string, Record<string, unknown>> = {};
            panelTabs.forEach((t) => {
              if (t.type === "code-editor" && t.meta) {
                editorStates[t.id] = {
                  filePath: t.meta.filePath,
                  language: t.meta.language,
                  cursorPosition: t.meta.cursorPosition,
                  scrollPosition: t.meta.scrollPosition,
                  selections: t.meta.selections,
                };
              }
            });
            // v2.1: 提取 AI Chat 对话上下文（从 chatPanelRegistry 读取实时快照）
            let chatContext: Record<string, unknown> | undefined;
            panelTabs.forEach((t) => {
              if (t.type === "ai-chat") {
                const chatSnapshot = chatPanelRegistry.getSnapshot(t.id);
                if (chatSnapshot) {
                  chatContext = {
                    conversations: chatSnapshot.conversations,
                    activeConvId: chatSnapshot.activeConvId,
                    input: chatSnapshot.input,
                    attachments: chatSnapshot.attachments,
                    snapshotAt: chatSnapshot.snapshotAt,
                  };
                  // 注入到对应 Tab 的 meta._chatContext，使目标窗口可通过 tab.meta 恢复
                  const snapIdx = tabSnapshots.findIndex((s) => s.tabId === t.id);
                  if (snapIdx !== -1) {
                    tabSnapshots[snapIdx] = {
                      ...tabSnapshots[snapIdx],
                      meta: {
                        ...(tabSnapshots[snapIdx].meta || {}),
                        _chatContext: chatContext,
                      },
                    };
                  }
                }
              }
            });

            const fullSnapshot = {
              panelId: tab.panelId,
              panelType: sourcePanel?.type || tab.type,
              panelTitle: sourcePanel?.title || tab.title,
              tabs: tabSnapshots,
              activeTabId: sourcePanel?.activeTabId || null,
              isLocked: sourcePanel?.isLocked || false,
              isMinimized: sourcePanel?.isMinimized || false,
              isMaximized: sourcePanel?.isMaximized || false,
              editorStates: Object.keys(editorStates).length > 0 ? editorStates : undefined,
              chatContext,
            };
            crossWindowDragService.startDrag(
              tab.panelId,
              tab.type,
              { tabId: tab.id, title: tab.title },
              fullSnapshot as any,
            );
          }
        }
      }
    },
    collect: (m) => ({ isDragging: m.isDragging() }),
  });

  /* 放置目标 */
  const [{ isOver }, dropRef] = useDrop({
    accept: DND_TAB,
    hover: (item: TabDragItem, monitor) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const clientX = monitor.getClientOffset()?.x ?? 0;
      const midX = rect.left + rect.width / 2;
      setDropSide(clientX < midX ? "left" : "right");
    },
    drop: (item: TabDragItem) => {
      setDropSide(null);
      if (item.tabId === tab.id) return;

      if (item.panelId === panelId) {
        /* 同面板排序 */
        const fromIdx = item.index;
        let toIdx = index;
        if (dropSide === "right") toIdx = index + (fromIdx < index ? 0 : 1);
        else toIdx = index - (fromIdx < index ? 1 : 0);
        if (fromIdx !== toIdx) reorderTabs(panelId, fromIdx, Math.max(0, toIdx));
      } else {
        /* 跨面板移动 */
        moveTab(item.tabId, panelId);
      }
    },
    collect: (m) => ({ isOver: m.isOver() }),
  });

  /* 组合 ref */
  const composedRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (ref && typeof ref === "object" && "current" in ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }
      dragRef(el);
      dropRef(el);
    },
    [dragRef, dropRef]
  );

  return (
    <div
      ref={composedRef}
      className="flex items-center gap-1.5 px-2.5 h-full cursor-pointer group relative select-none flex-shrink-0"
      style={{
        background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
        borderBottom: isActive ? "2px solid #00ff87" : "2px solid transparent",
        color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)",
        opacity: isDragging ? 0.3 : 1,
        fontSize: "12px",
        transition: "background 0.15s, color 0.15s, opacity 0.15s",
      }}
      onClick={() => switchTab(tab.id)}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
        setDropSide(null);
      }}
      onDoubleClick={() => pinTab(tab.id, !tab.isPinned)}
      onContextMenu={onContextMenu}
    >
      {/* 插入指示线 — 左侧 */}
      {isOver && dropSide === "left" && (
        <div
          className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full z-10"
          style={{ background: "#00ff87", boxShadow: "0 0 6px rgba(0,255,135,0.4)" }}
        />
      )}
      {/* 插入指示线 — 右侧 */}
      {isOver && dropSide === "right" && (
        <div
          className="absolute right-0 top-1 bottom-1 w-[2px] rounded-full z-10"
          style={{ background: "#00ff87", boxShadow: "0 0 6px rgba(0,255,135,0.4)" }}
        />
      )}

      <Icon size={12} className="flex-shrink-0" />
      <span className="truncate max-w-[100px]">{tab.title}</span>

      {/* 修改标记 */}
      {tab.isModified && (
        <Circle size={6} fill="currentColor" className="flex-shrink-0" style={{ color: "#ffb86c" }} />
      )}
      {tab.hasError && (
        <TriangleAlert size={10} className="flex-shrink-0" style={{ color: "#ff6b6b" }} />
      )}
      {tab.isPinned && (
        <Pin size={9} className="flex-shrink-0 opacity-40" />
      )}

      {/* 关闭按钮 */}
      {!tab.isPinned && (
        <button
          onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
          className="w-4 h-4 flex items-center justify-center rounded opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
};

/* ─── TabBar 容器 ─── */
export const TabBar: React.FC<{ panelId: string }> = ({ panelId }) => {
  const { panels, tabs, moveTab } = useLayoutStore();
  const panel = panels[panelId];
  const contextMenu = useContextMenu();
  if (!panel) return null;

  const panelTabs = panel.tabs.map((tid) => tabs[tid]).filter(Boolean);

  /* 面板级 drop（跨面板拖拽到空区域） */
  const [{ isOver }, dropRef] = useDrop({
    accept: DND_TAB,
    drop: (item: TabDragItem) => {
      if (item.panelId !== panelId) moveTab(item.tabId, panelId);
    },
    collect: (m) => ({ isOver: m.isOver() }),
  });

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      className="flex items-stretch overflow-x-auto h-[32px] min-h-[32px]"
      style={{
        background: isOver ? "rgba(0,255,135,0.03)" : "rgba(255,255,255,0.015)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        scrollbarWidth: "none",
        transition: "background 0.15s",
      }}
    >
      {panelTabs.map((tab, i) => (
        <TabItem
          key={tab.id}
          tab={tab}
          index={i}
          isActive={panel.activeTabId === tab.id}
          panelId={panelId}
          onContextMenu={(e) => contextMenu.show(e, tab.id, panelId)}
        />
      ))}
      <PanelContextMenu menu={contextMenu.menu} onClose={contextMenu.hide} />
    </div>
  );
};
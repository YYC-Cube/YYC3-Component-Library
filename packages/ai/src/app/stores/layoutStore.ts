/**
 * @file layoutStore.ts
 * @description 多联式面板布局 Zustand 状态管理 — 面板/Tab/布局/分割/持久化
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, layout, panel, tab, zustand, persistence
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */
export type PanelType =
  | "code-editor"
  | "file-browser"
  | "preview"
  | "terminal"
  | "ai-chat"
  | "debug"
  | "output"
  | "search"
  | "database"
  | "version-control"
  | "ai-provider"
  | "ai-monitor"
  | "plugin-manager"
  | "theme-editor"
  | "shortcut-editor"
  | "performance-monitor"
  | "dashboard"
  | "welcome"
  | "task-board";

export interface Tab {
  id: string;
  panelId: string;
  title: string;
  type: PanelType;
  isPinned: boolean;
  isModified: boolean;
  isUnsaved: boolean;
  hasError: boolean;
  meta?: Record<string, unknown>;
}

export interface PanelState {
  id: string;
  type: PanelType;
  title: string;
  tabs: string[]; // tab IDs
  activeTabId: string | null;
  isLocked: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
}

export type SplitDirection = "horizontal" | "vertical";

/**
 * 递归树结构表示嵌套分割
 * leaf => 单面板
 * split => 两个子节点 + 方向 + 比例
 */
export type LayoutNode =
  | { kind: "leaf"; panelId: string }
  | {
      kind: "split";
      direction: SplitDirection;
      ratio: number; // 0-100，第一个子节点的百分比
      first: LayoutNode;
      second: LayoutNode;
    };

export interface LayoutPreset {
  id: string;
  name: string;
  icon: string;
  tree: LayoutNode;
  panels: PanelState[];
  tabs: Tab[];
  createdAt: number;
}

/* ─── 面板类型元数据 ─── */
export const panelTypeMeta: Record<
  PanelType,
  { label: string; icon: string; defaultTitle: string }
> = {
  "code-editor": { label: "代码编辑器", icon: "Code", defaultTitle: "编辑器" },
  "file-browser": { label: "文件浏览器", icon: "FolderTree", defaultTitle: "文件" },
  preview: { label: "实时预览", icon: "Eye", defaultTitle: "预览" },
  terminal: { label: "终端", icon: "Terminal", defaultTitle: "终端" },
  "ai-chat": { label: "AI 聊天", icon: "Bot", defaultTitle: "AI 助手" },
  debug: { label: "调试", icon: "Bug", defaultTitle: "调试" },
  output: { label: "输出", icon: "FileOutput", defaultTitle: "输出" },
  search: { label: "搜索", icon: "Search", defaultTitle: "搜索" },
  database: { label: "数据库", icon: "Database", defaultTitle: "数据库" },
  "version-control": { label: "版本控制", icon: "GitBranch", defaultTitle: "Git" },
  "ai-provider": { label: "AI 服务", icon: "Bot", defaultTitle: "AI 服务" },
  "ai-monitor": { label: "AI 监控", icon: "Activity", defaultTitle: "AI 监控" },
  "plugin-manager": { label: "插件管理", icon: "Puzzle", defaultTitle: "插件" },
  "theme-editor": { label: "主题编辑器", icon: "Palette", defaultTitle: "主题" },
  "shortcut-editor": { label: "快捷键编辑器", icon: "Keyboard", defaultTitle: "快捷键" },
  "performance-monitor": { label: "性能监控", icon: "Gauge", defaultTitle: "性能" },
  dashboard: { label: "仪表盘", icon: "LayoutDashboard", defaultTitle: "仪表盘" },
  welcome: { label: "欢迎页面", icon: "House", defaultTitle: "欢迎" },
  "task-board": { label: "任务看板", icon: "ListTodo", defaultTitle: "任务" },
};

/* ─── Store 接口 ─── */
interface LayoutStore {
  /* ─── 状态 ─── */
  panels: Record<string, PanelState>;
  tabs: Record<string, Tab>;
  layoutTree: LayoutNode;
  activePanelId: string | null;
  savedLayouts: LayoutPreset[];
  activeLayoutId: string | null;
  sidebarCollapsed: boolean;

  /* ─── 面���管理 ─── */
  createPanel: (type: PanelType, title?: string) => string;
  removePanel: (panelId: string) => void;
  setActivePanel: (panelId: string) => void;
  lockPanel: (panelId: string, locked: boolean) => void;
  minimizePanel: (panelId: string, minimized: boolean) => void;
  maximizePanel: (panelId: string, maximized: boolean) => void;

  /* ─── 分割/合并 ─── */
  splitPanel: (panelId: string, direction: SplitDirection, newType: PanelType, position?: "before" | "after") => void;
  mergePanels: (sourceId: string, targetId: string) => void;

  /* ─── Tab 管理 ─── */
  createTab: (panelId: string, type: PanelType, title?: string) => string;
  closeTab: (tabId: string) => void;
  switchTab: (tabId: string) => void;
  pinTab: (tabId: string, pinned: boolean) => void;
  moveTab: (tabId: string, targetPanelId: string) => void;
  markTabModified: (tabId: string, modified: boolean) => void;
  reorderTabs: (panelId: string, fromIndex: number, toIndex: number) => void;

  /* ─── 布局持久化 ─── */
  saveLayout: (name: string) => void;
  loadLayout: (layoutId: string) => void;
  deleteLayout: (layoutId: string) => void;
  applyDefaultLayout: () => void;
  toggleSidebar: () => void;

  /* ─── 布局树更新 ─── */
  updateLayoutTree: (tree: LayoutNode) => void;

  /* ─── 布局导出/导入 ─── */
  exportLayout: () => string;
  importLayout: (json: string) => boolean;
}

/* ─── 辅助 ─── */
const uid = () => crypto.randomUUID().slice(0, 8);

/* 在布局树中替换某个 leaf */
function replaceLeaf(
  node: LayoutNode,
  targetPanelId: string,
  replacement: LayoutNode
): LayoutNode {
  if (node.kind === "leaf") {
    return node.panelId === targetPanelId ? replacement : node;
  }
  return {
    ...node,
    first: replaceLeaf(node.first, targetPanelId, replacement),
    second: replaceLeaf(node.second, targetPanelId, replacement),
  };
}

/* 从布局树中移除面板，并用其兄弟节点替换父分割 */
function removeFromTree(node: LayoutNode, panelId: string): LayoutNode | null {
  if (node.kind === "leaf") {
    return node.panelId === panelId ? null : node;
  }
  if (node.first.kind === "leaf" && node.first.panelId === panelId) return node.second;
  if (node.second.kind === "leaf" && node.second.panelId === panelId) return node.first;
  const newFirst = removeFromTree(node.first, panelId);
  const newSecond = removeFromTree(node.second, panelId);
  if (!newFirst) return newSecond;
  if (!newSecond) return newFirst;
  return { ...node, first: newFirst, second: newSecond };
}

/* 收集所有 leaf panelId */
function collectPanelIds(node: LayoutNode): string[] {
  if (node.kind === "leaf") return [node.panelId];
  return [...collectPanelIds(node.first), ...collectPanelIds(node.second)];
}

/* ─── 默认布局 ─── */
function createDefaultLayout(): {
  panels: Record<string, PanelState>;
  tabs: Record<string, Tab>;
  tree: LayoutNode;
} {
  const filePanelId = "panel-files";
  const editorPanelId = "panel-editor";
  const previewPanelId = "panel-preview";
  const terminalPanelId = "panel-terminal";
  const aiPanelId = "panel-ai";

  const tabs: Record<string, Tab> = {
    "tab-files": {
      id: "tab-files", panelId: filePanelId, title: "文件", type: "file-browser",
      isPinned: true, isModified: false, isUnsaved: false, hasError: false,
    },
    "tab-editor-main": {
      id: "tab-editor-main", panelId: editorPanelId, title: "App.tsx", type: "code-editor",
      isPinned: false, isModified: false, isUnsaved: false, hasError: false,
      meta: { language: "typescript", filePath: "/src/app/App.tsx" },
    },
    "tab-editor-style": {
      id: "tab-editor-style", panelId: editorPanelId, title: "theme.css", type: "code-editor",
      isPinned: false, isModified: false, isUnsaved: false, hasError: false,
      meta: { language: "css", filePath: "/src/styles/theme.css" },
    },
    "tab-preview": {
      id: "tab-preview", panelId: previewPanelId, title: "预览", type: "preview",
      isPinned: true, isModified: false, isUnsaved: false, hasError: false,
    },
    "tab-terminal": {
      id: "tab-terminal", panelId: terminalPanelId, title: "终端", type: "terminal",
      isPinned: true, isModified: false, isUnsaved: false, hasError: false,
    },
    "tab-ai": {
      id: "tab-ai", panelId: aiPanelId, title: "AI 助手", type: "ai-chat",
      isPinned: true, isModified: false, isUnsaved: false, hasError: false,
    },
  };

  const panels: Record<string, PanelState> = {
    [filePanelId]: {
      id: filePanelId, type: "file-browser", title: "文件",
      tabs: ["tab-files"], activeTabId: "tab-files",
      isLocked: false, isMinimized: false, isMaximized: false,
    },
    [editorPanelId]: {
      id: editorPanelId, type: "code-editor", title: "编辑器",
      tabs: ["tab-editor-main", "tab-editor-style"], activeTabId: "tab-editor-main",
      isLocked: false, isMinimized: false, isMaximized: false,
    },
    [previewPanelId]: {
      id: previewPanelId, type: "preview", title: "预览",
      tabs: ["tab-preview"], activeTabId: "tab-preview",
      isLocked: false, isMinimized: false, isMaximized: false,
    },
    [terminalPanelId]: {
      id: terminalPanelId, type: "terminal", title: "终端",
      tabs: ["tab-terminal"], activeTabId: "tab-terminal",
      isLocked: false, isMinimized: false, isMaximized: false,
    },
    [aiPanelId]: {
      id: aiPanelId, type: "ai-chat", title: "AI 助手",
      tabs: ["tab-ai"], activeTabId: "tab-ai",
      isLocked: false, isMinimized: false, isMaximized: false,
    },
  };

  // 经典 IDE 布局:
  // 左侧文件浏览器 | 中间编辑器+终端(上下分) | 右侧预览+AI(上下分)
  const tree: LayoutNode = {
    kind: "split",
    direction: "horizontal",
    ratio: 18,
    first: { kind: "leaf", panelId: filePanelId },
    second: {
      kind: "split",
      direction: "horizontal",
      ratio: 55,
      first: {
        kind: "split",
        direction: "vertical",
        ratio: 68,
        first: { kind: "leaf", panelId: editorPanelId },
        second: { kind: "leaf", panelId: terminalPanelId },
      },
      second: {
        kind: "split",
        direction: "vertical",
        ratio: 55,
        first: { kind: "leaf", panelId: previewPanelId },
        second: { kind: "leaf", panelId: aiPanelId },
      },
    },
  };

  return { panels, tabs, tree };
}

/* ─── Store 实现 ─── */
const defaultLayout = createDefaultLayout();

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set, get) => ({
      panels: defaultLayout.panels,
      tabs: defaultLayout.tabs,
      layoutTree: defaultLayout.tree,
      activePanelId: "panel-editor",
      savedLayouts: [],
      activeLayoutId: null,
      sidebarCollapsed: false,

      /* ─── 面板管理 ─── */
      createPanel: (type, title) => {
        const id = `panel-${uid()}`;
        const tabId = `tab-${uid()}`;
        const meta = panelTypeMeta[type];
        const tab: Tab = {
          id: tabId, panelId: id, title: title || meta.defaultTitle, type,
          isPinned: false, isModified: false, isUnsaved: false, hasError: false,
        };
        const panel: PanelState = {
          id, type, title: title || meta.defaultTitle,
          tabs: [tabId], activeTabId: tabId,
          isLocked: false, isMinimized: false, isMaximized: false,
        };
        set((s) => ({
          panels: { ...s.panels, [id]: panel },
          tabs: { ...s.tabs, [tabId]: tab },
          activePanelId: id,
        }));
        return id;
      },

      removePanel: (panelId) => {
        const state = get();
        const panel = state.panels[panelId];
        if (!panel) return;
        const allPanelIds = collectPanelIds(state.layoutTree);
        if (allPanelIds.length <= 1) return; // 至少保留一个面板

        const newTree = removeFromTree(state.layoutTree, panelId);
        if (!newTree) return;

        const newPanels = { ...state.panels };
        delete newPanels[panelId];
        const newTabs = { ...state.tabs };
        panel.tabs.forEach((tid) => delete newTabs[tid]);

        set({
          panels: newPanels,
          tabs: newTabs,
          layoutTree: newTree,
          activePanelId: state.activePanelId === panelId
            ? collectPanelIds(newTree)[0] || null
            : state.activePanelId,
        });
      },

      setActivePanel: (panelId) => set({ activePanelId: panelId }),

      lockPanel: (panelId, locked) =>
        set((s) => ({
          panels: { ...s.panels, [panelId]: { ...s.panels[panelId], isLocked: locked } },
        })),

      minimizePanel: (panelId, minimized) =>
        set((s) => ({
          panels: { ...s.panels, [panelId]: { ...s.panels[panelId], isMinimized: minimized } },
        })),

      maximizePanel: (panelId, maximized) =>
        set((s) => ({
          panels: { ...s.panels, [panelId]: { ...s.panels[panelId], isMaximized: maximized } },
        })),

      /* ─── 分割/合并 ─── */
      splitPanel: (panelId, direction, newType, position = "after") => {
        const state = get();
        const newPanelId = state.createPanel(newType);
        const replacement: LayoutNode = position === "before"
          ? {
              kind: "split",
              direction,
              ratio: 50,
              first: { kind: "leaf", panelId: newPanelId },
              second: { kind: "leaf", panelId },
            }
          : {
              kind: "split",
              direction,
              ratio: 50,
              first: { kind: "leaf", panelId },
              second: { kind: "leaf", panelId: newPanelId },
            };
        set((s) => ({
          layoutTree: replaceLeaf(s.layoutTree, panelId, replacement),
        }));
      },

      mergePanels: (sourceId, targetId) => {
        const state = get();
        const source = state.panels[sourceId];
        const target = state.panels[targetId];
        if (!source || !target) return;

        // 将 source 的所有 tab 移动到 target
        const movedTabs = { ...state.tabs };
        source.tabs.forEach((tid) => {
          if (movedTabs[tid]) movedTabs[tid] = { ...movedTabs[tid], panelId: targetId };
        });

        const newTarget = {
          ...target,
          tabs: [...target.tabs, ...source.tabs],
        };

        const newPanels = { ...state.panels, [targetId]: newTarget };
        delete newPanels[sourceId];

        const newTree = removeFromTree(state.layoutTree, sourceId) || state.layoutTree;

        set({
          panels: newPanels,
          tabs: movedTabs,
          layoutTree: newTree,
          activePanelId: targetId,
        });
      },

      /* ─── Tab 管理 ─── */
      createTab: (panelId, type, title) => {
        const id = `tab-${uid()}`;
        const meta = panelTypeMeta[type];
        const tab: Tab = {
          id, panelId, title: title || meta.defaultTitle, type,
          isPinned: false, isModified: false, isUnsaved: false, hasError: false,
        };
        set((s) => ({
          tabs: { ...s.tabs, [id]: tab },
          panels: {
            ...s.panels,
            [panelId]: {
              ...s.panels[panelId],
              tabs: [...s.panels[panelId].tabs, id],
              activeTabId: id,
            },
          },
        }));
        return id;
      },

      closeTab: (tabId) => {
        const state = get();
        const tab = state.tabs[tabId];
        if (!tab || tab.isPinned) return;

        const panel = state.panels[tab.panelId];
        if (!panel) return;

        const newTabIds = panel.tabs.filter((t) => t !== tabId);
        if (newTabIds.length === 0) {
          // 关闭面板
          state.removePanel(tab.panelId);
          return;
        }

        const newActiveTab =
          panel.activeTabId === tabId
            ? newTabIds[Math.max(0, panel.tabs.indexOf(tabId) - 1)] || newTabIds[0]
            : panel.activeTabId;

        const newTabs = { ...state.tabs };
        delete newTabs[tabId];

        set({
          tabs: newTabs,
          panels: {
            ...state.panels,
            [tab.panelId]: { ...panel, tabs: newTabIds, activeTabId: newActiveTab },
          },
        });
      },

      switchTab: (tabId) => {
        const state = get();
        const tab = state.tabs[tabId];
        if (!tab) return;
        set((s) => ({
          panels: {
            ...s.panels,
            [tab.panelId]: { ...s.panels[tab.panelId], activeTabId: tabId },
          },
          activePanelId: tab.panelId,
        }));
      },

      pinTab: (tabId, pinned) =>
        set((s) => ({
          tabs: { ...s.tabs, [tabId]: { ...s.tabs[tabId], isPinned: pinned } },
        })),

      moveTab: (tabId, targetPanelId) => {
        const state = get();
        const tab = state.tabs[tabId];
        if (!tab || tab.panelId === targetPanelId) return;

        const sourcePanel = state.panels[tab.panelId];
        const targetPanel = state.panels[targetPanelId];
        if (!sourcePanel || !targetPanel) return;

        const sourceTabs = sourcePanel.tabs.filter((t) => t !== tabId);
        const targetTabs = [...targetPanel.tabs, tabId];

        const newPanels = { ...state.panels };

        if (sourceTabs.length === 0) {
          // Source panel 变空, 删除它
          delete newPanels[tab.panelId];
          const newTree = removeFromTree(state.layoutTree, tab.panelId) || state.layoutTree;
          newPanels[targetPanelId] = { ...targetPanel, tabs: targetTabs, activeTabId: tabId };
          set({
            panels: newPanels,
            tabs: { ...state.tabs, [tabId]: { ...tab, panelId: targetPanelId } },
            layoutTree: newTree,
            activePanelId: targetPanelId,
          });
        } else {
          newPanels[tab.panelId] = {
            ...sourcePanel,
            tabs: sourceTabs,
            activeTabId: sourcePanel.activeTabId === tabId ? sourceTabs[0] : sourcePanel.activeTabId,
          };
          newPanels[targetPanelId] = { ...targetPanel, tabs: targetTabs, activeTabId: tabId };
          set({
            panels: newPanels,
            tabs: { ...state.tabs, [tabId]: { ...tab, panelId: targetPanelId } },
            activePanelId: targetPanelId,
          });
        }
      },

      markTabModified: (tabId, modified) =>
        set((s) => ({
          tabs: { ...s.tabs, [tabId]: { ...s.tabs[tabId], isModified: modified, isUnsaved: modified } },
        })),

      reorderTabs: (panelId, fromIndex, toIndex) => {
        const state = get();
        const panel = state.panels[panelId];
        if (!panel) return;

        const tabs = [...panel.tabs];
        const [movedTab] = tabs.splice(fromIndex, 1);
        tabs.splice(toIndex, 0, movedTab);

        set((s) => ({
          panels: {
            ...s.panels,
            [panelId]: { ...panel, tabs },
          },
        }));
      },

      /* ─── 布局持久化 ─── */
      saveLayout: (name) => {
        const state = get();
        const preset: LayoutPreset = {
          id: `layout-${uid()}`,
          name,
          icon: "LayoutDashboard",
          tree: state.layoutTree,
          panels: Object.values(state.panels),
          tabs: Object.values(state.tabs),
          createdAt: Date.now(),
        };
        set((s) => ({
          savedLayouts: [...s.savedLayouts, preset],
          activeLayoutId: preset.id,
        }));
      },

      loadLayout: (layoutId) => {
        const state = get();
        const layout = state.savedLayouts.find((l) => l.id === layoutId);
        if (!layout) return;
        const panels: Record<string, PanelState> = {};
        layout.panels.forEach((p) => (panels[p.id] = p));
        const tabs: Record<string, Tab> = {};
        layout.tabs.forEach((t) => (tabs[t.id] = t));
        set({
          panels,
          tabs,
          layoutTree: layout.tree,
          activeLayoutId: layoutId,
          activePanelId: collectPanelIds(layout.tree)[0] || null,
        });
      },

      deleteLayout: (layoutId) =>
        set((s) => ({
          savedLayouts: s.savedLayouts.filter((l) => l.id !== layoutId),
          activeLayoutId: s.activeLayoutId === layoutId ? null : s.activeLayoutId,
        })),

      applyDefaultLayout: () => {
        const d = createDefaultLayout();
        set({
          panels: d.panels,
          tabs: d.tabs,
          layoutTree: d.tree,
          activePanelId: "panel-editor",
          activeLayoutId: null,
        });
      },

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      updateLayoutTree: (tree) => set({ layoutTree: tree }),

      /* ─── 布局导出/导入 ─── */
      exportLayout: () => {
        const state = get();
        const exportData = {
          version: "1.0.0",
          type: "yyc3-layout",
          timestamp: Date.now(),
          panels: state.panels,
          tabs: state.tabs,
          layoutTree: state.layoutTree,
          activePanelId: state.activePanelId,
          sidebarCollapsed: state.sidebarCollapsed,
        };
        return JSON.stringify(exportData, null, 2);
      },

      importLayout: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.type !== "yyc3-layout" || !data.panels || !data.tabs || !data.layoutTree) {
            return false;
          }
          set({
            panels: data.panels,
            tabs: data.tabs,
            layoutTree: data.layoutTree,
            activePanelId: data.activePanelId || collectPanelIds(data.layoutTree)[0] || null,
            sidebarCollapsed: data.sidebarCollapsed ?? false,
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "yyc3-layout",
      partialize: (state) => ({
        panels: state.panels,
        tabs: state.tabs,
        layoutTree: state.layoutTree,
        activePanelId: state.activePanelId,
        savedLayouts: state.savedLayouts,
        activeLayoutId: state.activeLayoutId,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
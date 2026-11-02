/**
 * @file quickActionsStore.ts
 * @description 智能一键操作状态管理 — 操作类型/状态/剪贴板历史/上下文感知/批量操作
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, quick-actions, clipboard, context, zustand
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */

export type ActionType =
  | "copy"
  | "copy-markdown"
  | "copy-html"
  | "replace"
  | "refactor"
  | "optimize"
  | "format"
  | "convert"
  | "summarize"
  | "translate"
  | "rewrite"
  | "expand"
  | "correct"
  | "explain"
  | "comment"
  | "find-issues"
  | "test-generate"
  | "document-generate";

export type ActionTarget = "code" | "text" | "document" | "file";
export type ActionStatus = "idle" | "processing" | "success" | "error";

export interface ActionContext {
  selection: {
    text: string;
    startLine?: number;
    endLine?: number;
    startColumn?: number;
    endColumn?: number;
  };
  file?: {
    path: string;
    name: string;
    language: string;
    content: string;
  };
  editor?: {
    cursorPosition: { line: number; column: number };
  };
}

export interface ActionDefinition {
  id: string;
  type: ActionType;
  target: ActionTarget;
  title: string;
  description: string;
  icon: string;
  shortcut?: string;
  requiresAI: boolean;
  group: "code" | "document" | "text" | "ai";
}

export interface ActionExecution {
  id: string;
  actionType: ActionType;
  status: ActionStatus;
  input: string;
  result?: string;
  error?: string;
  startedAt: number;
  completedAt?: number;
  duration?: number;
}

export interface ClipboardHistoryItem {
  id: string;
  content: string;
  type: "text" | "code" | "image";
  copiedAt: number;
  sourceFile?: string;
  language?: string;
  size: number;
  format?: string;
}

/* ─── 预置操作定义 ─── */

export const ACTION_DEFINITIONS: ActionDefinition[] = [
  // 代码操作组
  { id: "copy-code", type: "copy", target: "code", title: "qa.copy", description: "qa.copyDesc", icon: "Copy", requiresAI: false, group: "code" },
  { id: "copy-markdown", type: "copy-markdown", target: "code", title: "qa.copyMarkdown", description: "qa.copyMarkdownDesc", icon: "FileText", requiresAI: false, group: "code" },
  { id: "copy-html", type: "copy-html", target: "code", title: "qa.copyHTML", description: "qa.copyHTMLDesc", icon: "Code", requiresAI: false, group: "code" },
  { id: "format-code", type: "format", target: "code", title: "qa.format", description: "qa.formatDesc", icon: "AlignLeft", shortcut: "Mod+Shift+F", requiresAI: false, group: "code" },
  { id: "refactor-code", type: "refactor", target: "code", title: "qa.refactor", description: "qa.refactorDesc", icon: "RefreshCw", requiresAI: true, group: "code" },
  { id: "optimize-code", type: "optimize", target: "code", title: "qa.optimize", description: "qa.optimizeDesc", icon: "Zap", requiresAI: true, group: "code" },

  // AI 辅助操作组
  { id: "explain-code", type: "explain", target: "code", title: "qa.explain", description: "qa.explainDesc", icon: "BookOpen", shortcut: "Mod+Shift+E", requiresAI: true, group: "ai" },
  { id: "add-comments", type: "comment", target: "code", title: "qa.comment", description: "qa.commentDesc", icon: "MessageSquare", requiresAI: true, group: "ai" },
  { id: "find-issues", type: "find-issues", target: "code", title: "qa.findIssues", description: "qa.findIssuesDesc", icon: "Bug", requiresAI: true, group: "ai" },
  { id: "generate-tests", type: "test-generate", target: "code", title: "qa.genTests", description: "qa.genTestsDesc", icon: "TestTube", requiresAI: true, group: "ai" },
  { id: "generate-docs", type: "document-generate", target: "code", title: "qa.genDocs", description: "qa.genDocsDesc", icon: "FileCode", requiresAI: true, group: "ai" },

  // 文本操作组
  { id: "translate-text", type: "translate", target: "text", title: "qa.translate", description: "qa.translateDesc", icon: "Languages", requiresAI: true, group: "text" },
  { id: "rewrite-text", type: "rewrite", target: "text", title: "qa.rewrite", description: "qa.rewriteDesc", icon: "Pencil", requiresAI: true, group: "text" },
  { id: "expand-text", type: "expand", target: "text", title: "qa.expand", description: "qa.expandDesc", icon: "Maximize2", requiresAI: true, group: "text" },
  { id: "correct-text", type: "correct", target: "text", title: "qa.correct", description: "qa.correctDesc", icon: "SpellCheck", requiresAI: true, group: "text" },

  // 文档操作组
  { id: "summarize-doc", type: "summarize", target: "document", title: "qa.summarize", description: "qa.summarizeDesc", icon: "ListCollapse", requiresAI: true, group: "document" },
  { id: "convert-doc", type: "convert", target: "document", title: "qa.convert", description: "qa.convertDesc", icon: "ArrowRightLeft", requiresAI: true, group: "document" },
];

/* ─── Store ─── */

interface QuickActionsState {
  /* 工具栏 */
  isToolbarVisible: boolean;
  toolbarPosition: { x: number; y: number };
  activeGroup: "code" | "document" | "text" | "ai" | "all";

  /* 当前上下文 */
  context: ActionContext | null;

  /* 执行状态 */
  currentExecution: ActionExecution | null;
  executionHistory: ActionExecution[];

  /* 剪贴板历史 */
  clipboardHistory: ClipboardHistoryItem[];
  isClipboardPanelOpen: boolean;

  /* 结果面板 */
  resultContent: string | null;
  resultTitle: string | null;
  isResultPanelOpen: boolean;

  /* 操作 */
  showToolbar: (position: { x: number; y: number }, context: ActionContext) => void;
  hideToolbar: () => void;
  setActiveGroup: (group: "code" | "document" | "text" | "ai" | "all") => void;
  setContext: (ctx: ActionContext | null) => void;

  startExecution: (actionType: ActionType, input: string) => string;
  completeExecution: (execId: string, result: string) => void;
  failExecution: (execId: string, error: string) => void;

  addClipboardItem: (item: Omit<ClipboardHistoryItem, "id" | "copiedAt" | "size">) => void;
  removeClipboardItem: (id: string) => void;
  clearClipboardHistory: () => void;
  toggleClipboardPanel: () => void;

  showResult: (title: string, content: string) => void;
  hideResult: () => void;
}

export const useQuickActionsStore = create<QuickActionsState>()(
  persist(
    (set, get) => ({
      isToolbarVisible: false,
      toolbarPosition: { x: 0, y: 0 },
      activeGroup: "all",
      context: null,
      currentExecution: null,
      executionHistory: [],
      clipboardHistory: [],
      isClipboardPanelOpen: false,
      resultContent: null,
      resultTitle: null,
      isResultPanelOpen: false,

      showToolbar: (position, context) =>
        set({ isToolbarVisible: true, toolbarPosition: position, context }),

      hideToolbar: () => set({ isToolbarVisible: false }),

      setActiveGroup: (group) => set({ activeGroup: group }),

      setContext: (ctx) => set({ context: ctx }),

      startExecution: (actionType, input) => {
        const execId = `exec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const execution: ActionExecution = {
          id: execId,
          actionType,
          status: "processing",
          input,
          startedAt: Date.now(),
        };
        set({ currentExecution: execution });
        return execId;
      },

      completeExecution: (execId, result) => {
        const { currentExecution, executionHistory } = get();
        if (currentExecution?.id === execId) {
          const completed: ActionExecution = {
            ...currentExecution,
            status: "success",
            result,
            completedAt: Date.now(),
            duration: Date.now() - currentExecution.startedAt,
          };
          set({
            currentExecution: null,
            executionHistory: [completed, ...executionHistory].slice(0, 100),
          });
        }
      },

      failExecution: (execId, error) => {
        const { currentExecution, executionHistory } = get();
        if (currentExecution?.id === execId) {
          const failed: ActionExecution = {
            ...currentExecution,
            status: "error",
            error,
            completedAt: Date.now(),
            duration: Date.now() - currentExecution.startedAt,
          };
          set({
            currentExecution: null,
            executionHistory: [failed, ...executionHistory].slice(0, 100),
          });
        }
      },

      addClipboardItem: (item) => {
        const newItem: ClipboardHistoryItem = {
          ...item,
          id: `clip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          copiedAt: Date.now(),
          size: item.content.length,
        };
        set((s) => ({
          clipboardHistory: [newItem, ...s.clipboardHistory].slice(0, 50),
        }));
      },

      removeClipboardItem: (id) =>
        set((s) => ({
          clipboardHistory: s.clipboardHistory.filter((c) => c.id !== id),
        })),

      clearClipboardHistory: () => set({ clipboardHistory: [] }),
      toggleClipboardPanel: () =>
        set((s) => ({ isClipboardPanelOpen: !s.isClipboardPanelOpen })),

      showResult: (title, content) =>
        set({ resultTitle: title, resultContent: content, isResultPanelOpen: true }),

      hideResult: () =>
        set({ resultContent: null, resultTitle: null, isResultPanelOpen: false }),
    }),
    {
      name: "yyc3-quick-actions",
      partialize: (state) => ({
        clipboardHistory: state.clipboardHistory,
        executionHistory: state.executionHistory.slice(0, 20),
      }),
    }
  )
);

/**
 * @file sessionStore.ts
 * @description 工作区会话恢复系统 — 自动保存/恢复面板状态/光标位置/滚动位置/通知提示
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, session, restore, persistence, auto-save
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */

/** 编辑器光标/滚动快照 */
export interface EditorSnapshot {
  filePath: string;
  cursorLine: number;
  cursorColumn: number;
  scrollTop: number;
  scrollLeft: number;
  selections?: { startLine: number; startCol: number; endLine: number; endCol: number }[];
}

/** 会话快照 */
export interface SessionSnapshot {
  id: string;
  timestamp: number;
  activePanelId: string | null;
  editorSnapshots: Record<string, EditorSnapshot>;
  sidebarCollapsed: boolean;
  openFiles: string[];
  activeFile: string | null;
  lastRoute: string;
  windowSize: { width: number; height: number };
}

/* ─── Store 接口 ─── */
interface SessionStore {
  /* 状态 */
  currentSession: SessionSnapshot | null;
  sessionHistory: SessionSnapshot[];
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // ms
  maxSessionHistory: number;
  lastSavedAt: number | null;
  sessionRestored: boolean;
  showRestoreBanner: boolean;

  /* 操作 */
  saveSession: (snapshot: Partial<SessionSnapshot>) => void;
  restoreSession: () => SessionSnapshot | null;
  clearSession: () => void;
  setAutoSave: (enabled: boolean) => void;
  setAutoSaveInterval: (interval: number) => void;

  /* 编辑器快照 */
  saveEditorSnapshot: (tabId: string, snapshot: EditorSnapshot) => void;
  getEditorSnapshot: (tabId: string) => EditorSnapshot | null;

  /* UI 控制 */
  dismissRestoreBanner: () => void;
  markSessionRestored: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessionHistory: [],
      autoSaveEnabled: true,
      autoSaveInterval: 30000, // 30s
      maxSessionHistory: 10,
      lastSavedAt: null,
      sessionRestored: false,
      showRestoreBanner: false,

      saveSession: (partial) => {
        const prev = get().currentSession;
        const snapshot: SessionSnapshot = {
          id: `session-${Date.now().toString(36)}`,
          timestamp: Date.now(),
          activePanelId: partial.activePanelId ?? prev?.activePanelId ?? null,
          editorSnapshots: {
            ...(prev?.editorSnapshots || {}),
            ...(partial.editorSnapshots || {}),
          },
          sidebarCollapsed: partial.sidebarCollapsed ?? prev?.sidebarCollapsed ?? false,
          openFiles: partial.openFiles ?? prev?.openFiles ?? [],
          activeFile: partial.activeFile ?? prev?.activeFile ?? null,
          lastRoute: partial.lastRoute ?? prev?.lastRoute ?? "/",
          windowSize: partial.windowSize ?? prev?.windowSize ?? {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        };

        const history = [snapshot, ...get().sessionHistory].slice(0, get().maxSessionHistory);

        set({
          currentSession: snapshot,
          sessionHistory: history,
          lastSavedAt: Date.now(),
        });
      },

      restoreSession: () => {
        const session = get().currentSession;
        if (session) {
          set({ showRestoreBanner: true, sessionRestored: true });
        }
        return session;
      },

      clearSession: () => {
        set({
          currentSession: null,
          sessionHistory: [],
          lastSavedAt: null,
          sessionRestored: false,
          showRestoreBanner: false,
        });
      },

      setAutoSave: (enabled) => set({ autoSaveEnabled: enabled }),
      setAutoSaveInterval: (interval) => set({ autoSaveInterval: interval }),

      saveEditorSnapshot: (tabId, snapshot) => {
        const prev = get().currentSession;
        const editorSnapshots = {
          ...(prev?.editorSnapshots || {}),
          [tabId]: snapshot,
        };
        get().saveSession({ editorSnapshots });
      },

      getEditorSnapshot: (tabId) => {
        return get().currentSession?.editorSnapshots[tabId] ?? null;
      },

      dismissRestoreBanner: () => set({ showRestoreBanner: false }),
      markSessionRestored: () => set({ sessionRestored: true, showRestoreBanner: false }),
    }),
    {
      name: "yyc3-session",
      partialize: (state) => ({
        currentSession: state.currentSession,
        sessionHistory: state.sessionHistory,
        autoSaveEnabled: state.autoSaveEnabled,
        autoSaveInterval: state.autoSaveInterval,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);

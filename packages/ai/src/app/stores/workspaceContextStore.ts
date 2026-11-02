/**
 * @file workspaceContextStore.ts
 * @description 工作区上下文持久化 — 打开文件列表、光标位置、滚动状态、编辑器会话恢复
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, workspace, context, session, persistence, restore
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */
export interface FileSession {
  /** 文件路径 */
  filePath: string;
  /** 文件名 */
  fileName: string;
  /** 语言类型 */
  language: string;
  /** 光标位置 */
  cursor: { line: number; column: number };
  /** 滚动位置 */
  scrollTop: number;
  /** 选区范围 */
  selection?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
  /** 折叠的行 */
  foldedRanges: number[];
  /** 是否有未保存修改 */
  isDirty: boolean;
  /** 上次打开时间 */
  lastOpenedAt: number;
  /** 编辑时长 (ms) */
  editDuration: number;
  /** 所在面板 ID */
  panelId?: string;
  /** 所在 Tab ID */
  tabId?: string;
  /** 编码格式 */
  encoding: string;
  /** 行结束符 */
  lineEnding: "LF" | "CRLF";
  /** 缩进模式 */
  indentMode: "spaces" | "tabs";
  /** 缩进大小 */
  indentSize: number;
}

export interface WorkspaceSession {
  /** 会话 ID */
  id: string;
  /** 工作区名称 */
  name: string;
  /** 打开的文件列表 */
  openFiles: FileSession[];
  /** 当前激活文件 */
  activeFilePath: string | null;
  /** 最近访问文件 (最多 20 个) */
  recentFiles: string[];
  /** 侧边栏宽度 */
  sidebarWidth: number;
  /** 底部面板高度 */
  bottomPanelHeight: number;
  /** 创建时间 */
  createdAt: number;
  /** 最后更新 */
  updatedAt: number;
}

export interface EditorViewState {
  filePath: string;
  scrollTop: number;
  scrollLeft: number;
  cursorLine: number;
  cursorColumn: number;
  viewZoneIds: string[];
}

/* ─── 模拟初始文件会话 ─── */
const mockOpenFiles: FileSession[] = [
  {
    filePath: "/src/app/App.tsx",
    fileName: "App.tsx",
    language: "typescriptreact",
    cursor: { line: 1, column: 1 },
    scrollTop: 0,
    foldedRanges: [],
    isDirty: false,
    lastOpenedAt: Date.now() - 3600000,
    editDuration: 1200000,
    encoding: "UTF-8",
    lineEnding: "LF",
    indentMode: "spaces",
    indentSize: 2,
  },
  {
    filePath: "/src/app/stores/layoutStore.ts",
    fileName: "layoutStore.ts",
    language: "typescript",
    cursor: { line: 45, column: 12 },
    scrollTop: 820,
    foldedRanges: [10, 30],
    isDirty: true,
    lastOpenedAt: Date.now() - 1800000,
    editDuration: 600000,
    encoding: "UTF-8",
    lineEnding: "LF",
    indentMode: "spaces",
    indentSize: 2,
  },
  {
    filePath: "/src/app/components/panels/PanelView.tsx",
    fileName: "PanelView.tsx",
    language: "typescriptreact",
    cursor: { line: 78, column: 4 },
    scrollTop: 1400,
    foldedRanges: [],
    isDirty: false,
    lastOpenedAt: Date.now() - 900000,
    editDuration: 300000,
    encoding: "UTF-8",
    lineEnding: "LF",
    indentMode: "spaces",
    indentSize: 2,
  },
];

/* ─── Store 接口 ─── */
interface WorkspaceContextStore {
  /* 状态 */
  currentSession: WorkspaceSession;
  editorViewStates: Record<string, EditorViewState>;

  /* 文件会话 */
  openFile: (file: Partial<FileSession> & { filePath: string; fileName: string }) => void;
  closeFile: (filePath: string) => void;
  setActiveFile: (filePath: string) => void;
  updateFileSession: (filePath: string, updates: Partial<FileSession>) => void;
  updateCursor: (filePath: string, line: number, column: number) => void;
  updateScroll: (filePath: string, scrollTop: number) => void;
  markDirty: (filePath: string, isDirty: boolean) => void;

  /* 编辑器视图 */
  saveEditorViewState: (filePath: string, state: EditorViewState) => void;
  getEditorViewState: (filePath: string) => EditorViewState | null;

  /* 最近文件 */
  addRecentFile: (filePath: string) => void;
  clearRecentFiles: () => void;
  getRecentFiles: () => string[];

  /* 会话管理 */
  saveSession: () => void;
  restoreSession: () => void;
  clearSession: () => void;

  /* 查询 */
  getOpenFiles: () => FileSession[];
  getActiveFile: () => FileSession | null;
  getDirtyFiles: () => FileSession[];
  getFileByPath: (filePath: string) => FileSession | null;
}

const createDefaultSession = (): WorkspaceSession => ({
  id: `session-${Date.now()}`,
  name: "默认工作区",
  openFiles: mockOpenFiles,
  activeFilePath: "/src/app/App.tsx",
  recentFiles: [
    "/src/app/App.tsx",
    "/src/app/stores/layoutStore.ts",
    "/src/app/components/panels/PanelView.tsx",
    "/src/app/pages/LayoutDesignerPage.tsx",
    "/src/app/stores/themeStore.ts",
  ],
  sidebarWidth: 260,
  bottomPanelHeight: 200,
  createdAt: Date.now() - 7200000,
  updatedAt: Date.now(),
});

export const useWorkspaceContextStore = create<WorkspaceContextStore>()(
  persist(
    (set, get) => ({
      currentSession: createDefaultSession(),
      editorViewStates: {},

      /* 文件会话 */
      openFile: (file) => {
        set((s) => {
          const existing = s.currentSession.openFiles.find((f) => f.filePath === file.filePath);
          if (existing) {
            return {
              currentSession: {
                ...s.currentSession,
                activeFilePath: file.filePath,
                updatedAt: Date.now(),
              },
            };
          }
          const newFile: FileSession = {
            language: file.language || "plaintext",
            cursor: file.cursor || { line: 1, column: 1 },
            scrollTop: file.scrollTop || 0,
            foldedRanges: file.foldedRanges || [],
            isDirty: file.isDirty || false,
            lastOpenedAt: Date.now(),
            editDuration: 0,
            encoding: file.encoding || "UTF-8",
            lineEnding: file.lineEnding || "LF",
            indentMode: file.indentMode || "spaces",
            indentSize: file.indentSize || 2,
            ...file,
          };
          return {
            currentSession: {
              ...s.currentSession,
              openFiles: [...s.currentSession.openFiles, newFile],
              activeFilePath: file.filePath,
              updatedAt: Date.now(),
            },
          };
        });
        get().addRecentFile(file.filePath);
      },

      closeFile: (filePath) => {
        set((s) => {
          const files = s.currentSession.openFiles.filter((f) => f.filePath !== filePath);
          let activeFilePath = s.currentSession.activeFilePath;
          if (activeFilePath === filePath) {
            activeFilePath = files.length > 0 ? files[files.length - 1].filePath : null;
          }
          return {
            currentSession: {
              ...s.currentSession,
              openFiles: files,
              activeFilePath,
              updatedAt: Date.now(),
            },
          };
        });
      },

      setActiveFile: (filePath) => {
        set((s) => ({
          currentSession: {
            ...s.currentSession,
            activeFilePath: filePath,
            updatedAt: Date.now(),
          },
        }));
        get().addRecentFile(filePath);
      },

      updateFileSession: (filePath, updates) => {
        set((s) => ({
          currentSession: {
            ...s.currentSession,
            openFiles: s.currentSession.openFiles.map((f) =>
              f.filePath === filePath ? { ...f, ...updates } : f
            ),
            updatedAt: Date.now(),
          },
        }));
      },

      updateCursor: (filePath, line, column) => {
        get().updateFileSession(filePath, { cursor: { line, column } });
      },

      updateScroll: (filePath, scrollTop) => {
        get().updateFileSession(filePath, { scrollTop });
      },

      markDirty: (filePath, isDirty) => {
        get().updateFileSession(filePath, { isDirty });
      },

      /* 编辑器视图 */
      saveEditorViewState: (filePath, state) => {
        set((s) => ({
          editorViewStates: { ...s.editorViewStates, [filePath]: state },
        }));
      },

      getEditorViewState: (filePath) => {
        return get().editorViewStates[filePath] || null;
      },

      /* 最近文件 */
      addRecentFile: (filePath) => {
        set((s) => ({
          currentSession: {
            ...s.currentSession,
            recentFiles: [filePath, ...s.currentSession.recentFiles.filter((f) => f !== filePath)].slice(0, 20),
          },
        }));
      },

      clearRecentFiles: () => {
        set((s) => ({
          currentSession: { ...s.currentSession, recentFiles: [] },
        }));
      },

      getRecentFiles: () => get().currentSession.recentFiles,

      /* 会话管理 */
      saveSession: () => {
        set((s) => ({
          currentSession: { ...s.currentSession, updatedAt: Date.now() },
        }));
      },

      restoreSession: () => {
        // persist middleware 自动恢复，此处可做额外校验
        const session = get().currentSession;
        if (session.openFiles.length === 0) {
          set({ currentSession: createDefaultSession() });
        }
      },

      clearSession: () => {
        set({
          currentSession: createDefaultSession(),
          editorViewStates: {},
        });
      },

      /* 查询 */
      getOpenFiles: () => get().currentSession.openFiles,
      getActiveFile: () => {
        const { openFiles, activeFilePath } = get().currentSession;
        return openFiles.find((f) => f.filePath === activeFilePath) || null;
      },
      getDirtyFiles: () => get().currentSession.openFiles.filter((f) => f.isDirty),
      getFileByPath: (filePath) => get().currentSession.openFiles.find((f) => f.filePath === filePath) || null,
    }),
    {
      name: "yyc3-workspace-context",
    }
  )
);

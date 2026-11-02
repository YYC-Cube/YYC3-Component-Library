/**
 * @file multiInstanceStore.ts
 * @description 应用多开状态管理 — 窗口管理、工作区管理、会话管理、IPC 通信、资源共享
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-18
 * @updated 2026-03-18
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, multi-instance, window, workspace, session, ipc
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ═══════════════════════════════════════════════════════
 *  类型定义
 * ═══════════════════════════════════════════════════════ */

export type InstanceType = "main" | "secondary" | "popup" | "preview";
export type WindowType = "main" | "editor" | "preview" | "terminal" | "ai-chat" | "settings";
export type WorkspaceType = "project" | "ai-session" | "debug" | "custom";
export type SessionType = "ai-chat" | "code-edit" | "debug" | "preview" | "terminal";
export type SessionStatus = "active" | "idle" | "suspended" | "closed";

export type IPCMessageType =
  | "instance-created"
  | "instance-closed"
  | "workspace-created"
  | "workspace-updated"
  | "workspace-closed"
  | "session-created"
  | "session-updated"
  | "session-closed"
  | "state-sync"
  | "resource-share"
  | "clipboard-share";

export interface AppInstance {
  id: string;
  type: InstanceType;
  windowId: string;
  windowType: WindowType;
  title: string;
  createdAt: number;
  lastActiveAt: number;
  isMain: boolean;
  isVisible: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  workspaceId?: string;
  sessionIds: string[];
  state: Record<string, unknown>;
}

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  icon?: string;
  createdAt: number;
  updatedAt: number;
  projectPath?: string;
  sessionIds: string[];
  windowIds: string[];
  isActive: boolean;
  color: string;
}

export interface SessionData {
  aiMessages?: Array<{ role: string; content: string }>;
  editedFiles?: Array<{ path: string; content: string }>;
  terminalHistory?: Array<{ command: string; output: string }>;
  previewUrl?: string;
}

export interface MISession {
  id: string;
  type: SessionType;
  name: string;
  createdAt: number;
  updatedAt: number;
  status: SessionStatus;
  data: SessionData;
  workspaceId: string;
  windowId: string;
}

export interface IPCMessage {
  id: string;
  type: IPCMessageType;
  senderId: string;
  receiverId?: string;
  data: unknown;
  timestamp: number;
}

export interface ResourceMetrics {
  memoryUsageMB: number;
  cpuPercent: number;
  activeWindows: number;
  activeSessions: number;
  ipcMessagesPerSec: number;
}

/* ═══════════════════════════════════════════════════════
 *  Store 接口
 * ═══════════════════════════════════════════════════════ */

interface MultiInstanceState {
  /* 窗口 */
  instances: AppInstance[];
  activeInstanceId: string | null;
  mainInstanceId: string | null;

  /* 工作区 */
  workspaces: Workspace[];
  activeWorkspaceId: string | null;

  /* 会话 */
  sessions: MISession[];
  activeSessionId: string | null;

  /* IPC */
  ipcLog: IPCMessage[];
  ipcListeners: Map<IPCMessageType, Set<(msg: IPCMessage) => void>>;

  /* 资源 */
  metrics: ResourceMetrics;

  /* 剪贴板共享 */
  sharedClipboard: Array<{ id: string; content: string; type: string; timestamp: number }>;
}

interface MultiInstanceActions {
  /* ── 窗口管理 ── */
  createWindow: (type: WindowType, config?: { title?: string; size?: { width: number; height: number }; position?: { x: number; y: number }; workspaceId?: string }) => string;
  closeWindow: (windowId: string) => void;
  activateWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  moveWindow: (windowId: string, position: { x: number; y: number }) => void;
  resizeWindow: (windowId: string, size: { width: number; height: number }) => void;
  updateWindowState: (windowId: string, updates: Partial<AppInstance>) => void;
  getAllWindows: () => AppInstance[];

  /* ── 工作区管理 ── */
  createWorkspace: (name: string, type: WorkspaceType, projectPath?: string) => string;
  updateWorkspace: (workspaceId: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (workspaceId: string) => void;
  activateWorkspace: (workspaceId: string) => void;
  duplicateWorkspace: (workspaceId: string) => string;
  getActiveWorkspace: () => Workspace | undefined;

  /* ── 会话管理 ── */
  createSession: (name: string, type: SessionType, workspaceId: string, windowId: string) => string;
  updateSession: (sessionId: string, updates: Partial<MISession>) => void;
  deleteSession: (sessionId: string) => void;
  activateSession: (sessionId: string) => void;
  suspendSession: (sessionId: string) => void;
  resumeSession: (sessionId: string) => void;
  updateSessionData: (sessionId: string, data: Partial<SessionData>) => void;
  getWorkspaceSessions: (workspaceId: string) => MISession[];

  /* ── IPC ── */
  broadcast: (type: IPCMessageType, data: unknown) => void;
  sendToInstance: (instanceId: string, type: IPCMessageType, data: unknown) => void;
  onMessage: (type: IPCMessageType, handler: (msg: IPCMessage) => void) => () => void;

  /* ── 资源 ── */
  updateMetrics: () => void;

  /* ── 剪贴板 ── */
  shareToClipboard: (content: string, type: string) => void;
  clearSharedClipboard: () => void;
}

/* ═══════════════════════════════════════════════════════
 *  工具
 * ═══════════════════════════════════════════════════════ */

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const WORKSPACE_COLORS = [
  "#00ff87", "#60efff", "#a855f7", "#ffb86c", "#ec4899",
  "#f97316", "#14b8a6", "#6366f1", "#eab308", "#ef4444",
];

/* ═══════════════════════════════════════════════════════
 *  Store 实现
 * ═══════════════════════════════════════════════════════ */

export const useMultiInstanceStore = create<MultiInstanceState & MultiInstanceActions>()(
  persist(
    (set, get) => ({
      instances: [],
      activeInstanceId: null,
      mainInstanceId: null,
      workspaces: [],
      activeWorkspaceId: null,
      sessions: [],
      activeSessionId: null,
      ipcLog: [],
      ipcListeners: new Map(),
      metrics: { memoryUsageMB: 0, cpuPercent: 0, activeWindows: 0, activeSessions: 0, ipcMessagesPerSec: 0 },
      sharedClipboard: [],

      /* ══════ 窗口管理 ══════ */

      createWindow: (type, config = {}) => {
        const id = uid();
        const windowId = `win-${id}`;
        const isFirst = get().instances.length === 0;
        const offset = get().instances.length * 40;

        const instance: AppInstance = {
          id,
          type: isFirst ? "main" : "secondary",
          windowId,
          windowType: type,
          title: config.title || `YYC³ — ${type}`,
          createdAt: Date.now(),
          lastActiveAt: Date.now(),
          isMain: isFirst,
          isVisible: true,
          isMinimized: false,
          isMaximized: false,
          position: config.position || { x: 100 + offset, y: 80 + offset },
          size: config.size || { width: 1200, height: 800 },
          workspaceId: config.workspaceId,
          sessionIds: [],
          state: {},
        };

        set((s) => ({
          instances: [...s.instances, instance],
          activeInstanceId: windowId,
          mainInstanceId: s.mainInstanceId || id,
        }));

        get().broadcast("instance-created", instance);
        get().updateMetrics();
        return windowId;
      },

      closeWindow: (windowId) => {
        const inst = get().instances.find((i) => i.windowId === windowId);
        set((s) => ({
          instances: s.instances.filter((i) => i.windowId !== windowId),
          activeInstanceId: s.activeInstanceId === windowId ? null : s.activeInstanceId,
          sessions: s.sessions.map((sess) =>
            sess.windowId === windowId ? { ...sess, status: "closed" as const } : sess
          ),
        }));
        if (inst) get().broadcast("instance-closed", inst);
        get().updateMetrics();
      },

      activateWindow: (windowId) =>
        set((s) => ({
          activeInstanceId: windowId,
          instances: s.instances.map((i) =>
            i.windowId === windowId ? { ...i, lastActiveAt: Date.now() } : i
          ),
        })),

      minimizeWindow: (windowId) =>
        set((s) => ({
          instances: s.instances.map((i) =>
            i.windowId === windowId ? { ...i, isMinimized: true, isMaximized: false } : i
          ),
        })),

      maximizeWindow: (windowId) =>
        set((s) => ({
          instances: s.instances.map((i) =>
            i.windowId === windowId ? { ...i, isMaximized: true, isMinimized: false } : i
          ),
        })),

      restoreWindow: (windowId) =>
        set((s) => ({
          instances: s.instances.map((i) =>
            i.windowId === windowId ? { ...i, isMinimized: false, isMaximized: false } : i
          ),
        })),

      moveWindow: (windowId, position) =>
        set((s) => ({
          instances: s.instances.map((i) =>
            i.windowId === windowId ? { ...i, position } : i
          ),
        })),

      resizeWindow: (windowId, size) =>
        set((s) => ({
          instances: s.instances.map((i) =>
            i.windowId === windowId ? { ...i, size } : i
          ),
        })),

      updateWindowState: (windowId, updates) =>
        set((s) => ({
          instances: s.instances.map((i) =>
            i.windowId === windowId ? { ...i, ...updates } : i
          ),
        })),

      getAllWindows: () => get().instances,

      /* ══════ 工作区管理 ══════ */

      createWorkspace: (name, type, projectPath) => {
        const id = `ws-${uid()}`;
        const workspace: Workspace = {
          id,
          name,
          type,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          projectPath,
          sessionIds: [],
          windowIds: [],
          isActive: false,
          color: WORKSPACE_COLORS[get().workspaces.length % WORKSPACE_COLORS.length],
        };
        set((s) => ({ workspaces: [...s.workspaces, workspace] }));
        get().broadcast("workspace-created", workspace);
        return id;
      },

      updateWorkspace: (workspaceId, updates) =>
        set((s) => ({
          workspaces: s.workspaces.map((w) =>
            w.id === workspaceId ? { ...w, ...updates, updatedAt: Date.now() } : w
          ),
        })),

      deleteWorkspace: (workspaceId) => {
        set((s) => ({
          workspaces: s.workspaces.filter((w) => w.id !== workspaceId),
          activeWorkspaceId: s.activeWorkspaceId === workspaceId ? null : s.activeWorkspaceId,
          sessions: s.sessions.filter((sess) => sess.workspaceId !== workspaceId),
        }));
        get().broadcast("workspace-closed", { id: workspaceId });
      },

      activateWorkspace: (workspaceId) =>
        set((s) => ({
          activeWorkspaceId: workspaceId,
          workspaces: s.workspaces.map((w) => ({ ...w, isActive: w.id === workspaceId })),
        })),

      duplicateWorkspace: (workspaceId) => {
        const orig = get().workspaces.find((w) => w.id === workspaceId);
        if (!orig) return "";
        const id = `ws-${uid()}`;
        const dup: Workspace = {
          ...orig,
          id,
          name: `${orig.name} (副本)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sessionIds: [],
          windowIds: [],
          isActive: false,
          color: WORKSPACE_COLORS[get().workspaces.length % WORKSPACE_COLORS.length],
        };
        set((s) => ({ workspaces: [...s.workspaces, dup] }));
        return id;
      },

      getActiveWorkspace: () => {
        const { workspaces, activeWorkspaceId } = get();
        return workspaces.find((w) => w.id === activeWorkspaceId);
      },

      /* ══════ 会话管理 ══════ */

      createSession: (name, type, workspaceId, windowId) => {
        const id = `sess-${uid()}`;
        const session: MISession = {
          id,
          type,
          name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          status: "active",
          data: {},
          workspaceId,
          windowId,
        };
        set((s) => ({
          sessions: [...s.sessions, session],
          activeSessionId: id,
        }));

        // 关联到窗口 & 工作区
        set((s) => ({
          instances: s.instances.map((i) =>
            i.windowId === windowId ? { ...i, sessionIds: [...i.sessionIds, id] } : i
          ),
          workspaces: s.workspaces.map((w) =>
            w.id === workspaceId ? { ...w, sessionIds: [...w.sessionIds, id], updatedAt: Date.now() } : w
          ),
        }));

        get().broadcast("session-created", session);
        get().updateMetrics();
        return id;
      },

      updateSession: (sessionId, updates) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId ? { ...sess, ...updates, updatedAt: Date.now() } : sess
          ),
        })),

      deleteSession: (sessionId) => {
        set((s) => ({
          sessions: s.sessions.filter((sess) => sess.id !== sessionId),
          activeSessionId: s.activeSessionId === sessionId ? null : s.activeSessionId,
          instances: s.instances.map((i) => ({
            ...i,
            sessionIds: i.sessionIds.filter((sid) => sid !== sessionId),
          })),
          workspaces: s.workspaces.map((w) => ({
            ...w,
            sessionIds: w.sessionIds.filter((sid) => sid !== sessionId),
          })),
        }));
        get().broadcast("session-closed", { id: sessionId });
        get().updateMetrics();
      },

      activateSession: (sessionId) =>
        set((s) => ({
          activeSessionId: sessionId,
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId ? { ...sess, status: "active" as const } : sess
          ),
        })),

      suspendSession: (sessionId) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId ? { ...sess, status: "suspended" as const } : sess
          ),
        })),

      resumeSession: (sessionId) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId ? { ...sess, status: "active" as const } : sess
          ),
        })),

      updateSessionData: (sessionId, data) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId
              ? { ...sess, data: { ...sess.data, ...data }, updatedAt: Date.now() }
              : sess
          ),
        })),

      getWorkspaceSessions: (workspaceId) =>
        get().sessions.filter((s) => s.workspaceId === workspaceId),

      /* ══════ IPC ══════ */

      broadcast: (type, data) => {
        const msg: IPCMessage = {
          id: uid(),
          type,
          senderId: get().mainInstanceId || "main",
          data,
          timestamp: Date.now(),
        };
        set((s) => ({
          ipcLog: [...s.ipcLog.slice(-99), msg],
        }));
        // dispatch to listeners
        const listeners = get().ipcListeners.get(type);
        if (listeners) listeners.forEach((fn) => fn(msg));
      },

      sendToInstance: (instanceId, type, data) => {
        const msg: IPCMessage = {
          id: uid(),
          type,
          senderId: get().mainInstanceId || "main",
          receiverId: instanceId,
          data,
          timestamp: Date.now(),
        };
        set((s) => ({
          ipcLog: [...s.ipcLog.slice(-99), msg],
        }));
        const listeners = get().ipcListeners.get(type);
        if (listeners) listeners.forEach((fn) => fn(msg));
      },

      onMessage: (type, handler) => {
        const { ipcListeners } = get();
        if (!ipcListeners.has(type)) ipcListeners.set(type, new Set());
        ipcListeners.get(type)!.add(handler);
        return () => { ipcListeners.get(type)?.delete(handler); };
      },

      /* ══════ 资源监控 ══════ */

      updateMetrics: () => {
        const s = get();
        const activeW = s.instances.filter((i) => i.isVisible && !i.isMinimized).length;
        const activeS = s.sessions.filter((sess) => sess.status === "active").length;
        set({
          metrics: {
            memoryUsageMB: Math.round(50 + activeW * 80 + activeS * 20 + Math.random() * 30),
            cpuPercent: Math.round(5 + activeW * 8 + activeS * 3 + Math.random() * 5),
            activeWindows: activeW,
            activeSessions: activeS,
            ipcMessagesPerSec: s.ipcLog.filter((m) => m.timestamp > Date.now() - 1000).length,
          },
        });
      },

      /* ══════ 剪贴板 ══════ */

      shareToClipboard: (content, type) =>
        set((s) => ({
          sharedClipboard: [
            { id: uid(), content, type, timestamp: Date.now() },
            ...s.sharedClipboard.slice(0, 19),
          ],
        })),

      clearSharedClipboard: () => set({ sharedClipboard: [] }),
    }),
    {
      name: "yyc3-multi-instance",
      partialize: (s) => ({
        workspaces: s.workspaces,
        activeWorkspaceId: s.activeWorkspaceId,
      }),
    }
  )
);

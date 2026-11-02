/**
 * @file collaborationStore.ts
 * @description 协同编辑状态管理 — Yjs 感知协议模拟、用户在线状态、光标位置、选区同步
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags collaboration, yjs, awareness, cursor, presence, realtime
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */

/** 协同用户颜色预设 */
export const collaboratorColors = [
  { name: "翡翠", color: "#00ff87", bg: "rgba(0,255,135,0.12)" },
  { name: "天蓝", color: "#60efff", bg: "rgba(96,239,255,0.12)" },
  { name: "紫罗", color: "#a855f7", bg: "rgba(168,85,247,0.12)" },
  { name: "琥珀", color: "#ffb86c", bg: "rgba(255,184,108,0.12)" },
  { name: "玫瑰", color: "#ff6b9d", bg: "rgba(255,107,157,0.12)" },
  { name: "蓝宝", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  { name: "珊瑚", color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  { name: "薄荷", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
];

export type ConnectionStatus = "connected" | "connecting" | "disconnected" | "error";

export interface UserPresence {
  userId: string;
  displayName: string;
  avatar?: string;
  color: string;
  colorBg: string;
  /** 当前编辑的文件路径 */
  activeFile: string | null;
  /** 光标位置 */
  cursor: CursorPosition | null;
  /** 选区范围 */
  selection: SelectionRange | null;
  /** 在线状态 */
  status: "active" | "idle" | "away";
  /** 最后活跃时间 */
  lastActive: number;
  /** 加入时间 */
  joinedAt: number;
}

export interface CursorPosition {
  line: number;
  column: number;
  /** 所在文件 */
  filePath: string;
}

export interface SelectionRange {
  start: { line: number; column: number };
  end: { line: number; column: number };
  filePath: string;
}

export interface CollaborationRoom {
  id: string;
  name: string;
  createdAt: number;
  participants: string[];
  /** 文档版本向量 (Yjs state vector simulation) */
  stateVector: number;
}

export interface AwarenessState {
  /** 用户 awareness 信息 */
  users: Map<string, UserPresence>;
  /** 本地用户 ID */
  localUserId: string;
}

export interface EditOperation {
  id: string;
  userId: string;
  filePath: string;
  type: "insert" | "delete" | "replace";
  position: { line: number; column: number };
  content: string;
  timestamp: number;
}

/* ─── 本地用户模拟数据 ─── */
const localUser: UserPresence = {
  userId: "local-user",
  displayName: "我",
  color: "#00ff87",
  colorBg: "rgba(0,255,135,0.12)",
  activeFile: null,
  cursor: null,
  selection: null,
  status: "active",
  lastActive: Date.now(),
  joinedAt: Date.now(),
};

/** 模拟远程协作者 */
const mockCollaborators: UserPresence[] = [
  {
    userId: "user-alice",
    displayName: "Alice Chen",
    avatar: "",
    color: "#60efff",
    colorBg: "rgba(96,239,255,0.12)",
    activeFile: "/src/app/App.tsx",
    cursor: { line: 42, column: 15, filePath: "/src/app/App.tsx" },
    selection: null,
    status: "active",
    lastActive: Date.now() - 30000,
    joinedAt: Date.now() - 600000,
  },
  {
    userId: "user-bob",
    displayName: "Bob Li",
    avatar: "",
    color: "#a855f7",
    colorBg: "rgba(168,85,247,0.12)",
    activeFile: "/src/app/stores/layoutStore.ts",
    cursor: { line: 108, column: 4, filePath: "/src/app/stores/layoutStore.ts" },
    selection: null,
    status: "idle",
    lastActive: Date.now() - 180000,
    joinedAt: Date.now() - 1200000,
  },
  {
    userId: "user-carol",
    displayName: "Carol Wang",
    avatar: "",
    color: "#ffb86c",
    colorBg: "rgba(255,184,108,0.12)",
    activeFile: null,
    cursor: null,
    selection: null,
    status: "away",
    lastActive: Date.now() - 900000,
    joinedAt: Date.now() - 3600000,
  },
];

/* ─── Store 接口 ─── */
interface CollaborationStore {
  /* ─── 状态 ─── */
  connectionStatus: ConnectionStatus;
  localUser: UserPresence;
  remoteUsers: UserPresence[];
  activeRoom: CollaborationRoom | null;
  operationHistory: EditOperation[];
  isCollaborating: boolean;

  /* ─── 连接管理 ─── */
  connect: (roomId?: string) => void;
  disconnect: () => void;
  reconnect: () => void;

  /* ─── 用户感知 (Awareness) ─── */
  updateLocalCursor: (cursor: CursorPosition) => void;
  updateLocalSelection: (selection: SelectionRange | null) => void;
  updateLocalActiveFile: (filePath: string | null) => void;
  updateLocalStatus: (status: UserPresence["status"]) => void;
  updateLocalDisplayName: (name: string) => void;

  /* ─── 远程感知 ─── */
  getRemoteUsersByFile: (filePath: string) => UserPresence[];
  getRemoteCursors: (filePath: string) => (UserPresence & { cursor: CursorPosition })[];
  getOnlineCount: () => number;
  getActiveUsers: () => UserPresence[];

  /* ─── 操作同步 (模拟 Yjs) ─── */
  broadcastOperation: (op: Omit<EditOperation, "id" | "timestamp">) => void;
  getOperationHistory: (filePath?: string) => EditOperation[];
}

export const useCollaborationStore = create<CollaborationStore>()(
  persist(
    (set, get) => ({
      connectionStatus: "disconnected",
      localUser: localUser,
      remoteUsers: [],
      activeRoom: null,
      operationHistory: [],
      isCollaborating: false,

      /* ─── 连接管理 ─── */
      connect: (roomId) => {
        set({ connectionStatus: "connecting" });
        // 模拟 WebSocket 连接延迟
        setTimeout(() => {
          const room: CollaborationRoom = {
            id: roomId || `room-${Date.now()}`,
            name: "YYC³ 工作区",
            createdAt: Date.now(),
            participants: ["local-user", ...mockCollaborators.map((u) => u.userId)],
            stateVector: 0,
          };
          set({
            connectionStatus: "connected",
            remoteUsers: mockCollaborators,
            activeRoom: room,
            isCollaborating: true,
            localUser: { ...get().localUser, lastActive: Date.now(), status: "active" },
          });
        }, 800);
      },

      disconnect: () => {
        set({
          connectionStatus: "disconnected",
          remoteUsers: [],
          activeRoom: null,
          isCollaborating: false,
        });
      },

      reconnect: () => {
        const { activeRoom } = get();
        get().disconnect();
        setTimeout(() => get().connect(activeRoom?.id), 300);
      },

      /* ─── 本地感知 ─── */
      updateLocalCursor: (cursor) => {
        set({ localUser: { ...get().localUser, cursor, lastActive: Date.now(), status: "active" } });
      },

      updateLocalSelection: (selection) => {
        set({ localUser: { ...get().localUser, selection, lastActive: Date.now() } });
      },

      updateLocalActiveFile: (filePath) => {
        set({ localUser: { ...get().localUser, activeFile: filePath, lastActive: Date.now() } });
      },

      updateLocalStatus: (status) => {
        set({ localUser: { ...get().localUser, status, lastActive: Date.now() } });
      },

      updateLocalDisplayName: (name) => {
        set({ localUser: { ...get().localUser, displayName: name } });
      },

      /* ─── 远程感知查询 ─── */
      getRemoteUsersByFile: (filePath) =>
        get().remoteUsers.filter((u) => u.activeFile === filePath),

      getRemoteCursors: (filePath) =>
        get().remoteUsers.filter(
          (u): u is UserPresence & { cursor: CursorPosition } =>
            u.cursor !== null && u.cursor.filePath === filePath
        ),

      getOnlineCount: () => {
        const remote = get().remoteUsers.filter((u) => u.status !== "away");
        return remote.length + 1; // +1 for local user
      },

      getActiveUsers: () => {
        return [get().localUser, ...get().remoteUsers].filter((u) => u.status === "active");
      },

      /* ─── 操作同步 ─── */
      broadcastOperation: (op) => {
        const fullOp: EditOperation = {
          ...op,
          id: `op-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: Date.now(),
        };
        set((s) => ({
          operationHistory: [...s.operationHistory.slice(-500), fullOp],
          activeRoom: s.activeRoom
            ? { ...s.activeRoom, stateVector: s.activeRoom.stateVector + 1 }
            : null,
        }));
      },

      getOperationHistory: (filePath) => {
        const history = get().operationHistory;
        return filePath ? history.filter((op) => op.filePath === filePath) : history;
      },
    }),
    {
      name: "yyc3-collaboration",
      partialize: (s) => ({
        localUser: { ...s.localUser, cursor: null, selection: null, status: "active" as const },
      }),
    }
  )
);

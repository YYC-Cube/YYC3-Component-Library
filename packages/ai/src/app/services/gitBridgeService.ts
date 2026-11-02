/**
 * @file gitBridgeService.ts
 * @description Git 命令桥接服务 — 封装 Tauri invoke 调用，提供 Git 状态/暂存/提交/分支/日志接口，含 Web 环境模拟层
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-18
 * @updated 2026-03-18
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags git, tauri, bridge, service, version-control
 */

/* ─── 类型定义 ─── */

export type GitFileStatus = "modified" | "added" | "deleted" | "renamed" | "untracked" | "unmodified";

export interface GitStatusEntry {
  path: string;
  name: string;
  status: GitFileStatus;
  staged: boolean;
}

export interface GitBranch {
  name: string;
  isCurrent: boolean;
  lastCommit?: string;
  upstream?: string;
}

export interface GitLogEntry {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  message: string;
}

export interface GitDiffEntry {
  path: string;
  additions: number;
  deletions: number;
  hunks: string;
}

export interface GitCommitResult {
  success: boolean;
  hash?: string;
  message?: string;
  error?: string;
}

/* ─── Tauri 环境检测 ─── */
const isTauri = (): boolean => {
  try {
    return typeof (window as any).__TAURI__ !== "undefined";
  } catch {
    return false;
  }
};

const tauriInvoke = async <T>(cmd: string, args?: Record<string, unknown>): Promise<T> => {
  if (isTauri()) {
    // Access Tauri invoke via global __TAURI__ object to avoid bundler resolution
    const tauriCore = (window as any).__TAURI__?.core;
    if (tauriCore?.invoke) {
      return tauriCore.invoke(cmd, args) as Promise<T>;
    }
  }
  throw new Error("Tauri not available");
};

/* ─── 模拟数据 ─── */

const MOCK_STATUS: GitStatusEntry[] = [
  { path: "src/app/components/StatusBar.tsx", name: "StatusBar.tsx", status: "modified", staged: false },
  { path: "src/app/stores/layoutStore.ts", name: "layoutStore.ts", status: "modified", staged: true },
  { path: "src/app/stores/taskStore.ts", name: "taskStore.ts", status: "added", staged: true },
  { path: "src/app/stores/sidebarStore.ts", name: "sidebarStore.ts", status: "added", staged: false },
  { path: "src/app/components/panels/LeftSidebar.tsx", name: "LeftSidebar.tsx", status: "added", staged: false },
  { path: "src/app/services/gitBridgeService.ts", name: "gitBridgeService.ts", status: "untracked", staged: false },
];

const MOCK_BRANCHES: GitBranch[] = [
  { name: "main", isCurrent: true, lastCommit: "a1b2c3d", upstream: "origin/main" },
  { name: "feature/left-sidebar", isCurrent: false, lastCommit: "e4f5g6h" },
  { name: "feature/task-board", isCurrent: false, lastCommit: "i7j8k9l" },
  { name: "develop", isCurrent: false, lastCommit: "m0n1o2p", upstream: "origin/develop" },
];

const MOCK_LOG: GitLogEntry[] = [
  { hash: "a1b2c3d4e5f6", shortHash: "a1b2c3d", author: "YYC³ Dev", date: "2026-03-18T10:30:00Z", message: "feat: 实现左侧面板系统 (LeftSidebar)" },
  { hash: "b2c3d4e5f6g7", shortHash: "b2c3d4e", author: "YYC³ Dev", date: "2026-03-17T18:45:00Z", message: "feat: P1 AI 任务看板交互系统" },
  { hash: "c3d4e5f6g7h8", shortHash: "c3d4e5f", author: "YYC³ Dev", date: "2026-03-17T14:20:00Z", message: "feat: Quick Actions 一键操作工具栏" },
  { hash: "d4e5f6g7h8i9", shortHash: "d4e5f6g", author: "YYC³ Dev", date: "2026-03-16T20:15:00Z", message: "feat: P1 Settings 模块完整落地" },
  { hash: "e5f6g7h8i9j0", shortHash: "e5f6g7h", author: "YYC³ Dev", date: "2026-03-15T09:00:00Z", message: "init: 项目初始化 YYC³ AI Code Designer" },
];

/* ─── 服务接口 ─── */

export const gitBridgeService = {
  /**
   * 获取当前工作区 Git 状态
   */
  async getStatus(): Promise<GitStatusEntry[]> {
    try {
      return await tauriInvoke<GitStatusEntry[]>("git_status");
    } catch {
      // Web 环境返回模拟数据
      return [...MOCK_STATUS];
    }
  },

  /**
   * 暂存文件
   */
  async stageFile(path: string): Promise<void> {
    try {
      await tauriInvoke("git_stage", { path });
    } catch {
      console.log(`[Git Mock] Stage: ${path}`);
    }
  },

  /**
   * 取消暂存文件
   */
  async unstageFile(path: string): Promise<void> {
    try {
      await tauriInvoke("git_unstage", { path });
    } catch {
      console.log(`[Git Mock] Unstage: ${path}`);
    }
  },

  /**
   * 暂存所有变更
   */
  async stageAll(): Promise<void> {
    try {
      await tauriInvoke("git_stage_all");
    } catch {
      console.log("[Git Mock] Stage all");
    }
  },

  /**
   * 取消暂存所有
   */
  async unstageAll(): Promise<void> {
    try {
      await tauriInvoke("git_unstage_all");
    } catch {
      console.log("[Git Mock] Unstage all");
    }
  },

  /**
   * 提交
   */
  async commit(message: string): Promise<GitCommitResult> {
    try {
      return await tauriInvoke<GitCommitResult>("git_commit", { message });
    } catch {
      console.log(`[Git Mock] Commit: ${message}`);
      const hash = Math.random().toString(36).substring(2, 9);
      return { success: true, hash, message };
    }
  },

  /**
   * 获取分支列表
   */
  async getBranches(): Promise<GitBranch[]> {
    try {
      return await tauriInvoke<GitBranch[]>("git_branches");
    } catch {
      return [...MOCK_BRANCHES];
    }
  },

  /**
   * 切换分支
   */
  async checkoutBranch(branch: string): Promise<void> {
    try {
      await tauriInvoke("git_checkout", { branch });
    } catch {
      console.log(`[Git Mock] Checkout: ${branch}`);
    }
  },

  /**
   * 获取提交日志
   */
  async getLog(limit: number = 20): Promise<GitLogEntry[]> {
    try {
      return await tauriInvoke<GitLogEntry[]>("git_log", { limit });
    } catch {
      return MOCK_LOG.slice(0, limit);
    }
  },

  /**
   * 获取文件 diff
   */
  async getDiff(path: string): Promise<string> {
    try {
      return await tauriInvoke<string>("git_diff", { path });
    } catch {
      return `--- a/${path}\n+++ b/${path}\n@@ -1,5 +1,8 @@\n // Mock diff content\n+// Added line 1\n+// Added line 2\n // Existing line\n-// Removed line\n+// Modified line\n // Existing line`;
    }
  },

  /**
   * 拉取远程
   */
  async pull(): Promise<void> {
    try {
      await tauriInvoke("git_pull");
    } catch {
      console.log("[Git Mock] Pull from remote");
    }
  },

  /**
   * 推送远程
   */
  async push(): Promise<void> {
    try {
      await tauriInvoke("git_push");
    } catch {
      console.log("[Git Mock] Push to remote");
    }
  },

  /**
   * 获取当前分支名
   */
  async getCurrentBranch(): Promise<string> {
    try {
      return await tauriInvoke<string>("git_current_branch");
    } catch {
      return "main";
    }
  },
};
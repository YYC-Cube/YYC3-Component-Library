/**
 * @file multiInstanceStore.test.ts
 * @description multiInstanceStore 单元测试 — 窗口/工作区/会话 CRUD、IPC 广播、资源监控
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-18
 * @updated 2026-03-18
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, multi-instance, unit
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useMultiInstanceStore } from "../../stores/multiInstanceStore";

const resetStore = () =>
  useMultiInstanceStore.setState({
    instances: [],
    activeInstanceId: null,
    mainInstanceId: null,
    workspaces: [],
    activeWorkspaceId: null,
    sessions: [],
    activeSessionId: null,
    ipcLog: [],
    sharedClipboard: [],
    metrics: { memoryUsageMB: 0, cpuPercent: 0, activeWindows: 0, activeSessions: 0, ipcMessagesPerSec: 0 },
  });

const getState = () => useMultiInstanceStore.getState();

describe("multiInstanceStore", () => {
  beforeEach(resetStore);

  /* ─── 窗口管理 ─── */

  describe("Window Management", () => {
    it("createWindow creates instance and sets first as main", () => {
      const winId = getState().createWindow("editor");
      expect(winId).toBeTruthy();
      expect(getState().instances).toHaveLength(1);
      expect(getState().instances[0].isMain).toBe(true);
      expect(getState().instances[0].windowType).toBe("editor");
    });

    it("second window is secondary type", () => {
      getState().createWindow("main");
      getState().createWindow("editor");
      expect(getState().instances[1].type).toBe("secondary");
      expect(getState().instances[1].isMain).toBe(false);
    });

    it("closeWindow removes instance", () => {
      const winId = getState().createWindow("editor");
      getState().closeWindow(winId);
      expect(getState().instances).toHaveLength(0);
    });

    it("activateWindow sets activeInstanceId", () => {
      const w1 = getState().createWindow("editor");
      const w2 = getState().createWindow("terminal");
      getState().activateWindow(w1);
      expect(getState().activeInstanceId).toBe(w1);
    });

    it("minimizeWindow / restoreWindow toggles state", () => {
      const winId = getState().createWindow("editor");
      getState().minimizeWindow(winId);
      expect(getState().instances[0].isMinimized).toBe(true);
      getState().restoreWindow(winId);
      expect(getState().instances[0].isMinimized).toBe(false);
    });

    it("maximizeWindow sets isMaximized", () => {
      const winId = getState().createWindow("editor");
      getState().maximizeWindow(winId);
      expect(getState().instances[0].isMaximized).toBe(true);
    });

    it("moveWindow updates position", () => {
      const winId = getState().createWindow("editor");
      getState().moveWindow(winId, { x: 200, y: 300 });
      expect(getState().instances[0].position).toEqual({ x: 200, y: 300 });
    });

    it("resizeWindow updates size", () => {
      const winId = getState().createWindow("editor");
      getState().resizeWindow(winId, { width: 1600, height: 900 });
      expect(getState().instances[0].size).toEqual({ width: 1600, height: 900 });
    });
  });

  /* ─── 工作区管理 ─── */

  describe("Workspace Management", () => {
    it("createWorkspace adds workspace", () => {
      const id = getState().createWorkspace("My Project", "project", "/path/to/project");
      expect(getState().workspaces).toHaveLength(1);
      expect(getState().workspaces[0].name).toBe("My Project");
      expect(getState().workspaces[0].type).toBe("project");
    });

    it("activateWorkspace sets activeWorkspaceId", () => {
      const id = getState().createWorkspace("WS1", "project");
      getState().activateWorkspace(id);
      expect(getState().activeWorkspaceId).toBe(id);
      expect(getState().workspaces[0].isActive).toBe(true);
    });

    it("deleteWorkspace removes workspace and associated sessions", () => {
      const wsId = getState().createWorkspace("WS", "project");
      const winId = getState().createWindow("editor");
      getState().createSession("S1", "code-edit", wsId, winId);
      expect(getState().sessions).toHaveLength(1);
      getState().deleteWorkspace(wsId);
      expect(getState().workspaces).toHaveLength(0);
      expect(getState().sessions).toHaveLength(0);
    });

    it("duplicateWorkspace creates copy with (副本) suffix", () => {
      const id = getState().createWorkspace("Original", "ai-session");
      const dupId = getState().duplicateWorkspace(id);
      expect(getState().workspaces).toHaveLength(2);
      expect(getState().workspaces[1].name).toBe("Original (副本)");
    });

    it("updateWorkspace modifies fields", () => {
      const id = getState().createWorkspace("WS", "project");
      getState().updateWorkspace(id, { name: "Renamed" });
      expect(getState().workspaces[0].name).toBe("Renamed");
    });
  });

  /* ─── 会话管理 ─── */

  describe("Session Management", () => {
    it("createSession adds session and links to window/workspace", () => {
      const wsId = getState().createWorkspace("WS", "project");
      const winId = getState().createWindow("editor");
      const sessId = getState().createSession("Chat", "ai-chat", wsId, winId);

      expect(getState().sessions).toHaveLength(1);
      expect(getState().sessions[0].status).toBe("active");
      // linked to window
      expect(getState().instances[0].sessionIds).toContain(sessId);
      // linked to workspace
      expect(getState().workspaces[0].sessionIds).toContain(sessId);
    });

    it("suspendSession / resumeSession toggles status", () => {
      const wsId = getState().createWorkspace("WS", "project");
      const winId = getState().createWindow("editor");
      const sessId = getState().createSession("S", "code-edit", wsId, winId);
      
      getState().suspendSession(sessId);
      expect(getState().sessions[0].status).toBe("suspended");
      
      getState().resumeSession(sessId);
      expect(getState().sessions[0].status).toBe("active");
    });

    it("deleteSession removes from store and unlinks from window/workspace", () => {
      const wsId = getState().createWorkspace("WS", "project");
      const winId = getState().createWindow("editor");
      const sessId = getState().createSession("S", "terminal", wsId, winId);
      
      getState().deleteSession(sessId);
      expect(getState().sessions).toHaveLength(0);
      expect(getState().instances[0].sessionIds).not.toContain(sessId);
      expect(getState().workspaces[0].sessionIds).not.toContain(sessId);
    });

    it("getWorkspaceSessions returns only workspace sessions", () => {
      const ws1 = getState().createWorkspace("WS1", "project");
      const ws2 = getState().createWorkspace("WS2", "debug");
      const winId = getState().createWindow("editor");
      getState().createSession("S1", "ai-chat", ws1, winId);
      getState().createSession("S2", "code-edit", ws2, winId);

      expect(getState().getWorkspaceSessions(ws1)).toHaveLength(1);
      expect(getState().getWorkspaceSessions(ws2)).toHaveLength(1);
    });

    it("updateSessionData merges data", () => {
      const wsId = getState().createWorkspace("WS", "project");
      const winId = getState().createWindow("editor");
      const sessId = getState().createSession("S", "ai-chat", wsId, winId);
      
      getState().updateSessionData(sessId, { aiMessages: [{ role: "user", content: "hi" }] });
      expect(getState().sessions[0].data.aiMessages).toHaveLength(1);
    });
  });

  /* ─── IPC ─── */

  describe("IPC Communication", () => {
    it("broadcast adds to ipcLog", () => {
      getState().broadcast("state-sync", { key: "value" });
      expect(getState().ipcLog).toHaveLength(1);
      expect(getState().ipcLog[0].type).toBe("state-sync");
    });

    it("onMessage registers listener and receives messages", () => {
      let received: any = null;
      getState().onMessage("clipboard-share", (msg) => { received = msg; });
      getState().broadcast("clipboard-share", "test-data");
      expect(received).toBeTruthy();
      expect(received.data).toBe("test-data");
    });

    it("onMessage returns unsubscribe function", () => {
      let count = 0;
      const unsub = getState().onMessage("state-sync", () => { count++; });
      getState().broadcast("state-sync", {});
      expect(count).toBe(1);
      unsub();
      getState().broadcast("state-sync", {});
      expect(count).toBe(1);
    });
  });

  /* ─── 剪贴板 ─── */

  describe("Shared Clipboard", () => {
    it("shareToClipboard adds entry", () => {
      getState().shareToClipboard("hello", "text");
      expect(getState().sharedClipboard).toHaveLength(1);
      expect(getState().sharedClipboard[0].content).toBe("hello");
    });

    it("limits to 20 entries", () => {
      for (let i = 0; i < 25; i++) {
        getState().shareToClipboard(`item-${i}`, "text");
      }
      expect(getState().sharedClipboard.length).toBeLessThanOrEqual(20);
    });

    it("clearSharedClipboard empties the list", () => {
      getState().shareToClipboard("a", "text");
      getState().clearSharedClipboard();
      expect(getState().sharedClipboard).toHaveLength(0);
    });
  });

  /* ─── 资源监控 ─── */

  describe("Resource Metrics", () => {
    it("updateMetrics calculates based on active instances", () => {
      getState().createWindow("editor");
      getState().createWindow("terminal");
      getState().updateMetrics();
      const m = getState().metrics;
      expect(m.activeWindows).toBe(2);
      expect(m.memoryUsageMB).toBeGreaterThan(0);
    });
  });
});

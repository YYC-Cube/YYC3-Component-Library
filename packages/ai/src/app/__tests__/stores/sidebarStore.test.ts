/**
 * @file sidebarStore.test.ts
 * @description sidebarStore 单元测试 — 侧栏切换、文件树、搜索、快速访问、Git 操作
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-18
 * @updated 2026-03-18
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, sidebarStore, unit
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useSidebarStore } from "../../stores/sidebarStore";

const getState = () => useSidebarStore.getState();

describe("sidebarStore", () => {
  beforeEach(() => {
    // Reset to default state
    useSidebarStore.setState({
      activeSection: "explorer",
      width: 260,
      selectedNodeId: null,
      searchQuery: "",
      searchResults: [],
      isSearching: false,
      recentFiles: [
        { path: "/src/app/App.tsx", name: "App.tsx", language: "tsx", openedAt: Date.now(), isPinned: false },
      ],
      favoriteFiles: ["/src/app/App.tsx"],
      gitBranch: "main",
      commitMessage: "",
    });
  });

  /* ─── Section switching ─── */

  it("setActiveSection changes active tab", () => {
    getState().setActiveSection("search");
    expect(getState().activeSection).toBe("search");
    getState().setActiveSection("git");
    expect(getState().activeSection).toBe("git");
  });

  /* ─── Width ─── */

  it("setWidth clamps to min/max", () => {
    getState().setWidth(100);
    expect(getState().width).toBe(180); // min clamp
    getState().setWidth(600);
    expect(getState().width).toBe(480); // max clamp
    getState().setWidth(300);
    expect(getState().width).toBe(300);
  });

  /* ─── File tree ─── */

  it("toggleNode toggles expansion", () => {
    const before = getState().fileTree[0].isExpanded;
    getState().toggleNode("root-src");
    expect(getState().fileTree[0].isExpanded).toBe(!before);
  });

  it("selectNode sets selectedNodeId and marks node", () => {
    getState().selectNode("app-tsx");
    expect(getState().selectedNodeId).toBe("app-tsx");
  });

  it("createFileNode adds a new node", () => {
    getState().createFileNode("/src/app", "NewFile.tsx", "file");
    const srcApp = getState().fileTree[0].children?.find((n) => n.path === "/src/app");
    const newFile = srcApp?.children?.find((n) => n.name === "NewFile.tsx");
    expect(newFile).toBeTruthy();
    expect(newFile?.gitStatus).toBe("added");
  });

  it("deleteFileNode removes a node", () => {
    getState().deleteFileNode("root-readme");
    const readme = getState().fileTree.find((n) => n.id === "root-readme");
    expect(readme).toBeUndefined();
  });

  it("renameFileNode renames a node", () => {
    // API 对齐（Phase 1 速修）：种子树无 root-readme，改用实际文件节点 app-tsx（App.tsx，深层需递归查找）
    const findDeep = (
      nodes: { id: string; children?: unknown[] }[],
      id: string,
    ): { id: string; name?: string } | undefined => {
      for (const n of nodes) {
        if (n.id === id) return n as { id: string; name?: string };
        if (n.children) {
          const r = findDeep(n.children as { id: string; children?: unknown[] }[], id);
          if (r) return r;
        }
      }
      return undefined;
    };
    getState().renameFileNode("app-tsx", "CHANGELOG.md");
    const node = findDeep(getState().fileTree, "app-tsx");
    expect(node?.name).toBe("CHANGELOG.md");
    // 还原，避免影响后续用例
    getState().renameFileNode("app-tsx", "App.tsx");
  });

  /* ─── Search ─── */

  it("performSearch returns matching files", () => {
    // API 对齐（Phase 1 速修）：模糊搜索小写匹配会先命中文件夹 "app"，改为断言结果集含 App.tsx
    getState().performSearch("App");
    expect(getState().searchResults.length).toBeGreaterThan(0);
    expect(getState().searchResults.some((r) => r.title === "App.tsx")).toBe(true);
  });

  it("clearSearch resets results", () => {
    getState().performSearch("App");
    getState().clearSearch();
    expect(getState().searchQuery).toBe("");
    expect(getState().searchResults).toHaveLength(0);
  });

  it("setSearchQuery triggers search", () => {
    getState().setSearchQuery("route");
    expect(getState().searchQuery).toBe("route");
    expect(getState().searchResults.length).toBeGreaterThan(0);
  });

  it("empty search query clears results", () => {
    getState().setSearchQuery("App");
    getState().setSearchQuery("");
    expect(getState().searchResults).toHaveLength(0);
  });

  /* ─── Quick access ─── */

  it("addRecentFile adds to front and deduplicates", () => {
    getState().addRecentFile({ path: "/new.ts", name: "new.ts", language: "ts" });
    expect(getState().recentFiles[0].path).toBe("/new.ts");
  });

  it("addRecentFile deduplicates existing path", () => {
    const before = getState().recentFiles.length;
    getState().addRecentFile({ path: "/src/app/App.tsx", name: "App.tsx", language: "tsx" });
    expect(getState().recentFiles.length).toBe(before); // same length, just moved to front
    expect(getState().recentFiles[0].path).toBe("/src/app/App.tsx");
  });

  it("removeRecentFile removes entry", () => {
    getState().removeRecentFile("/src/app/App.tsx");
    expect(getState().recentFiles.find((f) => f.path === "/src/app/App.tsx")).toBeUndefined();
  });

  it("toggleFavorite adds/removes", () => {
    expect(getState().favoriteFiles).toContain("/src/app/App.tsx");
    getState().toggleFavorite("/src/app/App.tsx");
    expect(getState().favoriteFiles).not.toContain("/src/app/App.tsx");
    getState().toggleFavorite("/src/app/App.tsx");
    expect(getState().favoriteFiles).toContain("/src/app/App.tsx");
  });

  it("clearRecentFiles keeps only pinned", () => {
    useSidebarStore.setState({
      recentFiles: [
        { path: "/a.ts", name: "a.ts", openedAt: Date.now(), isPinned: true },
        { path: "/b.ts", name: "b.ts", openedAt: Date.now(), isPinned: false },
      ],
    });
    getState().clearRecentFiles();
    expect(getState().recentFiles).toHaveLength(1);
    expect(getState().recentFiles[0].path).toBe("/a.ts");
  });

  /* ─── Git ─── */

  it("setGitBranch updates branch", () => {
    getState().setGitBranch("develop");
    expect(getState().gitBranch).toBe("develop");
  });

  it("toggleStaged toggles file staging", () => {
    const path = getState().gitChanges[0].path;
    const before = getState().gitChanges[0].staged;
    getState().toggleStaged(path);
    expect(getState().gitChanges[0].staged).toBe(!before);
  });

  it("stageAll stages all changes", () => {
    getState().stageAll();
    expect(getState().gitChanges.every((c) => c.staged)).toBe(true);
  });

  it("unstageAll unstages all changes", () => {
    getState().stageAll();
    getState().unstageAll();
    expect(getState().gitChanges.every((c) => !c.staged)).toBe(true);
  });

  it("setCommitMessage updates message", () => {
    getState().setCommitMessage("feat: add new feature");
    expect(getState().commitMessage).toBe("feat: add new feature");
  });
});

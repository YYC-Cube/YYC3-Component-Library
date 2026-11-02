/**
 * @file sidebarStore.ts
 * @description 左侧侧栏状态管理 — 活动 Tab、文件树、搜索结果、最近文件、Git 状态、收藏夹
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, sidebar, file-tree, search, quick-access, git
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */

export type SidebarSection =
  | "explorer"
  | "search"
  | "tasks"
  | "git"
  | "quick-access"
  | "ai-assistant";

export type FileNodeType = "file" | "directory";
export type GitFileStatus = "unmodified" | "modified" | "added" | "deleted" | "renamed" | "untracked";

export interface FileNode {
  id: string;
  type: FileNodeType;
  name: string;
  path: string;
  parentId?: string;
  children?: FileNode[];
  isExpanded: boolean;
  isSelected: boolean;
  size?: number;
  modifiedAt?: number;
  language?: string;
  isIgnored: boolean;
  gitStatus?: GitFileStatus;
}

export interface SearchResult {
  id: string;
  type: "file" | "content" | "symbol" | "command";
  title: string;
  description?: string;
  filePath: string;
  line?: number;
  column?: number;
  match?: string;
  score: number;
  preview?: string;
}

export interface RecentFile {
  path: string;
  name: string;
  language?: string;
  openedAt: number;
  isPinned: boolean;
}

export interface GitChange {
  path: string;
  name: string;
  status: GitFileStatus;
  staged: boolean;
}

/* ─── Store 接口 ─── */

interface SidebarState {
  activeSection: SidebarSection;
  width: number;

  /* 文件树 */
  fileTree: FileNode[];
  selectedNodeId: string | null;
  expandedNodeIds: string[];

  /* 搜索 */
  searchQuery: string;
  searchType: "files" | "content" | "symbols" | "commands";
  searchResults: SearchResult[];
  isSearching: boolean;

  /* 快速访问 */
  recentFiles: RecentFile[];
  favoriteFiles: string[];

  /* Git */
  gitBranch: string;
  gitChanges: GitChange[];
  commitMessage: string;
}

interface SidebarActions {
  setActiveSection: (section: SidebarSection) => void;
  setWidth: (width: number) => void;

  /* 文件树 */
  setFileTree: (tree: FileNode[]) => void;
  toggleNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  createFileNode: (parentPath: string, name: string, type: FileNodeType) => void;
  deleteFileNode: (nodeId: string) => void;
  renameFileNode: (nodeId: string, newName: string) => void;
  refreshFileTree: () => void;

  /* 搜索 */
  setSearchQuery: (q: string) => void;
  setSearchType: (type: SidebarState["searchType"]) => void;
  performSearch: (query: string) => void;
  clearSearch: () => void;

  /* 快速访问 */
  addRecentFile: (file: Omit<RecentFile, "openedAt" | "isPinned">) => void;
  removeRecentFile: (path: string) => void;
  toggleFavorite: (path: string) => void;
  clearRecentFiles: () => void;

  /* Git */
  setGitBranch: (branch: string) => void;
  setGitChanges: (changes: GitChange[]) => void;
  setCommitMessage: (msg: string) => void;
  toggleStaged: (path: string) => void;
  stageAll: () => void;
  unstageAll: () => void;
}

/* ─── 示例文件树 ─── */

const defaultFileTree: FileNode[] = [
  {
    id: "root-src",
    type: "directory",
    name: "src",
    path: "/src",
    isExpanded: true,
    isSelected: false,
    isIgnored: false,
    children: [
      {
        id: "src-app",
        type: "directory",
        name: "app",
        path: "/src/app",
        parentId: "root-src",
        isExpanded: true,
        isSelected: false,
        isIgnored: false,
        children: [
          { id: "app-tsx", type: "file", name: "App.tsx", path: "/src/app/App.tsx", parentId: "src-app", isExpanded: false, isSelected: false, isIgnored: false, language: "tsx", gitStatus: "unmodified" },
          { id: "routes-ts", type: "file", name: "routes.ts", path: "/src/app/routes.ts", parentId: "src-app", isExpanded: false, isSelected: false, isIgnored: false, language: "ts", gitStatus: "unmodified" },
        ],
      },
      {
        id: "src-components",
        type: "directory",
        name: "components",
        path: "/src/app/components",
        parentId: "root-src",
        isExpanded: false,
        isSelected: false,
        isIgnored: false,
        children: [
          { id: "comp-statusbar", type: "file", name: "StatusBar.tsx", path: "/src/app/components/StatusBar.tsx", parentId: "src-components", isExpanded: false, isSelected: false, isIgnored: false, language: "tsx", gitStatus: "modified" },
        ],
      },
      {
        id: "src-stores",
        type: "directory",
        name: "stores",
        path: "/src/app/stores",
        parentId: "root-src",
        isExpanded: false,
        isSelected: false,
        isIgnored: false,
        children: [
          { id: "store-layout", type: "file", name: "layoutStore.ts", path: "/src/app/stores/layoutStore.ts", parentId: "src-stores", isExpanded: false, isSelected: false, isIgnored: false, language: "ts", gitStatus: "modified" },
          { id: "store-task", type: "file", name: "taskStore.ts", path: "/src/app/stores/taskStore.ts", parentId: "src-stores", isExpanded: false, isSelected: false, isIgnored: false, language: "ts", gitStatus: "added" },
          { id: "store-sidebar", type: "file", name: "sidebarStore.ts", path: "/src/app/stores/sidebarStore.ts", parentId: "src-stores", isExpanded: false, isSelected: false, isIgnored: false, language: "ts", gitStatus: "added" },
        ],
      },
    ],
  },
  {
    id: "root-pkg",
    type: "file",
    name: "package.json",
    path: "/package.json",
    isExpanded: false,
    isSelected: false,
    isIgnored: false,
    language: "json",
    gitStatus: "unmodified",
  },
  {
    id: "root-readme",
    type: "file",
    name: "README.md",
    path: "/README.md",
    isExpanded: false,
    isSelected: false,
    isIgnored: false,
    language: "md",
    gitStatus: "unmodified",
  },
];

/* ─── 示例 Git 变更 ─── */
const defaultGitChanges: GitChange[] = [
  { path: "/src/app/components/StatusBar.tsx", name: "StatusBar.tsx", status: "modified", staged: false },
  { path: "/src/app/stores/layoutStore.ts", name: "layoutStore.ts", status: "modified", staged: true },
  { path: "/src/app/stores/taskStore.ts", name: "taskStore.ts", status: "added", staged: true },
  { path: "/src/app/stores/sidebarStore.ts", name: "sidebarStore.ts", status: "added", staged: false },
];

/* ─── 工具函数 ─── */

function toggleNodeInTree(tree: FileNode[], nodeId: string): FileNode[] {
  return tree.map((node) => {
    if (node.id === nodeId) {
      return { ...node, isExpanded: !node.isExpanded };
    }
    if (node.children) {
      return { ...node, children: toggleNodeInTree(node.children, nodeId) };
    }
    return node;
  });
}

function selectNodeInTree(tree: FileNode[], nodeId: string | null): FileNode[] {
  return tree.map((node) => {
    const selected = node.id === nodeId;
    const children = node.children ? selectNodeInTree(node.children, nodeId) : undefined;
    return { ...node, isSelected: selected, children };
  });
}

function fuzzySearch(query: string, tree: FileNode[], results: SearchResult[]): void {
  const q = query.toLowerCase();
  for (const node of tree) {
    if (node.name.toLowerCase().includes(q)) {
      results.push({
        id: node.id,
        type: "file",
        title: node.name,
        filePath: node.path,
        score: node.name.toLowerCase().startsWith(q) ? 1 : 0.6,
        description: node.path,
      });
    }
    if (node.children) fuzzySearch(query, node.children, results);
  }
}

/* ─── Store 创建 ─── */

export const useSidebarStore = create<SidebarState & SidebarActions>()(
  persist(
    (set, get) => ({
      activeSection: "explorer",
      width: 260,
      fileTree: defaultFileTree,
      selectedNodeId: null,
      expandedNodeIds: ["root-src", "src-app"],
      searchQuery: "",
      searchType: "files",
      searchResults: [],
      isSearching: false,
      recentFiles: [
        { path: "/src/app/App.tsx", name: "App.tsx", language: "tsx", openedAt: Date.now() - 60_000, isPinned: false },
        { path: "/src/app/stores/layoutStore.ts", name: "layoutStore.ts", language: "ts", openedAt: Date.now() - 120_000, isPinned: true },
        { path: "/src/app/stores/taskStore.ts", name: "taskStore.ts", language: "ts", openedAt: Date.now() - 180_000, isPinned: false },
      ],
      favoriteFiles: ["/src/app/App.tsx"],
      gitBranch: "main",
      gitChanges: defaultGitChanges,
      commitMessage: "",

      setActiveSection: (section) => set({ activeSection: section }),
      setWidth: (width) => set({ width: Math.max(180, Math.min(480, width)) }),

      /* 文件树 */
      setFileTree: (tree) => set({ fileTree: tree }),
      toggleNode: (nodeId) => set((s) => ({ fileTree: toggleNodeInTree(s.fileTree, nodeId) })),
      selectNode: (nodeId) => set((s) => ({ selectedNodeId: nodeId, fileTree: selectNodeInTree(s.fileTree, nodeId) })),
      createFileNode: (parentPath, name, type) => {
        // 模拟创建：后续接入 Tauri FS Bridge
        const id = `node-${Date.now()}`;
        const newNode: FileNode = { id, type, name, path: `${parentPath}/${name}`, isExpanded: false, isSelected: false, isIgnored: false, gitStatus: "added" };
        set((s) => {
          const insertInto = (nodes: FileNode[]): FileNode[] =>
            nodes.map((n) => {
              if (n.path === parentPath && n.type === "directory") {
                return { ...n, children: [...(n.children || []), newNode], isExpanded: true };
              }
              if (n.children) return { ...n, children: insertInto(n.children) };
              return n;
            });
          return { fileTree: insertInto(s.fileTree) };
        });
      },
      deleteFileNode: (nodeId) => {
        const removeFrom = (nodes: FileNode[]): FileNode[] =>
          nodes.filter((n) => n.id !== nodeId).map((n) => (n.children ? { ...n, children: removeFrom(n.children) } : n));
        set((s) => ({ fileTree: removeFrom(s.fileTree) }));
      },
      renameFileNode: (nodeId, newName) => {
        const renameIn = (nodes: FileNode[]): FileNode[] =>
          nodes.map((n) => {
            if (n.id === nodeId) return { ...n, name: newName };
            if (n.children) return { ...n, children: renameIn(n.children) };
            return n;
          });
        set((s) => ({ fileTree: renameIn(s.fileTree) }));
      },
      refreshFileTree: () => set({ fileTree: defaultFileTree }),

      /* 搜索 */
      setSearchQuery: (q) => {
        set({ searchQuery: q });
        if (q.trim()) get().performSearch(q);
        else set({ searchResults: [] });
      },
      setSearchType: (type) => set({ searchType: type }),
      performSearch: (query) => {
        set({ isSearching: true });
        const results: SearchResult[] = [];
        fuzzySearch(query, get().fileTree, results);
        results.sort((a, b) => b.score - a.score);
        set({ searchResults: results.slice(0, 50), isSearching: false });
      },
      clearSearch: () => set({ searchQuery: "", searchResults: [], isSearching: false }),

      /* 快速访问 */
      addRecentFile: (file) => {
        set((s) => {
          const filtered = s.recentFiles.filter((f) => f.path !== file.path);
          return { recentFiles: [{ ...file, openedAt: Date.now(), isPinned: false }, ...filtered].slice(0, 20) };
        });
      },
      removeRecentFile: (path) => set((s) => ({ recentFiles: s.recentFiles.filter((f) => f.path !== path) })),
      toggleFavorite: (path) => {
        set((s) => {
          const has = s.favoriteFiles.includes(path);
          return { favoriteFiles: has ? s.favoriteFiles.filter((f) => f !== path) : [...s.favoriteFiles, path] };
        });
      },
      clearRecentFiles: () => set((s) => ({ recentFiles: s.recentFiles.filter((f) => f.isPinned) })),

      /* Git */
      setGitBranch: (branch) => set({ gitBranch: branch }),
      setGitChanges: (changes) => set({ gitChanges: changes }),
      setCommitMessage: (msg) => set({ commitMessage: msg }),
      toggleStaged: (path) => {
        set((s) => ({
          gitChanges: s.gitChanges.map((c) => (c.path === path ? { ...c, staged: !c.staged } : c)),
        }));
      },
      stageAll: () => set((s) => ({ gitChanges: s.gitChanges.map((c) => ({ ...c, staged: true })) })),
      unstageAll: () => set((s) => ({ gitChanges: s.gitChanges.map((c) => ({ ...c, staged: false })) })),
    }),
    {
      name: "yyc3-sidebar",
      partialize: (s) => ({
        activeSection: s.activeSection,
        width: s.width,
        expandedNodeIds: s.expandedNodeIds,
        recentFiles: s.recentFiles,
        favoriteFiles: s.favoriteFiles,
      }),
    }
  )
);
/**
 * @file fileSystemStore.ts
 * @description 文件系统 Zustand 状态管理 — 工作区、文件树、版本历史、拖放导入、最近文件
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, filesystem, workspace, version-control, drag-drop
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */
export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  language?: string;
  size?: number;
  children?: FileNode[];
  isExpanded?: boolean;
  modifiedAt: number;
  createdAt: number;
}

export interface FileVersion {
  id: string;
  filePath: string;
  content: string;
  timestamp: number;
  label?: string;
  size: number;
  hash: string;
}

export interface RecentFile {
  path: string;
  name: string;
  language?: string;
  openedAt: number;
}

export interface FileContent {
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
}

/* ─── 模拟文件树 ─── */
const mockFileTree: FileNode[] = [
  {
    id: "d-src", name: "src", type: "folder", path: "/src", isExpanded: true,
    modifiedAt: Date.now(), createdAt: Date.now() - 86400000,
    children: [
      {
        id: "d-app", name: "app", type: "folder", path: "/src/app", isExpanded: true,
        modifiedAt: Date.now(), createdAt: Date.now() - 86400000,
        children: [
          { id: "f-app-tsx", name: "App.tsx", type: "file", path: "/src/app/App.tsx", language: "typescript", size: 420, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
          { id: "f-routes", name: "routes.ts", type: "file", path: "/src/app/routes.ts", language: "typescript", size: 860, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
          {
            id: "d-components", name: "components", type: "folder", path: "/src/app/components",
            modifiedAt: Date.now(), createdAt: Date.now() - 86400000,
            children: [
              {
                id: "d-homepage", name: "homepage", type: "folder", path: "/src/app/components/homepage",
                modifiedAt: Date.now(), createdAt: Date.now() - 86400000,
                children: [
                  { id: "f-aurora", name: "AuroraBackground.tsx", type: "file", path: "/src/app/components/homepage/AuroraBackground.tsx", language: "typescript", size: 3200, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
                  { id: "f-brand", name: "BrandHeader.tsx", type: "file", path: "/src/app/components/homepage/BrandHeader.tsx", language: "typescript", size: 2800, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
                  { id: "f-chatbox", name: "ChatBox.tsx", type: "file", path: "/src/app/components/homepage/ChatBox.tsx", language: "typescript", size: 4500, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
                  { id: "f-recent", name: "RecentProjects.tsx", type: "file", path: "/src/app/components/homepage/RecentProjects.tsx", language: "typescript", size: 2100, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
                ],
              },
              {
                id: "d-panels", name: "panels", type: "folder", path: "/src/app/components/panels",
                modifiedAt: Date.now(), createdAt: Date.now() - 86400000,
                children: [
                  { id: "f-workspace", name: "WorkspaceContainer.tsx", type: "file", path: "/src/app/components/panels/WorkspaceContainer.tsx", language: "typescript", size: 2600, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
                  { id: "f-panelview", name: "PanelView.tsx", type: "file", path: "/src/app/components/panels/PanelView.tsx", language: "typescript", size: 5400, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
                  { id: "f-tabbar", name: "TabBar.tsx", type: "file", path: "/src/app/components/panels/TabBar.tsx", language: "typescript", size: 3800, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
                ],
              },
            ],
          },
          {
            id: "d-pages", name: "pages", type: "folder", path: "/src/app/pages",
            modifiedAt: Date.now(), createdAt: Date.now() - 86400000,
            children: [
              { id: "f-home", name: "HomePage.tsx", type: "file", path: "/src/app/pages/HomePage.tsx", language: "typescript", size: 1200, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
              { id: "f-layout-page", name: "LayoutDesignerPage.tsx", type: "file", path: "/src/app/pages/LayoutDesignerPage.tsx", language: "typescript", size: 6200, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
              { id: "f-settings", name: "SettingsPage.tsx", type: "file", path: "/src/app/pages/SettingsPage.tsx", language: "typescript", size: 5600, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
              { id: "f-ai-settings", name: "AISettingsPage.tsx", type: "file", path: "/src/app/pages/AISettingsPage.tsx", language: "typescript", size: 12400, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
            ],
          },
          {
            id: "d-stores", name: "stores", type: "folder", path: "/src/app/stores",
            modifiedAt: Date.now(), createdAt: Date.now() - 86400000,
            children: [
              { id: "f-layout-store", name: "layoutStore.ts", type: "file", path: "/src/app/stores/layoutStore.ts", language: "typescript", size: 12200, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
              { id: "f-preview-store", name: "previewStore.ts", type: "file", path: "/src/app/stores/previewStore.ts", language: "typescript", size: 7400, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
              { id: "f-ai-store", name: "aiServiceStore.ts", type: "file", path: "/src/app/stores/aiServiceStore.ts", language: "typescript", size: 9200, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
              { id: "f-conv-store", name: "conversationStore.ts", type: "file", path: "/src/app/stores/conversationStore.ts", language: "typescript", size: 3400, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
            ],
          },
        ],
      },
      {
        id: "d-styles", name: "styles", type: "folder", path: "/src/styles",
        modifiedAt: Date.now(), createdAt: Date.now() - 86400000,
        children: [
          { id: "f-index-css", name: "index.css", type: "file", path: "/src/styles/index.css", language: "css", size: 580, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
          { id: "f-theme-css", name: "theme.css", type: "file", path: "/src/styles/theme.css", language: "css", size: 2200, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
          { id: "f-fonts-css", name: "fonts.css", type: "file", path: "/src/styles/fonts.css", language: "css", size: 340, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
        ],
      },
    ],
  },
  { id: "f-pkg", name: "package.json", type: "file", path: "/package.json", language: "json", size: 1800, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
  { id: "f-readme", name: "README.md", type: "file", path: "/README.md", language: "markdown", size: 4200, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
  { id: "f-tsconfig", name: "tsconfig.json", type: "file", path: "/tsconfig.json", language: "json", size: 720, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
  { id: "f-vite", name: "vite.config.ts", type: "file", path: "/vite.config.ts", language: "typescript", size: 480, modifiedAt: Date.now(), createdAt: Date.now() - 86400000 },
];

/* ─── 模拟版本历史 ─── */
function mockVersions(path: string): FileVersion[] {
  const now = Date.now();
  return [
    { id: "v3", filePath: path, content: "// v3 当前版本", timestamp: now, label: "当前", size: 420, hash: "abc3" },
    { id: "v2", filePath: path, content: "// v2 添加路由", timestamp: now - 3600000, label: "添加路由配置", size: 380, hash: "abc2" },
    { id: "v1", filePath: path, content: "// v1 初始版本", timestamp: now - 7200000, label: "初始创建", size: 120, hash: "abc1" },
  ];
}

/* ─── Store 接口 ─── */
interface FileSystemStore {
  workspace: string;
  fileTree: FileNode[];
  selectedPath: string | null;
  expandedFolders: Set<string>;
  recentFiles: RecentFile[];
  versions: Record<string, FileVersion[]>;
  openFiles: FileContent[];
  clipboard: { action: "copy" | "cut"; path: string } | null;
  searchQuery: string;
  searchResults: FileNode[];
  isDragging: boolean;

  /* 工作区 */
  setWorkspace: (path: string) => void;

  /* 文件操作 */
  selectFile: (path: string) => void;
  toggleFolder: (path: string) => void;
  createFile: (parentPath: string, name: string) => void;
  createFolder: (parentPath: string, name: string) => void;
  renameNode: (path: string, newName: string) => void;
  deleteNode: (path: string) => void;
  duplicateFile: (path: string) => void;

  /* 剪贴板 */
  copyNode: (path: string) => void;
  cutNode: (path: string) => void;
  pasteNode: (targetFolder: string) => void;

  /* 搜索 */
  setSearchQuery: (query: string) => void;

  /* 版本控制 */
  getVersions: (path: string) => FileVersion[];
  rollback: (path: string, versionId: string) => void;
  createVersion: (path: string, label?: string) => void;

  /* 最近文件 */
  addRecentFile: (file: RecentFile) => void;
  clearRecentFiles: () => void;

  /* 拖放 */
  setDragging: (dragging: boolean) => void;
  handleDrop: (files: File[]) => void;

  /* 辅助 */
  getNode: (path: string) => FileNode | undefined;
  getParentPath: (path: string) => string;
  getTotalFiles: () => number;
  getTotalSize: () => number;
}

/* ─── 辅助函数 ─── */
const uid = () => crypto.randomUUID().slice(0, 8);

function findNode(nodes: FileNode[], path: string): FileNode | undefined {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findNode(node.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

function findParentAndInsert(nodes: FileNode[], parentPath: string, newNode: FileNode): FileNode[] {
  return nodes.map((n) => {
    if (n.path === parentPath && n.type === "folder") {
      return { ...n, children: [...(n.children || []), newNode] };
    }
    if (n.children) {
      return { ...n, children: findParentAndInsert(n.children, parentPath, newNode) };
    }
    return n;
  });
}

function removeNode(nodes: FileNode[], path: string): FileNode[] {
  return nodes
    .filter((n) => n.path !== path)
    .map((n) => (n.children ? { ...n, children: removeNode(n.children, path) } : n));
}

function renameInTree(nodes: FileNode[], path: string, newName: string): FileNode[] {
  return nodes.map((n) => {
    if (n.path === path) {
      const parts = path.split("/");
      parts[parts.length - 1] = newName;
      return { ...n, name: newName, path: parts.join("/"), modifiedAt: Date.now() };
    }
    if (n.children) return { ...n, children: renameInTree(n.children, path, newName) };
    return n;
  });
}

function countFiles(nodes: FileNode[]): number {
  let count = 0;
  for (const n of nodes) {
    if (n.type === "file") count++;
    if (n.children) count += countFiles(n.children);
  }
  return count;
}

function totalSize(nodes: FileNode[]): number {
  let size = 0;
  for (const n of nodes) {
    if (n.type === "file") size += n.size || 0;
    if (n.children) size += totalSize(n.children);
  }
  return size;
}

function searchTree(nodes: FileNode[], query: string): FileNode[] {
  const results: FileNode[] = [];
  const q = query.toLowerCase();
  for (const n of nodes) {
    if (n.name.toLowerCase().includes(q)) results.push(n);
    if (n.children) results.push(...searchTree(n.children, query));
  }
  return results;
}

/* ─── Store 实现 ─── */
export const useFileSystemStore = create<FileSystemStore>()(
  persist(
    (set, get) => ({
      workspace: "~/Documents/YYC3-AI-Code",
      fileTree: mockFileTree,
      selectedPath: null,
      expandedFolders: new Set(["/src", "/src/app"]),
      recentFiles: [
        { path: "/src/app/App.tsx", name: "App.tsx", language: "typescript", openedAt: Date.now() - 60000 },
        { path: "/src/app/routes.ts", name: "routes.ts", language: "typescript", openedAt: Date.now() - 120000 },
        { path: "/src/styles/theme.css", name: "theme.css", language: "css", openedAt: Date.now() - 300000 },
      ],
      versions: {},
      openFiles: [],
      clipboard: null,
      searchQuery: "",
      searchResults: [],
      isDragging: false,

      setWorkspace: (path) => set({ workspace: path }),

      selectFile: (path) => {
        const node = findNode(get().fileTree, path);
        set({ selectedPath: path });
        if (node && node.type === "file") {
          get().addRecentFile({ path, name: node.name, language: node.language, openedAt: Date.now() });
        }
      },

      toggleFolder: (path) => {
        const expanded = new Set(get().expandedFolders);
        if (expanded.has(path)) expanded.delete(path);
        else expanded.add(path);
        set({ expandedFolders: expanded });
      },

      createFile: (parentPath, name) => {
        const newNode: FileNode = {
          id: `f-${uid()}`, name, type: "file", path: `${parentPath}/${name}`,
          language: name.endsWith(".ts") || name.endsWith(".tsx") ? "typescript" : name.endsWith(".css") ? "css" : "text",
          size: 0, modifiedAt: Date.now(), createdAt: Date.now(),
        };
        set({ fileTree: findParentAndInsert(get().fileTree, parentPath, newNode) });
      },

      createFolder: (parentPath, name) => {
        const newNode: FileNode = {
          id: `d-${uid()}`, name, type: "folder", path: `${parentPath}/${name}`,
          children: [], modifiedAt: Date.now(), createdAt: Date.now(),
        };
        set({ fileTree: findParentAndInsert(get().fileTree, parentPath, newNode) });
      },

      renameNode: (path, newName) => {
        set({ fileTree: renameInTree(get().fileTree, path, newName) });
      },

      deleteNode: (path) => {
        set({
          fileTree: removeNode(get().fileTree, path),
          selectedPath: get().selectedPath === path ? null : get().selectedPath,
        });
      },

      duplicateFile: (path) => {
        const node = findNode(get().fileTree, path);
        if (!node || node.type !== "file") return;
        const parent = get().getParentPath(path);
        const ext = node.name.includes(".") ? "." + node.name.split(".").pop() : "";
        const base = node.name.replace(ext, "");
        get().createFile(parent, `${base}-copy${ext}`);
      },

      copyNode: (path) => set({ clipboard: { action: "copy", path } }),
      cutNode: (path) => set({ clipboard: { action: "cut", path } }),

      pasteNode: (targetFolder) => {
        const { clipboard, fileTree } = get();
        if (!clipboard) return;
        const node = findNode(fileTree, clipboard.path);
        if (!node) return;
        const newNode = { ...node, id: `${node.type === "file" ? "f" : "d"}-${uid()}`, path: `${targetFolder}/${node.name}` };
        let newTree = findParentAndInsert(fileTree, targetFolder, newNode);
        if (clipboard.action === "cut") newTree = removeNode(newTree, clipboard.path);
        set({ fileTree: newTree, clipboard: null });
      },

      setSearchQuery: (query) => {
        const results = query ? searchTree(get().fileTree, query) : [];
        set({ searchQuery: query, searchResults: results });
      },

      getVersions: (path) => {
        if (!get().versions[path]) {
          set((s) => ({ versions: { ...s.versions, [path]: mockVersions(path) } }));
        }
        return get().versions[path] || [];
      },

      rollback: (path, versionId) => {
        const versions = get().versions[path];
        if (!versions) return;
        const version = versions.find((v) => v.id === versionId);
        if (version) {
          const newVersion: FileVersion = {
            id: `v-${uid()}`, filePath: path, content: version.content,
            timestamp: Date.now(), label: `回滚至 ${version.label || version.id}`,
            size: version.size, hash: `r-${uid()}`,
          };
          set((s) => ({
            versions: { ...s.versions, [path]: [newVersion, ...(s.versions[path] || [])] },
          }));
        }
      },

      createVersion: (path, label) => {
        const newVersion: FileVersion = {
          id: `v-${uid()}`, filePath: path, content: "// 新版本内容",
          timestamp: Date.now(), label: label || "手动保存",
          size: 0, hash: `h-${uid()}`,
        };
        set((s) => ({
          versions: { ...s.versions, [path]: [newVersion, ...(s.versions[path] || [])] },
        }));
      },

      addRecentFile: (file) => {
        set((s) => ({
          recentFiles: [file, ...s.recentFiles.filter((f) => f.path !== file.path)].slice(0, 20),
        }));
      },

      clearRecentFiles: () => set({ recentFiles: [] }),

      setDragging: (dragging) => set({ isDragging: dragging }),

      handleDrop: (files) => {
        const { selectedPath, fileTree } = get();
        const targetFolder = selectedPath
          ? (findNode(fileTree, selectedPath)?.type === "folder" ? selectedPath : get().getParentPath(selectedPath))
          : "/src";
        files.forEach((file) => {
          const ext = file.name.split(".").pop() || "";
          const lang = ["ts", "tsx"].includes(ext) ? "typescript" : ext === "css" ? "css" : ext === "json" ? "json" : "text";
          const newNode: FileNode = {
            id: `f-${uid()}`, name: file.name, type: "file", path: `${targetFolder}/${file.name}`,
            language: lang, size: file.size, modifiedAt: Date.now(), createdAt: Date.now(),
          };
          set({ fileTree: findParentAndInsert(get().fileTree, targetFolder, newNode) });
        });
        set({ isDragging: false });
      },

      getNode: (path) => findNode(get().fileTree, path),
      getParentPath: (path) => path.split("/").slice(0, -1).join("/") || "/",
      getTotalFiles: () => countFiles(get().fileTree),
      getTotalSize: () => totalSize(get().fileTree),
    }),
    {
      name: "yyc3-filesystem",
      partialize: (state) => ({
        workspace: state.workspace,
        recentFiles: state.recentFiles,
        expandedFolders: Array.from(state.expandedFolders),
      }),
      merge: (persisted: any, current) => ({
        ...current,
        ...(persisted || {}),
        expandedFolders: new Set(persisted?.expandedFolders || ["/src", "/src/app"]),
      }),
    }
  )
);

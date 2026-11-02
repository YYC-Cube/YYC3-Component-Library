/**
 * @file FileBrowserPanel.tsx
 * @description 文件浏览器面板 v4.0 — 双击编辑器联动 + 折叠记忆 + workspaceContext 同步 + 拖拽排序
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v4.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, file-browser, tree, editor-link, context-sync, preview, drag-sort
 */

import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  ChevronRight, ChevronDown, File, Folder, FolderOpen,
  FileCode, FileText, Settings, Search,
  Trash2, Pencil, Copy, Scissors, Clipboard, FolderPlus,
  FilePlus, History, Upload,
  Clock, HardDrive, X, Check,
} from "lucide-react";
import { useFileSystemStore, type FileNode } from "../../../stores/fileSystemStore";
import { useLayoutStore } from "../../../stores/layoutStore";
import { useWorkspaceContextStore } from "../../../stores/workspaceContextStore";

/* ─── 右键菜单项类型 ─── */
type ContextMenuAction = {
  icon: React.ElementType;
  label: string;
  action: () => void;
  danger?: boolean;
};
type ContextMenuDivider = { divider: true };
type ContextMenuItem = ContextMenuAction | ContextMenuDivider;

function isMenuDivider(item: ContextMenuItem): item is ContextMenuDivider {
  return "divider" in item && item.divider === true;
}

/* ─── 文件类型筛选标签 ─── */
const fileTypeFilters = [
  { key: "all", label: "全部", color: "rgba(255,255,255,0.4)" },
  { key: "ts", label: "TS", color: "#3178c6" },
  { key: "css", label: "CSS", color: "#a855f7" },
  { key: "json", label: "JSON", color: "#cbcb41" },
  { key: "md", label: "MD", color: "#519aba" },
  { key: "other", label: "其他", color: "rgba(255,255,255,0.3)" },
];

function matchesTypeFilter(node: FileNode, filter: string): boolean {
  if (filter === "all") return true;
  if (node.type === "folder") return true; // always show folders
  const lang = node.language || "";
  if (filter === "ts") return lang === "typescript" || lang === "javascript" || node.name.endsWith(".tsx") || node.name.endsWith(".ts");
  if (filter === "css") return lang === "css" || node.name.endsWith(".css") || node.name.endsWith(".scss");
  if (filter === "json") return lang === "json" || node.name.endsWith(".json");
  if (filter === "md") return lang === "markdown" || node.name.endsWith(".md");
  if (filter === "other") return !["typescript", "javascript", "css", "json", "markdown"].includes(lang);
  return true;
}

function filterTree(nodes: FileNode[], filter: string): FileNode[] {
  if (filter === "all") return nodes;
  return nodes
    .map((node) => {
      if (node.type === "folder" && node.children) {
        const filtered = filterTree(node.children, filter);
        if (filtered.length > 0) return { ...node, children: filtered };
        return null;
      }
      return matchesTypeFilter(node, filter) ? node : null;
    })
    .filter(Boolean) as FileNode[];
}

/* ─── 文件预览弹窗 ─── */
const FilePreviewTooltip: React.FC<{ node: FileNode; x: number; y: number }> = ({ node, x, y }) => {
  const ext = node.name.split(".").pop()?.toLowerCase() || "";
  const langLabel: Record<string, string> = {
    typescript: "TypeScript", javascript: "JavaScript", css: "CSS",
    json: "JSON", markdown: "Markdown", html: "HTML",
  };

  // Mock preview content
  const previewContent: Record<string, string> = {
    typescript: `import React from "react";\nimport { useState } from "react";\n\nexport const Component = () => {\n  const [state, setState] = useState(0);\n  return <div>{state}</div>;\n};`,
    css: `:root {\n  --primary: #00ff87;\n  --bg: #14142a;\n}\n\n.container {\n  display: flex;\n  gap: 8px;\n}`,
    json: `{\n  "name": "yyc3-ai-code",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0"\n  }\n}`,
    markdown: `# YYC³ AI Code\n\n## 简介\n\n多联式智能AI编程工具\n\n- 实时预览\n- AI 辅助`,
  };

  const content = previewContent[node.language || ""] || `// ${node.name}\n// 文件预览...`;

  return (
    <div
      className="fixed z-[997] rounded-xl overflow-hidden pointer-events-none"
      style={{
        left: Math.min(x + 12, window.innerWidth - 280),
        top: Math.min(y - 10, window.innerHeight - 220),
        width: "260px",
        background: "rgba(15,15,30,0.98)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* 标题 */}
      <div className="flex items-center gap-2 px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        {getFileIcon(node, false)}
        <span className="truncate" style={{ fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>{node.name}</span>
        <span className="ml-auto px-1.5 rounded" style={{ fontSize: "8px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
          {langLabel[node.language || ""] || ext.toUpperCase()}
        </span>
      </div>
      {/* 代码预览 */}
      <div className="px-3 py-2 overflow-hidden" style={{ maxHeight: "160px", fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "10px", lineHeight: "15px", color: "rgba(255,255,255,0.45)" }}>
        <pre className="whitespace-pre-wrap">{content}</pre>
      </div>
      {/* 元信息 */}
      <div className="flex items-center gap-3 px-3 py-1" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>
        {node.size != null && <span>{node.size > 1024 ? `${(node.size / 1024).toFixed(1)} KB` : `${node.size} B`}</span>}
        {node.modifiedAt && <span>{new Date(node.modifiedAt).toLocaleDateString()}</span>}
      </div>
    </div>
  );
};

/* ─── 文件图标 ─── */
function getFileIcon(node: FileNode, isOpen: boolean) {
  if (node.type === "folder") {
    return isOpen ? <FolderOpen size={14} style={{ color: "#e8a838" }} /> : <Folder size={14} style={{ color: "#e8a838" }} />;
  }
  if (node.language === "typescript") return <FileCode size={14} style={{ color: "#3178c6" }} />;
  if (node.language === "css") return <FileText size={14} style={{ color: "#a855f7" }} />;
  if (node.language === "json") return <Settings size={14} style={{ color: "#cbcb41" }} />;
  if (node.language === "markdown") return <FileText size={14} style={{ color: "#519aba" }} />;
  return <File size={14} style={{ color: "rgba(255,255,255,0.5)" }} />;
}

/* ─── 右键菜单 ─── */
const ContextMenu: React.FC<{
  x: number;
  y: number;
  node: FileNode;
  onClose: () => void;
}> = ({ x, y, node, onClose }) => {
  const { deleteNode, renameNode, duplicateFile, copyNode, cutNode, pasteNode, clipboard, createFile, createFolder, createVersion } = useFileSystemStore();
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);

  const items: ContextMenuItem[] = [
    ...(node.type === "folder"
      ? [
          { icon: FilePlus, label: "新建文件", action: () => { createFile(node.path, `new-file-${Date.now() % 1000}.ts`); onClose(); } },
          { icon: FolderPlus, label: "新建文件夹", action: () => { createFolder(node.path, `new-folder-${Date.now() % 1000}`); onClose(); } },
          { divider: true },
        ]
      : []),
    { icon: Pencil, label: "重命名", action: () => setRenaming(true) },
    { icon: Copy, label: "复制", action: () => { copyNode(node.path); onClose(); } },
    { icon: Scissors, label: "剪切", action: () => { cutNode(node.path); onClose(); } },
    ...(clipboard && node.type === "folder"
      ? [{ icon: Clipboard, label: "粘贴", action: () => { pasteNode(node.path); onClose(); } }]
      : []),
    ...(node.type === "file"
      ? [{ icon: Copy, label: "复制副本", action: () => { duplicateFile(node.path); onClose(); } }]
      : []),
    { divider: true },
    ...(node.type === "file"
      ? [{ icon: History, label: "创建版本快照", action: () => { createVersion(node.path, "手动快照"); onClose(); } }]
      : []),
    { icon: Trash2, label: "删除", action: () => { deleteNode(node.path); onClose(); }, danger: true },
  ];

  if (renaming) {
    return (
      <div
        className="fixed z-[999] rounded-lg p-2"
        style={{ left: x, top: y, background: "rgba(20,20,35,0.97)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
      >
        <div className="flex items-center gap-1.5">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newName.trim()) { renameNode(node.path, newName.trim()); onClose(); }
              if (e.key === "Escape") onClose();
            }}
            autoFocus
            className="flex-1 px-2 py-1 rounded bg-transparent outline-none"
            style={{ fontSize: "12px", border: "1px solid rgba(0,255,135,0.3)", color: "rgba(255,255,255,0.9)", minWidth: "160px" }}
          />
          <button onClick={() => { if (newName.trim()) { renameNode(node.path, newName.trim()); onClose(); } }} className="w-5 h-5 flex items-center justify-center rounded" style={{ background: "rgba(0,255,135,0.1)", color: "#00ff87" }}>
            <Check size={10} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[998]" onClick={onClose} />
      <div
        className="fixed z-[999] rounded-lg py-1 overflow-hidden"
        style={{ left: x, top: y, background: "rgba(20,20,35,0.97)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", minWidth: "160px" }}
      >
        {items.map((item, i) => {
          if (isMenuDivider(item)) {
            return <div key={i} className="my-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />;
          }
          const menuItem = item;
          return (
            <button
              key={i}
              onClick={menuItem.action}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors"
              style={{ fontSize: "11.5px", color: menuItem.danger ? "#ff6b6b" : "rgba(255,255,255,0.7)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = menuItem.danger ? "rgba(255,50,50,0.08)" : "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {menuItem.icon && React.createElement(menuItem.icon, { size: 12, className: "opacity-50" })}
              <span>{menuItem.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

/* ─── 版本面板 ─── */
const VersionPanel: React.FC<{ path: string; onClose: () => void }> = ({ path, onClose }) => {
  const { getVersions, rollback } = useFileSystemStore();
  const versions = getVersions(path);
  const fileName = path.split("/").pop();

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,22,0.5)" }}>
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <History size={11} style={{ color: "#60efff" }} />
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>版本历史 — {fileName}</span>
        </div>
        <button onClick={onClose} className="opacity-30 hover:opacity-70 transition-opacity"><X size={11} /></button>
      </div>
      <div className="max-h-[140px] overflow-y-auto">
        {versions.map((v, i) => (
          <div
            key={v.id}
            className="flex items-center gap-2 px-3 py-1.5 transition-colors"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: "11px" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: i === 0 ? "#00ff87" : "rgba(255,255,255,0.2)" }} />
            <div className="flex-1 min-w-0">
              <span className="opacity-60">{v.label || v.id}</span>
              <span className="ml-2 opacity-25" style={{ fontSize: "9px" }}>{new Date(v.timestamp).toLocaleString()}</span>
            </div>
            {i > 0 && (
              <button
                onClick={() => rollback(path, v.id)}
                className="px-1.5 py-0.5 rounded transition-colors"
                style={{ fontSize: "9px", color: "#60efff", background: "rgba(96,239,255,0.06)", border: "1px solid rgba(96,239,255,0.12)" }}
              >
                回滚
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── 树节点 ─── */
const TreeItem: React.FC<{
  node: FileNode;
  depth: number;
}> = ({ node, depth }) => {
  const { selectedPath, selectFile, toggleFolder, expandedFolders } = useFileSystemStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSelected = selectedPath === node.path;
  const isOpen = node.type === "folder" && expandedFolders.has(node.path);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
    // Show preview after 600ms for files only
    if (node.type === "file") {
      previewTimer.current = setTimeout(() => {
        setPreview({ x: e.clientX, y: e.clientY });
      }, 600);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
    if (previewTimer.current) clearTimeout(previewTimer.current);
    setPreview(null);
  };

  return (
    <div>
      <div
        className="flex items-center gap-1.5 py-[3px] px-2 cursor-pointer transition-colors duration-100"
        style={{
          paddingLeft: `${depth * 14 + 8}px`,
          background: isSelected ? "rgba(0,255,135,0.08)" : "transparent",
          color: isSelected ? "#00ff87" : "rgba(255,255,255,0.7)",
          fontSize: "13px",
        }}
        onClick={() => {
          if (node.type === "folder") toggleFolder(node.path);
          else selectFile(node.path);
        }}
        onContextMenu={handleContextMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {node.type === "folder" ? (
          isOpen ? <ChevronDown size={12} className="flex-shrink-0 opacity-50" /> : <ChevronRight size={12} className="flex-shrink-0 opacity-50" />
        ) : (
          <span className="w-3 flex-shrink-0" />
        )}
        {getFileIcon(node, isOpen)}
        <span className="truncate flex-1">{node.name}</span>
        {node.type === "file" && node.size != null && (
          <span className="opacity-20 flex-shrink-0" style={{ fontSize: "9px" }}>
            {node.size > 1024 ? `${(node.size / 1024).toFixed(1)}KB` : `${node.size}B`}
          </span>
        )}
      </div>

      {node.type === "folder" && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}

      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} node={node} onClose={() => setContextMenu(null)} />
      )}

      {preview && node.type === "file" && (
        <FilePreviewTooltip node={node} x={preview.x} y={preview.y} />
      )}
    </div>
  );
};

/* ─── 主面板 ─── */
export const FileBrowserPanel: React.FC = () => {
  const {
    workspace, fileTree, selectedPath, searchQuery, setSearchQuery,
    searchResults, recentFiles, isDragging, setDragging, handleDrop,
    createFile, createFolder, getTotalFiles, getTotalSize, selectFile,
  } = useFileSystemStore();
  const { createTab, panels } = useLayoutStore();
  const wsCtx = useWorkspaceContextStore();
  const [showRecent, setShowRecent] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showNewInput, setShowNewInput] = useState<"file" | "folder" | null>(null);
  const [newName, setNewName] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback((path: string) => {
    selectFile(path);
    const name = path.split("/").pop() || "file";
    const editorPanel = Object.values(panels).find((p) => p.type === "code-editor");
    if (editorPanel) createTab(editorPanel.id, "code-editor", name);

    // 同步到 workspaceContextStore — 打开文件并激活
    const ext = name.split(".").pop() || "";
    const langMap: Record<string, string> = {
      tsx: "typescriptreact", ts: "typescript", jsx: "javascriptreact",
      js: "javascript", css: "css", json: "json", md: "markdown", html: "html",
    };
    wsCtx.openFile({
      filePath: path,
      fileName: name,
      language: langMap[ext] || "plaintext",
    });
  }, [panels, createTab, selectFile, wsCtx]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleDrop(files);
    setDragging(false);
  };

  const handleCreateNew = () => {
    if (!newName.trim() || !showNewInput) return;
    const parent = selectedPath
      ? (useFileSystemStore.getState().getNode(selectedPath)?.type === "folder" ? selectedPath : useFileSystemStore.getState().getParentPath(selectedPath))
      : "/src";
    if (showNewInput === "file") createFile(parent, newName.trim());
    else createFolder(parent, newName.trim());
    setNewName("");
    setShowNewInput(null);
  };

  const selectedNode = selectedPath ? useFileSystemStore.getState().getNode(selectedPath) : null;

  return (
    <div
      ref={dropRef}
      className="flex flex-col h-full relative"
      style={{ background: "#1a1a2e", color: "rgba(255,255,255,0.8)" }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleFileDrop}
    >
      {/* 工具栏 */}
      <div className="px-2 py-2 flex items-center gap-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex-1 flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Search size={12} className="opacity-40 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索文件..."
            className="flex-1 bg-transparent border-none outline-none"
            style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="opacity-30 hover:opacity-60">
              <X size={10} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowNewInput(showNewInput === "file" ? null : "file")}
          className="w-6 h-6 flex items-center justify-center rounded opacity-40 hover:opacity-80 transition-opacity"
          title="新建文件"
        >
          <FilePlus size={13} />
        </button>
        <button
          onClick={() => setShowNewInput(showNewInput === "folder" ? null : "folder")}
          className="w-6 h-6 flex items-center justify-center rounded opacity-40 hover:opacity-80 transition-opacity"
          title="新建文件夹"
        >
          <FolderPlus size={13} />
        </button>
        <button
          onClick={() => setShowRecent(!showRecent)}
          className="w-6 h-6 flex items-center justify-center rounded transition-opacity"
          style={{ opacity: showRecent ? 0.9 : 0.4, color: showRecent ? "#60efff" : undefined }}
          title="最近文件"
        >
          <Clock size={12} />
        </button>
      </div>

      {/* 新建输入 */}
      {showNewInput && (
        <div className="px-2 py-1.5 flex items-center gap-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,255,135,0.02)" }}>
          {showNewInput === "file" ? <FilePlus size={12} style={{ color: "#00ff87" }} /> : <FolderPlus size={12} style={{ color: "#e8a838" }} />}
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreateNew(); if (e.key === "Escape") setShowNewInput(null); }}
            placeholder={showNewInput === "file" ? "文件名..." : "文件夹名..."}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none"
            style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}
          />
          <button onClick={handleCreateNew} className="opacity-50 hover:opacity-90"><Check size={12} style={{ color: "#00ff87" }} /></button>
          <button onClick={() => setShowNewInput(null)} className="opacity-30 hover:opacity-60"><X size={12} /></button>
        </div>
      )}

      {/* 搜索结果 */}
      {searchQuery && searchResults.length > 0 && (
        <div className="px-2 py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(96,239,255,0.02)" }}>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
            找到 {searchResults.length} 个结果
          </span>
          <div className="mt-1 space-y-0.5">
            {searchResults.slice(0, 8).map((node) => (
              <button
                key={node.id}
                onClick={() => { if (node.type === "file") handleFileSelect(node.path); }}
                className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left transition-colors"
                style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {getFileIcon(node, false)}
                <span className="truncate">{node.name}</span>
                <span className="ml-auto opacity-20 truncate" style={{ fontSize: "9px", maxWidth: "100px" }}>{node.path}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 最近文件面板 */}
      {showRecent && (
        <div className="px-2 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(96,239,255,0.02)", maxHeight: "120px", overflowY: "auto" }}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>最近文件</span>
          </div>
          {recentFiles.slice(0, 6).map((rf) => (
            <button
              key={rf.path}
              onClick={() => handleFileSelect(rf.path)}
              className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left transition-colors"
              style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <Clock size={10} className="opacity-30 flex-shrink-0" />
              <span className="truncate">{rf.name}</span>
              <span className="ml-auto opacity-20" style={{ fontSize: "9px" }}>
                {new Date(rf.openedAt).toLocaleTimeString()}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* 文件树 */}
      <div className="flex-1 overflow-y-auto py-1">
        {fileTree.map((node) => (
          <TreeItem key={node.id} node={node} depth={0} />
        ))}
      </div>

      {/* 版本面板 */}
      {showVersions && selectedPath && selectedNode?.type === "file" && (
        <VersionPanel path={selectedPath} onClose={() => setShowVersions(false)} />
      )}

      {/* 底部状态栏 */}
      <div
        className="flex items-center justify-between px-3 py-1"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)", fontSize: "10px", color: "rgba(255,255,255,0.25)" }}
      >
        <div className="flex items-center gap-2">
          <HardDrive size={9} />
          <span>{getTotalFiles()} 文件</span>
          <span>{(getTotalSize() / 1024).toFixed(1)} KB</span>
        </div>
        <div className="flex items-center gap-1">
          {selectedPath && selectedNode?.type === "file" && (
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="flex items-center gap-0.5 transition-colors"
              style={{ color: showVersions ? "#60efff" : "rgba(255,255,255,0.3)" }}
            >
              <History size={9} />
              <span>版本</span>
            </button>
          )}
        </div>
      </div>

      {/* 拖放覆盖层 */}
      {isDragging && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2"
          style={{
            background: "rgba(0,255,135,0.05)",
            border: "2px dashed rgba(0,255,135,0.3)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Upload size={28} style={{ color: "#00ff87", opacity: 0.6 }} />
          <span style={{ fontSize: "13px", color: "#00ff87", opacity: 0.7 }}>拖放文件到此处导入</span>
        </div>
      )}
    </div>
  );
};
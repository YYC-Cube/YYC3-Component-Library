/**
 * @file LeftSidebar.tsx
 * @description 左侧侧栏面板 v1.1 — 文件浏览器、搜索、任务、Git、快速访问、AI 助手 6 大功能区 + useFsWatch 实时刷新
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.1.0
 * @created 2026-03-17
 * @updated 2026-03-19
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags sidebar, left-panel, explorer, search, tasks, git, quick-access, fs-watch
 */

import React, { useState, useRef, useCallback } from "react";
import {
  FolderTree, Search, ListTodo, GitBranch, Clock, Bot,
  ChevronRight, ChevronDown, File, Folder, FolderOpen,
  Plus, RefreshCw, X, Star, StarOff,
  Trash2, Pencil, FilePlus, FolderPlus,
  GitCommitHorizontal,
  CircleCheck, Circle,
} from "lucide-react";
import {
  useSidebarStore,
  type SidebarSection,
  type FileNode,
  type GitFileStatus,
} from "../../stores/sidebarStore";
import { useTaskStore } from "../../stores/taskStore";
import { useLayoutStore } from "../../stores/layoutStore";
import { searchService } from "../../services/searchService";
import { gitBridgeService } from "../../services/gitBridgeService";
import { useFsWatch } from "../../hooks/useFsWatch";

/* ─── Tab 定义 ─── */
const TABS: { id: SidebarSection; icon: React.ElementType; label: string }[] = [
  { id: "explorer", icon: FolderTree, label: "资源管理器" },
  { id: "search", icon: Search, label: "搜索" },
  { id: "tasks", icon: ListTodo, label: "任务" },
  { id: "git", icon: GitBranch, label: "Git" },
  { id: "quick-access", icon: Clock, label: "快速访问" },
  { id: "ai-assistant", icon: Bot, label: "AI" },
];

/* ─── 侧栏小按钮 ─── */
const SidebarBtn: React.FC<{ icon: React.ElementType; title: string; onClick?: () => void; active?: boolean }> = ({ icon: Icon, title, onClick, active }) => (
  <button
    onClick={onClick}
    className="w-6 h-6 flex items-center justify-center rounded transition-colors"
    style={{ color: active ? "#00ff87" : "rgba(255,255,255,0.3)" }}
    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    title={title}
  >
    <Icon size={12} />
  </button>
);

/* ─── 主组件 ─── */
export const LeftSidebar: React.FC = () => {
  const store = useSidebarStore();
  const { sidebarCollapsed } = useLayoutStore();
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = store.width;
    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      store.setWidth(startWidth + delta);
    };
    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [store]);

  if (sidebarCollapsed) return null;

  return (
    <div
      className="flex flex-col h-full relative select-none"
      style={{
        width: `${store.width}px`,
        minWidth: "180px",
        maxWidth: "420px",
        background: "rgba(14,14,28,0.95)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Tab 栏 */}
      <div
        className="flex items-center gap-0.5 px-1.5 py-1 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {TABS.map((tab) => {
          const isActive = store.activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => store.setActiveSection(tab.id)}
              className="flex items-center justify-center w-7 h-7 rounded transition-all"
              style={{
                color: isActive ? "#00ff87" : "rgba(255,255,255,0.3)",
                background: isActive ? "rgba(0,255,135,0.06)" : "transparent",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = isActive ? "rgba(0,255,135,0.06)" : "transparent"; }}
              title={tab.label}
            >
              <tab.icon size={13} />
            </button>
          );
        })}
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
        {store.activeSection === "explorer" && <FileExplorerSection />}
        {store.activeSection === "search" && <SearchSection />}
        {store.activeSection === "tasks" && <TasksSection />}
        {store.activeSection === "git" && <GitSection />}
        {store.activeSection === "quick-access" && <QuickAccessSection />}
        {store.activeSection === "ai-assistant" && <AIAssistantSection />}
      </div>

      {/* 右侧拖拽边 */}
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize z-10"
        style={{ background: isResizing ? "rgba(0,255,135,0.3)" : "transparent" }}
        onMouseDown={handleResizeStart}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,135,0.15)"; }}
        onMouseLeave={(e) => { if (!isResizing) e.currentTarget.style.background = "transparent"; }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   1. 文件浏览器 (含 useFsWatch 实时监听)
   ═══════════════════════════════════════════════════════════ */

const FileExplorerSection: React.FC = () => {
  const store = useSidebarStore();
  const layout = useLayoutStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: FileNode } | null>(null);

  /* ─── 文件系统实时监听 ─── */
  const workspacePath = "/src/app";
  const { isWatching, lastEvent } = useFsWatch(workspacePath, {
    debounceMs: 500,
    onChange: (event) => {
      // 文件变更时自动刷新文件树
      store.refreshFileTree();
    },
  });

  const handleDoubleClick = (node: FileNode) => {
    if (node.type === "directory") {
      store.toggleNode(node.id);
    } else {
      // 在编辑器中打开文件
      const existing = Object.values(layout.panels).find((p) => p.type === "code-editor");
      if (existing) {
        layout.createTab(existing.id, "code-editor", node.name);
      } else {
        layout.createPanel("code-editor", node.name);
      }
      store.addRecentFile({ path: node.path, name: node.name, language: node.language });
    }
  };

  const handleContext = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, node });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.5px" }}>
            资源管理器
          </span>
          {/* 文件监听状态指示 */}
          {isWatching && (
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "#00ff87", boxShadow: "0 0 4px rgba(0,255,135,0.4)" }}
              title={`实时监听中${lastEvent ? ` · 最近变更: ${lastEvent.changeType}` : ""}`}
            />
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <SidebarBtn icon={FilePlus} title="新建文件" onClick={() => store.createFileNode("/src/app", "untitled.tsx", "file")} />
          <SidebarBtn icon={FolderPlus} title="新建文件夹" onClick={() => store.createFileNode("/src/app", "new-folder", "directory")} />
          <SidebarBtn icon={RefreshCw} title="刷新" onClick={() => store.refreshFileTree()} />
        </div>
      </div>

      {/* 文件树 */}
      <div className="flex-1 py-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
        {store.fileTree.map((node) => (
          <FileTreeNode
            key={node.id}
            node={node}
            level={0}
            onSelect={(n) => store.selectNode(n.id)}
            onToggle={(n) => store.toggleNode(n.id)}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContext}
          />
        ))}
      </div>

      {/* 右键菜单 */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-[900]" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-[901] rounded-lg py-1 min-w-[160px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
              background: "rgba(20,20,35,0.97)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
          >
            {[
              { label: "新建文件", icon: FilePlus, action: () => store.createFileNode(contextMenu.node.path, "new-file.tsx", "file") },
              { label: "新建文件夹", icon: FolderPlus, action: () => store.createFileNode(contextMenu.node.path, "new-folder", "directory") },
              { label: "重命名", icon: Pencil, action: () => { const n = prompt("新名称:", contextMenu.node.name); if (n) store.renameFileNode(contextMenu.node.id, n); } },
              { label: "删除", icon: Trash2, action: () => { if (confirm(`确定删除 "${contextMenu.node.name}"?`)) store.deleteFileNode(contextMenu.node.id); } },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors"
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                onClick={() => { item.action(); setContextMenu(null); }}
              >
                <item.icon size={12} style={{ color: "rgba(255,255,255,0.35)" }} />
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ─── 文件树节点 ─── */
const FileTreeNode: React.FC<{
  node: FileNode;
  level: number;
  onSelect: (node: FileNode) => void;
  onToggle: (node: FileNode) => void;
  onDoubleClick: (node: FileNode) => void;
  onContextMenu: (e: React.MouseEvent, node: FileNode) => void;
}> = ({ node, level, onSelect, onToggle, onDoubleClick, onContextMenu }) => {
  const isDir = node.type === "directory";
  const gitColors: Record<GitFileStatus, string> = {
    unmodified: "rgba(255,255,255,0.5)",
    modified: "#ffb86c",
    added: "#00ff87",
    deleted: "#ff6b6b",
    renamed: "#60efff",
    untracked: "rgba(255,255,255,0.25)",
  };

  const getLangIcon = (name: string): React.ElementType => {
    if (name.endsWith(".tsx") || name.endsWith(".jsx") || name.endsWith(".ts") || name.endsWith(".js")) return File;
    if (name.endsWith(".css") || name.endsWith(".scss")) return File;
    if (name.endsWith(".json") || name.endsWith(".md")) return File;
    return File;
  };

  const FileIcon = isDir ? (node.isExpanded ? FolderOpen : Folder) : getLangIcon(node.name);
  const iconColor = isDir
    ? (node.isExpanded ? "#60efff" : "rgba(255,255,255,0.3)")
    : node.gitStatus
      ? gitColors[node.gitStatus]
      : "rgba(255,255,255,0.35)";

  return (
    <>
      <div
        className="flex items-center gap-1 px-1 py-0.5 cursor-pointer transition-colors group/node"
        style={{
          paddingLeft: `${level * 14 + 8}px`,
          background: node.isSelected ? "rgba(0,255,135,0.06)" : "transparent",
          color: node.isSelected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)",
          fontSize: "12px",
        }}
        onClick={() => { onSelect(node); if (isDir) onToggle(node); }}
        onDoubleClick={() => onDoubleClick(node)}
        onContextMenu={(e) => onContextMenu(e, node)}
        onMouseEnter={(e) => { if (!node.isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        onMouseLeave={(e) => { if (!node.isSelected) e.currentTarget.style.background = "transparent"; }}
      >
        {isDir && (
          <span className="w-3 flex-shrink-0">
            {node.isExpanded ? <ChevronDown size={10} style={{ color: "rgba(255,255,255,0.2)" }} /> : <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.2)" }} />}
          </span>
        )}
        {!isDir && <span className="w-3 flex-shrink-0" />}
        <FileIcon size={13} style={{ color: iconColor }} className="flex-shrink-0" />
        <span className="truncate flex-1">{node.name}</span>
        {node.gitStatus && node.gitStatus !== "unmodified" && (
          <span
            className="flex-shrink-0 px-1 rounded"
            style={{ fontSize: "8px", color: gitColors[node.gitStatus], background: `${gitColors[node.gitStatus]}10` }}
          >
            {node.gitStatus === "modified" ? "M" : node.gitStatus === "added" ? "A" : node.gitStatus === "deleted" ? "D" : node.gitStatus === "renamed" ? "R" : "?"}
          </span>
        )}
      </div>
      {isDir && node.isExpanded && node.children?.map((child) => (
        <FileTreeNode
          key={child.id}
          node={child}
          level={level + 1}
          onSelect={onSelect}
          onToggle={onToggle}
          onDoubleClick={onDoubleClick}
          onContextMenu={onContextMenu}
        />
      ))}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   2. 搜索
   ═══════════════════════════════════════════════════════════ */

const SearchSection: React.FC = () => {
  const store = useSidebarStore();

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
          <Search size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input
            value={store.searchQuery}
            onChange={(e) => store.setSearchQuery(e.target.value)}
            placeholder="搜索文件、代码..."
            className="flex-1 bg-transparent border-none outline-none"
            style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}
          />
          {store.searchQuery && (
            <button onClick={() => store.setSearchQuery("")} className="p-0.5 rounded hover:bg-white/5">
              <X size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {store.searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30" style={{ fontSize: "11px" }}>
            <Search size={20} className="mb-2" />
            {store.searchQuery ? "无匹配结果" : "输入关键词开始搜索"}
          </div>
        ) : (
          store.searchResults.map((r) => (
            <button
              key={r.id}
              className="w-full flex items-start gap-2 px-2 py-1.5 rounded text-left transition-colors"
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <File size={11} className="flex-shrink-0 mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }} />
              <div className="flex-1 min-w-0">
                <div className="truncate" style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.7)" }}>{r.title}</div>
                {r.preview && <div className="truncate" style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>{r.preview}</div>}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   3. 任务
   ═══════════════════════════════════════════════════════════ */

const TasksSection: React.FC = () => {
  const taskStore = useTaskStore();
  const tasks = taskStore.tasks || [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>任务列表</span>
        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>{tasks.length} 项</span>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30" style={{ fontSize: "11px" }}>
            <ListTodo size={20} className="mb-2" />
            暂无任务
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded transition-colors cursor-pointer"
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {task.status === "done" ? (
                <CircleCheck size={12} style={{ color: "#00ff87" }} />
              ) : (
                <Circle size={12} style={{ color: "rgba(255,255,255,0.2)" }} />
              )}
              <span className="truncate flex-1" style={{
                fontSize: "11.5px",
                color: task.status === "done" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.6)",
                textDecoration: task.status === "done" ? "line-through" : "none",
              }}>
                {task.title}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   4. Git
   ═══════════════════════════════════════════════════════════ */

const GitSection: React.FC = () => {
  const store = useSidebarStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>版本控制</span>
        <SidebarBtn icon={RefreshCw} title="刷新" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Git 分支 */}
        <div className="px-3 py-2 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
          <GitBranch size={12} style={{ color: "#a855f7" }} />
          <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.6)" }}>main</span>
        </div>

        {/* 变更文件 */}
        <div className="px-3 py-1.5">
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>暂存的变更</span>
        </div>
        <div className="px-2">
          {store.fileTree.filter((n) => n.gitStatus && n.gitStatus !== "unmodified").length === 0 ? (
            <div className="py-4 text-center" style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
              工作区干净
            </div>
          ) : (
            store.fileTree.filter((n) => n.gitStatus && n.gitStatus !== "unmodified").map((node) => (
              <div key={node.id} className="flex items-center gap-2 px-2 py-1 rounded transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <GitCommitHorizontal size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
                <span className="truncate flex-1" style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{node.name}</span>
                <span style={{ fontSize: "8px", color: node.gitStatus === "modified" ? "#ffb86c" : "#00ff87" }}>
                  {node.gitStatus === "modified" ? "M" : "A"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   5. 快速访问
   ═══════════════════════════════════════════════════════════ */

const QuickAccessSection: React.FC = () => {
  const store = useSidebarStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>快速访问</span>
      </div>

      {/* 最近文件 */}
      <div className="px-3 py-1.5">
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>最近文件</span>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {store.recentFiles.length === 0 ? (
          <div className="py-4 text-center" style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
            无最近访问的文件
          </div>
        ) : (
          store.recentFiles.map((rf, i) => (
            <div
              key={`${rf.path}-${i}`}
              className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors"
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <Clock size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
              <span className="truncate flex-1" style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.55)" }}>{rf.name}</span>
              <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.15)" }}>{rf.language}</span>
            </div>
          ))
        )}
      </div>

      {/* 收藏 */}
      <div className="px-3 py-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>收藏</span>
      </div>
      <div className="px-2 pb-2">
        {store.favorites.length === 0 ? (
          <div className="py-3 text-center" style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
            右键文件可添加收藏
          </div>
        ) : (
          store.favorites.map((fav, i) => (
            <div
              key={`fav-${i}`}
              className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors"
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <Star size={10} style={{ color: "#ffb86c" }} />
              <span className="truncate flex-1" style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.55)" }}>{fav.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   6. AI 助手
   ═══════════════════════════════════════════════════════════ */

const AIAssistantSection: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>AI 助手</span>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 px-4 gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #00ff87, #60efff)" }}
        >
          <Bot size={20} color="#000" />
        </div>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
          打开 AI 聊天面板获取编程帮助
        </span>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
          支持代码解释、错误修复、性能优化
        </span>
      </div>
    </div>
  );
};

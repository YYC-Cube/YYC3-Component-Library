/**
 * @file VersionControlPanel.tsx
 * @description 版本控制面板 v3.0 — 可视化提交时间线 + Diff inline/side-by-side 切换 + Stash/Tag/冲突解决
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v3.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, git, version-control, timeline, diff-modes, stash, tag, merge-conflict
 */

import React, { useState } from "react";
import {
  GitBranch, GitCommitHorizontal, GitMerge,
  Plus, Minus, Pencil, RefreshCw, Check, X,
  ChevronDown, ChevronRight, Upload, Download,
  Clock, User, Tag, Archive, Eye,
  OctagonAlert, Copy, ArrowLeftRight, Columns2,
} from "lucide-react";

/* ─── 类型 ─── */
interface GitFile {
  path: string;
  status: "modified" | "added" | "deleted" | "renamed" | "conflict";
  staged: boolean;
  additions?: number;
  deletions?: number;
}

interface GitCommitLog {
  hash: string;
  message: string;
  author: string;
  date: number;
  branch: string;
  tags?: string[];
}

interface GitStash {
  id: string;
  message: string;
  branch: string;
  date: number;
  files: number;
}

interface GitTag {
  name: string;
  hash: string;
  message: string;
  date: number;
  type: "lightweight" | "annotated";
}

/* ─── 模拟数据 ─── */
const mockChanges: GitFile[] = [
  { path: "src/app/components/panels/types/TerminalPanel.tsx", status: "modified", staged: true, additions: 182, deletions: 45 },
  { path: "src/app/components/panels/types/CodeEditorPanel.tsx", status: "modified", staged: true, additions: 230, deletions: 88 },
  { path: "src/app/stores/collaborationStore.ts", status: "added", staged: false, additions: 215, deletions: 0 },
  { path: "src/app/stores/notificationStore.ts", status: "added", staged: false, additions: 178, deletions: 0 },
  { path: "src/app/stores/workspaceContextStore.ts", status: "added", staged: false, additions: 192, deletions: 0 },
  { path: "src/app/components/StatusBar.tsx", status: "added", staged: false, additions: 256, deletions: 0 },
  { path: "src/app/components/NotificationCenter.tsx", status: "added", staged: false, additions: 198, deletions: 0 },
  { path: "src/styles/theme.css", status: "modified", staged: false, additions: 12, deletions: 3 },
  { path: "src/app/utils/deprecated.ts", status: "deleted", staged: false, additions: 0, deletions: 45 },
  { path: "src/app/components/panels/types/VersionControlPanel.tsx", status: "conflict", staged: false, additions: 0, deletions: 0 },
];

const mockCommits: GitCommitLog[] = [
  { hash: "f8a2c1d", message: "feat(phase-8): 终端 v2.0 + 编辑器 v3.0 + 版本控制 v2.0", author: "YYC³ Team", date: Date.now() - 300000, branch: "feature/phase-8", tags: ["v2.0.0-alpha"] },
  { hash: "a3f2b1c", message: "feat(phase-7): 协同编辑 + 通知中心 + 状态栏", author: "YYC³ Team", date: Date.now() - 3600000, branch: "main", tags: [] },
  { hash: "b5d4e2a", message: "feat(phase-6): 主题系统 + 快捷键 + 命令面板", author: "YYC³ Team", date: Date.now() - 86400000, branch: "main", tags: ["v1.6.0"] },
  { hash: "c7f6a3b", message: "feat(phase-5): 搜索 + 调试 + 输出 + 插件管理", author: "YYC³ Team", date: Date.now() - 172800000, branch: "main", tags: [] },
  { hash: "d9e8b4c", message: "feat(phase-4): 文件系统 + 数据库 + 版本控制", author: "YYC³ Team", date: Date.now() - 259200000, branch: "main", tags: ["v1.4.0"] },
  { hash: "e1f0c5d", message: "feat(phase-3): 实时预览 + AI 服务层", author: "YYC³ Team", date: Date.now() - 345600000, branch: "main", tags: [] },
  { hash: "f2a1d6e", message: "feat(phase-2): 多联式编辑器系统", author: "YYC³ Team", date: Date.now() - 432000000, branch: "main", tags: [] },
  { hash: "a3b2c7f", message: "feat(phase-1): 首页组件", author: "YYC³ Team", date: Date.now() - 518400000, branch: "main", tags: ["v1.0.0"] },
  { hash: "b4c3d8a", message: "chore: 初始化项目架构", author: "YYC³ Team", date: Date.now() - 604800000, branch: "main", tags: [] },
];

const mockBranches = ["main", "feature/phase-8", "dev/phase-7", "feature/ai-service", "feature/preview-engine", "hotfix/icon-names"];

const mockStashes: GitStash[] = [
  { id: "stash@{0}", message: "WIP: 调试面板优化", branch: "feature/phase-8", date: Date.now() - 1800000, files: 3 },
  { id: "stash@{1}", message: "实验性: 实时协同编辑", branch: "dev/phase-7", date: Date.now() - 7200000, files: 5 },
  { id: "stash@{2}", message: "暂存: 主题切换动画", branch: "main", date: Date.now() - 86400000, files: 2 },
];

const mockTags: GitTag[] = [
  { name: "v2.0.0-alpha", hash: "f8a2c1d", message: "Phase 8 Alpha Release", date: Date.now() - 300000, type: "annotated" },
  { name: "v1.6.0", hash: "b5d4e2a", message: "Phase 6 Stable", date: Date.now() - 86400000, type: "annotated" },
  { name: "v1.4.0", hash: "d9e8b4c", message: "Phase 4 Stable", date: Date.now() - 259200000, type: "annotated" },
  { name: "v1.0.0", hash: "a3b2c7f", message: "Initial Release", date: Date.now() - 518400000, type: "annotated" },
];

/* ─── Diff 示例 ─── */
const mockDiff = [
  { type: "context" as const, content: "  import React, { useState } from 'react';", lineOld: 14, lineNew: 14 },
  { type: "context" as const, content: "  import { Tab } from '../../../stores/layoutStore';", lineOld: 15, lineNew: 15 },
  { type: "deletion" as const, content: "- import { Link2 } from 'lucide-react';", lineOld: 16, lineNew: null },
  { type: "addition" as const, content: "+ import { Link2, Link2Off, Map, WrapText } from 'lucide-react';", lineOld: null, lineNew: 16 },
  { type: "addition" as const, content: "+ import { useWorkspaceContextStore } from '../../../stores/workspaceContextStore';", lineOld: null, lineNew: 17 },
  { type: "addition" as const, content: "+ import { useCollaborationStore } from '../../../stores/collaborationStore';", lineOld: null, lineNew: 18 },
  { type: "context" as const, content: "", lineOld: 17, lineNew: 19 },
  { type: "context" as const, content: "  const sampleCode: Record<string, string> = {", lineOld: 18, lineNew: 20 },
];

type TabId = "changes" | "commits" | "branches" | "stashes" | "tags";

/* ─── 主面板 ─── */
export const VersionControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("changes");
  const [changes, setChanges] = useState(mockChanges);
  const [commitMsg, setCommitMsg] = useState("");
  const [currentBranch, setCurrentBranch] = useState("feature/phase-8");
  const [showBranchSelect, setShowBranchSelect] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [viewDiff, setViewDiff] = useState<string | null>(null);
  const [stashMsg, setStashMsg] = useState("");
  const [diffMode, setDiffMode] = useState<"inline" | "side-by-side">("inline");

  const stagedFiles = changes.filter((f) => f.staged);
  const unstagedFiles = changes.filter((f) => !f.staged);
  const conflictFiles = changes.filter((f) => f.status === "conflict");

  const stageFile = (path: string) => setChanges((c) => c.map((f) => (f.path === path ? { ...f, staged: true } : f)));
  const unstageFile = (path: string) => setChanges((c) => c.map((f) => (f.path === path ? { ...f, staged: false } : f)));
  const stageAll = () => setChanges((c) => c.map((f) => f.status !== "conflict" ? { ...f, staged: true } : f));
  const unstageAll = () => setChanges((c) => c.map((f) => ({ ...f, staged: false })));

  const handleCommit = () => {
    if (!commitMsg.trim() || stagedFiles.length === 0) return;
    setChanges((c) => c.filter((f) => !f.staged));
    setCommitMsg("");
  };

  const handlePush = async () => { setPushing(true); await delay(1200); setPushing(false); };
  const handlePull = async () => { setPulling(true); await delay(1000); setPulling(false); };

  const statusConfig: Record<string, { color: string; Icon: React.ElementType; label: string }> = {
    modified: { color: "#ffb86c", Icon: Pencil, label: "M" },
    added: { color: "#00ff87", Icon: Plus, label: "A" },
    deleted: { color: "#ff6b6b", Icon: Minus, label: "D" },
    renamed: { color: "#60efff", Icon: ArrowLeftRight, label: "R" },
    conflict: { color: "#ff6b6b", Icon: OctagonAlert, label: "!" },
  };

  const tabs: { id: TabId; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "changes", label: "变更", icon: Pencil, badge: changes.length },
    { id: "commits", label: "提交", icon: GitCommitHorizontal },
    { id: "branches", label: "分支", icon: GitBranch, badge: mockBranches.length },
    { id: "stashes", label: "暂存", icon: Archive, badge: mockStashes.length },
    { id: "tags", label: "标签", icon: Tag, badge: mockTags.length },
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: "#14142a", color: "rgba(255,255,255,0.85)" }}>
      {/* 顶部 Tab + 操作栏 */}
      <div className="flex items-center justify-between px-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: "34px" }}>
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-1 px-1.5 py-1 rounded transition-colors flex-shrink-0"
              style={{
                fontSize: "10px",
                color: activeTab === t.id ? "#00ff87" : "rgba(255,255,255,0.35)",
                background: activeTab === t.id ? "rgba(0,255,135,0.05)" : "transparent",
              }}
            >
              <t.icon size={10} />
              {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span className="px-1 rounded-sm" style={{ fontSize: "8px", background: activeTab === t.id ? "rgba(0,255,135,0.1)" : "rgba(255,255,255,0.05)", color: activeTab === t.id ? "#00ff87" : "rgba(255,255,255,0.3)" }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <BranchSelector current={currentBranch} branches={mockBranches} show={showBranchSelect} onToggle={() => setShowBranchSelect(!showBranchSelect)} onSelect={(b) => { setCurrentBranch(b); setShowBranchSelect(false); }} />
          <SmallBtn icon={Download} loading={pulling} onClick={handlePull} tooltip="Pull" />
          <SmallBtn icon={Upload} loading={pushing} onClick={handlePush} tooltip="Push" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ═══ 变更 ═══ */}
        {activeTab === "changes" && !viewDiff && (
          <div>
            {/* 冲突警告 */}
            {conflictFiles.length > 0 && (
              <div className="mx-2 mt-2 px-3 py-2 rounded-lg" style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.12)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <OctagonAlert size={12} style={{ color: "#ff6b6b" }} />
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#ff6b6b" }}>
                    {conflictFiles.length} 个合并冲突
                  </span>
                </div>
                {conflictFiles.map((f) => (
                  <div key={f.path} className="flex items-center gap-2 py-0.5" style={{ fontSize: "10px", color: "rgba(255,107,107,0.7)" }}>
                    <OctagonAlert size={8} />
                    <span className="truncate">{f.path.split("/").pop()}</span>
                    <button className="ml-auto px-1.5 py-0.5 rounded" style={{ fontSize: "8px", background: "rgba(255,107,107,0.1)", color: "#ff6b6b" }}>
                      解决
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Commit */}
            <div className="px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <textarea
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                placeholder="提交信息 (Ctrl+Enter 提交)..."
                className="w-full bg-transparent border-none outline-none resize-none"
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", minHeight: "36px", maxHeight: "80px" }}
                rows={2}
                onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleCommit(); }}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCommit}
                  disabled={!commitMsg.trim() || stagedFiles.length === 0}
                  className="flex-1 py-1.5 rounded-lg transition-colors"
                  style={{
                    fontSize: "11px",
                    background: commitMsg.trim() && stagedFiles.length > 0 ? "rgba(0,255,135,0.1)" : "rgba(255,255,255,0.02)",
                    color: commitMsg.trim() && stagedFiles.length > 0 ? "#00ff87" : "rgba(255,255,255,0.15)",
                    border: `1px solid ${commitMsg.trim() && stagedFiles.length > 0 ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.04)"}`,
                  }}
                >
                  <GitCommitHorizontal size={11} className="inline mr-1" />
                  提交 ({stagedFiles.length})
                </button>
                <button
                  onClick={() => { if (stashMsg || changes.length) { /* stash action */ } }}
                  className="px-3 py-1.5 rounded-lg transition-colors"
                  style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                  title="暂存 (Stash)"
                >
                  <Archive size={11} />
                </button>
              </div>
            </div>

            {/* 暂存区 */}
            <FileSection
              title="暂存区"
              files={stagedFiles}
              statusConfig={statusConfig}
              action="unstage"
              onAction={unstageFile}
              onActionAll={unstageAll}
              onViewDiff={setViewDiff}
            />
            {/* 未暂存 */}
            <FileSection
              title="未暂存"
              files={unstagedFiles}
              statusConfig={statusConfig}
              action="stage"
              onAction={stageFile}
              onActionAll={stageAll}
              onViewDiff={setViewDiff}
            />
          </div>
        )}

        {/* Diff 查看器 */}
        {activeTab === "changes" && viewDiff && (
          <DiffViewer filePath={viewDiff} onBack={() => setViewDiff(null)} mode={diffMode} onModeChange={setDiffMode} />
        )}

        {/* ═══ 提交历史 ═══ */}
        {activeTab === "commits" && (
          <div>
            {mockCommits.map((commit, i) => (
              <div key={commit.hash} className="px-3 py-2.5 transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.015)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div className="flex items-start gap-2">
                  <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: i === 0 ? "#00ff87" : "rgba(255,255,255,0.12)", border: i === 0 ? "2px solid rgba(0,255,135,0.3)" : "none" }} />
                    {i < mockCommits.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: "rgba(255,255,255,0.05)", minHeight: "16px" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "12px", fontWeight: 500 }} className="truncate">{commit.message}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap" style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
                      <span className="font-mono" style={{ color: "#a855f7" }}>{commit.hash}</span>
                      <span className="flex items-center gap-0.5"><User size={8} />{commit.author}</span>
                      <span className="flex items-center gap-0.5"><Clock size={8} />{formatTimeAgo(commit.date)}</span>
                      {commit.tags?.map((tag) => (
                        <span key={tag} className="px-1 rounded" style={{ fontSize: "8px", background: "rgba(0,255,135,0.06)", color: "#00ff87", border: "1px solid rgba(0,255,135,0.1)" }}>
                          <Tag size={7} className="inline mr-0.5" />{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-30 flex-shrink-0 mt-0.5" title="复制 hash">
                    <Copy size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ 分支管理 ═══ */}
        {activeTab === "branches" && (
          <div className="p-2 space-y-1">
            {mockBranches.map((branch) => {
              const isCurrent = branch === currentBranch;
              return (
                <div key={branch} className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                  style={{
                    background: isCurrent ? "rgba(168,85,247,0.05)" : "rgba(255,255,255,0.015)",
                    border: `1px solid ${isCurrent ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.03)"}`,
                  }}
                >
                  <GitBranch size={12} style={{ color: isCurrent ? "#a855f7" : "rgba(255,255,255,0.25)" }} />
                  <span className="flex-1" style={{ fontSize: "12px", color: isCurrent ? "#a855f7" : "rgba(255,255,255,0.55)" }}>
                    {branch}
                  </span>
                  {isCurrent ? (
                    <span className="px-1.5 py-0 rounded" style={{ fontSize: "9px", background: "rgba(168,85,247,0.08)", color: "#a855f7" }}>当前</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button onClick={() => setCurrentBranch(branch)} className="px-2 py-0.5 rounded" style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.02)" }}>切换</button>
                      <button className="px-2 py-0.5 rounded" style={{ fontSize: "9px", color: "rgba(96,239,255,0.5)", background: "rgba(96,239,255,0.03)" }}>合并</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ Stash ═══ */}
        {activeTab === "stashes" && (
          <div className="p-2 space-y-1">
            {mockStashes.length === 0 ? (
              <div className="text-center py-8 opacity-20" style={{ fontSize: "12px" }}>暂无 Stash</div>
            ) : (
              mockStashes.map((stash) => (
                <div key={stash.id} className="px-3 py-2.5 rounded-lg transition-colors"
                  style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)" }}
                >
                  <div className="flex items-center gap-2">
                    <Archive size={12} style={{ color: "#ffb86c" }} />
                    <span style={{ fontSize: "12px", fontWeight: 500 }}>{stash.message}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5" style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
                    <span className="font-mono" style={{ color: "rgba(255,184,108,0.5)" }}>{stash.id}</span>
                    <span className="flex items-center gap-0.5"><GitBranch size={8} />{stash.branch}</span>
                    <span>{stash.files} 文件</span>
                    <span>{formatTimeAgo(stash.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <button className="px-2 py-0.5 rounded" style={{ fontSize: "9px", background: "rgba(0,255,135,0.06)", color: "#00ff87", border: "1px solid rgba(0,255,135,0.1)" }}>应用</button>
                    <button className="px-2 py-0.5 rounded" style={{ fontSize: "9px", background: "rgba(96,239,255,0.06)", color: "#60efff", border: "1px solid rgba(96,239,255,0.1)" }}>弹出</button>
                    <button className="px-2 py-0.5 rounded" style={{ fontSize: "9px", background: "rgba(255,107,107,0.06)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.1)" }}>删除</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ═══ Tags ═══ */}
        {activeTab === "tags" && (
          <div className="p-2 space-y-1">
            {mockTags.map((tag) => (
              <div key={tag.name} className="px-3 py-2.5 rounded-lg transition-colors"
                style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-2">
                  <Tag size={12} style={{ color: "#00ff87" }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#00ff87" }}>{tag.name}</span>
                  <span className="px-1 rounded" style={{ fontSize: "8px", background: "rgba(168,85,247,0.06)", color: "#a855f7" }}>
                    {tag.type}
                  </span>
                </div>
                <p className="m-0 mt-1" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{tag.message}</p>
                <div className="flex items-center gap-2 mt-1.5" style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>
                  <span className="font-mono" style={{ color: "#a855f7" }}>{tag.hash}</span>
                  <span>{formatTimeAgo(tag.date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══ 子组件 ═══ */

interface FileSectionProps {
  title: string;
  files: GitFile[];
  statusConfig: Record<string, { color: string; Icon: React.ElementType; label: string }>;
  action: "stage" | "unstage";
  onAction: (path: string) => void;
  onActionAll: () => void;
  onViewDiff: (path: string) => void;
}

const FileSection: React.FC<FileSectionProps> = ({ title, files, statusConfig, action, onAction, onActionAll, onViewDiff }) => {
  const [collapsed, setCollapsed] = useState(false);
  if (files.length === 0) return null;
  return (
    <div>
      <div className="flex items-center justify-between px-3 py-1.5 cursor-pointer" style={{ background: "rgba(255,255,255,0.015)" }} onClick={() => setCollapsed(!collapsed)}>
        <div className="flex items-center gap-1">
          {collapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
          <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.4)" }}>{title} ({files.length})</span>
        </div>
        {!collapsed && (
          <button onClick={(e) => { e.stopPropagation(); onActionAll(); }} style={{ fontSize: "9px", color: action === "stage" ? "#00ff87" : "rgba(255,255,255,0.3)" }}>
            {action === "stage" ? "全部暂存" : "全部取消"}
          </button>
        )}
      </div>
      {!collapsed && files.map((f) => {
        const cfg = statusConfig[f.status] || statusConfig.modified;
        return (
          <div key={f.path} className="flex items-center gap-1.5 px-3 py-1 transition-colors group" style={{ borderBottom: "1px solid rgba(255,255,255,0.02)", fontSize: "11px" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <cfg.Icon size={10} style={{ color: cfg.color }} />
            <span className="flex-1 truncate" style={{ color: "rgba(255,255,255,0.6)" }}>{f.path.split("/").pop()}</span>
            {f.additions !== undefined && f.additions > 0 && (
              <span style={{ fontSize: "9px", color: "#00ff87" }}>+{f.additions}</span>
            )}
            {f.deletions !== undefined && f.deletions > 0 && (
              <span style={{ fontSize: "9px", color: "#ff6b6b" }}>-{f.deletions}</span>
            )}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onViewDiff(f.path)} style={{ color: "rgba(255,255,255,0.3)" }} title="查看差异">
                <Eye size={10} />
              </button>
              <button onClick={() => onAction(f.path)} style={{ color: action === "stage" ? "#00ff87" : "rgba(255,255,255,0.3)" }} title={action === "stage" ? "暂存" : "取消暂存"}>
                {action === "stage" ? <Plus size={10} /> : <Minus size={10} />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* Diff 查看器 */
const DiffViewer: React.FC<{ filePath: string; onBack: () => void; mode: "inline" | "side-by-side"; onModeChange: (mode: "inline" | "side-by-side") => void }> = ({ filePath, onBack, mode, onModeChange }) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <button onClick={onBack} className="px-2 py-0.5 rounded" style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.03)" }}>
        ← 返回
      </button>
      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }} className="truncate">{filePath.split("/").pop()}</span>
      <button onClick={() => onModeChange(mode === "inline" ? "side-by-side" : "inline")} className="px-2 py-0.5 rounded" style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.03)" }}>
        {mode === "inline" ? <Columns2 size={10} /> : <Eye size={10} />}
      </button>
    </div>
    <div className="flex-1 overflow-auto px-0 py-1" style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "12px", lineHeight: "20px" }}>
      {mockDiff.map((line, i) => (
        <div key={i} className="flex" style={{
          background: line.type === "addition" ? "rgba(0,255,135,0.04)" : line.type === "deletion" ? "rgba(255,107,107,0.04)" : "transparent",
          minHeight: "20px",
        }}>
          <div className="w-10 text-right px-1 flex-shrink-0 select-none" style={{ color: "rgba(255,255,255,0.12)", fontSize: "10px" }}>
            {line.lineOld ?? ""}
          </div>
          <div className="w-10 text-right px-1 flex-shrink-0 select-none" style={{ color: "rgba(255,255,255,0.12)", fontSize: "10px" }}>
            {line.lineNew ?? ""}
          </div>
          <div className="w-5 flex-shrink-0 text-center select-none" style={{
            color: line.type === "addition" ? "#00ff87" : line.type === "deletion" ? "#ff6b6b" : "rgba(255,255,255,0.1)",
            fontSize: "11px",
          }}>
            {line.type === "addition" ? "+" : line.type === "deletion" ? "-" : " "}
          </div>
          <div className="flex-1 whitespace-pre" style={{
            color: line.type === "addition" ? "rgba(0,255,135,0.8)" : line.type === "deletion" ? "rgba(255,107,107,0.7)" : "rgba(255,255,255,0.5)",
          }}>
            {line.content.replace(/^[+-]\s?/, "")}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* 分支选择器 */
const BranchSelector: React.FC<{
  current: string; branches: string[]; show: boolean;
  onToggle: () => void; onSelect: (b: string) => void;
}> = ({ current, branches, show, onToggle, onSelect }) => (
  <div className="relative">
    <button onClick={onToggle} className="flex items-center gap-1 px-1.5 py-0.5 rounded"
      style={{ fontSize: "10px", color: "#a855f7", background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.1)" }}>
      <GitBranch size={9} />
      <span className="max-w-[80px] truncate">{current}</span>
      <ChevronDown size={8} />
    </button>
    {show && (
      <>
        <div className="fixed inset-0 z-40" onClick={onToggle} />
        <div className="absolute right-0 top-full mt-1 z-50 rounded-lg py-1" style={{ background: "rgba(20,20,35,0.97)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", minWidth: "160px" }}>
          {branches.map((b) => (
            <button key={b} onClick={() => onSelect(b)} className="w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors"
              style={{ fontSize: "11px", color: b === current ? "#a855f7" : "rgba(255,255,255,0.55)", background: b === current ? "rgba(168,85,247,0.05)" : "transparent" }}
              onMouseEnter={(e) => { if (b !== current) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              onMouseLeave={(e) => { if (b !== current) e.currentTarget.style.background = "transparent"; }}
            >
              <GitBranch size={10} />{b}
              {b === current && <Check size={10} className="ml-auto" />}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
);

/* 小按钮 */
const SmallBtn: React.FC<{ icon: React.ElementType; loading: boolean; onClick: () => void; tooltip: string }> = ({ icon: Icon, loading, onClick, tooltip }) => (
  <button onClick={onClick} disabled={loading} className="w-5 h-5 flex items-center justify-center rounded opacity-35 hover:opacity-65 transition-opacity" title={tooltip}>
    {loading ? <RefreshCw size={10} className="animate-spin" /> : <Icon size={10} />}
  </button>
);

/* 辅助函数 */
function delay(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "刚刚";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  return `${Math.floor(diff / 86400000)}天前`;
}
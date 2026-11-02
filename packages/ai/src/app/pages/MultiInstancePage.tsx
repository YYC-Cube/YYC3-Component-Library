/**
 * @file MultiInstancePage.tsx
 * @description P2 应用多开管理页面 — 窗口实例管理、工作区管理、会话管理、IPC 通信日志、资源监控
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-18
 * @updated 2026-03-18
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags page, multi-instance, window, workspace, session
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, AppWindow, FolderKanban, MessageSquare, Radio,
  Plus, X, Maximize2, Minimize2, Eye, EyeOff, Copy, Trash2,
  Play, Pause, RotateCcw, Cpu, MemoryStick, Activity,
  Clipboard, Monitor, Code, Terminal, Bot, Settings,
  ChevronRight, Zap, LayoutGrid, RefreshCw,
} from "lucide-react";
import {
  useMultiInstanceStore,
  type WindowType,
  type WorkspaceType,
  type SessionType,
  type AppInstance,
  type Workspace,
  type MISession,
} from "../stores/multiInstanceStore";
import { useI18nStore } from "../stores/i18nStore";

/* ─── 共享样式 ─── */
const glass = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
};

const GlassCard: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = "", style }) => (
  <div className={`p-4 ${className}`} style={{ ...glass, ...style }}>{children}</div>
);

const windowTypeIcons: Record<WindowType, React.ReactNode> = {
  main: <Monitor size={14} />,
  editor: <Code size={14} />,
  preview: <Eye size={14} />,
  terminal: <Terminal size={14} />,
  "ai-chat": <Bot size={14} />,
  settings: <Settings size={14} />,
};

const sessionTypeIcons: Record<SessionType, React.ReactNode> = {
  "ai-chat": <Bot size={13} />,
  "code-edit": <Code size={13} />,
  debug: <Zap size={13} />,
  preview: <Eye size={13} />,
  terminal: <Terminal size={13} />,
};

const wsTypeLabels: Record<WorkspaceType, string> = {
  project: "项目",
  "ai-session": "AI 会话",
  debug: "调试",
  custom: "自定义",
};

const statusColors: Record<string, string> = {
  active: "#00ff87",
  idle: "#ffb86c",
  suspended: "#a855f7",
  closed: "rgba(255,255,255,0.2)",
};

/* ─── 顶部 Tab ─── */
type TabId = "windows" | "workspaces" | "sessions" | "ipc" | "resources";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "windows", label: "窗口实例", icon: <AppWindow size={15} /> },
  { id: "workspaces", label: "工作区", icon: <FolderKanban size={15} /> },
  { id: "sessions", label: "会话", icon: <MessageSquare size={15} /> },
  { id: "ipc", label: "IPC 通信", icon: <Radio size={15} /> },
  { id: "resources", label: "资源监控", icon: <Activity size={15} /> },
];

/* ═══════════════════════════════════════════════════════
 *  主页面组件
 * ═══════════════════════════════════════════════════════ */

const MultiInstancePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("windows");
  const store = useMultiInstanceStore();

  // 定时更新资源指标
  useEffect(() => {
    store.updateMetrics();
    const timer = setInterval(() => store.updateMetrics(), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full" style={{ background: "linear-gradient(135deg, #0a0a12 0%, #0d1117 50%, #0a0a12 100%)", color: "#fff" }}>
      {/* ── Header ── */}
      <div className="flex items-center gap-4 px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="m-0" style={{ fontSize: "20px", fontWeight: 700 }}>应用多开管理</h1>
          <p className="m-0 mt-0.5" style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
            多窗口 · 多工作区 · 多会话并行管理
          </p>
        </div>

        {/* 概览指标 */}
        <div className="flex items-center gap-4 ml-auto">
          {[
            { label: "窗口", value: store.instances.length, color: "#60efff" },
            { label: "工作区", value: store.workspaces.length, color: "#00ff87" },
            { label: "会话", value: store.sessions.filter((s) => s.status === "active").length, color: "#a855f7" },
            { label: "内存", value: `${store.metrics.memoryUsageMB}MB`, color: "#ffb86c" },
          ].map((m) => (
            <div key={m.label} className="flex flex-col items-center">
              <span style={{ fontSize: "16px", fontWeight: 700, color: m.color }}>{m.value}</span>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 px-6 pt-4 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl transition-all"
            style={{
              fontSize: "13px",
              fontWeight: activeTab === tab.id ? 600 : 400,
              background: activeTab === tab.id ? "rgba(255,255,255,0.06)" : "transparent",
              color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.4)",
              border: activeTab === tab.id ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
              borderBottom: activeTab === tab.id ? "1px solid transparent" : "1px solid transparent",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="px-6 pb-6 pt-0">
        <div className="p-5 rounded-b-2xl rounded-tr-2xl" style={{ ...glass, borderTopLeftRadius: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "windows" && <WindowsPanel />}
              {activeTab === "workspaces" && <WorkspacesPanel />}
              {activeTab === "sessions" && <SessionsPanel />}
              {activeTab === "ipc" && <IPCPanel />}
              {activeTab === "resources" && <ResourcesPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
 *  窗口实例面板
 * ═══════════════════════════════════════════════════════ */

const WindowsPanel: React.FC = () => {
  const { instances, createWindow, closeWindow, activateWindow, minimizeWindow, maximizeWindow, restoreWindow, activeInstanceId } = useMultiInstanceStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newType, setNewType] = useState<WindowType>("editor");

  const handleCreate = () => {
    createWindow(newType, { title: `YYC³ — ${newType} #${instances.length + 1}` });
    setShowCreate(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AppWindow size={16} style={{ color: "#60efff" }} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>窗口实例 ({instances.length})</span>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
          style={{ fontSize: "12px", background: "rgba(96,239,255,0.1)", border: "1px solid rgba(96,239,255,0.2)", color: "#60efff" }}
        >
          <Plus size={13} /> 新建窗口
        </button>
      </div>

      {/* 新建窗口面板 */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <GlassCard style={{ border: "1px solid rgba(96,239,255,0.15)" }}>
              <p className="m-0 mb-3" style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>选择窗口类型</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {(["main", "editor", "preview", "terminal", "ai-chat", "settings"] as WindowType[]).map((wt) => (
                  <button
                    key={wt}
                    onClick={() => setNewType(wt)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all"
                    style={{
                      fontSize: "12px",
                      background: newType === wt ? "rgba(96,239,255,0.12)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${newType === wt ? "rgba(96,239,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                      color: newType === wt ? "#60efff" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {windowTypeIcons[wt]} {wt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 rounded-lg" style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>取消</button>
                <button onClick={handleCreate} className="px-3 py-1.5 rounded-lg" style={{ fontSize: "12px", color: "#0a0a12", background: "#60efff", border: "none", fontWeight: 600 }}>创建</button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 窗口列表 */}
      {instances.length === 0 ? (
        <div className="flex flex-col items-center py-12 opacity-40">
          <AppWindow size={32} />
          <p className="mt-3" style={{ fontSize: "13px" }}>暂无窗口实例，点击上方新建</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
          {instances.map((inst) => (
            <GlassCard
              key={inst.windowId}
              className="relative"
              style={{
                border: activeInstanceId === inst.windowId
                  ? "1px solid rgba(96,239,255,0.3)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* 标题行 */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: inst.isMain ? "rgba(0,255,135,0.12)" : "rgba(96,239,255,0.12)" }}>
                  {windowTypeIcons[inst.windowType]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate" style={{ fontSize: "13px", fontWeight: 600 }}>{inst.title}</span>
                    {inst.isMain && (
                      <span className="px-1.5 py-0.5 rounded" style={{ fontSize: "9px", background: "rgba(0,255,135,0.12)", color: "#00ff87" }}>主</span>
                    )}
                  </div>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                    {inst.windowType} · {inst.size.width}×{inst.size.height} · 会话 {inst.sessionIds.length}
                  </span>
                </div>
                {/* 状态指示 */}
                <div className="w-2 h-2 rounded-full" style={{ background: inst.isMinimized ? "#ffb86c" : inst.isVisible ? "#00ff87" : "rgba(255,255,255,0.2)" }} />
              </div>

              {/* 操作栏 */}
              <div className="flex items-center gap-1 mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <button onClick={() => activateWindow(inst.windowId)} className="p-1.5 rounded-md transition-colors" style={{ background: "rgba(255,255,255,0.04)" }} title="聚焦">
                  <Eye size={12} color="rgba(255,255,255,0.5)" />
                </button>
                <button onClick={() => minimizeWindow(inst.windowId)} className="p-1.5 rounded-md transition-colors" style={{ background: "rgba(255,255,255,0.04)" }} title="最小化">
                  <Minimize2 size={12} color="rgba(255,255,255,0.5)" />
                </button>
                <button onClick={() => inst.isMaximized ? restoreWindow(inst.windowId) : maximizeWindow(inst.windowId)} className="p-1.5 rounded-md transition-colors" style={{ background: "rgba(255,255,255,0.04)" }} title="最大化/还原">
                  <Maximize2 size={12} color="rgba(255,255,255,0.5)" />
                </button>
                <div className="flex-1" />
                {!inst.isMain && (
                  <button onClick={() => closeWindow(inst.windowId)} className="p-1.5 rounded-md transition-colors" style={{ background: "rgba(255,100,100,0.06)" }} title="关闭">
                    <X size={12} color="#ff6464" />
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
 *  工作区面板
 * ═══════════════════════════════════════════════════════ */

const WorkspacesPanel: React.FC = () => {
  const { workspaces, createWorkspace, deleteWorkspace, activateWorkspace, duplicateWorkspace, activeWorkspaceId } = useMultiInstanceStore();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [wsType, setWsType] = useState<WorkspaceType>("project");

  const handleCreate = () => {
    if (!name.trim()) return;
    const id = createWorkspace(name.trim(), wsType);
    activateWorkspace(id);
    setName("");
    setShowCreate(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderKanban size={16} style={{ color: "#00ff87" }} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>工作区 ({workspaces.length})</span>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{ fontSize: "12px", background: "rgba(0,255,135,0.1)", border: "1px solid rgba(0,255,135,0.2)", color: "#00ff87" }}
        >
          <Plus size={13} /> 新建工作区
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
            <GlassCard style={{ border: "1px solid rgba(0,255,135,0.15)" }}>
              <div className="flex flex-col gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="工作区名称..."
                  className="px-3 py-2 rounded-lg w-full"
                  style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
                />
                <div className="flex flex-wrap gap-2">
                  {(["project", "ai-session", "debug", "custom"] as WorkspaceType[]).map((wt) => (
                    <button
                      key={wt}
                      onClick={() => setWsType(wt)}
                      className="px-3 py-1.5 rounded-lg"
                      style={{
                        fontSize: "12px",
                        background: wsType === wt ? "rgba(0,255,135,0.1)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${wsType === wt ? "rgba(0,255,135,0.25)" : "rgba(255,255,255,0.06)"}`,
                        color: wsType === wt ? "#00ff87" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {wsTypeLabels[wt]}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 rounded-lg" style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>取消</button>
                  <button onClick={handleCreate} disabled={!name.trim()} className="px-3 py-1.5 rounded-lg" style={{ fontSize: "12px", color: "#0a0a12", background: "#00ff87", border: "none", fontWeight: 600, opacity: name.trim() ? 1 : 0.4 }}>创建</button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {workspaces.length === 0 ? (
        <div className="flex flex-col items-center py-12 opacity-40">
          <FolderKanban size={32} />
          <p className="mt-3" style={{ fontSize: "13px" }}>暂无工作区</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {workspaces.map((ws) => (
            <GlassCard
              key={ws.id}
              style={{ border: activeWorkspaceId === ws.id ? `1px solid ${ws.color}33` : "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${ws.color}15`, border: `1px solid ${ws.color}25` }}>
                  <FolderKanban size={18} style={{ color: ws.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate" style={{ fontSize: "14px", fontWeight: 600 }}>{ws.name}</span>
                    <span className="px-1.5 py-0.5 rounded" style={{ fontSize: "10px", background: `${ws.color}15`, color: ws.color }}>
                      {wsTypeLabels[ws.type]}
                    </span>
                    {ws.isActive && <span className="px-1.5 py-0.5 rounded" style={{ fontSize: "9px", background: "rgba(0,255,135,0.12)", color: "#00ff87" }}>激活</span>}
                  </div>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                    {ws.sessionIds.length} 个会话 · {ws.projectPath || "无项目路径"} · {new Date(ws.updatedAt).toLocaleString("zh-CN")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {!ws.isActive && (
                    <button onClick={() => activateWorkspace(ws.id)} className="p-1.5 rounded-md" style={{ background: "rgba(0,255,135,0.06)" }} title="激活">
                      <Play size={12} color="#00ff87" />
                    </button>
                  )}
                  <button onClick={() => duplicateWorkspace(ws.id)} className="p-1.5 rounded-md" style={{ background: "rgba(255,255,255,0.04)" }} title="复制">
                    <Copy size={12} color="rgba(255,255,255,0.4)" />
                  </button>
                  <button onClick={() => deleteWorkspace(ws.id)} className="p-1.5 rounded-md" style={{ background: "rgba(255,100,100,0.06)" }} title="删除">
                    <Trash2 size={12} color="#ff6464" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
 *  会话面板
 * ═══════════════════════════════════════════════════════ */

const SessionsPanel: React.FC = () => {
  const { sessions, workspaces, instances, createSession, deleteSession, activateSession, suspendSession, resumeSession, activeSessionId } = useMultiInstanceStore();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [sessType, setSessType] = useState<SessionType>("ai-chat");
  const [wsId, setWsId] = useState("");
  const [winId, setWinId] = useState("");

  const handleCreate = () => {
    if (!name.trim() || !wsId || !winId) return;
    createSession(name.trim(), sessType, wsId, winId);
    setName("");
    setShowCreate(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} style={{ color: "#a855f7" }} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>
            会话 ({sessions.length}) ·
            <span style={{ color: "#00ff87" }}> {sessions.filter((s) => s.status === "active").length} 活跃</span>
          </span>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{ fontSize: "12px", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#a855f7" }}
        >
          <Plus size={13} /> 新建会话
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
            <GlassCard style={{ border: "1px solid rgba(168,85,247,0.15)" }}>
              <div className="flex flex-col gap-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="会话名称..." className="px-3 py-2 rounded-lg w-full" style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }} />
                <div className="flex flex-wrap gap-2">
                  {(["ai-chat", "code-edit", "debug", "preview", "terminal"] as SessionType[]).map((st) => (
                    <button key={st} onClick={() => setSessType(st)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg" style={{ fontSize: "12px", background: sessType === st ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${sessType === st ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.06)"}`, color: sessType === st ? "#a855f7" : "rgba(255,255,255,0.4)" }}>
                      {sessionTypeIcons[st]} {st}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select value={wsId} onChange={(e) => setWsId(e.target.value)} className="px-3 py-2 rounded-lg" style={{ fontSize: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}>
                    <option value="" style={{ background: "#1a1a2e" }}>选择工作区...</option>
                    {workspaces.map((w) => <option key={w.id} value={w.id} style={{ background: "#1a1a2e" }}>{w.name}</option>)}
                  </select>
                  <select value={winId} onChange={(e) => setWinId(e.target.value)} className="px-3 py-2 rounded-lg" style={{ fontSize: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}>
                    <option value="" style={{ background: "#1a1a2e" }}>选择窗口...</option>
                    {instances.map((i) => <option key={i.windowId} value={i.windowId} style={{ background: "#1a1a2e" }}>{i.title}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 rounded-lg" style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>取消</button>
                  <button onClick={handleCreate} disabled={!name.trim() || !wsId || !winId} className="px-3 py-1.5 rounded-lg" style={{ fontSize: "12px", color: "#0a0a12", background: "#a855f7", border: "none", fontWeight: 600, opacity: name.trim() && wsId && winId ? 1 : 0.4 }}>创建</button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center py-12 opacity-40">
          <MessageSquare size={32} />
          <p className="mt-3" style={{ fontSize: "13px" }}>暂无会话，先创建窗口和工作区</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sessions.map((sess) => (
            <GlassCard key={sess.id} style={{ border: activeSessionId === sess.id ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${statusColors[sess.status]}15` }}>
                  {sessionTypeIcons[sess.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate" style={{ fontSize: "13px", fontWeight: 600 }}>{sess.name}</span>
                    <span className="px-1.5 py-0.5 rounded" style={{ fontSize: "9px", background: `${statusColors[sess.status]}15`, color: statusColors[sess.status] }}>{sess.status}</span>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>{sess.type}</span>
                  </div>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
                    {workspaces.find((w) => w.id === sess.workspaceId)?.name || "—"} · {new Date(sess.updatedAt).toLocaleTimeString("zh-CN")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {sess.status === "active" && (
                    <button onClick={() => suspendSession(sess.id)} className="p-1.5 rounded-md" style={{ background: "rgba(168,85,247,0.06)" }} title="暂停"><Pause size={12} color="#a855f7" /></button>
                  )}
                  {sess.status === "suspended" && (
                    <button onClick={() => resumeSession(sess.id)} className="p-1.5 rounded-md" style={{ background: "rgba(0,255,135,0.06)" }} title="恢复"><Play size={12} color="#00ff87" /></button>
                  )}
                  <button onClick={() => deleteSession(sess.id)} className="p-1.5 rounded-md" style={{ background: "rgba(255,100,100,0.06)" }} title="删除"><Trash2 size={12} color="#ff6464" /></button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
 *  IPC 通信面板
 * ═══════════════════════════════════════════════════════ */

const IPCPanel: React.FC = () => {
  const { ipcLog } = useMultiInstanceStore();
  const recent = [...ipcLog].reverse().slice(0, 30);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Radio size={16} style={{ color: "#ffb86c" }} />
        <span style={{ fontSize: "14px", fontWeight: 600 }}>IPC 通信日志 ({ipcLog.length})</span>
      </div>

      {recent.length === 0 ? (
        <div className="flex flex-col items-center py-12 opacity-40">
          <Radio size={32} />
          <p className="mt-3" style={{ fontSize: "13px" }}>暂无 IPC 消息</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1 overflow-y-auto" style={{ maxHeight: "500px" }}>
          {recent.map((msg) => (
            <div key={msg.id} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#ffb86c" }} />
              <span className="px-1.5 py-0.5 rounded flex-shrink-0" style={{ fontSize: "10px", fontFamily: "monospace", background: "rgba(255,184,108,0.1)", color: "#ffb86c" }}>{msg.type}</span>
              <span className="flex-1 truncate" style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
                {typeof msg.data === "object" ? JSON.stringify(msg.data).slice(0, 80) : String(msg.data)}
              </span>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>
                {new Date(msg.timestamp).toLocaleTimeString("zh-CN")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
 *  资源监控面板
 * ═══════════════════════════════════════════════════════ */

const ResourcesPanel: React.FC = () => {
  const { metrics, updateMetrics } = useMultiInstanceStore();

  const cards = [
    { label: "内存使用", value: `${metrics.memoryUsageMB} MB`, icon: <MemoryStick size={18} />, color: "#60efff", percent: Math.min(100, metrics.memoryUsageMB / 10) },
    { label: "CPU 占用", value: `${metrics.cpuPercent}%`, icon: <Cpu size={18} />, color: "#00ff87", percent: metrics.cpuPercent },
    { label: "活跃窗口", value: `${metrics.activeWindows}`, icon: <AppWindow size={18} />, color: "#a855f7", percent: metrics.activeWindows * 20 },
    { label: "活跃会话", value: `${metrics.activeSessions}`, icon: <MessageSquare size={18} />, color: "#ffb86c", percent: metrics.activeSessions * 15 },
    { label: "IPC 消息/秒", value: `${metrics.ipcMessagesPerSec}`, icon: <Radio size={18} />, color: "#ec4899", percent: metrics.ipcMessagesPerSec * 10 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={16} style={{ color: "#ec4899" }} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>资源监控</span>
        </div>
        <button onClick={updateMetrics} className="flex items-center gap-1 px-3 py-1.5 rounded-lg" style={{ fontSize: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
          <RefreshCw size={12} /> 刷新
        </button>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {cards.map((card) => (
          <GlassCard key={card.label}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}12` }}>
                <span style={{ color: card.color }}>{card.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{card.label}</div>
              </div>
            </div>
            {/* 进度条 */}
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: card.color }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, card.percent)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default MultiInstancePage;

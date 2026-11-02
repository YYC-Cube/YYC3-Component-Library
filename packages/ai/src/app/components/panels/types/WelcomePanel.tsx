/**
 * @file WelcomePanel.tsx
 * @description 欢迎引导页面 v2.0 — 品牌展示 + 项目创建向导 + 模板选择器 + 快速开始 + 最近项目
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, welcome, onboarding, quick-start, project-wizard, templates
 */

import React, { useState } from "react";
import {
  Code, FolderTree, Eye, Terminal, Bot, Database,
  GitBranch, LayoutDashboard, ArrowRight, ExternalLink, Zap,
  FileCode, Shield, Rocket, BookOpen, Keyboard,
  Sparkles, Package, ChevronRight, Clock, Star,
  Plus, ArrowLeft, Check, X,
  Layers, AppWindow, Server, Paintbrush, ChartBar,
  FolderPlus, Globe, LoaderCircle,
} from "lucide-react";
import { useLayoutStore, type PanelType } from "../../../stores/layoutStore";
import { scaffoldProject, type ScaffoldProgress } from "../../../services/projectScaffoldService";

/* ─── 项目模板 ─── */
interface ProjectTemplate {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  tags: string[];
  stack: string[];
  files: number;
}

const projectTemplates: ProjectTemplate[] = [
  { id: "react-ts", name: "React + TypeScript", desc: "现代 React SPA 应用，含路由和状态管理", icon: Code, color: "#61dafb", tags: ["前端", "SPA"], stack: ["React 18", "TypeScript", "Vite", "Zustand"], files: 12 },
  { id: "fullstack", name: "全栈应用", desc: "React 前端 + Tauri 后端完整项目结构", icon: Layers, color: "#00ff87", tags: ["全栈", "桌面"], stack: ["React", "Tauri", "Rust", "SQLite"], files: 24 },
  { id: "dashboard", name: "数据仪表盘", desc: "数据可视化仪表盘，含图表和实时更新", icon: ChartBar, color: "#a855f7", tags: ["可视化", "仪表盘"], stack: ["React", "Recharts", "TanStack Query"], files: 16 },
  { id: "design-system", name: "设计系统", desc: "组件库与设计令牌系统基础模板", icon: Paintbrush, color: "#f97316", tags: ["UI", "组件库"], stack: ["React", "Tailwind CSS", "Storybook"], files: 20 },
  { id: "api-server", name: "API 服务", desc: "RESTful API 服务端项目，含认证和数据库", icon: Server, color: "#60efff", tags: ["后端", "API"], stack: ["Rust", "Axum", "PostgreSQL", "Redis"], files: 18 },
  { id: "desktop-app", name: "桌面应用", desc: "跨平台桌面应用，原生系统集成", icon: AppWindow, color: "#e8a838", tags: ["桌面", "跨平台"], stack: ["Tauri", "React", "Rust"], files: 22 },
];

/* ─── 快捷操作 ─── */
const quickActions: { id: string; title: string; desc: string; icon: React.ElementType; color: string; panelType: PanelType }[] = [
  { id: "code", title: "编写代码", desc: "打开代码编辑器开始编码", icon: Code, color: "#00ff87", panelType: "code-editor" },
  { id: "preview", title: "实时预览", desc: "多设备并排实时预览效果", icon: Eye, color: "#60efff", panelType: "preview" },
  { id: "ai", title: "AI 助手", desc: "智能编程辅助与代码生成", icon: Bot, color: "#a855f7", panelType: "ai-chat" },
  { id: "terminal", title: "终端", desc: "集成终端执行命令", icon: Terminal, color: "#f97316", panelType: "terminal" },
  { id: "files", title: "文件管理", desc: "浏览与管理工作区文件", icon: FolderTree, color: "#e8a838", panelType: "file-browser" },
  { id: "db", title: "数据库", desc: "连接与管理本地数据库", icon: Database, color: "#336791", panelType: "database" },
  { id: "git", title: "版本控制", desc: "Git 操作与提交管理", icon: GitBranch, color: "#f97316", panelType: "version-control" },
  { id: "dashboard", title: "仪表盘", desc: "项目概览与系统监控", icon: LayoutDashboard, color: "#00ff87", panelType: "dashboard" },
];

/* ─── 最近项目 ─── */
const mockRecentProjects = [
  { id: "p1", name: "YYC³ AI Code", path: "~/projects/yyc3-ai-code", language: "TypeScript", lastOpened: Date.now() - 3600_000, starred: true },
  { id: "p2", name: "Dashboard Pro", path: "~/projects/dashboard-pro", language: "React", lastOpened: Date.now() - 86400_000, starred: false },
  { id: "p3", name: "API Gateway", path: "~/projects/api-gateway", language: "Rust", lastOpened: Date.now() - 172800_000, starred: true },
  { id: "p4", name: "Design System", path: "~/projects/design-system", language: "TypeScript", lastOpened: Date.now() - 259200_000, starred: false },
];

const learningResources = [
  { icon: BookOpen, title: "快速开始指南", desc: "5 分钟上手 YYC³ AI Code", color: "#00ff87" },
  { icon: Sparkles, title: "AI 辅助编程", desc: "利用 AI 提升开发效率", color: "#a855f7" },
  { icon: Package, title: "插件生态", desc: "探索社区插件与扩展", color: "#60efff" },
  { icon: Shield, title: "安全与隐私", desc: "了解数据加密与安全机制", color: "#ff6b6b" },
];

const formatTimeAgo = (ts: number): string => {
  const d = Date.now() - ts;
  if (d < 3600_000) return `${Math.floor(d / 60_000)} 分钟前`;
  if (d < 86400_000) return `${Math.floor(d / 3600_000)} 小时前`;
  return `${Math.floor(d / 86400_000)} 天前`;
};

/* ─── 项目创建向导组件 ─── */
const ProjectWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectPath, setProjectPath] = useState("~/projects/");
  const [initGit, setInitGit] = useState(true);
  const [installDeps, setInstallDeps] = useState(true);
  const [openAfter, setOpenAfter] = useState(true);
  const [progress, setProgress] = useState<ScaffoldProgress | null>(null);

  const template = projectTemplates.find((t) => t.id === selectedTemplate);

  const handleCreate = async () => {
    if (!selectedTemplate || !projectName.trim()) return;
    setStep(3);
    setProgress({ phase: "prepare", message: "准备中...", percent: 0 });
    try {
      await scaffoldProject(
        { templateId: selectedTemplate, projectName: projectName.trim(), projectPath, initGit, installDeps, openAfter },
        (p) => setProgress(p)
      );
      setTimeout(onClose, 1800);
    } catch {
      // error is shown via progress.phase === "error"
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
      <div className="rounded-2xl overflow-hidden" style={{ background: "#14142a", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 80px rgba(0,0,0,0.5)", width: "580px", maxHeight: "85vh" }}>
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2.5">
            <FolderPlus size={16} style={{ color: "#00ff87" }} />
            <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>新建项目</span>
            <div className="flex items-center gap-1 ml-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: step >= s ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${step >= s ? "rgba(0,255,135,0.3)" : "rgba(255,255,255,0.06)"}`, fontSize: "9px", color: step >= s ? "#00ff87" : "rgba(255,255,255,0.2)" }}>
                    {step > s ? <Check size={9} /> : s}
                  </div>
                  {s < 3 && <div className="w-6 h-px" style={{ background: step > s ? "rgba(0,255,135,0.3)" : "rgba(255,255,255,0.06)" }} />}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="w-6 h-6 rounded-lg flex items-center justify-center opacity-30 hover:opacity-60"><X size={14} /></button>
        </div>

        {/* 步骤 1: 选择模板 */}
        {step === 1 && (
          <div className="p-5">
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>选择项目模板作为起点</p>
            <div className="grid grid-cols-2 gap-2.5" style={{ maxHeight: "320px", overflowY: "auto" }}>
              {projectTemplates.map((tpl) => {
                const selected = selectedTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className="flex items-start gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      background: selected ? `${tpl.color}08` : "rgba(255,255,255,0.02)",
                      border: `1px solid ${selected ? `${tpl.color}30` : "rgba(255,255,255,0.05)"}`,
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${tpl.color}12`, border: `1px solid ${tpl.color}20` }}>
                      <tpl.icon size={16} style={{ color: tpl.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontSize: "11.5px", fontWeight: 600, color: selected ? tpl.color : "rgba(255,255,255,0.8)" }}>{tpl.name}</span>
                        {selected && <Check size={10} style={{ color: tpl.color }} />}
                      </div>
                      <div style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.3)", marginTop: "2px", lineHeight: "1.4" }}>{tpl.desc}</div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {tpl.tags.map((tag) => (
                          <span key={tag} className="px-1.5 py-0 rounded" style={{ fontSize: "8px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => selectedTemplate && setStep(2)}
                disabled={!selectedTemplate}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all"
                style={{
                  fontSize: "12px",
                  background: selectedTemplate ? "linear-gradient(135deg, #00ff87, #60efff)" : "rgba(255,255,255,0.04)",
                  color: selectedTemplate ? "#000" : "rgba(255,255,255,0.2)",
                  fontWeight: selectedTemplate ? 600 : 400,
                  opacity: selectedTemplate ? 1 : 0.5,
                }}
              >
                下一步 <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* 步骤 2: 配置项目 */}
        {step === 2 && template && (
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{ background: `${template.color}06`, border: `1px solid ${template.color}15` }}>
              <template.icon size={14} style={{ color: template.color }} />
              <span style={{ fontSize: "11.5px", color: template.color, fontWeight: 500 }}>{template.name}</span>
              <div className="flex-1" />
              <div className="flex gap-1">{template.stack.map((s) => <span key={s} className="px-1.5 py-0 rounded" style={{ fontSize: "8px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)" }}>{s}</span>)}</div>
            </div>

            <div className="space-y-4">
              <div>
                <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>项目名称</label>
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-awesome-project"
                  className="w-full px-3 py-2 rounded-lg bg-transparent outline-none"
                  style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>项目路径</label>
                <div className="flex gap-2">
                  <input
                    value={projectPath}
                    onChange={(e) => setProjectPath(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-transparent outline-none"
                    style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
                  />
                  <button className="px-3 py-2 rounded-lg" style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    浏览...
                  </button>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "初始化 Git 仓库", value: initGit, set: setInitGit },
                  { label: "自动安装依赖", value: installDeps, set: setInstallDeps },
                  { label: "创建后自动打开", value: openAfter, set: setOpenAfter },
                ].map((opt) => (
                  <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer">
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center transition-colors"
                      style={{
                        background: opt.value ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${opt.value ? "rgba(0,255,135,0.3)" : "rgba(255,255,255,0.08)"}`,
                      }}
                      onClick={() => opt.set(!opt.value)}
                    >
                      {opt.value && <Check size={9} style={{ color: "#00ff87" }} />}
                    </div>
                    <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.6)" }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-5">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 px-3 py-2 rounded-lg" style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.03)" }}>
                <ArrowLeft size={11} /> 返回
              </button>
              <button
                onClick={handleCreate}
                disabled={!projectName.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg transition-all"
                style={{
                  fontSize: "12px",
                  background: projectName.trim() ? "linear-gradient(135deg, #00ff87, #60efff)" : "rgba(255,255,255,0.04)",
                  color: projectName.trim() ? "#000" : "rgba(255,255,255,0.2)",
                  fontWeight: 600,
                  opacity: projectName.trim() ? 1 : 0.5,
                }}
              >
                <Rocket size={12} /> 创建项目
              </button>
            </div>
          </div>
        )}

        {/* 步骤 3: 创建中 — 实时进度 */}
        {step === 3 && template && (
          <div className="p-6">
            {/* 顶部图标 */}
            <div className="text-center mb-5">
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                style={{
                  background: progress?.phase === "error" ? "rgba(255,107,107,0.15)" : progress?.phase === "complete" ? `${template.color}15` : `${template.color}08`,
                  border: `1px solid ${progress?.phase === "error" ? "rgba(255,107,107,0.3)" : `${template.color}25`}`,
                }}
              >
                {progress?.phase === "complete" ? (
                  <Check size={24} style={{ color: template.color }} />
                ) : progress?.phase === "error" ? (
                  <X size={24} style={{ color: "#ff6b6b" }} />
                ) : (
                  <LoaderCircle size={24} className="animate-spin" style={{ color: template.color }} />
                )}
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                {progress?.phase === "complete" ? "项目创建成功!" : progress?.phase === "error" ? "创建失败" : "正在创建项目..."}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>
                {projectName} · {template.name}
              </div>
            </div>

            {/* 进度条 */}
            <div className="mb-4">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress?.percent || 0}%`,
                    background: progress?.phase === "error" ? "#ff6b6b" : `linear-gradient(90deg, ${template.color}, #60efff)`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{progress?.message || "准备中..."}</span>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>{progress?.percent || 0}%</span>
              </div>
            </div>

            {/* 进度详情 */}
            {progress?.detail && (
              <div className="px-3 py-2 rounded-lg mb-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", fontFamily: "'SF Mono', monospace" }}>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>{progress.detail}</span>
              </div>
            )}

            {/* 阶段指示 */}
            <div className="flex items-center justify-center gap-3 mb-4">
              {(["prepare", "scaffold", "git", "deps", "complete"] as const).map((phase) => {
                const phaseLabels: Record<string, string> = { prepare: "准备", scaffold: "生成文件", git: "Git", deps: "依赖", complete: "完成" };
                const isCurrent = progress?.phase === phase;
                const isDone = progress ? ["prepare", "scaffold", "git", "deps", "complete"].indexOf(progress.phase) > ["prepare", "scaffold", "git", "deps", "complete"].indexOf(phase) : false;
                return (
                  <div key={phase} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: isDone ? "rgba(0,255,135,0.15)" : isCurrent ? `${template.color}15` : "rgba(255,255,255,0.04)", border: `1px solid ${isDone ? "rgba(0,255,135,0.3)" : isCurrent ? `${template.color}30` : "rgba(255,255,255,0.06)"}` }}>
                      {isDone ? <Check size={8} style={{ color: "#00ff87" }} /> : <span style={{ fontSize: "6px", color: isCurrent ? template.color : "rgba(255,255,255,0.15)" }}>●</span>}
                    </div>
                    <span style={{ fontSize: "9px", color: isCurrent ? template.color : isDone ? "rgba(0,255,135,0.6)" : "rgba(255,255,255,0.15)" }}>{phaseLabels[phase]}</span>
                  </div>
                );
              })}
            </div>

            {/* 技术栈标签 */}
            <div className="flex justify-center gap-1.5">
              {template.stack.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-full" style={{ fontSize: "9px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)" }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── 主组件 ─── */
export const WelcomePanel: React.FC = () => {
  const { splitPanel, activePanelId, createPanel, setActivePanel, panels } = useLayoutStore();
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const openPanel = (type: PanelType) => {
    const existing = Object.values(panels).find((p) => p.type === type);
    if (existing) {
      setActivePanel(existing.id);
    } else if (activePanelId) {
      splitPanel(activePanelId, "horizontal", type);
    } else {
      createPanel(type);
    }
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0e0e1a" }}>
      <div className="max-w-[720px] mx-auto px-6 py-8">

        {/* ═══ 品牌头部 ═══ */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center relative"
            style={{ background: "linear-gradient(135deg, rgba(0,255,135,0.15), rgba(96,239,255,0.15), rgba(168,85,247,0.15))", border: "1px solid rgba(0,255,135,0.2)", boxShadow: "0 0 60px rgba(0,255,135,0.08)" }}
          >
            <Rocket size={32} style={{ color: "#00ff87" }} />
            <div className="absolute inset-0 rounded-2xl animate-pulse" style={{ background: "linear-gradient(135deg, rgba(0,255,135,0.05), rgba(96,239,255,0.03))", opacity: 0.5 }} />
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: "-0.5px" }}>YYC³ AI Code</h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "6px" }}>言传千行代码 · 语枢万物智能</p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", marginTop: "4px" }}>v1.0.0 · YanYuCloudCube Family AI</p>
        </div>

        {/* ═══ 新建项目按钮 ═══ */}
        <div className="mb-8">
          <button
            onClick={() => setShowWizard(true)}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl transition-all"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,135,0.06), rgba(96,239,255,0.04))",
              border: "1px dashed rgba(0,255,135,0.2)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,255,135,0.1), rgba(96,239,255,0.07))"; e.currentTarget.style.borderStyle = "solid"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,255,135,0.06), rgba(96,239,255,0.04))"; e.currentTarget.style.borderStyle = "dashed"; }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,255,135,0.12)", border: "1px solid rgba(0,255,135,0.2)" }}>
              <Plus size={18} style={{ color: "#00ff87" }} />
            </div>
            <div className="text-left">
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#00ff87" }}>创建新项目</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>从模板快速创建，选择技术栈开始构建</div>
            </div>
            <ArrowRight size={14} style={{ color: "rgba(0,255,135,0.4)", marginLeft: "auto" }} />
          </button>
        </div>

        {/* ═══ 快捷操作网格 ═══ */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={13} style={{ color: "#00ff87" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>快速开始</span>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {quickActions.map((action) => {
              const isHovered = hoveredAction === action.id;
              return (
                <button key={action.id} onClick={() => openPanel(action.panelType)} onMouseEnter={() => setHoveredAction(action.id)} onMouseLeave={() => setHoveredAction(null)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 text-center"
                  style={{ background: isHovered ? `${action.color}08` : "rgba(255,255,255,0.02)", border: `1px solid ${isHovered ? `${action.color}25` : "rgba(255,255,255,0.05)"}`, transform: isHovered ? "translateY(-2px)" : "none", boxShadow: isHovered ? `0 8px 24px ${action.color}10` : "none" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${action.color}10`, border: `1px solid ${action.color}20` }}>
                    <action.icon size={18} style={{ color: action.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "11.5px", fontWeight: 600, color: isHovered ? action.color : "rgba(255,255,255,0.7)" }}>{action.title}</div>
                    <div style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.25)", marginTop: "2px", lineHeight: "1.3" }}>{action.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══ 最近项目 ═══ */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Clock size={13} style={{ color: "#60efff" }} /><span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>最近项目</span></div>
            <button className="flex items-center gap-1" style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.25)" }}>查看全部 <ChevronRight size={10} /></button>
          </div>
          <div className="space-y-1.5">
            {mockRecentProjects.map((p) => (
              <button key={p.id} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,255,135,0.06)", border: "1px solid rgba(0,255,135,0.1)" }}><FileCode size={16} style={{ color: "#00ff87" }} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate" style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>{p.name}</span>
                    {p.starred && <Star size={10} fill="#ffb86c" style={{ color: "#ffb86c" }} />}
                    <span className="px-1.5 py-0 rounded flex-shrink-0" style={{ fontSize: "8.5px", background: "rgba(96,239,255,0.08)", color: "rgba(96,239,255,0.6)" }}>{p.language}</span>
                  </div>
                  <div className="truncate" style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", marginTop: "2px" }}>{p.path}</div>
                </div>
                <div style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.15)" }}>{formatTimeAgo(p.lastOpened)}</div>
                <ArrowRight size={12} style={{ color: "rgba(255,255,255,0.1)" }} />
              </button>
            ))}
          </div>
        </div>

        {/* ═══ 学习资源 ═══ */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3"><BookOpen size={13} style={{ color: "#a855f7" }} /><span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>学习资源</span></div>
          <div className="grid grid-cols-2 gap-2">
            {learningResources.map((res, i) => (
              <button key={i} className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${res.color}05`; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${res.color}10` }}><res.icon size={15} style={{ color: res.color }} /></div>
                <div className="min-w-0">
                  <div style={{ fontSize: "11.5px", fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{res.title}</div>
                  <div style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.25)", marginTop: "1px" }}>{res.desc}</div>
                </div>
                <ExternalLink size={10} style={{ color: "rgba(255,255,255,0.1)" }} className="flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* ═══ 键盘快捷键 ═══ */}
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-2 mb-3"><Keyboard size={12} style={{ color: "rgba(255,255,255,0.35)" }} /><span style={{ fontSize: "11.5px", fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>常用快捷键</span></div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {[
              { keys: "Ctrl+Shift+P", desc: "命令面板" }, { keys: "Ctrl+B", desc: "切换侧栏" },
              { keys: "Ctrl+`", desc: "打开终端" }, { keys: "Ctrl+Shift+N", desc: "新建文件" },
              { keys: "Ctrl+P", desc: "快速打开" }, { keys: "Ctrl+,", desc: "设置" },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.3)" }}>{s.desc}</span>
                <div className="flex items-center gap-0.5">
                  {s.keys.split("+").map((k, j) => (
                    <React.Fragment key={j}>
                      {j > 0 && <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.1)", margin: "0 1px" }}>+</span>}
                      <kbd className="px-1.5 py-0.5 rounded" style={{ fontSize: "9px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>{k}</kbd>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部品牌 */}
        <div className="text-center mt-8 pb-4">
          <p style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.1)", lineHeight: "1.6" }}>万象归元于云枢 · 深栈智启新纪元</p>
          <p style={{ fontSize: "8.5px", color: "rgba(255,255,255,0.06)", marginTop: "4px" }}>Copyright &copy; 2026 YanYuCloudCube Team &middot; MIT License</p>
        </div>
      </div>

      {/* 项目创建向导弹窗 */}
      {showWizard && <ProjectWizard onClose={() => setShowWizard(false)} />}
    </div>
  );
};
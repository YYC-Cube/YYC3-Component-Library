/**
 * @file PluginManagerPanel.tsx
 * @description 插件管理面板 v2.0 — 安装/卸载动画 + 插件配置表单 + 依赖检测 + 分类筛选
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.0.0
 * @created 2026-03-14
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, plugin, marketplace, install-animation, config-form, dependencies
 */

import React, { useState, useEffect } from "react";
import {
  Puzzle, Search, ToggleLeft, ToggleRight, Trash2,
  RefreshCw, ChevronDown, ChevronRight,
  Check, X, ExternalLink, GitBranch, Code,
  Eye, Bot, Palette, Database, Wrench, Settings,
  Zap, Shield, Clock, HardDrive,
  PackageCheck, Link2,
} from "lucide-react";
import {
  usePluginStore,
  type PluginRegistration,
  type PluginCategory,
} from "../../../stores/pluginStore";

/* ─── 分类图标 ─── */
const categoryMeta: Record<PluginCategory, { icon: React.ElementType; label: string; color: string }> = {
  storage: { icon: Database, label: "存储", color: "#00ff87" },
  ai: { icon: Bot, label: "AI", color: "#a855f7" },
  editor: { icon: Code, label: "编辑器", color: "#60efff" },
  preview: { icon: Eye, label: "预览", color: "#ffb86c" },
  theme: { icon: Palette, label: "主题", color: "#ff6b6b" },
  integration: { icon: GitBranch, label: "集成", color: "#50fa7b" },
  tool: { icon: Wrench, label: "工具", color: "#8be9fd" },
};

/* ─── 模拟插件依赖映射 ─── */
const pluginDependencies: Record<string, string[]> = {
  "eslint-plugin": ["typescript", "node-runtime"],
  "prettier-plugin": ["eslint-plugin"],
  "git-integration": ["node-runtime"],
  "ai-copilot": ["openai-sdk", "typescript"],
  "tailwind-intellisense": ["tailwindcss", "postcss"],
  "live-share": ["websocket-client", "diff-engine"],
  "sqlite-storage": ["better-sqlite3", "node-runtime"],
  "theme-aurora": [],
};

/* ─── 模拟插件配置 ─── */
const pluginConfigs: Record<string, Array<{ key: string; label: string; type: "text" | "toggle" | "select"; value: string; options?: string[] }>> = {
  "eslint-plugin": [
    { key: "autoFix", label: "自动修复", type: "toggle", value: "true" },
    { key: "ruleset", label: "规则集", type: "select", value: "recommended", options: ["recommended", "strict", "off"] },
  ],
  "prettier-plugin": [
    { key: "formatOnSave", label: "保存时格式化", type: "toggle", value: "true" },
    { key: "tabWidth", label: "缩进宽度", type: "text", value: "2" },
    { key: "singleQuote", label: "单引号", type: "toggle", value: "false" },
  ],
  "ai-copilot": [
    { key: "autoComplete", label: "自动补全", type: "toggle", value: "true" },
    { key: "provider", label: "AI 服务商", type: "select", value: "openai", options: ["openai", "anthropic", "zhipuai"] },
  ],
  "tailwind-intellisense": [
    { key: "classSort", label: "类名排序", type: "toggle", value: "true" },
    { key: "configPath", label: "配置路径", type: "text", value: "tailwind.config.js" },
  ],
};

/* ─── 插件卡片 ─── */
const PluginCard: React.FC<{
  plugin: PluginRegistration;
  expanded: boolean;
  onToggle: () => void;
}> = ({ plugin, expanded, onToggle }) => {
  const { enablePlugin, disablePlugin, unregisterPlugin } = usePluginStore();
  const meta = categoryMeta[plugin.category];
  const Icon = meta.icon;
  const [uninstalling, setUninstalling] = useState(false);
  const [uninstallProgress, setUninstallProgress] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const [showDeps, setShowDeps] = useState(false);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});

  const deps = pluginDependencies[plugin.id] || [];
  const configs = pluginConfigs[plugin.id] || [];

  // 初始化配置值
  useEffect(() => {
    const pluginConfEntry = pluginConfigs[plugin.id] || [];
    if (pluginConfEntry.length > 0) {
      const initial: Record<string, string> = {};
      pluginConfEntry.forEach((c) => { initial[c.key] = c.value; });
      setConfigValues(initial);
    }
  }, [plugin.id]);

  const handleUninstall = async () => {
    setUninstalling(true);
    setUninstallProgress(0);
    // 模拟卸载进度
    for (let i = 1; i <= 10; i++) {
      await new Promise((r) => setTimeout(r, 120));
      setUninstallProgress(i * 10);
    }
    unregisterPlugin(plugin.id);
    setUninstalling(false);
  };

  const statusColors: Record<string, string> = {
    active: "#00ff87",
    inactive: "rgba(255,255,255,0.25)",
    error: "#ff6b6b",
    updating: "#ffb86c",
  };

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: plugin.enabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.01)",
        border: `1px solid ${plugin.enabled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
      }}
    >
      {/* 头部 */}
      <div className="flex items-center gap-3 px-3 py-2.5 cursor-pointer" onClick={onToggle}>
        {expanded ? <ChevronDown size={11} className="opacity-30" /> : <ChevronRight size={11} className="opacity-30" />}

        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}20` }}
        >
          <Icon size={14} style={{ color: meta.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: "12.5px", fontWeight: 500, color: plugin.enabled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}>
              {plugin.name}
            </span>
            <span className="px-1 rounded" style={{ fontSize: "8.5px", background: `${meta.color}12`, color: meta.color }}>
              {meta.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5" style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
            <span>v{plugin.version}</span>
            <span>{plugin.author}</span>
            <span>{plugin.size}</span>
          </div>
        </div>

        {/* 状态 & 开关 */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <div className="w-2 h-2 rounded-full" style={{ background: statusColors[plugin.status] }} />
          <button
            onClick={() => plugin.enabled ? disablePlugin(plugin.id) : enablePlugin(plugin.id)}
            style={{ color: plugin.enabled ? "#00ff87" : "rgba(255,255,255,0.2)" }}
          >
            {plugin.enabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          </button>
        </div>
      </div>

      {/* 展开详情 */}
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="px-3 py-2.5">
            <p className="m-0 mb-3" style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
              {plugin.description}
            </p>

            {/* 能力标签 */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {plugin.hasUI && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded" style={{ fontSize: "9px", background: "rgba(96,239,255,0.06)", color: "#60efff", border: "1px solid rgba(96,239,255,0.1)" }}>
                  <Eye size={8} /> UI 面板
                </span>
              )}
              {plugin.hasStorage && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded" style={{ fontSize: "9px", background: "rgba(0,255,135,0.06)", color: "#00ff87", border: "1px solid rgba(0,255,135,0.1)" }}>
                  <Database size={8} /> 存储后端
                </span>
              )}
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded" style={{ fontSize: "9px", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}>
                <Zap size={8} /> {plugin.hookCount} 钩子
              </span>
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded" style={{ fontSize: "9px", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}>
                <Shield size={8} /> {plugin.license}
              </span>
            </div>

            {/* 时间信息 */}
            <div className="flex items-center gap-3 mb-3" style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
              <span className="flex items-center gap-0.5">
                <Clock size={9} /> 安装于 {new Date(plugin.installedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-0.5">
                <RefreshCw size={9} /> 更新于 {new Date(plugin.updatedAt).toLocaleDateString()}
              </span>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={handleUninstall}
                disabled={uninstalling}
                className="flex items-center gap-1 px-2 py-1 rounded transition-colors"
                style={{ fontSize: "10px", color: "#ff6b6b", background: "rgba(255,50,50,0.06)", border: "1px solid rgba(255,50,50,0.12)", opacity: uninstalling ? 0.5 : 1 }}
              >
                {uninstalling ? <RefreshCw size={10} className="animate-spin" /> : <Trash2 size={10} />}
                {uninstalling ? `卸载中 ${uninstallProgress}%` : "卸载"}
              </button>
              {configs.length > 0 && (
                <button
                  onClick={() => setShowConfig(!showConfig)}
                  className="flex items-center gap-1 px-2 py-1 rounded transition-colors"
                  style={{ fontSize: "10px", color: showConfig ? "#a855f7" : "rgba(255,255,255,0.4)", background: showConfig ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${showConfig ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.06)"}` }}
                >
                  <Settings size={10} /> 配置
                </button>
              )}
              {deps.length > 0 && (
                <button
                  onClick={() => setShowDeps(!showDeps)}
                  className="flex items-center gap-1 px-2 py-1 rounded transition-colors"
                  style={{ fontSize: "10px", color: showDeps ? "#60efff" : "rgba(255,255,255,0.4)", background: showDeps ? "rgba(96,239,255,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${showDeps ? "rgba(96,239,255,0.12)" : "rgba(255,255,255,0.06)"}` }}
                >
                  <Link2 size={10} /> 依赖 ({deps.length})
                </button>
              )}
              {plugin.homepage && (
                <a href={plugin.homepage} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 rounded no-underline transition-colors" style={{ fontSize: "10px", color: "#60efff", background: "rgba(96,239,255,0.04)" }}>
                  <ExternalLink size={9} /> 主页
                </a>
              )}
            </div>

            {/* 卸载进度条 */}
            {uninstalling && (
              <div className="mb-2 rounded-full overflow-hidden" style={{ height: "3px", background: "rgba(255,50,50,0.1)" }}>
                <div style={{ width: `${uninstallProgress}%`, height: "100%", background: "#ff6b6b", transition: "width 0.1s linear", borderRadius: "999px" }} />
              </div>
            )}

            {/* 依赖列表 */}
            {showDeps && deps.length > 0 && (
              <div className="mb-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(96,239,255,0.03)", border: "1px solid rgba(96,239,255,0.08)" }}>
                <div className="flex items-center gap-1 mb-1" style={{ fontSize: "10px", color: "#60efff" }}>
                  <PackageCheck size={9} /> 依赖项
                </div>
                <div className="flex flex-wrap gap-1">
                  {deps.map((dep) => (
                    <span key={dep} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded" style={{ fontSize: "9px", background: "rgba(96,239,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(96,239,255,0.08)" }}>
                      <Check size={7} style={{ color: "#00ff87" }} /> {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 配置表单 */}
            {showConfig && configs.length > 0 && (
              <div className="mb-2 px-2 py-1.5 rounded-lg space-y-1.5" style={{ background: "rgba(168,85,247,0.03)", border: "1px solid rgba(168,85,247,0.08)" }}>
                <div className="flex items-center gap-1 mb-1" style={{ fontSize: "10px", color: "#a855f7" }}>
                  <Settings size={9} /> 插件配置
                </div>
                {configs.map((cfg) => (
                  <div key={cfg.key} className="flex items-center gap-2">
                    <span className="w-24 flex-shrink-0" style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)" }}>{cfg.label}</span>
                    {cfg.type === "toggle" ? (
                      <button
                        onClick={() => setConfigValues((prev) => ({ ...prev, [cfg.key]: prev[cfg.key] === "true" ? "false" : "true" }))}
                        style={{ color: configValues[cfg.key] === "true" ? "#00ff87" : "rgba(255,255,255,0.2)" }}
                      >
                        {configValues[cfg.key] === "true" ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                    ) : cfg.type === "select" ? (
                      <select
                        value={configValues[cfg.key] || cfg.value}
                        onChange={(e) => setConfigValues((prev) => ({ ...prev, [cfg.key]: e.target.value }))}
                        className="flex-1 px-1.5 py-0.5 rounded bg-transparent outline-none"
                        style={{ fontSize: "10px", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", background: "#14142a" }}
                      >
                        {cfg.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input
                        value={configValues[cfg.key] || cfg.value}
                        onChange={(e) => setConfigValues((prev) => ({ ...prev, [cfg.key]: e.target.value }))}
                        className="flex-1 px-1.5 py-0.5 rounded bg-transparent outline-none"
                        style={{ fontSize: "10px", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── 主面板 ─── */
export const PluginManagerPanel: React.FC = () => {
  const { plugins, getStats, getPluginsByCategory } = usePluginStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<PluginCategory | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [expandedPlugin, setExpandedPlugin] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "updated" | "size">("name");

  const stats = getStats();

  /* 过滤 & 排序 */
  let filtered = plugins.filter((p) => {
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    if (filterStatus === "active" && !p.enabled) return false;
    if (filterStatus === "inactive" && p.enabled) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (sortBy === "updated") filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  else if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col h-full" style={{ background: "#14142a", color: "rgba(255,255,255,0.85)" }}>
      {/* 标题 + 统计 */}
      <div className="px-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 mb-2">
          <Puzzle size={15} style={{ color: "#a855f7" }} />
          <span style={{ fontSize: "13px", fontWeight: 600 }}>插件管理</span>
        </div>

        {/* 统计卡片 */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded" style={{ fontSize: "10px", background: "rgba(168,85,247,0.06)", color: "#a855f7" }}>
            {stats.total} 个插件
          </span>
          <span className="px-2 py-0.5 rounded" style={{ fontSize: "10px", background: "rgba(0,255,135,0.06)", color: "#00ff87" }}>
            {stats.active} 活跃
          </span>
          <span className="px-2 py-0.5 rounded" style={{ fontSize: "10px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}>
            <HardDrive size={9} className="inline mr-0.5" />{stats.totalSize}
          </span>
        </div>
      </div>

      {/* 搜索 + 过滤 */}
      <div className="px-3 py-2 space-y-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        {/* 搜索框 */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Search size={11} className="opacity-30" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索插件..."
            className="flex-1 bg-transparent border-none outline-none"
            style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.8)" }}
          />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="opacity-30 hover:opacity-60"><X size={10} /></button>}
        </div>

        {/* 分类过滤 */}
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setFilterCategory("all")}
            className="px-1.5 py-0.5 rounded transition-colors"
            style={{
              fontSize: "9.5px",
              color: filterCategory === "all" ? "#a855f7" : "rgba(255,255,255,0.3)",
              background: filterCategory === "all" ? "rgba(168,85,247,0.08)" : "transparent",
            }}
          >
            全部
          </button>
          {(Object.keys(categoryMeta) as PluginCategory[]).map((cat) => {
            const meta = categoryMeta[cat];
            const count = getPluginsByCategory(cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors"
                style={{
                  fontSize: "9.5px",
                  color: filterCategory === cat ? meta.color : "rgba(255,255,255,0.3)",
                  background: filterCategory === cat ? `${meta.color}10` : "transparent",
                }}
              >
                <meta.icon size={9} />
                {meta.label} ({count})
              </button>
            );
          })}
        </div>

        {/* 状态 + 排序 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {(["all", "active", "inactive"] as const).map((s) => {
              const labels = { all: "全部", active: "活跃", inactive: "停用" };
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className="px-1.5 py-0.5 rounded transition-colors"
                  style={{
                    fontSize: "9.5px",
                    color: filterStatus === s ? "#60efff" : "rgba(255,255,255,0.25)",
                    background: filterStatus === s ? "rgba(96,239,255,0.06)" : "transparent",
                  }}
                >
                  {labels[s]}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1">
            {(["name", "updated"] as const).map((s) => {
              const labels = { name: "名称", updated: "更新" };
              return (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className="px-1 py-0.5 rounded transition-colors"
                  style={{ fontSize: "9px", color: sortBy === s ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }}
                >
                  {labels[s]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 插件列表 */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 opacity-20">
            <Puzzle size={24} />
            <span style={{ fontSize: "11px" }}>没有匹配的插件</span>
          </div>
        ) : (
          filtered.map((plugin) => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              expanded={expandedPlugin === plugin.id}
              onToggle={() => setExpandedPlugin(expandedPlugin === plugin.id ? null : plugin.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
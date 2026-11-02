/**
 * @file SettingsPage.tsx
 * @description 设置页面 — 完整设置中心，含搜索、账号、通用、智能体、MCP、模型、上下文、对话流、规则技能、安全隐私
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v3.0.0
 * @created 2026-03-14
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings, configuration, theme, shortcuts, language, security, agents, mcp, models
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Settings, Bot, Palette, Globe, Shield, Key,
  ExternalLink, ToggleRight, ToggleLeft, ChevronRight,
  Keyboard, Check, RotateCcw, Lock, Eye, EyeOff, Download, Upload,
  Search, User, Sparkles, Plug, Cpu, BookOpen, MessageSquare,
  ScrollText, X, Zap,
} from "lucide-react";
import {
  useThemeStore,
  themeVariants,
  accentPresets,
  type ThemeVariant,
  type AccentColor,
} from "../stores/themeStore";
import {
  useShortcutStore,
  formatShortcut,
  categoryMeta,
  type CommandCategory,
} from "../stores/shortcutStore";
import { useSettingsStore, type SearchResult } from "../stores/settingsStore";

/* ─── Section Components ─── */
import AccountSection from "../components/settings/AccountSection";
import AgentSection from "../components/settings/AgentSection";
import MCPSection from "../components/settings/MCPSection";
import ModelSection from "../components/settings/ModelSection";
import ContextSection from "../components/settings/ContextSection";
import ConversationSection from "../components/settings/ConversationSection";
import RulesSkillsSection from "../components/settings/RulesSkillsSection";

/* ─── AI Provider Data ─── */
interface ProviderInfo {
  id: string;
  name: string;
  type: "cloud" | "local";
  region?: string;
  enabled: boolean;
  apiKeyUrl?: string;
  models: string[];
}

const defaultProviders: ProviderInfo[] = [
  { id: "openai", name: "OpenAI", type: "cloud", enabled: true, apiKeyUrl: "https://platform.openai.com/api-keys", models: ["GPT-4 Turbo", "GPT-3.5 Turbo"] },
  { id: "anthropic", name: "Anthropic", type: "cloud", enabled: true, apiKeyUrl: "https://console.anthropic.com/settings/keys", models: ["Claude 3 Opus", "Claude 3 Sonnet"] },
  { id: "zhipuai", name: "智谱 AI", type: "cloud", region: "CN", enabled: false, apiKeyUrl: "https://open.bigmodel.cn/usercenter/apikeys", models: ["GLM-4", "GLM-4 Flash"] },
  { id: "baidu", name: "百度文心", type: "cloud", region: "CN", enabled: false, apiKeyUrl: "https://console.bce.baidu.com/qianfan/ais/console/application/list", models: ["ERNIE-4.0-8K", "ERNIE-3.5-8K"] },
  { id: "aliyun", name: "阿里通义", type: "cloud", region: "CN", enabled: false, apiKeyUrl: "https://dashscope.console.aliyun.com/apiKey", models: ["Qwen Turbo", "Qwen Plus", "Qwen Max"] },
  { id: "ollama", name: "Ollama (本地)", type: "local", enabled: false, models: ["Llama 2", "Mistral", "Code Llama"] },
];

/* ─── 语言选项 ─── */
const languages = [
  { id: "zh-CN", label: "简体中文", flag: "🇨🇳" },
  { id: "en-US", label: "English", flag: "🇺🇸" },
  { id: "ja-JP", label: "日本語", flag: "🇯🇵" },
  { id: "ko-KR", label: "한국어", flag: "🇰🇷" },
];

/* ─── Slider ─── */
const SettingSlider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}> = ({ label, value, min, max, step, unit = "", onChange }) => (
  <div className="flex items-center justify-between py-2">
    <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.7)" }}>{label}</span>
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-28"
        style={{ accentColor: "#00ff87" }}
      />
      <span className="w-12 text-right" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
        {value}{unit}
      </span>
    </div>
  </div>
);

/* ─── Section 定义 ─── */
type SectionId = "account" | "general" | "ai" | "agents" | "mcp" | "models" | "context" | "conversation" | "rules" | "theme" | "shortcuts" | "language" | "security";

interface SectionDef {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  group: string;
}

const sections: SectionDef[] = [
  { id: "account", label: "账号信息", icon: User, color: "#60efff", group: "个人" },
  { id: "general", label: "通用设置", icon: Settings, color: "#00ff87", group: "个人" },
  { id: "ai", label: "AI 服务商", icon: Bot, color: "#00ff87", group: "AI 配置" },
  { id: "agents", label: "智能体", icon: Sparkles, color: "#a855f7", group: "AI 配置" },
  { id: "mcp", label: "MCP 连接", icon: Plug, color: "#60efff", group: "AI 配置" },
  { id: "models", label: "模型配置", icon: Cpu, color: "#ffb86c", group: "AI 配置" },
  { id: "context", label: "上下文", icon: BookOpen, color: "#60efff", group: "工作流" },
  { id: "conversation", label: "对话流", icon: MessageSquare, color: "#a855f7", group: "工作流" },
  { id: "rules", label: "规则与技能", icon: ScrollText, color: "#ec4899", group: "工作流" },
  { id: "theme", label: "主题外观", icon: Palette, color: "#a855f7", group: "系统" },
  { id: "shortcuts", label: "快捷键", icon: Keyboard, color: "#ffb86c", group: "系统" },
  { id: "language", label: "语言设置", icon: Globe, color: "#60efff", group: "系统" },
  { id: "security", label: "安全隐私", icon: Shield, color: "#ff6464", group: "系统" },
];

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [providerList, setProviderList] = useState(defaultProviders);
  const [activeSection, setActiveSection] = useState<SectionId>("account");
  const [activeLang, setActiveLang] = useState("zh-CN");
  const [showApiKeys, setShowApiKeys] = useState(false);

  /* Stores */
  const theme = useThemeStore();
  const shortcuts = useShortcutStore();
  const { searchQuery, setSearchQuery, searchSettings, settings, updateGeneralSettings } = useSettingsStore();

  const toggleProvider = (id: string) => {
    setProviderList((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  /* 搜索 */
  const searchResults = useMemo(() => searchSettings(), [searchQuery, settings]);
  const showSearchResults = searchQuery.trim().length > 0;

  const handleSearchResultClick = (result: SearchResult) => {
    const sectionMap: Record<string, SectionId> = {
      general: "general",
      agents: "agents",
      mcp: "mcp",
      models: "models",
      rules: "rules",
      skills: "rules",
      conversation: "conversation",
      context: "context",
    };
    if (sectionMap[result.section]) {
      setActiveSection(sectionMap[result.section]);
    }
    setSearchQuery("");
  };

  /* 导出配置 */
  const handleExportConfig = () => {
    const config = useSettingsStore.getState().exportConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yyc3-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* 导入配置 */
  const handleImportConfig = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const config = JSON.parse(text);
        useSettingsStore.getState().importConfig(config);
      } catch {
        console.error("配置导入失败");
      }
    };
    input.click();
  };

  /* 按组分类 sidebar */
  const groups = useMemo(() => {
    const map = new Map<string, SectionDef[]>();
    sections.forEach((s) => {
      const arr = map.get(s.group) || [];
      arr.push(s);
      map.set(s.group, arr);
    });
    return map;
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#0a0a12", color: "rgba(255,255,255,0.9)" }}>
      {/* ═══ Top Bar ═══ */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <button
          onClick={() => navigate("/")}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <ArrowLeft size={15} />
        </button>
        <Settings size={17} className="opacity-50" />
        <h2 className="m-0 opacity-80 flex-1" style={{ fontSize: "15px", fontWeight: 600 }}>设置中心</h2>

        {/* 全局搜索 */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", width: "280px" }}>
            <Search size={13} color="rgba(255,255,255,0.3)" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索设置..."
              className="flex-1 bg-transparent border-none outline-none"
              style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <X size={12} color="rgba(255,255,255,0.3)" />
              </button>
            )}
          </div>

          {/* 搜索结果 */}
          {showSearchResults && (
            <div
              className="absolute top-full mt-1 right-0 w-[360px] rounded-xl overflow-hidden z-50"
              style={{
                background: "rgba(15,15,30,0.98)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                backdropFilter: "blur(20px)",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {searchResults.length > 0 ? (
                <>
                  <div className="px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                      找到 {searchResults.length} 个结果
                    </span>
                  </div>
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearchResultClick(r)}
                      className="w-full text-left px-3 py-2.5 transition-colors flex items-center gap-3"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "transparent" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(0,255,135,0.08)" }}
                      >
                        {r.type === "agent" ? <Bot size={11} color="#a855f7" /> :
                         r.type === "mcp" ? <Plug size={11} color="#60efff" /> :
                         r.type === "model" ? <Cpu size={11} color="#ffb86c" /> :
                         r.type === "rule" ? <ScrollText size={11} color="#ec4899" /> :
                         r.type === "skill" ? <Zap size={11} color="#00ff87" /> :
                         <Settings size={11} color="rgba(255,255,255,0.5)" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>{r.title}</div>
                        {r.description && (
                          <div className="truncate" style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                            {r.description}
                          </div>
                        )}
                      </div>
                      <ChevronRight size={12} color="rgba(255,255,255,0.2)" />
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-4 py-6 text-center">
                  <Search size={20} color="rgba(255,255,255,0.15)" className="mx-auto mb-2" />
                  <p className="m-0" style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                    未找到匹配的设置项
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100vh-49px)]">
        {/* ═══ Sidebar ═══ */}
        <div
          className="w-52 flex-shrink-0 py-3 overflow-y-auto"
          style={{ borderRight: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
        >
          {Array.from(groups.entries()).map(([groupName, groupSections]) => (
            <div key={groupName} className="mb-3">
              <p className="m-0 px-4 mb-1" style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                {groupName}
              </p>
              {groupSections.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 transition-colors text-left"
                    style={{
                      background: activeSection === s.id ? `${s.color}0d` : "transparent",
                      color: activeSection === s.id ? s.color : "rgba(255,255,255,0.5)",
                      borderRight: activeSection === s.id ? `2px solid ${s.color}` : "2px solid transparent",
                      fontSize: "13px",
                    }}
                  >
                    <Icon size={15} />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* ═══ Content ═══ */}
        <div className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >

              {/* ═══ 账号信息 ═══ */}
              {activeSection === "account" && <AccountSection />}

              {/* ═══ 通用设置 ═══ */}
              {activeSection === "general" && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <Settings size={18} style={{ color: "#00ff87" }} />
                    <div>
                      <h3 className="m-0 opacity-90" style={{ fontSize: "17px", fontWeight: 600 }}>通用设置</h3>
                      <p className="m-0 mt-0.5" style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>编辑器、字体、换行等基础配置</p>
                    </div>
                  </div>
                  <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>编辑器字体</span>
                      <input
                        value={settings.general.editorFont}
                        onChange={(e) => updateGeneralSettings({ editorFont: e.target.value })}
                        className="px-2.5 py-1 rounded-lg w-56 text-right"
                        style={{ fontSize: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", outline: "none", fontFamily: "monospace" }}
                      />
                    </div>
                    <SettingSlider label="字体大小" value={settings.general.editorFontSize} min={10} max={24} step={1} unit="px" onChange={(v) => updateGeneralSettings({ editorFontSize: v })} />
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>自动换行</span>
                      <button onClick={() => updateGeneralSettings({ wordWrap: !settings.general.wordWrap })} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        {settings.general.wordWrap ? <ToggleRight size={26} color="#00ff87" /> : <ToggleLeft size={26} color="rgba(255,255,255,0.3)" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>快捷键方案</span>
                      <select
                        value={settings.general.keybindingScheme}
                        onChange={(e) => updateGeneralSettings({ keybindingScheme: e.target.value as "vscode" | "custom" })}
                        className="px-2.5 py-1 rounded-lg"
                        style={{ fontSize: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", outline: "none" }}
                      >
                        <option value="vscode" style={{ background: "#1a1a2e" }}>VS Code</option>
                        <option value="custom" style={{ background: "#1a1a2e" }}>自定义</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>本地链接打开方式</span>
                      <select
                        value={settings.general.localLinkOpenMode}
                        onChange={(e) => updateGeneralSettings({ localLinkOpenMode: e.target.value as "system" | "builtin" })}
                        className="px-2.5 py-1 rounded-lg"
                        style={{ fontSize: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", outline: "none" }}
                      >
                        <option value="system" style={{ background: "#1a1a2e" }}>系统默认</option>
                        <option value="builtin" style={{ background: "#1a1a2e" }}>内置打开</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>Markdown 打开方式</span>
                      <select
                        value={settings.general.markdownOpenMode}
                        onChange={(e) => updateGeneralSettings({ markdownOpenMode: e.target.value as "editor" | "preview" })}
                        className="px-2.5 py-1 rounded-lg"
                        style={{ fontSize: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", outline: "none" }}
                      >
                        <option value="editor" style={{ background: "#1a1a2e" }}>编辑器</option>
                        <option value="preview" style={{ background: "#1a1a2e" }}>预览</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>Node.js 版本</span>
                      <input
                        value={settings.general.nodeVersion}
                        onChange={(e) => updateGeneralSettings({ nodeVersion: e.target.value })}
                        className="px-2.5 py-1 rounded-lg w-28 text-right"
                        style={{ fontSize: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", outline: "none", fontFamily: "monospace" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ AI 服务商 ═══ */}
              {activeSection === "ai" && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <Bot size={18} style={{ color: "#00ff87" }} />
                    <h3 className="m-0 opacity-90" style={{ fontSize: "17px", fontWeight: 600 }}>AI 服务商管理</h3>
                  </div>
                  <button
                    onClick={() => navigate("/ai-settings")}
                    className="w-full flex items-center justify-between rounded-xl px-4 py-3 mb-4 transition-colors"
                    style={{ background: "linear-gradient(135deg, rgba(0,255,135,0.06), rgba(96,239,255,0.06))", border: "1px solid rgba(0,255,135,0.12)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,135,0.25)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,135,0.12)"; }}
                  >
                    <div className="flex items-center gap-3">
                      <Bot size={18} style={{ color: "#00ff87" }} />
                      <div className="text-left">
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#00ff87" }}>AI 服务管理中心</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>性能监控 · 成本报告 · 模型管理 · 智能检测</div>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: "#00ff87" }} />
                  </button>
                  <div className="flex flex-col gap-3">
                    {providerList.map((provider) => (
                      <div key={provider.id} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${provider.enabled ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.06)"}` }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: provider.enabled ? "linear-gradient(135deg, rgba(0,255,135,0.2), rgba(96,239,255,0.2))" : "rgba(255,255,255,0.06)" }}>
                              <Bot size={18} style={{ color: provider.enabled ? "#00ff87" : "rgba(255,255,255,0.3)" }} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span style={{ fontSize: "14px", fontWeight: 600 }}>{provider.name}</span>
                                {provider.region && <span className="px-1.5 py-0.5 rounded" style={{ fontSize: "10px", background: "rgba(255,159,64,0.15)", color: "#ff9f40" }}>{provider.region}</span>}
                                <span className="px-1.5 py-0.5 rounded" style={{ fontSize: "10px", background: provider.type === "local" ? "rgba(168,85,247,0.15)" : "rgba(96,239,255,0.1)", color: provider.type === "local" ? "#a855f7" : "#60efff" }}>{provider.type === "local" ? "本地" : "云端"}</span>
                              </div>
                              <p className="m-0 mt-1 opacity-40" style={{ fontSize: "12px" }}>{provider.models.join(" · ")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {provider.apiKeyUrl && (
                              <a href={provider.apiKeyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors no-underline" style={{ fontSize: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                                <Key size={12} /> 获取密钥 <ExternalLink size={10} />
                              </a>
                            )}
                            <button onClick={() => toggleProvider(provider.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                              {provider.enabled ? <ToggleRight size={28} color="#00ff87" /> : <ToggleLeft size={28} color="rgba(255,255,255,0.3)" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══ 智能体 ═══ */}
              {activeSection === "agents" && <AgentSection />}

              {/* ═══ MCP ═══ */}
              {activeSection === "mcp" && <MCPSection />}

              {/* ═══ 模型配置 ═══ */}
              {activeSection === "models" && <ModelSection />}

              {/* ═══ 上下文 ═══ */}
              {activeSection === "context" && <ContextSection />}

              {/* ═══ 对话流 ═══ */}
              {activeSection === "conversation" && <ConversationSection />}

              {/* ═══ 规则与技能 ═══ */}
              {activeSection === "rules" && <RulesSkillsSection />}

              {/* ═══ 主题外观 ═══ */}
              {activeSection === "theme" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <Palette size={18} style={{ color: "#a855f7" }} />
                      <h3 className="m-0 opacity-90" style={{ fontSize: "17px", fontWeight: 600 }}>主题外观</h3>
                    </div>
                    <button
                      onClick={theme.resetToDefault}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                      style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <RotateCcw size={12} /> 重置默认
                    </button>
                  </div>

                  {/* 主题变体 */}
                  <div className="mb-6">
                    <p className="m-0 mb-3" style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>主题变体</p>
                    <div className="grid grid-cols-2 gap-3">
                      {(Object.entries(themeVariants) as [ThemeVariant, typeof themeVariants.aurora][]).map(([key, v]) => (
                        <button
                          key={key}
                          onClick={() => theme.setVariant(key)}
                          className="rounded-xl p-3 text-left transition-all relative"
                          style={{
                            background: theme.config.variant === key ? `linear-gradient(135deg, ${v.colors.auroraGlow1}, ${v.colors.auroraGlow2})` : "rgba(255,255,255,0.03)",
                            border: `1px solid ${theme.config.variant === key ? v.colors.accent + "40" : "rgba(255,255,255,0.06)"}`,
                          }}
                        >
                          <div className="flex gap-1 mb-2">
                            <div className="w-5 h-5 rounded-md" style={{ background: v.colors.accent }} />
                            <div className="w-5 h-5 rounded-md" style={{ background: v.colors.accentSecondary }} />
                            <div className="w-5 h-5 rounded-md" style={{ background: v.colors.bg, border: "1px solid rgba(255,255,255,0.1)" }} />
                          </div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: theme.config.variant === key ? v.colors.accent : "rgba(255,255,255,0.7)" }}>{v.name}</div>
                          <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>{v.description}</div>
                          {theme.config.variant === key && <Check size={14} className="absolute top-2 right-2" style={{ color: v.colors.accent }} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 强调色 */}
                  <div className="mb-6">
                    <p className="m-0 mb-3" style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>强调色</p>
                    <div className="flex gap-2">
                      {(Object.entries(accentPresets) as [AccentColor, typeof accentPresets.green][]).map(([key, preset]) => (
                        <button
                          key={key}
                          onClick={() => theme.setAccentColor(key)}
                          className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all"
                          style={{
                            background: theme.config.accentColor === key ? `${preset.color}10` : "rgba(255,255,255,0.02)",
                            border: `1px solid ${theme.config.accentColor === key ? preset.color + "30" : "rgba(255,255,255,0.04)"}`,
                          }}
                        >
                          <div className="w-6 h-6 rounded-full relative" style={{ background: preset.color }}>
                            {theme.config.accentColor === key && <Check size={12} className="absolute inset-0 m-auto" style={{ color: "#000" }} />}
                          </div>
                          <span style={{ fontSize: "10px", color: theme.config.accentColor === key ? preset.color : "rgba(255,255,255,0.4)" }}>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 微调 */}
                  <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="m-0 mb-2" style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>界面微调</p>
                    <SettingSlider label="字体大小" value={theme.config.fontSize} min={10} max={18} step={1} unit="px" onChange={theme.setFontSize} />
                    <SettingSlider label="UI 缩放" value={theme.config.uiScale} min={0.8} max={1.3} step={0.05} onChange={theme.setUiScale} />
                    <SettingSlider label="玻璃透明度" value={theme.config.glassOpacity} min={0} max={0.2} step={0.01} onChange={theme.setGlassOpacity} />
                    <SettingSlider label="动画速度" value={theme.config.animationSpeed} min={0} max={2} step={0.1} unit="x" onChange={theme.setAnimationSpeed} />
                    <SettingSlider label="模糊强度" value={theme.config.blurStrength} min={0} max={150} step={5} unit="px" onChange={theme.setBlurStrength} />
                    <SettingSlider label="圆角大小" value={theme.config.borderRadius} min={0} max={24} step={2} unit="px" onChange={theme.setBorderRadius} />
                  </div>
                </div>
              )}

              {/* ═══ 快捷键 ═══ */}
              {activeSection === "shortcuts" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <Keyboard size={18} style={{ color: "#ffb86c" }} />
                      <h3 className="m-0 opacity-90" style={{ fontSize: "17px", fontWeight: 600 }}>快捷键配置</h3>
                    </div>
                    <button
                      onClick={shortcuts.resetAllShortcuts}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                      style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <RotateCcw size={12} /> 重置全部
                    </button>
                  </div>
                  {(Object.keys(categoryMeta) as CommandCategory[]).map((cat) => {
                    const meta = categoryMeta[cat];
                    const cmds = shortcuts.getCommandsByCategory(cat);
                    if (cmds.length === 0) return null;
                    return (
                      <div key={cat} className="mb-5">
                        <p className="m-0 mb-2" style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{meta.label}</p>
                        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                          {cmds.map((cmd, i) => (
                            <div
                              key={cmd.id}
                              className="flex items-center justify-between px-4 py-2.5 transition-colors"
                              style={{ background: "rgba(255,255,255,0.02)", borderBottom: i < cmds.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                            >
                              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{cmd.label}</span>
                              <div className="flex items-center gap-1">
                                {formatShortcut(cmd.shortcut).split(" + ").map((key, ki) => (
                                  <React.Fragment key={ki}>
                                    {ki > 0 && <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>+</span>}
                                    <kbd className="px-2 py-0.5 rounded" style={{ fontSize: "11px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                      {key}
                                    </kbd>
                                  </React.Fragment>
                                ))}
                                {cmd.shortcut !== cmd.defaultShortcut && (
                                  <button onClick={() => shortcuts.resetShortcut(cmd.id)} className="ml-2 opacity-20 hover:opacity-50" title="重置">
                                    <RotateCcw size={10} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ═══ 语言设置 ═══ */}
              {activeSection === "language" && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <Globe size={18} style={{ color: "#60efff" }} />
                    <h3 className="m-0 opacity-90" style={{ fontSize: "17px", fontWeight: 600 }}>语言设置</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setActiveLang(lang.id)}
                        className="flex items-center justify-between rounded-xl px-4 py-3 transition-all text-left"
                        style={{
                          background: activeLang === lang.id ? "rgba(0,255,135,0.06)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${activeLang === lang.id ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.06)"}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span style={{ fontSize: "20px" }}>{lang.flag}</span>
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: 500, color: activeLang === lang.id ? "#00ff87" : "rgba(255,255,255,0.7)" }}>{lang.label}</div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{lang.id}</div>
                          </div>
                        </div>
                        {activeLang === lang.id && <Check size={16} style={{ color: "#00ff87" }} />}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 rounded-xl p-4" style={{ background: "rgba(255,184,108,0.04)", border: "1px solid rgba(255,184,108,0.1)" }}>
                    <p className="m-0" style={{ fontSize: "12px", color: "#ffb86c" }}>
                      当前仅支持简体中文界面，其他语言包正在开发中。AI 对话支持自动语言检测。
                    </p>
                  </div>
                </div>
              )}

              {/* ═══ 安全隐私 ═══ */}
              {activeSection === "security" && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <Shield size={18} style={{ color: "#ff6464" }} />
                    <h3 className="m-0 opacity-90" style={{ fontSize: "17px", fontWeight: 600 }}>安全与隐私</h3>
                  </div>

                  {/* API 密钥安全 */}
                  <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Key size={15} style={{ color: "#00ff87" }} />
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>API 密钥安全</span>
                    </div>
                    {[
                      { label: "AES-GCM 加密存储", status: "已启用", icon: <Check size={12} /> },
                      { label: "OS 密钥链集成", status: "活跃", icon: <Lock size={12} /> },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.6)" }}>{item.label}</span>
                        <span className="flex items-center gap-1" style={{ fontSize: "11px", color: "#00ff87" }}>
                          {item.icon} {item.status}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-2">
                      <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.6)" }}>显示 API 密钥</span>
                      <button onClick={() => setShowApiKeys(!showApiKeys)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        {showApiKeys ? <Eye size={16} color="#60efff" /> : <EyeOff size={16} color="rgba(255,255,255,0.3)" />}
                      </button>
                    </div>
                  </div>

                  {/* 数据保护 */}
                  <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield size={15} style={{ color: "#a855f7" }} />
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>数据保护</span>
                    </div>
                    {[
                      { label: "本地优先策略", status: "已启用" },
                      { label: "离线可用", status: "Service Worker" },
                      { label: "CSP 安全策略", status: "严格模式" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.6)" }}>{item.label}</span>
                        <span className="flex items-center gap-1" style={{ fontSize: "11px", color: "#00ff87" }}>
                          <Check size={12} /> {item.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 导出/导入配置 */}
                  <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Settings size={15} style={{ color: "#60efff" }} />
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>配置管理</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleExportConfig}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors"
                        style={{ fontSize: "12px", color: "#60efff", background: "rgba(96,239,255,0.06)", border: "1px solid rgba(96,239,255,0.12)" }}
                      >
                        <Download size={14} /> 导出配置
                      </button>
                      <button
                        onClick={handleImportConfig}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors"
                        style={{ fontSize: "12px", color: "#a855f7", background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.12)" }}
                      >
                        <Upload size={14} /> 导入配置
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => {
                          if (confirm("确定要重置所有设置为默认值吗？")) {
                            useSettingsStore.getState().resetSettings();
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors"
                        style={{ fontSize: "12px", color: "#ff6464", background: "rgba(255,100,100,0.06)", border: "1px solid rgba(255,100,100,0.12)" }}
                      >
                        <RotateCcw size={14} /> 恢复默认设置
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

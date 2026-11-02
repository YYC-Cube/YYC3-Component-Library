/**
 * @file settingsStore.ts
 * @description 设置状态管理 — 完整设置模块的 Zustand Store，含用户、通用、智能体、MCP、模型、上下文、对话流、规则技能
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, settings, zustand, persistence
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */

export type Theme = "light" | "dark" | "auto";
export type Language = "zh-CN" | "en-US" | "ja-JP";
export type NotificationType = "banner" | "sound" | "menu";
export type SoundType = "complete" | "waiting" | "interrupt";
export type CodeReviewScope = "none" | "all" | "changed";
export type CommandRunMode = "sandbox" | "direct";
export type SkillScope = "global" | "project";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface GeneralSettings {
  theme: Theme;
  language: Language;
  editorFont: string;
  editorFontSize: number;
  wordWrap: boolean;
  keybindingScheme: "vscode" | "custom";
  customKeybindings: Record<string, string>;
  localLinkOpenMode: "system" | "builtin";
  markdownOpenMode: "editor" | "preview";
  nodeVersion: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  description?: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  isBuiltIn: boolean;
  isCustom: boolean;
}

export interface MCPConfig {
  id: string;
  name: string;
  type: "market" | "manual";
  endpoint?: string;
  enabled: boolean;
  projectLevel: boolean;
}

export interface ModelConfig {
  id: string;
  provider: string;
  model: string;
  apiKey: string;
  enabled: boolean;
}

export interface DocumentSet {
  id: string;
  name: string;
  source: "url" | "local";
  url?: string;
  localPath?: string;
  enabled: boolean;
}

export interface ContextSettings {
  indexStatus: "idle" | "indexing" | "completed" | "error";
  ignoreRules: string[];
  documentSets: DocumentSet[];
}

export interface ConversationSettings {
  useTodoList: boolean;
  autoCollapseNodes: boolean;
  autoFixCodeIssues: boolean;
  agentProactiveQuestion: boolean;
  codeReviewScope: CodeReviewScope;
  jumpAfterReview: boolean;
  autoRunMCP: boolean;
  commandRunMode: CommandRunMode;
  whitelistCommands: string[];
  notificationTypes: NotificationType[];
  volume: number;
  soundConfig: Record<SoundType, string>;
}

export interface RuleConfig {
  id: string;
  name: string;
  content: string;
  scope: "personal" | "project";
  enabled: boolean;
}

export interface SkillConfig {
  id: string;
  name: string;
  description?: string;
  content: string;
  scope: SkillScope;
  enabled: boolean;
}

export interface ImportSettings {
  includeAgentsMD: boolean;
  includeClaudeMD: boolean;
}

export interface Settings {
  userProfile: UserProfile;
  general: GeneralSettings;
  agents: AgentConfig[];
  mcpConfigs: MCPConfig[];
  models: ModelConfig[];
  context: ContextSettings;
  conversation: ConversationSettings;
  rules: RuleConfig[];
  skills: SkillConfig[];
  importSettings: ImportSettings;
}

/* ─── 搜索结果 ─── */

export interface SearchResult {
  path: string;
  title: string;
  description?: string;
  value: unknown;
  type: "setting" | "agent" | "mcp" | "model" | "rule" | "skill";
  section: string;
}

/* ─── Store 接口 ─── */

interface SettingsState {
  settings: Settings;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

interface SettingsActions {
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateGeneralSettings: (settings: Partial<GeneralSettings>) => void;
  addAgent: (agent: AgentConfig) => void;
  updateAgent: (id: string, agent: Partial<AgentConfig>) => void;
  removeAgent: (id: string) => void;
  addMCP: (mcp: MCPConfig) => void;
  updateMCP: (id: string, mcp: Partial<MCPConfig>) => void;
  removeMCP: (id: string) => void;
  addModel: (model: ModelConfig) => void;
  updateModel: (id: string, model: Partial<ModelConfig>) => void;
  removeModel: (id: string) => void;
  updateContextSettings: (settings: Partial<ContextSettings>) => void;
  addDocumentSet: (docSet: DocumentSet) => void;
  removeDocumentSet: (id: string) => void;
  updateConversationSettings: (settings: Partial<ConversationSettings>) => void;
  addRule: (rule: RuleConfig) => void;
  updateRule: (id: string, rule: Partial<RuleConfig>) => void;
  removeRule: (id: string) => void;
  addSkill: (skill: SkillConfig) => void;
  updateSkill: (id: string, skill: Partial<SkillConfig>) => void;
  removeSkill: (id: string) => void;
  updateImportSettings: (settings: Partial<ImportSettings>) => void;
  setSearchQuery: (query: string) => void;
  searchSettings: () => SearchResult[];
  importConfig: (config: Partial<Settings>) => void;
  exportConfig: () => Settings;
  resetSettings: () => void;
}

/* ─── 默认值 ─── */

const defaultSettings: Settings = {
  userProfile: {
    id: crypto.randomUUID(),
    username: "YYC³ Developer",
    email: "dev@yyc3.ai",
    bio: "Full-stack developer using YYC³ AI Code",
  },
  general: {
    theme: "dark",
    language: "zh-CN",
    editorFont: "JetBrains Mono, Monaco, Consolas, monospace",
    editorFontSize: 14,
    wordWrap: true,
    keybindingScheme: "vscode",
    customKeybindings: {},
    localLinkOpenMode: "system",
    markdownOpenMode: "editor",
    nodeVersion: "20.0.0",
  },
  agents: [
    {
      id: "agent-default",
      name: "YYC³ 通用助手",
      description: "全能型 AI 编程助手，支持代码生成、调试和优化",
      systemPrompt: "你是 YYC³ AI Code 的智能编程助手，擅长代码生成、调试、优化和架构设计。",
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      maxTokens: 4096,
      isBuiltIn: true,
      isCustom: false,
    },
    {
      id: "agent-code-review",
      name: "代码审查专家",
      description: "专注代码质量和最佳实践的审查",
      systemPrompt: "你是资深代码审查专家，专注于代码质量、性能优化和安全审计。",
      model: "gpt-4-turbo-preview",
      temperature: 0.3,
      maxTokens: 4096,
      isBuiltIn: true,
      isCustom: false,
    },
    {
      id: "agent-architect",
      name: "架构设计师",
      description: "系统架构设计和技术方案规划",
      systemPrompt: "你是高级系统架构师，擅长系统设计、技术选型和架构决策。",
      model: "claude-3-opus-20240229",
      temperature: 0.5,
      maxTokens: 8192,
      isBuiltIn: true,
      isCustom: false,
    },
  ],
  mcpConfigs: [
    {
      id: "mcp-filesystem",
      name: "文件系统 MCP",
      type: "manual",
      endpoint: "http://localhost:3100/mcp/fs",
      enabled: true,
      projectLevel: false,
    },
    {
      id: "mcp-git",
      name: "Git MCP",
      type: "manual",
      endpoint: "http://localhost:3100/mcp/git",
      enabled: true,
      projectLevel: false,
    },
  ],
  models: [
    { id: "model-openai-gpt4", provider: "OpenAI", model: "gpt-4-turbo-preview", apiKey: "", enabled: true },
    { id: "model-openai-gpt35", provider: "OpenAI", model: "gpt-3.5-turbo", apiKey: "", enabled: true },
    { id: "model-anthropic-opus", provider: "Anthropic", model: "claude-3-opus-20240229", apiKey: "", enabled: false },
    { id: "model-zhipu-glm4", provider: "智谱 AI", model: "glm-4", apiKey: "", enabled: false },
  ],
  context: {
    indexStatus: "idle",
    ignoreRules: ["node_modules", ".git", "dist", "build", ".cache", "*.lock"],
    documentSets: [],
  },
  conversation: {
    useTodoList: true,
    autoCollapseNodes: false,
    autoFixCodeIssues: true,
    agentProactiveQuestion: true,
    codeReviewScope: "all",
    jumpAfterReview: true,
    autoRunMCP: false,
    commandRunMode: "sandbox",
    whitelistCommands: ["npm install", "npm run", "pnpm install", "pnpm run", "git status", "git diff"],
    notificationTypes: ["banner", "sound"],
    volume: 80,
    soundConfig: {
      complete: "default",
      waiting: "default",
      interrupt: "default",
    },
  },
  rules: [
    {
      id: "rule-code-standard",
      name: "代码规范",
      content: "遵循 YYC³ 代码标头规范，所有文件必须包含完整的 JSDoc 头部注释。",
      scope: "project",
      enabled: true,
    },
    {
      id: "rule-naming",
      name: "命名规范",
      content: "组件使用 PascalCase，函数使用 camelCase，常量使用 UPPER_SNAKE_CASE。",
      scope: "project",
      enabled: true,
    },
  ],
  skills: [
    {
      id: "skill-react",
      name: "React 开发",
      description: "React 18.x 组件开发最佳实践",
      content: "使用函数组件 + Hooks、遵循单一职责原则、合理使用 useMemo/useCallback。",
      scope: "global",
      enabled: true,
    },
    {
      id: "skill-typescript",
      name: "TypeScript 类型安全",
      description: "TypeScript 严格类型检查和类型推导",
      content: "启用 strict 模式、避免 any 类型、使用判别联合和类型守卫。",
      scope: "global",
      enabled: true,
    },
  ],
  importSettings: {
    includeAgentsMD: false,
    includeClaudeMD: false,
  },
};

/* ─── 搜索逻辑 ─── */

function performSearch(settings: Settings, query: string): SearchResult[] {
  if (!query.trim()) return [];
  const results: SearchResult[] = [];
  const q = query.toLowerCase();

  // 通用设置
  const generalMap: Record<string, string> = {
    theme: "主题 Theme",
    language: "语言 Language",
    editorFont: "编辑器字体 Editor Font",
    editorFontSize: "字体大小 Font Size",
    wordWrap: "自动换行 Word Wrap",
    keybindingScheme: "快捷键方案 Keybinding",
    nodeVersion: "Node.js 版本",
  };
  for (const [key, label] of Object.entries(generalMap)) {
    if (label.toLowerCase().includes(q)) {
      results.push({
        path: `general.${key}`,
        title: label.split(" ")[0],
        description: label,
        value: settings.general[key as keyof GeneralSettings],
        type: "setting",
        section: "general",
      });
    }
  }

  // 智能体
  for (const agent of settings.agents) {
    if (agent.name.toLowerCase().includes(q) || agent.description?.toLowerCase().includes(q)) {
      results.push({ path: `agents.${agent.id}`, title: agent.name, description: agent.description, value: agent, type: "agent", section: "agents" });
    }
  }

  // MCP
  for (const mcp of settings.mcpConfigs) {
    if (mcp.name.toLowerCase().includes(q)) {
      results.push({ path: `mcp.${mcp.id}`, title: mcp.name, value: mcp, type: "mcp", section: "mcp" });
    }
  }

  // 模型
  for (const model of settings.models) {
    if (model.provider.toLowerCase().includes(q) || model.model.toLowerCase().includes(q)) {
      results.push({ path: `models.${model.id}`, title: `${model.provider} - ${model.model}`, value: model, type: "model", section: "models" });
    }
  }

  // 规则
  for (const rule of settings.rules) {
    if (rule.name.toLowerCase().includes(q) || rule.content.toLowerCase().includes(q)) {
      results.push({ path: `rules.${rule.id}`, title: rule.name, value: rule, type: "rule", section: "rules" });
    }
  }

  // 技能
  for (const skill of settings.skills) {
    if (skill.name.toLowerCase().includes(q) || skill.description?.toLowerCase().includes(q)) {
      results.push({ path: `skills.${skill.id}`, title: skill.name, description: skill.description, value: skill, type: "skill", section: "skills" });
    }
  }

  // 对话流关键词
  const convMap: Record<string, string> = {
    useTodoList: "待办清单 Todo List",
    autoCollapseNodes: "自动折叠 Auto Collapse",
    autoFixCodeIssues: "自动修复 Auto Fix",
    agentProactiveQuestion: "主动提问 Proactive Question",
    codeReviewScope: "代码审查 Code Review",
    autoRunMCP: "自动运行 MCP Auto Run MCP",
    commandRunMode: "命令运行 Command Run Mode",
    volume: "音量 Volume",
  };
  for (const [key, label] of Object.entries(convMap)) {
    if (label.toLowerCase().includes(q)) {
      results.push({
        path: `conversation.${key}`,
        title: label.split(" ")[0],
        description: label,
        value: settings.conversation[key as keyof ConversationSettings],
        type: "setting",
        section: "conversation",
      });
    }
  }

  return results;
}

/* ─── Store ─── */

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      searchQuery: "",
      loading: false,
      error: null,

      updateUserProfile: (profile) =>
        set((s) => ({ settings: { ...s.settings, userProfile: { ...s.settings.userProfile, ...profile } } })),

      updateGeneralSettings: (gs) =>
        set((s) => ({ settings: { ...s.settings, general: { ...s.settings.general, ...gs } } })),

      addAgent: (agent) =>
        set((s) => ({ settings: { ...s.settings, agents: [...s.settings.agents, agent] } })),

      updateAgent: (id, upd) =>
        set((s) => ({
          settings: { ...s.settings, agents: s.settings.agents.map((a) => (a.id === id ? { ...a, ...upd } : a)) },
        })),

      removeAgent: (id) =>
        set((s) => ({ settings: { ...s.settings, agents: s.settings.agents.filter((a) => a.id !== id) } })),

      addMCP: (mcp) =>
        set((s) => ({ settings: { ...s.settings, mcpConfigs: [...s.settings.mcpConfigs, mcp] } })),

      updateMCP: (id, upd) =>
        set((s) => ({
          settings: { ...s.settings, mcpConfigs: s.settings.mcpConfigs.map((m) => (m.id === id ? { ...m, ...upd } : m)) },
        })),

      removeMCP: (id) =>
        set((s) => ({ settings: { ...s.settings, mcpConfigs: s.settings.mcpConfigs.filter((m) => m.id !== id) } })),

      addModel: (model) =>
        set((s) => ({ settings: { ...s.settings, models: [...s.settings.models, model] } })),

      updateModel: (id, upd) =>
        set((s) => ({
          settings: { ...s.settings, models: s.settings.models.map((m) => (m.id === id ? { ...m, ...upd } : m)) },
        })),

      removeModel: (id) =>
        set((s) => ({ settings: { ...s.settings, models: s.settings.models.filter((m) => m.id !== id) } })),

      updateContextSettings: (cs) =>
        set((s) => ({ settings: { ...s.settings, context: { ...s.settings.context, ...cs } } })),

      addDocumentSet: (docSet) =>
        set((s) => ({
          settings: {
            ...s.settings,
            context: { ...s.settings.context, documentSets: [...s.settings.context.documentSets, docSet] },
          },
        })),

      removeDocumentSet: (id) =>
        set((s) => ({
          settings: {
            ...s.settings,
            context: { ...s.settings.context, documentSets: s.settings.context.documentSets.filter((d) => d.id !== id) },
          },
        })),

      updateConversationSettings: (cs) =>
        set((s) => ({ settings: { ...s.settings, conversation: { ...s.settings.conversation, ...cs } } })),

      addRule: (rule) =>
        set((s) => ({ settings: { ...s.settings, rules: [...s.settings.rules, rule] } })),

      updateRule: (id, upd) =>
        set((s) => ({
          settings: { ...s.settings, rules: s.settings.rules.map((r) => (r.id === id ? { ...r, ...upd } : r)) },
        })),

      removeRule: (id) =>
        set((s) => ({ settings: { ...s.settings, rules: s.settings.rules.filter((r) => r.id !== id) } })),

      addSkill: (skill) =>
        set((s) => ({ settings: { ...s.settings, skills: [...s.settings.skills, skill] } })),

      updateSkill: (id, upd) =>
        set((s) => ({
          settings: { ...s.settings, skills: s.settings.skills.map((sk) => (sk.id === id ? { ...sk, ...upd } : sk)) },
        })),

      removeSkill: (id) =>
        set((s) => ({ settings: { ...s.settings, skills: s.settings.skills.filter((sk) => sk.id !== id) } })),

      updateImportSettings: (is) =>
        set((s) => ({ settings: { ...s.settings, importSettings: { ...s.settings.importSettings, ...is } } })),

      setSearchQuery: (query) => set({ searchQuery: query }),

      searchSettings: () => {
        const { settings, searchQuery } = get();
        return performSearch(settings, searchQuery);
      },

      importConfig: (config) =>
        set((s) => ({ settings: { ...s.settings, ...config } })),

      exportConfig: () => get().settings,

      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: "yyc3-settings",
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

/**
 * @file settingsSyncService.ts
 * @description 设置同步服务 — 跨 Store 数据联动桥接层，负责 Settings ↔ AIService / Theme / i18n / Shortcuts / Conversation 的双向同步
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags service, settings, sync, bridge, cross-store
 */

import { useSettingsStore } from "../stores/settingsStore";
import { useAIServiceStore } from "../stores/aiServiceStore";
import { useThemeStore, type ThemeVariant } from "../stores/themeStore";
import { useI18nStore, type Locale } from "../stores/i18nStore";
import { useShortcutStore } from "../stores/shortcutStore";

/* ═══════════════════════════════════════════════════════════
 * 1. Model 配置同步: settingsStore.models → aiServiceStore.providers
 * ═══════════════════════════════════════════════════════════ */

/** 将 settingsStore 中的模型 API Key 同步到 aiServiceStore */
export function syncModelApiKeys(): void {
  const { settings } = useSettingsStore.getState();
  const aiStore = useAIServiceStore.getState();

  for (const model of settings.models) {
    // 按 provider 名称匹配 aiServiceStore 中的 provider
    const providerNameMap: Record<string, string> = {
      OpenAI: "openai",
      Anthropic: "anthropic",
      "智谱 AI": "zhipuai",
      "百度文心": "baidu",
      "阿里通义": "aliyun",
      Ollama: "ollama",
    };

    const aiProviderId = providerNameMap[model.provider];
    if (aiProviderId && model.apiKey) {
      aiStore.setApiKey(aiProviderId, model.apiKey);
    }

    // 同步启用/禁用状态
    if (aiProviderId) {
      const aiProvider = aiStore.providers.find((p) => p.id === aiProviderId);
      if (aiProvider && aiProvider.enabled !== model.enabled) {
        aiStore.toggleProvider(aiProviderId);
      }
    }
  }
}

/** 将 aiServiceStore 中的 API Key 回写到 settingsStore */
export function syncApiKeysToSettings(): void {
  const settingsStore = useSettingsStore.getState();
  const aiStore = useAIServiceStore.getState();

  const reverseMap: Record<string, string> = {
    openai: "OpenAI",
    anthropic: "Anthropic",
    zhipuai: "智谱 AI",
    baidu: "百度文心",
    aliyun: "阿里通义",
    ollama: "Ollama",
  };

  for (const provider of aiStore.providers) {
    const settingsProviderName = reverseMap[provider.id];
    if (!settingsProviderName || !provider.apiKey) continue;

    const settingsModel = settingsStore.settings.models.find(
      (m) => m.provider === settingsProviderName
    );
    if (settingsModel && settingsModel.apiKey !== provider.apiKey) {
      settingsStore.updateModel(settingsModel.id, { apiKey: provider.apiKey });
    }
  }
}

/* ═══════════════════════════════════════════════════════════
 * 2. 主题同步: settingsStore.general.theme → themeStore
 * ═══════════════════════════════════════════════════════════ */

export function syncTheme(): void {
  const { settings } = useSettingsStore.getState();
  const themeStore = useThemeStore.getState();
  const themeMap: Record<string, ThemeVariant> = {
    dark: "aurora",
    light: "sunrise",
    auto: "aurora",
  };
  const variant = themeMap[settings.general.theme] || "aurora";
  if (themeStore.config.variant !== variant) {
    themeStore.setVariant(variant);
  }
}

/* ═══════════════════════════════════════════════════════════
 * 3. 语言同步: settingsStore.general.language → i18nStore
 * ═══════════════════════════════════════════════════════════ */

export function syncLanguage(): void {
  const { settings } = useSettingsStore.getState();
  const i18nStore = useI18nStore.getState();
  const langMap: Record<string, Locale> = {
    "zh-CN": "zh-CN",
    "en-US": "en-US",
  };
  const locale = langMap[settings.general.language] || "zh-CN";
  if (i18nStore.locale !== locale) {
    i18nStore.setLocale(locale);
  }
}

/* ═══════════════════════════════════════════════════════════
 * 4. 快捷键方案同步: settingsStore.general.keybindingScheme → shortcutStore
 * ═══════════════════════════════════════════════════════════ */

export function syncKeybindings(): void {
  const { settings } = useSettingsStore.getState();
  const shortcutStore = useShortcutStore.getState();

  if (settings.general.keybindingScheme === "vscode") {
    // 如果是 vscode 方案且有自定义绑定，重置回默认
    if (Object.keys(shortcutStore.customBindings).length > 0) {
      // 保留自定义绑定，不强制重置
    }
  }

  // 同步自定义快捷键映射
  if (settings.general.customKeybindings) {
    for (const [cmdId, shortcut] of Object.entries(settings.general.customKeybindings)) {
      const cmd = shortcutStore.commands.find((c) => c.id === cmdId);
      if (cmd && cmd.shortcut !== shortcut) {
        shortcutStore.setShortcut(cmdId, shortcut);
      }
    }
  }
}

/* ═══════════════════════════════════════════════════════════
 * 5. 规则 → AI 系统提示词注入
 * ═══════════════════════════════════════════════════════════ */

/** 从 settingsStore 的 rules 编译出系统提示词附加内容 */
export function compileRulesAsSystemPrompt(): string {
  const { settings } = useSettingsStore.getState();
  const enabledRules = settings.rules.filter((r) => r.enabled);

  if (enabledRules.length === 0) return "";

  const lines: string[] = [
    "\n--- 用户自定义规则 ---",
  ];

  const projectRules = enabledRules.filter((r) => r.scope === "project");
  const personalRules = enabledRules.filter((r) => r.scope === "personal");

  if (projectRules.length > 0) {
    lines.push("[项目规则]");
    projectRules.forEach((r) => lines.push(`- ${r.name}: ${r.content}`));
  }

  if (personalRules.length > 0) {
    lines.push("[个人规则]");
    personalRules.forEach((r) => lines.push(`- ${r.name}: ${r.content}`));
  }

  // 技能注入
  const enabledSkills = settings.skills.filter((s) => s.enabled);
  if (enabledSkills.length > 0) {
    lines.push("\n--- 已启用技能 ---");
    enabledSkills.forEach((s) => lines.push(`- ${s.name}: ${s.content}`));
  }

  return lines.join("\n");
}

/** 获取当前活跃智能体的完整系统提示词（含规则注入） */
export function getActiveAgentSystemPrompt(agentId?: string): string {
  const { settings } = useSettingsStore.getState();
  const agent = agentId
    ? settings.agents.find((a) => a.id === agentId)
    : settings.agents[0];

  if (!agent) return "";

  const basePrompt = agent.systemPrompt;
  const rulesPrompt = compileRulesAsSystemPrompt();
  const importSettings = settings.importSettings;

  const parts = [basePrompt];

  // AGENTS.md / CLAUDE.md 导入
  if (importSettings.includeAgentsMD) {
    parts.push("\n[已导入 AGENTS.md 中的项目约定]");
  }
  if (importSettings.includeClaudeMD) {
    parts.push("\n[已导入 CLAUDE.md 中的项目约定]");
  }

  if (rulesPrompt) {
    parts.push(rulesPrompt);
  }

  return parts.join("\n");
}

/* ═══════════════════════════════════════════════════════════
 * 6. MCP 端点运行时动态注入
 * ═══════════════════════════════════════════════════════════ */

/** MCP 运行时注册表 */
const mcpRegistry = new Map<string, { endpoint: string; enabled: boolean; projectLevel: boolean }>();

/** 同步 MCP 配置到运行时注册表 */
export function syncMCPEndpoints(): void {
  const { settings } = useSettingsStore.getState();

  // 清除已移除的 MCP
  for (const [id] of mcpRegistry) {
    if (!settings.mcpConfigs.find((m) => m.id === id)) {
      mcpRegistry.delete(id);
    }
  }

  // 注册/更新 MCP
  for (const mcp of settings.mcpConfigs) {
    if (mcp.endpoint) {
      mcpRegistry.set(mcp.id, {
        endpoint: mcp.endpoint,
        enabled: mcp.enabled,
        projectLevel: mcp.projectLevel,
      });
    }
  }

  // 广播 MCP 配置变更事件
  window.dispatchEvent(
    new CustomEvent("yyc3:mcp-config-updated", {
      detail: {
        configs: settings.mcpConfigs,
        registry: Object.fromEntries(mcpRegistry),
      },
    })
  );
}

/** 获取所有已启用的 MCP 端点 */
export function getActiveMCPEndpoints(): { id: string; name: string; endpoint: string }[] {
  const { settings } = useSettingsStore.getState();
  return settings.mcpConfigs
    .filter((m) => m.enabled && m.endpoint)
    .map((m) => ({ id: m.id, name: m.name, endpoint: m.endpoint! }));
}

/** 在运行时调用 MCP 端点 */
export async function invokeMCPTool(
  mcpId: string,
  toolName: string,
  params: Record<string, unknown>
): Promise<unknown> {
  const entry = mcpRegistry.get(mcpId);
  if (!entry || !entry.enabled) {
    throw new Error(`MCP ${mcpId} 未启用或不存在`);
  }

  // 检查对话流设置中的 autoRunMCP 权限
  const { settings } = useSettingsStore.getState();
  if (!settings.conversation.autoRunMCP) {
    throw new Error("自动运行 MCP 已禁用，请在设置中启用");
  }

  try {
    const response = await fetch(`${entry.endpoint}/tools/${toolName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error(`MCP 调用失败: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`MCP ${mcpId} 调用失败:`, error);
    throw error;
  }
}

/* ═══════════════════════════════════════════════════════════
 * 7. API Key 验证（真实逻辑）
 * ═══════════════════════════════════════════════════════════ */

interface ValidationResult {
  valid: boolean;
  message: string;
  latency?: number;
}

const providerEndpoints: Record<string, { url: string; method: string; headers: (key: string) => Record<string, string> }> = {
  OpenAI: {
    url: "https://api.openai.com/v1/models",
    method: "GET",
    headers: (key) => ({ Authorization: `Bearer ${key}` }),
  },
  Anthropic: {
    url: "https://api.anthropic.com/v1/messages",
    method: "POST",
    headers: (key) => ({
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    }),
  },
  "智谱 AI": {
    url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    method: "POST",
    headers: (key) => ({
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    }),
  },
  "阿里通义": {
    url: "https://dashscope.aliyuncs.com/compatible-mode/v1/models",
    method: "GET",
    headers: (key) => ({ Authorization: `Bearer ${key}` }),
  },
};

/** 验证 API Key 有效性（轻量级 GET/models 请求） */
export async function validateApiKey(
  provider: string,
  apiKey: string
): Promise<ValidationResult> {
  if (!apiKey || apiKey.length < 8) {
    return { valid: false, message: "API Key 格式不正确" };
  }

  const endpoint = providerEndpoints[provider];
  if (!endpoint) {
    // 本地模型 (Ollama) 或未知 provider 跳过验证
    if (provider === "Ollama") {
      return { valid: true, message: "本地模型无需验证" };
    }
    return { valid: false, message: `不支持验证 ${provider}` };
  }

  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(endpoint.url, {
      method: endpoint.method,
      headers: endpoint.headers(apiKey),
      signal: controller.signal,
      ...(endpoint.method === "POST"
        ? {
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: "hi" }],
              max_tokens: 1,
            }),
          }
        : {}),
    });

    clearTimeout(timeout);
    const latency = Math.round(performance.now() - start);

    if (response.ok || response.status === 200) {
      return { valid: true, message: "验证成功", latency };
    }

    if (response.status === 401 || response.status === 403) {
      return { valid: false, message: "API Key 无效或已过期", latency };
    }

    if (response.status === 429) {
      // 429 说明 key 有效，只是速率限制
      return { valid: true, message: "Key 有效（触发速率限制）", latency };
    }

    return { valid: false, message: `验证失败: HTTP ${response.status}`, latency };
  } catch (error: unknown) {
    const latency = Math.round(performance.now() - start);
    const msg = error instanceof Error ? error.message : "未知错误";

    if (msg.includes("abort")) {
      return { valid: false, message: "验证超时 (10s)", latency };
    }

    return { valid: false, message: `网络错误: ${msg}`, latency };
  }
}

/* ═══════════════════════════════════════════════════════════
 * 8. MCP 连接测试（Tauri 桥接层 + Fallback）
 * ═══════════════════════════════════════════════════════════ */

export interface MCPTestResult {
  success: boolean;
  latency: number;
  message: string;
  tools?: string[];
}

/** 测试 MCP 端点连接 */
export async function testMCPConnection(endpoint: string): Promise<MCPTestResult> {
  if (!endpoint) {
    return { success: false, latency: 0, message: "端点地址为空" };
  }

  const start = performance.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const latency = Math.round(performance.now() - start);

    if (response.ok) {
      let tools: string[] | undefined;
      try {
        const data = await response.json();
        tools = data.tools?.map((t: { name: string }) => t.name);
      } catch { /* 非 JSON 响应 */ }

      return { success: true, latency, message: "连接成功", tools };
    }

    return { success: false, latency, message: `HTTP ${response.status}: ${response.statusText}` };
  } catch (error: unknown) {
    const latency = Math.round(performance.now() - start);
    const msg = error instanceof Error ? error.message : "未知错误";
    return { success: false, latency, message: msg.includes("abort") ? "连接超时" : msg };
  }
}

/* ═══════════════════════════════════════════════════════════
 * 9. 编辑器配置同步
 * ═══════════════════════════════════════════════════════════ */

/** 获取 Monaco Editor 配置（从 settingsStore 通用设置推导） */
export function getMonacoEditorConfig(): Record<string, unknown> {
  const { settings } = useSettingsStore.getState();
  return {
    fontFamily: settings.general.editorFont,
    fontSize: settings.general.editorFontSize,
    wordWrap: settings.general.wordWrap ? "on" : "off",
    minimap: { enabled: true },
    tabSize: 2,
    formatOnPaste: settings.conversation.autoFixCodeIssues,
    formatOnType: settings.conversation.autoFixCodeIssues,
  };
}

/* ═══════════════════════════════════════════════════════════
 * 10. 统一同步入口
 * ═══════════════════════════════════════════════════════════ */

/** 全量同步所有 Store */
export function syncAll(): void {
  syncModelApiKeys();
  syncTheme();
  syncLanguage();
  syncKeybindings();
  syncMCPEndpoints();
}

/** 注册 settingsStore 变更订阅（自动联动） */
let unsubscribe: (() => void) | null = null;

export function startSettingsSync(): void {
  if (unsubscribe) return;

  // 初始全量同步
  syncAll();

  // 订阅 settingsStore 变更
  unsubscribe = useSettingsStore.subscribe((state, prevState) => {
    // 模型变更 → 同步 API Key
    if (state.settings.models !== prevState.settings.models) {
      syncModelApiKeys();
    }

    // 主题变更
    if (state.settings.general.theme !== prevState.settings.general.theme) {
      syncTheme();
    }

    // 语言变更
    if (state.settings.general.language !== prevState.settings.general.language) {
      syncLanguage();
    }

    // 快捷键变更
    if (
      state.settings.general.keybindingScheme !== prevState.settings.general.keybindingScheme ||
      state.settings.general.customKeybindings !== prevState.settings.general.customKeybindings
    ) {
      syncKeybindings();
    }

    // MCP 变更
    if (state.settings.mcpConfigs !== prevState.settings.mcpConfigs) {
      syncMCPEndpoints();
    }

    // 规则变更 → 广播事件
    if (state.settings.rules !== prevState.settings.rules || state.settings.skills !== prevState.settings.skills) {
      window.dispatchEvent(
        new CustomEvent("yyc3:rules-updated", {
          detail: { systemPrompt: compileRulesAsSystemPrompt() },
        })
      );
    }

    // 智能体变更 → 广播事件
    if (state.settings.agents !== prevState.settings.agents) {
      window.dispatchEvent(
        new CustomEvent("yyc3:agents-updated", { detail: state.settings.agents })
      );
    }
  });
}

export function stopSettingsSync(): void {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
}

/* ═══════════════════════════════════════════════════════════
 * 11. 配置导入/导出增强
 * ═══════════════════════════════════════════════════════════ */

/** 导出配置为 JSON 文件 */
export function exportSettingsToFile(): void {
  const config = useSettingsStore.getState().exportConfig();
  // 安全处理：清除 API Key
  const sanitized = {
    ...config,
    models: config.models.map((m) => ({ ...m, apiKey: "" })),
  };
  const blob = new Blob([JSON.stringify(sanitized, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `yyc3-settings-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** 从文件导入配置 */
export async function importSettingsFromFile(file: File): Promise<{ success: boolean; message: string }> {
  try {
    const text = await file.text();
    const config = JSON.parse(text);

    // 基本结构验证
    const requiredKeys = ["general", "agents", "mcpConfigs", "models", "context", "conversation", "rules", "skills"];
    const missing = requiredKeys.filter((k) => !(k in config));
    if (missing.length > 0) {
      return { success: false, message: `配置格式不完整，缺少: ${missing.join(", ")}` };
    }

    useSettingsStore.getState().importConfig(config);
    syncAll();

    return { success: true, message: "配置导入成功" };
  } catch (error) {
    return { success: false, message: `导入失败: ${error instanceof Error ? error.message : "解析错误"}` };
  }
}
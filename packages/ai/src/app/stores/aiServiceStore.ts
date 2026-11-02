/**
 * @file aiServiceStore.ts
 * @description AI 服务层 Zustand 状态管理 — 多 Provider/Model 动态管理、性能监控、成本追踪
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, ai, provider, model, performance, cost, zustand
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */
export interface AIModelConfig {
  id: string;
  name: string;
  displayName: string;
  type: "chat" | "embedding" | "image" | "audio";
  contextLength: number;
  maxTokens: number;
  enabled: boolean;
  parameters: {
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
  };
  capabilities: string[];
  benchmark?: {
    latency: number;
    throughput: number;
    accuracy: number;
  };
}

export interface AIProviderConfig {
  id: string;
  name: string;
  displayName: string;
  type: "cloud" | "local";
  baseURL: string;
  apiKey: string;
  apiKeyURL?: string;
  region?: string;
  models: AIModelConfig[];
  enabled: boolean;
  priority: number;
  rateLimit?: { requestsPerMinute: number; tokensPerMinute: number };
  pricing?: { inputPrice: number; outputPrice: number; currency: string };
}

export interface PerformanceMetric {
  id: string;
  providerId: string;
  modelId: string;
  timestamp: number;
  latency: number;
  throughput: number;
  successRate: number;
  errorCount: number;
  totalRequests: number;
}

export interface ErrorRecord {
  id: string;
  providerId: string;
  modelId: string;
  errorType: "network" | "api" | "rate_limit" | "authentication" | "unknown";
  errorMessage: string;
  timestamp: number;
  count: number;
  suggestions: string[];
}

export interface CostEntry {
  providerId: string;
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  currency: string;
  timestamp: number;
}

/* ─── 预设 Providers ─── */
const presetProviders: AIProviderConfig[] = [
  {
    id: "openai", name: "openai", displayName: "OpenAI", type: "cloud",
    baseURL: "https://api.openai.com/v1", apiKey: "", apiKeyURL: "https://platform.openai.com/api-keys",
    enabled: true, priority: 1,
    rateLimit: { requestsPerMinute: 3500, tokensPerMinute: 90000 },
    pricing: { inputPrice: 0.01, outputPrice: 0.03, currency: "USD" },
    models: [
      { id: "gpt-4-turbo", name: "gpt-4-turbo-preview", displayName: "GPT-4 Turbo", type: "chat", contextLength: 128000, maxTokens: 4096, enabled: true, parameters: { temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code", "reasoning"], benchmark: { latency: 1500, throughput: 50, accuracy: 0.95 } },
      { id: "gpt-3.5-turbo", name: "gpt-3.5-turbo", displayName: "GPT-3.5 Turbo", type: "chat", contextLength: 16385, maxTokens: 4096, enabled: true, parameters: { temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code"], benchmark: { latency: 800, throughput: 100, accuracy: 0.90 } },
      { id: "ada-002", name: "text-embedding-ada-002", displayName: "Ada Embedding", type: "embedding", contextLength: 8191, maxTokens: 8191, enabled: true, parameters: { temperature: 0, topP: 1, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["embedding"], benchmark: { latency: 200, throughput: 500, accuracy: 0.85 } },
    ],
  },
  {
    id: "anthropic", name: "anthropic", displayName: "Anthropic", type: "cloud",
    baseURL: "https://api.anthropic.com/v1", apiKey: "", apiKeyURL: "https://console.anthropic.com/settings/keys",
    enabled: true, priority: 2,
    rateLimit: { requestsPerMinute: 50, tokensPerMinute: 40000 },
    pricing: { inputPrice: 0.015, outputPrice: 0.075, currency: "USD" },
    models: [
      { id: "claude-3-opus", name: "claude-3-opus-20240229", displayName: "Claude 3 Opus", type: "chat", contextLength: 200000, maxTokens: 4096, enabled: true, parameters: { temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code", "reasoning", "analysis"], benchmark: { latency: 2000, throughput: 40, accuracy: 0.97 } },
      { id: "claude-3-sonnet", name: "claude-3-sonnet-20240229", displayName: "Claude 3 Sonnet", type: "chat", contextLength: 200000, maxTokens: 4096, enabled: true, parameters: { temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code", "reasoning"], benchmark: { latency: 1200, throughput: 60, accuracy: 0.94 } },
    ],
  },
  {
    id: "zhipuai", name: "zhipuai", displayName: "智谱 AI", type: "cloud",
    baseURL: "https://open.bigmodel.cn/api/paas/v4", apiKey: "", apiKeyURL: "https://open.bigmodel.cn/usercenter/apikeys",
    region: "CN", enabled: true, priority: 3,
    rateLimit: { requestsPerMinute: 100, tokensPerMinute: 50000 },
    pricing: { inputPrice: 0.0001, outputPrice: 0.0001, currency: "CNY" },
    models: [
      { id: "glm-4", name: "glm-4", displayName: "GLM-4", type: "chat", contextLength: 128000, maxTokens: 8192, enabled: true, parameters: { temperature: 0.7, topP: 0.9, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code", "reasoning"], benchmark: { latency: 1000, throughput: 70, accuracy: 0.92 } },
      { id: "glm-4-flash", name: "glm-4-flash", displayName: "GLM-4 Flash", type: "chat", contextLength: 128000, maxTokens: 8192, enabled: true, parameters: { temperature: 0.7, topP: 0.9, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code"], benchmark: { latency: 500, throughput: 120, accuracy: 0.88 } },
      { id: "embedding-2", name: "embedding-2", displayName: "Embedding-2", type: "embedding", contextLength: 8192, maxTokens: 8192, enabled: true, parameters: { temperature: 0, topP: 1, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["embedding"], benchmark: { latency: 150, throughput: 600, accuracy: 0.87 } },
    ],
  },
  {
    id: "baidu", name: "baidu", displayName: "百度文心", type: "cloud",
    baseURL: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop", apiKey: "", apiKeyURL: "https://console.bce.baidu.com/qianfan/ais/console/application/list",
    region: "CN", enabled: true, priority: 4,
    rateLimit: { requestsPerMinute: 50, tokensPerMinute: 30000 },
    pricing: { inputPrice: 0.00012, outputPrice: 0.00012, currency: "CNY" },
    models: [
      { id: "ernie-4.0-8k", name: "ernie-4.0-8k", displayName: "ERNIE-4.0-8K", type: "chat", contextLength: 8192, maxTokens: 4096, enabled: true, parameters: { temperature: 0.7, topP: 0.9, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code", "reasoning"], benchmark: { latency: 1200, throughput: 65, accuracy: 0.91 } },
      { id: "ernie-3.5-8k", name: "ernie-3.5-8k", displayName: "ERNIE-3.5-8K", type: "chat", contextLength: 8192, maxTokens: 4096, enabled: true, parameters: { temperature: 0.7, topP: 0.9, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code"], benchmark: { latency: 800, throughput: 90, accuracy: 0.89 } },
    ],
  },
  {
    id: "aliyun", name: "aliyun", displayName: "阿里通义", type: "cloud",
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1", apiKey: "", apiKeyURL: "https://dashscope.console.aliyun.com/apiKey",
    region: "CN", enabled: true, priority: 5,
    rateLimit: { requestsPerMinute: 100, tokensPerMinute: 60000 },
    pricing: { inputPrice: 0.00008, outputPrice: 0.00008, currency: "CNY" },
    models: [
      { id: "qwen-turbo", name: "qwen-turbo", displayName: "Qwen Turbo", type: "chat", contextLength: 8192, maxTokens: 4096, enabled: true, parameters: { temperature: 0.7, topP: 0.9, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code"], benchmark: { latency: 600, throughput: 100, accuracy: 0.90 } },
      { id: "qwen-plus", name: "qwen-plus", displayName: "Qwen Plus", type: "chat", contextLength: 32768, maxTokens: 8192, enabled: true, parameters: { temperature: 0.7, topP: 0.9, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code", "reasoning"], benchmark: { latency: 1000, throughput: 75, accuracy: 0.93 } },
      { id: "qwen-max", name: "qwen-max", displayName: "Qwen Max", type: "chat", contextLength: 32768, maxTokens: 8192, enabled: true, parameters: { temperature: 0.7, topP: 0.9, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code", "reasoning", "analysis"], benchmark: { latency: 1500, throughput: 55, accuracy: 0.95 } },
    ],
  },
  {
    id: "ollama", name: "ollama", displayName: "Ollama (本地)", type: "local",
    baseURL: "http://localhost:11434", apiKey: "ollama",
    enabled: false, priority: 10,
    pricing: { inputPrice: 0, outputPrice: 0, currency: "USD" },
    models: [
      { id: "llama2", name: "llama2", displayName: "Llama 2", type: "chat", contextLength: 4096, maxTokens: 2048, enabled: true, parameters: { temperature: 0.7, topP: 0.9, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code"], benchmark: { latency: 3000, throughput: 20, accuracy: 0.85 } },
      { id: "mistral", name: "mistral", displayName: "Mistral", type: "chat", contextLength: 8192, maxTokens: 4096, enabled: true, parameters: { temperature: 0.7, topP: 0.9, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code", "reasoning"], benchmark: { latency: 2000, throughput: 30, accuracy: 0.88 } },
      { id: "codellama", name: "codellama", displayName: "Code Llama", type: "chat", contextLength: 16384, maxTokens: 4096, enabled: true, parameters: { temperature: 0.7, topP: 0.9, frequencyPenalty: 0, presencePenalty: 0 }, capabilities: ["chat", "code"], benchmark: { latency: 2500, throughput: 25, accuracy: 0.90 } },
    ],
  },
];

/* ─── 模拟性能数据生成 ─── */
function generateMockMetrics(): PerformanceMetric[] {
  const metrics: PerformanceMetric[] = [];
  const now = Date.now();
  presetProviders.filter((p) => p.enabled).forEach((provider) => {
    provider.models.filter((m) => m.enabled && m.type === "chat").forEach((model) => {
      for (let i = 0; i < 12; i++) {
        const base = model.benchmark || { latency: 1000, throughput: 50, accuracy: 0.9 };
        metrics.push({
          id: `m-${provider.id}-${model.id}-${i}`,
          providerId: provider.id,
          modelId: model.id,
          timestamp: now - i * 300000,
          latency: base.latency * (0.8 + Math.random() * 0.4),
          throughput: base.throughput * (0.7 + Math.random() * 0.6),
          successRate: Math.min(1, base.accuracy + (Math.random() - 0.3) * 0.1),
          errorCount: Math.floor(Math.random() * 3),
          totalRequests: 10 + Math.floor(Math.random() * 50),
        });
      }
    });
  });
  return metrics;
}

function generateMockCost(): CostEntry[] {
  const entries: CostEntry[] = [];
  const now = Date.now();
  presetProviders.filter((p) => p.enabled && p.pricing).forEach((provider) => {
    provider.models.filter((m) => m.enabled && m.type === "chat").forEach((model) => {
      const input = 1000 + Math.floor(Math.random() * 50000);
      const output = 500 + Math.floor(Math.random() * 20000);
      entries.push({
        providerId: provider.id,
        modelId: model.id,
        inputTokens: input,
        outputTokens: output,
        cost: (input / 1000) * (provider.pricing!.inputPrice) + (output / 1000) * (provider.pricing!.outputPrice),
        currency: provider.pricing!.currency,
        timestamp: now - Math.floor(Math.random() * 86400000),
      });
    });
  });
  return entries;
}

/* ─── Store 接口 ─── */
interface AIServiceStore {
  providers: AIProviderConfig[];
  activeProviderId: string;
  activeModelId: string;
  metrics: PerformanceMetric[];
  errors: ErrorRecord[];
  costEntries: CostEntry[];
  detectionEnabled: boolean;
  cacheEnabled: boolean;
  rateLimitEnabled: boolean;

  /* Provider 管理 */
  addProvider: (p: AIProviderConfig) => void;
  editProvider: (p: AIProviderConfig) => void;
  removeProvider: (id: string) => void;
  toggleProvider: (id: string) => void;
  setActiveProvider: (id: string) => void;

  /* Model 管理 */
  addModel: (providerId: string, m: AIModelConfig) => void;
  editModel: (providerId: string, m: AIModelConfig) => void;
  removeModel: (providerId: string, modelId: string) => void;
  toggleModel: (providerId: string, modelId: string) => void;
  setActiveModel: (id: string) => void;

  /* API Key */
  setApiKey: (providerId: string, key: string) => void;
  validateApiKey: (providerId: string) => Promise<boolean>;

  /* 监控 */
  refreshMetrics: () => void;
  addErrorRecord: (err: Omit<ErrorRecord, "id" | "timestamp">) => void;
  clearErrors: () => void;

  /* 配置 */
  toggleDetection: () => void;
  toggleCache: () => void;
  toggleRateLimit: () => void;

  /* 辅助 */
  getProvider: (id: string) => AIProviderConfig | undefined;
  getActiveProvider: () => AIProviderConfig | undefined;
  getActiveModel: () => AIModelConfig | undefined;
  getTotalCost: () => { usd: number; cny: number };
}

/* ─── Store 实现 ─── */
export const useAIServiceStore = create<AIServiceStore>()(
  persist(
    (set, get) => ({
      providers: presetProviders,
      activeProviderId: "openai",
      activeModelId: "gpt-4-turbo",
      metrics: generateMockMetrics(),
      errors: [],
      costEntries: generateMockCost(),
      detectionEnabled: true,
      cacheEnabled: true,
      rateLimitEnabled: true,

      addProvider: (p) => set((s) => ({ providers: [...s.providers, p] })),
      editProvider: (p) => set((s) => ({ providers: s.providers.map((x) => (x.id === p.id ? p : x)) })),
      removeProvider: (id) => set((s) => ({ providers: s.providers.filter((x) => x.id !== id) })),
      toggleProvider: (id) =>
        set((s) => ({ providers: s.providers.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)) })),
      setActiveProvider: (id) => {
        const provider = get().providers.find((p) => p.id === id);
        const firstModel = provider?.models.find((m) => m.enabled && m.type === "chat");
        set({ activeProviderId: id, activeModelId: firstModel?.id || get().activeModelId });
      },

      addModel: (providerId, m) =>
        set((s) => ({
          providers: s.providers.map((p) =>
            p.id === providerId ? { ...p, models: [...p.models, m] } : p
          ),
        })),
      editModel: (providerId, m) =>
        set((s) => ({
          providers: s.providers.map((p) =>
            p.id === providerId
              ? { ...p, models: p.models.map((x) => (x.id === m.id ? m : x)) }
              : p
          ),
        })),
      removeModel: (providerId, modelId) =>
        set((s) => ({
          providers: s.providers.map((p) =>
            p.id === providerId ? { ...p, models: p.models.filter((m) => m.id !== modelId) } : p
          ),
        })),
      toggleModel: (providerId, modelId) =>
        set((s) => ({
          providers: s.providers.map((p) =>
            p.id === providerId
              ? { ...p, models: p.models.map((m) => (m.id === modelId ? { ...m, enabled: !m.enabled } : m)) }
              : p
          ),
        })),
      setActiveModel: (id) => set({ activeModelId: id }),

      setApiKey: (providerId, key) =>
        set((s) => ({
          providers: s.providers.map((p) => (p.id === providerId ? { ...p, apiKey: key } : p)),
        })),
      validateApiKey: async (providerId) => {
        const provider = get().providers.find((p) => p.id === providerId);
        if (!provider || !provider.apiKey) return false;
        await new Promise((r) => setTimeout(r, 800));
        return provider.apiKey.length > 10;
      },

      refreshMetrics: () => set({ metrics: generateMockMetrics(), costEntries: generateMockCost() }),

      addErrorRecord: (err) =>
        set((s) => ({
          errors: [
            ...s.errors.slice(-100),
            { ...err, id: crypto.randomUUID().slice(0, 8), timestamp: Date.now() },
          ],
        })),
      clearErrors: () => set({ errors: [] }),

      toggleDetection: () => set((s) => ({ detectionEnabled: !s.detectionEnabled })),
      toggleCache: () => set((s) => ({ cacheEnabled: !s.cacheEnabled })),
      toggleRateLimit: () => set((s) => ({ rateLimitEnabled: !s.rateLimitEnabled })),

      getProvider: (id) => get().providers.find((p) => p.id === id),
      getActiveProvider: () => get().providers.find((p) => p.id === get().activeProviderId),
      getActiveModel: () => {
        const provider = get().getActiveProvider();
        return provider?.models.find((m) => m.id === get().activeModelId);
      },
      getTotalCost: () => {
        const entries = get().costEntries;
        return {
          usd: entries.filter((e) => e.currency === "USD").reduce((s, e) => s + e.cost, 0),
          cny: entries.filter((e) => e.currency === "CNY").reduce((s, e) => s + e.cost, 0),
        };
      },
    }),
    {
      name: "yyc3-ai-service",
      partialize: (state) => ({
        providers: state.providers.map((p) => ({ ...p, apiKey: "" })), // 不持久化 API Key
        activeProviderId: state.activeProviderId,
        activeModelId: state.activeModelId,
        detectionEnabled: state.detectionEnabled,
        cacheEnabled: state.cacheEnabled,
        rateLimitEnabled: state.rateLimitEnabled,
      }),
    }
  )
);

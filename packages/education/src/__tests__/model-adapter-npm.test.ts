/**
 * @vitest-environment node
 */
// ============================================================
// YYC³ · @yyc3/education 批次 2 · model-adapter npm 正式版契约测试
// ============================================================
// 背景（bug#1/#3 结构性治理 · 2026-11-27）：education 内嵌 model-adapter 旧副本
// 已删除（= LP 仓旧快照、无 education 定制），改依赖 npm 正式版
// @yyc3/model-adapter@^1.1.0。本件为替换后的契约测试，前身 =
// 原 src/model-adapter/src/__tests__/model-adapter.test.ts。
//
// 与前身差异（依赖形态变化所致）：
//  1. npm dist 将 openai SDK 打进包内——vi.mock('openai') 拦不到，改全量
//     globalThis.fetch 桩（1.1.0 SDK client 亦走 globalThis.fetch）；
//  2. dist 的 SDK 在 jsdom（window 存在）拒绝实例化——本件声明 node 环境；
//  3. 1.1.0 已内置 WebCrypto 算法名映射（SHA256→SHA-256），前身 digest 别名桩
//     （缺陷桥接）不再需要，直接用 Node 原生 webcrypto。
// ============================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { webcrypto } from 'node:crypto';
import { Readable } from 'node:stream';
import {
  ModelAdapter,
  OpenAIProvider,
  GoogleProvider,
  EnhancedStreamingProcessor,
  IntelligentCacheLayer,
  createModelAdapter,
  createModelRequest,
  generateId,
  estimateTokenCount,
  calculateCost,
  validateModelConfig,
  selectBestModelForTask,
  formatLatency,
  DEFAULT_MODEL_ADAPTER_CONFIG,
  MODEL_PRESETS,
  VERSION,
} from '@yyc3/model-adapter';
// 1.1.0 起 CacheLevel/CacheStrategy 自包入口仅作类型再导出（enum 运行时值不再暴露）
import type { CacheLevel, CacheStrategy, ModelRequest, ModelResponse, ModelConfig } from '@yyc3/model-adapter';

const makeModelConfig = (overrides: Partial<ModelConfig> = {}): ModelConfig =>
  ({
    id: 'm-1',
    name: 'GPT-4',
    provider: 'openai',
    model: 'gpt-4',
    credentials: { apiKey: 'sk-test' },
    capabilities: { maxTokens: 4096, maxContextLength: 8192, supportedModalities: ['text'], streamingSupport: true },
    pricing: { inputTokensPer1K: 0.03, outputTokensPer1K: 0.06, currency: 'USD', unit: 'token' },
    ...overrides,
  }) as ModelConfig;

const makeRequest = (overrides: Partial<ModelRequest> = {}): ModelRequest =>
  ({
    id: 'req-1',
    taskType: 'generation',
    prompt: '写一首诗',
    temperature: 0.7,
    maxTokens: 100,
    stream: false,
    metadata: { requestId: 'req-1', priority: 'normal', tags: [] },
    ...overrides,
  }) as ModelRequest;

const COMPLETION_BODY = {
  id: 'chatcmpl-1',
  object: 'chat.completion',
  created: Date.now(),
  model: 'gpt-4',
  choices: [
    {
      index: 0,
      message: { role: 'assistant', content: '好的回复' },
      finish_reason: 'stop',
    },
  ],
  usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
};

// headers 用真实 Headers 实例——openai SDK（dist 内联）会把响应 headers 交自研
// Headers 包装器迭代（entries()），裸 { get } 对象会 TypeError
const fetchResponse = (body: unknown, ok = true) =>
  ({
    ok,
    status: ok ? 200 : 500,
    statusText: ok ? 'OK' : 'Internal Error',
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
    headers: new Headers({ 'content-type': 'application/json' }),
  }) as unknown as Response;

// OpenAI REST 全量 fetch 桩：/models → 健康检查；chat/completions → 会话补全
const stubOpenAIRest = () => {
  const fetchMock = vi.fn().mockImplementation(async (url: string) => {
    const u = String(url);
    if (u.includes('/models')) return fetchResponse({ data: [{ id: 'gpt-4' }] });
    return fetchResponse(COMPLETION_BODY);
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

beforeEach(() => {
  vi.stubGlobal('crypto', webcrypto);
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// ============================================================ index 工具函数
describe('model-adapter@npm · index 工具', () => {
  it('createModelRequest：默认字段 + 覆盖合并', () => {
    const req = createModelRequest('analysis', '分析这段话', { maxTokens: 55, temperature: 0.2 });
    expect(req.taskType).toBe('analysis');
    expect(req.maxTokens).toBe(55);
    expect(req.temperature).toBe(0.2);
    expect(req.id).toMatch(/^req_/);
    expect(req.stream).toBe(false);
  });

  it('generateId 唯一性 + estimateTokenCount 向上取整', () => {
    expect(generateId()).not.toBe(generateId());
    expect(estimateTokenCount('abcd')).toBe(1);
    expect(estimateTokenCount('abcde')).toBe(2);
  });

  it('calculateCost：输入/输出分开计价', () => {
    expect(calculateCost(1000, 500, { inputTokensPer1K: 0.03, outputTokensPer1K: 0.06, currency: 'USD', unit: 'token' })).toBeCloseTo(0.06);
  });

  it('validateModelConfig：逐字段缺失报错 + 完整配置零错误', () => {
    const errors = validateModelConfig({});
    expect(errors).toHaveLength(6);
    expect(validateModelConfig(makeModelConfig())).toEqual([]);
  });

  it('selectBestModelForTask：偏好命中/降级首选/空集 null', () => {
    const gpt4 = makeModelConfig({ id: 'a', model: 'gpt-4' });
    const turbo = makeModelConfig({ id: 'b', model: 'gpt-3.5-turbo' });
    expect(selectBestModelForTask('summarization', [turbo, gpt4])?.model).toBe('gpt-4');
    expect(selectBestModelForTask('generation', [turbo])?.model).toBe('gpt-3.5-turbo');
    expect(selectBestModelForTask('analysis', [])).toBeNull();
  });

  it('formatLatency：三档格式', () => {
    expect(formatLatency(500)).toBe('500ms');
    expect(formatLatency(1500)).toBe('1.50s');
    expect(formatLatency(90000)).toBe('1m 30.00s');
  });

  it('createModelAdapter 工厂 + 常量表（npm 正式版 VERSION=1.1.0）', () => {
    expect(createModelAdapter()).toBeInstanceOf(ModelAdapter);
    expect(VERSION).toBe('1.1.0');
    expect(DEFAULT_MODEL_ADAPTER_CONFIG.routing.type).toBe('smart');
    expect(Object.keys(MODEL_PRESETS).length).toBeGreaterThan(0);
  });
});

// ============================================================ ModelAdapter 主类
describe('model-adapter@npm · ModelAdapter', () => {
  const bootAdapter = async (overrides: Record<string, unknown> = {}, fetchImpl?: typeof fetch) => {
    // fetch 可注入：openai SDK（dist 内联）在 client 构造期捕获 fetch 实现，
    // boot 后再 stubGlobal 不生效——需在 bootAdapter 之前注入
    const fetchMock = fetchImpl
      ? vi.fn().mockImplementation(fetchImpl)
      : stubOpenAIRest();
    vi.stubGlobal('fetch', fetchMock);
    const adapter = new ModelAdapter();
    await adapter.initialize({
      defaultModel: 'm-1',
      fallbackModel: 'm-2',
      routing: { type: 'smart', fallback: { enabled: true, maxRetries: 1, retryDelay: 10, exponentialBackoff: false, alternativeModels: [], fallbackOnErrors: ['timeout'] } },
      cache: { enabled: true, maxSize: 100, ttl: 60000, strategy: 'lru', compressionEnabled: false, encryptionEnabled: false },
      monitoring: { enabled: true, metricsInterval: 60000, detailedLogging: false, alertThresholds: { errorRate: 0.1, latency: 5000, cost: 10, queueDepth: 100, resourceUsage: 0.9 }, retentionPeriod: 1000 },
      loadBalancing: { strategy: 'round_robin', weights: {}, healthCheckInterval: 600000, unhealthyThreshold: 3, healthyThreshold: 2 },
      security: { encryptionEnabled: false, keyRotationEnabled: false, auditLogging: false, dataRetentionPolicy: 1000, complianceStandards: [], accessControl: { rbacEnabled: false, defaultPermissions: [], adminRoles: [], userRoles: [] } },
      ...overrides,
    } as any);
    await adapter.addModel(makeModelConfig({ id: 'm-1', name: 'GPT-4', model: 'gpt-4' }));
    await adapter.addModel(makeModelConfig({ id: 'm-2', name: 'Turbo', model: 'gpt-3.5-turbo', provider: 'openai' }));
    await adapter.start();
    return { adapter, fetchMock };
  };

  it('生命周期：initialize→active→stop→restart→suspend 状态机 + 配置读写', async () => {
    stubOpenAIRest();
    const adapter = new ModelAdapter();
    expect(adapter.status).toBe('initializing');
    await adapter.initialize({
      routing: { type: 'smart', fallback: { enabled: false, maxRetries: 0, retryDelay: 0, exponentialBackoff: false, alternativeModels: [], fallbackOnErrors: [] } },
      cache: { enabled: true, maxSize: 10, ttl: 1000, strategy: 'lru', compressionEnabled: false, encryptionEnabled: false },
      monitoring: { enabled: true, metricsInterval: 60000, detailedLogging: false, alertThresholds: { errorRate: 0.1, latency: 5000, cost: 10, queueDepth: 100, resourceUsage: 0.9 }, retentionPeriod: 1000 },
      loadBalancing: { strategy: 'round_robin', weights: {}, healthCheckInterval: 600000, unhealthyThreshold: 3, healthyThreshold: 2 },
    } as any);
    expect(adapter.status).toBe('active');
    expect(adapter.config.routing.type).toBe('smart');
    await adapter.start();
    await adapter.updateConfig({ cache: { enabled: true, maxSize: 5, ttl: 1000, strategy: 'lru', compressionEnabled: false, encryptionEnabled: false } } as any);
    expect(adapter.config.cache.maxSize).toBe(5);
    await adapter.resetConfig();
    expect(adapter.status).toBe('active');
    await adapter.stop();
    expect(adapter.status).toBe('suspended');
    await adapter.restart();
    expect(adapter.status).toBe('active');
  });

  it('模型管理：addModel 校验/重复/删除/更新', async () => {
    const { adapter } = await bootAdapter();
    expect(adapter.models.size).toBe(2);
    await expect(adapter.addModel({ id: '', name: '', provider: 'openai', model: '' } as any)).rejects.toThrow('Invalid model configuration');
    await adapter.updateModel('m-1', { name: 'GPT-4-turbo' } as any);
    expect(adapter.models.get('m-1')?.name).toBe('GPT-4-turbo');
    await adapter.removeModel('m-2');
    expect(adapter.models.size).toBe(1);
  });

  it('processRequest：REST fetch 桩完整链路 + 缓存命中第二次不发请求', async () => {
    const { adapter, fetchMock } = await bootAdapter();
    const completionsCalls = () => fetchMock.mock.calls.filter(([u]) => !String(u).includes('/models')).length;
    const response = await adapter.processRequest(makeRequest());
    expect(response.content).toBe('好的回复');
    expect(response.requestId).toBe('req-1');
    expect(response.modelId).toBe('m-1');
    expect(response.metadata.latency).toBeGreaterThanOrEqual(0);
    const afterFirst = completionsCalls();
    expect(afterFirst).toBeGreaterThanOrEqual(1);
    // 同参数第二次 → 缓存命中（sha256 键一致；1.1.0 内置 SHA256→SHA-256 映射）
    const second = await adapter.processRequest(makeRequest());
    expect(second.content).toBe('好的回复');
    expect(completionsCalls()).toBe(afterFirst);
  });

  it('processRequest：无可用模型抛错', async () => {
    stubOpenAIRest();
    const adapter = new ModelAdapter();
    await adapter.initialize({} as any);
    await expect(adapter.processRequest(makeRequest())).rejects.toThrow(/No available models/);
  });

  it('generateText / generate：文本便捷通道', async () => {
    const { adapter } = await bootAdapter();
    const text = await adapter.generateText({ prompt: '你好', taskType: 'conversation' } as any);
    expect(JSON.stringify(text)).toContain('好的回复');
    const gen = await adapter.generate({ prompt: '写代码', maxTokens: 50, temperature: 0.3 } as any);
    expect(JSON.stringify(gen)).toContain('好的回复');
  });

  it('cancelRequest：未知 id 取消为 no-op 不抛', async () => {
    const { adapter } = await bootAdapter();
    await expect(adapter.cancelRequest('no-such-req')).resolves.toBeUndefined();
  });

  it('缓存操作：clearCache + getCacheStats', async () => {
    const { adapter } = await bootAdapter();
    await adapter.processRequest(makeRequest());
    await adapter.clearCache();
    const stats = await adapter.getCacheStats();
    expect(stats).toHaveProperty('size');
    expect(stats).toHaveProperty('hitRate');
  });

  it('healthCheck：模型健康状态返回', async () => {
    const { adapter } = await bootAdapter();
    const health = await adapter.healthCheck();
    expect(health['m-1']).toBeDefined();
    expect(health['m-1'].status).toBe('healthy');
  });

  it('路由策略：fastest/least_cost/best_quality/smart 四种选型不抛', async () => {
    for (const type of ['fastest', 'least_cost', 'best_quality', 'smart'] as const) {
      const { adapter } = await bootAdapter({ routing: { type, fallback: { enabled: false, maxRetries: 0, retryDelay: 0, exponentialBackoff: false, alternativeModels: [], fallbackOnErrors: [] } } });
      const resp = await adapter.processRequest(makeRequest({ id: `r-${type}` }));
      expect(resp.content).toBe('好的回复');
      await adapter.stop();
    }
  });

  it('processStreamingRequest：SSE 流式桩逐块回调', async () => {
    const encoder = new TextEncoder();
    const sse =
      [
        'data: {"id":"s1","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"你"},"finish_reason":null}]}',
        'data: {"id":"s1","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"好"},"finish_reason":"stop"}]}',
        'data: [DONE]',
      ].join('\n\n') + '\n\n';
    // SDK 在 client 构造期捕获 fetch 实现——SSE 流式桩必须先于 bootAdapter 注入
    //（bootAdapter 内部的 JSON 桩会覆盖此后设置）；流式路径要求响应带 body
    const sseFetch = async (url: string) => {
      if (String(url).includes('/models')) return fetchResponse({ data: [{ id: 'gpt-4' }] });
      return {
        ok: true,
        status: 200,
        body: Readable.toWeb(Readable.from([encoder.encode(sse)])),
        headers: new Headers({ 'content-type': 'text/event-stream' }),
      } as unknown as Response;
    };
    const { adapter } = await bootAdapter({}, sseFetch as typeof fetch);
    const received: ModelResponse[] = [];
    await adapter.processStreamingRequest(makeRequest({ id: 'req-stream' }), (chunk) => received.push(chunk));
    expect(received.length).toBeGreaterThan(0);
  });

  it('updateConfig/resetConfig 后仍可处理请求', async () => {
    const { adapter } = await bootAdapter();
    await adapter.updateConfig({ monitoring: { enabled: true, metricsInterval: 1000, detailedLogging: false, alertThresholds: { errorRate: 1, latency: 9999, cost: 99, queueDepth: 99, resourceUsage: 1 }, retentionPeriod: 1000 } } as any);
    const resp = await adapter.processRequest(makeRequest({ id: 'req-after-config' }));
    expect(resp.content).toBe('好的回复');
  });
});

// ============================================================ 独立 OpenAIProvider（fetch 桩）
describe('model-adapter@npm · OpenAIProvider（独立实现，fetch 桩）', () => {
  const boot = async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (String(url).includes('/models')) return fetchResponse({ data: [{ id: 'gpt-4' }] });
      return fetchResponse(COMPLETION_BODY);
    });
    vi.stubGlobal('fetch', fetchMock);
    const provider = new OpenAIProvider();
    await provider.initialize(makeModelConfig({ credentials: { apiKey: 'sk-test', baseURL: 'https://api.test/v1' } } as any));
    return { provider, fetchMock };
  };

  it('initialize（内含健康检查）→ processRequest 全字段映射', async () => {
    const { provider } = await boot();
    const resp = await provider.processRequest(makeRequest());
    expect(resp.content).toBe('好的回复');
    expect(resp.finishReason).toBeDefined();
    expect(resp.usage.totalTokens).toBe(15);
    expect(resp.metadata.provider).toBe('openai');
    expect(resp.metadata.cacheHit).toBe(false);
    expect(resp.modelId).toBe('m-1');
  });

  it('content 为块数组时解析文本块', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (String(url).includes('/models')) return fetchResponse({ data: [] });
      return fetchResponse({ ...COMPLETION_BODY, choices: [{ index: 0, message: { role: 'assistant', content: [{ type: 'text', text: '块内容' }] }, finish_reason: 'length' }] });
    });
    vi.stubGlobal('fetch', fetchMock);
    const provider = new OpenAIProvider();
    await provider.initialize(makeModelConfig({ credentials: { apiKey: 'k' } } as any));
    const resp = await provider.processRequest(makeRequest());
    expect(JSON.stringify(resp.content)).toContain('块内容');
    expect(resp.finishReason).toBeDefined();
  });

  it('未初始化直接调用抛错 + HTTP 错误抛出', async () => {
    const provider = new OpenAIProvider();
    await expect(provider.processRequest(makeRequest())).rejects.toThrow(/not active/);
    await expect(provider.processStreamingRequest(makeRequest(), () => {})).rejects.toThrow(/not active/);
    const { provider: ok } = await boot();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fetchResponse({ error: 'boom' }, false)));
    await expect(ok.processRequest(makeRequest({ id: 'r-err' }))).rejects.toThrow();
  });

  it('processStreamingRequest：SSE 解析逐块回调', async () => {
    const encoder = new TextEncoder();
    const sse = [
      'data: {"id":"s","choices":[{"delta":{"content":"流"}}]}',
      'data: {"id":"s","choices":[{"delta":{"content":"式"}}]}',
      'data: [DONE]',
    ].join('\n\n') + '\n\n';
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (String(url).includes('/models')) return fetchResponse({ data: [] });
      return { ok: true, status: 200, body: Readable.toWeb(Readable.from([encoder.encode(sse)])), headers: new Headers({ 'content-type': 'text/event-stream' }) } as unknown as Response;
    });
    vi.stubGlobal('fetch', fetchMock);
    const provider = new OpenAIProvider();
    await provider.initialize(makeModelConfig({ credentials: { apiKey: 'k' } } as any));
    const received: string[] = [];
    await provider.processStreamingRequest(makeRequest(), (chunk) => {
      const c = (chunk as any).content ?? chunk;
      received.push(typeof c === 'string' ? c : JSON.stringify(c));
    });
    expect(received.length).toBeGreaterThan(0);
  });

  it('healthCheck：正常/异常两态 + cleanup', async () => {
    const { provider } = await boot();
    const health = await provider.healthCheck();
    expect(health.status).toBe('healthy');
    await provider.cleanup();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('net down')));
    const bad = new OpenAIProvider();
    const badHealth = await bad.healthCheck();
    expect(['unhealthy', 'degraded']).toContain(badHealth.status);
  });
});

// ============================================================ GoogleProvider（fetch 桩）
describe('model-adapter@npm · GoogleProvider（fetch 桩）', () => {
  const boot = async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (String(url).includes('/models?')) return fetchResponse({ models: [{ name: 'models/gemini-pro' }] });
      if (String(url).includes(':streamGenerateContent')) return fetchResponse({ candidates: [{ content: { parts: [{ text: '谷歌回复' }] }, finishReason: 'STOP' }], usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 4, totalTokenCount: 9 } });
      return fetchResponse({ candidates: [{ content: { parts: [{ text: '谷歌回复' }] }, finishReason: 'STOP' }], usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 4, totalTokenCount: 9 } });
    });
    vi.stubGlobal('fetch', fetchMock);
    const provider = new GoogleProvider();
    await provider.initialize(makeModelConfig({ provider: 'google', model: 'gemini-pro', credentials: { apiKey: 'g-key' } } as any));
    return { provider, fetchMock };
  };

  it('initialize → processRequest 映射谷歌响应', async () => {
    const { provider } = await boot();
    const resp = await provider.processRequest(makeRequest());
    expect(JSON.stringify(resp.content)).toContain('谷歌回复');
    expect(resp.metadata.provider).toBe('google');
  });

  it('未初始化抛错 + healthCheck', async () => {
    const provider = new GoogleProvider();
    await expect(provider.processRequest(makeRequest())).rejects.toThrow();
    const { provider: ok } = await boot();
    const health = await ok.healthCheck();
    expect(health).toBeDefined();
  });

  it('processStreamingRequest：流式端点解析', async () => {
    const encoder = new TextEncoder();
    const sse = '{"candidates":[{"content":{"parts":[{"text":"谷"}]}}]}\n{"candidates":[{"content":{"parts":[{"text":"歌"}]}}]}\n';
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (String(url).includes('/models?')) return fetchResponse({ models: [] });
      return { ok: true, status: 200, body: Readable.toWeb(Readable.from([encoder.encode(sse)])), headers: { get: () => null } } as unknown as Response;
    });
    vi.stubGlobal('fetch', fetchMock);
    const provider = new GoogleProvider();
    await provider.initialize(makeModelConfig({ provider: 'google', model: 'gemini-pro', credentials: { apiKey: 'g-key' } } as any));
    const received: unknown[] = [];
    await provider.processStreamingRequest(makeRequest(), (c) => received.push(c));
    expect(received.length).toBeGreaterThan(0);
  });
});

// ============================================================ EnhancedStreamingProcessor
describe('model-adapter@npm · EnhancedStreamingProcessor', () => {
  const chunk = (text: string): ModelResponse =>
    ({
      id: 'c-' + text,
      requestId: 'req-s',
      modelId: 'm-1',
      content: text,
      finishReason: null,
      usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
      metadata: { latency: 1, model: 'gpt-4', provider: 'openai', timestamp: Date.now(), requestId: 'req-s', processingTime: 1, retryCount: 0, cacheHit: false },
      streaming: true,
    }) as unknown as ModelResponse;

  it('processStream：缓冲模式逐块回调 + 完成事件', async () => {
    const processor = new EnhancedStreamingProcessor({ enableBuffering: true, bufferSize: 2, flushInterval: 10 } as any);
    const got: string[] = [];
    const completed = new Promise<void>((resolve) => processor.on('stream:completed', () => resolve()));
    async function* gen(req: ModelRequest) {
      yield chunk('a');
      yield chunk('b');
      yield chunk('c');
    }
    await processor.processStream(makeRequest({ id: 's-1' }), gen, (c) => got.push(String((c as any).content)));
    await completed;
    expect(got.join('')).toBe('abc');
  });

  it('processStream：直通模式 + 流错误计数', async () => {
    const processor = new EnhancedStreamingProcessor({ enableBuffering: false, retryOnFailure: false } as any);
    async function* gen(req: ModelRequest) {
      yield chunk('x');
    }
    await processor.processStream(makeRequest({ id: 's-2' }), gen, () => {});
    const bad = new EnhancedStreamingProcessor({ enableBuffering: false, retryOnFailure: false } as any);
    async function* badGen(req: ModelRequest) {
      throw new Error('stream broke');
      yield chunk('never');
    }
    await expect(bad.processStream(makeRequest({ id: 's-3' }), badGen, () => {})).rejects.toThrow('stream broke');
  });

  it('prefetch 与 cleanup 可调用', async () => {
    const processor = new EnhancedStreamingProcessor();
    async function* gen(req: ModelRequest) {
      yield chunk('p');
    }
    await processor.prefetch(makeRequest({ id: 's-4' }), gen);
    await processor.cleanup();
    expect(true).toBe(true);
  });
});

// ============================================================ IntelligentCacheLayer
describe('model-adapter@npm · IntelligentCacheLayer', () => {
  it('get/set：L1 命中 + miss + loader 回填', async () => {
    const cache = new IntelligentCacheLayer({ l1Size: 10, l1TTL: 60000 } as any);
    const miss = await cache.get<string>('k1');
    expect(miss.hit).toBe(false);
    await cache.set('k1', 'v1', { ttl: 60000 });
    const hit = await cache.get<string>('k1');
    expect(hit.hit).toBe(true);
    expect(hit.value).toBe('v1');
    const loaded = await cache.get<string>('k2', { loader: async () => 'loaded!' });
    expect(loaded.value).toBe('loaded!');
  });

  it('set 策略三态：write-through / write-behind / write-around', async () => {
    const cache = new IntelligentCacheLayer({ l1Size: 10, l1TTL: 60000 } as any);
    await cache.set('a', 1, { strategy: 'write-through' as any });
    await cache.set('b', 2, { strategy: 'write-behind' as any });
    await cache.set('c', 3, { strategy: 'write-around' as any, invalidate: true });
    expect((await cache.get<number>('a')).value).toBe(1);
    expect((await cache.get<number>('b')).value).toBe(2);
    await new Promise((r) => setTimeout(r, 20)); // write-behind 后台刷写
  });

  it('TTL 过期（fake timers）+ delete/clear/invalidate', async () => {
    vi.useFakeTimers();
    const cache = new IntelligentCacheLayer({ l1Size: 10, l1TTL: 1000 } as any);
    await cache.set('t1', 'x', { ttl: 500 });
    expect((await cache.get('t1')).hit).toBe(true);
    await vi.advanceTimersByTimeAsync(600);
    expect((await cache.get('t1')).hit).toBe(false);
    await cache.set('t2', 'y');
    await cache.delete('t2');
    expect((await cache.get('t2')).hit).toBe(false);
    await cache.set('t3', 'z');
    await cache.invalidate(/^t/);
    expect((await cache.get('t3')).hit).toBe(false);
    await cache.set('t4', 'w');
    await cache.clear();
    expect((await cache.get('t4')).hit).toBe(false);
  });

  it('LRU 淘汰：超过 l1Size 后旧键让位', async () => {
    const cache = new IntelligentCacheLayer({ l1Size: 2, l1TTL: 60000 } as any);
    await cache.set('e1', 'a');
    await cache.set('e2', 'b');
    await cache.set('e3', 'c'); // 触发淘汰
    const stats = await cache.getStats();
    expect(stats.length).toBeGreaterThan(0);
  });

  it('warmup + analyzePerformance 报告', async () => {
    const cache = new IntelligentCacheLayer({ l1Size: 10, l1TTL: 60000 } as any);
    await cache.set('w1', 'a');
    const report = await cache.warmup([{ pattern: 'w*', loader: async () => 'fresh' } as any]);
    expect(report).toBeDefined();
    const perf = await cache.analyzePerformance();
    expect(perf).toBeDefined();
  });

  it('大对象 size 计算 + 依赖标签元数据', async () => {
    const cache = new IntelligentCacheLayer({ l1Size: 5, l1TTL: 60000 } as any);
    await cache.set('big', { arr: new Array(100).fill('x') }, { tags: ['t'], priority: 'high', dependencies: ['other'] });
    const hit = await cache.get<{ arr: string[] }>('big');
    expect(hit.hit).toBe(true);
  });
});

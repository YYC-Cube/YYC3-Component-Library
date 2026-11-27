/**
 * @vitest-environment node
 *
 * ============================================================
 * YYC³ · @yyc3/education 批次 2 · AgenticCore LLM 路径（node 环境）
 * ============================================================
 * 自 education-engines.test.ts 拆出（batch2 · 2026-11-27）：
 *  - bug#1/#3 治理后 model-adapter 改依赖 npm 正式版 @yyc3/model-adapter@^1.1.0，
 *    openai SDK 被打进 dist——vi.mock('openai') 拦不到，改 globalThis.fetch 桩；
 *  - SDK 在 jsdom（window 存在）拒绝实例化，本件声明 node 环境；
 *  - 1.1.0 内置 SHA256→SHA-256 WebCrypto 映射（bug#1 修复），digest 别名桩撤除。
 * ============================================================
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AgenticCore, type UserInput, type AgentContext } from '../autonomous-engine/src/core/AgenticCore';

const COMPLETION = (content: string) => ({
  id: 'chatcmpl-test',
  object: 'chat.completion',
  created: Date.now(),
  model: 'gpt-4',
  choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }],
  usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 },
});
const INTENT_JSON = JSON.stringify({
  primaryIntent: 'search',
  entities: [{ type: 'topic', value: 'course', confidence: 0.9 }],
  sentiment: 'neutral',
  complexity: 'medium',
  urgency: 'high',
  confidence: 0.95,
});
const PLAN_JSON = JSON.stringify({
  steps: [
    { description: '检索知识', tool: 'knowledge_search', parameters: {} },
    { id: 'step-x', description: '生成响应', tool: 'response_generator', parameters: {}, status: 'pending' },
  ],
  estimatedDuration: 8000,
  requiredResources: ['gpu'],
  dependencies: [],
});

// REST fetch 桩：按 system prompt 分发意图/计划响应（dist 内联 SDK 走 globalThis.fetch）
const stubLLMRest = (intentContent: string, planContent: string) => {
  const fetchMock = vi.fn().mockImplementation(async (_url: string, init?: RequestInit) => {
    let messages: Array<{ content?: string }> = [];
    try {
      messages = JSON.parse(String(init?.body)).messages ?? [];
    } catch {
      /* 无 body 忽略 */
    }
    const prompt = messages.map((m) => m.content ?? '').join('\n');
    const content = prompt.includes('计划生成') ? planContent : intentContent;
    const body = COMPLETION(content);
    return {
      ok: true,
      status: 200,
      json: async () => body,
      text: async () => JSON.stringify(body),
      headers: new Headers({ 'content-type': 'application/json' }),
    } as unknown as Response;
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

const completionsCalls = (fetchMock: ReturnType<typeof vi.fn>) =>
  fetchMock.mock.calls.filter(([u]) => !String(u).includes('/models')).length;

const makeContext = (): AgentContext => ({
  sessionId: 'sess-1',
  userId: 'user-1',
  environment: 'web',
  permissions: ['read'],
  conversationHistory: [],
  workingMemory: {},
});

const makeInput = (text: string): UserInput => ({ text, context: makeContext() });

describe('education · AgenticCore（modelAdapterConfig + REST fetch 桩 LLM 路径 · node）', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const llmCore = () =>
    new AgenticCore({
      modelAdapterConfig: { openAIModel: 'gpt-4', openAIKey: 'sk-test' },
      logLevel: 'error',
    });

  it('意图+计划双走 LLM：合法 JSON 直达，任务完成闭环', async () => {
    vi.useFakeTimers(); // 先接管计时器（任务步骤 delay 才能被推进）
    const fetchMock = stubLLMRest(INTENT_JSON, PLAN_JSON);
    const core = llmCore(); // fetch 桩必须先于构造——SDK client 构造期捕获 fetch
    await vi.advanceTimersByTimeAsync(60); // 等 setupModelAdapter 浮动初始化
    expect(completionsCalls(fetchMock)).toBe(0); // 尚无补全请求（/models 健康检查不算）
    const resp = await core.processInput(makeInput('帮我找课'));
    expect(resp.taskId).toBeTruthy();
    expect(resp.suggestions).toContain('尝试使用更具体的关键词'); // LLM 意图 search → 建议命中
    await vi.advanceTimersByTimeAsync(6000); // 2 步计划执行完
    const status = core.getSystemStatus();
    expect(status.totalTasksProcessed).toBe(1);
    expect(status.state).toBe('idle');
    expect(completionsCalls(fetchMock)).toBeGreaterThanOrEqual(2); // 意图+计划两次请求
  }, 15000);

  it('意图分析降级链：坏 JSON → simple 分析；字段缺失 → 格式校验降级', async () => {
    const fetchMock = stubLLMRest('这不是 JSON', '坏');
    const core = llmCore();
    await new Promise((r) => setTimeout(r, 50));
    const resp = await core.processInput(makeInput('搜索课程'));
    expect(resp.suggestions).toContain('尝试使用更具体的关键词'); // 降级后仍按关键词识别 search

    stubLLMRest(JSON.stringify({ primaryIntent: 'search' }), '坏'); // 缺字段
    const resp2 = await core.processInput(makeInput('随便聊聊'));
    expect(resp2.taskId).toBeTruthy();
    expect(fetchMock).toHaveBeenCalled();
  }, 15000);

  it('计划生成降级：LLM steps 为空 → 硬编码三步兜底', async () => {
    vi.useFakeTimers();
    stubLLMRest(INTENT_JSON, JSON.stringify({ steps: [] }));
    const core = llmCore();
    await vi.advanceTimersByTimeAsync(60);
    const resp = await core.processInput(makeInput('搜索资料'));
    expect(resp.taskId).toBeTruthy();
    await vi.advanceTimersByTimeAsync(6000);
    expect(core.getSystemStatus().totalTasksProcessed).toBe(1);
  }, 15000);

  it('修复锁定（bug#1 治理 @yyc3/model-adapter@1.1.0）：SHA256 缓存键哈希原生可用——无别名桩 LLM 意图直达不降级', async () => {
    // 前身（批次1 缺陷表征）：内嵌副本 createHash('SHA256') 不被 WebCrypto 认，
    // 真实 webcrypto 下 processRequest 恒失败 → simple 意图降级（suggestions 为空）。
    // 1.1.0 已内置 SHA256→SHA-256 映射 → LLM 意图生效（search 建议命中）。
    const fetchMock = stubLLMRest(INTENT_JSON, PLAN_JSON);
    const core = llmCore();
    await new Promise((r) => setTimeout(r, 50));
    const resp = await core.processInput(makeInput('帮我找课'));
    expect(resp.taskId).toBeTruthy();
    expect(resp.suggestions).toContain('尝试使用更具体的关键词'); // LLM search 意图（未降级）
    expect(completionsCalls(fetchMock)).toBeGreaterThanOrEqual(1);
  }, 15000);
});

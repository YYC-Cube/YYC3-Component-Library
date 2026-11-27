// ============================================================
// YYC³ · @yyc3/education 批次 2 · autonomous-engine 三引擎（jsdom 简单路径）
// AgenticCore（意图分析/计划生成/任务执行/队列/超时清理）
// EnhancedDecisionEngine（传统评估 + AI 评估失败降级 + 学习闭环）
// EnhancedLearningSystem（经验学习/策略适应/能力分级/里程碑/清理）
// —— LLM 路径（modelAdapterConfig）拆至 education-engines-llm.test.ts（node 环境：
//    bug#1/#3 治理后 SDK 内联于 @yyc3/model-adapter dist，jsdom 拒绝实例化）
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { webcrypto } from 'node:crypto';
import { AgenticCore, type UserInput, type AgentContext } from '../autonomous-engine/src/core/AgenticCore';
import {
  EnhancedDecisionEngine,
  type DecisionContext,
  type DecisionOption,
} from '../autonomous-engine/src/core/EnhancedDecisionEngine';
import {
  EnhancedLearningSystem,
  type LearningData,
} from '../autonomous-engine/src/core/EnhancedLearningSystem';

const makeContext = (): AgentContext => ({
  sessionId: 'sess-1',
  userId: 'user-1',
  environment: 'web',
  permissions: ['read'],
  conversationHistory: [],
  workingMemory: {},
});

const makeInput = (text: string): UserInput => ({ text, context: makeContext() });

// ============================================================ AgenticCore
describe('education · AgenticCore（简单意图路径）', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('processInput：搜索意图 → 任务创建/执行/完成闭环 + 系统状态回零', async () => {
    vi.useFakeTimers();
    const core = new AgenticCore({ enableLearning: false });
    const events: string[] = [];
    core.on('task:created', () => events.push('created'));
    core.on('task:completed', () => events.push('completed'));

    const response = await core.processInput(makeInput('搜索机器学习课程'));
    expect(response.taskId).toBeTruthy();
    expect(response.message).toContain('任务已创建');
    expect(response.suggestions).toContain('尝试使用更具体的关键词'); // search 意图建议

    await vi.advanceTimersByTimeAsync(5000); // 3 步 × 1000ms
    expect(events).toEqual(['created', 'completed']);

    const status = core.getSystemStatus();
    expect(status.totalTasksProcessed).toBe(1);
    expect(status.activeTasks).toBe(0);
    expect(status.queuedTasks).toBe(0);
    expect(status.state).toBe('idle');
    expect(status.averageResponseTime).toBeGreaterThan(0);
    expect(core.getTaskStatus(response.taskId)).toBe('completed');
  });

  it('意图关键词矩阵：创建/分析/帮助/默认 + 课程实体提取', async () => {
    vi.useFakeTimers();
    const core = new AgenticCore();
    const createResp = await core.processInput(makeInput('创建一份学习计划'));
    expect(createResp.suggestions).toContain('查看创建指南');
    await vi.advanceTimersByTimeAsync(4000);

    // 课程实体 → entities 包含 topic:course（simple 意图复杂度）
    await core.processInput(makeInput('分析一下我的学习课程'));
    await vi.advanceTimersByTimeAsync(4000);
    await core.processInput(makeInput('如何使用这个功能'));
    await vi.advanceTimersByTimeAsync(4000);
    const general = await core.processInput(makeInput('今天天气不错'));
    expect(general.taskId).toBeTruthy();
    await vi.advanceTimersByTimeAsync(4000);
    expect(core.getSystemStatus().totalTasksProcessed).toBe(4);
  });

  it('并发队列：maxConcurrent=1 时后续任务排队并依次执行', async () => {
    vi.useFakeTimers();
    const core = new AgenticCore({ maxConcurrentTasks: 1, maxQueueSize: 10 });
    const r1 = await core.processInput(makeInput('搜索一'));
    const r2 = await core.processInput(makeInput('搜索二'));
    const mid = core.getSystemStatus();
    expect(mid.activeTasks + mid.queuedTasks).toBe(2);
    await vi.advanceTimersByTimeAsync(8000);
    const done = core.getSystemStatus();
    expect(done.totalTasksProcessed).toBe(2);
    expect(done.activeTasks).toBe(0);
    expect(core.getTaskStatus(r1.taskId)).toBe('completed');
    expect(core.getTaskStatus(r2.taskId)).toBe('completed');
  });

  it('队列满：maxQueueSize=1 时第三个任务拒绝', async () => {
    vi.useFakeTimers();
    const core = new AgenticCore({ maxConcurrentTasks: 1, maxQueueSize: 1 });
    await core.processInput(makeInput('搜索一'));
    await core.processInput(makeInput('搜索二'));
    await expect(core.processInput(makeInput('搜索三'))).rejects.toThrow('Task queue is full');
  });

  it('修复锁定（bug#5）：maxQueueSize=0 / maxConcurrentTasks=0 为合法配置——立即拒绝而非落默认值', async () => {
    // 产品缺陷（已登记已修，2026-11-27 batch2）：`|| 默认值` 吞合法 0——
    // maxQueueSize=0 会被覆盖为 100、maxConcurrentTasks=0 覆盖为 5。
    // `??` 后：0 并发 → 不进 activeTasks；0 队列 → 不进 taskQueue → 直接拒绝。
    vi.useFakeTimers();
    const core = new AgenticCore({ maxConcurrentTasks: 0, maxQueueSize: 0 });
    await expect(core.processInput(makeInput('搜索一'))).rejects.toThrow('Task queue is full');
    expect(core.getSystemStatus().totalTasksProcessed).toBe(0);
  });

  it('超时清理：defaultTimeout 内未完成任务被 interval 标记失败', async () => {
    vi.useFakeTimers();
    const core = new AgenticCore({ maxConcurrentTasks: 1, maxQueueSize: 10, defaultTimeout: 500 });
    const failures: Array<{ error: Error }> = [];
    core.on('task:failed', (_task, error) => failures.push({ error }));
    for (let i = 0; i < 4; i++) {
      await core.processInput(makeInput(`搜索任务${i}`));
    }
    // t1..t3 依次 3s 完成；t4 于 9s 启动 → interval 在 10s 时超时标记
    await vi.advanceTimersByTimeAsync(10500);
    expect(failures.some((f) => f.error.message === 'Task timeout')).toBe(true);
  });

  it('getTaskStatus：未知任务抛错；generate 在无模型时拒绝；嵌入/偏好可用', async () => {
    vi.stubGlobal('crypto', webcrypto);
    vi.useFakeTimers();
    const core = new AgenticCore();
    expect(() => core.getTaskStatus('no-such-task')).toThrow('Task not found');
    await expect(core.generate({ prompt: '写一首诗' })).rejects.toThrow(/No available models/);
    const emb = await core.createEmbedding({ text: '向量化文本' });
    expect(emb.embedding).toHaveLength(384);
    expect(emb.text).toBe('向量化文本');
    await core.updateUserPreferences('user-1', { theme: 'dark' });
    expect(console.log).toHaveBeenCalled();
  });
});

// ============================================================ EnhancedDecisionEngine
describe('education · EnhancedDecisionEngine', () => {
  const makeContext = (): DecisionContext => ({
    goalId: 'goal-1',
    taskId: 'task-1',
    timestamp: new Date(),
    state: {},
    environment: {},
    constraints: {
      maxCost: 100000,
      maxTime: 100000,
      maxResources: { cpu: 8, memory: 16384, storage: 1000, network: 100 },
      securityLevel: 'medium',
      compliance: [],
    },
    preferences: {
      prioritizeSpeed: true,
      prioritizeCost: true,
      prioritizeQuality: true,
      riskTolerance: 'high',
    },
  });

  const makeOption = (overrides: Partial<DecisionOption> = {}): DecisionOption => ({
    id: 'opt-a',
    description: '方案A',
    actions: [{ type: 'search', parameters: {}, dependencies: [] }],
    estimatedCost: 10,
    estimatedTime: 5000,
    resourceRequirements: { cpu: 1, memory: 1024, storage: 10, network: 10 },
    riskLevel: 0.2,
    confidence: 0.9,
    expectedOutcome: {},
    ...overrides,
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('makeDecision：传统评估（无 modelAdapterConfig）选出最优并生成执行计划', async () => {
    const engine = new EnhancedDecisionEngine({ enableAIAssistedDecision: false });
    const result = await engine.makeDecision(makeContext(), [
      makeOption({ id: 'a', estimatedCost: 10, estimatedTime: 1000, riskLevel: 0.1, confidence: 0.95 }),
      makeOption({ id: 'b', estimatedCost: 900, estimatedTime: 90000, riskLevel: 0.9, confidence: 0.3 }),
    ]);
    expect(result.selectedOption.id).toBe('a');
    expect(result.evaluation.optionId).toBe('a');
    expect(result.alternativeOptions).toHaveLength(1);
    expect(result.executionPlan.steps).toHaveLength(1);
    expect(result.executionPlan.resourceAllocation).toHaveLength(1);
    expect(result.executionPlan.dependencies.get(result.executionPlan.steps[0].id)).toEqual([]);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.evaluation.reasoning).toContain('成本效益高');
    expect(result.evaluation.reasoning).toContain('执行速度快');
    expect(result.evaluation.reasoning).toContain('质量可靠');
    expect(result.evaluation.reasoning).toContain('风险可控');
  });

  it('单选项：置信度退化为 overallScore（stdDev=0 分支）', async () => {
    const engine = new EnhancedDecisionEngine({ enableAIAssistedDecision: false });
    const result = await engine.makeDecision(makeContext(), [makeOption({ id: 'only' })]);
    expect(result.confidence).toBe(result.evaluation.overallScore);
  });

  it('maxOptionsToEvaluate 截断候选集', async () => {
    const engine = new EnhancedDecisionEngine({ enableAIAssistedDecision: false, maxOptionsToEvaluate: 1 });
    const result = await engine.makeDecision(makeContext(), [makeOption({ id: 'x' }), makeOption({ id: 'y' })]);
    expect(result.alternativeOptions).toHaveLength(0);
  });

  it('学习闭环：decision:made 入史 → decision:outcome 更新 → 指标/清理', async () => {
    const engine = new EnhancedDecisionEngine({ enableAIAssistedDecision: false, enableLearning: true });
    const learned: unknown[] = [];
    engine.on('decision:learning-updated', (d) => learned.push(d));
    await engine.makeDecision(makeContext(), [makeOption({ id: 'a' })]);
    expect(engine.getDecisionHistory()).toHaveLength(1);
    expect(engine.getPerformanceMetrics('goal-1', 'task-1')).toHaveLength(1);

    engine.emit('decision:outcome', { context: makeContext(), outcome: { score: 1 }, success: true });
    expect(learned).toHaveLength(1);
    expect(engine.getDecisionHistory()[0].success).toBe(true);

    engine.clearHistory();
    expect(engine.getDecisionHistory()).toHaveLength(0);
    expect(engine.getPerformanceMetrics('goal-1', 'task-1')).toHaveLength(0);
  });

  it('enableLearning=false：不入史不学习', async () => {
    const engine = new EnhancedDecisionEngine({ enableAIAssistedDecision: false, enableLearning: false });
    await engine.makeDecision(makeContext(), [makeOption({ id: 'a' })]);
    expect(engine.getDecisionHistory()).toHaveLength(0);
    engine.emit('decision:outcome', { context: makeContext(), outcome: {}, success: true });
    expect(engine.getDecisionHistory()).toHaveLength(0);
  });

  it('start/stop/reconfigure 生命周期 + AI 评估失败降级路径', async () => {
    const started: unknown[] = [];
    const engine = new EnhancedDecisionEngine({ enableAIAssistedDecision: false });
    engine.on('decision:started', (d) => started.push(d));
    await engine.start();
    await engine.start(); // 已 active 早退
    expect(started.length).toBeGreaterThanOrEqual(1);

    // 注入 modelAdapterConfig + 未初始化的 adapter → processRequest 抛错 → 传统方法兜底
    engine.reconfigure({ enableAIAssistedDecision: true, modelAdapterConfig: {} });
    const result = await engine.makeDecision(makeContext(), [makeOption({ id: 'ai' })]);
    expect(result.evaluation.reasoning).toBe('AI评估失败，使用传统方法');

    await engine.stop();
    engine.clearHistory();
  });

  it('决策错误通道：非法 options 让 makeDecision 抛错并 emit decision:error', async () => {
    const errors: unknown[] = [];
    const engine = new EnhancedDecisionEngine({ enableAIAssistedDecision: false });
    engine.on('decision:error', (d) => errors.push(d));
    await expect(
      engine.makeDecision(makeContext(), null as unknown as DecisionOption[])
    ).rejects.toThrow();
    expect(errors).toHaveLength(1);
  });
});

// ============================================================ EnhancedLearningSystem
describe('education · EnhancedLearningSystem', () => {
  const makeExperience = (overrides: Partial<LearningData> = {}): LearningData => ({
    id: 'exp-' + Math.random().toString(36).slice(2, 8),
    type: 'success',
    context: {},
    situation: {
      description: '完成一次学习',
      complexity: 'simple',
      uncertainty: 'low',
      novelty: 'familiar',
      criticality: 'medium',
    },
    actions: [{ id: 'a1', type: 'search', description: '检索', parameters: {}, reasoning: '找资料' }],
    outcomes: [
      { id: 'o1', type: 'quality', value: 0.9, quality: 'excellent', duration: 100, resourceUsage: {} },
    ],
    feedback: {
      source: 'user',
      type: 'rating',
      content: '很有帮助',
      sentiment: 'very_positive',
      confidence: 0.9,
      actionability: 'short_term',
    },
    timestamp: new Date(),
    metadata: {
      tags: ['t1'],
      category: 'learning',
      importance: 'high',
      applicability: ['general', 'optimization', 'collaboration'],
      sharingConsent: true,
    },
    ...overrides,
  });

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('learnFromExperience：成功经验提升全域能力 → expert 级 + 里程碑', async () => {
    const system = new EnhancedLearningSystem({ learningRate: 2 });
    const completed: unknown[] = [];
    system.on('learning:completed', (d) => completed.push(d));
    await system.learnFromExperience(makeExperience());
    expect(completed).toHaveLength(1);
    const progress = system.getProgress();
    expect(progress.totalExperiences).toBe(1);
    expect(progress.successfulAdaptations).toBeGreaterThanOrEqual(1);
    expect(progress.competencyLevel).toBe('expert');
    expect(progress.nextMilestones.length).toBeGreaterThan(0);
    expect(progress.recentInsights).toHaveLength(1);
    expect(progress.areasOfImprovement).toEqual(['advanced_optimization', 'cross_domain_integration']);
  });

  it('修复锁定（bug#2）：very_negative 权重 0 生效——失败经验能力真实下降 + 未知领域跳过', async () => {
    // 产品缺陷（已登记已修，2026-11-27 batch2）：权重查表 `[map][sentiment] || 0.5`
    // 把 very_negative 的合法权重 0 吞成 0.5 → 失败经验冲击恒为正，能力永不下降。
    // `??` 后冲击 = (-0.5+0.25+0)/3 ≈ -0.083 → competency 下降。
    const system = new EnhancedLearningSystem({ learningRate: 2 });
    const failure = makeExperience({
      type: 'failure',
      situation: { description: '失败', complexity: 'complex', uncertainty: 'high', novelty: 'familiar', criticality: 'critical' },
      outcomes: [{ id: 'o', type: 'error', value: null, quality: 'poor', duration: 10, resourceUsage: {} }],
      feedback: {
        source: 'system',
        type: 'error',
        content: '失败了',
        sentiment: 'very_negative',
        confidence: 1,
        actionability: 'immediate',
      },
      metadata: {
        tags: [],
        category: 'c',
        importance: 'low',
        applicability: ['general', 'no-such-domain'],
        sharingConsent: false,
      },
    });
    const before = system.getKnowledgeDomain('general')!.competency;
    await system.learnFromExperience(failure);
    const general = system.getKnowledgeDomain('general')!;
    expect(general.competency).toBeLessThan(before); // 修复锁定：失败经验能力下降
    expect(system.getProgress().failedAdaptations).toBe(1);
    expect(system.getKnowledgeDomain('no-such-domain')).toBeUndefined();
    expect(system.getAllKnowledgeDomains()).toHaveLength(3);
  });

  it('修复锁定（bug#2）：negative 权重 0.25 生效——failure+poor 下冲击恰为 0（能力不动）', async () => {
    // negative=0.25：冲击 = (-0.5+0.25+0.25)/3 = 0 → competency 恒为 0.5；
    // 缺陷态（吞成 0.5）冲击 = +0.083×learningRate → 必然上升。以「不动」锁权重生效。
    const system = new EnhancedLearningSystem({ learningRate: 2 });
    const negative = makeExperience({
      type: 'failure',
      outcomes: [{ id: 'o', type: 'error', value: null, quality: 'poor', duration: 10, resourceUsage: {} }],
      feedback: {
        source: 'system', type: 'error', content: '不满意',
        sentiment: 'negative', confidence: 1, actionability: 'immediate',
      },
    });
    await system.learnFromExperience(negative);
    expect(system.getKnowledgeDomain('general')!.competency).toBeCloseTo(0.5, 10);
  });

  it('模式提取：同签名经验归并 frequency 递增', async () => {
    const system = new EnhancedLearningSystem({ learningRate: 1 });
    await system.learnFromExperience(makeExperience());
    await system.learnFromExperience(makeExperience());
    const general = system.getKnowledgeDomain('general')!;
    expect(general.patterns).toHaveLength(1);
    expect(general.patterns[0].frequency).toBe(2);
  });

  it('adaptStrategy：新建/更新/禁用三分支 + 领域查询排序', async () => {
    const system = new EnhancedLearningSystem({ learningRate: 1 });
    const adapted: unknown[] = [];
    system.on('strategy:adapted', (d) => adapted.push(d));
    await system.adaptStrategy({ name: '快检索', domain: 'general', effectiveness: 0.8, confidence: 0.7 });
    expect(adapted).toHaveLength(1);
    const created = system.getStrategiesByDomain('general')[0];
    expect(created.name).toBe('快检索');
    expect(created.usageCount).toBe(0);

    await system.adaptStrategy({ id: created.id, name: '更快检索', effectiveness: 0.9 });
    expect(system.getStrategy(created.id)!.name).toBe('更快检索');

    await system.adaptStrategy({ domain: 'optimization', effectiveness: 0.5 });
    const best = system.getBestStrategy('general');
    expect(best!.domain).toBe('general');

    const disabled = new EnhancedLearningSystem({ enableLearning: false });
    await disabled.adaptStrategy({ name: '不会创建' });
    expect(disabled.getStrategiesByDomain('general')).toHaveLength(0);
  });

  it('successRate 阈值：成功经验计入 successfulAdaptations，失败计入 failed', async () => {
    const system = new EnhancedLearningSystem({ learningRate: 1, adaptationThreshold: 0.99 });
    await system.learnFromExperience(makeExperience()); // success 但 successRate=1 ≥ 0.99
    expect(system.getProgress().successfulAdaptations).toBeGreaterThanOrEqual(1);
    const failSystem = new EnhancedLearningSystem({ learningRate: 1 });
    await failSystem.learnFromExperience(
      makeExperience({ type: 'failure', feedback: { ...makeExperience().feedback, sentiment: 'negative' } })
    );
    expect(failSystem.getProgress().failedAdaptations).toBeGreaterThanOrEqual(1);
  });

  it('recordPerformanceMetric：统计聚合 + 超容量 shift + 未知指标 undefined', () => {
    const system = new EnhancedLearningSystem();
    system.recordPerformanceMetric('latency', 10);
    system.recordPerformanceMetric('latency', 30);
    const stat = system.getPerformanceMetric('latency')!;
    expect(stat).toEqual({ average: 20, min: 10, max: 30, count: 2 });
    for (let i = 0; i < 1005; i++) system.recordPerformanceMetric('bulk', i);
    expect(system.getPerformanceMetric('bulk')!.count).toBeLessThanOrEqual(1000);
    expect(system.getPerformanceMetric('unknown')).toBeUndefined();
  });

  it('start/stop 幂等 + shutdown 清空 + reconfigure 注入 adapterConfig', async () => {
    const system = new EnhancedLearningSystem();
    const started: unknown[] = [];
    system.on('system.started', (d) => started.push(d));
    await system.start();
    await system.start(); // active 早退
    expect(started).toHaveLength(1);
    await system.stop();
    await system.stop(); // stopped 早退
    await system.learnFromExperience(makeExperience());
    await system.shutdown();
    expect(system.getAllKnowledgeDomains()).toHaveLength(0);
    // 修复锁定（bug#8，2026-11-27 batch2）：shutdown 同步清零 totalExperiences 等计数器
    expect(system.getProgress().totalExperiences).toBe(0);
    expect(system.getProgress().successfulAdaptations).toBe(0);
    expect(system.getProgress().failedAdaptations).toBe(0);

    // reconfigure 注入 adapterConfig（无 apiKey → 不走 addModel/SDK，jsdom 安全）
    const withAdapter = new EnhancedLearningSystem();
    await withAdapter.reconfigure({ modelAdapterConfig: { provider: 'openai' } });
    await new Promise((r) => setTimeout(r, 20));
  });

  it('经验清理任务：保留期外的记录被 24h 定时器清除（recentInsights 归零）', async () => {
    vi.useFakeTimers();
    const system = new EnhancedLearningSystem({ experienceRetention: 1000 });
    const old = makeExperience();
    old.timestamp = new Date(Date.now() - 5000); // 早于保留期
    await system.learnFromExperience(old);
    expect(system.getProgress().recentInsights).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(24 * 60 * 60 * 1000 + 100);
    expect(system.getProgress().recentInsights).toHaveLength(0);
  });

  it('enableLearning=false：learnFromExperience 直接早退', async () => {
    const system = new EnhancedLearningSystem({ enableLearning: false });
    await system.learnFromExperience(makeExperience());
    expect(system.getProgress().totalExperiences).toBe(0);
  });
});

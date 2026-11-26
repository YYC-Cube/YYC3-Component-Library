// ============================================================
// YYC³ · @yyc3/lib adapters/industry 覆盖率补测（batch1 弱区：4.16%）
// 覆盖对象：registerIndustryConfigs / getIndustryConfig / getAllIndustries /
//           generateIndustryMetrics / getIndustryHighScores / getIndustryStandards
// 约定：import 一律走 '../index' 桶；registry 为模块级单例——重复注册抛错，
//       故本文件只注册一次、断言相对数量，不依赖全局注册表清空。
// ============================================================
import { describe, it, expect } from 'vitest';
import {
  registerIndustryConfigs,
  getIndustryConfig,
  getAllIndustries,
  generateIndustryMetrics,
  getIndustryHighScores,
  getIndustryStandards,
} from '../index';
import type { IndustryConfig } from '../index';

// 完整 IndustryConfig 夹具（五高五标全字段）
const makeConfig = (overrides: Partial<IndustryConfig> = {}): IndustryConfig => ({
  id: 'yyc3-edu',
  code: 'P-EDU',
  name: '智能教育',
  icon: '🎓',
  description: '教育行业适配配置',
  primaryColor: '#3b82f6',
  metrics: [
    {
      id: 'concurrency',
      name: '并发数',
      unit: '路',
      normalRange: [10, 20],
      criticalThreshold: 25,
      icon: '📊',
      category: 'performance',
    },
    {
      id: 'error_rate',
      name: '错误率',
      unit: '%',
      normalRange: [0, 5],
      criticalThreshold: 8,
      icon: '⚠️',
      category: 'operations',
    },
  ],
  dashboardLayout: {
    widgets: [{ id: 'w1', type: 'chart', position: { x: 0, y: 0, w: 4, h: 2 }, config: {} }],
    refreshInterval: 30,
    alertPriority: ['critical', 'warning'],
  },
  aiModels: [{ id: 'm1', name: '预测模型', type: 'prediction', enabled: true, parameters: {} }],
  highPerformance: { maxThroughput: 50000, targetLatency: 200, cacheStrategy: 'moderate' },
  highAvailability: { targetUptime: 99.9, failoverTime: 30, backupStrategy: 'realtime' },
  highSecurity: { encryptionLevel: 'advanced', authMethod: 'mfa', complianceStandards: ['GDPR'] },
  highIntelligence: { aiCapabilities: ['预测'], predictionAccuracy: 0.92, autoDecisionLevel: 'suggest' },
  highEfficiency: { automationLevel: 70, resourceOptimization: true, costReductionTarget: 20 },
  standards: {
    apiVersion: 'v1',
    dataFormat: 'json',
    monitoringProtocol: 'prometheus',
    serviceLevel: 'gold',
  },
  ...overrides,
});

// 模块加载即注册一个基础行业（单例表全局仅此文件写入，断言用相对计数）
registerIndustryConfigs({ 'yyc3-edu': makeConfig() });
const baseCount = getAllIndustries().length;

describe('adapters/industry · registerIndustryConfigs', () => {
  it('注册后可查询：getIndustryConfig 返回同引用，getAllIndustries 含该配置', () => {
    const config = getIndustryConfig('yyc3-edu');
    expect(config.id).toBe('yyc3-edu');
    expect(config.name).toBe('智能教育');
    expect(getAllIndustries()).toContainEqual(config);
  });

  it('新增行业注册使列表数量 +1', () => {
    registerIndustryConfigs({ 'yyc3-med': makeConfig({ id: 'yyc3-med', name: '医疗健康' }) });
    expect(getAllIndustries()).toHaveLength(baseCount + 1);
    expect(getIndustryConfig('yyc3-med').name).toBe('医疗健康');
  });

  it('值为 undefined 的键被跳过（continue 分支），不进入注册表也不抛错', () => {
    expect(() =>
      registerIndustryConfigs({ 'yyc3-agr': undefined } as Record<string, never> as never),
    ).not.toThrow();
    expect(getAllIndustries()).toHaveLength(baseCount + 1);
  });

  it('同 id 重复注册抛错（接线缺陷显式暴露）', () => {
    expect(() => registerIndustryConfigs({ 'yyc3-edu': makeConfig() })).toThrow(
      '[yyc3] Industry config duplicated on register: yyc3-edu',
    );
  });
});

describe('adapters/industry · getIndustryConfig', () => {
  it('未注册行业抛错（与 99 区「静默回退 yyc3-dc」不同，见 @Diff）', () => {
    expect(() => getIndustryConfig('yyc3-dc')).toThrow(
      '[yyc3] Industry config not registered: yyc3-dc',
    );
  });
});

describe('adapters/industry · generateIndustryMetrics', () => {
  it('按 metrics 生成指标，值落在 normalRange 区间内', () => {
    const metrics = generateIndustryMetrics('yyc3-edu');

    expect(Object.keys(metrics).sort()).toEqual(['concurrency', 'error_rate']);
    expect(metrics.concurrency).toBeGreaterThanOrEqual(10);
    expect(metrics.concurrency).toBeLessThanOrEqual(19); // Math.floor → max 不可达
    expect(Number.isInteger(metrics.concurrency)).toBe(true);
    expect(metrics.error_rate).toBeGreaterThanOrEqual(0);
    expect(metrics.error_rate).toBeLessThanOrEqual(4);
  });

  it('未注册行业抛错', () => {
    expect(() => generateIndustryMetrics('yyc3-fn')).toThrow(
      '[yyc3] Industry config not registered: yyc3-fn',
    );
  });
});

describe('adapters/industry · getIndustryHighScores', () => {
  it('advanced 加密档：五高评分按公式计算', () => {
    const scores = getIndustryHighScores('yyc3-edu');

    expect(scores.performance).toBe(50); // round(50000/100000*100)
    expect(scores.availability).toBe(99.9);
    expect(scores.security).toBe(95); // advanced → 95
    expect(scores.intelligence).toBe(92); // round(0.92*100)
    expect(scores.efficiency).toBe(70);
  });

  it('standard 加密档评分 80', () => {
    registerIndustryConfigs({
      'yyc3-retail': makeConfig({
        id: 'yyc3-retail',
        highSecurity: { encryptionLevel: 'standard', authMethod: 'basic', complianceStandards: [] },
      }),
    });
    expect(getIndustryHighScores('yyc3-retail').security).toBe(80);
  });

  it('basic 加密档评分 65', () => {
    registerIndustryConfigs({
      'yyc3-gov': makeConfig({
        id: 'yyc3-gov',
        highSecurity: { encryptionLevel: 'basic', authMethod: 'basic', complianceStandards: [] },
      }),
    });
    expect(getIndustryHighScores('yyc3-gov').security).toBe(65);
  });

  it('未注册行业抛错', () => {
    expect(() => getIndustryHighScores('yyc3-fb')).toThrow(
      '[yyc3] Industry config not registered: yyc3-fb',
    );
  });
});

describe('adapters/industry · getIndustryStandards', () => {
  it('返回五标配置原引用', () => {
    const config = getIndustryConfig('yyc3-edu');
    expect(getIndustryStandards('yyc3-edu')).toEqual(config.standards);
    expect(getIndustryStandards('yyc3-edu').serviceLevel).toBe('gold');
  });

  it('未注册行业抛错', () => {
    expect(() => getIndustryStandards('yyc3-hr')).toThrow(
      '[yyc3] Industry config not registered: yyc3-hr',
    );
  });
});

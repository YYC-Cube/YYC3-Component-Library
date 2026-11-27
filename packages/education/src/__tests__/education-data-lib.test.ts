// ============================================================
// YYC³ · @yyc3/education 批次 1 铁律门补测 · 第一层
// 数据题库（6 文件全导出 + 检索/组卷函数）+ 行业适配 + deepseek 主题
// + lib 四件（logger / error-handler / performance.config / performance-monitor）
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  courseModules,
  getCourseRecommendations,
  getLearningPath,
} from '../data/course-recommendations';
import {
  definitionQuestions,
  comparisonQuestions,
  applicationQuestions,
  getAllAdvancedQuestions,
  generateAdvancedExamPaper,
} from '../data/advanced-exam-questions';
import {
  modelClassificationQuestions,
  extendedSingleChoiceQuestions,
  extendedMultipleChoiceQuestions,
  extendedEssayQuestions,
  getAllComprehensiveQuestions,
  getQuestionsByClassification,
  generateClassificationExam,
  generateComprehensiveExam,
} from '../data/comprehensive-exam-questions';
import { examData, getAllExams, getExamById } from '../data/exam-data';
import examDataDefault from '../data/exam-data';
import {
  singleChoiceQuestions,
  multipleChoiceQuestions,
  essayQuestions,
  getAllQuestions,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
  generateExamPaper,
} from '../data/exam-questions';
import {
  technicalFoundationQuestions,
  coreTechDepthQuestions,
  multimodalQuestions,
  rlhfQuestions,
  getAllProfessionalAdvancedQuestions,
  getQuestionsByCategory as getProfByCategory,
  getQuestionsByDifficulty as getProfByDifficulty,
  generateProfessionalExamPaper,
} from '../data/professional-advanced-questions';
import { EDUCATION_INDUSTRY_CONFIGS } from '../adapters/industry';
import { deepseekThemes } from '../deepseek-themes';
import { Logger, LogLevel, createLogger, logger } from '../lib/logger';
import { logError, getUserMessage, isNetworkError } from '../lib/error-handler.client';
import {
  PERFORMANCE_THRESHOLDS,
  PERFORMANCE_MEASUREMENT_POINTS,
  evaluatePerformanceMetric,
  generatePerformanceReport,
  formatPerformanceReport,
} from '../lib/performance.config';
import performanceMonitor, { usePerformanceMonitor } from '../lib/performance-monitor';

// PerformanceMonitor 类为模块私有（仅导出单例/default）——经单例构造器实例化以便按用例传 options
const newMonitor = (options: Record<string, unknown> = {}): any =>
  new (Object.getPrototypeOf(performanceMonitor).constructor as any)(options);

// ============================================================ 数据层
describe('education · 数据题库', () => {
  it('exam-questions：三类题数组非空且 getAllQuestions 汇合', () => {
    expect(singleChoiceQuestions.length).toBeGreaterThan(0);
    expect(multipleChoiceQuestions.length).toBeGreaterThan(0);
    expect(essayQuestions.length).toBeGreaterThan(0);
    expect(getAllQuestions()).toHaveLength(
      singleChoiceQuestions.length + multipleChoiceQuestions.length + essayQuestions.length
    );
  });

  it('exam-questions：分类/难度过滤 + 组卷（含 difficulty/categories 过滤）', () => {
    const anyCategory = getAllQuestions()[0].category;
    expect(getQuestionsByCategory(anyCategory).every((q) => q.category === anyCategory)).toBe(true);
    const anyDifficulty = getAllQuestions()[0].difficulty;
    expect(getQuestionsByDifficulty(anyDifficulty).every((q) => q.difficulty === anyDifficulty)).toBe(true);

    const paper = generateExamPaper({ singleCount: 2, multipleCount: 1, essayCount: 1 });
    expect(paper.filter((q) => q.type === 'single')).toHaveLength(2);
    expect(paper.filter((q) => q.type === 'multiple')).toHaveLength(1);
    expect(paper.filter((q) => q.type === 'essay')).toHaveLength(1);

    const filtered = generateExamPaper({
      singleCount: 5,
      multipleCount: 0,
      essayCount: 0,
      difficulty: anyDifficulty,
      categories: [anyCategory],
    });
    expect(filtered.every((q) => q.difficulty === anyDifficulty && q.category === anyCategory)).toBe(true);
  });

  it('advanced-exam-questions：三段题库 + 汇合 + 组卷（含难度过滤）', () => {
    expect(definitionQuestions.length + comparisonQuestions.length + applicationQuestions.length).toBe(
      getAllAdvancedQuestions().length
    );
    const withDifficulty = generateAdvancedExamPaper({
      definitionCount: 1,
      comparisonCount: 1,
      applicationCount: 1,
      difficulty: definitionQuestions[0].difficulty,
    });
    expect(withDifficulty.every((q) => q.difficulty === definitionQuestions[0].difficulty)).toBe(true);
    const plain = generateAdvancedExamPaper({ definitionCount: 2, comparisonCount: 2, applicationCount: 2 });
    expect(plain).toHaveLength(6);
  });

  it('comprehensive-exam-questions：四段题库 + 分类过滤 + 分类/综合组卷', () => {
    expect(getAllComprehensiveQuestions().length).toBe(
      modelClassificationQuestions.length +
        extendedSingleChoiceQuestions.length +
        extendedMultipleChoiceQuestions.length +
        extendedEssayQuestions.length
    );
    const anyCat = modelClassificationQuestions[0].category;
    const byCat = getQuestionsByClassification(anyCat);
    expect(byCat.length).toBeGreaterThan(0);
    expect(byCat.every((q) => q.category.includes(anyCat))).toBe(true);

    const exam = generateClassificationExam({
      classifications: [anyCat],
      questionTypes: [],
      difficulty: [],
      questionCount: 3,
    });
    expect(exam.length).toBeLessThanOrEqual(3);
    expect(exam.every((q) => q.category.includes(anyCat))).toBe(true);

    const comprehensive = generateComprehensiveExam({ topics: [], questionTypes: [], difficulty: [], questionCount: 5 });
    expect(comprehensive.length).toBeLessThanOrEqual(5);
  });

  it('professional-advanced-questions：四段题库 + 类别/难度过滤 + 组卷（系统设计开关）', () => {
    const all = getAllProfessionalAdvancedQuestions();
    expect(all.length).toBe(
      technicalFoundationQuestions.length +
        coreTechDepthQuestions.length +
        multimodalQuestions.length +
        rlhfQuestions.length
    );
    const cat = all[0].category;
    expect(getProfByCategory(cat).every((q) => q.category === cat)).toBe(true);
    const diff = all[0].difficulty;
    expect(getProfByDifficulty(diff).every((q) => q.difficulty === diff)).toBe(true);

    const paper = generateProfessionalExamPaper({
      categories: [cat],
      difficultyRange: [1, 5],
      questionCount: 4,
      includeSystemDesign: false,
    });
    expect(paper.every((q) => q.category === cat && q.type !== 'system-design')).toBe(true);
    const paperWithDesign = generateProfessionalExamPaper({
      categories: [],
      difficultyRange: [1, 5],
      questionCount: 6,
      includeSystemDesign: true,
    });
    expect(paperWithDesign.length).toBeLessThanOrEqual(6);
  });

  it('exam-data：getAllExams/getExamById/default 导出同源', () => {
    expect(getAllExams()).toBe(examData);
    expect(examDataDefault).toBe(examData);
    expect(examData.length).toBeGreaterThan(0);
    expect(getExamById(examData[0].id)).toBe(examData[0]);
    expect(getExamById('no-such-exam')).toBeUndefined();
  });

  it('course-recommendations：按 id 检索 + 学习路径切片 + 未知/逆序路径空数组', () => {
    const first = courseModules[0];
    expect(getCourseRecommendations(first.id)).toBe(first);
    expect(getCourseRecommendations('no-such-course')).toBeNull();

    const path = getLearningPath('初级', '高级');
    expect(path.length).toBeGreaterThan(0);
    expect(path.every((c) => ['中级', '高级'].includes(c.level))).toBe(true);
    expect(getLearningPath('未知级', '高级')).toEqual([]);
    expect(getLearningPath('高级', '初级')).toEqual([]);
  });

  it('industry 适配：yyc3-edu 注册表结构完整（经由 @yyc3/lib 类型）', () => {
    const edu = EDUCATION_INDUSTRY_CONFIGS['yyc3-edu'];
    expect(edu.id).toBe('yyc3-edu');
    expect(edu.code).toBe('EDU');
    expect(edu.metrics.length).toBeGreaterThanOrEqual(4);
    expect(edu.metrics[0].criticalThreshold).toBeLessThanOrEqual(edu.metrics[0].normalRange[0]);
  });

  it('deepseekThemes：五套主题字段齐全', () => {
    const keys = Object.keys(deepseekThemes);
    expect(keys.length).toBeGreaterThanOrEqual(5);
    for (const key of keys) {
      const theme = deepseekThemes[key as keyof typeof deepseekThemes];
      expect(theme.gradient).toBeTruthy();
      expect(theme.primary).toMatch(/^#/);
    }
  });
});

// ============================================================ lib 层
describe('education · lib/logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('级别过滤：低于阈值的级别不输出（debug/info 走 console.warn，error 走 console.error）', () => {
    const log = new Logger({ level: LogLevel.WARN, enableTimestamp: false });
    log.debug('debug 消息');
    log.info('info 消息');
    expect(console.warn).not.toHaveBeenCalled();
    log.warn('warn 消息');
    log.error('error 消息');
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('格式化：时间戳/上下文/数据片段按配置拼装', () => {
    const log = new Logger({ level: LogLevel.DEBUG, enableTimestamp: true, context: '测试域' });
    log.info('hello', { k: 1 });
    const call = (console.warn as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(call).toContain('[测试域]');
    expect(call).toContain('INFO: hello');
    expect(call).toContain('{"k":1}');
    expect(call).toMatch(/\[\d{4}-\d{2}-\d{2}T/);
  });

  it('无时间戳/无上下文/无数据的极简格式 + setContext/setLevel 生效', () => {
    const log = new Logger({ enableTimestamp: false });
    log.setLevel(LogLevel.DEBUG);
    log.debug('bare');
    expect((console.warn as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe('DEBUG: bare');
    log.setContext('新域');
    log.debug('ctx');
    expect((console.warn as ReturnType<typeof vi.fn>).mock.calls[1][0]).toContain('[新域]');
  });

  it('createLogger 工厂与全局 logger 单例可用', () => {
    expect(createLogger('工厂')).toBeInstanceOf(Logger);
    expect(logger).toBeInstanceOf(Logger);
  });
});

describe('education · lib/error-handler.client', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('logError：Error 携带 name/message/stack，非 Error 原样透传', () => {
    logError('出错了', new TypeError('类型坏'), { extra: 1 });
    const logged = (console.error as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(logged).toContain('ERROR: 出错了');
    expect(logged).toContain('"name":"TypeError"');
    expect(logged).toContain('"message":"类型坏"');
    expect(logged).toContain('"stack"');
    expect(logged).toContain('"context":{"extra":1}');

    logError('裸对象', { code: 42 });
    expect((console.error as ReturnType<typeof vi.fn>).mock.calls[1][0]).toContain('"code":42');
  });

  it('getUserMessage：Error/string/message 对象/未知四分支', () => {
    expect(getUserMessage(new Error('标准错误'))).toBe('标准错误');
    expect(getUserMessage('字符串错误')).toBe('字符串错误');
    expect(getUserMessage({ message: '对象错误' })).toBe('对象错误');
    expect(getUserMessage(12345)).toBe('发生了未知错误，请稍后重试');
  });

  it('isNetworkError：TypeError 名/网络消息/含 fetch/普通错误四分支', () => {
    expect(isNetworkError(new TypeError('Failed to fetch'))).toBe(true);
    expect(isNetworkError(new Error('Network request failed'))).toBe(true);
    expect(isNetworkError(new Error('fetch interrupted'))).toBe(true);
    expect(isNetworkError(new Error('普通错误'))).toBe(false);
    expect(isNetworkError('不是错误对象')).toBe(false);
  });
});

describe('education · lib/performance.config', () => {
  it('evaluatePerformanceMetric：关键指标 pass/fail', () => {
    const pass = evaluatePerformanceMetric('componentRenderTime', 30);
    expect(pass.status).toBe('pass');
    const fail = evaluatePerformanceMetric('componentRenderTime', 50);
    expect(fail.status).toBe('fail');
    expect(fail.unit).toBe('ms');
  });

  it('evaluatePerformanceMetric：非关键指标 pass/warning/fail 三态', () => {
    expect(evaluatePerformanceMetric('cacheHitRate', 95).status).toBe('pass');
    expect(evaluatePerformanceMetric('cacheHitRate', 85).status).toBe('warning'); // ≥80% 阈值
    expect(evaluatePerformanceMetric('cacheHitRate', 10).status).toBe('fail');
  });

  it('未知指标抛错', () => {
    expect(() => evaluatePerformanceMetric('no-such-metric', 1)).toThrow('Unknown performance metric');
  });

  it('generatePerformanceReport：评分 + 失败/警告建议生成', () => {
    const report = generatePerformanceReport([
      evaluatePerformanceMetric('componentRenderTime', 30),
      evaluatePerformanceMetric('componentRenderTime', 999),
      evaluatePerformanceMetric('cacheHitRate', 85),
    ]);
    expect(report.overallScore).toBe(33); // 1/3 pass
    expect(report.recommendations.some((r) => r.includes('⚠️') && r.includes('componentRenderTime'))).toBe(true);
    expect(report.recommendations.some((r) => r.includes('⚡') && r.includes('cacheHitRate'))).toBe(true);
    expect(report.metrics).toHaveLength(3);
  });

  it('formatPerformanceReport：人类可读报告包含评分与建议', () => {
    const report = generatePerformanceReport([
      evaluatePerformanceMetric('componentRenderTime', 999),
    ]);
    const text = formatPerformanceReport(report);
    expect(text).toContain('性能测试报告');
    expect(text).toContain('0/100');
    expect(text).toContain('❌');
    expect(text).toContain('优化建议');
  });

  it('阈值与测量点常量表完整', () => {
    expect(PERFORMANCE_THRESHOLDS.length).toBeGreaterThanOrEqual(10);
    expect(PERFORMANCE_MEASUREMENT_POINTS.length).toBeGreaterThanOrEqual(4);
  });
});

describe('education · lib/performance-monitor', () => {
  // 真 PerformanceObserver 对 measure 异步回调会在任意 measure 上抛 Unknown metric —— 以可控桩替代
  const observers: Array<{ cb: (list: { getEntries: () => unknown[] }) => void; observe: ReturnType<typeof vi.fn> }> = [];
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    observers.length = 0;
    vi.stubGlobal(
      'PerformanceObserver',
      class {
        cb: (list: { getEntries: () => unknown[] }) => void;
        observe = vi.fn();
        disconnect = vi.fn();
        constructor(cb: (list: { getEntries: () => unknown[] }) => void) {
          this.cb = cb;
          observers.push(this);
        }
      }
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('initialize：幂等二次调用告警 + PerformanceObserver 观察 measure 回调着色', () => {
    const monitor = newMonitor({ enableConsoleLog: true });
    monitor.initialize();
    monitor.initialize(); // 已初始化 → warn
    const warns = (console.warn as ReturnType<typeof vi.fn>).mock.calls.map((c) => String(c[0]));
    expect(warns.some((w) => w.includes('already initialized'))).toBe(true);
    expect(warns.some((w) => w.includes('PerformanceMonitor initialized'))).toBe(true);

    // observer 回调：measure 条目 → recordMetric；其他 entryType 跳过
    const obs = observers[0];
    obs.cb({ getEntries: () => [{ entryType: 'measure', name: 'componentRenderTime', duration: 20 }] });
    obs.cb({ getEntries: () => [{ entryType: 'paint', name: 'first-paint' }] });
    expect(monitor.getMetrics().some((m) => m.name === 'componentRenderTime')).toBe(true);
    expect(obs.observe).toHaveBeenCalledWith({ entryTypes: ['measure'] });
  });

  it('recordMetric：合法指标入表并按阈值着色输出', () => {
    const monitor = newMonitor({ enableConsoleLog: true });
    monitor.initialize();
    monitor.recordMetric('componentRenderTime', 20); // pass ✅
    monitor.recordMetric('componentRenderTime', 999); // fail ❌
    const icons = (console.warn as ReturnType<typeof vi.fn>).mock.calls.map((c) => String(c[0]));
    expect(icons.some((i) => i.includes('✅'))).toBe(true);
    expect(icons.some((i) => i.includes('❌'))).toBe(true);
    const names = monitor.getMetrics().map((m) => m.name);
    expect(names).toContain('componentRenderTime');
  });

  it('measureComponentRender：mark/measure 链路并记录 componentRenderTime', () => {
    const monitor = newMonitor({ enableConsoleLog: false });
    monitor.initialize();
    monitor.measureComponentRender('测试组件', () => {
      /* 同步空渲染 */
    });
    expect(monitor.getMetrics().some((m) => m.name === 'componentRenderTime')).toBe(true);
  });

  it('measureDatabaseQuery / measureApiCall：成功记录耗时，失败清理后重抛', async () => {
    const monitor = newMonitor();
    monitor.initialize();
    await monitor.measureDatabaseQuery('db1', async () => 'ok');
    await monitor.measureApiCall('api1', async () => 'ok');
    expect(monitor.getMetrics().some((m) => m.name === 'databaseQueryTime')).toBe(true);
    expect(monitor.getMetrics().some((m) => m.name === 'apiResponseTime')).toBe(true);
    await expect(monitor.measureDatabaseQuery('db2', async () => { throw new Error('db boom'); })).rejects.toThrow('db boom');
    await expect(monitor.measureApiCall('api2', async () => { throw new Error('api boom'); })).rejects.toThrow('api boom');
  });

  it('recordCacheHitRate：0 总数归 0，正常计算百分比', () => {
    const monitor = newMonitor();
    monitor.initialize();
    monitor.recordCacheHitRate(0, 0);
    monitor.recordCacheHitRate(90, 100);
    const hitRate = monitor.getMetrics().find((m) => m.name === 'cacheHitRate');
    expect(hitRate?.value).toBe(90);
  });

  it('generateReport + sendReport（fetch 桩 + sampleRate 门 + 无 reportUrl 早退）+ clearMetrics', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    const monitor = newMonitor({ reportUrl: '/api/performance', sampleRate: 1 });
    monitor.initialize();
    monitor.recordMetric('componentRenderTime', 20);
    const report = monitor.generateReport();
    expect(report.metrics.length).toBeGreaterThan(0);
    await monitor.sendReport();
    expect(fetchMock).toHaveBeenCalledWith('/api/performance', expect.objectContaining({ method: 'POST' }));

    // sampleRate 0 → 概率门拦截（Math.random() ≥ 0 恒 > 0）
    const gate = newMonitor({ reportUrl: '/api/performance', sampleRate: 0 });
    gate.initialize();
    await gate.sendReport();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // 无 reportUrl → 早退
    const noUrl = newMonitor({ reportUrl: undefined });
    noUrl.initialize();
    await noUrl.sendReport();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // fetch 失败 → console.error 兜底
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('net down')));
    await monitor.sendReport();
    expect(console.error).toHaveBeenCalled();

    monitor.clearMetrics();
    expect(monitor.getMetrics()).toHaveLength(0);
  });

  it('usePerformanceMonitor 透传方法集可用', () => {
    const api = usePerformanceMonitor();
    expect(typeof api.recordMetric).toBe('function');
    expect(typeof api.measureComponentRender).toBe('function');
    expect(typeof api.measureDatabaseQuery).toBe('function');
    expect(typeof api.measureApiCall).toBe('function');
    expect(typeof api.recordCacheHitRate).toBe('function');
    expect(typeof api.getMetrics).toBe('function');
    expect(typeof api.generateReport).toBe('function');
    expect(typeof api.sendReport).toBe('function');
    expect(typeof api.clearMetrics).toBe('function');
  });

  it('全局单例 performanceMonitor（default 导出）可用', () => {
    expect(typeof performanceMonitor.recordMetric).toBe('function');
    expect(typeof performanceMonitor.generateReport).toBe('function');
    performanceMonitor.clearMetrics();
  });
});

// ============================================================
// YYC³ · @yyc3/lib services/voice-command-engine + error-handling 快捷单例
// （batch2 弱区：voice-command-engine 81.5L/63B · error-handler funcs 64%）
// 覆盖对象：VoiceCommandEngine 全公开面（预处理/评分/参数提取/上下文/统计）
//          + error-handler.ts 全局快捷函数（getErrorHandler/captureError/getErrorLog/
//          getErrorStats/clearErrorLog/trySafe/trySafeSync）
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  VoiceCommandEngine,
  getErrorHandler,
  captureError,
  getErrorLog,
  getErrorStats,
  clearErrorLog,
  trySafe,
  trySafeSync,
} from '../index';
import type { CommandPattern } from '../index';

// ============================================================
// VoiceCommandEngine
// ============================================================
describe('voice-command-engine · 默认模式匹配', () => {
  let engine: VoiceCommandEngine;
  beforeEach(() => {
    engine = new VoiceCommandEngine();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('切换柱图：正则命中 + 归一化文本不含英文 enum 值 → chartType 缺省', () => {
    const best = engine.getBestMatch('切换到柱图')!;
    expect(best.pattern.id).toBe('switch_chart_type');
    // enum 参数按 includes(英文值) 提取，纯中文归一化文本不含 bar → 缺省（英文通道才提取到）
    expect(best.parameters.chartType).toBeUndefined();
    expect(best.confidence).toBeGreaterThan(0.3);
    expect(best.originalText).toBe('切换到柱图');
    expect(best.normalizedText).toBeTypeOf('string');
  });

  it('英文通道：switch to bar chart', () => {
    const best = engine.getBestMatch('switch to bar chart')!;
    expect(best.pattern.id).toBe('switch_chart_type');
    expect(best.parameters.chartType).toBe('bar');
  });

  it('数值筛选：number 参数提取（value=1000）', () => {
    const best = engine.getBestMatch('显示大于1000的数据')!;
    expect(best.pattern.id).toBe('filter_by_value');
    expect(best.parameters.value).toBe(1000);
  });

  it('时间段筛选：归一化时间词（今天→today）', () => {
    const best = engine.getBestMatch('显示今天数据')!;
    expect(best.pattern.id).toBe('filter_time_period');
  });

  it('导出命令 enum 参数（format=png）', () => {
    const best = engine.getBestMatch('导出png图片')!;
    expect(best.pattern.id).toBe('export_data');
    expect(best.parameters.format).toBe('png');
  });

  it('同义词加分：柱图（柱状图同义词）命中', () => {
    const best = engine.getBestMatch('展示柱图')!;
    expect(best).not.toBeNull();
    expect(best!.pattern.id).toBe('switch_chart_type');
  });

  it('低置信度文本：仅 system_control 因浮点阈值巧合（0.2+0.1>0.3）兜底命中', () => {
    // 源判据 confidence > 0.3：无关键词命中时 contextScore(0.2)+priority 加权
    // ——priority 10 的模式（switch_chart_type/system_control 等）恰好
    //   0.30000000000000004 > 0.3，任一文本都有 priority 10 兜底匹配
    const matches = engine.matchCommand('hello world');
    const best = matches[0]!;
    expect(best.pattern.priority).toBe(10);
    expect(best.confidence).toBeCloseTo(0.3, 5);
  });

  it('matchCommand 返回按置信度降序的多个匹配', () => {
    const matches = engine.matchCommand('切换到柱图');
    expect(matches.length).toBeGreaterThan(0);
    const sorted = [...matches].sort((a, b) => b.confidence - a.confidence);
    expect(matches).toEqual(sorted);
    expect(matches[0].pattern.id).toBe('switch_chart_type');
  });

  it('正则原文与归一化双通道（regex.test(text) 命中）', () => {
    // 原文直接命中（不依赖数字/时间词转换）
    const matches = engine.matchCommand('切换线图');
    expect(matches[0].pattern.id).toBe('switch_line_chart');
  });

  it('search_content：引号搜索词', () => {
    const best = engine.getBestMatch('搜索"用户数据"')!;
    expect(best.pattern.id).toBe('search_content');
  });

  it('帮助与系统控制命令', () => {
    expect(engine.getBestMatch('帮助')!.pattern.id).toBe('help_command');
    expect(engine.getBestMatch('停止语音识别')!.pattern.id).toBe('system_control');
  });
});

describe('voice-command-engine · 预处理与评分（白盒）', () => {
  let engine: VoiceCommandEngine;
  beforeEach(() => {
    engine = new VoiceCommandEngine();
  });

  const preprocess = (text: string) =>
    (engine as unknown as { preprocessText(t: string): string }).preprocessText(text);

  it('数字词/时间词转换 + 标点清除 + 停用词移除（独立成词才移除）', () => {
    const out = preprocess('请 显示 三 个 的 数据，今天');
    expect(out).toBe('显示 3 个 数据 today'); // 停用词 请/的 移除，三→3，今天→today，逗号清除
  });

  it('calculateSimilarity：完全一致 1 / 无交集 0', () => {
    const calc = (
      engine as unknown as { calculateSimilarity(a: string, b: string): number }
    ).calculateSimilarity.bind(engine);
    expect(calc('a b', 'a b')).toBe(1);
    expect(calc('a b', 'c d')).toBe(0);
  });

  it('calculateKeywordScore：关键词与同义词分别计分', () => {
    const score = (
      engine as unknown as { calculateKeywordScore(t: string, k: string[]): number }
    ).calculateKeywordScore.bind(engine);
    // 关键词 [柱状图]，词中含同义词 柱图 → 0.8
    expect(score('柱图', ['柱状图'])).toBeCloseTo(0.8);
    // 词中含关键词本身 → 1
    expect(score('柱状图', ['柱状图'])).toBe(1);
    // 都不含 → 0
    expect(score('其他', ['柱状图'])).toBe(0);
  });

  it('calculateContextScore：无 context 默认满分；有 context 按命中比例', () => {
    const calc = (
      engine as unknown as { calculateContextScore(p: CommandPattern): number }
    ).calculateContextScore.bind(engine);

    expect(calc({} as CommandPattern)).toBe(1);
    expect(calc({ context: [] } as unknown as CommandPattern)).toBe(1);

    const pattern = { context: ['currentPage', 'selectedChart'] } as unknown as CommandPattern;
    expect(calc(pattern)).toBe(0); // 上下文全缺
    engine.updateContext({ currentPage: 'dashboard' });
    expect(calc(pattern)).toBe(0.5); // 命中一半
  });
});

describe('voice-command-engine · 参数提取四类型（自定义模式）', () => {
  let engine: VoiceCommandEngine;
  beforeEach(() => {
    engine = new VoiceCommandEngine();
  });

  it('date 参数：提取 YYYY-MM-DD → Date 对象', () => {
    engine.registerPattern({
      id: 'date_probe',
      patterns: [/查看.*报表/i],
      keywords: ['报表'],
      synonyms: {},
      priority: 5,
      category: '测试',
      description: '',
      examples: [],
      parameters: [{ name: 'day', type: 'date', required: true, description: '' }],
    });
    const best = engine.getBestMatch('查看 2026-03-15 的报表')!;
    expect(best.parameters.day).toBeInstanceOf(Date);
    expect((best.parameters.day as Date).toISOString()).toContain('2026-03-15');
  });

  it('string 参数：自定义 pattern 捕获组优先（match[1] || match[0]）', () => {
    engine.registerPattern({
      id: 'string_probe',
      patterns: [/定位.*节点/i],
      keywords: ['节点'],
      synonyms: {},
      priority: 5,
      category: '测试',
      description: '',
      examples: [],
      parameters: [
        { name: 'node', type: 'string', required: true, pattern: /定位.*节点(.*?)末尾/, description: '' },
      ],
    });
    const best = engine.getBestMatch('定位节点Alpha末尾')!;
    expect(best.parameters.node).toBe('alpha'); // 捕获组（归一化已小写）
    // 无捕获组 → match[0] 整段
    engine.registerPattern({
      id: 'string_probe2',
      patterns: [/搜索.*精确/i],
      keywords: ['搜索'],
      synonyms: {},
      priority: 5,
      category: '测试',
      description: '',
      examples: [],
      parameters: [
        { name: 'q', type: 'string', required: true, pattern: /精确/, description: '' },
      ],
    });
    // 无捕获组 → match[0] 整段（白盒直调 extractParameters，避开默认模式抢先匹配）
    const extract = (
      engine as unknown as { extractParameters(t: string, p: CommandPattern): Record<string, unknown> }
    ).extractParameters.bind(engine);
    const params = extract('搜索精确', {
      parameters: [{ name: 'q', type: 'string', required: true, pattern: /精确/, description: '' }],
    } as unknown as CommandPattern);
    expect(params.q).toBe('精确');
  });

  it('number 参数缺数 / string pattern 不命中 → 参数缺省不炸', () => {
    engine.registerPattern({
      id: 'probe',
      patterns: [/测试/i],
      keywords: ['测试'],
      synonyms: {},
      priority: 5,
      category: '测试',
      description: '',
      examples: [],
      parameters: [
        { name: 'n', type: 'number', required: false, description: '' },
        { name: 's', type: 'string', required: false, pattern: /不存在xx/, description: '' },
      ],
    });
    const best = engine.getBestMatch('做个测试')!;
    expect(best.parameters.n).toBeUndefined();
    expect(best.parameters.s).toBeUndefined();
  });

  it('无 parameters 的模式：extractParameters 直接返回空对象', () => {
    const extract = (
      engine as unknown as { extractParameters(t: string, p: CommandPattern): Record<string, unknown> }
    ).extractParameters.bind(engine);
    expect(extract('任意', {} as CommandPattern)).toEqual({});
  });
});

describe('voice-command-engine · 注册面与统计', () => {
  it('getStats：模式总数/分类计数/同义词数/上下文键', () => {
    const engine = new VoiceCommandEngine();
    engine.updateContext({ currentPage: 'home', recentCommands: ['a'] });
    const stats = engine.getStats();
    expect(stats.totalPatterns).toBe(13); // 内置 13 个默认模式
    expect(stats.categories).toMatchObject({ 图表控制: 3, 页面导航: 1, 系统控制: 1 });
    expect(stats.contextKeys).toEqual(['currentPage', 'recentCommands']);
    expect(stats.synonymsCount).toBeGreaterThan(0);
  });

  it('registerPattern(s)：同 id 覆盖；getPatternsByCategory 过滤', () => {
    const engine = new VoiceCommandEngine();
    const pattern: CommandPattern = {
      id: 'switch_chart_type', // 覆盖内置
      patterns: [/自定义/i],
      keywords: ['自定义'],
      synonyms: {},
      priority: 1,
      category: '自定义类',
      description: '',
      examples: [],
    };
    engine.registerPattern(pattern);
    engine.registerPatterns([{ ...pattern, id: 'p2', category: '自定义类' }]);

    const all = engine.getAllPatterns();
    expect(all).toHaveLength(14); // 13 内置（同 id 覆盖不增）+ p2
    expect(engine.getPatternsByCategory('自定义类')).toHaveLength(2);
    expect(all.find((p) => p.id === 'switch_chart_type')!.patterns[0]).toEqual(/自定义/i);

    expect(engine.getPatternsByCategory('不存在的类')).toEqual([]);
  });
});

// ============================================================
// error-handler 全局快捷函数（263-297 行）+ getErrorLog/clearErrorLog
// ============================================================
describe('error-handler · 全局快捷单例', () => {
  beforeEach(() => {
    localStorage.removeItem('yyc3_error_log');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('getErrorHandler：幂等单例', () => {
    const a = getErrorHandler();
    const b = getErrorHandler();
    expect(b).toBe(a);
  });

  it('captureError → getErrorLog 读回（含 limit 截断）', () => {
    const captured = captureError(new TypeError('快捷捕获'), { source: 'unit-test' });
    expect(captured.id).toMatch(/^err_/);
    expect(captured.category).toBe('runtime');
    expect(captured.message).toBe('快捷捕获');
    expect(captured.resolved).toBe(false);

    const log = getErrorLog() as Awaited<ReturnType<typeof getErrorLog>>;
    expect((log as { id: string }[])[0].id).toBe(captured.id);

    captureError(new SyntaxError('第二条'));
    const limited = getErrorLog(1) as { message: string }[];
    expect(limited).toHaveLength(1);
    expect(limited[0].message).toBe('第二条');
  });

  it('getErrorStats / clearErrorLog 快捷面', async () => {
    captureError(new Error('统计一条'), { severity: 'warning' });
    const stats = (await getErrorStats()) as {
      total: number;
      unresolvedCount: number;
      bySeverity: Record<string, number>;
      recent: unknown[];
    };
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.unresolvedCount).toBe(stats.total);
    expect(stats.bySeverity.warning).toBeGreaterThan(0);
    expect(stats.recent.length).toBeGreaterThan(0);

    clearErrorLog();
    const after = (await getErrorStats()) as { total: number; lastErrorTime: unknown };
    expect(after.total).toBe(0);
    expect(after.lastErrorTime).toBeNull();
  });

  it('trySafe：成功 [值,null]；失败 [null,AppError]', async () => {
    const ok = await trySafe(async () => 'ok-value', 'source-ok');
    expect(ok).toEqual(['ok-value', null]);

    const [result, err] = await trySafe<never>(async () => {
      throw new Error('async 炸');
    }, 'source-async');
    expect(result).toBeNull();
    expect(err!.message).toBe('async 炸');
    expect(err!.source).toBe('source-async');
  });

  it('trySafeSync：成功 [值,null]；失败 [null,AppError]', () => {
    expect(trySafeSync(() => 42)).toEqual([42, null]);

    const [result, err] = trySafeSync<never>(() => {
      throw new TypeError('sync 炸');
    }, 'source-sync');
    expect(result).toBeNull();
    expect(err!.category).toBe('runtime'); // TypeError 自动归类
    expect(err!.source).toBe('source-sync');
  });
});

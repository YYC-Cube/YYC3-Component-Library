// ============================================================
// YYC³ · @yyc3/lib services/chart-voice-control 覆盖率补测（batch2 弱区：38L/28.6B）
// 覆盖对象：ChartVoiceControlService / ChartVoiceControlManager
// 方法：复用 batch1 speech-service.test.ts 的 Fake 环境垫片先例——在动态 import
//       '../index' 之前注入 Fake SpeechRecognition / speechSynthesis /
//       SpeechSynthesisUtterance（模块级单例 multiLanguageSpeechManager 在
//       import 时构造，垫片必须先于模块求值就位）。
//       命令分派走真身链路：识别服务 onresult 事件 → processCommand 正则匹配 →
//       command.action 回调；播报链路走 Fake synth 的 utterance onend 解析。
// ============================================================
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import type { ChartVoiceControlOptions } from '../index';

// ------------------------------------------------------------
// 环境垫片（最小 Fake，与 batch1 speech-service.test.ts 同语义）
// ------------------------------------------------------------
class FakeSpeechRecognition {
  lang = '';
  continuous = false;
  interimResults = false;
  maxAlternatives = 1;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onresult: ((event: unknown) => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  start = vi.fn();
  stop = vi.fn();
  abort = vi.fn();
}

class FakeUtterance {
  text: string;
  lang = '';
  rate = 1;
  pitch = 1;
  volume = 1;
  voice: unknown = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

// 模块单例引用（beforeAll 动态 import 后填充）
let ChartVoiceControlServiceCls: typeof import('../index').ChartVoiceControlService;
let ChartVoiceControlManagerCls: typeof import('../index').ChartVoiceControlManager;

// 识别结果事件（results 为数组的数组）
const makeResultEvent = (transcript: string, confidence = 0.9, isFinal = true) => ({
  results: [
    [{ transcript, confidence }],
  ].map((alt) => ({ 0: alt[0], length: 1, isFinal })),
  resultIndex: 0,
});

const spokenTexts = (): string[] =>
  (window.speechSynthesis as unknown as { __utterances: FakeUtterance[] }).__utterances.map(
    (u) => u.text,
  );

const flushMicrotasks = async () => {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
};

beforeAll(async () => {
  (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition =
    FakeSpeechRecognition;

  const utterances: FakeUtterance[] = [];
  const synth = {
    getVoices: () => [],
    speak: (utterance: FakeUtterance) => {
      utterances.push(utterance);
      // 异步触发 onend → speak() 的 Promise resolve
      setTimeout(() => utterance.onend?.(), 0);
    },
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    speaking: false,
    paused: false,
    pending: false,
    onvoiceschanged: null as unknown,
    __utterances: utterances,
  };
  (window as unknown as { speechSynthesis?: unknown }).speechSynthesis = synth;
  (window as unknown as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance =
    FakeUtterance;

  const mod = await import('../index');
  ChartVoiceControlServiceCls = mod.ChartVoiceControlService;
  ChartVoiceControlManagerCls = mod.ChartVoiceControlManager;
});

const makeCallbacks = () => {
  const c: Required<Pick<
    ChartVoiceControlOptions,
    'onChartTypeChange' | 'onDataFilter' | 'onZoom' | 'onExport' | 'onThemeChange' | 'onDataSpeak'
  >> = {
    onChartTypeChange: vi.fn(),
    onDataFilter: vi.fn(),
    onZoom: vi.fn(),
    onExport: vi.fn(),
    onThemeChange: vi.fn(),
    onDataSpeak: vi.fn(),
  };
  return c;
};

// 经识别 Fake 实例的 onresult 驱动真身 processCommand 命令分派
const fireCommand = (svc: import('../index').ChartVoiceControlService, id: string, transcript: string) => {
  const service = (
    svc as unknown as { speechManager: { getRecognitionService: () => unknown } }
  ).speechManager.getRecognitionService();
  const rec = (service as unknown as { recognition: FakeSpeechRecognition }).recognition;
  rec?.onresult?.(makeResultEvent(transcript));
};

// ============================================================
// 命令分派（真身 onresult → processCommand 链路）
// ============================================================
describe('ChartVoiceControlService · 命令分派', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('图表类型四命令：线/柱/饼/面积（中文）', async () => {
    const cb = makeCallbacks();
    const svc = new ChartVoiceControlServiceCls({ chartId: 'c1', ...cb });

    fireCommand(svc, 'change_chart_type_line', '切换到折线图');
    await flushMicrotasks();
    expect(cb.onChartTypeChange).toHaveBeenCalledWith('line');

    // 真身正则按「柱图」子串匹配（柱状图经同义词表但不入正则）
    fireCommand(svc, 'change_chart_type_bar', '切换到柱图');
    await flushMicrotasks();
    expect(cb.onChartTypeChange).toHaveBeenCalledWith('bar');

    fireCommand(svc, 'change_chart_type_pie', '显示饼图');
    await flushMicrotasks();
    expect(cb.onChartTypeChange).toHaveBeenCalledWith('pie');

    fireCommand(svc, 'change_chart_type_area', '改为面积图');
    await flushMicrotasks();
    expect(cb.onChartTypeChange).toHaveBeenCalledWith('area');
    expect(cb.onChartTypeChange).toHaveBeenCalledTimes(4);
  });

  it('英文命令：switch to bar chart / zoom in / dark theme', async () => {
    const cb = makeCallbacks();
    const svc = new ChartVoiceControlServiceCls({ chartId: 'c2', ...cb });

    fireCommand(svc, 'change_chart_type_bar', 'switch to bar chart');
    await flushMicrotasks();
    expect(cb.onChartTypeChange).toHaveBeenCalledWith('bar');

    fireCommand(svc, 'zoom_in', 'zoom in please');
    await flushMicrotasks();
    expect(cb.onZoom).toHaveBeenCalledWith('in');
  });

  it('缩放三命令：放大/缩小/重置', async () => {
    const cb = makeCallbacks();
    const svc = new ChartVoiceControlServiceCls({ chartId: 'c3', ...cb });

    fireCommand(svc, 'zoom_in', '放大图表');
    await flushMicrotasks();
    fireCommand(svc, 'zoom_out', '缩小视图');
    await flushMicrotasks();
    fireCommand(svc, 'zoom_reset', '重置缩放');
    await flushMicrotasks();

    expect(cb.onZoom).toHaveBeenNthCalledWith(1, 'in');
    expect(cb.onZoom).toHaveBeenNthCalledWith(2, 'out');
    expect(cb.onZoom).toHaveBeenNthCalledWith(3, 'reset');
  });

  it('主题两命令：浅色/深色', async () => {
    const cb = makeCallbacks();
    const svc = new ChartVoiceControlServiceCls({ chartId: 'c4', ...cb });

    fireCommand(svc, 'theme_light', '切换浅色主题');
    await flushMicrotasks();
    fireCommand(svc, 'theme_dark', '切换到深色主题');
    await flushMicrotasks();

    expect(cb.onThemeChange).toHaveBeenNthCalledWith(1, 'light');
    expect(cb.onThemeChange).toHaveBeenNthCalledWith(2, 'dark');
  });

  it('导出三命令：png/pdf/csv', async () => {
    const cb = makeCallbacks();
    const svc = new ChartVoiceControlServiceCls({ chartId: 'c5', ...cb });

    fireCommand(svc, 'export_png', '导出图片');
    await flushMicrotasks();
    // 真身首正则无 i 标志且 processCommand 统一小写——中文 PDF 大写不可达，走英文通道
    fireCommand(svc, 'export_pdf', 'export pdf');
    await flushMicrotasks();
    fireCommand(svc, 'export_csv', '导出数据');
    await flushMicrotasks();

    expect(cb.onExport).toHaveBeenNthCalledWith(1, 'png');
    expect(cb.onExport).toHaveBeenNthCalledWith(2, 'pdf');
    expect(cb.onExport).toHaveBeenNthCalledWith(3, 'csv');
  });

  it('筛选三命令：上周/上月/今年', async () => {
    const cb = makeCallbacks();
    const svc = new ChartVoiceControlServiceCls({ chartId: 'c6', ...cb });

    fireCommand(svc, 'filter_last_week', '显示上周数据');
    await flushMicrotasks();
    fireCommand(svc, 'filter_last_month', '筛选上月');
    await flushMicrotasks();
    fireCommand(svc, 'filter_this_year', '过滤今年数据');
    await flushMicrotasks();

    expect(cb.onDataFilter).toHaveBeenNthCalledWith(1, { period: 'last_week' });
    expect(cb.onDataFilter).toHaveBeenNthCalledWith(2, { period: 'last_month' });
    expect(cb.onDataFilter).toHaveBeenNthCalledWith(3, { period: 'this_year' });
  });

  it('未匹配命令：无回调触发', async () => {
    const cb = makeCallbacks();
    const svc = new ChartVoiceControlServiceCls({ chartId: 'c7', ...cb });

    fireCommand(svc, 'none', '今天天气不错');
    await flushMicrotasks();
    expect(cb.onChartTypeChange).not.toHaveBeenCalled();
    expect(cb.onZoom).not.toHaveBeenCalled();
  });
});

// ============================================================
// 播报链路（speakChartData / speakChartSummary）
// ============================================================
describe('ChartVoiceControlService · 播报链路', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    (window as unknown as { speechSynthesis: { __utterances: FakeUtterance[] } }).speechSynthesis.__utterances.length = 0;
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('播报数据命令：speakChartData 全默认 → 标题+标签+数值进 utterance，onDataSpeak 收模拟数据', async () => {
    const cb = makeCallbacks();
    const svc = new ChartVoiceControlServiceCls({ chartId: 'v1', ...cb });

    fireCommand(svc, 'speak_data', '播报数据');
    // speakChartData 是 async 命令 action → 等 speak promise 链
    await vi.waitFor(() => expect(cb.onDataSpeak).toHaveBeenCalled());
    const text = spokenTexts().join('');
    expect(text).toContain('图表数据播报。');
    expect(text).toContain('一月');
    expect(text).toContain('1.2千'); // 1200 → formatNumber 千分位换算
    expect(text).toContain('5.0千'); // 5000 → 5.0千
  });

  it('speakChartData 关闭标题/标签/数值 + maxItems 截断提示', async () => {
    const cb = makeCallbacks();
    const svc = new ChartVoiceControlServiceCls({ chartId: 'v2', ...cb });

    await (
      svc as unknown as {
        speakChartData: (o: Record<string, unknown>) => Promise<void>;
      }
    ).speakChartData({ includeTitle: false, includeLabels: false, includeValues: false, maxItems: 2 });
    await vi.waitFor(() => {
      const text = spokenTexts().join('');
      expect(text).not.toContain('图表数据播报');
      expect(text).not.toContain('一月');
      expect(text).not.toContain('1.2千');
      expect(text).toContain('还有3项数据未播报。');
    });
  });

  it('speakChartSummary：摘要数值播报', async () => {
    const cb = makeCallbacks();
    const svc = new ChartVoiceControlServiceCls({ chartId: 'v3', ...cb });

    await (
      svc as unknown as { speakChartSummary: () => Promise<void> }
    ).speakChartSummary();
    await vi.waitFor(() => {
      const text = spokenTexts().join('');
      expect(text).toContain('共有5个数据点');
      expect(text).toContain('整体趋势呈上升态势');
    });
  });

  it('播报异常：catch 分支回播错误文案', async () => {
    const cb = makeCallbacks();
    const svc = new ChartVoiceControlServiceCls({ chartId: 'v4', ...cb });

    const synth = window.speechSynthesis as unknown as { speak: (u: FakeUtterance) => void };
    const originalSpeak = synth.speak;
    let failed = false;
    synth.speak = (u: FakeUtterance) => {
      if (!failed) {
        failed = true;
        throw new Error('synth exploded');
      }
      originalSpeak(u);
    };

    await (
      svc as unknown as { speakChartData: (o?: Record<string, unknown>) => Promise<void> }
    ).speakChartData();
    synth.speak = originalSpeak;

    await vi.waitFor(() => {
      expect(spokenTexts().join('')).toContain('播报数据时出现错误');
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('formatNumber 白盒：万/千/原值三档', () => {
    const svc = new ChartVoiceControlServiceCls({ chartId: 'v5' });
    const format = (
      svc as unknown as { formatNumber: (n: number) => string }
    ).formatNumber.bind(svc);
    expect(format(25000)).toBe('2.5万');
    expect(format(3400)).toBe('3.4千');
    expect(format(999)).toBe('999');
  });
});

// ============================================================
// activate / deactivate / updateOptions / getStatus
// ============================================================
describe('ChartVoiceControlService · 生命周期与状态', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const getRecognition = (svc: import('../index').ChartVoiceControlService) =>
    (
      (
        svc as unknown as { speechManager: { getRecognitionService: () => unknown } }
      ).speechManager.getRecognitionService() as unknown as { recognition: FakeSpeechRecognition }
    ).recognition;

  it('activate 启动监听（幂等）；deactivate 停止', () => {
    const svc = new ChartVoiceControlServiceCls({ chartId: 'l1' });
    const rec = getRecognition(svc);

    expect(svc.getStatus()).toMatchObject({ chartId: 'l1', isActive: false });
    svc.activate();
    expect(rec.start).toHaveBeenCalledTimes(1);
    expect(svc.getStatus().isActive).toBe(true);

    svc.activate(); // 幂等：不再 start
    expect(rec.start).toHaveBeenCalledTimes(1);

    rec.onstart?.(); // isListening → true
    svc.deactivate();
    expect(rec.stop).toHaveBeenCalledTimes(1);
    expect(svc.getStatus().isActive).toBe(false);

    svc.deactivate(); // 未激活 → 无操作
    expect(rec.stop).toHaveBeenCalledTimes(1);
  });

  it('getStatus 汇总双端支持状态', () => {
    const svc = new ChartVoiceControlServiceCls({ chartId: 'l2' });
    const status = svc.getStatus();
    expect(status).toEqual({
      chartId: 'l2',
      isActive: false,
      speechSupported: true, // Fake synth 就位
      recognitionSupported: true, // Fake recognition 就位
    });
  });

  it('updateOptions：更新 chartId 并影响后续回调', () => {
    const cb = makeCallbacks();
    const svc = new ChartVoiceControlServiceCls({ chartId: 'old', ...cb });
    svc.updateOptions({ chartId: 'new', onZoom: cb.onZoom });

    expect(svc.getStatus().chartId).toBe('new');
    fireCommand(svc, 'zoom_in', '放大图表');
    return vi.waitFor(() => expect(cb.onZoom).toHaveBeenCalledWith('in'));
  });
});

// ============================================================
// ChartVoiceControlManager
// ============================================================
describe('ChartVoiceControlManager', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('create/get/remove 控制器生命周期', () => {
    const manager = new ChartVoiceControlManagerCls();
    const cb = makeCallbacks();
    const svc = manager.createController({ chartId: 'm1', ...cb });

    expect(manager.getController('m1')).toBe(svc);
    expect(manager.getController('missing')).toBeUndefined();

    manager.activateAll();
    expect(svc.getStatus().isActive).toBe(true);

    manager.removeController('m1');
    expect(manager.getController('m1')).toBeUndefined();
    expect(svc.getStatus().isActive).toBe(false); // remove 内部先 deactivate

    // 未知 id remove 不抛错
    expect(() => manager.removeController('ghost')).not.toThrow();
  });

  it('activateAll/deactivateAll/getAllStatus 批量面', () => {
    const manager = new ChartVoiceControlManagerCls();
    const a = manager.createController({ chartId: 'a' });
    const b = manager.createController({ chartId: 'b' });

    manager.activateAll();
    expect(a.getStatus().isActive).toBe(true);
    expect(b.getStatus().isActive).toBe(true);

    const all = manager.getAllStatus();
    expect(Object.keys(all).sort()).toEqual(['a', 'b']);
    expect(all.a.chartId).toBe('a');

    manager.deactivateAll();
    expect(a.getStatus().isActive).toBe(false);
    expect(b.getStatus().isActive).toBe(false);
  });
});

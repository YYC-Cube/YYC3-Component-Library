// ============================================================
// YYC³ · @yyc3/lib B2b 批次验收测试（error-handling）
// 覆盖：错误分类矩阵 / 存储满载重试 / 统计聚合 / 安全包装器 /
//       全局监听幂等 / 平台过滤器四类规则 / Figma 预设
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ErrorHandler,
  LocalStorageErrorStorage,
  PlatformErrorFilter,
  createFigmaErrorFilter,
  isPlatformError,
  trySafe,
  trySafeSync,
} from '../index';
import type { AppError } from '../index';

describe('error-handling · LocalStorageErrorStorage', () => {
  beforeEach(() => localStorage.clear());

  it('save/get/clear 基本循环与限长', () => {
    const s = new LocalStorageErrorStorage('eh-test', 3);
    for (let i = 0; i < 5; i++) {
      s.save({ id: 'e' + i, message: 'm' + i, category: 'unknown', severity: 'error', timestamp: i, resolved: false });
    }
    expect(s.get()).toHaveLength(3); // 限长保留最新
    expect(s.get(1)[0].id).toBe('e4'); // limit 截取
    s.clear();
    expect(s.get()).toHaveLength(0);
  });

  it('写入满载时清旧重试；读取坏 JSON 返回空表', () => {
    const s = new LocalStorageErrorStorage('eh-quota');
    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });
    const err: AppError = { id: 'q1', message: 'x', category: 'storage', severity: 'warning', timestamp: 1, resolved: false };
    s.save(err); // 第一次抛 → 重试路径写入 [err]
    setSpy.mockRestore();
    expect(s.get()[0].id).toBe('q1');

    localStorage.setItem('eh-bad', '{not-json');
    const s2 = new LocalStorageErrorStorage('eh-bad');
    expect(s2.get()).toEqual([]);
  });
});

describe('error-handling · ErrorHandler 分类矩阵', () => {
  it('TypeError→runtime / SyntaxError→parse / DOMException→storage·auth / Event→network / 兜底 unknown', () => {
    const h = new ErrorHandler({ logToConsole: false, installGlobalListeners: false });
    const mem: AppError[] = [];
    const store: { save: (e: AppError) => void; get: () => AppError[]; clear: () => void } = {
      save: (e) => mem.push(e),
      get: () => mem,
      clear: () => void (mem.length = 0),
    };
    const h2 = new ErrorHandler({ storage: store, logToConsole: false, installGlobalListeners: false });

    h2.capture(new TypeError('t'), { silent: true });
    h2.capture(new SyntaxError('s'), { silent: true });
    h2.capture(new DOMException('q', 'QuotaExceededError'), { silent: true });
    h2.capture(new DOMException('sec', 'SecurityError'), { silent: true });
    h2.capture(new Event('error'), { silent: true });
    h2.capture('plain string', { silent: true });
    h2.capture({ message: 'obj msg' }, { silent: true });
    h2.capture(42, { silent: true });

    expect(mem.map((e) => e.category)).toEqual([
      'runtime', 'parse', 'storage', 'auth', 'network', 'unknown', 'unknown', 'unknown',
    ]);
    expect(mem.find((e) => e.message === 'obj msg')).toBeTruthy();
    expect(mem.find((e) => e.message === '未知错误')).toBeTruthy();
    expect(mem[0].stack).toBeTruthy(); // Error 实例带 stack
  });

  it('capture 显式覆盖分类/严重度；控制台按 severity 分档', () => {
    const ce = vi.spyOn(console, 'error').mockImplementation(() => void 0);
    const cw = vi.spyOn(console, 'warn').mockImplementation(() => void 0);
    const ci = vi.spyOn(console, 'info').mockImplementation(() => void 0);
    const h = new ErrorHandler({ installGlobalListeners: false }); // logToConsole 默认 true
    const e1 = h.capture('boom', { category: 'network', severity: 'critical', silent: false });
    const e2 = h.capture('warn-me', { severity: 'warning' });
    h.capture('info-me', { severity: 'info' });
    expect(e1.category).toBe('network');
    expect(e1.severity).toBe('critical');
    expect(ce).toHaveBeenCalled();
    expect(cw).toHaveBeenCalled();
    expect(ci).toHaveBeenCalled();
    ce.mockRestore(); cw.mockRestore(); ci.mockRestore();
  });

  it('trySafe/trySafeSync 成败两路', async () => {
    const h = new ErrorHandler({ logToConsole: false, installGlobalListeners: false });
    const ok = await h.trySafe(async () => 7);
    expect(ok).toEqual([7, null]);
    const bad = await h.trySafe(async () => {
      throw new Error('async-fail');
    }, 'src-async');
    expect(bad[1]?.source).toBe('src-async');
    expect(h.trySafeSync(() => 3)).toEqual([3, null]);
    const badSync = h.trySafeSync(() => {
      throw new Error('sync-fail');
    });
    expect(badSync[1]?.message).toBe('sync-fail');
  });

  it('getErrorStats 聚合分类/严重度/未解决数/最近时间', async () => {
    const mem: AppError[] = [];
    const h = new ErrorHandler({
      storage: { save: (e) => mem.push(e), get: () => mem, clear: () => void (mem.length = 0) },
      logToConsole: false,
      installGlobalListeners: false,
    });
    h.capture('a', { silent: true });
    h.capture('b', { severity: 'critical', silent: true });
    const st = await h.getErrorStats();
    expect(st.total).toBe(2);
    expect(st.unresolvedCount).toBe(2);
    expect(st.byCategory.unknown).toBe(2);
    expect(st.bySeverity.critical).toBe(1);
    expect(st.lastErrorTime).toBeTypeOf('number');
    expect(st.recent).toHaveLength(2);
  });
});

describe('error-handling · 全局监听', () => {
  it('installGlobalListeners 幂等；window error 事件被捕获', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => void 0);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => void 0);
    const h = new ErrorHandler();
    h.installGlobalListeners();
    h.installGlobalListeners(); // 二次安装应被跳过（仅装一次）
    window.dispatchEvent(new Event('error'));
    expect(errSpy).toHaveBeenCalled(); // capture 走 console.error 分支
    expect(infoSpy).toHaveBeenCalledWith('[YYC3 Error Handler] 全局错误监听器已安装');
    infoSpy.mockRestore(); errSpy.mockRestore();
  });
});

describe('error-handling · PlatformErrorFilter', () => {
  it('单/数组 pattern、大小写不敏感、source/stack 缺省不误匹配', () => {
    const f = new PlatformErrorFilter([
      { namePattern: ['ResizeObserver', 'AbortError'] },
      { messagePattern: 'iframe' },
      { sourcePattern: ['figma.com'] },
      { stackPattern: 'extension' },
    ]);
    expect(f.shouldFilter({ name: 'resizeobserverlooplimit', message: '' })).toBe(true);
    expect(f.shouldFilter({ name: 'AbortError', message: '' })).toBe(true);
    expect(f.shouldFilter({ name: 'x', message: 'IFRAME port closed' })).toBe(true);
    expect(f.shouldFilter({ name: 'x', message: 'y', source: 'https://www.figma.com/x' })).toBe(true);
    expect(f.shouldFilter({ name: 'x', message: 'y', stack: 'at chrome-extension://x' })).toBe(true);
    expect(f.shouldFilter({ name: 'x', message: 'y' })).toBe(false);
    expect(f.shouldFilter({ name: 'x', message: 'y', source: undefined })).toBe(false);
  });

  it('addRule/clearRules 动态维护', () => {
    const f = new PlatformErrorFilter();
    expect(f.shouldFilter({ name: 'a', message: 'b' })).toBe(false);
    f.addRule({ namePattern: 'a' });
    expect(f.shouldFilter({ name: 'a', message: 'b' })).toBe(true);
    f.clearRules();
    expect(f.shouldFilter({ name: 'a', message: 'b' })).toBe(false);
  });

  it('Figma 预设与 isPlatformError 快捷判定', () => {
    const figma = createFigmaErrorFilter();
    expect(figma.shouldFilter({ name: 'AbortError: iframe', message: 'message port closed' })).toBe(true);
    expect(figma.shouldFilter({ name: 'x', message: 'y', source: 'figma_app://main' })).toBe(true);
    expect(isPlatformError('iframe', 'ok')).toBe(true);
    expect(isPlatformError('TypeError', 'normal app error')).toBe(false);
  });
});

describe('error-handling · 分支补测', () => {
  beforeEach(() => localStorage.clear());

  it('双重写失败走静默分支（不崩）', () => {
    const s = new LocalStorageErrorStorage('eh-silent');
    const err: AppError = { id: 's1', message: 'm', category: 'storage', severity: 'warning', timestamp: 1, resolved: false };
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });
    expect(() => s.save(err)).not.toThrow(); // 两次都失败 → 静默
    Storage.prototype.setItem.mockRestore();
  });

  it('unhandledrejection：无 filter 捕获；有 filter 命中则 preventDefault 跳过', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => void 0);
    const mem: AppError[] = [];
    const h1 = new ErrorHandler({
      storage: { save: (e) => mem.push(e), get: () => mem, clear: () => void (mem.length = 0) },
      logToConsole: false,
    });
    h1.installGlobalListeners();
    const rejection = new Event('unhandledrejection') as Event & { reason?: unknown; preventDefault: () => void };
    rejection.reason = new Error('unhandled-promise');
    window.dispatchEvent(rejection);
    expect(mem.some((e) => e.message === 'unhandled-promise')).toBe(true);
    expect(mem[0].source).toBe('UnhandledPromiseRejection');

    // 有 filter 且命中（reason message 含 iframe）→ preventDefault + 跳过
    const mem2: AppError[] = [];
    const h2 = new ErrorHandler({
      storage: { save: (e) => mem2.push(e), get: () => mem2, clear: () => void (mem2.length = 0) },
      logToConsole: false,
      platformErrorFilter: (_n, m) => m.toLowerCase().includes('iframe'),
    });
    h2.installGlobalListeners();
    const before = mem2.length;
    const rj2 = new Event('unhandledrejection') as Event & { reason: Error };
    rj2.reason = new Error('iframe transport aborted');
    const pd = vi.spyOn(rj2, 'preventDefault').mockImplementation(() => void 0);
    window.dispatchEvent(rj2);
    expect(pd).toHaveBeenCalled();
    expect(mem2.length).toBe(before);
    errSpy.mockRestore();
  });

  it('window error 事件带 filter 命中时跳过捕获', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => void 0);
    const mem: AppError[] = [];
    const h = new ErrorHandler({
      storage: { save: (e) => mem.push(e), get: () => mem, clear: () => void (mem.length = 0) },
      logToConsole: false,
      platformErrorFilter: (_n, m) => m.includes('noise'),
    });
    h.installGlobalListeners();
    const before = mem.length;
    const ev = new Event('error') as Event & { message: string };
    ev.message = 'noise from extension';
    window.dispatchEvent(ev);
    expect(mem.length).toBe(before); // 被 filter 拦截
    errSpy.mockRestore();
  });

  it('unhandledrejection filter 未命中 → 正常捕获（reason 含 name 路径）', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => void 0);
    const mem: AppError[] = [];
    const h = new ErrorHandler({
      storage: { save: (e) => mem.push(e), get: () => mem, clear: () => void (mem.length = 0) },
      logToConsole: false,
      platformErrorFilter: (_n, m) => m.includes('never-matches'),
    });
    h.installGlobalListeners();
    const rj = new Event('unhandledrejection') as Event & { reason: Error };
    rj.reason = new TypeError('real failure');
    window.dispatchEvent(rj);
    const last = mem[mem.length - 1];
    expect(last.message).toBe('real failure');
    expect(last.severity).toBe('error');
    errSpy.mockRestore();
  });
});

// ============================================================
// YYC³ · @yyc3/lib 覆盖率补测（B2a）：clickOutside / mediaQuery /
// debouncedCallback / utils·data / utils·date 剩余分支
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, screen } from '@testing-library/react';
import React from 'react';
import { render } from '@testing-library/react';
import {
  useClickOutside,
  useMediaQuery,
  useIsMobile,
  useDebouncedCallback,
  getMember,
  getDataSummary,
  getGreeting,
  getHourlyCare,
  isToday,
  isThisWeek,
  getRelativeTime,
} from '../index';

describe('hooks · useClickOutside', () => {
  it('点击外部触发 handler；active=false 不触发', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);
    const { rerender } = renderHook(
      ({ active }: { active: boolean }) => useClickOutside(ref, handler, active),
      { initialProps: { active: true } },
    );
    // 点击外部（body）
    act(() => document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
    expect(handler).toHaveBeenCalledTimes(1);
    // 点击内部不触发
    act(() => ref.current.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
    expect(handler).toHaveBeenCalledTimes(1);
    // 停用后不再触发
    rerender({ active: false });
    act(() => document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeChild(ref.current);
  });

  it('数组 ref 形式：两元素内部点击不触发', () => {
    const handler = vi.fn();
    const a = { current: document.createElement('div') };
    const b = { current: document.createElement('div') };
    renderHook(() => useClickOutside([a, b], handler));
    act(() => a.current.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('hooks · useMediaQuery', () => {
  function mockMatchMedia(matches: boolean) {
    const listeners: Array<(e: { matches: boolean }) => void> = [];
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches,
      media: q,
      addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => listeners.push(cb),
      removeEventListener: () => void 0,
      addListener: () => void 0,
      removeListener: () => void 0,
    }));
    return listeners;
  }

  beforeEach(() => vi.unstubAllGlobals());

  it('匹配值透传与变更监听', () => {
    const listeners = mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 1px)'));
    expect(result.current).toBe(true);
    act(() => listeners[0]?.({ matches: false }));
    expect(result.current).toBe(false);
  });

  it('不匹配 → false；预设 useIsMobile', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});

describe('hooks · useDebouncedCallback', () => {
  it('默认尾沿触发 + cancel', () => {
    vi.useFakeTimers();
    const cb = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(cb, 100));
    act(() => result.current('x'));
    act(() => vi.advanceTimersByTime(100));
    expect(cb).toHaveBeenCalledWith('x');
    act(() => result.current('y'));
    act(() => result.current.cancel());
    act(() => vi.advanceTimersByTime(200));
    expect(cb).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('leading 模式立即执行一次', () => {
    vi.useFakeTimers();
    const cb = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(cb, 100, { leading: true }));
    act(() => result.current(1));
    expect(cb).toHaveBeenCalledWith(1);
    act(() => vi.advanceTimersByTime(100));
    expect(cb).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});

describe('utils · data 剩余', () => {
  const members = [
    { id: 'a', growth: 10, contribution: 20 },
    { id: 'b', growth: 30, contribution: 40 },
  ];
  it('getMember 命中与未命中', () => {
    expect(getMember('b', members)?.id).toBe('b');
    expect(getMember('z', members)).toBeUndefined();
  });
  it('getDataSummary 汇总与默认零值', () => {
    const s = getDataSummary(members, { totalMessages: 5 });
    expect(s.avgGrowth).toBe(20);
    expect(s.avgContribution).toBe(30);
    expect(s.totalMessages).toBe(5);
    expect(s.totalActivities).toBe(0);
  });
});

describe('utils · date 剩余', () => {
  it('getGreeting 返回合法结构', () => {
    const g = getGreeting();
    expect(g.text).toBeTruthy();
    expect(typeof g.emoji).toBe('string');
  });
  it('getHourlyCare 按小时轮换', () => {
    const ms = [
      { id: '1', careMessage: '早' },
      { id: '2', careMessage: '晚' },
    ];
    const r = getHourlyCare(ms);
    expect(['早', '晚']).toContain(r.message);
  });
  it('isToday/isThisWeek/getRelativeTime 边界', () => {
    expect(isToday(new Date())).toBe(true);
    expect(isToday(new Date(Date.now() - 8 * 864e5))).toBe(false);
    expect(isThisWeek(Date.now())).toBe(true);
    expect(getRelativeTime(Date.now() - 3 * 864e5)).toBe('3天前');
    expect(getRelativeTime(Date.now() - 30 * 864e5)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('hooks · useWindowSize resize 监听', () => {
  it('响应 resize 事件并取 window 尺寸', () => {
    const { result } = renderHook(() => useWindowSizeForResize());
    act(() => window.dispatchEvent(new Event('resize')));
    expect(result.current.width).toBe(window.innerWidth);
  });
});

// 局部导入避免与顶部已导入清单冲突
import { useWindowSize as useWindowSizeForResize } from '../index';
import {
  truncate, uuid, randomString, interpolate, isDate, validateConfig,
  deepClone, unique, capitalize, removeWhitespace, truncateByWords,
  useMediaQuery as useMQFallback,
} from '../index';

describe('分支补测 · utils string/validation/data', () => {
  it('string 边界分支', () => {
    expect(truncate('abc', 10)).toBe('abc'); // 未超长
    expect(interpolate('no vars')).toBe('no vars'); // 无变量
    expect(capitalize('')).toBe('');
    expect(removeWhitespace('a b\tc')).toBe('abc');
    expect(truncateByWords('a b c', 5)).toBe('a b c');
    expect(uuid()).toMatch(/^[0-9a-f]{4}/);
    expect(randomString(6, '01')).toMatch(/^[01]{6}$/);
  });
  it('validation 分支', () => {
    expect(isDate('2026-11-04')).toBe(true);
    expect(isDate('not-date')).toBe(false);
    expect(validateConfig({ a: 1 }, ['a'])).toBe(true);
    expect(validateConfig(null, ['a'])).toBe(false);
    expect(validateConfig({ a: 1 }, ['b'])).toBe(false);
  });
  it('data 分支（unique 无 key / deepClone 原始值与数组）', () => {
    expect(unique([1, 1, 2])).toEqual([1, 2]);
    expect(deepClone(5)).toBe(5);
    expect(deepClone(null)).toBeNull();
    const arr = [new Date(0), [1, 2]];
    const c = deepClone(arr);
    expect(c[0]).toBeInstanceOf(Date);
    expect(c[1]).toEqual([1, 2]);
  });
});

describe('分支补测 · useMediaQuery 旧版 API 回退', () => {
  it('无 addEventListener 时走 addListener', () => {
    const legacy: Array<(e: { matches: boolean }) => void> = [];
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: false,
      media: q,
      addEventListener: undefined as unknown as never,
      removeEventListener: undefined as unknown as never,
      addListener: (cb: (e: { matches: boolean }) => void) => legacy.push(cb),
      removeListener: () => void 0,
    }));
    const { result } = renderHook(() => useMQFallback('(min-width: 1px)'));
    expect(result.current).toBe(false);
    act(() => legacy[0]?.({ matches: true }));
    expect(result.current).toBe(true);
    vi.unstubAllGlobals();
  });
});

describe('分支补测 · storage 异常路径', () => {
  it('localStorage 读写抛异常时回退默认值（不崩）', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => void 0);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const { result } = renderHook(() => useLSError('k-err', 'fallback'));
    expect(result.current[0]).toBe('fallback');
    Storage.prototype.getItem.mockRestore();
    errSpy.mockRestore();
  });

  it('useMediaQuery/useWindowSize 卸载走清理分支', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: false, media: q,
      addEventListener: () => void 0, removeEventListener: () => void 0,
      addListener: () => void 0, removeListener: () => void 0,
    }));
    const a = renderHook(() => useMQFallback('(min-width: 1px)'));
    a.unmount();
    const b = renderHook(() => useWindowSizeForResize());
    b.unmount();
    vi.unstubAllGlobals();
  });

  it('I18nProvider：存储读写异常均回退且切换仍生效', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => void 0);
    const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('x');
    });
    const Probe: React.FC = () => {
      const { locale, setLocale } = useI18n();
      return React.createElement(
        'button',
        { onClick: () => setLocale('en-US') },
        locale,
      );
    };
    const msgs = { 'zh-CN': { a: '甲' }, 'en-US': { a: 'A' } } as never;
    render(React.createElement(I18nProviderMod, { messages: msgs, storageKey: 'k-i18n-err' }, React.createElement(Probe)));
    expect(screen.getByText('zh-CN')).toBeTruthy();
    getSpy.mockRestore();
    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('y');
    });
    act(() => screen.getByText('zh-CN').click());
    expect(screen.getByText('en-US')).toBeTruthy();
    setSpy.mockRestore();
    errSpy.mockRestore();
  });
});

import { useLocalStorage as useLSError, I18nProvider as I18nProviderMod, useI18n } from '../index';

// ============================================================
// YYC³ · @yyc3/lib utils/date + hooks/useLocalStorage 分支清扫（batch2 弱区）
// date.ts：76L/50B——getGreeting 全时段档位 + getHourlyCare 轮换 + 相对时间全档
// useLocalStorage.ts：77.4L/35.7B——storage 事件三态 / 三个 catch / 函数式更新
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  getGreeting,
  getHourlyCare,
  formatDate,
  getRelativeTime,
  isToday,
  isThisWeek,
  useLocalStorage,
} from '../index';

// ============================================================
// utils/date
// ============================================================
describe('utils/date · getGreeting 全时段', () => {
  afterEach(() => vi.useRealTimers());

  const at = (h: number, m = 0) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, h, m));
    return getGreeting();
  };

  it('七档问候语与 emoji', () => {
    expect(at(3)).toEqual({ text: '夜深了，注意休息', emoji: 'night' }); // h<6
    expect(at(7)).toEqual({ text: '早安，新的一天开始了', emoji: 'dawn' }); // h<9
    expect(at(10)).toEqual({ text: '上午好，精力充沛', emoji: 'morning' }); // h<12
    expect(at(13)).toEqual({ text: '中午好，记得午休', emoji: 'noon' }); // h<14
    expect(at(16)).toEqual({ text: '下午好，继续加油', emoji: 'afternoon' }); // h<18
    expect(at(20)).toEqual({ text: '傍晚好，辛苦了', emoji: 'evening' }); // h<21
    expect(at(23)).toEqual({ text: '晚上好，放松身心', emoji: 'night' }); // 兜底
  });
});

describe('utils/date · getHourlyCare', () => {
  afterEach(() => vi.useRealTimers());

  const members = [
    { id: 'a', careMessage: 'A 的问候' },
    { id: 'b', careMessage: 'B 的问候' },
    { id: 'c', careMessage: 'C 的问候' },
    { id: 'd', careMessage: 'D 的问候' },
  ];

  it('按小时对成员数取模轮换', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 2, 0));
    const r = getHourlyCare(members);
    expect(r.member.id).toBe('c'); // 2 % 4
    expect(r.message).toBe('C 的问候');
  });

  it('时钟越界回绕（23 时 % 4 = 3）', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 23, 0));
    expect(getHourlyCare(members).member.id).toBe('d');
  });
});

describe('utils/date · formatDate / getRelativeTime / isToday / isThisWeek', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 27, 12, 0, 0)); // 2026-11-27 12:00
  });
  afterEach(() => vi.useRealTimers());

  it('formatDate：Date/时间戳与占位替换', () => {
    expect(formatDate(new Date(2026, 0, 2, 3, 4, 5), 'YYYY/MM/DD HH:mm:ss')).toBe('2026/01/02 03:04:05');
    expect(formatDate(new Date(2026, 0, 2).getTime())).toBe('2026-01-02'); // number → new Date
  });

  it('getRelativeTime：五档（刚刚/分钟/小时/天/日期回退）', () => {
    const now = Date.now();
    expect(getRelativeTime(new Date(now - 30 * 1000))).toBe('刚刚'); // <60s
    expect(getRelativeTime(new Date(now - 5 * 60 * 1000))).toBe('5分钟前'); // <60m
    expect(getRelativeTime(new Date(now - 3 * 60 * 60 * 1000))).toBe('3小时前'); // <24h
    expect(getRelativeTime(new Date(now - 5 * 24 * 60 * 60 * 1000))).toBe('5天前'); // <7d
    expect(getRelativeTime(new Date(2025, 0, 15))).toBe('2025-01-15'); // ≥7d → formatDate
    expect(getRelativeTime(new Date(now).getTime())).toBe('刚刚'); // number 入参
  });

  it('isToday：当天 true / 昨天与其他日期 false', () => {
    expect(isToday(new Date())).toBe(true);
    expect(isToday(new Date(2026, 10, 26))).toBe(false);
    expect(isToday(new Date(2025, 0, 1))).toBe(false);
  });

  it('isThisWeek：前后 7 日内 true（含未来），超出 false', () => {
    const now = Date.now();
    expect(isThisWeek(new Date(now + 6 * 24 * 60 * 60 * 1000))).toBe(true); // 未来 6 天仍算本周口径
    expect(isThisWeek(new Date(now - 7 * 24 * 60 * 60 * 1000))).toBe(true); // |diff| ≤ 7 天
    expect(isThisWeek(new Date(now - 8 * 24 * 60 * 60 * 1000))).toBe(false);
    expect(isThisWeek(new Date(now).getTime())).toBe(true);
  });
});

// ============================================================
// hooks/useLocalStorage
// ============================================================
describe('hooks/useLocalStorage · 分支清扫', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('初始化：已有值 JSON 解析；无值回退默认', () => {
    window.localStorage.setItem('k-exist', JSON.stringify({ a: 1 }));
    const existed = renderHook(() => useLocalStorage('k-exist', { a: 0 }));
    expect(existed.result.current[0]).toEqual({ a: 1 });

    const fresh = renderHook(() => useLocalStorage('k-fresh', 'def'));
    expect(fresh.result.current[0]).toBe('def');
  });

  it('初始化：损坏 JSON → console.error + 默认值', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    window.localStorage.setItem('k-bad', '{not-json');
    const { result } = renderHook(() => useLocalStorage('k-bad', 'fallback'));
    expect(result.current[0]).toBe('fallback');
    expect(errSpy).toHaveBeenCalledWith(
      'Error reading localStorage key "k-bad":',
      expect.anything(),
    );
  });

  it('函数式更新：基于 prev 计算新值并持久化', () => {
    const { result } = renderHook(() => useLocalStorage('k-fn', 10));
    act(() => result.current[1]((prev) => prev + 5));
    expect(result.current[0]).toBe(15);
    expect(window.localStorage.getItem('k-fn')).toBe('15');
  });

  it('setItem 抛错 → console.error 且状态不炸', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });
    const { result } = renderHook(() => useLocalStorage('k-setfail', 'v'));
    act(() => result.current[1]('new-v'));
    expect(errSpy).toHaveBeenCalledWith(
      'Error setting localStorage key "k-setfail":',
      expect.anything(),
    );
    setSpy.mockRestore();
  });

  it('removeValue：恢复默认 + 移除键；removeItem 抛错走 catch', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useLocalStorage('k-rm', 'def'));
    act(() => result.current[1]('x'));
    expect(window.localStorage.getItem('k-rm')).toBe('"x"');

    const rmSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('boom');
    });
    act(() => result.current[2]());
    expect(result.current[0]).toBe('def'); // setValue(defaultValue) 先于 removeItem 抛错
    expect(errSpy).toHaveBeenCalledWith(
      'Error removing localStorage key "k-rm":',
      expect.anything(),
    );
    rmSpy.mockRestore();
  });

  it('storage 事件：key 命中且 newValue 合法 → 状态同步', () => {
    const { result } = renderHook(() => useLocalStorage('k-sync', 'local'));
    act(() =>
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'k-sync', newValue: JSON.stringify('from-other-tab') }),
      ),
    );
    expect(result.current[0]).toBe('from-other-tab');
  });

  it('storage 事件：key 不命中 / newValue null / 损坏 JSON 三分支', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useLocalStorage('k-ev', 'init'));

    act(() =>
      window.dispatchEvent(new StorageEvent('storage', { key: 'other-key', newValue: '"x"' })),
    );
    expect(result.current[0]).toBe('init'); // key 不命中 → 不更新

    act(() =>
      window.dispatchEvent(new StorageEvent('storage', { key: 'k-ev', newValue: null })),
    );
    expect(result.current[0]).toBe('init'); // newValue null → 不更新

    act(() =>
      window.dispatchEvent(new StorageEvent('storage', { key: 'k-ev', newValue: '{bad' })),
    );
    expect(result.current[0]).toBe('init'); // 解析失败 → catch + console.error
    expect(errSpy).toHaveBeenCalledWith(
      'Error parsing localStorage value for key "k-ev":',
      expect.anything(),
    );
  });
});

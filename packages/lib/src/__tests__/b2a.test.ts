// ============================================================
// YYC³ · @yyc3/lib B2a 批次验收测试（hooks/i18n/types）
// 覆盖手册 P0 适用场景 + 行为断言（覆盖率门：语句≥80/分支≥75/函数≥85/行≥80）
// 注：本文件用 createElement（非 JSX）以保 .ts 后缀
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, render, screen } from '@testing-library/react';
import React from 'react';
import {
  useToggle,
  useLocalStorage,
  useDebounce,
  useWindowSize,
  useI18n,
  I18nProvider,
  createTranslator,
  mergeMessages,
  validateMessages,
  extractKeys,
  checkConsistency,
} from '../index';
import type { I18nMessages } from '../index';

describe('hooks · useToggle', () => {
  it('初始值与三操作（toggle/setTrue/setFalse）', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
    act(() => result.current[1].toggle());
    expect(result.current[0]).toBe(false);
    act(() => result.current[1].setTrue());
    expect(result.current[0]).toBe(true);
    act(() => result.current[1].setFalse());
    expect(result.current[0]).toBe(false);
  });
});

describe('hooks · useLocalStorage', () => {
  beforeEach(() => window.localStorage.clear());

  it('默认值 / 写入持久化 / remove 恢复默认', () => {
    const { result } = renderHook(() => useLocalStorage('k1', 'def'));
    expect(result.current[0]).toBe('def');
    act(() => result.current[1]('set-val'));
    expect(result.current[0]).toBe('set-val');
    expect(window.localStorage.getItem('k1')).toBe('"set-val"');
    act(() => result.current[2]());
    expect(result.current[0]).toBe('def');
    expect(window.localStorage.getItem('k1')).toBeNull();
  });
});

describe('hooks · useDebounce', () => {
  it('延迟后更新值', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 100), { initialProps: { v: 'a' } });
    rerender({ v: 'b' });
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('b');
    vi.useRealTimers();
  });
});

describe('hooks · useWindowSize', () => {
  it('返回正尺寸并响应 resize', () => {
    const { result } = renderHook(() => useWindowSize());
    expect(result.current.width).toBeGreaterThan(0);
    expect(result.current.height).toBeGreaterThan(0);
  });
});

describe('hooks · useI18n（Provider + Context）', () => {
  const messages = {
    'zh-CN': { nav: { home: '首页' }, hello: '你好，{name}！' },
    'en-US': { nav: { home: 'Home' }, hello: 'Hello, {name}!' },
  } as Record<'zh-CN' | 'en-US', I18nMessages>;

  const Probe: React.FC = () => {
    const { locale, setLocale, t } = useI18n();
    return React.createElement('div', null,
      React.createElement('span', { 'data-testid': 'loc' }, locale),
      React.createElement('span', { 'data-testid': 'home' }, t('nav.home')),
      React.createElement('span', { 'data-testid': 'hi' }, t('hello', { name: 'YYC³' })),
      React.createElement('button', { onClick: () => setLocale('en-US') }, 'sw'),
    );
  };

  it('t() 嵌套 key + 变量；动态切换语言并持久化', () => {
    window.localStorage.clear();
    render(React.createElement(I18nProvider, { messages }, React.createElement(Probe)));
    expect(screen.getByTestId('home').textContent).toBe('首页');
    expect(screen.getByTestId('hi').textContent).toBe('你好，YYC³！');
    act(() => screen.getByText('sw').click());
    expect(screen.getByTestId('loc').textContent).toBe('en-US');
    expect(screen.getByTestId('home').textContent).toBe('Home');
    expect(window.localStorage.getItem('yyc3_locale')).toBe('en-US');
  });

  it('无 Provider 时回退 key 本身', () => {
    const { result } = renderHook(() => useI18n());
    expect(result.current.t('any.key')).toBe('any.key');
  });
});

describe('i18n · translator', () => {
  const zh: I18nMessages = { nav: { home: '首页' }, hi: '你好 {name}' };
  const en: I18nMessages = { nav: { home: 'Home' } };

  it('createTranslator 嵌套+变量+缺 key 回退', () => {
    const t = createTranslator(zh);
    expect(t('nav.home')).toBe('首页');
    expect(t('hi', { name: 'YYC³' })).toBe('你好 YYC³');
    expect(t('missing.key')).toBe('missing.key');
  });

  it('mergeMessages 深合并', () => {
    const m = mergeMessages(zh, { nav: { about: '关于' } });
    expect(m.nav.home).toBe('首页');
    expect((m.nav as I18nMessages).about).toBe('关于');
  });

  it('validateMessages 检出非串与空串', () => {
    const errs = validateMessages({ a: '', b: 1 as unknown as string });
    expect(errs).toHaveLength(2);
  });

  it('extractKeys / checkConsistency', () => {
    expect(extractKeys(zh).sort()).toEqual(['hi', 'nav.home']);
    const c = checkConsistency(zh, en);
    expect(c.missingInMessages2).toContain('hi');
    expect(c.commonKeys).toContain('nav.home');
  });
});

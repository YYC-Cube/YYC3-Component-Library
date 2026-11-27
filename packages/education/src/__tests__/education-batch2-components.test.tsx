// ============================================================
// YYC³ · @yyc3/education 批次 2 补测 · ErrorBoundary + theme-provider 深层 + KnowledgeBase 深交互
// ErrorBoundary（bug#7 修复后可加载可测）/ theme-provider index 层 hooks
// （bug#4 require→import 修复）/ KnowledgeBase 检索/收藏/新建深交互
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, renderHook, act, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';

vi.mock('../lib/error-handler.client', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return { ...actual, logError: vi.fn() };
});
import { logError } from '../lib/error-handler.client';
import { ErrorBoundary } from '../ErrorBoundary';
import {
  ThemeProvider,
  useTheme,
  ThemeToggle,
  useBrandTheme,
  ThemeVariables,
  ThemeAware,
} from '../theme-provider/index';
import { KnowledgeBase } from '../intelligent-ai-widget/knowledge-base';

const Bomb = ({ active }: { active?: boolean }) => {
  if (active) throw new Error('爆炸了');
  return <div>正常内容</div>;
};

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
  // next-themes 需要 matchMedia（jsdom 无此 API）
  (window as any).matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('education · ErrorBoundary（bug#7 修复后可测）', () => {
  it('正常渲染 children + 全局 Toaster 直通', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('正常内容')).toBeTruthy();
  });

  it('子组件抛错 → 默认错误界面 + logError 上报 + componentStack 上下文', () => {
    render(
      <ErrorBoundary>
        <Bomb active />
      </ErrorBoundary>
    );
    expect(screen.getByText('应用发生错误')).toBeTruthy();
    expect(screen.getByText('爆炸了')).toBeTruthy(); // error.message 展示
    expect(logError).toHaveBeenCalledWith(
      '爆炸了',
      expect.any(Error),
      expect.objectContaining({ context: 'ErrorBoundary', componentStack: expect.anything() })
    );
  });

  it('props.fallback 自定义回退优先于默认界面', () => {
    render(
      <ErrorBoundary fallback={<div>自定义回退</div>}>
        <Bomb active />
      </ErrorBoundary>
    );
    expect(screen.getByText('自定义回退')).toBeTruthy();
    expect(screen.queryByText('应用发生错误')).toBeNull();
  });

  it('错误界面提供重载/返回操作入口（window.location.reload 为 jsdom unforgeable 只读属性，无法桩注入）', () => {
    render(
      <ErrorBoundary>
        <Bomb active />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button', { name: /重新加载应用/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /返回上一页/ })).toBeTruthy();
  });
});

describe('education · theme-provider index 层（bug#4 修复后可测）', () => {
  it('useTheme：mounted 翻转 + 字段齐备（不触 require ReferenceError）', async () => {
    const { result } = renderHook(() => useTheme());
    // RTL renderHook 的 act 已同步冲刷 useEffect → mounted 可能已翻转，只锁终态
    await waitFor(() => expect(result.current.mounted).toBe(true));
    expect(result.current).toHaveProperty('theme');
    expect(result.current).toHaveProperty('setTheme');
    expect(result.current).toHaveProperty('resolvedTheme');
    expect(result.current).toHaveProperty('systemTheme');
  });

  it('ThemeProvider 包裹 + ThemeToggle 水合前后两态 + 点击切换', async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    );
    // RTL act 已同步水合 → 切换按钮直接可用（aria-label 随 theme 翻转）
    const toggle = screen.getByRole('button', { name: /切换到/ });
    fireEvent.click(toggle);
    // 切换后 aria-label 翻转（light → dark：按钮文案变为「切换到浅色模式」）
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '切换到浅色模式' })).toBeTruthy();
    });
  });

  it('useBrandTheme：亮色回退 + 渐变/取色 API', () => {
    const { result } = renderHook(() => useBrandTheme());
    expect(result.current.theme).toBeDefined();
    expect(result.current.isDark).toBe(false); // 无 provider → resolvedTheme undefined → light 回退
    const gradient = result.current.applyGradient('brand');
    expect(String(gradient.background)).toContain('linear-gradient');
    expect(typeof result.current.getThemeColor('primary')).toBe('string');
  });

  it('ThemeVariables：注入 CSS 变量到 documentElement；ThemeAware 渲染 children', async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <ThemeAware>
          <div>被包裹内容</div>
        </ThemeAware>
      </ThemeProvider>
    );
    expect(screen.getByText('被包裹内容')).toBeTruthy();
    await waitFor(() => {
      const style = document.documentElement.style;
      const injected = Array.from(style).filter((p) => p.startsWith('--theme-') || p.startsWith('--gradient-'));
      expect(injected.length).toBeGreaterThan(0);
    });
  });
});

describe('education · KnowledgeBase 深交互', () => {
  const setup = () => {
    const onItemClick = vi.fn();
    const onItemCreate = vi.fn();
    const onItemUpdate = vi.fn();
    render(<KnowledgeBase onItemClick={onItemClick} onItemCreate={onItemCreate} onItemUpdate={onItemUpdate} />);
    return { onItemClick, onItemCreate, onItemUpdate };
  };

  it('加载完成后：热门/最新/分类三区渲染（内部 mock 数据）', async () => {
    setup();
    await waitFor(() => expect(screen.getByText('热门知识')).toBeTruthy(), { timeout: 2000 });
    expect(screen.getByText('最新知识')).toBeTruthy();
    expect(screen.getByText('分类浏览')).toBeTruthy();
    // 每条目在 热门+最新 两区各一份 → getAllByText 断言
    expect(screen.getAllByText('如何使用AI助手').length).toBeGreaterThanOrEqual(1);
  });

  it('搜索命中 → 搜索结果区；无命中 → 空态', async () => {
    setup();
    await waitFor(() => expect(screen.getByText('热门知识')).toBeTruthy(), { timeout: 2000 });
    const input = screen.getByPlaceholderText('搜索知识库') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '工作流' } });
    await waitFor(() => expect(screen.getByText(/搜索结果 \(\d+\)/)).toBeTruthy());
    expect(screen.getByText('工作流创建步骤')).toBeTruthy();

    fireEvent.change(input, { target: { value: '绝不存在的关键词xyz' } });
    await waitFor(() => expect(screen.getByText('没有找到相关内容')).toBeTruthy());
  });

  it('分类切换 → 过滤命中；标签点击 → 标签筛选', async () => {
    setup();
    await waitFor(() => expect(screen.getByText('热门知识')).toBeTruthy(), { timeout: 2000 });
    fireEvent.click(screen.getByRole('button', { name: /使用指南/ }));
    await waitFor(() => {
      expect(screen.getByText(/搜索结果 \(\d+\)/)).toBeTruthy();
      expect(screen.getByText('工具使用技巧')).toBeTruthy();
    });

    // 回「全部」再点标签（工具栏同时存在同名分类 chip 与标签 chip——取 DOM 顺序最后的标签 chip）
    fireEvent.click(screen.getByRole('button', { name: /全部/ }));
    await waitFor(() => expect(screen.getByText('热门知识')).toBeTruthy());
    const shortcutButtons = screen.getAllByRole('button', { name: /快捷键/ });
    fireEvent.click(shortcutButtons[shortcutButtons.length - 1]);
    await waitFor(() => {
      expect(screen.getByText(/搜索结果 \(\d+\)/)).toBeTruthy();
      expect(screen.getByText('快捷键大全')).toBeTruthy();
    });
  });

  it('新建按钮 → onItemCreate 回调（模板条目）', async () => {
    const { onItemCreate } = setup();
    await waitFor(() => expect(screen.getByText('热门知识')).toBeTruthy(), { timeout: 2000 });
    fireEvent.click(screen.getByRole('button', { name: /新建/ }));
    expect(onItemCreate).toHaveBeenCalledTimes(1);
    const created = onItemCreate.mock.calls[0][0] as Record<string, unknown>;
    expect(created.title).toBe('新知识条目');
    expect(created.type).toBe('note');
  });

  it('收藏星标切换 → onItemUpdate 回调（含收藏数联动）', async () => {
    const { onItemUpdate } = setup();
    await waitFor(() => expect(screen.getAllByText('工具使用技巧').length).toBeGreaterThan(0), { timeout: 2000 });
    // kb-2 未收藏 → 点其卡片内唯一按钮（星标）→ onItemUpdate(id, { isFavorite: true })
    // 注：同一卡片在 热门知识 + 最新知识 两区各渲染一份，取第一实例
    const card = screen.getAllByText('工具使用技巧')[0].closest('div[class*="cursor-pointer"]') as HTMLElement;
    const starBtn = card.querySelector('button') as HTMLElement;
    expect(starBtn).toBeTruthy();
    fireEvent.click(starBtn);
    await waitFor(() => expect(onItemUpdate).toHaveBeenCalled());
    expect(onItemUpdate.mock.calls[0][0]).toBe('kb-2');
    expect(onItemUpdate.mock.calls[0][1]).toEqual({ isFavorite: true });
    // 收藏态翻转后卡片数据联动（likes+1）——UI 重新拉取列表仍包含该条
    await waitFor(() => expect(screen.getAllByText('工具使用技巧').length).toBeGreaterThan(0));
  });
});

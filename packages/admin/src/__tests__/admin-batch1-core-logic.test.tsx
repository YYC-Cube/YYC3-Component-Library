// ============================================================
// YYC³ · @yyc3/admin 批次 1 · 第一层：逻辑重头组件
// api-client（纯 TS）/ 计时器 / 虚拟列表 / 懒加载 / 离线指示器 /
// 会话摘要 / 快速操作 / 图例 / Logo / 页面图标条 / 主题挂载
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next-themes', async () => (await import('./helpers')).nextThemesModule());

import { apiClient } from '../lib/api/api-client';
import { ThemeProvider } from '../theme-provider';
import { OfflineIndicator } from '../offline-indicator';
import { AdvancedTimer } from '../advanced-timer';
import { VirtualizedList } from '../performance/virtualized-list';
import { LazyImage } from '../performance/lazy-image';
import { SessionSummary } from '../session-summary';
import { QuickActions } from '../quick-actions';
import { QuickActionsMenu } from '../quick-actions-menu';
import PageIconBar from '../page-icon-bar';
import { ColorLegend } from '../color-legend';
import { Logo } from '../logo';
import { stubAdminDom, stubControllableIntersectionObserver, setNavigatorOnline } from './helpers';

beforeEach(() => {
  stubAdminDom();
});

// ---------- 纯逻辑：api-client ----------
describe('api-client', () => {
  const jsonResponse = (body: unknown, ok = true, status = 200, statusText = 'OK') =>
    ({
      ok,
      status,
      statusText,
      headers: { get: (k: string) => (k.toLowerCase() === 'content-type' ? 'application/json' : null) },
      json: async () => body,
      text: async () => JSON.stringify(body),
    }) as unknown as Response;

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('get 拼接 query 参数并携带默认请求头', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    const data = await apiClient.get<{ ok: boolean }>('users', { page: 1, empty: undefined }, 'tok-1');

    expect(data).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.example.com/v1/users?page=1');
    expect(init.method).toBe('GET');
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(init.headers['Authorization']).toBe('Bearer tok-1');
    expect(init.credentials).toBe('include');
  });

  it('无 token 时 Authorization 头缺省', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]));
    vi.stubGlobal('fetch', fetchMock);

    await apiClient.get('stats');
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers['Authorization']).toBeUndefined();
  });

  it('post/put/patch 携带 JSON body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: 7 }));
    vi.stubGlobal('fetch', fetchMock);

    await apiClient.post('orders', { sku: 'A1' });
    await apiClient.put('orders/7', { sku: 'A2' });
    await apiClient.patch('orders/7', { qty: 3 });

    expect(fetchMock.mock.calls.map((c) => (c[1] as RequestInit).method)).toEqual(['POST', 'PUT', 'PATCH']);
    for (const call of fetchMock.mock.calls) {
      expect(JSON.parse((call[1] as RequestInit).body as string)).toBeTruthy();
    }
  });

  it('post 无 body 时不带 body 字段', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: 1 }));
    vi.stubGlobal('fetch', fetchMock);

    await apiClient.post('ping');
    expect((fetchMock.mock.calls[0][1] as RequestInit).body).toBeUndefined();
  });

  it('delete 不携带 body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ deleted: true }));
    vi.stubGlobal('fetch', fetchMock);

    await apiClient.delete('orders/7', 'tok');
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe('DELETE');
    expect(init.headers['Authorization']).toBe('Bearer tok');
    expect(init.body).toBeUndefined();
  });

  it('uploadFile 走 FormData 且不设 Content-Type 头', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ url: '/f/x.png' }));
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['bytes'], 'x.png', { type: 'image/png' });
    await apiClient.uploadFile('upload', file, { biz: 'logo' }, 'tok-2');

    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(init.body).toBeInstanceOf(FormData);
    const fd = init.body as FormData;
    expect(fd.get('file')).toBe(file);
    expect(fd.get('biz')).toBe('logo');
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer tok-2');
    expect((init.headers as Record<string, string>)['Content-Type']).toBeUndefined();
  });

  it('非 2xx 抛 ApiError（携带 status/data）', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ reason: 'dup' }, false, 409, 'Conflict'));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiClient.post('users', {})).rejects.toMatchObject({
      name: 'ApiError',
      status: 409,
      data: { reason: 'dup' },
    });
  });

  it('非 JSON 响应走 text 分支', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      ({
        ok: true,
        status: 200,
        headers: { get: () => 'text/plain' },
        text: async () => 'plain-text-body',
      }) as unknown as Response,
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiClient.get('export')).resolves.toBe('plain-text-body');
  });
});

// ---------- 轻组件：Theme / Logo / 图例 ----------
describe('ThemeProvider', () => {
  it('挂载 children', () => {
    render(
      <ThemeProvider>
        <div>主题内内容</div>
      </ThemeProvider>,
    );
    expect(screen.getByText('主题内内容')).toBeInTheDocument();
  });
});

describe('Logo', () => {
  it.each(['small', 'medium', 'large'] as const)('渲染品牌文案（size=%s）', (size) => {
    render(<Logo size={size} />);
    expect(screen.getByText('『言语』云享e中心')).toBeInTheDocument();
    expect(screen.getByAltText('言语智能')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });
});

describe('ColorLegend', () => {
  it('渲染 6 项图例', () => {
    render(<ColorLegend />);
    for (const name of ['客房入住率', '娱乐区客流量', '餐饮翻台率', '对标分析', '历史趋势', '竞品动态']) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });
  it('透传 className', () => {
    const { container } = render(<ColorLegend className="extra-cls" />);
    expect(container.firstElementChild).toHaveClass('extra-cls');
  });
});

// ---------- 状态机：AdvancedTimer ----------
describe('AdvancedTimer', () => {
  it('初始空态：提示选择任务 + 今日工时统计', () => {
    render(<AdvancedTimer />);
    expect(screen.getByText('选择任务开始计时')).toBeInTheDocument();
    expect(screen.getByText('时间跟踪器')).toBeInTheDocument();
    // 硬编码记录日期为 2025-06-19，与当日无关 → 0h 0m（行为基线）
    expect(screen.getByText('0h 0m')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // 活跃任务固定值
  });

  it('开始 → 暂停 → 继续 → 停止 状态闭环', () => {
    vi.useFakeTimers();
    try {
      render(<AdvancedTimer />);
      fireEvent.click(screen.getByRole('button', { name: /开始计时/ }));

      // 会话启动：任务标题（会话头部 + 时间记录列表各一份）+ 计时显示
      expect(screen.getAllByText('产品原型设计').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('0:00')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /暂停/ })).toBeInTheDocument();

      // 推进 1 个 tick → 秒数走动（interval 状态更新需 act 包裹刷新）
      act(() => {
        vi.advanceTimersByTime(1100);
      });
      expect(screen.getByText('0:01')).toBeInTheDocument();

      // 暂停后走「继续」
      fireEvent.click(screen.getByRole('button', { name: /暂停/ }));
      expect(screen.getByRole('button', { name: /继续/ })).toBeInTheDocument();

      // 停止回空态
      fireEvent.click(screen.getByRole('button', { name: /停止/ }));
      expect(screen.getByText('选择任务开始计时')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});

// ---------- 虚拟列表窗口化 ----------
describe('VirtualizedList', () => {
  const items = Array.from({ length: 100 }, (_, i) => `item-${i}`);
  const setup = (props: Partial<Parameters<typeof VirtualizedList>[0]> = {}) => {
    const onEndReached = vi.fn();
    const utils = render(
      <VirtualizedList
        items={items}
        height={400}
        itemHeight={40}
        renderItem={(item, index) => <div>{`${item}#${index}`}</div>}
        onEndReached={onEndReached}
        {...props}
      />,
    );
    return { onEndReached, ...utils };
  };

  const getScrollContainer = (utils: ReturnType<typeof render>) =>
    utils.container.querySelector('.overflow-auto') as HTMLElement;

  it('仅渲染可见窗口（默认 height=400/item=40/overscan=5 → 前 10 项）', () => {
    const utils = setup();
    expect(screen.getByText('item-0#0')).toBeInTheDocument();
    expect(screen.getByText('item-9#9')).toBeInTheDocument();
    expect(screen.queryByText('item-20#20')).not.toBeInTheDocument();
    // 内层占位总高 = 100 * 40
    expect(utils.container.firstElementChild?.firstElementChild).toHaveStyle({ height: '4000px' });
  });

  it('滚动后窗口随 scrollTop 平移', () => {
    const utils = setup();
    const container = getScrollContainer(utils);
    Object.defineProperty(container, 'scrollTop', { configurable: true, value: 2000 });
    Object.defineProperty(container, 'scrollHeight', { configurable: true, value: 4000 });
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: 400 });
    fireEvent.scroll(container);
    // scrollTop=2000 → 首个可见项 index≈50，减 overscan 5 → 45 起
    expect(screen.getByText('item-45#45')).toBeInTheDocument();
    expect(screen.queryByText('item-0#0')).not.toBeInTheDocument();
  });

  it('贴近底部触发 onEndReached（一次），拉回顶部复位', () => {
    const { onEndReached, ...utils } = setup();
    const container = getScrollContainer(utils as ReturnType<typeof render>);
    Object.defineProperty(container, 'scrollHeight', { configurable: true, value: 4000 });
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: 400 });
    Object.defineProperty(container, 'scrollTop', { configurable: true, value: 3800 });
    fireEvent.scroll(container);
    expect(onEndReached).toHaveBeenCalledTimes(1);

    // 拉回远离底部 → 复位可再次触发
    Object.defineProperty(container, 'scrollTop', { configurable: true, value: 0 });
    fireEvent.scroll(container);
    Object.defineProperty(container, 'scrollTop', { configurable: true, value: 3900 });
    fireEvent.scroll(container);
    expect(onEndReached).toHaveBeenCalledTimes(2);
  });

  it('keyExtractor 定制 + 空列表不炸', () => {
    render(
      <VirtualizedList
        items={['a', 'b']}
        height={100}
        itemHeight={50}
        keyExtractor={(item) => `k-${item}`}
        renderItem={(item) => <div>{item}</div>}
      />,
    );
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
  });
});

// ---------- 懒加载图片 ----------
describe('LazyImage', () => {
  it('未进视口只渲染骨架占位，进入视口后加载真图', () => {
    const io = stubControllableIntersectionObserver();
    render(<LazyImage src="/real.png" alt="实图" width={100} height={50} />);

    // IntersectionObserver 已挂载但未触发 → 只有 Skeleton（无 img[src=real]）
    expect(screen.queryByAltText('实图')).not.toBeInTheDocument();

    act(() => io.intersect(true));
    const img = screen.getByAltText('实图');
    expect(img).toHaveAttribute('src', '/real.png');
  });

  it('加载完成隐藏占位并回调 onLoad', () => {
    const io = stubControllableIntersectionObserver();
    const onLoad = vi.fn();
    render(<LazyImage src="/real.png" alt="实图" onLoad={onLoad} />);
    act(() => io.intersect(true));
    fireEvent.load(screen.getByAltText('实图'));
    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it('加载失败切 fallbackSrc 并回调 onError', () => {
    const io = stubControllableIntersectionObserver();
    const onError = vi.fn();
    render(<LazyImage src="/bad.png" alt="实图" fallbackSrc="/fallback.png" onError={onError} />);
    act(() => io.intersect(true));
    const img = screen.getByAltText('实图');
    fireEvent.error(img);
    expect(onError).toHaveBeenCalledTimes(1);
    // error 后 displaySrc 切换（React 重渲染 src）
    expect(img).toHaveAttribute('src', '/fallback.png');
  });

  it('提供 placeholderSrc 时未加载期渲染模糊占位图', () => {
    stubControllableIntersectionObserver();
    render(<LazyImage src="/real.png" alt="实图" placeholderSrc="/ph.png" />);
    expect(screen.getByAltText('实图')).toHaveAttribute('src', '/ph.png');
  });
});

// ---------- 离线指示器 ----------
describe('OfflineIndicator', () => {
  it('默认在线时渲染 null', () => {
    const { container } = render(<OfflineIndicator />);
    expect(container).toBeEmptyDOMElement();
  });

  it('offline 事件 → 显示断网提示与缓存说明', () => {
    setNavigatorOnline(false);
    render(<OfflineIndicator />);
    fireEvent(window, new Event('offline'));
    expect(screen.getByText('网络连接断开')).toBeInTheDocument();
    expect(screen.getByText('离线')).toBeInTheDocument();
    expect(screen.getByText('正在使用缓存数据')).toBeInTheDocument();
  });

  it('恢复 online → 显示恢复提示，2s 后自动隐藏', () => {
    vi.useFakeTimers();
    try {
      setNavigatorOnline(false);
      render(<OfflineIndicator />);
      fireEvent(window, new Event('offline'));
      setNavigatorOnline(true);
      fireEvent(window, new Event('online'));
      expect(screen.getByText('网络连接已恢复')).toBeInTheDocument();
      expect(screen.getByText('在线')).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(2100);
      });
      expect(screen.queryByText('网络连接已恢复')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});

// ---------- 会话摘要 ----------
describe('SessionSummary', () => {
  const baseProps = {
    title: '批次完成',
    description: '本批次补测结束',
    summaryItems: [
      { label: '组件', value: 12 },
      { label: '用例', value: '48' },
    ],
    nextSteps: [
      { label: '进入批次 2', href: '/next', primary: true },
      { label: '回列表', href: '/back' },
    ],
  };

  it('渲染标题/摘要项/下一步链接', () => {
    render(<SessionSummary {...baseProps} />);
    expect(screen.getByText('批次完成')).toBeInTheDocument();
    expect(screen.getByText('本批次补测结束')).toBeInTheDocument();
    expect(screen.getByText('组件')).toBeInTheDocument();
    expect(screen.getByText('进入批次 2')).toHaveAttribute('href', '/next');
    expect(screen.getByText('回列表')).toHaveAttribute('href', '/back');
    expect(screen.getByText('下一步建议')).toBeInTheDocument();
  });

  it('关闭按钮 → 卸载自身并回调 onClose', () => {
    const onClose = vi.fn();
    render(<SessionSummary {...baseProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: '关闭' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('批次完成')).not.toBeInTheDocument();
  });
});

// ---------- 快速操作 ----------
describe('QuickActions', () => {
  it('触发弹层 → 分组命令面板渲染', async () => {
    const user = userEvent.setup();
    render(<QuickActions />);
    await user.click(screen.getByRole('button', { name: /快速操作/ }));
    expect(await screen.findByPlaceholderText('搜索操作...')).toBeInTheDocument();
    expect(await screen.findByText('客户管理')).toBeInTheDocument();
    expect(screen.getByText('添加客户')).toBeInTheDocument();
    expect(screen.getByText('生成报表')).toBeInTheDocument();
    expect(screen.getByText('Ctrl+Shift+C')).toBeInTheDocument();
  });

  it('搜索过滤命令项', async () => {
    const user = userEvent.setup();
    render(<QuickActions />);
    await user.click(screen.getByRole('button', { name: /快速操作/ }));
    const input = await screen.findByPlaceholderText('搜索操作...');
    await user.type(input, '邮件');
    expect(await screen.findByText('发送邮件')).toBeInTheDocument();
    expect(screen.queryByText('添加客户')).not.toBeInTheDocument();
  });
});

describe('QuickActionsMenu', () => {
  it('渲染下拉项并触发回调', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    const Icon = () => <span data-testid="ic" />;
    render(
      <QuickActionsMenu
        actions={[
          { icon: Icon, label: '新建工单', action, shortcut: '⌘N' },
          { icon: Icon, label: '导出数据', action: vi.fn() },
        ]}
      />,
    );
    await user.click(screen.getByRole('button', { name: /快速操作/ }));
    expect(await screen.findByText('新建工单')).toBeInTheDocument();
    expect(screen.getByText('⌘N')).toBeInTheDocument();
    await user.click(screen.getByText('新建工单'));
    expect(action).toHaveBeenCalledTimes(1);
  });
});

// ---------- 页面图标条 ----------
describe('PageIconBar', () => {
  it('渲染图标项 + 当前路径高亮（aria-current）', () => {
    render(
      <PageIconBar
        items={[
          { label: '仪表盘', icon: <span>▣</span>, href: '/admin' },
          { label: '报表', icon: <span>▤</span>, href: '/reports' },
        ]}
      />,
    );
    expect(screen.getByText('仪表盘')).toBeInTheDocument();
    expect(screen.getByText('报表')).toBeInTheDocument();
    expect(screen.getByText('仪表盘').closest('[aria-current]')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('报表').closest('[aria-current]')).toBeNull();
    // Link 包裹
    expect(screen.getByText('报表').closest('a')).toHaveAttribute('href', '/reports');
  });

  it('无 href 项走 onClick 分支', async () => {
    const onClick = vi.fn();
    render(<PageIconBar items={[{ label: '按钮项', icon: <span>▪</span>, onClick }]} />);
    fireEvent.click(screen.getByText('按钮项'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('compact 变体渲染', () => {
    const { container } = render(
      <PageIconBar items={[{ label: '紧凑项', icon: <span>▪</span> }]} variant="compact" />,
    );
    expect(container.querySelector('.grid-cols-1')).not.toBeNull();
    expect(screen.getByText('紧凑项')).toBeInTheDocument();
  });
});

// ---------- 组件可按受控方式挂载（防回归冒烟） ----------
describe('ThemeProvider 受控挂载冒烟', () => {
  it('嵌套主题内容可正常 hydrate', () => {
    render(
      <ThemeProvider attribute="class">
        <button>深层按钮</button>
      </ThemeProvider>,
    );
    expect(screen.getByRole('button', { name: '深层按钮' })).toBeInTheDocument();
  });
});

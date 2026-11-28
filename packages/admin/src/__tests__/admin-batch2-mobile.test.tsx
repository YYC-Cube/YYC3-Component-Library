// ============================================================
// YYC³ · @yyc3/admin 批次 2 · 补充层 B：移动端分支缺口收割
// mobile/mobile-optimized-components（46 缺口）+ gesture-support（33）+
// mobile-data-loader（23）——batch2 冲 branches 70% 区间
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {
  MobileButton,
  MobileInput,
  MobileSelect,
  MobileCard,
  MobileSearch,
  MobileNumberInput,
} from '../mobile/mobile-optimized-components';
import { Swipeable, PinchZoom, PullToRefresh } from '../mobile/gesture-support';
import { MobileDataLoader } from '../mobile/mobile-data-loader';
import { OfflineInitializationSupport } from '../offline-initialization-support';
import { stubAdminDom, silenceConsole, setNavigatorOnline } from './helpers';

beforeEach(() => {
  stubAdminDom();
  silenceConsole();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/** 触摸序列工具 */
const touch = (points: Array<{ x: number; y: number }>) => ({
  touches: points.map((p) => ({ clientX: p.x, clientY: p.y })),
  targetTouches: points.map((p) => ({ clientX: p.x, clientY: p.y })),
  changedTouches: points.map((p) => ({ clientX: p.x, clientY: p.y })),
});

// ---------- MobileButton ----------
describe('MobileButton（移动端按钮）', () => {
  it('点击回调与禁用/加载态', () => {
    const onClick = vi.fn();
    const { rerender } = render(<MobileButton onClick={onClick}>提交</MobileButton>);
    fireEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<MobileButton disabled>禁用</MobileButton>);
    expect(screen.getByRole('button', { name: '禁用' })).toBeDisabled();
    rerender(<MobileButton loading>保存</MobileButton>);
    expect(screen.getByRole('button', { name: /加载中/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /加载中/ })).toBeDisabled();
  });

  it('触摸按压态三事件', () => {
    render(<MobileButton>触摸</MobileButton>);
    const btn = screen.getByRole('button', { name: '触摸' });
    fireEvent.touchStart(btn, touch([{ x: 0, y: 0 }]));
    expect(btn.className).toContain('scale-95');
    fireEvent.touchEnd(btn, touch([]));
    expect(btn.className).not.toContain('scale-95');
    fireEvent.touchStart(btn, touch([{ x: 0, y: 0 }]));
    fireEvent.touchCancel(btn, touch([]));
    expect(btn.className).not.toContain('scale-95');
  });

  it('尺寸与变体类透传', () => {
    render(
      <div>
        <MobileButton size="sm" variant="outline">小</MobileButton>
        <MobileButton size="lg" variant="destructive" fullWidth>大</MobileButton>
        <MobileButton variant="ghost">幽灵</MobileButton>
      </div>,
    );
    expect(screen.getByRole('button', { name: '大' }).className).toContain('w-full');
  });
});

// ---------- MobileInput ----------
describe('MobileInput（移动端输入框）', () => {
  it('onChange/onFocus/onBlur 与错误态', async () => {
    const onChange = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const { rerender } = render(
      <MobileInput label="手机号" required placeholder="输入手机号" onChange={onChange} onFocus={onFocus} onBlur={onBlur} />,
    );
    const input = screen.getByPlaceholderText('输入手机号');
    input.focus();
    expect(onFocus).toHaveBeenCalledTimes(1);
    fireEvent.change(input, { target: { value: '138' } });
    expect(onChange).toHaveBeenCalledWith('138');
    input.blur();
    expect(onBlur).toHaveBeenCalledTimes(1);
    rerender(
      <MobileInput label="手机号" placeholder="输入手机号" error="格式不正确" onChange={() => {}} />,
    );
    expect(screen.getByText('格式不正确')).toBeInTheDocument();
    // 无 label / 禁用分支
    rerender(<MobileInput placeholder="禁用输入" disabled onChange={() => {}} />);
    expect(screen.getByPlaceholderText('禁用输入')).toBeDisabled();
  });
});

// ---------- MobileSelect ----------
describe('MobileSelect（移动端选择器）', () => {
  const options = [
    { value: 'a', label: '选项甲' },
    { value: 'b', label: '选项乙' },
  ];

  it('初始值回显/占位符/展开选择', () => {
    const onChange = vi.fn();
    const { rerender } = render(<MobileSelect options={options} onChange={onChange} />);
    expect(screen.getByText('请选择')).toBeInTheDocument();
    fireEvent.click(screen.getByText('请选择'));
    fireEvent.click(screen.getByText('选项乙'));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(screen.getByText('选项乙')).toBeInTheDocument();
    // 带初始值 + 必答星标 + 错误态
    rerender(
      <MobileSelect label="类型" required options={options} value="a" error="必填" onChange={() => {}} />,
    );
    expect(screen.getByText('类型')).toBeInTheDocument();
    expect(screen.getByText('必填')).toBeInTheDocument();
    // 禁用（selectedOption 状态不随 rerender 重置 → 仍显示选项乙）
    rerender(<MobileSelect options={options} disabled onChange={() => {}} />);
    expect(screen.getByText('选项乙').closest('button')).toBeDisabled();
  });

  it('展开后可收起（toggle 分支）', () => {
    render(<MobileSelect options={options} onChange={() => {}} />);
    const trigger = screen.getByText('请选择').closest('button') as HTMLElement;
    fireEvent.click(trigger);
    expect(screen.getByText('选项甲')).toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.queryByText('选项甲')).not.toBeInTheDocument();
  });

  it('已选项在下拉中高亮并带对钩', () => {
    render(<MobileSelect options={options} value="a" onChange={() => {}} />);
    fireEvent.click(screen.getByText('选项甲'));
    expect(document.querySelector('svg.lucide-check')).not.toBeNull();
  });
});

// ---------- MobileCard ----------
describe('MobileCard（移动端卡片）', () => {
  it('标题/副标题/操作区渲染与点击', () => {
    const onClick = vi.fn();
    render(
      <MobileCard
        clickable
        selected
        title="卡片标题"
        subtitle="副标题"
        actions={<button>操作</button>}
        onClick={onClick}
      >
        卡片内容
      </MobileCard>,
    );
    expect(screen.getByText('卡片标题')).toBeInTheDocument();
    expect(screen.getByText('副标题')).toBeInTheDocument();
    expect(screen.getByText('卡片内容')).toBeInTheDocument();
    fireEvent.click(screen.getByText('卡片标题'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('触摸按压态与无头部分支', () => {
    render(
      <MobileCard clickable data-x="1">
        纯内容卡
      </MobileCard>,
    );
    const card = screen.getByText('纯内容卡').closest('[data-slot="card"]') as HTMLElement;
    fireEvent.touchStart(card, touch([{ x: 0, y: 0 }]));
    expect(card.className).toContain('scale-98');
    fireEvent.touchEnd(card, touch([]));
    expect(card.className).not.toContain('scale-98');
    fireEvent.touchCancel(card, touch([]));
  });
});

// ---------- MobileSearch ----------
describe('MobileSearch（移动端搜索框）', () => {
  it('输入触发搜索、清除按钮、筛选入口', async () => {
    const onSearch = vi.fn();
    const onFilter = vi.fn();
    const onClear = vi.fn();
    render(<MobileSearch showFilter filterCount={3} onSearch={onSearch} onFilter={onFilter} onClear={onClear} />);
    const input = screen.getByPlaceholderText('搜索...');
    fireEvent.change(input, { target: { value: '客户' } });
    expect(onSearch).toHaveBeenCalledWith('客户');
    expect(screen.getByText('3')).toBeInTheDocument(); // 筛选计数徽标
    // 筛选按钮（徽标计入可访问名）
    fireEvent.click(screen.getByRole('button', { name: /3/ }));
    expect(onFilter).toHaveBeenCalledTimes(1);
    // 清除
    fireEvent.click(document.querySelector('button svg.lucide-x')?.closest('button') as HTMLElement);
    expect(onSearch).toHaveBeenCalledWith('');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('无筛选入口分支与零计数徽标', () => {
    render(<MobileSearch showFilter={false} onSearch={() => {}} />);
    const input = screen.getByPlaceholderText('搜索...');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(screen.queryByRole('button')).not.toBeInTheDocument(); // 无值无清除按钮、无筛选
  });

  it('筛选入口零计数不渲染徽标', () => {
    render(<MobileSearch showFilter filterCount={0} onSearch={() => {}} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });
});

// ---------- MobileNumberInput ----------
describe('MobileNumberInput（数字步进器）', () => {
  it('加减按钮与上下限钳制', () => {
    const onChange = vi.fn();
    const { rerender } = render(<MobileNumberInput label="数量" value={5} min={0} max={10} onChange={onChange} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]); // plus
    expect(onChange).toHaveBeenLastCalledWith(6);
    fireEvent.click(buttons[0]); // minus
    expect(onChange).toHaveBeenLastCalledWith(4);
    // 上限：value=max → plus 禁用
    rerender(<MobileNumberInput value={10} min={0} max={10} onChange={onChange} />);
    expect(buttons[1]).toBeDisabled();
    // 下限：value=min → minus 禁用
    rerender(<MobileNumberInput value={0} min={0} max={10} onChange={onChange} />);
    expect(buttons[0]).toBeDisabled();
    // 直接输入钳制
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '999' } });
    expect(onChange).toHaveBeenLastCalledWith(10);
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(onChange).toHaveBeenLastCalledWith(0);
    // 禁用
    rerender(<MobileNumberInput value={5} disabled onChange={onChange} />);
    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });
});

// ---------- Swipeable ----------
describe('Swipeable（滑动手势）', () => {
  const setup = (threshold = 50) => {
    const handlers = {
      left: vi.fn(),
      right: vi.fn(),
      up: vi.fn(),
      down: vi.fn(),
    };
    const { getByText } = render(
      <Swipeable
        threshold={threshold}
        onSwipeLeft={handlers.left}
        onSwipeRight={handlers.right}
        onSwipeUp={handlers.up}
        onSwipeDown={handlers.down}
      >
        <div>滑动区</div>
      </Swipeable>,
    );
    return { handlers, el: getByText('滑动区').parentElement as HTMLElement };
  };

  it('向左滑（deltaX > 0）', () => {
    const { handlers, el } = setup();
    fireEvent.touchStart(el, touch([{ x: 200, y: 100 }]));
    fireEvent.touchMove(el, touch([{ x: 100, y: 100 }]));
    fireEvent.touchEnd(el, touch([]));
    expect(handlers.left).toHaveBeenCalledTimes(1);
    expect(handlers.right).not.toHaveBeenCalled();
  });

  it('向右滑（deltaX < 0）', () => {
    const { handlers, el } = setup();
    fireEvent.touchStart(el, touch([{ x: 100, y: 100 }]));
    fireEvent.touchMove(el, touch([{ x: 200, y: 100 }]));
    fireEvent.touchEnd(el, touch([]));
    expect(handlers.right).toHaveBeenCalledTimes(1);
  });

  it('向上滑（deltaY > 0）', () => {
    const { handlers, el } = setup();
    fireEvent.touchStart(el, touch([{ x: 100, y: 200 }]));
    fireEvent.touchMove(el, touch([{ x: 100, y: 100 }]));
    fireEvent.touchEnd(el, touch([]));
    expect(handlers.up).toHaveBeenCalledTimes(1);
  });

  it('向下滑（deltaY < 0）', () => {
    const { handlers, el } = setup();
    fireEvent.touchStart(el, touch([{ x: 100, y: 100 }]));
    fireEvent.touchMove(el, touch([{ x: 100, y: 220 }]));
    fireEvent.touchEnd(el, touch([]));
    expect(handlers.down).toHaveBeenCalledTimes(1);
  });

  it('低于阈值不触发', () => {
    const { handlers, el } = setup(300);
    fireEvent.touchStart(el, touch([{ x: 200, y: 100 }]));
    fireEvent.touchMove(el, touch([{ x: 100, y: 100 }]));
    fireEvent.touchEnd(el, touch([]));
    expect(handlers.left).not.toHaveBeenCalled();
  });

  it('preventDefaultTouchmove 开启时滑动仍触发回调', () => {
    const handlers = { left: vi.fn() };
    const { getByText } = render(
      <Swipeable preventDefaultTouchmove onSwipeLeft={handlers.left}>
        <div>滑动区</div>
      </Swipeable>,
    );
    const el = getByText('滑动区').parentElement as HTMLElement;
    fireEvent.touchStart(el, touch([{ x: 200, y: 100 }]));
    fireEvent.touchMove(el, touch([{ x: 100, y: 100 }]));
    fireEvent.touchEnd(el, touch([]));
    expect(handlers.left).toHaveBeenCalledTimes(1);
  });

  it('无回调时四方向滑动不抛错', () => {
    const { getByText } = render(
      <Swipeable>
        <div>静默区</div>
      </Swipeable>,
    );
    const el = getByText('静默区').parentElement as HTMLElement;
    // 左
    fireEvent.touchStart(el, touch([{ x: 200, y: 100 }]));
    fireEvent.touchMove(el, touch([{ x: 100, y: 100 }]));
    fireEvent.touchEnd(el, touch([]));
    // 右
    fireEvent.touchStart(el, touch([{ x: 100, y: 100 }]));
    fireEvent.touchMove(el, touch([{ x: 200, y: 100 }]));
    fireEvent.touchEnd(el, touch([]));
    // 上
    fireEvent.touchStart(el, touch([{ x: 100, y: 200 }]));
    fireEvent.touchMove(el, touch([{ x: 100, y: 100 }]));
    fireEvent.touchEnd(el, touch([]));
    // 下
    fireEvent.touchStart(el, touch([{ x: 100, y: 100 }]));
    fireEvent.touchMove(el, touch([{ x: 100, y: 220 }]));
    fireEvent.touchEnd(el, touch([]));
  });
});

// ---------- PinchZoom ----------
describe('PinchZoom（双指缩放）', () => {
  it('放大/缩小/边界钳制与回调', () => {
    const onZoomChange = vi.fn();
    const { getByText } = render(
      <PinchZoom maxScale={3} minScale={0.5} onZoomChange={onZoomChange}>
        <div>缩放内容</div>
      </PinchZoom>,
    );
    const el = getByText('缩放内容').parentElement?.parentElement as HTMLElement;
    // 放大：双指从 100px 张到 200px
    fireEvent.touchStart(el, touch([{ x: 0, y: 0 }, { x: 100, y: 0 }]));
    fireEvent.touchMove(el, touch([{ x: 0, y: 0 }, { x: 200, y: 0 }]));
    expect(onZoomChange).toHaveBeenLastCalledWith(2);
    // 再放大被 maxScale=3 钳制（200→300 ×2 = 4 → clamp 3）
    fireEvent.touchMove(el, touch([{ x: 0, y: 0 }, { x: 300, y: 0 }]));
    expect(onZoomChange).toHaveBeenLastCalledWith(3);
    // 缩小
    fireEvent.touchStart(el, touch([{ x: 0, y: 0 }, { x: 300, y: 0 }]));
    fireEvent.touchMove(el, touch([{ x: 0, y: 0 }, { x: 150, y: 0 }]));
    expect(onZoomChange).toHaveBeenLastCalledWith(1.5);
    // 缩到 min 以下钳制
    fireEvent.touchMove(el, touch([{ x: 0, y: 0 }, { x: 10, y: 0 }]));
    expect(onZoomChange).toHaveBeenLastCalledWith(0.5);
    // 单指触摸不缩放
    const calls = onZoomChange.mock.calls.length;
    fireEvent.touchStart(el, touch([{ x: 0, y: 0 }]));
    fireEvent.touchMove(el, touch([{ x: 50, y: 0 }]));
    expect(onZoomChange.mock.calls.length).toBe(calls);
    fireEvent.touchEnd(el, touch([]));
    // 无 touchStart 直接双指 move（initialDistance null 守卫）
    fireEvent.touchMove(el, touch([{ x: 0, y: 0 }, { x: 500, y: 0 }]));
    expect(onZoomChange.mock.calls.length).toBe(calls);
    // 无 onZoomChange 回调时不抛错
    const { getByText: g2 } = render(
      <PinchZoom>
        <div>静默缩放</div>
      </PinchZoom>,
    );
    const el2 = g2('静默缩放').parentElement?.parentElement as HTMLElement;
    fireEvent.touchStart(el2, touch([{ x: 0, y: 0 }, { x: 100, y: 0 }]));
    fireEvent.touchMove(el2, touch([{ x: 0, y: 0 }, { x: 200, y: 0 }]));
    fireEvent.touchEnd(el2, touch([]));
  });
});

// ---------- PullToRefresh ----------
describe('PullToRefresh（下拉刷新）', () => {
  it('拉满触发刷新；不足阈值不触发', async () => {
    const onRefresh = vi.fn(async () => {});
    const { getByText } = render(
      <PullToRefresh onRefresh={onRefresh} pullDistance={80}>
        <div>列表内容</div>
      </PullToRefresh>,
    );
    const el = getByText('列表内容').parentElement?.parentElement as HTMLElement;
    // 拉不足 → 不刷新
    fireEvent.touchStart(el, touch([{ x: 0, y: 100 }]));
    fireEvent.touchMove(el, touch([{ x: 0, y: 140 }]));
    expect(getByText('下拉刷新')).toBeInTheDocument();
    fireEvent.touchEnd(el, touch([]));
    expect(onRefresh).not.toHaveBeenCalled();
    // 拉满（200 diff × 0.5 = 100 ≥ 80）→ 释放刷新 → 刷新中
    fireEvent.touchStart(el, touch([{ x: 0, y: 100 }]));
    fireEvent.touchMove(el, touch([{ x: 0, y: 300 }]));
    expect(getByText('释放刷新')).toBeInTheDocument();
    fireEvent.touchEnd(el, touch([]));
    await waitFor(() => expect(onRefresh).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(getByText('下拉刷新')).toBeInTheDocument());
  });

  it('页面非顶部/上移时不进入拉动状态', async () => {
    const onRefresh = vi.fn(async () => {});
    const { getByText } = render(
      <PullToRefresh onRefresh={onRefresh} pullDistance={80}>
        <div>页面内容</div>
      </PullToRefresh>,
    );
    const el = getByText('页面内容').parentElement?.parentElement as HTMLElement;
    // 非页面顶部 → touchStart 不置位 isPulling → move/end 全空转
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 200 });
    fireEvent.touchStart(el, touch([{ x: 0, y: 100 }]));
    fireEvent.touchMove(el, touch([{ x: 0, y: 400 }]));
    fireEvent.touchEnd(el, touch([]));
    expect(onRefresh).not.toHaveBeenCalled();
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    // 顶部但上移（diff ≤ 0）→ pullY 保持 0
    fireEvent.touchStart(el, touch([{ x: 0, y: 200 }]));
    fireEvent.touchMove(el, touch([{ x: 0, y: 100 }]));
    expect(getByText('下拉刷新')).toBeInTheDocument();
    fireEvent.touchEnd(el, touch([]));
    expect(onRefresh).not.toHaveBeenCalled();
  });
});

// ---------- MobileDataLoader ----------
describe('MobileDataLoader（移动端数据加载器）', () => {
  const makeFetch = (pages: number[][]) => {
    return vi.fn(async (page: number) => {
      const data = pages[page - 1];
      if (!data) throw new Error('no page');
      return data.map((n) => ({ id: `id-${page}-${n}`, name: `条目${page}-${n}` }));
    });
  };

  const item = (i: { id: string; name: string }) => <div key={i.id}>{i.name}</div>;

  it('初始加载渲染列表', async () => {
    const fetchData = makeFetch([[1, 2, 3]]);
    render(
      <MobileDataLoader
        fetchData={fetchData}
        renderItem={item}
        keyExtractor={(i) => i.id}
      />,
    );
    expect(await screen.findByText('条目1-1')).toBeInTheDocument();
    expect(screen.getByText('条目1-3')).toBeInTheDocument();
    // 单页不满 limit → 无加载更多
    expect(screen.queryByText('加载更多')).not.toBeInTheDocument();
  });

  it('空数据态', async () => {
    render(
      <MobileDataLoader
        fetchData={vi.fn(async () => [])}
        renderItem={item}
        keyExtractor={(i) => i.id}
        emptyMessage="空空如也"
      />,
    );
    expect(await screen.findByText('空空如也')).toBeInTheDocument();
  });

  it('加载失败→重试恢复', async () => {
    let fail = true;
    const fetchData = vi.fn(async () => {
      if (fail) throw new Error('boom');
      return [{ id: 'ok-1', name: '恢复条目' }];
    });
    render(
      <MobileDataLoader
        fetchData={fetchData}
        renderItem={item}
        keyExtractor={(i) => i.id}
        errorMessage="网络出错了"
      />,
    );
    expect(await screen.findByText('网络出错了')).toBeInTheDocument();
    fail = false;
    fireEvent.click(await screen.findByText('重试'));
    expect(await screen.findByText('恢复条目')).toBeInTheDocument();
  });

  it('分页加载更多与「已加载全部数据」', async () => {
    const fetchData = makeFetch([
      Array.from({ length: 2 }, (_, i) => i),
      Array.from({ length: 2 }, (_, i) => i + 10),
      [20],
    ]);
    render(
      <MobileDataLoader
        fetchData={fetchData}
        renderItem={item}
        keyExtractor={(i) => i.id}
        initialLimit={2}
        loadMoreLimit={2}
      />,
    );
    expect(await screen.findByText('条目1-0')).toBeInTheDocument();
    fireEvent.click(await screen.findByText('加载更多'));
    expect(await screen.findByText('条目2-11')).toBeInTheDocument();
    // 第二页满额 → 仍有加载更多；第三页 1 条不足 → hasMore false
    fireEvent.click(await screen.findByText('加载更多'));
    expect(await screen.findByText('条目3-20')).toBeInTheDocument();
    expect(await screen.findByText('已加载全部数据')).toBeInTheDocument();
    // hasMore=false 时滚动不再触发加载
    fireEvent.scroll(window);
    expect(fetchData).toHaveBeenCalledTimes(3);
  });

  it('hasMore 时滚动到底触发翻页', async () => {
    const fetchData = makeFetch([
      Array.from({ length: 2 }, (_, i) => i),
      Array.from({ length: 2 }, (_, i) => i + 10),
      Array.from({ length: 2 }, (_, i) => i + 20),
    ]);
    render(
      <MobileDataLoader
        fetchData={fetchData}
        renderItem={item}
        keyExtractor={(i) => i.id}
        initialLimit={2}
        loadMoreLimit={2}
      />,
    );
    await screen.findByText('条目1-0');
    // 页面内容远高于视口 → 滚动位置判据不满足 → 不翻页
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 50000,
    });
    fireEvent.scroll(window);
    expect(fetchData).toHaveBeenCalledTimes(1);
    // 恢复可滚动到底 → 触发翻页
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 100,
    });
    fireEvent.scroll(window);
    await screen.findByText('条目2-10');
    expect(fetchData).toHaveBeenCalledTimes(2);
  });

  it('加载更多时滚动不重复触发（isLoadingMore 守卫）', async () => {
    let resolveSecond: ((v: { id: string; name: string }[]) => void) | null = null;
    const fetchData = vi.fn(async (page: number) => {
      if (page === 1) return [{ id: 'a', name: '首屏' }];
      return new Promise<{ id: string; name: string }[]>((resolve) => {
        resolveSecond = resolve;
      });
    });
    render(
      <MobileDataLoader
        fetchData={fetchData}
        renderItem={item}
        keyExtractor={(i) => i.id}
        initialLimit={1}
        loadMoreLimit={1}
      />,
    );
    await screen.findByText('首屏');
    fireEvent.scroll(window);
    await waitFor(() => expect(fetchData).toHaveBeenCalledTimes(2));
    // 翻页进行中再滚动 → 守卫直接 return
    fireEvent.scroll(window);
    expect(fetchData).toHaveBeenCalledTimes(2);
    resolveSecond?.([{ id: 'b', name: '次屏' }]);
    await screen.findByText('次屏');
  });
});

// ---------- OfflineInitializationSupport ----------
describe('OfflineInitializationSupport（离线初始化支持）', () => {
  it('在线态：能力检查完成后展示状态卡', async () => {
    render(<OfflineInitializationSupport />);
    // 检查中（indexedDB 在 jsdom 缺失 → catch 分支）
    expect(screen.getByText('网络状态')).toBeInTheDocument();
    expect(await screen.findByText(/离线功能|部分离线/)).toBeInTheDocument();
    expect(screen.getByText('在线')).toBeInTheDocument();
  });

  it('离线态：能力清单 + 启用离线模式（写缓存 + 派发事件）', async () => {
    setNavigatorOnline(false);
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    render(<OfflineInitializationSupport />);
    expect(screen.getByText('网络连接不可用')).toBeInTheDocument();
    expect(screen.getByText('正在启用离线模式...')).toBeInTheDocument();
    expect(screen.getAllByText(/可用|不可用/).length).toBeGreaterThanOrEqual(4);
    localStorage.setItem('user_preferences', '{"theme":"dark"}');
    fireEvent.click(screen.getByRole('button', { name: /启用离线模式/ }));
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'enableOfflineMode' }),
    );
    expect(JSON.parse(localStorage.getItem('app_cached_data') || '{}').offlineMode).toBe(true);
  });
});

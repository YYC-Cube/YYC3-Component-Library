// ============================================================
// @tanstack/react-virtual 的 jsdom 测试替身（仅测试链路使用）
// ============================================================
// 根因：jsdom 无布局计算（getBoundingClientRect / clientHeight 恒为 0），
// 真身 useVirtualizer 量不到视口 → getVirtualItems() 恒为空、消息气泡永不渲染。
// 按任务裁决（D0 测试版未自带 mock）挂此几何固定的窗口化模拟：
// - 视口 400px · 项高 80px（与配套测试 expectedVisibleCount = ceil(400/80)+5 对齐）
// - 响应 scrollElement 的 scroll 事件（滚动窗口化断言依赖）
// - 小列表（≤ 阈值）全量渲染（配套测试对 34 条以内的列表断言全部可见）
// 供各测试文件 `vi.mock('@tanstack/react-virtual', async () => await import(...))` 引用。
// ============================================================

import * as React from 'react';

const VIEWPORT_HEIGHT = 400;
const ITEM_HEIGHT = 80;
const OVERSCAN = 3;
const FULL_RENDER_THRESHOLD = 50;

export interface VirtualItem {
  key: number;
  index: number;
  start: number;
  size: number;
}

export interface VirtualizerOptions {
  count?: number;
  getScrollElement?: () => HTMLElement | null;
  // 真身其余选项（estimateSize/overscan/scrollMargin）在替身中不参与几何计算
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [option: string]: any;
}

export interface VirtualizerInstance {
  getTotalSize: () => number;
  getVirtualItems: () => VirtualItem[];
}

export function useVirtualizer(options: VirtualizerOptions): VirtualizerInstance {
  const count = options.count ?? 0;
  // 滚动事件触发的强制重渲染（真身由内部订阅机制驱动）
  const [, setScrollTick] = React.useState(0);

  React.useEffect(() => {
    const scrollElement = options.getScrollElement?.() ?? null;
    if (!scrollElement) return undefined;

    const handleScroll = () => setScrollTick(tick => tick + 1);
    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  });

  const getTotalSize = React.useCallback(() => count * ITEM_HEIGHT, [count]);

  const getVirtualItems = React.useCallback((): VirtualItem[] => {
    if (count <= 0) return [];

    // 小列表：跳过窗口化，全量渲染
    if (count <= FULL_RENDER_THRESHOLD) {
      return Array.from({ length: count }, (_, index) => ({
        key: index,
        index,
        start: index * ITEM_HEIGHT,
        size: ITEM_HEIGHT,
      }));
    }

    const scrollTop = options.getScrollElement?.()?.scrollTop ?? 0;
    const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ITEM_HEIGHT);
    const visibleStart = Math.min(
      Math.floor(scrollTop / ITEM_HEIGHT),
      Math.max(0, count - visibleCount)
    );
    const start = Math.max(0, visibleStart - OVERSCAN);
    const end = Math.min(count, visibleStart + visibleCount + OVERSCAN);

    const items: VirtualItem[] = [];
    for (let index = start; index < end; index++) {
      items.push({ key: index, index, start: index * ITEM_HEIGHT, size: ITEM_HEIGHT });
    }
    return items;
    // getScrollElement 由调用方以保证稳定的 ref 回调传入，不纳入依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return { getTotalSize, getVirtualItems };
}

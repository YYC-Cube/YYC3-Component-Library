// ============================================================
// YYC³ · @yyc3/admin 测试共享桩（批次 1 · 2026-11-27）
// jsdom 缺口复用 @yyc3/ui 批次 1 桩库（跨包相对导入，零拷贝）：
// Pointer Capture / matchMedia / ResizeObserver / IntersectionObserver /
// elementFromPoint / console 静音。
// admin 专属增量：next-navigation / next-themes / recharts / framer-motion
// 模块工厂——vi.mock 工厂延迟求值需自包含，故经动态 import 引入本文件，
// 用法（测试文件顶部）：
//   vi.mock('next-themes', async () => (await import('./helpers')).nextThemesModule())
// ============================================================
import {
  stubPointerCapture,
  stubMatchMedia,
  stubResizeObserver,
  stubIntersectionObserver,
  stubElementFromPoint,
  silenceConsole,
} from '../../../ui/src/__tests__/helpers';

export {
  stubPointerCapture,
  stubMatchMedia,
  stubResizeObserver,
  stubIntersectionObserver,
  stubElementFromPoint,
  silenceConsole,
};

import { vi } from 'vitest';
import React from 'react';

/** 一次性挂齐 admin 组件渲染所需的 jsdom 桩（beforeEach 调用）。
 * 注意：IntersectionObserver 不在此挂——需要手动驱动的组件用
 * stubControllableIntersectionObserver（ui 版非 configurable，二次 define 会炸） */
export function stubAdminDom() {
  stubPointerCapture();
  stubMatchMedia();
  stubResizeObserver();
  stubElementFromPoint();
}

/** next/navigation 替身模块（页面级组件客户端路由依赖） */
export function nextNavigationModule() {
  return {
    usePathname: () => '/admin',
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    }),
    useParams: () => ({}),
    useSearchParams: () => new URLSearchParams(),
    useSelectedLayoutSegment: () => null,
  };
}

/** next-themes 替身模块（theme-provider / 设置面板依赖） */
export function nextThemesModule() {
  return {
    ThemeProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useTheme: () => ({
      theme: 'light',
      systemTheme: 'light',
      resolvedTheme: 'light',
      setTheme: vi.fn(),
      themes: ['light', 'dark', 'system'],
      forcedTheme: undefined,
    }),
  };
}

/** recharts 替身模块：jsdom 无尺寸 ResponsiveContainer 不渲染子图，
 * tspan/textPath 等字符测量缺 API 会炸——统一换成轻量透壳桩 */
export async function rechartsModule() {
  const ReactMod = await import('react');
  const Actual = await import('recharts').catch(() => ({}) as Record<string, unknown>);
  const passthrough = (name: string) =>
    function Mocked(props: Record<string, unknown>) {
      const { children, ...rest } = props;
      return ReactMod.createElement(
        'div',
        { 'data-testid': `recharts-${name.toLowerCase()}`, ...rest },
        children as React.ReactNode,
      );
    };
  const names = [
    'ResponsiveContainer',
    'LineChart',
    'BarChart',
    'AreaChart',
    'PieChart',
    'RadialBarChart',
    'RadarChart',
    'ScatterChart',
    'ComposedChart',
    'Line',
    'Bar',
    'Area',
    'Pie',
    'Cell',
    'XAxis',
    'YAxis',
    'CartesianGrid',
    'Tooltip',
    'Legend',
    'RadialBar',
    'PolarAngleAxis',
    'PolarGrid',
    'Radar',
    'Scatter',
    'ZAxis',
    'Brush',
    'ReferenceLine',
    'ReferenceArea',
    'ReferenceDot',
    'LabelList',
    'Label',
    'Text',
    'ErrorBar',
  ];
  const mock: Record<string, unknown> = {};
  for (const n of names) mock[n] = passthrough(n);
  return { ...Actual, ...mock };
}

/** framer-motion 替身：jsdom 无 rAF 动画循环，motion.* 直接透壳渲染 */
export async function framerMotionModule() {
  const ReactMod = await import('react');
  const Actual = await import('framer-motion').catch(() => ({}) as Record<string, unknown>);
  const motionProxy = new Proxy(
    {},
    {
      get: (_t, tag: string) =>
        function MockMotion(props: Record<string, unknown>) {
          const { children, ...rest } = props;
          return ReactMod.createElement(tag, rest, children as React.ReactNode);
        },
    },
  );
  return {
    ...Actual,
    motion: motionProxy,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useInView: () => true,
    useAnimation: () => ({ start: vi.fn(async () => undefined), stop: vi.fn(), set: vi.fn() }),
    useMotionValue: (initial: number) => ({ get: () => initial, set: vi.fn(), on: vi.fn() }),
    useTransform: (mv: unknown) => mv,
    useScroll: () => ({
      scrollY: { get: () => 0, on: vi.fn() },
      scrollYProgress: { get: () => 0, on: vi.fn() },
    }),
  };
}

/** 手动驱动 IntersectionObserver：捕获回调后可同步触发视图进出 */
export function stubControllableIntersectionObserver() {
  const callbacks: IntersectionObserverCallback[] = [];
  class IO {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    takeRecords = vi.fn(() => [])
    constructor(cb: IntersectionObserverCallback) {
      callbacks.push(cb);
    }
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IO,
  });
  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IO,
  });
  return {
    /** 触发全部已注册回调（模拟元素进入视口） */
    intersect(isIntersecting = true) {
      for (const cb of callbacks) cb([{ isIntersecting } as IntersectionObserverEntry], IO as never);
    },
  };
}

/** navigator.onLine 可写桩（offline/online 事件不会自动翻转该值） */
export function setNavigatorOnline(online: boolean) {
  Object.defineProperty(window.navigator, 'onLine', {
    writable: true,
    configurable: true,
    value: online,
  });
}

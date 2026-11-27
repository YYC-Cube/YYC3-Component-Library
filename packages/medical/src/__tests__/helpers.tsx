// ============================================================
// YYC³ · @yyc3/medical 测试共享桩（批次 1 · 2026-11-27）
// jsdom 缺口复用 @yyc3/ui 批次 1 桩库（跨包相对导入，零拷贝）：
// Pointer Capture / matchMedia / ResizeObserver / IntersectionObserver /
// elementFromPoint / console 静音。
// medical 专属增量：next-navigation / next/dynamic / recharts / recharts 兜底
// 模块工厂——vi.mock 工厂延迟求值需自包含，故经动态 import 引入本文件，
// 用法（测试文件顶部）：
//   vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
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

/** 一次性挂齐 medical 组件渲染所需的 jsdom 桩（beforeEach 调用） */
export function stubMedicalDom() {
  stubPointerCapture();
  stubMatchMedia();
  stubResizeObserver();
  stubElementFromPoint();
}

/** next/navigation 替身模块（页面级组件客户端路由依赖） */
export function nextNavigationModule() {
  return {
    usePathname: () => '/medical',
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

/** next/link 替身：jsdom 无路由，Link 透壳成 <a>（不依赖 router context） */
export async function nextLinkModule() {
  const ReactMod = await import('react');
  return {
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    default: function MockLink(props: {
      href: string | { pathname?: string };
      children?: React.ReactNode;
      prefetch?: unknown;
      replace?: unknown;
      [k: string]: unknown;
    }) {
      const { href, children, ...rest } = props;
      const resolved =
        typeof href === 'string' ? href : href?.pathname ?? '/';
      return ReactMod.createElement(
        'a',
        { href: resolved, ...rest },
        children as React.ReactNode,
      );
    },
  };
}

/** next/dynamic 替身：jsdom 下 ssr:false + loading 会让断言时序不稳——
 * 同步解析 loader（vi.mock 工厂返回前先 await loader），
 * 渲染真组件；loader 抛错时回退空壳，不拖垮渲染 */
export async function nextDynamicModule() {
  const ReactMod = await import('react');
  function makeDynamic(
    loader: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>,
  ) {
    const Loaded = ReactMod.lazy(() =>
      loader().catch(() => ({ default: () => null })),
    );
    return function DynamicComponent(props: Record<string, unknown>) {
      return ReactMod.createElement(
        ReactMod.Suspense,
        { fallback: ReactMod.createElement('div', { 'data-testid': 'next-dynamic-loading' }) },
        ReactMod.createElement(Loaded, props),
      );
    };
  }
  return { default: makeDynamic };
}

/** recharts 替身模块：jsdom 无尺寸 ResponsiveContainer 不渲染子图，
 * tspan/textPath 等字符测量缺 API 会炸——统一换成轻量透壳桩
 * （与 admin 批次 1 同一工厂语义，跨包复制自 admin helpers） */
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

/** canvas 2d 替身（dicom-viewer / interactive-image-annotation 等医疗影像组件）：
 * jsdom 不实现 2d context——统一桩出绘图 API 面 */
export function stubCanvas2d() {
  const ctx2d = {
    canvas: { width: 300, height: 150 },
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    rect: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    translate: vi.fn(),
    clip: vi.fn(),
    quadraticCurveTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    createPattern: vi.fn(() => null),
  };
  const proto = (globalThis as { HTMLCanvasElement?: unknown }).HTMLCanvasElement as
    | (new () => { getContext: (kind: string) => unknown; width: number; height: number })
    | undefined;
  if (!proto) return;
  Object.defineProperty(proto.prototype, 'getContext', {
    writable: true,
    configurable: true,
    value: (kind: string) => (kind === '2d' ? ctx2d : null),
  });
}

/** fetch 替身（services / useApi / model-integration 数据面）：
 * jsonResponse 按 URL 前缀路由，未命中返回 200 空对象 */
export function stubFetchRouter(
  routes: Record<string, unknown>,
  defaultBody: unknown = {},
) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    for (const [prefix, body] of Object.entries(routes)) {
      if (url.includes(prefix)) {
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => body,
        } as unknown as Response;
      }
    }
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => defaultBody,
    } as unknown as Response;
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

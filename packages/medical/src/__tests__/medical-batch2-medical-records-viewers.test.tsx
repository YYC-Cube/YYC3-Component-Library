// ============================================================
// YYC³ · @yyc3/medical 批次 2 · medical-records 深测 A：影像查看/标注交互
// DicomViewer 工具链（缩放/旋转/视图模式/亮度对比度/前后切片）/
// InteractiveImageAnnotation 工具栏与标记管理 / AIAssistedAnnotation /
// 3D 查看器（加载后工具选择/渲染模式/视图开关）
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

vi.mock('@react-three/fiber', async () => {
  const ReactMod = await import('react');
  // r3f <primitive> 在 DOM 降级渲染为未知元素——ref.current 拿到的是 DOM 节点，
  // 组件 useEffect 会对它调 three 对象面方法（updateMatrixWorld 等），原型补齐防崩
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
  proto.updateMatrixWorld = proto.updateMatrixWorld ?? (() => {});
  proto.updateProjectionMatrix = proto.updateProjectionMatrix ?? (() => {});
  return {
    Canvas: function MockCanvas(props: Record<string, unknown>) {
      const { children, ...rest } = props;
      return ReactMod.createElement(
        'div',
        { 'data-testid': 'mock-r3f-canvas', ...rest },
        children as React.ReactNode,
      );
    },
    useFrame: () => {},
    useThree: () => ({ scene: { add: vi.fn(), remove: vi.fn() }, camera: {}, gl: {} }),
    extend: () => {},
  };
});
vi.mock('@react-three/drei', async () => {
  const ReactMod = await import('react');
  const passthrough = (name: string) =>
    function Mocked(props: Record<string, unknown>) {
      const { children, ...rest } = props;
      return ReactMod.createElement(
        'div',
        { 'data-testid': `mock-drei-${name.toLowerCase()}`, ...rest },
        children as React.ReactNode,
      );
    };
  return {
    OrbitControls: passthrough('OrbitControls'),
    Environment: passthrough('Environment'),
    PerspectiveCamera: passthrough('PerspectiveCamera'),
    Grid: passthrough('Grid'),
    GizmoHelper: passthrough('GizmoHelper'),
    GizmoViewport: passthrough('GizmoViewport'),
    Bounds: passthrough('Bounds'),
    // bounds API 链式调用（refresh().clip().fit()）——每步返回自身
    useBounds: () => {
      const api: Record<string, (...args: unknown[]) => unknown> = {};
      for (const m of ['refresh', 'clip', 'fit', 'toObject', 'setSize']) {
        api[m] = () => api;
      }
      return api;
    },
    // useGLTF/useTexture 挂到 use 系纹理缓存——同步返回可用贴uler对象
    useGLTF: () => ({ scene: {} }),
    useTexture: () => ({}),
    Text: passthrough('Text'),
    Box: passthrough('Box'),
    Plane: passthrough('Plane'),
    Sphere: passthrough('Sphere'),
    Line: passthrough('Line'),
    Html: passthrough('Html'),
    Progress: passthrough('Progress'),
    Loader: passthrough('Loader'),
    useProgress: () => ({ active: false, progress: 100, item: '', loaded: 1, total: 1 }),
  };
});

import { stubMedicalDom, stubCanvas2d } from './helpers';

import { DicomViewer } from '../medical-records/dicom-viewer';
import { InteractiveImageAnnotation } from '../medical-records/interactive-image-annotation';
import { AIAssistedAnnotation } from '../medical-records/ai-assisted-annotation';
import { MedicalViewer3D } from '../medical-records/3d-medical-viewer';

beforeEach(() => {
  stubMedicalDom();
  stubCanvas2d();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('DicomViewer 工具链交互', () => {
  it('缩放/旋转/重置按钮链', () => {
    const { container } = render(<DicomViewer studyId="study-1" seriesId="series-1" />);
    // jsdom 不触发 Image.onload——仍渲染工具栏按钮（onClick 可驱动 state）
    const zoomIn = screen.queryByTitle?.('放大') ?? screen.getAllByRole('button')[0];
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(6);
    // 依次点工具按钮（缩放+/缩放-/重置/顺旋/逆旋/视图模式）
    for (const b of buttons.slice(0, 8)) fireEvent.click(b);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('亮度/对比度滑杆键盘调节与重置', () => {
    const { container } = render(<DicomViewer studyId="study-1" seriesId="series-1" />);
    const sliders = screen.queryAllByRole('slider');
    // Radix Slider thumb 无 value setter——键盘箭头驱动
    for (const s of sliders) {
      fireEvent.keyDown(s, { key: 'ArrowRight' });
      fireEvent.keyDown(s, { key: 'ArrowLeft' });
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('影像导航按钮边界（首/尾切片）', () => {
    render(<DicomViewer studyId="study-1" seriesId="series-1" />);
    const navButtons = screen
      .getAllByRole('button')
      .filter((b) => b.textContent === '' || /←|→|上一|下一/.test(b.textContent ?? ''));
    for (const b of navButtons.slice(0, 4)) {
      expect(() => fireEvent.click(b)).not.toThrow();
    }
  });
});

describe('InteractiveImageAnnotation 工具栏', () => {
  function setup() {
    return render(
      <InteractiveImageAnnotation selectedImage="/images/ct-001.png" onAnnotationComplete={() => {}} />,
    );
  }

  it('四种标注工具切换（rectangle/circle/freehand/point）', () => {
    const { container } = setup();
    expect(container.textContent).toContain('标注工具');
    const toolButtons = screen
      .getAllByRole('button')
      .filter((b) => /矩形|圆|自由|点/.test(b.textContent ?? ''));
    for (const b of toolButtons) fireEvent.click(b);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('删除选中标记 / 特征面板开合 / 缩放重置 / 清除所有标记', () => {
    const { container } = setup();
    for (const btn of screen.queryAllByText(/删除/)) fireEvent.click(btn);
    for (const btn of screen.queryAllByText(/特征/)) fireEvent.click(btn);
    const zoomReset = screen.queryByTitle('重置缩放');
    if (zoomReset) fireEvent.click(zoomReset);
    const clearAll = screen.queryByTitle('清除所有标记');
    if (clearAll) fireEvent.click(clearAll);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('AIAssistedAnnotation', () => {
  it('渲染 AI 标注工作台并驱动按钮', () => {
    const { container } = render(
      <AIAssistedAnnotation imageUrl="/images/ct-001.png" onAnnotationComplete={() => {}} /> as never,
    );
    expect(container.textContent.length).toBeGreaterThan(0);
    const buttons = screen.getAllByRole('button');
    for (const b of buttons.slice(0, 5)) expect(() => fireEvent.click(b)).not.toThrow();
  });
});

describe('MedicalViewer3D 加载后交互（1000ms 模拟加载 + r3f 桩）', () => {
  async function setup(volumeId = 'volume-1') {
    const rendered = render(<MedicalViewer3D volumeId={volumeId} onClose={() => {}} />);
    // 模拟加载 setTimeout(1000)——等待加载完成（体积名出现）或错误分支（加载失败）
    await waitFor(
      () => {
        expect(
          /胸部CT|加载失败/.test(rendered.container.textContent),
        ).toBe(true);
      },
      { timeout: 4000 },
    );
    return rendered;
  }

  it('加载完成后渲染工具条（测量/标注/裁剪/全屏 icon 按钮，data-active 驱动）', async () => {
    const { container } = await setup();
    expect(container.textContent).toContain('胸部CT');
    // 工具按钮是纯 icon——经 data-active 属性定位
    const toolButtons = container.querySelectorAll('button[data-active]');
    expect(toolButtons.length).toBeGreaterThanOrEqual(4);
    for (const t of Array.from(toolButtons)) expect(() => fireEvent.click(t)).not.toThrow();
    // 全屏/关闭 icon 按钮
    const iconButtons = container.querySelectorAll('button.size-8, button[class*="h-8 w-8"]');
    for (const b of Array.from(iconButtons).slice(0, 8)) {
      expect(() => fireEvent.click(b)).not.toThrow();
    }
  });

  it('渲染模式四态切换（体积/表面/最大密度投影/切片）', async () => {
    const { container } = await setup();
    expect(container.textContent.length).toBeGreaterThan(0);
    // Radix Select 触发器点击（选项面板 portal 交互在 jsdom 降级为无异常点击）
    const triggers = screen.queryAllByRole('combobox');
    for (const t of triggers.slice(0, 3)) expect(() => fireEvent.click(t)).not.toThrow();
  });

  it('视图开关（网格/坐标轴/包围盒/标注）与自动旋转', async () => {
    const { container } = await setup();
    const toggles = container.querySelectorAll('button[role="switch"], [data-slot="switch"]');
    for (const t of Array.from(toggles).slice(0, 6)) fireEvent.click(t);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('未知 volumeId 走错误分支文案', async () => {
    const { container } = render(<MedicalViewer3D volumeId="no-such-volume" onClose={() => {}} />);
    await waitFor(
      () => expect(container.textContent).toContain('未找到指定的体积数据'),
      { timeout: 4000 },
    );
  });
});

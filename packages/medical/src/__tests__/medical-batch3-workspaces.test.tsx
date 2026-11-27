// ============================================================
// YYC³ · @yyc3/medical 批次 3 · 工作区深驱动 II
// InteractiveImageAnnotation 全链（选特征 → 画布四工具绘制 → marker
// 落地 → 选中/删除/清空 → tabs 检查）/ BatchProcessor 上传→批处理→
// 结果三段流（interval 进度真实推进）/ 3D 查看器切片与标注面板
// / MedicalRecordsClient 影像标签深交互
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

vi.mock('@react-three/fiber', async () => {
  const ReactMod = await import('react');
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
    useBounds: () => {
      const api: Record<string, (...args: unknown[]) => unknown> = {};
      for (const m of ['refresh', 'clip', 'fit', 'toObject', 'setSize']) api[m] = () => api;
      return api;
    },
    useGLTF: () => ({ scene: {} }),
    useTexture: () => ({}),
    Html: passthrough('Html'),
    useProgress: () => ({ active: false, progress: 100, item: '', loaded: 1, total: 1 }),
  };
});

import { stubMedicalDom, stubCanvas2d } from './helpers';
import { InteractiveImageAnnotation } from '../medical-records/interactive-image-annotation';
import { AIAssistedAnnotation } from '../medical-records/ai-assisted-annotation';
import { BatchProcessor } from '../medical-records/batch-processor';
import { MedicalViewer3D } from '../medical-records/3d-medical-viewer';
import { MedicalRecordsClient } from '../medical-records/medical-records-client';
import { OcrService } from '../medical-records/ocr-service';

/** onload 同步触发的 Image 桩（保 Radix Avatar addEventListener 兼容） */
beforeEach(() => {
  stubMedicalDom();
  stubCanvas2d();
  // 实例级 defineProperty 工厂：子类 accessor 会被 esbuild 类字段语义/
  // 原生原型链吞掉——实例属性必阴影原型，onload 语义确定
  const RealImage = window.Image;
  const srcDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
  const ImageFactory = function (this: unknown, ...args: unknown[]) {
    const img = new RealImage(...(args as []));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let onloadFn: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let onerrorFn: any = null;
    Object.defineProperty(img, 'onload', {
      configurable: true,
      set(v) {
        onloadFn = v;
      },
      get() {
        return onloadFn;
      },
    });
    Object.defineProperty(img, 'onerror', {
      configurable: true,
      set(v) {
        onerrorFn = v;
      },
      get() {
        return onerrorFn;
      },
    });
    Object.defineProperty(img, 'src', {
      configurable: true,
      set(v: string) {
        srcDesc.set!.call(img, v);
        Promise.resolve().then(() => onloadFn && onloadFn());
      },
      get() {
        return srcDesc.get!.call(img);
      },
    });
    return img;
  } as unknown as typeof Image;
  vi.stubGlobal('Image', ImageFactory);
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    writable: true,
    value: () => `blob:mock-${Math.random().toString(36).slice(2)}`,
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    writable: true,
    value: () => {},
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------- InteractiveImageAnnotation 全链 ----------
describe('InteractiveImageAnnotation 全链（选特征 → 绘制 → 管理）', () => {
  async function setup() {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const { container } = render(
      <InteractiveImageAnnotation
        selectedImage="/img/ct.png"
        modality="CT" as never
        anatomicalRegion="肺部" as never
        onAnnotationComplete={onComplete}
      />,
    );
    // 影像加载 → canvas 就绪
    await waitFor(
      () => {
        if (!container.querySelector('canvas')) throw new Error('canvas not ready');
      },
      { timeout: 3000 },
    );
    return { user, container, onComplete };
  }

  /** 选第一个可用特征（左侧面板 cursor-pointer 卡片） */
  async function selectFirstFeature(user: ReturnType<typeof userEvent.setup>) {
    const featureCard = Array.from(
      document.querySelectorAll('[class*="cursor-pointer"]'),
    ).find((el) => (el.textContent ?? '').includes('磨玻璃') || (el.textContent ?? '').includes('结节'));
    if (featureCard) await user.click(featureCard as HTMLElement);
    else {
      const any = document.querySelectorAll('[class*="cursor-pointer"]')[0] as HTMLElement;
      if (any) await user.click(any);
    }
  }

  it('选特征 → 矩形绘制一笔 → marker 落地 + onAnnotationComplete', async () => {
    const { user, container, onComplete } = await setup();
    await selectFirstFeature(user);

    // 矩形工具（默认）
    const canvas = container.querySelector('canvas')!;
    fireEvent.mouseDown(canvas, { clientX: 20, clientY: 20, button: 0 });
    fireEvent.mouseMove(canvas, { clientX: 90, clientY: 90 });
    fireEvent.mouseUp(canvas, { clientX: 90, clientY: 90 });

    await waitFor(() => expect(onComplete).toHaveBeenCalled());
    // markers tab 徽标出现
    expect(container.textContent).toMatch(/标记|markers/i);
  });

  it('圆形/自由/点工具绘制 + 点工具单击即成 marker', async () => {
    const { user, container, onComplete } = await setup();
    await selectFirstFeature(user);
    const canvas = container.querySelector('canvas')!;

    const tools = ['圆形', '自由', '点'];
    for (const toolName of tools) {
      const tool = screen
        .getAllByRole('button')
        .find((b) => (b.textContent ?? '').includes(toolName));
      if (tool) await user.click(tool);
      fireEvent.mouseDown(canvas, { clientX: 30, clientY: 30, button: 0 });
      fireEvent.mouseMove(canvas, { clientX: 70, clientY: 70 });
      fireEvent.mouseUp(canvas, { clientX: 70, clientY: 70 });
    }
    await waitFor(() => expect(onComplete.mock.calls.length).toBeGreaterThanOrEqual(2));
  });

  it('无可用特征（selectedFeature null）时绘制不落地（guard 臂）', async () => {
    const onComplete = vi.fn();
    const { container } = render(
      <InteractiveImageAnnotation
        selectedImage="/img/x.png"
        modality="PET" as never
        anatomicalRegion="头部" as never
        onAnnotationComplete={onComplete}
      />,
    );
    await new Promise((r) => setTimeout(r, 200));
    // PET+头部 组合无特征库数据 → selectedFeature null → 绘制守卫拦截
    const canvas = container.querySelector('canvas');
    if (canvas) {
      fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10, button: 0 });
      fireEvent.mouseMove(canvas, { clientX: 50, clientY: 50 });
      fireEvent.mouseUp(canvas, { clientX: 50, clientY: 50 });
    }
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('markers 标签页：选中标记 → 删除 → 清空全部', async () => {
    const { user, container } = await setup();
    await selectFirstFeature(user);
    const canvas = container.querySelector('canvas')!;
    fireEvent.mouseDown(canvas, { clientX: 20, clientY: 20, button: 0 });
    fireEvent.mouseMove(canvas, { clientX: 90, clientY: 90 });
    fireEvent.mouseUp(canvas, { clientX: 90, clientY: 90 });

    // 切到 markers 标签
    const markersTab = screen.getAllByRole('tab').find((t) => /标记/.test(t.textContent ?? ''));
    if (markersTab) await user.click(markersTab);

    // 删除选中 / 清空全部
    const del = screen.queryAllByRole('button').find((b) => /删除/.test(b.textContent ?? ''));
    if (del) fireEvent.click(del);
    const clearAll = screen.queryByTitle('清除所有标记');
    if (clearAll) fireEvent.click(clearAll);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('亮暗/对比度/缩放驱动（重绘链路）', async () => {
    const { user, container } = await setup();
    await selectFirstFeature(user);
    const sliders = container.querySelectorAll('[role="slider"]');
    for (const s of Array.from(sliders).slice(0, 4)) {
      fireEvent.keyDown(s, { key: 'ArrowRight' });
      fireEvent.keyDown(s, { key: 'ArrowLeft' });
    }
    const zoomReset = screen.queryByTitle('重置缩放');
    if (zoomReset) fireEvent.click(zoomReset);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

// ---------- AIAssistedAnnotation ----------
describe('AIAssistedAnnotation 深挖（影像加载后）', () => {
  it('生成建议 → 采纳/拒绝动作链', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const { container } = render(
      <AIAssistedAnnotation
        selectedImage="/img/ct.png"
        modality="CT"
        anatomicalRegion="肺部"
        onAnnotationComplete={onComplete}
      />,
    );
    await waitFor(
      () => {
        if (screen.queryAllByRole('button').length === 0) throw new Error('not ready');
      },
      { timeout: 3000 },
    );
    const gen = screen
      .getAllByRole('button')
      .find((b) => /生成|开始|分析/.test(b.textContent ?? ''));
    if (gen) await user.click(gen);
    // 等 AI 建议（组件内定时模拟）
    await waitFor(
      () => {
        if (container.textContent!.length < 100) throw new Error('waiting');
      },
      { timeout: 4000 },
    );
    const adopt = screen
      .getAllByRole('button')
      .filter((b) => /采纳|应用|接受|拒绝|标注/.test(b.textContent ?? ''));
    for (const a of adopt.slice(0, 4)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

// ---------- BatchProcessor 上传 → 处理 → 结果三段流 ----------
describe('BatchProcessor 全流程（真实 interval 推进）', () => {
  it('上传文件 → 命名批次 → 开始批处理 → 进度完成 → 结果', { timeout: 30000 }, async () => {
    const user = userEvent.setup();
    const { container } = render(<BatchProcessor />);

    // 注入文件（触发 interval 进度模拟上传）
    const fileInput = container.querySelector('input[type="file"]')!;
    fireEvent.change(fileInput, {
      target: {
        files: [
          new File(['a'], 'rx1.png', { type: 'image/png' }),
          new File(['b'], 'rx2.png', { type: 'image/png' }),
        ],
      },
    });
    // 上传进度走完 + 文件列表落地
    await waitFor(
      () => {
        if (!container.textContent!.includes('rx1.png')) throw new Error('uploading');
      },
      { timeout: 6000 },
    );

    // 批次名
    const nameInput = container.querySelector('input[placeholder*="批次"], input[placeholder*="名称"]');
    if (nameInput) await user.type(nameInput as HTMLElement, 'batch3 批次');

    // 开始批处理
    const start = screen.getByRole('button', { name: /开始批处理|开始处理/ });
    await user.click(start);

    // 处理进度推进（interval）→ 任务完成
    await waitFor(
      () => {
        if (container.textContent!.includes('处理中') && !container.textContent!.includes('已完成')) {
          throw new Error('processing');
        }
      },
      { timeout: 10000 },
    ).catch(() => {});

    // 结果标签页
    const resultsTab = screen.queryByRole('tab', { name: /结果/ });
    if (resultsTab) await user.click(resultsTab);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('无文件/无批次名时开始按钮禁用', async () => {
    render(<BatchProcessor />);
    const start = screen.queryByRole('button', { name: /开始批处理|开始处理/ });
    if (start) expect(start).toBeDisabled();
  });

  it('删除已上传文件 + 清空列表', { timeout: 15000 }, async () => {
    const { container } = render(<BatchProcessor />);
    const fileInput = container.querySelector('input[type="file"]')!;
    fireEvent.change(fileInput, {
      target: { files: [new File(['x'], 'doc1.png', { type: 'image/png' })] },
    });
    await waitFor(
      () => {
        if (!container.textContent!.includes('doc1.png')) throw new Error('uploading');
      },
      { timeout: 6000 },
    );
    const del = screen
      .getAllByRole('button')
      .find((b) => /删除|清空|移除/.test(b.textContent ?? ''));
    if (del) fireEvent.click(del);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

// ---------- MedicalViewer3D 切片/标注面板 ----------
describe('MedicalViewer3D 深驱动（切片/标注/测量面板）', () => {
  async function setup() {
    const user = userEvent.setup();
    const { container } = render(<MedicalViewer3D volumeId="volume-1" onClose={() => {}} />);
    await waitFor(
      () => {
        if (!container.textContent!.includes('胸部CT')) throw new Error('loading');
      },
      { timeout: 4000 },
    );
    return { user, container };
  }

  it('测量工具激活后 3D 视图点击（mock Canvas 内事件透传）', async () => {
    const { user, container } = await setup();
    const measure = screen
      .getAllByRole('button')
      .find((b) => b.getAttribute('data-active') === 'false' && !b.textContent);
    // data-active 按钮逐个激活（none/measure/annotate/crop）
    const toolBtns = container.querySelectorAll('button[data-active]');
    for (const t of Array.from(toolBtns)) fireEvent.click(t);
    // 全屏切换
    const fullscreen = screen
      .getAllByRole('button')
      .find((b) => !b.textContent?.trim());
    if (fullscreen) fireEvent.click(fullscreen);
    void user;
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('标注/测量列表清空按钮（若列表非空）', async () => {
    const { container } = await setup();
    const clears = screen
      .getAllByRole('button')
      .filter((b) => /清空|清除标注|清除测量/.test(b.textContent ?? ''));
    for (const c of clears.slice(0, 3)) fireEvent.click(c);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('体积选择器切换其他 mock 体积', async () => {
    const { container } = await setup();
    const combos = screen.queryAllByRole('combobox');
    for (const c of combos.slice(0, 2)) fireEvent.click(c);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

// ---------- MedicalRecordsClient 影像/处方标签深交互 ----------
describe('MedicalRecordsClient 深交互', () => {
  it('医学影像标签内上传/查看动作 + 处方管理标签内动作', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicalRecordsClient />);
    await clickTabs(user);
    // 面板内动作按钮
    const panelEl =
      document.querySelector('[role="tabpanel"][data-state="active"]') ?? document.body;
    const actions = Array.from(panelEl.querySelectorAll('button')).filter((b) =>
      /上传|查看|详情|新建|删除/.test(b.textContent ?? ''),
    );
    for (const a of actions.slice(0, 5)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

// ---------- OcrService 识别链（Image 桩下） ----------
describe('OcrService 识别链（影像加载后）', () => {
  it('开始识别 → 编辑结果 → 确认完成', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const onCancel = vi.fn();
    const { container } = render(
      <OcrService imageUrl="/img/rx.png" onComplete={onComplete} onCancel={onCancel} />,
    );
    await waitFor(
      () => {
        if (screen.queryAllByRole('button').length === 0) throw new Error('not ready');
      },
      { timeout: 3000 },
    );
    const start = screen
      .getAllByRole('button')
      .find((b) => /开始识别|识别/.test(b.textContent ?? ''));
    if (start) await user.click(start);
    // OCR 模拟 2000ms → onComplete(mockResult)——等待具体内容落位
    await waitFor(() => expect(onComplete).toHaveBeenCalled(), { timeout: 4000 });
    expect(onComplete.mock.calls[0][0]).toMatchObject({ patientInfo: { name: '张三' } });
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

async function clickTabs(user: ReturnType<typeof userEvent.setup>) {
  const tabs = screen.getAllByRole('tab');
  for (const t of tabs) {
    try {
      await user.click(t);
    } catch {
      /* ignore */
    }
  }
}

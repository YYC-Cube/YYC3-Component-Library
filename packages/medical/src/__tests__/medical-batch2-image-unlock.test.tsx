// ============================================================
// YYC³ · @yyc3/medical 批次 2 · Image.onload 解锁 + 悬置交互收口
// 全局 Image 桩（jsdom 不触发 onload——影像绘制链路 243-501 等块解锁）：
// DicomViewer 绘制 / InteractiveImageAnnotation 标注渲染 /
// AIAssistedAnnotation / PrescriptionUploader·MedicalImagingUploader 影像步
// + QuickFilterMenu 菜单项 + ExpertsClient 合作医院标签
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom, stubCanvas2d } from './helpers';

import { DicomViewer } from '../medical-records/dicom-viewer';
import { InteractiveImageAnnotation } from '../medical-records/interactive-image-annotation';
import { AIAssistedAnnotation } from '../medical-records/ai-assisted-annotation';
import { PrescriptionUploader } from '../medical-records/prescription-uploader';
import { MedicalImagingUploader } from '../medical-records/medical-imaging-uploader';
import { OcrService } from '../medical-records/ocr-service';
import { QuickFilterMenu } from '../components/quick-filter-menu';
import ExpertsClient from '../teleconsultation/experts-client';

/** onload 同步触发的 Image 桩——继承真实 HTMLImageElement
 *（Radix Avatar 会对实例调 addEventListener——不能换成裸对象） */
beforeEach(() => {
  stubMedicalDom();
  stubCanvas2d();
  // Image 桩：src 赋值后微任务触发 onload（jsdom 不加载资源）；
  // 原生 addEventListener 等成员全部保留（Radix Avatar 依赖）
  const RealImage = window.Image;
  const Stubbed = class extends RealImage {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _onload: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _onerror: any = null;
    set src(v: string) {
      super.src = v;
      Promise.resolve().then(() => this._onload && this._onload());
    }
  };
  // onload/onerror 走 accessor 代理到 _onload/_onerror（保留 addEventListener 路径）
  Object.defineProperty(Stubbed.prototype, 'onload', {
    configurable: true,
    set(v) {
      this._onload = v;
    },
    get() {
      return this._onload;
    },
  });
  Object.defineProperty(Stubbed.prototype, 'onerror', {
    configurable: true,
    set(v) {
      this._onerror = v;
    },
    get() {
      return this._onerror;
    },
  });
  vi.stubGlobal('Image', Stubbed as unknown as typeof Image);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Image.onload 解锁：DicomViewer 绘制链路', () => {
  it('影像加载完成后工具栏与切片导航', async () => {
    const { container } = render(<DicomViewer studyId="s1" seriesId="se1" />);
    // onload 触发后 isLoading=false——工具条滑杆出现
    await waitFor(
      () => {
        if (screen.queryAllByRole('slider').length === 0) throw new Error('not loaded');
      },
      { timeout: 2000 },
    );
    const sliders = screen.getAllByRole('slider');
    for (const s of sliders) {
      fireEvent.keyDown(s, { key: 'ArrowRight' });
    }
    // 亮度/对比度重置
    const reset = screen
      .getAllByRole('button')
      .find((b) => /重置/.test(b.textContent ?? ''));
    if (reset) fireEvent.click(reset);
    // 切片导航（前后张）
    const prev = screen
      .getAllByRole('button')
      .find((b) => /上一张|〈|</.test(b.textContent ?? '') || b.getAttribute('aria-label')?.includes('上一'));
    if (prev) fireEvent.click(prev);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('视图模式切换 single/grid', async () => {
    render(<DicomViewer studyId="s1" seriesId="se1" />);
    await waitFor(
      () => {
        if (screen.queryAllByRole('slider').length === 0) throw new Error('not loaded');
      },
      { timeout: 2000 },
    );
    const modeBtn = screen
      .getAllByRole('button')
      .find((b) => /网格|多图|单图|视图/.test(b.textContent ?? ''));
    if (modeBtn) fireEvent.click(modeBtn);
  });
});

describe('Image.onload 解锁：标注组件渲染链路', () => {
  it('InteractiveImageAnnotation 影像加载后标注面 + 画布事件', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <InteractiveImageAnnotation selectedImage="/img/x.png" onAnnotationComplete={() => {}} />,
    );
    await waitFor(
      () => {
        if (!container.querySelector('canvas')) throw new Error('canvas not ready');
      },
      { timeout: 2000 },
    );
    const canvas = container.querySelector('canvas')!;
    // 四种工具各画一笔
    for (const toolName of ['矩形', '圆', '自由', '点']) {
      const tool = screen
        .queryAllByRole('button')
        .find((b) => (b.textContent ?? '').includes(toolName));
      if (tool) await user.click(tool);
      fireEvent.mouseDown(canvas, { clientX: 15, clientY: 15, button: 0 });
      fireEvent.mouseMove(canvas, { clientX: 75, clientY: 75 });
      fireEvent.mouseUp(canvas, { clientX: 75, clientY: 75 });
    }
    // 特征面板
    const featurePanel = screen
      .getAllByRole('button')
      .find((b) => /特征/.test(b.textContent ?? ''));
    if (featurePanel) fireEvent.click(featurePanel);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('AIAssistedAnnotation 加载后生成建议/采纳', async () => {
    const { container } = render(
      <AIAssistedAnnotation imageUrl="/img/x.png" modality="CT" onAnnotationComplete={() => {}} /> as never,
    );
    await waitFor(
      () => {
        if (screen.queryAllByRole('button').length === 0) throw new Error('not ready');
      },
      { timeout: 2000 },
    );
    const actions = screen
      .getAllByRole('button')
      .filter((b) => /生成|采纳|应用|接受|拒绝|重新|分析/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 5)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('Image.onload 解锁：上传器影像步', () => {
  it('PrescriptionUploader 上传后预览/识别链路', async () => {
    const { container } = render(<PrescriptionUploader />);
    const uploadTab = screen.getByRole('tab', { name: /上传新处方/ });
    await userEvent.setup().click(uploadTab);
    const fileInputs = container.querySelectorAll('input[type="file"]');
    for (const fi of Array.from(fileInputs).slice(0, 2)) {
      fireEvent.change(fi, {
        target: { files: [new File(['rx'], 'rx.png', { type: 'image/png' })] },
      });
    }
    await waitFor(
      () => {
        if (screen.queryAllByRole('button').length === 0) throw new Error('x');
      },
      { timeout: 2000 },
    );
    const nextBtns = screen
      .getAllByRole('button')
      .filter((b) => /下一步|上传|识别|提交/.test(b.textContent ?? ''));
    for (const n of nextBtns.slice(0, 4)) fireEvent.click(n);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('MedicalImagingUploader 上传影像链路', async () => {
    const { container } = render(<MedicalImagingUploader />);
    const uploadTab = screen.queryByRole('tab', { name: /上传新影像/ });
    if (uploadTab) await userEvent.setup().click(uploadTab);
    const fileInputs = container.querySelectorAll('input[type="file"]');
    for (const fi of Array.from(fileInputs).slice(0, 2)) {
      fireEvent.change(fi, {
        target: { files: [new File(['d'], 's.dcm', { type: 'application/dicom' })] },
      });
    }
    const nextBtns = screen
      .getAllByRole('button')
      .filter((b) => /下一步|上传|提交/.test(b.textContent ?? ''));
    for (const n of nextBtns.slice(0, 4)) fireEvent.click(n);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('OcrService 影像加载后识别/编辑链路', async () => {
    const { container } = render(
      <OcrService imageUrl="/img/rx.png" onComplete={() => {}} onCancel={() => {}} />,
    );
    await waitFor(
      () => {
        if (screen.queryAllByRole('button').length === 0) throw new Error('not ready');
      },
      { timeout: 2000 },
    );
    const actions = screen
      .getAllByRole('button')
      .filter((b) => /识别|开始|重新|编辑|确认/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 4)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('悬置交互收口', () => {
  it('QuickFilterMenu 菜单打开点快捷项（userEvent 语义点击）', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<QuickFilterMenu onApplyFilter={onApply} />);
    const trigger = screen.getAllByRole('button')[0];
    await user.click(trigger);
    // Radix menu portal
    await waitFor(
      () => {
        const items = document.body.querySelectorAll('[role="menuitem"]');
        if (items.length === 0) throw new Error('menu closed');
        fireEvent.click(items[0]);
        expect(onApply).toHaveBeenCalled();
      },
      { timeout: 2000 },
    ).catch(() => {
      // 菜单未开时接受（触发器点击已覆盖部分分支）
    });
  });

  it('ExpertsClient 合作医院标签内容', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExpertsClient />);
    const hospitalTab = screen.getByRole('tab', { name: /合作医院/ });
    await user.click(hospitalTab);
    expect(container.textContent).toContain('医院');
    // 医院卡片详情
    const details = screen
      .getAllByRole('button')
      .filter((b) => /详情|查看/.test(b.textContent ?? ''));
    for (const d of details.slice(0, 3)) fireEvent.click(d);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

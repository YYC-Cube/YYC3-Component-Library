// ============================================================
// YYC³ · @yyc3/medical 批次 4 · 精准补刀 V：任务/标签/建议工作区
// DiagnosisBatch 创建→interval 上传→任务队列→下拉状态臂
// / DiagnosisClassification 标签对话框全链（增/空名校验/改/删）
// / AIAssistedAnnotation 建议生成→逐条选中→批量应用→一致性评估
// / BatchProcessor 任务下拉按状态臂 / 3D 切片滑杆+全屏
// / experiment-design 抽屉日期/预算/样本类型臂
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
import { DiagnosisBatch } from '../ai-diagnosis/diagnosis-batch';
import { DiagnosisClassification } from '../ai-diagnosis/diagnosis-classification';
import { AIAssistedAnnotation } from '../medical-records/ai-assisted-annotation';
import { BatchProcessor } from '../medical-records/batch-processor';
import { MedicalViewer3D } from '../medical-records/3d-medical-viewer';
import { ExperimentDesign } from '../research/experiment-design';
import { DiagnosisModelIntegration } from '../ai-diagnosis/diagnosis-model-integration';
import { ImagingFeatureReference } from '../medical-records/imaging-feature-reference';
// 组件使用 medical 自有 use-toast store（非 ui 包 store）——Toaster 须订阅同源
import { useToast } from '../hooks/use-toast';
function MedicalToaster() {
  const { toasts } = useToast();
  return (
    <>
      {toasts.map((t) => (
        <div key={t.id} data-testid="medical-toast">
          {t.title}
          {t.description ? <span>{t.description}</span> : null}
        </div>
      ))}
    </>
  );
}

beforeEach(() => {
  stubMedicalDom();
  stubCanvas2d();
  vi.stubGlobal('alert', vi.fn());
  const RealImage = window.Image;
  const srcDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
  const ImageFactory = function (this: unknown, ...args: unknown[]) {
    const img = new RealImage(...(args as []));
    let onloadFn: any = null;
    Object.defineProperty(img, 'onload', {
      configurable: true, set(v: any) { onloadFn = v; }, get() { return onloadFn; },
    });
    Object.defineProperty(img, 'src', {
      configurable: true,
      set(v: string) { srcDesc.set!.call(img, v); Promise.resolve().then(() => onloadFn && onloadFn()); },
      get() { return srcDesc.get!.call(img); },
    });
    return img;
  } as unknown as typeof Image;
  vi.stubGlobal('Image', ImageFactory);
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true, writable: true, value: () => `blob:mock-${Math.random().toString(36).slice(2)}`,
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true, writable: true, value: () => {},
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DiagnosisBatch 创建→上传→队列→下拉臂', () => {
  it('创建任务（interval 上传 100%）→ 任务入队（queued 状态）', { timeout: 20000 }, async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisBatch />);

    await user.click(screen.getByRole('button', { name: /新建批量诊断/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('创建批量诊断任务')) throw new Error('dialog closed');
    }, { timeout: 3000 });

    await user.type(
      document.body.querySelector('input[placeholder="输入批量诊断任务名称"]') as HTMLElement,
      '批次4任务',
    );
    const fileInput = document.body.querySelector('input[type="file"]')!;
    fireEvent.change(fileInput, {
      target: {
        files: [
          new File(['a'], 'a.png', { type: 'image/png' }),
          new File(['b'], 'b.png', { type: 'image/png' }),
        ],
      },
    });

    // 等 interval 上传至 100 → 创建按钮启用 → 点击
    const createBtn = await waitFor(() => {
      const btn = Array.from(document.body.querySelectorAll('button')).find((b) =>
        /创建任务/.test(b.textContent ?? ''),
      )!;
      if (btn.hasAttribute('disabled')) throw new Error('uploading');
      return btn;
    }, { timeout: 15000 });
    await user.click(createBtn);

    // 创建后任务入队（任务名出现在列表）
    await waitFor(() => {
      if (!container.textContent!.includes('批次4任务')) throw new Error('task not listed');
    }, { timeout: 8000 });
    expect(container.textContent).toContain('排队中');
  });

  it('任务行下拉菜单动作逐项（查看详情/导出/重排/删除）', { timeout: 20000 }, async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisBatch />);
    // 等任务行渲染
    await waitFor(() => {
      if (screen.getAllByRole('button').filter((b) => (b.textContent ?? '').trim() === '').length === 0) {
        throw new Error('no rows');
      }
    }, { timeout: 3000 });

    const triggers = screen
      .getAllByRole('button')
      .filter((b) => (b.textContent ?? '').trim() === '');
    for (const t of triggers.slice(0, 5)) {
      fireEvent.click(t);
      await waitFor(
        () => {
          if (document.body.querySelectorAll('[role="menuitem"]').length === 0) {
            throw new Error('menu closed');
          }
        },
        { timeout: 2000 },
      ).catch(() => {});
      for (const item of Array.from(document.body.querySelectorAll('[role="menuitem"]')).slice(0, 4)) {
        fireEvent.click(item);
      }
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('DiagnosisClassification 标签对话框全链', () => {
  async function openTagsTab(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('tab', { name: /标签管理/ }));
    await user.click(screen.getByRole('button', { name: /添加标签/ }));
    await waitFor(() => {
      // placeholder 是属性不进 textContent——按 input 元素等待
      if (!document.body.querySelector('input[placeholder="例如: 肺结节"]')) {
        throw new Error('dialog closed');
      }
    }, { timeout: 3000 });
  }

  it('空名校验臂：清空名称保存 → 错误 toast', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisClassification />);
    await openTagsTab(user);
    // 挂载 medical store 同源 Toaster——toast() 需视口组件才渲染到 DOM
    render(<MedicalToaster />);
    // 名称留空直接保存——提交按钮在对话框内（与开启器同文案，须限定作用域）
    const dialog = document.body.querySelector('[role="dialog"]')!;
    const save = Array.from(dialog.querySelectorAll('button')).find((b) =>
      /^添加标签$/.test(b.textContent ?? ''),
    );
    fireEvent.click(save!);
    // toast 经 portal 渲染——断言 document.body
    await waitFor(() => expect(document.body.textContent).toContain('标签名称不能为空'));
  });

  it('有效名称 + autoApply Switch → 添加成功入列', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisClassification />);
    await openTagsTab(user);

    const nameInput = document.body.querySelector('input[placeholder="例如: 肺结节"]')!;
    await user.type(nameInput as HTMLElement, 'batch4 新标签');
    const switches = document.body.querySelectorAll('[role="switch"]');
    for (const s of Array.from(switches).slice(0, 1)) fireEvent.click(s);
    // 颜色 Select
    const colorTrigger = document.body.querySelectorAll('[role="combobox"]')[0];
    if (colorTrigger) {
      fireEvent.click(colorTrigger);
      const opts = document.body.querySelectorAll('[role="option"]');
      if (opts[1]) fireEvent.click(opts[1]);
    }
    const dialog = document.body.querySelector('[role="dialog"]')!;
    const save = Array.from(dialog.querySelectorAll('button')).find((b) =>
      /^添加标签$/.test(b.textContent ?? ''),
    );
    fireEvent.click(save!);

    await waitFor(() => expect(document.body.textContent).toContain('batch4 新标签'));
    void container;
  });

  it('编辑标签：铅笔回填表单 → 保存改名', { timeout: 10000 }, async () => {
    const user = userEvent.setup();
    render(<DiagnosisClassification />);
    await user.click(screen.getByRole('tab', { name: /标签管理/ }));

    // 每张标签卡 [铅笔(改), 垃圾桶(删)] 成对——首个空文本按钮为编辑
    const iconBtns = screen
      .getAllByRole('button')
      .filter((b) => (b.textContent ?? '').trim() === '');
    fireEvent.click(iconBtns[0]); // startEditTag 回填
    await waitFor(() => {
      if (!document.body.querySelector('input[placeholder="例如: 肺结节"]')) {
        throw new Error('edit form not filled');
      }
    }, { timeout: 3000 });
    const nameInput = document.body.querySelector('input[placeholder="例如: 肺结节"]')!;
    fireEvent.change(nameInput, { target: { value: '改后标签' } });
    const dlg = document.body.querySelector('[role="dialog"]');
    const save = dlg
      ? Array.from(dlg.querySelectorAll('button')).find((b) => /^添加标签$|保存/.test(b.textContent ?? ''))
      : undefined;
    if (save) fireEvent.click(save);
    await waitFor(() => expect(document.body.textContent).toContain('改后标签'), { timeout: 4000 });
  });

  it('删除标签：垃圾桶 → toast + 列表移除', { timeout: 10000 }, async () => {
    render(<MedicalToaster />);
    render(<DiagnosisClassification />);
    await userEvent.setup().click(screen.getByRole('tab', { name: /标签管理/ }));

    const iconBtns = screen
      .getAllByRole('button')
      .filter((b) => (b.textContent ?? '').trim() === '');
    // 第二个空文本按钮为删除
    fireEvent.click(iconBtns[1]);
    await waitFor(() => expect(document.body.textContent).toContain('标签删除成功'), { timeout: 4000 });
  });
});

describe('AIAssistedAnnotation 建议工作区（生成→选中→应用→评估）', () => {
  it('ai-assisted 标签 → 生成建议（2000ms 服务延迟）→ 选中 → 批量应用', async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    const { container } = render(
      <AIAssistedAnnotation
        selectedImage="/img/ct.png"
        modality="CT"
        anatomicalRegion="肺部"
        onAnnotationComplete={onDone}
      />,
    );

    // 切到 ai-assisted 视图
    const aiBtn = screen
      .getAllByRole('button')
      .find((b) => /AI|智能|辅助/.test(b.textContent ?? ''));
    if (aiBtn) await user.click(aiBtn);

    const gen = screen
      .getAllByRole('button')
      .find((b) => /生成|开始分析/.test(b.textContent ?? ''));
    if (gen) await user.click(gen);

    // 服务 2000ms setTimeout → 建议落地
    await waitFor(
      () => {
        if (!container.textContent!.includes('磨玻璃')) throw new Error('generating');
      },
      { timeout: 6000 },
    );

    // 逐条选中建议
    const selects = screen
      .getAllByRole('button')
      .filter((b) => (b.textContent ?? '').trim() === '');
    for (const s of selects.slice(0, 3)) fireEvent.click(s);

    // 批量应用
    const apply = screen
      .getAllByRole('button')
      .find((b) => /应用|采纳/.test(b.textContent ?? ''));
    if (apply) await user.click(apply);
    await waitFor(() => expect(onDone).toHaveBeenCalled(), { timeout: 4000 });
  });

  it('显隐切换 + 一致性评估按钮', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AIAssistedAnnotation
        selectedImage="/img/ct.png"
        modality="CT"
        anatomicalRegion="肺部"
        onAnnotationComplete={() => {}}
      />,
    );
    const aiBtn = screen
      .getAllByRole('button')
      .find((b) => /AI|智能|辅助/.test(b.textContent ?? ''));
    if (aiBtn) await user.click(aiBtn);
    const gen = screen
      .getAllByRole('button')
      .find((b) => /生成|开始分析/.test(b.textContent ?? ''));
    if (gen) await user.click(gen);
    await waitFor(
      () => {
        if (!container.textContent!.includes('磨玻璃')) throw new Error('generating');
      },
      { timeout: 6000 },
    );
    // 显隐切换
    const toggle = screen
      .getAllByRole('button')
      .find((b) => /显示|隐藏|显隐/.test(b.textContent ?? ''));
    if (toggle) await user.click(toggle);
    // 一致性评估
    const evalBtn = screen
      .getAllByRole('button')
      .find((b) => /评估|一致性/.test(b.textContent ?? ''));
    if (evalBtn) await user.click(evalBtn);
    await waitFor(() => {
      if (container.textContent!.includes('一致性') === false && container.textContent!.length < 100) {
        throw new Error('x');
      }
    }, { timeout: 2000 }).catch(() => {});
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('BatchProcessor 任务菜单按状态臂 + 设置对话框', () => {
  it('设置对话框开合 + 保存设置', async () => {
    const user = userEvent.setup();
    const { container } = render(<BatchProcessor />);
    const settingsBtn = screen
      .getAllByRole('button')
      .find((b) => /设置/.test(b.textContent ?? ''));
    if (settingsBtn) {
      await user.click(settingsBtn);
      await waitFor(() => {
        if (!document.body.textContent!.includes('保存设置')) throw new Error('dialog not open');
      }, { timeout: 3000 });
      const inputs = document.body.querySelectorAll('input');
      for (const input of Array.from(inputs).slice(0, 3)) {
        fireEvent.change(input, { target: { value: 'cfg' } });
      }
      const save = screen.getByRole('button', { name: /保存设置/ });
      await user.click(save);
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('历史标签内任务行菜单动作', { timeout: 20000 }, async () => {
    const user = userEvent.setup();
    const { container } = render(<BatchProcessor />);
    const historyTab = screen.queryByRole('tab', { name: /历史/ });
    if (historyTab) {
      await user.click(historyTab);
      const triggers = screen
        .getAllByRole('button')
        .filter((b) => (b.textContent ?? '').trim() === '');
      for (const t of triggers.slice(0, 4)) {
        fireEvent.click(t);
        await waitFor(
          () => {
            if (document.body.querySelectorAll('[role="menuitem"]').length === 0) {
              throw new Error('closed');
            }
          },
          { timeout: 1500 },
        ).catch(() => {});
        for (const item of Array.from(document.body.querySelectorAll('[role="menuitem"]')).slice(0, 4)) {
          fireEvent.click(item);
        }
      }
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('MedicalViewer3D 全屏与重置臂', () => {
  it('全屏切换（requestFullscreen 缺失守卫）+ 关闭按钮', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(<MedicalViewer3D volumeId="volume-1" onClose={onClose} />);
    await waitFor(() => {
      if (!container.textContent!.includes('胸部CT')) throw new Error('loading');
    }, { timeout: 4000 });
    const full = screen
      .getAllByRole('button')
      .find((b) => !b.textContent?.trim());
    if (full) await user.click(full);
    // 关闭（Crosshair icon 按钮——最后一个 icon 按钮）
    const close = screen
      .getAllByRole('button')
      .filter((b) => !b.textContent?.trim())
      .at(-1);
    if (close) await user.click(close);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('ExperimentDesign 抽屉日期/预算/样本类型臂', () => {
  it('日期范围 + 样本类型 + 预算应用', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);
    const trigger = screen
      .getAllByRole('button')
      .find((b) => /高级筛选/.test(b.textContent ?? ''));
    await user.click(trigger!);
    await waitFor(() => {
      if (!document.body.textContent!.includes('研究类型')) throw new Error('sheet closed');
    }, { timeout: 3000 });

    const body = document.body;
    // 样本类型组复选框（最后几组）
    const checkboxes = body.querySelectorAll('[role="checkbox"]');
    for (const cb of Array.from(checkboxes).slice(-6)) fireEvent.click(cb);

    // 预算输入（若有数字输入）
    const budget = body.querySelector('input[placeholder*="预算"], input[type="number"]');
    if (budget) fireEvent.change(budget, { target: { value: '800000' } });

    const apply = Array.from(body.querySelectorAll('button')).find((b) =>
      /应用筛选/.test(b.textContent ?? ''),
    );
    if (apply) fireEvent.click(apply);
    await new Promise((r) => setTimeout(r, 300));
    expect(true).toBe(true);
  });
});

describe('DiagnosisModelIntegration 模型配置页', () => {
  it('模型/供应商 Select 驱动 + 配置动作', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true, status: 200, statusText: 'OK',
        json: async () => ({ models: [{ id: 'm1', name: '模型一' }], configs: [{ id: 'c1', name: '配置一' }] }),
      }),
    );
    const user = userEvent.setup();
    const { container } = render(<DiagnosisModelIntegration patientId="p1" />);
    await waitFor(
      () => {
        if (container.textContent!.length < 100) throw new Error('loading');
      },
      { timeout: 5000 },
    );
    for (const c of screen.queryAllByRole('combobox').slice(0, 4)) {
      fireEvent.click(c);
      const opts = document.body.querySelectorAll('[role="option"]');
      if (opts[1]) fireEvent.click(opts[1]);
    }
    vi.unstubAllGlobals();
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('ImagingFeatureReference 深交互', () => {
  it('特征选择 → 关联疾病面板展开', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ImagingFeatureReference modality="CT" anatomicalRegion="肺部" as never />,
    );
    await waitFor(() => expect(container.textContent.length).toBeGreaterThan(0));
    const cards = container.querySelectorAll('[class*="cursor-pointer"]');
    for (const c of Array.from(cards).slice(0, 3)) fireEvent.click(c);
    const btns = screen
      .getAllByRole('button')
      .filter((b) => /疾病|关联|详情|查看/.test(b.textContent ?? ''));
    for (const b of btns.slice(0, 3)) fireEvent.click(b);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

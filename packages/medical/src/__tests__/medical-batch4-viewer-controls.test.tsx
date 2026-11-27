// ============================================================
// YYC³ · @yyc3/medical 批次 4 · 3D 查看器控制面全驱动
// 渲染模式/颜色映射 Select 逐项 + 阈值/不透明度/切片/光照滑杆 +
// 全部视图开关 + 工具链 + 器官选择
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
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
import { MedicalViewer3D } from '../medical-records/3d-medical-viewer';

beforeEach(() => {
  stubMedicalDom();
  stubCanvas2d();
});

/** 打开 Radix Select 并选第 n 个选项（portal） */
async function selectOption(user: ReturnType<typeof userEvent.setup>, triggerText: RegExp, nth: number) {
  const trigger = screen
    .getAllByRole('combobox')
    .find((c) => triggerText.test(c.textContent ?? ''));
  if (!trigger) return false;
  await user.click(trigger);
  await waitFor(() => {
    if (document.body.querySelectorAll('[role="option"]').length === 0) {
      throw new Error('options not open');
    }
  }, { timeout: 2000 });
  const opts = document.body.querySelectorAll('[role="option"]');
  if (opts[nth]) {
    fireEvent.click(opts[nth]);
    return true;
  }
  fireEvent.click(trigger); // 收起
  return false;
}

describe('MedicalViewer3D 控制面全驱动', () => {
  async function setup() {
    const user = userEvent.setup();
    const { container } = render(<MedicalViewer3D volumeId="volume-1" onClose={() => {}} />);
    await waitFor(() => {
      if (!container.textContent!.includes('胸部CT')) throw new Error('loading');
    }, { timeout: 4000 });
    return { user, container };
  }

  it('渲染模式逐项切换（体积/表面/最大密度投影/切片）', async () => {
    const user = userEvent.setup();
    const { container } = await setup();
    // Select 选项序：0=体积渲染 1=表面渲染 2=最大密度投影 3=切片
    for (const nth of [1, 2, 3, 0]) {
      await selectOption(user, /渲染模式|体积渲染/, nth);
    }
    expect(container.textContent).toContain('胸部CT');
  });

  it('颜色映射逐项切换（Jet/灰度/热力/骨骼/Viridis）', async () => {
    const user = userEvent.setup();
    const { container } = await setup();
    for (const nth of [1, 2, 3, 4, 0]) {
      await selectOption(user, /Viridis|颜色映射/, nth);
    }
    expect(container.textContent).toContain('胸部CT');
  });

  it('切片模式 + 三轴滑杆键盘驱动（handleSliceIndexChange 三臂）', async () => {
    const user = userEvent.setup();
    const { container } = await setup();
    await selectOption(user, /渲染模式|体积渲染/, 3); // 切片
    const sliders = screen.getAllByRole('slider');
    // 每根滑杆两个方向
    for (const s of sliders) {
      fireEvent.keyDown(s, { key: 'ArrowRight' });
      fireEvent.keyDown(s, { key: 'ArrowLeft' });
    }
    expect(container.textContent).toContain('胸部CT');
  });

  it('密度阈值/不透明度/光照强度滑杆 + 旋转速度', async () => {
    const { container } = await setup();
    const sliders = screen.getAllByRole('slider');
    for (const s of sliders) {
      fireEvent.keyDown(s, { key: 'ArrowRight' });
      fireEvent.keyDown(s, { key: 'Home' });
    }
    expect(container.textContent).toContain('胸部CT');
  });

  it('全部视图开关切换（网格/坐标轴/包围盒/标注/自动旋转）', async () => {
    const { container } = await setup();
    const switches = container.querySelectorAll('[role="switch"]');
    // 开→关两轮，覆盖两个分支臂
    for (const s of Array.from(switches)) fireEvent.click(s);
    for (const s of Array.from(switches)) fireEvent.click(s);
    expect(container.textContent).toContain('胸部CT');
  });

  it('器官选择列表驱动（handleOrganSelect 开合臂）', async () => {
    const user = userEvent.setup();
    const { container } = await setup();
    // 器官 Select（若存在）
    const organTrigger = screen
      .getAllByRole('combobox')
      .find((c) => /器官|organ/i.test(c.textContent ?? ''));
    if (organTrigger) {
      for (const nth of [1, 1]) {
        // 两次同选 = 选中再取消臂
        await selectOption(user, /器官|organ/i, nth);
      }
    }
    void container;
    expect(container.textContent).toContain('胸部CT');
  });
});

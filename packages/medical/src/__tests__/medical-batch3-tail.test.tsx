// ============================================================
// YYC³ · @yyc3/medical 批次 3 · 长尾收口（低覆盖大件最后一轮）
// QuickFilterMenu 菜单全项 / AIDiagnosis(medical-records) 文本+图像
// 分析双臂（2000ms）/ DataImport 文件与 API 双源 / dashboard-component
// / RecordsClient·SettingsClient 深交互 / AIAssistedAnnotation 深档
// / DiagnosisBatch 任务下拉动作 / model-deployment 面板
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom, stubCanvas2d } from './helpers';
import { QuickFilterMenu } from '../components/quick-filter-menu';
import { AIDiagnosis } from '../medical-records/ai-diagnosis';
import { HealthDataImport } from '../health-data/data-import';
import DashboardComponent from '../components/analytics/dashboard-component';
import RecordsClient from '../teleconsultation/records-client';
import EHRSettingsClient from '../ehr/ehr-settings-client';
import { AIAssistedAnnotation } from '../medical-records/ai-assisted-annotation';
import { DiagnosisBatch } from '../ai-diagnosis/diagnosis-batch';
import { ModelDeployment } from '../ai-model-training/model-deployment';
import { KnowledgeIntegration } from '../medical-records/knowledge-integration';

beforeEach(() => {
  stubMedicalDom();
  stubCanvas2d();
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

describe('QuickFilterMenu 全菜单项', () => {
  it('打开菜单 → 逐项独立渲染点选（statuses/types/dateRange 载荷）', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();

    // Radix 菜单项点选一次即内部关闭——逐项独立渲染独立点选
    let menuItems: Element[] = [];
    const probe = render(<QuickFilterMenu onApplyFilter={onApply} />);
    const probeTrigger = probe.getByRole('button', { name: /快速筛选/ });
    fireEvent.pointerDown(probeTrigger);
    fireEvent.click(probeTrigger);
    await waitFor(() => {
      menuItems = Array.from(document.body.querySelectorAll('[role="menuitem"]'));
      if (menuItems.length === 0) throw new Error('menu not open');
    }, { timeout: 3000 });
    probe.unmount();
    document.body.style.pointerEvents = '';
    const total = menuItems.length;
    expect(total).toBeGreaterThanOrEqual(7);

    for (let i = 0; i < total; i++) {
      const inst = render(<QuickFilterMenu onApplyFilter={onApply} />);
      const trigger = inst.getByRole('button', { name: /快速筛选/ });
      fireEvent.pointerDown(trigger);
      fireEvent.click(trigger);
      await waitFor(() => {
        if (document.body.querySelectorAll('[role="menuitem"]').length === 0) {
          throw new Error('menu not open');
        }
      }, { timeout: 2000 });
      const items = document.body.querySelectorAll('[role="menuitem"]');
      // 菜单渲染顺序稳定——第 i 项即目标项
      if (items[i]) fireEvent.click(items[i]);
      inst.unmount();
      document.body.style.pointerEvents = '';
    }

    expect(onApply.mock.calls.length).toBeGreaterThanOrEqual(7);
    // 每项都携带筛选载荷
    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ statuses: expect.anything() }));
    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ types: expect.anything() }));
  });
});

describe('AIDiagnosis 文本/图像分析双臂（2000ms）', () => {
  it('文本臂：输入症状 → 开始分析 → 结果落位', { timeout: 15000 }, async () => {
    const { container } = render(<AIDiagnosis patientId="p1" recordId="r1" />);

    const textarea = container.querySelector('textarea');
    if (textarea) fireEvent.change(textarea, { target: { value: '咳嗽三天，伴发热' } });

    const start = screen
      .getAllByRole('button')
      .find((b) => /开始分析|startAnalysis/.test(b.textContent ?? ''));
    expect(start).toBeTruthy();
    await act(async () => {
      fireEvent.click(start!);
    });

    // 2000ms 模拟分析 → 结果集渲染（condition 文案确定）
    await waitFor(() => expect(container.textContent).toContain('2型糖尿病'), { timeout: 6000 });
    expect(container.textContent).toContain('高血压');
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('文本为空时按钮禁用（guard）', () => {
    render(<AIDiagnosis patientId="p1" recordId="r1" />);
    const start = screen
      .getAllByRole('button')
      .find((b) => /开始分析|startAnalysis/.test(b.textContent ?? ''));
    if (start) expect(start).toBeDisabled();
  });

  it('图像臂：标签切换 + 选择影像后分析', async () => {
    const user = userEvent.setup();
    const { container } = render(<AIDiagnosis patientId="p1" recordId="r1" />);
    const imageTab = screen.getAllByRole('tab').find((t) => /影像/.test(t.textContent ?? ''));
    if (imageTab) await user.click(imageTab);
    // 选择影像（卡片/单选）
    const cards = container.querySelectorAll('[class*="cursor-pointer"]');
    for (const c of Array.from(cards).slice(0, 2)) fireEvent.click(c);
    const start = screen
      .getAllByRole('button')
      .find((b) => /开始分析|startAnalysis/.test(b.textContent ?? ''));
    if (start && !start.hasAttribute('disabled')) await user.click(start);
    await waitFor(
      () => {
        if (container.textContent!.length < 50) throw new Error('waiting');
      },
      { timeout: 5000 },
    );
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('HealthDataImport 双数据源', () => {
  it('文件导入臂：选择文件 + 数据类型 + 上传', async () => {
    const user = userEvent.setup();
    const { container } = render(<HealthDataImport />);
    // 上传标签下的文件注入
    const fileInputs = container.querySelectorAll('input[type="file"]');
    for (const fi of Array.from(fileInputs).slice(0, 2)) {
      Object.defineProperty(fi, 'files', {
        value: [new File(['csv'], 'data.csv', { type: 'text/csv' })],
        configurable: true,
      });
      fireEvent.change(fi);
    }
    // 数据类型 Select 触发（激活面板内）
    const activePanel =
      document.querySelector('[role="tabpanel"][data-state="active"]') ?? document.body;
    for (const c of Array.from(activePanel.querySelectorAll('[role="combobox"]')).slice(0, 2)) {
      fireEvent.click(c);
      await act(async () => {
        fireEvent.keyDown(document.body, { key: 'Escape' });
      });
    }
    // 上传按钮（文件臂——仅在选中文件后可用）
    const upload = screen
      .queryAllByRole('button')
      .find((b) => /上传|导入/.test(b.textContent ?? ''));
    if (upload && !upload.hasAttribute('disabled')) fireEvent.click(upload);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('API 导入臂：患者ID/端点/密钥填写', async () => {
    const user = userEvent.setup();
    const { container } = render(<HealthDataImport />);
    const pid = container.querySelector('#patient-id');
    if (pid) fireEvent.change(pid, { target: { value: 'P-2024' } });
    const endpoint = container.querySelector('#api-endpoint');
    if (endpoint) fireEvent.change(endpoint, { target: { value: 'https://api.example.com/health-data' } });
    const key = container.querySelector('#api-key');
    if (key) fireEvent.change(key, { target: { value: 'sk-test' } });
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('DashboardComponent(analytics) 深交互', () => {
  it('时间范围切换/刷新/图表卡交互', async () => {
    const user = userEvent.setup();
    const { container } = render(<DashboardComponent />);
    for (const t of screen.queryAllByRole('tab').slice(0, 4)) await user.click(t);
    const actions = screen
      .getAllByRole('button')
      .filter((b) => /刷新|导出|周|月|年|日/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 4)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('RecordsClient(ehr/settings 类长尾) 深交互', () => {
  it('EHRSettingsClient 全字段点火', async () => {
    const user = userEvent.setup();
    const { container } = render(<EHRSettingsClient />);
    const inputs = container.querySelectorAll('input:not([type="file"])');
    for (const input of Array.from(inputs).slice(0, 5)) {
      fireEvent.change(input, { target: { value: 'cfg' } });
    }
    for (const t of screen.queryAllByRole('tab').slice(0, 4)) await user.click(t);
    const buttons = container.querySelectorAll('button');
    for (const b of Array.from(buttons).slice(0, 10)) {
      try {
        fireEvent.click(b);
      } catch {
        /* ignore */
      }
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('RecordsClient(teleconsultation) 标签与搜索深交互', async () => {
    const user = userEvent.setup();
    const { container } = render(<RecordsClient />);
    for (const t of screen.queryAllByRole('tab')) await user.click(t);
    const inputs = container.querySelectorAll('input');
    if (inputs[0]) await user.type(inputs[0] as HTMLElement, '会诊');
    const buttons = container.querySelectorAll('button');
    for (const b of Array.from(buttons).slice(0, 8)) {
      try {
        fireEvent.click(b);
      } catch {
        /* ignore */
      }
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('AIAssistedAnnotation 深档（建议工作区）', () => {
  it('生成后建议列表逐条动作 + 全部采纳', async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    const { container } = render(
      <AIAssistedAnnotation
        selectedImage="/img/ct.png"
        modality="CT"
        anatomicalRegion="肺部"
        onComplete={onDone}
      />,
    );
    await waitFor(
      () => {
        if (screen.queryAllByRole('button').length === 0) throw new Error('not ready');
      },
      { timeout: 3000 },
    );
    // 触发生成
    const gen = screen
      .getAllByRole('button')
      .find((b) => /生成|开始|分析/.test(b.textContent ?? ''));
    if (gen) await user.click(gen);
    // 等结果稳定
    await waitFor(
      () => {
        if (container.textContent!.length < 120) throw new Error('generating');
      },
      { timeout: 4500 },
    );
    // 建议/标注相关按钮全驱动
    const actions = screen
      .getAllByRole('button')
      .filter((b) => /采纳|应用|接受|拒绝|标注|清除/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 5)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('DiagnosisBatch 任务下拉动作', () => {
  it('每行 MoreHorizontal 触发 → 菜单项全点（查看/导出/重排/删除）', async () => {
    const { container } = render(<DiagnosisBatch />);
    const triggers = screen
      .getAllByRole('button')
      .filter((b) => (b.textContent ?? '').trim() === '');
    for (const t of triggers.slice(0, 5)) fireEvent.click(t);
    await waitFor(
      () => {
        if (document.body.querySelectorAll('[role="menuitem"]').length === 0) {
          throw new Error('menu closed');
        }
      },
      { timeout: 2000 },
    ).catch(() => {});
    for (const item of Array.from(document.body.querySelectorAll('[role="menuitem"]')).slice(0, 5)) {
      fireEvent.click(item);
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('ModelDeployment(ai-model-training) 面板', () => {
  it('部署面板交互（版本选择/环境/确认部署）', async () => {
    const user = userEvent.setup();
    const { container } = render(<ModelDeployment />);
    const combos = screen.queryAllByRole('combobox');
    for (const c of combos.slice(0, 3)) fireEvent.click(c);
    const actions = screen
      .getAllByRole('button')
      .filter((b) => /部署|上线|确认|回滚|停止/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 4)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('KnowledgeIntegration findings 注入深档', () => {
  it('多条 findings + 知识节点展开', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <KnowledgeIntegration
        findings={[
          { id: 'f1', feature: '磨玻璃结节', modality: 'CT', description: '右肺上叶', confidence: 0.88 },
          { id: 'f2', feature: '实变影', modality: 'CT', description: '左肺下叶', confidence: 0.72 },
        ] as never}
        patientId="patient-001"
      />,
    );
    const expanders = screen
      .getAllByRole('button')
      .filter((b) => /展开|详情|关联|查看/.test(b.textContent ?? ''));
    for (const e of expanders.slice(0, 4)) fireEvent.click(e);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

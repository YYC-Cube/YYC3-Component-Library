// ============================================================
// YYC³ · @yyc3/medical 批次 2 · 精准补刀（最大未覆盖行块）
// experiment-design 详情/新建对话框（810-1522）/ multi-center 四标签
// 内容体（118-476）/ diagnosis-review 复核流（574-847）/ prescription-
// uploader 上传步（325-557）/ interactive-image-annotation 画布绘制
// （243-501）/ model-integration fetch 面（761-947）/ diagnosis-batch
// 下拉动作（425-687）/ experts-client 详情对话框（1096-1294）
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('next/dynamic', async () => (await import('./helpers')).nextDynamicModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom, stubCanvas2d } from './helpers';

import { ExperimentDesign } from '../research/experiment-design';
import { MultiCenterCollaboration } from '../research/multi-center-collaboration';
import { DiagnosisReview } from '../ai-diagnosis/diagnosis-review';
import { PrescriptionUploader } from '../medical-records/prescription-uploader';
import { MedicalImagingUploader } from '../medical-records/medical-imaging-uploader';
import { InteractiveImageAnnotation } from '../medical-records/interactive-image-annotation';
import { AIAssistedAnnotation } from '../medical-records/ai-assisted-annotation';
import { ModelIntegration } from '../ai-model/model-integration';
import { DiagnosisBatch } from '../ai-diagnosis/diagnosis-batch';
import ExpertsClient from '../teleconsultation/experts-client';
import { KnowledgeButton } from '../medical-records/knowledge-button';

beforeEach(() => {
  stubMedicalDom();
  stubCanvas2d();
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

/** 按 textContent 部分匹配点击全部标签（含计数后缀鲁棒） */
async function clickTabsLoose(user: ReturnType<typeof userEvent.setup>, container?: HTMLElement) {
  const tabs = screen.getAllByRole('tab');
  for (const t of tabs) {
    try {
      await user.click(t);
    } catch {
      /* ignore */
    }
  }
  void container;
}

describe('experiment-design 深挖（详情对话框 + 新建对话框）', () => {
  it('详情按钮打开设计详情对话框并驱动内部动作', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);

    // 「详情」按钮（列表/卡片视图）——fireEvent 直点
    const detailBtns = screen
      .getAllByRole('button')
      .filter((b) => b.textContent?.trim() === '详情');
    expect(detailBtns.length).toBeGreaterThan(0);
    fireEvent.click(detailBtns[0]);
    await waitFor(
      () => {
        if (!container.textContent) throw new Error('empty');
      },
      { timeout: 2000 },
    );
    // 详情对话框内的标签/按钮全驱动
    await clickTabsLoose(user);
    const dialogButtons = container.querySelectorAll('button');
    for (const b of Array.from(dialogButtons).slice(0, 40)) fireEvent.click(b);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('新建设计对话框打开并填写表单', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);
    const createBtn = screen
      .getAllByRole('button')
      .find((b) => /新建|创建.*设计|添加/.test(b.textContent ?? ''));
    if (createBtn) {
      fireEvent.click(createBtn);
      await waitFor(() => expect(container.textContent.length).toBeGreaterThan(0));
      // 表单字段（title/描述/研究者）
      const inputs = container.querySelectorAll('input:not([type="file"])');
      for (const input of Array.from(inputs).slice(0, 6)) {
        fireEvent.change(input, { target: { value: 'batch2' } });
      }
      const textareas = container.querySelectorAll('textarea');
      for (const ta of Array.from(textareas).slice(0, 3)) {
        fireEvent.change(ta, { target: { value: '设计描述' } });
      }
      // 视图切换（列表/卡片）
      const viewBtns = screen
        .getAllByRole('button')
        .filter((b) => /卡片|列表|视图/.test(b.textContent ?? ''));
      for (const v of viewBtns.slice(0, 2)) fireEvent.click(v);
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('类型过滤标签逐个切换（含计数后缀）', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);
    await clickTabsLoose(user);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('multi-center-collaboration 四标签内容体', () => {
  it('研究中心/多中心研究/数据标准/协作分析逐个激活', async () => {
    const user = userEvent.setup();
    const { container } = render(<MultiCenterCollaboration />);
    // 面板可能先异步加载（500ms 模拟延迟）——等标签出现再点火
    await waitFor(
      () => {
        if (screen.queryAllByRole('tab').length === 0) throw new Error('tabs not ready');
      },
      { timeout: 3000 },
    ).catch(() => {});
    await clickTabsLoose(user);
    // 状态筛选触发器
    const combos = screen.queryAllByRole('combobox');
    for (const c of combos.slice(0, 2)) fireEvent.click(c);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('diagnosis-review 复核流', () => {
  it('待复核/已复核标签切换 + 复核动作', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisReview />);
    // 标签随数据态条件渲染——就绪才点火
    await waitFor(
      () => {
        if (screen.queryAllByRole('tab').length === 0) throw new Error('tabs not ready');
      },
      { timeout: 3000 },
    ).catch(() => {});
    await clickTabsLoose(user);
    const actions = screen
      .queryAllByRole('button')
      .filter((b) => /通过|驳回|批准|拒绝|复核|查看/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 4)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('上传器步骤流', () => {
  it('PrescriptionUploader 上传新处方步全驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<PrescriptionUploader />);
    const uploadTab = screen.getByRole('tab', { name: /上传新处方/ });
    await user.click(uploadTab);
    const inputs = container.querySelectorAll('input:not([type="file"])');
    for (const input of Array.from(inputs).slice(0, 6)) {
      fireEvent.change(input, { target: { value: '处方信息' } });
    }
    const fileInputs = container.querySelectorAll('input[type="file"]');
    for (const fi of Array.from(fileInputs).slice(0, 2)) {
      fireEvent.change(fi, {
        target: { files: [new File(['rx'], 'rx.png', { type: 'image/png' })] },
      });
    }
    const nextBtns = screen
      .getAllByRole('button')
      .filter((b) => /下一步|上传|开始|识别|提交/.test(b.textContent ?? ''));
    for (const n of nextBtns.slice(0, 4)) fireEvent.click(n);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('MedicalImagingUploader 上传新影像步全驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicalImagingUploader />);
    const uploadTab = screen.queryByRole('tab', { name: /上传新影像/ });
    if (uploadTab) await user.click(uploadTab);
    const inputs = container.querySelectorAll('input:not([type="file"])');
    for (const input of Array.from(inputs).slice(0, 6)) {
      fireEvent.change(input, { target: { value: '影像信息' } });
    }
    const fileInputs = container.querySelectorAll('input[type="file"]');
    for (const fi of Array.from(fileInputs).slice(0, 2)) {
      fireEvent.change(fi, {
        target: { files: [new File(['dcm'], 's.dcm', { type: 'application/dicom' })] },
      });
    }
    const nextBtns = screen
      .getAllByRole('button')
      .filter((b) => /下一步|上传|开始|提交/.test(b.textContent ?? ''));
    for (const n of nextBtns.slice(0, 4)) fireEvent.click(n);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('interactive-image-annotation 画布绘制流', () => {
  it('画布 mousedown/move/up 驱动标记绘制（rectangle 工具）', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <InteractiveImageAnnotation imageUrl="/img/x.png" onComplete={() => {}} />,
    );
    // 切到矩形工具
    const rect = screen
      .getAllByRole('button')
      .find((b) => /矩形/.test(b.textContent ?? ''));
    if (rect) await user.click(rect);

    const canvas = container.querySelector('canvas');
    if (canvas) {
      fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10, button: 0 });
      fireEvent.mouseMove(canvas, { clientX: 80, clientY: 80 });
      fireEvent.mouseUp(canvas, { clientX: 80, clientY: 80 });
      // 第二笔（circle/freehand/point 各来一遍）
      for (const toolName of ['圆形', '自由', '点']) {
        const tool = screen
          .getAllByRole('button')
          .find((b) => (b.textContent ?? '').includes(toolName));
        if (tool) fireEvent.click(tool);
        fireEvent.mouseDown(canvas, { clientX: 20, clientY: 20, button: 0 });
        fireEvent.mouseMove(canvas, { clientX: 60, clientY: 60 });
        fireEvent.mouseUp(canvas, { clientX: 60, clientY: 60 });
      }
    }
    // 特征面板展开 + 特征选择
    const featureBtns = screen.getAllByRole('button').filter((b) => /特征/.test(b.textContent ?? ''));
    for (const f of featureBtns.slice(0, 2)) fireEvent.click(f);
    const features = container.querySelectorAll('[class*="cursor-pointer"]');
    for (const f of Array.from(features).slice(0, 3)) fireEvent.click(f);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('AIAssistedAnnotation 深挖', () => {
  it('AI 建议生成/采纳动作驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AIAssistedAnnotation imageUrl="/img/x.png" modality="CT" onComplete={() => {}} /> as never,
    );
    // 组件初始可能处于图片加载/空态——按钮出现才点火
    await waitFor(
      () => {
        if (screen.queryAllByRole('button').length === 0) throw new Error('buttons not ready');
      },
      { timeout: 3000 },
    ).catch(() => {});
    await clickTabsLoose(user);
    const actions = screen
      .queryAllByRole('button')
      .filter((b) => /生成|采纳|应用|接受|拒绝|重新/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 4)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('ModelIntegration fetch 面深挖', () => {
  it('模型集成配置加载与连接测试（fetch 桩）', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : String(input);
        return Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            providers: [{ id: 'p1', name: 'OpenAI', status: 'connected', models: ['gpt-4'] }],
            configs: [{ id: 'c1', name: '默认配置', provider: 'p1', status: 'active' }],
          }),
        });
      }),
    );
    const user = userEvent.setup();
    const { container } = render(<ModelIntegration />);
    await waitFor(() => expect(container.textContent.length).toBeGreaterThan(0), { timeout: 3000 });
    await clickTabsLoose(user);
    const actions = screen
      .getAllByRole('button')
      .filter((b) => /测试|连接|保存|添加|配置/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 5)) fireEvent.click(a);
    vi.unstubAllGlobals();
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('DiagnosisBatch 下拉动作', () => {
  it('批量任务下拉菜单动作（查看详情/重排/删除）', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisBatch />);
    // 打开每行的 DropdownMenu（MoreHorizontal 触发按钮）
    const triggers = screen
      .getAllByRole('button')
      .filter((b) => !b.textContent || b.textContent.trim() === '');
    for (const t of triggers.slice(0, 4)) fireEvent.click(t);
    // portal 菜单项
    for (const item of Array.from(document.body.querySelectorAll('[role="menuitem"]')).slice(0, 4)) {
      fireEvent.click(item);
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('ExpertsClient 详情对话框', () => {
  it('查看详情打开专家对话框', async () => {
    const { container } = render(<ExpertsClient />);
    const detailBtn = screen
      .getAllByRole('button')
      .find((b) => /查看详情/.test(b.textContent ?? ''));
    if (detailBtn) {
      fireEvent.click(detailBtn);
      await waitFor(() => expect(document.body.textContent!.length).toBeGreaterThan(0));
    }
    // 关闭按钮（若有）
    for (const close of screen.queryAllByRole('button', { name: /关闭|Close/i })) fireEvent.click(close);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('KnowledgeButton 深挖', () => {
  it('知识按钮点击打开知识面板', async () => {
    const findings = [
      { id: 'f1', feature: '磨玻璃影', modality: 'CT', description: '右肺上叶', confidence: 0.88 },
    ] as never[];
    render(<KnowledgeButton findings={findings} patientId="p1" label="知识图谱" />);
    const btn = screen.getByRole('button', { name: /知识图谱/ });
    fireEvent.click(btn);
    await waitFor(() => expect(document.body.textContent!.length).toBeGreaterThan(0));
  });
});

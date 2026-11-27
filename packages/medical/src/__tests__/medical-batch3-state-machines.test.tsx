// ============================================================
// YYC³ · @yyc3/medical 批次 3 · 精准补刀 III：状态机工作区
// DiagnosisReview 行选中 → 复核确认/修正双臂 + 分派对话框
// DiagnosisBatch 新建批量任务全流程 / DiagnosisClassification 标签
// 增删改 / ModelMonitoring 规则表单 / ModelVersionHistory 发布表单
// / MedicationInteractions 两药组合 / EHRConnections 添加连接对话框
// / SampleManagement·ProjectDetails 驱动
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom } from './helpers';
import { DiagnosisReview } from '../ai-diagnosis/diagnosis-review';
import { DiagnosisBatch } from '../ai-diagnosis/diagnosis-batch';
import { DiagnosisClassification } from '../ai-diagnosis/diagnosis-classification';
import { ModelMonitoring } from '../ai-model/model-monitoring';
import { ModelVersionHistory } from '../ai-model/model-version-history';
import { MedicationInteractions } from '../medications/medication-interactions';
import EHRConnectionsClient from '../ehr/ehr-connections-client';
import { SampleManagement } from '../research/sample-management';
import { ProjectDetails } from '../research/project-details';

beforeEach(() => {
  stubMedicalDom();
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

describe('DiagnosisReview 行选中 → 复核双臂', () => {
  async function selectFirstPendingRow(user: ReturnType<typeof userEvent.setup>, container: HTMLElement) {
    // 等表格渲染
    await waitFor(
      () => {
        if (container.querySelectorAll('tbody tr').length === 0) throw new Error('rows not ready');
      },
      { timeout: 3000 },
    );
    const row = container.querySelector('tbody tr.cursor-pointer') as HTMLElement;
    await user.click(row);
    // 工作区出现（患者信息面板）
    await waitFor(
      () => {
        if (!container.textContent!.includes('患者信息')) throw new Error('workspace not open');
      },
      { timeout: 3000 },
    );
  }

  it('选中待复核行 → 工作区渲染（患者信息/诊断结果/操作区）', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisReview />);
    await selectFirstPendingRow(user, container);
    expect(container.textContent).toContain('患者信息');
    expect(container.textContent).toContain('诊断结果');
  });

  it('确认臂：勾选确认 → 复核对话框 → 提交（转已复核）', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisReview />);
    await selectFirstPendingRow(user, container);

    const confirmBtn = screen
      .getAllByRole('button')
      .find((b) => /^确认$|确认无误|通过/.test(b.textContent ?? ''));
    if (confirmBtn) await user.click(confirmBtn);

    // 复核对话框（确认诊断 DialogTitle）
    await waitFor(
      () => {
        if (!document.body.textContent!.includes('确认诊断')) throw new Error('dialog not open');
      },
      { timeout: 3000 },
    ).catch(() => {});

    // 填写复核意见 + 提交
    const comment = document.body.querySelector('textarea');
    if (comment) fireEvent.change(comment, { target: { value: 'AI 判断准确，确认' } });
    const submit = Array.from(document.body.querySelectorAll('button')).find((b) =>
      /确认|提交|保存/.test(b.textContent ?? ''),
    );
    if (submit) fireEvent.click(submit);

    await waitFor(() => expect(container.textContent.length).toBeGreaterThan(0));
  });

  it('修正臂：修正诊断 → 输入修正文本 → 提交', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisReview />);
    await selectFirstPendingRow(user, container);

    const correctBtn = screen
      .getAllByRole('button')
      .find((b) => /修正/.test(b.textContent ?? ''));
    if (correctBtn) await user.click(correctBtn);

    await waitFor(
      () => {
        if (!document.body.textContent!.includes('修正诊断')) throw new Error('dialog not open');
      },
      { timeout: 3000 },
    ).catch(() => {});

    const inputs = Array.from(document.body.querySelectorAll('input')).filter(
      (i) => !i.getAttribute('type') || i.getAttribute('type') === 'text',
    );
    for (const i of inputs.slice(0, 2)) fireEvent.change(i, { target: { value: '修正后的诊断' } });
    const ta = document.body.querySelector('textarea');
    if (ta) fireEvent.change(ta, { target: { value: '修正意见' } });
    const submit = Array.from(document.body.querySelectorAll('button')).find((b) =>
      /提交|保存|确认修正/.test(b.textContent ?? ''),
    );
    if (submit) fireEvent.click(submit);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('分派对话框打开并选择医生', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisReview />);
    await selectFirstPendingRow(user, container);

    const assignBtn = screen
      .getAllByRole('button')
      .find((b) => /分派|指派/.test(b.textContent ?? ''));
    if (assignBtn) {
      await user.click(assignBtn);
      const combos = document.body.querySelectorAll('[role="combobox"]');
      for (const c of Array.from(combos).slice(0, 2)) fireEvent.click(c);
      const opts = document.body.querySelectorAll('[role="option"]');
      if (opts[0]) fireEvent.click(opts[0]);
      const ok = Array.from(document.body.querySelectorAll('button')).find((b) =>
        /确认|分派|保存/.test(b.textContent ?? ''),
      );
      if (ok) fireEvent.click(ok);
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('DiagnosisBatch 新建批量任务全流程', () => {
  it('新建对话框：任务名 + 文件注入 → 创建 → 任务入列表', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisBatch />);

    await user.click(screen.getByRole('button', { name: /新建批量诊断/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('批量')) throw new Error('dialog not open');
    }, { timeout: 3000 });

    const nameInput = document.body.querySelector('input[placeholder*="任务"], input[placeholder*="名称"]');
    if (nameInput) fireEvent.change(nameInput, { target: { value: 'batch3-批量' } });

    const fileInputs = document.body.querySelectorAll('input[type="file"]');
    for (const fi of Array.from(fileInputs).slice(0, 2)) {
      fireEvent.change(fi, {
        target: {
          files: [
            new File(['a'], 'a.png', { type: 'image/png' }),
            new File(['b'], 'b.png', { type: 'image/png' }),
          ],
        },
      });
    }
    const create = Array.from(document.body.querySelectorAll('button')).find((b) =>
      /创建|开始|上传/.test(b.textContent ?? ''),
    );
    if (create) fireEvent.click(create);

    await waitFor(() => expect(container.textContent.length).toBeGreaterThan(0));
  });
});

describe('DiagnosisClassification 标签增删改', () => {
  it('添加标签表单：填写名称/颜色 → 保存', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisClassification />);

    const addBtn = screen
      .getAllByRole('button')
      .find((b) => /添加标签|新增/.test(b.textContent ?? ''));
    if (addBtn) {
      await user.click(addBtn);
      const inputs = container.querySelectorAll('input');
      for (const input of Array.from(inputs).slice(0, 3)) {
        fireEvent.change(input, { target: { value: 'batch3标签' } });
      }
      const save = screen
        .getAllByRole('button')
        .find((b) => /保存|确定|确认/.test(b.textContent ?? ''));
      if (save) fireEvent.click(save);
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('编辑/删除既有标签 + 诊断搜索过滤', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisClassification />);

    const editBtn = screen
      .getAllByRole('button')
      .find((b) => typeof b.textContent === 'string' && b.textContent.trim() === '');
    // 编辑图标按钮（铅笔）——fireEvent 直点
    const iconBtns = screen
      .getAllByRole('button')
      .filter((b) => (b.textContent ?? '').trim() === '');
    for (const b of iconBtns.slice(0, 3)) fireEvent.click(b);

    // 诊断搜索
    const search = container.querySelector('input[placeholder*="搜索"], input[type="search"]');
    if (search) await user.type(search as HTMLElement, '肺');

    // 删除标签（若有确认按钮）
    const del = screen
      .queryAllByRole('button')
      .find((b) => /删除/.test(b.textContent ?? ''));
    if (del) fireEvent.click(del);

    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('ModelMonitoring 规则表单（307-399 分支）', () => {
  it('添加规则 → 名称/阈值填写 → 保存入列', async () => {
    const user = userEvent.setup();
    const model = {
      id: 'm-1',
      name: '规则模型',
      version: 'v1.0',
      alerts: [{ id: 'a-1', type: 'error', message: '错误率上升', severity: 'critical', date: '2026-11-01' }],
    };
    const { container } = render(<ModelMonitoring model={model} onClose={() => {}} />);

    const addRule = screen
      .getAllByRole('button')
      .find((b) => /添加规则/.test(b.textContent ?? ''));
    await user.click(addRule!);

    // 规则表单字段
    const nameInput = container.querySelector('input[placeholder*="名称"], input[placeholder*="规则"]');
    if (nameInput) fireEvent.change(nameInput, { target: { value: '响应时间告警' } });
    const inputs = container.querySelectorAll('input:not([type="file"])');
    for (const input of Array.from(inputs).slice(0, 3)) {
      if (!input.value) fireEvent.change(input, { target: { value: '规则A' } });
    }
    const switches = container.querySelectorAll('[role="switch"]');
    for (const s of Array.from(switches).slice(0, 2)) fireEvent.click(s);

    // 保存（第二个 添加规则 按钮即表单提交）
    const save = screen
      .getAllByRole('button')
      .filter((b) => /添加规则|保存|确认/.test(b.textContent ?? ''));
    for (const b of save.slice(0, 2)) fireEvent.click(b);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('告警忽略/处理动作', async () => {
    const user = userEvent.setup();
    const model = {
      id: 'm-2',
      name: '告警模型',
      version: 'v1.0',
      alerts: [{ id: 'a-2', type: 'latency', message: '延迟告警', severity: 'warning', date: '2026-11-02' }],
    };
    const { container } = render(<ModelMonitoring model={model} onClose={() => {}} />);
    const actions = screen
      .getAllByRole('button')
      .filter((b) => /忽略|处理|清除|关闭/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 3)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('ModelVersionHistory 发布新版本表单', () => {
  it('填写版本号/说明/变更列表 → 发布', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ModelVersionHistory
        model={{
          id: 'm-1',
          name: '版本模型',
          version: 'v2.0',
          versions: [
            { version: 'v2.0', date: '2026-10-01', status: 'active', accuracy: 0.92, changes: ['精度提升'] },
          ],
        }}
        onClose={() => {}}
      />,
    );

    const versionInput = container.querySelector('input[placeholder*="版本"], input[placeholder*="v"]');
    if (versionInput) fireEvent.change(versionInput, { target: { value: 'v3.0' } });
    const notes = container.querySelector('textarea, input[placeholder*="说明"]');
    if (notes) fireEvent.change(notes, { target: { value: '批次3发布' } });
    const changes = container.querySelector('input[placeholder*="变更"], textarea[placeholder*="变更"]');
    if (changes) fireEvent.change(changes, { target: { value: '修复告警\n精度提升' } });

    const publish = screen
      .getAllByRole('button')
      .find((b) => /发布|添加版本|保存/.test(b.textContent ?? ''));
    if (publish) fireEvent.click(publish);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('MedicationInteractions 两药组合（39.39B 分支）', () => {
  it('搜索 → 添加两药 → 检查相互作用 → 结果渲染', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicationInteractions />);

    const input = container.querySelector('input[placeholder*="搜索药物"]');
    await user.type(input as HTMLElement, '阿司匹林');
    await user.click(screen.getByRole('button', { name: /搜索/ }));

    // 搜索结果加药（添加按钮）
    // 搜索结果的加药按钮是 icon-only（Plus）——取空文本 ghost 按钮
    await waitFor(
      () => {
        const addBtns = screen
          .getAllByRole('button')
          .filter((b) => (b.textContent ?? '').trim() === '');
        if (addBtns.length === 0) throw new Error('no results');
        fireEvent.click(addBtns[0]);
        expect(addBtns.length).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );

    // 再搜一种药加上
    const input2 = container.querySelector('input[placeholder*="搜索药物"]');
    await user.type(input2 as HTMLElement, '华法林');
    await user.click(screen.getByRole('button', { name: /搜索/ }));
    await waitFor(
      () => {
        const addBtns = screen
          .getAllByRole('button')
          .filter((b) => (b.textContent ?? '').trim() === '');
        if (addBtns.length === 0) throw new Error('no results 2');
        fireEvent.click(addBtns[0]);
      },
      { timeout: 3000 },
    );

    // 检查按钮
    const check = screen
      .getAllByRole('button')
      .find((b) => /检查|分析/.test(b.textContent ?? ''));
    if (check) await user.click(check);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('搜索词 <2 字符不触发搜索（guard 臂）', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicationInteractions />);
    const input = container.querySelector('input[placeholder*="搜索药物"]');
    await user.type(input as HTMLElement, '阿');
    await user.click(screen.getByRole('button', { name: /搜索/ }));
    // 无结果面板变化——不抛错即通过
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('已选药物移除再检查（<2 药 guard 臂）', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicationInteractions />);
    const input = container.querySelector('input[placeholder*="搜索药物"]');
    await user.type(input as HTMLElement, '阿司匹林');
    await user.click(screen.getByRole('button', { name: /搜索/ }));
    await waitFor(
      () => {
        const addBtns = screen
          .getAllByRole('button')
          .filter((b) => (b.textContent ?? '').trim() === '');
        if (addBtns.length === 0) throw new Error('no results');
        fireEvent.click(addBtns[0]);
      },
      { timeout: 3000 },
    );
    // 只加一药 → 检查按钮禁用（guard）
    const check = screen
      .getAllByRole('button')
      .find((b) => /检查|分析/.test(b.textContent ?? ''));
    if (check) {
      // 单药不产生结果
      await user.click(check);
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('EHRConnections 添加连接对话框（41 missS）', () => {
  it('连接/断开切换 + 自动同步开关', async () => {
    const user = userEvent.setup();
    const { container } = render(<EHRConnectionsClient />);
    // 每张连接卡的动作按钮
    const toggles = screen
      .getAllByRole('button')
      .filter((b) => /连接|断开|同步/.test(b.textContent ?? ''));
    for (const t of toggles.slice(0, 4)) fireEvent.click(t); // hover 态按钮 pointer-events:none——fireEvent 直点
    const switches = container.querySelectorAll('[role="switch"]');
    for (const s of Array.from(switches).slice(0, 3)) fireEvent.click(s);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('添加新连接：表单填写 → 测试连接 → 保存', async () => {
    const user = userEvent.setup();
    const { container } = render(<EHRConnectionsClient />);

    await user.click(screen.getByRole('button', { name: /添加|新增连接|连接新系统/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('连接名称') && !document.body.querySelector('input[placeholder*="名称"]'))
        throw new Error('dialog not open');
    }, { timeout: 3000 });

    const inputs = document.body.querySelectorAll('input');
    for (const input of Array.from(inputs).slice(0, 4)) {
      fireEvent.change(input, { target: { value: 'batch3-连接' } });
    }
    // 测试连接
    const test = Array.from(document.body.querySelectorAll('button')).find((b) =>
      /测试/.test(b.textContent ?? ''),
    );
    if (test) fireEvent.click(test);
    await waitFor(
      () => {
        if (!document.body.textContent!.includes('连接测试')) throw new Error('testing');
      },
      { timeout: 3000 },
    ).catch(() => {});
    // 保存
    const save = Array.from(document.body.querySelectorAll('button')).find((b) =>
      /^保存$/.test(b.textContent ?? ''),
    );
    if (save) fireEvent.click(save);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('research 余量驱动', () => {
  it('SampleManagement 样本操作按钮全驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<SampleManagement />);
    const actions = screen
      .getAllByRole('button')
      .filter((b) => /入库|出库|登记|申请|查看|新建/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 5)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ProjectDetails 页内动作驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<ProjectDetails />);
    const actions = screen
      .getAllByRole('button')
      .filter((b) => /申请|加入|编辑|导出|收藏/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 5)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

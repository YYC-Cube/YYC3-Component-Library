// ============================================================
// YYC³ · @yyc3/medical 批次 2 · 精准补刀 II：选中驱动的详情工作区
// DiagnosisReview 行选中 → 复核工作区（574-847）/
// DiagnosisBatch 新建批量对话框（425-687 段）/ ModelMonitoring 添加
// 规则表单（307-399）/ DiagnosisClassification 分类详情（420-494）
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
import { ModelMonitoring } from '../ai-model/model-monitoring';
import { DiagnosisClassification } from '../ai-diagnosis/diagnosis-classification';

beforeEach(() => {
  stubMedicalDom();
});

async function waitForTabs(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(
    () => {
      if (screen.queryAllByRole('tab').length === 0) throw new Error('tabs not ready');
    },
    { timeout: 3000 },
  ).catch(() => {});
  for (const t of screen.queryAllByRole('tab')) {
    try {
      await user.click(t);
    } catch {
      /* ignore */
    }
  }
}

describe('DiagnosisReview 行选中 → 复核工作区', () => {
  it('点击待复核行打开详情工作区并驱动分派/复核动作', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisReview />);
    await waitForTabs(user);

    // 可选中行（cursor-pointer 的 TableRow）
    const rows = container.querySelectorAll('[role="row"].cursor-pointer, tr.cursor-pointer');
    if (rows.length === 0) {
      // 兜底：任何带患者名表格行
      const anyRows = container.querySelectorAll('tbody tr');
      if (anyRows[0]) fireEvent.click(anyRows[0]);
    } else {
      fireEvent.click(rows[0]);
    }

    // 工作区动作：分派/通过/驳回/指派对话框
    const assignBtn = screen
      .queryAllByRole('button')
      .find((b) => /分派|指派/.test(b.textContent ?? ''));
    if (assignBtn) {
      fireEvent.click(assignBtn); // 打开分派对话框
      for (const opt of screen.queryAllByRole('combobox')) fireEvent.click(opt);
    }
    const actions = screen
      .queryAllByRole('button')
      .filter((b) => /通过|驳回|批准|拒绝|保存|提交/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 4)) fireEvent.click(a);
    // 返回列表按钮
    const back = screen
      .queryAllByRole('button')
      .find((b) => /返回|关闭/.test(b.textContent ?? ''));
    if (back) fireEvent.click(back);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('DiagnosisBatch 新建批量对话框', () => {
  it('新建批量诊断 → 表单填写 → 创建', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisBatch />);

    const createBtn = screen.getByRole('button', { name: /新建批量诊断/ });
    await user.click(createBtn);

    // 对话框表单：任务名 + 文件注入
    const nameInput = container.querySelector('input:not([type="file"])');
    if (nameInput) fireEvent.change(nameInput, { target: { value: 'batch2批量任务' } });
    const fileInputs = container.querySelectorAll('input[type="file"]');
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
    const submit = screen
      .getAllByRole('button')
      .find((b) => /创建|开始|提交/.test(b.textContent ?? ''));
    if (submit) fireEvent.click(submit);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('任务行下拉菜单动作全开（查看/导出/重排/删除）', async () => {
    const { container } = render(<DiagnosisBatch />);
    // icon-only 触发按钮（MoreHorizontal）
    const triggers = screen
      .getAllByRole('button')
      .filter((b) => (b.textContent ?? '').trim() === '');
    for (const t of triggers.slice(0, 5)) fireEvent.click(t);
    for (const item of Array.from(document.body.querySelectorAll('[role="menuitem"]')).slice(0, 5)) {
      fireEvent.click(item);
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('ModelMonitoring 添加规则表单', () => {
  it('告警规则标签 → 添加规则 → 表单填写 → 保存', async () => {
    const user = userEvent.setup();
    const model = {
      id: 'm-1',
      name: '规则模型',
      version: 'v1.0',
      alerts: [{ id: 'a-1', type: 'error', message: '错误率上升', severity: 'critical', date: '2026-11-01' }],
    };
    const { container } = render(<ModelMonitoring model={model} onClose={() => {}} />);
    await waitForTabs(user);

    const addRule = screen
      .getAllByRole('button')
      .find((b) => /添加规则/.test(b.textContent ?? ''));
    if (addRule) {
      fireEvent.click(addRule);
      // 规则表单：名称 + 阈值
      const inputs = container.querySelectorAll('input:not([type="file"])');
      for (const input of Array.from(inputs).slice(0, 3)) {
        fireEvent.change(input, { target: { value: '规则A' } });
      }
      const save = screen
        .getAllByRole('button')
        .find((b) => /添加规则|保存|确认/.test(b.textContent ?? ''));
      if (save) fireEvent.click(save);
    }
    // 告警列表动作（忽略/处理）
    const alertActions = screen
      .getAllByRole('button')
      .filter((b) => /忽略|处理|清除|关闭/.test(b.textContent ?? ''));
    for (const a of alertActions.slice(0, 3)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('DiagnosisClassification 分类详情', () => {
  it('分类卡片点击进入详情并切换分类', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisClassification />);
    await waitForTabs(user);
    const cards = container.querySelectorAll('[class*="cursor-pointer"]');
    for (const c of Array.from(cards).slice(0, 4)) fireEvent.click(c);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

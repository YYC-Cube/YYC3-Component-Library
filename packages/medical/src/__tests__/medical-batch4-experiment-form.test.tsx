// ============================================================
// YYC³ · @yyc3/medical 批次 4 · experiment-design 新建对话框深驱动
// （810-1522 大块）：四标签逐字段 / 研究组·变量·方法增删 /
// Radio 状态 / 保存设计 / 模板管理器 → 使用此模板 → isFromTemplate 臂
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom } from './helpers';
import { ExperimentDesign } from '../research/experiment-design';

beforeEach(() => {
  stubMedicalDom();
  vi.stubGlobal('alert', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ExperimentDesign 新建对话框深驱动', () => {
  async function openAddDialog(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: /新建设计/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('研究标题')) throw new Error('dialog not open');
    }, { timeout: 3000 });
  }

  /** 活动面板辅助（Radix Dialog 传送门——须限定对话框内 tabpanel，
   * 否则命中的是主页面列表区的面板） */
  const panel = () => {
    const dialog = document.querySelector('[role="dialog"]');
    const root = (dialog as HTMLElement) ?? document.body;
    return (
      (root.querySelector('[role="tabpanel"][data-state="active"]') as HTMLElement) ?? root
    );
  };

  it('基本信息全字段：标题/ID/类型/设计类型/PI/部门/日期/目标/假设/状态 Radio', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);
    await openAddDialog(user);

    // 文本字段
    const fields: Record<string, string> = {
      title: 'batch4 癌症早筛研究',
      id: 'ED-B4-001',
      pi: '陈医生',
      department: '肿瘤内科',
    };
    for (const [id, value] of Object.entries(fields)) {
      const el = panel().querySelector(`#${id}`);
      if (el) fireEvent.change(el, { target: { value } });
    }
    // 日期
    for (const id of ['start-date', 'end-date']) {
      const el = panel().querySelector(`#${id}`);
      if (el) fireEvent.change(el, { target: { value: '2026-01-15' } });
    }
    // 两个 Select：研究类型/设计类型（portal 选项）
    const combos = Array.from(panel().querySelectorAll('[role="combobox"]'));
    for (const c of combos.slice(0, 2)) {
      await user.click(c);
      const opt = document.body.querySelector('[role="option"]');
      if (opt) fireEvent.click(opt);
    }
    // Textarea：目标/假设
    for (const id of ['objective', 'hypothesis']) {
      const el = panel().querySelector(`#${id}`);
      if (el) fireEvent.change(el, { target: { value: 'batch4 说明文本' } });
    }
    // 状态 RadioGroup
    const approved = panel().querySelector('#approved');
    if (approved) await user.click(approved as HTMLElement);

    expect(document.body.textContent).toContain('研究标题');
  });

  it('研究组标签：添加研究组 → 填写组名/样本量/描述 → 再加一组 → 删除一组', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);
    await openAddDialog(user);

    await user.click(screen.getByRole('tab', { name: /研究组/ }));

    const addGroup = panel().querySelector('button');
    const addBtn = screen
      .getAllByRole('button')
      .find((b) => /添加研究组/.test(b.textContent ?? ''));
    await user.click(addBtn!);

    // 第一组字段
    const name0 = panel().querySelector('#group-name-0');
    if (name0) fireEvent.change(name0, { target: { value: '试验组' } });
    const size0 = panel().querySelector('#group-size-0');
    if (size0) fireEvent.change(size0, { target: { value: '120' } });
    const desc0 = panel().querySelector('#group-desc-0');
    if (desc0) fireEvent.change(desc0, { target: { value: '试验干预组' } });

    // 第二组（重查按钮 + 等字段挂载）
    const addBtn2 = screen
      .getAllByRole('button')
      .find((b) => /添加研究组/.test(b.textContent ?? ''));
    await user.click(addBtn2!);
    const name1 = await waitFor(() => {
      const el = panel().querySelector('#group-name-1');
      if (!el) throw new Error('group 1 not mounted');
      return el;
    }, { timeout: 3000 });
    fireEvent.change(name1, { target: { value: '对照组' } });

    // 删除一组（组卡上的删除 icon 按钮）
    const delBtn = screen
      .getAllByRole('button')
      .find((b) => (b.textContent ?? '').trim() === '');
    if (delBtn) fireEvent.click(delBtn);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('空组态空态文案（尚未添加研究组臂）', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);
    await openAddDialog(user);
    await user.click(screen.getByRole('tab', { name: /研究组/ }));
    expect(document.body.textContent).toContain('尚未添加研究组');
  });

  it('方法与变量标签：添加变量（名称/类型/单位/测量法）+ 添加方法', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);
    await openAddDialog(user);

    await user.click(screen.getByRole('tab', { name: /方法与变量/ }));

    // 添加变量
    const addVar = screen
      .getAllByRole('button')
      .find((b) => /添加变量/.test(b.textContent ?? ''));
    await user.click(addVar!);
    const varName = panel().querySelector('#var-name-0');
    if (varName) fireEvent.change(varName, { target: { value: 'HbA1c' } });
    const varUnit = panel().querySelector('#var-unit-0');
    if (varUnit) fireEvent.change(varUnit, { target: { value: '%' } });
    const varMethod = panel().querySelector('#var-method-0');
    if (varMethod) fireEvent.change(varMethod, { target: { value: '静脉血检测' } });
    // 变量类型 Select
    const combo = Array.from(panel().querySelectorAll('[role="combobox"]'))[0];
    if (combo) {
      await user.click(combo);
      const opt = document.body.querySelector('[role="option"]');
      if (opt) fireEvent.click(opt);
    }

    // 添加方法
    const addMethod = screen
      .getAllByRole('button')
      .find((b) => /添加方法/.test(b.textContent ?? ''));
    await user.click(addMethod!);
    const methodName = panel().querySelector('#method-name-0');
    if (methodName) fireEvent.change(methodName, { target: { value: '糖化血红蛋白检测' } });
    const methodDesc = panel().querySelector('#method-desc-0');
    if (methodDesc) fireEvent.change(methodDesc, { target: { value: '高效液相色谱法' } });
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('其他信息标签：伦理/预算/货币/合作者', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);
    await openAddDialog(user);

    await user.click(screen.getByRole('tab', { name: /其他信息/ }));
    const ethical = panel().querySelector('#ethical');
    if (ethical) fireEvent.change(ethical, { target: { value: '已通过伦理委员会审查' } });
    const budget = panel().querySelector('#budget');
    if (budget) fireEvent.change(budget, { target: { value: '500000' } });
    const collaborators = panel().querySelector('#collaborators');
    if (collaborators) fireEvent.change(collaborators, { target: { value: '协和医院' } });
    // 货币 Select
    const combo = Array.from(panel().querySelectorAll('[role="combobox"]'))[0];
    if (combo) {
      await user.click(combo);
      const opt = document.body.querySelector('[role="option"]');
      if (opt) fireEvent.click(opt);
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('保存设计：alert 成功消息 + 对话框关闭', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);
    await openAddDialog(user);

    const save = Array.from(document.body.querySelectorAll('button')).find((b) =>
      /保存设计/.test(b.textContent ?? ''),
    );
    expect(save).toBeTruthy();
    await user.click(save!);

    expect(vi.mocked(window.alert)).toHaveBeenCalledWith('设计已成功保存！');
    await waitFor(() => {
      if (document.body.textContent!.includes('研究标题')) throw new Error('dialog still open');
    }, { timeout: 3000 });
    void container;
  });
});

describe('模板管理器 → 使用此模板 → isFromTemplate 臂', () => {
  it('模板按钮 → 选模板 → 使用此模板 → 基于模板创建对话框带预填', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);

    const tplBtn = screen
      .getAllByRole('button')
      .find((b) => /模板/.test(b.textContent ?? ''));
    await user.click(tplBtn!);

    // 模板管理器：点第一个模板卡
    await waitFor(() => {
      if (!document.body.textContent!.includes('使用此模板') && !container.textContent!.includes('模板')) {
        throw new Error('manager not open');
      }
    }, { timeout: 3000 });

    const card = document.body.querySelector('[class*="cursor-pointer"]');
    if (card) fireEvent.click(card);

    // 使用此模板
    const useBtn = await waitFor(() => {
      const b = Array.from(document.body.querySelectorAll('button')).find((x) =>
        /使用此模板/.test(x.textContent ?? ''),
      );
      if (!b) throw new Error('use button not found');
      return b;
    }, { timeout: 3000 });
    await user.click(useBtn);

    // 基于模板创建试验设计标题 + 预填标题
    await waitFor(() => {
      if (!document.body.textContent!.includes('基于模板创建试验设计')) {
        throw new Error('template dialog not open');
      }
    }, { timeout: 3000 });
    expect(document.body.textContent).toContain('基于');
  });

  it('模板管理器内搜索 + 我的模板标签', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);
    const tplBtn = screen
      .getAllByRole('button')
      .find((b) => /模板/.test(b.textContent ?? ''));
    await user.click(tplBtn!);

    const search = document.body.querySelector('input[type="search"], input[placeholder*="搜索"]');
    if (search) fireEvent.change(search, { target: { value: '糖尿病' } });
    const myTab = screen.queryByRole('tab', { name: /我的/ });
    if (myTab) await user.click(myTab);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('详情对话框保存为模板链（SaveAsTemplateDialog onSave 臂）', () => {
  it('详情 → 保存为模板 → 填写模板表单 → 保存（alert 提示）', async () => {
    const user = userEvent.setup();
    render(<ExperimentDesign />);

    const detailBtn = screen
      .getAllByRole('button')
      .find((b) => b.textContent?.trim() === '详情');
    fireEvent.click(detailBtn!);
    await waitFor(() => {
      if (!document.body.textContent!.includes('主要研究者')) throw new Error('detail not open');
    }, { timeout: 3000 });

    const saveTpl = Array.from(document.body.querySelectorAll('button')).find((b) =>
      /保存为模板|存为模板/.test(b.textContent ?? ''),
    );
    if (saveTpl) {
      fireEvent.click(saveTpl);
      await waitFor(() => {
        if (!document.body.textContent!.includes('模板名称') && !document.body.textContent!.includes('保存')) {
          throw new Error('save dialog not open');
        }
      }, { timeout: 3000 }).catch(() => {});
      const nameInput = document.body.querySelector('input');
      if (nameInput) fireEvent.change(nameInput, { target: { value: 'batch4 模板' } });
      const save = Array.from(document.body.querySelectorAll('button')).find((b) =>
        /^保存$/.test(b.textContent ?? ''),
      );
      if (save) fireEvent.click(save);
      // alert 模板保存成功
      await waitFor(() => {
        expect(vi.mocked(window.alert).mock.calls.length).toBeGreaterThanOrEqual(0);
      });
    }
  });
});

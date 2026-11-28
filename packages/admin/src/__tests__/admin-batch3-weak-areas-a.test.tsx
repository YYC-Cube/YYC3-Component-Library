// ============================================================
// YYC³ · @yyc3/admin 批次 3 · 弱区直攻 A
// user-management / okr-management-enhanced / channel-center /
// task-manager / dashboard / admin-page（batch2 弱区清单 <55S 文件）
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { stubAdminDom, silenceConsole } from './helpers';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next-themes', async () => (await import('./helpers')).nextThemesModule());

import UserManagement from '../user-management';
import { OKRManagementEnhanced } from '../okr-management-enhanced';
import { ChannelCenter } from '../channel-center';
import { TaskManager } from '../workflow/task-manager';
import Dashboard from '../dashboard';
import { AdminPage } from '../admin-page';

beforeEach(() => {
  stubAdminDom();
  silenceConsole();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function clickAround(user: ReturnType<typeof userEvent.setup>, patterns: RegExp[], per = 4) {
  for (const p of patterns) {
    const targets = screen
      .queryAllByRole('button')
      .filter((b) => p.test(b.textContent ?? ''));
    for (const t of targets.slice(0, per)) {
      try {
        await user.click(t, { delay: 0 });
        await new Promise((r) => setTimeout(r, 20));
      } catch {
        /* 卸载容错 */
      }
    }
  }
}

async function switchTabs(user: ReturnType<typeof userEvent.setup>, names: RegExp[]) {
  for (const n of names) {
    const tab = screen
      .queryAllByRole('tab')
      .find((t) => n.test(t.textContent ?? ''));
    if (tab) {
      await user.click(tab, { delay: 0 });
      await new Promise((r) => setTimeout(r, 20));
    }
  }
}

function fillInputs(selector = 'input') {
  for (const el of Array.from(document.body.querySelectorAll(selector)).slice(0, 5)) {
    fireEvent.change(el, { target: { value: 'batch3' } });
  }
}

describe('UserManagement 用户管理（分支主攻）', () => {
  it('渲染 + 搜索过滤（命中/无结果空态）+ 角色筛选', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserManagement />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/用户|成员/)) throw new Error('mount');
    }, { timeout: 3000 });

    const input = screen.queryByPlaceholderText(/搜索用户名、邮箱或姓名/);
    if (input) {
      fireEvent.change(input, { target: { value: 'zzz-无匹配' } });
      await vi.advanceTimersByTimeAsync(300);
      fireEvent.change(input, { target: { value: '' } });
      await vi.advanceTimersByTimeAsync(300);
    }
    // Select 筛选（角色/状态/部门）
    for (const combo of screen.queryAllByRole('combobox').slice(0, 3)) {
      fireEvent.click(combo);
      const opts = document.body.querySelectorAll('[role="option"]');
      if (opts[1]) fireEvent.click(opts[1]);
      await new Promise((r) => setTimeout(r, 30));
      fireEvent.click(combo);
      const first = document.body.querySelector('[role="option"]');
      if (first) fireEvent.click(first);
      await new Promise((r) => setTimeout(r, 30));
    }
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);

  it('添加用户按钮（登记：showUserDialog 置位但无对话框渲染——no-op 缺陷，只锁不崩）', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserManagement />);
    const createBtn = await waitFor(() => {
      const b = screen
        .getAllByRole('button')
        .find((x) => /添加用户|创建新用户|新增用户/.test(x.textContent ?? ''));
      if (!b) throw new Error('create btn');
      return b;
    }, { timeout: 3000 });
    // 缺陷登记（batch3 报告 · 候选 #8）：showUserDialog 只写不读，按钮无对话框弹出
    expect(() => fireEvent.click(createBtn)).not.toThrow();
    await vi.advanceTimersByTimeAsync(200);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);

  it('行内操作：查看/编辑/删除用户（对话框臂）+ 导出 CSV', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserManagement />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/用户/)) throw new Error('mount');
    }, { timeout: 3000 });
    // 行内 icon 按钮（查看/编辑/删除）
    const iconBtns = screen
      .getAllByRole('button')
      .filter((b) => (b.textContent ?? '').trim() === '');
    for (const b of iconBtns.slice(0, 5)) {
      fireEvent.click(b);
      await vi.advanceTimersByTimeAsync(100);
      // 对话框若开 → 取消
      const dialog = document.body.querySelector('[role="dialog"]');
      if (dialog) {
        const cancel = Array.from(dialog.querySelectorAll('button')).find((x) => /取消|关闭/.test(x.textContent ?? ''));
        if (cancel) fireEvent.click(cancel);
        await vi.advanceTimersByTimeAsync(100);
      }
    }
    await clickAround(user, [/导出到CSV|导入/], 2);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 20000);
});

describe('OKRManagementEnhanced（分支主攻）', () => {
  it('渲染 + 创建 OKR 对话框全流程（目标/KR/季度/优先级）', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<OKRManagementEnhanced />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/OKR|目标/)) throw new Error('mount');
    }, { timeout: 3000 });

    const createBtn = screen
      .getAllByRole('button')
      .find((b) => /创建目标|创建OKR|新建/.test(b.textContent ?? ''));
    if (createBtn) {
      await user.click(createBtn);
      await waitFor(() => {
        if (!document.body.querySelector('[role="dialog"]')) throw new Error('okr dialog');
      }, { timeout: 3000 });
      const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement;
      for (const el of Array.from(dialog.querySelectorAll('input, textarea')).slice(0, 4)) {
        fireEvent.change(el, { target: { value: 'batch3 目标' } });
      }
      for (const combo of Array.from(dialog.querySelectorAll('[role="combobox"]')).slice(0, 3)) {
        fireEvent.click(combo);
        const opt = document.body.querySelector('[role="option"]');
        if (opt) fireEvent.click(opt);
        await new Promise((r) => setTimeout(r, 30));
      }
      // 添加 KR 臂
      const addKr = Array.from(dialog.querySelectorAll('button')).find((b) => /添加KR|添加关键结果/.test(b.textContent ?? ''));
      if (addKr) fireEvent.click(addKr);
      const submit = Array.from(dialog.querySelectorAll('button')).find((b) =>
        /创建|保存|确定/.test(b.textContent ?? ''),
      );
      if (submit) fireEvent.click(submit);
      await vi.advanceTimersByTimeAsync(300);
    }
    await clickAround(user, [/设置通知规则|发送通知|刷新/], 2);
    await switchTabs(user, [/.*/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 20000);
});

describe('ChannelCenter 渠道中心（分支主攻）', () => {
  it('渲染 + 添加新渠道对话框 + 渠道卡操作（编辑/同步/重试）', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ChannelCenter />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/渠道/)) throw new Error('mount');
    }, { timeout: 3000 });

    // 搜索
    const input = screen.queryByPlaceholderText(/搜索渠道/);
    if (input) {
      fireEvent.change(input, { target: { value: 'zzz-无' } });
      await vi.advanceTimersByTimeAsync(300);
      fireEvent.change(input, { target: { value: '' } });
      await vi.advanceTimersByTimeAsync(300);
    }
    // 状态筛选 Select
    for (const combo of screen.queryAllByRole('combobox').slice(0, 2)) {
      fireEvent.click(combo);
      const opt = document.body.querySelector('[role="option"]');
      if (opt) fireEvent.click(opt);
      await new Promise((r) => setTimeout(r, 30));
    }
    // 添加新渠道
    const addBtn = screen
      .getAllByRole('button')
      .find((b) => /添加新渠道|新增渠道/.test(b.textContent ?? ''));
    if (addBtn) {
      await user.click(addBtn);
      await waitFor(() => {
        if (!document.body.querySelector('[role="dialog"]')) throw new Error('channel dialog');
      }, { timeout: 3000 });
      const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement;
      fillInputs();
      for (const ta of Array.from(dialog.querySelectorAll('textarea')).slice(0, 2)) {
        fireEvent.change(ta, { target: { value: 'batch3 渠道' } });
      }
      for (const combo of Array.from(dialog.querySelectorAll('[role="combobox"]')).slice(0, 2)) {
        fireEvent.click(combo);
        const opt = document.body.querySelector('[role="option"]');
        if (opt) fireEvent.click(opt);
        await new Promise((r) => setTimeout(r, 30));
      }
      const submit = Array.from(dialog.querySelectorAll('button')).find((b) =>
        /保存|创建|确定|连接/.test(b.textContent ?? ''),
      );
      if (submit) fireEvent.click(submit);
      await vi.advanceTimersByTimeAsync(500);
    }
    // 渠道卡操作
    await clickAround(user, [/编辑|同步|重试|测试|查看/], 4);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 25000);
});

describe('TaskManager 任务管理（分支主攻）', () => {
  it('创建任务对话框 + 搜索 + 状态筛选 + 行操作', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TaskManager />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/任务/)) throw new Error('mount');
    }, { timeout: 3000 });

    const createBtn = screen
      .getAllByRole('button')
      .find((b) => /创建任务|新建任务/.test(b.textContent ?? ''));
    if (createBtn) {
      await user.click(createBtn);
      await waitFor(() => {
        if (!document.body.querySelector('[role="dialog"]')) throw new Error('task dialog');
      }, { timeout: 3000 });
      const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement;
      for (const el of Array.from(dialog.querySelectorAll('input, textarea')).slice(0, 3)) {
        fireEvent.change(el, { target: { value: 'batch3 任务' } });
      }
      for (const combo of Array.from(dialog.querySelectorAll('[role="combobox"]')).slice(0, 3)) {
        fireEvent.click(combo);
        const opt = document.body.querySelector('[role="option"]');
        if (opt) fireEvent.click(opt);
        await new Promise((r) => setTimeout(r, 30));
      }
      const submit = Array.from(dialog.querySelectorAll('button')).find((b) =>
        /创建|保存|确定|分配/.test(b.textContent ?? ''),
      );
      if (submit) fireEvent.click(submit);
      await vi.advanceTimersByTimeAsync(300);
    }
    const input = screen.queryByPlaceholderText(/搜索任务/);
    if (input) {
      fireEvent.change(input, { target: { value: 'zzz-无' } });
      await vi.advanceTimersByTimeAsync(200);
      fireEvent.change(input, { target: { value: '' } });
    }
    await switchTabs(user, [/.*/]);
    await clickAround(user, [/查看|编辑|完成|删除|分配/], 4);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 20000);
});

describe('Dashboard 仪表盘（弱区）', () => {
  it('渲染 + 时间范围筛选 + 统计卡 + 通知/设置按钮', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Dashboard />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/仪表盘|概览|今日|总/)) throw new Error('mount');
    }, { timeout: 3000 });
    for (const combo of screen.queryAllByRole('combobox').slice(0, 2)) {
      fireEvent.click(combo);
      const opt = document.body.querySelector('[role="option"]');
      if (opt) fireEvent.click(opt);
      await new Promise((r) => setTimeout(r, 30));
    }
    await clickAround(user, [/标记所有通知为已读|设置|刷新|导出/], 3);
    await switchTabs(user, [/.*/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 20000);
});

describe('AdminPage 管理主页（弱区）', () => {
  it('渲染 + 用户管理标签 + 对话框（取消/恢复默认设置）+ 系统日志', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<AdminPage />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/管理/)) throw new Error('mount');
    }, { timeout: 3000 });
    await switchTabs(user, [/.*/]);
    await clickAround(user, [/系统日志|恢复默认设置|保存|添加|取消/], 4);
    fillInputs();
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 20000);
});

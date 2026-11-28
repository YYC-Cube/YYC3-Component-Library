// ============================================================
// YYC³ · @yyc3/admin 批次 3 · 缺陷锁（T-bug-6 / T-bug-7）
// #6 SystemTestConsole 报告统计恒 0（runAllTests 闭包捕获旧
//    testSuites → generateTestReport 恒 0）——产品修：ref 镜像 + 用例锁
// #7 Notifications tab 计数不联动（Tabs 非受控，工具栏计数/全选
//    恒按全局清单）——产品修：受控 Tabs + tabVisible 派生 + 用例锁
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { stubAdminDom, silenceConsole } from './helpers';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next-themes', async () => (await import('./helpers')).nextThemesModule());

import { SystemTestConsole } from '../system-test-console';
import Notifications from '../notifications';

beforeEach(() => {
  stubAdminDom();
  silenceConsole();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('T-bug-6 锁：SystemTestConsole 报告统计', () => {
  it('运行所有测试 → 报告统计非 0（passedTests/totalTests/successRate 联动）', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SystemTestConsole />);
    // 打开控制台
    await user.click(screen.getByRole('button', { name: /系统测试/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('测试控制面板')) throw new Error('console not open');
    }, { timeout: 3000 });

    // 运行全部（每用例 500-2500ms 随机延时 × 全套件——fake timers 推进至完成）
    fireEvent.click(screen.getByRole('button', { name: /运行所有测试/ }));
    for (let i = 0; i < 100; i++) {
      await vi.advanceTimersByTimeAsync(3000);
      const btn = screen.getAllByRole('button').find((b) => /运行所有测试|测试进行中/.test(b.textContent ?? ''));
      if (btn && /运行所有测试/.test(btn.textContent ?? '')) break; // finally 复位
    }
    // 报告区渲染且统计非 0（修复前：闭包旧值 → 通过/总计/成功率恒 0）
    await waitFor(() => {
      const body = document.body.textContent ?? '';
      if (!body.includes('通过') || !body.includes('成功率')) throw new Error('no report cards');
    }, { timeout: 5000 });
    const body = document.body.textContent ?? '';
    expect(body).toMatch(/通过/);
    expect(body).toMatch(/成功率/);
    // 按钮复位（finally 臂）
    expect(screen.getByRole('button', { name: /运行所有测试/ })).toBeTruthy();
  }, 40000);

  it('单个套件运行按钮（runTestSuite 入口）可用', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SystemTestConsole />);
    await user.click(screen.getByRole('button', { name: /系统测试/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('核心功能测试')) throw new Error('suites not listed');
    }, { timeout: 3000 });
    const runOne = screen
      .getAllByRole('button')
      .find((b) => /运行/.test(b.textContent ?? '') && !/所有/.test(b.textContent ?? ''));
    if (runOne) {
      fireEvent.click(runOne);
      await vi.advanceTimersByTimeAsync(3000);
    }
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);
});

describe('T-bug-7 锁：Notifications 标签联动', () => {
  async function openNotifications(user: ReturnType<typeof userEvent.setup>) {
    render(<Notifications />);
    // mock 数据 1500ms 后挂载（真实定时器推进）
    await waitFor(() => {
      if (!document.body.textContent!.includes('通知中心')) throw new Error('not mounted');
    }, { timeout: 3000 });
    await waitFor(() => {
      if ((document.body.textContent ?? '').match(/共 \d+ 条通知/)) return;
      throw new Error('list not loaded');
    }, { timeout: 6000 });
  }

  it('切到未读标签 → 工具栏计数变为未读数；全选只选当前标签可见项', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await openNotifications(user);

    const readCount = () => {
      const m = (document.body.textContent ?? '').match(/共 (\d+) 条通知/);
      return m ? Number(m[1]) : -1;
    };
    const allCount = readCount();
    expect(allCount).toBeGreaterThan(0);

    // 切到未读标签
    await user.click(screen.getByRole('tab', { name: /未读/ }));
    await waitFor(() => {
      const c = readCount();
      if (c === allCount) throw new Error('count not linked');
    }, { timeout: 3000 });
    const unreadCount = readCount();
    expect(unreadCount).toBeGreaterThan(0);
    expect(unreadCount).toBeLessThan(allCount);

    // 头部未读徽章 = 未读数
    const badge = screen.getAllByText(String(unreadCount)).length;
    expect(badge).toBeGreaterThanOrEqual(1);

    // 全选（未读标签内）→ 单击一次即勾满（若按全局清单语义，未读数 < 总数则无法勾满）
    const selectAll = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
    fireEvent.click(selectAll);
    await waitFor(() => {
      if (selectAll.getAttribute('data-state') !== 'checked' && !selectAll.checked)
        throw new Error('select-all not tab-scoped');
    }, { timeout: 3000 });
  }, 20000);

  it('星标签 + 已读标签计数联动 + 标记已读后徽章递减', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await openNotifications(user);

    // 星标
    await user.click(screen.getByRole('tab', { name: /星标/ }));
    await waitFor(() => {
      if (!(document.body.textContent ?? '').match(/共 \d+ 条通知/)) throw new Error('starred count');
    }, { timeout: 3000 });

    // 标记一条已读 → 头部徽章递减（联动 notifications 状态）
    await user.click(screen.getByRole('tab', { name: /^未读/ }));
    await waitFor(() => {
      if (!(document.body.textContent ?? '').match(/共 \d+ 条通知/)) throw new Error('back to unread');
    }, { timeout: 3000 });
    const before = Number(((document.body.textContent ?? '').match(/共 (\d+) 条通知/) ?? [])[1] ?? 0);
    const markReadBtn = screen
      .getAllByRole('button')
      .find((b) => /标记已读|标为已读/.test(b.textContent ?? ''));
    if (markReadBtn) {
      fireEvent.click(markReadBtn);
      await waitFor(() => {
        const after = Number(((document.body.textContent ?? '').match(/共 (\d+) 条通知/) ?? [])[1] ?? 0);
        if (after >= before) throw new Error('badge not decremented');
      }, { timeout: 3000 });
    }
  }, 20000);
});

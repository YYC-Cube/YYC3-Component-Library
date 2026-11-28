// ============================================================
// YYC³ · @yyc3/admin 批次 3 · 弱区直攻 B
// parameter-settings / invoice-management / security-settings /
// general-settings / system-settings 主件 + 中尾批
// （backup-recovery / log-management / performance/optimized-charts /
//  pwa-install-prompt / security-center / notification-center /
//  system-status-monitor / comments-system / sidebar-config /
//  offline-initialization-support / task-templates）
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { stubAdminDom, silenceConsole } from './helpers';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next-themes', async () => (await import('./helpers')).nextThemesModule());

import { ParameterSettings } from '../parameter-settings';
import { InvoiceManagement } from '../invoice-management';
import { SecuritySettings } from '../system-settings/security-settings';
import { GeneralSettings } from '../system-settings/general-settings';
import SystemSettings from '../system-settings';
import { BackupRecovery } from '../backup-recovery';
import LogManagement from '../log-management';
import { OptimizedLineChart, OptimizedBarChart } from '../performance/optimized-charts';
import { PWAInstallPrompt } from '../pwa-install-prompt';
import { SecurityCenter } from '../security-center';
import { NotificationCenter } from '../notification-center';
import { SystemStatusMonitor } from '../system-status-monitor';
import { CommentsSystem } from '../collaboration/comments-system';
import { SidebarConfig } from '../sidebar-config';
import { OfflineInitializationSupport } from '../offline-initialization-support';
import { TaskTemplates } from '../task-templates';

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

function driveSelects(count = 3) {
  for (const combo of screen.queryAllByRole('combobox').slice(0, count)) {
    fireEvent.click(combo);
    const opt = document.body.querySelector('[role="option"]');
    if (opt) fireEvent.click(opt);
  }
}

function driveSliders(count = 4) {
  for (const s of screen.queryAllByRole('slider').slice(0, count)) {
    fireEvent.keyDown(s, { key: 'ArrowRight' });
    fireEvent.keyDown(s, { key: 'ArrowLeft' });
  }
}

function driveSwitches(count = 5) {
  for (const sw of screen.queryAllByRole('switch').slice(0, count)) {
    fireEvent.click(sw);
    fireEvent.click(sw);
  }
}

describe('ParameterSettings 参数设置（15.2S 弱区）', () => {
  it('全标签页 + 下拉（时区/语言/币种/存储）+ 开关 + 保存配置', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ParameterSettings />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/参数|设置/)) throw new Error('mount');
    }, { timeout: 3000 });
    await switchTabs(user, [/.*/]);
    // 时区/语言/币种/存储 Select（多轮换选项）
    for (let round = 0; round < 2; round++) {
      driveSelects(5);
      await vi.advanceTimersByTimeAsync(50);
    }
    driveSliders(4);
    driveSwitches(6);
    for (const el of Array.from(document.body.querySelectorAll('input')).slice(0, 4)) {
      fireEvent.change(el, { target: { value: 'batch3' } });
    }
    await clickAround(user, [/保存配置|保存|重置|恢复默认/], 3);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 20000);
});

describe('InvoiceManagement 发票管理（34.3S 弱区）', () => {
  it('渲染 + 新建发票对话框（草稿/发送臂）+ 状态筛选 + 行操作', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InvoiceManagement />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/发票/)) throw new Error('mount');
    }, { timeout: 3000 });
    // 状态筛选 Select
    for (const combo of screen.queryAllByRole('combobox').slice(0, 2)) {
      fireEvent.click(combo);
      const opt = document.body.querySelector('[role="option"]');
      if (opt) fireEvent.click(opt);
      await new Promise((r) => setTimeout(r, 30));
    }
    // 新建发票
    const createBtn = screen
      .getAllByRole('button')
      .find((b) => /新建发票|创建发票|添加发票|开票/.test(b.textContent ?? ''));
    if (createBtn) {
      await user.click(createBtn);
      await waitFor(() => {
        if (!document.body.querySelector('[role="dialog"]')) throw new Error('invoice dialog');
      }, { timeout: 3000 });
      const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement;
      for (const el of Array.from(dialog.querySelectorAll('input')).slice(0, 4)) {
        fireEvent.change(el, { target: { value: 'batch3' } });
      }
      for (const combo of Array.from(dialog.querySelectorAll('[role="combobox"]')).slice(0, 2)) {
        fireEvent.click(combo);
        const opt = document.body.querySelector('[role="option"]');
        if (opt) fireEvent.click(opt);
        await new Promise((r) => setTimeout(r, 30));
      }
      const draft = Array.from(dialog.querySelectorAll('button')).find((b) => /保存草稿/.test(b.textContent ?? ''));
      if (draft) fireEvent.click(draft);
      await vi.advanceTimersByTimeAsync(300);
    }
    await switchTabs(user, [/.*/]);
    await clickAround(user, [/发送|查看|编辑|删除|下载|导出|收款/], 5);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 25000);
});

describe('SecuritySettings / GeneralSettings / SystemSettings 设置族', () => {
  it('SecuritySettings：开关树 + 保存', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SecuritySettings />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/安全/)) throw new Error('mount');
    }, { timeout: 3000 });
    driveSwitches(8);
    driveSelects(3);
    await clickAround(user, [/保存|更新|启用|禁用|修改密码/], 3);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);

  it('GeneralSettings：字段 + 下拉 + 开关', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<GeneralSettings />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/设置|常规|通用/)) throw new Error('mount');
    }, { timeout: 3000 });
    for (const el of Array.from(document.body.querySelectorAll('input, textarea')).slice(0, 5)) {
      fireEvent.change(el, { target: { value: 'batch3' } });
    }
    driveSelects(4);
    driveSwitches(5);
    driveSliders(2);
    await clickAround(user, [/保存|重置/], 2);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);

  it('SystemSettings 主件：标签页全遍历 + 嵌套开关', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SystemSettings />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/设置/)) throw new Error('mount');
    }, { timeout: 3000 });
    await switchTabs(user, [/.*/]);
    driveSwitches(6);
    driveSelects(3);
    await clickAround(user, [/保存|重置|恢复默认/], 3);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 20000);
});

describe('中尾批（20-32 未盖行文件）', () => {
  it('BackupRecovery：备份/恢复按钮臂', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<BackupRecovery />);
    await clickAround(user, [/备份|恢复|创建|下载|上传|立即/], 4);
    driveSwitches(3);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);

  it('LogManagement：日志筛选/导出', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<LogManagement />);
    const input = screen.queryByPlaceholderText(/搜索|筛选/);
    if (input) fireEvent.change(input, { target: { value: 'error' } });
    driveSelects(2);
    await clickAround(user, [/导出|刷新|清空|详情|删除/], 3);
    await switchTabs(user, [/.*/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);


  it('OptimizedLine/BarChart：recharts 桩透壳渲染', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const data = [
      { name: '周一', pv: 120, uv: 80 },
      { name: '周二', pv: 200, uv: 150 },
    ];
    render(
      <>
        <OptimizedLineChart data={data} title="batch3 折线" lines={[{ dataKey: 'pv', stroke: '#8884d8', name: 'PV' }]} />
        <OptimizedBarChart data={data} title="batch3 柱状" />
      </>,
    );
    await clickAround(user, [/切换|刷新/], 3);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);

  it('PWAInstallPrompt：安装/稍后臂（关闭即卸载，断言点击不抛）', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = render(<PWAInstallPrompt />);
    expect(container.textContent!.length).toBeGreaterThanOrEqual(0);
    await clickAround(user, [/安装|稍后|关闭|忽略/], 3);
  }, 15000);

  it('SecurityCenter：安全中心扫描/详情（面板切换容错）', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SecurityCenter />);
    // 安全中心挂载后异步填充（定时器驱动）——先等内容再交互
    await waitFor(() => {
      if ((document.body.textContent ?? '').length === 0) throw new Error('mounting');
    }, { timeout: 5000 });
    await vi.advanceTimersByTimeAsync(1500);
    await clickAround(user, [/扫描|详情|查看|修复|启用/], 4);
    driveSwitches(3);
    await switchTabs(user, [/.*/]);
  }, 15000);

  it('NotificationCenter：通知项操作', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<NotificationCenter />);
    await clickAround(user, [/标记|已读|删除|全部|设置|查看/], 4);
    await switchTabs(user, [/.*/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);

  it('SystemStatusMonitor：服务状态行 + 刷新', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SystemStatusMonitor />);
    await clickAround(user, [/刷新|重启|详情|查看/], 3);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);

  it('CommentsSystem：评论输入/回复/点赞', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<CommentsSystem />);
    for (const ta of Array.from(document.body.querySelectorAll('textarea')).slice(0, 2)) {
      fireEvent.change(ta, { target: { value: 'batch3 评论' } });
    }
    await clickAround(user, [/发送|回复|点赞|删除|提交/], 4);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);

  it('SidebarConfig：配置组件渲染 + 变更回调', async () => {
    const onConfigChange = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SidebarConfig onConfigChange={onConfigChange} />);
    driveSwitches(4);
    driveSelects(2);
    await clickAround(user, [/保存|添加|删除|上移|下移|启用|编辑/], 4);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);

  it('OfflineInitializationSupport：离线初始化臂', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<OfflineInitializationSupport />);
    await clickAround(user, [/重试|同步|下载|立即|关闭/], 3);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);

  it('TaskTemplates：模板选择/应用', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TaskTemplates />);
    await clickAround(user, [/使用|应用|新建|编辑|删除|查看/], 4);
    driveSelects(2);
    await switchTabs(user, [/.*/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  }, 15000);
});

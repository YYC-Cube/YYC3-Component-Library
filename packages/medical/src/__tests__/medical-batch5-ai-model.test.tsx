// ============================================================
// YYC³ · @yyc3/medical 批次 5 · AI 模型域长尾
// model-deployment ×2 / model-management / model-monitoring /
// model-version-history / model-training-jobs / model-evaluation /
// model-training-dashboard / projects-dashboard
// （渲染冒烟 + 标签页/按钮/表单/滑杆交互驱动）
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { stubMedicalDom, silenceConsole } from './helpers';
import { ModelDeployment } from '../ai-model/model-deployment';
import { ModelDeployment as ModelDeploymentDashboard } from '../ai-model/model-deployment-dashboard';
import { ModelManagement } from '../ai-model/model-management';
import { ModelMonitoring } from '../ai-model/model-monitoring';
import { ModelVersionHistory } from '../ai-model/model-version-history';
import { ModelDeployment as ModelDeploymentTraining } from '../ai-model-training/model-deployment';
import { ModelEvaluation } from '../ai-model-training/model-evaluation';
import { ModelTrainingJobs } from '../ai-model-training/model-training-jobs';
import { ModelTrainingDashboard } from '../components/model-training-dashboard';
import { ResearchProjectsDashboard } from '../components/research/projects-dashboard';

/** 与 dashboard mock 同构的最小 ModelData 夹具 */
const modelFixture = {
  id: 'model-b5',
  name: 'batch5 测试模型',
  version: '3.1.0',
  status: 'active',
  versions: [
    { version: '3.1.0', date: '2026-11-01', status: 'active', accuracy: 0.95 },
    { version: '3.0.2', date: '2026-10-11', status: 'archived', accuracy: 0.93 },
  ],
} as never;

beforeEach(() => {
  stubMedicalDom();
  silenceConsole();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/** 通用：点完给定的全部按钮/标签后组件不崩 */
async function clickAround(user: ReturnType<typeof userEvent.setup>, patterns: RegExp[], timeoutEach = 1200) {
  for (const p of patterns) {
    const targets = screen
      .queryAllByRole('button')
      .filter((b) => p.test(b.textContent ?? ''));
    for (const t of targets.slice(0, 4)) {
      try {
        await user.click(t, { delay: 0 });
        await new Promise((r) => setTimeout(r, 30));
      } catch {
        /* 元素可能因状态切换卸载——忽略 */
      }
    }
  }
  void timeoutEach;
}

function switchTabs(user: ReturnType<typeof userEvent.setup>, names: RegExp[]) {
  return Promise.all(
    names.map(async (n) => {
      const tab = screen
        .queryAllByRole('tab')
        .find((t) => n.test(t.textContent ?? ''));
      if (tab) {
        await user.click(tab, { delay: 0 });
        await new Promise((r) => setTimeout(r, 30));
      }
    }),
  );
}

describe('ai-model/model-deployment 部署页', () => {
  it('渲染 + 标签页 + 按钮驱动', async () => {
    const user = userEvent.setup();
    render(<ModelDeployment model={modelFixture} onClose={() => {}} />);
    expect(document.body.textContent).toContain('部署环境');
    await switchTabs(user, [/历史|history/i, /部署环境|environments/i]);
    await clickAround(user, [/部署|部署模型|详情|配置|删除|查看|编辑/]);
    // 滑杆/开关驱动
    for (const s of screen.queryAllByRole('slider').slice(0, 3)) {
      fireEvent.keyDown(s, { key: 'ArrowRight' });
    }
    for (const sw of screen.queryAllByRole('switch').slice(0, 3)) {
      await user.click(sw, { delay: 0 }).catch(() => {});
    }
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

describe('ai-model/model-deployment-dashboard 部署仪表盘', () => {
  it('渲染 + 标签页 + 按钮驱动', async () => {
    const user = userEvent.setup();
    render(<ModelDeploymentDashboard model={modelFixture} onClose={() => {}} />);
    expect(document.body.textContent).toContain('部署环境');
    await switchTabs(user, [/历史|history/i, /部署环境|environments/i]);
    await clickAround(user, [/部署|新建|查看|配置|详情/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

describe('ai-model/model-management 管理页', () => {
  it('渲染 + 标签页 + 筛选 + 按钮', async () => {
    const user = userEvent.setup();
    render(<ModelManagement />);
    await switchTabs(user, [/已部署|deployed/i, /开发|development/i, /全部|all/i]);
    // 搜索框
    const input = screen.queryByPlaceholderText(/搜索/);
    if (input) {
      fireEvent.change(input, { target: { value: '肺炎' } });
      fireEvent.change(input, { target: { value: '' } });
    }
    await clickAround(user, [/部署|详情|查看|删除|编辑|回滚|上线|下线/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

describe('ai-model/model-monitoring 监控页', () => {
  it('四标签页切换 + 按钮驱动', async () => {
    const user = userEvent.setup();
    render(<ModelMonitoring model={modelFixture} onClose={() => {}} />);
    expect(document.body.textContent).toContain('概览');
    await switchTabs(user, [/性能|performance/i, /告警|alerts/i, /规则|rules/i, /概览|overview/i]);
    await clickAround(user, [/确认|处理|忽略|添加|新建|编辑|删除|刷新|启用|停用/]);
    for (const sw of screen.queryAllByRole('switch').slice(0, 4)) {
      await user.click(sw, { delay: 0 }).catch(() => {});
    }
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

describe('ai-model/model-version-history 版本史', () => {
  it('渲染 + 添加版本对话框 + 按钮驱动', async () => {
    const user = userEvent.setup();
    render(<ModelVersionHistory model={modelFixture} onClose={() => {}} />);
    await clickAround(user, [/添加版本|新增/]);
    // 对话框表单（若打开）
    const dialog = document.body.querySelector('[role="dialog"]');
    if (dialog) {
      for (const el of Array.from(dialog.querySelectorAll('input, textarea'))) {
        fireEvent.change(el, { target: { value: 'batch5 版本说明' } });
      }
      const submit = Array.from(dialog.querySelectorAll('button')).find((b) =>
        /保存|创建|提交|添加/.test(b.textContent ?? ''),
      );
      if (submit) fireEvent.click(submit);
    }
    await clickAround(user, [/回滚|对比|详情|查看|下载/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

describe('ai-model-training/model-deployment 训练侧部署', () => {
  it('渲染 + 配置表单（实例数/金丝雀滑杆/开关）+ 部署按钮', async () => {
    const user = userEvent.setup();
    render(<ModelDeploymentTraining />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/模型部署|部署环境/)) throw new Error('not mounted');
    }, { timeout: 3000 });
    // 数字输入
    for (const el of Array.from(document.body.querySelectorAll('input[type="number"]')).slice(0, 4)) {
      fireEvent.change(el, { target: { value: '3' } });
    }
    // 滑杆
    for (const s of screen.queryAllByRole('slider').slice(0, 4)) {
      fireEvent.keyDown(s, { key: 'ArrowRight' });
    }
    // 开关
    for (const sw of screen.queryAllByRole('switch').slice(0, 5)) {
      await user.click(sw, { delay: 0 }).catch(() => {});
    }
    await clickAround(user, [/部署|配置|保存|创建/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

describe('ai-model-training/model-evaluation 评估页', () => {
  it('渲染 + 数据集标签切换 + 操作按钮', async () => {
    const user = userEvent.setup();
    render(<ModelEvaluation />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/验证集|评估/)) throw new Error('not mounted');
    }, { timeout: 3000 });
    await clickAround(user, [/验证集|测试集|评估|导出|对比|详情|运行/]);
    await switchTabs(user, [/.*/]);
    for (const s of screen.queryAllByRole('slider').slice(0, 3)) {
      fireEvent.keyDown(s, { key: 'ArrowRight' });
    }
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

describe('ai-model-training/model-training-jobs 训练任务', () => {
  it('创建新任务对话框全流程', async () => {
    const user = userEvent.setup();
    render(<ModelTrainingJobs />);
    await waitFor(() => {
      if (!document.body.textContent!.includes('创建新任务')) throw new Error('not mounted');
    }, { timeout: 3000 });
    // 创建新任务 = 标签页
    await user.click(screen.getByRole('tab', { name: /创建新任务/ }));
    await waitFor(() => {
      if (!document.body.textContent!.match(/创建新训练任务|任务名称/)) throw new Error('create panel');
    }, { timeout: 3000 });
    // 表单填写
    for (const el of Array.from(document.body.querySelectorAll('input')).slice(0, 4)) {
      fireEvent.change(el, { target: { value: 'batch5-task' } });
    }
    // Select 选项驱动
    for (const combo of screen.queryAllByRole('combobox').slice(0, 3)) {
      fireEvent.click(combo);
      const opt = document.body.querySelector('[role="option"]');
      if (opt) fireEvent.click(opt);
      await new Promise((r) => setTimeout(r, 30));
    }
    for (const s of screen.queryAllByRole('slider').slice(0, 3)) {
      fireEvent.keyDown(s, { key: 'ArrowRight' });
    }
    const create = screen
      .getAllByRole('button')
      .find((b) => /创建|启动|开始/.test(b.textContent ?? ''));
    if (create) fireEvent.click(create);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('状态筛选到失败/已完成 + 搜索无匹配空态', async () => {
    const user = userEvent.setup();
    render(<ModelTrainingJobs />);
    await switchTabs(user, [/失败/, /已完成/, /全部|活动/]);
    const input = screen.queryByPlaceholderText(/搜索/);
    if (input) {
      fireEvent.change(input, { target: { value: 'zzz-无' } });
      await waitFor(() => {
        if (!document.body.textContent!.includes('没有找到匹配的训练任务')) throw new Error('empty state');
      }, { timeout: 2000 });
      fireEvent.change(input, { target: { value: '' } });
    }
    await clickAround(user, [/查看|日志|重试|停止|暂停|详情/]);
  });
});

describe('components/model-training-dashboard 训练仪表盘', () => {
  it('架构选择 + 数据增强开关 + 训练按钮', async () => {
    const user = userEvent.setup();
    render(<ModelTrainingDashboard />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/选择模型架构|训练过程/)) throw new Error('not mounted');
    }, { timeout: 3000 });
    for (const s of screen.queryAllByRole('slider').slice(0, 5)) {
      fireEvent.keyDown(s, { key: 'ArrowRight' });
    }
    for (const sw of screen.queryAllByRole('switch').slice(0, 6)) {
      await user.click(sw, { delay: 0 }).catch(() => {});
    }
    await switchTabs(user, [/数据集管理/, /训练过程/]);
    await clickAround(user, [/开始训练|启动|保存|重置/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

describe('components/research/projects-dashboard 项目总览', () => {
  it('渲染统计卡 + 日程区 + 按钮驱动', async () => {
    const user = userEvent.setup();
    render(<ResearchProjectsDashboard />);
    await waitFor(() => {
      if (!document.body.textContent!.includes('研究项目管理')) throw new Error('not mounted');
    }, { timeout: 3000 });
    expect(document.body.textContent).toContain('项目概览');
    await clickAround(user, [/新建|查看|详情|导出|添加/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

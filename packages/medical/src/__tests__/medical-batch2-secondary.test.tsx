// ============================================================
// YYC³ · @yyc3/medical 批次 2 · 次批四目录深测
// ehr 五客户端导航/筛选 · ai-model-training 三大件（任务创建/评估/
// 部署面板）· research 四大件（多中心标签/实验设计过滤/项目详情/样本）
// · ai-diagnosis 客户端深交互
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('next/dynamic', async () => (await import('./helpers')).nextDynamicModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom } from './helpers';

// ehr
import EHRConnectionsClient from '../ehr/ehr-connections-client';
import EHRSettingsClient from '../ehr/ehr-settings-client';
import EHRMappingClient from '../ehr/ehr-mapping-client';
import EHRSyncClient from '../ehr/ehr-sync-client';
// ai-model-training
import { ModelTrainingJobs } from '../ai-model-training/model-training-jobs';
import { ModelEvaluation } from '../ai-model-training/model-evaluation';
import { ModelDeployment as ModelDeploymentPanel } from '../ai-model-training/model-deployment';
// research
import { MultiCenterCollaboration } from '../research/multi-center-collaboration';
import { ExperimentDesign } from '../research/experiment-design';
import { ProjectDetails } from '../research/project-details';
import { SampleManagement } from '../research/sample-management';
// ai-diagnosis 深交互
import { DiagnosisRecordsClient } from '../ai-diagnosis/diagnosis-records-client';
import { DiagnosisForm } from '../ai-diagnosis/diagnosis-form';
import { DiagnosisHistory } from '../ai-diagnosis/diagnosis-history';
import { DiagnosisStatistics } from '../ai-diagnosis/diagnosis-statistics';
import { DiagnosisReview } from '../ai-diagnosis/diagnosis-review';
import { DiagnosisBatch } from '../ai-diagnosis/diagnosis-batch';

beforeEach(() => {
  stubMedicalDom();
});

/** 通用标签遍历器：点击匹配名称的全部标签 */
async function clickTabs(user: ReturnType<typeof userEvent.setup>, names: string[]) {
  for (const name of names) {
    const tab = screen.queryByRole('tab', { name });
    if (tab) await user.click(tab);
  }
}

describe('ehr 客户端深测', () => {
  it('EHRConnectionsClient 导航标签点击（router.push 桩）', async () => {
    const user = userEvent.setup();
    const { container } = render(<EHRConnectionsClient />);
    await clickTabs(user, ['概览', '数据映射', '同步管理', '连接管理']);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('EHRSettingsClient 重试次数/系统选择配置面', async () => {
    const user = userEvent.setup();
    const { container } = render(<EHRSettingsClient />);
    await clickTabs(user, ['同步管理', '概览']);
    const triggers = screen.queryAllByRole('combobox');
    for (const t of triggers.slice(0, 3)) {
      expect(() => fireEvent.click(t)).not.toThrow();
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('EHRMappingClient 映射页标签', async () => {
    const user = userEvent.setup();
    const { container } = render(<EHRMappingClient />);
    await clickTabs(user, ['数据映射', '概览']);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('EHRSyncClient 同步页 + 系统选择触发器', async () => {
    const user = userEvent.setup();
    const { container } = render(<EHRSyncClient />);
    await clickTabs(user, ['同步管理', '概览']);
    const triggers = screen.queryAllByRole('combobox');
    for (const t of triggers.slice(0, 2)) expect(() => fireEvent.click(t)).not.toThrow();
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('ai-model-training 深测', () => {
  it('ModelTrainingJobs 活动/创建标签切换 + 任务名输入', async () => {
    const user = userEvent.setup();
    const { container } = render(<ModelTrainingJobs />);

    const createTab = screen.queryByRole('tab', { name: /创建新任务/ });
    if (createTab) {
      await user.click(createTab);
      const nameInput = screen.queryByPlaceholderText('输入任务名称');
      if (nameInput) await user.type(nameInput, 'batch2-任务');
      const descInput = screen.queryByPlaceholderText('输入任务描述和备注');
      if (descInput) await user.type(descInput, '批次2评估');
    }
    const activeTab = screen.queryByRole('tab', { name: /活动任务/ });
    if (activeTab) {
      await user.click(activeTab);
      const search = screen.queryByPlaceholderText('搜索任务名称或创建者...');
      if (search) await user.type(search, '肺结节');
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ModelEvaluation 模型/数据集选择触发器驱动', () => {
    const { container } = render(<ModelEvaluation />);
    const triggers = screen.queryAllByRole('combobox');
    for (const t of triggers.slice(0, 3)) expect(() => fireEvent.click(t)).not.toThrow();
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ModelDeploymentPanel 渲染部署面板', () => {
    const { container } = render(<ModelDeploymentPanel />);
    expect(container.firstChild).not.toBeNull();
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('research 深测', () => {
  it('MultiCenterCollaboration 四标签切换（中心/研究/标准/分析）+ 搜索', async () => {
    const user = userEvent.setup();
    const { container } = render(<MultiCenterCollaboration />);
    const search = screen.queryByPlaceholderText('搜索...');
    if (search) await user.type(search, '中心');
    await clickTabs(user, ['多中心研究', '数据标准', '协作分析', '研究中心']);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ExperimentDesign 类型过滤标签 + 搜索', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);
    const search = screen.queryByPlaceholderText('搜索设计标题、ID或研究者...');
    if (search) await user.type(search, '临床');
    await clickTabs(user, ['临床研究', '动物实验', '方法学研究', '已批准', '所有设计']);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ProjectDetails 渲染项目详情', () => {
    const { container } = render(<ProjectDetails />);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('SampleManagement 样本管理交互', async () => {
    const user = userEvent.setup();
    const { container } = render(<SampleManagement />);
    expect(container.textContent.length).toBeGreaterThan(0);
    const tabs = screen.queryAllByRole('tab');
    for (const t of tabs.slice(0, 4)) await user.click(t);
  });
});

describe('ai-diagnosis 深测', () => {
  it('DiagnosisRecordsClient 标签/筛选驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisRecordsClient />);
    const tabs = screen.queryAllByRole('tab');
    for (const t of tabs.slice(0, 5)) await user.click(t);
    const inputs = container.querySelectorAll('input');
    if (inputs[0]) await user.type(inputs[0] as HTMLElement, '肺结节');
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('DiagnosisForm 表单填写与提交', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisForm />);
    const textareas = container.querySelectorAll('textarea');
    if (textareas[0]) await user.type(textareas[0] as HTMLElement, '胸痛三日');
    const inputs = container.querySelectorAll('input:not([type="file"])');
    if (inputs[0]) await user.type(inputs[0] as HTMLElement, '患者陈述');
    const submit = screen
      .getAllByRole('button')
      .find((b) => /提交|诊断|开始|分析/.test(b.textContent ?? ''));
    if (submit) await user.click(submit);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('DiagnosisHistory 历史筛选驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisHistory />);
    const tabs = screen.queryAllByRole('tab');
    for (const t of tabs.slice(0, 3)) await user.click(t);
    const selects = screen.queryAllByRole('combobox');
    for (const s of selects.slice(0, 2)) expect(() => fireEvent.click(s)).not.toThrow();
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('DiagnosisStatistics 统计面渲染', () => {
    const { container } = render(<DiagnosisStatistics />);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('DiagnosisReview 复核标签切换驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisReview />);
    expect(container.textContent.length).toBeGreaterThan(0);
    const tabs = screen.queryAllByRole('tab');
    for (const t of tabs.slice(0, 4)) await user.click(t);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('DiagnosisBatch 批量诊断入口驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisBatch />);
    expect(container.textContent.length).toBeGreaterThan(0);
    const actions = screen
      .getAllByRole('button')
      .filter((b) => /开始|批量|执行|上传/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 3)) await user.click(a);
  });
});

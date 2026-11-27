// ============================================================
// YYC³ · @yyc3/medical 批次 2 · 深交互补刀（体积×缺口最大区）
// teleconsultation 大客户端（专家/记录/排程 700+ 行）
// · ai-model management/overview/deployment-dashboard 标签流
// · clinical-decision pathways 新建对话框/详情 · components 会诊室/EHR 仪表盘
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('next/dynamic', async () => (await import('./helpers')).nextDynamicModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom } from './helpers';

import ExpertsClient from '../teleconsultation/experts-client';
import RecordsClient from '../teleconsultation/records-client';
import ScheduleClient from '../teleconsultation/schedule-client';
import { ModelManagement } from '../ai-model/model-management';
import { ModelOverview } from '../ai-model/model-overview';
import { ModelDeploymentDashboard } from '../ai-model/model-deployment-dashboard';
import { ModelMonitoring } from '../ai-model/model-monitoring';
import { ConsultationRoom } from '../components/consultation-room';
import { EHRDashboard } from '../components/ehr-dashboard';
import { TeleconsultationDashboard } from '../components/teleconsultation-dashboard';
import { UpcomingConsultations } from '../components/upcoming-consultations';
import { ClinicalDashboard } from '../clinical-decision/dashboard';

beforeEach(() => {
  stubMedicalDom();
});

async function clickAllTabs(user: ReturnType<typeof userEvent.setup>) {
  const tabs = screen.queryAllByRole('tab');
  for (const t of tabs) await user.click(t);
}

describe('teleconsultation 大客户端深测', () => {
  it('ExpertsClient 专家/医院标签 + 搜索 + 邀请对话框', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExpertsClient />);

    await clickAllTabs(user);

    // 搜索（专家名/医院名）
    const inputs = container.querySelectorAll('input');
    for (const input of Array.from(inputs).slice(0, 3)) {
      await user.type(input as HTMLElement, '张');
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ExpertsClient 详情对话框入口驱动（hover 态按钮 pointer-events:none——fireEvent 直点）', () => {
    const { container } = render(<ExpertsClient />);
    const details = screen
      .getAllByRole('button')
      .filter((b) => /详情|预约|查看|邀请|联系/.test(b.textContent ?? ''));
    for (const d of details.slice(0, 3)) fireEvent.click(d);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('RecordsClient 全部/有录像标签切换 + 搜索输入', async () => {
    const user = userEvent.setup();
    const { container } = render(<RecordsClient />);
    await clickAllTabs(user);
    const inputs = container.querySelectorAll('input');
    if (inputs[0]) await user.type(inputs[0] as HTMLElement, '会诊');
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ScheduleClient 排程面板渲染与按钮驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<ScheduleClient />);
    expect(container.textContent.length).toBeGreaterThan(0);
    const buttons = screen.queryAllByRole('button');
    for (const b of buttons.slice(0, 6)) {
      if (/新建|预约|排程|取消|查看/.test(b.textContent ?? '')) await user.click(b);
    }
  });
});

describe('ai-model 标签流深测', () => {
  it('ModelManagement 已部署/开发中标签 + 模型监控入口', async () => {
    const user = userEvent.setup();
    const { container } = render(<ModelManagement />);
    await clickAllTabs(user);
    // 模型卡片动作（监控/部署/版本）
    const actions = screen
      .getAllByRole('button')
      .filter((b) => /监控|部署|版本|详情/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 3)) await user.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ModelOverview 诊断/更新标签切换', async () => {
    const user = userEvent.setup();
    const { container } = render(<ModelOverview />);
    await clickAllTabs(user);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ModelDeploymentDashboard 部署仪表盘交互', async () => {
    const user = userEvent.setup();
    const { container } = render(<ModelDeploymentDashboard />);
    expect(container.textContent.length).toBeGreaterThan(0);
    await clickAllTabs(user);
    const actions = screen
      .queryAllByRole('button')
      .filter((b) => /部署|回滚|停止|启动/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 3)) await user.click(a);
  });

  it('ModelMonitoring 告警/规则标签与规则添加对话框', async () => {
    const user = userEvent.setup();
    const model = {
      id: 'm-1',
      name: '监控模型',
      version: 'v1.0',
      alerts: [{ id: 'a-1', type: 'error', message: '错误率上升', severity: 'critical', date: '2026-11-01' }],
    };
    const { container } = render(<ModelMonitoring model={model} onClose={() => {}} />);
    await clickAllTabs(user);
    const addRule = screen
      .queryAllByRole('button')
      .find((b) => /添加规则|新增|添加/.test(b.textContent ?? ''));
    if (addRule) await user.click(addRule);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('components 仪表盘/会诊室深测', () => {
  it('ConsultationRoom 会诊室控件驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<ConsultationRoom />);
    expect(container.textContent.length).toBeGreaterThan(0);
    const controls = screen.queryAllByRole('button');
    for (const c of controls.slice(0, 8)) {
      if (/静音|摄像头|共享|挂断|加入|开始/.test(c.textContent ?? '')) await user.click(c);
    }
  });

  it('EHRDashboard 仪表盘标签/筛选', async () => {
    const user = userEvent.setup();
    const { container } = render(<EHRDashboard />);
    await clickAllTabs(user);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('TeleconsultationDashboard 会诊仪表盘交互', async () => {
    const user = userEvent.setup();
    const { container } = render(<TeleconsultationDashboard />);
    await clickAllTabs(user);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('UpcomingConsultations 列表动作驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<UpcomingConsultations />);
    const actions = screen
      .queryAllByRole('button')
      .filter((b) => /加入|开始|详情|取消/.test(b.textContent ?? ''));
    for (const a of actions.slice(0, 3)) await user.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ClinicalDashboard 临床仪表盘标签流', async () => {
    const user = userEvent.setup();
    const { container } = render(<ClinicalDashboard />);
    await clickAllTabs(user);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

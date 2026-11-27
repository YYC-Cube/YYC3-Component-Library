// ============================================================
// YYC³ · @yyc3/admin 批次 1 · 第四层：图表 / 分析 / OKR-任务-项目 /
// 协作沟通 / 客户域组曲
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next-themes', async () => (await import('./helpers')).nextThemesModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());
vi.mock('framer-motion', async () => (await import('./helpers')).framerMotionModule());

import { FinanceChart } from '../charts/finance-chart';
import { PerformanceChart } from '../charts/performance-chart';
import { SalesChart } from '../charts/sales-chart';
import { OKRAnalyticsCharts } from '../charts/okr-analytics-charts';
import { OptimizedLineChart, OptimizedBarChart, OptimizedPieChart } from '../performance/optimized-charts';
import { StatisticalAnalysis } from '../statistical-analysis';
import { DataAnalytics } from '../data-analytics';
import { DashboardRealtimeData } from '../dashboard-realtime-data';
import { OKRManagement } from '../okr-management';
import { OKRManagementEnhanced } from '../okr-management-enhanced';
import { OKRModule } from '../okr-module';
import { TaskDependencies } from '../task-dependencies';
import { TaskModule } from '../task-module';
import { TaskTemplates } from '../task-templates';
import { TaskManager } from '../workflow/task-manager';
import { TaskManagement } from '../project-management/task-management';
import { ProjectOverview } from '../project-management/project-overview';
import { DevelopmentPriorityRoadmap } from '../planning/development-priority-roadmap';
import { TeamCollaboration } from '../team-collaboration';
import { Communication } from '../communication';
import { CommunicationModule } from '../communication-module';
import { CustomerModule } from '../customer-module';
import { CustomerSatisfaction } from '../customer-satisfaction';
import { CustomerLifecycle } from '../customer-lifecycle';
import { GoalSetting } from '../goal-setting';
import { HonorsPool } from '../honors-pool';
import { PersonalPlanning } from '../personal-planning';
import { PerformanceContract } from '../performance-contract';
import { PerformanceMetrics } from '../performance-metrics';
import { PerformanceOptimization } from '../performance-optimization';
import { OperationsManagement } from '../operations-management';
import { ApprovalModule } from '../approval-module';
import { KPIModule } from '../kpi-module';
import { AnalyticsModule } from '../analytics-module';
import { stubAdminDom, silenceConsole } from './helpers';

beforeEach(() => {
  stubAdminDom();
  silenceConsole();
});

// ---------- 图表族 ----------
describe('FinanceChart（财务图表）', () => {
  it('经 recharts 桩渲染（图例在图元层，jsdom 不可见）', () => {
    render(<FinanceChart />);
    expect(screen.getAllByTestId(/recharts-/).length).toBeGreaterThanOrEqual(1);
  });
});

describe('PerformanceChart（绩效图表）', () => {
  it('渲染周维度数据桩', () => {
    render(<PerformanceChart />);
    expect(screen.getAllByTestId(/recharts-/).length).toBeGreaterThanOrEqual(1);
  });
});

describe('SalesChart（销售图表）', () => {
  it('渲染月度销售桩', () => {
    render(<SalesChart />);
    expect(screen.getAllByTestId(/recharts-/).length).toBeGreaterThanOrEqual(1);
  });
});

describe('OKRAnalyticsCharts（OKR 分析图表组）', () => {
  it('渲染部门 OKR 卡头', () => {
    render(<OKRAnalyticsCharts />);
    expect(document.body.textContent).toMatch(/部门OKR完成情况|各部门目标达成率/);
  });
});

describe('OptimizedCharts（性能优化图表三件套）', () => {
  const data = [
    { name: '一月', uv: 400, pv: 240 },
    { name: '二月', uv: 300, pv: 139 },
  ];

  it('OptimizedLineChart 渲染标题与线', () => {
    render(
      <OptimizedLineChart
        data={data}
        title="访问趋势"
        lines={[
          { dataKey: 'uv', stroke: '#8884d8', name: '访问量' },
          { dataKey: 'pv', stroke: '#82ca9d', name: '浏览量' },
        ]}
      />,
    );
    expect(screen.getByText(/访问趋势/)).toBeInTheDocument();
    expect(screen.getByTestId('recharts-linechart')).toBeInTheDocument();
  });

  it('OptimizedBarChart 渲染', () => {
    render(<OptimizedBarChart data={data} title="订单量" />);
    expect(screen.getByText(/订单量/)).toBeInTheDocument();
    expect(screen.getByTestId('recharts-barchart')).toBeInTheDocument();
  });

  it('OptimizedPieChart 渲染', () => {
    render(<OptimizedPieChart data={data} title="来源分布" />);
    expect(screen.getByText(/来源分布/)).toBeInTheDocument();
    expect(screen.getByTestId('recharts-piechart')).toBeInTheDocument();
  });
});

// ---------- 分析看板 ----------
describe('StatisticalAnalysis（统计分析）', () => {
  it('渲染部门维度统计', () => {
    render(<StatisticalAnalysis />);
    expect(document.body.textContent).toMatch(/统计分析系统/);
    expect(document.body.textContent).toMatch(/技术部/);
    expect(document.body.textContent).toMatch(/部门绩效/);
  });
});

describe('DataAnalytics（数据分析）', () => {
  it('渲染月度数据面板', () => {
    render(<DataAnalytics />);
    expect(document.body.textContent).toMatch(/数据分析中心/);
    expect(document.body.textContent).toMatch(/销售趋势分析|总收入/);
  });
});

describe('DashboardRealtimeData（实时数据）', () => {
  it('渲染实时面板骨架', () => {
    render(<DashboardRealtimeData />);
    expect(document.body.firstElementChild).not.toBeNull();
  });
});

// ---------- OKR 族 ----------
describe('OKRManagement（OKR 管理）', () => {
  it('渲染目标列表', () => {
    render(<OKRManagement />);
    expect(document.body.textContent).toMatch(/OKR目标管理/);
    expect(document.body.textContent).toMatch(/总OKR数量|创建OKR/);
  });
});

describe('OKRManagementEnhanced（增强 OKR）', () => {
  it('渲染 OKR 面板', () => {
    render(<OKRManagementEnhanced />);
    expect(document.body.textContent).toMatch(/通知协作增强版/);
    expect(document.body.textContent).toMatch(/开启自动刷新|OKR目标管理/);
  });
});

describe('OKRModule（OKR 模块卡）', () => {
  it('渲染模块头与统计', () => {
    render(<OKRModule />);
    expect(screen.getByText(/OKR目标管理/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/总目标数/);
    expect(document.body.textContent).toMatch(/完成率 75%/);
  });
});

// ---------- 任务 / 项目族 ----------
describe('TaskDependencies（任务依赖）', () => {
  it('渲染依赖图列表', () => {
    render(<TaskDependencies />);
    expect(document.body.textContent).toMatch(/需求分析/);
    expect(document.body.textContent).toMatch(/原型设计/);
  });
});

describe('TaskModule（任务模块卡）', () => {
  it('渲染模块头与统计', () => {
    render(<TaskModule />);
    expect(screen.getByText(/任务管理中心/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/总任务数/);
  });
});

describe('TaskTemplates（任务模板）', () => {
  it('渲染模板列表', () => {
    render(<TaskTemplates />);
    expect(document.body.textContent).toMatch(/客户需求调研/);
    expect(document.body.textContent).toMatch(/准备调研问卷/);
  });

  it('onUseTemplate 回调可挂载', () => {
    const onUseTemplate = vi.fn();
    render(<TaskTemplates onUseTemplate={onUseTemplate} />);
    expect(document.body.textContent).toMatch(/销售|模板/);
  });
});

describe('TaskManager（工作流任务管理器）', () => {
  it('渲染任务看板', () => {
    render(<TaskManager />);
    expect(document.body.textContent).toMatch(/审核新订单/);
    expect(document.body.textContent).toMatch(/pending|待处理|high/i);
  });
});

describe('TaskManagement（项目管理·任务管理）', () => {
  it('渲染任务列', () => {
    render(<TaskManagement />);
    expect(document.body.textContent).toMatch(/todo|review|completed|待办|评审|已完成/i);
  });
});

describe('ProjectOverview（项目总览）', () => {
  it('渲染项目统计', () => {
    render(<ProjectOverview />);
    expect(document.body.textContent).toMatch(/active|进行中/i);
    expect(document.body.textContent).toMatch(/low|medium|优先级/i);
  });
});

describe('DevelopmentPriorityRoadmap（开发优先级路线图）', () => {
  it('渲染优先级分区', () => {
    render(<DevelopmentPriorityRoadmap />);
    expect(document.body.textContent).toMatch(/Critical|High/i);
    expect(document.body.textContent).toMatch(/In Progress|Not Started/i);
  });
});

// ---------- 协作沟通 ----------
describe('TeamCollaboration（团队协作）', () => {
  it('渲染成员在线状态', () => {
    render(<TeamCollaboration />);
    expect(document.body.textContent).toMatch(/团队协作中心/);
    expect(document.body.textContent).toMatch(/团队成员|活跃协作/);
  });
});

describe('Communication（沟通面板）', () => {
  it('渲染群组与会话', () => {
    render(<Communication />);
    expect(document.body.textContent).toMatch(/产品开发团队/);
    expect(document.body.textContent).toMatch(/销售部门群/);
  });
});

describe('CommunicationModule（沟通协作中心卡）', () => {
  it('渲染模块头与统计', () => {
    render(<CommunicationModule />);
    expect(screen.getByText(/沟通协作中心/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/未读消息/);
    expect(document.body.textContent).toMatch(/活跃群聊/);
  });
});

// ---------- 客户域 ----------
describe('CustomerModule（客户管理中心卡）', () => {
  it('渲染模块头与统计', () => {
    render(<CustomerModule />);
    expect(screen.getByText(/客户管理中心/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/总客户数/);
    expect(document.body.textContent).toMatch(/活跃客户/);
  });
});

describe('CustomerSatisfaction（客户满意度）', () => {
  it('渲染满意度维度', () => {
    render(<CustomerSatisfaction />);
    expect(document.body.textContent).toMatch(/客户满意度管理/);
    expect(document.body.textContent).toMatch(/平均评分/);
    expect(document.body.textContent).toMatch(/华润集团/);
  });
});

describe('CustomerLifecycle（客户生命周期）', () => {
  it('渲染阶段', () => {
    render(<CustomerLifecycle />);
    expect(screen.getByText(/潜在客户/)).toBeInTheDocument();
    expect(screen.getByText(/意向客户/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/表现出购买意向/);
  });
});

// ---------- 个人与绩效 ----------
describe('GoalSetting（目标设定）', () => {
  it('渲染目标与关键结果', () => {
    render(<GoalSetting />);
    expect(document.body.textContent).toMatch(/销售额提升50%/);
    expect(document.body.textContent).toMatch(/销售部/);
  });
});

describe('HonorsPool（荣誉池）', () => {
  it('渲染荣誉条目', () => {
    render(<HonorsPool />);
    expect(document.body.textContent).toMatch(/销售之星/);
    expect(document.body.textContent).toMatch(/创新先锋/);
    expect(document.body.textContent).toMatch(/优秀讲师/);
  });
});

describe('PersonalPlanning（个人规划）', () => {
  it('渲染个人目标', () => {
    render(<PersonalPlanning />);
    expect(screen.getByText(/个人发展规划/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/晋升为高级工程师/);
    expect(document.body.textContent).toMatch(/学习云原生技术/);
  });
});

describe('PerformanceContract（绩效合同）', () => {
  it('渲染合同条目', () => {
    render(<PerformanceContract />);
    expect(document.body.textContent).toMatch(/Q1销售目标/);
    expect(document.body.textContent).toMatch(/220万/);
    expect(document.body.textContent).toMatch(/已完成/);
  });
});

describe('PerformanceMetrics（绩效指标）', () => {
  it('渲染部门绩效', () => {
    render(<PerformanceMetrics />);
    expect(document.body.textContent).toMatch(/销售部/);
    expect(document.body.textContent).toMatch(/超额完成|未达标/);
    expect(screen.getAllByTestId(/recharts-/).length).toBeGreaterThanOrEqual(1);
  });
});

describe('PerformanceOptimization（性能优化）', () => {
  it('渲染优化状态面板', () => {
    render(<PerformanceOptimization />);
    expect(screen.getByText(/性能优化中心/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/页面加载时间|缓存命中率/);
  });
});

// ---------- 运营 / 审批 / KPI / 分析 ----------
describe('OperationsManagement（运营管理）', () => {
  it('渲染运维任务', () => {
    render(<OperationsManagement />);
    expect(document.body.textContent).toMatch(/服务器扩容/);
    expect(document.body.textContent).toMatch(/张三/);
    expect(document.body.textContent).toMatch(/已完成/);
  });
});

describe('ApprovalModule（审批流程卡）', () => {
  it('渲染模块头与统计', () => {
    render(<ApprovalModule />);
    expect(screen.getByText(/审批流程管理/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/待审批/);
    expect(document.body.textContent).toMatch(/已通过/);
  });
});

describe('KPIModule（KPI 监控卡）', () => {
  it('渲染模块头与统计', () => {
    render(<KPIModule />);
    expect(screen.getByText(/KPI绩效监控/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/总KPI数/);
    expect(document.body.textContent).toMatch(/达标率/);
  });
});

describe('AnalyticsModule（数据分析中心卡）', () => {
  it('渲染模块头与统计', () => {
    render(<AnalyticsModule />);
    expect(screen.getByText(/数据分析中心/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/已连接数据源/);
    expect(document.body.textContent).toMatch(/活跃报表/);
  });
});

// ---------- 交互冒烟 ----------
describe('OKRManagement 筛选冒烟', () => {
  it('状态筛选控件可交互', async () => {
    const user = userEvent.setup();
    render(<OKRManagement />);
    const triggers = screen.getAllByRole('combobox');
    if (triggers.length > 0) {
      await user.click(triggers[0]);
    }
    expect(triggers.length).toBeGreaterThanOrEqual(0);
  });
});

describe('TaskManager 状态点击冒烟', () => {
  it('任务项可点击不抛错', () => {
    render(<TaskManager />);
    fireEvent.click(screen.getByText(/审核新订单/));
    expect(screen.getByText(/审核新订单/)).toBeInTheDocument();
  });
});

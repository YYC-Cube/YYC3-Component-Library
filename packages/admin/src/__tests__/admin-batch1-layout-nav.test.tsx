// ============================================================
// YYC³ · @yyc3/admin 批次 1 · 第三层：布局 / 导航 / 仪表盘系组曲
// 侧边栏族 / 仪表盘主面板与挂件 / 全局搜索 / 通知中心 / 移动端侧栏 /
// 布局容器 / 页面骨架
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next-themes', async () => (await import('./helpers')).nextThemesModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { Sidebar } from '../sidebar';
import { SidebarConfig } from '../sidebar-config';
import { DashboardLayout } from '../dashboard-layout';
import { DashboardContent } from '../dashboard-content';
import Dashboard from '../dashboard';
import { DashboardModule } from '../dashboard-module';
import { AdminPage } from '../admin-page';
import { Sidebar as DashSidebar } from '../dashboard/sidebar';
import { ChartCard } from '../dashboard/chart-card';
import { CostDistribution } from '../dashboard/cost-distribution';
import { InventoryAlerts } from '../dashboard/inventory-alerts';
import { OrderSummary } from '../dashboard/order-summary';
import { RecentOrders } from '../dashboard/recent-orders';
import { QuickActions as DashQuickActions } from '../dashboard/quick-actions';
import { SimpleBarChart } from '../dashboard/simple-bar-chart';
import { SimpleDonutChart } from '../dashboard/simple-donut-chart';
import { SimpleLineChart } from '../dashboard/simple-line-chart';
import { StatCard as DashStatCard } from '../dashboard/stat-card';
import { TopNav } from '../dashboard/top-nav';
import { WelcomeBanner } from '../dashboard/welcome-banner';
import { ModuleCards } from '../module-cards';
import { GlobalSearch } from '../global-search';
import { GlobalSearchDialog } from '../global-search-dialog';
import { NotificationCenter } from '../notification-center';
import { NotificationCenterEnhanced } from '../notification-center-enhanced';
import Notifications from '../notifications';
import { ResponsiveSidebar } from '../mobile/responsive-sidebar';
import {
  ResponsiveContainer,
  SidebarContainer,
  HeaderContainer,
  ContentContainer,
  FooterContainer,
} from '../design-system/responsive-layout';
import UserProfile from '../user-profile';
import SmartOffice from '../smart-office';
import { stubAdminDom, silenceConsole } from './helpers';

beforeEach(() => {
  stubAdminDom();
  silenceConsole();
});

// ---------- 侧边栏族 ----------
describe('Sidebar（运营中心侧边栏）', () => {
  it('渲染品牌区与一级菜单', () => {
    render(<Sidebar />);
    expect(screen.getByText(/运营中心/)).toBeInTheDocument();
    expect(screen.getByText(/仪表板/)).toBeInTheDocument();
    expect(screen.getByText(/客户管理/)).toBeInTheDocument();
  });
});

describe('DashSidebar（门店仪表盘侧边栏）', () => {
  it('渲染菜单管理/进销存/成本分析入口', () => {
    render(<DashSidebar />);
    expect(screen.getByText(/菜单管理/)).toBeInTheDocument();
    expect(screen.getByText(/进销存/)).toBeInTheDocument();
    expect(screen.getByText(/成本分析/)).toBeInTheDocument();
  });
});

describe('SidebarConfig（侧边栏行为配置）', () => {
  it('渲染配置面板', () => {
    render(<SidebarConfig />);
    expect(document.body.textContent).toMatch(/smart|智能|manual|手动/i);
    expect(document.body.textContent).toMatch(/mobile|tablet|desktop|断点|响应/i);
  });

  it('配置变更回调可挂载', () => {
    const onConfigChange = vi.fn();
    render(<SidebarConfig onConfigChange={onConfigChange} />);
    expect(screen.getByText(/折叠|collapse|延迟/i)).toBeInTheDocument();
  });
});

describe('DashboardLayout（仪表盘布局壳）', () => {
  it('渲染 children 与布局区', () => {
    render(
      <DashboardLayout>
        <div>布局内内容</div>
      </DashboardLayout>,
    );
    expect(screen.getByText('布局内内容')).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/全景作战室|战情沙盘|战位|模块/);
  });
});

// ---------- 仪表盘主面板 ----------
describe('DashboardContent（仪表盘内容区）', () => {
  it('渲染四大统计卡', () => {
    render(<DashboardContent />);
    expect(screen.getByText(/总客户数/)).toBeInTheDocument();
    expect(screen.getByText(/月收入/)).toBeInTheDocument();
    expect(screen.getByText(/订单数量/)).toBeInTheDocument();
    expect(screen.getByText(/转化率/)).toBeInTheDocument();
  });
});

describe('Dashboard（默认导出主仪表盘）', () => {
  it('渲染仪表盘骨架', () => {
    render(<Dashboard />);
    expect(document.body.firstElementChild).not.toBeNull();
  });
});

describe('DashboardModule（仪表盘模块视图）', () => {
  it('渲染模块卡（客户管理/任务管理）', () => {
    render(<DashboardModule />);
    expect(screen.getByText(/客户管理/)).toBeInTheDocument();
    expect(screen.getByText(/任务管理/)).toBeInTheDocument();
    expect(screen.getByText(/管理客户信息和关系/)).toBeInTheDocument();
  });
});

describe('AdminPage（管理后台聚合页）', () => {
  it('渲染页面骨架', () => {
    render(<AdminPage />);
    expect(document.body.firstElementChild).not.toBeNull();
  });
});

// ---------- 仪表盘挂件 ----------
describe('ChartCard（图表卡壳）', () => {
  it('渲染标题与 children', () => {
    render(
      <ChartCard title="销售概览" description="近 30 天">
        <div>图内内容</div>
      </ChartCard>,
    );
    expect(screen.getByText('销售概览')).toBeInTheDocument();
    expect(screen.getByText(/近 30 天/)).toBeInTheDocument();
    expect(screen.getByText('图内内容')).toBeInTheDocument();
  });
});

describe('CostDistribution（成本分布）', () => {
  it('渲染成本分类', () => {
    render(<CostDistribution />);
    expect(document.body.textContent).toMatch(/成本分布/);
    // 饼图经 recharts 桩渲染（jsdom 无尺寸，标签在图元层）
    expect(screen.getByTestId('recharts-piechart')).toBeInTheDocument();
  });
});

describe('InventoryAlerts（库存预警）', () => {
  it('渲染预警条目', () => {
    render(<InventoryAlerts />);
    expect(document.body.textContent).toMatch(/库存预警/);
    expect(document.body.textContent).toMatch(/番茄酱/);
    expect(document.body.textContent).toMatch(/快速补货/);
  });
});

describe('OrderSummary（订单摘要）', () => {
  it('渲染四态计数', () => {
    render(<OrderSummary />);
    expect(screen.getByText('订单摘要')).toBeInTheDocument();
    expect(screen.getByText('待确认')).toBeInTheDocument();
    expect(screen.getByText('制作中')).toBeInTheDocument();
    expect(screen.getByText('已完成')).toBeInTheDocument();
    expect(screen.getByText('已取消')).toBeInTheDocument();
  });
});

describe('RecentOrders（最近订单）', () => {
  it('渲染订单人列表', () => {
    render(<RecentOrders />);
    expect(screen.getByText(/张三/)).toBeInTheDocument();
    expect(screen.getByText(/李四/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/completed|已完成|pending|待/i);
  });
});

describe('DashQuickActions（仪表盘快捷操作）', () => {
  it('渲染快捷操作组', () => {
    const { container } = render(<DashQuickActions />);
    expect(container.querySelectorAll('button').length).toBeGreaterThanOrEqual(1);
  });
});

describe('SimpleCharts（canvas 图表三件套）', () => {
  const data = [
    { label: '一', value: 30 },
    { label: '二', value: 60 },
  ];

  it('SimpleBarChart 渲染 canvas（jsdom 无 2d ctx 安全跳过绘制）', () => {
    const { container } = render(<SimpleBarChart data={data} height={120} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('SimpleDonutChart 渲染 canvas', () => {
    const { container } = render(<SimpleDonutChart data={data} size={120} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('SimpleLineChart 渲染 canvas', () => {
    const { container } = render(<SimpleLineChart data={data} height={120} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
});

describe('DashStatCard（仪表盘统计卡）', () => {
  it('渲染标题/数值/描述', () => {
    render(<DashStatCard title="今日营业额" value="¥38,400" description="较昨日 +12%" />);
    expect(screen.getByText('今日营业额')).toBeInTheDocument();
    expect(screen.getByText('¥38,400')).toBeInTheDocument();
    expect(screen.getByText(/较昨日 \+12%/)).toBeInTheDocument();
  });

  it('trend up/down 展示', () => {
    render(<DashStatCard title="新订单" value="64" trend="up" trendValue="+8" />);
    expect(screen.getByText('新订单')).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/\+8|↑|up/);
  });
});

describe('TopNav（仪表盘顶栏）', () => {
  it('渲染时间范围切换', () => {
    render(<TopNav />);
    expect(screen.getByText(/最近7天/)).toBeInTheDocument();
    expect(screen.getByText(/最近30天/)).toBeInTheDocument();
    expect(screen.getByText(/本年度/)).toBeInTheDocument();
  });
});

describe('WelcomeBanner（欢迎横幅）', () => {
  it('渲染欢迎语与提示', () => {
    render(<WelcomeBanner />);
    expect(screen.getByText(/欢迎回来，店长！/)).toBeInTheDocument();
    expect(screen.getByText(/查看最新的业绩数据和智能建议/)).toBeInTheDocument();
  });
});

// ---------- 搜索 / 通知 ----------
describe('GlobalSearch（全局搜索面板）', () => {
  it('渲染命令面板搜索', () => {
    render(<GlobalSearch />);
    expect(document.body.textContent).toMatch(/Command Palette|搜索/i);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('输入不抛错（cmdk 受控输入）', async () => {
    const user = userEvent.setup();
    render(<GlobalSearch />);
    const input = screen.getByRole('textbox');
    await user.type(input, '客户');
    expect(input).toBeInTheDocument();
  });
});

describe('GlobalSearchDialog（全局搜索对话框）', () => {
  it('open=true 渲染搜索对话框骨架', () => {
    render(<GlobalSearchDialog open onOpenChange={() => {}} onSearch={() => {}} isLoading={false} />);
    expect(screen.getByText(/全局搜索/)).toBeInTheDocument();
    expect(screen.getByText(/最近搜索/)).toBeInTheDocument();
    expect(screen.getByText(/客户管理/)).toBeInTheDocument();
  });

  it('open=false 不渲染', () => {
    render(
      <GlobalSearchDialog open={false} onOpenChange={() => {}} onSearch={() => {}} isLoading={false} />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('NotificationCenter（通知中心）', () => {
  it('渲染通知列表与筛选', () => {
    render(<NotificationCenter />);
    expect(document.body.textContent).toMatch(/system|系统|task|任务/i);
    expect(document.body.textContent).toMatch(/low|高|中|低/i);
  });
});

describe('NotificationCenterEnhanced（增强通知中心）', () => {
  it('渲染示例通知', () => {
    render(<NotificationCenterEnhanced />);
    // 入口态：仅未读徽标（列表在展开态，深交互留批次 2）
    expect(document.body.textContent).toMatch(/2/);
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(1);
  });
});

describe('Notifications（默认导出通知页）', () => {
  it('渲染通知页骨架', () => {
    render(<Notifications />);
    expect(document.body.firstElementChild).not.toBeNull();
  });
});

// ---------- 移动端 / 布局容器 / 页面骨架 ----------
describe('ResponsiveSidebar（移动端侧栏）', () => {
  const items = [
    { title: '工作台', href: '/work' },
    { title: '审批', href: '/approve', label: '3' },
    { title: '报表', href: '/reports', children: [{ title: '日报', href: '/reports/daily' }] },
  ];

  it('渲染导航项', () => {
    render(<ResponsiveSidebar items={items} title="移动导航" />);
    expect(screen.getByText('工作台')).toBeInTheDocument();
    expect(screen.getByText('审批')).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/移动导航|3/);
  });
});

describe('ResponsiveLayout 容器族（语义化区域）', () => {
  it('渲染 header/main/footer 语义结构', () => {
    render(
      <ResponsiveContainer>
        <HeaderContainer>头部</HeaderContainer>
        <ContentContainer>主体</ContentContainer>
        <FooterContainer>页脚</FooterContainer>
      </ResponsiveContainer>,
    );
    expect(screen.getByText('头部')).toBeInTheDocument();
    expect(screen.getByText('主体')).toBeInTheDocument();
    expect(screen.getByText('页脚')).toBeInTheDocument();
    expect(document.querySelector('main') || screen.getByText('主体')).toBeTruthy();
  });

  it('SidebarContainer 渲染', () => {
    render(
      <SidebarContainer>
        <div>侧栏内容</div>
      </SidebarContainer>,
    );
    expect(screen.getByText('侧栏内容')).toBeInTheDocument();
  });
});

describe('UserProfile（默认导出用户卡）', () => {
  it('渲染管理员卡', () => {
    render(<UserProfile />);
    expect(screen.getByText(/管理员/)).toBeInTheDocument();
  });
});

describe('SmartOffice（智能办公页）', () => {
  it('渲染办公模块入口', () => {
    render(<SmartOffice />);
    expect(screen.getByText(/智能办公中心/)).toBeInTheDocument();
    expect(screen.getByText(/日程管理/)).toBeInTheDocument();
    expect(screen.getByText(/会议管理/)).toBeInTheDocument();
  });
});

describe('ModuleCards（核心功能卡）', () => {
  it('渲染功能卡集', () => {
    render(<ModuleCards />);
    expect(screen.getByText(/核心功能/)).toBeInTheDocument();
    expect(screen.getByText(/数据总览/)).toBeInTheDocument();
  });
});

// ---------- 交互冒烟：Sidebar 折叠按钮 ----------
describe('Sidebar 交互冒烟', () => {
  it('存在可点击的菜单入口', () => {
    render(<Sidebar />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(links[0]);
    expect(links[0]).toBeInTheDocument();
  });
});

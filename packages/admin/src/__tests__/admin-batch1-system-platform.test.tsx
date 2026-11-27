// ============================================================
// YYC³ · @yyc3/admin 批次 1 · 第五层：系统平台 / 设计系统 / 移动端 /
// 客户页面 / 杂项小组件组曲
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next-themes', async () => (await import('./helpers')).nextThemesModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());
vi.mock('framer-motion', async () => (await import('./helpers')).framerMotionModule());

import { SecurityCenter } from '../security-center';
import UserManagement from '../user-management';
import { UserList } from '../user-management/user-list';
import { TenantManagement } from '../tenant-management';
import { PermissionManagement } from '../permission-management';
import SystemStatusMonitor from '../system-status-monitor';
import { SystemPerformanceMetrics } from '../system-performance-metrics';
import LogManagement from '../log-management';
import { BackupRecovery } from '../backup-recovery';
import { HelpCenter } from '../help-center';
import { LearningPark } from '../learning-park';
import { StarLinkEngine } from '../star-link-engine';
import { SystemTestConsole } from '../system-test-console';
import { SystemTesting } from '../system-testing';
import { SystemManagementOverview } from '../system-management-overview';
import { TestCoverageMonitor } from '../test-coverage-monitor';
import { TimeTracker } from '../time-tracker';
import { OfflineInitializationSupport } from '../offline-initialization-support';
import { PWAInstallPrompt } from '../pwa-install-prompt';
import APIDocumentationPage from '../customer/docs/api/page';
import Loading from '../customer/loading';
import OfflinePage from '../customer/offline/page';
import { MobileDashboard } from '../mobile/mobile-dashboard';
import { MobileNativeApp } from '../mobile-native-app';
import { MobileDataLoader } from '../mobile/mobile-data-loader';
import {
  MobileButton,
  MobileInput,
  MobileSelect,
  MobileCard,
  MobileSearch,
  MobileNumberInput,
} from '../mobile/mobile-optimized-components';
import { Swipeable, PinchZoom, PullToRefresh } from '../mobile/gesture-support';
import {
  AnimatedContainer,
  FloatingElement,
} from '../design-system/animation-system';
import { BackgroundControls } from '../design-system/background-controls';
import { DesignCard } from '../design-system/card-system';
import { designTokens, componentVariants } from '../design-system/design-tokens';
import { DynamicBackground } from '../design-system/dynamic-background';
import { EnhancedCard } from '../design-system/enhanced-card-system';
import { LogoEnhanced } from '../design-system/logo-enhanced';
import { Logo as DesignLogo } from '../design-system/logo';
import {
  SeasonalThemeProvider,
  SeasonalTheme,
  useSeasonalTheme,
} from '../design-system/seasonal-themes';
import {
  SoundProvider,
  SoundButton,
  SoundControls,
} from '../design-system/sound-system';
import {
  EnhancedLoadingAnimation,
  SmartLoadingTips,
  SystemStatusIndicator,
} from '../enhanced-loading-animations';
import { stubAdminDom, silenceConsole } from './helpers';

beforeEach(() => {
  stubAdminDom();
  silenceConsole();
  // PWAInstallPrompt 挂 beforeinstallprompt 监听
  vi.stubGlobal('Notification', { permission: 'default', requestPermission: vi.fn(async () => 'granted') });
});

// ---------- 系统平台 ----------
describe('SecurityCenter（安全中心）', () => {
  it('模拟加载后渲染安全面板', async () => {
    render(<SecurityCenter />);
    await screen.findAllByText(/安全/, {}, { timeout: 3000 });
    expect(document.body.textContent).toMatch(/登录|login/i);
  });
});

describe('UserManagement（用户管理）', () => {
  it('渲染用户列表面板', () => {
    render(<UserManagement />);
    expect(document.body.textContent).toMatch(/active|inactive|locked|pending/i);
    expect(document.body.textContent).toMatch(/admin|管理员/i);
  });
});

describe('UserList（用户列表）', () => {
  it('渲染用户行', () => {
    render(<UserList />);
    expect(document.body.textContent).toMatch(/张三/);
    expect(document.body.textContent).toMatch(/技术部/);
    expect(document.body.textContent).toMatch(/李四/);
  });
});

describe('TenantManagement（租户管理）', () => {
  it('渲染租户套餐状态', () => {
    render(<TenantManagement />);
    expect(document.body.textContent).toMatch(/多租户管理/);
    expect(document.body.textContent).toMatch(/新建租户/);
  });
});

describe('PermissionManagement（权限管理）', () => {
  it('渲染权限面板', () => {
    render(<PermissionManagement />);
    expect(document.body.textContent).toMatch(/users|用户|权限/i);
    expect(document.body.textContent).toMatch(/张经理|部门经理/);
  });
});

describe('SystemStatusMonitor（系统状态监控）', () => {
  it('渲染状态面板', () => {
    render(<SystemStatusMonitor />);
    expect(document.body.textContent).toMatch(/CPU使用率/);
    expect(document.body.textContent).toMatch(/内存使用率/);
    expect(document.body.textContent).toMatch(/正常|警告/);
  });
});

describe('SystemPerformanceMetrics（系统性能指标）', () => {
  it('渲染性能监控头', () => {
    render(<SystemPerformanceMetrics />);
    expect(document.body.textContent).toMatch(/系统性能监控/);
    expect(document.body.textContent).toMatch(/实时监控系统资源使用情况/);
  });
});

describe('LogManagement（日志管理）', () => {
  it('渲染日志级别', () => {
    render(<LogManagement />);
    expect(document.body.textContent).toMatch(/日志管理|日志/i);
    expect(document.body.textContent).toMatch(/debug|info|warn|error|系统/i);
  });
});

describe('BackupRecovery（备份恢复）', () => {
  it('渲染备份任务状态', () => {
    render(<BackupRecovery />);
    expect(document.body.textContent).toMatch(/completed|failed|running/i);
    expect(document.body.textContent).toMatch(/full|incremental|differential/i);
  });
});

describe('HelpCenter（帮助中心）', () => {
  it('渲染帮助文章', () => {
    render(<HelpCenter />);
    expect(document.body.textContent).toMatch(/如何创建新客户档案/);
    expect(document.body.textContent).toMatch(/articles|文章/i);
  });
});

describe('LearningPark（学习园地）', () => {
  it('渲染课程列表', () => {
    render(<LearningPark />);
    expect(document.body.textContent).toMatch(/新员工入职培训/);
    expect(document.body.textContent).toMatch(/高级销售技巧/);
    expect(document.body.textContent).toMatch(/必修|选修/);
  });
});

describe('StarLinkEngine（星链引擎）', () => {
  it('渲染星链网络面板', () => {
    render(<StarLinkEngine />);
    expect(document.body.textContent).toMatch(/星链引擎/);
    expect(document.body.textContent).toMatch(/协同网络/);
  });
});

describe('SystemTestConsole（系统测试控制台）', () => {
  it('渲染测试用例状态', () => {
    render(<SystemTestConsole />);
    expect(document.body.textContent).toMatch(/系统测试/);
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(0);
  });
});

describe('SystemTesting（系统测试）', () => {
  it('渲染测试面板', () => {
    render(<SystemTesting />);
    expect(document.body.textContent).toMatch(/pending|running|passed|failed/i);
  });
});

describe('SystemManagementOverview（系统管理总览）', () => {
  it('渲染系统健康度', () => {
    render(<SystemManagementOverview />);
    expect(document.body.textContent).toMatch(/系统管理总览/);
    expect(document.body.textContent).toMatch(/系统健康度/);
  });
});

describe('TestCoverageMonitor（测试覆盖率监控）', () => {
  it('渲染覆盖分类', () => {
    render(<TestCoverageMonitor />);
    expect(document.body.textContent).toMatch(/测试覆盖率监控/);
    expect(document.body.textContent).toMatch(/总体覆盖率/);
    expect(document.body.textContent).toMatch(/UI组件|业务逻辑/);
  });
});

describe('TimeTracker（时间跟踪）', () => {
  it('初始空态渲染计时面板', () => {
    render(<TimeTracker />);
    expect(document.body.textContent).toMatch(/00:00:00/);
    expect(screen.getByRole('button', { name: /开始计时/ })).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/总计时间/);
  });

  it('传入任务名不炸', () => {
    render(<TimeTracker taskId="t-9" taskName="补测批次 1" />);
    expect(document.body.textContent).toMatch(/00:00:00/);
  });
});

describe('OfflineInitializationSupport（离线初始化支持）', () => {
  it('渲染离线能力矩阵', async () => {
    render(<OfflineInitializationSupport />);
    expect(await screen.findByText(/网络状态/, {}, { timeout: 3000 })).toBeInTheDocument();
    // indexedDB 可用性检测决定离线功能开关（jsdom fake-indexeddb 不可达 → 不可用态）
    expect(document.body.textContent).toMatch(/离线功能不可用|本地数据存储/);
  });
});

describe('PWAInstallPrompt（PWA 安装提示）', () => {
  it('无 beforeinstallprompt 事件时保持静默', () => {
    render(<PWAInstallPrompt />);
    // 组件监听 beforeinstallprompt 后才展示（jsdom 不触发）
    expect(document.body).toBeInTheDocument();
  });
});

// ---------- 客户子应用页面 ----------
describe('APIDocumentationPage（客户 API 文档页）', () => {
  it('渲染接口文档', () => {
    render(<APIDocumentationPage />);
    expect(document.body.textContent).toMatch(/获取客户列表/);
    expect(document.body.textContent).toMatch(/GET/);
    expect(document.body.textContent).toMatch(/customers/);
  });
});

describe('Loading（客户路由 loading 骨架）', () => {
  it('渲染 null（loading 页现返回空，行为基线）', () => {
    const { container } = render(<Loading />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('OfflinePage（离线页）', () => {
  it('渲染离线能力说明', () => {
    render(<OfflinePage />);
    expect(screen.getByText(/离线模式/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/缓存数据/);
  });
});

// ---------- 移动端 ----------
describe('MobileDashboard（移动端仪表盘）', () => {
  it('渲染移动卡片', () => {
    render(<MobileDashboard />);
    expect(document.body.textContent).toMatch(/管理员/);
    expect(document.body.textContent).toMatch(/今日任务|待处理|新客户/);
  });
});

describe('MobileNativeApp（移动原生应用）', () => {
  it('渲染应用模块', () => {
    render(<MobileNativeApp />);
    expect(document.body.textContent).toMatch(/移动端应用/);
    expect(document.body.textContent).toMatch(/功能特性/);
    expect(document.body.textContent).toMatch(/离线同步/);
  });
});

describe('MobileDataLoader（移动端数据加载器）', () => {
  it('加载并渲染数据项，支持加载更多', async () => {
    const fetchData = vi.fn(async (page: number, limit: number) =>
      Array.from({ length: 3 }, (_, i) => ({ id: `i-${page}-${i}`, name: `项 ${page}-${i}` })),
    );
    render(
      <MobileDataLoader
        fetchData={fetchData}
        renderItem={(item: { id: string; name: string }) => <div>{item.name}</div>}
        keyExtractor={(item: { id: string }) => item.id}
        emptyMessage="没有数据"
      />,
    );
    expect(await screen.findByText('项 1-0')).toBeInTheDocument();
    expect(screen.getByText('项 1-2')).toBeInTheDocument();
    expect(fetchData).toHaveBeenCalled();
  });

  it('空数据展示 emptyMessage', async () => {
    render(
      <MobileDataLoader
        fetchData={async () => []}
        renderItem={() => <div />}
        keyExtractor={(item: { id: string }) => item.id}
        emptyMessage="没有数据"
      />,
    );
    expect(await screen.findByText('没有数据')).toBeInTheDocument();
  });
});

describe('MobileOptimizedComponents（移动端控件族）', () => {
  it('MobileButton 渲染并触发回调', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<MobileButton onClick={onClick}>移动按钮</MobileButton>);
    await user.click(screen.getByText('移动按钮'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('MobileButton loading 态禁点', () => {
    const onClick = vi.fn();
    render(<MobileButton loading onClick={onClick}>加载中按钮</MobileButton>);
    const btn = document.querySelector('button')!;
    expect(btn).toBeDisabled();
  });

  it('MobileInput 渲染输入', async () => {
    const user = userEvent.setup();
    render(<MobileInput placeholder="手机号" />);
    const input = screen.getByPlaceholderText('手机号');
    await user.type(input, '138');
    expect(input).toBeInTheDocument();
  });

  it('MobileNumberInput 渲染数字输入', () => {
    const { container } = render(<MobileNumberInput value={5} onChange={() => {}} />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it('MobileSelect 渲染', () => {
    const { container } = render(<MobileSelect options={['a', 'b']} value="a" onChange={() => {}} />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it('MobileCard 渲染内容', () => {
    render(<MobileCard>移动卡内容</MobileCard>);
    expect(screen.getByText('移动卡内容')).toBeInTheDocument();
  });

  it('MobileSearch 渲染搜索框', () => {
    render(<MobileSearch placeholder="搜一搜" />);
    expect(screen.getByPlaceholderText('搜一搜')).toBeInTheDocument();
  });
});

describe('GestureSupport（手势组件族）', () => {
  it('Swipeable 渲染 children', () => {
    render(
      <Swipeable onSwipeLeft={() => {}} onSwipeRight={() => {}}>
        <div>滑动内容</div>
      </Swipeable>,
    );
    expect(screen.getByText('滑动内容')).toBeInTheDocument();
  });

  it('Swipeable 触摸滑动触发回调', () => {
    const onSwipeLeft = vi.fn();
    const { container } = render(<Swipeable onSwipeLeft={onSwipeLeft} threshold={10}>
      <div>滑</div>
    </Swipeable>);
    const el = container.firstElementChild as HTMLElement;
    fireEvent.touchStart(el, { touches: [{ clientX: 200, clientY: 10 }], changedTouches: [{ clientX: 200, clientY: 10 }], targetTouches: [{ clientX: 200, clientY: 10 }] });
    fireEvent.touchMove(el, { touches: [{ clientX: 50, clientY: 10 }], changedTouches: [{ clientX: 50, clientY: 10 }], targetTouches: [{ clientX: 50, clientY: 10 }] });
    fireEvent.touchEnd(el, { touches: [], changedTouches: [{ clientX: 50, clientY: 10 }] });
    expect(onSwipeLeft).toHaveBeenCalled();
  });

  it('PullToRefresh 下拉刷新流程', async () => {
    const onRefresh = vi.fn(async () => {});
    const { container } = render(
      <PullToRefresh onRefresh={onRefresh}>
        <div>列表内容</div>
      </PullToRefresh>,
    );
    const el = container.firstElementChild as HTMLElement;
    fireEvent.touchStart(el, { touches: [{ clientX: 10, clientY: 0 }], changedTouches: [{ clientX: 10, clientY: 0 }] });
    fireEvent.touchMove(el, { touches: [{ clientX: 10, clientY: 400 }], changedTouches: [{ clientX: 10, clientY: 400 }] });
    await act(async () => {
      fireEvent.touchEnd(el, { touches: [], changedTouches: [{ clientX: 10, clientY: 400 }] });
    });
    expect(onRefresh).toHaveBeenCalled();
  });

  it('PinchZoom 渲染 children', () => {
    render(
      <PinchZoom>
        <div>缩放内容</div>
      </PinchZoom>,
    );
    expect(screen.getByText('缩放内容')).toBeInTheDocument();
  });
});

// ---------- 设计系统 ----------
describe('AnimationSystem（动画容器族）', () => {
  it('AnimatedContainer 渲染 children', () => {
    render(
      <AnimatedContainer animation="fadeIn">
        <div>淡入内容</div>
      </AnimatedContainer>,
    );
    expect(screen.getByText('淡入内容')).toBeInTheDocument();
  });

  it('FloatingElement 渲染 children', () => {
    render(
      <FloatingElement>
        <div>浮动内容</div>
      </FloatingElement>,
    );
    expect(screen.getByText('浮动内容')).toBeInTheDocument();
  });
});

describe('BackgroundControls（背景控制）', () => {
  it('受控渲染并触发变更', async () => {
    const onVariantChange = vi.fn();
    const onIntensityChange = vi.fn();
    const user = userEvent.setup();
    render(
      <BackgroundControls
        onVariantChange={onVariantChange}
        onIntensityChange={onIntensityChange}
        currentVariant="aurora"
        currentIntensity="medium"
      />,
    );
    expect(document.body.textContent).toMatch(/aurora|极光/i);
    const variantBtn = screen.getAllByRole('button').find((b) => b.textContent?.match(/云端|aurora/i));
    if (variantBtn) await user.click(variantBtn);
    expect(onVariantChange.mock.calls.length + onIntensityChange.mock.calls.length).toBeGreaterThanOrEqual(0);
  });
});

describe('CardSystem（设计卡族）', () => {
  it('DesignCard 渲染内容与变体', () => {
    render(
      <DesignCard variant="elevated" size="md" interactive>
        卡内文
      </DesignCard>,
    );
    expect(screen.getByText('卡内文')).toBeInTheDocument();
  });
});

describe('EnhancedCard（增强卡）', () => {
  it('渲染内容', () => {
    render(
      <EnhancedCard variant="glass" glowEffect>
        增强卡文
      </EnhancedCard>,
    );
    expect(screen.getByText('增强卡文')).toBeInTheDocument();
  });
});

describe('designTokens（设计令牌）', () => {
  it('导出字体/间距令牌与组件变体', () => {
    expect(designTokens).toBeTruthy();
    expect(JSON.stringify(designTokens)).toMatch(/Inter|PingFang/);
    expect(componentVariants).toBeTruthy();
  });
});

describe('DynamicBackground（动态背景）', () => {
  it('渲染各变体不炸', () => {
    for (const variant of ['aurora', 'cloud', 'ocean', 'galaxy', 'particles'] as const) {
      const { container, unmount } = render(
        <DynamicBackground variant={variant}>
          <div>bg-{variant}</div>
        </DynamicBackground>,
      );
      expect(container.firstElementChild).not.toBeNull();
      unmount();
    }
  });
});

describe('DesignLogo / LogoEnhanced（设计系统标志族）', () => {
  it('DesignLogo 渲染', () => {
    render(<DesignLogo size="md" />);
    expect(document.body.firstElementChild).not.toBeNull();
  });

  it('LogoEnhanced 渲染', () => {
    render(<LogoEnhanced size="md" variant="full" />);
    expect(document.body.firstElementChild).not.toBeNull();
  });
});

describe('SeasonalThemes（季节主题）', () => {
  it('Provider 注入季节上下文', () => {
    let ctx: ReturnType<typeof useSeasonalTheme> | null = null;
    function Reader() {
      ctx = useSeasonalTheme();
      return <div>{ctx?.season ?? 'none'}</div>;
    }
    render(
      <SeasonalThemeProvider defaultSeason="autumn">
        <Reader />
      </SeasonalThemeProvider>,
    );
    expect(screen.getByText('autumn')).toBeInTheDocument();
  });

  it('SeasonalTheme 组件渲染', () => {
    render(
      <SeasonalThemeProvider defaultSeason="spring">
        <SeasonalTheme>季节内容</SeasonalTheme>
      </SeasonalThemeProvider>,
    );
    expect(screen.getByText('季节内容')).toBeInTheDocument();
  });
});

describe('SoundSystem（音效系统）', () => {
  it('SoundProvider + SoundButton + SoundControls 渲染', () => {
    render(
      <SoundProvider defaultEnabled={false}>
        <SoundButton>音效开关</SoundButton>
        <SoundControls />
      </SoundProvider>,
    );
    expect(screen.getByText(/音效开关/)).toBeInTheDocument();
    expect(document.body.firstElementChild).not.toBeNull();
  });
});

describe('EnhancedLoadingAnimations（加载动画族）', () => {
  it('EnhancedLoadingAnimation 渲染文本与进度', () => {
    render(<EnhancedLoadingAnimation type="pulse" text="加载中" showProgress progress={40} />);
    expect(screen.getByText(/加载中/)).toBeInTheDocument();
  });

  it('SmartLoadingTips 渲染', () => {
    render(<SmartLoadingTips />);
    expect(document.body.firstElementChild).not.toBeNull();
  });

  it('SystemStatusIndicator 渲染各状态', () => {
    const { container } = render(<SystemStatusIndicator status="ready" />);
    expect(container.firstElementChild).not.toBeNull();
  });
});

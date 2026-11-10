// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// @yyc3/admin 桶文件 — C1 拆包（2026-11-10）
//
// 【本次拆包口径】
// 1. 判据 =「链路完整」：以全量 include 探针编译的零错文件为种子，取其本地依赖闭包
//    （150 件）；闭包外一律判为应用侧，不逐文件改写、不删除，整路径 `git mv` 到
//    apps/admin，相对导入结构原样保留。
// 2. 迁出 128 件 = 126 个应用侧文件（101 件原带 649 个语义错 + 27 件零错但依赖断链）
//    + 2 个跟随被测对象迁移的测试（customer-management / task-management）；
//    header.test.tsx 保留（被测 header.tsx 在组件面）。
// 3. src 现 151 件（150 组件面 + 本入口），tsconfig.include 已恢复为 src/**/*，
//    全量 tsc = 0 错 —— 由「收敛到空入口的空壳绿」变为「组件面真绿」。
// 4. 本入口导出 141 条；6 处同名件改别名消歧：
//    SalesChart / QuickActions / Sidebar / StatCard（dashboard/* 前缀 Dashboard）
//    Logo（design-system/logo 保留，根 logo.tsx 改 BrandLogo）
//    PermissionManagement（根保留，system-settings 版改 SystemPermissionManagement）
//
// 【未导出但保留在 src 的应用侧残留】（链路完整、语义属应用壳，本轮不外发）
// admin-page.tsx、dashboard.tsx、dashboard-layout.tsx、dashboard-content.tsx、
// customer/docs/api/page.tsx、customer/loading.tsx、customer/offline/page.tsx、
// mobile-native-app.tsx、system-initialization-loader.tsx、offline-initialization-support.tsx
//
// 【技术债登记】
// - apps/admin（2026-11-10 已补脚手架）：private 包 @yyc3/app-admin，含 package.json /
//   tsconfig（@/components/ui/* → @yyc3/ui、@/components/* → 先本应用再回退本包、
//   @/* → 本应用 src）/ globals.css；脚本名 type-check:app，暂不并入根门禁。
//   应用侧实测 586 错（脚手架前 655）：41 处缺模块（@yyc3/lib 子路径 5 类 + 应用私有
//   sync-service-manager/authStore/useAuth 等）＋545 处类型错，其中 5 个文件占 46%
//   （real-time-data-processor 85、electronic-signature 74、advanced-charts 45、
//   marketing-planning 38、department-manage 27）。
// - 已从知识库补入权威副本（MD5 逐件一致，源
//   /Volumes/Knowledge/YYC3-Knowledge-Base/YYC3-Knowledge-Base-UI/02-…/yyc3-management-ops-center）：
//   store/{widgetsSlice,hooks,store,dashboardSlice}.ts、contexts/background-context.tsx。
// - 未解：@yyc3/lib 只暴露根入口，responsive-layout / local-database / performance-monitor /
//   auth/permission-types 等子路径不存在 —— 属 lib 真源扩充决策，不在应用侧就地造件。
// - 双导管理 5 份副本指纹同源损坏，无法「恢复权威副本」，只能随应用重建重写。
// - 组件面内 10 个应用壳残留（见上）待第二批判定：迁 apps/admin 或删除。
// - 反方意见：迁出件当前不构建、不测、type-check:app 不进门禁，可见错误从 649 挪到 586；
//   本步价值是让组件面诚实为真 + 应用侧有可运行的类型入口，不代表 admin 应用可用。
// ============================================================

export { AdvancedTimer } from './advanced-timer';
export { AiCustomerData } from './ai-customer-data';
export { AiSmartForms } from './ai-smart-forms';
export { AnalyticsModule } from './analytics-module';
export { ApprovalModule } from './approval-module';
export { AvatarUpload } from './avatar-upload';
export { BackupRecovery } from './backup-recovery';
export { CRMCustomer } from './business/crm-customer';
export { ERPSystem } from './business/erp-system';
export { OrderManagement } from './business/order-management';
export { default as StatCard } from './business/stat-card';
export { SupplyChain } from './business/supply-chain';
export { default as ChannelCenter } from './channel-center';
export { FinanceChart } from './charts/finance-chart';
export { OKRAnalyticsCharts } from './charts/okr-analytics-charts';
export { PerformanceChart } from './charts/performance-chart';
export { SalesChart } from './charts/sales-chart';
export { CommentsSystem } from './collaboration/comments-system';
export { ColorLegend } from './color-legend';
export { CommunicationModule } from './communication-module';
export { Communication } from './communication';
export { CustomerLifecycle } from './customer-lifecycle';
export { CustomerModule } from './customer-module';
export { CustomerSatisfaction } from './customer-satisfaction';
export { DashboardModule } from './dashboard-module';
export { DashboardRealtimeData } from './dashboard-realtime-data';
export { ChartCard } from './dashboard/chart-card';
export { CostDistribution } from './dashboard/cost-distribution';
export { InventoryAlerts } from './dashboard/inventory-alerts';
export { OrderSummary } from './dashboard/order-summary';
export { QuickActions as DashboardQuickActions } from './dashboard/quick-actions';
export { RecentOrders } from './dashboard/recent-orders';
export { SalesChart as DashboardSalesChart } from './dashboard/sales-chart';
export { Sidebar as DashboardSidebar } from './dashboard/sidebar';
export { SimpleBarChart } from './dashboard/simple-bar-chart';
export { SimpleDonutChart } from './dashboard/simple-donut-chart';
export { SimpleLineChart } from './dashboard/simple-line-chart';
export { StatCard as DashboardStatCard } from './dashboard/stat-card';
export { TopNav } from './dashboard/top-nav';
export { WelcomeBanner } from './dashboard/welcome-banner';
export { DataAnalytics } from './data-analytics';
export { DataImportExport } from './data-import-export';
export { default as DataIntegration } from './data-integration';
export { AnimatedContainer, FloatingElement } from './design-system/animation-system';
export { BackgroundControls } from './design-system/background-controls';
export { DesignCard } from './design-system/card-system';
export { designTokens, componentVariants } from './design-system/design-tokens';
export { DynamicBackground } from './design-system/dynamic-background';
export { EnhancedCard } from './design-system/enhanced-card-system';
export { LogoEnhanced } from './design-system/logo-enhanced';
export { Logo } from './design-system/logo';
export { ResponsiveContainer, SidebarContainer, MainContentContainer, HeaderContainer, ContentContainer, LogoContainer, NavigationContainer, FooterContainer, SearchContainer, ActionsContainer } from './design-system/responsive-layout';
export { useSeasonalTheme, SeasonalThemeProvider, SeasonalTheme, useSeasonalStyles } from './design-system/seasonal-themes';
export type { Season } from './design-system/seasonal-themes';
export { useSound, SoundProvider, SoundButton, SoundControls, useSoundFeedback } from './design-system/sound-system';
export { ProfileDialog } from './dialogs/profile-dialog';
export { SettingsDialog } from './dialogs/settings-dialog';
export { EnhancedLoadingAnimation, SmartLoadingTips, SystemStatusIndicator } from './enhanced-loading-animations';
export { ErrorNotificationSystem, errorNotificationManager } from './error-notification-system';
export type { ErrorNotification } from './error-notification-system';
export { FeedbackCollector } from './feedback/feedback-collector';
export { UserSurvey } from './feedback/user-survey';
export { FinanceModule } from './finance-module';
export { GlobalSearchDialog } from './global-search-dialog';
export { GlobalSearch } from './global-search';
export { GoalSetting } from './goal-setting';
export { Header } from './header';
export { HelpCenter } from './help-center';
export { HonorsPool } from './honors-pool';
export { InvoiceManagement } from './invoice-management';
export { KPIModule } from './kpi-module';
export { LearningPark } from './learning-park';
export { apiClient } from './lib/api/api-client';
export { default as LogManagement } from './log-management';
export { LogoManager } from './logo-manager';
export { Logo as BrandLogo } from './logo';
export { Swipeable, PinchZoom, PullToRefresh } from './mobile/gesture-support';
export { MobileDashboard } from './mobile/mobile-dashboard';
export { MobileDataLoader } from './mobile/mobile-data-loader';
export { MobileButton, MobileInput, MobileSelect, MobileCard, MobileSearch, MobileNumberInput } from './mobile/mobile-optimized-components';
export { ResponsiveSidebar } from './mobile/responsive-sidebar';
export { ModuleCards } from './module-cards';
export { NotificationCenterEnhanced } from './notification-center-enhanced';
export { NotificationCenter } from './notification-center';
export { default as Notifications } from './notifications';
export { OfflineIndicator } from './offline-indicator';
export { OKRManagementEnhanced } from './okr-management-enhanced';
export { OKRManagement } from './okr-management';
export { OKRModule } from './okr-module';
export { OperationsManagement } from './operations-management';
export { default as PageIconBar } from './page-icon-bar';
export { default as ParameterSettings } from './parameter-settings';
export { PerformanceContract } from './performance-contract';
export { PerformanceMetrics } from './performance-metrics';
export { PerformanceOptimization } from './performance-optimization';
export { LazyImage } from './performance/lazy-image';
export { OptimizedLineChart, OptimizedBarChart, OptimizedPieChart } from './performance/optimized-charts';
export { VirtualizedList } from './performance/virtualized-list';
export { PermissionManagement } from './permission-management';
export { PersonalPlanning } from './personal-planning';
export { DevelopmentPriorityRoadmap } from './planning/development-priority-roadmap';
export { ProjectOverview } from './project-management/project-overview';
export { TaskManagement } from './project-management/task-management';
export { PWAInstallPrompt } from './pwa-install-prompt';
export { QuickActionsMenu } from './quick-actions-menu';
export { QuickActions } from './quick-actions';
export { default as SecurityCenter } from './security-center';
export { SessionSummary } from './session-summary';
export { SidebarConfig } from './sidebar-config';
export { Sidebar } from './sidebar';
export { default as SmartOffice } from './smart-office';
export { StarLinkEngine } from './star-link-engine';
export { StatisticalAnalysis } from './statistical-analysis';
export { StoreManagement } from './store-management';
export { SystemManagementOverview } from './system-management-overview';
export { default as SystemPerformanceMetrics } from './system-performance-metrics';
export { default as SystemSettings } from './system-settings';
export { AppearanceSettings } from './system-settings/appearance-settings';
export { GeneralSettings } from './system-settings/general-settings';
export { NotificationSettings } from './system-settings/notification-settings';
export { PermissionManagement as SystemPermissionManagement } from './system-settings/permission-management';
export { PrivacySettings } from './system-settings/privacy-settings';
export { SecuritySettings } from './system-settings/security-settings';
export { default as SystemStatusMonitor } from './system-status-monitor';
export { SystemTestConsole } from './system-test-console';
export { SystemTesting } from './system-testing';
export { TaskDependencies } from './task-dependencies';
export { TaskModule } from './task-module';
export { TaskTemplates } from './task-templates';
export { TaxCalculation } from './tax-calculation';
export { TeamCollaboration } from './team-collaboration';
export { TenantManagement } from './tenant-management';
export { TestCoverageMonitor } from './test-coverage-monitor';
export { ThemeProvider } from './theme-provider';
export { ThirdPartyIntegrations } from './third-party-integrations';
export { TimeTracker } from './time-tracker';
export { default as UserManagement } from './user-management';
export { UserList } from './user-management/user-list';
export { default as UserProfile } from './user-profile';
export { UserTraining } from './user-training';
export { TaskManager } from './workflow/task-manager';

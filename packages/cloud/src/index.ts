// ============================================================
// YYC³ · @yyc3/cloud 桶文件（Phase 7 精度抽取·第二批恢复 2026-11-04）
// 来源（D0）：主库 YYC-cloud-platform 权威副本（27 件，五组）
// 断链修复：@/types + @/config/* 本地补建（types.ts/config/*）
// ============================================================

// ── 根组件（云平台主体）──
export { YYCloudVisualization } from './yy-cloud-visualization'
export { YYBreadcrumb } from './yy-breadcrumb'
export { YYNavigation } from './yy-navigation'
export { YYFeatureGrid } from './yy-feature-grid'
export { YYStatsSection } from './yy-stats-section'
export { YYHeroSection } from './yy-hero-section'
export { dashboardConfig } from './yy-sidebar'
export { CloudSyncStatus } from './cloud-sync-status'
export { ServerStats } from './server-stats'
export { StorageUsage } from './storage-usage'
export { Sidebar } from './sidebar'
export { ThemeProvider } from './theme-provider'
export { ClientThemeProvider } from './client-theme-provider'
export { DevelopmentDevices } from './development-devices'

// ── ecommerce ──
export { default as ProductList } from './ecommerce/product-list'
export { default as OrderStats } from './ecommerce/order-stats'
export { default as SalesChart } from './ecommerce/sales-chart'

// ── native ──
export { DeviceFeatures } from './native/device-features'

// ── charts（lib services 桩层解锁恢复）──
export { InteractiveChart } from './charts/interactive-chart'
export { MobileChart } from './charts/mobile-chart'

// ── speech ──
// VoiceControlPanel / EnhancedVoiceControl 摘除登记（消费链含 strict 隐式 any 连锁，
// 待 lib services 真身 + medical 批次修复后恢复）

// ── ai（lib services 桩层解锁恢复）──
export { ModelSelector } from './ai/model-selector'
export { ChatInterface } from './ai/chat-interface'
// ConversationInterface 摘除登记（消费完整 AI 助手服务面，待 lib services 真身批次）

// ── 类型与配置 ──
export type { MainNavItem, SidebarNavItem, DashboardConfig } from './types'
export { chartThemes } from './config/chart-themes'
export type { ChartThemeName } from './config/chart-themes'
export { colors } from './config/colors'

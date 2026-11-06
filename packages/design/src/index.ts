// ============================================================
// YYC³ · @yyc3/design 桶文件（Phase 7 精度抽取·第四批恢复 2026-11-04）
// 来源（D0）：主库设计类项目（UI-9/yyc3-design-system）+ UI-8 Design-System 并入评估
// 摘除件恢复（design 收尾批 2026-11-07）：Header / ProtectedRoute + AuthContext 真身
// —— design 域摘除彻底清零；63 件导出：根 54 + layout/charts/dialogs 子目录 9
// ============================================================

// ── 认证上下文（摘除件收尾批恢复）──
export { AuthProvider, useAuth } from './contexts/AuthContext'
export type { User } from './contexts/AuthContext'
export { Header } from './header'
export { ProtectedRoute } from './ProtectedRoute'

// ── 管理域主件 ──
export { StoreManagement } from './store-management'
export { PerformanceMonitoringDashboard } from './performance-monitoring-dashboard'
export { TaskManagement } from './task-management'
export { GlobalSearch } from './global-search'
export { SecurityCenter } from './security-center'
export { AdvancedBIReports } from './advanced-bi-reports'
export { PlatformIntegration } from './platform-integration'
export { NotificationReminderSystem } from './notification-reminder-system'
export { CustomerLifecycle } from './customer-lifecycle'
export { InternationalizationManager } from './internationalization-manager'
export { SystemStatusMonitor } from './system-status-monitor'
export { PWAManager } from './pwa-manager'
export { PWAInstallPrompt } from './pwa-install-prompt'
export { OAApproval } from './oa-approval'
export { CustomerSatisfaction } from './customer-satisfaction'
export { TaskDependencies } from './task-dependencies'
export { QuickActions } from './quick-actions'
export { OKRManagementEnhanced } from './okr-management-enhanced'
export { DashboardContent } from './dashboard-content'
export { PerformanceOptimization } from './performance-optimization'
export { WeChatMenuSync } from './wechat-menu-sync'
export { CustomerManagementEnhanced } from './customer-management-enhanced'
export { MobileNativeApp } from './mobile-native-app'
export { DashboardRealTimeData } from './dashboard-realtime-data'
export { OKRManagement } from './okr-management'
export { AdvancedBIDashboard } from './advanced-bi-dashboard'
export { UserTraining } from './user-training'
export { CustomerManagement } from './customer-management'
export { DataIntegration } from './data-integration'
export { Communication } from './communication'
export { AdvancedWeChatIntegration } from './advanced-wechat-integration'
export { AiCustomerData } from './ai-customer-data'
export { AdvancedTimer } from './advanced-timer'
export { AiSmartForms } from './ai-smart-forms'
export { NotificationCenterEnhanced } from './notification-center-enhanced'
export { EnhancedMobileExperience } from './enhanced-mobile-experience'
export { SystemTesting } from './system-testing'
export { PermissionManagement } from './permission-management'
export { AvatarUpload } from './avatar-upload'
export { TaskManagementEnhanced } from './task-management-enhanced'
export { SystemPerformanceMetrics } from './system-performance-metrics'
export { TenantManagement } from './tenant-management'
// AIAssistant 摘除件收尾批恢复（ai-service/ai-models 真身已迁入包内 lib/）
export { AIAssistant } from './ai-assistant'
export { aiService, AIService } from './lib/ai-service'
export type { ChatMessage, ChatRequest, ChatResponse } from './lib/ai-service'
export { AI_MODELS, getModelById, getModelsByType, getModelsByProvider } from './lib/ai-models'
export type { AIModel } from './lib/ai-models'
export { TouchGestures } from './touch-gestures'
export { OfflineIndicator } from './offline-indicator'
export { FinanceModule } from './finance-module'
export { TeamCollaboration } from './team-collaboration'
export { Sidebar } from './sidebar'
export { KPITracking } from './kpi-tracking'
export { NotificationCenter } from './notification-center'
export { DataAnalytics } from './data-analytics'
export { RealTimeThreatDetection } from './real-time-threat-detection'
export { ParameterSettings } from './parameter-settings'
export { SystemManagementOverview } from './system-management-overview'
export { ModuleCards } from './module-cards'
export { ThemeProvider } from './theme-provider'

// ── layout ──
export { PageContainer } from './layout/page-container'

// ── charts ──
export { OKRAnalyticsCharts } from './charts/okr-analytics-charts'
export { PerformanceChart } from './charts/performance-chart'
export { SalesChart } from './charts/sales-chart'
export { FinanceChart } from './charts/finance-chart'

// ── dialogs ──
export { ProfileDialog } from './dialogs/profile-dialog'
export { SettingsDialog } from './dialogs/settings-dialog'

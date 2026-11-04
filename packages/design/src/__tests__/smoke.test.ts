// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/design 验收测试
// Phase 7 精度抽取第四批：占位桶 → 61 组件有效导出（摘除 3 件登记）
// ============================================================
import { describe, it, expect, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'

// jsdom 无 ResizeObserver（recharts ResponsiveContainer 依赖）——测试环境 polyfill
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
beforeAll(() => {
  window.ResizeObserver = window.ResizeObserver || (ResizeObserverStub as unknown as typeof ResizeObserver)
})
import * as pkg from '../index'
import { TaskManagementEnhanced, EnhancedCardBase as _Card, KPITracking } from '../index'

describe('@yyc3/design · 精度抽取验收（61 组件恢复导出）', () => {
  it('导出面完整性（管理域 55 + layout/charts/dialogs 6）', () => {
    for (const exp of [
      TaskManagementEnhanced, KPITracking,
      pkg.StoreManagement, pkg.PerformanceMonitoringDashboard, pkg.TaskManagement,
      pkg.GlobalSearch, pkg.SecurityCenter, pkg.AdvancedBIReports,
      pkg.PlatformIntegration, pkg.NotificationReminderSystem, pkg.CustomerLifecycle,
      pkg.InternationalizationManager, pkg.SystemStatusMonitor, pkg.PWAManager,
      pkg.PWAInstallPrompt, pkg.OAApproval, pkg.CustomerSatisfaction,
      pkg.TaskDependencies, pkg.QuickActions, pkg.OKRManagementEnhanced,
      pkg.DashboardContent, pkg.PerformanceOptimization, pkg.WeChatMenuSync,
      pkg.CustomerManagementEnhanced, pkg.MobileNativeApp, pkg.DashboardRealTimeData,
      pkg.OKRManagement, pkg.AdvancedBIDashboard, pkg.UserTraining,
      pkg.CustomerManagement, pkg.DataIntegration, pkg.Communication,
      pkg.AdvancedWeChatIntegration, pkg.AiCustomerData, pkg.AdvancedTimer,
      pkg.AiSmartForms, pkg.NotificationCenterEnhanced, pkg.EnhancedMobileExperience,
      pkg.SystemTesting, pkg.PermissionManagement, pkg.AvatarUpload,
      pkg.SystemPerformanceMetrics, pkg.TenantManagement, pkg.TouchGestures,
      pkg.OfflineIndicator, pkg.FinanceModule, pkg.TeamCollaboration,
      pkg.Sidebar, pkg.NotificationCenter, pkg.DataAnalytics,
      pkg.RealTimeThreatDetection, pkg.ParameterSettings,
      pkg.SystemManagementOverview, pkg.ModuleCards, pkg.ThemeProvider,
      pkg.PageContainer, pkg.OKRAnalyticsCharts, pkg.PerformanceChart,
      pkg.SalesChart, pkg.FinanceChart, pkg.ProfileDialog, pkg.SettingsDialog,
    ]) {
      expect(exp).toBeDefined()
    }
    // 摘除件（lib contexts 批次遗留）确认不在桶
    expect((pkg as Record<string, unknown>).ProtectedRoute).toBeUndefined()
    expect((pkg as Record<string, unknown>).Header).toBeUndefined()
    expect((pkg as Record<string, unknown>).AIAssistant).toBeUndefined()
  })

  it('KPITracking 渲染', () => {
    render(React.createElement(KPITracking))
    expect(document.body.children.length).toBeGreaterThan(0)
  })
})

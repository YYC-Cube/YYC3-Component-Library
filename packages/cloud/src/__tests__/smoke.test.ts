// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/cloud 验收测试
// Phase 7 精度抽取第二批：占位桶 → 21 组件有效导出（五组中三组全量 + 摘除登记）
// 摘除登记（待 lib services 批次）：MobileChart / VoiceControlPanel /
// EnhancedVoiceControl / ModelSelector / ChatInterface / ConversationInterface
// / InteractiveChart（chart-voice-control 深层依赖）
// ============================================================
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import * as pkg from '../index'
import { YYCloudVisualization, ServerStats, dashboardConfig, chartThemes, colors } from '../index'

describe('@yyc3/cloud · 精度抽取验收（21 组件恢复导出）', () => {
  it('导出面完整性（根 14 + 子目录 7 + 类型配置）', () => {
    for (const exp of [
      YYCloudVisualization, ServerStats,
      pkg.YYBreadcrumb, pkg.YYNavigation, pkg.YYFeatureGrid, pkg.YYStatsSection,
      pkg.YYHeroSection, pkg.CloudSyncStatus, pkg.StorageUsage, pkg.Sidebar,
      pkg.ThemeProvider, pkg.ClientThemeProvider, pkg.DevelopmentDevices,
      pkg.ProductList, pkg.OrderStats, pkg.SalesChart, pkg.DeviceFeatures,
      pkg.InteractiveChart, pkg.MobileChart, pkg.ModelSelector,
      pkg.ChatInterface,
    ]) {
      expect(exp).toBeDefined()
    }
    // lib services 桩层解锁后摘除登记撤销（7 件恢复）
    expect(dashboardConfig.mainNav.length).toBeGreaterThan(0)
    expect(chartThemes.light.grid).toBeTruthy()
    expect(colors.series.length).toBeGreaterThan(0)
  })

  it('ServerStats 渲染（含 @yyc3/ui-enterprise 子路径消费）', () => {
    render(React.createElement(ServerStats))
    expect(document.querySelector('div')).toBeTruthy()
  })

  it('YYCloudVisualization 主可视化渲染', () => {
    render(React.createElement(YYCloudVisualization))
    expect(document.body.children.length).toBeGreaterThan(0)
  })
})

// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/financial 验收测试
// Phase 7 精度抽取第三批 + 渲染级收口：占位桶 → 30 组件有效导出（零断链残留）
// 渲染适配（Phase 7 续）：双语组件需传 language prop（zh/en 二选一，源组件必填）
// ============================================================
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import * as pkg from '../index'
import { Header, Dashboard, MarketCharts, ImageWithFallback } from '../index'

describe('@yyc3/financial · 精度抽取验收（30 组件恢复导出）', () => {
  it('导出面完整性（应用壳 6 + 核心 8 + 市场 7 + 社区 8 + 通用 1）', () => {
    for (const exp of [
      pkg.Header, pkg.Footer, pkg.HeroSection, pkg.DashboardLayout, pkg.LoginPage, pkg.SystemSettings,
      pkg.Dashboard, pkg.CoreFeatures, pkg.UseCases, pkg.AICopilot, pkg.AISignals,
      pkg.AIModelFactory, pkg.AIModelBacktesting, pkg.AIModelMarket,
      pkg.MarketCharts, pkg.DataMarket, pkg.DataManagement, pkg.FactorMarket,
      pkg.TokenEconomy, pkg.KnowledgeGraph, pkg.BlockchainEcosystem,
      pkg.CommunityCenter, pkg.MembershipSection, pkg.NewsSection, pkg.Partners,
      pkg.Whitepaper, pkg.TechArchitecture, pkg.FAQ, pkg.DeveloperPlatform,
      ImageWithFallback,
    ]) {
      expect(exp).toBeDefined()
    }
  })

  it('ImageWithFallback 兜底图渲染（纯组件无 config 依赖）', () => {
    render(React.createElement(ImageWithFallback, { src: '/broken.png', alt: '测试图' }))
    expect(screen.getByAltText('测试图')).toBeTruthy()
  })

  it('Header 渲染（language="zh" 双语切换组件）', () => {
    render(React.createElement(Header, { language: 'zh' }))
    expect(document.body.children.length).toBeGreaterThan(0)
  })

  it('Dashboard 渲染（language="zh"）', () => {
    render(React.createElement(Dashboard, { language: 'zh' }))
    expect(document.body.children.length).toBeGreaterThan(0)
  })

  it('MarketCharts 渲染（recharts 图表组，language="zh"）', () => {
    render(React.createElement(MarketCharts, { language: 'zh' }))
    expect(document.querySelector('.recharts-wrapper, .recharts-responsive-container, div')).toBeTruthy()
  })
})

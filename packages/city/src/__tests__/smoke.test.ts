// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/city 验收测试
// Phase 7 精度抽取首批：占位桶 → 17 组件有效导出（断链修复 10 处自愈）
// ============================================================
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import {
  Breadcrumb,
  Logo,
  PageLoader,
  DateTime,
  ModernButton,
  ModernCard,
  ModernCardHeader,
  ModernCardContent,
  ModernCardFooter,
  ModernInput,
  ModernTabs,
  ModernNavigation,
  ModernServiceZones,
  SmartDashboard,
  SmartRecommendations,
  InteractiveCardsPage,
  DataVisualization,
  CityVoiceBroadcast,
  XiaoYuAssistant,
  ThemeProvider,
} from '../index'

describe('@yyc3/city · 精度抽取验收（17 组件恢复导出）', () => {
  it('导出面完整性（17 组件 + Card 四子件）', () => {
    for (const exp of [
      Breadcrumb, Logo, PageLoader, DateTime, ModernButton, ModernCard,
      ModernCardHeader, ModernCardContent, ModernCardFooter, ModernInput,
      ModernTabs, ModernNavigation, ModernServiceZones, SmartDashboard,
      SmartRecommendations, InteractiveCardsPage, DataVisualization,
      CityVoiceBroadcast, XiaoYuAssistant, ThemeProvider,
    ]) {
      expect(exp).toBeDefined()
    }
  })

  it('ModernCard 复合结构渲染（Header 标题/描述/Content/Footer）', () => {
    render(
      React.createElement(
        ModernCard,
        null,
        React.createElement(ModernCardHeader, { title: '城市服务', description: '智慧城市面板', icon: '🏙' }),
        React.createElement(ModernCardContent, null, '正文内容'),
        React.createElement(ModernCardFooter, null, '底部操作'),
      ),
    )
    expect(screen.getByText('城市服务')).toBeTruthy()
    expect(screen.getByText('智慧城市面板')).toBeTruthy()
    expect(screen.getByText('正文内容')).toBeTruthy()
    expect(screen.getByText('底部操作')).toBeTruthy()
  })

  it('ModernButton 渲染与点击', () => {
    let clicked = false
    render(React.createElement(ModernButton, { onClick: () => { clicked = true } }, '立即体验'))
    const btn = screen.getByRole('button', { name: '立即体验' })
    btn.click()
    expect(clicked).toBe(true)
  })

  it('Breadcrumb 路径解耦（pathname props）', () => {
    render(React.createElement(Breadcrumb, { pathname: '/smart-community/services' }))
    expect(screen.getByText('智慧社区')).toBeTruthy()
    expect(screen.getByText('服务项目')).toBeTruthy()
    expect(screen.getByText('首页')).toBeTruthy()
  })

  it('Breadcrumb 根路径渲染 null', () => {
    const { container } = render(React.createElement(Breadcrumb, { pathname: '/' }))
    expect(container.querySelector('nav')).toBeNull()
  })

  it('ModernInput 受控输入', () => {
    render(React.createElement(ModernInput, { placeholder: '搜索城市服务', 'aria-label': '搜索' }))
    expect(screen.getByRole('textbox', { name: '搜索' }).getAttribute('placeholder')).toBe('搜索城市服务')
  })
})

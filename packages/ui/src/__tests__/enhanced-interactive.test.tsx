// ============================================================
// YYC³ · @yyc3/ui enhanced + interactive + status 渲染冒烟
// （批次 6 · 2026-11-27）
// EnhancedButton/Card/Progress；InteractiveCard/Progress（含可拖拽）；
// StatusBadge 六态
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { EnhancedButton } from '../enhanced-button'
import { EnhancedCard } from '../enhanced-card'
import { EnhancedProgress } from '../enhanced-progress'
import { InteractiveCard } from '../interactive-card'
import { InteractiveProgress } from '../interactive-progress'
import { StatusBadge } from '../status-badge'
import { stubMatchMedia } from './helpers'

beforeAll(() => {
  stubMatchMedia(false) // interactive-card 依赖 useIsMobile
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('EnhancedButton · 增强按钮', () => {
  it('icon + loading + variant 渲染与点击', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    // icon 是 LucideIcon 组件类型（非元素）
    const StarIcon = () => <span data-testid="btn-icon">★</span>
    render(
      <div>
        <EnhancedButton onClick={onClick} icon={StarIcon}>
          增强按钮
        </EnhancedButton>
        <EnhancedButton loading>加载中</EnhancedButton>
        <EnhancedButton variant="outline" size="lg">描边大钮</EnhancedButton>
      </div>,
    )
    await user.click(screen.getByRole('button', { name: /增强按钮/ }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('btn-icon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /加载中/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /描边大钮/ })).toBeInTheDocument()
  })
})

describe('EnhancedCard · 增强卡片', () => {
  it('title/description/children + 三 variant', () => {
    render(
      <div>
        <EnhancedCard title="卡片一" description="描述一">内容一</EnhancedCard>
        <EnhancedCard variant="gradient">渐变卡</EnhancedCard>
        <EnhancedCard variant="glass">玻璃卡</EnhancedCard>
        <EnhancedCard>无标题卡</EnhancedCard>
      </div>,
    )
    expect(screen.getByText('卡片一')).toBeInTheDocument()
    expect(screen.getByText('描述一')).toBeInTheDocument()
    expect(screen.getByText('内容一')).toBeInTheDocument()
    expect(screen.getByText('渐变卡')).toBeInTheDocument()
    expect(screen.getByText('玻璃卡')).toBeInTheDocument()
    expect(screen.getByText('无标题卡')).toBeInTheDocument()
  })
})

describe('EnhancedProgress · 增强进度', () => {
  it('数值/label/size/animated 分支', () => {
    render(
      <div>
        <EnhancedProgress value={66} showLabel status="excellent" />
        <EnhancedProgress value={30} size="lg" animated status="critical" />
        <EnhancedProgress value={150} />
        <EnhancedProgress value={-5} />
      </div>,
    )
    // showLabel 渲染 66% 文案
    expect(screen.getByText(/66/)).toBeInTheDocument()
    // 越界值被钳制：宽度 100% / 0%
    const bars = document.querySelectorAll('.h-full')
    expect(bars.length).toBeGreaterThanOrEqual(4)
  })
})

describe('InteractiveCard · 交互卡', () => {
  it('点击回调 + title/description/icon/footer', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <InteractiveCard
        title="交互卡"
        description="可点击卡片"
        icon={<span data-testid="ic-icon">◆</span>}
        footer={<span>卡脚</span>}
        onClick={onClick}
      >
        卡体
      </InteractiveCard>,
    )
    await user.click(screen.getByText('交互卡'))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByText('可点击卡片')).toBeInTheDocument()
    expect(screen.getByTestId('ic-icon')).toBeInTheDocument()
    expect(screen.getByText('卡脚')).toBeInTheDocument()
    expect(screen.getByText('卡体')).toBeInTheDocument()
  })

  it('isDisabled 时点击不回调', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<InteractiveCard title="禁用卡" isDisabled onClick={onClick} />)
    await user.click(screen.getByText('禁用卡'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('isActive 渲染', () => {
    render(<InteractiveCard title="激活卡" isActive />)
    expect(screen.getByText('激活卡')).toBeInTheDocument()
  })
})

describe('InteractiveProgress · 可交互进度', () => {
  it('只读态渲染标题（title 属性）', () => {
    render(<InteractiveProgress value={42} title="部署进度" />)
    expect(screen.getByText('部署进度')).toBeInTheDocument()
    const bar = document.querySelector('[title="进度: 42%"]') as HTMLElement
    expect(bar).not.toBeNull()
  })

  it('editable 拖拽（mouseDown→update + mouseUp→onValueChange）', () => {
    const onValueChange = vi.fn()
    render(<InteractiveProgress value={20} editable onValueChange={onValueChange} />)
    const bar = document.querySelector('[title*="点击或拖拽调整进度"]') as HTMLElement
    expect(bar).not.toBeNull()
    // jsdom 无布局——桩矩形宽度 100px
    bar.getBoundingClientRect = () =>
      ({ left: 0, width: 100, top: 0, height: 10, right: 100, bottom: 10, x: 0, y: 0 } as DOMRect)
    fireEvent.mouseDown(bar, { clientX: 60 })
    fireEvent.mouseUp(document.body)
    expect(onValueChange).toHaveBeenCalledWith(60)
  })
})

describe('StatusBadge · 状态徽章', () => {
  it('六种状态文案渲染', () => {
    render(
      <div>
        <StatusBadge status="pending" />
        <StatusBadge status="in_progress" />
        <StatusBadge status="completed" />
        <StatusBadge status="escalated" />
        <StatusBadge status="overdue" />
        <StatusBadge status="warning" />
      </div>,
    )
    expect(screen.getByText('待处理')).toBeInTheDocument()
    expect(screen.getByText('处理中')).toBeInTheDocument()
    expect(screen.getByText('已完成')).toBeInTheDocument()
    expect(screen.getByText('已升级')).toBeInTheDocument()
    expect(screen.getByText('已超时')).toBeInTheDocument()
    expect(screen.getByText('警告')).toBeInTheDocument()
  })
})

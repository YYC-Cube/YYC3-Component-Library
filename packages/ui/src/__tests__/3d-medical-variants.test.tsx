// ============================================================
// YYC³ · @yyc3/ui 3d + medical 系渲染冒烟（批次 6 · 2026-11-27）
// Button3d（键盘/加载/禁用）、Card3d/MedicalCard/ResponsiveMedicalCard 全家桶、
// MedicalButton 变体
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button3d, button3dVariants } from '../3d-button'
import {
  Card3d,
  Card3dHeader,
  Card3dTitle,
  Card3dDescription,
  Card3dContent,
  Card3dFooter,
} from '../3d-card'
import { MedicalButton } from '../medical-button'
import {
  MedicalCard,
  MedicalCardHeader,
  MedicalCardTitle,
  MedicalCardDescription,
  MedicalCardContent,
  MedicalCardFooter,
} from '../medical-card'
import {
  ResponsiveMedicalCard,
  ResponsiveMedicalCardHeader,
  ResponsiveMedicalCardTitle,
  ResponsiveMedicalCardDescription,
  ResponsiveMedicalCardContent,
  ResponsiveMedicalCardFooter,
} from '../responsive-medical-card'
import { stubMatchMedia, stubPointerCapture } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  stubMatchMedia(false)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Button3d · 立体按钮', () => {
  it('点击回调', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button3d onClick={onClick}>立体按钮</Button3d>)
    await user.click(screen.getByRole('button', { name: '立体按钮' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('isLoading 时禁点（加载态）', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button3d isLoading onClick={onClick}>加载中钮</Button3d>)
    await user.click(screen.getByRole('button', { name: /加载中钮/ }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('键盘 Enter/Space 不抛错（jsdom 不合成原生 click，键盘仅内部按压态）', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button3d onClick={onClick}>键盘钮</Button3d>)
    const btn = screen.getByRole('button', { name: '键盘钮' })
    btn.focus()
    await user.keyboard('{Enter}')
    await user.keyboard('{Space}')
    // handleKeyDown/Up 仅维护按压态——此处断言链路无异常
    expect(btn).toBeInTheDocument()
  })

  it('variant/size/rounded 变体渲染', () => {
    render(
      <div>
        <Button3d variant="primary" size="lg" rounded="full">主按钮</Button3d>
        <Button3d variant="outline" size="sm">描边钮</Button3d>
        <Button3d variant="ghost">幽灵钮</Button3d>
        <Button3d variant="destructive">危险钮</Button3d>
      </div>,
    )
    expect(screen.getByRole('button', { name: '主按钮' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '描边钮' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '幽灵钮' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '危险钮' })).toBeInTheDocument()
    expect(typeof button3dVariants).toBe('function')
  })
})

describe('Card3d · 立体卡片全家桶', () => {
  it('Header/Title/Description/Content/Footer 渲染 + interactive/animation', () => {
    render(
      <Card3d interactive animation="bounce" data-testid="card3d">
        <Card3dHeader>
          <Card3dTitle>立体标题</Card3dTitle>
          <Card3dDescription>立体描述</Card3dDescription>
        </Card3dHeader>
        <Card3dContent>立体内容</Card3dContent>
        <Card3dFooter>立体页脚</Card3dFooter>
      </Card3d>,
    )
    expect(screen.getByText('立体标题')).toBeInTheDocument()
    expect(screen.getByText('立体描述')).toBeInTheDocument()
    expect(screen.getByText('立体内容')).toBeInTheDocument()
    expect(screen.getByText('立体页脚')).toBeInTheDocument()
    expect(screen.getByTestId('card3d')).toBeInTheDocument()
  })

  it('variant 变体（default/glass）', () => {
    render(
      <div>
        <Card3d variant="default">默认卡</Card3d>
        <Card3d variant="glass">玻璃卡</Card3d>
      </div>,
    )
    expect(screen.getByText('默认卡')).toBeInTheDocument()
    expect(screen.getByText('玻璃卡')).toBeInTheDocument()
  })
})

describe('MedicalCard / ResponsiveMedicalCard · 医疗卡', () => {
  it('MedicalCard 全家桶 + variant', () => {
    render(
      <MedicalCard variant="elevated" data-testid="mc">
        <MedicalCardHeader>
          <MedicalCardTitle>患者档案</MedicalCardTitle>
          <MedicalCardDescription>呼吸内科</MedicalCardDescription>
        </MedicalCardHeader>
        <MedicalCardContent>血常规正常</MedicalCardContent>
        <MedicalCardFooter>复查时间：下周</MedicalCardFooter>
      </MedicalCard>,
    )
    expect(screen.getByText('患者档案')).toBeInTheDocument()
    expect(screen.getByText('呼吸内科')).toBeInTheDocument()
    expect(screen.getByText('血常规正常')).toBeInTheDocument()
    expect(screen.getByText('复查时间：下周')).toBeInTheDocument()
  })

  it('ResponsiveMedicalCard 全家桶 + variant', () => {
    render(
      <ResponsiveMedicalCard variant="outline" data-testid="rmc">
        <ResponsiveMedicalCardHeader>
          <ResponsiveMedicalCardTitle>响应式标题</ResponsiveMedicalCardTitle>
          <ResponsiveMedicalCardDescription>响应式描述</ResponsiveMedicalCardDescription>
        </ResponsiveMedicalCardHeader>
        <ResponsiveMedicalCardContent>响应式内容</ResponsiveMedicalCardContent>
        <ResponsiveMedicalCardFooter>响应式页脚</ResponsiveMedicalCardFooter>
      </ResponsiveMedicalCard>,
    )
    expect(screen.getByText('响应式标题')).toBeInTheDocument()
    expect(screen.getByText('响应式描述')).toBeInTheDocument()
    expect(screen.getByText('响应式内容')).toBeInTheDocument()
    expect(screen.getByText('响应式页脚')).toBeInTheDocument()
  })
})

describe('MedicalButton · 医疗按钮', () => {
  it('variant/size 渲染 + 点击', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <div>
        <MedicalButton variant="default" size="default" onClick={onClick}>
          医疗确认
        </MedicalButton>
        <MedicalButton variant="outline" size="sm">描边</MedicalButton>
        <MedicalButton variant="ghost" size="lg">幽灵</MedicalButton>
        <MedicalButton variant="destructive" size="icon">×</MedicalButton>
      </div>,
    )
    await user.click(screen.getByRole('button', { name: '医疗确认' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: '描边' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '幽灵' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument()
  })
})

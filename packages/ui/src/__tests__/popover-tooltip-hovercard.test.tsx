// ============================================================
// YYC³ · @yyc3/ui popover + hover-card + tooltip 渲染冒烟（批次 2 · 2026-11-27）
// 触发式浮层三件套：click/hover 开 → portal 内容 → 关；
// tooltip 箭头/受控 open；popover anchor + align 定制
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from '../popover'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../hover-card'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../tooltip'
import { stubPointerCapture, stubResizeObserver } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  stubResizeObserver()
})

describe('Popover · 点击浮层', () => {
  it('Trigger 点击开 → portal 内容可见 → 再点关', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>点我</PopoverTrigger>
        <PopoverContent>浮层内容</PopoverContent>
      </Popover>,
    )
    await user.click(screen.getByText('点我'))
    expect(await screen.findByText('浮层内容')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await user.click(document.body)
    expect(screen.queryByText('浮层内容')).toBeNull()
  })

  it('PopoverAnchor + 受控 open', async () => {
    const user = userEvent.setup()
    render(
      <Popover open>
        <PopoverAnchor>
          <span>锚点元素</span>
        </PopoverAnchor>
        <PopoverTrigger>触发</PopoverTrigger>
        <PopoverContent align="start">受控内容</PopoverContent>
      </Popover>,
    )
    expect(await screen.findByText('受控内容')).toBeInTheDocument()
    expect(screen.getByText('锚点元素')).toBeInTheDocument()
    void user
  })
})

describe('HoverCard · 悬停浮层', () => {
  it('hover 触发 → 内容渲染 → 移出关闭', async () => {
    const user = userEvent.setup()
    render(
      <HoverCard>
        <HoverCardTrigger>悬停我</HoverCardTrigger>
        <HoverCardContent>卡片内容</HoverCardContent>
      </HoverCard>,
    )
    await user.hover(screen.getByText('悬停我'))
    expect(await screen.findByText('卡片内容')).toBeInTheDocument()
    await user.unhover(screen.getByText('悬停我'))
    await user.click(document.body)
    expect(screen.queryByText('卡片内容')).toBeNull()
  })
})

describe('Tooltip · 提示', () => {
  it('hover 显示提示内容（含箭头）', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>目标</TooltipTrigger>
          <TooltipContent>提示文案</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    await user.hover(screen.getByText('目标'))
    expect(await screen.findByText('提示文案')).toBeInTheDocument()
    await user.unhover(screen.getByText('目标'))
    await user.click(document.body)
    expect(screen.queryByText('提示文案')).toBeNull()
  })

  it('受控 open=true 常显', () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>常显目标</TooltipTrigger>
          <TooltipContent>常显提示</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(screen.getByText('常显提示')).toBeInTheDocument()
  })
})

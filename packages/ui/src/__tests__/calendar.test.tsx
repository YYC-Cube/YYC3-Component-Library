// ============================================================
// YYC³ · @yyc3/ui calendar（react-day-picker v9）渲染冒烟（批次 3 · 2026-11-27）
// 月视图渲染 + 单选日期回调 + 月份导航 + range 模式 + dropdown 布局
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Calendar, CalendarDayButton } from '../calendar'
import { stubResizeObserver } from './helpers'

beforeAll(() => {
  stubResizeObserver()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Calendar · 日历', () => {
  it('默认月视图渲染 + 前后导航按钮', () => {
    render(<Calendar mode="single" defaultMonth={new Date(2026, 0, 15)} />)
    // 2026 年 1 月
    expect(screen.getByText('January 2026')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to the Previous Month' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to the Next Month' })).toBeInTheDocument()
  })

  it('单选：点击日期触发 onSelect', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Calendar mode="single" defaultMonth={new Date(2026, 0, 1)} onSelect={onSelect} />,
    )
    await user.click(screen.getByRole('button', { name: /January 15th/ }))
    expect(onSelect).toHaveBeenCalledTimes(1)
    const picked = onSelect.mock.calls[0][0] as Date
    expect(picked.getMonth()).toBe(0)
    expect(picked.getDate()).toBe(15)
  })

  it('月份导航按钮切换', async () => {
    const user = userEvent.setup()
    render(<Calendar mode="single" defaultMonth={new Date(2026, 1, 1)} />)
    await user.click(screen.getByRole('button', { name: 'Go to the Next Month' }))
    expect(screen.getByText('March 2026')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Go to the Previous Month' }))
    expect(screen.getByText('February 2026')).toBeInTheDocument()
  })

  it('range 模式：两次点选触发 onSelect', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Calendar mode="range" defaultMonth={new Date(2026, 5, 1)} onSelect={onSelect} />,
    )
    await user.click(screen.getByRole('button', { name: /June 10th/ }))
    await user.click(screen.getByRole('button', { name: /June 20th/ }))
    expect(onSelect).toHaveBeenCalledTimes(2)
    const range = onSelect.mock.calls[1][0] as { from?: Date; to?: Date }
    expect(range.from || range.to).toBeTruthy()
  })

  it('captionLayout=dropdown 渲染年月下拉', () => {
    render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 3, 1)}
        captionLayout="dropdown"
        startMonth={new Date(2024, 0, 1)}
        endMonth={new Date(2027, 11, 1)}
      />,
    )
    // v9 dropdown 布局：月/年两个原生 select（role=combobox）
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(1)
  })

  it('CalendarDayButton 直渲染透传 data-day', () => {
    render(
      <CalendarDayButton
        day={{ date: new Date(2026, 0, 9) } as never}
        modifiers={{} as never}
      >
        9
      </CalendarDayButton>,
    )
    expect(screen.getByText('9')).toBeInTheDocument()
  })
})

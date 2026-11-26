// ============================================================
// YYC³ · @yyc3/ui input-otp + date-picker 渲染冒烟（批次 4 · 2026-11-27）
// OTP 输入/槽位/分隔符；DatePicker 弹层选值 + DateRangePicker 双触发器
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '../input-otp'
import { DatePicker, DateRangePicker } from '../date-picker'
import { stubPointerCapture, stubResizeObserver } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  stubResizeObserver()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('InputOTP · 验证码输入', () => {
  function OtpDemo({ onChange }: { onChange?: (v: string) => void }) {
    return (
      <InputOTP maxLength={6} onChange={onChange}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    )
  }

  it('渲染 6 个槽位 + 分隔符', () => {
    render(<OtpDemo />)
    const slots = document.querySelectorAll('[data-slot="input-otp-slot"]')
    expect(slots).toHaveLength(6)
    expect(document.querySelector('[data-slot="input-otp-separator"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="input-otp"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="input-otp-group"]')).toBeInTheDocument()
  })

  it('输入数字填充槽位并回调', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OtpDemo onChange={onChange} />)
    await user.click(screen.getByRole('textbox'))
    await user.keyboard('123456')
    const slots = document.querySelectorAll('[data-slot="input-otp-slot"]')
    expect(slots[0].textContent).toContain('1')
    expect(slots[5].textContent).toContain('6')
    expect(onChange).toHaveBeenCalledWith('123456')
  })

  it('maxLength 限制输入长度', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OtpDemo onChange={onChange} />)
    await user.click(screen.getByRole('textbox'))
    await user.keyboard('1234567890')
    const lastCall = onChange.mock.calls.at(-1)?.[0] as string
    expect(lastCall.length).toBeLessThanOrEqual(6)
  })
})

describe('DatePicker · 日期选择', () => {
  it('未选值时显示 placeholder，点击打开日历弹层', async () => {
    const user = userEvent.setup()
    render(<DatePicker />)
    expect(screen.getByText('选择日期')).toBeInTheDocument()
    await user.click(screen.getByRole('button'))
    expect(await screen.findByRole('grid')).toBeInTheDocument()
  })

  it('选中值显示格式化日期', () => {
    render(<DatePicker value={new Date(2026, 10, 27)} />)
    expect(screen.getByText('2026-11-27')).toBeInTheDocument()
  })

  it('弹层内点选日期触发 onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker onChange={onChange} />)
    await user.click(screen.getByRole('button'))
    const grid = await screen.findByRole('grid')
    const dayButton = Array.from(grid.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === '15',
    ) as HTMLElement
    await user.click(dayButton)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('DateRangePicker 渲染两个触发器', () => {
    render(
      <DateRangePicker
        startDate={new Date(2026, 0, 1)}
        endDate={new Date(2026, 0, 31)}
      />,
    )
    expect(screen.getByText('2026-01-01')).toBeInTheDocument()
    expect(screen.getByText('2026-01-31')).toBeInTheDocument()
  })
})

// ============================================================
// YYC³ · @yyc3/ui 表单控件渲染冒烟（批次 4 · 2026-11-27）
// checkbox/radio-group/switch/slider/toggle/toggle-group 开关与选中态
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Checkbox } from '../checkbox'
import { RadioGroup, RadioGroupItem } from '../radio-group'
import { Switch } from '../switch'
import { Slider } from '../slider'
import { Toggle } from '../toggle'
import { ToggleGroup, ToggleGroupItem } from '../toggle-group'
import { stubPointerCapture, stubResizeObserver, stubElementFromPoint } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  stubResizeObserver() // Radix Slider 定位依赖
  stubElementFromPoint() // jsdom 未实现 hit-testing
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Checkbox', () => {
  it('点击切换 checked 状态', async () => {
    const user = userEvent.setup()
    const onChecked = vi.fn()
    render(<Checkbox aria-label="同意" onCheckedChange={onChecked} />)
    const box = screen.getByRole('checkbox', { name: '同意' })
    await user.click(box)
    expect(onChecked).toHaveBeenCalledWith(true)
    expect(box).toHaveAttribute('data-state', 'checked')
    await user.click(box)
    expect(onChecked).toHaveBeenLastCalledWith(false)
  })

  it('defaultChecked + disabled 渲染', () => {
    render(<Checkbox defaultChecked disabled aria-label="禁用勾选" />)
    const box = screen.getByRole('checkbox', { name: '禁用勾选' })
    expect(box).toHaveAttribute('data-state', 'checked')
    expect(box).toBeDisabled()
  })
})

describe('RadioGroup', () => {
  it('选择单选项', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <RadioGroup defaultValue="a" onValueChange={onValueChange}>
        <RadioGroupItem value="a" aria-label="选项A" />
        <RadioGroupItem value="b" aria-label="选项B" />
      </RadioGroup>,
    )
    const a = screen.getByRole('radio', { name: '选项A' })
    expect(a).toBeChecked()
    await user.click(screen.getByRole('radio', { name: '选项B' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
    expect(screen.getByRole('radio', { name: '选项B' })).toBeChecked()
  })
})

describe('Switch', () => {
  it('点击切换 + 受控回调', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="飞行模式" onCheckedChange={onCheckedChange} />)
    const sw = screen.getByRole('switch', { name: '飞行模式' })
    expect(sw).toHaveAttribute('data-state', 'unchecked')
    await user.click(sw)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(sw).toHaveAttribute('data-state', 'checked')
  })

  it('defaultChecked 初始为开', () => {
    render(<Switch defaultChecked aria-label="默认开" />)
    expect(screen.getByRole('switch', { name: '默认开' })).toHaveAttribute(
      'data-state',
      'checked',
    )
  })
})

describe('Slider', () => {
  const thumbs = () =>
    Array.from(document.querySelectorAll('[data-slot="slider"] [role="slider"]')) as HTMLElement[]

  it('受控值渲染滑块（单个值）', () => {
    render(<Slider defaultValue={[42]} aria-label="音量" />)
    const sliders = thumbs()
    expect(sliders).toHaveLength(1)
    expect(sliders[0]).toHaveAttribute('aria-valuemax', '100')
    expect(sliders[0]).toHaveAttribute('aria-valuemin', '0')
    expect(sliders[0]).toHaveAttribute('aria-valuenow', '42')
  })

  it('范围值渲染双滑块 + min/max 覆盖', () => {
    render(
      <div>
        <Slider defaultValue={[20, 80]} min={10} max={90} aria-label="区间" />
      </div>,
    )
    const sliders = thumbs()
    expect(sliders).toHaveLength(2)
    expect(sliders[0]).toHaveAttribute('aria-valuemin', '10')
    expect(sliders[1]).toHaveAttribute('aria-valuemax', '90')
  })

  it('受控 value 数组', () => {
    render(<Slider value={[55]} aria-label="受控滑块" />)
    expect(thumbs()[0]).toHaveAttribute('aria-valuenow', '55')
  })
})

describe('Toggle', () => {
  it('pressed 受控切换', async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    render(<Toggle aria-label="加粗" onPressedChange={onPressedChange} />)
    const t = screen.getByRole('button', { name: '加粗' })
    expect(t).toHaveAttribute('data-state', 'off')
    await user.click(t)
    expect(onPressedChange).toHaveBeenCalledWith(true)
  })

  it('defaultPressed 初始按下', () => {
    render(<Toggle defaultPressed aria-label="斜体">I</Toggle>)
    expect(screen.getByRole('button', { name: '斜体' })).toHaveAttribute(
      'data-state',
      'on',
    )
  })

  it('variant/size 变体渲染', () => {
    render(<Toggle variant="outline" size="lg" aria-label="大按钮">L</Toggle>)
    expect(screen.getByRole('button', { name: '大按钮' })).toBeInTheDocument()
  })
})

describe('ToggleGroup', () => {
  it('single 模式：互斥选中', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="single" defaultValue="left" onValueChange={onValueChange}>
        <ToggleGroupItem value="left" aria-label="左对齐">左</ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="居中">中</ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="右对齐">右</ToggleGroupItem>
      </ToggleGroup>,
    )
    // type=single 时 Radix 渲染 role=radiogroup/radio
    const left = screen.getByRole('radio', { name: '左对齐' })
    expect(left).toHaveAttribute('data-state', 'on')
    await user.click(screen.getByRole('radio', { name: '居中' }))
    expect(onValueChange).toHaveBeenCalledWith('center')
    expect(screen.getByRole('radio', { name: '居中' })).toHaveAttribute('data-state', 'on')
    expect(left).toHaveAttribute('data-state', 'off')
  })

  it('multiple 模式：多选', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="multiple" onValueChange={onValueChange}>
        <ToggleGroupItem value="bold" aria-label="粗体">B</ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="斜体">I</ToggleGroupItem>
      </ToggleGroup>,
    )
    await user.click(screen.getByRole('button', { name: '粗体' }))
    await user.click(screen.getByRole('button', { name: '斜体' }))
    expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'italic'])
    expect(screen.getByRole('button', { name: '斜体' })).toHaveAttribute('data-state', 'on')
  })

  it('variant/size 经 context 下发', () => {
    render(
      <ToggleGroup type="single" variant="outline" size="sm">
        <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
      </ToggleGroup>,
    )
    const item = screen.getByRole('radio', { name: 'A' })
    expect(item).toHaveAttribute('data-variant', 'outline')
    expect(item).toHaveAttribute('data-size', 'sm')
  })
})

// ============================================================
// YYC³ · @yyc3/ui select + carousel 渲染冒烟（批次 3 · 2026-11-27）
// select 开合/选值回调/分组标签/分隔线/滚动按钮；
// carousel 前后翻页按钮 + 键盘方向键 + useCarousel 守卫
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from '../select'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../carousel'
import { stubPointerCapture, stubResizeObserver, stubMatchMedia, stubIntersectionObserver } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  stubResizeObserver()
  stubMatchMedia(false) // embla optionsMediaQueries 需要 matchMedia
  stubIntersectionObserver() // embla watchIntersection 需要
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Select · 下拉选择', () => {
  it('开合 + SelectItem 选择回调 onValueChange + 附属件', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="选择框架" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>前端</SelectLabel>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue" disabled>Vue</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectItem value="svelte">Svelte</SelectItem>
        </SelectContent>
      </Select>,
    )
    const trigger = screen.getByRole('combobox')
    await user.click(trigger)
    expect(await screen.findByText('React')).toBeInTheDocument()
    expect(screen.getByText('前端')).toBeInTheDocument()
    await user.click(screen.getByText('React'))
    expect(onValueChange).toHaveBeenCalledWith('react')
    expect(await screen.findByText('React')).toBeInTheDocument()
  })

  it('ScrollUp/ScrollDown 按钮组件可渲染', async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="选" />
        </SelectTrigger>
        <SelectContent>
          <SelectScrollUpButton>上</SelectScrollUpButton>
          <SelectScrollDownButton>下</SelectScrollDownButton>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    await user.click(screen.getByRole('combobox'))
    expect(await screen.findByText('A')).toBeInTheDocument()
  })
})

describe('Carousel · 轮播', () => {
  function Demo() {
    return (
      <Carousel>
        <CarouselContent>
          <CarouselItem>第一页</CarouselItem>
          <CarouselItem>第二页</CarouselItem>
          <CarouselItem>第三页</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
  }

  it('渲染三页 + 前后按钮', () => {
    render(<Demo />)
    expect(screen.getByText('第一页')).toBeInTheDocument()
    expect(screen.getByText('第二页')).toBeInTheDocument()
    expect(screen.getByText('第三页')).toBeInTheDocument()
    // 组件内置 sr-only 文案（children 不可覆盖）
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument()
  })

  it('键盘 ArrowLeft/Right 触发翻页（不抛错）', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    const container = document.querySelector('[data-slot="carousel"]') as HTMLElement
    await user.type(container, '{ArrowLeft}')
    await user.type(container, '{ArrowRight}')
    expect(screen.getByText('第一页')).toBeInTheDocument()
  })

  it('useCarousel 脱离 Carousel 抛错', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<CarouselPrevious />)).toThrow(
      /useCarousel must be used within/,
    )
    spy.mockRestore()
  })

  it('opts.axis=y 未传 orientation → 纵向分支可达（batch2 缺陷已修复：flex-col/-mt-4/pt-4/rotate-90）', () => {
    render(
      <Carousel opts={{ axis: 'y' }}>
        <CarouselContent>
          <CarouselItem>纵一</CarouselItem>
          <CarouselItem>纵二</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    )
    // CarouselContent 内层 flex 容器走纵向分支
    const outer = document.querySelector('[data-slot="carousel-content"]') as HTMLElement
    const flexInner = outer.firstElementChild as HTMLElement
    expect(flexInner.className).toContain('flex-col')
    expect(flexInner.className).toContain('-mt-4')
    expect(flexInner.className).not.toContain('-ml-4')
    // CarouselItem 走纵向分支
    const item = screen.getByText('纵一').closest('[data-slot="carousel-item"]') as HTMLElement
    expect(item.className).toContain('pt-4')
    expect(item.className).not.toContain('pl-4')
    // 前后钮走纵向定位（rotate-90）
    const prev = screen.getByRole('button', { name: 'Previous slide' })
    expect(prev.className).toContain('rotate-90')
    expect(prev.className).toContain('-top-12')
  })

  it('显式 orientation=vertical 仍优先生效（推断不抢显式传入）', () => {
    render(
      <Carousel orientation="vertical">
        <CarouselContent>
          <CarouselItem>显式纵一</CarouselItem>
        </CarouselContent>
      </Carousel>,
    )
    const outer = document.querySelector('[data-slot="carousel-content"]') as HTMLElement
    const flexInner = outer.firstElementChild as HTMLElement
    expect(flexInner.className).toContain('flex-col')
  })
})

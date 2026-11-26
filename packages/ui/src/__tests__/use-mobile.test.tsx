// ============================================================
// YYC³ · @yyc3/ui use-mobile 渲染冒烟（批次 1 · 2026-11-27）
// matchMedia 桩 + innerWidth 双值（桌面/移动）验证断点判定
// ============================================================
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'

import { useIsMobile } from '../use-mobile'

let listeners: Array<() => void>

function stubMatchMedia() {
  listeners = []
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (_: string, cb: () => void) => listeners.push(cb),
      removeEventListener: (_: string, cb: () => void) => {
        const i = listeners.indexOf(cb)
        if (i > -1) listeners.splice(i, 1)
      },
      dispatchEvent: vi.fn(),
    })),
  })
}

function setInnerWidth(px: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, value: px })
}

beforeEach(() => {
  stubMatchMedia()
})

afterEach(() => {
  setInnerWidth(1024)
})

function Probe() {
  const isMobile = useIsMobile()
  return <span>{isMobile ? 'mobile' : 'desktop'}</span>
}

describe('useIsMobile · 断点判定', () => {
  it('初始 undefined → false（desktop）', () => {
    render(<Probe />)
    expect(screen.getByText('desktop')).toBeInTheDocument()
  })

  it('innerWidth=375 → effect 后判定 mobile', async () => {
    setInnerWidth(375)
    render(<Probe />)
    await act(async () => {})
    expect(screen.getByText('mobile')).toBeInTheDocument()
  })

  it('innerWidth=1024 → effect 后判定 desktop', async () => {
    render(<Probe />)
    await act(async () => {})
    expect(screen.getByText('desktop')).toBeInTheDocument()
  })

  it('matchMedia change 事件触发重判（375→1024）', async () => {
    setInnerWidth(375)
    render(<Probe />)
    await act(async () => {})
    expect(screen.getByText('mobile')).toBeInTheDocument()
    await act(async () => {
      setInnerWidth(1024)
      listeners.forEach((cb) => cb())
    })
    expect(screen.getByText('desktop')).toBeInTheDocument()
  })
})

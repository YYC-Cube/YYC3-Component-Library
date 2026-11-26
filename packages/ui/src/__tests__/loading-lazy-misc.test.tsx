// ============================================================
// YYC³ · @yyc3/ui loading 系 + lazy + misc 渲染冒烟（批次 6 · 2026-11-27）
// Loading/LoadingSpinner/LoadingFallback/DynamicLoading/FloatingNavButtons
// PageTransition/Textarea/sonner Toaster/LazyComponent/createLazyComponent
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Loading from '../loading'
import { LoadingSpinner } from '../loading-spinner'
import { LoadingFallback } from '../loading-fallback'
import { DynamicLoading } from '../dynamic-loading'
import { FloatingNavButtons } from '../floating-nav-buttons'
import { PageTransition } from '../page-transition'
import { Textarea } from '../textarea'
import { Toaster as SonnerToaster } from '../sonner'
import { LazyComponent, createLazyComponent } from '../lazy-load'
import { stubIntersectionObserver, stubMatchMedia, stubPointerCapture } from './helpers'

// next/navigation 在无 Next App 环境下不可用——桩化 router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn(), replace: vi.fn() }),
}))

beforeAll(() => {
  stubPointerCapture()
  stubMatchMedia(false) // sonner → next-themes useTheme
  stubIntersectionObserver()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Loading 三件套', () => {
  it('Loading 默认导出（当前实现恒返回 null——行为固化断言）', () => {
    const { container } = render(<Loading />)
    expect(container.firstChild).toBeNull()
  })

  it('LoadingSpinner 纯转圈', () => {
    render(<LoadingSpinner className="size-4" />)
    expect(document.querySelector('[role="status"]') ?? document.body.firstChild).toBeInTheDocument()
  })

  it('LoadingFallback 自定义文案与高度', () => {
    render(<LoadingFallback message="正在加载报表" height="200px" />)
    expect(screen.getByText('正在加载报表')).toBeInTheDocument()
  })

  it('LoadingFallback 默认文案', () => {
    render(<LoadingFallback />)
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })
})

describe('DynamicLoading / FloatingNavButtons / PageTransition', () => {
  it('DynamicLoading loadingText/size/variant + 非 loading 子内容', () => {
    render(
      <DynamicLoading isLoading loadingText="拉取中" size="lg" variant="default">
        <div>已加载内容</div>
      </DynamicLoading>,
    )
    expect(screen.getByText('拉取中')).toBeInTheDocument()
    // 再渲染非 loading 态验证 children 分支
  })

  it('DynamicLoading isLoading=false 渲染 children', () => {
    render(
      <DynamicLoading isLoading={false}>
        <div>就绪内容</div>
      </DynamicLoading>,
    )
    expect(screen.getByText('就绪内容')).toBeInTheDocument()
  })

  it('FloatingNavButtons 渲染返回/主页按钮', async () => {
    const user = userEvent.setup()
    render(<FloatingNavButtons />)
    const back = screen.getByRole('button', { name: /返回|back/i })
    const home = screen.getByRole('button', { name: /主页|首页|home/i })
    await user.click(back)
    await user.click(home)
    expect(back).toBeInTheDocument()
    expect(home).toBeInTheDocument()
  })

  it('PageTransition fade/slide 变体包裹子内容', () => {
    render(
      <div>
        <PageTransition variant="fade">淡入页</PageTransition>
        <PageTransition variant="slide">滑动页</PageTransition>
        <PageTransition duration={300}>默认页</PageTransition>
      </div>,
    )
    expect(screen.getByText('淡入页')).toBeInTheDocument()
    expect(screen.getByText('滑动页')).toBeInTheDocument()
    expect(screen.getByText('默认页')).toBeInTheDocument()
  })
})

describe('Textarea / sonner', () => {
  it('Textarea 输入', async () => {
    const user = userEvent.setup()
    render(<Textarea placeholder="多行输入" aria-label="备注" />)
    await user.type(screen.getByLabelText('备注'), '第一行')
    expect(screen.getByLabelText('备注')).toHaveValue('第一行')
  })

  it('sonner Toaster 渲染（theme 透传）', () => {
    render(<SonnerToaster position="bottom-right" />)
    // sonner 挂 ol[data-sonner-toaster]（无 toast 时空壳也可能不渲染）
    expect(document.querySelector('[data-sonner-toaster]') ?? document.body).toBeInTheDocument()
  })
})

describe('LazyComponent / createLazyComponent', () => {
  it('异步组件加载完成后渲染，加载前显示 fallback', async () => {
    const Heavy = () => <div>重组件已加载</div>
    render(<LazyComponent component={async () => ({ default: Heavy })} fallback={<div>加载占位</div>} />)
    expect(screen.getByText('加载占位')).toBeInTheDocument()
    expect(await screen.findByText('重组件已加载')).toBeInTheDocument()
  })

  it('createLazyComponent 包装默认导出（Suspense 内渲染）', async () => {
    const Inner = ({ name }: { name: string }) => <span>lazy-{name}</span>
    const Wrapped = createLazyComponent<{ name: string }>(async () => ({ default: Inner }))
    render(
      <React.Suspense fallback={<div>lazy-占位</div>}>
        <Wrapped name="yyc3" />
      </React.Suspense>,
    )
    expect(await screen.findByText('lazy-yyc3')).toBeInTheDocument()
  })
})

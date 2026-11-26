// ============================================================
// YYC³ · @yyc3/ui toast + toaster 渲染冒烟（批次 1 · 2026-11-27）
// Toast 各原子件渲染 + variant + Toaster×toast() 集成（title/description/
// action/close 按钮真实关闭路径 → 覆盖 use-toast onOpenChange→dismiss）
// ============================================================
import React from 'react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from '../toast'
import { Toaster } from '../toaster'
import { toast } from '../use-toast'

// jsdom 未实现 Pointer Capture——Radix Toast viewport 指针事件依赖
beforeAll(() => {
  Element.prototype.hasPointerCapture =
    Element.prototype.hasPointerCapture ?? (() => false)
  Element.prototype.setPointerCapture =
    Element.prototype.setPointerCapture ?? (() => {})
  Element.prototype.releasePointerCapture =
    Element.prototype.releasePointerCapture ?? (() => {})
})

describe('toast · 原子件渲染', () => {
  it('Provider+Viewport+Root+Title+Description 全家桶渲染', () => {
    render(
      <ToastProvider>
        <Toast open data-testid="root">
          <ToastTitle>标题</ToastTitle>
          <ToastDescription>描述文案</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    )
    expect(screen.getByText('标题')).toBeInTheDocument()
    expect(screen.getByText('描述文案')).toBeInTheDocument()
    expect(screen.getByTestId('root')).toBeInTheDocument()
  })

  it('variant=destructive 应用 destructive 类', () => {
    render(
      <ToastProvider>
        <Toast variant="destructive" open>d</Toast>
        <Toast open>default</Toast>
        {/* Radix Toast 内容经 viewport 门户渲染——无 viewport 则不挂载 */}
        <ToastViewport />
      </ToastProvider>,
    )
    expect(screen.getByText('d').className).toContain('destructive')
    expect(screen.getByText('default').className).not.toContain('destructive')
  })

  it('ToastAction 作为 action 渲染且可点击（点击即关闭 toast）', async () => {
    const user = userEvent.setup()
    const onAct = vi.fn()
    render(
      <ToastProvider>
        <Toast open>
          消息
          <ToastAction altText="执行撤销" onClick={onAct}>撤销</ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    )
    await user.click(screen.getByText('撤销'))
    expect(onAct).toHaveBeenCalledTimes(1)
  })
})

describe('Toaster · 与 toast() 集成', () => {
  it('toast() 后 title/description/action 渲染，ToastClose 点击走 onOpenChange→dismiss', async () => {
    const user = userEvent.setup()
    render(<Toaster />)
    const t = toast({
      title: '集成标题',
      description: '集成描述',
    })
    expect(await screen.findByText('集成标题')).toBeInTheDocument()
    expect(screen.getByText('集成描述')).toBeInTheDocument()
    // 关闭按钮（toast-close 属性）→ Radix onOpenChange(false) → toast() 内部 dismiss 分支
    const closeBtn = document.querySelector('[toast-close]') as HTMLElement | null
    expect(closeBtn).not.toBeNull()
    await user.click(closeBtn as HTMLElement)
    // 关闭 → Radix onOpenChange(false) → toast() dismiss 分支 → open:false → Radix 卸载 li
    await waitFor(() => expect(screen.queryByText('集成标题')).toBeNull())
    expect(t.id).toBeTruthy()
  })

  it('action 点击触发回调（Radix Action 点击即关闭 toast）', async () => {
    const user = userEvent.setup()
    const onAct = vi.fn()
    render(<Toaster />)
    toast({
      title: '带动作',
      action: (
        <ToastAction altText="知道了" onClick={onAct}>知道了</ToastAction>
      ),
    })
    expect(await screen.findByText('知道了')).toBeInTheDocument()
    await user.click(screen.getByText('知道了'))
    expect(onAct).toHaveBeenCalledTimes(1)
  })

  it('update() 更新标题', async () => {
    render(<Toaster />)
    const t = toast({ title: '旧标题' })
    expect(await screen.findByText('旧标题')).toBeInTheDocument()
    t.update({ title: '新标题' })
    expect(await screen.findByText('新标题')).toBeInTheDocument()
  })

  it('仅有 title（无 description/action）也正常渲染', async () => {
    render(<Toaster />)
    toast({ title: '极简' })
    expect(await screen.findByText('极简')).toBeInTheDocument()
  })
})

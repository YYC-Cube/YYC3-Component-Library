// ============================================================
// YYC³ · @yyc3/ui use-toast 逻辑补测（渲染冒烟批次 1 · 2026-11-27）
// reducer 四动作全分支 + toast() 生命周期（add/update/dismiss）+
// useToast 订阅/退订 —— 模块级单例状态，测试间互不假设
// ============================================================
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { reducer, useToast, toast } from '../use-toast'

afterEach(() => {
  // 清掉挂起的 remove 队列定时器，防跨文件泄漏
  vi.clearAllTimers()
  cleanup()
})

describe('use-toast · reducer 全分支', () => {
  const base = { toasts: [] as Array<{ id: string; open: boolean; title?: string }> }

  it('ADD_TOAST：入队且受 TOAST_LIMIT=1 截断', () => {
    const first = reducer(base, { type: 'ADD_TOAST', toast: { id: '1', open: true } })
    expect(first.toasts).toHaveLength(1)
    const second = reducer(first, { type: 'ADD_TOAST', toast: { id: '2', open: true } })
    // limit 1 → 只保留最新
    expect(second.toasts).toHaveLength(1)
    expect(second.toasts[0].id).toBe('2')
  })

  it('UPDATE_TOAST：按 id 合并，其余不动', () => {
    const state = { toasts: [{ id: 'a', open: true }, { id: 'b', open: true }] }
    const next = reducer(state, { type: 'UPDATE_TOAST', toast: { id: 'a', title: 'hi' } })
    expect(next.toasts[0]).toMatchObject({ id: 'a', open: true, title: 'hi' })
    expect(next.toasts[1]).toEqual({ id: 'b', open: true })
  })

  it('DISMISS_TOAST：指定 id → 仅目标置 open:false', () => {
    const state = { toasts: [{ id: 'a', open: true }, { id: 'b', open: true }] }
    const next = reducer(state, { type: 'DISMISS_TOAST', toastId: 'a' })
    expect(next.toasts.find((t) => t.id === 'a')?.open).toBe(false)
    expect(next.toasts.find((t) => t.id === 'b')?.open).toBe(true)
  })

  it('DISMISS_TOAST：无 id → 全部置 open:false', () => {
    const state = { toasts: [{ id: 'a', open: true }, { id: 'b', open: true }] }
    const next = reducer(state, { type: 'DISMISS_TOAST' })
    expect(next.toasts.every((t) => !t.open)).toBe(true)
  })

  it('REMOVE_TOAST：无 id → 清空；有 id → 过滤', () => {
    const state = { toasts: [{ id: 'a', open: false }, { id: 'b', open: false }] }
    expect(reducer(state, { type: 'REMOVE_TOAST' }).toasts).toEqual([])
    const filtered = reducer(state, { type: 'REMOVE_TOAST', toastId: 'a' })
    expect(filtered.toasts.map((t) => t.id)).toEqual(['b'])
  })
})

/** 探针：暴露 useToast 状态与操作 */
function ToastProbe() {
  const { toasts, toast: push, dismiss } = useToast()
  return (
    <div>
      <div data-testid="count">{toasts.length}</div>
      <div data-testid="open">{String(toasts[0]?.open ?? 'none')}</div>
      <div data-testid="title">{toasts[0]?.title ?? '-'}</div>
      <button type="button" onClick={() => push({ title: 'probe-toast' })}>
        push
      </button>
      <button type="button" onClick={() => push({ title: 'v1' }) && undefined}>
        push2
      </button>
      <button type="button" onClick={() => dismiss(toasts[0]?.id)}>dismiss-one</button>
      <button type="button" onClick={() => dismiss()}>dismiss-all</button>
    </div>
  )
}

describe('useToast · hook 订阅与 toast() 生命周期', () => {
  it('toast() 入队 → 探针收到状态', async () => {
    const user = userEvent.setup()
    render(<ToastProbe />)
    expect(screen.getByTestId('count')).toHaveTextContent('0')
    await user.click(screen.getByRole('button', { name: 'push' }))
    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByTestId('title')).toHaveTextContent('probe-toast')
    expect(screen.getByTestId('open')).toHaveTextContent('true')
  })

  it('dismiss(toastId) 置 open:false', async () => {
    const user = userEvent.setup()
    render(<ToastProbe />)
    await user.click(screen.getByRole('button', { name: 'push' }))
    await user.click(screen.getByRole('button', { name: 'dismiss-one' }))
    expect(screen.getByTestId('open')).toHaveTextContent('false')
  })

  it('dismiss() 无参 → 全部关闭', async () => {
    const user = userEvent.setup()
    render(<ToastProbe />)
    await user.click(screen.getByRole('button', { name: 'push' }))
    await user.click(screen.getByRole('button', { name: 'dismiss-all' }))
    expect(screen.getByTestId('open')).toHaveTextContent('false')
  })

  it('返回的 handle.update 合并更新；handle.dismiss 关闭', async () => {
    let handle: ReturnType<typeof toast> | undefined
    function Probe() {
      const { toasts } = useToast()
      return (
        <div>
          <span data-testid="t">{String(toasts[0]?.title ?? '-')}</span>
          <span data-testid="o">{String(toasts[0]?.open ?? '-')}</span>
          <button
            type="button"
            onClick={() => {
              if (!handle) handle = toast({ title: 'v0' })
              else handle.update({ title: 'v2' })
            }}
          >
            act
          </button>
          <button type="button" onClick={() => handle?.dismiss()}>bye</button>
        </div>
      )
    }
    const user = userEvent.setup()
    render(<Probe />)
    await user.click(screen.getByRole('button', { name: 'act' }))
    expect(screen.getByTestId('t')).toHaveTextContent('v0')
    await user.click(screen.getByRole('button', { name: 'act' }))
    expect(screen.getByTestId('t')).toHaveTextContent('v2')
    await user.click(screen.getByRole('button', { name: 'bye' }))
    expect(screen.getByTestId('o')).toHaveTextContent('false')
    handle = undefined
  })

  it('addToRemoveQueue 幂等：同一 toastId 重复 dismiss 不叠加定时器', async () => {
    const user = userEvent.setup()
    render(<ToastProbe />)
    await user.click(screen.getByRole('button', { name: 'push' }))
    // 连续两次 DISMISS 同一 id → addToRemoveQueue 早退分支
    await user.click(screen.getByRole('button', { name: 'dismiss-one' }))
    await user.click(screen.getByRole('button', { name: 'dismiss-one' }))
    expect(screen.getByTestId('open')).toHaveTextContent('false')
  })
})

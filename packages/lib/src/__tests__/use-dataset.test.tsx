// ============================================================
// YYC³ · useDataset 死循环专项（lib batch2 缺陷修复 · 2026-11-28）
// 覆盖对象：services/visualization-service.ts useDataset
// 根因（修复前实证）：
//   effect 依赖 fetchData 身份；消费方以内联对象字面量传 options
//   （transformFn/onDataReceived 每渲染换引用）→ fetchData 每渲染重建 →
//   effect 每渲染重触；cache-first 命中路径 `setLastUpdated(new Date())`
//   每轮强制 re-render（数据同 ref bail-out 被抵消）→ 紧密死循环。
// 约定：import 一律走 '../index' 桶（顺带验证桶导出连通性）。
// ============================================================
import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDataset } from '../index'
import type { DataSeries } from '../index'

const networkPayload: DataSeries[] = [{ id: 'a', name: '系列A', data: [{ x: 1, y: 2 }] }]

function stubFetch() {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    json: async () => networkPayload,
  }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
  localStorage.clear()
})

describe('useDataset（lib batch2 死循环专项）', () => {
  it('mount：cache-first 未命中 → 网络拉取一次，数据与 lastUpdated 就位', async () => {
    const fetchMock = stubFetch()
    const { result } = renderHook(() =>
      useDataset({
        endpoint: '/api/data',
        fetchPolicy: 'cache-first',
        cacheStrategy: 'memory',
      }),
    )

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(networkPayload)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.lastUpdated).toBeInstanceOf(Date)
    expect(result.current.error).toBeNull()
  })

  it('死循环锁：cache-first 命中后 effect 不重触（内联 options 每渲染重建的最坏消费形态）', async () => {
    const fetchMock = stubFetch()
    let renderCount = 0
    // 最坏消费形态：options 字面量内联在 renderHook 回调里（每次渲染重建 transformFn/onDataReceived 引用）
    const { result, rerender } = renderHook(() => {
      renderCount += 1
      return useDataset({
        endpoint: '/api/data',
        fetchPolicy: 'cache-first',
        cacheStrategy: 'memory',
        transformFn: (d: DataSeries[]) => d,
        onDataReceived: () => {},
      })
    })

    // 首轮：cache miss → 网络拉取并入 memory 缓存
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    // 给死循环充分机会：连续 re-render（新内联 options）+ 微任务/宏任务排空
    rerender()
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })
    rerender()
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })

    // cache-first：命中后绝不重触网络
    expect(fetchMock).toHaveBeenCalledTimes(1)
    // 渲染轮数有界（修复前：每轮 effect 重触 + setLastUpdated 强制 re-render，轮数爆炸/Maximum update depth）
    expect(renderCount).toBeLessThanOrEqual(12)
    expect(result.current.isLoading).toBe(false)
  })

  it('localStorage 缓存命中：不拉网络，lastUpdated = 缓存时间戳且引用稳定', async () => {
    const fetchMock = stubFetch()
    const seededAt = Date.now()
    localStorage.setItem(
      'yy_chart_/api/cached_1_1000',
      JSON.stringify({ data: networkPayload, timestamp: seededAt }),
    )

    const { result, rerender } = renderHook(() =>
      useDataset({
        endpoint: '/api/cached',
        fetchPolicy: 'cache-first',
        cacheStrategy: 'localStorage',
      }),
    )

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.current.data).toEqual(networkPayload)
    expect(result.current.lastUpdated?.getTime()).toBe(seededAt)

    // 重复命中：lastUpdated 引用稳定（Object.is bail-out，不自触发 re-render 链）
    const before = result.current.lastUpdated
    rerender()
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })
    expect(result.current.lastUpdated).toBe(before)
  })

  it('键变化（page 翻页）→ 守卫放行：network-only 拉取第二页', async () => {
    const fetchMock = stubFetch()
    const { result } = renderHook(() =>
      useDataset({
        endpoint: '/api/paged',
        fetchPolicy: 'network-only',
        cacheStrategy: 'none',
        pageSize: 1, // payload 长 1 === pageSize → hasMore=true，loadMore 才会翻页
      }),
    )

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    // loadMore → page 2 → 新键 → 守卫放行
    act(() => {
      result.current.loadMore()
    })
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[1][0]).toContain('page=2')
  })

  it('refresh() 直呼不受守卫影响：同键强制重拉', async () => {
    const fetchMock = stubFetch()
    const { result } = renderHook(() =>
      useDataset({
        endpoint: '/api/refreshable',
        fetchPolicy: 'cache-first',
        cacheStrategy: 'memory',
      }),
    )

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      result.current.refresh()
      await Promise.resolve()
      await Promise.resolve()
    })
    // refresh 走 isRefresh 直呼路径（绕过 effect 守卫），isFetching 在位期间防重入
    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2)
  })
})

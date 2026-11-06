// ============================================================
// YYC³ · @yyc3/medical 前置件（medical T0+T1 批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/ai-medical-systemadvanced/hooks/use-real-time-data.ts
// ============================================================
"use client"

import { useState, useEffect, useRef } from "react"

// 自愈登记（T0+T1 批次）：updater 需返回新值以匹配 SetStateAction<T>（源件 (data)=>void 与 setData 用法不符）
type DataUpdateCallback<T> = (data: T) => T
type DataFetchFunction<T> = () => Promise<T>

interface UseRealTimeDataOptions {
  interval?: number
  enabled?: boolean
  onError?: (error: Error) => void
  retryCount?: number
  retryDelay?: number
}

export function useRealTimeData<T>(
  fetchFunction: DataFetchFunction<T>,
  initialData: T,
  options: UseRealTimeDataOptions = {},
) {
  const { interval = 5000, enabled = true, onError, retryCount = 3, retryDelay = 1000 } = options

  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const retryCountRef = useRef(0)
  const isMountedRef = useRef(true)

  const fetchData = async () => {
    if (!enabled || !isMountedRef.current) return

    setIsLoading(true)

    try {
      const newData = await fetchFunction()

      if (isMountedRef.current) {
        setData(newData)
        setError(null)
        setLastUpdated(new Date())
        retryCountRef.current = 0
      }
    } catch (err) {
      if (isMountedRef.current) {
        const error = err instanceof Error ? err : new Error("未知错误")
        setError(error)

        if (onError) {
          onError(error)
        }

        // 重试逻辑
        if (retryCountRef.current < retryCount) {
          retryCountRef.current += 1
          setTimeout(fetchData, retryDelay)
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    isMountedRef.current = true

    // 初始加载
    fetchData()

    // 设置定时器
    const timerId = setInterval(fetchData, interval)

    return () => {
      isMountedRef.current = false
      clearInterval(timerId)
    }
  }, [interval, enabled])

  const refresh = () => {
    fetchData()
  }

  const updateData = (updater: DataUpdateCallback<T>) => {
    setData((currentData) => {
      const newData = updater(currentData)
      return newData
    })
  }

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refresh,
    updateData,
  }
}

// ============================================================
// YYC³ · @yyc3/medical hooks 真身（medical T2/T3 批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/ai-medical-systemadvanced/hooks/useApi.ts
// ============================================================
"use client"

import { useState, useCallback } from "react"
import { api, type ApiRequestConfig, type ApiResponse } from "../lib/api/client"

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: string, status: number) => void
  initialData?: T | null
}

export function useApi<T = any>(options: UseApiOptions<T> = {}) {
  const [data, setData] = useState<T | null>(options.initialData || null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const request = useCallback(
    async <R = T>(endpoint: string, config?: ApiRequestConfig): Promise<ApiResponse<R>> => {
      setIsLoading(true)
      setError(null)

      try {
        const method = config?.method?.toUpperCase() || "GET"
        let response: ApiResponse<R>

        switch (method) {
          case "GET":
            response = await api.get<R>(endpoint, config)
            break
          case "POST":
            response = await api.post<R>(endpoint, config?.body, config)
            break
          case "PUT":
            response = await api.put<R>(endpoint, config?.body, config)
            break
          case "PATCH":
            response = await api.patch<R>(endpoint, config?.body, config)
            break
          case "DELETE":
            response = await api.delete<R>(endpoint, config)
            break
          default:
            response = await api.get<R>(endpoint, config)
        }

        setStatus(response.status)

        // 自愈登记（T2/T3 批次）：ApiResponse 契约为 ok/message（无 error 字段），消费方对齐契约
        if (!response.ok) {
          const message = response.message || "请求失败"
          setError(message)
          options.onError?.(message, response.status)
        } else if (response.data) {
          setData(response.data as unknown as T)
          options.onSuccess?.(response.data as unknown as T)
        }

        return response
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "请求过程中发生错误"
        setError(errorMessage)
        setStatus(0)
        options.onError?.(errorMessage, 0)

        // 自愈登记（T2/T3 批次）：返回值对齐 ApiResponse 契约（data/ok/message，无 error 字段）
        return {
          data: null as unknown as R,
          status: 0,
          ok: false,
          message: errorMessage,
        }
      } finally {
        setIsLoading(false)
      }
    },
    [options],
  )

  const get = useCallback(
    <R = T>(endpoint: string, config?: Omit<ApiRequestConfig, "method">) => {
      return request<R>(endpoint, { ...config, method: "GET" })
    },
    [request],
  )

  const post = useCallback(
    <R = T>(endpoint: string, data?: any, config?: Omit<ApiRequestConfig, "method" | "body">) => {
      return request<R>(endpoint, { ...config, method: "POST", body: data })
    },
    [request],
  )

  const put = useCallback(
    <R = T>(endpoint: string, data?: any, config?: Omit<ApiRequestConfig, "method" | "body">) => {
      return request<R>(endpoint, { ...config, method: "PUT", body: data })
    },
    [request],
  )

  const patch = useCallback(
    <R = T>(endpoint: string, data?: any, config?: Omit<ApiRequestConfig, "method" | "body">) => {
      return request<R>(endpoint, { ...config, method: "PATCH", body: data })
    },
    [request],
  )

  const del = useCallback(
    <R = T>(endpoint: string, config?: Omit<ApiRequestConfig, "method">) => {
      return request<R>(endpoint, { ...config, method: "DELETE" })
    },
    [request],
  )

  const reset = useCallback(() => {
    setData(options.initialData || null)
    setError(null)
    setStatus(null)
    setIsLoading(false)
  }, [options.initialData])

  return {
    data,
    error,
    status,
    isLoading,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    reset,
  }
}

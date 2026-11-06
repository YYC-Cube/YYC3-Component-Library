// ============================================================
// YYC³ · @yyc3/medical lib/api 轻桥（medical T2/T3 批次 · 2026-11-06）
// 桥接登记：D0 真身 client.ts 深耦合应用级 auth store（@/store 的 useAuthStore，
// Next 应用全局态未随迁），按消费面（patientService/useApi 的 get/post/patch/delete
// + 泛型）建无鉴权 fetch 轻桥——类型面与真身对齐（ApiRequestConfig/ApiResponse）。
// 悬留：auth store 真身随应用层批次迁入后可整替本桥（requiresAuth 语义届时补齐）。
// ============================================================

/** API 请求配置类型（与 D0 真身 client.ts 类型面对齐） */
export interface ApiRequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  requiresAuth?: boolean
  cache?: RequestCache
  revalidate?: number
}

/** API 响应类型（与 D0 真身 client.ts 类型面对齐） */
export interface ApiResponse<T = unknown> {
  data: T
  status: number
  ok: boolean
  message?: string
}

/** params → 查询串（undefined 值剔除） */
function buildUrl(url: string, config?: ApiRequestConfig): string {
  const params = config?.params
  if (!params) return url
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `${url}${url.includes("?") ? "&" : "?"}${qs}` : url
}

async function request<T>(method: string, url: string, config?: ApiRequestConfig, body?: unknown): Promise<ApiResponse<T>> {
  const { params, requiresAuth: _requiresAuth, revalidate: _revalidate, ...rest } = config ?? {}
  void _requiresAuth // 悬留：auth store 真身迁入后生效
  void _revalidate
  const response = await fetch(buildUrl(url, config), {
    ...rest,
    method,
    headers: {
      "Content-Type": "application/json",
      ...(rest.headers ?? {}),
    },
    body: body !== undefined ? JSON.stringify(body) : rest.body,
  })
  const payload = (await response.json().catch(() => null)) as T | null
  return {
    data: payload as T,
    status: response.status,
    ok: response.ok,
    message: response.ok ? undefined : `请求失败: ${response.statusText}`,
  }
}

/** 无鉴权 fetch 封装（同真身方法签名） */
export const api = {
  get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return request<T>("GET", url, config)
  },
  post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return request<T>("POST", url, config, data)
  },
  patch<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return request<T>("PATCH", url, config, data)
  },
  put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return request<T>("PUT", url, config, data)
  },
  delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return request<T>("DELETE", url, config)
  },
}

/**
 * API客户端 - 用于与后端API进行通信
 */

// 基础API配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com"
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1"

// 请求头配置
const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

// 错误处理
class ApiError extends Error {
  status: number
  data: any

  constructor(status: number, message: string, data?: any) {
    super(message)
    this.status = status
    this.data = data
    this.name = "ApiError"
  }
}

// 请求处理
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type")
  const isJson = contentType && contentType.includes("application/json")
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText || "API请求失败", data)
  }

  return data
}

// API客户端
export const apiClient = {
  /**
   * 发送GET请求
   */
  async get<T>(endpoint: string, params?: Record<string, any>, token?: string): Promise<T> {
    const url = new URL(`${API_BASE_URL}/${API_VERSION}/${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getHeaders(token),
      credentials: "include",
    })

    return handleResponse(response)
  },

  /**
   * 发送POST请求
   */
  async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/${endpoint}`, {
      method: "POST",
      headers: getHeaders(token),
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    })

    return handleResponse(response)
  },

  /**
   * 发送PUT请求
   */
  async put<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/${endpoint}`, {
      method: "PUT",
      headers: getHeaders(token),
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    })

    return handleResponse(response)
  },

  /**
   * 发送PATCH请求
   */
  async patch<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/${endpoint}`, {
      method: "PATCH",
      headers: getHeaders(token),
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    })

    return handleResponse(response)
  },

  /**
   * 发送DELETE请求
   */
  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(token),
      credentials: "include",
    })

    return handleResponse(response)
  },

  /**
   * 上传文件
   */
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>, token?: string): Promise<T> {
    const formData = new FormData()
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })
    }

    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/${endpoint}`, {
      method: "POST",
      headers,
      credentials: "include",
      body: formData,
    })

    return handleResponse(response)
  },
}

/**
 * 应用错误类型
 */
export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
  originalError?: Error
}

/**
 * 创建标准化的应用错误
 * @param code 错误代码
 * @param message 错误消息
 * @param details 错误详情
 * @param originalError 原始错误
 * @returns 标准化的应用错误
 */
export function createError(
  code: string,
  message: string,
  details?: Record<string, any>,
  originalError?: Error,
): AppError {
  return {
    code,
    message,
    details,
    originalError,
  }
}

/**
 * 格式化错误消息以显示给用户
 * @param error 错误对象
 * @returns 格式化后的错误消息
 */
export function formatErrorMessage(error: Error | AppError | string | unknown): string {
  if (typeof error === "string") {
    return error
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message)
  }

  return "发生未知错误"
}

/**
 * 记录错误到日志系统
 * @param error 错误对象
 * @param context 错误上下文
 */
export function logError(error: Error | AppError | unknown, context?: Record<string, any>): void {
  console.error("应用错误:", {
    error,
    context,
    timestamp: new Date().toISOString(),
  })

  // 这里可以添加更多的错误记录逻辑，如发送错误到监控服务
}

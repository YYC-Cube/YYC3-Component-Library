// 错误类型定义
export type ErrorType =
  | "workflow_not_found"
  | "workflow_creation_failed"
  | "workflow_update_failed"
  | "workflow_deletion_failed"
  | "workflow_execution_failed"
  | "step_execution_failed"
  | "invalid_workflow_config"
  | "invalid_step_config"
  | "api_error"
  | "network_error"
  | "permission_denied"
  | "unknown_error"

// 错误详情接口
export interface ErrorDetails {
  type: ErrorType
  message: string
  code?: string
  field?: string
  details?: Record<string, any>
  timestamp: string
}

// 创建错误详情
export function createError(
  type: ErrorType,
  message: string,
  additionalInfo?: Partial<Omit<ErrorDetails, "type" | "message" | "timestamp">>,
): ErrorDetails {
  return {
    type,
    message,
    ...additionalInfo,
    timestamp: new Date().toISOString(),
  }
}

// 格式化错误消息
export function formatErrorMessage(error: ErrorDetails): string {
  let message = error.message

  if (error.field) {
    message += ` (字段: ${error.field})`
  }

  if (error.code) {
    message += ` [错误代码: ${error.code}]`
  }

  return message
}

// 获取用户友好的错误消息
export function getUserFriendlyErrorMessage(error: ErrorDetails): string {
  switch (error.type) {
    case "workflow_not_found":
      return "找不到指定的工作流，它可能已被删除或您没有访问权限。"
    case "workflow_creation_failed":
      return "创建工作流失败，请检查您的输入并重试。"
    case "workflow_update_failed":
      return "更新工作流失败，请检查您的更改并重试。"
    case "workflow_deletion_failed":
      return "删除工作流失败，请稍后重试。"
    case "workflow_execution_failed":
      return "工作流执行失败，请查看详细信息以了解原因。"
    case "step_execution_failed":
      return "工作流步骤执行失败，请检查步骤配置。"
    case "invalid_workflow_config":
      return "工作流配置无效，请检查触发器和步骤设置。"
    case "invalid_step_config":
      return "步骤配置无效，请检查步骤参数。"
    case "api_error":
      return "与服务器通信时发生错误，请稍后重试。"
    case "network_error":
      return "网络连接错误，请检查您的网络连接并重试。"
    case "permission_denied":
      return "您没有执行此操作的权限。"
    default:
      return "发生未知错误，请稍后重试。"
  }
}

// 记录错误
export function logError(error: ErrorDetails): void {
  console.error(`[${error.timestamp}] ${error.type}: ${error.message}`, error.details || "")

  // 在实际应用中，这里可以将错误发送到服务器或错误跟踪服务
}

// 处理API错误
export function handleApiError(error: any): ErrorDetails {
  if (error.response) {
    // 服务器返回了错误响应
    return createError("api_error", error.response.data.message || "服务器返回错误", {
      code: `${error.response.status}`,
      details: error.response.data,
    })
  } else if (error.request) {
    // 请求已发送但没有收到响应
    return createError("network_error", "无法连接到服务器", {
      code: "NO_RESPONSE",
    })
  } else {
    // 请求设置时发生错误
    return createError("unknown_error", error.message || "发生未知错误", {
      code: "REQUEST_SETUP_ERROR",
    })
  }
}

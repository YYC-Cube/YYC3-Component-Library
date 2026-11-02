import { createClient } from "../supabase/server-client"

// 工作流执行类型定义
export interface WorkflowExecution {
  id: string
  workflow_id: string
  status: "pending" | "running" | "completed" | "failed"
  created_at: string
  updated_at: string
  start_time: string
  end_time?: string
  result?: any
  error?: string
  metadata?: Record<string, any>
  step_executions?: Array<{
    id: string
    step_id: string
    status: string
    start_time?: string
    end_time?: string
    output?: any
    error?: string
  }>
  logs?: Array<{
    id: string
    level: string
    message: string
    timestamp: string
  }>
  output?: any
}

/**
 * 获取工作流执行详情
 * @param executionId 工作流执行ID
 * @returns 工作流执行详情或null
 */
export async function getWorkflowExecution(executionId: string): Promise<WorkflowExecution | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("workflow_executions").select("*").eq("id", executionId).single()

    if (error) {
      console.error("获取工作流执行详情失败:", error)
      return null
    }

    return data as WorkflowExecution
  } catch (error) {
    console.error("获取工作流执行详情时发生错误:", error)
    return null
  }
}

/**
 * 创建新的工作流执行
 * @param workflowId 工作流ID
 * @param metadata 元数据
 * @returns 创建的工作流执行或null
 */
export async function createWorkflowExecution(
  workflowId: string,
  metadata?: Record<string, any>,
): Promise<WorkflowExecution | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("workflow_executions")
      .insert({
        workflow_id: workflowId,
        status: "pending",
        metadata,
      })
      .select()
      .single()

    if (error) {
      console.error("创建工作流执行失败:", error)
      return null
    }

    return data as WorkflowExecution
  } catch (error) {
    console.error("创建工作流执行时发生错误:", error)
    return null
  }
}

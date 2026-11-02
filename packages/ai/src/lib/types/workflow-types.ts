// 工作流类型定义
export type WorkflowTriggerType = "schedule" | "event" | "manual" | "api"

export interface ScheduleTriggerConfig {
  frequency: "daily" | "weekly" | "monthly" | "custom"
  time: string
  days?: number[]
  dates?: number[]
  customCron?: string
}

export interface EventTriggerConfig {
  eventType: string
  filters?: Record<string, any>
}

export interface ManualTriggerConfig {
  requireApproval?: boolean
  approvers?: string[]
}

export interface ApiTriggerConfig {
  endpoint: string
  method: "GET" | "POST"
  headers?: Record<string, string>
}

export interface WorkflowTrigger {
  type: WorkflowTriggerType
  config: ScheduleTriggerConfig | EventTriggerConfig | ManualTriggerConfig | ApiTriggerConfig
}

export type WorkflowStepType =
  | "content_generation"
  | "content_optimization"
  | "content_analysis"
  | "content_publishing"
  | "notification"
  | "data_collection"
  | "conditional"
  | "delay"

export interface WorkflowStep {
  id: string
  name: string
  type: WorkflowStepType
  config: Record<string, any>
  position: number
  dependsOn?: string[]
}

export interface Workflow {
  id: string
  name: string
  description: string
  trigger: WorkflowTrigger
  steps: WorkflowStep[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastRun?: string
  nextRun?: string
  stats?: {
    totalRuns: number
    successfulRuns: number
    failedRuns: number
    averageDuration: number
  }
}

export interface WorkflowExecution {
  id: string
  workflow_id: string
  status: "pending" | "running" | "completed" | "failed" | "canceled"
  start_time: string
  end_time?: string
  step_executions: {
    id: string
    step_id: string
    step_name: string
    status: "pending" | "running" | "completed" | "failed"
    start_time?: string
    end_time?: string
    output?: any
    error?: string
  }[]
  output?: any
  error?: string
  logs?: {
    id: string
    timestamp: string
    level: "info" | "warn" | "error" | "debug"
    message: string
  }[]
  metadata?: Record<string, any>
  result?: any
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  trigger: WorkflowTrigger
  steps: WorkflowStep[]
  isCustom: boolean
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

// 工作流模板分类
export const workflowTemplateCategories = [
  { id: "content", name: "内容创作" },
  { id: "marketing", name: "营销推广" },
  { id: "social", name: "社交媒体" },
  { id: "ecommerce", name: "电商运营" },
  { id: "data", name: "数据分析" },
  { id: "automation", name: "自动化工具" },
]

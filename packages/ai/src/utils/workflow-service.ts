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

// 修改后的WorkflowExecution接口，使用下划线命名法与现有代码保持一致
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

// 模拟数据 - 工作流模板
export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "template1",
    name: "每日内容发布",
    description: "每天自动生成内容并发布到小红书",
    category: "content",
    trigger: {
      type: "schedule",
      config: {
        frequency: "daily",
        time: "09:00",
      } as ScheduleTriggerConfig,
    },
    steps: [
      {
        id: "step1",
        name: "生成内容",
        type: "content_generation",
        config: {
          contentType: "xiaohongshu",
          prompt: "时尚穿搭分享",
          style: "casual",
          length: 800,
        },
        position: 0,
      },
      {
        id: "step2",
        name: "内容优化",
        type: "content_optimization",
        config: {
          optimizationType: "seo",
          keywords: ["穿搭", "时尚", "搭配"],
        },
        position: 1,
        dependsOn: ["step1"],
      },
      {
        id: "step3",
        name: "发布到小红书",
        type: "content_publishing",
        config: {
          platform: "xiaohongshu",
          tags: ["穿搭", "时尚", "搭配"],
        },
        position: 2,
        dependsOn: ["step2"],
      },
    ],
    isCustom: false,
    isFavorite: false,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "template2",
    name: "热点监控与内容创作",
    description: "监控热点话题并自动生成相关内容",
    category: "marketing",
    trigger: {
      type: "event",
      config: {
        eventType: "trending_topic",
        filters: {
          categories: ["fashion", "lifestyle"],
        },
      } as EventTriggerConfig,
    },
    steps: [
      {
        id: "step1",
        name: "数据收集",
        type: "data_collection",
        config: {
          sources: ["weibo", "zhihu"],
          keywords: [],
        },
        position: 0,
      },
      {
        id: "step2",
        name: "内容生成",
        type: "content_generation",
        config: {
          contentType: "wechat",
          style: "professional",
          length: 1200,
        },
        position: 1,
        dependsOn: ["step1"],
      },
      {
        id: "step3",
        name: "内容分析",
        type: "content_analysis",
        config: {
          analysisTypes: ["readability", "seo"],
        },
        position: 2,
        dependsOn: ["step2"],
      },
      {
        id: "step4",
        name: "发布内容",
        type: "content_publishing",
        config: {
          platform: "wechat",
          scheduleDelta: 3600,
        },
        position: 3,
        dependsOn: ["step3"],
      },
    ],
    isCustom: false,
    isFavorite: false,
    createdAt: "2023-01-02T00:00:00Z",
    updatedAt: "2023-01-02T00:00:00Z",
  },
  {
    id: "template3",
    name: "电商促销活动",
    description: "自动创建和发布电商促销活动内容",
    category: "ecommerce",
    trigger: {
      type: "manual",
      config: {
        requireApproval: true,
        approvers: ["manager@example.com"],
      } as ManualTriggerConfig,
    },
    steps: [
      {
        id: "step1",
        name: "生成促销文案",
        type: "content_generation",
        config: {
          contentType: "taobao",
          prompt: "促销活动",
          style: "persuasive",
          length: 600,
        },
        position: 0,
      },
      {
        id: "step2",
        name: "多平台发布",
        type: "content_publishing",
        config: {
          platform: "taobao",
          tags: ["促销", "限时", "折扣"],
        },
        position: 1,
        dependsOn: ["step1"],
      },
      {
        id: "step3",
        name: "发送通知",
        type: "notification",
        config: {
          notificationType: "email",
          template: "promotion_launched",
        },
        position: 2,
        dependsOn: ["step2"],
      },
    ],
    isCustom: false,
    isFavorite: true,
    createdAt: "2023-01-03T00:00:00Z",
    updatedAt: "2023-01-03T00:00:00Z",
  },
]

// 模拟API调用 - 获取工作流列表
export async function getWorkflows(): Promise<Workflow[]> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 800))

  // 返回模拟数据
  return [
    {
      id: "wf1",
      name: "每日内容发布工作流",
      description: "每天早上9点自动生成内容并发布到小红书",
      trigger: {
        type: "schedule",
        config: {
          frequency: "daily",
          time: "09:00",
        } as ScheduleTriggerConfig,
      },
      steps: [
        {
          id: "step1",
          name: "生成内容",
          type: "content_generation",
          config: {
            contentType: "xiaohongshu",
            prompt: "时尚穿搭分享",
            style: "casual",
            length: 800,
          },
          position: 0,
        },
        {
          id: "step2",
          name: "内容分析",
          type: "content_analysis",
          config: {
            analysisTypes: ["readability", "seo"],
          },
          position: 1,
          dependsOn: ["step1"],
        },
        {
          id: "step3",
          name: "内容优化",
          type: "content_optimization",
          config: {
            optimizationType: "seo",
            keywords: ["穿搭", "时尚", "搭配"],
          },
          position: 2,
          dependsOn: ["step2"],
        },
        {
          id: "step4",
          name: "发布到小红书",
          type: "content_publishing",
          config: {
            platform: "xiaohongshu",
            tags: ["穿搭", "时尚", "搭配"],
          },
          position: 3,
          dependsOn: ["step3"],
        },
      ],
      isActive: true,
      createdAt: "2023-04-01T10:00:00Z",
      updatedAt: "2023-04-10T15:30:00Z",
      lastRun: "2023-04-15T09:00:00Z",
      nextRun: "2023-04-16T09:00:00Z",
      stats: {
        totalRuns: 15,
        successfulRuns: 14,
        failedRuns: 1,
        averageDuration: 45000,
      },
    },
    {
      id: "wf2",
      name: "热点监控工作流",
      description: "监控热点话题并自动生成相关内容",
      trigger: {
        type: "event",
        config: {
          eventType: "trending_topic",
          filters: {
            categories: ["fashion", "lifestyle"],
          },
        } as EventTriggerConfig,
      },
      steps: [
        {
          id: "step1",
          name: "数据收集",
          type: "data_collection",
          config: {
            sources: ["weibo", "zhihu"],
            keywords: [],
          },
          position: 0,
        },
        {
          id: "step2",
          name: "内容生成",
          type: "content_generation",
          config: {
            contentType: "wechat",
            style: "professional",
            length: 1200,
          },
          position: 1,
          dependsOn: ["step1"],
        },
        {
          id: "step3",
          name: "发布内容",
          type: "content_publishing",
          config: {
            platform: "wechat",
            scheduleDelta: 3600,
          },
          position: 2,
          dependsOn: ["step2"],
        },
      ],
      isActive: true,
      createdAt: "2023-03-15T14:30:00Z",
      updatedAt: "2023-04-05T09:45:00Z",
      lastRun: "2023-04-14T10:15:00Z",
      nextRun: null,
      stats: {
        totalRuns: 8,
        successfulRuns: 7,
        failedRuns: 1,
        averageDuration: 62000,
      },
    },
  ]
}

// 模拟API调用 - 获取单个工作流
export async function getWorkflow(id: string): Promise<Workflow | null> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 获取所有工作流
  const workflows = await getWorkflows()

  // 查找指定ID的工作流
  return workflows.find((workflow) => workflow.id === id) || null
}

// 模拟API调用 - 创建工作流
export async function createWorkflow(workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">): Promise<Workflow> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 创建新工作流
  const newWorkflow: Workflow = {
    ...workflow,
    id: `wf${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stats: {
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      averageDuration: 0,
    },
  }

  return newWorkflow
}

// 模拟API调用 - 更新工作流
export async function updateWorkflow(
  id: string,
  updates: Partial<Omit<Workflow, "id" | "createdAt" | "updatedAt">>,
): Promise<Workflow> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 800))

  // 获取工作流
  const workflow = await getWorkflow(id)

  if (!workflow) {
    throw new Error(`工作流不存在: ${id}`)
  }

  // 更新工作流
  const updatedWorkflow: Workflow = {
    ...workflow,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  return updatedWorkflow
}

// 模拟API调用 - 删除工作流
export async function deleteWorkflow(id: string): Promise<void> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 800))

  // 在实际应用中，这里会调用API删除工作流
  console.log(`删除工作流: ${id}`)
}

// 模拟API调用 - 执行工作流
export async function executeWorkflow(id: string): Promise<WorkflowExecution> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 创建执行记录
  const execution: WorkflowExecution = {
    id: `exec${Date.now()}`,
    workflow_id: id,
    status: "running",
    start_time: new Date().toISOString(),
    step_executions: [],
    logs: []
  }

  // 在实际应用中，这里会启动工作流执行
  console.log(`执行工作流: ${id}`)

  return execution
}

// 模拟API调用 - 获取工作流执行历史
export async function getWorkflowExecutions(workflowId: string): Promise<WorkflowExecution[]> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 700))

  // 返回模拟数据
  return [
    {
      id: "exec1",
      workflow_id: workflowId,
      status: "completed",
      start_time: "2023-04-15T09:00:00Z",
      end_time: "2023-04-15T09:01:30Z",
      step_executions: [
        {
          id: "stepexec1",
          step_id: "step1",
          step_name: "生成内容",
          status: "completed",
          start_time: "2023-04-15T09:00:00Z",
          end_time: "2023-04-15T09:00:45Z",
          output: {
            content: "今天给大家分享一套春季穿搭...",
            length: 820,
          },
        },
        {
          id: "stepexec2",
          step_id: "step2",
          step_name: "内容分析",
          status: "completed",
          start_time: "2023-04-15T09:00:45Z",
          end_time: "2023-04-15T09:01:00Z",
          output: {
            readabilityScore: 85,
            seoScore: 78,
            keywords: ["春季", "穿搭", "时尚"],
          },
        },
        {
          id: "stepexec3",
          step_id: "step3",
          step_name: "内容优化",
          status: "completed",
          start_time: "2023-04-15T09:01:00Z",
          end_time: "2023-04-15T09:01:15Z",
          output: {
            optimizedContent: "今天给大家分享一套春季穿搭...",
            improvements: ["增加关键词密度", "优化标题"],
          },
        },
        {
          id: "stepexec4",
          step_id: "step4",
          step_name: "发布到小红书",
          status: "completed",
          start_time: "2023-04-15T09:01:15Z",
          end_time: "2023-04-15T09:01:30Z",
          output: {
            postId: "xhs123456",
            url: "https://xiaohongshu.com/post/123456",
          },
        },
      ],
      output: {
        postId: "xhs123456",
        url: "https://xiaohongshu.com/post/123456",
      },
      logs: [
        {
          id: "log1",
          timestamp: "2023-04-15T09:00:00Z",
          level: "info",
          message: "工作流开始执行",
        },
        {
          id: "log2",
          timestamp: "2023-04-15T09:00:45Z",
          level: "info",
          message: "内容生成完成",
        },
        {
          id: "log3",
          timestamp: "2023-04-15T09:01:30Z",
          level: "info",
          message: "工作流执行完成",
        },
      ],
    },
    {
      id: "exec2",
      workflow_id: workflowId,
      status: "failed",
      start_time: "2023-04-14T09:00:00Z",
      end_time: "2023-04-14T09:00:30Z",
      step_executions: [
        {
          id: "stepexec5",
          step_id: "step1",
          step_name: "生成内容",
          status: "completed",
          start_time: "2023-04-14T09:00:00Z",
          end_time: "2023-04-14T09:00:15Z",
          output: {
            content: "今天给大家分享一套春季穿搭...",
            length: 750,
          },
        },
        {
          id: "stepexec6",
          step_id: "step2",
          step_name: "内容分析",
          status: "failed",
          start_time: "2023-04-14T09:00:15Z",
          end_time: "2023-04-14T09:00:30Z",
          error: "分析服务暂时不可用",
        },
      ],
      error: "步骤 'step2' 执行失败: 分析服务暂时不可用",
      logs: [
        {
          id: "log4",
          timestamp: "2023-04-14T09:00:00Z",
          level: "info",
          message: "工作流开始执行",
        },
        {
          id: "log5",
          timestamp: "2023-04-14T09:00:15Z",
          level: "info",
          message: "内容生成完成",
        },
        {
          id: "log6",
          timestamp: "2023-04-14T09:00:30Z",
          level: "error",
          message: "分析服务暂时不可用",
        },
      ],
    },
  ]
}

// 修改后的getWorkflowExecution函数，只接受一个executionId参数
export async function getWorkflowExecution(executionId: string): Promise<WorkflowExecution | null> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 模拟数据
  const executions: Record<string, WorkflowExecution> = {
    "exec1": {
      id: "exec1",
      workflow_id: "wf1",
      status: "completed",
      start_time: "2023-04-15T09:00:00Z",
      end_time: "2023-04-15T09:01:30Z",
      step_executions: [
        {
          id: "stepexec1",
          step_id: "step1",
          step_name: "生成内容",
          status: "completed",
          start_time: "2023-04-15T09:00:00Z",
          end_time: "2023-04-15T09:00:45Z",
          output: {
            content: "今天给大家分享一套春季穿搭...",
            length: 820,
          },
        },
        {
          id: "stepexec2",
          step_id: "step2",
          step_name: "内容分析",
          status: "completed",
          start_time: "2023-04-15T09:00:45Z",
          end_time: "2023-04-15T09:01:00Z",
          output: {
            readabilityScore: 85,
            seoScore: 78,
            keywords: ["春季", "穿搭", "时尚"],
          },
        },
        {
          id: "stepexec3",
          step_id: "step3",
          step_name: "内容优化",
          status: "completed",
          start_time: "2023-04-15T09:01:00Z",
          end_time: "2023-04-15T09:01:15Z",
          output: {
            optimizedContent: "今天给大家分享一套春季穿搭...",
            improvements: ["增加关键词密度", "优化标题"],
          },
        },
        {
          id: "stepexec4",
          step_id: "step4",
          step_name: "发布到小红书",
          status: "completed",
          start_time: "2023-04-15T09:01:15Z",
          end_time: "2023-04-15T09:01:30Z",
          output: {
            postId: "xhs123456",
            url: "https://xiaohongshu.com/post/123456",
          },
        },
      ],
      output: {
        postId: "xhs123456",
        url: "https://xiaohongshu.com/post/123456",
      },
      logs: [
        {
          id: "log1",
          timestamp: "2023-04-15T09:00:00Z",
          level: "info",
          message: "工作流开始执行",
        },
        {
          id: "log2",
          timestamp: "2023-04-15T09:00:45Z",
          level: "info",
          message: "内容生成完成",
        },
        {
          id: "log3",
          timestamp: "2023-04-15T09:01:30Z",
          level: "info",
          message: "工作流执行完成",
        },
      ],
    },
    "exec2": {
      id: "exec2",
      workflow_id: "wf1",
      status: "failed",
      start_time: "2023-04-14T09:00:00Z",
      end_time: "2023-04-14T09:00:30Z",
      step_executions: [
        {
          id: "stepexec5",
          step_id: "step1",
          step_name: "生成内容",
          status: "completed",
          start_time: "2023-04-14T09:00:00Z",
          end_time: "2023-04-14T09:00:15Z",
          output: {
            content: "今天给大家分享一套春季穿搭...",
            length: 750,
          },
        },
        {
          id: "stepexec6",
          step_id: "step2",
          step_name: "内容分析",
          status: "failed",
          start_time: "2023-04-14T09:00:15Z",
          end_time: "2023-04-14T09:00:30Z",
          error: "分析服务暂时不可用",
        },
      ],
      error: "步骤 'step2' 执行失败: 分析服务暂时不可用",
      logs: [
        {
          id: "log4",
          timestamp: "2023-04-14T09:00:00Z",
          level: "info",
          message: "工作流开始执行",
        },
        {
          id: "log5",
          timestamp: "2023-04-14T09:00:15Z",
          level: "info",
          message: "内容生成完成",
        },
        {
          id: "log6",
          timestamp: "2023-04-14T09:00:30Z",
          level: "error",
          message: "分析服务暂时不可用",
        },
      ],
    }
  }

  // 返回指定ID的执行记录
  return executions[executionId] || null
}

// 模拟API调用 - 获取工作流模板列表
export async function getWorkflowTemplates(): Promise<WorkflowTemplate[]> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 800))

  // 返回模拟数据
  return workflowTemplates
}

// 模拟API调用 - 创建工作流模板
export async function createWorkflowTemplate(
  template: Omit<WorkflowTemplate, "id" | "createdAt" | "updatedAt">,
): Promise<WorkflowTemplate> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 创建新模板
  const newTemplate: WorkflowTemplate = {
    ...template,
    id: `template${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return newTemplate
}

// 模拟API调用 - 更新工作流模板
export async function updateWorkflowTemplate(
  id: string,
  updates: Partial<Omit<WorkflowTemplate, "id" | "createdAt" | "updatedAt">>,
): Promise<WorkflowTemplate> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 800))

  // 获取模板
  const template = workflowTemplates.find((t) => t.id === id)

  if (!template) {
    throw new Error(`模板不存在: ${id}`)
  }

  // 更新模板
  const updatedTemplate: WorkflowTemplate = {
    ...template,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  return updatedTemplate
}

// 模拟API调用 - 删除工作流模板
export async function deleteWorkflowTemplate(id: string): Promise<void> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 800))

  // 在实际应用中，这里会调用API删除模板
  console.log(`删除模板: ${id}`)
}

// 模拟API调用 - 收藏工作流模板
export async function favoriteWorkflowTemplate(id: string): Promise<void> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 在实际应用中，这里会调用API收藏模板
  console.log(`收藏模板: ${id}`)
}

// 模拟API调用 - 取消收藏工作流模板
export async function unfavoriteWorkflowTemplate(id: string): Promise<void> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 在实际应用中，这里会调用API取消收藏模板
  console.log(`取消收藏模板: ${id}`)
}

// 模拟API调用 - 从模板创建工作流
export async function createWorkflowFromTemplate(templateId: string): Promise<Workflow> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 获取模板
  const template = workflowTemplates.find((t) => t.id === templateId)

  if (!template) {
    throw new Error(`模板不存在: ${templateId}`)
  }

  // 创建新工作流
  const newWorkflow: Workflow = {
    id: `wf${Date.now()}`,
    name: `${template.name} (从模板创建)`,
    description: template.description,
    trigger: template.trigger,
    steps: template.steps,
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stats: {
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      averageDuration: 0,
    },
  }

  return newWorkflow
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertCircle,
  Calendar,
  Check,
  Clock,
  Copy,
  Edit,
  Filter,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import PageBackground from "../components/page-background"
import DashboardHeader from "../components/dashboard-header"
import WorkflowEditor from "../components/workflow-editor"
import {
  type Workflow,
  getWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  executeWorkflow,
  workflowTemplates,
} from "../utils/workflow-service"

export default function WorkflowPage() {
  // 状态
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [showFilters, setShowFilters] = useState(false)

  // 编辑器状态
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | undefined>(undefined)

  // 模板选择状态
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)

  // 错误状态
  const [error, setError] = useState<string | null>(null)

  // 加载工作流
  const loadWorkflows = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getWorkflows()
      setWorkflows(data)
      setFilteredWorkflows(data)
    } catch (err) {
      setError("加载工作流失败")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadWorkflows()
  }, [])

  // 过滤工作流
  useEffect(() => {
    let filtered = [...workflows]

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(
        (workflow) =>
          workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workflow.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // 状态过滤
    if (statusFilter !== "all") {
      filtered = filtered.filter((workflow) => (statusFilter === "active" ? workflow.isActive : !workflow.isActive))
    }

    setFilteredWorkflows(filtered)
  }, [workflows, searchTerm, statusFilter])

  // 创建工作流
  const handleCreateWorkflow = async (workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">) => {
    try {
      await createWorkflow(workflow)
      setIsEditorOpen(false)
      loadWorkflows()
    } catch (err) {
      setError("创建工作流失败")
      console.error(err)
    }
  }

  // 更新工作流
  const handleUpdateWorkflow = async (workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">) => {
    if (!editingWorkflow) return

    try {
      await updateWorkflow(editingWorkflow.id, workflow)
      setIsEditorOpen(false)
      setEditingWorkflow(undefined)
      loadWorkflows()
    } catch (err) {
      setError("更新工作流失败")
      console.error(err)
    }
  }

  // 删除工作流
  const handleDeleteWorkflow = async (id: string) => {
    if (!confirm("确定要删除此工作流吗？此操作不可撤销。")) return

    try {
      await deleteWorkflow(id)
      loadWorkflows()
    } catch (err) {
      setError("删除工作流失败")
      console.error(err)
    }
  }

  // 执行工作流
  const handleExecuteWorkflow = async (id: string) => {
    try {
      await executeWorkflow(id)
      alert("工作流已开始执行")
      loadWorkflows()
    } catch (err) {
      setError("执行工作流失败")
      console.error(err)
    }
  }

  // 复制工作流
  const handleDuplicateWorkflow = async (workflow: Workflow) => {
    try {
      const { id, createdAt, updatedAt, lastRun, nextRun, stats, ...rest } = workflow
      const newWorkflow = {
        ...rest,
        name: `${workflow.name} (复制)`,
        isActive: false,
      }

      await createWorkflow(newWorkflow)
      loadWorkflows()
    } catch (err) {
      setError("复制工作流失败")
      console.error(err)
    }
  }

  // 切换工作流状态
  const handleToggleWorkflowStatus = async (id: string, isActive: boolean) => {
    try {
      await updateWorkflow(id, { isActive })
      loadWorkflows()
    } catch (err) {
      setError("更新工作流状态失败")
      console.error(err)
    }
  }

  // 从模板创建工作流
  const handleCreateFromTemplate = (templateId: string) => {
    const template = workflowTemplates.find((t) => t.id === templateId)
    if (!template) return

    setIsTemplateDialogOpen(false)
    setEditingWorkflow(undefined)
    setIsEditorOpen(true)

    // 使用模板数据预填充编辑器
    const { id, ...templateData } = template
    setEditingWorkflow({
      ...templateData,
      id: "",
      createdAt: "",
      updatedAt: "",
      isActive: false,
    } as Workflow)
  }

  // 编辑工作流
  const handleEditWorkflow = async (id: string) => {
    try {
      const workflow = await getWorkflow(id)
      if (workflow) {
        setEditingWorkflow(workflow)
        setIsEditorOpen(true)
      }
    } catch (err) {
      setError("加载工作流详情失败")
      console.error(err)
    }
  }

  return (
    <PageBackground image="/images/bg-wave-purple.jpeg">
      <DashboardHeader />

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">自动化工作流</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">创建和管理自动化内容创作和发布流程</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsTemplateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  从模板创建
                </Button>
                <Button
                  onClick={() => {
                    setEditingWorkflow(undefined)
                    setIsEditorOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  创建工作流
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>错误</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="搜索工作流..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  筛选
                </Button>
              </div>

              {showFilters && (
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    全部
                  </Button>
                  <Button
                    variant={statusFilter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("active")}
                  >
                    已启用
                  </Button>
                  <Button
                    variant={statusFilter === "inactive" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("inactive")}
                  >
                    已禁用
                  </Button>
                </div>
              )}
            </div>

            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">
                  所有工作流{" "}
                  <Badge variant="secondary" className="ml-2">
                    {filteredWorkflows.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="scheduled">
                  定时触发{" "}
                  <Badge variant="secondary" className="ml-2">
                    {filteredWorkflows.filter((w) => w.trigger.type === "schedule").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="event">
                  事件触发{" "}
                  <Badge variant="secondary" className="ml-2">
                    {filteredWorkflows.filter((w) => w.trigger.type === "event").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="manual">
                  手动触发{" "}
                  <Badge variant="secondary" className="ml-2">
                    {filteredWorkflows.filter((w) => w.trigger.type === "manual" || w.trigger.type === "api").length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <WorkflowList
                  workflows={filteredWorkflows}
                  isLoading={isLoading}
                  onEdit={handleEditWorkflow}
                  onDelete={handleDeleteWorkflow}
                  onExecute={handleExecuteWorkflow}
                  onDuplicate={handleDuplicateWorkflow}
                  onToggleStatus={handleToggleWorkflowStatus}
                />
              </TabsContent>

              <TabsContent value="scheduled">
                <WorkflowList
                  workflows={filteredWorkflows.filter((w) => w.trigger.type === "schedule")}
                  isLoading={isLoading}
                  onEdit={handleEditWorkflow}
                  onDelete={handleDeleteWorkflow}
                  onExecute={handleExecuteWorkflow}
                  onDuplicate={handleDuplicateWorkflow}
                  onToggleStatus={handleToggleWorkflowStatus}
                />
              </TabsContent>

              <TabsContent value="event">
                <WorkflowList
                  workflows={filteredWorkflows.filter((w) => w.trigger.type === "event")}
                  isLoading={isLoading}
                  onEdit={handleEditWorkflow}
                  onDelete={handleDeleteWorkflow}
                  onExecute={handleExecuteWorkflow}
                  onDuplicate={handleDuplicateWorkflow}
                  onToggleStatus={handleToggleWorkflowStatus}
                />
              </TabsContent>

              <TabsContent value="manual">
                <WorkflowList
                  workflows={filteredWorkflows.filter((w) => w.trigger.type === "manual" || w.trigger.type === "api")}
                  isLoading={isLoading}
                  onEdit={handleEditWorkflow}
                  onDelete={handleDeleteWorkflow}
                  onExecute={handleExecuteWorkflow}
                  onDuplicate={handleDuplicateWorkflow}
                  onToggleStatus={handleToggleWorkflowStatus}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* 工作流编辑器对话框 */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <WorkflowEditor
            workflow={editingWorkflow}
            onSave={editingWorkflow?.id ? handleUpdateWorkflow : handleCreateWorkflow}
            onCancel={() => {
              setIsEditorOpen(false)
              setEditingWorkflow(undefined)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* 模板选择对话框 */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">选择工作流模板</h2>
            <p className="text-gray-500">选择一个预设模板快速创建工作流</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {workflowTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:border-primary"
                  onClick={() => handleCreateFromTemplate(template.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Badge variant="outline">{getTriggerTypeName(template.trigger.type)}</Badge>
                      <span>•</span>
                      <span>{template.steps.length} 个步骤</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageBackground>
  )
}

// 工作流列表组件
interface WorkflowListProps {
  workflows: Workflow[]
  isLoading: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onExecute: (id: string) => void
  onDuplicate: (workflow: Workflow) => void
  onToggleStatus: (id: string, isActive: boolean) => void
}

function WorkflowList({
  workflows,
  isLoading,
  onEdit,
  onDelete,
  onExecute,
  onDuplicate,
  onToggleStatus,
}: WorkflowListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (workflows.length === 0) {
    return (
      <div className="text-center p-12 border border-dashed rounded-lg">
        <p className="text-gray-500 mb-4">暂无工作流</p>
        <Button variant="outline" onClick={() => {}}>
          创建工作流
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>工作流名称</TableHead>
            <TableHead>触发方式</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>上次执行</TableHead>
            <TableHead>下次执行</TableHead>
            <TableHead>执行统计</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.map((workflow) => (
            <TableRow key={workflow.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{workflow.name}</div>
                  <div className="text-sm text-gray-500">{workflow.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getTriggerTypeName(workflow.trigger.type)}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${workflow.isActive ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <span>{workflow.isActive ? "已启用" : "已禁用"}</span>
                </div>
              </TableCell>
              <TableCell>
                {workflow.lastRun ? (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span>{formatDate(workflow.lastRun)}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </TableCell>
              <TableCell>
                {workflow.nextRun ? (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <span>{formatDate(workflow.nextRun)}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </TableCell>
              <TableCell>
                {workflow.stats ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>成功率</span>
                      <span>
                        {Math.round((workflow.stats.successfulRuns / Math.max(workflow.stats.totalRuns, 1)) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(workflow.stats.successfulRuns / Math.max(workflow.stats.totalRuns, 1)) * 100}
                      className="h-1"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>总运行: {workflow.stats.totalRuns}</span>
                      <span>平均耗时: {formatDuration(workflow.stats.averageDuration)}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500">无数据</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onExecute(workflow.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      执行
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(workflow.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(workflow)}>
                      <Copy className="h-4 w-4 mr-2" />
                      复制
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(workflow.id, !workflow.isActive)}>
                      {workflow.isActive ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          禁用
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          启用
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete(workflow.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// 获取触发器类型名称
function getTriggerTypeName(type: string): string {
  const typeNames: Record<string, string> = {
    schedule: "定时触发",
    event: "事件触发",
    manual: "手动触发",
    api: "API触发",
  }

  return typeNames[type] || type
}

// 格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// 格式化持续时间
function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}毫秒`
  } else if (milliseconds < 60000) {
    return `${Math.round(milliseconds / 1000)}秒`
  } else {
    return `${Math.round(milliseconds / 60000)}分钟`
  }
}

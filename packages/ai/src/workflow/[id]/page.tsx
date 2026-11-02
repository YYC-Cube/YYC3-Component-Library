"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowLeft, Check, Edit, Play, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import PageBackground from "../../components/page-background"
import DashboardHeader from "../../components/dashboard-header"
import {
  type Workflow,
  type WorkflowExecution,
  getWorkflow,
  getWorkflowExecutions,
  updateWorkflow,
  executeWorkflow,
} from "../../utils/workflow-service"

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })
}

// Helper function to get trigger type name
const getTriggerTypeName = (triggerType: string): string => {
  switch (triggerType) {
    case "cron":
      return "定时任务"
    case "webhook":
      return "Webhook"
    default:
      return "未知"
  }
}

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  // 状态
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExecutionsLoading, setIsExecutionsLoading] = useState(true)

  // 编辑器状态
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  // 错误状态
  const [error, setError] = useState<string | null>(null)

  // 加载工作流
  const loadWorkflow = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getWorkflow(id)
      setWorkflow(data)
    } catch (err) {
      setError("加载工作流失败")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // 加载执行历史
  const loadExecutions = async () => {
    setIsExecutionsLoading(true)

    try {
      const data = await getWorkflowExecutions(id)
      setExecutions(data)
    } catch (err) {
      console.error("加载执行历史失败", err)
    } finally {
      setIsExecutionsLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadWorkflow()
    loadExecutions()
  }, [id])

  // 更新工作流
  const handleUpdateWorkflow = async (workflowData: Omit<Workflow, "id" | "createdAt" | "updatedAt">) => {
    try {
      await updateWorkflow(id, workflowData)
      setIsEditorOpen(false)
      loadWorkflow()
    } catch (err) {
      setError("更新工作流失败")
      console.error(err)
    }
  }

  // 执行工作流
  const handleExecuteWorkflow = async () => {
    try {
      await executeWorkflow(id)
      alert("工作流已开始执行")
      // 短暂延迟后重新加载执行历史
      setTimeout(() => {
        loadWorkflow()
        loadExecutions()
      }, 1000)
    } catch (err) {
      setError("执行工作流失败")
      console.error(err)
    }
  }

  // 切换工作流状态
  const handleToggleWorkflowStatus = async () => {
    if (!workflow) return

    try {
      await updateWorkflow(id, { isActive: !workflow.isActive })
      loadWorkflow()
    } catch (err) {
      setError("更新工作流状态失败")
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <PageBackground image="/images/bg-wave-purple.jpeg">
        <DashboardHeader />

        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
              <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回
              </Button>

              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>

            <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
              <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </main>
      </PageBackground>
    )
  }

  if (!workflow) {
    return (
      <PageBackground image="/images/bg-wave-purple.jpeg">
        <DashboardHeader />

        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
              <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回
              </Button>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">工作流不存在</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">找不到指定的工作流</p>
            </div>

            <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>错误</AlertTitle>
                <AlertDescription>找不到ID为 {id} 的工作流</AlertDescription>
              </Alert>

              <Button className="mt-4" onClick={() => router.push("/workflow")}>
                返回工作流列表
              </Button>
            </div>
          </div>
        </main>
      </PageBackground>
    )
  }

  return (
    <PageBackground image="/images/bg-wave-purple.jpeg">
      <DashboardHeader />

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回
                </Button>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{workflow.name}</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{workflow.description}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleToggleWorkflowStatus}>
                  {workflow.isActive ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      禁用
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      启用
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsEditorOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  编辑
                </Button>
                <Button onClick={handleExecuteWorkflow}>
                  <Play className="mr-2 h-4 w-4" />
                  执行
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

            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="executions">执行历史</TabsTrigger>
                <TabsTrigger value="steps">步骤详情</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">工作流状态</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${workflow.isActive ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        <span className="text-lg font-medium">{workflow.isActive ? "已启用" : "已禁用"}</span>
                      </div>

                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">创建时间</span>
                          <span>{formatDate(workflow.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">最后更新</span>
                          <span>{formatDate(workflow.updatedAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">触发方式</span>
                          <Badge variant="outline">{getTriggerTypeName(workflow.trigger.type)}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="executions">
                {isExecutionsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : executions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">执行ID</th>
                          <th className="px-4 py-2 text-left">状态</th>
                          <th className="px-4 py-2 text-left">开始时间</th>
                          <th className="px-4 py-2 text-left">结束时间</th>
                          <th className="px-4 py-2 text-left">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {executions.map((execution) => (
                          <tr key={execution.id} className="border-b">
                            <td className="px-4 py-2">{execution.id}</td>
                            <td className="px-4 py-2">
                              <Badge
                                variant={
                                  execution.status === "completed"
                                    ? "success"
                                    : execution.status === "failed"
                                      ? "destructive"
                                      : "default"
                                }
                              >
                                {execution.status === "completed"
                                  ? "已完成"
                                  : execution.status === "failed"
                                    ? "失败"
                                    : execution.status === "running"
                                      ? "运行中"
                                      : execution.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-2">{formatDate(execution.startTime)}</td>
                            <td className="px-4 py-2">{execution.endTime ? formatDate(execution.endTime) : "-"}</td>
                            <td className="px-4 py-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/workflow/${id}/execution/${execution.id}`)}
                              >
                                查看详情
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">暂无执行记录</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="steps">
                {workflow.steps && workflow.steps.length > 0 ? (
                  <div className="space-y-4">
                    {workflow.steps.map((step, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            步骤 {index + 1}: {step.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">配置:</h4>
                            <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md overflow-x-auto">
                              {JSON.stringify(step.config, null, 2)}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">暂无步骤信息</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </PageBackground>
  )
}

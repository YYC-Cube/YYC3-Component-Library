"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react"
import PageBackground from "../../../../components/page-background"
import DashboardHeader from "../../../../components/dashboard-header"
// 更新导入路径，使用新的API服务和类型
import { getWorkflowExecution } from "@/lib/services/workflow-api-service"
import type { WorkflowExecution } from "@/lib/types/workflow-types"
import {
  createError,
  formatErrorMessage,
  getUserFriendlyErrorMessage,
  type ErrorDetails,
} from "@/lib/services/error-service"

export default function WorkflowExecutionDetailPage({
  params,
}: {
  params: { id: string; executionId: string }
}) {
  const router = useRouter()
  const { id, executionId } = params

  // 状态
  const [execution, setExecution] = useState<WorkflowExecution | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ErrorDetails | null>(null)

  // 加载执行详情
  const loadExecution = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getWorkflowExecution(executionId)

      if (!data) {
        setError(createError("workflow_not_found", `找不到ID为 ${executionId} 的工作流执行记录`, { code: "NOT_FOUND" }))
        return
      }

      setExecution(data)
    } catch (err) {
      const errorDetails = createError("api_error", "加载工作流执行详情失败", {
        code: "LOAD_FAILED",
        details: { originalError: err },
      })
      setError(errorDetails)
      console.error("加载工作流执行详情错误:", errorDetails)
    } finally {
      setIsLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadExecution()
  }, [executionId])

  // 计算执行进度
  const calculateProgress = () => {
    if (!execution || !execution.step_executions || execution.step_executions.length === 0) return 0

    const totalSteps = execution.step_executions.length
    const completedSteps = execution.step_executions.filter(
      (step) => step.status === "completed" || step.status === "failed",
    ).length

    return Math.round((completedSteps / totalSteps) * 100)
  }

  // 计算执行时间
  const calculateDuration = () => {
    if (!execution) return "0秒"

    const startTime = new Date(execution.start_time).getTime()
    const endTime = execution.end_time ? new Date(execution.end_time).getTime() : new Date().getTime()

    const durationMs = endTime - startTime

    if (durationMs < 1000) return `${durationMs}毫秒`
    if (durationMs < 60000) return `${Math.round(durationMs / 1000)}秒`
    if (durationMs < 3600000) return `${Math.round(durationMs / 60000)}分钟`
    return `${Math.round(durationMs / 3600000)}小时`
  }

  // 获取状态徽章变体
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "failed":
        return "destructive"
      case "running":
        return "default"
      case "pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "running":
      case "pending":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
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

  if (error) {
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

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">执行详情</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">查看工作流执行的详细信息</p>
            </div>

            <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>错误</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2">
                    <p>{formatErrorMessage(error)}</p>
                    <p className="text-sm opacity-80">{getUserFriendlyErrorMessage(error)}</p>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="mt-6 flex gap-4">
                <Button onClick={loadExecution}>重试</Button>
                <Button variant="outline" onClick={() => router.push(`/workflow/${id}`)}>
                  返回工作流详情
                </Button>
              </div>
            </div>
          </div>
        </main>
      </PageBackground>
    )
  }

  if (!execution) {
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

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">执行详情不存在</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">找不到指定的执行记录</p>
            </div>

            <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>错误</AlertTitle>
                <AlertDescription>找不到ID为 {executionId} 的执行记录</AlertDescription>
              </Alert>

              <Button className="mt-4" onClick={() => router.push(`/workflow/${id}`)}>
                返回工作流详情
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
            <Button variant="ghost" onClick={() => router.push(`/workflow/${id}`)} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回工作流详情
            </Button>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">执行详情</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">查看工作流执行的详细信息</p>
          </div>

          <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(execution.status)}
                  <Badge variant={getStatusBadgeVariant(execution.status)}>
                    {execution.status === "completed"
                      ? "已完成"
                      : execution.status === "failed"
                        ? "失败"
                        : execution.status === "running"
                          ? "运行中"
                          : execution.status === "pending"
                            ? "等待中"
                            : "已取消"}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">执行时间: {calculateDuration()}</div>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">执行进度</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={calculateProgress()} className="h-2" />
                  <div className="mt-2 text-right text-sm text-gray-500">{calculateProgress()}%</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">开始时间</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{formatDate(execution.start_time)}</p>
                </CardContent>
              </Card>

              {execution.end_time && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">结束时间</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{formatDate(execution.end_time)}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <Tabs defaultValue="steps" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="steps">步骤执行</TabsTrigger>
                {execution.logs && execution.logs.length > 0 && <TabsTrigger value="logs">执行日志</TabsTrigger>}
                {execution.output && <TabsTrigger value="output">执行结果</TabsTrigger>}
              </TabsList>

              <TabsContent value="steps">
                <div className="space-y-4">
                  {execution.step_executions.map((step) => (
                    <Card key={step.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{step.step_name}</CardTitle>
                          <Badge variant={getStatusBadgeVariant(step.status)}>
                            {step.status === "completed"
                              ? "已完成"
                              : step.status === "failed"
                                ? "失败"
                                : step.status === "running"
                                  ? "运行中"
                                  : "等待中"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {step.start_time && (
                              <div>
                                <p className="text-sm text-gray-500">开始时间</p>
                                <p>{formatDate(step.start_time)}</p>
                              </div>
                            )}
                            {step.end_time && (
                              <div>
                                <p className="text-sm text-gray-500">结束时间</p>
                                <p>{formatDate(step.end_time)}</p>
                              </div>
                            )}
                          </div>

                          {step.output && (
                            <div>
                              <p className="text-sm text-gray-500 mb-1">输出</p>
                              <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-60 dark:bg-gray-900 dark:text-gray-300">
                                {JSON.stringify(step.output, null, 2)}
                              </pre>
                            </div>
                          )}

                          {step.error && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>错误</AlertTitle>
                              <AlertDescription>{step.error}</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {execution.logs && execution.logs.length > 0 && (
                <TabsContent value="logs">
                  <Card>
                    <CardHeader>
                      <CardTitle>执行日志</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96 dark:bg-gray-900 dark:text-gray-300">
                        {execution.logs.map((log) => (
                          <div key={log.id} className="mb-2">
                            <span className="text-gray-500 text-xs">{formatDate(log.timestamp)}</span>
                            <span
                              className={`mx-2 px-1.5 py-0.5 rounded text-xs ${
                                log.level === "error"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  : log.level === "warn"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : log.level === "info"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {log.level}
                            </span>
                            <span className="text-sm">{log.message}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {execution.output && (
                <TabsContent value="output">
                  <Card>
                    <CardHeader>
                      <CardTitle>执行结果</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96 dark:bg-gray-900 dark:text-gray-300">
                        {JSON.stringify(execution.output, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>

            {execution.error && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>执行错误</AlertTitle>
                <AlertDescription>{execution.error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </main>
    </PageBackground>
  )
}

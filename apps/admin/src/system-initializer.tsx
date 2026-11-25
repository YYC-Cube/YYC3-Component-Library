"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@yyc3/ui/card"
import { Progress } from "@yyc3/ui/progress"
import { Button } from "@yyc3/ui/button"
import { localDB, databaseSeeder } from "@yyc3/lib/local-database"
import { Database, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

interface InitStep {
  id: string
  name: string
  status: "pending" | "running" | "completed" | "error"
  progress: number
  error?: string
}

export function SystemInitializer() {
  const [steps, setSteps] = useState<InitStep[]>([
    { id: "database", name: "初始化本地数据库", status: "pending", progress: 0 },
    { id: "seed", name: "加载示例数据", status: "pending", progress: 0 },
    { id: "services", name: "启动系统服务", status: "pending", progress: 0 },
    { id: "ui", name: "准备用户界面", status: "pending", progress: 0 },
  ])

  const [currentStep, setCurrentStep] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [initError, setInitError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    initializeSystem()
  }, [])

  const updateStep = (stepId: string, updates: Partial<InitStep>) => {
    setSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, ...updates } : step)))
  }

  const initializeSystem = async () => {
    try {
      setInitError(null)

      // 步骤1: 初始化数据库
      setCurrentStep(0)
      updateStep("database", { status: "running", progress: 0 })

      await localDB.init()

      // 模拟进度更新
      for (let i = 0; i <= 100; i += 20) {
        updateStep("database", { progress: i })
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      updateStep("database", { status: "completed", progress: 100 })
      setOverallProgress(25)

      // 步骤2: 加载示例数据
      setCurrentStep(1)
      updateStep("seed", { status: "running", progress: 0 })

      // 检查是否已有数据
      const customerCount = await localDB.count("customers")

      if (customerCount === 0) {
        await databaseSeeder.seedDatabase()
      }

      for (let i = 0; i <= 100; i += 25) {
        updateStep("seed", { progress: i })
        await new Promise((resolve) => setTimeout(resolve, 150))
      }

      updateStep("seed", { status: "completed", progress: 100 })
      setOverallProgress(50)

      // 步骤3: 启动系统服务
      setCurrentStep(2)
      updateStep("services", { status: "running", progress: 0 })

      // 初始化各种服务
      await initializeServices()

      for (let i = 0; i <= 100; i += 33) {
        updateStep("services", { progress: i })
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      updateStep("services", { status: "completed", progress: 100 })
      setOverallProgress(75)

      // 步骤4: 准备用户界面
      setCurrentStep(3)
      updateStep("ui", { status: "running", progress: 0 })

      // 预加载资源和组件
      await prepareUserInterface()

      for (let i = 0; i <= 100; i += 50) {
        updateStep("ui", { progress: i })
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      updateStep("ui", { status: "completed", progress: 100 })
      setOverallProgress(100)

      // 等待一下让用户看到完成状态
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 发送初始化完成事件
      window.dispatchEvent(new CustomEvent("appServicesReady"))
    } catch (error) {
      console.error("系统初始化失败:", error)
      const errorMessage = error instanceof Error ? error.message : "未知错误"

      setInitError(errorMessage)
      updateStep(steps[currentStep]?.id, {
        status: "error",
        error: errorMessage,
      })

      window.dispatchEvent(
        new CustomEvent("appServicesError", {
          detail: { error: errorMessage },
        }),
      )
    }
  }

  const initializeServices = async () => {
    // 初始化通知服务
    if ("Notification" in window) {
      await Notification.requestPermission()
    }

    // 初始化其他服务
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  const prepareUserInterface = async () => {
    // 预加载关键资源
    await new Promise((resolve) => setTimeout(resolve, 200))
  }

  const handleRetry = () => {
    setIsRetrying(true)
    setSteps((prev) =>
      prev.map((step) => ({
        ...step,
        status: "pending",
        progress: 0,
        error: undefined,
      })),
    )
    setCurrentStep(0)
    setOverallProgress(0)
    setInitError(null)

    setTimeout(() => {
      setIsRetrying(false)
      initializeSystem()
    }, 500)
  }

  const getStepIcon = (step: InitStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "running":
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">言语云企业管理系统</h1>
            <p className="text-gray-600">正在初始化系统，请稍候...</p>
          </div>

          {/* 总体进度 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">初始化进度</span>
              <span className="text-sm text-gray-500">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>

          {/* 详细步骤 */}
          <div className="space-y-4 mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4">
                {getStepIcon(step)}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`text-sm font-medium ${
                        step.status === "error"
                          ? "text-red-600"
                          : step.status === "completed"
                            ? "text-green-600"
                            : step.status === "running"
                              ? "text-blue-600"
                              : "text-gray-700"
                      }`}
                    >
                      {step.name}
                    </span>
                    <span className="text-xs text-gray-500">{step.progress}%</span>
                  </div>
                  <Progress value={step.progress} className={`h-2 ${step.status === "error" ? "bg-red-100" : ""}`} />
                  {step.error && <p className="text-xs text-red-600 mt-1">{step.error}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* 错误处理 */}
          {initError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">初始化失败</h4>
                  <p className="text-sm text-red-700 mt-1">{initError}</p>
                  <Button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    size="sm"
                    className="mt-3 bg-red-600 hover:bg-red-700"
                  >
                    {isRetrying ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        重试中...
                      </>
                    ) : (
                      "重试初始化"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 提示信息 */}
          <div className="text-center text-sm text-gray-500">
            <p>首次启动需要初始化本地数据库和加载示例数据</p>
            <p className="mt-1">这个过程只需要几秒钟时间</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowDown, ArrowUp, Clock, Plus, Save, Trash2, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type {
  Workflow,
  WorkflowStep,
  WorkflowTrigger,
  WorkflowTriggerType,
  ScheduleTriggerConfig,
  EventTriggerConfig,
  ManualTriggerConfig,
  ApiTriggerConfig,
  WorkflowStepType,
} from "@/app/utils/workflow-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WorkflowEditorProps {
  workflow?: Workflow
  onSave: (workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">) => Promise<void>
  onCancel: () => void
}

export default function WorkflowEditor({ workflow, onSave, onCancel }: WorkflowEditorProps) {
  // 工作流基本信息
  const [name, setName] = useState(workflow?.name || "")
  const [description, setDescription] = useState(workflow?.description || "")
  const [isActive, setIsActive] = useState(workflow?.isActive || false)

  // 触发器
  const [triggerType, setTriggerType] = useState<WorkflowTriggerType>(workflow?.trigger?.type || "manual")
  const [scheduleTrigger, setScheduleTrigger] = useState<ScheduleTriggerConfig>(
    (workflow?.trigger?.type === "schedule"
      ? workflow.trigger.config
      : {
          frequency: "daily",
          time: "09:00",
        }) as ScheduleTriggerConfig,
  )
  const [eventTrigger, setEventTrigger] = useState<EventTriggerConfig>(
    (workflow?.trigger?.type === "event"
      ? workflow.trigger.config
      : {
          eventType: "content_created",
        }) as EventTriggerConfig,
  )
  const [manualTrigger, setManualTrigger] = useState<ManualTriggerConfig>(
    (workflow?.trigger?.type === "manual"
      ? workflow.trigger.config
      : {
          requireApproval: false,
        }) as ManualTriggerConfig,
  )
  const [apiTrigger, setApiTrigger] = useState<ApiTriggerConfig>(
    (workflow?.trigger?.type === "api"
      ? workflow.trigger.config
      : {
          endpoint: "/api/workflows/trigger",
          method: "POST",
        }) as ApiTriggerConfig,
  )

  // 步骤
  const [steps, setSteps] = useState<WorkflowStep[]>(workflow?.steps || [])

  // 验证状态
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 当触发器类型改变时，更新触发器配置
  useEffect(() => {
    // 清除错误
    setErrors({})
  }, [triggerType])

  // 添加步骤
  const addStep = (type: WorkflowStepType) => {
    const newStep: WorkflowStep = {
      id: `step${Date.now()}`,
      type,
      name: getDefaultStepName(type),
      config: getDefaultStepConfig(type),
      position: steps.length,
      dependsOn: steps.length > 0 ? [steps[steps.length - 1].id] : [],
    }

    setSteps([...steps, newStep])
  }

  // 删除步骤
  const removeStep = (stepId: string) => {
    // 移除步骤
    const newSteps = steps.filter((step) => step.id !== stepId)

    // 更新依赖关系
    const updatedSteps = newSteps.map((step) => {
      if (step.dependsOn?.includes(stepId)) {
        // 找到被删除步骤的依赖
        const deletedStep = steps.find((s) => s.id === stepId)
        const newDependsOn = step.dependsOn.filter((id) => id !== stepId)

        // 添加被删除步骤的依赖
        if (deletedStep?.dependsOn) {
          deletedStep.dependsOn.forEach((id) => {
            if (!newDependsOn.includes(id)) {
              newDependsOn.push(id)
            }
          })
        }

        return {
          ...step,
          dependsOn: newDependsOn,
        }
      }
      return step
    })

    // 更新位置
    const reorderedSteps = updatedSteps.map((step, index) => ({
      ...step,
      position: index,
    }))

    setSteps(reorderedSteps)
  }

  // 移动步骤
  const moveStep = (stepId: string, direction: "up" | "down") => {
    const stepIndex = steps.findIndex((step) => step.id === stepId)
    if ((direction === "up" && stepIndex === 0) || (direction === "down" && stepIndex === steps.length - 1)) {
      return
    }

    const newSteps = [...steps]
    const targetIndex =
      direction === "up"
        ? stepIndex - 1
        : ((stepIndex + 1)[
            // 交换位置
            (newSteps[stepIndex], newSteps[targetIndex])
          ] = [newSteps[targetIndex], newSteps[stepIndex]])

    // 更新位置属性
    newSteps[stepIndex].position = stepIndex
    newSteps[targetIndex].position = targetIndex

    // 更新依赖关系
    const updatedSteps = newSteps.map((step) => {
      // 如果步骤依赖于移动的步骤，需要更新依赖
      if (step.dependsOn?.includes(stepId)) {
        // 如果步骤在移动的步骤之前，且方向是向上，移除依赖
        if (step.position < targetIndex && direction === "up") {
          return {
            ...step,
            dependsOn: step.dependsOn.filter((id) => id !== stepId),
          }
        }
      }

      // 如果步骤被移动的步骤依赖，且方向是向下，添加依赖
      if (newSteps[targetIndex].dependsOn?.includes(step.id) && direction === "down") {
        return {
          ...step,
          dependsOn: [...(step.dependsOn || []), stepId],
        }
      }

      return step
    })

    setSteps(updatedSteps)
  }

  // 更新步骤
  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setSteps(steps.map((step) => (step.id === stepId ? { ...step, ...updates } : step)))
  }

  // 更新步骤配置
  const updateStepConfig = (stepId: string, config: any) => {
    setSteps(steps.map((step) => (step.id === stepId ? { ...step, config: { ...step.config, ...config } } : step)))
  }

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // 验证基本信息
    if (!name.trim()) {
      newErrors.name = "工作流名称不能为空"
    }

    // 验证触发器
    if (triggerType === "schedule") {
      if (!scheduleTrigger.time) {
        newErrors.scheduleTime = "请设置执行时间"
      }
    } else if (triggerType === "event") {
      if (!eventTrigger.eventType) {
        newErrors.eventType = "请选择事件类型"
      }
    } else if (triggerType === "api") {
      if (!apiTrigger.endpoint) {
        newErrors.apiEndpoint = "请设置API端点"
      }
    }

    // 验证步骤
    if (steps.length === 0) {
      newErrors.steps = "请至少添加一个步骤"
    }

    steps.forEach((step, index) => {
      if (!step.name.trim()) {
        newErrors[`step_${index}_name`] = "步骤名称不能为空"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 保存工作流
  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    // 构建触发器
    let trigger: WorkflowTrigger

    switch (triggerType) {
      case "schedule":
        trigger = {
          type: "schedule",
          config: scheduleTrigger,
        }
        break
      case "event":
        trigger = {
          type: "event",
          config: eventTrigger,
        }
        break
      case "manual":
        trigger = {
          type: "manual",
          config: manualTrigger,
        }
        break
      case "api":
        trigger = {
          type: "api",
          config: apiTrigger,
        }
        break
      default:
        trigger = {
          type: "manual",
          config: {},
        }
    }

    // 构建工作流
    const newWorkflow: Omit<Workflow, "id" | "createdAt" | "updatedAt"> = {
      name,
      description,
      trigger,
      steps,
      isActive,
    }

    await onSave(newWorkflow)
  }

  const [activeTab, setActiveTab] = useState("triggers")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>工作流基本信息</CardTitle>
          <CardDescription>设置工作流的基本信息和触发条件</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">工作流名称</Label>
              <Input
                id="workflow-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入工作流名称"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workflow-description">描述</Label>
              <Textarea
                id="workflow-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="描述工作流的用途和功能"
                className="min-h-[80px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="workflow-active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="workflow-active">启用工作流</Label>
            </div>
          </div>

          <Separator />

          {/* 触发器设置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">触发条件</h3>

            <div className="space-y-2">
              <Label htmlFor="trigger-type">触发方式</Label>
              <Select value={triggerType} onValueChange={(value) => setTriggerType(value as WorkflowTriggerType)}>
                <SelectTrigger id="trigger-type">
                  <SelectValue placeholder="选择触发方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schedule">定时触发</SelectItem>
                  <SelectItem value="event">事件触发</SelectItem>
                  <SelectItem value="manual">手动触发</SelectItem>
                  <SelectItem value="api">API触发</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 定时触发配置 */}
            {triggerType === "schedule" && (
              <div className="space-y-4 p-4 border rounded-md">
                <div className="space-y-2">
                  <Label htmlFor="schedule-frequency">执行频率</Label>
                  <Select
                    value={scheduleTrigger.frequency}
                    onValueChange={(value) => setScheduleTrigger({ ...scheduleTrigger, frequency: value as any })}
                  >
                    <SelectTrigger id="schedule-frequency">
                      <SelectValue placeholder="选择执行频率" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">每天</SelectItem>
                      <SelectItem value="weekly">每周</SelectItem>
                      <SelectItem value="monthly">每月</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {scheduleTrigger.frequency === "weekly" && (
                  <div className="space-y-2">
                    <Label>执行日</Label>
                    <div className="flex flex-wrap gap-2">
                      {["周日", "周一", "周二", "周三", "周四", "周五", "周六"].map((day, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant={scheduleTrigger.days?.includes(index) ? "default" : "outline"}
                          className="h-8 px-3"
                          onClick={() => {
                            const days = scheduleTrigger.days || []
                            if (days.includes(index)) {
                              setScheduleTrigger({
                                ...scheduleTrigger,
                                days: days.filter((d) => d !== index),
                              })
                            } else {
                              setScheduleTrigger({
                                ...scheduleTrigger,
                                days: [...days, index],
                              })
                            }
                          }}
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {scheduleTrigger.frequency === "monthly" && (
                  <div className="space-y-2">
                    <Label>执行日期</Label>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                        <Button
                          key={date}
                          type="button"
                          variant={scheduleTrigger.dates?.includes(date) ? "default" : "outline"}
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            const dates = scheduleTrigger.dates || []
                            if (dates.includes(date)) {
                              setScheduleTrigger({
                                ...scheduleTrigger,
                                dates: dates.filter((d) => d !== date),
                              })
                            } else {
                              setScheduleTrigger({
                                ...scheduleTrigger,
                                dates: [...dates, date],
                              })
                            }
                          }}
                        >
                          {date}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {scheduleTrigger.frequency === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-cron">Cron表达式</Label>
                    <Input
                      id="custom-cron"
                      value={scheduleTrigger.customCron || ""}
                      onChange={(e) => setScheduleTrigger({ ...scheduleTrigger, customCron: e.target.value })}
                      placeholder="*/5 * * * *"
                    />
                    <p className="text-xs text-gray-500">使用标准cron表达式，例如：0 9 * * * 表示每天上午9点</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="schedule-time">执行时间</Label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="schedule-time"
                      type="time"
                      value={scheduleTrigger.time || ""}
                      onChange={(e) => setScheduleTrigger({ ...scheduleTrigger, time: e.target.value })}
                      className="pl-8"
                    />
                  </div>
                  {errors.scheduleTime && <p className="text-sm text-red-500">{errors.scheduleTime}</p>}
                </div>
              </div>
            )}

            {/* 事件触发配置 */}
            {triggerType === "event" && (
              <div className="space-y-4 p-4 border rounded-md">
                <div className="space-y-2">
                  <Label htmlFor="event-type">事件类型</Label>
                  <Select
                    value={eventTrigger.eventType}
                    onValueChange={(value) => setEventTrigger({ ...eventTrigger, eventType: value as any })}
                  >
                    <SelectTrigger id="event-type">
                      <SelectValue placeholder="选择事件类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="content_created">内容创建</SelectItem>
                      <SelectItem value="content_updated">内容更新</SelectItem>
                      <SelectItem value="comment_received">收到评论</SelectItem>
                      <SelectItem value="mention_received">收到提及</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.eventType && <p className="text-sm text-red-500">{errors.eventType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-filters">事件过滤器</Label>
                  <Textarea
                    id="event-filters"
                    placeholder="输入JSON格式的过滤条件"
                    value={eventTrigger.filters ? JSON.stringify(eventTrigger.filters, null, 2) : ""}
                    onChange={(e) => {
                      try {
                        const filters = e.target.value ? JSON.parse(e.target.value) : undefined
                        setEventTrigger({ ...eventTrigger, filters })
                      } catch (error) {
                        // 忽略JSON解析错误
                      }
                    }}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">例如：{'{ "keywords": ["热点", "趋势"] }'}</p>
                </div>
              </div>
            )}

            {/* 手动触发配置 */}
            {triggerType === "manual" && (
              <div className="space-y-4 p-4 border rounded-md">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="require-approval"
                    checked={manualTrigger.requireApproval || false}
                    onCheckedChange={(checked) => setManualTrigger({ ...manualTrigger, requireApproval: checked })}
                  />
                  <Label htmlFor="require-approval">需要审批</Label>
                </div>

                {manualTrigger.requireApproval && (
                  <div className="space-y-2">
                    <Label htmlFor="approvers">审批人</Label>
                    <Input
                      id="approvers"
                      placeholder="输入审批人，多个用逗号分隔"
                      value={(manualTrigger.approvers || []).join(", ")}
                      onChange={(e) => {
                        const approvers = e.target.value
                          .split(",")
                          .map((a) => a.trim())
                          .filter(Boolean)
                        setManualTrigger({ ...manualTrigger, approvers })
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* API触发配置 */}
            {triggerType === "api" && (
              <div className="space-y-4 p-4 border rounded-md">
                <div className="space-y-2">
                  <Label htmlFor="api-endpoint">API端点</Label>
                  <Input
                    id="api-endpoint"
                    value={apiTrigger.endpoint}
                    onChange={(e) => setApiTrigger({ ...apiTrigger, endpoint: e.target.value })}
                    placeholder="/api/workflows/trigger/{id}"
                    className={errors.apiEndpoint ? "border-red-500" : ""}
                  />
                  {errors.apiEndpoint && <p className="text-sm text-red-500">{errors.apiEndpoint}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-method">请求方法</Label>
                  <Select
                    value={apiTrigger.method}
                    onValueChange={(value) => setApiTrigger({ ...apiTrigger, method: value as any })}
                  >
                    <SelectTrigger id="api-method">
                      <SelectValue placeholder="选择请求方法" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-headers">请求头</Label>
                  <Textarea
                    id="api-headers"
                    placeholder="输入JSON格式的请求头"
                    value={apiTrigger.headers ? JSON.stringify(apiTrigger.headers, null, 2) : ""}
                    onChange={(e) => {
                      try {
                        const headers = e.target.value ? JSON.parse(e.target.value) : undefined
                        setApiTrigger({ ...apiTrigger, headers })
                      } catch (error) {
                        // 忽略JSON解析错误
                      }
                    }}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">例如：{'{ "Authorization": "Bearer token" }'}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>工作流步骤</CardTitle>
              <CardDescription>配置工作流的执行步骤</CardDescription>
            </div>
            <Select onValueChange={(value) => addStep(value as WorkflowStepType)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="添加步骤" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="content_generation">内容生成</SelectItem>
                <SelectItem value="content_optimization">内容优化</SelectItem>
                <SelectItem value="content_analysis">内容分析</SelectItem>
                <SelectItem value="content_publishing">内容发布</SelectItem>
                <SelectItem value="notification">通知</SelectItem>
                <SelectItem value="data_collection">数据收集</SelectItem>
                <SelectItem value="conditional">条件判断</SelectItem>
                <SelectItem value="delay">延迟</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {errors.steps && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{errors.steps}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {steps.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-md">
                <p className="text-gray-500">请添加工作流步骤</p>
              </div>
            ) : (
              steps.map((step, index) => (
                <Card key={step.id} className="relative">
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => moveStep(step.id, "up")} disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveStep(step.id, "down")}
                      disabled={index === steps.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeStep(step.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getStepTypeName(step.type)}</Badge>
                      <Input
                        value={step.name}
                        onChange={(e) => updateStep(step.id, { name: e.target.value })}
                        placeholder="步骤名称"
                        className={`max-w-xs ${errors[`step_${index}_name`] ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors[`step_${index}_name`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`step_${index}_name`]}</p>
                    )}
                  </CardHeader>

                  <CardContent className="pb-2">
                    {/* 步骤依赖 */}
                    {index > 0 && (
                      <div className="mb-4">
                        <Label className="mb-2 block">依赖步骤</Label>
                        <div className="flex flex-wrap gap-2">
                          {steps.slice(0, index).map((prevStep) => (
                            <div key={prevStep.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`depends-${step.id}-${prevStep.id}`}
                                checked={step.dependsOn?.includes(prevStep.id) || false}
                                onChange={(e) => {
                                  const dependsOn = step.dependsOn || []
                                  if (e.target.checked) {
                                    updateStep(step.id, {
                                      dependsOn: [...dependsOn, prevStep.id],
                                    })
                                  } else {
                                    updateStep(step.id, {
                                      dependsOn: dependsOn.filter((id) => id !== prevStep.id),
                                    })
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <Label htmlFor={`depends-${step.id}-${prevStep.id}`} className="text-sm">
                                {prevStep.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 步骤配置 */}
                    <div className="space-y-4">{renderStepConfig(step, updateStepConfig)}</div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            保存工作流
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>工作流编辑器功能分析</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="triggers">触发器类型</TabsTrigger>
              <TabsTrigger value="steps">步骤类型</TabsTrigger>
              <TabsTrigger value="features">特色功能</TabsTrigger>
            </TabsList>

            <TabsContent value="triggers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">定时触发</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>支持每日、每周、每月执行</li>
                      <li>可选择具体执行时间</li>
                      <li>支持自定义Cron表达式</li>
                      <li>可选择每周具体执行日</li>
                      <li>可选择每月具体执行日期</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">事件触发</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>支持内容创建、更新事件</li>
                      <li>支持评论、提及事件</li>
                      <li>可配置JSON格式的事件过滤器</li>
                      <li>可根据关键词过滤事件</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">手动触发</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>支持直接手动执行</li>
                      <li>可配置审批流程</li>
                      <li>支持多人审批机制</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">API触发</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>自定义API端点</li>
                      <li>支持GET/POST请求方法</li>
                      <li>可配置自定义请求头</li>
                      <li>适合与第三方系统集成</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="steps" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">内容生成</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>支持多平台内容类型（小红书、微信等）</li>
                      <li>可配置内容主题和关键词</li>
                      <li>多种内容风格选择</li>
                      <li>可调整内容长度</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">内容优化</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>SEO优化</li>
                      <li>可读性优化</li>
                      <li>互动性优化</li>
                      <li>转化率优化</li>
                      <li>支持关键词配置</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">内容分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>可读性分析</li>
                      <li>SEO分析</li>
                      <li>情感分析</li>
                      <li>互动性分析</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">内容发布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>支持多平台发布（小红书、微信等）</li>
                      <li>标签管理</li>
                      <li>延迟发布功能</li>
                      <li>发布时间优化</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">其他步骤类型</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>通知（应用内、邮件、短信、Webhook）</li>
                      <li>数据收集（多平台数据源）</li>
                      <li>条件判断（多条件逻辑控制）</li>
                      <li>延迟（可配置延迟时间）</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">步骤依赖管理</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>可配置步骤间的依赖关系</li>
                      <li>自动处理依赖关系变更</li>
                      <li>支持多步骤依赖</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">步骤排序</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>支持上下移动步骤</li>
                      <li>自动更新步骤位置</li>
                      <li>自动调整依赖关系</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">表单验证</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>必填字段验证</li>
                      <li>类型特定验证</li>
                      <li>错误提示</li>
                      <li>保存前验证</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">用户体验优化</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>直观的卡片式界面</li>
                      <li>类型特定的配置选项</li>
                      <li>时间格式化显示</li>
                      <li>JSON编辑支持</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// 获取步骤类型名称
function getStepTypeName(type: WorkflowStepType): string {
  const typeNames: Record<WorkflowStepType, string> = {
    content_generation: "内容生成",
    content_optimization: "内容优化",
    content_analysis: "内容分析",
    content_publishing: "内容发布",
    notification: "通知",
    data_collection: "数据收集",
    conditional: "条件判断",
    delay: "延迟",
  }

  return typeNames[type] || type
}

// 获取默认步骤名称
function getDefaultStepName(type: WorkflowStepType): string {
  return `${getStepTypeName(type)}`
}

// 获取默认步骤配置
function getDefaultStepConfig(type: WorkflowStepType): any {
  switch (type) {
    case "content_generation":
      return {
        contentType: "xiaohongshu",
        prompt: "",
        style: "casual",
        length: 800,
      }
    case "content_optimization":
      return {
        optimizationType: "seo",
        keywords: [],
      }
    case "content_analysis":
      return {
        analysisTypes: ["readability", "seo"],
      }
    case "content_publishing":
      return {
        platform: "xiaohongshu",
        tags: [],
      }
    case "notification":
      return {
        notificationType: "app",
        template: "default",
      }
    case "data_collection":
      return {
        sources: ["weibo", "zhihu"],
        keywords: [],
      }
    case "conditional":
      return {
        conditions: [],
      }
    case "delay":
      return {
        duration: 3600, // 1小时
      }
    default:
      return {}
  }
}

// 渲染步骤配置
function renderStepConfig(step: WorkflowStep, updateConfig: (stepId: string, config: any) => void) {
  switch (step.type) {
    case "content_generation":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor={`${step.id}-content-type`}>内容类型</Label>
            <Select
              value={step.config.contentType}
              onValueChange={(value) => updateConfig(step.id, { contentType: value })}
            >
              <SelectTrigger id={`${step.id}-content-type`}>
                <SelectValue placeholder="选择内容类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xiaohongshu">小红书</SelectItem>
                <SelectItem value="wechat">微信公众号</SelectItem>
                <SelectItem value="douyin">抖音</SelectItem>
                <SelectItem value="weibo">微博</SelectItem>
                <SelectItem value="zhihu">知乎</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${step.id}-prompt`}>内容主题</Label>
            <Textarea
              id={`${step.id}-prompt`}
              value={step.config.prompt || ""}
              onChange={(e) => updateConfig(step.id, { prompt: e.target.value })}
              placeholder="输入内容主题或关键词"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${step.id}-style`}>内容风格</Label>
            <Select value={step.config.style} onValueChange={(value) => updateConfig(step.id, { style: value })}>
              <SelectTrigger id={`${step.id}-style`}>
                <SelectValue placeholder="选择内容风格" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">轻松活泼</SelectItem>
                <SelectItem value="professional">专业权威</SelectItem>
                <SelectItem value="emotional">情感共鸣</SelectItem>
                <SelectItem value="storytelling">故事叙述</SelectItem>
                <SelectItem value="persuasive">说服力强</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor={`${step.id}-length`}>内容长度</Label>
              <span className="text-sm text-gray-500">{step.config.length || 800}字</span>
            </div>
            <input
              id={`${step.id}-length`}
              type="range"
              min="300"
              max="2000"
              step="100"
              value={step.config.length || 800}
              onChange={(e) => updateConfig(step.id, { length: Number.parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </>
      )

    case "content_optimization":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor={`${step.id}-optimization-type`}>优化类型</Label>
            <Select
              value={step.config.optimizationType}
              onValueChange={(value) => updateConfig(step.id, { optimizationType: value })}
            >
              <SelectTrigger id={`${step.id}-optimization-type`}>
                <SelectValue placeholder="选择优化类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seo">SEO优化</SelectItem>
                <SelectItem value="readability">可读性优化</SelectItem>
                <SelectItem value="engagement">互动性优化</SelectItem>
                <SelectItem value="conversion">转化率优化</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${step.id}-keywords`}>关键词</Label>
            <Input
              id={`${step.id}-keywords`}
              value={(step.config.keywords || []).join(", ")}
              onChange={(e) => {
                const keywords = e.target.value
                  .split(",")
                  .map((k) => k.trim())
                  .filter(Boolean)
                updateConfig(step.id, { keywords })
              }}
              placeholder="输入关键词，多个用逗号分隔"
            />
          </div>
        </>
      )

    case "content_analysis":
      return (
        <>
          <div className="space-y-2">
            <Label>分析类型</Label>
            <div className="grid grid-cols-2 gap-2">
              {["readability", "seo", "sentiment", "engagement"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${step.id}-analysis-${type}`}
                    checked={(step.config.analysisTypes || []).includes(type)}
                    onChange={(e) => {
                      const analysisTypes = step.config.analysisTypes || []
                      if (e.target.checked) {
                        updateConfig(step.id, {
                          analysisTypes: [...analysisTypes, type],
                        })
                      } else {
                        updateConfig(step.id, {
                          analysisTypes: analysisTypes.filter((t) => t !== type),
                        })
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`${step.id}-analysis-${type}`} className="text-sm">
                    {getAnalysisTypeName(type)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </>
      )

    case "content_publishing":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor={`${step.id}-platform`}>发布平台</Label>
            <Select value={step.config.platform} onValueChange={(value) => updateConfig(step.id, { platform: value })}>
              <SelectTrigger id={`${step.id}-platform`}>
                <SelectValue placeholder="选择发布平台" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xiaohongshu">小红书</SelectItem>
                <SelectItem value="wechat">微信公众号</SelectItem>
                <SelectItem value="douyin">抖音</SelectItem>
                <SelectItem value="weibo">微博</SelectItem>
                <SelectItem value="zhihu">知乎</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${step.id}-tags`}>标签</Label>
            <Input
              id={`${step.id}-tags`}
              value={(step.config.tags || []).join(", ")}
              onChange={(e) => {
                const tags = e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                updateConfig(step.id, { tags })
              }}
              placeholder="输入标签，多个用逗号分隔"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id={`${step.id}-schedule`}
                checked={step.config.scheduleDelta !== undefined}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateConfig(step.id, { scheduleDelta: 3600 })
                  } else {
                    const { scheduleDelta, ...rest } = step.config
                    updateConfig(step.id, rest)
                  }
                }}
              />
              <Label htmlFor={`${step.id}-schedule`}>延迟发布</Label>
            </div>

            {step.config.scheduleDelta !== undefined && (
              <div className="space-y-2 mt-2">
                <Label htmlFor={`${step.id}-delay`}>延迟时间（秒）</Label>
                <Input
                  id={`${step.id}-delay`}
                  type="number"
                  value={step.config.scheduleDelta}
                  onChange={(e) => updateConfig(step.id, { scheduleDelta: Number.parseInt(e.target.value) })}
                  min="0"
                />
                <p className="text-xs text-gray-500">{formatDelay(step.config.scheduleDelta || 0)}</p>
              </div>
            )}
          </div>
        </>
      )

    case "notification":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor={`${step.id}-notification-type`}>通知类型</Label>
            <Select
              value={step.config.notificationType}
              onValueChange={(value) => updateConfig(step.id, { notificationType: value })}
            >
              <SelectTrigger id={`${step.id}-notification-type`}>
                <SelectValue placeholder="选择通知类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="app">应用内通知</SelectItem>
                <SelectItem value="email">邮件通知</SelectItem>
                <SelectItem value="sms">短信通知</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {step.config.notificationType === "email" && (
            <div className="space-y-2">
              <Label htmlFor={`${step.id}-recipients`}>收件人</Label>
              <Input
                id={`${step.id}-recipients`}
                value={(step.config.recipients || []).join(", ")}
                onChange={(e) => {
                  const recipients = e.target.value
                    .split(",")
                    .map((r) => r.trim())
                    .filter(Boolean)
                  updateConfig(step.id, { recipients })
                }}
                placeholder="输入邮箱地址，多个用逗号分隔"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`${step.id}-template`}>通知模板</Label>
            <Select value={step.config.template} onValueChange={(value) => updateConfig(step.id, { template: value })}>
              <SelectTrigger id={`${step.id}-template`}>
                <SelectValue placeholder="选择通知模板" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">默认模板</SelectItem>
                <SelectItem value="workflow_completed">工作流完成</SelectItem>
                <SelectItem value="content_published">内容已发布</SelectItem>
                <SelectItem value="error_notification">错误通知</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )

    case "data_collection":
      return (
        <>
          <div className="space-y-2">
            <Label>数据源</Label>
            <div className="grid grid-cols-2 gap-2">
              {["weibo", "zhihu", "baidu", "douyin", "xiaohongshu"].map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${step.id}-source-${source}`}
                    checked={(step.config.sources || []).includes(source)}
                    onChange={(e) => {
                      const sources = step.config.sources || []
                      if (e.target.checked) {
                        updateConfig(step.id, {
                          sources: [...sources, source],
                        })
                      } else {
                        updateConfig(step.id, {
                          sources: sources.filter((s) => s !== source),
                        })
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`${step.id}-source-${source}`} className="text-sm">
                    {getSourceName(source)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${step.id}-keywords`}>关键词</Label>
            <Input
              id={`${step.id}-keywords`}
              value={(step.config.keywords || []).join(", ")}
              onChange={(e) => {
                const keywords = e.target.value
                  .split(",")
                  .map((k) => k.trim())
                  .filter(Boolean)
                updateConfig(step.id, { keywords })
              }}
              placeholder="输入关键词，多个用逗号分隔"
            />
          </div>
        </>
      )

    case "conditional":
      return (
        <>
          <div className="space-y-4">
            <Label>条件</Label>
            {(step.config.conditions || []).map((condition: any, index: number) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                <Input
                  value={condition.field || ""}
                  onChange={(e) => {
                    const conditions = [...(step.config.conditions || [])]
                    conditions[index] = { ...conditions[index], field: e.target.value }
                    updateConfig(step.id, { conditions })
                  }}
                  placeholder="字段"
                  className="flex-1"
                />

                <Select
                  value={condition.operator || "equals"}
                  onValueChange={(value) => {
                    const conditions = [...(step.config.conditions || [])]
                    conditions[index] = { ...conditions[index], operator: value }
                    updateConfig(step.id, { conditions })
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="操作符" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">等于</SelectItem>
                    <SelectItem value="not_equals">不等于</SelectItem>
                    <SelectItem value="contains">包含</SelectItem>
                    <SelectItem value="greater_than">大于</SelectItem>
                    <SelectItem value="less_than">小于</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  value={condition.value || ""}
                  onChange={(e) => {
                    const conditions = [...(step.config.conditions || [])]
                    conditions[index] = { ...conditions[index], value: e.target.value }
                    updateConfig(step.id, { conditions })
                  }}
                  placeholder="值"
                  className="flex-1"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const conditions = [...(step.config.conditions || [])]
                    conditions.splice(index, 1)
                    updateConfig(step.id, { conditions })
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const conditions = [...(step.config.conditions || [])]
                conditions.push({ field: "", operator: "equals", value: "" })
                updateConfig(step.id, { conditions })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              添加条件
            </Button>
          </div>
        </>
      )

    case "delay":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor={`${step.id}-duration`}>延迟时间（秒）</Label>
            <Input
              id={`${step.id}-duration`}
              type="number"
              value={step.config.duration || 0}
              onChange={(e) => updateConfig(step.id, { duration: Number.parseInt(e.target.value) })}
              min="0"
            />
            <p className="text-xs text-gray-500">{formatDelay(step.config.duration || 0)}</p>
          </div>
        </>
      )

    default:
      return <p>未知步骤类型</p>
  }
}

// 获取分析类型名称
function getAnalysisTypeName(type: string): string {
  const typeNames: Record<string, string> = {
    readability: "可读性分析",
    seo: "SEO分析",
    sentiment: "情感分析",
    engagement: "互动性分析",
  }

  return typeNames[type] || type
}

// 获取数据源名称
function getSourceName(source: string): string {
  const sourceNames: Record<string, string> = {
    weibo: "微博",
    zhihu: "知乎",
    baidu: "百度",
    douyin: "抖音",
    xiaohongshu: "小红书",
  }

  return sourceNames[source] || source
}

// 格式化延迟时间
function formatDelay(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}秒`
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}分钟`
  } else if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}小时${seconds % 3600 > 0 ? ` ${Math.floor((seconds % 3600) / 60)}分钟` : ""}`
  } else {
    return `${Math.floor(seconds / 86400)}天${seconds % 86400 > 0 ? ` ${Math.floor((seconds % 86400) / 3600)}小时` : ""}`
  }
}

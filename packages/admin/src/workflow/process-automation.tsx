"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Label } from "@yyc3/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Badge } from "@yyc3/ui/badge"
import { Switch } from "@yyc3/ui/switch"
import {
  Plus,
  Trash2,
  ArrowRight,
  Settings,
  AlertCircle,
  Clock,
  Mail,
  MessageSquare,
  FileText,
  Bell,
  Database,
  RefreshCw,
  Zap,
} from "lucide-react"
import { cn } from "@yyc3/lib/utils"
import { ReactNode } from "react"

// 类型定义
interface EventTrigger {
  type: "event";
  event: string;
}

interface ConditionTrigger {
  type: "condition";
  condition: string;
}

interface ScheduleTrigger {
  type: "schedule";
  schedule: string;
}

type Trigger = EventTrigger | ConditionTrigger | ScheduleTrigger;

interface BaseAction {
  type: string;
}

interface EmailAction extends BaseAction {
  type: "email";
  template?: string;
  to: string | string[];
  attachReport?: boolean;
}

interface NotificationAction extends BaseAction {
  type: "notification";
  to: string[];
  message: string;
}

interface SmsAction extends BaseAction {
  type: "sms";
  to: string | string[];
  message: string;
}

interface GenerateReportAction extends BaseAction {
  type: "generateReport";
  reportType: string;
}

interface UpdateDatabaseAction extends BaseAction {
  type: "updateDatabase";
  query: string;
}

interface ApiCallAction extends BaseAction {
  type: "apiCall";
  endpoint: string;
  method?: string;
  data?: any;
}

type Action = EmailAction | NotificationAction | SmsAction | GenerateReportAction | UpdateDatabaseAction | ApiCallAction;

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: Trigger;
  actions: Action[];
  active: boolean;
  lastRun: string | null;
  runCount: number;
}

interface TriggerType {
  id: string;
  name: string;
  icon: React.ElementType;
}

interface ActionType {
  id: string;
  name: string;
  icon: React.ElementType;
}

// 示例自动化流程
const exampleAutomations: Automation[] = [
  {
    id: "auto-1",
    name: "订单确认通知",
    description: "当新订单创建时，自动发送确认邮件给客户",
    trigger: {
      type: "event",
      event: "order.created",
    },
    actions: [
      {
        type: "email",
        template: "order-confirmation",
        to: "{{customer.email}}",
      },
    ],
    active: true,
    lastRun: "2025-03-15 14:30",
    runCount: 128,
  },
  {
    id: "auto-2",
    name: "库存不足提醒",
    description: "当商品库存低于阈值时，通知采购部门",
    trigger: {
      type: "condition",
      condition: "product.stock < product.minStock",
    },
    actions: [
      {
        type: "notification",
        to: ["purchasing-team"],
        message: "商品 {{product.name}} 库存不足，当前库存: {{product.stock}}",
      },
    ],
    active: true,
    lastRun: "2025-03-14 09:15",
    runCount: 42,
  },
  {
    id: "auto-3",
    name: "每周销售报表",
    description: "每周一自动生成上周销售报表并发送给管理层",
    trigger: {
      type: "schedule",
      schedule: "0 9 * * 1", // 每周一上午9点
    },
    actions: [
      {
        type: "generateReport",
        reportType: "weekly-sales",
      },
      {
        type: "email",
        template: "weekly-report",
        to: ["management-team"],
        attachReport: true,
      },
    ],
    active: false,
    lastRun: "2025-03-11 09:00",
    runCount: 24,
  },
]

// 可用的触发器类型
const triggerTypes: TriggerType[] = [
  { id: "event", name: "事件触发", icon: Bell },
  { id: "condition", name: "条件触发", icon: AlertCircle },
  { id: "schedule", name: "定时触发", icon: Clock },
]

// 可用的动作类型
const actionTypes: ActionType[] = [
  { id: "email", name: "发送邮件", icon: Mail },
  { id: "notification", name: "发送通知", icon: Bell },
  { id: "sms", name: "发送短信", icon: MessageSquare },
  { id: "generateReport", name: "生成报表", icon: FileText },
  { id: "updateDatabase", name: "更新数据库", icon: Database },
  { id: "apiCall", name: "调用API", icon: RefreshCw },
]

export function ProcessAutomation() {
  const [automations, setAutomations] = useState<Automation[]>(exampleAutomations)
  const [activeTab, setActiveTab] = useState<string>("active")
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [newAutomation, setNewAutomation] = useState<Omit<Automation, 'id' | 'lastRun' | 'runCount'>>({
    name: "",
    description: "",
    trigger: {
      type: "event",
      event: "",
    },
    actions: [
      {
        type: "notification",
        to: [],
        message: "",
      },
    ],
    active: true,
  })

  const filteredAutomations =
    activeTab === "active"
      ? automations.filter((a) => a.active)
      : activeTab === "inactive"
        ? automations.filter((a) => !a.active)
        : automations

  const toggleAutomationStatus = (automationId: string) => {
    setAutomations(
      automations.map((automation) =>
        automation.id === automationId ? { ...automation, active: !automation.active } : automation,
      ),
    )
  }

  const deleteAutomation = (automationId: string) => {
    setAutomations(automations.filter((automation) => automation.id !== automationId))
  }

  const handleCreateAutomation = () => {
    if (!newAutomation.name) return

    const newAutomationObj = {
      id: `auto-${Date.now()}`,
      name: newAutomation.name,
      description: newAutomation.description,
      trigger: newAutomation.trigger,
      actions: newAutomation.actions,
      active: newAutomation.active,
      lastRun: null,
      runCount: 0,
    }

    setAutomations([...automations, newAutomationObj])
    setNewAutomation({
      name: "",
      description: "",
      trigger: {
        type: "event",
        event: "",
      },
      actions: [
        {
          type: "notification",
          to: [],
          message: "",
        },
      ],
      active: true,
    })
    setIsCreating(false)
  }

  const addAction = () => {
    setNewAutomation({
      ...newAutomation,
      actions: [
        ...newAutomation.actions,
        {
          type: "notification",
          to: [],
          message: "",
        },
      ],
    })
  }

  const removeAction = (index: number) => {
    const actions = [...newAutomation.actions]
    actions.splice(index, 1)
    setNewAutomation({
      ...newAutomation,
      actions,
    })
  }

  const updateAction = <K extends string>(index: number, key: K, value: any) => {
    const actions = [...newAutomation.actions]
    actions[index] = {
      ...actions[index],
      [key]: value,
    }
    setNewAutomation({
      ...newAutomation,
      actions,
    })
  }

  const getTriggerIcon = (triggerType: string) => {
    const trigger = triggerTypes.find((t) => t.id === triggerType)
    return trigger ? trigger.icon : Bell
  }

  const getActionIcon = (actionType: string) => {
    const action = actionTypes.find((a) => a.id === actionType)
    return action ? action.icon : Bell
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>业务流程自动化</CardTitle>
          <Button onClick={() => setIsCreating(!isCreating)}>
            {isCreating ? (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                返回列表
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                创建自动化
              </>
            )}
          </Button>
        </div>
        <CardDescription>自动化重复性任务，提高工作效率</CardDescription>
      </CardHeader>
      <CardContent>
        {isCreating ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="automation-name">自动化名称</Label>
              <Input
                id="automation-name"
                placeholder="输入自动化名称"
                value={newAutomation.name}
                onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="automation-description">描述</Label>
              <Input
                id="automation-description"
                placeholder="输入自动化描述"
                value={newAutomation.description}
                onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>触发条件</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {triggerTypes.map((trigger) => (
                  <div
                    key={trigger.id}
                    className={cn(
                      "border rounded-md p-4 cursor-pointer hover:border-primary transition-colors",
                      newAutomation.trigger.type === trigger.id && "border-primary bg-primary/5",
                    )}
                    onClick={() => {
                        // 确保根据trigger类型创建正确的触发器对象
                        const newTrigger: Trigger = trigger.id === 'event' 
                           ? { type: 'event' as const, event: '' }
                            : trigger.id === 'condition' 
                           ? { type: 'condition' as const, condition: '' }
                           : { type: 'schedule' as const, schedule: '' };
                        
                        setNewAutomation({
                          ...newAutomation,
                          trigger: newTrigger
                        });
                      }}
                  >
                    <div className="flex items-center gap-2">
                      <trigger.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{trigger.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {newAutomation.trigger.type === "event" && (
                <div className="mt-4">
                  <Label htmlFor="event-name">事件名称</Label>
                  <Input
                    id="event-name"
                    placeholder="例如: order.created"
                    value={newAutomation.trigger.event}
                    onChange={(e) =>
                      setNewAutomation({
                        ...newAutomation,
                        trigger: { type: 'event', event: e.target.value } as EventTrigger,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              )}

              {newAutomation.trigger.type === "condition" && (
                <div className="mt-4">
                  <Label htmlFor="condition">条件表达式</Label>
                  <Input
                    id="condition"
                    placeholder="例如: product.stock < product.minStock"
                    value={(newAutomation.trigger as ConditionTrigger).condition}
                    onChange={(e) =>
                      setNewAutomation({
                        ...newAutomation,
                        trigger: { ...(newAutomation.trigger as ConditionTrigger), condition: e.target.value },
                      })
                    }
                    className="mt-1"
                  />
                </div>
              )}

              {newAutomation.trigger.type === "schedule" && (
                <div className="mt-4">
                  <Label htmlFor="schedule">定时表达式 (Cron)</Label>
                  <Input
                    id="schedule"
                    placeholder="例如: 0 9 * * 1 (每周一上午9点)"
                    value={(newAutomation.trigger as ScheduleTrigger).schedule}
                    onChange={(e) =>
                      setNewAutomation({
                        ...newAutomation,
                        trigger: { ...(newAutomation.trigger as ScheduleTrigger), schedule: e.target.value },
                      })
                    }
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>动作</Label>
                <Button variant="outline" size="sm" onClick={addAction}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加动作
                </Button>
              </div>

              <div className="space-y-4 mt-2">
                {newAutomation.actions.map((action, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-muted text-muted-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <h4 className="font-medium">动作 {index + 1}</h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeAction(index)}
                        disabled={newAutomation.actions.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>动作类型</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {actionTypes.map((actionType) => (
                            <div
                              key={actionType.id}
                              className={cn(
                                "border rounded-md p-2 cursor-pointer hover:border-primary transition-colors flex items-center gap-2",
                                action.type === actionType.id && "border-primary bg-primary/5",
                              )}
                              onClick={() => updateAction(index, "type", actionType.id)}
                            >
                              <actionType.icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{actionType.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {action.type === "email" && (
                        <>
                          <div>
                            <Label htmlFor={`email-template-${index}`}>邮件模板</Label>
                            <Input
                              id={`email-template-${index}`}
                              placeholder="例如: order-confirmation"
                              value={(action as EmailAction).template || ""}
                      onChange={(e) => updateAction(index, "template", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`email-to-${index}`}>收件人</Label>
                            <Input
                              id={`email-to-${index}`}
                              placeholder="例如: {{customer.email}} 或 support@example.com"
                              value={action.to || ""}
                              onChange={(e) => updateAction(index, "to", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </>
                      )}

                      {action.type === "notification" && (
                        <>
                          <div>
                            <Label htmlFor={`notification-to-${index}`}>接收者</Label>
                            <Input
                              id={`notification-to-${index}`}
                              placeholder="例如: purchasing-team (用逗号分隔多个接收者)"
                              value={Array.isArray(action.to) ? action.to.join(", ") : action.to || ""}
                              onChange={(e) => {
                                const value = e.target.value
                                const recipients = value
                                  .split(",")
                                  .map((r) => r.trim())
                                  .filter(Boolean)
                                updateAction(index, "to", recipients)
                              }}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`notification-message-${index}`}>消息内容</Label>
                            <Input
                              id={`notification-message-${index}`}
                              placeholder="例如: 商品 {{product.name}} 库存不足"
                              value={action.message || ""}
                              onChange={(e) => updateAction(index, "message", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="automation-active">启用自动化</Label>
                <p className="text-sm text-muted-foreground">创建后立即启用此自动化</p>
              </div>
              <Switch
                id="automation-active"
                checked={newAutomation.active}
                onCheckedChange={(checked) => setNewAutomation({ ...newAutomation, active: checked })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                取消
              </Button>
              <Button onClick={handleCreateAutomation}>创建自动化</Button>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                <div className="flex items-center">
                  <span>全部</span>
                  <Badge variant="secondary" className="ml-2">
                    {automations.length}
                  </Badge>
                </div>
              </TabsTrigger>
              <TabsTrigger value="active">
                <div className="flex items-center">
                  <span>已启用</span>
                  <Badge variant="secondary" className="ml-2">
                    {automations.filter((a) => a.active).length}
                  </Badge>
                </div>
              </TabsTrigger>
              <TabsTrigger value="inactive">
                <div className="flex items-center">
                  <span>已禁用</span>
                  <Badge variant="secondary" className="ml-2">
                    {automations.filter((a) => !a.active).length}
                  </Badge>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="pt-4">
              {filteredAutomations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">没有找到自动化流程</div>
              ) : (
                <div className="space-y-4">
                  {filteredAutomations.map((automation) => {
                    const TriggerIcon = getTriggerIcon(automation.trigger.type)
                    return (
                      <div key={automation.id} className="border rounded-md overflow-hidden">
                        <div className="flex items-start justify-between p-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{automation.name}</h3>
                              <Badge variant={automation.active ? "default" : "secondary"}>
                                {automation.active ? "已启用" : "已禁用"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{automation.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => toggleAutomationStatus(automation.id)}>
                              {automation.active ? "禁用" : "启用"}
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => deleteAutomation(automation.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="border-t px-4 py-3 bg-muted/50">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <TriggerIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {automation.trigger.type === "event" && `事件: ${automation.trigger.event}`}
                                {automation.trigger.type === "condition" && `条件: ${automation.trigger.condition}`}
                                {automation.trigger.type === "schedule" && `定时: ${automation.trigger.schedule}`}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                            </div>
                            <div className="flex items-center gap-2">
                              {automation.actions.map((action, index) => {
                                const ActionIcon = getActionIcon(action.type)
                                return (
                                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                                    <ActionIcon className="h-3 w-3" />
                                    <span>{actionTypes.find((a) => a.id === action.type)?.name || action.type}</span>
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        </div>

                        {(automation.lastRun || automation.runCount > 0) && (
                          <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                              {automation.lastRun && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>上次运行: {automation.lastRun}</span>
                                </div>
                              )}
                              {automation.runCount > 0 && (
                                <div className="flex items-center gap-1">
                                  <Zap className="h-3 w-3" />
                                  <span>已运行 {automation.runCount} 次</span>
                                </div>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              查看历史记录
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">自动化可以帮助您减少重复性工作，提高工作效率</div>
        <Button variant="outline" size="sm">
          查看文档
        </Button>
      </CardFooter>
    </Card>
  )
}

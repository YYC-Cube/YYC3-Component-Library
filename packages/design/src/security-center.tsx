"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { Progress } from "@yyc3/ui-enterprise/progress"
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Users,
  FileText,
  Clock,
  Globe,
} from "lucide-react"

interface SecurityEvent {
  id: string
  type: "login" | "access" | "warning" | "error"
  description: string
  timestamp: Date
  severity: "low" | "medium" | "high"
  user?: string
  ip?: string
}

interface SecurityMetric {
  name: string
  value: number
  status: "good" | "warning" | "danger"
  description: string
}

export function SecurityCenter() {
  const [securityScore] = useState(85)

  const securityEvents: SecurityEvent[] = [
    {
      id: "1",
      type: "login",
      description: "管理员登录成功",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      severity: "low",
      user: "张总经理",
      ip: "192.168.1.100",
    },
    {
      id: "2",
      type: "warning",
      description: "检测到异常登录尝试",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      severity: "medium",
      ip: "203.0.113.45",
    },
    {
      id: "3",
      type: "access",
      description: "敏感数据访问",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      severity: "medium",
      user: "李部长",
      ip: "192.168.1.105",
    },
    {
      id: "4",
      type: "error",
      description: "权限验证失败",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      severity: "high",
      user: "未知用户",
      ip: "198.51.100.23",
    },
  ]

  const securityMetrics: SecurityMetric[] = [
    {
      name: "密码强度",
      value: 92,
      status: "good",
      description: "用户密码安全等级",
    },
    {
      name: "访问控制",
      value: 88,
      status: "good",
      description: "权限管理有效性",
    },
    {
      name: "数据加密",
      value: 95,
      status: "good",
      description: "数据传输和存储加密",
    },
    {
      name: "威胁检测",
      value: 76,
      status: "warning",
      description: "安全威胁识别能力",
    },
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login":
        return <Users className="w-4 h-4" />
      case "access":
        return <Eye className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "error":
        return <XCircle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getEventColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "low":
        return "低"
      case "medium":
        return "中"
      case "high":
        return "高"
      default:
        return "未知"
    }
  }

  const getMetricColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "danger":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">安全中心</h1>
          <p className="text-slate-600 mt-2">系统安全监控和威胁防护管理</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Shield className="w-4 h-4 mr-1" />
          安全等级: 高
        </Badge>
      </div>

      {/* 安全评分概览 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">安全评分</h2>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{securityScore}</span>
            <span className="text-slate-600">/100</span>
          </div>
        </div>
        <Progress value={securityScore} className="w-full mb-4" />
        <p className="text-sm text-slate-600">您的系统安全状况良好，建议定期检查和更新安全设置</p>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">安全概览</TabsTrigger>
          <TabsTrigger value="events">安全事件</TabsTrigger>
          <TabsTrigger value="policies">安全策略</TabsTrigger>
          <TabsTrigger value="audit">审计日志</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityMetrics.map((metric, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{metric.name}</h3>
                  <span className={`text-2xl font-bold ${getMetricColor(metric.status)}`}>{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="w-full mb-2" />
                <p className="text-xs text-slate-600">{metric.description}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  访问控制状态
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">双因素认证</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">IP白名单</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">会话超时</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">权限分离</span>
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  实时监控
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">在线用户</span>
                  <span className="font-semibold text-purple-600">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">活跃会话</span>
                  <span className="font-semibold text-purple-600">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">今日登录</span>
                  <span className="font-semibold text-purple-600">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">异常尝试</span>
                  <span className="font-semibold text-red-600">3</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="space-y-4">
            {securityEvents.map((event) => (
              <Card key={event.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      event.severity === "high"
                        ? "bg-red-100"
                        : event.severity === "medium"
                          ? "bg-yellow-100"
                          : "bg-green-100"
                    }`}
                  >
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-slate-900">{event.description}</h3>
                      <Badge className={getEventColor(event.severity)}>{getSeverityText(event.severity)}风险</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.timestamp.toLocaleString()}
                      </span>
                      {event.user && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.user}
                        </span>
                      )}
                      {event.ip && (
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {event.ip}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <div className="grid gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">密码策略</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">最小长度要求</span>
                  <span className="font-medium">8位</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">复杂度要求</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">定期更换</span>
                  <span className="font-medium">90天</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">历史密码限制</span>
                  <span className="font-medium">5个</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">访问策略</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">会话超时</span>
                  <span className="font-medium">30分钟</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">最大登录尝试</span>
                  <span className="font-medium">5次</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">账户锁定时间</span>
                  <span className="font-medium">15分钟</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">IP限制</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                审计日志
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">用户权限变更</h4>
                    <p className="text-sm text-slate-600">张总经理 修改了 李部长 的权限</p>
                  </div>
                  <span className="text-sm text-slate-500">2小时前</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">系统配置更新</h4>
                    <p className="text-sm text-slate-600">安全策略配置已更新</p>
                  </div>
                  <span className="text-sm text-slate-500">4小时前</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">数据备份完成</h4>
                    <p className="text-sm text-slate-600">自动备份任务执行成功</p>
                  </div>
                  <span className="text-sm text-slate-500">6小时前</span>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Button variant="outline">查看完整日志</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

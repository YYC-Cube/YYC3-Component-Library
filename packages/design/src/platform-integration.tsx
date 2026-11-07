"use client"

import { useState, useEffect } from "react"
import { Card } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Input } from "@yyc3/ui-enterprise/input"
import { Label } from "@yyc3/ui-enterprise/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui-enterprise/select"
import { Switch } from "@yyc3/ui-enterprise/switch"
import {
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  AlertTriangle,
  Link,
  Unlink,
  Shield,
  Globe,
  MessageSquare,
  Users,
  BarChart3,
  Zap,
} from "lucide-react"
import Image from "next/image"

interface Platform {
  id: string
  name: string
  displayName: string
  logo: string
  description: string
  status: "connected" | "disconnected" | "error" | "syncing"
  category: "social" | "work" | "content" | "communication"
  features: string[]
  apiVersion: string
  lastSync?: Date
  userCount?: number
  messageCount?: number
  config: {
    appId?: string
    appSecret?: string
    accessToken?: string
    webhookUrl?: string
    enabled: boolean
  }
}

interface SyncLog {
  id: string
  platformId: string
  action: string
  status: "success" | "error" | "warning"
  message: string
  timestamp: Date
  details?: string
}

export function PlatformIntegration() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([])

  const platforms: Platform[] = [
    {
      id: "wechat-official",
      name: "wechat-official",
      displayName: "微信公众号",
      logo: "/images/wechat-official-logo.png",
      description: "连接微信公众号，实现消息推送、用户管理和内容发布",
      status: "connected",
      category: "social",
      features: ["消息推送", "用户管理", "菜单配置", "素材管理", "数据统计"],
      apiVersion: "v2.0",
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      userCount: 12580,
      messageCount: 3420,
      config: {
        appId: "wx1234567890abcdef",
        appSecret: "***",
        accessToken: "***",
        webhookUrl: "https://api.jinlan.com/webhook/wechat",
        enabled: true,
      },
    },
    {
      id: "wework",
      name: "wework",
      displayName: "企业微信",
      logo: "/images/wework-logo.png",
      description: "集成企业微信，支持内部通讯、审批流程和组织架构同步",
      status: "connected",
      category: "work",
      features: ["内部通讯", "审批流程", "组织架构", "考勤管理", "会议预约"],
      apiVersion: "v1.8",
      lastSync: new Date(Date.now() - 2 * 60 * 1000),
      userCount: 156,
      messageCount: 892,
      config: {
        appId: "ww1234567890abcdef",
        appSecret: "***",
        accessToken: "***",
        webhookUrl: "https://api.jinlan.com/webhook/wework",
        enabled: true,
      },
    },
    {
      id: "feishu",
      name: "feishu",
      displayName: "飞书",
      logo: "/images/feishu-logo.png",
      description: "对接飞书平台，实现协作办公、文档管理和视频会议",
      status: "syncing",
      category: "work",
      features: ["协作办公", "文档管理", "视频会议", "日程安排", "机器人"],
      apiVersion: "v3.0",
      lastSync: new Date(Date.now() - 10 * 60 * 1000),
      userCount: 89,
      messageCount: 456,
      config: {
        appId: "cli_1234567890abcdef",
        appSecret: "***",
        accessToken: "***",
        webhookUrl: "https://api.jinlan.com/webhook/feishu",
        enabled: true,
      },
    },
    {
      id: "dingtalk",
      name: "dingtalk",
      displayName: "钉钉",
      logo: "/images/dingtalk-logo.png",
      description: "整合钉钉办公平台，支持智能办公和移动协作",
      status: "error",
      category: "work",
      features: ["智能办公", "移动协作", "审批流程", "考勤打卡", "直播会议"],
      apiVersion: "v2.5",
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      userCount: 0,
      messageCount: 0,
      config: {
        appId: "dingoa1234567890",
        appSecret: "***",
        accessToken: "",
        webhookUrl: "https://api.jinlan.com/webhook/dingtalk",
        enabled: false,
      },
    },
    {
      id: "douyin",
      name: "douyin",
      displayName: "抖音",
      logo: "/images/douyin-logo.png",
      description: "连接抖音平台，实现短视频内容管理和数据分析",
      status: "disconnected",
      category: "content",
      features: ["短视频管理", "数据分析", "粉丝互动", "直播管理", "广告投放"],
      apiVersion: "v1.2",
      userCount: 0,
      messageCount: 0,
      config: {
        appId: "",
        appSecret: "",
        accessToken: "",
        webhookUrl: "https://api.jinlan.com/webhook/douyin",
        enabled: false,
      },
    },
  ]

  const initialSyncLogs: SyncLog[] = [
    {
      id: "log-1",
      platformId: "wechat-official",
      action: "用户数据同步",
      status: "success",
      message: "成功同步1250个用户数据",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      details: "同步用户基本信息、标签和分组数据",
    },
    {
      id: "log-2",
      platformId: "wework",
      action: "组织架构同步",
      status: "success",
      message: "组织架构同步完成",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      details: "同步部门结构和员工信息",
    },
    {
      id: "log-3",
      platformId: "feishu",
      action: "消息推送",
      status: "warning",
      message: "部分消息推送失败",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      details: "45条消息成功，3条失败",
    },
    {
      id: "log-4",
      platformId: "dingtalk",
      action: "连接测试",
      status: "error",
      message: "连接失败，请检查配置",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      details: "AppSecret验证失败",
    },
  ]

  useEffect(() => {
    setSyncLogs(initialSyncLogs)
  }, [])

  const connectPlatform = async (platformId: string) => {
    setIsConnecting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnecting(false)

    const newLog: SyncLog = {
      id: `log-${Date.now()}`,
      platformId,
      action: "平台连接",
      status: "success",
      message: "平台连接成功",
      timestamp: new Date(),
      details: "API连接已建立，开始数据同步",
    }

    setSyncLogs((prev) => [newLog, ...prev])
  }

  const disconnectPlatform = async (platformId: string) => {
    setIsConnecting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsConnecting(false)

    const newLog: SyncLog = {
      id: `log-${Date.now()}`,
      platformId,
      action: "平台断开",
      status: "warning",
      message: "平台连接已断开",
      timestamp: new Date(),
      details: "所有同步任务已停止",
    }

    setSyncLogs((prev) => [newLog, ...prev])
  }

  const syncPlatform = async (platformId: string) => {
    const newLog: SyncLog = {
      id: `log-${Date.now()}`,
      platformId,
      action: "手动同步",
      status: "success",
      message: "数据同步完成",
      timestamp: new Date(),
      details: "同步用户数据和消息记录",
    }

    setSyncLogs((prev) => [newLog, ...prev])
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "disconnected":
        return <XCircle className="w-4 h-4 text-gray-400" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "syncing":
        return <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "disconnected":
        return "bg-gray-100 text-gray-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "syncing":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getLogStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "social":
        return <MessageSquare className="w-5 h-5 text-purple-600" />
      case "work":
        return <Users className="w-5 h-5 text-purple-600" />
      case "content":
        return <BarChart3 className="w-5 h-5 text-purple-600" />
      case "communication":
        return <Globe className="w-5 h-5 text-purple-600" />
      default:
        return <Zap className="w-5 h-5 text-purple-600" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">平台对接</h1>
          <p className="text-slate-600 mt-2">管理第三方平台集成和数据同步</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            安全设置
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Link className="w-4 h-4 mr-2" />
            新增平台
          </Button>
        </div>
      </div>

      {/* 平台状态概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">已连接平台</p>
              <p className="text-2xl font-bold text-purple-600">
                {platforms.filter((p) => p.status === "connected").length}
              </p>
            </div>
            <Link className="w-8 h-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">总用户数</p>
              <p className="text-2xl font-bold text-purple-600">
                {platforms.reduce((sum, p) => sum + (p.userCount || 0), 0).toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">消息总数</p>
              <p className="text-2xl font-bold text-purple-600">
                {platforms.reduce((sum, p) => sum + (p.messageCount || 0), 0).toLocaleString()}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">同步任务</p>
              <p className="text-2xl font-bold text-purple-600">
                {platforms.filter((p) => p.status === "syncing").length}
              </p>
            </div>
            <RefreshCw className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="platforms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platforms">平台管理</TabsTrigger>
          <TabsTrigger value="config">配置管理</TabsTrigger>
          <TabsTrigger value="sync">同步日志</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid gap-4">
            {platforms.map((platform) => (
              <Card
                key={platform.id}
                className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-6 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden">
                      <Image
                        src={platform.logo || "/placeholder.svg"}
                        alt={platform.displayName}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900 group-hover:translate-x-1 transition-transform duration-300">
                          {platform.displayName}
                        </h3>
                        <Badge className={getStatusColor(platform.status)}>
                          {platform.status === "connected"
                            ? "已连接"
                            : platform.status === "disconnected"
                              ? "未连接"
                              : platform.status === "error"
                                ? "连接错误"
                                : "同步中"}
                        </Badge>
                        <div className="flex items-center gap-1">{getCategoryIcon(platform.category)}</div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{platform.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>API版本: {platform.apiVersion}</span>
                        {platform.lastSync && <span>最后同步: {platform.lastSync.toLocaleString()}</span>}
                        {platform.userCount && <span>用户: {platform.userCount.toLocaleString()}</span>}
                        {platform.messageCount && <span>消息: {platform.messageCount.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusIcon(platform.status)}
                    <div className="flex gap-2">
                      {platform.status === "connected" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => syncPlatform(platform.id)}
                            disabled={isConnecting}
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => disconnectPlatform(platform.id)}
                            disabled={isConnecting}
                          >
                            <Unlink className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => connectPlatform(platform.id)}
                          disabled={isConnecting}
                        >
                          {isConnecting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Link className="w-3 h-3" />}
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => setSelectedPlatform(platform.id)}>
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 功能特性 */}
                <div className="mt-4 pt-4 border-t border-sky-100">
                  <div className="flex flex-wrap gap-2">
                    {platform.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          {selectedPlatform ? (
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
              <h3 className="text-lg font-semibold mb-4">
                {platforms.find((p) => p.id === selectedPlatform)?.displayName} 配置
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="app-id">应用ID</Label>
                    <Input
                      id="app-id"
                      defaultValue={platforms.find((p) => p.id === selectedPlatform)?.config.appId}
                      placeholder="输入应用ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="app-secret">应用密钥</Label>
                    <Input id="app-secret" type="password" defaultValue="***" placeholder="输入应用密钥" />
                  </div>
                  <div>
                    <Label htmlFor="access-token">访问令牌</Label>
                    <Input id="access-token" type="password" defaultValue="***" placeholder="访问令牌" />
                  </div>
                  <div>
                    <Label htmlFor="webhook-url">Webhook地址</Label>
                    <Input
                      id="webhook-url"
                      defaultValue={platforms.find((p) => p.id === selectedPlatform)?.config.webhookUrl}
                      placeholder="Webhook回调地址"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="platform-enabled">启用平台</Label>
                    <Switch
                      id="platform-enabled"
                      defaultChecked={platforms.find((p) => p.id === selectedPlatform)?.config.enabled}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sync-interval">同步间隔</Label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue placeholder="选择同步间隔" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1分钟</SelectItem>
                        <SelectItem value="5">5分钟</SelectItem>
                        <SelectItem value="15">15分钟</SelectItem>
                        <SelectItem value="30">30分钟</SelectItem>
                        <SelectItem value="60">1小时</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="retry-count">重试次数</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue placeholder="选择重试次数" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1次</SelectItem>
                        <SelectItem value="3">3次</SelectItem>
                        <SelectItem value="5">5次</SelectItem>
                        <SelectItem value="10">10次</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeout">超时时间(秒)</Label>
                    <Input id="timeout" type="number" defaultValue="30" placeholder="30" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-sky-100">
                <Button variant="outline">测试连接</Button>
                <Button className="bg-purple-600 hover:bg-purple-700">保存配置</Button>
              </div>
            </Card>
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-12 text-center">
              <Settings className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">请先选择一个平台进行配置</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <div className="grid gap-4">
            {syncLogs.map((log) => (
              <Card
                key={log.id}
                className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden">
                      <Image
                        src={platforms.find((p) => p.id === log.platformId)?.logo || ""}
                        alt={platforms.find((p) => p.id === log.platformId)?.displayName || ""}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-900">{log.action}</h4>
                        <Badge
                          className={
                            log.status === "success"
                              ? "bg-green-100 text-green-800"
                              : log.status === "error"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {log.status === "success" ? "成功" : log.status === "error" ? "失败" : "警告"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{log.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{log.timestamp.toLocaleString()}</p>
                      {log.details && <p className="text-xs text-slate-400 mt-1">{log.details}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getLogStatusIcon(log.status)}
                    <span className="text-sm text-slate-500">
                      {platforms.find((p) => p.id === log.platformId)?.displayName}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-4">
          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
            <h3 className="text-lg font-semibold mb-4">Webhook配置</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="webhook-base-url">基础URL</Label>
                  <Input id="webhook-base-url" defaultValue="https://api.jinlan.com" placeholder="基础URL" />
                </div>
                <div>
                  <Label htmlFor="webhook-secret">签名密钥</Label>
                  <Input id="webhook-secret" type="password" defaultValue="***" placeholder="签名密钥" />
                </div>
                <div>
                  <Label htmlFor="webhook-timeout">超时时间(秒)</Label>
                  <Input id="webhook-timeout" type="number" defaultValue="10" placeholder="10" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>支持的事件类型</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="user-event" defaultChecked />
                      <Label htmlFor="user-event">用户事件</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="message-event" defaultChecked />
                      <Label htmlFor="message-event">消息事件</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="system-event" />
                      <Label htmlFor="system-event">系统事件</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-sky-100">
              <h4 className="font-medium mb-3">Webhook端点</h4>
              <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded-lg">
                <div>POST /webhook/wechat - 微信公众号</div>
                <div>POST /webhook/wework - 企业微信</div>
                <div>POST /webhook/feishu - 飞书</div>
                <div>POST /webhook/dingtalk - 钉钉</div>
                <div>POST /webhook/douyin - 抖音</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline">测试Webhook</Button>
              <Button className="bg-purple-600 hover:bg-purple-700">保存配置</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

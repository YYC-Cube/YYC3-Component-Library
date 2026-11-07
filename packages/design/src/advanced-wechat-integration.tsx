"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Input } from "@yyc3/ui-enterprise/input"
import { Label } from "@yyc3/ui-enterprise/label"
import { Switch } from "@yyc3/ui-enterprise/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { Alert, AlertDescription } from "@yyc3/ui-enterprise/alert"
import {
  MessageSquare,
  Users,
  Send,
  Settings,
  BarChart3,
  Smartphone,
  Globe,
  Zap,
  CheckCircle,
  QrCode,
  ImageIcon,
  FileText,
  Star,
  TrendingUp,
  Webhook,
} from "lucide-react"

interface WeChatAccount {
  id: string
  name: string
  type: "service" | "subscription" | "enterprise"
  appId: string
  status: "active" | "pending" | "suspended"
  followers: number
  verified: boolean
  avatar: string
}

interface MenuConfig {
  id: string
  name: string
  type: "click" | "view" | "miniprogram" | "media_id"
  key?: string
  url?: string
  appid?: string
  pagepath?: string
  media_id?: string
  children?: MenuConfig[]
}

interface MessageTemplate {
  id: string
  name: string
  type: "text" | "image" | "news" | "video" | "voice"
  content: string
  title?: string
  description?: string
  picUrl?: string
  url?: string
  mediaId?: string
}

interface AutoReply {
  id: string
  keyword: string
  type: "exact" | "fuzzy" | "regex"
  reply: MessageTemplate
  enabled: boolean
  hitCount: number
}

interface WeChatAnalytics {
  followers: {
    total: number
    new: number
    unfollow: number
    growth: number
  }
  messages: {
    sent: number
    received: number
    replied: number
    responseRate: number
  }
  engagement: {
    clicks: number
    shares: number
    likes: number
    comments: number
  }
}

export function AdvancedWeChatIntegration() {
  const [accounts, setAccounts] = useState<WeChatAccount[]>([
    {
      id: "1",
      name: "锦澜家居官方",
      type: "service",
      appId: "wx1234567890abcdef",
      status: "active",
      followers: 15420,
      verified: true,
      avatar: "/images/wechat-official-logo.png",
    },
    {
      id: "2",
      name: "锦澜家居客服",
      type: "subscription",
      appId: "wx0987654321fedcba",
      status: "active",
      followers: 8650,
      verified: false,
      avatar: "/images/wechat-official-logo.png",
    },
  ])

  const [selectedAccount, setSelectedAccount] = useState<string>("1")

  const [menuConfig, setMenuConfig] = useState<MenuConfig[]>([
    {
      id: "1",
      name: "产品中心",
      type: "click",
      key: "PRODUCT_CENTER",
      children: [
        { id: "11", name: "沙发系列", type: "view", url: "https://example.com/sofa" },
        { id: "12", name: "床具系列", type: "view", url: "https://example.com/bed" },
        { id: "13", name: "餐桌系列", type: "view", url: "https://example.com/table" },
      ],
    },
    {
      id: "2",
      name: "服务支持",
      type: "click",
      key: "SERVICE_SUPPORT",
      children: [
        { id: "21", name: "在线客服", type: "click", key: "ONLINE_SERVICE" },
        { id: "22", name: "预约上门", type: "miniprogram", appid: "wx123", pagepath: "pages/appointment" },
        { id: "23", name: "售后服务", type: "view", url: "https://example.com/service" },
      ],
    },
    {
      id: "3",
      name: "关于我们",
      type: "view",
      url: "https://example.com/about",
    },
  ])

  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([
    {
      id: "1",
      name: "欢迎消息",
      type: "text",
      content: "欢迎关注锦澜家居！我们为您提供高品质的家居产品和专业的服务。",
    },
    {
      id: "2",
      name: "产品推荐",
      type: "news",
      title: "新品上市 | 北欧风格沙发系列",
      description: "简约设计，舒适体验，为您的家增添温馨氛围",
      picUrl: "/images/sofa-promotion.jpg",
      url: "https://example.com/new-sofa",
      content: "",
    },
  ])

  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([
    {
      id: "1",
      keyword: "价格",
      type: "fuzzy",
      reply: messageTemplates[0],
      enabled: true,
      hitCount: 156,
    },
    {
      id: "2",
      keyword: "联系方式",
      type: "exact",
      reply: messageTemplates[0],
      enabled: true,
      hitCount: 89,
    },
  ])

  const [analytics, setAnalytics] = useState<WeChatAnalytics>({
    followers: {
      total: 15420,
      new: 234,
      unfollow: 45,
      growth: 1.2,
    },
    messages: {
      sent: 1250,
      received: 890,
      replied: 756,
      responseRate: 85.0,
    },
    engagement: {
      clicks: 2340,
      shares: 156,
      likes: 445,
      comments: 89,
    },
  })

  const [isConnected, setIsConnected] = useState(true)
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")

  const currentAccount = accounts.find((acc) => acc.id === selectedAccount)

  const handleMenuSync = async () => {
    setSyncStatus("syncing")
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSyncStatus("success")
      setTimeout(() => setSyncStatus("idle"), 3000)
    } catch (error) {
      setSyncStatus("error")
      setTimeout(() => setSyncStatus("idle"), 3000)
    }
  }

  const handleSendMessage = async (templateId: string) => {
    // 模拟发送消息
    console.log("发送消息模板:", templateId)
  }

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "service":
        return "服务号"
      case "subscription":
        return "订阅号"
      case "enterprise":
        return "企业号"
      default:
        return "未知"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-green-50/30">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">微信深度集成</h1>
          <p className="text-slate-600 mt-2">全方位微信公众号管理和营销自动化</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            <Globe className="w-4 h-4 mr-1" />
            {isConnected ? "已连接" : "未连接"}
          </Badge>
          <Button
            onClick={handleMenuSync}
            disabled={syncStatus === "syncing"}
            className="bg-green-600 hover:bg-green-700"
          >
            {syncStatus === "syncing" ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                同步中...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                同步配置
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 账号概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总粉丝数</p>
                <p className="text-3xl font-bold text-green-600">{analytics.followers.total.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+{analytics.followers.growth}%</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">消息回复率</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.messages.responseRate}%</p>
                <p className="text-xs text-slate-500 mt-1">今日已回复 {analytics.messages.replied}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">互动总数</p>
                <p className="text-3xl font-bold text-purple-600">{analytics.engagement.clicks}</p>
                <p className="text-xs text-slate-500 mt-1">点击、分享、点赞</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">新增粉丝</p>
                <p className="text-3xl font-bold text-orange-600">{analytics.followers.new}</p>
                <p className="text-xs text-slate-500 mt-1">今日新关注</p>
              </div>
              <Star className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 账号管理 */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-green-600" />
            账号管理
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts.map((account) => (
              <div
                key={account.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedAccount === account.id
                    ? "border-green-500 bg-green-50"
                    : "border-slate-200 hover:border-green-300"
                }`}
                onClick={() => setSelectedAccount(account.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-slate-900">{account.name}</h3>
                      {account.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getAccountTypeLabel(account.type)}
                      </Badge>
                      <Badge className={getStatusColor(account.status)}>
                        {account.status === "active" ? "正常" : account.status === "pending" ? "待审核" : "已暂停"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      粉丝: {account.followers.toLocaleString()} | AppID: {account.appId}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="menu" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="menu">菜单配置</TabsTrigger>
          <TabsTrigger value="messages">消息模板</TabsTrigger>
          <TabsTrigger value="auto-reply">自动回复</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
          <TabsTrigger value="advanced">高级功能</TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
                  自定义菜单配置
                </div>
                <Button onClick={handleMenuSync} disabled={syncStatus === "syncing"}>
                  {syncStatus === "syncing" ? "同步中..." : "同步到微信"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {syncStatus === "success" && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">菜单配置已成功同步到微信服务器</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-800 mb-4">菜单结构</h4>
                  <div className="space-y-3">
                    {menuConfig.map((menu) => (
                      <div key={menu.id} className="border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900">{menu.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {menu.type}
                          </Badge>
                        </div>
                        {menu.children && (
                          <div className="mt-2 ml-4 space-y-1">
                            {menu.children.map((child) => (
                              <div key={child.id} className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">{child.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {child.type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-800 mb-4">菜单预览</h4>
                  <div className="bg-slate-100 rounded-lg p-4">
                    <div className="bg-white rounded-lg shadow-sm">
                      <div className="bg-green-600 text-white p-3 rounded-t-lg text-center">{currentAccount?.name}</div>
                      <div className="p-4 space-y-2">
                        <div className="text-sm text-slate-600">欢迎关注我们的微信公众号！</div>
                        <div className="border-t pt-2">
                          <div className="grid grid-cols-3 gap-1 text-xs">
                            {menuConfig.map((menu) => (
                              <div
                                key={menu.id}
                                className="bg-slate-50 p-2 rounded text-center hover:bg-slate-100 cursor-pointer"
                              >
                                {menu.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  消息模板管理
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Send className="w-4 h-4 mr-2" />
                  新建模板
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {messageTemplates.map((template) => (
                  <div key={template.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-900">{template.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {template.type === "text"
                            ? "文本"
                            : template.type === "image"
                              ? "图片"
                              : template.type === "news"
                                ? "图文"
                                : "其他"}
                        </Badge>
                        <Button size="sm" onClick={() => handleSendMessage(template.id)}>
                          发送
                        </Button>
                      </div>
                    </div>

                    {template.type === "text" && (
                      <div className="bg-slate-50 p-3 rounded text-sm">{template.content}</div>
                    )}

                    {template.type === "news" && (
                      <div className="bg-slate-50 p-3 rounded">
                        <div className="flex space-x-3">
                          <div className="w-16 h-16 bg-slate-200 rounded flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{template.title}</h5>
                            <p className="text-xs text-slate-600 mt-1">{template.description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto-reply" className="space-y-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-orange-600" />
                  智能自动回复
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700">添加规则</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {autoReplies.map((rule) => (
                  <div key={rule.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Switch checked={rule.enabled} />
                        <div>
                          <h4 className="font-medium text-slate-900">关键词: {rule.keyword}</h4>
                          <p className="text-sm text-slate-600">
                            匹配方式:{" "}
                            {rule.type === "exact" ? "精确匹配" : rule.type === "fuzzy" ? "模糊匹配" : "正则表达式"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          命中 {rule.hitCount} 次
                        </Badge>
                        <Button size="sm" variant="outline">
                          编辑
                        </Button>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-sm text-slate-600 mb-2">回复内容:</p>
                      <div className="bg-white p-2 rounded border text-sm">{rule.reply.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                  粉丝增长趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">总粉丝数</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {analytics.followers.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">今日新增</span>
                    <span className="text-lg font-medium text-green-600">+{analytics.followers.new}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">今日取关</span>
                    <span className="text-lg font-medium text-red-600">-{analytics.followers.unfollow}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">净增长率</span>
                    <span className="text-lg font-medium text-blue-600">{analytics.followers.growth}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-teal-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-teal-600" />
                  消息互动统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">发送消息</span>
                    <span className="text-lg font-medium text-teal-600">{analytics.messages.sent}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">收到消息</span>
                    <span className="text-lg font-medium text-blue-600">{analytics.messages.received}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">已回复</span>
                    <span className="text-lg font-medium text-green-600">{analytics.messages.replied}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">回复率</span>
                    <span className="text-lg font-medium text-purple-600">{analytics.messages.responseRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-pink-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Webhook className="w-5 h-5 mr-2 text-pink-600" />
                  Webhook配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input id="webhook-url" value="https://api.jinlan.com/wechat/webhook" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="webhook-token">Token</Label>
                  <Input id="webhook-token" value="jinlan_wechat_token_2024" type="password" className="mt-1" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="webhook-enabled" defaultChecked />
                  <Label htmlFor="webhook-enabled">启用Webhook</Label>
                </div>
                <Button className="w-full bg-pink-600 hover:bg-pink-700">测试连接</Button>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-cyan-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="w-5 h-5 mr-2 text-cyan-600" />
                  二维码管理
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="qr-scene">场景值</Label>
                  <Input id="qr-scene" placeholder="输入场景值" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="qr-expire">有效期(秒)</Label>
                  <Input id="qr-expire" type="number" placeholder="604800" className="mt-1" />
                </div>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">生成二维码</Button>
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <QrCode className="w-16 h-16 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600">二维码将显示在这里</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

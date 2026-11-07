"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Switch } from "@yyc3/ui-enterprise/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { ScrollArea } from "@yyc3/ui-enterprise/scroll-area"
import {
  Smartphone,
  Download,
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  RefreshCw,
  Database,
  Cloud,
  HardDrive,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  BarChart3,
  Clock,
} from "lucide-react"

interface PWAStatus {
  isInstalled: boolean
  isOnline: boolean
  hasNotificationPermission: boolean
  cacheSize: number
  lastSync: Date | null
  pendingUpdates: number
}

interface CacheItem {
  id: string
  type: "static" | "api" | "image" | "document"
  url: string
  size: number
  lastAccessed: Date
  expiresAt: Date
}

interface NotificationSettings {
  enabled: boolean
  types: {
    system: boolean
    tasks: boolean
    customers: boolean
    sales: boolean
    reminders: boolean
  }
  schedule: {
    start: string
    end: string
    weekends: boolean
  }
}

export function PWAManager() {
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>({
    isInstalled: false,
    isOnline: navigator.onLine,
    hasNotificationPermission: false,
    cacheSize: 0,
    lastSync: null,
    pendingUpdates: 0,
  })

  const [cacheItems, setCacheItems] = useState<CacheItem[]>([])
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: false,
    types: {
      system: true,
      tasks: true,
      customers: false,
      sales: true,
      reminders: true,
    },
    schedule: {
      start: "09:00",
      end: "18:00",
      weekends: false,
    },
  })

  const [isInstalling, setIsInstalling] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    checkPWAStatus()
    loadCacheData()
    setupEventListeners()
  }, [])

  const checkPWAStatus = async () => {
    // 检查PWA安装状态
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true

    // 检查通知权限
    const hasNotificationPermission = Notification.permission === "granted"

    // 检查缓存大小
    let cacheSize = 0
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys()
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const requests = await cache.keys()
          for (const request of requests) {
            const response = await cache.match(request)
            if (response) {
              const blob = await response.blob()
              cacheSize += blob.size
            }
          }
        }
      } catch (error) {
        console.error("获取缓存大小失败:", error)
      }
    }

    setPwaStatus((prev) => ({
      ...prev,
      isInstalled,
      hasNotificationPermission,
      cacheSize,
      lastSync: new Date(),
    }))
  }

  const loadCacheData = async () => {
    const mockCacheItems: CacheItem[] = [
      {
        id: "1",
        type: "static",
        url: "/app/dashboard",
        size: 245760,
        lastAccessed: new Date(Date.now() - 2 * 60 * 1000),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        type: "api",
        url: "/api/customers",
        size: 51200,
        lastAccessed: new Date(Date.now() - 5 * 60 * 1000),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
      {
        id: "3",
        type: "image",
        url: "/images/jinlan-logo.png",
        size: 15360,
        lastAccessed: new Date(Date.now() - 10 * 60 * 1000),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "4",
        type: "document",
        url: "/docs/user-manual.pdf",
        size: 1048576,
        lastAccessed: new Date(Date.now() - 30 * 60 * 1000),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: "5",
        type: "api",
        url: "/api/tasks",
        size: 32768,
        lastAccessed: new Date(Date.now() - 1 * 60 * 1000),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    ]

    setCacheItems(mockCacheItems)
  }

  const setupEventListeners = () => {
    // 监听在线状态变化
    const handleOnline = () => {
      setPwaStatus((prev) => ({ ...prev, isOnline: true }))
      syncOfflineData()
    }

    const handleOffline = () => {
      setPwaStatus((prev) => ({ ...prev, isOnline: false }))
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }

  const installPWA = async () => {
    setIsInstalling(true)

    try {
      // 模拟安装过程
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setPwaStatus((prev) => ({ ...prev, isInstalled: true }))

      // 显示安装成功通知
      if (Notification.permission === "granted") {
        new Notification("应用安装成功", {
          body: "锦澜家居客户服务中心已成功安装到您的设备",
          icon: "/images/jinlan-logo-main.png",
        })
      }
    } catch (error) {
      console.error("PWA安装失败:", error)
    } finally {
      setIsInstalling(false)
    }
  }

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      setPwaStatus((prev) => ({
        ...prev,
        hasNotificationPermission: permission === "granted",
      }))

      if (permission === "granted") {
        setNotificationSettings((prev) => ({ ...prev, enabled: true }))

        // 发送测试通知
        new Notification("通知已启用", {
          body: "您将收到重要的系统通知和提醒",
          icon: "/images/jinlan-logo-main.png",
        })
      }
    } catch (error) {
      console.error("请求通知权限失败:", error)
    }
  }

  const clearCache = async (type?: string) => {
    setIsClearing(true)

    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys()

        for (const cacheName of cacheNames) {
          if (!type || cacheName.includes(type)) {
            await caches.delete(cacheName)
          }
        }

        // 更新缓存项列表
        if (type) {
          setCacheItems((prev) => prev.filter((item) => item.type !== type))
        } else {
          setCacheItems([])
        }

        // 重新检查缓存大小
        await checkPWAStatus()
      }
    } catch (error) {
      console.error("清理缓存失败:", error)
    } finally {
      setIsClearing(false)
    }
  }

  const syncOfflineData = async () => {
    setIsSyncing(true)

    try {
      // 模拟数据同步
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setPwaStatus((prev) => ({
        ...prev,
        lastSync: new Date(),
        pendingUpdates: 0,
      }))

      if (Notification.permission === "granted") {
        new Notification("数据同步完成", {
          body: "离线数据已成功同步到服务器",
          icon: "/images/jinlan-logo-main.png",
        })
      }
    } catch (error) {
      console.error("数据同步失败:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getCacheTypeIcon = (type: string) => {
    switch (type) {
      case "static":
        return <HardDrive className="w-4 h-4 text-blue-600" />
      case "api":
        return <Database className="w-4 h-4 text-green-600" />
      case "image":
        return <Cloud className="w-4 h-4 text-purple-600" />
      case "document":
        return <BarChart3 className="w-4 h-4 text-orange-600" />
      default:
        return <HardDrive className="w-4 h-4 text-gray-600" />
    }
  }

  const getCacheTypeBadge = (type: string) => {
    const colors = {
      static: "bg-blue-100 text-blue-800",
      api: "bg-green-100 text-green-800",
      image: "bg-purple-100 text-purple-800",
      document: "bg-orange-100 text-orange-800",
    }

    const labels = {
      static: "静态资源",
      api: "API数据",
      image: "图片资源",
      document: "文档资源",
    }

    return (
      <Badge className={colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">PWA管理中心</h1>
          <p className="text-slate-600 mt-2">管理渐进式Web应用功能和离线体验</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={pwaStatus.isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
          >
            {pwaStatus.isOnline ? <Wifi className="w-4 h-4 mr-1" /> : <WifiOff className="w-4 h-4 mr-1" />}
            {pwaStatus.isOnline ? "在线" : "离线"}
          </Badge>
          <Badge
            variant="outline"
            className={pwaStatus.isInstalled ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}
          >
            <Smartphone className="w-4 h-4 mr-1" />
            {pwaStatus.isInstalled ? "已安装" : "未安装"}
          </Badge>
        </div>
      </div>

      {/* PWA状态概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">应用状态</p>
              <p className="text-2xl font-bold text-purple-600">{pwaStatus.isInstalled ? "已安装" : "未安装"}</p>
            </div>
            <Smartphone className={`w-8 h-8 ${pwaStatus.isInstalled ? "text-purple-600" : "text-gray-400"}`} />
          </div>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">缓存大小</p>
              <p className="text-2xl font-bold text-purple-600">{formatFileSize(pwaStatus.cacheSize)}</p>
            </div>
            <Database className="w-8 h-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">通知权限</p>
              <p className="text-2xl font-bold text-purple-600">
                {pwaStatus.hasNotificationPermission ? "已授权" : "未授权"}
              </p>
            </div>
            {pwaStatus.hasNotificationPermission ? (
              <Bell className="w-8 h-8 text-purple-600" />
            ) : (
              <BellOff className="w-8 h-8 text-gray-400" />
            )}
          </div>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">最后同步</p>
              <p className="text-2xl font-bold text-purple-600">
                {pwaStatus.lastSync ? pwaStatus.lastSync.toLocaleTimeString() : "从未"}
              </p>
            </div>
            <RefreshCw className={`w-8 h-8 text-purple-400 ${isSyncing ? "animate-spin" : ""}`} />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="install" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="install">应用安装</TabsTrigger>
          <TabsTrigger value="cache">缓存管理</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
          <TabsTrigger value="sync">数据同步</TabsTrigger>
        </TabsList>

        <TabsContent value="install" className="space-y-4">
          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-purple-600" />
                PWA应用安装
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${pwaStatus.isInstalled ? "bg-green-100" : "bg-gray-100"}`}>
                    {pwaStatus.isInstalled ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Download className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {pwaStatus.isInstalled ? "应用已安装" : "安装到设备"}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {pwaStatus.isInstalled
                        ? "应用已成功安装到您的设备，可以像原生应用一样使用"
                        : "将应用安装到您的设备，获得更好的使用体验"}
                    </p>
                  </div>
                </div>
                {!pwaStatus.isInstalled && (
                  <Button onClick={installPWA} disabled={isInstalling} className="bg-purple-600 hover:bg-purple-700">
                    {isInstalling ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        安装中...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        立即安装
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-sky-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium">原生体验</h4>
                  </div>
                  <p className="text-sm text-slate-600">像原生应用一样运行，支持全屏模式和系统集成</p>
                </div>

                <div className="p-4 border border-sky-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <WifiOff className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium">离线访问</h4>
                  </div>
                  <p className="text-sm text-slate-600">即使在没有网络的情况下也能正常使用核心功能</p>
                </div>

                <div className="p-4 border border-sky-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium">推送通知</h4>
                  </div>
                  <p className="text-sm text-slate-600">接收重要通知和提醒，不错过任何重要信息</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-6 h-6 text-purple-600" />
                      缓存项目列表
                    </div>
                    <Button variant="outline" size="sm" onClick={() => clearCache()} disabled={isClearing}>
                      {isClearing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {cacheItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {getCacheTypeIcon(item.type)}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-slate-900 text-sm">{item.url}</p>
                                {getCacheTypeBadge(item.type)}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>大小: {formatFileSize(item.size)}</span>
                                <span>访问: {item.lastAccessed.toLocaleString()}</span>
                                <span>过期: {item.expiresAt.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCacheItems((prev) => prev.filter((i) => i.id !== item.id))
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-4">
                <h3 className="font-semibold text-slate-900 mb-3">缓存统计</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">总大小</span>
                    <span className="font-medium">{formatFileSize(pwaStatus.cacheSize)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">项目数量</span>
                    <span className="font-medium">{cacheItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">静态资源</span>
                    <span className="font-medium">{cacheItems.filter((i) => i.type === "static").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">API数据</span>
                    <span className="font-medium">{cacheItems.filter((i) => i.type === "api").length}</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-4">
                <h3 className="font-semibold text-slate-900 mb-3">快速操作</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => clearCache("static")}
                    disabled={isClearing}
                  >
                    <HardDrive className="w-4 h-4 mr-2" />
                    清理静态资源
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => clearCache("api")}
                    disabled={isClearing}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    清理API缓存
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => clearCache("image")}
                    disabled={isClearing}
                  >
                    <Cloud className="w-4 h-4 mr-2" />
                    清理图片缓存
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-purple-600" />
                通知设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!pwaStatus.hasNotificationPermission && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    <div>
                      <h3 className="font-semibold text-yellow-800">需要通知权限</h3>
                      <p className="text-sm text-yellow-700 mt-1">请授权通知权限以接收重要提醒和系统通知</p>
                    </div>
                    <Button onClick={requestNotificationPermission} className="bg-yellow-600 hover:bg-yellow-700">
                      授权通知
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">通知类型</h3>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.types).map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between p-3 border border-sky-200 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">
                            {key === "system" && "系统通知"}
                            {key === "tasks" && "任务提醒"}
                            {key === "customers" && "客户消息"}
                            {key === "sales" && "销售通知"}
                            {key === "reminders" && "日程提醒"}
                          </p>
                          <p className="text-sm text-slate-600">
                            {key === "system" && "系统更新、错误和重要公告"}
                            {key === "tasks" && "任务截止日期和状态变更"}
                            {key === "customers" && "新客户注册和重要消息"}
                            {key === "sales" && "销售目标和业绩提醒"}
                            {key === "reminders" && "会议、跟进和其他日程"}
                          </p>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) => {
                            setNotificationSettings((prev) => ({
                              ...prev,
                              types: { ...prev.types, [key]: checked },
                            }))
                          }}
                          disabled={!pwaStatus.hasNotificationPermission}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">通知时间</h3>
                  <div className="space-y-4 p-4 border border-sky-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">开始时间</label>
                        <input
                          type="time"
                          value={notificationSettings.schedule.start}
                          onChange={(e) => {
                            setNotificationSettings((prev) => ({
                              ...prev,
                              schedule: { ...prev.schedule, start: e.target.value },
                            }))
                          }}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">结束时间</label>
                        <input
                          type="time"
                          value={notificationSettings.schedule.end}
                          onChange={(e) => {
                            setNotificationSettings((prev) => ({
                              ...prev,
                              schedule: { ...prev.schedule, end: e.target.value },
                            }))
                          }}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">周末通知</label>
                      <Switch
                        checked={notificationSettings.schedule.weekends}
                        onCheckedChange={(checked) => {
                          setNotificationSettings((prev) => ({
                            ...prev,
                            schedule: { ...prev.schedule, weekends: checked },
                          }))
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={!pwaStatus.hasNotificationPermission}
                    onClick={() => {
                      if (Notification.permission === "granted") {
                        new Notification("测试通知", {
                          body: "这是一条测试通知，用于验证通知功能是否正常工作",
                          icon: "/images/jinlan-logo-main.png",
                        })
                      }
                    }}
                  >
                    发送测试通知
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-purple-600" />
                数据同步
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">同步状态</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-sky-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${pwaStatus.isOnline ? "bg-green-100" : "bg-red-100"}`}>
                          {pwaStatus.isOnline ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">网络连接</p>
                          <p className="text-sm text-slate-600">{pwaStatus.isOnline ? "已连接到服务器" : "离线模式"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-sky-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Database className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">待同步数据</p>
                          <p className="text-sm text-slate-600">{pwaStatus.pendingUpdates} 项待同步</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        {pwaStatus.pendingUpdates}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-sky-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">最后同步</p>
                          <p className="text-sm text-slate-600">
                            {pwaStatus.lastSync ? pwaStatus.lastSync.toLocaleString() : "从未同步"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">同步操作</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={syncOfflineData}
                      disabled={isSyncing || !pwaStatus.isOnline}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          同步中...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          立即同步
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => {
                        setPwaStatus((prev) => ({ ...prev, pendingUpdates: 0 }))
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      清空待同步队列
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => {
                        // 模拟强制同步
                        setPwaStatus((prev) => ({
                          ...prev,
                          pendingUpdates: Math.floor(Math.random() * 10) + 1,
                        }))
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      同步设置
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">自动同步</h4>
                    <p className="text-sm text-blue-700 mb-3">当网络连接恢复时，系统会自动同步离线期间的数据变更</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">启用自动同步</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

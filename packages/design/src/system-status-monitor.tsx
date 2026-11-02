"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Badge } from "@yyc3/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { toast } from "@yyc3/hooks/use-toast"
import {
  Server,
  Database,
  Wifi,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Zap,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Clock,
  TrendingUp,
  AlertCircle,
  Settings,
  Download,
  Share,
  Filter,
} from "lucide-react"

interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkLoad: number
  uptime: string
  activeConnections: number
  responseTime: number
  errorRate: number
}

interface SystemService {
  name: string
  status: "running" | "stopped" | "warning"
  uptime: string
  lastCheck: string
}

export function SystemStatusMonitor() {
  const router = useRouter()
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    networkLoad: 23,
    uptime: "15天 8小时 32分钟",
    activeConnections: 1247,
    responseTime: 145,
    errorRate: 0.02,
  })
  const [services, setServices] = useState<SystemService[]>([
    { name: "Web服务器", status: "running", uptime: "15天", lastCheck: "刚刚" },
    { name: "数据库", status: "running", uptime: "15天", lastCheck: "1分钟前" },
    { name: "缓存服务", status: "running", uptime: "12天", lastCheck: "刚刚" },
    { name: "消息队列", status: "warning", uptime: "8小时", lastCheck: "2分钟前" },
    { name: "文件存储", status: "running", uptime: "15天", lastCheck: "刚刚" },
    { name: "监控服务", status: "running", uptime: "10天", lastCheck: "30秒前" },
  ])

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + Math.floor(Math.random() * 10) - 5)),
        memoryUsage: Math.max(30, Math.min(85, prev.memoryUsage + Math.floor(Math.random() * 6) - 3)),
        networkLoad: Math.max(10, Math.min(80, prev.networkLoad + Math.floor(Math.random() * 8) - 4)),
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 20) - 10,
        responseTime: Math.max(80, Math.min(300, prev.responseTime + Math.floor(Math.random() * 20) - 10)),
      }))
      setLastUpdate(new Date())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "系统状态已刷新",
        description: "所有监控数据已更新到最新状态",
      })
    } catch (error) {
      toast({
        title: "刷新失败",
        description: "无法获取最新系统状态",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleOptimize = () => {
    toast({
      title: "系统优化已启动",
      description: "正在清理缓存和优化性能...",
    })
    router.push("/performance-optimization")
  }

  const handleSecurityScan = () => {
    toast({
      title: "安全扫描已开始",
      description: "正在检查系统安全状态...",
    })
    router.push("/security")
  }

  const handleExport = () => {
    toast({
      title: "导出成功",
      description: "系统监控报告已生成并开始下载",
    })
  }

  const handleShare = () => {
    toast({
      title: "分享成功",
      description: "系统状态数据已生成分享链接",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "stopped":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return CheckCircle
      case "warning":
        return AlertTriangle
      case "stopped":
        return XCircle
      default:
        return AlertCircle
    }
  }

  const getMetricColor = (value: number, type: string) => {
    if (type === "error" && value > 0.05) return "text-red-600"
    if (type === "response" && value > 200) return "text-yellow-600"
    if (value > 80) return "text-red-600"
    if (value > 60) return "text-yellow-600"
    return "text-green-600"
  }

  // 统一的彩色进度条组件
  const ColoredProgress = ({ value, color }: { value: number; color: string }) => {
    return (
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    )
  }

  // 统一的按钮样式
  const buttonStyles = {
    primary:
      "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200",
    outline:
      "border border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 bg-white shadow-sm hover:shadow-md transition-all duration-200",
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">系统监控</h1>
          <p className="text-slate-600 mt-1">实时监控系统运行状态和性能指标</p>
        </div>
        <div className="flex items-center text-sm text-slate-500">
          <Clock className="w-4 h-4 mr-1" />
          最后更新: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={handleRefresh} disabled={isRefreshing} className={buttonStyles.outline}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            刷新状态
          </Button>
          <Button onClick={handleExport} className={buttonStyles.outline}>
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
          <Button onClick={handleShare} className={buttonStyles.outline}>
            <Share className="w-4 h-4 mr-2" />
            分享数据
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" className={buttonStyles.outline}>
            <Filter className="w-4 h-4 mr-1" />
            筛选
          </Button>
          <Button size="sm" onClick={() => router.push("/settings")} className={buttonStyles.outline}>
            <Settings className="w-4 h-4 mr-1" />
            设置
          </Button>
          <Button size="sm" onClick={handleOptimize} className={buttonStyles.outline}>
            <Zap className="w-4 h-4 mr-1" />
            系统优化
          </Button>
          <Button size="sm" onClick={handleSecurityScan} className={buttonStyles.outline}>
            <Shield className="w-4 h-4 mr-1" />
            安全扫描
          </Button>
        </div>
      </div>

      {/* 系统概览指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className="border-l-4 border-l-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => router.push("/performance-optimization")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU使用率</CardTitle>
            <Cpu className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.cpuUsage, "cpu")}`}>{metrics.cpuUsage}%</div>
            <ColoredProgress
              value={metrics.cpuUsage}
              color={
                metrics.cpuUsage > 80
                  ? "bg-gradient-to-r from-red-400 to-red-500"
                  : metrics.cpuUsage > 60
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                    : "bg-gradient-to-r from-blue-400 to-blue-500"
              }
            />
            <p className="text-xs text-gray-500 mt-1">8核心处理器</p>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-green-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => router.push("/performance-optimization")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">内存使用率</CardTitle>
            <MemoryStick className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.memoryUsage, "memory")}`}>
              {metrics.memoryUsage}%
            </div>
            <ColoredProgress
              value={metrics.memoryUsage}
              color={
                metrics.memoryUsage > 80
                  ? "bg-gradient-to-r from-red-400 to-red-500"
                  : metrics.memoryUsage > 60
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                    : "bg-gradient-to-r from-green-400 to-green-500"
              }
            />
            <p className="text-xs text-gray-500 mt-1">16GB 总内存</p>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-orange-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => router.push("/data-integration")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">磁盘使用率</CardTitle>
            <HardDrive className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.diskUsage, "disk")}`}>
              {metrics.diskUsage}%
            </div>
            <ColoredProgress
              value={metrics.diskUsage}
              color={
                metrics.diskUsage > 80
                  ? "bg-gradient-to-r from-red-400 to-red-500"
                  : metrics.diskUsage > 60
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                    : "bg-gradient-to-r from-orange-400 to-orange-500"
              }
            />
            <p className="text-xs text-gray-500 mt-1">500GB SSD</p>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-purple-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => router.push("/system-testing")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">网络负载</CardTitle>
            <Network className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.networkLoad, "network")}`}>
              {metrics.networkLoad}%
            </div>
            <ColoredProgress
              value={metrics.networkLoad}
              color={
                metrics.networkLoad > 80
                  ? "bg-gradient-to-r from-red-400 to-red-500"
                  : metrics.networkLoad > 60
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                    : "bg-gradient-to-r from-purple-400 to-purple-500"
              }
            />
            <p className="text-xs text-gray-500 mt-1">平均延迟: {metrics.responseTime}ms</p>
          </CardContent>
        </Card>
      </div>

      {/* 详细监控信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 系统服务状态 */}
        <Card className="border-t-4 border-t-blue-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-600" />
              系统服务状态
            </CardTitle>
            <CardDescription>各项系统服务运行状态监控</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service, index) => {
                const StatusIcon = getStatusIcon(service.status)
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      if (service.name === "数据库") router.push("/data-integration")
                      else if (service.name === "Web服务器") router.push("/system-testing")
                      else router.push("/performance-optimization")
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon
                        className={`w-5 h-5 ${service.status === "running" ? "text-green-600" : service.status === "warning" ? "text-yellow-600" : "text-red-600"}`}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-500">运行时间: {service.uptime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(service.status)}>
                        {service.status === "running" ? "正常" : service.status === "warning" ? "警告" : "停止"}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{service.lastCheck}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 性能指标 */}
        <Card className="border-t-4 border-t-green-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              性能指标
            </CardTitle>
            <CardDescription>系统性能关键指标监控</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => router.push("/system-testing")}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">系统运行时间</p>
                    <p className="text-sm text-gray-500">连续运行时长</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">{metrics.uptime}</p>
                </div>
              </div>

              <div
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => router.push("/customers")}
              >
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">活跃连接数</p>
                    <p className="text-sm text-gray-500">当前并发连接</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{metrics.activeConnections.toLocaleString()}</p>
                </div>
              </div>

              <div
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => router.push("/performance-optimization")}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">平均响应时间</p>
                    <p className="text-sm text-gray-500">API响应延迟</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${getMetricColor(metrics.responseTime, "response")}`}>
                    {metrics.responseTime}ms
                  </p>
                </div>
              </div>

              <div
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => router.push("/security")}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium">错误率</p>
                    <p className="text-sm text-gray-500">系统错误百分比</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${getMetricColor(metrics.errorRate * 100, "error")}`}>
                    {(metrics.errorRate * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 监控详情标签页 */}
      <Card className="border-t-4 border-t-purple-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            详细监控
          </CardTitle>
          <CardDescription>系统各组件详细监控信息</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">性能</TabsTrigger>
              <TabsTrigger value="security">安全</TabsTrigger>
              <TabsTrigger value="logs">日志</TabsTrigger>
              <TabsTrigger value="alerts">告警</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="p-4 bg-blue-50 rounded-lg cursor-pointer hover:shadow-md transition-all"
                  onClick={() => router.push("/performance-optimization")}
                >
                  <h4 className="font-semibold text-blue-900 mb-2">CPU性能</h4>
                  <p className="text-sm text-blue-700">当前负载: {metrics.cpuUsage}%</p>
                  <p className="text-sm text-blue-700">平均负载: 42%</p>
                  <p className="text-sm text-blue-700">温度: 65°C</p>
                </div>
                <div
                  className="p-4 bg-green-50 rounded-lg cursor-pointer hover:shadow-md transition-all"
                  onClick={() => router.push("/performance-optimization")}
                >
                  <h4 className="font-semibold text-green-900 mb-2">内存性能</h4>
                  <p className="text-sm text-green-700">已用内存: {metrics.memoryUsage}%</p>
                  <p className="text-sm text-green-700">可用内存: {100 - metrics.memoryUsage}%</p>
                  <p className="text-sm text-green-700">缓存命中率: 94.2%</p>
                </div>
                <div
                  className="p-4 bg-orange-50 rounded-lg cursor-pointer hover:shadow-md transition-all"
                  onClick={() => router.push("/data-integration")}
                >
                  <h4 className="font-semibold text-orange-900 mb-2">磁盘I/O</h4>
                  <p className="text-sm text-orange-700">使用率: {metrics.diskUsage}%</p>
                  <p className="text-sm text-orange-700">IOPS: 1,250</p>
                  <p className="text-sm text-orange-700">读写速度: 500MB/s</p>
                </div>
                <div
                  className="p-4 bg-purple-50 rounded-lg cursor-pointer hover:shadow-md transition-all"
                  onClick={() => router.push("/system-testing")}
                >
                  <h4 className="font-semibold text-purple-900 mb-2">网络性能</h4>
                  <p className="text-sm text-purple-700">负载: {metrics.networkLoad}%</p>
                  <p className="text-sm text-purple-700">延迟: {metrics.responseTime}ms</p>
                  <p className="text-sm text-purple-700">带宽: 1Gbps</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">安全监控面板</p>
                <p className="text-sm text-gray-500 mt-2">防火墙状态、入侵检测、安全扫描结果</p>
                <Button onClick={() => router.push("/security")} className={`${buttonStyles.outline} mt-4`}>
                  查看安全详情
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="logs">
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">系统日志查看器</p>
                <p className="text-sm text-gray-500 mt-2">应用日志、错误日志、访问日志</p>
                <Button
                  onClick={() => toast({ title: "功能开发中", description: "日志查看功能即将上线" })}
                  className={`${buttonStyles.outline} mt-4`}
                >
                  查看系统日志
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="alerts">
              <div className="space-y-3">
                <div
                  className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => router.push("/data-integration")}
                >
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">磁盘空间警告</p>
                    <p className="text-xs text-slate-500">备份磁盘使用率达到85%，建议清理旧文件</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300">警告</Badge>
                </div>
                <div
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => router.push("/system-testing")}
                >
                  <Wifi className="w-5 h-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">网络连接</p>
                    <p className="text-xs text-slate-500">检测到间歇性网络延迟，正在监控中</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">监控</Badge>
                </div>
                <div
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => router.push("/system-management")}
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">系统更新</p>
                    <p className="text-xs text-slate-500">所有系统组件已更新到最新版本</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">正常</Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

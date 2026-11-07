"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Progress } from "@yyc3/ui-enterprise/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
} from "recharts"
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Server,
  Globe,
  Monitor,
  Smartphone,
  BarChart3,
  Eye,
  RefreshCw,
} from "lucide-react"

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  target: number
  description: string
}

interface SystemResource {
  name: string
  usage: number
  available: number
  total: number
  processes: number
}

interface PagePerformance {
  page: string
  loadTime: number
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  cls: number // Cumulative Layout Shift
  fid: number // First Input Delay
  score: number
}

interface NetworkMetric {
  timestamp: string
  latency: number
  throughput: number
  errors: number
  requests: number
}

export function PerformanceMonitoringDashboard() {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    {
      name: "响应时间",
      value: 245,
      unit: "ms",
      status: "good",
      trend: "down",
      target: 300,
      description: "平均API响应时间",
    },
    {
      name: "吞吐量",
      value: 1250,
      unit: "req/min",
      status: "good",
      trend: "up",
      target: 1000,
      description: "每分钟处理请求数",
    },
    {
      name: "错误率",
      value: 0.8,
      unit: "%",
      status: "good",
      trend: "down",
      target: 1.0,
      description: "请求错误百分比",
    },
    {
      name: "可用性",
      value: 99.95,
      unit: "%",
      status: "good",
      trend: "stable",
      target: 99.9,
      description: "系统正常运行时间",
    },
  ])

  const [systemResources, setSystemResources] = useState<SystemResource[]>([
    {
      name: "CPU",
      usage: 45.2,
      available: 54.8,
      total: 100,
      processes: 156,
    },
    {
      name: "内存",
      usage: 68.5,
      available: 31.5,
      total: 100,
      processes: 89,
    },
    {
      name: "磁盘",
      usage: 32.1,
      available: 67.9,
      total: 100,
      processes: 23,
    },
    {
      name: "网络",
      usage: 15.8,
      available: 84.2,
      total: 100,
      processes: 45,
    },
  ])

  const [pagePerformance, setPagePerformance] = useState<PagePerformance[]>([
    {
      page: "/dashboard",
      loadTime: 1.2,
      fcp: 0.8,
      lcp: 1.1,
      cls: 0.05,
      fid: 12,
      score: 95,
    },
    {
      page: "/customers",
      loadTime: 1.8,
      fcp: 1.2,
      lcp: 1.6,
      cls: 0.08,
      fid: 18,
      score: 88,
    },
    {
      page: "/analytics",
      loadTime: 2.1,
      fcp: 1.5,
      lcp: 1.9,
      cls: 0.12,
      fid: 25,
      score: 82,
    },
    {
      page: "/settings",
      loadTime: 0.9,
      fcp: 0.6,
      lcp: 0.8,
      cls: 0.03,
      fid: 8,
      score: 98,
    },
  ])

  const [networkData, setNetworkData] = useState<NetworkMetric[]>([
    { timestamp: "00:00", latency: 45, throughput: 1200, errors: 2, requests: 1250 },
    { timestamp: "00:05", latency: 52, throughput: 1180, errors: 3, requests: 1220 },
    { timestamp: "00:10", latency: 38, throughput: 1350, errors: 1, requests: 1380 },
    { timestamp: "00:15", latency: 41, throughput: 1280, errors: 2, requests: 1300 },
    { timestamp: "00:20", latency: 47, throughput: 1220, errors: 4, requests: 1260 },
    { timestamp: "00:25", latency: 35, throughput: 1420, errors: 1, requests: 1450 },
  ])

  const [isMonitoring, setIsMonitoring] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)

  // 模拟实时数据更新
  useEffect(() => {
    if (!isMonitoring || !autoRefresh) return

    const interval = setInterval(() => {
      // 更新性能指标
      setPerformanceMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * (metric.value * 0.1),
        })),
      )

      // 更新系统资源
      setSystemResources((prev) =>
        prev.map((resource) => ({
          ...resource,
          usage: Math.max(0, Math.min(100, resource.usage + (Math.random() - 0.5) * 10)),
        })),
      )

      // 更新网络数据
      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      setNetworkData((prev) => {
        const newData = [
          ...prev.slice(1),
          {
            timestamp: timeStr,
            latency: 30 + Math.random() * 30,
            throughput: 1000 + Math.random() * 500,
            errors: Math.floor(Math.random() * 5),
            requests: 1200 + Math.random() * 300,
          },
        ]
        return newData
      })
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [isMonitoring, autoRefresh, refreshInterval])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      case "stable":
        return <div className="w-4 h-1 bg-gray-400 rounded" />
      default:
        return null
    }
  }

  const getResourceIcon = (name: string) => {
    switch (name) {
      case "CPU":
        return <Cpu className="w-5 h-5" />
      case "内存":
        return <Server className="w-5 h-5" />
      case "磁盘":
        return <HardDrive className="w-5 h-5" />
      case "网络":
        return <Wifi className="w-5 h-5" />
      default:
        return <Activity className="w-5 h-5" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const averageScore = Math.round(pagePerformance.reduce((sum, page) => sum + page.score, 0) / pagePerformance.length)

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">性能监控中心</h1>
          <p className="text-slate-600 mt-2">实时系统性能监控和优化建议</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={isMonitoring ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            <Activity className="w-4 h-4 mr-1" />
            {isMonitoring ? "监控中" : "已停止"}
          </Badge>
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-blue-50 border-blue-200" : ""}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            自动刷新
          </Button>
          <Button variant={isMonitoring ? "destructive" : "default"} onClick={() => setIsMonitoring(!isMonitoring)}>
            {isMonitoring ? "停止监控" : "开始监控"}
          </Button>
        </div>
      </div>

      {/* 核心性能指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-600">{metric.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                      {metric.value.toFixed(metric.name === "错误率" || metric.name === "可用性" ? 2 : 0)}
                    </p>
                    <span className="text-sm text-slate-500">{metric.unit}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
                <Badge className={getStatusBadgeColor(metric.status)}>
                  {metric.status === "good" ? "正常" : metric.status === "warning" ? "警告" : "严重"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>
                    目标: {metric.target}
                    {metric.unit}
                  </span>
                  <span>{((metric.value / metric.target) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={Math.min(100, (metric.value / metric.target) * 100)} className="h-2" />
              </div>
              <p className="text-xs text-slate-500 mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="realtime" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="realtime">实时监控</TabsTrigger>
          <TabsTrigger value="resources">系统资源</TabsTrigger>
          <TabsTrigger value="pages">页面性能</TabsTrigger>
          <TabsTrigger value="network">网络分析</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 响应时间趋势 */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-600" />
                  响应时间趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={networkData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="latency" stroke="#10b981" strokeWidth={2} name="延迟 (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 吞吐量分析 */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-600" />
                  吞吐量分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={networkData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="throughput"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      name="吞吐量 (req/min)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* 错误率监控 */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                错误率监控
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={networkData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="errors" fill="#ef4444" name="错误数量" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemResources.map((resource, index) => (
              <Card key={index} className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getResourceIcon(resource.name)}
                      <span className="ml-2">{resource.name}使用率</span>
                    </div>
                    <Badge
                      className={
                        resource.usage < 50
                          ? "bg-green-100 text-green-800"
                          : resource.usage < 80
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {resource.usage.toFixed(1)}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>已使用</span>
                      <span>{resource.usage.toFixed(1)}%</span>
                    </div>
                    <Progress value={resource.usage} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">可用</span>
                      <p className="font-medium">{resource.available.toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-slate-600">进程数</span>
                      <p className="font-medium">{resource.processes}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>状态</span>
                      <div className="flex items-center">
                        {resource.usage < 50 ? (
                          <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                        ) : resource.usage < 80 ? (
                          <AlertTriangle className="w-3 h-3 text-yellow-600 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-red-600 mr-1" />
                        )}
                        <span>{resource.usage < 50 ? "正常" : resource.usage < 80 ? "警告" : "严重"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Monitor className="w-5 h-5 mr-2 text-indigo-600" />
                  页面性能评分
                </div>
                <Badge className={`${getScoreColor(averageScore)} bg-opacity-10`}>平均分: {averageScore}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pagePerformance.map((page, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-900">{page.page}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-2xl font-bold ${getScoreColor(page.score)}`}>{page.score}</span>
                        <Badge
                          className={
                            page.score >= 90
                              ? "bg-green-100 text-green-800"
                              : page.score >= 80
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {page.score >= 90 ? "优秀" : page.score >= 80 ? "良好" : "需改进"}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">加载时间</span>
                        <p className="font-medium">{page.loadTime}s</p>
                      </div>
                      <div>
                        <span className="text-slate-600">FCP</span>
                        <p className="font-medium">{page.fcp}s</p>
                      </div>
                      <div>
                        <span className="text-slate-600">LCP</span>
                        <p className="font-medium">{page.lcp}s</p>
                      </div>
                      <div>
                        <span className="text-slate-600">CLS</span>
                        <p className="font-medium">{page.cls}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">FID</span>
                        <p className="font-medium">{page.fid}ms</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress value={page.score} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 网络延迟分布 */}
            <Card className="border-l-4 border-l-cyan-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-cyan-600" />
                  网络延迟分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "< 50ms", value: 65, fill: "#10b981" },
                        { name: "50-100ms", value: 25, fill: "#f59e0b" },
                        { name: "100-200ms", value: 8, fill: "#ef4444" },
                        { name: "> 200ms", value: 2, fill: "#dc2626" },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    ></Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 设备类型分析 */}
            <Card className="border-l-4 border-l-pink-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-pink-600" />
                  设备类型分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 mr-2 text-slate-600" />
                      <span className="text-sm">桌面端</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">45%</span>
                      <Progress value={45} className="w-20 h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="w-4 h-4 mr-2 text-slate-600" />
                      <span className="text-sm">移动端</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">35%</span>
                      <Progress value={35} className="w-20 h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 mr-2 text-slate-600" />
                      <span className="text-sm">平板端</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">20%</span>
                      <Progress value={20} className="w-20 h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 网络质量评估 */}
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-teal-600" />
                网络质量评估
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">A+</div>
                  <div className="text-sm text-slate-600">整体评级</div>
                  <Progress value={95} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">42ms</div>
                  <div className="text-sm text-slate-600">平均延迟</div>
                  <Progress value={85} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.8%</div>
                  <div className="text-sm text-slate-600">连接成功率</div>
                  <Progress value={99.8} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 性能优化建议 */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2 text-orange-600" />
            性能优化建议
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                已优化项目
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  启用了Gzip压缩，减少传输大小
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  实现了代码分割和懒加载
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  优化了图片格式和大小
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  配置了CDN加速
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-orange-800 mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                待优化项目
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  实现Service Worker离线缓存
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  优化数据库查询性能
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  减少第三方脚本加载
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  实现预加载关键资源
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

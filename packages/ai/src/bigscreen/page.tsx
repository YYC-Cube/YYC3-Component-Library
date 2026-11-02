"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import AlertSystem from "@/components/monitoring/alert-system"
import {
  Monitor,
  Activity,
  Database,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Maximize2,
  Minimize2,
} from "lucide-react"

export default function BigScreenPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const metrics = [
    { label: "在线用户", value: "1,247", change: "+12%", trend: "up" },
    { label: "数据处理量", value: "2.4TB", change: "+8%", trend: "up" },
    { label: "API调用", value: "45.2K", change: "-3%", trend: "down" },
    { label: "系统负载", value: "67%", change: "+5%", trend: "up" },
  ]

  const systemStatus = [
    { name: "数据库集群", status: "正常", uptime: "99.9%" },
    { name: "API网关", status: "正常", uptime: "99.8%" },
    { name: "缓存服务", status: "警告", uptime: "98.5%" },
    { name: "消息队列", status: "正常", uptime: "99.7%" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Monitor className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold">YYC³ EasyVizAI 监控大屏</h1>
                <p className="text-sm text-blue-200">实时数据可视化监控中心</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-mono">{currentTime.toLocaleTimeString()}</div>
                <div className="text-sm text-blue-200">{currentTime.toLocaleDateString()}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-black/30 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-200">{metric.label}</p>
                    <p className="text-3xl font-bold text-white">{metric.value}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={metric.trend === "up" ? "default" : "destructive"}
                      className={
                        metric.trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }
                    >
                      {metric.change}
                    </Badge>
                    <TrendingUp
                      className={`h-6 w-6 mt-2 ${metric.trend === "up" ? "text-green-400" : "text-red-400"}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Real-time Chart */}
          <Card className="lg:col-span-2 bg-black/30 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-400" />
                实时数据流
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-pulse" />
                  <p className="text-blue-200">实时数据可视化图表</p>
                  <p className="text-sm text-blue-300 mt-2">数据更新频率: 每秒</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="h-5 w-5 mr-2 text-green-400" />
                系统状态
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemStatus.map((system, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {system.status === "正常" ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    )}
                    <span className="text-sm text-white">{system.name}</span>
                  </div>
                  <Badge
                    variant={system.status === "正常" ? "default" : "secondary"}
                    className={
                      system.status === "正常" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }
                  >
                    {system.uptime}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <AlertSystem />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-sm">CPU 使用率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">当前</span>
                  <span className="text-white">67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-sm">内存使用率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">当前</span>
                  <span className="text-white">54%</span>
                </div>
                <Progress value={54} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-sm">网络流量</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">当前</span>
                  <span className="text-white">2.4 GB/s</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm border-t border-white/10 px-6 py-2 z-20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">系统运行正常</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-blue-200">运行时间: 127天 14小时 32分钟</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-blue-200">版本: v1.0.0</span>
            <span className="text-blue-200">最后更新: {currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

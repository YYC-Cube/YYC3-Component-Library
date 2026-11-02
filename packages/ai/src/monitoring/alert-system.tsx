"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, XCircle, Bell, BellOff, TrendingUp, TrendingDown, Activity } from "lucide-react"

interface Alert {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  message: string
  timestamp: Date
  source: string
  acknowledged: boolean
  value?: number
  threshold?: number
}

export default function AlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    const generateAlert = (): Alert => {
      const alertTypes = ["critical", "warning", "info"] as const
      const sources = ["数据库", "API网关", "缓存服务", "消息队列", "AI模型", "用户系统"]
      const messages = {
        critical: ["服务器响应超时", "数据库连接失败", "内存使用率超过90%", "API错误率过高"],
        warning: ["CPU使用率偏高", "磁盘空间不足", "网络延迟增加", "缓存命中率下降"],
        info: ["系统更新完成", "备份任务成功", "新用户注册", "数据同步完成"],
      }

      const type = alertTypes[Math.floor(Math.random() * alertTypes.length)]
      const source = sources[Math.floor(Math.random() * sources.length)]
      const messageList = messages[type]
      const message = messageList[Math.floor(Math.random() * messageList.length)]

      return {
        id: Math.random().toString(36).substr(2, 9),
        type,
        title: `${source}${type === "critical" ? "严重告警" : type === "warning" ? "警告" : "信息"}`,
        message,
        timestamp: new Date(),
        source,
        acknowledged: false,
        value: Math.floor(Math.random() * 100),
        threshold: type === "critical" ? 90 : type === "warning" ? 75 : 50,
      }
    }

    // Initial alerts
    const initialAlerts = Array.from({ length: 5 }, generateAlert)
    setAlerts(initialAlerts)

    // Auto-generate new alerts
    const interval = setInterval(() => {
      if (autoRefresh && Math.random() > 0.7) {
        const newAlert = generateAlert()
        setAlerts((prev) => [newAlert, ...prev.slice(0, 19)]) // Keep only latest 20 alerts

        // Play sound for critical alerts
        if (soundEnabled && newAlert.type === "critical") {
          // In a real app, you would play an actual sound file
          console.log("[v0] Critical alert sound would play here")
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [autoRefresh, soundEnabled])

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const clearAllAlerts = () => {
    setAlerts([])
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      default:
        return <CheckCircle className="h-4 w-4 text-blue-400" />
    }
  }

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  }

  const criticalCount = alerts.filter((a) => a.type === "critical" && !a.acknowledged).length
  const warningCount = alerts.filter((a) => a.type === "warning" && !a.acknowledged).length

  return (
    <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-red-400" />
            实时告警监控
            {(criticalCount > 0 || warningCount > 0) && (
              <div className="flex items-center ml-3 space-x-2">
                {criticalCount > 0 && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                    {criticalCount} 严重
                  </Badge>
                )}
                {warningCount > 0 && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{warningCount} 警告</Badge>
                )}
              </div>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-white hover:bg-white/10"
            >
              {soundEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAllAlerts} className="text-white hover:bg-white/10">
              清空
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <p className="text-green-400">系统运行正常，暂无告警</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                alert.acknowledged
                  ? "bg-gray-500/10 border-gray-500/20 opacity-60"
                  : alert.type === "critical"
                    ? "bg-red-500/10 border-red-500/20 animate-pulse"
                    : alert.type === "warning"
                      ? "bg-yellow-500/10 border-yellow-500/20"
                      : "bg-blue-500/10 border-blue-500/20"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-white font-medium text-sm">{alert.title}</h4>
                      <Badge className={getAlertBadgeColor(alert.type)}>
                        {alert.type === "critical" ? "严重" : alert.type === "warning" ? "警告" : "信息"}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{alert.message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>来源: {alert.source}</span>
                      <span>{alert.timestamp.toLocaleTimeString()}</span>
                    </div>
                    {alert.value && alert.threshold && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs text-gray-400">当前值:</span>
                        <span className="text-white text-sm font-mono">{alert.value}%</span>
                        <span className="text-xs text-gray-400">阈值:</span>
                        <span className="text-gray-300 text-sm font-mono">{alert.threshold}%</span>
                        {alert.value > alert.threshold ? (
                          <TrendingUp className="h-3 w-3 text-red-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-green-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {!alert.acknowledged && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="text-white hover:bg-white/10 ml-2"
                  >
                    确认
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

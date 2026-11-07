"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { Progress } from "@yyc3/ui-enterprise/progress"
import { Alert, AlertDescription } from "@yyc3/ui-enterprise/alert"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Bell,
  BarChart3,
  Shield,
  Play,
} from "lucide-react"
import {
  PredictiveMaintenanceService,
  type MetricDefinition,
  type MetricDataPoint,
  type Anomaly,
  type TrendPredictionResult,
} from "@yyc3/lib/ai/predictive-maintenance"

// 预测性维护控制面板组件
export default function PredictiveMaintenanceDashboard() {
  // 状态管理
  const [selectedCategory, setSelectedCategory] = useState("system")
  const [metrics, setMetrics] = useState<MetricDefinition[]>([])
  const [realtimeData, setRealtimeData] = useState<Map<string, MetricDataPoint[]>>(new Map())
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [predictions, setPredictions] = useState<Map<string, TrendPredictionResult>>(new Map())
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // 获取预测性维护服务实例
  const maintenanceService = PredictiveMaintenanceService.getInstance()

  // 初始化数据
  useEffect(() => {
    const allMetrics = maintenanceService.getMonitoredMetrics()
    setMetrics(allMetrics)

    // 生成模拟实时数据
    generateMockData()
  }, [maintenanceService])

  // 生成模拟数据
  const generateMockData = useCallback(() => {
    const mockData = new Map<string, MetricDataPoint[]>()
    const allMetrics = maintenanceService.getMonitoredMetrics()

    allMetrics.forEach((metric) => {
      const dataPoints: MetricDataPoint[] = []
      const now = new Date()

      // 生成最近1小时的数据点（每分钟一个）
      for (let i = 60; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 1000)
        let value: number

        // 根据指标类型生成不同的模拟数据
        switch (metric.id) {
          case "cpu_usage":
            value = 30 + Math.random() * 40 + Math.sin(i / 10) * 10
            break
          case "memory_usage":
            value = 50 + Math.random() * 30 + Math.sin(i / 15) * 15
            break
          case "disk_usage":
            value = 60 + Math.random() * 20
            break
          case "network_traffic":
            value = Math.random() * 50 + Math.sin(i / 5) * 20
            break
          case "api_latency":
            value = 100 + Math.random() * 200 + Math.sin(i / 8) * 50
            break
          case "error_rate":
            value = Math.random() * 2
            break
          case "database_connections":
            value = 20 + Math.random() * 30
            break
          case "database_query_time":
            value = 50 + Math.random() * 100
            break
          case "model_inference_time":
            value = 200 + Math.random() * 400
            break
          case "model_error_rate":
            value = Math.random() * 3
            break
          default:
            value = Math.random() * 100
        }

        dataPoints.push({
          metricId: metric.id,
          value: Math.max(0, value),
          timestamp,
          tags: { source: "mock" },
        })
      }

      mockData.set(metric.id, dataPoints)

      // 记录数据点到服务中
      maintenanceService.recordMetricDataPoints(dataPoints)
    })

    setRealtimeData(mockData)
    setLastUpdate(new Date())
  }, [maintenanceService])

  // 检测异常
  const detectAnomalies = useCallback(async () => {
    const detectedAnomalies: Anomaly[] = []

    for (const [metricId, dataPoints] of realtimeData.entries()) {
      try {
        const result = await maintenanceService.detectAnomalies(metricId, dataPoints)
        detectedAnomalies.push(...result.anomalies)
      } catch (error) {
        console.error(`检测异常失败 (${metricId}):`, error)
      }
    }

    setAnomalies(detectedAnomalies)
  }, [realtimeData, maintenanceService])

  // 预测趋势
  const predictTrends = useCallback(async () => {
    const trendPredictions = new Map<string, TrendPredictionResult>()

    for (const metric of metrics) {
      try {
        const prediction = await maintenanceService.predictTrend(metric.id, 1, 6) // 基于1小时历史预测6小时
        trendPredictions.set(metric.id, prediction)
      } catch (error) {
        console.error(`预测趋势失败 (${metric.id}):`, error)
      }
    }

    setPredictions(trendPredictions)
  }, [metrics, maintenanceService])

  // 开始监控
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)

    // 每30秒更新一次数据
    const interval = setInterval(() => {
      generateMockData()
      detectAnomalies()
    }, 30000)

    // 每5分钟预测一次趋势
    const predictionInterval = setInterval(() => {
      predictTrends()
    }, 300000)

    // 立即执行一次
    detectAnomalies()
    predictTrends()

    // 返回清理函数
    return () => {
      clearInterval(interval)
      clearInterval(predictionInterval)
      setIsMonitoring(false)
    }
  }, [generateMockData, detectAnomalies, predictTrends, maintenanceService])

  // 停止监控
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
  }, [])

  // 获取指标当前值
  const getCurrentValue = (metricId: string): number => {
    const dataPoints = realtimeData.get(metricId)
    return dataPoints && dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].value : 0
  }

  // 获取指标状态
  const getMetricStatus = (metric: MetricDefinition): "normal" | "warning" | "critical" => {
    const currentValue = getCurrentValue(metric.id)
    const threshold = maintenanceService.getAlertThreshold(metric.id)

    if (!threshold) return "normal"

    if (currentValue >= threshold.critical) return "critical"
    if (currentValue >= threshold.warning) return "warning"
    return "normal"
  }

  // 获取趋势图标
  const getTrendIcon = (metricId: string) => {
    const prediction = predictions.get(metricId)
    if (!prediction) return <Minus className="h-4 w-4" />

    switch (prediction.trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  // 获取风险等级颜色
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-green-600 bg-green-50"
    }
  }

  // 过滤指标
  const filteredMetrics = metrics.filter((metric) => selectedCategory === "all" || metric.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">预测性维护</h1>
            <p className="text-gray-600">智能监控系统健康状态，预测潜在故障</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            variant={isMonitoring ? "destructive" : "default"}
            className="flex items-center space-x-2"
          >
            {isMonitoring ? (
              <>
                <Activity className="h-4 w-4" />
                <span>停止监控</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>开始监控</span>
              </>
            )}
          </Button>
          <Button onClick={generateMockData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 监控状态 */}
      {isMonitoring && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>系统监控中... 最后更新: {lastUpdate.toLocaleTimeString()}</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">实时监控</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* 异常告警 */}
      {anomalies.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">检测到 {anomalies.length} 个异常:</p>
              {anomalies.slice(0, 3).map((anomaly, index) => (
                <div key={index} className="text-sm">
                  • {anomaly.description}
                </div>
              ))}
              {anomalies.length > 3 && <p className="text-sm">还有 {anomalies.length - 3} 个异常...</p>}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* 指标分类选择 */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="system">系统</TabsTrigger>
          <TabsTrigger value="application">应用</TabsTrigger>
          <TabsTrigger value="database">数据库</TabsTrigger>
          <TabsTrigger value="ai">AI模型</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {/* 指标卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMetrics.map((metric) => {
              const currentValue = getCurrentValue(metric.id)
              const status = getMetricStatus(metric)
              const prediction = predictions.get(metric.id)

              return (
                <Card key={metric.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(metric.id)}
                        <Badge
                          variant={
                            status === "critical" ? "destructive" : status === "warning" ? "secondary" : "outline"
                          }
                          className="text-xs"
                        >
                          {status === "critical" ? "严重" : status === "warning" ? "警告" : "正常"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* 当前值 */}
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">{currentValue.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">{metric.unit}</span>
                    </div>

                    {/* 进度条 */}
                    <div className="space-y-1">
                      <Progress value={(currentValue / metric.normalRange.max) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{metric.normalRange.min}</span>
                        <span>{metric.normalRange.max}</span>
                      </div>
                    </div>

                    {/* 预测信息 */}
                    {prediction && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>异常风险:</span>
                          <Badge variant="outline" className={getRiskColor(prediction.anomalyRisk)}>
                            {prediction.anomalyRisk === "high"
                              ? "高"
                              : prediction.anomalyRisk === "medium"
                                ? "中"
                                : "低"}
                          </Badge>
                        </div>
                        {prediction.recommendations.length > 0 && (
                          <div className="text-xs text-gray-600">建议: {prediction.recommendations[0]}</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* 详细分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 异常历史 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>异常历史</span>
            </CardTitle>
            <CardDescription>最近检测到的系统异常记录</CardDescription>
          </CardHeader>
          <CardContent>
            {anomalies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>系统运行正常，未检测到异常</p>
              </div>
            ) : (
              <div className="space-y-3">
                {anomalies.slice(0, 5).map((anomaly, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <AlertTriangle
                      className={`h-4 w-4 mt-0.5 ${
                        anomaly.severity === "critical" ? "text-red-500" : "text-yellow-500"
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{anomaly.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{anomaly.timestamp.toLocaleString()}</span>
                        <Badge variant="outline" className="text-xs">
                          {anomaly.value.toFixed(1)}
                          {metrics.find((m) => m.id === anomaly.metricId)?.unit}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 趋势预测 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>趋势预测</span>
            </CardTitle>
            <CardDescription>基于历史数据的未来趋势预测</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(predictions.entries())
                .slice(0, 4)
                .map(([metricId, prediction]) => {
                  const metric = metrics.find((m) => m.id === metricId)
                  if (!metric) return null

                  return (
                    <div key={metricId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(metricId)}
                          <Badge variant="outline" className={getRiskColor(prediction.anomalyRisk)}>
                            {prediction.anomalyRisk === "high"
                              ? "高风险"
                              : prediction.anomalyRisk === "medium"
                                ? "中风险"
                                : "低风险"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        预测趋势:{" "}
                        {prediction.trend === "increasing"
                          ? "上升"
                          : prediction.trend === "decreasing"
                            ? "下降"
                            : "稳定"}
                      </div>
                      {prediction.recommendations.length > 0 && (
                        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                          💡 {prediction.recommendations[0]}
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

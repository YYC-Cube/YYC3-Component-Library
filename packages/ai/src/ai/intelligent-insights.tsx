"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, BarChart3, Activity, Zap } from "lucide-react"

interface Insight {
  id: string
  type: "trend" | "anomaly" | "prediction" | "recommendation"
  title: string
  description: string
  confidence: number
  impact: "high" | "medium" | "low"
  actionable: boolean
  data?: any
}

interface IntelligentInsightsProps {
  selectedChart: string
  timeRange: string
  onInsightAction?: (insight: Insight) => void
}

export function IntelligentInsights({ selectedChart, timeRange, onInsightAction }: IntelligentInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  useEffect(() => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          generateInsights()
          setIsAnalyzing(false)
          return 100
        }
        return prev + 10
      })
    }, 200)

    return () => clearInterval(progressInterval)
  }, [selectedChart, timeRange])

  const generateInsights = () => {
    const mockInsights: Insight[] = [
      {
        id: "1",
        type: "trend",
        title: "上升趋势检测",
        description: `在过去${timeRange === "7d" ? "7天" : timeRange === "30d" ? "30天" : "90天"}内检测到显著的上升趋势，增长率达到23.5%`,
        confidence: 94,
        impact: "high",
        actionable: true,
        data: { growthRate: 23.5, trend: "upward" },
      },
      {
        id: "2",
        type: "anomaly",
        title: "异常值识别",
        description: "发现3个数据异常点，可能影响整体分析准确性，建议进一步调查",
        confidence: 87,
        impact: "medium",
        actionable: true,
        data: { anomalyCount: 3, severity: "medium" },
      },
      {
        id: "3",
        type: "prediction",
        title: "未来趋势预测",
        description: "基于当前数据模式，预测未来7天将继续保持增长态势，预期增长15%",
        confidence: 78,
        impact: "high",
        actionable: false,
        data: { predictedGrowth: 15, timeframe: "7天" },
      },
      {
        id: "4",
        type: "recommendation",
        title: "可视化优化建议",
        description: `当前${selectedChart === "bar" ? "柱状图" : selectedChart === "line" ? "折线图" : "饼图"}适合展示此类数据，建议添加数据标签以提高可读性`,
        confidence: 91,
        impact: "medium",
        actionable: true,
        data: { chartType: selectedChart, optimization: "add_labels" },
      },
    ]

    setInsights(mockInsights)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="h-5 w-5" />
      case "anomaly":
        return <AlertTriangle className="h-5 w-5" />
      case "prediction":
        return <Target className="h-5 w-5" />
      case "recommendation":
        return <Lightbulb className="h-5 w-5" />
      default:
        return <Brain className="h-5 w-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "trend":
        return "text-green-600"
      case "anomaly":
        return "text-orange-600"
      case "prediction":
        return "text-blue-600"
      case "recommendation":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  const getImpactBadge = (impact: string) => {
    const variants = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    } as const

    return (
      <Badge variant={variants[impact as keyof typeof variants]}>
        {impact === "high" ? "高影响" : impact === "medium" ? "中等影响" : "低影响"}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">智能数据洞察</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">AI分析引擎 v2.0</span>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">正在分析数据...</span>
                <span className="text-sm text-muted-foreground">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Zap className="h-3 w-3" />
                <span>
                  {analysisProgress < 30
                    ? "数据预处理"
                    : analysisProgress < 60
                      ? "模式识别"
                      : analysisProgress < 90
                        ? "趋势分析"
                        : "生成洞察"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Grid */}
      {!isAnalyzing && insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={getInsightColor(insight.type)}>{getInsightIcon(insight.type)}</div>
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                  </div>
                  {getImpactBadge(insight.impact)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{insight.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">置信度:</span>
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}%
                    </Badge>
                  </div>

                  {insight.actionable && (
                    <Button size="sm" variant="outline" onClick={() => onInsightAction?.(insight)}>
                      应用建议
                    </Button>
                  )}
                </div>

                {/* Confidence Progress */}
                <div className="space-y-1">
                  <Progress value={insight.confidence} className="h-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {!isAnalyzing && insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>分析摘要</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{insights.length}</div>
                <div className="text-xs text-muted-foreground">总洞察数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {insights.filter((i) => i.impact === "high").length}
                </div>
                <div className="text-xs text-muted-foreground">高影响洞察</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)}%
                </div>
                <div className="text-xs text-muted-foreground">平均置信度</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{insights.filter((i) => i.actionable).length}</div>
                <div className="text-xs text-muted-foreground">可执行建议</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

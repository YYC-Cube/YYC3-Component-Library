"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Brain, Sparkles, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

interface InsightItem {
  id: string
  type: "trend" | "anomaly" | "recommendation" | "prediction"
  title: string
  description: string
  confidence: number
  impact: "high" | "medium" | "low"
  timestamp: Date
}

interface AIInsightPanelProps {
  insights?: InsightItem[]
  isLoading?: boolean
  className?: string
}

export function AIInsightPanel({ insights = [], isLoading = false, className }: AIInsightPanelProps) {
  const [activeInsight, setActiveInsight] = useState<string | null>(null)
  const [processingAnimation, setProcessingAnimation] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setProcessingAnimation(true)
      const timer = setTimeout(() => setProcessingAnimation(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  const getInsightIcon = (type: InsightItem["type"]) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="w-4 h-4" />
      case "anomaly":
        return <AlertTriangle className="w-4 h-4" />
      case "recommendation":
        return <CheckCircle className="w-4 h-4" />
      case "prediction":
        return <Sparkles className="w-4 h-4" />
    }
  }

  const getInsightColor = (type: InsightItem["type"]) => {
    switch (type) {
      case "trend":
        return "text-blue-600 bg-blue-50"
      case "anomaly":
        return "text-red-600 bg-red-50"
      case "recommendation":
        return "text-green-600 bg-green-50"
      case "prediction":
        return "text-purple-600 bg-purple-50"
    }
  }

  const getImpactColor = (impact: InsightItem["impact"]) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">AI 智能洞察</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={() => setProcessingAnimation(true)} disabled={isLoading}>
            <RefreshCw className={cn("w-4 h-4 mr-2", (isLoading || processingAnimation) && "animate-spin")} />
            刷新分析
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Processing Animation */}
        {(isLoading || processingAnimation) && (
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin">
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary rounded-full animate-spin" />
              </div>
              <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
        )}

        {/* Insights List */}
        {!isLoading && !processingAnimation && (
          <div className="space-y-3">
            {insights.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>暂无AI洞察数据</p>
                <p className="text-sm">点击刷新分析开始智能分析</p>
              </div>
            ) : (
              insights.map((insight) => (
                <div
                  key={insight.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                    activeInsight === insight.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                  onClick={() => setActiveInsight(activeInsight === insight.id ? null : insight.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={cn("p-2 rounded-full", getInsightColor(insight.type))}>
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>

                        {activeInsight === insight.id && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center space-x-4 text-xs">
                              <div className="flex items-center space-x-1">
                                <span className="text-muted-foreground">置信度:</span>
                                <span className="font-medium">{insight.confidence}%</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-muted-foreground">时间:</span>
                                <span className="font-medium">{insight.timestamp.toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant="outline" className={cn("text-xs", getImpactColor(insight.impact))}>
                        {insight.impact === "high" ? "高影响" : insight.impact === "medium" ? "中影响" : "低影响"}
                      </Badge>
                      <div className="text-xs text-muted-foreground">{insight.confidence}%</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

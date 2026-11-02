"use client"

import React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { BarChart3, LineChart, PieChart, Maximize2, Download, Settings, Zap } from "lucide-react"

interface ChartConfig {
  type: "bar" | "line" | "pie" | "scatter"
  title: string
  data: any[]
  options?: any
}

interface VisualizationCanvasProps {
  charts?: ChartConfig[]
  isGenerating?: boolean
  className?: string
}

export function VisualizationCanvas({ charts = [], isGenerating = false, className }: VisualizationCanvasProps) {
  const [activeChart, setActiveChart] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const chartIcons = {
    bar: BarChart3,
    line: LineChart,
    pie: PieChart,
    scatter: BarChart3,
  }

  const generateSampleData = () => {
    return Array.from({ length: 10 }, (_, i) => ({
      name: `数据点 ${i + 1}`,
      value: Math.floor(Math.random() * 100) + 20,
      category: `类别 ${(i % 3) + 1}`,
    }))
  }

  const sampleCharts: ChartConfig[] = [
    {
      type: "bar",
      title: "销售数据分析",
      data: generateSampleData(),
    },
    {
      type: "line",
      title: "趋势变化图",
      data: generateSampleData(),
    },
    {
      type: "pie",
      title: "分布占比图",
      data: generateSampleData(),
    },
  ]

  const displayCharts = charts.length > 0 ? charts : sampleCharts

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">可视化画布</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {displayCharts.length} 个图表
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              配置
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chart Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {displayCharts.map((chart, index) => {
            const IconComponent = chartIcons[chart.type]
            return (
              <Button
                key={index}
                variant={activeChart === index ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0"
                onClick={() => setActiveChart(index)}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {chart.title}
              </Button>
            )
          })}
        </div>

        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className={cn(
            "relative bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 transition-all duration-300",
            isFullscreen ? "fixed inset-4 z-50 bg-background" : "h-96",
          )}
        >
          {isGenerating ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin">
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin" />
                  </div>
                  <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
                </div>
                <div>
                  <p className="font-semibold">AI 正在生成图表...</p>
                  <p className="text-sm text-muted-foreground">分析数据特征并推荐最佳可视化方案</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 h-full">
              {displayCharts[activeChart] && (
                <div className="h-full flex flex-col">
                  <h3 className="font-semibold text-lg mb-4">{displayCharts[activeChart].title}</h3>

                  {/* Mock Chart Visualization */}
                  <div className="flex-1 bg-background rounded-lg border p-4 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        {React.createElement(chartIcons[displayCharts[activeChart].type], {
                          className: "w-12 h-12 text-primary",
                        })}
                      </div>
                      <div>
                        <p className="font-medium">图表渲染区域</p>
                        <p className="text-sm text-muted-foreground">
                          {displayCharts[activeChart].type.toUpperCase()} 图表 -{" "}
                          {displayCharts[activeChart].data.length} 个数据点
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chart Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">{displayCharts[activeChart]?.data.length || 0}</p>
            <p className="text-xs text-muted-foreground">数据点</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-green-600">98%</p>
            <p className="text-xs text-muted-foreground">渲染精度</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-blue-600">1.2s</p>
            <p className="text-xs text-muted-foreground">生成时间</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

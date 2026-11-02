"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, LineChart, PieChart, ScanText as Scatter, TrendingUp, Download, RefreshCw } from "lucide-react"

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string
    borderWidth?: number
  }[]
}

interface ChartRendererProps {
  data?: ChartData
  type?: "bar" | "line" | "pie" | "scatter"
  title?: string
  description?: string
  aiRecommendation?: string
}

export function ChartRenderer({
  data,
  type = "bar",
  title = "数据可视化",
  description = "智能生成的图表",
  aiRecommendation,
}: ChartRendererProps) {
  const [chartType, setChartType] = useState(type)
  const [isLoading, setIsLoading] = useState(false)
  const [chartData, setChartData] = useState<ChartData>(
    data || {
      labels: ["一月", "二月", "三月", "四月", "五月", "六月"],
      datasets: [
        {
          label: "销售数据",
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(236, 72, 153, 0.8)",
          ],
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
        },
      ],
    },
  )

  const chartTypes = [
    { value: "bar", label: "柱状图", icon: <BarChart3 className="h-4 w-4" /> },
    { value: "line", label: "折线图", icon: <LineChart className="h-4 w-4" /> },
    { value: "pie", label: "饼图", icon: <PieChart className="h-4 w-4" /> },
    { value: "scatter", label: "散点图", icon: <Scatter className="h-4 w-4" /> },
  ]

  const handleRefresh = () => {
    setIsLoading(true)
    // 模拟数据刷新
    setTimeout(() => {
      const newData = chartData.datasets[0].data.map(() => Math.floor(Math.random() * 100))
      setChartData({
        ...chartData,
        datasets: [
          {
            ...chartData.datasets[0],
            data: newData,
          },
        ],
      })
      setIsLoading(false)
    }, 1000)
  }

  const renderChart = () => {
    const maxValue = Math.max(...chartData.datasets[0].data)

    switch (chartType) {
      case "bar":
        return (
          <div className="space-y-4">
            {chartData.labels.map((label, index) => {
              const value = chartData.datasets[0].data[index]
              const percentage = (value / maxValue) * 100
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-muted-foreground">{label}</div>
                  <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-primary-foreground">
                      {value}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )

      case "line":
        return (
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                  <stop offset="100%" stopColor="rgb(16, 185, 129)" />
                </linearGradient>
              </defs>
              {chartData.datasets[0].data.map((value, index) => {
                const x = (index / (chartData.datasets[0].data.length - 1)) * 350 + 25
                const y = 175 - (value / maxValue) * 150
                const nextIndex = index + 1
                if (nextIndex < chartData.datasets[0].data.length) {
                  const nextX = (nextIndex / (chartData.datasets[0].data.length - 1)) * 350 + 25
                  const nextY = 175 - (chartData.datasets[0].data[nextIndex] / maxValue) * 150
                  return (
                    <g key={index}>
                      <line
                        x1={x}
                        y1={y}
                        x2={nextX}
                        y2={nextY}
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        className="animate-pulse"
                      />
                      <circle cx={x} cy={y} r="4" fill="rgb(59, 130, 246)" className="animate-pulse" />
                    </g>
                  )
                }
                return <circle key={index} cx={x} cy={y} r="4" fill="rgb(59, 130, 246)" className="animate-pulse" />
              })}
            </svg>
          </div>
        )

      case "pie":
        const total = chartData.datasets[0].data.reduce((sum, value) => sum + value, 0)
        let currentAngle = 0
        return (
          <div className="flex items-center justify-center h-64">
            <svg className="w-48 h-48" viewBox="0 0 200 200">
              {chartData.datasets[0].data.map((value, index) => {
                const percentage = (value / total) * 100
                const angle = (value / total) * 360
                const startAngle = currentAngle
                const endAngle = currentAngle + angle
                currentAngle += angle

                const startX = 100 + 80 * Math.cos(((startAngle - 90) * Math.PI) / 180)
                const startY = 100 + 80 * Math.sin(((startAngle - 90) * Math.PI) / 180)
                const endX = 100 + 80 * Math.cos(((endAngle - 90) * Math.PI) / 180)
                const endY = 100 + 80 * Math.sin(((endAngle - 90) * Math.PI) / 180)

                const largeArcFlag = angle > 180 ? 1 : 0

                return (
                  <path
                    key={index}
                    d={`M 100 100 L ${startX} ${startY} A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                    fill={chartData.datasets[0].backgroundColor?.[index] || `hsl(${index * 60}, 70%, 60%)`}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                )
              })}
            </svg>
          </div>
        )

      default:
        return <div className="h-64 flex items-center justify-center text-muted-foreground">暂不支持此图表类型</div>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>{title}</span>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chartTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      {type.icon}
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {aiRecommendation && (
          <div className="mt-4">
            <Badge variant="secondary" className="mb-2">
              AI 推荐
            </Badge>
            <p className="text-sm text-muted-foreground">{aiRecommendation}</p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="min-h-[200px]">{renderChart()}</div>
      </CardContent>
    </Card>
  )
}

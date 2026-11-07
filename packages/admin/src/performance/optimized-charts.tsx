"use client"

import { useState, useMemo, useCallback } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Sector,
  Brush,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Skeleton } from "@yyc3/ui-enterprise/skeleton"
import { Download, ZoomIn, ZoomOut, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@yyc3/ui-enterprise/dropdown-menu"
import { cn } from "@yyc3/lib/utils"

// 数据采样函数 - 用于减少大数据集的点数
function sampleData<T>(data: T[], maxPoints: number): T[] {
  if (data.length <= maxPoints) return data

  const samplingRate = Math.ceil(data.length / maxPoints)
  return data.filter((_, index) => index % samplingRate === 0)
}

// 数据聚合函数 - 用于按时间间隔聚合数据
function aggregateDataByTime<T extends { date: string; value: number }>(
  data: T[],
  interval: "hour" | "day" | "week" | "month",
): { date: string; value: number }[] {
  const aggregated: Record<string, { date: string; value: number; count: number }> = {}

  data.forEach((item) => {
    const date = new Date(item.date)
    let key: string

    switch (interval) {
      case "hour":
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`
        break
      case "day":
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        break
      case "week":
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = `${weekStart.getFullYear()}-${weekStart.getMonth() + 1}-${weekStart.getDate()}`
        break
      case "month":
        key = `${date.getFullYear()}-${date.getMonth() + 1}`
        break
    }

    if (!aggregated[key]) {
      aggregated[key] = { date: key, value: 0, count: 0 }
    }

    aggregated[key].value += item.value
    aggregated[key].count += 1
  })

  return Object.values(aggregated).map((item) => ({
    date: item.date,
    value: item.value / item.count, // 计算平均值
  }))
}

// 优化的折线图
interface OptimizedLineChartProps {
  data: any[]
  title: string
  description?: string
  className?: string
  height?: number
  lines?: { dataKey: string; stroke: string; name: string }[]
  xAxisDataKey?: string
  allowZoom?: boolean
  isLoading?: boolean
  maxPoints?: number
}

export function OptimizedLineChart({
  data,
  title,
  description,
  className,
  height = 400,
  lines = [{ dataKey: "value", stroke: "#3b82f6", name: "数值" }],
  xAxisDataKey = "name",
  allowZoom = true,
  isLoading = false,
  maxPoints = 500,
}: OptimizedLineChartProps) {
  const [zoomDomain, setZoomDomain] = useState<any>(null)
  const [brushDomain, setBrushDomain] = useState<any>(null)
  const [aggregationInterval, setAggregationInterval] = useState<"none" | "hour" | "day" | "week" | "month">("none")

  // 数据处理 - 采样或聚合
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return []

    // 如果需要聚合
    if (aggregationInterval !== "none" && "date" in data[0]) {
      return aggregateDataByTime(data as any, aggregationInterval as any)
    }

    // 如果数据量过大，进行采样
    if (data.length > maxPoints) {
      return sampleData(data, maxPoints)
    }

    return data
  }, [data, maxPoints, aggregationInterval])

  const handleZoomIn = () => {
    if (!brushDomain) return
    setZoomDomain(brushDomain)
  }

  const handleZoomOut = () => {
    setZoomDomain(null)
    setBrushDomain(null)
  }

  const handleBrushChange = (domain: any) => {
    if (!domain) return
    setBrushDomain(domain)
  }

  const handleDownload = () => {
    if (!data || data.length === 0) return

    // 创建CSV内容
    const headers = [xAxisDataKey, ...lines.map((line) => line.name)].join(",")
    const rows = data.map((item) => {
      return [item[xAxisDataKey], ...lines.map((line) => item[line.dataKey])].join(",")
    })

    const csvContent = [headers, ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    // 创建下载链接
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${title.replace(/\s+/g, "_")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex items-center gap-2">
          {allowZoom && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleZoomIn}
                disabled={!brushDomain || isLoading}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleZoomOut}
                disabled={!zoomDomain || isLoading}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDownload} disabled={isLoading}>
            <Download className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={isLoading}>
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setAggregationInterval("none")}>不聚合</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAggregationInterval("hour")}>按小时聚合</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAggregationInterval("day")}>按天聚合</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAggregationInterval("week")}>按周聚合</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAggregationInterval("month")}>按月聚合</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <Skeleton className="h-[90%] w-[95%]" />
          </div>
        ) : (
          <div style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={xAxisDataKey}
                  domain={zoomDomain ? [zoomDomain.startIndex, zoomDomain.endIndex] : ["auto", "auto"]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    // 如果值太长，截断它
                    if (typeof value === "string" && value.length > 10) {
                      return value.substring(0, 10) + "..."
                    }
                    return value
                  }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value, name) => [value, name]} contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {lines.map((line, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={line.dataKey}
                    stroke={line.stroke}
                    name={line.name}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                    // 当数据点过多时，不渲染点
                    dot={processedData.length > 100 ? false : { r: 3 }}
                    isAnimationActive={processedData.length <= 100}
                  />
                ))}
                {allowZoom && (
                  <Brush
                    dataKey={xAxisDataKey}
                    height={30}
                    stroke="#8884d8"
                    onChange={handleBrushChange}
                    startIndex={0}
                    endIndex={processedData.length > 10 ? 9 : processedData.length - 1}
                  />
                )}
                <ReferenceLine y={0} stroke="#000" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 优化的柱状图
interface OptimizedBarChartProps {
  data: any[]
  title: string
  description?: string
  className?: string
  height?: number
  dataKey?: string
  xAxisDataKey?: string
  isLoading?: boolean
  maxBars?: number
}

export function OptimizedBarChart({
  data,
  title,
  description,
  className,
  height = 400,
  dataKey = "value",
  xAxisDataKey = "name",
  isLoading = false,
  maxBars = 50,
}: OptimizedBarChartProps) {
  // 数据处理 - 如果柱状图数据过多，进行采样
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return []

    if (data.length > maxBars) {
      return sampleData(data, maxBars)
    }

    return data
  }, [data, maxBars])

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => {}} disabled={isLoading}>
          <Download className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <Skeleton className="h-[90%] w-[95%]" />
          </div>
        ) : (
          <div style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={xAxisDataKey}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (typeof value === "string" && value.length > 10) {
                      return value.substring(0, 10) + "..."
                    }
                    return value
                  }}
                  // 当数据量大时，减少显示的刻度数量
                  interval={processedData.length > 20 ? Math.floor(processedData.length / 20) : 0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value, name) => [value, name]} contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey={dataKey}
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  // 当数据量大时，禁用动画
                  isAnimationActive={processedData.length <= 50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 优化的饼图
interface OptimizedPieChartProps {
  data: any[]
  title: string
  description?: string
  className?: string
  height?: number
  dataKey?: string
  nameKey?: string
  isLoading?: boolean
  maxSlices?: number
}

export function OptimizedPieChart({
  data,
  title,
  description,
  className,
  height = 400,
  dataKey = "value",
  nameKey = "name",
  isLoading = false,
  maxSlices = 10,
}: OptimizedPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // 数据处理 - 如果饼图切片过多，合并小值
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return []

    if (data.length <= maxSlices) return data

    // 排序数据
    const sortedData = [...data].sort((a, b) => b[dataKey] - a[dataKey])

    // 取前 (maxSlices - 1) 个最大值
    const topItems = sortedData.slice(0, maxSlices - 1)

    // 合并剩余项
    const otherItems = sortedData.slice(maxSlices - 1)
    const otherValue = otherItems.reduce((sum, item) => sum + item[dataKey], 0)

    return [...topItems, { [nameKey]: "其他", [dataKey]: otherValue, color: "#9CA3AF" }]
  }, [data, maxSlices, dataKey, nameKey])

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index)
  }, [])

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? "start" : "end"

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload[nameKey]}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={12}>
          {`${payload[nameKey]}: ${value}`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={12}>
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    )
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => {}} disabled={isLoading}>
          <Download className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <Skeleton className="h-[90%] w-[95%]" />
          </div>
        ) : (
          <div style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex !== null ? activeIndex : undefined}
                  activeShape={renderActiveShape}
                  data={processedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey={dataKey}
                  nameKey={nameKey}
                  onMouseEnter={onPieEnter}
                  // 当数据量大时，禁用动画
                  isAnimationActive={processedData.length <= 10}
                >
                  {processedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || `hsl(${(index * 45) % 360}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} contentStyle={{ fontSize: 12 }} />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  // 当图例项过多时，使用垂直布局
                  layout={processedData.length > 5 ? "vertical" : "horizontal"}
                  verticalAlign={processedData.length > 5 ? "middle" : "bottom"}
                  align={processedData.length > 5 ? "right" : "center"}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

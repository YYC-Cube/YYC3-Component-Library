"use client"

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Sector,
  ZAxis,
  Brush,
  ReferenceLine,
} from "recharts"
import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { ChevronDown, Download, ZoomIn, ZoomOut, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@yyc3/ui-enterprise/dropdown-menu"
import { cn } from "@yyc3/lib/utils"

// 高级折线图
export function AdvancedLineChart({
  data,
  title,
  description,
  className,
  height = 400,
  lines = [{ dataKey: "value", stroke: "#3b82f6", name: "数值" }],
  xAxisDataKey = "name",
  allowZoom = true,
}) {
  const [zoomDomain, setZoomDomain] = useState(null)
  const [brushDomain, setBrushDomain] = useState(null)

  const handleZoomIn = () => {
    if (!brushDomain) return
    setZoomDomain(brushDomain)
  }

  const handleZoomOut = () => {
    setZoomDomain(null)
    setBrushDomain(null)
  }

  const handleBrushChange = (domain) => {
    if (!domain) return
    setBrushDomain(domain)
  }

  const handleDownload = () => {
    // 实现图表下载功能
    alert("图表下载功能将在此实现")
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
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn} disabled={!brushDomain}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut} disabled={!zoomDomain}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>显示全部数据</DropdownMenuItem>
              <DropdownMenuItem>仅显示本月数据</DropdownMenuItem>
              <DropdownMenuItem>自定义时间范围</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={xAxisDataKey}
                domain={zoomDomain ? [zoomDomain.startIndex, zoomDomain.endIndex] : ["auto", "auto"]}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.stroke}
                  name={line.name}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              ))}
              {allowZoom && (
                <Brush
                  dataKey={xAxisDataKey}
                  height={30}
                  stroke="#8884d8"
                  onChange={handleBrushChange}
                  startIndex={0}
                  endIndex={data.length > 10 ? 9 : data.length - 1}
                />
              )}
              <ReferenceLine y={0} stroke="#000" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// 热力图
export function HeatMapChart({ data, title, description, className, height = 400 }) {
  const [activeIndex, setActiveIndex] = useState(null)

  const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)

  const getColor = (value) => {
    // 根据值返回不同的颜色深度
    if (value < 20) return "#ebf5ff"
    if (value < 40) return "#bfdbfe"
    if (value < 60) return "#93c5fd"
    if (value < 80) return "#60a5fa"
    return "#3b82f6"
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ width: "100%", height, padding: "20px" }}>
          <div className="grid grid-cols-25 gap-1">
            <div className="col-span-1"></div>
            {hours.map((hour, i) => (
              <div key={i} className="text-xs text-center text-muted-foreground">
                {i % 3 === 0 ? hour : ""}
              </div>
            ))}

            {days.map((day, dayIndex) => (
              <>
                <div key={`day-${dayIndex}`} className="text-xs font-medium">
                  {day}
                </div>
                {hours.map((hour, hourIndex) => {
                  const value = data[dayIndex]?.[hourIndex] || 0
                  return (
                    <div
                      key={`${dayIndex}-${hourIndex}`}
                      className="h-6 rounded-sm"
                      style={{ backgroundColor: getColor(value) }}
                      title={`${day} ${hour}: ${value}`}
                    ></div>
                  )
                })}
              </>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">低</span>
              <div className="flex">
                <div className="h-3 w-5" style={{ backgroundColor: "#ebf5ff" }}></div>
                <div className="h-3 w-5" style={{ backgroundColor: "#bfdbfe" }}></div>
                <div className="h-3 w-5" style={{ backgroundColor: "#93c5fd" }}></div>
                <div className="h-3 w-5" style={{ backgroundColor: "#60a5fa" }}></div>
                <div className="h-3 w-5" style={{ backgroundColor: "#3b82f6" }}></div>
              </div>
              <span className="text-xs text-muted-foreground">高</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 散点图
export function ScatterPlotChart({ data, title, description, className, height = 400 }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name="消费金额"
                unit="元"
                label={{ value: "消费金额 (元)", position: "insideBottomRight", offset: -10 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="消费频次"
                unit="次"
                label={{ value: "消费频次 (次)", angle: -90, position: "insideLeft" }}
              />
              <ZAxis type="number" dataKey="z" range={[50, 400]} name="会员数量" unit="人" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name, props) => {
                  return [`${value} ${props.unit}`, name]
                }}
              />
              <Legend />
              <Scatter name="会员分布" data={data} fill="#3b82f6" shape="circle" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// 多维饼图
export function AdvancedPieChart({ data, title, description, className, height = 400 }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, name } =
      props
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
          {payload.name}
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
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
          {`${name}: ${value}`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    )
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#3b82f6"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// 堆叠面积图
export function StackedAreaChart({ data, title, description, className, height = 400, areas = [] }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {areas.map((area, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={area.dataKey}
                  stackId="1"
                  stroke={area.stroke}
                  fill={area.fill}
                  name={area.name}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// 数据钻取组件
export function DrillDownChart({
  data,
  title,
  description,
  className,
  height = 400,
  initialLevel = 0,
  levels = [
    { name: "年度", dataKey: "yearlyData" },
    { name: "季度", dataKey: "quarterlyData" },
    { name: "月度", dataKey: "monthlyData" },
    { name: "日期", dataKey: "dailyData" },
  ],
}) {
  const [currentLevel, setCurrentLevel] = useState(initialLevel)
  const [drillPath, setDrillPath] = useState([])
  const [currentData, setCurrentData] = useState(data)

  const handleDrillDown = (entry) => {
    if (currentLevel >= levels.length - 1) return

    const nextLevel = currentLevel + 1
    const nextData = entry[levels[nextLevel].dataKey]

    if (!nextData) return

    setDrillPath([...drillPath, { level: currentLevel, data: currentData, name: entry.name }])
    setCurrentData(nextData)
    setCurrentLevel(nextLevel)
  }

  const handleDrillUp = () => {
    if (drillPath.length === 0) return

    const lastPath = drillPath[drillPath.length - 1]
    setCurrentLevel(lastPath.level)
    setCurrentData(lastPath.data)
    setDrillPath(drillPath.slice(0, -1))
  }

  const resetDrill = () => {
    setCurrentLevel(initialLevel)
    setCurrentData(data)
    setDrillPath([])
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDrillUp} disabled={drillPath.length === 0}>
                上钻
              </Button>
              <Button variant="outline" size="sm" onClick={resetDrill} disabled={drillPath.length === 0}>
                <RefreshCw className="mr-2 h-4 w-4" />
                重置
              </Button>
            </div>
          </div>
          {description && <CardDescription>{description}</CardDescription>}
          {drillPath.length > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span>当前路径: </span>
              {drillPath.map((path, index) => (
                <span key={index}>
                  <button
                    className="mx-1 text-primary hover:underline"
                    onClick={() => {
                      setCurrentLevel(path.level)
                      setCurrentData(path.data)
                      setDrillPath(drillPath.slice(0, index))
                    }}
                  >
                    {path.name}
                  </button>
                  {index < drillPath.length - 1 && " > "}
                </span>
              ))}
              {drillPath.length > 0 && " > "}
              <span className="font-medium text-foreground">{levels[currentLevel].name}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              onClick={(data) => {
                if (data && data.activePayload && data.activePayload[0]) {
                  handleDrillDown(data.activePayload[0].payload)
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                name="销售额"
                fill="#3b82f6"
                cursor={currentLevel < levels.length - 1 ? "pointer" : "default"}
              />
              {currentLevel < levels.length - 1 && (
                <text x="50%" y={height - 20} fill="#666" textAnchor="middle" dominantBaseline="middle">
                  点击柱形可查看{levels[currentLevel + 1].name}详情
                </text>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

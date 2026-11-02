"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  Label,
  Area,
  LineChart,
  Line,
  AreaChart,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { chartThemes } from "@/config/chart-themes"
import { colors } from "@/config/colors"
import { useTheme } from "next-themes"
import { useDebounce } from "@yyc3/lib/hooks/use-debounce"
import { chartVoiceControlManager, type ChartVoiceControlService } from "@yyc3/lib/services/chart-voice-control"

export type ChartType = "line" | "bar" | "area" | "pie" | "donut" | "scatter"

interface ChartOptions {
  type?: ChartType
  theme?: "light" | "dark" | "auto"
  grid?: boolean
  tooltip?: boolean
  legend?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  minValue?: number
  maxValue?: number
  animation?: boolean
  className?: string
  showLabels?: boolean
  showToolbar?: boolean
  interactions?: string[]
  annotations?: {
    type: "line" | "rect"
    x?: string | number
    x2?: string | number
    y?: string | number
    y2?: string | number
    color?: string
    strokeDasharray?: string
    text?: string
  }[]
  enableVoiceControl?: boolean
  onChartTypeChange?: (type: string) => void
  onThemeChange?: (theme: string) => void
  onDataFilter?: (filter: any) => void
  onZoom?: (action: string) => void
  onExport?: (format: string) => void
  onDataSpeak?: (data: any) => void
}

interface ChartSeries {
  id: string
  name: string
  color?: string
  data: {
    x: string | number
    y: number
  }[]
}

interface InteractiveChartProps {
  data: ChartSeries[]
  options?: ChartOptions
  className?: string
  onDataPointClick?: (dataPoint: any, seriesId: string) => void
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  options = {},
  className,
  onDataPointClick,
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [selectedChartType, setSelectedChartType] = useState<ChartType>(options.type || "line")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { theme: nextTheme } = useTheme()
  const theme = options.theme === "auto" ? nextTheme : options.theme || "light"

  // 缩放状态
  const [zoomDomain, setZoomDomain] = useState<any>(null)
  const debouncedZoomDomain = useDebounce(zoomDomain, 500)

  // 语音控制状态
  const [voiceControlEnabled, setVoiceControlEnabled] = useState(false)
  const [voiceController, setVoiceController] = useState<ChartVoiceControlService | null>(null)

  // 图表配置
  const chartOptions = {
    ...options,
    theme: theme,
  }

  // 处理数据点点击事件
  const handleDataPointClick = (dataPoint: any, index: number, seriesId: string) => {
    if (onDataPointClick) {
      onDataPointClick(dataPoint, seriesId)
    }
  }

  // 根据ID查找系列
  const findSeriesById = (seriesId: string) => {
    return data.find((series) => series.id === seriesId)
  }

  // 处理导出
  const handleExport = (format: string) => {
    if (chartRef.current) {
      chartUtils.exportChart(chartRef.current, format)
    }
  }

  // 重置缩放
  const resetZoom = () => {
    setZoomDomain(null)
  }

  // 将多维数据转换为一维数据，便于图表组件使用
  const flattenData = () => {
    if (!data || !data.length) return []

    // 创建一个对象，键为x值，值为包含所有系列值的对象
    const combinedData: { [x: string | number]: { x: string | number; [key: string]: any } } = {}

    // 处理每个系列的数据
    data.forEach((series) => {
      series.data.forEach((point) => {
        const xValue = point.x
        const valueKey = `value_${series.id}`

        if (!combinedData[xValue]) {
          combinedData[xValue] = { x: xValue }
        }

        combinedData[xValue][valueKey] = point.y
      })
    })

    // 转换为数组
    return Object.values(combinedData)
  }

  // 格式化X轴和Y轴的刻度
  const formatXTick = (value: number | string) => chartUtils.formatTick(value, chartOptions.xAxisLabel)
  const formatYTick = (value: number | string) => chartUtils.formatTick(value, chartOptions.yAxisLabel)

  // 初始化语音控制
  useEffect(() => {
    if (options.enableVoiceControl) {
      const controller = chartVoiceControlManager.createController({
        chartId: `chart-${Date.now()}`,
        onChartTypeChange: (type) => {
          setSelectedChartType(type as ChartType)
          options.onChartTypeChange?.(type)
        },
        onDataFilter: (filter) => {
          options.onDataFilter?.(filter)
        },
        onZoom: (action) => {
          if (action === "reset") {
            resetZoom()
          }
          options.onZoom?.(action)
        },
        onExport: (format) => {
          handleExport(format)
        },
        onThemeChange: (theme) => {
          options.onThemeChange?.(theme)
        },
        onDataSpeak: (data) => {
          options.onDataSpeak?.(data)
        },
      })

      setVoiceController(controller)
    }

    return () => {
      if (voiceController) {
        chartVoiceControlManager.removeController(voiceController.getStatus().chartId)
      }
    }
  }, [options.enableVoiceControl])

  // 渲染折线图
  const renderLineChart = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={flattenData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          onMouseUp={(e) => {
            if (chartOptions.interactions?.includes("zoom")) {
              setZoomDomain({
                x: [e.activeLabel, e.activeLabel],
                y: [e.activeCoordinate?.y, e.activeCoordinate?.y],
              })
            }
          }}
        >
          {chartOptions.grid && (
            <CartesianGrid strokeDasharray="3 3" stroke={chartThemes[theme as keyof typeof chartThemes]?.grid} />
          )}

          <XAxis
            dataKey="x"
            tickFormatter={formatXTick}
            tick={{ fill: chartThemes[theme as keyof typeof chartThemes]?.text }}
            label={{
              value: chartOptions.xAxisLabel || "",
              position: "insideBottom",
              offset: -10,
              fill: chartThemes[theme as keyof typeof chartThemes]?.text,
            }}
          />

          <YAxis
            tickFormatter={formatYTick}
            domain={[
              chartOptions.minValue !== undefined ? chartOptions.minValue : "auto",
              chartOptions.maxValue !== undefined ? chartOptions.maxValue : "auto",
            ]}
            tick={{ fill: chartThemes[theme as keyof typeof chartThemes]?.text }}
            label={{
              value: chartOptions.yAxisLabel || "",
              angle: -90,
              position: "insideLeft",
              fill: chartThemes[theme as keyof typeof chartThemes]?.text,
            }}
          />

          {chartOptions.tooltip && (
            <Tooltip
              formatter={(value: number) => [chartUtils.formatNumber(value), ""]}
              labelFormatter={formatXTick}
              contentStyle={{
                backgroundColor: chartThemes[theme as keyof typeof chartThemes]?.tooltip.background,
                color: chartThemes[theme as keyof typeof chartThemes]?.tooltip.text,
                border: `1px solid ${chartThemes[theme as keyof typeof chartThemes]?.tooltip.border}`,
                borderRadius: "4px",
                padding: "8px",
              }}
            />
          )}

          {chartOptions.legend && <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />}

          {/* 渲染每个数据系列 */}
          {data.map((series, index) => (
            <Line
              key={series.id}
              type="monotone"
              dataKey={`value_${series.id}`}
              name={series.name}
              stroke={series.color || ColorPalette[index % ColorPalette.length]}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 1, fill: "white" }}
              activeDot={{
                r: 6,
                onClick: (props: any) => handleDataPointClick(props.payload, props.index, series.id),
              }}
              isAnimationActive={chartOptions.animation}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          ))}

          {/* 添加注释 */}
          {chartOptions.annotations?.map((annotation, index) => {
            if (annotation.type === "line") {
              return (
                <ReferenceLine
                  key={`annotation-${index}`}
                  x={annotation.x}
                  y={annotation.y}
                  stroke={annotation.color || "#ff7300"}
                  strokeDasharray={annotation.strokeDasharray || "3 3"}
                >
                  {annotation.text && <Label value={annotation.text} position="insideBottomRight" />}
                </ReferenceLine>
              )
            }

            if (annotation.type === "rect" && annotation.x && annotation.x2 && annotation.y && annotation.y2) {
              return (
                <ReferenceArea
                  key={`annotation-${index}`}
                  x1={annotation.x}
                  x2={annotation.x2}
                  y1={annotation.y}
                  y2={annotation.y2}
                  fill={annotation.color || "rgba(255, 115, 0, 0.2)"}
                  stroke={annotation.color || "#ff7300"}
                >
                  {annotation.text && <Label value={annotation.text} position="insideTopRight" />}
                </ReferenceArea>
              )
            }

            return null
          })}
        </LineChart>
      </ResponsiveContainer>
    )
  }

  // 渲染柱状图
  const renderBarChart = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={flattenData()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          {chartOptions.grid && (
            <CartesianGrid strokeDasharray="3 3" stroke={chartThemes[theme as keyof typeof chartThemes]?.grid} />
          )}

          <XAxis
            dataKey="x"
            tickFormatter={formatXTick}
            tick={{ fill: chartThemes[theme as keyof typeof chartThemes]?.text }}
            label={{
              value: chartOptions.xAxisLabel || "",
              position: "insideBottom",
              offset: -10,
              fill: chartThemes[theme as keyof typeof chartThemes]?.text,
            }}
          />

          <YAxis
            tickFormatter={formatYTick}
            domain={[
              chartOptions.minValue !== undefined ? chartOptions.minValue : 0,
              chartOptions.maxValue !== undefined ? chartOptions.maxValue : "auto",
            ]}
            tick={{ fill: chartThemes[theme as keyof typeof chartThemes]?.text }}
            label={{
              value: chartOptions.yAxisLabel || "",
              angle: -90,
              position: "insideLeft",
              fill: chartThemes[theme as keyof typeof chartThemes]?.text,
            }}
          />

          {chartOptions.tooltip && (
            <Tooltip
              formatter={(value: number) => [chartUtils.formatNumber(value), ""]}
              labelFormatter={formatXTick}
              contentStyle={{
                backgroundColor: chartThemes[theme as keyof typeof chartThemes]?.tooltip.background,
                color: chartThemes[theme as keyof typeof chartThemes]?.tooltip.text,
                border: `1px solid ${chartThemes[theme as keyof typeof chartThemes]?.tooltip.border}`,
                borderRadius: "4px",
                padding: "8px",
              }}
            />
          )}

          {chartOptions.legend && <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />}

          {/* 渲染每个数据系列 */}
          {data.map((series, index) => (
            <Bar
              key={series.id}
              dataKey={`value_${series.id}`}
              name={series.name}
              fill={series.color || ColorPalette[index % ColorPalette.length]}
              barSize={20}
              onClick={(props: any) => handleDataPointClick(props.payload, props.index, series.id)}
              isAnimationActive={chartOptions.animation}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // 渲染面积图
  const renderAreaChart = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={flattenData()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          {chartOptions.grid && (
            <CartesianGrid strokeDasharray="3 3" stroke={chartThemes[theme as keyof typeof chartThemes]?.grid} />
          )}

          <XAxis
            dataKey="x"
            tickFormatter={formatXTick}
            tick={{ fill: chartThemes[theme as keyof typeof chartThemes]?.text }}
            label={{
              value: chartOptions.xAxisLabel || "",
              position: "insideBottom",
              offset: -10,
              fill: chartThemes[theme as keyof typeof chartThemes]?.text,
            }}
          />

          <YAxis
            tickFormatter={formatYTick}
            domain={[
              chartOptions.minValue !== undefined ? chartOptions.minValue : "auto",
              chartOptions.maxValue !== undefined ? chartOptions.maxValue : "auto",
            ]}
            tick={{ fill: chartThemes[theme as keyof typeof chartThemes]?.text }}
            label={{
              value: chartOptions.yAxisLabel || "",
              angle: -90,
              position: "insideLeft",
              fill: chartThemes[theme as keyof typeof chartThemes]?.text,
            }}
          />

          {chartOptions.tooltip && (
            <Tooltip
              formatter={(value: number) => [chartUtils.formatNumber(value), ""]}
              labelFormatter={formatXTick}
              contentStyle={{
                backgroundColor: chartThemes[theme as keyof typeof chartThemes]?.tooltip.background,
                color: chartThemes[theme as keyof typeof chartThemes]?.tooltip.text,
                border: `1px solid ${chartThemes[theme as keyof typeof chartThemes]?.tooltip.border}`,
                borderRadius: "4px",
                padding: "8px",
              }}
            />
          )}

          {chartOptions.legend && <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />}

          {/* 渲染每个数据系列 */}
          {data.map((series, index) => (
            <Area
              key={series.id}
              type="monotone"
              dataKey={`value_${series.id}`}
              name={series.name}
              stroke={series.color || ColorPalette[index % ColorPalette.length]}
              fill={series.color || ColorPalette[index % ColorPalette.length]}
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 1, fill: "white" }}
              activeDot={{
                r: 6,
                onClick: (props: any) => handleDataPointClick(props.payload, props.index, series.id),
              }}
              isAnimationActive={chartOptions.animation}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  // 渲染散点图
  const renderScatterChart = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={flattenData()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          {chartOptions.grid && (
            <CartesianGrid strokeDasharray="3 3" stroke={chartThemes[theme as keyof typeof chartThemes]?.grid} />
          )}

          <XAxis
            dataKey="x"
            tickFormatter={formatXTick}
            tick={{ fill: chartThemes[theme as keyof typeof chartThemes]?.text }}
            label={{
              value: chartOptions.xAxisLabel || "",
              position: "insideBottom",
              offset: -10,
              fill: chartThemes[theme as keyof typeof chartThemes]?.text,
            }}
          />

          <YAxis
            tickFormatter={formatYTick}
            domain={[
              chartOptions.minValue !== undefined ? chartOptions.minValue : "auto",
              chartOptions.maxValue !== undefined ? chartOptions.maxValue : "auto",
            ]}
            tick={{ fill: chartThemes[theme as keyof typeof chartThemes]?.text }}
            label={{
              value: chartOptions.yAxisLabel || "",
              angle: -90,
              position: "insideLeft",
              fill: chartThemes[theme as keyof typeof chartThemes]?.text,
            }}
          />

          {chartOptions.tooltip && (
            <Tooltip
              formatter={(value: number) => [chartUtils.formatNumber(value), ""]}
              labelFormatter={formatXTick}
              contentStyle={{
                backgroundColor: chartThemes[theme as keyof typeof chartThemes]?.tooltip.background,
                color: chartThemes[theme as keyof typeof chartThemes]?.tooltip.text,
                border: `1px solid ${chartThemes[theme as keyof typeof chartThemes]?.tooltip.border}`,
                borderRadius: "4px",
                padding: "8px",
              }}
            />
          )}

          {chartOptions.legend && <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />}

          {/* 渲染每个数据系列 */}
          {data.map((series, index) => (
            <Scatter
              key={series.id}
              dataKey={`value_${series.id}`}
              name={series.name}
              fill={series.color || ColorPalette[index % ColorPalette.length]}
              line={{ stroke: series.color || ColorPalette[index % ColorPalette.length], strokeWidth: 1 }}
              onClick={(props: any) => handleDataPointClick(props.payload, props.index, series.id)}
              isAnimationActive={chartOptions.animation}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    )
  }

  // 渲染饼图/环形图
  const renderPieChart = () => {
    // 计算总和
    const total = data.reduce((sum, series) => {
      return sum + (series.data[0]?.y || 0)
    }, 0)

    // 准备饼图数据
    const pieData = data.map((series) => ({
      name: series.name,
      value: series.data[0]?.y || 0,
      color: series.color || ColorPalette[data.indexOf(series) % ColorPalette.length],
      seriesId: series.id,
    }))

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {chartOptions.tooltip && (
            <Tooltip
              formatter={(value: number) => [chartUtils.formatNumber(value), `${((value / total) * 100).toFixed(1)}%`]}
              contentStyle={{
                backgroundColor: chartThemes[theme as keyof typeof chartThemes]?.tooltip.background,
                color: chartThemes[theme as keyof typeof chartThemes]?.tooltip.text,
                border: `1px solid ${chartThemes[theme as keyof typeof chartThemes]?.tooltip.border}`,
                borderRadius: "4px",
                padding: "8px",
              }}
            />
          )}

          {chartOptions.legend && <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: "10px" }} />}

          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={selectedChartType === "donut" ? "60%" : "0%"}
            outerRadius="80%"
            dataKey="value"
            nameKey="name"
            fill="#8884d8"
            label={chartOptions.showLabels}
            labelLine={chartOptions.showLabels}
            isAnimationActive={chartOptions.animation}
            animationDuration={1000}
            animationEasing="ease-in-out"
            onClick={(props: any) => {
              const series = findSeriesById(props.payload.seriesId)
              if (series) {
                handleDataPointClick({ x: props.payload.name, y: props.payload.value }, 0, series.id)
              }
            }}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || ColorPalette[index % ColorPalette.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    )
  }

  // 渲染图表
  const renderChart = () => {
    if (!data || data.length === 0) {
      return <div className="text-center text-gray-500">暂无数据显示</div>
    }

    switch (selectedChartType) {
      case "bar":
        return renderBarChart()
      case "area":
        return renderAreaChart()
      case "pie":
      case "donut":
        return renderPieChart()
      case "scatter":
        return renderScatterChart()
      default:
        return renderLineChart()
    }
  }

  // 渲染图表工具栏
  const renderChartToolbar = () => {
    if (!chartOptions.showToolbar) return null

    return (
      <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* 图表类型切换 */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">图表类型:</span>
            <select
              aria-label="选择图表类型"
              className="text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              value={selectedChartType}
              onChange={(e) => setSelectedChartType(e.target.value as ChartType)}
            >
              <option value="line">折线图</option>
              <option value="bar">柱状图</option>
              <option value="area">面积图</option>
              <option value="pie">饼图</option>
              <option value="donut">环形图</option>
              <option value="scatter">散点图</option>
            </select>
          </div>

          {/* 主题切换 */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">主题:</span>
            <select
              aria-label="选择主题"
              className="text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              value={chartOptions.theme || "light"}
              onChange={(e) => options.onThemeChange?.(e.target.value)}
            >
              <option value="light">浅色</option>
              <option value="dark">深色</option>
              <option value="auto">自动</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 重置缩放按钮 */}
          {chartOptions.interactions?.includes("zoom") && zoomDomain && (
            <button
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={resetZoom}
            >
              🔍 重置缩放
            </button>
          )}

          {/* 语音控制按钮 */}
          {options.enableVoiceControl && (
            <button
              className={`text-sm p-1 rounded-full transition-colors ${
                voiceControlEnabled
                  ? "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                if (voiceController) {
                  if (voiceControlEnabled) {
                    voiceController.deactivate()
                  } else {
                    voiceController.activate()
                  }
                  setVoiceControlEnabled(!voiceControlEnabled)
                }
              }}
            >
              🎤 {voiceControlEnabled ? "语音控制" : "启用语音"}
            </button>
          )}

          {/* 设置按钮 */}
          <button
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            ⚙️
          </button>

          {/* 导出按钮 */}
          <div className="relative">
            <button
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              📥
            </button>

            {/* 导出下拉菜单 */}
            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="py-1">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleExport("csv")}
                  >
                    📄 导出CSV
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleExport("json")}
                  >
                    📋 导出JSON
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleExport("image")}
                  >
                    🖼️ 导出图片
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleExport("pdf")}
                  >
                    📑 导出PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={chartRef}
      className={`relative w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ${className} ${
        chartOptions.className || ""
      }`}
    >
      {renderChartToolbar()}
      <div className="w-full h-[calc(100%-40px)]">{renderChart()}</div>
    </div>
  )
}

export const ColorPalette: string[] = [
  '#FF0000',
  '#00FF00',
  '#0000FF',
  // ...更多颜色
]

export const chartUtils = {
  formatNumber: (value: number, options?: { locale?: string; style?: "decimal" | "currency" | "percent"; currency?: string; minimumFractionDigits?: number; maximumFractionDigits?: number; compact?: boolean }) => {
    return value.toLocaleString(options?.locale, {
      style: options?.style || "decimal",
      currency: options?.currency,
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
    })
  },
  formatTick: (value: number | string, label?: string) => {
    return String(value)
  },
  exportChart: (element: HTMLElement, format: string) => {
    alert(`导出格式：${format}，请实现导出逻辑`)
  },
}
// ============================================================
// YYC³ · @yyc3/lib services 真身（lib services 真身批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/YYC-cloud-platform/lib/services/visualization-service.ts
// ============================================================
"use client"

import type React from "react"

/**
 * ⟨YYC³⟩ 数据可视化服务 (增强版)
 * 提供高级图表和数据可视化功能，支持多种图表类型、交互和优化
 */

import { useState, useEffect, useRef, useCallback } from "react"

// 图表类型定义
export type ChartType =
  | "line"
  | "bar"
  | "area"
  | "scatter"
  | "pie"
  | "donut"
  | "radar"
  | "heatmap"
  | "treemap"
  | "sankey"
  | "gauge"
  | "candlestick"
  | "boxplot"
  | "funnel"
  | "calendar"

// 交互类型定义
export type InteractionType = "zoom" | "pan" | "tooltip" | "selection" | "brush" | "drill" | "highlight"

export interface ChartOptions {
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
  colors?: string[]
  animation?: boolean
  legend?: boolean
  tooltip?: boolean
  responsive?: boolean
  // 新增配置选项
  interactions?: InteractionType[]
  theme?: "light" | "dark" | "auto"
  locale?: string
  annotations?: ChartAnnotation[]
  stacked?: boolean
  grid?: boolean
  minValue?: number
  maxValue?: number
  aspectRatio?: number
  padding?: { top?: number; right?: number; bottom?: number; left?: number }
}

export interface ChartAnnotation {
  type: "line" | "rect" | "circle" | "text"
  x?: number | string | Date
  y?: number
  x2?: number | string | Date
  y2?: number
  text?: string
  color?: string
  strokeDasharray?: string
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    fill?: boolean
    // 新增数据集属性
    type?: ChartType
    tension?: number
    pointRadius?: number
    pointHoverRadius?: number
    stack?: string
    hidden?: boolean
    datalabels?: {
      display?: boolean
      anchor?: "center" | "end" | "start"
      align?: "center" | "end" | "start" | "right" | "bottom" | "left" | "top"
      formatter?: (value: any) => string
    }
  }[]
}

export interface DataPoint {
  x: number | string | Date
  y: number
  [key: string]: any
}

export interface DataSeries {
  id: string
  name: string
  data: DataPoint[]
  color?: string
  type?: ChartType
  // 新增数据系列属性
  stack?: string
  dashArray?: string
  opacity?: number
  symbolSize?: number
  emphasis?: {
    focus?: "self" | "series"
    scale?: number
    itemStyle?: Record<string, any>
  }
}

export interface DatasetOptions {
  endpoint: string
  refreshInterval?: number
  transformFn?: (data: any) => DataSeries[]
  // 新增数据集选项
  pageSize?: number
  cacheStrategy?: "memory" | "localStorage" | "none"
  fetchPolicy?: "cache-first" | "network-only" | "cache-and-network"
  errorRetryCount?: number
  errorRetryInterval?: number
  onDataReceived?: (data: DataSeries[]) => void
}

/**
 * 使用数据集的Hook (增强版)
 */
export function useDataset(options: DatasetOptions) {
  const {
    endpoint,
    refreshInterval = 0,
    transformFn,
    pageSize = 1000,
    cacheStrategy = "memory",
    fetchPolicy = "cache-first",
    errorRetryCount = 3,
    errorRetryInterval = 5000,
    onDataReceived,
  } = options

  const [data, setData] = useState<DataSeries[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // 新增状态
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const retryCount = useRef(0)
  const cache = useRef<Map<string, { data: any; timestamp: number }>>(new Map())

  // 缓存键生成
  const getCacheKey = useCallback(() => {
    return `${endpoint}_${page}_${pageSize}`
  }, [endpoint, page, pageSize])

  // 从缓存获取数据
  const getFromCache = useCallback(() => {
    const key = getCacheKey()

    if (cacheStrategy === "localStorage") {
      const cached = localStorage.getItem(`yy_chart_${key}`)
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached)
          // 缓存有效期为10分钟
          if (Date.now() - timestamp < 10 * 60 * 1000) {
            return data
          }
        } catch (e) {
          console.error("缓存解析错误", e)
        }
      }
    } else if (cacheStrategy === "memory") {
      const cached = cache.current.get(key)
      if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
        return cached.data
      }
    }

    return null
  }, [getCacheKey, cacheStrategy])

  // 设置缓存
  const setToCache = useCallback(
    (data: any) => {
      const key = getCacheKey()
      const cacheData = { data, timestamp: Date.now() }

      if (cacheStrategy === "localStorage") {
        try {
          localStorage.setItem(`yy_chart_${key}`, JSON.stringify(cacheData))
        } catch (e) {
          console.error("缓存存储错误", e)
        }
      } else if (cacheStrategy === "memory") {
        cache.current.set(key, cacheData)
      }
    },
    [getCacheKey, cacheStrategy],
  )

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (isFetching) return

      setIsFetching(true)
      if (isRefresh) {
        setIsLoading(true)
      }
      setError(null)

      try {
        // 检查缓存
        if (fetchPolicy !== "network-only" && !isRefresh) {
          const cachedData = getFromCache()
          if (cachedData) {
            const processedData = transformFn ? transformFn(cachedData) : cachedData
            if (fetchPolicy === "cache-first") {
              setData(processedData)
              setLastUpdated(new Date())
              setIsLoading(false)
              setIsFetching(false)
              onDataReceived?.(processedData)
              return
            } else if (fetchPolicy === "cache-and-network") {
              setData(processedData)
              setLastUpdated(new Date())
              setIsLoading(false)
              onDataReceived?.(processedData)
            }
          }
        }

        // 构建请求URL，添加分页参数
        const url = new URL(endpoint, window.location.origin)
        url.searchParams.append("page", page.toString())
        url.searchParams.append("pageSize", pageSize.toString())

        const response = await fetch(url.toString())

        if (!response.ok) {
          throw new Error(`获取数据失败: ${response.statusText}`)
        }

        const rawData = await response.json()

        // 缓存原始数据
        setToCache(rawData)

        // 检查是否还有更多数据
        setHasMore(rawData.length === pageSize)

        // 处理数据
        const processedData = transformFn ? transformFn(rawData) : rawData

        // 更新状态
        setData((prev) => (isRefresh ? processedData : [...prev, ...processedData]))
        setLastUpdated(new Date())
        retryCount.current = 0
        onDataReceived?.(processedData)
      } catch (err) {
        console.error("数据获取错误:", err)
        setError(err instanceof Error ? err.message : "获取数据失败")

        // 错误重试逻辑
        if (retryCount.current < errorRetryCount) {
          retryCount.current += 1
          setTimeout(() => {
            fetchData(isRefresh)
          }, errorRetryInterval)
        }
      } finally {
        setIsLoading(false)
        setIsFetching(false)
      }
    },
    [
      endpoint,
      page,
      pageSize,
      transformFn,
      isFetching,
      fetchPolicy,
      getFromCache,
      setToCache,
      errorRetryCount,
      errorRetryInterval,
      onDataReceived,
    ],
  )

  // 加载更多数据
  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1)
    }
  }, [isFetching, hasMore])

  // 刷新数据
  const refresh = useCallback(() => {
    setPage(1)
    fetchData(true)
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData, page])

  useEffect(() => {
    // 设置定时刷新
    let intervalId: ReturnType<typeof setInterval> | undefined

    if (refreshInterval > 0) {
      intervalId = setInterval(() => {
        refresh()
      }, refreshInterval)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [refreshInterval, refresh])

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refresh,
    loadMore,
    hasMore,
    isFetching,
    page,
  }
}

/**
 * 数据转换工具函数 (增强版)
 */
export const dataTransformers = {
  /**
   * 将时间序列数据转换为图表格式
   */
  timeSeriesTransformer: (
    data: any[],
    options: {
      dateField: string
      valueField: string
      labelField?: string
      groupField?: string
      sortData?: boolean
      aggregation?: "sum" | "avg" | "min" | "max" | "count"
      timeGranularity?: "minute" | "hour" | "day" | "week" | "month" | "quarter" | "year"
    },
  ) => {
    const { dateField, valueField, labelField, groupField, sortData = true, aggregation, timeGranularity } = options

    // 时间粒度处理函数
    const applyTimeGranularity = (date: Date): Date => {
      const newDate = new Date(date)

      switch (timeGranularity) {
        case "minute":
          newDate.setSeconds(0, 0)
          break
        case "hour":
          newDate.setMinutes(0, 0, 0)
          break
        case "day":
          newDate.setHours(0, 0, 0, 0)
          break
        case "week":
          const day = newDate.getDay()
          const diff = newDate.getDate() - day + (day === 0 ? -6 : 1)
          newDate.setDate(diff)
          newDate.setHours(0, 0, 0, 0)
          break
        case "month":
          newDate.setDate(1)
          newDate.setHours(0, 0, 0, 0)
          break
        case "quarter":
          const month = newDate.getMonth()
          newDate.setMonth(Math.floor(month / 3) * 3, 1)
          newDate.setHours(0, 0, 0, 0)
          break
        case "year":
          newDate.setMonth(0, 1)
          newDate.setHours(0, 0, 0, 0)
          break
      }

      return newDate
    }

    // 数据聚合函数
    const aggregateData = (points: DataPoint[]): DataPoint => {
      if (!aggregation || points.length === 0) {
        return points[0]
      }

      const x = points[0].x
      let y: number

      switch (aggregation) {
        case "sum":
          y = points.reduce((sum, point) => sum + point.y, 0)
          break
        case "avg":
          y = points.reduce((sum, point) => sum + point.y, 0) / points.length
          break
        case "min":
          y = Math.min(...points.map((point) => point.y))
          break
        case "max":
          y = Math.max(...points.map((point) => point.y))
          break
        case "count":
          y = points.length
          break
        default:
          y = points[0].y
      }

      return { x, y, count: points.length }
    }

    if (!groupField) {
      // 单一数据系列
      let points: DataPoint[] = data.map((item) => {
        const date = new Date(item[dateField])
        const granularDate = timeGranularity ? applyTimeGranularity(date) : date

        return {
          x: granularDate,
          y: Number(item[valueField]),
          label: labelField ? item[labelField] : undefined,
          originalDate: date,
          originalValue: item[valueField],
        }
      })

      // 按时间粒度聚合
      if (timeGranularity) {
        const groupedPoints = new Map<string, DataPoint[]>()

        points.forEach((point) => {
          const key = (point.x as Date).getTime().toString()
          if (!groupedPoints.has(key)) {
            groupedPoints.set(key, [])
          }
          groupedPoints.get(key)?.push(point)
        })

        points = Array.from(groupedPoints.entries()).map(([_, groupPoints]) => aggregateData(groupPoints))
      }

      // 排序
      if (sortData) {
        points.sort((a, b) => {
          const dateA = a.x instanceof Date ? a.x.getTime() : 0
          const dateB = b.x instanceof Date ? b.x.getTime() : 0
          return dateA - dateB
        })
      }

      return [
        {
          id: "timeseries",
          name: labelField || "时间序列数据",
          data: points,
        },
      ]
    }

    // 按组分类的多个数据系列
    const groups = new Map<string, DataPoint[]>()

    data.forEach((item) => {
      const groupValue = String(item[groupField])
      if (!groups.has(groupValue)) {
        groups.set(groupValue, [])
      }

      const date = new Date(item[dateField])
      const granularDate = timeGranularity ? applyTimeGranularity(date) : date

      groups.get(groupValue)?.push({
        x: granularDate,
        y: Number(item[valueField]),
        label: labelField ? item[labelField] : undefined,
        originalDate: date,
        originalValue: item[valueField],
      })
    })

    // 处理每个组的数据
    return Array.from(groups.entries()).map(([groupValue, groupPoints]) => {
      // 按时间粒度聚合
      let points = groupPoints

      if (timeGranularity) {
        const groupedPoints = new Map<string, DataPoint[]>()

        points.forEach((point) => {
          const key = (point.x as Date).getTime().toString()
          if (!groupedPoints.has(key)) {
            groupedPoints.set(key, [])
          }
          groupedPoints.get(key)?.push(point)
        })

        points = Array.from(groupedPoints.entries()).map(([_, points]) => aggregateData(points))
      }

      // 排序
      if (sortData) {
        points.sort((a, b) => {
          const dateA = a.x instanceof Date ? a.x.getTime() : 0
          const dateB = b.x instanceof Date ? b.x.getTime() : 0
          return dateA - dateB
        })
      }

      return {
        id: groupValue,
        name: groupValue,
        data: points,
      }
    })
  },

  /**
   * 将分类数据转换为图表格式
   */
  categoryTransformer: (
    data: any[],
    options: {
      categoryField: string
      valueField: string
      labelField?: string
      sortBy?: "value" | "category" | "none"
      sortDirection?: "asc" | "desc"
      limit?: number
      othersCategoryName?: string
    },
  ) => {
    const {
      categoryField,
      valueField,
      labelField,
      sortBy = "none",
      sortDirection = "desc",
      limit,
      othersCategoryName = "其他",
    } = options

    let points: DataPoint[] = data.map((item) => ({
      x: item[categoryField],
      y: Number(item[valueField]),
      label: labelField ? item[labelField] : undefined,
      originalCategory: item[categoryField],
      originalValue: item[valueField],
    }))

    // 排序
    if (sortBy !== "none") {
      points.sort((a, b) => {
        let comparison: number

        if (sortBy === "value") {
          comparison = a.y - b.y
        } else {
          // category
          comparison = String(a.x).localeCompare(String(b.x))
        }

        return sortDirection === "asc" ? comparison : -comparison
      })
    }

    // 限制数量并添加"其他"类别
    if (limit && points.length > limit) {
      const topPoints = points.slice(0, limit)
      const otherPoints = points.slice(limit)

      if (otherPoints.length > 0) {
        const otherSum = otherPoints.reduce((sum, point) => sum + point.y, 0)

        topPoints.push({
          x: othersCategoryName,
          y: otherSum,
          label: othersCategoryName,
          originalCategory: othersCategoryName,
          originalValue: otherSum,
          isOthersCategory: true,
          count: otherPoints.length,
        })
      }

      points = topPoints
    }

    return [
      {
        id: "categories",
        name: labelField || "分类数据",
        data: points,
      },
    ]
  },

  /**
   * 将层次数据转换为树形图格式
   */
  hierarchyTransformer: (
    data: any,
    options: {
      valueField?: string
      colorField?: string
      colorScheme?: string[]
    } = {},
  ) => {
    const { valueField = "value", colorField, colorScheme } = options

    // 递归处理层次数据
    const processNode = (node: any, depth = 0): any => {
      const result: any = {
        id: node.id || String(Math.random()),
        name: node.name || "未命名节点",
        value: node[valueField] || 0,
        depth,
      }

      // 添加颜色
      if (colorField && node[colorField]) {
        result.color = node[colorField]
      } else if (colorScheme && depth < colorScheme.length) {
        result.color = colorScheme[depth]
      }

      // 处理子节点
      if (Array.isArray(node.children) && node.children.length > 0) {
        result.children = node.children.map((child: any) => processNode(child, depth + 1))
      }

      return result
    }

    return [processNode(data)]
  },

  /**
   * 将网络数据转换为关系图格式
   */
  networkTransformer: (
    data: { nodes: any[]; links: any[] },
    options: {
      nodeIdField?: string
      nodeLabelField?: string
      nodeValueField?: string
      nodeColorField?: string
      linkSourceField?: string
      linkTargetField?: string
      linkValueField?: string
      linkColorField?: string
    } = {},
  ) => {
    const {
      nodeIdField = "id",
      nodeLabelField = "name",
      nodeValueField = "value",
      nodeColorField = "color",
      linkSourceField = "source",
      linkTargetField = "target",
      linkValueField = "value",
      linkColorField = "color",
    } = options

    const nodes = data.nodes.map((node) => ({
      id: node[nodeIdField],
      name: node[nodeLabelField] || node[nodeIdField],
      value: node[nodeValueField] || 1,
      color: node[nodeColorField],
      originalData: node,
    }))

    const links = data.links.map((link) => ({
      source: link[linkSourceField],
      target: link[linkTargetField],
      value: link[linkValueField] || 1,
      color: link[linkColorField],
      originalData: link,
    }))

    return [
      {
        id: "network",
        name: "网络关系图",
        data: { nodes, links },
      },
    ]
  },

  /**
   * 将地理数据转换为地图格式
   */
  geoTransformer: (
    data: any[],
    options: {
      locationField: string
      valueField: string
      nameField?: string
      coordinateType?: "name" | "latlng"
      geoJson?: any
    },
  ) => {
    const { locationField, valueField, nameField, coordinateType = "name", geoJson } = options

    const points = data.map((item) => {
      const result: any = {
        name: nameField ? item[nameField] : item[locationField],
        value: Number(item[valueField]),
        originalData: item,
      }

      if (coordinateType === "latlng") {
        // 假设locationField是一个包含lat和lng的对象或字符串
        if (typeof item[locationField] === "string") {
          const [lat, lng] = item[locationField].split(",").map(Number)
          result.latitude = lat
          result.longitude = lng
        } else if (typeof item[locationField] === "object") {
          result.latitude = item[locationField].lat || item[locationField].latitude
          result.longitude = item[locationField].lng || item[locationField].longitude
        }
      } else {
        result.location = item[locationField]
      }

      return result
    })

    return [
      {
        id: "geo",
        name: "地理数据",
        data: points,
        geoJson,
      },
    ]
  },

  /**
   * 将多维数据转换为雷达图格式
   */
  radarTransformer: (
    data: any[],
    options: {
      dimensionFields: string[]
      groupField?: string
      nameField?: string
      maxValues?: Record<string, number>
    },
  ) => {
    const { dimensionFields, groupField, nameField, maxValues = {} } = options

    if (!groupField) {
      // 单一数据系列
      return [
        {
          id: "radar",
          name: "雷达图数据",
          data: data.map((item) => {
            const point: any = {
              name: nameField ? item[nameField] : "数据点",
              dimensions: {},
            }

            dimensionFields.forEach((field) => {
              point.dimensions[field] = Number(item[field]) || 0
            })

            return point
          }),
          dimensions: dimensionFields,
          maxValues,
        },
      ]
    }

    // 按组分类的多个数据系列
    const groups = new Map<string, any[]>()

    data.forEach((item) => {
      const groupValue = String(item[groupField])
      if (!groups.has(groupValue)) {
        groups.set(groupValue, [])
      }

      const point: any = {
        name: nameField ? item[nameField] : "数据点",
        dimensions: {},
      }

      dimensionFields.forEach((field) => {
        point.dimensions[field] = Number(item[field]) || 0
      })

      groups.get(groupValue)?.push(point)
    })

    return Array.from(groups.entries()).map(([groupValue, points]) => ({
      id: groupValue,
      name: groupValue,
      data: points,
      dimensions: dimensionFields,
      maxValues,
    }))
  },

  /**
   * 将时间区间数据转换为甘特图格式
   */
  ganttTransformer: (
    data: any[],
    options: {
      taskField: string
      startField: string
      endField: string
      groupField?: string
      progressField?: string
      dependencyField?: string
    },
  ) => {
    const { taskField, startField, endField, groupField, progressField, dependencyField } = options

    const tasks = data.map((item) => {
      const task: any = {
        id: item.id || String(Math.random()),
        name: item[taskField],
        start: new Date(item[startField]),
        end: new Date(item[endField]),
        originalData: item,
      }

      if (groupField) {
        task.group = item[groupField]
      }

      if (progressField) {
        task.progress = Number(item[progressField]) || 0
      }

      if (dependencyField && item[dependencyField]) {
        task.dependencies = Array.isArray(item[dependencyField])
          ? item[dependencyField]
          : String(item[dependencyField])
              .split(",")
              .map((d) => d.trim())
      }

      return task
    })

    // 如果有分组，按组整理
    if (groupField) {
      const groups = new Map<string, any[]>()

      tasks.forEach((task) => {
        const groupValue = String(task.group)
        if (!groups.has(groupValue)) {
          groups.set(groupValue, [])
        }
        groups.get(groupValue)?.push(task)
      })

      return Array.from(groups.entries()).map(([groupValue, groupTasks]) => ({
        id: groupValue,
        name: groupValue,
        data: groupTasks,
      }))
    }

    return [
      {
        id: "gantt",
        name: "甘特图数据",
        data: tasks,
      },
    ]
  },
}

/**
 * 图表主题配置
 */
export const chartThemes = {
  light: {
    background: "#ffffff",
    text: "#333333",
    grid: "#eeeeee",
    tooltip: {
      background: "#ffffff",
      text: "#333333",
      border: "#dddddd",
    },
    colors: ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#FF6D01", "#46BDC6", "#7B61FF", "#1A73E8"],
  },
  dark: {
    background: "#1e1e1e",
    text: "#e0e0e0",
    grid: "#333333",
    tooltip: {
      background: "#2d2d2d",
      text: "#e0e0e0",
      border: "#444444",
    },
    colors: ["#5C9CE6", "#E67F73", "#FDD663", "#68C474", "#FF9A4D", "#68D5DE", "#9C8FFF", "#4D8EE1"],
  },
  // 新增主题
  yy: {
    background: "#f8fafc",
    text: "#334155",
    grid: "#e2e8f0",
    tooltip: {
      background: "#ffffff",
      text: "#334155",
      border: "#cbd5e1",
    },
    colors: ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#6366f1"],
  },
  corporate: {
    background: "#ffffff",
    text: "#1e293b",
    grid: "#e2e8f0",
    tooltip: {
      background: "#f8fafc",
      text: "#1e293b",
      border: "#cbd5e1",
    },
    colors: ["#0f766e", "#0369a1", "#4f46e5", "#9333ea", "#be123c", "#15803d", "#b45309", "#7c2d12"],
  },
}

/**
 * 图表辅助函数
 */
export const chartUtils = {
  /**
   * 生成随机颜色
   */
  generateRandomColor: () => {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`
  },

  /**
   * 生成渐变色数组
   */
  generateGradient: (startColor: string, endColor: string, steps: number) => {
    // 解析颜色
    const start = {
      r: Number.parseInt(startColor.slice(1, 3), 16),
      g: Number.parseInt(startColor.slice(3, 5), 16),
      b: Number.parseInt(startColor.slice(5, 7), 16),
    }

    const end = {
      r: Number.parseInt(endColor.slice(1, 3), 16),
      g: Number.parseInt(endColor.slice(3, 5), 16),
      b: Number.parseInt(endColor.slice(5, 7), 16),
    }

    const colors = []

    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1)

      const r = Math.round(start.r + ratio * (end.r - start.r))
      const g = Math.round(start.g + ratio * (end.g - start.g))
      const b = Math.round(start.b + ratio * (end.b - start.b))

      colors.push(
        `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
      )
    }

    return colors
  },

  /**
   * 格式化数值
   */
  formatNumber: (
    value: number,
    options: {
      locale?: string
      style?: "decimal" | "currency" | "percent" | "unit"
      currency?: string
      minimumFractionDigits?: number
      maximumFractionDigits?: number
      compact?: boolean
    } = {},
  ) => {
    const {
      locale = "zh-CN",
      style = "decimal",
      currency,
      minimumFractionDigits = 0,
      maximumFractionDigits = 2,
      compact = false,
    } = options

    const formatOptions: Intl.NumberFormatOptions = {
      style,
      minimumFractionDigits,
      maximumFractionDigits,
    }

    if (style === "currency" && currency) {
      formatOptions.currency = currency
    }

    if (compact) {
      formatOptions.notation = "compact"
    }

    return new Intl.NumberFormat(locale, formatOptions).format(value)
  },

  /**
   * 格式化日期
   */
  formatDate: (
    date: Date | string | number,
    options: {
      locale?: string
      format?: "short" | "medium" | "long" | "full"
      timeZone?: string
    } = {},
  ) => {
    const { locale = "zh-CN", format = "medium", timeZone } = options

    const dateObj = typeof date === "object" ? date : new Date(date)

    const formatOptions: Intl.DateTimeFormatOptions = {
      dateStyle: format,
    }

    if (timeZone) {
      formatOptions.timeZone = timeZone
    }

    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj)
  },

  /**
   * 数据导出功能
   */
  exportData: (
    data: DataSeries[] | ChartData,
    options: {
      format: "csv" | "json" | "excel" | "image" | "pdf"
      fileName?: string
      includeHeaders?: boolean
      dateFormat?: string
      numberFormat?: {
        locale?: string
        minimumFractionDigits?: number
        maximumFractionDigits?: number
      }
      chartRef?: React.RefObject<HTMLElement>
      width?: number
      height?: number
    },
  ) => {
    const {
      format,
      fileName = `chart-export-${new Date().toISOString().slice(0, 10)}`,
      includeHeaders = true,
      dateFormat = "YYYY-MM-DD",
      numberFormat,
      chartRef,
      width,
      height,
    } = options

    // 格式化日期
    const formatDateValue = (date: Date | string | number): string => {
      if (!(date instanceof Date) && typeof date !== "string" && typeof date !== "number") {
        return ""
      }

      const dateObj = typeof date === "object" ? date : new Date(date)

      if (isNaN(dateObj.getTime())) {
        return String(date)
      }

      // 简单的日期格式化
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, "0")
      const day = String(dateObj.getDate()).padStart(2, "0")

      if (dateFormat === "YYYY-MM-DD") {
        return `${year}-${month}-${day}`
      }

      const hours = String(dateObj.getHours()).padStart(2, "0")
      const minutes = String(dateObj.getMinutes()).padStart(2, "0")

      if (dateFormat === "YYYY-MM-DD HH:mm") {
        return `${year}-${month}-${day} ${hours}:${minutes}`
      }

      return dateObj.toISOString()
    }

    // 格式化数字
    const formatNumberValue = (num: number): string => {
      if (typeof num !== "number" || isNaN(num)) {
        return String(num)
      }

      if (!numberFormat) {
        return String(num)
      }

      const { locale = "zh-CN", minimumFractionDigits = 0, maximumFractionDigits = 2 } = numberFormat

      return new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(num)
    }

    // 处理数据系列格式
    const processDataSeries = (series: DataSeries[]): any[][] => {
      // 创建表头
      const headers = ["系列", "X值", "Y值"]

      // 创建数据行
      const rows: any[][] = []

      series.forEach((s) => {
        s.data.forEach((point) => {
          const xValue = point.x instanceof Date ? formatDateValue(point.x) : String(point.x)
          rows.push([s.name, xValue, formatNumberValue(point.y)])
        })
      })

      return includeHeaders ? [headers, ...rows] : rows
    }

    // 处理图表数据格式
    const processChartData = (chartData: ChartData): any[][] => {
      // 创建表头
      const headers = ["标签", ...chartData.datasets.map((ds) => ds.label)]

      // 创建数据行
      const rows = chartData.labels.map((label, i) => {
        return [label, ...chartData.datasets.map((ds) => formatNumberValue(ds.data[i]))]
      })

      return includeHeaders ? [headers, ...rows] : rows
    }

    // 确定数据格式并处理
    const processedData =
      Array.isArray(data) && data.length > 0 && "data" in data[0]
        ? processDataSeries(data as DataSeries[])
        : processChartData(data as ChartData)

    // 根据格式导出
    switch (format) {
      case "csv":
        return exportCSV(processedData, fileName)
      case "json":
        return exportJSON(data, fileName)
      case "excel":
        return exportExcel(processedData, fileName)
      case "image":
        return exportImage(chartRef, fileName, width, height)
      case "pdf":
        return exportPDF(chartRef, fileName, width, height)
      default:
        throw new Error(`不支持的导出格式: ${format}`)
    }
  },

  /**
   * 大数据集优化
   */
  optimizeDataset: (
    data: DataSeries[],
    options: {
      maxPoints?: number
      method?: "sampling" | "aggregation" | "windowing"
      samplingRate?: number
      windowSize?: number
      aggregationFn?: "avg" | "min" | "max" | "sum" | "first" | "last"
    } = {},
  ): DataSeries[] => {
    const { maxPoints = 1000, method = "sampling", samplingRate, windowSize = 10, aggregationFn = "avg" } = options

    // 检查是否需要优化
    const totalPoints = data.reduce((sum, series) => sum + series.data.length, 0)
    if (totalPoints <= maxPoints) {
      return data
    }

    // 计算采样率
    const actualSamplingRate = samplingRate || Math.max(1, Math.floor(totalPoints / maxPoints))

    return data.map((series) => {
      const { id, name, color, type, ...rest } = series
      let optimizedData: DataPoint[]

      switch (method) {
        case "sampling":
          // 简单采样
          optimizedData = series.data.filter((_, i) => i % actualSamplingRate === 0)
          break

        case "aggregation":
          // 数据聚合
          optimizedData = []
          for (let i = 0; i < series.data.length; i += windowSize) {
            const window = series.data.slice(i, i + windowSize)
            if (window.length === 0) continue

            const x = window[0].x
            let y: number

            switch (aggregationFn) {
              case "avg":
                y = window.reduce((sum, p) => sum + p.y, 0) / window.length
                break
              case "min":
                y = Math.min(...window.map((p) => p.y))
                break
              case "max":
                y = Math.max(...window.map((p) => p.y))
                break
              case "sum":
                y = window.reduce((sum, p) => sum + p.y, 0)
                break
              case "first":
                y = window[0].y
                break
              case "last":
                y = window[window.length - 1].y
                break
              default:
                y = window[0].y
            }

            optimizedData.push({ x, y, count: window.length })
          }
          break

        case "windowing":
          // 滑动窗口 (LTTB算法简化版)
          if (series.data.length <= maxPoints) {
            optimizedData = series.data
            break
          }

          const every = Math.floor(series.data.length / maxPoints)
          optimizedData = []

          for (let i = 0; i < series.data.length; i += every) {
            const window = series.data.slice(i, i + every)
            if (window.length === 0) continue

            // 找到窗口中y值最大和最小的点
            let minPoint = window[0]
            let maxPoint = window[0]

            for (let j = 1; j < window.length; j++) {
              if (window[j].y < minPoint.y) minPoint = window[j]
              if (window[j].y > maxPoint.y) maxPoint = window[j]
            }

            // 如果最大值和最小值不同，则都保留
            if (minPoint !== maxPoint) {
              optimizedData.push(minPoint)
              optimizedData.push(maxPoint)
            } else {
              optimizedData.push(minPoint)
            }
          }

          // 确保第一个和最后一个点被保留
          if (series.data.length > 0) {
            if (optimizedData[0] !== series.data[0]) {
              optimizedData.unshift(series.data[0])
            }

            const lastPoint = series.data[series.data.length - 1]
            if (optimizedData[optimizedData.length - 1] !== lastPoint) {
              optimizedData.push(lastPoint)
            }
          }
          break

        default:
          optimizedData = series.data
      }

      return {
        id,
        name,
        color,
        type,
        ...rest,
        data: optimizedData,
        _optimized: {
          method,
          originalLength: series.data.length,
          optimizedLength: optimizedData.length,
          compressionRatio: series.data.length / optimizedData.length,
        },
      }
    })
  },
}

// 导出CSV
function exportCSV(data: any[][], fileName: string): void {
  const csvContent = data
    .map((row) =>
      row
        .map((cell) => {
          // 处理包含逗号、引号或换行符的单元格
          const cellStr = String(cell).replace(/"/g, '""')
          return cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n") ? `"${cellStr}"` : cellStr
        })
        .join(","),
    )
    .join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  downloadBlob(blob, `${fileName}.csv`)
}

// 导出JSON
function exportJSON(data: any, fileName: string): void {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
  downloadBlob(blob, `${fileName}.json`)
}

// 导出Excel (简化版，实际应用中可能需要使用库如xlsx.js)
function exportExcel(data: any[][], fileName: string): void {
  // 创建一个基本的HTML表格
  const tableHtml = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          table { border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <table>
          ${data
            .map(
              (row, i) => `
            <tr>
              ${row
                .map((cell, j) => {
                  const tag = i === 0 ? "th" : "td"
                  return `<${tag}>${cell}</${tag}>`
                })
                .join("")}
            </tr>
          `,
            )
            .join("")}
        </table>
      </body>
    </html>
  `

  const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel;charset=utf-8;" })
  downloadBlob(blob, `${fileName}.xls`)
}

// 导出图像
function exportImage(
  chartRef: React.RefObject<HTMLElement> | undefined,
  fileName: string,
  width?: number,
  height?: number,
): void {
  if (!chartRef?.current) {
    console.error("导出图像失败：找不到图表元素")
    return
  }

  // 使用html2canvas (需要在实际应用中引入)
  // 这里只是示例代码，实际使用需要引入html2canvas库
  console.log("导出图像", chartRef.current, fileName, width, height)

  // 模拟导出过程
  alert(`图像导出功能需要引入html2canvas库。文件名：${fileName}.png`)
}

// 导出PDF
function exportPDF(
  chartRef: React.RefObject<HTMLElement> | undefined,
  fileName: string,
  width?: number,
  height?: number,
): void {
  if (!chartRef?.current) {
    console.error("导出PDF失败：找不到图表元素")
    return
  }

  // 使用jsPDF (需要在实际应用中引入)
  // 这里只是示例代码，实际使用需要引入jsPDF库
  console.log("导出PDF", chartRef.current, fileName, width, height)

  // 模拟导出过程
  alert(`PDF导出功能需要引入jsPDF库。文件名：${fileName}.pdf`)
}

// 通用下载Blob函数
function downloadBlob(blob: Blob, fileName: string): void {
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

/**
 * 导出默认配置
 */
export const defaultChartOptions: ChartOptions = {
  animation: true,
  legend: true,
  tooltip: true,
  responsive: true,
  colors: chartThemes.light.colors,
  theme: "light",
  interactions: ["tooltip"],
  grid: true,
}

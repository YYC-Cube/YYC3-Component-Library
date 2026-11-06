"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { InteractiveChart } from "./interactive-chart"
import { useDeviceDetection, useGestures, useTouchDetection } from "@yyc3/lib"
import type { DataSeries, ChartOptions, ChartType, ChartAnnotation } from "@yyc3/lib"
import { Button } from "@yyc3/ui/button"
import { Card, CardContent } from "@yyc3/ui/card"
import { Badge } from "@yyc3/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@yyc3/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Switch } from "@yyc3/ui/switch"
import { Slider } from "@yyc3/ui/slider"
import {
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  EyeOff,
} from "lucide-react"

interface MobileChartProps {
  data: DataSeries[]
  chartType?: ChartType
  options?: ChartOptions
  className?: string
  onDataPointClick?: (point: any, seriesId: string) => void
  onExport?: (format: string) => void
}

export function MobileChart({
  data,
  chartType = "line",
  options = {},
  className = "",
  onDataPointClick,
  onExport,
}: MobileChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 设备检测
  const { deviceType, isMobile, isTablet, orientation } = useDeviceDetection()
  const { isTouchDevice } = useTouchDetection()
  const { gesture } = useGestures(containerRef)

  // 移动端状态
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showMobileControls, setShowMobileControls] = useState(true)
  const [touchSensitivity, setTouchSensitivity] = useState(1)
  const [enableHapticFeedback, setEnableHapticFeedback] = useState(true)
  const [autoHideControls, setAutoHideControls] = useState(true)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [selectedChartType, setSelectedChartType] = useState<ChartType>(chartType)
  const [visibleSeries, setVisibleSeries] = useState<Set<string>>(new Set(data.map((series) => series.id)))

  // 触摸交互状态
  const [lastTap, setLastTap] = useState(0)
  const [touchStartTime, setTouchStartTime] = useState(0)
  const [isLongPress, setIsLongPress] = useState(false)
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 })

  // 自动隐藏控制栏
  useEffect(() => {
    if (!autoHideControls || !isMobile) return

    const timer = setTimeout(() => {
      setControlsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [autoHideControls, isMobile, controlsVisible])

  // 手势处理
  useEffect(() => {
    if (gesture === "none") return

    // 触觉反馈
    if (enableHapticFeedback && "vibrate" in navigator) {
      navigator.vibrate(50)
    }

    switch (gesture) {
      case "swipe-left":
        // 切换到下一个图表类型
        switchChartType("next")
        break
      case "swipe-right":
        // 切换到上一个图表类型
        switchChartType("prev")
        break
      case "swipe-up":
        // 进入全屏模式
        setIsFullscreen(true)
        break
      case "swipe-down":
        // 退出全屏模式或显示控制栏
        if (isFullscreen) {
          setIsFullscreen(false)
        } else {
          setControlsVisible(true)
        }
        break
    }
  }, [gesture, enableHapticFeedback, isFullscreen])

  // 图表类型切换
  const chartTypes: ChartType[] = ["line", "bar", "area", "pie", "scatter"]

  const switchChartType = (direction: "next" | "prev") => {
    const currentIndex = chartTypes.indexOf(selectedChartType)
    let newIndex: number

    if (direction === "next") {
      newIndex = (currentIndex + 1) % chartTypes.length
    } else {
      newIndex = currentIndex === 0 ? chartTypes.length - 1 : currentIndex - 1
    }

    setSelectedChartType(chartTypes[newIndex])
  }

  // 触摸事件处理
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      setTouchPosition({ x: touch.clientX, y: touch.clientY })
      setTouchStartTime(Date.now())
      setIsLongPress(false)

      // 长按检测
      const longPressTimer = setTimeout(() => {
        setIsLongPress(true)
        if (enableHapticFeedback && "vibrate" in navigator) {
          navigator.vibrate(100)
        }
        // 显示上下文菜单或详细信息
        setControlsVisible(true)
      }, 500)

      // 清理定时器
      const cleanup = () => clearTimeout(longPressTimer)
      e.currentTarget.addEventListener("touchend", cleanup, { once: true })
      e.currentTarget.addEventListener("touchmove", cleanup, { once: true })
    },
    [enableHapticFeedback],
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touchEndTime = Date.now()
      const touchDuration = touchEndTime - touchStartTime

      // 双击检测
      if (touchDuration < 300 && !isLongPress) {
        const now = Date.now()
        const timeSinceLastTap = now - lastTap

        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
          // 双击事件 - 重置缩放
          handleResetZoom()
          if (enableHapticFeedback && "vibrate" in navigator) {
            navigator.vibrate([50, 50, 50])
          }
        }

        setLastTap(now)
      }

      // 显示控制栏
      if (!isLongPress && touchDuration < 200) {
        setControlsVisible(true)
      }
    },
    [touchStartTime, isLongPress, lastTap, enableHapticFeedback],
  )

  // 缩放控制
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev * 1.2, 5))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev / 1.2, 0.5))
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  // 系列可见性切换
  const toggleSeriesVisibility = (seriesId: string) => {
    setVisibleSeries((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(seriesId)) {
        newSet.delete(seriesId)
      } else {
        newSet.add(seriesId)
      }
      return newSet
    })
  }

  // 全屏切换
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // 进入全屏
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      // 退出全屏
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  // 移动端优化的图表选项
  const mobileOptimizedOptions = {
    ...options,
    animation: !isMobile,
    interactions: isTouchDevice ? ["tooltip"] : options.interactions || ["tooltip", "zoom", "pan"],
    padding: isMobile ? { top: 10, right: 10, bottom: 30, left: 30 } : options.padding,
    legend: !isMobile || (isMobile && !isFullscreen),
    // 只保留 type 为 "line" 或 "rect" 的注解，并断言类型
    annotations: Array.isArray(options.annotations)
      ? (options.annotations.filter(
          (a) => a.type === "line" || a.type === "rect"
        ) as ChartAnnotation[])
      : undefined,
  }

  // 过滤可见数据系列，并将 DataPoint.x 中的 Date 转换为字符串
  const filteredData = data
    .filter((series) => visibleSeries.has(series.id))
    .map((series) => ({
      ...series,
      data: series.data.map((point) => ({
        ...point,
        x: point.x instanceof Date ? point.x.toISOString() : point.x,
      })),
    }))

  // 设备类型图标
  const DeviceIcon = deviceType === "mobile" ? Smartphone : deviceType === "tablet" ? Tablet : Monitor

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isFullscreen ? "fixed inset-0 z-50 bg-white dark:bg-gray-900" : ""} ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 移动端控制栏 */}
      {(isMobile || isTablet) && (
        <div
          className={`absolute top-0 left-0 right-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-transform duration-300 ${
            controlsVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex items-center justify-between p-2">
            {/* 左侧控制 */}
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <DeviceIcon className="w-3 h-3 mr-1" />
                {deviceType}
              </Badge>

              <Badge variant="secondary" className="text-xs">
                {orientation}
              </Badge>

              <Select value={selectedChartType} onValueChange={(value) => setSelectedChartType(value as ChartType)}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">线图</SelectItem>
                  <SelectItem value="bar">柱图</SelectItem>
                  <SelectItem value="area">面积</SelectItem>
                  <SelectItem value="pie">饼图</SelectItem>
                  <SelectItem value="scatter">散点</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 右侧控制 */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 5}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleResetZoom}>
                <RotateCcw className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>

              {/* 设置面板 */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>移动端图表设置</SheetTitle>
                    <SheetDescription>优化移动设备上的图表体验</SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 mt-6">
                    {/* 触摸设置 */}
                    <div className="space-y-4">
                      <h4 className="font-medium">触摸交互</h4>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">触觉反馈</span>
                        <Switch checked={enableHapticFeedback} onCheckedChange={setEnableHapticFeedback} />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">自动隐藏控制栏</span>
                        <Switch checked={autoHideControls} onCheckedChange={setAutoHideControls} />
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm">触摸灵敏度</span>
                        <Slider
                          value={[touchSensitivity]}
                          onValueChange={(value) => setTouchSensitivity(value[0])}
                          min={0.5}
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-500 text-center">{touchSensitivity.toFixed(1)}x</div>
                      </div>
                    </div>

                    {/* 数据系列控制 */}
                    <div className="space-y-4">
                      <h4 className="font-medium">数据系列</h4>

                      {data.map((series) => (
                        <div key={series.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div 
                              className={`w-3 h-3 rounded-full series-color-indicator`} 
                              data-color={series.color}
                            />
                            <span className="text-sm">{series.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleSeriesVisibility(series.id)}
                          >
                            {visibleSeries.has(series.id) ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* 导出选项 */}
                    <div className="space-y-4">
                      <h4 className="font-medium">导出</h4>

                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => onExport?.("csv")} className="text-xs">
                          CSV
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onExport?.("json")} className="text-xs">
                          JSON
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onExport?.("image")} className="text-xs">
                          图片
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onExport?.("pdf")} className="text-xs">
                          PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      )}

      {/* 手势提示 */}
      {isMobile && !isFullscreen && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <Card className="bg-black/70 text-white border-none">
            <CardContent className="p-2 text-xs text-center">
              <div className="space-y-1">
                <div>👆 点击显示控制栏</div>
                <div>👆👆 双击重置缩放</div>
                <div>👆⏱️ 长按显示菜单</div>
                <div>👈👉 左右滑动切换图表</div>
                <div>👆👇 上下滑动全屏/退出</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 图表容器 */}
      <div
        ref={chartRef}
        className={`w-full ${isFullscreen ? "h-screen" : "h-96"} ${
          (isMobile || isTablet) && controlsVisible ? "pt-12" : ""
        }`}
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: "center center",
        }}
      >
        <InteractiveChart
          data={filteredData as unknown as Parameters<typeof InteractiveChart>[0]['data']}
          options={mobileOptimizedOptions}
          onDataPointClick={onDataPointClick}
        />
      </div>

      {/* 缩放级别指示器 */}
      {zoomLevel !== 1 && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary" className="text-xs">
            {Math.round(zoomLevel * 100)}%
          </Badge>
        </div>
      )}
    </div>
  )
}

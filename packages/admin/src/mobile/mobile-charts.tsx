"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { cn } from "@yyc3/lib/utils"
import { Swipeable, PinchZoom } from "@/components/mobile/gesture-support"

interface MobileChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export function MobileChartCard({ title, description, children, className, fullWidth = false }: MobileChartCardProps) {
  return (
    <Card className={cn("overflow-hidden", fullWidth ? "w-full" : "w-[85vw] min-w-[280px]", className)}>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  )
}

export function MobileChartCarousel({ children }: { children: React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const childrenArray = React.Children.toArray(children)

  const handleSwipeLeft = () => {
    if (currentIndex < childrenArray.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: currentIndex * containerRef.current.offsetWidth,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  return (
    <div className="relative">
      <Swipeable onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} className="overflow-hidden">
        <div
          ref={containerRef}
          className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {React.Children.map(children, (child, index) => (
            <div key={index} className="flex-shrink-0 w-full snap-center px-4">
              {child}
            </div>
          ))}
        </div>
      </Swipeable>

      <div className="flex justify-center mt-4 gap-1">
        {childrenArray.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex ? "bg-primary w-4" : "bg-muted",
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

interface MobileLineChartProps {
  data: any[]
  title: string
  description?: string
  lines?: { dataKey: string; stroke: string; name: string }[]
  xAxisDataKey?: string
  height?: number
  className?: string
}

export function MobileLineChart({
  data,
  title,
  description,
  lines = [{ dataKey: "value", stroke: "#3b82f6", name: "数值" }],
  xAxisDataKey = "name",
  height = 200,
  className,
}: MobileLineChartProps) {
  const [activeTimeRange, setActiveTimeRange] = useState("all")
  const [scale, setScale] = useState(1)

  // Filter data based on time range
  const filteredData =
    activeTimeRange === "all"
      ? data
      : activeTimeRange === "last7"
        ? data.slice(-7)
        : activeTimeRange === "last30"
          ? data.slice(-30)
          : data

  return (
    <MobileChartCard title={title} description={description} className={className} fullWidth>
      <div className="px-4 pb-2">
        <Tabs value={activeTimeRange} onValueChange={setActiveTimeRange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="all" className="text-xs">
              全部
            </TabsTrigger>
            <TabsTrigger value="last7" className="text-xs">
              近7天
            </TabsTrigger>
            <TabsTrigger value="last30" className="text-xs">
              近30天
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <PinchZoom onZoomChange={setScale} className="px-2">
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={xAxisDataKey}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => value.toString().substring(0, 3)}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip labelStyle={{ fontSize: 12 }} itemStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.stroke}
                  name={line.name}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  strokeWidth={1.5}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </PinchZoom>

      <div className="flex justify-center items-center gap-2 p-2">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setScale(Math.max(1, scale - 0.5))}>
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setScale(Math.min(3, scale + 0.5))}>
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setScale(1)}>
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </MobileChartCard>
  )
}

interface MobileBarChartProps {
  data: any[]
  title: string
  description?: string
  dataKey?: string
  xAxisDataKey?: string
  height?: number
  className?: string
}

export function MobileBarChart({
  data,
  title,
  description,
  dataKey = "value",
  xAxisDataKey = "name",
  height = 200,
  className,
}: MobileBarChartProps) {
  return (
    <MobileChartCard title={title} description={description} className={className} fullWidth>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisDataKey}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => value.toString().substring(0, 3)}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip labelStyle={{ fontSize: 12 }} itemStyle={{ fontSize: 12 }} />
            <Bar dataKey={dataKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </MobileChartCard>
  )
}

interface MobilePieChartProps {
  data: any[]
  title: string
  description?: string
  dataKey?: string
  nameKey?: string
  height?: number
  className?: string
}

export function MobilePieChart({
  data,
  title,
  description,
  dataKey = "value",
  nameKey = "name",
  height = 200,
  className,
}: MobilePieChartProps) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  return (
    <MobileChartCard title={title} description={description} className={className} fullWidth>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={30}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelStyle={{ fontSize: 10 }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip labelStyle={{ fontSize: 12 }} itemStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </MobileChartCard>
  )
}

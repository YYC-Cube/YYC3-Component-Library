"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react"

interface DataCardProps {
  title: string
  description?: string
  value: string | number
  trend?: "up" | "down" | "stable"
  trendValue?: string
  progress?: number
  status?: "active" | "processing" | "completed" | "error"
  className?: string
  children?: React.ReactNode
}

export function DataCard({
  title,
  description,
  value,
  trend,
  trendValue,
  progress,
  status = "active",
  className,
  children,
}: DataCardProps) {
  const statusConfig = {
    active: { color: "bg-green-500", label: "活跃", icon: Activity },
    processing: { color: "bg-blue-500", label: "处理中", icon: Zap },
    completed: { color: "bg-gray-500", label: "已完成", icon: Activity },
    error: { color: "bg-red-500", label: "错误", icon: Activity },
  }

  const StatusIcon = statusConfig[status].icon

  return (
    <Card className={cn("relative overflow-hidden transition-all duration-300 hover:shadow-lg", className)}>
      {/* Status Indicator */}
      <div className={cn("absolute top-0 left-0 w-1 h-full", statusConfig[status].color)} />

      {/* Energy Glow Effect */}
      <div className="absolute top-2 right-2">
        <div className={cn("w-2 h-2 rounded-full animate-pulse", statusConfig[status].color)} />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant="outline" className="text-xs">
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig[status].label}
          </Badge>
        </div>
        {description && <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Value */}
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-foreground">{value}</div>
          {trend && trendValue && (
            <div
              className={cn(
                "flex items-center space-x-1 text-sm",
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600",
              )}
            >
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend === "down" ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">进度</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Custom Content */}
        {children}
      </CardContent>
    </Card>
  )
}

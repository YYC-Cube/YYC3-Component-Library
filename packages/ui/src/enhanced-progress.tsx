/**
 * file: enhanced-progress.tsx
 * description: v0 共享件晋升（theme 对齐版，源 33/apps 多数派正本）
 * author: YYC3 Team
 * version: v0.2.0
 * created: 2026-11-09
 * updated: 2026-11-09
 * status: active
 * tags: [component],[ui],[promoted],[theme-aligned]
 *
 * notes: design-system 依赖已对齐 @yyc3/theme（cardSurfaces/getProgressColor）
 */

"use client"

import { cn } from "../lib/utils"
import { getProgressColor } from "@yyc3/theme"

interface EnhancedProgressProps {
  value: number
  status?: "on-track" | "at-risk" | "off-track" | "excellent" | "good" | "warning" | "critical"
  size?: "sm" | "md" | "lg"
  animated?: boolean
  showLabel?: boolean
  className?: string
}

export function EnhancedProgress({
  value,
  status,
  size = "md",
  animated = false,
  showLabel = false,
  className,
}: EnhancedProgressProps) {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }

  const progressColor = getProgressColor(value, status)

  return (
    <div className={cn("relative", className)}>
      <div className={cn("bg-slate-200 rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full transition-all duration-500 relative overflow-hidden",
            progressColor,
            animated && "animate-pulse",
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
      {showLabel && <div className="text-xs text-slate-600 mt-1 text-center">{value}%</div>}
    </div>
  )
}

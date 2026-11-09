/**
 * file: enhanced-card.tsx
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

import { cn } from "../lib/utils"
import { cardSurfaces } from "@yyc3/theme"
import type { ReactNode } from "react"

interface EnhancedCardProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  variant?: "default" | "gradient" | "glass"
}

export function EnhancedCard({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  variant = "default",
}: EnhancedCardProps) {
  const cardVariants = {
    default: cardSurfaces.base,
    gradient:
      "bg-gradient-to-br from-white to-sky-50/50 border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200",
    glass:
      "bg-white/60 backdrop-blur-md border border-sky-200/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
  }

  return (
    <Card className={cn(cardVariants[variant], className)}>
      {(title || description) && (
        <CardHeader className={cn(cardSurfaces.header, "rounded-t-xl", headerClassName)}>
          {title && <CardTitle className="text-slate-800 font-semibold">{title}</CardTitle>}
          {description && <CardDescription className="text-sky-600">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn("p-6", contentClassName)}>{children}</CardContent>
    </Card>
  )
}

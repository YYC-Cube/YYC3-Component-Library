// ============================================================
// YYC³ · @yyc3/ui-enterprise YYCard（Phase 7 · cloud 域精度抽取补建）
// 源用法对齐：packages/cloud/src/ecommerce/*（YYCard/YYCardHeader/YYCardTitle/YYCardContent）
// 基于 Card 组合的 YY 前缀薄封装（预置云控制台视觉类名）
// ============================================================
import * as React from "react"

import { cn } from "../lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

function YYCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      data-slot="yy-card"
      className={cn("border-border/60 bg-card/80 shadow-sm backdrop-blur-sm", className)}
      {...props}
    />
  )
}

function YYCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <CardHeader data-slot="yy-card-header" className={cn("space-y-1", className)} {...props} />
}

function YYCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <CardTitle data-slot="yy-card-title" className={cn("text-base font-semibold", className)} {...props} />
}

function YYCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <CardContent data-slot="yy-card-content" className={cn("pt-0", className)} {...props} />
}

export { YYCard, YYCardHeader, YYCardTitle, YYCardContent }

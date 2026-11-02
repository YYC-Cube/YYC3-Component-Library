import { cn } from "@yyc3/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
}

export function StatCard({ title, value, description, icon: Icon, trend, trendValue, className }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-5 shadow-sm", className)}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            {trend && (
              <p
                className={cn(
                  "text-xs font-medium",
                  trend === "up" && "text-emerald-500",
                  trend === "down" && "text-rose-500",
                )}
              >
                {trend === "up" && "↑"}
                {trend === "down" && "↓"}
                {trendValue}
              </p>
            )}
          </div>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        {Icon && (
          <div className="rounded-md bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}

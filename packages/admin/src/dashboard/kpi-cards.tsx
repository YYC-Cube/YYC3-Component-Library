import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  trend?: "up" | "down"
  icon?: React.ReactNode
}

function KPICard({ title, value, change, trend, icon }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-2xl">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <Badge variant={trend === "up" ? "default" : "destructive"} className="text-xs">
              {Math.abs(change)}% vs 上周
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function KPICards() {
  const kpis = [
    {
      title: "今日营收",
      value: "¥18,450",
      change: 12.5,
      trend: "up",
      icon: "💰",
    },
    {
      title: "日均成本",
      value: "¥6,280",
      change: -3.2,
      trend: "down",
      icon: "📉",
    },
    {
      title: "订单数量",
      value: "248",
      change: 8.1,
      trend: "up",
      icon: "📦",
    },
    {
      title: "库存预警",
      value: "12",
      change: 2,
      trend: "down",
      icon: "⚠️",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  )
}

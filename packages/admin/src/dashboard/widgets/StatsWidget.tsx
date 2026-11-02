"use client"

import { useAppSelector } from "@/store/hooks"
import type { StatsConfig } from "@/store/widgetsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Settings, X, TrendingUp, TrendingDown } from "lucide-react"

interface StatsWidgetProps {
  id: string
  title: string
  config: StatsConfig
  isEditable: boolean
  onRemove: (id: string) => void
}

export function StatsWidget({ id, title, config, isEditable, onRemove }: StatsWidgetProps) {
  const data = useAppSelector((state) => {
    switch (config.dataSource) {
      case "totalSales":
        return state.data.totalSales
      default:
        return { value: 0, trend: 0, previousValue: 0 }
    }
  })

  const formatValue = (value: number) => {
    switch (config.format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value)
      case "percentage":
        return `${value}%`
      default:
        return value.toLocaleString()
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        {isEditable && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onRemove(id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col">
          <div className="text-3xl font-bold">{formatValue(data.value)}</div>

          {config.showTrend && data.trend !== 0 && (
            <div className="flex items-center mt-2">
              {data.trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={data.trend > 0 ? "text-green-500" : "text-red-500"}>
                {data.trend > 0 ? "+" : ""}
                {data.trend}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs previous period</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

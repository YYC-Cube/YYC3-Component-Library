"use client"

import { useAppSelector } from "@/store/hooks"
import type { ChartConfig } from "@/store/widgetsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Settings, X } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface ChartWidgetProps {
  id: string
  title: string
  config: ChartConfig
  isEditable: boolean
  onRemove: (id: string) => void
}

export function ChartWidget({ id, title, config, isEditable, onRemove }: ChartWidgetProps) {
  const data = useAppSelector((state) => {
    switch (config.dataSource) {
      case "salesData":
        return state.data.salesData
      case "categoryData":
        return state.data.categoryData
      default:
        return []
    }
  })

  const renderChart = () => {
    switch (config.chartType) {
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xAxisKey} />
            <YAxis />
            <Tooltip />
            {config.showLegend && <Legend />}
            {config.yAxisKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={config.colors[index % config.colors.length]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        )

      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xAxisKey} />
            <YAxis />
            <Tooltip />
            {config.showLegend && <Legend />}
            {config.yAxisKeys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={config.colors[index % config.colors.length]} />
            ))}
          </BarChart>
        )

      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={config.yAxisKeys[0]}
              nameKey={config.xAxisKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            {config.showLegend && <Legend />}
          </PieChart>
        )

      case "area":
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xAxisKey} />
            <YAxis />
            <Tooltip />
            {config.showLegend && <Legend />}
            {config.yAxisKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                fill={config.colors[index % config.colors.length]}
                stroke={config.colors[index % config.colors.length]}
              />
            ))}
          </AreaChart>
        )

      case "scatter":
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xAxisKey} />
            <YAxis />
            <Tooltip />
            {config.showLegend && <Legend />}
            {config.yAxisKeys.map((key, index) => (
              <Scatter key={key} name={key} data={data} fill={config.colors[index % config.colors.length]} />
            ))}
          </ScatterChart>
        )

      default:
        return <div>Unsupported chart type</div>
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
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height={200}>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

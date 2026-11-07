"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"

const data = [
  { date: "周一", revenue: 4000, cost: 2400 },
  { date: "周二", revenue: 3000, cost: 1398 },
  { date: "周三", revenue: 2000, cost: 9800 },
  { date: "周四", revenue: 2780, cost: 3908 },
  { date: "周五", revenue: 1890, cost: 4800 },
  { date: "周六", revenue: 2390, cost: 3800 },
  { date: "周日", revenue: 3490, cost: 4300 },
]

export function SalesChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>销售趋势</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            7天
          </Button>
          <Button size="sm" variant="outline">
            30天
          </Button>
          <Button size="sm" variant="outline">
            90天
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#4F46E5" name="营收" strokeWidth={2} />
            <Line type="monotone" dataKey="cost" stroke="#10B981" name="成本" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

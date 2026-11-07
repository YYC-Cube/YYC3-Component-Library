"use client"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"

const data = [
  { name: "食材成本", value: 45 },
  { name: "人工成本", value: 25 },
  { name: "租赁成本", value: 15 },
  { name: "其他成本", value: 15 },
]

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"]

export function CostDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>成本分布</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

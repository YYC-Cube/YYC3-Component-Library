import { YYCard, YYCardHeader, YYCardTitle, YYCardContent } from "@yyc3/ui/yy-card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

export default function SalesChart() {
  const data = [
    { name: "1月", sales: 4000, orders: 240 },
    { name: "2月", sales: 3000, orders: 198 },
    { name: "3月", sales: 5000, orders: 306 },
    { name: "4月", sales: 2780, orders: 189 },
    { name: "5月", sales: 1890, orders: 142 },
    { name: "6月", sales: 2390, orders: 178 },
    { name: "7月", sales: 3490, orders: 251 },
  ]

  return (
    <YYCard className="h-full">
      <YYCardHeader>
        <YYCardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          销售趋势
        </YYCardTitle>
      </YYCardHeader>
      <YYCardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </YYCardContent>
    </YYCard>
  )
}

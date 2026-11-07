import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Badge } from "@yyc3/ui-enterprise/badge"

const orders = [
  { label: "待确认", count: 5, color: "bg-orange-500" },
  { label: "制作中", count: 12, color: "bg-blue-500" },
  { label: "已完成", count: 128, color: "bg-green-500" },
  { label: "已取消", count: 3, color: "bg-red-500" },
]

export function OrderSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>订单摘要</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${order.color}`} />
                <span className="text-sm">{order.label}</span>
              </div>
              <Badge variant="secondary">{order.count}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

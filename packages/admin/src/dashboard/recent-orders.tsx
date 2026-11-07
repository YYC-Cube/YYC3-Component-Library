import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui-enterprise/table"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Button } from "@yyc3/ui-enterprise/button"

const orders = [
  {
    id: "ORD-001",
    customer: "张三",
    amount: 528,
    status: "completed",
    time: "14:30",
  },
  {
    id: "ORD-002",
    customer: "李四",
    amount: 256,
    status: "pending",
    time: "14:45",
  },
  {
    id: "ORD-003",
    customer: "王五",
    amount: 892,
    status: "processing",
    time: "15:00",
  },
  {
    id: "ORD-004",
    customer: "赵六",
    amount: 345,
    status: "completed",
    time: "15:15",
  },
  {
    id: "ORD-005",
    customer: "孙七",
    amount: 667,
    status: "completed",
    time: "15:30",
  },
]

const statusMap = {
  completed: { label: "已完成", variant: "default" as const },
  pending: { label: "待确认", variant: "secondary" as const },
  processing: { label: "制作中", variant: "outline" as const },
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>最近订单</CardTitle>
        <Button variant="outline" size="sm">
          查看全部
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>订单号</TableHead>
              <TableHead>客户</TableHead>
              <TableHead>金额</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>¥{order.amount}</TableCell>
                <TableCell>
                  <Badge variant={statusMap[order.status as keyof typeof statusMap].variant}>
                    {statusMap[order.status as keyof typeof statusMap].label}
                  </Badge>
                </TableCell>
                <TableCell>{order.time}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    详情
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

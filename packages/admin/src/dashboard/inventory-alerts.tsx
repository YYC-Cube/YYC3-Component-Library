import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Badge } from "@yyc3/ui/badge"
import { Button } from "@yyc3/ui/button"
import { AlertTriangle } from "lucide-react"

const alerts = [
  { id: 1, name: "番茄酱", current: 5, unit: "瓶", status: "低库存" },
  { id: 2, name: "牛肉", current: 8, unit: "kg", status: "即将用尽" },
  { id: 3, name: "生菜", current: 12, unit: "束", status: "低库存" },
]

export function InventoryAlerts() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>库存预警</CardTitle>
        <Badge variant="destructive">{alerts.length} 件低库存</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium">{alert.name}</p>
                  <p className="text-sm text-muted-foreground">
                    当前库存: {alert.current} {alert.unit}
                  </p>
                </div>
              </div>
              <Button size="sm">快速补货</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

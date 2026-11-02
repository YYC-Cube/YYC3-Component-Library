import { Button } from "@yyc3/ui/button"
import { Plus, Package, FileText, TrendingUp } from "lucide-react"

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button className="gap-2">
        <Plus className="w-4 h-4" />
        新建菜品
      </Button>
      <Button variant="outline" className="gap-2 bg-transparent">
        <Package className="w-4 h-4" />
        库存补货
      </Button>
      <Button variant="outline" className="gap-2 bg-transparent">
        <FileText className="w-4 h-4" />
        查看订单
      </Button>
      <Button variant="outline" className="gap-2 bg-transparent">
        <TrendingUp className="w-4 h-4" />
        生成报表
      </Button>
    </div>
  )
}

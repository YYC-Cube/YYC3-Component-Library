import { YYStatCard } from "@yyc3/ui/yy-stat-card"
import { ShoppingCart, TruckIcon, PackageCheck } from "lucide-react"

export default function OrderStats() {
  const orderStats = [
    {
      label: "今日订单",
      value: 128,
      icon: ShoppingCart,
      trend: "up" as const,
      change: 12,
      unit: "单",
    },
    {
      label: "配送中",
      value: 84,
      icon: TruckIcon,
      trend: "up" as const,
      change: 8,
      unit: "单",
    },
    {
      label: "已完成",
      value: 1254,
      icon: PackageCheck,
      trend: "up" as const,
      change: 23,
      unit: "单",
    },
  ]

  return (
    <>
      {orderStats.map((stat, index) => (
        <YYStatCard key={index} stat={stat} delay={index * 100} />
      ))}
    </>
  )
}

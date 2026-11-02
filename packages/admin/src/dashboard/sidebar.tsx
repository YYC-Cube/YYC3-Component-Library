"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  TrendingUp,
  ShoppingCart,
  FileText,
  Bot,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@yyc3/lib/utils"
import { Button } from "@yyc3/ui/button"

const menuItems = [
  {
    label: "仪表板",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "菜单管理",
    href: "/menu",
    icon: UtensilsCrossed,
  },
  {
    label: "进销存",
    href: "/inventory",
    icon: Package,
  },
  {
    label: "成本分析",
    href: "/cost",
    icon: TrendingUp,
  },
  {
    label: "订单管理",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    label: "报表分析",
    href: "/reports",
    icon: FileText,
  },
  {
    label: "AI客服",
    href: "/support",
    icon: Bot,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">D</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Dine Manager</h1>
            <p className="text-xs text-muted-foreground">餐饮管理系统</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-auto space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn("w-full justify-start gap-3", isActive && "bg-primary text-primary-foreground")}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t space-y-3">
        <Link href="/settings" className="w-full">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="w-5 h-5" />
            <span>系统设置</span>
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive">
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </Button>
      </div>
    </aside>
  )
}

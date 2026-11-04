/**
 * ⟨YYC³⟩ 面包屑导航组件
 * 动态路径导航和快速返回
 */
"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@yyc3/ui"

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

const routeMap: Record<string, string> = {
  dashboard: "仪表板",
  users: "用户管理",
  add: "添加用户",
  roles: "角色权限",
  banned: "封禁管理",
  content: "内容管理",
  posts: "文章管理",
  media: "媒体库",
  categories: "分类管理",
  analytics: "数据分析",
  reports: "报表中心",
  realtime: "实时监控",
  infrastructure: "基础设施",
  servers: "服务器管理",
  storage: "存储管理",
  security: "安全中心",
  development: "开发环境",
  "cloud-sync": "云端同步",
  settings: "系统设置",
  notifications: "通知设置",
  appearance: "外观设置",
}

export function YYBreadcrumb() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  const breadcrumbItems: BreadcrumbItem[] = [{ label: "首页", href: "/", icon: Home }]

  let currentPath = ""
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`
    const label = routeMap[segment] || segment
    breadcrumbItems.push({
      label,
      href: currentPath,
    })
  })

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className="h-4 w-4 text-yy-ink-standard/40" />}

          <Link
            href={item.href}
            className={cn(
              "flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-300",
              index === breadcrumbItems.length - 1
                ? "text-yy-cloud-standard font-medium bg-yy-cloud-standard/10"
                : "text-yy-ink-standard/70 hover:text-yy-cloud-standard hover:bg-yy-cloud-standard/5",
            )}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.label}</span>
          </Link>
        </div>
      ))}
    </nav>
  )
}

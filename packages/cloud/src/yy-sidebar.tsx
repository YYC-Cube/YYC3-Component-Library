import { LayoutDashboard, ListChecks, MessageSquare, Settings, Bot } from "lucide-react"

import type { MainNavItem, SidebarNavItem } from "./types"

interface DashboardConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "文档",
      href: "/docs",
    },
    {
      title: "支持",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "仪表盘",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "任务",
      href: "/dashboard/tasks",
      icon: ListChecks,
    },
    {
      title: "聊天",
      href: "/dashboard/chat",
      icon: MessageSquare,
      badge: "新",
    },
    {
      title: "AI助手",
      href: "/ai-assistant",
      icon: Bot,
      badge: "智能",
      description: "对话式AI助手，智能完成各种任务",
    },
    {
      title: "设置",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ],
}

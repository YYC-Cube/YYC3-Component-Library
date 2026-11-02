"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Home, BarChart3, Brain, FileText, Code, Users, Settings, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface SidebarNavigationProps {
  currentPath?: string
}

export function SidebarNavigation({ currentPath = "/" }: SidebarNavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const navigationItems = [
    {
      id: "home",
      label: "首页",
      icon: <Home className="h-5 w-5" />,
      href: "/",
      progress: 100,
      status: "completed",
    },
    {
      id: "visualization",
      label: "数据可视化",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/dashboard",
      progress: 82,
      status: "active",
    },
    {
      id: "ai-insights",
      label: "AI洞察",
      icon: <Brain className="h-5 w-5" />,
      href: "/analytics",
      progress: 100,
      status: "completed",
    },
    {
      id: "reports",
      label: "报告生成",
      icon: <FileText className="h-5 w-5" />,
      href: "/reports",
      progress: 73,
      status: "processing",
    },
    {
      id: "development",
      label: "开发模块",
      icon: <Code className="h-5 w-5" />,
      href: "/learning",
      progress: 90,
      status: "active",
    },
  ]

  const getProgressColor = (progress: number, status: string) => {
    if (status === "completed") return "bg-green-500"
    if (status === "processing") return "bg-yellow-500"
    if (progress >= 80) return "bg-blue-500"
    return "bg-gray-400"
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card/95 backdrop-blur-sm border-r border-border/50 z-50">
      {/* Brand Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/YanYUCloud%C2%B3-3xbyGypi5OaveS2vyKmS715VZ1tj1Y.png"
              alt="YYC³ Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">YYC³</h1>
            <p className="text-sm text-muted-foreground">EasyVizAI</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <Link key={item.id} href={item.href}>
            <div
              className={`group relative p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                currentPath === item.href ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
              }`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div
                    className={`transition-colors duration-200 ${
                      currentPath === item.href ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`font-medium transition-colors duration-200 ${
                      currentPath === item.href ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">{item.progress}%</span>
                  {hoveredItem === item.id && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(item.progress, item.status)}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Development Status */}
      <div className="p-4 border-t border-border/50 mt-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-foreground mb-2">开发状态</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">模块进度</span>
            <Badge variant="secondary" className="text-xs">
              2/7
            </Badge>
          </div>
          <Progress value={28} className="h-2" />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 space-y-2">
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground">
          <Users className="h-4 w-4 mr-3" />
          开发团队
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4 mr-3" />
          系统设置
        </Button>
      </div>
    </div>
  )
}

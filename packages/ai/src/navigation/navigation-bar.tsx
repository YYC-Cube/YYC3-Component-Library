"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, BarChart3, Brain, FileText, Settings, User, Menu, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationNode {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  isActive?: boolean
  energy?: number
}

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeNode, setActiveNode] = useState("home")
  const [energyLevels, setEnergyLevels] = useState<Record<string, number>>({})

  const navigationNodes: NavigationNode[] = [
    {
      id: "home",
      label: "首页",
      icon: <Home className="h-5 w-5" />,
      href: "/",
      energy: 100,
    },
    {
      id: "visualization",
      label: "数据可视化",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/visualization",
      energy: 85,
    },
    {
      id: "ai-insights",
      label: "AI 洞察",
      icon: <Brain className="h-5 w-5" />,
      href: "/ai-insights",
      energy: 92,
    },
    {
      id: "reports",
      label: "报告生成",
      icon: <FileText className="h-5 w-5" />,
      href: "/reports",
      energy: 78,
    },
    {
      id: "modules",
      label: "开发模块",
      icon: <Sparkles className="h-5 w-5" />,
      href: "/modules",
      energy: 95,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyLevels((prev) => {
        const newLevels: Record<string, number> = {}
        navigationNodes.forEach((node) => {
          const baseEnergy = node.energy || 50
          const variation = Math.sin(Date.now() / 1000 + node.id.length) * 10
          newLevels[node.id] = Math.max(0, Math.min(100, baseEnergy + variation))
        })
        return newLevels
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const handleNodeClick = (nodeId: string) => {
    setActiveNode(nodeId)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Sidebar */}
      <nav
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-card/95 backdrop-blur-sm border-r border-border/50 transform transition-transform duration-300 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%BE%BD%E6%A0%87-T9sb0fcVcGyRkxZfBC7srgdkFiTDzz.png"
                alt="YYC³ Logo"
                className="h-10 w-10"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">YYC³</h2>
              <p className="text-xs text-muted-foreground">EasyVizAI</p>
            </div>
          </div>

          {/* Navigation Nodes */}
          <div className="space-y-2">
            {navigationNodes.map((node) => {
              const energy = energyLevels[node.id] || node.energy || 50
              const isActive = activeNode === node.id

              return (
                <div key={node.id} className="relative">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start space-x-3 h-12 relative overflow-hidden",
                      isActive && "bg-primary/10 text-primary border border-primary/20",
                    )}
                    onClick={() => handleNodeClick(node.id)}
                  >
                    {/* Energy Ball Effect */}
                    <div className="relative">
                      {node.icon}
                      <div
                        className={cn(
                          "absolute inset-0 rounded-full opacity-30 animate-pulse",
                          isActive ? "bg-primary" : "bg-muted-foreground",
                        )}
                        style={{
                          transform: `scale(${0.8 + (energy / 100) * 0.4})`,
                          filter: `blur(${2 - (energy / 100) * 1}px)`,
                        }}
                      />
                    </div>

                    <span className="flex-1 text-left">{node.label}</span>

                    {/* Energy Level Indicator */}
                    <div className="flex flex-col items-end space-y-1">
                      <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-300 rounded-full",
                            energy > 80
                              ? "bg-green-500"
                              : energy > 60
                                ? "bg-yellow-500"
                                : energy > 40
                                  ? "bg-orange-500"
                                  : "bg-red-500",
                          )}
                          style={{ width: `${energy}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{Math.round(energy)}%</span>
                    </div>
                  </Button>

                  {/* Active Node Glow Effect */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-primary/5 animate-pulse pointer-events-none" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Development Status */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-sm text-foreground mb-2">开发状态</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">模块进度</span>
                <Badge variant="secondary" className="text-xs">
                  2/7
                </Badge>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: "28%" }} />
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="mt-8 pt-4 border-t border-border/50">
            <Button variant="ghost" className="w-full justify-start space-x-3">
              <User className="h-4 w-4" />
              <span>开发团队</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start space-x-3 mt-1">
              <Settings className="h-4 w-4" />
              <span>系统设置</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Plus, X, Sparkles, Brain, BarChart3, FileText } from "lucide-react"

interface FloatingAction {
  icon: React.ReactNode
  label: string
  action: () => void
  color: string
}

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const actions: FloatingAction[] = [
    {
      icon: <BarChart3 className="h-4 w-4" />,
      label: "创建图表",
      action: () => console.log("Create chart"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: <Brain className="h-4 w-4" />,
      label: "AI 分析",
      action: () => console.log("AI analysis"),
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "生成报告",
      action: () => console.log("Generate report"),
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: <Sparkles className="h-4 w-4" />,
      label: "智能推荐",
      action: () => console.log("Smart recommendations"),
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      <div
        className={cn(
          "flex flex-col-reverse gap-3 mb-3 transition-all duration-300 ease-out",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-center gap-3 group"
            style={{
              transitionDelay: isOpen ? `${index * 50}ms` : `${(actions.length - index - 1) * 50}ms`,
            }}
          >
            <div className="bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              <span className="text-sm font-medium text-foreground">{action.label}</span>
            </div>
            <Button
              size="sm"
              className={cn(
                "h-12 w-12 rounded-full shadow-lg transition-all duration-200 hover:scale-110",
                action.color,
              )}
              onClick={() => {
                action.action()
                setIsOpen(false)
              }}
            >
              {action.icon}
            </Button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110",
          "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90",
          isOpen && "rotate-45",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  )
}

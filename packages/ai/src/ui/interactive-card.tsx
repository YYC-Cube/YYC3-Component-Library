"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface InteractiveCardProps {
  title: string
  description: string
  icon: React.ReactNode
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  hoverEffect?: "lift" | "glow" | "scale" | "none"
}

export function InteractiveCard({
  title,
  description,
  icon,
  children,
  className,
  onClick,
  hoverEffect = "lift",
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const hoverEffects = {
    lift: "hover:shadow-xl hover:-translate-y-2",
    glow: "hover:shadow-2xl hover:shadow-primary/20",
    scale: "hover:scale-105",
    none: "",
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 ease-out",
        "border-border/50 bg-card/50 backdrop-blur-sm",
        hoverEffects[hoverEffect],
        isHovered && "ring-2 ring-primary/20",
        className,
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "p-2 rounded-lg transition-all duration-300",
              "bg-primary/10 text-primary",
              isHovered && "bg-primary/20 scale-110",
            )}
          >
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
}

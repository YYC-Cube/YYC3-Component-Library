"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, ChevronRight, X } from "lucide-react"
import { Button } from "@yyc3/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { cn } from "@yyc3/lib/utils"

interface SessionSummaryProps {
  title: string
  description?: string
  summaryItems: {
    label: string
    value: string | number
    icon?: React.ReactNode
  }[]
  nextSteps: {
    label: string
    href: string
    primary?: boolean
  }[]
  onClose?: () => void
  className?: string
}

export function SessionSummary({
  title,
  description,
  summaryItems,
  nextSteps,
  onClose,
  className,
}: SessionSummaryProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  return (
    <Card className={cn("border-primary/20 shadow-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <CardTitle>{title}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">关闭</span>
          </Button>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaryItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2 rounded-md border p-3">
              {item.icon}
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">下一步建议</p>
        <div className="flex flex-wrap gap-2">
          {nextSteps.map((step, index) => (
            <Button key={index} variant={step.primary ? "default" : "outline"} size="sm" asChild>
              <a href={step.href}>
                {step.label}
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

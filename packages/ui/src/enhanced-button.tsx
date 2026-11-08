/**
 * file: enhanced-button.tsx
 * description: v0 共享件晋升（多数派逐字节一致，来源 33/apps）
 * author: YYC3 Team
 * version: v0.1.0
 * created: 2026-11-09
 * updated: 2026-11-09
 * status: active
 * tags: [component],[ui],[promoted]
 *
 * notes: N2 二次迁移前置——由开发区多数派规范件晋升
 */

import { Button } from "./button"
"use client"


import { cn } from "../lib/utils"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface EnhancedButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost" | "outline"
  size?: "sm" | "md" | "lg"
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  loading?: boolean
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function EnhancedButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  className,
  onClick,
  disabled,
  type = "button",
}: EnhancedButtonProps) {
  const buttonVariants = {
    primary:
      "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg",
    secondary:
      "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg",
    ghost:
      "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg",
    outline:
      "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg border-0",
  }

  const sizeVariants = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        buttonVariants[variant],
        sizeVariants[size],
        "transition-all duration-200 font-medium",
        loading && "opacity-70 cursor-not-allowed",
        className,
      )}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        Icon && iconPosition === "left" && <Icon className="w-4 h-4 mr-2" />
      )}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4 ml-2" />}
    </Button>
  )
}

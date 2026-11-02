// components/logout-button.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({
  variant = "default",
  size = "default",
  className = "",
  children = "注销"
}: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        // 注销成功，刷新页面状态并重定向到首页
        router.push("/login")
        router.refresh()
      } else {
        console.error("注销失败")
      }
    } catch (error) {
      console.error("注销过程中发生错误:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? "注销中..." : children}
    </Button>
  )
}

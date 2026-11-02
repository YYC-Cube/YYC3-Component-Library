"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2, Shield } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  requiredPermission?: string
}

export function ProtectedRoute({ children, requiredRole, requiredPermission }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, hasRole, hasPermission } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        // 未认证，重定向到登录页
        router.push("/login")
        return
      }

      if (requiredRole && !hasRole(requiredRole)) {
        // 角色权限不足
        router.push("/unauthorized")
        return
      }

      if (requiredPermission && !hasPermission(requiredPermission)) {
        // 功能权限不足
        router.push("/unauthorized")
        return
      }
    }
  }, [mounted, isLoading, isAuthenticated, requiredRole, requiredPermission, hasRole, hasPermission, router])

  // 在挂载前或加载中显示加载状态
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">验证身份中...</p>
        </div>
      </div>
    )
  }

  // 未认证
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Shield className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">未授权访问，正在跳转...</p>
        </div>
      </div>
    )
  }

  // 权限检查失败
  if ((requiredRole && !hasRole(requiredRole)) || (requiredPermission && !hasPermission(requiredPermission))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Shield className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">权限不足，正在跳转...</p>
        </div>
      </div>
    )
  }

  // 权限验证通过，渲染子组件
  return <>{children}</>
}

// 默认导出以保持向后兼容
export default ProtectedRoute

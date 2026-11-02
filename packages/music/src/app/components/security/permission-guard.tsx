"use client"

import type { ReactNode } from "react"
import { type User, type Permission, hasPermission, hasAllPermissions, hasAnyPermission } from "@/lib/auth/permissions"

interface PermissionGuardProps {
  user: User
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean // 是否需要所有权限
  fallback?: ReactNode // 无权限时显示的内容
  children: ReactNode
}

export default function PermissionGuard({
  user,
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
  children,
}: PermissionGuardProps) {
  // 单个权限检查
  if (permission && !hasPermission(user, permission)) {
    return <>{fallback}</>
  }

  // 多个权限检查
  if (permissions.length > 0) {
    const hasPermissions = requireAll ? hasAllPermissions(user, permissions) : hasAnyPermission(user, permissions)

    if (!hasPermissions) {
      return <>{fallback}</>
    }
  }

  // 有权限，显示子组件
  return <>{children}</>
}

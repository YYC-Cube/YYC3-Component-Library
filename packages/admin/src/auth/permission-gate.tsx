import type { ReactNode } from "react"
import type { ResourceType, ActionType } from "@yyc3/lib/auth/permission-types"
import { usePermissions } from "@/contexts/permission-context"

interface PermissionGateProps {
  resource: ResourceType
  action: ActionType
  children: ReactNode
  fallback?: ReactNode
  conditions?: Record<string, any>
}

export function PermissionGate({ resource, action, children, fallback = null, conditions }: PermissionGateProps) {
  const { hasPermission, isLoading } = usePermissions()

  // 如果权限正在加载，可以显示加载状态或返回null
  if (isLoading) {
    return null
  }

  // 检查权限
  const hasAccess = hasPermission(resource, action, conditions)

  // 如果有权限，显示子组件，否则显示备用内容
  return hasAccess ? <>{children}</> : <>{fallback}</>
}

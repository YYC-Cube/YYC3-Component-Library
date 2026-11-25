/**
 * file: status-badge.tsx
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

import { Badge } from "./badge"

/** 任务状态（原 `@/lib/types/workflow-types` 不存在且未配置 `@/` 别名，就地定义以消除幽灵依赖） */
export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "escalated"
  | "overdue"
  | "warning"

interface StatusBadgeProps {
  status: TaskStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-gray-100">
          待处理
        </Badge>
      )
    case "in_progress":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          处理中
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          已完成
        </Badge>
      )
    case "escalated":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          已升级
        </Badge>
      )
    case "overdue":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          已超时
        </Badge>
      )
    case "warning":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          警告
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

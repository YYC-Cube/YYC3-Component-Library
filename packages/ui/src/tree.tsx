/**
 * file: tree.tsx
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

import type React from "react"
import type { ReactNode } from "react"

interface TreeNodeProps {
  label: string
  children?: ReactNode
}

export const TreeNode: React.FC<TreeNodeProps> = ({ label, children }) => {
  return (
    <li>
      {label}
      {children && <ul>{children}</ul>}
    </li>
  )
}

interface TreeProps {
  children: ReactNode
}

export const Tree: React.FC<TreeProps> = ({ children }) => {
  return <ul>{children}</ul>
}

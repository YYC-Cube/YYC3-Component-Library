// ============================================================
// YYC³ · @yyc3/cloud 导航类型（Phase 7 精度抽取补建）
// 源用法反推：yy-sidebar.tsx 的 @/types（MainNavItem/SidebarNavItem）
// ============================================================
import type { LucideIcon } from 'lucide-react'

export interface MainNavItem {
  title: string
  href: string
  disabled?: boolean
}

export interface SidebarNavItem {
  title: string
  href: string
  disabled?: boolean
  icon?: LucideIcon
  badge?: string
  description?: string
}

export interface DashboardConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

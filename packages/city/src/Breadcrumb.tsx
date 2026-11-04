"use client"

// ============================================================
// YYC³ · @yyc3/city Breadcrumb（精度抽取适配 · Phase 7）
// 源：YYC_Smart_City_Platform 权威副本
// 解耦适配（2026-11-04）：移除 next/navigation（usePathname→pathname props）
// 与 next/link（→ 标准 <a>），组件库与框架解耦；Next.js 消费方传入
// pathname 即可保持原行为
// ============================================================

import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

export interface BreadcrumbProps {
  /** 当前路径（框架解耦：Next.js 消费方传 usePathname() 结果）@default "/" */
  pathname?: string
  /** 路径→中文标签映射（可扩展） */
  pathMap?: Record<string, string>
}

const DEFAULT_PATH_MAP: Record<string, string> = {
  "city-empowerment": "城市赋能",
  "elderly-care": "关爱老人",
  "smart-living": "智能生活",
  "smart-community": "智慧社区",
  "health-monitoring": "健康监测",
  "smart-travel": "智能出行",
  services: "服务项目",
  facilities: "社区设施",
  news: "社区动态",
}

export function Breadcrumb({ pathname = "/", pathMap = DEFAULT_PATH_MAP }: BreadcrumbProps) {
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [{ label: "首页", href: "/" }]

    if (pathname === "/") return breadcrumbs

    const paths = pathname.split("/").filter(Boolean)
    let currentPath = ""

    for (let i = 0; i < paths.length; i++) {
      currentPath += "/" + paths[i]
      const label = pathMap[paths[i]] || paths[i].charAt(0).toUpperCase() + paths[i].slice(1).replace(/-/g, " ")

      breadcrumbs.push({
        label,
        href: currentPath,
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className="breadcrumb-3d mb-6">
      <div className="flex items-center text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.href} className="flex items-center">
            {index === 0 ? (
              <a href={breadcrumb.href} className="breadcrumb-item flex items-center">
                <Home size={14} className="mr-1" />
                <span>{breadcrumb.label}</span>
              </a>
            ) : index === breadcrumbs.length - 1 ? (
              <span className="breadcrumb-item active">{breadcrumb.label}</span>
            ) : (
              <a href={breadcrumb.href} className="breadcrumb-item">
                {breadcrumb.label}
              </a>
            )}

            {index < breadcrumbs.length - 1 && <ChevronRight size={14} className="breadcrumb-separator" />}
          </div>
        ))}
      </div>
    </nav>
  )
}

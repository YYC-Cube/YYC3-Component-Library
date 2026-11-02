"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

type IconItem = {
  label: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
}

type PageIconBarProps = {
  items: IconItem[]
  variant?: "default" | "compact"
  className?: string
}

export default function PageIconBar({ items, variant = "default", className }: PageIconBarProps) {
  const pathname = usePathname()

  const containerBase = "w-full grid bg-white rounded-xl border border-gray-100 shadow-sm"
  const containerVariant = variant === "compact" ? "grid-cols-1 gap-2 p-2" : "grid-cols-2 sm:grid-cols-3 gap-4 p-4"

  return (
    <div className={`${containerBase} ${containerVariant} ${className ?? ""}`}>
      {items.map((item) => {
        const isActive = !!item.href && (pathname === item.href || pathname?.startsWith(`${item.href}/`))
        const wrapperCls = `flex items-center gap-3 rounded-lg transition-colors cursor-pointer ${
          variant === "compact" ? "px-3 py-2" : "px-4 py-3"
        } ${isActive ? "bg-blue-50 ring-1 ring-blue-100" : "hover:bg-gray-50"}`
        const iconSize = variant === "compact" ? "w-8 h-8" : "w-10 h-10"
        const iconCls = `${iconSize} rounded-lg flex items-center justify-center ${
          isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
        }`
        const labelCls = `${variant === "compact" ? "text-xs" : "text-sm"} font-medium ${isActive ? "text-blue-700" : "text-gray-800"}`

        const content = (
          <div className={wrapperCls} onClick={item.onClick} aria-current={isActive ? "page" : undefined}>
            <div className={iconCls}>{item.icon}</div>
            <span className={labelCls}>{item.label}</span>
          </div>
        )
        return item.href ? (
          <Link key={item.label} href={item.href} className="block">
            {content}
          </Link>
        ) : (
          <div key={item.label}>{content}</div>
        )
      })}
    </div>
  )
}
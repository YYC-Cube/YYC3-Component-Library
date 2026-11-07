"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@yyc3/ui-enterprise/button"
import { Sheet, SheetContent, SheetTrigger } from "@yyc3/ui-enterprise/sheet"
import { ScrollArea } from "@yyc3/ui-enterprise/scroll-area"
import { cn } from "@yyc3/lib/utils"
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon?: React.ReactNode
  disabled?: boolean
  external?: boolean
  label?: string
  children?: NavItem[]
}

interface MobileSidebarProps {
  items: NavItem[]
  title?: string
  className?: string
}

export function ResponsiveSidebar({ items, title, className }: MobileSidebarProps) {
  const [open, setOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const pathname = usePathname()

  // 关闭侧边栏
  const handleClose = () => {
    setOpen(false)
  }

  // 切换子菜单展开状态
  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  // 检查路径是否匹配
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  // 当路径变化时关闭侧边栏
  useEffect(() => {
    handleClose()
  }, [pathname])

  return (
    <div className={className}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">打开菜单</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <div className="flex items-center gap-2">
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-5 w-5" />
                <span className="sr-only">关闭</span>
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="px-2 py-4">
                <nav className="flex flex-col gap-1">
                  {items.map((item, index) => {
                    if (item.disabled) return null

                    if (item.children) {
                      const isExpanded = expandedItems[item.title] || false
                      const hasActiveChild = item.children.some((child) => isActive(child.href))

                      return (
                        <div key={index} className="flex flex-col">
                          <Button
                            variant="ghost"
                            className={cn(
                              "flex w-full items-center justify-between px-4 py-2 text-left",
                              (isExpanded || hasActiveChild) && "bg-muted font-medium",
                            )}
                            onClick={() => toggleExpanded(item.title)}
                          >
                            <div className="flex items-center gap-2">
                              {item.icon}
                              <span>{item.title}</span>
                            </div>
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                          {isExpanded && (
                            <div className="ml-4 mt-1 flex flex-col gap-1 pl-2 border-l">
                              {item.children.map((child, childIndex) => (
                                <Button
                                  key={childIndex}
                                  variant="ghost"
                                  asChild
                                  className={cn(
                                    "justify-start px-4 py-2 text-sm",
                                    isActive(child.href) && "bg-muted font-medium",
                                  )}
                                >
                                  <Link href={child.href}>
                                    <div className="flex items-center gap-2">
                                      {child.icon}
                                      <span>{child.title}</span>
                                    </div>
                                  </Link>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    }

                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        asChild
                        className={cn("justify-start px-4 py-2", isActive(item.href) && "bg-muted font-medium")}
                      >
                        <Link href={item.href}>
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <span>{item.title}</span>
                          </div>
                        </Link>
                      </Button>
                    )
                  })}
                </nav>
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* 桌面端侧边栏 */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r bg-white pt-5">
          <div className="flex items-center flex-shrink-0 px-4">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
          </div>
          <div className="mt-5 flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {items.map((item, index) => {
                if (item.disabled) return null

                if (item.children) {
                  const isExpanded = expandedItems[item.title] || false
                  const hasActiveChild = item.children.some((child) => isActive(child.href))

                  return (
                    <div key={index} className="space-y-1">
                      <Button
                        variant="ghost"
                        className={cn(
                          "flex w-full items-center justify-between px-4 py-2 text-left",
                          (isExpanded || hasActiveChild) && "bg-muted font-medium",
                        )}
                        onClick={() => toggleExpanded(item.title)}
                      >
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span>{item.title}</span>
                        </div>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                      {isExpanded && (
                        <div className="ml-4 pl-2 border-l space-y-1">
                          {item.children.map((child, childIndex) => (
                            <Button
                              key={childIndex}
                              variant="ghost"
                              asChild
                              className={cn(
                                "justify-start px-4 py-2 text-sm",
                                isActive(child.href) && "bg-muted font-medium",
                              )}
                            >
                              <Link href={child.href}>
                                <div className="flex items-center gap-2">
                                  {child.icon}
                                  <span>{child.title}</span>
                                </div>
                              </Link>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Button
                    key={index}
                    variant="ghost"
                    asChild
                    className={cn("justify-start px-4 py-2 w-full", isActive(item.href) && "bg-muted font-medium")}
                  >
                    <Link href={item.href}>
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                    </Link>
                  </Button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

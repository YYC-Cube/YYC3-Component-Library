"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ScrollArea } from "@yyc3/ui-enterprise/scroll-area"
import { Icon } from "@iconify/react"

const navigationItems = [
  {
    title: "运营中心",
    href: "/dashboard",
    icon: "lucide:bar-chart-3",
    color: "border-l-green-500 hover:bg-green-50 text-green-700",
    activeColor: "border-l-green-500 bg-green-50 text-green-700",
  },
  {
    title: "系统监控",
    href: "/system-monitor",
    icon: "lucide:monitor",
    color: "border-l-blue-500 hover:bg-blue-50 text-blue-700",
    activeColor: "border-l-blue-500 bg-blue-50 text-blue-700",
  },
]

const newFeatureModules = [
  {
    title: "应用总览",
    href: "/modules",
    icon: "lucide:home",
    color: "border-l-blue-500 hover:bg-blue-50 text-blue-700",
    activeColor: "border-l-blue-500 bg-blue-50 text-blue-700",
  },
  {
    title: "AI智能助手",
    href: "/ai-assistant",
    icon: "lucide:bot",
    color: "border-l-purple-500 hover:bg-purple-50 text-purple-700",
    activeColor: "border-l-purple-500 bg-purple-50 text-purple-700",
  },
  {
    title: "AI创作助手",
    href: "/ai-content-creator",
    icon: "lucide:wand-2",
    color: "border-l-purple-500 hover:bg-purple-50 text-purple-700",
    activeColor: "border-l-purple-500 bg-purple-50 text-purple-700",
  },
  {
    title: "AI客户数据",
    href: "/ai-customer-data",
    icon: "lucide:brain",
    color: "border-l-purple-500 hover:bg-purple-50 text-purple-700",
    activeColor: "border-l-purple-500 bg-purple-50 text-purple-700",
  },
  {
    title: "AI智能表单",
    href: "/ai-smart-forms",
    icon: "lucide:file-text",
    color: "border-l-purple-500 hover:bg-purple-50 text-purple-700",
    activeColor: "border-l-purple-500 bg-purple-50 text-purple-700",
  },
  {
    title: "多门店管理",
    href: "/store-management",
    icon: "lucide:store",
    color: "border-l-green-500 hover:bg-green-50 text-green-700",
    activeColor: "border-l-green-500 bg-green-50 text-green-700",
  },
  {
    title: "高级BI分析",
    href: "/advanced-bi",
    icon: "lucide:trending-up",
    color: "border-l-purple-500 hover:bg-purple-50 text-purple-700",
    activeColor: "border-l-purple-500 bg-purple-50 text-purple-700",
  },
  {
    title: "PWA管理",
    href: "/pwa-management",
    icon: "lucide:smartphone",
    color: "border-l-indigo-500 hover:bg-indigo-50 text-indigo-700",
    activeColor: "border-l-indigo-500 bg-indigo-50 text-indigo-700",
  },
  {
    title: "国际化管理",
    href: "/internationalization",
    icon: "lucide:globe",
    color: "border-l-cyan-500 hover:bg-cyan-50 text-cyan-700",
    activeColor: "border-l-cyan-500 bg-cyan-50 text-cyan-700",
  },
  {
    title: "移动端应用",
    href: "/mobile-app",
    icon: "lucide:smartphone",
    color: "border-l-rose-500 hover:bg-rose-50 text-rose-700",
    activeColor: "border-l-rose-500 bg-rose-50 text-rose-700",
  },
  {
    title: "安全中心",
    href: "/security",
    icon: "lucide:shield",
    color: "border-l-orange-500 hover:bg-orange-50 text-orange-700",
    activeColor: "border-l-orange-500 bg-orange-50 text-orange-700",
  },
]

const coreModules = [
  {
    title: "客户管理",
    href: "/customers",
    icon: "lucide:users",
    color: "border-l-orange-500 hover:bg-orange-50 text-orange-700",
    activeColor: "border-l-orange-500 bg-orange-50 text-orange-700",
  },
  {
    title: "任务管理",
    href: "/tasks",
    icon: "lucide:check-square",
    color: "border-l-green-500 hover:bg-green-50 text-green-700",
    activeColor: "border-l-green-500 bg-green-50 text-green-700",
  },
  {
    title: "沟通协作",
    href: "/communication",
    icon: "lucide:message-square",
    color: "border-l-green-500 hover:bg-green-50 text-green-700",
    activeColor: "border-l-green-500 bg-green-50 text-green-700",
  },
  {
    title: "数据分析",
    href: "/analytics",
    icon: "lucide:trending-up",
    color: "border-l-purple-500 hover:bg-purple-50 text-purple-700",
    activeColor: "border-l-purple-500 bg-purple-50 text-purple-700",
  },
  {
    title: "财务管理",
    href: "/finance",
    icon: "lucide:dollar-sign",
    color: "border-l-orange-500 hover:bg-orange-50 text-orange-700",
    activeColor: "border-l-orange-500 bg-orange-50 text-orange-700",
  },
  {
    title: "项目管理",
    href: "/projects",
    icon: "lucide:folder-open",
    color: "border-l-purple-500 hover:bg-purple-50 text-purple-700",
    activeColor: "border-l-purple-500 bg-purple-50 text-purple-700",
  },
  {
    title: "OKR管理",
    href: "/okr",
    icon: "lucide:target",
    color: "border-l-purple-500 hover:bg-purple-50 text-purple-700",
    activeColor: "border-l-purple-500 bg-purple-50 text-purple-700",
  },
  {
    title: "团队协作",
    href: "/collaboration",
    icon: "lucide:users",
    color: "border-l-green-500 hover:bg-green-50 text-green-700",
    activeColor: "border-l-green-500 bg-green-50 text-green-700",
  },
  {
    title: "审批流程",
    href: "/approval",
    icon: "lucide:check-square",
    color: "border-l-orange-500 hover:bg-orange-50 text-orange-700",
    activeColor: "border-l-orange-500 bg-orange-50 text-orange-700",
  },
  {
    title: "智创协同",
    href: "/creative-collaboration",
    icon: "lucide:lightbulb",
    color: "border-l-purple-500 hover:bg-purple-50 text-purple-700",
    activeColor: "border-l-purple-500 bg-purple-50 text-purple-700",
  },
]

const systemModules = [
  {
    title: "通知中心",
    href: "/notifications",
    icon: "lucide:bell",
    color: "border-l-yellow-500 hover:bg-yellow-50 text-yellow-700",
    activeColor: "border-l-yellow-500 bg-yellow-50 text-yellow-700",
  },
  {
    title: "日程安排",
    href: "/schedule",
    icon: "lucide:calendar",
    color: "border-l-yellow-500 hover:bg-yellow-50 text-yellow-700",
    activeColor: "border-l-yellow-500 bg-yellow-50 text-yellow-700",
  },
  {
    title: "参数设置",
    href: "/parameter-settings",
    icon: "lucide:sliders",
    color: "border-l-blue-500 hover:bg-blue-50 text-blue-700",
    activeColor: "border-l-blue-500 bg-blue-50 text-blue-700",
  },
  {
    title: "平台对接",
    href: "/platform-integration",
    icon: "lucide:link",
    color: "border-l-indigo-500 hover:bg-indigo-50 text-indigo-700",
    activeColor: "border-l-indigo-500 bg-indigo-50 text-indigo-700",
  },
  {
    title: "系统设置",
    href: "/settings",
    icon: "lucide:settings",
    color: "border-l-blue-500 hover:bg-blue-50 text-blue-700",
    activeColor: "border-l-blue-500 bg-blue-50 text-blue-700",
  },
  {
    title: "帮助中心",
    href: "/help",
    icon: "lucide:help-circle",
    color: "border-l-yellow-500 hover:bg-yellow-50 text-yellow-700",
    activeColor: "border-l-yellow-500 bg-yellow-50 text-yellow-700",
  },
]

const advancedModules = [
  {
    title: "系统测试",
    href: "/system-testing",
    icon: "lucide:test-tube",
    color: "border-l-green-500 hover:bg-green-50 text-green-700",
    activeColor: "border-l-green-500 bg-green-50 text-green-700",
  },
  {
    title: "性能优化",
    href: "/performance-optimization",
    icon: "lucide:zap",
    color: "border-l-yellow-500 hover:bg-yellow-50 text-yellow-700",
    activeColor: "border-l-yellow-500 bg-yellow-50 text-yellow-700",
  },
  {
    title: "数据集成",
    href: "/data-integration",
    icon: "lucide:database",
    color: "border-l-purple-500 hover:bg-purple-50 text-purple-700",
    activeColor: "border-l-purple-500 bg-purple-50 text-purple-700",
  },
  {
    title: "用户培训",
    href: "/training",
    icon: "lucide:graduation-cap",
    color: "border-l-orange-500 hover:bg-orange-50 text-orange-700",
    activeColor: "border-l-orange-500 bg-orange-50 text-orange-700",
  },
  {
    title: "系统管理",
    href: "/system-management",
    icon: "lucide:settings",
    color: "border-l-blue-500 hover:bg-blue-50 text-blue-700",
    activeColor: "border-l-blue-500 bg-blue-50 text-blue-700",
  },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isNewFeaturesExpanded, setIsNewFeaturesExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const isActive = (href: string) => pathname === href

  const handleNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    e.stopPropagation()

    console.log("导航到:", href)

    try {
      router.push(href)
      if (isMobile && onClose) {
        onClose()
      }
    } catch (error) {
      console.error("导航错误:", error)
    }
  }

  const handleToggleExpanded = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsNewFeaturesExpanded(!isNewFeaturesExpanded)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      {isMobile && open && (
        <div className="fixed inset-0 bg-black/50 z-[100] lg:hidden" onClick={handleClose} style={{ zIndex: 100 }} />
      )}

      <div
        className={`
        fixed top-0 bottom-0 left-0
        ${open ? "translate-x-0" : "-translate-x-full"}
        w-64 bg-white border-r border-gray-200 flex flex-col h-full
        transition-transform duration-300 ease-in-out
        ${isMobile ? "shadow-2xl" : "shadow-lg"}
      `}
        style={{
          zIndex: 110,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "16rem",
        }}
      >
        <div className="relative p-4 border-b border-gray-200">
          {isMobile && (
            <button
              className="absolute top-4 right-4 w-8 h-8 p-0 hover:bg-gray-100 transition-all duration-300 z-[120] rounded-md flex items-center justify-center"
              onClick={handleClose}
              type="button"
              style={{ zIndex: 120 }}
            >
              <Icon icon="lucide:x" className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center">
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Customer Care Center
            </h2>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const active = isActive(item.href)
              return (
                <button
                  key={item.href}
                  type="button"
                  className={`w-full justify-start h-10 px-3 border-l-4 transition-all duration-300 hover:shadow-md group flex items-center rounded-md relative ${
                    active ? item.activeColor : `border-l-transparent ${item.color}`
                  }`}
                  onClick={(e) => handleNavigation(e, item.href)}
                  style={{ zIndex: 115 }}
                >
                  <Icon
                    icon={item.icon}
                    className="w-4 h-4 mr-3 flex-shrink-0 group-hover:scale-110 transition-all duration-300"
                  />
                  <span className="font-medium truncate group-hover:translate-x-1 transition-all duration-300">
                    {item.title}
                  </span>
                </button>
              )
            })}

            <div className="mt-6">
              <button
                type="button"
                className="w-full justify-between h-10 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 group flex items-center rounded-md relative"
                onClick={handleToggleExpanded}
                style={{ zIndex: 115 }}
              >
                <div className="flex items-center">
                  <Icon
                    icon="lucide:home"
                    className="w-4 h-4 mr-3 flex-shrink-0 group-hover:scale-110 transition-all duration-300"
                  />
                  <span className="font-medium truncate">新功能模块</span>
                </div>
                {isNewFeaturesExpanded ? (
                  <Icon icon="lucide:chevron-down" className="w-4 h-4 flex-shrink-0 transition-all duration-300" />
                ) : (
                  <Icon icon="lucide:chevron-up" className="w-4 h-4 flex-shrink-0 transition-all duration-300" />
                )}
              </button>

              {isNewFeaturesExpanded && (
                <div className="ml-4 mt-2 space-y-1">
                  {newFeatureModules.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <button
                        key={item.href}
                        type="button"
                        className={`w-full justify-start h-9 px-3 border-l-4 transition-all duration-300 hover:shadow-md group flex items-center rounded-md relative ${
                          active ? item.activeColor : `border-l-transparent ${item.color}`
                        }`}
                        onClick={(e) => handleNavigation(e, item.href)}
                        style={{ zIndex: 115 }}
                      >
                        <Icon
                          icon={item.icon}
                          className="w-4 h-4 mr-3 flex-shrink-0 group-hover:scale-110 transition-all duration-300"
                        />
                        <span className="text-sm truncate group-hover:translate-x-1 transition-all duration-300">
                          {item.title}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">核心功能</h3>
              </div>
              <div className="space-y-1">
                {coreModules.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <button
                      key={item.href}
                      type="button"
                      className={`w-full justify-start h-9 px-3 border-l-4 transition-all duration-300 hover:shadow-md group flex items-center rounded-md relative ${
                        active ? item.activeColor : `border-l-transparent ${item.color}`
                      }`}
                      onClick={(e) => handleNavigation(e, item.href)}
                      style={{ zIndex: 115 }}
                    >
                      <Icon
                        icon={item.icon}
                        className="w-4 h-4 mr-3 flex-shrink-0 group-hover:scale-110 transition-all duration-300"
                      />
                      <span className="text-sm truncate group-hover:translate-x-1 transition-all duration-300">
                        {item.title}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">系统功能</h3>
              </div>
              <div className="space-y-1">
                {systemModules.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <button
                      key={item.href}
                      type="button"
                      className={`w-full justify-start h-9 px-3 border-l-4 transition-all duration-300 hover:shadow-md group flex items-center rounded-md relative ${
                        active ? item.activeColor : `border-l-transparent ${item.color}`
                      }`}
                      onClick={(e) => handleNavigation(e, item.href)}
                      style={{ zIndex: 115 }}
                    >
                      <Icon
                        icon={item.icon}
                        className="w-4 h-4 mr-3 flex-shrink-0 group-hover:scale-110 transition-all duration-300"
                      />
                      <span className="text-sm truncate group-hover:translate-x-1 transition-all duration-300">
                        {item.title}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">高级功能</h3>
              </div>
              <div className="space-y-1">
                {advancedModules.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <button
                      key={item.href}
                      type="button"
                      className={`w-full justify-start h-9 px-3 border-l-4 transition-all duration-300 hover:shadow-md group flex items-center rounded-md relative ${
                        active ? item.activeColor : `border-l-transparent ${item.color}`
                      }`}
                      onClick={(e) => handleNavigation(e, item.href)}
                      style={{ zIndex: 115 }}
                    >
                      <Icon
                        icon={item.icon}
                        className="w-4 h-4 mr-3 flex-shrink-0 group-hover:scale-110 transition-all duration-300"
                      />
                      <span className="text-sm truncate group-hover:translate-x-1 transition-all duration-300">
                        {item.title}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200">
          <button
            type="button"
            className="w-full justify-start items-center h-12 px-3 text-gray-600 hover:bg-gray-50 transition-all duration-300 hover:shadow-md group flex rounded-md relative"
            style={{ zIndex: 115 }}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3 group-hover:scale-110 transition-all duration-300">
                <span className="text-xs font-medium text-white">JS</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">John Smith</div>
                <div className="text-xs text-gray-500">管理员</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

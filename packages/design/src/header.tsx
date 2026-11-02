"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Badge } from "@yyc3/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@yyc3/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@yyc3/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@yyc3/ui/sheet"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "next-themes"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications] = useState([
    { id: 1, title: "新客户咨询", message: "张先生咨询沙发产品", time: "5分钟前", unread: true },
    { id: 2, title: "订单更新", message: "订单#12345已发货", time: "1小时前", unread: true },
    { id: 3, title: "系统通知", message: "系统将于今晚维护", time: "2小时前", unread: false },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      console.log("执行退出登录") // 调试日志
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("退出登录失败:", error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Header: 菜单按钮被点击") // 调试日志
    onMenuClick()
  }

  const handleProfileClick = () => {
    console.log("导航到个人资料页面") // 调试日志
    router.push("/profile")
  }

  const handleSettingsClick = () => {
    console.log("导航到系统设置页面") // 调试日志
    router.push("/settings")
  }

  const unreadCount = notifications.filter((n) => n.unread).length

  if (!mounted) {
    return null
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60"
      style={{ zIndex: 90 }}
    >
      <div className="flex h-16 items-center px-4">
        {/* 左侧：菜单按钮 */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 transition-all duration-300 p-2 rounded-md flex items-center justify-center"
            onClick={handleMenuClick}
            aria-label="切换侧边栏"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>

          {/* 系统标题 */}
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Customer Care Center
            </h1>
          </div>
        </div>

        {/* 中间：搜索框 */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="search"
              placeholder="搜索客户、订单、产品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </form>
        </div>

        {/* 右侧：功能按钮和用户菜单 */}
        <div className="flex items-center space-x-2">
          {/* 主题切换 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden sm:flex hover:bg-gray-100 transition-all duration-300"
          >
            {theme === "dark" ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </Button>

          {/* 语言切换 */}
          <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-gray-100 transition-all duration-300">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </Button>

          {/* 帮助 */}
          <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-gray-100 transition-all duration-300">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Button>

          {/* 消息 */}
          <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-gray-100 transition-all duration-300">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </Button>

          {/* 通知 */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 transition-all duration-300">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM10.07 2.82a3 3 0 00-4.24 0L2.82 5.83a3 3 0 000 4.24L15.17 22.42a3 3 0 004.24 0l2.01-2.01a3 3 0 000-4.24L8.07 2.82z"
                  />
                </svg>
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center animate-pulse"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="border-l-4 border-l-blue-500" style={{ zIndex: 130 }}>
              <SheetHeader>
                <SheetTitle>通知中心</SheetTitle>
                <SheetDescription>您有 {unreadCount} 条未读通知</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border-l-4 transition-all duration-300 hover:shadow-md ${
                      notification.unread
                        ? "bg-blue-50 border-l-blue-500 dark:bg-blue-900/20"
                        : "bg-gray-50 border-l-gray-300 dark:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* 用户菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full hover:scale-105 transition-all duration-300"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 border-l-4 border-l-purple-500"
              align="end"
              forceMount
              style={{ zIndex: 130 }}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "用户"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {user?.role === "admin" ? "管理员" : user?.role === "manager" ? "经理" : "用户"}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleProfileClick}
                className="hover:bg-blue-50 transition-all duration-300 cursor-pointer"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>个人资料</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSettingsClick}
                className="hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>系统设置</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 transition-all duration-300 cursor-pointer"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

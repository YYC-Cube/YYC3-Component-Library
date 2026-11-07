/**
 * @file 仪表盘头部组件
 * @description 显示系统标题和用户信息
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Bell, Menu, Search, User, Settings } from "lucide-react"
import { Button3D } from "@yyc3/ui-enterprise/3d-button"
import { Input } from "@yyc3/ui-enterprise/input"
import { Sheet, SheetContent, SheetTrigger } from "@yyc3/ui-enterprise/sheet"
import { MobileNav } from "./mobile-nav"
import { AppLogo } from "./app-logo"
import { Notifications } from "./notifications"
import { SettingsPanel } from "./settings-panel"
import { UserProfile } from "./user-profile"
import { useAppContext } from "@yyc3/lib/AppContext"

export function DashboardHeader() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const { state } = useAppContext()

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-tech-blue-900 px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button3D className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">切换菜单</span>
          </Button3D>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-tech-blue-800">
          <MobileNav />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <AppLogo />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <form className="hidden md:flex">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-tech-blue-300" />
            <Input
              type="search"
              placeholder="搜索..."
              className="w-64 rounded-lg bg-tech-blue-800 pl-8 text-tech-blue-100 placeholder-tech-blue-400"
            />
          </div>
        </form>
        <Button3D className="relative" onClick={() => setShowNotifications(true)}>
          <Bell className="h-5 w-5" />
          {state.notifications > 0 && (
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500"></span>
          )}
          <span className="sr-only">通知</span>
        </Button3D>
        <Button3D onClick={() => setShowSettings(true)}>
          <Settings className="h-5 w-5" />
          <span className="sr-only">设置</span>
        </Button3D>
        <Button3D onClick={() => setShowProfile(true)}>
          <User className="h-5 w-5" />
          <span className="sr-only">个人中心</span>
        </Button3D>
      </div>
      <Notifications isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </header>
  )
}

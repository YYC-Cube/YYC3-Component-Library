"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Bell, Menu, Search, User } from "lucide-react"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@yyc3/ui/dropdown-menu"
import { appConfig } from "@/src/config/app"

interface HeaderProps {
  onMenuClick: () => void
}

// 顶部导航栏组件
export function Header({ onMenuClick }: HeaderProps) {
  const reduceMotion = useReducedMotion()
  const headerInitial = reduceMotion ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }
  const headerTransition = { duration: reduceMotion ? 0 : 0.3 }

  return (
    <motion.header
      initial={headerInitial}
      animate={{ y: 0, opacity: 1 }}
      transition={headerTransition}
      className="flex h-16 items-center justify-between border-b border-border bg-card px-6"
    >
      {/* 左侧:菜单按钮和搜索 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="搜索功能、订单、商品..." className="w-64 pl-9 lg:w-96" />
        </div>
      </div>

      {/* 右侧:通知和用户菜单 */}
      <div className="flex items-center gap-3">
        {/* 通知按钮 */}
        <motion.div whileHover={reduceMotion ? {} : { scale: 1.05 }} whileTap={reduceMotion ? {} : { scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
            </span>
          </Button>
        </motion.div>

        {/* 用户菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={reduceMotion ? {} : { scale: 1.05 }} whileTap={reduceMotion ? {} : { scale: 0.95 }}>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="text-sm font-medium">{appConfig.companyName}</p>
                <p className="text-xs text-muted-foreground">{appConfig.companyPhone}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>个人设置</DropdownMenuItem>
            <DropdownMenuItem>修改密码</DropdownMenuItem>
            <DropdownMenuItem>帮助中心</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">退出登录</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}

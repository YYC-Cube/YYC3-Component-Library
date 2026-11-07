"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, ChevronRight, LogOut, UserPlus, Home } from "lucide-react"
import { useAuthStore } from "@/src/store/authStore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@yyc3/ui-enterprise/dropdown-menu"
import AppLogo from "@/components/app-logo"

interface AppHeaderProps {
  activeNav?: string
  showNav?: boolean
  showAccount?: boolean
}

export default function AppHeader({ activeNav, showNav = true, showAccount = true }: AppHeaderProps) {
  const router = useRouter()
  const [username, setUsername] = useState("admin")
  
  // 使用认证store
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    // 检查登录状态，如果未登录则重定向到登录页
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    
    // 如果有用户信息，更新用户名
    if (user?.username) {
      setUsername(user.username)
    }
  }, [isAuthenticated, user, router])

  const handleLogout = () => {
    // 使用认证store进行登出
    logout()
  }

  return (
    <header className="bg-gray-800 text-white py-2 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="mr-3 text-gray-300 hover:text-white" aria-label="返回首页">
        <Home className="h-4 w-4" />
        </Link>
        <Link href="/dashboard" className="flex items-center group">
          <div className="mr-2">
            <AppLogo size="sm" />
          </div>
          <div>
            <div className="text-sm font-bold">启智娱乐管理系统</div>
            <div className="text-xs text-gray-300">技术支持方：YanYu (HeNan) AI Technology Co., Ltd.</div>
          </div>
        </Link>
      </div>

      {showNav && null}

      {showAccount && (
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center bg-gray-700 rounded-full px-3 py-1.5 hover:bg-gray-600 transition-colors cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                <span className="text-xs font-medium">{username}</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-sm font-medium">YY</div>
              <div className="px-2 py-1 text-xs text-muted-foreground">{username}</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <UserPlus className="mr-2 h-4 w-4" />
                <span>切换账号</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  )
}

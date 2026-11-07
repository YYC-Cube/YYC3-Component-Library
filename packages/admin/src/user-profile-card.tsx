"use client"

import { User, LogOut, UserPlus, Bell, Settings, Home, BarChart3, Shield, Clock, ChevronRight, Moon, Sun, Info, Lock, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@yyc3/ui-enterprise/dropdown-menu"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Alert } from "@yyc3/ui-enterprise/alert"
import { useAuthStore } from "@/src/store/authStore"
import { useState, useEffect } from "react"
import { toast } from "@yyc3/ui-enterprise/use-toast"
import { userService } from "@/src/services/userService"

interface UserProfileCardProps {
  username?: string
  accountNumber?: string
  version: string
  lastLogin?: string
  // 新增：紧凑变体
  variant?: "default" | "compact"
}

// 角色配置映射，为深色模式提供不同的颜色
const roleConfig = {
  admin: {
    name: '系统管理员',
    color: { light: 'bg-purple-100 text-purple-800', dark: 'bg-purple-900/50 text-purple-300' },
    icon: '🔧'
  },
  manager: {
    name: '经理',
    color: { light: 'bg-blue-100 text-blue-800', dark: 'bg-blue-900/50 text-blue-300' },
    icon: '📊'
  },
  cashier: {
    name: '收银员',
    color: { light: 'bg-green-100 text-green-800', dark: 'bg-green-900/50 text-green-300' },
    icon: '💰'
  },
  waiter: {
    name: '服务员',
    color: { light: 'bg-yellow-100 text-yellow-800', dark: 'bg-yellow-900/50 text-yellow-300' },
    icon: '🍽️'
  }
}

export default function UserProfileCard({
  username: propUsername,
  accountNumber: propAccountNumber,
  version,
  lastLogin: propLastLogin,
  variant = "default",
}: UserProfileCardProps) {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [smartGreeting, setSmartGreeting] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginTime, setLoginTime] = useState<Date>(new Date())
  // 是否紧凑
  const isCompact = variant === "compact"
  
  // 使用认证store
  const { user, logout } = useAuthStore()
  
  // 优先使用props中的用户名和账号，如果没有则使用store中的
  const displayUsername = propUsername || user?.username || "未登录"
  const displayAccountNumber = propAccountNumber || user?.accountNumber || "N/A"
  const userRole = user?.role || 'waiter'
  const roleInfo = roleConfig[userRole]
  const actualLastLogin = propLastLogin || user?.lastLogin || new Date().toISOString()
  const formattedLastLogin = userService.formatLastLogin(actualLastLogin)
  
  // 智能问候语逻辑 - 包含星期和日期信息
  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekday = weekdays[now.getDay()]
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`
    
    let greeting = ''
    
    if (hour >= 5 && hour < 12) {
      greeting = `早上好，今天是${weekday} ${dateStr}`
    } else if (hour >= 12 && hour < 14) {
      greeting = `中午好，今天是${weekday} ${dateStr}`
    } else if (hour >= 14 && hour < 18) {
      greeting = `下午好，今天是${weekday} ${dateStr}`
    } else {
      greeting = `晚上好，今天是${weekday} ${dateStr}`
    }
    
    setSmartGreeting(greeting)
    
    // 登录时长更新定时器
    const interval = setInterval(() => {
      setLoginTime(new Date())
    }, 60000) // 每分钟更新一次
    
    return () => clearInterval(interval)
  }, [])
  
  // 检测系统主题和当前主题设置
  useEffect(() => {
    // 检查localStorage中的主题偏好
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    const isSystemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // 确定当前主题
    const currentTheme = storedTheme || (isSystemDark ? 'dark' : 'light')
    const shouldBeDark = currentTheme === 'dark'
    
    setIsDarkMode(shouldBeDark)
    
    // 应用主题到document
    if (typeof window !== 'undefined') {
      if (shouldBeDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    
    // 监听系统主题变化
    const mediaQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在没有明确主题设置时才响应系统变化
      if (!storedTheme) {
        setIsDarkMode(e.matches)
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
    
    if (mediaQuery) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // 使用认证store进行登出
      await logout()
      toast({ 
          title: '已安全退出', 
          description: '期待您的下次登录',
          variant: 'default'
        })
      // 登出后重定向到登录页
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    } catch (error) {
      toast({ 
        title: '退出失败', 
        description: '请稍后重试',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    // 应用主题
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    toast({ 
      title: newDarkMode ? '已切换为深色模式' : '已切换为浅色模式',
      variant: 'default'
    })
  }
  
  const navigateTo = (path: string) => {
    router.push(path)
  }
  
  // 计算登录时长
  const calculateSessionDuration = () => {
    const now = new Date()
    const diffMs = now.getTime() - loginTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) {
      return `${diffMins}分钟`
    } else {
      const hours = Math.floor(diffMins / 60)
      const mins = diffMins % 60
      return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
    }
  }

  return (
    <Card 
      className={`${isCompact ? 'p-3' : 'p-6'} flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-100'}`}
    >
      <div className="relative">
        {/* 渐变头像背景，根据角色变化颜色 */}
        <div className={`${isCompact ? 'w-14 h-14 mb-3' : 'w-24 h-24 mb-4'} rounded-full flex items-center justify-center shadow-lg ${userRole === 'admin' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 
                                                                                              userRole === 'manager' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                                                                                              userRole === 'cashier' ? 'bg-gradient-to-br from-green-500 to-teal-600' :
                                                                                              'bg-gradient-to-br from-yellow-500 to-amber-600'}`}>
          <span className={`${isCompact ? 'text-2xl' : 'text-3xl'} text-white font-bold`}>{displayUsername.charAt(0)}</span>
        </div>
        {/* 在线状态指示器 */}
        <div className={`absolute -bottom-1 -right-1 bg-green-500 ${isCompact ? 'w-4 h-4' : 'w-6 h-6'} rounded-full flex items-center justify-center border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'} animate-pulse`}>
          <span className={`${isCompact ? 'text-[10px]' : 'text-xs'} text-white`}>在线</span>
        </div>
      </div>

      {/* 用户名和角色信息 */}
      <div className={`${isCompact ? 'text-sm mb-1' : 'text-xl mb-2'} font-medium flex items-center flex-wrap justify-center`}>
        {displayUsername}
        <Badge className={`ml-2 ${isCompact ? 'scale-90' : ''} ${roleInfo.color[isDarkMode ? 'dark' : 'light']}`} variant="secondary">
          {roleInfo.icon} {roleInfo.name}
        </Badge>
      </div>

      {/* 账号信息 */}
      <div className={`${isCompact ? 'mb-1 text-xs' : 'mb-2'} flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <User className={`h-4 w-4 mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        <span>{displayAccountNumber}</span>
      </div>

      {/* 版本信息 */}
      <div className={`${isCompact ? 'text-[11px] mb-2' : 'text-sm mb-4'} px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
        {version}
      </div>

      {/* 智能问候语 */}
      {!isCompact && (
        <div className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} font-medium mb-3`}>
          {smartGreeting}，欢迎登录「YY·智云」商家桌面版
        </div>
      )}

      {/* 登录信息 */}
      {!isCompact && (
        <div className="w-full mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center">
              <Clock className={`h-3.5 w-3.5 mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>上次登录: {formattedLastLogin}</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-3.5 w-3.5 mr-1 text-green-500" />
              <span className="text-green-500">安全登录</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <Clock className={`h-3.5 w-3.5 mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>本次登录时长: {calculateSessionDuration()}</span>
            </div>
            <div className="flex items-center">
              <Lock className="h-3.5 w-3.5 mr-1 text-blue-500" />
              <span className="text-blue-500">已加密</span>
            </div>
          </div>
        </div>
      )}

      {/* 安全提示 */}
      {!isCompact && (
        <Alert 
          className={`w-full mb-4 text-xs ${isDarkMode ? 'bg-blue-900/30 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-700'}`}
        >
          <Info className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span>请勿在公共设备上记住密码，确保账号安全</span>
        </Alert>
      )}

      {/* 智能快捷操作区域 - 根据角色显示不同的快捷操作 */}
      {!isCompact && (
        <div className={`w-full grid grid-cols-2 gap-2 mb-4 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`justify-start h-8 px-2 transition-colors ${isDarkMode ? 'hover:bg-gray-600/70' : 'hover:bg-gray-200'}`} 
            onClick={() => navigateTo('/dashboard')}
          >
            <Home className="h-4 w-4 mr-2" />
            仪表盘
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`justify-start h-8 px-2 transition-colors ${isDarkMode ? 'hover:bg-gray-600/70' : 'hover:bg-gray-200'}`} 
            onClick={() => navigateTo('/reports')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            数据报表
          </Button>
          {['admin', 'manager'].includes(userRole) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className={`justify-start h-8 px-2 transition-colors ${isDarkMode ? 'hover:bg-gray-600/70' : 'hover:bg-gray-200'}`} 
              onClick={() => navigateTo('/employees')}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              员工管理
            </Button>
          )}
          {['admin', 'manager', 'cashier'].includes(userRole) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className={`justify-start h-8 px-2 transition-colors ${isDarkMode ? 'hover:bg-gray-600/70' : 'hover:bg-gray-200'}`} 
              onClick={() => navigateTo('/sales')}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              销售管理
            </Button>
          )}
        </div>
      )}

      {/* 底部操作按钮 */}
      <div className="w-full flex space-x-2">
        {isCompact ? (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} 
              onClick={toggleTheme}
              aria-label={isDarkMode ? '浅色模式' : '深色模式'}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="default" 
                  size="icon" 
                  className={`${isDarkMode ? 'hover:shadow-md' : 'hover:shadow-lg'}`}
                  aria-label="账号管理"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className={`w-44 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <DropdownMenuItem 
                  className={`cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}`} 
                  onClick={() => navigateTo('/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>个人设置</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}`}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>切换账号</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}`} 
                  onClick={() => navigateTo('/notifications')}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  <span>消息通知</span>
                  <Badge className="ml-auto bg-red-500">3</Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : ''} />
                <DropdownMenuItem 
                  className={`cursor-pointer text-red-500 focus:text-red-500 transition-colors ${isDarkMode ? 'hover:bg-gray-700/80 focus:bg-gray-700/80' : ''}`} 
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoading ? '退出中...' : '退出登录'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex-1 transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} 
              onClick={toggleTheme}
            >
              {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              {isDarkMode ? '浅色模式' : '深色模式'}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm" 
                  className={`flex-1 transition-all ${isDarkMode ? 'hover:shadow-md' : 'hover:shadow-lg'}`}
                >
                  <User className="mr-2 h-4 w-4" />
                  账号管理
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className={`w-48 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <DropdownMenuItem 
                  className={`cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}`} 
                  onClick={() => navigateTo('/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>个人设置</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}`}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>切换账号</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}`} 
                  onClick={() => navigateTo('/notifications')}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  <span>消息通知</span>
                  <Badge className="ml-auto bg-red-500">3</Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : ''} />
                <DropdownMenuItem 
                  className={`cursor-pointer text-red-500 focus:text-red-500 transition-colors ${isDarkMode ? 'hover:bg-gray-700/80 focus:bg-gray-700/80' : ''}`} 
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoading ? '退出中...' : '退出登录'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </Card>
  )
}

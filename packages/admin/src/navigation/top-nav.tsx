"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  HelpCircle,
  MessageSquare,
  Home,
  Palette,
} from "lucide-react"
import { Button } from "@yyc3/ui-enterprise/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@yyc3/ui-enterprise/dropdown-menu"
import { Input } from "@yyc3/ui-enterprise/input"
import { cn } from "@yyc3/lib/utils"
import { useBackground } from "@/contexts/background-context"
import AppLogo from "@/components/app-logo"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@yyc3/ui-enterprise/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@yyc3/ui-enterprise/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@yyc3/ui-enterprise/popover"

interface TopNavProps {
  className?: string
}

export default function TopNav({ className }: TopNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { background, setBackground } = useBackground()
  const [username, setUsername] = useState("admin")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "新订单",
      message: "您有一个新的订单需要处理",
      time: "5分钟前",
      read: false,
    },
    {
      id: 2,
      title: "库存预警",
      message: "3种商品库存不足，请及时补货",
      time: "30分钟前",
      read: false,
    },
    {
      id: 3,
      title: "系统更新",
      message: "系统将于今晚22:00进行维护更新",
      time: "2小时前",
      read: true,
    },
  ])

  useEffect(() => {
    // Get user info from localStorage
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUsername(user.username)
      } catch (e) {
        console.error("Failed to parse user data")
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const navItems = [
    { label: "首页", href: "/dashboard", icon: Home },
    { label: "销售", href: "/sales", icon: null },
    { label: "商品", href: "/products", icon: null },
    { label: "仓库", href: "/warehouse", icon: null },
    { label: "报表", href: "/reports", icon: null },
    { label: "员工", href: "/employees", icon: null },
    { label: "设置", href: "/settings/v6", icon: null },
    { label: "账单", href: "/bills", icon: null },
  ]

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    if (path !== "/dashboard" && pathname?.startsWith(path)) {
      return true
    }
    return false
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <div className="container flex h-full items-center justify-between">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-2">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex items-center mb-6">
                <AppLogo size="sm" className="mr-2" />
                <div>
                  <div className="font-bold">言语·云管理</div>
                  <div className="text-xs text-muted-foreground">数据中心</div>
                </div>
              </div>
              <nav className="flex flex-col gap-1">
                {navItems.map((item, index) => (
                  <SheetClose asChild key={index}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-2">
            <AppLogo size="sm" />
            <div className="hidden md:block">
              <div className="font-bold text-sm">言语·云管理</div>
              <div className="text-xs text-muted-foreground">数据中心</div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm rounded-md transition-colors",
                isActive(item.href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Search className="h-5 w-5" />
                <span className="sr-only">搜索</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end">
              <div className="flex items-center border-b p-2">
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  placeholder="搜索..."
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
              </div>
              <div className="p-2 text-xs text-muted-foreground">最近搜索: 销售报表, 库存管理, 员工考勤</div>
            </PopoverContent>
          </Popover>

          {/* Notifications */}
          <Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                          {unreadCount}
                        </span>
                      )}
                      <span className="sr-only">通知</span>
                    </Button>
                  </PopoverTrigger>
                  <TooltipContent side="bottom">通知</TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-[320px] p-0" align="end">
              <div className="flex items-center justify-between border-b p-3">
                <h4 className="font-medium">通知</h4>
                <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                  全部标为已读
                </Button>
              </div>
              <div className="max-h-[300px] overflow-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "flex gap-3 p-3 hover:bg-accent transition-colors cursor-pointer",
                          !notification.read && "bg-primary/5",
                        )}
                        onClick={() => {
                          setNotifications((prev) =>
                            prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
                          )
                        }}
                      >
                        <div
                          className={cn("mt-1 h-2 w-2 rounded-full", notification.read ? "bg-muted" : "bg-primary")}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="font-medium">{notification.title}</h5>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <Bell className="h-10 w-10 text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground">没有通知</p>
                  </div>
                )}
              </div>
              <div className="border-t p-2">
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  查看全部通知
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Background Switcher */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <Palette className="h-5 w-5" />
                      <span className="sr-only">更换背景</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setBackground("cityscape")}
                      className={background === "cityscape" ? "bg-primary/10 text-primary" : ""}
                    >
                      城市天际线
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setBackground("tech-globe")}
                      className={background === "tech-globe" ? "bg-primary/10 text-primary" : ""}
                    >
                      科技球体
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setBackground("digital-earth")}
                      className={background === "digital-earth" ? "bg-primary/10 text-primary" : ""}
                    >
                      数字地球
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="bottom">更换背景</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Help */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">帮助</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">帮助</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="hidden md:inline-flex">{username}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">{username}</p>
                  <p className="text-xs text-muted-foreground">管理员</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>个人资料</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>账号设置</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>消息中心</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

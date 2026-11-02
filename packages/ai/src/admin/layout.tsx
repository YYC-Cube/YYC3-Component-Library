import type React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server-client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, Users, Settings, FileText, Zap, Database, LogOut, Menu } from "lucide-react"

// 检查用户是否为管理员
async function checkAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // 检查用户是否有管理员角色
  // 这里假设用户元数据中有role字段
  if (user.user_metadata?.role !== "admin") {
    redirect("/") // 非管理员重定向到首页
  }

  return user
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await checkAdmin()

  // 获取用户名首字母或邮箱首字母
  const getUserInitials = () => {
    const email = user.email || ""
    return email.charAt(0).toUpperCase()
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* 侧边栏 - 桌面版 */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex h-14 items-center border-b px-4 py-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold">YY-Nexus 管理后台</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-4 space-y-1">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                仪表盘
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                用户管理
              </Button>
            </Link>
            <Link href="/admin/content">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                内容管理
              </Button>
            </Link>
            <Link href="/admin/workflows">
              <Button variant="ghost" className="w-full justify-start">
                <Zap className="mr-2 h-4 w-4" />
                工作流管理
              </Button>
            </Link>
            <Link href="/admin/data">
              <Button variant="ghost" className="w-full justify-start">
                <Database className="mr-2 h-4 w-4" />
                数据管理
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                系统设置
              </Button>
            </Link>
          </div>
        </nav>
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt="用户头像" />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.user_metadata?.name || user?.email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">管理员</p>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <Button variant="outline" className="w-full" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </Button>
          </form>
        </div>
      </aside>

      {/* 主内容区域 */}
      <div className="flex flex-col md:pl-64 flex-1">
        {/* 顶部导航栏 - 移动版 */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-white dark:bg-gray-800 px-4 md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  仪表盘
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  用户管理
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/content">
                  <FileText className="mr-2 h-4 w-4" />
                  内容管理
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/workflows">
                  <Zap className="mr-2 h-4 w-4" />
                  工作流管理
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/data">
                  <Database className="mr-2 h-4 w-4" />
                  数据管理
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  系统设置
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action="/auth/signout" method="post" className="w-full">
                  <button type="submit" className="flex w-full items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex-1">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <span className="text-lg font-bold">YY-Nexus 管理后台</span>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt="用户头像" />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.user_metadata?.name || user?.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  系统设置
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action="/auth/signout" method="post" className="w-full">
                  <button type="submit" className="flex w-full items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* 主内容 */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, UserPlus } from "lucide-react"
import { createClient } from "@/lib/supabase/server-client"

// 获取用户列表
async function getUsers() {
  const supabase = await createClient()

  // 在实际应用中，您需要根据数据库结构进行查询
  const { data: users, error } = await supabase.auth.admin.listUsers()

  if (error) {
    console.error("获取用户列表失败:", error)
    return []
  }

  return users.users.map((user) => ({
    id: user.id,
    name: user.user_metadata?.name || "未设置",
    email: user.email,
    role: user.user_metadata?.role || "用户",
    status: user.banned ? "已禁用" : user.confirmed_at ? "活跃" : "未验证",
    lastActive: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "从未登录",
    createdAt: new Date(user.created_at).toLocaleString(),
  }))
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
          <p className="text-muted-foreground">管理系统用户、角色和权限</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/create">
            <UserPlus className="mr-2 h-4 w-4" />
            添加用户
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>系统中的所有用户账户</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="搜索用户..." className="pl-8 w-full md:w-[280px]" />
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                筛选
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>最近活动</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={user.name} />
                          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "活跃" ? "default" : user.status === "未验证" ? "secondary" : "outline"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">打开菜单</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/users/${user.id}`}>查看详情</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/users/${user.id}/edit`}>编辑用户</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>重置密码</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            {user.status === "已禁用" ? "启用账户" : "禁用账户"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

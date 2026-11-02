"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, Download, MoreHorizontal, Search, SlidersHorizontal, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// 模拟用户数据
const users = [
  {
    id: "u1",
    name: "张小明",
    email: "zhang@example.com",
    role: "管理员",
    department: "运营部",
    status: "活跃",
    lastActive: "2023-04-12 14:32",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "u2",
    name: "李华",
    email: "li@example.com",
    role: "内容编辑",
    department: "内容部",
    status: "活跃",
    lastActive: "2023-04-12 10:15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "u3",
    name: "王芳",
    email: "wang@example.com",
    role: "数据分析师",
    department: "数据部",
    status: "离线",
    lastActive: "2023-04-10 16:42",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "u4",
    name: "赵明",
    email: "zhao@example.com",
    role: "内容创作者",
    department: "内容部",
    status: "活跃",
    lastActive: "2023-04-12 13:05",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "u5",
    name: "刘洋",
    email: "liu@example.com",
    role: "访客",
    department: "市场部",
    status: "已禁用",
    lastActive: "2023-03-25 09:18",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function UserList() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false)

  const handleUserAction = (action: string, user: (typeof users)[0]) => {
    if (action === "view") {
      setSelectedUser(user)
      setIsUserDetailOpen(true)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="搜索用户..." className="pl-8 w-full md:w-[280px]" />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                筛选
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                导出
              </Button>
              <Button size="sm" className="flex items-center gap-1" onClick={() => setIsAddUserOpen(true)}>
                <UserPlus className="h-4 w-4" />
                添加用户
              </Button>
            </div>
          </div>

          {isFilterOpen && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md bg-gray-50">
              <div className="space-y-2">
                <Label htmlFor="role-filter">角色</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="role-filter">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部角色</SelectItem>
                    <SelectItem value="admin">管理员</SelectItem>
                    <SelectItem value="editor">内容编辑</SelectItem>
                    <SelectItem value="analyst">数据分析师</SelectItem>
                    <SelectItem value="creator">内容创作者</SelectItem>
                    <SelectItem value="guest">访客</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department-filter">部门</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="department-filter">
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部部门</SelectItem>
                    <SelectItem value="operations">运营部</SelectItem>
                    <SelectItem value="content">内容部</SelectItem>
                    <SelectItem value="data">数据部</SelectItem>
                    <SelectItem value="marketing">市场部</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status-filter">状态</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="active">活跃</SelectItem>
                    <SelectItem value="offline">离线</SelectItem>
                    <SelectItem value="disabled">已禁用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button className="flex-1">应用筛选</Button>
                <Button variant="outline">重置</Button>
              </div>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>用户</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>部门</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>最近活动</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "活跃" ? "default" : user.status === "离线" ? "secondary" : "outline"}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">打开菜单</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUserAction("view", user)}>查看详情</DropdownMenuItem>
                          <DropdownMenuItem>编辑用户</DropdownMenuItem>
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

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">显示 1-5 条，共 5 条</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                上一页
              </Button>
              <Button variant="outline" size="sm" disabled>
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 添加用户对话框 */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>添加新用户</DialogTitle>
            <DialogDescription>创建新用户账户并分配角色和权限</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input id="name" placeholder="请输入姓名" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input id="email" type="email" placeholder="请输入邮箱" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">角色</Label>
                <Select>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">管理员</SelectItem>
                    <SelectItem value="editor">内容编辑</SelectItem>
                    <SelectItem value="analyst">数据分析师</SelectItem>
                    <SelectItem value="creator">内容创作者</SelectItem>
                    <SelectItem value="guest">访客</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">部门</Label>
                <Select>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operations">运营部</SelectItem>
                    <SelectItem value="content">内容部</SelectItem>
                    <SelectItem value="data">数据部</SelectItem>
                    <SelectItem value="marketing">市场部</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">初始密码</Label>
              <Input id="password" type="password" placeholder="请输入初始密码" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="send-email" />
              <Label htmlFor="send-email">发送邀请邮件</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsAddUserOpen(false)}>创建用户</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 用户详情对话框 */}
      <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>用户详情</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">角色</p>
                  <p className="font-medium">{selectedUser.role}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">部门</p>
                  <p className="font-medium">{selectedUser.department}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">状态</p>
                  <Badge
                    variant={
                      selectedUser.status === "活跃"
                        ? "default"
                        : selectedUser.status === "离线"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {selectedUser.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">最近活动</p>
                  <p className="font-medium">{selectedUser.lastActive}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">访问权限</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="content-access" checked />
                    <Label htmlFor="content-access">内容创作</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="data-access" checked />
                    <Label htmlFor="data-access">数据分析</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="automation-access" checked={selectedUser.role === "管理员"} />
                    <Label htmlFor="automation-access">自动化任务</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="learning-access" checked />
                    <Label htmlFor="learning-access">学习课程</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">登录历史</h4>
                <div className="text-sm space-y-1">
                  <p>最近登录: 2023-04-12 14:32 (IP: 192.168.1.1)</p>
                  <p>上次登录: 2023-04-11 09:15 (IP: 192.168.1.1)</p>
                  <p>登录设备: Chrome / Windows</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDetailOpen(false)}>
              关闭
            </Button>
            <Button>编辑用户</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/**
 * @file 管理员页面组件
 * @description 提供用户管理、部门管理和系统配置等管理员功能
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@yyc3/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Switch } from "@yyc3/ui/switch"
import { Label } from "@yyc3/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@yyc3/ui/avatar"
import { Badge } from "@yyc3/ui/badge"
import { Separator } from "@yyc3/ui/separator"
import { ScrollArea } from "@yyc3/ui/scroll-area"
import { Search } from "lucide-react"

// 类型定义
interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive'
  createdAt: string
  avatar?: string
}

interface Department {
  id: string
  name: string
  head: string
  members: number
  status: 'active' | 'inactive'
}

interface SystemConfig {
  name: string
  description: string
  value: string | boolean | number
  type: 'string' | 'boolean' | 'number' | 'select'
  options?: string[]
}

// 模拟数据
const mockUsers: User[] = [
  {
    id: "1",
    name: "张三",
    email: "zhangsan@example.com",
    role: "管理员",
    department: "技术部",
    status: "active",
    createdAt: "2024-01-15",
    avatar: "https://ui-avatars.com/api/?name=ZS&background=4a6cf7&color=fff"
  },
  {
    id: "2",
    name: "李四",
    email: "lisi@example.com",
    role: "导师",
    department: "市场部",
    status: "active",
    createdAt: "2024-02-20",
    avatar: "https://ui-avatars.com/api/?name=LS&background=4a6cf7&color=fff"
  },
  {
    id: "3",
    name: "王五",
    email: "wangwu@example.com",
    role: "学员",
    department: "技术部",
    status: "inactive",
    createdAt: "2024-03-10",
    avatar: "https://ui-avatars.com/api/?name=WW&background=4a6cf7&color=fff"
  },
  {
    id: "4",
    name: "赵六",
    email: "zhaoliu@example.com",
    role: "导师",
    department: "财务部",
    status: "active",
    createdAt: "2024-04-05",
    avatar: "https://ui-avatars.com/api/?name=ZL&background=4a6cf7&color=fff"
  },
  {
    id: "5",
    name: "钱七",
    email: "qianqi@example.com",
    role: "学员",
    department: "人力资源部",
    status: "active",
    createdAt: "2024-05-12",
    avatar: "https://ui-avatars.com/api/?name=QQ&background=4a6cf7&color=fff"
  }
]

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "技术部",
    head: "张三",
    members: 15,
    status: "active"
  },
  {
    id: "2",
    name: "市场部",
    head: "李四",
    members: 8,
    status: "active"
  },
  {
    id: "3",
    name: "财务部",
    head: "赵六",
    members: 5,
    status: "active"
  },
  {
    id: "4",
    name: "人力资源部",
    head: "孙八",
    members: 3,
    status: "active"
  },
  {
    id: "5",
    name: "销售部",
    head: "周九",
    members: 12,
    status: "inactive"
  }
]

const mockSystemConfigs: SystemConfig[] = [
  {
    name: "maxFileSize",
    description: "最大文件上传大小 (MB)",
    value: 10,
    type: "number"
  },
  {
    name: "enableNotification",
    description: "启用系统通知",
    value: true,
    type: "boolean"
  },
  {
    name: "sessionTimeout",
    description: "会话超时时间 (分钟)",
    value: 30,
    type: "number"
  },
  {
    name: "defaultLanguage",
    description: "默认系统语言",
    value: "zh-CN",
    type: "select",
    options: ["zh-CN", "en-US"]
  },
  {
    name: "registrationMode",
    description: "注册模式",
    value: "invitation",
    type: "select",
    options: ["open", "invitation", "closed"]
  }
]

export function AdminPage() {
  // 状态管理
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [systemConfigs, setSystemConfigs] = useState<SystemConfig[]>(mockSystemConfigs)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isAddDepartmentDialogOpen, setIsAddDepartmentDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "学员",
    department: "技术部"
  })
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    head: ""
  })
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null)

  // 搜索用户
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  // 添加新用户
  const handleAddUser = () => {
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      status: "active",
      createdAt: new Date().toISOString().split('T')[0],
      avatar: `https://ui-avatars.com/api/?name=${newUser.name.substring(0, 2)}&background=4a6cf7&color=fff`
    }
    setUsers([...users, user])
    setIsAddUserDialogOpen(false)
    setNewUser({
      name: "",
      email: "",
      role: "学员",
      department: "技术部"
    })
  }

  // 添加新部门
  const handleAddDepartment = () => {
    const department: Department = {
      id: Date.now().toString(),
      ...newDepartment,
      members: 0,
      status: "active"
    }
    setDepartments([...departments, department])
    setIsAddDepartmentDialogOpen(false)
    setNewDepartment({
      name: "",
      head: ""
    })
  }

  // 更新用户状态
  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ))
  }

  // 更新部门状态
  const handleToggleDepartmentStatus = (deptId: string) => {
    setDepartments(departments.map(dept => 
      dept.id === deptId 
        ? { ...dept, status: dept.status === "active" ? "inactive" : "active" }
        : dept
    ))
  }

  // 更新系统配置
  const handleConfigChange = (config: SystemConfig, value: any) => {
    setSystemConfigs(systemConfigs.map(item => 
      item.name === config.name ? { ...item, value } : item
    ))
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">管理员中心</h1>
        <Button variant="ghost">系统日志</Button>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="users">用户管理</TabsTrigger>
          <TabsTrigger value="departments">部门管理</TabsTrigger>
          <TabsTrigger value="system">系统配置</TabsTrigger>
        </TabsList>

        {/* 用户管理 */}
        <TabsContent value="users" className="mt-6 space-y-6 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <CardTitle>用户管理</CardTitle>
              <CardDescription>管理系统中的所有用户账户</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索用户..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>添加用户</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>添加新用户</DialogTitle>
                      <DialogDescription>填写以下信息添加新用户</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">用户名</Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          placeholder="请输入用户名"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">电子邮箱</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="请输入电子邮箱"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">角色</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                        >
                          <SelectTrigger id="role">
                            <SelectValue placeholder="选择角色" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="管理员">管理员</SelectItem>
                            <SelectItem value="导师">导师</SelectItem>
                            <SelectItem value="学员">学员</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">部门</Label>
                        <Select
                          value={newUser.department}
                          onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                        >
                          <SelectTrigger id="department">
                            <SelectValue placeholder="选择部门" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setIsAddUserDialogOpen(false)}>取消</Button>
                      <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>
                        添加
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-2 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">用户信息</div>
                  <div className="col-span-2 hidden md:block">角色</div>
                  <div className="col-span-2 hidden md:block">部门</div>
                  <div className="col-span-2 hidden sm:block">创建时间</div>
                  <div className="col-span-1 sm:col-span-1">状态</div>
                  <div className="col-span-2 text-right">操作</div>
                </div>
                <ScrollArea className="max-h-[500px]">
                  {filteredUsers.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-muted-foreground">未找到匹配的用户</p>
                    </div>
                  ) : (
                    filteredUsers.map(user => (
                      <div key={user.id} className="grid grid-cols-12 gap-2 p-3 border-t items-center">
                        <div className="col-span-3 flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</p>
                          </div>
                        </div>
                        <div className="col-span-2 hidden md:block">
                          <Badge variant={user.role === "管理员" ? "destructive" : user.role === "导师" ? "secondary" : "outline"}>
                            {user.role}
                          </Badge>
                        </div>
                        <div className="col-span-2 hidden md:block text-sm">{user.department}</div>
                        <div className="col-span-2 hidden sm:block text-sm text-muted-foreground">{user.createdAt}</div>
                        <div className="col-span-1 sm:col-span-1">
                          <Switch
                            checked={user.status === "active"}
                            onCheckedChange={() => handleToggleUserStatus(user.id)}
                          />
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Search className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 部门管理 */}
        <TabsContent value="departments" className="mt-6 space-y-6 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <CardTitle>部门管理</CardTitle>
              <CardDescription>管理系统中的所有部门</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-6">
                <Dialog open={isAddDepartmentDialogOpen} onOpenChange={setIsAddDepartmentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>添加部门</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>添加新部门</DialogTitle>
                      <DialogDescription>填写以下信息添加新部门</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="deptName">部门名称</Label>
                        <Input
                          id="deptName"
                          value={newDepartment.name}
                          onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                          placeholder="请输入部门名称"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deptHead">部门负责人</Label>
                        <Input
                          id="deptHead"
                          value={newDepartment.head}
                          onChange={(e) => setNewDepartment({ ...newDepartment, head: e.target.value })}
                          placeholder="请输入部门负责人姓名"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setIsAddDepartmentDialogOpen(false)}>取消</Button>
                      <Button onClick={handleAddDepartment} disabled={!newDepartment.name}>
                        添加
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-2 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-4">部门名称</div>
                  <div className="col-span-3 hidden md:block">部门负责人</div>
                  <div className="col-span-2 hidden sm:block">成员数量</div>
                  <div className="col-span-1 sm:col-span-1">状态</div>
                  <div className="col-span-2 text-right">操作</div>
                </div>
                <div>
                  {departments.map(dept => (
                    <div key={dept.id} className="grid grid-cols-12 gap-2 p-3 border-t items-center">
                      <div className="col-span-4 font-medium">{dept.name}</div>
                      <div className="col-span-3 hidden md:block text-sm">{dept.head}</div>
                      <div className="col-span-2 hidden sm:block text-sm">
                        <Badge variant="outline">{dept.members} 人</Badge>
                      </div>
                      <div className="col-span-1 sm:col-span-1">
                        <Switch
                          checked={dept.status === "active"}
                          onCheckedChange={() => handleToggleDepartmentStatus(dept.id)}
                        />
                      </div>
                      <div className="col-span-2 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 系统配置 */}
        <TabsContent value="system" className="mt-6 space-y-6 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <CardTitle>系统配置</CardTitle>
              <CardDescription>配置系统的各项参数和功能</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {systemConfigs.map(config => (
                  <div key={config.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={config.name}>{config.description}</Label>
                      {config.type === "boolean" ? (
                        <Switch
                          id={config.name}
                          checked={config.value as boolean}
                          onCheckedChange={(checked) => handleConfigChange(config, checked)}
                        />
                      ) : config.type === "select" ? (
                        <Select
                          value={config.value as string}
                          onValueChange={(value) => handleConfigChange(config, value)}
                        >
                          <SelectTrigger id={config.name} className="w-[180px]">
                            <SelectValue placeholder="选择选项" />
                          </SelectTrigger>
                          <SelectContent>
                            {(config.options || []).map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={config.name}
                          type={config.type}
                          value={config.value as string}
                          onChange={(e) => {
                            const value = config.type === "number" ? Number(e.target.value) : e.target.value
                            handleConfigChange(config, value)
                          }}
                          className="w-[180px]"
                        />
                      )}
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="ghost">恢复默认设置</Button>
              <Button>保存更改</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
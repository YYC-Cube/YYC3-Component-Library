"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Label } from "@yyc3/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Checkbox } from "@yyc3/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@yyc3/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui/table"
import { Badge } from "@yyc3/ui/badge"
import { ResourceType, ActionType, type Permission } from "@yyc3/lib/auth/permission-types"
import { PermissionGate } from "@/components/auth/permission-gate"
import { Plus, Edit, Trash2, Search, Filter, UserPlus, Shield, Settings, Users } from "lucide-react"

// 角色类型
interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  userCount: number
}

// 示例角色数据
const exampleRoles: Role[] = [
  {
    id: "role-1",
    name: "管理员",
    description: "拥有系统所有权限",
    permissions: [
      { resource: ResourceType.DASHBOARD, action: ActionType.VIEW },
      { resource: ResourceType.DASHBOARD, action: ActionType.CREATE },
      { resource: ResourceType.DASHBOARD, action: ActionType.UPDATE },
      { resource: ResourceType.DASHBOARD, action: ActionType.DELETE },
      { resource: ResourceType.SALES, action: ActionType.VIEW },
      { resource: ResourceType.SALES, action: ActionType.CREATE },
      { resource: ResourceType.SALES, action: ActionType.UPDATE },
      { resource: ResourceType.SALES, action: ActionType.DELETE },
      // ... 其他权限
    ],
    userCount: 3,
  },
  {
    id: "role-2",
    name: "销售经理",
    description: "管理销售和客户数据",
    permissions: [
      { resource: ResourceType.DASHBOARD, action: ActionType.VIEW },
      { resource: ResourceType.SALES, action: ActionType.VIEW },
      { resource: ResourceType.SALES, action: ActionType.CREATE },
      { resource: ResourceType.SALES, action: ActionType.UPDATE },
      { resource: ResourceType.CUSTOMERS, action: ActionType.VIEW },
      { resource: ResourceType.CUSTOMERS, action: ActionType.CREATE },
      { resource: ResourceType.CUSTOMERS, action: ActionType.UPDATE },
      { resource: ResourceType.REPORTS, action: ActionType.VIEW },
      { resource: ResourceType.REPORTS, action: ActionType.EXPORT },
    ],
    userCount: 5,
  },
  {
    id: "role-3",
    name: "库存管理员",
    description: "管理产品和库存",
    permissions: [
      { resource: ResourceType.DASHBOARD, action: ActionType.VIEW },
      { resource: ResourceType.PRODUCTS, action: ActionType.VIEW },
      { resource: ResourceType.PRODUCTS, action: ActionType.CREATE },
      { resource: ResourceType.PRODUCTS, action: ActionType.UPDATE },
      { resource: ResourceType.INVENTORY, action: ActionType.VIEW },
      { resource: ResourceType.INVENTORY, action: ActionType.UPDATE },
      { resource: ResourceType.REPORTS, action: ActionType.VIEW },
    ],
    userCount: 4,
  },
  {
    id: "role-4",
    name: "查看者",
    description: "只能查看数据，无法修改",
    permissions: [
      { resource: ResourceType.DASHBOARD, action: ActionType.VIEW },
      { resource: ResourceType.SALES, action: ActionType.VIEW },
      { resource: ResourceType.PRODUCTS, action: ActionType.VIEW },
      { resource: ResourceType.INVENTORY, action: ActionType.VIEW },
      { resource: ResourceType.CUSTOMERS, action: ActionType.VIEW },
      { resource: ResourceType.REPORTS, action: ActionType.VIEW },
      { resource: ResourceType.REPORTS, action: ActionType.EXPORT },
    ],
    userCount: 10,
  },
]

// 资源名称映射
const resourceNames: Record<ResourceType, string> = {
  [ResourceType.DASHBOARD]: "仪表盘",
  [ResourceType.SALES]: "销售",
  [ResourceType.PRODUCTS]: "产品",
  [ResourceType.INVENTORY]: "库存",
  [ResourceType.CUSTOMERS]: "客户",
  [ResourceType.REPORTS]: "报表",
  [ResourceType.SETTINGS]: "设置",
  [ResourceType.USERS]: "用户",
}

// 操作名称映射
const actionNames: Record<ActionType, string> = {
  [ActionType.VIEW]: "查看",
  [ActionType.CREATE]: "创建",
  [ActionType.UPDATE]: "更新",
  [ActionType.DELETE]: "删除",
  [ActionType.EXPORT]: "导出",
  [ActionType.IMPORT]: "导入",
  [ActionType.APPROVE]: "审批",
  [ActionType.ASSIGN]: "分配",
  [ActionType.SHARE]: "分享",
}

export function RoleManager() {
  const [roles, setRoles] = useState<Role[]>(exampleRoles)
  const [activeTab, setActiveTab] = useState("roles")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [newRole, setNewRole] = useState<Omit<Role, "id" | "userCount">>({
    name: "",
    description: "",
    permissions: [],
  })

  // 过滤角色
  const filteredRoles = roles.filter((role) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return role.name.toLowerCase().includes(query) || role.description.toLowerCase().includes(query)
  })

  // 创建角色
  const handleCreateRole = () => {
    if (!newRole.name) return

    const role: Role = {
      id: `role-${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0,
    }

    setRoles([...roles, role])
    setNewRole({
      name: "",
      description: "",
      permissions: [],
    })
    setIsCreateDialogOpen(false)
  }

  // 更新角色
  const handleUpdateRole = () => {
    if (!selectedRole) return

    setRoles(roles.map((role) => (role.id === selectedRole.id ? selectedRole : role)))
    setSelectedRole(null)
    setIsEditDialogOpen(false)
  }

  // 删除角色
  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((role) => role.id !== roleId))
  }

  // 切换权限
  const togglePermission = (resource: ResourceType, action: ActionType, isEdit = false) => {
    const target = isEdit ? selectedRole : newRole
    if (!target) return

    const permissions = [...target.permissions]
    const index = permissions.findIndex((p) => p.resource === resource && p.action === action)

    if (index >= 0) {
      permissions.splice(index, 1)
    } else {
      permissions.push({ resource, action })
    }

    if (isEdit && selectedRole) {
      setSelectedRole({ ...selectedRole, permissions })
    } else {
      setNewRole({ ...newRole, permissions })
    }
  }

  // 检查是否有权限
  const hasPermissionCheck = (resource: ResourceType, action: ActionType, isEdit = false) => {
    const target = isEdit ? selectedRole : newRole
    if (!target) return false

    return target.permissions.some((p) => p.resource === resource && p.action === action)
  }

  return (
    <PermissionGate resource={ResourceType.USERS} action={ActionType.VIEW}>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>角色与权限管理</CardTitle>
            <PermissionGate resource={ResourceType.USERS} action={ActionType.CREATE}>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    创建角色
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>创建新角色</DialogTitle>
                    <DialogDescription>添加新角色并设置权限</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role-name">角色名称</Label>
                        <Input
                          id="role-name"
                          value={newRole.name}
                          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                          placeholder="输入角色名称"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role-description">角色描述</Label>
                        <Input
                          id="role-description"
                          value={newRole.description}
                          onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                          placeholder="输入角色描述"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>权限设置</Label>
                      <div className="border rounded-md p-4 space-y-4">
                        {Object.values(ResourceType).map((resource) => (
                          <div key={resource} className="space-y-2">
                            <h4 className="font-medium">{resourceNames[resource]}</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {Object.values(ActionType).map((action) => (
                                <div key={`${resource}-${action}`} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${resource}-${action}`}
                                    checked={hasPermissionCheck(resource, action)}
                                    onCheckedChange={() => togglePermission(resource, action)}
                                  />
                                  <Label htmlFor={`${resource}-${action}`} className="text-sm">
                                    {actionNames[action]}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={handleCreateRole}>创建角色</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </PermissionGate>
          </div>
          <CardDescription>管理系统角色和权限</CardDescription>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索角色..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="roles">
                <Shield className="mr-2 h-4 w-4" />
                角色管理
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="mr-2 h-4 w-4" />
                用户分配
              </TabsTrigger>
            </TabsList>

            <TabsContent value="roles" className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>角色名称</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>用户数量</TableHead>
                    <TableHead>权限</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        没有找到角色
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>{role.userCount}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.length > 5 ? (
                              <>
                                <Badge variant="outline">{role.permissions.length} 项权限</Badge>
                              </>
                            ) : (
                              role.permissions.slice(0, 5).map((permission, index) => (
                                <Badge key={index} variant="outline">
                                  {resourceNames[permission.resource]}-{actionNames[permission.action]}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <PermissionGate resource={ResourceType.USERS} action={ActionType.UPDATE}>
                              <Dialog
                                open={isEditDialogOpen && selectedRole?.id === role.id}
                                onOpenChange={(open) => {
                                  setIsEditDialogOpen(open)
                                  if (open) setSelectedRole(role)
                                  else setSelectedRole(null)
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>编辑角色</DialogTitle>
                                    <DialogDescription>修改角色信息和权限</DialogDescription>
                                  </DialogHeader>
                                  {selectedRole && (
                                    <div className="space-y-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-role-name">角色名称</Label>
                                          <Input
                                            id="edit-role-name"
                                            value={selectedRole.name}
                                            onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-role-description">角色描述</Label>
                                          <Input
                                            id="edit-role-description"
                                            value={selectedRole.description}
                                            onChange={(e) =>
                                              setSelectedRole({ ...selectedRole, description: e.target.value })
                                            }
                                          />
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label>权限设置</Label>
                                        <div className="border rounded-md p-4 space-y-4">
                                          {Object.values(ResourceType).map((resource) => (
                                            <div key={resource} className="space-y-2">
                                              <h4 className="font-medium">{resourceNames[resource]}</h4>
                                              <div className="grid grid-cols-3 gap-2">
                                                {Object.values(ActionType).map((action) => (
                                                  <div
                                                    key={`${resource}-${action}`}
                                                    className="flex items-center space-x-2"
                                                  >
                                                    <Checkbox
                                                      id={`edit-${resource}-${action}`}
                                                      checked={hasPermissionCheck(resource, action, true)}
                                                      onCheckedChange={() => togglePermission(resource, action, true)}
                                                    />
                                                    <Label htmlFor={`edit-${resource}-${action}`} className="text-sm">
                                                      {actionNames[action]}
                                                    </Label>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                      取消
                                    </Button>
                                    <Button onClick={handleUpdateRole}>保存更改</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </PermissionGate>
                            <PermissionGate resource={ResourceType.USERS} action={ActionType.DELETE}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteRole(role.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PermissionGate>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="users" className="pt-4">
              <div className="flex justify-end mb-4">
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  分配用户角色
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户名</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>当前角色</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">张三</TableCell>
                    <TableCell>zhangsan@example.com</TableCell>
                    <TableCell>
                      <Badge>管理员</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        修改角色
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">李四</TableCell>
                    <TableCell>lisi@example.com</TableCell>
                    <TableCell>
                      <Badge>销售经理</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        修改角色
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">王五</TableCell>
                    <TableCell>wangwu@example.com</TableCell>
                    <TableCell>
                      <Badge>库存管理员</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        修改角色
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">共 {filteredRoles.length} 个角色</div>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            高级设置
          </Button>
        </CardFooter>
      </Card>
    </PermissionGate>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Plus, Search, Users } from "lucide-react"

// 模拟角色数据
const roles = [
  {
    id: "r1",
    name: "管理员",
    description: "拥有系统所有功能的完全访问权限",
    users: 2,
    permissions: 28,
    isSystem: true,
  },
  {
    id: "r2",
    name: "内容编辑",
    description: "可以创建、编辑和发布内容",
    users: 5,
    permissions: 18,
    isSystem: true,
  },
  {
    id: "r3",
    name: "数据分析师",
    description: "可以访问和分析数据，但不能修改系统设置",
    users: 3,
    permissions: 12,
    isSystem: true,
  },
  {
    id: "r4",
    name: "内容创作者",
    description: "仅可以创建内容，不能发布",
    users: 8,
    permissions: 10,
    isSystem: false,
  },
  {
    id: "r5",
    name: "访客",
    description: "只读权限，不能修改任何内容",
    users: 15,
    permissions: 5,
    isSystem: true,
  },
]

export function RoleManagement() {
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<(typeof roles)[0] | null>(null)

  const handleRoleAction = (action: string, role: (typeof roles)[0]) => {
    if (action === "edit") {
      setSelectedRole(role)
      setIsEditRoleOpen(true)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="搜索角色..." className="pl-8 w-full md:w-[280px]" />
            </div>
            <Button size="sm" className="flex items-center gap-1" onClick={() => setIsAddRoleOpen(true)}>
              <Plus className="h-4 w-4" />
              添加角色
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>角色名称</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead>用户数</TableHead>
                  <TableHead>权限数</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        {role.users}
                      </div>
                    </TableCell>
                    <TableCell>{role.permissions}</TableCell>
                    <TableCell>
                      <Badge variant={role.isSystem ? "secondary" : "default"}>
                        {role.isSystem ? "系统" : "自定义"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">打开菜单</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRoleAction("edit", role)}>编辑角色</DropdownMenuItem>
                          <DropdownMenuItem>查看用户</DropdownMenuItem>
                          <DropdownMenuItem>复制角色</DropdownMenuItem>
                          {!role.isSystem && <DropdownMenuItem className="text-red-600">删除角色</DropdownMenuItem>}
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

      {/* 添加角色对话框 */}
      <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>添加新角色</DialogTitle>
            <DialogDescription>创建新角色并分配权限</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">角色名称</Label>
              <Input id="role-name" placeholder="请输入角色名称" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">角色描述</Label>
              <Textarea id="role-description" placeholder="请输入角色描述" className="min-h-[80px]" />
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">权限设置</h4>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="content-module" />
                    <Label htmlFor="content-module" className="font-medium">
                      内容创作模块
                    </Label>
                  </div>
                  <div className="ml-6 grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="content-create" />
                      <Label htmlFor="content-create">创建内容</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="content-edit" />
                      <Label htmlFor="content-edit">编辑内容</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="content-publish" />
                      <Label htmlFor="content-publish">发布内容</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="content-delete" />
                      <Label htmlFor="content-delete">删除内容</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="data-module" />
                    <Label htmlFor="data-module" className="font-medium">
                      数据分析模块
                    </Label>
                  </div>
                  <div className="ml-6 grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="data-view" />
                      <Label htmlFor="data-view">查看数据</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="data-export" />
                      <Label htmlFor="data-export">导出数据</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="data-analyze" />
                      <Label htmlFor="data-analyze">分析数据</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="data-share" />
                      <Label htmlFor="data-share">分享报告</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="automation-module" />
                    <Label htmlFor="automation-module" className="font-medium">
                      自动化模块
                    </Label>
                  </div>
                  <div className="ml-6 grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="automation-create" />
                      <Label htmlFor="automation-create">创建工作流</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="automation-edit" />
                      <Label htmlFor="automation-edit">编辑工作流</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="automation-execute" />
                      <Label htmlFor="automation-execute">执行工作流</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="automation-delete" />
                      <Label htmlFor="automation-delete">删除工作流</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="learning-module" />
                    <Label htmlFor="learning-module" className="font-medium">
                      学习模块
                    </Label>
                  </div>
                  <div className="ml-6 grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="learning-access" />
                      <Label htmlFor="learning-access">访问课程</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="learning-create" />
                      <Label htmlFor="learning-create">创建课程</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="learning-comment" />
                      <Label htmlFor="learning-comment">评论课程</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="learning-manage" />
                      <Label htmlFor="learning-manage">管理课程</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsAddRoleOpen(false)}>创建角色</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑角色对话框 */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>编辑角色</DialogTitle>
            <DialogDescription>修改角色信息和权限设置</DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role-name">角色名称</Label>
                <Input id="edit-role-name" defaultValue={selectedRole.name} disabled={selectedRole.isSystem} />
                {selectedRole.isSystem && <p className="text-xs text-gray-500">系统角色名称不可修改</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role-description">角色描述</Label>
                <Textarea id="edit-role-description" defaultValue={selectedRole.description} className="min-h-[80px]" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">权限设置</h4>
                  <Badge variant="outline" className="ml-2">
                    当前权限: {selectedRole.permissions}
                  </Badge>
                </div>

                {/* 这里重复添加角色对话框中的权限设置部分，但设置默认选中状态 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="edit-content-module" defaultChecked />
                      <Label htmlFor="edit-content-module" className="font-medium">
                        内容创作模块
                      </Label>
                    </div>
                    <div className="ml-6 grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="edit-content-create" defaultChecked />
                        <Label htmlFor="edit-content-create">创建内容</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="edit-content-edit" defaultChecked />
                        <Label htmlFor="edit-content-edit">编辑内容</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit-content-publish"
                          defaultChecked={selectedRole.name !== "内容创作者" && selectedRole.name !== "访客"}
                        />
                        <Label htmlFor="edit-content-publish">发布内容</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit-content-delete"
                          defaultChecked={selectedRole.name === "管理员" || selectedRole.name === "内容编辑"}
                        />
                        <Label htmlFor="edit-content-delete">删除内容</Label>
                      </div>
                    </div>
                  </div>

                  {/* 其他模块权限设置，根据角色预设默认值 */}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsEditRoleOpen(false)}>保存更改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

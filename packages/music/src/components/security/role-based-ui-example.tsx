"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, Settings, BarChart, Radio } from "lucide-react"
import PermissionGuard from "./permission-guard"
import { type User, Role, Permission } from "@/lib/auth/permissions"

// 模拟当前用户
const mockUsers: Record<Role, User> = {
  [Role.GUEST]: {
    id: "guest",
    name: "访客",
    email: "guest@example.com",
    role: Role.GUEST,
  },
  [Role.USER]: {
    id: "user1",
    name: "普通用户",
    email: "user@example.com",
    role: Role.USER,
  },
  [Role.CREATOR]: {
    id: "creator1",
    name: "创作者",
    email: "creator@example.com",
    role: Role.CREATOR,
  },
  [Role.MODERATOR]: {
    id: "mod1",
    name: "版主",
    email: "moderator@example.com",
    role: Role.MODERATOR,
  },
  [Role.ADMIN]: {
    id: "admin1",
    name: "管理员",
    email: "admin@example.com",
    role: Role.ADMIN,
  },
}

export default function RoleBasedUIExample() {
  const [currentRole, setCurrentRole] = useState<Role>(Role.USER)
  const currentUser = mockUsers[currentRole]

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center">
          <Shield className="w-6 h-6 text-blue-400 mr-2" />
          基于角色的UI示例
        </h2>

        <div className="flex items-center space-x-2">
          <span className="text-sm">当前角色:</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as Role)}
            className="bg-blue-900/30 rounded px-2 py-1"
          >
            {Object.values(Role).map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-blue-900/30 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">用户信息</h3>
        <p>
          <span className="text-white/70">名称:</span> {currentUser.name}
        </p>
        <p>
          <span className="text-white/70">邮箱:</span> {currentUser.email}
        </p>
        <p>
          <span className="text-white/70">角色:</span> {currentUser.role}
        </p>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="content">内容</TabsTrigger>
          <TabsTrigger value="broadcast">广播</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
          <TabsTrigger value="admin">管理</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="p-4 bg-deep-space-blue/30 rounded-lg mt-2">
          <h3 className="font-semibold mb-4">内容管理</h3>

          <div className="space-y-4">
            <PermissionGuard
              user={currentUser}
              permission={Permission.CREATE_CONTENT}
              fallback={<div className="bg-yellow-500/20 p-4 rounded-lg">您需要至少是普通用户才能创建内容</div>}
            >
              <Button>创建新内容</Button>
            </PermissionGuard>

            <PermissionGuard
              user={currentUser}
              permission={Permission.CREATE_PREMIUM_CONTENT}
              fallback={<div className="bg-blue-500/20 p-4 rounded-lg">只有创作者及以上角色才能创建高级内容</div>}
            >
              <Button variant="outline">创建高级内容</Button>
            </PermissionGuard>

            <PermissionGuard
              user={currentUser}
              permission={Permission.EDIT_ANY_CONTENT}
              fallback={<div className="bg-purple-500/20 p-4 rounded-lg">只有版主及以上角色才能编辑任何内容</div>}
            >
              <Button variant="outline">批量编辑内容</Button>
            </PermissionGuard>
          </div>
        </TabsContent>

        <TabsContent value="broadcast" className="p-4 bg-deep-space-blue/30 rounded-lg mt-2">
          <h3 className="font-semibold mb-4">广播系统</h3>

          <PermissionGuard
            user={currentUser}
            permission={Permission.BROADCAST_CITY}
            fallback={<div className="bg-yellow-500/20 p-4 rounded-lg">只有创作者及以上角色才能使用城市广播功能</div>}
          >
            <div className="space-y-4">
              <p>选择广播范围:</p>
              <div className="flex space-x-2">
                <Button className="flex items-center">
                  <Radio className="w-4 h-4 mr-2" />
                  区域广播
                </Button>
                <Button className="flex items-center">
                  <Radio className="w-4 h-4 mr-2" />
                  城市广播
                </Button>
              </div>
            </div>
          </PermissionGuard>
        </TabsContent>

        <TabsContent value="analytics" className="p-4 bg-deep-space-blue/30 rounded-lg mt-2">
          <h3 className="font-semibold mb-4">数据分析</h3>

          <PermissionGuard
            user={currentUser}
            permission={Permission.ACCESS_ANALYTICS}
            fallback={<div className="bg-yellow-500/20 p-4 rounded-lg">只有版主及以上角色才能访问数据分析</div>}
          >
            <div className="space-y-4">
              <div className="flex items-center">
                <BarChart className="w-6 h-6 text-blue-400 mr-2" />
                <span>用户增长趋势</span>
              </div>
              <div className="h-40 bg-blue-900/30 rounded-lg flex items-center justify-center">数据图表区域</div>
            </div>
          </PermissionGuard>
        </TabsContent>

        <TabsContent value="admin" className="p-4 bg-deep-space-blue/30 rounded-lg mt-2">
          <h3 className="font-semibold mb-4">系统管理</h3>

          <PermissionGuard
            user={currentUser}
            permissions={[Permission.MANAGE_USERS, Permission.MANAGE_SETTINGS]}
            requireAll={false}
            fallback={<div className="bg-yellow-500/20 p-4 rounded-lg">只有管理员才能访问系统管理功能</div>}
          >
            <div className="space-y-4">
              <Button className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                用户管理
              </Button>
              <Button className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                系统设置
              </Button>
            </div>
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </div>
  )
}

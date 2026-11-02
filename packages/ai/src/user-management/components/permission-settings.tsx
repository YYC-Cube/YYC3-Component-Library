"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Check, FileText, Lock, Save, Settings, ShieldAlert } from "lucide-react"

export function PermissionSettings() {
  const [selectedRole, setSelectedRole] = useState("admin")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>权限配置</CardTitle>
              <CardDescription>管理系统功能的访问权限和操作限制</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="role-select" className="whitespace-nowrap">
                选择角色:
              </Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role-select" className="w-[180px]">
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <span className="text-sm text-amber-600">修改权限设置将影响所有使用该角色的用户</span>
          </div>

          <Accordion type="multiple" defaultValue={["content", "data", "automation", "learning", "system"]}>
            <AccordionItem value="content">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span>内容创作模块</span>
                  {selectedRole === "admin" && (
                    <Badge variant="default" className="ml-2">
                      完全权限
                    </Badge>
                  )}
                  {selectedRole === "guest" && (
                    <Badge variant="outline" className="ml-2">
                      只读权限
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PermissionItem
                      title="查看内容"
                      description="浏览平台上的内容"
                      defaultEnabled={true}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="创建内容"
                      description="创建新的内容"
                      defaultEnabled={selectedRole !== "guest"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="编辑内容"
                      description="修改现有内容"
                      defaultEnabled={selectedRole !== "guest"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="发布内容"
                      description="将内容发布到平台"
                      defaultEnabled={selectedRole === "admin" || selectedRole === "editor"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="删除内容"
                      description="删除现有内容"
                      defaultEnabled={selectedRole === "admin" || selectedRole === "editor"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="批量操作"
                      description="批量处理内容"
                      defaultEnabled={selectedRole === "admin" || selectedRole === "editor"}
                      isReadOnly={selectedRole === "admin"}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5 text-blue-500" />
                  <span>数据分析模块</span>
                  {selectedRole === "admin" && (
                    <Badge variant="default" className="ml-2">
                      完全权限
                    </Badge>
                  )}
                  {selectedRole === "analyst" && (
                    <Badge variant="secondary" className="ml-2">
                      专家权限
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PermissionItem
                      title="查看数据报表"
                      description="访问数据分析报表"
                      defaultEnabled={selectedRole !== "guest"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="导出数据"
                      description="将数据导出为文件"
                      defaultEnabled={selectedRole === "admin" || selectedRole === "analyst"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="创建自定义报表"
                      description="创建自定义数据分析报表"
                      defaultEnabled={selectedRole === "admin" || selectedRole === "analyst"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="设置数据预警"
                      description="配置数据异常预警规则"
                      defaultEnabled={selectedRole === "admin" || selectedRole === "analyst"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="访问原始数据"
                      description="查看未经处理的原始数据"
                      defaultEnabled={selectedRole === "admin" || selectedRole === "analyst"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="分享报表"
                      description="与其他用户分享报表"
                      defaultEnabled={selectedRole !== "guest"}
                      isReadOnly={selectedRole === "admin"}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="automation">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <ZapIcon className="h-5 w-5 text-blue-500" />
                  <span>自动化模块</span>
                  {selectedRole === "admin" && (
                    <Badge variant="default" className="ml-2">
                      完全权限
                    </Badge>
                  )}
                  {(selectedRole === "guest" || selectedRole === "creator") && (
                    <Badge variant="outline" className="ml-2">
                      受限权限
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PermissionItem
                      title="查看工作流"
                      description="浏览现有自动化工作流"
                      defaultEnabled={selectedRole !== "guest"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="创建工作流"
                      description="创建新的自动化工作流"
                      defaultEnabled={selectedRole === "admin" || selectedRole === "editor"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="编辑工作流"
                      description="修改现有自动化工作流"
                      defaultEnabled={selectedRole === "admin" || selectedRole === "editor"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="执行工作流"
                      description="手动触发自动化工作流"
                      defaultEnabled={selectedRole !== "guest"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="删除工作流"
                      description="删除现有自动化工作流"
                      defaultEnabled={selectedRole === "admin"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="设置定时任务"
                      description="配置自动化工作流的定时执行"
                      defaultEnabled={selectedRole === "admin" || selectedRole === "editor"}
                      isReadOnly={selectedRole === "admin"}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="learning">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <GraduationCapIcon className="h-5 w-5 text-blue-500" />
                  <span>学习课程模块</span>
                  {selectedRole === "admin" && (
                    <Badge variant="default" className="ml-2">
                      完全权限
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PermissionItem
                      title="访问课程"
                      description="浏览和学习课程内容"
                      defaultEnabled={true}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="创建课程"
                      description="创建新的学习课程"
                      defaultEnabled={selectedRole === "admin" || selectedRole === "editor"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="编辑课程"
                      description="修改现有课程内容"
                      defaultEnabled={selectedRole === "admin" || selectedRole === "editor"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="发布课程"
                      description="将课程发布到平台"
                      defaultEnabled={selectedRole === "admin" || selectedRole === "editor"}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="评论课程"
                      description="对课程发表评论"
                      defaultEnabled={true}
                      isReadOnly={selectedRole === "admin"}
                    />
                    <PermissionItem
                      title="删除课程"
                      description="删除现有课程"
                      defaultEnabled={selectedRole === "admin"}
                      isReadOnly={selectedRole === "admin"}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="system">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  <span>系统管理</span>
                  {selectedRole === "admin" && (
                    <Badge variant="default" className="ml-2">
                      完全权限
                    </Badge>
                  )}
                  {selectedRole !== "admin" && (
                    <Badge variant="destructive" className="ml-2">
                      无权限
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PermissionItem
                      title="用户管理"
                      description="管理用户账户"
                      defaultEnabled={selectedRole === "admin"}
                      isReadOnly={true}
                    />
                    <PermissionItem
                      title="角色管理"
                      description="管理角色和权限"
                      defaultEnabled={selectedRole === "admin"}
                      isReadOnly={true}
                    />
                    <PermissionItem
                      title="系统设置"
                      description="配置系统参数"
                      defaultEnabled={selectedRole === "admin"}
                      isReadOnly={true}
                    />
                    <PermissionItem
                      title="日志查看"
                      description="查看系统日志"
                      defaultEnabled={selectedRole === "admin"}
                      isReadOnly={true}
                    />
                    <PermissionItem
                      title="备份恢复"
                      description="系统数据备份与恢复"
                      defaultEnabled={selectedRole === "admin"}
                      isReadOnly={true}
                    />
                    <PermissionItem
                      title="API管理"
                      description="管理API密钥和访问"
                      defaultEnabled={selectedRole === "admin"}
                      isReadOnly={true}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end mt-6">
            <Button className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              保存权限设置
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>权限概览</CardTitle>
          <CardDescription>当前角色的权限分布情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium">内容创作</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedRole === "admin" && "6/6 权限"}
                    {selectedRole === "editor" && "5/6 权限"}
                    {selectedRole === "analyst" && "3/6 权限"}
                    {selectedRole === "creator" && "3/6 权限"}
                    {selectedRole === "guest" && "1/6 权限"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                    <BarChartIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium">数据分析</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedRole === "admin" && "6/6 权限"}
                    {selectedRole === "editor" && "3/6 权限"}
                    {selectedRole === "analyst" && "6/6 权限"}
                    {selectedRole === "creator" && "2/6 权限"}
                    {selectedRole === "guest" && "0/6 权限"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                    <ZapIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium">自动化</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedRole === "admin" && "6/6 权限"}
                    {selectedRole === "editor" && "5/6 权限"}
                    {selectedRole === "analyst" && "2/6 权限"}
                    {selectedRole === "creator" && "2/6 权限"}
                    {selectedRole === "guest" && "1/6 权限"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                    <GraduationCapIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium">学习课程</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedRole === "admin" && "6/6 权限"}
                    {selectedRole === "editor" && "4/6 权限"}
                    {selectedRole === "analyst" && "2/6 权限"}
                    {selectedRole === "creator" && "2/6 权限"}
                    {selectedRole === "guest" && "2/6 权限"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedRole !== "admin" && (
            <div className="flex items-center gap-2 mt-6 p-3 border rounded-md bg-amber-50 text-amber-800">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">注意：系统管理模块仅对管理员角色开放，其他角色无法访问系统管理功能。</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface PermissionItemProps {
  title: string
  description: string
  defaultEnabled: boolean
  isReadOnly?: boolean
}

function PermissionItem({ title, description, defaultEnabled, isReadOnly = false }: PermissionItemProps) {
  const [enabled, setEnabled] = useState(defaultEnabled)

  return (
    <div className="flex items-start justify-between space-x-4 rounded-md border p-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{title}</p>
          {isReadOnly && <Lock className="h-3 w-3 text-gray-400" />}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {enabled && <Check className="h-4 w-4 text-green-500" />}
        <Switch checked={enabled} onCheckedChange={setEnabled} disabled={isReadOnly} />
      </div>
    </div>
  )
}

function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}

function ZapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function GraduationCapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  )
}

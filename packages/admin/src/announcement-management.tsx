/**
 * @file 公告管理组件
 * @description 提供公告的创建、编辑、删除和状态管理功能
 * @author YYC³
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Textarea } from "@yyc3/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@yyc3/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Label } from "@yyc3/ui/label"
import { Badge } from "@yyc3/ui/badge"
import { ScrollArea } from "@yyc3/ui/scroll-area"
import { Search, Calendar, Clock, Send, Eye, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react"
import { format } from "date-fns"

// 类型定义
interface Announcement {
  id: string
  title: string
  content: string
  type: 'system' | 'department' | 'personal'
  targetDepartments: string[]
  status: 'draft' | 'published' | 'expired'
  author: string
  createdAt: string
  publishedAt: string | null
  expiredAt: string | null
  views: number
  priority: 'normal' | 'important' | 'urgent'
}

// 模拟数据
const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "系统升级通知",
    content: "尊敬的用户，我们将于本周六凌晨2:00-4:00进行系统升级维护，期间系统将暂时无法使用。感谢您的理解与支持！",
    type: "system",
    targetDepartments: ["all"],
    status: "published",
    author: "系统管理员",
    createdAt: "2024-10-10T09:00:00Z",
    publishedAt: "2024-10-10T09:30:00Z",
    expiredAt: "2024-10-15T00:00:00Z",
    views: 156,
    priority: "important"
  },
  {
    id: "2",
    title: "技术部周会安排",
    content: "本周技术部周会将于周三下午3点在会议室A举行，请各位准时参加。会议将讨论新项目启动事宜。",
    type: "department",
    targetDepartments: ["技术部"],
    status: "published",
    author: "技术主管",
    createdAt: "2024-10-09T14:00:00Z",
    publishedAt: "2024-10-09T14:05:00Z",
    expiredAt: "2024-10-11T18:00:00Z",
    views: 45,
    priority: "normal"
  },
  {
    id: "3",
    title: "年度考核通知",
    content: "年度考核将于下月开始，请各位准备好相关材料。具体考核标准和流程已上传至共享文件夹。",
    type: "system",
    targetDepartments: ["all"],
    status: "draft",
    author: "人力资源部",
    createdAt: "2024-10-11T10:00:00Z",
    publishedAt: null,
    expiredAt: "2024-12-31T23:59:59Z",
    views: 0,
    priority: "normal"
  },
  {
    id: "4",
    title: "市场活动策划会议",
    content: "下周一上午10点召开市场活动策划会议，请市场部全体成员参加。",
    type: "department",
    targetDepartments: ["市场部"],
    status: "published",
    author: "市场经理",
    createdAt: "2024-10-08T16:30:00Z",
    publishedAt: "2024-10-08T16:30:00Z",
    expiredAt: "2024-10-15T12:00:00Z",
    views: 23,
    priority: "normal"
  },
  {
    id: "5",
    title: "紧急安全漏洞修复",
    content: "我们发现系统存在安全漏洞，已紧急修复。请所有用户立即修改密码，确保账户安全。",
    type: "system",
    targetDepartments: ["all"],
    status: "published",
    author: "安全团队",
    createdAt: "2024-10-07T20:00:00Z",
    publishedAt: "2024-10-07T20:00:00Z",
    expiredAt: "2024-10-20T23:59:59Z",
    views: 203,
    priority: "urgent"
  }
]

const mockDepartments = ["技术部", "市场部", "财务部", "人力资源部", "销售部"]

// 辅助函数：获取状态标签
export function getStatusBadge(status: 'draft' | 'published' | 'expired') {
  switch (status) {
    case 'draft':
      return <Badge variant="outline">草稿</Badge>;
    case 'published':
      return <Badge className="bg-green-500 hover:bg-green-600">已发布</Badge>;
    case 'expired':
      return <Badge variant="secondary">已过期</Badge>;
    default:
      return null;
  }
}

// 辅助函数：获取优先级标签
export function getPriorityBadge(priority: 'normal' | 'important' | 'urgent') {
  switch (priority) {
    case 'normal':
      return <Badge variant="outline">普通</Badge>;
    case 'important':
      return <Badge className="bg-amber-500 hover:bg-amber-600">重要</Badge>;
    case 'urgent':
      return <Badge className="bg-red-500 hover:bg-red-600">紧急</Badge>;
    default:
      return null;
  }
}

// 辅助函数：获取类型标签
export function getTypeLabel(type: 'system' | 'department' | 'personal') {
  switch (type) {
    case 'system':
      return <Badge className="bg-blue-500 hover:bg-blue-600">系统公告</Badge>;
    case 'department':
      return <Badge className="bg-purple-500 hover:bg-purple-600">部门公告</Badge>;
    case 'personal':
      return <Badge variant="outline">个人通知</Badge>;
    default:
      return null;
  }
}

export function AnnouncementManagement() {
  // 状态管理
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement>({
    id: "",
    title: "",
    content: "",
    type: "system",
    targetDepartments: ["all"],
    status: "draft",
    author: "",
    createdAt: "",
    publishedAt: null,
    expiredAt: null,
    views: 0,
    priority: "normal"
  })
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  // 筛选公告
  useEffect(() => {
    // 根据标签筛选公告
    const filtered = announcements.filter(announcement => {
      const matchesTab = activeTab === "all" || announcement.status === activeTab
      const matchesSearch = !searchTerm || 
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesTab && matchesSearch
    })
    setFilteredAnnouncements(filtered)
  }, [announcements, activeTab, searchTerm])

  // 获取优先级标签样式
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">紧急</Badge>
      case "important":
        return <Badge variant="secondary">重要</Badge>
      default:
        return <Badge variant="outline">普通</Badge>
    }
  }

  // 获取状态标签样式
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="default">已发布</Badge>
      case "draft":
        return <Badge variant="outline">草稿</Badge>
      case "expired":
        return <Badge variant="destructive">已过期</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 获取公告类型标签
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "system":
        return <Badge variant="default">系统公告</Badge>
      case "department":
        return <Badge variant="secondary">部门公告</Badge>
      case "personal":
        return <Badge variant="outline">个人通知</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // 打开添加公告对话框
  const handleAddAnnouncement = () => {
    setCurrentAnnouncement({
      id: "",
      title: "",
      content: "",
      type: "system",
      targetDepartments: ["all"],
      status: "draft",
      author: "",
      createdAt: "",
      publishedAt: null,
      expiredAt: null,
      views: 0,
      priority: "normal"
    })
    setIsAddDialogOpen(true)
  }

  // 打开编辑公告对话框
  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setCurrentAnnouncement(announcement)
    setIsEditDialogOpen(true)
  }

  // 保存新建公告
  const handleSaveNewAnnouncement = () => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: currentAnnouncement.title || "",
      content: currentAnnouncement.content || "",
      type: currentAnnouncement.type || "system",
      targetDepartments: currentAnnouncement.targetDepartments || ["all"],
      status: "draft",
      author: "当前用户",
      createdAt: new Date().toISOString(),
      publishedAt: null,
      expiredAt: currentAnnouncement.expiredAt || null,
      views: 0,
      priority: currentAnnouncement.priority || "normal"
    }
    
    setAnnouncements([newAnnouncement, ...announcements])
    setIsAddDialogOpen(false)
  }

  // 更新公告
  const handleUpdateAnnouncement = () => {
    if (selectedAnnouncement) {
      setAnnouncements(announcements.map(ann => 
        ann.id === selectedAnnouncement.id 
          ? { ...ann, ...currentAnnouncement }
          : ann
      ))
      setIsEditDialogOpen(false)
    }
  }

  // 发布公告
  const handlePublishAnnouncement = (id: string) => {
    setAnnouncements(announcements.map(ann => 
      ann.id === id 
        ? { ...ann, status: "published", publishedAt: new Date().toISOString() }
        : ann
    ))
  }

  // 删除公告
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(ann => ann.id !== id))
  }

  // 格式化日期
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return format(new Date(dateString), "yyyy-MM-dd HH:mm")
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">公告管理</h1>
        <Button onClick={handleAddAnnouncement}>
          <Send className="mr-2 h-4 w-4" />
          发布新公告
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>公告列表</CardTitle>
          <CardDescription>管理所有系统公告、部门公告和个人通知</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索公告标题或内容..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="draft">草稿</TabsTrigger>
              <TabsTrigger value="published">已发布</TabsTrigger>
              <TabsTrigger value="expired">已过期</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0 animate-in fade-in-50">
              <ScrollArea className="max-h-[600px]">
                {filteredAnnouncements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">暂无公告</h3>
                    <p className="text-muted-foreground max-w-md">
                      {activeTab === "all" && searchTerm 
                        ? `没有找到包含"${searchTerm}"的公告` 
                        : `当前没有${activeTab === "all" ? "任何" : getStatusBadge(activeTab).props.children}公告`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAnnouncements.map(announcement => (
                      <Card key={announcement.id} className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-lg m-0">{announcement.title}</CardTitle>
                                {getPriorityBadge(announcement.priority)}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                {getTypeLabel(announcement.type)}
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(announcement.createdAt)}
                                </div>
                                {announcement.publishedAt && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    发布于 {formatDate(announcement.publishedAt)}
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3.5 w-3.5" />
                                  {announcement.views}
                                </div>
                                <span>作者: {announcement.author}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {getStatusBadge(announcement.status)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {announcement.content}
                          </div>
                          {announcement.targetDepartments.length > 0 && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              目标部门: 
                              {announcement.targetDepartments[0] === "all" 
                                ? "所有人" 
                                : announcement.targetDepartments.join(", ")
                              }
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-2 justify-between text-sm">
                          <div className="flex gap-2">
                            {announcement.status === "draft" && (
                              <Button 
                                size="sm" 
                                onClick={() => handlePublishAnnouncement(announcement.id)}
                              >
                                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                发布
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => handleEditAnnouncement(announcement)}
                            >
                              <Edit className="mr-1 h-3.5 w-3.5" />
                              编辑
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                            >
                              <Trash2 className="mr-1 h-3.5 w-3.5" />
                              删除
                            </Button>
                          </div>
                          {announcement.expiredAt && (
                            <div className="text-xs text-muted-foreground">
                              有效期至: {formatDate(announcement.expiredAt)}
                            </div>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 添加公告对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>发布新公告</DialogTitle>
            <DialogDescription>填写以下信息创建新公告</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">公告标题</Label>
              <Input
                id="title"
                value={currentAnnouncement.title}
                onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
                placeholder="请输入公告标题"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">公告内容</Label>
              <Textarea
                id="content"
                value={currentAnnouncement.content}
                onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, content: e.target.value })}
                placeholder="请输入公告内容"
                rows={6}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">公告类型</Label>
                <Select
                  value={currentAnnouncement.type}
                  onValueChange={(value) => setCurrentAnnouncement({ ...currentAnnouncement, type: value as any })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="选择公告类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">系统公告</SelectItem>
                    <SelectItem value="department">部门公告</SelectItem>
                    <SelectItem value="personal">个人通知</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">优先级</Label>
                <Select
                  value={currentAnnouncement.priority}
                  onValueChange={(value) => setCurrentAnnouncement({ ...currentAnnouncement, priority: value as any })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">普通</SelectItem>
                    <SelectItem value="important">重要</SelectItem>
                    <SelectItem value="urgent">紧急</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departments">目标部门</Label>
              <Select
                value={currentAnnouncement.targetDepartments?.[0] || "all"}
                onValueChange={(value) => setCurrentAnnouncement({ 
                  ...currentAnnouncement, 
                  targetDepartments: value === "all" ? ["all"] : [value] 
                })}
              >
                <SelectTrigger id="departments">
                  <SelectValue placeholder="选择目标部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有人</SelectItem>
                  {mockDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiredAt">有效期至</Label>
              <Input
                id="expiredAt"
                type="datetime-local"
                onChange={(e) => setCurrentAnnouncement({ 
                  ...currentAnnouncement, 
                  expiredAt: e.target.value ? new Date(e.target.value).toISOString() : null 
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveNewAnnouncement} disabled={!currentAnnouncement.title || !currentAnnouncement.content}>
              保存为草稿
            </Button>
            <Button 
              variant="default"
              onClick={() => {
                handleSaveNewAnnouncement()
                // 这里可以添加直接发布的逻辑
              }}
              disabled={!currentAnnouncement.title || !currentAnnouncement.content}
            >
              立即发布
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑公告对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>编辑公告</DialogTitle>
            <DialogDescription>修改公告内容和设置</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">公告标题</Label>
              <Input
                id="edit-title"
                value={currentAnnouncement.title}
                onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
                placeholder="请输入公告标题"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">公告内容</Label>
              <Textarea
                id="edit-content"
                value={currentAnnouncement.content}
                onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, content: e.target.value })}
                placeholder="请输入公告内容"
                rows={6}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">公告类型</Label>
                <Select
                  value={currentAnnouncement.type}
                  onValueChange={(value) => setCurrentAnnouncement({ ...currentAnnouncement, type: value as any })}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="选择公告类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">系统公告</SelectItem>
                    <SelectItem value="department">部门公告</SelectItem>
                    <SelectItem value="personal">个人通知</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-priority">优先级</Label>
                <Select
                  value={currentAnnouncement.priority}
                  onValueChange={(value) => setCurrentAnnouncement({ ...currentAnnouncement, priority: value as any })}
                >
                  <SelectTrigger id="edit-priority">
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">普通</SelectItem>
                    <SelectItem value="important">重要</SelectItem>
                    <SelectItem value="urgent">紧急</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-departments">目标部门</Label>
              <Select
                value={currentAnnouncement.targetDepartments?.[0] || "all"}
                onValueChange={(value) => setCurrentAnnouncement({ 
                  ...currentAnnouncement, 
                  targetDepartments: value === "all" ? ["all"] : [value] 
                })}
              >
                <SelectTrigger id="edit-departments">
                  <SelectValue placeholder="选择目标部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有人</SelectItem>
                  {mockDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-expiredAt">有效期至</Label>
              <Input
                id="edit-expiredAt"
                type="datetime-local"
                value={currentAnnouncement.expiredAt ? format(new Date(currentAnnouncement.expiredAt), "yyyy-MM-dd'T'HH:mm") : undefined}
                onChange={(e) => setCurrentAnnouncement({ 
                  ...currentAnnouncement, 
                  expiredAt: e.target.value ? new Date(e.target.value).toISOString() : null 
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleUpdateAnnouncement} disabled={!currentAnnouncement.title || !currentAnnouncement.content}>
              保存修改
            </Button>
            {selectedAnnouncement?.status === "draft" && (
              <Button 
                variant="default"
                onClick={() => {
                  handleUpdateAnnouncement()
                  handlePublishAnnouncement(selectedAnnouncement.id)
                  setIsEditDialogOpen(false)
                }}
                disabled={!currentAnnouncement.title || !currentAnnouncement.content}
              >
                保存并发布
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
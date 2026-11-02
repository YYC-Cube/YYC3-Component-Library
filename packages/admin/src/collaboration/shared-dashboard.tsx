"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Label } from "@yyc3/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Avatar, AvatarFallback } from "@yyc3/ui/avatar"
import { Badge } from "@yyc3/ui/badge"
import { Switch } from "@yyc3/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@yyc3/ui/dialog"
import { Share2, Users, Lock, Globe, Eye, Edit, Trash2, Copy, Clock, UserPlus, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@yyc3/ui/dropdown-menu"
import { cn } from "@yyc3/lib/utils"

// Example shared dashboards
const exampleDashboards = [
  {
    id: "dash-1",
    name: "销售分析仪表盘",
    description: "销售团队使用的销售数据分析仪表盘",
    owner: {
      id: "user-1",
      name: "张三",
      avatar: null,
    },
    visibility: "team",
    team: "销售团队",
    sharedWith: [
      { id: "user-2", name: "李四", avatar: null, role: "editor" },
      { id: "user-3", name: "王五", avatar: null, role: "viewer" },
    ],
    lastModified: "2025-03-15 14:30",
    views: 128,
    starred: true,
  },
  {
    id: "dash-2",
    name: "库存管理仪表盘",
    description: "用于监控和管理库存的仪表盘",
    owner: {
      id: "user-1",
      name: "张三",
      avatar: null,
    },
    visibility: "private",
    team: null,
    sharedWith: [],
    lastModified: "2025-03-14 09:15",
    views: 42,
    starred: false,
  },
  {
    id: "dash-3",
    name: "客户分析仪表盘",
    description: "客户数据分析和会员管理仪表盘",
    owner: {
      id: "user-2",
      name: "李四",
      avatar: null,
    },
    visibility: "public",
    team: null,
    sharedWith: [{ id: "user-1", name: "张三", avatar: null, role: "viewer" }],
    lastModified: "2025-03-13 16:45",
    views: 256,
    starred: true,
  },
]

// Example users
const exampleUsers = [
  { id: "user-1", name: "张三", avatar: null },
  { id: "user-2", name: "李四", avatar: null },
  { id: "user-3", name: "王五", avatar: null },
  { id: "user-4", name: "赵六", avatar: null },
  { id: "user-5", name: "钱七", avatar: null },
]

// Example teams
const exampleTeams = [
  { id: "team-1", name: "销售团队" },
  { id: "team-2", name: "市场团队" },
  { id: "team-3", name: "产品团队" },
  { id: "team-4", name: "技术团队" },
]

export function SharedDashboardManager() {
  const [dashboards, setDashboards] = useState(exampleDashboards)
  const [activeTab, setActiveTab] = useState("all")
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [selectedDashboard, setSelectedDashboard] = useState<(typeof exampleDashboards)[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDashboards = dashboards.filter((dashboard) => {
    // Filter by tab
    if (activeTab === "my" && dashboard.owner.id !== "user-1") return false
    if (activeTab === "shared" && dashboard.owner.id === "user-1") return false
    if (activeTab === "starred" && !dashboard.starred) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        dashboard.name.toLowerCase().includes(query) ||
        dashboard.description.toLowerCase().includes(query) ||
        dashboard.owner.name.toLowerCase().includes(query)
      )
    }

    return true
  })

  const toggleStar = (dashboardId: string) => {
    setDashboards(
      dashboards.map((dashboard) =>
        dashboard.id === dashboardId ? { ...dashboard, starred: !dashboard.starred } : dashboard,
      ),
    )
  }

  const openShareDialog = (dashboard: (typeof exampleDashboards)[0]) => {
    setSelectedDashboard(dashboard)
    setIsShareDialogOpen(true)
  }

  const handleShare = () => {
    if (!selectedDashboard) return

    // In a real app, this would update the sharing settings
    setIsShareDialogOpen(false)
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "private":
        return <Lock className="h-4 w-4" />
      case "team":
        return <Users className="h-4 w-4" />
      case "public":
        return <Globe className="h-4 w-4" />
      default:
        return <Lock className="h-4 w-4" />
    }
  }

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "private":
        return "私有"
      case "team":
        return "团队"
      case "public":
        return "公开"
      default:
        return visibility
    }
  }

  const getVisibilityDescription = (visibility: string, team?: string | null) => {
    switch (visibility) {
      case "private":
        return "仅您可以访问"
      case "team":
        return team ? `${team}的成员可以访问` : "团队成员可以访问"
      case "public":
        return "所有人可以访问"
      default:
        return ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>共享仪表盘</CardTitle>
          <Button>
            <Share2 className="mr-2 h-4 w-4" />
            创建共享仪表盘
          </Button>
        </div>
        <CardDescription>管理和共享您的仪表盘</CardDescription>
        <div className="mt-2">
          <Input placeholder="搜索仪表盘..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="my">我的</TabsTrigger>
            <TabsTrigger value="shared">共享的</TabsTrigger>
            <TabsTrigger value="starred">已收藏</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="pt-4">
            {filteredDashboards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">没有找到仪表盘</div>
            ) : (
              <div className="space-y-4">
                {filteredDashboards.map((dashboard) => (
                  <div key={dashboard.id} className="border rounded-md overflow-hidden">
                    <div className="flex items-start justify-between p-4">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium">{dashboard.name}</h3>
                          <button
                            className={cn(
                              "ml-2 text-muted-foreground hover:text-yellow-500",
                              dashboard.starred && "text-yellow-500",
                            )}
                            onClick={() => toggleStar(dashboard.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill={dashboard.starred ? "currentColor" : "none"}
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{dashboard.description}</p>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Avatar className="h-5 w-5 mr-1">
                            <AvatarFallback>{dashboard.owner.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{dashboard.owner.name}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{dashboard.lastModified}</span>
                          <span className="mx-2">•</span>
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{dashboard.views} 次查看</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getVisibilityIcon(dashboard.visibility)}
                          <span>{getVisibilityLabel(dashboard.visibility)}</span>
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => openShareDialog(dashboard)}>
                          <Share2 className="mr-2 h-4 w-4" />
                          共享
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>查看</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>编辑</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              <span>复制</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>删除</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {dashboard.sharedWith.length > 0 && (
                      <div className="px-4 py-2 border-t bg-muted/50">
                        <div className="flex items-center">
                          <span className="text-xs text-muted-foreground mr-2">共享给:</span>
                          <div className="flex -space-x-2">
                            {dashboard.sharedWith.map((user) => (
                              <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          {dashboard.sharedWith.length > 0 && (
                            <span className="text-xs text-muted-foreground ml-2">
                              {dashboard.sharedWith.map((u) => u.name).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>共享仪表盘</DialogTitle>
              <DialogDescription>选择谁可以查看或编辑此仪表盘</DialogDescription>
            </DialogHeader>
            {selectedDashboard && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>可见性</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer hover:border-primary transition-colors",
                        selectedDashboard.visibility === "private" && "border-primary bg-primary/5",
                      )}
                      onClick={() => setSelectedDashboard({ ...selectedDashboard, visibility: "private" })}
                    >
                      <Lock className="h-5 w-5 mb-1" />
                      <span className="text-sm font-medium">私有</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">仅您可以访问</span>
                    </div>
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer hover:border-primary transition-colors",
                        selectedDashboard.visibility === "team" && "border-primary bg-primary/5",
                      )}
                      onClick={() => setSelectedDashboard({ ...selectedDashboard, visibility: "team" })}
                    >
                      <Users className="h-5 w-5 mb-1" />
                      <span className="text-sm font-medium">团队</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">团队成员可以访问</span>
                    </div>
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer hover:border-primary transition-colors",
                        selectedDashboard.visibility === "public" && "border-primary bg-primary/5",
                      )}
                      onClick={() => setSelectedDashboard({ ...selectedDashboard, visibility: "public" })}
                    >
                      <Globe className="h-5 w-5 mb-1" />
                      <span className="text-sm font-medium">公开</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">所有人可以访问</span>
                    </div>
                  </div>
                </div>

                {selectedDashboard.visibility === "team" && (
                  <div className="space-y-2">
                    <Label htmlFor="team">选择团队</Label>
                    <select
                      id="team"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedDashboard.team || ""}
                      onChange={(e) => setSelectedDashboard({ ...selectedDashboard, team: e.target.value })}
                    >
                      <option value="">选择团队</option>
                      {exampleTeams.map((team) => (
                        <option key={team.id} value={team.name}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>共享给特定用户</Label>
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      添加用户
                    </Button>
                  </div>

                  <div className="border rounded-md divide-y">
                    {selectedDashboard.sharedWith.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">尚未共享给任何用户</div>
                    ) : (
                      selectedDashboard.sharedWith.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              value={user.role}
                              onChange={(e) => {
                                const newSharedWith = selectedDashboard.sharedWith.map((u) =>
                                  u.id === user.id ? { ...u, role: e.target.value } : u,
                                )
                                setSelectedDashboard({ ...selectedDashboard, sharedWith: newSharedWith })
                              }}
                            >
                              <option value="viewer">查看者</option>
                              <option value="editor">编辑者</option>
                            </select>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-comments">允许评论</Label>
                    <Switch
                      id="allow-comments"
                      checked={selectedDashboard.allowComments}
                      onCheckedChange={(checked) =>
                        setSelectedDashboard({ ...selectedDashboard, allowComments: checked })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">允许用户对此仪表盘添加评论和反馈</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleShare}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">共 {filteredDashboards.length} 个仪表盘</div>
        <Button variant="outline" size="sm">
          查看所有仪表盘
        </Button>
      </CardFooter>
    </Card>
  )
}

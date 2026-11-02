"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Avatar, AvatarFallback } from "@yyc3/ui/avatar"
import { Badge } from "@yyc3/ui/badge"
import { Progress } from "@yyc3/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@yyc3/ui/dialog"
import {
  Plus,
  Search,
  Filter,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  User,
  Trash2,
  Edit,
  ArrowUpRight,
  Users,
  CheckSquare,
  BarChart3,
  MessageSquare,
  PaperclipIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@yyc3/ui/dropdown-menu"
import { cn } from "@yyc3/lib/utils"

// Example team tasks
const exampleTasks = [
  {
    id: "task-1",
    title: "分析第三季度销售数据",
    description: "分析第三季度销售数据，找出下滑原因并提出改进建议",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-03-20",
    assignee: {
      id: "user-1",
      name: "张三",
      avatar: null,
    },
    creator: {
      id: "user-2",
      name: "李四",
      avatar: null,
    },
    team: {
      id: "team-1",
      name: "销售团队",
    },
    tags: ["销售", "分析"],
    progress: 60,
    createdAt: "2025-03-10",
    watchers: [
      { id: "user-2", name: "李四", avatar: null },
      { id: "user-3", name: "王五", avatar: null },
    ],
    comments: 5,
    attachments: 2,
  },
  {
    id: "task-2",
    title: "更新产品目录",
    description: "更新产品目录，添加新产品信息和价格",
    status: "todo",
    priority: "medium",
    dueDate: "2025-03-25",
    assignee: {
      id: "user-3",
      name: "王五",
      avatar: null,
    },
    creator: {
      id: "user-1",
      name: "张三",
      avatar: null,
    },
    team: {
      id: "team-2",
      name: "市场团队",
    },
    tags: ["产品", "目录"],
    progress: 0,
    createdAt: "2025-03-15",
    watchers: [{ id: "user-1", name: "张三", avatar: null }],
    comments: 2,
    attachments: 1,
  },
  {
    id: "task-3",
    title: "客户满意度调查",
    description: "进行客户满意度调查，收集反馈并分析结果",
    status: "completed",
    priority: "high",
    dueDate: "2025-03-15",
    assignee: {
      id: "user-2",
      name: "李四",
      avatar: null,
    },
    creator: {
      id: "user-1",
      name: "张三",
      avatar: null,
    },
    team: {
      id: "team-3",
      name: "客户服务团队",
    },
    tags: ["客户", "调查"],
    progress: 100,
    createdAt: "2025-03-05",
    watchers: [
      { id: "user-1", name: "张三", avatar: null },
      { id: "user-4", name: "赵六", avatar: null },
    ],
    comments: 8,
    attachments: 3,
  },
  {
    id: "task-4",
    title: "准备月度销售报告",
    description: "整理销售数据，准备月度销售报告",
    status: "todo",
    priority: "high",
    dueDate: "2025-03-30",
    assignee: null,
    creator: {
      id: "user-2",
      name: "李四",
      avatar: null,
    },
    team: {
      id: "team-1",
      name: "销售团队",
    },
    tags: ["销售", "报告"],
    progress: 0,
    createdAt: "2025-03-16",
    watchers: [],
    comments: 0,
    attachments: 0,
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
  { id: "team-3", name: "客户服务团队" },
  { id: "team-4", name: "技术团队" },
]

export function TeamTaskManager() {
  const [tasks, setTasks] = useState(exampleTasks)
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignee: null,
    team: null,
    tags: [],
  })
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = tasks.filter((task) => {
    // Filter by tab
    if (activeTab === "my" && task.assignee?.id !== "user-1") return false
    if (activeTab === "created" && task.creator.id !== "user-1") return false
    if (activeTab === "watching" && !task.watchers.some((w) => w.id === "user-1")) return false
    if (activeTab === "todo" && task.status !== "todo") return false
    if (activeTab === "in-progress" && task.status !== "in-progress") return false
    if (activeTab === "completed" && task.status !== "completed") return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        task.assignee?.name.toLowerCase().includes(query) ||
        task.team.name.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleCreateTask = () => {
    if (!newTask.title) return

    const newTaskObj = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      assignee: newTask.assignee,
      creator: {
        id: "user-1",
        name: "张三",
        avatar: null,
      },
      team: newTask.team || {
        id: "team-1",
        name: "销售团队",
      },
      tags: newTask.tags,
      progress: 0,
      createdAt: new Date().toISOString().split("T")[0],
      watchers: [],
      comments: 0,
      attachments: 0,
    }

    setTasks([newTaskObj, ...tasks])
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assignee: null,
      team: null,
      tags: [],
    })
    setIsCreateDialogOpen(false)
  }

  const updateTaskStatus = (taskId: string, status: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const progress = status === "completed" ? 100 : status === "in-progress" ? 50 : 0
          return { ...task, status, progress }
        }
        return task
      }),
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "待处理"
      case "in-progress":
        return "进行中"
      case "completed":
        return "已完成"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return AlertCircle
      case "in-progress":
        return Clock
      case "completed":
        return CheckCircle2
      default:
        return AlertCircle
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "高"
      case "medium":
        return "中"
      case "low":
        return "低"
      default:
        return priority
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500"
    if (progress >= 50) return "bg-blue-500"
    return "bg-yellow-500"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>团队任务</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                创建任务
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新任务</DialogTitle>
                <DialogDescription>添加新任务并分配给团队成员</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">任务标题</label>
                  <Input
                    placeholder="输入任务标题"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">任务描述</label>
                  <Input
                    placeholder="输入任务描述"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">优先级</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                      <option value="high">高</option>
                      <option value="medium">中</option>
                      <option value="low">低</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">截止日期</label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">负责人</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTask.assignee?.id || ""}
                    onChange={(e) => {
                      const userId = e.target.value
                      if (!userId) {
                        setNewTask({ ...newTask, assignee: null })
                      } else {
                        const user = exampleUsers.find((u) => u.id === userId)
                        setNewTask({ ...newTask, assignee: user })
                      }
                    }}
                  >
                    <option value="">未分配</option>
                    {exampleUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">团队</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTask.team?.id || ""}
                    onChange={(e) => {
                      const teamId = e.target.value
                      if (!teamId) {
                        setNewTask({ ...newTask, team: null })
                      } else {
                        const team = exampleTeams.find((t) => t.id === teamId)
                        setNewTask({ ...newTask, team })
                      }
                    }}
                  >
                    <option value="">选择团队</option>
                    {exampleTeams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">标签</label>
                  <Input
                    placeholder="输入标签，用逗号分隔"
                    value={newTask.tags.join(", ")}
                    onChange={(e) => {
                      const tagsString = e.target.value
                      const tags = tagsString
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                      setNewTask({ ...newTask, tags })
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateTask}>创建任务</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>管理和跟踪团队任务</CardDescription>
        <div className="flex items-center gap-4 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索任务..."
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
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">全部任务</TabsTrigger>
            <TabsTrigger value="my">我的任务</TabsTrigger>
            <TabsTrigger value="created">我创建的</TabsTrigger>
          </TabsList>

          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todo">
              待处理
              <Badge variant="secondary" className="ml-2">
                {tasks.filter((t) => t.status === "todo").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              进行中
              <Badge variant="secondary" className="ml-2">
                {tasks.filter((t) => t.status === "in-progress").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed">
              已完成
              <Badge variant="secondary" className="ml-2">
                {tasks.filter((t) => t.status === "completed").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="pt-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">没有找到任务</div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => {
                  const StatusIcon = getStatusIcon(task.status)
                  return (
                    <div key={task.id} className="border rounded-md overflow-hidden">
                      <div className="flex items-start justify-between p-4">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium">{task.title}</h3>
                            <Badge variant="outline" className={cn("ml-2", getPriorityColor(task.priority))}>
                              {getPriorityLabel(task.priority)}优先级
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className={getStatusColor(task.status)}>
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {getStatusLabel(task.status)}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {task.team.name}
                            </Badge>
                            {task.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">进度: {task.progress}%</span>
                              <span className="text-xs text-muted-foreground">截止日期: {task.dueDate}</span>
                            </div>
                            <Progress value={task.progress} className={getProgressColor(task.progress)} />
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <ArrowUpRight className="mr-2 h-4 w-4" />
                                <span>查看详情</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>编辑</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => updateTaskStatus(task.id, "todo")}>
                                <AlertCircle className="mr-2 h-4 w-4" />
                                <span>标记为待处理</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateTaskStatus(task.id, "in-progress")}>
                                <Clock className="mr-2 h-4 w-4" />
                                <span>标记为进行中</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateTaskStatus(task.id, "completed")}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                <span>标记为已完成</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => deleteTask(task.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>删除</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <div className="flex items-center mt-2">
                            {task.assignee ? (
                              <div className="flex items-center gap-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs">{task.assignee.name}</span>
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                未分配
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-2 border-t bg-muted/50 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>创建者: {task.creator.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>创建于: {task.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {task.comments > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageSquare className="h-3 w-3" />
                              <span>{task.comments}</span>
                            </div>
                          )}
                          {task.attachments > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <PaperclipIcon className="h-3 w-3" />
                              <span>{task.attachments}</span>
                            </div>
                          )}
                          {task.watchers.length > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="flex -space-x-1">
                                {task.watchers.slice(0, 3).map((watcher) => (
                                  <Avatar key={watcher.id} className="h-4 w-4 border border-background">
                                    <AvatarFallback className="text-[8px]">{watcher.name[0]}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              {task.watchers.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{task.watchers.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          显示 {filteredTasks.length} 个任务（共 {tasks.length} 个）
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            任务统计
          </Button>
          <Button variant="outline" size="sm">
            <CheckSquare className="mr-2 h-4 w-4" />
            看板视图
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

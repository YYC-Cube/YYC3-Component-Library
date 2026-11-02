"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Label } from "@yyc3/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Badge } from "@yyc3/ui/badge"
import { Checkbox } from "@yyc3/ui/checkbox"
import { Avatar, AvatarFallback } from "@yyc3/ui/avatar"
import { Plus, Search, Filter, Calendar, MoreHorizontal, Trash2, Edit, ArrowUpRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@yyc3/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@yyc3/ui/dialog"
import { cn } from "@yyc3/lib/utils"

interface User {
  id: string;
  name: string;
  avatar: string | null;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignee: User | null;
  tags: string[];
  createdAt: string;
}

// 示例任务数据
const exampleTasks: Task[] = [
  {
    id: "task-1",
    title: "审核新订单",
    description: "审核并处理今日新收到的订单",
    status: "pending" as const,
    priority: "high" as const,
    dueDate: "2025-03-16",
    assignee: {
      id: "user-1",
      name: "张三",
      avatar: null,
    },
    tags: ["订单", "审核"],
    createdAt: "2025-03-15",
  },
  {
    id: "task-2",
    title: "更新库存数据",
    description: "根据最新的销售情况更新库存数据",
    status: "in-progress" as const,
    priority: "medium" as const,
    dueDate: "2025-03-17",
    assignee: {
      id: "user-2",
      name: "李四",
      avatar: null,
    },
    tags: ["库存", "数据"],
    createdAt: "2025-03-14",
  },
  {
    id: "task-3",
    title: "准备月度销售报表",
    description: "整理并准备本月的销售报表数据",
    status: "completed" as const,
    priority: "medium" as const,
    dueDate: "2025-03-10",
    assignee: {
      id: "user-1",
      name: "张三",
      avatar: null,
    },
    tags: ["报表", "销售"],
    createdAt: "2025-03-05",
  },
  {
    id: "task-4",
    title: "联系供应商",
    description: "联系主要供应商讨论下个月的订单计划",
    status: "pending" as const,
    priority: "low" as const,
    dueDate: "2025-03-20",
    assignee: null,
    tags: ["供应商", "订单"],
    createdAt: "2025-03-15",
  },
]

// 用户数据
const users: User[] = [
  { id: "user-1", name: "张三", avatar: null },
  { id: "user-2", name: "李四", avatar: null },
  { id: "user-3", name: "王五", avatar: null },
]

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(exampleTasks)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "medium" as const,
    dueDate: "",
    assignee: null,
    tags: [],
    createdAt: new Date().toISOString().split('T')[0],
  })

  // Filter tasks based on active tab and search query
  const filteredTasks = tasks.filter((task) => {
    // Filter by tab
    if (activeTab === "pending" && task.status !== "pending") return false
    if (activeTab === "in-progress" && task.status !== "in-progress") return false
    if (activeTab === "completed" && task.status !== "completed") return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return true
  })

  const handleCreateTask = () => {
    if (!newTask.title) return

    const newTaskObj: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title || "",
      description: newTask.description || "",
      status: "pending",
      priority: newTask.priority as 'high' | 'medium' | 'low' || "medium",
      dueDate: newTask.dueDate || "",
      assignee: newTask.assignee || null,
      tags: newTask.tags || [],
      createdAt: new Date().toISOString().split("T")[0],
    }

    setTasks([...tasks, newTaskObj])
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assignee: null,
      tags: [],
    })
    setIsCreateDialogOpen(false)
  }

  const updateTaskStatus = (taskId: string, status: 'pending' | 'in-progress' | 'completed') => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
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

  const getStatusColor = (status: 'pending' | 'in-progress' | 'completed') => {
    switch (status) {
      case "pending":
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
      case "pending":
        return "待处理"
      case "in-progress":
        return "进行中"
      case "completed":
        return "已完成"
      default:
        return status
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>任务管理</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新建任务
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新任务</DialogTitle>
                <DialogDescription>添加新任务并分配给团队成员</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">任务标题</Label>
                  <Input
                    id="task-title"
                    placeholder="输入任务标题"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-description">任务描述</Label>
                  <Input
                    id="task-description"
                    placeholder="输入任务描述"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-priority">优先级</Label>
                    <select
                      id="task-priority"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                    >
                      <option value="high">高</option>
                      <option value="medium">中</option>
                      <option value="low">低</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-due-date">截止日期</Label>
                    <Input
                      id="task-due-date"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-assignee">负责人</Label>
                  <select
                    id="task-assignee"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTask.assignee?.id || ""}
                    onChange={(e) => {
                      const userId = e.target.value
                      if (!userId) {
                        setNewTask({ ...newTask, assignee: null })
                      } else {
                        const user = users.find((u) => u.id === userId)
                        setNewTask({ ...newTask, assignee: user })
                      }
                    }}
                  >
                    <option value="">未分配</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-tags">标签</Label>
                  <Input
                    id="task-tags"
                    placeholder="输入标签，用逗号分隔"
                    value={newTask.tags?.join(", ") || ""}
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              <div className="flex items-center">
                <span>全部</span>
                <Badge variant="secondary" className="ml-2">
                  {tasks.length}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="pending">
              <div className="flex items-center">
                <span>待处理</span>
                <Badge variant="secondary" className="ml-2">
                  {tasks.filter((t) => t.status === "pending").length}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              <div className="flex items-center">
                <span>进行中</span>
                <Badge variant="secondary" className="ml-2">
                  {tasks.filter((t) => t.status === "in-progress").length}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="completed">
              <div className="flex items-center">
                <span>已完成</span>
                <Badge variant="secondary" className="ml-2">
                  {tasks.filter((t) => t.status === "completed").length}
                </Badge>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="pt-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">没有找到任务</div>
            ) : (
              <div className="space-y-2">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={(checked) => {
                          updateTaskStatus(task.id, checked ? "completed" : "pending")
                        }}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className={getStatusColor(task.status)}>
                            {getStatusLabel(task.status)}
                          </Badge>
                          <Badge variant="outline" className={cn("bg-muted", getPriorityColor(task.priority))}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {task.dueDate}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>编辑</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ArrowUpRight className="mr-2 h-4 w-4" />
                              <span>查看详情</span>
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
                      </div>
                      {task.assignee ? (
                        <div className="flex items-center gap-2">
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
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          显示 {filteredTasks.length} 个任务（共 {tasks.length} 个）
        </div>
        <Button variant="outline" size="sm">
          查看所有任务
        </Button>
      </CardFooter>
    </Card>
  )
}

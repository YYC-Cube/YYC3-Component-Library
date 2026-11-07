/**
 * @file 运维管理组件
 * @description 提供任务分配、状态监控等功能
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui-enterprise/table"
import { Button } from "@yyc3/ui-enterprise/button"
import { Input } from "@yyc3/ui-enterprise/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui-enterprise/select"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Plus, Search, Filter, Sliders } from "lucide-react"

// 模拟数据
const tasks = [
  {
    id: "T-001",
    title: "服务器扩容",
    assignee: "张三",
    department: "运维部",
    status: "已完成",
    priority: "高",
    dueDate: "2024-03-10",
  },
  {
    id: "T-002",
    title: "数据库备份优化",
    assignee: "李四",
    department: "运维部",
    status: "进行中",
    priority: "中",
    dueDate: "2024-03-15",
  },
  {
    id: "T-003",
    title: "安全漏洞修复",
    assignee: "王五",
    department: "安全部",
    status: "待处理",
    priority: "高",
    dueDate: "2024-03-12",
  },
  {
    id: "T-004",
    title: "监控系统升级",
    assignee: "赵六",
    department: "运维部",
    status: "待处理",
    priority: "中",
    dueDate: "2024-03-20",
  },
  {
    id: "T-005",
    title: "用户权限审核",
    assignee: "钱七",
    department: "安全部",
    status: "进行中",
    priority: "低",
    dueDate: "2024-03-25",
  },
]

export function OperationsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortField, setSortField] = useState("dueDate")
  const [sortDirection, setSortDirection] = useState("asc")

  // 筛选任务
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || task.department === departmentFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesPriority
  })

  // 排序任务
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a[sortField as keyof typeof a] < b[sortField as keyof typeof b]) {
      return sortDirection === "asc" ? -1 : 1
    }
    if (a[sortField as keyof typeof a] > b[sortField as keyof typeof b]) {
      return sortDirection === "asc" ? 1 : -1
    }
    return 0
  })

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "待处理":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            待处理
          </Badge>
        )
      case "进行中":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            进行中
          </Badge>
        )
      case "已完成":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            已完成
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  // 获取优先级徽章
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "高":
        return <Badge className="bg-red-500">高</Badge>
      case "中":
        return <Badge className="bg-yellow-500">中</Badge>
      case "低":
        return <Badge className="bg-blue-500">低</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  // 处理排序
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>运维管理</CardTitle>
          <CardDescription>任务分配与状态监控</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" /> 新建任务
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="搜索任务名称、ID或负责人..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="待处理">待处理</SelectItem>
                  <SelectItem value="进行中">进行中</SelectItem>
                  <SelectItem value="已完成">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部部门</SelectItem>
                  <SelectItem value="运维部">运维部</SelectItem>
                  <SelectItem value="安全部">安全部</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部优先级</SelectItem>
                  <SelectItem value="高">高</SelectItem>
                  <SelectItem value="中">中</SelectItem>
                  <SelectItem value="低">低</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Sliders className="h-4 w-4" />
              重置筛选
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>任务名称</TableHead>
                <TableHead>负责人</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>优先级</TableHead>
                <TableHead onClick={() => handleSort("dueDate")} className="cursor-pointer">
                  截止日期 {sortField === "dueDate" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>{task.department}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      查看
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
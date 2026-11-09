/**
 * @file 工作日志组件
 * @description 提供用户记录和管理每日工作内容的功能，包括日志的创建、编辑、查看和统计
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Textarea } from "@yyc3/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@yyc3/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui/table"
import { Badge } from "@yyc3/ui/badge"
import { Calendar } from "@yyc3/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@yyc3/ui/popover"
import { ScrollArea } from "@yyc3/ui/scroll-area"
import { Separator } from "@yyc3/ui/separator"
import { Label } from "@yyc3/ui/label"
import {
  BarChart3,
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Filter,
  FileText,
  LayoutList,
  ListChecks,
  Plus,
  Search,
  Send,
  Settings,
  Trash2,
  User,
  Users,
  X
} from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"

// 模拟工作日志数据
const mockWorkLogs = [
  {
    id: 1,
    date: new Date(2024, 9, 15), // 10月15日
    startTime: "09:00",
    endTime: "18:00",
    content: "完成了双导管理系统的信息中心模块开发，主要实现了员工之声、最新通知、通知文档、频道和部门管理等功能。修复了信息展示的样式问题。",
    tasks: [
      { id: 1, name: "信息中心模块开发", completed: true },
      { id: 2, name: "样式问题修复", completed: true },
      { id: 3, name: "代码评审", completed: false }
    ],
    category: "开发",
    mood: "good",
    tags: ["前端", "React", "开发"],
    attachments: [],
    reviewed: true,
    reviewer: "李经理"
  },
  {
    id: 2,
    date: new Date(2024, 9, 14), // 10月14日
    startTime: "09:00",
    endTime: "18:30",
    content: "学习了新的UI组件库，研究了其使用方法。完成了学习公园模块的设计工作，制定了详细的功能规划和界面原型。",
    tasks: [
      { id: 4, name: "学习新UI组件库", completed: true },
      { id: 5, name: "学习公园模块设计", completed: true }
    ],
    category: "学习",
    mood: "neutral",
    tags: ["学习", "设计", "UI"],
    attachments: [],
    reviewed: true,
    reviewer: "王主管"
  },
  {
    id: 3,
    date: new Date(2024, 9, 13), // 10月13日
    startTime: "09:00",
    endTime: "17:45",
    content: "参加了团队周会，讨论了本周工作重点和计划。与产品经理沟通了需求变更，对系统设置模块进行了调整。",
    tasks: [
      { id: 6, name: "团队周会", completed: true },
      { id: 7, name: "需求沟通", completed: true },
      { id: 8, name: "系统设置模块调整", completed: false }
    ],
    category: "会议",
    mood: "good",
    tags: ["会议", "沟通", "需求"],
    attachments: [],
    reviewed: false,
    reviewer: null
  },
  {
    id: 4,
    date: new Date(2024, 9, 12), // 10月12日
    startTime: "09:00",
    endTime: "19:00",
    content: "解决了营销计划模块的性能问题，优化了数据加载逻辑。添加了新的图表展示功能，提升了数据可视化效果。",
    tasks: [
      { id: 9, name: "性能优化", completed: true },
      { id: 10, name: "图表功能开发", completed: true }
    ],
    category: "开发",
    mood: "good",
    tags: ["性能", "优化", "图表"],
    attachments: [],
    reviewed: true,
    reviewer: "李经理"
  },
  {
    id: 5,
    date: new Date(2024, 9, 11), // 10月11日
    startTime: "09:00",
    endTime: "18:00",
    content: "完成了系统部署和环境配置工作。进行了系统功能测试，修复了发现的bug。",
    tasks: [
      { id: 11, name: "系统部署", completed: true },
      { id: 12, name: "环境配置", completed: true },
      { id: 13, name: "功能测试", completed: true },
      { id: 14, name: "Bug修复", completed: true }
    ],
    category: "运维",
    mood: "neutral",
    tags: ["部署", "测试", "运维"],
    attachments: [],
    reviewed: true,
    reviewer: "张总监"
  }
]

// 工作类别选项
const workCategories = [
  { value: "开发", label: "开发" },
  { value: "学习", label: "学习" },
  { value: "会议", label: "会议" },
  { value: "运维", label: "运维" },
  { value: "设计", label: "设计" },
  { value: "文档", label: "文档" },
  { value: "其他", label: "其他" }
]

// 心情选项
const moodOptions = [
  { value: "good", label: "开心", icon: "😊" },
  { value: "neutral", label: "一般", icon: "😐" },
  { value: "bad", label: "沮丧", icon: "😔" }
]

const WorkLog = () => {
  const [workLogs, setWorkLogs] = useState(mockWorkLogs)
  const [activeTab, setActiveTab] = useState("daily")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [filterCategory, setFilterCategory] = useState("")
  const [newTask, setNewTask] = useState("")
  const [showAddLogDialog, setShowAddLogDialog] = useState(false)
  const [editingLog, setEditingLog] = useState<any>(null)
  const [newLog, setNewLog] = useState({
    date: new Date(),
    startTime: "09:00",
    endTime: "18:00",
    content: "",
    tasks: [],
    category: "开发",
    mood: "good",
    tags: []
  })
  const [newTag, setNewTag] = useState("")
  const [statisticsView, setStatisticsView] = useState("week")

  // 格式化日期显示
  const formatDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd')
  }

  // 格式化日期为中文显示
  const formatDateChinese = (date: Date) => {
    return format(date, 'MM月dd日')
  }

  // 计算两个时间之间的小时差
  const calculateHours = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)
    const start = startHour + startMinute / 60
    const end = endHour + endMinute / 60
    return (end - start).toFixed(1)
  }

  // 根据标签页和筛选条件获取工作日志
  const getFilteredWorkLogs = () => {
    let filtered = workLogs

    // 根据搜索词筛选
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.tasks.some(task => task.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        log.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // 根据分类筛选
    if (filterCategory) {
      filtered = filtered.filter(log => log.category === filterCategory)
    }

    // 根据标签页筛选
    if (activeTab === "daily" && selectedDate) {
      filtered = filtered.filter(log => formatDate(log.date) === formatDate(selectedDate))
    }

    // 按日期倒序排序
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  // 添加新任务
  const addTask = () => {
    if (newTask.trim() && editingLog) {
      setEditingLog({
        ...editingLog,
        tasks: [...editingLog.tasks, { id: Date.now(), name: newTask.trim(), completed: false }]
      })
      setNewTask("")
    } else if (newTask.trim()) {
      setNewLog({
        ...newLog,
        tasks: [...newLog.tasks, { id: Date.now(), name: newTask.trim(), completed: false }]
      })
      setNewTask("")
    }
  }

  // 切换任务完成状态
  const toggleTaskStatus = (taskId: number) => {
    if (editingLog) {
      setEditingLog({
        ...editingLog,
        tasks: editingLog.tasks.map((task: any) => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      })
    }
  }

  // 删除任务
  const deleteTask = (taskId: number) => {
    if (editingLog) {
      setEditingLog({
        ...editingLog,
        tasks: editingLog.tasks.filter((task: any) => task.id !== taskId)
      })
    } else {
      setNewLog({
        ...newLog,
        tasks: newLog.tasks.filter((task: any) => task.id !== taskId)
      })
    }
  }

  // 添加新标签
  const addTag = () => {
    if (newTag.trim() && !newLog.tags.includes(newTag.trim())) {
      setNewLog({
        ...newLog,
        tags: [...newLog.tags, newTag.trim()]
      })
      setNewTag("")
    }
  }

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setNewLog({
      ...newLog,
      tags: newLog.tags.filter(tag => tag !== tagToRemove)
    })
  }

  // 保存新工作日志
  const saveNewLog = () => {
    if (newLog.content.trim() || newLog.tasks.length > 0) {
      const logToAdd = {
        ...newLog,
        id: Date.now(),
        reviewed: false,
        reviewer: null,
        attachments: []
      }
      setWorkLogs([logToAdd, ...workLogs])
      setShowAddLogDialog(false)
      resetNewLogForm()
    }
  }

  // 保存编辑的工作日志
  const saveEditedLog = () => {
    if (editingLog && (editingLog.content.trim() || editingLog.tasks.length > 0)) {
      setWorkLogs(workLogs.map(log => 
        log.id === editingLog.id ? editingLog : log
      ))
      setEditingLog(null)
    }
  }

  // 删除工作日志
  const deleteWorkLog = (logId: number) => {
    setWorkLogs(workLogs.filter(log => log.id !== logId))
    if (editingLog && editingLog.id === logId) {
      setEditingLog(null)
    }
  }

  // 重置新日志表单
  const resetNewLogForm = () => {
    setNewLog({
      date: new Date(),
      startTime: "09:00",
      endTime: "18:00",
      content: "",
      tasks: [],
      category: "开发",
      mood: "good",
      tags: []
    })
    setNewTask("")
    setNewTag("")
  }

  // 编辑工作日志
  const handleEditLog = (log: any) => {
    setEditingLog({ ...log })
  }

  // 获取心情图标
  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "good":
        return "😊"
      case "neutral":
        return "😐"
      case "bad":
        return "😔"
      default:
        return "😊"
    }
  }

  // 获取当前周的工作日志
  const getCurrentWeekLogs = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() || 7 // 将周日从0改为7
    const monday = new Date(today)
    monday.setDate(today.getDate() - dayOfWeek + 1)
    
    return workLogs.filter(log => {
      const logDate = new Date(log.date)
      return logDate >= monday && logDate <= today
    })
  }

  // 渲染工作日志详情
  const renderLogDetails = (log: any) => (
    <motion.div 
      key={log.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <Card className="bg-tech-blue-800 text-tech-blue-100">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start w-full">
            <div>
              <CardTitle className="text-xl">{formatDateChinese(log.date)}</CardTitle>
              <CardDescription className="text-tech-blue-300 flex items-center mt-1">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {log.startTime} - {log.endTime} ({calculateHours(log.startTime, log.endTime)}小时)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-tech-blue-700/50 border-tech-blue-600">
                {log.category}
              </Badge>
              <span className="text-xl">{getMoodIcon(log.mood)}</span>
              {log.reviewed && (
                <Badge className="bg-green-600">已审核</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-2">
          {log.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {log.tags.map((tag: string, index: number) => (
                <Badge key={index} className="bg-tech-blue-700">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {log.content && (
            <div>
              <h4 className="font-medium mb-2">工作内容</h4>
              <p className="text-tech-blue-200 whitespace-pre-line">{log.content}</p>
            </div>
          )}
          
          {log.tasks.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">任务清单</h4>
              <ul className="space-y-2">
                {log.tasks.map((task: any) => (
                  <li key={task.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="rounded border-tech-blue-600 bg-tech-blue-700 text-tech-blue-400 focus:ring-tech-blue-500"
                    />
                    <span className={`${task.completed ? 'line-through text-tech-blue-400' : 'text-tech-blue-200'}`}>
                      {task.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-tech-blue-700 pt-4">
          <div>
            {log.reviewed && log.reviewer && (
              <p className="text-sm text-tech-blue-400">
                <User className="h-3.5 w-3.5 inline mr-1" />
                审核人：{log.reviewer}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEditLog(log)}>
              <Edit className="h-4 w-4 mr-1" />
              编辑
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteWorkLog(log.id)}>
              <Trash2 className="h-4 w-4 mr-1" />
              删除
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* 页面标题和操作栏 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-tech-blue-400 mr-3" />
          <h1 className="text-2xl font-bold">工作日志</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-tech-blue-400" />
            <Input
              placeholder="搜索工作日志..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-tech-blue-800 border-tech-blue-700"
            />
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[120px] bg-tech-blue-800 border-tech-blue-700">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="分类" />
            </SelectTrigger>
            <SelectContent className="bg-tech-blue-800 border-tech-blue-700">
              <SelectItem value="">全部分类</SelectItem>
              {workCategories.map(category => (
                <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={showAddLogDialog} onOpenChange={setShowAddLogDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                新建日志
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-tech-blue-800 text-tech-blue-100">
              <DialogHeader>
                <DialogTitle>新建工作日志</DialogTitle>
                <DialogDescription className="text-tech-blue-300">
                  记录您的日常工作内容和完成的任务
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logDate">日期</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="logDate"
                          variant="ghost"
                          className="w-full justify-start text-left font-normal bg-tech-blue-700 border border-tech-blue-600"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formatDate(newLog.date)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-tech-blue-800 border-tech-blue-600" align="start">
                        <Calendar
                          mode="single"
                          selected={newLog.date}
                          onSelect={(date) => date && setNewLog({ ...newLog, date })}
                          className="rounded-md"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logCategory">工作类别</Label>
                    <Select
                      value={newLog.category}
                      onValueChange={(value) => setNewLog({ ...newLog, category: value })}
                    >
                      <SelectTrigger id="logCategory" className="bg-tech-blue-700 border-tech-blue-600">
                        <SelectValue placeholder="选择类别" />
                      </SelectTrigger>
                      <SelectContent className="bg-tech-blue-800 border-tech-blue-600">
                        {workCategories.map(category => (
                          <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logStartTime">开始时间</Label>
                    <Input
                      id="logStartTime"
                      type="time"
                      value={newLog.startTime}
                      onChange={(e) => setNewLog({ ...newLog, startTime: e.target.value })}
                      className="bg-tech-blue-700 border-tech-blue-600"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logEndTime">结束时间</Label>
                    <Input
                      id="logEndTime"
                      type="time"
                      value={newLog.endTime}
                      onChange={(e) => setNewLog({ ...newLog, endTime: e.target.value })}
                      className="bg-tech-blue-700 border-tech-blue-600"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logContent">工作内容</Label>
                  <Textarea
                    id="logContent"
                    placeholder="请输入您的工作内容..."
                    value={newLog.content}
                    onChange={(e) => setNewLog({ ...newLog, content: e.target.value })}
                    className="min-h-[100px] bg-tech-blue-700 border-tech-blue-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>任务清单</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="添加新任务..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      className="bg-tech-blue-700 border-tech-blue-600"
                    />
                    <Button onClick={addTask}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {newLog.tasks.length > 0 && (
                    <ul className="space-y-2 mt-2">
                      {newLog.tasks.map((task: any) => (
                        <li key={task.id} className="flex items-center justify-between p-2 bg-tech-blue-700/50 rounded">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              readOnly
                              className="rounded border-tech-blue-600 bg-tech-blue-800 text-tech-blue-400 focus:ring-tech-blue-500"
                            />
                            <span>{task.name}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>标签</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="添加标签..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="bg-tech-blue-700 border-tech-blue-600"
                    />
                    <Button onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {newLog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newLog.tags.map((tag: string, index: number) => (
                        <Badge key={index} className="bg-tech-blue-700 flex items-center gap-1">
                          {tag}
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1" onClick={() => removeTag(tag)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>心情指数</Label>
                  <div className="flex gap-3">
                    {moodOptions.map(option => (
                      <Button
                        key={option.value}
                        variant={newLog.mood === option.value ? "default" : "ghost"}
                        className={newLog.mood === option.value ? "bg-tech-blue-700" : "bg-transparent"}
                        onClick={() => setNewLog({ ...newLog, mood: option.value })}
                      >
                        <span className="text-xl mr-2">{option.icon}</span>
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="ghost" onClick={() => setShowAddLogDialog(false)}>取消</Button>
                <Button onClick={saveNewLog}>保存日志</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* 标签页导航 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="daily" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              每日记录
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center">
              <LayoutList className="h-4 w-4 mr-2" />
              日志列表
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              工作统计
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* 每日记录标签页 */}
        <TabsContent value="daily" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row gap-6"
          >
            <Card className="bg-tech-blue-800 text-tech-blue-100 flex-shrink-0 w-full md:w-[300px]">
              <CardHeader>
                <CardTitle>选择日期</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                />
              </CardContent>
            </Card>
            
            <div className="flex-1">
              {selectedDate && (
                <div className="mb-4">
                  <h2 className="text-xl font-medium">
                    {formatDateChinese(selectedDate)} 的工作日志
                  </h2>
                </div>
              )}
              
              <div className="space-y-4">
                {getFilteredWorkLogs().length > 0 ? (
                  getFilteredWorkLogs().map(log => renderLogDetails(log))
                ) : (
                  <Card className="bg-tech-blue-800 text-tech-blue-100 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-tech-blue-400 mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">暂无工作日志</h3>
                      <p className="text-tech-blue-300 mb-4">该日期还没有记录任何工作日志</p>
                      <Button onClick={() => setShowAddLogDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        新建日志
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* 日志列表标签页 */}
        <TabsContent value="list" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {getFilteredWorkLogs().length > 0 ? (
              <div className="space-y-4">
                {getFilteredWorkLogs().map(log => renderLogDetails(log))}
              </div>
            ) : (
              <Card className="bg-tech-blue-800 text-tech-blue-100 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-tech-blue-400 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">暂无工作日志</h3>
                  <p className="text-tech-blue-300 mb-4">没有找到符合条件的工作日志</p>
                  <Button onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("");
                  }}>
                    <X className="h-4 w-4 mr-2" />
                    清除筛选
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        {/* 工作统计标签页 */}
        <TabsContent value="statistics" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-tech-blue-800 text-tech-blue-100">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>工作统计概览</CardTitle>
                  <Select value={statisticsView} onValueChange={setStatisticsView}>
                    <SelectTrigger className="w-[120px] bg-tech-blue-700 border-tech-blue-600">
                      <SelectValue placeholder="时间段" />
                    </SelectTrigger>
                    <SelectContent className="bg-tech-blue-800 border-tech-blue-700">
                      <SelectItem value="week">本周</SelectItem>
                      <SelectItem value="month">本月</SelectItem>
                      <SelectItem value="quarter">本季度</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-tech-blue-700/50 border-tech-blue-600">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{getCurrentWeekLogs().length}</div>
                      <div className="text-sm text-tech-blue-300 mt-1">本周工作日志</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-tech-blue-700/50 border-tech-blue-600">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {getCurrentWeekLogs().reduce((total, log) => 
                          total + Number(calculateHours(log.startTime, log.endTime)), 0
                        ).toFixed(1)}
                      </div>
                      <div className="text-sm text-tech-blue-300 mt-1">本周工作小时</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-tech-blue-700/50 border-tech-blue-600">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {getCurrentWeekLogs().reduce((total, log) => 
                          total + log.tasks.filter((t: any) => t.completed).length, 0
                        )}
                      </div>
                      <div className="text-sm text-tech-blue-300 mt-1">本周完成任务</div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* 分类统计 */}
                <div>
                  <h3 className="text-lg font-medium mb-4">工作类别统计</h3>
                  <div className="space-y-3">
                    {workCategories.map(category => {
                      const count = getCurrentWeekLogs().filter(log => log.category === category.value).length
                      return count > 0 && (
                        <div key={category.value}>
                          <div className="flex justify-between mb-1">
                            <span>{category.label}</span>
                            <span>{count}次</span>
                          </div>
                          <div className="w-full bg-tech-blue-700 rounded-full h-2">
                            <div 
                              className="bg-tech-blue-400 h-2 rounded-full" 
                              style={{ 
                                width: `${(count / getCurrentWeekLogs().length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* 本周任务完成情况 */}
                <div>
                  <h3 className="text-lg font-medium mb-4">本周任务完成情况</h3>
                  <Table>
                    <TableHeader className="bg-tech-blue-700/50">
                      <TableRow>
                        <TableHead>日期</TableHead>
                        <TableHead>任务总数</TableHead>
                        <TableHead>已完成</TableHead>
                        <TableHead>完成率</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentWeekLogs().map(log => {
                        const totalTasks = log.tasks.length
                        const completedTasks = log.tasks.filter((t: any) => t.completed).length
                        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
                        
                        return (
                          <TableRow key={log.id}>
                            <TableCell>{formatDateChinese(log.date)}</TableCell>
                            <TableCell>{totalTasks}</TableCell>
                            <TableCell>{completedTasks}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-tech-blue-700 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${completionRate}%` }}
                                  ></div>
                                </div>
                                <span>{completionRate}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* 编辑日志对话框 */}
      {editingLog && (
        <Dialog open={!!editingLog} onOpenChange={(open) => !open && setEditingLog(null)}>
          <DialogContent className="sm:max-w-[600px] bg-tech-blue-800 text-tech-blue-100">
            <DialogHeader>
              <DialogTitle>编辑工作日志</DialogTitle>
              <DialogDescription className="text-tech-blue-300">
                修改您的工作日志内容
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editLogDate">日期</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="editLogDate"
                        variant="ghost"
                        className="w-full justify-start text-left font-normal bg-tech-blue-700 border border-tech-blue-600"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(editingLog.date)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-tech-blue-800 border-tech-blue-600" align="start">
                      <Calendar
                        mode="single"
                        selected={editingLog.date}
                        onSelect={(date) => date && setEditingLog({ ...editingLog, date })}
                        className="rounded-md"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editLogCategory">工作类别</Label>
                  <Select
                    value={editingLog.category}
                    onValueChange={(value) => setEditingLog({ ...editingLog, category: value })}
                  >
                    <SelectTrigger id="editLogCategory" className="bg-tech-blue-700 border-tech-blue-600">
                      <SelectValue placeholder="选择类别" />
                    </SelectTrigger>
                    <SelectContent className="bg-tech-blue-800 border-tech-blue-600">
                      {workCategories.map(category => (
                        <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editLogStartTime">开始时间</Label>
                  <Input
                    id="editLogStartTime"
                    type="time"
                    value={editingLog.startTime}
                    onChange={(e) => setEditingLog({ ...editingLog, startTime: e.target.value })}
                    className="bg-tech-blue-700 border-tech-blue-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editLogEndTime">结束时间</Label>
                  <Input
                    id="editLogEndTime"
                    type="time"
                    value={editingLog.endTime}
                    onChange={(e) => setEditingLog({ ...editingLog, endTime: e.target.value })}
                    className="bg-tech-blue-700 border-tech-blue-600"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editLogContent">工作内容</Label>
                <Textarea
                  id="editLogContent"
                  placeholder="请输入您的工作内容..."
                  value={editingLog.content}
                  onChange={(e) => setEditingLog({ ...editingLog, content: e.target.value })}
                  className="min-h-[100px] bg-tech-blue-700 border-tech-blue-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label>任务清单</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="添加新任务..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    className="bg-tech-blue-700 border-tech-blue-600"
                  />
                  <Button onClick={addTask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {editingLog.tasks.length > 0 && (
                  <ul className="space-y-2 mt-2">
                    {editingLog.tasks.map((task: any) => (
                      <li key={task.id} className="flex items-center justify-between p-2 bg-tech-blue-700/50 rounded">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskStatus(task.id)}
                            className="rounded border-tech-blue-600 bg-tech-blue-800 text-tech-blue-400 focus:ring-tech-blue-500"
                          />
                          <span>{task.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>心情指数</Label>
                <div className="flex gap-3">
                  {moodOptions.map(option => (
                    <Button
                      key={option.value}
                      variant={editingLog.mood === option.value ? "default" : "ghost"}
                      className={editingLog.mood === option.value ? "bg-tech-blue-700" : "bg-transparent"}
                      onClick={() => setEditingLog({ ...editingLog, mood: option.value })}
                    >
                      <span className="text-xl mr-2">{option.icon}</span>
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditingLog(null)}>取消</Button>
              <Button onClick={saveEditedLog}>保存更改</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default WorkLog
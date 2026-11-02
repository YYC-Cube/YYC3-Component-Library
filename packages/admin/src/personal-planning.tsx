/**
 * @file 个人规划组件
 * @description 提供职业目标、技能提升和培训计划管理功能
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Progress } from "@yyc3/ui/progress"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Textarea } from "@yyc3/ui/textarea"
import { Badge } from "@yyc3/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Calendar, Clock, Award, Book, Check, Plus, Trash2, Edit2 } from "lucide-react"

// 模拟数据 - 职业目标
const careerGoals = [
  {
    id: 1,
    title: "晋升为高级工程师",
    description: "在未来12个月内提升技术能力，承担更复杂的项目，争取晋升",
    deadline: "2025-06-30",
    progress: 65,
    priority: "高",
    status: "进行中",
  },
  {
    id: 2,
    title: "学习云原生技术",
    description: "掌握Docker、Kubernetes等云原生技术栈，提升技术广度",
    deadline: "2025-03-31",
    progress: 40,
    priority: "中",
    status: "进行中",
  },
  {
    id: 3,
    title: "完成3个核心项目",
    description: "作为核心开发者完成3个重要项目，积累项目经验",
    deadline: "2025-12-31",
    progress: 20,
    priority: "高",
    status: "进行中",
  },
]

// 模拟数据 - 技能提升
const skillsToImprove = [
  {
    id: 1,
    name: "前端框架",
    description: "深入学习React新特性和最佳实践",
    currentLevel: 3,
    targetLevel: 5,
    deadline: "2025-04-30",
    progress: 60,
  },
  {
    id: 2,
    name: "性能优化",
    description: "学习Web性能优化技术，提升应用响应速度",
    currentLevel: 2,
    targetLevel: 4,
    deadline: "2025-05-31",
    progress: 30,
  },
  {
    id: 3,
    name: "TypeScript",
    description: "掌握TypeScript高级特性和类型系统",
    currentLevel: 4,
    targetLevel: 5,
    deadline: "2025-02-28",
    progress: 80,
  },
]

// 模拟数据 - 培训计划
const upcomingTrainings = [
  {
    id: 1,
    title: "React性能优化实战",
    type: "线上课程",
    provider: "技术学院",
    startDate: "2024-11-10",
    endDate: "2024-11-24",
    duration: "14天",
    status: "已报名",
  },
  {
    id: 2,
    title: "微服务架构设计",
    type: "线下培训",
    provider: "云服务提供商",
    startDate: "2024-12-05",
    endDate: "2024-12-06",
    duration: "2天",
    status: "待报名",
  },
  {
    id: 3,
    title: "AI应用开发",
    type: "工作坊",
    provider: "技术社区",
    startDate: "2025-01-15",
    endDate: "2025-01-15",
    duration: "1天",
    status: "已报名",
  },
]

export function PersonalPlanning() {
  const [activeTab, setActiveTab] = useState("goals")
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "中",
  })

  // 获取优先级标签样式
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "高":
        return <Badge variant="destructive">高优先级</Badge>
      case "中":
        return <Badge variant="secondary">中优先级</Badge>
      case "低":
        return <Badge variant="outline">低优先级</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  // 获取状态标签样式
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "进行中":
        return <Badge variant="secondary">进行中</Badge>
      case "已完成":
        return <Badge variant="default">已完成</Badge>
      case "已报名":
        return <Badge variant="default">已报名</Badge>
      case "待报名":
        return <Badge variant="outline">待报名</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 获取技能等级显示
  const getSkillLevelDisplay = (level: number) => {
    return "★".repeat(level) + "☆".repeat(5 - level)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>个人发展规划</CardTitle>
          <CardDescription>管理职业目标、技能提升和培训计划</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                职业目标
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                技能提升
              </TabsTrigger>
              <TabsTrigger value="trainings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                培训计划
              </TabsTrigger>
            </TabsList>

            {/* 职业目标 */}
            <TabsContent value="goals" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">我的职业目标</h3>
                <Button onClick={() => setShowAddGoal(!showAddGoal)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  添加目标
                </Button>
              </div>

              {showAddGoal && (
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <h4 className="font-medium">新建职业目标</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">目标标题</label>
                        <Input
                          placeholder="输入目标标题"
                          value={newGoal.title}
                          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">优先级</label>
                        <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({ ...newGoal, priority: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择优先级" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="高">高</SelectItem>
                            <SelectItem value="中">中</SelectItem>
                            <SelectItem value="低">低</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">目标描述</label>
                        <Textarea
                          placeholder="详细描述你的目标..."
                          value={newGoal.description}
                          onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">截止日期</label>
                        <Input
                          type="date"
                          value={newGoal.deadline}
                          onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowAddGoal(false)}>取消</Button>
                      <Button
                        onClick={() => {
                          // 这里可以添加保存逻辑
                          console.log("保存新目标:", newGoal)
                          setShowAddGoal(false)
                          setNewGoal({ title: "", description: "", deadline: "", priority: "中" })
                        }}
                      >
                        保存目标
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {careerGoals.map((goal) => (
                  <Card key={goal.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-base">{goal.title}</h4>
                          <div className="flex gap-2">
                            {getPriorityBadge(goal.priority)}
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            截止日期: {goal.deadline}
                          </span>
                          <span className="flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" />
                            完成进度: {goal.progress}%
                          </span>
                        </div>
                        <Progress value={goal.progress} className="h-2 mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* 技能提升 */}
            <TabsContent value="skills" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">技能提升计划</h3>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  添加技能
                </Button>
              </div>
              <div className="space-y-4">
                {skillsToImprove.map((skill) => (
                  <Card key={skill.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{skill.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{skill.description}</p>
                          <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>当前等级: {getSkillLevelDisplay(skill.currentLevel)}</span>
                            <span>目标等级: {getSkillLevelDisplay(skill.targetLevel)}</span>
                          </div>
                          <Progress value={skill.progress} className="h-2 mt-2" />
                        </div>
                        <div className="flex flex-col gap-2 min-w-[120px]">
                          <div className="text-sm flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            截止日期
                          </span>
                          <div className="font-medium">{skill.deadline}</div>
                          <div className="text-sm text-muted-foreground">完成度: {skill.progress}%</div>
                          <div className="flex gap-2 mt-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* 培训计划 */}
            <TabsContent value="trainings" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">我的培训计划</h3>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  添加培训
                </Button>
              <div>
              <div className="space-y-4">
                {upcomingTrainings.map((training) => (
                  <Card key={training.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{training.title}</h4>
                            {getStatusBadge(training.status)}
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">
                            培训机构: {training.provider}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            类型: {training.type}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            培训时间
                          </span>
                          <div className="font-medium">
                            {training.startDate} - {training.endDate}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            持续时间: {training.duration}
                          </span>
                          <div className="flex gap-2 mt-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
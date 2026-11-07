"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Button } from "@yyc3/ui-enterprise/button"
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Clock,
  Target,
  MessageSquare,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface DashboardData {
  totalSales: number
  totalCustomers: number
  activeProjects: number
  completedTasks: number
  salesGrowth: number
  customerGrowth: number
  projectsGrowth: number
  tasksGrowth: number
  recentActivities: Array<{
    id: number
    type: string
    message: string
    time: string
  }>
}

interface DashboardContentProps {
  data?: DashboardData | null
  isOnline?: boolean
  lastUpdated?: Date
  handleRefresh?: () => void
  handleExport?: () => void
  formatCurrency?: (amount: number) => string
  formatNumber?: (num: number) => string
}

export function DashboardContent({
  data,
  isOnline = true,
  lastUpdated = new Date(),
  handleRefresh,
  handleExport,
  formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`,
  formatNumber = (num: number) => num.toLocaleString(),
}: DashboardContentProps = {}) {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 默认数据
  const defaultData: DashboardData = {
    totalSales: 2847392,
    totalCustomers: 15847,
    activeProjects: 23,
    completedTasks: 156,
    salesGrowth: 12.5,
    customerGrowth: 8.2,
    projectsGrowth: 15.8,
    tasksGrowth: 22.1,
    recentActivities: [
      { id: 1, type: "sale", message: "新订单 #12345 已创建", time: "5分钟前" },
      { id: 2, type: "customer", message: "新客户张先生已注册", time: "10分钟前" },
      { id: 3, type: "task", message: "客户投诉处理已完成", time: "15分钟前" },
      { id: 4, type: "project", message: "项目A阶段1已完成", time: "20分钟前" },
    ],
  }

  const dashboardData = data || defaultData

  const kpiCards = [
    {
      title: "总销售额",
      value: formatCurrency(dashboardData.totalSales),
      change: `+${dashboardData.salesGrowth}%`,
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "本月销售总额",
    },
    {
      title: "客户总数",
      value: formatNumber(dashboardData.totalCustomers),
      change: `+${dashboardData.customerGrowth}%`,
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "活跃客户数量",
    },
    {
      title: "进行中项目",
      value: formatNumber(dashboardData.activeProjects),
      change: `+${dashboardData.projectsGrowth}%`,
      trend: "up",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "当前活跃项目",
    },
    {
      title: "已完成任务",
      value: formatNumber(dashboardData.completedTasks),
      change: `+${dashboardData.tasksGrowth}%`,
      trend: "up",
      icon: CheckCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "本周完成任务",
    },
  ]

  const quickActions = [
    {
      title: "客户管理",
      description: "查看和管理客户信息",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/customers",
    },
    {
      title: "任务管理",
      description: "创建和跟踪任务进度",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/tasks",
    },
    {
      title: "数据分析",
      description: "查看业务数据报表",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/analytics",
    },
    {
      title: "沟通协作",
      description: "团队沟通和协作工具",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/communication",
    },
  ]

  return (
    <div className="space-y-6">
      {/* 状态栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant={isOnline ? "default" : "destructive"} className="text-sm">
            {isOnline ? "在线" : "离线"}
          </Badge>
          <span className="text-sm text-gray-500">最后更新: {lastUpdated.toLocaleTimeString("zh-CN")}</span>
        </div>
        <div className="flex items-center space-x-2">
          {handleRefresh && (
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          )}
          {handleExport && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              导出数据
            </Button>
          )}
        </div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                    <div className="flex items-center mt-1">
                      {card.trend === "up" ? (
                        <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${card.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {card.change}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 快速操作 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              快速操作
            </CardTitle>
            <CardDescription>常用功能快速入口</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(action.href)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.bgColor}`}>
                        <Icon className={`w-5 h-5 ${action.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{action.title}</h4>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              最近活动
            </CardTitle>
            <CardDescription>系统最新动态</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 今日概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            今日概览
          </CardTitle>
          <CardDescription>今天的重要数据和待办事项</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">今日客户咨询</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">89</div>
              <div className="text-sm text-gray-600">已完成任务</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">23</div>
              <div className="text-sm text-gray-600">待处理事项</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardContent

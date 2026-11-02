/**
 * @file 数据看板组件
 * @description 提供数据可视化功能，包括销售趋势、部门绩效、用户活跃度等指标展示
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Input } from "@yyc3/ui/input"
import { Badge } from "@yyc3/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@yyc3/ui/avatar"
import { Separator } from "@yyc3/ui/separator"
import { Progress } from "@yyc3/ui/progress"
import { Search, TrendingUp, TrendingDown, BarChart2, PieChart, LineChart, Users, DollarSign, Activity, Calendar, Download, RefreshCw } from "lucide-react"
import { format } from "date-fns"

// 类型定义
interface MetricCard {
  id: string
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: React.ReactNode
  color: string
}

interface SalesData {
  month: string
  revenue: number
  targets: number
}

interface DepartmentPerformance {
  id: string
  name: string
  performance: number
  target: number
  members: number
  color: string
}

interface UserActivity {
  date: string
  activeUsers: number
  newUsers: number
  loginCount: number
}

interface TaskCompletion {
  category: string
  completed: number
  total: number
  percentage: number
}

interface TopPerformer {
  id: string
  name: string
  avatar: string
  department: string
  score: number
  rank: number
}

// 模拟数据
const metricCardsData: MetricCard[] = [
  {
    id: "1",
    title: "总销售额",
    value: "¥1,234,567",
    change: 12.5,
    trend: "up",
    icon: <DollarSign className="h-5 w-5" />,
    color: "bg-green-100 text-green-700"
  },
  {
    id: "2",
    title: "活跃用户",
    value: 1542,
    change: 8.3,
    trend: "up",
    icon: <Users className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-700"
  },
  {
    id: "3",
    title: "任务完成率",
    value: "87.2%",
    change: -2.1,
    trend: "down",
    icon: <Activity className="h-5 w-5" />,
    color: "bg-yellow-100 text-yellow-700"
  },
  {
    id: "4",
    title: "平均响应时间",
    value: "2.4s",
    change: 1.8,
    trend: "up",
    icon: <Activity className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-700"
  }
]

const salesData: SalesData[] = [
  { month: "1月", revenue: 95000, targets: 100000 },
  { month: "2月", revenue: 120000, targets: 110000 },
  { month: "3月", revenue: 135000, targets: 125000 },
  { month: "4月", revenue: 118000, targets: 120000 },
  { month: "5月", revenue: 142000, targets: 130000 },
  { month: "6月", revenue: 165000, targets: 140000 },
  { month: "7月", revenue: 158000, targets: 150000 },
  { month: "8月", revenue: 172000, targets: 160000 },
  { month: "9月", revenue: 185000, targets: 170000 }
]

const departmentPerformance: DepartmentPerformance[] = [
  { id: "1", name: "技术部", performance: 92, target: 100, members: 15, color: "#4f46e5" },
  { id: "2", name: "市场部", performance: 85, target: 100, members: 8, color: "#10b981" },
  { id: "3", name: "销售部", performance: 96, target: 100, members: 12, color: "#f59e0b" },
  { id: "4", name: "财务部", performance: 78, target: 100, members: 5, color: "#ef4444" },
  { id: "5", name: "人力资源部", performance: 88, target: 100, members: 3, color: "#8b5cf6" }
]

const userActivity: UserActivity[] = [
  { date: "周一", activeUsers: 420, newUsers: 45, loginCount: 1250 },
  { date: "周二", activeUsers: 480, newUsers: 55, loginCount: 1420 },
  { date: "周三", activeUsers: 520, newUsers: 60, loginCount: 1580 },
  { date: "周四", activeUsers: 490, newUsers: 52, loginCount: 1390 },
  { date: "周五", activeUsers: 460, newUsers: 48, loginCount: 1280 },
  { date: "周六", activeUsers: 280, newUsers: 30, loginCount: 750 },
  { date: "周日", activeUsers: 240, newUsers: 25, loginCount: 680 }
]

const taskCompletion: TaskCompletion[] = [
  { category: "开发任务", completed: 89, total: 105, percentage: 84.8 },
  { category: "Bug修复", completed: 45, total: 52, percentage: 86.5 },
  { category: "需求分析", completed: 23, total: 25, percentage: 92 },
  { category: "测试任务", completed: 38, total: 45, percentage: 84.4 }
]

const topPerformers: TopPerformer[] = [
  {
    id: "1",
    name: "张三",
    avatar: "https://ui-avatars.com/api/?name=ZS&background=4a6cf7&color=fff",
    department: "销售部",
    score: 97.5,
    rank: 1
  },
  {
    id: "2",
    name: "李四",
    avatar: "https://ui-avatars.com/api/?name=LS&background=4a6cf7&color=fff",
    department: "技术部",
    score: 96.2,
    rank: 2
  },
  {
    id: "3",
    name: "王五",
    avatar: "https://ui-avatars.com/api/?name=WW&background=4a6cf7&color=fff",
    department: "市场部",
    score: 94.8,
    rank: 3
  },
  {
    id: "4",
    name: "赵六",
    avatar: "https://ui-avatars.com/api/?name=ZL&background=4a6cf7&color=fff",
    department: "技术部",
    score: 93.5,
    rank: 4
  },
  {
    id: "5",
    name: "钱七",
    avatar: "https://ui-avatars.com/api/?name=QQ&background=4a6cf7&color=fff",
    department: "财务部",
    score: 92.1,
    rank: 5
  }
]

// 模拟Button组件
const Button: React.FC<{
  variant?: string;
  size?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ variant, size, className, disabled, onClick, children }) => {
  return (
    <button
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
        ${variant === 'ghost' ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'bg-primary text-white'}
        ${size === 'sm' ? 'h-9' : ''}
        ${className || ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function DataDashboard() {
  // 状态管理
  const [timeRange, setTimeRange] = useState("quarter")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  // 模拟数据刷新
  const handleRefresh = () => {
    setRefreshing(true)
    // 模拟网络请求延迟
    setTimeout(() => {
      setRefreshing(false)
      setCurrentDate(new Date())
    }, 1000)
  }

  // 格式化日期
  const formattedDate = format(currentDate, "yyyy年MM月dd日 HH:mm")

  // 简单的柱状图渲染函数
  const renderBarChart = (data: any[], valueKey: string, labelKey: string, color: string) => {
    const maxValue = Math.max(...data.map(item => item[valueKey]))
    
    return (
      <div className="h-[250px] flex items-end justify-between p-2">
        {data.map((item, index) => {
          const heightPercentage = (item[valueKey] / maxValue) * 100
          return (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div 
                className={`w-full rounded-t-lg transition-all duration-300 ease-out flex justify-center items-end pb-2 text-xs font-medium text-white`}
                style={{
                  height: `${heightPercentage}%`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
              >
                {heightPercentage > 15 && item[valueKey]}
              </div>
              <span className="text-xs text-center text-muted-foreground truncate w-full">{item[labelKey]}</span>
            </div>
          )
        })}
      </div>
    )
  }

  // 简单的折线图渲染函数
  const renderLineChart = (data: any[], valueKey: string, labelKey: string, color: string) => {
    const maxValue = Math.max(...data.map(item => item[valueKey]))
    const stepX = 100 / (data.length - 1)
    
    const points = data.map((item, index) => {
      const x = `${index * stepX}%`
      const y = `${100 - (item[valueKey] / maxValue) * 100}%`
      return { x, y, value: item[valueKey] }
    })

    const linePath = `M ${points[0].x} ${points[0].y} ${points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`
    
    return (
      <div className="h-[250px] relative p-2">
        {/* 网格线 */}
        {[0.25, 0.5, 0.75].map((ratio, index) => (
          <line 
            key={index} 
            className="absolute left-0 right-0 border-t border-dashed border-gray-200"
            style={{ top: `${ratio * 100}%` }}
          />
        ))}
        
        {/* 折线 */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          {points.map((point, index) => (
            <>
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="2"
                fill={color}
              />
              {point.y < 85 && (
                <text
                  key={`text-${index}`}
                  x={point.x}
                  y={parseInt(point.y) - 5}
                  textAnchor="middle"
                  fontSize="2"
                  fill="currentColor"
                >
                  {point.value}
                </text>
              )}
            </>
          ))}
        </svg>
        
        {/* X轴标签 */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-muted-foreground truncate">{item[labelKey]}</span>
          ))}
        </div>
      </div>
    )
  }

  // 简单的饼图渲染函数
  const renderPieChart = (data: any[], valueKey: string, labelKey: string, colors: string[]) => {
    const total = data.reduce((sum, item) => sum + item[valueKey], 0)
    let startAngle = 0
    
    return (
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative w-[200px] h-[200px] flex items-center justify-center">
          {data.map((item, index) => {
            const value = item[valueKey]
            const percentage = (value / total) * 100
            const endAngle = startAngle + (percentage / 100) * 360
            
            // 计算饼图扇形的路径
            const radius = 80
            const centerX = 100
            const centerY = 100
            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
            
            const startRad = (startAngle - 90) * (Math.PI / 180)
            const endRad = (endAngle - 90) * (Math.PI / 180)
            
            const startX = centerX + radius * Math.cos(startRad)
            const startY = centerY + radius * Math.sin(startRad)
            const endX = centerX + radius * Math.cos(endRad)
            const endY = centerY + radius * Math.sin(endRad)
            
            const pathData = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`
            
            const currentStartAngle = startAngle
            startAngle = endAngle
            
            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                stroke="white"
                strokeWidth="2"
              />
            )
          })}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold">{total}</span>
            <span className="text-xs text-muted-foreground">总计</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-3 w-full">
          {data.map((item, index) => {
            const percentage = ((item[valueKey] / total) * 100).toFixed(1)
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm font-medium">{item[labelKey]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{item[valueKey]}</span>
                  <span className="text-xs text-muted-foreground">{percentage}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">数据看板</h1>
          <p className="text-muted-foreground">最后更新: {formattedDate}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <SelectValue placeholder="选择时间范围" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
                <SelectItem value="quarter">本季度</SelectItem>
                <SelectItem value="year">本年</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="选择部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部部门</SelectItem>
                {departmentPerformance.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-9 gap-1" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              刷新
            </Button>
            <Button variant="ghost" size="sm" className="h-9 gap-1">
              <Download className="h-4 w-4" />
              导出
            </Button>
          </div>
        </div>
      </div>

      {/* 指标卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCardsData.map(card => (
          <Card key={card.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <div className={`p-2 rounded-full ${card.color}`}>{card.icon}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{card.value}</span>
                <div className={`flex items-center text-xs gap-1 ${card.trend === 'up' ? 'text-green-600' : card.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                  {card.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                  {card.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                  {card.change > 0 && '+'}
                  {card.change}%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.trend === 'up' ? '较上期增长' : card.trend === 'down' ? '较上期下降' : '与上期持平'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图表区域 */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="sales">销售趋势</TabsTrigger>
          <TabsTrigger value="performance">部门绩效</TabsTrigger>
          <TabsTrigger value="activity">用户活跃度</TabsTrigger>
          <TabsTrigger value="tasks">任务完成率</TabsTrigger>
        </TabsList>

        {/* 销售趋势 */}
        <TabsContent value="sales" className="mt-0 animate-in fade-in-50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>销售额趋势</CardTitle>
                  <Badge variant="outline">月度数据</Badge>
                </div>
                <CardDescription>近9个月销售额与目标对比</CardDescription>
              </CardHeader>
              <CardContent>
                {renderLineChart(salesData, "revenue", "month", "#4f46e5")}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>销售目标完成率</CardTitle>
                <CardDescription>各月目标完成情况
              </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {salesData.map((item, index) => {
                    const completionRate = (item.revenue / item.target) * 100
                    const isOverTarget = completionRate > 100
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.month}</span>
                          <span className={`text-sm font-bold ${isOverTarget ? 'text-green-600' : 'text-blue-600'}`}>
                            {completionRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="space-y-1">
                          <Progress 
                            value={Math.min(completionRate, 100)} 
                            className={isOverTarget ? "bg-blue-100" : ""}
                          />
                          {isOverTarget && (
                            <Progress 
                              value={completionRate - 100} 
                              className="bg-green-100 h-1.5"
                            />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>目标: ¥{item.target.toLocaleString()}</span>
                          <span>实际: ¥{item.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 部门绩效 */}
        <TabsContent value="performance" className="mt-0 animate-in fade-in-50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>部门绩效对比</CardTitle>
                <CardDescription>各部门绩效完成情况
              </CardDescription>
              </CardHeader>
              <CardContent>
                {renderBarChart(
                  departmentPerformance,
                  "performance",
                  "name",
                  "#4f46e5"
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>部门人员分布
              </CardTitle>
              <CardDescription>各部门成员数量统计
              </CardDescription>
              </CardHeader>
              <CardContent>
                {renderPieChart(
                  departmentPerformance,
                  "members",
                  "name",
                  departmentPerformance.map(d => d.color)
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 用户活跃度 */}
        <TabsContent value="activity" className="mt-0 animate-in fade-in-50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>用户活跃趋势</CardTitle>
                <CardDescription>近7天活跃用户与登录次数
              </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-end justify-between p-2">
                  {userActivity.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full flex flex-col items-center gap-1">
                        <div 
                          className="w-2/3 rounded-t-lg transition-all duration-300 ease-out bg-blue-500 flex justify-center items-end pb-2 text-xs font-medium text-white"
                          style={{
                            height: `${(item.activeUsers / Math.max(...userActivity.map(u => u.activeUsers))) * 100}%`,
                            minHeight: '4px'
                          }}
                        >
                          {item.activeUsers}
                        </div>
                        <div 
                          className="w-2/3 rounded-t-lg transition-all duration-300 ease-out bg-green-500 flex justify-center items-end pb-2 text-xs font-medium text-white"
                          style={{
                            height: `${(item.loginCount / Math.max(...userActivity.map(u => u.loginCount))) * 100}%`,
                            minHeight: '4px'
                          }}
                        >
                          {item.loginCount}
                        </div>
                      </div>
                      <span className="text-xs text-center text-muted-foreground truncate w-full">{item.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-6 border-t pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">活跃用户</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">登录次数</span>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>新增用户统计</CardTitle>
                <CardDescription>每日新增用户数量</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBarChart(
                  userActivity,
                  "newUsers",
                  "date",
                  "#10b981"
                )}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">本周新增用户</span>
                    <span className="font-bold">
                      {userActivity.reduce((sum, item) => sum + item.newUsers, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">平均每日新增</span>
                    <span className="font-bold">
                      {(userActivity.reduce((sum, item) => sum + item.newUsers, 0) / userActivity.length).toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 任务完成率 */}
        <TabsContent value="tasks" className="mt-0 animate-in fade-in-50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>任务完成情况</CardTitle>
                <CardDescription>各类任务完成率统计</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {taskCompletion.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm font-bold">
                          {item.completed}/{item.total} ({item.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={item.percentage} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>未完成: {item.total - item.completed}</span>
                        <span>
                          {item.percentage >= 90 ? (
                            <Badge variant="default">优秀</Badge>
                          ) : item.percentage >= 75 ? (
                            <Badge variant="outline">良好</Badge>
                          ) : (
                            <Badge variant="destructive">需改进</Badge>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>优秀员工</CardTitle>
                <CardDescription>绩效排名前5的员工</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                  {topPerformers.map((performer) => (
                    <div key={performer.id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 text-primary font-bold rounded-full">
                          {performer.rank}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={performer.avatar} alt={performer.name} />
                          <AvatarFallback>{performer.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{performer.name}</p>
                          <p className="text-xs text-muted-foreground">{performer.department}</p>
                        </div>
                      </div>
                      <Badge className={`text-lg h-8 ${performer.rank <= 3 ? 'bg-primary' : 'bg-secondary'}`}>
                        {performer.score}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
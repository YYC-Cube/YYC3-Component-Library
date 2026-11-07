/**
 * @file 统计分析组件
 * @description 提供系统数据的统计分析和可视化展示功能
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui-enterprise/select"
import { Button } from "@yyc3/ui-enterprise/button"
import { Input } from "@yyc3/ui-enterprise/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui-enterprise/table"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@yyc3/ui-enterprise/avatar"
import { Progress } from "@yyc3/ui-enterprise/progress"
import { BarChart3, PieChart, LineChart, TrendingUp, Filter, Download, Search, Calendar, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

// 类型定义
interface StatisticalData {
  id: string
  name: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  category: string
}

interface DepartmentPerformance {
  id: string
  name: string
  completionRate: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  averageScore: number
}

interface UserPerformance {
  id: string
  name: string
  avatar: string
  department: string
  completedTasks: number
  efficiency: number
  qualityScore: number
  attendanceRate: number
}

interface TimeSeriesData {
  date: string
  value: number
  target: number
}

interface CategoryDistribution {
  name: string
  value: number
  color: string
}

// 模拟数据
const departmentPerformanceData: DepartmentPerformance[] = [
  { id: "1", name: "技术部", completionRate: 89, totalTasks: 156, completedTasks: 139, pendingTasks: 17, averageScore: 92 },
  { id: "2", name: "市场部", completionRate: 76, totalTasks: 98, completedTasks: 74, pendingTasks: 24, averageScore: 85 },
  { id: "3", name: "销售部", completionRate: 92, totalTasks: 203, completedTasks: 186, pendingTasks: 17, averageScore: 94 },
  { id: "4", name: "财务部", completionRate: 95, totalTasks: 67, completedTasks: 64, pendingTasks: 3, averageScore: 96 },
  { id: "5", name: "人力资源部", completionRate: 83, totalTasks: 45, completedTasks: 37, pendingTasks: 8, averageScore: 88 }
]

const userPerformanceData: UserPerformance[] = [
  { id: "1", name: "张三", avatar: "https://ui-avatars.com/api/?name=ZS&background=4a6cf7&color=fff", department: "技术部", completedTasks: 45, efficiency: 92, qualityScore: 94, attendanceRate: 98 },
  { id: "2", name: "李四", avatar: "https://ui-avatars.com/api/?name=LS&background=4a6cf7&color=fff", department: "技术部", completedTasks: 38, efficiency: 85, qualityScore: 89, attendanceRate: 95 },
  { id: "3", name: "王五", avatar: "https://ui-avatars.com/api/?name=WW&background=4a6cf7&color=fff", department: "市场部", completedTasks: 28, efficiency: 88, qualityScore: 87, attendanceRate: 96 },
  { id: "4", name: "赵六", avatar: "https://ui-avatars.com/api/?name=ZL&background=4a6cf7&color=fff", department: "销售部", completedTasks: 56, efficiency: 96, qualityScore: 92, attendanceRate: 97 },
  { id: "5", name: "钱七", avatar: "https://ui-avatars.com/api/?name=QQ&background=4a6cf7&color=fff", department: "财务部", completedTasks: 42, efficiency: 94, qualityScore: 98, attendanceRate: 100 },
  { id: "6", name: "孙八", avatar: "https://ui-avatars.com/api/?name=SB&background=4a6cf7&color=fff", department: "人力资源部", completedTasks: 23, efficiency: 82, qualityScore: 85, attendanceRate: 94 }
]

const timeSeriesData: TimeSeriesData[] = [
  { date: "2024-09", value: 120, target: 100 },
  { date: "2024-10", value: 145, target: 130 },
  { date: "2024-11", value: 178, target: 160 },
  { date: "2024-12", value: 192, target: 180 },
  { date: "2025-01", value: 215, target: 200 },
  { date: "2025-02", value: 245, target: 220 },
  { date: "2025-03", value: 268, target: 250 }
]

const categoryDistributionData: CategoryDistribution[] = [
  { name: "技术开发", value: 35, color: "#3b82f6" },
  { name: "市场推广", value: 25, color: "#8b5cf6" },
  { name: "销售业绩", value: 20, color: "#ec4899" },
  { name: "财务管理", value: 10, color: "#10b981" },
  { name: "人力资源", value: 10, color: "#f59e0b" }
]

const keyMetricsData: StatisticalData[] = [
  { id: "1", name: "总任务数", value: 569, change: 12, trend: 'up', category: "任务" },
  { id: "2", name: "完成率", value: 86, change: -3, trend: 'down', category: "效率" },
  { id: "3", name: "平均响应时间", value: 4.5, change: 5, trend: 'up', category: "效率" },
  { id: "4", name: "客户满意度", value: 92, change: 2, trend: 'up', category: "质量" },
  { id: "5", name: "逾期任务", value: 18, change: -5, trend: 'down', category: "风险" },
  { id: "6", name: "资源利用率", value: 78, change: 3, trend: 'up', category: "效率" }
]

// 辅助函数
const getTrendIcon = (trend: 'up' | 'down' | 'stable', change: number) => {
  if (trend === 'up') {
    return (
      <div className="flex items-center text-green-600">
        <ArrowUpRight className="h-4 w-4 mr-1" />
        <span className="text-sm">+{change}%</span>
      </div>
    )
  } else if (trend === 'down') {
    return (
      <div className="flex items-center text-red-600">
        <ArrowDownRight className="h-4 w-4 mr-1" />
        <span className="text-sm">{change}%</span>
      </div>
    )
  }
  return <span className="text-sm text-gray-500">{change}%</span>
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 简单图表渲染函数
const renderBarChart = (data: any[]) => {
  const maxValue = Math.max(...data.map(item => item.value)) * 1.2
  
  return (
    <div className="h-64 flex items-end justify-between p-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center justify-end w-16">
          <div 
            className="w-full bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600" 
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          />
          <span className="mt-2 text-xs font-medium text-gray-700">{item.name}</span>
          <span className="text-xs text-gray-500">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

const renderLineChart = (data: TimeSeriesData[]) => {
  const maxValue = Math.max(...data.map(item => Math.max(item.value, item.target))) * 1.2
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((item.value / maxValue) * 100)
    return { x, y, value: item.value }
  })
  
  const targetPoints = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((item.target / maxValue) * 100)
    return { x, y, value: item.target }
  })
  
  const linePath = points.map((p, i) => `${p.x}% ${p.y}%`).join(', ')
  const targetLinePath = targetPoints.map((p, i) => `${p.x}% ${p.y}%`).join(', ')
  
  return (
    <div className="h-64 relative p-4">
      {/* 坐标轴 */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200" />
      <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-gray-200" />
      
      {/* 实际值线 */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path 
          d={`M ${linePath}`} 
          fill="none" 
          stroke="#3b82f6" 
          strokeWidth="2" 
        />
        {points.map((point, index) => (
          <circle 
            key={index} 
            cx={point.x} 
            cy={point.y} 
            r="1.5" 
            fill="#3b82f6" 
            className="transition-all duration-200 hover:r-3 hover:fill-blue-700"
          />
        ))}
      </svg>
      
      {/* 目标值线 */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path 
          d={`M ${targetLinePath}`} 
          fill="none" 
          stroke="#94a3b8" 
          strokeWidth="1.5" 
          strokeDasharray="5,5" 
        />
      </svg>
      
      {/* X轴标签 */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-between">
        {data.map((item, index) => (
          <span key={index} className="text-xs text-gray-500">{item.date.slice(5)}</span>
        ))}
      </div>
    </div>
  )
}

const renderPieChart = (data: CategoryDistribution[]) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let startAngle = 0
  
  const segments = data.map((item) => {
    const percentage = item.value / total
    const angle = percentage * 360
    const segment = {
      ...item,
      startAngle,
      endAngle: startAngle + angle,
      percentage
    }
    startAngle += angle
    return segment
  })
  
  return (
    <div className="h-64 flex items-center justify-center">
      <div className="relative w-56 h-56">
        {/* 饼图 */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {segments.map((segment, index) => {
            const startRad = (segment.startAngle - 90) * (Math.PI / 180)
            const endRad = (segment.endAngle - 90) * (Math.PI / 180)
            const largeArcFlag = segment.percentage > 0.5 ? 1 : 0
            
            const x1 = 50 + 40 * Math.cos(startRad)
            const y1 = 50 + 40 * Math.sin(startRad)
            const x2 = 50 + 40 * Math.cos(endRad)
            const y2 = 50 + 40 * Math.sin(endRad)
            
            const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
            
            return (
              <path 
                key={index} 
                d={path} 
                fill={segment.color} 
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            )
          })}
        </svg>
        
        {/* 中心圆 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white flex items-center justify-center">
          <span className="text-xl font-bold text-gray-700">{total}%</span>
        </div>
      </div>
      
      {/* 图例 */}
      <div className="ml-8 space-y-3">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-sm text-gray-700">{segment.name}</span>
            <span className="text-sm text-gray-500">({segment.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StatisticalAnalysis() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("quarter")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("completionRate")
  const [filteredDepartmentData, setFilteredDepartmentData] = useState(departmentPerformanceData)
  const [filteredUserData, setFilteredUserData] = useState(userPerformanceData)

  // 筛选和排序数据
  useEffect(() => {
    let filtered = [...departmentPerformanceData]
    
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(dept => dept.id === selectedDepartment)
    }
    
    filtered.sort((a, b) => {
      if (sortOption === "completionRate") {
        return b.completionRate - a.completionRate
      } else if (sortOption === "totalTasks") {
        return b.totalTasks - a.totalTasks
      } else if (sortOption === "averageScore") {
        return b.averageScore - a.averageScore
      }
      return 0
    })
    
    setFilteredDepartmentData(filtered)
  }, [selectedDepartment, sortOption])

  useEffect(() => {
    let filtered = [...userPerformanceData]
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedDepartment !== "all") {
      const deptName = departmentPerformanceData.find(d => d.id === selectedDepartment)?.name
      filtered = filtered.filter(user => user.department === deptName)
    }
    
    setFilteredUserData(filtered)
  }, [searchTerm, selectedDepartment])

  return (
    <div className="space-y-6">
      {/* 页面标题和控制区 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">统计分析</h1>
          <p className="text-muted-foreground mt-1">系统数据分析和绩效统计</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年度</SelectItem>
              <SelectItem value="custom">自定义</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {keyMetricsData.map(metric => (
          <Card key={metric.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium">{metric.name}</CardTitle>
                {getTrendIcon(metric.trend, metric.change)}
              </div>
              <CardDescription>{metric.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(metric.value)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图表展示区 */}
      <Tabs defaultValue="department" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="department">部门绩效</TabsTrigger>
          <TabsTrigger value="user">员工表现</TabsTrigger>
          <TabsTrigger value="trend">趋势分析</TabsTrigger>
          <TabsTrigger value="distribution">分布统计</TabsTrigger>
        </TabsList>

        {/* 部门绩效标签页 */}
        <TabsContent value="department" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-xl font-semibold">部门绩效分析</h3>
            <div className="flex items-center gap-3">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部部门</SelectItem>
                  {departmentPerformanceData.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completionRate">按完成率</SelectItem>
                  <SelectItem value="totalTasks">按任务数量</SelectItem>
                  <SelectItem value="averageScore">按平均得分</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>部门任务完成情况</CardTitle>
              </CardHeader>
              <CardContent>
                {renderBarChart(filteredDepartmentData.map(dept => ({
                  name: dept.name,
                  value: dept.completionRate
                })))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>部门绩效概览</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {filteredDepartmentData.slice(0, 3).map(dept => (
                  <div key={dept.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{dept.name}</span>
                      <span className="text-sm font-semibold">{dept.completionRate}%</span>
                    </div>
                    <Progress value={dept.completionRate} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>已完成: {dept.completedTasks}</span>
                      <span>待处理: {dept.pendingTasks}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>部门详细数据</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>部门名称</TableHead>
                      <TableHead>总任务数</TableHead>
                      <TableHead>已完成</TableHead>
                      <TableHead>待处理</TableHead>
                      <TableHead>完成率</TableHead>
                      <TableHead>平均得分</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartmentData.map(dept => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>{dept.totalTasks}</TableCell>
                        <TableCell>{dept.completedTasks}</TableCell>
                        <TableCell>{dept.pendingTasks}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={dept.completionRate >= 90 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                              {dept.completionRate}%
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{dept.averageScore}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 员工表现标签页 */}
        <TabsContent value="user" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-xl font-semibold">员工表现分析</h3>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="搜索员工或部门..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>员工绩效排行</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>员工信息</TableHead>
                      <TableHead>部门</TableHead>
                      <TableHead>完成任务</TableHead>
                      <TableHead>工作效率</TableHead>
                      <TableHead>质量评分</TableHead>
                      <TableHead>出勤率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUserData.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{user.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{user.completedTasks}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={user.efficiency} className="h-2 w-20" />
                            <span className="text-sm font-medium">{user.efficiency}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={user.qualityScore >= 90 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                            {user.qualityScore}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={user.attendanceRate >= 95 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                            {user.attendanceRate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 趋势分析标签页 */}
        <TabsContent value="trend" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-xl font-semibold">业务趋势分析</h3>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>业绩目标完成趋势</CardTitle>
              <CardDescription>实际值与目标值对比</CardDescription>
            </CardHeader>
            <CardContent>
              {renderLineChart(timeSeriesData)}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>月度环比增长</CardTitle>
              </CardHeader>
              <CardContent>
                {renderBarChart([
                  { name: "9月", value: 12 },
                  { name: "10月", value: 21 },
                  { name: "11月", value: 23 },
                  { name: "12月", value: 8 },
                  { name: "1月", value: 12 },
                  { name: "2月", value: 14 },
                  { name: "3月", value: 9 }
                ])}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>季度同比增长</CardTitle>
              </CardHeader>
              <CardContent>
                {renderBarChart([
                  { name: "Q1", value: 18 },
                  { name: "Q2", value: 25 },
                  { name: "Q3", value: 32 },
                  { name: "Q4", value: 41 }
                ])}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 分布统计标签页 */}
        <TabsContent value="distribution" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-xl font-semibold">资源分布统计</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>业务类别分布</CardTitle>
              </CardHeader>
              <CardContent>
                {renderPieChart(categoryDistributionData)}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>资源分配详情</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {categoryDistributionData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>任务状态分布</CardTitle>
              </CardHeader>
              <CardContent>
                {renderBarChart([
                  { name: "待处理", value: 120 },
                  { name: "进行中", value: 180 },
                  { name: "审核中", value: 50 },
                  { name: "已完成", value: 350 },
                  { name: "已阻塞", value: 25 }
                ])}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>优先级分布</CardTitle>
              </CardHeader>
              <CardContent>
                {renderBarChart([
                  { name: "低", value: 150 },
                  { name: "中", value: 280 },
                  { name: "高", value: 120 },
                  { name: "紧急", value: 45 }
                ])}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

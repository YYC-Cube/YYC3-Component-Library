/**
 * @file 营销策划组件
 * @description 提供营销活动的策划、管理和数据分析功能，支持活动的创建、编辑、状态管理
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Input } from "@yyc3/ui-enterprise/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui-enterprise/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui-enterprise/table"
import { ScrollArea } from "@yyc3/ui-enterprise/scroll-area"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@yyc3/ui-enterprise/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts"
import { Calendar, TrendingUp, BarChart2, PieChart as PieChartIcon, Plus, Search, Filter, ChevronDown, MoreHorizontal, Edit, Trash2, Eye, CheckCircle, Clock, AlertCircle, ArrowUpRight, X } from "lucide-react"

// 模拟数据 - 营销活动列表
const marketingActivities = [
  {
    id: "mkt001",
    name: "Q4新品上市推广",
    type: "产品推广",
    department: "市场部",
    manager: "张明",
    startDate: "2024-10-20",
    endDate: "2024-11-30",
    budget: 150000,
    status: "未开始",
    progress: 0,
    expectedROI: 250,
    actualROI: 0,
    channels: ["社交媒体", "线下活动", "KOL合作"],
    description: "第四季度新品上市的全方位推广活动，包括线上线下多渠道营销"
  },
  {
    id: "mkt002",
    name: "双11促销活动",
    type: "促销活动",
    department: "销售部",
    manager: "李华",
    startDate: "2024-10-15",
    endDate: "2024-11-15",
    budget: 200000,
    status: "进行中",
    progress: 45,
    expectedROI: 300,
    actualROI: 180,
    channels: ["电商平台", "邮件营销", "短信营销"],
    description: "双11购物节促销活动，提供多种优惠和折扣"
  },
  {
    id: "mkt003",
    name: "品牌形象提升计划",
    type: "品牌建设",
    department: "市场部",
    manager: "王芳",
    startDate: "2024-09-01",
    endDate: "2024-12-31",
    budget: 300000,
    status: "进行中",
    progress: 60,
    expectedROI: 150,
    actualROI: 90,
    channels: ["广告投放", "公关活动", "内容营销"],
    description: "长期品牌形象提升计划，增强品牌知名度和美誉度"
  },
  {
    id: "mkt004",
    name: "客户忠诚度计划",
    type: "客户维护",
    department: "客户关系部",
    manager: "赵强",
    startDate: "2024-08-15",
    endDate: "2024-11-15",
    budget: 80000,
    status: "进行中",
    progress: 75,
    expectedROI: 200,
    actualROI: 220,
    channels: ["会员营销", "社群运营", "专属活动"],
    description: "针对现有客户的忠诚度提升计划，增加复购和推荐"
  },
  {
    id: "mkt005",
    name: "暑期产品推广",
    type: "产品推广",
    department: "市场部",
    manager: "刘敏",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    budget: 120000,
    status: "已完成",
    progress: 100,
    expectedROI: 280,
    actualROI: 320,
    channels: ["校园活动", "社交媒体", "线下体验"],
    description: "暑期针对年轻群体的产品推广活动"
  }
]

// 模拟数据 - 活动效果分析
const campaignEffectivenessData = [
  { name: "Q4新品", 投入: 150000, 产出: 0, ROI: 0 },
  { name: "双11促销", 投入: 90000, 产出: 162000, ROI: 180 },
  { name: "品牌提升", 投入: 180000, 产出: 162000, ROI: 90 },
  { name: "忠诚度计划", 投入: 60000, 产出: 132000, ROI: 220 },
  { name: "暑期推广", 投入: 120000, 产出: 384000, ROI: 320 }
]

// 模拟数据 - 渠道分布
const channelDistributionData = [
  { name: "社交媒体", value: 35, color: "#3b82f6" },
  { name: "电商平台", value: 25, color: "#10b981" },
  { name: "线下活动", value: 20, color: "#f59e0b" },
  { name: "内容营销", value: 15, color: "#8b5cf6" },
  { name: "其他渠道", value: 5, color: "#6b7280" }
]

// 模拟数据 - 月度营销趋势
const monthlyTrendData = [
  { month: "1月", budget: 80000, actual: 75000 },
  { month: "2月", budget: 90000, actual: 88000 },
  { month: "3月", budget: 100000, actual: 95000 },
  { month: "4月", budget: 110000, actual: 105000 },
  { month: "5月", budget: 115000, actual: 112000 },
  { month: "6月", budget: 120000, actual: 125000 },
  { month: "7月", budget: 130000, actual: 135000 },
  { month: "8月", budget: 140000, actual: 138000 },
  { month: "9月", budget: 150000, actual: 148000 },
  { month: "10月", budget: 180000, actual: 165000 }
]

// 活动状态选项
const activityStatuses = [
  { value: "all", label: "全部状态" },
  { value: "未开始", label: "未开始" },
  { value: "进行中", label: "进行中" },
  { value: "已完成", label: "已完成" },
  { value: "已暂停", label: "已暂停" },
  { value: "已取消", label: "已取消" }
]

// 活动类型选项
const activityTypes = [
  { value: "all", label: "全部类型" },
  { value: "产品推广", label: "产品推广" },
  { value: "促销活动", label: "促销活动" },
  { value: "品牌建设", label: "品牌建设" },
  { value: "客户维护", label: "客户维护" },
  { value: "市场调研", label: "市场调研" }
]

// 格式化金额
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0
  }).format(amount)
}

// 格式化百分比
const formatPercentage = (value: number) => {
  return `${value}%`
}

// 格式化ROI
const formatROI = (value: number) => {
  return `${value}%`
}

export function MarketingPlanning() {
  const [activeTab, setActiveTab] = useState("activities")
  const [activities, setActivities] = useState(marketingActivities)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [filteredActivities, setFilteredActivities] = useState(marketingActivities)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState("view") // view, create, edit

  // 过滤活动列表
  useEffect(() => {
    let result = activities
    
    // 搜索过滤
    if (searchTerm) {
      result = result.filter(activity => 
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.manager.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // 状态过滤
    if (statusFilter !== "all") {
      result = result.filter(activity => activity.status === statusFilter)
    }
    
    // 类型过滤
    if (typeFilter !== "all") {
      result = result.filter(activity => activity.type === typeFilter)
    }
    
    setFilteredActivities(result)
  }, [searchTerm, statusFilter, typeFilter, activities])

  // 处理活动详情查看
  const handleViewActivity = (activity: any) => {
    setSelectedActivity(activity)
    setDialogMode("view")
    setIsActivityDialogOpen(true)
  }

  // 处理创建新活动
  const handleCreateActivity = () => {
    setSelectedActivity(null)
    setDialogMode("create")
    setIsActivityDialogOpen(true)
  }

  // 处理编辑活动
  const handleEditActivity = (activity: any) => {
    setSelectedActivity(activity)
    setDialogMode("edit")
    setIsActivityDialogOpen(true)
  }

  // 处理删除活动
  const handleDeleteActivity = (activityId: string) => {
    if (window.confirm("确定要删除这个活动吗？")) {
      setActivities(prev => prev.filter(activity => activity.id !== activityId))
    }
  }

  // 获取状态对应的徽章样式
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "未开始":
        return { variant: "outline" as const, className: "text-blue-600 bg-blue-50 border-blue-200" }
      case "进行中":
        return { variant: "secondary" as const, className: "text-green-600 bg-green-50 border-green-200" }
      case "已完成":
        return { variant: "secondary" as const, className: "text-purple-600 bg-purple-50 border-purple-200" }
      case "已暂停":
        return { variant: "secondary" as const, className: "text-yellow-600 bg-yellow-50 border-yellow-200" }
      case "已取消":
        return { variant: "secondary" as const, className: "text-red-600 bg-red-50 border-red-200" }
      default:
        return { variant: "outline" as const, className: "" }
    }
  }

  // 获取状态对应的图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "未开始":
        return <Clock className="h-3.5 w-3.5 mr-1" />
      case "进行中":
        return <TrendingUp className="h-3.5 w-3.5 mr-1" />
      case "已完成":
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />
      case "已暂停":
        return <Clock className="h-3.5 w-3.5 mr-1" />
      case "已取消":
        return <X className="h-3.5 w-3.5 mr-1" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              营销策划
            </CardTitle>
            <CardDescription>
              营销活动的策划、管理和效果分析
            </CardDescription>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleCreateActivity}>
              <Plus className="mr-2 h-4 w-4" />
              新建活动
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activities" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="activities">活动列表</TabsTrigger>
            <TabsTrigger value="analysis">数据分析</TabsTrigger>
            <TabsTrigger value="channels">渠道分析</TabsTrigger>
            <TabsTrigger value="trends">趋势报告</TabsTrigger>
          </TabsList>
          
          {/* 活动列表标签内容 */}
          <TabsContent value="activities">
            <div className="space-y-4">
              {/* 搜索和筛选区域 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="搜索活动名称、描述..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="活动状态" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="活动类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    高级筛选
                  </Button>
                </div>
              </div>
              
              {/* 活动统计卡片 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">总活动数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activities.length}</div>
                    <p className="text-xs text-gray-500 mt-1">所有营销活动总数</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">进行中活动</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{activities.filter(a => a.status === '进行中').length}</div>
                    <p className="text-xs text-gray-500 mt-1">当前正在执行的活动</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">总预算</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(activities.reduce((sum, a) => sum + a.budget, 0))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">所有活动预算总额</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* 活动列表表格 */}
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>活动名称</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>负责人</TableHead>
                          <TableHead>时间范围</TableHead>
                          <TableHead>预算</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>进度</TableHead>
                          <TableHead>ROI</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredActivities.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">{activity.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{activity.type}</Badge>
                            </TableCell>
                            <TableCell>{activity.manager}</TableCell>
                            <TableCell>{activity.startDate} - {activity.endDate}</TableCell>
                            <TableCell>{formatCurrency(activity.budget)}</TableCell>
                            <TableCell>
                              <Badge {...getStatusBadge(activity.status)} className={getStatusBadge(activity.status).className}>
                                {getStatusIcon(activity.status)}
                                {activity.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${activity.status === '进行中' ? 'bg-green-500' : activity.status === '已完成' ? 'bg-purple-500' : 'bg-gray-300'}`}
                                  style={{ width: `${activity.progress}%` }}
                                />
                              </div>
                              <span className="text-xs ml-1">{activity.progress}%</span>
                            </TableCell>
                            <TableCell>
                              {activity.actualROI > 0 
                                ? <span className="font-medium text-green-600">{formatROI(activity.actualROI)}</span>
                                : activity.status === '未开始' 
                                  ? <span className="text-gray-500">未开始</span>
                                  : <span className="font-medium text-blue-600">预计 {formatROI(activity.expectedROI)}</span>
                              }
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleViewActivity(activity)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditActivity(activity)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteActivity(activity.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* 数据分析标签内容 */}
          <TabsContent value="analysis" className="space-y-6">
            {/* 活动效果分析图表 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  活动效果分析
                </CardTitle>
                <CardDescription>各营销活动的投入产出分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignEffectivenessData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                      <RechartsTooltip formatter={(value: number, name: string) => {
                        if (name === 'ROI') return formatROI(value)
                        return formatCurrency(value)
                      }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="投入" name="投入" fill="#3b82f6" />
                      <Bar yAxisId="left" dataKey="产出" name="产出" fill="#8b5cf6" />
                      <Line yAxisId="right" type="monotone" dataKey="ROI" name="ROI" stroke="#10b981" strokeWidth={2} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* 活动ROI排行 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  活动ROI排行
                </CardTitle>
                <CardDescription>已完成活动的投资回报率排名</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities
                    .filter(a => a.status === '已完成')
                    .sort((a, b) => b.actualROI - a.actualROI)
                    .map((activity, index) => (
                      <div key={activity.id} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{activity.name}</span>
                            <span className="text-green-600 font-bold">{formatROI(activity.actualROI)}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-green-500"
                              style={{ width: `${Math.min(100, activity.actualROI / 4)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
            
            {/* 预算执行情况 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  预算执行情况
                </CardTitle>
                <CardDescription>进行中活动的预算使用情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities
                    .filter(a => a.status === '进行中')
                    .map((activity) => {
                      // 模拟预算使用情况
                      const budgetUsed = activity.budget * (activity.progress / 100)
                      const budgetUsageRate = (budgetUsed / activity.budget) * 100
                      
                      return (
                        <div key={activity.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{activity.name}</span>
                            <span className="text-sm">
                              {formatCurrency(budgetUsed)} / {formatCurrency(activity.budget)} ({formatPercentage(budgetUsageRate)})
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${budgetUsageRate > 90 ? 'bg-red-500' : budgetUsageRate > 75 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                              style={{ width: `${budgetUsageRate}%` }}
                            />
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 渠道分析标签内容 */}
          <TabsContent value="channels" className="space-y-6">
            {/* 渠道分布饼图 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4" />
                    营销渠道分布
                  </CardTitle>
                  <CardDescription>各营销渠道占比分析</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={channelDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {channelDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value: number) => formatPercentage(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* 渠道效果对比 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    渠道效果对比
                  </CardTitle>
                  <CardDescription>各渠道转化率和ROI对比</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={[
                          { channel: '社交媒体', conversion: 8.5, roi: 280 },
                          { channel: '电商平台', conversion: 12.3, roi: 320 },
                          { channel: '线下活动', conversion: 15.7, roi: 240 },
                          { channel: '内容营销', conversion: 6.8, roi: 180 },
                          { channel: 'KOL合作', conversion: 20.5, roi: 350 }
                        ]}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="channel" />
                        <RechartsTooltip formatter={(value: number, name: string) => {
                          if (name === 'conversion') return `${value}%`
                          return `${value}%`
                        }} />
                        <Legend />
                        <Bar dataKey="conversion" name="转化率" fill="#3b82f6" />
                        <Bar dataKey="roi" name="ROI" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* 渠道优化建议 */}
            <Card variant="outline">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  渠道优化建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                    <ArrowUpRight className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <span className="font-medium">KOL合作效果最佳</span>
                      <span className="ml-1">KOL合作渠道转化率和ROI最高，建议增加投入比例。</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-md">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <span className="font-medium">内容营销需优化</span>
                      <span className="ml-1">内容营销转化率较低，建议优化内容质量和分发策略。</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-md">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-medium">多渠道协同效应</span>
                      <span className="ml-1">社交媒体与线下活动结合效果良好，建议继续保持协同营销策略。</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 趋势报告标签内容 */}
          <TabsContent value="trends" className="space-y-6">
            {/* 月度营销趋势 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  月度营销趋势
                </CardTitle>
                <CardDescription>月度预算和实际支出趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="budget" 
                        name="预算" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        name="实际支出" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* 季度对比分析 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  季度对比分析
                </CardTitle>
                <CardDescription>各季度营销效果对比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { quarter: 'Q1', activities: 4, budget: 350000, roi: 220 },
                        { quarter: 'Q2', activities: 5, budget: 420000, roi: 250 },
                        { quarter: 'Q3', activities: 6, budget: 520000, roi: 280 },
                        { quarter: 'Q4', activities: 7, budget: 650000, roi: 320 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" />
                      <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                      <RechartsTooltip formatter={(value: number, name: string) => {
                        if (name === 'roi') return formatROI(value)
                        if (name === 'activities') return `${value} 个`
                        return formatCurrency(value)
                      }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="activities" name="活动数量" fill="#3b82f6" />
                      <Bar yAxisId="left" dataKey="budget" name="预算" fill="#8b5cf6" />
                      <Line yAxisId="right" type="monotone" dataKey="roi" name="ROI" stroke="#10b981" strokeWidth={2} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* 趋势预测 */}
            <Card variant="outline">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  趋势预测与建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                    <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <span className="font-medium">增长趋势明显</span>
                      <span className="ml-1">根据近4个月数据，营销活动ROI呈现持续上升趋势，预计下月将继续保持增长。</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-md">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-medium">预算执行良好</span>
                      <span className="ml-1">实际支出与预算偏差控制在合理范围内，预算管理效果良好。</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-md">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <span className="font-medium">建议增加活动频次</span>
                      <span className="ml-1">Q4是销售旺季，建议适当增加营销活动频次，特别是在双11、双12等关键节点。</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* 活动详情对话框 */}
        <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            {selectedActivity && dialogMode === 'view' && (
              <>
                <DialogHeader>
                  <DialogTitle>活动详情: {selectedActivity.name}</DialogTitle>
                  <DialogDescription>
                    创建于 {selectedActivity.startDate} | ID: {selectedActivity.id}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">活动类型</p>
                      <Badge variant="outline">{selectedActivity.type}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">负责部门</p>
                      <p className="font-medium">{selectedActivity.department}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">负责人</p>
                      <p className="font-medium">{selectedActivity.manager}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">活动状态</p>
                      <Badge {...getStatusBadge(selectedActivity.status)} className={getStatusBadge(selectedActivity.status).className}>
                        {getStatusIcon(selectedActivity.status)}
                        {selectedActivity.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">开始日期</p>
                      <p className="font-medium">{selectedActivity.startDate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">结束日期</p>
                      <p className="font-medium">{selectedActivity.endDate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">预算金额</p>
                      <p className="font-medium text-blue-600">{formatCurrency(selectedActivity.budget)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">完成进度</p>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${selectedActivity.status === '进行中' ? 'bg-green-500' : selectedActivity.status === '已完成' ? 'bg-purple-500' : 'bg-gray-300'}`}
                            style={{ width: `${selectedActivity.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium min-w-[40px] text-right">{selectedActivity.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">预计ROI</p>
                      <p className="font-medium text-blue-600">{formatROI(selectedActivity.expectedROI)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">实际ROI</p>
                      <p className={`font-medium ${selectedActivity.actualROI > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                        {selectedActivity.actualROI > 0 ? formatROI(selectedActivity.actualROI) : '未开始计算'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">营销渠道</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivity.channels.map((channel: string, index: number) => (
                        <Badge key={index} variant="secondary">{channel}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">活动描述</p>
                    <p className="font-medium whitespace-pre-line">{selectedActivity.description}</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsActivityDialogOpen(false)}>
                    关闭
                  </Button>
                  <Button onClick={() => handleEditActivity(selectedActivity)}>
                    <Edit className="mr-2 h-4 w-4" />
                    编辑活动
                  </Button>
                </DialogFooter>
              </>
            )}
            
            {dialogMode === 'create' && (
              <>
                <DialogHeader>
                  <DialogTitle>创建新活动</DialogTitle>
                  <DialogDescription>
                    请填写活动的详细信息
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">活动名称</p>
                    <Input placeholder="请输入活动名称" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">活动类型</p>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择活动类型" />
                        </SelectTrigger>
                        <SelectContent>
                          {activityTypes.filter(t => t.value !== 'all').map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">负责部门</p>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择部门" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="市场部">市场部</SelectItem>
                          <SelectItem value="销售部">销售部</SelectItem>
                          <SelectItem value="客户关系部">客户关系部</SelectItem>
                          <SelectItem value="品牌部">品牌部</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">负责人</p>
                      <Input placeholder="请输入负责人姓名" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">活动预算</p>
                      <Input type="number" placeholder="请输入活动预算" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">开始日期</p>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">结束日期</p>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">营销渠道</p>
                    <div className="flex flex-wrap gap-2">
                      {channelDistributionData.map((channel, index) => (
                        <Badge key={index} variant="secondary">{channel.name}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">活动描述</p>
                    <textarea
                      className="w-full min-h-[100px] p-3 border rounded-md"
                      placeholder="请详细描述活动内容、目标和执行计划..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsActivityDialogOpen(false)}>
                    取消
                  </Button>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    创建活动
                  </Button>
                </DialogFooter>
              </>
            )}
            
            {selectedActivity && dialogMode === 'edit' && (
              <>
                <DialogHeader>
                  <DialogTitle>编辑活动: {selectedActivity.name}</DialogTitle>
                  <DialogDescription>
                    更新活动的详细信息
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">活动名称</p>
                    <Input value={selectedActivity.name} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">活动类型</p>
                      <Select defaultValue={selectedActivity.type}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {activityTypes.filter(t => t.value !== 'all').map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">负责部门</p>
                      <Select defaultValue={selectedActivity.department}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="市场部">市场部</SelectItem>
                          <SelectItem value="销售部">销售部</SelectItem>
                          <SelectItem value="客户关系部">客户关系部</SelectItem>
                          <SelectItem value="品牌部">品牌部</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">负责人</p>
                      <Input value={selectedActivity.manager} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">活动预算</p>
                      <Input type="number" value={selectedActivity.budget} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">开始日期</p>
                      <Input type="date" value={selectedActivity.startDate} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">结束日期</p>
                      <Input type="date" value={selectedActivity.endDate} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">活动状态</p>
                      <Select defaultValue={selectedActivity.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {activityStatuses.filter(s => s.value !== 'all').map((status) => (
                            <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">完成进度 ({selectedActivity.progress}%)</p>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={selectedActivity.progress}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">营销渠道</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivity.channels.map((channel: string, index: number) => (
                        <Badge key={index} variant="secondary">{channel}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">活动描述</p>
                    <textarea
                      className="w-full min-h-[100px] p-3 border rounded-md"
                      defaultValue={selectedActivity.description}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsActivityDialogOpen(false)}>
                    取消
                  </Button>
                  <Button>
                    <Edit className="mr-2 h-4 w-4" />
                    保存更改
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
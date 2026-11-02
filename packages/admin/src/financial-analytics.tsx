/**
 * @file 财务分析组件
 * @description 提供财务数据的可视化展示、分析和导出功能，包含图表和表格展示
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Input } from "@yyc3/ui/input"
import { Button } from "@yyc3/ui/button"
import { Badge } from "@yyc3/ui/badge"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui/table"
import { ScrollArea } from "@yyc3/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@yyc3/ui/dialog"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { ChevronDown, ChevronUp, Download, Filter, Search, MoreHorizontal, DollarSign, TrendingUp, PieChart as PieChartIcon, BarChart as BarChartIcon, Calendar, ArrowUpRight, ArrowDownRight, Eye, Settings, RefreshCw }
  from "lucide-react"

// 模拟数据 - 收入支出对比
const revenueExpenseData = [
  { month: "1月", revenue: 120000, expense: 80000 },
  { month: "2月", revenue: 150000, expense: 90000 },
  { month: "3月", revenue: 180000, expense: 100000 },
  { month: "4月", revenue: 200000, expense: 110000 },
  { month: "5月", revenue: 190000, expense: 105000 },
  { month: "6月", revenue: 230000, expense: 120000 },
  { month: "7月", revenue: 260000, expense: 130000 },
  { month: "8月", revenue: 280000, expense: 140000 },
  { month: "9月", revenue: 300000, expense: 150000 },
  { month: "10月", revenue: 320000, expense: 160000 },
  { month: "11月", revenue: 350000, expense: 170000 },
  { month: "12月", revenue: 400000, expense: 180000 }
]

// 模拟数据 - 收支趋势
const financialTrendData = [
  { month: "1月", amount: 40000, type: "利润" },
  { month: "2月", amount: 60000, type: "利润" },
  { month: "3月", amount: 80000, type: "利润" },
  { month: "4月", amount: 90000, type: "利润" },
  { month: "5月", amount: 85000, type: "利润" },
  { month: "6月", amount: 110000, type: "利润" },
  { month: "7月", amount: 130000, type: "利润" },
  { month: "8月", amount: 140000, type: "利润" },
  { month: "9月", amount: 150000, type: "利润" },
  { month: "10月", amount: 160000, type: "利润" },
  { month: "11月", amount: 180000, type: "利润" },
  { month: "12月", amount: 220000, type: "利润" }
]

// 模拟数据 - 费用分布
const expenseDistributionData = [
  { name: "人力资源", value: 35, color: "#3b82f6" },
  { name: "设备采购", value: 25, color: "#10b981" },
  { name: "市场营销", value: 20, color: "#f59e0b" },
  { name: "研发投入", value: 15, color: "#8b5cf6" },
  { name: "其他费用", value: 5, color: "#6b7280" }
]

// 模拟数据 - 财务明细
const financialDetailsData = [
  {
    id: "fin001",
    date: "2024-10-15",
    category: "收入",
    type: "销售收入",
    amount: 85000.00,
    department: "销售部",
    project: "Q4营销策略",
    status: "已确认",
    description: "10月份第一批产品销售"
  },
  {
    id: "fin002",
    date: "2024-10-14",
    category: "支出",
    type: "薪资福利",
    amount: -45000.00,
    department: "人力资源部",
    project: "月度薪资",
    status: "已支付",
    description: "10月份员工薪资"
  },
  {
    id: "fin003",
    date: "2024-10-12",
    category: "支出",
    type: "设备采购",
    amount: -28000.00,
    department: "研发部",
    project: "设备更新",
    status: "已支付",
    description: "服务器设备采购"
  },
  {
    id: "fin004",
    date: "2024-10-10",
    category: "收入",
    type: "服务收入",
    amount: 62000.00,
    department: "服务部",
    project: "企业服务",
    status: "已确认",
    description: "企业云服务费用"
  },
  {
    id: "fin005",
    date: "2024-10-08",
    category: "支出",
    type: "市场营销",
    amount: -15000.00,
    department: "市场部",
    project: "品牌推广",
    status: "已支付",
    description: "社交媒体推广费用"
  },
  {
    id: "fin006",
    date: "2024-10-05",
    category: "收入",
    type: "销售收入",
    amount: 78000.00,
    department: "销售部",
    project: "Q4营销策略",
    status: "已确认",
    description: "10月份第二批产品销售"
  },
  {
    id: "fin007",
    date: "2024-10-03",
    category: "支出",
    type: "办公费用",
    amount: -8000.00,
    department: "行政部",
    project: "日常办公",
    status: "已支付",
    description: "办公用品采购"
  },
  {
    id: "fin008",
    date: "2024-10-01",
    category: "收入",
    type: "投资收益",
    amount: 5000.00,
    department: "财务部",
    project: "投资理财",
    status: "已确认",
    description: "短期理财产品收益"
  }
]

// 模拟数据 - 财务指标
const financialIndicators = [
  { name: "营业收入", current: 320000, previous: 280000, change: 14.29, unit: "元" },
  { name: "净利润", current: 160000, previous: 140000, change: 14.29, unit: "元" },
  { name: "毛利率", current: 58.5, previous: 56.2, change: 2.3, unit: "%" },
  { name: "净利率", current: 50.0, previous: 50.0, change: 0.0, unit: "%" },
  { name: "运营成本", current: 160000, previous: 140000, change: 14.29, unit: "元" },
  { name: "现金流量", current: 280000, previous: 250000, change: 12.0, unit: "元" }
]

// 格式化金额
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  }).format(amount)
}

// 格式化百分比
const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`
}

export function FinancialAnalytics() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("year")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [filteredData, setFilteredData] = useState(financialDetailsData)
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 过滤财务明细数据
  useEffect(() => {
    let result = financialDetailsData
    
    // 搜索过滤
    if (searchTerm) {
      result = result.filter(item => 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // 类别过滤
    if (categoryFilter !== "all") {
      result = result.filter(item => item.category === categoryFilter)
    }
    
    setFilteredData(result)
  }, [searchTerm, categoryFilter])

  // 处理数据刷新
  const handleRefreshData = () => {
    setIsLoading(true)
    // 模拟数据加载
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // 处理导出数据
  const handleExportData = (format: string) => {
    console.log(`导出${format}格式数据`)
  }

  // 处理查看详情
  const handleViewDetail = (item: any) => {
    setSelectedDetail(item)
    setIsDetailDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              财务分析
            </CardTitle>
            <CardDescription>
              财务数据可视化、趋势分析和报表导出
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="时间范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">本月</SelectItem>
                  <SelectItem value="quarter">本季度</SelectItem>
                  <SelectItem value="year">本年度</SelectItem>
                  <SelectItem value="all">全部</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefreshData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  <Download className="h-4 w-4" />
                  导出
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>导出数据</DialogTitle>
                  <DialogDescription>
                    选择导出格式和数据范围
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">导出格式</label>
                    <Select defaultValue="excel">
                      <SelectTrigger>
                        <SelectValue placeholder="选择格式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">数据范围</label>
                    <Select defaultValue="current">
                      <SelectTrigger>
                        <SelectValue placeholder="选择范围" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">当前视图数据</SelectItem>
                        <SelectItem value="all">全部数据</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">取消</Button>
                  <Button onClick={() => handleExportData('excel')}>确认导出</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="charts">图表分析</TabsTrigger>
            <TabsTrigger value="details">财务明细</TabsTrigger>
            <TabsTrigger value="indicators">财务指标</TabsTrigger>
          </TabsList>
          
          {/* 概览标签内容 */}
          <TabsContent value="overview" className="space-y-6">
            {/* 财务概览卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">本月收入</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold">{formatCurrency(320000)}</div>
                    <div className="flex items-center text-green-600 text-sm mb-0.5">
                      <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                      14.3%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">较上月增长</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">本月支出</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold">{formatCurrency(160000)}</div>
                    <div className="flex items-center text-green-600 text-sm mb-0.5">
                      <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                      14.3%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">较上月增长</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">本月利润</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold">{formatCurrency(160000)}</div>
                    <div className="flex items-center text-green-600 text-sm mb-0.5">
                      <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                      14.3%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">较上月增长</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">累计收入</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold">{formatCurrency(2700000)}</div>
                    <div className="flex items-center text-green-600 text-sm mb-0.5">
                      <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                      18.5%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">较去年同期</p>
                </CardContent>
              </Card>
            </div>
            
            {/* 收入支出对比图表 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChartIcon className="h-4 w-4" />
                  收入支出对比
                </CardTitle>
                <CardDescription>近12个月的收入与支出数据</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueExpenseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="revenue" name="收入" fill="#3b82f6" />
                      <Bar dataKey="expense" name="支出" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* 财务预测与建议 */}
            <Card variant="outline">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  财务预测与建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                    <ArrowUpRight className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <span className="font-medium">销售趋势良好</span>
                      <span className="ml-1">根据近3个月数据，预计下月收入将增长10-15%。</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-md">
                    <ArrowUpRight className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <span className="font-medium">支出控制建议</span>
                      <span className="ml-1">人力资源成本占比过高，建议优化人员结构或提高效率。</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-md">
                    <ArrowUpRight className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-medium">投资机会</span>
                      <span className="ml-1">现金流充足，可考虑适度增加研发投入或拓展新业务。</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 图表分析标签内容 */}
          <TabsContent value="charts" className="space-y-6">
            {/* 利润趋势图 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  利润趋势分析
                </CardTitle>
                <CardDescription>近12个月的利润变化趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={financialTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        name="利润" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* 费用分布饼图 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4" />
                    费用分布
                  </CardTitle>
                  <CardDescription>各类费用占比分析</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {expenseDistributionData.map((entry, index) => (
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
              
              {/* 部门费用对比 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChartIcon className="h-4 w-4" />
                    部门费用对比
                  </CardTitle>
                  <CardDescription>各部门费用支出情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={[
                          { department: '销售部', expense: 78000 },
                          { department: '研发部', expense: 52000 },
                          { department: '市场部', expense: 35000 },
                          { department: '财务部', expense: 25000 },
                          { department: '行政部', expense: 20000 }
                        ]}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="department" />
                        <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                        <Bar dataKey="expense" name="费用" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* 季节性分析 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  季节性趋势分析
                </CardTitle>
                <CardDescription>不同季度的业务表现</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { quarter: 'Q1', revenue: 450000, profit: 200000 },
                        { quarter: 'Q2', revenue: 620000, profit: 280000 },
                        { quarter: 'Q3', revenue: 840000, profit: 420000 },
                        { quarter: 'Q4', revenue: 1070000, profit: 530000 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" />
                      <YAxis />
                      <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="revenue" name="收入" fill="#3b82f6" />
                      <Bar dataKey="profit" name="利润" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 财务明细标签内容 */}
          <TabsContent value="details">
            <div className="space-y-4">
              {/* 搜索和筛选 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="搜索描述、项目或部门..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="财务类别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部分类</SelectItem>
                      <SelectItem value="收入">收入</SelectItem>
                      <SelectItem value="支出">支出</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    高级筛选
                  </Button>
                </div>
              </div>
              
              {/* 财务明细表格 */}
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>日期</TableHead>
                          <TableHead>类别</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead className="text-right">金额</TableHead>
                          <TableHead>部门</TableHead>
                          <TableHead>项目</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>
                              <Badge variant={item.category === '收入' ? 'default' : 'secondary'}>
                                {item.category}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell className={`text-right font-medium ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(item.amount)}
                            </TableCell>
                            <TableCell>{item.department}</TableCell>
                            <TableCell>{item.project}</TableCell>
                            <TableCell>
                              <Badge variant={item.status === '已确认' || item.status === '已支付' ? 'secondary' : 'outline'}>
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetail(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
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
          
          {/* 财务指标标签内容 */}
          <TabsContent value="indicators">
            <div className="space-y-6">
              {/* 关键财务指标卡片 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {financialIndicators.map((indicator, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">{indicator.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end gap-2">
                        <div className="text-2xl font-bold">
                          {indicator.unit === '%' ? formatPercentage(indicator.current) : formatCurrency(indicator.current)}
                        </div>
                        <div className={`flex items-center text-sm mb-0.5 ${indicator.change > 0 ? 'text-green-600' : indicator.change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {indicator.change > 0 ? (
                            <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                          ) : indicator.change < 0 ? (
                            <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                          ) : null}
                          {Math.abs(indicator.change)}%
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {indicator.change > 0 ? '较上期增长' : indicator.change < 0 ? '较上期下降' : '与上期持平'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* 指标分析说明 */}
              <Card variant="outline">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    指标说明与分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-blue-50 rounded-md">
                      <h4 className="font-medium mb-1">毛利率分析</h4>
                      <p className="text-gray-700">
                        本月毛利率为{formatPercentage(58.5)}，较上月增长2.3个百分点，主要是由于产品结构优化和成本控制措施见效。
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-md">
                      <h4 className="font-medium mb-1">净利率分析</h4>
                      <p className="text-gray-700">
                        净利率保持在50%，与上月持平，说明公司成本控制稳定，盈利能力较强。
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-md">
                      <h4 className="font-medium mb-1">现金流量分析</h4>
                      <p className="text-gray-700">
                        现金流量持续增长，表明公司经营活动产生的现金流充足，财务状况健康。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* 财务预警 */}
              <Card variant="outline">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    财务预警
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-1">预警指标监控</h4>
                      <p className="text-gray-700">
                        目前各项财务指标均在正常范围内，未触发任何预警机制。建议继续保持当前的经营策略。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* 财务明细详情对话框 */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            {selectedDetail && (
              <>
                <DialogHeader>
                  <DialogTitle>财务明细详情</DialogTitle>
                  <DialogDescription>
                    财务记录ID: {selectedDetail.id}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">日期</p>
                      <p className="font-medium">{selectedDetail.date}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">类别</p>
                      <Badge variant={selectedDetail.category === '收入' ? 'default' : 'secondary'}>
                        {selectedDetail.category}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">类型</p>
                      <p className="font-medium">{selectedDetail.type}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">金额</p>
                      <p className={`font-medium ${selectedDetail.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(selectedDetail.amount)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">部门</p>
                      <p className="font-medium">{selectedDetail.department}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">状态</p>
                      <Badge variant={selectedDetail.status === '已确认' || selectedDetail.status === '已支付' ? 'secondary' : 'outline'}>
                        {selectedDetail.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">项目</p>
                    <p className="font-medium">{selectedDetail.project}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">描述</p>
                    <p className="font-medium">{selectedDetail.description}</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    关闭
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

// AlertCircle 图标组件
function AlertCircle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

// MoreHorizontal 图标组件
function MoreHorizontal(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}
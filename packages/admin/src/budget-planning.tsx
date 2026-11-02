/**
 * @file 预算规划组件
 * @description 提供预算规划和管理功能，包括预算设置、执行和分析
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui/table"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@yyc3/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Search, Plus, DollarSign, BarChart2, PieChart as PieChartIcon, TrendingUp, Filter, ChevronDown, Download } from "lucide-react"
import { Badge } from "@yyc3/ui/badge"
import { Slider } from "@yyc3/ui/slider"

// 模拟数据 - 预算列表
const budgetData = [
  { id: "1", department: "销售部", category: "营销费用", budget: 500000, used: 240000, remaining: 260000, progress: 48, status: "normal" },
  { id: "2", department: "研发部", category: "设备采购", budget: 800000, used: 560000, remaining: 240000, progress: 70, status: "warning" },
  { id: "3", department: "行政部", category: "办公用品", budget: 100000, used: 45000, remaining: 55000, progress: 45, status: "normal" },
  { id: "4", department: "人力资源部", category: "培训费用", budget: 150000, used: 85000, remaining: 65000, progress: 57, status: "normal" },
  { id: "5", department: "财务部", category: "软件订阅", budget: 80000, used: 75000, remaining: 5000, progress: 94, status: "danger" },
]

// 模拟数据 - 预算执行趋势
const trendData = [
  { month: "1月", planned: 120000, actual: 105000 },
  { month: "2月", planned: 135000, actual: 128000 },
  { month: "3月", planned: 142000, actual: 156000 },
  { month: "4月", planned: 150000, actual: 148000 },
  { month: "5月", planned: 145000, actual: 135000 },
  { month: "6月", planned: 160000, actual: 152000 },
]

// 模拟数据 - 预算分类占比
const categoryData = [
  { name: "营销费用", value: 28, color: "#3b82f6" },
  { name: "设备采购", value: 35, color: "#10b981" },
  { name: "人力成本", value: 22, color: "#f59e0b" },
  { name: "培训费用", value: 10, color: "#8b5cf6" },
  { name: "其他费用", value: 5, color: "#6b7280" },
]

// 部门选项
const departments = [
  { value: "all", label: "全部部门" },
  { value: "销售部", label: "销售部" },
  { value: "研发部", label: "研发部" },
  { value: "行政部", label: "行政部" },
  { value: "人力资源部", label: "人力资源部" },
  { value: "财务部", label: "财务部" },
]

// 预算状态
const budgetStatus = {
  normal: { label: "正常", className: "bg-green-100 text-green-800 border-green-200" },
  warning: { label: "预警", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  danger: { label: "超支", className: "bg-red-100 text-red-800 border-red-200" },
}

// 格式化金额
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function BudgetPlanning() {
  const [activeTab, setActiveTab] = useState("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // 过滤预算数据
  const filteredBudgets = budgetData.filter(
    (budget) =>
      (searchTerm === "" ||
        budget.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.category.toLowerCase().includes(searchTerm.toLowerCase())) 
      &&
      (departmentFilter === "all" || budget.department === departmentFilter)
  )

  // 处理添加预算
  const handleAddBudget = () => {
    // 这里应该有保存逻辑
    setIsAddDialogOpen(false)
  }

  // 处理导出
  const handleExport = () => {
    // 这里应该有导出逻辑
    console.log("导出数据")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              预算规划
            </CardTitle>
            <CardDescription>管理部门预算、跟踪执行情况并进行分析</CardDescription>
          </div>
          <div className="flex flex-wrap gap-3">
            <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="list">预算列表</TabsTrigger>
                <TabsTrigger value="analysis">预算分析</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === "list" && (
          <div className="space-y-4">
            {/* 搜索和筛选区域 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜索预算..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="部门筛选" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      新增预算
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>新增预算</DialogTitle>
                      <DialogDescription>创建一个新的预算项目</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="department">部门</label>
                        <Select defaultValue="">
                          <SelectTrigger id="department">
                            <SelectValue placeholder="选择部门" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.filter(d => d.value !== "all").map((dept) => (
                              <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="category">预算类别</label>
                        <Input id="category" placeholder="输入预算类别" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="amount">预算金额</label>
                        <Input id="amount" type="number" placeholder="输入预算金额" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="period">预算周期</label>
                        <Select defaultValue="">
                          <SelectTrigger id="period">
                            <SelectValue placeholder="选择周期" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quarterly">季度</SelectItem>
                            <SelectItem value="half-yearly">半年度</SelectItem>
                            <SelectItem value="yearly">年度</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        取消
                      </Button>
                      <Button onClick={handleAddBudget}>保存</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  导出
                </Button>
              </div>
            </div>

            {/* 预算列表表格 */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>部门</TableHead>
                    <TableHead>预算类别</TableHead>
                    <TableHead>预算金额</TableHead>
                    <TableHead>已使用</TableHead>
                    <TableHead>剩余</TableHead>
                    <TableHead>执行进度</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBudgets.map((budget) => (
                    <TableRow key={budget.id}>
                      <TableCell>{budget.department}</TableCell>
                      <TableCell>{budget.category}</TableCell>
                      <TableCell className="font-medium">{formatAmount(budget.budget)}</TableCell>
                      <TableCell>{formatAmount(budget.used)}</TableCell>
                      <TableCell>{formatAmount(budget.remaining)}</TableCell>
                      <TableCell>
                        <div className="w-full max-w-[150px]">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${budget.status === "normal" ? "bg-green-500" : budget.status === "warning" ? "bg-yellow-500" : "bg-red-500"}`}
                                style={{ width: `${budget.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-10">{budget.progress}%</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={budgetStatus[budget.status].className}>
                          {budgetStatus[budget.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            查看详情
                          </Button>
                          <Button variant="ghost" size="sm">
                            编辑
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-6">
            {/* 预算执行趋势图表 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  预算执行趋势
                </CardTitle>
                <CardDescription>最近6个月预算执行情况对比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatAmount(value)} />
                      <Legend />
                      <Bar dataKey="planned" name="计划支出" fill="#94a3b8" />
                      <Bar dataKey="actual" name="实际支出" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* 预算分类占比图表 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4" />
                    预算分类占比
                  </CardTitle>
                  <CardDescription>按类别统计的预算分布</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* 预算状态统计 */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    部门预算状态
                  </CardTitle>
                  <CardDescription>各部门预算执行状态概览</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.filter(d => d.value !== "all").map((dept) => {
                      const deptBudget = budgetData.find(b => b.department === dept.value);
                      const progress = deptBudget?.progress || 0;
                      const status = deptBudget?.status || "normal";
                      return (
                        <div key={dept.value}>
                          <div className="flex justify-between items-center mb-1">
                            <span>{dept.label}</span>
                            <Badge variant="outline" className={budgetStatus[status].className}>
                              {budgetStatus[status].label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${status === "normal" ? "bg-green-500" : status === "warning" ? "bg-yellow-500" : "bg-red-500"}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-10">{progress}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 预算监控和建议 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>预算监控建议</CardTitle>
                <CardDescription>基于历史数据的预算优化建议</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                    <div className="mt-0.5 text-yellow-600">⚠️</div>
                    <div>
                      <p className="font-medium">研发部设备采购预算预警</p>
                      <p className="text-sm text-gray-600">当前已使用70%的预算，建议控制后续采购节奏。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-md">
                    <div className="mt-0.5 text-red-600">🚨</div>
                    <div>
                      <p className="font-medium">财务部软件订阅预算超支风险</p>
                      <p className="text-sm text-gray-600">当前已使用94%的预算，建议审核剩余订阅是否必要。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-md">
                    <div className="mt-0.5 text-green-600">💡</div>
                    <div>
                      <p className="font-medium">预算优化建议</p>
                      <p className="text-sm text-gray-600">根据历史数据分析，建议将部分营销预算调整至Q3季度以提高ROI。</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
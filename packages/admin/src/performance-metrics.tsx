/**
 * @file 绩效指标组件
 * @description 提供部门和员工的绩效指标展示功能
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui/table"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { RefreshCw, Download, Search, Calendar, Filter } from "lucide-react"

// 模拟数据
const departmentData = [
  {
    department: "销售部",
    targetAmount: 500,
    actualAmount: 550,
    completionRate: 110,
    status: "超额完成",
  },
  {
    department: "研发部",
    targetAmount: 12,
    actualAmount: 10,
    completionRate: 83,
    status: "未达标",
  },
  {
    department: "运营部",
    targetAmount: 20000,
    actualAmount: 19800,
    completionRate: 99,
    status: "接近达标",
  },
  {
    department: "客服部",
    targetAmount: 90,
    actualAmount: 92,
    completionRate: 102,
    status: "超额完成",
  },
  {
    department: "财务部",
    targetAmount: 10,
    actualAmount: 9,
    completionRate: 90,
    status: "未达标",
  },
]

// 销售趋势数据
const salesTrendData = [
  { month: "1月", amount: 120 },
  { month: "2月", amount: 180 },
  { month: "3月", amount: 210 },
  { month: "4月", amount: 160 },
  { month: "5月", amount: 230 },
  { month: "6月", amount: 280 },
]

// 部门贡献数据
const departmentContributionData = [
  { name: "销售部", value: 45 },
  { name: "研发部", value: 20 },
  { name: "运营部", value: 15 },
  { name: "客服部", value: 10 },
  { name: "财务部", value: 10 },
]

// 目标完成度数据
const targetCompletionData = [
  { name: "销售部", target: 500, actual: 550 },
  { name: "研发部", target: 12, actual: 10 },
  { name: "运营部", target: 20000, actual: 19800 },
  { name: "客服部", target: 90, actual: 92 },
  { name: "财务部", target: 10, actual: 9 },
]

// 图表颜色
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function PerformanceMetrics() {
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState("quarter")

  // 筛选数据
  const filteredData = departmentData.filter((item) => {
    const matchesDepartment = departmentFilter === "all" || item.department === departmentFilter
    const matchesSearch = 
      item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesDepartment && matchesSearch
  })

  // 计算总计
  const totalTarget = filteredData.reduce((sum, item) => sum + item.targetAmount, 0)
  const totalActual = filteredData.reduce((sum, item) => sum + item.actualAmount, 0)
  const totalCompletionRate = filteredData.length > 0 ? Math.round((totalActual / totalTarget) * 100) : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>绩效指标分析</CardTitle>
            <CardDescription>部门和员工的绩效指标展示与分析</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="选择时间范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">本月</SelectItem>
                  <SelectItem value="quarter">本季度</SelectItem>
                  <SelectItem value="half">上半年</SelectItem>
                  <SelectItem value="year">全年</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                placeholder="搜索部门或状态..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部部门</SelectItem>
                  <SelectItem value="销售部">销售部</SelectItem>
                  <SelectItem value="研发部">研发部</SelectItem>
                  <SelectItem value="运营部">运营部</SelectItem>
                  <SelectItem value="客服部">客服部</SelectItem>
                  <SelectItem value="财务部">财务部</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="table" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="table">表格视图</TabsTrigger>
              <TabsTrigger value="bar">柱状图</TabsTrigger>
              <TabsTrigger value="line">折线图</TabsTrigger>
              <TabsTrigger value="pie">饼图</TabsTrigger>
            </TabsList>
            <TabsContent value="table" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>部门</TableHead>
                      <TableHead>目标金额/数量</TableHead>
                      <TableHead>实际金额/数量</TableHead>
                      <TableHead>完成率</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.department}>
                        <TableCell className="font-medium">{item.department}</TableCell>
                        <TableCell>{item.targetAmount}</TableCell>
                        <TableCell>{item.actualAmount}</TableCell>
                        <TableCell>{item.completionRate}%</TableCell>
                        <TableCell>{item.status}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">总计</TableCell>
                      <TableCell className="font-bold">{totalTarget}</TableCell>
                      <TableCell className="font-bold">{totalActual}</TableCell>
                      <TableCell className="font-bold">{totalCompletionRate}%</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="bar" className="mt-0">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={targetCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="target" name="目标值" fill="#8884d8" />
                    <Bar dataKey="actual" name="实际值" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="line" className="mt-0">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amount" name="销售额" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              <div>
            </TabsContent>
            <TabsContent value="pie" className="mt-0">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentContributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentContributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">销售趋势分析</CardTitle>
            <CardDescription>月度销售业绩变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">部门业绩占比</CardTitle>
            <CardDescription>各部门贡献比例</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentContributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentContributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">目标完成度</CardTitle>
            <CardDescription>目标vs实际完成情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={targetCompletionData.slice(0, 3)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="target" name="目标" fill="#8884d8" />
                  <Bar dataKey="actual" name="实际" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
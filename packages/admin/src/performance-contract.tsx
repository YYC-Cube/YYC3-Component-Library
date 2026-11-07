/**
 * @file 绩效合同组件
 * @description 提供业绩对赌合约管理功能
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
import { Plus, Search, Filter } from "lucide-react"

// 模拟数据
const contracts = [
  {
    id: "C-001",
    name: "Q1销售目标",
    type: "销售业绩",
    department: "销售部",
    target: "200万",
    actual: "220万",
    completionRate: "110%",
    status: "已完成",
    result: "达标",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
  },
  {
    id: "C-002",
    name: "产品开发计划",
    type: "研发进度",
    department: "研发部",
    target: "完成3个功能模块",
    actual: "完成2个功能模块",
    completionRate: "67%",
    status: "已完成",
    result: "未达标",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
  },
  {
    id: "C-003",
    name: "Q2运营目标",
    type: "运营指标",
    department: "运营部",
    target: "用户增长50%",
    actual: "进行中",
    completionRate: "30%",
    status: "进行中",
    result: "进行中",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
  },
  {
    id: "C-004",
    name: "客户满意度提升",
    type: "服务质量",
    department: "客服部",
    target: "满意度达到90%",
    actual: "进行中",
    completionRate: "45%",
    status: "进行中",
    result: "进行中",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
  },
  {
    id: "C-005",
    name: "成本控制计划",
    type: "成本控制",
    department: "财务部",
    target: "降低成本10%",
    actual: "降低成本8%",
    completionRate: "80%",
    status: "已完成",
    result: "未达标",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
  },
]

export function PerformanceContract() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  // 筛选合约
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = 
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || contract.department === departmentFilter
    
    return matchesSearch && matchesStatus && matchesDepartment
  })

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    switch (status) {
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

  // 获取结果徽章
  const getResultBadge = (result: string) => {
    switch (result) {
      case "达标":
        return <Badge className="bg-green-500">达标</Badge>
      case "未达标":
        return <Badge className="bg-red-500">未达标</Badge>
      case "进行中":
        return <Badge className="bg-yellow-500">进行中</Badge>
      default:
        return <Badge>{result}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>绩效合同管理</CardTitle>
          <CardDescription>业绩对赌合约的创建、查看与管理</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" /> 创建合约
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="搜索合约名称、ID或部门..."
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
                  <SelectItem value="销售部">销售部</SelectItem>
                  <SelectItem value="研发部">研发部</SelectItem>
                  <SelectItem value="运营部">运营部</SelectItem>
                  <SelectItem value="客服部">客服部</SelectItem>
                  <SelectItem value="财务部">财务部</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              重置筛选
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>策划名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>目标值</TableHead>
                <TableHead>实际值</TableHead>
                <TableHead>完成率</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>结果</TableHead>
                <TableHead>开始日期</TableHead>
                <TableHead>结束日期</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.id}</TableCell>
                  <TableCell>{contract.name}</TableCell>
                  <TableCell>{contract.type}</TableCell>
                  <TableCell>{contract.department}</TableCell>
                  <TableCell>{contract.target}</TableCell>
                  <TableCell>{contract.actual}</TableCell>
                  <TableCell>{contract.completionRate}</TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>{getResultBadge(contract.result)}</TableCell>
                  <TableCell>{contract.startDate}</TableCell>
                  <TableCell>{contract.endDate}</TableCell>
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
/**
 * @file 员工管理组件
 * @description 提供员工信息管理、员工列表展示、搜索筛选和批量操作功能
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui/table"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@yyc3/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@yyc3/ui/avatar"
import { Badge } from "@yyc3/ui/badge"
import { Checkbox } from "@yyc3/ui/checkbox"
import { Label } from "@yyc3/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@yyc3/ui/alert-dialog"
import { Search, Plus, Users, UserPlus, Trash2, Pencil2, Filter, Download, ArrowUpDown, MoreHorizontal, ChevronDown, Briefcase, Home, Mail, Phone, Calendar } from "lucide-react"

// 模拟数据 - 员工列表
const employees = [
  {
    id: "101",
    name: "张三",
    avatar: "https://picsum.photos/id/1/40/40",
    department: "销售部",
    position: "销售总监",
    level: "P7",
    hireDate: "2022-03-15",
    email: "zhangsan@example.com",
    phone: "13800138001",
    status: "active",
    address: "北京市朝阳区",
    entryDate: "2022-03-15",
    contractEndDate: "2025-03-14"
  },
  {
    id: "102",
    name: "李四",
    avatar: "https://picsum.photos/id/2/40/40",
    department: "销售部",
    position: "销售经理",
    level: "P6",
    hireDate: "2022-04-20",
    email: "lisi@example.com",
    phone: "13800138002",
    status: "active",
    address: "北京市海淀区",
    entryDate: "2022-04-20",
    contractEndDate: "2025-04-19"
  },
  {
    id: "201",
    name: "王五",
    avatar: "https://picsum.photos/id/3/40/40",
    department: "研发部",
    position: "前端开发工程师",
    level: "P5",
    hireDate: "2022-05-10",
    email: "wangwu@example.com",
    phone: "13800138003",
    status: "active",
    address: "北京市西城区",
    entryDate: "2022-05-10",
    contractEndDate: "2025-05-09"
  },
  {
    id: "202",
    name: "赵六",
    avatar: "https://picsum.photos/id/4/40/40",
    department: "研发部",
    position: "后端开发工程师",
    level: "P6",
    hireDate: "2022-06-05",
    email: "zhaoliu@example.com",
    phone: "13800138004",
    status: "active",
    address: "北京市丰台区",
    entryDate: "2022-06-05",
    contractEndDate: "2025-06-04"
  },
  {
    id: "301",
    name: "孙七",
    avatar: "https://picsum.photos/id/5/40/40",
    department: "行政部",
    position: "行政专员",
    level: "P4",
    hireDate: "2022-07-15",
    email: "sunqi@example.com",
    phone: "13800138005",
    status: "probation",
    address: "北京市通州区",
    entryDate: "2023-07-15",
    contractEndDate: "2023-10-14"
  },
  {
    id: "401",
    name: "周八",
    avatar: "https://picsum.photos/id/6/40/40",
    department: "人力资源部",
    position: "HR专员",
    level: "P5",
    hireDate: "2022-08-20",
    email: "zhouba@example.com",
    phone: "13800138006",
    status: "active",
    address: "北京市昌平区",
    entryDate: "2022-08-20",
    contractEndDate: "2025-08-19"
  },
  {
    id: "501",
    name: "吴九",
    avatar: "https://picsum.photos/id/7/40/40",
    department: "财务部",
    position: "财务经理",
    level: "P6",
    hireDate: "2022-09-10",
    email: "wujiu@example.com",
    phone: "13800138007",
    status: "active",
    address: "北京市大兴区",
    entryDate: "2022-09-10",
    contractEndDate: "2025-09-09"
  },
  {
    id: "103",
    name: "郑十",
    avatar: "https://picsum.photos/id/8/40/40",
    department: "销售部",
    position: "销售专员",
    level: "P4",
    hireDate: "2022-10-05",
    email: "zhengshi@example.com",
    phone: "13800138008",
    status: "inactive",
    address: "北京市石景山区",
    entryDate: "2022-10-05",
    contractEndDate: "2023-04-04"
  }
]

// 部门选项
const departments = [
  { value: "all", label: "全部部门" },
  { value: "销售部", label: "销售部" },
  { value: "研发部", label: "研发部" },
  { value: "行政部", label: "行政部" },
  { value: "人力资源部", label: "人力资源部" },
  { value: "财务部", label: "财务部" }
]

// 员工状态标签
const employeeStatus = {
  active: { label: "在职", className: "bg-green-100 text-green-800 border-green-200" },
  probation: { label: "试用期", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  inactive: { label: "离职", className: "bg-gray-100 text-gray-800 border-gray-200" },
  transfer: { label: "调岗", className: "bg-blue-100 text-blue-800 border-blue-200" }
}

// 职级选项
const levels = [
  { value: "all", label: "全部职级" },
  { value: "P4", label: "P4" },
  { value: "P5", label: "P5" },
  { value: "P6", label: "P6" },
  { value: "P7", label: "P7" },
  { value: "P8", label: "P8" }
]

export function EmployeeManage() {
  const [employeesData, setEmployeesData] = useState(employees)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("list")

  // 过滤员工数据
  const filteredEmployees = employeesData.filter(
    emp => (
      // 搜索过滤
      (searchTerm === "" ||
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone.includes(searchTerm)) 
      // 部门过滤
      && (departmentFilter === "all" || emp.department === departmentFilter)
      // 职级过滤
      && (levelFilter === "all" || emp.level === levelFilter)
      // 状态过滤
      && (statusFilter === "all" || emp.status === statusFilter)
    )
  )

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id))
    } else {
      setSelectedEmployees([])
    }
  }

  // 处理单个选择
  const handleSelectEmployee = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, id])
    } else {
      setSelectedEmployees(prev => prev.filter(empId => empId !== id))
    }
  }

  // 处理添加员工
  const handleAddEmployee = () => {
    // 这里应该有保存逻辑
    setIsAddDialogOpen(false)
  }

  // 处理编辑员工
  const handleEditEmployee = (emp: any) => {
    setSelectedEmployee(emp)
    setIsEditDialogOpen(true)
  }

  // 处理保存编辑
  const handleSaveEdit = () => {
    // 这里应该有保存逻辑
    setIsEditDialogOpen(false)
  }

  // 处理删除员工
  const handleDeleteEmployee = () => {
    // 这里应该有删除逻辑
    console.log("删除员工:", selectedEmployee?.name)
  }

  // 处理批量删除
  const handleBatchDelete = () => {
    // 这里应该有批量删除逻辑
    console.log("批量删除员工:", selectedEmployees)
    setIsBatchDeleteDialogOpen(false)
    setSelectedEmployees([])
  }

  // 处理导出
  const handleExport = () => {
    // 这里应该有导出逻辑
    console.log("导出员工数据")
  }

  // 处理导入
  const handleImport = () => {
    // 这里应该有导入逻辑
    console.log("导入员工数据")
  }

  // 计算员工统计数据
  const employeeStats = {
    total: employeesData.length,
    active: employeesData.filter(emp => emp.status === "active").length,
    probation: employeesData.filter(emp => emp.status === "probation").length,
    inactive: employeesData.filter(emp => emp.status === "inactive").length
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              员工管理
            </CardTitle>
            <CardDescription>
              管理员工信息、部门分配和员工状态
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-3">
            <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="list">员工列表</TabsTrigger>
                <TabsTrigger value="statistics">员工统计</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === "list" && (
          <div className="space-y-4">
            {/* 搜索和筛选区域 */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜索员工..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="部门" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="职级" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    {Object.entries(employeeStatus).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" onClick={() => {
                  setSearchTerm("");
                  setDepartmentFilter("all");
                  setLevelFilter("all");
                  setStatusFilter("all");
                }}>
                  <Filter className="mr-2 h-4 w-4" />
                  重置筛选
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {selectedEmployees.length > 0 && (
                  >
                    <span className="text-sm text-gray-500 mr-2 mt-1">
                      已选择 {selectedEmployees.length} 项
                    </span>
                    <AlertDialog open={isBatchDeleteDialogOpen} onOpenChange={setIsBatchDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="mr-2 h-4 w-4" />
                          批量删除
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认批量删除员工</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要删除选中的 {selectedEmployees.length} 名员工吗？此操作不可撤销，删除后相关数据将丢失。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction className="text-red-500" onClick={handleBatchDelete}>
                            确认删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      新增员工
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>新增员工</DialogTitle>
                      <DialogDescription>添加新员工信息到系统</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label htmlFor="employee-name">员工姓名</label>
                          <Input id="employee-name" placeholder="输入员工姓名" />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="employee-department">所属部门</label>
                          <Select defaultValue="">
                            <SelectTrigger id="employee-department">
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
                          <label htmlFor="employee-position">职位</label>
                          <Input id="employee-position" placeholder="输入职位" />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="employee-level">职级</label>
                          <Select defaultValue="">
                            <SelectTrigger id="employee-level">
                              <SelectValue placeholder="选择职级" />
                            </SelectTrigger>
                            <SelectContent>
                              {levels.filter(l => l.value !== "all").map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="employee-email">邮箱</label>
                          <Input id="employee-email" type="email" placeholder="输入邮箱" />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="employee-phone">电话</label>
                          <Input id="employee-phone" placeholder="输入电话号码" />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="employee-hire-date">入职日期</label>
                          <Input id="employee-hire-date" type="date" />
                        <div>
                        <div className="grid gap-2">
                          <label htmlFor="employee-status">员工状态</label>
                          <Select defaultValue="probation">
                            <SelectTrigger id="employee-status">
                              <SelectValue placeholder="选择状态" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(employeeStatus).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        取消
                      </Button>
                      <Button onClick={handleAddEmployee}>保存</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" onClick={handleImport}>
                  导入员工
                </Button>
                <Button variant="ghost" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  导出
                </Button>
              </div>
            </div>

            {/* 员工列表表格 */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={filteredEmployees.length > 0 && selectedEmployees.length === filteredEmployees.length}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>员工信息</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>职位</TableHead>
                    <TableHead>职级</TableHead>
                    <TableHead>入职日期</TableHead>
                    <TableHead>联系信息</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={(checked) => handleSelectEmployee(employee.id, checked as boolean)}
                          aria-label={`Select ${employee.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback>{employee.name.substring(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.level}</TableCell>
                      <TableCell>{employee.hireDate}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-gray-500" />
                            <span className="truncate max-w-[150px]">{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-500" />
                            <span>{employee.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={employeeStatus[employee.status].className}>
                          {employeeStatus[employee.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee)}>
                            <Pencil2 className="mr-1 h-3 w-3" />
                            编辑
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="mr-1 h-3 w-3" />
                                删除
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>确认删除员工</AlertDialogTitle>
                                <AlertDialogDescription>
                                  确定要删除员工「{employee.name}」吗？此操作不可撤销，删除后相关数据将丢失。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction className="text-red-500" onClick={handleDeleteEmployee}>
                                  确认删除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Button variant="ghost" size="sm">
                            详情
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

        {activeTab === "statistics" && (
          <div className="space-y-6">
            {/* 员工统计概览 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">总员工数</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employeeStats.total}</div>
                  <div className="text-xs text-muted-foreground">所有部门员工总数</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">在职员工</CardTitle>
                  <Briefcase className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{employeeStats.active}</div>
                  <div className="text-xs text-muted-foreground">正式在职员工数量</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">试用期员工</CardTitle>
                  <Calendar className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{employeeStats.probation}</div>
                  <div className="text-xs text-muted-foreground">试用期员工数量</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">离职员工</CardTitle>
                  <Home className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-600">{employeeStats.inactive}</div>
                  <div className="text-xs text-muted-foreground">已离职员工数量</div>
                </CardContent>
              </Card>
            </div>

            {/* 部门员工分布 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>部门员工分布</CardTitle>
                <CardDescription>各部门员工数量统计</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.filter(d => d.value !== "all").map((dept) => {
                    const count = employeesData.filter(emp => emp.department === dept.value).length;
                    const percentage = employeesData.length > 0 ? Math.round((count / employeesData.length) * 100) : 0;
                    return (
                      <div key={dept.value}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{dept.label}</span>
                          <span className="text-sm text-gray-500">{count} 人 ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full bg-blue-500"
                            style={{ width: `${percentage}%` }}
                          /<div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 职级分布 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>员工职级分布</CardTitle>
                <CardDescription>不同职级员工数量统计</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {levels.filter(l => l.value !== "all").map((level) => {
                    const count = employeesData.filter(emp => emp.level === level.value).length;
                    return (
                      <Card key={level.value} variant="outline">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-center flex-col text-center">
                            <div className="text-3xl font-bold mb-1">{count}</div>
                            <div className="text-sm text-muted-foreground">{level.label}职级员工</div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
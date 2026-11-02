/**
 * @file 员工管理组件
 * @description 提供员工信息管理功能
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui/table"
import { Input } from "@yyc3/ui/input"
import { Button } from "@yyc3/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Badge } from "@yyc3/ui/badge"
import { Search, Plus, User, Briefcase, Clock, Phone, Mail, MapPin, Calendar, Filter } from "lucide-react"

// 模拟员工数据
const employees = [
  {
    id: "emp1",
    name: "张三",
    department: "销售部",
    position: "销售经理",
    employeeId: "EMP001",
    gender: "男",
    age: 35,
    joinDate: "2020-03-15",
    phone: "13800138001",
    email: "zhangsan@example.com",
    address: "北京市朝阳区建国路88号",
    salary: 18000,
    performance: "优秀",
    attendance: 98,
    status: "在职",
  },
  {
    id: "emp2",
    name: "李四",
    department: "技术部",
    position: "前端工程师",
    employeeId: "EMP002",
    gender: "女",
    age: 28,
    joinDate: "2021-05-20",
    phone: "13900139002",
    email: "lisi@example.com",
    address: "上海市浦东新区张江高科技园区",
    salary: 15000,
    performance: "良好",
    attendance: 95,
    status: "在职",
  },
  {
    id: "emp3",
    name: "王五",
    department: "人力资源部",
    position: "HR专员",
    employeeId: "EMP003",
    gender: "男",
    age: 30,
    joinDate: "2019-08-10",
    phone: "13700137003",
    email: "wangwu@example.com",
    address: "广州市天河区天河路385号",
    salary: 12000,
    performance: "良好",
    attendance: 99,
    status: "在职",
  },
  {
    id: "emp4",
    name: "赵六",
    department: "技术部",
    position: "后端工程师",
    employeeId: "EMP004",
    gender: "男",
    age: 32,
    joinDate: "2018-11-05",
    phone: "13600136004",
    email: "zhaoliu@example.com",
    address: "深圳市南山区科技园",
    salary: 16000,
    performance: "优秀",
    attendance: 94,
    status: "在职",
  },
  {
    id: "emp5",
    name: "钱七",
    department: "市场部",
    position: "市场专员",
    employeeId: "EMP005",
    gender: "女",
    age: 26,
    joinDate: "2022-01-25",
    phone: "13500135005",
    email: "qianqi@example.com",
    address: "成都市高新区天府大道",
    salary: 10000,
    performance: "一般",
    attendance: 96,
    status: "在职",
  },
]

const departments = ["销售部", "技术部", "人力资源部", "市场部", "财务部", "运营部"]
const positions = ["经理", "主管", "专员", "助理", "工程师", "设计师"]

const formatSalary = (salary: number) => {
  return `¥${salary.toLocaleString()}`
}

export function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [department, setDepartment] = useState("")
  const [status, setStatus] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[0] | null>(null)
  const [activeTab, setActiveTab] = useState("basic")

  // 筛选员工
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (department ? emp.department === department : true) &&
      (status ? emp.status === status : true),
  )

  // 根据绩效获取徽章颜色
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "优秀":
        return "bg-green-500"
      case "良好":
        return "bg-blue-500"
      case "一般":
        return "bg-yellow-500"
      case "较差":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // 根据状态获取徽章颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "在职":
        return "bg-green-500"
      case "请假":
        return "bg-yellow-500"
      case "离职":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">员工管理</h1>
          <p className="text-muted-foreground">管理公司员工信息和相关数据</p>
        </div>
        <Button>
          <Plus className="mr-1 h-4 w-4" /> 添加员工
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>员工列表</CardTitle>
          <CardDescription>查看和管理所有员工信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索员工姓名..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            <div>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            <div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="员工状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="在职">在职</SelectItem>
                  <SelectItem value="请假">请假</SelectItem>
                  <SelectItem value="离职">离职</SelectItem>
                </SelectContent>
              </Select>
            <div>
              <Button variant="outline">
                <Filter className="mr-1 h-4 w-4" /> 高级筛选
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>员工编号</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>部门</TableHead>
                  <TableHead>职位</TableHead>
                  <TableHead>入职日期</TableHead>
                  <TableHead>绩效</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <TableCell className="font-medium">{employee.employeeId}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.joinDate}</TableCell>
                    <TableCell>
                      <Badge className={getPerformanceColor(employee.performance)}>{employee.performance}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">查看详情</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedEmployee && (
        <Card>
          <CardHeader>
            <CardTitle>员工详情 - {selectedEmployee.name}</CardTitle>
            <CardDescription>查看员工详细信息和相关数据</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="basic">基本资料</TabsTrigger>
                <TabsTrigger value="work">工作信息</TabsTrigger>
                <TabsTrigger value="performance">绩效记录</TabsTrigger>
                <TabsTrigger value="attendance">考勤记录</TabsTrigger>
                <TabsTrigger value="salary">薪资信息</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="m-0 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">姓名:</span>
                      <span>{selectedEmployee.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">性别:</span>
                      <span>{selectedEmployee.gender}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">年龄:</span>
                      <span>{selectedEmployee.age}岁</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">电话:</span>
                      <span>{selectedEmployee.phone}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">邮箱:</span>
                      <span>{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">地址:</span>
                      <span>{selectedEmployee.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">员工编号:</span>
                      <span>{selectedEmployee.employeeId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">入职日期:</span>
                      <span>{selectedEmployee.joinDate}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="work" className="m-0 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">部门:</span>
                      <span>{selectedEmployee.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">职位:</span>
                      <span>{selectedEmployee.position}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Status className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">状态:</span>
                      <Badge className={getStatusColor(selectedEmployee.status)}>{selectedEmployee.status}</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="performance" className="m-0 pt-4">
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">当前绩效评级</div>
                    <Badge className={getPerformanceColor(selectedEmployee.performance)} variant="outline" className="mt-1 px-3 py-1">{selectedEmployee.performance}</Badge>
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>评估周期</TableHead>
                        <TableHead>绩效评级</TableHead>
                        <TableHead>评估人</TableHead>
                        <TableHead>评估日期</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2023年Q1</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">优秀</Badge>
                        </TableCell>
                        <TableCell>张三</TableCell>
                        <TableCell>2023-04-01</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">查看详情</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="attendance" className="m-0 pt-4">
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">出勤率（本月）</div>
                    <div className="text-2xl font-bold mt-1">{selectedEmployee.attendance}%</div>
                  <div>
                    <div className="text-sm text-muted-foreground">迟到次数（本月）</div>
                    <div className="text-2xl font-bold mt-1">2次</div>
                  <div>
                    <div className="text-sm text-muted-foreground">请假天数（本月）</div>
                    <div className="text-2xl font-bold mt-1">1天</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="salary" className="m-0 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">基本工资:</span>
                      <span>{formatSalary(selectedEmployee.salary)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">绩效奖金:</span>
                      <span>{formatSalary(Math.round(selectedEmployee.salary * 0.3))}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">应发工资:</span>
                        <span>{formatSalary(Math.round(selectedEmployee.salary * 1.3))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
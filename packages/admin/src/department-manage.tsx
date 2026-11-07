/**
 * @file 部门管理组件
 * @description 提供部门的增删改查、组织架构展示和部门负责人管理功能
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@yyc3/ui-enterprise/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui-enterprise/select"
import { Avatar, AvatarFallback, AvatarImage } from "@yyc3/ui-enterprise/avatar"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { ScrollArea } from "@yyc3/ui-enterprise/scroll-area"
import { Checkbox } from "@yyc3/ui-enterprise/checkbox"
import { Label } from "@yyc3/ui-enterprise/label"
import { Separator } from "@yyc3/ui-enterprise/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@yyc3/ui-enterprise/alert-dialog"
import { Search, Plus, Users, UserPlus, Trash2, Pencil2, ChevronDown, ChevronRight, Filter, Download, ArrowUpDown, MoreHorizontal } from "lucide-react"

// 模拟数据 - 部门列表
const departments = [
  {
    id: "1",
    name: "销售部",
    parentId: null,
    manager: { id: "101", name: "张三", avatar: "https://picsum.photos/id/1/40/40" },
    deputyManager: { id: "102", name: "李四", avatar: "https://picsum.photos/id/2/40/40" },
    memberCount: 35,
    createdTime: "2023-01-15",
    status: "active",
    description: "负责公司产品销售和客户关系维护",
    children: [
      {
        id: "1-1",
        name: "大客户销售组",
        parentId: "1",
        manager: { id: "103", name: "王五", avatar: "https://picsum.photos/id/3/40/40" },
        deputyManager: null,
        memberCount: 12,
        createdTime: "2023-02-20",
        status: "active",
        description: "负责大型企业客户开发和维护"
      },
      {
        id: "1-2",
        name: "渠道销售组",
        parentId: "1",
        manager: { id: "104", name: "赵六", avatar: "https://picsum.photos/id/4/40/40" },
        deputyManager: { id: "105", name: "孙七", avatar: "https://picsum.photos/id/5/40/40" },
        memberCount: 8,
        createdTime: "2023-03-10",
        status: "active",
        description: "负责渠道合作伙伴管理和开发"
      }
    ]
  },
  {
    id: "2",
    name: "研发部",
    parentId: null,
    manager: { id: "201", name: "钱八", avatar: "https://picsum.photos/id/6/40/40" },
    deputyManager: { id: "202", name: "周九", avatar: "https://picsum.photos/id/7/40/40" },
    memberCount: 45,
    createdTime: "2023-01-15",
    status: "active",
    description: "负责公司产品研发和技术创新",
    children: [
      {
        id: "2-1",
        name: "前端开发组",
        parentId: "2",
        manager: { id: "203", name: "吴十", avatar: "https://picsum.photos/id/8/40/40" },
        deputyManager: null,
        memberCount: 15,
        createdTime: "2023-02-01",
        status: "active",
        description: "负责产品前端界面开发"
      },
      {
        id: "2-2",
        name: "后端开发组",
        parentId: "2",
        manager: { id: "204", name: "郑十一", avatar: "https://picsum.photos/id/9/40/40" },
        deputyManager: { id: "205", name: "王十二", avatar: "https://picsum.photos/id/10/40/40" },
        memberCount: 18,
        createdTime: "2023-02-01",
        status: "active",
        description: "负责产品后端服务开发"
      }
    ]
  },
  {
    id: "3",
    name: "行政部",
    parentId: null,
    manager: { id: "301", name: "刘十三", avatar: "https://picsum.photos/id/11/40/40" },
    deputyManager: null,
    memberCount: 10,
    createdTime: "2023-01-15",
    status: "active",
    description: "负责公司行政事务和后勤保障"
  },
  {
    id: "4",
    name: "人力资源部",
    parentId: null,
    manager: { id: "401", name: "张十四", avatar: "https://picsum.photos/id/12/40/40" },
    deputyManager: { id: "402", name: "李十五", avatar: "https://picsum.photos/id/13/40/40" },
    memberCount: 8,
    createdTime: "2023-01-15",
    status: "active",
    description: "负责人力资源规划和员工管理"
  },
  {
    id: "5",
    name: "财务部",
    parentId: null,
    manager: { id: "501", name: "王十六", avatar: "https://picsum.photos/id/14/40/40" },
    deputyManager: { id: "502", name: "赵十七", avatar: "https://picsum.photos/id/15/40/40" },
    memberCount: 6,
    createdTime: "2023-01-15",
    status: "active",
    description: "负责公司财务管理和会计核算"
  }
]

// 模拟数据 - 员工列表（用于选择部门负责人）
const employees = [
  { id: "101", name: "张三", avatar: "https://picsum.photos/id/1/40/40", position: "销售总监" },
  { id: "102", name: "李四", avatar: "https://picsum.photos/id/2/40/40", position: "销售经理" },
  { id: "103", name: "王五", avatar: "https://picsum.photos/id/3/40/40", position: "大客户销售经理" },
  { id: "104", name: "赵六", avatar: "https://picsum.photos/id/4/40/40", position: "渠道销售经理" },
  { id: "105", name: "孙七", avatar: "https://picsum.photos/id/5/40/40", position: "渠道销售专员" },
  { id: "201", name: "钱八", avatar: "https://picsum.photos/id/6/40/40", position: "研发总监" },
  { id: "202", name: "周九", avatar: "https://picsum.photos/id/7/40/40", position: "研发经理" },
  { id: "203", name: "吴十", avatar: "https://picsum.photos/id/8/40/40", position: "前端开发负责人" },
  { id: "204", name: "郑十一", avatar: "https://picsum.photos/id/9/40/40", position: "后端开发负责人" },
  { id: "205", name: "王十二", avatar: "https://picsum.photos/id/10/40/40", position: "后端开发工程师" },
  { id: "301", name: "刘十三", avatar: "https://picsum.photos/id/11/40/40", position: "行政总监" },
  { id: "401", name: "张十四", avatar: "https://picsum.photos/id/12/40/40", position: "人力资源总监" },
  { id: "402", name: "李十五", avatar: "https://picsum.photos/id/13/40/40", position: "人力资源经理" },
  { id: "501", name: "王十六", avatar: "https://picsum.photos/id/14/40/40", position: "财务总监" },
  { id: "502", name: "赵十七", avatar: "https://picsum.photos/id/15/40/40", position: "财务经理" }
]

// 部门状态标签
const departmentStatus = {
  active: { label: "正常", className: "bg-green-100 text-green-800 border-green-200" },
  inactive: { label: "已停用", className: "bg-gray-100 text-gray-800 border-gray-200" },
  pending: { label: "待启用", className: "bg-yellow-100 text-yellow-800 border-yellow-200" }
}

// 扁平化部门数据
const flattenDepartments = (depts: any[], parentPath = [], level = 0) => {
  let result: any[] = [];
  depts.forEach(dept => {
    const currentPath = [...parentPath, dept.name];
    result.push({
      ...dept,
      path: currentPath.join(" / "),
      level
    });
    if (dept.children && dept.children.length > 0) {
      result = result.concat(flattenDepartments(dept.children, currentPath, level + 1));
    }
  });
  return result;
};

export function DepartmentManage() {
  const [departmentsData, setDepartmentsData] = useState(departments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
  const [expandedNodes, setExpandedNodes] = useState<string[]>(["1", "2"]);

  // 扁平化部门列表数据
  const flatDepartments = flattenDepartments(departmentsData);

  // 过滤部门数据
  const filteredDepartments = flatDepartments.filter(
    dept => dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 处理展开/折叠节点
  const toggleNode = (id: string) => {
    setExpandedNodes(prev =>
      prev.includes(id) ? prev.filter(nodeId => nodeId !== id) : [...prev, id]
    );
  };

  // 处理添加部门
  const handleAddDepartment = () => {
    // 这里应该有保存逻辑
    setIsAddDialogOpen(false);
  };

  // 处理编辑部门
  const handleEditDepartment = (dept: any) => {
    setSelectedDepartment(dept);
    setIsEditDialogOpen(true);
  };

  // 处理保存编辑
  const handleSaveEdit = () => {
    // 这里应该有保存逻辑
    setIsEditDialogOpen(false);
  };

  // 处理删除部门
  const handleDeleteDepartment = () => {
    // 这里应该有删除逻辑
    console.log("删除部门:", selectedDepartment?.name);
  };

  // 处理导出
  const handleExport = () => {
    // 这里应该有导出逻辑
    console.log("导出部门数据");
  };

  // 渲染组织架构树
  const renderDepartmentTree = (depts: any[], level = 0) => {
    return depts.map(dept => {
      const isExpanded = expandedNodes.includes(dept.id);
      const hasChildren = dept.children && dept.children.length > 0;
      
      return (
        <div key={dept.id} className="space-y-1">
          <div 
            className={`flex items-center p-2 rounded-md cursor-pointer transition-colors hover:bg-gray-100 ${selectedDepartment?.id === dept.id ? 'bg-blue-50' : ''}`}
            style={{ paddingLeft: `${level * 24 + 16}px` }}
            onClick={() => setSelectedDepartment(dept)}
          >
            {hasChildren && (
              <button
                className="mr-2 text-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(dept.id);
                }}
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            )}
            <div className={`font-medium ${level === 0 ? 'text-lg font-semibold' : ''}`}>
              {dept.name}
            </div>
            <Badge variant="outline" className={`ml-2 ${departmentStatus[dept.status].className}`}>
              {departmentStatus[dept.status].label}
            </Badge>
            <div className="ml-auto flex items-center gap-1 text-sm text-gray-500">
              <span>{dept.memberCount}人</span>
              {dept.manager && (
                <div className="flex items-center ml-2">
                  <span className="mr-1">负责人:</span>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={dept.manager.avatar} alt={dept.manager.name} />
                    <AvatarFallback>{dept.manager.name.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>
          {hasChildren && isExpanded && (
            <div className="border-l-2 border-gray-200 ml-6">
              {renderDepartmentTree(dept.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              部门管理
            </CardTitle>
            <CardDescription>
              管理公司部门结构、负责人及部门成员
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-3">
            <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="list">部门列表</TabsTrigger>
                <TabsTrigger value="structure">组织架构</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === "list" && (
          <div className="space-y-4">
            {/* 搜索和操作区域 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜索部门..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      新增部门
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>新增部门</DialogTitle>
                      <DialogDescription>创建一个新的部门或子部门</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="parent-department">上级部门</label>
                        <Select defaultValue="">
                          <SelectTrigger id="parent-department">
                            <SelectValue placeholder="选择上级部门" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">无（顶级部门）</SelectItem>
                            {departmentsData.filter(d => !d.parentId).map(dept => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="department-name">部门名称</label>
                        <Input id="department-name" placeholder="输入部门名称" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="department-manager">部门负责人</label>
                        <Select defaultValue="">
                          <SelectTrigger id="department-manager">
                            <SelectValue placeholder="选择部门负责人" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map(emp => (
                              <SelectItem key={emp.id} value={emp.id}>
                                {emp.name} - {emp.position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="department-deputy">副负责人</label>
                        <Select defaultValue="">
                          <SelectTrigger id="department-deputy">
                            <SelectValue placeholder="选择副负责人（可选）" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">无</SelectItem>
                            {employees.map(emp => (
                              <SelectItem key={emp.id} value={emp.id}>
                                {emp.name} - {emp.position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="department-description">部门描述</label>
                        <textarea
                          id="department-description"
                          className="flex h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="输入部门描述"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        取消
                      </Button>
                      <Button onClick={handleAddDepartment}>保存</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  导出
                </Button>
              </div>
            </div>

            {/* 部门列表表格 */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>部门名称</TableHead>
                    <TableHead>部门路径</TableHead>
                    <TableHead>负责人</TableHead>
                    <TableHead>副负责人</TableHead>
                    <TableHead>成员数量</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {Array.from({ length: dept.level }).map((_, i) => (
                            <div key={i} className="w-4 h-0.5 bg-gray-300 mr-1" />
                          ))}
                          {dept.name}
                        </div>
                      </TableCell>
                      <TableCell>{dept.path}</TableCell>
                      <TableCell>
                        {dept.manager ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={dept.manager.avatar} alt={dept.manager.name} />
                              <AvatarFallback>{dept.manager.name.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                            <span>{dept.manager.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">未设置</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {dept.deputyManager ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={dept.deputyManager.avatar} alt={dept.deputyManager.name} />
                              <AvatarFallback>{dept.deputyManager.name.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                            <span>{dept.deputyManager.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">未设置</span>
                        )}
                      </TableCell>
                      <TableCell>{dept.memberCount}</TableCell>
                      <TableCell>{dept.createdTime}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={departmentStatus[dept.status].className}>
                          {departmentStatus[dept.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditDepartment(dept)}>
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
                                <AlertDialogTitle>确认删除部门</AlertDialogTitle>
                                <AlertDialogDescription>
                                  确定要删除「{dept.name}」部门吗？此操作不可撤销，删除后相关数据将丢失。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction className="text-red-500" onClick={handleDeleteDepartment}>
                                  确认删除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeTab === "structure" && (
          <div className="space-y-4">
            {/* 组织架构树 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>组织架构图</CardTitle>
                <CardDescription>查看公司部门层级结构和负责人</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {renderDepartmentTree(departmentsData)}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* 选中部门详情 */}
            {selectedDepartment && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>部门详情</CardTitle>
                  <CardDescription>查看和编辑部门详细信息</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="dept-detail-name">部门名称</Label>
                        <Input id="dept-detail-name" value={selectedDepartment.name} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dept-detail-path">部门路径</Label>
                        <Input id="dept-detail-path" value={selectedDepartment.path} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>负责人</Label>
                        <div className="flex items-center gap-2 p-2 border rounded-md">
                          {selectedDepartment.manager ? (
                            <>
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedDepartment.manager.avatar} alt={selectedDepartment.manager.name} />
                                <AvatarFallback>{selectedDepartment.manager.name.substring(0, 1)}</AvatarFallback>
                              </Avatar>
                              <span>{selectedDepartment.manager.name}</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">未设置</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>副负责人</Label>
                        <div className="flex items-center gap-2 p-2 border rounded-md">
                          {selectedDepartment.deputyManager ? (
                            <>
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedDepartment.deputyManager.avatar} alt={selectedDepartment.deputyManager.name} />
                                <AvatarFallback>{selectedDepartment.deputyManager.name.substring(0, 1)}</AvatarFallback>
                              </Avatar>
                              <span>{selectedDepartment.deputyManager.name}</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">未设置</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="dept-detail-members">成员数量</Label>
                        <Input id="dept-detail-members" value={selectedDepartment.memberCount} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dept-detail-created">创建时间</Label>
                        <Input id="dept-detail-created" value={selectedDepartment.createdTime} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dept-detail-status">状态</Label>
                        <div className="flex items-center gap-2 p-2 border rounded-md">
                          <Badge variant="outline" className={departmentStatus[selectedDepartment.status].className}>
                            {departmentStatus[selectedDepartment.status].label}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dept-detail-description">部门描述</Label>
                        <textarea
                          id="dept-detail-description"
                          className="flex h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={selectedDepartment.description}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => handleEditDepartment(selectedDepartment)}>
                      <Pencil2 className="mr-2 h-4 w-4" />
                      编辑详情
                    </Button>
                    <Button onClick={() => {
                      // 这里应该有查看成员列表的逻辑
                      console.log("查看部门成员列表");
                    }}>
                      <Users className="mr-2 h-4 w-4" />
                      查看成员
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
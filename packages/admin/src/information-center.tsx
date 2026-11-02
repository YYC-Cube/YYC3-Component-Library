/**
 * @file 信息中心组件
 * @description 提供公司内部信息和通信渠道，包括员工之声、通知、文档、频道和部门管理
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Input, Textarea } from "@yyc3/ui/input"
import { Button } from "@yyc3/ui/button"
import { ScrollArea } from "@yyc3/ui/scroll-area"
import { Badge } from "@yyc3/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@yyc3/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Label } from "@yyc3/ui/label"
import { Mic, Bell, FileText, MessageSquare, Users, Plus, ChevronRight, AlertCircle } from "lucide-react"
import { motion as MotionCard } from "framer-motion"

// 模拟数据
const employeeVoiceMessages = [
  { id: 1, employeeName: "张三", content: "建议优化报销流程，目前审批时间过长", status: "resolved", timestamp: new Date(2024, 9, 10, 14, 30) },
  { id: 2, employeeName: "李四", content: "希望能增加远程工作的机会", status: "inProgress", timestamp: new Date(2024, 9, 12, 10, 15) },
  { id: 3, employeeName: "王五", content: "食堂饭菜质量有待提高", status: "pending", timestamp: new Date(2024, 9, 14, 16, 45) },
]

const notifications = [
  { id: 1, title: "公司年会通知", content: "公司将于12月30日举办年会，请各部门做好准备", type: "announcement", read: false, createdAt: new Date(2024, 9, 15) },
  { id: 2, title: "系统维护公告", content: "系统将于本周六进行维护，期间可能无法访问", type: "system", read: true, createdAt: new Date(2024, 9, 14) },
  { id: 3, title: "销售部月度会议", content: "销售部月度会议将于10月20日上午9点举行", type: "department", read: false, createdAt: new Date(2024, 9, 13) },
]

const notificationDocuments = [
  { id: 1, title: "员工手册v2.0", type: "pdf", date: "2024-10-01" },
  { id: 2, title: "新员工入职指南", type: "doc", date: "2024-09-15" },
  { id: 3, title: "公司规章制度", type: "pdf", date: "2024-08-20" },
  { id: 4, title: "绩效考核标准", type: "excel", date: "2024-07-10" },
]

const channels = [
  { id: 1, name: "全员公告", type: "public", members: [1, 2, 3, 4, 5] },
  { id: 2, name: "销售部交流", type: "department", members: [1, 2, 3] },
  { id: 3, name: "技术讨论组", type: "public", members: [3, 4, 5] },
]

const departments = [
  { id: 1, name: "销售部", leader: "张三", members: [1, 2, 3] },
  { id: 2, name: "研发部", leader: "王五", members: [3, 4, 5] },
  { id: 3, name: "市场部", leader: null, members: [6, 7, 8] },
]

const getDocumentIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-8 w-8 text-red-500" />
    case "doc":
      return <FileText className="h-8 w-8 text-blue-500" />
    case "excel":
      return <FileText className="h-8 w-8 text-green-500" />
    default:
      return <FileText className="h-8 w-8 text-gray-500" />
  }
}

const mockUser = {
  id: 1,
  name: "管理员",
  role: "manager"
}

export function InformationCenter() {
  const [state, setState] = useState({ user: mockUser })
  const [newVoiceMessage, setNewVoiceMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const [newChannelName, setNewChannelName] = useState("")
  const [newChannelType, setNewChannelType] = useState("public")
  const [newDepartmentName, setNewDepartmentName] = useState("")

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredChannels = channels.filter(
    (channel) => channel.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDepartments = departments.filter(
    (department) => department.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addEmployeeVoiceMessage = () => {
    if (newVoiceMessage.trim()) {
      // 实际应用中这里会调用API
      setNewVoiceMessage("")
    }
  }

  const updateMessageStatus = (id: number, status: string) => {
    // 实际应用中这里会调用API
  }

  const markNotificationAsRead = (id: number) => {
    // 实际应用中这里会调用API
  }

  const addChannel = (channel: any) => {
    // 实际应用中这里会调用API
  }

  const addDepartment = (department: any) => {
    // 实际应用中这里会调用API
  }

  const updateDepartmentLeader = (id: number, leaderId: string) => {
    // 实际应用中这里会调用API
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Employee Voice Module */}
      <MotionCard
        className="bg-tech-blue-800 text-tech-blue-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mic className="mr-2 h-5 w-5" />
            员工之声
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Textarea
              placeholder="分享您的想法、建议或疑问..."
              value={newVoiceMessage}
              onChange={(e) => setNewVoiceMessage(e.target.value)}
              className="bg-tech-blue-700 text-tech-blue-100 border-tech-blue-600"
            />
            <Button onClick={addEmployeeVoiceMessage} className="mt-2">
              提交反馈
            </Button>
          </div>
          <ScrollArea className="h-[200px]">
            {employeeVoiceMessages.map((message, index) => (
              <MotionCard
                key={message.id}
                className="mb-4 bg-tech-blue-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{message.employeeName}</h3>
                      <p className="text-sm text-tech-blue-300 mt-1">{message.content}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        message.status === "pending"
                          ? "bg-yellow-500"
                          : message.status === "inProgress"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }
                    >
                      {message.status === "pending" ? "待处理" : message.status === "inProgress" ? "处理中" : "已解决"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-tech-blue-400">{message.timestamp.toLocaleString()}</span>
                    {state.user.role === "manager" && (
                      <Select
                        value={message.status}
                        onValueChange={(value) =>
                          updateMessageStatus(message.id, value as "pending" | "inProgress" | "resolved")
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="更新状态" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">待处理</SelectItem>
                          <SelectItem value="inProgress">处理中</SelectItem>
                          <SelectItem value="resolved">已解决</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </MotionCard>
            ))}
          </ScrollArea>
        </CardContent>
      </MotionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 最新通知模块 */}
        <MotionCard
          className="bg-tech-blue-800 text-tech-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              最新通知
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {filteredNotifications.slice(0, 5).map((notification, index) => (
                <MotionCard
                  key={notification.id}
                  className="mb-4 bg-tech-blue-700 cursor-pointer hover:bg-tech-blue-600 transition-colors duration-200"
                  onClick={() => setSelectedNotification(notification)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className="text-sm text-tech-blue-300 mt-1 line-clamp-2">{notification.content}</p>
                      </div>
                      <Badge variant="outline" className={notification.read ? "bg-tech-blue-600" : "bg-tech-blue-500"}>
                        {notification.read ? "已读" : "未读"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-tech-blue-400">{notification.createdAt.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </MotionCard>
              ))}
            </ScrollArea>
          </CardContent>
        </MotionCard>

        {/* 通知文档模块 */}
        <MotionCard
          className="bg-tech-blue-800 text-tech-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              通知文档
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {notificationDocuments.map((doc, index) => (
                <MotionCard
                  key={doc.id}
                  className="bg-tech-blue-700 hover:bg-tech-blue-600 transition-colors duration-200 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <CardContent className="p-4 flex items-center">
                    {getDocumentIcon(doc.type)}
                    <div className="ml-4">
                      <h4 className="font-semibold">{doc.title}</h4>
                      <p className="text-xs text-tech-blue-300">{doc.date}</p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-tech-blue-300" />
                  </CardContent>
                </MotionCard>
              ))}
            </div>
          </CardContent>
        </MotionCard>

        {/* 频道模块 */}
        <MotionCard
          className="bg-tech-blue-800 text-tech-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              频道
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> 新建频道
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-tech-blue-700 text-tech-blue-100">
                <DialogHeader>
                  <DialogTitle>新建频道</DialogTitle>
                  <DialogDescription>创建一个新的公共或部门频道。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="channel-name" className="text-right">
                      频道名称
                    </Label>
                    <Input
                      id="channel-name"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      className="col-span-3 bg-tech-blue-600"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="channel-type" className="text-right">
                      频道类型
                    </Label>
                    <Select value={newChannelType} onValueChange={setNewChannelType}>
                      <SelectTrigger className="col-span-3 bg-tech-blue-600">
                        <SelectValue placeholder="选择频道类型" />
                      </SelectTrigger>
                      <SelectContent className="bg-tech-blue-600">
                        <SelectItem value="public">公共</SelectItem>
                        <SelectItem value="department">部门</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      if (newChannelName) {
                        addChannel({
                          name: newChannelName,
                          type: newChannelType as "public" | "department",
                          members: [],
                        })
                        setNewChannelName("")
                        setNewChannelType("public")
                      }
                    }}
                  >
                    创建频道
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {filteredChannels.map((channel, index) => (
                <MotionCard
                  key={channel.id}
                  className="mb-4 bg-tech-blue-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-tech-blue-300" />
                        <h3 className="font-semibold">{channel.name}</h3>
                      </div>
                      <Badge
                        variant="outline"
                        className={channel.type === "public" ? "bg-tech-blue-500" : "bg-tech-blue-600"}
                      >
                        {channel.type === "public" ? "公共" : "部门"}
                      </Badge>
                    </div>
                    <p className="text-sm text-tech-blue-300 mt-2">成员数: {channel.members.length}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      进入频道
                    </Button>
                  </CardContent>
                </MotionCard>
              ))}
            </ScrollArea>
          </CardContent>
        </MotionCard>

        {/* 部门模块 */}
        <MotionCard
          className="bg-tech-blue-800 text-tech-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              部门
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> 新建部门
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-tech-blue-700 text-tech-blue-100">
                <DialogHeader>
                  <DialogTitle>新建部门</DialogTitle>
                  <DialogDescription>创建一个新的部门。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department-name" className="text-right">
                      部门名称
                    </Label>
                    <Input
                      id="department-name"
                      value={newDepartmentName}
                      onChange={(e) => setNewDepartmentName(e.target.value)}
                      className="col-span-3 bg-tech-blue-600"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      if (newDepartmentName) {
                        addDepartment({ name: newDepartmentName, leader: null, members: [] })
                        setNewDepartmentName("")
                      }
                    }}
                  >
                    创建部门
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {filteredDepartments.map((department, index) => (
                <MotionCard
                  key={department.id}
                  className="mb-4 bg-tech-blue-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-tech-blue-300" />
                        <h3 className="font-semibold">{department.name}</h3>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            {department.leader ? "更改负责人" : "设置负责人"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-tech-blue-700 text-tech-blue-100">
                          <DialogHeader>
                            <DialogTitle>{department.leader ? "更改负责人" : "设置负责人"}</DialogTitle>
                            <DialogDescription>为 {department.name} 部门设置或更改负责人。</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="leader-id" className="text-right">
                                负责人ID
                              </Label>
                              <Input
                                id="leader-id"
                                className="col-span-3 bg-tech-blue-600"
                                placeholder="输入负责人ID"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() => {
                                const leaderId = (document.getElementById("leader-id") as HTMLInputElement).value
                                if (leaderId) {
                                  updateDepartmentLeader(department.id, leaderId)
                                }
                              }}
                            >
                              确认
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-sm text-tech-blue-300 mt-2">
                      成员数: {department.members.length}
                      {department.leader && ` | 负责人: ${department.leader}`}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      查看详情
                    </Button>
                  </CardContent>
                </MotionCard>
              ))}
            </ScrollArea>
          </CardContent>
        </MotionCard>
      </div>

      {selectedNotification && (
        <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
          <DialogContent className="sm:max-w-[525px] bg-tech-blue-700 text-tech-blue-100">
            <DialogHeader>
              <DialogTitle>{selectedNotification.title}</DialogTitle>
              <DialogDescription>
                {selectedNotification.type === "system" && (
                  <AlertCircle className="inline-block mr-1 h-4 w-4 text-yellow-500" />
                )}
                {selectedNotification.type === "announcement" && (
                  <Bell className="inline-block mr-1 h-4 w-4 text-blue-500" />
                )}
                {selectedNotification.type === "department" && (
                  <Users className="inline-block mr-1 h-4 w-4 text-green-500" />
                )}
                {selectedNotification.type.charAt(0).toUpperCase() + selectedNotification.type.slice(1)} 通知
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>{selectedNotification.content}</p>
            </div>
            <div className="text-sm text-tech-blue-300">
              发布时间: {selectedNotification.createdAt.toLocaleString()}
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  markNotificationAsRead(selectedNotification.id)
                  setSelectedNotification(null)
                }}
              >
                标记为已读
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
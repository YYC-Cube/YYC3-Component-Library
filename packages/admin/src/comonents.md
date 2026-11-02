# 双导管理

## 代码文件内容

## components/app-logo.tsx

/**
 * @file 应用logo组件
 * @description 显示应用的logo
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import React from 'react';

const AppLogo: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <img src="/logo.svg" alt="应用logo" className="h-12 w-12" />
    </div>
  );
};

import { cn } from "@/lib/utils"

interface AppLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function AppLogo({ className, size = "md" }: AppLogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <h1 className={cn("font-bold tracking-tight text-tech-blue-100", sizeClasses[size])}>
        『 言语 』 经管运维
        <span
          className="inline-block font-extrabold text-tech-blue-300 italic mx-0.5 animate-pulse"
          style={{
            fontSize: "1.4em",
            transform: "translateY(0.05em)",
            fontWeight: 900,
            textShadow: "0 0 10px #4DA6FF, 0 0 20px #1A8CFF",
          }}
        >
          e
        </span>
        中心
      </h1>
      <p className="mt-1 text-sm text-tech-blue-300">
        "言语启航，协同翱翱
        <br />
      </p>
    </div>
  )
}

## components/automated-reminders.tsx

/**
 * @file 自动提醒组件
 * @description 显示和管理自动提醒设置
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, Clock, Filter, Plus, Search, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

// 模拟数据
const reminders = [
  {
    id: "R-001",
    title: "销售周报提交",
    description: "提交本周销售数据报告",
    type: "周期性",
    frequency: "每周五 18:00",
    nextTime: "2024-03-08 18:00",
    status: "已启用",
    target: "销售部全员",
    channel: ["系统", "邮件"],
  },
  {
    id: "R-002",
    title: "月度业绩会议",
    description: "讨论上月业绩完成情况",
    type: "周期性",
    frequency: "每月第一个周一 10:00",
    nextTime: "2024-04-01 10:00",
    status: "已启用",
    target: "管理层",
    channel: ["系统", "邮件", "短信"],
  },
  {
    id: "R-003",
    title: "Q1报告截止",
    description: "提交Q1季度总结报告",
    type: "一次性",
    frequency: "无",
    nextTime: "2024-04-05 18:00",
    status: "已启用",
    target: "各部门负责人",
    channel: ["系统", "邮件", "短信"],
  },
  {
    id: "R-004",
    title: "客户回访",
    description: "联系上月新增的重点客户",
    type: "周期性",
    frequency: "每月15日 10:00",
    nextTime: "2024-03-15 10:00",
    status: "已启用",
    target: "客户经理",
    channel: ["系统", "邮件"],
  },
  {
    id: "R-005",
    title: "系统维护通知",
    description: "系统将进行例行维护",
    type: "一次性",
    frequency: "无",
    nextTime: "2024-03-10 22:00",
    status: "已启用",
    target: "全体员工",
    channel: ["系统", "邮件", "短信"],
  },
]

const logs = [
  {
    id: "L-001",
    reminderId: "R-001",
    title: "销售周报提交",
    time: "2024-03-01 18:00",
    status: "已发送",
    target: "销售部全员",
    channel: ["系统", "邮件"],
    readStatus: "12/15已读",
  },
  {
    id: "L-002",
    reminderId: "R-002",
    title: "月度业绩会议",
    time: "2024-03-04 10:00",
    status: "已发送",
    target: "管理层",
    channel: ["系统", "邮件", "短信"],
    readStatus: "8/8已读",
  },
  {
    id: "L-003",
    reminderId: "R-004",
    title: "客户回访",
    time: "2024-02-15 10:00",
    status: "已发送",
    target: "客户经理",
    channel: ["系统", "邮件"],
    readStatus: "5/6已读",
  },
  {
    id: "L-004",
    reminderId: "R-001",
    title: "销售周报提交",
    time: "2024-02-23 18:00",
    status: "已发送",
    target: "销售部全员",
    channel: ["系统", "邮件"],
    readStatus: "14/15已读",
  },
]

export function AutomatedReminders() {
  const [activeTab, setActiveTab] = useState("reminders")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch =
      reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || reminder.type === typeFilter
    const matchesStatus = statusFilter === "all" || reminder.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "已启用":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            已启用
          </Badge>
        )
      case "已禁用":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            已禁用
          </Badge>
        )
      case "已发送":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            已发送
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getChannelBadges = (channels: string[]) => {
    return (
      <div className="flex flex-wrap gap-1">
        {channels.map((channel) => {
          let color = ""
          switch (channel) {
            case "系统":
              color = "bg-blue-100 text-blue-800 border-blue-200"
              break
            case "邮件":
              color = "bg-green-100 text-green-800 border-green-200"
              break
            case "短信":
              color = "bg-yellow-100 text-yellow-800 border-yellow-200"
              break
            default:
              color = ""
          }
          return (
            <Badge key={channel} variant="outline" className={color}>
              {channel}
            </Badge>
          )
        })}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>自动提醒</CardTitle>
          <CardDescription>设置工作节点自动提醒、督促与跟进</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" /> 新建提醒
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="reminders" className="flex items-center gap-1">
                <Bell className="h-4 w-4" /> 提醒设置
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> 提醒记录
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="text"
                  placeholder="搜索提醒名称或ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {activeTab === "reminders" && (
                <>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="类型筛选" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        <SelectItem value="周期性">周期性</SelectItem>
                        <SelectItem value="一次性">一次性</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="状态筛选" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="已启用">已启用</SelectItem>
                        <SelectItem value="已禁用">已禁用</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>

          <TabsContent value="reminders" className="space-y-4 m-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>提醒名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>频率/时间</TableHead>
                    <TableHead>下次提醒</TableHead>
                    <TableHead>提醒对象</TableHead>
                    <TableHead>提醒渠道</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReminders.map((reminder) => (
                    <TableRow key={reminder.id}>
                      <TableCell className="font-medium">{reminder.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{reminder.title}</div>
                          <div className="text-xs text-muted-foreground">{reminder.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{reminder.type}</TableCell>
                      <TableCell>{reminder.frequency}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{reminder.nextTime}</span>
                        </div>
                      </TableCell>
                      <TableCell>{reminder.target}</TableCell>
                      <TableCell>{getChannelBadges(reminder.channel)}</TableCell>
                      <TableCell>{getStatusBadge(reminder.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Switch checked={reminder.status === "已启用"} onCheckedChange={() => {}} />
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4 m-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>提醒名称</TableHead>
                    <TableHead>发送时间</TableHead>
                    <TableHead>提醒对象</TableHead>
                    <TableHead>提醒渠道</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>阅读状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>{log.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{log.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell>{getChannelBadges(log.channel)}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>{log.readStatus}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          查看详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

## components/communication.tsx
/**
 * @file 通信组件
 * @description 提供应用内的通信功能，包括聊天、文件分享、视频通话等
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Clock, MessageSquare, Paperclip, Plus, Search, Send, Users, Video } from "lucide-react"

// 模拟数据
const conversations = [
  {
    id: "conv1",
    name: "销售部团队",
    type: "group",
    lastMessage: "下周一开会讨论Q2销售策略",
    time: "10:30",
    unread: 3,
    avatar: "/placeholder.svg?height=40&width=40",
    members: 8,
  },
  {
    id: "conv2",
    name: "李四",
    type: "individual",
    lastMessage: "已经更新了营销方案，请查收",
    time: "昨天",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
  },
  {
    id: "conv3",
    name: "产品研发群",
    type: "group",
    lastMessage: "新版本已经发布，请大家测试反馈",
    time: "昨天",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    members: 12,
  },
  {
    id: "conv4",
    name: "王五",
    type: "individual",
    lastMessage: "客户反馈已经整理好了",
    time: "周一",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
  },
  {
    id: "conv5",
    name: "管理层会议",
    type: "group",
    lastMessage: "请准备月度报告",
    time: "3/1",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    members: 5,
  },
]

const messages = [
  {
    id: "msg1",
    sender: "张三",
    content: "各位好，下周一我们需要讨论Q2的销售策略，请大家准备好各自负责区域的销售预测。",
    time: "今天 10:15",
    avatar: "/placeholder.svg?height=40&width=40",
    isSelf: false,
  },
  {
    id: "msg2",
    sender: "李四",
    content: "好的，我已经准备好华东区的数据了。",
    time: "今天 10:20",
    avatar: "/placeholder.svg?height=40&width=40",
    isSelf: false,
  },
  {
    id: "msg3",
    sender: "王五",
    content: "华北区的数据还在整理中，预计今天下午能完成。",
    time: "今天 10:25",
    avatar: "/placeholder.svg?height=40&width=40",
    isSelf: false,
  },
  {
    id: "msg4",
    sender: "我",
    content: "好的，请大家尽量在周五前提交，这样我们可以提前做一些准备工作。",
    time: "今天 10:30",
    avatar: "/placeholder.svg?height=40&width=40",
    isSelf: true,
  },
]

const meetings = [
  {
    id: "meet1",
    title: "销售部周会",
    time: "周一 10:00-11:30",
    organizer: "张三",
    participants: 8,
    status: "upcoming",
  },
  {
    id: "meet2",
    title: "产品研发讨论",
    time: "周二 14:00-15:30",
    organizer: "李四",
    participants: 5,
    status: "upcoming",
  },
  {
    id: "meet3",
    title: "客户满意度分析",
    time: "周三 09:30-10:30",
    organizer: "王五",
    participants: 4,
    status: "upcoming",
  },
]

export function Communication() {
  const [activeTab, setActiveTab] = useState("chat")
  const [searchTerm, setSearchTerm] = useState("")
  const [messageText, setMessageText] = useState("")
  const [activeConversation, setActiveConversation] = useState(conversations[0])

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageText.trim()) {
      // 在实际应用中，这里会发送消息到后端
      setMessageText("")
    }
  }

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader className="px-4 py-3 border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> 沟通
            </TabsTrigger>
            <TabsTrigger value="meeting" className="flex items-center gap-2">
              <Video className="h-4 w-4" /> 会议
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0 flex h-[calc(100%-56px)]">
        <TabsContent value="chat" className="flex h-full w-full m-0">
          <div className="w-1/3 border-r h-full flex flex-col">
            <div className="p-3 border-b">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="搜索对话..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer ${
                    activeConversation.id === conv.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setActiveConversation(conv)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conv.avatar} alt={conv.name} />
                      <AvatarFallback>{conv.name[0]}</AvatarFallback>
                    </Avatar>
                    {conv.type === "individual" && conv.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{conv.name}</span>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground truncate">{conv.lastMessage}</span>
                      {conv.unread > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-2/3 flex flex-col h-full">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
                  <AvatarFallback>{activeConversation.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{activeConversation.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {activeConversation.type === "group" ? (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{activeConversation.members} 成员</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span>{activeConversation.online ? "在线" : "离线"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.isSelf ? "justify-end" : ""}`}>
                  {!message.isSelf && (
                    <Avatar>
                      <AvatarImage src={message.avatar} alt={message.sender} />
                      <AvatarFallback>{message.sender[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[70%] ${message.isSelf ? "items-end" : "items-start"}`}>
                    {!message.isSelf && <div className="text-sm font-medium mb-1">{message.sender}</div>}
                    <div className="flex flex-col gap-1">
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          message.isSelf ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className="text-xs text-muted-foreground">{message.time}</div>
                    </div>
                  </div>
                  {message.isSelf && (
                    <Avatar>
                      <AvatarImage src={message.avatar} alt={message.sender} />
                      <AvatarFallback>{message.sender[0]}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
            <div className="p-3 border-t">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button variant="outline" size="icon" type="button">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  type="text"
                  placeholder="输入消息..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="meeting" className="h-full w-full m-0 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">会议安排</h3>
            <Button>
              <Plus className="mr-1 h-4 w-4" /> 创建会议
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">即将开始的会议</h4>
            {meetings.map((meeting) => (
              <Card key={meeting.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{meeting.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{meeting.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{meeting.participants} 参与者</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        详情
                      </Button>
                      <Button size="sm">加入</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  )
}

## components/data-dashboard.tsx
/**
 * @file 数据看板组件
 * @description 显示和管理公司数据的看板
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

export function DataDashboard() {
  return (
    <div className="text-tech-blue-100">
      <h2 className="text-2xl font-bold mb-4">数据看板</h2>
      <p>这里是数据看板模块的内容。</p>
    </div>
  )
}

## components/employee-management.tsx
/**
 * @file 员工管理组件
 * @description 管理公司员工信息和相关数据
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, ChevronRight, FileText, DollarSign, Clock, Award } from "lucide-react"

// 模拟数据
const employees = [
  { id: 1, name: "张三", department: "销售部", position: "销售经理", status: "在职" },
  { id: 2, name: "李四", department: "市场部", position: "市场专员", status: "在职" },
  { id: 3, name: "王五", department: "人事部", position: "人事主管", status: "在职" },
]

export function EmployeeManagement() {
  const [activeTab, setActiveTab] = useState("basic")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="bg-tech-blue-800 text-tech-blue-100">
      <CardHeader>
        <CardTitle>员工管理</CardTitle>
        <CardDescription>管理公司员工信息和相关数据</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">基本资料</TabsTrigger>
            <TabsTrigger value="work">工作信息</TabsTrigger>
            <TabsTrigger value="salary">薪资管理</TabsTrigger>
            <TabsTrigger value="attendance">考勤记录</TabsTrigger>
            <TabsTrigger value="performance">绩效评估</TabsTrigger>
          </TabsList>
          <div className="mt-4 flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索员工..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-tech-blue-700 text-tech-blue-100 border-tech-blue-600"
              />
            </div>
            <Button className="bg-tech-blue-600 hover:bg-tech-blue-500">
              <Plus className="mr-2 h-4 w-4" /> 新增员工
            </Button>
          </div>
          <TabsContent value="basic" className="mt-4">
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>姓名</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>职位</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.status}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          查看详情 <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="work" className="mt-4">
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-tech-blue-300" />
              <h3 className="mt-2 text-lg font-medium">工作信息</h3>
              <p className="mt-1 text-sm text-tech-blue-300">查看和管理员工的工作相关信息</p>
            </div>
          </TabsContent>
          <TabsContent value="salary" className="mt-4">
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-tech-blue-300" />
              <h3 className="mt-2 text-lg font-medium">薪资管理</h3>
              <p className="mt-1 text-sm text-tech-blue-300">管理员工薪资、奖金和福利信息</p>
            </div>
          </TabsContent>
          <TabsContent value="attendance" className="mt-4">
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-tech-blue-300" />
              <h3 className="mt-2 text-lg font-medium">考勤记录</h3>
              <p className="mt-1 text-sm text-tech-blue-300">查看和管理员工的出勤、请假和加班记录</p>
            </div>
          </TabsContent>
          <TabsContent value="performance" className="mt-4">
            <div className="text-center py-8">
              <Award className="mx-auto h-12 w-12 text-tech-blue-300" />
              <h3 className="mt-2 text-lg font-medium">绩效评估</h3>
              <p className="mt-1 text-sm text-tech-blue-300">管理员工的绩效目标和评估结果</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

## components/goal-setting.tsx
/**
 * @file 目标设置组件
 * @description 允许用户设置和管理年度和季度目标
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Download, Edit, Plus } from "lucide-react"

// 模拟数据
const annualGoals = [
  {
    id: "G1",
    title: "年度销售额增长20%",
    description: "相比去年提升销售额20%，达到1200万元",
    progress: 45,
    department: "销售部",
    quarters: [
      {
        id: "Q1",
        title: "Q1: 销售额达到250万元",
        progress: 95,
        months: [
          { id: "M1", title: "1月: 销售额80万元", progress: 100 },
          { id: "M2", title: "2月: 销售额80万元", progress: 90 },
          { id: "M3", title: "3月: 销售额90万元", progress: 95 },
        ],
      },
      {
        id: "Q2",
        title: "Q2: 销售额达到300万元",
        progress: 60,
        months: [
          { id: "M4", title: "4月: 销售额95万元", progress: 90 },
          { id: "M5", title: "5月: 销售额100万元", progress: 80 },
          { id: "M6", title: "6月: 销售额105万元", progress: 10 },
        ],
      },
      {
        id: "Q3",
        title: "Q3: 销售额达到320万元",
        progress: 0,
        months: [
          { id: "M7", title: "7月: 销售额105万元", progress: 0 },
          { id: "M8", title: "8月: 销售额105万元", progress: 0 },
          { id: "M9", title: "9月: 销售额110万元", progress: 0 },
        ],
      },
      {
        id: "Q4",
        title: "Q4: 销售额达到330万元",
        progress: 0,
        months: [
          { id: "M10", title: "10月: 销售额110万元", progress: 0 },
          { id: "M11", title: "11月: 销售额110万元", progress: 0 },
          { id: "M12", title: "12月: 销售额110万元", progress: 0 },
        ],
      },
    ],
  },
  {
    id: "G2",
    title: "新客户拓展100家",
    description: "全年新增100家企业级客户",
    progress: 38,
    department: "市场部",
    quarters: [
      {
        id: "Q1",
        title: "Q1: 新增20家客户",
        progress: 90,
        months: [
          { id: "M1", title: "1月: 新增5家", progress: 100 },
          { id: "M2", title: "2月: 新增7家", progress: 85 },
          { id: "M3", title: "3月: 新增8家", progress: 88 },
        ],
      },
      {
        id: "Q2",
        title: "Q2: 新增25家客户",
        progress: 50,
        months: [
          { id: "M4", title: "4月: 新增8家", progress: 75 },
          { id: "M5", title: "5月: 新增8家", progress: 75 },
          { id: "M6", title: "6月: 新增9家", progress: 0 },
        ],
      },
    ],
  },
]

export function GoalSetting() {
  const [activeTab, setActiveTab] = useState("annual")

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>目标量化管理</CardTitle>
            <CardDescription>年度、季度、月度目标分解与跟踪</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" /> 导出
            </Button>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> 新建目标
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="annual">年度目标</TabsTrigger>
              <TabsTrigger value="quarter">季度目标</TabsTrigger>
              <TabsTrigger value="month">月度目标</TabsTrigger>
            </TabsList>

            <TabsContent value="annual" className="space-y-4">
              {annualGoals.map((goal) => (
                <Card key={goal.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{goal.title}</CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">进度: {goal.progress}%</span>
                          <span className="text-sm text-muted-foreground">|</span>
                          <span className="text-sm text-muted-foreground">负责部门: {goal.department}</span>
                        </div>
                      </div>
                      <Progress value={goal.progress} className="h-2" />

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="quarters">
                          <AccordionTrigger className="text-sm font-medium">季度目标分解</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              {goal.quarters.map((quarter) => (
                                <div key={quarter.id} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{quarter.title}</span>
                                    <span className="text-sm">{quarter.progress}%</span>
                                  </div>
                                  <Progress value={quarter.progress} className="h-1.5" />

                                  <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="months">
                                      <AccordionTrigger className="text-xs font-medium py-1">
                                        月度目标分解
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="space-y-3 pt-2">
                                          {quarter.months.map((month) => (
                                            <div key={month.id} className="space-y-1">
                                              <div className="flex items-center justify-between">
                                                <span className="text-xs">{month.title}</span>
                                                <span className="text-xs">{month.progress}%</span>
                                              </div>
                                              <Progress value={month.progress} className="h-1" />
                                            </div>
                                          ))}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="quarter" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {annualGoals.flatMap((goal) =>
                  goal.quarters.map((quarter) => (
                    <Card key={`${goal.id}-${quarter.id}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{quarter.title}</CardTitle>
                            <CardDescription className="text-xs">来自年度目标: {goal.title}</CardDescription>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">进度: {quarter.progress}%</span>
                          </div>
                          <Progress value={quarter.progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  )),
                )}
              </div>
            </TabsContent>

            <TabsContent value="month" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {annualGoals.flatMap((goal) =>
                  goal.quarters.flatMap((quarter) =>
                    quarter.months.map((month) => (
                      <Card key={`${goal.id}-${quarter.id}-${month.id}`}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base">{month.title}</CardTitle>
                              <CardDescription className="text-xs">来自季度目标: {quarter.title}</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">进度: {month.progress}%</span>
                            </div>
                            <Progress value={month.progress} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    )),
                  ),
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

## components/honors-pool.tsx
/**
 * @file 荣誉奖池组件
 * @description 显示和管理公司员工的荣誉奖池，包括可获得的荣誉和员工荣誉排行榜
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, Trophy, Star, Award, TrendingUp } from "lucide-react"

// 模拟数据
const honors = [
  { id: 1, name: "销售之星", description: "月度销售冠军", points: 100, icon: Trophy },
  { id: 2, name: "创新先锋", description: "提出创新改进建议", points: 50, icon: Star },
  { id: 3, name: "优秀讲师", description: "内部培训优秀讲师", points: 80, icon: Award },
  { id: 4, name: "效率之王", description: "工作效率显著提升", points: 60, icon: TrendingUp },
]

const leaderboard = [
  { rank: 1, name: "张三", department: "销售部", points: 350 },
  { rank: 2, name: "李四", department: "市场部", points: 280 },
  { rank: 3, name: "王五", department: "研发部", points: 260 },
  { rank: 4, name: "赵六", department: "客服部", points: 220 },
]

export function HonorsPool() {
  const [activeTab, setActiveTab] = useState("honors")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredHonors = honors.filter(
    (honor) =>
      honor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      honor.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="bg-tech-blue-800 text-tech-blue-100">
      <CardHeader>
        <CardTitle>荣誉奖池</CardTitle>
        <CardDescription>激励员工，表彰优秀，共创佳绩</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="honors">可获得荣誉</TabsTrigger>
            <TabsTrigger value="leaderboard">荣誉排行榜</TabsTrigger>
          </TabsList>
          <div className="mt-4 flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索荣誉..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-tech-blue-700 text-tech-blue-100 border-tech-blue-600"
              />
            </div>
          </div>
          <TabsContent value="honors" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHonors.map((honor) => (
                  <Card key={honor.id} className="bg-tech-blue-700">
                    <CardContent className="p-4 flex items-start">
                      <honor.icon className="h-8 w-8 text-yellow-400 mr-4" />
                      <div>
                        <h3 className="font-semibold">{honor.name}</h3>
                        <p className="text-sm text-tech-blue-300">{honor.description}</p>
                        <Badge className="mt-2 bg-tech-blue-600">{honor.points} 积分</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="leaderboard" className="mt-4">
            <ScrollArea className="h-[400px]">
              {leaderboard.map((entry, index) => (
                <div key={index} className="flex items-center justify-between mb-4 p-4 bg-tech-blue-700 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold mr-4">{entry.rank}</span>
                    <div>
                      <h3 className="font-semibold">{entry.name}</h3>
                      <p className="text-sm text-tech-blue-300">{entry.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold">{entry.points}</span>
                    <p className="text-sm text-tech-blue-300">积分</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


## components/information-center.tsx
/**
 * @file 信息中心组件
 * @description 提供公司内部的信息和通信渠道，包括员工语音消息、荣誉奖池、目标设置等
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/lib/AppContext"
import {
  Bell,
  MessageSquare,
  Users,
  Plus,
  Search,
  AlertCircle,
  FileText,
  ChevronRight,
  Trophy,
  Mic,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const MotionCard = motion(Card)

// 荣誉数据
const honors = [
  { id: 1, name: "创新先锋奖", image: "/placeholder.svg?height=200&width=300" },
  { id: 2, name: "卓越领导奖", image: "/placeholder.svg?height=200&width=300" },
  { id: 3, name: "优秀团队奖", image: "/placeholder.svg?height=200&width=300" },
  { id: 4, name: "客户满意奖", image: "/placeholder.svg?height=200&width=300" },
  { id: 5, name: "质量保障奖", image: "/placeholder.svg?height=200&width=300" },
  { id: 6, name: "效率之星奖", image: "/placeholder.svg?height=200&width=300" },
  { id: 7, name: "最佳贡献奖", image: "/placeholder.svg?height=200&width=300" },
  { id: 8, name: "技术精英奖", image: "/placeholder.svg?height=200&width=300" },
  { id: 9, name: "诚信楷模奖", image: "/placeholder.svg?height=200&width=300" },
  { id: 10, name: "成长潜力奖", image: "/placeholder.svg?height=200&width=300" },
]

// New interface for Employee Voice messages
interface EmployeeVoiceMessage {
  id: string
  content: string
  employeeName: string
  timestamp: Date
  status: "pending" | "inProgress" | "resolved"
}

export function InformationCenter() {
  const { state, markNotificationAsRead, addChannel, addDepartment, updateDepartmentLeader } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [newChannelName, setNewChannelName] = useState("")
  const [newChannelType, setNewChannelType] = useState("public")
  const [newDepartmentName, setNewDepartmentName] = useState("")
  const [selectedNotification, setSelectedNotification] = useState<null | Notification>(null)
  const [currentHonorIndex, setCurrentHonorIndex] = useState(0)

  // New state for Employee Voice
  const [employeeVoiceMessages, setEmployeeVoiceMessages] = useState<EmployeeVoiceMessage[]>([])
  const [newVoiceMessage, setNewVoiceMessage] = useState("")

  const filteredNotifications = state.notifications.filter((notification) =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredChannels = state.channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDepartments = state.departments.filter((department) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 模拟的通知文档数据
  const notificationDocuments = [
    { id: 1, title: "Q2 业绩报告", type: "report", date: "2024-07-01" },
    { id: 2, title: "新员工入职指南", type: "guide", date: "2024-06-15" },
    { id: 3, title: "公司年度计划", type: "plan", date: "2024-01-01" },
    { id: 4, title: "安全培训材料", type: "training", date: "2024-05-20" },
  ]

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "report":
        return <FileText className="h-8 w-8 text-blue-500" />
      case "guide":
        return <FileText className="h-8 w-8 text-green-500" />
      case "plan":
        return <FileText className="h-8 w-8 text-purple-500" />
      case "training":
        return <FileText className="h-8 w-8 text-orange-500" />
      default:
        return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  // Function to add a new Employee Voice message
  const addEmployeeVoiceMessage = () => {
    if (newVoiceMessage.trim()) {
      const newMessage: EmployeeVoiceMessage = {
        id: Date.now().toString(),
        content: newVoiceMessage,
        employeeName: state.user.name, // Assuming we have user info in the state
        timestamp: new Date(),
        status: "pending",
      }
      setEmployeeVoiceMessages([newMessage, ...employeeVoiceMessages])
      setNewVoiceMessage("")
    }
  }

  // Function to update the status of an Employee Voice message
  const updateMessageStatus = (id: string, status: "pending" | "inProgress" | "resolved") => {
    setEmployeeVoiceMessages((messages) => messages.map((msg) => (msg.id === id ? { ...msg, status } : msg)))
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHonorIndex((prevIndex) => (prevIndex + 1) % honors.length)
    }, 5000) // 每5秒切换一次

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-tech-blue-100">信息中心</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-tech-blue-700 text-tech-blue-100 border-tech-blue-600"
          />
        </div>
      </div>

      {/* 荣誉轮播图模块 */}
      <MotionCard
        className="bg-tech-blue-800 text-tech-blue-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            公司荣誉
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[200px] w-full">
            {honors.map((honor, index) => (
              <motion.div
                key={honor.id}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: index === currentHonorIndex ? 1 : 0,
                  scale: index === currentHonorIndex ? 1 : 0.8,
                  zIndex: index === currentHonorIndex ? 1 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <img
                    src={honor.image || "/placeholder.svg"}
                    alt={honor.name}
                    className="w-full h-[150px] object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-lg font-semibold">{honor.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </MotionCard>

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


## components/learning-park.tsx
/**
 * @file 学习公园组件
 * @description 提供员工学习资源和课程管理功能，包括课程 catalog、学习路径、进度跟踪等
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, BookOpen, Video, FileText, Users, Play } from "lucide-react"

// 模拟数据
const courses = [
  { id: 1, title: "新员工入职培训", type: "必修", format: "视频", duration: "2小时", progress: 0 },
  { id: 2, title: "高级销售技巧", type: "选修", format: "在线课程", duration: "4小时", progress: 60 },
  { id: 3, title: "项目管理基础", type: "必修", format: "文档", duration: "1小时", progress: 100 },
  { id: 4, title: "客户服务excellence", type: "选修", format: "视频", duration: "3小时", progress: 30 },
]

const learningPaths = [
  { id: 1, name: "销售精英成长路径", courses: 5, completionRate: 40 },
  { id: 2, name: "管理者领导力提升", courses: 7, completionRate: 20 },
  { id: 3, name: "技术专家进阶之路", courses: 6, completionRate: 60 },
]

export function LearningPark() {
  const [activeTab, setActiveTab] = useState("courses")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "视频":
        return <Video className="h-4 w-4" />
      case "在线课程":
        return <BookOpen className="h-4 w-4" />
      case "文档":
        return <FileText className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <Card className="bg-tech-blue-800 text-tech-blue-100">
      <CardHeader>
        <CardTitle>学习乐园</CardTitle>
        <CardDescription>提升技能，拓展知识，成就未来</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="courses">课程中心</TabsTrigger>
            <TabsTrigger value="paths">学习路径</TabsTrigger>
          </TabsList>
          <div className="mt-4 flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索课程..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-tech-blue-700 text-tech-blue-100 border-tech-blue-600"
              />
            </div>
            <Button className="bg-tech-blue-600 hover:bg-tech-blue-500">
              <BookOpen className="mr-2 h-4 w-4" /> 我的学习
            </Button>
          </div>
          <TabsContent value="courses" className="mt-4">
            <ScrollArea className="h-[400px]">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="mb-4 bg-tech-blue-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <div className="flex items-center mt-2">
                          <Badge variant="outline" className="mr-2">
                            {course.type}
                          </Badge>
                          <div className="flex items-center text-sm text-tech-blue-300">
                            {getFormatIcon(course.format)}
                            <span className="ml-1">{course.format}</span>
                          </div>
                          <span className="ml-2 text-sm text-tech-blue-300">{course.duration}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    <Progress value={course.progress} className="mt-4" />
                    <div className="text-right mt-1 text-sm text-tech-blue-300">{course.progress}% 完成</div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="paths" className="mt-4">
            <ScrollArea className="h-[400px]">
              {learningPaths.map((path) => (
                <Card key={path.id} className="mb-4 bg-tech-blue-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{path.name}</h3>
                        <div className="flex items-center mt-2 text-sm text-tech-blue-300">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{path.courses} 门课程</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        查看详情
                      </Button>
                    </div>
                    <Progress value={path.completionRate} className="mt-4" />
                    <div className="text-right mt-1 text-sm text-tech-blue-300">{path.completionRate}% 完成</div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

## components/marketing-planning.tsx
/**
 * @file 营销计划组件
 * @description 允许公司创建、管理和执行营销计划，包括促销活动、产品发布、品牌推广等
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Filter, Plus, Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

// 模拟数据
const marketingPlans = [
  {
    id: "MP-001",
    title: "618电商促销活动",
    type: "促销活动",
    startDate: "2024-06-01",
    endDate: "2024-06-18",
    budget: 50000,
    status: "规划中",
    progress: 25,
    owner: "张三",
    department: "市场部",
  },
  {
    id: "MP-002",
    title: "新品上市发布会",
    type: "产品发布",
    startDate: "2024-04-15",
    endDate: "2024-04-15",
    budget: 100000,
    status: "进行中",
    progress: 60,
    owner: "李四",
    department: "市场部",
  },
  {
    id: "MP-003",
    title: "年中品牌推广",
    type: "品牌推广",
    startDate: "2024-05-01",
    endDate: "2024-07-31",
    budget: 200000,
    status: "进行中",
    progress: 40,
    owner: "王五",
    department: "市场部",
  },
  {
    id: "MP-004",
    title: "客户满意度调研",
    type: "市场调研",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    budget: 30000,
    status: "已完成",
    progress: 100,
    owner: "赵六",
    department: "市场部",
  },
  {
    id: "MP-005",
    title: "双11营销策划",
    type: "促销活动",
    startDate: "2024-10-15",
    endDate: "2024-11-11",
    budget: 300000,
    status: "规划中",
    progress: 10,
    owner: "张三",
    department: "市场部",
  },
]

export function MarketingPlanning() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredPlans = marketingPlans.filter((plan) => {
    const matchesSearch =
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || plan.status === statusFilter
    const matchesType = typeFilter === "all" || plan.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "规划中":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            规划中
          </Badge>
        )
      case "进行中":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>营销策划</CardTitle>
          <CardDescription>管理营销活动计划与执行</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" /> 新建策划
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="搜索策划名称或ID..."
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
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="规划中">规划中</SelectItem>
                  <SelectItem value="进行中">进行中</SelectItem>
                  <SelectItem value="已完成">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="类型筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="促销活动">促销活动</SelectItem>
                  <SelectItem value="产品发布">产品发布</SelectItem>
                  <SelectItem value="品牌推广">品牌推广</SelectItem>
                  <SelectItem value="市场调研">市场调研</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>策划名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>时间范围</TableHead>
                <TableHead>预算</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>进度</TableHead>
                <TableHead>负责人</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.id}</TableCell>
                  <TableCell>{plan.title}</TableCell>
                  <TableCell>{plan.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">
                        {plan.startDate} 至 {plan.endDate}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>¥{plan.budget.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(plan.status)}</TableCell>
                  <TableCell>
                    <div className="flex w-full max-w-24 items-center gap-2">
                      <Progress value={plan.progress} className="h-2" />
                      <span className="text-xs">{plan.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{plan.owner}</TableCell>
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


## components/mobile-nav.tsx
/**
 * @file 移动导航组件
 * @description 提供移动设备上的导航菜单，包括运维管理、营销策划、业绩指标、目标量化、沟通赋能、对赌机制、自动提醒、日程安排和系统设置等功能
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, Calendar, ClipboardList, Clock, MessageSquare, Settings, ShoppingBag, Users } from "lucide-react"

export function MobileNav() {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-4">
        <Button variant="ghost" className="justify-start gap-2">
          <BarChart3 className="h-5 w-5" />
          运维管理
        </Button>
        <Button variant="ghost" className="justify-start gap-2">
          <ShoppingBag className="h-5 w-5" />
          营销策划
        </Button>
        <Button variant="ghost" className="justify-start gap-2">
          <BarChart3 className="h-5 w-5" />
          业绩指标
        </Button>
        <Button variant="ghost" className="justify-start gap-2">
          <ClipboardList className="h-5 w-5" />
          目标量化
        </Button>
        <Button variant="ghost" className="justify-start gap-2">
          <MessageSquare className="h-5 w-5" />
          沟通赋能
        </Button>
        <Button variant="ghost" className="justify-start gap-2">
          <Users className="h-5 w-5" />
          对赌机制
        </Button>
        <Button variant="ghost" className="justify-start gap-2">
          <Clock className="h-5 w-5" />
          自动提醒
        </Button>
        <Button variant="ghost" className="justify-start gap-2">
          <Calendar className="h-5 w-5" />
          日程安排
        </Button>
        <Button variant="ghost" className="justify-start gap-2">
          <Settings className="h-5 w-5" />
          系统设置
        </Button>
      </div>
    </ScrollArea>
  )
}


## components/navigation-tabs.tsx
/**
 * @file 导航标签组件
 * @description 提供顶部和底部的导航标签，用于切换不同的功能模块
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NavigationTabsProps {
  position: "top" | "bottom"
  onTabChange?: (tabId: string) => void
}

const topTabs = [
  { id: "operations", label: "运维管理" },
  { id: "marketing", label: "营销策划" },
  { id: "performance", label: "业绩指标" },
  { id: "goals", label: "目标量化" },
  { id: "information", label: "信息中心" },
  { id: "contracts", label: "对赌机制" },
  { id: "reminders", label: "自动提醒" },
]

const bottomTabs = [
  { id: "employee", label: "员工管理" },
  { id: "oa", label: "OA 审批" },
  { id: "honors", label: "荣誉奖池" },
  { id: "learning", label: "学习乐园" },
  { id: "dashboard", label: "数据看板" },
  { id: "personal", label: "个人规划" },
  { id: "smart-office", label: "智能办公" },
]

export function NavigationTabs({ position, onTabChange }: NavigationTabsProps) {
  const [activeTab, setActiveTab] = useState(position === "top" ? "operations" : "employee")
  const tabs = position === "top" ? topTabs : bottomTabs

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange && onTabChange(tabId)
  }

  return (
    <div className={cn("relative flex justify-center", position === "bottom" ? "mt-6" : "mb-6")}>
      <div className="w-full max-w-7xl">
        <div className="relative">
          <div className="absolute inset-0 bg-tech-blue-500/20 blur-xl rounded-2xl" />

          <nav className="relative bg-tech-blue-800/90 backdrop-blur-sm rounded-2xl p-1">
            <div className="flex justify-between items-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    "hover:text-tech-blue-200",
                    activeTab === tab.id ? "text-white" : "text-tech-blue-300",
                  )}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId={`tab-bg-${position}`}
                      className="absolute inset-0 bg-tech-blue-600 rounded-xl"
                      style={{
                        boxShadow: "0 0 20px rgba(26, 140, 255, 0.5)",
                      }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}

## components/notifications.tsx
/**
 * @file 通知组件
 * @description 提供系统通知功能，包括部门通知、任务提醒和系统更新等
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Building2, Briefcase } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NotificationsProps {
  isOpen: boolean
  onClose: () => void
}

export function Notifications({ isOpen, onClose }: NotificationsProps) {
  const notifications = {
    department: [
      {
        id: 1,
        title: "门店制造部门通知",
        message: "新店筹备会议安排",
        time: "5分钟前",
        department: "门店制造",
      },
      {
        id: 2,
        title: "前厅经理部门通知",
        message: "客户满意度提升计划",
        time: "10分钟前",
        department: "前厅经理",
      },
      {
        id: 3,
        title: "资源制造部门通知",
        message: "新供应商合作评估",
        time: "1小时前",
        department: "资源制造",
      },
    ],
    task: [
      {
        id: 1,
        title: "任务提醒",
        message: "月度报表提交截止",
        time: "今天 17:00",
        priority: "高",
      },
      {
        id: 2,
        title: "培训通知",
        message: "新员工入职培训",
        time: "明天 09:00",
        priority: "中",
      },
    ],
    system: [
      {
        id: 1,
        title: "系统更新",
        message: "系统将于今晚进行维护",
        time: "2小时前",
      },
    ],
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-tech-blue-800 text-tech-blue-100">
        <SheetHeader>
          <SheetTitle className="text-tech-blue-100 flex items-center">
            <Bell className="mr-2 h-5 w-5" /> 通知中心
          </SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="department" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="department">部门通知</TabsTrigger>
            <TabsTrigger value="task">任务提醒</TabsTrigger>
            <TabsTrigger value="system">系统通知</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[calc(100vh-200px)] mt-4">
            <TabsContent value="department">
              {notifications.department.map((notification) => (
                <div key={notification.id} className="mb-4 p-4 bg-tech-blue-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-tech-blue-300" />
                    <span className="text-sm text-tech-blue-300">{notification.department}</span>
                  </div>
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-sm text-tech-blue-300">{notification.message}</p>
                  <span className="text-xs text-tech-blue-400">{notification.time}</span>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="task">
              {notifications.task.map((notification) => (
                <div key={notification.id} className="mb-4 p-4 bg-tech-blue-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4 text-tech-blue-300" />
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        notification.priority === "高" ? "bg-red-500" : "bg-yellow-500"
                      }`}
                    >
                      {notification.priority}优先级
                    </span>
                  </div>
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-sm text-tech-blue-300">{notification.message}</p>
                  <span className="text-xs text-tech-blue-400">{notification.time}</span>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="system">
              {notifications.system.map((notification) => (
                <div key={notification.id} className="mb-4 p-4 bg-tech-blue-700 rounded-lg">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-sm text-tech-blue-300">{notification.message}</p>
                  <span className="text-xs text-tech-blue-400">{notification.time}</span>
                </div>
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

## components/oa-approval.tsx
/**
 * @file OA审批组件
 * @description 提供OA系统的审批功能，包括采购申请、请假申请、项目预算增加、出差申请等
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

// 模拟数据
const approvals = [
  {
    id: "AP001",
    title: "采购申请",
    type: "采购",
    applicant: "张三",
    status: "待审批",
    urgency: "普通",
    submitTime: "2024-03-10 09:15",
  },
  {
    id: "AP002",
    title: "请假申请",
    type: "人事",
    applicant: "李四",
    status: "已通过",
    urgency: "普通",
    submitTime: "2024-03-09 14:30",
  },
  {
    id: "AP003",
    title: "项目预算增加",
    type: "财务",
    applicant: "王五",
    status: "待审批",
    urgency: "紧急",
    submitTime: "2024-03-10 11:00",
  },
  {
    id: "AP004",
    title: "出差申请",
    type: "行政",
    applicant: "赵六",
    status: "已拒绝",
    urgency: "普通",
    submitTime: "2024-03-08 16:45",
  },
]

export function OAApproval() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredApprovals = approvals.filter(
    (approval) =>
      approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "待审批":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            待审批
          </Badge>
        )
      case "已通过":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            已通过
          </Badge>
        )
      case "已拒绝":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            已拒绝
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "紧急":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card className="bg-tech-blue-800 text-tech-blue-100">
      <CardHeader>
        <CardTitle>OA 审批</CardTitle>
        <CardDescription>高效管理公司各类审批流程</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="pending">待审批</TabsTrigger>
            <TabsTrigger value="approved">已通过</TabsTrigger>
            <TabsTrigger value="rejected">已拒绝</TabsTrigger>
          </TabsList>
          <div className="mt-4 flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索审批..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-tech-blue-700 text-tech-blue-100 border-tech-blue-600"
              />
            </div>
            <Button className="bg-tech-blue-600 hover:bg-tech-blue-500">
              <Plus className="mr-2 h-4 w-4" /> 新建审批
            </Button>
          </div>
          <ScrollArea className="h-[400px] mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>审批编号</TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>申请人</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>紧急程度</TableHead>
                  <TableHead>提交时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApprovals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell>{approval.id}</TableCell>
                    <TableCell>{approval.title}</TableCell>
                    <TableCell>{approval.type}</TableCell>
                    <TableCell>{approval.applicant}</TableCell>
                    <TableCell>{getStatusBadge(approval.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getUrgencyIcon(approval.urgency)}
                        <span className="ml-2">{approval.urgency}</span>
                      </div>
                    </TableCell>
                    <TableCell>{approval.submitTime}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="mr-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  )
}

## components/operations-management.tsx
/**
 * @file 运维管理组件
 * @description 提供运维管理功能，包括任务分配、状态监控、性能优化、故障排除等
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, CheckCircle2, Clock, Filter, Plus } from "lucide-react"

// 模拟数据
const tasks = [
  {
    id: "TASK-1001",
    title: "系统维护",
    assignee: "张三",
    department: "IT部门",
    status: "进行中",
    priority: "高",
    dueDate: "2024-03-10",
  },
  {
    id: "TASK-1002",
    title: "服务器升级",
    assignee: "李四",
    department: "IT部门",
    status: "待处理",
    priority: "中",
    dueDate: "2024-03-15",
  },
  {
    id: "TASK-1003",
    title: "网络安全检查",
    assignee: "王五",
    department: "IT部门",
    status: "已完成",
    priority: "高",
    dueDate: "2024-03-05",
  },
  {
    id: "TASK-1004",
    title: "数据备份",
    assignee: "赵六",
    department: "IT部门",
    status: "已完成",
    priority: "低",
    dueDate: "2024-03-01",
  },
  {
    id: "TASK-1005",
    title: "软件更新",
    assignee: "张三",
    department: "IT部门",
    status: "进行中",
    priority: "中",
    dueDate: "2024-03-12",
  },
]

export function OperationsManagement() {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filter, setFilter] = useState<string>("all")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    return task.status === filter
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "进行中":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="mr-1 h-3 w-3" /> 进行中
          </Badge>
        )
      case "待处理":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" /> 待处理
          </Badge>
        )
      case "已完成":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" /> 已完成
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "高":
        return <Badge className="bg-red-500">{priority}</Badge>
      case "中":
        return <Badge className="bg-yellow-500">{priority}</Badge>
      case "低":
        return <Badge className="bg-green-500">{priority}</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>运维管理</CardTitle>
          <CardDescription>管理系统运维任务和状态</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="待处理">待处理</SelectItem>
                <SelectItem value="进行中">进行中</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" /> 新建任务
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" size="sm" className="font-medium" onClick={() => handleSort("id")}>
                  任务ID
                  {sortColumn === "id" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="font-medium" onClick={() => handleSort("title")}>
                  任务名称
                  {sortColumn === "title" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="font-medium" onClick={() => handleSort("assignee")}>
                  负责人
                  {sortColumn === "assignee" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="font-medium" onClick={() => handleSort("department")}>
                  部门
                  {sortColumn === "department" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="font-medium" onClick={() => handleSort("status")}>
                  状态
                  {sortColumn === "status" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="font-medium" onClick={() => handleSort("priority")}>
                  优先级
                  {sortColumn === "priority" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="font-medium" onClick={() => handleSort("dueDate")}>
                  截止日期
                  {sortColumn === "dueDate" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
              </TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>{task.department}</TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    查看
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

## components/performance-contract.tsx
/**
 * @file 绩效合同组件
 * @description 提供绩效合同管理功能，包括合同创建、查看、编辑、删除和状态管理
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Filter, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// 模拟数据
const contracts = [
  {
    id: "PC-001",
    title: "销售部Q2业绩对赌",
    department: "销售部",
    target: "Q2销售额达到300万元",
    reward: "团队奖金池50万元",
    penalty: "未达标扣除绩效工资20%",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    status: "进行中",
    progress: 60,
    participants: 12,
  },
  {
    id: "PC-002",
    title: "市场部新客户拓展",
    department: "市场部",
    target: "Q2新增客户30家",
    reward: "团队奖金池20万元",
    penalty: "未达标扣除绩效工资15%",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    status: "进行中",
    progress: 45,
    participants: 8,
  },
  {
    id: "PC-003",
    title: "研发部产品迭代",
    department: "研发部",
    target: "Q2完成3个版本迭代",
    reward: "团队奖金池30万元",
    penalty: "未达标延期年终奖发放",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    status: "进行中",
    progress: 70,
    participants: 15,
  },
  {
    id: "PC-004",
    title: "客服部满意度提升",
    department: "客服部",
    target: "客户满意度达到95%以上",
    reward: "团队奖金池15万元",
    penalty: "未达标取消季度旅游",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    status: "进行中",
    progress: 80,
    participants: 10,
  },
  {
    id: "PC-005",
    title: "销售部Q1业绩对赌",
    department: "销售部",
    target: "Q1销售额达到250万元",
    reward: "团队奖金池40万元",
    penalty: "未达标扣除绩效工资20%",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "已完成",
    progress: 100,
    participants: 12,
    result: "达标",
  },
]

export function PerformanceContract() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || contract.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

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

  const getResultBadge = (result: string) => {
    switch (result) {
      case "达标":
        return <Badge className="bg-green-500">达标</Badge>
      case "未达标":
        return <Badge className="bg-red-500">未达标</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>对赌机制</CardTitle>
          <CardDescription>管理部门和团队的业绩对赌合约</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" /> 新建对赌
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="搜索对赌名称或ID..."
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
                  <SelectValue placeholder="状态筛选" />
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
                  <SelectValue placeholder="部门筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部部门</SelectItem>
                  <SelectItem value="销售部">销售部</SelectItem>
                  <SelectItem value="市场部">市场部</SelectItem>
                  <SelectItem value="研发部">研发部</SelectItem>
                  <SelectItem value="客服部">客服部</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>对赌名称</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>目标</TableHead>
                <TableHead>时间范围</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>进度</TableHead>
                <TableHead>结果</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.id}</TableCell>
                  <TableCell>{contract.title}</TableCell>
                  <TableCell>{contract.department}</TableCell>
                  <TableCell>{contract.target}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">
                        {contract.startDate} 至 {contract.endDate}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>
                    <div className="flex w-full max-w-24 items-center gap-2">
                      <Progress value={contract.progress} className="h-2" />
                      <span className="text-xs">{contract.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{contract.result && getResultBadge(contract.result)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
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

## components/performance-metrics.tsx
/**
 * @file 绩效指标组件
 * @description 提供部门和员工的绩效指标展示功能，包括目标完成率、实际完成率、绩效等级等
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { BarChart, Download, LineChart, PieChart, RefreshCw } from 'lucide-react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Bar, Line, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

// 模拟数据
const departmentData = [
  { name: "销售部", target: 1000000, actual: 850000, percentage: 85 },
  { name: "市场部", target: 500000, actual: 520000, percentage: 104 },
  { name: "客服部", target: 300000, actual: 290000, percentage: 97 },
  { name: "研发部", target: 800000, actual: 720000, percentage: 90 },
  { name: "财务部", target: 200000, actual: 210000, percentage: 105 },
]

export function PerformanceMetrics() {
  const [period, setPeriod] = useState("year")
  const [selectedDate, setSelectedDate] = useState(new Date())

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '部门业绩指标',
      },
      datalabels: {
        anchor: 'end' as const,
        align: 'top' as const,
        formatter: (value: number) => value.toLocaleString(),
      },
    },
  }

  const barChartData = {
    labels: departmentData.map(dept => dept.name),
    datasets: [
      {
        label: '目标金额',
        data: departmentData.map(dept => dept.target),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: '实际金额',
        data: departmentData.map(dept => dept.actual),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }

  const lineChartData = {
    labels: departmentData.map(dept => dept.name),
    datasets: [
      {
        label: '完成率',
        data: departmentData.map(dept => dept.percentage),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }

  const pieChartData = {
    labels: departmentData.map(dept => dept.name),
    datasets: [
      {
        data: departmentData.map(dept => dept.actual),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>部门业绩指标</CardTitle>
            <CardDescription>各部门业绩目标完成情况</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="周期" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">年度</SelectItem>
                <SelectItem value="quarter">季度</SelectItem>
                <SelectItem value="month">月度</SelectItem>
              </SelectContent>
            </Select>

            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
              dateFormat={period === 'year' ? 'yyyy' : period === 'quarter' ? 'yyyy-QQ' : 'yyyy-MM'}
              showYearPicker={period === 'year'}
              showQuarterYearPicker={period === 'quarter'}
              showMonthYearPicker={period === 'month'}
              className="w-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />

            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" className="space-y-4">
            <TabsList>
              <TabsTrigger value="table">表格</TabsTrigger>
              <TabsTrigger value="bar" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" /> 柱状图
              </TabsTrigger>
              <TabsTrigger value="line" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" /> 折线图
              </TabsTrigger>
              <TabsTrigger value="pie" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" /> 饼图
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">部门</th>
                      <th className="py-3 px-4 text-right font-medium">目标金额</th>
                      <th className="py-3 px-4 text-right font-medium">实际金额</th>
                      <th className="py-3 px-4 text-right font-medium">完成率</th>
                      <th className="py-3 px-4 text-right font-medium">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentData.map((dept) => (
                      <tr key={dept.name} className="border-b">
                        <td className="py-3 px-4 font-medium">{dept.name}</td>
                        <td className="py-3 px-4 text-right">{dept.target.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">{dept.actual.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">{dept.percentage}%</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  dept.percentage >= 100
                                    ? "bg-green-500"
                                    : dept.percentage >= 80
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${Math.min(dept.percentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-muted/50">
                      <td className="py-3 px-4 font-medium">总计</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {departmentData.reduce((sum, dept) => sum + dept.target, 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {departmentData.reduce((sum, dept) => sum + dept.actual, 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {Math.round(
                          (departmentData.reduce((sum, dept) => sum + dept.actual, 0) /
                            departmentData.reduce((sum, dept) => sum + dept.target, 0)) *
                            100,
                        )}
                        %
                      </td>
                      <td className="py-3 px-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="bar">
              <div className="h-[400px] border rounded-md p-4">
                <Bar options={chartOptions} data={barChartData} />
              </div>
            </TabsContent>

            <TabsContent value="line">
              <div className="h-[400px] border rounded-md p-4">
                <Line options={chartOptions} data={lineChartData} />
              </div>
            </TabsContent>

            <TabsContent value="pie">
              <div className="h-[400px] border rounded-md p-4">
                <Pie options={chartOptions} data={pieChartData} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>销售趋势</CardTitle>
            <CardDescription>月度销售额变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: '月度销售趋势',
                    },
                  },
                }}
                data={{
                  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                  datasets: [
                    {
                      label: '销售额',
                      data: [65, 59, 80, 81, 56, 55],
                      fill: false,
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1,
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>部门贡献</CardTitle>
            <CardDescription>各部门业绩占比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Pie
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: '部门业绩占比',
                    },
                  },
                }}
                data={pieChartData}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>目标完成度</CardTitle>
            <CardDescription>各部门目标完成情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: '部门目标完成度',
                    },
                  },
                }}
                data={{
                  labels: departmentData.map(dept => dept.name),
                  datasets: [
                    {
                      label: '完成率',
                      data: departmentData.map(dept => dept.percentage),
                      backgroundColor: departmentData.map(dept =>
                        dept.percentage >= 100 ? 'rgba(75, 192, 192, 0.5)' :
                          dept.percentage >= 80 ? 'rgba(255, 206, 86, 0.5)' :
                            'rgba(255, 99, 132, 0.5)'
                      ),
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

## components/personal-planning.tsx
/**
 * @file 个人规划组件
 * @description 提供个人职业发展规划功能，包括设置目标、管理技能、跟踪进度、协调培训等
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Clock, CalendarIcon, Plus, ChevronRight } from "lucide-react"

// 模拟数据
const careerGoals = [
  { id: 1, title: "晋升至高级经理", deadline: "2024-12-31", progress: 60 },
  { id: 2, title: "获得项目管理认证", deadline: "2024-06-30", progress: 40 },
  { id: 3, title: "带领团队完成年度目标", deadline: "2024-12-31", progress: 75 },
]

const skillsToImprove = [
  { id: 1, name: "领导力", current: 7, target: 9 },
  { id: 2, name: "沟通技巧", current: 6, target: 8 },
  { id: 3, name: "战略思维", current: 5, target: 8 },
  { id: 4, name: "技术专业知识", current: 8, target: 10 },
]

const upcomingTrainings = [
  { id: 1, title: "高级管理技能研讨会", date: "2024-04-15", duration: "2天" },
  { id: 2, title: "项目管理认证培训", date: "2024-05-01", duration: "5天" },
  { id: 3, title: "有效沟通与团队协作", date: "2024-06-10", duration: "3天" },
]

export function PersonalPlanning() {
  const [activeTab, setActiveTab] = useState("career")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <Card className="bg-tech-blue-800 text-tech-blue-100">
      <CardHeader>
        <CardTitle>个人规划</CardTitle>
        <CardDescription>规划你的职业发展，实现自我提升</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="career">职业目标</TabsTrigger>
            <TabsTrigger value="skills">技能提升</TabsTrigger>
            <TabsTrigger value="trainings">培训计划</TabsTrigger>
          </TabsList>

          <TabsContent value="career" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">我的职业目标</h3>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> 添加目标
              </Button>
            </div>
            <ScrollArea className="h-[300px]">
              {careerGoals.map((goal) => (
                <Card key={goal.id} className="mb-4 bg-tech-blue-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{goal.title}</h4>
                        <div className="flex items-center mt-2 text-sm text-tech-blue-300">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>截止日期: {goal.deadline}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        详情 <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    <Progress value={goal.progress} className="mt-4" />
                    <div className="flex justify-between mt-1 text-sm">
                      <span className="text-tech-blue-300">进度</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="skills" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">技能提升计划</h3>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> 添加技能
              </Button>
            </div>
            <ScrollArea className="h-[300px]">
              {skillsToImprove.map((skill) => (
                <Card key={skill.id} className="mb-4 bg-tech-blue-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{skill.name}</h4>
                      <Badge variant="outline">目标: {skill.target}</Badge>
                    </div>
                    <Slider value={[skill.current]} max={10} step={1} className="mt-2" />
                    <div className="flex justify-between mt-1 text-sm">
                      <span className="text-tech-blue-300">当前水平</span>
                      <span className="font-medium">{skill.current}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="trainings" className="mt-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <h3 className="text-lg font-semibold mb-4">即将参加的培训</h3>
                <ScrollArea className="h-[300px]">
                  {upcomingTrainings.map((training) => (
                    <Card key={training.id} className="mb-4 bg-tech-blue-700">
                      <CardContent className="p-4">
                        <h4 className="font-semibold">{training.title}</h4>
                        <div className="flex items-center mt-2 text-sm text-tech-blue-300">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{training.date}</span>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-tech-blue-300">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{training.duration}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              </div>
              <div className="w-1/2">
                <h3 className="text-lg font-semibold mb-4">培训日历</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border bg-tech-blue-700"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

## components/settings-panel.tsx
/**
 * @file 设置面板组件
 * @description 提供系统设置功能，包括显示设置、通知设置、隐私设置等
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, Moon, Bell, Shield, Eye, MessageSquare } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-tech-blue-800 text-tech-blue-100">
        <SheetHeader>
          <SheetTitle className="text-tech-blue-100 flex items-center">
            <Settings className="mr-2 h-5 w-5" /> 系统设置
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-4">显示设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4" />
                    <Label htmlFor="dark-mode">深色模式</Label>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <Label htmlFor="compact-mode">紧凑视图</Label>
                  </div>
                  <Switch id="compact-mode" />
                </div>
              </div>
            </div>

            <Separator className="bg-tech-blue-700" />

            <div>
              <h3 className="text-sm font-medium mb-4">通知设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <Label>部门通知</Label>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="选择接收范围" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有部门</SelectItem>
                      <SelectItem value="store">门店制造</SelectItem>
                      <SelectItem value="frontdesk">前厅经理</SelectItem>
                      <SelectItem value="resource">资源制造</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <Label htmlFor="message-notify">消息提醒</Label>
                  </div>
                  <Switch id="message-notify" />
                </div>
              </div>
            </div>

            <Separator className="bg-tech-blue-700" />

            <div>
              <h3 className="text-sm font-medium mb-4">安全设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <Label htmlFor="login-verify">登录验证</Label>
                  </div>
                  <Switch id="login-verify" />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

## components/smart-office.tsx
/**
 * @file 智能办公组件
 * @description 提供智能办公功能，包括环境监控、设备控制、生产力分析等
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js"
import { Lightbulb, Thermometer, Wind, Lock, Coffee, Printer, Wifi, Monitor } from "lucide-react"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

// 模拟数据
const roomStatus = {
  temperature: 23,
  humidity: 45,
  light: 70,
  occupancy: 8,
}

const deviceStatus = [
  { id: 1, name: "智能灯", icon: Lightbulb, status: true },
  { id: 2, name: "空调", icon: Wind, status: true },
  { id: 3, name: "门禁", icon: Lock, status: true },
  { id: 4, name: "咖啡机", icon: Coffee, status: false },
  { id: 5, name: "打印机", icon: Printer, status: true },
  { id: 6, name: "Wi-Fi", icon: Wifi, status: true },
  { id: 7, name: "显示器", icon: Monitor, status: true },
]

const energyData = {
  labels: ["照明", "空调", "电器", "其他"],
  datasets: [
    {
      data: [30, 40, 20, 10],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
    },
  ],
}

const productivityData = {
  labels: ["周一", "周二", "周三", "周四", "周五"],
  datasets: [
    {
      label: "工作效率指数",
      data: [65, 70, 80, 75, 85],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
  ],
}

export function SmartOffice() {
  const [activeTab, setActiveTab] = useState("environment")

  return (
    <Card className="bg-tech-blue-800 text-tech-blue-100">
      <CardHeader>
        <CardTitle>智能办公</CardTitle>
        <CardDescription>打造高效、舒适的智能办公环境</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="environment">环境控制</TabsTrigger>
            <TabsTrigger value="devices">设备管理</TabsTrigger>
            <TabsTrigger value="analytics">数据分析</TabsTrigger>
          </TabsList>

          <TabsContent value="environment" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-tech-blue-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">温度</h3>
                    <Thermometer className="h-6 w-6 text-tech-blue-300" />
                  </div>
                  <div className="text-3xl font-bold mt-2">{roomStatus.temperature}°C</div>
                  <Slider defaultValue={[roomStatus.temperature]} max={30} step={0.5} className="mt-4" />
                </CardContent>
              </Card>
              <Card className="bg-tech-blue-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">湿度</h3>
                    <Wind className="h-6 w-6 text-tech-blue-300" />
                  </div>
                  <div className="text-3xl font-bold mt-2">{roomStatus.humidity}%</div>
                  <Progress value={roomStatus.humidity} className="mt-4" />
                </CardContent>
              </Card>
              <Card className="bg-tech-blue-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">照明</h3>
                    <Lightbulb className="h-6 w-6 text-tech-blue-300" />
                  </div>
                  <div className="text-3xl font-bold mt-2">{roomStatus.light}%</div>
                  <Slider defaultValue={[roomStatus.light]} max={100} step={1} className="mt-4" />
                </CardContent>
              </Card>
              <Card className="bg-tech-blue-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">人员占用</h3>
                    <Badge>{roomStatus.occupancy} / 10</Badge>
                  </div>
                  <Progress value={roomStatus.occupancy * 10} className="mt-4" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="mt-4">
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-2 gap-4">
                {deviceStatus.map((device) => (
                  <Card key={device.id} className="bg-tech-blue-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <device.icon className="h-6 w-6 mr-2 text-tech-blue-300" />
                          <h3 className="text-lg font-semibold">{device.name}</h3>
                        </div>
                        <Switch checked={device.status} />
                      </div>
                      <Badge variant="outline" className="mt-2">
                        {device.status ? "运行中" : "已关闭"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-tech-blue-700">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">能源使用分布</h3>
                  <Pie data={energyData} />
                </CardContent>
              </Card>
              <Card className="bg-tech-blue-700">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">工作效率趋势</h3>
                  <Bar data={productivityData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

## components/theme-provider.tsx
/**
 * @file 主题提供者组件
 * @description 提供系统主题管理功能
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

## components/user-profile.tsx
/**
 * @file 用户个人中心组件
 * @description 提供用户个人信息展示、设置、权限管理等功能
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Mail, Phone, Building2, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const user = {
    name: "张三",
    email: "zhangsan@example.com",
    phone: "13800138000",
    department: "销售部",
    position: "销售经理",
    joinDate: "2023-01-15",
    avatar: "/placeholder.svg?height=100&width=100",
    performance: {
      sales: 85,
      customerSatisfaction: 92,
      teamManagement: 88,
    },
    certifications: ["销售精英", "客户关系管理师", "团队管理认证"],
    recentTraining: [
      { id: 1, name: "高级销售技巧", completion: 80 },
      { id: 2, name: "客户需求分析", completion: 100 },
      { id: 3, name: "销售团队管理", completion: 60 },
    ],
    currentGoals: [
      { id: 1, name: "季度销售目标", progress: 75 },
      { id: 2, name: "新客户开发", progress: 60 },
      { id: 3, name: "团队效率提升", progress: 80 },
    ],
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-tech-blue-800 text-tech-blue-100">
        <SheetHeader>
          <SheetTitle className="text-tech-blue-100 flex items-center">
            <User className="mr-2 h-5 w-5" /> 个人中心
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="mr-2">
                {user.position}
              </Badge>
              <Badge variant="outline">{user.department}</Badge>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-tech-blue-100">基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-tech-blue-300" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-tech-blue-300" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-tech-blue-300" />
                  <span>
                    {user.department} - {user.position}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-tech-blue-300" />
                  <span>入职时间：{user.joinDate}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-tech-blue-100">业绩表现</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">销售业绩</span>
                    <span className="text-sm">{user.performance.sales}%</span>
                  </div>
                  <Progress value={user.performance.sales} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">客户满意度</span>
                    <span className="text-sm">{user.performance.customerSatisfaction}%</span>
                  </div>
                  <Progress value={user.performance.customerSatisfaction} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">团队管理</span>
                    <span className="text-sm">{user.performance.teamManagement}%</span>
                  </div>
                  <Progress value={user.performance.teamManagement} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-tech-blue-100">培训认证</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {user.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-3">
                  {user.recentTraining.map((training) => (
                    <div key={training.id}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">{training.name}</span>
                        <span className="text-sm">{training.completion}%</span>
                      </div>
                      <Progress value={training.completion} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-tech-blue-100">当前目标</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.currentGoals.map((goal) => (
                  <div key={goal.id}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">{goal.name}</span>
                      <span className="text-sm">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 space-y-4">
            <Button className="w-full">编辑个人信息</Button>
            <Button variant="outline" className="w-full">
              查看完整档案
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

## components/work-log.tsx

/**
 * @file 工作日志组件
 * @description 显示用户的工作日志
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

 "use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash } from "lucide-react"

interface LogEntry {
  id: string
  date: string
  title: string
  content: string
}

export function WorkLog() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", date: "2024-03-05", title: "完成项目报告", content: "今天完成了Q1项目总结报告，并发送给了管理层审阅。" },
    { id: "2", date: "2024-03-06", title: "客户会议", content: "与ABC公司进行了视频会议，讨论了新产品需求。" },
  ])
  const [newLog, setNewLog] = useState({ title: "", content: "" })
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null)

  const handleAddLog = () => {
    if (newLog.title && newLog.content) {
      const today = new Date().toISOString().split("T")[0]
      setLogs([...logs, { id: Date.now().toString(), date: today, ...newLog }])
      setNewLog({ title: "", content: "" })
    }
  }

  const handleEditLog = (log: LogEntry) => {
    setEditingLog(log)
  }

  const handleUpdateLog = () => {
    if (editingLog) {
      setLogs(logs.map((log) => (log.id === editingLog.id ? editingLog : log)))
      setEditingLog(null)
    }
  }

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter((log) => log.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>工作日志</CardTitle>
        <CardDescription>记录每日工作内容和进展</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="日志标题"
              value={newLog.title}
              onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
            />
            <Textarea
              placeholder="日志内容"
              value={newLog.content}
              onChange={(e) => setNewLog({ ...newLog, content: e.target.value })}
            />
            <Button onClick={handleAddLog}>
              <Plus className="mr-2 h-4 w-4" /> 添加日志
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日期</TableHead>
                <TableHead>标题</TableHead>
                <TableHead>内容</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.title}</TableCell>
                  <TableCell>{log.content}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditLog(log)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteLog(log.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {editingLog && (
          <div className="mt-4 space-y-4">
            <Input value={editingLog.title} onChange={(e) => setEditingLog({ ...editingLog, title: e.target.value })} />
            <Textarea
              value={editingLog.content}
              onChange={(e) => setEditingLog({ ...editingLog, content: e.target.value })}
            />
            <Button onClick={handleUpdateLog}>更新日志</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

_______________
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

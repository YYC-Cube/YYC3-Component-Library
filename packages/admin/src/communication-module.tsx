"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Badge } from "@yyc3/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Input } from "@yyc3/ui/input"
import { MessageSquare, Bell, Users, Video } from "lucide-react"

export function CommunicationModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">沟通协作中心</h1>
          <p className="text-muted-foreground">团队沟通和协作工具集成平台</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white border-0"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            新建群聊
          </Button>
          <Button className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white">
            <Video className="w-4 h-4 mr-2" />
            发起会议
          </Button>
        </div>
      </div>

      {/* 沟通概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">未读消息</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <div className="flex items-center text-xs text-blue-600">
              <MessageSquare className="w-3 h-3 mr-1" />
              <span>待处理消息</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃群聊</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <div className="flex items-center text-xs text-green-600">
              <Users className="w-3 h-3 mr-1" />
              <span>正在讨论</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在线成员</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <div className="flex items-center text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              <span>当前在线</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日会议</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center text-xs text-purple-600">
              <Video className="w-3 h-3 mr-1" />
              <span>已安排会议</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 沟通协作详情 */}
      <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle>沟通协作详情</CardTitle>
          <CardDescription>全面的团队沟通和协作管理</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="messages" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="messages">消息中心</TabsTrigger>
              <TabsTrigger value="groups">群组管理</TabsTrigger>
              <TabsTrigger value="meetings">会议安排</TabsTrigger>
              <TabsTrigger value="notifications">通知管理</TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="space-y-4">
              <div className="flex justify-between items-center">
                <Input placeholder="搜索消息..." className="max-w-sm" />
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    标记已读
                  </Button>
                  <Button variant="outline" size="sm">
                    筛选
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    sender: "张三",
                    avatar: "Z",
                    message: "项目进度更新：客户管理模块已完成80%",
                    time: "5分钟前",
                    unread: true,
                    type: "工作群",
                  },
                  {
                    sender: "李四",
                    avatar: "L",
                    message: "明天的产品评审会议需要准备哪些材料？",
                    time: "15分钟前",
                    unread: true,
                    type: "产品团队",
                  },
                  {
                    sender: "王五",
                    avatar: "W",
                    message: "设计稿已更新，请查看最新版本",
                    time: "1小时前",
                    unread: false,
                    type: "设计组",
                  },
                  {
                    sender: "赵六",
                    avatar: "Z",
                    message: "本周销售数据统计完成，超额完成目标",
                    time: "2小时前",
                    unread: false,
                    type: "销售团队",
                  },
                ].map((msg, index) => (
                  <Card
                    key={index}
                    className={`bg-white/80 backdrop-blur-sm border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${msg.unread ? "border-blue-200 bg-blue-50/50" : "border-sky-200"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {msg.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{msg.sender}</h4>
                            <Badge variant="outline" className="text-xs">
                              {msg.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                            {msg.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>
                          <p className="text-sm text-muted-foreground">{msg.message}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          回复
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="groups" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "技术团队", members: 12, messages: 156, lastActive: "刚刚", type: "工作群" },
                  { name: "产品团队", members: 8, messages: 89, lastActive: "5分钟前", type: "工作群" },
                  { name: "设计团队", members: 6, messages: 67, lastActive: "10分钟前", type: "工作群" },
                  { name: "销售团队", members: 15, messages: 234, lastActive: "15分钟前", type: "工作群" },
                  { name: "管理层", members: 5, messages: 45, lastActive: "1小时前", type: "管理群" },
                  { name: "全体员工", members: 156, messages: 89, lastActive: "2小时前", type: "公告群" },
                ].map((group, index) => (
                  <Card
                    key={index}
                    className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{group.name}</CardTitle>
                        <Badge
                          variant={
                            group.type === "管理群" ? "default" : group.type === "公告群" ? "secondary" : "outline"
                          }
                        >
                          {group.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>成员数量</span>
                          <span className="font-medium">{group.members}人</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>消息数量</span>
                          <span className="font-medium">{group.messages}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>最后活跃</span>
                          <span className="text-muted-foreground">{group.lastActive}</span>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            进入群聊
                          </Button>
                          <Button size="sm" variant="outline">
                            管理
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="meetings" className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    title: "产品规划会议",
                    time: "今天 14:00-15:30",
                    participants: ["张三", "李四", "王五"],
                    status: "即将开始",
                    type: "线上会议",
                  },
                  {
                    title: "技术架构讨论",
                    time: "今天 16:00-17:00",
                    participants: ["技术团队"],
                    status: "已安排",
                    type: "线下会议",
                  },
                  {
                    title: "客户需求评审",
                    time: "明天 10:00-11:30",
                    participants: ["产品团队", "销售团队"],
                    status: "待确认",
                    type: "线上会议",
                  },
                  {
                    title: "月度总结会议",
                    time: "本周五 15:00-16:00",
                    participants: ["全体员工"],
                    status: "已安排",
                    type: "全员会议",
                  },
                ].map((meeting, index) => (
                  <Card
                    key={index}
                    className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{meeting.title}</h3>
                            <Badge
                              variant={
                                meeting.status === "即将开始"
                                  ? "default"
                                  : meeting.status === "已安排"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {meeting.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Video className="w-3 h-3 mr-1" />
                              {meeting.time}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {meeting.participants.join(", ")}
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="text-xs">
                                {meeting.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {meeting.status === "即将开始" && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Video className="w-3 h-3 mr-1" />
                              加入
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            详情
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    title: "系统维护通知",
                    content: "系统将于今晚22:00-24:00进行维护升级",
                    time: "1小时前",
                    type: "系统通知",
                    priority: "高",
                  },
                  {
                    title: "新员工入职",
                    content: "欢迎新同事小明加入我们的团队",
                    time: "3小时前",
                    type: "人事通知",
                    priority: "中",
                  },
                  {
                    title: "月度绩效评估",
                    content: "请各部门在本周内完成员工绩效评估",
                    time: "1天前",
                    type: "工作通知",
                    priority: "高",
                  },
                  {
                    title: "团建活动报名",
                    content: "下周末团建活动开始报名，名额有限",
                    time: "2天前",
                    type: "活动通知",
                    priority: "低",
                  },
                ].map((notification, index) => (
                  <Card
                    key={index}
                    className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <Badge
                              variant={
                                notification.priority === "高"
                                  ? "destructive"
                                  : notification.priority === "中"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {notification.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {notification.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.content}</p>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          标记已读
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { Input } from "@yyc3/ui-enterprise/input"
import { FileText, Clock, CheckCircle, XCircle, User, Calendar } from "lucide-react"

export function ApprovalModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">审批流程管理</h1>
          <p className="text-muted-foreground">高效的审批流程和工作流管理</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white border-0"
          >
            <FileText className="w-4 h-4 mr-2" />
            发起申请
          </Button>
          <Button className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white">
            <Clock className="w-4 h-4 mr-2" />
            流程设计
          </Button>
        </div>
      </div>

      {/* 审批概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待审批</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <div className="flex items-center text-xs text-orange-600">
              <Clock className="w-3 h-3 mr-1" />
              <span>需要处理</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已通过</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <div className="flex items-center text-xs text-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>本月通过</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已拒绝</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-xs text-red-600">
              <XCircle className="w-3 h-3 mr-1" />
              <span>需要修改</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均时长</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3天</div>
            <div className="flex items-center text-xs text-blue-600">
              <Calendar className="w-3 h-3 mr-1" />
              <span>处理效率</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 审批管理详情 */}
      <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle>审批管理详情</CardTitle>
          <CardDescription>全面的审批流程跟踪和管理</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">待审批</TabsTrigger>
              <TabsTrigger value="approved">已通过</TabsTrigger>
              <TabsTrigger value="rejected">已拒绝</TabsTrigger>
              <TabsTrigger value="workflow">流程管理</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <div className="flex justify-between items-center">
                <Input placeholder="搜索审批事项..." className="max-w-sm" />
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    筛选
                  </Button>
                  <Button variant="outline" size="sm">
                    批量处理
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "年度预算申请",
                    applicant: "财务部-张三",
                    type: "预算申请",
                    amount: "¥500,000",
                    submitTime: "2024-01-15 09:30",
                    urgency: "高",
                  },
                  {
                    title: "设备采购申请",
                    applicant: "技术部-李四",
                    type: "采购申请",
                    amount: "¥120,000",
                    submitTime: "2024-01-14 14:20",
                    urgency: "中",
                  },
                  {
                    title: "员工调薪申请",
                    applicant: "人事部-王五",
                    type: "人事申请",
                    amount: "¥8,000/月",
                    submitTime: "2024-01-13 16:45",
                    urgency: "低",
                  },
                  {
                    title: "差旅费用报销",
                    applicant: "销售部-赵六",
                    type: "费用报销",
                    amount: "¥3,200",
                    submitTime: "2024-01-12 11:15",
                    urgency: "中",
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{item.title}</h3>
                            <Badge
                              variant={
                                item.urgency === "高" ? "destructive" : item.urgency === "中" ? "default" : "secondary"
                              }
                            >
                              {item.urgency}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {item.applicant}
                            </div>
                            <div className="flex items-center">
                              <FileText className="w-3 h-3 mr-1" />
                              {item.type}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {item.submitTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600 mb-2">{item.amount}</div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              通过
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                              <XCircle className="w-3 h-3 mr-1" />
                              拒绝
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    title: "办公用品采购",
                    applicant: "行政部-钱七",
                    approver: "总经理-孙八",
                    amount: "¥15,000",
                    approveTime: "2024-01-10 15:30",
                    duration: "1.5天",
                  },
                  {
                    title: "培训费用申请",
                    applicant: "技术部-周九",
                    approver: "技术总监-吴十",
                    amount: "¥25,000",
                    approveTime: "2024-01-08 10:20",
                    duration: "2天",
                  },
                  {
                    title: "市场推广预算",
                    applicant: "市场部-郑一",
                    approver: "副总经理-王二",
                    amount: "¥80,000",
                    approveTime: "2024-01-05 14:45",
                    duration: "3天",
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                申请人: {item.applicant}
                              </div>
                              <div className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                审批人: {item.approver}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600 mb-1">{item.amount}</div>
                          <div className="text-xs text-muted-foreground">
                            <div>{item.approveTime}</div>
                            <div>耗时: {item.duration}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    title: "高端设备采购",
                    applicant: "研发部-李三",
                    rejector: "财务总监-张四",
                    amount: "¥200,000",
                    rejectTime: "2024-01-09 16:20",
                    reason: "预算超出年度计划，建议分期采购",
                  },
                  {
                    title: "团建活动申请",
                    applicant: "人事部-王五",
                    rejector: "总经理-赵六",
                    amount: "¥30,000",
                    rejectTime: "2024-01-07 11:30",
                    reason: "当前季度团建预算已用完",
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.title}</h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                申请人: {item.applicant}
                              </div>
                              <div className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                拒绝人: {item.rejector}
                              </div>
                              <div className="text-red-600 text-xs mt-2">拒绝原因: {item.reason}</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600 mb-1">{item.amount}</div>
                          <div className="text-xs text-muted-foreground mb-2">{item.rejectTime}</div>
                          <Button size="sm" variant="outline">
                            重新申请
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="workflow" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "费用报销流程",
                    steps: 4,
                    avgTime: "1.5天",
                    usage: "高频使用",
                    description: "员工费用报销标准流程",
                  },
                  {
                    name: "采购申请流程",
                    steps: 5,
                    avgTime: "3天",
                    usage: "中频使用",
                    description: "设备和物品采购审批流程",
                  },
                  {
                    name: "预算申请流程",
                    steps: 6,
                    avgTime: "5天",
                    usage: "低频使用",
                    description: "部门预算和大额支出审批",
                  },
                  {
                    name: "人事变动流程",
                    steps: 4,
                    avgTime: "2天",
                    usage: "中频使用",
                    description: "员工入职、调岗、离职流程",
                  },
                ].map((workflow, index) => (
                  <Card
                    key={index}
                    className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{workflow.name}</CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">流程步骤</span>
                          <Badge variant="secondary">{workflow.steps} 步</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">平均时长</span>
                          <span className="font-medium">{workflow.avgTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">使用频率</span>
                          <Badge
                            variant={
                              workflow.usage === "高频使用"
                                ? "default"
                                : workflow.usage === "中频使用"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {workflow.usage}
                          </Badge>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline">
                            编辑流程
                          </Button>
                          <Button size="sm" variant="outline">
                            查看详情
                          </Button>
                        </div>
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

/**
 * @file 目标量化管理组件
 * @description 提供年度、季度、月度目标分解与跟踪功能
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@yyc3/ui/accordion"
import { Progress } from "@yyc3/ui/progress"
import { Button } from "@yyc3/ui/button"
import { Edit, Download, Plus } from "lucide-react"

// 模拟年度目标数据
const annualGoals = [
  {
    id: "G1",
    title: "销售额提升50%",
    description: "全年销售额较去年提升50%，达到1000万元",
    progress: 65,
    department: "销售部",
    quarters: [
      {
        id: "Q1",
        title: "Q1: 完成200万元",
        progress: 100,
        months: [
          { id: "M1", title: "1月: 60万元", progress: 100 },
          { id: "M2", title: "2月: 70万元", progress: 100 },
          { id: "M3", title: "3月: 70万元", progress: 100 },
        ],
      },
      {
        id: "Q2",
        title: "Q2: 完成250万元",
        progress: 80,
        months: [
          { id: "M4", title: "4月: 80万元", progress: 100 },
          { id: "M5", title: "5月: 80万元", progress: 100 },
          { id: "M6", title: "6月: 90万元", progress: 45 },
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
              <Download className="mr-1 h-4 w-4" />
              导出
            </Button>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              新建目标
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
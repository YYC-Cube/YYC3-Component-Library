/**
 * @file 荣誉奖池组件
 * @description 显示和管理公司员工的荣誉奖池，包括可获得的荣誉和员工荣誉排行榜
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { Input } from "@yyc3/ui-enterprise/input"
import { ScrollArea } from "@yyc3/ui-enterprise/scroll-area"
import { Badge } from "@yyc3/ui-enterprise/badge"
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
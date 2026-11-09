"use client"

import { useState, useEffect } from "react"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building,
  Calendar,
  ChevronDown,
  Clock,
  DollarSign,
  Eye,
  LineChart,
  Map,
  PieChart,
  Shield,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Button } from "@yyc3/ui/button"
import { Progress } from "@yyc3/ui/progress"
import { Badge } from "@yyc3/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { ColorLegend } from "@/components/color-legend"

export function StrategicCommandCenter() {
  const [occupancyRate, setOccupancyRate] = useState(78)
  const [entertainmentTraffic, setEntertainmentTraffic] = useState(65)
  const [diningTurnover, setDiningTurnover] = useState(82)
  const [alertLevel, setAlertLevel] = useState("medium")

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOccupancyRate((prev) => Math.min(100, Math.max(50, prev + (Math.random() * 6 - 3))))
      setEntertainmentTraffic((prev) => Math.min(100, Math.max(40, prev + (Math.random() * 8 - 4))))
      setDiningTurnover((prev) => Math.min(100, Math.max(60, prev + (Math.random() * 5 - 2.5))))

      // Randomly change alert level
      if (Math.random() > 0.9) {
        const levels = ["low", "medium", "high"]
        setAlertLevel(levels[Math.floor(Math.random() * levels.length)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">全景作战室</h2>
          <p className="text-blue-300">战略决策中枢 - 实时数据分析与资源调度</p>
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
          <ColorLegend className="bg-blue-900/30 p-2 rounded-md border border-blue-800" />
          <div className="flex items-center gap-2">
            <Select defaultValue="today">
              <SelectTrigger className="w-[180px] bg-blue-900/50 text-blue-100 border-blue-700">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">今日数据</SelectItem>
                <SelectItem value="week">本周数据</SelectItem>
                <SelectItem value="month">本月数据</SelectItem>
                <SelectItem value="quarter">本季度数据</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-blue-700 text-blue-100 hover:bg-blue-800">
              <Eye className="mr-2 h-4 w-4" />
              实时监控
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="battlefield" className="space-y-4">
        <TabsList className="bg-blue-900/50 text-blue-300">
          <TabsTrigger
            value="battlefield"
            className="data-[state=active]:bg-blue-800 data-[state=active]:text-white"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/command-center/battlefield")
              }
            }}
          >
            战情沙盘
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="data-[state=active]:bg-blue-800 data-[state=active]:text-white"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/command-center/resources")
              }
            }}
          >
            火力部署台
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="data-[state=active]:bg-blue-800 data-[state=active]:text-white"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/command-center/alerts")
              }
            }}
          >
            敌情预警站
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="data-[state=active]:bg-blue-800 data-[state=active]:text-white"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/command-center/analysis")
              }
            }}
          >
            战果陈列室
          </TabsTrigger>
        </TabsList>

        <TabsContent value="battlefield" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-900/40 border-blue-800 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Building className="mr-2 h-5 w-5 text-blue-400" />
                  客房入住率
                </CardTitle>
                <CardDescription className="text-blue-300">实时客房状态监控</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{occupancyRate.toFixed(1)}%</div>
                  <Badge variant={occupancyRate > 75 ? "success" : "default"} className="bg-green-600">
                    高于目标
                  </Badge>
                </div>
                <Progress value={occupancyRate} className="h-2 mt-4 bg-blue-950 [&>div]:bg-emerald-500" />
                <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-blue-300">
                  <div className="flex flex-col items-center p-2 bg-blue-800/50 rounded-md">
                    <span className="text-lg font-medium text-white">42</span>
                    <span>空闲</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-blue-800/50 rounded-md">
                    <span className="text-lg font-medium text-white">156</span>
                    <span>已入住</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-blue-800/50 rounded-md">
                    <span className="text-lg font-medium text-white">22</span>
                    <span>待清理</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-900/40 border-blue-800 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-400" />
                  娱乐区客流量
                </CardTitle>
                <CardDescription className="text-blue-300">实时客流热力分布</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{entertainmentTraffic.toFixed(1)}%</div>
                  <Badge variant={entertainmentTraffic > 60 ? "success" : "default"} className="bg-green-600">
                    正常水平
                  </Badge>
                </div>
                <Progress value={entertainmentTraffic} className="h-2 mt-4 bg-blue-950 [&>div]:bg-purple-500" />
                <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-blue-300">
                  <div className="flex flex-col items-center p-2 bg-blue-800/50 rounded-md">
                    <span className="text-lg font-medium text-white">87</span>
                    <span>SPA区</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-blue-800/50 rounded-md">
                    <span className="text-lg font-medium text-white">124</span>
                    <span>游泳区</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-blue-800/50 rounded-md">
                    <span className="text-lg font-medium text-white">63</span>
                    <span>健身区</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-900/40 border-blue-800 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-blue-400" />
                  餐饮翻台率
                </CardTitle>
                <CardDescription className="text-blue-300">餐厅运营效率指标</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{diningTurnover.toFixed(1)}%</div>
                  <Badge variant={diningTurnover > 80 ? "success" : "default"} className="bg-green-600">
                    高效运营
                  </Badge>
                </div>
                <Progress value={diningTurnover} className="h-2 mt-4 bg-blue-950 [&>div]:bg-amber-500" />
                <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-blue-300">
                  <div className="flex flex-col items-center p-2 bg-blue-800/50 rounded-md">
                    <span className="text-lg font-medium text-white">4.2</span>
                    <span>中餐厅</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-blue-800/50 rounded-md">
                    <span className="text-lg font-medium text-white">3.8</span>
                    <span>西餐厅</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-blue-800/50 rounded-md">
                    <span className="text-lg font-medium text-white">5.1</span>
                    <span>咖啡厅</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-900/40 border-blue-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="mr-2 h-5 w-5 text-blue-400" />
                三维热力分布模型
              </CardTitle>
              <CardDescription className="text-blue-300">整合客房、娱乐区、餐饮区的实时动态模型</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md bg-blue-950/80 flex items-center justify-center border border-blue-800">
                <div className="text-center p-6">
                  <Map className="h-16 w-16 mx-auto text-blue-500 opacity-50" />
                  <p className="mt-4 text-blue-300">三维热力分布模型加载中...</p>
                  <p className="text-xs text-blue-400 mt-2">显示各区域客流密度、人员分布与资源利用率</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card className="bg-blue-900/40 border-blue-800 text-white">
            <CardHeader>
              <CardTitle>资源调度中心</CardTitle>
              <CardDescription className="text-blue-300">人力/物资/设备的实时分布与调度轨迹</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-950/60 p-4 rounded-lg border border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-400" />
                        人力资源
                      </h3>
                      <Badge className="bg-blue-700">42人在岗</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">前台接待</span>
                        <span>8人</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">客房服务</span>
                        <span>14人</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">餐饮服务</span>
                        <span>12人</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">安保人员</span>
                        <span>8人</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 border-blue-700 text-blue-100 hover:bg-blue-800"
                    >
                      调整人力部署
                    </Button>
                  </div>

                  <div className="bg-blue-950/60 p-4 rounded-lg border border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
                        物资库存
                      </h3>
                      <Badge className="bg-blue-700">92%充足</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">客房用品</span>
                        <span>充足</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">餐饮原料</span>
                        <span>充足</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">清洁用品</span>
                        <span>充足</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">维修配件</span>
                        <span className="text-yellow-400">偏低</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 border-blue-700 text-blue-100 hover:bg-blue-800"
                    >
                      查看库存详情
                    </Button>
                  </div>

                  <div className="bg-blue-950/60 p-4 rounded-lg border border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-blue-400" />
                        设备状态
                      </h3>
                      <Badge className="bg-blue-700">98%正常</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">空调系统</span>
                        <span>正常</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">电梯系统</span>
                        <span>正常</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">安防系统</span>
                        <span>正常</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">厨房设备</span>
                        <span className="text-yellow-400">需检修</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 border-blue-700 text-blue-100 hover:bg-blue-800"
                    >
                      设备维护计划
                    </Button>
                  </div>
                </div>

                <div className="aspect-video rounded-md bg-blue-950/80 flex items-center justify-center border border-blue-800">
                  <div className="text-center p-6">
                    <Activity className="h-16 w-16 mx-auto text-blue-500 opacity-50" />
                    <p className="mt-4 text-blue-300">资源调度轨迹可视化</p>
                    <p className="text-xs text-blue-400 mt-2">显示人员移动路径、物资流转与设备使用状态</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card className="bg-blue-900/40 border-blue-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle
                  className={`mr-2 h-5 w-5 ${
                    alertLevel === "high"
                      ? "text-red-400"
                      : alertLevel === "medium"
                        ? "text-yellow-400"
                        : "text-green-400"
                  }`}
                />
                风险雷达
              </CardTitle>
              <CardDescription className="text-blue-300">
                客户投诉热度、设备故障预警、安全隐患扫描的三色预警体系
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-950/60 p-4 rounded-lg border border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-400" />
                        客户投诉热度
                      </h3>
                      <Badge
                        className={`${
                          alertLevel === "high"
                            ? "bg-red-600"
                            : alertLevel === "medium"
                              ? "bg-yellow-600"
                              : "bg-green-600"
                        }`}
                      >
                        {alertLevel === "high" ? "高" : alertLevel === "medium" ? "中" : "低"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">噪音问题</span>
                        <span>3起</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">设施故障</span>
                        <span>2起</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">服务态度</span>
                        <span>1起</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">其他问题</span>
                        <span>0起</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 border-blue-700 text-blue-100 hover:bg-blue-800"
                    >
                      查看投诉详情
                    </Button>
                  </div>

                  <div className="bg-blue-950/60 p-4 rounded-lg border border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-blue-400" />
                        设备故障预警
                      </h3>
                      <Badge className="bg-yellow-600">中</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">空调系统</span>
                        <span className="text-green-400">正常</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">电梯系统</span>
                        <span className="text-green-400">正常</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">热水系统</span>
                        <span className="text-yellow-400">注意</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">厨房设备</span>
                        <span className="text-yellow-400">注意</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 border-blue-700 text-blue-100 hover:bg-blue-800"
                    >
                      设备维护计划
                    </Button>
                  </div>

                  <div className="bg-blue-950/60 p-4 rounded-lg border border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-blue-400" />
                        安全隐患扫描
                      </h3>
                      <Badge className="bg-green-600">低</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">消防系统</span>
                        <span className="text-green-400">正常</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">监控系统</span>
                        <span className="text-green-400">正常</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">门禁系统</span>
                        <span className="text-green-400">正常</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">应急通道</span>
                        <span className="text-green-400">正常</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 border-blue-700 text-blue-100 hover:bg-blue-800"
                    >
                      安全检查报告
                    </Button>
                  </div>
                </div>

                <div className="aspect-video rounded-md bg-blue-950/80 flex items-center justify-center border border-blue-800">
                  <div className="text-center p-6">
                    <AlertTriangle className="h-16 w-16 mx-auto text-blue-500 opacity-50" />
                    <p className="mt-4 text-blue-300">三色预警体系可视化</p>
                    <p className="text-xs text-blue-400 mt-2">实时监控潜在风险，提供预警与解决方案</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card className="bg-blue-900/40 border-blue-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="mr-2 h-5 w-5 text-blue-400" />
                对标分析
              </CardTitle>
              <CardDescription className="text-blue-300">
                行业标杆对比、历史数据趋势、区域竞品动态的可视化矩阵
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-950/60 p-4 rounded-lg border border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
                        行业标杆对比
                      </h3>
                      <Badge className="bg-green-600">领先</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-300">客房入住率</span>
                          <span>+8.2%</span>
                        </div>
                        <Progress value={78} className="h-1 bg-blue-950 [&>div]:bg-teal-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-300">客户满意度</span>
                          <span>+4.5%</span>
                        </div>
                        <Progress value={92} className="h-1 bg-blue-950 [&>div]:bg-teal-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-300">人均消费</span>
                          <span>+12.3%</span>
                        </div>
                        <Progress value={85} className="h-1 bg-blue-950 [&>div]:bg-teal-500" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-950/60 p-4 rounded-lg border border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-400" />
                        历史数据趋势
                      </h3>
                      <Badge className="bg-green-600">上升</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-300">月度营收</span>
                          <span>+15.7%</span>
                        </div>
                        <Progress value={86} className="h-1 bg-blue-950 [&>div]:bg-rose-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-300">运营成本</span>
                          <span>-8.2%</span>
                        </div>
                        <Progress value={68} className="h-1 bg-blue-950 [&>div]:bg-rose-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-300">员工效能</span>
                          <span>+10.4%</span>
                        </div>
                        <Progress value={82} className="h-1 bg-blue-950 [&>div]:bg-rose-500" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-950/60 p-4 rounded-lg border border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <PieChart className="h-4 w-4 mr-2 text-blue-400" />
                        区域竞品动态
                      </h3>
                      <Badge className="bg-blue-700">监控中</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-300">价格策略</span>
                          <span>领先</span>
                        </div>
                        <Progress value={75} className="h-1 bg-blue-950 [&>div]:bg-orange-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-300">促销活动</span>
                          <span>持平</span>
                        </div>
                        <Progress value={65} className="h-1 bg-blue-950 [&>div]:bg-orange-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-300">市场份额</span>
                          <span>领先</span>
                        </div>
                        <Progress value={72} className="h-1 bg-blue-950 [&>div]:bg-orange-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="aspect-video rounded-md bg-blue-950/80 flex items-center justify-center border border-blue-800">
                  <div className="text-center p-6">
                    <Calendar className="h-16 w-16 mx-auto text-blue-500 opacity-50" />
                    <p className="mt-4 text-blue-300">可视化对标分析矩阵</p>
                    <p className="text-xs text-blue-400 mt-2">多维度数据对比，发现优势与不足</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-blue-900/40 border-blue-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChevronDown className="mr-2 h-5 w-5 text-blue-400" />
              今日战报
            </CardTitle>
            <CardDescription className="text-blue-300">关键指标摘要与行动建议</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-950/60 rounded-md border border-blue-800">
                <h3 className="font-medium mb-2">关键指标</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-300">总营收</span>
                    <span>¥286,420</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">入住率</span>
                    <span>78.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">客单价</span>
                    <span>¥1,240</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">满意度</span>
                    <span>4.7/5</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-950/60 rounded-md border border-blue-800">
                <h3 className="font-medium mb-2">行动建议</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-600 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">1</span>
                    </div>
                    <span>增加SPA区人力配置，应对18:00-21:00客流高峰</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-600 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">2</span>
                    </div>
                    <span>安排厨房设备检修，避免影响晚餐服务质量</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-600 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">3</span>
                    </div>
                    <span>针对噪音投诉，调整502-508房间的隔音措施</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/40 border-blue-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChevronDown className="mr-2 h-5 w-5 text-blue-400" />
              未来战略
            </CardTitle>
            <CardDescription className="text-blue-300">预测分析与资源优化建议</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-950/60 rounded-md border border-blue-800">
                <h3 className="font-medium mb-2">预测分析</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-300">明日入住率</span>
                    <span>82.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">周末高峰</span>
                    <span>95.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">餐饮预订</span>
                    <span>+18.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">活动需求</span>
                    <span>高</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-950/60 rounded-md border border-blue-800">
                <h3 className="font-medium mb-2">资源优化建议</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">1</span>
                    </div>
                    <span>周末增加20%客房服务人员，应对入住高峰</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">2</span>
                    </div>
                    <span>提前备货高需求餐饮原料，优化厨房工作流程</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">3</span>
                    </div>
                    <span>调整会议厅设备配置，满足周末活动需求</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import type React from "react"
import DashboardHeader from "../components/dashboard-header"
import PageBackground from "../components/page-background"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ArrowUpRight, BarChart3, LineChartIcon, PieChartIcon, Users } from "lucide-react"

const performanceData = [
  { name: "1月", 阅读量: 4000, 点赞: 2400, 评论: 1200 },
  { name: "2月", 阅读量: 3000, 点赞: 1398, 评论: 900 },
  { name: "3月", 阅读量: 2000, 点赞: 9800, 评论: 2900 },
  { name: "4月", 阅读量: 2780, 点赞: 3908, 评论: 1500 },
  { name: "5月", 阅读量: 1890, 点赞: 4800, 评论: 1700 },
  { name: "6月", 阅读量: 2390, 点赞: 3800, 评论: 2100 },
]

const platformData = [
  { name: "微信", value: 35 },
  { name: "抖音", value: 30 },
  { name: "小红书", value: 20 },
  { name: "其他", value: 15 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function DashboardPage() {
  return (
    <PageBackground image="/images/bg-globe-digital.jpeg">
      <DashboardHeader />

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900">数据仪表盘</h1>
            <p className="mt-2 text-gray-600">实时监控关键指标，把握业务动态</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="card-hover glass-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <FileIcon className="h-6 w-6" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">内容总数</p>
                  <h3 className="text-2xl font-bold">1,284</h3>
                  <p className="text-xs text-green-500 mt-1">↑ 12% 较上月</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover glass-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">用户数量</p>
                  <h3 className="text-2xl font-bold">8,549</h3>
                  <p className="text-xs text-green-500 mt-1">↑ 8% 较上月</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover glass-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">总浏览量</p>
                  <h3 className="text-2xl font-bold">245,673</h3>
                  <p className="text-xs text-green-500 mt-1">↑ 24% 较上月</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover glass-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <TrendingUpIcon className="h-6 w-6" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">转化率</p>
                  <h3 className="text-2xl font-bold">5.2%</h3>
                  <p className="text-xs text-green-500 mt-1">↑ 0.8% 较上月</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="card-hover glass-card md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>内容表现趋势</CardTitle>
                    <CardDescription>近6个月内容表现数据分析</CardDescription>
                  </div>
                  <LineChartIcon className="h-5 w-5 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      阅读量: {
                        label: "阅读量",
                        color: "hsl(var(--chart-1))",
                      },
                      点赞: {
                        label: "点赞",
                        color: "hsl(var(--chart-2))",
                      },
                      评论: {
                        label: "评论",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="阅读量" stroke="var(--color-阅读量)" />
                        <Line type="monotone" dataKey="点赞" stroke="var(--color-点赞)" />
                        <Line type="monotone" dataKey="评论" stroke="var(--color-评论)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>平台分布</CardTitle>
                    <CardDescription>内容在各平台的分布情况</CardDescription>
                  </div>
                  <PieChartIcon className="h-5 w-5 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-hover glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>热门内容排行</CardTitle>
                  <CardDescription>近30天表现最佳的内容</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  查看全部
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {item}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">
                        {item === 1 && "如何利用AI提升内容创作效率"}
                        {item === 2 && "2023年电商平台流量获取策略"}
                        {item === 3 && "短视频运营必备的10个技巧"}
                        {item === 4 && "新手如何快速掌握数据分析"}
                        {item === 5 && "提升转化率的5个实用方法"}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>阅读: {Math.floor(Math.random() * 10000)}</span>
                        <span>点赞: {Math.floor(Math.random() * 1000)}</span>
                        <span>评论: {Math.floor(Math.random() * 100)}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-green-500 font-medium">+{Math.floor(Math.random() * 100)}%</div>
                      <div className="text-xs text-gray-500">较上周</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </PageBackground>
  )
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

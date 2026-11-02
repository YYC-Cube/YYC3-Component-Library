import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, LineChart, PieChart, TrendingUp, Users, Settings } from "lucide-react"
import { ChartContainer } from "@/components/ui/chart"
import {
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart as RechartsBarChart,
} from "recharts"

const performanceData = [
  { name: "1月", 阅读量: 4000, 点赞: 2400, 评论: 1200 },
  { name: "2月", 阅读量: 3000, 点赞: 1398, 评论: 900 },
  { name: "3月", 阅读量: 2000, 点赞: 9800, 评论: 2900 },
  { name: "4月", 阅读量: 2780, 点赞: 3908, 评论: 1500 },
  { name: "5月", 阅读量: 1890, 点赞: 4800, 评论: 1700 },
  { name: "6月", 阅读量: 2390, 点赞: 3800, 评论: 2100 },
]

const trendData = [
  { name: "第1周", 搜索热度: 65, 社交提及: 28 },
  { name: "第2周", 搜索热度: 59, 社交提及: 48 },
  { name: "第3周", 搜索热度: 80, 社交提及: 40 },
  { name: "第4周", 搜索热度: 81, 社交提及: 19 },
  { name: "第5周", 搜索热度: 56, 社交提及: 86 },
  { name: "第6周", 搜索热度: 55, 社交提及: 27 },
  { name: "第7周", 搜索热度: 40, 社交提及: 90 },
]

export default function DataAnalysisPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              内容表现分析
            </CardTitle>
            <CardDescription>分析内容表现数据，优化创作策略</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  平台数据
                </Button>
                <Button variant="outline" className="justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  用户画像
                </Button>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                内容趋势
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">查看分析</Button>
          </CardFooter>
        </Card>

        <Card className="card-hover glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              市场趋势预测
            </CardTitle>
            <CardDescription>预测行业热点，把握市场机会</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  热搜预测
                </Button>
                <Button variant="outline" className="justify-start">
                  <LineChart className="mr-2 h-4 w-4" />
                  季节趋势
                </Button>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <PieChart className="mr-2 h-4 w-4" />
                竞品分析
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">查看预测</Button>
          </CardFooter>
        </Card>

        <Card className="card-hover glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <AlertCircleIcon className="h-5 w-5 text-blue-500" />
              智能预警系统
            </CardTitle>
            <CardDescription>监测异常数据，及时应对风险</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <TrendingDown className="mr-2 h-4 w-4" />
                  流量异常
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  舆情监测
                </Button>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                预警设置
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">查看预警</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-hover glass-card">
          <CardHeader>
            <CardTitle>内容表现趋势</CardTitle>
            <CardDescription>近6个月内容表现数据分析</CardDescription>
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
                  <RechartsLineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="阅读量" stroke="var(--color-阅读量)" />
                    <Line type="monotone" dataKey="点赞" stroke="var(--color-点赞)" />
                    <Line type="monotone" dataKey="评论" stroke="var(--color-评论)" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover glass-card">
          <CardHeader>
            <CardTitle>市场热点趋势</CardTitle>
            <CardDescription>近7周市场热点趋势分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  搜索热度: {
                    label: "搜索热度",
                    color: "hsl(var(--chart-1))",
                  },
                  社交提及: {
                    label: "社交提及",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="搜索热度" fill="var(--color-搜索热度)" />
                    <Bar dataKey="社交提及" fill="var(--color-社交提及)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}

function TrendingDown(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  )
}

function MessageSquare(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

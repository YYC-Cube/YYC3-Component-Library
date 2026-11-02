import DashboardHeader from "../components/dashboard-header"
import PageBackground from "../components/page-background"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Calendar, Download, Filter, LineChartIcon, PieChartIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const contentData = [
  { name: "1月", 文章: 40, 视频: 24, 图文: 28 },
  { name: "2月", 文章: 30, 视频: 28, 图文: 32 },
  { name: "3月", 文章: 20, 视频: 38, 图文: 42 },
  { name: "4月", 文章: 27, 视频: 39, 图文: 35 },
  { name: "5月", 文章: 18, 视频: 48, 图文: 40 },
  { name: "6月", 文章: 23, 视频: 38, 图文: 42 },
]

const userDemographics = [
  { name: "18-24岁", value: 15 },
  { name: "25-34岁", value: 35 },
  { name: "35-44岁", value: 30 },
  { name: "45-54岁", value: 15 },
  { name: "55+岁", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const engagementData = [
  { name: "周一", 浏览量: 4000, 互动量: 2400 },
  { name: "周二", 浏览量: 3000, 互动量: 1398 },
  { name: "周三", 浏览量: 2000, 互动量: 9800 },
  { name: "周四", 浏览量: 2780, 互动量: 3908 },
  { name: "周五", 浏览量: 1890, 互动量: 4800 },
  { name: "周六", 浏览量: 2390, 互动量: 3800 },
  { name: "周日", 浏览量: 3490, 互动量: 4300 },
]

export default function AnalyticsPage() {
  return (
    <PageBackground image="/images/bg-city-3d.jpeg">
      <DashboardHeader />

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">数据分析</h1>
                <p className="mt-2 text-gray-600">深入分析内容表现和用户行为</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>选择日期</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>筛选</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>导出</span>
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto bg-white/80 backdrop-blur-sm shadow-md">
              <TabsTrigger value="content" className="py-3 px-4">
                内容分析
              </TabsTrigger>
              <TabsTrigger value="user" className="py-3 px-4">
                用户分析
              </TabsTrigger>
              <TabsTrigger value="engagement" className="py-3 px-4">
                互动分析
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="card-hover glass-card">
                  <CardHeader>
                    <CardTitle>内容总量</CardTitle>
                    <CardDescription>按类型统计的内容数量</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold">1,284</div>
                      <div className="text-sm text-gray-500">总内容数</div>
                      <div className="flex justify-center gap-4 mt-4">
                        <div className="text-center">
                          <div className="text-xl font-semibold">542</div>
                          <div className="text-xs text-gray-500">文章</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">386</div>
                          <div className="text-xs text-gray-500">视频</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">356</div>
                          <div className="text-xs text-gray-500">图文</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover glass-card">
                  <CardHeader>
                    <CardTitle>平均浏览量</CardTitle>
                    <CardDescription>每篇内容的平均浏览量</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold">2,547</div>
                      <div className="text-sm text-gray-500">平均浏览量/内容</div>
                      <div className="flex justify-center gap-4 mt-4">
                        <div className="text-center">
                          <div className="text-xl font-semibold">1,842</div>
                          <div className="text-xs text-gray-500">文章</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">3,256</div>
                          <div className="text-xs text-gray-500">视频</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">2,543</div>
                          <div className="text-xs text-gray-500">图文</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover glass-card">
                  <CardHeader>
                    <CardTitle>内容增长率</CardTitle>
                    <CardDescription>与上月相比的内容增长率</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-green-500">+12.4%</div>
                      <div className="text-sm text-gray-500">总体增长率</div>
                      <div className="flex justify-center gap-4 mt-4">
                        <div className="text-center">
                          <div className="text-xl font-semibold text-green-500">+8.2%</div>
                          <div className="text-xs text-gray-500">文章</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold text-green-500">+15.6%</div>
                          <div className="text-xs text-gray-500">视频</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold text-green-500">+13.4%</div>
                          <div className="text-xs text-gray-500">图文</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="card-hover glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>内容发布趋势</CardTitle>
                      <CardDescription>按月份和类型统计的内容发布量</CardDescription>
                    </div>
                    <Select defaultValue="6months">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择时间范围" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30days">最近30天</SelectItem>
                        <SelectItem value="3months">最近3个月</SelectItem>
                        <SelectItem value="6months">最近6个月</SelectItem>
                        <SelectItem value="1year">最近1年</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ChartContainer
                      config={{
                        文章: {
                          label: "文章",
                          color: "hsl(var(--chart-1))",
                        },
                        视频: {
                          label: "视频",
                          color: "hsl(var(--chart-2))",
                        },
                        图文: {
                          label: "图文",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={contentData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="文章" fill="var(--color-文章)" />
                          <Bar dataKey="视频" fill="var(--color-视频)" />
                          <Bar dataKey="图文" fill="var(--color-图文)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="user" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="card-hover glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>用户年龄分布</CardTitle>
                        <CardDescription>按年龄段统计的用户分布</CardDescription>
                      </div>
                      <PieChartIcon className="h-5 w-5 text-gray-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={userDemographics}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {userDemographics.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>用户地域分布</CardTitle>
                        <CardDescription>按地区统计的用户分布</CardDescription>
                      </div>
                      <Select defaultValue="province">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="选择粒度" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="province">省份</SelectItem>
                          <SelectItem value="city">城市</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "广东省", value: 25, color: "bg-blue-500" },
                        { name: "北京市", value: 18, color: "bg-green-500" },
                        { name: "上海市", value: 15, color: "bg-yellow-500" },
                        { name: "浙江省", value: 12, color: "bg-purple-500" },
                        { name: "四川省", value: 8, color: "bg-red-500" },
                        { name: "其他地区", value: 22, color: "bg-gray-500" },
                      ].map((item) => (
                        <div key={item.name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span>{item.value}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="card-hover glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>用户活跃度分析</CardTitle>
                      <CardDescription>按时间段统计的用户活跃情况</CardDescription>
                    </div>
                    <LineChartIcon className="h-5 w-5 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        活跃用户: {
                          label: "活跃用户",
                          color: "hsl(var(--chart-1))",
                        },
                        新增用户: {
                          label: "新增用户",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            { name: "00:00", 活跃用户: 400, 新增用户: 100 },
                            { name: "04:00", 活跃用户: 200, 新增用户: 50 },
                            { name: "08:00", 活跃用户: 800, 新增用户: 200 },
                            { name: "12:00", 活跃用户: 1200, 新增用户: 300 },
                            { name: "16:00", 活跃用户: 1800, 新增用户: 400 },
                            { name: "20:00", 活跃用户: 2000, 新增用户: 500 },
                            { name: "24:00", 活跃用户: 1600, 新增用户: 300 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="活跃用户"
                            stroke="var(--color-活跃用户)"
                            fill="var(--color-活跃用户)"
                            fillOpacity={0.3}
                          />
                          <Area
                            type="monotone"
                            dataKey="新增用户"
                            stroke="var(--color-新增用户)"
                            fill="var(--color-新增用户)"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="card-hover glass-card">
                  <CardHeader>
                    <CardTitle>互动总量</CardTitle>
                    <CardDescription>所有内容的互动总量</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold">124,856</div>
                      <div className="text-sm text-gray-500">总互动量</div>
                      <div className="flex justify-center gap-4 mt-4">
                        <div className="text-center">
                          <div className="text-xl font-semibold">86,542</div>
                          <div className="text-xs text-gray-500">点赞</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">32,186</div>
                          <div className="text-xs text-gray-500">评论</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">6,128</div>
                          <div className="text-xs text-gray-500">分享</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover glass-card">
                  <CardHeader>
                    <CardTitle>互动率</CardTitle>
                    <CardDescription>浏览量与互动量的比率</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold">5.2%</div>
                      <div className="text-sm text-gray-500">平均互动率</div>
                      <div className="flex justify-center gap-4 mt-4">
                        <div className="text-center">
                          <div className="text-xl font-semibold">3.8%</div>
                          <div className="text-xs text-gray-500">文章</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">7.6%</div>
                          <div className="text-xs text-gray-500">视频</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">4.2%</div>
                          <div className="text-xs text-gray-500">图文</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover glass-card">
                  <CardHeader>
                    <CardTitle>互动增长率</CardTitle>
                    <CardDescription>与上月相比的互动增长率</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-green-500">+18.7%</div>
                      <div className="text-sm text-gray-500">总体增长率</div>
                      <div className="flex justify-center gap-4 mt-4">
                        <div className="text-center">
                          <div className="text-xl font-semibold text-green-500">+15.2%</div>
                          <div className="text-xs text-gray-500">点赞</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold text-green-500">+22.6%</div>
                          <div className="text-xs text-gray-500">评论</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold text-green-500">+18.4%</div>
                          <div className="text-xs text-gray-500">分享</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="card-hover glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>每日互动趋势</CardTitle>
                      <CardDescription>按日期统计的浏览量和互动量</CardDescription>
                    </div>
                    <Select defaultValue="7days">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择时间范围" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">最近7天</SelectItem>
                        <SelectItem value="30days">最近30天</SelectItem>
                        <SelectItem value="3months">最近3个月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ChartContainer
                      config={{
                        浏览量: {
                          label: "浏览量",
                          color: "hsl(var(--chart-1))",
                        },
                        互动量: {
                          label: "互动量",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={engagementData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="浏览量" stroke="var(--color-浏览量)" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="互动量" stroke="var(--color-互动量)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </PageBackground>
  )
}

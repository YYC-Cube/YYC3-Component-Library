"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock, Edit, Eye, Filter, MessageSquarePlus, MoreHorizontal, Search, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import PageBackground from "../components/page-background"
import DashboardHeader from "../components/dashboard-header"

// 发布平台数据
const publishPlatforms = [
  { id: "xiaohongshu", name: "小红书", icon: MessageSquarePlus, color: "text-red-500" },
  { id: "wechat", name: "微信公众号", icon: MessageSquarePlus, color: "text-green-500" },
  { id: "douyin", name: "抖音", icon: MessageSquarePlus, color: "text-black dark:text-white" },
  { id: "weibo", name: "微博", icon: MessageSquarePlus, color: "text-yellow-500" },
  { id: "zhihu", name: "知乎", icon: MessageSquarePlus, color: "text-blue-500" },
]

// 模拟已发布内容数据
const publishedContent = [
  {
    id: "p1",
    title: "10个提高工作效率的实用技巧",
    platform: "wechat",
    publishDate: "2023-04-15 14:30",
    status: "published",
    views: 1245,
    likes: 89,
    comments: 32,
  },
  {
    id: "p2",
    title: "不踩坑！超详细测评新款耳机",
    platform: "xiaohongshu",
    publishDate: "2023-04-12 10:15",
    status: "published",
    views: 3567,
    likes: 245,
    comments: 78,
  },
  {
    id: "p3",
    title: "三分钟学会这个实用技能",
    platform: "douyin",
    publishDate: "2023-04-10 18:45",
    status: "published",
    views: 12890,
    likes: 1456,
    comments: 234,
  },
  {
    id: "p4",
    title: "年轻人必备的理财知识",
    platform: "zhihu",
    publishDate: "2023-04-08 09:20",
    status: "published",
    views: 2345,
    likes: 156,
    comments: 45,
  },
  {
    id: "p5",
    title: "今日份穿搭分享 #时尚",
    platform: "weibo",
    publishDate: "2023-04-05 12:10",
    status: "published",
    views: 876,
    likes: 67,
    comments: 12,
  },
]

// 模拟计划发布内容数据
const scheduledContent = [
  {
    id: "s1",
    title: "夏季护肤指南：如何应对高温天气",
    platform: "xiaohongshu",
    scheduledDate: "2023-04-20 10:00",
    status: "scheduled",
  },
  {
    id: "s2",
    title: "5G技术将如何改变我们的生活",
    platform: "wechat",
    scheduledDate: "2023-04-22 14:30",
    status: "scheduled",
  },
  {
    id: "s3",
    title: "一分钟教你做美味早餐",
    platform: "douyin",
    scheduledDate: "2023-04-21 08:00",
    status: "scheduled",
  },
]

// 模拟草稿内容数据
const draftContent = [
  {
    id: "d1",
    title: "旅行必备物品清单",
    platform: "xiaohongshu",
    lastUpdated: "2023-04-18 16:45",
    status: "draft",
  },
  {
    id: "d2",
    title: "如何提高英语口语能力",
    platform: "zhihu",
    lastUpdated: "2023-04-17 11:20",
    status: "draft",
  },
  {
    id: "d3",
    title: "家居收纳技巧分享",
    platform: "wechat",
    lastUpdated: "2023-04-16 09:30",
    status: "draft",
  },
]

export default function ContentPublishingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // 过滤已发布内容
  const filteredPublished = publishedContent.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = platformFilter === "all" || item.platform === platformFilter
    return matchesSearch && matchesPlatform
  })

  // 过滤计划发布内容
  const filteredScheduled = scheduledContent.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = platformFilter === "all" || item.platform === platformFilter
    return matchesSearch && matchesPlatform
  })

  // 过滤草稿内容
  const filteredDrafts = draftContent.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = platformFilter === "all" || item.platform === platformFilter
    return matchesSearch && matchesPlatform
  })

  // 获取平台名称
  const getPlatformName = (platformId: string) => {
    const platform = publishPlatforms.find((p) => p.id === platformId)
    return platform ? platform.name : platformId
  }

  // 获取平台图标
  const getPlatformIcon = (platformId: string) => {
    const platform = publishPlatforms.find((p) => p.id === platformId)
    if (!platform) return null

    const Icon = platform.icon
    return <Icon className={`h-4 w-4 ${platform.color}`} />
  }

  return (
    <PageBackground image="/images/bg-city-3d.jpeg">
      <DashboardHeader />

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">内容发布管理</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">管理已发布、计划发布和草稿内容，跟踪内容表现</p>
          </div>

          <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="搜索内容..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  筛选
                </Button>
              </div>
              <Button size="sm">创建新内容</Button>
            </div>

            {showFilters && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="space-y-2 w-full md:w-64">
                      <label className="text-sm font-medium">平台</label>
                      <Select value={platformFilter} onValueChange={setPlatformFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择平台" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有平台</SelectItem>
                          {publishPlatforms.map((platform) => (
                            <SelectItem key={platform.id} value={platform.id}>
                              <div className="flex items-center gap-2">
                                <platform.icon className={`h-4 w-4 ${platform.color}`} />
                                <span>{platform.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 w-full md:w-64">
                      <label className="text-sm font-medium">日期范围</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                          <Input type="date" className="pl-8" />
                        </div>
                        <div className="relative flex-1">
                          <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                          <Input type="date" className="pl-8" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button size="sm">应用筛选</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="published">
              <TabsList className="mb-6">
                <TabsTrigger value="published">
                  已发布{" "}
                  <Badge variant="secondary" className="ml-2">
                    {filteredPublished.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="scheduled">
                  计划发布{" "}
                  <Badge variant="secondary" className="ml-2">
                    {filteredScheduled.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="drafts">
                  草稿{" "}
                  <Badge variant="secondary" className="ml-2">
                    {filteredDrafts.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="published">
                <Card>
                  <CardHeader>
                    <CardTitle>已发布内容</CardTitle>
                    <CardDescription>查看和管理已发布的内容</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>标题</TableHead>
                          <TableHead>平台</TableHead>
                          <TableHead>发布日期</TableHead>
                          <TableHead>浏览量</TableHead>
                          <TableHead>互动</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPublished.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getPlatformIcon(item.platform)}
                                <span>{getPlatformName(item.platform)}</span>
                              </div>
                            </TableCell>
                            <TableCell>{item.publishDate}</TableCell>
                            <TableCell>{item.views.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-4">
                                <span title="点赞">👍 {item.likes}</span>
                                <span title="评论">💬 {item.comments}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    查看详情
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    编辑内容
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    删除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scheduled">
                <Card>
                  <CardHeader>
                    <CardTitle>计划发布内容</CardTitle>
                    <CardDescription>管理计划发布的内容</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>标题</TableHead>
                          <TableHead>平台</TableHead>
                          <TableHead>计划发布时间</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredScheduled.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getPlatformIcon(item.platform)}
                                <span>{getPlatformName(item.platform)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-yellow-500" />
                                {item.scheduledDate}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    预览
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    编辑
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Clock className="h-4 w-4 mr-2" />
                                    修改发布时间
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    取消发布
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="drafts">
                <Card>
                  <CardHeader>
                    <CardTitle>草稿内容</CardTitle>
                    <CardDescription>管理草稿内容</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>标题</TableHead>
                          <TableHead>平台</TableHead>
                          <TableHead>最后更新</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDrafts.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getPlatformIcon(item.platform)}
                                <span>{getPlatformName(item.platform)}</span>
                              </div>
                            </TableCell>
                            <TableCell>{item.lastUpdated}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    继续编辑
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    预览
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageSquarePlus className="h-4 w-4 mr-2" />
                                    发布
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    删除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </PageBackground>
  )
}

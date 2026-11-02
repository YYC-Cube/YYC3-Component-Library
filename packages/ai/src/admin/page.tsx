import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, FileText, Zap, TrendingUp, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/server-client"

// 获取系统统计数据
async function getSystemStats() {
  const supabase = await createClient()

  // 这里应该是实际的数据查询，这里用模拟数据
  // 在实际应用中，您需要根据数据库结构进行查询

  // 模拟数据
  return {
    totalUsers: 256,
    activeUsers: 124,
    totalContent: 1284,
    publishedContent: 876,
    totalWorkflows: 42,
    activeWorkflows: 28,
    recentActivities: [
      { id: 1, user: "张小明", action: "创建了新内容", time: "10分钟前" },
      { id: 2, user: "李华", action: "执行了工作流", time: "30分钟前" },
      { id: 3, user: "王芳", action: "更新了用户资料", time: "1小时前" },
      { id: 4, user: "赵明", action: "发布了新内容", time: "2小时前" },
      { id: 5, user: "刘洋", action: "创建了新工作流", time: "3小时前" },
    ],
  }
}

export default async function AdminDashboardPage() {
  const stats = await getSystemStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">管理后台</h1>
        <p className="text-muted-foreground">系统概览和关键指标</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
          <TabsTrigger value="activity">活动日志</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">用户总数</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">活跃用户: {stats.activeUsers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">内容总数</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalContent}</div>
                <p className="text-xs text-muted-foreground">已发布: {stats.publishedContent}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">工作流总数</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalWorkflows}</div>
                <p className="text-xs text-muted-foreground">活跃工作流: {stats.activeWorkflows}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>系统使用趋势</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                  <BarChart3 className="h-8 w-8 text-muted" />
                  <span className="ml-2 text-sm text-muted-foreground">图表将在这里显示</span>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>最近活动</CardTitle>
                <CardDescription>系统中的最新活动</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>数据分析</CardTitle>
              <CardDescription>系统使用数据分析和趋势</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
              <TrendingUp className="h-8 w-8 text-muted" />
              <span className="ml-2 text-sm text-muted-foreground">详细分析图表将在这里显示</span>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>活动日志</CardTitle>
              <CardDescription>系统活动和用户操作日志</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">用户操作</p>
                      <p className="text-sm text-muted-foreground">用户 ID-{1000 + i} 执行了操作</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{i + 1}小时前</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

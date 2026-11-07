"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { Skeleton } from "@yyc3/ui-enterprise/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@yyc3/ui-enterprise/alert"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { SimpleLineChart } from "@/components/dashboard/simple-line-chart"
import { SimpleBarChart } from "@/components/dashboard/simple-bar-chart"
import { SimpleDonutChart } from "@/components/dashboard/simple-donut-chart"
import { AdvancedLineChart } from "@/components/charts/advanced-charts"
import { AlertCircle, BarChart3, DollarSign, RefreshCw, ShoppingCart, TrendingUp, UserCheck, Users } from "lucide-react"
import { Button } from "@yyc3/ui-enterprise/button"
import { useDashboardStats, useSalesTrend, useCategoryDistribution, useRecentActivities } from "@yyc3/hooks/use-data"

export function RealDataDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("month")

  // 获取仪表盘统计数据
  const {
    data: dashboardStats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStats()

  // 获取销售趋势
  const {
    data: salesTrend,
    isLoading: isLoadingSalesTrend,
    error: salesTrendError,
    refetch: refetchSalesTrend,
  } = useSalesTrend({ period: timeRange })

  // 获取类别分布
  const {
    data: categoryDistribution,
    isLoading: isLoadingCategoryDistribution,
    error: categoryDistributionError,
    refetch: refetchCategoryDistribution,
  } = useCategoryDistribution()

  // 获取最近活动
  const {
    data: recentActivities,
    isLoading: isLoadingRecentActivities,
    error: recentActivitiesError,
    refetch: refetchRecentActivities,
  } = useRecentActivities(10)

  // 刷新所有数据
  const refreshAllData = () => {
    refetchStats()
    refetchSalesTrend()
    refetchCategoryDistribution()
    refetchRecentActivities()
  }

  // 当时间范围变化时，重新获取销售趋势数据
  useEffect(() => {
    refetchSalesTrend()
  }, [timeRange, refetchSalesTrend])

  // 处理错误
  const hasError = statsError || salesTrendError || categoryDistributionError || recentActivitiesError
  const errorMessage =
    statsError?.message ||
    salesTrendError?.message ||
    categoryDistributionError?.message ||
    recentActivitiesError?.message

  // 是否正在加载
  const isLoading = isLoadingStats || isLoadingSalesTrend || isLoadingCategoryDistribution || isLoadingRecentActivities

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">数据看板</h1>
          <p className="text-gray-500">实时业务数据概览</p>
        </div>
        <Button variant="outline" onClick={refreshAllData} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          刷新数据
        </Button>
      </div>

      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>加载数据失败</AlertTitle>
          <AlertDescription>{errorMessage || "获取数据时发生错误，请稍后重试。"}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="py-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>概览</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="sales" className="py-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>销售分析</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="py-2">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>库存管理</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="customers" className="py-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>客户管理</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoadingStats ? (
              <>
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
              </>
            ) : dashboardStats ? (
              <>
                <StatCard
                  title="今日销售额"
                  value={`¥${dashboardStats.dailySales.toLocaleString()}`}
                  trend="up"
                  trendValue="12.5%"
                  description="较昨日"
                  icon={DollarSign}
                />
                <StatCard
                  title="今日订单数"
                  value={dashboardStats.dailyOrders.toString()}
                  trend="up"
                  trendValue="8.2%"
                  description="较昨日"
                  icon={ShoppingCart}
                />
                <StatCard
                  title="活跃会员"
                  value={dashboardStats.activeMembers.toLocaleString()}
                  trend="up"
                  trendValue="3.1%"
                  description="较上周"
                  icon={UserCheck}
                />
                <StatCard
                  title="平均客单价"
                  value={`¥${dashboardStats.averageOrderValue.toLocaleString()}`}
                  trend="down"
                  trendValue="2.3%"
                  description="较上周"
                  icon={TrendingUp}
                />
              </>
            ) : null}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoadingSalesTrend ? (
              <>
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[300px] w-full" />
              </>
            ) : salesTrend ? (
              <>
                <ChartCard title="销售趋势" description="按日统计">
                  <div className="mb-4">
                    <TabsList className="w-auto">
                      <TabsTrigger
                        value="day"
                        onClick={() => setTimeRange("day")}
                        className={timeRange === "day" ? "bg-primary text-primary-foreground" : ""}
                      >
                        日
                      </TabsTrigger>
                      <TabsTrigger
                        value="week"
                        onClick={() => setTimeRange("week")}
                        className={timeRange === "week" ? "bg-primary text-primary-foreground" : ""}
                      >
                        周
                      </TabsTrigger>
                      <TabsTrigger
                        value="month"
                        onClick={() => setTimeRange("month")}
                        className={timeRange === "month" ? "bg-primary text-primary-foreground" : ""}
                      >
                        月
                      </TabsTrigger>
                      <TabsTrigger
                        value="year"
                        onClick={() => setTimeRange("year")}
                        className={timeRange === "year" ? "bg-primary text-primary-foreground" : ""}
                      >
                        年
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <SimpleLineChart data={salesTrend} height={250} />
                </ChartCard>
                <ChartCard title="订单数量" description="按日统计">
                  <SimpleBarChart data={dashboardStats?.ordersTrend || []} height={250} />
                </ChartCard>
              </>
            ) : null}
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {isLoadingCategoryDistribution ? (
              <>
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[300px] w-full lg:col-span-2" />
              </>
            ) : categoryDistribution ? (
              <>
                <ChartCard title="商品类别分布" description="按销售额占比">
                  <SimpleDonutChart data={categoryDistribution} />
                </ChartCard>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base font-medium">近期活动</CardTitle>
                    <CardDescription>最近的业务活动和通知</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingRecentActivities ? (
                      <div className="space-y-4">
                        <Skeleton className="h-[60px] w-full" />
                        <Skeleton className="h-[60px] w-full" />
                        <Skeleton className="h-[60px] w-full" />
                        <Skeleton className="h-[60px] w-full" />
                      </div>
                    ) : recentActivities ? (
                      <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                          <div key={activity.id} className="flex items-start">
                            <div className="rounded-full bg-primary/10 p-2 mr-3">
                              {activity.type === "order" && <ShoppingCart className="h-4 w-4 text-primary" />}
                              {activity.type === "customer" && <Users className="h-4 w-4 text-primary" />}
                              {activity.type === "sales" && <DollarSign className="h-4 w-4 text-primary" />}
                              {activity.type === "inventory" && <BarChart3 className="h-4 w-4 text-primary" />}
                            </div>
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium text-sm">{activity.title}</p>
                                <span className="text-xs text-muted-foreground ml-2">{activity.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="sales" className="mt-6">
          {/* 销售分析内容 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">销售分析</h2>
            {isLoadingSalesTrend ? (
              <Skeleton className="h-[400px] w-full" />
            ) : salesTrend ? (
              <AdvancedLineChart
                data={salesTrend}
                title="销售额趋势"
                description="详细销售数据分析"
                lines={[{ dataKey: "value", stroke: "#3b82f6", name: "销售额" }]}
                xAxisDataKey="date"
                allowZoom={true}
              />
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          {/* 库存管理内容 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">库存管理</h2>
            {/* 库存数据内容 */}
          </div>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          {/* 客户管理内容 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">客户管理</h2>
            {/* 客户数据内容 */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

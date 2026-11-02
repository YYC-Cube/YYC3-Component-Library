"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Badge } from "@yyc3/ui/badge"
import { Button } from "@yyc3/ui/button"
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  RefreshCw,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface RealTimeData {
  sales: {
    current: number
    change: number
    trend: "up" | "down"
  }
  users: {
    online: number
    total: number
    change: number
  }
  orders: {
    pending: number
    completed: number
    failed: number
  }
  revenue: {
    today: number
    month: number
    change: number
  }
}

export function DashboardRealTimeData() {
  const router = useRouter()
  const [data, setData] = useState<RealTimeData>({
    sales: { current: 2847392, change: 12.5, trend: "up" },
    users: { online: 1247, total: 15847, change: 8.2 },
    orders: { pending: 23, completed: 156, failed: 3 },
    revenue: { today: 89241, month: 2847392, change: 15.8 },
  })
  const [isLoading, setIsLoading] = useState(false)

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        users: {
          ...prev.users,
          online: prev.users.online + Math.floor(Math.random() * 10 - 5),
        },
        orders: {
          ...prev.orders,
          pending: Math.max(0, prev.orders.pending + Math.floor(Math.random() * 6 - 3)),
        },
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    // 模拟数据刷新
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setData({
      sales: { current: 2847392 + Math.floor(Math.random() * 10000), change: 12.5, trend: "up" },
      users: { online: 1247 + Math.floor(Math.random() * 100), total: 15847, change: 8.2 },
      orders: { pending: Math.floor(Math.random() * 30), completed: 156, failed: 3 },
      revenue: { today: 89241 + Math.floor(Math.random() * 5000), month: 2847392, change: 15.8 },
    })
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* 实时数据头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">实时业务数据</h3>
          <p className="text-sm text-slate-600">每5秒自动更新的关键业务指标</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 bg-transparent"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          刷新
        </Button>
      </div>

      {/* 实时指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 实时销售额 */}
        <Card className="relative overflow-hidden border-l-4 border-l-green-400 hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  实时销售额
                </p>
                <p className="text-2xl font-bold text-green-600">¥{data.sales.current.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {data.sales.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs ${data.sales.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {data.sales.change}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 在线用户 */}
        <Card className="relative overflow-hidden border-l-4 border-l-blue-400 hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  在线用户
                </p>
                <p className="text-2xl font-bold text-blue-600">{data.users.online.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">总用户: {data.users.total.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 订单状态 */}
        <Card className="relative overflow-hidden border-l-4 border-l-orange-400 hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  待处理订单
                </p>
                <p className="text-2xl font-bold text-orange-600">{data.orders.pending}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-green-600">完成: {data.orders.completed}</span>
                  <span className="text-xs text-red-600">失败: {data.orders.failed}</span>
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 今日收入 */}
        <Card className="relative overflow-hidden border-l-4 border-l-purple-400 hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  今日收入
                </p>
                <p className="text-2xl font-bold text-purple-600">¥{data.revenue.today.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+{data.revenue.change}%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 实时活动流 */}
      <Card className="border-t-4 border-t-sky-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            实时活动流
            <Badge variant="secondary" className="bg-sky-100 text-sky-700">
              实时更新
            </Badge>
          </CardTitle>
          <CardDescription>最近5分钟的系统活动记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">新订单创建</p>
                <p className="text-xs text-slate-500">用户 张三 创建了订单 #12345 - 刚刚</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/customers")}
                className="text-green-600 hover:text-green-700"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <Users className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">新用户注册</p>
                <p className="text-xs text-slate-500">3个新用户完成注册 - 2分钟前</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/customers")}
                className="text-blue-600 hover:text-blue-700"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">系统警告</p>
                <p className="text-xs text-slate-500">服务器CPU使用率达到75% - 3分钟前</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/system-monitor")}
                className="text-orange-600 hover:text-orange-700"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">销售目标达成</p>
                <p className="text-xs text-slate-500">本月销售目标完成85% - 5分钟前</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/analytics")}
                className="text-purple-600 hover:text-purple-700"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardRealTimeData

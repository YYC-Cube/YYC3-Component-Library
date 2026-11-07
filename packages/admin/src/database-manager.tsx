"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { Progress } from "@yyc3/ui-enterprise/progress"
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
  BarChart3,
  FileText,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react"
import { localDB, databaseSeeder } from "@yyc3/lib/local-database"

interface DatabaseStats {
  customers: number
  tasks: number
  okrs: number
  invoices: number
  users: number
  notifications: number
  logs: number
  total: number
}

export function DatabaseManager() {
  const [stats, setStats] = useState<DatabaseStats>({
    customers: 0,
    tasks: 0,
    okrs: 0,
    invoices: 0,
    users: 0,
    notifications: 0,
    logs: 0,
    total: 0,
  })
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadDatabaseStats()
    checkDatabaseHealth()
  }, [])

  const loadDatabaseStats = async () => {
    try {
      const customers = await localDB.count("customers")
      const tasks = await localDB.count("tasks")
      const okrs = await localDB.count("okrs")
      const invoices = await localDB.count("invoices")
      const users = await localDB.count("users")
      const notifications = await localDB.count("notifications")
      const logs = await localDB.count("logs")

      const newStats = {
        customers,
        tasks,
        okrs,
        invoices,
        users,
        notifications,
        logs,
        total: customers + tasks + okrs + invoices + users + notifications + logs,
      }

      setStats(newStats)
    } catch (error) {
      console.error("加载数据库统计失败:", error)
    }
  }

  const checkDatabaseHealth = async () => {
    try {
      const health = await localDB.healthCheck()
      setHealthStatus(health)
    } catch (error) {
      console.error("数据库健康检查失败:", error)
      setHealthStatus({
        status: "error",
        details: {
          connected: false,
          version: 0,
          stores: [],
          totalRecords: 0,
        },
      })
    }
  }

  const handleInitializeData = async () => {
    setIsLoading(true)
    try {
      await databaseSeeder.seedDatabase()
      await loadDatabaseStats()

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("数据初始化完成", {
          body: "示例数据已成功加载到本地数据库",
          icon: "/images/yanyu-cloud-logo.png",
        })
      }
    } catch (error) {
      console.error("数据初始化失败:", error)
      alert("数据初始化失败，请查看控制台了解详情")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetDatabase = async () => {
    if (!confirm("确定要重置数据库吗？这将删除所有现有数据并重新加载示例数据。")) {
      return
    }

    setIsLoading(true)
    try {
      await databaseSeeder.resetDatabase()
      await loadDatabaseStats()
      await checkDatabaseHealth()

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("数据库重置完成", {
          body: "数据库已重置并重新加载示例数据",
          icon: "/images/yanyu-cloud-logo.png",
        })
      }
    } catch (error) {
      console.error("数据库重置失败:", error)
      alert("数据库重置失败，请查看控制台了解详情")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    setIsLoading(true)
    try {
      const backupData = await localDB.backup()

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `database-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log("数据导出成功")
    } catch (error) {
      console.error("数据导出失败:", error)
      alert("数据导出失败，请查看控制台了解详情")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const text = await file.text()
      const backupData = JSON.parse(text)

      await localDB.restore(backupData)
      await loadDatabaseStats()
      await checkDatabaseHealth()

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("数据导入完成", {
          body: "备份数据已成功导入到本地数据库",
          icon: "/images/yanyu-cloud-logo.png",
        })
      }
    } catch (error) {
      console.error("数据导入失败:", error)
      alert("数据导入失败，请确保文件格式正确")
    } finally {
      setIsLoading(false)
      // 重置文件输入
      event.target.value = ""
    }
  }

  const getHealthStatusBadge = () => {
    if (!healthStatus) return <Badge variant="secondary">检查中...</Badge>

    return healthStatus.status === "healthy" ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        健康
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        异常
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">数据库管理</h1>
          <p className="text-muted-foreground">本地化数据库管理和维护工具</p>
        </div>
        <div className="flex items-center space-x-2">
          {getHealthStatusBadge()}
          <Button variant="outline" onClick={checkDatabaseHealth} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            刷新状态
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">数据概览</TabsTrigger>
          <TabsTrigger value="management">数据管理</TabsTrigger>
          <TabsTrigger value="backup">备份恢复</TabsTrigger>
          <TabsTrigger value="settings">数据库设置</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* 数据库状态卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">数据库状态</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthStatus?.details.connected ? "已连接" : "未连接"}</div>
                <p className="text-xs text-muted-foreground">版本 {healthStatus?.details.version || "未知"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">数据表数量</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthStatus?.details.stores.length || 0}</div>
                <p className="text-xs text-muted-foreground">个数据表</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总记录数</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">条数据记录</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">存储使用</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">~{Math.round(stats.total * 0.5)}KB</div>
                <p className="text-xs text-muted-foreground">预估存储大小</p>
              </CardContent>
            </Card>
          </div>

          {/* 数据分布统计 */}
          <Card>
            <CardHeader>
              <CardTitle>数据分布统计</CardTitle>
              <CardDescription>各模块数据记录数量分布</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">客户数据</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? (stats.customers / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{stats.customers}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="text-sm">任务数据</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? (stats.tasks / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{stats.tasks}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">发票数据</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? (stats.invoices / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{stats.invoices}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">通知数据</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? (stats.notifications / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{stats.notifications}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>数据管理操作</CardTitle>
              <CardDescription>管理本地数据库的数据内容</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleInitializeData}
                  disabled={isLoading}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Database className="w-6 h-6" />
                  <span>初始化示例数据</span>
                  <span className="text-xs opacity-75">加载预设的示例数据</span>
                </Button>

                <Button
                  onClick={handleResetDatabase}
                  disabled={isLoading}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <RefreshCw className="w-6 h-6" />
                  <span>重置数据库</span>
                  <span className="text-xs opacity-75">清空并重新加载数据</span>
                </Button>

                <Button
                  onClick={() => databaseSeeder.clearAllData().then(loadDatabaseStats)}
                  disabled={isLoading}
                  variant="destructive"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Trash2 className="w-6 h-6" />
                  <span>清空所有数据</span>
                  <span className="text-xs opacity-75">删除所有数据记录</span>
                </Button>

                <Button
                  onClick={loadDatabaseStats}
                  disabled={isLoading}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <BarChart3 className="w-6 h-6" />
                  <span>刷新统计</span>
                  <span className="text-xs opacity-75">重新加载数据统计</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <div className="flex-1">
                    <p className="font-medium">正在处理数据库操作...</p>
                    <Progress value={undefined} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>数据备份与恢复</CardTitle>
              <CardDescription>导出和导入数据库数据</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleExportData}
                  disabled={isLoading}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Download className="w-6 h-6" />
                  <span>导出数据</span>
                  <span className="text-xs opacity-75">下载JSON格式备份文件</span>
                </Button>

                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />
                  <Button
                    disabled={isLoading}
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <Upload className="w-6 h-6" />
                    <span>导入数据</span>
                    <span className="text-xs opacity-75">从JSON备份文件恢复</span>
                  </Button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">备份注意事项</h4>
                    <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                      <li>• 导出的备份文件包含所有数据表的完整数据</li>
                      <li>• 导入数据会覆盖现有的所有数据，请谨慎操作</li>
                      <li>• 建议定期备份重要数据以防数据丢失</li>
                      <li>• 备份文件采用JSON格式，可以手动编辑</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>数据库设置</CardTitle>
              <CardDescription>配置数据库参数和选项</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">数据库信息</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">数据库名称:</span>
                      <span className="ml-2 font-medium">zuoyou-ems-local</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">数据库版本:</span>
                      <span className="ml-2 font-medium">{healthStatus?.details.version || "未知"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">存储类型:</span>
                      <span className="ml-2 font-medium">IndexedDB</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">数据表数:</span>
                      <span className="ml-2 font-medium">{healthStatus?.details.stores.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">数据表列表</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {healthStatus?.details.stores.map((store: string) => (
                      <Badge key={store} variant="outline" className="justify-center">
                        {store}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">数据库特性</h4>
                      <ul className="mt-2 text-sm text-blue-700 space-y-1">
                        <li>• 完全本地化存储，无需网络连接</li>
                        <li>• 支持复杂查询和索引优化</li>
                        <li>• 自动数据压缩和垃圾回收</li>
                        <li>• 支持事务处理和数据一致性</li>
                        <li>• 跨浏览器兼容性良好</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

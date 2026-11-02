"use client"

import { useState, useEffect } from "react"
import { Card } from "@yyc3/ui/card"
import { Button } from "@yyc3/ui/button"
import { Badge } from "@yyc3/ui/badge"
import { Input } from "@yyc3/ui/input"
import { Label } from "@yyc3/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Textarea } from "@yyc3/ui/textarea"
import {
  Database,
  Link,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Play,
  RefreshCw,
  AlertTriangle,
  FileText,
  Code,
  Globe,
  Server,
} from "lucide-react"

interface DataSource {
  id: string
  name: string
  type: "mysql" | "postgresql" | "mongodb" | "redis" | "api" | "file"
  status: "connected" | "disconnected" | "error" | "syncing"
  host: string
  port?: number
  database?: string
  lastSync?: Date
  recordCount?: number
  config: Record<string, any>
}

interface APIEndpoint {
  id: string
  name: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  url: string
  status: "active" | "inactive" | "error"
  responseTime?: number
  lastCall?: Date
  description: string
}

interface SyncJob {
  id: string
  name: string
  sourceId: string
  targetId: string
  status: "pending" | "running" | "completed" | "failed"
  progress: number
  startTime?: Date
  endTime?: Date
  recordsProcessed: number
  errors: string[]
}

export function DataIntegration() {
  const [selectedDataSource, setSelectedDataSource] = useState<string>("")
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([])

  const dataSources: DataSource[] = [
    {
      id: "mysql-main",
      name: "主数据库",
      type: "mysql",
      status: "connected",
      host: "localhost",
      port: 3306,
      database: "jinlan_erp",
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      recordCount: 125430,
      config: {
        username: "admin",
        ssl: true,
        charset: "utf8mb4",
      },
    },
    {
      id: "redis-cache",
      name: "缓存数据库",
      type: "redis",
      status: "connected",
      host: "redis.jinlan.com",
      port: 6379,
      lastSync: new Date(Date.now() - 2 * 60 * 1000),
      recordCount: 8920,
      config: {
        password: "***",
        db: 0,
      },
    },
    {
      id: "mongodb-logs",
      name: "日志数据库",
      type: "mongodb",
      status: "syncing",
      host: "mongo.jinlan.com",
      port: 27017,
      database: "logs",
      lastSync: new Date(Date.now() - 10 * 60 * 1000),
      recordCount: 2456789,
      config: {
        authSource: "admin",
        replicaSet: "rs0",
      },
    },
    {
      id: "api-crm",
      name: "CRM系统API",
      type: "api",
      status: "error",
      host: "api.crm.jinlan.com",
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      recordCount: 45230,
      config: {
        apiKey: "***",
        version: "v2",
        timeout: 30000,
      },
    },
  ]

  const apiEndpoints: APIEndpoint[] = [
    {
      id: "customers-api",
      name: "客户数据API",
      method: "GET",
      url: "/api/customers",
      status: "active",
      responseTime: 120,
      lastCall: new Date(Date.now() - 2 * 60 * 1000),
      description: "获取客户列表和详细信息",
    },
    {
      id: "orders-api",
      name: "订单数据API",
      method: "GET",
      url: "/api/orders",
      status: "active",
      responseTime: 85,
      lastCall: new Date(Date.now() - 1 * 60 * 1000),
      description: "获取订单数据和状态",
    },
    {
      id: "products-api",
      name: "产品数据API",
      method: "GET",
      url: "/api/products",
      status: "active",
      responseTime: 95,
      lastCall: new Date(Date.now() - 5 * 60 * 1000),
      description: "获取产品信息和库存",
    },
    {
      id: "analytics-api",
      name: "分析数据API",
      method: "POST",
      url: "/api/analytics",
      status: "inactive",
      description: "提交分析数据和指标",
    },
  ]

  const initialSyncJobs: SyncJob[] = [
    {
      id: "sync-1",
      name: "客户数据同步",
      sourceId: "mysql-main",
      targetId: "redis-cache",
      status: "completed",
      progress: 100,
      startTime: new Date(Date.now() - 10 * 60 * 1000),
      endTime: new Date(Date.now() - 8 * 60 * 1000),
      recordsProcessed: 1250,
      errors: [],
    },
    {
      id: "sync-2",
      name: "日志数据备份",
      sourceId: "mongodb-logs",
      targetId: "mysql-main",
      status: "running",
      progress: 65,
      startTime: new Date(Date.now() - 5 * 60 * 1000),
      recordsProcessed: 15600,
      errors: [],
    },
    {
      id: "sync-3",
      name: "CRM数据导入",
      sourceId: "api-crm",
      targetId: "mysql-main",
      status: "failed",
      progress: 30,
      startTime: new Date(Date.now() - 15 * 60 * 1000),
      endTime: new Date(Date.now() - 12 * 60 * 1000),
      recordsProcessed: 890,
      errors: ["连接超时", "认证失败"],
    },
  ]

  useEffect(() => {
    setSyncJobs(initialSyncJobs)
  }, [])

  const testConnection = async (sourceId: string) => {
    setIsTestingConnection(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsTestingConnection(false)
  }

  const startSync = async (sourceId: string, targetId: string) => {
    const newJob: SyncJob = {
      id: `sync-${Date.now()}`,
      name: `数据同步 ${Date.now()}`,
      sourceId,
      targetId,
      status: "running",
      progress: 0,
      startTime: new Date(),
      recordsProcessed: 0,
      errors: [],
    }

    setSyncJobs((prev) => [...prev, newJob])

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSyncJobs((prev) =>
        prev.map((job) =>
          job.id === newJob.id
            ? {
                ...job,
                progress: i,
                recordsProcessed: Math.floor((i / 100) * 1000),
                status: i === 100 ? "completed" : "running",
                endTime: i === 100 ? new Date() : undefined,
              }
            : job,
        ),
      )
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "disconnected":
      case "inactive":
        return <XCircle className="w-4 h-4 text-gray-400" />
      case "error":
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "syncing":
      case "running":
        return <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
      case "completed":
        return "bg-green-100 text-green-800"
      case "disconnected":
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "error":
      case "failed":
        return "bg-red-100 text-red-800"
      case "syncing":
      case "running":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mysql":
      case "postgresql":
        return <Database className="w-5 h-5 text-purple-600" />
      case "mongodb":
        return <Database className="w-5 h-5 text-purple-600" />
      case "redis":
        return <Database className="w-5 h-5 text-purple-600" />
      case "api":
        return <Globe className="w-5 h-5 text-purple-600" />
      case "file":
        return <FileText className="w-5 h-5 text-purple-600" />
      default:
        return <Server className="w-5 h-5 text-purple-600" />
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800"
      case "POST":
        return "bg-purple-100 text-purple-800"
      case "PUT":
        return "bg-yellow-100 text-yellow-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">数据集成中心</h1>
          <p className="text-slate-600 mt-2">管理数据源连接和API集成</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            集成文档
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Link className="w-4 h-4 mr-2" />
            新建连接
          </Button>
        </div>
      </div>

      {/* 连接状态概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">数据源</p>
              <p className="text-2xl font-bold text-purple-600">{dataSources.length}</p>
            </div>
            <Database className="w-8 h-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">API端点</p>
              <p className="text-2xl font-bold text-purple-600">{apiEndpoints.length}</p>
            </div>
            <Globe className="w-8 h-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">活跃连接</p>
              <p className="text-2xl font-bold text-purple-600">
                {dataSources.filter((ds) => ds.status === "connected").length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">同步任务</p>
              <p className="text-2xl font-bold text-purple-600">{syncJobs.length}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="datasources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="datasources">数据源</TabsTrigger>
          <TabsTrigger value="apis">API管理</TabsTrigger>
          <TabsTrigger value="sync">数据同步</TabsTrigger>
          <TabsTrigger value="config">配置管理</TabsTrigger>
        </TabsList>

        <TabsContent value="datasources" className="space-y-4">
          <div className="grid gap-4">
            {dataSources.map((source) => (
              <Card
                key={source.id}
                className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">{getTypeIcon(source.type)}</div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:translate-x-1 transition-transform duration-300">
                        {source.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {source.host}
                        {source.port && `:${source.port}`}
                        {source.database && `/${source.database}`}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        {source.lastSync && <span>最后同步: {source.lastSync.toLocaleString()}</span>}
                        {source.recordCount && <span>记录数: {source.recordCount.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <Badge className={getStatusColor(source.status)}>
                        {source.status === "connected"
                          ? "已连接"
                          : source.status === "disconnected"
                            ? "已断开"
                            : source.status === "error"
                              ? "错误"
                              : "同步中"}
                      </Badge>
                    </div>
                    {getStatusIcon(source.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(source.id)}
                      disabled={isTestingConnection}
                    >
                      {isTestingConnection ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apis" className="space-y-4">
          <div className="grid gap-4">
            {apiEndpoints.map((endpoint) => (
              <Card
                key={endpoint.id}
                className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Code className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:translate-x-1 transition-transform duration-300">
                        {endpoint.name}
                      </h3>
                      <p className="text-sm text-slate-600">{endpoint.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                        <code className="text-xs bg-purple-100 px-2 py-1 rounded">{endpoint.url}</code>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      {endpoint.responseTime && <p className="text-slate-600">响应时间: {endpoint.responseTime}ms</p>}
                      {endpoint.lastCall && (
                        <p className="text-slate-500">最后调用: {endpoint.lastCall.toLocaleString()}</p>
                      )}
                    </div>
                    {getStatusIcon(endpoint.status)}
                    <Button variant="outline" size="sm">
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">数据同步任务</h3>
            <Button
              onClick={() => startSync("mysql-main", "redis-cache")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Play className="w-4 h-4 mr-2" />
              新建同步任务
            </Button>
          </div>

          <div className="grid gap-4">
            {syncJobs.map((job) => (
              <Card
                key={job.id}
                className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-4 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:translate-x-1 transition-transform duration-300">
                        {job.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {dataSources.find((ds) => ds.id === job.sourceId)?.name} →{" "}
                        {dataSources.find((ds) => ds.id === job.targetId)?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status === "completed"
                          ? "已完成"
                          : job.status === "running"
                            ? "运行中"
                            : job.status === "failed"
                              ? "失败"
                              : "等待中"}
                      </Badge>
                      {getStatusIcon(job.status)}
                    </div>
                  </div>

                  {job.status === "running" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>进度</span>
                        <span>{job.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>已处理记录: {job.recordsProcessed.toLocaleString()}</span>
                    {job.startTime && <span>开始时间: {job.startTime.toLocaleString()}</span>}
                  </div>

                  {job.errors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-800">错误信息</span>
                      </div>
                      <ul className="text-sm text-red-700 space-y-1">
                        {job.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
              <h3 className="text-lg font-semibold mb-4">新建数据源</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="source-name">数据源名称</Label>
                  <Input id="source-name" placeholder="输入数据源名称" />
                </div>
                <div>
                  <Label htmlFor="source-type">数据源类型</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择数据源类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      <SelectItem value="mongodb">MongoDB</SelectItem>
                      <SelectItem value="redis">Redis</SelectItem>
                      <SelectItem value="api">REST API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="source-host">主机地址</Label>
                  <Input id="source-host" placeholder="localhost" />
                </div>
                <div>
                  <Label htmlFor="source-port">端口</Label>
                  <Input id="source-port" type="number" placeholder="3306" />
                </div>
                <div>
                  <Label htmlFor="source-database">数据库名</Label>
                  <Input id="source-database" placeholder="database_name" />
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Database className="w-4 h-4 mr-2" />
                  创建数据源
                </Button>
              </div>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
              <h3 className="text-lg font-semibold mb-4">API配置</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-name">API名称</Label>
                  <Input id="api-name" placeholder="输入API名称" />
                </div>
                <div>
                  <Label htmlFor="api-method">请求方法</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择请求方法" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="api-url">API地址</Label>
                  <Input id="api-url" placeholder="/api/endpoint" />
                </div>
                <div>
                  <Label htmlFor="api-headers">请求头</Label>
                  <Textarea id="api-headers" placeholder='{"Authorization": "Bearer token"}' rows={3} />
                </div>
                <div>
                  <Label htmlFor="api-description">描述</Label>
                  <Textarea id="api-description" placeholder="API功能描述" rows={2} />
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Globe className="w-4 h-4 mr-2" />
                  创建API端点
                </Button>
              </div>
            </Card>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
            <h3 className="text-lg font-semibold mb-4">连接配置</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">数据库连接池</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>最大连接数</Label>
                    <Input className="w-20" defaultValue="10" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>连接超时(秒)</Label>
                    <Input className="w-20" defaultValue="30" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>空闲超时(秒)</Label>
                    <Input className="w-20" defaultValue="300" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">API配置</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>请求超时(ms)</Label>
                    <Input className="w-20" defaultValue="5000" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>重试次数</Label>
                    <Input className="w-20" defaultValue="3" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>限流(req/min)</Label>
                    <Input className="w-20" defaultValue="100" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

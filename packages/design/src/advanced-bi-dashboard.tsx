"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui-enterprise/select"
import { ScrollArea } from "@yyc3/ui-enterprise/scroll-area"
import { Progress } from "@yyc3/ui-enterprise/progress"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Filter,
  Download,
  Settings,
  Zap,
  Eye,
  BarChart3,
  PieChartIcon,
  Activity,
  Cpu,
} from "lucide-react"

interface AIInsight {
  id: string
  type: "trend" | "anomaly" | "prediction" | "recommendation"
  title: string
  description: string
  confidence: number
  impact: "high" | "medium" | "low"
  category: string
  data?: any
}

interface DashboardWidget {
  id: string
  type: "chart" | "metric" | "table" | "ai-insight"
  title: string
  size: "small" | "medium" | "large"
  position: { x: number; y: number }
  config: any
}

interface PredictionModel {
  id: string
  name: string
  type: "sales" | "customer" | "inventory" | "financial"
  accuracy: number
  lastTrained: Date
  status: "active" | "training" | "inactive"
}

export function AdvancedBIDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["sales", "customers", "revenue"])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([])
  const [predictionModels, setPredictionModels] = useState<PredictionModel[]>([])
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)

  // 模拟数据
  const salesData = [
    { month: "1月", sales: 85000, target: 80000, customers: 120, conversion: 15.2 },
    { month: "2月", sales: 92000, target: 85000, customers: 135, conversion: 16.8 },
    { month: "3月", sales: 78000, target: 90000, customers: 110, conversion: 14.1 },
    { month: "4月", sales: 105000, target: 95000, customers: 155, conversion: 18.3 },
    { month: "5月", sales: 118000, target: 100000, customers: 168, conversion: 19.7 },
    { month: "6月", sales: 125000, target: 110000, customers: 180, conversion: 20.5 },
  ]

  const customerSegmentData = [
    { name: "新客户", value: 35, color: "#8884d8" },
    { name: "活跃客户", value: 45, color: "#82ca9d" },
    { name: "流失客户", value: 20, color: "#ffc658" },
  ]

  const productPerformanceData = [
    { product: "家具A", sales: 45000, profit: 12000, margin: 26.7 },
    { product: "家具B", sales: 38000, profit: 9500, margin: 25.0 },
    { product: "家具C", sales: 52000, profit: 15600, margin: 30.0 },
    { product: "家具D", sales: 29000, profit: 7250, margin: 25.0 },
    { product: "家具E", sales: 41000, profit: 10250, margin: 25.0 },
  ]

  const predictiveData = [
    { month: "7月", predicted: 132000, confidence: 85, actual: null },
    { month: "8月", predicted: 138000, confidence: 82, actual: null },
    { month: "9月", predicted: 145000, confidence: 78, actual: null },
    { month: "10月", predicted: 152000, confidence: 75, actual: null },
  ]

  const radarData = [
    { subject: "销售额", A: 120, B: 110, fullMark: 150 },
    { subject: "客户满意度", A: 98, B: 130, fullMark: 150 },
    { subject: "市场份额", A: 86, B: 130, fullMark: 150 },
    { subject: "产品质量", A: 99, B: 100, fullMark: 150 },
    { subject: "服务质量", A: 85, B: 90, fullMark: 150 },
    { subject: "品牌知名度", A: 65, B: 85, fullMark: 150 },
  ]

  useEffect(() => {
    loadAIInsights()
    loadPredictionModels()
    initializeDashboard()
  }, [])

  const loadAIInsights = async () => {
    setIsGeneratingInsights(true)

    // 模拟AI分析过程
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const insights: AIInsight[] = [
      {
        id: "1",
        type: "trend",
        title: "销售额持续上升趋势",
        description: "过去6个月销售额呈现稳定上升趋势，预计下月将突破13万",
        confidence: 92,
        impact: "high",
        category: "销售分析",
        data: { growth: 15.2, trend: "up" },
      },
      {
        id: "2",
        type: "anomaly",
        title: "3月销售异常下降",
        description: "3月销售额较预期下降13.3%，可能与市场活动减少有关",
        confidence: 87,
        impact: "medium",
        category: "异常检测",
        data: { deviation: -13.3, expected: 90000, actual: 78000 },
      },
      {
        id: "3",
        type: "prediction",
        title: "客户流失风险预警",
        description: "预测未来30天内可能有15%的客户存在流失风险",
        confidence: 78,
        impact: "high",
        category: "客户分析",
        data: { riskCustomers: 27, totalCustomers: 180 },
      },
      {
        id: "4",
        type: "recommendation",
        title: "优化产品组合建议",
        description: "建议增加家具C的库存，减少家具D的采购量以提升整体利润率",
        confidence: 85,
        impact: "medium",
        category: "产品优化",
        data: { increaseProduct: "家具C", decreaseProduct: "家具D" },
      },
    ]

    setAiInsights(insights)
    setIsGeneratingInsights(false)
  }

  const loadPredictionModels = () => {
    const models: PredictionModel[] = [
      {
        id: "1",
        name: "销售预测模型",
        type: "sales",
        accuracy: 87.5,
        lastTrained: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: "active",
      },
      {
        id: "2",
        name: "客户流失预测",
        type: "customer",
        accuracy: 82.3,
        lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: "active",
      },
      {
        id: "3",
        name: "库存需求预测",
        type: "inventory",
        accuracy: 79.1,
        lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: "training",
      },
      {
        id: "4",
        name: "财务风险评估",
        type: "financial",
        accuracy: 91.2,
        lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: "active",
      },
    ]

    setPredictionModels(models)
  }

  const initializeDashboard = () => {
    const widgets: DashboardWidget[] = [
      {
        id: "1",
        type: "chart",
        title: "销售趋势",
        size: "large",
        position: { x: 0, y: 0 },
        config: { chartType: "line", dataSource: "sales" },
      },
      {
        id: "2",
        type: "metric",
        title: "总销售额",
        size: "small",
        position: { x: 2, y: 0 },
        config: { value: 603000, change: 15.2 },
      },
      {
        id: "3",
        type: "chart",
        title: "客户分布",
        size: "medium",
        position: { x: 0, y: 1 },
        config: { chartType: "pie", dataSource: "customers" },
      },
      {
        id: "4",
        type: "ai-insight",
        title: "AI洞察",
        size: "medium",
        position: { x: 1, y: 1 },
        config: { insightType: "latest" },
      },
    ]

    setDashboardWidgets(widgets)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case "anomaly":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "prediction":
        return <Brain className="w-5 h-5 text-purple-600" />
      case "recommendation":
        return <Lightbulb className="w-5 h-5 text-blue-600" />
      default:
        return <Activity className="w-5 h-5 text-gray-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "trend":
        return "bg-green-100 text-green-800 border-green-200"
      case "anomaly":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "prediction":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "recommendation":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "training":
        return "bg-blue-100 text-blue-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">高级BI分析</h1>
          <p className="text-slate-600 mt-2">AI驱动的商业智能分析和预测</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">最近7天</SelectItem>
              <SelectItem value="30d">最近30天</SelectItem>
              <SelectItem value="90d">最近90天</SelectItem>
              <SelectItem value="1y">最近1年</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Settings className="w-4 h-4 mr-2" />
            自定义
          </Button>
        </div>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights">AI洞察</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
          <TabsTrigger value="predictions">预测分析</TabsTrigger>
          <TabsTrigger value="dashboard">自定义仪表板</TabsTrigger>
          <TabsTrigger value="models">模型管理</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-6 h-6 text-purple-600" />
                      AI智能洞察
                    </div>
                    <Button
                      onClick={loadAIInsights}
                      disabled={isGeneratingInsights}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isGeneratingInsights ? (
                        <>
                          <Cpu className="w-4 h-4 mr-2 animate-pulse" />
                          分析中...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          重新分析
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {aiInsights.map((insight) => (
                        <div
                          key={insight.id}
                          className="p-4 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getInsightIcon(insight.type)}
                              <div>
                                <h3 className="font-semibold text-slate-900">{insight.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={getInsightColor(insight.type)}>
                                    {insight.type === "trend" && "趋势分析"}
                                    {insight.type === "anomaly" && "异常检测"}
                                    {insight.type === "prediction" && "预测分析"}
                                    {insight.type === "recommendation" && "优化建议"}
                                  </Badge>
                                  <Badge className={getImpactColor(insight.impact)}>
                                    {insight.impact === "high" && "高影响"}
                                    {insight.impact === "medium" && "中等影响"}
                                    {insight.impact === "low" && "低影响"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-600">置信度</div>
                              <div className="text-lg font-bold text-purple-600">{insight.confidence}%</div>
                            </div>
                          </div>
                          <p className="text-slate-700 mb-3">{insight.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">分类: {insight.category}</span>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              查看详情
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-4">
                <h3 className="font-semibold text-slate-900 mb-3">洞察统计</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">趋势分析</span>
                    <span className="font-medium">{aiInsights.filter((i) => i.type === "trend").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">异常检测</span>
                    <span className="font-medium">{aiInsights.filter((i) => i.type === "anomaly").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">预测分析</span>
                    <span className="font-medium">{aiInsights.filter((i) => i.type === "prediction").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">优化建议</span>
                    <span className="font-medium">{aiInsights.filter((i) => i.type === "recommendation").length}</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-4">
                <h3 className="font-semibold text-slate-900 mb-3">平均置信度</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>整体置信度</span>
                      <span>
                        {Math.round(aiInsights.reduce((sum, i) => sum + i.confidence, 0) / aiInsights.length)}%
                      </span>
                    </div>
                    <Progress
                      value={aiInsights.reduce((sum, i) => sum + i.confidence, 0) / aiInsights.length}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>高影响洞察</span>
                      <span>{aiInsights.filter((i) => i.impact === "high").length}</span>
                    </div>
                    <Progress
                      value={(aiInsights.filter((i) => i.impact === "high").length / aiInsights.length) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  销售趋势分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} name="实际销售" />
                    <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeWidth={2} name="目标销售" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-6 h-6 text-purple-600" />
                  客户分布分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerSegmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {customerSegmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  产品性能分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#8884d8" name="销售额" />
                    <Bar dataKey="profit" fill="#82ca9d" name="利润" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-6 h-6 text-purple-600" />
                  综合性能雷达图
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar name="当前表现" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="行业平均" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-600" />
                    销售预测分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={[...salesData, ...predictiveData]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        name="历史销售"
                      />
                      <Area
                        type="monotone"
                        dataKey="predicted"
                        stackId="2"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                        name="预测销售"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-4">
                <h3 className="font-semibold text-slate-900 mb-3">预测准确度</h3>
                <div className="space-y-3">
                  {predictiveData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.month}</span>
                        <span>{item.confidence}%</span>
                      </div>
                      <Progress value={item.confidence} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-4">
                <h3 className="font-semibold text-slate-900 mb-3">关键预测指标</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">下月预测销售额</span>
                    <span className="font-medium text-purple-600">¥132,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">季度增长率</span>
                    <span className="font-medium text-green-600">+18.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">客户增长预测</span>
                    <span className="font-medium text-blue-600">+25人</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">风险评估</span>
                    <Badge className="bg-green-100 text-green-800">低风险</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-l-4 border-l-purple-500 p-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-6 h-6 text-purple-600" />
                  自定义仪表板构建器
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Download className="w-4 h-4 mr-2" />
                  保存配置
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <div className="border-2 border-dashed border-sky-300 rounded-lg p-6 min-h-[400px] bg-sky-50/30">
                    <div className="text-center text-slate-500 mt-20">
                      <Settings className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-lg font-medium">拖拽组件到此处构建您的仪表板</p>
                      <p className="text-sm mt-2">从右侧选择图表类型和数据源</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">可用组件</h3>
                    <div className="space-y-2">
                      <div className="p-3 border border-sky-200 rounded-lg cursor-pointer hover:bg-sky-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">柱状图</span>
                        </div>
                      </div>
                      <div className="p-3 border border-sky-200 rounded-lg cursor-pointer hover:bg-sky-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">折线图</span>
                        </div>
                      </div>
                      <div className="p-3 border border-sky-200 rounded-lg cursor-pointer hover:bg-sky-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <PieChartIcon className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">饼图</span>
                        </div>
                      </div>
                      <div className="p-3 border border-sky-200 rounded-lg cursor-pointer hover:bg-sky-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">指标卡</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">数据源</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="sales-data" defaultChecked />
                        <label htmlFor="sales-data" className="text-sm">
                          销售数据
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="customer-data" defaultChecked />
                        <label htmlFor="customer-data" className="text-sm">
                          客户数据
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="product-data" />
                        <label htmlFor="product-data" className="text-sm">
                          产品数据
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="financial-data" />
                        <label htmlFor="financial-data" className="text-sm">
                          财务数据
                        </label>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4">
            {predictionModels.map((model) => (
              <Card
                key={model.id}
                className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{model.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge className={getModelStatusColor(model.status)}>
                          {model.status === "active" && "运行中"}
                          {model.status === "training" && "训练中"}
                          {model.status === "inactive" && "已停用"}
                        </Badge>
                        <span className="text-sm text-slate-600">准确率: {model.accuracy}%</span>
                        <span className="text-sm text-slate-600">
                          最后训练: {model.lastTrained.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <div className="text-sm text-slate-600">准确率</div>
                      <div className="text-2xl font-bold text-purple-600">{model.accuracy}%</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Zap className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-sky-100">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-slate-600">模型类型</div>
                      <div className="font-medium">
                        {model.type === "sales" && "销售预测"}
                        {model.type === "customer" && "客户分析"}
                        {model.type === "inventory" && "库存管理"}
                        {model.type === "financial" && "财务分析"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-600">训练数据</div>
                      <div className="font-medium">10,000+ 条</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-600">预测周期</div>
                      <div className="font-medium">30天</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-600">更新频率</div>
                      <div className="font-medium">每日</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

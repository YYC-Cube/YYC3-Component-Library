"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Database, Globe, Brain, CheckCircle, AlertCircle } from "lucide-react"

interface DataSource {
  id: string
  name: string
  type: "csv" | "api" | "database" | "json"
  status: "connected" | "processing" | "error" | "ready"
  records: number
  lastUpdated: Date
}

interface DataProcessorProps {
  onDataProcessed?: (data: any) => void
}

export function DataProcessor({ onDataProcessed }: DataProcessorProps) {
  const [selectedSource, setSelectedSource] = useState<string>("")
  const [csvData, setCsvData] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedData, setProcessedData] = useState<any>(null)

  const dataSources: DataSource[] = [
    {
      id: "csv-upload",
      name: "CSV 文件上传",
      type: "csv",
      status: "ready",
      records: 0,
      lastUpdated: new Date(),
    },
    {
      id: "api-endpoint",
      name: "API 接口",
      type: "api",
      status: "connected",
      records: 1250,
      lastUpdated: new Date(),
    },
    {
      id: "database",
      name: "数据库连接",
      type: "database",
      status: "connected",
      records: 5680,
      lastUpdated: new Date(),
    },
    {
      id: "json-data",
      name: "JSON 数据",
      type: "json",
      status: "ready",
      records: 0,
      lastUpdated: new Date(),
    },
  ]

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "csv":
        return <FileText className="h-4 w-4" />
      case "api":
        return <Globe className="h-4 w-4" />
      case "database":
        return <Database className="h-4 w-4" />
      case "json":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            已连接
          </Badge>
        )
      case "processing":
        return <Badge variant="secondary">处理中</Badge>
      case "error":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            错误
          </Badge>
        )
      case "ready":
        return <Badge variant="outline">就绪</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  const processCsvData = (csvText: string) => {
    const lines = csvText.trim().split("\n")
    if (lines.length < 2) return null

    const headers = lines[0].split(",").map((h) => h.trim())
    const data = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim())
      const row: any = {}
      headers.forEach((header, index) => {
        const value = values[index]
        // 尝试转换为数字
        const numValue = Number.parseFloat(value)
        row[header] = isNaN(numValue) ? value : numValue
      })
      return row
    })

    return {
      headers,
      data,
      summary: {
        totalRows: data.length,
        totalColumns: headers.length,
        numericColumns: headers.filter((h) => data.some((row) => typeof row[h] === "number")),
        categoricalColumns: headers.filter((h) => data.every((row) => typeof row[h] === "string")),
      },
    }
  }

  const handleProcessData = async () => {
    setIsProcessing(true)

    // 模拟数据处理
    await new Promise((resolve) => setTimeout(resolve, 2000))

    let processed = null

    if (selectedSource === "csv-upload" && csvData) {
      processed = processCsvData(csvData)
    } else {
      // 模拟其他数据源的处理结果
      processed = {
        headers: ["月份", "销售额", "用户数", "转化率"],
        data: [
          { 月份: "一月", 销售额: 65000, 用户数: 1200, 转化率: 5.4 },
          { 月份: "二月", 销售额: 59000, 用户数: 1100, 转化率: 5.1 },
          { 月份: "三月", 销售额: 80000, 用户数: 1500, 转化率: 6.2 },
          { 月份: "四月", 销售额: 81000, 用户数: 1450, 转化率: 6.0 },
          { 月份: "五月", 销售额: 56000, 用户数: 1000, 转化率: 4.8 },
          { 月份: "六月", 销售额: 55000, 用户数: 980, 转化率: 4.9 },
        ],
        summary: {
          totalRows: 6,
          totalColumns: 4,
          numericColumns: ["销售额", "用户数", "转化率"],
          categoricalColumns: ["月份"],
        },
      }
    }

    setProcessedData(processed)
    setIsProcessing(false)

    if (processed && onDataProcessed) {
      onDataProcessed(processed)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>数据处理中心</span>
        </CardTitle>
        <CardDescription>选择数据源并进行智能处理</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 数据源选择 */}
        <div>
          <h3 className="text-sm font-medium mb-3">选择数据源</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dataSources.map((source) => (
              <div
                key={source.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                  selectedSource === source.id ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setSelectedSource(source.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getSourceIcon(source.type)}
                    <span className="text-sm font-medium">{source.name}</span>
                  </div>
                  {getStatusBadge(source.status)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {source.records > 0 ? `${source.records.toLocaleString()} 条记录` : "等待数据"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CSV 数据输入 */}
        {selectedSource === "csv-upload" && (
          <div>
            <h3 className="text-sm font-medium mb-3">CSV 数据输入</h3>
            <Textarea
              placeholder="请粘贴 CSV 数据，第一行为列标题..."
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              示例格式：月份,销售额,用户数
              <br />
              一月,65000,1200
              <br />
              二月,59000,1100
            </p>
          </div>
        )}

        {/* 处理按钮 */}
        <div className="flex justify-center">
          <Button onClick={handleProcessData} disabled={!selectedSource || isProcessing} className="w-full md:w-auto">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                处理中...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                开始处理数据
              </>
            )}
          </Button>
        </div>

        {/* 处理结果 */}
        {processedData && (
          <div className="border-t pt-6">
            <h3 className="text-sm font-medium mb-3">处理结果</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{processedData.summary.totalRows}</div>
                <div className="text-xs text-muted-foreground">数据行数</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{processedData.summary.totalColumns}</div>
                <div className="text-xs text-muted-foreground">数据列数</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{processedData.summary.numericColumns.length}</div>
                <div className="text-xs text-muted-foreground">数值列</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{processedData.summary.categoricalColumns.length}</div>
                <div className="text-xs text-muted-foreground">分类列</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>数值列：</strong> {processedData.summary.numericColumns.join(", ")}
              <br />
              <strong>分类列：</strong> {processedData.summary.categoricalColumns.join(", ")}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { PageTransition } from "@/components/ui/page-transition"
import { MultimodalReportGenerator } from "@/components/reports/multimodal-report-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Presentation, BarChart3, Brain, Sparkles, Download, Share2, Eye } from "lucide-react"

export default function ReportsPage() {
  const recentReports = [
    {
      id: "1",
      title: "Q4 数据分析报告",
      type: "ppt",
      createdAt: "2024-01-15",
      status: "completed",
      slides: 12,
    },
    {
      id: "2",
      title: "用户行为洞察",
      type: "web",
      createdAt: "2024-01-14",
      status: "completed",
      pages: 8,
    },
    {
      id: "3",
      title: "AI推荐效果评估",
      type: "ppt",
      createdAt: "2024-01-13",
      status: "processing",
      slides: 15,
    },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">报告中心</h1>
                <p className="text-muted-foreground">智能报告生成与管理平台</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Presentation className="h-3 w-3" />
                PPT 自动生成
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                数据可视化
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                AI 智能分析
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                多模态报告
              </Badge>
            </div>
          </div>

          {/* Tabs for different report generators */}
          <div className="mb-8">
            <div className="border-b">
              <nav className="-mb-px flex space-x-8">
                <button className="border-b-2 border-primary py-2 px-1 text-sm font-medium text-primary">
                  多模态报告
                </button>
                <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted">
                  PPT 生成
                </button>
              </nav>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Multimodal Report Generator */}
            <div className="lg:col-span-2">
              <MultimodalReportGenerator />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">最近报告</CardTitle>
                  <CardDescription>查看和管理已生成的报告</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div key={report.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{report.title}</h4>
                          <Badge variant={report.status === "completed" ? "default" : "secondary"} className="text-xs">
                            {report.status === "completed" ? "已完成" : "处理中"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {report.type === "ppt" ? (
                            <Presentation className="h-3 w-3" />
                          ) : (
                            <FileText className="h-3 w-3" />
                          )}
                          <span>{report.type === "ppt" ? `${report.slides} 张幻灯片` : `${report.pages} 页内容`}</span>
                          <span>•</span>
                          <span>{report.createdAt}</span>
                        </div>
                        {report.status === "completed" && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              预览
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <Download className="h-3 w-3 mr-1" />
                              下载
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <Share2 className="h-3 w-3 mr-1" />
                              分享
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">快速操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="mr-2 h-4 w-4" />
                    创建网页报告
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    数据分析报告
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI 洞察报告
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

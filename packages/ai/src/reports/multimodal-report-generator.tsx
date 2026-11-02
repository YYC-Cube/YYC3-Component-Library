"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, BarChart3, Video, Mic, ImageIcon, Sparkles, Play, Download, Share2, Eye, Brain } from "lucide-react"

interface ReportSection {
  id: string
  type: "text" | "chart" | "image" | "audio" | "video"
  title: string
  content: string
  status: "pending" | "generating" | "completed"
  progress: number
}

export function MultimodalReportGenerator() {
  const [reportTitle, setReportTitle] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [reportType, setReportType] = useState("comprehensive")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [sections, setSections] = useState<ReportSection[]>([])

  const reportTypes = [
    { value: "comprehensive", label: "综合分析报告", description: "包含文本、图表、音频解说" },
    { value: "visual", label: "可视化报告", description: "重点突出图表和数据可视化" },
    { value: "narrative", label: "叙述性报告", description: "以文本和音频为主的深度分析" },
    { value: "interactive", label: "交互式报告", description: "包含视频演示和交互元素" },
  ]

  const handleGenerateReport = async () => {
    if (!reportTitle.trim()) return

    setIsGenerating(true)
    setGenerationProgress(0)

    // 模拟报告生成过程
    const newSections: ReportSection[] = [
      { id: "1", type: "text", title: "执行摘要", content: "", status: "pending", progress: 0 },
      { id: "2", type: "chart", title: "数据分析", content: "", status: "pending", progress: 0 },
      { id: "3", type: "image", title: "可视化图表", content: "", status: "pending", progress: 0 },
      { id: "4", type: "audio", title: "语音解说", content: "", status: "pending", progress: 0 },
      { id: "5", type: "video", title: "演示视频", content: "", status: "pending", progress: 0 },
    ]

    setSections(newSections)

    // 模拟逐步生成过程
    for (let i = 0; i < newSections.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSections((prev) =>
        prev.map((section, index) => (index === i ? { ...section, status: "generating", progress: 50 } : section)),
      )

      setGenerationProgress(((i + 0.5) / newSections.length) * 100)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSections((prev) =>
        prev.map((section, index) =>
          index === i
            ? {
                ...section,
                status: "completed",
                progress: 100,
                content: `${section.title}内容已生成完成`,
              }
            : section,
        ),
      )

      setGenerationProgress(((i + 1) / newSections.length) * 100)
    }

    setIsGenerating(false)
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-4 w-4" />
      case "chart":
        return <BarChart3 className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "audio":
        return <Mic className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "generating":
        return "default"
      case "completed":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl">多模态报告生成器</CardTitle>
            <CardDescription>AI驱动的综合报告生成，支持文本、图表、音频、视频多种形式</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">配置设置</TabsTrigger>
            <TabsTrigger value="generation">生成过程</TabsTrigger>
            <TabsTrigger value="preview">预览结果</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">报告标题</label>
                <Input
                  placeholder="输入报告标题..."
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">报告类型</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">报告描述</label>
              <Textarea
                placeholder="描述报告的主要内容和分析目标..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={handleGenerateReport} disabled={!reportTitle.trim() || isGenerating} className="w-full">
              <Brain className="mr-2 h-4 w-4" />
              {isGenerating ? "生成中..." : "开始生成报告"}
            </Button>
          </TabsContent>

          <TabsContent value="generation" className="space-y-4">
            {isGenerating && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">正在生成多模态报告</h3>
                  <Progress value={generationProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">{Math.round(generationProgress)}% 完成</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {sections.map((section) => (
                <div key={section.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSectionIcon(section.type)}
                      <span className="font-medium">{section.title}</span>
                    </div>
                    <Badge variant={getStatusColor(section.status)}>
                      {section.status === "pending" && "等待中"}
                      {section.status === "generating" && "生成中"}
                      {section.status === "completed" && "已完成"}
                    </Badge>
                  </div>

                  {section.status !== "pending" && <Progress value={section.progress} className="w-full" />}

                  {section.status === "completed" && (
                    <p className="text-sm text-muted-foreground mt-2">{section.content}</p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {sections.length > 0 && sections.every((s) => s.status === "completed") ? (
              <div className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">报告生成完成！</h3>
                  <p className="text-muted-foreground mb-4">
                    您的多模态报告已成功生成，包含 {sections.length} 个不同类型的内容模块
                  </p>

                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      预览报告
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      下载报告
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      分享报告
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sections.map((section) => (
                    <Card key={section.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          {getSectionIcon(section.type)}
                          <CardTitle className="text-sm">{section.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          {section.type === "audio" && (
                            <Button variant="ghost" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              播放音频
                            </Button>
                          )}
                          {section.type === "video" && (
                            <Button variant="ghost" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              播放视频
                            </Button>
                          )}
                          {section.type === "chart" && (
                            <div className="text-center">
                              <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">数据图表</p>
                            </div>
                          )}
                          {section.type === "image" && (
                            <div className="text-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">可视化图像</p>
                            </div>
                          )}
                          {section.type === "text" && (
                            <div className="text-center">
                              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">文本内容</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>请先配置并生成报告以查看预览</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

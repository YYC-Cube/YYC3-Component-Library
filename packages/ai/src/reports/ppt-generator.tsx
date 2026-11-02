"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Presentation,
  FileText,
  Download,
  Sparkles,
  BarChart3,
  PieChart,
  TrendingUp,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface PPTSlide {
  id: string
  type: "title" | "content" | "chart" | "summary"
  title: string
  content: string
  chartType?: string
  data?: any
}

interface GenerationStep {
  id: string
  name: string
  status: "pending" | "processing" | "completed" | "error"
  progress: number
}

export function PPTGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [slides, setSlides] = useState<PPTSlide[]>([])
  const [analysisText, setAnalysisText] = useState("")
  const [presentationTitle, setPresentationTitle] = useState("")
  const [template, setTemplate] = useState("business")

  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    { id: "analyze", name: "内容分析", status: "pending", progress: 0 },
    { id: "structure", name: "结构规划", status: "pending", progress: 0 },
    { id: "generate", name: "幻灯片生成", status: "pending", progress: 0 },
    { id: "optimize", name: "AI优化", status: "pending", progress: 0 },
    { id: "finalize", name: "完成生成", status: "pending", progress: 0 },
  ])

  const templates = [
    { id: "business", name: "商务模板", description: "专业商务风格，适合企业汇报" },
    { id: "tech", name: "科技模板", description: "现代科技风格，适合技术分享" },
    { id: "minimal", name: "简约模板", description: "简洁清爽风格，突出内容重点" },
    { id: "creative", name: "创意模板", description: "创意设计风格，适合创新展示" },
  ]

  const sampleSlides: PPTSlide[] = [
    {
      id: "1",
      type: "title",
      title: "数据分析报告",
      content: "基于YYC³ EasyVizAI智能分析生成",
    },
    {
      id: "2",
      type: "content",
      title: "核心发现",
      content: "• 用户活跃度提升15%\n• 数据处理效率优化23%\n• AI推荐准确率达到92%",
    },
    {
      id: "3",
      type: "chart",
      title: "趋势分析",
      content: "过去30天数据变化趋势",
      chartType: "line",
      data: { trend: "up", value: "15%" },
    },
    {
      id: "4",
      type: "summary",
      title: "总结与建议",
      content: "基于数据分析结果，建议继续优化用户体验和AI算法性能",
    },
  ]

  const handleGenerate = async () => {
    if (!analysisText.trim() || !presentationTitle.trim()) return

    setIsGenerating(true)
    setGenerationProgress(0)
    setSlides([])

    // 模拟生成过程
    const steps = [...generationSteps]

    for (let i = 0; i < steps.length; i++) {
      // 更新当前步骤状态
      steps[i].status = "processing"
      setGenerationSteps([...steps])

      // 模拟处理时间
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

      // 更新进度
      for (let progress = 0; progress <= 100; progress += 10) {
        steps[i].progress = progress
        setGenerationProgress((i * 100 + progress) / steps.length)
        setGenerationSteps([...steps])
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      steps[i].status = "completed"
      setGenerationSteps([...steps])
    }

    // 生成完成，显示示例幻灯片
    setSlides(sampleSlides)
    setIsGenerating(false)
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
    }
  }

  const getChartIcon = (chartType?: string) => {
    switch (chartType) {
      case "bar":
        return <BarChart3 className="h-4 w-4" />
      case "pie":
        return <PieChart className="h-4 w-4" />
      case "line":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Presentation className="h-5 w-5 text-primary" />
            PPT 自动生成器
          </CardTitle>
          <CardDescription>基于AI分析自动生成专业演示文稿，支持多种模板和智能内容优化</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 输入区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">演示文稿标题</Label>
              <Input
                id="title"
                placeholder="输入演示文稿标题..."
                value={presentationTitle}
                onChange={(e) => setPresentationTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template">选择模板</Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="选择模板" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((tmpl) => (
                    <SelectItem key={tmpl.id} value={tmpl.id}>
                      <div>
                        <div className="font-medium">{tmpl.name}</div>
                        <div className="text-xs text-muted-foreground">{tmpl.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="analysis">分析内容</Label>
            <Textarea
              id="analysis"
              placeholder="输入要分析的内容、数据或报告..."
              value={analysisText}
              onChange={(e) => setAnalysisText(e.target.value)}
              rows={6}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !analysisText.trim() || !presentationTitle.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中... {Math.round(generationProgress)}%
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                生成 PPT
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 生成进度 */}
      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">生成进度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={generationProgress} className="w-full" />
              <div className="space-y-3">
                {generationSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-3">
                    {getStepIcon(step.status)}
                    <span className="flex-1 text-sm">{step.name}</span>
                    <Badge
                      variant={
                        step.status === "completed" ? "default" : step.status === "processing" ? "secondary" : "outline"
                      }
                    >
                      {step.status === "completed" ? "完成" : step.status === "processing" ? "处理中" : "等待"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 生成结果 */}
      {slides.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                生成完成
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  预览
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  下载 PPT
                </Button>
              </div>
            </div>
            <CardDescription>已生成 {slides.length} 张幻灯片，包含标题页、内容页、图表页和总结页</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slides.map((slide, index) => (
                <Card key={slide.id} className="border-dashed">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        {getChartIcon(slide.chartType)}第 {index + 1} 页
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {slide.type === "title"
                          ? "标题页"
                          : slide.type === "content"
                            ? "内容页"
                            : slide.type === "chart"
                              ? "图表页"
                              : "总结页"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <h4 className="font-medium text-sm mb-2">{slide.title}</h4>
                    <p className="text-xs text-muted-foreground whitespace-pre-line">{slide.content}</p>
                    {slide.chartType && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        图表类型: {slide.chartType} | 数据趋势: {slide.data?.trend}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

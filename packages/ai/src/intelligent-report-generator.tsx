"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Download,
  Share2,
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Brain,
  Sparkles,
  Eye,
  Mail,
  Globe,
  Zap,
} from "lucide-react"

interface LearningAnalytics {
  totalTime: number
  completedNodes: number
  totalNodes: number
  difficultyDistribution: {
    beginner: number
    intermediate: number
    advanced: number
  }
  categoryProgress: {
    [key: string]: {
      completed: number
      total: number
      avgTime: number
    }
  }
  learningVelocity: number[]
  knowledgeRetention: number
  recommendedNextSteps: string[]
}

interface ReportSection {
  id: string
  title: string
  type: "summary" | "chart" | "analysis" | "recommendations"
  content: any
  generated: boolean
}

const sampleAnalytics: LearningAnalytics = {
  totalTime: 390,
  completedNodes: 2,
  totalNodes: 4,
  difficultyDistribution: {
    beginner: 1,
    intermediate: 2,
    advanced: 1,
  },
  categoryProgress: {
    编程基础: { completed: 1, total: 1, avgTime: 120 },
    前端框架: { completed: 1, total: 2, avgTime: 180 },
    状态管理: { completed: 0, total: 1, avgTime: 0 },
  },
  learningVelocity: [0.8, 0.9, 0.7, 0.85, 0.92],
  knowledgeRetention: 0.87,
  recommendedNextSteps: [
    "深入学习React Hooks的高级用法",
    "实践项目：构建一个完整的React应用",
    "学习TypeScript与React的结合使用",
    "探索React性能优化技巧",
  ],
}

export default function IntelligentReportGenerator() {
  const [analytics] = useState<LearningAnalytics>(sampleAnalytics)
  const [reportSections, setReportSections] = useState<ReportSection[]>([
    {
      id: "summary",
      title: "学习概览",
      type: "summary",
      content: null,
      generated: false,
    },
    {
      id: "progress",
      title: "进度分析",
      type: "chart",
      content: null,
      generated: false,
    },
    {
      id: "performance",
      title: "学习表现",
      type: "analysis",
      content: null,
      generated: false,
    },
    {
      id: "recommendations",
      title: "智能推荐",
      type: "recommendations",
      content: null,
      generated: false,
    },
  ])
  const [generatingSection, setGeneratingSection] = useState<string | null>(null)
  const [reportGenerated, setReportGenerated] = useState(false)

  const generateSection = useCallback(async (sectionId: string) => {
    setGeneratingSection(sectionId)

    // 模拟AI生成过程
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setReportSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, generated: true, content: generateSectionContent(section) } : section,
      ),
    )

    setGeneratingSection(null)
  }, [])

  const generateSectionContent = (section: ReportSection) => {
    switch (section.type) {
      case "summary":
        return {
          completionRate: ((analytics.completedNodes / analytics.totalNodes) * 100).toFixed(1),
          totalTime: analytics.totalTime,
          avgSessionTime: Math.round(analytics.totalTime / analytics.completedNodes),
          strongestCategory: Object.entries(analytics.categoryProgress).sort(
            ([, a], [, b]) => b.completed / b.total - a.completed / a.total,
          )[0][0],
        }
      case "chart":
        return {
          progressData: Object.entries(analytics.categoryProgress).map(([category, data]) => ({
            category,
            progress: ((data.completed / data.total) * 100).toFixed(1),
            completed: data.completed,
            total: data.total,
          })),
          velocityTrend: analytics.learningVelocity,
        }
      case "analysis":
        return {
          retentionScore: (analytics.knowledgeRetention * 100).toFixed(1),
          learningEfficiency: "高效",
          consistencyScore: 85,
          improvementAreas: ["状态管理概念理解", "实践项目经验"],
        }
      case "recommendations":
        return {
          nextSteps: analytics.recommendedNextSteps,
          estimatedTime: "2-3周",
          difficulty: "中级进阶",
          priority: "高",
        }
      default:
        return {}
    }
  }

  const generateFullReport = async () => {
    for (const section of reportSections) {
      if (!section.generated) {
        await generateSection(section.id)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }
    setReportGenerated(true)
  }

  const exportReport = (format: "pdf" | "html" | "json") => {
    // 模拟导出功能
    console.log(`导出${format.toUpperCase()}格式报告`)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              智能学习报告生成器
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">基于AI分析的个性化学习报告，多模态输出支持</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={generateFullReport} disabled={reportGenerated} className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {reportGenerated ? "报告已生成" : "生成完整报告"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="sections" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sections">报告内容</TabsTrigger>
            <TabsTrigger value="preview">预览报告</TabsTrigger>
            <TabsTrigger value="export">导出选项</TabsTrigger>
          </TabsList>

          <TabsContent value="sections" className="space-y-4">
            <div className="grid gap-4">
              {reportSections.map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${section.generated ? "bg-emerald-500" : "bg-gray-300"}`} />
                      <h3 className="font-medium">{section.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {section.type === "summary"
                          ? "概览"
                          : section.type === "chart"
                            ? "图表"
                            : section.type === "analysis"
                              ? "分析"
                              : "推荐"}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateSection(section.id)}
                      disabled={section.generated || generatingSection === section.id}
                    >
                      {generatingSection === section.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Zap className="w-4 h-4" />
                        </motion.div>
                      ) : section.generated ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <Brain className="w-4 h-4" />
                      )}
                      {generatingSection === section.id ? "生成中..." : section.generated ? "查看" : "生成"}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {section.generated && section.content && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-3 border-t"
                      >
                        {section.type === "summary" && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-primary">{section.content.completionRate}%</div>
                              <div className="text-xs text-muted-foreground">完成率</div>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-primary">{section.content.totalTime}</div>
                              <div className="text-xs text-muted-foreground">总学习时间(分钟)</div>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-primary">{section.content.avgSessionTime}</div>
                              <div className="text-xs text-muted-foreground">平均时长(分钟)</div>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <div className="text-sm font-bold text-primary">{section.content.strongestCategory}</div>
                              <div className="text-xs text-muted-foreground">优势领域</div>
                            </div>
                          </div>
                        )}

                        {section.type === "chart" && (
                          <div className="space-y-4">
                            <h4 className="font-medium flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              分类进度分析
                            </h4>
                            {section.content.progressData.map((item: any) => (
                              <div key={item.category} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>{item.category}</span>
                                  <span>
                                    {item.completed}/{item.total} ({item.progress}%)
                                  </span>
                                </div>
                                <Progress value={Number.parseFloat(item.progress)} className="h-2" />
                              </div>
                            ))}
                          </div>
                        )}

                        {section.type === "analysis" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <h4 className="font-medium">学习表现指标</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm">知识保持率</span>
                                  <span className="text-sm font-medium">{section.content.retentionScore}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">学习效率</span>
                                  <span className="text-sm font-medium">{section.content.learningEfficiency}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">一致性评分</span>
                                  <span className="text-sm font-medium">{section.content.consistencyScore}分</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-medium">改进建议</h4>
                              <div className="space-y-1">
                                {section.content.improvementAreas.map((area: string, index: number) => (
                                  <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Target className="w-3 h-3" />
                                    {area}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {section.type === "recommendations" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                <div className="text-sm font-medium">{section.content.estimatedTime}</div>
                                <div className="text-xs text-muted-foreground">预计时间</div>
                              </div>
                              <div className="p-3 bg-purple-50 rounded-lg">
                                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                                <div className="text-sm font-medium">{section.content.difficulty}</div>
                                <div className="text-xs text-muted-foreground">难度等级</div>
                              </div>
                              <div className="p-3 bg-emerald-50 rounded-lg">
                                <Sparkles className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                                <div className="text-sm font-medium">{section.content.priority}</div>
                                <div className="text-xs text-muted-foreground">优先级</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">推荐学习路径</h4>
                              <div className="space-y-2">
                                {section.content.nextSteps.map((step: string, index: number) => (
                                  <div key={index} className="flex items-start gap-3 p-2 bg-muted/30 rounded">
                                    <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center mt-0.5">
                                      {index + 1}
                                    </div>
                                    <span className="text-sm">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="border rounded-lg p-6 bg-muted/20">
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">报告预览</h3>
                <p className="text-muted-foreground mb-4">
                  {reportGenerated ? "完整报告已生成，可以预览和导出" : "请先生成报告内容"}
                </p>
                {reportGenerated && (
                  <Button className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    预览完整报告
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-medium">PDF报告</h3>
                  <p className="text-sm text-muted-foreground">专业格式，适合打印和分享</p>
                  <Button size="sm" variant="outline" onClick={() => exportReport("pdf")} disabled={!reportGenerated}>
                    <Download className="w-4 h-4 mr-2" />
                    导出PDF
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium">网页报告</h3>
                  <p className="text-sm text-muted-foreground">交互式报告，支持在线查看</p>
                  <Button size="sm" variant="outline" onClick={() => exportReport("html")} disabled={!reportGenerated}>
                    <Share2 className="w-4 h-4 mr-2" />
                    生成链接
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium">邮件发送</h3>
                  <p className="text-sm text-muted-foreground">直接发送到指定邮箱</p>
                  <Button size="sm" variant="outline" disabled={!reportGenerated}>
                    <Mail className="w-4 h-4 mr-2" />
                    发送邮件
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

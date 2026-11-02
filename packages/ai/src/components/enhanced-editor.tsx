"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Link,
  FileText,
  Copy,
  Sparkles,
  Undo,
  Redo,
  RotateCcw,
  Save,
  Wand2,
  MessageSquarePlus,
  Lightbulb,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Table,
  FileDown,
  AlertCircle,
  BarChart2,
  Send,
  Eye,
  EyeOff,
} from "lucide-react"

// 导入导出服务
import { exportContent, downloadFile, type ExportFormat, type ExportOptions } from "../utils/export-service"

// 导入内容分析服务
import { analyzeContent, type ContentAnalysisResult } from "../utils/content-analysis"

// 导入内容发布服务
import { publishContent, type PublishPlatform, type PublishOptions } from "../utils/publish-service"

// 内容模板数据
const contentTemplates = [
  {
    id: "xiaohongshu",
    name: "小红书种草",
    structure: "标题+开篇吸引+个人体验+优点详述+缺点说明+总结推荐",
    example:
      "# 不踩坑！超详细测评XX产品，真实体验分享\n\n大家好呀！最近入手了超级火的XX产品，用了一周来分享我的真实体验～\n\n【个人体验】\n刚拿到手的第一感觉是...\n\n【优点详述】\n1. ...\n2. ...\n\n【缺点说明】\n老实说也有些不足...\n\n【总结】\n总的来说非常推荐，性价比很高！",
  },
  {
    id: "wechat",
    name: "微信公众号",
    structure: "标题+导语+主题内容(分段)+案例说明+总结观点+互动提问",
    example:
      "# 如何提高工作效率：7个实用技巧\n\n在当今快节奏的社会中，高效工作已成为职场必备能力...\n\n## 一、设定明确目标\n\n明确的目标能够...\n\n## 二、时间管理技巧\n\n1. 番茄工作法\n2. 任务分类\n\n## 案例分析\n\nA公司通过实施以上方法，团队效率提升了30%...\n\n## 总结\n\n提高工作效率不是一蹴而就的...\n\n你有哪些提高效率的小技巧？欢迎在评论区分享！",
  },
  {
    id: "douyin",
    name: "抖音脚本",
    structure: "开场吸引+内容转场+核心信息+互动引导+结尾号召",
    example:
      "【开场】\n还在为XX问题困扰吗？今天我要分享的方法让你彻底告别这个烦恼！\n\n【转场】\n很多人都试过各种方法，但都没解决问题，为什么？\n\n【核心信息】\n其实关键在于这三点：\n1...\n2...\n3...\n\n【互动】\n你遇到过这样的情况吗？评论区告诉我\n\n【结尾】\n学会了记得点赞收藏，更多干货内容持续更新中！",
  },
  {
    id: "taobao",
    name: "电商详情",
    structure: "产品标题+核心卖点+产品参数+使用场景+购买理由+常见问答",
    example:
      "# 【品牌】高品质XX产品 专业级体验\n\n## 核心卖点\n✅ 特点一：...\n✅ 特点二：...\n✅ 特点三：...\n\n## 产品参数\n- 材质：...\n- 尺寸：...\n- 重量：...\n\n## 使用场景\n适合在以下场景使用：...\n\n## 为什么选择我们？\n1. 品质保证...\n2. 售后无忧...\n\n## 常见问题\nQ1: 如何保养？\nA1: ...",
  },
]

// 内容风格数据
const contentStyles = [
  { id: "professional", name: "专业权威", description: "使用专业术语和数据支持，逻辑严谨" },
  { id: "casual", name: "轻松活泼", description: "语言轻松幽默，亲和力强" },
  { id: "emotional", name: "情感共鸣", description: "注重情感表达和共鸣，感染力强" },
  { id: "storytelling", name: "故事叙述", description: "以故事形式展开，增强代入感" },
  { id: "persuasive", name: "说服力强", description: "注重论证和说服，适合营销内容" },
]

// 导出格式数据
const exportFormats = [
  { id: "markdown", name: "Markdown", icon: FileText },
  { id: "txt", name: "纯文本", icon: FileText },
  { id: "html", name: "HTML", icon: FileText },
  { id: "docx", name: "Word文档", icon: FileText },
  { id: "pdf", name: "PDF文件", icon: FileText },
]

// 发布平台数据
const publishPlatforms = [
  { id: "xiaohongshu", name: "小红书", icon: MessageSquarePlus, color: "text-red-500" },
  { id: "wechat", name: "微信公众号", icon: MessageSquarePlus, color: "text-green-500" },
  { id: "douyin", name: "抖音", icon: MessageSquarePlus, color: "text-black dark:text-white" },
  { id: "weibo", name: "微博", icon: MessageSquarePlus, color: "text-yellow-500" },
  { id: "zhihu", name: "知乎", icon: MessageSquarePlus, color: "text-blue-500" },
]

export default function EnhancedEditor() {
  // 基本状态
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [contentStyle, setContentStyle] = useState("casual")
  const [contentLength, setContentLength] = useState([800])
  const [prompt, setPrompt] = useState("")
  const [history, setHistory] = useState<{ timestamp: number; content: string; title: string }[]>([])
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // 内容分析状态
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // 导出状态
  const [exportOptionsVisible, setExportOptionsVisible] = useState(false)
  const [exportMetadata, setExportMetadata] = useState(true)
  const [exportAuthor, setExportAuthor] = useState("")

  // 发布状态
  const [publishPlatform, setPublishPlatform] = useState<string>("")
  const [isPublishing, setIsPublishing] = useState(false)
  const [scheduledPublish, setScheduledPublish] = useState(false)
  const [publishDate, setPublishDate] = useState("")
  const [publishTime, setPublishTime] = useState("")
  const [publishTags, setPublishTags] = useState("")

  // 编辑器引用
  const editorRef = useRef<HTMLTextAreaElement>(null)

  // 保存内容到历史记录
  const saveToHistory = () => {
    setHistory((prev) => [
      ...prev,
      {
        timestamp: Date.now(),
        content: content,
        title: title,
      },
    ])
  }

  // 加载模板
  const loadTemplate = (templateId: string) => {
    const template = contentTemplates.find((t) => t.id === templateId)
    if (template) {
      setContent(template.example)
      saveToHistory()
    }
  }

  // 生成内容
  const generateContent = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      // 在实际应用中，这里会调用AI API
      const template = contentTemplates.find((t) => t.id === selectedTemplate)
      const style = contentStyles.find((s) => s.id === contentStyle)

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 模拟生成的内容
      const generatedContent = `# 关于${prompt}的${template?.name || "内容"}

这是一篇关于${prompt}的${template?.name || "内容"}，采用${style?.name || "轻松活泼"}的风格撰写。

## ${prompt}的主要特点

1. 特点一：这是关于${prompt}的第一个重要特点
2. 特点二：这是关于${prompt}的第二个重要特点
3. 特点三：这是关于${prompt}的第三个重要特点

## 为什么${prompt}如此重要

${prompt}在现代生活中扮演着重要角色，主要体现在以下几个方面：

- 它能够帮助人们提高效率
- 它解决了许多传统方法无法解决的问题
- 它为用户提供了更好的体验

## 如何正确使用${prompt}

正确使用${prompt}可以分为以下几个步骤：

1. 首先，了解${prompt}的基本原理
2. 其次，掌握正确的使用方法
3. 最后，注意日常维护和保养

## 总结

${prompt}作为现代生活中的重要工具/产品，了解和掌握它的相关知识对提升生活/工作质量有着重要意义。希望本文能够帮助您更好地理解和使用${prompt}。`

      setContent(generatedContent)
      setTitle(`关于${prompt}的详细介绍`)
      saveToHistory()
    } catch (error) {
      console.error("生成内容失败", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // 获取AI建议
  const getAISuggestion = async () => {
    if (!content.trim()) return

    setIsGeneratingSuggestion(true)
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模拟返回的建议
      const suggestion =
        "建议优化：\n1. 标题可以更加吸引人，尝试加入数字或问句\n2. 正文第二段缺少具体例子，可以增加案例支持\n3. 结尾部分可以加强号召性，引导读者行动\n4. 考虑添加更多相关关键词以提升SEO效果\n5. 部分句子过长，可以拆分为更短的句子提高可读性"

      setAiSuggestion(suggestion)
    } catch (error) {
      console.error("获取AI建议失败", error)
    } finally {
      setIsGeneratingSuggestion(false)
    }
  }

  // 分析内容
  const analyzeContentHandler = async () => {
    if (!content.trim()) return

    setIsAnalyzing(true)
    try {
      const result = await analyzeContent(content, title)
      setContentAnalysis(result)
    } catch (error) {
      console.error("内容分析失败", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 导出内容
  const exportContentHandler = async (format: ExportFormat) => {
    if (!content.trim()) return

    try {
      const options: ExportOptions = {
        title: title || "未命名文档",
        author: exportAuthor || "未知作者",
        date: new Date(),
        includeMetadata: exportMetadata,
      }

      const blob = await exportContent(content, format, options)
      const filename = title.trim() ? `${title}.${format}` : `content-${new Date().toISOString()}.${format}`
      downloadFile(blob, filename)
    } catch (error) {
      console.error("导出内容失败", error)
      alert(`导出失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // 发布内容
  const publishContentHandler = async () => {
    if (!content.trim() || !publishPlatform) return

    setIsPublishing(true)
    try {
      // 准备发布选项
      const options: PublishOptions = {
        title: title,
        tags: publishTags.split(",").map((tag) => tag.trim()),
        scheduled: scheduledPublish,
      }

      // 如果是定时发布，添加发布时间
      if (scheduledPublish && publishDate && publishTime) {
        const scheduledDateTime = new Date(`${publishDate}T${publishTime}`)
        options.scheduledTime = scheduledDateTime
      }

      // 发布内容
      await publishContent(content, publishPlatform as PublishPlatform, options)

      alert(
        `内容已${scheduledPublish ? "计划" : ""}发布到${publishPlatforms.find((p) => p.id === publishPlatform)?.name}`,
      )
    } catch (error) {
      console.error("发布内容失败", error)
      alert(`发布失败: ${error instanceof Error ? error.message : "未知错误"}`)
    } finally {
      setIsPublishing(false)
    }
  }

  // 复制内容到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        alert("内容已复制到剪贴板")
      })
      .catch((err) => {
        console.error("复制失败:", err)
      })
  }

  // 加载模板时更新选择器
  useEffect(() => {
    if (selectedTemplate) {
      loadTemplate(selectedTemplate)
    }
  }, [selectedTemplate])

  // 渲染预览内容
  const renderPreviewContent = () => {
    // 简单的Markdown到HTML转换
    // 在实际应用中，应使用专门的Markdown解析库
    const htmlContent = content
      .replace(/# (.*?)$/gm, "<h1>$1</h1>")
      .replace(/## (.*?)$/gm, "<h2>$1</h2>")
      .replace(/### (.*?)$/gm, "<h3>$1</h3>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")

    return (
      <div className="prose dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>${title}</h1><p>${htmlContent}</p>` }} />
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-3/4 space-y-4">
          <Card className="p-4 shadow-lg glass-card">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入标题..."
                  className="text-xl font-bold"
                  disabled={previewMode}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setShowAIPanel(!showAIPanel)}>
                        <Wand2 className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI辅助面板</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={saveToHistory}>
                        <Save className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>保存当前版本</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setPreviewMode(!previewMode)}>
                        {previewMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{previewMode ? "编辑模式" : "预览模式"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {!previewMode && (
                <div className="flex flex-wrap gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <Button variant="ghost" size="sm">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Underline className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                  <Button variant="ghost" size="sm">
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Heading3 className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                  <Button variant="ghost" size="sm">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Code className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                  <Button variant="ghost" size="sm">
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                  <Button variant="ghost" size="sm">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Table className="h-4 w-4" />
                  </Button>
                  <div className="flex-grow" />
                  <Button variant="ghost" size="sm">
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {previewMode ? (
                <div className="min-h-[400px] border rounded-md p-4 overflow-auto">{renderPreviewContent()}</div>
              ) : (
                <Textarea
                  ref={editorRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="开始创作内容..."
                  className="min-h-[400px] font-mono text-base leading-relaxed"
                />
              )}

              <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {content.length} 字符 | 约 {Math.round(content.length / 2)} 字
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setContent("")} disabled={previewMode}>
                    <RotateCcw className="h-4 w-4 mr-1" /> 清空
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" /> 复制
                  </Button>

                  <Popover open={exportOptionsVisible} onOpenChange={setExportOptionsVisible}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-1" /> 导出
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <h4 className="font-medium">导出选项</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="include-metadata">包含元数据</Label>
                            <Switch
                              id="include-metadata"
                              checked={exportMetadata}
                              onCheckedChange={setExportMetadata}
                            />
                          </div>

                          {exportMetadata && (
                            <div className="space-y-2">
                              <Label htmlFor="export-author">作者</Label>
                              <Input
                                id="export-author"
                                value={exportAuthor}
                                onChange={(e) => setExportAuthor(e.target.value)}
                                placeholder="输入作者名称"
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {exportFormats.map((format) => (
                            <Button
                              key={format.id}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                exportContentHandler(format.id as ExportFormat)
                                setExportOptionsVisible(false)
                              }}
                              className="justify-start"
                            >
                              <format.icon className="h-4 w-4 mr-2" />
                              {format.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="default" size="sm">
                        <Send className="h-4 w-4 mr-1" /> 发布
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <h4 className="font-medium">发布设置</h4>

                        <div className="space-y-2">
                          <Label htmlFor="publish-platform">选择平台</Label>
                          <Select value={publishPlatform} onValueChange={setPublishPlatform}>
                            <SelectTrigger id="publish-platform">
                              <SelectValue placeholder="选择发布平台" />
                            </SelectTrigger>
                            <SelectContent>
                              {publishPlatforms.map((platform) => (
                                <SelectItem key={platform.id} value={platform.id}>
                                  <div className="flex items-center gap-2">
                                    <platform.icon className={`h-4 w-4 ${platform.color}`} />
                                    <span>{platform.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="publish-tags">标签</Label>
                          <Input
                            id="publish-tags"
                            value={publishTags}
                            onChange={(e) => setPublishTags(e.target.value)}
                            placeholder="输入标签，用逗号分隔"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="scheduled-publish"
                            checked={scheduledPublish}
                            onCheckedChange={setScheduledPublish}
                          />
                          <Label htmlFor="scheduled-publish">定时发布</Label>
                        </div>

                        {scheduledPublish && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label htmlFor="publish-date">发布日期</Label>
                              <Input
                                id="publish-date"
                                type="date"
                                value={publishDate}
                                onChange={(e) => setPublishDate(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="publish-time">发布时间</Label>
                              <Input
                                id="publish-time"
                                type="time"
                                value={publishTime}
                                onChange={(e) => setPublishTime(e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        <Button
                          className="w-full"
                          onClick={publishContentHandler}
                          disabled={isPublishing || !publishPlatform}
                        >
                          {isPublishing ? "发布中..." : "确认发布"}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </Card>

          {showAIPanel && (
            <Card className="p-4 shadow-lg glass-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">AI辅助面板</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAIPanel(false)}>
                  关闭
                </Button>
              </div>

              <Tabs defaultValue="suggestion">
                <TabsList className="mb-4">
                  <TabsTrigger value="suggestion" className="flex items-center gap-1">
                    <Lightbulb className="h-4 w-4" /> 内容建议
                  </TabsTrigger>
                  <TabsTrigger value="polish" className="flex items-center gap-1">
                    <Wand2 className="h-4 w-4" /> 润色优化
                  </TabsTrigger>
                  <TabsTrigger value="expand" className="flex items-center gap-1">
                    <MessageSquarePlus className="h-4 w-4" /> 内容扩展
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="flex items-center gap-1">
                    <BarChart2 className="h-4 w-4" /> 内容分析
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="suggestion">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">内容建议</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={getAISuggestion}
                        disabled={isGeneratingSuggestion || !content.trim()}
                      >
                        {isGeneratingSuggestion ? "生成中..." : "获取建议"}
                      </Button>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md min-h-[100px]">
                      {aiSuggestion ? (
                        <pre className="whitespace-pre-wrap text-sm">{aiSuggestion}</pre>
                      ) : (
                        <p className="text-gray-500 text-sm">点击"获取建议"按钮，AI将分析您的内容并提供改进建议</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="polish">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">润色优化</h4>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="casual">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="选择风格" />
                          </SelectTrigger>
                          <SelectContent>
                            {contentStyles.map((style) => (
                              <SelectItem key={style.id} value={style.id}>
                                {style.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                          润色
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md min-h-[100px]">
                      <p className="text-gray-500 text-sm">选择风格后点击"润色"按钮，AI将根据所选风格优化您的内容</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="expand">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">内容扩展</h4>
                      <Button variant="outline" size="sm">
                        扩展内容
                      </Button>
                    </div>

                    <Textarea placeholder="输入需要扩展的关键点或主题..." className="h-[100px]" />

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md min-h-[100px]">
                      <p className="text-gray-500 text-sm">输入关键点后点击"扩展内容"按钮，AI将为您生成相关内容</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analysis">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">内容分析</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={analyzeContentHandler}
                        disabled={isAnalyzing || !content.trim()}
                      >
                        {isAnalyzing ? "分析中..." : "分析内容"}
                      </Button>
                    </div>

                    {contentAnalysis ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium">可读性评分</h5>
                            <Badge variant={contentAnalysis.readabilityScore > 70 ? "default" : "outline"}>
                              {contentAnalysis.readabilityScore}/100
                            </Badge>
                          </div>
                          <Progress value={contentAnalysis.readabilityScore} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium">SEO评分</h5>
                            <Badge variant={contentAnalysis.seoScore > 70 ? "default" : "outline"}>
                              {contentAnalysis.seoScore}/100
                            </Badge>
                          </div>
                          <Progress value={contentAnalysis.seoScore} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">关键词分析</h5>
                          <div className="flex flex-wrap gap-2">
                            {contentAnalysis.keywords.map((keyword, index) => (
                              <Badge key={index} variant="secondary">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">改进建议</h5>
                          <ul className="text-sm space-y-1">
                            {contentAnalysis.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md min-h-[100px]">
                        <p className="text-gray-500 text-sm">
                          点击"分析内容"按钮，AI将分析您的内容并提供可读性、SEO和关键词分析
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          )}
        </div>

        <div className="w-full md:w-1/4 space-y-4">
          <Card className="p-4 shadow-lg glass-card">
            <h3 className="text-lg font-medium mb-4">内容生成</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>内容类型</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择内容类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>内容风格</Label>
                <Select value={contentStyle} onValueChange={setContentStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择内容风格" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentStyles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>内容长度</Label>
                  <span className="text-sm text-gray-500">{contentLength[0]}字</span>
                </div>
                <Slider value={contentLength} onValueChange={setContentLength} min={300} max={2000} step={100} />
              </div>

              <div className="space-y-2">
                <Label>关键信息</Label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="输入产品信息、目标受众、核心卖点等关键信息..."
                  className="min-h-[120px]"
                />
              </div>

              <Button className="w-full" onClick={generateContent} disabled={isGenerating || !prompt.trim()}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? "生成中..." : "生成内容"}
              </Button>
            </div>
          </Card>

          <Card className="p-4 shadow-lg glass-card">
            <h3 className="text-lg font-medium mb-4">历史版本</h3>

            {history.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {history.map((item, index) => (
                  <Button
                    key={item.timestamp}
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setContent(item.content)
                      setTitle(item.title)
                    }}
                  >
                    <div className="truncate">
                      <div className="font-medium truncate">{item.title || `版本 ${index + 1}`}</div>
                      <div className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">暂无历史版本</p>
            )}
          </Card>

          <Card className="p-4 shadow-lg glass-card">
            <h3 className="text-lg font-medium mb-4">快捷工具</h3>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start" onClick={analyzeContentHandler}>
                <BarChart2 className="h-4 w-4 mr-2" />
                内容分析
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => setExportOptionsVisible(true)}
              >
                <FileDown className="h-4 w-4 mr-2" />
                导出内容
              </Button>
              <Button variant="outline" size="sm" className="justify-start" onClick={() => setShowAIPanel(true)}>
                <Wand2 className="h-4 w-4 mr-2" />
                AI辅助
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                预览
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

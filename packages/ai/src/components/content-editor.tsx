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
} from "lucide-react"

// 模拟AI生成内容的函数
const generateAIContent = async (prompt: string, contentType: string, style: string, length: number) => {
  // 在实际应用中，这里会调用AI API
  console.log("生成内容", { prompt, contentType, style, length })

  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // 返回模拟的生成内容
  return `这是由AI生成的${contentType}内容，风格为${style}，长度约${length}字。\n\n${prompt}\n\n这里是正文内容，根据您的需求生成。这只是一个示例，实际内容将由AI根据您的具体要求生成。`
}

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
  { id: "docx", name: "Word文档", icon: FileText },
  { id: "html", name: "HTML", icon: FileText },
  { id: "pdf", name: "PDF文件", icon: FileText },
]

export default function ContentEditor() {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [contentStyle, setContentStyle] = useState("casual")
  const [contentLength, setContentLength] = useState([800])
  const [prompt, setPrompt] = useState("")
  const [history, setHistory] = useState<{ timestamp: number; content: string }[]>([])
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false)

  const editorRef = useRef<HTMLTextAreaElement>(null)

  // 保存内容到历史记录
  const saveToHistory = () => {
    setHistory((prev) => [
      ...prev,
      {
        timestamp: Date.now(),
        content: content,
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
      const template = contentTemplates.find((t) => t.id === selectedTemplate)
      const style = contentStyles.find((s) => s.id === contentStyle)

      const generatedContent = await generateAIContent(
        prompt,
        template?.name || "通用内容",
        style?.name || "轻松活泼",
        contentLength[0],
      )

      setContent(generatedContent)
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
        "建议优化：\n1. 标题可以更加吸引人，尝试加入数字或问句\n2. 正文第二段缺少具体例子，可以增加案例支持\n3. 结尾部分可以加强号召性，引导读者行动"

      setAiSuggestion(suggestion)
    } catch (error) {
      console.error("获取AI建议失败", error)
    } finally {
      setIsGeneratingSuggestion(false)
    }
  }

  // 导出内容
  const exportContent = (format: string) => {
    if (!content.trim()) return

    // 在实际应用中，这里会调用相应的库来处理不同格式的导出
    // 这里仅做简单的演示

    const filename = title.trim() ? `${title}.${format}` : `content-${new Date().toISOString()}.${format}`

    const element = document.createElement("a")
    let file

    switch (format) {
      case "markdown":
      case "txt":
      case "html":
        file = new Blob([content], { type: "text/plain" })
        break
      default:
        alert(`导出${format}格式需要在服务器端实现`)
        return
    }

    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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
              </div>

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
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ListOrdered className="h-4 w-4" />
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
                <div className="flex-grow" />
                <Button variant="ghost" size="sm">
                  <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Redo className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                ref={editorRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="开始创作内容..."
                className="min-h-[400px] font-mono text-base leading-relaxed"
              />

              <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {content.length} 字符 | 约 {Math.round(content.length / 2)} 字
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setContent("")}>
                    <RotateCcw className="h-4 w-4 mr-1" /> 清空
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" /> 复制
                  </Button>
                  <Select onValueChange={(value) => exportContent(value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="导出..." />
                    </SelectTrigger>
                    <SelectContent>
                      {exportFormats.map((format) => (
                        <SelectItem key={format.id} value={format.id}>
                          <div className="flex items-center gap-2">
                            <format.icon className="h-4 w-4" />
                            <span>{format.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    onClick={() => setContent(item.content)}
                  >
                    <span className="truncate">
                      版本 {index + 1} - {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">暂无历史版本</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

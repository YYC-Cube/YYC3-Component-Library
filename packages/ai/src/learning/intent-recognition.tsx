"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Sparkles, TrendingUp, BarChart3, PieChart } from "lucide-react"

interface Intent {
  type: "visualization" | "analysis" | "learning" | "export"
  confidence: number
  suggestion: string
  action: string
  parameters?: Record<string, any>
}

interface FloatingPrompt {
  id: string
  text: string
  icon: React.ReactNode
  position: { x: number; y: number }
  opacity: number
}

export default function IntentRecognition() {
  const [userInput, setUserInput] = useState("")
  const [recognizedIntent, setRecognizedIntent] = useState<Intent | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [floatingPrompts, setFloatingPrompts] = useState<FloatingPrompt[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const commonPrompts = [
    { text: "显示销售趋势", icon: <TrendingUp className="h-4 w-4" />, type: "visualization" },
    { text: "分析用户行为", icon: <BarChart3 className="h-4 w-4" />, type: "analysis" },
    { text: "创建饼图", icon: <PieChart className="h-4 w-4" />, type: "visualization" },
    { text: "学习数据可视化", icon: <Sparkles className="h-4 w-4" />, type: "learning" },
  ]

  useEffect(() => {
    if (showSuggestions) {
      const prompts = commonPrompts.map((prompt, index) => ({
        id: `prompt-${index}`,
        text: prompt.text,
        icon: prompt.icon,
        position: {
          x: Math.random() * 300 + 50,
          y: Math.random() * 200 + 100,
        },
        opacity: 0,
      }))

      setFloatingPrompts(prompts)

      // Animate prompts appearing
      prompts.forEach((prompt, index) => {
        setTimeout(() => {
          setFloatingPrompts((prev) => prev.map((p) => (p.id === prompt.id ? { ...p, opacity: 1 } : p)))
        }, index * 200)
      })
    } else {
      setFloatingPrompts([])
    }
  }, [showSuggestions])

  const recognizeIntent = async (input: string) => {
    setIsProcessing(true)
    setShowSuggestions(false)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simple intent recognition logic
    let intent: Intent

    if (input.includes("趋势") || input.includes("变化") || input.includes("时间")) {
      intent = {
        type: "visualization",
        confidence: 0.92,
        suggestion: "建议使用折线图展示数据趋势",
        action: "create_line_chart",
        parameters: { chartType: "line", timeAxis: true },
      }
    } else if (input.includes("比例") || input.includes("占比") || input.includes("饼图")) {
      intent = {
        type: "visualization",
        confidence: 0.88,
        suggestion: "建议使用饼图展示数据比例",
        action: "create_pie_chart",
        parameters: { chartType: "pie" },
      }
    } else if (input.includes("学习") || input.includes("教程") || input.includes("如何")) {
      intent = {
        type: "learning",
        confidence: 0.85,
        suggestion: "为您推荐相关学习路径",
        action: "generate_learning_path",
        parameters: { topic: input },
      }
    } else {
      intent = {
        type: "analysis",
        confidence: 0.75,
        suggestion: "建议进行数据分析",
        action: "analyze_data",
        parameters: { query: input },
      }
    }

    setRecognizedIntent(intent)
    setIsProcessing(false)
  }

  const handlePromptClick = (prompt: any) => {
    setUserInput(prompt.text)
    setShowSuggestions(false)
    recognizeIntent(prompt.text)
  }

  const getIntentColor = (type: string) => {
    switch (type) {
      case "visualization":
        return "bg-blue-100 text-blue-800"
      case "analysis":
        return "bg-green-100 text-green-800"
      case "learning":
        return "bg-purple-100 text-purple-800"
      case "export":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIntentIcon = (type: string) => {
    switch (type) {
      case "visualization":
        return <BarChart3 className="h-5 w-5" />
      case "analysis":
        return <TrendingUp className="h-5 w-5" />
      case "learning":
        return <Sparkles className="h-5 w-5" />
      case "export":
        return <MessageSquare className="h-5 w-5" />
      default:
        return <MessageSquare className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Intent Recognition Interface */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl">智能意图识别</CardTitle>
              <CardDescription>输入您的需求，AI将自动识别意图并提供最佳建议</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="例如：显示销售数据的月度趋势..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && userInput && recognizeIntent(userInput)}
                className="flex-1"
              />
              <Button
                onClick={() => userInput && recognizeIntent(userInput)}
                disabled={isProcessing || !userInput}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "识别意图"
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowSuggestions(!showSuggestions)}>
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2">
              {commonPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs"
                >
                  {prompt.icon}
                  <span className="ml-1">{prompt.text}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Floating Prompts Animation */}
        {floatingPrompts.map((prompt) => (
          <div
            key={prompt.id}
            className="absolute pointer-events-none transition-all duration-1000 ease-out"
            style={{
              left: prompt.position.x,
              top: prompt.position.y,
              opacity: prompt.opacity,
              transform: `translateY(${prompt.opacity === 1 ? 0 : 20}px)`,
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2 text-sm">
                {prompt.icon}
                {prompt.text}
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* Recognized Intent Display */}
      {recognizedIntent && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getIntentIcon(recognizedIntent.type)}
                <div>
                  <CardTitle className="text-lg">识别结果</CardTitle>
                  <CardDescription>AI分析您的意图并提供建议</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{Math.round(recognizedIntent.confidence * 100)}%</div>
                <div className="text-sm text-gray-500">置信度</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getIntentColor(recognizedIntent.type)}>
                  {recognizedIntent.type === "visualization"
                    ? "可视化"
                    : recognizedIntent.type === "analysis"
                      ? "数据分析"
                      : recognizedIntent.type === "learning"
                        ? "学习指导"
                        : "其他"}
                </Badge>
                <span className="text-sm text-gray-600">意图类型</span>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">AI建议</h4>
                <p className="text-blue-800">{recognizedIntent.suggestion}</p>
              </div>

              {recognizedIntent.parameters && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">执行参数</h4>
                  <div className="space-y-1">
                    {Object.entries(recognizedIntent.parameters).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-mono text-gray-800">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700">执行建议</Button>
                <Button variant="outline">查看详情</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

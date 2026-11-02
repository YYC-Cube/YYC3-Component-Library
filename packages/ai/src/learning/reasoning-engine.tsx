"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Lightbulb, ArrowRight, CheckCircle, Clock, Zap } from "lucide-react"

interface ReasoningStep {
  id: string
  title: string
  content: string
  confidence: number
  status: "pending" | "processing" | "completed"
}

export default function ReasoningEngine() {
  const [query, setQuery] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([])
  const [finalResult, setFinalResult] = useState("")

  const handleReasoning = async () => {
    if (!query.trim()) return

    setIsProcessing(true)
    setReasoningSteps([])
    setFinalResult("")

    // 模拟Chain-of-Thought推理过程
    const steps: ReasoningStep[] = [
      {
        id: "1",
        title: "问题分析",
        content: `分析用户查询："${query}"，识别关键信息和意图`,
        confidence: 95,
        status: "pending",
      },
      {
        id: "2",
        title: "知识检索",
        content: "从知识图谱中检索相关概念和关系",
        confidence: 88,
        status: "pending",
      },
      {
        id: "3",
        title: "逻辑推理",
        content: "基于检索到的知识进行逻辑推理和关联分析",
        confidence: 92,
        status: "pending",
      },
      {
        id: "4",
        title: "方案生成",
        content: "生成可行的解决方案和建议",
        confidence: 89,
        status: "pending",
      },
    ]

    // 逐步执行推理过程
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setReasoningSteps((prev) => prev.map((step, index) => (index === i ? { ...step, status: "processing" } : step)))

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setReasoningSteps((prev) => prev.map((step, index) => (index === i ? { ...step, status: "completed" } : step)))

      if (i === 0) {
        setReasoningSteps(steps.map((step, index) => (index === 0 ? { ...step, status: "completed" } : step)))
      }
    }

    // 生成最终结果
    await new Promise((resolve) => setTimeout(resolve, 500))
    setFinalResult(`基于Chain-of-Thought推理，针对"${query}"的分析结果：

1. 核心问题识别：数据可视化需求分析
2. 推荐解决方案：
   - 使用柱状图展示分类数据对比
   - 采用折线图显示时间序列趋势
   - 结合散点图分析数据相关性
3. 实施建议：
   - 数据预处理：清洗异常值，标准化格式
   - 图表配置：选择合适的颜色编码和交互方式
   - 性能优化：大数据集采用分页或采样策略`)

    setIsProcessing(false)
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <Brain className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 推理输入 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Chain-of-Thought 推理引擎
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="请输入您的问题或需求，AI将进行逐步推理分析..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleReasoning} disabled={isProcessing || !query.trim()} className="w-full">
            {isProcessing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                推理中...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                开始推理
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 推理步骤 */}
      {reasoningSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              推理过程
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reasoningSteps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">{getStepIcon(step.status)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{step.title}</h4>
                      <Badge variant={step.status === "completed" ? "default" : "secondary"}>
                        {step.confidence}% 置信度
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{step.content}</p>
                    {step.status === "processing" && <Progress value={75} className="h-2" />}
                  </div>
                  {index < reasoningSteps.length - 1 && <ArrowRight className="h-4 w-4 text-gray-400 mt-6" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 推理结果 */}
      {finalResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              推理结果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{finalResult}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

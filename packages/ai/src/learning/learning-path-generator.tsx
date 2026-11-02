"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Target, CheckCircle, Clock, ArrowRight } from "lucide-react"

interface LearningNode {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number
  prerequisites: string[]
  skills: string[]
  completed: boolean
  progress: number
}

interface LearningPath {
  id: string
  title: string
  description: string
  totalNodes: number
  completedNodes: number
  estimatedDuration: number
  nodes: LearningNode[]
}

const mockLearningPaths: LearningPath[] = [
  {
    id: "data-viz-fundamentals",
    title: "数据可视化基础",
    description: "掌握数据可视化的核心概念和基本技能",
    totalNodes: 6,
    completedNodes: 2,
    estimatedDuration: 120,
    nodes: [
      {
        id: "data-types",
        title: "数据类型识别",
        description: "学习识别不同类型的数据：数值型、分类型、时间序列",
        difficulty: "beginner",
        estimatedTime: 20,
        prerequisites: [],
        skills: ["数据分析", "统计基础"],
        completed: true,
        progress: 100,
      },
      {
        id: "chart-selection",
        title: "图表类型选择",
        description: "根据数据特征选择最适合的图表类型",
        difficulty: "beginner",
        estimatedTime: 30,
        prerequisites: ["data-types"],
        skills: ["可视化设计", "数据分析"],
        completed: true,
        progress: 100,
      },
      {
        id: "color-theory",
        title: "色彩理论应用",
        description: "掌握数据可视化中的色彩搭配和编码原则",
        difficulty: "intermediate",
        estimatedTime: 25,
        prerequisites: ["chart-selection"],
        skills: ["设计理论", "视觉编码"],
        completed: false,
        progress: 60,
      },
    ],
  },
]

export default function LearningPathGenerator() {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [userSkills, setUserSkills] = useState<string[]>(["数据分析", "基础编程"])

  const generatePersonalizedPath = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSelectedPath(mockLearningPaths[0])
    setIsGenerating(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Learning Path Generator Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl text-blue-900">智能学习路径生成器</CardTitle>
              <CardDescription className="text-blue-700">
                基于AI分析为您定制个性化学习路径，提升数据可视化技能
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium text-blue-700">当前技能:</span>
            {userSkills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                {skill}
              </Badge>
            ))}
          </div>
          <Button onClick={generatePersonalizedPath} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700">
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                生成学习路径中...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                生成个性化学习路径
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Learning Path */}
      {selectedPath && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{selectedPath.title}</CardTitle>
                <CardDescription>{selectedPath.description}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((selectedPath.completedNodes / selectedPath.totalNodes) * 100)}%
                </div>
                <div className="text-sm text-gray-500">完成进度</div>
              </div>
            </div>
            <Progress value={(selectedPath.completedNodes / selectedPath.totalNodes) * 100} className="mt-2" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {selectedPath.nodes.map((node, index) => (
                <div key={node.id} className="relative">
                  {/* Connection Line */}
                  {index < selectedPath.nodes.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200"></div>
                  )}

                  <div
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                      node.completed
                        ? "bg-green-50 border-green-200"
                        : node.progress > 0
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        node.completed ? "bg-green-500" : node.progress > 0 ? "bg-blue-500" : "bg-gray-400"
                      }`}
                    >
                      {node.completed ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : (
                        <span className="text-white font-bold">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{node.title}</h3>
                        <Badge className={getDifficultyColor(node.difficulty)}>{node.difficulty}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {node.estimatedTime}分钟
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3">{node.description}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {node.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {node.progress > 0 && node.progress < 100 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>学习进度</span>
                            <span>{node.progress}%</span>
                          </div>
                          <Progress value={node.progress} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {node.prerequisites.length > 0 && <span>前置要求: {node.prerequisites.join(", ")}</span>}
                        </div>
                        <Button
                          size="sm"
                          variant={node.completed ? "outline" : "default"}
                          className={node.completed ? "" : "bg-blue-600 hover:bg-blue-700"}
                        >
                          {node.completed ? "已完成" : node.progress > 0 ? "继续学习" : "开始学习"}
                          {!node.completed && <ArrowRight className="h-4 w-4 ml-1" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

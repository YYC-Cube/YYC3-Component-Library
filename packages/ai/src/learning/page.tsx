"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Brain,
  Target,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  Volume2,
  VolumeX,
  Heart,
  Lightbulb,
  Zap,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"
import AdvancedEmotionalSystem from "@/components/advanced-emotional-system"
import KnowledgeGraphVisualizer from "@/components/knowledge-graph-visualizer"
import IntelligentReportGenerator from "@/components/intelligent-report-generator"
import MultimodalInteractionHub from "@/components/multimodal-interaction-hub"
import LearningPathGenerator from "@/components/learning-path-generator"

interface EmotionState {
  type: "happy" | "anxious" | "confused" | "motivated" | "neutral"
  intensity: number
}

// 学习节点数据类型
interface LearningNode {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  estimatedTime: number
  prerequisites: string[]
  completed: boolean
  emotion?: "neutral" | "encouraging" | "challenging"
  position: { x: number; y: number }
  emotionEmoji?: string
  encouragementText?: string
  knowledgePoints?: string[]
}

const sampleLearningPath: LearningNode[] = [
  {
    id: "1",
    title: "JavaScript 基础语法",
    description: "掌握JavaScript的基本语法、变量、函数和控制结构",
    difficulty: "beginner",
    category: "编程基础",
    estimatedTime: 120,
    prerequisites: [],
    completed: true,
    emotion: "encouraging",
    position: { x: 100, y: 100 },
    emotionEmoji: "🌱",
    encouragementText: "很棒的开始！基础很重要",
    knowledgePoints: ["变量声明", "函数定义", "条件语句", "循环结构"],
  },
  {
    id: "2",
    title: "React 组件化思想",
    description: "理解React组件化开发思想，掌握JSX语法和组件生命周期",
    difficulty: "intermediate",
    category: "前端框架",
    estimatedTime: 180,
    prerequisites: ["1"],
    completed: true,
    emotion: "neutral",
    position: { x: 400, y: 100 },
    emotionEmoji: "⚛️",
    encouragementText: "组件化思维正在建立",
    knowledgePoints: ["JSX语法", "组件props", "状态管理", "事件处理"],
  },
  {
    id: "3",
    title: "React Hooks 深入",
    description: "深入理解useState、useEffect等Hooks的使用场景和最佳实践",
    difficulty: "intermediate",
    category: "前端框架",
    estimatedTime: 90,
    prerequisites: ["2"],
    completed: false,
    emotion: "challenging",
    position: { x: 700, y: 100 },
    emotionEmoji: "🎯",
    encouragementText: "挑战自己，突破进阶",
    knowledgePoints: ["useState", "useEffect", "useContext", "自定义Hooks"],
  },
  {
    id: "4",
    title: "状态管理进阶",
    description: "学习Redux、Zustand等状态管理方案，构建复杂应用",
    difficulty: "advanced",
    category: "状态管理",
    estimatedTime: 150,
    prerequisites: ["3"],
    completed: false,
    emotion: "challenging",
    position: { x: 1000, y: 100 },
    emotionEmoji: "🚀",
    encouragementText: "掌握这个，你就是高手了！",
    knowledgePoints: ["Redux原理", "中间件", "异步处理", "性能优化"],
  },
]

function LearningPathNode({
  node,
  onComplete,
  isActive,
}: {
  node: LearningNode
  onComplete: (id: string) => void
  isActive: boolean
}) {
  const [showDetails, setShowDetails] = useState(false)
  const [celebrationActive, setCelebrationActive] = useState(false)

  const getDifficultyColor = () => {
    switch (node.difficulty) {
      case "beginner":
        return "bg-emerald-500 text-white"
      case "intermediate":
        return "bg-blue-500 text-white"
      case "advanced":
        return "bg-purple-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  const getEmotionStyle = () => {
    switch (node.emotion) {
      case "encouraging":
        return {
          borderColor: "#F59E0B",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
        }
      case "challenging":
        return {
          borderColor: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
        }
      default:
        return {
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        }
    }
  }

  const handleComplete = () => {
    setCelebrationActive(true)
    onComplete(node.id)
    setTimeout(() => setCelebrationActive(false), 2000)
  }

  const emotionStyle = getEmotionStyle()

  return (
    <motion.div
      className={`relative ${isActive ? "z-10" : "z-0"}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: isActive ? 1.05 : 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className={`w-72 cursor-pointer transition-all duration-300 ${
          isActive ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
        } ${node.completed ? "bg-muted/50" : "bg-card"}`}
        style={{
          borderLeft: `4px solid ${emotionStyle.borderColor}`,
          backgroundColor: node.completed ? emotionStyle.backgroundColor : undefined,
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge className={getDifficultyColor()}>
              {node.difficulty === "beginner" ? "初级" : node.difficulty === "intermediate" ? "中级" : "高级"}
            </Badge>
            <div className="flex items-center gap-2">
              <div className="text-2xl">{node.emotionEmoji}</div>
              {celebrationActive && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} className="text-2xl">
                  🎉
                </motion.div>
              )}
            </div>
          </div>
          <CardTitle className="text-lg font-bold text-balance">{node.title}</CardTitle>
          {node.encouragementText && <p className="text-xs text-muted-foreground italic">{node.encouragementText}</p>}
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground text-pretty">{node.description}</p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{node.estimatedTime}分钟</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">类别:</span>
            <Badge variant="outline">{node.category}</Badge>
          </div>

          {node.knowledgePoints && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="h-6 px-2 text-xs"
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                知识点 ({node.knowledgePoints.length})
              </Button>
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    {node.knowledgePoints.map((point, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-primary"></div>
                        {point}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {node.completed ? (
              <motion.div
                className="flex items-center gap-2 text-emerald-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">已完成</span>
              </motion.div>
            ) : (
              <Button size="sm" onClick={handleComplete} className="flex items-center gap-2">
                <Circle className="w-4 h-4" />
                标记完成
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// 连接线组件
function ConnectionLine({
  from,
  to,
  completed,
}: {
  from: { x: number; y: number }
  to: { x: number; y: number }
  completed: boolean
}) {
  return (
    <motion.svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <motion.path
        d={`M ${from.x + 256} ${from.y + 100} L ${to.x} ${to.y + 100}`}
        stroke={completed ? "hsl(var(--chart-4))" : "hsl(var(--border))"}
        strokeWidth="3"
        fill="none"
        strokeDasharray={completed ? "0" : "8 4"}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
      <motion.circle
        cx={to.x}
        cy={to.y + 100}
        r="6"
        fill={completed ? "hsl(var(--chart-4))" : "hsl(var(--border))"}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.8 }}
      />
    </motion.svg>
  )
}

export default function LearningPage() {
  const router = useRouter()
  const [learningPath, setLearningPath] = useState<LearningNode[]>(sampleLearningPath)
  const [activeNode, setActiveNode] = useState<string>("3")
  const [showStats, setShowStats] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [userEmotion, setUserEmotion] = useState<EmotionState>({ type: "motivated", intensity: 0.8 })
  const [interactionLogs, setInteractionLogs] = useState<Array<{ type: string; data: any; timestamp: number }>>([])

  const completedCount = learningPath.filter((node) => node.completed).length
  const totalCount = learningPath.length
  const progressPercentage = (completedCount / totalCount) * 100

  const handleCompleteNode = useCallback((nodeId: string) => {
    setLearningPath((prev) => prev.map((node) => (node.id === nodeId ? { ...node, completed: true } : node)))
    setUserEmotion({ type: "happy", intensity: 0.9 })
    setTimeout(() => setUserEmotion({ type: "motivated", intensity: 0.8 }), 3000)
  }, [])

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const getEmotionalTheme = () => {
    switch (userEmotion.type) {
      case "happy":
        return "from-emerald-500 to-blue-500"
      case "motivated":
        return "from-blue-500 to-purple-500"
      case "anxious":
        return "from-amber-500 to-orange-500"
      default:
        return "from-blue-500 to-purple-500"
    }
  }

  const handleMultimodalInteraction = useCallback((type: string, data: any) => {
    console.log("[v0] 多模态交互:", type, data)

    const newLog = {
      type,
      data,
      timestamp: Date.now(),
    }

    setInteractionLogs((prev) => [...prev.slice(-4), newLog])

    if (type === "voice") {
      setUserEmotion({ type: "motivated", intensity: 0.9 })
    } else if (type === "gesture") {
      setUserEmotion({ type: "happy", intensity: 0.8 })
    } else if (type === "ar") {
      setUserEmotion({ type: "motivated", intensity: 0.7 })
    }

    setTimeout(() => {
      setUserEmotion({ type: "motivated", intensity: 0.8 })
    }, 3000)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* 头部区域 */}
      <motion.header
        className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getEmotionalTheme()} flex items-center justify-center`}
                >
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">个性化学习路径</h1>
                  <p className="text-sm text-muted-foreground">基于知识图谱的智能学习规划</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSound}
                className="flex items-center gap-2 bg-transparent"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                音效
              </Button>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm">
                  {userEmotion.type === "happy"
                    ? "开心"
                    : userEmotion.type === "motivated"
                      ? "积极"
                      : userEmotion.type === "anxious"
                        ? "焦虑"
                        : "平静"}
                </span>
              </div>

              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                协作学习
              </Button>
              <Button size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                AI助手
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏统计 */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  学习进度
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {completedCount}/{totalCount}
                  </div>
                  <p className="text-sm text-muted-foreground">已完成课程</p>
                </div>

                <Progress value={progressPercentage} className="h-3" />

                <div className="text-center text-sm text-muted-foreground">{progressPercentage.toFixed(0)}% 完成</div>

                {progressPercentage > 50 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-2 bg-emerald-50 rounded-lg border border-emerald-200"
                  >
                    <div className="text-lg">🎯</div>
                    <p className="text-xs text-emerald-700">学习进度过半，继续加油！</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <AnimatePresence>
              {showStats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-secondary" />
                        学习统计
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">总学习时间</span>
                        <span className="text-sm font-medium">
                          {learningPath.reduce((acc, node) => acc + (node.completed ? node.estimatedTime : 0), 0)}分钟
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">剩余时间</span>
                        <span className="text-sm font-medium">
                          {learningPath.reduce((acc, node) => acc + (!node.completed ? node.estimatedTime : 0), 0)}分钟
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 主要学习路径可视化区域 */}
          <div className="lg:col-span-3 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <LearningPathGenerator />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <AdvancedEmotionalSystem />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <KnowledgeGraphVisualizer />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <IntelligentReportGenerator />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Target className="w-6 h-6 text-primary" />
                        学习路径可视化
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">基于知识图谱的智能学习路径规划</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Zap className="w-4 h-4 mr-2" />
                        AI优化
                      </Button>
                      <Button variant="outline" size="sm">
                        <BookOpen className="w-4 h-4 mr-2" />
                        调整路径
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-0 pb-0">
                  <div className="relative min-h-[400px] overflow-x-auto">
                    <div className="relative w-max min-w-full">
                      {learningPath.map((node, index) => {
                        if (index === learningPath.length - 1) return null
                        const nextNode = learningPath[index + 1]
                        return (
                          <ConnectionLine
                            key={`${node.id}-${nextNode.id}`}
                            from={node.position}
                            to={nextNode.position}
                            completed={node.completed && nextNode.completed}
                          />
                        )
                      })}

                      {learningPath.map((node, index) => (
                        <motion.div
                          key={node.id}
                          className="absolute"
                          style={{
                            left: node.position.x,
                            top: node.position.y,
                          }}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.6 + index * 0.2,
                          }}
                          onClick={() => setActiveNode(node.id)}
                        >
                          <LearningPathNode
                            node={node}
                            onComplete={handleCompleteNode}
                            isActive={activeNode === node.id}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    className="flex items-center justify-between pt-6 mt-6 border-t"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.5 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span>已完成</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-3 h-3 rounded-full bg-border"></div>
                        <span>待学习</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span>重点关注</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        导出路径
                      </Button>
                      <Button size="sm">生成报告</Button>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <MultimodalInteractionHub onInteraction={handleMultimodalInteraction} />
    </div>
  )
}

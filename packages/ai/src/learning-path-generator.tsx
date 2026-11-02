"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Target,
  Zap,
  GitBranch,
  Clock,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Settings,
  Download,
  Share2,
  Play,
} from "lucide-react"

interface LearningGoal {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  estimatedTime: number
  prerequisites: string[]
  skills: string[]
}

interface UserProfile {
  currentLevel: "beginner" | "intermediate" | "advanced"
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading"
  availableTime: number // 每周可用时间（小时）
  interests: string[]
  completedTopics: string[]
  weakAreas: string[]
  preferredDifficulty: "gradual" | "challenging" | "mixed"
}

interface GeneratedPath {
  id: string
  title: string
  description: string
  totalTime: number
  difficulty: string
  nodes: PathNode[]
  metadata: {
    algorithm: string
    confidence: number
    adaptability: number
    personalization: number
  }
}

interface PathNode {
  id: string
  title: string
  description: string
  type: "concept" | "practice" | "project" | "assessment"
  difficulty: number
  estimatedTime: number
  prerequisites: string[]
  skills: string[]
  resources: Resource[]
  position: { x: number; y: number }
}

interface Resource {
  type: "video" | "article" | "exercise" | "project"
  title: string
  url: string
  duration: number
}

const sampleUserProfile: UserProfile = {
  currentLevel: "intermediate",
  learningStyle: "visual",
  availableTime: 10,
  interests: ["前端开发", "React", "TypeScript", "UI设计"],
  completedTopics: ["HTML", "CSS", "JavaScript基础"],
  weakAreas: ["状态管理", "性能优化"],
  preferredDifficulty: "gradual",
}

const sampleLearningGoals: LearningGoal[] = [
  {
    id: "1",
    title: "掌握React高级特性",
    description: "深入理解React Hooks、Context、性能优化等高级概念",
    priority: "high",
    estimatedTime: 40,
    prerequisites: ["React基础", "JavaScript ES6+"],
    skills: ["React Hooks", "Context API", "性能优化", "测试"],
  },
  {
    id: "2",
    title: "TypeScript实战应用",
    description: "在React项目中熟练使用TypeScript进行类型安全开发",
    priority: "medium",
    estimatedTime: 30,
    prerequisites: ["JavaScript", "React基础"],
    skills: ["TypeScript语法", "类型定义", "泛型", "装饰器"],
  },
  {
    id: "3",
    title: "现代前端工程化",
    description: "掌握Webpack、Vite等构建工具和CI/CD流程",
    priority: "medium",
    estimatedTime: 25,
    prerequisites: ["前端基础", "Node.js"],
    skills: ["构建工具", "模块化", "自动化部署", "性能监控"],
  },
]

export default function LearningPathGenerator() {
  const [userProfile, setUserProfile] = useState<UserProfile>(sampleUserProfile)
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>(sampleLearningGoals)
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["1"])
  const [generatedPaths, setGeneratedPaths] = useState<GeneratedPath[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0)
  const [activeTab, setActiveTab] = useState("goals")

  // 学习路径生成算法
  const generateLearningPath = useCallback(async () => {
    setIsGenerating(true)
    setGenerationStep(0)

    const steps = [
      "分析用户画像和学习目标",
      "构建知识依赖图谱",
      "应用个性化推荐算法",
      "优化学习路径序列",
      "生成详细学习计划",
    ]

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(i)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // 模拟路径生成逻辑
    const selectedGoalObjects = learningGoals.filter((goal) => selectedGoals.includes(goal.id))

    const newPath: GeneratedPath = {
      id: Date.now().toString(),
      title: `个性化学习路径 - ${selectedGoalObjects.map((g) => g.title).join(", ")}`,
      description: "基于知识图谱和个性化算法生成的最优学习路径",
      totalTime: selectedGoalObjects.reduce((acc, goal) => acc + goal.estimatedTime, 0),
      difficulty: userProfile.preferredDifficulty,
      nodes: generatePathNodes(selectedGoalObjects, userProfile),
      metadata: {
        algorithm: "PageRank + 协同过滤",
        confidence: 0.87,
        adaptability: 0.92,
        personalization: 0.89,
      },
    }

    setGeneratedPaths([newPath])
    setIsGenerating(false)
    setActiveTab("results")
  }, [selectedGoals, learningGoals, userProfile])

  // 生成路径节点
  const generatePathNodes = (goals: LearningGoal[], profile: UserProfile): PathNode[] => {
    const nodes: PathNode[] = []
    let nodeId = 1
    let yPosition = 0

    goals.forEach((goal, goalIndex) => {
      // 为每个目标生成学习节点
      const skillNodes = goal.skills.map((skill, skillIndex) => {
        const node: PathNode = {
          id: `${nodeId++}`,
          title: skill,
          description: `掌握${skill}的核心概念和实践应用`,
          type:
            skillIndex % 4 === 0
              ? "concept"
              : skillIndex % 4 === 1
                ? "practice"
                : skillIndex % 4 === 2
                  ? "project"
                  : "assessment",
          difficulty: profile.currentLevel === "beginner" ? 0.3 : profile.currentLevel === "intermediate" ? 0.6 : 0.9,
          estimatedTime: Math.floor(goal.estimatedTime / goal.skills.length),
          prerequisites: skillIndex === 0 ? [] : [`${nodeId - 2}`],
          skills: [skill],
          resources: generateResources(skill, profile.learningStyle),
          position: { x: skillIndex * 300, y: yPosition },
        }
        return node
      })

      nodes.push(...skillNodes)
      yPosition += 200
    })

    return nodes
  }

  // 生成学习资源
  const generateResources = (skill: string, learningStyle: string): Resource[] => {
    const baseResources: Resource[] = [
      {
        type: "video",
        title: `${skill} 视频教程`,
        url: "#",
        duration: 30,
      },
      {
        type: "article",
        title: `${skill} 详细文档`,
        url: "#",
        duration: 15,
      },
      {
        type: "exercise",
        title: `${skill} 练习题`,
        url: "#",
        duration: 20,
      },
    ]

    // 根据学习风格调整资源权重
    if (learningStyle === "visual") {
      baseResources.unshift({
        type: "video",
        title: `${skill} 可视化演示`,
        url: "#",
        duration: 25,
      })
    } else if (learningStyle === "kinesthetic") {
      baseResources.push({
        type: "project",
        title: `${skill} 实战项目`,
        url: "#",
        duration: 60,
      })
    }

    return baseResources
  }

  const toggleGoalSelection = (goalId: string) => {
    setSelectedGoals((prev) => (prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                智能学习路径生成器
                <Badge variant="outline">AI驱动</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">基于知识图谱和个性化算法的学习路径规划</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              配置
            </Button>
            <Button size="sm" onClick={generateLearningPath} disabled={isGenerating || selectedGoals.length === 0}>
              <Zap className="w-4 h-4 mr-2" />
              {isGenerating ? "生成中..." : "生成路径"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">用户画像</TabsTrigger>
            <TabsTrigger value="goals">学习目标</TabsTrigger>
            <TabsTrigger value="generation">生成过程</TabsTrigger>
            <TabsTrigger value="results">生成结果</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">个人学习档案</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">当前水平</label>
                    <Badge className="ml-2" variant={userProfile.currentLevel === "advanced" ? "default" : "secondary"}>
                      {userProfile.currentLevel === "beginner"
                        ? "初级"
                        : userProfile.currentLevel === "intermediate"
                          ? "中级"
                          : "高级"}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">学习风格</label>
                    <Badge className="ml-2" variant="outline">
                      {userProfile.learningStyle === "visual"
                        ? "视觉型"
                        : userProfile.learningStyle === "auditory"
                          ? "听觉型"
                          : userProfile.learningStyle === "kinesthetic"
                            ? "动手型"
                            : "阅读型"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">每周可用时间</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{userProfile.availableTime} 小时/周</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">兴趣领域</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {userProfile.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">已完成主题</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {userProfile.completedTopics.map((topic) => (
                      <Badge key={topic} className="bg-emerald-100 text-emerald-700">
                        ✓ {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">薄弱环节</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {userProfile.weakAreas.map((area) => (
                      <Badge key={area} className="bg-amber-100 text-amber-700">
                        ⚠ {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">选择学习目标</h3>
                <div className="text-sm text-muted-foreground">已选择 {selectedGoals.length} 个目标</div>
              </div>

              {learningGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedGoals.includes(goal.id)
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => toggleGoalSelection(goal.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge
                          variant={
                            goal.priority === "high"
                              ? "destructive"
                              : goal.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {goal.priority === "high" ? "高优先级" : goal.priority === "medium" ? "中优先级" : "低优先级"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{goal.estimatedTime}小时</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{goal.skills.length}个技能点</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {goal.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {goal.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{goal.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedGoals.includes(goal.id) ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}
                    >
                      {selectedGoals.includes(goal.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-sm"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="generation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  路径生成过程
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isGenerating ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <motion.div
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Brain className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-lg font-medium mb-2">AI正在生成学习路径...</h3>
                      <p className="text-sm text-muted-foreground">
                        {generationStep === 0 && "分析用户画像和学习目标"}
                        {generationStep === 1 && "构建知识依赖图谱"}
                        {generationStep === 2 && "应用个性化推荐算法"}
                        {generationStep === 3 && "优化学习路径序列"}
                        {generationStep === 4 && "生成详细学习计划"}
                      </p>
                    </div>

                    <Progress value={(generationStep + 1) * 20} className="h-2" />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">准备生成学习路径</h3>
                    <p className="text-sm text-muted-foreground mb-4">请先选择学习目标，然后点击"生成路径"按钮</p>
                    <Button onClick={generateLearningPath} disabled={selectedGoals.length === 0}>
                      <Zap className="w-4 h-4 mr-2" />
                      开始生成
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {generatedPaths.length > 0 ? (
              generatedPaths.map((path) => (
                <Card key={path.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          {path.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{path.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          导出
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          分享
                        </Button>
                        <Button size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          开始学习
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 路径统计 */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{path.nodes.length}</div>
                        <div className="text-xs text-muted-foreground">学习节点</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{path.totalTime}h</div>
                        <div className="text-xs text-muted-foreground">预计时长</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {(path.metadata.confidence * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">推荐置信度</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {(path.metadata.personalization * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">个性化程度</div>
                      </div>
                    </div>

                    {/* 算法信息 */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">生成算法信息</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">算法:</span>
                          <span className="ml-2 text-blue-900">{path.metadata.algorithm}</span>
                        </div>
                        <div>
                          <span className="text-blue-700">适应性:</span>
                          <span className="ml-2 text-blue-900">{(path.metadata.adaptability * 100).toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-blue-700">难度:</span>
                          <span className="ml-2 text-blue-900">{path.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    {/* 学习节点预览 */}
                    <div>
                      <h4 className="font-medium mb-3">学习路径预览</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {path.nodes.slice(0, 5).map((node, index) => (
                          <div key={node.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                            <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{node.title}</div>
                              <div className="text-xs text-muted-foreground">{node.description}</div>
                            </div>
                            <div className="text-xs text-muted-foreground">{node.estimatedTime}min</div>
                            <Badge variant="outline" className="text-xs">
                              {node.type === "concept"
                                ? "概念"
                                : node.type === "practice"
                                  ? "练习"
                                  : node.type === "project"
                                    ? "项目"
                                    : "评估"}
                            </Badge>
                          </div>
                        ))}
                        {path.nodes.length > 5 && (
                          <div className="text-center text-sm text-muted-foreground py-2">
                            还有 {path.nodes.length - 5} 个学习节点...
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">暂无生成结果</h3>
                  <p className="text-sm text-muted-foreground">请先配置学习目标并生成路径</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

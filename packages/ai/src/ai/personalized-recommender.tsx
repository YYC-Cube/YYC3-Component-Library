"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Target, TrendingUp, Users, Lightbulb, Star } from "lucide-react"

interface UserProfile {
  id: string
  name: string
  role: string
  skillLevel: number
  interests: string[]
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading"
  completedCourses: number
  currentGoals: string[]
}

interface Recommendation {
  id: string
  type: "course" | "skill" | "project" | "resource"
  title: string
  description: string
  relevanceScore: number
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: string
  tags: string[]
  reason: string
}

export function PersonalizedRecommender() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "user-001",
    name: "张三",
    role: "数据分析师",
    skillLevel: 75,
    interests: ["数据可视化", "机器学习", "Python", "统计分析"],
    learningStyle: "visual",
    completedCourses: 12,
    currentGoals: ["掌握高级可视化技术", "学习深度学习", "提升数据洞察能力"],
  })

  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // 模拟AI推荐算法
  const generateRecommendations = async () => {
    setIsGenerating(true)

    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockRecommendations: Recommendation[] = [
      {
        id: "rec-001",
        type: "course",
        title: "高级数据可视化技术",
        description: "学习使用D3.js和Three.js创建交互式3D可视化",
        relevanceScore: 95,
        difficulty: "advanced",
        estimatedTime: "6周",
        tags: ["D3.js", "Three.js", "交互式可视化"],
        reason: "基于您的可视化兴趣和当前技能水平推荐",
      },
      {
        id: "rec-002",
        type: "project",
        title: "智能仪表板项目",
        description: "构建一个实时数据监控仪表板，集成AI预测功能",
        relevanceScore: 88,
        difficulty: "intermediate",
        estimatedTime: "4周",
        tags: ["React", "实时数据", "AI集成"],
        reason: "符合您的数据分析师角色和实践需求",
      },
      {
        id: "rec-003",
        type: "skill",
        title: "深度学习基础",
        description: "从神经网络基础到深度学习框架的完整学习路径",
        relevanceScore: 82,
        difficulty: "intermediate",
        estimatedTime: "8周",
        tags: ["TensorFlow", "PyTorch", "神经网络"],
        reason: "与您的学习目标'学习深度学习'高度匹配",
      },
      {
        id: "rec-004",
        type: "resource",
        title: "数据洞察分析工具包",
        description: "包含统计分析、异常检测和趋势预测的工具集合",
        relevanceScore: 90,
        difficulty: "intermediate",
        estimatedTime: "2周",
        tags: ["统计分析", "异常检测", "趋势预测"],
        reason: "直接支持您的'提升数据洞察能力'目标",
      },
    ]

    setRecommendations(mockRecommendations)
    setIsGenerating(false)
  }

  useEffect(() => {
    generateRecommendations()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course":
        return <Brain className="h-4 w-4" />
      case "skill":
        return <Target className="h-4 w-4" />
      case "project":
        return <TrendingUp className="h-4 w-4" />
      case "resource":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* 用户画像 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>个人学习画像</span>
          </CardTitle>
          <CardDescription>基于您的学习历史和偏好生成的个性化画像</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">技能水平</div>
              <Progress value={userProfile.skillLevel} className="h-2" />
              <div className="text-xs text-muted-foreground">{userProfile.skillLevel}%</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">学习风格</div>
              <Badge variant="secondary">
                {userProfile.learningStyle === "visual" ? "视觉型" : userProfile.learningStyle}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">完成课程</div>
              <div className="text-2xl font-bold">{userProfile.completedCourses}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">当前目标</div>
              <div className="text-xs text-muted-foreground">{userProfile.currentGoals.length} 个目标</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">兴趣标签</div>
            <div className="flex flex-wrap gap-2">
              {userProfile.interests.map((interest, index) => (
                <Badge key={index} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI推荐 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI个性化推荐</span>
              </CardTitle>
              <CardDescription>基于您的学习画像和目标智能推荐</CardDescription>
            </div>
            <Button onClick={generateRecommendations} disabled={isGenerating}>
              {isGenerating ? "生成中..." : "刷新推荐"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(rec.type)}
                        <CardTitle className="text-base">{rec.title}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-primary">{rec.relevanceScore}%</div>
                        <div className={`w-2 h-2 rounded-full ${getDifficultyColor(rec.difficulty)}`}></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {rec.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>预计时间: {rec.estimatedTime}</span>
                      <span>
                        难度:{" "}
                        {rec.difficulty === "beginner" ? "初级" : rec.difficulty === "intermediate" ? "中级" : "高级"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3 p-2 bg-muted/50 rounded">
                      <strong>推荐理由:</strong> {rec.reason}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        开始学习
                      </Button>
                      <Button size="sm" variant="outline">
                        收藏
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

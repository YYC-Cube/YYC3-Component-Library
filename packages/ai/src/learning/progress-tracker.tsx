"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Award, Target, Clock, CheckCircle } from "lucide-react"

interface LearningProgress {
  id: string
  title: string
  category: string
  progress: number
  totalLessons: number
  completedLessons: number
  estimatedTime: string
  difficulty: "beginner" | "intermediate" | "advanced"
  skills: string[]
}

export default function ProgressTracker() {
  const [progressData, setProgressData] = useState<LearningProgress[]>([
    {
      id: "1",
      title: "数据可视化基础",
      category: "基础技能",
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      estimatedTime: "2小时",
      difficulty: "beginner",
      skills: ["图表类型", "数据清洗", "基础统计"],
    },
    {
      id: "2",
      title: "AI辅助分析",
      category: "高级技能",
      progress: 45,
      totalLessons: 8,
      completedLessons: 4,
      estimatedTime: "3小时",
      difficulty: "advanced",
      skills: ["机器学习", "预测分析", "异常检测"],
    },
    {
      id: "3",
      title: "交互式仪表板",
      category: "实战项目",
      progress: 30,
      totalLessons: 15,
      completedLessons: 5,
      estimatedTime: "5小时",
      difficulty: "intermediate",
      skills: ["React组件", "实时数据", "用户交互"],
    },
  ])

  const [overallStats, setOverallStats] = useState({
    totalHours: 24,
    completedCourses: 3,
    skillsAcquired: 12,
    currentStreak: 7,
  })

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
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">学习时长</p>
                <p className="text-2xl font-bold text-blue-600">{overallStats.totalHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">完成课程</p>
                <p className="text-2xl font-bold text-green-600">{overallStats.completedCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">掌握技能</p>
                <p className="text-2xl font-bold text-purple-600">{overallStats.skillsAcquired}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">连续天数</p>
                <p className="text-2xl font-bold text-orange-600">{overallStats.currentStreak}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          学习进度
        </h3>

        {progressData.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.category}</CardDescription>
                </div>
                <Badge className={getDifficultyColor(item.difficulty)}>{item.difficulty}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    进度: {item.completedLessons}/{item.totalLessons} 课程
                  </span>
                  <span>{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>

              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  剩余 {item.estimatedTime}
                </span>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  继续学习
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

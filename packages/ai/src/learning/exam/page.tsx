"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveLayout } from "@/components/responsive-layout"
import { Brain, Layers, Target, Trophy, Clock, FileText } from "lucide-react"

export default function ExamPage() {
  // AI大模型分类专项考试
  const classificationExamTypes = [
    {
      type: "model-architecture",
      title: "模型架构分类专项",
      description: "语言模型、视觉模型、多模态模型分类",
      duration: 90,
      questions: 15,
      points: 75,
      icon: Brain,
      color: "from-blue-500 to-blue-600",
    },
    {
      type: "training-methods",
      title: "训练方式分类专项",
      description: "有监督、无监督、预训练+微调等方式",
      duration: 80,
      questions: 12,
      points: 60,
      icon: Layers,
      color: "from-green-500 to-green-600",
    },
    {
      type: "application-scenarios",
      title: "应用场景分类专项",
      description: "文本生成、图像生成、对话系统等应用",
      duration: 70,
      questions: 10,
      points: 50,
      icon: Target,
      color: "from-purple-500 to-purple-600",
    },
    {
      type: "comprehensive-classification",
      title: "AI大模型分类综合测试",
      description: "全面考查AI大模型分类体系知识",
      duration: 120,
      questions: 25,
      points: 125,
      icon: Trophy,
      color: "from-orange-500 to-orange-600",
    },
  ]

  // 原有考试类型
  const originalExamTypes = [
    {
      type: "gpt-basics",
      title: "GPT基础概念测试",
      description: "测试您对GPT模型基础概念的理解",
      difficulty: "初级",
      duration: 20,
      questions: 15,
      points: 100,
      category: "理论基础",
    },
    {
      type: "prompt-engineering",
      title: "Prompt工程实战",
      description: "评估您的提示词设计和优化能力",
      difficulty: "中级",
      duration: 30,
      questions: 20,
      points: 150,
      category: "Prompt工程",
    },
    {
      type: "ai-development",
      title: "AI应用开发综合测试",
      description: "全面测试AI应用开发的各个方面",
      difficulty: "高级",
      duration: 45,
      questions: 25,
      points: 200,
      category: "开发实战",
    },
  ]

  return (
    <ResponsiveLayout
      title="专业考试"
      user={{ name: "张同学", avatar: "/placeholder.svg?height=40&width=40", level: "中级工程师" }}
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">生成式AI应用工程师专业考试</h1>
        <p className="text-gray-600">通过专业考试，验证您的AI技能水平，获得权威认证</p>
      </div>

      <Tabs defaultValue="original" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="original">现有考试</TabsTrigger>
          <TabsTrigger value="classification">AI大模型分类</TabsTrigger>
        </TabsList>

        {/* 现有考试 */}
        <TabsContent value="original" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">现有考试类型</h2>
            <p className="text-gray-600">选择适合您当前水平的考试类型</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {originalExamTypes.map((exam) => (
              <Card
                key={exam.type}
                className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2"
                    style={{
                      backgroundColor:
                        exam.difficulty === "初级" ? "#e2f8f0" : exam.difficulty === "中级" ? "#e6f0fd" : "#fef1f7",
                      color:
                        exam.difficulty === "初级" ? "#0d9488" : exam.difficulty === "中级" ? "#3b82f6" : "#db2777",
                    }}
                  >
                    {exam.difficulty}
                  </div>
                  <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">{exam.title}</CardTitle>
                  <CardDescription>{exam.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                      <Clock className="h-4 w-4 text-gray-600 mb-1" />
                      <span className="font-medium">{exam.duration}分钟</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                      <FileText className="h-4 w-4 text-gray-600 mb-1" />
                      <span className="font-medium">{exam.questions}题</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                      <Trophy className="h-4 w-4 text-gray-600 mb-1" />
                      <span className="font-medium">{exam.points}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">分类：{exam.category}</div>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">开始测试</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI大模型分类专项考试 */}
        <TabsContent value="classification" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">AI大模型分类专项测试</h2>
            <p className="text-gray-600">全面考查AI大模型的分类体系和技术特点，涵盖模型架构、训练方式、应用场景等</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {classificationExamTypes.map((exam) => {
              const Icon = exam.icon
              return (
                <Card
                  key={exam.type}
                  className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`mx-auto w-14 h-14 rounded-full bg-gradient-to-r ${exam.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                      {exam.title}
                    </CardTitle>
                    <CardDescription className="text-sm">{exam.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 text-gray-600 mr-1" />
                          时长
                        </span>
                        <span className="font-medium">{exam.duration}分钟</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="flex items-center">
                          <FileText className="h-3 w-3 text-gray-600 mr-1" />
                          题数
                        </span>
                        <span className="font-medium">{exam.questions}题</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="flex items-center">
                          <Trophy className="h-3 w-3 text-gray-600 mr-1" />
                          总分
                        </span>
                        <span className="font-medium">{exam.points}分</span>
                      </div>
                    </div>
                    <Button
                      className={`w-full bg-gradient-to-r ${exam.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all text-sm`}
                    >
                      开始测试
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* AI大模型分类考试说明 */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI大模型分类考试说明
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">考试内容</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 模型架构分类：语言模型、视觉模型、多模态模型</li>
                    <li>• 训练方式分类：有监督、无监督、预训练+微调</li>
                    <li>• 应用场景分类：文本生成、图像生成、对话系统</li>
                    <li>• 规模大小分类：小型、中型、大型模型特点</li>
                    <li>• 开源状态分类：开源与闭源模型对比</li>
                    <li>• 技术发展阶段：三代AI模型演进历程</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">题型特点</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 单选题：基础概念和技术特点识别</li>
                    <li>• 多选题：综合知识点和应用场景</li>
                    <li>• 名词解释：核心概念深度理解</li>
                    <li>• 对比分析：不同技术路线的异同</li>
                    <li>• 应用分析：实际场景中的技术选择</li>
                    <li>• 综合论述：技术发展趋势分析</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ResponsiveLayout>
  )
}

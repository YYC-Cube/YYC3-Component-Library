"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, Clock, Users, Star, Play, Brain } from "lucide-react"
import Link from "next/link"
import { ResponsiveLayout } from "@/components/responsive-layout"

const hideScrollbarStyle = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")

  const categories = ["全部", "基础理论", "Prompt工程", "模型应用", "开发实战", "高级进阶"]

  const courses = [
    {
      id: 1,
      title: "GPT模型基础与应用",
      description: "从零开始学习大语言模型的基本原理，掌握GPT系列模型的核心概念和实际应用场景",
      instructor: "李教授",
      duration: "8小时",
      students: 1234,
      rating: 4.8,
      level: "初级",
      category: "基础理论",
      progress: 75,
      chapters: 12,
      price: "免费",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["GPT", "基础", "理论"],
    },
    {
      id: 2,
      title: "Prompt Engineering实战指南",
      description: "深入学习提示词工程的核心技巧，掌握如何设计高效的提示词来优化AI模型输出",
      instructor: "王工程师",
      duration: "12小时",
      students: 856,
      rating: 4.9,
      level: "中级",
      category: "Prompt工程",
      progress: 45,
      chapters: 15,
      price: "¥299",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Prompt", "实战", "优化"],
    },
    {
      id: 3,
      title: "AI应用开发框架详解",
      description: "学习主流AI应用开发框架，包括LangChain、LlamaIndex等工具的使用和最佳实践",
      instructor: "张架构师",
      duration: "16小时",
      students: 642,
      rating: 4.7,
      level: "高级",
      category: "开发实战",
      progress: 20,
      chapters: 18,
      price: "¥499",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["框架", "开发", "LangChain"],
    },
    {
      id: 4,
      title: "多模态AI模型应用",
      description: "探索文本、图像、音频等多模态AI模型的应用，学习如何构建综合性AI解决方案",
      instructor: "陈博士",
      duration: "10小时",
      students: 423,
      rating: 4.6,
      level: "中级",
      category: "模型应用",
      progress: 0,
      chapters: 14,
      price: "¥399",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["多模态", "图像", "音频"],
    },
    {
      id: 5,
      title: "AI伦理与安全实践",
      description: "了解AI开发中的伦理考量和安全实践，学习如何构建负责任的AI应用",
      instructor: "刘专家",
      duration: "6小时",
      students: 789,
      rating: 4.5,
      level: "初级",
      category: "高级进阶",
      progress: 0,
      chapters: 8,
      price: "免费",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["伦理", "安全", "实践"],
    },
    {
      id: 6,
      title: "企业级AI解决方案设计",
      description: "学习如何为企业设计和实施AI解决方案，包括需求分析、架构设计和部署策略",
      instructor: "赵总监",
      duration: "20小时",
      students: 312,
      rating: 4.9,
      level: "高级",
      category: "高级进阶",
      progress: 0,
      chapters: 22,
      price: "¥799",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["企业级", "解决方案", "架构"],
    },
    {
      id: 7,
      title: "生成式人工智能应用工程师（高级认证）",
      description: "基于百度智能云课程体系的专业AI工程师认证培训，涵盖提示词工程、数据安全、团队管理等核心技能",
      instructor: "百度智能云",
      duration: "30小时",
      students: 2156,
      rating: 4.9,
      level: "高级",
      category: "高级进阶",
      progress: 0,
      chapters: 9,
      price: "¥1299",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["认证", "提示词工程", "企业级"],
    },
  ]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "全部" || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case "初级":
        return "bg-green-100 text-green-800"
      case "中级":
        return "bg-yellow-100 text-yellow-800"
      case "高级":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ResponsiveLayout
      title="课程中心"
      user={{ name: "张同学", avatar: "/placeholder.svg?height=40&width=40", level: "中级工程师" }}
    >
      <style jsx global>{`
        ${hideScrollbarStyle}
      `}</style>
      {/* 页面标题 */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">课程中心</h1>
        <p className="text-gray-600">探索丰富的AI课程，提升您的专业技能</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="搜索课程、讲师或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>高级筛选</span>
          </Button>
        </div>

        {/* 分类标签 - 使其可滚动 */}
        <div className="flex overflow-x-auto pb-2 hide-scrollbar gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`${
                selectedCategory === category ? "bg-indigo-600 text-white" : "hover:bg-indigo-50"
              } transition-all duration-300 whitespace-nowrap`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* 课程网格 - 调整为移动端友好的布局 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
          >
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  {course.price}
                </Badge>
              </div>
              {course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>学习进度</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="mt-1" />
                </div>
              )}
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors line-clamp-2">
                {course.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration}
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {course.students}
                </span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  {course.rating}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">讲师：{course.instructor}</span>
                <span className="text-sm text-gray-600">{course.chapters}章节</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {course.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href={course.id === 7 ? "/courses/ai-engineer" : `/courses/${course.id}`}>
                  <Play className="h-4 w-4 mr-2" />
                  {course.progress > 0 ? "继续学习" : "开始学习"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关课程</h3>
          <p className="text-gray-600">请尝试调整搜索条件或浏览其他分类</p>
        </div>
      )}
    </ResponsiveLayout>
  )
}

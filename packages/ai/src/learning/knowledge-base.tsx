"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen, Video, FileText, ExternalLink, Star } from "lucide-react"

interface KnowledgeItem {
  id: string
  title: string
  type: "article" | "video" | "tutorial" | "reference"
  category: string
  description: string
  tags: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  rating: number
  readTime?: string
  duration?: string
  url?: string
}

export default function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const knowledgeItems: KnowledgeItem[] = [
    {
      id: "1",
      title: "数据可视化设计原则",
      type: "article",
      category: "设计理论",
      description: "深入了解有效数据可视化的核心设计原则，包括颜色理论、布局设计和用户体验。",
      tags: ["设计", "颜色理论", "UX"],
      difficulty: "beginner",
      rating: 4.8,
      readTime: "15分钟",
    },
    {
      id: "2",
      title: "React图表组件开发实战",
      type: "video",
      category: "技术实现",
      description: "从零开始构建可复用的React图表组件，涵盖D3.js集成和性能优化技巧。",
      tags: ["React", "D3.js", "组件开发"],
      difficulty: "intermediate",
      rating: 4.9,
      duration: "45分钟",
    },
    {
      id: "3",
      title: "AI驱动的数据洞察生成",
      type: "tutorial",
      category: "AI应用",
      description: "学习如何使用机器学习算法自动发现数据中的模式和异常，生成智能洞察。",
      tags: ["机器学习", "异常检测", "自动化"],
      difficulty: "advanced",
      rating: 4.7,
      readTime: "30分钟",
    },
    {
      id: "4",
      title: "Echarts API参考手册",
      type: "reference",
      category: "技术文档",
      description: "完整的Echarts配置选项和API文档，包含所有图表类型的详细参数说明。",
      tags: ["Echarts", "API", "参考文档"],
      difficulty: "intermediate",
      rating: 4.6,
      url: "https://echarts.apache.org/zh/api.html",
    },
    {
      id: "5",
      title: "大屏数据可视化最佳实践",
      type: "article",
      category: "实战案例",
      description: "企业级数据大屏设计与实现的完整指南，包含布局设计、性能优化和实时数据处理。",
      tags: ["大屏设计", "实时数据", "性能优化"],
      difficulty: "advanced",
      rating: 4.9,
      readTime: "25分钟",
    },
  ]

  const categories = [
    { id: "all", name: "全部" },
    { id: "设计理论", name: "设计理论" },
    { id: "技术实现", name: "技术实现" },
    { id: "AI应用", name: "AI应用" },
    { id: "技术文档", name: "技术文档" },
    { id: "实战案例", name: "实战案例" },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "tutorial":
        return <BookOpen className="h-4 w-4" />
      case "reference":
        return <ExternalLink className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
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

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索知识库..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Knowledge Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getTypeIcon(item.type)}
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <Badge className={getDifficultyColor(item.difficulty)}>{item.difficulty}</Badge>
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {item.rating}
                  </div>
                  {item.readTime && <span>{item.readTime}</span>}
                  {item.duration && <span>{item.duration}</span>}
                </div>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  {item.url ? "访问" : "阅读"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">未找到相关内容</h3>
          <p className="text-gray-500">尝试调整搜索关键词或筛选条件</p>
        </div>
      )}
    </div>
  )
}

/**
 * @file 学习公园组件
 * @description 提供员工学习资源和课程管理功能，包括课程 catalog、学习路径、进度跟踪等
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Input } from "@yyc3/ui/input"
import { Button } from "@yyc3/ui/button"
import { ScrollArea } from "@yyc3/ui/scroll-area"
import { Badge } from "@yyc3/ui/badge"
import { Progress } from "@yyc3/ui/progress"
import { Search, BookOpen, Video, FileText, Users, Play } from "lucide-react"

// 模拟数据
const courses = [
  { id: 1, title: "新员工入职培训", type: "必修", format: "视频", duration: "2小时", progress: 0 },
  { id: 2, title: "高级销售技巧", type: "选修", format: "在线课程", duration: "4小时", progress: 60 },
  { id: 3, title: "项目管理基础", type: "必修", format: "文档", duration: "1小时", progress: 100 },
  { id: 4, title: "客户服务excellence", type: "选修", format: "视频", duration: "3小时", progress: 30 },
]

const learningPaths = [
  { id: 1, name: "销售精英成长路径", courses: 5, completionRate: 40 },
  { id: 2, name: "管理者领导力提升", courses: 7, completionRate: 20 },
  { id: 3, name: "技术专家进阶之路", courses: 6, completionRate: 60 },
]

export function LearningPark() {
  const [activeTab, setActiveTab] = useState("courses")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "视频":
        return <Video className="h-4 w-4" />
      case "在线课程":
        return <BookOpen className="h-4 w-4" />
      case "文档":
        return <FileText className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <Card className="bg-tech-blue-800 text-tech-blue-100">
      <CardHeader>
        <CardTitle>学习乐园</CardTitle>
        <CardDescription>提升技能，拓展知识，成就未来</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="courses">课程中心</TabsTrigger>
            <TabsTrigger value="paths">学习路径</TabsTrigger>
          </TabsList>
          <div className="mt-4 flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索课程..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-tech-blue-700 text-tech-blue-100 border-tech-blue-600"
              />
            </div>
            <Button className="bg-tech-blue-600 hover:bg-tech-blue-500">
              <BookOpen className="mr-2 h-4 w-4" /> 我的学习
            </Button>
          </div>
          <TabsContent value="courses" className="mt-4">
            <ScrollArea className="h-[400px]">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="mb-4 bg-tech-blue-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <div className="flex items-center mt-2">
                          <Badge variant="outline" className="mr-2">
                            {course.type}
                          </Badge>
                          <div className="flex items-center text-sm text-tech-blue-300">
                            {getFormatIcon(course.format)}
                            <span className="ml-1">{course.format}</span>
                          </div>
                          <span className="ml-2 text-sm text-tech-blue-300">{course.duration}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    <Progress value={course.progress} className="mt-4" />
                    <div className="text-right mt-1 text-sm text-tech-blue-300">{course.progress}% 完成</div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="paths" className="mt-4">
            <ScrollArea className="h-[400px]">
              {learningPaths.map((path) => (
                <Card key={path.id} className="mb-4 bg-tech-blue-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{path.name}</h3>
                        <div className="flex items-center mt-2 text-sm text-tech-blue-300">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{path.courses} 门课程</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        查看详情
                      </Button>
                    </div>
                    <Progress value={path.completionRate} className="mt-4" />
                    <div className="text-right mt-1 text-sm text-tech-blue-300">{path.completionRate}% 完成</div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
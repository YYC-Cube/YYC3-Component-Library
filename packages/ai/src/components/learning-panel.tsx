import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, GraduationCap, Lightbulb, Users } from "lucide-react"

export default function LearningPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              课程学习
            </CardTitle>
            <CardDescription>分层课程体系，从入门到精通</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <RocketIcon className="mr-2 h-4 w-4" />
                  新手入门
                </Button>
                <Button variant="outline" className="justify-start">
                  <TrophyIcon className="mr-2 h-4 w-4" />
                  进阶提升
                </Button>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <GraduationCap className="mr-2 h-4 w-4" />
                行业专精
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">浏览课程</Button>
          </CardFooter>
        </Card>

        <Card className="card-hover glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              AI导师
            </CardTitle>
            <CardDescription>个性化学习路径与实时答疑</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <Brain className="mr-2 h-4 w-4" />
                  能力评估
                </Button>
                <Button variant="outline" className="justify-start">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  实时答疑
                </Button>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <RouteIcon className="mr-2 h-4 w-4" />
                学习路径
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">开始对话</Button>
          </CardFooter>
        </Card>

        <Card className="card-hover glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              学习社区
            </CardTitle>
            <CardDescription>案例共享、互评与专家直播</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  案例分享
                </Button>
                <Button variant="outline" className="justify-start">
                  <VideoIcon className="mr-2 h-4 w-4" />
                  专家直播
                </Button>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircleIcon className="mr-2 h-4 w-4" />
                讨论区
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">加入社区</Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="card-hover glass-card">
        <CardHeader>
          <CardTitle>我的学习进度</CardTitle>
          <CardDescription>个人学习路径与技能成长追踪</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">AI工具高阶应用</h3>
                <Badge variant="outline">进行中</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>完成度</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Prompt工程基础</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">多模态内容生成</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">高级提示词技巧</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">电商营销特训</h3>
                <Badge variant="outline">即将开始</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>完成度</span>
                  <span>0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-sm">爆款文案策略</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-sm">转化率优化</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-sm">多平台运营</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">推荐课程</h3>
              <Button variant="link" size="sm" className="h-auto p-0">
                查看全部
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="card-hover glass-card">
                <CardContent className="p-4 flex gap-3">
                  <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Prompt高级工程实战</h4>
                    <p className="text-xs text-gray-500 mt-1">掌握AI提示词高级技巧，提升内容生成质量</p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        热门
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-hover glass-card">
                <CardContent className="p-4 flex gap-3">
                  <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <TrendingUpIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">数据分析与决策</h4>
                    <p className="text-xs text-gray-500 mt-1">学习如何利用数据分析优化内容策略</p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        推荐
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RocketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function RouteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  )
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}

function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  )
}

function MessageCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

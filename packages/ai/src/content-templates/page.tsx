import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Video, ShoppingBag, MessageSquare, Copy, ArrowRight } from "lucide-react"
import Link from "next/link"
import PageBackground from "../components/page-background"
import DashboardHeader from "../components/dashboard-header"

// 模板分类
const templateCategories = [
  { id: "article", name: "文章模板", icon: FileText },
  { id: "video", name: "视频脚本", icon: Video },
  { id: "ecommerce", name: "电商文案", icon: ShoppingBag },
  { id: "social", name: "社交媒体", icon: MessageSquare },
]

// 模板数据
const templates = [
  {
    id: "xiaohongshu-review",
    category: "social",
    title: "小红书测评模板",
    description: "产品开箱测评，包含个人体验、优缺点分析和推荐理由",
    tags: ["小红书", "测评", "种草"],
    popularity: "热门",
    structure: "标题+开篇吸引+个人体验+优点详述+缺点说明+总结推荐",
  },
  {
    id: "wechat-article",
    category: "article",
    title: "微信公众号文章",
    description: "专业知识分享类文章，包含理论讲解、案例分析和实践指导",
    tags: ["公众号", "知识分享", "专业"],
    popularity: "热门",
    structure: "标题+导语+主题内容(分段)+案例说明+总结观点+互动提问",
  },
  {
    id: "douyin-script",
    category: "video",
    title: "抖音短视频脚本",
    description: "15-60秒短视频脚本，包含开场吸引、内容转场和结尾号召",
    tags: ["抖音", "短视频", "脚本"],
    popularity: "热门",
    structure: "开场吸引+内容转场+核心信息+互动引导+结尾号召",
  },
  {
    id: "taobao-description",
    category: "ecommerce",
    title: "淘宝商品详情",
    description: "电商产品详情页，包含产品卖点、参数、场景和常见问答",
    tags: ["淘宝", "详情页", "电商"],
    popularity: "热门",
    structure: "产品标题+核心卖点+产品参数+使用场景+购买理由+常见问答",
  },
  {
    id: "zhihu-answer",
    category: "social",
    title: "知乎回答模板",
    description: "专业知识问答模板，包含观点陈述、论据支持和实践建议",
    tags: ["知乎", "问答", "专业"],
    popularity: "推荐",
    structure: "开篇观点+理论支持+案例分析+实践建议+总结观点",
  },
  {
    id: "bilibili-script",
    category: "video",
    title: "B站视频脚本",
    description: "3-10分钟视频脚本，包含开场白、内容讲解和互动环节",
    tags: ["B站", "视频", "教程"],
    popularity: "新增",
    structure: "开场问候+内容概述+分段讲解+互动设计+结尾总结",
  },
  {
    id: "jd-description",
    category: "ecommerce",
    title: "京东商品详情",
    description: "电商产品详情页，侧重产品参数和售后服务",
    tags: ["京东", "详情页", "电商"],
    popularity: "推荐",
    structure: "产品标题+规格参数+产品特色+售后服务+购买指南",
  },
  {
    id: "blog-post",
    category: "article",
    title: "博客文章模板",
    description: "个人博客文章，包含个人观点、经验分享和实用建议",
    tags: ["博客", "文章", "分享"],
    popularity: "经典",
    structure: "标题+引言+主体内容+个人经验+总结建议",
  },
]

export default function ContentTemplatesPage() {
  return (
    <PageBackground image="/images/bg-tech-city.jpeg">
      <DashboardHeader />

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">内容模板库</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">浏览和使用预设的内容模板，快速开始您的创作</p>
          </div>

          <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
            <Tabs defaultValue="article">
              <TabsList className="mb-6">
                {templateCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {templateCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates
                      .filter((template) => template.category === category.id)
                      .map((template) => (
                        <Card key={template.id} className="card-hover glass-card">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{template.title}</CardTitle>
                              <Badge
                                variant={
                                  template.popularity === "热门"
                                    ? "default"
                                    : template.popularity === "推荐"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {template.popularity}
                              </Badge>
                            </div>
                            <CardDescription>{template.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">结构</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{template.structure}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {template.tags.map((tag) => (
                                  <Badge key={tag} variant="outline">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4 mr-2" />
                              复制结构
                            </Button>
                            <Button size="sm" asChild>
                              <Link href={`/content-creation?template=${template.id}`}>
                                使用模板
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </main>
    </PageBackground>
  )
}

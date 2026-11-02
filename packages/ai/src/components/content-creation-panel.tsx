import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileText, ImageIcon, MessageSquarePlus, Sparkles, Video } from "lucide-react"

export default function ContentCreationPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              文章创作
            </CardTitle>
            <CardDescription>生成高质量文章、产品描述和营销文案</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  小红书种草
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageSquarePlus className="mr-2 h-4 w-4" />
                  微信公众号
                </Button>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                电商详情页
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/content-creation">
                <Sparkles className="mr-2 h-4 w-4" />
                开始创作
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-500" />
              视频脚本
            </CardTitle>
            <CardDescription>生成短视频脚本、直播话术和解说词</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <Video className="mr-2 h-4 w-4" />
                  抖音短视频
                </Button>
                <Button variant="outline" className="justify-start">
                  <Video className="mr-2 h-4 w-4" />
                  直播带货
                </Button>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <Video className="mr-2 h-4 w-4" />
                产品演示
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/content-creation">
                <Sparkles className="mr-2 h-4 w-4" />
                开始创作
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              创意激发
            </CardTitle>
            <CardDescription>获取创作灵感、热点话题和内容框架</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <TrendingUpIcon className="mr-2 h-4 w-4" />
                  热点话题
                </Button>
                <Button variant="outline" className="justify-start">
                  <LayoutIcon className="mr-2 h-4 w-4" />
                  内容框架
                </Button>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <BulbIcon className="mr-2 h-4 w-4" />
                创意头脑风暴
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/content-creation">
                <Sparkles className="mr-2 h-4 w-4" />
                开始探索
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="card-hover glass-card">
        <CardHeader>
          <CardTitle>智能内容生成</CardTitle>
          <CardDescription>输入关键信息，AI将为您生成高质量内容</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">内容类型</label>
                <Select defaultValue="xiaohongshu">
                  <SelectTrigger>
                    <SelectValue placeholder="选择内容类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xiaohongshu">小红书种草文</SelectItem>
                    <SelectItem value="wechat">微信公众号文章</SelectItem>
                    <SelectItem value="taobao">淘宝商品描述</SelectItem>
                    <SelectItem value="douyin">抖音短视频脚本</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">内容风格</label>
                <Select defaultValue="casual">
                  <SelectTrigger>
                    <SelectValue placeholder="选择内容风格" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">轻松活泼</SelectItem>
                    <SelectItem value="professional">专业权威</SelectItem>
                    <SelectItem value="emotional">情感共鸣</SelectItem>
                    <SelectItem value="humorous">幽默风趣</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">关键信息</label>
              <Textarea placeholder="请输入产品信息、目标受众、核心卖点等关键信息..." className="min-h-[120px]" />
            </div>
            <div className="flex justify-end">
              <Button asChild>
                <Link href="/content-creation">
                  <Sparkles className="mr-2 h-4 w-4" />
                  生成内容
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
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
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function LayoutIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <line x1="9" x2="9" y1="21" y2="9" />
    </svg>
  )
}

function BulbIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Textarea } from "@yyc3/ui-enterprise/textarea"
import { RadioGroup, RadioGroupItem } from "@yyc3/ui-enterprise/radio-group"
import { Label } from "@yyc3/ui-enterprise/label"
import { Input } from "@yyc3/ui-enterprise/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@yyc3/ui-enterprise/dialog"
import { Alert, AlertDescription, AlertTitle } from "@yyc3/ui-enterprise/alert"
import { MessageSquare, ThumbsUp, ThumbsDown, Send, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@yyc3/lib/utils"

interface FeedbackCollectorProps {
  onSubmit?: (feedback: {
    type: string
    rating: number
    comment: string
    email?: string
    category?: string
  }) => Promise<void>
  className?: string
  categories?: string[]
  title?: string
  description?: string
  compact?: boolean
}

export function FeedbackCollector({
  onSubmit,
  className,
  categories = ["界面设计", "功能体验", "性能问题", "错误反馈", "功能建议", "其他"],
  title = "用户反馈",
  description = "您的反馈对我们非常重要，帮助我们改进产品",
  compact = false,
}: FeedbackCollectorProps) {
  const [feedbackType, setFeedbackType] = useState<string>("rating")
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  // 处理提交
  const handleSubmit = async () => {
    if (feedbackType === "rating" && rating === 0) {
      setError("请选择评分")
      return
    }

    if (comment.trim() === "") {
      setError("请输入反馈内容")
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit?.({
        type: feedbackType,
        rating,
        comment,
        email: email || undefined,
        category: category || undefined,
      })

      setIsSuccess(true)

      // 重置表单
      setTimeout(() => {
        setRating(0)
        setComment("")
        setEmail("")
        setCategory("")
        setIsSuccess(false)

        if (compact) {
          setIsDialogOpen(false)
        }
      }, 3000)
    } catch (err) {
      setError("提交反馈失败，请稍后重试")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 评分组件
  const RatingComponent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>您对我们的产品满意吗？</Label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={rating === 1 ? "default" : "outline"}
            className={cn("flex-1 flex flex-col items-center gap-2 h-auto py-4", rating === 1 && "border-primary")}
            onClick={() => setRating(1)}
          >
            <ThumbsDown className="h-6 w-6" />
            <span>不满意</span>
          </Button>
          <Button
            type="button"
            variant={rating === 2 ? "default" : "outline"}
            className={cn("flex-1 flex flex-col items-center gap-2 h-auto py-4", rating === 2 && "border-primary")}
            onClick={() => setRating(2)}
          >
            <ThumbsUp className="h-6 w-6" />
            <span>满意</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">您的反馈</Label>
        <Textarea
          id="comment"
          placeholder="请告诉我们您的想法..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">电子邮箱（可选）</Label>
        <Input
          id="email"
          type="email"
          placeholder="您的电子邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">如果您希望我们回复您的反馈，请留下您的电子邮箱</p>
      </div>
    </div>
  )

  // 详细反馈组件
  const DetailedFeedbackComponent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">反馈类别</Label>
        <RadioGroup value={category} onValueChange={setCategory} className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <RadioGroupItem value={cat} id={`category-${cat}`} />
              <Label htmlFor={`category-${cat}`}>{cat}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="detailed-comment">详细描述</Label>
        <Textarea
          id="detailed-comment"
          placeholder="请详细描述您的问题或建议..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[150px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="detailed-email">联系方式</Label>
        <Input
          id="detailed-email"
          type="email"
          placeholder="您的电子邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">我们可能需要联系您以获取更多信息</p>
      </div>
    </div>
  )

  // 紧凑版反馈组件
  if (compact) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className={cn("gap-2", className)}>
            <MessageSquare className="h-4 w-4" />
            <span>反馈</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <Tabs value={feedbackType} onValueChange={setFeedbackType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rating">快速评分</TabsTrigger>
              <TabsTrigger value="detailed">详细反馈</TabsTrigger>
            </TabsList>
            <TabsContent value="rating" className="pt-4">
              <RatingComponent />
            </TabsContent>
            <TabsContent value="detailed" className="pt-4">
              <DetailedFeedbackComponent />
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>提交成功</AlertTitle>
              <AlertDescription>感谢您的反馈！</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="submit" onClick={handleSubmit} disabled={isSubmitting || isSuccess} className="w-full">
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  提交中...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  提交反馈
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // 完整版反馈组件
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={feedbackType} onValueChange={setFeedbackType}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rating">快速评分</TabsTrigger>
            <TabsTrigger value="detailed">详细反馈</TabsTrigger>
          </TabsList>
          <TabsContent value="rating" className="pt-4">
            <RatingComponent />
          </TabsContent>
          <TabsContent value="detailed" className="pt-4">
            <DetailedFeedbackComponent />
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isSuccess && (
          <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>提交成功</AlertTitle>
            <AlertDescription>感谢您的反馈！</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting || isSuccess} className="w-full">
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              提交中...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              提交反馈
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { Avatar, AvatarFallback } from "@yyc3/ui-enterprise/avatar"
import { Textarea } from "@yyc3/ui-enterprise/textarea"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui-enterprise/tabs"
import {
  MessageSquare,
  ThumbsUp,
  Reply,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertCircle,
  Send,
  Image,
  Smile,
  AtSign,
  PaperclipIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@yyc3/ui-enterprise/dropdown-menu"
import { cn } from "@yyc3/lib/utils"

// Example comments
const exampleComments = [
  {
    id: "comment-1",
    content: "这个销售数据看起来很有趣，我们应该关注一下第三季度的下滑趋势。",
    author: {
      id: "user-1",
      name: "张三",
      avatar: null,
    },
    createdAt: "2025-03-15 14:30",
    likes: 3,
    replies: [
      {
        id: "reply-1",
        content: "同意，我们需要分析一下原因，可能是新产品上市的影响。",
        author: {
          id: "user-2",
          name: "李四",
          avatar: null,
        },
        createdAt: "2025-03-15 15:10",
        likes: 1,
      },
    ],
  },
  {
    id: "comment-2",
    content: "客户满意度数据显示我们的服务质量有所提升，这是个好兆头！",
    author: {
      id: "user-3",
      name: "王五",
      avatar: null,
    },
    createdAt: "2025-03-14 09:15",
    likes: 5,
    replies: [],
  },
  {
    id: "comment-3",
    content: "我们应该考虑增加更多的数据维度，比如按地区划分的销售情况。",
    author: {
      id: "user-2",
      name: "李四",
      avatar: null,
    },
    createdAt: "2025-03-13 16:45",
    likes: 2,
    replies: [
      {
        id: "reply-2",
        content: "好主意，我会在下一版本中添加这个功能。",
        author: {
          id: "user-1",
          name: "张三",
          avatar: null,
        },
        createdAt: "2025-03-13 17:20",
        likes: 0,
      },
      {
        id: "reply-3",
        content: "也可以考虑按产品类别划分，这样更容易看出哪些产品表现更好。",
        author: {
          id: "user-3",
          name: "王五",
          avatar: null,
        },
        createdAt: "2025-03-13 18:05",
        likes: 1,
      },
    ],
  },
]

// Example mentions
const exampleMentions = [
  {
    id: "mention-1",
    content: "@张三 请查看一下这个销售异常数据",
    author: {
      id: "user-2",
      name: "李四",
      avatar: null,
    },
    createdAt: "2025-03-15 10:30",
    context: "销售仪表盘",
    read: false,
  },
  {
    id: "mention-2",
    content: "@张三 @王五 我们需要讨论一下这个月的销售策略",
    author: {
      id: "user-4",
      name: "赵六",
      avatar: null,
    },
    createdAt: "2025-03-14 16:45",
    context: "团队会议",
    read: true,
  },
]

export function CommentsSystem() {
  const [comments, setComments] = useState(exampleComments)
  const [mentions, setMentions] = useState(exampleMentions)
  const [activeTab, setActiveTab] = useState("comments")
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  const commentInputRef = useRef<HTMLTextAreaElement>(null)

  // Focus the comment input when replying
  useEffect(() => {
    if (replyingTo && commentInputRef.current) {
      commentInputRef.current.focus()
    }
  }, [replyingTo])

  const handleAddComment = () => {
    if (!newComment.trim()) return

    if (replyingTo) {
      // Add reply to existing comment
      const updatedComments = comments.map((comment) => {
        if (comment.id === replyingTo) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: `reply-${Date.now()}`,
                content: newComment,
                author: {
                  id: "user-1",
                  name: "张三",
                  avatar: null,
                },
                createdAt: new Date().toISOString().split("T").join(" ").substring(0, 16),
                likes: 0,
              },
            ],
          }
        }
        return comment
      })

      setComments(updatedComments)
      setReplyingTo(null)
    } else {
      // Add new comment
      const newCommentObj = {
        id: `comment-${Date.now()}`,
        content: newComment,
        author: {
          id: "user-1",
          name: "张三",
          avatar: null,
        },
        createdAt: new Date().toISOString().split("T").join(" ").substring(0, 16),
        likes: 0,
        replies: [],
      }

      setComments([newCommentObj, ...comments])
    }

    setNewComment("")
  }

  const handleLike = (commentId: string, isReply = false, parentId?: string) => {
    if (isReply && parentId) {
      // Like a reply
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId ? { ...reply, likes: reply.likes + 1 } : reply,
            ),
          }
        }
        return comment
      })

      setComments(updatedComments)
    } else {
      // Like a comment
      const updatedComments = comments.map((comment) =>
        comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment,
      )

      setComments(updatedComments)
    }
  }

  const handleEdit = (commentId: string, isReply = false, parentId?: string) => {
    setEditingComment(commentId)

    let content = ""
    if (isReply && parentId) {
      const parent = comments.find((c) => c.id === parentId)
      const reply = parent?.replies.find((r) => r.id === commentId)
      content = reply?.content || ""
    } else {
      const comment = comments.find((c) => c.id === commentId)
      content = comment?.content || ""
    }

    setEditContent(content)
  }

  const handleSaveEdit = (commentId: string, isReply = false, parentId?: string) => {
    if (!editContent.trim()) return

    if (isReply && parentId) {
      // Update reply
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId ? { ...reply, content: editContent } : reply,
            ),
          }
        }
        return comment
      })

      setComments(updatedComments)
    } else {
      // Update comment
      const updatedComments = comments.map((comment) =>
        comment.id === commentId ? { ...comment, content: editContent } : comment,
      )

      setComments(updatedComments)
    }

    setEditingComment(null)
    setEditContent("")
  }

  const handleDelete = (commentId: string, isReply = false, parentId?: string) => {
    if (isReply && parentId) {
      // Delete reply
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== commentId),
          }
        }
        return comment
      })

      setComments(updatedComments)
    } else {
      // Delete comment
      const updatedComments = comments.filter((comment) => comment.id !== commentId)
      setComments(updatedComments)
    }
  }

  const handleMarkAsRead = (mentionId: string) => {
    const updatedMentions = mentions.map((mention) => (mention.id === mentionId ? { ...mention, read: true } : mention))

    setMentions(updatedMentions)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>评论与提及</CardTitle>
          <Badge variant="outline" className="text-xs">
            {mentions.filter((m) => !m.read).length} 个未读提及
          </Badge>
        </div>
        <CardDescription>查看和回复评论，管理提及</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comments">
              <MessageSquare className="mr-2 h-4 w-4" />
              评论
            </TabsTrigger>
            <TabsTrigger value="mentions">
              <AtSign className="mr-2 h-4 w-4" />
              提及
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comments" className="pt-4 space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Textarea
                  ref={commentInputRef}
                  placeholder={replyingTo ? "输入回复..." : "添加评论..."}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] pb-10"
                />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <AtSign className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PaperclipIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="mr-2 h-4 w-4" />
                    {replyingTo ? "回复" : "发送"}
                  </Button>
                </div>
              </div>

              {replyingTo && (
                <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <span className="text-xs text-muted-foreground">回复评论</span>
                  <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                    取消
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">暂无评论</div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="border rounded-md p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-sm">{comment.author.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">{comment.createdAt}</span>
                            </div>

                            {editingComment === comment.id ? (
                              <div className="mt-2 space-y-2">
                                <Textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="min-h-[80px]"
                                />
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" onClick={() => setEditingComment(null)}>
                                    取消
                                  </Button>
                                  <Button size="sm" onClick={() => handleSaveEdit(comment.id)}>
                                    保存
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm mt-1">{comment.content}</p>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(comment.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>编辑</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(comment.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>删除</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              <span>举报</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleLike(comment.id)}
                        >
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          {comment.likes > 0 && <span>{comment.likes}</span>}
                          <span className="ml-1">点赞</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => setReplyingTo(comment.id)}
                        >
                          <Reply className="mr-1 h-3 w-3" />
                          <span>回复</span>
                        </Button>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="ml-8 space-y-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="border rounded-md p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-xs">{reply.author.name}</span>
                                    <span className="text-xs text-muted-foreground ml-2">{reply.createdAt}</span>
                                  </div>

                                  {editingComment === reply.id ? (
                                    <div className="mt-2 space-y-2">
                                      <Textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="min-h-[60px]"
                                      />
                                      <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setEditingComment(null)}>
                                          取消
                                        </Button>
                                        <Button size="sm" onClick={() => handleSaveEdit(reply.id, true, comment.id)}>
                                          保存
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-xs mt-1">{reply.content}</p>
                                  )}
                                </div>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(reply.id, true, comment.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>编辑</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(reply.id, true, comment.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>删除</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleLike(reply.id, true, comment.id)}
                              >
                                <ThumbsUp className="mr-1 h-3 w-3" />
                                {reply.likes > 0 && <span>{reply.likes}</span>}
                                <span className="ml-1">点赞</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="mentions" className="pt-4">
            <div className="space-y-4">
              {mentions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">暂无提及</div>
              ) : (
                mentions.map((mention) => (
                  <div
                    key={mention.id}
                    className={cn("border rounded-md p-4", !mention.read && "border-primary/50 bg-primary/5")}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{mention.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium text-sm">{mention.author.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">{mention.createdAt}</span>
                            {!mention.read && <Badge className="ml-2 bg-primary text-xs">新</Badge>}
                          </div>
                          <p className="text-sm mt-1">{mention.content}</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {mention.context}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3 gap-2">
                      {!mention.read && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(mention.id)}>
                          标记为已读
                        </Button>
                      )}
                      <Button size="sm">查看上下文</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          共 {comments.length} 条评论，{mentions.filter((m) => !m.read).length} 个未读提及
        </div>
        <Button variant="outline" size="sm">
          查看所有评论
        </Button>
      </CardFooter>
    </Card>
  )
}

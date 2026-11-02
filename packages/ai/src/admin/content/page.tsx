import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server-client"

// 获取内容列表
async function getContents() {
  const supabase = await createClient()

  // 这里应该是实际的数据查询，这里用模拟数据
  // 在实际应用中，您需要根据数据库结构进行查询

  // 模拟数据
  return [
    {
      id: "c1",
      title: "10个提高工作效率的实用技巧",
      type: "文章",
      author: "张小明",
      status: "已发布",
      publishDate: "2023-04-15 14:30",
      views: 1245,
      likes: 89,
      comments: 32,
    },
    {
      id: "c2",
      title: "不踩坑！超详细测评新款耳机",
      type: "测评",
      author: "李华",
      status: "已发布",
      publishDate: "2023-04-12 10:15",
      views: 3567,
      likes: 245,
      comments: 78,
    },
    {
      id: "c3",
      title: "三分钟学会这个实用技能",
      type: "教程",
      author: "王芳",
      status: "已发布",
      publishDate: "2023-04-10 18:45",
      views: 12890,
      likes: 1456,
      comments: 234,
    },
    {
      id: "c4",
      title: "年轻人必备的理财知识",
      type: "指南",
      author: "赵明",
      status: "草稿",
      publishDate: "-",
      views: 0,
      likes: 0,
      comments: 0,
    },
    {
      id: "c5",
      title: "夏季护肤指南：如何应对高温天气",
      type: "指南",
      author: "刘洋",
      status: "审核中",
      publishDate: "-",
      views: 0,
      likes: 0,
      comments: 0,
    },
  ]
}

export default async function AdminContentPage() {
  const contents = await getContents()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">内容管理</h1>
          <p className="text-muted-foreground">管理系统中的所有内容</p>
        </div>
        <Button asChild>
          <Link href="/admin/content/create">
            <Plus className="mr-2 h-4 w-4" />
            创建内容
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>内容列表</CardTitle>
          <CardDescription>系统中的所有内容</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="搜索内容..." className="pl-8 w-full md:w-[280px]" />
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                筛选
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>作者</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>发布日期</TableHead>
                  <TableHead>浏览量</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell>
                      <div className="font-medium">{content.title}</div>
                    </TableCell>
                    <TableCell>{content.type}</TableCell>
                    <TableCell>{content.author}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          content.status === "已发布"
                            ? "default"
                            : content.status === "审核中"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {content.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{content.publishDate}</TableCell>
                    <TableCell>{content.views.toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">打开菜单</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/content/${content.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              查看详情
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/content/${content.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              编辑内容
                            </Link>
                          </DropdownMenuItem>
                          {content.status !== "已发布" && <DropdownMenuItem>发布内容</DropdownMenuItem>}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除内容
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

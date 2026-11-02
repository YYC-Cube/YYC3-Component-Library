import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Key, Lock, Unlock } from "lucide-react"
import { createClient } from "@/lib/supabase/server-client"

// 获取用户详情
async function getUser(id: string) {
  const supabase = await createClient()

  // 在实际应用中，您需要根据数据库结构进行查询
  const { data: user, error } = await supabase.auth.admin.getUserById(id)

  if (error || !user.user) {
    console.error("获取用户详情失败:", error)
    return null
  }

  return {
    id: user.user.id,
    name: user.user.user_metadata?.name || "未设置",
    email: user.user.email,
    role: user.user.user_metadata?.role || "用户",
    status: user.user.banned ? "已禁用" : user.user.confirmed_at ? "活跃" : "未验证",
    lastActive: user.user.last_sign_in_at ? new Date(user.user.last_sign_in_at).toLocaleString() : "从未登录",
    createdAt: new Date(user.user.created_at).toLocaleString(),
    phone: user.user.phone || "未设置",
    emailConfirmed: !!user.user.confirmed_at,
    lastPasswordChange: user.user.updated_at ? new Date(user.user.updated_at).toLocaleString() : "未知",
    loginCount: user.user.user_metadata?.login_count || 0,
    avatar: user.user.user_metadata?.avatar_url || null,
  }
}

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/users/${user.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              编辑用户
            </Link>
          </Button>
          <Button variant="outline">
            <Key className="mr-2 h-4 w-4" />
            重置密码
          </Button>
          <Button variant={user.status === "已禁用" ? "default" : "destructive"}>
            {user.status === "已禁用" ? (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                启用账户
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                禁用账户
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>用户信息</CardTitle>
            <CardDescription>用户的基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || `/placeholder.svg?height=96&width=96`} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge className="mt-2" variant={user.status === "活跃" ? "default" : "secondary"}>
                  {user.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">角色</p>
                <p className="font-medium">{user.role}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">电话</p>
                <p className="font-medium">{user.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">创建时间</p>
                <p className="font-medium">{user.createdAt}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">最近活动</p>
                <p className="font-medium">{user.lastActive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>详细信息</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activity">
              <TabsList>
                <TabsTrigger value="activity">活动记录</TabsTrigger>
                <TabsTrigger value="security">安全信息</TabsTrigger>
                <TabsTrigger value="permissions">权限设置</TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">登录次数</p>
                    <p className="font-medium">{user.loginCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">最近登录</p>
                    <p className="font-medium">{user.lastActive}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">最近活动</h4>
                    <div className="rounded-md border">
                      <div className="p-4 text-center text-muted-foreground">暂无活动记录</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="security" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">邮箱验证</p>
                    <p className="font-medium">{user.emailConfirmed ? "已验证" : "未验证"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">双因素认证</p>
                    <p className="font-medium">未启用</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">最近密码修改</p>
                    <p className="font-medium">{user.lastPasswordChange}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">登录设备</h4>
                    <div className="rounded-md border">
                      <div className="p-4 text-center text-muted-foreground">暂无设备记录</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="permissions" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">用户角色</p>
                    <p className="font-medium">{user.role}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">权限列表</h4>
                    <div className="rounded-md border">
                      <div className="p-4 text-center text-muted-foreground">暂无自定义权限</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">用户ID: {user.id}</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

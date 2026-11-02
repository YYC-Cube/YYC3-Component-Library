import DashboardHeader from "../components/dashboard-header"
import PageBackground from "../components/page-background"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Key, Lock, User, UserCog } from "lucide-react"

export default function SettingsPage() {
  return (
    <PageBackground image="/images/bg-wave-purple.jpeg">
      <DashboardHeader />

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900">账户设置</h1>
            <p className="mt-2 text-gray-600">管理您的个人信息和偏好设置</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-auto bg-white/80 backdrop-blur-sm shadow-md">
              <TabsTrigger value="profile" className="flex items-center gap-2 py-3 px-4">
                <User className="h-4 w-4" />
                <span>个人资料</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2 py-3 px-4">
                <UserCog className="h-4 w-4" />
                <span>账户设置</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 py-3 px-4">
                <Lock className="h-4 w-4" />
                <span>安全设置</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2 py-3 px-4">
                <Bell className="h-4 w-4" />
                <span>通知设置</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="card-hover glass-card">
                <CardHeader>
                  <CardTitle>个人资料</CardTitle>
                  <CardDescription>更新您的个人信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder.svg?height=96&width=96" alt="用户头像" />
                        <AvatarFallback>用户</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        更换头像
                      </Button>
                    </div>
                    <div className="flex-1 grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">姓名</Label>
                          <Input id="name" defaultValue="张小明" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">邮箱</Label>
                          <Input id="email" type="email" defaultValue="zhang@example.com" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">手机号</Label>
                          <Input id="phone" type="tel" defaultValue="13800138000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">部门</Label>
                          <Select defaultValue="operations">
                            <SelectTrigger id="department">
                              <SelectValue placeholder="选择部门" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="operations">运营部</SelectItem>
                              <SelectItem value="content">内容部</SelectItem>
                              <SelectItem value="data">数据部</SelectItem>
                              <SelectItem value="marketing">市场部</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">个人简介</Label>
                        <Input id="bio" defaultValue="内容创作者，专注于AI辅助创作和数据分析" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>保存更改</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <Card className="card-hover glass-card">
                <CardHeader>
                  <CardTitle>账户设置</CardTitle>
                  <CardDescription>管理您的账户偏好</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">界面语言</h4>
                        <p className="text-sm text-gray-500">选择您偏好的界面语言</p>
                      </div>
                      <Select defaultValue="zh-CN">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="选择语言" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zh-CN">简体中文</SelectItem>
                          <SelectItem value="zh-TW">繁体中文</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">时区设置</h4>
                        <p className="text-sm text-gray-500">选择您所在的时区</p>
                      </div>
                      <Select defaultValue="Asia/Shanghai">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="选择时区" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Shanghai">北京时间 (GMT+8)</SelectItem>
                          <SelectItem value="Asia/Hong_Kong">香港时间 (GMT+8)</SelectItem>
                          <SelectItem value="America/New_York">纽约时间 (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">深色模式</h4>
                        <p className="text-sm text-gray-500">启用深色模式以减轻眼睛疲劳</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>保存设置</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="card-hover glass-card">
                <CardHeader>
                  <CardTitle>安全设置</CardTitle>
                  <CardDescription>管理您的账户安全</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">修改密码</h4>
                        <p className="text-sm text-gray-500">定期更新密码以提高账户安全性</p>
                      </div>
                      <Button variant="outline">
                        <Key className="mr-2 h-4 w-4" />
                        修改密码
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">两步验证</h4>
                        <p className="text-sm text-gray-500">启用两步验证以增强账户安全</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">登录设备管理</h4>
                        <p className="text-sm text-gray-500">查看和管理已登录的设备</p>
                      </div>
                      <Button variant="outline">查看设备</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="card-hover glass-card">
                <CardHeader>
                  <CardTitle>通知设置</CardTitle>
                  <CardDescription>管理您接收的通知类型</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">电子邮件通知</h4>
                        <p className="text-sm text-gray-500">接收重要更新和活动的电子邮件</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">系统通知</h4>
                        <p className="text-sm text-gray-500">接收系统更新和维护信息</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">营销通知</h4>
                        <p className="text-sm text-gray-500">接收促销和新功能信息</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>保存设置</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </PageBackground>
  )
}

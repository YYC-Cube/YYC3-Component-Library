import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, RefreshCw, Database, Shield, Mail, Cpu } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
        <p className="text-muted-foreground">管理系统配置和全局设置</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">基本设置</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="api">API设置</TabsTrigger>
          <TabsTrigger value="database">数据库设置</TabsTrigger>
          <TabsTrigger value="email">邮件设置</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>基本设置</CardTitle>
              <CardDescription>配置系统的基本信息和全局设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">系统名称</Label>
                <Input id="site-name" defaultValue="YY-Nexus AI" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">系统描述</Label>
                <Textarea id="site-description" defaultValue="AI驱动的全链路内容中枢" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-url">系统URL</Label>
                <Input id="site-url" defaultValue="https://yy-nexus.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">管理员邮箱</Label>
                <Input id="admin-email" defaultValue="yy_ltd@163.com" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance-mode" />
                <Label htmlFor="maintenance-mode">维护模式</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                保存设置
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>界面设置</CardTitle>
              <CardDescription>配置系统界面和主题</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">默认主题</Label>
                <Select defaultValue="light">
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="选择主题" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">浅色主题</SelectItem>
                    <SelectItem value="dark">深色主题</SelectItem>
                    <SelectItem value="system">跟随系统</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">默认语言</Label>
                <Select defaultValue="zh-CN">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh-CN">简体中文</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="enable-animations" defaultChecked />
                <Label htmlFor="enable-animations">启用动画效果</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                保存设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>安全设置</CardTitle>
              <CardDescription>配置系统安全相关设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="enable-2fa" />
                <Label htmlFor="enable-2fa">启用双因素认证</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="force-password-change" />
                <Label htmlFor="force-password-change">强制定期修改密码</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-expiry">密码过期天数</Label>
                <Input id="password-expiry" type="number" defaultValue="90" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">会话超时时间（分钟）</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="log-login-attempts" defaultChecked />
                <Label htmlFor="log-login-attempts">记录登录尝试</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                保存安全设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API设置</CardTitle>
              <CardDescription>配置系统API相关设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="enable-api" defaultChecked />
                <Label htmlFor="enable-api">启用API</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API密钥</Label>
                <div className="flex space-x-2">
                  <Input id="api-key" defaultValue="sk_live_xxxxxxxxxxxxxxxxxxxxx" type="password" />
                  <Button variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">注意：重新生成API密钥将使所有现有密钥失效</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate-limit">API速率限制（请求/分钟）</Label>
                <Input id="rate-limit" type="number" defaultValue="60" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="enable-cors" defaultChecked />
                <Label htmlFor="enable-cors">启用CORS</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Cpu className="mr-2 h-4 w-4" />
                保存API设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>数据库设置</CardTitle>
              <CardDescription>配置系统数据库相关设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="db-host">数据库主机</Label>
                <Input id="db-host" defaultValue="db.supabase.co" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-name">数据库名称</Label>
                <Input id="db-name" defaultValue="postgres" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-user">数据库用户</Label>
                <Input id="db-user" defaultValue="postgres" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-password">数据库密码</Label>
                <Input id="db-password" type="password" defaultValue="********" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="db-ssl" defaultChecked />
                <Label htmlFor="db-ssl">使用SSL连接</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Database className="mr-2 h-4 w-4" />
                保存数据库设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>邮件设置</CardTitle>
              <CardDescription>配置系统邮件相关设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP主机</Label>
                <Input id="smtp-host" defaultValue="smtp.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP端口</Label>
                <Input id="smtp-port" type="number" defaultValue="587" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-user">SMTP用户名</Label>
                <Input id="smtp-user" defaultValue="noreply@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">SMTP密码</Label>
                <Input id="smtp-password" type="password" defaultValue="********" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-email">发件人邮箱</Label>
                <Input id="from-email" defaultValue="noreply@example.com" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="smtp-ssl" defaultChecked />
                <Label htmlFor="smtp-ssl">使用SSL/TLS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">发送测试邮件</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                保存邮件设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

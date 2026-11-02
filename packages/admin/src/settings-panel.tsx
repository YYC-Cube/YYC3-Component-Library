/**
 * @file 设置面板组件
 * @description 提供用户偏好设置、通知管理和安全设置功能
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@yyc3/ui/card"
import { Switch } from "@yyc3/ui/switch"
import { Label } from "@yyc3/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@yyc3/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yyc3/ui/tabs"
import { Button } from "@yyc3/ui/button"
import { Input } from "@yyc3/ui/input"
import { Slider } from "@yyc3/ui/slider"
import { ScrollArea } from "@yyc3/ui/scroll-area"
import { Separator } from "@yyc3/ui/separator"
import { Alert, AlertDescription } from "@yyc3/ui/alert"
import { Settings, Moon, Sun, Bell, Shield, User, ChevronDown, X, Check, RefreshCw, HelpCircle, MessageSquare, Calendar, Mail } from "lucide-react"

// 主题选项
type ThemeOption = "system" | "light" | "dark"

// 通知类型接口
interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  dailySummary: boolean
  importantOnly: boolean
}

// 部门列表
const departments = [
  { id: 1, name: "技术部" },
  { id: 2, name: "市场部" },
  { id: 3, name: "销售部" },
  { id: 4, name: "人力资源部" },
  { id: 5, name: "财务部" },
]

// 安全设置选项
const securityOptions = [
  { id: "2fa", name: "两步验证", description: "启用后，登录时需要额外验证步骤" },
  { id: "loginAlert", name: "登录通知", description: "在新设备登录时收到通知" },
  { id: "sessionTimeout", name: "自动登出", description: "闲置一段时间后自动登出" },
  { id: "ipRestriction", name: "IP限制", description: "仅允许特定IP地址访问" },
]

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  // 状态管理
  const [theme, setTheme] = useState<ThemeOption>("system")
  const [compactView, setCompactView] = useState(false)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    dailySummary: true,
    importantOnly: false,
  })
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(["1", "2"])
  const [securitySettings, setSecuritySettings] = useState({
    "2fa": false,
    "loginAlert": true,
    "sessionTimeout": true,
    "ipRestriction": false,
  })
  const [fontSize, setFontSize] = useState([16])
  const [autoRefresh, setAutoRefresh] = useState(60)

  // 处理通知设置变更
  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // 处理安全设置变更
  const handleSecurityChange = (key: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // 处理部门通知选择
  const handleDepartmentChange = (value: string[]) => {
    setSelectedDepartments(value)
  }

  // 保存设置
  const handleSaveSettings = () => {
    // 这里可以添加保存逻辑
    console.log("保存设置:", {
      theme,
      compactView,
      notifications,
      selectedDepartments,
      securitySettings,
      fontSize,
      autoRefresh
    })
    // 模拟保存成功
    setTimeout(() => {
      alert("设置已保存")
    }, 500)
  }

  // 重置设置
  const handleResetSettings = () => {
    if (confirm("确定要重置所有设置吗？这将恢复默认值。")) {
      setTheme("system")
      setCompactView(false)
      setNotifications({
        email: true,
        push: true,
        sms: false,
        dailySummary: true,
        importantOnly: false,
      })
      setSelectedDepartments(["1", "2"])
      setSecuritySettings({
        "2fa": false,
        "loginAlert": true,
        "sessionTimeout": true,
        "ipRestriction": false,
      })
      setFontSize([16])
      setAutoRefresh(60)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* 设置面板 */}
      <div className="relative flex-1 flex flex-col max-w-md w-full bg-background shadow-xl">
        {/* 面板头部 */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <h2 className="text-xl font-semibold">设置</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* 面板内容 */}
        <ScrollArea className="flex-1 px-6 py-4">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                外观
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                通知
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                安全
              </TabsTrigger>
            </TabsList>

            {/* 外观设置 */}
            <TabsContent value="appearance" className="space-y-6 animate-in fade-in-50">
              <Card>
                <CardHeader>
                  <CardTitle>界面外观</CardTitle>
                  <CardDescription>自定义应用的视觉外观和显示方式</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="theme">主题模式</Label>
                      <p className="text-sm text-muted-foreground">选择应用的颜色主题</p>
                    </div>
                    <Select value={theme} onValueChange={(value) => setTheme(value as ThemeOption)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择主题" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4" />
                            <span>跟随系统</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            <span>浅色模式</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            <span>深色模式</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="compactView">紧凑视图</Label>
                      <p className="text-sm text-muted-foreground">减少界面元素之间的间距</p>
                    </div>
                    <Switch
                      id="compactView"
                      checked={compactView}
                      onCheckedChange={setCompactView}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fontSize">字体大小</Label>
                      <span className="text-sm font-medium">{fontSize[0]}px</span>
                    </div>
                    <Slider
                      id="fontSize"
                      value={fontSize}
                      min={12}
                      max={20}
                      step={1}
                      onValueChange={setFontSize}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>A</span>
                      <span>A</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>显示设置</CardTitle>
                  <CardDescription>配置应用的显示选项</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="autoRefresh">自动刷新间隔</Label>
                      <p className="text-sm text-muted-foreground">数据自动刷新的时间间隔</p>
                    </div>
                    <Select value={autoRefresh.toString()} onValueChange={(value) => setAutoRefresh(Number(value))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择间隔" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30秒</SelectItem>
                        <SelectItem value="60">1分钟</SelectItem>
                        <SelectItem value="300">5分钟</SelectItem>
                        <SelectItem value="600">10分钟</SelectItem>
                        <SelectItem value="0">不自动刷新</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 通知设置 */}
            <TabsContent value="notifications" className="space-y-6 animate-in fade-in-50">
              <Card>
                <CardHeader>
                  <CardTitle>通知偏好</CardTitle>
                  <CardDescription>管理应用通知的接收方式和内容</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="emailNotifications">邮件通知</Label>
                      <p className="text-sm text-muted-foreground">通过邮件接收重要通知</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notifications.email}
                      onCheckedChange={() => handleNotificationChange("email")}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="pushNotifications">推送通知</Label>
                      <p className="text-sm text-muted-foreground">在浏览器中接收实时通知</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notifications.push}
                      onCheckedChange={() => handleNotificationChange("push")}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="smsNotifications">短信通知</Label>
                      <p className="text-sm text-muted-foreground">通过短信接收紧急通知</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notifications.sms}
                      onCheckedChange={() => handleNotificationChange("sms")}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="dailySummary">每日摘要</Label>
                      <p className="text-sm text-muted-foreground">每天接收一次活动摘要</p>
                    </div>
                    <Switch
                      id="dailySummary"
                      checked={notifications.dailySummary}
                      onCheckedChange={() => handleNotificationChange("dailySummary")}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="importantOnly">仅重要通知</Label>
                      <p className="text-sm text-muted-foreground">只接收标记为重要的通知</p>
                    </div>
                    <Switch
                      id="importantOnly"
                      checked={notifications.importantOnly}
                      onCheckedChange={() => handleNotificationChange("importantOnly")}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>部门通知</CardTitle>
                  <CardDescription>选择接收哪些部门的通知</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedDepartments}
                    onValueChange={handleDepartmentChange}
                    multiple
                  >
                    <SelectTrigger className="h-auto min-h-[40px]">
                      <SelectValue placeholder="选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-2 text-sm text-muted-foreground">
                    选择后将接收所选部门的相关通知
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>通知内容设置</CardTitle>
                  <CardDescription>配置各类通知的详细选项</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        消息通知
                      </Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="pl-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">提及我</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">新消息</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        日历提醒
                      </Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="pl-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">会议提醒</span>
                        <Select defaultValue="15">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="提前" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">提前5分钟</SelectItem>
                            <SelectItem value="15">提前15分钟</SelectItem>
                            <SelectItem value="30">提前30分钟</SelectItem>
                            <SelectItem value="60">提前1小时</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 安全设置 */}
            <TabsContent value="security" className="space-y-6 animate-in fade-in-50">
              <Card>
                <CardHeader>
                  <CardTitle>安全选项</CardTitle>
                  <CardDescription>配置账户安全相关设置</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {securityOptions.map((option) => (
                    <React.Fragment key={option.id}>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor={option.id}>{option.name}</Label>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        <Switch
                          id={option.id}
                          checked={securitySettings[option.id as keyof typeof securitySettings]}
                          onCheckedChange={() => handleSecurityChange(option.id)}
                        />
                      </div>
                      {option.id !== securityOptions[securityOptions.length - 1].id && <Separator />}
                    </React.Fragment>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>密码管理</CardTitle>
                  <CardDescription>更新您的账户密码</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">当前密码</Label>
                    <Input id="currentPassword" type="password" placeholder="输入当前密码" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">新密码</Label>
                    <Input id="newPassword" type="password" placeholder="输入新密码" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">确认新密码</Label>
                    <Input id="confirmPassword" type="password" placeholder="再次输入新密码" />
                  </div>
                  <Button className="w-full">更新密码</Button>
                </CardContent>
              </Card>
              
              <Alert variant="destructive">
                <HelpCircle className="h-4 w-4" />
                <AlertDescription>
                  如需注销账户，请联系管理员获取帮助。注销后，您的所有数据将被永久删除。
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </ScrollArea>
        
        {/* 面板底部 */}
        <div className="border-t px-6 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={handleResetSettings}>
            重置设置
          </Button>
          <Button onClick={handleSaveSettings} className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            保存更改
          </Button>
        </div>
      </div>
    </div>
  )
}
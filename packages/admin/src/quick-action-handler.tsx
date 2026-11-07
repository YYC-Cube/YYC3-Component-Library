"use client"

import { useState, useEffect } from "react"
import { Button } from "@yyc3/ui-enterprise/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@yyc3/ui-enterprise/dialog"
import { Input } from "@yyc3/ui-enterprise/input"
import { Label } from "@yyc3/ui-enterprise/label"
import { Textarea } from "@yyc3/ui-enterprise/textarea"
import { Calendar, User, Settings, Bell } from "lucide-react"
import { actionManager } from "@yyc3/lib/action-manager"
import { AvatarUpload } from "@/components/avatar-upload"

interface QuickActionHandlerProps {
  onActionComplete?: (action: string, data?: any) => void
}

export function QuickActionHandler({ onActionComplete }: QuickActionHandlerProps) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [scheduleForm, setScheduleForm] = useState({
    title: "",
    date: "",
    description: "",
  })
  const [profileForm, setProfileForm] = useState({
    username: "管理员",
    email: "admin@yanyu.cloud",
    phone: "",
    department: "系统管理部",
    position: "系统管理员",
    bio: "",
  })

  // 从本地存储加载用户头像
  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar")
    if (savedAvatar) {
      setUserAvatar(savedAvatar)
    }
  }, [])

  // 监听全局操作触发
  useEffect(() => {
    const handleScheduleAction = () => setIsScheduleOpen(true)
    const handleProfileAction = () => setIsProfileOpen(true)
    const handleSettingsAction = () => setIsSettingsOpen(true)
    const handleNotificationAction = () => {
      // 请求通知权限并发送测试通知
      if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            actionManager.trigger("notifications", { message: "通知功能测试成功！" })
          } else {
            console.log("通知权限被拒绝")
          }
        })
      }
    }

    // 注册全局操作监听器
    actionManager.on("schedule", handleScheduleAction)
    actionManager.on("profile", handleProfileAction)
    actionManager.on("settings", handleSettingsAction)
    actionManager.on("notifications", handleNotificationAction)

    return () => {
      actionManager.off("schedule", handleScheduleAction)
      actionManager.off("profile", handleProfileAction)
      actionManager.off("settings", handleSettingsAction)
      actionManager.off("notifications", handleNotificationAction)
    }
  }, [])

  const handleSaveSchedule = () => {
    if (!scheduleForm.title.trim()) {
      alert("请输入会议标题")
      return
    }

    const scheduleData = {
      ...scheduleForm,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }

    actionManager.trigger("schedule", scheduleData)
    setIsScheduleOpen(false)
    setScheduleForm({ title: "", date: "", description: "" })
    onActionComplete?.("schedule", scheduleData)
  }

  const handleSaveProfile = () => {
    const profileData = {
      ...profileForm,
      avatar: userAvatar,
      updatedAt: new Date().toISOString(),
      updated: true,
    }

    // 保存到本地存储
    localStorage.setItem("userProfile", JSON.stringify(profileData))

    actionManager.trigger("profile", profileData)
    setIsProfileOpen(false)
    onActionComplete?.("profile", profileData)

    // 触发头部用户信息更新
    window.dispatchEvent(new CustomEvent("profileUpdated", { detail: profileData }))
  }

  const handleSaveSettings = () => {
    const settingsData = {
      notifications: {
        desktop: true,
        email: true,
        sms: false,
      },
      interface: {
        darkMode: false,
        compactLayout: true,
      },
      updatedAt: new Date().toISOString(),
      updated: true,
    }

    actionManager.trigger("settings", settingsData)
    setIsSettingsOpen(false)
    onActionComplete?.("settings", settingsData)
  }

  const handleAvatarChange = (avatarUrl: string) => {
    setUserAvatar(avatarUrl)
    // 立即触发头部更新
    window.dispatchEvent(new CustomEvent("avatarUpdated", { detail: { avatar: avatarUrl } }))
  }

  return (
    <>
      {/* 日程安排对话框 */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-sky-600" />
              创建日程安排
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-title" className="text-right">
                标题 *
              </Label>
              <Input
                id="event-title"
                placeholder="会议标题"
                className="col-span-3"
                value={scheduleForm.title}
                onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-date" className="text-right">
                日期时间
              </Label>
              <Input
                id="event-date"
                type="datetime-local"
                className="col-span-3"
                value={scheduleForm.date}
                onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-desc" className="text-right">
                描述
              </Label>
              <Textarea
                id="event-desc"
                placeholder="会议描述和议程"
                className="col-span-3"
                value={scheduleForm.description}
                onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveSchedule} className="bg-sky-600 hover:bg-sky-700">
              创建日程
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 个人资料对话框 */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-sky-600" />
              个人资料设置
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* 头像设置 */}
            <div className="flex flex-col items-center space-y-4 pb-6 border-b">
              <AvatarUpload
                currentAvatar={userAvatar || undefined}
                userName={profileForm.username}
                onAvatarChange={handleAvatarChange}
                size="xl"
              />
              <div className="text-center">
                <h3 className="text-lg font-semibold">{profileForm.username}</h3>
                <p className="text-sm text-gray-500">{profileForm.position}</p>
                <p className="text-xs text-gray-400">{profileForm.department}</p>
              </div>
            </div>

            {/* 基本信息 */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">基本信息</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username" className="text-sm font-medium mb-1 block">
                    用户名
                  </Label>
                  <Input
                    id="username"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium mb-1 block">
                    邮箱地址
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium mb-1 block">
                    手机号码
                  </Label>
                  <Input
                    id="phone"
                    placeholder="请输入手机号码"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="department" className="text-sm font-medium mb-1 block">
                    所属部门
                  </Label>
                  <Input
                    id="department"
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="position" className="text-sm font-medium mb-1 block">
                  职位
                </Label>
                <Input
                  id="position"
                  value={profileForm.position}
                  onChange={(e) => setProfileForm({ ...profileForm, position: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-sm font-medium mb-1 block">
                  个人简介
                </Label>
                <Textarea
                  id="bio"
                  placeholder="请输入个人简介..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveProfile} className="bg-sky-600 hover:bg-sky-700">
              保存资料
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 系统设置对话框 */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-sky-600" />
              系统设置
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                通知设置
              </h4>
              <div className="space-y-3 pl-6">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  <span className="text-sm">桌面通知</span>
                  <span className="text-xs text-gray-500">在浏览器中显示通知</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  <span className="text-sm">邮件通知</span>
                  <span className="text-xs text-gray-500">发送邮件提醒</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm">短信通知</span>
                  <span className="text-xs text-gray-500">发送短信提醒</span>
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">界面设置</h4>
              <div className="space-y-3 pl-6">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm">暗色模式</span>
                  <span className="text-xs text-gray-500">使用深色主题</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  <span className="text-sm">紧凑布局</span>
                  <span className="text-xs text-gray-500">减少界面间距</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  <span className="text-sm">显示提示</span>
                  <span className="text-xs text-gray-500">显示操作提示信息</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveSettings} className="bg-sky-600 hover:bg-sky-700">
              保存设置
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// 导出全局触发函数供其他组件使用
export const triggerQuickAction = {
  schedule: () => actionManager.trigger("schedule"),
  notifications: () => actionManager.trigger("notifications"),
  profile: () => actionManager.trigger("profile"),
  settings: () => actionManager.trigger("settings"),
}

"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    setIsUploading(true)
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white">创建账户</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 group">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl || "/placeholder.svg"}
                    alt="Avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-slate-400" />
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <span className="text-white text-sm">更换头像</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
            </div>

            {/* Registration Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  用户名
                </Label>
                <Input
                  id="username"
                  placeholder="请输入用户名"
                  className="bg-slate-900/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  邮箱
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱"
                  className="bg-slate-900/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  密码
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  className="bg-slate-900/50 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">
                  确认密码
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="请再次输入密码"
                  className="bg-slate-900/50 border-slate-700 text-white"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500">
              注册
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

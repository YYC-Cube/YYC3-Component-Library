"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/browser-client"

export default function CreateUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    sendEmail: true,
    emailConfirmed: true,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // 创建用户
      const { data, error: createError } = await supabase.functions.invoke("admin-create-user", {
        body: {
          email: formData.email,
          password: formData.password,
          user_metadata: {
            name: formData.name,
            role: formData.role,
          },
          email_confirm: formData.emailConfirmed,
          send_email: formData.sendEmail,
        },
      })

      if (createError) throw createError

      // 创建成功，跳转到用户列表页
      router.push("/admin/users")
      router.refresh()
    } catch (err: any) {
      console.error("创建用户失败:", err)
      setError(err.message || "创建用户失败，请稍后再试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">创建用户</h1>
          <p className="text-muted-foreground">添加新用户到系统</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>用户信息</CardTitle>
            <CardDescription>填写新用户的基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="请输入姓名"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="请输入邮箱"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="请输入密码"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">角色</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">管理员</SelectItem>
                    <SelectItem value="editor">编辑</SelectItem>
                    <SelectItem value="user">普通用户</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-confirmed"
                  checked={formData.emailConfirmed}
                  onCheckedChange={(checked) => handleChange("emailConfirmed", checked)}
                />
                <Label htmlFor="email-confirmed">自动确认邮箱</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send-email"
                  checked={formData.sendEmail}
                  onCheckedChange={(checked) => handleChange("sendEmail", checked)}
                />
                <Label htmlFor="send-email">发送邀请邮件</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/admin/users">取消</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              创建用户
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

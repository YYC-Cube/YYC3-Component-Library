"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/browser-client"

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    isActive: true,
  })

  // 获取用户信息
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.functions.invoke("admin-get-user", {
          body: { userId: params.id },
        })

        if (error) throw error

        setUser(data.user)
        setFormData({
          name: data.user.user_metadata?.name || "",
          email: data.user.email || "",
          role: data.user.user_metadata?.role || "user",
          isActive: !data.user.banned,
        })
      } catch (err: any) {
        console.error("获取用户信息失败:", err)
        setError(err.message || "获取用户信息失败，请稍后再试")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [params.id])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // 更新用户信息
      const { data, error: updateError } = await supabase.functions.invoke("admin-update-user", {
        body: {
          userId: params.id,
          user_metadata: {
            name: formData.name,
            role: formData.role,
          },
          banned: !formData.isActive,
        },
      })

      if (updateError) throw updateError

      // 更新成功，跳转到用户详情页
      router.push(`/admin/users/${params.id}`)
      router.refresh()
    } catch (err: any) {
      console.error("更新用户失败:", err)
      setError(err.message || "更新用户失败，请稍后再试")
    } finally {
      setLoading(false)
    }
  }

  if (!user && !error) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/users/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">编辑用户</h1>
          <p className="text-muted-foreground">{formData.email}</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>用户信息</CardTitle>
            <CardDescription>编辑用户的基本信息</CardDescription>
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
                <Input id="email" type="email" value={formData.email} disabled placeholder="请输入邮箱" />
                <p className="text-sm text-muted-foreground">邮箱地址不可修改</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="status"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleChange("isActive", checked)}
                  />
                  <Label htmlFor="status">{formData.isActive ? "活跃" : "已禁用"}</Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/admin/users/${params.id}`}>取消</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              保存更改
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

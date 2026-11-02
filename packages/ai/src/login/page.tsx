"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "../lib/supabase/browser-client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // 登录成功，重定向到首页
      router.push("/")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "登录失败，请检查您的邮箱和密码")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-end bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-background.jpg')" }}
    >
      {/* 右侧登录表单 */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-black/30 backdrop-blur-sm p-8 rounded-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">YY-Nexus AI</h1>
            <p className="text-gray-300 mt-2">AI驱动的全链路内容中枢</p>
          </div>

          <div className="mb-8 flex justify-end">
            <div className="relative text-white text-lg font-medium">
              <span className="mr-6 pb-2 inline-block border-b-2 border-white">登录</span>
              <Link
                href="/auth/register"
                className="pb-2 inline-block text-gray-300 hover:text-white hover:border-b-2 hover:border-white transition-all"
              >
                注册
              </Link>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="text-white text-sm mb-1">输入邮箱</div>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-white text-sm mb-1">输入密码</div>
                <Link href="/auth/forgot-password" className="text-sm text-gray-300 hover:text-white">
                  忘记密码?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full"
              disabled={loading}
            >
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

// 不需要修改登录页面的代码，因为它已经可以使用任何有效的Supabase凭据登录
// 只需确保在创建管理员账户后，使用yy_ltd@163.com和My151001登录即可

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/browser-client"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    // 验证密码
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致")
      setLoading(false)
      return
    }

    // 验证密码强度
    if (password.length < 6) {
      setError("密码长度至少为6个字符")
      setLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      // 注册成功
      setMessage("注册成功！请检查您的邮箱进行验证。")
    } catch (error: any) {
      setError(error.message || "注册失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-end bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-background.jpg')" }}
    >
      {/* 右侧注册表单 */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-black/30 backdrop-blur-sm p-8 rounded-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">YY-Nexus AI</h1>
            <p className="text-gray-300 mt-2">AI驱动的全链路内容中枢</p>
          </div>

          <div className="mb-8 flex justify-end">
            <div className="relative text-white text-lg font-medium">
              <Link
                href="/login"
                className="mr-6 pb-2 inline-block text-gray-300 hover:text-white hover:border-b-2 hover:border-white transition-all"
              >
                登录
              </Link>
              <span className="pb-2 inline-block border-b-2 border-white">注册</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="bg-green-500/10 border-green-500/20 text-green-300">
                <AlertDescription>{message}</AlertDescription>
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
              <div className="text-white text-sm mb-1">设置密码</div>
              <Input
                id="password"
                type="password"
                placeholder="至少6个字符"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
              />
            </div>

            <div className="space-y-2">
              <div className="text-white text-sm mb-1">确认密码</div>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full"
              disabled={loading}
            >
              {loading ? "注册中..." : "注册"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

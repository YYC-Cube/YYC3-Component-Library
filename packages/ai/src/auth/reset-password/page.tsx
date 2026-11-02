"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "../../lib/supabase/browser-client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // 验证密码
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致")
      setLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setSuccess("密码重置成功！")

      // 3秒后重定向到登录页
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error: any) {
      setError(error.message || "重置密码失败，请稍后再试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-stretch bg-[#1a1150] relative overflow-hidden">
      {/* 背景波浪 */}
      <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-[#2a1b70] rounded-t-[50%] opacity-30"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-[#2a1b70] rounded-t-[40%] opacity-50"></div>

      {/* 左侧插图区域 */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8 relative">
        <div className="relative w-full max-w-md">
          <Image
            src="/images/login-illustration.svg"
            alt="智能城市插图"
            width={500}
            height={500}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* 右侧重置密码表单 */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">YY-Nexus AI</h1>
            <p className="text-gray-300 mt-2">AI驱动的全链路内容中枢</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">重置密码</h2>
            <p className="text-gray-300 mt-2">请设置您的新密码</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-500/10 border-green-500/20 text-green-300">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="text-white text-sm mb-1">新密码</div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
              />
            </div>

            <div className="space-y-2">
              <div className="text-white text-sm mb-1">确认新密码</div>
              <Input
                id="confirmPassword"
                type="password"
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
              {loading ? "重置中..." : "重置密码"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

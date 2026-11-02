"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader } from "lucide-react"

export default function CsrfProtectedForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [csrfToken, setCsrfToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  // 获取CSRF令牌
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("/api/csrf")
        const data = await response.json()
        setCsrfToken(data.csrfToken)
      } catch (error) {
        console.error("Error fetching CSRF token:", error)
      }
    }

    fetchCsrfToken()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!csrfToken) {
      setMessage("CSRF token not available. Please try again.")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Login successful!")
      } else {
        setMessage(`Error: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">CSRF保护登录表单</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">邮箱</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">密码</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {/* 隐藏的CSRF令牌 */}
        <input type="hidden" name="csrf_token" value={csrfToken} />

        <Button type="submit" className="w-full" disabled={isLoading || !csrfToken}>
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              登录中...
            </>
          ) : (
            "登录"
          )}
        </Button>

        {message && (
          <div
            className={`p-2 rounded text-center ${
              message.includes("successful") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <div className="text-xs text-white/50 text-center">{csrfToken ? "已启用CSRF保护" : "正在加载CSRF令牌..."}</div>
      </form>
    </div>
  )
}

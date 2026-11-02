"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement authentication logic here
    console.log(isLogin ? "Logging in" : "Signing up", { email, password })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-deep-space-blue">
      <div className="w-full max-w-md space-y-8 p-10 bg-slate-900/50 rounded-xl backdrop-blur-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">{isLogin ? "登录" : "注册"}</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-4"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isLogin ? "登录" : "注册"}
          </Button>
        </form>
        <div className="text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-blue-400 hover:text-blue-300">
            {isLogin ? "没有账号？注册" : "已有账号？登录"}
          </button>
        </div>
      </div>
    </div>
  )
}

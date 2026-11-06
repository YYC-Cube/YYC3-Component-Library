// ============================================================
// YYC³ · @yyc3/design contexts 真身（design 摘除件收尾批 · 2026-11-07）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/yyc3-design-system/contexts/AuthContext.tsx
// ============================================================
"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// 自愈登记（design 收尾批）：源件 User 为 internal，桶导出面需要——补 export
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
  avatar?: string
  department?: string
  position?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  hasRole: (role: string) => boolean
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 初始化时检查本地存储的用户信息
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (storedUser && token) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          console.log("从本地存储恢复用户信息:", userData)
        }
      } catch (error) {
        console.error("检查认证状态失败:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 测试账号验证
      const testAccounts = [
        {
          email: "admin@jinlan.com",
          password: "admin123",
          userData: {
            id: "1",
            name: "系统管理员",
            email: "admin@jinlan.com",
            role: "admin" as const,
            avatar: "/placeholder.svg?height=40&width=40",
            department: "信息技术部",
            position: "系统管理员",
          },
        },
        {
          email: "manager@jinlan.com",
          password: "manager123",
          userData: {
            id: "2",
            name: "部门经理",
            email: "manager@jinlan.com",
            role: "manager" as const,
            avatar: "/placeholder.svg?height=40&width=40",
            department: "销售部",
            position: "销售经理",
          },
        },
        {
          email: "user@jinlan.com",
          password: "user123",
          userData: {
            id: "3",
            name: "普通用户",
            email: "user@jinlan.com",
            role: "user" as const,
            avatar: "/placeholder.svg?height=40&width=40",
            department: "客服部",
            position: "客服专员",
          },
        },
      ]

      const account = testAccounts.find((acc) => acc.email === email && acc.password === password)

      if (account) {
        setUser(account.userData)
        localStorage.setItem("user", JSON.stringify(account.userData))
        localStorage.setItem("token", "mock-jwt-token")
        console.log("登录成功:", account.userData)
        return true
      }

      console.log("登录失败: 邮箱或密码错误")
      return false
    } catch (error) {
      console.error("登录失败:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUser(null)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      console.log("退出登录成功")
    } catch (error) {
      console.error("退出登录失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      console.log("用户信息已更新:", updatedUser)
    }
  }

  const hasRole = (role: string): boolean => {
    if (!user) return false

    // 角色层级权限
    const roleHierarchy: Record<string, string[]> = {
      admin: ["admin", "manager", "user"],
      manager: ["manager", "user"],
      user: ["user"],
    }

    return roleHierarchy[user.role]?.includes(role) || false
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    updateUser,
    hasRole,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

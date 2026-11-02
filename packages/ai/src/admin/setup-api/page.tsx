"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminSetupApiPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const setupAdmin = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    setResult(null)

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "创建管理员账户失败")
      }

      setSuccess(data.message || "管理员账户创建成功")
      setResult(data)
    } catch (error: any) {
      setError(error.message || "创建管理员账户失败")
      console.error("创建管理员账户失败:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>管理员账户设置 (API)</CardTitle>
          <CardDescription>通过API创建系统管理员账户</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="mb-4">
            <p>
              <strong>邮箱:</strong> yy_ltd@163.com
            </p>
            <p>
              <strong>密码:</strong> My151001
            </p>
            <p>
              <strong>角色:</strong> 管理员
            </p>
          </div>

          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <pre className="text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={setupAdmin} disabled={loading} className="w-full">
            {loading ? "创建中..." : "创建管理员账户"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

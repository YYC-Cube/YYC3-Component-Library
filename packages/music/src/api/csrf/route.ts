import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import crypto from "crypto"

// 生成CSRF令牌
export async function GET() {
  const csrfToken = crypto.randomBytes(32).toString("hex")

  // 设置CSRF令牌到Cookie
  const cookieStore = await cookies()
  cookieStore.set("csrf_token", csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1小时有效期
  })

  return NextResponse.json({ csrfToken })
}

// 验证CSRF令牌
export async function validateCsrfToken(request: Request) {
  const cookieStore = await cookies()
  const storedToken = cookieStore.get("csrf_token")?.value

  // 从请求头或请求体中获取CSRF令牌
  const requestToken = request.headers.get("X-CSRF-Token")

  if (!storedToken || !requestToken || storedToken !== requestToken) {
    return false
  }

  return true
}

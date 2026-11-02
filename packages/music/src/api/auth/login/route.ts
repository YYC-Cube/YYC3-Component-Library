import { NextResponse } from "next/server"
import { validateCsrfToken } from "../../csrf/route"

export async function POST(request: Request) {
  // 验证CSRF令牌
  const isValidCsrf = await validateCsrfToken(request)

  if (!isValidCsrf) {
    return NextResponse.json({ error: "CSRF token validation failed" }, { status: 403 })
  }

  try {
    const { email, password } = await request.json()

    // 这里是实际的登录逻辑
    // ...

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 401 })
  }
}

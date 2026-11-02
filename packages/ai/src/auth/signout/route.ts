// app/auth/signout/route.ts
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // 执行注销操作
  await supabase.auth.signOut()

  return NextResponse.json(
    {
      message: "注销成功"
    },
    { status: 200 }
  )
}

// 也可以支持GET请求，以便于直接通过链接注销
export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // 获取重定向URL（如果有）
  const redirectTo = request.nextUrl.searchParams.get("redirectTo") || "/"
  
  // 执行注销操作
  await supabase.auth.signOut()
  
  // 重定向到指定页面
  return NextResponse.redirect(new URL(redirectTo, request.url))
}

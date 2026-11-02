import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server-client"

export async function POST(request: Request) {
  try {
    // 检查权限
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const body = await request.json()
    const { userId } = body

    // 获取用户详情
    const { data, error } = await supabase.auth.admin.getUserById(userId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error: any) {
    console.error("获取用户详情失败:", error)
    return NextResponse.json({ error: error.message || "获取用户详情失败" }, { status: 500 })
  }
}

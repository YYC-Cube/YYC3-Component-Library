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
    const { userId, user_metadata, banned } = body

    // 更新用户
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata,
      banned,
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error: any) {
    console.error("更新用户失败:", error)
    return NextResponse.json({ error: error.message || "更新用户失败" }, { status: 500 })
  }
}

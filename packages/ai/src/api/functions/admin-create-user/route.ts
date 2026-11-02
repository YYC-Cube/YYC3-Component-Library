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
    const { email, password, user_metadata, email_confirm, send_email } = body

    // 创建用户
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: email_confirm || false,
      user_metadata,
    })

    if (error) {
      throw error
    }

    // 如果需要发送邀请邮件
    if (send_email) {
      // 在实际应用中，这里应该调用邮件发送服务
      console.log(`发送邀请邮件到 ${email}`)
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error: any) {
    console.error("创建用户失败:", error)
    return NextResponse.json({ error: error.message || "创建用户失败" }, { status: 500 })
  }
}

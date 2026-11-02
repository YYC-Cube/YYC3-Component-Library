import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server-client"

// 检查是否为管理员
async function checkAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  // 检查用户是否有管理员角色
  return user.user_metadata?.role === "admin"
}

// 创建用户
export async function POST(request: Request) {
  // 检查权限
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "权限不足" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { email, password, user_metadata, email_confirm, send_email } = body

    const supabase = await createClient()
    const adminClient = supabase.auth.admin

    // 创建用户
    const { data, error } = await adminClient.createUser({
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

// 获取用户列表
export async function GET() {
  // 检查权限
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "权限不足" }, { status: 403 })
  }

  try {
    const supabase = await createClient()
    const adminClient = supabase.auth.admin

    // 获取用户列表
    const { data, error } = await adminClient.listUsers()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, users: data.users })
  } catch (error: any) {
    console.error("获取用户列表失败:", error)
    return NextResponse.json({ error: error.message || "获取用户列表失败" }, { status: 500 })
  }
}

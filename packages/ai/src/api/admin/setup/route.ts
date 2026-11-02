import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    // 创建 Supabase 管理员客户端
    const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // 创建管理员用户
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: "yy_ltd@163.com",
      password: "My151001",
      email_confirm: true, // 自动确认邮箱
      user_metadata: {
        role: "admin",
        name: "管理员",
      },
    })

    if (error) {
      throw error
    }

    // 如果需要，可以在这里添加更多的管理员设置，比如添加到管理员角色表等

    return NextResponse.json({
      success: true,
      message: "管理员账户创建成功",
      user: data.user,
    })
  } catch (error: any) {
    console.error("创建管理员账户失败:", error)
    return NextResponse.json({ success: false, error: error.message || "创建管理员账户失败" }, { status: 500 })
  }
}

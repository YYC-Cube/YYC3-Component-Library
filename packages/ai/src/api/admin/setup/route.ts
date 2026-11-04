import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    // 创建 Supabase 管理员客户端
    const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // 创建管理员用户
    // 安全修复（Phase 1 债清理，2026-11-04）：原硬编码口令已移除——
    // 该 Supabase 项目已废弃、账号停用（Mimosa 分诊结论，MIGRATION_PLAN §五A），
    // 口令改为环境变量注入（若未来启用新项目，务必轮换并只经 env 传入）
    const adminEmail = process.env.ADMIN_SETUP_EMAIL
    const adminPassword = process.env.ADMIN_SETUP_PASSWORD
    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { success: false, message: "缺少 ADMIN_SETUP_EMAIL / ADMIN_SETUP_PASSWORD 环境变量" },
        { status: 400 },
      )
    }
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
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

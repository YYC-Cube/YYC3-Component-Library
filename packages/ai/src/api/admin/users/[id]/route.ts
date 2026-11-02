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

// 获取用户详情
export async function GET(request: Request, { params }: { params: { id: string } }) {
  // 检查权限
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "权限不足" }, { status: 403 })
  }

  try {
    const supabase = await createClient()
    const adminClient = supabase.auth.admin

    // 获取用户详情
    const { data, error } = await adminClient.getUserById(params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error: any) {
    console.error("获取用户详情失败:", error)
    return NextResponse.json({ error: error.message || "获取用户详情失败" }, { status: 500 })
  }
}

// 更新用户
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  // 检查权限
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "权限不足" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { user_metadata, banned } = body

    const supabase = await createClient()
    const adminClient = supabase.auth.admin

    // 更新用户
    const { data, error } = await adminClient.updateUserById(params.id, {
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

// 删除用户
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // 检查权限
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "权限不足" }, { status: 403 })
  }

  try {
    const supabase = await createClient()
    const adminClient = supabase.auth.admin

    // 删除用户
    const { error } = await adminClient.deleteUser(params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("删除用户失败:", error)
    return NextResponse.json({ error: error.message || "删除用户失败" }, { status: 500 })
  }
}

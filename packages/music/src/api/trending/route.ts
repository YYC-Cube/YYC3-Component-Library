import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

// 使用Next.js 13的缓存机制
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "all"

  // 使用标签进行缓存
  const data = await fetch(`https://api.example.com/trending?category=${category}`, {
    next: {
      tags: ["trending", `trending-${category}`],
      // 设置缓存时间
      revalidate: 3600, // 1小时缓存
    },
  }).then((res) => res.json())

  return NextResponse.json(data)
}

// 手动重新验证缓存的API端点
export async function POST(request: Request) {
  const { category } = await request.json()

  if (category) {
    // 重新验证特定标签
    revalidateTag(`trending-${category}`)
    return NextResponse.json({ revalidated: true, category })
  }

  // 重新验证整个路径
  revalidatePath("/api/trending")
  return NextResponse.json({ revalidated: true })
}

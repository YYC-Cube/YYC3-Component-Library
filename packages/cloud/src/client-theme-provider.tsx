"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProvider as ThemeProviderType } from "next-themes"
import { useEffect, useState } from "react"

// 客户端主题提供器，解决服务端渲染属性不匹配问题
export function ClientThemeProvider({ children, ...props }: React.ComponentProps<typeof ThemeProviderType>) {
  const [mounted, setMounted] = useState(false)

  // 确保只在客户端执行
  useEffect(() => {
    setMounted(true)
  }, [])

  // 防止服务端渲染时添加属性
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
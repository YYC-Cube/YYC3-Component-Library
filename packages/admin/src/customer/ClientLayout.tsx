"use client"

import type React from "react"
import { useEffect } from "react"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useEffect(() => {
    // 注册 Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker 注册成功:", registration)
        })
        .catch((error) => {
          console.log("Service Worker 注册失败:", error)
        })
    }

    // 初始化同步服务
    const initServices = async () => {
      try {
        console.log("开始初始化应用服务...")

        // 动态导入同步服务管理器
        const syncModule = await import("@/lib/sync-service-manager")
        const syncServiceManager = syncModule.syncServiceManager || syncModule.default

        if (!syncServiceManager) {
          throw new Error("同步服务管理器导入失败")
        }

        // 确保同步服务管理器已初始化
        await syncServiceManager.ensureInitialized()

        console.log("所有应用服务初始化完成")

        // 发送应用就绪事件
        window.dispatchEvent(new CustomEvent("appServicesReady"))
      } catch (error) {
        console.error("应用服务初始化失败:", error)

        // 发送初始化失败事件
        window.dispatchEvent(
          new CustomEvent("appServicesError", {
            detail: { error: String(error) },
          }),
        )
      }
    }

    // 延迟初始化，避免阻塞页面渲染
    const initTimer = setTimeout(initServices, 1000)

    return () => {
      clearTimeout(initTimer)
    }
  }, [])

  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}

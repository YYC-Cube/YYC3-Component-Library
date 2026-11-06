// ============================================================
// YYC³ · @yyc3/lib services 真身（lib services 真身批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/YYC-cloud-platform/lib/services/mobile-service.ts
// ============================================================
"use client"

import type React from "react"

/**
 * ⟨YYC³⟩ 移动端服务
 * 提供移动端适配和功能支持
 */

import { useEffect, useState } from "react"

export interface MobileDetectionOptions {
  mobileBreakpoint?: number
  tabletBreakpoint?: number
}

/**
 * 检测设备类型的Hook
 */
export function useDeviceDetection(options: MobileDetectionOptions = {}) {
  const mobileBreakpoint = options.mobileBreakpoint || 640
  const tabletBreakpoint = options.tabletBreakpoint || 1024

  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth

      if (width < mobileBreakpoint) {
        setDeviceType("mobile")
      } else if (width < tabletBreakpoint) {
        setDeviceType("tablet")
      } else {
        setDeviceType("desktop")
      }

      setOrientation(window.innerHeight > window.innerWidth ? "portrait" : "landscape")
    }

    // 初始检测
    handleResize()

    // 监听窗口大小变化
    window.addEventListener("resize", handleResize)

    // 监听方向变化
    window.addEventListener("orientationchange", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
    }
  }, [mobileBreakpoint, tabletBreakpoint])

  return {
    deviceType,
    orientation,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop",
  }
}

/**
 * 检测触摸支持的Hook
 */
export function useTouchDetection() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const detectTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0,
      )
    }

    detectTouch()
  }, [])

  return { isTouchDevice }
}

/**
 * PWA安装提示Hook
 */
export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // 检查是否已安装
    const checkInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true)
      }
    }

    checkInstalled()

    // 监听beforeinstallprompt事件
    const handleBeforeInstallPrompt = (e: Event) => {
      // 阻止Chrome 67及更早版本自动显示安装提示
      e.preventDefault()
      // 保存事件，以便稍后触发
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    // 监听appinstalled事件
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const promptInstall = async () => {
    if (!deferredPrompt) {
      return false
    }

    // 显示安装提示
    deferredPrompt.prompt()

    // 等待用户响应
    const choiceResult = await deferredPrompt.userChoice

    // 重置延迟提示变量
    setDeferredPrompt(null)
    setCanInstall(false)

    return choiceResult.outcome === "accepted"
  }

  return { canInstall, isInstalled, promptInstall }
}

/**
 * 移动端手势支持Hook
 */
export function useGestures(element: React.RefObject<HTMLElement | null>) {
  const [gesture, setGesture] = useState<"none" | "swipe-left" | "swipe-right" | "swipe-up" | "swipe-down">("none")

  useEffect(() => {
    if (!element.current) return

    let touchStartX = 0
    let touchStartY = 0
    let touchEndX = 0
    let touchEndY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX
      touchEndY = e.changedTouches[0].clientY
      handleGesture()
    }

    const handleGesture = () => {
      // 计算水平和垂直滑动距离
      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY

      // 确定主要滑动方向
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        if (deltaX > 50) {
          setGesture("swipe-right")
        } else if (deltaX < -50) {
          setGesture("swipe-left")
        }
      } else {
        // 垂直滑动
        if (deltaY > 50) {
          setGesture("swipe-down")
        } else if (deltaY < -50) {
          setGesture("swipe-up")
        }
      }

      // 重置手势状态
      setTimeout(() => {
        setGesture("none")
      }, 500)
    }

    const el = element.current
    el.addEventListener("touchstart", handleTouchStart)
    el.addEventListener("touchend", handleTouchEnd)

    return () => {
      el.removeEventListener("touchstart", handleTouchStart)
      el.removeEventListener("touchend", handleTouchEnd)
    }
  }, [element])

  return { gesture }
}

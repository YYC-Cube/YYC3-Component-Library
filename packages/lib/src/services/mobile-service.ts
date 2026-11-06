// ============================================================
// YYC³ · @yyc3/lib services 轻量桩层（桩 2/4）
// 移动设备检测 hooks：设备类型/手势/触屏检测（浏览器 API 降级）
// ============================================================
import { useState, useEffect } from 'react'
import type * as React from 'react'

export interface DeviceDetection {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouchDevice: boolean
  deviceType: 'mobile' | 'tablet' | 'desktop'
  orientation: 'portrait' | 'landscape'
}

export function useDeviceDetection(): DeviceDetection {
  const [detection, setDetection] = useState<DeviceDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    deviceType: 'desktop',
    orientation: 'landscape',
  })

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setDetection({
        isMobile: w < 768,
        isTablet: w >= 768 && w < 1024,
        isDesktop: w >= 1024,
        isTouchDevice: touch,
        deviceType: w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop',
        orientation: w > h ? 'landscape' : 'portrait',
      })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return detection
}

export function useGestures(
  target: React.RefObject<HTMLElement | null>,
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void,
): { gesture: string } {
  const [gesture, setGesture] = useState('none')

  useEffect(() => {
    const el = target?.current
    if (!el) return
    let startX = 0
    let startY = 0
    const handleStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
    const handleEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        setGesture(dx > 0 ? 'swipe-right' : 'swipe-left')
        onSwipe?.(dx > 0 ? 'right' : 'left')
      } else if (Math.abs(dy) > 50) {
        setGesture(dy > 0 ? 'swipe-down' : 'swipe-up')
        onSwipe?.(dy > 0 ? 'down' : 'up')
      }
    }
    el.addEventListener('touchstart', handleStart, { passive: true })
    el.addEventListener('touchend', handleEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', handleStart)
      el.removeEventListener('touchend', handleEnd)
    }
  }, [target, onSwipe])

  return { gesture }
}

export function useTouchDetection(): { isTouchDevice: boolean } {
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])
  return { isTouchDevice }
}

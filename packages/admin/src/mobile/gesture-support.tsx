"use client"

import type React from "react"

import { useState, useRef } from "react"
import { cn } from "@yyc3/lib/utils"

interface SwipeableProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  className?: string
  threshold?: number
  preventDefaultTouchmove?: boolean
}

export function Swipeable({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className,
  threshold = 50,
  preventDefaultTouchmove = false,
}: SwipeableProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })
  const [isSwiping, setIsSwiping] = useState(false)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
    setIsSwiping(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (preventDefaultTouchmove) {
      e.preventDefault()
    }
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchEnd = () => {
    setIsSwiping(false)

    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y

    // Check if the swipe distance exceeds the threshold
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      // Determine the direction of the swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          onSwipeLeft && onSwipeLeft()
        } else {
          onSwipeRight && onSwipeRight()
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          onSwipeUp && onSwipeUp()
        } else {
          onSwipeDown && onSwipeDown()
        }
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("touch-pan-y", className)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  )
}

interface PinchZoomProps {
  children: React.ReactNode
  className?: string
  maxScale?: number
  minScale?: number
  onZoomChange?: (scale: number) => void
}

export function PinchZoom({ children, className, maxScale = 3, minScale = 1, onZoomChange }: PinchZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [initialDistance, setInitialDistance] = useState<number | null>(null)

  const getDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null

    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches)
      if (distance) setInitialDistance(distance)
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistance) {
      const currentDistance = getDistance(e.touches)
      if (currentDistance) {
        const newScale = Math.min(maxScale, Math.max(minScale, scale * (currentDistance / initialDistance)))
        setScale(newScale)
        onZoomChange && onZoomChange(newScale)
        setInitialDistance(currentDistance)
      }
    }
  }

  const onTouchEnd = () => {
    setInitialDistance(null)
  }

  return (
    <div
      ref={containerRef}
      className={cn("touch-none", className)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
          transition: "transform 0.1s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  )
}

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
  className?: string
  pullDistance?: number
  refreshingText?: string
  pullingText?: string
  releaseText?: string
}

export function PullToRefresh({
  children,
  onRefresh,
  className,
  pullDistance = 80,
  refreshingText = "刷新中...",
  pullingText = "下拉刷新",
  releaseText = "释放刷新",
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPulling, setIsPulling] = useState(false)
  const [pullY, setPullY] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const touchStartY = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull-to-refresh when at the top of the page
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return

    const touchY = e.touches[0].clientY
    const diff = touchY - touchStartY.current

    // Only allow pulling down
    if (diff > 0) {
      // Apply resistance to make the pull feel natural
      const newPullY = Math.min(pullDistance * 1.5, diff * 0.5)
      setPullY(newPullY)

      // Prevent default when pulling to avoid page scrolling
      if (newPullY > 10) {
        e.preventDefault()
      }
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling) return

    setIsPulling(false)

    // If pulled enough, trigger refresh
    if (pullY >= pullDistance) {
      setIsRefreshing(true)
      setPullY(pullDistance / 2) // Show partial indicator during refresh

      try {
        await onRefresh()
      } catch (error) {
        console.error("Refresh failed:", error)
      }

      setIsRefreshing(false)
    }

    // Reset pull distance with animation
    setPullY(0)
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center text-sm text-muted-foreground transition-transform duration-200"
        style={{
          transform: `translateY(${pullY - 40}px)`,
          opacity: Math.min(1, pullY / 40),
        }}
      >
        {isRefreshing ? refreshingText : pullY >= pullDistance ? releaseText : pullingText}
      </div>

      {/* Content with pull effect */}
      <div
        style={{
          transform: `translateY(${pullY}px)`,
          transition: isPulling ? "none" : "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@yyc3/lib/utils"

interface VirtualizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  height: number | string
  itemHeight: number
  className?: string
  overscan?: number
  onEndReached?: () => void
  endReachedThreshold?: number
  keyExtractor?: (item: T, index: number) => string
}

export function VirtualizedList<T>({
  items,
  renderItem,
  height,
  itemHeight,
  className,
  overscan = 5,
  onEndReached,
  endReachedThreshold = 200,
  keyExtractor = (_, index) => index.toString(),
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [isEndReached, setIsEndReached] = useState(false)

  // 计算可见区域
  const visibleHeight = typeof height === "number" ? height : 0
  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(items.length - 1, Math.floor((scrollTop + visibleHeight) / itemHeight) + overscan)

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    setScrollTop(scrollTop)

    // 检测是否滚动到底部
    if (!isEndReached && onEndReached && scrollHeight - scrollTop - clientHeight < endReachedThreshold) {
      setIsEndReached(true)
      onEndReached()
    } else if (isEndReached && scrollHeight - scrollTop - clientHeight >= endReachedThreshold) {
      setIsEndReached(false)
    }
  }, [isEndReached, onEndReached, endReachedThreshold])

  // 添加滚动事件监听
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("scroll", handleScroll)
    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // 计算可见项目
  const visibleItems = []
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      item: items[i],
      index: i,
      key: keyExtractor(items[i], i),
      style: {
        position: "absolute",
        top: i * itemHeight,
        height: itemHeight,
        left: 0,
        right: 0,
      },
    })
  }

  return (
    <div ref={containerRef} className={cn("overflow-auto relative", className)} style={{ height }}>
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map(({ item, index, key, style }) => (
          <div key={key} style={style as React.CSSProperties}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}

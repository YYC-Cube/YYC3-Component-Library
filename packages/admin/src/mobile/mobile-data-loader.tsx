"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Loader2 } from "lucide-react"
import { PullToRefresh } from "@/components/mobile/gesture-support"
import { cn } from "@yyc3/lib/utils"

interface MobileDataLoaderProps<T> {
  fetchData: (page: number, limit: number) => Promise<T[]>
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T) => string
  initialLimit?: number
  loadMoreLimit?: number
  className?: string
  emptyMessage?: string
  loadingMessage?: string
  errorMessage?: string
}

export function MobileDataLoader<T>({
  fetchData,
  renderItem,
  keyExtractor,
  initialLimit = 10,
  loadMoreLimit = 10,
  className,
  emptyMessage = "没有数据",
  loadingMessage = "加载中...",
  errorMessage = "加载失败，请重试",
}: MobileDataLoaderProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(
    async (pageNum: number, limit: number, append = false) => {
      try {
        setError(null)

        if (pageNum === 1) {
          setIsLoading(true)
        } else {
          setIsLoadingMore(true)
        }

        const newData = await fetchData(pageNum, limit)

        if (append) {
          setData((prev) => [...prev, ...newData])
        } else {
          setData(newData)
        }

        setHasMore(newData.length === limit)
      } catch (err) {
        setError(errorMessage)
        console.error("Error loading data:", err)
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [fetchData, errorMessage],
  )

  // Initial data load
  useEffect(() => {
    loadData(1, initialLimit)
  }, [loadData, initialLimit])

  // Handle refresh
  const handleRefresh = async () => {
    setPage(1)
    await loadData(1, initialLimit)
  }

  // Handle load more
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return

    const nextPage = page + 1
    setPage(nextPage)
    await loadData(nextPage, loadMoreLimit, true)
  }

  // Detect when user scrolls to bottom
  const handleScroll = useCallback(() => {
    if (isLoadingMore || !hasMore) return

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
    const clientHeight = document.documentElement.clientHeight || window.innerHeight

    // Load more when user scrolls to bottom (with a 200px threshold)
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      handleLoadMore()
    }
  }, [isLoadingMore, hasMore])

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <PullToRefresh onRefresh={handleRefresh} className={className}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">{loadingMessage}</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-sm text-destructive">{error}</p>
          <button className="mt-2 text-sm text-primary" onClick={() => loadData(page, initialLimit, page > 1)}>
            重试
          </button>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className={cn("space-y-2", className)}>
          {data.map((item, index) => (
            <div key={keyExtractor(item)}>{renderItem(item, index)}</div>
          ))}

          {isLoadingMore && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {!isLoadingMore && hasMore && (
            <div className="flex justify-center py-4">
              <button className="text-sm text-primary" onClick={handleLoadMore}>
                加载更多
              </button>
            </div>
          )}

          {!hasMore && data.length > initialLimit && (
            <div className="flex justify-center py-4">
              <p className="text-xs text-muted-foreground">已加载全部数据</p>
            </div>
          )}
        </div>
      )}
    </PullToRefresh>
  )
}

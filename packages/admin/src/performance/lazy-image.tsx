"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { cn } from "@yyc3/lib/utils"
import { Skeleton } from "@yyc3/ui/skeleton"

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  placeholderSrc?: string
  fallbackSrc?: string
  className?: string
  containerClassName?: string
  loadingClassName?: string
  threshold?: number
  onLoad?: () => void
  onError?: () => void
}

export function LazyImage({
  src,
  alt,
  placeholderSrc,
  fallbackSrc,
  className,
  containerClassName,
  loadingClassName,
  threshold = 0.1,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 使用 IntersectionObserver 检测元素是否在视口中
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { threshold },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  // 处理图片加载
  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  // 处理图片加载错误
  const handleError = () => {
    setIsError(true)
    onError?.()
  }

  // 实际显示的图片源
  const displaySrc = isError && fallbackSrc ? fallbackSrc : src

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", containerClassName)}
      style={{ aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : undefined }}
    >
      {!isLoaded && (
        <div className={cn("absolute inset-0", loadingClassName)}>
          {placeholderSrc ? (
            <img
              src={placeholderSrc || "/placeholder.svg"}
              alt={alt}
              className={cn("w-full h-full object-cover blur-sm", className)}
              {...props}
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>
      )}

      {isInView && (
        <img
          ref={imgRef}
          src={displaySrc || "/placeholder.svg"}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className,
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  )
}

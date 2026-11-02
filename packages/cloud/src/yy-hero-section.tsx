/**
 * ⟨YYC³⟩ 英雄区域组件
 * 主页的核心展示区域，包含3D效果和品牌标语
 */
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ArrowRight, Sparkles, Zap } from "lucide-react"

// 简化的按钮组件
function SimpleButton({
  children,
  variant = "default",
  className = "",
  ...props
}: {
  children: React.ReactNode
  variant?: "default" | "outline"
  className?: string
  [key: string]: any
}) {
  const baseClasses =
    "inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300 yy-3d-button"

  const variantClasses = {
    default:
      "bg-gradient-to-r from-yy-cloud-standard to-yy-cloud-light hover:from-yy-cloud-light hover:to-yy-cloud-standard text-white",
    outline: "border-2 border-yy-cloud-standard text-yy-cloud-standard hover:bg-yy-cloud-standard hover:text-white",
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function YYHeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D背景元素 */}
      <div className="absolute inset-0 perspective-1000">
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-yy-cloud-standard to-yy-cloud-light rounded-lg opacity-20 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-yy-ink-standard to-yy-cloud-standard rounded-lg opacity-15 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-br from-yy-cloud-light to-yy-jade-white rounded-lg opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 主标题 */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-tech font-bold mb-6">
            <span className="block yy-gradient-text animate-pulse">YanYu Cloud³</span>
            <span className="block text-3xl md:text-4xl font-sans font-normal text-yy-ink-standard/80 mt-4">
              言语云³平台
            </span>
          </h1>

          {/* 品牌标语 */}
          <div className="space-y-4 mb-12">
            <p className="text-xl md:text-2xl font-medium text-yy-ink-standard">万象归元于云枢，深栈智启新纪元</p>
            <p className="text-lg md:text-xl text-yy-ink-standard/70 font-tech">
              All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era
            </p>
          </div>
        </div>

        {/* 特性标签 */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center space-x-2 bg-yy-cloud-standard/10 px-4 py-2 rounded-full yy-3d-card">
            <Sparkles className="h-5 w-5 text-yy-cloud-standard" />
            <span className="text-sm font-medium text-yy-ink-standard">智能云计算</span>
          </div>
          <div className="flex items-center space-x-2 bg-yy-ink-standard/10 px-4 py-2 rounded-full yy-3d-card">
            <Zap className="h-5 w-5 text-yy-ink-standard" />
            <span className="text-sm font-medium text-yy-ink-standard">深度学习</span>
          </div>
          <div className="flex items-center space-x-2 bg-yy-cloud-light/20 px-4 py-2 rounded-full yy-3d-card">
            <ArrowRight className="h-5 w-5 text-yy-cloud-standard" />
            <span className="text-sm font-medium text-yy-ink-standard">未来科技</span>
          </div>
        </div>

        {/* 行动按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <SimpleButton>
            深栈智启
            <ArrowRight className="ml-2 h-5 w-5" />
          </SimpleButton>
          <SimpleButton variant="outline">了解更多</SimpleButton>
        </div>

        {/* 版本信息 */}
        <div className="mt-16 text-center">
          <p className="text-sm text-yy-ink-standard/50 font-tech">YYC³ Platform v1.0.0 | 言枢象限·语启未来</p>
        </div>
      </div>
    </section>
  )
}

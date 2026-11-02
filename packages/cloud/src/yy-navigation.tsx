/**
 * ⟨YYC³⟩ 主导航组件 - 增强版
 * 包含动画logo和立体按钮效果
 */
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Cloud, Cpu, Database, Settings, Code, Shield } from "lucide-react"

// 增强的3D按钮组件
function Enhanced3DButton({
  children,
  variant = "ghost",
  className = "",
  ...props
}: {
  children: React.ReactNode
  variant?: "ghost" | "primary" | "secondary"
  className?: string
  [key: string]: any
}) {
  const baseClasses = "relative overflow-hidden transition-all duration-300 transform-gpu"

  const variantClasses = {
    ghost:
      "text-yy-ink-standard hover:bg-yy-cloud-standard/10 hover:text-yy-cloud-standard hover:shadow-lg hover:shadow-yy-cloud-standard/20 hover:-translate-y-1 hover:scale-105",
    primary:
      "bg-gradient-to-r from-yy-cloud-standard to-yy-cloud-light text-white hover:from-yy-cloud-light hover:to-yy-cloud-standard hover:shadow-xl hover:shadow-yy-cloud-standard/40 hover:-translate-y-2 hover:scale-110",
    secondary:
      "bg-gradient-to-r from-yy-ink-standard to-yy-ink-deep text-white hover:from-yy-ink-deep hover:to-yy-ink-standard hover:shadow-xl hover:shadow-yy-ink-standard/40 hover:-translate-y-2 hover:scale-110",
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
      {...props}
    >
      {/* 3D底面效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20 transform translate-y-1 translate-x-1 -z-10 rounded-inherit opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* 发光效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-yy-cloud-standard/20 to-yy-cloud-light/20 rounded-inherit opacity-0 transition-opacity duration-300 hover:opacity-100 blur-sm" />

      <span className="relative z-10">{children}</span>
    </button>
  )
}

// 动画Logo组件
function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  return (
    <div className="flex items-center space-x-4">
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          setIsClicked(true)
          setTimeout(() => setIsClicked(false), 600)
        }}
      >
        {/* Logo容器 */}
        <div
          className={`
            relative transition-all duration-500 transform-gpu
            ${isHovered ? "scale-110 rotate-3" : "scale-100 rotate-0"}
            ${isClicked ? "scale-125 rotate-12" : ""}
          `}
          style={{
            transformStyle: "preserve-3d",
            filter: isHovered ? "drop-shadow(0 10px 20px rgba(74, 144, 226, 0.3))" : "none",
          }}
        >
          {/* 发光背景 */}
          <div
            className={`
              absolute inset-0 bg-gradient-to-br from-yy-cloud-standard/30 to-yy-cloud-light/30 
              rounded-xl blur-lg transition-all duration-500
              ${isHovered ? "scale-150 opacity-100" : "scale-100 opacity-0"}
            `}
          />

          {/* 3D阴影 */}
          <div
            className={`
              absolute inset-0 bg-gradient-to-br from-yy-ink-standard/20 to-yy-ink-deep/20 
              rounded-xl transform transition-all duration-300
              ${isHovered ? "translate-x-2 translate-y-2 opacity-60" : "translate-x-1 translate-y-1 opacity-30"}
            `}
          />

          {/* Logo图片 */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-HvrEynfe5FlEE6cskP5mZPvrPXsySm.png"
            alt="YYC³ Logo"
            className={`
              relative h-12 w-auto rounded-xl transition-all duration-300
              ${isHovered ? "brightness-110 contrast-110" : "brightness-100"}
              ${isClicked ? "brightness-125" : ""}
            `}
          />

          {/* 粒子效果 */}
          {isClicked && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-yy-cloud-standard rounded-full animate-ping"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 100}ms`,
                    animationDuration: "600ms",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 品牌文字 */}
      <div className="hidden md:block">
        <h1
          className={`
          text-xl font-tech font-bold transition-all duration-300
          ${isHovered ? "yy-gradient-text scale-105" : "text-yy-ink-standard"}
        `}
        >
          YanYu Cloud³
        </h1>
        <p
          className={`
          text-xs transition-all duration-300
          ${isHovered ? "text-yy-cloud-standard" : "text-yy-ink-standard/70"}
        `}
        >
          言枢象限·语启未来
        </p>
      </div>
    </div>
  )
}

export function YYNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "云枢中心", icon: Cloud },
    { href: "/compute", label: "算力引擎", icon: Cpu },
    { href: "/storage", label: "数据仓库", icon: Database },
    { href: "/development", label: "开发工坊", icon: Code },
    { href: "/security", label: "安全堡垒", icon: Shield },
    { href: "/settings", label: "系统配置", icon: Settings },
  ]

  return (
    <nav className="relative z-50 bg-yy-jade-white/80 backdrop-blur-xl border-b border-yy-cloud-standard/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo区域 */}
          <AnimatedLogo />

          {/* 桌面导航菜单 */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} className="group">
                  <Enhanced3DButton
                    variant="ghost"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    <Icon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                    <span>{item.label}</span>
                  </Enhanced3DButton>
                </Link>
              )
            })}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <Enhanced3DButton variant="ghost" className="p-2 rounded-lg" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Enhanced3DButton>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-yy-jade-white/95 backdrop-blur-xl border-b border-yy-cloud-standard/20 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} className="block" onClick={() => setIsOpen(false)}>
                    <Enhanced3DButton
                      variant="ghost"
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-left"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Enhanced3DButton>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

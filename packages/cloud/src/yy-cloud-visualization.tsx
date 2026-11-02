/**
 * ⟨YYC³⟩ 云端可视化组件
 * 3D立体云计算架构展示
 */
"use client"

import { useEffect, useState } from "react"

export function YYCloudVisualization() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="py-24 bg-gradient-to-b from-yy-jade-white to-yy-cloud-light/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-tech font-bold yy-gradient-text mb-6">云枢架构</h2>
          <p className="text-xl text-yy-ink-standard/70 max-w-3xl mx-auto">
            基于深度学习的智能云计算平台，实现万象归元的技术融合
          </p>
        </div>

        {/* 3D云架构可视化 */}
        <div className="relative perspective-2000 h-96">
          {/* 核心云枢 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 bg-gradient-to-br from-yy-cloud-standard to-yy-ink-standard rounded-2xl yy-3d-card animate-glow shadow-2xl flex items-center justify-center">
              <span className="text-white font-tech font-bold text-lg">YYC³</span>
            </div>
          </div>

          {/* 周围的功能模块 */}
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 bg-gradient-to-br from-yy-cloud-light to-yy-cloud-standard rounded-xl yy-3d-card opacity-80 flex items-center justify-center animate-float">
              <span className="text-white font-medium text-sm">算力</span>
            </div>
          </div>

          <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2">
            <div
              className="w-24 h-24 bg-gradient-to-br from-yy-ink-standard to-yy-cloud-standard rounded-xl yy-3d-card opacity-80 flex items-center justify-center animate-float"
              style={{ animationDelay: "1s" }}
            >
              <span className="text-white font-medium text-sm">存储</span>
            </div>
          </div>

          <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2">
            <div
              className="w-24 h-24 bg-gradient-to-br from-yy-cloud-standard to-yy-cloud-light rounded-xl yy-3d-card opacity-80 flex items-center justify-center animate-float"
              style={{ animationDelay: "2s" }}
            >
              <span className="text-white font-medium text-sm">网络</span>
            </div>
          </div>

          <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2">
            <div
              className="w-24 h-24 bg-gradient-to-br from-yy-ink-deep to-yy-ink-standard rounded-xl yy-3d-card opacity-80 flex items-center justify-center animate-float"
              style={{ animationDelay: "3s" }}
            >
              <span className="text-white font-medium text-sm">安全</span>
            </div>
          </div>

          {/* 连接线 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(74, 144, 226)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(26, 62, 94)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <line
              x1="50%"
              y1="50%"
              x2="25%"
              y2="25%"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="50%"
              x2="75%"
              y2="25%"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="50%"
              x2="25%"
              y2="75%"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="50%"
              x2="75%"
              y2="75%"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}

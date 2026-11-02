/**
 * ⟨YYC³⟩ 统计数据展示组件 - 简化版
 * 不依赖复杂hooks的统计数据展示
 */
"use client"

import { Cpu, Database, Network, Users } from "lucide-react"
import { useState, useEffect, useRef } from "react"

const stats = [
  {
    id: "servers",
    label: "服务器节点",
    value: 5280,
    unit: "台",
    icon: Cpu,
  },
  {
    id: "storage",
    label: "存储容量",
    value: 18,
    unit: "PB",
    icon: Database,
  },
  {
    id: "requests",
    label: "日请求量",
    value: 8500000,
    unit: "次/日",
    icon: Network,
  },
  {
    id: "users",
    label: "用户数量",
    value: 125000,
    unit: "+",
    icon: Users,
  },
]

function YYStatCard({ stat, delay = 0 }: { stat: any; delay?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        const duration = 2000
        const start = 0
        const end = stat.value
        const increment = end / (duration / 16)
        let current = start

        const timer = setInterval(() => {
          current += increment
          if (current >= end) {
            current = end
            clearInterval(timer)
          }
          setCount(Math.floor(current))
        }, 16)

        return () => clearInterval(timer)
      }, delay)

      return () => clearTimeout(timeout)
    }
  }, [isVisible, stat.value, delay])

  const formatValue = (value: number) => {
    if (value >= 1e9) return (value / 1e9).toFixed(1) + "B"
    if (value >= 1e6) return (value / 1e6).toFixed(1) + "M"
    if (value >= 1e3) return (value / 1e3).toFixed(1) + "K"
    return value.toString()
  }

  return (
    <div
      ref={elementRef}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-yy-cloud-standard/10 yy-3d-card relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yy-cloud-standard/20 to-yy-ink-standard/20 flex items-center justify-center">
          <stat.icon className="h-5 w-5 text-yy-cloud-standard" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-end space-x-2">
          <span className="text-3xl font-tech font-bold text-yy-ink-standard">{formatValue(count)}</span>
          <span className="text-lg text-muted-foreground pb-1">{stat.unit}</span>
        </div>

        <div className="flex items-center space-x-1 text-sm text-green-500">
          <span>↗</span>
          <span>12.5%</span>
          <span className="text-muted-foreground">vs 上月</span>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yy-cloud-standard/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
    </div>
  )
}

export function YYStatsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-yy-jade-white to-yy-cloud-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-tech font-bold yy-gradient-text mb-6">平台数据</h2>
          <p className="text-xl text-yy-ink-standard/70 max-w-3xl mx-auto">言语云³平台强大的基础设施和服务能力</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <YYStatCard key={stat.id} stat={stat} delay={index * 200} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-yy-ink-standard/50">* 数据更新于 2024年5月28日</p>
        </div>
      </div>
    </section>
  )
}

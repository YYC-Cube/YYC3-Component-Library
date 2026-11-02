/**
 * ⟨YYC³⟩ 特性网格组件 - 简化版
 * 不依赖复杂hooks的特性展示网格
 */
"use client"

import { Cloud, Database, Shield, Cpu, Code, BarChart, Layers, Network } from "lucide-react"

const features = [
  {
    id: "smart-computing",
    title: "智能云计算",
    description: "基于深度学习的智能云计算架构，提供高效、灵活的计算资源调度",
    icon: Cloud,
    status: "active",
  },
  {
    id: "high-performance-storage",
    title: "高性能存储",
    description: "分布式存储系统，支持PB级数据存储，提供高吞吐、低延迟的数据访问",
    icon: Database,
    status: "active",
  },
  {
    id: "security-protection",
    title: "安全防护",
    description: "多层次安全架构，包括身份认证、访问控制、数据加密和入侵检测",
    icon: Shield,
    status: "active",
  },
  {
    id: "compute-engine",
    title: "算力引擎",
    description: "GPU/TPU加速计算集群，为AI训练和推理提供强大算力支持",
    icon: Cpu,
    status: "beta",
  },
  {
    id: "development-tools",
    title: "开发工具链",
    description: "一站式开发环境，支持多语言、多框架的应用开发和部署",
    icon: Code,
    status: "active",
  },
  {
    id: "network-acceleration",
    title: "网络加速",
    description: "全球加速网络，优化数据传输路径，降低延迟，提升用户体验",
    icon: Network,
    status: "active",
  },
  {
    id: "data-analytics",
    title: "数据分析",
    description: "实时数据处理和分析平台，支持大规模数据挖掘和商业智能",
    icon: BarChart,
    status: "active",
  },
  {
    id: "microservices",
    title: "微服务架构",
    description: "基于容器的微服务架构，支持服务编排、自动扩缩容和负载均衡",
    icon: Layers,
    status: "coming-soon",
  },
]

function FeatureCard({ feature }: { feature: any }) {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    beta: "bg-yellow-100 text-yellow-800",
    "coming-soon": "bg-gray-100 text-gray-800",
  }

  const statusLabels = {
    active: "已发布",
    beta: "测试版",
    "coming-soon": "即将推出",
  }

  return (
    <div className="bg-gradient-to-br from-white/90 to-yy-cloud-light/10 border-yy-cloud-standard/20 rounded-xl border shadow-lg transition-all duration-300 yy-3d-card p-6 hover:shadow-2xl hover:shadow-yy-cloud-standard/20">
      <div className="flex flex-col space-y-1.5 pb-4">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yy-cloud-standard to-yy-ink-standard flex items-center justify-center">
            <feature.icon className="h-6 w-6 text-white" />
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[feature.status]}`}>
            {statusLabels[feature.status]}
          </span>
        </div>
        <h3 className="text-xl font-tech font-bold leading-none tracking-tight yy-gradient-text">{feature.title}</h3>
      </div>
      <div>
        <p className="text-base leading-relaxed text-muted-foreground">{feature.description}</p>
      </div>
    </div>
  )
}

export function YYFeatureGrid() {
  return (
    <section className="py-24 bg-gradient-to-b from-yy-cloud-light/5 to-yy-jade-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-tech font-bold yy-gradient-text mb-6">核心特性</h2>
          <p className="text-xl text-yy-ink-standard/70 max-w-3xl mx-auto">
            言语云³平台提供全方位的云计算服务，满足企业数字化转型需求
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

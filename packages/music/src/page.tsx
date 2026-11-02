"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { Star, TrendingUp, Award, Gift, AlertTriangle } from "lucide-react"
import RankingBoard from "./components/home/RankingBoard"
import StarPowerInfo from "./components/info/StarPowerInfo"
import AntiCheatSystem from "./components/security/AntiCheatSystem"
import GeoBroadcastSystem from "./components/broadcast/GeoBroadcastSystem"
import EnhancedRankingSystem from "./components/ranking/EnhancedRankingSystem"
import CreativeSceneEmpowerment from "./components/creative-scene-empowerment"
import ComplianceRiskControl from "./components/compliance-risk-control"
import BackendManagement from "./components/backend-management"
import BusinessValueAnalysis from "./components/business-value-analysis"
import { Button } from "@/components/ui/button"
import AIMVGenerator from "./components/creation/AIMVGenerator"
import MultimediaDIYWorkshop from "./components/creation/MultimediaDIYWorkshop"
import CrossModalInteractive from "./components/cross-modal-interactive"
import CreationWorkflow from "./components/creation/CreationWorkflow"
import InnovativeInteractions from "./components/innovative-interactions"
import DynamicSkinSystem from "./components/dynamic-skin-system"
import VideoCommunity from "./components/community/VideoCommunity"
import { ErrorBoundary } from "react-error-boundary"

// 模拟核心算法和工具函数
const simulateAIGeneration = async (content: string, type: "video" | "music") => {
  console.log(`正在为${type}生成AI内容:`, content)
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return `generated_${type}_url.${type === "video" ? "mp4" : "mp3"}`
}

const addInvisibleWatermark = (content: string) => {
  console.log("正在为内容添加隐形数字水印:", content)
  return `watermarked_${content}`
}

const checkCopyrightViolation = async (content: string) => {
  console.log("正在检查版权违规:", content)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return Math.random() > 0.9 // 10%的版权违规概率
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="text-red-500 p-4 bg-red-100 rounded-lg">
      <p>出现错误:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-gray-300">加载中...</span>
    </div>
  )
}

function Home() {
  const [showStarPowerInfo, setShowStarPowerInfo] = useState(false)
  const [isLowPowerMode, setIsLowPowerMode] = useState(false)
  const [userSubscription, setUserSubscription] = useState<"basic" | "premium" | "enterprise">("basic")
  const [showCopyrightWarning, setShowCopyrightWarning] = useState(false)

  // 模拟性能优化
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      const isLowPowerDevice = Math.random() < 0.3 // 30%概率为低性能设备
      setIsLowPowerMode(isLowPowerDevice)
    }

    checkDeviceCapabilities()
  }, [])

  // 模拟智能缓存机制
  useEffect(() => {
    const preloadCommonAssets = async () => {
      console.log("正在预加载常用资源...")
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("常用资源预加载完成")
    }

    preloadCommonAssets()
  }, [])

  const handleContentGeneration = async (content: string, type: "video" | "music") => {
    const generatedContent = await simulateAIGeneration(content, type)
    const watermarkedContent = addInvisibleWatermark(generatedContent)
    const hasCopyrightViolation = await checkCopyrightViolation(watermarkedContent)

    if (hasCopyrightViolation) {
      setShowCopyrightWarning(true)
    } else {
      // 根据用户订阅处理生成的内容
      if (userSubscription === "basic") {
        console.log("生成720p带水印视频")
      } else if (userSubscription === "premium") {
        console.log("生成4K无水印视频")
      } else {
        console.log("生成企业定制解决方案")
      }
    }
  }

  return (
    <DynamicSkinSystem>
      <div className="min-h-screen">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            欢迎来到一言一语AI视听中心
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { title: "一言", desc: "用一句话表达你的创意", href: "/word", color: "from-blue-500 to-cyan-500" },
              { title: "一语", desc: "用声音创造你的旋律", href: "/speech", color: "from-purple-500 to-pink-500" },
              { title: "一词", desc: "创作富有意义的歌词", href: "/lyrics", color: "from-green-500 to-teal-500" },
              { title: "一曲", desc: "谱写你的音乐杰作", href: "/compose", color: "from-yellow-500 to-orange-500" },
            ].map((item, index) => (
              <div key={item.title}>
                <Link href={item.href} className="block">
                  <div
                    className={`bg-gradient-to-br ${item.color} rounded-lg p-6 h-full transition-transform hover:scale-105`}
                  >
                    <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
                    <p className="text-white/80">{item.desc}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Star className="w-6 h-6 text-yellow-400 mr-2" />
              星力系统
            </h2>
            <p className="mb-4">
              使用星力来提升你的作品排名，解锁特权，并升级你的VIP等级。
              <button className="text-blue-400 hover:underline ml-2" onClick={() => setShowStarPowerInfo(true)}>
                了解更多
              </button>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-900/30 rounded-lg p-4 flex items-center">
                <TrendingUp className="w-8 h-8 text-blue-400 mr-3" />
                <div>
                  <h3 className="font-semibold">提升排名</h3>
                  <p className="text-sm text-white/70">使用星力助推你的作品</p>
                </div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4 flex items-center">
                <Gift className="w-8 h-8 text-purple-400 mr-3" />
                <div>
                  <h3 className="font-semibold">兑换特权</h3>
                  <p className="text-sm text-white/70">在星力商城中兑换奖励</p>
                </div>
              </div>
              <div className="bg-green-900/30 rounded-lg p-4 flex items-center">
                <Award className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <h3 className="font-semibold">升级VIP</h3>
                  <p className="text-sm text-white/70">提升等级获得更多权益</p>
                </div>
              </div>
            </div>
          </div>

          {/* 核心功能组件 */}
          <div className="space-y-12">
            <Suspense fallback={<LoadingSpinner />}>
              <AntiCheatSystem />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <GeoBroadcastSystem />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <EnhancedRankingSystem />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <CreativeSceneEmpowerment />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <ComplianceRiskControl />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <BackendManagement />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <BusinessValueAnalysis />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <RankingBoard />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <AIMVGenerator />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <MultimediaDIYWorkshop />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <CrossModalInteractive />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <CreationWorkflow />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <InnovativeInteractions />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <VideoCommunity />
            </Suspense>
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">视频增值包</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-900/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">基础版</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>生成720p视频</li>
                  <li>带水印</li>
                </ul>
                <Button className="mt-4" onClick={() => setUserSubscription("basic")}>
                  选择基础版
                </Button>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">会员版</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>4K无损视频</li>
                  <li>去水印</li>
                  <li>独家特效库</li>
                </ul>
                <Button className="mt-4" onClick={() => setUserSubscription("premium")}>
                  升级到会员版
                </Button>
              </div>
              <div className="bg-green-900/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">企业解决方案</h3>
                <p>广告配乐视频一键生成</p>
                <Button className="mt-4" onClick={() => setUserSubscription("enterprise")}>
                  联系我们
                </Button>
              </div>
            </div>
          </div>

          {isLowPowerMode && (
            <div className="bg-yellow-500/20 p-4 rounded-lg mt-6">
              <p className="text-yellow-300">检测到低性能设备，已启用性能优化模式。部分高级功能可能受限。</p>
            </div>
          )}

          {showCopyrightWarning && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-red-900/80 p-6 rounded-lg max-w-md">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">版权警告</h3>
                <p className="mb-4">检测到潜在的版权侵犯。请确保你有权使用所有素材。</p>
                <Button onClick={() => setShowCopyrightWarning(false)}>我明白了</Button>
              </div>
            </div>
          )}
          {showStarPowerInfo && <StarPowerInfo onClose={() => setShowStarPowerInfo(false)} />}
        </div>
      </div>
    </DynamicSkinSystem>
  )
}

export default function HomePage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Home />
    </ErrorBoundary>
  )
}

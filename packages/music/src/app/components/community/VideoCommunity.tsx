"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Video, ThumbsUp, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

type MVContest = {
  id: string
  title: string
  creator: string
  votes: number
  videoUrl: string
}

type AIModel = {
  id: string
  name: string
  creator: string
  price: number
  description: string
}

export default function VideoCommunity() {
  const [activeTab, setActiveTab] = useState<"contest" | "marketplace">("contest")
  const [mvContests, setMvContests] = useState<MVContest[]>([
    { id: "1", title: "霓虹都市", creator: "电子梦想家", votes: 128, videoUrl: "/placeholder-mv-1.mp4" },
    { id: "2", title: "山水之间", creator: "古风爱好者", votes: 95, videoUrl: "/placeholder-mv-2.mp4" },
    { id: "3", title: "未来之声", creator: "赛博朋克", votes: 87, videoUrl: "/placeholder-mv-3.mp4" },
  ])
  const [aiModels, setAiModels] = useState<AIModel[]>([
    { id: "1", name: "赛博朋克风格模型", creator: "未来主义者", price: 99, description: "让你的MV充满科技感和未来感" },
    { id: "2", name: "水墨丹青特效包", creator: "国风大师", price: 79, description: "为你的MV添加中国传统艺术风格" },
    { id: "3", name: "复古胶片滤镜", creator: "怀旧控", price: 59, description: "让你的MV拥有经典电影质感" },
  ])

  const handleVote = (id: string) => {
    setMvContests(mvContests.map((mv) => (mv.id === id ? { ...mv, votes: mv.votes + 1 } : mv)))
  }

  const handlePurchase = (id: string) => {
    alert(`感谢购买！模型 ${id} 已添加到你的账户。`)
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">视频化社区</h2>

      <div className="flex space-x-4 mb-6">
        <Button variant={activeTab === "contest" ? "default" : "outline"} onClick={() => setActiveTab("contest")}>
          AI导演大赛
        </Button>
        <Button
          variant={activeTab === "marketplace" ? "default" : "outline"}
          onClick={() => setActiveTab("marketplace")}
        >
          二创素材市场
        </Button>
      </div>

      {activeTab === "contest" && (
        <div className="space-y-6">
          {mvContests.map((mv) => (
            <motion.div
              key={mv.id}
              className="bg-black/30 rounded-lg p-4 flex items-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Video className="w-12 h-12 text-blue-400" />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{mv.title}</h3>
                <p className="text-sm text-gray-400">by {mv.creator}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span>{mv.votes}</span>
                <Button variant="outline" size="sm" onClick={() => handleVote(mv.id)}>
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  投票
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "marketplace" && (
        <div className="space-y-6">
          {aiModels.map((model) => (
            <motion.div
              key={model.id}
              className="bg-black/30 rounded-lg p-4 flex items-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ShoppingCart className="w-12 h-12 text-green-400" />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{model.name}</h3>
                <p className="text-sm text-gray-400">by {model.creator}</p>
                <p className="text-xs mt-1">{model.description}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className="font-bold text-yellow-400">¥{model.price}</span>
                <Button variant="outline" size="sm" onClick={() => handlePurchase(model.id)}>
                  购买
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

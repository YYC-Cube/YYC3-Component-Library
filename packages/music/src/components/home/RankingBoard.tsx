"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Star, Trophy } from "lucide-react"

const rankingData = {
  daily: [
    { rank: 1, title: "星空协奏曲", author: "梦想家", plays: 15000, starPower: 2500 },
    { rank: 2, title: "霓虹回忆", author: "电子诗人", plays: 12000, starPower: 2000 },
    { rank: 3, title: "雨中漫步", author: "忧郁蓝调", plays: 10000, starPower: 1800 },
  ],
  weekly: [
    { rank: 1, title: "量子之恋", author: "未来主义者", plays: 50000, starPower: 8000 },
    { rank: 2, title: "星际摇篮曲", author: "宇宙漫游者", plays: 45000, starPower: 7500 },
    { rank: 3, title: "赛博朋克狂想", author: "数字叛逆者", plays: 40000, starPower: 7000 },
  ],
  monthly: [
    { rank: 1, title: "人工智能交响乐", author: "AI作曲家", plays: 200000, starPower: 30000 },
    { rank: 2, title: "虚拟现实协奏曲", author: "全息投影乐团", plays: 180000, starPower: 28000 },
    { rank: 3, title: "跨次元音乐盛宴", author: "平行宇宙乐队", plays: 160000, starPower: 26000 },
  ],
}

export default function RankingBoard() {
  const [activeTab, setActiveTab] = useState("daily")

  const tabItems = [
    { id: "daily", label: "言语·爆燃榜", icon: Flame, color: "text-red-500" },
    { id: "weekly", label: "星辰·闪耀榜", icon: Star, color: "text-yellow-500" },
    { id: "monthly", label: "永恒·巅峰榜", icon: Trophy, color: "text-blue-500" },
  ]

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">排行榜</h2>
      <div className="flex space-x-4 mb-6">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2 rounded-full transition-colors duration-200 ${
              activeTab === tab.id ? "bg-blue-600 text-white" : "bg-blue-900/30 text-white/70 hover:bg-blue-900/50"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className={`w-4 h-4 mr-2 ${tab.color}`} />
            {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            {rankingData[activeTab as keyof typeof rankingData].map((item, index) => (
              <div
                key={item.rank}
                className="flex items-center bg-blue-900/20 rounded-lg p-4 transition-transform hover:scale-102"
              >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full mr-4">
                  {item.rank}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.author}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-white/70">播放: {item.plays.toLocaleString()}</div>
                  <div className="flex items-center text-sm text-yellow-400">
                    <Star className="w-4 h-4 mr-1" />
                    {item.starPower.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Radio, MapPin, Zap, Globe, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const broadcastTypes = [
  { type: "区域广播", icon: MapPin, range: "1-5公里半径", cost: 200, duration: 30 },
  { type: "商圈霸屏", icon: Zap, range: "选定商业区", cost: 500, duration: 60 },
  { type: "全城广播", icon: Globe, range: "城市级", cost: 0, duration: 120 },
  { type: "跨城联播", icon: Radio, range: "3城联动", cost: 3000, duration: 180 },
]

const vipStyles = [
  { level: "1-3级", font: "text-neon", entrance: "slide-in", particles: "stardust" },
  { level: "4-6级", font: "text-metal", entrance: "particle-reassemble", particles: "light-band" },
  { level: "7-9级", font: "text-hologram", entrance: "space-tear", particles: "galaxy-collapse" },
]

export default function GeoBroadcastSystem() {
  const [selectedType, setSelectedType] = useState(broadcastTypes[0])
  const [vipLevel, setVipLevel] = useState(1)
  const [contentQuality, setContentQuality] = useState(3)
  const [displayTime, setDisplayTime] = useState(30)
  const [isCompeting, setIsCompeting] = useState(false)
  const [competitionCost, setCompetitionCost] = useState(0)
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 })

  useEffect(() => {
    // Simulating location service
    const getLocation = () => {
      // In a real app, we would use the browser's geolocation API or a mapping service
      setLocation({
        latitude: 39.9042 + (Math.random() - 0.5) * 0.1,
        longitude: 116.4074 + (Math.random() - 0.5) * 0.1,
      })
    }

    getLocation()
    const intervalId = setInterval(getLocation, 60000) // Update location every minute

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const baseTime = vipLevel < 4 ? 30 : 60
    const bonus = contentQuality * 10
    setDisplayTime(Math.min(baseTime + bonus, 180))
  }, [vipLevel, contentQuality])

  const getVipStyle = () => {
    if (vipLevel <= 3) return vipStyles[0]
    if (vipLevel <= 6) return vipStyles[1]
    return vipStyles[2]
  }

  const handleCompetition = () => {
    setIsCompeting(true)
    setCompetitionCost(selectedType.cost * 1.2)
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Radio className="w-6 h-6 text-blue-400 mr-2" />
        地理定位广播系统
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">选择广播类型</h3>
          <div className="space-y-2">
            {broadcastTypes.map((type) => (
              <button
                key={type.type}
                className={`w-full text-left p-3 rounded-lg flex items-center ${
                  selectedType.type === type.type
                    ? "bg-blue-600 text-white"
                    : "bg-blue-900/30 text-white/70 hover:bg-blue-900/50"
                }`}
                onClick={() => setSelectedType(type)}
              >
                <type.icon className="w-5 h-5 mr-2" />
                <span>{type.type}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">广播详情</h3>
          <div className="bg-blue-900/30 p-4 rounded-lg">
            <p className="mb-2">
              <span className="font-medium">覆盖范围：</span>
              {selectedType.range}
            </p>
            <p className="mb-2">
              <span className="font-medium">消耗星力：</span>
              {isCompeting ? competitionCost : selectedType.cost} 星力/次
            </p>
            <p className="mb-2">
              <span className="font-medium">停留时长：</span>
              {displayTime} 秒
            </p>
            <p className="text-sm text-white/70">注：全城广播仅限VIP7级以上用户，每周赠送3次</p>
          </div>
          <div className="mt-4 space-y-2">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-200"
              onClick={() => {
                // Simulate broadcast
                alert(`广播已发送！当前位置：${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`)
              }}
            >
              发起广播
            </button>
            {!isCompeting && (
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors duration-200"
                onClick={handleCompetition}
              >
                竞价广播
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">广播预览</h3>
        <div className={`p-4 rounded-lg ${getVipStyle().font}`}>
          <AnimatePresence>
            <motion.div
              key={selectedType.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`flex items-center justify-between ${getVipStyle().particles}`}
            >
              <div>
                <p className="text-xl font-bold">示例广播内容</p>
                <p className="text-sm text-white/70">来自：用户名 | VIP{vipLevel}</p>
              </div>
              <Star className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

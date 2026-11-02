"use client"

import { useState } from "react"
import { TrendingUp, MapPin, Radio } from "lucide-react"

const cities = ["北京", "上海", "广州", "深圳", "杭州"]
const businessAreas = ["西湖", "外滩", "王府井", "南锣鼓巷", "太古里"]

export default function EnhancedRankingSystem() {
  const [activeTab, setActiveTab] = useState("city")
  const [selectedRegion, setSelectedRegion] = useState(cities[0])

  const rankingData = [
    { rank: 1, title: "城市之声", author: "音乐达人", plays: 150000, broadcasts: 50 },
    { rank: 2, title: "都市节奏", author: "节奏大师", plays: 120000, broadcasts: 45 },
    { rank: 3, title: "街头旋律", author: "流浪歌手", plays: 100000, broadcasts: 40 },
    { rank: 4, title: "地铁心情", author: "都市白领", plays: 80000, broadcasts: 35 },
    { rank: 5, title: "公园小调", author: "自然音乐家", plays: 60000, broadcasts: 30 },
  ]

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
        地域人气榜
      </h2>
      <div className="mb-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-full ${activeTab === "city" ? "bg-blue-600" : "bg-blue-900/30"}`}
            onClick={() => setActiveTab("city")}
          >
            城市榜
          </button>
          <button
            className={`px-4 py-2 rounded-full ${activeTab === "business" ? "bg-blue-600" : "bg-blue-900/30"}`}
            onClick={() => setActiveTab("business")}
          >
            商圈榜
          </button>
        </div>
      </div>
      <div className="mb-4">
        <select
          className="w-full bg-blue-900/30 text-white rounded-lg p-2"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {(activeTab === "city" ? cities : businessAreas).map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {rankingData.map((item) => (
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
              <div className="text-sm text-white/70">
                <MapPin className="w-4 h-4 inline mr-1" />
                {item.plays.toLocaleString()}
              </div>
              <div className="text-sm text-white/70">
                <Radio className="w-4 h-4 inline mr-1" />
                {item.broadcasts}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

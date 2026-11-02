"use client"

import { useState } from "react"
import { TrendingUp, Award, Radio } from "lucide-react"

export default function BusinessValueAnalysis() {
  const [selectedTab, setSelectedTab] = useState("revenue")

  const revenueData = [
    { name: "地域广告系统", value: 5000000 },
    { name: "城市文化合作", value: 3000000 },
    { name: "VIP会员订阅", value: 2000000 },
  ]

  const userEngagementData = [
    { name: "日活跃用户", value: 1000000 },
    { name: "月活跃用户", value: 5000000 },
    { name: "广播成就完成率", value: "35%" },
  ]

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
        商业价值分析
      </h2>
      <div className="space-y-6">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${selectedTab === "revenue" ? "bg-blue-600" : "bg-blue-900/30"}`}
            onClick={() => setSelectedTab("revenue")}
          >
            收入增长点
          </button>
          <button
            className={`px-4 py-2 rounded-md ${selectedTab === "engagement" ? "bg-blue-600" : "bg-blue-900/30"}`}
            onClick={() => setSelectedTab("engagement")}
          >
            用户粘性
          </button>
        </div>
        {selectedTab === "revenue" ? (
          <div className="space-y-4">
            {revenueData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span>{item.name}</span>
                <span className="font-semibold text-green-400">¥{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {userEngagementData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span>{item.name}</span>
                <span className="font-semibold text-blue-400">{item.value}</span>
              </div>
            ))}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold mb-2">广播成就体系</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Radio className="w-5 h-5 text-yellow-400 mr-2" />
              <span>"城市之声"：在10个不同城市完成广播</span>
            </div>
            <div className="flex items-center">
              <Award className="w-5 h-5 text-purple-400 mr-2" />
              <span>"星链使者"：连续30天使用区域广播</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

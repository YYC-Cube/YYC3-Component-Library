"use client"

import { useState } from "react"
import { Shield, Eye, MapPin } from "lucide-react"

export default function ComplianceRiskControl() {
  const [contentStatus, setContentStatus] = useState("pending")
  const [locationPrivacy, setLocationPrivacy] = useState(false)

  const handleContentSubmit = () => {
    // Simulate content filtering process
    setContentStatus("processing")
    setTimeout(() => {
      const result = Math.random() > 0.8 ? "rejected" : "approved"
      setContentStatus(result)
    }, 2000)
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Shield className="w-6 h-6 text-green-400 mr-2" />
        合规与风控体系
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">内容过滤机制</h3>
          <div className="flex items-center space-x-4 mb-2">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
              onClick={handleContentSubmit}
            >
              模拟内容提交
            </button>
            <span className="text-sm">
              状态：
              {contentStatus === "pending" && "待处理"}
              {contentStatus === "processing" && "处理中..."}
              {contentStatus === "approved" && "已通过"}
              {contentStatus === "rejected" && "已拦截"}
            </span>
          </div>
          {contentStatus === "rejected" && <p className="text-sm text-yellow-400">该内容正在星际旅行中...</p>}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">隐私保护设计</h3>
          <div className="flex items-center space-x-4">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span className="text-sm">位置精度：{locationPrivacy ? "500米" : "精确"}</span>
            <button
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                locationPrivacy ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              }`}
              onClick={() => setLocationPrivacy(!locationPrivacy)}
            >
              {locationPrivacy ? "关闭" : "开启"}位置脱敏
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">幽灵广播模式</h3>
          <div className="flex items-center space-x-4">
            <Eye className="w-5 h-5 text-purple-400" />
            <span className="text-sm">当前状态：关闭</span>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
              开启幽灵模式
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

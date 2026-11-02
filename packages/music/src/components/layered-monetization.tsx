"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Layers, Users, Building, Code } from "lucide-react"
import { Button } from "@/components/ui/button"

const userTypes = [
  { type: "免费层", icon: Users, color: "bg-blue-500", benefits: "广告（15s片头）+ 基础功能" },
  { type: "创作者层", icon: Layers, color: "bg-green-500", benefits: "粉丝打赏分成+版权经纪" },
  { type: "企业层", icon: Building, color: "bg-purple-500", benefits: "定制AI音乐营销方案（如生成品牌主题曲+产品MV）" },
  { type: "生态层", icon: Code, color: "bg-yellow-500", benefits: "出售AI模型/工具插件（Adobe插件商店模式）" },
]

export default function LayeredMonetization() {
  const [selectedType, setSelectedType] = useState(userTypes[0])

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">分层变现体系</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {userTypes.map((type) => (
          <Button
            key={type.type}
            variant={selectedType.type === type.type ? "default" : "outline"}
            className={`flex flex-col items-center p-4 h-auto ${
              selectedType.type === type.type ? type.color : "bg-gray-700"
            }`}
            onClick={() => setSelectedType(type)}
          >
            <type.icon className="w-8 h-8 mb-2" />
            <span>{type.type}</span>
          </Button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 p-4 rounded-lg"
      >
        <h3 className="text-lg font-semibold mb-2">{selectedType.type}</h3>
        <p className="text-gray-300">{selectedType.benefits}</p>
      </motion.div>

      {selectedType.type === "免费层" && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">广告预览</h3>
          <div className="bg-black aspect-video flex items-center justify-center">
            <p className="text-white">15秒广告位</p>
          </div>
        </div>
      )}

      {selectedType.type === "创作者层" && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">版权经纪服务</h3>
          <Button>查看可用的版权合作</Button>
        </div>
      )}

      {selectedType.type === "企业层" && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">定制AI音乐营销方案</h3>
          <Button>联系我们获取定制方案</Button>
        </div>
      )}

      {selectedType.type === "生态层" && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">开发者中心</h3>
          <Button>访问插件商店</Button>
        </div>
      )}
    </div>
  )
}

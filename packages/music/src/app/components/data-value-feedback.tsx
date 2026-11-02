"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Heart, Music } from "lucide-react"
import { Button } from "@/components/ui/button"

const dataServices = [
  {
    title: "风格趋势预测",
    icon: TrendingUp,
    description: "向音乐公司提供AI分析的区域流行趋势报告",
    example: "成都地区最近古风+Trap融合曲风搜索量上升37%",
  },
  {
    title: "情感营销指数",
    icon: Heart,
    description: "基于用户生成内容的情感分析，为品牌提供消费者情绪洞察",
    example: "防晒霜广告匹配轻松海岛曲风转化率更高",
  },
]

export default function DataValueFeedback() {
  const [selectedService, setSelectedService] = useState(dataServices[0])

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">数据价值反哺</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataServices.map((service) => (
          <Button
            key={service.title}
            variant={selectedService.title === service.title ? "default" : "outline"}
            className={`flex items-center p-4 h-auto ${
              selectedService.title === service.title ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={() => setSelectedService(service)}
          >
            <service.icon className="w-6 h-6 mr-2" />
            <span>{service.title}</span>
          </Button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 p-4 rounded-lg"
      >
        <h3 className="text-lg font-semibold mb-2">{selectedService.title}</h3>
        <p className="text-gray-300 mb-4">{selectedService.description}</p>
        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">示例洞察</h4>
          <p className="text-gray-400">{selectedService.example}</p>
        </div>
      </motion.div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">实时音乐趋势</h3>
        <div className="flex items-center space-x-2">
          <Music className="w-6 h-6 text-blue-400" />
          <div className="flex-grow bg-gray-700 h-4 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: "65%" }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />
          </div>
          <span className="text-sm">65%</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">当前热门：电子+民谣融合风格</p>
      </div>

      <Button className="w-full">订阅数据分析服务</Button>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Cloud, Cpu, Database, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

const edgeOperations = [
  { name: "语音转旋律", type: "local", icon: Cpu },
  { name: "视频渲染", type: "cloud", icon: Cloud },
]

const federatedLearningSteps = [
  { name: "本地训练", icon: Database },
  { name: "加密参数", icon: Lock },
  { name: "上传特征", icon: Cloud },
  { name: "中央更新", icon: Database },
]

export default function DistributedAINetwork() {
  const [activeOperation, setActiveOperation] = useState(edgeOperations[0])
  const [federatedLearningProgress, setFederatedLearningProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setFederatedLearningProgress((prev) => (prev + 1) % (federatedLearningSteps.length + 1))
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const simulateEdgeComputing = () => {
    console.log(`Simulating ${activeOperation.name} on ${activeOperation.type} node`)
    // Here you would implement the actual edge computing logic
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">分布式AI网络</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">边缘计算节点</h3>
        <div className="flex space-x-4">
          {edgeOperations.map((operation) => (
            <Button
              key={operation.name}
              variant={activeOperation.name === operation.name ? "default" : "outline"}
              onClick={() => setActiveOperation(operation)}
              className="flex items-center space-x-2"
            >
              <operation.icon className="w-4 h-4" />
              <span>{operation.name}</span>
            </Button>
          ))}
        </div>
        <Button onClick={simulateEdgeComputing}>模拟边缘计算</Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">联邦学习机制</h3>
        <div className="flex justify-between">
          {federatedLearningSteps.map((step, index) => (
            <div key={step.name} className="flex flex-col items-center">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  index <= federatedLearningProgress ? "bg-blue-500" : "bg-gray-700"
                }`}
                animate={{ scale: index === federatedLearningProgress ? 1.2 : 1 }}
              >
                <step.icon className="w-6 h-6" />
              </motion.div>
              <span className="text-sm mt-2">{step.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

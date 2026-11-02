"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

const EvolvingAIArtUniverse = () => {
  const [styleA, setStyleA] = useState("")
  const [styleB, setStyleB] = useState("")
  const [hybridRatio, setHybridRatio] = useState(50)
  const [collectiveStyle, setCollectiveStyle] = useState("")
  const [participants, setParticipants] = useState(0)

  const handleStyleHybrid = () => {
    alert(`创建混合风格: ${styleA} (${hybridRatio}%) + ${styleB} (${100 - hybridRatio}%)`)
  }

  const handleCollectiveTraining = () => {
    alert(`开始集体训练: "${collectiveStyle}" 风格模型 (${participants} 位参与者)`)
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">可进化AI艺术宇宙</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">风格基因库</h3>
        <div className="flex space-x-2">
          <Input placeholder="风格 A" value={styleA} onChange={(e) => setStyleA(e.target.value)} />
          <Input placeholder="风格 B" value={styleB} onChange={(e) => setStyleB(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            混合比例: {hybridRatio}% : {100 - hybridRatio}%
          </label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[hybridRatio]}
            onValueChange={(value) => setHybridRatio(value[0])}
          />
        </div>
        <Button onClick={handleStyleHybrid}>创建混合风格</Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">集体训练模式</h3>
        <Input
          placeholder="集体风格名称"
          value={collectiveStyle}
          onChange={(e) => setCollectiveStyle(e.target.value)}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">参与人数: {participants}</label>
          <Slider
            min={0}
            max={1000}
            step={1}
            value={[participants]}
            onValueChange={(value) => setParticipants(value[0])}
          />
        </div>
        <Button onClick={handleCollectiveTraining}>开始集体训练</Button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">热门风格标签</h3>
        <div className="flex flex-wrap gap-2">
          {["Citypop", "武侠", "电子核", "昆曲", "赛博朋克"].map((tag) => (
            <motion.div
              key={tag}
              className="bg-blue-900/30 px-3 py-1 rounded-full text-sm cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              {tag}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EvolvingAIArtUniverse

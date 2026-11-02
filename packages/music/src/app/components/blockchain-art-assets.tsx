"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const BlockchainArtAssets = () => {
  const [nftTitle, setNftTitle] = useState("")
  const [nftDescription, setNftDescription] = useState("")
  const [creationStages, setCreationStages] = useState<string[]>([])

  const handleCreateNFT = () => {
    // Simulate NFT creation
    alert(`NFT "${nftTitle}" created successfully!`)
  }

  const handleAddStage = (stage: string) => {
    setCreationStages([...creationStages, stage])
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">链上艺术资产</h2>

      <div className="space-y-4">
        <Input placeholder="NFT 标题" value={nftTitle} onChange={(e) => setNftTitle(e.target.value)} />
        <Input placeholder="NFT 描述" value={nftDescription} onChange={(e) => setNftDescription(e.target.value)} />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">创作轨迹</h3>
        {creationStages.map((stage, index) => (
          <div key={index} className="bg-blue-900/30 p-2 rounded">
            {stage}
          </div>
        ))}
        <Button onClick={() => handleAddStage("原始语音")}>添加原始语音</Button>
        <Button onClick={() => handleAddStage("修改版本")}>添加修改版本</Button>
        <Button onClick={() => handleAddStage("最终成品")}>添加最终成品</Button>
      </div>

      <Button onClick={handleCreateNFT}>生成 NFT</Button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">数字藏品商城</h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.div className="bg-purple-900/30 p-4 rounded-lg cursor-pointer" whileHover={{ scale: 1.05 }}>
            <h4 className="font-semibold">周杰伦中国风词曲包</h4>
            <p className="text-sm text-gray-400">独家AI训练模型</p>
          </motion.div>
          <motion.div className="bg-green-900/30 p-4 rounded-lg cursor-pointer" whileHover={{ scale: 1.05 }}>
            <h4 className="font-semibold">赛博朋克虚拟舞台</h4>
            <p className="text-sm text-gray-400">限量版舞台皮肤</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BlockchainArtAssets

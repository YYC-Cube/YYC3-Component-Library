"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mic, Music, Video, Edit, Image, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AIMVGenerator from "./AIMVGenerator"
import MultimediaDIYWorkshop from "./MultimediaDIYWorkshop"

export default function CreationWorkflow() {
  const [step, setStep] = useState(1)
  const [input, setInput] = useState("")
  const [generatedMusic, setGeneratedMusic] = useState<string | null>(null)
  const [generatedMV, setGeneratedMV] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleGenerateMusic = () => {
    // Simulate music generation
    setTimeout(() => {
      setGeneratedMusic("/placeholder-music.mp3")
      setStep(2)
    }, 2000)
  }

  const handleGenerateMV = () => {
    // Simulate MV generation
    setTimeout(() => {
      setGeneratedMV("/placeholder-mv.mp4")
      setStep(3)
    }, 3000)
  }

  const handleExport = () => {
    // Simulate export process
    alert("作品导出成功！")
    setStep(1)
    setInput("")
    setGeneratedMusic(null)
    setGeneratedMV(null)
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">创作流程</h2>

      <div className="flex justify-between items-center mb-8">
        {[
          { icon: Mic, label: "输入" },
          { icon: Music, label: "生成音乐" },
          { icon: Video, label: "MV工坊" },
          { icon: Edit, label: "编辑" },
          { icon: Image, label: "个人化" },
          { icon: Download, label: "导出" },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                index + 1 <= step ? "bg-blue-500" : "bg-gray-700"
              }`}
              animate={{ scale: index + 1 === step ? 1.1 : 1 }}
            >
              <item.icon className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-sm mt-2">{item.label}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <Textarea
            placeholder="输入你的创意（语音输入功能待实现）"
            value={input}
            onChange={handleInputChange}
            className="w-full h-32"
          />
          <Button onClick={handleGenerateMusic} disabled={!input}>
            生成音乐
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <audio src={generatedMusic || undefined} controls className="w-full" />
          <div className="flex space-x-4">
            <Button onClick={() => setStep(1)}>重新生成</Button>
            <Button onClick={handleGenerateMV}>进入MV工坊</Button>
          </div>
        </div>
      )}

      {step >= 3 && (
        <Tabs defaultValue="mv-generator">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mv-generator">AI生成MV</TabsTrigger>
            <TabsTrigger value="edit">自定义编辑</TabsTrigger>
            <TabsTrigger value="personalize">个人化</TabsTrigger>
          </TabsList>
          <TabsContent value="mv-generator">
            <AIMVGenerator />
          </TabsContent>
          <TabsContent value="edit">
            <MultimediaDIYWorkshop />
          </TabsContent>
          <TabsContent value="personalize">
            <div className="space-y-4">
              <Input type="file" accept="image/*,video/*" />
              <Button>添加个人照片/视频</Button>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {step >= 3 && (
        <div className="mt-6">
          <Button onClick={handleExport}>AI优化导出</Button>
        </div>
      )}
    </div>
  )
}

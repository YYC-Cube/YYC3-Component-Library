"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Music, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CrossModalInteractive() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [generatedContent, setGeneratedContent] = useState<string>("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleGenerate = (type: "video-to-music" | "image-to-lyrics") => {
    // Simulate content generation
    setTimeout(() => {
      if (type === "video-to-music") {
        setGeneratedContent("生成的电子音乐将在这里播放")
      } else {
        setGeneratedContent("风沙埋葬了时间的脚印\n荒漠中绽放希望的花朵\n黄昏的余晖描绘永恒")
      }
    }, 2000)
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">跨模态互动彩蛋</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">声画互译实验</h3>
        <div className="flex items-center space-x-4">
          <Input type="file" onChange={handleFileUpload} accept="image/*,video/*" />
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        {uploadedFile && (
          <div className="space-y-2">
            <p>已上传: {uploadedFile.name}</p>
            <div className="flex space-x-2">
              <Button onClick={() => handleGenerate("video-to-music")}>
                <Music className="h-4 w-4 mr-2" />
                视频转音乐
              </Button>
              <Button onClick={() => handleGenerate("image-to-lyrics")}>
                <FileText className="h-4 w-4 mr-2" />
                图片生成歌词
              </Button>
            </div>
          </div>
        )}
      </div>

      {generatedContent && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">生成结果</h3>
          <Textarea value={generatedContent} readOnly className="w-full h-32 bg-deep-space-blue/30 text-white" />
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function EnhancedRiskControl() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [copyrightStatus, setCopyrightStatus] = useState<"checking" | "clear" | "violation" | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      checkCopyright(file)
    }
  }

  const checkCopyright = (file: File) => {
    setCopyrightStatus("checking")
    // Simulate copyright check
    setTimeout(() => {
      setCopyrightStatus(Math.random() > 0.8 ? "violation" : "clear")
    }, 2000)
  }

  const addWatermark = () => {
    // Simulate adding a watermark
    alert("隐形数字水印已添加到内容中。")
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Shield className="w-6 h-6 text-green-400 mr-2" />
        增强风险控制
      </h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AI生成标识</h3>
        <Button onClick={addWatermark}>添加隐形数字水印</Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">素材版权检测</h3>
        <Input type="file" onChange={handleFileUpload} />
        {uploadedFile && (
          <div className="mt-2">
            <p>已上传: {uploadedFile.name}</p>
            {copyrightStatus === "checking" && <p className="text-yellow-400">正在检查版权...</p>}
            {copyrightStatus === "clear" && <p className="text-green-400">版权检查通过</p>}
            {copyrightStatus === "violation" && (
              <p className="text-red-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                检测到潜在的版权问题，请确保您有权使用该素材
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

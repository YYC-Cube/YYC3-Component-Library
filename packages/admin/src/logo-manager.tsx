"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@yyc3/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@yyc3/ui/dialog"
import { Input } from "@yyc3/ui/input"
import { Label } from "@yyc3/ui/label"
import { Upload, ImageIcon, Settings, Save, RotateCcw } from "lucide-react"

interface LogoManagerProps {
  onLogoChange?: (logoData: LogoData) => void
}

interface LogoData {
  url: string
  title: string
  subtitle: string
  type: "upload" | "default"
}

export function LogoManager({ onLogoChange }: LogoManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [logoData, setLogoData] = useState<LogoData>({
    url: "/images/yanyu-cloud-logo.png",
    title: "言语云企业管理系统",
    subtitle: "YanYu Cloud Enterprise Management",
    type: "default",
  })
  const [previewData, setPreviewData] = useState<LogoData>(logoData)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith("image/")) {
        alert("请选择图片文件")
        return
      }

      // 验证文件大小 (最大 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("图片大小不能超过 2MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewData({
          ...previewData,
          url: result,
          type: "upload",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setLogoData(previewData)

    // 保存到本地存储
    localStorage.setItem("companyLogo", JSON.stringify(previewData))

    if (onLogoChange) {
      onLogoChange(previewData)
    }

    setIsOpen(false)

    // 触发页面刷新以更新头部logo
    window.dispatchEvent(new CustomEvent("logoUpdated", { detail: previewData }))
  }

  const handleReset = () => {
    const defaultData: LogoData = {
      url: "/images/yanyu-cloud-logo.png",
      title: "言语云企业管理系统",
      subtitle: "YanYu Cloud Enterprise Management",
      type: "default",
    }

    setPreviewData(defaultData)
    localStorage.removeItem("companyLogo")
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="text-gray-600 hover:text-gray-800">
        <Settings className="w-4 h-4 mr-2" />
        标志设置
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-sky-600" />
              企业标志管理
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 标志预览 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <Label className="text-sm font-medium mb-3 block">预览效果</Label>
              <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border">
                <img
                  src={previewData.url || "/placeholder.svg"}
                  alt="企业标志"
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/images/yanyu-cloud-logo.png"
                  }}
                />
                <div>
                  <h1 className="text-lg font-bold text-slate-800">{previewData.title}</h1>
                  <p className="text-xs text-slate-500">{previewData.subtitle}</p>
                </div>
              </div>
            </div>

            {/* 标志上传 */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">企业标志图片</Label>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
                    <Upload className="w-4 h-4 mr-2" />
                    上传标志
                  </Button>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  推荐尺寸：200x60px，支持 PNG、JPG、SVG 格式，文件大小不超过 2MB
                </p>
              </div>

              {/* 标题设置 */}
              <div>
                <Label htmlFor="company-title" className="text-sm font-medium mb-2 block">
                  企业名称
                </Label>
                <Input
                  id="company-title"
                  value={previewData.title}
                  onChange={(e) =>
                    setPreviewData({
                      ...previewData,
                      title: e.target.value,
                    })
                  }
                  placeholder="请输入企业名称"
                />
              </div>

              {/* 副标题设置 */}
              <div>
                <Label htmlFor="company-subtitle" className="text-sm font-medium mb-2 block">
                  企业副标题
                </Label>
                <Input
                  id="company-subtitle"
                  value={previewData.subtitle}
                  onChange={(e) =>
                    setPreviewData({
                      ...previewData,
                      subtitle: e.target.value,
                    })
                  }
                  placeholder="请输入企业副标题或英文名称"
                />
              </div>
            </div>

            {/* 预设模板 */}
            <div>
              <Label className="text-sm font-medium mb-3 block">快速模板</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto p-3 justify-start"
                  onClick={() =>
                    setPreviewData({
                      url: "/images/yanyu-cloud-logo.png",
                      title: "言语云企业管理系统",
                      subtitle: "YanYu Cloud Enterprise Management",
                      type: "default",
                    })
                  }
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">言语云模板</div>
                    <div className="text-xs text-gray-500">默认企业标志</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-3 justify-start"
                  onClick={() =>
                    setPreviewData({
                      url: "/images/zuoyou-logo.png",
                      title: "左右科技有限公司",
                      subtitle: "ZuoYou Technology Co., Ltd.",
                      type: "default",
                    })
                  }
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">左右科技</div>
                    <div className="text-xs text-gray-500">科技企业标志</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleReset} className="text-red-600 hover:text-red-700">
                <RotateCcw className="w-4 h-4 mr-2" />
                恢复默认
              </Button>

              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSave} className="bg-sky-600 hover:bg-sky-700">
                  <Save className="w-4 h-4 mr-2" />
                  保存设置
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

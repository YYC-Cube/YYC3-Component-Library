"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@yyc3/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@yyc3/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@yyc3/ui/dialog"
import { Label } from "@yyc3/ui/label"
import { Progress } from "@yyc3/ui/progress"
import { Camera, Upload, X, RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { toast } from "@yyc3/hooks/use-toast"

interface AvatarUploadProps {
  currentAvatar?: string
  onAvatarChange: (newAvatar: string) => void
  size?: "sm" | "md" | "lg"
  fallbackText?: string
}

export function AvatarUpload({ currentAvatar, onAvatarChange, size = "md", fallbackText = "U" }: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      toast({
        title: "文件类型错误",
        description: "请选择图片文件",
        variant: "destructive",
      })
      return
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "文件过大",
        description: "图片大小不能超过5MB",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setUploadProgress(0)

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // 模拟API上传延迟
      await new Promise((resolve) => setTimeout(resolve, 2000))

      clearInterval(progressInterval)
      setUploadProgress(100)

      // 在实际应用中，这里应该是上传到服务器后返回的URL
      const newAvatarUrl = previewUrl

      onAvatarChange(newAvatarUrl)
      setIsOpen(false)
      resetState()

      toast({
        title: "上传成功",
        description: "头像已更新",
      })
    } catch (error) {
      toast({
        title: "上传失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const resetState = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    setScale(1)
    setRotation(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCancel = () => {
    resetState()
    setIsOpen(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        setSelectedFile(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          <Avatar className={`${sizeClasses[size]} transition-all duration-300 group-hover:scale-105`}>
            <AvatarImage src={currentAvatar || "/placeholder.svg"} alt="头像" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {fallbackText}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>更换头像</DialogTitle>
          <DialogDescription>支持JPG、PNG格式，文件大小不超过5MB</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!previewUrl ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-300"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">拖拽图片到此处，或点击选择文件</p>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-2">
                选择文件
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* 预览区域 */}
              <div className="relative">
                <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="预览"
                    className="max-w-full max-h-full object-contain transition-transform duration-300"
                    style={{
                      transform: `scale(${scale}) rotate(${rotation}deg)`,
                    }}
                  />
                </div>

                {/* 控制按钮 */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setScale(Math.max(0.5, scale - 0.1))}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setScale(Math.min(2, scale + 0.1))}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setRotation((rotation + 90) % 360)}>
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={resetState}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* 文件信息 */}
              {selectedFile && (
                <div className="text-sm text-gray-600">
                  <p>文件名: {selectedFile.name}</p>
                  <p>文件大小: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}

              {/* 上传进度 */}
              {uploading && (
                <div className="space-y-2">
                  <Label>上传进度</Label>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-600">{uploadProgress}%</p>
                </div>
              )}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={uploading}>
              取消
            </Button>
            {previewUrl && (
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "上传中..." : "确认上传"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

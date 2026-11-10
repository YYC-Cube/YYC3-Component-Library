"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, CameraOff, RotateCcw, AlertCircle, Info } from "lucide-react"
import { Button } from "@yyc3/ui/button"

export default function InnovativeInteractions() {
  const [isCameraEnabled, setIsCameraEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const enableCamera = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsCameraEnabled(true)
      }
    } catch (err) {
      let errorMessage = "摄像头访问失败"

      if (err instanceof Error) {
        switch (err.name) {
          case "NotAllowedError":
            errorMessage = "摄像头权限被拒绝，请在浏览器设置中允许访问摄像头"
            break
          case "NotFoundError":
            errorMessage = "未找到摄像头设备，请确保设备已连接"
            break
          case "NotReadableError":
            errorMessage = "摄像头被其他应用占用，请关闭其他应用后重试"
            break
          default:
            errorMessage = `摄像头访问错误: ${err.message}`
        }
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const disableCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsCameraEnabled(false)
    setError(null)
  }

  const retryCamera = () => {
    setError(null)
    enableCamera()
  }

  // 清理资源
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Camera className="w-6 h-6 mr-2 text-purple-400" />
        创新交互设计
      </h2>

      <div className="space-y-6">
        {/* AR预览区域 */}
        <div className="bg-black/30 rounded-lg p-4 min-h-[300px] flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-white mb-4">AR音乐可视化预览</h3>

          {!isCameraEnabled && !error && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-gray-300 max-w-md">启用摄像头体验AR音乐可视化效果。您的视频数据不会被上传或存储。</p>
              <Button onClick={enableCamera} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    启用中...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    启用摄像头
                  </>
                )}
              </Button>
            </div>
          )}

          {error && (
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-300 text-sm">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={retryCamera}
                  variant="outline"
                  size="sm"
                  className="border-red-400 text-red-400 hover:bg-red-400/10 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重试
                </Button>
              </div>
            </div>
          )}

          {isCameraEnabled && (
            <div className="relative w-full max-w-md">
              <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-lg pointer-events-none">
                {/* AR覆盖层效果 */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 rounded-lg p-2 text-center">
                    <p className="text-white text-sm">🎵 AR音乐可视化已启用</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={disableCamera}
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <CameraOff className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* 功能介绍 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-900/30 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2 text-blue-400" />
              手势控制
            </h4>
            <p className="text-gray-300 text-sm">通过手势控制音乐播放、音量调节和特效切换</p>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2 text-green-400" />
              实时渲染
            </h4>
            <p className="text-gray-300 text-sm">基于音频频谱的实时3D视觉效果渲染</p>
          </div>
        </div>

        {/* 隐私提示 */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p className="text-yellow-300 text-xs flex items-start">
            <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            隐私保护：所有摄像头数据仅在本地处理，不会上传到服务器或存储在设备上。
          </p>
        </div>
      </div>
    </div>
  )
}

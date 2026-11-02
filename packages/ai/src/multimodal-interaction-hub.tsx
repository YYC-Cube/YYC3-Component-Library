"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MultimodalInteractionHubProps {
  onInteraction?: (type: string, data: any) => void
}

export default function MultimodalInteractionHub({ onInteraction }: MultimodalInteractionHubProps) {
  const [activeMode, setActiveMode] = useState<"gesture" | "voice" | "ar" | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [gesturePattern, setGesturePattern] = useState("")
  const [arMarker, setArMarker] = useState("")
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "zh-CN"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        handleVoiceCommand(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const handleVoiceCommand = (command: string) => {
    console.log("[v0] 语音命令:", command)

    if (command.includes("云枢") && command.includes("聚焦")) {
      const region = command.match(/聚焦(.+)/)?.[1] || "默认区域"
      onInteraction?.("voice", {
        action: "聚焦区域",
        region: region.trim(),
        command,
      })
    } else if (command.includes("切换") && command.includes("视图")) {
      onInteraction?.("voice", {
        action: "切换数据视图",
        view: "3D视图",
        command,
      })
    } else if (command.includes("显示") && command.includes("数据")) {
      onInteraction?.("voice", {
        action: "显示AR数据层",
        layer: "能耗数据",
        command,
      })
    }
  }

  const startVoiceRecognition = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      setActiveMode("voice")
      recognitionRef.current.start()
    }
  }

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      setActiveMode(null)
    }
  }

  const handleGestureInteraction = (pattern: string) => {
    setGesturePattern(pattern)
    setActiveMode("gesture")

    onInteraction?.("gesture", {
      action: "切换数据视图",
      pattern,
      view: pattern === "云枢能量波" ? "3D视图" : "默认视图",
    })

    setTimeout(() => {
      setActiveMode(null)
      setGesturePattern("")
    }, 2000)
  }

  const handleARInteraction = (marker: string) => {
    setArMarker(marker)
    setActiveMode("ar")

    onInteraction?.("ar", {
      action: "显示AR数据层",
      marker,
      layer: marker === "园区入口" ? "能耗数据" : "默认数据",
    })

    setTimeout(() => {
      setActiveMode(null)
      setArMarker("")
    }, 3000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-sm font-medium text-gray-700 mb-3 text-center">多模态交互中心</div>

        <div className="flex flex-col gap-2">
          <motion.button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
              activeMode === "voice" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg">🎤</span>
            <span className="text-sm">{isListening ? "正在听取..." : "语音交互"}</span>
            {isListening && (
              <motion.div
                className="w-2 h-2 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
            )}
          </motion.button>

          <div className="flex gap-1">
            <motion.button
              className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                activeMode === "gesture" && gesturePattern === "云枢能量波"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleGestureInteraction("云枢能量波")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">👋</span>
              <span className="text-xs">能量波</span>
            </motion.button>

            <motion.button
              className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                activeMode === "gesture" && gesturePattern === "旋转手势"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleGestureInteraction("旋转手势")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">🔄</span>
              <span className="text-xs">旋转</span>
            </motion.button>
          </div>

          <div className="flex gap-1">
            <motion.button
              className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                activeMode === "ar" && arMarker === "园区入口"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleARInteraction("园区入口")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">🏢</span>
              <span className="text-xs">园区</span>
            </motion.button>

            <motion.button
              className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                activeMode === "ar" && arMarker === "数据中心"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleARInteraction("数据中心")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">💾</span>
              <span className="text-xs">数据</span>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {activeMode && (
            <motion.div
              className="mt-3 p-2 bg-gray-50 rounded-lg text-xs text-gray-600"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {activeMode === "voice" && "🎤 语音识别中，请说出指令..."}
              {activeMode === "gesture" && `👋 执行手势: ${gesturePattern}`}
              {activeMode === "ar" && `🔍 AR标记: ${arMarker}`}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

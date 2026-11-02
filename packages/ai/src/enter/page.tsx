"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function EnterPage() {
  const [showContent, setShowContent] = useState(false)
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 延迟显示内容，创建分层次浮现效果
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 500)

    // 延迟显示AI助手
    const assistantTimer = setTimeout(() => {
      setAiAssistantVisible(true)
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearTimeout(assistantTimer)
    }
  }, [])

  const handleEnter = () => {
    router.push("/dashboard")
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    handleEnter()
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden cursor-pointer"
      onClick={handleEnter}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      {/* 背景动态线条 */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: "2px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 主要内容区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <AnimatePresence>
          {showContent && (
            <>
              {/* LOGO区域 */}
              <motion.div
                className="mb-8 relative"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              >
                {/* 光晕特效 */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-cyan-400/30 to-blue-400/30 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />

                <div className="relative w-32 h-32 mx-auto">
                  <Image src="/images/yyc3-logo.png" alt="YYC³ Logo" fill className="object-contain" />
                </div>
              </motion.div>

              {/* 标题区域 */}
              <motion.div
                className="text-center mb-12"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  YYC³ EasyVizAI
                </h1>
                <p className="text-xl md:text-2xl text-blue-200 font-light">万象归元于云枢 丨深栈智启新纪元</p>
                <p className="text-lg text-blue-300 mt-2 font-light">
                  All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era
                </p>
              </motion.div>

              {/* AI助手 */}
              <AnimatePresence>
                {aiAssistantVisible && (
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-2xl"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    >
                      🤖
                    </motion.div>
                    <motion.div
                      className="mt-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      你好！我是云枢AI助手 ✨
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 进入提示 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  repeatType: "reverse",
                  delay: 1,
                }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20">
                  <p className="text-white text-lg font-medium mb-2">点击任意位置或按任意键继续</p>
                  <div className="flex justify-center gap-2">
                    <motion.div
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-indigo-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
    </motion.div>
  )
}

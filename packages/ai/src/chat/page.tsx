"use client"

import type React from "react"
import type { SpeechRecognition } from "web-speech-api"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Array<{ id: number; text: string; isUser: boolean; timestamp: Date }>>([])
  const [isListening, setIsListening] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const initialMessage = searchParams.get("message")
    if (initialMessage) {
      setInput(initialMessage)
      setTimeout(() => {
        handleSend(initialMessage)
      }, 1000)
    }

    if (inputRef.current) {
      inputRef.current.focus()
    }

    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const speechRecognition = new (window as any).webkitSpeechRecognition()
      speechRecognition.continuous = false
      speechRecognition.interimResults = false
      speechRecognition.lang = "zh-CN"

      speechRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      speechRecognition.onerror = () => {
        setIsListening(false)
      }

      speechRecognition.onend = () => {
        setIsListening(false)
      }

      setRecognition(speechRecognition)
    }
  }, [searchParams])

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input
    if (!textToSend.trim()) return

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setAiThinking(true)

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: `🧠 YYC³ 智能分析完成！

针对您的问题："${textToSend}"

📊 **智能可视化方案**：
• 自动生成学习路径图谱
• 个性化知识点关联分析  
• 情感化进度追踪界面

🎯 **推荐学习策略**：
• 采用渐进式学习模式
• 结合多模态交互体验
• 实时调整学习节奏

✨ 是否需要我为您生成详细的可视化报告？`,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setAiThinking(false)
      speakText(aiResponse.text)
    }, 2000)
  }

  const handleVoiceInput = () => {
    if (!recognition) {
      alert("您的浏览器不支持语音识别功能")
      return
    }

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const cleanText = text.replace(/[🧠📊🎯✨•]/gu, "").replace(/\*\*/g, "")

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.lang = "zh-CN"
      utterance.rate = 0.9
      utterance.pitch = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileMessage = {
        id: Date.now(),
        text: `📎 已上传文件: ${file.name}`,
        isUser: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fileMessage])
    }
  }

  const exportChat = () => {
    const chatContent = messages
      .map((msg) => `[${msg.timestamp.toLocaleString()}] ${msg.isUser ? "用户" : "YYC³ AI"}: ${msg.text}`)
      .join("\n\n")

    const blob = new Blob([chatContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `YYC³_对话记录_${new Date().toLocaleDateString()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: backgroundImage
          ? `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 58, 138, 0.8)), url(${backgroundImage})`
          : "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: "1px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        <motion.div
          className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20 backdrop-blur-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Image
                src="/images/yyc3-logo-white.png"
                alt="YYC³ Logo"
                width={24}
                height={24}
                className="drop-shadow-lg"
              />
            </motion.div>
            <div>
              <h1 className="text-white font-semibold">YYC³ EasyVizAI</h1>
              <p className="text-cyan-200 text-sm">智能可视化助手已就绪</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="bg-red-500/20 backdrop-blur-sm rounded-lg p-2 hover:bg-red-500/30 transition-colors"
                title="停止语音播放"
              >
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                </svg>
              </button>
            )}

            <button
              onClick={exportChat}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-2 hover:bg-white/20 transition-colors"
              title="导出对话记录"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>

            <label
              className="cursor-pointer bg-white/10 backdrop-blur-sm rounded-lg p-2 hover:bg-white/20 transition-colors"
              title="上传背景图片"
            >
              <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" />
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </label>

            <button onClick={() => router.push("/")} className="text-white/60 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                      : "bg-white/10 backdrop-blur-sm text-white border border-cyan-400/20 shadow-lg"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {aiThinking && (
            <motion.div className="flex justify-start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-white/10 backdrop-blur-sm text-white border border-cyan-400/20 px-4 py-3 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-sm">YYC³ 正在智能分析...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-cyan-400/20 shadow-lg">
            <label
              className="cursor-pointer p-2 rounded-full bg-white/20 text-white/80 hover:bg-white/30 transition-colors"
              title="上传文件"
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".txt,.pdf,.doc,.docx,.jpg,.png,.gif"
              />
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </label>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="请输入您的学习问题或需求..."
              className="flex-1 bg-transparent text-white placeholder-white/60 outline-none"
            />

            <button
              onClick={handleVoiceInput}
              className={`p-2 rounded-full transition-colors ${
                isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/20 text-white/80 hover:bg-white/30"
              }`}
              title={isListening ? "停止录音" : "语音输入"}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white p-2 rounded-full transition-all duration-200 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-white/60">
            <div className="flex items-center gap-4">
              <span>模式</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 bg-cyan-500 rounded-full relative">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
                <span>智能可视化</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isListening && <span className="text-red-400 animate-pulse">🎤 录音中...</span>}
              {isSpeaking && <span className="text-green-400 animate-pulse">🔊 播放中...</span>}
              <span>YYC³-AI</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

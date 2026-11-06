/**
 * ⟨YYC³⟩ AI 聊天界面组件
 * 与本地大模型进行对话交互
 */

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useOllama } from "@yyc3/lib"
import { ModelSelector } from "./model-selector"
import { Send, Loader2, Settings, Trash2, Copy, CheckCheck } from "lucide-react"
import type { OllamaResponse } from "@yyc3/lib"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  initialSystemPrompt?: string
}

export function ChatInterface({ initialSystemPrompt = "你是一个有用的AI助手。" }: ChatInterfaceProps) {
  const { selectedModel, isLoading, streamText } = useOllama()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-1",
      role: "system",
      content: initialSystemPrompt,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 复制文本到剪贴板
  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("复制到剪贴板失败:", err)
    }
  }

  // 清空聊天记录
  const clearChat = () => {
    setMessages([
      {
        id: "system-" + Date.now(),
        role: "system",
        content: initialSystemPrompt,
        timestamp: new Date(),
      },
    ])
  }

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!input.trim() || !selectedModel) return

    const userMessage: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // 准备助手消息
    const assistantMessage: Message = {
      id: "assistant-" + Date.now(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsStreaming(true)

    try {
      // 构建上下文历史
      const history = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => `${msg.role === "user" ? "用户" : "助手"}: ${msg.content}`)
        .join("\n\n")

      const systemPrompt = messages.find((msg) => msg.role === "system")?.content || initialSystemPrompt

      const prompt = `${history}\n\n用户: ${input}\n\n助手:`

      await streamText(
        prompt,
        (chunk: OllamaResponse) => {
          if (chunk.response) {
            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1]
              if (lastMessage.id === assistantMessage.id) {
                return [
                  ...prev.slice(0, -1),
                  {
                    ...lastMessage,
                    content: lastMessage.content + chunk.response,
                  },
                ]
              }
              return prev
            })
          }
        },
        {
          system: systemPrompt,
          options: {
            temperature,
            num_predict: maxTokens,
          },
        },
      )
    } catch (error) {
      console.error("流式生成出错:", error)
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage.id === assistantMessage.id) {
          return [
            ...prev.slice(0, -1),
            {
              ...lastMessage,
              content: "抱歉，生成回复时出现错误。请稍后再试。",
            },
          ]
        }
        return prev
      })
    } finally {
      setIsStreaming(false)
    }
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 自动调整输入框高度
  const adjustTextareaHeight = () => {
    const textarea = inputRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-yy-cloud-standard/10 overflow-hidden">
      {/* 头部 */}
      <div className="p-4 border-b border-yy-cloud-standard/10 bg-gradient-to-r from-yy-cloud-standard/5 to-yy-cloud-light/5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-tech font-bold yy-gradient-text">YYC³ 本地大模型对话</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-yy-cloud-standard rounded-full hover:bg-gray-100"
              title="设置"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={clearChat}
              className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
              title="清空对话"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 设置面板 */}
        {showSettings && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">模型设置</h3>
            <div className="space-y-4">
              <ModelSelector />

              <div>
                <label className="text-sm font-medium text-yy-ink-standard/70">温度 ({temperature})</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number.parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  title="调整温度"
                  aria-label="调整温度"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>精确</span>
                  <span>平衡</span>
                  <span>创造</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-yy-ink-standard/70">最大生成长度 ({maxTokens})</label>
                <input
                  type="range"
                  min="256"
                  max="4096"
                  step="256"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  title="调整最大生成长度"
                  aria-label="调整最大生成长度"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages
          .filter((msg) => msg.role !== "system")
          .map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`
                relative group max-w-3xl px-4 py-2 rounded-lg
                ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-yy-cloud-standard to-yy-cloud-light text-white"
                    : "bg-gray-100 text-yy-ink-standard"
                }
              `}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`
                  flex items-center justify-end mt-1 space-x-1 text-xs
                  ${message.role === "user" ? "text-white/70" : "text-yy-ink-standard/50"}
                `}
                >
                  <span>{message.timestamp.toLocaleTimeString("zh-CN")}</span>
                </div>

                {/* 复制按钮 */}
                <button
                  onClick={() => copyToClipboard(message.content, message.id)}
                  className={`
                  absolute top-2 right-2 p-1 rounded
                  opacity-0 group-hover:opacity-100 transition-opacity
                  ${message.role === "user" ? "hover:bg-white/20 text-white" : "hover:bg-gray-200 text-gray-500"}
                `}
                  title="复制内容"
                >
                  {copiedId === message.id ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

        {/* 加载指示器 */}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin text-yy-cloud-standard" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-yy-cloud-standard/10">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              className="w-full px-4 py-2 pr-10 border border-yy-cloud-standard/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yy-cloud-standard/50 resize-none min-h-[44px] max-h-[200px] overflow-y-auto"
              rows={1}
              disabled={isStreaming || isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isStreaming || isLoading || !selectedModel}
            className={`
              p-2 rounded-full
              ${
                !input.trim() || isStreaming || isLoading || !selectedModel
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-yy-cloud-standard to-yy-cloud-light text-white hover:shadow-md"
              }
            `}
          >
            {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        {/* 模型状态 */}
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <div>
            {selectedModel ? (
              <span>
                使用模型: <span className="font-medium text-yy-cloud-standard">{selectedModel}</span>
              </span>
            ) : (
              <span className="text-amber-500">请选择一个模型</span>
            )}
          </div>
          <div>
            {isLoading && (
              <span className="flex items-center">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" /> 加载中...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

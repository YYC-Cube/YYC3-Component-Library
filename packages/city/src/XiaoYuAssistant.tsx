"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, Mic, Send, X, Volume2, VolumeX, Settings } from "lucide-react"
import { ModernCard, ModernCardHeader, ModernCardContent, ModernCardFooter } from "./ModernCard"
import { ModernButton } from "./ModernButton"
import { ModernInput } from "./ModernInput"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  actions?: Array<{
    label: string
    action: string
    icon?: string
  }>
}

interface AssistantState {
  isListening: boolean
  isThinking: boolean
  isSpeaking: boolean
  mood: "happy" | "thinking" | "helpful" | "concerned"
}

export function XiaoYuAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [assistantState, setAssistantState] = useState<AssistantState>({
    isListening: false,
    isThinking: false,
    isSpeaking: false,
    mood: "happy",
  })
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 初始化欢迎消息
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "您好！我是小语，您的专属智慧生活管家。我可以帮您处理日常事务、查询信息、安排日程，还能为您提供贴心的生活建议。有什么可以为您服务的吗？",
        timestamp: new Date(),
        actions: [
          { label: "查看天气", action: "weather", icon: "🌤️" },
          { label: "附近服务", action: "nearby", icon: "📍" },
          { label: "日程安排", action: "schedule", icon: "📅" },
          { label: "紧急联系", action: "emergency", icon: "🚨" },
        ],
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 模拟AI响应
  const generateResponse = async (userInput: string): Promise<Message> => {
    setAssistantState((prev) => ({ ...prev, isThinking: true, mood: "thinking" }))

    // 模拟思考时间
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    let response = ""
    let actions: Message["actions"] = []

    // 简单的关键词匹配响应
    const input = userInput.toLowerCase()

    if (input.includes("天气")) {
      response = "今天郑州天气晴朗，气温18-25℃，空气质量良好，适合户外活动。明天可能有小雨，建议您带伞出行。"
      actions = [
        { label: "查看详细预报", action: "weather_detail", icon: "🌦️" },
        { label: "设置天气提醒", action: "weather_alert", icon: "⏰" },
      ]
    } else if (input.includes("附近") || input.includes("地图")) {
      response = "我为您查找了附近的服务：距离您500米有一家便利店，1.2公里有医院，800米有公交站。需要我为您导航吗？"
      actions = [
        { label: "开始导航", action: "navigation", icon: "🧭" },
        { label: "查看更多", action: "more_nearby", icon: "🔍" },
      ]
    } else if (input.includes("日程") || input.includes("安排")) {
      response = "您今天的日程：上午10点有会议，下午3点有医生预约。明天比较空闲，可以安排其他活动。"
      actions = [
        { label: "添加日程", action: "add_schedule", icon: "➕" },
        { label: "查看本周", action: "week_schedule", icon: "📊" },
      ]
    } else if (input.includes("紧急") || input.includes("急救")) {
      response = "紧急情况下，您可以：1. 拨打120急救电话 2. 联系家人 3. 使用一键求助功能。我已为您准备好紧急联系方式。"
      actions = [
        { label: "拨打120", action: "call_120", icon: "🚑" },
        { label: "联系家人", action: "call_family", icon: "👨‍👩‍👧‍👦" },
        { label: "一键求助", action: "sos", icon: "🆘" },
      ]
    } else if (input.includes("你好") || input.includes("小语")) {
      response =
        "您好！很高兴为您服务。我是小语，您的智慧生活管家。我可以帮您查询信息、安排日程、寻找服务，还能在紧急时刻为您提供帮助。"
    } else {
      response = `我理解您说的是"${userInput}"。作为您的智慧管家，我正在学习更好地理解您的需求。目前我可以帮您查询天气、寻找附近服务、管理日程和处理紧急情况。`
      actions = [
        { label: "功能介绍", action: "features", icon: "💡" },
        { label: "使用帮助", action: "help", icon: "❓" },
      ]
    }

    setAssistantState((prev) => ({ ...prev, isThinking: false, mood: "helpful" }))

    return {
      id: Date.now().toString(),
      type: "assistant",
      content: response,
      timestamp: new Date(),
      actions,
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")

    const assistantResponse = await generateResponse(inputText)
    setMessages((prev) => [...prev, assistantResponse])

    // 语音播报（模拟）
    if (voiceEnabled) {
      setAssistantState((prev) => ({ ...prev, isSpeaking: true }))
      setTimeout(() => {
        setAssistantState((prev) => ({ ...prev, isSpeaking: false }))
      }, 3000)
    }
  }

  const handleActionClick = (action: string) => {
    // 处理快捷操作
    const actionMessages = {
      weather: "正在为您查询最新天气信息...",
      nearby: "正在搜索附近服务...",
      schedule: "正在打开日程管理...",
      emergency: "紧急服务已准备就绪",
      navigation: "正在启动导航...",
      call_120: "正在拨打120急救电话...",
      features: "小语的主要功能包括：智能问答、生活服务、日程管理、紧急救助、地图导航等。",
    }

    const message = actionMessages[action as keyof typeof actionMessages] || "正在处理您的请求..."

    const actionMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, actionMessage])
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "happy":
        return "😊"
      case "thinking":
        return "🤔"
      case "helpful":
        return "🤗"
      case "concerned":
        return "😟"
      default:
        return "😊"
    }
  }

  return (
    <>
      {/* 悬浮按钮 */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
        >
          {isOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
        </button>

        {/* 状态指示器 */}
        {isOpen && (
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-sm">{getMoodEmoji(assistantState.mood)}</span>
          </div>
        )}
      </div>

      {/* 聊天窗口 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] z-40">
          <ModernCard className="h-full flex flex-col">
            <ModernCardHeader title="小语 - 智慧生活管家" icon={<Bot className="h-5 w-5" />} />

            {/* 设置栏 */}
            <div className="px-4 py-2 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {assistantState.isThinking && "正在思考..."}
                  {assistantState.isSpeaking && "正在播报..."}
                  {!assistantState.isThinking && !assistantState.isSpeaking && "在线服务"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="p-1 rounded hover:bg-gray-100">
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
                <button className="p-1 rounded hover:bg-gray-100">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 消息列表 */}
            <ModernCardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString("zh-CN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {/* 快捷操作按钮 */}
                    {message.actions && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleActionClick(action.action)}
                            className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded transition-colors"
                          >
                            {action.icon} {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ModernCardContent>

            {/* 输入区域 */}
            <ModernCardFooter>
              <div className="flex gap-2">
                <ModernInput
                  placeholder="输入消息或语音指令..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <ModernButton
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || assistantState.isThinking}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </ModernButton>
                <ModernButton variant="outline" size="sm" className={assistantState.isListening ? "bg-red-100" : ""}>
                  <Mic className="h-4 w-4" />
                </ModernButton>
              </div>
            </ModernCardFooter>
          </ModernCard>
        </div>
      )}
    </>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Save, Users, Music, Video, MessageSquare } from "lucide-react"

// 模拟协作用户
const collaborators = [
  { id: "user1", name: "音乐爱好者", avatar: "/placeholder.svg?height=40&width=40", color: "#4A00E0" },
  { id: "user2", name: "电子音乐制作人", avatar: "/placeholder.svg?height=40&width=40", color: "#FF4E00" },
  { id: "user3", name: "古典乐迷", avatar: "/placeholder.svg?height=40&width=40", color: "#00C853" },
]

// 模拟光标位置更新
function useCursorPositions() {
  const [cursorPositions, setCursorPositions] = useState<Record<string, { x: number; y: number }>>({})

  useEffect(() => {
    // 模拟其他用户光标移动
    const interval = setInterval(() => {
      const updatedPositions: Record<string, { x: number; y: number }> = {}

      collaborators.forEach((user) => {
        updatedPositions[user.id] = {
          x: Math.random() * 100,
          y: Math.random() * 100,
        }
      })

      setCursorPositions(updatedPositions)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return cursorPositions
}

// 模拟聊天消息
interface ChatMessage {
  id: string
  userId: string
  text: string
  timestamp: Date
}

export default function RealTimeEditor() {
  const [activeTab, setActiveTab] = useState("music")
  const [musicNotes, setMusicNotes] = useState("C D E F G A B C")
  const [videoSettings, setVideoSettings] = useState('{"resolution": "1080p", "effects": ["fade", "blur"]}')
  const editorRef = useRef<HTMLDivElement>(null)
  const cursorPositions = useCursorPositions()
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      userId: "user2",
      text: "我觉得这个旋律可以再加点变化",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
    {
      id: "2",
      userId: "user3",
      text: "视频转场效果需要更流畅一些",
      timestamp: new Date(Date.now() - 2 * 60000),
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleMusicChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMusicNotes(e.target.value)
    // 在实际应用中，这里会发送更改到服务器
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVideoSettings(e.target.value)
    // 在实际应用中，这里会发送更改到服务器
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: "me",
      text: newMessage,
      timestamp: new Date(),
    }

    setChatMessages([...chatMessages, message])
    setNewMessage("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="bg-deep-space-blue/50 backdrop-blur-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">实时协作编辑器</h2>

        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {collaborators.map((user) => (
              <Avatar key={user.id} className="border-2 border-deep-space-blue">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback style={{ backgroundColor: user.color }}>{user.name[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>

          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            邀请
          </Button>

          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="music" className="flex items-center">
                <Music className="w-4 h-4 mr-2" />
                音乐编辑
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center">
                <Video className="w-4 h-4 mr-2" />
                视频编辑
              </TabsTrigger>
            </TabsList>

            <div ref={editorRef} className="relative mt-4 border border-blue-900/50 rounded-lg">
              {/* 协作者光标 */}
              {Object.entries(cursorPositions).map(([userId, position]) => {
                const user = collaborators.find((u) => u.id === userId)
                if (!user) return null

                return (
                  <div
                    key={userId}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      zIndex: 10,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent"
                        style={{ borderBottomColor: user.color }}
                      />
                      <div className="text-xs bg-gray-800 px-2 py-1 rounded whitespace-nowrap">{user.name}</div>
                    </div>
                  </div>
                )
              })}

              <TabsContent value="music" className="p-0 m-0">
                <textarea
                  value={musicNotes}
                  onChange={handleMusicChange}
                  className="w-full h-64 bg-deep-space-blue/30 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="编辑音乐笔记..."
                />
              </TabsContent>

              <TabsContent value="video" className="p-0 m-0">
                <textarea
                  value={videoSettings}
                  onChange={handleVideoChange}
                  className="w-full h-64 bg-deep-space-blue/30 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="编辑视频设置..."
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="bg-deep-space-blue/30 rounded-lg p-4 flex flex-col h-96">
          <div className="flex items-center mb-2">
            <MessageSquare className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">团队聊天</h3>
          </div>

          <div className="flex-grow overflow-y-auto mb-4 space-y-3">
            {chatMessages.map((message) => {
              const user =
                message.userId === "me"
                  ? { name: "我", color: "#8E2DE2" }
                  : collaborators.find((u) => u.id === message.userId)

              if (!user) return null

              return (
                <div key={message.id} className={`flex ${message.userId === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.userId === "me" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold">{user.name}</span>
                      <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                    </div>
                    <p>{message.text}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow bg-deep-space-blue/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入消息..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>发送</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

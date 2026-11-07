"use client"

import type React from "react"

/**
 * ⟨YYC³⟩ 对话界面组件
 * 提供完整的AI助手对话体验
 */

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@yyc3/ui-enterprise/button"
import { Textarea } from "@yyc3/ui-enterprise/textarea"
import { Badge } from "@yyc3/ui-enterprise/badge"
import { ScrollArea } from "@yyc3/ui-enterprise/scroll-area"
import { Alert, AlertDescription } from "@yyc3/ui-enterprise/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@yyc3/ui-enterprise/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@yyc3/ui-enterprise/dialog"
import {
  Send,
  Bot,
  User,
  Settings,
  Download,
  Trash2,
  Plus,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Paperclip,
  Image,
  FileText,
  Mic,
  MicOff,
  Copy,
  RotateCcw, // 替换缺失的 RefreshCw
} from "lucide-react"
import { useAIAssistant } from "@yyc3/lib"
import type { Message, Attachment } from "@yyc3/lib"

export interface ConversationInterfaceProps {
  className?: string
  showSidebar?: boolean
  enableVoice?: boolean
  enableAttachments?: boolean
}

export function ConversationInterface({
  className,
  showSidebar = true,
  enableVoice = true,
  enableAttachments = true,
}: ConversationInterfaceProps) {
  const {
    conversations,
    currentConversation,
    isLoading,
    error,
    createConversation,
    selectConversation,
    deleteConversation,
    sendMessage,
    regenerateResponse,
    editMessage,
    deleteMessage,
    exportConversation,
    clearError,
  } = useAIAssistant()

  // 界面状态
  const [inputValue, setInputValue] = useState("")
  const [isVoiceRecording, setIsVoiceRecording] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [showSettings, setShowSettings] = useState(false)

  // 引用
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConversation?.messages])

  // 自动聚焦输入框
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading])

  // 处理发送消息
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() && attachments.length === 0) return

    const content = inputValue.trim()
    const messageAttachments = [...attachments]

    // 清空输入
    setInputValue("")
    setAttachments([])

    // 发送消息
    await sendMessage(content, messageAttachments)
  }, [inputValue, attachments, sendMessage])

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage],
  )

  // 处理文件上传
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newAttachments: Attachment[] = files.map((file) => ({
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: file.type.startsWith("image/") ? "image" : "document",
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      metadata: { file },
    }))

    setAttachments((prev) => [...prev, ...newAttachments])
  }, [])

  // 移除附件
  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }, [])

  // 开始编辑消息
  const startEditMessage = useCallback((message: Message) => {
    setEditingMessageId(message.id)
    setEditingContent(message.content)
  }, [])

  // 保存编辑
  const saveEditMessage = useCallback(async () => {
    if (editingMessageId && editingContent.trim()) {
      await editMessage(editingMessageId, editingContent.trim())
      setEditingMessageId(null)
      setEditingContent("")
    }
  }, [editingMessageId, editingContent, editMessage])

  // 取消编辑
  const cancelEditMessage = useCallback(() => {
    setEditingMessageId(null)
    setEditingContent("")
  }, [])

  // 复制消息内容
  const copyMessage = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // 这里可以添加成功提示
    } catch (error) {
      console.error("复制失败:", error)
    }
  }, [])

  // 创建新对话
  const handleCreateConversation = useCallback(async () => {
    try {
      const id = await createConversation()
      selectConversation(id)
    } catch (error) {
      console.error("创建对话失败:", error)
    }
  }, [createConversation, selectConversation])

  // 导出对话
  const handleExportConversation = useCallback(
    (format: "json" | "markdown" | "txt") => {
      if (!currentConversation) return

      const content = exportConversation(currentConversation.id, format)
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `conversation_${currentConversation.title}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    [currentConversation, exportConversation],
  )

  // 格式化时间
  const formatTime = useCallback((date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "刚刚"
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString("zh-CN")
  }, [])

  return (
    <div className={`flex h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* 侧边栏 */}
      {showSidebar && (
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* 侧边栏头部 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                AI助手
              </h2>
              <Button size="sm" onClick={handleCreateConversation} disabled={isLoading}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 对话列表 */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentConversation?.id === conversation.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => selectConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {conversation.messages.length} 条消息 • {formatTime(conversation.updatedAt)}
                      </p>
                      <div className="flex items-center mt-2 space-x-1">
                        <Badge variant="outline" className="text-xs">
                          {conversation.settings.model}
                        </Badge>
                        {conversation.settings.enableTools && (
                          <Badge variant="secondary" className="text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            工具
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Settings className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleExportConversation("markdown")}>
                          <Download className="w-4 h-4 mr-2" />
                          导出为Markdown
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportConversation("json")}>
                          <Download className="w-4 h-4 mr-2" />
                          导出为JSON
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteConversation(conversation.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除对话
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              {conversations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>还没有对话</p>
                  <p className="text-sm">点击 + 开始新对话</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* 主对话区域 */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* 对话头部 */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold">{currentConversation.title}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentConversation.messages.length} 条消息 • 模型: {currentConversation.settings.model}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Dialog open={showSettings} onOpenChange={setShowSettings}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        设置
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>对话设置</DialogTitle>
                        <DialogDescription>调整AI助手的行为和参数</DialogDescription>
                      </DialogHeader>
                      <ConversationSettingsPanel conversation={currentConversation} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <Alert variant="destructive" className="m-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button variant="ghost" size="sm" onClick={clearError}>
                    ✕
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* 消息列表 */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                {currentConversation.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isEditing={editingMessageId === message.id}
                    editingContent={editingContent}
                    onEditingContentChange={setEditingContent}
                    onStartEdit={() => startEditMessage(message)}
                    onSaveEdit={saveEditMessage}
                    onCancelEdit={cancelEditMessage}
                    onCopy={() => copyMessage(message.content)}
                    onDelete={() => deleteMessage(message.id)}
                    onRegenerate={() => regenerateResponse(message.id)}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">AI正在思考...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* 输入区域 */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              {/* 附件预览 */}
              {attachments.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2"
                      >
                        {attachment.type === "image" ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        <span className="text-sm truncate max-w-32">{attachment.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeAttachment(attachment.id)}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 输入框 */}
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <Textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入消息... (Shift+Enter 换行)" // 修复无障碍问题
                    className="min-h-[44px] max-h-32 resize-none pr-20"
                    disabled={isLoading}
                  />
                  <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                    {enableAttachments && (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                          aria-label="上传文件" // 修复无障碍问题
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLoading}
                        >
                          <Paperclip className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {enableVoice && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setIsVoiceRecording(!isVoiceRecording)}
                        disabled={isLoading}
                        aria-label={isVoiceRecording ? "停止录音" : "开始录音"} // 修复无障碍问题
                      >
                        {isVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={(!inputValue.trim() && attachments.length === 0) || isLoading}
                  className="h-11"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>

              {/* 提示信息 */}
              <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                <span>AI助手可以帮您分析数据、生成图表、管理任务等</span>
                {currentConversation.settings.enableTools && (
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    工具已启用
                  </Badge>
                )}
              </div>
            </div>
          </>
        ) : (
          // 欢迎界面
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <Bot className="w-16 h-16 mx-auto mb-6 text-gray-400" />
              <h2 className="text-2xl font-semibold mb-4">欢迎使用AI助手</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                我是您的智能助手，可以帮助您分析数据、生成报告、管理任务等。让我们开始对话吧！
              </p>
              <Button onClick={handleCreateConversation} disabled={isLoading}>
                <Plus className="w-4 h-4 mr-2" />
                开始新对话
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 消息气泡组件
interface MessageBubbleProps {
  message: Message
  isEditing: boolean
  editingContent: string
  onEditingContentChange: (content: string) => void
  onStartEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onCopy: () => void
  onDelete: () => void
  onRegenerate: () => void
}

function MessageBubble({
  message,
  isEditing,
  editingContent,
  onEditingContentChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onCopy,
  onDelete,
  onRegenerate,
}: MessageBubbleProps) {
  const isUser = message.role === "user"
  const isAssistant = message.role === "assistant"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start space-x-3 max-w-3xl ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
        {/* 头像 */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-blue-500" : "bg-gray-500"
          }`}
        >
          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
        </div>

        {/* 消息内容 */}
        <div className="flex-1">
          <div
            className={`rounded-lg p-4 ${
              isUser
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            }`}
          >
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editingContent}
                  onChange={(e) => onEditingContentChange(e.target.value)}
                  placeholder="编辑消息内容" // 修复无障碍问题
                  className="min-h-[60px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline" onClick={onCancelEdit}>
                    取消
                  </Button>
                  <Button size="sm" onClick={onSaveEdit}>
                    保存
                  </Button>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}

            {/* 工具调用结果 */}
            {message.metadata?.tools && message.metadata.tools.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-sm opacity-75">
                  <Zap className="w-4 h-4 inline mr-1" />
                  使用了 {message.metadata.tools.length} 个工具
                </div>
                <div className="mt-2 space-y-1">
                  {message.metadata.tools.map((tool, index) => (
                    <div key={index} className="flex items-center text-xs">
                      {tool.status === "success" ? (
                        <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span>{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 消息元数据 */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>{message.timestamp.toLocaleTimeString("zh-CN")}</span>
              {message.metadata?.tokens && <span>• {message.metadata.tokens} tokens</span>}
            </div>
            
            {/* 消息操作 */}
            {!isEditing && (
              <div className="flex items-center space-x-1">
                {isUser && (
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={onStartEdit}>
                    <Settings className="w-3 h-3" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={onCopy}>
                  <Copy className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={onDelete}>
                  <Trash2 className="w-3 h-3" />
                </Button>
                {isAssistant && (
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={onRegenerate}>
                    <RotateCcw className="w-3 h-3" /> {/* 替换为正确的图标 */}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// 对话设置面板
interface ConversationSettingsPanelProps {
  conversation: any
}

function ConversationSettingsPanel({ conversation }: ConversationSettingsPanelProps) {
  const [settings, setSettings] = useState<{ // 添加类型注解
    model: string,
    temperature: number,
    maxTokens: number,
    enableTools: boolean,
    streaming: boolean
  }>({ ...conversation.settings })

  const handleSettingsChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement
    const { name, value, type } = target
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (target as HTMLInputElement).checked
          : type === "number"
          ? parseInt(value, 10)
          : value,
    }))
  }, [])

  return (
    <div className="space-y-4 p-4">
      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">模型</label> {/* 添加label */}
        <select
          id="model"
          name="model"
          value={settings.model}
          onChange={handleSettingsChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="claude-2">Claude 2</option>
          <option value="llama-3">Llama 3</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">温度 (创造力)</label> {/* 添加label */}
        <div className="flex items-center space-x-2">
          <input
            id="temperature"
            type="range"
            name="temperature"
            min="0"
            max="2"
            step="0.1"
            value={settings.temperature}
            onChange={handleSettingsChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm">{settings.temperature}</span>
        </div>
      </div>
      
      <div>
        <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 mb-1">最大响应长度</label> {/* 添加label */}
        <input
          id="maxTokens"
          type="number"
          name="maxTokens"
          value={settings.maxTokens}
          onChange={handleSettingsChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="enableTools"
            checked={settings.enableTools}
            onChange={handleSettingsChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">启用工具调用</span>
        </label>
      </div>
      
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="streaming"
            checked={settings.streaming}
            onChange={handleSettingsChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">流式响应</span>
        </label>
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" size="sm" onClick={() => setSettings({ ...conversation.settings })}>
          重置
        </Button>
        <Button size="sm" onClick={() => console.log('保存设置:', settings)}>
          保存
        </Button>
      </div>
    </div>
  )
}
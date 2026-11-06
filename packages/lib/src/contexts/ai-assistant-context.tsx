// ============================================================
// YYC³ · @yyc3/lib contexts 真身（lib services 真身批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/YYC-cloud-platform/lib/contexts/ai-assistant-context.tsx
// ============================================================
"use client"

/**
 * ⟨YYC³⟩ AI助手上下文管理
 * 提供全局AI助手状态和方法
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import {
  aiAssistantService,
  type Conversation,
  type Message,
  type ConversationSettings,
  type Attachment,
} from "../services/ai-assistant-service"

interface AIAssistantContextType {
  // 对话管理
  conversations: Conversation[]
  currentConversation: Conversation | null
  isLoading: boolean
  error: string | null

  // 对话操作
  createConversation: (settings?: Partial<ConversationSettings>) => Promise<string>
  selectConversation: (id: string) => void
  deleteConversation: (id: string) => Promise<boolean>
  updateConversationSettings: (id: string, settings: Partial<ConversationSettings>) => Promise<boolean>

  // 消息操作
  sendMessage: (content: string, attachments?: Attachment[]) => Promise<Message | null>
  regenerateResponse: (messageId: string) => Promise<Message | null>
  editMessage: (messageId: string, newContent: string) => Promise<boolean>
  deleteMessage: (messageId: string) => Promise<boolean>

  // 工具和功能
  availableTools: string[]
  providers: any[]
  exportConversation: (id: string, format?: "json" | "markdown" | "txt") => string

  // 状态管理
  refreshConversations: () => void
  clearError: () => void
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined)

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 初始化
  useEffect(() => {
    refreshConversations()

    // 获取可用工具和提供商信息
    const tools = aiAssistantService.getAvailableTools()
    const providers = aiAssistantService.getProviders()

    console.log("可用工具:", tools)
    console.log("AI提供商:", providers)
  }, [])

  // 刷新对话列表
  const refreshConversations = useCallback(() => {
    try {
      const allConversations = aiAssistantService.getAllConversations()
      setConversations(allConversations)

      // 如果有当前对话，更新它
      const current = aiAssistantService.getCurrentConversation()
      setCurrentConversation(current)
    } catch (err) {
      setError(err instanceof Error ? err.message : "刷新对话失败")
    }
  }, [])

  // 创建新对话
  const createConversation = useCallback(
    async (settings?: Partial<ConversationSettings>): Promise<string> => {
      try {
        setIsLoading(true)
        setError(null)

        const conversationId = aiAssistantService.createConversation(settings)
        refreshConversations()

        return conversationId
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "创建对话失败"
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [refreshConversations],
  )

  // 选择对话
  const selectConversation = useCallback((id: string) => {
    try {
      aiAssistantService.setCurrentConversation(id)
      const conversation = aiAssistantService.getConversation(id)
      setCurrentConversation(conversation)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "选择对话失败")
    }
  }, [])

  // 删除对话
  const deleteConversation = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setIsLoading(true)
        setError(null)

        const success = aiAssistantService.deleteConversation(id)
        if (success) {
          refreshConversations()
        }

        return success
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "删除对话失败"
        setError(errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [refreshConversations],
  )

  // 更新对话设置
  const updateConversationSettings = useCallback(
    async (id: string, settings: Partial<ConversationSettings>): Promise<boolean> => {
      try {
        setIsLoading(true)
        setError(null)

        const success = aiAssistantService.updateConversationSettings(id, settings)
        if (success) {
          refreshConversations()
        }

        return success
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "更新设置失败"
        setError(errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [refreshConversations],
  )

  // 发送消息
  const sendMessage = useCallback(
    async (content: string, attachments?: Attachment[]): Promise<Message | null> => {
      if (!currentConversation) {
        setError("请先选择或创建一个对话")
        return null
      }

      try {
        setIsLoading(true)
        setError(null)

        const message = await aiAssistantService.sendMessage(currentConversation.id, content, attachments)
        refreshConversations()

        return message
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "发送消息失败"
        setError(errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [currentConversation, refreshConversations],
  )

  // 重新生成回复
  const regenerateResponse = useCallback(
    async (messageId: string): Promise<Message | null> => {
      if (!currentConversation) {
        setError("请先选择一个对话")
        return null
      }

      try {
        setIsLoading(true)
        setError(null)

        // 找到要重新生成的消息
        const messageIndex = currentConversation.messages.findIndex((msg) => msg.id === messageId)
        if (messageIndex === -1) {
          throw new Error("消息不存在")
        }

        const message = currentConversation.messages[messageIndex]
        if (message.role !== "assistant") {
          throw new Error("只能重新生成助手的回复")
        }

        // 找到对应的用户消息
        const userMessage = currentConversation.messages[messageIndex - 1]
        if (!userMessage || userMessage.role !== "user") {
          throw new Error("找不到对应的用户消息")
        }

        // 删除原回复并重新生成
        currentConversation.messages.splice(messageIndex, 1)
        const newMessage = await aiAssistantService.sendMessage(currentConversation.id, userMessage.content)

        refreshConversations()
        return newMessage
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "重新生成失败"
        setError(errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [currentConversation, refreshConversations],
  )

  // 编辑消息
  const editMessage = useCallback(
    async (messageId: string, newContent: string): Promise<boolean> => {
      if (!currentConversation) {
        setError("请先选择一个对话")
        return false
      }

      try {
        setIsLoading(true)
        setError(null)

        const messageIndex = currentConversation.messages.findIndex((msg) => msg.id === messageId)
        if (messageIndex === -1) {
          throw new Error("消息不存在")
        }

        currentConversation.messages[messageIndex].content = newContent
        currentConversation.updatedAt = new Date()

        refreshConversations()
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "编辑消息失败"
        setError(errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [currentConversation, refreshConversations],
  )

  // 删除消息
  const deleteMessage = useCallback(
    async (messageId: string): Promise<boolean> => {
      if (!currentConversation) {
        setError("请先选择一个对话")
        return false
      }

      try {
        setIsLoading(true)
        setError(null)

        const messageIndex = currentConversation.messages.findIndex((msg) => msg.id === messageId)
        if (messageIndex === -1) {
          throw new Error("消息不存在")
        }

        currentConversation.messages.splice(messageIndex, 1)
        currentConversation.updatedAt = new Date()

        refreshConversations()
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "删除消息失败"
        setError(errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [currentConversation, refreshConversations],
  )

  // 导出对话
  const exportConversation = useCallback((id: string, format: "json" | "markdown" | "txt" = "json"): string => {
    try {
      return aiAssistantService.exportConversation(id, format)
    } catch (err) {
      setError(err instanceof Error ? err.message : "导出对话失败")
      return ""
    }
  }, [])

  // 清除错误
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = {
    // 状态
    conversations,
    currentConversation,
    isLoading,
    error,

    // 对话操作
    createConversation,
    selectConversation,
    deleteConversation,
    updateConversationSettings,

    // 消息操作
    sendMessage,
    regenerateResponse,
    editMessage,
    deleteMessage,

    // 工具和功能
    availableTools: aiAssistantService.getAvailableTools(),
    providers: aiAssistantService.getProviders(),
    exportConversation,

    // 状态管理
    refreshConversations,
    clearError,
  }

  return <AIAssistantContext.Provider value={value}>{children}</AIAssistantContext.Provider>
}

export function useAIAssistant() {
  const context = useContext(AIAssistantContext)
  if (context === undefined) {
    throw new Error("useAIAssistant 必须在 AIAssistantProvider 内部使用")
  }
  return context
}

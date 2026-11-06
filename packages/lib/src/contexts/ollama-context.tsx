// ============================================================
// YYC³ · @yyc3/lib contexts 真身（lib services 真身批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/YYC-cloud-platform/lib/contexts/ollama-context.tsx
// ============================================================
/**
 * ⟨YYC³⟩ Ollama 上下文管理
 * 提供全局访问 Ollama 模型的状态和方法
 */

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  ollamaService,
  type OllamaModelInfo,
  type OllamaGenerateParams,
  type OllamaResponse,
} from "../services/ollama-service"

interface OllamaContextType {
  models: OllamaModelInfo[]
  selectedModel: string
  isLoading: boolean
  error: string | null
  setSelectedModel: (model: string) => void
  generateText: (prompt: string, options?: Partial<OllamaGenerateParams>) => Promise<OllamaResponse>
  streamText: (
    prompt: string,
    onChunk: (chunk: OllamaResponse) => void,
    options?: Partial<OllamaGenerateParams>,
  ) => Promise<void>
  refreshModels: () => Promise<void>
}

const OllamaContext = createContext<OllamaContextType | undefined>(undefined)

export function OllamaProvider({ children }: { children: ReactNode }) {
  const [models, setModels] = useState<OllamaModelInfo[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refreshModels = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const modelList = await ollamaService.listModels()
      setModels(modelList)

      // 如果没有选择模型或选择的模型不在列表中，则选择第一个
      if (!selectedModel || !modelList.some((m) => m.name === selectedModel)) {
        setSelectedModel(modelList[0]?.name || "")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取模型列表失败")
      console.error("获取Ollama模型列表出错:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshModels()
  }, [])

  const generateText = async (prompt: string, options?: Partial<OllamaGenerateParams>): Promise<OllamaResponse> => {
    if (!selectedModel) {
      throw new Error("请先选择一个模型")
    }

    try {
      setIsLoading(true)
      const params: OllamaGenerateParams = {
        model: selectedModel,
        prompt,
        ...options,
      }

      return await ollamaService.generateText(params)
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成文本失败")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const streamText = async (
    prompt: string,
    onChunk: (chunk: OllamaResponse) => void,
    options?: Partial<OllamaGenerateParams>,
  ): Promise<void> => {
    if (!selectedModel) {
      throw new Error("请先选择一个模型")
    }

    try {
      setIsLoading(true)
      const params: OllamaGenerateParams = {
        model: selectedModel,
        prompt,
        stream: true,
        ...options,
      }

      const stream = ollamaService.streamText(params)

      for await (const chunk of stream) {
        onChunk(chunk)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "流式生成文本失败")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    models,
    selectedModel,
    isLoading,
    error,
    setSelectedModel,
    generateText,
    streamText,
    refreshModels,
  }

  return <OllamaContext.Provider value={value}>{children}</OllamaContext.Provider>
}

export function useOllama() {
  const context = useContext(OllamaContext)
  if (context === undefined) {
    throw new Error("useOllama 必须在 OllamaProvider 内部使用")
  }
  return context
}

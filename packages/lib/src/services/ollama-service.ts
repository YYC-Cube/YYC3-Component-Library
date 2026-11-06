// ============================================================
// YYC³ · @yyc3/lib services 真身（lib services 真身批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/YYC-cloud-platform/lib/services/ollama-service.ts
// ============================================================
/**
 * ⟨YYC³⟩ Ollama 大模型服务
 * 提供与本地 Ollama 模型的交互能力
 */

export interface OllamaModelInfo {
  name: string
  id: string
  size: string
  modified: string
  quantization?: string
  format?: string
}

export interface OllamaGenerateParams {
  model: string
  prompt: string
  system?: string
  template?: string
  context?: number[]
  stream?: boolean
  options?: {
    temperature?: number
    top_p?: number
    top_k?: number
    num_predict?: number
    stop?: string[]
    repeat_penalty?: number
    presence_penalty?: number
    frequency_penalty?: number
    seed?: number
    mirostat?: number
    mirostat_eta?: number
    mirostat_tau?: number
    num_ctx?: number
    num_batch?: number
    num_gpu?: number
    num_thread?: number
  }
}

export interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
  context?: number[]
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}

export interface OllamaEmbeddingResponse {
  embedding: number[]
}

export class OllamaService {
  private baseUrl: string

  constructor(baseUrl = "http://localhost:11434") {
    this.baseUrl = baseUrl
  }

  /**
   * 获取所有可用模型列表
   */
  async listModels(): Promise<OllamaModelInfo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`)

      if (!response.ok) {
        throw new Error(`获取模型列表失败: ${response.statusText}`)
      }

      const data = await response.json()
      return data.models || []
    } catch (error) {
      console.error("获取Ollama模型列表出错:", error)
      throw error
    }
  }

  /**
   * 生成文本响应
   */
  async generateText(params: OllamaGenerateParams): Promise<OllamaResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error(`生成文本失败: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Ollama生成文本出错:", error)
      throw error
    }
  }

  /**
   * 流式生成文本响应
   */
  async *streamText(params: OllamaGenerateParams): AsyncGenerator<OllamaResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...params,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`流式生成文本失败: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("无法获取响应流")
      }

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })

        let newlineIndex
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, newlineIndex)
          buffer = buffer.slice(newlineIndex + 1)

          if (line.trim()) {
            try {
              const data = JSON.parse(line)
              yield data
            } catch (e) {
              console.error("解析流式响应出错:", e)
            }
          }
        }
      }

      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer)
          yield data
        } catch (e) {
          console.error("解析最终响应出错:", e)
        }
      }
    } catch (error) {
      console.error("Ollama流式生成出错:", error)
      throw error
    }
  }

  /**
   * 获取文本嵌入向量
   */
  async getEmbedding(model: string, text: string): Promise<OllamaEmbeddingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt: text,
        }),
      })

      if (!response.ok) {
        throw new Error(`获取嵌入向量失败: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("获取Ollama嵌入向量出错:", error)
      throw error
    }
  }
}

// 导出单例实例
export const ollamaService = new OllamaService()

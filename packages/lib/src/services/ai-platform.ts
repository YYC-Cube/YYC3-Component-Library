// ============================================================
// YYC³ · @yyc3/lib services 轻量桩层（Phase 7 lib services 批次 · 桩 4/4）
// 合集：语音服务 / NLP 处理器 / 语音命令引擎 / Ollama 上下文 / AI 助手上下文
// 桩语义：浏览器 API 降级 + 模拟响应；真身待 lib services 批次并入
// ============================================================
import { createContext, useContext } from 'react'

// ── 语音服务 ──
export interface SpeechRecognitionResult {
  transcript: string
  language: string
  confidence: number
  isFinal?: boolean
}

export interface RecognitionService {
  isSupported: () => boolean
  startListening: (opts?: { language?: string; continuous?: boolean; interimResults?: boolean }) => void
  stopListening: () => void
  onResult: (cb: (result: SpeechRecognitionResult) => void) => void
  onError: (cb: (err: string) => void) => void
}

export interface SynthesisService {
  getStatus: () => { speaking: boolean; paused: boolean; supported: boolean }
  speak: (text: string, language?: string) => void
  stop: () => void
  pause: () => void
  resume: () => void
  isSupported: () => boolean
  setDefaultSettings: (opts: { language?: string; rate?: number; pitch?: number; volume?: number }) => void
}

function createRecognitionService(): RecognitionService {
  const listeners: Array<(r: SpeechRecognitionResult) => void> = []
  const errors: Array<(e: string) => void> = []
  const SR = typeof window !== 'undefined' ? (window as unknown as { SpeechRecognition?: new () => EventTarget & { start: () => void; stop: () => void; lang: string; continuous: boolean; interimResults: boolean; onresult: ((e: Event) => void) | null; onerror: ((e: Event) => void) | null } }).SpeechRecognition : undefined

  return {
    isSupported: () => Boolean(SR),
    startListening: (opts) => {
      if (!SR) {
        errors.forEach((cb) => cb('SpeechRecognition not supported'))
        return
      }
      const rec = new SR()
      rec.lang = opts?.language ?? 'zh-CN'
      rec.continuous = opts?.continuous ?? false
      rec.interimResults = opts?.interimResults ?? false
      rec.onresult = (e: Event) => {
        const ev = e as Event & { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number; isFinal?: boolean }>> }
        const res = ev.results?.[0]?.[0]
        if (res) listeners.forEach((cb) => cb({ transcript: res.transcript, language: rec.lang, confidence: res.confidence, isFinal: true }))
      }
      rec.onerror = (e: Event) => errors.forEach((cb) => cb(String((e as Event & { error?: string }).error ?? 'speech error')))
      rec.start()
    },
    stopListening: () => {
      void 0
    },
    onResult: (cb) => listeners.push(cb),
    onError: (cb: (e: string) => void) => errors.push(cb),
  }
}

function createSynthesisService(): SynthesisService {
  let defaults: { language?: string; rate?: number; pitch?: number; volume?: number } = {}
  return {
    getStatus: () => ({
      speaking: typeof speechSynthesis !== 'undefined' ? speechSynthesis.speaking : false,
      paused: typeof speechSynthesis !== 'undefined' ? speechSynthesis.paused : false,
      supported: typeof speechSynthesis !== 'undefined',
    }),
    speak: (text, language) => {
      if (typeof speechSynthesis === 'undefined') return
      const u = new SpeechSynthesisUtterance(text)
      u.lang = language ?? defaults.language ?? 'zh-CN'
      if (defaults.rate !== undefined) u.rate = defaults.rate
      if (defaults.pitch !== undefined) u.pitch = defaults.pitch
      if (defaults.volume !== undefined) u.volume = defaults.volume
      speechSynthesis.speak(u)
    },
    stop: () => {
      if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
    },
    pause: () => {
      if (typeof speechSynthesis !== 'undefined') speechSynthesis.pause()
    },
    resume: () => {
      if (typeof speechSynthesis !== 'undefined') speechSynthesis.resume()
    },
    isSupported: () => typeof speechSynthesis !== 'undefined',
    setDefaultSettings: (opts) => {
      defaults = opts
    },
  }
}

export const multiLanguageSpeechManager = {
  supportedLanguages: ['zh-CN', 'en-US'] as string[],
  async recognize(_audio: Blob, language = 'zh-CN'): Promise<SpeechRecognitionResult> {
    void language
    return { transcript: '', language, confidence: 0 }
  },
  /** 识别服务（浏览器 SpeechRecognition 封装，源 API） */
  getRecognitionService(): RecognitionService {
    return createRecognitionService()
  },
  /** 合成服务（speechSynthesis 封装，源 API） */
  getSynthesisService(): SynthesisService {
    return createSynthesisService()
  },
  /** 支持语言列表（源 API） */
  getSupportedLanguages(): string[] {
    return [...this.supportedLanguages]
  },
  /** 指定语言播报（源 API） */
  async speakInLanguage(text: string, language = 'zh-CN'): Promise<void> {
    this.getSynthesisService().speak(text, language)
  },
  /** 切换当前语言（源 API） */
  switchLanguage(language: string): void {
    this.supportedLanguages = this.supportedLanguages.includes(language)
      ? this.supportedLanguages
      : [...this.supportedLanguages, language]
  },
}

// ── NLP 处理器 ──
export interface NLPResult {
  intent: string
  entities: Array<{ type: string; value: string }>
  sentiment: 'positive' | 'neutral' | 'negative'
}

export interface NLPResult {
  intent: string
  entities: Array<{ type: string; value: string }>
  sentiment: 'positive' | 'neutral' | 'negative'
  [key: string]: unknown
}

export const nlpProcessor = {
  async analyze(text: string): Promise<NLPResult> {
    const lower = text.toLowerCase()
    const intent =
      lower.includes('查询') || lower.includes('显示')
        ? 'query'
        : lower.includes('生成')
          ? 'generate'
          : 'converse'
    return { intent, entities: [], sentiment: 'neutral' }
  },
  /** 同步处理（源 API：消费方 enhanced-voice-control 使用） */
  process(text: string): NLPResult {
    const lower = text.toLowerCase()
    const intent =
      lower.includes('查询') || lower.includes('显示')
        ? 'query'
        : lower.includes('生成')
          ? 'generate'
          : 'converse'
    return { intent, entities: [], sentiment: 'neutral' }
  },
}

// ── 语音命令引擎 ──
export interface CommandMatch {
  command: string
  confidence: number
  /** 命令模式对象（源 API：含 id/description 等） */
  pattern: {
    id: string
    description?: string
    [key: string]: unknown
  }
  /** 命令参数（源 API） */
  parameters?: {
    chartType?: string
    timePeriod?: string
    format?: string
    page?: string
    query?: string
    [key: string]: unknown
  }
  originalText?: string
}

export const voiceCommandEngine = {
  privateContext: {} as Record<string, unknown>,
  match(transcript: string, commands: string[]): CommandMatch | null {
    const lower = transcript.toLowerCase()
    const hit = commands.find((c) => lower.includes(c.toLowerCase()))
    return hit ? { command: hit, pattern: { id: hit, description: hit }, confidence: 0.9 } : null
  },
  /** 匹配命令（源 API：消费方 enhanced-voice-control 使用 pattern/originalText，返回多匹配数组） */
  matchCommand(
    transcript: string,
  ): Array<CommandMatch & { pattern: { id: string; description?: string }; originalText: string }> {
    const lower = transcript.toLowerCase()
    const hits = this.match(transcript, [transcript])
    // 桩：基于内置命令集返回匹配（无内置命中时给出低置信度通用项）
    return hits
      ? [{ ...hits, pattern: { id: hits.command, description: hits.command }, originalText: transcript }]
      : [
          {
            command: 'no-match',
            confidence: 0.4,
            pattern: { id: lower.slice(0, 20), description: lower.slice(0, 20) },
            originalText: transcript,
          },
        ]
  },
  /** 更新上下文（源 API：消费方 enhanced-voice-control 使用） */
  updateContext(ctx: Record<string, unknown>): void {
    this.privateContext = ctx
  },
}

// ── Ollama 上下文（桩：模型列表 + 连接状态）──
export interface OllamaModel {
  name: string
  size: string
  model?: string
}

export interface OllamaResponse {
  model: string
  response?: string
  message?: { content: string }
  choices?: Array<{ delta?: { content?: string }; message?: { content?: string } }>
  done?: boolean
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  attachments?: Attachment[]
  timestamp?: number
}

export interface Attachment {
  id: string
  name: string
  type: string
  size?: number
  dataUrl?: string
}

export interface OllamaContextValue {
  models: OllamaModel[]
  selectedModel: string | null
  setSelectedModel: (model: string) => void
  isLoading: boolean
  error: Error | null
  refreshModels: () => Promise<void>
  connected: boolean
  /** 流式生成（源 API：消费方 chat-interface 使用） */
  streamText: (prompt: string, onChunk: (chunk: OllamaResponse) => void, options?: { system?: string; options?: { temperature?: number; num_predict?: number } }) => Promise<void>
}

export const OllamaContext = createContext<OllamaContextValue>({
  models: [],
  selectedModel: null,
  setSelectedModel: () => {},
  isLoading: false,
  error: null,
  refreshModels: async () => {},
  connected: false,
  streamText: async () => {},
})

export function useOllama(): OllamaContextValue {
  return useContext(OllamaContext)
}

// ── AI 助手上下文（桩：消息列表 + 发送）──
export interface AIAssistantMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AIAssistantContextValue {
  messages: AIAssistantMessage[]
  sendMessage: (content: string) => Promise<void>
  clear: () => void
}

const AIAssistantContext = createContext<AIAssistantContextValue>({
  messages: [],
  sendMessage: async () => {},
  clear: () => {},
})

export function useAIAssistant(): AIAssistantContextValue {
  return useContext(AIAssistantContext)
}

export { AIAssistantContext }

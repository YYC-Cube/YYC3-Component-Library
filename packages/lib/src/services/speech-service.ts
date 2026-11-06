// ============================================================
// YYC³ · @yyc3/lib services 真身（lib services 真身批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/YYC-cloud-platform/lib/services/speech-service.ts
// ============================================================
"use client"

/**
 * ⟨YYC³⟩ 语音交互服务
 * 提供语音识别、语音合成、多语言支持等功能
 */

export interface SpeechRecognitionOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  maxAlternatives?: number
  grammars?: string[]
}

export interface SpeechSynthesisOptions {
  language?: string
  voice?: SpeechSynthesisVoice
  rate?: number
  pitch?: number
  volume?: number
}

export interface VoiceCommand {
  command: string
  patterns: RegExp[]
  action: (params?: any) => void
  description: string
  category: string
}

export interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
  alternatives?: string[]
}

export interface VoiceProfile {
  id: string
  name: string
  language: string
  voice: SpeechSynthesisVoice
  settings: SpeechSynthesisOptions
}

/**
 * 语音识别服务类
 */
export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null
  private isListening = false
  private commands: Map<string, VoiceCommand> = new Map()
  private currentLanguage = "zh-CN"
  private onResultCallback?: (result: SpeechRecognitionResult) => void
  private onErrorCallback?: (error: string) => void

  constructor() {
    this.initializeRecognition()
    this.setupDefaultCommands()
  }

  /**
   * 初始化语音识别
   */
  private initializeRecognition() {
    if (!this.isSupported()) {
      console.warn("浏览器不支持语音识别")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    this.recognition = new SpeechRecognition()

    if (this.recognition) {
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = this.currentLanguage
      this.recognition.maxAlternatives = 3

      this.recognition.onstart = () => {
        this.isListening = true
        console.log("语音识别已启动")
      }

      this.recognition.onend = () => {
        this.isListening = false
        console.log("语音识别已停止")
      }

      this.recognition.onresult = (event) => {
        const results = Array.from(event.results)
        const lastResult = results[results.length - 1]

        if (lastResult) {
          const transcript = lastResult[0].transcript.trim()
          const confidence = lastResult[0].confidence
          const isFinal = lastResult.isFinal

          const result: SpeechRecognitionResult = {
            transcript,
            confidence,
            isFinal,
            alternatives: Array.from(lastResult).map((alt) => alt.transcript),
          }

          this.onResultCallback?.(result)

          // 如果是最终结果，尝试匹配命令
          if (isFinal) {
            this.processCommand(transcript)
          }
        }
      }

      this.recognition.onerror = (event) => {
        const errorMessage = this.getErrorMessage(event.error)
        this.onErrorCallback?.(errorMessage)
        console.error("语音识别错误:", errorMessage)
      }
    }
  }

  /**
   * 检查浏览器支持
   */
  isSupported(): boolean {
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window
  }

  /**
   * 开始语音识别
   */
  startListening(options?: SpeechRecognitionOptions): void {
    if (!this.recognition || this.isListening) return

    if (options) {
      this.recognition.lang = options.language || this.currentLanguage
      this.recognition.continuous = options.continuous ?? true
      this.recognition.interimResults = options.interimResults ?? true
      this.recognition.maxAlternatives = options.maxAlternatives ?? 3
    }

    try {
      this.recognition.start()
    } catch (error) {
      console.error("启动语音识别失败:", error)
    }
  }

  /**
   * 停止语音识别
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  /**
   * 设置结果回调
   */
  onResult(callback: (result: SpeechRecognitionResult) => void): void {
    this.onResultCallback = callback
  }

  /**
   * 设置错误回调
   */
  onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback
  }

  /**
   * 注册语音命令
   */
  registerCommand(command: VoiceCommand): void {
    this.commands.set(command.command, command)
  }

  /**
   * 批量注册命令
   */
  registerCommands(commands: VoiceCommand[]): void {
    commands.forEach((command) => this.registerCommand(command))
  }

  /**
   * 处理语音命令
   */
  private processCommand(transcript: string): void {
    const normalizedTranscript = transcript.toLowerCase().trim()

    for (const [, command] of this.commands) {
      for (const pattern of command.patterns) {
        const match = normalizedTranscript.match(pattern)
        if (match) {
          console.log(`执行语音命令: ${command.command}`)
          command.action(match.groups || match.slice(1))
          return
        }
      }
    }
  }

  /**
   * 设置默认命令
   */
  private setupDefaultCommands(): void {
    const defaultCommands: VoiceCommand[] = [
      {
        command: "stop_listening",
        patterns: [/停止|结束|关闭/],
        action: () => this.stopListening(),
        description: "停止语音识别",
        category: "系统控制",
      },
      {
        command: "help",
        patterns: [/帮助|指令|命令/],
        action: () => this.showAvailableCommands(),
        description: "显示可用命令",
        category: "系统控制",
      },
    ]

    this.registerCommands(defaultCommands)
  }

  /**
   * 显示可用命令
   */
  private showAvailableCommands(): void {
    const commandsByCategory = new Map<string, VoiceCommand[]>()

    for (const [, command] of this.commands) {
      if (!commandsByCategory.has(command.category)) {
        commandsByCategory.set(command.category, [])
      }
      commandsByCategory.get(command.category)!.push(command)
    }

    console.log("可用语音命令:")
    for (const [category, commands] of commandsByCategory) {
      console.log(`${category}:`)
      commands.forEach((cmd) => {
        console.log(`  - ${cmd.description}`)
      })
    }
  }

  /**
   * 获取错误信息
   */
  private getErrorMessage(error: string): string {
    const errorMessages: { [key: string]: string } = {
      "no-speech": "未检测到语音输入",
      "audio-capture": "无法捕获音频",
      "not-allowed": "麦克风权限被拒绝",
      network: "网络错误",
      "service-not-allowed": "语音识别服务不可用",
      "bad-grammar": "语法错误",
      "language-not-supported": "不支持的语言",
    }

    return errorMessages[error] || `未知错误: ${error}`
  }

  /**
   * 获取当前状态
   */
  getStatus() {
    return {
      isSupported: this.isSupported(),
      isListening: this.isListening,
      language: this.currentLanguage,
      commandCount: this.commands.size,
    }
  }
}

/**
 * 语音合成服务类
 */
export class SpeechSynthesisService {
  private synth: SpeechSynthesis
  private voices: SpeechSynthesisVoice[] = []
  private currentVoice: SpeechSynthesisVoice | null = null
  private defaultSettings: SpeechSynthesisOptions = {
    rate: 1,
    pitch: 1,
    volume: 1,
    language: "zh-CN",
  }

  constructor() {
    // 真身批次自愈登记：源件假定浏览器环境（SSR/jsdom 模块加载即访问 window 会崩）。
    // 非浏览器环境降级为 no-op 桩对象（与仓内 services 桩层同语义），其余真身行为不变。
    this.synth =
      typeof window !== "undefined" && "speechSynthesis" in window
        ? window.speechSynthesis
        : ({
            getVoices: () => [],
            speak: () => {},
            cancel: () => {},
            pause: () => {},
            resume: () => {},
          } as unknown as SpeechSynthesis)
    this.loadVoices()
  }

  /**
   * 检查浏览器支持
   */
  isSupported(): boolean {
    return "speechSynthesis" in window
  }

  /**
   * 加载可用语音
   */
  private loadVoices(): void {
    const loadVoicesImpl = () => {
      this.voices = this.synth.getVoices()
      if (this.voices.length > 0 && !this.currentVoice) {
        // 优先选择中文语音
        this.currentVoice =
          this.voices.find((voice) => voice.lang.startsWith("zh")) ||
          this.voices.find((voice) => voice.default) ||
          this.voices[0]
      }
    }

    loadVoicesImpl()

    // 某些浏览器需要异步加载语音
    if (this.voices.length === 0) {
      this.synth.onvoiceschanged = loadVoicesImpl
    }
  }

  /**
   * 获取可用语音列表
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.voices
  }

  /**
   * 按语言获取语音
   */
  getVoicesByLanguage(language: string): SpeechSynthesisVoice[] {
    return this.voices.filter((voice) => voice.lang.startsWith(language))
  }

  /**
   * 设置当前语音
   */
  setVoice(voice: SpeechSynthesisVoice): void {
    this.currentVoice = voice
  }

  /**
   * 语音播报
   */
  speak(text: string, options?: SpeechSynthesisOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error("浏览器不支持语音合成"))
        return
      }

      // 停止当前播报
      this.stop()

      const utterance = new SpeechSynthesisUtterance(text)

      // 应用设置
      const settings = { ...this.defaultSettings, ...options }
      utterance.rate = settings.rate!
      utterance.pitch = settings.pitch!
      utterance.volume = settings.volume!

      // 设置语音
      if (options?.voice) {
        utterance.voice = options.voice
      } else if (this.currentVoice) {
        utterance.voice = this.currentVoice
      }

      // 设置语言
      if (settings.language) {
        utterance.lang = settings.language
      }

      // 事件处理
      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(new Error(`语音合成错误: ${event.error}`))

      // 开始播报
      this.synth.speak(utterance)
    })
  }

  /**
   * 停止播报
   */
  stop(): void {
    if (this.synth.speaking) {
      this.synth.cancel()
    }
  }

  /**
   * 暂停播报
   */
  pause(): void {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause()
    }
  }

  /**
   * 恢复播报
   */
  resume(): void {
    if (this.synth.paused) {
      this.synth.resume()
    }
  }

  /**
   * 获取状态
   */
  getStatus() {
    return {
      isSupported: this.isSupported(),
      speaking: this.synth.speaking,
      paused: this.synth.paused,
      pending: this.synth.pending,
      voiceCount: this.voices.length,
      currentVoice: this.currentVoice?.name || "未选择",
    }
  }

  /**
   * 设置默认配置
   */
  setDefaultSettings(settings: Partial<SpeechSynthesisOptions>): void {
    this.defaultSettings = { ...this.defaultSettings, ...settings }
  }
}

/**
 * 多语言语音管理器
 */
export class MultiLanguageSpeechManager {
  private recognitionService: SpeechRecognitionService
  private synthesisService: SpeechSynthesisService
  private currentLanguage = "zh-CN"
  private voiceProfiles: Map<string, VoiceProfile> = new Map()

  // 支持的语言配置
  private languageConfig = {
    "zh-CN": { name: "中文(简体)", flag: "🇨🇳" },
    "zh-TW": { name: "中文(繁体)", flag: "🇹🇼" },
    "en-US": { name: "English (US)", flag: "🇺🇸" },
    "en-GB": { name: "English (UK)", flag: "🇬🇧" },
    "ja-JP": { name: "日本語", flag: "🇯🇵" },
    "ko-KR": { name: "한국어", flag: "🇰🇷" },
    "fr-FR": { name: "Français", flag: "🇫🇷" },
    "de-DE": { name: "Deutsch", flag: "🇩🇪" },
    "es-ES": { name: "Español", flag: "🇪🇸" },
    "ru-RU": { name: "Русский", flag: "🇷🇺" },
  }

  constructor() {
    this.recognitionService = new SpeechRecognitionService()
    this.synthesisService = new SpeechSynthesisService()
    this.initializeVoiceProfiles()
  }

  /**
   * 初始化语音配置文件
   */
  private initializeVoiceProfiles(): void {
    const voices = this.synthesisService.getVoices()

    Object.keys(this.languageConfig).forEach((lang) => {
      const voice = voices.find((v) => v.lang === lang) || voices.find((v) => v.lang.startsWith(lang.split("-")[0]))

      if (voice) {
        const profile: VoiceProfile = {
          id: lang,
          name: this.languageConfig[lang as keyof typeof this.languageConfig].name,
          language: lang,
          voice,
          settings: {
            language: lang,
            voice,
            rate: 1,
            pitch: 1,
            volume: 1,
          },
        }
        this.voiceProfiles.set(lang, profile)
      }
    })
  }

  /**
   * 切换语言
   */
  switchLanguage(language: string): void {
    if (this.languageConfig[language as keyof typeof this.languageConfig]) {
      this.currentLanguage = language
      const profile = this.voiceProfiles.get(language)
      if (profile) {
        this.synthesisService.setVoice(profile.voice)
      }
    }
  }

  /**
   * 获取当前语言
   */
  getCurrentLanguage(): string {
    return this.currentLanguage
  }

  /**
   * 获取支持的语言列表
   */
  getSupportedLanguages() {
    return Object.entries(this.languageConfig).map(([code, config]) => ({
      code,
      name: config.name,
      flag: config.flag,
      hasVoice: this.voiceProfiles.has(code),
    }))
  }

  /**
   * 多语言语音播报
   */
  async speakInLanguage(text: string, language?: string): Promise<void> {
    const targetLanguage = language || this.currentLanguage
    const profile = this.voiceProfiles.get(targetLanguage)

    if (profile) {
      await this.synthesisService.speak(text, profile.settings)
    } else {
      await this.synthesisService.speak(text, { language: targetLanguage })
    }
  }

  /**
   * 获取识别服务
   */
  getRecognitionService(): SpeechRecognitionService {
    return this.recognitionService
  }

  /**
   * 获取合成服务
   */
  getSynthesisService(): SpeechSynthesisService {
    return this.synthesisService
  }

  /**
   * 获取语音配置文件
   */
  getVoiceProfile(language: string): VoiceProfile | undefined {
    return this.voiceProfiles.get(language)
  }

  /**
   * 更新语音配置文件
   */
  updateVoiceProfile(language: string, settings: Partial<SpeechSynthesisOptions>): void {
    const profile = this.voiceProfiles.get(language)
    if (profile) {
      profile.settings = { ...profile.settings, ...settings }
      this.voiceProfiles.set(language, profile)
    }
  }
}

// 导出服务实例
export const speechRecognitionService = new SpeechRecognitionService()
export const speechSynthesisService = new SpeechSynthesisService()
export const multiLanguageSpeechManager = new MultiLanguageSpeechManager()

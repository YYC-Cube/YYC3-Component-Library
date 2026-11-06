// ============================================================
// YYC³ · Web Speech API 补充环境声明（lib services 真身批次 · 2026-11-06）
// TS 5.9 lib.dom 已含 SpeechRecognitionAlternative/Result/ResultList（结果类型），
// 但缺 SpeechRecognition 接口、事件类型与全局构造器（Chromium 历史实现未入标准 lib）。
// 此处按 W3C Speech API 规范补齐缺失面，供 services/speech-service.ts 消费。
// ============================================================

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  /** 错误码（no-speech / audio-capture / not-allowed / network 等） */
  readonly error: string
  readonly message: string
}

interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  start(): void
  stop(): void
  abort(): void
}

declare var SpeechRecognition: { prototype: SpeechRecognition; new (): SpeechRecognition }

interface Window {
  /** Chromium 前缀实现 */
  webkitSpeechRecognition?: { prototype: SpeechRecognition; new (): SpeechRecognition }
}

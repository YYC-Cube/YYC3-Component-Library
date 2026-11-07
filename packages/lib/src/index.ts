// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// @File    : index.ts · @yyc3/lib 桶文件（首批滚动抽取 · 2026-11-04）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-8/
//   yyc3-reusable-components/packages/utils（零依赖工具函数）
// 本批范围：date / string / validation / data（color 因扫描器误报移出待复核）
// 后续批次：hooks / types / error-handling / i18n 等 28 包功能库甄别并入
// ============================================================

// ============================================================
// A3 移交批次（2026-11-07）：88 区 yyc3-shared-packages utils(cn) 并入
// 源（D0 权威副本）：/Volumes/Development/YYC3-88/yyc3-shared-packages/packages/utils/src/utils.ts
// 消费方迁移指引（RETIREMENT-PLAN）：`@yyc3/utils` → `@yyc3/lib`
// ============================================================

// className 合并器（shadcn 惯例 cn，家族多数派规范件）
export { cn } from './utils/cn';

// Date utilities
export { getGreeting, getHourlyCare, formatDate, getRelativeTime, isToday, isThisWeek } from './utils/date';

// String utilities
export {
  truncate,
  capitalize,
  camelToKebab,
  kebabToCamel,
  randomString,
  uuid,
  interpolate,
  escapeHtml,
  unescapeHtml,
  isBlank,
  removeWhitespace,
  truncateByWords,
  slugify,
} from './utils/string';

// Validation utilities（类型保护）
export {
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isDate,
  isEmail,
  isURL,
  validateConfig,
  deepMerge,
  cleanObject,
} from './utils/validation';

// Data utilities
export { getMember, getDataSummary, deepClone, unique, groupBy, chunk } from './utils/data';

// ============================================================
// B2a 批次（2026-11-04）：types / hooks / i18n
// 源（D0 权威副本）：UI-8/yyc3-reusable-components/packages/{types,hooks,i18n}
// ============================================================

// Types（错误/用户/i18n/组件状态）
export type {
  ErrorCategory, ErrorSeverity, ErrorBoundaryLevel, AppError, ErrorStats,
  UserRole, AppUser, AppSession, AuthContextValue,
  Locale, LocaleInfo, I18nContextValue, I18nMessages,
  LoadingState, ComponentStatus,
} from './types';
export type { AsyncState } from './types';

// Hooks
export { useToggle } from './hooks/useToggle';
export { useClickOutside } from './hooks/useClickOutside';
export {
  useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, useIsDarkMode, useIsReducedMotion,
} from './hooks/useMediaQuery';
export { useLocalStorage } from './hooks/useLocalStorage';
export { useDebounce, useDebouncedCallback } from './hooks/useDebounce';
export { useWindowSize, useWindowWidth, useWindowHeight } from './hooks/useWindowSize';
export { I18nProvider, I18nContext, useI18n } from './hooks/useI18n';
export type { I18nProviderProps } from './hooks/useI18n';

// i18n 翻译器
export {
  createTranslator, mergeMessages, validateMessages, extractKeys, checkConsistency,
} from './i18n/translator';

// ============================================================
// services 真身（lib services 真身批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/YYC-cloud-platform/lib/{services,contexts}
// 10 件 ~5,183 行零外部依赖闭包；桩层全部退役
// ============================================================

// 语音服务（识别/合成/多语言管理）
export {
  SpeechRecognitionService, SpeechSynthesisService, MultiLanguageSpeechManager,
  speechRecognitionService, speechSynthesisService, multiLanguageSpeechManager,
} from './services/speech-service';
export type {
  SpeechRecognitionOptions, SpeechSynthesisOptions, VoiceCommand,
  SpeechRecognitionResult, VoiceProfile,
} from './services/speech-service';

// NLP 处理器
export { NLPProcessor, nlpProcessor } from './services/nlp-processor';
export type { NLPResult, Entity, IntentPattern } from './services/nlp-processor';

// 语音命令引擎
export { VoiceCommandEngine, voiceCommandEngine } from './services/voice-command-engine';
export type { CommandPattern, CommandParameter, CommandMatch, VoiceContext } from './services/voice-command-engine';

// 移动端服务
export { useDeviceDetection, useTouchDetection, usePwaInstall, useGestures } from './services/mobile-service';
export type { MobileDetectionOptions } from './services/mobile-service';

// 可视化服务
export {
  useDataset, dataTransformers, chartThemes, chartUtils, defaultChartOptions,
} from './services/visualization-service';
export type {
  ChartType, InteractionType, ChartOptions, ChartAnnotation,
  ChartData, DataPoint, DataSeries, DatasetOptions,
} from './services/visualization-service';

// 图表语音控制
export {
  ChartVoiceControlService, ChartVoiceControlManager, chartVoiceControlManager,
} from './services/chart-voice-control';
export type { ChartVoiceControlOptions, ChartDataSpeechOptions } from './services/chart-voice-control';

// Ollama 服务
export { OllamaService, ollamaService } from './services/ollama-service';
export type {
  OllamaModelInfo, OllamaGenerateParams, OllamaResponse, OllamaEmbeddingResponse,
} from './services/ollama-service';

// AI 助手服务
export { AIAssistantService, aiAssistantService } from './services/ai-assistant-service';
export type {
  Message, Conversation, ConversationContext, ConversationSettings,
  UserProfile, ToolCall, Attachment, Reaction, AIProvider,
} from './services/ai-assistant-service';

// 上下文（Provider 模式，源 contexts/ 布局保留）
export { OllamaProvider, useOllama } from './contexts/ollama-context';
export { AIAssistantProvider, useAIAssistant } from './contexts/ai-assistant-context';

// ============================================================
// B2b 批次（2026-11-04）：error-handling
// 源（D0 权威副本）：UI-8/yyc3-reusable-components/packages/error-handling
// ============================================================

// 平台错误过滤器
export {
  PlatformErrorFilter,
  createFigmaErrorFilter,
  isPlatformError,
} from './error-handling/platform-error-filter';
export type { FilterRule, ErrorContext } from './error-handling/platform-error-filter';

// 错误处理器
export {
  ErrorHandler,
  LocalStorageErrorStorage,
  getErrorHandler,
  captureError,
  getErrorLog,
  getErrorStats,
  clearErrorLog,
  trySafe,
  trySafeSync,
} from './error-handling/error-handler';
export type { ErrorStorage, ErrorHandlerConfig } from './error-handling/error-handler';

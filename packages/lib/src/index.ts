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

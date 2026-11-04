// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/lib 通用类型
// 源（D0）：UI-8/yyc3-reusable-components/packages/types/src/index.ts（节选：
// 错误/用户/i18n/组件状态四段，其余段随需求批次补入）
// ============================================================

// ═══ 错误处理类型 ═══
export type ErrorCategory = 'network' | 'parse' | 'auth' | 'runtime' | 'validation' | 'storage' | 'unknown';
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';
export type ErrorBoundaryLevel = 'page' | 'module' | 'component';

export interface AppError {
  id: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: number;
  stack?: string;
  context?: Record<string, unknown>;
  resolved: boolean;
  source?: string;
  userAction?: string;
}

export interface ErrorStats {
  total: number;
  byCategory: Record<ErrorCategory, number>;
  bySeverity: Record<ErrorSeverity, number>;
  recent: AppError[];
  unresolvedCount?: number;
  lastErrorTime?: number | null;
}

// ═══ 用户与认证类型 ═══
export type UserRole = 'admin' | 'user' | 'guest';

export interface AppUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  created_at?: string;
}

export interface AppSession {
  user: AppUser;
  token?: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
}

export interface AuthContextValue {
  logout: () => Promise<void>;
  userEmail: string;
  userRole: UserRole | null;
  isGhost: boolean;
}

// ═══ 国际化类型 ═══
export type Locale = 'zh-CN' | 'en-US';

export interface LocaleInfo {
  code: string;
  label: string;
  nativeLabel: string;
}

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  availableLocales: LocaleInfo[];
}

export interface I18nMessages {
  [key: string]: string | I18nMessages;
}

// ═══ 组件状态类型 ═══
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

export interface ComponentStatus {
  mounted: boolean;
  ready: boolean;
  error: AppError | null;
}

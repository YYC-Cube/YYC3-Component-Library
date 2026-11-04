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

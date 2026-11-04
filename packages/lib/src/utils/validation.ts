// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/lib 数据验证工具
// 源：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-8/yyc3-reusable-components/packages/utils/src/validation.ts
// 全部为类型保护（Type Guards），零依赖
// ============================================================

/** 验证字符串 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/** 验证数字（排除 NaN） */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/** 验证布尔值 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/** 验证对象（排除数组与 null） */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 验证数组 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/** 验证日期（含可解析的日期字符串） */
export function isDate(value: unknown): value is Date {
  return value instanceof Date || (isString(value) && !isNaN(Date.parse(value)));
}

/** 验证邮箱格式 */
export function isEmail(value: unknown): boolean {
  if (!isString(value)) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/** 验证 URL 格式 */
export function isURL(value: unknown): boolean {
  if (!isString(value)) {
    return false;
  }
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/** 验证配置对象是否含全部必填字段 */
export function validateConfig(value: unknown, requiredFields: string[]): boolean {
  if (!isObject(value)) {
    return false;
  }
  return requiredFields.every((field) => field in value);
}

/** 深度合并对象（source 覆盖 target，忽略 undefined） */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (source[key] !== undefined) {
      if (isObject(result[key]) && isObject(source[key])) {
        result[key] = deepMerge(
          result[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>,
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
  }
  return result;
}

/** 清理对象（移除 undefined 值） */
export function cleanObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

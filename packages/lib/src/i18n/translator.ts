// ============================================================
// YYC³ · @yyc3/lib i18n 翻译器（源：UI-8 yyc3-reusable-components/packages/i18n/translator.ts）
// 嵌套 key / 模板变量 / 合并 / 校验 / 一致性检查
// ============================================================
import type { I18nMessages } from '../types';

export function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let result: unknown = obj;
  for (const k of keys) {
    if (result === null || typeof result !== 'object') return path;
    result = (result as Record<string, unknown>)[k];
  }
  return typeof result === 'string' ? result : path;
}

export function interpolateT(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : '{' + key + '}',
  );
}

function deepMergeMsgs<T extends I18nMessages>(target: T, source: Partial<T>): T {
  const output = { ...target } as Record<string, unknown>;
  for (const key in source) {
    const sv = source[key];
    if (sv !== undefined) {
      const tv = (target as Record<string, unknown>)[key];
      if (
        typeof sv === 'object' && sv !== null && !Array.isArray(sv) &&
        typeof tv === 'object' && tv !== null && !Array.isArray(tv)
      ) {
        output[key] = deepMergeMsgs(tv as I18nMessages, sv as I18nMessages);
      } else {
        output[key] = sv;
      }
    }
  }
  return output as T;
}

/** 创建翻译函数（t 支持 "nav.home" 嵌套与 {name} 变量） */
export function createTranslator(
  messages: I18nMessages,
): (key: string, vars?: Record<string, string | number>) => string {
  return (key, vars) => interpolateT(getNestedValue(messages as Record<string, unknown>, key), vars);
}

/** 合并多个翻译对象 */
export function mergeMessages<T extends I18nMessages>(...messages: Partial<T>[]): T {
  return messages.reduce((acc: T, msg: Partial<T>) => deepMergeMsgs(acc, msg), {} as T);
}

/** 校验翻译：非字符串/空串 → 错误清单 */
export function validateMessages(messages: I18nMessages): string[] {
  const errors: string[] = [];
  function traverse(obj: Record<string, unknown>, path = '') {
    for (const key in obj) {
      const fullPath = path ? path + '.' + key : key;
      const value = obj[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value as Record<string, unknown>, fullPath);
      } else if (typeof value !== 'string') {
        errors.push('[' + fullPath + '] Translation must be a string');
      } else if (!value.trim()) {
        errors.push('[' + fullPath + '] Translation is empty');
      }
    }
  }
  traverse(messages as Record<string, unknown>);
  return errors;
}

/** 提取全部翻译 key */
export function extractKeys(messages: I18nMessages): string[] {
  const keys: string[] = [];
  function traverse(obj: Record<string, unknown>, path = '') {
    for (const key in obj) {
      const fullPath = path ? path + '.' + key : key;
      const value = obj[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value as Record<string, unknown>, fullPath);
      } else if (typeof value === 'string') {
        keys.push(fullPath);
      }
    }
  }
  traverse(messages as Record<string, unknown>);
  return keys;
}

/** 双语包一致性检查 */
export function checkConsistency(messages1: I18nMessages, messages2: I18nMessages): {
  missingInMessages1: string[];
  missingInMessages2: string[];
  commonKeys: string[];
} {
  const keys1 = new Set(extractKeys(messages1));
  const keys2 = new Set(extractKeys(messages2));
  return {
    missingInMessages1: [...keys2].filter((k) => !keys1.has(k)),
    missingInMessages2: [...keys1].filter((k) => !keys2.has(k)),
    commonKeys: [...keys1].filter((k) => keys2.has(k)),
  };
}

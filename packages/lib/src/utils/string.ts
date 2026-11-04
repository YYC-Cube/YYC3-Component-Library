// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/lib 字符串工具
// 源：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-8/yyc3-reusable-components/packages/utils/src/string.ts
// ============================================================

/** 截断字符串（默认后缀 "..."） */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/** 首字母大写 */
export function capitalize(str: string): string {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** 驼峰 → 短横线 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** 短横线 → 驼峰 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

/** 生成随机字符串（可指定字符集） */
export function randomString(
  length: number = 8,
  chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/** 生成 UUID（v4 形态，非加密安全） */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** 模板变量替换："Hello {name}" + { name: 'World' } → "Hello World"（未命中的占位符保留） */
export function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : '{' + key + '}',
  );
}

/** 转义 HTML 特殊字符 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

/** 反转义 HTML 特殊字符 */
export function unescapeHtml(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (char) => htmlUnescapes[char]);
}

/** 是否空串/纯空白 */
export function isBlank(str: string | null | undefined): boolean {
  return str === null || str === undefined || str.trim().length === 0;
}

/** 移除全部空白字符 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s+/g, '');
}

/** 按单词数截断 */
export function truncateByWords(str: string, maxWords: number, suffix: string = '...'): string {
  const words = str.split(/\s+/);
  if (words.length <= maxWords) {
    return str;
  }
  return words.slice(0, maxWords).join(' ') + suffix;
}

/** 生成 URL 友好 slug */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

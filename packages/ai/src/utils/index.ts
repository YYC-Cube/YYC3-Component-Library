/**
 * @file 工具函数库
 * @description 提供通用的辅助函数
 * @module utils
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

/**
 * 格式化日期时间
 * @param date 日期对象或时间戳
 * @param format 格式化字符串
 * @returns 格式化后的日期字符串
 */
export const formatDateTime = (date: Date | string | number, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间(毫秒)
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间(毫秒)
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 拷贝后的新对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否为有效邮箱
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
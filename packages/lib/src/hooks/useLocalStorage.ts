// ============================================================
// YYC³ · @yyc3/lib useLocalStorage（源：UI-8 yyc3-reusable-components/packages/hooks）
// 本地存储 Hook：跨标签页同步、SSR 安全、类型推断
// ============================================================
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.error('Error reading localStorage key "' + key + '":', error);
      return defaultValue;
    }
  });

  // 跨标签页同步
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue) as T);
        } catch (error) {
          console.error('Error parsing localStorage value for key "' + key + '":', error);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  const setStoredValue = useCallback(
    (valueOrFn: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          typeof valueOrFn === 'function' ? (valueOrFn as (prev: T) => T)(value) : valueOrFn;
        setValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error('Error setting localStorage key "' + key + '":', error);
      }
    },
    [key, value],
  );

  const removeValue = useCallback(() => {
    try {
      setValue(defaultValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing localStorage key "' + key + '":', error);
    }
  }, [key, defaultValue]);

  return [value, setStoredValue, removeValue];
}

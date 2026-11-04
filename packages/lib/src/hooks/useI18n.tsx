// ============================================================
// YYC³ · @yyc3/lib useI18n（源：UI-8 yyc3-reusable-components/packages/hooks/useI18n.tsx）
// 国际化 Hook：localStorage 持久化 + Context 共享 + 嵌套 key/模板变量
// ============================================================
import React, { useState, useCallback, useMemo, createContext, useContext } from 'react';
import type { Locale, LocaleInfo, I18nMessages } from '../types';

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  availableLocales: LocaleInfo[];
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let result: unknown = obj;
  for (const k of keys) {
    if (result === null || typeof result !== 'object') return path;
    result = (result as Record<string, unknown>)[k];
  }
  return typeof result === 'string' ? result : path;
}

function interpolateT(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : '{' + key + '}',
  );
}

export interface I18nProviderProps {
  children: React.ReactNode;
  defaultLocale?: Locale;
  messages: Record<Locale, I18nMessages>;
  availableLocales?: LocaleInfo[];
  storageKey?: string;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: 'zh-CN',
  setLocale: () => {},
  t: (key) => key,
  availableLocales: [],
});

export function I18nProvider({
  children,
  defaultLocale = 'zh-CN',
  messages,
  availableLocales = [
    { code: 'zh-CN', label: '简体中文', nativeLabel: '简体中文' },
    { code: 'en-US', label: 'English', nativeLabel: 'English' },
  ],
  storageKey = 'yyc3_locale',
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    /* istanbul ignore next -- SSR 守卫：jsdom 环境结构性不可达 */
    if (typeof window === 'undefined') return defaultLocale;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'en-US' || saved === 'zh-CN') return saved as Locale;
    } catch {
      // storage 不可用
    }
    return defaultLocale;
  });

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleState(newLocale);
      try {
        localStorage.setItem(storageKey, newLocale);
      } catch {
        // storage 不可用
      }
    },
    [storageKey],
  );

  const translations = useMemo(() => messages[locale], [messages, locale]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string =>
      interpolateT(getNestedValue(translations as Record<string, unknown>, key), vars),
    [translations],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, availableLocales }),
    [locale, setLocale, t, availableLocales],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

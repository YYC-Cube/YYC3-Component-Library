import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/**
 * 双语系统类型定义
 * 支持中文(zh)与英文(en)，默认中文
 */
type Language = 'zh' | 'en';

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
  t: (zh: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('zh');

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh'));
  }, []);

  const t = useCallback(
    (zh: string, en: string): string => {
      return language === 'zh' ? zh : en;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextProps {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

/**
 * 主题系统类型定义
 * 支持 dark（深空）/ light（极光白）两套色系
 * localStorage 持久化偏好
 */
type ThemeMode = 'dark' | 'light';

/**
 * 主题色彩令牌 — 所有组件通过此接口获取颜色
 * 遵循"无边界核心"设计，仅提供渐变/透明度色值，无边框色
 */
interface ThemeColors {
  /** 页面主背景渐变 */
  pageBg: string;
  /** 文本主色 */
  textPrimary: string;
  /** 文本次色 */
  textSecondary: string;
  /** 文本淡色 */
  textMuted: string;
  /** 文本微弱 */
  textFaint: string;
  /** 玻璃面板背景 */
  glassPanel: string;
  /** 玻璃面板边缘光晕 */
  glassEdge: string;
  /** 悬停面板高亮 */
  glassHover: string;
  /** 遮罩背景 */
  backdropBg: string;
  /** 面板深色背景 */
  panelBg: string;
  /** 分隔线 */
  separator: string;
  /** 输入框背景 */
  inputBg: string;
  /** 粒子主色 purple */
  particlePurple: string;
  /** 粒子副色 cyan */
  particleCyan: string;
  /** 扫描线色 */
  scanLine: string;
  /** HUD 角标色 */
  hudAccent: string;
  /** 网格线色 */
  gridLine: string;
  /** 数据流色 */
  dataStream: string;
}

interface ThemeContextProps {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
}

const DARK_COLORS: ThemeColors = {
  pageBg:
    'linear-gradient(180deg, #030014 0%, #0a0520 30%, #050218 60%, #030014 100%)',
  textPrimary: 'rgba(255,255,255,0.95)',
  textSecondary: 'rgba(255,255,255,0.50)',
  textMuted: 'rgba(255,255,255,0.30)',
  textFaint: 'rgba(255,255,255,0.15)',
  glassPanel:
    'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.03) 100%)',
  glassEdge:
    'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)',
  glassHover: 'rgba(255,255,255,0.04)',
  backdropBg: 'rgba(0,0,0,0.70)',
  panelBg:
    'linear-gradient(180deg, rgba(10,8,32,0.95) 0%, rgba(10,8,32,0.9) 100%)',
  separator: 'rgba(255,255,255,0.06)',
  inputBg: 'rgba(255,255,255,0.05)',
  particlePurple: '#7c3aed',
  particleCyan: '#06b6d4',
  scanLine: 'rgba(124,58,237,0.15)',
  hudAccent: 'rgba(124,58,237,0.25)',
  gridLine: 'rgba(124,58,237,0.03)',
  dataStream: 'rgba(124,58,237,0.20)',
};

const LIGHT_COLORS: ThemeColors = {
  pageBg:
    'linear-gradient(180deg, #f8f6ff 0%, #eee8ff 30%, #f0f0ff 60%, #f8f6ff 100%)',
  textPrimary: 'rgba(15,10,40,0.95)',
  textSecondary: 'rgba(15,10,40,0.55)',
  textMuted: 'rgba(15,10,40,0.35)',
  textFaint: 'rgba(15,10,40,0.15)',
  glassPanel:
    'linear-gradient(135deg, rgba(15,10,40,0.03) 0%, rgba(15,10,40,0.01) 50%, rgba(15,10,40,0.02) 100%)',
  glassEdge:
    'linear-gradient(135deg, rgba(15,10,40,0.06) 0%, transparent 40%, transparent 60%, rgba(15,10,40,0.03) 100%)',
  glassHover: 'rgba(15,10,40,0.04)',
  backdropBg: 'rgba(255,255,255,0.70)',
  panelBg:
    'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,246,255,0.9) 100%)',
  separator: 'rgba(15,10,40,0.08)',
  inputBg: 'rgba(15,10,40,0.04)',
  particlePurple: '#9f6eff',
  particleCyan: '#22d3ee',
  scanLine: 'rgba(124,58,237,0.08)',
  hudAccent: 'rgba(124,58,237,0.12)',
  gridLine: 'rgba(124,58,237,0.04)',
  dataStream: 'rgba(124,58,237,0.12)',
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const STORAGE_KEY = 'yyc3-theme-mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      /* noop */
    }
    return 'dark';
  });

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  const isDark = mode === 'dark';
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  /** 同步 CSS 自定义属性到 :root */
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-text-primary', colors.textPrimary);
    root.style.setProperty('--theme-text-secondary', colors.textSecondary);
    root.style.setProperty('--theme-text-muted', colors.textMuted);
    root.style.setProperty('--theme-text-faint', colors.textFaint);
    root.style.setProperty('--theme-separator', colors.separator);
    root.style.setProperty('--theme-input-bg', colors.inputBg);
    root.style.setProperty('--theme-glass-hover', colors.glassHover);
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextProps {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

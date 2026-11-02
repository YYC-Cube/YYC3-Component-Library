/**
 * @file themeStore.ts
 * @description 主题状态管理 — 极光主题变体、CSS 变量系统、亮/暗模式、持久化
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, theme, aurora, dark-mode, css-variables, persistence
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */
export type ThemeVariant = "aurora" | "deepspace" | "midnight" | "sunrise";
export type ThemeMode = "dark" | "light";
export type AccentColor = "green" | "cyan" | "purple" | "amber" | "rose";

export interface ThemeColors {
  /** 主要强调色 */
  accent: string;
  /** 次要强调色 */
  accentSecondary: string;
  /** 背景色 */
  bg: string;
  /** 面板背景 */
  panelBg: string;
  /** 表面色 */
  surface: string;
  /** 边框色 */
  border: string;
  /** 文本主色 */
  text: string;
  /** 文本弱色 */
  textMuted: string;
  /** 成功色 */
  success: string;
  /** 警告色 */
  warning: string;
  /** 错误色 */
  error: string;
  /** 极光渐变 1 */
  auroraGlow1: string;
  /** 极光渐变 2 */
  auroraGlow2: string;
  /** 极光渐变 3 */
  auroraGlow3: string;
}

export interface ThemeConfig {
  variant: ThemeVariant;
  mode: ThemeMode;
  accentColor: AccentColor;
  fontSize: number;
  uiScale: number;
  glassOpacity: number;
  animationSpeed: number;
  blurStrength: number;
  borderRadius: number;
}

/* ─── 主题变体定义 ─── */
export const themeVariants: Record<ThemeVariant, { name: string; description: string; colors: ThemeColors }> = {
  aurora: {
    name: "极光 Aurora",
    description: "经典极光主题，翠绿与青蓝交织",
    colors: {
      accent: "#00ff87",
      accentSecondary: "#60efff",
      bg: "#0a0a12",
      panelBg: "#14142a",
      surface: "rgba(255,255,255,0.03)",
      border: "rgba(255,255,255,0.08)",
      text: "rgba(255,255,255,0.9)",
      textMuted: "rgba(255,255,255,0.4)",
      success: "#00ff87",
      warning: "#ffb86c",
      error: "#ff6b6b",
      auroraGlow1: "rgba(0,255,135,0.08)",
      auroraGlow2: "rgba(96,239,255,0.06)",
      auroraGlow3: "rgba(168,85,247,0.05)",
    },
  },
  deepspace: {
    name: "深空 DeepSpace",
    description: "深邃宇宙感，紫蓝渐变星云",
    colors: {
      accent: "#a855f7",
      accentSecondary: "#6366f1",
      bg: "#08081a",
      panelBg: "#0f0f2a",
      surface: "rgba(139,92,246,0.03)",
      border: "rgba(139,92,246,0.1)",
      text: "rgba(255,255,255,0.88)",
      textMuted: "rgba(255,255,255,0.35)",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
      auroraGlow1: "rgba(168,85,247,0.1)",
      auroraGlow2: "rgba(99,102,241,0.08)",
      auroraGlow3: "rgba(59,130,246,0.06)",
    },
  },
  midnight: {
    name: "午夜 Midnight",
    description: "极简冷色调，专注编码沉浸",
    colors: {
      accent: "#60efff",
      accentSecondary: "#38bdf8",
      bg: "#0b0f1a",
      panelBg: "#111827",
      surface: "rgba(96,239,255,0.02)",
      border: "rgba(96,239,255,0.08)",
      text: "rgba(255,255,255,0.85)",
      textMuted: "rgba(255,255,255,0.38)",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      auroraGlow1: "rgba(96,239,255,0.06)",
      auroraGlow2: "rgba(56,189,248,0.05)",
      auroraGlow3: "rgba(14,165,233,0.04)",
    },
  },
  sunrise: {
    name: "日出 Sunrise",
    description: "暖色晨曦渐变，温暖活力",
    colors: {
      accent: "#ffb86c",
      accentSecondary: "#ff6b9d",
      bg: "#0e0a14",
      panelBg: "#1a1425",
      surface: "rgba(255,184,108,0.03)",
      border: "rgba(255,184,108,0.1)",
      text: "rgba(255,255,255,0.9)",
      textMuted: "rgba(255,255,255,0.4)",
      success: "#4ade80",
      warning: "#fbbf24",
      error: "#fb7185",
      auroraGlow1: "rgba(255,184,108,0.08)",
      auroraGlow2: "rgba(255,107,157,0.06)",
      auroraGlow3: "rgba(251,146,60,0.05)",
    },
  },
};

export const accentPresets: Record<AccentColor, { name: string; color: string; secondary: string }> = {
  green: { name: "翠绿", color: "#00ff87", secondary: "#10b981" },
  cyan: { name: "青蓝", color: "#60efff", secondary: "#22d3ee" },
  purple: { name: "紫罗", color: "#a855f7", secondary: "#8b5cf6" },
  amber: { name: "琥珀", color: "#ffb86c", secondary: "#f59e0b" },
  rose: { name: "玫瑰", color: "#ff6b9d", secondary: "#f43f5e" },
};

/* ─── Store 接口 ─── */
interface ThemeStore {
  config: ThemeConfig;
  colors: ThemeColors;

  /* ─── 操作 ─── */
  setVariant: (variant: ThemeVariant) => void;
  setMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  setFontSize: (size: number) => void;
  setUiScale: (scale: number) => void;
  setGlassOpacity: (opacity: number) => void;
  setAnimationSpeed: (speed: number) => void;
  setBlurStrength: (strength: number) => void;
  setBorderRadius: (radius: number) => void;
  resetToDefault: () => void;
  applyTheme: () => void;
}

const defaultConfig: ThemeConfig = {
  variant: "aurora",
  mode: "dark",
  accentColor: "green",
  fontSize: 13,
  uiScale: 1,
  glassOpacity: 0.06,
  animationSpeed: 1,
  blurStrength: 80,
  borderRadius: 12,
};

/** 将主题 CSS 变量注入到 document.documentElement */
function applyCSSVariables(colors: ThemeColors, config: ThemeConfig) {
  const root = document.documentElement;
  root.style.setProperty("--yyc3-accent", colors.accent);
  root.style.setProperty("--yyc3-accent-secondary", colors.accentSecondary);
  root.style.setProperty("--yyc3-bg", colors.bg);
  root.style.setProperty("--yyc3-panel-bg", colors.panelBg);
  root.style.setProperty("--yyc3-surface", colors.surface);
  root.style.setProperty("--yyc3-border", colors.border);
  root.style.setProperty("--yyc3-text", colors.text);
  root.style.setProperty("--yyc3-text-muted", colors.textMuted);
  root.style.setProperty("--yyc3-success", colors.success);
  root.style.setProperty("--yyc3-warning", colors.warning);
  root.style.setProperty("--yyc3-error", colors.error);
  root.style.setProperty("--yyc3-glow1", colors.auroraGlow1);
  root.style.setProperty("--yyc3-glow2", colors.auroraGlow2);
  root.style.setProperty("--yyc3-glow3", colors.auroraGlow3);
  root.style.setProperty("--yyc3-font-size", `${config.fontSize}px`);
  root.style.setProperty("--yyc3-ui-scale", `${config.uiScale}`);
  root.style.setProperty("--yyc3-glass-opacity", `${config.glassOpacity}`);
  root.style.setProperty("--yyc3-animation-speed", `${config.animationSpeed}`);
  root.style.setProperty("--yyc3-blur", `${config.blurStrength}px`);
  root.style.setProperty("--yyc3-radius", `${config.borderRadius}px`);
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      colors: themeVariants.aurora.colors,

      setVariant: (variant) => {
        const colors = themeVariants[variant].colors;
        set({ config: { ...get().config, variant }, colors });
        applyCSSVariables(colors, { ...get().config, variant });
      },

      setMode: (mode) => {
        set({ config: { ...get().config, mode } });
      },

      setAccentColor: (accentColor) => {
        const preset = accentPresets[accentColor];
        const colors = { ...get().colors, accent: preset.color, accentSecondary: preset.secondary };
        set({ config: { ...get().config, accentColor }, colors });
        applyCSSVariables(colors, { ...get().config, accentColor });
      },

      setFontSize: (fontSize) => {
        set({ config: { ...get().config, fontSize } });
        applyCSSVariables(get().colors, { ...get().config, fontSize });
      },

      setUiScale: (uiScale) => {
        set({ config: { ...get().config, uiScale } });
        applyCSSVariables(get().colors, { ...get().config, uiScale });
      },

      setGlassOpacity: (glassOpacity) => {
        set({ config: { ...get().config, glassOpacity } });
        applyCSSVariables(get().colors, { ...get().config, glassOpacity });
      },

      setAnimationSpeed: (animationSpeed) => {
        set({ config: { ...get().config, animationSpeed } });
        applyCSSVariables(get().colors, { ...get().config, animationSpeed });
      },

      setBlurStrength: (blurStrength) => {
        set({ config: { ...get().config, blurStrength } });
        applyCSSVariables(get().colors, { ...get().config, blurStrength });
      },

      setBorderRadius: (borderRadius) => {
        set({ config: { ...get().config, borderRadius } });
        applyCSSVariables(get().colors, { ...get().config, borderRadius });
      },

      resetToDefault: () => {
        const colors = themeVariants.aurora.colors;
        set({ config: defaultConfig, colors });
        applyCSSVariables(colors, defaultConfig);
      },

      applyTheme: () => {
        applyCSSVariables(get().colors, get().config);
      },
    }),
    {
      name: "yyc3-theme",
      partialize: (state) => ({ config: state.config, colors: state.colors }),
    }
  )
);

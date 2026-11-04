// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// @yyc3/theme 桶文件 — Phase 3 起：Claw 设计令牌真身（双主题）
// 源（S1）：personal 副本 YYC3-UI-用户界面/Button/components/yyc3/theme-tokens.ts
import './index.css'

export const THEME_PLACEHOLDER = true

// ── Claw 设计令牌（Phase 3 · S1 迁入，真身）──
export type {
  YYC3Theme,
  BaseComponentProps,
  ThemeProps,
  SizeProps,
  StatusProps,
  ThemeVariables,
  Breakpoint,
} from './claw-tokens'
export {
  breakpoints,
  mq,
  getThemeTokens,
  injectThemeCSSVars,
  cx,
  mergeStyles,
  isCyberpunk,
} from './claw-tokens'

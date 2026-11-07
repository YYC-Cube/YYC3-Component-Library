// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// 万象归元于云枢 | 深栈智启新纪元
// All things converge in cloud pivot; Deep stacks ignite a new era of intelligence
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// A3 移交（正仓会话① · 2026-11-07）：88 区 yyc3-shared-packages theme-provider 并入
// 源（D0 权威副本）：/Volumes/Development/YYC3-88/yyc3-shared-packages/packages/theme/src/theme-provider.tsx
// 语义：next-themes 官方推荐薄壳 Provider（家族 16 项目逐字节一致的多数派规范件）
// ============================================================

'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

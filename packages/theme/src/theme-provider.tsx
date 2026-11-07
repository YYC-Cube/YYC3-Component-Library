/**
 * file: theme-provider.tsx
 * description: 工作区多数派规范件 · 覆盖 16 个项目逐字节一致
 * author: YYC3 Team
 * version: v0.1.0
 * created: 2026-11-07
 * updated: 2026-11-07
 * status: active
 * tags: [theme],[shared],[component]
 *
 * copyright: YanYuCloudCube(TM)（YYC3）
 * notes: 由工作区多数派规范件提取生成（经 Mimosa 扫描脚本执行）
 */

'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

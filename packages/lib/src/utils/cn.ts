// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// 万象归元于云枢 | 深栈智启新纪元
// All things converge in cloud pivot; Deep stacks ignite a new era of intelligence
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// A3 移交（正仓会话① · 2026-11-07）：88 区 yyc3-shared-packages utils(cn) 并入
// 源（D0 权威副本）：/Volumes/Development/YYC3-88/yyc3-shared-packages/packages/utils/src/utils.ts
// 语义：shadcn 惯例 className 合并器（clsx + tailwind-merge），即家族多数派 cn 规范件
// 注：@yyc3/lib 唯二运行时依赖（clsx / tailwind-merge）随本件引入，其余工具仍零依赖
// ============================================================

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

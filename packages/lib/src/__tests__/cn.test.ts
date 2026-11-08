// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// 万象归元于云枢 | 深栈智启新纪元
// All things converge in cloud pivot; Deep stacks ignite a new era of intelligence
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// A3 移交批次（2026-11-07）：cn（clsx + tailwind-merge）并入冒烟测试
// ============================================================

import { describe, expect, it } from 'vitest'

import { cn } from '../utils/cn'

describe('cn（A3 移交 · 88 区 utils 规范件）', () => {
  it('拼接 truthy 类名并忽略 falsy', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c')
  })

  it('条件对象写法', () => {
    expect(cn({ x: true, y: false }, 'z')).toBe('x z')
  })

  it('tailwind 冲突类后者胜出', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('空入参返回空串', () => {
    expect(cn()).toBe('')
  })
})

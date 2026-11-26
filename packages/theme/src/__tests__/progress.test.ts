// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/theme progress 补测
// getProgressColor 全状态/全进度档分支 + cardSurfaces 表面映射
// ============================================================
import { describe, it, expect } from 'vitest'
import { getProgressColor, cardSurfaces } from '../progress'

const GRAD = {
  emerald: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
  red: 'bg-gradient-to-r from-red-400 to-red-500',
  amber: 'bg-gradient-to-r from-amber-400 to-amber-500',
  sky: 'bg-gradient-to-r from-sky-400 to-sky-500',
} as const

describe('getProgressColor · status 显式分支（9 态逐一）', () => {
  const cases: Array<[string, string]> = [
    ['completed', GRAD.emerald],
    ['cancelled', GRAD.red],
    ['critical', GRAD.red],
    ['warning', GRAD.amber],
    ['excellent', GRAD.emerald],
    ['good', GRAD.sky],
    ['at-risk', GRAD.amber],
    ['off-track', GRAD.red],
    ['on-track', GRAD.emerald],
  ]

  it.each(cases)('status=%s → %s', (status, expected) => {
    // status 优先于 progress 数值：低进度也按 status 着色
    expect(getProgressColor(0, status)).toBe(expected)
    expect(getProgressColor(100, status)).toBe(expected)
  })

  it('status 命中后不再落入 progress 数值档', () => {
    // progress=0 本应落红档，但 status=completed 覆盖为 emerald
    expect(getProgressColor(0, 'completed')).toBe(GRAD.emerald)
    // progress=100 本应落 emerald 档，但 status=cancelled 覆盖为 red
    expect(getProgressColor(100, 'cancelled')).toBe(GRAD.red)
  })
})

describe('getProgressColor · progress 数值档（无 status）', () => {
  it('progress ≥ 90 → emerald（含边界 90/100/95）', () => {
    expect(getProgressColor(90)).toBe(GRAD.emerald)
    expect(getProgressColor(100)).toBe(GRAD.emerald)
    expect(getProgressColor(95)).toBe(GRAD.emerald)
  })

  it('70 ≤ progress < 90 → sky（含边界 70 与 89）', () => {
    expect(getProgressColor(70)).toBe(GRAD.sky)
    expect(getProgressColor(89)).toBe(GRAD.sky)
    expect(getProgressColor(85)).toBe(GRAD.sky)
  })

  it('50 ≤ progress < 70 → amber（含边界 50 与 69）', () => {
    expect(getProgressColor(50)).toBe(GRAD.amber)
    expect(getProgressColor(69)).toBe(GRAD.amber)
    expect(getProgressColor(60)).toBe(GRAD.amber)
  })

  it('progress < 50 → red（含边界 49/0/负值）', () => {
    expect(getProgressColor(49)).toBe(GRAD.red)
    expect(getProgressColor(0)).toBe(GRAD.red)
    expect(getProgressColor(-1)).toBe(GRAD.red)
  })

  it('显式 undefined status 走数值档', () => {
    expect(getProgressColor(92, undefined)).toBe(GRAD.emerald)
    expect(getProgressColor(30, undefined)).toBe(GRAD.red)
  })
})

describe('cardSurfaces · 卡片表面样式映射', () => {
  it('三张表面（base/header/enhanced）均为非空字符串', () => {
    expect(typeof cardSurfaces.base).toBe('string')
    expect(typeof cardSurfaces.header).toBe('string')
    expect(typeof cardSurfaces.enhanced).toBe('string')
    expect(cardSurfaces.base.length).toBeGreaterThan(0)
    expect(cardSurfaces.header.length).toBeGreaterThan(0)
    expect(cardSurfaces.enhanced.length).toBeGreaterThan(0)
  })

  it('header 含内边距与底边线（notes 中的 undefined 空引用修正位）', () => {
    expect(cardSurfaces.header).toContain('p-6')
    expect(cardSurfaces.header).toContain('border-b')
  })

  it('base/enhanced 含玻璃拟态与过渡', () => {
    expect(cardSurfaces.base).toContain('backdrop-blur')
    expect(cardSurfaces.base).toContain('transition-all')
    expect(cardSurfaces.enhanced).toContain('backdrop-blur')
    expect(cardSurfaces.enhanced).toContain('hover:shadow-lg')
  })
})

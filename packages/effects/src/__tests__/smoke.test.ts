// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/effects 冒烟测试
// Phase 1 固化：通道级冒烟（barrel 可导入）
// 注：空壳包占位（Phase 7 裁决去留）
// ============================================================
import { describe, it, expect } from 'vitest'
import * as pkg from '../index'

describe('@yyc3/effects 冒烟', () => {
  it('桶文件应可导入', () => {
    expect(pkg).toBeTruthy()
  })

  it('占位导出应存在', () => {
    expect(pkg.EFFECTS_PLACEHOLDER).toBe(true)
  })
})

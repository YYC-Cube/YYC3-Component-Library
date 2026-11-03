// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/theme 冒烟测试
// Phase 1 固化：通道级冒烟（barrel 可导入）
// ============================================================
import { describe, it, expect } from 'vitest'
import * as pkg from '../index'

describe('@yyc3/theme 冒烟', () => {
  it('桶文件应可导入', () => {
    expect(pkg).toBeTruthy()
  })

  it('占位导出应存在', () => {
    expect(pkg.THEME_PLACEHOLDER).toBe(true)
  })
})

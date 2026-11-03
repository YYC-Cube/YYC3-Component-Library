// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/ui 冒烟测试
// Phase 1 固化：通道级冒烟（barrel 可导入 + 关键导出存在）
// ============================================================
import { describe, it, expect } from 'vitest'
import * as pkg from '../index'

describe('@yyc3/ui 冒烟', () => {
  it('桶文件应可导入', () => {
    expect(pkg).toBeTruthy()
  })

  it('关键基础组件应存在（Button/Card/Input）', () => {
    expect(pkg.Button).toBeDefined()
    expect(pkg.Card).toBeDefined()
    expect(pkg.Input).toBeDefined()
  })

  it('工具函数 cn 应存在', () => {
    expect(pkg.cn).toBeDefined()
  })
})

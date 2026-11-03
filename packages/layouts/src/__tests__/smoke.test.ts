// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/layouts 冒烟测试
// Phase 1 固化：通道级冒烟（barrel 可导入）
// 注：5 个布局组件待 Phase 3/4 适配后恢复导出（技术债见桶文件头）
// ============================================================
import { describe, it, expect } from 'vitest'
import * as pkg from '../index'

describe('@yyc3/layouts 冒烟', () => {
  it('桶文件应可导入', () => {
    expect(pkg).toBeTruthy()
  })

  it('占位导出应存在', () => {
    expect(pkg.LAYOUTS_PLACEHOLDER).toBe(true)
  })
})

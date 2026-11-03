// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/medical 冒烟测试
// Phase 1 固化：通道级冒烟（barrel 可导入）
// 注：域桶当前为占位空桶（技术债见 MIGRATION_PLAN v2.1），组件随滚动抽取批次补齐
// ============================================================
import { describe, it, expect } from 'vitest'
import * as pkg from '../index'

describe('@yyc3/medical 冒烟', () => {
  it('桶文件应可导入', () => {
    expect(pkg).toBeTruthy()
  })
})

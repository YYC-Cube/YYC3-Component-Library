// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// vitest unit 工程全局 setup（Phase 1 固化）
import '@testing-library/jest-dom/vitest'
// 8 债清零批（2026-11-07）：RTL 自动 cleanup——globals 未开导致多 render 测试树残留
// （education virtualized-message-list「Found multiple elements」根因）
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

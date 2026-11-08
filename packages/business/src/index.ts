// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// @yyc3/business 桶文件 — Phase 1 占位 → J4 adapters 落地（2026-11-07）
// owner 裁决 2026-11-07：retail/manufacturing 域模块并入本包（取消自建 @yyc3/adapters）
// ============================================================

// 占位标记（空壳包修复期产物，是否有下游引用待 Phase 7 复核，保留一个发布周期）
export const BUSINESS_PLACEHOLDER = true

// ── 行业适配（J4 · 2026-11-07，源：99 区 industry-adapter D0 副本）──
export { RETAIL_INDUSTRY_CONFIGS } from './adapters/retail'
export { MANUFACTURING_INDUSTRY_CONFIGS } from './adapters/manufacturing'

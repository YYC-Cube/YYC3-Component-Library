// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// @yyc3/layouts 占位桶文件 — Phase 1 固化处置（MIGRATION_PLAN v2.1）
//
// 【技术债登记】src/ 下 5 个布局组件（sidebar/main-nav/mobile-nav/
// global-navigation/top-nav）搬运时未做包内适配，仍引用 app 侧别名：
//   @/lib/utils、@/hooks/use-mobile、@/components/ui/*、@/components/brand/*、@/config/navigation
// 待 Phase 3（Claw UI 入 ui 包）与 Phase 4（shadcn 去重）完成后统一适配并恢复导出。
// 适配前本包保持空导出，type-check 对上述 5 文件的报错为已知债（见 Phase 1 PR 说明）。
export const LAYOUTS_PLACEHOLDER = true

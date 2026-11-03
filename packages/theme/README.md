# @yyc3/theme

> YYC³ 主题系统 — 全局样式与设计令牌 · Phase 1 固化（2026-11-04）

## 状态

- src 资产：`index.css`（全局样式）+ 占位桶（`THEME_PLACEHOLDER`）
- 构建：✅（Phase 1 补占位桶后纳入全量构建）
- 测试：✅ 冒烟

## 来源

现有 index.css 为早期脚手架资产；**theme-tokens（赛博朋克/液态玻璃双主题，7,735 行 Claw UI 的一部分）于 Phase 3 迁入**（MIGRATION_PLAN v2.1 S1：`Button/components/yyc3/theme-tokens.ts`）。

## 技术债

双主题体系落地前，本包仅承载全局样式；见 `src/index.ts` 头注。

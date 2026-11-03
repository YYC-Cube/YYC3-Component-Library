# @yyc3/medical

> YYC³ 医疗健康域组件库（存量域）· Phase 1 固化（2026-11-04）

## 状态

- src 文件：120 · 构建：✅（dts）· 测试：✅ 冒烟（Phase 1 首建）
- 导出面：**占位空桶**（index.ts 为注释占位——技术债见 MIGRATION_PLAN v2.1 §1.1）

## 来源

主库 UI 池（yyc3-medical ×5 副本、yyc3-medinexus、AI-Medical 等，权威副本待 Phase 2 映射表甄别）。

## 技术债

src 内组件未建 barrel（`@/components` 等别名断链休眠中）——随滚动抽取批次逐组件过 D0/SOP 后恢复导出。

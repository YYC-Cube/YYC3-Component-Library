# @yyc3/ai

> YYC³ AI 智能域组件库 — 智能体/编辑器/预览/多 Claude 协作 · Phase 1 固化（2026-11-04）

## 状态

- src 文件：1,512（本库最大域包；stores 19 个 + app/组件/多子项目）
- 构建：✅ tsup（dts 开启）· 依赖：zustand（Phase 1 补声明）
- 测试：19 个文件（**最大测试域**；基线：多数通过，store API 版本失配债见下）

## 来源

主库 UI 池（特征文件溯源：DelibixAcademyPage ← AI-Digital-Consulting-Website；multi-claude ← intelligent-collaboration-contract；ClaudeSidebar ← UI-7/UI-9 多项目，评估报告 §4.1）。

## 技术债

1. `../../types/user`、`@yyc3/lib`、`@yyc3/hooks` 等跨包断链（搬运未适配）；
2. store 测试与重构后 API 失配（themeStore 已修，preview/notification/sidebar/editorPreviewSync 待滚动批次对齐）；
3. `@/` 别名由根 vitest 插件按包解析（`vitest.config.ts`）。

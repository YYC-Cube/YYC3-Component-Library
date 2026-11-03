# @yyc3/layouts

> YYC³ 布局组件库 — 导航/侧栏/页脚布局 · Phase 1 固化（2026-11-04）

## 状态

- src 文件：5 个布局组件（sidebar / main-nav / mobile-nav / global-navigation / top-nav）+ 占位桶
- 构建：✅（桶收敛为占位，见技术债）
- 测试：✅ 冒烟

## 来源

主库 UI 池「双导管理」等管理端项目（特征文件溯源见评估报告 §4.1）。

## 技术债（重要）

5 个组件搬运时未做包内适配，仍引用 app 侧别名（`@/lib/utils`、`@/components/ui/*`、`@/config/navigation`），**当前无有效导出**。待 Phase 3（Claw UI 入 ui）+ Phase 4（shadcn 去重）后统一适配恢复导出——详见 `src/index.ts` 头注【技术债登记】。

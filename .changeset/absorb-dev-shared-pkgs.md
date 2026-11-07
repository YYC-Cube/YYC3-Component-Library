---
'@yyc3/ui': minor
'@yyc3/lib': minor
'@yyc3/theme': minor
---

A3 移交（正仓会话①）：88 区 yyc3-shared-packages 资产并入正仓。

- **@yyc3/ui**：净移入 88 区独有件 `loading.tsx`（家族 13 项目多数派占位件，named + default 双导出）；桶补导出 `useIsMobile`（use-mobile 为批次 A 存量新版件，此前未挂桶）。toast / toaster / use-toast / use-mobile 经整树 SHA-256 复核为批次 A 已收编（88 区同名件仅引号/import 路径/标头差异，零功能增量，按 A3 裁决"CL 覆盖即达标"保留 CL 新版不回退）。
- **@yyc3/lib**：并入 88 区 `utils(cn)` 规范件（`cn` 自 utils/cn.ts 导出，clsx + tailwind-merge 为仅二运行时依赖，其余工具保持零依赖）；消费方迁移指引 `@yyc3/utils` → `@yyc3/lib` 自此成立。
- **@yyc3/theme**：并入 88 区 `theme-provider.tsx`（next-themes 薄壳 Provider，16 项目多数派件），`next-themes` 外置依赖，react peer 声明补齐。

验证：pnpm build / type-check / vitest 全绿；Loading / Toast / Toaster / UseMobile storybook 可渲染。

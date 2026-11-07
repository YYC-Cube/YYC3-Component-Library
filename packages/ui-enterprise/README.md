# @yyc3/ui-enterprise

> YYC³ 基础 UI 组件库 — shadcn/ui 风格企业级组件集合 · Phase 1 固化（2026-11-04）

## 更名说明（A2 双线分工终裁 · 2026-11-07）

- 本包自 `@yyc3/ui` 更名 **`@yyc3/ui-enterprise`**（企业通用 Radix 线）；`@yyc3/ui` 名义归
  FAmily-Pai base-ui 线（AI Family 专线，3.0.0-alpha）。依据《YYC3-正仓对接-执行报告-A1-A4》A2。
- npm 旧版本废弃指引：`scripts/deprecate-legacy-ui.sh`（owner 执行，DEMO=1 dry-run 起步）。
- 包目录同步更名 `packages/ui` → `packages/ui-enterprise`（目录名 = 包短名惯例）。

## 状态

- src 文件：66（shadcn 全家桶 + 定制件 3d-button/medical-*/dynamic-loading 等）
- 构建：✅ tsup（CJS+ESM+**DTS 55KB**，本库唯一全量真实导出的包）
- 测试：✅ 冒烟（`src/__tests__/smoke.test.ts`，断言 Button/Card/Input/cn）
- 导出面：`packages/ui-enterprise/src/index.ts` 全量 barrel（170+ 导出）
- exports：主入口 + `./*` 子路径（映射 src，供包内互引）

## 快速开始

```tsx
import { Button, Card, cn } from '@yyc3/ui-enterprise'
```

## 来源

知识库主库（`/Users/yanyu/YYC3-Knowledge-Base`）UI 池 shadcn 体系；Phase 4 将并入 personal 副本 shadcn 拷贝 56 tsx 去重（D1）、Phase 3 迁入 Claw UI（S1）。

## 技术债

见 `MIGRATION_PLAN.md` v2.1 §1.1 与《YYC3-组件库-迁移实况评估报告》G3。

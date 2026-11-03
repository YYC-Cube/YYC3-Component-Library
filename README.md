# YYC³ Component Library

> YYC³ 统一组件库 — 企业级 React 组件集合（pnpm + Turborepo Monorepo）
> 进度事实源：[MIGRATION_PLAN.md](./MIGRATION_PLAN.md)（v2.1）· 执行规程：[执行衔接手册](./docs/YYC3-项目组件-拆分规范/YYC3-组件拆分-执行衔接手册.md)

## 快速开始

```bash
pnpm install   # 安装依赖
pnpm build     # 全量构建（turbo，Phase 1 起 ✅ 全绿）
pnpm test      # 单元测试（vitest jsdom，Phase 1 接通；基线 351✅/41❌ 债入档）
pnpm lint      # 代码检查
pnpm storybook # 组件目录（6006 端口）
```

## 包结构（15 域 · Phase 1 实况 2026-11-04）

| 包名 | src | 构建 | 测试 | 导出面 |
|------|-----|------|------|--------|
| `@yyc3/ui` | 66 | ✅ +DTS | ✅ 冒烟 | **全量真实导出**（170+） |
| `@yyc3/ai` | 1,512 | ✅ | 19 文件（部分 API 失配债） | 占位桶 |
| `@yyc3/music` | 417 | ✅ | 2 文件 | **4 组件收敛导出** |
| `@yyc3/admin` | 279 | ✅ | 3 文件（断链债） | 占位桶 |
| `@yyc3/medical` | 120 | ✅ | ✅ 冒烟 | 占位桶 |
| `@yyc3/design` | 67 | ✅ | ✅ 冒烟 | 占位桶 |
| `@yyc3/education` | 62 | ✅ | 4 文件（部分债） | 占位桶 |
| `@yyc3/financial` | 32 | ✅ | ✅ 冒烟 | 占位桶 |
| `@yyc3/cloud` | 27 | ✅ | ✅ 冒烟 | 占位桶 |
| `@yyc3/city` | 19 | ✅ | ✅ 冒烟 | 占位桶 |
| `@yyc3/layouts` | 6 | ✅ | ✅ 冒烟 | 占位桶（5 组件待适配） |
| `@yyc3/theme` | 2 | ✅ | ✅ 冒烟 | 占位桶（待 Claw UI 双主题） |
| `@yyc3/business` | 1 | ✅ | ✅ 冒烟 | 空壳占位（Phase 7 裁决） |
| `@yyc3/effects` | 1 | ✅ | ✅ 冒烟 | 空壳占位（Phase 7 裁决） |
| `@yyc3/icons` | — | — | — | 空目录（无 package.json，Phase 7 裁决） |

> 「占位桶」= src 内组件因搬运断链（`@/` 别名/未建 barrel）暂不导出，随滚动抽取批次恢复——详见各包 README 与 [迁移实况评估报告](./docs/YYC3-项目组件-拆分规范/YYC3-组件库-迁移实况评估报告.md)。

## 技术栈

React 19 · TypeScript 5.9 · Tailwind CSS 4 · Radix UI · Vitest 4 · Storybook 10 · pnpm Workspace · Turborepo · changesets

## 开发指南

- **新组件**：`packages/<域>/src/` 创建 → 桶导出 → `pnpm build && pnpm test` → 分支 + PR（main 受保护，禁直推）
- **规范**：一切执行遵循[执行衔接手册](./docs/YYC3-项目组件-拆分规范/YYC3-组件拆分-执行衔接手册.md)十步规程；文档遵循 [标头标尾 v1.1.0](./docs/YYC3-团队通用-标规文档/YYC3-团队通用-标头标尾.md)

## 许可

内部使用，非商用。

<p align="center">
  <img src="public/yyc3-family.png" alt="YYC³ Family" width="720">
</p>

<h1 align="center">YYC³ Component Library</h1>

<p align="center">
  <img src="https://img.shields.io/badge/YYC3-Family-00d4ff?style=flat-square" alt="YYC3 Family">
  <img src="https://img.shields.io/github/license/YYC-Cube/YYC3-Component-Library?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/last-commit/YYC-Cube/YYC3-Component-Library?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/github/languages/top/YYC-Cube/YYC3-Component-Library?style=flat-square" alt="Language">
  <img src="https://img.shields.io/badge/status-active-brightgreen?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/pnpm-workspace-F69220?style=flat-square&logo=pnpm" alt="pnpm">
  <img src="https://img.shields.io/badge/Turborepo-monorepo-00b181?style=flat-square" alt="Turborepo">
  <img src="https://img.shields.io/badge/Storybook-10-FF4785?style=flat-square&logo=storybook" alt="Storybook 10">
  <img src="https://img.shields.io/badge/tests-364%20passing-2d5a3d?style=flat-square" alt="Tests">
</p>

> **YYC³ 统一组件库 — 企业级 React 组件集合** · pnpm + Turborepo Monorepo · 双源迁移（知识库主库按需抽取 + 精准素材）· 15 业务域分包

**言启象限 | 语枢未来** · *Words Initiate Quadrants, Language Serves as Core for Future*

## ✨ 特性

- 🧩 **15 域分包**：`@yyc3/ui` 全量基础件（shadcn 体系 + 定制件）+ 14 个业务/职能域包
- 🏛️ **规范驱动**：拆分原则、独立单元判定、权威副本甄别、十步执行规程全套自研方法论（见 `docs/`）
- 🧪 **质量门**：Vitest 4 + RTL + jsdom 单元通道；P0 场景矩阵（CS-001~010）与分级放行
- 📖 **组件目录**：Storybook 10 十域 stories + autodocs
- 🔐 **治理**：main 分支保护、changesets 版本管线、Mimosa 深度安全扫描与发布前清零硬门

## 📦 包结构（15 域 · 实况 2026-11-04）

| 包名 | src | 构建 | 测试 | 导出面 |
|------|-----|------|------|--------|
| [`@yyc3/ui`](./packages/ui) | 66 | ✅ +DTS | ✅ 冒烟 | **全量真实导出**（170+，含 `cn`） |
| [`@yyc3/ai`](./packages/ai) | 1,512 | ✅ | 19 文件 | 占位桶（断链随批次恢复） |
| [`@yyc3/music`](./packages/music) | 417 | ✅ | 2 文件 | **4 组件收敛导出** |
| [`@yyc3/admin`](./packages/admin) | 279 | ✅ | 3 文件 | 占位桶（lib/design-system 已随迁） |
| [`@yyc3/medical`](./packages/medical) | 120 | ✅ | ✅ 冒烟 | 占位桶 |
| [`@yyc3/design`](./packages/design) | 67 | ✅ | ✅ 冒烟 | 占位桶（UI-8 设计系统并入中） |
| [`@yyc3/education`](./packages/education) | 62 | ✅ | 4 文件 | 占位桶 |
| [`@yyc3/financial`](./packages/financial) | 32 | ✅ | ✅ 冒烟 | 占位桶 |
| [`@yyc3/cloud`](./packages/cloud) | 27 | ✅ | ✅ 冒烟 | 占位桶 |
| [`@yyc3/city`](./packages/city) | 19 | ✅ | ✅ 冒烟 | 占位桶 |
| [`@yyc3/layouts`](./packages/layouts) | 6 | ✅ | ✅ 冒烟 | 占位桶（5 组件待适配） |
| [`@yyc3/theme`](./packages/theme) | 2 | ✅ | ✅ 冒烟 | 占位桶（待 Claw UI 双主题） |
| [`@yyc3/business`](./packages/business) | 1 | ✅ | ✅ 冒烟 | 空壳占位（Phase 7 裁决） |
| [`@yyc3/effects`](./packages/effects) | 1 | ✅ | ✅ 冒烟 | 空壳占位（Phase 7 裁决） |
| `@yyc3/icons` | — | — | — | 空槽位（Phase 7 裁决：建/删/占位） |

> 「占位桶」= src 内组件因搬运断链暂不导出，随[滚动抽取批次](./docs/YYC3-项目组件-拆分规范/YYC3-权威副本-映射表.md)恢复——各包 README 有来源溯源与技术债登记。

## 🚀 快速开始

```bash
git clone git@github.com:YYC-Cube/YYC3-Component-Library.git
cd YYC3-Component-Library
pnpm install
pnpm build     # 全量构建（turbo，全绿）
pnpm test      # 单元测试（vitest jsdom）
pnpm storybook # 组件目录 → http://localhost:6006
```

组件使用：

```tsx
import { Button, Card, cn } from '@yyc3/ui'
```

## 🗺️ 可视化导览

- **交互式组件地图**：[docs/YYC3-组件库-可视化导览.html](./docs/YYC3-组件库-可视化导览.html)（15 域 × 状态 × 迁移源，浏览器直接打开）
- **推进流程图**：[YYC3-组件拆分-推进流程图](./docs/YYC3-项目组件-拆分规范/YYC3-组件拆分-推进流程图.md)（Mermaid 总览 + 决策门 + 状态表）
- **权威副本映射表**：[YYC3-权威副本-映射表](./docs/YYC3-项目组件-拆分规范/YYC3-权威副本-映射表.md)（482 行，抽取强制输入）

## 📚 文档

| 文档 | 说明 |
|---|---|
| [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) | 迁移总计划 v2.1.3（进度唯一事实源 + 测试债登记簿） |
| [迁移实况评估报告](./docs/YYC3-项目组件-拆分规范/YYC3-组件库-迁移实况评估报告.md) | 双副本定性 / 十池画像 / 419 多副本热点 |
| [执行衔接手册](./docs/YYC3-项目组件-拆分规范/YYC3-组件拆分-执行衔接手册.md) | 规范对齐总矩阵 + 十步规程 + 放行标准 |
| [团队标准规范 SSOT](https://github.com/YYC-Cube/YYC3-Knowledge-Base) | 家族统一规范（勿在仓内自备副本） |
| [标头标尾规范 v1.1.0](./docs/YYC3-团队通用-标规文档/YYC3-团队通用-标头标尾.md) | 本仓文档强制格式 |

## 🤝 社区

[贡献指南](CONTRIBUTING.md) · [行为准则](CODE_OF_CONDUCT.md) · [安全政策](SECURITY.md) — 欢迎以 PR 参与（main 受保护，一切变更经审查）。

## 📄 许可证

[MIT](LICENSE) © 2026 YanYuCloudCube Team

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

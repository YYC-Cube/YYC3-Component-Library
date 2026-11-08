---
file: README.md
title: YYC3-Component-Library — 企业组件库正仓（CL）
description: CL 正仓 README：18 域包 + ui 81 模块 barrel 与晋升记录
author: YYC³ Team <admin@0379.email>
version: v1.1.0
created: 2026-11-09
updated: 2026-11-09
status: stable
tags: [readme, architecture, monorepo]
category: technical
language: zh-CN
audience: developers,managers
complexity: intermediate
---

# YYC3-Component-Library — 企业组件库正仓（CL）

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

## 🧭 定位

正仓层·企业组件库：Radix 线 @yyc3/ui（npm 2.0.2）+ 18 域包 + storybook；开发区 v0 大军的共享供给源。

## 🌳 文件树架构

```text
├── .changeset/  (15)
│   ├── absorb-dev-shared-pkgs.md
│   ├── adapters-domain-extract.md
│   ├── cloud-extract.md
│   ├── config.json
│   ├── dangling-clearout.md
│   ├── design-auth-closeout.md
│   ├── design-extract.md
│   ├── financial-extract.md
│   ├── lib-services-real.md
│   ├── lib-services-stub.md
│   ├── medical-t0t1.md
│   ├── medical-t2t3.md
│   ├── shadcn-upgrade-a.md
│   ├── shadcn-upgrade-b.md
│   └── test-debt-clearout.md
├── .github/  (1)
│   └── workflows/  (1)
├── .storybook/  (2)
│   ├── main.ts
│   └── preview.tsx
├── .zcode/  (1)
│   └── plans/  (1)
├── apps/  (3)
│   ├── admin/  (0)
│   ├── playground/  (6)
│   └── storybook/  (6)
├── docs/  (10)
│   ├── YYC3-会话文档/  (3)
│   ├── YYC3-团队通用-开发指南/  (9)
│   ├── YYC3-团队通用-标规文档/  (8)
│   ├── YYC3-集成发包-艺术字体/  (19)
│   ├── YYC3-项目拆分-复用架构/  (12)
│   ├── YYC3-项目组件-拆分规范/  (21)
│   ├── YYC3-项目验收-闭环体系/  (21)
│   ├── YYC3-徽章与图标-可视化设计说明.md
│   ├── YYC3-组件库-可视化导览.html
│   └── YYC3-组件库-执行节点记录.md
├── lib/  (0)
├── packages/  (17)
│   ├── admin/  (10)
│   ├── ai/  (10)
│   ├── business/  (10)
│   ├── city/  (9)
│   ├── cloud/  (9)
│   ├── design/  (10)
│   ├── education/  (9)
│   ├── effects/  (9)
│   ├── financial/  (9)
│   ├── icons/  (8)
│   ├── layouts/  (9)
│   ├── lib/  (9)
│   ├── medical/  (10)
│   ├── music/  (9)
│   ├── theme/  (8)
│   ├── ui/  (10)
│   └── web-ui/  (8)
├── public/  (1)
│   └── yyc3-family.png
├── scripts/  (2)
│   ├── copy-matrix.py
│   └── extraction-filter.py
├── stories/  (11)
│   ├── admin/  (2)
│   ├── ai/  (2)
│   ├── assets/  (16)
│   ├── city/  (2)
│   ├── cloud/  (2)
│   ├── design/  (2)
│   ├── education/  (2)
│   ├── financial/  (2)
│   ├── medical/  (2)
│   ├── music/  (2)
│   └── ui/  (6)
├── templates/  (2)
│   ├── blueprints/  (0)
│   └── themes/  (0)
├── .gitignore
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── debug-storybook.log
├── LICENSE
├── MIGRATION_PLAN.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── SECURITY.md
├── tsconfig.base.json
├── turbo.json
└── vitest.config.ts
└── …（另有 3 项）
```

## 🧱 技术栈

packages 18 域包（ui@2.0.2 · lib@1.0.0 · theme@2.1.0 · business/education/financial/medical…）+ apps/storybook

## ✂️ 拆分与复用衔接建议

1. **已完成**：shadcn barrel 81 模块（/shadcn 出口）；4+3 共享件晋升（含 theme 对齐 progress.ts）；J4 adapters 四域包落地；S7 A3 并入确认
2. **拆分衔接**：晋升流程 = 多数派逐字节一致（≥2 副本）→ 依赖边界审查 → 分支晋升；barrel 随每批重生成
3. **复用**：消费方统一 `"@yyc3/ui-enterprise": "npm:@yyc3/ui@^2.0.2"` alias + `/shadcn` 导入；设计令牌经 `@yyc3/theme`
4. **watch**：main 领先远端（推送 403 待网络恢复重试）；27 硬编码凭据 findings 待专项复核（疑似测试夹具）

## 🔗 衔接文档

- merges: 1e0a0a5(barrel)/4b04f34(晋升)/c5f65d2(J4)/0332fa8(absorb恢复)/62b3a33(theme对齐) · Mimosa deep 封印 `e0c76e1e`

---

**维护**: YYC³ Team · 架构治理会话生成（2026-11-09），结构变更时同步更新。

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

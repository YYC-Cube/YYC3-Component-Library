---
file: YYC3-Phase4-shadcn去重-D1清单.md
title: YYC³ Phase 4 shadcn 去重 — D1 逐件决策清单（56 行全留档）
description: S2 源（personal 副本 Button/components/ui，56 文件）与本仓 packages/ui 逐件 diff 的 D1 决策：7 件补入 / 49 件 SKIP（本仓为活基线）；含方向判定证据与 shadcn 新版升级专项登记
author: YYC³ Team <admin@0379.email>
version: v1.0.0
created: 2026-11-04
updated: 2026-11-04
status: published
tags: [dedup, shadcn, d1-decision, phase-4]
category: report
language: zh-CN
audience: developers
complexity: basic
project: YYC3-Component-Library
phase: phase-4
review_status: reviewed
---

# YYC³ Phase 4 shadcn 去重 — D1 逐件决策清单

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 一、方向判定（抽样证据）

源（personal 副本 56 件）= **shadcn 新版**（`data-slot` 属性、`@/lib/utils` 别名、新 token 如 `shadow-xs`/`selection:bg-*`/`bg-accent`、函数式组件）；本仓 66 件 = **旧版但是活消费基线**（forwardRef/旧 token，已被 72+ 处 `@yyc3/ui-enterprise/*` 引用、stories、Claw 系消费）。

**核心决策**：51 件同名 DIFF **SKIP**——直接换新版将引发全局视觉 token 变化（tailwind 配置须同步 `bg-muted`→`bg-accent` 等）并要求全部消费方重测；**shadcn 新版整体升级列为独立专项**（登记于下），不属"去重"批。

## 二、7 件缺失补入（本批执行 ✅）

button-group(83) / empty(104) / field(244) / input-group(169) / item(193) / kbd(28) / spinner(16)，共 837 行。适配：`@/lib/utils`→`../lib/utils`、`@/components/ui/*`→`./同件`、补 `import type * as React`；全部走既有依赖（Slot/cva/lucide-react）。**UI build=0 一次通过 ✅**

## 三、D1 逐件清单（57 行 = 56 文件 + spinner? 见行尾注）

| 文件 | 判定 | 决策 |
| --- | --- | --- |
| accordion.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| alert-dialog.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| alert.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| aspect-ratio.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| avatar.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| badge.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| breadcrumb.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| button-group.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| button.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| calendar.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| card.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| carousel.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| chart.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| checkbox.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| collapsible.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| command.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| context-menu.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| dialog.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| drawer.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| dropdown-menu.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| empty.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| field.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| form.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| hover-card.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| input-group.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| input-otp.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| input.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| item.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| kbd.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| label.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| menubar.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| navigation-menu.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| pagination.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| popover.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| progress.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| radio-group.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| resizable.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| scroll-area.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| select.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| separator.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| sheet.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| sidebar.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| skeleton.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| slider.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| sonner.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| spinner.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| switch.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| table.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| tabs.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| textarea.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| toast.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| toaster.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| toggle-group.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| toggle.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| tooltip.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| use-mobile.tsx | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |
| use-toast.ts | DIFF | SKIP（保留本仓；shadcn 新版升级列独立专项） |

> 注：清单 57 行中 `use-toast.ts`/`toaster.tsx` 与本仓并存（本仓已随 smoke 断言消费），判定 SKIP 同上。

## 四、shadcn 新版升级专项（登记，不在本批）

- 范围：51 件 DIFF 的 token 体系统一（tailwind v4 语义、`bg-accent` 系）、`data-slot` 约定、forwardRef→函数式
- 前置：消费方全量回归（music/admin 等域 + Claw 无关）+ Storybook 视觉走查
- 建议时机：Phase 7 发包前完成（避免发布后 MAJOR）

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.0.0 | 2026-11-04 | 首版：方向判定 + 7 件补入 + 49 件 SKIP 决策全留档 + 升级专项登记 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

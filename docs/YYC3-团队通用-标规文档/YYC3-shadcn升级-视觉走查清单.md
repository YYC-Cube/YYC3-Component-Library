---
file: YYC3-shadcn升级-视觉走查清单.md
title: YYC³ shadcn 新版升级 — 视觉走查清单（发布前硬检查项）
description: shadcn 升级批次 A+B 后 654 消费文件的视觉回归走查清单——变更面/高危件/检查点/走查方式；绑定 apps/storybook 门户人工走查
author: YYC³ Team <admin@0379.email>
version: v1.0.0
created: 2026-11-07
updated: 2026-11-07
status: published
tags: [shadcn, upgrade, visual-regression, checklist, phase-7]
category: report
language: zh-CN
audience: developers
complexity: basic
project: YYC3-Component-Library
phase: phase-7
review_status: reviewed
---

# YYC³ shadcn 新版升级 — 视觉走查清单

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future_

---

## 一、变更面摘要（批次 A+B，2026-11-07）

shadcn 新版升级 53 件（批次 A 8 件 + 批次 B 45 件）+ theme 补 `--sidebar-*` 8×2 变量 + chart 兼容 shim（BarChart/LineChart recharts 转发）。**代码层 BUILD=0 · 671✅/0❌；视觉层待人工走查**——本清单为发布前硬检查项。

## 二、系统性视觉变化（全消费面生效）

| 变化 | 旧 → 新 | 走查要点 |
| --- | --- | --- |
| 控件默认高度 | Button/Input `h-10` → **`h-9`**（新增 `h-8`/`icon-sm`/`icon-lg` 档） | 工具栏/表单/卡片头内的按钮排布是否过挤；表单行高对齐 |
| 焦点环 | `focus-visible:ring-2` + `ring-offset-*` → **`ring-[3px]` + `border-ring ring-ring/50`**（无 offset） | 键盘 Tab 遍历：环是否清晰、与容器边距是否足够 |
| 阴影档位 | `shadow-sm` → **`shadow-xs`**（视觉变浅一档） | 卡片/浮层层次感是否尚可 |
| hover 底色 | `bg-muted` → **`bg-accent`**（同名变量本仓同值，理论零变化） | 抽查按钮 ghost/outline hover 即可 |
| 错误态 | 无 → **`aria-invalid:` 红色环+边**（10 文件） | 表单校验失败态：Input/Textarea/Select 传 aria-invalid 后是否正确显红 |
| 圆角 | 无 → **`rounded-xs`**（4 文件） | 小控件（badge/checkbox 类）圆角是否协调 |
| 文本选中 | 无 → **`selection:bg-primary`**（Input） | 输入框内选中文本配色 |
| 结构属性 | 无 → **`data-slot="*"`**（全部 45+ 文件） | 非视觉：CSS 选择器若依赖结构需排查（仓内暂无此用法） |
| 图标命名 | `X` → **`XIcon`**（lucide，同包别名） | 无视觉影响 |
| sidebar | 新增（含 `--sidebar-*` 8×2 变量） | 若消费：展开/收起态、浅深主题色板 |

## 三、高危消费件 Top 走查清单（按消费频次）

| 组件 | 消费次数 | 优先走查场景 |
| --- | --- | --- |
| Button | 525 | admin 头部操作区 / medical 表单提交区 / financial 双语 CTA |
| Card 族 | 458/453/413/413/305 | 六域 dashboard 卡片栅格（CardHeader 内嵌 Button 的对齐） |
| Badge | 402 | 状态徽标（secondary/outline 变体阴影变浅后辨识度） |
| Tabs | 316/315/315 | admin/medical 面板切换（Tab 触发器 focus 环） |
| Input/Textarea | 204/102 | 登录/搜索/表单（h-9 高度 + aria-invalid 错误态） |
| Select | 203 | 筛选器（触发器高度 + 下拉 item hover bg-accent） |
| Dialog/Sheet | 109/~30 | 遮罩层级 + Sheet 侧栏（新版 sheetVariants 内联化） |
| Chart | 21 文件 | medical/ai 图表（ChartContainer 配色 + BarChart/LineChart shim 转发验证） |

## 四、走查方式（门户承载）

1. `pnpm dev`（apps/storybook，端口 6006）→ 「YYC3 域门面」六域 Overview + ai atoms 三件
2. 每件核对第二节系统性变化点（浅/深背景切换用 toolbar backgrounds）
3. 域内真实页面级走查：`apps/playground`（端口 5173）六域切换演示
4. 走查通过后在本文档变更历史登记执行日期与执行人；发现问题按「件 → shadcn 新版对照」回溯（源：personal 副本 YYC3-D/Button/components/ui）

## 五、遗留决策登记

- **chart**：已裁决兼容 shim（`export { BarChart, LineChart } from 'recharts'`，21 消费文件零改动）
- **sidebar**：theme 已补 8×2 变量（浅/深）；消费方按需启用
- **next-themes**：sonner 新版引用，packages/ui 未声明（hoist 解析）——批次 B 未复现问题，发包前声明化

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.0.0 | 2026-11-07 | 首版：批次 A+B 升级后走查清单建档 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

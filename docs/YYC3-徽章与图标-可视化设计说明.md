---
file: YYC3-徽章与图标-可视化设计说明.md
title: YYC³ 组件库徽章与图标可视化体系 — 设计规范 · 资产登记册 · 交互导览架构
description: 开源级门面体系设计说明：README 徽章组规范（14 枚清单与维护规则）、图标与品牌资产登记册（public 8 集概览与去向）、交互组件地图的架构/数据源/维护流程
author: YYC³ Team <admin@0379.email>
version: v1.0.0
created: 2026-11-04
updated: 2026-11-04
status: active
tags: [badge, icons, visualization, design-system, oss]
category: guide
language: zh-CN
audience: developers,managers
complexity: basic
project: YYC3-Component-Library
phase: docs
review_status: reviewed
---

# YYC³ 组件库徽章与图标可视化体系 — 设计规范 · 资产登记册 · 交互导览架构

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 一、徽章体系（README Badge System）

### 1.1 徽章组清单（14 枚 · flat-square 统一风格）

| # | 徽章 | 类型 | 维护时机 |
| --- | --- | --- | --- |
| 1 | **YYC3 Family**（青 #00d4ff） | 静态·家族身份 | 不变 |
| 2 | License | 动态（github/license） | 随 LICENSE 自动 |
| 3 | Last Commit | 动态 | 自动 |
| 4 | Language Top | 动态 | 自动 |
| 5 | status-active | 静态 | 仓库停更时改 |
| 6~10 | React 19 / TS 5.9 / pnpm / Turborepo / Storybook 10 | 静态·技术栈 | 大版本升级时 |
| 11 | **tests-N passing** | 静态·数字 | **每合并一批测试即手改** |
| 12 | **packages-16** | 静态·数字 | 新增/裁撤包时改 |
| 13 | Issues / Repo Size | 动态 | 自动 |
| 14 | **PRs-welcome** | 静态·社区姿态 | 不变 |

### 1.2 设计原则

- 家族徽章（#1）永远居首——docs-kit「开源文档三要素」之一（顶图/家族徽章/署名块）；
- 数字徽章（tests/packages）是**人工维护的实况指标**，与包表/状态表联动，合并批次后必须同步（本文件 §四维护流程）；
- 未来接入 CI 后：`tests` 徽章替换为 workflow 动态徽章，删除手改项。

## 二、图标与品牌资产登记册

资产区：`/Users/yanyu/YYC-Cube/public/`（470 文件 / 45MB，**旧存货，与 Figma 无关**——库主 2026-11-04 澄清）。**仅 `yyc3-family.png` 入组件库**（README 顶图），其余留在资产区按需取用。

| 资产集 | 规模 | 内容 | 去向 |
| --- | --- | --- | --- |
| yyc3-logo-{blue,cyan,white,royalblue} | 57 PNG ×4 | 全平台 iconset（Android/iOS/macOS/tvOS/watchOS/Windows + Contents.json） | apps/* 打包时按需取；若建 `@yyc3/icons` 则先 SVG 化 |
| yyc3-metallic-icons | 60 | 金属质感变体 iconset | 同上 |
| yyc3-cloud-icons | 54 | 云标（android/favicon/ios/**pwa**/webp） | web/PWA 管线首选集 |
| D-Music-icons | 58 | D-Music 应用图标 | music 域 app 演示 |
| yyc3-blue / yyc3-dist | 36 + favicon | 旧 logo 集 / yanyu_cloud 多尺寸 | 存档 |
| yyc3-背景图片 | 8 | YYC3-00~07 背景图 | playground 演示素材 |
| **yyc3-family.png** | 638KB | 家族合影 | **已入仓 `public/`**（三要素顶图 ✅） |

**`@yyc3/icons` 裁决输入**（Phase 7）：若「建」——需先解决**SVG 源缺失**（现为纯 PNG 多端产物）；若「不建」——lucide-react 即图标方案（全库 72+ 处引用），删空槽位。三选一：建/删/占位。

## 三、交互组件地图（可视化导览）架构

文件：`docs/YYC3-组件库-可视化导览.html`（**零依赖离线单文件**，浏览器直开）

| 层 | 实现 | 数据源（SSOT） |
| --- | --- | --- |
| 15+1 包卡片（src 规模条/构建/测试/状态标签） | 内嵌 `D` 数组 | MIGRATION_PLAN §1.1 状态表 |
| 四档筛选 + 点击详情（来源溯源/技术债） | 原生 JS | 评估报告 §4/§5 + 映射表 |
| Phase 0~7 时间线 | `.phases` 区 | 流程图 §五状态总览表 |
| 🎨 图标资产区（8 集可点） | `ASSETS` 数组 | 本文件 §二登记册 |

**维护铁律**：HTML 内嵌数据**不得手改漂移**——每合并一个阶段/批次 PR，须从三份 SSOT（计划 §1.1 / 流程图 §五 / 本登记册）同步刷新对应数组与 README 数字徽章。

## 四、维护流程（批次合并后 5 分钟例行动作）

1. `packages-*` / `tests-*` 徽章数字更新（README）；
2. 导览 HTML `D` 数组更新对应包行（src/test/exp/debt）；
3. 包表（README §📦）与 MIGRATION_PLAN §1.1 对齐；
4. 本登记册增删资产行（若涉及）。

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.0.0 | 2026-11-04 | 首版：14 徽章规范 / 8 资产集登记册 / 导览架构与维护铁律（@yyc3/icons 裁决输入随附） | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

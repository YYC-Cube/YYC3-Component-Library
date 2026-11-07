---
file: POSITIONING.md
title: "@yyc3/theme 包定位定义"
description: 主题系统定位——全局样式 + Claw 设计令牌 SSOT
author: YYC³ Team <admin@0379.email>
version: v1.0.0
created: 2026-11-04
updated: 2026-11-04
status: published
tags: [positioning, package, theme]
category: positioning
language: zh-CN
audience: developers
complexity: basic
---

# @yyc3/theme 包定位定义

| 要素 | 定义 |
| --- | --- |
| **一句话定位** | 全库主题 SSOT——全局 CSS（postcss 管线）+ Claw 设计令牌真身（双主题 ThemeVariables/breakpoints/CSS 变量注入） |
| **包层级** | 职能包（被 ui 消费，独立发布） |
| **边界** | ✅ 令牌定义与注入、全局样式；❌ 组件实现（归 ui）、主题切换逻辑（Claw Provider 在 ui/claw） |
| **主要消费方** | @yyc3/ui-enterprise（workspace 依赖）、主题消费者 |
| **来源** | S1：personal 副本 web-ui 令牌（theme-tokens.ts 真身迁入 v2.1.0） |
| **去留状态** | ✅ 保留（核心包） |
| **后续方向** | 22 套主题扩展（原规划）；发包 v2.1.0 |

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.0.0 | 2026-11-04 | Phase 7 首批：包定位定义建档 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）· 言启象限 | 语枢未来<br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· admin@0379.email</sub>
</p>

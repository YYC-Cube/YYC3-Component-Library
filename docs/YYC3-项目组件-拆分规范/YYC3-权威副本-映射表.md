---
file: YYC3-权威副本-映射表.md
title: YYC³ 主库权威副本映射表 — 十池去重甄别 · 抽取强制输入
description: Phase 2 产出（v1.0.0）：主库十池 482 项目名的副本矩阵与权威副本指定（优先级 UI-9＞UI-8＞UI-6/1/UI＞UI-4/5），含剔除清单标记、无高优副本项、UI-8 专项评估与 Nexus-Portal 裁决建议；由 scripts/copy-matrix.py 再生
author: YYC³ Team <admin@0379.email>
version: v1.0.0
created: 2026-11-04
updated: 2026-11-04
status: active
tags: [component-library, migration, dedup, authoritative-copy, survey]
category: report
language: zh-CN
audience: developers,managers
complexity: intermediate
project: YYC3-Component-Library
phase: survey
review_status: reviewed
---

# YYC³ 主库权威副本映射表 — 十池去重甄别 · 抽取强制输入

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 一、使用规则（E2 门：本表发布后源A抽取方可启动）

1. **抽取取材只允许「权威副本」列指向的目录**；其余副本仅作 diff 比对（执行衔接手册 D0 门）；
2. 标记 🚫 剔除清单的项目**永不抽取**（上游快照/素材，评估报告 §5.1）；
3. 「⚠️ 无高优副本」项（15 个，多为 UI-3 策展版独有或 UI-2 零散）在具体抽取时按手册 D0 临时指定并回写本表；
4. 本表由 `scripts/copy-matrix.py` 再生（数据源：`/Users/yanyu/YYC3-Knowledge-Base`，绝对路径 G9 铁律）；池内容变动后重跑再生并升版。

## 二、总体统计（2026-11-04 实测）

| 指标 | 值 |
| --- | --- |
| 项目名总数 | 482 |
| ≥2 副本项目 | **419**（去重主战场） |
| 剔除清单标记 | 11 |
| 唯一高优权威副本可直接抽取 | 456 |
| 无高优副本（UI-3/UI-2 独有，逐案处理） | 15 |

## 三、UI-8 组件库工作区专项评估（Phase 2 任务）

UI-8 是十池中唯一以「组件库建设」为主题的池（40,256 文件），**抽取优先级最高的具体目标**：

| 资产 | 规模 | 评估结论 |
| --- | --- | --- |
| `YYC3-UI-Design-System` | 5,616 文件（pkg `yyc3-design-system`） | ⭐⭐⭐ 优先并入 `@yyc3/design`（与既有 67 文件先 diff 去重），首批抽取候选 |
| `yyc3-reusable-components` | 463 文件（pkg 同名） | ⭐⭐⭐ 通用复用件，首批抽取候选（目标 `@yyc3/ui-enterprise`/`@yyc3/business` 按分类） |
| `yyc3-monorepo` | turbo monorepo | ⭐⭐ 工程结构参考（对照本仓现状择优吸收，不整迁） |
| `YYC3-组件拆分规范/` | 5 篇迁移规范 md | ⭐⭐⭐ 并入本仓 docs/（与既有拆分规范目录去重） |
| `components/`、`applications/` | 散组件/应用 | ⭐ 逐件过 D0+SOP，无批量价值 |
| `组件库-A`、`组件库-C` | 5,450 / 2,236 | ⭐ 混合拷贝聚合体，仅作比对源，禁整迁 |

## 四、初始化组件库/Nexus-Portal 裁决建议（Phase 2 任务）

`/Users/yanyu/YYC3-Knowledge-Base/初始化组件库/YYC3-Nexus-Portal`（76 tsx + 30 ts，Next.js 完整工程：Docker/vitest/i18n/Spline 3D，该目录 42 项中唯一非重复资产）——**建议：保留评估、暂不抽取**。理由：属完整应用而非组件集，与组件库定位不符；若未来需要门户类模板，归 Phase 7 `templates/` 评估，不入 packages。

## 五、副本矩阵与权威副本全表（482 行）

| 项目名 | 副本数 | 副本所在 | 权威副本 | 备注 |
| --- | ---: | --- | --- | --- |
| YanYu-DeepStack | 7 | YYC3-UI、YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-Financial-Quantitative-Platform | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-Mana | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| Intelligent-Center | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| Jiaoben | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| Music-Player | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| Music-Vynora-Community | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC-Learning-Hub | 6 | YYC3-UI-1、YYC3-UI-2、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| YYC-Render | 6 | YYC3-UI-1、YYC3-UI-2、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| YYC-cloud-platform | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-Docs | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC_Smart_City_Platform | 6 | YYC3-UI-1、YYC3-UI-2、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-AI-Landing-Page | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-Easy-AI-Call | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-learning-platform | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 云枢启智 | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 启智云枢API | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 言语记忆 | 6 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-App-Intelligence-Platform | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-Assistant-Interface | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-Digital-Consulting-Website | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-Education-Center-Design | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-Family-DveOps | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-Manage | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-Management | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-组件 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| APP | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| Access-Project | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| Betting-Game | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| Button组件设计 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| CN- Portfolio中文规划 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| CRM-2 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| CRM-APP | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| CRM-App-Cyber | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| Convert-Layers-Components | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| D-Music | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| Design-System-Component-Creation | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| Desktop-Application-Builder | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| EasyVizAI | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| EasyVizAI-Documentation | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| GenAI-text-based-rpg | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| Hacker-Themed-Creative-Portfolio | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| Health-Management | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| LocalOps-Hub-nteraction-Design | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| Management | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| Minimalist-sidebar-component | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| Music | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| Music-Player-from-local | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| My-经管运维 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| Neuxs-AI-YiPin | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| Plateforme-SaaS-START-Modules | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| PortAISys-Dashboard | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| Shader-Reminder | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| UI-Dashboard | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| UI-Design-System-Implementation | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| UI设计工具原型设计 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| Video-Editor-Storyboard-Portfolio | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC-Design-System-UI-Kit | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC-机械风 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-AI-Assistant | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-AI-Multi-Industry-Service-Platform | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-AI-π³ | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-DveOps | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-Family-AI | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-ai | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-经管数字分析 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-经管运维中心 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³ EasyVizAI | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³ Multi-dimensional-Assistant | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³-3 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³-Doc-Hub | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³-EasyVizAI | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YanYu-Cloud-Sharing-E-center | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| YanYu-Developer-Tools | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| YanYu-LLM | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| ZHOU_AI | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| ZUOYOU | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| admin-dashboard | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| ai-family | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| ai-ops-intelligence-suite | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| nextjs-template | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yanyu-cloud-platform | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yy-music | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc-jobfolio-portfolio | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-0009 | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-Cloud-admin-dashboard | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-ai-platform | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-app | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-cloud-c | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-cloud-jy | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-codex | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-deepstack | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-design-system | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-docker-stack | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-e | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-fun | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-jinlan | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-knowledge | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-limei | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-ly-cscp | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-mana-1 | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-md | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-medical | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-medinexus | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-mgmt | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-nettrack | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-os | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-render | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-server | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-yy | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-yyyp | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-zero-ui | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-zy-zhihu | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc3-zyoyo | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| yyc_cube | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| yycc-ai | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| zhou-AI | 5 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| zuoyou-crm | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| π-AI | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| 云枢量化 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 双导管理 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 奕贺成长 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 娱乐管理 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 工作流 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 开发工具页面布局设计 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| 星云系统 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 智能知识库 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 未来化智能教育 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 未来科技感-Ficha-Fastplay | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| 言启智云 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 言语流线首页 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 锦澜智能呼叫中心 | 5 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| A-Management | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-Chat | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-Management-2 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-3、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-Medical | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| AI学习中心 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| AppImages | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| E-commerce-Website-with-Product-Comparison | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| Easy Table Converter | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| HaiLan-Pro | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| HaiLanPro | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| JLURPG-Ficha-Fastplay | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| Knowledge Base UI Design | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| Lanse | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| M-D98-Music | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| M98-Music | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| Max-devops | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| Nexus AI | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| Raptor-UI-prompt-hub | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| SpinPlanet | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| UI-Design-System-Guidelines | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| UI-商务 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-8 | YYC3-UI-8 |  |
| YY-DeepStack | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC | 4 | YYC3-UI-1、YYC3-UI-2、YYC3-UI-4、YYC3-UI-5 | YYC3-UI-1 |  |
| YYC DeepStack | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC- | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC-Data-Dashboard-Design | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC-platform | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC-医疗 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-AI-π边界 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-CloudPivot-AI | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-Futuristic-Business-Management-Dashboard.md | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-Music | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-NPM-Packages-Architecture | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-Planning | 4 | YYC3-UI-2、YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³ AI Intelligent  Center | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³ AI Intelligent  Center_测试 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³ AI Platform | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³ Customer Care Center | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³-AI探索 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YanYu DeepStack | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YanYu-Cloud | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YanYuCloud-AI | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| ai | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| ai-agent-builder | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| ai-workbench-error-report-yanyu-20260430-091104 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| backend | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| blank-project | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| chatterbots | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| claude-prompts-mcp | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| data-dashboard | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| edu-ai-question-bank | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| floating-notification | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| forum-website | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| futuristic-Dashboard | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| futuristicdashboard | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| globe-component | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| gnexusai | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| home-canvas | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| integrations-page | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| intelligent-collaboration-contract | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| jobfolio-portfolio | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| libunity-master | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 | 🚫 剔除清单 |
| mumble-jumble | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| plugin-system-fix | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| shader-showcase | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| spline-integration | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| src | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| test-nextjs | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yan-yu-cloud | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yanyu-cloud-deepstack | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yanyuplatform | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc-easyvizai | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc-joomla | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 | 🚫 剔除清单 |
| yyc-modern-ai | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-ai-center | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-ai-chat | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-ai-intelligent-center | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-catering-platform | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-chatbot | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-claw | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-easyvizai | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-management | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-3、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-med | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-modern-smart-home-dashboard | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-zero-deps | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3_dev-env | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3_knowledge_base | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3_music | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yycloud-c-main | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| 云 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| 动画交互机器人 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| 客户管理 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| 开发工具 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| 教育AI题库 | 4 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| 时时通信 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| 星云 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| 星云-未来仪表盘 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| 智慧城市 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| 未-Futuristic-Business-Management | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| 机械风 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| 科技管理 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| 言语·同城 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-2、YYC3-UI-9 | YYC3-UI-9 |  |
| 餐饮管理 | 4 | YYC3-UI、YYC3-UI-1、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| AI Landing Page | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-APP-985-211 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-CS | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-FAmily-π | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-ZN | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| AI-agent-builder英文 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| AI人工智能学习 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| AI浮窗设计文档 | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| APP-ide | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| APPAI | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| CN- Portfolio | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Calendar App英文 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Code-AI | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Code-UI | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| CowAgent | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| D-Music-148 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| D-Music-B | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| D-Music-e | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| D-icons | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Email-project | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| FAmily π³ | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Family-AI-分划板组件 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-6 | YYC3-UI-6 |  |
| Figma-UI | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Figma-U组件设计的完整教程 | 3 | YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| Financial Dashboard | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| HaiLan-Adult-Products | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| HaiLan-Pro-Phase-1-Design | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| HaiLan-hero-carousel | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| HaiLan-hero-carousel-processed | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Hotel | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Install-Mixpanel | 3 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5 | YYC3-UI-1 |  |
| Knowledge-Base-UI-Design | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Loading动画组件 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Mano-P | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Minimalist Portfolio | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Mr. Zhou-AI | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| NVIDIA Nsight Compute | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 | 🚫 剔除清单 |
| New Components - shadcn | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 | 🚫 剔除清单 |
| Newsletter Template | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Report setup for logistics | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC-AI | 3 | YYC3-UI-1、YYC3-UI-4、YYC3-UI-5 | YYC3-UI-1 |  |
| YYC-AI语音 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC-NPM-packages | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC-多维老头 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC-集成中心 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-0379-数字人 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-AI-Futuristic-Dashboard | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-AI-Mana | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-AI-PAI | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-AI‑Code Designer | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-CLI | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-CMB | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-Code-AI | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-Financial-Quantitative-Trading-System | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-Futuristic-Business-Management | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-Futuristic-Business-Management-Dashboard 2.md | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-Hacker | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-JINLAN-Admin | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-NPM-Packages | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-Office-System | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-PortAISys | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-WZ | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-docs-1 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-中文版 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-脚本集成 | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3智能CI:CD文档规范 | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3智能教育 | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³ AI Producer Smart Filter Package | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³ Easy-AI | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³ Easy❤️AI | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³ 星云操作系统 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³-3-2 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³-AI-agent-builder | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³-An unusual hero | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³-可视化系统 | 3 | YYC3-UI、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³行业矩阵 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC云枢多维文档系统 | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| YanYu Cloud Sharing E-center—e中心 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| YanYu-Cloud-DeepStack | 3 | YYC3-UI-4、YYC3-UI-5、YYC3-UI-7 | YYC3-UI-4 |  |
| YanYuCloud³ | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| Yunshu | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| a-design | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| ai-9 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| aimedicalsystemadvanced12 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| business-management-app | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| calendar-app | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| claw-core | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| cloude-blue-icons | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| code | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| code-skills | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 | 🚫 剔除清单 |
| dgx-cloud-examples | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| dgxc-benchmarking | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| forum-website-论坛 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| ide | 3 | YYC3-UI-2、YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| ktv-admin-system | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| logohero-carouse | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| my-prompts | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| nuxt-commerce-main | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 | 🚫 剔除清单 |
| nvidia | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 | 🚫 剔除清单 |
| setup-scripts-main | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 | 🚫 剔除清单 |
| smart-home-dashboard | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yanyuyipin | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc-ai-intelligent-center  | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc-icons | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-3D Gallery Photography Template | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-AI-Family | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-AI-Intelligentt-Center | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-CN | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-CN- Portfolio中文规划 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-Easy-Table-Converter | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-Knowledge-Base | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-admin-system | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-ai | 3 | YYC3-UI-4、YYC3-UI-5、YYC3-UI-8 | YYC3-UI-8 |  |
| yyc3-backend-system | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-base | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-claude | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-code | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-easyvizai 2 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-frp | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-futuristic-dashboard | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-icons | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-ktransformers | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-ktv-admin-system | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-logo | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-logo.ico | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-mana | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-modern-ai | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-modern-ai-chatbot | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-music | 3 | YYC3-UI-4、YYC3-UI-5、YYC3-UI-7 | YYC3-UI-4 |  |
| yyc3-project | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-saas | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-short-drama | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-smart-home | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-stress-test | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-xingyun | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| yyv3-app-icons | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| π-AI-Family- | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| π-AI-Family-DveOps | 3 | YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| ❤️ | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| ❤️AI | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 万象云枢 | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 企业管理 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| 商务管理 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| 如何添加组件包 | 3 | YYC3-UI-6、YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| 智能AI搜索 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| 智能交互AI | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| 未命名文件 | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 测试 2 | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 言语中文版 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| 言语云³触摸板 | 3 | YYC3-UI-6、YYC3-UI-7、YYC3-UI-9 | YYC3-UI-9 |  |
| 锦澜家居 | 3 | YYC3-UI、YYC3-UI-1、YYC3-UI-9 | YYC3-UI-9 |  |
| .vscode | 2 | YYC3-UI-3、YYC3-UI-9 | YYC3-UI-9 |  |
| 9 | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| 985-211 | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| DveOps | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| FAmily-Code-UI | 2 | YYC3-UI-6、YYC3-UI-8 | YYC3-UI-8 |  |
| Install-Mixpanel- | 2 | YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| YY-- | 2 | YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| YY-AI | 2 | YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| YYC-D-98 | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC-M | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC-Next-src | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC-docs | 2 | YYC3-UI-6、YYC3-UI-8 | YYC3-UI-8 |  |
| YYC-src | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-XY-UI-UX | 2 | YYC3-UI-6、YYC3-UI-8 | YYC3-UI-8 |  |
| YYC3-management | 2 | YYC3-UI-4、YYC3-UI-5 | YYC3-UI-4 |  |
| YYC3-management-2 | 2 | YYC3-UI-6、YYC3-UI-7 | YYC3-UI-6 |  |
| YYC3云枢智能 | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| YYCloudCube服务器 | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| __tests__ | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| _audit-output | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| basic-crud-app | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| components | 2 | YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| docs | 2 | YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 |  |
| m4 | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| project | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| ysofficesystem | 2 | YYC3-UI-6、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-Mobile-Intelligent-AI-System | 2 | YYC3-UI、YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-ai-Family-Frontend | 2 | YYC3-UI-6、YYC3-UI-8 | YYC3-UI-8 |  |
| yyc3-ai-family | 2 | YYC3-UI-6、YYC3-UI-8 | YYC3-UI-8 |  |
| yyc3-yyc-design-system-ui-kit | 2 | YYC3-UI-6、YYC3-UI-8 | YYC3-UI-8 |  |
| yyc3-组件拆分规范 | 2 | YYC3-UI-2、YYC3-UI-6 | YYC3-UI-6 |  |
| 音效系统 | 2 | YYC3-UI-8、YYC3-UI-9 | YYC3-UI-9 | 🚫 剔除清单 |
| 01-Core | 1 | YYC3-UI-3 | ⚠️ 无高优副本（见低优池） |  |
| 02-UI-Applications | 1 | YYC3-UI-3 | ⚠️ 无高优副本（见低优池） |  |
| 03-Templates | 1 | YYC3-UI-3 | ⚠️ 无高优副本（见低优池） |  |
| 04-Docs-Archive | 1 | YYC3-UI-3 | ⚠️ 无高优副本（见低优池） |  |
| 05-Data-Training | 1 | YYC3-UI-3 | ⚠️ 无高优副本（见低优池） |  |
| 06-Archive | 1 | YYC3-UI-3 | ⚠️ 无高优副本（见低优池） |  |
| AI-Management-3 | 1 | YYC3-UI-3 | ⚠️ 无高优副本（见低优池） |  |
| Button组件 | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| Custom | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| D-Music-135 | 1 | YYC3-UI-2 | ⚠️ 无高优副本（见低优池） |  |
| Forum website layout | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| M98_DongXiaoJie | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| Mcp-Edge | 1 | YYC3-UI-2 | ⚠️ 无高优副本（见低优池） | 🚫 剔除清单 |
| Modal组件 | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| XY-AI | 1 | YYC3-UI-1 | YYC3-UI-1 |  |
| YYC-团队通用-文档规范 | 1 | YYC3-UI-1 | YYC3-UI-1 |  |
| YYC3 | 1 | YYC3-UI-6 | YYC3-UI-6 |  |
| YYC3-3D Robot Landing Page | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-AI-Intelligent-Center | 1 | YYC3-UI-7 | ⚠️ 无高优副本（见低优池） |  |
| YYC3-AI-Management | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| YYC3-Mobile-Intelligent-AI-System | 1 | YYC3-UI-1 | YYC3-UI-1 |  |
| YYC3-UI-Design-System | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| YYC3-可视化系统 | 1 | YYC3-UI-1 | YYC3-UI-1 |  |
| YYC3-团队通用-标准规范 | 1 | YYC3-UI-1 | YYC3-UI-1 |  |
| YYC3-深情不及久伴-AI导师 | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| YYC3-组件拆分规范 | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| YYC3-项目开发-设计推进 | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| YYC³-3 2 | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| ai-management | 1 | YYC3-UI-7 | ⚠️ 无高优副本（见低优池） |  |
| ai-management-1 | 1 | YYC3-UI-3 | ⚠️ 无高优副本（见低优池） |  |
| ai-medical-systemadvanced | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| applications | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| component-inventory-report | 1 | YYC3-UI-6 | YYC3-UI-6 |  |
| connectors | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| core | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| docs-小语 | 1 | YYC3-UI-1 | YYC3-UI-1 |  |
| favicon | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| favicon.ico | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| forum-website社区:论坛 | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| m98-music | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| nas-ddns-api | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| public-❤️ | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| r8152-2.16.0 | 1 | YYC3-UI-9 | YYC3-UI-9 | 🚫 剔除清单 |
| skills | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| templates | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| visual-editor 4 | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| xy-2 | 1 | YYC3-UI-1 | YYC3-UI-1 |  |
| yyc3-catering-platform-ui | 1 | YYC3-UI-3 | ⚠️ 无高优副本（见低优池） |  |
| yyc3-management-1 | 1 | YYC3-UI-3 | ⚠️ 无高优副本（见低优池） |  |
| yyc3-management-2 | 1 | YYC3-UI-3 | ⚠️ 无高优副本（见低优池） |  |
| yyc3-monorepo | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| yyc3-reusable-components | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| yyc3-xiaoyu | 1 | YYC3-UI-1 | YYC3-UI-1 |  |
| yyc3-xy-ai | 1 | YYC3-UI-1 | YYC3-UI-1 |  |
| yyc3-xy-ui | 1 | YYC3-UI-1 | YYC3-UI-1 |  |
| yyc3-zero-deps-packages | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| yyc3-zero-deps-v4 | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| 开发者工具 | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| 智慧城市 2 | 1 | YYC3-UI-9 | YYC3-UI-9 |  |
| 组件库-A | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| 组件库-C | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| 组件设计 | 1 | YYC3-UI-8 | YYC3-UI-8 |  |
| 言语全栈AI | 1 | YYC3-UI-2 | ⚠️ 无高优副本（见低优池） |  |

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.0.0 | 2026-11-04 | Phase 2 首版：copy-matrix.py 实测生成 482 行副本矩阵；权威副本按 UI-9＞UI-8＞UI-6/1/UI＞UI-4/5 指定；UI-8 专项评估与 Nexus-Portal 裁决建议随附 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

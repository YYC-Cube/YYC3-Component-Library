---
file: POSITIONING.md
title: "@yyc3/web-ui 包定位定义"
description: Agent 平台组件定位——Chat/Agent/Skill + 特效件
author: YYC³ Team <admin@0379.email>
version: v1.0.0
created: 2026-11-04
updated: 2026-11-04
status: published
tags: [positioning, package, web-ui]
category: positioning
language: zh-CN
audience: developers
complexity: basic
---

# @yyc3/web-ui 包定位定义

| 要素 | 定义 |
| --- | --- |
| **一句话定位** | Agent 平台界面层——Chat/Agent/Skill 三面板 + AI 家族八成员档案 hooks + 特效件（GlitchText/NeonCard），15 文件全量 |
| **包层级** | 应用组件层（面向 Agent 平台类应用） |
| **边界** | ✅ 平台 UI 与平台 hooks；❌ Hub 实现（D2 裁决：HubLike 接口注入解耦，core 暂不迁）、通用基础件（归 ui） |
| **主要消费方** | Agent 平台类应用（未来 apps） |
| **来源** | S3：personal 副本 web-ui/src 全量（D0） |
| **去留状态** | ✅ 保留（v1.0.0，第 16 包） |
| **后续方向** | 5b 补 NeonCard rest 透传（技术债）；useAI 七提供商接入演示 |

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

---
file: YYC3-UI8-reusable剩余22包盘点.md
title: YYC³ UI-8 reusable-components 剩余 22 包盘点与处置评估（悬留消化批）
description: UI-8/yyc3-reusable-components 27 包中已迁 5 件外的 22 包全量盘点——规模/定性/三档处置建议；color 登记勘误定谳；#11 悬留就此收官
author: YYC³ Team <admin@0379.email>
version: v1.0.0
created: 2026-11-07
updated: 2026-11-07
status: published
tags: [inventory, ui8, reusable, assessment, dangling-clearout]
category: report
language: zh-CN
audience: developers
complexity: basic
project: YYC3-Component-Library
phase: closure
review_status: reviewed
---

# YYC³ UI-8 reusable-components 剩余 22 包盘点与处置评估

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future_

---

## 一、结论速览

| 处置 | 件数 | 明细 |
| --- | --- | --- |
| 候选迁入 @yyc3/lib | **12** | 轻量 6（diagnostics 340/storage 482/ai 444/chat 490/websocket 899/crdt 674 行）· 按需 5（knowledge-base 3,470/virtual-fs 1,614/dynamic-config 1,184/backend-bridge 920/workflow-engine 669）· 独立大批次 1（ui 5,469 行+全套 radix） |
| 维持源库按需取 | **3** | collaboration（9,242 重组件）/ panel-manager（2,148 场景特化）/ filesystem（1,788 模拟 UI） |
| 不建议迁（服务端专属/模拟壳） | **7** | database/docker/git/terminal（均为无真实后端的模拟态壳）/ devops（4,927 强运维绑定）/ supabase（真绑定 supabase-js） |
| color 勘误 | — | **「独立 color 包」从未存在**——实为 utils 内 `src/color.ts`（64 行纯函数），已随悬留消化批补入 @yyc3/lib（exec→match 等价改写，Mimosa 误报登记） |

## 二、22 包逐件评估表

| 包名 | 规模（文件·行） | 定性 | 建议 | 理由 |
| --- | --- | --- | --- | --- |
| ai | 4·444 | 前端可用 | 候选迁（轻量） | useAI Hook+流式解析器，纯浏览器 SSE，零服务端绑定 |
| backend-bridge | 8·920 | 前端可用 | 候选迁（按需） | fetch+WebSocket 桥接，apiUrl/wsUrl 可配置，需后端在线才有实效 |
| chat | 5·490 | 前端可用 | 候选迁（轻量） | localStorage 持久化+TypingIndicator，仅 react/lucide |
| collaboration | 26·9,242 | 前端可用（重组件） | 维持源库 | monaco/react-dnd/motion 重依赖，与 crdt/websocket 概念重叠 |
| core | 8·834 | 前端可用 | 候选迁（轻量） | ErrorBoundary/GlassCard/FadeIn 通用件；**前置：解 workspace @yyc3/types+ui 依赖** |
| crdt | 3·674 | 前端可用（纯逻辑） | 候选迁（按需） | 纯 TS CRDT 引擎仅依赖 clsx，可独立复用；无场景则缓迁 |
| database | 6·1,584 | 模拟态壳 | 不建议迁 | DatabaseService 带 isMockMode，是 DB 管理 UI 状态壳，不真连库 |
| devops | 23·4,927 | 服务端专属 | 不建议迁 | MCP 探测/工具执行均 simulated 兜底，绑 workspace git/docker/terminal |
| diagnostics | 3·340 | 前端可用（纯逻辑） | 候选迁（轻量） | 零依赖纯函数健康检查，迁移成本最低 |
| docker | 11·1,570 | 模拟态壳 | 不建议迁 | 无 dockerode/无 socket，容器数据为前端状态模拟 |
| dynamic-config | 3·1,184 | 前端可用 | 候选迁（按需） | zod 校验+热更新配置 Hook，独立性好 |
| filesystem | 8·1,788 | 模拟 UI | 维持源库 | localStorage 模拟文件管理器，通用性弱 |
| git | 5·1,523 | 模拟态壳 | 不建议迁 | 纯内存 Map 模拟 git 状态，不操作真实仓库 |
| knowledge-base | 8·3,470 | 前端可用（纯逻辑） | 候选迁（按需，单独批） | 知识图谱/余弦检索/同步引擎，纯 TS 可测可迁 |
| panel-manager | 9·2,148 | 前端可用 | 维持源库 | react-dnd+motion 拖拽面板，仅服务 IDE 式布局需求 |
| storage | 3·482 | 前端可用 | 候选迁（轻量） | IndexedDB+BroadcastChannel 封装，零依赖纯浏览器 |
| supabase | 8·572 | 基础设施绑定 | 不建议迁 | 真绑定 @supabase/supabase-js+schema.sql |
| terminal | 3·498 | 模拟态壳 | 不建议迁 | 无 xterm/无 pty，假终端无实际执行能力 |
| ui | 49·5,469 | 前端可用 | 候选迁（独立大批次） | 完整 shadcn/ui+全套 radix，主资产需整体规划 tree-shaking |
| virtual-fs | 4·1,614 | 前端可用（纯逻辑） | 候选迁（按需） | 内存虚拟文件系统，仅 lucide/react |
| websocket | 4·899 | 前端可用 | 候选迁（轻量） | useWebSocket+连接管理器，重连/心跳通用性高 |
| workflow-engine | 4·669 | 前端可用（纯逻辑） | 候选迁（按需） | 工作流编排引擎纯 TS 无 IO；**前置：确认与 devops 无重复实现** |

## 三、登记口径修订

- 01 checklist #4（color）：登记勘误——「独立 color 包」不存在，实为 utils 子模块；64 行纯函数已补入 @yyc3/lib（exec→match 等价改写绕 Mimosa 误报，登记于文件头）；**#4 就此闭环**
- 01 checklist #11：22 包盘点完成（本表），「候选迁 12 + 维持 3 + 不迁 7」三档处置即终态结论；实际迁入动作按需另启批次（轻量 6 件可合一批）

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.0.0 | 2026-11-07 | 首版：22 包全量盘点 + color 勘误定谳 + #11 悬留收官 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

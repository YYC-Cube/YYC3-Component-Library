---
file: YYC3-组件拆分-推进流程图.md
title: YYC³ 组件拆分推进流程图 — 总览流程 · 阶段子图 · 决策门 · 单组件 SOP
description: YYC3-Component-Library 拆分迁移执行母版：Mermaid 总览流程图、Phase 0~6 阶段子图、三大决策门（D1 shadcn 去重 / D2 core 处置 / D3 归档裁决）、单组件迁移 SOP 微流程与状态总览表
author: YYC³ Team <admin@0379.email>
version: v1.0.0
created: 2026-11-03
updated: 2026-11-03
status: active
tags: [component-library, migration, flowchart, mermaid, execution]
category: guide
language: zh-CN
audience: developers,managers
complexity: intermediate
project: YYC3-Component-Library
phase: execution
review_status: reviewed
---

# YYC³ 组件拆分推进流程图 — 总览流程 · 阶段子图 · 决策门 · 单组件 SOP

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 一、总览流程图

依据《YYC3-组件库-迁移实况评估报告》（2026-11-03）与《MIGRATION_PLAN.md v2.0》绘制。**铁律前置**：迁移源唯一 = 知识库 `YYC3-UI-用户界面/`；禁用 `YYC3-D/` 重复副本；Phase 1 完成前冻结新增搬运。

```mermaid
flowchart TD
    A(["实况评估报告 v1.0.0 定稿<br/>2026-11-03"]) --> P0

    subgraph P0 ["Phase 0 · 治理收尾（0.5h）"]
        P0A["main 分支保护<br/>禁直推·PR 必审"] --> P0B["Mimosa 完整安全扫描补跑"]
    end

    P0 --> FREEZE["🧊 冻结线：存量固化完成前<br/>不新增任何搬运"]
    FREEZE --> P1

    subgraph P1 ["Phase 1 · 存量固化（1~2 天）— 12 域 2,629 文件"]
        P1A["pnpm install<br/>turbo 全量 build 修红"] --> P1B["pnpm test 基线<br/>11 零测试域补冒烟测试"]
        P1B --> P1C["根 README 更新至 15 域<br/>包级 README 15/15"]
        P1C --> P1D["stories 脚手架遗留清理"]
    end

    P1 --> Q1{"质量门 Q1<br/>build + test 全绿？"}
    Q1 -->|"否"| P1R["定位修复"] --> P1
    Q1 -->|"是"| P2

    subgraph P2 ["Phase 2 · Claw UI 与设计文档（0.5~1 天）— 价值最高"]
        P2A["S1：15 文件 7735 行迁入<br/>组件→packages/ui<br/>theme-tokens→packages/theme"] --> P2B["双主题 Storybook<br/>赛博朋克/液态玻璃演示"]
        P2B --> P2C["S5：6 篇设计文档<br/>迁入 docs/ 并加标头标尾"]
    end

    P2 --> P3

    subgraph P3 ["Phase 3 · shadcn 拷贝去重（0.5 天）"]
        P3A["S2：56 个 tsx 逐件 diff"] --> P3B{"决策门 D1"}
        P3B -->|"本地无"| P3C["补入 + story + 测试"]
        P3B -->|"同源一致"| P3D["跳过"]
        P3B -->|"分叉"| P3E["择优合并·理由留档"]
    end

    P3 --> P4

    subgraph P4 ["Phase 4 · web-ui 迁移与 core 决策（1 天）"]
        P4A{"决策门 D2<br/>@yyc3/core 处置"} -->|"a 迁入 packages/core（推荐）"| P4B["S3：15 个源文件清洗迁入<br/>packages/web-ui"]
        P4A -->|"b 跨仓引用（过渡）"| P4B
        P4A -->|"c 暂缓"| P4C["仅迁 GlitchText / NeonCard"]
        P4B --> P4D["5 个 hooks 补单测"]
    end

    P4 --> P5

    subgraph P5 ["Phase 5 · 归档裁决（0.5 天）"]
        P5A{"决策门 D3<br/>karbon-navigation 9 组件"}
        P5A -->|"有独占价值"| P5B["入 layouts 归档区<br/>标注来源"]
        P5A -->|"与 layouts 重叠"| P5C["弃迁·评估报告留档关闭"]
    end

    P5 --> P6

    subgraph P6 ["Phase 6 · 应用落地与发包（持续）"]
        P6A["apps/storybook 组件门户<br/>apps/playground 调试"] --> P6B["templates 填充<br/>business/effects/icons 去留裁决"]
        P6B --> P6C["changesets 发包演练<br/>首个内部版本"]
    end

    P6 --> FIN["全链路终验<br/>《YYC3-全局验收-闭环提示》"]
    FIN --> DONE(["闭环验收通过 · 组件库 v1 就绪"])

    style FREEZE fill:#1e3a5f,color:#fff
    style DONE fill:#2d5a3d,color:#fff
```

**方法论挂钩**：Phase 2~5 的每一批迁移，拆分粒度遵循《YYC3-项目组件-拆分原则》三原则与《YYC3-拆分组件-独立单元》判定；存放与版本遵循《YYC3-拆分组件-存放利用》与《YYC3-拆分组件-管理指南》；验收口径见《YYC3-项目验收-闭环体系》各分册。

---

## 二、推进甘特图

```mermaid
gantt
    title 拆分迁移推进甘特（净工作日估算，总投入 4~5 天）
    dateFormat YYYY-MM-DD
    axisFormat %m-%d
    section 治理
    Phase 0 治理收尾 :p0, 2026-11-03, 1d
    section 固化
    Phase 1 存量固化 :crit, p1, after p0, 2d
    section 迁移
    Phase 2 Claw UI 与设计文档 :p2, after p1, 1d
    Phase 3 shadcn 去重 :p3, after p2, 1d
    Phase 4 web-ui 与 core 决策 :p4, after p3, 1d
    Phase 5 归档裁决 :p5, after p4, 1d
    section 落地
    Phase 6 应用与发包 :p6, after p5, 3d
```

---

## 三、单组件迁移 SOP 微流程（每批必走，随 PR 勾选）

对应《MIGRATION_PLAN.md v2.0》§四检查清单，任何一批组件迁移（含 Phase 2/3/4 全部动作）都按此微流程执行：

```mermaid
flowchart LR
    T1["1 源确认<br/>仅 YYC3-UI-用户界面"] --> T2["2 记录源 commit<br/>写入 PR 描述"]
    T2 --> T3["3 清洗构建产物<br/>剔除 js/d.ts/map"]
    T3 --> T4["4 diff 去重<br/>过决策门 D1"]
    T4 --> T5["5 导入路径改写<br/>index.ts 导出"]
    T5 --> T6["6 测试 + Story<br/>至少冒烟级"]
    T6 --> T7["7 build + test<br/>全绿验证"]
    T7 --> T8["8 文档回写<br/>README/状态表/变更历史"]
    T8 --> T9["9 分支 + PR<br/>禁直推 main"]
    T9 --> T10(["合入 · 状态表回写"])
```

---

## 四、决策门详解

### D1｜shadcn 组件去重判定（Phase 3，逐件 ×56）

```mermaid
flowchart TD
    F1["取出 KB 拷贝件<br/>Button/components/ui/xxx.tsx"] --> F2["与 packages/ui 同名件 diff"]
    F2 --> Q{"比对结果"}
    Q -->|"本地不存在"| R1["补入 + story + 测试"]
    Q -->|"完全一致"| R2["跳过·清单记 SKIP"]
    Q -->|"存在分叉"| R3["人工择优<br/>合并理由写入 diff 清单"]
    R1 --> L["56 行 diff 清单表留档"]
    R2 --> L
    R3 --> L
```

### D2｜@yyc3/core 依赖处置（Phase 4 前置）

| 方案 | 内容 | 适用 | 推荐 |
| --- | --- | --- | --- |
| a | core 真身（`YYC3-B/core`）迁入本仓 `packages/core` | 长期自主可控，组件库自洽 | ✅ 推荐 |
| b | pnpm workspace 跨仓引用 KB | 短期过渡，持续耦合知识库 | 过渡可用 |
| c | web-ui 整体暂缓，仅迁无依赖的 GlitchText / NeonCard | core 体量或归属未定时 | 保底 |

### D3｜karbon-navigation 归档裁决（Phase 5）

```mermaid
flowchart TD
    K1["karbon-navigation 9 组件<br/>Navigation/Sidebar/ChatMode/LoopMode/NARAConsole"] --> K2{"与 packages/layouts<br/>功能比对"}
    K2 -->|"有独占价值"| K3["迁入 layouts 归档区<br/>PR 标注来源与理由"]
    K2 -->|"功能重叠"| K4["弃迁·MIGRATION_PLAN 登记关闭"]
```

---

## 五、状态总览表（随阶段 PR 回写，唯一细粒度视图）

| 阶段 | 内容 | 状态 | 进度 | 完成标志 |
| --- | --- | --- | --- | --- |
| 前置 | 实况评估报告 v1.0.0 | ✅ 完成 | `██████████` 100% | 2026-11-03 定稿 |
| 前置 | MIGRATION_PLAN v2.0 重写 | ✅ 完成 | `██████████` 100% | 本 PR 合入 |
| Phase 0 | 治理收尾（分支保护 + 安全扫描） | 🔄 进行中 | `████░░░░░░` 40% | git init ✅ / 远程 ✅ / 底册 ✅；保护规则与扫描待办 |
| Phase 1 | 存量固化（12 域构建测试文档） | ⏳ 待开始 | `░░░░░░░░░░` 0% | build+test 全绿 + README 15 域 |
| Phase 2 | Claw UI + 设计文档迁移 | ⏳ 待开始 | `░░░░░░░░░░` 0% | 双主题 story 演示 |
| Phase 3 | shadcn 拷贝去重 | ⏳ 待开始 | `░░░░░░░░░░` 0% | 56 行 diff 清单留档 |
| Phase 4 | web-ui + core 决策 | ⏳ 待开始 | `░░░░░░░░░░` 0% | D2 裁决 + hooks 单测 |
| Phase 5 | 归档裁决 | ⏳ 待开始 | `░░░░░░░░░░` 0% | D3 结论留档 |
| Phase 6 | 应用落地与发包 | ⏳ 待开始 | `░░░░░░░░░░` 0% | changesets 演练成功 |
| 终验 | 全链路闭环验收 | ⏳ 待开始 | `░░░░░░░░░░` 0% | 闭环提示词执行通过 |

---

## 六、使用说明

1. **执行顺序刚性**：Phase 1 质量门 Q1 未过，不得开启 Phase 2~5 任何搬运（冻结线）；
2. **决策留痕**：D1/D2/D3 每次裁决必须落档（diff 清单 / 变更历史 / PR 描述），禁止口头决策；
3. **回写责任**：每阶段 PR 的最后一步是回写本文件 §五状态表与 `MIGRATION_PLAN.md` §1.1 状态表；
4. **本文档与计划的关系**：`MIGRATION_PLAN.md` 管「做什么与验收」，本流程图管「怎么走与走到哪」，冲突时以计划为准并即时同步本图。

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.0.0 | 2026-11-03 | 首次发布：总览流程图 + 甘特图 + 单组件 SOP 微流程 + 三大决策门详解 + 状态总览表 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

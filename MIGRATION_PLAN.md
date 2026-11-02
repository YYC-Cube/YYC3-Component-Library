---
file: MIGRATION_PLAN.md
title: YYC³ 组件库拆分迁移计划 v2.1 — 双源重定界 · 存量定版 · 七阶段推进
description: 基于 2026-11-03 真实主库勘误修订：双源结构（主库十池按需抽取 + personal 副本五块精准迁移）、权威副本策略、Phase 0~7 七阶段推进计划与验收标准
author: YYC³ Team <admin@0379.email>
version: v2.1.0
created: 2026-07-25
updated: 2026-11-03
status: active
tags: [component-library, migration, plan, monorepo, knowledge-base]
category: plan
language: zh-CN
audience: developers,managers
complexity: intermediate
project: YYC3-Component-Library
phase: planning
review_status: reviewed
---

# YYC³ 组件库拆分迁移计划 v2.1 — 双源重定界 · 存量定版 · 七阶段推进

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 版本说明

- **v1.0（2026-07-25）**：按 `YYC3-UI-1~8` 等目录整迁的三阶段计划（合计 ~17 万文件 / 27 小时）。
- **v2.0（2026-11-03）**：因误将 `YYC-Cube/personal/YYC3-Knowledge-Base` 当作唯一知识库，判定「v1 源目录消失」，重定界为 personal 副本五块素材。
- **v2.1（2026-11-03，本版）**：用户指正真实路径后勘误——v1 引用的源在**主库 `/Users/yanyu/YYC3-Knowledge-Base` 中全部存在**（实测十池 632,382 文件）。本版确立**双源结构**与**权威副本策略**，新增 Phase 2「主库普查与权威副本甄别」，后续阶段顺延为 Phase 3~7。完整证据见《[YYC3-组件库-迁移实况评估报告 v2.0.0](docs/YYC3-项目组件-拆分规范/YYC3-组件库-迁移实况评估报告.md)》。

| v1 断言 | 主库实测（2026-11-03） |
| --- | --- |
| UI-1~8 合计 ~15 万文件 | 十池（含漏列的 UI-9 与 YYC3-UI）合计 **632,382**，且 419/482 项目名有 ≥2 副本 |
| UI-8 = 0 文件 | 实有 40,256，且是**组件库建设工作区**（设计系统/monorepo/复用组件/拆分规范） |
| 按 27 小时整迁 | 不可行；改为去重 + 权威副本 + 组件级抽取 |

---

## 一、当前状态总表（2026-11-03 定版）

### 1.1 存量域包盘点（实测；搬运期主体已完成，来源已溯源至主库 UI 池大型应用）

| 域包 | src 文件 | 测试 | 状态 | 下一步归属 |
| --- | ---: | ---: | --- | --- |
| ai | 1,512 | 19 | ✅ 已迁入（← AI-Digital-Consulting-Website 等） | Phase 1 固化 |
| music | 417 | 2 | ✅ 已迁入（← YYC3-Music/D-Music-e 等） | Phase 1 固化 |
| admin | 279 | 3 | ✅ 已迁入（← 双导管理等） | Phase 1 固化 |
| medical | 120 | 0 | ✅ 已迁入 | Phase 1 固化（补测试） |
| design | 67 | 0 | ✅ 已迁入 | Phase 1 固化（补测试） |
| ui | 66 | 0 | ✅ 基础完成 | Phase 4 承接 Claw UI |
| education | 62 | 4 | ✅ 已迁入（← YYC-Learning-Hub 等） | Phase 1 固化 |
| financial | 32 | 0 | ✅ 已迁入 | Phase 1 固化（补测试） |
| cloud | 27 | 0 | ✅ 已迁入 | Phase 1 固化（补测试） |
| city | 19 | 0 | ✅ 已迁入 | Phase 1 固化（补测试） |
| layouts | 6 | 0 | ✅ 完成 | Phase 7 裁决 karbon 归属 |
| theme | 1 | 0 | 🚧 起步 | Phase 4 承接 theme-tokens |
| business / effects / icons | 0 | 0 | ⬜ 空壳 | Phase 7 评估去留 |
| **合计** | **2,629** | **28** | — | — |

### 1.2 配套资产

- `stories/`：10 域 stories 齐备 ✅；脚手架遗留示例待清理（Phase 1）
- `apps/`、`templates/`：空目录，Phase 7 落地
- 治理：git ✅（远程 `YYC-Cube/YYC3-Component-Library`，底册已登记，PR #1 已合并）；分支保护 ⬜（Phase 0）

---

## 二、迁移源清单（v2.1 双源结构，唯一有效口径）

> **G9 铁律（绝对路径）**：此后一切文档与脚本书写迁移源必须用绝对路径并注明副本身份。库中存在两个同名异体知识库（主库与 personal 副本，inode 不同），拉错即全盘误判（本次教训）。

### 2.1 源 A｜主库十池（主要源：已迁内容的来源池 + 剩余大规模自研素材）

**路径**：`/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI{,-1..-9}`（非 git，实测 632,382 文件）

**结构定性**：UI/UI-1/UI-6/UI-9 = 同一集合四份先后快照；UI-4/UI-5 = 孪生；UI-2 = node_modules 占 92.3%；UI-3 = 策展版归档（01-Core/02-UI-Applications/…）；UI-8 = **组件库建设工作区**；UI-9 = **最全终版快照 + 独有增量**。

**使用方式**：**组件级、按需、永不整迁**。v1 的业务域→项目映射（音乐/AI/医疗/管理商务/教育/城市/金融）保留为抽取索引。

**权威副本策略**（每项目指定唯一权威副本）：优先级 **UI-9（最全）＞ UI-8（组件库工作区）＞ UI-6/UI-1/UI（历史快照，仅差异比对）＞ UI-4/UI-5（孪生二选一）**；UI-3 策展版按需参考。去重依据：419/482 项目名 ≥2 副本（含 YanYu-DeepStack ×7、Music-Player ×7、zuoyou-crm ×5、M98-Music ×4）。

**优先评估项**：UI-8 内 `YYC3-UI-Design-System`（5,616 文件）、`yyc3-monorepo`、`yyc3-reusable-components`（463）、`YYC3-组件拆分规范/`（5 篇迁移规范 md）——组件库主题密度最高。

**剔除清单（永不入分母）**：node_modules 合计 95,316；上游快照（yyc-joomla ×4、code-skills ×3、音效系统 ×2、nvidia ×3、nuxt-commerce、libunity、setup-scripts、r8152、New Components-shadcn）；`Mcp-Edge` 教学资源包；`GitHub-API/` 七仓；`初始化组件库/`（42 项中 41 项与 UI 池重复的 Figma Make 种子快照，唯一独有 `YYC3-Nexus-Portal` 单独评估）。

### 2.2 源 B｜personal 副本五块（精准素材，沿 v2.0 定义）

**路径**：`/Users/yanyu/YYC-Cube/personal/YYC3-Knowledge-Base/YYC3-UI-用户界面/`（git，main 与远端分叉 ahead 1 / behind 2，批量搬运前建议库主对齐）

| # | 素材 | 规模（实测） | 目标位置 | 阶段 |
| --- | --- | --- | --- | --- |
| S1 | `Button/components/yyc3/`（Claw UI） | 15 文件 / 7,735 行 | 组件 → packages/ui；theme-tokens → theme；showcase → stories | Phase 4 |
| S2 | `Button/components/ui/`（shadcn 拷贝） | 56 tsx | 与 packages/ui 逐件 diff（D1） | Phase 5 |
| S3 | `web-ui/src/`（@yyc3/web-ui） | 15 源文件（36 构建产物不迁） | 独立 packages/web-ui；@yyc3/core 过 D2 | Phase 6 |
| S4 | `archived-components/karbon-navigation/` | 9 文件 | D3 留/弃 | Phase 7 |
| S5 | `Button/docs/`（设计系统文档） | 6 篇 | docs/ 设计规范区 | Phase 4 |

⚠️ personal 副本内 `YYC3-D/` 与 `YYC3-UI-用户界面/` 同名目录完全重复，禁用。

### 2.3 铁律汇总

1. 迁移源一律**绝对路径 + 副本身份**（G9）；
2. 主库**组件级按需抽取，永不整迁**；每批迁移记录源路径与（如适用）源 commit；
3. 严格按**权威副本映射表**（Phase 2 产出）取材，跨副本只做比对不做搬运；
4. 剔除清单（§2.1）永不入分母；
5. 一切变更**分支 + PR**，禁直推 main；
6. v1 全文存于 git 历史（b9d614f）可查，不再追踪。

---

## 三、七阶段推进计划

> 工时为净投入估算；每阶段验收标准对应《YYC3-项目验收-闭环体系》相关分册，最终以《YYC3-全局验收-闭环提示》收口。

### Phase 0｜治理收尾（0.5h）

| 任务 | 验收 |
| --- | --- |
| GitHub 配置 main 分支保护（禁直推、PR 必审） | 保护规则生效 |
| 补跑 Mimosa 完整安全扫描（两次提交均 scanner_enobufs 未完成） | 完整扫描结论落档 |

### Phase 1｜存量固化（1~2 天）——冻结新增搬运，先让 12 域「可构建、可测试、可追溯」

| 任务 | 验收 |
| --- | --- |
| `pnpm install` + `pnpm build`（turbo 全量）首次跑通，修红 | build 全绿 |
| `pnpm test` 建立基线，11 个零测试域按《YYC3-组件测试-验收标准》补最小冒烟测试 | 每域 ≥1 测试文件 |
| 根 README 包状态表更新至覆盖全部 15 域 | 表与 §1.1 一致 |
| 各域包补最小 README（标注来源项目） | 15/15 覆盖 |
| stories/ 脚手架遗留示例清理归位 | 无游离示例文件 |

### Phase 2｜主库普查与权威副本甄别（1~2 天，本版新增）——此后一切抽取的强制输入

| 任务 | 验收 |
| --- | --- |
| 脚本生成十池 depth-1 项目清单与副本矩阵（419 个 ≥2 副本名全列） | 副本矩阵表落档 |
| 按权威副本优先级（UI-9＞UI-8＞UI-6/1/UI＞UI-4/5）逐项目指定权威副本，标记差异候选 | **权威副本映射表** v1.0 发布（docs/） |
| UI-8 组件库工作区专项评估（设计系统/monorepo/复用组件/拆分规范 5 篇） | 评估结论 + 并入建议清单 |
| `初始化组件库/YYC3-Nexus-Portal` 独有资产评估 | 去留结论留档 |
| 应用 NM 与剔除清单过滤器（抽取脚本前置） | 过滤规则入库（scripts/） |

### Phase 3~7｜精准迁移与落地（沿 v2.0 的 Phase 2~6，编号顺延）

| 阶段 | 内容 | 工时 | 验收 |
| --- | --- | --- | --- |
| Phase 3 | **Claw UI 与设计文档**（S1 → packages/ui + theme；S5 → docs/）；双主题 Storybook 演示 | 0.5~1 天 | 构建绿 + story + 标规校验 |
| Phase 4 | **shadcn 拷贝去重**（S2 ×56 逐件 diff，决策门 D1：补入/跳过/择优） | 0.5 天 | 56 行 diff 清单留档 |
| Phase 5 | **web-ui 与 core 决策**（D2：a 迁入 packages/core【推荐】/ b 跨仓引用 / c 暂缓仅迁无依赖件；S3 15 源文件清洗迁入；5 hooks 补单测） | 1 天 | D2 裁决 + 构建绿 |
| Phase 6 | **归档裁决**（D3：karbon-navigation vs layouts） | 0.5 天 | 裁决留档 |
| Phase 7 | **应用落地与发包**（apps/storybook 门户 + playground；templates；changesets 演练；business/effects/icons 去留；终验） | 持续 | 闭环提示词通过 |

**主库抽取（Phase 2 映射表就绪后滚动进行，不计入上表固定工时）**：按业务域从权威副本抽取可复用组件，逐批走 §四 SOP；首批建议：UI-8 的 yyc3-reusable-components 与 YYC3-UI-Design-System。

**总净投入估算：约 5~7 个工作日**（Phase 0~7）+ 主库抽取滚动工作量。

---

## 四、单批迁移检查清单（修订版，随 PR 勾选）

- [ ] 源绝对路径 + 副本身份确认（G9；主库项须对照权威副本映射表）
- [ ] 构建产物清洗（.js/.d.ts/.map/node_modules 不随迁）
- [ ] 与既有包 diff 去重（D1 决策留档）
- [ ] 导入路径改写 + index.ts 导出更新
- [ ] 测试补齐（至少冒烟级）
- [ ] Storybook story 补充
- [ ] `pnpm build && pnpm test` 全绿
- [ ] 文档回写（包 README / 本计划 §1.1 / 变更历史）
- [ ] 分支 + PR 合入（禁直推）

---

## 五、状态追踪约定

- 本文件 §1.1 状态表为**唯一进度事实源**，每合入一个阶段 PR 即回写；
- 细粒度执行视图见《YYC3-组件拆分-推进流程图》状态总览表；
- v1/v2.0 全文存于 git 历史，不再维护。

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.0.0 | 2026-07-25 | 初版：YYC3-UI-1~8 三阶段整迁计划（源在主库中真实存在，但数字过时且策略不可行） | YYC³ Team |
| v2.0.0 | 2026-11-03 | 依（勘误前的）评估报告重写：迁移源误定界为 personal 副本五块素材；存量 12 域定版；六阶段计划 | YYC³ Team |
| v2.1.0 | 2026-11-03 | 依评估报告 v2.0.0 勘误修订：确立双源结构（主库十池按需抽取 + personal 五块）；权威副本策略（UI-9＞UI-8＞…）；新增 Phase 2 普查甄别，原阶段顺延为 3~7；G9 绝对路径铁律 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

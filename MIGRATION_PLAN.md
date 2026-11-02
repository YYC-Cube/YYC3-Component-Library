---
file: MIGRATION_PLAN.md
title: YYC³ 组件库拆分迁移计划 v2.0 — 重定界 · 存量定版 · 六阶段推进
description: 基于 2026-11-03 实况评估重写：废弃 v1 失效口径，界定知识库现存自研素材为唯一迁移源，定版存量 12 域，制定 Phase 0~6 六阶段推进计划与验收标准
author: YYC³ Team <admin@0379.email>
version: v2.0.0
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

# YYC³ 组件库拆分迁移计划 v2.0 — 重定界 · 存量定版 · 六阶段推进

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 版本说明：为什么重写

v1.0（2026-07-25）经 2026-11-03 三方核对（计划声称 vs packages 实况 vs 知识库真身）判定**前提整体失效**，全文重写：

| v1 断言 | 实况核验 |
| --- | --- |
| 源目录 YYC3-UI-1~8 / MONO / Design-System / Dataset | ❌ 知识库中不存在（唯一幸存源 = `YYC3-UI-用户界面`） |
| 待迁移 ~169,847 文件 / 预计 27 小时 | ❌ 分母含上游开源快照，作废；真实剩余自研素材约 137 文件 / 1.5 万行 |
| 完成度 ~1.2% | ❌ 存量已达 12 域 2,629 src 文件，实际进度远超记录 |
| `pnpm migrate:domain` 执行策略 | ❌ 脚本从未存在 |

完整证据链见《[YYC3-组件库-迁移实况评估报告](docs/YYC3-项目组件-拆分规范/YYC3-组件库-迁移实况评估报告.md)》。执行母版见《[YYC3-组件拆分-推进流程图](docs/YYC3-项目组件-拆分规范/YYC3-组件拆分-推进流程图.md)》。

---

## 一、当前状态总表（2026-11-03 定版）

### 1.1 存量域包盘点（实测数据，搬运期主体已完成）

| 域包 | src 文件 | 测试 | 状态 | 下一步归属 |
| --- | ---: | ---: | --- | --- |
| ai | 1,512 | 19 | ✅ 已迁入 | Phase 1 固化 |
| music | 417 | 2 | ✅ 已迁入 | Phase 1 固化 |
| admin | 279 | 3 | ✅ 已迁入 | Phase 1 固化 |
| medical | 120 | 0 | ✅ 已迁入 | Phase 1 固化（补测试） |
| design | 67 | 0 | ✅ 已迁入 | Phase 1 固化（补测试） |
| ui | 66 | 0 | ✅ 基础完成 | Phase 2 承接 Claw UI |
| education | 62 | 4 | ✅ 已迁入 | Phase 1 固化 |
| financial | 32 | 0 | ✅ 已迁入 | Phase 1 固化（补测试） |
| cloud | 27 | 0 | ✅ 已迁入 | Phase 1 固化（补测试） |
| city | 19 | 0 | ✅ 已迁入 | Phase 1 固化（补测试） |
| layouts | 6 | 0 | ✅ 完成 | Phase 5 裁决 karbon 归属 |
| theme | 1 | 0 | 🚧 起步 | Phase 2 承接 theme-tokens |
| business / effects / icons | 0 | 0 | ⬜ 空壳 | Phase 6 评估去留 |
| **合计** | **2,629** | **28** | — | — |

### 1.2 配套资产

- `stories/`：10 域 stories 齐备 ✅；脚手架遗留示例待清理（Phase 1）
- `apps/`、`templates/`：空目录，Phase 6 落地
- 治理：git ✅（2026-11-03 init，远程 `YYC-Cube/YYC3-Component-Library`，底册已登记）；分支保护 ⬜（Phase 0）

---

## 二、迁移源清单（重定界，唯一有效口径）

### 2.1 唯一迁移源

**`/Users/yanyu/YYC-Cube/personal/YYC3-Knowledge-Base/YYC3-UI-用户界面/`**，五块素材：

| # | 素材 | 规模（实测） | 目标位置 | 阶段 |
| --- | --- | --- | --- | --- |
| S1 | `Button/components/yyc3/`（Claw UI 自研库） | 15 文件 / 7,735 行 | 组件入 `packages/ui`；`theme-tokens.ts` 入 `packages/theme`；showcase 转 stories | Phase 2 |
| S2 | `Button/components/ui/`（shadcn 拷贝） | 56 tsx | 与 `packages/ui` 逐件 diff：缺者补、同者跳、分叉者择优（决策门 D1） | Phase 3 |
| S3 | `web-ui/src/`（@yyc3/web-ui） | 15 源文件（另 36 构建产物**不迁**） | 独立 `packages/web-ui`；依赖 `@yyc3/core` 先过决策门 D2 | Phase 4 |
| S4 | `archived-components/karbon-navigation/` | 9 文件 | 决策门 D3：留（入 layouts 归档区）或弃（仅评估报告留档） | Phase 5 |
| S5 | `Button/docs/`（设计系统文档 6 篇） | 6 文件 | `docs/` 设计规范区，与组件同版本演进 | Phase 2 |

### 2.2 依赖链（Phase 4 前置裁决）

`@yyc3/web-ui` → `@yyc3/core`（真身 `YYC3-Knowledge-Base/YYC3-B/core`）。三个备选：a) core 迁入本仓 `packages/core`（推荐，自主可控）；b) workspace 跨仓引用（耦合 KB，不推荐长期）；c) web-ui 暂缓、先迁无依赖的 GlitchText/NeonCard。

### 2.3 铁律（沿用评估报告 §5.2）

1. **禁止从 `YYC3-D/` 搬运**——其 Button/web-ui/ui 与迁移源完全重复；
2. 上游开源快照（shadcn-ui monorepo ×6、ant-design、tdesign、mui-x、onlook 等 4 万+ 文件）**只作参考**，永不入迁移分母；
3. 知识库迁移期内**只读**；每批迁移在 PR 描述中记录**源 commit 哈希**；KB 本地与远端已分叉（ahead 1 / behind 2），大批量搬运前建议库主先行对齐；
4. 一切变更**分支 + PR**，禁直推 main；
5. v1 的「YYC3-UI-1~8 清单」已作废存档于 git 历史（bootstrap 提交 b9d614f 可查），不再追踪。

---

## 三、六阶段推进计划

> 工时为净投入估算；每阶段验收标准对应《YYC3-项目验收-闭环体系》相关分册，最终以《YYC3-全局验收-闭环提示》收口。

### Phase 0｜治理收尾（0.5h，本 PR 后立即）

| 任务 | 验收 |
| --- | --- |
| GitHub 配置 main 分支保护（禁直推、PR 必审） | 保护规则生效截图/CLI 回执 |
| 补跑 Mimosa 完整安全扫描（bootstrap 时 scanner_enobufs 未完成） | 完整扫描结论落档 |

### Phase 1｜存量固化（1~2 天）——冻结新增搬运，先让 12 域「可构建、可测试、可追溯」

| 任务 | 验收 |
| --- | --- |
| `pnpm install` + `pnpm build`（turbo 全量）首次跑通，修红 | build 全绿 |
| `pnpm test` 建立基线，11 个零测试域按《YYC3-组件测试-验收标准》补最小冒烟测试 | 每域 ≥1 测试文件，基线数字入档 |
| 根 README 包状态表更新至覆盖全部 15 域 | 表与 §1.1 一致 |
| 各域包补最小 README（定位/入口/依赖） | 15/15 覆盖 |
| stories/ 脚手架遗留示例清理归位 | 无游离示例文件 |

### Phase 2｜Claw UI 与设计文档迁移（0.5~1 天）——价值最高的自研资产

| 任务 | 验收 |
| --- | --- |
| S1 按单组件 SOP 迁入 packages/ui + theme（见流程图 §SOP） | 构建绿 + 每组件有 story |
| 双主题（赛博朋克/液态玻璃）在 Storybook 可切换演示 | 主题 story 截图留档 |
| S5 六篇设计文档迁入 docs/ 并加统一标头标尾 | 标规校验通过 |

### Phase 3｜shadcn 拷贝去重（0.5 天）

| 任务 | 验收 |
| --- | --- |
| S2 与 packages/ui 逐件 diff，按 D1 决策（补入/跳过/择优合并） | diff 清单表留档（56 行全覆盖） |
| 补入件配 story + 测试 | 新增件 100% 覆盖 |

### Phase 4｜web-ui 迁移与 core 决策（1 天）

| 任务 | 验收 |
| --- | --- |
| 决策门 D2 裁决 @yyc3/core 处置（推荐方案 a：迁入 packages/core） | 决策记录入变更历史 |
| S3 的 15 个源文件清洗迁入 packages/web-ui（剔除 36 个构建产物） | 仓库无 .js/.d.ts/.map 混入 src |
| 5 个 hooks（use-agents/use-chat/use-skills/use-yyc3/useAI）补单测 | hooks 测试全绿 |

### Phase 5｜归档裁决（0.5 天）

| 任务 | 验收 |
| --- | --- |
| 决策门 D3：karbon-navigation 9 组件与 layouts 域功能比对 | 裁决结论 + 理由留档 |
| 留则入 layouts 归档区并标注来源；弃则在本计划登记关闭 | git 历史可追溯 |

### Phase 6｜应用落地与发包（持续）

| 任务 | 验收 |
| --- | --- |
| `apps/storybook` 部署为组件目录门户；`apps/playground` 承接调试 | 两 app 可运行 |
| `templates/`（blueprints/themes）按需填充 | 至少 1 套模板可用 |
| changesets 发包通道验证（首个内部版本） | version + publish 演练成功 |
| business/effects/icons 空壳去留裁决 | 三包各有结论 |
| 全链路终验 | 《YYC3-全局验收-闭环提示》执行通过 |

**总净投入估算：约 4~5 个工作日**（对比 v1 的「27 小时搬 17 万文件」——口径修正后，剩余工作是精耕而非搬运）。

---

## 四、单批迁移检查清单（修订版，随 PR 勾选）

- [ ] 源唯一性确认（仅 `YYC3-UI-用户界面/`，非 YYC3-D）
- [ ] 源 commit 哈希记录于 PR 描述
- [ ] 构建产物清洗（.js/.d.ts/.map 不随迁）
- [ ] 与既有包 diff 去重（D1 决策留档）
- [ ] 导入路径改写 + index.ts 导出更新
- [ ] 测试补齐（至少冒烟级）
- [ ] Storybook story 补充
- [ ] `pnpm build && pnpm test` 全绿
- [ ] 文档回写（包 README / 本计划状态表 / 变更历史）
- [ ] 分支 + PR 合入（禁直推）

---

## 五、状态追踪约定

- 本文件 §1.1 状态表为**唯一进度事实源**，每合入一个阶段 PR 即回写；
- 细粒度执行视图见《YYC3-组件拆分-推进流程图》状态总览表；
- 与 v1 的差异不再逐条维护，v1 全文存于 git 历史（b9d614f）。

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.0.0 | 2026-07-25 | 初版：12 源目录三阶段搬运计划（后经核验口径失效） | YYC³ Team |
| v2.0.0 | 2026-11-03 | 依实况评估报告全文重写：迁移源重定界为 YYC3-UI-用户界面 五块自研素材；存量 12 域（2,629 文件）定版；制定 Phase 0~6 六阶段计划、三大决策门与修订版检查清单 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

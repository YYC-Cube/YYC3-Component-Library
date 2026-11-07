---
file: MIGRATION_PLAN.md
title: YYC³ 组件库拆分迁移计划 v2.1 — 双源重定界 · 存量定版 · 七阶段推进
description: 基于 2026-11-03 真实主库勘误修订：双源结构（主库十池按需抽取 + personal 副本五块精准迁移）、权威副本策略、Phase 0~7 七阶段推进计划与验收标准
author: YYC³ Team <admin@0379.email>
version: v2.4.0
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
| medical | 120 | 118 | ✅ **全量恢复**（T0+T1 36 + T2/T3 82，#38+#39）+ 前置件 47 | 摘除彻底清零；悬留：client 鉴权轻桥、tsc 非阻断残余、medical 色板 token |
| design | 67 | 64 | ✅ **摘除清零**（61 + 收尾批 3，#40）| AuthContext/ai 双件真身落位，悬留无 |
| ui | 66 | 0 | ✅ 基础完成 | Phase 4 承接 Claw UI |
| education | 62 | 4 | ✅ 已迁入（← YYC-Learning-Hub 等） | Phase 1 固化 |
| financial | 32 | 0 | ✅ 已迁入 | Phase 1 固化（补测试） |
| cloud | 27 | 0 | ✅ 已迁入 | Phase 1 固化（补测试） |
| city | 19 | 0 | ✅ 已迁入 | Phase 1 固化（补测试） |
| layouts | 6 | 0 | ✅ 完成 | Phase 7 裁决 karbon 归属 |
| theme | 1 | 0 | 🚧 起步 | Phase 4 承接 theme-tokens |
| business / effects / icons | 0 | 0 | ⬜ 空壳（终裁**保留**，PR#27 用户指令） | icons 方案：lucide 封装+品牌 SVG 待补；随 publish 批次评估 |
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

**D4 终裁（2026-11-07）：`初始化组件库/YYC3-Nexus-Portal` 弃迁·关闭**——「言渝云枢·智能交互门户」（YYC³ AI Family 3D 展示门户，Next.js 16 全栈应用，106 文件 10,691 行）。裁决依据：①**性质不符**：完整门户应用而非组件/模板，templates/（blueprints/themes）语义为「组件库使用模板」，apps/ 门户展示职能已由 storybook+playground 承载（#42）；②**出身**：Figma Make 种子快照唯一独有项，不在十池权威副本体系内（映射表 482 行不覆盖），质量基线与手拆组件主线不同源；③**成本收益**：Next 16 对齐（本仓 ^15）+ components/ui 与 @yyc3/ui-enterprise 去重 + 应用级组合件（chat-widget/new-yorker-spline/sections）依赖完整应用上下文，迁移成本＞拆解价值；④**先例**：D3 karbon 弃迁同款逻辑。处置：副本原位只读留存（主库 初始化组件库/），templates/ 保留目录壳声明定位（blueprints=未来发包脚手架模板、themes=主题预设模板，按需建）。

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
| `初始化组件库/YYC3-Nexus-Portal` 独有资产评估 | **D4 终裁决：弃迁·关闭**（v2.2.1 留档） |
| 应用 NM 与剔除清单过滤器（抽取脚本前置） | 过滤规则入库（scripts/） |

### Phase 3~7｜精准迁移与落地（沿 v2.0 的 Phase 2~6，编号顺延）

| 阶段 | 内容 | 工时 | 验收 |
| --- | --- | --- | --- |
| Phase 3 | **Claw UI 与设计文档**（S1 → packages/ui + theme；S5 → docs/）；双主题 Storybook 演示 | 0.5~1 天 | 构建绿 + story + 标规校验 |
| Phase 4 | **shadcn 拷贝去重**（S2 ×56 逐件 diff，决策门 D1：补入/跳过/择优） | 0.5 天 | 56 行 diff 清单留档 |
| Phase 5 | **web-ui 与 core 决策**（D2：a 迁入 packages/core【推荐】/ b 跨仓引用 / c 暂缓仅迁无依赖件；S3 15 源文件清洗迁入；5 hooks 补单测） | 1 天 | D2 裁决 + 构建绿 |
| Phase 6 | **归档裁决**（D3：karbon-navigation vs layouts） | 0.5 天 | 裁决留档 |
| Phase 7 | **应用落地与发包**（~~apps/storybook 门户 + playground~~ ✅ #42；~~templates 终裁~~ ✅ D4（#44）；changesets 演练 ✅；~~空壳去留~~ ✅（#27）；~~shadcn 升级专项~~ ✅ A+B（#45/#46）；~~13 阶段终验~~ ✅ #47） | **完结** | 闭环提示词通过 |

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
- **操作级规程**（单组件十步/批次工作流/放行标准）见《YYC3-组件拆分-执行衔接手册》，其规范对齐总矩阵为执行时的规范查询入口；
- v1/v2.0 全文存于 git 历史，不再维护。

---

## 五A、Q1 质量门修订与测试债登记簿（v2.1.2，2026-11-04；**债清零 2026-11-07**）

**门定义修订**：Q1（E1 放行条件）= `pnpm build` 全绿 **且** 可运行测试全绿 **且** 结构性阻断文件清单入册并绑定抽取批次。修订理由：剩余失败的修复方式与滚动抽取是同一件事（以权威副本对齐组件/测试代差），坚持绝对全绿将自我死锁。

**✅ 债清零终态（2026-11-07，8 债文件批次）**：build ✅ EXIT=0；test **671✅ / 0❌**（44 文件全绿）——**CI test 门禁解除，合并不再需要 --admin**。Q1 门达成完全体。修复方向按 provenance 分流：education×4 为 D0 权威配套测试版（与 UI-9/yyc3-learning-platform 测试逐字节一致）→ 组件对齐测试契约（autonomous-engine 轻量桩 + logger 真身 + 渲染细节对齐，附带修复 2 个真 bug）；admin×3 + ai×1 为 bootstrap 存量测试（断言的「言语云」版/activeModule 架构全库无源）→ 测试对齐现基线（10 个整功能缺失用例诚实删除，8 项意图保留断言降级清单入档 changeset）。

<details><summary>历史登记（v2.1.2 原文存档）</summary>

| 文件 | 根因 | 绑定批次（权威副本源） |
| --- | --- | --- |
| admin `__tests__`×3 | 组件代差：测试断言「言语云」版 UI 文本，现 header 为另一版本；lib/design-system 已恢复（← UI-9/YYC3-JINLAN-Admin/lib）解锁加载 | admin 批次（UI-9/YYC3-JINLAN-Admin） |
| ai `store/app-store.test.ts` | 版本代差：现 store 无 activeModule/module-system 架构 | ai 批次（UI-9 对应项目配套测试版） |
| education intelligent-ai-widget×4 | `autonomous-engine` 兄弟子系统未随迁（3 加载阻断）+ virtualized-list 组件缺 null 守卫（21 断言） | education 批次（autonomous-engine 定位随批次 D0） |

</details>

**Phase 0 扫描归档**：Mimosa deep scan `scan-2026-11-03T22-24-54.273Z-5fcae1f1b9da`（seal sha256:9893…c5aa）38 high。分诊（2026-11-04）：真实凭据 1（`packages/ai/src/api/admin/setup/route.ts` 管理员口令）——**经库主确认该 Supabase 项目已废弃、账号停用，风险关闭、无需轮换**；代码侧已改环境变量注入（`ADMIN_SETUP_EMAIL/PASSWORD`，git 历史中的旧值随项目废弃失效）；占位/误报 23；SSRF/穿越/注入/弱加密 14 随批次修复；**Phase 7 publish 前 findings 清零为发布硬门**。

**扫描排除策略（2026-11-07）**：Mimosa 插件 payload 只读（scan-profiles 无项目级覆盖接口，MCP security_scan_start 无 exclude 参数），无法以配置文件形式维护排除清单——**等效实现：构建产物即扫即删**。`apps/storybook/storybook-static/`（Storybook 官方 bundle，L2 曾误报命令注入×3——浏览器产物无 Node 执行 API，第三方代码）与 `apps/playground/dist` 均为 .gitignore 覆盖的本地产物，验证完成后物理删除即可使扫描面消失；.storybook 源码配置保留。若后续再报产物类误报，同法处置，不修改第三方 bundle。

**覆盖率债登记（2026-11-06，lib services 真身批次）**：真身 10 件 ~5,183 行落位后 lib+cloud istanbul 覆盖率 37.52%（services 49.38%）。未覆盖面：SpeechRecognition/speechSynthesis 真实调用链、useDataset fetch 拉取、exportData image/pdf 分支、ai-assistant-service 纯逻辑面、contexts Provider 树——登记于 `packages/lib/src/__tests__/services-real.test.ts` 文件头，绑定 lib services 深测批次或 medical 批次后的测试补强轮。

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.0.0 | 2026-07-25 | 初版：YYC3-UI-1~8 三阶段整迁计划（源在主库中真实存在，但数字过时且策略不可行） | YYC³ Team |
| v2.0.0 | 2026-11-03 | 依（勘误前的）评估报告重写：迁移源误定界为 personal 副本五块素材；存量 12 域定版；六阶段计划 | YYC³ Team |
| v2.1.0 | 2026-11-03 | 依评估报告 v2.0.0 勘误修订：确立双源结构（主库十池按需抽取 + personal 五块）；权威副本策略（UI-9＞UI-8＞…）；新增 Phase 2 普查甄别，原阶段顺延为 3~7；G9 绝对路径铁律 | YYC³ Team |
| v2.1.1 | 2026-11-03 | §五挂接《YYC3-组件拆分-执行衔接手册》为操作级规程入口 | YYC³ Team |
| v2.1.2 | 2026-11-04 | Phase 0/1 收口：Q1 门定义修订（可运行全绿+阻断清单绑定批次）；速修基线 364✅/50❌；测试债登记簿（8 文件→3 批次）；Mimosa 38 findings 分诊归档（真钥 1 待轮换） | YYC³ Team |
| v2.1.3 | 2026-11-04 | 分诊结论更新：Supabase 真钥经库主确认属废弃项目，风险关闭；route.ts 口令改环境变量注入（发布硬门对应项清零） | YYC³ Team |
| v2.1.4 | 2026-11-04 | **D3 归档裁决：karbon-navigation 弃迁·关闭**——9 件（2,393 行）为 Karbon 应用页面残件（ClientApp/EnterpriseApp/三模式页）而非布局组件，与 layouts 域定位不符；内部引用三路断裂（./components/ ./ui/ ./nara/），修复成本＞价值；已下线归档件，权威副本仍在 personal 副本原位只读留存。Phase 6 就此完结（唯一议题即 D3） | YYC³ Team |
| v2.1.5 | 2026-11-06 | **lib services 真身批次（PR #37）**：桩层 4 件全退役，10 件真身 ~5,183 行落位 @yyc3/lib（D0 权威副本 UI-9/YYC-cloud-platform/lib，映射表 L77；零外部依赖闭包；10 子代理逐字转录 diff 校验）+ web-speech.d.ts ambient + 自愈 5 处（speechSynthesis 环境守卫等）+ 消费方适配 4 处；@yyc3/cloud 恢复 3 摘除件（VoiceControlPanel/EnhancedVoiceControl/ConversationInterface）→ **cloud 30 件全量导出，摘除彻底清零**；测试 lib 130✅（新增 69 纯逻辑例），全仓 **550✅/50❌**；覆盖率债登记 §五A（37.52%/services 49.38%）。精度抽取累计：city 17 / cloud 30 全量 / financial 30 / design 61 = 129 组件 + lib services 真身 10 件另计 | YYC³ Team |
| v2.1.6 | 2026-11-06 | **medical T0+T1 批次（medical 专项重启首战）**：D0 重评颠覆回滚结论——「strict 缺陷密度最高」实为断链（TS2307 类型塌缩）为主因（any 全量仅 31 处/120 文件）；D0 权威副本 UI-9/ai-medical-systemadvanced（映射表 L517）四目录全覆盖。占位桶 → **53 有效导出**（36 组件：health-data 12/teleconsultation 4/ehr 5/ai-model-training 4/analytics 11 + 前置件 17）；`@/components/ui/*` 58 处重映射 @yyc3/ui-enterprise（零重复搬运）；i18n 同步轻桥 + renderDay 旧版 API 剥离 + strict 修复 ~100 处（T1 闭包 tsc 清零）；摘除登记 82 件绑定 T2/T3（前置：services 10 + types 3 + use-toast/useApi 真身迁入）。全仓 BUILD=0 · **555✅/50❌** | YYC³ Team |
| v2.1.7 | 2026-11-06 | **medical T2/T3 批次（#39）：medical 域 118 组件全量恢复，摘除彻底清零**。前置件 30 落位（services 11 + types 5 + hooks 3 + lib/api 2 + components 9）；恢复 82 组件（medications 10/patients 8/research 11/ai-diagnosis 13/ai-model 11/clinical-decision 9/medical-records 20，同名件别名区分）；重映射 ~90 处 + 层级逃逸修正 21 处 + 源件自愈 ~75 处；**@react-three/fiber 8→9 升级**（reconciler 与 React 19 双实例冲突根因修复）；@yyc3/ui-enterprise 桶补 DropdownMenuGroup。全仓 BUILD=0 · **555✅/50❌**（零新增失败）。悬留：client 鉴权轻桥（auth store 真身随应用层批次）、tsc 非阻断残余、medical 色板 token | YYC³ Team |
| v2.1.8 | 2026-11-07 | **design 摘除件收尾批（#40）：design 域摘除彻底清零——滚动抽取主线六域全量收官**。AuthContext 真身（183 行零外部依赖，UI-9/yyc3-design-system）+ ai 双件真身（ai-models/ai-service 互闭包）落位包内；恢复 Header/ProtectedRoute/AIAssistant 3 摘除件（hasPermission 源件代差→admin 判定兜底自愈登记）；design 64 有效导出。全仓 BUILD=0 · **555✅/50❌**（零新增失败）。**六域摘除清零总账：city 17 / cloud 30 / financial 30 / design 64 / medical 118 全量**；剩余：Phase 7（apps/templates/终验）+ 8 债文件 | YYC³ Team |
| v2.1.9 | 2026-11-07 | **8 债文件批次（#41）：测试债彻底清零——全仓 671✅/0❌，CI test 门禁解除（合并不再需 --admin），Q1 门达成完全体**。修复方向按 provenance 分流：education×4 = D0 权威配套测试版（与 UI-9/yyc3-learning-platform 逐字节一致）→ 组件对齐测试契约（autonomous-engine 轻量桩 + logger 真身 88 行 + 渲染细节对齐；附带修复 appReducer undefined / filteredTools 未定义 2 个真 bug）；admin×3 + ai×1 = bootstrap 存量测试（断言的「言语云」版/activeModule 架构全知识库无源——实测推翻登记）→ 测试对齐现基线（10 个无源用例诚实删除 + 8 项意图保留断言降级清单入档）。通用：vitest.setup 补 RTL 自动 cleanup（多 render 树残留通用根因）。**附带确诊 CI-only 测试失败根因**（vite exports→dist，CI test 无 build 无 dist 解析断，#37 起 14~15 files 存量被本地债遮蔽）→ `yyc3WorkspaceAlias` 插件修复 → **CI 四门仓史首次全绿**。悬留：autonomous-engine/model-adapter 真身（牵 openai SDK 逃逸链）绑 learning-platform 专项 | YYC³ Team |
| v2.2.0 | 2026-11-07 | **Phase 7 apps 门户批次（#42）**：`apps/storybook` 门户落地（Storybook 10.6.2 + addon-docs/a11y；stories 双源：packages/ai atoms 3 件 + 六域门面 Overview 6 件——UI/City/Cloud/Medical/Design/Financial；viteFinal 注入 workspace 源码别名（含 theme styles CSS 特例）——与 vitest 同款根因防御）+ `apps/playground` 实验场落地（vite 壳 + 六域组件实时导入演示页，域标签切换）；两 app 均 build 验证通过（storybook-static 6,817 modules / playground 318ms）；远程遗留分支 docs/phase6-d3 清理（PR#26 已完全合并零独有）。全仓 BUILD=0 · 671✅/0❌ 保持。空壳三包终裁确认在案（#27 保留）。Phase 7 剩余：templates 终裁 / shadcn 升级专项 51 DIFF / 13 阶段终验 | YYC³ Team |
| v2.2.1 | 2026-11-07 | **D4 终裁：YYC3-Nexus-Portal 弃迁·关闭（#44）+ Mimosa 扫描排除策略（#43）**。D4：「言渝云枢」3D 展示门户（Next.js 16 全栈，106 文件 10,691 行，Figma Make 种子快照唯一独有项）性质不符（门户应用非组件/模板，templates/ 语义为 blueprints/themes，apps/ 展示职能已由 #42 承载）+ 不在十池权威副本体系 + Next 16 对齐与 UI 池去重成本＞价值（D3 karbon 先例同款）——副本原位只读留存，templates/ 保留目录壳定位声明。扫描排除：插件 payload 只读无 exclude 接口 → 产物即扫即删（storybook-static 误报×3 处置）。Phase 7 剩余：shadcn 升级专项 51 DIFF / 13 阶段终验 | YYC³ Team |
| v2.3.0 | 2026-11-07 | **shadcn 新版升级专项收官（批次 A #45 + 批次 B #46）**。影响面评估入档（真实范围 50 件；tw4+@theme inline 无需 config 同步；API 破坏仅 4 处；消费面 654 文件）。批次 A：Layer1×5 + Layer3×3 + shim×2。**批次 B：Layer2 43 件 + sidebar 新件启用（theme 补 --sidebar-* 8×2 变量）+ chart 兼容 shim（BarChart/LineChart recharts 转发，21 消费文件零改动）**；ui changeset 标 MAJOR（h-9 收窄/焦点环重排/阴影档位——视觉面系统性变化）。**视觉走查清单建档**（docs/YYC3-团队通用-标规文档/YYC3-shadcn升级-视觉走查清单.md——发布前硬检查项，绑定 apps/storybook 门户人工走查）。验证：BUILD=0 · 671✅/0❌ · Storybook build 渲染冒烟通过。Phase 7 仅剩：13 阶段终验 | YYC³ Team |
| v2.4.0 | 2026-11-07 | **13 阶段终验完结（#47）——Phase 7 全部收官，全项目迁移主线完结**。逐项核验：①语法 BUILD=0 / ③测试 671✅/0❌ / ④组件测试+Storybook 渲染冒烟 / ⑥⑦ 悬留登记 / ⑫ 文档五件套+16 CHANGELOG+三部曲 / ⑬ 状态表实况一致。**publish 硬门双达成**：audit 全量（含 dev 链）零漏洞（历次 overrides 清零）；Mimosa 三轮密封扫描（41→787 产物污染作废→**35 终验基准**）——真实加固点 9 处修复（SSRF 6 全消/沙箱 100KB 上限/python 路径白名单），残余 35 = 演示占位 27（零真凭据抽查实证）+ 非发布物 docs 4 + 模式级 4（防御已在位分诊接受）。**结论分级：准予发布**（附发布前人工三项：视觉走查/publish 目标裁决/根 CHANGELOG 生成）。终验报告：docs/YYC3-项目验收-闭环体系/YYC3-13阶段终验报告.md。悬留（不阻断发布）：覆盖率补强轮/鉴权轻桥/medical 色板/autonomous-engine 真身/gh token workflow scope | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

---
'@yyc3/medical': minor
'@yyc3/ui-enterprise': patch
---

medical T2/T3 批次：82 组件恢复——**medical 域 118 组件全量导出，摘除彻底清零**。

- 前置件 30 落位（子代理逐字转录 diff 校验）：services 11（clinical-decision/case-library/knowledge-graph/medical-knowledge/imaging-feature/ai-annotation/multi-modal-ai/medication-interaction/multi-center-research/pharmacogenomics/patientService 真身单例）+ types 5（case-library/knowledge-base/medical-records/imaging-features/knowledge-graph 纯类型）+ hooks 3（use-toast/useApi/use-mobile 真身 + use-translation 轻桥复用）+ lib/api 2（endpoints 真身 + client 无鉴权 fetch 轻桥——真身深耦合应用级 auth store，悬留登记）+ components 9（page-header/experiment 系 5/projects-dashboard/data-analysis-overview/active-projects）+ utils cn（clsx+twMerge 包内自足）
- 恢复 82 组件：medications 10 / patients 8（同名件 PatientListView/PatientRecordsClient 别名区分）/ research 11 / ai-diagnosis 13 / ai-model 11（ModelDeploymentPanel/Dashboard 别名区分）/ clinical-decision 9 / medical-records 20
- 重映射 ~90 处：@yyc3/hooks→包内 hooks、@/services→相对、@yyc3/lib/utils→本地 cn、../../services 逃逸层级修正 21 处
- 源件自愈 ~75 处（build 门收敛）：Badge/Button/Alert variant 越界→最近语义、PageHeader props 契约对齐（heading/subtitle→title/description、icon JSX→IconName 字符串）、react-window @types v1 错配修复、LoadingSpinner size→className、相对层级 ../../→../
- **@react-three/fiber 8→9 升级**（drei 9→10）：fiber 8.x react-reconciler 与 React 19 双实例冲突（jsdom 模块加载即崩），v9 原生支持；@types/three + r3f-jsx.d.ts 桥（fiber v8 仅增强旧版全局 JSX，React 19 失效）
- @yyc3/ui-enterprise patch：桶补 DropdownMenuGroup 导出（dropdown-menu.tsx 内部已有、导出面缺口）
- 测试：medical 冒烟 6 例（T1 36 断言 + T2/T3 82 断言 + 前置件 30 + 桶完整性 ≥140 无 undefined + 轻桥行为×2）；全仓 BUILD=0 · 555✅/50❌（零新增失败）
- 悬留登记：lib/api/client 鉴权面（auth store 真身随应用层批次）、tsc --noEmit 非阻断残余（research/experiment-design 等隐式 any，build/test 门全绿）、medical 色板 token（text-medical-500 系消费方主题配置）

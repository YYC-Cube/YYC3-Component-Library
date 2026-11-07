---
'@yyc3/medical': minor
---

medical T0+T1 批次：占位桶 → 53 有效导出，medical 专项重启首战。

D0 重评颠覆回滚结论：strict「缺陷密度最高」实为断链（TS2307 类型塌缩）为主因——any 全量仅 31 处/120 文件（0.26/文件，低密度）；D0 权威副本 UI-9/ai-medical-systemadvanced（映射表 L517）services/types/components/hooks 四目录全覆盖断链需求。

- 恢复 36 组件：health-data 12（零断链组）/ teleconsultation 4 / ehr 5 / ai-model-training 4 / analytics 11
- 前置件 17 落位：components 15（error-boundary/upcoming-consultations/ehr 系/consultation-room/teleconsultation-dashboard/ehr-dashboard/analytics 系 5 件）+ hooks（use-real-time-data 真身 + use-translation 同步轻桥）+ utils（client-utils）
- 桥接登记：`@/components/ui/*` 58 处重映射至 @yyc3/ui-enterprise（Phase 4 活基线裁决，零重复搬运；ui 包本就有 DatePicker）；i18n 真身依赖双 context 未迁，按消费面建同步轻桥（真身 t 为 async 源件 JSX 直用属缺陷风格）；schedule-client renderDay 依赖 react-day-picker 旧版 API 剥离（v9 不支持）；DateRangePicker 消费方对齐 ui 真实签名
- strict 修复 ~100 处（useState 泛型/回调 any/Badge variant 越界/Treemap ratio→aspectRatio/useRealTimeData 签名对齐），T1 闭包 tsc 清零
- 依赖声明：next/recharts/lucide-react/@yyc3/lib 落位（next 为 client 包装层所需，design 包先例）
- 摘除登记 82 件（T2/T3 批次）：medications 10 / patients 8 / research 11 / ai-diagnosis 13 / ai-model 11 / clinical-decision 9 / medical-records 20——前置：services 10 + types 3 + use-toast/useApi 真身迁入
- 测试：冒烟 6 例（分组导出断言 + 摘除隔离断言 + 轻桥行为）；全仓 BUILD=0 · 555✅/50❌（50❌ 全在册）

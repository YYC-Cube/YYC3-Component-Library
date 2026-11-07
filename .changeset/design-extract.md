---
'@yyc3/design': minor
---

Phase 7 精度抽取第四批：design 域 61 组件恢复有效导出（占位桶→全量，63 src 摘 3 件）。断链修复：@/components/{charts,layout} 同包自愈 3 处；ProtectedRoute/header（AuthContext）+ AIAssistant（ai-service/ai-models）3 件摘除登记（待 lib contexts/services 批次）；@yyc3/hooks/use-toast→@yyc3/ui-enterprise、@yyc3/lib/design-system 同源件随迁至 design/lib（priority 定义补 bgColor/borderColor）、task-management getProgressColor 内联、EnhancedProgress/InteractiveProgress/EnhancedButton/EnhancedCard 降级映射至 ui 标准件（variant/size/icon 扩展 prop 剥离登记）；sampleTranslations 类型标注。@iconify/react 依赖补声明。ui 桶补导出 shadcn Sidebar 全族。测试 0→2 全绿（导出面 61 守恒+摘除确认+KPITracking 渲染含 ResizeObserver polyfill）。源：主库设计类项目 + UI-8 Design-System 并入评估（D0）。

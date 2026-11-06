---
'@yyc3/design': minor
---

design 摘除件收尾批：Header/ProtectedRoute/AIAssistant 恢复 + AuthContext/ai 双件真身落位——**design 域摘除彻底清零，滚动抽取主线六域全量收官**。

- AuthContext 真身（183 行，D0 UI-9/yyc3-design-system，零外部依赖纯 Context）迁入包内 contexts/；AuthProvider/useAuth/User 桶导出（User 补 export 一行适配）
- ai 双件真身（ai-models 124 + ai-service 105，互闭包零外部依赖）迁入包内 lib/；AIAssistant 恢复导出 + aiService/AI_MODELS 等桶导出
- 恢复 3 摘除件：Header（useAuth user/logout 消费）/ ProtectedRoute（hasPermission 源件代差→admin 判定兜底，自愈登记）/ AIAssistant（此前摘除登记）
- 测试：design 冒烟 2/2 全绿（摘除隔离断言反转为恢复断言）；全仓 BUILD=0 · 555✅/50❌（零新增失败）

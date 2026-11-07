---
'@yyc3/financial': minor
---

Phase 7 精度抽取第三批：financial 域 30 组件恢复有效导出（占位桶→全量，DTS 5.3KB）。断链修复：./ui/* 16 子件→@yyc3/ui-enterprise 桶（29 文件批量改写）；DataMarket i18n 字典 zh/en realtime 段补 provider 键（源字典缺陷）。@yyc3/ui-enterprise 补导出 shadcn Sidebar 全族 23 导出（DashboardLayout 消费）。渲染级遗留登记：Header/Dashboard/MarketCharts 依赖源项目 nav/config 未随迁（config 补齐为批次遗留）。测试 0→3 全绿。源：主库 AI-Financial-Quantitative-Platform 权威副本（D0）。

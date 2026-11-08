---
'@yyc3/lib': minor
'@yyc3/education': minor
'@yyc3/medical': minor
'@yyc3/financial': minor
'@yyc3/business': minor
---

J4 落地：industry-adapter（2571 行，99 区 D0 权威副本 SHA-256 6056c2a4…）域包化拆分，取消自建 @yyc3/adapters。core（24 行业类型全集 + 注册表 + 4 查询工具）上收 @yyc3/lib 的 adapters/industry（注册制：getIndustryConfig 未注册显式抛错，替代源实现的 yyc3-dc 静默回退）。8 行业配置自 D0 源程序化提取、逐字符一致：education(yyc3-edu)、medical(yyc3-med/yyc3-elder)、financial(yyc3-fn/yyc3-finance)、business(yyc3-retail/yyc3-ent 并入 retail、yyc3-manu 并入 manufacturing——retail/manufacturing 落点为 owner 2026-11-07 裁决)。其余 16 行业暂留 99 区 app 本地待域包扩容。三区副本（99 产出 / 11 archive×3 / 88 已清理）替换指引见 99 区 YYC3-技术架构-分类规划/。

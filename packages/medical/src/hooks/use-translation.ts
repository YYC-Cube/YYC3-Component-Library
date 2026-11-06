// ============================================================
// YYC³ · @yyc3/medical i18n 轻桥（medical T0+T1 批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/ai-medical-systemadvanced/hooks/use-translation.ts
// 桥接登记：真身依赖 language/auto-translation 双 context（本批未迁），
// 按消费面建同步轻桥——签名兼容 { t, tSync, locale, formatDate }；
// 真身 t 为 async（源件 JSX 直用属缺陷风格），桥为同步查表 + fallback。
// 悬留：双 context 真身随 T2/T3 批次迁入后可整替本桥。
// ============================================================
"use client"

/** 内置字典（zh-CN 主词条，覆盖 T1 组件消费面） */
const zhCN: Record<string, string> = {
  predictionAnalysis: "预测分析",
  predictionAnalysisDescription: "基于历史数据的疾病风险预测模型",
  chart: "图表",
  settings: "设置",
  modelType: "模型类型",
  predictionHorizon: "预测周期",
  generatePrediction: "生成预测",
  riskLevel: "风险等级",
  confidence: "置信度",
  recommendations: "建议",
  trendReports: "趋势报告",
  patientSatisfaction: "患者满意度",
  readmissionRate: "再入院率",
  treatmentEffectiveness: "治疗效果",
}

export interface TranslationBridge {
  /** 同步查表翻译：字典 → fallback → key */
  t: (key: string, fallback?: string) => string
  /** 同步翻译（真身兼容别名） */
  tSync: (key: string, fallback?: string) => string
  locale: string
  formatDate: (date: Date | string | number) => string
}

export function useTranslation(): TranslationBridge {
  const t = (key: string, fallback?: string): string => zhCN[key] ?? fallback ?? key

  const formatDate = (date: Date | string | number): string => {
    const d = new Date(date)
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  }

  return { t, tSync: t, locale: "zh-CN", formatDate }
}

// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// @File    : industry.ts · 金融域行业适配模块 · @yyc3/financial / adapters
// @Source  : D0 权威副本 99 区 apps/yyc3-futuristic-dashboard/lib/industry-adapter.ts
//            （SHA-256 6056c2a4…，2571 行，三区同源：99 产出 / 11 archive×3 / 88 已清理）
// @Scope   : J4 落地首批——金融域 2 行业（yyc3-fn 股票金融 / yyc3-finance 金融科技）上收
// @Created : 2026-11-07  @Updated : 2026-11-07  @Version : 1.0.0
// ============================================================

import { registerIndustryConfigs } from '@yyc3/lib'
import type { IndustryConfig, IndustryConfigRegistry, IndustryType } from '@yyc3/lib'

/** 金融域行业配置（yyc3-fn、yyc3-finance · 自 D0 源一字不差搬移） */
export const FINANCIAL_INDUSTRY_CONFIGS: IndustryConfigRegistry = {
  "yyc3-fn": {
    id: "yyc3-fn",
    code: "FN",
    name: "股票金融",
    icon: "TrendingUp",
    description: "股票交易与风险管理",
    primaryColor: "emerald",
    metrics: [
      {
        id: "trading-volume",
        name: "交易量",
        unit: "万手",
        normalRange: [100, 500],
        criticalThreshold: 50,
        icon: "BarChart3",
        category: "business",
      },
      {
        id: "market-volatility",
        name: "市场波动率",
        unit: "%",
        normalRange: [10, 30],
        criticalThreshold: 50,
        icon: "Activity",
        category: "business",
      },
      {
        id: "risk-score",
        name: "风险评分",
        unit: "分",
        normalRange: [0, 50],
        criticalThreshold: 80,
        icon: "AlertTriangle",
        category: "security",
      },
      {
        id: "execution-speed",
        name: "执行速度",
        unit: "ms",
        normalRange: [1, 10],
        criticalThreshold: 50,
        icon: "Zap",
        category: "performance",
      },
    ],
    dashboardLayout: {
      widgets: [],
      refreshInterval: 1000,
      alertPriority: ["security", "business", "performance"],
    },
    aiModels: [
      {
        id: "price-prediction",
        name: "价格预测",
        type: "prediction",
        enabled: true,
        parameters: { horizon: 24, confidence: 0.82 },
      },
      {
        id: "risk-assessment",
        name: "风险评估",
        type: "classification",
        enabled: true,
        parameters: { threshold: 0.9 },
      },
    ],
    highPerformance: {
      maxThroughput: 100000,
      targetLatency: 5,
      cacheStrategy: "aggressive",
    },
    highAvailability: {
      targetUptime: 99.99,
      failoverTime: 5,
      backupStrategy: "realtime",
    },
    highSecurity: {
      encryptionLevel: "advanced",
      authMethod: "biometric",
      complianceStandards: ["SOC2", "ISO27001", "PCI-DSS"],
    },
    highIntelligence: {
      aiCapabilities: ["价格预测", "风险评估", "算法交易"],
      predictionAccuracy: 0.82,
      autoDecisionLevel: "auto",
    },
    highEfficiency: {
      automationLevel: 95,
      resourceOptimization: true,
      costReductionTarget: 30,
    },
    standards: {
      apiVersion: "v2.0",
      dataFormat: "protobuf",
      monitoringProtocol: "prometheus",
      serviceLevel: "platinum",
    },
  },

  "yyc3-finance": {
    id: "yyc3-finance",
    code: "FINANCE",
    name: "金融科技",
    icon: "DollarSign",
    description: "交易监控与风险管理",
    primaryColor: "green",
    metrics: [
      {
        id: "transaction-volume",
        name: "交易量",
        unit: "笔/秒",
        normalRange: [100, 1000],
        criticalThreshold: 2000,
        icon: "TrendingUp",
        category: "business",
      },
      {
        id: "fraud-score",
        name: "欺诈风险评分",
        unit: "分",
        normalRange: [0, 30],
        criticalThreshold: 70,
        icon: "AlertTriangle",
        category: "security",
      },
      {
        id: "system-latency",
        name: "系统延迟",
        unit: "ms",
        normalRange: [10, 50],
        criticalThreshold: 200,
        icon: "Clock",
        category: "performance",
      },
      {
        id: "compliance-score",
        name: "合规评分",
        unit: "%",
        normalRange: [95, 100],
        criticalThreshold: 85,
        icon: "Shield",
        category: "security",
      },
    ],
    dashboardLayout: {
      widgets: [],
      refreshInterval: 1000,
      alertPriority: ["security", "business", "performance"],
    },
    aiModels: [
      {
        id: "fraud-detection",
        name: "欺诈检测",
        type: "classification",
        enabled: true,
        parameters: { threshold: 0.85, realtime: true },
      },
      {
        id: "risk-assessment",
        name: "风险评估",
        type: "prediction",
        enabled: true,
        parameters: { horizon: 1, confidence: 0.92 },
      },
    ],
    highPerformance: {
      maxThroughput: 50000,
      targetLatency: 50,
      cacheStrategy: "aggressive",
    },
    highAvailability: {
      targetUptime: 99.95,
      failoverTime: 10,
      backupStrategy: "realtime",
    },
    highSecurity: {
      encryptionLevel: "advanced",
      authMethod: "biometric",
      complianceStandards: ["SOC2", "ISO27001", "PCI-DSS"],
    },
    highIntelligence: {
      aiCapabilities: ["欺诈检测", "风险评估", "智能交易"],
      predictionAccuracy: 0.87,
      autoDecisionLevel: "auto",
    },
    highEfficiency: {
      automationLevel: 95,
      resourceOptimization: true,
      costReductionTarget: 30,
    },
    standards: {
      apiVersion: "v2.0",
      dataFormat: "protobuf",
      monitoringProtocol: "prometheus",
      serviceLevel: "platinum",
    },
  },
}

// 副作用注册：import 本模块即完成本域配置入册（见文件头 @Scope）
registerIndustryConfigs(FINANCIAL_INDUSTRY_CONFIGS)

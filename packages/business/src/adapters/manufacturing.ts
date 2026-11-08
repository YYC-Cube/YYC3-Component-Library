// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// @File    : manufacturing.ts · 制造域行业适配模块 · @yyc3/business / adapters
// @Source  : D0 权威副本 99 区 apps/yyc3-futuristic-dashboard/lib/industry-adapter.ts
//            （SHA-256 6056c2a4…，2571 行，三区同源：99 产出 / 11 archive×3 / 88 已清理）
// @Scope   : J4 落地首批——制造域 1 行业（yyc3-manu 智慧制造）上收；owner 裁决并入 business
// @Created : 2026-11-07  @Updated : 2026-11-07  @Version : 1.0.0
// ============================================================

import { registerIndustryConfigs } from '@yyc3/lib'
import type { IndustryConfig, IndustryConfigRegistry, IndustryType } from '@yyc3/lib'

/** 制造域行业配置（yyc3-manu · 自 D0 源一字不差搬移） */
export const MANUFACTURING_INDUSTRY_CONFIGS: IndustryConfigRegistry = {
  "yyc3-manu": {
    id: "yyc3-manu",
    code: "MANU",
    name: "智能制造",
    icon: "Factory",
    description: "生产线监控与质量管理",
    primaryColor: "orange",
    metrics: [
      {
        id: "production-rate",
        name: "生产速率",
        unit: "件/小时",
        normalRange: [100, 500],
        criticalThreshold: 50,
        icon: "Package",
        category: "business",
      },
      {
        id: "quality-rate",
        name: "良品率",
        unit: "%",
        normalRange: [95, 100],
        criticalThreshold: 90,
        icon: "CheckCircle",
        category: "business",
      },
      {
        id: "equipment-efficiency",
        name: "设备综合效率",
        unit: "%",
        normalRange: [75, 95],
        criticalThreshold: 60,
        icon: "Gauge",
        category: "performance",
      },
      {
        id: "energy-per-unit",
        name: "单位能耗",
        unit: "kWh/件",
        normalRange: [0.5, 2.0],
        criticalThreshold: 3.0,
        icon: "Zap",
        category: "operations",
      },
    ],
    dashboardLayout: {
      widgets: [],
      refreshInterval: 2000,
      alertPriority: ["business", "performance", "operations"],
    },
    aiModels: [
      {
        id: "quality-prediction",
        name: "质量预测",
        type: "prediction",
        enabled: true,
        parameters: { horizon: 24, confidence: 0.88 },
      },
      {
        id: "maintenance-optimization",
        name: "维护优化",
        type: "optimization",
        enabled: true,
        parameters: { strategy: "predictive" },
      },
    ],
    highPerformance: {
      maxThroughput: 10000,
      targetLatency: 100,
      cacheStrategy: "moderate",
    },
    highAvailability: {
      targetUptime: 99.9,
      failoverTime: 30,
      backupStrategy: "hourly",
    },
    highSecurity: {
      encryptionLevel: "standard",
      authMethod: "mfa",
      complianceStandards: ["ISO27001"],
    },
    highIntelligence: {
      aiCapabilities: ["质量预测", "维护优化", "智能调度"],
      predictionAccuracy: 0.85,
      autoDecisionLevel: "suggest",
    },
    highEfficiency: {
      automationLevel: 75,
      resourceOptimization: true,
      costReductionTarget: 20,
    },
    standards: {
      apiVersion: "v1.0",
      dataFormat: "json",
      monitoringProtocol: "prometheus",
      serviceLevel: "silver",
    },
  },
}

// 副作用注册：import 本模块即完成本域配置入册（见文件头 @Scope）
registerIndustryConfigs(MANUFACTURING_INDUSTRY_CONFIGS)

// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// @File    : index.ts · 行业适配 core 桶（类型 + 注册表）
// @Module  : @yyc3/lib / adapters.industry
// @Scope   : 域包配置见 @yyc3/{education,medical,financial,business} 各自
//            src/adapters/——本 core 不持任何行业配置（注册制）
// @Created : 2026-11-07  @Updated : 2026-11-07  @Version : 1.0.0
// ============================================================

export {
  registerIndustryConfigs,
  getIndustryConfig,
  getAllIndustries,
  generateIndustryMetrics,
  getIndustryHighScores,
  getIndustryStandards,
} from './registry'

export type {
  IndustryType,
  IndustryDomain,
  IndustryConfig,
  IndustryConfigRegistry,
  IndustryHighScores,
  IndustryMetric,
  DashboardLayout,
  WidgetConfig,
  AIModelConfig,
  PerformanceConfig,
  AvailabilityConfig,
  SecurityConfig,
  IntelligenceConfig,
  EfficiencyConfig,
  StandardsConfig,
} from './types'

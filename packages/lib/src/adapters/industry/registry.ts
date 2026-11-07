// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// @File    : registry.ts · 行业配置注册表与查询工具
// @Module  : @yyc3/lib / adapters.industry
// @Source  : D0 权威副本 99 区 industry-adapter.ts 工具函数段（L2501-2571）照搬
// @Diff    : 与 99 区源实现的语义差异（有意为之，替换指引已注明）：
//            ① 配置不再单库全量持有，改为各域包 registerIndustryConfigs 增量注册；
//            ② getIndustryConfig 未注册时由「回退 yyc3-dc」改为显式抛错
//              （core 不持 yyc3-dc 配置，静默回退会掩盖域包未引入的接线缺陷）。
// @Created : 2026-11-07  @Updated : 2026-11-07  @Version : 1.0.0
// ============================================================

import type {
  IndustryConfig,
  IndustryConfigRegistry,
  IndustryHighScores,
  IndustryType,
  StandardsConfig,
} from './types'

/** 全局注册表（模块级单例；各域包 import 即注册） */
const INDUSTRY_REGISTRY: IndustryConfigRegistry = {}

/**
 * 注册行业配置（域包模块顶层调用；同 id 重复注册视为接线缺陷，直接抛错）
 */
export function registerIndustryConfigs(entries: IndustryConfigRegistry): void {
  for (const key of Object.keys(entries) as IndustryType[]) {
    const config = entries[key]
    if (!config) continue
    if (INDUSTRY_REGISTRY[key]) {
      throw new Error(
        `[yyc3] Industry config duplicated on register: ${key}（检查是否多个域包误注册同一行业）`,
      )
    }
    INDUSTRY_REGISTRY[key] = config
  }
}

/**
 * 获取行业配置（未注册即抛错——与 99 区源「回退 yyc3-dc」不同，见文件头 @Diff）
 */
export function getIndustryConfig(industry: IndustryType): IndustryConfig {
  const config = INDUSTRY_REGISTRY[industry]
  if (!config) {
    throw new Error(
      `[yyc3] Industry config not registered: ${industry}（确认对应域包已安装并已 import）`,
    )
  }
  return config
}

/**
 * 获取所有已注册行业列表
 */
export function getAllIndustries(): IndustryConfig[] {
  return Object.values(INDUSTRY_REGISTRY)
}

/**
 * 根据行业生成定制化指标（仪表盘演示数据生成 · 与 D0 源同逻辑；
 * 非加密、非安全用途，不承载任何鉴权/令牌职责）
 */
export function generateIndustryMetrics(industry: IndustryType): Record<string, number> {
  const config = getIndustryConfig(industry)
  const metrics: Record<string, number> = {}

  config.metrics.forEach((metric) => {
    const [min, max] = metric.normalRange
    const value = Math.floor(Math.random() * (max - min) + min)
    metrics[metric.id] = value
  })

  return metrics
}

/**
 * 获取行业的五高评分
 */
export function getIndustryHighScores(industry: IndustryType): IndustryHighScores {
  const config = getIndustryConfig(industry)

  return {
    performance: Math.round((config.highPerformance.maxThroughput / 100000) * 100),
    availability: config.highAvailability.targetUptime,
    security:
      config.highSecurity.encryptionLevel === "advanced"
        ? 95
        : config.highSecurity.encryptionLevel === "standard"
          ? 80
          : 65,
    intelligence: Math.round(config.highIntelligence.predictionAccuracy * 100),
    efficiency: config.highEfficiency.automationLevel,
  }
}

/**
 * 获取行业标准化配置
 */
export function getIndustryStandards(industry: IndustryType): StandardsConfig {
  const config = getIndustryConfig(industry)
  return config.standards
}

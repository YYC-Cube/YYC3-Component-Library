// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// @File    : types.ts · 行业适配核心类型（五高五标五化）
// @Module  : @yyc3/lib / adapters.industry
// @Source  : D0 权威副本 99 区 apps/yyc3-futuristic-dashboard/lib/industry-adapter.ts
//            （SHA-256 6056c2a4…，2571 行，三区同源：99 产出 / 11 archive×3 / 88 已清理）
// @Scope   : J4 落地——类型全集随 core 上收，行业配置按域分装 4 域包
//            （取消自建 @yyc3/adapters，改由域包承载——owner 裁决 2026-11-07）
// @Created : 2026-11-07  @Updated : 2026-11-07  @Version : 1.0.0
// ============================================================

/**
 * 行业类型全集（24 行业 · 与 D0 源一字不差）
 * 标注 ◆ 者为本批已上收正仓域包的 8 行业；其余 16 行业暂留 99 区 app 本地，
 * 待对应域包扩容时分批上收（替换指引见 99 区 YYC3-技术架构-分类规划/）。
 */
export type IndustryType =
  | "yyc3-agr" // 智慧农业
  | "yyc3-fb" // 餐饮服务
  | "yyc3-fn" // 股票金融 ◆ @yyc3/financial
  | "yyc3-gov" // 智慧城市
  | "yyc3-hr" // 人力资源
  | "yyc3-med" // 医疗健康 ◆ @yyc3/medical
  | "yyc3-media" // 媒体娱乐
  | "yyc3-manu" // 智慧制造 ◆ @yyc3/business(manufacturing)
  | "yyc3-core" // 智能编程
  | "yyc3-cultural" // 智能文创
  | "yyc3-edu" // 智能教育 ◆ @yyc3/education
  | "yyc3-energy" // 能源管理
  | "yyc3-env" // 环境保护
  | "yyc3-law" // 法律服务
  | "yyc3-log" // 智慧物流
  | "yyc3-ent" // 实体经管 ◆ @yyc3/business(retail)
  | "yyc3-real" // 地产建筑
  | "yyc3-retail" // 智慧零售 ◆ @yyc3/business(retail)
  | "yyc3-traffic" // 智能交通
  | "yyc3-tourism" // 旅游酒店
  | "yyc3-elder" // 智慧养老 ◆ @yyc3/medical
  | "yyc3-api" // 技术集成
  | "yyc3-dc" // 数据中心
  | "yyc3-finance" // 金融科技 ◆ @yyc3/financial

/** 行业域归属（本批 4 落点 · owner 裁决 retail/manufacturing 并入 business） */
export type IndustryDomain = "education" | "medical" | "financial" | "business"

export interface IndustryConfig {
  id: IndustryType
  code: string // 标准化行业代码
  name: string
  icon: string
  description: string
  primaryColor: string
  metrics: IndustryMetric[]
  dashboardLayout: DashboardLayout
  aiModels: AIModelConfig[]
  // 五高架构配置
  highPerformance: PerformanceConfig
  highAvailability: AvailabilityConfig
  highSecurity: SecurityConfig
  highIntelligence: IntelligenceConfig
  highEfficiency: EfficiencyConfig
  // 五标体系配置
  standards: StandardsConfig
}

export interface IndustryMetric {
  id: string
  name: string
  unit: string
  normalRange: [number, number]
  criticalThreshold: number
  icon: string
  category: "performance" | "security" | "business" | "operations"
}

export interface DashboardLayout {
  widgets: WidgetConfig[]
  refreshInterval: number
  alertPriority: string[]
}

export interface WidgetConfig {
  id: string
  type: "chart" | "metric" | "alert" | "ai-insight" | "map"
  position: { x: number; y: number; w: number; h: number }
  config: Record<string, any>
}

export interface AIModelConfig {
  id: string
  name: string
  type: "prediction" | "anomaly" | "optimization" | "classification"
  enabled: boolean
  parameters: Record<string, any>
}

export interface PerformanceConfig {
  maxThroughput: number // 最大吞吐量
  targetLatency: number // 目标延迟(ms)
  cacheStrategy: "aggressive" | "moderate" | "minimal"
}

export interface AvailabilityConfig {
  targetUptime: number // 目标可用性(%)
  failoverTime: number // 故障转移时间(s)
  backupStrategy: "realtime" | "hourly" | "daily"
}

export interface SecurityConfig {
  encryptionLevel: "basic" | "standard" | "advanced"
  authMethod: "basic" | "mfa" | "biometric"
  complianceStandards: string[]
}

export interface IntelligenceConfig {
  aiCapabilities: string[]
  predictionAccuracy: number
  autoDecisionLevel: "none" | "suggest" | "auto"
}

export interface EfficiencyConfig {
  automationLevel: number // 自动化程度(%)
  resourceOptimization: boolean
  costReductionTarget: number // 成本降低目标(%)
}

export interface StandardsConfig {
  apiVersion: string
  dataFormat: "json" | "xml" | "protobuf"
  monitoringProtocol: "prometheus" | "grafana" | "custom"
  serviceLevel: "bronze" | "silver" | "gold" | "platinum"
}

/** 行业配置注册表形态（core 只持注册表，配置由各域包增量注册） */
export type IndustryConfigRegistry = Partial<Record<IndustryType, IndustryConfig>>

/** 五高评分（getIndustryHighScores 返回形态 · 与 D0 源一致） */
export interface IndustryHighScores {
  performance: number
  availability: number
  security: number
  intelligence: number
  efficiency: number
}

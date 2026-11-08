// ============================================================
// YYC³ · @yyc3/financial 桶文件（Phase 7 精度抽取·第三批恢复 2026-11-04）
// 来源（D0）：主库 AI-Financial-Quantitative-Platform 权威副本（30 组件）
// 断链修复：./ui/* → @yyc3/ui 桶（16 子件全覆盖，29 文件改写）
// 全部具名导出（无 default），零断链残留
// ============================================================

// ── 应用壳 ──
export { Header } from './Header'
export { Footer } from './Footer'
export { HeroSection } from './HeroSection'
export { DashboardLayout } from './DashboardLayout'
export { LoginPage } from './LoginPage'
export { SystemSettings } from './SystemSettings'

// ── 核心功能 ──
export { Dashboard } from './Dashboard'
export { CoreFeatures } from './CoreFeatures'
export { UseCases } from './UseCases'
export { AICopilot } from './AICopilot'
export { AISignals } from './AISignals'
export { AIModelFactory } from './AIModelFactory'
export { AIModelBacktesting } from './AIModelBacktesting'
export { AIModelMarket } from './AIModelMarket'

// ── 市场/数据 ──
export { MarketCharts } from './MarketCharts'
export { DataMarket } from './DataMarket'
export { DataManagement } from './DataManagement'
export { FactorMarket } from './FactorMarket'
export { TokenEconomy } from './TokenEconomy'
export { KnowledgeGraph } from './KnowledgeGraph'
export { BlockchainEcosystem } from './BlockchainEcosystem'

// ── 社区/内容 ──
export { CommunityCenter } from './CommunityCenter'
export { MembershipSection } from './MembershipSection'
export { NewsSection } from './NewsSection'
export { Partners } from './Partners'
export { Whitepaper } from './Whitepaper'
export { TechArchitecture } from './TechArchitecture'
export { FAQ } from './FAQ'
export { DeveloperPlatform } from './DeveloperPlatform'

// ── 通用件 ──
export { ImageWithFallback } from './figma/ImageWithFallback'

// ── 行业适配（J4 · 2026-11-07，源：99 区 industry-adapter D0 副本）──
export { FINANCIAL_INDUSTRY_CONFIGS } from './adapters/industry'

// ============================================================
// YYC³ · @yyc3/city 桶文件（Phase 7 精度抽取·首批恢复 2026-11-04）
// 来源（D0）：主库 YYC_Smart_City_Platform 权威副本；断链修复 10 处
// （@/components/* → 同包相对引用，全部自愈）
// 17 组件恢复有效导出；lucide-react/framer-motion 补依赖声明
// ============================================================

// 基础件
export { Breadcrumb } from './Breadcrumb'
export { Logo } from './Logo'
export { PageLoader } from './PageLoader'
export { DateTime } from './DateTime'
export { ThemeProvider } from './theme-provider'

// Modern 系（智慧城市视觉体系）
export { ModernButton } from './ModernButton'
export { ModernCard, ModernCardHeader, ModernCardContent, ModernCardFooter } from './ModernCard'
export { ModernInput } from './ModernInput'
export { ModernTabs } from './ModernTabs'
export { ModernNavigation } from './ModernNavigation'
export { ModernServiceZones } from './ModernServiceZones'

// 页面/功能件
export { SmartDashboard } from './SmartDashboard'
export { SmartRecommendations } from './SmartRecommendations'
export { default as InteractiveCardsPage } from './InteractiveCardsPage'
export { DataVisualization } from './DataVisualization'
export { CityVoiceBroadcast } from './CityVoiceBroadcast'
export { XiaoYuAssistant } from './XiaoYuAssistant'

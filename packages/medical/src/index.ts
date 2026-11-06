// ============================================================
// YYC³ · @yyc3/medical 桶文件（medical T0+T1 批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/ai-medical-systemadvanced/
// 本批：36 组件有效导出（health-data 12 / teleconsultation 4 / ehr 5 /
//       ai-model-training 4 / analytics 11）+ 前置件 17（components 15 + hooks 2 + utils 1）
// 摘除登记：medications 10 / patients 8 / research 11 / ai-diagnosis 13 /
//           ai-model 11 / clinical-decision 9 / medical-records 20（T2/T3 批次，前置：
//           services 10 + types 3 + use-toast 等真身迁入）
// ============================================================

// ── health-data（12，命名导出）──
export { HealthDataDashboard } from './health-data/dashboard'
export { DataImportClient } from './health-data/data-import-client'
export { HealthDataImport } from './health-data/data-import'
export { DataTrendsAnalysis } from './health-data/data-trends-analysis'
export { HealthDataClient } from './health-data/health-data-client'
export { PatientDataViewer } from './health-data/patient-data-viewer'
export { TestResultsClient } from './health-data/test-results-client'
export { TestResults } from './health-data/test-results'
export { TrendsAnalysisClient } from './health-data/trends-analysis-client'
export { TrendsAnalysis } from './health-data/trends-analysis'
export { VitalSignsClient } from './health-data/vital-signs-client'
export { VitalSigns } from './health-data/vital-signs'

// ── teleconsultation（4，default 导出）──
export { default as ExpertsClient } from './teleconsultation/experts-client'
export { default as RecordsClient } from './teleconsultation/records-client'
export { default as ScheduleClient } from './teleconsultation/schedule-client'
export { default as TeleconsultationClient } from './teleconsultation/teleconsultation-client'

// ── ehr（5，default 导出）──
export { default as EHRConnectionsClient } from './ehr/ehr-connections-client'
export { default as EHRIntegrationClient } from './ehr/ehr-integration-client'
export { default as EHRMappingClient } from './ehr/ehr-mapping-client'
export { default as EHRSettingsClient } from './ehr/ehr-settings-client'
export { default as EHRSyncClient } from './ehr/ehr-sync-client'

// ── ai-model-training（4，命名导出）──
export { ModelDeployment } from './ai-model-training/model-deployment'
export { ModelEvaluation } from './ai-model-training/model-evaluation'
export { ModelTrainingClient } from './ai-model-training/model-training-client'
export { ModelTrainingJobs } from './ai-model-training/model-training-jobs'

// ── analytics（11）──
export { AnalyticsDashboard } from './analytics/dashboard'
export { default as AnalyticsClient } from './analytics/analytics-client'
export { InteractiveCharts } from './analytics/interactive-charts'
export { PredictionModels } from './analytics/prediction-models'
export { default as PredictionModelsClient } from './analytics/prediction-models-client'
export { PredictionTool } from './analytics/prediction-tool'
export { TrendReports } from './analytics/trend-reports'
export { default as TrendReportsClient } from './analytics/trend-reports-client'
export { default as AdvancedCharts } from './analytics/advanced-charts'
export { default as DataComparison } from './analytics/data-comparison'
export { default as DashboardComponent } from './analytics/dashboard-component'

// ── 前置件（桥接组件/hooks，供包内组合与下游直接消费）──
export { ErrorBoundary } from './components/error-boundary'
export { UpcomingConsultations } from './components/upcoming-consultations'
export { EHRDataMapping } from './components/ehr-data-mapping'
export { EHRIntegrationStatus } from './components/ehr-integration-status'
export { ModelTrainingDashboard } from './components/model-training-dashboard'
export { ConsultationRoom } from './components/consultation-room'
export { TeleconsultationDashboard } from './components/teleconsultation-dashboard'
export { EHRDashboard } from './components/ehr-dashboard'
export { PredictionModels as ComponentAnalyticsPredictionModels } from './components/analytics/prediction-models'
export { PredictionTool as ComponentAnalyticsPredictionTool } from './components/analytics/prediction-tool'
export { TrendReports as ComponentAnalyticsTrendReports } from './components/analytics/trend-reports'
export { default as AnalyticsDashboardComponent } from './components/analytics/dashboard-component'
export { default as AdvancedChartsPanel } from './components/analytics/advanced-charts'
export { default as DataComparisonPanel } from './components/analytics/data-comparison'
export { InteractiveCharts as ComponentAnalyticsInteractiveCharts } from './components/analytics/interactive-charts'
export { useRealTimeData } from './hooks/use-real-time-data'
export { isClient } from './utils/client-utils'

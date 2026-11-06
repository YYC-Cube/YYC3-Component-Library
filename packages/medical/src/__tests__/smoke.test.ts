// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/medical 冒烟测试
// medical T0+T1 批次（2026-11-06）：占位空桶 → 53 有效导出
// （36 组件：health-data 12 / teleconsultation 4 / ehr 5 / ai-model-training 4 /
//   analytics 11；前置件 17：components 15 + hooks 1 + utils 1）
// 摘除登记（T2/T3 批次）：medications 10 / patients 8 / research 11 /
// ai-diagnosis 13 / ai-model 11 / clinical-decision 9 / medical-records 20
// ============================================================
import { describe, it, expect } from 'vitest'
import * as pkg from '../index'

describe('@yyc3/medical 冒烟（T0+T1）', () => {
  it('health-data 12 件导出存在', () => {
    for (const exp of [
      pkg.HealthDataDashboard, pkg.DataImportClient, pkg.HealthDataImport,
      pkg.DataTrendsAnalysis, pkg.HealthDataClient, pkg.PatientDataViewer,
      pkg.TestResultsClient, pkg.TestResults, pkg.TrendsAnalysisClient,
      pkg.TrendsAnalysis, pkg.VitalSignsClient, pkg.VitalSigns,
    ]) {
      expect(exp).toBeDefined()
    }
  })

  it('teleconsultation + ehr 9 件导出存在', () => {
    for (const exp of [
      pkg.ExpertsClient, pkg.RecordsClient, pkg.ScheduleClient, pkg.TeleconsultationClient,
      pkg.EHRConnectionsClient, pkg.EHRIntegrationClient, pkg.EHRMappingClient,
      pkg.EHRSettingsClient, pkg.EHRSyncClient,
    ]) {
      expect(exp).toBeDefined()
    }
  })

  it('ai-model-training + analytics 15 件导出存在', () => {
    for (const exp of [
      pkg.ModelDeployment, pkg.ModelEvaluation, pkg.ModelTrainingClient, pkg.ModelTrainingJobs,
      pkg.AnalyticsDashboard, pkg.AnalyticsClient, pkg.InteractiveCharts,
      pkg.PredictionModels, pkg.PredictionModelsClient, pkg.PredictionTool,
      pkg.TrendReports, pkg.TrendReportsClient, pkg.AdvancedCharts,
      pkg.DataComparison, pkg.DashboardComponent,
    ]) {
      expect(exp).toBeDefined()
    }
  })

  it('前置件 17 导出存在（桥接组件/hooks/utils）', () => {
    for (const exp of [
      pkg.ErrorBoundary, pkg.UpcomingConsultations, pkg.EHRDataMapping,
      pkg.EHRIntegrationStatus, pkg.ModelTrainingDashboard, pkg.ConsultationRoom,
      pkg.TeleconsultationDashboard, pkg.EHRDashboard,
      pkg.ComponentAnalyticsPredictionModels, pkg.ComponentAnalyticsPredictionTool,
      pkg.ComponentAnalyticsTrendReports, pkg.AnalyticsDashboardComponent,
      pkg.AdvancedChartsPanel, pkg.DataComparisonPanel, pkg.ComponentAnalyticsInteractiveCharts,
      pkg.useRealTimeData, pkg.isClient,
    ]) {
      expect(exp).toBeDefined()
    }
  })

  it('T2/T3 摘除件不应泄漏进桶', () => {
    for (const absent of ['MedicationInteractions', 'PatientList', 'ExperimentDesign', 'DiagnosisForm', 'DecisionSupportPanel', 'DicomViewer']) {
      expect((pkg as Record<string, unknown>)[absent]).toBeUndefined()
    }
  })

  it('useTranslation 轻桥同步可用（i18n 桥接登记）', async () => {
    const { useTranslation } = await import('../hooks/use-translation')
    const { t } = useTranslation()
    expect(t('predictionAnalysis')).toBe('预测分析')
    expect(t('nonexistent-key', '回退文案')).toBe('回退文案')
    expect(t('nonexistent-key')).toBe('nonexistent-key')
  })
})

// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）· @yyc3/medical 冒烟测试
// T0+T1（2026-11-06）+ T2/T3（2026-11-06）：118 组件全量恢复 + 前置件 47
// —— medical 域摘除彻底清零（120 src = 118 组件 + 2 行壳）
// ============================================================
import { describe, it, expect } from 'vitest'
import * as pkg from '../index'

describe('@yyc3/medical 冒烟（全量）', () => {
  it('T1 五组 36 件导出存在', () => {
    for (const exp of [
      pkg.HealthDataDashboard, pkg.DataImportClient, pkg.HealthDataImport,
      pkg.DataTrendsAnalysis, pkg.HealthDataClient, pkg.PatientDataViewer,
      pkg.TestResultsClient, pkg.TestResults, pkg.TrendsAnalysisClient,
      pkg.TrendsAnalysis, pkg.VitalSignsClient, pkg.VitalSigns,
      pkg.ExpertsClient, pkg.RecordsClient, pkg.ScheduleClient, pkg.TeleconsultationClient,
      pkg.EHRConnectionsClient, pkg.EHRIntegrationClient, pkg.EHRMappingClient,
      pkg.EHRSettingsClient, pkg.EHRSyncClient,
      pkg.ModelDeployment, pkg.ModelEvaluation, pkg.ModelTrainingClient, pkg.ModelTrainingJobs,
      pkg.AnalyticsDashboard, pkg.AnalyticsClient, pkg.InteractiveCharts,
      pkg.PredictionModels, pkg.PredictionModelsClient, pkg.PredictionTool,
      pkg.TrendReports, pkg.TrendReportsClient, pkg.AdvancedCharts,
      pkg.DataComparison, pkg.DashboardComponent,
    ]) {
      expect(exp).toBeDefined()
    }
  })

  it('T2 七组 82 件导出存在（medications/patients/research/ai-diagnosis/ai-model/clinical-decision/medical-records）', () => {
    for (const exp of [
      pkg.MedicationCatalog, pkg.MedicationCatalogClient, pkg.MedicationInteractions,
      pkg.MedicationInteractionsClient, pkg.MedicationInventory, pkg.MedicationInventoryClient,
      pkg.PharmacogenomicsAnalysis, pkg.PopularMedications, pkg.PrescriptionManagement,
      pkg.PrescriptionManagementClient,
      pkg.PatientList, pkg.PatientListView, pkg.AddPatientDialog, pkg.FollowupClient,
      pkg.PatientRecordsClient, pkg.PatientDetails, pkg.PatientGroupsClient, pkg.PatientNavigation,
      pkg.ActiveProjects, pkg.DataAnalysisOverview, pkg.ExperimentDesign, pkg.ExperimentDesignClient,
      pkg.MultiCenterCollaboration, pkg.ProjectDetails, pkg.ResearchProjectsDashboard,
      pkg.ResearchAnalysisClient, pkg.SampleManagement, pkg.SampleManagementClient, pkg.ResearchClient,
      pkg.AIDiagnosisClient, pkg.AIDiagnosisNavigation, pkg.DiagnosisBatch, pkg.DiagnosisClassification,
      pkg.DiagnosisComparison, pkg.DiagnosisExplainer, pkg.DiagnosisExport, pkg.DiagnosisForm,
      pkg.DiagnosisHistory, pkg.DiagnosisModelIntegration, pkg.DiagnosisRecordsClient,
      pkg.DiagnosisReview, pkg.DiagnosisStatistics,
      pkg.AIModelClient, pkg.ModelDeploymentPanel, pkg.ModelDeploymentDashboard, pkg.ModelIntegration,
      pkg.ModelManagement, pkg.ModelMonitoring, pkg.ModelNavigation, pkg.ModelOverview,
      pkg.ModelPerformance, pkg.ModelPerformanceClient, pkg.ModelVersionHistory,
      pkg.ClinicalDashboard, pkg.ClinicalGuidelinesClient, pkg.ClinicalPathwaysClient,
      pkg.ClinicalTreatmentsClient, pkg.DecisionSupportPanel, pkg.DiagnosticToolsClient,
      pkg.DrugReferenceClient, pkg.RecentCases, pkg.TreatmentRecommendations,
      pkg.MedicalViewer3D, pkg.AIAssistedAnnotation, pkg.AIDiagnosis, pkg.AIModelSelector,
      pkg.BatchProcessor, pkg.CrossModalAnalysis, pkg.DicomViewer, pkg.ImagingFeatureClient,
      pkg.ImagingFeatureReference, pkg.InteractiveImageAnnotation, pkg.KnowledgeBaseClient,
      pkg.KnowledgeButton, pkg.KnowledgeIntegration, pkg.MedicalImagingUploader,
      pkg.MedicalRecordsClient, pkg.ModalitySpecificAnalysis, pkg.MultiModalAIDiagnosis,
      pkg.OcrService, pkg.PrescriptionUploader, pkg.RecordAssociation,
    ]) {
      expect(exp).toBeDefined()
    }
  })

  it('前置件导出存在（桥接组件/hooks/services/utils）', () => {
    for (const exp of [
      pkg.ErrorBoundary, pkg.UpcomingConsultations, pkg.EHRDataMapping,
      pkg.EHRIntegrationStatus, pkg.ModelTrainingDashboard, pkg.ConsultationRoom,
      pkg.TeleconsultationDashboard, pkg.EHRDashboard, pkg.PageHeader,
      pkg.ExperimentFilterDrawer, pkg.ExperimentFilterTags, pkg.ExperimentTemplateManager,
      pkg.QuickFilterMenu, pkg.SaveAsTemplateDialog,
      pkg.useRealTimeData, pkg.isClient, pkg.useToast, pkg.useApi, pkg.useTranslation,
      pkg.clinicalDecisionService, pkg.caseLibraryService, pkg.medicalKnowledgeService,
      pkg.imagingFeatureService, pkg.knowledgeGraphService, pkg.aiAnnotationService,
      pkg.multiModalAIService, pkg.medicationInteractionService, pkg.multiCenterResearchService,
      pkg.patientService,
    ]) {
      expect(exp).toBeDefined()
    }
  })

  it('全量无 undefined 导出（桶完整性）', () => {
    const exports = Object.entries(pkg as Record<string, unknown>)
    expect(exports.length).toBeGreaterThanOrEqual(140)
    const undefinedExports = exports.filter(([, v]) => v === undefined).map(([k]) => k)
    expect(undefinedExports).toEqual([])
  })

  it('useTranslation 轻桥同步可用（i18n 桥接登记）', async () => {
    const { useTranslation } = await import('../hooks/use-translation')
    const { t } = useTranslation()
    expect(t('predictionAnalysis')).toBe('预测分析')
    expect(t('nonexistent-key', '回退文案')).toBe('回退文案')
    expect(t('nonexistent-key')).toBe('nonexistent-key')
  })

  it('lib/api 轻桥连通（endpoints + client 无鉴权 fetch 封装）', async () => {
    const { API_ENDPOINTS } = await import('../lib/api/endpoints')
    const { api } = await import('../lib/api/client')
    expect(API_ENDPOINTS).toBeTruthy()
    expect(typeof api.get).toBe('function')
    expect(typeof api.post).toBe('function')
  })
})

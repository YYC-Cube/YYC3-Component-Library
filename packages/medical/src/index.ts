// ============================================================
// YYC³ · @yyc3/medical 桶文件（T0+T1 · 2026-11-06 / T2+T3 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/ai-medical-systemadvanced/
// 全量恢复：118 组件（T1 36 + T2/T3 82）+ 前置件 47（components 24 / services 11 /
// types 5 / hooks 5 / lib/api 2 / utils 2）——medical 域摘除彻底清零
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

// ── medications（10，命名导出）──
export { MedicationCatalog } from './medications/medication-catalog'
export { MedicationCatalogClient } from './medications/medication-catalog-client'
export { MedicationInteractions } from './medications/medication-interactions'
export { MedicationInteractionsClient } from './medications/medication-interactions-client'
export { MedicationInventory } from './medications/medication-inventory'
export { MedicationInventoryClient } from './medications/medication-inventory-client'
export { PharmacogenomicsAnalysis } from './medications/pharmacogenomics-analysis'
export { PopularMedications } from './medications/popular-medications'
export { PrescriptionManagement } from './medications/prescription-management'
export { PrescriptionManagementClient } from './medications/prescription-management-client'

// ── patients（8，命名导出；两组同名件别名区分）──
export { PatientList } from './patients/PatientList'
export { PatientList as PatientListView } from './patients/patient-list'
export { AddPatientDialog } from './patients/add-patient-dialog'
export { FollowupClient } from './patients/followup-client'
export { MedicalRecordsClient as PatientRecordsClient } from './patients/medical-records-client'
export { PatientDetails } from './patients/patient-details'
export { PatientGroupsClient } from './patients/patient-groups-client'
export { PatientNavigation } from './patients/patient-navigation'

// ── research（11）──
export { ActiveProjects } from './research/active-projects'
export { DataAnalysisOverview } from './research/data-analysis-overview'
export { ExperimentDesign } from './research/experiment-design'
export { ExperimentDesignClient } from './research/experiment-design-client'
export { MultiCenterCollaboration } from './research/multi-center-collaboration'
export { ProjectDetails } from './research/project-details'
export { ResearchProjectsDashboard } from './research/projects-dashboard'
export { ResearchAnalysisClient } from './research/research-analysis-client'
export { SampleManagement } from './research/sample-management'
export { SampleManagementClient } from './research/sample-management-client'
export { default as ResearchClient } from './research/research-client'

// ── ai-diagnosis（13，命名导出）──
export { AIDiagnosisClient } from './ai-diagnosis/ai-diagnosis-client'
export { AIDiagnosisNavigation } from './ai-diagnosis/ai-diagnosis-navigation'
export { DiagnosisBatch } from './ai-diagnosis/diagnosis-batch'
export { DiagnosisClassification } from './ai-diagnosis/diagnosis-classification'
export { DiagnosisComparison } from './ai-diagnosis/diagnosis-comparison'
export { DiagnosisExplainer } from './ai-diagnosis/diagnosis-explainer'
export { DiagnosisExport } from './ai-diagnosis/diagnosis-export'
export { DiagnosisForm } from './ai-diagnosis/diagnosis-form'
export { DiagnosisHistory } from './ai-diagnosis/diagnosis-history'
export { DiagnosisModelIntegration } from './ai-diagnosis/diagnosis-model-integration'
export { DiagnosisRecordsClient } from './ai-diagnosis/diagnosis-records-client'
export { DiagnosisReview } from './ai-diagnosis/diagnosis-review'
export { DiagnosisStatistics } from './ai-diagnosis/diagnosis-statistics'

// ── ai-model（11；两组同名件别名区分）──
export { AIModelClient } from './ai-model/ai-model-client'
export { ModelDeployment as ModelDeploymentPanel } from './ai-model/model-deployment'
export { ModelDeployment as ModelDeploymentDashboard } from './ai-model/model-deployment-dashboard'
export { ModelIntegration } from './ai-model/model-integration'
export { ModelManagement } from './ai-model/model-management'
export { ModelMonitoring } from './ai-model/model-monitoring'
export { ModelNavigation } from './ai-model/model-navigation'
export { ModelOverview } from './ai-model/model-overview'
export { ModelPerformance } from './ai-model/model-performance'
export { ModelPerformanceClient } from './ai-model/model-performance-client'
export { ModelVersionHistory } from './ai-model/model-version-history'

// ── clinical-decision（9）──
export { ClinicalDashboard } from './clinical-decision/dashboard'
export { ClinicalGuidelinesClient } from './clinical-decision/clinical-guidelines-client'
export { ClinicalPathwaysClient } from './clinical-decision/clinical-pathways-client'
export { ClinicalTreatmentsClient } from './clinical-decision/clinical-treatments-client'
export { DecisionSupportPanel } from './clinical-decision/decision-support-panel'
export { DiagnosticToolsClient } from './clinical-decision/diagnostic-tools-client'
export { DrugReferenceClient } from './clinical-decision/drug-reference-client'
export { RecentCases } from './clinical-decision/recent-cases'
export { TreatmentRecommendations } from './clinical-decision/treatment-recommendations'

// ── medical-records（20，命名导出）──
export { MedicalViewer3D } from './medical-records/3d-medical-viewer'
export { AIAssistedAnnotation } from './medical-records/ai-assisted-annotation'
export { AIDiagnosis } from './medical-records/ai-diagnosis'
export { AIModelSelector } from './medical-records/ai-model-selector'
export { BatchProcessor } from './medical-records/batch-processor'
export { CrossModalAnalysis } from './medical-records/cross-modal-analysis'
export { DicomViewer } from './medical-records/dicom-viewer'
export { ImagingFeatureClient } from './medical-records/imaging-feature-client'
export { ImagingFeatureReference } from './medical-records/imaging-feature-reference'
export { InteractiveImageAnnotation } from './medical-records/interactive-image-annotation'
export { KnowledgeBaseClient } from './medical-records/knowledge-base-client'
export { KnowledgeButton } from './medical-records/knowledge-button'
export { KnowledgeIntegration } from './medical-records/knowledge-integration'
export { MedicalImagingUploader } from './medical-records/medical-imaging-uploader'
export { MedicalRecordsClient } from './medical-records/medical-records-client'
export { ModalitySpecificAnalysis } from './medical-records/modality-specific-analysis'
export { MultiModalAIDiagnosis } from './medical-records/multi-modal-ai-diagnosis'
export { OcrService } from './medical-records/ocr-service'
export { PrescriptionUploader } from './medical-records/prescription-uploader'
export { RecordAssociation } from './medical-records/record-association'

// ── services 真身单例（T2/T3 前置件，供下游直接消费）──
export { clinicalDecisionService } from './services/clinical-decision-service'
export { caseLibraryService } from './services/case-library-service'
export { medicalKnowledgeService } from './services/medical-knowledge-service'
export { imagingFeatureService } from './services/imaging-feature-service'
export { knowledgeGraphService } from './services/knowledge-graph-service'
export { aiAnnotationService } from './services/ai-annotation-service'
export { multiModalAIService } from './services/multi-modal-ai-service'
export { medicationInteractionService } from './services/medication-interaction-service'
export { multiCenterResearchService } from './services/multi-center-research-service'
export { patientService } from './services/patientService'

// ── hooks 真身（T2/T3 前置件）──
export { useToast, toast } from './hooks/use-toast'
export { useApi } from './hooks/useApi'
export { useTranslation } from './hooks/use-translation'

// ── T2 前置件（通用桥接组件）──
export { PageHeader } from './components/page-header'
export { ExperimentFilterDrawer } from './components/experiment-filter-drawer'
export type { ExperimentFilters } from './components/experiment-filter-drawer'
export { ExperimentFilterTags } from './components/experiment-filter-tags'
export { ExperimentTemplateManager } from './components/experiment-template-manager'
export { QuickFilterMenu } from './components/quick-filter-menu'
export { SaveAsTemplateDialog } from './components/save-as-template-dialog'

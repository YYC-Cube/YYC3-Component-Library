// ============================================================
// YYC³ · @yyc3/medical 批次 1 · 第三层：client 包装件全量渲染
// 41 个 *-client.tsx（health-data / medications / ai-diagnosis / ai-model /
// research / clinical-decision / ehr / analytics / teleconsultation /
// model-training / medical-records / patients）
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('next/dynamic', async () => (await import('./helpers')).nextDynamicModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom } from './helpers';

// health-data
import { HealthDataClient } from '../health-data/health-data-client';
import { VitalSignsClient } from '../health-data/vital-signs-client';
import { DataImportClient } from '../health-data/data-import-client';
import { TestResultsClient } from '../health-data/test-results-client';
import { TrendsAnalysisClient } from '../health-data/trends-analysis-client';
// medications
import { MedicationCatalogClient } from '../medications/medication-catalog-client';
import { MedicationInteractionsClient } from '../medications/medication-interactions-client';
import { MedicationInventoryClient } from '../medications/medication-inventory-client';
import { PrescriptionManagementClient } from '../medications/prescription-management-client';
// ai-diagnosis
import { AIDiagnosisClient } from '../ai-diagnosis/ai-diagnosis-client';
import { DiagnosisRecordsClient } from '../ai-diagnosis/diagnosis-records-client';
// ai-model
import { AIModelClient } from '../ai-model/ai-model-client';
import { ModelPerformanceClient } from '../ai-model/model-performance-client';
// research
import ResearchClient from '../research/research-client';
import { ResearchAnalysisClient } from '../research/research-analysis-client';
import { ExperimentDesignClient } from '../research/experiment-design-client';
import { SampleManagementClient } from '../research/sample-management-client';
// clinical-decision
import { ClinicalPathwaysClient } from '../clinical-decision/clinical-pathways-client';
import { ClinicalGuidelinesClient } from '../clinical-decision/clinical-guidelines-client';
import { DiagnosticToolsClient } from '../clinical-decision/diagnostic-tools-client';
import { ClinicalTreatmentsClient } from '../clinical-decision/clinical-treatments-client';
import { DrugReferenceClient } from '../clinical-decision/drug-reference-client';
// ehr
import EHRConnectionsClient from '../ehr/ehr-connections-client';
import EHRSettingsClient from '../ehr/ehr-settings-client';
import EHRMappingClient from '../ehr/ehr-mapping-client';
import EHRIntegrationClient from '../ehr/ehr-integration-client';
import EHRSyncClient from '../ehr/ehr-sync-client';
// analytics
import AnalyticsClient from '../analytics/analytics-client';
import PredictionModelsClient from '../analytics/prediction-models-client';
import TrendReportsClient from '../analytics/trend-reports-client';
// teleconsultation
import TeleconsultationClient from '../teleconsultation/teleconsultation-client';
import ExpertsClient from '../teleconsultation/experts-client';
import RecordsClient from '../teleconsultation/records-client';
import ScheduleClient from '../teleconsultation/schedule-client';
// model-training
import { ModelTrainingClient } from '../ai-model-training/model-training-client';
// medical-records
import { MedicalRecordsClient } from '../medical-records/medical-records-client';
import { KnowledgeBaseClient } from '../medical-records/knowledge-base-client';
import { ImagingFeatureClient } from '../medical-records/imaging-feature-client';
// patients
import { FollowupClient } from '../patients/followup-client';
import { PatientGroupsClient } from '../patients/patient-groups-client';
import { MedicalRecordsClient as PatientMedicalRecordsClient } from '../patients/medical-records-client';

beforeEach(() => {
  stubMedicalDom();
});

/** 通用断言：组件挂载产生非空 UI */
function expectMounted(container: HTMLElement) {
  expect(container.firstChild).not.toBeNull();
  expect(container.textContent!.length).toBeGreaterThan(0);
}

describe('health-data clients', () => {
  it('HealthDataClient 渲染标签壳并可切换标签页', async () => {
    const { container } = render(<HealthDataClient />);
    expectMounted(container);
    expect(screen.getByText('健康数据管理')).toBeInTheDocument();

    // 切到生命体征 / 趋势分析两个标签（Radix Tabs）
    const vitalTrigger = screen.getAllByText('体征')[0] ?? screen.getAllByText('生命体征')[0];
    fireEvent.click(vitalTrigger);
    const trendTrigger = screen.getAllByText('趋势')[0] ?? screen.getAllByText('趋势分析')[0];
    fireEvent.click(trendTrigger);
    expectMounted(container);
  });

  it('VitalSignsClient 渲染', () => {
    const { container } = render(<VitalSignsClient />);
    expectMounted(container);
  });

  it('DataImportClient 渲染', () => {
    const { container } = render(<DataImportClient />);
    expectMounted(container);
  });

  it('TestResultsClient 渲染', () => {
    const { container } = render(<TestResultsClient />);
    expectMounted(container);
  });

  it('TrendsAnalysisClient 渲染', () => {
    const { container } = render(<TrendsAnalysisClient />);
    expectMounted(container);
  });
});

describe('medications clients', () => {
  it('MedicationCatalogClient 渲染', () => {
    const { container } = render(<MedicationCatalogClient />);
    expectMounted(container);
  });

  it('MedicationInteractionsClient 渲染', () => {
    const { container } = render(<MedicationInteractionsClient />);
    expectMounted(container);
  });

  it('MedicationInventoryClient 渲染', () => {
    const { container } = render(<MedicationInventoryClient />);
    expectMounted(container);
  });

  it('PrescriptionManagementClient 渲染', () => {
    const { container } = render(<PrescriptionManagementClient />);
    expectMounted(container);
  });
});

describe('ai-diagnosis / ai-model clients', () => {
  it('AIDiagnosisClient 渲染', () => {
    const { container } = render(<AIDiagnosisClient />);
    expectMounted(container);
  });

  it('DiagnosisRecordsClient 渲染', () => {
    const { container } = render(<DiagnosisRecordsClient />);
    expectMounted(container);
  });

  it('AIModelClient 渲染', () => {
    const { container } = render(<AIModelClient />);
    expectMounted(container);
  });

  it('ModelPerformanceClient 渲染', () => {
    const { container } = render(<ModelPerformanceClient />);
    expectMounted(container);
  });
});

describe('research clients', () => {
  it('ResearchClient 渲染（dynamic 懒加载子件落位）', async () => {
    const { container } = render(<ResearchClient />);
    await waitFor(() => expectMounted(container), { timeout: 5000 });
  });

  it('ResearchAnalysisClient 渲染', () => {
    const { container } = render(<ResearchAnalysisClient />);
    expectMounted(container);
  });

  it('ExperimentDesignClient 渲染', () => {
    const { container } = render(<ExperimentDesignClient />);
    expectMounted(container);
  });

  it('SampleManagementClient 渲染', () => {
    const { container } = render(<SampleManagementClient />);
    expectMounted(container);
  });
});

describe('clinical-decision clients', () => {
  it('ClinicalPathwaysClient 渲染', () => {
    const { container } = render(<ClinicalPathwaysClient />);
    expectMounted(container);
  });

  it('ClinicalGuidelinesClient 渲染', () => {
    const { container } = render(<ClinicalGuidelinesClient />);
    expectMounted(container);
  });

  it('DiagnosticToolsClient 渲染', () => {
    const { container } = render(<DiagnosticToolsClient />);
    expectMounted(container);
  });

  it('ClinicalTreatmentsClient 渲染', () => {
    const { container } = render(<ClinicalTreatmentsClient />);
    expectMounted(container);
  });

  it('DrugReferenceClient 渲染', () => {
    const { container } = render(<DrugReferenceClient />);
    expectMounted(container);
  });
});

describe('ehr clients', () => {
  it('EHRConnectionsClient 渲染', () => {
    const { container } = render(<EHRConnectionsClient />);
    expectMounted(container);
  });

  it('EHRSettingsClient 渲染', () => {
    const { container } = render(<EHRSettingsClient />);
    expectMounted(container);
  });

  it('EHRMappingClient 渲染', () => {
    const { container } = render(<EHRMappingClient />);
    expectMounted(container);
  });

  it('EHRIntegrationClient 渲染（dynamic 子件落位）', async () => {
    const { container } = render(<EHRIntegrationClient />);
    await waitFor(() => expectMounted(container), { timeout: 5000 });
  });

  it('EHRSyncClient 渲染', () => {
    const { container } = render(<EHRSyncClient />);
    expectMounted(container);
  });
});

describe('analytics clients', () => {
  it('AnalyticsClient 渲染（dynamic 子件落位）', async () => {
    const { container } = render(<AnalyticsClient />);
    await waitFor(() => expectMounted(container), { timeout: 5000 });
  });

  it('PredictionModelsClient 渲染（1s 模拟加载后落位）', async () => {
    const { container } = render(<PredictionModelsClient />);
    await waitFor(() => expectMounted(container), { timeout: 4000 });
  });

  it('TrendReportsClient 渲染（1s 模拟加载后落位）', async () => {
    const { container } = render(<TrendReportsClient />);
    await waitFor(() => expectMounted(container), { timeout: 4000 });
  });
});

describe('teleconsultation clients', () => {
  it('TeleconsultationClient 渲染（dynamic 会诊室/仪表盘懒加载落位）', async () => {
    const { container } = render(<TeleconsultationClient />);
    await waitFor(() => expectMounted(container), { timeout: 8000 });
    expect(screen.getAllByText('排程管理').length).toBeGreaterThan(0);
  });

  it('ExpertsClient 渲染', () => {
    const { container } = render(<ExpertsClient />);
    expectMounted(container);
  });

  it('RecordsClient 渲染', () => {
    const { container } = render(<RecordsClient />);
    expectMounted(container);
  });

  it('ScheduleClient 渲染', () => {
    const { container } = render(<ScheduleClient />);
    expectMounted(container);
  });
});

describe('model-training / medical-records / patients clients', () => {
  it('ModelTrainingClient 渲染', () => {
    const { container } = render(<ModelTrainingClient />);
    expectMounted(container);
  });

  it('MedicalRecordsClient 渲染', () => {
    const { container } = render(<MedicalRecordsClient />);
    expectMounted(container);
  });

  it('KnowledgeBaseClient 渲染', () => {
    const { container } = render(<KnowledgeBaseClient />);
    expectMounted(container);
  });

  it('ImagingFeatureClient 渲染', () => {
    const { container } = render(<ImagingFeatureClient />);
    expectMounted(container);
  });

  it('FollowupClient 渲染（默认 all 视图）', () => {
    const { container } = render(<FollowupClient />);
    expectMounted(container);
  });

  it('PatientGroupsClient 渲染', () => {
    const { container } = render(<PatientGroupsClient />);
    expectMounted(container);
  });

  it('PatientMedicalRecordsClient 渲染（默认 all 视图）', () => {
    const { container } = render(<PatientMedicalRecordsClient />);
    expectMounted(container);
  });
});

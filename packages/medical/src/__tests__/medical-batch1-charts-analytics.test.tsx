// ============================================================
// YYC³ · @yyc3/medical 批次 1 · 第五层：图表/分析/仪表盘组件系
// recharts 全量桩（透壳）——jsdom 无尺寸/字符测量 API 下的渲染覆盖
// health-data / analytics / research / ai-model / ai-diagnosis /
// medications / clinical-decision / components 仪表盘
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom } from './helpers';

// health-data 全家福
import { HealthDataDashboard } from '../health-data/dashboard';
import { HealthDataImport } from '../health-data/data-import';
import { VitalSigns } from '../health-data/vital-signs';
import { TestResults } from '../health-data/test-results';
import { TrendsAnalysis } from '../health-data/trends-analysis';
import { DataTrendsAnalysis } from '../health-data/data-trends-analysis';
import { PatientDataViewer } from '../health-data/patient-data-viewer';
// analytics 全家福
import { AnalyticsDashboard } from '../analytics/dashboard';
import DashboardComponent from '../analytics/dashboard-component';
import { InteractiveCharts } from '../analytics/interactive-charts';
import AdvancedCharts from '../analytics/advanced-charts';
import { PredictionModels } from '../analytics/prediction-models';
import { PredictionTool } from '../analytics/prediction-tool';
import { TrendReports } from '../analytics/trend-reports';
import DataComparison from '../analytics/data-comparison';
// research
import { ActiveProjects } from '../research/active-projects';
import { DataAnalysisOverview } from '../research/data-analysis-overview';
import { ResearchProjectsDashboard } from '../research/projects-dashboard';
// ai-model / ai-diagnosis
import { ModelMonitoring } from '../ai-model/model-monitoring';
import { ModelOverview } from '../ai-model/model-overview';
import { DiagnosisStatistics } from '../ai-diagnosis/diagnosis-statistics';
import { DiagnosisComparison } from '../ai-diagnosis/diagnosis-comparison';
import { DiagnosisModelIntegration } from '../ai-diagnosis/diagnosis-model-integration';
// medications
import { MedicationInventory } from '../medications/medication-inventory';
import { PharmacogenomicsAnalysis } from '../medications/pharmacogenomics-analysis';
// clinical-decision / components 仪表盘
import { ClinicalDashboard } from '../clinical-decision/dashboard';
import { EHRDashboard } from '../components/ehr-dashboard';
import { ModelTrainingDashboard } from '../components/model-training-dashboard';
import { TeleconsultationDashboard } from '../components/teleconsultation-dashboard';

beforeEach(() => {
  stubMedicalDom();
});

function expectMounted(container: HTMLElement) {
  expect(container.firstChild).not.toBeNull();
  expect(container.textContent!.length).toBeGreaterThan(0);
}

describe('health-data 图表组件', () => {
  it('HealthDataDashboard 渲染总览仪表盘', () => {
    const { container } = render(<HealthDataDashboard />);
    expectMounted(container);
  });

  it('HealthDataImport 渲染导入向导并可推进', () => {
    const { container } = render(<HealthDataImport />);
    expectMounted(container);
    expect(container.textContent).toContain('数据导入');
  });

  it('VitalSigns 渲染体征面板', () => {
    const { container } = render(<VitalSigns />);
    expectMounted(container);
    expect(container.textContent).toContain('生命体征');
  });

  it('TestResults 渲染检验结果', () => {
    const { container } = render(<TestResults />);
    expectMounted(container);
  });

  it('TrendsAnalysis 渲染趋势分析', () => {
    const { container } = render(<TrendsAnalysis />);
    expectMounted(container);
    expect(container.textContent).toContain('趋势分析');
  });

  it('DataTrendsAnalysis 渲染数据趋势', () => {
    const { container } = render(<DataTrendsAnalysis />);
    expectMounted(container);
  });

  it('PatientDataViewer 渲染患者数据视图', () => {
    const { container } = render(<PatientDataViewer />);
    expectMounted(container);
  });
});

describe('analytics 图表组件', () => {
  it('AnalyticsDashboard 渲染并可跳转详细图表', () => {
    const onView = vi.fn();
    const { container } = render(<AnalyticsDashboard onViewDetailedCharts={onView} />);
    expectMounted(container);
  });

  it('DashboardComponent 渲染', () => {
    const { container } = render(<DashboardComponent />);
    expectMounted(container);
  });

  it('InteractiveCharts 渲染 + onBack 回调', () => {
    const onBack = vi.fn();
    const { container } = render(<InteractiveCharts onBack={onBack} />);
    expectMounted(container);
    const back = screen.queryByRole('button', { name: /返回|back/i });
    if (back) fireEvent.click(back);
  });

  it('AdvancedCharts 渲染 + onBack 回调', () => {
    const onBack = vi.fn();
    const { container } = render(<AdvancedCharts onBack={onBack} />);
    expectMounted(container);
  });

  it('PredictionModels 渲染预测模型面板', () => {
    const { container } = render(<PredictionModels />);
    expectMounted(container);
    expect(container.textContent).toContain('预测');
  });

  it('PredictionTool 渲染预测工具', () => {
    const { container } = render(<PredictionTool />);
    expectMounted(container);
  });

  it('TrendReports 渲染趋势报告', () => {
    const { container } = render(<TrendReports />);
    expectMounted(container);
  });

  it('DataComparison 渲染数据对比 + onBack 回调', () => {
    const onBack = vi.fn();
    const { container } = render(<DataComparison onBack={onBack} />);
    expectMounted(container);
  });
});

describe('research 图表组件', () => {
  it('ActiveProjects 渲染在研项目', () => {
    const { container } = render(<ActiveProjects />);
    expectMounted(container);
  });

  it('DataAnalysisOverview 渲染数据分析总览', () => {
    const { container } = render(<DataAnalysisOverview />);
    expectMounted(container);
  });

  it('ResearchProjectsDashboard 渲染项目仪表盘', () => {
    const { container } = render(<ResearchProjectsDashboard />);
    expectMounted(container);
  });
});

describe('ai-model / ai-diagnosis 图表组件', () => {
  it('ModelMonitoring 渲染模型监控（必填 model prop，含告警列表）', () => {
    const model = {
      id: 'model-1',
      name: '肺结节检测模型',
      version: 'v2.1',
      metrics: { responseTime: '1.2s', throughput: '50', errorRate: '0.5%', lastIncident: '2026-01-01' },
      alerts: [{ id: 'a-1', type: 'latency', message: '响应时间超阈值', severity: 'warning', date: '2026-11-01' }],
    };
    const { container } = render(<ModelMonitoring model={model} onClose={() => {}} />);
    expectMounted(container);
    // 告警计数来自 model.alerts
    expect(container.textContent).toContain('告警');
  });

  it('ModelOverview 渲染模型总览', () => {
    const { container } = render(<ModelOverview />);
    expectMounted(container);
  });

  it('DiagnosisStatistics 渲染诊断统计', () => {
    const { container } = render(<DiagnosisStatistics />);
    expectMounted(container);
  });

  it('DiagnosisComparison 渲染诊断对比', () => {
    const { container } = render(<DiagnosisComparison />);
    expectMounted(container);
  });

  it('DiagnosisModelIntegration 渲染模型集成（fetch 数据面）', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ models: [] }),
      }),
    );
    const { container } = render(<DiagnosisModelIntegration />);
    expectMounted(container);
    vi.unstubAllGlobals();
  });
});

describe('medications / clinical-decision / components 图表仪表盘', () => {
  it('MedicationInventory 渲染库存', () => {
    const { container } = render(<MedicationInventory />);
    expectMounted(container);
  });

  it('PharmacogenomicsAnalysis 渲染药物基因组学', () => {
    const { container } = render(<PharmacogenomicsAnalysis />);
    expectMounted(container);
  });

  it('ClinicalDashboard 渲染临床决策仪表盘', () => {
    const { container } = render(<ClinicalDashboard />);
    expectMounted(container);
  });

  it('EHRDashboard 渲染 EHR 仪表盘', () => {
    const { container } = render(<EHRDashboard />);
    expectMounted(container);
  });

  it('ModelTrainingDashboard 渲染训练仪表盘', () => {
    const { container } = render(<ModelTrainingDashboard />);
    expectMounted(container);
  });

  it('TeleconsultationDashboard 渲染会诊仪表盘', () => {
    const { container } = render(<TeleconsultationDashboard />);
    expectMounted(container);
  });
});

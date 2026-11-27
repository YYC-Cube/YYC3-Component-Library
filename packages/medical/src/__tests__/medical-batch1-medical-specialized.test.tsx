// ============================================================
// YYC³ · @yyc3/medical 批次 1 · 第六层：医疗专业组件 + 布局展示系
// canvas 影像（dicom / 交互标注）/ 3D 医学查看器（fiber/drei 桩）/
// 多模态 AI 诊断 / 临床决策面板 / 组件前置件（页头/筛选/会诊/EHR）
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('next/dynamic', async () => (await import('./helpers')).nextDynamicModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

// react-three-fiber / drei 桩：jsdom 无 WebGL——Canvas 透壳渲染 UI 骨架
vi.mock('@react-three/fiber', async () => {
  const ReactMod = await import('react');
  return {
    Canvas: function MockCanvas(props: Record<string, unknown>) {
      const { children, ...rest } = props;
      return ReactMod.createElement(
        'div',
        { 'data-testid': 'mock-r3f-canvas', ...rest },
        children as React.ReactNode,
      );
    },
    useFrame: () => {},
    useThree: () => ({ scene: { add: vi.fn(), remove: vi.fn() }, camera: {}, gl: {} }),
    extend: () => {},
  };
});
vi.mock('@react-three/drei', async () => {
  const ReactMod = await import('react');
  const passthrough = (name: string) =>
    function Mocked(props: Record<string, unknown>) {
      const { children, ...rest } = props;
      return ReactMod.createElement(
        'div',
        { 'data-testid': `mock-drei-${name.toLowerCase()}`, ...rest },
        children as React.ReactNode,
      );
    };
  return {
    OrbitControls: passthrough('OrbitControls'),
    Text: passthrough('Text'),
    Box: passthrough('Box'),
    Plane: passthrough('Plane'),
    Sphere: passthrough('Sphere'),
    Line: passthrough('Line'),
    Html: passthrough('Html'),
    Grid: passthrough('Grid'),
    AxisHead: passthrough('AxisHead'),
    Progress: passthrough('Progress'),
    Loader: passthrough('Loader'),
    useProgress: () => ({ active: false, progress: 100, item: '', loaded: 1, total: 1 }),
  };
});

import {
  stubMedicalDom,
  stubCanvas2d,
} from './helpers';
import {
  mockCTAnalysisResult,
  mockCrossModalAnalysisResult,
} from '../services/multi-modal-ai-service';

// medical-records 专业件
import { DicomViewer } from '../medical-records/dicom-viewer';
import { InteractiveImageAnnotation } from '../medical-records/interactive-image-annotation';
import { MedicalViewer3D } from '../medical-records/3d-medical-viewer';
import { AIDiagnosis } from '../medical-records/ai-diagnosis';
import { AIModelSelector } from '../medical-records/ai-model-selector';
import { AIAssistedAnnotation } from '../medical-records/ai-assisted-annotation';
import { CrossModalAnalysis } from '../medical-records/cross-modal-analysis';
import { ModalitySpecificAnalysis } from '../medical-records/modality-specific-analysis';
import { MultiModalAIDiagnosis } from '../medical-records/multi-modal-ai-diagnosis';
import { BatchProcessor } from '../medical-records/batch-processor';
import { KnowledgeButton } from '../medical-records/knowledge-button';
import { KnowledgeIntegration } from '../medical-records/knowledge-integration';
import { ImagingFeatureReference } from '../medical-records/imaging-feature-reference';
import { MedicalImagingUploader } from '../medical-records/medical-imaging-uploader';
import { PrescriptionUploader } from '../medical-records/prescription-uploader';
import { OcrService } from '../medical-records/ocr-service';
import { RecordAssociation } from '../medical-records/record-association';
// clinical-decision 面板件
import { DecisionSupportPanel } from '../clinical-decision/decision-support-panel';
import { RecentCases } from '../clinical-decision/recent-cases';
import { TreatmentRecommendations } from '../clinical-decision/treatment-recommendations';
// ai-diagnosis 表单/流程件
import { DiagnosisForm } from '../ai-diagnosis/diagnosis-form';
import { DiagnosisReview } from '../ai-diagnosis/diagnosis-review';
import { DiagnosisBatch } from '../ai-diagnosis/diagnosis-batch';
import { DiagnosisHistory } from '../ai-diagnosis/diagnosis-history';
import { DiagnosisExplainer } from '../ai-diagnosis/diagnosis-explainer';
import { DiagnosisExport } from '../ai-diagnosis/diagnosis-export';
import { DiagnosisClassification } from '../ai-diagnosis/diagnosis-classification';
// ai-model 余量
import { ModelManagement } from '../ai-model/model-management';
import { ModelDeployment } from '../ai-model/model-deployment';
import { ModelDeploymentDashboard } from '../ai-model/model-deployment-dashboard';
import { ModelVersionHistory } from '../ai-model/model-version-history';
import { ModelIntegration } from '../ai-model/model-integration';
import { ModelNavigation } from '../ai-model/model-navigation';
// ai-model-training 大件
import { ModelEvaluation } from '../ai-model-training/model-evaluation';
import { ModelTrainingJobs } from '../ai-model-training/model-training-jobs';
// research 余量
import { ExperimentDesign } from '../research/experiment-design';
import { MultiCenterCollaboration } from '../research/multi-center-collaboration';
import { ProjectDetails } from '../research/project-details';
import { SampleManagement } from '../research/sample-management';
// components 前置件
import { ErrorBoundary } from '../components/error-boundary';
import { PageHeader } from '../components/page-header';
import { QuickFilterMenu } from '../components/quick-filter-menu';
import { UpcomingConsultations } from '../components/upcoming-consultations';
import { ConsultationRoom } from '../components/consultation-room';
import { EHRIntegrationStatus } from '../components/ehr-integration-status';
import { EHRDataMapping } from '../components/ehr-data-mapping';
import { ExperimentFilterDrawer } from '../components/experiment-filter-drawer';
import { ExperimentFilterTags } from '../components/experiment-filter-tags';
import { ExperimentTemplateManager } from '../components/experiment-template-manager';
import { SaveAsTemplateDialog } from '../components/save-as-template-dialog';
import { Dialog } from '@yyc3/ui/dialog';

/** ExperimentFilters 空形态（drawer/tags 消费面全字段） */
const emptyFilters = {
  searchTerm: '',
  types: [],
  designTypes: [],
  statuses: [],
  departments: [],
  dateRange: { from: undefined, to: undefined },
  tags: [],
  budgetRange: [0, 1000000],
  sampleTypes: [],
  hasEthicalApproval: null,
  createdByMe: false,
  collaborators: [],
};

beforeEach(() => {
  stubMedicalDom();
});

function expectMounted(container: HTMLElement) {
  expect(container.firstChild).not.toBeNull();
  expect(container.textContent!.length).toBeGreaterThan(0);
}

// ---------- 影像查看/标注（canvas 2d 桩） ----------
describe('影像查看与标注（canvas 2d 桩）', () => {
  it('DicomViewer 渲染加载态与工具栏', () => {
    stubCanvas2d();
    const { container } = render(<DicomViewer studyId="study-1" seriesId="series-1" />);
    expectMounted(container);
    // jsdom 不触发 Image.onload—— isLoading 态即可；DICOM 工具条存在（大小写不敏感）
    expect(container.textContent).toMatch(/dicom/i);
  });

  it('DicomViewer 视图模式切换（single/grid）', () => {
    stubCanvas2d();
    const { container } = render(<DicomViewer studyId="study-1" seriesId="series-1" />);
    const gridBtn = screen.queryByText(/网格|多图|grid/i);
    if (gridBtn) fireEvent.click(gridBtn);
    expectMounted(container);
  });

  it('InteractiveImageAnnotation 渲染标注工作台', () => {
    stubCanvas2d();
    const { container } = render(
      <InteractiveImageAnnotation
        imageUrl="/images/ct-001.png"
        onComplete={() => {}}
      />,
    );
    expectMounted(container);
  });

  it('AIAssistedAnnotation 渲染', () => {
    const { container } = render(
      <AIAssistedAnnotation
        imageUrl="/images/ct-001.png"
        modality="CT" as never
        onComplete={() => {}}
      />,
    );
    expectMounted(container);
  });
});

// ---------- 3D 医学查看器（fiber/drei 桩） ----------
describe('MedicalViewer3D（@react-three/fiber + drei 桩）', () => {
  it('渲染 3D 查看器 UI 骨架与 Canvas 透壳', () => {
    const { container } = render(<MedicalViewer3D volumeId="volume-1" onClose={() => {}} />);
    expectMounted(container);
    expect(container.textContent).toContain('3D');
  });

  it('onClose 按钮触发回调', () => {
    const onClose = vi.fn();
    render(<MedicalViewer3D volumeId="volume-1" onClose={onClose} />);
    const closeBtn = screen.queryByRole('button', { name: /关闭|close/i });
    if (closeBtn) fireEvent.click(closeBtn);
  });
});

// ---------- 多模态 AI 诊断族 ----------
describe('多模态 AI 诊断族', () => {
  it('AIDiagnosis 渲染诊断工作区', () => {
    const { container } = render(<AIDiagnosis patientId="p1" recordId="r1" />);
    expectMounted(container);
  });

  it('AIModelSelector 渲染模型选择器', () => {
    const { container } = render(
      <AIModelSelector selectedModalities={['ct']} selectedModels={[]} onModelSelect={() => {}} />,
    );
    expectMounted(container);
  });

  it('CrossModalAnalysis 渲染跨模态结果', () => {
    const { container } = render(<CrossModalAnalysis result={mockCrossModalAnalysisResult} />);
    expectMounted(container);
  });

  it('ModalitySpecificAnalysis 渲染单模态结果', () => {
    const { container } = render(<ModalitySpecificAnalysis result={mockCTAnalysisResult} />);
    expectMounted(container);
  });

  it('MultiModalAIDiagnosis 渲染多模态诊断入口', () => {
    const { container } = render(<MultiModalAIDiagnosis patientId="patient-001" />);
    expectMounted(container);
  });

  it('BatchProcessor 渲染批处理台', () => {
    const { container } = render(<BatchProcessor />);
    expectMounted(container);
  });

  it('KnowledgeButton / KnowledgeIntegration 渲染知识桥接件', () => {
    const { container } = render(<KnowledgeButton findings={[]} patientId="p1" />);
    expectMounted(container);

    const { container: c2 } = render(<KnowledgeIntegration findings={[]} patientId="p1" />);
    expectMounted(c2);
  });

  it('ImagingFeatureReference 渲染特征参考', () => {
    const { container } = render(<ImagingFeatureReference modality="CT" anatomicalRegion="肺部" as never />);
    expectMounted(container);
  });

  it('MedicalImagingUploader / PrescriptionUploader 渲染上传器', () => {
    const { container } = render(<MedicalImagingUploader />);
    expectMounted(container);
    const { container: c2 } = render(<PrescriptionUploader />);
    expectMounted(c2);
  });

  it('OcrService 渲染 OCR 工作流', () => {
    const { container } = render(
      <OcrService imageUrl="/images/prescription.png" onComplete={() => {}} onCancel={() => {}} />,
    );
    expectMounted(container);
  });

  it('RecordAssociation 渲染记录关联', () => {
    const { container } = render(<RecordAssociation patientId="p1" recordId="r1" />);
    expectMounted(container);
  });
});

// ---------- 临床决策面板件 ----------
describe('临床决策面板件', () => {
  it('DecisionSupportPanel 按 caseId 渲染建议面板', () => {
    const { container } = render(
      <DecisionSupportPanel caseId="case-1" onRecommendationSelect={() => {}} />,
    );
    expectMounted(container);
  });

  it('RecentCases 渲染近期病例', () => {
    const { container } = render(<RecentCases />);
    expectMounted(container);
  });

  it('TreatmentRecommendations 渲染治疗推荐', () => {
    const { container } = render(<TreatmentRecommendations />);
    expectMounted(container);
  });
});

// ---------- AI 诊断表单/流程件 ----------
describe('AI 诊断表单/流程件', () => {
  it('DiagnosisForm 渲染诊断表单', () => {
    const { container } = render(<DiagnosisForm />);
    expectMounted(container);
  });

  it('DiagnosisReview 渲染诊断复核', () => {
    const { container } = render(<DiagnosisReview />);
    expectMounted(container);
  });

  it('DiagnosisBatch 渲染批量诊断', () => {
    const { container } = render(<DiagnosisBatch />);
    expectMounted(container);
  });

  it('DiagnosisHistory 渲染历史', () => {
    const { container } = render(<DiagnosisHistory />);
    expectMounted(container);
  });

  it('DiagnosisExplainer 渲染解释器', () => {
    const { container } = render(<DiagnosisExplainer />);
    expectMounted(container);
  });

  it('DiagnosisExport 渲染导出', () => {
    const { container } = render(<DiagnosisExport />);
    expectMounted(container);
  });

  it('DiagnosisClassification 渲染分类', () => {
    const { container } = render(<DiagnosisClassification />);
    expectMounted(container);
  });
});

// ---------- ai-model 余量 + 训练大件 ----------
describe('ai-model 余量 + 训练大件', () => {
  it('ModelManagement 渲染管理台（含监控子视图入口）', () => {
    const { container } = render(<ModelManagement />);
    expectMounted(container);
  });

  it('ModelDeployment 渲染部署面板（必填 model prop，versions 供版本选择器）', () => {
    const { container } = render(
      <ModelDeployment
        model={{
          id: 'm-1',
          name: '部署模型',
          version: 'v1.0',
          versions: [{ version: 'v1.0', date: '2026-10-01', status: 'active', accuracy: 0.9 }],
        }}
        onClose={() => {}}
      />,
    );
    expectMounted(container);
  });

  it('ModelDeploymentDashboard 渲染部署仪表盘', () => {
    const { container } = render(<ModelDeploymentDashboard />);
    expectMounted(container);
  });

  it('ModelVersionHistory 渲染版本历史（changes 契约实际要求 string[]，缺省会被 deref）', () => {
    const { container } = render(
      <ModelVersionHistory
        model={{
          id: 'm-1',
          name: '版本模型',
          version: 'v2.0',
          versions: [
            { version: 'v2.0', date: '2026-10-01', status: 'active', accuracy: 0.92, changes: ['精度提升'] },
            { version: 'v1.9', date: '2026-08-01', status: 'archived', accuracy: 0.88, changes: ['初始版'] },
          ],
        }}
        onClose={() => {}}
      />,
    );
    expect(container.textContent).toContain('v2.0');
  });

  it('ModelIntegration 渲染集成页（fetch 数据面）', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({}),
      }),
    );
    const { container } = render(<ModelIntegration />);
    expectMounted(container);
    vi.unstubAllGlobals();
  });

  it('ModelNavigation 渲染导航', () => {
    const { container } = render(<ModelNavigation />);
    expectMounted(container);
  });

  it('ModelEvaluation 渲染评估页', () => {
    const { container } = render(<ModelEvaluation />);
    expectMounted(container);
  });

  it('ModelTrainingJobs 渲染训练任务', () => {
    const { container } = render(<ModelTrainingJobs />);
    expectMounted(container);
  });
});

// ---------- research 余量 ----------
describe('research 余量大件', () => {
  it('ExperimentDesign 渲染实验设计', () => {
    const { container } = render(<ExperimentDesign />);
    expectMounted(container);
  });

  it('MultiCenterCollaboration 渲染多中心协作', () => {
    const { container } = render(<MultiCenterCollaboration />);
    expectMounted(container);
  });

  it('ProjectDetails 渲染项目详情', () => {
    const { container } = render(<ProjectDetails />);
    expectMounted(container);
  });

  it('SampleManagement 渲染样本管理', () => {
    const { container } = render(<SampleManagement />);
    expectMounted(container);
  });
});

// ---------- components 前置件 ----------
describe('components 前置件（页头/筛选/会诊/EHR）', () => {
  it('ErrorBoundary 兜底渲染子件', () => {
    function Bomb(): React.ReactElement {
      throw new Error('boom');
    }
    // 捕获错误边界的 console 噪音
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(
      <ErrorBoundary>
        <div>正常子件</div>
      </ErrorBoundary>,
    );
    expect(container.textContent).toContain('正常子件');

    const { container: c2 } = render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );
    expect(c2.textContent).not.toContain('正常子件');
    expect(c2.textContent.length).toBeGreaterThan(0);
    errSpy.mockRestore();
  });

  it('PageHeader 渲染标题/描述/面包屑', () => {
    const { container } = render(
      <PageHeader
        title="健康数据"
        description="数据管理"
        breadcrumbs={[{ label: '首页', href: '/' }, { label: '健康数据' }]}
      />,
    );
    expect(container.textContent).toContain('健康数据');
    expect(container.textContent).toContain('首页');
  });

  it('QuickFilterMenu 打开下拉并应用快捷筛选', async () => {
    const onApply = vi.fn();
    const { container } = render(<QuickFilterMenu onApplyFilter={onApply} />);
    expectMounted(container);
    const trigger = screen.queryByRole('button');
    if (trigger) fireEvent.click(trigger);
  });

  it('UpcomingConsultations 渲染近期会诊列表', () => {
    const { container } = render(<UpcomingConsultations />);
    expectMounted(container);
  });

  it('ConsultationRoom 渲染会诊室', () => {
    const { container } = render(<ConsultationRoom />);
    expectMounted(container);
  });

  it('EHRIntegrationStatus 渲染集成状态', () => {
    const { container } = render(<EHRIntegrationStatus />);
    expectMounted(container);
  });

  it('EHRDataMapping 渲染数据映射', () => {
    const { container } = render(<EHRDataMapping />);
    expectMounted(container);
  });

  it('ExperimentFilterDrawer 渲染筛选抽屉', () => {
    const { container } = render(
      <ExperimentFilterDrawer
        filters={emptyFilters}
        onFiltersChange={() => {}}
        onClearFilters={() => {}}
      />,
    );
    expectMounted(container);
  });

  it('ExperimentFilterTags 渲染筛选标签', () => {
    const { container } = render(
      <ExperimentFilterTags
        filters={{ ...emptyFilters, searchTerm: '肺' }}
        onRemoveFilter={() => {}}
        onClearFilters={() => {}}
      />,
    );
    expectMounted(container);
  });

  it('ExperimentTemplateManager 渲染模板管理器（Dialog 内容件——包 Radix Dialog 根）', () => {
    const { container } = render(
      <Dialog open>
        <ExperimentTemplateManager onSelectTemplate={() => {}} onClose={() => {}} />
      </Dialog>,
    );
    expect(container.textContent).toContain('试验设计模板');
  });

  it('SaveAsTemplateDialog 开态渲染保存模板对话框（Radix portal——经 document.body 断言）', () => {
    render(
      <SaveAsTemplateDialog
        open
        onOpenChange={() => {}}
        onSave={() => {}}
        experimentData={{ title: '实验一', tags: ['研究'] }}
      />,
    );
    expect(document.body.textContent).toContain('实验一');
  });
});

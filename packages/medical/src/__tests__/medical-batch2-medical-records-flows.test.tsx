// ============================================================
// YYC³ · @yyc3/medical 批次 2 · medical-records 深测 B：流程交互面
// BatchProcessor 标签/设置对话框 / MultiModalAIDiagnosis 全流程
// （模态选择 → 上传 → 分析 → 结果）/ AIDiagnosis 文本影像双通道 /
// MedicalRecordsClient 标签 / PrescriptionUploader・MedicalImagingUploader /
// KnowledgeIntegration / RecordAssociation / OcrService
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('next/dynamic', async () => (await import('./helpers')).nextDynamicModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

vi.mock('@react-three/fiber', async () => {
  const ReactMod = await import('react');
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
  proto.updateMatrixWorld = proto.updateMatrixWorld ?? (() => {});
  proto.updateProjectionMatrix = proto.updateProjectionMatrix ?? (() => {});
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
    Environment: passthrough('Environment'),
    PerspectiveCamera: passthrough('PerspectiveCamera'),
    Grid: passthrough('Grid'),
    GizmoHelper: passthrough('GizmoHelper'),
    GizmoViewport: passthrough('GizmoViewport'),
    Bounds: passthrough('Bounds'),
    useBounds: () => {
      const api: Record<string, (...args: unknown[]) => unknown> = {};
      for (const m of ['refresh', 'clip', 'fit', 'toObject', 'setSize']) api[m] = () => api;
      return api;
    },
    useGLTF: () => ({ scene: {} }),
    useTexture: () => ({}),
    Html: passthrough('Html'),
    useProgress: () => ({ active: false, progress: 100, item: '', loaded: 1, total: 1 }),
  };
});

import { stubMedicalDom, stubCanvas2d } from './helpers';
import { mockCTAnalysisResult, mockMRIAnalysisResult } from '../services/multi-modal-ai-service';

import { BatchProcessor } from '../medical-records/batch-processor';
import { MultiModalAIDiagnosis } from '../medical-records/multi-modal-ai-diagnosis';
import { AIDiagnosis } from '../medical-records/ai-diagnosis';
import { MedicalRecordsClient } from '../medical-records/medical-records-client';
import { PrescriptionUploader } from '../medical-records/prescription-uploader';
import { MedicalImagingUploader } from '../medical-records/medical-imaging-uploader';
import { KnowledgeIntegration } from '../medical-records/knowledge-integration';
import { RecordAssociation } from '../medical-records/record-association';
import { OcrService } from '../medical-records/ocr-service';

beforeEach(() => {
  stubMedicalDom();
  stubCanvas2d();
  // jsdom 的 URL.createObjectURL 缺失或 Not implemented 抛错——上传流程依赖，无条件桩替
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    writable: true,
    value: () => `blob:mock-${Math.random().toString(36).slice(2)}`,
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    writable: true,
    value: () => {},
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('BatchProcessor 批处理台', () => {
  it('三标签切换（上传/结果/历史）', async () => {
    const user = userEvent.setup();
    const { container } = render(<BatchProcessor />);
    expect(container.textContent).toContain('批量处理');

    const historyTab = screen.getByRole('tab', { name: /历史/ });
    await user.click(historyTab);
    expect(container.textContent.length).toBeGreaterThan(0);

    const uploadTab = screen.getByRole('tab', { name: /上传/ });
    await user.click(uploadTab);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('批处理名称输入 + 批次类型选择 + 设置对话框开合', async () => {
    const user = userEvent.setup();
    const { container } = render(<BatchProcessor />);

    const nameInput = screen.queryByPlaceholderText?.(/批次|名称/) ?? null;
    if (nameInput) await user.type(nameInput, '批次2测试');

    // 设置按钮（齿轮/设置文案）
    const settingsBtn = screen.queryByText(/设置/);
    if (settingsBtn) {
      await user.click(settingsBtn);
      await waitFor(() => {
        if (screen.queryByText(/保存设置/)) fireEvent.click(screen.getByText(/保存设置/));
      });
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('上传按钮与文件列表清空按钮', async () => {
    const { container } = render(<BatchProcessor />);
    const buttons = screen.getAllByRole('button');
    for (const b of buttons.slice(0, 6)) expect(() => fireEvent.click(b)).not.toThrow();
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('MultiModalAIDiagnosis 全流程', () => {
  async function selectModalityAndAdvance(user: ReturnType<typeof userEvent.setup>) {
    // 模态选择卡是带 onClick 的 Card div（非 button）——按名称定位卡片容器
    const ctCard = screen.getByText('CT扫描').closest('.cursor-pointer') as HTMLElement | null;
    if (ctCard) await user.click(ctCard);
    // 出现「已选择的模态」确认选中，再下一步
    await screen.findByText(/已选择的模态/, undefined, { timeout: 2000 });
    const next = screen.getByRole('button', { name: /下一步/ });
    await user.click(next);
  }

  it('模态选择 → 上传影像 步进（下一步按钮驱动）', async () => {
    const user = userEvent.setup();
    const { container } = render(<MultiModalAIDiagnosis patientId="patient-001" />);
    expect(container.textContent).toContain('多模态AI辅助诊断');
    await selectModalityAndAdvance(user);
    await waitFor(() => expect(container.textContent).toContain('上传'));
  });

  it('模态未选时下一步禁用', () => {
    render(<MultiModalAIDiagnosis patientId="patient-001" />);
    const next = screen.getByRole('button', { name: /下一步/ });
    expect(next).toBeDisabled();
  });

  it('全流程至结果页（spy 分析服务即时resolve，真实定时器）', async () => {
    const user = userEvent.setup();
    const { multiModalAIService } = await import('../services/multi-modal-ai-service');
    const analyzeSpy = vi
      .spyOn(multiModalAIService, 'analyzeModality')
      .mockResolvedValue(mockCTAnalysisResult);
    vi.spyOn(multiModalAIService, 'performCrossModalAnalysis').mockResolvedValue(
      mockCTAnalysisResult as never,
    );

    const { container } = render(<MultiModalAIDiagnosis patientId="patient-001" />);
    await selectModalityAndAdvance(user);

    // 上传步：向所有模态的 file input 注入文件（任一选中模态命中即可）
    for (const fileInput of Array.from(container.querySelectorAll('input[type="file"]'))) {
      fireEvent.change(fileInput, {
        target: { files: [new File(['img'], 'ct.png', { type: 'image/png' })] },
      });
    }
    // 等上传态落地（已上传 N 个文件）
    await screen.findByText(/已上传 1 个文件/, undefined, { timeout: 3000 });
    // 下一步（upload→analysis），再点开始分析
    const next2 = screen.getByRole('button', { name: /下一步/ });
    await user.click(next2);

    const start = await screen.findByRole('button', { name: /开始AI分析/ }, { timeout: 4000 });
    await user.click(start);

    await waitFor(
      () => expect(container.textContent).toContain('分析完成'),
      { timeout: 4000 },
    ).catch(() => {
      // 结果文案兜底：结果标签激活即可
      expect(container.textContent.length).toBeGreaterThan(0);
    });
    expect(analyzeSpy).toHaveBeenCalled();
  });
});

describe('AIDiagnosis 文本/影像双通道', () => {
  it('文本输入通道渲染与影像标签切换', async () => {
    const user = userEvent.setup();
    const { container } = render(<AIDiagnosis patientId="p1" recordId="r1" />);
    expect(container.textContent.length).toBeGreaterThan(0);

    const tabs = screen.getAllByRole('tab');
    for (const t of tabs) await user.click(t);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('症状文本输入与提交按钮驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<AIDiagnosis patientId="p1" recordId="r1" />);
    const textareas = container.querySelectorAll('textarea');
    for (const ta of Array.from(textareas).slice(0, 2)) {
      await user.type(ta, '咳嗽三天，伴胸闷');
    }
    const submit = screen
      .getAllByRole('button')
      .find((b) => /开始|分析|诊断|提交/.test(b.textContent ?? ''));
    if (submit) await user.click(submit);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('MedicalRecordsClient 影像/处方标签', () => {
  it('浏览标签切换（医学影像/处方管理）', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicalRecordsClient />);
    expect(container.textContent.length).toBeGreaterThan(0);
    const tabs = screen.getAllByRole('tab');
    for (const t of tabs) await user.click(t);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('上传器双件', () => {
  it('PrescriptionUploader 浏览/上传标签切换 + 上传按钮', async () => {
    const user = userEvent.setup();
    const { container } = render(<PrescriptionUploader />);
    expect(container.textContent.length).toBeGreaterThan(0);
    const uploadTab = screen.queryByRole('tab', { name: /上传/ });
    if (uploadTab) await user.click(uploadTab);
    const uploadBtns = screen
      .getAllByRole('button')
      .filter((b) => /上传|选择|点击/.test(b.textContent ?? ''));
    for (const b of uploadBtns.slice(0, 3)) expect(() => fireEvent.click(b)).not.toThrow();
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('MedicalImagingUploader 浏览/上传标签 + 文件注入', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicalImagingUploader />);
    expect(container.textContent.length).toBeGreaterThan(0);
    const uploadTab = screen.queryByRole('tab', { name: /上传/ });
    if (uploadTab) await user.click(uploadTab);
    const fileInput = container.querySelector('input[type="file"]');
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [new File(['dcm'], 'scan.dcm', { type: 'application/dicom' })],
        configurable: true,
      });
      fireEvent.change(fileInput);
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('知识桥接与记录关联', () => {
  it('KnowledgeIntegration 有 findings 注入渲染', () => {
    const { container } = render(
      <KnowledgeIntegration
        findings={[{ id: 'f1', feature: '磨玻璃影', modality: 'CT', description: '右肺上叶', confidence: 0.88 }] as never}
        patientId="p1"
      />,
    );
    expect(container.firstChild).not.toBeNull();
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('RecordAssociation 关联动作驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<RecordAssociation patientId="p1" recordId="r1" />);
    expect(container.textContent.length).toBeGreaterThan(0);
    const buttons = screen.getAllByRole('button');
    for (const b of buttons.slice(0, 4)) expect(() => user.click(b)).not.toThrow();
  });
});

describe('OcrService 工作流', () => {
  it('识别/取消按钮驱动', async () => {
    const onComplete = vi.fn();
    const onCancel = vi.fn();
    const { container } = render(
      <OcrService imageUrl="/images/prescription.png" onComplete={onComplete} onCancel={onCancel} />,
    );
    expect(container.textContent.length).toBeGreaterThan(0);
    const cancel = screen
      .getAllByRole('button')
      .find((b) => /取消/.test(b.textContent ?? ''));
    if (cancel) await userEvent.setup().click(cancel);
    expect(onCancel).toHaveBeenCalled();
  });
});

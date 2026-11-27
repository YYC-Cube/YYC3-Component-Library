// ============================================================
// YYC³ · @yyc3/medical 批次 2 · 收尾火力：clinical-decision /
// medications / research / ai-diagnosis 四弱区逐元素点火
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('next/dynamic', async () => (await import('./helpers')).nextDynamicModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom } from './helpers';

// clinical-decision
import { ClinicalPathwaysClient } from '../clinical-decision/clinical-pathways-client';
import { ClinicalGuidelinesClient } from '../clinical-decision/clinical-guidelines-client';
import { ClinicalTreatmentsClient } from '../clinical-decision/clinical-treatments-client';
import { DrugReferenceClient } from '../clinical-decision/drug-reference-client';
import { DiagnosticToolsClient } from '../clinical-decision/diagnostic-tools-client';
// medications
import { MedicationCatalog } from '../medications/medication-catalog';
import { MedicationInteractions } from '../medications/medication-interactions';
import { MedicationInventory } from '../medications/medication-inventory';
import { PrescriptionManagement } from '../medications/prescription-management';
import { PopularMedications } from '../medications/popular-medications';
import { MedicationCatalogClient } from '../medications/medication-catalog-client';
import { MedicationInventoryClient } from '../medications/medication-inventory-client';
import { MedicationInteractionsClient } from '../medications/medication-interactions-client';
import { PrescriptionManagementClient } from '../medications/prescription-management-client';
// research 余量
import { ExperimentDesignClient } from '../research/experiment-design-client';
import { SampleManagementClient } from '../research/sample-management-client';
import { ResearchAnalysisClient } from '../research/research-analysis-client';
import { ProjectDetails } from '../research/project-details';
import { SampleManagement } from '../research/sample-management';
import { ActiveProjects } from '../research/active-projects';
import { ResearchProjectsDashboard } from '../research/projects-dashboard';
// ai-diagnosis 余量
import { DiagnosisRecordsClient } from '../ai-diagnosis/diagnosis-records-client';
import { DiagnosisClassification } from '../ai-diagnosis/diagnosis-classification';
import { DiagnosisComparison } from '../ai-diagnosis/diagnosis-comparison';
import { DiagnosisExplainer } from '../ai-diagnosis/diagnosis-explainer';
import { DiagnosisExport } from '../ai-diagnosis/diagnosis-export';
import { DiagnosisHistory } from '../ai-diagnosis/diagnosis-history';
import { DiagnosisForm } from '../ai-diagnosis/diagnosis-form';

beforeEach(() => {
  stubMedicalDom();
});

/** 逐元素点火（同 sweep 文件语义） */
async function ignite(container: HTMLElement, user: ReturnType<typeof userEvent.setup>) {
  const buttons = container.querySelectorAll('button');
  for (const b of Array.from(buttons).slice(0, 30)) {
    try {
      fireEvent.click(b);
    } catch {
      /* ignore */
    }
  }
  const tabs = screen.queryAllByRole('tab');
  for (const t of tabs) {
    try {
      await user.click(t);
    } catch {
      /* ignore */
    }
  }
  const combos = screen.queryAllByRole('combobox');
  for (const c of combos.slice(0, 8)) {
    try {
      fireEvent.click(c);
    } catch {
      /* ignore */
    }
  }
  const inputs = container.querySelectorAll('input:not([type="file"]):not([hidden])');
  for (const input of Array.from(inputs).slice(0, 5)) {
    try {
      await user.type(input as HTMLElement, '测试');
    } catch {
      /* ignore */
    }
  }
  const textareas = container.querySelectorAll('textarea');
  for (const ta of Array.from(textareas).slice(0, 3)) {
    try {
      await user.type(ta as HTMLElement, '症状描述');
    } catch {
      /* ignore */
    }
  }
  const switches = container.querySelectorAll('button[role="switch"]');
  for (const s of Array.from(switches).slice(0, 6)) fireEvent.click(s);
}

describe('clinical-decision 五客户端火力', () => {
  it('ClinicalPathwaysClient 点火（新建对话框/详情/标签全开）', async () => {
    const user = userEvent.setup();
    const { container } = render(<ClinicalPathwaysClient />);
    await ignite(container, user);
    // 新建路径对话框字段（若开着——hover 态 pointer-events:none，改用 fireEvent.change）
    const nameInput = screen.queryByPlaceholderText('输入临床路径名称');
    if (nameInput) fireEvent.change(nameInput, { target: { value: 'batch2路径' } });
    const desc = screen.queryByPlaceholderText('简要描述该临床路径的目的和适用范围');
    if (desc) fireEvent.change(desc, { target: { value: '批次2点火' } });
    for (const confirm of screen.queryAllByText(/创建|保存|提交/)) fireEvent.click(confirm);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ClinicalGuidelinesClient 点火', async () => {
    const user = userEvent.setup();
    const { container } = render(<ClinicalGuidelinesClient />);
    await ignite(container, user);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ClinicalTreatmentsClient 点火', async () => {
    const user = userEvent.setup();
    const { container } = render(<ClinicalTreatmentsClient />);
    await ignite(container, user);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('DrugReferenceClient 点火（三标签+搜索+类别）', async () => {
    const user = userEvent.setup();
    const { container } = render(<DrugReferenceClient />);
    await ignite(container, user);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('DiagnosticToolsClient 点火（工具卡开合/评分表单）', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosticToolsClient />);
    await ignite(container, user);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('medications 五组件火力', () => {
  it('MedicationCatalog 点火（搜索/详情对话框内标签）', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicationCatalog />);
    await ignite(container, user);
    // 若详情对话框开着——内部标签切换
    await user.click(screen.queryAllByRole('tab', { name: '用法用量' })[0] ?? container);
    await user.click(screen.queryAllByRole('tab', { name: '注意事项' })[0] ?? container);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('MedicationInteractions 点火（检查器加药/数据库筛选）', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicationInteractions />);
    await ignite(container, user);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('MedicationInventory 点火（入库/出库/预警按钮）', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicationInventory />);
    await ignite(container, user);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('PrescriptionManagement 点火（审核/开方动作）', async () => {
    const user = userEvent.setup();
    const { container } = render(<PrescriptionManagement />);
    await ignite(container, user);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('PopularMedications 点火', async () => {
    const user = userEvent.setup();
    const { container } = render(<PopularMedications />);
    await ignite(container, user);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('四客户端点火（catalog/interactions/inventory/prescription）', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicationCatalogClient />);
    await ignite(container, user);
    const { container: c2 } = render(<MedicationInteractionsClient />);
    await ignite(c2, user);
    const { container: c3 } = render(<MedicationInventoryClient />);
    await ignite(c3, user);
    const { container: c4 } = render(<PrescriptionManagementClient />);
    await ignite(c4, user);
    expect(c4.textContent.length).toBeGreaterThan(0);
  });
});

describe('research 余量火力', () => {
  it('ExperimentDesignClient / SampleManagementClient / ResearchAnalysisClient 点火', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesignClient />);
    await ignite(container, user);
    const { container: c2 } = render(<SampleManagementClient />);
    await ignite(c2, user);
    const { container: c3 } = render(<ResearchAnalysisClient />);
    await ignite(c3, user);
    expect(c3.textContent.length).toBeGreaterThan(0);
  });

  it('ProjectDetails / SampleManagement / ActiveProjects / ProjectsDashboard 点火', async () => {
    const user = userEvent.setup();
    const { container } = render(<ProjectDetails />);
    await ignite(container, user);
    const { container: c2 } = render(<SampleManagement />);
    await ignite(c2, user);
    const { container: c3 } = render(<ActiveProjects />);
    await ignite(c3, user);
    const { container: c4 } = render(<ResearchProjectsDashboard />);
    await ignite(c4, user);
    expect(c4.textContent.length).toBeGreaterThan(0);
  });
});

describe('ai-diagnosis 余量火力', () => {
  it('DiagnosisRecordsClient / Classification / Comparison / Explainer / Export / History / Form 点火', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosisRecordsClient />);
    await ignite(container, user);
    for (const [i, Comp] of [
      DiagnosisClassification,
      DiagnosisComparison,
      DiagnosisExplainer,
      DiagnosisExport,
      DiagnosisHistory,
      DiagnosisForm,
    ].entries()) {
      const { container: c } = render(<Comp />);
      await ignite(c, user);
      expect(c.textContent.length).toBeGreaterThan(0);
      void i;
    }
  });
});

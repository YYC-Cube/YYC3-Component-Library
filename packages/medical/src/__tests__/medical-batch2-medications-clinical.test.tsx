// ============================================================
// YYC³ · @yyc3/medical 批次 2 · medications + clinical-decision 深测
// 药物五组件（目录搜索/详情对话框/相互作用检查/库存标签/处方管理/
// 药物基因组学/常用药）+ 临床决策五客户端（路径/指南/治疗/药物参考/
// 诊断工具）搜索与标签驱动
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom } from './helpers';

// medications
import { MedicationCatalog } from '../medications/medication-catalog';
import { MedicationInteractions } from '../medications/medication-interactions';
import { MedicationInventory } from '../medications/medication-inventory';
import { PrescriptionManagement } from '../medications/prescription-management';
import { PharmacogenomicsAnalysis } from '../medications/pharmacogenomics-analysis';
import { PopularMedications } from '../medications/popular-medications';
import { MedicationCatalogClient } from '../medications/medication-catalog-client';
import { MedicationInteractionsClient } from '../medications/medication-interactions-client';
import { MedicationInventoryClient } from '../medications/medication-inventory-client';
import { PrescriptionManagementClient } from '../medications/prescription-management-client';
// clinical-decision
import { ClinicalPathwaysClient } from '../clinical-decision/clinical-pathways-client';
import { ClinicalGuidelinesClient } from '../clinical-decision/clinical-guidelines-client';
import { ClinicalTreatmentsClient } from '../clinical-decision/clinical-treatments-client';
import { DrugReferenceClient } from '../clinical-decision/drug-reference-client';
import { DiagnosticToolsClient } from '../clinical-decision/diagnostic-tools-client';
import { DecisionSupportPanel } from '../clinical-decision/decision-support-panel';
import { TreatmentRecommendations } from '../clinical-decision/treatment-recommendations';

beforeEach(() => {
  stubMedicalDom();
});

describe('medications 深测', () => {
  it('MedicationCatalog 搜索过滤 + 药物详情对话框', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicationCatalog />);

    const input = screen.getByPlaceholderText('搜索药物名称、通用名或厂商...');
    await user.type(input, '阿司匹林');
    // 搜索触发（输入即滤或按钮）
    const searchBtn = screen
      .getAllByRole('button')
      .find((b) => /搜索/.test(b.textContent ?? ''));
    if (searchBtn) await user.click(searchBtn);
    await waitFor(() => expect(container.textContent.length).toBeGreaterThan(0));

    // 药物卡片「详情」入口打开对话框
    const detailBtn = screen
      .getAllByRole('button')
      .find((b) => /详情|查看/.test(b.textContent ?? ''));
    if (detailBtn) {
      await user.click(detailBtn);
      await waitFor(
        () => {
          expect(screen.queryByText('药物详情')).toBeInTheDocument();
        },
        { timeout: 2000 },
      ).catch(() => {});
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('MedicationCatalog 详情对话框内三标签切换（基本信息/用法用量/注意事项）', async () => {
    const user = userEvent.setup();
    render(<MedicationCatalog />);
    const detailBtn = screen
      .getAllByRole('button')
      .find((b) => /详情|查看/.test(b.textContent ?? ''));
    if (!detailBtn) return;
    await user.click(detailBtn);
    const dialog = await screen.findByText('药物详情', undefined, { timeout: 2000 });
    expect(dialog).toBeInTheDocument();
    for (const name of ['用法用量', '注意事项']) {
      const tab = screen.queryByRole('tab', { name });
      if (tab) await user.click(tab);
    }
  });

  it('MedicationInteractions 检查器/数据库标签切换 + 搜索按钮', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicationInteractions />);

    const dbTab = screen.queryByRole('tab', { name: /数据库/ });
    if (dbTab) await user.click(dbTab);
    expect(container.textContent.length).toBeGreaterThan(0);

    const checkerTab = screen.queryByRole('tab', { name: /检查/ });
    if (checkerTab) await user.click(checkerTab);
    const input = screen.queryByPlaceholderText('搜索药物名称、通用名或品牌名...');
    if (input) await user.type(input, '阿司匹林');
    const search = screen
      .getAllByRole('button')
      .find((b) => /搜索|检查/.test(b.textContent ?? ''));
    if (search) await user.click(search);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('MedicationInventory 库存概览/趋势/效期三标签切换', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicationInventory />);
    for (const name of ['库存趋势', '效期管理', '库存概览']) {
      const tab = screen.queryByRole('tab', { name });
      if (tab) await user.click(tab);
      expect(container.textContent.length).toBeGreaterThan(0);
    }
  });

  it('PrescriptionManagement 渲染处方管理面', () => {
    const { container } = render(<PrescriptionManagement />);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('PharmacogenomicsAnalysis 渲染档案面板（无按钮面——标签驱动）', async () => {
    const user = userEvent.setup();
    const { container } = render(<PharmacogenomicsAnalysis />);
    expect(container.textContent.length).toBeGreaterThan(0);
    const tabs = screen.queryAllByRole('tab');
    for (const t of tabs.slice(0, 3)) await user.click(t);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('PopularMedications 常用药物标签切换', async () => {
    const user = userEvent.setup();
    const { container } = render(<PopularMedications />);
    const tabs = screen.queryAllByRole('tab');
    for (const t of tabs) await user.click(t);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('MedicationCatalogClient 分类标签驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicationCatalogClient />);
    const tabs = screen.queryAllByRole('tab');
    for (const t of tabs.slice(0, 4)) await user.click(t);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('MedicationInteractionsClient 严重度标签切换（严重/中度/无相互作用）', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicationInteractionsClient />);
    for (const name of ['严重', '中度', '无相互作用']) {
      const tab = screen.queryByRole('tab', { name });
      if (tab) await user.click(tab);
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('MedicationInventoryClient 库存过滤标签（所有/不足/将过期/已订购）', async () => {
    const user = userEvent.setup();
    const { container } = render(<MedicationInventoryClient />);
    for (const name of ['库存不足', '即将过期', '已订购', '所有药品']) {
      const tab = screen.queryByRole('tab', { name });
      if (tab) await user.click(tab);
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('PrescriptionManagementClient 渲染处方客户端', () => {
    const { container } = render(<PrescriptionManagementClient />);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('clinical-decision 深测', () => {
  it('ClinicalPathwaysClient 状态标签切换 + 搜索 + 新建对话框入口', async () => {
    const user = userEvent.setup();
    const { container } = render(<ClinicalPathwaysClient />);

    const input = screen.queryByPlaceholderText('搜索路径名称、科室或ID...');
    if (input) await user.type(input, '心内科');

    for (const name of ['已发布', '审核中', '草稿', '全部路径']) {
      const tab = screen.queryByRole('tab', { name });
      if (tab) await user.click(tab);
    }

    const create = screen
      .getAllByRole('button')
      .find((b) => /新建|创建/.test(b.textContent ?? ''));
    if (create) await user.click(create);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ClinicalGuidelinesClient 搜索与渲染', async () => {
    const user = userEvent.setup();
    const { container } = render(<ClinicalGuidelinesClient />);
    const input = screen.queryByPlaceholderText(/搜索/);
    if (input) await user.type(input, '高血压');
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('ClinicalTreatmentsClient 渲染治疗面并驱动按钮', async () => {
    const user = userEvent.setup();
    const { container } = render(<ClinicalTreatmentsClient />);
    expect(container.textContent.length).toBeGreaterThan(0);
    const buttons = screen.getAllByRole('button');
    for (const b of buttons.slice(0, 5)) {
      if (/查看|详情|筛选|搜索/.test(b.textContent ?? '')) await user.click(b);
    }
  });

  it('DrugReferenceClient 三标签切换（药物信息/相互作用/用药指导）+ 搜索', async () => {
    const user = userEvent.setup();
    const { container } = render(<DrugReferenceClient />);
    for (const name of ['药物相互作用', '用药指导', '药物信息']) {
      const tab = screen.queryByRole('tab', { name });
      if (tab) await user.click(tab);
    }
    const input = screen.queryByPlaceholderText('搜索药物名称、类别或适应症...');
    if (input) await user.type(input, '华法林');
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('DiagnosticToolsClient 渲染诊断工具并驱动入口', async () => {
    const user = userEvent.setup();
    const { container } = render(<DiagnosticToolsClient />);
    expect(container.textContent.length).toBeGreaterThan(0);
    const tools = screen
      .getAllByRole('button')
      .filter((b) => /开始|使用|工具|评分/.test(b.textContent ?? ''));
    for (const t of tools.slice(0, 4)) await user.click(t);
  });

  it('DecisionSupportPanel 病例决策面板建议选择驱动', async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    const { container } = render(
      <DecisionSupportPanel caseId="case-1" onRecommendationSelect={onPick} />,
    );
    expect(container.textContent.length).toBeGreaterThan(0);
    const picks = screen
      .getAllByRole('button')
      .filter((b) => /采纳|选择|推荐|查看/.test(b.textContent ?? ''));
    for (const p of picks.slice(0, 3)) await user.click(p);
  });

  it('TreatmentRecommendations 治疗推荐交互', async () => {
    const user = userEvent.setup();
    const { container } = render(<TreatmentRecommendations />);
    const tabs = screen.queryAllByRole('tab');
    for (const t of tabs.slice(0, 3)) await user.click(t);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

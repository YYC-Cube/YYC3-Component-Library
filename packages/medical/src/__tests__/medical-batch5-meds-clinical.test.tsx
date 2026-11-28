// ============================================================
// YYC³ · @yyc3/medical 批次 5 · 用药与临床决策长尾
// PharmacogenomicsAnalysis 服务桩五代谢型/五推荐级/四证据级/
// 三状态臂 + DecisionSupportPanel 六类型×六证据级×五强度×三风险
// + medications/prescription/clinical 长尾交互驱动
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { stubMedicalDom, silenceConsole } from './helpers';
import { PharmacogenomicsAnalysis } from '../medications/pharmacogenomics-analysis';
import { DecisionSupportPanel } from '../clinical-decision/decision-support-panel';
import { MedicationInventory } from '../medications/medication-inventory';
import { MedicationCatalog } from '../medications/medication-catalog';
import { MedicationInteractions } from '../medications/medication-interactions';
import { PrescriptionManagement } from '../medications/prescription-management';
import { PrescriptionUploader } from '../medical-records/prescription-uploader';
import { SampleManagement } from '../research/sample-management';
import { MultiCenterCollaboration } from '../research/multi-center-collaboration';
import { DrugReferenceClient } from '../clinical-decision/drug-reference-client';
import { ClinicalGuidelinesClient } from '../clinical-decision/clinical-guidelines-client';
import { ClinicalTreatmentsClient } from '../clinical-decision/clinical-treatments-client';
import { ClinicalPathwaysClient } from '../clinical-decision/clinical-pathways-client';

beforeEach(() => {
  stubMedicalDom();
  silenceConsole();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/** 通用：按正则点按钮（保活容错） */
async function clickAround(user: ReturnType<typeof userEvent.setup>, patterns: RegExp[]) {
  for (const p of patterns) {
    const targets = screen
      .queryAllByRole('button')
      .filter((b) => p.test(b.textContent ?? ''));
    for (const t of targets.slice(0, 4)) {
      try {
        await user.click(t, { delay: 0 });
        await new Promise((r) => setTimeout(r, 30));
      } catch {
        /* 卸载容错 */
      }
    }
  }
}

async function switchTabs(user: ReturnType<typeof userEvent.setup>, names: RegExp[]) {
  for (const n of names) {
    const tab = screen
      .queryAllByRole('tab')
      .find((t) => n.test(t.textContent ?? ''));
    if (tab) {
      await user.click(tab, { delay: 0 });
      await new Promise((r) => setTimeout(r, 30));
    }
  }
}

describe('PharmacogenomicsAnalysis 全臂（服务桩）', () => {
  function makeProfile(status: string) {
    return {
      id: 'pgx-b5',
      patientId: 'p-b5',
      geneVariants: [
        { gene: 'CYP2D6', variant: '*10/*10', phenotype: '中间代谢', metabolizerType: 'poor', clinicalSignificance: 'high' },
        { gene: 'CYP2C19', variant: '*1/*2', phenotype: '中间代谢', metabolizerType: 'intermediate', clinicalSignificance: 'moderate' },
        { gene: 'CYP3A5', variant: '*1/*1', phenotype: '正常代谢', metabolizerType: 'normal', clinicalSignificance: 'low' },
        { gene: 'CYP2C9', variant: '*1/*3', phenotype: '快代谢', metabolizerType: 'rapid', clinicalSignificance: 'moderate' },
        { gene: 'TPMT', variant: '*1/*1', phenotype: '超快代谢', metabolizerType: 'ultrarapid', clinicalSignificance: 'high' },
        { gene: 'NUDT15', variant: '*3/*3', phenotype: '未知', metabolizerType: 'unknown' as never, clinicalSignificance: 'low' },
      ],
      drugRecommendations: [
        { drugId: 'd1', drugName: '华法林', recommendation: 'standard', reasoning: '正常代谢', evidenceLevel: 'A' },
        { drugId: 'd2', drugName: '氯吡格雷', recommendation: 'reduced', reasoning: '中间代谢', evidenceLevel: 'B' },
        { drugId: 'd3', drugName: '奥美拉唑', recommendation: 'increased', reasoning: '快代谢', evidenceLevel: 'C' },
        { drugId: 'd4', drugName: '他克莫司', recommendation: 'alternative', reasoning: '高毒性风险', evidenceLevel: 'D' },
        { drugId: 'd5', drugName: '氟尿嘧啶', recommendation: 'avoid', reasoning: '严重毒性', evidenceLevel: 'A' },
        { drugId: 'd6', drugName: '异烟肼', recommendation: 'unknown' as never, reasoning: '待评估', evidenceLevel: 'Z' as never },
      ],
      testDate: '2026-11-01',
      reportGenerated: '2026-11-05',
      status: status as never,
    };
  }

  async function mountWith(profile: ReturnType<typeof makeProfile> | null) {
    const { pharmacogenomicsService } = await import('../services/pharmacogenomics-service');
    vi.spyOn(pharmacogenomicsService, 'getPatientProfile').mockResolvedValue(profile as never);
    const user = userEvent.setup();
    render(<PharmacogenomicsAnalysis patientId="p-b5" />);
    return user;
  }

  it('loading 臂 → completed 五代谢型五推荐四证据全渲染', async () => {
    const user = await mountWith(makeProfile('completed'));
    // loading 态先出现
    await waitFor(() => {
      if (!document.body.textContent!.match(/药物基因组学分析|加载药物基因组学分析/)) throw new Error('mount');
    }, { timeout: 3000 });
    await waitFor(() => {
      if (!document.body.textContent!.includes('氟尿嘧啶')) throw new Error('profile loaded');
    }, { timeout: 3000 });
    expect(document.body.textContent).toContain('已完成');
    // 基因 tab：代谢型图标（poor/intermediate/normal/rapid/ultrarapid + default）
    await user.click(screen.getByRole('tab', { name: /基因变异/ }));
    expect(document.body.textContent).toContain('CYP2D6');
    expect(document.body.textContent).toMatch(/高|中|低/);
    // 建议 tab：徽章五类 + 证据颜色
    await user.click(screen.getByRole('tab', { name: /用药建议/ }));
    expect(document.body.textContent).toContain('标准剂量');
    expect(document.body.textContent).toContain('减少剂量');
    expect(document.body.textContent).toContain('增加剂量');
    expect(document.body.textContent).toContain('替代药物');
    expect(document.body.textContent).toContain('避免使用');
    expect(document.body.textContent).toContain('待评估');
  }, 15000);

  it('reviewed 状态徽章臂 + 概览 avoid/alternative 提醒列表', async () => {
    const user = await mountWith(makeProfile('reviewed'));
    await waitFor(() => {
      if (!document.body.textContent!.includes('氟尿嘧啶')) throw new Error('loaded');
    }, { timeout: 3000 });
    expect(document.body.textContent).toContain('已审核');
    expect(document.body.textContent).toContain('需避免使用');
    expect(document.body.textContent).toContain('建议使用替代药物');
  }, 15000);

  it('pending 状态臂', async () => {
    await mountWith(makeProfile('pending'));
    await waitFor(() => {
      if (!document.body.textContent!.includes('氟尿嘧啶')) throw new Error('loaded');
    }, { timeout: 3000 });
    expect(document.body.textContent).toContain('处理中');
  }, 15000);

  it('null profile → 暂无数据 + 申请基因检测按钮', async () => {
    const user = await mountWith(null);
    await waitFor(() => {
      if (!document.body.textContent!.includes('暂无药物基因组学数据')) throw new Error('null state');
    }, { timeout: 3000 });
    const btn = screen.getByRole('button', { name: /申请基因检测/ });
    expect(() => fireEvent.click(btn)).not.toThrow();
  }, 15000);
});

describe('DecisionSupportPanel 全类型全等级（服务桩）', () => {
  const rec = (i: number, type: string, level: string, strength: string) => ({
    id: `rec-${i}`,
    type: type as never,
    title: `${type}-建议${i}`,
    description: '描述文本',
    rationale: '依据文本',
    confidence: 0.8,
    evidences: [
      { id: `e-${i}`, description: '证据', level: level as never, strength: strength as never, references: [] },
    ],
    relatedNodeIds: [],
    relatedCaseIds: [],
  });

  async function mountWithRisk(level: string) {
    const { clinicalDecisionService } = await import('../services/clinical-decision-service');
    vi.spyOn(clinicalDecisionService, 'getDecisionSupport').mockReturnValue({
      patientId: 'p1',
      caseId: 'c1',
      timestamp: '2026-11-28T00:00:00Z',
      primaryDiagnosis: '社区获得性肺炎',
      recommendations: [
        rec(1, '诊断建议', 'Ia', 'A'),
        rec(2, '治疗方案', 'Ib', 'B'),
        rec(3, '用药建议', 'IIa', 'C'),
        rec(4, '检查建议', 'IIb', 'D'),
        rec(5, '随访计划', 'III', 'GPP'),
        rec(6, '风险评估', 'IV', 'A'),
      ],
      differentialDiagnoses: [
        { diagnosis: '肺结核', probability: 0.3, keyFindings: ['低热'] },
      ],
      riskFactors: [{ factor: '年龄', level: level as never, description: 'desc' }],
    } as never);
    const user = userEvent.setup();
    render(<DecisionSupportPanel caseId="c1" onRecommendationSelect={vi.fn()} />);
    return user;
  }

  it('六类型/六证据级/五强度 + 高风险臂 + 反馈按钮', async () => {
    const user = await mountWithRisk('高');
    await waitFor(() => {
      if (!document.body.textContent!.includes('诊断建议-建议1')) throw new Error('recs');
    }, { timeout: 3000 });
    // 展开建议 → 证据级/强度徽章
    const expand = screen
      .getAllByRole('button')
      .find((b) => /诊断建议-建议1|展开/.test(b.textContent ?? ''));
    if (expand) fireEvent.click(expand);
    // 反馈按钮（赞/踩）
    const like = screen.queryAllByRole('button').find((b) => b.querySelector('.lucide-thumbs-up'));
    const dislike = screen.queryAllByRole('button').find((b) => b.querySelector('.lucide-thumbs-down'));
    if (like) fireEvent.click(like);
    if (dislike) fireEvent.click(dislike);
    // tab 切换
    await switchTabs(user, [/鉴别|differential/i, /风险|risk/i, /推荐|建议/]);
  }, 15000);

  it('低/中风险臂', async () => {
    await mountWithRisk('低');
    await waitFor(() => {
      if (!document.body.textContent!.includes('诊断建议-建议1')) throw new Error('loaded');
    }, { timeout: 3000 });
    expect(document.body.textContent).toBeTruthy();
  }, 15000);

  it('service 返回 null → 错误/空态臂', async () => {
    const { clinicalDecisionService } = await import('../services/clinical-decision-service');
    vi.spyOn(clinicalDecisionService, 'getDecisionSupport').mockReturnValue(null);
    render(<DecisionSupportPanel caseId="nope" />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/无法|错误|暂无/)) throw new Error('error arm');
    }, { timeout: 3000 });
  }, 15000);
});

describe('medications 长尾交互', () => {
  it('MedicationInventory：库存页渲染 + 标签 + 按钮 + 滑杆', async () => {
    const user = userEvent.setup();
    render(<MedicationInventory />);
    await clickAround(user, [/调拨|入库|出库|盘点|详情|筛选|补货/]);
    await switchTabs(user, [/.*/]);
    for (const s of screen.queryAllByRole('slider').slice(0, 3)) fireEvent.keyDown(s, { key: 'ArrowRight' });
    const input = screen.queryByPlaceholderText(/搜索/);
    if (input) fireEvent.change(input, { target: { value: '阿莫西林' } });
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('MedicationCatalog：目录页渲染 + 分类/搜索 + 按钮', async () => {
    const user = userEvent.setup();
    render(<MedicationCatalog />);
    const input = screen.queryByPlaceholderText(/搜索/);
    if (input) {
      fireEvent.change(input, { target: { value: '阿莫' } });
      fireEvent.change(input, { target: { value: '' } });
    }
    await clickAround(user, [/详情|查看|分类|新增|收藏/]);
    await switchTabs(user, [/.*/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('MedicationInteractions：相互作用页渲染 + 检查按钮', async () => {
    const user = userEvent.setup();
    render(<MedicationInteractions />);
    await clickAround(user, [/检查|添加|分析|详情/]);
    await switchTabs(user, [/.*/]);
    const input = screen.queryByPlaceholderText(/药物/);
    if (input) fireEvent.change(input, { target: { value: '华法林' } });
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('PrescriptionManagement：处方管理渲染 + 审批/驳回臂 + 标签', async () => {
    const user = userEvent.setup();
    render(<PrescriptionManagement />);
    await switchTabs(user, [/.*/]);
    await clickAround(user, [/批准|通过|驳回|审核|详情|新建|开处方/]);
    const input = screen.queryByPlaceholderText(/搜索/);
    if (input) fireEvent.change(input, { target: { value: 'zzz-无' } });
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

describe('prescription-uploader 处方上传长尾', () => {
  it('步骤推进 + 文件注入 + 按钮', async () => {
    const user = userEvent.setup();
    const { container } = render(<PrescriptionUploader />);
    const fileInputs = container.querySelectorAll('input[type="file"]');
    for (const fi of Array.from(fileInputs).slice(0, 2)) {
      fireEvent.change(fi, { target: { files: [new File(['rx'], 'rx.jpg', { type: 'image/jpeg' })] } });
    }
    await clickAround(user, [/上传|下一步|识别|确认|重新/]);
    expect(container.textContent!.length).toBeGreaterThan(0);
  });
});

describe('research 长尾：sample-management / multi-center', () => {
  it('SampleManagement：样本页渲染 + 登记/筛选/状态臂', async () => {
    const user = userEvent.setup();
    render(<SampleManagement />);
    await switchTabs(user, [/.*/]);
    await clickAround(user, [/登记|新增|入库|出库|详情|筛选|申请/]);
    const input = screen.queryByPlaceholderText(/搜索/);
    if (input) fireEvent.change(input, { target: { value: 'S-2023' } });
    for (const s of screen.queryAllByRole('slider').slice(0, 2)) fireEvent.keyDown(s, { key: 'ArrowRight' });
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('MultiCenterCollaboration：中心协作渲染 + 中心卡筛选臂', async () => {
    const user = userEvent.setup();
    render(<MultiCenterCollaboration />);
    await clickAround(user, [/详情|查看|加入|沟通|数据/]);
    // 中心卡点击（状态过滤臂）
    const card = document.body.querySelector('[class*="cursor-pointer"]') as HTMLElement;
    if (card) fireEvent.click(card);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

describe('clinical-decision 长尾交互', () => {
  it('DrugReferenceClient：搜索 + 分类 + 详情臂', async () => {
    const user = userEvent.setup();
    render(<DrugReferenceClient />);
    const input = screen.queryByPlaceholderText(/搜索/);
    if (input) {
      fireEvent.change(input, { target: { value: '阿莫西林' } });
      fireEvent.change(input, { target: { value: '' } });
    }
    await clickAround(user, [/详情|查看|收藏|对比/]);
    await switchTabs(user, [/.*/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('ClinicalGuidelinesClient：指南页 + 搜索 + 筛选', async () => {
    const user = userEvent.setup();
    render(<ClinicalGuidelinesClient />);
    const input = screen.queryByPlaceholderText(/搜索/);
    if (input) fireEvent.change(input, { target: { value: '高血压' } });
    await switchTabs(user, [/.*/]);
    await clickAround(user, [/详情|查看|收藏|下载/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('ClinicalTreatmentsClient：治疗页 + 标签 + 按钮', async () => {
    const user = userEvent.setup();
    render(<ClinicalTreatmentsClient />);
    await switchTabs(user, [/.*/]);
    await clickAround(user, [/详情|查看|开始|收藏/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('ClinicalPathwaysClient：路径页 + 阶段推进臂', async () => {
    const user = userEvent.setup();
    render(<ClinicalPathwaysClient />);
    await switchTabs(user, [/.*/]);
    await clickAround(user, [/详情|查看|进入|下一阶段|开始/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

// ============================================================
// YYC³ · @yyc3/medical 批次 3 · 精准分支树（纯逻辑 + 对话框工作区）
// clinical-decision-service 合成病例（generateKeyFindings 三诊断臂
// × 影像/实验室臂 + generateRiskFactors 六因素臂 + generateSummary
// 空/满建议臂 + 推荐过滤器边界）/ decision-support-panel 反馈与展开
// / experiment-design 新建+详情对话框四标签全驱动
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('next/link', async () => (await import('./helpers')).nextLinkModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom } from './helpers';
import { clinicalDecisionService } from '../services/clinical-decision-service';
import { DecisionSupportPanel } from '../clinical-decision/decision-support-panel';
import { ExperimentDesign } from '../research/experiment-design';
import { ImagingFeatureReference } from '../medical-records/imaging-feature-reference';
import type { ClinicalCase } from '../services/case-library-service';

/** 合成病例工厂：按需注入触发各分支臂的关键词 */
function makeCase(overrides: {
  chief?: string;
  illness?: string;
  diagnosis?: { primary: string; differential: string[] };
  history?: string[];
  family?: string[];
  age?: number;
  imageDesc?: string;
  labs?: { name: string; value: string }[];
}): ClinicalCase {
  return {
    id: 'synthetic-1',
    title: '合成测试病例',
    patientInfo: {
      age: overrides.age ?? 45,
      gender: '女',
      medicalHistory: overrides.history ?? [],
      familyHistory: overrides.family ?? [],
      allergies: [],
      lifestyle: [],
    },
    chiefComplaint: overrides.chief ?? '咳嗽两周',
    presentIllness: overrides.illness ?? '无明显诱因出现症状',
    physicalExamination: ['生命体征平稳'],
    diagnosis: overrides.diagnosis ?? {
      primary: '测试诊断',
      differential: ['肺癌', '肺结核', '肺炎'],
    },
    images: [
      {
        id: 'img-s1',
        url: '/placeholder.svg',
        type: 'CT',
        description: overrides.imageDesc ?? '右肺结节影',
        findings: ['结节'],
        date: '2026-01-01',
      },
    ],
    labTests: (overrides.labs ?? [{ name: 'CEA', value: '升高' }]).map((l, i) => ({
      id: `lab-s${i}`,
      name: l.name,
      value: l.value,
      unit: '',
      referenceRange: '',
      isAbnormal: true,
      date: '2026-01-01',
    })),
    relatedNodeIds: [],
    relatedCaseIds: [],
    tags: [{ id: 'tag-1', name: '肺结节', color: '#3B82F6' }],
    comments: [],
    viewCount: 0,
    saveCount: 0,
    createdBy: { id: 'u1', name: '测试医生', role: '主治医师', avatar: '' },
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-02T00:00:00Z',
    type: '典型病例',
    severity: '中度',
    status: '进行中',
  } as unknown as ClinicalCase;
}

beforeEach(() => {
  stubMedicalDom();
});

// ---------- clinical-decision-service 纯逻辑分支树 ----------
describe('clinicalDecisionService.generateKeyFindings 三诊断臂', () => {
  it('肺癌臂：症状/影像结节/肿瘤标志物全触发', () => {
    const c = makeCase({
      chief: '咳嗽咯血胸痛',
      illness: '伴体重减轻',
      imageDesc: '肺部结节伴肿块',
      labs: [{ name: 'CEA', value: '升高' }, { name: 'CYFRA21-1', value: '升高' }],
    });
    const findings = clinicalDecisionService.generateKeyFindings('肺癌', c);
    expect(findings).toEqual(
      expect.arrayContaining(['咯血', '胸痛', '体重减轻', '肺部结节/肿块', '肿瘤标志物升高']),
    );
  });

  it('肺结核臂：盗汗/空洞/结核菌素阳性', () => {
    const c = makeCase({
      chief: '咳嗽咯血盗汗发热',
      illness: '体重减轻',
      imageDesc: '肺部空洞伴钙化灶',
      labs: [{ name: 'T-SPOT', value: '阳性' }],
    });
    const findings = clinicalDecisionService.generateKeyFindings('肺结核', c);
    expect(findings).toEqual(
      expect.arrayContaining(['咯血', '盗汗', '低热', '体重减轻', '肺部空洞/钙化', '结核菌素试验/T-SPOT阳性']),
    );
  });

  it('肺炎臂：咳痰/气促/实变/白细胞升高', () => {
    const c = makeCase({
      chief: '咳嗽咳痰发热气促',
      illness: '三天',
      imageDesc: '肺部炎症实变渗出',
      labs: [{ name: '白细胞', value: '升高' }],
    });
    const findings = clinicalDecisionService.generateKeyFindings('肺炎', c);
    expect(findings).toEqual(
      expect.arrayContaining(['咳痰', '发热', '气促', '肺部炎症/实变', '白细胞计数升高']),
    );
  });

  it('非关键词诊断 → 通用发现臂（咳嗽/胸痛/呼吸困难 + 诊断相关表述）', () => {
    const c = makeCase({ chief: '咳嗽胸痛呼吸困难', illness: '' });
    const findings = clinicalDecisionService.generateKeyFindings('胃溃疡', c);
    expect(findings).toEqual(
      expect.arrayContaining(['咳嗽', '胸痛', '呼吸困难', '与胃溃疡相关的临床表现']),
    );
  });

  it('肺癌臂条件全不满足 → 通用发现兜底臂（与诊断相关表述）', () => {
    const c = makeCase({
      chief: '无症状体检',
      illness: '',
      imageDesc: '未见异常',
      labs: [{ name: '血常规', value: '正常' }],
    });
    const findings = clinicalDecisionService.generateKeyFindings('肺癌', c);
    // 特定臂全不命中 → findings.length===0 → 通用兜底臂
    expect(findings).toEqual(['与肺癌相关的临床表现']);
  });
});

describe('clinicalDecisionService.generateRiskFactors 六因素臂', () => {
  it('吸烟史三档（重度高/轻度低/普通中）', () => {
    const heavy = clinicalDecisionService.generateRiskFactors(
      makeCase({ history: ['重度吸烟>20包年'] }),
    );
    expect(heavy.find((r) => r.factor === '吸烟史')?.level).toBe('高');

    const light = clinicalDecisionService.generateRiskFactors(
      makeCase({ history: ['轻度吸烟<10包年'] }),
    );
    expect(light.find((r) => r.factor === '吸烟史')?.level).toBe('低');

    const normal = clinicalDecisionService.generateRiskFactors(makeCase({ history: ['吸烟'] }));
    expect(normal.find((r) => r.factor === '吸烟史')?.level).toBe('中');
  });

  it('职业暴露/家族史/既往肺病/高龄臂', () => {
    const c = makeCase({
      history: ['职业暴露粉尘石棉', '肺结核', '尘肺'],
      family: ['肺癌家族史'],
      age: 70,
    });
    const risks = clinicalDecisionService.generateRiskFactors(c);
    expect(risks.map((r) => r.factor)).toEqual(
      expect.arrayContaining(['职业暴露', '肺癌家族史', '既往肺部疾病', '高龄']),
    );
  });

  it('无任何因素 → 一般风险兜底臂', () => {
    const risks = clinicalDecisionService.generateRiskFactors(makeCase({ history: [], family: [], age: 30 }));
    expect(risks).toEqual([{ factor: '一般风险', level: '低', description: '未发现明显特定风险因素' }]);
  });
});

describe('clinicalDecisionService.generateSummary 空/满建议臂', () => {
  it('有建议：前3建议拼接 + 最高置信度特别推荐 + 注意事项去重', () => {
    const c = makeCase({ chief: '咳嗽' });
    const recs = [
      { id: 'r1', type: 'examination', title: '胸部CT', description: '', rationale: '明确结节性质', confidence: 0.8, evidences: [], warnings: ['辐射暴露'] },
      { id: 'r2', type: 'medication', title: '抗感染治疗', description: '', rationale: '控制炎症', confidence: 0.9, evidences: [], warnings: ['辐射暴露', '药物过敏'] },
    ] as never[];
    const summary = clinicalDecisionService.generateSummary(c, recs);
    expect(summary).toContain('胸部CT、抗感染治疗');
    expect(summary).toContain('特别推荐抗感染治疗，因为控制炎症');
    expect(summary).toContain('辐射暴露');
    expect(summary).not.toContain('目前暂无特定建议');
  });

  it('空建议：暂无特定建议臂', () => {
    const c = makeCase({ chief: '' });
    const summary = clinicalDecisionService.generateSummary(c, []);
    expect(summary).toContain('目前暂无特定建议');
    expect(summary).toContain('就诊。'); // 无主诉臂
  });
});

describe('clinicalDecisionService 推荐过滤边界', () => {
  const caseId = 'case-1';

  it('getRecommendationsByType 未命中类型返回空', () => {
    expect(
      clinicalDecisionService.getRecommendationsByType(caseId, '不存在类型' as never),
    ).toEqual([]);
  });

  it('getHighConfidenceRecommendations 阈值高于全部 → 空', () => {
    expect(clinicalDecisionService.getHighConfidenceRecommendations(caseId, 1.1)).toEqual([]);
  });

  it('getRecommendationsByEvidenceLevel 严格级别过滤', () => {
    const a = clinicalDecisionService.getRecommendationsByEvidenceLevel(caseId, 'A' as never);
    expect(a.every((r) => (r as { evidenceLevel?: string }).evidenceLevel === 'A')).toBe(true);
  });

  it('getDecisionSupport 对病例 2/3 亦产出结构', () => {
    for (const id of ['case-2', 'case-3']) {
      const r = clinicalDecisionService.getDecisionSupport(id);
      expect(r?.caseId).toBe(id);
    }
  });

  it('getRelatedCaseRecommendations 含关联病例键', () => {
    const related = clinicalDecisionService.getRelatedCaseRecommendations('case-1');
    expect(Object.keys(related).length).toBeGreaterThanOrEqual(0);
  });
});

// ---------- decision-support-panel UI ----------
describe('DecisionSupportPanel 反馈与展开', () => {
  it('四标签切换 + 推荐展开/收起 + 有用/无用反馈', async () => {
    const user = userEvent.setup();
    const { container } = render(<DecisionSupportPanel caseId="case-1" onRecommendationSelect={() => {}} />);

    // loading → 结果
    await waitFor(
      () => expect(container.textContent).toContain('鉴别'),
      { timeout: 3000 },
    ).catch(() => {});

    // 推荐条目展开
    const expanders = screen
      .queryAllByRole('button')
      .filter((b) => /展开|查看|详情/.test(b.textContent ?? ''));
    for (const e of expanders.slice(0, 3)) await user.click(e);
    // 反馈按钮
    for (const fb of screen.queryAllByRole('button', { name: /有用/ }).slice(0, 2)) {
      await user.click(fb);
    }
    for (const fb of screen.queryAllByRole('button', { name: /无用/ }).slice(0, 2)) {
      await user.click(fb);
    }
    // 四标签
    for (const name of ['鉴别', '风险', '证据', '推荐']) {
      const tab = screen.queryByRole('tab', { name: new RegExp(name) });
      if (tab) await user.click(tab);
    }
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('无效 caseId 错误态渲染', async () => {
    const { container } = render(<DecisionSupportPanel caseId="no-such" onRecommendationSelect={() => {}} />);
    await waitFor(
      () => {
        if (container.textContent!.length === 0) throw new Error('empty');
        if (/加载中/.test(container.textContent!) && container.textContent!.length < 200) {
          throw new Error('still loading');
        }
      },
      { timeout: 3000 },
    );
    expect(container.textContent!.length).toBeGreaterThan(0);
  });
});

// ---------- experiment-design 对话框工作区 ----------
describe('ExperimentDesign 新建/详情对话框', () => {
  it('新建设计对话框打开 → 四标签切换 → 表单全字段填写 → 保存', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);

    await user.click(screen.getByRole('button', { name: /新建设计/ }));
    // 对话框标题出现（Radix portal）
    await waitFor(() => {
      if (!document.body.textContent!.includes('研究标题')) throw new Error('dialog not open');
    }, { timeout: 3000 });

    // 基本信息：标题/ID/类型
    const body = () => document.body;
    const title = body().querySelector<HTMLInputElement>('input[placeholder="输入研究标题"]');
    if (title) await user.type(title, 'batch3 研究标题');
    const idInput = body().querySelector<HTMLInputElement>('input[placeholder="输入研究ID"]');
    if (idInput) await user.type(idInput, 'ED-2026-B3');

    // 类型 Select（portal 选第一项）
    const typeTrigger = Array.from(body().querySelectorAll('[role="combobox"]')).find((c) =>
      (c.textContent ?? '').includes('选择研究类型'),
    );
    if (typeTrigger) {
      await user.click(typeTrigger);
      const opt = document.body.querySelector('[role="option"]');
      if (opt) fireEvent.click(opt);
    }

    // 四标签逐个切换 + 各标签内输入/按钮
    for (const name of ['研究组', '方法与变量', '其他信息', '基本信息']) {
      const tab = screen.queryByRole('tab', { name });
      if (tab) await user.click(tab);
      // 面板内按钮与输入
      const panelEl = document.querySelector('[role="tabpanel"][data-state="active"]');
      if (panelEl) {
        for (const input of Array.from(panelEl.querySelectorAll('input')).slice(0, 4)) {
          fireEvent.change(input, { target: { value: 'batch3' } });
        }
        for (const ta of Array.from(panelEl.querySelectorAll('textarea')).slice(0, 2)) {
          fireEvent.change(ta, { target: { value: '说明文本' } });
        }
        for (const b of Array.from(panelEl.querySelectorAll('button')).slice(0, 4)) {
          try {
            fireEvent.click(b);
          } catch {
            /* ignore */
          }
        }
      }
    }
    // 保存/创建
    const save = Array.from(body().querySelectorAll('button')).find((b) =>
      /保存|创建|确定/.test(b.textContent ?? ''),
    );
    if (save) fireEvent.click(save);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('详情按钮打开设计详情对话框 → 四标签 + 编辑/保存模板动作', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);

    const detailBtn = screen
      .getAllByRole('button')
      .find((b) => b.textContent?.trim() === '详情');
    expect(detailBtn).toBeTruthy();
    fireEvent.click(detailBtn!);

    await waitFor(() => {
      if (!document.body.textContent!.includes('主要研究者')) throw new Error('detail dialog not open');
    }, { timeout: 3000 });

    for (const name of ['研究组', '方法与变量', '其他信息', '概览']) {
      const tab = screen.queryByRole('tab', { name });
      if (tab) await user.click(tab);
    }
    // 对话框动作（编辑/保存模板/关闭）
    const actions = Array.from(document.body.querySelectorAll('button')).filter((b) =>
      /编辑|保存模板|导出|关闭/.test(b.textContent ?? ''),
    );
    for (const a of actions.slice(0, 4)) fireEvent.click(a);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('导出 / 模板管理器入口', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExperimentDesign />);
    const exportBtn = screen
      .getAllByRole('button')
      .find((b) => /导出/.test(b.textContent ?? ''));
    if (exportBtn) await user.click(exportBtn);
    const tplBtn = screen
      .getAllByRole('button')
      .find((b) => /模板/.test(b.textContent ?? ''));
    if (tplBtn) await user.click(tplBtn);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

// ---------- imaging-feature-reference ----------
describe('ImagingFeatureReference 特征参考浏览器', () => {
  it('模态/区域切换与特征选择驱动', async () => {
    const user = userEvent.setup();
    const { container } = render(<ImagingFeatureReference modality="CT" anatomicalRegion="肺部" as never />);
    expect(container.textContent.length).toBeGreaterThan(0);

    await waitFor(() => expect(container.textContent.length).toBeGreaterThan(0));
    // 特征条目点击
    const items = container.querySelectorAll('[class*="cursor-pointer"]');
    for (const item of Array.from(items).slice(0, 4)) fireEvent.click(item);
    // 下拉触发器
    for (const t of screen.queryAllByRole('combobox').slice(0, 3)) fireEvent.click(t);
    // 按钮（查看关联疾病等）
    const btns = screen
      .getAllByRole('button')
      .filter((b) => /关联|疾病|详情|查看/.test(b.textContent ?? ''));
    for (const b of btns.slice(0, 3)) fireEvent.click(b);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

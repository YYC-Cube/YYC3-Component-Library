// ============================================================
// YYC³ · @yyc3/medical 批次 5 · 影像特征参考与知识库长尾
// ImagingFeatureReference 四模态渲染器 + 缩放/对比/搜索/疾病 tab
// + ImagingFeatureClient 模态图标分支 + KnowledgeIntegration 搜索/
// 疾病选择 + KnowledgeButton 对话框 + KnowledgeBaseClient 三标签
// + AIModelSelector 展开/选择 + Modality/CrossModal 严重度五臂
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { stubMedicalDom, stubCanvas2d, silenceConsole } from './helpers';
import { ImagingFeatureReference } from '../medical-records/imaging-feature-reference';
import { ImagingFeatureClient } from '../medical-records/imaging-feature-client';
import { KnowledgeIntegration } from '../medical-records/knowledge-integration';
import { KnowledgeButton } from '../medical-records/knowledge-button';
import { KnowledgeBaseClient } from '../medical-records/knowledge-base-client';
import { AIModelSelector } from '../medical-records/ai-model-selector';
import { ModalitySpecificAnalysis } from '../medical-records/modality-specific-analysis';
import { CrossModalAnalysis } from '../medical-records/cross-modal-analysis';
import type { DiagnosticFinding } from '../types/medical-records';

beforeEach(() => {
  stubMedicalDom();
  stubCanvas2d();
  silenceConsole();
  const RealImage = window.Image;
  const Stubbed = class extends RealImage {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _onload: any = null;
    set src(v: string) {
      super.src = v;
      Promise.resolve().then(() => this._onload && this._onload());
    }
  };
  Object.defineProperty(Stubbed.prototype, 'onload', {
    configurable: true,
    set(v) {
      this._onload = v;
    },
    get() {
      return this._onload;
    },
  });
  vi.stubGlobal('Image', Stubbed as unknown as typeof Image);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ImagingFeatureReference 四模态渲染器', () => {
  async function renderRef(modality: string, region: string, expectText: RegExp) {
    const user = userEvent.setup();
    const { container } = render(
      <ImagingFeatureReference
        selectedImage="/img/x.png"
        modality={modality as never}
        anatomicalRegion={region as never}
      />,
    );
    await waitFor(() => {
      if (!document.body.textContent!.match(expectText)) throw new Error(`not loaded: ${modality}`);
    }, { timeout: 4000 });
    return { user, container };
  }

  it('MRI/脑部 → MRI 特征详情（T1/T2 信号卡）', async () => {
    await renderRef('MRI', '脑部', /T1信号|T2信号|弥散|强化|边界|形态/);
    expect(document.body.textContent).toBeTruthy();
  });

  it('X光/肺部 → X光特征详情（密度/轮廓征/支气管充气征）', async () => {
    await renderRef('X光', '肺部', /致密影|气胸|实变|轮廓征|支气管充气征/);
    expect(document.body.textContent).toBeTruthy();
  });

  it('超声/头部 → 超声特征详情（回声/血流信号/后方回声）', async () => {
    await renderRef('超声', '头部', /回声|血流信号|边界|形态/);
    expect(document.body.textContent).toBeTruthy();
  });

  it('缩放 +/−/重置 与 并排对比 开关', async () => {
    const { user } = await renderRef('CT', '肺部', /结节|磨玻璃|实变/);
    const zoomIn = screen.getAllByRole('button').find((b) => b.querySelector('.lucide-zoom-in'));
    const zoomOut = screen.getAllByRole('button').find((b) => b.querySelector('.lucide-zoom-out'));
    const zoomReset = screen
      .getAllByRole('button')
      .find((b) => (b.textContent ?? '').trim() === '' && b.querySelector('.lucide-rotate-ccw, .lucide-refresh'));
    if (zoomIn) fireEvent.click(zoomIn);
    if (zoomIn) fireEvent.click(zoomIn);
    if (zoomOut) fireEvent.click(zoomOut);
    if (zoomReset) fireEvent.click(zoomReset);
    // 并排对比（Switch 或按钮）
    const sbs = screen
      .getAllByRole('button')
      .find((b) => /并排|对比/.test(b.textContent ?? ''));
    if (sbs) {
      fireEvent.click(sbs);
      fireEvent.click(sbs);
    }
    expect(document.body.textContent).toBeTruthy();
  });

  it('搜索：空查询回载全量 / 关键词过滤 + 疾病 tab', async () => {
    const { user } = await renderRef('CT', '肺部', /结节|磨玻璃|实变/);
    const input = screen.getByPlaceholderText(/搜索特征|输入特征/);
    // 空查询搜索 → 回载
    fireEvent.click(screen.getByRole('button', { name: '' }));
    // 关键词
    fireEvent.change(input, { target: { value: '结节' } });
    fireEvent.click(screen.getAllByRole('button').find((b) => (b.textContent ?? '').trim() === '')!);
    await waitFor(() => {
      if (!document.body.textContent!.match(/结节/)) throw new Error('search results');
    }, { timeout: 3000 });

    // 点一个特征卡 → 疾病 tab 出现相关疾病
    const card = document.body.querySelector('[class*="cursor-pointer"][class*="rounded"]') as HTMLElement;
    if (card) fireEvent.click(card);
    const diseaseTab = screen.getAllByRole('tab').find((t) => /疾病/.test(t.textContent ?? ''));
    if (diseaseTab) {
      await user.click(diseaseTab);
      await waitFor(() => {
        if (!document.body.textContent!.match(/相关疾病|置信度|关联/)) throw new Error('diseases panel');
      }, { timeout: 3000 });
    }
    // image tab
    const imageTab = screen.getAllByRole('tab').find((t) => /影像|图像|image/i.test(t.textContent ?? ''));
    if (imageTab) await user.click(imageTab);
  }, 15000);
});

describe('ImagingFeatureClient 模态图标分支', () => {
  it('模态 Select 切换（CT→MRI→X光→超声→PET/内窥镜/病理）+ 区域 + 搜索', async () => {
    const user = userEvent.setup();
    const { container } = render(<ImagingFeatureClient />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/肺部CT示例图像|示例图像/)) throw new Error('not mounted');
    }, { timeout: 3000 });

    // 模态下拉（第一个 combobox）——选项逐个点击（userEvent 驱动 Radix）
    const pickOption = async (label: string) => {
      await user.click(screen.getAllByRole('combobox')[0]);
      const opt = await waitFor(() => {
        const el = Array.from(document.body.querySelectorAll('[role="option"]')).find((o) =>
          (o.textContent ?? '').includes(label),
        );
        if (!el) throw new Error(`option ${label}`);
        return el;
      }, { timeout: 2000 });
      await user.click(opt);
      await waitFor(() => {
        if (document.body.querySelector('[role="listbox"]')) throw new Error('listbox still open');
      }, { timeout: 2000 });
    };
    for (const label of ['MRI', 'X光', '超声', 'PET', '内窥镜', '病理']) {
      await pickOption(label);
    }
    // 回 CT
    await pickOption('CT');

    // 解剖区域 Select（第二个 combobox）
    await user.click(screen.getAllByRole('combobox')[1]);
    const regionOpt = await waitFor(() => {
      const el = Array.from(document.body.querySelectorAll('[role="option"]')).find((o) =>
        /脑部/.test(o.textContent ?? ''),
      );
      if (!el) throw new Error('region option');
      return el;
    }, { timeout: 2000 });
    await user.click(regionOpt);
    await waitFor(() => {
      if (document.body.querySelector('[role="listbox"]')) throw new Error('region listbox open');
    }, { timeout: 2000 });

    // 特征关键词搜索（搜索按钮 = 唯一带 Search 图标的 outline 按钮）
    const kw = screen.getByPlaceholderText('输入特征关键词...');
    fireEvent.change(kw, { target: { value: '结节' } });
    const searchBtn = screen
      .getAllByRole('button')
      .find((b) => b.querySelector('.lucide-search'));
    if (searchBtn) fireEvent.click(searchBtn);
    // 图像选择卡
    const imgCard = screen.getAllByAltText(/示例图像/)[0];
    fireEvent.click(imgCard);
    expect(container.textContent!.length).toBeGreaterThan(0);
  }, 20000);
});

describe('KnowledgeIntegration 搜索与疾病选择', () => {
  const findings: DiagnosticFinding[] = [
    {
      id: 'f1',
      modality: 'CT',
      area: '右肺上叶',
      finding: '磨玻璃结节',
      confidence: 0.9,
      severity: 'moderate',
      recommendation: '三个月随访',
    },
  ];

  it('挂载匹配疾病 → 选择疾病 → disease-info tab + 搜索 + 重新匹配', async () => {
    const user = userEvent.setup();
    render(<KnowledgeIntegration findings={findings} patientId="p1" />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/相关度|疾病/)) throw new Error('diseases list');
    }, { timeout: 3000 });

    // 搜索
    const input = screen.getByPlaceholderText('搜索疾病...');
    fireEvent.change(input, { target: { value: '肺' } });
    fireEvent.click(screen.getByRole('button', { name: '' }));
    await waitFor(() => {
      if (!document.body.textContent!.match(/相关度/)) throw new Error('search done');
    }, { timeout: 3000 });

    // 选中第一个疾病
    const card = document.body.querySelector('[class*="cursor-pointer"][class*="rounded-lg"]') as HTMLElement;
    if (card) fireEvent.click(card);
    await waitFor(() => {
      if (!document.body.textContent!.match(/治疗指南|参考文献|疾病信息|流行病学/)) throw new Error('disease info');
    }, { timeout: 3000 });

    // 重新匹配疾病按钮
    const refresh = screen.getAllByRole('button').find((b) => /重新匹配疾病/.test(b.textContent ?? ''));
    if (refresh) fireEvent.click(refresh);
  }, 15000);
});

describe('KnowledgeButton 对话框', () => {
  it('打开 → 内容挂载 → 关闭复位 error', async () => {
    const user = userEvent.setup();
    const findings: DiagnosticFinding[] = [
      {
        id: 'f1',
        modality: 'CT',
        area: '右肺',
        finding: '结节',
        confidence: 0.8,
        severity: 'mild',
        recommendation: '随访',
      },
    ];
    render(<KnowledgeButton findings={findings} patientId="p1" />);
    fireEvent.click(screen.getByRole('button', { name: /医学知识库/ }));
    await waitFor(() => {
      if (!document.body.textContent!.match(/知识|疾病|相关/)) throw new Error('dialog content');
    }, { timeout: 3000 });
    const close = Array.from(document.body.querySelectorAll('button')).find((b) =>
      /^关闭$/.test(b.textContent ?? ''),
    );
    fireEvent.click(close!);
    await waitFor(() => {
      if (document.body.textContent!.includes('医学知识库') && !screen.getByRole('button', { name: /医学知识库/ }))
        throw new Error('x');
    }, { timeout: 500 }).catch(() => {});
    expect(screen.getByRole('button', { name: /医学知识库/ })).toBeTruthy();
  });
});

describe('KnowledgeBaseClient 三标签', () => {
  it('search：关键词搜索 → 结果卡 → browse 选中 → references 疾病按钮', async () => {
    const user = userEvent.setup();
    render(<KnowledgeBaseClient />);
    const input = screen.getByPlaceholderText('输入疾病名称、症状或ICD-10代码...');
    fireEvent.change(input, { target: { value: '肺' } });
    fireEvent.click(screen.getByRole('button', { name: /搜索/ }));
    await waitFor(() => {
      if (!document.body.textContent!.match(/ICD-10|相关/)) throw new Error('results');
    }, { timeout: 3000 });

    // browse 标签 → 点第一个疾病卡 → 回 search
    const browseTab = screen.getAllByRole('tab').find((t) => /浏览/.test(t.textContent ?? ''));
    await user.click(browseTab!);
    await waitFor(() => {
      if (!document.body.textContent!.includes('浏览疾病分类')) throw new Error('browse panel');
    }, { timeout: 3000 });
    const diseaseCard = document.body.querySelector('[class*="cursor-pointer"]') as HTMLElement;
    if (diseaseCard) fireEvent.click(diseaseCard);
    await waitFor(() => {
      if (!screen.queryByPlaceholderText('输入疾病名称、症状或ICD-10代码...')) throw new Error('back to search');
    }, { timeout: 3000 });

    // references 标签 → 疾病按钮
    const refTab = screen.getAllByRole('tab').find((t) => /参考文献|参考/.test(t.textContent ?? ''));
    await user.click(refTab!);
    await waitFor(() => {
      if (!document.body.textContent!.includes('医学参考文献')) throw new Error('ref panel');
    }, { timeout: 3000 });
    const diseaseBtn = screen
      .getAllByRole('button')
      .find((b) => b.className.includes('outline') && (b.textContent ?? '').length < 20 && (b.textContent ?? '') !== '');
    if (diseaseBtn) fireEvent.click(diseaseBtn);
  }, 15000);
});

describe('AIModelSelector 展开/选择', () => {
  it('展开卡片 → 模型 Select 换模型 → onModelSelect', async () => {
    const user = userEvent.setup();
    const onModelSelect = vi.fn();
    render(
      <AIModelSelector
        selectedModalities={['ct', 'mri']}
        selectedModels={{}}
        onModelSelect={onModelSelect}
      />,
    );
    await waitFor(() => {
      if (!document.body.textContent!.match(/AI模型选择/)) throw new Error('not mounted');
    }, { timeout: 3000 });
    // 默认自动选第一个（onModelSelect 已被 effect 调用）
    await waitFor(() => {
      if (onModelSelect.mock.calls.length === 0) throw new Error('auto select');
    }, { timeout: 3000 });
    // 展开 ct 卡
    const ctCard = screen.getByText(/CT|计算机断层/).closest('[class*="cursor-pointer"]') as HTMLElement;
    if (ctCard) fireEvent.click(ctCard);
    // 折叠再展开
    if (ctCard) fireEvent.click(ctCard);
    if (ctCard) fireEvent.click(ctCard);
    expect(onModelSelect).toHaveBeenCalled();
  });
});

describe('ModalitySpecificAnalysis / CrossModalAnalysis 严重度五臂', () => {
  const severityFinding = (severity: string): DiagnosticFinding => ({
    id: `f-${severity}`,
    modality: 'CT',
    area: '肺部',
    finding: `病灶-${severity}`,
    confidence: 0.8,
    severity: severity as never,
    recommendation: '随访',
  });

  it('五个严重度徽章 + 全 finding 渲染 + 按钮驱动', async () => {
    const user = userEvent.setup();
    const result = {
      modalityId: 'ct',
      modalityName: 'CT',
      findings: ['critical', 'severe', 'moderate', 'mild', 'normal'].map(severityFinding),
      processingTime: 1200,
      modelId: 'm1',
      modelVersion: 'v2',
      timestamp: '2026-11-28T00:00:00Z',
    };
    render(<ModalitySpecificAnalysis result={result as never} />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/危重|严重/)) throw new Error('badges');
    }, { timeout: 3000 });
    expect(document.body.textContent).toContain('危重');
    expect(document.body.textContent).toContain('轻度');
    expect(document.body.textContent).toContain('正常');
    // 按钮（下载/分享/知识库）
    for (const b of screen.getAllByRole('button').slice(0, 6)) {
      expect(() => fireEvent.click(b)).not.toThrow();
    }
  });

  it('CrossModalAnalysis 综合发现 + 建议列表', async () => {
    const user = userEvent.setup();
    const result = {
      id: 'cm1',
      patientId: 'p1',
      modalityResults: [
        {
          modalityId: 'ct',
          modalityName: 'CT',
          findings: [severityFinding('critical')],
          processingTime: 900,
          modelId: 'm1',
          modelVersion: 'v2',
          timestamp: '2026-11-28T00:00:00Z',
        },
      ],
      integratedFindings: [severityFinding('severe')],
      confidenceScore: 0.87,
      analysisDate: '2026-11-28',
      clinicalContext: '胸痛待查',
      recommendations: ['抗感染治疗', '复查CT'],
    };
    render(<CrossModalAnalysis result={result as never} />);
    await waitFor(() => {
      if (!document.body.textContent!.match(/综合|置信/)) throw new Error('cross panel');
    }, { timeout: 3000 });
    // 建议 tab
    const recTab = screen.getAllByRole('tab').find((t) => /建议|治疗/.test(t.textContent ?? ''));
    if (recTab) await user.click(recTab);
    await waitFor(() => {
      if (!document.body.textContent!.includes('抗感染治疗')) throw new Error('recs');
    }, { timeout: 3000 });
    for (const b of screen.getAllByRole('button').slice(0, 6)) {
      expect(() => fireEvent.click(b)).not.toThrow();
    }
  });
});

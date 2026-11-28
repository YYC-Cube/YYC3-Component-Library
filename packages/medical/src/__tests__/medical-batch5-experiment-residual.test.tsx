// ============================================================
// YYC³ · @yyc3/medical 批次 5 · ExperimentDesign 残余分支收官
// 搜索臂/空态/网格视图/标签页七值/QuickFilter 状态与日期 →
// FilterTags 徽章逐类 ×（searchTerm/数组/dateRange/伦理/创建者/样本/
// 预算）→ 新建对话框标签 prompt 三臂 + 模板链标签删除 →
// 详情关闭按钮 + SaveAsTemplateDialog 独立全驱动
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { stubMedicalDom, silenceConsole } from './helpers';
import { ExperimentDesign } from '../research/experiment-design';
import { SaveAsTemplateDialog } from '../components/save-as-template-dialog';
import { ExperimentFilterTags } from '../components/experiment-filter-tags';

beforeEach(() => {
  stubMedicalDom();
  silenceConsole();
  vi.stubGlobal('alert', vi.fn());
  vi.stubGlobal('prompt', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ExperimentDesign 列表区残余分支', () => {
  it('搜索无匹配 → 空态插画文案；清除搜索恢复', async () => {
    const user = userEvent.setup();
    render(<ExperimentDesign />);
    const input = screen.getByPlaceholderText('搜索设计标题、ID或研究者...');
    fireEvent.change(input, { target: { value: 'zzz-不存在' } });
    await waitFor(() => {
      if (!document.body.textContent!.includes('未找到匹配的试验设计')) throw new Error('empty state');
    });
    expect(document.body.textContent).toContain('尝试使用不同的搜索词');
    fireEvent.change(input, { target: { value: '' } });
    await waitFor(() => {
      if (document.body.textContent!.includes('未找到匹配的试验设计')) throw new Error('still empty');
    });
    expect(screen.getAllByText('EXP-001').length).toBeGreaterThan(0);
  });

  it('网格视图切换 → 卡片渲染 + 查看详情 → 详情关闭按钮', async () => {
    const user = userEvent.setup();
    render(<ExperimentDesign />);
    // LayoutGrid 图标按钮（viewMode 切换对）
    const gridBtn = screen.getAllByRole('button').find((b) => b.querySelector('.lucide-layout-grid'));
    fireEvent.click(gridBtn!);
    await waitFor(() => {
      if (!document.body.textContent!.includes('目标：')) throw new Error('grid cards');
    });
    expect(document.body.textContent).toContain('研究组：');

    const cardDetail = screen
      .getAllByRole('button')
      .find((b) => /查看详情/.test(b.textContent ?? ''));
    fireEvent.click(cardDetail!);
    await waitFor(() => {
      if (!document.body.textContent!.includes('主要研究者')) throw new Error('detail open');
    });
    const close = Array.from(document.body.querySelectorAll('button')).find((b) =>
      /^关闭$/.test(b.textContent ?? ''),
    );
    fireEvent.click(close!);
    await waitFor(() => {
      if (document.body.textContent!.includes('会诊')) throw new Error('x');
      if (document.body.querySelector('[role="dialog"]')) throw new Error('detail still open');
    });
  });

  it('七个标签页逐一驱动（activeTab 过滤臂）', async () => {
    const user = userEvent.setup();
    render(<ExperimentDesign />);
    for (const [tab, expectRow] of [
      ['临床研究', 'EXP-001'],
      ['动物实验', 'EXP-002'],
      ['方法学研究', 'EXP-003'],
      ['已批准', 'EXP-001'],
      ['进行中', 'EXP-002'],
      ['计划中', 'EXP-003'],
    ] as Array<[string, string]>) {
      await user.click(screen.getByRole('tab', { name: new RegExp(`^${tab}$`) }));
      await waitFor(() => {
        if (!document.body.textContent!.includes(expectRow)) throw new Error(`tab ${tab}`);
      });
      expect(document.body.textContent).toContain(expectRow);
    }
    await user.click(screen.getByRole('tab', { name: /所有设计/ }));
  });

  it('QuickFilter 状态筛选 → 徽章 × 移除（数组臂）', async () => {
    const user = userEvent.setup();
    render(<ExperimentDesign />);
    await user.click(screen.getByRole('button', { name: /快速筛选/ }));
    const item = await waitFor(() => {
      const el = Array.from(document.body.querySelectorAll('[role="menuitem"]')).find((x) =>
        /进行中/.test(x.textContent ?? ''),
      );
      if (!el) throw new Error('menu not open');
      return el;
    }, { timeout: 3000 });
    fireEvent.click(item);

    // 列表只剩 EXP-002 + 状态徽章出现
    await waitFor(() => {
      if (!document.body.textContent!.includes('状态: 进行中')) throw new Error('badge');
    });
    expect(screen.queryByText('EXP-001')).toBeNull();

    // × 移除（removeFilter 数组臂）
    const badge = screen.getByText('状态: 进行中').closest('span')!.parentElement!;
    const xBtn = Array.from(badge.querySelectorAll('button')).find(
      (b) => (b.textContent ?? '').trim() === '',
    );
    fireEvent.click(xBtn!);
    await waitFor(() => {
      if (document.body.textContent!.includes('状态: 进行中')) throw new Error('badge still');
    });
    expect(screen.getByText('EXP-001')).toBeTruthy();
  });

  it('QuickFilter 最近三个月 → 日期徽章 × 移除（dateRange 臂）+ 搜索徽章 ×（searchTerm 臂）', async () => {
    const user = userEvent.setup();
    render(<ExperimentDesign />);

    // 日期快筛
    await user.click(screen.getByRole('button', { name: /快速筛选/ }));
    const item = await waitFor(() => {
      const el = Array.from(document.body.querySelectorAll('[role="menuitem"]')).find((x) =>
        /最近三个月/.test(x.textContent ?? ''),
      );
      if (!el) throw new Error('menu not open');
      return el;
    }, { timeout: 3000 });
    fireEvent.click(item);
    await waitFor(() => {
      if (!document.body.textContent!.includes('日期:')) throw new Error('date badge');
    });
    const dateBadge = screen
      .getAllByText(/日期:/)
      .find((el) => el.className.includes('bg-secondary'))!
      .closest('span')!.parentElement!;
    const xBtn = Array.from(dateBadge.querySelectorAll('button')).find(
      (b) => (b.textContent ?? '').trim() === '',
    );
    fireEvent.click(xBtn!);
    await waitFor(() => {
      if (document.body.textContent!.includes('日期:')) throw new Error('date badge still');
    });

    // 搜索徽章 → searchTerm 臂
    const input = screen.getByPlaceholderText('搜索设计标题、ID或研究者...');
    fireEvent.change(input, { target: { value: '糖尿病' } });
    await waitFor(() => {
      if (!document.body.textContent!.includes('搜索: 糖尿病')) throw new Error('search badge');
    });
    const sBadge = screen.getByText('搜索: 糖尿病').closest('span')!.parentElement!;
    const sxBtn = Array.from(sBadge.querySelectorAll('button')).find(
      (b) => (b.textContent ?? '').trim() === '',
    );
    fireEvent.click(sxBtn!);
    await waitFor(() => {
      if (document.body.textContent!.includes('搜索: 糖尿病')) throw new Error('search badge still');
    });
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('高级筛选：伦理/创建者/样本 → 应用 → 三徽章 × 逐类移除', async () => {
    const user = userEvent.setup();
    render(<ExperimentDesign />);
    await user.click(screen.getByRole('button', { name: /高级筛选/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('基本筛选')) throw new Error('sheet not open');
    });

    // advanced 标签：伦理 Radio + 创建者 Switch
    await user.click(screen.getByRole('tab', { name: /高级选项/ }));
    const approvedRadio = document.getElementById('approved-ethics');
    if (approvedRadio) fireEvent.click(approvedRadio);
    const createdSwitch = document.getElementById('created-by-me');
    if (createdSwitch) fireEvent.click(createdSwitch);

    // research 标签：样本类型复选
    await user.click(screen.getByRole('tab', { name: /研究特性/ }));
    const sampleCb = screen
      .getAllByRole('checkbox')
      .find((c) => (c as HTMLInputElement).id.startsWith('sample-'));
    if (sampleCb) fireEvent.click(sampleCb);

    // 应用筛选
    const apply = screen.getByRole('button', { name: /应用筛选/ });
    fireEvent.click(apply);
    await waitFor(() => {
      if (!document.body.textContent!.includes('伦理批准:')) throw new Error('ethical badge');
    });
    expect(document.body.textContent).toContain('我创建的');

    // 样本徽章 ×（数组臂 with value）
    const sampleBadge = document.body.textContent!.match(/样本: /) ? true : false;
    if (sampleBadge) {
      const sb = screen.getByText(/^样本: /).closest('span')!.parentElement!;
      const bx = Array.from(sb.querySelectorAll('button')).find((b) => (b.textContent ?? '').trim() === '');
      if (bx) fireEvent.click(bx);
    }
    // 伦理徽章 ×（hasEthicalApproval 臂）
    const eb = screen.getByText(/^伦理批准:/).closest('span')!.parentElement!;
    const ex = Array.from(eb.querySelectorAll('button')).find((b) => (b.textContent ?? '').trim() === '');
    fireEvent.click(ex!);
    await waitFor(() => {
      if (document.body.textContent!.includes('伦理批准:')) throw new Error('ethical still');
    });
    // 创建者徽章 ×（createdByMe 臂）
    const cb = screen.getByText('我创建的').closest('span')!.parentElement!;
    const cx = Array.from(cb.querySelectorAll('button')).find((b) => (b.textContent ?? '').trim() === '');
    fireEvent.click(cx!);
    await waitFor(() => {
      if (document.body.textContent!.includes('我创建的')) throw new Error('created still');
    });
  });
});

describe('ExperimentDesign 新建对话框标签三臂 + 模板链标签删除', () => {
  async function openOtherTab(user: ReturnType<typeof userEvent.setup>, viaTemplate: boolean) {
    render(<ExperimentDesign />);
    if (viaTemplate) {
      const tplBtn = screen.getAllByRole('button').find((b) => /模板/.test(b.textContent ?? ''));
      await user.click(tplBtn!);
      await waitFor(() => {
        if (!document.body.textContent!.includes('使用此模板') && !document.body.textContent!.includes('模板库'))
          throw new Error('manager');
      }, { timeout: 3000 }).catch(() => {});
      const card = document.body.querySelector('[class*="cursor-pointer"]');
      if (card) fireEvent.click(card);
      const useBtn = await waitFor(() => {
        const b = Array.from(document.body.querySelectorAll('button')).find((x) =>
          /使用此模板/.test(x.textContent ?? ''),
        );
        if (!b) throw new Error('use btn');
        return b;
      }, { timeout: 3000 });
      await user.click(useBtn);
    } else {
      await user.click(screen.getByRole('button', { name: /新建设计/ }));
    }
    await waitFor(() => {
      if (!document.body.textContent!.includes('研究标题')) throw new Error('dialog');
    }, { timeout: 3000 });
    await user.click(screen.getByRole('tab', { name: /其他信息/ }));
  }

  it('prompt 输入标签 → 徽章出现；重复/取消被拒；× 删除', async () => {
    const user = userEvent.setup();
    await openOtherTab(user, false);
    const promptMock = vi.mocked(window.prompt);

    // 添加
    promptMock.mockReturnValue('batch5新标签');
    const add = screen.getByText('+ 添加');
    fireEvent.click(add);
    await waitFor(() => {
      if (!document.body.textContent!.includes('batch5新标签')) throw new Error('tag not added');
    });

    // 重复 → 拒绝（prompt 返回同值）
    promptMock.mockReturnValue('batch5新标签');
    fireEvent.click(add);
    expect(screen.getAllByText('batch5新标签').length).toBe(1);

    // 取消（null）→ 不加
    promptMock.mockReturnValue(null);
    fireEvent.click(add);
    expect(screen.getAllByText('batch5新标签').length).toBe(1);

    // × 删除（徽章内 lucide X）
    const badge = screen.getByText('batch5新标签').closest('span')!;
    const x = badge.querySelector('.lucide-x') as Element;
    fireEvent.click(x);
    await waitFor(() => {
      if (document.body.textContent!.includes('batch5新标签')) throw new Error('tag still');
    });
  });

  it('模板链预填标签 → × 删除臂', async () => {
    const user = userEvent.setup();
    await openOtherTab(user, true);
    // 模板标签（ExperimentTemplateManager 数据集）
    await waitFor(() => {
      if (!document.body.textContent!.match(/随机对照|临床试验|药物评估|队列研究|交叉试验|病例对照|诊断试验|糖尿病|肝纤维化|生物标志物|蛋白质组学|动物模型|药效评价/))
        throw new Error('no preset tags');
    }, { timeout: 3000 });
    const tagBadge = ['随机对照', '临床试验', '药物评估', '队列研究', '交叉试验', '病例对照', '诊断试验', '糖尿病', '肝纤维化', '生物标志物', '蛋白质组学', '动物模型', '药效评价']
      .flatMap((t) => screen.queryAllByText(t))
      .find((el) => el.className.includes('bg-secondary') && el.querySelector('.lucide-x'));
    expect(tagBadge).toBeTruthy();
    const tagText = tagBadge!.textContent ?? '';
    const countFormBadges = (t: string) =>
      screen.queryAllByText(t).filter((el) => el.className.includes('bg-secondary') && el.querySelector('.lucide-x')).length;
    const before = countFormBadges(tagText);
    const x = tagBadge!.querySelector('.lucide-x') as Element;
    fireEvent.click(x);
    await waitFor(() => {
      if (countFormBadges(tagText) >= before) throw new Error('tag still there');
    });
  });
});

describe('SaveAsTemplateDialog 独立全驱动', () => {
  it('空名保存 → alert 拦截；标签增删/重复；Switch；成功 onSave；取消', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <SaveAsTemplateDialog
        open
        onOpenChange={onOpenChange}
        onSave={onSave}
        experimentData={{ title: 'EXP-001 设计', tags: ['糖尿病', '生物标志物'] } as any}
      />,
    );

    // 预填名 + 预填标签
    expect((document.getElementById('template-name') as HTMLInputElement).value).toContain('EXP-001');
    expect(screen.getByText('糖尿病')).toBeTruthy();

    // 清空名称 → 保存 → alert 拦截（onSave 不调用）
    const nameInput = document.getElementById('template-name') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /保存模板/ }));
    expect(vi.mocked(window.alert)).toHaveBeenCalledWith('请输入模板名称');
    expect(onSave).not.toHaveBeenCalled();

    // 标签：添加（含重复拒绝 + 空输入拒绝）
    const tagInput = screen.getByPlaceholderText('添加标签');
    fireEvent.change(tagInput, { target: { value: 'batch5' } });
    fireEvent.click(screen.getByRole('button', { name: '' }));
    fireEvent.change(tagInput, { target: { value: 'batch5' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });
    expect(screen.getAllByText('batch5').length).toBe(1);
    // 空输入 + 按钮 → no-op
    fireEvent.change(tagInput, { target: { value: '' } });
    fireEvent.click(screen.getAllByRole('button').find((b) => (b.textContent ?? '').trim() === '')!);

    // 标签 × 删除
    const badge = screen.getByText('生物标志物').closest('span')!;
    fireEvent.click(badge.querySelector('.lucide-x')!);
    expect(screen.queryByText('生物标志物')).toBeNull();

    // Switch 公开
    const sw = document.getElementById('is-public');
    fireEvent.click(sw!);

    // 成功保存
    fireEvent.change(nameInput, { target: { value: 'batch5 模板' } });
    fireEvent.click(screen.getByRole('button', { name: /保存模板/ }));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'batch5 模板', isPublic: true }),
    );

    // 取消 → onOpenChange(false)
    fireEvent.click(screen.getByRole('button', { name: /^取消$/ }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('ExperimentFilterTags 空态', () => {
  it('无活跃筛选 → 渲染 null', () => {
    const { container } = render(
      <ExperimentFilterTags
        filters={{
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
        }}
        onRemoveFilter={vi.fn()}
        onClearFilters={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});

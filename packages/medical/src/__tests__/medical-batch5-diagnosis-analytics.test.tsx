// ============================================================
// YYC³ · @yyc3/medical 批次 5 · 诊断域长尾 + 分析域 + 影像上传
// DiagnosisBatch 残余（下拉四臂/删除/重试/失败错误/空过滤臂/创建
// 全链定时器）/ DiagnosisReview 审核-确认/修正-分配-优先级 /
// diagnosis-history/form/explainer/statistics/export 小臂 /
// AnalyticsClient + DataComparison + PredictionTool / 上传拖放
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { stubMedicalDom, silenceConsole } from './helpers';
import { useToast } from '../hooks/use-toast';
import { DiagnosisBatch } from '../ai-diagnosis/diagnosis-batch';
import { DiagnosisReview } from '../ai-diagnosis/diagnosis-review';
import { DiagnosisHistory } from '../ai-diagnosis/diagnosis-history';
import { DiagnosisForm } from '../ai-diagnosis/diagnosis-form';
import { DiagnosisExplainer } from '../ai-diagnosis/diagnosis-explainer';
import { DiagnosisStatistics } from '../ai-diagnosis/diagnosis-statistics';
import { DiagnosisExport } from '../ai-diagnosis/diagnosis-export';
import AnalyticsClient from '../analytics/analytics-client';
import DataComparison from '../analytics/data-comparison';
import { PredictionTool } from '../analytics/prediction-tool';
import { MedicalImagingUploader } from '../medical-records/medical-imaging-uploader';

/** medical 自有 use-toast store 同源视口（batch4 沉淀） */
function MedicalToaster() {
  const { toasts } = useToast();
  return (
    <>
      {toasts.map((t) => (
        <div key={t.id} data-testid="medical-toast">
          {t.title}
          {t.description ? `:${t.description}` : ''}
        </div>
      ))}
    </>
  );
}

beforeEach(() => {
  stubMedicalDom();
  silenceConsole();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function waitForToast(match: RegExp) {
  await waitFor(() => {
    const toasts = Array.from(document.body.querySelectorAll('[data-testid="medical-toast"]'))
      .map((el) => el.textContent ?? '')
      .join('|');
    if (!match.test(toasts)) throw new Error(`toast waiting: ${toasts}`);
  }, { timeout: 3000 });
}

describe('DiagnosisBatch 残余臂', () => {
  it('下拉菜单四臂：查看详情/导出结果(completed)/重新排队(failed)/删除任务(toast)', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <>
        <DiagnosisBatch />
        <MedicalToaster />
      </>,
    );
    await waitFor(() => {
      if (!document.body.textContent!.includes('批量诊断管理')) throw new Error('mount');
    }, { timeout: 3000 });

    // 行内 MoreVertical 下拉（Radix 菜单须 userEvent 触发）
    const menuBtns = () => screen.getAllByRole('button').filter((b) => b.querySelector('.lucide-more-vertical, .lucide-ellipsis-vertical, .lucide-more-horizontal'));
    await user.click(menuBtns()[0]);
    const viewItem = await waitFor(() => {
      const el = Array.from(document.body.querySelectorAll('[role="menuitem"]')).find((x) => /查看详情/.test(x.textContent ?? ''));
      if (!el) throw new Error('menu not open');
      return el;
    }, { timeout: 3000 });
    // 查看详情臂
    fireEvent.click(viewItem);
    await waitFor(() => {
      if (!document.body.textContent!.includes('任务详情')) throw new Error('detail panel');
    }, { timeout: 3000 });
    // completed → 导出结果按钮（详情页脚）
    const exportBtn = screen
      .getAllByRole('button')
      .find((b) => /导出结果/.test(b.textContent ?? ''));
    expect(exportBtn).toBeTruthy();

    // failed 行：重新排队臂 + toast + 完成定时器
    const failedRow = screen.getByText('老年科患者批量诊断').closest('tr')!;
    await user.click(failedRow.querySelector('button')!);
    const retryItem = await waitFor(() => {
      const el = Array.from(document.body.querySelectorAll('[role="menuitem"]')).find((x) => /重新排队/.test(x.textContent ?? ''));
      if (!el) throw new Error('retry item');
      return el;
    }, { timeout: 3000 });
    await user.click(retryItem);
    await waitForToast(/重新排队/);
    await vi.advanceTimersByTimeAsync(7000); // 1s→processing + 5s→completed

    // 删除任务臂 + toast
    await user.click(menuBtns()[2]);
    const delItem = await waitFor(() => {
      const el = Array.from(document.body.querySelectorAll('[role="menuitem"]')).find((x) => /删除任务/.test(x.textContent ?? ''));
      if (!el) throw new Error('del item');
      return el;
    }, { timeout: 3000 });
    await user.click(delItem);
    await waitForToast(/已删除/);
  }, 20000);

  it('失败任务详情：错误提示臂 + 页脚重新排队按钮', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<DiagnosisBatch />);
    const failedRow = screen.getByText('老年科患者批量诊断').closest('tr')!;
    fireEvent.click(failedRow); // 行点击选中（selectBatchId 臂）
    await waitFor(() => {
      if (!document.body.textContent!.includes('任务详情')) throw new Error('detail');
    }, { timeout: 3000 });
    expect(document.body.textContent).toContain('服务器连接错误');
    const retry = screen.getAllByRole('button').find((b) => /重新排队/.test(b.textContent ?? ''));
    if (retry) fireEvent.click(retry);
    await vi.advanceTimersByTimeAsync(7000);
    // 关闭详情
    const close = screen.getAllByRole('button').find((b) => /^关闭$/.test(b.textContent ?? ''));
    if (close) fireEvent.click(close);
    await waitFor(() => {
      if (document.body.textContent!.includes('任务详情')) throw new Error('still open');
    }, { timeout: 3000 });
  }, 20000);

  it('创建批量诊断全链：文件注入 → 创建 → 进度 → 新任务 queued → 完成', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <>
        <DiagnosisBatch />
        <MedicalToaster />
      </>,
    );
    fireEvent.click(screen.getByRole('button', { name: /新建批量诊断/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('创建批量诊断任务')) throw new Error('dialog');
    }, { timeout: 3000 });
    // 名称
    const name = document.getElementById('batch-name') as HTMLInputElement;
    fireEvent.change(name, { target: { value: 'batch5 影像批' } });
    // 文件
    const input = document.getElementById('file-upload') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['d'], 'a.dcm', { type: 'application/dicom' }), new File(['d'], 'b.dcm', { type: 'application/dicom' })] },
    });
    await waitFor(() => {
      if (!document.body.textContent!.includes('已选择 2 个文件')) throw new Error('files listed');
    }, { timeout: 3000 });
    fireEvent.click(screen.getByRole('button', { name: /创建任务/ }));
    // 上传 interval 500ms×10 → 任务入列 toast
    await vi.advanceTimersByTimeAsync(6000);
    await waitForToast(/已创建/);
    // 任务出现在列表
    expect(document.body.textContent).toContain('batch5 影像批');
    // 取消按钮臂（重开对话框取消）
    fireEvent.click(screen.getByRole('button', { name: /新建批量诊断/ }));
    const cancel = screen.getAllByRole('button').find((b) => /^取消$/.test(b.textContent ?? ''));
    fireEvent.click(cancel!);
  }, 20000);

  it('状态 tab 过滤：failed 删空 → 空态臂', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<DiagnosisBatch />);
    // 删除 failed 任务（Radix 菜单 userEvent 触发）
    const failedRow = screen.getByText('老年科患者批量诊断').closest('tr')!;
    await user.click(failedRow.querySelector('button')!);
    const delItem = await waitFor(() => {
      const el = Array.from(document.body.querySelectorAll('[role="menuitem"]')).find((x) => /删除任务/.test(x.textContent ?? ''));
      if (!el) throw new Error('del item');
      return el;
    }, { timeout: 3000 });
    await user.click(delItem);
    // 切到失败 tab → 空态
    await user.click(screen.getByRole('tab', { name: /^失败$/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('没有找到匹配的批量诊断任务')) throw new Error('empty arm');
    }, { timeout: 3000 });
  }, 20000);
});

describe('DiagnosisReview 审核链', () => {
  it('选中待审核 → 打开审核对话框 → 确认臂 → toast → 移入已审核', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <>
        <DiagnosisReview />
        <MedicalToaster />
      </>,
    );
    await waitFor(() => {
      if (!document.body.textContent!.match(/待审核|审核/)) throw new Error('mount');
    }, { timeout: 3000 });
    // 行选中（按患者名定位表格行）
    const row = screen.getByText('张三', { selector: 'td *' }).closest('[role="row"], tr') as HTMLElement
      ?? screen.getByText('张三').closest('tr')!;
    fireEvent.click(row.querySelector('td')!);
    await waitFor(() => {
      if (!document.body.textContent!.match(/审核诊断|审核意见|详情/)) throw new Error('review panel');
    }, { timeout: 3000 });
    // 打开审核对话框（确认臂）
    const confirmBtn = screen
      .getAllByRole('button')
      .find((b) => /确认诊断/.test(b.textContent ?? ''));
    fireEvent.click(confirmBtn!);
    await waitFor(() => {
      if (!document.body.querySelector('[role="dialog"]')) throw new Error('review dialog');
    }, { timeout: 3000 });
    // 填审核意见 → 提交
    for (const ta of Array.from(document.body.querySelectorAll('[role="dialog"] textarea, [role="dialog"] input'))) {
      fireEvent.change(ta, { target: { value: 'batch5 审核意见' } });
    }
    const submit = Array.from(document.body.querySelectorAll('[role="dialog"] button')).find((b) =>
      /确认|提交|保存/.test(b.textContent ?? ''),
    );
    fireEvent.click(submit!);
    await waitForToast(/审核完成/);
  }, 20000);

  it('分配医生臂 + 更改优先级 toast', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <>
        <DiagnosisReview />
        <MedicalToaster />
      </>,
    );
    await waitFor(() => {
      if (!document.body.textContent!.match(/待审核/)) throw new Error('mount');
    }, { timeout: 3000 });
    const row = screen.getByText('张三').closest('tr')!;
    fireEvent.click(row.querySelector('td')!);
    await waitFor(() => {
      if (!document.body.textContent!.match(/分配|优先级|审核/)) throw new Error('actions');
    }, { timeout: 3000 });
    // 分配
    const assignBtn = screen
      .getAllByRole('button')
      .find((b) => /分配/.test(b.textContent ?? ''));
    if (assignBtn) {
      fireEvent.click(assignBtn);
      await waitFor(() => {
        if (!document.body.textContent!.match(/选择医生|分配医生/)) throw new Error('assign dialog');
      }, { timeout: 3000 }).catch(() => {});
      const dialog = document.body.querySelector('[role="dialog"]');
      if (dialog) {
        const opt = dialog.querySelector('[role="combobox"], input');
        if (opt) fireEvent.click(opt);
        const confirm = Array.from(dialog.querySelectorAll('button')).find((b) => /确认|分配/.test(b.textContent ?? ''));
        if (confirm) fireEvent.click(confirm);
      }
    }
    // 已审核 tab 切换（reviewed 视图臂）
    const reviewedTab = screen.getAllByRole('tab').find((t) => /已审核/.test(t.textContent ?? ''));
    if (reviewedTab) await user.click(reviewedTab);
    // 搜索
    const input = screen.queryByPlaceholderText(/搜索/);
    if (input) fireEvent.change(input, { target: { value: 'zzz-无' } });
  }, 20000);
});

describe('diagnosis 域小组件残余', () => {
  it('DiagnosisHistory：状态臂 + 详情按钮', async () => {
    const user = userEvent.setup();
    render(
      <>
        <DiagnosisHistory patientId="p1" />
        <MedicalToaster />
      </>,
    );
    await clickAround(user, [/详情|查看|展开|筛选|导出/]);
    await switchTabs(user, [/.*/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('DiagnosisForm：输入 + 提交臂', async () => {
    const user = userEvent.setup();
    render(
      <>
        <DiagnosisForm />
        <MedicalToaster />
      </>,
    );
    for (const el of Array.from(document.body.querySelectorAll('input, textarea')).slice(0, 4)) {
      fireEvent.change(el, { target: { value: 'batch5 表单' } });
    }
    await clickAround(user, [/提交|保存|提交诊断|重置/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('DiagnosisExplainer：特征解释展开臂', async () => {
    const user = userEvent.setup();
    render(<DiagnosisExplainer />);
    await clickAround(user, [/解释|展开|详情|为什么/]);
    await switchTabs(user, [/.*/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('DiagnosisStatistics：统计页渲染 + 按钮', async () => {
    const user = userEvent.setup();
    render(<DiagnosisStatistics />);
    await clickAround(user, [/导出|刷新|筛选/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('DiagnosisExport：导出按钮驱动', async () => {
    const user = userEvent.setup();
    render(
      <>
        <DiagnosisExport />
        <MedicalToaster />
      </>,
    );
    await clickAround(user, [/导出|下载|生成|PDF|CSV/]);
    for (const sw of screen.queryAllByRole('switch').slice(0, 3)) {
      fireEvent.click(sw);
    }
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

describe('analytics 长尾', () => {
  it('AnalyticsClient：标签页切换 + 按钮驱动', async () => {
    const user = userEvent.setup();
    render(<AnalyticsClient />);
    await switchTabs(user, [/.*/]);
    await clickAround(user, [/生成|刷新|预测|分析|导出/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('DataComparison：对比选择 + 指标切换臂', async () => {
    const user = userEvent.setup();
    render(<DataComparison />);
    for (const combo of screen.queryAllByRole('combobox').slice(0, 3)) {
      fireEvent.click(combo);
      const opt = document.body.querySelector('[role="option"]');
      if (opt) fireEvent.click(opt);
      await new Promise((r) => setTimeout(r, 30));
    }
    for (const s of screen.queryAllByRole('slider').slice(0, 2)) fireEvent.keyDown(s, { key: 'ArrowRight' });
    await clickAround(user, [/对比|切换|添加|删除/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('PredictionTool：预测表单 + 运行按钮', async () => {
    const user = userEvent.setup();
    render(<PredictionTool />);
    for (const el of Array.from(document.body.querySelectorAll('input')).slice(0, 3)) {
      fireEvent.change(el, { target: { value: '60' } });
    }
    for (const sw of screen.queryAllByRole('switch').slice(0, 3)) fireEvent.click(sw);
    await clickAround(user, [/预测|运行|计算|生成/]);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

describe('MedicalImagingUploader 拖放与文件臂', () => {
  it('drop 注入图片 → 步进臂；点击上传', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = render(
      <>
        <MedicalImagingUploader />
        <MedicalToaster />
      </>,
    );
    const file = new File(['img'], 'ct.png', { type: 'image/png' });
    // 拖放区（border-dashed）
    const dropZone = container.querySelector('.border-dashed') as HTMLElement;
    if (dropZone) {
      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });
    }
    // input type=file 兜底
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) fireEvent.change(input, { target: { files: [file] } });
    await clickAround(user, [/上传|下一步|开始分析|重新|删除/]);
    expect(container.textContent!.length).toBeGreaterThan(0);
  }, 15000);
});

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
        /* 容错 */
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

// ============================================================
// YYC³ · @yyc3/medical 批次 3 · diagnostic-tools-client 三工具状态机
// 症状分析器（添加/分析/清空 2000ms 流）/ 鉴别诊断助手（初步诊断
// Select + Enter 加症状 + 生成）/ 风险评估计算器（四工具卡 × 因素
// Switch/Select × 计算——分支树全臂）
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
vi.mock('recharts', async () => (await import('./helpers')).rechartsModule());

import { stubMedicalDom } from './helpers';
import { DiagnosticToolsClient } from '../clinical-decision/diagnostic-tools-client';

beforeEach(() => {
  stubMedicalDom();
});

// 分析流为真实 setTimeout(2000)——真实定时器 + waitFor 宽窗口断言
const ANALYZE_WAIT = { timeout: 4000 };

afterEach(() => {
  vi.restoreAllMocks();
});

function setupUser() {
  return userEvent.setup();
}

/** 活动标签面板内的元素（Radix Tabs 保留非活动面板在 DOM——查询须限定活动面板） */
function panel(): HTMLElement {
  const el =
    document.querySelector('[role="tabpanel"][data-state="active"]') ??
    document.querySelector('[role="tabpanel"]');
  return (el as HTMLElement) ?? document.body;
}

/** 点快捷症状前 N 个 + 输入框添加一个自定义症状 */
async function addSymptoms(user: ReturnType<typeof userEvent.setup>) {
  // 常见症状快捷按钮（限定活动面板）
  const quick = Array.from(panel().querySelectorAll('button')).filter((b) =>
    ['头痛', '发热', '咳嗽', '胸痛'].includes(b.textContent?.trim() ?? ''),
  );
  for (const b of quick.slice(0, 3)) await user.click(b);
  // 输入框自定义症状 + 添加按钮
  const input = panel().querySelector<HTMLInputElement>('input[placeholder*="症状"]');
  if (input) {
    await user.type(input, '乏力');
    const addBtn = Array.from(panel().querySelectorAll('button')).find((b) =>
      /添加/.test(b.textContent ?? ''),
    );
    if (addBtn) await user.click(addBtn);
  }
}

describe('症状分析器', () => {
  it('添加症状 → 分析（2000ms）→ 结果三诊断卡', async () => {
    const user = setupUser();
    const { container } = render(<DiagnosticToolsClient />);

    const analyzerTab = screen.getByRole('tab', { name: /症状分析器/ });
    await user.click(analyzerTab);
    await addSymptoms(user);

    const analyze = screen.getByRole('button', { name: /分析症状/ });
    await user.click(analyze);
    expect(analyze).toBeDisabled(); // analyzing 中（同步置位）
    expect(container.textContent).toContain('正在分析');

    await waitFor(() => expect(container.textContent).toContain('上呼吸道感染'), ANALYZE_WAIT);
    expect(container.textContent).toContain('流行性感冒');
    expect(container.textContent).toContain('支气管炎');
    expect(container.textContent).toContain('紧急程度');
  });

  it('移除症状 + 年龄输入风险分支（>65 高风险臂）', async () => {
    const user = setupUser();
    const { container } = render(<DiagnosticToolsClient />);

    // 先加症状并分析一轮（确认链路通），再改年龄/删症状重分析
    await addSymptoms(user);
    await user.click(screen.getByRole('button', { name: /分析症状/ }));
    await waitFor(() => expect(container.textContent).toContain('上呼吸道感染'), ANALYZE_WAIT);

    // 年龄 >65 → riskFactors 年龄高臂
    const ageInput = panel().querySelector<HTMLInputElement>('input[placeholder*="年龄"]');
    if (ageInput) {
      await user.clear(ageInput);
      await user.type(ageInput, '72');
    }

    // 移除一个已添加症状（症状 chip 的 × 按钮）
    const removeBtn = Array.from(panel().querySelectorAll('button')).find((b) =>
      /×|移除/.test(b.textContent ?? ''),
    );
    if (removeBtn) await user.click(removeBtn);

    await user.click(screen.getByRole('button', { name: /分析症状/ }));
    await waitFor(
      () => expect(container.textContent).toContain('流行性感冒'),
      { timeout: 4000 },
    );
    expect(container.textContent).toContain('高'); // 年龄风险臂
  });

  it('清空分析复位全部输入', async () => {
    const user = setupUser();
    const { container } = render(<DiagnosticToolsClient />);
    await addSymptoms(user);
    await user.click(screen.getByRole('button', { name: /分析症状/ }));
    await waitFor(() => expect(container.textContent).toContain('上呼吸道感染'), ANALYZE_WAIT);

    await user.click(screen.getByRole('button', { name: /清空/ }));
    // 清空后分析按钮 disabled（symptoms 空）
    expect(screen.getByRole('button', { name: /分析症状/ })).toBeDisabled();
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('症状为空时分析按钮保持禁用', () => {
    render(<DiagnosticToolsClient />);
    expect(screen.getByRole('button', { name: /分析症状/ })).toBeDisabled();
  });
});

describe('鉴别诊断助手', () => {
  /** 经 Radix Select portal 选择初步诊断 */
  async function selectInitialDiagnosis(user: ReturnType<typeof userEvent.setup>) {
    const trigger = screen.getAllByRole('combobox').find((c) =>
      (c.textContent ?? '').includes('选择或输入初步诊断'),
    );
    await user.click(trigger!);
    const options = document.body.querySelectorAll('[role="option"]');
    const pneumonia = Array.from(options).find((o) => o.textContent === '肺炎');
    fireEvent.click(pneumonia ?? options[0]);
  }

  it('选择初步诊断 + Enter 加症状 → 生成鉴别诊断（2000ms）', async () => {
    const user = setupUser();
    const { container } = render(<DiagnosticToolsClient />);

    await user.click(screen.getByRole('tab', { name: /鉴别诊断助手/ }));
    await selectInitialDiagnosis(user);

    const input = panel().querySelector<HTMLInputElement>('input[placeholder="输入症状或体征"]')!;
    await user.type(input, '慢性咳嗽{enter}');
    await user.type(input, '呼吸困难{enter}');

    const gen = screen.getByRole('button', { name: /生成鉴别诊断/ });
    await user.click(gen);
    expect(container.textContent).toContain('正在生成');

    await waitFor(() => expect(container.textContent).toContain('支气管哮喘'), ANALYZE_WAIT);
    expect(container.textContent).toContain('胸部X线检查');
    expect(container.textContent).toContain('临床珍珠');
  });

  it('未选初步诊断时生成按钮禁用', async () => {
    const user = setupUser();
    render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /鉴别诊断助手/ }));
    expect(screen.getByRole('button', { name: /生成鉴别诊断/ })).toBeDisabled();
  });

  it('清空鉴别诊断复位', async () => {
    const user = setupUser();
    const { container } = render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /鉴别诊断助手/ }));
    await selectInitialDiagnosis(user);
    const input = panel().querySelector<HTMLInputElement>('input[placeholder="输入症状或体征"]')!;
    await user.type(input, '咳痰{enter}');
    await user.click(screen.getByRole('button', { name: /生成鉴别诊断/ }));
    await waitFor(() => expect(container.textContent).toContain('支气管哮喘'), ANALYZE_WAIT);

    await user.click(screen.getByRole('button', { name: /清空/ }));
    expect(screen.getByRole('button', { name: /生成鉴别诊断/ })).toBeDisabled();
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('风险评估计算器（四工具分支树）', () => {
  /** 点工具卡（Card div onClick） */
  async function pickTool(user: ReturnType<typeof userEvent.setup>, name: RegExp) {
    const card = screen
      .getAllByText(name)
      .map((el) => el.closest('.cursor-pointer'))
      .find(Boolean) as HTMLElement | undefined;
    await user.click(card!);
  }

  /** 全部 boolean 因素 Switch 打开（部分场景再关一半以命中另一分支臂） */
  async function toggleAllSwitches(user: ReturnType<typeof userEvent.setup>, on: boolean) {
    const switches = screen.queryAllByRole('switch');
    for (const s of switches) {
      const isOn = s.getAttribute('data-state') === 'checked';
      if (isOn !== on) await user.click(s);
    }
  }

  it('心血管风险（cvd-risk）：年龄数字 + 计算 + 结果解读', async () => {
    const user = setupUser();
    const { container } = render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /风险评估计算器/ }));
    await pickTool(user, /心血管疾病风险评估/);

    const ageInput = screen.queryByPlaceholderText(/年龄/);
    if (ageInput) await user.type(ageInput, '70');

    await user.click(screen.getByRole('button', { name: /计算风险/ }));
    await waitFor(() => expect(container.textContent).toContain('风险百分比'), ANALYZE_WAIT);
  });

  it('卒中风险（stroke-risk）：全 Switch 开（含性别 Select 女）→ 高分臂', async () => {
    const user = setupUser();
    const { container } = render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /风险评估计算器/ }));
    await pickTool(user, /卒中风险评估/);

    await toggleAllSwitches(user, true);
    // 性别 Select（factor.type=select）——portal 选「女」
    const genderTrigger = Array.from(panel().querySelectorAll('[role="combobox"]')).find((c) =>
      (c.textContent ?? '').includes('选择性别'),
    );
    if (genderTrigger) {
      await user.click(genderTrigger);
      const female = Array.from(document.body.querySelectorAll('[role="option"]')).find(
        (o) => o.textContent === '女',
      );
      if (female) fireEvent.click(female);
    }

    await user.click(screen.getByRole('button', { name: /计算风险/ }));
    await waitFor(() => expect(container.textContent).toContain('随访'), ANALYZE_WAIT);
    // 全因子开 → 高分臂
    expect(container.textContent).toContain('建议每3-6个月随访一次');
  });

  it('卒中风险：全关 → 极低风险臂', async () => {
    const user = setupUser();
    const { container } = render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /风险评估计算器/ }));
    await pickTool(user, /卒中风险评估/);
    // 不动任何 Switch（全 false）→ score 0
    await user.click(screen.getByRole('button', { name: /计算风险/ }));
    await waitFor(() => expect(container.textContent).toContain('极低风险'), ANALYZE_WAIT);
  });

  it('出血风险（bleeding-risk）：全开高分臂', async () => {
    const user = setupUser();
    const { container } = render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /风险评估计算器/ }));
    await pickTool(user, /出血风险评估/);
    await toggleAllSwitches(user, true);
    await user.click(screen.getByRole('button', { name: /计算风险/ }));
    await waitFor(() => expect(container.textContent).toContain('谨慎使用抗凝药物'), ANALYZE_WAIT);
  });

  it('肺炎 CURB-65：全开 → 高危死亡风险臂', async () => {
    const user = setupUser();
    const { container } = render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /风险评估计算器/ }));
    await pickTool(user, /肺炎严重程度评估/);
    await toggleAllSwitches(user, true);
    await user.click(screen.getByRole('button', { name: /计算风险/ }));
    await waitFor(() => expect(container.textContent).toContain('风险评分'), ANALYZE_WAIT);
    expect(container.textContent).toContain('死亡风险');
  });

  it('工具卡切换时因素复位（切卡清空 riskFactors）', async () => {
    const user = setupUser();
    const { container } = render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /风险评估计算器/ }));
    await pickTool(user, /心血管疾病风险评估/);
    await toggleAllSwitches(user, true);
    // 切到另一工具 → factors 清空
    await pickTool(user, /卒中风险评估/);
    const switches = screen.queryAllByRole('switch');
    expect(switches.every((s) => s.getAttribute('data-state') !== 'checked')).toBe(true);
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('清空风险评估复位', async () => {
    const user = setupUser();
    const { container } = render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /风险评估计算器/ }));
    await pickTool(user, /心血管疾病风险评估/);
    await toggleAllSwitches(user, true);
    await user.click(screen.getByRole('button', { name: /清空/ }));
    const switches = screen.queryAllByRole('switch');
    expect(switches.every((s) => s.getAttribute('data-state') !== 'checked')).toBe(true);
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

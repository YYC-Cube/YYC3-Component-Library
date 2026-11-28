// ============================================================
// YYC³ · @yyc3/medical 批次 5 · 诊断工具中段分支精算
// （batch3 已盖全开/全关臂，本文件补中间分数臂：
//   卒中 1/3 分 / 出血恰好 3 分 / 肺炎 CURB-65 恰 2 分 /
//   CVD Math.random 三档 / 年龄高低双臂 / 常见症状徽章 /
//   鉴别症状重复添加与移除臂）
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { stubMedicalDom, silenceConsole } from './helpers';
import { DiagnosticToolsClient } from '../clinical-decision/diagnostic-tools-client';

beforeEach(() => {
  stubMedicalDom();
  silenceConsole();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

/** 点风险评估卡（按工具名驱动） */
async function pickTool(user: ReturnType<typeof userEvent.setup>, name: RegExp) {
  const card = screen
    .getAllByText(name)
    .map((el) => el.closest('[class*="cursor-pointer"]') ?? el)
    .find((el) => el !== null) as HTMLElement;
  await user.click(card);
}

/** 当前工具面板内的计算按钮（"计算风险"） */
function calcButton() {
  return screen
    .getAllByRole('button')
    .find((b) => /计算风险/.test(b.textContent ?? ''));
}

function analyzeButton() {
  return screen
    .getAllByRole('button')
    .find((b) => /分析症状/.test(b.textContent ?? ''));
}

/** 勾选/取消一个风险因素（Label htmlFor → 控件 id） */
async function toggleFactor(user: ReturnType<typeof userEvent.setup>, label: RegExp, on: boolean) {
  const lab = screen
    .getAllByText(label)
    .map((el) => el.closest('label'))
    .filter(Boolean) as HTMLLabelElement[];
  const target = lab[lab.length - 1];
  if (!target) throw new Error(`label not found: ${label}`);
  const control = document.getElementById(target.getAttribute('for') ?? '');
  if (!control) throw new Error(`control not found for label: ${label}`);
  if (control.getAttribute('role') === 'switch') {
    const isOn = control.getAttribute('data-state') === 'checked';
    if (isOn !== on) await user.click(control as HTMLElement);
  } else if ((control as HTMLInputElement).type === 'checkbox') {
    const isOn = (control as HTMLInputElement).checked;
    if (isOn !== on) fireEvent.click(control);
  }
}

describe('风险评估计算器中段分支（batch5 补臂）', () => {
  it('CVD：Math.random 三档分别落低/中/高解读', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const randomSpy = vi.spyOn(Math, 'random');
    render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /风险评估/ }));
    await pickTool(user, /心血管疾病风险评估/);

    const expectations: Array<[number, RegExp]> = [
      [0.02, /低风险/],
      [0.5, /中等风险/],
      [0.95, /高风险/],
    ];
    for (const [rand, expectText] of expectations) {
      randomSpy.mockReturnValue(rand);
      fireEvent.click(calcButton()!);
      await vi.advanceTimersByTimeAsync(1600);
      await waitFor(() => {
        if (!document.body.textContent!.includes('风险评分')) throw new Error('no result');
      });
      expect(document.body.textContent).toMatch(expectText);
      const clear = screen.getAllByRole('button').find((b) => /^清空$/.test(b.textContent ?? ''));
      if (clear) await user.click(clear);
      await pickTool(user, /心血管疾病风险评估/);
    }
    randomSpy.mockRestore();
  });

  it('卒中：恰 1 分（年龄65-74）→ 低风险臂；恰 3 分 → 中等风险臂', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /风险评估/ }));
    await pickTool(user, /卒中风险评估/);

    await toggleFactor(user, /年龄65-74岁/, true);
    fireEvent.click(calcButton()!);
    await vi.advanceTimersByTimeAsync(1600);
    await waitFor(() => {
      if (!document.body.textContent!.match(/低风险/)) throw new Error('no low result');
    });
    expect(document.body.textContent).toMatch(/低风险/);

    await toggleFactor(user, /心力衰竭/, true);
    await toggleFactor(user, /^糖尿病$/, true);
    fireEvent.click(calcButton()!);
    await vi.advanceTimersByTimeAsync(1600);
    await waitFor(() => {
      if (!document.body.textContent!.match(/中等风险/)) throw new Error('no mid result');
    });
    expect(document.body.textContent).toMatch(/中等风险/);
  });

  it('出血：恰好 3 分 → 中等出血风险臂（含建议第二臂）', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /风险评估/ }));
    await pickTool(user, /出血风险评估/);

    for (const label of [/^高血压$/, /肾功能异常/, /肝功能异常/]) {
      await toggleFactor(user, label, true);
    }
    fireEvent.click(calcButton()!);
    await vi.advanceTimersByTimeAsync(1600);
    await waitFor(() => {
      if (!document.body.textContent!.match(/中等出血风险/)) throw new Error('no mid result');
    });
    expect(document.body.textContent).toMatch(/中等出血风险/);
  });

  it('肺炎 CURB-65：恰 2 分 → 中等风险住院臂 + 死亡率 6.8%', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /风险评估/ }));
    await pickTool(user, /肺炎严重程度评估/);

    for (const label of [/意识模糊/, /尿素/]) {
      await toggleFactor(user, label, true);
    }
    fireEvent.click(calcButton()!);
    await vi.advanceTimersByTimeAsync(1600);
    await waitFor(() => {
      if (!document.body.textContent!.match(/中等风险/)) throw new Error('no mid result');
    });
    expect(document.body.textContent).toMatch(/6\.8/);
  });

  it('患者年龄双臂：70 岁高风险描述 / 40 岁低风险描述', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /症状分析器/ }));

    // 高臂
    fireEvent.change(document.getElementById('patient-age') as HTMLInputElement, {
      target: { value: '70' },
    });
    fireEvent.change(screen.getByPlaceholderText('输入症状'), { target: { value: '发热' } });
    fireEvent.click(screen.getByRole('button', { name: '添加' }));
    fireEvent.click(analyzeButton()!);
    await vi.advanceTimersByTimeAsync(2100);
    await waitFor(() => {
      if (!document.body.textContent!.includes('老年人免疫功能下降')) throw new Error('high arm');
    });
    expect(document.body.textContent).toContain('高风险');

    // 清空 → 低臂
    fireEvent.click(screen.getAllByRole('button').find((b) => /清空/.test(b.textContent ?? ''))!);
    fireEvent.change(document.getElementById('patient-age') as HTMLInputElement, {
      target: { value: '40' },
    });
    fireEvent.change(screen.getByPlaceholderText('输入症状'), { target: { value: '咳嗽' } });
    fireEvent.click(screen.getByRole('button', { name: '添加' }));
    fireEvent.click(analyzeButton()!);
    await vi.advanceTimersByTimeAsync(2100);
    await waitFor(() => {
      if (!document.body.textContent!.includes('年龄不是主要风险因素')) throw new Error('low arm');
    });
    expect(document.body.textContent).toContain('低风险');
  });
});

describe('症状/鉴别诊断臂补盖', () => {
  it('常见症状徽章点击添加 + 重复添加被拒 + 徽章 × 移除', async () => {
    const user = userEvent.setup();
    render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /症状分析器/ }));

    // 常见症状区徽章（cursor-pointer outline Badge）
    const common = screen
      .getAllByText(/发热|咳嗽|头痛/)
      .find((el) => el.className.includes('cursor-pointer'));
    if (common) fireEvent.click(common);

    // 手动输入重复症状 → 不新增
    const input = screen.getByPlaceholderText('输入症状');
    fireEvent.change(input, { target: { value: '咳嗽' } });
    fireEvent.click(screen.getByRole('button', { name: '添加' }));
    const count = () => screen.getAllByText('咳嗽').length;
    const after1 = count();
    fireEvent.change(input, { target: { value: '咳嗽' } });
    fireEvent.click(screen.getByRole('button', { name: '添加' }));
    expect(count()).toBe(after1);

    // 徽章 × 移除：逐个移除症状徽章（常见症状区同名徽章仍在，须锁定 bg-secondary 徽章内按钮）
    for (let i = 0; i < 5; i++) {
      const badge = screen
        .getAllByText(/咳嗽|头痛/)
        .find((el) => el.className.includes('bg-secondary'));
      if (!badge) break;
      const times = badge.querySelector('button');
      if (!times) break;
      fireEvent.click(times);
    }
    expect(screen.queryByText('尚未添加症状，请添加至少一个症状')).toBeTruthy();
  });

  it('鉴别症状：重复添加被拒（false 臂）+ 添加后移除', async () => {
    const user = userEvent.setup();
    render(<DiagnosticToolsClient />);
    await user.click(screen.getByRole('tab', { name: /鉴别诊断/ }));

    const diffInput = screen.getByPlaceholderText('输入症状或体征');
    fireEvent.change(diffInput, { target: { value: '胸痛' } });
    fireEvent.keyDown(diffInput, { key: 'Enter' });
    fireEvent.keyDown(diffInput, { key: 'Enter' }); // 重复 → 拒绝
    expect(screen.getAllByText('胸痛').length).toBe(1);

    const badge = screen.getAllByText('胸痛')[0];
    const times = badge.parentElement?.querySelector('button');
    if (times) fireEvent.click(times);
    expect(screen.queryAllByText('胸痛').length).toBe(0);
  });
});

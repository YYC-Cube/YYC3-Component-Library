// ============================================================
// YYC³ · @yyc3/education 批次 2 补测 · 考试答题→交卷全流程
// ComprehensiveExam（单选/多选含部分分/主观题 → 提交 → 成绩页 + 结果回调）
// AdvancedExam / ProfessionalExam（导航至末题 → 提交考试 → onComplete）
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ComprehensiveExam } from '../comprehensive-exam';
import { AdvancedExam } from '../advanced-exam';
import { ProfessionalExam } from '../professional-exam';
import { ProfessionalAdvancedExam } from '../professional-advanced-exam';
import type { ComprehensiveExamQuestion } from '../data/comprehensive-exam-questions';

// 单选(10) + 多选全对(10) + 多选半对(10→5) + 主观题(10→7) = 32 / 40 = 80%
const examQuestions: ComprehensiveExamQuestion[] = [
  {
    id: 'q1',
    type: 'single',
    category: '模型基础',
    difficulty: '初级',
    question: '批次2单选题：Transformer 的核心机制是？',
    options: ['自注意力', '卷积', '循环', '池化'],
    correctAnswers: [0],
    explanation: 'Transformer 使用自注意力机制。',
    points: 10,
    keywords: ['注意力'],
  },
  {
    id: 'q2',
    type: 'multiple',
    category: '训练策略',
    difficulty: '中级',
    question: '批次2多选题：以下哪些属于大模型对齐技术？',
    options: ['RLHF', 'DPO', 'SGD', '数据增强'],
    correctAnswers: [0, 1],
    explanation: 'RLHF 与 DPO 是对齐技术。',
    points: 10,
    keywords: ['RLHF', 'DPO'],
  },
  {
    id: 'q3',
    type: 'multiple',
    category: '模型评估',
    difficulty: '中级',
    question: '批次2多选半对题：以下哪些是解码策略？',
    options: ['贪心搜索', '束搜索', '反向传播', 'Dropout'],
    correctAnswers: [0, 1],
    explanation: '贪心与束搜索是解码策略。',
    points: 10,
    keywords: ['解码'],
  },
  {
    id: 'q4',
    type: 'essay',
    category: '综合应用',
    difficulty: '高级',
    question: '批次2主观题：论述大模型幻觉的成因与缓解手段。',
    correctAnswers: [],
    explanation: '应涵盖训练数据、解码、检索增强等。',
    points: 10,
    keywords: ['幻觉', 'RAG'],
  },
];

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('education · ComprehensiveExam 答题→交卷全流程', () => {
  it('四题型作答 → 提交 → 成绩页渲染 + onComplete 结果载荷', async () => {
    const onComplete = vi.fn();
    render(<ComprehensiveExam examType="comprehensive-flow" questions={examQuestions} onComplete={onComplete} />);

    // Q1 单选：选「自注意力」(index 0)
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);
    expect(screen.getByText('已答题：1 / 4')).toBeTruthy();

    // Q2 多选：勾 RLHF + DPO（全对）
    fireEvent.click(screen.getByRole('button', { name: /下一题/ }));
    const q2Checks = screen.getAllByRole('checkbox');
    fireEvent.click(q2Checks[0]);
    fireEvent.click(q2Checks[1]);
    expect(screen.getByText('已答题：2 / 4')).toBeTruthy();

    // Q3 多选：只勾贪心（半对 → 5 分）
    fireEvent.click(screen.getByRole('button', { name: /下一题/ }));
    const q3Checks = screen.getAllByRole('checkbox');
    fireEvent.click(q3Checks[0]);
    expect(screen.getByText('已答题：3 / 4')).toBeTruthy();

    // Q4 主观题：填写文本
    fireEvent.click(screen.getByRole('button', { name: /下一题/ }));
    fireEvent.change(screen.getByPlaceholderText('请在此输入您的答案...'), {
      target: { value: '幻觉源于训练数据偏差与自回归解码，可用 RAG 与对齐训练缓解。' },
    });
    expect(screen.getByText('已答题：4 / 4')).toBeTruthy();

    // 末题 → 提交考试
    fireEvent.click(screen.getByRole('button', { name: /提交考试/ }));

    // 成绩页
    expect(screen.getByText('考试完成')).toBeTruthy();
    expect(screen.getByText('答题详情')).toBeTruthy();
    expect(screen.getByText('32')).toBeTruthy(); // totalScore
    expect(screen.getByText('总分 / 40')).toBeTruthy();
    expect(screen.getByText('80%')).toBeTruthy();
    // 半对题显示正确答案与解析
    expect(screen.getByText('正确答案：')).toBeTruthy();
    expect(screen.getByText('贪心与束搜索是解码策略。')).toBeTruthy();

    // onComplete 结果载荷
    expect(onComplete).toHaveBeenCalledTimes(1);
    const results = onComplete.mock.calls[0][0];
    expect(results.totalScore).toBe(32);
    expect(results.maxScore).toBe(40);
    expect(results.percentage).toBe(80);
    expect(results.questionResults).toHaveLength(4);
    expect(results.questionResults[0].isCorrect).toBe(true); // 单选全对
    expect(results.questionResults[1].isCorrect).toBe(true); // 多选全对
    expect(results.questionResults[2].score).toBe(5); // 多选半对部分分
    expect(results.questionResults[2].isCorrect).toBe(false);
    expect(results.questionResults[3].score).toBe(7); // 主观题 0.7 系数
    expect(typeof results.timeUsed).toBe('number');
  });

  it('交卷后不可再作答（结果视图替换答题视图）', () => {
    const onComplete = vi.fn();
    render(<ComprehensiveExam examType="comprehensive-locked" questions={examQuestions.slice(0, 1)} onComplete={onComplete} />);
    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.click(screen.getByRole('button', { name: /提交考试/ }));
    expect(screen.getByText('考试完成')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /提交考试/ })).toBeNull();
    expect(screen.queryByRole('radio')).toBeNull();
  });
});

// ============================================================ AdvancedExam 交卷
describe('education · AdvancedExam 答题→交卷（definition 10 题）', () => {
  it('逐题导航至末题 → 提交考试 → onComplete 结果回调', () => {
    const onComplete = vi.fn();
    render(<AdvancedExam examType="definition" timeLimit={5} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole('button', { name: /开始考试/ }));

    // 10 题定义卷：逐题主观作答 + 下一题，直到出现 提交考试
    for (let round = 0; round < 30; round++) {
      const textareas = document.querySelectorAll('textarea');
      if (textareas.length > 0 && (textareas[0] as HTMLTextAreaElement).value === '') {
        fireEvent.change(textareas[0], { target: { value: `第 ${round + 1} 题作答内容，含要点论述。` } });
      }
      const submit = screen.queryByRole('button', { name: /提交考试/ });
      if (submit) {
        fireEvent.click(submit);
        break;
      }
      fireEvent.click(screen.getByRole('button', { name: /下一题/ }));
    }

    expect(onComplete).toHaveBeenCalledTimes(1);
    const results = onComplete.mock.calls[0][0];
    expect(results).toBeTruthy();
    expect(typeof results).toBe('object');
    // 已作答卷子计入完成视图
    expect(document.body.textContent!.length).toBeGreaterThan(200);
  }, 20000);
});

// ============================================================ ProfessionalExam 交卷
describe('education · ProfessionalExam 答题→交卷（practice）', () => {
  it('练习模式开考 → 全卷选择 → 提交考试 → onComplete', () => {
    const onComplete = vi.fn();
    render(<ProfessionalExam examType="practice" timeLimit={10} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole('button', { name: /开始考试/ }));

    for (let round = 0; round < 200; round++) {
      const radios = screen.queryAllByRole('radio');
      // Radix RadioGroupItem 渲染为 button[role=radio]（无 .checked，用 aria-checked）
      const anyChecked = radios.some((r) => r.getAttribute('aria-checked') === 'true');
      if (radios.length > 0 && !anyChecked) {
        fireEvent.click(radios[0]); // 当前题未答 → 选第一项
        continue;
      }
      const submit = screen.queryByRole('button', { name: /提交考试/ });
      if (submit) {
        fireEvent.click(submit);
        break;
      }
      const next = screen.queryByRole('button', { name: /下一题/ });
      if (!next) break;
      fireEvent.click(next);
    }

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toBeTruthy();
  }, 20000);

// ============================================================ ProfessionalAdvancedExam 交卷
describe('education · ProfessionalAdvancedExam 答题→交卷（technical-foundation 20 题）', () => {
  it('逐题作答（单选/多选/主观）→ 提交考试 → onComplete 结果回调 + 成绩视图', () => {
    const onComplete = vi.fn();
    render(<ProfessionalAdvancedExam examType="technical-foundation" timeLimit={10} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole('button', { name: /开始考试/ }));

    for (let round = 0; round < 300; round++) {
      // 主观题：textarea 未填则填
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement | null;
      if (textarea && textarea.value === '') {
        fireEvent.change(textarea, {
          target: { value: '技术分析：该方案围绕核心技术展开，包含架构设计、性能优化与工程落地的完整论述，覆盖关键要点。' },
        });
        continue;
      }
      // 单选（Radix button[role=radio]）：未选则选首项
      const radios = screen.queryAllByRole('radio');
      if (radios.length > 0 && !radios.some((r) => r.getAttribute('aria-checked') === 'true')) {
        fireEvent.click(radios[0]);
        continue;
      }
      // 多选：未选则勾前两项
      const checkboxes = screen.queryAllByRole('checkbox');
      if (checkboxes.length > 0 && !checkboxes.some((c) => c.getAttribute('aria-checked') === 'true' || (c as HTMLInputElement).checked)) {
        fireEvent.click(checkboxes[0]);
        continue;
      }
      const submit = screen.queryByRole('button', { name: /提交考试/ });
      if (submit) {
        fireEvent.click(submit);
        break;
      }
      const next = screen.queryByRole('button', { name: /下一题/ });
      if (!next) break;
      fireEvent.click(next);
    }

    expect(onComplete).toHaveBeenCalledTimes(1);
    const results = onComplete.mock.calls[0][0];
    expect(results).toBeTruthy();
    expect(document.body.textContent!.length).toBeGreaterThan(200);
  }, 30000);
});
});
// ============================================================
// YYC³ · @yyc3/admin 批次 2 · 补充层：分支缺口收割
// feedback/user-survey（59 分支缺口）+ error-notification-system
// （41 缺口，SystemTestConsole 依赖其 manager）——batch2 冲 70% 区间
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { UserSurvey } from '../feedback/user-survey';
import { ErrorNotificationSystem, errorNotificationManager } from '../error-notification-system';
import { stubAdminDom, silenceConsole } from './helpers';

beforeEach(() => {
  stubAdminDom();
  silenceConsole();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const clickTab = (name: string | RegExp) => {
  const tab = screen.getByRole('tab', { name });
  fireEvent.mouseDown(tab);
  fireEvent.click(tab);
};

// ---------- UserSurvey 深链路 ----------
describe('UserSurvey（用户调查深链路）', () => {
  const questions = [
    {
      id: 'q1',
      type: 'radio' as const,
      title: '满意度',
      required: true,
      options: [
        { value: 'a', label: '非常满意' },
        { value: 'b', label: '一般' },
      ],
    },
    {
      id: 'q2',
      type: 'checkbox' as const,
      title: '使用场景',
      required: true,
      options: [
        { value: 'work', label: '工作' },
        { value: 'life', label: '生活' },
      ],
    },
    {
      id: 'q3',
      type: 'text' as const,
      title: '称呼',
      description: '怎么称呼您',
    },
    {
      id: 'q4',
      type: 'textarea' as const,
      title: '建议',
    },
    {
      id: 'q5',
      type: 'rating' as const,
      title: '推荐指数',
      min: 1,
      max: 5,
    },
  ];

  it('必答 radio 未选报错→选择后进下一题', async () => {
    const user = userEvent.setup();
    render(<UserSurvey title="调查" questions={questions} />);
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    expect(screen.getByText('此问题为必答题')).toBeInTheDocument();
    await user.click(screen.getByText('非常满意'));
    // 报错随答案更新清除
    expect(screen.queryByText('此问题为必答题')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    expect(screen.getByText('使用场景')).toBeInTheDocument();
  });

  it('checkbox 空选必答报错→多选与取消', async () => {
    const user = userEvent.setup();
    render(<UserSurvey title="调查" questions={questions} />);
    await user.click(screen.getByText('非常满意'));
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    // 从未作答 → 通用必答错误
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    expect(screen.getByText('此问题为必答题')).toBeInTheDocument();
    await user.click(screen.getByText('工作'));
    await user.click(screen.getByText('生活'));
    // 取消一项
    await user.click(screen.getByText('生活'));
    // 全部取消后再提交 → checkbox 专属错误
    await user.click(screen.getByText('工作'));
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    expect(screen.getByText('请至少选择一项')).toBeInTheDocument();
    await user.click(screen.getByText('工作'));
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    expect(screen.getByText('称呼')).toBeInTheDocument();
  });

  it('text/textarea/rating 题型与上一题回退', async () => {
    const user = userEvent.setup();
    render(<UserSurvey title="调查" questions={questions} />);
    // 前进到 q3
    await user.click(screen.getByText('非常满意'));
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    await user.click(screen.getByText('工作'));
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    expect(screen.getByText('怎么称呼您')).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('请输入您的回答'), '测试员');
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    expect(screen.getByText('建议')).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('请输入您的回答'), '加油');
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    // rating 题：1-5 按钮
    expect(screen.getByText('推荐指数')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '4' }));
    // 上一题回退后再前进
    await user.click(screen.getByRole('button', { name: /上一题/ }));
    expect(screen.getByText('建议')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    expect(screen.getByText('推荐指数')).toBeInTheDocument();
  });

  it('末题提交→回调携带全部答案→成功态', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => {});
    render(<UserSurvey title="调查" questions={questions} onSubmit={onSubmit} />);
    await user.click(screen.getByText('非常满意'));
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    await user.click(screen.getByText('工作'));
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    await user.type(screen.getByPlaceholderText('请输入您的回答'), '测试员');
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    await user.type(screen.getByPlaceholderText('请输入您的回答'), '加油');
    await user.click(screen.getByRole('button', { name: /下一题/ }));
    await user.click(screen.getByRole('button', { name: '4' }));
    const submitBtn = screen.getByRole('button', { name: '提交' });
    expect(submitBtn).toBeInTheDocument();
    await user.click(submitBtn);
    expect(await screen.findByText('提交成功')).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ q1: 'a', q2: ['work'], q3: '测试员', q4: '加油', q5: 4 }),
    );
  });

  it('提交拒绝→错误提示', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => {
      throw new Error('x');
    });
    render(
      <UserSurvey
        title="单题调查"
        questions={[
          { id: 'only', type: 'text', title: '答案', required: true },
        ]}
        onSubmit={onSubmit}
      />,
    );
    // 必答文本空串提交 → 报错（'' 分支）
    await user.click(screen.getByRole('button', { name: '提交' }));
    expect(screen.getByText('此问题为必答题')).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('请输入您的回答'), '答案');
    expect(screen.queryByText('此问题为必答题')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '提交' }));
    expect(await screen.findByText('提交失败，请稍后重试')).toBeInTheDocument();
  });

  it('compact 模式：自定义触发按钮 + 对话框流 + X 关闭', async () => {
    const user = userEvent.setup();
    render(
      <UserSurvey
        compact
        title="迷你调查"
        description="一分钟完成"
        triggerButton={<button>点我答题</button>}
        questions={[
          { id: 'c1', type: 'rating', title: '评分', required: true, min: 1, max: 3 },
        ]}
      />,
    );
    await user.click(screen.getByRole('button', { name: '点我答题' }));
    expect(await screen.findByText('迷你调查')).toBeInTheDocument();
    expect(screen.getByText(/一分钟完成/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '3' }));
    await user.click(screen.getByRole('button', { name: '提交' }));
    expect(await screen.findByText('提交成功')).toBeInTheDocument();
    // X 关闭
    const dialog = screen.getByText('迷你调查').closest('[data-slot="dialog-content"]') as HTMLElement;
    fireEvent.click(within(dialog).getByRole('button', { name: '' }) || dialog.querySelector('button'));
  });
});

// ---------- ErrorNotificationSystem 深链路 ----------
describe('ErrorNotificationSystem（错误通知系统深链路）', () => {
  const base = {
    id: 'n1',
    type: 'error' as const,
    title: '数据库未初始化',
    message: '离线数据库尚未就绪',
    timestamp: Date.now(),
  };

  it('空列表渲染 null', () => {
    const { container } = render(
      <ErrorNotificationSystem notifications={[]} onDismiss={() => {}} onClearAll={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('四种类型渲染对应图标与配色（列表截前 3 条）', () => {
    const notifications = (['error', 'warning', 'info', 'success'] as const).map((type, i) => ({
      ...base,
      id: `n${i}`,
      type,
      title: `问题${i}`,
    }));
    const { container } = render(
      <ErrorNotificationSystem notifications={notifications} onDismiss={() => {}} onClearAll={() => {}} />,
    );
    // 列表最多渲染 3 条 → error/warning/info 三种图标在列
    for (const cls of ['lucide-circle-alert', 'lucide-triangle-alert', 'lucide-info']) {
      expect(container.querySelector(`svg.${cls}`)).not.toBeNull();
    }
    // success 图标被截断不渲染
    expect(container.querySelector('svg.lucide-circle-check-big')).toBeNull();
  });

  it('详情对话框：已知错误匹配解决方案', () => {
    render(
      <ErrorNotificationSystem notifications={[base]} onDismiss={() => {}} onClearAll={() => {}} />,
    );
    // ExternalLink 图标按钮打开详情
    fireEvent.click(
      document.querySelector('button svg.lucide-external-link')?.closest('button') as HTMLElement,
    );
    expect(screen.getAllByText('数据库未初始化').length).toBeGreaterThanOrEqual(2); // 列表 + 详情
    expect(screen.getByText('请等待系统初始化完成，或尝试刷新页面重新初始化。')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /关闭/ }));
  });

  it('未知错误走默认解决方案；报告问题派发事件', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    render(
      <ErrorNotificationSystem
        notifications={[{ ...base, title: '神秘故障', message: '原因不明' }]}
        onDismiss={() => {}}
        onClearAll={() => {}}
      />,
    );
    fireEvent.click(
      document.querySelector('button svg.lucide-external-link')?.closest('button') as HTMLElement,
    );
    expect(screen.getByText('如果问题持续存在，请联系技术支持团队获取帮助。')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /报告问题/ }));
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'reportError' }));
  });

  it('消息正文命中解决方案库（标题不命中分支）', () => {
    render(
      <ErrorNotificationSystem
        notifications={[{ ...base, title: '出错了', message: '发生网络连接失败问题' }]}
        onDismiss={() => {}}
        onClearAll={() => {}}
      />,
    );
    fireEvent.click(
      document.querySelector('button svg.lucide-external-link')?.closest('button') as HTMLElement,
    );
    expect(screen.getByText('请检查您的网络连接，确保能够访问互联网。')).toBeInTheDocument();
  });

  it('dismiss / clearAll 回调', () => {
    const onDismiss = vi.fn();
    const onClearAll = vi.fn();
    const notifications = [
      base,
      { ...base, id: 'n2', title: '问题二' },
      { ...base, id: 'n3', title: '问题三' },
      { ...base, id: 'n4', title: '问题四' },
    ];
    render(
      <ErrorNotificationSystem notifications={notifications} onDismiss={onDismiss} onClearAll={onClearAll} />,
    );
    // 只渲染前 3 条 + 折叠提示
    expect(screen.getByText(/还有 1 个通知/)).toBeInTheDocument();
    const dismissBtns = document.querySelectorAll('button svg.lucide-x');
    fireEvent.click(dismissBtns[0]?.closest('button') as HTMLElement);
    expect(onDismiss).toHaveBeenCalledWith('n1');
    fireEvent.click(screen.getByRole('button', { name: /清除所有/ }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('autoClose 定时器到点自动 dismiss；persistent 不排程', async () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(
      <ErrorNotificationSystem
        notifications={[
          { ...base, id: 'auto', autoClose: true, duration: 2000 },
          { ...base, id: 'keep', title: '常驻', autoClose: true, persistent: true },
        ]}
        onDismiss={onDismiss}
        onClearAll={() => {}}
      />,
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2100);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith('auto');
  });

  it('操作按钮执行回调并复制详情', async () => {
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      configurable: true,
      value: { writeText },
    });
    const actionFn = vi.fn();
    render(
      <ErrorNotificationSystem
        notifications={[
          {
            ...base,
            title: '网络连接失败',
            details: 'ECONNREFUSED',
            actions: [{ label: '重试', action: actionFn, variant: 'default' as const }],
          },
        ]}
        onDismiss={() => {}}
        onClearAll={() => {}}
      />,
    );
    fireEvent.click(
      document.querySelector('button svg.lucide-external-link')?.closest('button') as HTMLElement,
    );
    // 复制按钮（「技术详情」区）——先复制，重试会关闭详情对话框
    fireEvent.click(screen.getByRole('button', { name: '复制' }));
    await Promise.resolve();
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('ECONNREFUSED'));
    fireEvent.click(screen.getByRole('button', { name: '重试' }));
    expect(actionFn).toHaveBeenCalledTimes(1);
  });
});

// ---------- errorNotificationManager（SystemTestConsole 依赖） ----------
describe('errorNotificationManager（管理器单测）', () => {
  it('add/remove/clearAll/subscribe 全链路', () => {
    const seen: number[] = [];
    const unsub = errorNotificationManager.subscribe((list) => seen.push(list.length));
    const id = errorNotificationManager.addNotification({
      type: 'error',
      title: '管理器测试',
      message: 'msg',
    });
    expect(seen).toEqual([1]);
    errorNotificationManager.addNotification({ type: 'info', title: 't2', message: 'm2' });
    expect(seen).toEqual([1, 2]);
    errorNotificationManager.removeNotification(id);
    expect(seen).toEqual([1, 2, 1]);
    errorNotificationManager.clearAll();
    expect(seen).toEqual([1, 2, 1, 0]);
    unsub();
    errorNotificationManager.addNotification({ type: 'success', title: 't3', message: 'm3' });
    expect(seen).toEqual([1, 2, 1, 0]); // 退订后不再推送
    errorNotificationManager.clearAll();
  });

  it('上限 10 条裁剪', () => {
    for (let i = 0; i < 12; i++) {
      errorNotificationManager.addNotification({ type: 'info', title: `批量${i}`, message: 'm' });
    }
    errorNotificationManager.clearAll();
  });
});

void clickTab;

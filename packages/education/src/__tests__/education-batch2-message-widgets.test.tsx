// ============================================================
// YYC³ · @yyc3/education 批次 2 补测 · 消息组件深交互（真实 IndexedDB）
// 批次 1 以内存桩 mock → 本件 fake-indexeddb 打真码：
// MessageSearch（防抖检索/筛选/历史/结果选择）
// MessageHistory（分页加载更多/筛选/导入导出/清空）
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import 'fake-indexeddb/auto';
import { messageStorage, type StoredMessage } from '../intelligent-ai-widget/message-storage';
import { MessageSearch } from '../intelligent-ai-widget/message-search';
import { MessageHistory } from '../intelligent-ai-widget/message-history';

const seedMessages = async () => {
  const now = Date.now();
  const seeds: StoredMessage[] = [
    { id: 'w1', role: 'user', content: '帮我解释一下机器学习基础概念', timestamp: now - 60_000, status: 'sent' },
    { id: 'w2', role: 'assistant', content: '机器学习是让计算机从数据中学习规律的方法', timestamp: now - 50_000, status: 'sent' },
    { id: 'w3', role: 'user', content: '深度学习和机器学习有什么区别', timestamp: now - 40_000, status: 'read' },
    { id: 'w4', role: 'assistant', content: '深度学习是机器学习的子集，使用神经网络', timestamp: now - 30_000, status: 'read' },
    { id: 'w5', role: 'system', content: '系统提示：会话已持久化', timestamp: now - 20_000 },
  ];
  for (const s of seeds) {
    await messageStorage.addMessage(s);
  }
  return seeds;
};

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(async () => {
  await messageStorage.clearMessages();
  vi.restoreAllMocks();
});

describe('education · MessageSearch 深交互（fake-indexeddb）', () => {
  it('防抖检索：输入 → 300ms 后命中并高亮 → 点击结果回调 onResultSelect', async () => {
    await seedMessages();
    const onResultSelect = vi.fn();
    render(<MessageSearch onResultSelect={onResultSelect} />);

    const input = screen.getByPlaceholderText('搜索消息内容...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '机器学习' } });

    // 结果区出现「找到 N 条结果」并渲染命中消息
    await waitFor(() => expect(screen.getByText(/找到 4 条结果/)).toBeTruthy(), { timeout: 3000 }); // '机器学习' 命中 w1/w2/w3/w4
    // SearchHighlight 将内容按关键词切分为多段 span，断言关键词前的分段
    expect(screen.getByText('帮我解释一下')).toBeTruthy();
    expect(screen.getByText('有什么区别')).toBeTruthy();

    // 点击第一条结果（关键词分段亦可）→ 回调携带完整消息对象
    fireEvent.click(screen.getByText('帮我解释一下'));
    expect(onResultSelect).toHaveBeenCalledTimes(1);
    expect(onResultSelect.mock.calls[0][0].id).toBe('w1');
  });

  it('筛选面板：时间范围 + 消息类型（assistant）过滤命中', async () => {
    await seedMessages();
    render(<MessageSearch />);
    const input = screen.getByPlaceholderText('搜索消息内容...') as HTMLInputElement;

    // 打开筛选器 → 类型切 assistant
    fireEvent.click(screen.getByRole('button', { name: /筛选/ }));
    fireEvent.click(screen.getByRole('button', { name: '助手' }));
    fireEvent.change(input, { target: { value: '机器学习' } });
    await waitFor(() => expect(screen.getByText(/找到 2 条结果/)).toBeTruthy(), { timeout: 3000 }); // assistant 中 w2/w4 命中

    // 时间范围「今天」仍命中
    fireEvent.click(screen.getByRole('button', { name: '今天' }));
    await waitFor(() => expect(screen.getByText(/找到 2 条结果/)).toBeTruthy(), { timeout: 3000 });
  });

  it('无命中空态 + 关键词清空按钮复位', async () => {
    await seedMessages();
    render(<MessageSearch />);
    const input = screen.getByPlaceholderText('搜索消息内容...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '绝不存在的关键词abc' } });
    await waitFor(() => expect(screen.getByText('未找到相关消息')).toBeTruthy(), { timeout: 3000 });

    // 清空（输入框内 X 按钮）→ 结果区复位
    const clearBtn = input.parentElement!.querySelector('button');
    expect(clearBtn).toBeTruthy();
    fireEvent.click(clearBtn!);
    await waitFor(() => expect((input as HTMLInputElement).value).toBe(''));
    expect(screen.queryByText('未找到相关消息')).toBeNull();
  });

  it('搜索历史：两次检索后聚焦输入框回显历史，点历史项可重查，清除可清', async () => {
    await seedMessages();
    render(<MessageSearch />);
    const input = screen.getByPlaceholderText('搜索消息内容...') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '深度学习' } });
    await waitFor(() => expect(screen.getByText(/找到 2 条结果/)).toBeTruthy(), { timeout: 3000 }); // w3/w4 均含'深度学习'
    fireEvent.change(input, { target: { value: '系统提示' } });
    await waitFor(() => expect(screen.getByText(/找到 1 条结果/)).toBeTruthy(), { timeout: 3000 });

    // 清空输入 → 历史面板（含两条历史）
    fireEvent.change(input, { target: { value: '' } });
    await waitFor(() => expect(screen.getByText('搜索历史')).toBeTruthy(), { timeout: 3000 });
    fireEvent.click(screen.getByRole('button', { name: '深度学习' }));
    await waitFor(() => expect((input as HTMLInputElement).value).toBe('深度学习'), { timeout: 3000 });

    // 清除历史
    fireEvent.change(input, { target: { value: '' } });
    await waitFor(() => expect(screen.getByText('清除')).toBeTruthy());
    fireEvent.click(screen.getByText('清除'));
    fireEvent.change(input, { target: { value: '' } });
    await waitFor(() => expect(screen.queryByText('搜索历史')).toBeNull(), { timeout: 3000 });
  });
});

describe('education · MessageHistory 深交互（fake-indexeddb）', () => {
  it('加载列表 + 共 N 条 + 载入聊天回调', async () => {
    await seedMessages();
    const onLoadMessages = vi.fn();
    render(<MessageHistory onLoadMessages={onLoadMessages} />);

    await waitFor(() => expect(screen.getByText('共 5 条消息')).toBeTruthy(), { timeout: 3000 });
    expect(screen.getByText('帮我解释一下机器学习基础概念')).toBeTruthy();

    // 载入到聊天
    const loadBtn = screen.getByRole('button', { name: /加载到对话/ });
    fireEvent.click(loadBtn);
    await waitFor(() => expect(onLoadMessages).toHaveBeenCalled());
    expect(onLoadMessages.mock.calls[0][0]).toHaveLength(5);
  });

  it('分页：>20 条种子 → 加载更多翻页（page2 追加）', async () => {
    const now = Date.now();
    const many: StoredMessage[] = Array.from({ length: 25 }, (_, i) => ({
      id: `pg-${i}`,
      role: 'user' as const,
      content: `批量消息 ${i + 1}`,
      timestamp: now - i * 1000,
    }));
    for (const s of many) await messageStorage.addMessage(s);

    const onLoadMessages = vi.fn();
    render(<MessageHistory onLoadMessages={onLoadMessages} />);
    await waitFor(() => expect(screen.getByText('共 25 条消息')).toBeTruthy(), { timeout: 3000 });

    const loadMore = screen.getByRole('button', { name: /加载更多/ });
    fireEvent.click(loadMore);
    await waitFor(() => {
      // 追加后页 2 尾条（最早的一条）可见
      expect(screen.getByText('批量消息 25')).toBeTruthy();
    });
    expect(screen.queryByRole('button', { name: /加载更多/ })).toBeNull(); // hasMore=false
  });

  it('筛选：类型 user 过滤 + 关键词搜索（回车触发）', async () => {
    await seedMessages();
    render(<MessageHistory onLoadMessages={() => {}} />);
    await waitFor(() => expect(screen.getByText('共 5 条消息')).toBeTruthy(), { timeout: 3000 });

    fireEvent.click(screen.getByRole('button', { name: /筛选/ }));
    fireEvent.click(screen.getByRole('button', { name: '用户' }));
    await waitFor(() => expect(screen.getByText('共 2 条消息')).toBeTruthy(), { timeout: 3000 });

    const input = screen.getByPlaceholderText('搜索消息内容...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '深度学习' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
    await waitFor(() => expect(screen.getByText('共 1 条消息')).toBeTruthy(), { timeout: 3000 });
    // MessageHistory 直接整串渲染 content（非高亮分段）
    expect(screen.getByText(/深度学习和机器学习有什么区别/)).toBeTruthy();
  });

  it('导入/导出：导出走 Blob 下载链；导入合法 JSON 回灌；清空历史（确认后）', async () => {
    await seedMessages();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, configurable: true });
    const clickSpy = vi.fn();
    const proto = HTMLAnchorElement.prototype as any;
    const origClick = proto.click;
    proto.click = clickSpy;

    try {
      render(<MessageHistory onLoadMessages={() => {}} />);
      await waitFor(() => expect(screen.getByText('共 5 条消息')).toBeTruthy(), { timeout: 3000 });

      fireEvent.click(screen.getByRole('button', { name: /导入\/导出/ }));

      // 导出：Blob + a.click 下载链
      fireEvent.click(screen.getByRole('button', { name: /导出消息/ }));
      await waitFor(() => expect(createObjectURL).toHaveBeenCalled());
      expect(clickSpy).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalled();

      // 导入：全新 id 的合法 JSON 文件（重复 id 会被 IndexedDB add 拒绝）
      const importPayload = JSON.stringify([
        { id: 'imp-1', role: 'user', content: '导入消息一', timestamp: Date.now() },
        { id: 'imp-2', role: 'assistant', content: '导入消息二', timestamp: Date.now() },
      ]);
      const file = new File([importPayload], 'messages.json', { type: 'application/json' });
      await waitFor(() => expect(document.querySelector('input[type="file"]')).toBeTruthy());
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
        await new Promise((r) => setTimeout(r, 80));
      });
      await waitFor(() => expect(alertSpy).toHaveBeenCalled());
      expect(String(alertSpy.mock.calls[0][0])).toContain('成功导入 2 条');
      await waitFor(() => expect(screen.getByText('共 7 条消息')).toBeTruthy(), { timeout: 3000 });

      // 清空历史（confirm true）→ 计数归零
      fireEvent.click(screen.getByRole('button', { name: /清空历史/ }));
      await waitFor(() => expect(screen.getByText('共 0 条消息')).toBeTruthy(), { timeout: 3000 });
      expect(confirmSpy).toHaveBeenCalled();
    } finally {
      proto.click = origClick;
    }
  }, 20000);

  it('清空历史：confirm 拒绝 → 数据保留', async () => {
    await seedMessages();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<MessageHistory onLoadMessages={() => {}} />);
    await waitFor(() => expect(screen.getByText('共 5 条消息')).toBeTruthy(), { timeout: 3000 });
    fireEvent.click(screen.getByRole('button', { name: /导入\/导出/ }));
    fireEvent.click(screen.getByRole('button', { name: /清空历史/ }));
    await waitFor(() => expect(screen.getByText('共 5 条消息')).toBeTruthy());
    expect(await messageStorage.getMessageCount()).toBe(5);
  });
});

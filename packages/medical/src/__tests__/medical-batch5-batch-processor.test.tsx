// ============================================================
// YYC³ · @yyc3/medical 批次 5 · BatchProcessor 全链驱动
// 上传进度定时器 → 已上传网格（preview 双臂）→ 任务名/类型 →
// 开始批处理 → 处理中表（等待/已处理/成功/失败/-）→ 完成 →
// 结果表全选/单选/删除对话框/新建批处理 + 处理设置对话框 + 历史
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { stubMedicalDom, silenceConsole } from './helpers';
import { BatchProcessor } from '../medical-records/batch-processor';

function stubCreateObjectURL(value: string | undefined) {
  Object.defineProperty(URL, 'createObjectURL', {
    writable: true,
    configurable: true,
    value: vi.fn(() => value),
  });
}

function fakeFiles(names: string[]) {
  return names.map(
    (n) => new File(['x'.repeat(1024)], n, { type: n.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg' }),
  );
}

beforeEach(() => {
  stubMedicalDom();
  silenceConsole();
  stubCreateObjectURL('blob:mock-preview');
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function upload(user: ReturnType<typeof userEvent.setup>, names: string[]) {
  render(<BatchProcessor />);
  const input = document.getElementById('file-upload') as HTMLInputElement;
  fireEvent.change(input, { target: { files: fakeFiles(names) } });
  // 上传进度定时器（200ms × 10 档 + 500ms 收尾）
  await vi.advanceTimersByTimeAsync(3200);
  await waitFor(() => {
    if (!document.body.textContent!.includes('已上传文件')) throw new Error('files not listed');
  }, { timeout: 3000 });
}

async function runBatch(user: ReturnType<typeof userEvent.setup>, name = 'batch5 任务') {
  fireEvent.change(document.getElementById('batch-name') as HTMLInputElement, {
    target: { value: name },
  });
  fireEvent.click(screen.getByRole('button', { name: /开始批处理/ }));
  // 处理定时器 500ms/文件 + 完成收尾
  await vi.advanceTimersByTimeAsync(2600);
  await waitFor(() => {
    if (!document.body.textContent!.includes('处理结果')) throw new Error('results not shown');
  }, { timeout: 3000 });
}

describe('BatchProcessor 上传链', () => {
  it('空文件列表 change → 早退臂（不进入上传态）', () => {
    render(<BatchProcessor />);
    const input = document.getElementById('file-upload') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [] } });
    expect(screen.queryByText(/上传进度/)).toBeNull();
    expect(screen.getByRole('button', { name: /选择文件/ })).toBeTruthy();
  });

  it('上传 2 个文件（图片+PDF）→ 网格预览臂 + 进度条出现又收起', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await upload(user, ['a.jpg', 'b.pdf']);
    expect(document.body.textContent).toContain('已上传文件 (2)');
    expect(document.body.textContent).toContain('批处理名称');
    // 预览 img（createObjectURL 真值臂）
    const img = document.querySelector('img[alt="a.jpg"]');
    expect(img).toBeTruthy();
  });

  it('preview 为空 → FileText 兜底臂；清空按钮复位', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    stubCreateObjectURL(undefined);
    await upload(user, ['c.png']);
    expect(document.body.textContent).toContain('已上传文件 (1)');
    expect(document.querySelector('img[alt="c.png"]')).toBeNull();

    const clear = screen.getByRole('button', { name: /清空/ });
    await user.click(clear);
    expect(screen.queryByText(/已上传文件/)).toBeNull();
  });
});

describe('BatchProcessor 批处理链', () => {
  it('开始批处理 → 处理中面板 → 完成切结果页（成功/失败徽章）', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await upload(user, ['a.jpg', 'b.jpg', 'c.pdf']);
    await runBatch(user, 'batch5 全链');

    // 结果页：任务名 + 统计卡 + 结果表
    expect(document.body.textContent).toContain('batch5 全链');
    expect(document.body.textContent).toContain('处理结果');
    // 10% 失败率：<10 个文件全成功
    expect(document.body.textContent).toContain('成功');
  });

  it('结果表：单选 → 删除所选按钮出现 → 确认删除对话框 → 行被删', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await upload(user, ['a.jpg', 'b.jpg']);
    await runBatch(user);

    const checkbox = screen.getAllByRole('checkbox')[1] as HTMLElement;
    fireEvent.click(checkbox);
    const del = screen.getByRole('button', { name: /删除所选/ });
    fireEvent.click(del);
    await waitFor(() => {
      if (!document.body.textContent!.includes('确认删除')) throw new Error('dialog not open');
    });
    fireEvent.click(screen.getByRole('button', { name: /确认删除/ }));
    await waitFor(() => {
      if (document.body.textContent!.includes('确认删除')) throw new Error('dialog still open');
    });
    expect(screen.queryByRole('button', { name: /删除所选/ })).toBeNull();
  });

  it('表头全选 → 全部选中；新建批处理回上传页', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await upload(user, ['a.jpg', 'b.jpg', 'c.jpg']);
    await runBatch(user);

    const headerCheckbox = screen.getAllByRole('checkbox')[0] as HTMLElement;
    fireEvent.click(headerCheckbox);
    expect(screen.getByRole('button', { name: /删除所选/ })).toBeTruthy();

    const newBatch = screen.getByRole('button', { name: /新建批处理/ });
    fireEvent.click(newBatch);
    await waitFor(() => {
      if (!document.body.textContent!.includes('批量上传文件')) throw new Error('back to upload');
    });
  });

  it('处理设置对话框：打开 → 引擎/优先级/开关 → 保存设置关闭', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await upload(user, ['a.jpg']);

    fireEvent.click(screen.getByRole('button', { name: /处理设置/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('批处理设置')) throw new Error('settings not open');
    });
    expect(document.body.textContent).toContain('OCR引擎选择');
    // 两个开关各切换一轮
    const switches = screen
      .getAllByRole('checkbox')
      .filter((el) => (el as HTMLInputElement).id);
    for (const sw of switches) {
      fireEvent.click(sw);
      fireEvent.click(sw);
    }
    fireEvent.click(screen.getByRole('button', { name: /保存设置/ }));
    await waitFor(() => {
      if (document.body.textContent!.includes('批处理设置')) throw new Error('settings still open');
    });
  });

  it('历史记录页：任务徽章双态 + 行内操作按钮', async () => {
    const user = userEvent.setup();
    render(<BatchProcessor />);
    await user.click(screen.getByRole('tab', { name: /历史记录/ }));
    expect(document.body.textContent).toContain('批处理历史');
    expect(document.body.textContent).toContain('4月门诊处方批量处理');
    expect(document.body.textContent).toContain('3月住院病历扫描件处理');
    // 行内 3 个 icon 按钮 × 2 行
    const iconButtons = screen
      .getAllByRole('button')
      .filter((b) => (b.textContent ?? '').trim() === '');
    expect(iconButtons.length).toBeGreaterThanOrEqual(6);
  });
});

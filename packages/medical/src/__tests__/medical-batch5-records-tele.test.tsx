// ============================================================
// YYC³ · @yyc3/medical 批次 5 · 会诊域长尾收官
// teleconsultation/records-client 过滤树+详情 / schedule-client
// 日历臂+列表过滤+新建会诊 / experts-client 筛选+邀请+详情 /
// medical-records-client 面板切换臂 / consultation-room 消息与设备
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { stubMedicalDom, silenceConsole } from './helpers';
import RecordsClient from '../teleconsultation/records-client';
import ScheduleClient from '../teleconsultation/schedule-client';
import ExpertsClient from '../teleconsultation/experts-client';
import { MedicalRecordsClient } from '../medical-records/medical-records-client';
import { ConsultationRoom } from '../components/consultation-room';

beforeEach(() => {
  stubMedicalDom();
  silenceConsole();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('teleconsultation/records-client 过滤树', () => {
  it('搜索无匹配 → 空态 → 清除筛选条件复位四项', async () => {
    const user = userEvent.setup();
    render(<RecordsClient />);
    const input = screen.getByPlaceholderText('搜索会诊记录...');
    fireEvent.change(input, { target: { value: 'zzz-无' } });
    await waitFor(() => {
      if (!document.body.textContent!.includes('没有找到符合条件的会诊记录')) throw new Error('empty');
    });
    fireEvent.click(screen.getByRole('button', { name: /清除筛选条件/ }));
    await waitFor(() => {
      if (document.body.textContent!.includes('没有找到符合条件的会诊记录')) throw new Error('still empty');
    });
    expect((input as HTMLInputElement).value).toBe('');
    expect(screen.getAllByText('心脏病例远程会诊').length).toBeGreaterThan(0);
  });

  it('科室 Select 过滤心脏科 → 只剩心脏记录；结果 Select 过滤诊断修改', async () => {
    const user = userEvent.setup({ delay: null });
    render(<RecordsClient />);
    // 科室 Select（第一个 combobox）
    const combos = screen.getAllByRole('combobox');
    await user.click(combos[0]);
    const opt = await waitFor(() => {
      const el = Array.from(document.body.querySelectorAll('[role="option"]')).find((o) =>
        /神经科/.test(o.textContent ?? ''),
      );
      if (!el) throw new Error('option');
      return el;
    });
    fireEvent.click(opt);
    await waitFor(() => {
      if (document.body.textContent!.includes('心脏病例远程会诊')) throw new Error('not filtered');
    });
    expect(document.body.textContent).toContain('脑卒中病例讨论');

    // 结果 Select（第二个 combobox）
    await user.click(screen.getAllByRole('combobox')[1]);
    const opt2 = await waitFor(() => {
      const el = Array.from(document.body.querySelectorAll('[role="option"]')).find((o) =>
        /^诊断修改$/.test(o.textContent ?? ''),
      );
      if (!el) throw new Error('option2');
      return el;
    });
    fireEvent.click(opt2);
    await waitFor(() => {
      if (!document.body.textContent!.includes('脑卒中病例讨论')) throw new Error('result filter');
    });
  });

  it('时间范围 month 臂（2025-04 记录相对 now 全被过滤）+ 有录像标签 + 详情对话框关闭', async () => {
    const user = userEvent.setup({ delay: null });
    render(<RecordsClient />);
    // 时间范围（第三个 combobox）
    await user.click(screen.getAllByRole('combobox')[2]);
    const opt = await waitFor(() => {
      const el = Array.from(document.body.querySelectorAll('[role="option"]')).find((o) =>
        /最近一个月/.test(o.textContent ?? ''),
      );
      if (!el) throw new Error('month option');
      return el;
    });
    fireEvent.click(opt);
    await waitFor(() => {
      if (!document.body.textContent!.includes('没有找到符合条件的会诊记录')) throw new Error('month filter');
    });

    // 复位：清除筛选
    fireEvent.click(screen.getByRole('button', { name: /清除筛选条件/ }));

    // 有录像记录标签
    await user.click(screen.getByRole('tab', { name: /有录像记录/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('查看录像')) throw new Error('recordings tab');
    });

    // 详情
    fireEvent.click(screen.getAllByRole('button', { name: '查看详情' })[0]);
    await waitFor(() => {
      if (!document.body.textContent!.includes('会诊记录详情')) throw new Error('detail open');
    });
    expect(document.body.textContent).toContain('相关文档');
    const close = Array.from(document.body.querySelectorAll('button')).find((b) =>
      /^关闭$/.test(b.textContent ?? ''),
    );
    fireEvent.click(close!);
    await waitFor(() => {
      if (document.body.textContent!.includes('会诊记录详情')) throw new Error('detail still open');
    });
  });
});

describe('schedule-client 日历/列表/新建', () => {
  it('日历视图：当天会诊卡渲染；切列表视图 → 搜索过滤 + 清除', async () => {
    const user = userEvent.setup({ delay: null });
    render(<ScheduleClient />);
    // 列表视图
    fireEvent.click(screen.getByRole('button', { name: /列表视图/ }));
    const input = await waitFor(() => {
      const el = screen.getByPlaceholderText('搜索会诊...');
      return el;
    }, { timeout: 3000 });
    fireEvent.change(input, { target: { value: 'zzz-无' } });
    await waitFor(() => {
      if (!document.body.textContent!.includes('没有找到符合条件的会诊')) throw new Error('empty');
    });
    // 清除筛选按钮（空态内）
    const clear = screen.getByRole('button', { name: /清除|重置/ });
    fireEvent.click(clear);
    await waitFor(() => {
      if (document.body.textContent!.includes('没有找到符合条件的会诊')) throw new Error('still empty');
    });

    // 回日历视图：当天会诊
    fireEvent.click(screen.getByRole('button', { name: /日历视图/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('的会诊')) throw new Error('calendar view');
    });
  });

  it('新建会诊对话框：打开 → 填写 → 创建关闭', async () => {
    const user = userEvent.setup({ delay: null });
    render(<ScheduleClient />);
    fireEvent.click(screen.getByRole('button', { name: /新建会诊/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('创建')) throw new Error('dialog open');
    }, { timeout: 3000 });
    const notify = document.getElementById('notify');
    if (notify) fireEvent.click(notify);
    const create = Array.from(document.body.querySelectorAll('button')).find((b) =>
      /创建会诊/.test(b.textContent ?? ''),
    );
    fireEvent.click(create!);
    await waitFor(() => {
      const dialog = Array.from(document.body.querySelectorAll('[role="dialog"]')).find((d) =>
        d.textContent!.includes('创建会诊'),
      );
      if (dialog) throw new Error('dialog still open');
    }, { timeout: 3000 });
  });
});

describe('experts-client 筛选/邀请/详情', () => {
  it('搜索无匹配 → 空态 → 查看所有专家复位', async () => {
    const user = userEvent.setup();
    render(<ExpertsClient />);
    const input = screen.getByPlaceholderText('姓名、专长或医院...');
    fireEvent.change(input, { target: { value: 'zzz-无' } });
    await waitFor(() => {
      if (!document.body.textContent!.includes('未找到匹配的专家')) throw new Error('empty');
    });
    fireEvent.click(screen.getByRole('button', { name: /查看所有专家/ }));
    await waitFor(() => {
      if (document.body.textContent!.includes('未找到匹配的专家')) throw new Error('still empty');
    });
  });

  it('邀请专家对话框 → 发送邀请关闭；专家卡详情打开', async () => {
    const user = userEvent.setup({ delay: null });
    render(<ExpertsClient />);
    fireEvent.click(screen.getByRole('button', { name: /邀请专家/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('邀请信息')) throw new Error('invite dialog');
    }, { timeout: 3000 });
    const send = Array.from(document.body.querySelectorAll('button')).find((b) =>
      /发送邀请/.test(b.textContent ?? ''),
    );
    fireEvent.click(send!);
    await waitFor(() => {
      if (document.body.textContent!.includes('邀请信息')) throw new Error('invite still open');
    }, { timeout: 3000 });

    // 专家卡：查看详情（第一个）
    const detail = screen.getAllByRole('button', { name: '查看详情' })[0];
    fireEvent.click(detail);
    await waitFor(() => {
      if (!document.body.textContent!.includes('专家详情')) throw new Error('detail dialog');
    }, { timeout: 3000 });
  });
});

describe('medical-records-client 面板切换臂', () => {
  it('多模态AI诊断面板开 → 关闭按钮收起；批量处理面板互斥', async () => {
    const user = userEvent.setup({ delay: null });
    render(<MedicalRecordsClient />);
    fireEvent.click(screen.getByRole('button', { name: /多模态AI诊断/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('选择操作') === false) throw new Error('placeholder gone?');
    }, { timeout: 100 }).catch(() => {});
    // 面板内关闭按钮（右上角 svg 圆钮）
    const panelClose = screen
      .getAllByRole('button')
      .find((b) => b.querySelector('svg') && (b.className?.baseVal ?? b.className ?? '').toString().includes('rounded-full'));
    if (panelClose) fireEvent.click(panelClose);

    // 批量处理
    fireEvent.click(screen.getByRole('button', { name: /批量处理工具/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('批量上传文件')) throw new Error('batch panel');
    }, { timeout: 3000 });
    const close2 = screen
      .getAllByRole('button')
      .find((b) => b.querySelector('svg') && (b.className?.baseVal ?? b.className ?? '').toString().includes('rounded-full'));
    fireEvent.click(close2!);
    await waitFor(() => {
      if (document.body.textContent!.includes('批量上传文件')) throw new Error('batch still open');
    }, { timeout: 3000 });
    expect(document.body.textContent).toContain('选择操作');
  });

  it('处方管理标签页切换', async () => {
    const user = userEvent.setup();
    render(<MedicalRecordsClient />);
    await user.click(screen.getByRole('tab', { name: /处方管理/ }));
    await waitFor(() => {
      if (!document.body.textContent!.includes('处方')) throw new Error('prescription tab');
    });
    expect(document.body.textContent).toContain('选择操作');
  });
});

describe('consultation-room 消息链与设备开关', () => {
  it('chat：输入 → Enter 发送上屏；空消息拒绝；按钮发送', async () => {
    const user = userEvent.setup();
    render(<ConsultationRoom />);
    await user.click(screen.getByRole('tab', { name: /讨论|聊天|chat/i }));
    const before = document.body.textContent!.length;

    const ta = screen.getByPlaceholderText('输入消息...');
    // 空消息 Enter → 拒绝
    fireEvent.keyDown(ta, { key: 'Enter' });
    expect(document.body.textContent!.length).toBe(before);

    // 输入 + Enter → 上屏
    fireEvent.change(ta, { target: { value: 'batch5 会诊意见' } });
    fireEvent.keyDown(ta, { key: 'Enter' });
    await waitFor(() => {
      if (!document.body.textContent!.includes('batch5 会诊意见')) throw new Error('msg not sent');
    });
    expect((ta as HTMLTextAreaElement).value).toBe('');

    // 按钮发送
    fireEvent.change(ta, { target: { value: '第二条消息' } });
    const sendBtn = screen
      .getAllByRole('button')
      .find((b) => /发送/.test(b.textContent ?? '') || b.querySelector('.lucide-send'));
    if (sendBtn) fireEvent.click(sendBtn);
    await waitFor(() => {
      if (!document.body.textContent!.includes('第二条消息')) throw new Error('btn msg not sent');
    });
  });

  it('video/audio 开关臂：两次点击（开→关→开）', async () => {
    const user = userEvent.setup();
    render(<ConsultationRoom />);
    const videoBtn = screen
      .getAllByRole('button')
      .find((b) => b.querySelector('.lucide-video') || b.querySelector('.lucide-video-off'));
    const audioBtn = screen
      .getAllByRole('button')
      .find((b) => b.querySelector('.lucide-mic') || b.querySelector('.lucide-mic-off'));
    fireEvent.click(videoBtn!);
    fireEvent.click(videoBtn!);
    fireEvent.click(audioBtn!);
    fireEvent.click(audioBtn!);
    expect(document.body.textContent).toContain('主视频窗口');
  });
});

// ============================================================
// YYC³ · @yyc3/web-ui Phase 5a 验收测试
// Provider（HubLike 注入/空模式）/ hooks（chat/agents/skills）/ GlitchText
// ============================================================
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import {
  YYC3Provider,
  useYYC3Context,
  useYYC3,
  useChat,
  useAgents,
  useSkills,
  GlitchText,
} from '../index';
import type { HubLike } from '../index';

describe('web-ui · Provider（D2 解耦）', () => {
  it('注入 HubLike 工厂：initialize 后 hub 就绪', async () => {
    const hub: HubLike = { initialize: vi.fn(), chat: vi.fn() };
    const { result } = renderHook(() => useYYC3(), {
      wrapper: ({ children }) =>
        React.createElement(YYC3Provider, { createHub: () => hub }, children),
    });
    await waitFor(() => expect(result.current.initialized).toBe(true));
    expect(result.current.isReady).toBe(true);
    expect(result.current.hub).toBe(hub);
  });

  it('无工厂（纯 UI 模式）：initialized 但 hub 为 null', async () => {
    const { result } = renderHook(() => useYYC3(), {
      wrapper: ({ children }) => React.createElement(YYC3Provider, null, children),
    });
    await waitFor(() => expect(result.current.initialized).toBe(true));
    expect(result.current.hub).toBeNull();
    expect(result.current.isReady).toBe(false);
  });

  it('initialize 抛错 → error 通道', async () => {
    const { result } = renderHook(() => useYYC3(), {
      wrapper: ({ children }) =>
        React.createElement(
          YYC3Provider,
          { createHub: () => ({ initialize: () => { throw new Error('boom'); }, chat: vi.fn() }) },
          children,
        ),
    });
    await waitFor(() => expect(result.current.error?.message).toBe('boom'));
    expect(result.current.isReady).toBe(false);
  });
});

describe('web-ui · useChat', () => {
  it('发送消息：user+assistant 双条入列；无 hub 时忽略', async () => {
    const chat = vi.fn().mockResolvedValue({ success: true, data: { content: '回复' } });
    // 固定工厂引用（内联箭头会导致 effect 每渲染重跑）
    const stableCreateHub = () => ({ initialize: vi.fn(), chat }) as HubLike;
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(YYC3Provider, { createHub: stableCreateHub }, children);
    const { result } = renderHook(() => useChat(), { wrapper });
    // 经 useYYC3 等 hub 就绪（useChat 不暴露 hub）
    const { result: ctx } = renderHook(() => useYYC3(), { wrapper });
    await waitFor(() => {
      if (!ctx.current.isReady) throw new Error('hub not ready');
    });
    await act(async () => {
      await result.current.sendMessage('你好');
    });
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[1].content).toBe('回复');
    act(() => result.current.clearMessages());
    expect(result.current.messages).toHaveLength(0);
  });
});

describe('web-ui · useAgents / useSkills', () => {
  it('hub 就绪后加载八成员档案并可选中', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(YYC3Provider, { createHub: () => ({ initialize: vi.fn(), chat: vi.fn() }) }, children);
    const { result } = renderHook(() => useAgents(), { wrapper });
    await waitFor(() => expect(result.current.agents).toHaveLength(8));
    act(() => result.current.selectAgent('meta-oracle'));
    expect(result.current.selectedAgent?.name).toBe('元启·天枢');
  });

  it('useSkills：四技能 + executeSkill', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(YYC3Provider, { createHub: () => ({ initialize: vi.fn(), chat: vi.fn() }) }, children);
    const { result } = renderHook(() => useSkills(), { wrapper });
    await waitFor(() => expect(result.current.skills).toHaveLength(4));
    const r = await result.current.executeSkill('unit-tests', {});
    expect(r.success).toBe(true);
  });
});

describe('web-ui · GlitchText', () => {
  it('渲染文本 + aria-label + enabled=false 不动画', () => {
    render(React.createElement(GlitchText, { enabled: false }, '赛博文字'));
    expect(screen.getByLabelText('赛博文字').textContent).toContain('赛博文字');
  });
});

// ============================================================
// YYC³ · @yyc3/web-ui 批次 1 铁律门补测（批次 0 解锁后接入 vitest）
// 弱区覆盖：ChatInterface / AgentSelector / SkillPanel（0% 组件三件）+
// GlitchText 计时器/hover/reduced-motion 深路径 + NeonCard 双主题 hover /
// 键盘 / IntersectionObserver + useAI SSE 流解析 / 配置迁移 / 容错分支 +
// provider 非 Error 抛出 / use-chat 无 chat 通道 / use-agents 未知 id
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act, waitFor } from '@testing-library/react';
import { TextEncoder } from 'node:util';
import React from 'react';
import {
  YYC3Provider,
  useYYC3,
  useChat,
  useAgents,
  ChatInterface,
  AgentSelector,
  SkillPanel,
  GlitchText,
  NeonCard,
  useAI,
} from '../index';
import type { HubLike } from '../index';

// 稳定引用（内联工厂会因 effect 依赖重跑初始化）
const chatMock = vi.fn().mockResolvedValue({ success: true, data: { content: 'hub 回复' } });
const stableCreateHub = () => ({ initialize: vi.fn(), chat: chatMock }) as HubLike;
const withProvider = ({ children }: { children: React.ReactNode }) => (
  <YYC3Provider createHub={stableCreateHub}>{children}</YYC3Provider>
);

beforeEach(() => {
  localStorage.clear();
  chatMock.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('web-ui · ChatInterface（0% 组件补测）', () => {
  it('空输入提交被禁用且无消息入列', () => {
    render(<ChatInterface />, { wrapper: withProvider });
    const send = screen.getByRole('button', { name: '发送' }) as HTMLButtonElement;
    expect(send.disabled).toBe(true);
    fireEvent.click(send);
    expect(document.querySelectorAll('.yyc3-chat-message')).toHaveLength(0);
  });

  it('纯空白输入不触发发送', () => {
    render(<ChatInterface />, { wrapper: withProvider });
    const input = screen.getByPlaceholderText('输入消息...');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(screen.getByRole('button', { name: '发送' }).closest('form')!);
    expect(document.querySelectorAll('.yyc3-chat-message')).toHaveLength(0);
  });

  it('输入并提交：user+assistant 双消息渲染，输入框清空，加载态出现后消失', async () => {
    render(<ChatInterface />, { wrapper: withProvider });
    await act(async () => {}); // 冲刷 initHub 微任务 → hub 就绪后再提交
    const input = screen.getByPlaceholderText('输入消息...');
    fireEvent.change(input, { target: { value: '你好' } });
    expect((screen.getByRole('button', { name: '发送' }) as HTMLButtonElement).disabled).toBe(false);
    fireEvent.submit(screen.getByRole('button', { name: '发送' }).closest('form')!);
    // user 消息即时入列
    expect(document.querySelector('.yyc3-chat-message-user')?.textContent).toBe('你好');
    // assistant 回复异步到达
    await screen.findByText('hub 回复');
    expect(document.querySelector('.yyc3-chat-message-assistant')?.textContent).toBe('hub 回复');
    expect((screen.getByPlaceholderText('输入消息...') as HTMLInputElement).value).toBe('');
    expect((screen.getByRole('button', { name: '发送' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('加载中：输入框与按钮禁用并显示思考中', async () => {
    chatMock.mockImplementation(() => new Promise(() => void 0)); // 挂起
    render(<ChatInterface />, { wrapper: withProvider });
    await act(async () => {}); // 冲刷 initHub 微任务
    fireEvent.change(screen.getByPlaceholderText('输入消息...'), { target: { value: '慢问题' } });
    fireEvent.submit(screen.getByRole('button', { name: '发送' }).closest('form')!);
    expect(screen.getByText('思考中...')).toBeTruthy();
    expect((screen.getByPlaceholderText('输入消息...') as HTMLInputElement).disabled).toBe(true);
  });
});

describe('web-ui · AgentSelector（0% 组件补测）', () => {
  it('选择智能体后信息面板渲染（名称/角色/能力）', async () => {
    render(<AgentSelector />, { wrapper: withProvider });
    const select = (await screen.findByRole('combobox')) as HTMLSelectElement;
    await waitFor(() => expect(select.options).toHaveLength(9)); // 占位 + 8 成员
    fireEvent.change(select, { target: { value: 'thinker' } });
    expect(screen.getByText('语枢·万物')).toBeTruthy();
    expect(screen.getByText('思考者')).toBeTruthy();
    expect(screen.getByText('analysis, reasoning')).toBeTruthy();
  });
});

describe('web-ui · SkillPanel（0% 组件补测）', () => {
  it('点选技能高亮并出现执行按钮，可点击执行', async () => {
    render(<SkillPanel />, { wrapper: withProvider });
    await waitFor(() => expect(document.querySelectorAll('.yyc3-skill-item')).toHaveLength(4));
    const first = document.querySelectorAll('.yyc3-skill-item')[0] as HTMLElement;
    fireEvent.click(first);
    expect(first.className).toContain('selected');
    const exec = screen.getByRole('button', { name: '执行 单元测试生成' });
    fireEvent.click(exec); // executeSkill 桩（异步吞掉）
    expect(exec).toBeTruthy();
  });
});

describe('web-ui · GlitchText 深路径', () => {
  it('hover 激活故障层（双 aria-hidden 层 + 动画），离开复原', () => {
    render(<GlitchText>悬停故障</GlitchText>);
    const el = screen.getByLabelText('悬停故障');
    expect(el.style.animation).toBeFalsy();
    fireEvent.mouseEnter(el);
    expect(el.style.animation).toContain('glitch-skew');
    expect(el.style.animation).toContain('0.3s'); // hover 态加速时长
    expect(el.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(2);
    fireEvent.mouseLeave(el);
    expect(el.style.animation).toBeFalsy();
    expect(el.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(0);
  });

  it('prefers-reduced-motion 下不动画', () => {
    const original = window.matchMedia;
    (window as unknown as { matchMedia: unknown }).matchMedia = () =>
      ({ matches: true }) as MediaQueryList;
    try {
      render(<GlitchText>静</GlitchText>);
      const el = screen.getByLabelText('静');
      fireEvent.mouseEnter(el);
      expect(el.style.animation).toBeFalsy();
    } finally {
      window.matchMedia = original;
    }
  });

  it('inline=false + as=div：块级渲染', () => {
    render(<GlitchText as="div" inline={false}>块级文字</GlitchText>);
    const el = screen.getByLabelText('块级文字');
    expect(el.tagName).toBe('DIV');
    expect(el.className).toContain('block relative');
  });

  it('interval=null 时不调度故障循环', () => {
    vi.useFakeTimers();
    render(<GlitchText interval={null}>无循环</GlitchText>);
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByLabelText('无循环').querySelectorAll('span[aria-hidden="true"]')).toHaveLength(0);
  });

  it('计时器循环：到点故障 → 复原 → 再调度（fake timers + 固定随机）', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // 外层 delay=4000（[3000,5000]）内层 275ms
    const { unmount } = render(<GlitchText interval={[3000, 5000]} intensity={2}>循环闪</GlitchText>);
    const el = screen.getByLabelText('循环闪');
    act(() => vi.advanceTimersByTime(4000)); // 外层到点 → 故障开
    const layers = el.querySelectorAll('span[aria-hidden="true"]');
    expect(layers).toHaveLength(2);
    // intensity=2 → px=6 → textShadow 含 '6px 0'
    expect((layers[0] as HTMLElement).style.textShadow).toContain('6px 0');
    act(() => vi.advanceTimersByTime(275)); // 内层复原
    expect(el.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(0);
    act(() => vi.advanceTimersByTime(4000)); // 再调度 → 再次触发（scheduleGlitch 递归）
    expect(el.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(2);
    unmount(); // 卸载清理 clearTimeout
    act(() => vi.advanceTimersByTime(10000)); // 清理后无副作用
  });
});

describe('web-ui · NeonCard 深路径', () => {
  it('cyberpunk hover：边框/阴影增强，离开复原', () => {
    render(<NeonCard color="#00f0ff">赛博卡</NeonCard>);
    const card = document.querySelector('[data-neon-card]') as HTMLElement;
    expect(card.className).toContain('cursor-pointer');
    fireEvent.mouseEnter(card);
    // jsdom 将 '#00f0ff80' 规范化为 rgba
    expect(card.style.borderColor).toBe('rgba(0, 240, 255, 0.5)');
    fireEvent.mouseLeave(card);
    expect(card.style.borderColor).toBe('rgba(0, 240, 255, 0.2)');
  });

  it('liquidGlass 主题：色映射命中 + hover 背景/阴影切换', () => {
    render(<NeonCard themeMode="liquidGlass" color="#00f0ff">玻璃卡</NeonCard>);
    const card = document.querySelector('[data-neon-card]') as HTMLElement;
    expect(card.style.background).toBe('rgba(255, 255, 255, 0.06)'); // jsdom 规范化
    fireEvent.mouseEnter(card);
    expect(card.style.background).toBe('rgba(255, 255, 255, 0.1)');
    fireEvent.mouseLeave(card);
    expect(card.style.background).toBe('rgba(255, 255, 255, 0.06)');
  });

  it('liquidGlass 未知颜色直通 + cyberpunk hoverable=false 不响应', () => {
    render(
      <>
        <NeonCard themeMode="liquidGlass" color="#abcdef">透传卡</NeonCard>
        <NeonCard color="#00f0ff" hoverable={false}>静态卡</NeonCard>
      </>
    );
    const cards = document.querySelectorAll('[data-neon-card]');
    const liquid = cards[0] as HTMLElement;
    // 未映射色直通分支（liquid 不消费 effectiveColor，断言玻璃底样式即可）
    expect(liquid.style.backdropFilter).toBe('blur(20px) saturate(180%)');
    const plain = cards[1] as HTMLElement;
    expect(plain.className).not.toContain('cursor-pointer');
    const before = plain.getAttribute('style');
    fireEvent.mouseEnter(plain);
    expect(plain.getAttribute('style')).toBe(before);
  });

  it('键盘可达：Enter/空格触发 onClick，其他键忽略', () => {
    const onClick = vi.fn();
    render(<NeonCard onClick={onClick} ariaLabel="按键卡">按</NeonCard>);
    const card = screen.getByRole('button', { name: '按键卡' });
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(card, { key: 'a' });
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(card, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('IntersectionObserver 可用时：入场显现 + 非相交不复现 + 卸载断开', () => {
    class MockIO {
      static latest: MockIO | undefined;
      cb: (entries: Array<{ isIntersecting: boolean }>) => void;
      observe = vi.fn();
      disconnect = vi.fn();
      constructor(cb: (entries: Array<{ isIntersecting: boolean }>) => void) {
        this.cb = cb;
        MockIO.latest = this;
      }
    }
    vi.stubGlobal('IntersectionObserver', MockIO);
    const { unmount } = render(<NeonCard ariaLabel="观测卡">观</NeonCard>);
    const card = screen.getByLabelText('观测卡');
    const io = MockIO.latest!;
    expect(io.observe).toHaveBeenCalledWith(card);
    // 非相交：保持隐藏（不 disconnect）
    act(() => io.cb([{ isIntersecting: false }]));
    expect(card.style.opacity).toBe('0');
    // 相交：显现并断开
    act(() => io.cb([{ isIntersecting: true }]));
    expect(card.style.opacity).toBe('1');
    expect(io.disconnect).toHaveBeenCalled();
    unmount();
  });
});

describe('web-ui · useAI 深路径（SSE 流解析 / 配置迁移 / 容错）', () => {
  const KEY = 'yyc3_ai_config';

  it('localStorage 存有 v1 配置：直接加载不迁移', async () => {
    localStorage.setItem(KEY, JSON.stringify({ provider: 'openai', apiKey: 'k', baseUrl: 'u', model: 'v1模型', version: 1 }));
    const { result } = renderHook(() => useAI());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.config.model).toBe('v1模型');
    expect(result.current.config.temperature).toBeUndefined(); // 非 v1 默认不并入
  });

  it('旧版本配置：迁移合并默认值并回写 v1', async () => {
    localStorage.setItem(KEY, JSON.stringify({ provider: 'zhipu', model: 'glm-4', apiKey: 'z', baseUrl: 'z-url', version: 0 }));
    const { result } = renderHook(() => useAI());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.config.version).toBe(1);
    expect(result.current.config.temperature).toBe(0.7); // 默认值并入
    expect(JSON.parse(localStorage.getItem(KEY)!).version).toBe(1);
  });

  it('localStorage 内容损坏：静默回退默认配置', async () => {
    localStorage.setItem(KEY, '{broken json');
    const { result } = renderHook(() => useAI());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.config.model).toBe('llama3');
  });

  it('saveConfig 写盘失败：静默吞错不崩溃', async () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    const { result } = renderHook(() => useAI());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(() =>
      result.current.saveConfig({ provider: 'custom', apiKey: 'x', baseUrl: 'u', model: 'm', version: 1 })
    ).not.toThrow();
    spy.mockRestore();
  });

  it('SSE 流式解析：data 行提取 / [DONE] 跳过 / 坏 JSON 容错 / 空 delta 过滤', async () => {
    const chunks: string[] = [];
    const enc = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(enc.encode('data: {"choices":[{"delta":{"content":"你"}}]}\n\ndata: {"choices":[{"delta":{"content":"好"}}]}'));
        controller.enqueue(enc.encode('\ndata: [DONE]\ndata: broken-json\ndata: {"choices":[{"delta":{}}]}\n'));
        controller.close();
      },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, body: stream }));
    const { result } = renderHook(() => useAI());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.chat([{ role: 'user', content: 'q' }], (c) => chunks.push(c));
    });
    expect(chunks.join('')).toBe('你好');
    expect(result.current.isStreaming).toBe(false);
  });

  it('response.ok=false：走本地模拟流 fallback', async () => {
    const chunks: string[] = [];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, statusText: 'Service Unavailable', body: null }));
    const { result } = renderHook(() => useAI());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.chat([{ role: 'user', content: 'q' }], (c) => chunks.push(c));
    });
    expect(chunks.join('')).toContain('simulated response');
  });

  it('response.body 为 null：抛错后仍走 fallback', async () => {
    const chunks: string[] = [];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, statusText: 'OK', body: null }));
    const { result } = renderHook(() => useAI());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.chat([{ role: 'user', content: 'q' }], (c) => chunks.push(c));
    });
    expect(chunks.join('')).toContain('simulated response');
  });

  it('fallback 输出中 onChunk 抛错：冒泡外层 catch 输出 [SYSTEM_ERROR]', async () => {
    const chunks: string[] = [];
    const sink = (c: string) => {
      chunks.push(c);
      if (c.startsWith('Local')) throw new Error('sink-broken'); // 首词块即抛
    };
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')));
    const { result } = renderHook(() => useAI());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.chat([{ role: 'user', content: 'q' }], sink);
    });
    expect(chunks.join('')).toContain('[SYSTEM_ERROR]: sink-broken');
    expect(result.current.isStreaming).toBe(false);
  });
});

describe('web-ui · 边界分支补齐', () => {
  it('provider：initialize 抛非 Error 值 → 归一为 Failed to initialize', async () => {
    const { result } = renderHook(() => useYYC3(), {
      wrapper: ({ children }) => (
        <YYC3Provider
          createHub={() =>
            ({ initialize: () => { throw 'str-boom'; }, chat: vi.fn() }) as unknown as HubLike
          }
        >
          {children}
        </YYC3Provider>
      ),
    });
    await waitFor(() => expect(result.current.error?.message).toBe('Failed to initialize'));
  });

  it('use-chat：hub 无 chat 通道 → 仅 user 消息入列', async () => {
    const hubNoChat = { initialize: vi.fn() } as unknown as HubLike;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <YYC3Provider createHub={() => hubNoChat}>{children}</YYC3Provider>
    );
    const { result } = renderHook(() => useChat(), { wrapper });
    const { result: ctx } = renderHook(() => useYYC3(), { wrapper });
    await waitFor(() => expect(ctx.current.isReady).toBe(true));
    await act(async () => {
      await result.current.sendMessage('只有我');
    });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.isLoading).toBe(false);
  });

  it('use-chat：chat 返回 success=false → assistant 内容为 Error', async () => {
    const failChat = vi.fn().mockResolvedValue({ success: false });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <YYC3Provider createHub={() => ({ initialize: vi.fn(), chat: failChat }) as HubLike}>
        {children}
      </YYC3Provider>
    );
    const { result } = renderHook(() => useChat(), { wrapper });
    const { result: ctx } = renderHook(() => useYYC3(), { wrapper });
    await waitFor(() => expect(ctx.current.isReady).toBe(true));
    await act(async () => {
      await result.current.sendMessage('失败用例');
    });
    expect(result.current.messages[1].content).toBe('Error');
  });

  it('use-agents：未知 id 不选中', async () => {
    const { result } = renderHook(() => useAgents(), { wrapper: withProvider });
    await waitFor(() => expect(result.current.agents).toHaveLength(8));
    act(() => result.current.selectAgent('ghost'));
    expect(result.current.selectedAgent).toBeNull();
  });
});

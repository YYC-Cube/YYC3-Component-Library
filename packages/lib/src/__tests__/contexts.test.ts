// ============================================================
// YYC³ · @yyc3/lib contexts 覆盖率补测（batch1 弱区：≈1%）
// 覆盖对象：OllamaProvider/useOllama / AIAssistantProvider/useAIAssistant
// 方法：RTL renderHook + Provider wrapper + useContext 消费探针；
//       ollama 链路 fetch 打桩（真身 listModels/generateText/streamText）；
//       AIAssistant 链路走真身单例 + localStorage（createConversation 同步无网络），
//       sendMessage 的 1-3s 模拟延迟用 fake timers 消化。
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import {
  OllamaProvider,
  useOllama,
  AIAssistantProvider,
  useAIAssistant,
  aiAssistantService,
} from '../index';
import type { OllamaResponse, Message } from '../index';

const okJson = (data: unknown) => ({ ok: true, statusText: 'OK', json: async () => data });
const badResponse = (statusText: string) => ({ ok: false, statusText, json: async () => ({}) });

const streamBody = (chunks: string[]) => {
  const encoder = new TextEncoder();
  const encoded = chunks.map((c) => encoder.encode(c));
  let cursor = 0;
  return {
    ok: true,
    statusText: 'OK',
    body: {
      getReader: () => ({
        read: async () =>
          cursor < encoded.length ? { done: false, value: encoded[cursor++] } : { done: true, value: undefined },
      }),
    },
  };
};

// ============================================================
// hook guard：Provider 外使用抛错
// ============================================================
describe('contexts · hook guard（Provider 外使用）', () => {
  it('useOllama 无 Provider 抛错', () => {
    expect(() => renderHook(() => useOllama())).toThrow('useOllama 必须在 OllamaProvider 内部使用');
  });

  it('useAIAssistant 无 Provider 抛错', () => {
    expect(() => renderHook(() => useAIAssistant())).toThrow(
      'useAIAssistant 必须在 AIAssistantProvider 内部使用',
    );
  });
});

// ============================================================
// OllamaProvider
// ============================================================
describe('OllamaProvider', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const mount = () => renderHook(() => useOllama(), { wrapper: OllamaProvider });

  it('挂载即拉取模型列表：models/selectedModel/isLoading 状态迁移', async () => {
    vi.stubGlobal('fetch', vi.fn(async () =>
      okJson({ models: [{ name: 'qwen2.5:7b' }, { name: 'llama3' }] }),
    ));
    const { result } = mount();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.models).toHaveLength(2);
    expect(result.current.selectedModel).toBe('qwen2.5:7b'); // 空选择 → 取第一个
    expect(result.current.error).toBeNull();
  });

  it('refreshModels：选中模型仍在列表 → 保留；不在列表 → 重置为第一个', async () => {
    vi.stubGlobal('fetch', vi.fn(async () =>
      okJson({ models: [{ name: 'qwen2.5:7b' }, { name: 'llama3' }] }),
    ));
    const { result } = mount();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // 仍在列表：保留选择
    act(() => result.current.setSelectedModel('llama3'));
    await act(async () => {
      await result.current.refreshModels();
    });
    expect(result.current.selectedModel).toBe('llama3');

    // 选择被移除：重置为第一个
    vi.stubGlobal('fetch', vi.fn(async () => okJson({ models: [{ name: 'mistral' }] })));
    act(() => result.current.setSelectedModel('ghost-model'));
    await act(async () => {
      await result.current.refreshModels();
    });
    expect(result.current.selectedModel).toBe('mistral');
  });

  it('refreshModels 失败：error 记录消息、isLoading 复位、models 空', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => badResponse('Service Unavailable')));
    const { result } = mount();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('获取模型列表失败: Service Unavailable');
    expect(result.current.models).toEqual([]);
    expect(result.current.selectedModel).toBe('');
  });

  it('generateText 无选中模型抛「请先选择一个模型」', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => okJson({ models: [] })));
    const { result } = mount();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await expect(result.current.generateText('hi')).rejects.toThrow('请先选择一个模型');
    });
  });

  it('generateText 有模型：POST 参数携带选中模型，isLoading 复位', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => okJson({ models: [{ name: 'qwen2.5:7b' }] })));
    const { result } = mount();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const fetchMock = vi.fn(async () =>
      okJson({ model: 'qwen2.5:7b', response: '你好，世界', done: true }),
    );
    vi.stubGlobal('fetch', fetchMock);

    let response!: OllamaResponse;
    await act(async () => {
      response = await result.current.generateText('打个招呼', { temperature: 0.3 });
    });

    expect(response.response).toBe('你好，世界');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:11434/api/generate');
    expect(JSON.parse(init.body)).toEqual({ model: 'qwen2.5:7b', prompt: '打个招呼', temperature: 0.3 });
    expect(result.current.isLoading).toBe(false);
  });

  it('generateText 失败：error 记录且异常向上传播', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => okJson({ models: [{ name: 'm' }] })));
    const { result } = mount();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    vi.stubGlobal('fetch', vi.fn(async () => badResponse('Bad Gateway')));
    await act(async () => {
      await expect(result.current.generateText('hi')).rejects.toThrow('生成文本失败: Bad Gateway');
    });
    expect(result.current.error).toBe('生成文本失败: Bad Gateway');
  });

  it('streamText 无选中模型抛错', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => okJson({ models: [] })));
    const { result } = mount();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await expect(
        result.current.streamText('hi', () => {}),
      ).rejects.toThrow('请先选择一个模型');
    });
  });

  it('streamText 有模型：分块回调 + 强制 stream:true + isLoading 复位', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => okJson({ models: [{ name: 'qwen2.5:7b' }] })));
    const { result } = mount();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const fetchMock = vi.fn(async () =>
      streamBody(['{"response":"你"}\n', '{"response":"好"}\n']),
    );
    vi.stubGlobal('fetch', fetchMock);

    const chunks: OllamaResponse[] = [];
    await act(async () => {
      await result.current.streamText('hi', (chunk) => chunks.push(chunk));
    });

    expect(chunks.map((c) => c.response)).toEqual(['你', '好']);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).stream).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('streamText 中途失败：error 记录且异常向上传播', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => okJson({ models: [{ name: 'm' }] })));
    const { result } = mount();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    vi.stubGlobal('fetch', vi.fn(async () => badResponse('Service Unavailable')));
    await act(async () => {
      await expect(
        (async () => {
          await result.current.streamText('hi', () => {});
        })(),
      ).rejects.toThrow('流式生成文本失败: Service Unavailable');
    });
    expect(result.current.error).toBe('流式生成文本失败: Service Unavailable');
  });
});

// ============================================================
// AIAssistantProvider（真身单例 + localStorage）
// ============================================================
describe('AIAssistantProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    aiAssistantService.getAllConversations().forEach((c) => aiAssistantService.deleteConversation(c.id));
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const mount = () => renderHook(() => useAIAssistant(), { wrapper: AIAssistantProvider });

  it('暴露工具与提供商清单（value 对象初始化分支）', async () => {
    const { result } = mount();
    await waitFor(() => expect(result.current.conversations).toEqual([]));

    expect(result.current.availableTools).toHaveLength(7);
    expect(result.current.providers).toHaveLength(4);
    expect(result.current.isLoading).toBe(false);
  });

  it('无当前对话时消息三操作守卫：sendMessage null / regenerate null / edit·delete false', async () => {
    const { result } = mount();
    await waitFor(() => expect(result.current.currentConversation).toBeNull());

    await act(async () => {
      expect(await result.current.sendMessage('你好')).toBeNull();
      expect(await result.current.regenerateResponse('msg_x')).toBeNull();
      expect(await result.current.editMessage('msg_x', 'new')).toBe(false);
      expect(await result.current.deleteMessage('msg_x')).toBe(false);
    });
    // 守卫文案随操作覆盖：sendMessage 用「请先选择或创建一个对话」，
    // 其余三个操作用「请先选择一个对话」——最终态为最后一次（deleteMessage）的文案
    expect(result.current.error).toBe('请先选择一个对话');
  });

  it('createConversation：返回 id、列表刷新、当前对话就位、局部设置生效', async () => {
    const { result } = mount();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let id!: string;
    await act(async () => {
      id = await result.current.createConversation({ temperature: 0.3 });
    });

    expect(id).toMatch(/^conv_/);
    expect(result.current.conversations).toHaveLength(1);
    expect(result.current.currentConversation!.id).toBe(id);
    expect(result.current.currentConversation!.settings.temperature).toBe(0.3);
    expect(result.current.error).toBeNull();
  });

  it('selectConversation：切换当前对话；未知 id 置空且不抛错', async () => {
    const { result } = mount();

    let idA!: string;
    let idB!: string;
    await act(async () => {
      idA = await result.current.createConversation();
      idB = await result.current.createConversation();
    });

    act(() => result.current.selectConversation(idA));
    expect(result.current.currentConversation!.id).toBe(idA);

    act(() => result.current.selectConversation('missing'));
    expect(result.current.currentConversation).toBeNull();
    expect(result.current.error).toBeNull();
    expect(idB).not.toBe(idA);
  });

  it('updateConversationSettings：成功刷新视图；未知 id 返回 false', async () => {
    const { result } = mount();
    let id!: string;
    await act(async () => {
      id = await result.current.createConversation();
    });

    await act(async () => {
      expect(await result.current.updateConversationSettings(id, { model: 'claude-3-opus' })).toBe(true);
    });
    expect(result.current.currentConversation!.settings.model).toBe('claude-3-opus');

    await act(async () => {
      expect(await result.current.updateConversationSettings('missing', { model: 'x' })).toBe(false);
    });
  });

  it('deleteConversation：成功移除并清当前；未知 id 返回 false', async () => {
    const { result } = mount();
    let id!: string;
    await act(async () => {
      id = await result.current.createConversation();
    });

    await act(async () => {
      expect(await result.current.deleteConversation('missing')).toBe(false);
    });
    await act(async () => {
      expect(await result.current.deleteConversation(id)).toBe(true);
    });

    expect(result.current.conversations).toEqual([]);
    expect(result.current.currentConversation).toBeNull();
  });

  it('sendMessage：真身链路追加用户+助手消息并刷新视图', async () => {
    const { result } = mount();
    let id!: string;
    await act(async () => {
      id = await result.current.createConversation();
    });

    vi.useFakeTimers();
    let promise!: Promise<Message | null>;
    act(() => {
      promise = result.current.sendMessage('查询数据');
    });
    await vi.advanceTimersByTimeAsync(3001);
    let msg: Message | null = null;
    await act(async () => {
      msg = await promise;
    });
    vi.useRealTimers();

    expect(msg!.role).toBe('assistant');
    expect(result.current.currentConversation!.messages).toHaveLength(2);
    expect(result.current.currentConversation!.messages[0].content).toBe('查询数据');
    expect(result.current.isLoading).toBe(false);
  });

  it('regenerateResponse：重生成助手回复（先删原回复再重发对应用户消息）', async () => {
    const { result } = mount();
    let id!: string;
    await act(async () => {
      id = await result.current.createConversation();
    });

    // 造 user+assistant 消息（直接经真身服务，避免 1-3s 延迟）
    const svcConv = aiAssistantService.getConversation(id)!;
    const userMsg = aiAssistantService.addMessage(id, { role: 'user', content: '查询数据' });
    const assistantMsg = aiAssistantService.addMessage(id, {
      role: 'assistant',
      content: '旧回复',
      metadata: { model: 'gpt-4', tokens: 100, cost: 0.001, tools: [] },
    });
    act(() => result.current.selectConversation(id));
    expect(svcConv.messages).toHaveLength(2);
    expect(userMsg.role).toBe('user');
    void assistantMsg;

    vi.useFakeTimers();
    let promise!: Promise<Message | null>;
    act(() => {
      promise = result.current.regenerateResponse(aiAssistantService.getConversation(id)!.messages[1].id);
    });
    await vi.advanceTimersByTimeAsync(3001);
    let regenerated: Message | null = null;
    await act(async () => {
      regenerated = await promise;
    });
    vi.useRealTimers();

    const messages = aiAssistantService.getConversation(id)!.messages;
    // 真身已知行为（产品瑕疵，只记录不改）：regenerateResponse 经 context.sendMessage 重发
    // 用户消息，而 sendMessage 总是追加一条新 user 消息——原回复删除后变成
    // [原user, 重复user, 新assistant]，用户消息被复制一条。
    expect(messages).toHaveLength(3);
    expect(messages[0].content).toBe('查询数据');
    expect(messages[1].content).toBe('查询数据'); // 重复的用户消息
    expect(regenerated!.id).toBe(messages[2].id);
    expect(messages[2].content).not.toBe('旧回复');
  });

  it('regenerateResponse 三种错误分支：消息不存在 / 非助手消息 / 找不到对应用户消息', async () => {
    const { result } = mount();
    let id!: string;
    await act(async () => {
      id = await result.current.createConversation();
    });
    aiAssistantService.addMessage(id, { role: 'user', content: 'q1' });
    const userMsg = aiAssistantService.addMessage(id, { role: 'user', content: 'q2' });
    aiAssistantService.addMessage(id, { role: 'assistant', content: 'a2' });
    act(() => result.current.selectConversation(id));

    await act(async () => {
      expect(await result.current.regenerateResponse('msg_missing')).toBeNull();
    });
    expect(result.current.error).toBe('消息不存在');

    await act(async () => {
      expect(await result.current.regenerateResponse(userMsg.id)).toBeNull();
    });
    expect(result.current.error).toBe('只能重新生成助手的回复');

    // 首条消息是 assistant（无前置 user）→ 找不到对应的用户消息
    const convId2 = aiAssistantService.createConversation();
    aiAssistantService.addMessage(convId2, { role: 'assistant', content: '开场白' });
    act(() => result.current.selectConversation(convId2));
    const first = aiAssistantService.getConversation(convId2)!.messages[0].id;
    await act(async () => {
      expect(await result.current.regenerateResponse(first)).toBeNull();
    });
    expect(result.current.error).toBe('找不到对应的用户消息');
  });

  it('editMessage：改写消息内容并刷新视图；消息不存在返回 false', async () => {
    const { result } = mount();
    let id!: string;
    await act(async () => {
      id = await result.current.createConversation();
    });
    aiAssistantService.addMessage(id, { role: 'user', content: '原文' });
    act(() => result.current.selectConversation(id));
    const msgId = aiAssistantService.getConversation(id)!.messages[0].id;

    await act(async () => {
      expect(await result.current.editMessage(msgId, '改后的内容')).toBe(true);
    });
    expect(aiAssistantService.getConversation(id)!.messages[0].content).toBe('改后的内容');

    await act(async () => {
      expect(await result.current.editMessage('msg_missing', 'x')).toBe(false);
    });
    expect(result.current.error).toBe('消息不存在');
  });

  it('deleteMessage：移除消息并刷新视图；消息不存在返回 false', async () => {
    const { result } = mount();
    let id!: string;
    await act(async () => {
      id = await result.current.createConversation();
    });
    aiAssistantService.addMessage(id, { role: 'user', content: '保留' });
    aiAssistantService.addMessage(id, { role: 'assistant', content: '删除我' });
    act(() => result.current.selectConversation(id));
    const target = aiAssistantService.getConversation(id)!.messages[1].id;

    await act(async () => {
      expect(await result.current.deleteMessage(target)).toBe(true);
    });
    const messages = aiAssistantService.getConversation(id)!.messages;
    expect(messages).toHaveLength(1);
    expect(messages[0].content).toBe('保留');

    await act(async () => {
      expect(await result.current.deleteMessage('msg_missing')).toBe(false);
    });
  });

  it('exportConversation：json 导出原文；对话不存在返回空串并记录错误', async () => {
    const { result } = mount();
    let id!: string;
    await act(async () => {
      id = await result.current.createConversation();
    });

    let exported!: string;
    act(() => {
      exported = result.current.exportConversation(id, 'json');
    });
    expect(JSON.parse(exported).id).toBe(id);

    act(() => {
      exported = result.current.exportConversation('missing', 'json');
    });
    expect(exported).toBe('');
    expect(result.current.error).toBe('对话不存在');
  });

  it('clearError 清除错误态', async () => {
    const { result } = mount();
    await waitFor(() => expect(result.current.currentConversation).toBeNull());

    await act(async () => {
      await result.current.sendMessage('你好'); // 触发守卫错误
    });
    expect(result.current.error).toBe('请先选择或创建一个对话');

    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });

  it('createConversation 底层抛错：error 记录并向上传播', async () => {
    const { result } = mount();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const createSpy = vi
      .spyOn(aiAssistantService, 'createConversation')
      .mockImplementation(() => {
        throw new Error('存储已满');
      });

    await act(async () => {
      await expect(result.current.createConversation()).rejects.toThrow('存储已满');
    });
    expect(result.current.error).toBe('存储已满');

    createSpy.mockRestore();
  });
});

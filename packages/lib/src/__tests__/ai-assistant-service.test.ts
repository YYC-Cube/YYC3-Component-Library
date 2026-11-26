// ============================================================
// YYC³ · @yyc3/lib services/ai-assistant-service 覆盖率补测（batch1 弱区：12.57%）
// 覆盖对象：AIAssistantService 全公开面 + 私有工具链白盒直调
// 约定：import 一律走 '../index' 桶；sendMessage 内 callAIService 有 1-3s 真实延迟，
//       统一用 fake timers + advanceTimersByTimeAsync(3001) 消化；
//       私有方法（executeTools/formatToolResults/detectToolCalls/prepareContext/
//       generateConversationTitle）按方法学「白盒直调」经 as any 调用补分支。
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AIAssistantService } from '../index';
import type { ToolCall, Attachment } from '../index';

const makeToolCall = (name: string, parameters: Record<string, unknown> = {}): ToolCall => ({
  id: `tool_${Math.random().toString(36).slice(2)}`,
  name,
  parameters,
  status: 'pending',
  timestamp: new Date(),
});

// 发送消息并消化 callAIService 的 1-3s 延迟
const sendWithFakeTimers = async (
  svc: AIAssistantService,
  convId: string,
  content: string,
  attachments?: Attachment[],
): Promise<ToolCall> => {
  vi.useFakeTimers();
  try {
    const promise = svc.sendMessage(convId, content, attachments);
    await vi.advanceTimersByTimeAsync(3001);
    return await promise;
  } finally {
    vi.useRealTimers();
  }
};

describe('ai-assistant-service · 初始化面', () => {
  it('内置 4 个 AI 提供商', () => {
    const svc = new AIAssistantService();
    const providers = svc.getProviders();

    expect(providers).toHaveLength(4);
    expect(providers.map((p) => p.name)).toEqual(['OpenAI', 'Anthropic', 'Google', 'Ollama']);
    expect(providers.every((p) => p.available && p.models.length > 0)).toBe(true);
    // Ollama 本地免费
    expect(providers.find((p) => p.name === 'Ollama')!.pricing).toEqual({ input: 0, output: 0 });
  });

  it('内置 7 个工具', () => {
    const svc = new AIAssistantService();
    expect(svc.getAvailableTools()).toEqual([
      'query_data',
      'generate_chart',
      'file_operations',
      'system_status',
      'send_notification',
      'search',
      'calendar_operations',
    ]);
  });
});

describe('ai-assistant-service · 对话管理', () => {
  it('createConversation 默认设置 + 局部覆盖合并', () => {
    const svc = new AIAssistantService();
    const id = svc.createConversation({ temperature: 0.2, model: 'claude-3-opus' });
    const conv = svc.getConversation(id)!;

    expect(conv).not.toBeNull();
    expect(conv.title).toBe('新对话');
    expect(conv.messages).toEqual([]);
    expect(conv.tags).toEqual([]);
    expect(conv.archived).toBe(false);
    expect(conv.settings).toMatchObject({ model: 'claude-3-opus', temperature: 0.2, maxTokens: 2048 });
    expect(conv.settings.enableTools).toBe(true);
    expect(conv.createdAt).toBeInstanceOf(Date);
    expect(conv.context.userProfile.name).toBe('用户');
    // 创建即置为当前对话
    expect(svc.getCurrentConversation()!.id).toBe(id);
  });

  it('getConversation 未命中返回 null；setCurrentConversation 未知 id 不变更当前', () => {
    const svc = new AIAssistantService();
    const id = svc.createConversation();

    expect(svc.getConversation('missing')).toBeNull();
    svc.setCurrentConversation('missing');
    expect(svc.getCurrentConversation()!.id).toBe(id);
    svc.setCurrentConversation(id);
    expect(svc.getCurrentConversation()!.id).toBe(id);
  });

  it('无当前对话时 getCurrentConversation 返回 null', () => {
    const svc = new AIAssistantService();
    svc.createConversation();
    svc.deleteConversation(svc.getCurrentConversation()!.id);
    expect(svc.getCurrentConversation()).toBeNull();
  });

  it('getAllConversations 按 updatedAt 降序排序', () => {
    // 隔离：清掉先前用例经 localStorage 留下的对话，避免新实例加载历史记录干扰排序断言
    localStorage.clear();
    const svc = new AIAssistantService();
    const a = svc.createConversation();
    const b = svc.createConversation();

    // 同毫秒创建 updatedAt 相等（排序稳定），直接前移 a 的 updatedAt 保证序
    svc.getConversation(a)!.updatedAt = new Date(Date.now() + 1000);

    const all = svc.getAllConversations();
    expect(all).toHaveLength(2);
    expect(all[0].id).toBe(a);
    expect(all[1].id).toBe(b);
  });

  it('deleteConversation：命中返回 true 并清理持久化；未命中返回 false', () => {
    const svc = new AIAssistantService();
    const id = svc.createConversation();
    expect(svc.deleteConversation(id)).toBe(true);
    expect(svc.getConversation(id)).toBeNull();
    expect(svc.deleteConversation(id)).toBe(false);

    // 删除当前对话后 currentConversationId 置空
    const id2 = svc.createConversation();
    svc.setCurrentConversation(id2);
    svc.deleteConversation(id2);
    expect(svc.getCurrentConversation()).toBeNull();
  });

  it('updateConversationSettings：命中合并设置并刷新 updatedAt；未命中返回 false', () => {
    const svc = new AIAssistantService();
    const id = svc.createConversation();
    const before = svc.getConversation(id)!.updatedAt.getTime();

    expect(svc.updateConversationSettings(id, { enableMemory: false })).toBe(true);
    const conv = svc.getConversation(id)!;
    expect(conv.settings.enableMemory).toBe(false);
    expect(conv.settings.model).toBe('gpt-4'); // 未覆盖字段保留
    expect(conv.updatedAt.getTime()).toBeGreaterThanOrEqual(before);

    expect(svc.updateConversationSettings('missing', { model: 'x' })).toBe(false);
  });
});

describe('ai-assistant-service · 消息与标题', () => {
  it('addMessage 附加 id/timestamp；对话不存在抛错', () => {
    const svc = new AIAssistantService();
    expect(() =>
      svc.addMessage('missing', { role: 'user', content: 'hi' }),
    ).toThrow('对话不存在');

    const id = svc.createConversation();
    const msg = svc.addMessage(id, { role: 'user', content: '第一条' });
    expect(msg.id).toMatch(/^msg_/);
    expect(msg.timestamp).toBeInstanceOf(Date);
    expect(svc.getConversation(id)!.messages).toHaveLength(1);
    // 标题仍为「新对话」：仅在第 2 条消息时自动生成
    expect(svc.getConversation(id)!.title).toBe('新对话');
  });

  it('第 2 条消息触发标题自动生成：短内容无省略号', () => {
    const svc = new AIAssistantService();
    const id = svc.createConversation();
    svc.addMessage(id, { role: 'user', content: '帮我 分析 数据' });
    svc.addMessage(id, { role: 'assistant', content: '好的' });

    expect(svc.getConversation(id)!.title).toBe('帮我 分析 数据');
  });

  it('长内容标题截断 30 字符并补省略号', () => {
    const svc = new AIAssistantService();
    const id = svc.createConversation();
    const long = '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一'; // 31 字
    svc.addMessage(id, { role: 'user', content: long });
    svc.addMessage(id, { role: 'assistant', content: 'ok' });

    const title = svc.getConversation(id)!.title;
    expect(title.length).toBe(33); // 30 + '...'
    expect(title.endsWith('...')).toBe(true);
  });

  it('generateConversationTitle 白盒：多词取前 6 词', () => {
    const svc = new AIAssistantService();
    const title = (svc as unknown as { generateConversationTitle(s: string): string })
      .generateConversationTitle('a b c d e f g h');
    expect(title).toBe('a b c d e f');
  });
});

describe('ai-assistant-service · sendMessage 与工具链', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('对话不存在直接抛错（try 块之前）', async () => {
    const svc = new AIAssistantService();
    await expect(svc.sendMessage('missing', 'hi')).rejects.toThrow('对话不存在');
  });

  it('普通消息：追加用户+助手两条消息，assistant 带 model/tokens/cost 元数据', async () => {
    const svc = new AIAssistantService();
    const id = svc.createConversation();

    const reply = await sendWithFakeTimers(svc, id, '你好');
    const conv = svc.getConversation(id)!;

    expect(conv.messages).toHaveLength(2);
    expect(conv.messages[0]).toMatchObject({ role: 'user', content: '你好' });
    expect(conv.messages[0].metadata).toEqual({ attachments: undefined });
    expect(reply.role).toBe('assistant');
    expect(reply.id).toBe(conv.messages[1].id);
    expect(reply.metadata!.model).toBe('gpt-4');
    expect(reply.metadata!.tokens).toBeGreaterThanOrEqual(100);
    expect(reply.metadata!.cost).toBeLessThan(0.01);
    expect(['我理解您的问题。让我来帮您分析一下...', '根据您提供的信息，我建议...',
      '这是一个很好的问题。基于当前的数据...', '让我为您查询相关信息...', '我来帮您处理这个请求...'])
      .toContain(reply.content.split('\n\n')[0]);
  });

  it('附件随用户消息持久化到 metadata', async () => {
    const svc = new AIAssistantService();
    const id = svc.createConversation();
    const attachments: Attachment[] = [{ id: 'a1', type: 'image', name: '截图.png', url: 'blob:x', size: 1024 }];

    await sendWithFakeTimers(svc, id, '看看这张图', attachments);
    expect(svc.getConversation(id)!.messages[0].metadata!.attachments).toEqual(attachments);
  });

  it('工具检测三通道全命中：查询+图表+系统状态 → 附加 📊/📈/💻 格式化结果', async () => {
    const svc = new AIAssistantService();
    const id = svc.createConversation();

    const reply = await sendWithFakeTimers(svc, id, '查询数据并生成图表，顺便看下系统状态监控');
    const conv = svc.getConversation(id)!;
    const assistant = conv.messages[1];

    expect(assistant.metadata!.tools).toHaveLength(3);
    // 真身已知行为：metadata.tools 记录的是检测阶段的原始 pending ToolCall
    // （executeTools 产出的是带 result/status 的派生对象，仅进入 content 格式化，不回写 metadata）
    expect(assistant.metadata!.tools!.map((t) => t.status)).toEqual(['pending', 'pending', 'pending']);
    expect(reply.content).toContain('📊 数据查询结果：找到 2 条记录');
    expect(reply.content).toContain('📈 图表已生成：bar 类型，ID: chart_');
    expect(reply.content).toContain('💻 系统状态：CPU');
  });

  it('detectToolCalls 白盒：无关键词返回空数组（sendMessage 不追加工具结果）', async () => {
    const svc = new AIAssistantService();
    const detect = (
      svc as unknown as { detectToolCalls(s: string): ToolCall[] }
    ).detectToolCalls.bind(svc);

    expect(detect('hello world')).toEqual([]);

    const all = detect('查询 数据 图表 可视化 系统状态 监控');
    expect(all.map((t) => t.name)).toEqual(['query_data', 'generate_chart', 'system_status']);
  });

  it('executeTools 白盒：query_data 工具真实执行（limit 默认 10 与显式覆盖）', async () => {
    const svc = new AIAssistantService();
    const execute = (
      svc as unknown as { executeTools(calls: ToolCall[]): Promise<ToolCall[]> }
    ).executeTools.bind(svc);

    const [defaultLimit] = await execute([makeToolCall('query_data', { table: 'users', filters: {} })]);
    expect(defaultLimit.status).toBe('success');
    expect(defaultLimit.result.total).toBe(2);
    expect(defaultLimit.result.query).toContain('LIMIT 10');

    const [customLimit] = await execute([makeToolCall('query_data', { table: 'logs', filters: { a: 1 }, limit: 5 })]);
    expect(customLimit.result.query).toContain('LIMIT 5');
    expect(customLimit.result.query).toContain('SELECT * FROM logs');
  });

  it('executeTools 白盒：generate_chart / system_status / send_notification / search 工具', async () => {
    const svc = new AIAssistantService();
    const execute = (
      svc as unknown as { executeTools(calls: ToolCall[]): Promise<ToolCall[]> }
    ).executeTools.bind(svc);

    const results = await execute([
      makeToolCall('generate_chart', { type: 'line', data: [1, 2], title: '趋势' }),
      makeToolCall('system_status'),
      makeToolCall('send_notification', { type: 'email', title: '告警', message: 'cpu 高', recipients: ['a@x'] }),
      makeToolCall('send_notification', {}), // recipients 缺省 → 1
      makeToolCall('search', { query: '如何部署' }), // scope/limit 缺省
      makeToolCall('search', { query: 'q', scope: 'docs', limit: 3 }),
    ]);

    expect(results.every((r) => r.status === 'success')).toBe(true);
    const [chart, status, notif, notifDefault, search, searchScoped] = results;
    expect(chart.result.chartId).toMatch(/^chart_/);
    expect(chart.result.config).toEqual({ title: '趋势', data: [1, 2], options: { responsive: true } });
    expect(status.result).toMatchObject({ uptime: '7天 12小时 30分钟' });
    expect(status.result.cpu).toBeGreaterThanOrEqual(0);
    expect(notif.result.status).toBe('sent');
    expect(notif.result.recipients).toBe(1);
    expect(notifDefault.result.recipients).toBe(1);
    expect(search.result.total).toBe(2);
    expect(search.result.scope).toBe('all');
    expect(searchScoped.result.scope).toBe('docs');
    expect(searchScoped.result.query).toBe('q');
  });

  it('executeTools 白盒：file_operations 四分支（read/write/list/未知动作抛错→error 态）', async () => {
    const svc = new AIAssistantService();
    const execute = (
      svc as unknown as { executeTools(calls: ToolCall[]): Promise<ToolCall[]> }
    ).executeTools.bind(svc);

    const [read, write, list, bad] = await execute([
      makeToolCall('file_operations', { action: 'read', path: '/a.txt' }),
      makeToolCall('file_operations', { action: 'write', path: '/b.txt', content: 'hello' }),
      makeToolCall('file_operations', { action: 'list', path: '/' }),
      makeToolCall('file_operations', { action: 'delete', path: '/c.txt' }),
    ]);

    expect(read.status).toBe('success');
    expect(read.result).toEqual({ content: '文件内容示例', size: 1024 });
    expect(write.result).toEqual({ success: true, path: '/b.txt', size: 5 });
    expect(write.result.size).toBe(5); // content?.length || 0
    expect(list.result.files).toEqual(['file1.txt', 'file2.pdf', 'image.png']);
    // 工具内抛错被捕获为 error 态
    expect(bad.status).toBe('error');
    expect(bad.result.error).toBe('不支持的文件操作: delete');
  });

  it('executeTools 白盒：calendar_operations create/list/默认 error 分支', async () => {
    const svc = new AIAssistantService();
    const execute = (
      svc as unknown as { executeTools(calls: ToolCall[]): Promise<ToolCall[]> }
    ).executeTools.bind(svc);

    const [created, listed, unknownAction] = await execute([
      makeToolCall('calendar_operations', { action: 'create', event: { title: '周会' } }),
      makeToolCall('calendar_operations', { action: 'list' }),
      makeToolCall('calendar_operations', { action: 'destroy' }),
    ]);

    expect(created.status).toBe('success');
    expect(created.result).toMatchObject({ status: 'created' });
    expect(listed.result.events).toHaveLength(2);
    expect(unknownAction.result.error).toBe('不支持的日程操作: destroy');
  });

  it('executeTools 白盒：未注册工具 → error 态与「工具 xx 不存在」', async () => {
    const svc = new AIAssistantService();
    const execute = (
      svc as unknown as { executeTools(calls: ToolCall[]): Promise<ToolCall[]> }
    ).executeTools.bind(svc);

    const [missing] = await execute([makeToolCall('no_such_tool')]);
    expect(missing.status).toBe('error');
    expect(missing.result.error).toBe('工具 no_such_tool 不存在');
  });

  it('formatToolResults 白盒：success 默认分支与 error 分支', () => {
    const svc = new AIAssistantService();
    const format = (
      svc as unknown as { formatToolResults(calls: ToolCall[]): string }
    ).formatToolResults.bind(svc);

    const out = format([
      { ...makeToolCall('send_notification'), status: 'success', result: { notificationId: 'n1' } },
      { ...makeToolCall('nope'), status: 'error', result: { error: '工具 nope 不存在' } },
    ]);
    expect(out).toBe('✅ send_notification 执行成功\n❌ nope 执行失败：工具 nope 不存在');
  });

  it('prepareContext 白盒：缺省 currentPage/recentActions 回退未知/无', () => {
    const svc = new AIAssistantService();
    const id = svc.createConversation();
    const conv = svc.getConversation(id)!;
    svc.addMessage(id, { role: 'user', content: 'q1' });
    svc.addMessage(id, { role: 'assistant', content: 'a1' });

    const prepare = (
      svc as unknown as { prepareContext(c: typeof conv): string }
    ).prepareContext.bind(svc);

    const ctxDefault = prepare(conv);
    expect(ctxDefault).toContain('当前页面: 未知');
    expect(ctxDefault).toContain('最近操作: 无');
    expect(ctxDefault).toContain('对话历史:');
    expect(ctxDefault).toContain('user: q1');
    expect(ctxDefault).toContain('assistant: a1');

    conv.context.currentPage = 'dashboard';
    conv.context.recentActions = ['打开面板', '筛选数据'];
    const ctxFull = prepare(conv);
    expect(ctxFull).toContain('当前页面: dashboard');
    expect(ctxFull).toContain('最近操作: 打开面板, 筛选数据');
  });
});

describe('ai-assistant-service · 导出', () => {
  const seeded = () => {
    const svc = new AIAssistantService();
    const id = svc.createConversation();
    svc.addMessage(id, { role: 'user', content: '查询数据' });
    svc.addMessage(id, { role: 'assistant', content: '已查询完毕' });
    // 第 2 条消息触发了标题自动生成：源行为 = 取首条用户消息内容
    return { svc, id };
  };

  it('json 导出可完整往返解析', () => {
    const { svc, id } = seeded();
    const parsed = JSON.parse(svc.exportConversation(id));
    expect(parsed.id).toBe(id);
    expect(parsed.messages).toHaveLength(2);
    expect(typeof parsed.createdAt).toBe('string');
  });

  it('markdown 导出含标题/元信息/角色图标与分隔线', () => {
    const { svc, id } = seeded();
    const md = svc.exportConversation(id, 'markdown');

    expect(md).toContain('# 查询数据'); // 自动生成的标题
    expect(md).toContain('**创建时间**:');
    expect(md).toContain('**更新时间**:');
    expect(md).toContain('**模型**: gpt-4');
    expect(md).toContain('## 👤 用户');
    expect(md).toContain('## 🤖 助手');
    expect(md).toContain('已查询完毕');
    expect(md).toContain('---');
  });

  it('txt 导出含时间戳行', () => {
    const { svc, id } = seeded();
    const txt = svc.exportConversation(id, 'txt');

    expect(txt).toContain('对话标题: 查询数据');
    expect(txt).toMatch(/\[.*\] 用户: 查询数据/);
    expect(txt).toMatch(/\[.*\] 助手: 已查询完毕/);
  });

  it('不支持的格式与对话不存在分别抛错', () => {
    const { svc, id } = seeded();
    expect(() => svc.exportConversation(id, 'xml' as 'json')).toThrow('不支持的导出格式');
    expect(() => svc.exportConversation('missing')).toThrow('对话不存在');
  });
});

describe('ai-assistant-service · localStorage 持久化', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('创建对话后写入 localStorage，新实例可从中恢复（含 Date 复原）', () => {
    const first = new AIAssistantService();
    const id = first.createConversation();
    first.addMessage(id, { role: 'user', content: '持久化' });

    expect(JSON.parse(localStorage.getItem('ai_conversations')!)[id]).toBeTruthy();

    const second = new AIAssistantService();
    const restored = second.getConversation(id)!;
    expect(restored).not.toBeNull();
    expect(restored.createdAt).toBeInstanceOf(Date);
    expect(restored.updatedAt).toBeInstanceOf(Date);
    expect(restored.messages[0].timestamp).toBeInstanceOf(Date);
    expect(restored.messages[0].content).toBe('持久化');
  });

  it('localStorage 存在损坏 JSON 时静默降级（console.error 分支）且不炸', () => {
    localStorage.setItem('ai_conversations', '{not-valid-json');
    const svc = new AIAssistantService();
    expect(svc.getAllConversations()).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });

  it('localStorage 为空时不加载任何对话', () => {
    const svc = new AIAssistantService();
    expect(svc.getAllConversations()).toEqual([]);
  });

  it('删除对话同步清理持久化存储', () => {
    const svc = new AIAssistantService();
    const id = svc.createConversation();
    expect(localStorage.getItem('ai_conversations')).toContain(id);
    svc.deleteConversation(id);
    expect(localStorage.getItem('ai_conversations')).not.toContain(id);
  });
});

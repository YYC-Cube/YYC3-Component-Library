// ============================================================
// YYC³ · @yyc3/education 批次 2 补测 · message-storage 全量（真实 IndexedDB）
// 批次 1 以内存桩 mock 覆盖缺口已登记 → 本件以 fake-indexeddb 打真码
// CRUD/批量/更新/删除/清空/筛选/分页/搜索/时间窗/计数/同步时间/导入导出
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { messageStorage, type StoredMessage } from '../intelligent-ai-widget/message-storage';

const msg = (overrides: Partial<StoredMessage> & { id: string }): StoredMessage => ({
  role: 'user',
  content: `消息 ${overrides.id}`,
  timestamp: Date.now(),
  ...overrides,
});

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  // 每用例独立空库：新 IDBFactory + 服务置空 db 强制重开
  vi.stubGlobal('indexedDB', new IDBFactory());
  (messageStorage as any).db = null;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('education · message-storage（fake-indexeddb 真码）', () => {
  it('initialize + addMessage/getMessage 往返 + 重复 id 抛错', async () => {
    await messageStorage.addMessage(msg({ id: 'm1', content: '第一条' }));
    const got = await messageStorage.getMessage('m1');
    expect(got?.content).toBe('第一条');
    expect(await messageStorage.getMessage('nope')).toBeNull();
    await expect(messageStorage.addMessage(msg({ id: 'm1' }))).rejects.toThrow('添加消息失败');
  });

  it('addMessages 批量 + getMessageCount', async () => {
    await messageStorage.addMessages([
      msg({ id: 'b1' }),
      msg({ id: 'b2', role: 'assistant' }),
      msg({ id: 'b3' }),
    ]);
    expect(await messageStorage.getMessageCount()).toBe(3);
  });

  it('updateMessage：存在合并更新；不存在 no-op resolve', async () => {
    await messageStorage.addMessage(msg({ id: 'u1', content: '原内容', status: 'sending' }));
    await messageStorage.updateMessage('u1', { status: 'read', content: '已读内容' });
    const got = await messageStorage.getMessage('u1');
    expect(got?.status).toBe('read');
    expect(got?.content).toBe('已读内容');
    await expect(messageStorage.updateMessage('ghost', { status: 'sent' })).resolves.toBeUndefined();
  });

  it('deleteMessage + clearMessages', async () => {
    await messageStorage.addMessages([msg({ id: 'd1' }), msg({ id: 'd2' })]);
    await messageStorage.deleteMessage('d1');
    expect(await messageStorage.getMessageCount()).toBe(1);
    await messageStorage.clearMessages();
    expect(await messageStorage.getMessageCount()).toBe(0);
  });

  it('getMessages：分页/降序/hasMore/total + role/时间窗/关键词筛选', async () => {
    const now = Date.now();
    await messageStorage.addMessages([
      msg({ id: 'p1', timestamp: now - 1000, content: '最早的机器学习消息' }),
      msg({ id: 'p2', timestamp: now - 500, content: '中间消息', role: 'assistant' }),
      msg({ id: 'p3', timestamp: now, content: '最新深度学习消息' }),
      msg({ id: 'p4', timestamp: now - 2000, role: 'system', content: '系统提示' }),
    ]);

    // 第 1 页 2 条：按时间降序 → p3、p2
    const page1 = await messageStorage.getMessages({ page: 1, pageSize: 2 });
    expect(page1.data.map((m) => m.id)).toEqual(['p3', 'p2']);
    expect(page1.total).toBe(4);
    expect(page1.hasMore).toBe(true);
    expect(page1.page).toBe(1);

    const page2 = await messageStorage.getMessages({ page: 2, pageSize: 2 });
    expect(page2.data.map((m) => m.id)).toEqual(['p1', 'p4']);
    expect(page2.hasMore).toBe(false);

    // role 筛选
    const assistantOnly = await messageStorage.getMessages({ page: 1, pageSize: 10, filter: { role: 'assistant' } });
    expect(assistantOnly.total).toBe(1);
    expect(assistantOnly.data[0].id).toBe('p2');

    // 时间窗筛选
    const ranged = await messageStorage.getMessages({
      page: 1,
      pageSize: 10,
      filter: { startDate: now - 600, endDate: now },
    });
    expect(ranged.data.map((m) => m.id)).toEqual(['p3', 'p2']); // 窗口 [-600, now] 含 p3(0)、p2(-500)

    // 关键词（大小写不敏感子串）
    const keyword = await messageStorage.getMessages({ page: 1, pageSize: 10, filter: { keyword: '学习' } });
    expect(keyword.data.map((m) => m.id).sort()).toEqual(['p1', 'p3']);
  });

  it('searchMessages：关键词子串 + limit 截断 + 降序', async () => {
    const now = Date.now();
    await messageStorage.addMessages([
      msg({ id: 's1', content: '学习笔记 alpha', timestamp: now - 300 }),
      msg({ id: 's2', content: '学习笔记 beta', timestamp: now - 200 }),
      msg({ id: 's3', content: '学习笔记 gamma', timestamp: now - 100 }),
      msg({ id: 's4', content: '无关内容', timestamp: now }),
    ]);
    const hits = await messageStorage.searchMessages('学习');
    expect(hits.map((m) => m.id)).toEqual(['s3', 's2', 's1']); // 降序
    const limited = await messageStorage.searchMessages('学习', 2);
    expect(limited).toHaveLength(2);
  });

  it('getMessagesByTimeRange：闭区间过滤 + 降序', async () => {
    const now = Date.now();
    await messageStorage.addMessages([
      msg({ id: 't1', timestamp: now - 5000 }),
      msg({ id: 't2', timestamp: now - 1000 }),
      msg({ id: 't3', timestamp: now }),
    ]);
    const ranged = await messageStorage.getMessagesByTimeRange(now - 2000, now);
    expect(ranged.map((m) => m.id)).toEqual(['t3', 't2']);
  });

  it('getLastSyncTime 默认 0 + updateLastSyncTime 往返', async () => {
    expect(await messageStorage.getLastSyncTime()).toBe(0);
    await messageStorage.updateLastSyncTime(1234567);
    expect(await messageStorage.getLastSyncTime()).toBe(1234567);
  });

  it('exportMessages JSON 串 + importMessages 回灌计数 + 坏 JSON 抛错', async () => {
    await messageStorage.addMessages([msg({ id: 'e1' }), msg({ id: 'e2' })]);
    const exported = await messageStorage.exportMessages();
    const parsed = JSON.parse(exported);
    expect(parsed).toHaveLength(2);

    // 换空库回灌
    vi.stubGlobal('indexedDB', new IDBFactory());
    (messageStorage as any).db = null;
    const count = await messageStorage.importMessages(exported);
    expect(count).toBe(2);
    expect(await messageStorage.getMessageCount()).toBe(2);

    await expect(messageStorage.importMessages('{oops')).rejects.toThrow('导入消息失败');
  });

  it('initialize 打开失败 → reject（无法打开IndexedDB）', async () => {
    vi.stubGlobal('indexedDB', {
      open: () => {
        const req: any = {};
        setTimeout(() => req.onerror?.({} as Event), 0);
        return req;
      },
    });
    (messageStorage as any).db = null;
    await expect(messageStorage.initialize()).rejects.toThrow('无法打开IndexedDB');
  });
});

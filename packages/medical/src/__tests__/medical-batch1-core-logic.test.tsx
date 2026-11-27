// ============================================================
// YYC³ · @yyc3/medical 批次 1 · 第一层：逻辑重头
// lib/api（client + endpoints）/ hooks 五件（useApi / useRealTimeData /
// useToast / useTranslation / use-mobile）/ utils / adapters / patientService
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { api, type ApiResponse } from '../lib/api/client';
import { API_ENDPOINTS } from '../lib/api/endpoints';
import { useApi } from '../hooks/useApi';
import { useRealTimeData } from '../hooks/use-real-time-data';
import { useToast, toast, reducer } from '../hooks/use-toast';
import { useTranslation } from '../hooks/use-translation';
import { useIsMobile } from '../hooks/use-mobile';
import { isClient, safeWindow, safeDocument, safeAddEventListener } from '../utils/client-utils';
import { cn } from '../utils/cn';
import { MEDICAL_INDUSTRY_CONFIGS } from '../adapters/industry';
import { patientService } from '../services/patientService';
import { stubMatchMedia } from './helpers';

// ---------- fetch 应答工厂 ----------
const jsonResponse = (body: unknown, ok = true, status = 200, statusText = 'OK') =>
  ({
    ok,
    status,
    statusText,
    json: async () => body,
  }) as unknown as Response;

beforeEach(() => {
  stubMatchMedia();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// ---------- lib/api/client ----------
describe('lib/api/client', () => {
  it('get 拼接 params 查询串并携带 JSON 头', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([{ id: 1 }]));
    vi.stubGlobal('fetch', fetchMock);

    const res = await api.get<{ id: number }[]>('/patients', {
      params: { page: 2, search: '张三', empty: undefined },
    });

    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(res.data).toEqual([{ id: 1 }]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/patients?page=2&search=' + encodeURIComponent('张三'));
    expect(init.method).toBe('GET');
    expect(init.headers['Content-Type']).toBe('application/json');
  });

  it('已有 query 的 url 用 & 追加 params', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal('fetch', fetchMock);

    await api.get('/patients?a=1', { params: { b: 2 } });
    expect(fetchMock.mock.calls[0][0]).toBe('/patients?a=1&b=2');
  });

  it('params 全 undefined / 缺省时不加查询串', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal('fetch', fetchMock);

    await api.get('/patients', { params: { a: undefined } });
    await api.get('/records');
    expect(fetchMock.mock.calls[0][0]).toBe('/patients');
    expect(fetchMock.mock.calls[1][0]).toBe('/records');
  });

  it('post/put/patch 序列化 body 为 JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: 7 }));
    vi.stubGlobal('fetch', fetchMock);

    await api.post('/patients', { name: '李四' });
    await api.put('/patients/7', { age: 40 });
    await api.patch('/patients/7', { age: 41 });

    expect(fetchMock.mock.calls[0][1].method).toBe('POST');
    expect(fetchMock.mock.calls[0][1].body).toBe(JSON.stringify({ name: '李四' }));
    expect(fetchMock.mock.calls[1][1].method).toBe('PUT');
    expect(fetchMock.mock.calls[2][1].method).toBe('PATCH');
  });

  it('delete 不带 body；body undefined 时透传 rest.body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(null));
    vi.stubGlobal('fetch', fetchMock);

    await api.delete('/patients/7');
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe('DELETE');
    expect(init.body).toBeUndefined();
  });

  it('非 2xx：ok=false 且 message 带 statusText', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(null, false, 404, 'Not Found'));
    vi.stubGlobal('fetch', fetchMock);

    const res = await api.get('/patients/404');
    expect(res.ok).toBe(false);
    expect(res.message).toBe('请求失败: Not Found');
  });

  it('响应体非法 JSON：data 为 null 但请求不抛错', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => {
        throw new Error('bad json');
      },
    } as unknown as Response);
    vi.stubGlobal('fetch', fetchMock);

    const res = await api.get('/patients');
    expect(res.ok).toBe(true);
    expect(res.data).toBeNull();
  });

  it('requiresAuth / revalidate 不透传进 fetch init', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal('fetch', fetchMock);

    await api.get('/patients', { requiresAuth: true, revalidate: 60, cache: 'no-store' });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.requiresAuth).toBeUndefined();
    expect(init.revalidate).toBeUndefined();
    expect(init.cache).toBe('no-store');
  });

  it('FormData body 原生 multipart 通道：实例原样透传且不设 Content-Type（batch2 缺陷修复锁）', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal('fetch', fetchMock);

    const form = new FormData();
    const file = new File(['pixels'], 'mri.dcm', { type: 'application/dicom' });
    form.append('file', file);
    form.append('meta', 'x');

    await api.post('/upload', form);

    const [, init] = fetchMock.mock.calls[0];
    expect(init.body).toBe(form); // 同一实例——未 stringify
    expect(init.body.get('file')).toBe(file);
    expect(init.body.get('meta')).toBe('x');
    expect(init.headers['Content-Type']).toBeUndefined();
  });

  it('rest.body 直传（无 body 参数）不受 FormData 通道影响', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal('fetch', fetchMock);

    const raw = new FormData();
    raw.append('k', 'v');
    await api.post('/upload', undefined, { body: raw as unknown as BodyInit });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.body).toBe(raw); // 经 rest.body 原样透传（该路径维持既有语义）
    // body 参数未给 FormData 通道不介入——默认 JSON 头照旧（既有语义，不在本次修复面）
    expect(init.headers['Content-Type']).toBe('application/json');
  });
});

describe('lib/api/endpoints', () => {
  it('静态端点与函数端点求值正确', () => {
    expect(API_ENDPOINTS.PATIENTS.LIST).toBe('/patients');
    expect(API_ENDPOINTS.PATIENTS.DETAIL('p1')).toBe('/patients/p1');
    expect(API_ENDPOINTS.PATIENTS.MEDICAL_RECORDS('p1')).toBe('/patients/p1/medical-records');
    expect(API_ENDPOINTS.MEDICAL_RECORDS.UPLOAD_IMAGE).toBe('/medical-records/upload-image');
    expect(API_ENDPOINTS.USERS.DETAIL('u9')).toBe('/users/u9');
    expect(API_ENDPOINTS.AUTH.LOGIN).toBe('/auth/login');
    expect(API_ENDPOINTS.AI_DIAGNOSIS.ANALYZE).toBe('/ai/analyze');
    expect(API_ENDPOINTS.RESEARCH.PROJECT_DETAIL('r1')).toBe('/research/projects/r1');
    expect(API_ENDPOINTS.KNOWLEDGE_BASE.ARTICLE_DETAIL('k1')).toBe('/knowledge-base/articles/k1');
    expect(API_ENDPOINTS.ANALYTICS.DASHBOARD).toBe('/analytics/dashboard');
    expect(API_ENDPOINTS.CERTIFICATIONS.REVIEW('c1')).toBe('/certifications/c1/review');
    expect(API_ENDPOINTS.CERTIFICATIONS.MY_CERTIFICATIONS).toBe('/certifications/my');
    expect(API_ENDPOINTS.AI_MODELS.TEST_CONNECTION('m1')).toBe('/ai/configs/m1/test');
    expect(API_ENDPOINTS.AI_MODELS.STREAM_CHAT).toBe('/ai/stream-chat');
  });
});

// ---------- hooks/useApi ----------
/** 挂载 useApi 的探针组件：暴露句柄供断言驱动 */
function UseApiProbe({
  onSuccess,
  onError,
  initialData,
  handle,
}: {
  onSuccess?: (d: unknown) => void;
  onError?: (e: string, s: number) => void;
  initialData?: unknown;
  handle: { ref: ReturnType<typeof useApi> | null };
}) {
  const hook = useApi({ onSuccess, onError, initialData });
  handle.ref = hook;
  return (
    <div>
      <span data-testid="data">{JSON.stringify(hook.data)}</span>
      <span data-testid="error">{hook.error ?? ''}</span>
      <span data-testid="status">{hook.status ?? ''}</span>
      <span data-testid="loading">{String(hook.isLoading)}</span>
    </div>
  );
}

describe('hooks/useApi', () => {
  it('get 成功：data/status 更新且 onSuccess 触发', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ ok: true, data: { name: '患者A' } })),
    );
    const onSuccess = vi.fn();
    const handle = { ref: null as ReturnType<typeof useApi> | null };
    render(<UseApiProbe onSuccess={onSuccess} handle={handle} />);
    const hook = handle.ref!;

    const res = await hook.get('/patients/1');
    expect(res.ok).toBe(true);
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(screen.getByTestId('data').textContent).toContain('患者A');
    expect(screen.getByTestId('status').textContent).toBe('200');
    expect(screen.getByTestId('loading').textContent).toBe('false');
  });

  it('post/put/patch/delete 分派对应 HTTP 方法', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true, data: null }));
    vi.stubGlobal('fetch', fetchMock);
    const handle = { ref: null as ReturnType<typeof useApi> | null };
    render(<UseApiProbe handle={handle} />);
    const hook = handle.ref!;

    await hook.post('/patients', { name: 'B' });
    await hook.put('/patients/2', { age: 1 });
    await hook.patch('/patients/2', { age: 2 });
    await hook.delete('/patients/2');

    const methods = fetchMock.mock.calls.map(([, init]) => init.method);
    expect(methods).toEqual(['POST', 'PUT', 'PATCH', 'DELETE']);
  });

  it('request 未知 method 经 switch default 回落 GET', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true, data: null }));
    vi.stubGlobal('fetch', fetchMock);
    const handle = { ref: null as ReturnType<typeof useApi> | null };
    render(<UseApiProbe handle={handle} />);
    await handle.ref!.request('/x', { method: 'bogus' as never });
    expect(fetchMock.mock.calls[0][1].method).toBe('GET');
  });

  it('契约失败（ok=false）：error 置位且 onError 触发（message 由 client 拼 statusText）', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({ ok: false, data: null, status: 500 }, false, 500, 'Internal Error'),
      ),
    );
    const onError = vi.fn();
    const handle = { ref: null as ReturnType<typeof useApi> | null };
    render(<UseApiProbe onError={onError} handle={handle} />);
    const res = await handle.ref!.get('/patients');
    expect(res.ok).toBe(false);
    await waitFor(() => expect(onError).toHaveBeenCalledWith('请求失败: Internal Error', 500));
    expect(screen.getByTestId('error').textContent).toBe('请求失败: Internal Error');
    expect(screen.getByTestId('status').textContent).toBe('500');
  });

  it('网络异常：error 捕获、status=0、返回兜底 ApiResponse', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    const onError = vi.fn();
    const handle = { ref: null as ReturnType<typeof useApi> | null };
    render(<UseApiProbe onError={onError} handle={handle} />);
    const res = await handle.ref!.get('/patients');
    expect(res.status).toBe(0);
    expect(res.ok).toBe(false);
    expect(res.message).toBe('network down');
    await waitFor(() => expect(onError).toHaveBeenCalledWith('network down', 0));
    expect(screen.getByTestId('status').textContent).toBe('0');
  });

  it('非 Error 抛出物：回落文案「请求过程中发生错误」', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue('boom-string'));
    const handle = { ref: null as ReturnType<typeof useApi> | null };
    render(<UseApiProbe handle={handle} />);
    const res = await handle.ref!.get('/patients');
    expect(res.message).toBe('请求过程中发生错误');
  });

  it('initialData 生效且 reset 还原', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ ok: true, data: 'NEW' })));
    const handle = { ref: null as ReturnType<typeof useApi> | null };
    render(<UseApiProbe initialData="INIT" handle={handle} />);
    expect(screen.getByTestId('data').textContent).toContain('INIT');

    await handle.ref!.get('/patients');
    await waitFor(() => expect(screen.getByTestId('data').textContent).toContain('NEW'));

    act(() => handle.ref!.reset());
    expect(screen.getByTestId('data').textContent).toContain('INIT');
    expect(screen.getByTestId('error').textContent).toBe('');
    expect(screen.getByTestId('status').textContent).toBe('');
  });
});

// ---------- hooks/useRealTimeData ----------
describe('hooks/useRealTimeData', () => {
  /** 探针组件（真组件——hooks 必须在 render 体内调用） */
  function Probe(props: {
    fetchFn: () => Promise<string>;
    initial: string;
    interval?: number;
    enabled?: boolean;
    onError?: (e: Error) => void;
    handle: { ref: ReturnType<typeof useRealTimeData> | null };
  }) {
    const hook = useRealTimeData(props.fetchFn, props.initial, {
      interval: props.interval,
      enabled: props.enabled,
      onError: props.onError,
    });
    props.handle.ref = hook;
    return (
      <div>
        <span data-testid="data">{String(hook.data)}</span>
        <span data-testid="loading">{String(hook.isLoading)}</span>
        <span data-testid="error">{hook.error?.message ?? ''}</span>
        <span data-testid="updated">{hook.lastUpdated ? 'yes' : 'no'}</span>
      </div>
    );
  }

  it('初始加载成功：data 更新、isLoading 归零、lastUpdated 置位', async () => {
    vi.useFakeTimers();
    try {
      const fetchFn = vi.fn().mockResolvedValue('V2');
      const handle = { ref: null as ReturnType<typeof useRealTimeData> | null };
      render(<Probe fetchFn={fetchFn} initial="V1" handle={handle} />);
      expect(screen.getByTestId('data').textContent).toBe('V1');

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(fetchFn).toHaveBeenCalled();
      expect(screen.getByTestId('data').textContent).toBe('V2');
      expect(screen.getByTestId('loading').textContent).toBe('false');
      expect(screen.getByTestId('updated').textContent).toBe('yes');

      // interval tick 再拉
      await act(async () => {
        await vi.advanceTimersByTimeAsync(5000);
      });
      expect(fetchFn.mock.calls.length).toBeGreaterThanOrEqual(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('失败重试至 retryCount 上限后 onError 收尾', async () => {
    vi.useFakeTimers();
    try {
      const err = new Error('拉取失败');
      const fetchFn = vi.fn().mockRejectedValue(err);
      const onError = vi.fn();
      const handle = { ref: null as ReturnType<typeof useRealTimeData> | null };
      render(
        <Probe fetchFn={fetchFn} initial="V1" interval={600000} onError={onError} handle={handle} />,
      );
      // 初始 + 3 次重试（默认 retryDelay 1000）——interval 拉大到 600s 与重试解耦
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(4000);
      });
      expect(fetchFn.mock.calls.length).toBe(4); // 1 初始 + 3 重试，不再更多
      await act(async () => {
        await vi.advanceTimersByTimeAsync(4000);
      });
      expect(fetchFn.mock.calls.length).toBe(4); // 重试耗尽后不再追加
      expect(onError).toHaveBeenCalledWith(err);
      expect(screen.getByTestId('error').textContent).toBe('拉取失败');
    } finally {
      vi.useRealTimers();
    }
  });

  it('非 Error 抛出物包装为「未知错误」', async () => {
    vi.useFakeTimers();
    try {
      const fetchFn = vi.fn().mockRejectedValue('raw');
      const handle = { ref: null as ReturnType<typeof useRealTimeData> | null };
      render(<Probe fetchFn={fetchFn} initial="V1" handle={handle} />);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(screen.getByTestId('error').textContent).toBe('未知错误');
    } finally {
      vi.useRealTimers();
    }
  });

  it('enabled=false 不发起初始加载', async () => {
    vi.useFakeTimers();
    try {
      const fetchFn = vi.fn().mockResolvedValue('V2');
      const handle = { ref: null as ReturnType<typeof useRealTimeData> | null };
      render(<Probe fetchFn={fetchFn} initial="V1" enabled={false} handle={handle} />);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(6000);
      });
      expect(fetchFn).not.toHaveBeenCalled();
      expect(screen.getByTestId('data').textContent).toBe('V1');
    } finally {
      vi.useRealTimers();
    }
  });

  it('updateData 应用 updater；refresh 手动拉取', async () => {
    vi.useFakeTimers();
    try {
      const fetchFn = vi.fn().mockResolvedValue('FETCHED');
      const handle = { ref: null as ReturnType<typeof useRealTimeData> | null };
      render(<Probe fetchFn={fetchFn} initial="V1" handle={handle} />);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      act(() => handle.ref!.updateData((cur) => cur + '+local'));
      expect(screen.getByTestId('data').textContent).toBe('FETCHED+local');

      await act(async () => {
        handle.ref!.refresh();
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(screen.getByTestId('data').textContent).toBe('FETCHED');
    } finally {
      vi.useRealTimers();
    }
  });
});

// ---------- hooks/use-toast ----------
describe('hooks/use-toast', () => {
  // toast 模块全局 memoryState 常驻（跨测试残留）——每个用例前经公共 API 清仓
  beforeEach(() => {
    vi.useFakeTimers();
    const purge = toast({ title: 'purge' });
    purge.dismiss();
    vi.advanceTimersByTime(1000001); // TOAST_REMOVE_DELAY 后 REMOVE_TOAST 清空
    vi.useRealTimers();
  });

  it('reducer：ADD 截断至 TOAST_LIMIT、UPDATE 合并、DISMISS 关闭、REMOVE 清除', () => {
    const t1 = { id: '1', title: 'A', open: true } as never;
    const t2 = { id: '2', title: 'B', open: true } as never;
    const empty = { toasts: [] };

    const added = reducer(empty, { type: 'ADD_TOAST', toast: t1 });
    expect(added.toasts).toHaveLength(1);

    const stacked = reducer(added, { type: 'ADD_TOAST', toast: t2 });
    expect(stacked.toasts).toHaveLength(1); // TOAST_LIMIT=1，新顶旧去
    expect(stacked.toasts[0].id).toBe('2');

    const updated = reducer(stacked, {
      type: 'UPDATE_TOAST',
      toast: { id: '2', title: 'B2' } as never,
    });
    expect(updated.toasts[0].title).toBe('B2');

    const dismissed = reducer(updated, { type: 'DISMISS_TOAST', toastId: '2' });
    expect(dismissed.toasts[0].open).toBe(false);

    // 无 toastId：全部关闭
    const dismissAll = reducer(added, { type: 'DISMISS_TOAST' });
    expect(dismissAll.toasts.every((t) => !t.open)).toBe(true);

    const removed = reducer(dismissed, { type: 'REMOVE_TOAST', toastId: '2' });
    expect(removed.toasts).toHaveLength(0);

    const removeAll = reducer(stacked, { type: 'REMOVE_TOAST' });
    expect(removeAll.toasts).toHaveLength(0);
  });

  it('toast() 全链路：add → update → dismiss → remove（经 useToast 订阅面）', async () => {
    vi.useFakeTimers();
    try {
      const states: { toasts: unknown[] }[] = [];
      function Probe() {
        const { toasts } = useToast();
        states.push({ toasts });
        return <div data-testid="count">{toasts.length}</div>;
      }
      render(<Probe />);

      let handle: { id: string; dismiss: () => void; update: (p: never) => void };
      act(() => {
        handle = toast({ title: '保存成功', description: '病历已更新' });
      });
      expect(handle!.id).toMatch(/^\d+$/);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(screen.getByTestId('count').textContent).toBe('1');

      act(() => handle!.update({ title: '已更新' } as never));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      act(() => handle!.dismiss());
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      // TOAST_REMOVE_DELAY=1000000 后移除
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000001);
      });
      expect(screen.getByTestId('count').textContent).toBe('0');
    } finally {
      vi.useRealTimers();
    }
  });

  it('useToast.dismiss 无参全关（订阅面）', async () => {
    vi.useFakeTimers();
    try {
      function Probe() {
        const { toasts, toast: push, dismiss } = useToast();
        return (
          <div>
            <button
              onClick={() => {
                push({ title: 'T' });
                push({ title: 'T2' });
              }}
            >
              add
            </button>
            <button onClick={() => dismiss()}>close-all</button>
            <span data-testid="n">{toasts.length}</span>
          </div>
        );
      }
      render(<Probe />);
      fireEvent.click(screen.getByText('add'));
      expect(screen.getByTestId('n').textContent).toBe('1'); // limit=1
      fireEvent.click(screen.getByText('close-all'));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      // open 翻 false 但 remove 延迟未到——数量仍在，状态已关
      expect(screen.getByTestId('n').textContent).toBe('1');
    } finally {
      vi.useRealTimers();
    }
  });
});

// ---------- hooks/use-translation ----------
describe('hooks/use-translation', () => {
  it('字典命中 / fallback / key 直返', () => {
    const { t, tSync, locale, formatDate } = useTranslation();
    expect(t('predictionAnalysis')).toBe('预测分析');
    expect(t('nope', '回退')).toBe('回退');
    expect(t('nope')).toBe('nope');
    expect(tSync('settings')).toBe('设置');
    expect(locale).toBe('zh-CN');
  });

  it('formatDate 三种入参统一 zh-CN 格式', () => {
    const { formatDate } = useTranslation();
    expect(formatDate(new Date(2026, 10, 27))).toBe('2026年11月27日');
    expect(formatDate('2026-01-05T00:00:00Z')).toBe('2026年1月5日');
    expect(formatDate(1767000000000)).toMatch(/^\d{4}年\d{1,2}月\d{1,2}日$/);
  });
});

// ---------- hooks/use-mobile ----------
describe('hooks/useIsMobile', () => {
  /** 捕获 change 监听器的 matchMedia 桩（hook 只响应 mql change 事件） */
  function stubCapturingMatchMedia() {
    const listeners = new Set<() => void>();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: (_: string, cb: () => void) => listeners.add(cb),
        removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    return {
      resize(width: number) {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });
        for (const cb of listeners) cb();
      },
    };
  }

  it('窗口宽 <768 判移动端，mql change 后 >=768 判桌面', async () => {
    const mm = stubCapturingMatchMedia();
    mm.resize(375);
    function Probe() {
      const mobile = useIsMobile();
      return <span data-testid="mobile">{String(mobile)}</span>;
    }
    render(<Probe />);
    await waitFor(() => expect(screen.getByTestId('mobile').textContent).toBe('true'));

    act(() => mm.resize(1280));
    expect(screen.getByTestId('mobile').textContent).toBe('false');
    mm.resize(1024);
  });
});

// ---------- utils ----------
describe('utils/client-utils', () => {
  it('isClient 在 jsdom 下为 true', () => {
    expect(isClient).toBe(true);
  });

  it('safeWindow/safeDocument 正常取值', () => {
    expect(safeWindow((w) => typeof w.document, 'fb')).toBe('object');
    expect(safeDocument((d) => typeof d.body, 'fb')).toBe('object');
  });

  it('safeWindow/safeDocument 访问器抛错回落 fallback 并静音报错', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(safeWindow(() => { throw new Error('x'); }, 'fb')).toBe('fb');
    expect(safeDocument(() => { throw new Error('y'); }, 'fb')).toBe('fb');
    expect(errSpy).toHaveBeenCalledTimes(2);
  });

  it('safeAddEventListener 挂载/卸载与空目标兜底', () => {
    const target = new EventTarget();
    const handler = vi.fn();
    const off = safeAddEventListener(target, 'ping', handler);
    target.dispatchEvent(new Event('ping'));
    expect(handler).toHaveBeenCalledTimes(1);
    off();
    target.dispatchEvent(new Event('ping'));
    expect(handler).toHaveBeenCalledTimes(1);

    expect(safeAddEventListener(null, 'x', handler)).toBeTypeOf('function');
  });

  it('safeAddEventListener addEventListener 抛错回落 noop', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const bad = { addEventListener: () => { throw new Error('z'); } } as unknown as EventTarget;
    const off = safeAddEventListener(bad, 'x', vi.fn());
    expect(off).toBeTypeOf('function');
    expect(errSpy).toHaveBeenCalledTimes(1);
    expect(() => off()).not.toThrow();
  });
});

describe('utils/cn', () => {
  it('合并 className 并处理冲突/条件', () => {
    expect(cn('a', 'b')).toBe('a b');
    expect(cn('px-2', false && 'hidden', 'py-1')).toBe('px-2 py-1');
    expect(cn('px-2', 'px-4')).toBe('px-4'); // tailwind-merge 冲突消解
  });
});

// ---------- adapters/industry ----------
describe('adapters/industry', () => {
  it('医疗双行业配置完整且入册副作用已执行', async () => {
    expect(Object.keys(MEDICAL_INDUSTRY_CONFIGS).sort()).toEqual(['yyc3-elder', 'yyc3-med']);

    const med = MEDICAL_INDUSTRY_CONFIGS['yyc3-med'];
    expect(med.code).toBe('MED');
    expect(med.metrics).toHaveLength(4);
    expect(med.dashboardLayout.refreshInterval).toBe(5000);
    expect(med.highAvailability.targetUptime).toBe(99.9);
    expect(med.highIntelligence.predictionAccuracy).toBe(0.85);

    const elder = MEDICAL_INDUSTRY_CONFIGS['yyc3-elder'];
    expect(elder.code).toBe('ELDER');
    expect(elder.highSecurity.complianceStandards).toContain('GDPR');
    expect(elder.standards.serviceLevel).toBe('platinum');

    // import 副作用：@yyc3/lib registry 已收医疗域配置
    const lib = await import('@yyc3/lib');
    const industries = lib.getAllIndustries().map((i: { id: string }) => i.id);
    expect(industries).toEqual(expect.arrayContaining(['yyc3-med', 'yyc3-elder']));
    expect(lib.getIndustryConfig('yyc3-med').name).toBe('医疗健康');
  });
});

// ---------- services/patientService ----------
describe('services/patientService', () => {
  it('getPatients 携带分页/搜索参数打 LIST 端点', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true, data: [] }));
    vi.stubGlobal('fetch', fetchMock);

    await patientService.getPatients({ page: 1, limit: 20, search: '王', sortBy: 'name', sortOrder: 'desc' });
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('/patients?');
    expect(url).toContain('page=1');
    expect(url).toContain('limit=20');
    expect(url).toContain(encodeURIComponent('王'));
  });

  it('getPatientById 命中 DETAIL 端点', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: 'p1', name: '患者一' }));
    vi.stubGlobal('fetch', fetchMock);
    const res = await patientService.getPatientById('p1');
    expect(fetchMock.mock.calls[0][0]).toBe('/patients/p1');
    expect(res.data).toEqual({ id: 'p1', name: '患者一' });
  });

  it('create/update/delete 患者分别打 POST/PATCH/DELETE', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true, data: null }));
    vi.stubGlobal('fetch', fetchMock);

    await patientService.createPatient({ name: '新', gender: '男', age: 30, medicalRecordNumber: 'MRN1', contactInfo: 'x' });
    await patientService.updatePatient('p1', { age: 31 });
    await patientService.deletePatient('p1');

    expect(fetchMock.mock.calls[0]).toEqual(['/patients', expect.objectContaining({ method: 'POST' })]);
    expect(fetchMock.mock.calls[1][0]).toBe('/patients/p1');
    expect(fetchMock.mock.calls[1][1].method).toBe('PATCH');
    expect(fetchMock.mock.calls[2][1].method).toBe('DELETE');
  });

  it('医疗记录 CRUD 走对应端点', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true, data: [] }));
    vi.stubGlobal('fetch', fetchMock);

    await patientService.getPatientMedicalRecords('p1', { page: 1, startDate: '2026-01-01', endDate: '2026-12-31' });
    expect(fetchMock.mock.calls[0][0]).toContain('/patients/p1/medical-records?');

    await patientService.createMedicalRecord({ patientId: 'p1', date: '2026-01-01', doctorId: 'd1', doctorName: '张医生', diagnosis: '感冒', treatment: '休息', notes: '' });
    expect(fetchMock.mock.calls[1]).toEqual(['/medical-records', expect.objectContaining({ method: 'POST' })]);

    await patientService.updateMedicalRecord('m1', { notes: '复查' });
    expect(fetchMock.mock.calls[2][0]).toBe('/medical-records/m1');

    await patientService.deleteMedicalRecord('m1');
    expect(fetchMock.mock.calls[3][1].method).toBe('DELETE');
  });

  it('uploadMedicalImage 走 UPLOAD_IMAGE 端点——FormData 原样到达（batch2 缺陷修复回归锁）', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true, data: null }));
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['pixels'], 'ct.png', { type: 'image/png' });
    await patientService.uploadMedicalImage(file, { patientId: 'p1', imageType: 'CT', description: '胸片' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/medical-records/upload-image');
    // 修复语义：body 是同一个 FormData 实例（不被 stringify），字段齐全
    expect(init.body).toBeInstanceOf(FormData);
    expect(init.body).not.toBe(JSON.stringify(new FormData()));
    expect(init.body.get('file')).toBe(file);
    expect(JSON.parse(init.body.get('metadata'))).toEqual({
      patientId: 'p1',
      imageType: 'CT',
      description: '胸片',
    });
    // 不手设 Content-Type——浏览器自动生成带 boundary 的 multipart/form-data
    expect(init.headers['Content-Type']).toBeUndefined();
  });
});

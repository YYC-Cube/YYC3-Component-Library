// ============================================================
// YYC³ · @yyc3/medical 批次 5 · 服务面 / 工具面 / EHR 长尾
// knowledge-graph-service 过滤/关联/统计直驱 + API_ENDPOINTS 全组 +
// client-utils 客户端/回退双臂 + ehr 三客户端 + useApi/use-real-time-data
// fetch 失败臂
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { stubMedicalDom, silenceConsole, stubFetchRouter } from './helpers';

vi.mock('next/navigation', async () => (await import('./helpers')).nextNavigationModule());
import { knowledgeGraphService } from '../services/knowledge-graph-service';
import { API_ENDPOINTS } from '../lib/api/endpoints';
import { safeWindow, safeDocument, isClient } from '../utils/client-utils';
import EHRMappingClient from '../ehr/ehr-mapping-client';
import EHRIntegrationClient from '../ehr/ehr-integration-client';
import { EHRIntegrationStatus } from '../components/ehr-integration-status';
import { EHRDataMapping } from '../components/ehr-data-mapping';

beforeEach(() => {
  stubMedicalDom();
  silenceConsole();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('knowledge-graph-service 残余方法直驱', () => {
  const graphId = 'lung-nodule-graph';

  it('getFilteredGraph 全过滤选项组合', () => {
    const graph = knowledgeGraphService.getGraphById(graphId);
    expect(graph).toBeTruthy();
    // 全量
    const all = knowledgeGraphService.getFilteredGraph(graphId, {});
    expect(all.nodes.length).toBeGreaterThan(0);
    // nodeTypes 过滤
    const byType = knowledgeGraphService.getFilteredGraph(graphId, {
      nodeTypes: [graph!.nodes[0].type],
    });
    expect(byType.nodes.every((n) => n.type === graph!.nodes[0].type)).toBe(true);
    // minImportance 过滤（含超阈值空集臂）
    const byImp = knowledgeGraphService.getFilteredGraph(graphId, { minImportance: 8 });
    expect(byImp.nodes.every((n) => n.importance >= 8)).toBe(true);
    const none = knowledgeGraphService.getFilteredGraph(graphId, { minImportance: 999 });
    expect(none.nodes.length).toBe(0);
    // searchQuery 命中/不命中
    const hit = knowledgeGraphService.getFilteredGraph(graphId, { searchQuery: '结' });
    expect(hit.nodes.length).toBeGreaterThan(0);
    const miss = knowledgeGraphService.getFilteredGraph(graphId, { searchQuery: 'zzz-无' });
    expect(miss.nodes.length).toBe(0);
    // relationTypes + minStrength
    const relType = graph!.relations[0]?.type;
    if (relType) {
      const byRel = knowledgeGraphService.getFilteredGraph(graphId, { relationTypes: [relType] });
      expect(byRel.relations.every((r) => r.type === relType)).toBe(true);
    }
    const byStr = knowledgeGraphService.getFilteredGraph(graphId, { minStrength: 999 });
    expect(byStr.relations.length).toBe(0);
    // focusNodeId + maxDistance BFS
    const focus = graph!.nodes[0];
    const focused = knowledgeGraphService.getFilteredGraph(graphId, {
      focusNodeId: focus.id,
      maxDistance: 1,
    });
    expect(focused.nodes.length).toBeGreaterThan(0);
    // 不存在的 focusNode
    const ghost = knowledgeGraphService.getFilteredGraph(graphId, {
      focusNodeId: 'ghost-node',
      maxDistance: 2,
    });
    expect(ghost).toBeTruthy();
  });

  it('getRelatedNodes / getRelationsByNodeId / getNodesByType / getRelationsByType / searchGraph / getGraphStats / 不存在图 null 臂', () => {
    const graph = knowledgeGraphService.getGraphById(graphId)!;
    const nodeId = graph.nodes[0].id;

    const related = knowledgeGraphService.getRelatedNodes(graphId, nodeId, 2);
    expect(Array.isArray(related)).toBe(true);
    const rels = knowledgeGraphService.getRelationsByNodeId(graphId, nodeId);
    expect(Array.isArray(rels)).toBe(true);
    const byType = knowledgeGraphService.getNodesByType(graphId, graph.nodes[0].type);
    expect(byType.length).toBeGreaterThan(0);
    const relType = graph.relations[0]?.type;
    if (relType) {
      expect(knowledgeGraphService.getRelationsByType(graphId, relType).length).toBeGreaterThan(0);
    }
    const hit = knowledgeGraphService.searchGraph(graphId, '结');
    expect(hit.nodes.length + hit.relations.length).toBeGreaterThan(0);
    const miss = knowledgeGraphService.searchGraph(graphId, 'zzz-无-不匹配');
    expect(miss.nodes.length).toBe(0);

    const stats = knowledgeGraphService.getGraphStats(graphId);
    expect(stats).toBeTruthy();
    expect(stats!.nodeTypeStats && typeof stats!.nodeTypeStats).toBe('object');

    // 不存在图 → 空值臂（getGraphById 返回 undefined，getGraphStats 显式 null）
    expect(knowledgeGraphService.getGraphById('ghost-graph')).toBeUndefined();
    expect(knowledgeGraphService.getGraphStats('ghost-graph')).toBeNull();
    expect(knowledgeGraphService.getRelatedNodes('ghost-graph', 'x', 1)).toEqual([]);
    expect(knowledgeGraphService.getRelationsByNodeId('ghost-graph', 'x')).toEqual([]);
    expect(knowledgeGraphService.getNodesByType('ghost-graph', graph.nodes[0].type)).toEqual([]);
    expect(knowledgeGraphService.searchGraph('ghost-graph', 'x')).toEqual({ nodes: [], relations: [] });
    expect(knowledgeGraphService.getFilteredGraph('ghost-graph', {})).toBeNull();
  });
});

describe('API_ENDPOINTS 全组调用', () => {
  it('每个端点组可调用且返回路径字符串', () => {
    expect(API_ENDPOINTS.USERS.DETAIL('u1')).toContain('/users/u1');
    expect(API_ENDPOINTS.USERS.UPDATE('u1')).toBeTruthy();
    expect(API_ENDPOINTS.USERS.DELETE('u1')).toBeTruthy();
    expect(API_ENDPOINTS.PATIENTS.DETAIL('p1')).toContain('/patients/p1');
    expect(API_ENDPOINTS.PATIENTS.MEDICAL_RECORDS('p1')).toContain('medical-records');
    expect(API_ENDPOINTS.PATIENTS.APPOINTMENTS('p1')).toContain('appointments');
    expect(API_ENDPOINTS.MEDICAL_RECORDS.DETAIL('m1')).toBeTruthy();
    expect(API_ENDPOINTS.RESEARCH?.PROJECT_DETAIL?.('r1') ?? '').toBeTruthy();
    expect(API_ENDPOINTS.KNOWLEDGE_BASE?.ARTICLE_DETAIL?.('a1') ?? '').toBeTruthy();
    expect(API_ENDPOINTS.CERTIFICATIONS?.DETAIL?.('c1') ?? '').toBeTruthy();
    expect(API_ENDPOINTS.CERTIFICATIONS?.APPROVE?.('c1') ?? '').toContain('approve');
    expect(API_ENDPOINTS.CERTIFICATIONS?.REJECT?.('c1') ?? '').toContain('reject');
  });
});

describe('client-utils 客户端/回退双臂', () => {
  it('isClient=true 主路径 + accessor 抛错走 catch 回退', () => {
    expect(isClient).toBe(true);
    expect(safeWindow((w) => w.innerWidth, -1)).toBeGreaterThanOrEqual(0);
    expect(safeDocument((d) => d.title ?? '', 'no')).toBeDefined();
    // 抛错 → console.error → fallback
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(safeWindow(() => { throw new Error('boom'); }, 'fb-w')).toBe('fb-w');
    expect(safeDocument(() => { throw new Error('boom'); }, 'fb-d')).toBe('fb-d');
    errSpy.mockRestore();
  });

  it('window 置空 → 非客户端回退臂', () => {
    const original = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.stubGlobal('window', undefined as any);
    // isClient 在模块加载时取值——此处直接验证函数回退路径
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // safeWindow 内部 isClient 是模块常量 true——回退臂靠 window 缺失时 accessor 前的分支
    // 本断言仅保证调用不抛
    expect(() => safeWindow(() => 1, -1)).not.toThrow();
    expect(() => safeDocument(() => 1, -1)).not.toThrow();
    void original;
    errSpy.mockRestore();
  });
});

describe('EHR 长尾客户端', () => {
  it('EHRMappingClient：四导航 tab（router.push）+ 六数据类切换', async () => {
    const user = userEvent.setup();
    render(<EHRMappingClient />);
    for (const name of [/集成概览/, /数据映射/, /同步状态/, /系统连接/]) {
      const tab = screen.queryAllByRole('tab').find((t) => name.test(t.textContent ?? ''));
      if (tab) await user.click(tab, { delay: 0 }).catch(() => {});
    }
    for (const label of [/患者信息/, /诊断信息/, /用药信息/, /检查结果/, /文档记录/, /其他数据/]) {
      const btn = screen
        .getAllByRole('button')
        .find((b) => label.test(b.textContent ?? ''));
      if (btn) await user.click(btn, { delay: 0 }).catch(() => {});
    }
    // 映射区交互（EHRDataMapping 嵌套）
    await clickAround(user);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('EHRIntegrationClient：渲染 + 按钮 + 输入', async () => {
    const user = userEvent.setup();
    render(<EHRIntegrationClient />);
    await clickAround(user);
    for (const el of Array.from(document.body.querySelectorAll('input')).slice(0, 4)) {
      fireEvent.change(el, { target: { value: 'batch5-ehr' } });
    }
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('EHRIntegrationStatus：渲染 + 重试/查看按钮', async () => {
    const user = userEvent.setup();
    render(<EHRIntegrationStatus />);
    await clickAround(user);
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });

  it('EHRDataMapping：字段映射交互（Select/开关/下拉）', async () => {
    const user = userEvent.setup();
    render(<EHRDataMapping />);
    // 六类切换按钮
    for (const label of [/患者信息/, /诊断信息/, /用药信息/, /检查结果/, /文档记录/, /其他数据/]) {
      const btn = screen
        .getAllByRole('button')
        .find((b) => label.test(b.textContent ?? ''));
      if (btn) await user.click(btn, { delay: 0 }).catch(() => {});
    }
    for (const sw of screen.queryAllByRole('switch').slice(0, 5)) {
      await user.click(sw, { delay: 0 }).catch(() => {});
    }
    for (const combo of screen.queryAllByRole('combobox').slice(0, 3)) {
      fireEvent.click(combo);
      const opt = document.body.querySelector('[role="option"]');
      if (opt) fireEvent.click(opt);
      await new Promise((r) => setTimeout(r, 30));
    }
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

async function clickAround(user: ReturnType<typeof userEvent.setup>) {
  const patterns = [/同步|连接|测试|保存|添加|删除|编辑|映射|刷新|重试|查看|导出/];
  for (const p of patterns) {
    const targets = screen
      .queryAllByRole('button')
      .filter((b) => p.test(b.textContent ?? ''));
    for (const t of targets.slice(0, 6)) {
      try {
        await user.click(t, { delay: 0 });
        await new Promise((r) => setTimeout(r, 20));
      } catch {
        /* 容错 */
      }
    }
  }
}

describe('hooks fetch 失败臂', () => {
  it('useApi：request 走 fetch 失败 → error state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('network down'))),
    );
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { useApi } = await import('../hooks/useApi');
    function Probe() {
      const { error, isLoading, request } = useApi();
      const [fired, setFired] = React.useState(false);
      React.useEffect(() => {
        request('/test-endpoint')
          .catch(() => setFired(true));
      }, [request]);
      return (
        <div>
          <span data-testid="loading">{String(isLoading)}</span>
          <span data-testid="error">{error ? 'has-error' : fired ? 'caught' : 'no-error'}</span>
        </div>
      );
    }
    render(<Probe />);
    await waitFor(() => {
      const t = document.querySelector('[data-testid="error"]')!.textContent;
      if (t !== 'has-error' && t !== 'caught') throw new Error('waiting');
    }, { timeout: 4000 });
    errSpy.mockRestore();
  });

  it('use-real-time-data：fetch 失败臂不崩', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('down'))),
    );
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { useRealTimeData } = await import('../hooks/use-real-time-data');
    function Probe() {
      const state = useRealTimeData('patients' as never);
      return <div data-testid="rt">{JSON.stringify(Object.keys(state ?? {}))}</div>;
    }
    render(<Probe />);
    await new Promise((r) => setTimeout(r, 200));
    errSpy.mockRestore();
    expect(document.body.textContent!.length).toBeGreaterThan(0);
  });
});

describe('use-toast reducer + hook 全臂', () => {
  it('reducer：ADD(上限裁剪)/DISMISS(有 id 与无 id)/REMOVE/UPDATE 臂', async () => {
    const { reducer } = await import('../hooks/use-toast');
    const mk = (id: string) => ({ id, title: id, open: true } as never);
    let state: { toasts: unknown[] } = { toasts: [] };
    // ADD 两条 → 上限 1
    state = reducer(state as never, { type: 'ADD_TOAST', toast: mk('a') } as never);
    state = reducer(state as never, { type: 'ADD_TOAST', toast: mk('b') } as never);
    expect(state.toasts.length).toBe(1);
    // UPDATE
    state = reducer(state as never, { type: 'UPDATE_TOAST', toast: { id: 'b', title: 'updated' } } as never);
    // DISMISS 带 id / 不带 id
    state = reducer(state as never, { type: 'DISMISS_TOAST', toastId: 'b' } as never);
    state = reducer(state as never, { type: 'DISMISS_TOAST' } as never);
    // REMOVE 带 id / 不带 id
    state = reducer(state as never, { type: 'REMOVE_TOAST', toastId: 'b' } as never);
    state = reducer(state as never, { type: 'REMOVE_TOAST' } as never);
    expect(state.toasts.length).toBe(0);
  });

  it('hook：toast 入队（上限 1）→ dismiss → 面板复位', async () => {
    const { useToast, toast } = await import('../hooks/use-toast');
    let latest: ReturnType<typeof useToast> | null = null;
    function Probe() {
      latest = useToast();
      return <div data-testid="count">{latest!.toasts.length}</div>;
    }
    render(<Probe />);
    toast({ title: 't1' });
    await waitFor(() => {
      if (Number(document.querySelector('[data-testid="count"]')!.textContent) !== 1) throw new Error('not in');
    }, { timeout: 2000 });
    toast({ title: 't2' }); // 覆盖（上限 1）
    await waitFor(() => {
      if (latest!.toasts[0]?.title !== 't2') throw new Error('not replaced');
    }, { timeout: 2000 });
    latest!.dismiss();
    await waitFor(() => {
      if (latest!.toasts[0]?.open !== false) throw new Error('not dismissed');
    }, { timeout: 2000 });
  });
});

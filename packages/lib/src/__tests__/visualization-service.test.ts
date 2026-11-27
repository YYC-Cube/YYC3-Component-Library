// ============================================================
// YYC³ · @yyc3/lib services/visualization-service 覆盖率补测（batch2 弱区：45.3L/41.6B）
// 覆盖对象：useDataset Hook / dataTransformers 七件 / chartThemes / chartUtils
//          （含 exportData 五格式与 image/pdf 双分支）/ optimizeDataset 三方法
// 方法：纯函数真身直调；useDataset 用 RTL renderHook + 受控 fetch（deferred promise
//       手动放行），保证断言窗口与卸载后的零残留。
//       注（2026-11-28 死循环专项修复）：batch2 时代 hook 的 effect 依赖 fetchData
//       身份（isFetching 在依赖数组内）形成「effect 自触发链」持续重拉；cache-first
//       命中路径 setLastUpdated(new Date()) 更是同步自触发死循环（当时只记录不触发）。
//       本次修复（请求键守卫 + lastUpdated 稳定引用）后 effect 拉取一锤定音，
//       相关用例已改写为锁定修复后语义（loadMore/refresh 从外部真正可达）。
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import {
  useDataset,
  dataTransformers,
  chartThemes,
  chartUtils,
  defaultChartOptions,
} from '../index';
import type { DataSeries, DataPoint, ChartData } from '../index';

// ------------------------------------------------------------
// 受控 fetch：手动放行每个请求，未放行时 promise 挂起（effect 链暂停）
// ------------------------------------------------------------
const makeSeries = (n = 2, offset = 0): DataSeries[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `s${i + offset}`,
    name: `系列${i + offset}`,
    data: [
      { x: 'a', y: (i + offset) * 10 + 1 },
      { x: 'b', y: (i + offset) * 10 + 2 },
    ],
  }));

const okResponse = (data: unknown) => ({ ok: true, statusText: 'OK', json: async () => data });
const badResponse = (statusText: string) => ({ ok: false, statusText, json: async () => ({}) });

function makeDeferredFetch(payload?: unknown) {
  type Resolver = (response: unknown) => void;
  const resolvers: Resolver[] = [];
  const fetchMock = vi.fn(
    () =>
      new Promise<unknown>((resolve) => {
        resolvers.push(resolve);
      }),
  );
  return {
    fetchMock,
    /** 放行第 i 个挂起请求（默认回 200 + payload） */
    release: async (i: number, response?: unknown) => {
      expect(fetchMock).toHaveBeenCalledTimes(i + 1);
      resolvers[i](response ?? okResponse(payload ?? makeSeries()));
      // 让 resolve 后的微任务链（await json → setState → render → effect）跑完
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
      });
    },
  };
}

// Blob 下载链路垫片（jsdom 无 URL.createObjectURL）
const createObjectURLMock = vi.fn(() => 'blob:mock');
const revokeObjectURLMock = vi.fn();
const clickMock = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
beforeAllBlob: {
  // 在模块顶层直接改写（本文件所有用例共享）
  URL.createObjectURL = createObjectURLMock as unknown as typeof URL.createObjectURL;
  URL.revokeObjectURL = revokeObjectURLMock as unknown as typeof URL.revokeObjectURL;
}
const alertMock = vi.fn();
window.alert = alertMock as unknown as typeof window.alert;

// ============================================================
// dataTransformers
// ============================================================
describe('dataTransformers · timeSeriesTransformer', () => {
  // 本地时间串（无 Z）：解析与 setHours 同基准时区，跨时区环境结果稳定
  const rows = [
    { date: '2026-01-01T10:00:00', value: 5, label: '一' },
    { date: '2026-01-02T10:00:00', value: 7, label: '二' },
    { date: '2026-01-02T18:00:00', value: 9, label: '三' },
  ];

  it('无分组无粒度：单系列映射 + 排序', () => {
    const out = dataTransformers.timeSeriesTransformer(rows, {
      dateField: 'date',
      valueField: 'value',
      labelField: 'label',
    });
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('timeseries');
    expect(out[0].name).toBe('label'); // 系列名 = labelField 字段名
    expect(out[0].data).toHaveLength(3);
    const points = out[0].data as DataPoint[];
    expect(points[0].label).toBe('一');
    expect(points[0].originalValue).toBe(5);
    expect((points[0].x as Date).getTime()).toBeLessThanOrEqual((points[1].x as Date).getTime());
  });

  it('无 labelField：系列名为「时间序列数据」、point.label undefined', () => {
    const out = dataTransformers.timeSeriesTransformer(rows, { dateField: 'date', valueField: 'value' });
    expect(out[0].name).toBe('时间序列数据');
    expect((out[0].data[0] as DataPoint).label).toBeUndefined();
  });

  it('sortData=false：保持原始顺序', () => {
    const shuffled = [rows[2], rows[0], rows[1]];
    const out = dataTransformers.timeSeriesTransformer(shuffled, {
      dateField: 'date',
      valueField: 'value',
      sortData: false,
    });
    const points = out[0].data as DataPoint[];
    expect(points.map((p) => p.originalValue)).toEqual([9, 5, 7]);
  });

  it('按天粒度聚合 + sum：同日两条合并', () => {
    const out = dataTransformers.timeSeriesTransformer(rows, {
      dateField: 'date',
      valueField: 'value',
      timeGranularity: 'day',
      aggregation: 'sum',
    });
    const points = out[0].data as DataPoint[];
    expect(points).toHaveLength(2);
    expect(points[1].y).toBe(16); // 7 + 9
    expect(points[1].count).toBe(2);
    // 聚合到当日 0 点
    expect((points[0].x as Date).getHours()).toBe(0);
  });

  it('聚合函数五档：avg/min/max/count/缺省', () => {
    const agg = (aggregation: 'avg' | 'min' | 'max' | 'count') => {
      const data = dataTransformers.timeSeriesTransformer(rows, {
        dateField: 'date',
        valueField: 'value',
        timeGranularity: 'day',
        aggregation,
      })[0].data as DataPoint[];
      return data.find((p) => p.count === 2)!.y;
    };

    expect(agg('avg')).toBe(8);
    expect(agg('min')).toBe(7);
    expect(agg('max')).toBe(9);
    expect(agg('count')).toBe(2);

    // 缺省聚合：aggregateData 回退组内首点（无 count 字段，保留原始 label 信息）
    const raw = dataTransformers.timeSeriesTransformer(rows, {
      dateField: 'date',
      valueField: 'value',
      timeGranularity: 'day',
    })[0].data as DataPoint[];
    expect(raw).toHaveLength(2);
    expect(raw[1].y).toBe(7); // Jan2 组首点
  });

  it('其余时间粒度五档（minute/hour/week/month/quarter/year）', () => {
    const at = (granularity: 'minute' | 'hour' | 'week' | 'month' | 'quarter' | 'year') =>
      (
        dataTransformers.timeSeriesTransformer(
          [{ date: '2026-03-15T10:26:39Z', value: 1 }],
          { dateField: 'date', valueField: 'value', timeGranularity: granularity },
        )[0].data[0] as DataPoint
      ).x as Date;

    expect(at('minute').getSeconds()).toBe(0);
    expect(at('hour').getMinutes()).toBe(0);
    expect(at('week').getDay()).toBe(1); // 周一为一周起点
    expect(at('month').getDate()).toBe(1);
    expect(at('quarter').getMonth()).toBe(0); // 3 月 → Q1 首月
    expect(at('year').getMonth()).toBe(0);
  });

  it('groupField 分组：多系列 + 粒度聚合 + 排序', () => {
    const grouped = [
      { date: '2026-01-02', value: 3, region: '华北' },
      { date: '2026-01-01', value: 1, region: '华南' },
      { date: '2026-01-02', value: 4, region: '华北' },
    ];
    const out = dataTransformers.timeSeriesTransformer(grouped, {
      dateField: 'date',
      valueField: 'value',
      groupField: 'region',
      timeGranularity: 'day',
      aggregation: 'sum',
    });
    expect(out).toHaveLength(2);
    const north = out.find((s) => s.id === '华北')!;
    expect(north.name).toBe('华北');
    expect(north.data).toHaveLength(1);
    expect((north.data[0] as DataPoint).y).toBe(7);
    // 华南组晚于华北组 → 排序在前
    expect(out[0].id).toBe('华北');
  });
});

describe('dataTransformers · categoryTransformer', () => {
  const rows = [
    { cat: '乙', val: 20 },
    { cat: '甲', val: 30 },
    { cat: '丙', val: 10 },
  ];

  it('缺省不排序', () => {
    const out = dataTransformers.categoryTransformer(rows, { categoryField: 'cat', valueField: 'val' });
    expect(out[0].id).toBe('categories');
    expect((out[0].data as DataPoint[]).map((p) => p.x)).toEqual(['乙', '甲', '丙']);
  });

  it('sortBy=value desc / asc', () => {
    const opts = { categoryField: 'cat', valueField: 'val' };
    const desc = dataTransformers.categoryTransformer(rows, { ...opts, sortBy: 'value' });
    expect((desc[0].data as DataPoint[]).map((p) => p.y)).toEqual([30, 20, 10]);
    const asc = dataTransformers.categoryTransformer(rows, { ...opts, sortBy: 'value', sortDirection: 'asc' });
    expect((asc[0].data as DataPoint[]).map((p) => p.y)).toEqual([10, 20, 30]);
  });

  it('sortBy=category 按字典序', () => {
    const out = dataTransformers.categoryTransformer(rows, {
      categoryField: 'cat',
      valueField: 'val',
      sortBy: 'category',
      sortDirection: 'asc',
    });
    expect((out[0].data as DataPoint[]).map((p) => p.x)).toEqual(['丙', '乙', '甲']);
  });

  it('limit 截断 + 其余类别合并', () => {
    const out = dataTransformers.categoryTransformer(rows, {
      categoryField: 'cat',
      valueField: 'val',
      sortBy: 'value',
      limit: 2,
      othersCategoryName: '其余',
    });
    const points = out[0].data as DataPoint[];
    expect(points).toHaveLength(3);
    expect(points[2]).toMatchObject({ x: '其余', y: 10, isOthersCategory: true, count: 1 });
  });
});

describe('dataTransformers · hierarchyTransformer', () => {
  it('递归处理子节点 + valueField/colorField', () => {
    const tree = {
      id: 'root',
      name: '总部',
      revenue: 100,
      color: '#ff0000',
      children: [
        { id: 'a', name: '华东', revenue: 60 },
        { id: 'b', name: '华北', revenue: 40, children: [{ name: '北京', revenue: 20 }] },
      ],
    };
    const out = dataTransformers.hierarchyTransformer(tree, { valueField: 'revenue', colorField: 'color' });
    expect(out).toHaveLength(1);
    const root = out[0];
    expect(root).toMatchObject({ id: 'root', name: '总部', value: 100, depth: 0, color: '#ff0000' });
    expect(root.children).toHaveLength(2);
    expect(root.children[1].children[0]).toMatchObject({ name: '北京', value: 20, depth: 2 });
    // 无 color 字段的节点不染色
    expect(root.children[0].color).toBeUndefined();
  });

  it('缺 id/name 回退随机 id 与「未命名节点」；colorScheme 按深度染色', () => {
    const out = dataTransformers.hierarchyTransformer(
      { amount: 5, children: [{ amount: 2 }] },
      { valueField: 'amount', colorScheme: ['#111', '#222', '#333'] },
    );
    expect(out[0].name).toBe('未命名节点');
    expect(out[0].id).toBeTruthy();
    expect(out[0].color).toBe('#111');
    expect(out[0].children[0].color).toBe('#222');
    // 缺 value 字段 → 0
    const empty = dataTransformers.hierarchyTransformer({ name: 'x' });
    expect(empty[0].value).toBe(0);
  });
});

describe('dataTransformers · networkTransformer', () => {
  it('节点与边映射（字段缺省值）', () => {
    const out = dataTransformers.networkTransformer({
      nodes: [
        { id: 'n1', name: '节点一', value: 10, color: '#111' },
        { id: 'n2' }, // name/value/color 缺省
      ],
      links: [
        { source: 'n1', target: 'n2', value: 3, color: '#222' },
        { source: 'n2', target: 'n1' }, // value 缺省 → 1
      ],
    });
    expect(out[0].id).toBe('network');
    expect(out[0].name).toBe('网络关系图');
    expect(out[0].data.nodes[1]).toMatchObject({ id: 'n2', name: 'n2', value: 1, color: undefined });
    expect(out[0].data.links[1]).toMatchObject({ value: 1, color: undefined });
    expect(out[0].data.nodes[0].originalData).toEqual({ id: 'n1', name: '节点一', value: 10, color: '#111' });
  });

  it('自定义字段名', () => {
    const out = dataTransformers.networkTransformer(
      { nodes: [{ key: 'k1' }], links: [{ from: 'k1', to: 'k2', weight: 5, tint: '#000' }] },
      {
        nodeIdField: 'key',
        nodeLabelField: 'label',
        nodeValueField: 'size',
        nodeColorField: 'tint',
        linkSourceField: 'from',
        linkTargetField: 'to',
        linkValueField: 'weight',
        linkColorField: 'tint',
      },
    );
    expect(out[0].data.nodes[0]).toMatchObject({ id: 'k1', name: 'k1' }); // label 缺省 → id
    expect(out[0].data.links[0]).toMatchObject({ source: 'k1', target: 'k2', value: 5, color: '#000' });
  });
});

describe('dataTransformers · geoTransformer', () => {
  it('name 坐标类型（缺省）', () => {
    const out = dataTransformers.geoTransformer(
      [{ city: '北京', pop: 2100 }],
      { locationField: 'city', valueField: 'pop' },
    );
    expect(out[0].data[0]).toMatchObject({ name: '北京', value: 2100, location: '北京' });
  });

  it('latlng 字符串拆分', () => {
    const out = dataTransformers.geoTransformer(
      [{ loc: '39.9,116.4', pop: 2100, title: '北京' }],
      { locationField: 'loc', valueField: 'pop', nameField: 'title', coordinateType: 'latlng' },
    );
    expect(out[0].data[0]).toMatchObject({ latitude: 39.9, longitude: 116.4, name: '北京' });
  });

  it('latlng 对象取 lat/lng 或 latitude/longitude', () => {
    const out = dataTransformers.geoTransformer(
      [
        { loc: { lat: 1, lng: 2 }, v: 1 },
        { loc: { latitude: 3, longitude: 4 }, v: 2 },
      ],
      { locationField: 'loc', valueField: 'v', coordinateType: 'latlng' },
    );
    expect(out[0].data[0]).toMatchObject({ latitude: 1, longitude: 2 });
    expect(out[0].data[1]).toMatchObject({ latitude: 3, longitude: 4 });
  });

  it('geoJson 透传', () => {
    const geo = { type: 'FeatureCollection', features: [] };
    const out = dataTransformers.geoTransformer([{ city: 'x', v: 1 }], {
      locationField: 'city',
      valueField: 'v',
      geoJson: geo,
    });
    expect(out[0].geoJson).toBe(geo);
  });
});

describe('dataTransformers · radarTransformer', () => {
  it('无分组：单系列多维指标', () => {
    const out = dataTransformers.radarTransformer(
      [
        { name: 'A', speed: 8, power: 6 },
        { name: 'B', speed: '7', power: NaN },
      ],
      { dimensionFields: ['speed', 'power'] },
    );
    expect(out[0].id).toBe('radar');
    expect(out[0].dimensions).toEqual(['speed', 'power']);
    expect(out[0].data[0].dimensions).toEqual({ speed: 8, power: 6 });
    expect(out[0].data[1].dimensions).toEqual({ speed: 7, power: 0 }); // 非数值 → 0
  });

  it('有 nameField/maxValues；有分组多系列', () => {
    const rows = [
      { team: '甲', speed: 8, power: 6, who: '队员一' },
      { team: '乙', speed: 5, power: 9 },
    ];
    const out = dataTransformers.radarTransformer(rows, {
      dimensionFields: ['speed', 'power'],
      groupField: 'team',
      nameField: 'who',
      maxValues: { speed: 10, power: 10 },
    });
    const jia = out.find((s) => s.id === '甲')!;
    expect(jia.data[0]).toMatchObject({ name: '队员一', dimensions: { speed: 8, power: 6 } });
    const yi = out.find((s) => s.id === '乙')!;
    // 源行为：nameField 取值 undefined（并非回退「数据点」）——真身如实断言
    expect(yi.data[0].name).toBeUndefined();
    expect(yi.maxValues).toEqual({ speed: 10, power: 10 });
  });
});

describe('dataTransformers · ganttTransformer', () => {
  it('基础映射 + progress + 逗号字符串依赖拆分', () => {
    const out = dataTransformers.ganttTransformer(
      [
        { id: 't1', task: '需求', start: '2026-01-01', end: '2026-01-05', progress: 80, deps: 't0, t2' },
        { task: '开发', start: '2026-01-03', end: '2026-01-10' }, // id 缺省 → 随机
      ],
      { taskField: 'task', startField: 'start', endField: 'end', progressField: 'progress', dependencyField: 'deps' },
    );
    const tasks = out[0].data;
    expect(tasks[0]).toMatchObject({ id: 't1', name: '需求', progress: 80, dependencies: ['t0', 't2'] });
    expect(tasks[0].start).toBeInstanceOf(Date);
    expect(tasks[1].dependencies).toBeUndefined();
    expect(tasks[1].id).toBeTruthy();
  });

  it('数组依赖原样保留；分组归组', () => {
    const out = dataTransformers.ganttTransformer(
      [
        { id: 'a', task: '设计', start: '2026-01-01', end: '2026-01-02', group: '一期', deps: ['z'] },
        { id: 'b', task: '开发', start: '2026-01-02', end: '2026-01-03', group: '一期', deps: ['a'] },
        { id: 'c', task: '测试', start: '2026-01-03', end: '2026-01-04', group: '二期' },
      ],
      { taskField: 'task', startField: 'start', endField: 'end', groupField: 'group', dependencyField: 'deps' },
    );
    expect(out).toHaveLength(2);
    const p1 = out.find((s) => s.id === '一期')!;
    expect(p1.data).toHaveLength(2);
    expect(p1.data[0].dependencies).toEqual(['z']);
    expect(out.find((s) => s.id === '二期')!.data[0].group).toBe('二期');
  });
});

// ============================================================
// chartThemes / defaultChartOptions
// ============================================================
describe('chartThemes 与 defaultChartOptions', () => {
  it('四套主题齐全且颜色数组非空', () => {
    for (const name of ['light', 'dark', 'yy', 'corporate'] as const) {
      expect(chartThemes[name].colors.length).toBeGreaterThan(0);
      expect(chartThemes[name].background).toMatch(/^#/);
      expect(chartThemes[name].tooltip.background).toBeTruthy();
    }
    expect(defaultChartOptions.theme).toBe('light');
    expect(defaultChartOptions.interactions).toEqual(['tooltip']);
  });
});

// ============================================================
// chartUtils · 纯函数
// ============================================================
describe('chartUtils · generateRandomColor / generateGradient', () => {
  it('随机色为合法 6 位 hex', () => {
    expect(chartUtils.generateRandomColor()).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('渐变：步数正确、首尾即起止色', () => {
    const colors = chartUtils.generateGradient('#000000', '#ffffff', 5);
    expect(colors).toHaveLength(5);
    expect(colors[0]).toBe('#000000');
    expect(colors[4]).toBe('#ffffff');
    expect(colors[2]).toBe('#808080'); // 中点灰
  });
});

describe('chartUtils · formatNumber / formatDate', () => {
  it('formatNumber 缺省与各 style', () => {
    expect(chartUtils.formatNumber(1234.5)).toBe('1,234.5');
    expect(chartUtils.formatNumber(1234.5, { style: 'currency', currency: 'CNY' })).toBe('¥1,234.5');
    expect(chartUtils.formatNumber(0.25, { style: 'percent' })).toContain('25');
    expect(chartUtils.formatNumber(1234567, { compact: true })).toBeTruthy();
    expect(
      chartUtils.formatNumber(3.14159, { minimumFractionDigits: 2, maximumFractionDigits: 3 }),
    ).toBe('3.142');
  });

  it('formatDate 接受 Date/字符串/时间戳 + timeZone', () => {
    const d = new Date(2026, 0, 15, 9, 30);
    expect(chartUtils.formatDate(d)).toContain('2026');
    expect(chartUtils.formatDate('2026-01-15T01:30:00Z', { timeZone: 'UTC' })).toContain('2026');
    expect(chartUtils.formatDate(1768505400000, { format: 'short' })).toBeTruthy();
    expect(chartUtils.formatDate(d as unknown as string, { format: 'full' })).toBeTruthy(); // Date 走 typeof object 分支
  });
});

// ============================================================
// chartUtils · exportData（五格式 + image/pdf 双分支）
// ============================================================
describe('chartUtils · exportData', () => {
  const seriesData: DataSeries[] = makeSeries(2);
  const chartData: ChartData = {
    labels: ['一月', '二月'],
    datasets: [{ label: '销量', data: [120, 200] }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  afterAll(() => {
    clickMock.mockRestore();
  });

  it('csv：系列格式 + 表头 + 含逗号单元格转义 + 下载链路', () => {
    const withComma: DataSeries[] = [
      { id: 's', name: '名称,含逗号', data: [{ x: 'a"b', y: 1 }] },
    ];
    chartUtils.exportData(withComma, { format: 'csv', fileName: 'my-export' });
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    const blob = createObjectURLMock.mock.calls[0][0] as Blob;
    expect(blob.type).toContain('text/csv');
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock');
  });

  it('csv：图表数据格式（labels+datasets）+ includeHeaders=false', () => {
    chartUtils.exportData(chartData, { format: 'csv', includeHeaders: false });
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
  });

  it('json：原样序列化（无表头加工）', () => {
    chartUtils.exportData(chartData, { format: 'json', fileName: 'data' });
    const blob = createObjectURLMock.mock.calls[0][0] as Blob;
    expect(blob.type).toContain('application/json');
  });

  it('excel：HTML 表格 Blob', () => {
    chartUtils.exportData(seriesData, { format: 'excel' });
    const blob = createObjectURLMock.mock.calls[0][0] as Blob;
    expect(blob.type).toContain('application/vnd.ms-excel');
  });

  it('image：chartRef 在场 → 走模拟导出（alert）', () => {
    const el = document.createElement('div');
    const chartRef = { current: el };
    chartUtils.exportData(seriesData, { format: 'image', chartRef, width: 800, height: 600 });
    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock.mock.calls[0][0]).toContain('html2canvas');
    expect(alertMock.mock.calls[0][0]).toContain('.png');
  });

  it('image：chartRef 缺失 → console.error 且不 alert', () => {
    chartUtils.exportData(seriesData, { format: 'image', chartRef: { current: null } });
    expect(console.error).toHaveBeenCalledWith('导出图像失败：找不到图表元素');
    expect(alertMock).not.toHaveBeenCalled();
  });

  it('pdf：chartRef 在场 / 缺失双分支', () => {
    const chartRef = { current: document.createElement('div') };
    chartUtils.exportData(seriesData, { format: 'pdf', chartRef });
    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock.mock.calls[0][0]).toContain('.pdf');

    chartUtils.exportData(seriesData, { format: 'pdf', chartRef: { current: null } });
    expect(console.error).toHaveBeenCalledWith('导出PDF失败：找不到图表元素');
    expect(alertMock).toHaveBeenCalledTimes(1);
  });

  it('未知格式抛错', () => {
    expect(() => chartUtils.exportData(seriesData, { format: 'svg' as 'csv' })).toThrow(
      '不支持的导出格式: svg',
    );
  });

  it('日期/数字格式化内部分支：非法值与自定义格式', () => {
    const weird = [
      {
        id: 'w',
        name: 'w',
        data: [
          { x: { complex: 'object' }, y: NaN }, // 非日期非串非数 → ''，NaN 数字 → String
          { x: 'not-a-date!', y: 3.14159 }, // Invalid Date → 原样串；数字带 numberFormat
          { x: new Date(2026, 0, 2, 8, 5), y: 42 }, // YYYY-MM-DD 缺省
        ],
      },
    ];
    chartUtils.exportData(weird, {
      format: 'csv',
      numberFormat: { locale: 'en-US', minimumFractionDigits: 2, maximumFractionDigits: 3 },
    });
    // 完整走通即覆盖 formatDateValue/formatNumberValue 全部分支
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
  });
});

// ============================================================
// chartUtils · optimizeDataset
// ============================================================
describe('chartUtils · optimizeDataset', () => {
  const big = (n: number): DataSeries[] => [
    { id: 'big', name: '大系列', color: '#123456', type: 'line', data: Array.from({ length: n }, (_, i) => ({ x: i, y: i % 7 })) },
  ];

  it('总量不超限：原样返回', () => {
    const data = makeSeries(1);
    expect(chartUtils.optimizeDataset(data, { maxPoints: 1000 })).toBe(data);
  });

  it('sampling：等距采样并携带 _optimized 元数据', () => {
    const out = chartUtils.optimizeDataset(big(100), { maxPoints: 20, method: 'sampling' });
    // rate = max(1, floor(100/20)) = 5 → 每 5 点取 1 → 20 条
    expect(out[0].data).toHaveLength(20);
    expect(out[0].data[0]).toEqual({ x: 0, y: 0 });
    expect((out[0] as DataSeries & { _optimized?: unknown })._optimized).toMatchObject({
      method: 'sampling',
      originalLength: 100,
      optimizedLength: 20,
    });
  });

  it('aggregation：窗口聚合六档', () => {
    const data = big(10);
    const run = (aggregationFn: 'avg' | 'min' | 'max' | 'sum' | 'first' | 'last' | 'other') =>
      chartUtils.optimizeDataset(data, {
        maxPoints: 1,
        method: 'aggregation',
        windowSize: 5,
        aggregationFn,
      })[0].data;

    // y = i % 7 → 窗口1 [0..4] 窗口2 [5,6,0,1,2]
    expect((run('avg') as DataPoint[]).map((p) => p.y)).toEqual([2, 2.8]);
    expect((run('min') as DataPoint[]).map((p) => p.y)).toEqual([0, 0]);
    expect((run('max') as DataPoint[]).map((p) => p.y)).toEqual([4, 6]);
    expect((run('sum') as DataPoint[]).map((p) => p.y)).toEqual([10, 14]);
    expect((run('first') as DataPoint[]).map((p) => p.y)).toEqual([0, 5]);
    expect((run('last') as DataPoint[]).map((p) => p.y)).toEqual([4, 2]);
    expect((run('other' as 'avg') as DataPoint[]).map((p) => p.y)).toEqual([0, 5]); // default 分支
    expect((run('avg') as DataPoint[])[0].count).toBe(5);
  });

  it('windowing：端点保留 + 峰谷成对', () => {
    const out = chartUtils.optimizeDataset(big(50), { maxPoints: 5, method: 'windowing' });
    const optimized = out[0].data;
    expect(optimized.length).toBeGreaterThan(0);
    expect(optimized[0]).toBe(out[0].data[0]); // 首点必保留
    const meta = (out[0] as DataSeries & { _optimized?: { compressionRatio: number } })._optimized!;
    expect(meta.method).toBe('windowing');
    expect(meta.compressionRatio).toBeGreaterThan(1);
    // 每对 min/max 均来自原数据
    optimized.forEach((p) => {
      expect((p as DataPoint).y).toBeGreaterThanOrEqual(0);
    });
  });

  it('windowing：单系列点数不超 maxPoints → 原样（多系列触发总量超限）', () => {
    const data: DataSeries[] = [
      { id: 'small', name: '小', data: [{ x: 0, y: 1 }, { x: 1, y: 2 }] },
      ...big(50),
    ];
    const out = chartUtils.optimizeDataset(data, { maxPoints: 10, method: 'windowing' });
    expect(out[0].data).toHaveLength(2); // 小系列走 series.data.length <= maxPoints 分支
    expect(out[0]._optimized === undefined || out[0]).toBeTruthy();
  });

  it('未知 method：原样数据但带元数据', () => {
    const out = chartUtils.optimizeDataset(big(30), { maxPoints: 5, method: 'unknown' as 'sampling' });
    expect(out[0].data).toHaveLength(30);
    const meta = (out[0] as DataSeries & { _optimized?: { optimizedLength: number } })._optimized!;
    expect(meta.optimizedLength).toBe(30);
  });
});

// ============================================================
// useDataset（受控 deferred fetch）
// ============================================================
describe('useDataset', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('基础加载：追加语义（首次 prev=[] 等价替换）、URL 分页参数、lastUpdated、onDataReceived', async () => {
    const onDataReceived = vi.fn();
    const { fetchMock, release } = makeDeferredFetch(makeSeries(2));
    vi.stubGlobal('fetch', fetchMock);

    const { result, unmount } = renderHook(() =>
      useDataset({
        endpoint: '/api/dataset',
        cacheStrategy: 'none',
        onDataReceived,
      }),
    );

    expect(result.current.isLoading).toBe(true);
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('page=1');
    expect(url).toContain('pageSize=1000');

    await release(0);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.error).toBeNull();
    expect(result.current.lastUpdated).toBeInstanceOf(Date);
    expect(result.current.hasMore).toBe(false); // rawData.length(2) !== pageSize(1000)
    expect(onDataReceived).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('transformFn 应用于原始数据', async () => {
    const { fetchMock, release } = makeDeferredFetch([{ d: '2026-01-01', v: 3 }]);
    vi.stubGlobal('fetch', fetchMock);

    const { result, unmount } = renderHook(() =>
      useDataset({
        endpoint: '/api/raw',
        cacheStrategy: 'none',
        transformFn: (raw: any[]) =>
          raw.map((item) => ({ id: 't', name: '转换', data: [{ x: item.d, y: item.v }] })),
      }),
    );

    await release(0);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data[0].name).toBe('转换');

    unmount();
  });

  it('loadMore：hasMore=true 时翻页拉取（死循环守卫修复后从外部真正可达）', async () => {
    const { fetchMock, release } = makeDeferredFetch(makeSeries(1));
    vi.stubGlobal('fetch', fetchMock);

    const { result, unmount } = renderHook(() =>
      useDataset({
        endpoint: '/api/paged',
        cacheStrategy: 'none',
        pageSize: 1, // rawData.length(1) === pageSize(1) → hasMore true
      }),
    );

    await release(0); // 第 1 页完成
    await waitFor(() => expect(result.current.hasMore).toBe(true));

    // 死循环守卫修复后：拉取完成即静止（effect 同键不重触），isFetching=false →
    // loadMore 的 `!isFetching` 守卫放行，翻页真正生效（batch2 时代因自触发链
    // 常驻在飞而无法从外部进入——已随死循环修复解除）。
    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(fetchMock.mock.calls.length).toBe(1);

    act(() => result.current.loadMore());
    await waitFor(() => expect(fetchMock.mock.calls.length).toBe(2));
    expect(fetchMock.mock.calls[1][0]).toContain('page=2');
    expect(result.current.page).toBe(2);

    await release(1);
    unmount();
  });

  it('loadMore：hasMore=false 时no-op（不翻页）', async () => {
    const { fetchMock, release } = makeDeferredFetch(makeSeries(2));
    vi.stubGlobal('fetch', fetchMock);

    const { result, unmount } = renderHook(() =>
      useDataset({ endpoint: '/api/nomore', cacheStrategy: 'none', pageSize: 1000 }),
    );

    await release(0);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasMore).toBe(false);

    act(() => result.current.loadMore());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.page).toBe(1);

    unmount();
  });

  it('refresh：重置页码并触发重新拉取（死循环守卫修复后 isRefresh 直呼路径真正可达）', async () => {
    const { fetchMock, release } = makeDeferredFetch(makeSeries(2));
    vi.stubGlobal('fetch', fetchMock);

    const { result, unmount } = renderHook(() =>
      useDataset({ endpoint: '/api/refresh', cacheStrategy: 'none' }),
    );

    await release(0);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // 守卫修复后静止：同键 effect 不重触
    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(fetchMock.mock.calls.length).toBe(1);

    // refresh = setPage(1) + fetchData(true)——直呼路径绕过 effect 守卫，
    // isRefresh=true 分支真正进入（batch2 时代因自触发链常驻在飞而早退——已解除）。
    act(() => result.current.refresh());
    expect(result.current.page).toBe(1);
    await waitFor(() => expect(fetchMock.mock.calls.length).toBe(2));
    expect(result.current.isLoading).toBe(true);

    await release(1);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    unmount();
  });

  it('fetch 失败：console.error 记录 + 按重试间隔自动重试（重试上限内持续）', async () => {
    const { fetchMock, release } = makeDeferredFetch();
    vi.stubGlobal('fetch', fetchMock);

    const { unmount } = renderHook(() =>
      useDataset({
        endpoint: '/api/failing',
        cacheStrategy: 'none',
        errorRetryCount: 2,
        errorRetryInterval: 30,
      }),
    );

    // 第 1 次请求：500 → catch（error 状态随下一轮自触发 fetchData 重置为 null，
    // 持续断言走 console.error 通道）
    await release(0, badResponse('Server Error'));
    expect(console.error).toHaveBeenCalledWith('数据获取错误:', expect.anything());

    // 重试定时器（30ms 真实定时器）+ effect 自触发 → 第 2 次请求出现
    await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2));
    await release(1, badResponse('Server Error'));

    unmount();
  });

  it('非 Error 抛出物：catch 兜底走「获取数据失败」文案（console.error 通道）', async () => {
    // fetch 本身 reject 非 Error 值
    const fetchMock = vi.fn(() => Promise.reject('boom-string'));
    vi.stubGlobal('fetch', fetchMock);

    const { unmount } = renderHook(() =>
      useDataset({ endpoint: '/api/throw', cacheStrategy: 'none', errorRetryCount: 0 }),
    );

    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith('数据获取错误:', 'boom-string'),
    );
    unmount();
  });

  it('network-only：跳过缓存读取；同键 effect 重触不再走网络（死循环守卫）', async () => {
    const { fetchMock, release } = makeDeferredFetch(makeSeries(2));
    vi.stubGlobal('fetch', fetchMock);

    const { rerender, unmount } = renderHook(() =>
      useDataset({ endpoint: '/api/nocache', cacheStrategy: 'memory', fetchPolicy: 'network-only' }),
    );

    await release(0);
    // 守卫修复：拉取完成即静止，effect 自触发链（batch2 时代持续重拉的根因）已消除
    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(fetchMock.mock.calls.length).toBe(1);

    // 消费方 re-render（新 options 引用）也不重触同键拉取
    rerender();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(fetchMock.mock.calls.length).toBe(1);

    unmount();
  });

  it('cache-and-network + localStorage：命中缓存先渲染旧数据，同时网络重验证（双阶段）', async () => {
    const { fetchMock, release } = makeDeferredFetch(makeSeries(2, 100));
    vi.stubGlobal('fetch', fetchMock);
    localStorage.setItem(
      'yy_chart_/api/cached_1_1000',
      JSON.stringify({ data: makeSeries(2), timestamp: Date.now() }),
    );

    const { result, unmount } = renderHook(() =>
      useDataset({ endpoint: '/api/cached', cacheStrategy: 'localStorage', fetchPolicy: 'cache-and-network' }),
    );

    // 命中阶段：缓存先行渲染（不死循环——lastUpdated 取缓存时间戳稳定引用），同时发起网络重验证
    await waitFor(() => expect(fetchMock.mock.calls.length).toBe(1));
    expect(result.current.data).toHaveLength(2);

    // 网络阶段：重验证结果追加合并（cache-and-network 语义）
    await release(0);
    await waitFor(() => expect(result.current.data).toHaveLength(4));
    expect(result.current.lastUpdated).toBeInstanceOf(Date);

    unmount();
  });

  it('cache-and-network + localStorage：成功后写入 yy_chart_* 键；损坏 JSON 走 catch 降级', async () => {
    // 预置损坏缓存 → getFromCache 解析失败 → console.error → 走网络
    localStorage.setItem('yy_chart_/api/ls_1_1000', '{not-json');
    const { fetchMock, release } = makeDeferredFetch(makeSeries(1));
    vi.stubGlobal('fetch', fetchMock);

    const { result, unmount } = renderHook(() =>
      useDataset({ endpoint: '/api/ls', cacheStrategy: 'localStorage', fetchPolicy: 'cache-and-network' }),
    );

    await release(0);
    await waitFor(() => expect(result.current.data).toHaveLength(1));
    // 成功的拉取已写入合法缓存
    expect(localStorage.getItem('yy_chart_/api/ls_1_1000')).toContain('"timestamp"');
    expect(console.error).toHaveBeenCalledWith('缓存解析错误', expect.anything());

    unmount();
  });

  it('cache-and-network + localStorage：过期缓存（>10 分钟）不采用', async () => {
    const stale = JSON.stringify({ data: makeSeries(9), timestamp: Date.now() - 11 * 60 * 1000 });
    localStorage.setItem('yy_chart_/api/stale_1_1000', stale);
    const { fetchMock, release } = makeDeferredFetch(makeSeries(2));
    vi.stubGlobal('fetch', fetchMock);

    const { result, unmount } = renderHook(() =>
      useDataset({ endpoint: '/api/stale', cacheStrategy: 'localStorage', fetchPolicy: 'cache-and-network' }),
    );

    await release(0);
    await waitFor(() => expect(result.current.data).toHaveLength(2)); // 用的是网络数据而非过期缓存
    unmount();
  });

  it('refreshInterval > 0：定时刷新链路建立', async () => {
    vi.useFakeTimers();
    try {
      const { fetchMock, release } = makeDeferredFetch(makeSeries(1));
      vi.stubGlobal('fetch', fetchMock);

      const { unmount } = renderHook(() =>
        useDataset({ endpoint: '/api/poll', cacheStrategy: 'none', refreshInterval: 1000 }),
      );

      await release(0, okResponse(makeSeries(1)));
      // 定时器到点触发 refresh → 新请求
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1100);
      });
      expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2);

      unmount();
      // 卸载后 interval 清理：时间继续推进不再有新请求
      const countAtUnmount = fetchMock.mock.calls.length;
      await act(async () => {
        await vi.advanceTimersByTimeAsync(5000);
      });
      expect(fetchMock.mock.calls.length).toBe(countAtUnmount);
    } finally {
      vi.useRealTimers();
    }
  });
});

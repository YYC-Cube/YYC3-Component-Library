// ============================================================
// YYC³ · lib services 真身批次 · 纯逻辑面测试（services-real.test.ts）
// 覆盖对象：nlp-processor / voice-command-engine / visualization-service（纯函数部分）
//           / chart-voice-control / ollama-service / mobile-service
// 约定：import 一律走 '../index' 桶（顺带验证桶导出连通性）；
//       ollama 用 vi.stubGlobal('fetch', ...) 模拟网络，其余纯逻辑直接调真身不打桩。
// 浏览器 API 面未覆盖（债）：
// - speechSynthesis / SpeechRecognition 真实调用链（jsdom 无此 API，仅覆盖降级分支）
// - useDataset 的 fetch 拉取与缓存路径、chartUtils.exportData 的 image/pdf 分支（依赖 html2canvas/jsPDF + alert）
// - ai-assistant-service 纯逻辑面（本批次任务未列，仅做桶导出连通性检查）
// ============================================================
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { renderHook, act, fireEvent } from '@testing-library/react'
import {
  NLPProcessor,
  nlpProcessor,
  VoiceCommandEngine,
  voiceCommandEngine,
  dataTransformers,
  chartThemes,
  chartUtils,
  defaultChartOptions,
  ChartVoiceControlManager,
  ChartVoiceControlService,
  chartVoiceControlManager,
  OllamaService,
  ollamaService,
  useDeviceDetection,
  useTouchDetection,
  usePwaInstall,
  useGestures,
  multiLanguageSpeechManager,
  aiAssistantService,
} from '../index'
import type { IntentPattern, CommandPattern, ChartData, DataSeries } from '../index'

// ============================================================
// 桶导出连通性
// ============================================================
describe('桶导出连通性（../index 转发 services 真身）', () => {
  it('桶转发全部 services 真身符号', () => {
    expect(nlpProcessor).toBeInstanceOf(NLPProcessor)
    expect(voiceCommandEngine).toBeInstanceOf(VoiceCommandEngine)
    expect(chartVoiceControlManager).toBeInstanceOf(ChartVoiceControlManager)
    expect(ollamaService).toBeInstanceOf(OllamaService)
    expect(typeof ChartVoiceControlService).toBe('function')
    expect(typeof dataTransformers.timeSeriesTransformer).toBe('function')
    expect(typeof chartUtils.formatNumber).toBe('function')
    expect(typeof useDeviceDetection).toBe('function')
    expect(typeof useGestures).toBe('function')
    expect(typeof multiLanguageSpeechManager.getRecognitionService).toBe('function')
    expect(aiAssistantService).toBeTruthy()
  })
})

// ============================================================
// NLPProcessor（自然语言处理器）
// ============================================================
describe('NLPProcessor 文本处理', () => {
  it('中文文本：识别 chart_control 意图、提取图表类型与动作实体、检测语言', () => {
    const result = nlpProcessor.process('切换到柱状图')

    expect(result.intent).toBe('chart_control')
    expect(result.confidence).toBeGreaterThan(0)
    expect(result.language).toBe('zh-CN')
    expect(result.sentiment).toBe('neutral')
    // 实体按 start 排序：动作「切换」在前，图表类型「柱状图」在后
    expect(result.entities.map((e) => ({ type: e.type, value: e.value }))).toEqual([
      { type: 'action', value: '切换' },
      { type: 'chart_type', value: '柱状图' },
    ])
    expect(result.entities[0]).toMatchObject({ start: 0, end: 2 })
    expect(result.entities[1]).toMatchObject({ start: 3, end: 6 })
  })

  it('英文文本：语言判定 en-US 并命中 bar chart 图表类型实体', () => {
    const result = nlpProcessor.process('switch to bar chart')

    expect(result.language).toBe('en-US')
    expect(result.intent).toBe('chart_control')
    expect(result.entities.some((e) => e.type === 'chart_type' && e.value === 'bar chart')).toBe(true)
  })

  it('情感分析：正向 / 负向 / 中性三档', () => {
    expect(nlpProcessor.process('this is good').sentiment).toBe('positive')
    expect(nlpProcessor.process('terrible').sentiment).toBe('negative')
    expect(nlpProcessor.process('切换到柱状图').sentiment).toBe('neutral')
  })

  it('无命中文本回退 unknown 意图且置信度为 0', () => {
    // 意图识别基于子串包含（如 good 含 go 会误触 navigation），选用完全无关键词子串的文本
    const result = nlpProcessor.process('random words here')

    expect(result.intent).toBe('unknown')
    expect(result.confidence).toBe(0)
  })

  it('关键词提取：按词频降序', () => {
    const result = nlpProcessor.process('数据 数据 分析')

    expect(result.keywords[0]).toBe('数据')
    expect(result.keywords).toContain('分析')
  })

  it('batchProcess 逐条处理并保持顺序', () => {
    const results = nlpProcessor.batchProcess(['切换到柱状图', 'switch to bar chart'])

    expect(results).toHaveLength(2)
    expect(results[0].intent).toBe('chart_control')
    expect(results[1].language).toBe('en-US')
  })

  it('addIntentPattern 注册自定义意图后可被识别', () => {
    const processor = new NLPProcessor()
    const custom: IntentPattern = {
      intent: 'weather_query',
      patterns: ['查天气'],
      keywords: ['天气'],
      entities: [],
      examples: ['查天气'],
    }
    processor.addIntentPattern(custom)

    const result = processor.process('查天气')
    expect(result.intent).toBe('weather_query')
    expect(result.confidence).toBe(1)
  })

  it('getStats 反映内置词典规模并随自定义意图增长', () => {
    const processor = new NLPProcessor()
    const before = processor.getStats()

    expect(before.intentCount).toBe(7) // 7 个内置意图
    expect(before.entityTypeCount).toBe(7) // number/date/time/chart_type/time_period/action/page_name
    expect(before.positiveWordsCount).toBe(18)
    expect(before.negativeWordsCount).toBe(18)

    processor.addIntentPattern({
      intent: 'weather_query',
      patterns: [],
      keywords: ['天气'],
      entities: [],
      examples: [],
    })
    expect(processor.getStats().intentCount).toBe(8)
  })
})

// ============================================================
// VoiceCommandEngine（语音命令引擎）
// ============================================================
describe('VoiceCommandEngine 命令匹配', () => {
  const makeEngine = () => new VoiceCommandEngine()

  const makePattern = (overrides: Partial<CommandPattern> = {}): CommandPattern => ({
    id: 'custom_hello',
    patterns: [/你好/],
    keywords: ['你好'],
    synonyms: {},
    priority: 10,
    category: '测试',
    description: '自定义命令',
    examples: ['你好 世界'],
    ...overrides,
  })

  it('内置 13 条默认命令模式，按类别分组且同义词词典已装载', () => {
    const engine = makeEngine()
    const stats = engine.getStats()

    expect(stats.totalPatterns).toBe(13)
    expect(stats.categories['图表控制']).toBe(3)
    expect(stats.synonymsCount).toBe(18)
    expect(stats.contextKeys).toEqual([])

    expect(engine.getAllPatterns()).toHaveLength(13)
    expect(engine.getAllPatterns().every((p) => p.id && p.patterns.length > 0 && p.keywords.length > 0)).toBe(true)
    expect(engine.getPatternsByCategory('图表控制').map((p) => p.id)).toEqual([
      'switch_chart_type',
      'switch_line_chart',
      'switch_pie_chart',
    ])
  })

  it('中文切换图表命令命中 switch_chart_type 且置信度领先', () => {
    const match = makeEngine().getBestMatch('切换到柱状图')

    expect(match).not.toBeNull()
    expect(match!.pattern.id).toBe('switch_chart_type')
    expect(match!.confidence).toBeGreaterThan(0.5)
    expect(match!.originalText).toBe('切换到柱状图')
  })

  it('英文命令提取枚举参数 chartType=bar', () => {
    const match = makeEngine().getBestMatch('switch to bar chart')

    expect(match!.pattern.id).toBe('switch_chart_type')
    expect(match!.parameters.chartType).toBe('bar')
  })

  it('时间词预处理：本周 归一化为 this_week 并提取时间段参数', () => {
    const match = makeEngine().getBestMatch('显示本周数据')

    expect(match!.pattern.id).toBe('filter_time_period')
    expect(match!.normalizedText).toBe('显示this_week数据')
    expect(match!.parameters.timePeriod).toBe('this_week')
  })

  it('数值筛选命令提取 number 参数 value', () => {
    const match = makeEngine().getBestMatch('显示大于1000的数据')

    expect(match!.pattern.id).toBe('filter_by_value')
    expect(match!.parameters.value).toBe(1000)
  })

  it('无命中文本仅由优先级兜底越线：浮点 0.2+0.1 越过 0.3 阈值（真身已知行为）', () => {
    // 上下文分 0.2 + 优先级 10 的 0.1，浮点和为 0.30000000000000004，严格大于 0.3
    const match = makeEngine().getBestMatch('')

    expect(match).not.toBeNull()
    expect(match!.pattern.priority).toBe(10)
    expect(match!.confidence).toBeCloseTo(0.3, 10)
    expect(match!.confidence).toBeGreaterThan(0.3)
    expect(match!.parameters).toEqual({})
  })

  it('registerPattern 注册自定义命令后参与匹配', () => {
    const engine = makeEngine()
    engine.registerPattern(makePattern())

    const match = engine.getBestMatch('你好 世界')
    expect(match!.pattern.id).toBe('custom_hello')
    expect(engine.getAllPatterns()).toHaveLength(14)
  })

  it('registerPatterns 批量注册全部生效', () => {
    const engine = makeEngine()
    engine.registerPatterns([
      makePattern({ id: 'custom_a', keywords: ['苹果'], patterns: [/苹果/] }),
      makePattern({ id: 'custom_b', keywords: ['香蕉'], patterns: [/香蕉/] }),
    ])

    expect(engine.getStats().totalPatterns).toBe(15)
    expect(engine.getBestMatch('香蕉 好吃')!.pattern.id).toBe('custom_b')
  })

  it('updateContext 上下文回填到匹配结果并计入统计', () => {
    const engine = makeEngine()
    engine.updateContext({ currentPage: 'dashboard' })

    const match = engine.getBestMatch('切换到柱状图')
    expect(match!.context).toBe('dashboard')
    expect(engine.getStats().contextKeys).toEqual(['currentPage'])
  })
})

// ============================================================
// visualization-service · dataTransformers（纯数据变换）
// ============================================================
describe('dataTransformers 时间序列变换', () => {
  it('单系列：按时间升序排序并映射 x/y', () => {
    const [series] = dataTransformers.timeSeriesTransformer(
      [
        { date: '2026-03-03T10:00:00', v: 8 },
        { date: '2026-03-01T10:00:00', v: 5 },
        { date: '2026-03-02T10:00:00', v: 10 },
      ],
      { dateField: 'date', valueField: 'v' },
    )

    expect(series.id).toBe('timeseries')
    expect(series.data.map((p) => p.y)).toEqual([5, 10, 8])
    expect(series.data[0].x).toBeInstanceOf(Date)
  })

  it('按天粒度聚合：sum 汇总同日数据点并记录 count', () => {
    const [series] = dataTransformers.timeSeriesTransformer(
      [
        { date: '2026-03-01T09:00:00', v: 4 },
        { date: '2026-03-01T18:00:00', v: 6 },
        { date: '2026-03-02T09:00:00', v: 1 },
      ],
      { dateField: 'date', valueField: 'v', timeGranularity: 'day', aggregation: 'sum' },
    )

    expect(series.data).toHaveLength(2)
    expect(series.data[0]).toMatchObject({ y: 10, count: 2 })
    expect(series.data[1]).toMatchObject({ y: 1, count: 1 })
  })

  it('groupField 拆分为多系列，各系列独立排序', () => {
    const seriesList = dataTransformers.timeSeriesTransformer(
      [
        { date: '2026-03-02T10:00:00', v: 2, g: 'A' },
        { date: '2026-03-01T10:00:00', v: 1, g: 'B' },
        { date: '2026-03-01T08:00:00', v: 3, g: 'A' },
      ],
      { dateField: 'date', valueField: 'v', groupField: 'g' },
    )

    expect(seriesList.map((s) => s.id).sort()).toEqual(['A', 'B'])
    const seriesA = seriesList.find((s) => s.id === 'A')!
    expect(seriesA.data.map((p) => p.y)).toEqual([3, 2]) // A 组内部按时间升序
  })
})

describe('dataTransformers 分类变换', () => {
  const rows = [
    { c: 'b', v: 3 },
    { c: 'a', v: 9 },
    { c: 'c', v: 6 },
  ]

  it('按数值降序排序', () => {
    const [series] = dataTransformers.categoryTransformer(rows, {
      categoryField: 'c',
      valueField: 'v',
      sortBy: 'value',
      sortDirection: 'desc',
    })

    expect(series.data.map((p) => [p.x, p.y])).toEqual([
      ['a', 9],
      ['c', 6],
      ['b', 3],
    ])
  })

  it('按类别名升序排序', () => {
    const [series] = dataTransformers.categoryTransformer(rows, {
      categoryField: 'c',
      valueField: 'v',
      sortBy: 'category',
      sortDirection: 'asc',
    })

    expect(series.data.map((p) => p.x)).toEqual(['a', 'b', 'c'])
  })

  it('limit 截断后剩余项合并为「其他」类别', () => {
    const [series] = dataTransformers.categoryTransformer(rows, {
      categoryField: 'c',
      valueField: 'v',
      sortBy: 'value',
      sortDirection: 'desc',
      limit: 2,
    })

    expect(series.data).toHaveLength(3)
    expect(series.data[2]).toMatchObject({ x: '其他', y: 3, isOthersCategory: true, count: 1 })
  })
})

describe('dataTransformers 层次/网络/雷达/甘特变换', () => {
  it('hierarchyTransformer 递归标注深度并按 colorScheme 上色', () => {
    const [root] = dataTransformers.hierarchyTransformer(
      {
        id: 'root',
        name: '总量',
        value: 100,
        children: [{ id: 'c1', name: '子项', value: 40, children: [] }],
      },
      { colorScheme: ['#111111', '#222222'] },
    )

    expect(root).toMatchObject({ id: 'root', name: '总量', value: 100, depth: 0, color: '#111111' })
    expect(root.children[0]).toMatchObject({ id: 'c1', value: 40, depth: 1, color: '#222222' })
  })

  it('networkTransformer 映射节点与边，缺失字段回退默认值', () => {
    const nodeA = { id: 'n1', name: '节点一', value: 7 }
    const [graph] = dataTransformers.networkTransformer(
      { nodes: [nodeA, { id: 'n2' }], links: [{ source: 'n1', target: 'n2', value: 5 }] },
      {},
    )

    expect(graph.id).toBe('network')
    expect(graph.data.nodes[0]).toMatchObject({ id: 'n1', name: '节点一', value: 7, originalData: nodeA })
    expect(graph.data.nodes[1]).toMatchObject({ id: 'n2', name: 'n2', value: 1 }) // name/value 回退
    expect(graph.data.links[0]).toMatchObject({ source: 'n1', target: 'n2', value: 5 })
  })

  it('radarTransformer 映射维度值，非数值回退 0', () => {
    const [series] = dataTransformers.radarTransformer([{ name: '产品A', 销量: 'abc', 质量: 9 }], {
      dimensionFields: ['销量', '质量'],
    })

    expect(series.id).toBe('radar')
    expect(series.dimensions).toEqual(['销量', '质量'])
    expect(series.data[0].dimensions).toEqual({ 销量: 0, 质量: 9 })
  })

  it('radarTransformer 按 groupField 拆分多系列', () => {
    const seriesList = dataTransformers.radarTransformer(
      [
        { g: 'X', 销量: 8, 质量: 9 },
        { g: 'Y', 销量: 5, 质量: 6 },
      ],
      { dimensionFields: ['销量', '质量'], groupField: 'g' },
    )

    expect(seriesList.map((s) => s.id)).toEqual(['X', 'Y'])
    expect(seriesList[0].data[0].dimensions.销量).toBe(8)
  })

  it('ganttTransformer 解析日期区间、进度与依赖列表', () => {
    const [series] = dataTransformers.ganttTransformer(
      [
        { id: 't1', task: '任务一', start: '2026-01-01', end: '2026-01-05', progress: '60', deps: 'a, b', group: '阶段一' },
        { id: 't2', task: '任务二', start: '2026-01-02', end: '2026-01-09', group: '阶段一' },
      ],
      {
        taskField: 'task',
        startField: 'start',
        endField: 'end',
        groupField: 'group',
        progressField: 'progress',
        dependencyField: 'deps',
      },
    )

    expect(series.id).toBe('阶段一')
    const [task1, task2] = series.data
    expect(task1.start).toBeInstanceOf(Date)
    expect(task1.progress).toBe(60) // 字符串进度被 Number 化
    expect(task1.dependencies).toEqual(['a', 'b']) // 逗号拆分并去空格
    expect(task2.progress).toBe(0) // 缺失进度回退 0
    expect(task2.dependencies).toBeUndefined()
  })
})

// ============================================================
// visualization-service · chartThemes / defaultChartOptions / chartUtils（纯函数）
// ============================================================
describe('chartThemes 与 defaultChartOptions', () => {
  it('四套主题齐备，亮暗色关键值正确', () => {
    expect(Object.keys(chartThemes)).toEqual(['light', 'dark', 'yy', 'corporate'])
    expect(chartThemes.light.colors).toHaveLength(8)
    expect(chartThemes.dark.background).toBe('#1e1e1e')
    expect(chartThemes.yy.background).toBe('#f8fafc')
  })

  it('defaultChartOptions 与 light 主题联动', () => {
    expect(defaultChartOptions.animation).toBe(true)
    expect(defaultChartOptions.theme).toBe('light')
    expect(defaultChartOptions.colors).toBe(chartThemes.light.colors)
    expect(defaultChartOptions.interactions).toContain('tooltip')
  })
})

describe('chartUtils 纯函数', () => {
  it('generateRandomColor 产出合法 6 位十六进制色', () => {
    const color = chartUtils.generateRandomColor()
    expect(color).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('generateGradient 在起止色之间线性插值', () => {
    expect(chartUtils.generateGradient('#000000', '#ffffff', 3)).toEqual(['#000000', '#808080', '#ffffff'])
  })

  it('formatNumber 千分位与小数位控制', () => {
    expect(chartUtils.formatNumber(12345.678)).toBe('12,345.68')
    // minimumFractionDigits 大于默认 maximumFractionDigits(2) 会让 Intl 抛 RangeError，须同时传 max
    expect(chartUtils.formatNumber(12345.678, { minimumFractionDigits: 3, maximumFractionDigits: 3 })).toBe(
      '12,345.678',
    )
  })

  it('formatNumber 百分比 / 货币 / 紧凑记法', () => {
    expect(chartUtils.formatNumber(0.5, { style: 'percent' })).toBe('50%')
    expect(chartUtils.formatNumber(9.9, { style: 'currency', currency: 'USD', locale: 'en-US', minimumFractionDigits: 2 })).toBe('$9.90')
    expect(chartUtils.formatNumber(1500, { compact: true, locale: 'en-US' })).toBe('1.5K')
  })

  it('formatDate 按语言与格式档位输出', () => {
    const date = new Date(2026, 2, 15) // 本地时区构造，避免时区偏移
    expect(chartUtils.formatDate(date)).toBe('2026年3月15日') // zh-CN medium（当前 ICU 版本）
    expect(chartUtils.formatDate(date, { locale: 'en-US', format: 'short' })).toBe('3/15/26') // 当前 CLDR short 为两位年份
  })

  it('exportData CSV：表头与数据行序列化（stub URL.createObjectURL）', async () => {
    const originalCreate = URL.createObjectURL
    const originalRevoke = URL.revokeObjectURL
    const originalClick = HTMLAnchorElement.prototype.click
    let captured: Blob | undefined

    URL.createObjectURL = ((blob: Blob) => {
      captured = blob
      return 'blob:mock'
    }) as typeof URL.createObjectURL
    URL.revokeObjectURL = (() => {}) as typeof URL.revokeObjectURL
    HTMLAnchorElement.prototype.click = () => {}

    try {
      const chartData: ChartData = { labels: ['一月'], datasets: [{ label: '销量', data: [5] }] }
      chartUtils.exportData(chartData, { format: 'csv', fileName: 'unit-test' })
    } finally {
      URL.createObjectURL = originalCreate
      URL.revokeObjectURL = originalRevoke
      HTMLAnchorElement.prototype.click = originalClick
    }

    expect(captured).toBeInstanceOf(Blob)
    expect(await captured!.text()).toBe('标签,销量\n一月,5')
  })

  it('optimizeDataset 数据量未超限时原样返回', () => {
    const series: DataSeries[] = [{ id: 's1', name: '系列', data: [{ x: 0, y: 1 }] }]
    expect(chartUtils.optimizeDataset(series, { maxPoints: 10 })).toBe(series)
  })

  it('optimizeDataset sampling 按采样率抽点并记录压缩元信息', () => {
    const data: DataSeries[] = [
      { id: 's1', name: '系列', data: Array.from({ length: 10 }, (_, i) => ({ x: i, y: i + 1 })) },
    ]
    const [optimized] = chartUtils.optimizeDataset(data, { maxPoints: 5, method: 'sampling' })

    expect(optimized.data.map((p) => p.y)).toEqual([1, 3, 5, 7, 9]) // 步长 2 抽样
    expect((optimized as any)._optimized).toMatchObject({
      method: 'sampling',
      originalLength: 10,
      optimizedLength: 5,
      compressionRatio: 2,
    })
  })

  it('optimizeDataset aggregation 按窗口求和', () => {
    const data: DataSeries[] = [
      { id: 's1', name: '系列', data: Array.from({ length: 10 }, (_, i) => ({ x: i, y: i + 1 })) },
    ]
    const [optimized] = chartUtils.optimizeDataset(data, { maxPoints: 5, method: 'aggregation', windowSize: 5, aggregationFn: 'sum' })

    expect(optimized.data.map((p) => p.y)).toEqual([15, 40]) // (1+2+3+4+5) / (6+7+8+9+10)
    expect(optimized.data.map((p) => (p as any).count)).toEqual([5, 5])
  })
})

// ============================================================
// chart-voice-control（jsdom 降级面：识别/合成不可用但调用不炸）
// ============================================================
describe('ChartVoiceControlManager 控制器生命周期', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('createController 注册控制器并可通过 getController 取回同一实例', () => {
    const manager = new ChartVoiceControlManager()
    const controller = manager.createController({ chartId: 'chart-1' })

    expect(manager.getController('chart-1')).toBe(controller)
    expect(controller).toBeInstanceOf(ChartVoiceControlService)
  })

  it('getStatus 反映 chartId 与 jsdom 下的降级支持标记', () => {
    const manager = new ChartVoiceControlManager()
    manager.createController({ chartId: 'chart-1' })

    expect(manager.getAllStatus()).toEqual({
      'chart-1': { chartId: 'chart-1', isActive: false, speechSupported: false, recognitionSupported: false },
    })
  })

  it('activate / deactivate 切换激活态，且识别不可用时调用不炸', () => {
    const manager = new ChartVoiceControlManager()
    const controller = manager.createController({ chartId: 'chart-1' })

    controller.activate() // startListening 因 recognition 为空降级 no-op
    expect(controller.getStatus().isActive).toBe(true)
    controller.activate() // 幂等：重复激活直接返回
    expect(controller.getStatus().isActive).toBe(true)

    controller.deactivate()
    expect(controller.getStatus().isActive).toBe(false)
    controller.deactivate() // 幂等：重复停用直接返回
    expect(controller.getStatus().isActive).toBe(false)
  })

  it('removeController 停用并移除控制器，getAllStatus 清空', () => {
    const manager = new ChartVoiceControlManager()
    manager.createController({ chartId: 'chart-1' })
    manager.createController({ chartId: 'chart-2' })

    manager.removeController('chart-1')
    expect(manager.getController('chart-1')).toBeUndefined()
    expect(Object.keys(manager.getAllStatus())).toEqual(['chart-2'])

    manager.removeController('not-exist') // 不存在的 id 不炸
    expect(manager.getController('not-exist')).toBeUndefined()
  })

  it('同 chartId 重复创建时覆盖旧控制器', () => {
    const manager = new ChartVoiceControlManager()
    const first = manager.createController({ chartId: 'chart-1' })
    const second = manager.createController({ chartId: 'chart-1', onChartTypeChange: () => {} })

    expect(second).not.toBe(first)
    expect(manager.getController('chart-1')).toBe(second)
  })
})

// ============================================================
// OllamaService（fetch 打桩：成功路径 + !ok 抛错路径）
// ============================================================
describe('OllamaService HTTP 交互', () => {
  const okJson = (data: unknown) => ({ ok: true, statusText: 'OK', json: async () => data })
  const badResponse = (statusText: string) => ({ ok: false, statusText, json: async () => ({}) })

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('默认 baseUrl 指向 http://localhost:11434', async () => {
    const fetchMock = vi.fn(async () => okJson({ models: [] }))
    vi.stubGlobal('fetch', fetchMock)

    await new OllamaService().listModels()
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:11434/api/tags')
  })

  it('自定义 baseUrl 参与请求地址拼接', async () => {
    const fetchMock = vi.fn(async () => okJson({ models: [] }))
    vi.stubGlobal('fetch', fetchMock)

    await new OllamaService('http://192.168.1.10:11434').listModels()
    expect(fetchMock).toHaveBeenCalledWith('http://192.168.1.10:11434/api/tags')
  })

  it('listModels 成功：返回模型数组', async () => {
    const models = [{ name: 'qwen2.5:7b', id: 'abc123', size: '4.7GB', modified: '2026-01-01' }]
    vi.stubGlobal('fetch', vi.fn(async () => okJson({ models })))

    const result = await new OllamaService().listModels()
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ name: 'qwen2.5:7b', id: 'abc123' })
  })

  it('listModels 失败：!ok 抛出含 statusText 的错误', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => badResponse('Service Unavailable')))

    await expect(new OllamaService().listModels()).rejects.toThrow('获取模型列表失败: Service Unavailable')
  })

  it('listModels 网络异常：fetch 拒绝时错误向上传播', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('network down'))))

    await expect(new OllamaService().listModels()).rejects.toThrow('network down')
  })

  it('generateText 成功：POST JSON 到 /api/generate 并解析响应', async () => {
    const fetchMock = vi.fn(async () =>
      okJson({ model: 'qwen2.5:7b', created_at: '2026-01-01T00:00:00Z', response: '你好，世界', done: true }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await new OllamaService().generateText({ model: 'qwen2.5:7b', prompt: '打个招呼' })

    expect(result.response).toBe('你好，世界')
    expect(result.done).toBe(true)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://localhost:11434/api/generate')
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({ model: 'qwen2.5:7b', prompt: '打个招呼' })
  })

  it('generateText 失败：!ok 抛出错误', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => badResponse('Bad Gateway')))

    await expect(new OllamaService().generateText({ model: 'm', prompt: 'p' })).rejects.toThrow(
      '生成文本失败: Bad Gateway',
    )
  })

  it('streamText 成功：跨 chunk 缓冲按行解析流式响应', async () => {
    const encoder = new TextEncoder()
    const chunks = [encoder.encode('{"response":"你"}\n{"resp'), encoder.encode('onse":"好"}\n{"done":true}')]
    let cursor = 0
    const fetchMock = vi.fn(async () => ({
      ok: true,
      statusText: 'OK',
      body: {
        getReader: () => ({
          read: async () =>
            cursor < chunks.length ? { done: false, value: chunks[cursor++] } : { done: true, value: undefined },
        }),
      },
    }))
    vi.stubGlobal('fetch', fetchMock)

    const received = []
    for await (const chunk of new OllamaService().streamText({ model: 'qwen2.5:7b', prompt: 'hi' })) {
      received.push(chunk)
    }

    expect(received).toHaveLength(3) // 两条内容 + 终止帧
    expect(received[0]).toMatchObject({ response: '你' })
    expect(received[1]).toMatchObject({ response: '好' })
    expect(received[2]).toMatchObject({ done: true })

    const [, init] = fetchMock.mock.calls[0]
    expect(JSON.parse(init.body).stream).toBe(true)
  })

  it('streamText 失败：!ok 抛出错误', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => badResponse('Service Unavailable')))

    await expect(
      (async () => {
        for await (const _ of new OllamaService().streamText({ model: 'm', prompt: 'p' })) {
          // 消费流触发首次 fetch
        }
      })(),
    ).rejects.toThrow('流式生成文本失败: Service Unavailable')
  })

  it('getEmbedding 成功：POST model+prompt 到 /api/embeddings 并返回向量', async () => {
    const fetchMock = vi.fn(async () => okJson({ embedding: [0.1, 0.2, 0.3] }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await new OllamaService().getEmbedding('nomic-embed-text', '一段文本')

    expect(result.embedding).toEqual([0.1, 0.2, 0.3])
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://localhost:11434/api/embeddings')
    expect(JSON.parse(init.body)).toEqual({ model: 'nomic-embed-text', prompt: '一段文本' })
  })

  it('getEmbedding 失败：!ok 抛出错误', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => badResponse('Not Found')))

    await expect(new OllamaService().getEmbedding('m', 't')).rejects.toThrow('获取嵌入向量失败: Not Found')
  })
})

// ============================================================
// mobile-service（断点阈值 / 触摸检测 / PWA / 手势）
// ============================================================
describe('useDeviceDetection 断点阈值', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('jsdom 默认 1024×768 判定为 desktop + landscape', () => {
    const { result } = renderHook(() => useDeviceDetection())

    expect(result.current.deviceType).toBe('desktop')
    expect(result.current.isDesktop).toBe(true)
    expect(result.current.isMobile).toBe(false)
    expect(result.current.orientation).toBe('landscape')
  })

  it('resize 事件驱动断点切换：mobile → tablet → desktop', () => {
    const { result } = renderHook(() => useDeviceDetection())

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500)
    act(() => {
      fireEvent.resize(window)
    })
    expect(result.current.deviceType).toBe('mobile')
    expect(result.current.isMobile).toBe(true)

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800)
    act(() => {
      fireEvent.resize(window)
    })
    expect(result.current.deviceType).toBe('tablet')
    expect(result.current.isTablet).toBe(true)

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1280)
    act(() => {
      fireEvent.resize(window)
    })
    expect(result.current.deviceType).toBe('desktop')
  })

  it('宽 < 高 时判定为 portrait', () => {
    const { result } = renderHook(() => useDeviceDetection())

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500)
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(900)
    act(() => {
      fireEvent.resize(window)
    })

    expect(result.current.orientation).toBe('portrait')
    expect(result.current.deviceType).toBe('mobile')
  })

  it('自定义断点阈值生效', () => {
    const { result } = renderHook(() => useDeviceDetection({ mobileBreakpoint: 100, tabletBreakpoint: 200 }))

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(150)
    act(() => {
      fireEvent.resize(window)
    })
    expect(result.current.deviceType).toBe('tablet')

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(90)
    act(() => {
      fireEvent.resize(window)
    })
    expect(result.current.deviceType).toBe('mobile')

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(300)
    act(() => {
      fireEvent.resize(window)
    })
    expect(result.current.deviceType).toBe('desktop')
  })
})

describe('useTouchDetection / usePwaInstall', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    // jsdom 未实现 matchMedia，补最小桩（仅环境垫片，不打桩 hook 逻辑）
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })
  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('jsdom window 定义了 ontouchstart，检测走 ontouchstart 分支返回 true', () => {
    const { result } = renderHook(() => useTouchDetection())

    expect(result.current.isTouchDevice).toBe(true)
  })

  it('无安装事件时 canInstall/isInstalled 为 false', () => {
    const { result } = renderHook(() => usePwaInstall())

    expect(result.current.canInstall).toBe(false)
    expect(result.current.isInstalled).toBe(false)
  })

  it('deferredPrompt 缺失时 promptInstall 返回 false', async () => {
    const { result } = renderHook(() => usePwaInstall())

    await act(async () => {
      await expect(result.current.promptInstall()).resolves.toBe(false)
    })
  })
})

describe('useGestures 手势判定', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  // jsdom 无 TouchEvent 构造器，用携带 touches/changedTouches 的普通 Event 模拟
  const touchEvent = (type: 'touchstart' | 'touchend', x: number, y: number) => {
    const event = new Event(type) as Event & { touches?: unknown[]; changedTouches?: unknown[] }
    if (type === 'touchstart') {
      event.touches = [{ clientX: x, clientY: y }]
    } else {
      event.changedTouches = [{ clientX: x, clientY: y }]
    }
    return event
  }

  const renderGestures = () => {
    const el = document.createElement('div')
    const ref = { current: el }
    const view = renderHook(() => useGestures(ref))
    return { el, view }
  }

  it('水平右滑超过 50px 判定为 swipe-right', () => {
    const { el, view } = renderGestures()

    act(() => {
      el.dispatchEvent(touchEvent('touchstart', 0, 0))
      el.dispatchEvent(touchEvent('touchend', 120, 10))
    })

    expect(view.result.current.gesture).toBe('swipe-right')
  })

  it('水平左滑超过 50px 判定为 swipe-left', () => {
    const { el, view } = renderGestures()

    act(() => {
      el.dispatchEvent(touchEvent('touchstart', 200, 0))
      el.dispatchEvent(touchEvent('touchend', 80, 5))
    })

    expect(view.result.current.gesture).toBe('swipe-left')
  })

  it('垂直上滑超过 50px 判定为 swipe-up', () => {
    const { el, view } = renderGestures()

    act(() => {
      el.dispatchEvent(touchEvent('touchstart', 100, 200))
      el.dispatchEvent(touchEvent('touchend', 95, 80))
    })

    expect(view.result.current.gesture).toBe('swipe-up')
  })

  it('位移未超过 50px 阈值时保持 none', () => {
    const { el, view } = renderGestures()

    act(() => {
      el.dispatchEvent(touchEvent('touchstart', 0, 0))
      el.dispatchEvent(touchEvent('touchend', 30, 5))
    })

    expect(view.result.current.gesture).toBe('none')
  })

  it('主轴为纵向时以 deltaY 决定方向（右滑小幅 + 下滑大幅 → swipe-down）', () => {
    const { el, view } = renderGestures()

    act(() => {
      el.dispatchEvent(touchEvent('touchstart', 0, 0))
      el.dispatchEvent(touchEvent('touchend', 40, 120)) // |dx|=40 < |dy|=120 → 走纵向分支
    })

    expect(view.result.current.gesture).toBe('swipe-down')
  })

  it('手势触发约 500ms 后自动重置为 none', () => {
    vi.useFakeTimers()
    const { el, view } = renderGestures()

    act(() => {
      el.dispatchEvent(touchEvent('touchstart', 0, 0))
      el.dispatchEvent(touchEvent('touchend', 120, 0))
    })
    expect(view.result.current.gesture).toBe('swipe-right')

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(view.result.current.gesture).toBe('none')
  })
})

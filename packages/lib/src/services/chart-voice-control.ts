// ============================================================
// YYC³ · @yyc3/lib services 轻量桩层（Phase 7 lib services 批次 · 桩 1/4）
// 图表语音控制服务：语音指令→图表交互的映射管理
// 桩语义：接口正确 + 命令匹配模拟；真身待 lib services 批次并入
// ============================================================

export interface VoiceCommand {
  phrase: string
  action: string
  target?: string
}

export interface ChartVoiceControllerConfig {
  chartId: string
  onChartTypeChange?: (type: string) => void
  onDataFilter?: (filter: unknown) => void
  onZoom?: (action: string) => void
  onExport?: (format: string) => void
  onThemeChange?: (theme: string) => void
  onDataSpeak?: (data: unknown) => void
}

export interface ChartVoiceController {
  start: () => void
  stop: () => void
  /** 获取状态（源 API：消费方 interactive-chart 使用 chartId） */
  getStatus: () => { active: boolean; chartId?: string }
  /** 激活（源 API） */
  activate: () => void
  /** 停用（源 API） */
  deactivate: () => void
}

export class ChartVoiceControlService {
  private commands: VoiceCommand[] = [
    { phrase: '显示数据', action: 'show-data' },
    { phrase: '隐藏图例', action: 'hide-legend' },
    { phrase: '放大', action: 'zoom-in' },
    { phrase: '缩小', action: 'zoom-out' },
  ]

  private controllers = new Map<string, ChartVoiceController>()

  register(command: VoiceCommand): void {
    this.commands.push(command)
  }

  match(input: string): VoiceCommand | undefined {
    const lower = input.toLowerCase()
    return this.commands.find((c) => lower.includes(c.phrase.toLowerCase()))
  }

  list(): VoiceCommand[] {
    return [...this.commands]
  }

  /** 创建图表语音控制器（源 API：消费方 interactive-chart 使用） */
  createController(config: ChartVoiceControllerConfig): ChartVoiceController {
    void config
    return {
      start: () => void 0,
      stop: () => void 0,
      getStatus: () => ({ active: false, chartId: config?.chartId }),
      activate: () => void 0,
      deactivate: () => void 0,
    }
  }

  /** 移除控制器（源 API） */
  removeController(chartId: string): void {
    this.controllers.delete(chartId)
  }

  /** 获取控制器状态（源 API） */
  getStatus(chartId?: string): { active: boolean; chartId?: string } {
    return { active: this.controllers.size > 0, chartId }
  }

  /** 激活语音控制（源 API） */
  activate(): void {
    void 0
  }

  /** 停用语音控制（源 API） */
  deactivate(): void {
    void 0
  }
}

export const chartVoiceControlManager = new ChartVoiceControlService()

// ============================================================
// YYC³ · @yyc3/lib services 真身（lib services 真身批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/YYC-cloud-platform/lib/services/chart-voice-control.ts
// ============================================================
"use client"

/**
 * ⟨YYC³⟩ 图表语音控制服务
 * 为图表组件提供语音识别控制功能
 */

import { multiLanguageSpeechManager, type VoiceCommand } from "./speech-service"

export interface ChartVoiceControlOptions {
  chartId: string
  onChartTypeChange?: (type: string) => void
  onDataFilter?: (filter: any) => void
  onZoom?: (action: "in" | "out" | "reset") => void
  onExport?: (format: string) => void
  onThemeChange?: (theme: string) => void
  onDataSpeak?: (data: any) => void
}

export interface ChartDataSpeechOptions {
  includeTitle?: boolean
  includeLabels?: boolean
  includeValues?: boolean
  maxItems?: number
  language?: string
}

/**
 * 图表语音控制服务类
 */
export class ChartVoiceControlService {
  private options: ChartVoiceControlOptions
  private isActive = false
  private speechManager = multiLanguageSpeechManager

  constructor(options: ChartVoiceControlOptions) {
    this.options = options
    this.setupChartCommands()
  }

  /**
   * 激活语音控制
   */
  activate(): void {
    if (this.isActive) return

    this.isActive = true
    this.speechManager.getRecognitionService().startListening({
      continuous: true,
      interimResults: true,
    })

    console.log(`图表 ${this.options.chartId} 语音控制已激活`)
  }

  /**
   * 停用语音控制
   */
  deactivate(): void {
    if (!this.isActive) return

    this.isActive = false
    this.speechManager.getRecognitionService().stopListening()

    console.log(`图表 ${this.options.chartId} 语音控制已停用`)
  }

  /**
   * 设置图表语音命令
   */
  private setupChartCommands(): void {
    const commands: VoiceCommand[] = [
      // 图表类型切换命令
      {
        command: "change_chart_type_line",
        patterns: [/切换.*线图|显示.*线图|改为.*线图/, /change.*line|show.*line|switch.*line/i],
        action: () => this.options.onChartTypeChange?.("line"),
        description: "切换到线图",
        category: "图表类型",
      },
      {
        command: "change_chart_type_bar",
        patterns: [/切换.*柱图|显示.*柱图|改为.*柱图/, /change.*bar|show.*bar|switch.*bar/i],
        action: () => this.options.onChartTypeChange?.("bar"),
        description: "切换到柱图",
        category: "图表类型",
      },
      {
        command: "change_chart_type_pie",
        patterns: [/切换.*饼图|显示.*饼图|改为.*饼图/, /change.*pie|show.*pie|switch.*pie/i],
        action: () => this.options.onChartTypeChange?.("pie"),
        description: "切换到饼图",
        category: "图表类型",
      },
      {
        command: "change_chart_type_area",
        patterns: [/切换.*面积图|显示.*面积图|改为.*面积图/, /change.*area|show.*area|switch.*area/i],
        action: () => this.options.onChartTypeChange?.("area"),
        description: "切换到面积图",
        category: "图表类型",
      },

      // 缩放控制命令
      {
        command: "zoom_in",
        patterns: [/放大|缩放.*大/, /zoom.*in|enlarge/i],
        action: () => this.options.onZoom?.("in"),
        description: "放大图表",
        category: "视图控制",
      },
      {
        command: "zoom_out",
        patterns: [/缩小|缩放.*小/, /zoom.*out|shrink/i],
        action: () => this.options.onZoom?.("out"),
        description: "缩小图表",
        category: "视图控制",
      },
      {
        command: "zoom_reset",
        patterns: [/重置.*缩放|恢复.*大小|还原.*视图/, /reset.*zoom|restore.*view/i],
        action: () => this.options.onZoom?.("reset"),
        description: "重置缩放",
        category: "视图控制",
      },

      // 主题切换命令
      {
        command: "theme_light",
        patterns: [/浅色.*主题|明亮.*主题|白色.*主题/, /light.*theme|bright.*theme/i],
        action: () => this.options.onThemeChange?.("light"),
        description: "切换到浅色主题",
        category: "主题设置",
      },
      {
        command: "theme_dark",
        patterns: [/深色.*主题|暗色.*主题|黑色.*主题/, /dark.*theme|night.*theme/i],
        action: () => this.options.onThemeChange?.("dark"),
        description: "切换到深色主题",
        category: "主题设置",
      },

      // 导出命令
      {
        command: "export_png",
        patterns: [/导出.*图片|保存.*PNG/, /export.*image|save.*png/i],
        action: () => this.options.onExport?.("png"),
        description: "导出为PNG图片",
        category: "数据导出",
      },
      {
        command: "export_pdf",
        patterns: [/导出.*PDF|保存.*PDF/, /export.*pdf|save.*pdf/i],
        action: () => this.options.onExport?.("pdf"),
        description: "导出为PDF文件",
        category: "数据导出",
      },
      {
        command: "export_csv",
        patterns: [/导出.*数据|导出.*CSV/, /export.*data|export.*csv/i],
        action: () => this.options.onExport?.("csv"),
        description: "导出数据为CSV",
        category: "数据导出",
      },

      // 数据播报命令
      {
        command: "speak_data",
        patterns: [/播报.*数据|读出.*数据|语音.*数据/, /speak.*data|read.*data|voice.*data/i],
        action: () => this.speakChartData(),
        description: "语音播报图表数据",
        category: "数据播报",
      },
      {
        command: "speak_summary",
        patterns: [/播报.*摘要|读出.*总结|语音.*概述/, /speak.*summary|read.*summary/i],
        action: () => this.speakChartSummary(),
        description: "语音播报数据摘要",
        category: "数据播报",
      },

      // 数据筛选命令
      {
        command: "filter_last_week",
        patterns: [/显示.*上周|筛选.*上周|过滤.*上周/, /show.*last.*week|filter.*last.*week/i],
        action: () => this.options.onDataFilter?.({ period: "last_week" }),
        description: "显示上周数据",
        category: "数据筛选",
      },
      {
        command: "filter_last_month",
        patterns: [/显示.*上月|筛选.*上月|过滤.*上月/, /show.*last.*month|filter.*last.*month/i],
        action: () => this.options.onDataFilter?.({ period: "last_month" }),
        description: "显示上月数据",
        category: "数据筛选",
      },
      {
        command: "filter_this_year",
        patterns: [/显示.*今年|筛选.*今年|过滤.*今年/, /show.*this.*year|filter.*this.*year/i],
        action: () => this.options.onDataFilter?.({ period: "this_year" }),
        description: "显示今年数据",
        category: "数据筛选",
      },
    ]

    // 注册所有命令
    commands.forEach((command) => {
      this.speechManager.getRecognitionService().registerCommand(command)
    })
  }

  /**
   * 播报图表数据
   */
  private async speakChartData(options: ChartDataSpeechOptions = {}): Promise<void> {
    try {
      // 这里应该从图表组件获取实际数据
      // 为了演示，我们使用模拟数据
      const mockData = [
        { label: "一月", value: 1200 },
        { label: "二月", value: 1900 },
        { label: "三月", value: 3000 },
        { label: "四月", value: 5000 },
        { label: "五月", value: 2000 },
      ]

      let speechText = ""

      if (options.includeTitle !== false) {
        speechText += "图表数据播报。"
      }

      const maxItems = options.maxItems || 10
      const dataToSpeak = mockData.slice(0, maxItems)

      dataToSpeak.forEach((item, index) => {
        if (options.includeLabels !== false) {
          speechText += `${item.label}：`
        }
        if (options.includeValues !== false) {
          speechText += `${this.formatNumber(item.value)}。`
        }
      })

      if (mockData.length > maxItems) {
        speechText += `还有${mockData.length - maxItems}项数据未播报。`
      }

      await this.speechManager.speakInLanguage(speechText, options.language)
      this.options.onDataSpeak?.(mockData)
    } catch (error) {
      console.error("播报图表数据失败:", error)
      await this.speechManager.speakInLanguage("播报数据时出现错误")
    }
  }

  /**
   * 播报图表摘要
   */
  private async speakChartSummary(): Promise<void> {
    try {
      // 模拟数据摘要
      const summary = {
        totalItems: 5,
        maxValue: 5000,
        minValue: 1200,
        average: 2620,
        trend: "上升",
      }

      const speechText = `
        数据摘要：
        共有${summary.totalItems}个数据点。
        最大值为${this.formatNumber(summary.maxValue)}，
        最小值为${this.formatNumber(summary.minValue)}，
        平均值为${this.formatNumber(summary.average)}。
        整体趋势呈${summary.trend}态势。
      `
        .replace(/\s+/g, " ")
        .trim()

      await this.speechManager.speakInLanguage(speechText)
    } catch (error) {
      console.error("播报图表摘要失败:", error)
      await this.speechManager.speakInLanguage("播报摘要时出现错误")
    }
  }

  /**
   * 格式化数字
   */
  private formatNumber(num: number): string {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}千`
    }
    return num.toString()
  }

  /**
   * 更新选项
   */
  updateOptions(options: Partial<ChartVoiceControlOptions>): void {
    this.options = { ...this.options, ...options }
  }

  /**
   * 获取状态
   */
  getStatus() {
    return {
      chartId: this.options.chartId,
      isActive: this.isActive,
      speechSupported: this.speechManager.getSynthesisService().isSupported(),
      recognitionSupported: this.speechManager.getRecognitionService().isSupported(),
    }
  }
}

/**
 * 图表语音控制管理器
 */
export class ChartVoiceControlManager {
  private controllers: Map<string, ChartVoiceControlService> = new Map()

  /**
   * 创建图表语音控制器
   */
  createController(options: ChartVoiceControlOptions): ChartVoiceControlService {
    const controller = new ChartVoiceControlService(options)
    this.controllers.set(options.chartId, controller)
    return controller
  }

  /**
   * 获取控制器
   */
  getController(chartId: string): ChartVoiceControlService | undefined {
    return this.controllers.get(chartId)
  }

  /**
   * 移除控制器
   */
  removeController(chartId: string): void {
    const controller = this.controllers.get(chartId)
    if (controller) {
      controller.deactivate()
      this.controllers.delete(chartId)
    }
  }

  /**
   * 激活所有控制器
   */
  activateAll(): void {
    this.controllers.forEach((controller) => controller.activate())
  }

  /**
   * 停用所有控制器
   */
  deactivateAll(): void {
    this.controllers.forEach((controller) => controller.deactivate())
  }

  /**
   * 获取所有控制器状态
   */
  getAllStatus() {
    const status: { [chartId: string]: any } = {}
    this.controllers.forEach((controller, chartId) => {
      status[chartId] = controller.getStatus()
    })
    return status
  }
}

// 导出管理器实例
export const chartVoiceControlManager = new ChartVoiceControlManager()

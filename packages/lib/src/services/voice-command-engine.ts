// ============================================================
// YYC³ · @yyc3/lib services 真身（lib services 真身批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/YYC-cloud-platform/lib/services/voice-command-engine.ts
// ============================================================
"use client"

/**
 * ⟨YYC³⟩ 智能语音命令引擎
 * 提供自然语言处理、上下文理解和智能匹配功能
 */

export interface CommandPattern {
  id: string
  patterns: RegExp[]
  keywords: string[]
  synonyms: { [key: string]: string[] }
  context?: string[]
  priority: number
  category: string
  description: string
  examples: string[]
  parameters?: CommandParameter[]
}

export interface CommandParameter {
  name: string
  type: "string" | "number" | "date" | "enum"
  required: boolean
  values?: string[]
  pattern?: RegExp
  description: string
}

export interface CommandMatch {
  pattern: CommandPattern
  confidence: number
  parameters: { [key: string]: any }
  originalText: string
  normalizedText: string
  context?: string
}

export interface VoiceContext {
  currentPage?: string
  selectedChart?: string
  activeFilters?: any[]
  recentCommands?: string[]
  userPreferences?: any
  sessionData?: any
}

/**
 * 智能语音命令引擎类
 */
export class VoiceCommandEngine {
  private patterns: Map<string, CommandPattern> = new Map()
  private context: VoiceContext = {}
  private synonymDict: Map<string, string[]> = new Map()
  private stopWords = new Set([
    "的",
    "了",
    "是",
    "在",
    "和",
    "与",
    "或",
    "但",
    "然后",
    "接着",
    "请",
    "帮我",
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "then",
    "please",
  ])

  // 数字词汇映射
  private numberWords = new Map([
    ["一", "1"],
    ["二", "2"],
    ["三", "3"],
    ["四", "4"],
    ["五", "5"],
    ["六", "6"],
    ["七", "7"],
    ["八", "8"],
    ["九", "9"],
    ["十", "10"],
    ["零", "0"],
    ["百", "100"],
    ["千", "1000"],
    ["万", "10000"],
    ["first", "1"],
    ["second", "2"],
    ["third", "3"],
    ["fourth", "4"],
    ["fifth", "5"],
    ["one", "1"],
    ["two", "2"],
    ["three", "3"],
    ["four", "4"],
    ["five", "5"],
    ["six", "6"],
    ["seven", "7"],
    ["eight", "8"],
    ["nine", "9"],
    ["ten", "10"],
  ])

  // 时间词汇映射
  private timeWords = new Map([
    ["今天", "today"],
    ["昨天", "yesterday"],
    ["明天", "tomorrow"],
    ["本周", "this_week"],
    ["上周", "last_week"],
    ["下周", "next_week"],
    ["本月", "this_month"],
    ["上月", "last_month"],
    ["下月", "next_month"],
    ["今年", "this_year"],
    ["去年", "last_year"],
    ["明年", "next_year"],
    ["最近", "recent"],
    ["最新", "latest"],
    ["过去", "past"],
  ])

  constructor() {
    this.initializeSynonyms()
    this.initializeDefaultPatterns()
  }

  /**
   * 初始化同义词词典
   */
  private initializeSynonyms(): void {
    const synonyms = {
      显示: ["展示", "查看", "看", "打开", "呈现", "show", "display", "view", "open"],
      切换: ["改为", "换成", "变成", "转换", "switch", "change", "convert"],
      图表: ["图", "表", "图形", "chart", "graph", "visualization"],
      数据: ["信息", "内容", "资料", "data", "information", "content"],
      导出: ["保存", "下载", "输出", "export", "save", "download"],
      筛选: ["过滤", "选择", "查找", "filter", "select", "find"],
      放大: ["缩放", "扩大", "增大", "zoom in", "enlarge", "magnify"],
      缩小: ["缩放", "减小", "变小", "zoom out", "shrink", "reduce"],
      播报: ["朗读", "读出", "说出", "speak", "read", "announce"],
      主题: ["样式", "风格", "外观", "theme", "style", "appearance"],
      深色: ["暗色", "黑色", "夜间", "dark", "night", "black"],
      浅色: ["亮色", "白色", "明亮", "light", "bright", "white"],
      柱状图: ["柱图", "条形图", "bar chart", "column chart"],
      折线图: ["线图", "曲线图", "line chart", "curve chart"],
      饼图: ["圆饼图", "扇形图", "pie chart", "donut chart"],
      面积图: ["区域图", "area chart", "filled chart"],
      散点图: ["点图", "scatter plot", "dot chart"],
      雷达图: ["蜘蛛图", "radar chart", "spider chart"],
    }

    Object.entries(synonyms).forEach(([key, values]) => {
      this.synonymDict.set(key, values)
    })
  }

  /**
   * 初始化默认命令模式
   */
  private initializeDefaultPatterns(): void {
    const patterns: CommandPattern[] = [
      // 图表类型切换命令
      {
        id: "switch_chart_type",
        patterns: [
          /(?:切换|改为|换成|显示|展示).*?(?:柱状图|柱图|条形图)/i,
          /(?:switch|change|show).*?(?:bar|column)/i,
        ],
        keywords: ["切换", "柱状图", "switch", "bar"],
        synonyms: { 切换: ["改为", "换成"], 柱状图: ["柱图", "条形图"] },
        priority: 10,
        category: "图表控制",
        description: "切换图表类型",
        examples: ["切换到柱状图", "改为柱图", "switch to bar chart"],
        parameters: [
          {
            name: "chartType",
            type: "enum",
            required: true,
            values: ["bar", "line", "pie", "area", "scatter", "radar"],
            description: "图表类型",
          },
        ],
      },
      {
        id: "switch_line_chart",
        patterns: [
          /(?:切换|改为|换成|显示|展示).*?(?:折线图|线图|曲线图)/i,
          /(?:switch|change|show).*?(?:line|curve)/i,
        ],
        keywords: ["切换", "折线图", "switch", "line"],
        synonyms: { 切换: ["改为", "换成"], 折线图: ["线图", "曲线图"] },
        priority: 10,
        category: "图表控制",
        description: "切换到折线图",
        examples: ["切换到折线图", "改为线图", "switch to line chart"],
      },
      {
        id: "switch_pie_chart",
        patterns: [/(?:切换|改为|换成|显示|展示).*?(?:饼图|圆饼图|扇形图)/i, /(?:switch|change|show).*?(?:pie|donut)/i],
        keywords: ["切换", "饼图", "switch", "pie"],
        synonyms: { 切换: ["改为", "换成"], 饼图: ["圆饼图", "扇形图"] },
        priority: 10,
        category: "图表控制",
        description: "切换到饼图",
        examples: ["切换到饼图", "改为饼图", "switch to pie chart"],
      },

      // 数据筛选命令
      {
        id: "filter_time_period",
        patterns: [
          /(?:显示|展示|查看|筛选|过滤).*?(?:今天|昨天|明天|本周|上周|下周|本月|上月|下月|今年|去年|明年).*?(?:数据|信息)/i,
          /(?:show|display|filter).*?(?:today|yesterday|tomorrow|this week|last week|next week|this month|last month|next month|this year|last year|next year).*?(?:data|information)/i,
        ],
        keywords: ["显示", "数据", "今天", "show", "data", "today"],
        synonyms: { 显示: ["展示", "查看"], 数据: ["信息", "内容"] },
        priority: 9,
        category: "数据筛选",
        description: "按时间段筛选数据",
        examples: ["显示本周数据", "查看上月信息", "show this week data"],
        parameters: [
          {
            name: "timePeriod",
            type: "enum",
            required: true,
            values: [
              "today",
              "yesterday",
              "tomorrow",
              "this_week",
              "last_week",
              "next_week",
              "this_month",
              "last_month",
              "next_month",
              "this_year",
              "last_year",
              "next_year",
            ],
            description: "时间段",
          },
        ],
      },
      {
        id: "filter_by_value",
        patterns: [
          /(?:显示|展示|查看|筛选|过滤).*?(?:大于|小于|等于|超过|低于|高于).*?(\d+)/i,
          /(?:show|display|filter).*?(?:greater than|less than|equal to|above|below|over|under).*?(\d+)/i,
        ],
        keywords: ["筛选", "大于", "filter", "greater"],
        synonyms: { 筛选: ["过滤", "选择"], 大于: ["超过", "高于"] },
        priority: 8,
        category: "数据筛选",
        description: "按数值条件筛选",
        examples: ["显示大于1000的数据", "show values greater than 1000"],
        parameters: [
          {
            name: "operator",
            type: "enum",
            required: true,
            values: [">", "<", "=", ">=", "<="],
            description: "比较操作符",
          },
          {
            name: "value",
            type: "number",
            required: true,
            description: "比较值",
          },
        ],
      },

      // 视图控制命令
      {
        id: "zoom_control",
        patterns: [
          /(?:放大|缩小|重置|还原).*?(?:图表|视图|画面)?/i,
          /(?:zoom in|zoom out|reset|restore).*?(?:chart|view)?/i,
        ],
        keywords: ["放大", "缩小", "zoom", "reset"],
        synonyms: { 放大: ["扩大", "增大"], 缩小: ["减小", "变小"] },
        priority: 7,
        category: "视图控制",
        description: "控制图表缩放",
        examples: ["放大图表", "缩小视图", "zoom in chart"],
        parameters: [
          {
            name: "action",
            type: "enum",
            required: true,
            values: ["in", "out", "reset"],
            description: "缩放操作",
          },
        ],
      },

      // 主题切换命令
      {
        id: "theme_control",
        patterns: [
          /(?:切换|改为|换成).*?(?:深色|暗色|黑色|夜间|浅色|亮色|白色|明亮).*?(?:主题|模式|样式)?/i,
          /(?:switch|change).*?(?:dark|light|night|bright).*?(?:theme|mode)?/i,
        ],
        keywords: ["切换", "主题", "深色", "switch", "theme", "dark"],
        synonyms: { 切换: ["改为", "换成"], 深色: ["暗色", "黑色"] },
        priority: 6,
        category: "界面设置",
        description: "切换界面主题",
        examples: ["切换到深色主题", "改为浅色模式", "switch to dark theme"],
      },

      // 数据导出命令
      {
        id: "export_data",
        patterns: [
          /(?:导出|保存|下载).*?(?:图片|图像|PNG|JPG|PDF|CSV|Excel|数据)?/i,
          /(?:export|save|download).*?(?:image|picture|png|jpg|pdf|csv|excel|data)?/i,
        ],
        keywords: ["导出", "保存", "export", "save"],
        synonyms: { 导出: ["保存", "下载"], 图片: ["图像", "PNG"] },
        priority: 8,
        category: "数据导出",
        description: "导出数据或图表",
        examples: ["导出为PNG图片", "保存为PDF", "export as CSV"],
        parameters: [
          {
            name: "format",
            type: "enum",
            required: true,
            values: ["png", "jpg", "pdf", "csv", "excel"],
            description: "导出格式",
          },
        ],
      },

      // 语音播报命令
      {
        id: "speak_data",
        patterns: [
          /(?:播报|朗读|读出|说出).*?(?:数据|信息|内容|摘要|总结)?/i,
          /(?:speak|read|announce).*?(?:data|information|content|summary)?/i,
        ],
        keywords: ["播报", "数据", "speak", "data"],
        synonyms: { 播报: ["朗读", "读出"], 数据: ["信息", "内容"] },
        priority: 7,
        category: "语音播报",
        description: "语音播报数据",
        examples: ["播报数据", "读出摘要", "speak the data"],
      },

      // 导航命令
      {
        id: "navigate_page",
        patterns: [
          /(?:打开|跳转|前往|访问).*?(?:首页|仪表板|用户|设置|图表|分析|文件|搜索).*?(?:页面)?/i,
          /(?:open|go to|navigate to|visit).*?(?:home|dashboard|users|settings|charts|analytics|files|search).*?(?:page)?/i,
        ],
        keywords: ["打开", "页面", "open", "page"],
        synonyms: { 打开: ["跳转", "前往"], 页面: ["界面", "page"] },
        priority: 9,
        category: "页面导航",
        description: "页面导航",
        examples: ["打开用户页面", "跳转到设置", "go to dashboard"],
        parameters: [
          {
            name: "page",
            type: "enum",
            required: true,
            values: [
              "home",
              "dashboard",
              "users",
              "settings",
              "charts",
              "analytics",
              "files",
              "search",
              "crm",
              "erp",
              "ecommerce",
            ],
            description: "目标页面",
          },
        ],
      },

      // 搜索命令
      {
        id: "search_content",
        patterns: [
          /(?:搜索|查找|寻找).*?"([^"]+)"/i,
          /(?:search|find|look for).*?"([^"]+)"/i,
          /(?:搜索|查找|寻找)(.+)/i,
          /(?:search|find|look for)(.+)/i,
        ],
        keywords: ["搜索", "查找", "search", "find"],
        synonyms: { 搜索: ["查找", "寻找"], search: ["find", "look for"] },
        priority: 8,
        category: "搜索功能",
        description: "搜索内容",
        examples: ['搜索"用户数据"', 'search for "sales report"'],
        parameters: [
          {
            name: "query",
            type: "string",
            required: true,
            description: "搜索关键词",
          },
        ],
      },

      // 帮助命令
      {
        id: "help_command",
        patterns: [/(?:帮助|指令|命令|说明|教程)/i, /(?:help|commands|instructions|tutorial)/i],
        keywords: ["帮助", "命令", "help", "commands"],
        synonyms: { 帮助: ["指令", "命令"], help: ["commands", "instructions"] },
        priority: 5,
        category: "系统帮助",
        description: "显示帮助信息",
        examples: ["帮助", "显示命令", "help", "show commands"],
      },

      // 系统控制命令
      {
        id: "system_control",
        patterns: [
          /(?:停止|结束|关闭|退出).*?(?:语音|识别|监听)?/i,
          /(?:stop|end|close|exit).*?(?:voice|recognition|listening)?/i,
        ],
        keywords: ["停止", "语音", "stop", "voice"],
        synonyms: { 停止: ["结束", "关闭"], 语音: ["识别", "监听"] },
        priority: 10,
        category: "系统控制",
        description: "系统控制命令",
        examples: ["停止语音识别", "结束监听", "stop listening"],
      },
    ]

    patterns.forEach((pattern) => this.registerPattern(pattern))
  }

  /**
   * 注册命令模式
   */
  registerPattern(pattern: CommandPattern): void {
    this.patterns.set(pattern.id, pattern)
  }

  /**
   * 批量注册命令模式
   */
  registerPatterns(patterns: CommandPattern[]): void {
    patterns.forEach((pattern) => this.registerPattern(pattern))
  }

  /**
   * 更新上下文
   */
  updateContext(context: Partial<VoiceContext>): void {
    this.context = { ...this.context, ...context }
  }

  /**
   * 文本预处理
   */
  private preprocessText(text: string): string {
    let processed = text.toLowerCase().trim()

    // 移除标点符号
    processed = processed.replace(/[，。！？；：""''（）【】《》]/g, " ")
    processed = processed.replace(/[,.!?;:"'()[\]<>]/g, " ")

    // 数字词汇转换
    for (const [word, number] of this.numberWords) {
      processed = processed.replace(new RegExp(word, "g"), number)
    }

    // 时间词汇转换
    for (const [word, time] of this.timeWords) {
      processed = processed.replace(new RegExp(word, "g"), time)
    }

    // 移除停用词
    const words = processed.split(/\s+/).filter((word) => word.length > 0 && !this.stopWords.has(word))

    return words.join(" ")
  }

  /**
   * 计算文本相似度
   */
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.split(/\s+/))
    const words2 = new Set(text2.split(/\s+/))

    const intersection = new Set([...words1].filter((x) => words2.has(x)))
    const union = new Set([...words1, ...words2])

    return intersection.size / union.size
  }

  /**
   * 关键词匹配评分
   */
  private calculateKeywordScore(text: string, keywords: string[]): number {
    const words = text.split(/\s+/)
    let score = 0

    keywords.forEach((keyword) => {
      if (words.includes(keyword.toLowerCase())) {
        score += 1
      }

      // 检查同义词
      const synonyms = this.synonymDict.get(keyword) || []
      synonyms.forEach((synonym) => {
        if (words.includes(synonym.toLowerCase())) {
          score += 0.8
        }
      })
    })

    return score / keywords.length
  }

  /**
   * 上下文相关性评分
   */
  private calculateContextScore(pattern: CommandPattern): number {
    if (!pattern.context || pattern.context.length === 0) {
      return 1 // 无上下文要求，默认满分
    }

    let score = 0
    pattern.context.forEach((contextKey) => {
      if (this.context[contextKey as keyof VoiceContext]) {
        score += 1
      }
    })

    return score / pattern.context.length
  }

  /**
   * 提取命令参数
   */
  private extractParameters(text: string, pattern: CommandPattern): { [key: string]: any } {
    const parameters: { [key: string]: any } = {}

    if (!pattern.parameters) return parameters

    pattern.parameters.forEach((param) => {
      switch (param.type) {
        case "number":
          const numberMatch = text.match(/\d+/)
          if (numberMatch) {
            parameters[param.name] = Number.parseInt(numberMatch[0])
          }
          break

        case "enum":
          if (param.values) {
            for (const value of param.values) {
              if (text.includes(value)) {
                parameters[param.name] = value
                break
              }
            }
          }
          break

        case "string":
          if (param.pattern) {
            const match = text.match(param.pattern)
            if (match) {
              parameters[param.name] = match[1] || match[0]
            }
          }
          break

        case "date":
          // 简单的日期提取
          const dateMatch = text.match(/(\d{4})-(\d{2})-(\d{2})/)
          if (dateMatch) {
            parameters[param.name] = new Date(dateMatch[0])
          }
          break
      }
    })

    return parameters
  }

  /**
   * 智能匹配命令
   */
  matchCommand(text: string): CommandMatch[] {
    const normalizedText = this.preprocessText(text)
    const matches: CommandMatch[] = []

    for (const [id, pattern] of this.patterns) {
      let confidence = 0
      let patternMatched = false

      // 正则表达式匹配
      for (const regex of pattern.patterns) {
        if (regex.test(text) || regex.test(normalizedText)) {
          confidence += 0.4
          patternMatched = true
          break
        }
      }

      // 关键词匹配
      const keywordScore = this.calculateKeywordScore(normalizedText, pattern.keywords)
      confidence += keywordScore * 0.3

      // 上下文相关性
      const contextScore = this.calculateContextScore(pattern)
      confidence += contextScore * 0.2

      // 优先级加权
      confidence += (pattern.priority / 10) * 0.1

      // 只有达到最低置信度才认为是有效匹配
      if (confidence > 0.3 || patternMatched) {
        const parameters = this.extractParameters(normalizedText, pattern)

        matches.push({
          pattern,
          confidence,
          parameters,
          originalText: text,
          normalizedText,
          context: this.context.currentPage,
        })
      }
    }

    // 按置信度排序
    return matches.sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * 获取最佳匹配
   */
  getBestMatch(text: string): CommandMatch | null {
    const matches = this.matchCommand(text)
    return matches.length > 0 ? matches[0] : null
  }

  /**
   * 获取所有注册的命令模式
   */
  getAllPatterns(): CommandPattern[] {
    return Array.from(this.patterns.values())
  }

  /**
   * 按类别获取命令模式
   */
  getPatternsByCategory(category: string): CommandPattern[] {
    return Array.from(this.patterns.values()).filter((p) => p.category === category)
  }

  /**
   * 获取命令统计信息
   */
  getStats() {
    const categories = new Map<string, number>()
    let totalPatterns = 0

    for (const pattern of this.patterns.values()) {
      totalPatterns++
      categories.set(pattern.category, (categories.get(pattern.category) || 0) + 1)
    }

    return {
      totalPatterns,
      categories: Object.fromEntries(categories),
      contextKeys: Object.keys(this.context),
      synonymsCount: this.synonymDict.size,
    }
  }
}

// 导出单例实例
export const voiceCommandEngine = new VoiceCommandEngine()

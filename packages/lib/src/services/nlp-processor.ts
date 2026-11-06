// ============================================================
// YYC³ · @yyc3/lib services 真身（lib services 真身批次 · 2026-11-06）
// 源（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/YYC-cloud-platform/lib/services/nlp-processor.ts
// ============================================================
"use client"

/**
 * ⟨YYC³⟩ 自然语言处理器
 * 提供文本分析、意图识别和实体提取功能
 */

export interface NLPResult {
  intent: string
  confidence: number
  entities: Entity[]
  sentiment: "positive" | "negative" | "neutral"
  keywords: string[]
  language: string
}

export interface Entity {
  type: "number" | "date" | "time" | "person" | "location" | "organization" | "chart_type" | "time_period" | "action"
  value: string
  start: number
  end: number
  confidence: number
}

export interface IntentPattern {
  intent: string
  patterns: string[]
  keywords: string[]
  entities: string[]
  examples: string[]
}

/**
 * 自然语言处理器类
 */
export class NLPProcessor {
  private intentPatterns: Map<string, IntentPattern> = new Map()
  private entityPatterns: Map<string, RegExp[]> = new Map()

  // 情感词典
  private positiveWords = new Set([
    "好",
    "棒",
    "优秀",
    "完美",
    "满意",
    "喜欢",
    "赞",
    "不错",
    "很好",
    "good",
    "great",
    "excellent",
    "perfect",
    "satisfied",
    "like",
    "awesome",
    "nice",
    "wonderful",
  ])

  private negativeWords = new Set([
    "差",
    "糟",
    "不好",
    "失望",
    "讨厌",
    "烂",
    "垃圾",
    "问题",
    "错误",
    "bad",
    "terrible",
    "awful",
    "disappointed",
    "hate",
    "horrible",
    "problem",
    "error",
    "wrong",
  ])

  constructor() {
    this.initializeIntentPatterns()
    this.initializeEntityPatterns()
  }

  /**
   * 初始化意图模式
   */
  private initializeIntentPatterns(): void {
    const patterns: IntentPattern[] = [
      {
        intent: "chart_control",
        patterns: ["切换图表", "改变图表", "显示图表", "change chart", "switch chart", "show chart"],
        keywords: ["图表", "切换", "显示", "chart", "switch", "show"],
        entities: ["chart_type"],
        examples: ["切换到柱状图", "switch to bar chart"],
      },
      {
        intent: "data_filter",
        patterns: ["筛选数据", "过滤数据", "查看数据", "filter data", "show data", "display data"],
        keywords: ["筛选", "过滤", "数据", "filter", "data", "show"],
        entities: ["time_period", "number"],
        examples: ["显示本周数据", "show this week data"],
      },
      {
        intent: "export_data",
        patterns: ["导出数据", "保存数据", "下载数据", "export data", "save data", "download data"],
        keywords: ["导出", "保存", "下载", "export", "save", "download"],
        entities: ["format"],
        examples: ["导出为PDF", "export as PDF"],
      },
      {
        intent: "voice_control",
        patterns: ["语音播报", "朗读数据", "说出数据", "speak data", "read data", "voice data"],
        keywords: ["语音", "播报", "朗读", "voice", "speak", "read"],
        entities: ["data_type"],
        examples: ["播报图表数据", "speak chart data"],
      },
      {
        intent: "navigation",
        patterns: ["打开页面", "跳转页面", "前往页面", "open page", "go to page", "navigate to"],
        keywords: ["打开", "跳转", "前往", "open", "go", "navigate"],
        entities: ["page_name"],
        examples: ["打开用户页面", "go to dashboard"],
      },
      {
        intent: "search",
        patterns: ["搜索内容", "查找内容", "寻找内容", "search for", "find content", "look for"],
        keywords: ["搜索", "查找", "寻找", "search", "find", "look"],
        entities: ["search_term"],
        examples: ["搜索用户数据", "search for user data"],
      },
      {
        intent: "help",
        patterns: ["帮助信息", "使用说明", "操作指南", "help information", "instructions", "guide"],
        keywords: ["帮助", "说明", "指南", "help", "instructions", "guide"],
        entities: [],
        examples: ["显示帮助", "show help"],
      },
    ]

    patterns.forEach((pattern) => {
      this.intentPatterns.set(pattern.intent, pattern)
    })
  }

  /**
   * 初始化实体模式
   */
  private initializeEntityPatterns(): void {
    const patterns = {
      number: [
        /\d+/g,
        /[一二三四五六七八九十百千万]+/g,
        /(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)/gi,
      ],
      date: [/\d{4}[-/]\d{1,2}[-/]\d{1,2}/g, /(?:今天|昨天|明天|后天|前天)/g, /(?:today|yesterday|tomorrow)/gi],
      time: [/\d{1,2}:\d{2}/g, /(?:上午|下午|中午|晚上|凌晨)/g, /(?:morning|afternoon|evening|night)/gi],
      chart_type: [
        /(?:柱状图|柱图|条形图|bar chart|column chart)/gi,
        /(?:折线图|线图|曲线图|line chart|curve chart)/gi,
        /(?:饼图|圆饼图|pie chart|donut chart)/gi,
        /(?:面积图|区域图|area chart)/gi,
        /(?:散点图|点图|scatter plot|dot chart)/gi,
        /(?:雷达图|蜘蛛图|radar chart|spider chart)/gi,
      ],
      time_period: [
        /(?:今天|昨天|明天|本周|上周|下周|本月|上月|下月|今年|去年|明年)/g,
        /(?:today|yesterday|tomorrow|this week|last week|next week|this month|last month|next month|this year|last year|next year)/gi,
        /(?:最近|过去|未来)(?:\d+)?(?:天|周|月|年)?/g,
        /(?:recent|past|future)\s*(?:\d+)?\s*(?:days?|weeks?|months?|years?)/gi,
      ],
      action: [
        /(?:切换|改为|换成|显示|展示|查看|打开)/g,
        /(?:switch|change|show|display|view|open)/gi,
        /(?:导出|保存|下载|输出)/g,
        /(?:export|save|download|output)/gi,
        /(?:播报|朗读|读出|说出)/g,
        /(?:speak|read|announce|say)/gi,
      ],
      page_name: [
        /(?:首页|主页|仪表板|控制台|dashboard|home)/gi,
        /(?:用户|用户管理|users|user management)/gi,
        /(?:设置|配置|settings|configuration)/gi,
        /(?:图表|数据可视化|charts|visualization)/gi,
        /(?:分析|数据分析|analytics|analysis)/gi,
        /(?:文件|文件管理|files|file management)/gi,
        /(?:搜索|查找|search)/gi,
      ],
    }

    Object.entries(patterns).forEach(([type, regexes]) => {
      this.entityPatterns.set(type, regexes)
    })
  }

  /**
   * 检测语言
   */
  private detectLanguage(text: string): string {
    const chineseChars = text.match(/[\u4e00-\u9fff]/g)
    const englishChars = text.match(/[a-zA-Z]/g)

    const chineseRatio = chineseChars ? chineseChars.length / text.length : 0
    const englishRatio = englishChars ? englishChars.length / text.length : 0

    if (chineseRatio > 0.3) return "zh-CN"
    if (englishRatio > 0.5) return "en-US"
    return "unknown"
  }

  /**
   * 提取实体
   */
  private extractEntities(text: string): Entity[] {
    const entities: Entity[] = []

    for (const [type, patterns] of this.entityPatterns) {
      for (const pattern of patterns) {
        let match
        while ((match = pattern.exec(text)) !== null) {
          entities.push({
            type: type as any,
            value: match[0],
            start: match.index,
            end: match.index + match[0].length,
            confidence: 0.8,
          })
        }
        pattern.lastIndex = 0 // 重置正则表达式
      }
    }

    // 去重和排序
    return entities
      .filter(
        (entity, index, self) => index === self.findIndex((e) => e.start === entity.start && e.end === entity.end),
      )
      .sort((a, b) => a.start - b.start)
  }

  /**
   * 识别意图
   */
  private recognizeIntent(text: string, entities: Entity[]): { intent: string; confidence: number } {
    const normalizedText = text.toLowerCase()
    let bestIntent = "unknown"
    let bestScore = 0

    for (const [intent, pattern] of this.intentPatterns) {
      let score = 0

      // 关键词匹配
      for (const keyword of pattern.keywords) {
        if (normalizedText.includes(keyword.toLowerCase())) {
          score += 1
        }
      }

      // 模式匹配
      for (const patternText of pattern.patterns) {
        if (normalizedText.includes(patternText.toLowerCase())) {
          score += 2
        }
      }

      // 实体匹配
      const entityTypes = entities.map((e) => e.type)
      for (const requiredEntity of pattern.entities) {
        if (entityTypes.includes(requiredEntity as any)) {
          score += 1.5
        }
      }

      // 计算置信度
      const maxScore = pattern.keywords.length + pattern.patterns.length * 2 + pattern.entities.length * 1.5
      const confidence = maxScore > 0 ? score / maxScore : 0

      if (confidence > bestScore) {
        bestScore = confidence
        bestIntent = intent
      }
    }

    return { intent: bestIntent, confidence: bestScore }
  }

  /**
   * 分析情感
   */
  private analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
    const words = text.toLowerCase().split(/\s+/)
    let positiveCount = 0
    let negativeCount = 0

    words.forEach((word) => {
      if (this.positiveWords.has(word)) {
        positiveCount++
      } else if (this.negativeWords.has(word)) {
        negativeCount++
      }
    })

    if (positiveCount > negativeCount) return "positive"
    if (negativeCount > positiveCount) return "negative"
    return "neutral"
  }

  /**
   * 提取关键词
   */
  private extractKeywords(text: string): string[] {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 1)

    // 简单的关键词提取（基于词频）
    const wordCount = new Map<string, number>()
    words.forEach((word) => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1)
    })

    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)
  }

  /**
   * 处理文本
   */
  process(text: string): NLPResult {
    const language = this.detectLanguage(text)
    const entities = this.extractEntities(text)
    const { intent, confidence } = this.recognizeIntent(text, entities)
    const sentiment = this.analyzeSentiment(text)
    const keywords = this.extractKeywords(text)

    return {
      intent,
      confidence,
      entities,
      sentiment,
      keywords,
      language,
    }
  }

  /**
   * 批量处理文本
   */
  batchProcess(texts: string[]): NLPResult[] {
    return texts.map((text) => this.process(text))
  }

  /**
   * 添加自定义意图模式
   */
  addIntentPattern(pattern: IntentPattern): void {
    this.intentPatterns.set(pattern.intent, pattern)
  }

  /**
   * 添加自定义实体模式
   */
  addEntityPattern(type: string, patterns: RegExp[]): void {
    this.entityPatterns.set(type, patterns)
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      intentCount: this.intentPatterns.size,
      entityTypeCount: this.entityPatterns.size,
      positiveWordsCount: this.positiveWords.size,
      negativeWordsCount: this.negativeWords.size,
    }
  }
}

// 导出单例实例
export const nlpProcessor = new NLPProcessor()

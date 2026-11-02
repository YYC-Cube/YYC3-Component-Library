// 内容分析结果接口
export interface ContentAnalysisResult {
  readabilityScore: number
  seoScore: number
  keywords: string[]
  suggestions: string[]
}

/**
 * 分析内容质量和SEO
 * @param content 要分析的内容
 * @param title 内容标题
 */
export async function analyzeContent(content: string, title: string): Promise<ContentAnalysisResult> {
  // 在实际应用中，这里会调用内容分析API或使用更复杂的算法
  // 这里仅做简单的模拟

  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // 提取关键词（简单实现）
  const keywords = extractKeywords(content, title)

  // 计算可读性评分（简单实现）
  const readabilityScore = calculateReadabilityScore(content)

  // 计算SEO评分（简单实现）
  const seoScore = calculateSeoScore(content, title, keywords)

  // 生成改进建议
  const suggestions = generateSuggestions(content, title, readabilityScore, seoScore)

  return {
    readabilityScore,
    seoScore,
    keywords,
    suggestions,
  }
}

/**
 * 提取关键词
 */
function extractKeywords(content: string, title: string): string[] {
  // 合并标题和内容
  const text = `${title} ${content}`.toLowerCase()

  // 移除标点符号和特殊字符
  const cleanText = text.replace(/[^\w\s\u4e00-\u9fa5]/g, " ")

  // 分词（简单实现，实际应用中应使用专业分词库）
  const words = cleanText.split(/\s+/)

  // 停用词（简单列表）
  const stopWords = [
    "的",
    "了",
    "是",
    "在",
    "我",
    "有",
    "和",
    "就",
    "不",
    "人",
    "都",
    "一",
    "一个",
    "上",
    "也",
    "很",
    "到",
    "说",
    "要",
    "去",
    "你",
    "会",
    "着",
    "没有",
    "看",
    "好",
    "自己",
    "这",
    "那",
    "这个",
    "那个",
    "这些",
    "那些",
    "the",
    "a",
    "an",
    "of",
    "to",
    "in",
    "is",
    "and",
    "for",
    "with",
    "on",
    "at",
    "by",
    "from",
    "as",
    "but",
    "or",
    "not",
    "be",
    "it",
    "this",
    "that",
    "these",
    "those",
    "are",
    "was",
    "were",
    "have",
    "has",
    "had",
    "can",
    "could",
    "will",
    "would",
    "should",
    "may",
    "might",
    "must",
  ]

  // 过滤停用词并计算词频
  const wordFreq: Record<string, number> = {}
  words.forEach((word) => {
    if (word.length > 1 && !stopWords.includes(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }
  })

  // 按词频排序并返回前10个关键词
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map((entry) => entry[0])
}

/**
 * 计算可读性评分
 */
function calculateReadabilityScore(content: string): number {
  // 简单的可读性评分算法（实际应用中应使用更复杂的算法）

  // 计算平均句子长度
  const sentences = content.split(/[。！？.!?]+/)
  const avgSentenceLength = content.length / Math.max(sentences.length, 1)

  // 计算平均段落长度
  const paragraphs = content.split(/\n\s*\n/)
  const avgParagraphLength = content.length / Math.max(paragraphs.length, 1)

  // 长句子比例（超过50个字符的句子）
  const longSentences = sentences.filter((s) => s.length > 50).length
  const longSentenceRatio = longSentences / Math.max(sentences.length, 1)

  // 计算可读性评分（简化版）
  // 理想的平均句子长度约为15-20个字符
  // 理想的平均段落长度约为200-300个字符
  // 长句子比例应该较低

  const sentenceLengthScore = Math.max(0, 100 - Math.abs(avgSentenceLength - 20) * 2)
  const paragraphLengthScore = Math.max(0, 100 - Math.abs(avgParagraphLength - 250) / 5)
  const longSentenceScore = Math.max(0, 100 - longSentenceRatio * 200)

  // 综合评分
  const readabilityScore = Math.round((sentenceLengthScore + paragraphLengthScore + longSentenceScore) / 3)

  return Math.min(100, Math.max(0, readabilityScore))
}

/**
 * 计算SEO评分
 */
function calculateSeoScore(content: string, title: string, keywords: string[]): number {
  // 简单的SEO评分算法（实际应用中应使用更复杂的算法）

  let score = 70 // 基础分

  // 标题长度评分（理想长度为10-60个字符）
  if (title.length >= 10 && title.length <= 60) {
    score += 5
  } else {
    score -= 5
  }

  // 内容长度评分（理想长度大于300个字符）
  if (content.length > 1000) {
    score += 10
  } else if (content.length > 500) {
    score += 5
  } else if (content.length < 300) {
    score -= 10
  }

  // 关键词在标题中的出现情况
  const titleLower = title.toLowerCase()
  const keywordInTitle = keywords.some((keyword) => titleLower.includes(keyword))
  if (keywordInTitle) {
    score += 5
  }

  // 关键词密度评分
  const contentLower = content.toLowerCase()
  let keywordDensity = 0

  keywords.forEach((keyword) => {
    const regex = new RegExp(keyword, "g")
    const matches = contentLower.match(regex)
    if (matches) {
      keywordDensity += matches.length
    }
  })

  keywordDensity = keywordDensity / (content.length / 100) // 每100个字符中的关键词出现次数

  // 理想的关键词密度为1-3%
  if (keywordDensity >= 1 && keywordDensity <= 3) {
    score += 10
  } else if (keywordDensity > 3 && keywordDensity <= 5) {
    score += 5
  } else if (keywordDensity > 5) {
    score -= 5 // 关键词堆砌惩罚
  }

  // 标题中是否包含数字（通常能提高点击率）
  if (/\d/.test(title)) {
    score += 5
  }

  return Math.min(100, Math.max(0, score))
}

/**
 * 生成改进建议
 */
function generateSuggestions(content: string, title: string, readabilityScore: number, seoScore: number): string[] {
  const suggestions: string[] = []

  // 标题相关建议
  if (title.length < 10) {
    suggestions.push("标题过短，建议扩展标题以更好地描述内容")
  } else if (title.length > 60) {
    suggestions.push("标题过长，建议精简标题以提高可读性")
  }

  if (!/\d/.test(title)) {
    suggestions.push("在标题中添加数字可以提高点击率")
  }

  if (!/[？?!！]/.test(title)) {
    suggestions.push("考虑在标题中使用问号或感叹号以增加吸引力")
  }

  // 内容长度相关建议
  if (content.length < 300) {
    suggestions.push("内容过短，建议扩展内容以提供更多价值")
  }

  // 可读性相关建议
  const sentences = content.split(/[。！？.!?]+/)
  const longSentences = sentences.filter((s) => s.length > 50).length

  if (longSentences > sentences.length * 0.3) {
    suggestions.push("文章中长句过多，建议将部分长句拆分为短句以提高可读性")
  }

  const paragraphs = content.split(/\n\s*\n/)
  const longParagraphs = paragraphs.filter((p) => p.length > 500).length

  if (longParagraphs > paragraphs.length * 0.3) {
    suggestions.push("文章中长段落过多，建议将部分长段落拆分为短段落以提高可读性")
  }

  // SEO相关建议
  if (seoScore < 70) {
    suggestions.push("考虑在内容中适当增加关键词的使用频率")
    suggestions.push("确保关键词出现在标题、第一段和最后一段中")
  }

  // 结构相关建议
  if (!content.includes("#") && !content.includes("##")) {
    suggestions.push("添加标题和子标题以改善内容结构")
  }

  if (!content.includes("-") && !content.includes("*") && !content.includes("1.")) {
    suggestions.push("使用列表格式来组织信息，提高可读性")
  }

  // 如果建议太少，添加一些通用建议
  if (suggestions.length < 3) {
    suggestions.push("考虑添加相关图片或多媒体内容以增强吸引力")
    suggestions.push("在文章结尾添加号召性用语，鼓励读者采取行动")
    suggestions.push("检查拼写和语法错误，确保内容专业性")
  }

  return suggestions.slice(0, 5) // 最多返回5条建议
}

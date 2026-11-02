/**
 * @file intentAnalyzer.ts
 * @description 智能路由意图分析器 — 分析用户首次消息语义，判断是否导航至布局设计器
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags utils, intent, analyzer, routing, ai
 */

export interface IntentAnalysisResult {
  shouldNavigateToLayoutDesigner: boolean;
  confidence: number;
  detectedKeywords: string[];
  userContext: string;
}

const designKeywords = [
  "设计", "布局", "界面", "UI", "UX", "页面",
  "layout", "design", "interface", "page", "screen",
];

const createKeywords = [
  "创建", "生成", "制作", "开发", "构建",
  "create", "generate", "build", "develop", "make",
];

export const analyzeIntent = (message: string): IntentAnalysisResult => {
  const lowerMessage = message.toLowerCase();
  const detectedKeywords: string[] = [];

  designKeywords.forEach((keyword) => {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      detectedKeywords.push(keyword);
    }
  });

  createKeywords.forEach((keyword) => {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      detectedKeywords.push(keyword);
    }
  });

  const confidence = Math.min(detectedKeywords.length * 0.3, 1.0);
  const shouldNavigateToLayoutDesigner = confidence >= 0.6;

  return {
    shouldNavigateToLayoutDesigner,
    confidence,
    detectedKeywords,
    userContext: message,
  };
};

/**
 * @file programmingDepthAnalyzer.ts
 * @description 编程深度分析器 — 持续监控对话深度，判断是否导航至AI交互工作台
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags utils, analyzer, depth, programming, routing
 */

interface MessageLike {
  content: string;
  role: string;
}

export interface ProgrammingDepthAnalysis {
  shouldNavigateToWorkbench: boolean;
  depth: "shallow" | "medium" | "deep";
  detectedTopics: string[];
  requiresFullScreen: boolean;
}

const deepProgrammingTopics = [
  "算法", "数据结构", "优化", "性能", "并发", "异步",
  "algorithm", "data structure", "optimization", "performance", "concurrency", "async",
];

const aiAssistanceTopics = [
  "AI", "机器学习", "深度学习", "模型", "训练",
  "machine learning", "deep learning", "model", "training",
];

const codeComplexityIndicators = [
  "类", "接口", "继承", "多态", "泛型", "装饰器",
  "class", "interface", "inheritance", "polymorphism", "generic", "decorator",
];

export const analyzeProgrammingDepth = (
  conversationHistory: MessageLike[]
): ProgrammingDepthAnalysis => {
  const detectedTopics: string[] = [];
  let depthScore = 0;

  conversationHistory.forEach((message) => {
    const lowerContent = message.content.toLowerCase();

    deepProgrammingTopics.forEach((topic) => {
      if (lowerContent.includes(topic.toLowerCase())) {
        if (!detectedTopics.includes(topic)) detectedTopics.push(topic);
        depthScore += 2;
      }
    });

    aiAssistanceTopics.forEach((topic) => {
      if (lowerContent.includes(topic.toLowerCase())) {
        if (!detectedTopics.includes(topic)) detectedTopics.push(topic);
        depthScore += 3;
      }
    });

    codeComplexityIndicators.forEach((indicator) => {
      if (lowerContent.includes(indicator.toLowerCase())) {
        if (!detectedTopics.includes(indicator)) detectedTopics.push(indicator);
        depthScore += 1;
      }
    });
  });

  let depth: "shallow" | "medium" | "deep" = "shallow";
  if (depthScore >= 10) {
    depth = "deep";
  } else if (depthScore >= 5) {
    depth = "medium";
  }

  const requiresFullScreen = depth === "deep" || depthScore >= 8;

  return {
    shouldNavigateToWorkbench: requiresFullScreen,
    depth,
    detectedTopics,
    requiresFullScreen,
  };
};

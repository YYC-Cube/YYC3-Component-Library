/**
 * @file programmingDepthAnalyzer.test.ts
 * @description 编程深度分析器单元测试 — 深度评分、主题检测、全屏导航决策
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, unit, programming-depth-analyzer
 */

import { describe, it, expect } from "vitest";
import { analyzeProgrammingDepth, type ProgrammingDepthAnalysis } from "../../utils/programmingDepthAnalyzer";

describe("analyzeProgrammingDepth", () => {
  /* ─── 深度评分 ─── */
  describe("深度评分", () => {
    it("空对话历史应返回 shallow", () => {
      const result = analyzeProgrammingDepth([]);
      expect(result.depth).toBe("shallow");
      expect(result.shouldNavigateToWorkbench).toBe(false);
    });

    it("普通对话应返回 shallow", () => {
      const result = analyzeProgrammingDepth([
        { content: "你好", role: "user" },
        { content: "你好！有什么可以帮你的？", role: "assistant" },
      ]);
      expect(result.depth).toBe("shallow");
    });

    it("包含深度编程主题应返回 medium 或 deep", () => {
      const result = analyzeProgrammingDepth([
        { content: "帮我优化这个算法的性能", role: "user" },
        { content: "这是一个关于并发异步处理的问题", role: "user" },
      ]);
      // "优化"(2) + "算法"(2) + "性能"(2) + "并发"(2) + "异步"(2) = 10 → deep
      expect(result.depth).toBe("deep");
      expect(result.shouldNavigateToWorkbench).toBe(true);
    });

    it("AI 相关主题应获得更高分", () => {
      const result = analyzeProgrammingDepth([
        { content: "我需要训练一个深度学习模型", role: "user" },
      ]);
      // "深度学习"(3) + "模型"(3) + "训练"(3) = 9 → deep
      expect(result.depth).toBe("deep");
    });

    it("代码复杂度指标应计入评分", () => {
      const result = analyzeProgrammingDepth([
        { content: "如何实现泛型接口的继承", role: "user" },
        { content: "还需要用到装饰器和多态", role: "user" },
      ]);
      // "泛型"(1) + "接口"(1) + "继承"(1) + "装饰器"(1) + "多态"(1) = 5 → medium
      expect(result.depth).toBe("medium");
    });

    it("medium 深度：评分 5-9 之间", () => {
      const result = analyzeProgrammingDepth([
        { content: "这个数据结构需要优化", role: "user" },
        { content: "使用泛型和接口来设计", role: "user" },
      ]);
      // "数据结构"(2) + "优化"(2) + "泛型"(1) + "接口"(1) = 6 → medium
      expect(result.depth).toBe("medium");
    });
  });

  /* ─── 主题检测 ─── */
  describe("主题检测", () => {
    it("应检测到深度编程主题", () => {
      const result = analyzeProgrammingDepth([
        { content: "讲讲算法和数据结构", role: "user" },
      ]);
      expect(result.detectedTopics).toContain("算法");
      expect(result.detectedTopics).toContain("数据结构");
    });

    it("应检测到英文主题", () => {
      const result = analyzeProgrammingDepth([
        { content: "explain algorithm and performance optimization", role: "user" },
      ]);
      expect(result.detectedTopics).toContain("algorithm");
      expect(result.detectedTopics).toContain("performance");
      expect(result.detectedTopics).toContain("optimization");
    });

    it("应检测到 AI 主题", () => {
      const result = analyzeProgrammingDepth([
        { content: "machine learning model training", role: "user" },
      ]);
      expect(result.detectedTopics).toContain("machine learning");
      expect(result.detectedTopics).toContain("model");
      expect(result.detectedTopics).toContain("training");
    });

    it("不应重复检测相同主题", () => {
      const result = analyzeProgrammingDepth([
        { content: "算法 算法 算法", role: "user" },
      ]);
      const algorithmCount = result.detectedTopics.filter((t) => t === "算法").length;
      expect(algorithmCount).toBe(1);
    });
  });

  /* ─── 全屏导航决策 ─── */
  describe("全屏导航决策", () => {
    it("深度为 deep 时应建议导航到工作台", () => {
      const result = analyzeProgrammingDepth([
        { content: "优化算法性能并发异步", role: "user" },
        { content: "需要使用机器学习模型", role: "user" },
      ]);
      expect(result.shouldNavigateToWorkbench).toBe(true);
      expect(result.requiresFullScreen).toBe(true);
    });

    it("深度为 shallow 时不应建议导航", () => {
      const result = analyzeProgrammingDepth([
        { content: "你好", role: "user" },
      ]);
      expect(result.shouldNavigateToWorkbench).toBe(false);
      expect(result.requiresFullScreen).toBe(false);
    });

    it("评分为 8 时即使 medium 也需要全屏", () => {
      // depthScore >= 8 → requiresFullScreen = true
      const result = analyzeProgrammingDepth([
        { content: "算法优化性能并发", role: "user" },
      ]);
      // "算法"(2) + "优化"(2) + "性能"(2) + "并发"(2) = 8
      expect(result.requiresFullScreen).toBe(true);
    });
  });

  /* ─── 边界条件 ─── */
  describe("边界条件", () => {
    it("空消息内容应安全处理", () => {
      const result = analyzeProgrammingDepth([
        { content: "", role: "user" },
      ]);
      expect(result.depth).toBe("shallow");
      expect(result.detectedTopics).toHaveLength(0);
    });

    it("大量消息历史应正常处理", () => {
      const messages = Array.from({ length: 100 }, (_, i) => ({
        content: `消息 ${i}: 讨论算法`,
        role: i % 2 === 0 ? "user" : "assistant",
      }));
      const result = analyzeProgrammingDepth(messages);
      expect(result).toBeDefined();
      expect(result.depth).toBeDefined();
    });

    it("不同角色的消息都应被分析", () => {
      const result = analyzeProgrammingDepth([
        { content: "算法", role: "user" },
        { content: "性能优化", role: "assistant" },
        { content: "并发", role: "system" },
      ]);
      expect(result.detectedTopics.length).toBeGreaterThan(0);
    });
  });
});

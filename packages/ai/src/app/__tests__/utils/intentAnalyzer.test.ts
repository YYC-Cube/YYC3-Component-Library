/**
 * @file intentAnalyzer.test.ts
 * @description 意图分析器单元测试 — 关键词检测、置信度计算、导航决策
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, unit, intent-analyzer
 */

import { describe, it, expect } from "vitest";
import { analyzeIntent, type IntentAnalysisResult } from "../../utils/intentAnalyzer";

describe("analyzeIntent", () => {
  /* ─── 关键词检测 ─── */
  describe("关键词检测", () => {
    it("应检测到中文设计关键词", () => {
      const result = analyzeIntent("我想设计一个新的界面");
      expect(result.detectedKeywords).toContain("设计");
      expect(result.detectedKeywords).toContain("界面");
    });

    it("应检测到英文设计关键词", () => {
      const result = analyzeIntent("I want to design a new page layout");
      expect(result.detectedKeywords).toContain("design");
      expect(result.detectedKeywords).toContain("page");
      expect(result.detectedKeywords).toContain("layout");
    });

    it("应检测到中文创建关键词", () => {
      const result = analyzeIntent("帮我创建一个布局");
      expect(result.detectedKeywords).toContain("创建");
      expect(result.detectedKeywords).toContain("布局");
    });

    it("应检测到英文创建关键词", () => {
      const result = analyzeIntent("create a new interface for the app");
      expect(result.detectedKeywords).toContain("create");
      expect(result.detectedKeywords).toContain("interface");
    });

    it("应支持大小写不敏感检测", () => {
      const result = analyzeIntent("DESIGN a new LAYOUT");
      expect(result.detectedKeywords).toContain("design");
      expect(result.detectedKeywords).toContain("layout");
    });

    it("无关消息不应检测到关键词", () => {
      const result = analyzeIntent("今天天气不错");
      expect(result.detectedKeywords).toHaveLength(0);
    });
  });

  /* ─── 置信度计算 ─── */
  describe("置信度计算", () => {
    it("无关键词时置信度应为 0", () => {
      const result = analyzeIntent("Hello world");
      expect(result.confidence).toBe(0);
    });

    it("单个关键词置信度应为 0.3", () => {
      const result = analyzeIntent("帮我设计");
      // "设计" 匹配 1 个关键词 → 0.3
      expect(result.confidence).toBeCloseTo(0.3, 1);
    });

    it("两个关键词置信度应为 0.6", () => {
      const result = analyzeIntent("设计一个页面");
      // "设计" + "页面" = 2 → 0.6
      expect(result.confidence).toBeCloseTo(0.6, 1);
    });

    it("置信度应封顶为 1.0", () => {
      const result = analyzeIntent("创建一个设计布局界面UI页面的UX screen");
      expect(result.confidence).toBeLessThanOrEqual(1.0);
    });
  });

  /* ─── 导航决策 ─── */
  describe("导航决策", () => {
    it("置信度 >= 0.6 时应建议导航到布局设计器", () => {
      const result = analyzeIntent("创建一个新的布局设计");
      expect(result.shouldNavigateToLayoutDesigner).toBe(true);
    });

    it("置信度 < 0.6 时不应建议导航", () => {
      const result = analyzeIntent("帮我写代码");
      expect(result.shouldNavigateToLayoutDesigner).toBe(false);
    });

    it("纯英文输入也应正确决策", () => {
      const result = analyzeIntent("build a new UI page layout");
      expect(result.shouldNavigateToLayoutDesigner).toBe(true);
    });
  });

  /* ─── 用户上下文 ─── */
  describe("用户上下文保留", () => {
    it("应保留原始消息作为 userContext", () => {
      const msg = "这是一条测试消息";
      const result = analyzeIntent(msg);
      expect(result.userContext).toBe(msg);
    });
  });

  /* ─── 边界条件 ─── */
  describe("边界条件", () => {
    it("空字符串应返回安全默认值", () => {
      const result = analyzeIntent("");
      expect(result.confidence).toBe(0);
      expect(result.shouldNavigateToLayoutDesigner).toBe(false);
      expect(result.detectedKeywords).toHaveLength(0);
    });

    it("超长文本应正常处理", () => {
      const longText = "设计 ".repeat(1000);
      const result = analyzeIntent(longText);
      expect(result.confidence).toBeLessThanOrEqual(1.0);
      expect(result.shouldNavigateToLayoutDesigner).toBe(false); // 只有 "设计" 一个关键词
    });

    it("特殊字符应不影响分析", () => {
      const result = analyzeIntent("设计<script>alert(1)</script>界面");
      expect(result.detectedKeywords).toContain("设计");
      expect(result.detectedKeywords).toContain("界面");
    });
  });
});

/**
 * @file inputValidation.test.ts
 * @description 安全测试 — XSS 防御、输入验证、边界条件、恶意数据注入
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, security, xss, validation, sanitization
 */

import { describe, it, expect } from "vitest";
import { analyzeIntent } from "../../utils/intentAnalyzer";
import { analyzeProgrammingDepth } from "../../utils/programmingDepthAnalyzer";

describe("安全测试 — 输入验证", () => {
  /* ─── XSS 防御 ─── */
  describe("XSS 防御", () => {
    const xssPayloads = [
      `<script>alert('xss')</script>`,
      `<img src=x onerror="alert(1)">`,
      `javascript:alert(1)`,
      `<svg onload="alert(1)">`,
      `" onclick="alert(1)" "`,
      `'); DROP TABLE users; --`,
      `<iframe src="evil.com"></iframe>`,
      `{{constructor.constructor('return this')()}}`,
    ];

    xssPayloads.forEach((payload) => {
      it(`analyzeIntent 应安全处理 XSS 载荷: ${payload.slice(0, 30)}...`, () => {
        expect(() => analyzeIntent(payload)).not.toThrow();
        const result = analyzeIntent(payload);
        expect(result).toBeDefined();
        expect(typeof result.confidence).toBe("number");
      });

      it(`analyzeProgrammingDepth 应安全处理 XSS 载荷: ${payload.slice(0, 30)}...`, () => {
        expect(() => analyzeProgrammingDepth([
          { content: payload, role: "user" },
        ])).not.toThrow();
      });
    });
  });

  /* ─── 边界长度 ─── */
  describe("边界长度", () => {
    it("应安全处理空字符串", () => {
      expect(() => analyzeIntent("")).not.toThrow();
      expect(() => analyzeProgrammingDepth([])).not.toThrow();
    });

    it("应安全处理极长字符串 (10KB)", () => {
      const longStr = "a".repeat(10240);
      expect(() => analyzeIntent(longStr)).not.toThrow();
    });

    it("应安全处理极长字符串 (100KB)", () => {
      const longStr = "算法优化".repeat(25600);
      expect(() => analyzeProgrammingDepth([
        { content: longStr, role: "user" },
      ])).not.toThrow();
    });

    it("应安全处理大量消息历史 (1000 条)", () => {
      const messages = Array.from({ length: 1000 }, (_, i) => ({
        content: `消息内容 ${i}`,
        role: "user",
      }));
      expect(() => analyzeProgrammingDepth(messages)).not.toThrow();
    });
  });

  /* ─── 特殊字符 ─── */
  describe("特殊字符", () => {
    const specialChars = [
      "\0", // null byte
      "\u200B", // zero-width space
      "\uFEFF", // BOM
      "\r\n", // CRLF
      "\t\t\t", // tabs
      "🎉🚀🔥", // emoji
      "أبجدية", // Arabic
      "日本語テスト", // Japanese
      "한국어시험", // Korean
    ];

    specialChars.forEach((char) => {
      it(`应安全处理特殊字符: ${JSON.stringify(char).slice(0, 20)}`, () => {
        expect(() => analyzeIntent(char)).not.toThrow();
      });
    });
  });

  /* ─── 原型污染防护 ─── */
  describe("原型污染防护", () => {
    it("不应受 __proto__ 注入影响", () => {
      const payload = `{"__proto__": {"polluted": true}}`;
      expect(() => analyzeIntent(payload)).not.toThrow();
    });

    it("不应受 constructor 注入影响", () => {
      const payload = `constructor.prototype.polluted = true`;
      expect(() => analyzeIntent(payload)).not.toThrow();
    });
  });

  /* ─── 数值溢出 ─── */
  describe("数值安全", () => {
    it("置信度不应为 NaN", () => {
      const result = analyzeIntent("random text");
      expect(Number.isNaN(result.confidence)).toBe(false);
    });

    it("置信度应在 [0, 1] 范围内", () => {
      // 测试各种输入
      const inputs = ["", "a", "设计", "设计布局界面UI页面创建生成制作开发构建"];
      inputs.forEach((input) => {
        const result = analyzeIntent(input);
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      });
    });

    it("深度评分不应产生无效值", () => {
      const result = analyzeProgrammingDepth([]);
      expect(["shallow", "medium", "deep"]).toContain(result.depth);
    });
  });
});

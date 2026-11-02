/**
 * @file taskInferenceService.test.ts
 * @description taskInferenceService 单元测试 — 文本/代码/对话任务提取、依赖推理
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-18
 * @updated 2026-03-18
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, taskInference, service
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  inferTasksFromText,
  inferTasksFromCode,
  inferTasksFromConversation,
  inferTasksFromDescription,
} from "../../services/taskInferenceService";
import { useTaskStore } from "../../stores/taskStore";

describe("taskInferenceService", () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [], pendingInferences: [] });
  });

  describe("inferTasksFromText", () => {
    it("extracts TODO comments", () => {
      const results = inferTasksFromText("TODO: implement login page");
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].task.title).toContain("implement login page");
      expect(results[0].task.type).toBe("feature");
    });

    it("extracts FIXME comments", () => {
      const results = inferTasksFromText("FIXME: memory leak in useEffect");
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].task.type).toBe("bug");
      expect(results[0].task.priority).toBe("high");
    });

    it("extracts Chinese keywords", () => {
      const results = inferTasksFromText("需要实现用户认证模块");
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].task.type).toBe("feature");
    });

    it("extracts multiple tasks from multi-line text", () => {
      const text = "TODO: add dark mode\nFIXME: button alignment issue\n优化渲染性能";
      const results = inferTasksFromText(text);
      expect(results.length).toBeGreaterThanOrEqual(3);
    });

    it("deduplicates similar entries", () => {
      const text = "TODO: fix login\nTODO: fix login";
      const results = inferTasksFromText(text);
      expect(results).toHaveLength(1);
    });

    it("ignores short matches < 3 chars", () => {
      const results = inferTasksFromText("TODO: ab");
      expect(results).toHaveLength(0);
    });

    it("returns empty for text without patterns", () => {
      const results = inferTasksFromText("This is a normal comment without any tasks.");
      expect(results).toHaveLength(0);
    });
  });

  describe("inferTasksFromCode", () => {
    it("extracts from code with TODO comments", () => {
      const code = `
        // TODO: refactor this function
        function getData() {
          // FIXME: handle error case
          return fetch('/api');
        }
      `;
      const results = inferTasksFromCode(code, "typescript");
      expect(results.length).toBeGreaterThanOrEqual(2);
      expect(results[0].confidence).toBe(0.85);
    });
  });

  describe("inferTasksFromConversation", () => {
    it("extracts tasks from conversation messages", () => {
      const messages = [
        { role: "user", content: "我需要实现一个登录功能" },
        { role: "assistant", content: "好的，我建议添加表单验证功能" },
        { role: "user", content: "还需要修复注册页面的样式问题" },
      ];
      const results = inferTasksFromConversation(messages);
      expect(results.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("inferTasksFromDescription", () => {
    it("creates single task for short description", () => {
      const results = inferTasksFromDescription("Add user authentication");
      expect(results).toHaveLength(1);
      expect(results[0].confidence).toBe(0.75);
    });

    it("splits multi-line description into tasks", () => {
      const results = inferTasksFromDescription("实现登录页面；添加注册功能；修复密码重置");
      expect(results).toHaveLength(3);
      expect(results[0].confidence).toBe(0.65);
    });
  });
});

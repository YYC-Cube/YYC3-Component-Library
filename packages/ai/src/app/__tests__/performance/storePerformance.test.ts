/**
 * @file storePerformance.test.ts
 * @description 性能测试 — Store 操作响应时间、大批量数据处理、内存增长监控
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, performance, benchmark, store
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useLayoutStore } from "../../stores/layoutStore";
import { usePreviewStore } from "../../stores/previewStore";
import { useNotificationStore } from "../../stores/notificationStore";
import { analyzeIntent } from "../../utils/intentAnalyzer";
import { analyzeProgrammingDepth } from "../../utils/programmingDepthAnalyzer";

describe("性能测试", () => {
  beforeEach(() => {
    useLayoutStore.getState().applyDefaultLayout();
  });

  /* ─── Store 操作性能 ─── */
  describe("Store 操作性能", () => {
    it("创建 50 个面板应在 500ms 内完成", () => {
      const start = performance.now();
      for (let i = 0; i < 50; i++) {
        useLayoutStore.getState().createPanel("code-editor", `编辑器 ${i}`);
      }
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(500);
    });

    it("创建 200 个 Tab 应在 500ms 内完成", () => {
      const panelId = Object.keys(useLayoutStore.getState().panels)[0];
      const start = performance.now();
      for (let i = 0; i < 200; i++) {
        useLayoutStore.getState().createTab(panelId, "code-editor", `Tab ${i}`);
      }
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(500);
    });

    it("连续 100 次代码更新应在 200ms 内完成", () => {
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        usePreviewStore.getState().setCode(`<div>更新 ${i}</div>`, "html");
      }
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(200);
    });

    it("添加 500 条通知应在 500ms 内完成", () => {
      const start = performance.now();
      for (let i = 0; i < 500; i++) {
        useNotificationStore.getState().addNotification({
          type: "info",
          title: `通知 ${i}`,
          message: "性能测试消息",
        });
      }
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(500);
    });
  });

  /* ─── 分析器性能 ─── */
  describe("分析器性能", () => {
    it("analyzeIntent 单次调用应在 5ms 内完成", () => {
      const start = performance.now();
      analyzeIntent("我需要设计一个新的用户界面布局，包含多个面板和拖拽功能");
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(5);
    });

    it("analyzeIntent 1000 次调用应在 100ms 内完成", () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        analyzeIntent(`测试消息 ${i} 设计布局界面`);
      }
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(100);
    });

    it("analyzeProgrammingDepth 处理 100 条消息应在 50ms 内完成", () => {
      const messages = Array.from({ length: 100 }, (_, i) => ({
        content: `关于算法优化和性能调优的深度讨论第 ${i} 轮，涉及数据结构和并发`,
        role: "user",
      }));
      const start = performance.now();
      analyzeProgrammingDepth(messages);
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(50);
    });
  });

  /* ─── 布局导出/导入性能 ─── */
  describe("布局导出/导入性能", () => {
    it("导出大布局应在 50ms 内完成", () => {
      // 先创建一些面板
      for (let i = 0; i < 20; i++) {
        useLayoutStore.getState().createPanel("code-editor", `编辑器 ${i}`);
      }
      const start = performance.now();
      const json = useLayoutStore.getState().exportLayout();
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(50);
      expect(json.length).toBeGreaterThan(0);
    });

    it("导入大布局应在 50ms 内完成", () => {
      for (let i = 0; i < 20; i++) {
        useLayoutStore.getState().createPanel("code-editor", `编辑器 ${i}`);
      }
      const json = useLayoutStore.getState().exportLayout();

      const start = performance.now();
      useLayoutStore.getState().importLayout(json);
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(50);
    });
  });

  /* ─── 内存增长 ─── */
  describe("内存增长检查", () => {
    it("大量面板创建/删除不应导致面板泄漏", () => {
      const initialCount = Object.keys(useLayoutStore.getState().panels).length;

      // 创建 30 个面板
      const ids: string[] = [];
      for (let i = 0; i < 30; i++) {
        ids.push(useLayoutStore.getState().createPanel("code-editor"));
      }

      // 删除所有新创建的面板
      ids.forEach((id) => useLayoutStore.getState().removePanel(id));

      const finalCount = Object.keys(useLayoutStore.getState().panels).length;
      // 删除后应回到初始面板数（至少保留一个）
      expect(finalCount).toBeLessThanOrEqual(initialCount);
    });

    it("大量 Tab 创建/关闭不应导致 Tab 泄漏", () => {
      const panelId = Object.keys(useLayoutStore.getState().panels)[0];
      const initialTabCount = Object.keys(useLayoutStore.getState().tabs).length;

      // 创建 50 个 Tab
      const tabIds: string[] = [];
      for (let i = 0; i < 50; i++) {
        const tabId = useLayoutStore.getState().createTab(panelId, "code-editor", `Tab ${i}`);
        tabIds.push(tabId);
      }

      // 关闭所有新 Tab
      tabIds.forEach((id) => useLayoutStore.getState().closeTab(id));

      const finalTabCount = Object.keys(useLayoutStore.getState().tabs).length;
      expect(finalTabCount).toBeLessThanOrEqual(initialTabCount);
    });
  });
});

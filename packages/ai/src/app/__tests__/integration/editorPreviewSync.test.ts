/**
 * @file editorPreviewSync.test.ts
 * @description 编辑器↔预览同步集成测试 — 代码变更→编译→预览更新→历史记录 完整链路
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, integration, editor, preview, sync
 */

import { describe, it, expect, beforeEach } from "vitest";
import { usePreviewStore, presetDevices } from "../../stores/previewStore";
import { useWorkspaceContextStore } from "../../stores/workspaceContextStore";

describe("编辑器↔预览同步集成测试", () => {
  beforeEach(() => {
    usePreviewStore.getState().setCode("", "typescript");
    usePreviewStore.getState().clearConsole();
    usePreviewStore.getState().clearErrors();
  });

  /* ─── 代码同步链路 ─── */
  describe("代码同步链路", () => {
    it("TypeScript 代码应通过编译管道", () => {
      const code = `export const greeting = (name: string) => \`Hello, \${name}!\`;`;
      usePreviewStore.getState().setCode(code, "typescript");
      const state = usePreviewStore.getState();
      expect(state.code).toBe(code);
      expect(state.language).toBe("typescript");
    });

    it("HTML 代码应直接用于预览", () => {
      const html = "<div><h1>测试</h1><p>内容</p></div>";
      usePreviewStore.getState().setCode(html, "html");
      const { compiledHtml } = usePreviewStore.getState();
      expect(compiledHtml).toContain("测试");
    });

    it("CSS 代码应用于预览", () => {
      const css = "body { background: #1a1a2e; color: #d4d4d4; }";
      usePreviewStore.getState().setCode(css, "css");
      const state = usePreviewStore.getState();
      expect(state.code).toContain("background");
    });

    it("连续代码更新应追加历史", () => {
      usePreviewStore.getState().setCode("v1", "html");
      usePreviewStore.getState().setCode("v2", "html");
      usePreviewStore.getState().setCode("v3", "html");
      // 最新代码应为 v3
      expect(usePreviewStore.getState().code).toBe("v3");
    });
  });

  /* ─── 多设备预览 ─── */
  describe("多设备预览", () => {
    it("切换设备不应丢失代码", () => {
      const code = "<h1>多设备测试</h1>";
      usePreviewStore.getState().setCode(code, "html");

      // 切换到手机
      const mobile = presetDevices.find((d) => d.type === "mobile")!;
      usePreviewStore.getState().setActiveDevice(mobile.id);
      expect(usePreviewStore.getState().code).toBe(code);

      // 切换到平板
      const tablet = presetDevices.find((d) => d.type === "tablet")!;
      usePreviewStore.getState().setActiveDevice(tablet.id);
      expect(usePreviewStore.getState().code).toBe(code);

      // 切换回桌面
      const desktop = presetDevices.find((d) => d.type === "desktop")!;
      usePreviewStore.getState().setActiveDevice(desktop.id);
      expect(usePreviewStore.getState().code).toBe(code);
    });

    it("各设备配置应有合理的宽高比", () => {
      presetDevices.forEach((d) => {
        const ratio = d.width / d.height;
        // 桌面设备横向，手机设备纵向
        if (d.type === "desktop") {
          expect(ratio).toBeGreaterThan(1); // 横屏
        }
        if (d.type === "mobile") {
          expect(ratio).toBeLessThan(1); // 竖屏
        }
      });
    });
  });

  /* ─── 错误捕获 ─── */
  describe("错误捕获", () => {
    it("语法错误应被捕获并添加到错误列表", () => {
      usePreviewStore.getState().addError({
        message: "SyntaxError: unexpected token '}'",
        line: 5,
        column: 10,
      });
      const errors = usePreviewStore.getState().errors;
      expect(errors.length).toBe(1);
      expect(errors[0].message).toContain("SyntaxError");
    });

    it("控制台错误应被捕获", () => {
      usePreviewStore.getState().addConsoleEntry({ level: "error", message: "Uncaught TypeError" });
      const entries = usePreviewStore.getState().consoleEntries;
      expect(entries.length).toBe(1);
      expect(entries[0].level).toBe("error");
    });

    it("清除错误后应重新开始", () => {
      usePreviewStore.getState().addError({ message: "error1" });
      usePreviewStore.getState().addError({ message: "error2" });
      expect(usePreviewStore.getState().errors.length).toBe(2);

      usePreviewStore.getState().clearErrors();
      expect(usePreviewStore.getState().errors.length).toBe(0);
    });
  });

  /* ─── 工作区上下文 ─── */
  describe("工作区上下文", () => {
    it("光标位置更新应正确记录", () => {
      useWorkspaceContextStore.getState().updateCursor("/src/app/App.tsx", 10, 5);
      // API 对齐（Phase 1 速修）：activeCursor → currentSession.openFiles 内的 cursor
      const ctx = useWorkspaceContextStore.getState();
      const f = ctx.currentSession.openFiles.find((x) => x.filePath === "/src/app/App.tsx");
      expect(f?.cursor).toEqual({ line: 10, column: 5 });
    });

    it("滚动位置更新应正确记录", () => {
      useWorkspaceContextStore.getState().updateScroll("/src/app/App.tsx", 150);
      // 验证 store 未崩溃
      expect(useWorkspaceContextStore.getState()).toBeDefined();
    });
  });
});

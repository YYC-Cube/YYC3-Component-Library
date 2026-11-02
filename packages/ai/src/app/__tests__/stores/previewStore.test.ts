/**
 * @file previewStore.test.ts
 * @description 预览引擎状态管理单元测试 — 设备切换、代码同步、控制台、历史
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, unit, preview-store, device, sandbox
 */

import { describe, it, expect, beforeEach } from "vitest";
import { usePreviewStore, presetDevices, type PreviewMode } from "../../stores/previewStore";

describe("previewStore", () => {
  beforeEach(() => {
    const store = usePreviewStore.getState();
    store.setCode("", "typescript");
    store.clearConsole();
    store.clearErrors();
  });

  /* ─── 代码同步 ─── */
  describe("代码同步", () => {
    it("setCode 应更新代码和语言", () => {
      usePreviewStore.getState().setCode("<h1>Hello</h1>", "html");
      const state = usePreviewStore.getState();
      expect(state.code).toBe("<h1>Hello</h1>");
      expect(state.language).toBe("html");
    });

    it("setCode 应更新编译后的 HTML", () => {
      usePreviewStore.getState().setCode("<div>Test</div>", "html");
      const { compiledHtml } = usePreviewStore.getState();
      expect(compiledHtml).toContain("Test");
    });
  });

  /* ─── 设备配置 ─── */
  describe("设备配置", () => {
    it("presetDevices 应包含桌面、平板、手机设备", () => {
      const types = presetDevices.map((d) => d.type);
      expect(types).toContain("desktop");
      expect(types).toContain("tablet");
      expect(types).toContain("mobile");
    });

    it("所有预设设备应有有效尺寸", () => {
      presetDevices.forEach((d) => {
        expect(d.width).toBeGreaterThan(0);
        expect(d.height).toBeGreaterThan(0);
        expect(d.pixelRatio).toBeGreaterThan(0);
      });
    });

    it("setDevice 应切换当前设备", () => {
      const target = presetDevices.find((d) => d.type === "mobile")!;
      usePreviewStore.getState().setDevice(target);
      expect(usePreviewStore.getState().currentDevice.id).toBe(target.id);
    });
  });

  /* ─── 预览模式 ─── */
  describe("预览模式", () => {
    const modes: PreviewMode[] = ["realtime", "manual", "delayed"];

    modes.forEach((mode) => {
      it(`setPreviewMode("${mode}") 应切换预览模式`, () => {
        usePreviewStore.getState().setPreviewMode(mode);
        expect(usePreviewStore.getState().previewMode).toBe(mode);
      });
    });
  });

  /* ─── 控制台 ─── */
  describe("控制台", () => {
    it("addConsoleEntry 应添加控制台条目", () => {
      usePreviewStore.getState().addConsoleEntry("log", "test message");
      const entries = usePreviewStore.getState().consoleEntries;
      expect(entries.length).toBe(1);
      expect(entries[0].message).toBe("test message");
      expect(entries[0].level).toBe("log");
    });

    it("clearConsole 应清空控制台", () => {
      usePreviewStore.getState().addConsoleEntry("log", "msg1");
      usePreviewStore.getState().addConsoleEntry("error", "msg2");
      usePreviewStore.getState().clearConsole();
      expect(usePreviewStore.getState().consoleEntries.length).toBe(0);
    });

    it("应支持不同级别的控制台消息", () => {
      const levels = ["log", "warn", "error", "info"] as const;
      levels.forEach((level) => {
        usePreviewStore.getState().addConsoleEntry(level, `${level} message`);
      });
      const entries = usePreviewStore.getState().consoleEntries;
      expect(entries.length).toBe(levels.length);
    });
  });

  /* ─── 错误处理 ─── */
  describe("错误处理", () => {
    it("addError 应添加预览错误", () => {
      usePreviewStore.getState().addError({
        message: "SyntaxError: unexpected token",
        line: 10,
        column: 5,
      });
      const errors = usePreviewStore.getState().errors;
      expect(errors.length).toBe(1);
      expect(errors[0].message).toContain("SyntaxError");
      expect(errors[0].line).toBe(10);
    });

    it("clearErrors 应清空错误列表", () => {
      usePreviewStore.getState().addError({ message: "error1" });
      usePreviewStore.getState().addError({ message: "error2" });
      usePreviewStore.getState().clearErrors();
      expect(usePreviewStore.getState().errors.length).toBe(0);
    });
  });

  /* ─── 滚动同步 ─── */
  describe("滚动同步", () => {
    it("syncEditorScroll 应更新编辑器滚动位置", () => {
      usePreviewStore.getState().syncEditorScroll(100);
      expect(usePreviewStore.getState().editorScrollTop).toBe(100);
    });
  });
});

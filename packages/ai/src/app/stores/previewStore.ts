/**
 * @file previewStore.ts
 * @description 实时预览引擎 Zustand 状态管理 — 设备模拟、代码编译管道、同步、历史
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, preview, engine, sandbox, device, sync
 */

import { create } from "zustand";

/* ─── 类型定义 ─── */
export type PreviewMode = "realtime" | "manual" | "delayed";

export interface DeviceConfig {
  id: string;
  name: string;
  type: "desktop" | "tablet" | "mobile" | "custom";
  width: number;
  height: number;
  pixelRatio: number;
}

export interface ConsoleEntry {
  id: string;
  level: "log" | "warn" | "error" | "info";
  message: string;
  timestamp: number;
  source?: string;
}

export interface PreviewError {
  message: string;
  line?: number;
  column?: number;
  stack?: string;
  timestamp: number;
}

export interface PreviewHistory {
  id: string;
  code: string;
  timestamp: number;
  label?: string;
}

/* ─── 预设设备 ─── */
export const presetDevices: DeviceConfig[] = [
  { id: "desktop-1440", name: "桌面 1440p", type: "desktop", width: 1440, height: 900, pixelRatio: 1 },
  { id: "desktop-1280", name: "桌面 1280", type: "desktop", width: 1280, height: 800, pixelRatio: 1 },
  { id: "ipad-pro", name: "iPad Pro", type: "tablet", width: 1024, height: 1366, pixelRatio: 2 },
  { id: "ipad-mini", name: "iPad Mini", type: "tablet", width: 768, height: 1024, pixelRatio: 2 },
  { id: "iphone-15", name: "iPhone 15", type: "mobile", width: 393, height: 852, pixelRatio: 3 },
  { id: "iphone-se", name: "iPhone SE", type: "mobile", width: 375, height: 667, pixelRatio: 2 },
  { id: "pixel-7", name: "Pixel 7", type: "mobile", width: 412, height: 915, pixelRatio: 2.625 },
];

/* ─── Store 接口 ─── */
interface PreviewStore {
  /* 状态 */
  code: string;
  language: string;
  compiledHtml: string;
  previewMode: PreviewMode;
  activeDeviceId: string;
  parallelDeviceIds: string[];
  isParallelMode: boolean;
  showGrid: boolean;
  showConsole: boolean;
  consoleEntries: ConsoleEntry[];
  errors: PreviewError[];
  history: PreviewHistory[];
  historyIndex: number;
  scrollSync: boolean;
  editorScrollTop: number;
  previewScrollTop: number;
  isCompiling: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  lastRefreshTime: number;

  /* 操作 */
  setCode: (code: string, language?: string) => void;
  compileAndRender: () => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setActiveDevice: (deviceId: string) => void;
  toggleParallelMode: () => void;
  setParallelDevices: (ids: string[]) => void;
  toggleGrid: () => void;
  toggleConsole: () => void;
  addConsoleEntry: (entry: Omit<ConsoleEntry, "id" | "timestamp">) => void;
  clearConsole: () => void;
  addError: (error: Omit<PreviewError, "timestamp">) => void;
  clearErrors: () => void;
  setScrollSync: (sync: boolean) => void;
  syncEditorScroll: (top: number) => void;
  syncPreviewScroll: (top: number) => void;
  undo: () => void;
  redo: () => void;
  refresh: () => void;
  setAutoRefresh: (auto: boolean) => void;
}

/* ─── HTML 编译管道 ─── */
function compileCode(code: string, language: string): string {
  const escapedCode = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (language === "html") {
    return code; // 直接渲染
  }

  if (language === "css") {
    return `<!DOCTYPE html>
<html><head><style>${code}</style></head>
<body>
  <div class="preview-container">
    <h1>CSS 预览</h1>
    <p>样式已应用到此页面</p>
    <div class="box">示例容器</div>
    <button>按钮</button>
    <input placeholder="输入框" />
  </div>
</body></html>`;
  }

  if (language === "markdown") {
    const html = code
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br/>");
    return `<!DOCTYPE html>
<html><head><style>
  body { font-family: -apple-system, sans-serif; padding: 20px; color: #e0e0e0; background: #1a1a2e; }
  h1, h2, h3 { color: #00ff87; } code { background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; }
</style></head><body>${html}</body></html>`;
  }

  // TypeScript / JavaScript / React — 显示语法高亮的代码块
  return `<!DOCTYPE html>
<html><head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #1e1e2e; color: #d4d4d4; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 13px; padding: 16px; }
  .line { line-height: 20px; white-space: pre; }
  .keyword { color: #c586c0; } .string { color: #ce9178; } .comment { color: #6a9955; }
  .type { color: #4ec9b0; } .number { color: #b5cea8; } .func { color: #dcdcaa; }
  .react-preview { margin-top: 24px; padding: 16px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); }
  .react-preview h2 { color: #00ff87; font-size: 16px; margin-bottom: 8px; }
  .react-preview p { color: rgba(255,255,255,0.5); font-size: 12px; font-family: -apple-system, sans-serif; }
</style>
</head><body>
<div>${escapedCode.split("\n").map((l: string, i: number) =>
    `<div class="line">${l}</div>`
  ).join("")}</div>
<div class="react-preview">
  <h2>YYC³ 组件预览</h2>
  <p>React 组件将在此区域实时渲染</p>
</div>
</body></html>`;
}

/* ─── Store 实现 ─── */
const defaultCode = `import React from "react";

export default function App() {
  return (
    <div className="container">
      <h1>Hello YYC³ Family AI</h1>
      <p>实时预览已就绪</p>
    </div>
  );
}`;

export const usePreviewStore = create<PreviewStore>()((set, get) => ({
  code: defaultCode,
  language: "typescript",
  compiledHtml: compileCode(defaultCode, "typescript"),
  previewMode: "realtime",
  activeDeviceId: "desktop-1440",
  parallelDeviceIds: ["desktop-1440", "ipad-pro", "iphone-15"],
  isParallelMode: false,
  showGrid: false,
  showConsole: false,
  consoleEntries: [],
  errors: [],
  history: [{ id: "h0", code: defaultCode, timestamp: Date.now() }],
  historyIndex: 0,
  scrollSync: true,
  editorScrollTop: 0,
  previewScrollTop: 0,
  isCompiling: false,
  autoRefresh: true,
  refreshInterval: 300,
  lastRefreshTime: Date.now(),

  setCode: (code, language) => {
    const lang = language || get().language;
    const newHistory = [
      ...get().history.slice(0, get().historyIndex + 1),
      { id: crypto.randomUUID().slice(0, 8), code, timestamp: Date.now() },
    ];
    set({
      code,
      language: lang,
      history: newHistory.slice(-50),
      historyIndex: newHistory.length - 1,
    });
    if (get().previewMode === "realtime") {
      get().compileAndRender();
    }
  },

  compileAndRender: () => {
    set({ isCompiling: true });
    const { code, language } = get();
    try {
      const compiled = compileCode(code, language);
      set({
        compiledHtml: compiled,
        isCompiling: false,
        lastRefreshTime: Date.now(),
      });
      get().addConsoleEntry({ level: "info", message: `编译成功 (${language})`, source: "compiler" });
    } catch (err: any) {
      set({ isCompiling: false });
      get().addError({ message: err.message || "编译失败" });
      get().addConsoleEntry({ level: "error", message: err.message || "编译失败", source: "compiler" });
    }
  },

  setPreviewMode: (mode) => set({ previewMode: mode }),
  setActiveDevice: (deviceId) => set({ activeDeviceId: deviceId }),
  toggleParallelMode: () => set((s) => ({ isParallelMode: !s.isParallelMode })),
  setParallelDevices: (ids) => set({ parallelDeviceIds: ids }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleConsole: () => set((s) => ({ showConsole: !s.showConsole })),

  addConsoleEntry: (entry) =>
    set((s) => ({
      consoleEntries: [
        ...s.consoleEntries.slice(-200),
        { ...entry, id: crypto.randomUUID().slice(0, 8), timestamp: Date.now() },
      ],
    })),

  clearConsole: () => set({ consoleEntries: [] }),

  addError: (error) =>
    set((s) => ({
      errors: [...s.errors.slice(-50), { ...error, timestamp: Date.now() }],
    })),

  clearErrors: () => set({ errors: [] }),
  setScrollSync: (sync) => set({ scrollSync: sync }),
  syncEditorScroll: (top) => set({ editorScrollTop: top }),
  syncPreviewScroll: (top) => set({ previewScrollTop: top }),

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({ historyIndex: newIndex, code: history[newIndex].code });
      get().compileAndRender();
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({ historyIndex: newIndex, code: history[newIndex].code });
      get().compileAndRender();
    }
  },

  refresh: () => get().compileAndRender(),
  setAutoRefresh: (auto) => set({ autoRefresh: auto }),
}));

/**
 * @file CodeEditorPanel.tsx
 * @description 代码编辑器面板 v6.0 — Monaco 多文件 Tab + TypeScript 类型检查 + 预览同步 + 协同
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v6.0.0
 * @created 2026-03-14
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, code-editor, monaco, multi-file, typescript-diagnostics, tabs
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import Editor, { type OnMount, type OnChange, useMonaco } from "@monaco-editor/react";
import {
  Link2, Link2Off, Eye, Users, LoaderCircle, X, FileCode, Hash,
  FileText, CircleAlert, TriangleAlert, Info, Plus, ChevronDown,
} from "lucide-react";
import { type Tab } from "../../../stores/layoutStore";
import { usePreviewStore } from "../../../stores/previewStore";
import { useWorkspaceContextStore } from "../../../stores/workspaceContextStore";
import { useCollaborationStore } from "../../../stores/collaborationStore";
import { BreadcrumbBar } from "../BreadcrumbBar";

/* ─── 虚拟文件系统 ─── */
interface VirtualFile {
  path: string;
  name: string;
  language: string;
  content: string;
  isModified: boolean;
  savedContent: string;
}

const defaultFiles: VirtualFile[] = [
  {
    path: "/src/app/App.tsx", name: "App.tsx", language: "typescript",
    isModified: false,
    content: `/**
 * @file App.tsx
 * @description Root application component — YYC³ AI Code
 */

import React from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";

interface AppConfig {
  theme: "dark" | "light";
  locale: string;
}

const defaultConfig: AppConfig = {
  theme: "dark",
  locale: "zh-CN",
};

function App() {
  const [config, setConfig] = React.useState<AppConfig>(defaultConfig);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" theme={config.theme} />
    </>
  );
}

export default App;`,
    savedContent: "",
  },
  {
    path: "/src/app/routes.ts", name: "routes.ts", language: "typescript",
    isModified: false,
    content: `/**
 * @file routes.ts
 * @description Application routing configuration
 */

import { createBrowserRouter } from "react-router";

interface RouteConfig {
  path: string;
  title: string;
  requiresAuth: boolean;
}

const routeConfigs: RouteConfig[] = [
  { path: "/", title: "首页", requiresAuth: false },
  { path: "/workbench", title: "工作台", requiresAuth: true },
  { path: "/settings", title: "设置", requiresAuth: true },
];

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./pages/HomePage"),
  },
  {
    path: "/workbench",
    lazy: () => import("./pages/WorkbenchPage"),
  },
]);`,
    savedContent: "",
  },
  {
    path: "/src/styles/theme.css", name: "theme.css", language: "css",
    isModified: false,
    content: `/* ═══ YYC³ Design Tokens ═══ */

:root {
  --color-primary: #00ff87;
  --color-secondary: #60efff;
  --color-accent: #a855f7;
  --color-warning: #ffb86c;
  --color-error: #ff6b6b;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  --bg-base: #0a0a12;
  --bg-surface: #14142a;
  --bg-elevated: #1e1e38;
}

.aurora-bg {
  background: linear-gradient(
    135deg,
    var(--bg-base),
    var(--bg-surface),
    var(--bg-elevated)
  );
}`,
    savedContent: "",
  },
  {
    path: "/src/app/types.ts", name: "types.ts", language: "typescript",
    isModified: false,
    content: `/**
 * @file types.ts
 * @description Shared type definitions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "editor" | "viewer";
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: User;
  members: User[];
  language: string;
  framework: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
  size?: number;
  language?: string;
}

export type ThemeMode = "dark" | "light" | "system";

export interface AppSettings {
  theme: ThemeMode;
  locale: string;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  autoSave: boolean;
  autoSaveDelay: number;
}`,
    savedContent: "",
  },
  {
    path: "/src/app/utils.ts", name: "utils.ts", language: "typescript",
    isModified: false,
    content: `/**
 * @file utils.ts
 * @description Common utility functions
 */

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  limit: number
): T {
  let inThrottle = false;
  return ((...args: any[]) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  }) as T;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function generateId(length: number = 8): string {
  return crypto.randomUUID().slice(0, length);
}

export function classNames(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}`,
    savedContent: "",
  },
];

/* ─── 诊断类型 ─── */
interface Diagnostic {
  file: string;
  line: number;
  column: number;
  message: string;
  severity: "error" | "warning" | "info";
  code?: string;
}

/* ─── 语言映射 ─── */
const getMonacoLang = (fileName: string): string => {
  if (fileName.endsWith(".css")) return "css";
  if (fileName.endsWith(".html")) return "html";
  if (fileName.endsWith(".json")) return "json";
  if (fileName.endsWith(".md")) return "markdown";
  if (fileName.endsWith(".tsx") || fileName.endsWith(".jsx")) return "typescriptreact";
  if (fileName.endsWith(".ts") || fileName.endsWith(".js")) return "typescript";
  return "typescript";
};

const langIcon = (lang: string): React.ElementType => {
  if (lang === "css") return Hash;
  if (lang === "html" || lang === "markdown") return FileText;
  return FileCode;
};

/* ─── Aurora 暗色主题定义 ─── */
const defineAuroraTheme = (monaco: any) => {
  monaco.editor.defineTheme("yyc3-aurora", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6a9955", fontStyle: "italic" },
      { token: "keyword", foreground: "c586c0" },
      { token: "string", foreground: "ce9178" },
      { token: "number", foreground: "b5cea8" },
      { token: "type", foreground: "4ec9b0" },
      { token: "function", foreground: "dcdcaa" },
      { token: "variable", foreground: "9cdcfe" },
      { token: "constant", foreground: "569cd6" },
      { token: "tag", foreground: "569cd6" },
      { token: "attribute.name", foreground: "9cdcfe" },
      { token: "attribute.value", foreground: "ce9178" },
      { token: "delimiter", foreground: "808080" },
      { token: "delimiter.bracket", foreground: "ffd700" },
    ],
    colors: {
      "editor.background": "#1a1a2e",
      "editor.foreground": "#d4d4d4",
      "editor.lineHighlightBackground": "#ffffff06",
      "editor.selectionBackground": "#60efff20",
      "editor.inactiveSelectionBackground": "#60efff10",
      "editorCursor.foreground": "#00ff87",
      "editorWhitespace.foreground": "#ffffff08",
      "editorIndentGuide.background": "#ffffff08",
      "editorIndentGuide.activeBackground": "#00ff8720",
      "editorLineNumber.foreground": "#ffffff20",
      "editorLineNumber.activeForeground": "#ffffff60",
      "editor.selectionHighlightBackground": "#ffb86c15",
      "editorBracketMatch.background": "#00ff8715",
      "editorBracketMatch.border": "#00ff8740",
      "editorGutter.background": "#1a1a2e",
      "scrollbar.shadow": "#00000000",
      "scrollbarSlider.background": "#ffffff10",
      "scrollbarSlider.hoverBackground": "#ffffff18",
      "scrollbarSlider.activeBackground": "#ffffff20",
      "minimap.background": "#1a1a2e",
      "editorOverviewRuler.border": "#ffffff06",
      "editorWidget.background": "#14142a",
      "editorWidget.border": "#ffffff10",
      "input.background": "#ffffff06",
      "input.border": "#ffffff10",
      "input.foreground": "#d4d4d4",
      "list.hoverBackground": "#ffffff08",
      "list.activeSelectionBackground": "#00ff8715",
      "list.activeSelectionForeground": "#00ff87",
    },
  });
};

/* ─── 文件 Tab 标签 ─── */
const FileTab: React.FC<{
  file: VirtualFile;
  isActive: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
}> = ({ file, isActive, onClick, onClose }) => {
  const Icon = langIcon(file.language);
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 flex-shrink-0 transition-all group/ftab relative"
      style={{
        fontSize: "11px",
        color: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)",
        background: isActive ? "rgba(255,255,255,0.04)" : "transparent",
        borderBottom: isActive ? "2px solid #00ff87" : "2px solid transparent",
      }}
    >
      <Icon size={11} style={{ color: isActive ? "#00ff87" : "rgba(255,255,255,0.25)" }} />
      <span>{file.name}</span>
      {file.isModified && (
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#ffb86c" }} />
      )}
      <span
        onClick={onClose}
        className="w-4 h-4 rounded flex items-center justify-center opacity-0 group-hover/ftab:opacity-50 hover:opacity-100 transition-opacity"
        style={{ marginLeft: "2px" }}
      >
        <X size={9} />
      </span>
    </button>
  );
};

/* ─── 诊断面板 ─── */
const DiagnosticsBar: React.FC<{
  diagnostics: Diagnostic[];
  onClickDiag: (d: Diagnostic) => void;
}> = ({ diagnostics, onClickDiag }) => {
  const errors = diagnostics.filter((d) => d.severity === "error").length;
  const warnings = diagnostics.filter((d) => d.severity === "warning").length;
  const infos = diagnostics.filter((d) => d.severity === "info").length;
  const [expanded, setExpanded] = useState(false);

  if (diagnostics.length === 0) return null;

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-3 py-1 transition-colors"
        style={{ background: errors > 0 ? "rgba(255,107,107,0.04)" : "rgba(255,184,108,0.03)", minHeight: "24px" }}
      >
        {errors > 0 && <span className="flex items-center gap-1" style={{ fontSize: "10px", color: "#ff6b6b" }}><CircleAlert size={10} />{errors}</span>}
        {warnings > 0 && <span className="flex items-center gap-1" style={{ fontSize: "10px", color: "#ffb86c" }}><TriangleAlert size={10} />{warnings}</span>}
        {infos > 0 && <span className="flex items-center gap-1" style={{ fontSize: "10px", color: "#60efff" }}><Info size={10} />{infos}</span>}
        <span style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.25)" }}>TypeScript 诊断</span>
        <ChevronDown size={9} className="ml-auto" style={{ color: "rgba(255,255,255,0.2)", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>
      {expanded && (
        <div className="max-h-[120px] overflow-y-auto" style={{ background: "rgba(10,10,22,0.5)" }}>
          {diagnostics.map((d, i) => {
            const color = d.severity === "error" ? "#ff6b6b" : d.severity === "warning" ? "#ffb86c" : "#60efff";
            const SevIcon = d.severity === "error" ? CircleAlert : d.severity === "warning" ? TriangleAlert : Info;
            return (
              <button
                key={i}
                onClick={() => onClickDiag(d)}
                className="w-full flex items-start gap-2 px-3 py-1 text-left transition-colors"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <SevIcon size={10} className="flex-shrink-0 mt-0.5" style={{ color }} />
                <div className="flex-1 min-w-0">
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>{d.message}</span>
                  {d.code && <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)", marginLeft: "6px" }}>ts({d.code})</span>}
                </div>
                <span className="flex-shrink-0" style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>
                  {d.file.split("/").pop()}:{d.line}:{d.column}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Props ─── */
interface Props {
  tab: Tab;
}

export const CodeEditorPanel: React.FC<Props> = ({ tab }) => {
  /* 多文件状态 */
  const [files, setFiles] = useState<VirtualFile[]>(() =>
    defaultFiles.map((f) => ({ ...f, savedContent: f.content }))
  );
  const [activeFilePath, setActiveFilePath] = useState<string>(
    (tab.meta?.filePath as string) || defaultFiles[0].path
  );
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const diagTimer = useRef<ReturnType<typeof setTimeout>>();
  const monaco = useMonaco();

  const { setCode: setPreviewCode } = usePreviewStore();
  const { updateCursor } = useWorkspaceContextStore();
  const { getRemoteCursors, isCollaborating } = useCollaborationStore();

  const activeFile = files.find((f) => f.path === activeFilePath) || files[0];
  const remoteCursors = isCollaborating ? getRemoteCursors(activeFile.path) : [];
  const monacoLang = getMonacoLang(activeFile.name);
  const lineCount = activeFile.content.split("\n").length;

  /* 定义主题 */
  useEffect(() => {
    if (monaco) {
      defineAuroraTheme(monaco);
      monacoRef.current = monaco;

      // 配置 TypeScript/JavaScript 诊断
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        jsx: monaco.languages.typescript.JsxEmit.React,
        allowJs: true,
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        allowSyntheticDefaultImports: true,
      });

      // 添加 React 类型声明（简化版）
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `declare module "react" {
  export function useState<T>(init: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(cb: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(init?: T): { current: T };
  export function useContext<T>(ctx: React.Context<T>): T;
  export function memo<T>(c: T): T;
  export function lazy<T>(factory: () => Promise<{ default: T }>): T;
  export type FC<P = {}> = (props: P) => JSX.Element | null;
  export type ReactNode = string | number | boolean | null | undefined | JSX.Element | ReactNode[];
  export const Fragment: any;
  export function createElement(type: any, props?: any, ...children: any[]): any;
  namespace JSX { interface Element {} interface IntrinsicElements { [k: string]: any; } }
  export default React;
}
declare module "react-router" { export function createBrowserRouter(routes: any[]): any; export const RouterProvider: any; }
declare module "sonner" { export const Toaster: any; export function toast(msg: string): void; }
`,
        "file:///node_modules/@types/react/index.d.ts"
      );

      // 为每个虚拟文件创建 Monaco Model
      files.forEach((file) => {
        const uri = monaco.Uri.parse(`file://${file.path}`);
        if (!monaco.editor.getModel(uri)) {
          monaco.editor.createModel(file.content, getMonacoLang(file.name), uri);
        }
      });
    }
  }, [monaco]);

  /* 切换文件：切换 Monaco Model */
  useEffect(() => {
    const editor = editorRef.current;
    const m = monacoRef.current;
    if (!editor || !m) return;

    const uri = m.Uri.parse(`file://${activeFile.path}`);
    let model = m.editor.getModel(uri);
    if (!model) {
      model = m.editor.createModel(activeFile.content, getMonacoLang(activeFile.name), uri);
    }
    editor.setModel(model);
    editor.focus();
  }, [activeFilePath, activeFile]);

  /* TypeScript 诊断收集 */
  const collectDiagnostics = useCallback(async () => {
    const m = monacoRef.current;
    if (!m) return;

    const allDiags: Diagnostic[] = [];
    const tsWorker = await m.languages.typescript.getTypeScriptWorker();

    for (const file of files) {
      if (file.language !== "typescript" && file.language !== "typescriptreact") continue;
      const uri = m.Uri.parse(`file://${file.path}`);
      const model = m.editor.getModel(uri);
      if (!model) continue;

      try {
        const client = await tsWorker(uri);
        const [semantic, syntactic] = await Promise.all([
          client.getSemanticDiagnostics(uri.toString()),
          client.getSyntacticDiagnostics(uri.toString()),
        ]);

        const mapDiags = (diags: any[], severity: "error" | "warning") =>
          diags.map((d: any) => {
            const pos = model.getPositionAt(d.start || 0);
            return {
              file: file.path,
              line: pos.lineNumber,
              column: pos.column,
              message: typeof d.messageText === "string" ? d.messageText : d.messageText?.messageText || "Unknown",
              severity: d.category === 1 ? "error" : d.category === 0 ? "warning" : "info" as Diagnostic["severity"],
              code: d.code ? String(d.code) : undefined,
            };
          });

        allDiags.push(...mapDiags(syntactic, "error"));
        allDiags.push(...mapDiags(semantic, "warning"));
      } catch {
        // Worker might not be ready yet
      }
    }

    setDiagnostics(allDiags);
  }, [files]);

  /* 编辑器挂载 */
  const handleEditorMount: OnMount = useCallback((editor, monacoInstance) => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance;
    defineAuroraTheme(monacoInstance);
    monacoInstance.editor.setTheme("yyc3-aurora");

    // 设置初始 model
    const uri = monacoInstance.Uri.parse(`file://${activeFile.path}`);
    let model = monacoInstance.editor.getModel(uri);
    if (!model) {
      model = monacoInstance.editor.createModel(activeFile.content, getMonacoLang(activeFile.name), uri);
    }
    editor.setModel(model);

    // 光标位置
    editor.onDidChangeCursorPosition((e: any) => {
      const pos = e.position;
      setCursorLine(pos.lineNumber);
      setCursorCol(pos.column);
      updateCursor(activeFile.path, pos.lineNumber, pos.column);
    });

    // 快捷键：Ctrl+S 保存
    editor.addAction({
      id: "yyc3-save-file",
      label: "Save File",
      keybindings: [monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS],
      run: () => {
        setFiles((prev) => prev.map((f) =>
          f.path === activeFilePath ? { ...f, isModified: false, savedContent: f.content } : f
        ));
      },
    });

    // 快捷键：Ctrl+E 切换同步
    editor.addAction({
      id: "yyc3-toggle-preview-sync",
      label: "Toggle Preview Sync",
      keybindings: [monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyE],
      run: () => setSyncEnabled((s) => !s),
    });

    // 初始诊断
    setTimeout(collectDiagnostics, 1000);

    // v2.0: 从跨窗口迁移的 _editorState 恢复光标/滚动/选区
    const editorState = tab.meta?._editorState as Record<string, unknown> | undefined;
    if (editorState) {
      // 恢复光标位置
      const cursor = editorState.cursorPosition as { lineNumber: number; column: number } | undefined;
      if (cursor) {
        editor.setPosition(cursor);
        editor.revealLineInCenter(cursor.lineNumber);
        setCursorLine(cursor.lineNumber);
        setCursorCol(cursor.column);
      }

      // 恢复选区
      const selections = editorState.selections as Array<{
        startLineNumber: number; startColumn: number;
        endLineNumber: number; endColumn: number;
      }> | undefined;
      if (selections && selections.length > 0) {
        editor.setSelections(selections.map((s) => ({
          selectionStartLineNumber: s.startLineNumber,
          selectionStartColumn: s.startColumn,
          positionLineNumber: s.endLineNumber,
          positionColumn: s.endColumn,
        })));
      }

      // 恢复滚动位置
      const scroll = editorState.scrollPosition as { scrollTop: number; scrollLeft: number } | undefined;
      if (scroll) {
        editor.setScrollPosition(scroll);
      }
    }

    editor.focus();
  }, [activeFile, activeFilePath, collectDiagnostics, updateCursor, tab.meta]);

  /* 代码变更 */
  const handleChange: OnChange = useCallback((value) => {
    const newCode = value || "";

    setFiles((prev) => prev.map((f) =>
      f.path === activeFilePath ? { ...f, content: newCode, isModified: newCode !== f.savedContent } : f
    ));

    // 预览同步
    if (syncEnabled) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        setPreviewCode(newCode, activeFile.language);
      }, 300);
    }

    // 诊断检查（延迟 800ms）
    clearTimeout(diagTimer.current);
    diagTimer.current = setTimeout(collectDiagnostics, 800);
  }, [syncEnabled, activeFile, activeFilePath, setPreviewCode, collectDiagnostics]);

  /* 切换文件 */
  const switchFile = (path: string) => {
    // 保存当前编辑器 viewState
    setActiveFilePath(path);
  };

  /* 关闭文件 */
  const closeFile = (path: string) => {
    if (files.length <= 1) return;
    const idx = files.findIndex((f) => f.path === path);
    const newFiles = files.filter((f) => f.path !== path);
    setFiles(newFiles);
    if (path === activeFilePath) {
      setActiveFilePath(newFiles[Math.min(idx, newFiles.length - 1)].path);
    }
  };

  /* 跳转到诊断位置 */
  const goToDiag = (d: Diagnostic) => {
    if (d.file !== activeFilePath) setActiveFilePath(d.file);
    setTimeout(() => {
      editorRef.current?.setPosition({ lineNumber: d.line, column: d.column });
      editorRef.current?.revealLineInCenter(d.line);
      editorRef.current?.focus();
    }, 50);
  };

  /* 协同光标 */
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !isCollaborating || remoteCursors.length === 0) return;
    const decorations = remoteCursors.map((c) => ({
      range: { startLineNumber: c.cursor.line, startColumn: c.cursor.column, endLineNumber: c.cursor.line, endColumn: c.cursor.column + 1 },
      options: { className: `remote-cursor-${c.userId}`, hoverMessage: { value: c.displayName } },
    }));
    const ids = editor.deltaDecorations([], decorations);
    return () => { editor.deltaDecorations(ids, []); };
  }, [remoteCursors, isCollaborating]);

  const fileDiags = diagnostics.filter((d) => d.file === activeFilePath);
  const totalErrors = diagnostics.filter((d) => d.severity === "error").length;
  const totalWarnings = diagnostics.filter((d) => d.severity === "warning").length;

  return (
    <div className="flex flex-col h-full" style={{ background: "#1a1a2e", color: "#d4d4d4" }}>
      {/* ═══ 多文件 Tab 栏 ═══ */}
      <div
        className="flex items-center flex-shrink-0 overflow-x-auto"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)", minHeight: "32px" }}
      >
        {files.map((file) => (
          <FileTab
            key={file.path}
            file={file}
            isActive={file.path === activeFilePath}
            onClick={() => switchFile(file.path)}
            onClose={(e) => { e.stopPropagation(); closeFile(file.path); }}
          />
        ))}
        <div className="flex-1" />
        {/* 诊断总览 */}
        {(totalErrors > 0 || totalWarnings > 0) && (
          <div className="flex items-center gap-2 px-2" style={{ fontSize: "10px" }}>
            {totalErrors > 0 && <span className="flex items-center gap-0.5" style={{ color: "#ff6b6b" }}><CircleAlert size={9} />{totalErrors}</span>}
            {totalWarnings > 0 && <span className="flex items-center gap-0.5" style={{ color: "#ffb86c" }}><TriangleAlert size={9} />{totalWarnings}</span>}
          </div>
        )}
      </div>

      {/* 面包屑导航 */}
      <BreadcrumbBar filePath={activeFile.path} />

      {/* 工具栏 */}
      <div
        className="flex items-center justify-between px-2 py-0.5 flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "10.5px", minHeight: "26px" }}
      >
        <div className="flex items-center gap-2">
          {remoteCursors.length > 0 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "rgba(96,239,255,0.05)" }}>
              <Users size={9} style={{ color: "#60efff" }} /><span style={{ color: "#60efff", fontSize: "9.5px" }}>{remoteCursors.length} 人</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setSyncEnabled(!syncEnabled)} className="flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors"
            style={{ fontSize: "10px", color: syncEnabled ? "#60efff" : "rgba(255,255,255,0.25)", background: syncEnabled ? "rgba(96,239,255,0.06)" : "transparent" }}
            title={syncEnabled ? "预览同步: 开启" : "预览同步: 关闭"}
          >
            {syncEnabled ? <Link2 size={10} /> : <Link2Off size={10} />}<span>同步</span>
          </button>
          <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.06)" }} />
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px" }}>{monacoLang}</span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>UTF-8</span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>行 {cursorLine} 列 {cursorCol}</span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "10px" }}>{lineCount} 行</span>
          {activeFile.isModified && <span style={{ fontSize: "9px", color: "#ffb86c" }}>已修改</span>}
        </div>
      </div>

      {/* ═══ Monaco Editor ═══ */}
      <div className="flex-1 overflow-hidden">
        <Editor
          theme="yyc3-aurora"
          onChange={handleChange}
          onMount={handleEditorMount}
          loading={
            <div className="flex items-center justify-center h-full gap-2" style={{ background: "#1a1a2e" }}>
              <LoaderCircle size={16} className="animate-spin" style={{ color: "#00ff87" }} />
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>编辑器加载中...</span>
            </div>
          }
          options={{
            minimap: { enabled: true, renderCharacters: false, scale: 2 },
            scrollBeyondLastLine: false,
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true },
            padding: { top: 8 },
            fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontSize: 13,
            lineHeight: 20,
            fontLigatures: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "off",
            automaticLayout: true,
            formatOnPaste: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
            folding: true,
            foldingStrategy: "indentation",
            showFoldingControls: "mouseover",
            matchBrackets: "always",
            renderWhitespace: "selection",
            colorDecorators: true,
            linkedEditing: true,
            contextmenu: true,
          }}
        />
      </div>

      {/* ═══ TypeScript 诊断面板 ═══ */}
      <DiagnosticsBar diagnostics={diagnostics} onClickDiag={goToDiag} />

      {/* 底部同步状态 */}
      {syncEnabled && (
        <div className="flex items-center gap-2 px-3 py-0.5 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(96,239,255,0.02)", fontSize: "10px", color: "rgba(96,239,255,0.5)", minHeight: "20px" }}
        >
          <Eye size={9} /><span>实时预览同步已开启 · 编辑即预览</span>
        </div>
      )}
    </div>
  );
};
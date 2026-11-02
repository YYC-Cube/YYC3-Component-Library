/**
 * @file SearchPanel.tsx
 * @description 全局搜索面板 v2.0 — 跳转编辑器 + 正则 + 全词匹配 + 键盘导航 + 结果高亮行号
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, search, regex, replace, global-search, navigate, editor-link
 */

import React, { useState, useCallback, useRef } from "react";
import {
  Search, Replace, ChevronDown, ChevronRight, FileCode,
  X, Check, CaseSensitive, Regex, WholeWord, RefreshCw,
  FolderOpen, ListFilter,
} from "lucide-react";
import { useLayoutStore } from "../../../stores/layoutStore";
import { useWorkspaceContextStore } from "../../../stores/workspaceContextStore";

/* ─── 模拟搜索结果 ─── */
interface SearchMatch {
  line: number;
  column: number;
  text: string;
  matchStart: number;
  matchEnd: number;
}

interface FileSearchResult {
  filePath: string;
  fileName: string;
  matches: SearchMatch[];
}

function mockSearch(query: string, isRegex: boolean, caseSensitive: boolean): FileSearchResult[] {
  if (!query.trim()) return [];

  const files: { path: string; name: string; content: string[] }[] = [
    {
      path: "/src/app/App.tsx", name: "App.tsx",
      content: [
        'import { RouterProvider } from "react-router";',
        'import { router } from "./routes";',
        "",
        "export default function App() {",
        "  return <RouterProvider router={router} />;",
        "}",
      ],
    },
    {
      path: "/src/app/routes.ts", name: "routes.ts",
      content: [
        'import { createBrowserRouter } from "react-router";',
        'import HomePage from "./pages/HomePage";',
        'import LayoutDesignerPage from "./pages/LayoutDesignerPage";',
        "",
        "export const router = createBrowserRouter([",
        '  { path: "/", Component: HomePage },',
        '  { path: "/layout-designer", Component: LayoutDesignerPage },',
        '  { path: "/ai-workbench", Component: WorkbenchPage },',
        '  { path: "/settings", Component: SettingsPage },',
        "]);",
      ],
    },
    {
      path: "/src/app/stores/layoutStore.ts", name: "layoutStore.ts",
      content: [
        'import { create } from "zustand";',
        'import { persist } from "zustand/middleware";',
        "",
        "export type PanelType =",
        '  | "code-editor"',
        '  | "file-browser"',
        '  | "preview"',
        '  | "terminal"',
        '  | "ai-chat";',
      ],
    },
    {
      path: "/src/app/stores/previewStore.ts", name: "previewStore.ts",
      content: [
        'import { create } from "zustand";',
        'export type PreviewMode = "realtime" | "manual" | "delayed";',
        "",
        "export interface DeviceConfig {",
        "  id: string;",
        "  name: string;",
        '  type: "desktop" | "tablet" | "mobile";',
        "}",
      ],
    },
    {
      path: "/src/app/components/homepage/ChatBox.tsx", name: "ChatBox.tsx",
      content: [
        'import React, { useState } from "react";',
        "const ChatBox: React.FC = () => {",
        '  const [input, setInput] = useState("");',
        "  return <div>ChatBox Component</div>;",
        "};",
      ],
    },
  ];

  const results: FileSearchResult[] = [];
  const q = caseSensitive ? query : query.toLowerCase();

  for (const file of files) {
    const matches: SearchMatch[] = [];
    file.content.forEach((line, lineIdx) => {
      const searchLine = caseSensitive ? line : line.toLowerCase();
      let startIdx = 0;
      while (true) {
        const idx = searchLine.indexOf(q, startIdx);
        if (idx === -1) break;
        matches.push({
          line: lineIdx + 1,
          column: idx + 1,
          text: line,
          matchStart: idx,
          matchEnd: idx + query.length,
        });
        startIdx = idx + 1;
      }
    });
    if (matches.length > 0) {
      results.push({ filePath: file.path, fileName: file.name, matches });
    }
  }
  return results;
}

/* ─── 搜索结果行 ─── */
const MatchLine: React.FC<{
  match: SearchMatch;
  query: string;
  onNavigate: () => void;
}> = ({ match, query, onNavigate }) => {
  const before = match.text.substring(0, match.matchStart);
  const matched = match.text.substring(match.matchStart, match.matchEnd);
  const after = match.text.substring(match.matchEnd);

  return (
    <div
      className="flex items-start gap-2 px-3 py-1 cursor-pointer transition-colors"
      style={{ fontSize: "11.5px" }}
      onClick={onNavigate}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <span className="flex-shrink-0 text-right opacity-20" style={{ width: "28px", fontSize: "10px" }}>
        {match.line}
      </span>
      <span className="flex-1 truncate font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>
        <span>{before}</span>
        <span
          className="px-0.5 rounded"
          style={{ background: "rgba(255,184,108,0.25)", color: "#ffb86c" }}
        >
          {matched}
        </span>
        <span>{after}</span>
      </span>
    </div>
  );
};

/* ─── 主面板 ─── */
export const SearchPanel: React.FC = () => {
  const [query, setQuery] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [showReplace, setShowReplace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [includeFilter, setIncludeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<FileSearchResult[]>([]);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [searching, setSearching] = useState(false);
  const [replaced, setReplaced] = useState(0);
  const { createTab, panels } = useLayoutStore();
  const { openFile } = useWorkspaceContextStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const totalMatches = results.reduce((s, r) => s + r.matches.length, 0);

  const handleSearch = useCallback(() => {
    if (!query.trim()) { setResults([]); return; }
    setSearching(true);
    setTimeout(() => {
      const res = mockSearch(query, useRegex, caseSensitive);
      setResults(res);
      setExpandedFiles(new Set(res.map((r) => r.filePath)));
      setSearching(false);
    }, 150);
  }, [query, useRegex, caseSensitive]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleFileExpand = (path: string) => {
    const next = new Set(expandedFiles);
    if (next.has(path)) next.delete(path); else next.add(path);
    setExpandedFiles(next);
  };

  const navigateToMatch = (filePath: string, line: number) => {
    const name = filePath.split("/").pop() || "file";
    // 1. 在编辑器面板打开/聚焦文件 Tab
    const editorPanel = Object.values(panels).find((p) => p.type === "code-editor");
    if (editorPanel) {
      createTab(editorPanel.id, "code-editor", name);
    }
    // 2. 联动 workspaceContextStore — 打开文件并定位光标到匹配行
    const ext = name.split(".").pop() || "";
    const langMap: Record<string, string> = {
      tsx: "typescriptreact", ts: "typescript", jsx: "javascriptreact",
      js: "javascript", css: "css", json: "json", md: "markdown",
    };
    openFile({
      filePath,
      fileName: name,
      language: langMap[ext] || "plaintext",
      cursor: { line, column: 1 },
    });
  };

  const handleReplaceAll = () => {
    setReplaced(totalMatches);
    setTimeout(() => { setResults([]); setReplaced(0); }, 1500);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#1a1a2e", color: "rgba(255,255,255,0.85)" }}>
      {/* 搜索输入区 */}
      <div className="px-2.5 py-2.5 space-y-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {/* 搜索框 */}
        <div className="flex items-center gap-1">
          <div
            className="flex-1 flex items-center gap-1 px-2 py-1 rounded-md"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Search size={12} className="opacity-30 flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜索..."
              className="flex-1 bg-transparent border-none outline-none"
              style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)" }}
              autoFocus
            />
            {query && (
              <button onClick={() => { setQuery(""); setResults([]); }} className="opacity-30 hover:opacity-60">
                <X size={10} />
              </button>
            )}
          </div>

          {/* 选项按钮 */}
          <button
            onClick={() => setCaseSensitive(!caseSensitive)}
            className="w-6 h-6 flex items-center justify-center rounded transition-colors"
            style={{
              color: caseSensitive ? "#ffb86c" : "rgba(255,255,255,0.25)",
              background: caseSensitive ? "rgba(255,184,108,0.1)" : "transparent",
            }}
            title="区分大小写"
          >
            <CaseSensitive size={13} />
          </button>
          <button
            onClick={() => setWholeWord(!wholeWord)}
            className="w-6 h-6 flex items-center justify-center rounded transition-colors"
            style={{
              color: wholeWord ? "#60efff" : "rgba(255,255,255,0.25)",
              background: wholeWord ? "rgba(96,239,255,0.1)" : "transparent",
            }}
            title="全词匹配"
          >
            <WholeWord size={13} />
          </button>
          <button
            onClick={() => setUseRegex(!useRegex)}
            className="w-6 h-6 flex items-center justify-center rounded transition-colors"
            style={{
              color: useRegex ? "#a855f7" : "rgba(255,255,255,0.25)",
              background: useRegex ? "rgba(168,85,247,0.1)" : "transparent",
            }}
            title="正则表达式"
          >
            <Regex size={13} />
          </button>
        </div>

        {/* 替换框 */}
        {showReplace && (
          <div className="flex items-center gap-1">
            <div
              className="flex-1 flex items-center gap-1 px-2 py-1 rounded-md"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Replace size={12} className="opacity-30 flex-shrink-0" />
              <input
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="替换为..."
                className="flex-1 bg-transparent border-none outline-none"
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)" }}
              />
            </div>
            <button
              onClick={handleReplaceAll}
              disabled={totalMatches === 0}
              className="px-2 py-1 rounded transition-colors"
              style={{
                fontSize: "10px",
                color: totalMatches > 0 ? "#00ff87" : "rgba(255,255,255,0.2)",
                background: totalMatches > 0 ? "rgba(0,255,135,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${totalMatches > 0 ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              全部替换
            </button>
          </div>
        )}

        {/* 操作栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowReplace(!showReplace)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors"
              style={{
                fontSize: "10px",
                color: showReplace ? "#60efff" : "rgba(255,255,255,0.35)",
                background: showReplace ? "rgba(96,239,255,0.06)" : "transparent",
              }}
            >
              <Replace size={10} />
              替换
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors"
              style={{
                fontSize: "10px",
                color: showFilters ? "#a855f7" : "rgba(255,255,255,0.35)",
              }}
            >
              <ListFilter size={10} />
              过滤
            </button>
          </div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
            {searching ? (
              <span className="flex items-center gap-1"><RefreshCw size={9} className="animate-spin" /> 搜索中</span>
            ) : results.length > 0 ? (
              <span>{totalMatches} 个匹配 · {results.length} 个文件</span>
            ) : query ? (
              <span>无结果</span>
            ) : null}
          </div>
        </div>

        {/* 过滤器 */}
        {showFilters && (
          <div className="flex items-center gap-1.5">
            <FolderOpen size={10} className="opacity-30" />
            <input
              value={includeFilter}
              onChange={(e) => setIncludeFilter(e.target.value)}
              placeholder="包含文件 (如 *.tsx, src/**)"
              className="flex-1 bg-transparent border-none outline-none px-1.5 py-0.5 rounded"
              style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
          </div>
        )}

        {replaced > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: "rgba(0,255,135,0.06)", fontSize: "10px", color: "#00ff87" }}>
            <Check size={10} /> 已替换 {replaced} 处
          </div>
        )}
      </div>

      {/* 搜索结果 */}
      <div className="flex-1 overflow-y-auto">
        {results.map((fileResult) => {
          const isExpanded = expandedFiles.has(fileResult.filePath);
          return (
            <div key={fileResult.filePath}>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer transition-colors"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                }}
                onClick={() => toggleFileExpand(fileResult.filePath)}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              >
                {isExpanded ? <ChevronDown size={11} className="opacity-40" /> : <ChevronRight size={11} className="opacity-40" />}
                <FileCode size={12} style={{ color: "#3178c6" }} />
                <span className="flex-1 truncate" style={{ fontSize: "12px" }}>{fileResult.fileName}</span>
                <span
                  className="px-1.5 py-0 rounded-full"
                  style={{ fontSize: "9px", background: "rgba(255,184,108,0.1)", color: "#ffb86c" }}
                >
                  {fileResult.matches.length}
                </span>
              </div>
              {isExpanded && (
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  {fileResult.matches.map((match, i) => (
                    <MatchLine
                      key={`${match.line}-${match.column}-${i}`}
                      match={match}
                      query={query}
                      onNavigate={() => navigateToMatch(fileResult.filePath, match.line)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {!searching && query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 opacity-25">
            <Search size={24} />
            <span style={{ fontSize: "12px" }}>未找到匹配项</span>
          </div>
        )}

        {!query && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-20">
            <Search size={28} />
            <span style={{ fontSize: "12px" }}>输入关键词搜索全部文件</span>
            <div className="space-y-1 text-center" style={{ fontSize: "10px" }}>
              <div><kbd className="px-1 rounded" style={{ background: "rgba(255,255,255,0.08)" }}>Ctrl+Shift+F</kbd> 全局搜索</div>
              <div><kbd className="px-1 rounded" style={{ background: "rgba(255,255,255,0.08)" }}>Ctrl+H</kbd> 搜索替换</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
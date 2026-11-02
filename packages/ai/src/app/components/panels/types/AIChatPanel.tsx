/**
 * @file AIChatPanel.tsx
 * @description AI 聊天面板 v4.0 — 流式打字机效果 + 代码块语法高亮 + 上下文文件附件 + 对话持久化
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v4.0.0
 * @created 2026-03-14
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, ai-chat, streaming, typewriter, syntax-highlight, file-attachment
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot, User, ArrowUp, Sparkles, Copy, Check, ChevronDown,
  Trash2, RotateCcw, Settings, Cpu, CircleStop, MessageSquarePlus,
  Clipboard, Code, ChevronRight, FileCode, MapPin, X,
  Paperclip, File, FolderTree, FileText, Hash,
  Pencil, GitBranch, RefreshCw,
} from "lucide-react";
import { useAIServiceStore } from "../../../stores/aiServiceStore";
import { useWorkspaceContextStore } from "../../../stores/workspaceContextStore";
import { useLayoutStore } from "../../../stores/layoutStore";
import { useConversationStore } from "../../../stores/conversationStore";
import { chatPanelRegistry } from "../../../services/chatPanelRegistry";

/* ─── 类型 ─── */
interface FileAttachment {
  id: string;
  name: string;
  path: string;
  language: string;
  size: number;
  preview: string; // 前 200 字符
}

interface ChatMsg {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  model?: string;
  timestamp: number;
  isStreaming?: boolean;
  tokenCount?: number;
  attachments?: FileAttachment[];
  parentId?: string;         // 父消息 ID (用于对话树)
  childrenIds?: string[];    // 子消息 ID 列表 (分支)
  activeChildIdx?: number;   // 当前活跃分支索引
  branchLabel?: string;      // 分支标签 (如 "分支 A")
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMsg[];
  createdAt: number;
  /** 当前活跃路径：从根到最新叶子的消息 ID 链 */
  activePath: string[];
}

/* ─── 语法高亮 Token 定义 ─── */
interface SyntaxToken {
  pattern: RegExp;
  className: string;
  color: string;
}

const syntaxTokens: Record<string, SyntaxToken[]> = {
  typescript: [
    { pattern: /\b(import|from|export|default|as|type|interface|enum|namespace|module|declare)\b/g, className: "kw-import", color: "#c586c0" },
    { pattern: /\b(function|const|let|var|return|if|else|switch|case|break|continue|for|while|do|class|extends|implements|new|this|super|typeof|instanceof|void|delete|in|of|yield|async|await|throw|try|catch|finally)\b/g, className: "kw", color: "#569cd6" },
    { pattern: /\b(string|number|boolean|any|unknown|never|null|undefined|object|symbol|bigint|true|false)\b/g, className: "type", color: "#4ec9b0" },
    { pattern: /\b(React|useState|useEffect|useCallback|useMemo|useRef|useContext|useReducer|Promise|Array|Map|Set|Date|Error|console|JSON|Math|Object|RegExp|Window|Document|HTMLElement)\b/g, className: "builtin", color: "#4ec9b0" },
    { pattern: /\b(describe|it|test|expect|vi|jest|beforeEach|afterEach|beforeAll|afterAll|mock|fn|spyOn)\b/g, className: "test", color: "#dcdcaa" },
    { pattern: /(\/\/.*$)/gm, className: "comment", color: "#6a9955" },
    { pattern: /(\/\*[\s\S]*?\*\/)/g, className: "comment-block", color: "#6a9955" },
    { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, className: "string", color: "#ce9178" },
    { pattern: /\b(\d+\.?\d*(?:e[+-]?\d+)?)\b/g, className: "number", color: "#b5cea8" },
    { pattern: /(=>)/g, className: "arrow", color: "#569cd6" },
    { pattern: /(@\w+)/g, className: "decorator", color: "#dcdcaa" },
    { pattern: /\b([A-Z][a-zA-Z0-9]*)\s*(?=[<(])/g, className: "class-name", color: "#4ec9b0" },
    { pattern: /(?<=\.)\b([a-zA-Z_]\w*)\s*(?=\()/g, className: "method", color: "#dcdcaa" },
  ],
  css: [
    { pattern: /([.#][\w-]+)/g, className: "selector", color: "#d7ba7d" },
    { pattern: /([\w-]+)\s*(?=:)/g, className: "property", color: "#9cdcfe" },
    { pattern: /(#[0-9a-fA-F]{3,8})/g, className: "color-val", color: "#ce9178" },
    { pattern: /\b(\d+\.?\d*)(px|em|rem|%|vh|vw|fr|s|ms|deg)\b/g, className: "unit", color: "#b5cea8" },
    { pattern: /(@\w+)/g, className: "at-rule", color: "#c586c0" },
    { pattern: /(\/\*[\s\S]*?\*\/)/g, className: "comment", color: "#6a9955" },
    { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, className: "string", color: "#ce9178" },
  ],
  html: [
    { pattern: /(<\/?[\w-]+)/g, className: "tag", color: "#569cd6" },
    { pattern: /\b([\w-]+)(?==)/g, className: "attr", color: "#9cdcfe" },
    { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, className: "string", color: "#ce9178" },
    { pattern: /(<!--[\s\S]*?-->)/g, className: "comment", color: "#6a9955" },
  ],
  json: [
    { pattern: /("(?:[^"\\]|\\.)*")\s*(?=:)/g, className: "key", color: "#9cdcfe" },
    { pattern: /:\s*("(?:[^"\\]|\\.)*")/g, className: "string", color: "#ce9178" },
    { pattern: /\b(\d+\.?\d*)\b/g, className: "number", color: "#b5cea8" },
    { pattern: /\b(true|false|null)\b/g, className: "keyword", color: "#569cd6" },
  ],
};

/* 获取语言对应的 token 规则 */
const getTokensForLang = (lang: string): SyntaxToken[] => {
  const l = lang.toLowerCase().replace(/^(ts|tsx|jsx|js)$/, "typescript");
  return syntaxTokens[l] || syntaxTokens.typescript;
};

/* ─── 高级语法高亮引擎 ─── */
const highlightLine = (line: string, language: string): React.ReactNode => {
  const tokens = getTokensForLang(language);
  if (!tokens.length) return <span>{line}</span>;

  // Collect all matches with positions
  interface Match { start: number; end: number; text: string; color: string; }
  const matches: Match[] = [];

  tokens.forEach((token) => {
    const regex = new RegExp(token.pattern.source, token.pattern.flags);
    let m: RegExpExecArray | null;
    while ((m = regex.exec(line)) !== null) {
      const capturedGroup = m[1] || m[0];
      const start = m.index + (m[0].indexOf(capturedGroup));
      matches.push({
        start,
        end: start + capturedGroup.length,
        text: capturedGroup,
        color: token.color,
      });
    }
  });

  // Sort by start position, resolve overlaps (first match wins)
  matches.sort((a, b) => a.start - b.start);
  const filtered: Match[] = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }

  // Build spans
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  filtered.forEach((m, i) => {
    if (cursor < m.start) {
      parts.push(<span key={`t-${i}`}>{line.slice(cursor, m.start)}</span>);
    }
    parts.push(<span key={`h-${i}`} style={{ color: m.color }}>{m.text}</span>);
    cursor = m.end;
  });
  if (cursor < line.length) {
    parts.push(<span key="rest">{line.slice(cursor)}</span>);
  }
  return <>{parts}</>;
};

/* ─── 模拟 AI 回复 (带流式效果) ─── */
const aiResponses: Record<string, string> = {
  "解释选中的代码": `## 代码解释

这段代码实现了一个 **React 函数式组件**，使用了以下核心特性：

### 关键点

1. **useState Hook** — 管理组件内部状态
2. **useCallback Hook** — 缓存回调函数避免不必要的重渲染
3. **TypeScript 接口** — 严格的类型约束

\`\`\`typescript
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
  children?: React.ReactNode;
}

export const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  const [value, setValue] = useState<string>("");
  
  const handleSubmit = useCallback(() => {
    onSubmit({ title, value });
  }, [title, value, onSubmit]);
  
  return <form onSubmit={handleSubmit}>{title}</form>;
};
\`\`\`

> 建议：考虑使用 \`useMemo\` 来优化计算密集型操作。`,

  "添加错误处理": `## 错误处理建议

为你的代码添加完整的错误处理机制：

\`\`\`typescript
async function fetchData<T>(apiUrl: string): Promise<T> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
    const data: T = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("网络错误:", error.message);
      // toast.error("网络连接失败，请检查网络设置");
    } else if (error instanceof SyntaxError) {
      console.error("JSON 解析错误:", error.message);
    } else {
      console.error("未知错误:", error);
      throw error; // 重新抛出未处理的错误
    }
    throw error;
  }
}
\`\`\`

### 最佳实践
- 使用 **Error Boundary** 捕获组件渲染错误
- 实现 **重试机制** 和 **指数退避**
- 在 UI 层展示友好的错误提示`,

  "优化性能": `## 性能优化方案

### 1. 组件记忆化

\`\`\`typescript
const MemoizedList = React.memo(({ items }: Props) => {
  return items.map(item => <ListItem key={item.id} {...item} />);
});
\`\`\`

### 2. 虚拟滚动
对于大量数据列表，建议使用 **react-virtual**：

\`\`\`typescript
import { useVirtualizer } from "@tanstack/react-virtual";

const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 48,
});
\`\`\`

### 3. 代码分割
- 使用 \`React.lazy()\` + \`Suspense\` 进行路由级代码分割
- 使用 \`dynamic import()\` 延迟加载重型依赖

> **性能指标目标**: FCP < 1.5s, LCP < 2.5s, CLS < 0.1`,

  "生成单元测试": `## 单元测试

使用 **Vitest** + **React Testing Library**：

\`\`\`typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Component } from "./Component";

describe("Component", () => {
  it("应正确渲染标题", () => {
    render(<Component title="测试标题" />);
    expect(screen.getByText("测试标题")).toBeInTheDocument();
  });

  it("点击按钮应触发回调", async () => {
    const onSubmit = vi.fn();
    render(<Component title="测试" onSubmit={onSubmit} />);
    
    fireEvent.click(screen.getByRole("button"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("应处理空状态", () => {
    render(<Component title="空列表" items={[]} />);
    expect(screen.getByText("暂无数据")).toBeInTheDocument();
  });
});
\`\`\`

覆盖率目标：**>80%** 行覆盖率`,
};

const defaultReply = `收到你的需求，我来分析一下：

### 建议方案

1. **代码结构优化** — 提取公共逻辑到自定义 Hook
2. **类型安全** — 使用 \`zod\` 进行运行时验证
3. **状态管理** — 考虑使用 \`Zustand\` 替代 Context

\`\`\`typescript
// 示例：自定义 Hook
export function useDataFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [url]);
  
  return { data, loading, error };
}
\`\`\`

还需要我进一步展开任何部分吗？`;

/* ─── Markdown 渲染器 ─── */
const renderMarkdown = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  let keyIdx = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 代码块
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      parts.push(
        <CodeBlock key={`code-${keyIdx++}`} code={codeLines.join("\n")} language={lang} />
      );
      continue;
    }

    // 标题
    if (line.startsWith("### ")) {
      parts.push(<div key={`h3-${keyIdx++}`} style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginTop: "8px", marginBottom: "4px" }}>{renderInline(line.slice(4))}</div>);
      i++; continue;
    }
    if (line.startsWith("## ")) {
      parts.push(<div key={`h2-${keyIdx++}`} style={{ fontSize: "13px", fontWeight: 700, color: "#00ff87", marginTop: "10px", marginBottom: "4px" }}>{renderInline(line.slice(3))}</div>);
      i++; continue;
    }

    // 引用
    if (line.startsWith("> ")) {
      parts.push(
        <div key={`bq-${keyIdx++}`} className="px-2.5 py-1.5 my-1 rounded" style={{ borderLeft: "3px solid rgba(96,239,255,0.3)", background: "rgba(96,239,255,0.04)", fontSize: "11.5px", color: "rgba(255,255,255,0.6)" }}>
          {renderInline(line.slice(2))}
        </div>
      );
      i++; continue;
    }

    // 有序列表
    if (/^\d+\.\s/.test(line)) {
      parts.push(
        <div key={`ol-${keyIdx++}`} className="flex gap-1.5 ml-1 my-0.5" style={{ fontSize: "12px" }}>
          <span style={{ color: "#00ff87", fontWeight: 600, minWidth: "16px" }}>{line.match(/^(\d+)\./)?.[1]}.</span>
          <span>{renderInline(line.replace(/^\d+\.\s/, ""))}</span>
        </div>
      );
      i++; continue;
    }

    // 无序列表
    if (line.startsWith("- ")) {
      parts.push(
        <div key={`ul-${keyIdx++}`} className="flex gap-1.5 ml-1 my-0.5" style={{ fontSize: "12px" }}>
          <span style={{ color: "#a855f7" }}>•</span>
          <span>{renderInline(line.slice(2))}</span>
        </div>
      );
      i++; continue;
    }

    // 空行
    if (line.trim() === "") {
      parts.push(<div key={`br-${keyIdx++}`} className="h-1" />);
      i++; continue;
    }

    // 普通段落
    parts.push(<div key={`p-${keyIdx++}`} style={{ fontSize: "12px", lineHeight: "1.6", margin: "2px 0" }}>{renderInline(line)}</div>);
    i++;
  }

  return parts;
};

/* 行内 Markdown */
const renderInline = (text: string): React.ReactNode => {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("`") && p.endsWith("`")) {
      return <code key={i} className="px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "#ffb86c", fontSize: "11px", fontFamily: "'SF Mono', monospace" }}>{p.slice(1, -1)}</code>;
    }
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i} style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{p.slice(2, -2)}</strong>;
    }
    if (p.startsWith("*") && p.endsWith("*")) {
      return <em key={i} style={{ fontStyle: "italic", color: "rgba(255,255,255,0.7)" }}>{p.slice(1, -1)}</em>;
    }
    return <span key={i}>{p}</span>;
  });
};

/* ─── 代码块组件 (增强语法高亮) ─── */
const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const lineCount = code.split("\n").length;

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang = language || "plaintext";
  const langColors: Record<string, string> = {
    typescript: "#3178c6",
    javascript: "#f7df1e",
    tsx: "#3178c6",
    jsx: "#f7df1e",
    css: "#264de4",
    html: "#e34f26",
    json: "#292929",
    python: "#3572a5",
    rust: "#dea584",
    go: "#00add8",
    sql: "#e38c00",
  };
  const langColor = langColors[displayLang.toLowerCase()] || "#60efff";

  return (
    <div className="my-2 rounded-lg overflow-hidden group/code" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      {/* 头部 */}
      <div className="flex items-center justify-between px-3 py-1" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: langColor }} />
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{displayLang}</span>
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>{lineCount} 行</span>
        </div>
        <div className="flex items-center gap-1">
          {lineCount > 10 && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors"
              style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}
            >
              <ChevronRight size={8} style={{ transform: collapsed ? "rotate(0deg)" : "rotate(90deg)", transition: "transform 0.15s" }} />
              {collapsed ? "展开" : "折叠"}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors"
            style={{ fontSize: "9px", color: copied ? "#00ff87" : "rgba(255,255,255,0.3)", background: copied ? "rgba(0,255,135,0.06)" : "transparent" }}
          >
            {copied ? <Check size={9} /> : <Copy size={9} />}
            {copied ? "已复制" : "复制"}
          </button>
        </div>
      </div>
      {/* 代码内容 */}
      {!collapsed && (
        <div className="px-3 py-2 overflow-x-auto" style={{ background: "rgba(10,10,20,0.5)", fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace", fontSize: "11.5px", lineHeight: "18px" }}>
          {code.split("\n").map((line, i) => (
            <div key={i} className="flex hover:bg-white/[0.02] transition-colors rounded-sm">
              <span className="select-none mr-3 text-right" style={{ color: "rgba(255,255,255,0.1)", minWidth: "24px", fontSize: "10px" }}>{i + 1}</span>
              <span className="whitespace-pre">{highlightLine(line, displayLang)}</span>
            </div>
          ))}
        </div>
      )}
      {collapsed && (
        <div className="px-3 py-2 flex items-center gap-2" style={{ background: "rgba(10,10,20,0.5)", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
          <Code size={10} />
          <span>{lineCount} 行代码已折叠</span>
        </div>
      )}
    </div>
  );
};

/* ─── 文件附件标签 ─── */
const AttachmentChip: React.FC<{ att: FileAttachment; onRemove: () => void }> = ({ att, onRemove }) => {
  const langIcons: Record<string, React.ElementType> = {
    typescript: FileCode, javascript: FileCode, tsx: FileCode, jsx: FileCode,
    css: Hash, html: FileText, json: FileText, markdown: FileText,
  };
  const Icon = langIcons[att.language] || File;

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg group/att"
      style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.12)", fontSize: "10.5px" }}
    >
      <Icon size={11} style={{ color: "#a855f7" }} />
      <span className="truncate max-w-[120px]" style={{ color: "rgba(255,255,255,0.6)" }}>{att.name}</span>
      <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.2)" }}>{att.language}</span>
      <button
        onClick={onRemove}
        className="w-4 h-4 flex items-center justify-center rounded opacity-0 group-hover/att:opacity-60 transition-opacity"
      >
        <X size={8} />
      </button>
    </div>
  );
};

/* ─── 文件选择浮窗 ─── */
const mockWorkspaceFiles: FileAttachment[] = [
  { id: "f1", name: "App.tsx", path: "/src/app/App.tsx", language: "tsx", size: 4200, preview: "import React from 'react';\nimport { RouterProvider }..." },
  { id: "f2", name: "layoutStore.ts", path: "/src/app/stores/layoutStore.ts", language: "typescript", size: 12800, preview: "import { create } from 'zustand';\nexport type PanelType..." },
  { id: "f3", name: "theme.css", path: "/src/styles/theme.css", language: "css", size: 3600, preview: ":root { --color-primary: #00ff87; --color..." },
  { id: "f4", name: "PreviewPanel.tsx", path: "/src/app/components/panels/types/PreviewPanel.tsx", language: "tsx", size: 8900, preview: "export const PreviewPanel: React.FC = () => {..." },
  { id: "f5", name: "aiServiceStore.ts", path: "/src/app/stores/aiServiceStore.ts", language: "typescript", size: 9200, preview: "export interface AIProviderConfig { id: string;..." },
  { id: "f6", name: "package.json", path: "/package.json", language: "json", size: 2100, preview: '{ "name": "@figma/my-make-file", "private": true...' },
];

const FilePickerPopup: React.FC<{
  onSelect: (file: FileAttachment) => void;
  onClose: () => void;
  excludeIds: string[];
}> = ({ onSelect, onClose, excludeIds }) => {
  const [search, setSearch] = useState("");
  const filtered = mockWorkspaceFiles.filter(
    (f) => !excludeIds.includes(f.id) && (f.name.toLowerCase().includes(search.toLowerCase()) || f.path.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="absolute bottom-full left-0 mb-2 z-50 rounded-xl overflow-hidden"
        style={{ background: "rgba(20,20,35,0.98)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)", width: "300px", maxHeight: "280px" }}
      >
        <div className="p-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
            <FolderTree size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索工作区文件..."
              className="flex-1 bg-transparent border-none outline-none"
              style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)" }}
              autoFocus
            />
          </div>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "220px" }}>
          {filtered.length === 0 ? (
            <div className="p-4 text-center" style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>无匹配文件</div>
          ) : (
            filtered.map((file) => (
              <button
                key={file.id}
                onClick={() => { onSelect(file); onClose(); }}
                className="w-full flex items-start gap-2.5 px-3 py-2 text-left transition-colors"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(168,85,247,0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <FileCode size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#a855f7" }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate" style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.8)" }}>{file.name}</span>
                    <span className="px-1 py-0 rounded flex-shrink-0" style={{ fontSize: "8px", background: "rgba(168,85,247,0.1)", color: "rgba(168,85,247,0.6)" }}>{file.language}</span>
                  </div>
                  <div className="truncate" style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.2)", marginTop: "1px" }}>{file.path}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
};

/* ─── 快捷操作 ─── */
const quickActions = [
  { label: "解释选中的代码", icon: Sparkles },
  { label: "添加错误处理", icon: Code },
  { label: "优化性能", icon: Cpu },
  { label: "生成单元测试", icon: Clipboard },
];

/* ─── 主组件 ─── */
interface AIChatPanelProps {
  tab?: import("../../../stores/layoutStore").Tab;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ tab }) => {
  const { providers, activeProviderId, activeModelId, setActiveProvider, setActiveModel, getActiveProvider, getActiveModel } =
    useAIServiceStore();

  /* ─── _chatContext 恢复：从跨窗口迁移中恢复对话 ─── */
  const restoredCtx = tab?.meta?._chatContext as {
    conversations?: Conversation[];
    activeConvId?: string;
    input?: string;
    attachments?: FileAttachment[];
  } | undefined;

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (restoredCtx?.conversations && restoredCtx.conversations.length > 0) {
      return restoredCtx.conversations;
    }
    return [{
      id: "conv-1",
      title: "新对话",
      messages: [{
        id: "sys-1", role: "assistant", content: "你好！我是 YYC³ AI 编程助手。\n\n我可以帮你：\n- **解释代码** 逻辑和设计模式\n- **优化性能** 和代码结构\n- **生成测试** 和文档\n- **修复错误** 和调试\n\n选中代码后可直接提问，或使用下方快捷操作。你也可以通过 📎 按钮附加工作区文件作为上下文。",
        timestamp: Date.now(), model: activeModelId,
      }],
      createdAt: Date.now(),
      activePath: ["sys-1"],
    }];
  });
  const [activeConvId, setActiveConvId] = useState(restoredCtx?.activeConvId || "conv-1");
  const [input, setInput] = useState(restoredCtx?.input || "");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>(restoredCtx?.attachments || []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const streamAbortRef = useRef(false);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeProvider = getActiveProvider();
  const activeModel = getActiveModel();

  /* ─── 上下文感知 ─── */
  const wsCtx = useWorkspaceContextStore();
  const activeFile = wsCtx.getActiveFile();
  const { activePanelId, tabs, panels } = useLayoutStore();
  const [showContext, setShowContext] = useState(true);

  const editorContext = (() => {
    if (activeFile) {
      return { fileName: activeFile.fileName, language: activeFile.language, line: activeFile.cursor.line, column: activeFile.cursor.column, filePath: activeFile.filePath };
    }
    if (activePanelId) {
      const panel = panels[activePanelId];
      if (panel?.activeTabId) {
        const t = tabs[panel.activeTabId];
        if (t?.type === "code-editor" && t.meta) {
          return { fileName: t.title, language: (t.meta.language as string) || "plaintext", line: 1, column: 1, filePath: (t.meta.filePath as string) || "" };
        }
      }
    }
    return null;
  })();

  /* ─── 持久化对话 ─── */
  const convStore = useConversationStore();
  useEffect(() => {
    if (activeConv && activeConv.messages.length > 1) {
      activeConv.messages.forEach((msg) => {
        if (msg.role !== "system" && !convStore.messages.find((m) => m.id === msg.id)) {
          convStore.addMessage({ role: msg.role, content: msg.content });
        }
      });
    }
  }, [activeConv?.messages?.length]);

  /* ─── 自动滚动 ─── */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeConv?.messages?.length, streamingText]);

  /* ─── 注册聊天状态到全局注册表（供跨窗口拖拽快照使用） ─── */
  useEffect(() => {
    const tabId = tab?.id;
    if (!tabId) return;

    chatPanelRegistry.register(tabId, {
      conversations,
      activeConvId,
      input,
      attachments,
      snapshotAt: Date.now(),
    });

    return () => {
      chatPanelRegistry.unregister(tabId);
    };
  }, [tab?.id, conversations, activeConvId, input, attachments]);

  /* ─── 流式打字效果 ─── */
  const streamResponse = useCallback(async (fullText: string, convId: string) => {
    setIsStreaming(true);
    setStreamingText("");
    streamAbortRef.current = false;

    const chars = fullText.split("");
    let accumulated = "";
    let insideCodeBlock = false;

    for (let i = 0; i < chars.length; i++) {
      if (streamAbortRef.current) break;

      accumulated += chars[i];
      if (accumulated.endsWith("```")) insideCodeBlock = !insideCodeBlock;

      setStreamingText(accumulated);

      // 变速：代码块内快速，普通文本正常
      const delay = insideCodeBlock ? 5 : (chars[i] === "\n" ? 40 : chars[i] === " " ? 15 : 12);
      await new Promise((r) => setTimeout(r, delay));
    }

    // 完成后将流式文本提交为正式消息
    const assistantMsg: ChatMsg = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: accumulated,
      model: activeModelId,
      timestamp: Date.now(),
      tokenCount: Math.ceil(accumulated.length / 3.5),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, messages: [...c.messages, assistantMsg], activePath: [...c.activePath, assistantMsg.id] }
          : c
      )
    );

    setStreamingText("");
    setIsStreaming(false);
  }, [activeModelId]);

  /* ─── 发送消息 ─── */
  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: ChatMsg = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              messages: [...c.messages, userMsg],
              activePath: [...c.activePath, userMsg.id],
              title: c.messages.length <= 1 ? text.slice(0, 20) + (text.length > 20 ? "..." : "") : c.title,
            }
          : c
      )
    );

    setInput("");
    setAttachments([]);

    // 匹配模拟回复
    const responseText = aiResponses[text] || defaultReply;
    setTimeout(() => streamResponse(responseText, activeConvId), 400);
  }, [input, isStreaming, activeConvId, attachments, streamResponse]);

  /* ─── 停止生成 ─── */
  const handleStop = useCallback(() => {
    streamAbortRef.current = true;
  }, []);

  /* ─── 新对话 ─── */
  const handleNewConversation = useCallback(() => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: "新对话",
      messages: [{
        id: `sys-${Date.now()}`, role: "assistant",
        content: "新对话已创建。有什么需要帮助的吗？",
        timestamp: Date.now(), model: activeModelId,
      }],
      createdAt: Date.now(),
      activePath: [`sys-${Date.now()}`],
    };
    setConversations((prev) => [...prev, newConv]);
    setActiveConvId(newId);
  }, [activeModelId]);

  /* ─── 清空当前对话 ─── */
  const handleClear = useCallback(() => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              messages: [{
                id: `sys-${Date.now()}`, role: "assistant" as const,
                content: "对话已清空。有什么新的问题吗？",
                timestamp: Date.now(), model: activeModelId,
              }],
              activePath: [`sys-${Date.now()}`],
            }
          : c
      )
    );
  }, [activeConvId, activeModelId]);

  /* ─── 快捷键 ─── */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  /* ─── 获取活跃路径上的消息 ─── */
  const visibleMessages = activeConv.activePath
    .map((id) => activeConv.messages.find((m) => m.id === id))
    .filter(Boolean) as ChatMsg[];

  return (
    <div className="flex flex-col h-full" style={{ background: "rgba(10,10,22,0.6)" }}>
      {/* ═══ 顶部工具栏 ═══ */}
      <div
        className="flex items-center justify-between px-3 py-1.5 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", minHeight: "34px" }}
      >
        <div className="flex items-center gap-2">
          <Bot size={13} style={{ color: "#00ff87" }} />
          <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>AI 助手</span>
          {conversations.length > 1 && (
            <select
              value={activeConvId}
              onChange={(e) => setActiveConvId(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer"
              style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", maxWidth: "120px" }}
            >
              {conversations.map((c) => (
                <option key={c.id} value={c.id} style={{ background: "#14142a" }}>
                  {c.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          <button onClick={handleNewConversation} className="p-1 rounded transition-colors hover:bg-white/5" title="新对话">
            <MessageSquarePlus size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          </button>
          <button onClick={handleClear} className="p-1 rounded transition-colors hover:bg-white/5" title="清空对话">
            <Trash2 size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          </button>

          {/* 模型选择 */}
          <div className="relative">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors hover:bg-white/5"
              style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.35)" }}
            >
              <Cpu size={9} />
              <span className="truncate max-w-[80px]">{activeModel?.displayName || activeModelId}</span>
              <ChevronDown size={8} />
            </button>

            {showModelPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowModelPicker(false)} />
                <div
                  className="absolute right-0 top-full mt-1 z-50 rounded-xl py-1 min-w-[200px]"
                  style={{ background: "rgba(20,20,35,0.98)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
                >
                  {providers.filter((p) => p.enabled).map((provider) => (
                    <div key={provider.id}>
                      <div className="px-3 py-1" style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>
                        {provider.displayName}
                      </div>
                      {provider.models.filter((m) => m.enabled).map((model) => (
                        <button
                          key={model.id}
                          onClick={() => { setActiveProvider(provider.id); setActiveModel(model.id); setShowModelPicker(false); }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors"
                          style={{
                            fontSize: "11px",
                            color: model.id === activeModelId ? "#00ff87" : "rgba(255,255,255,0.6)",
                            background: model.id === activeModelId ? "rgba(0,255,135,0.05)" : "transparent",
                          }}
                          onMouseEnter={(e) => { if (model.id !== activeModelId) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                          onMouseLeave={(e) => { if (model.id !== activeModelId) e.currentTarget.style.background = "transparent"; }}
                        >
                          <Cpu size={10} />
                          <span className="flex-1">{model.displayName}</span>
                          {model.id === activeModelId && <Check size={10} style={{ color: "#00ff87" }} />}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ═══ 上下文指示器 ═══ */}
      {editorContext && showContext && (
        <div
          className="flex items-center gap-2 px-3 py-1 flex-shrink-0"
          style={{ background: "rgba(0,255,135,0.02)", borderBottom: "1px solid rgba(0,255,135,0.06)", fontSize: "10px" }}
        >
          <MapPin size={9} style={{ color: "#00ff87" }} />
          <span style={{ color: "rgba(255,255,255,0.45)" }}>
            {editorContext.fileName}
            <span style={{ color: "rgba(255,255,255,0.2)" }}> · {editorContext.language} · 行 {editorContext.line}</span>
          </span>
          <button onClick={() => setShowContext(false)} className="ml-auto p-0.5 rounded hover:bg-white/5">
            <X size={8} style={{ color: "rgba(255,255,255,0.2)" }} />
          </button>
        </div>
      )}

      {/* ═══ 消息列表 ═══ */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
        {visibleMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {/* 流式输出 */}
        {isStreaming && streamingText && (
          <div className="flex gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "linear-gradient(135deg, #00ff87, #60efff)" }}
            >
              <Bot size={11} color="white" />
            </div>
            <div className="max-w-[88%] rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div>{renderMarkdown(streamingText)}</div>
              <div className="flex items-center gap-1.5 mt-1.5" style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00ff87" }} />
                <span>生成中...</span>
              </div>
            </div>
          </div>
        )}

        {/* 空状态快捷操作 */}
        {visibleMessages.length <= 1 && !isStreaming && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => { setInput(action.label); setTimeout(handleSend, 50); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontSize: "11px", color: "rgba(255,255,255,0.5)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,135,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
              >
                <action.icon size={11} />
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ═══ 附件显示区 ═══ */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-3 py-1.5 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {attachments.map((att) => (
            <AttachmentChip key={att.id} att={att} onRemove={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))} />
          ))}
        </div>
      )}

      {/* ═══ 输入区 ═══ */}
      <div className="flex-shrink-0 px-3 pb-3 pt-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          className="flex items-end gap-2 rounded-xl px-3 py-2"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* 附件按钮 */}
          <div className="relative flex-shrink-0 pb-0.5">
            <button
              onClick={() => setShowFilePicker(!showFilePicker)}
              className="p-1 rounded transition-colors hover:bg-white/5"
              title="附加文件"
            >
              <Paperclip size={13} style={{ color: attachments.length > 0 ? "#a855f7" : "rgba(255,255,255,0.25)" }} />
            </button>
            {showFilePicker && (
              <FilePickerPopup
                onSelect={(file) => setAttachments((prev) => [...prev, file])}
                onClose={() => setShowFilePicker(false)}
                excludeIds={attachments.map((a) => a.id)}
              />
            )}
          </div>

          {/* 文本输入 */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Shift+Enter 换行)"
            className="flex-1 bg-transparent border-none outline-none resize-none"
            style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", lineHeight: "1.5", minHeight: "20px", maxHeight: "120px" }}
            rows={1}
          />

          {/* 发送/停止按钮 */}
          {isStreaming ? (
            <button
              onClick={handleStop}
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
              style={{ background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.2)" }}
              title="停止生成"
            >
              <CircleStop size={13} style={{ color: "#ff6b6b" }} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: input.trim() ? "linear-gradient(135deg, #00ff87, #60efff)" : "rgba(255,255,255,0.05)",
                opacity: input.trim() ? 1 : 0.4,
                cursor: input.trim() ? "pointer" : "not-allowed",
              }}
              title="发送 (Enter)"
            >
              <ArrowUp size={13} style={{ color: input.trim() ? "#000" : "rgba(255,255,255,0.2)" }} />
            </button>
          )}
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between mt-1 px-1" style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>
          <span>{activeProvider?.displayName || "AI"} · {activeModel?.displayName || activeModelId}</span>
          <span>{visibleMessages.length} 条消息</span>
        </div>
      </div>
    </div>
  );
};

/* ─── 消息气泡 ─── */
const MessageBubble: React.FC<{ msg: ChatMsg }> = ({ msg }) => {
  const isUser = msg.role === "user";
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(msg.content);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""} group/msg`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { if (!isEditing) setShowActions(false); }}
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: isUser ? "linear-gradient(135deg, #60efff, #a855f7)" : "linear-gradient(135deg, #00ff87, #60efff)" }}
      >
        {isUser ? <User size={11} color="white" /> : <Bot size={11} color="white" />}
      </div>
      <div className={`max-w-[88%] rounded-xl px-3 py-2 relative ${isUser ? "ml-auto" : ""}`} style={{ background: isUser ? "rgba(96,239,255,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${isUser ? "rgba(96,239,255,0.12)" : "rgba(255,255,255,0.05)"}` }}>
        {/* 附件展示 */}
        {msg.attachments && msg.attachments.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            {msg.attachments.map((att) => (
              <div key={att.id} className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.06)", fontSize: "9.5px", color: "rgba(168,85,247,0.7)" }}>
                <FileCode size={9} />{att.name}
              </div>
            ))}
          </div>
        )}

        {/* 消息内容 / 编辑模式 */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-transparent border-none outline-none resize-none"
              style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", lineHeight: "1.6", minHeight: "40px" }}
              autoFocus
            />
            <div className="flex items-center gap-1.5 justify-end">
              <button
                onClick={() => { setIsEditing(false); setEditContent(msg.content); }}
                className="px-2 py-1 rounded" style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)" }}
              >
                取消
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-2 py-1 rounded" style={{ fontSize: "10px", color: "#000", background: "linear-gradient(135deg, #00ff87, #60efff)", fontWeight: 600 }}
              >
                保存并重新生成
              </button>
            </div>
          </div>
        ) : isUser ? (
          <div style={{ fontSize: "12px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{msg.content}</div>
        ) : (
          <div>{renderMarkdown(msg.content)}</div>
        )}

        {/* 操作按钮 */}
        {showActions && !isEditing && (
          <div className="flex items-center gap-0.5 mt-1.5 pt-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <MsgActionBtn icon={copied ? Check : Copy} label={copied ? "已复制" : "复制"} color={copied ? "#00ff87" : undefined} onClick={handleCopy} />
            {isUser ? (
              <MsgActionBtn icon={Pencil} label="编辑" onClick={() => setIsEditing(true)} />
            ) : (
              <>
                <MsgActionBtn icon={RefreshCw} label="重新生成" />
                <MsgActionBtn icon={GitBranch} label="从此分支" />
              </>
            )}
          </div>
        )}

        {/* 模型信息 */}
        {msg.model && !isUser && !showActions && (
          <div className="flex items-center gap-2 mt-1.5 pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.03)", fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>
            <Cpu size={8} /><span>{msg.model}</span>
            {msg.tokenCount && <span>· {msg.tokenCount} tokens</span>}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── 消息操作按钮 ─── */
const MsgActionBtn: React.FC<{
  icon: React.ElementType;
  label: string;
  color?: string;
  onClick?: () => void;
}> = ({ icon: Icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors"
    style={{ fontSize: "9px", color: color || "rgba(255,255,255,0.25)" }}
    onMouseEnter={(e) => { if (!color) e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
    onMouseLeave={(e) => { if (!color) e.currentTarget.style.color = "rgba(255,255,255,0.25)"; e.currentTarget.style.background = "transparent"; }}
    title={label}
  >
    <Icon size={9} />{label}
  </button>
);
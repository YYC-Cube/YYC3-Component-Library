/**
 * @file TerminalPanel.tsx
 * @description 终端面板 v3.0 — 新增 mkdir/rm/touch/grep/find/man/format + 彩色路径 + 输出时间戳
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v3.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, terminal, shell, command, multi-tab, autocomplete, new-commands
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, X, Terminal, ChevronRight, Trash2 } from "lucide-react";

/* ─── 类型定义 ─── */
type LineType = "input" | "output" | "error" | "info" | "success" | "warning" | "system";

interface TermLine {
  type: LineType;
  content: string;
  timestamp: number;
}

interface TermTab {
  id: string;
  name: string;
  shell: string;
  cwd: string;
  lines: TermLine[];
  history: string[];
  historyIdx: number;
  isRunning: boolean;
  pid: number;
}

/* ─── 命令集 ─── */
const allCommands = [
  "help", "clear", "ls", "cd", "pwd", "cat", "echo", "version", "build",
  "dev", "test", "lint", "format", "install", "git", "node", "pnpm",
  "tree", "env", "whoami", "date", "uptime", "history", "alias", "exit",
  "tauri", "cargo", "neofetch",
  "mkdir", "rm", "touch", "grep", "find", "man",
];

const commandResponses: Record<string, (args: string[], tab: TermTab) => TermLine[]> = {
  help: () => [
    { type: "info", content: "┌─────────────── YYC³ Terminal v3.0 ───────────────┐", timestamp: Date.now() },
    { type: "output", content: "│  help          显示帮助信息                      │", timestamp: Date.now() },
    { type: "output", content: "│  clear         清空终端                          │", timestamp: Date.now() },
    { type: "output", content: "│  ls [dir]      列出文件                          │", timestamp: Date.now() },
    { type: "output", content: "│  cd <dir>      切换目录                          │", timestamp: Date.now() },
    { type: "output", content: "│  pwd           显示当前路径                      │", timestamp: Date.now() },
    { type: "output", content: "│  cat <file>    显示文件内容                      │", timestamp: Date.now() },
    { type: "output", content: "│  mkdir <dir>   创建目录                          │", timestamp: Date.now() },
    { type: "output", content: "│  rm <file>     删除文件/目录                     │", timestamp: Date.now() },
    { type: "output", content: "│  touch <file>  创建文件                          │", timestamp: Date.now() },
    { type: "output", content: "│  grep <p> <f>  搜索文件内容                      │", timestamp: Date.now() },
    { type: "output", content: "│  find [ext]    查找文件                          │", timestamp: Date.now() },
    { type: "output", content: "│  man <cmd>     查看命令手册                      │", timestamp: Date.now() },
    { type: "output", content: "│  echo <text>   输出文本                          │", timestamp: Date.now() },
    { type: "output", content: "│  version       显示版本信息                      │", timestamp: Date.now() },
    { type: "output", content: "│  build/dev     构建/启动                         │", timestamp: Date.now() },
    { type: "output", content: "│  test/lint     测试/检查                         │", timestamp: Date.now() },
    { type: "output", content: "│  git <cmd>     Git 操作                          │", timestamp: Date.now() },
    { type: "output", content: "│  neofetch      系统信息                          │", timestamp: Date.now() },
    { type: "output", content: "│  history       命令历史                          │", timestamp: Date.now() },
    { type: "output", content: "│  env           环境变量                          │", timestamp: Date.now() },
    { type: "info", content: "└──────────────────────────────────────────────────┘", timestamp: Date.now() },
  ],
  ls: (args, tab) => {
    const files: Record<string, string> = {
      "~/yyc3-ai-code": "src/  node_modules/  package.json  tsconfig.json  vite.config.ts  README.md  .gitignore  Cargo.toml  src-tauri/",
      "~/yyc3-ai-code/src": "app/  styles/  imports/  main.tsx  vite-env.d.ts",
      "~/yyc3-ai-code/src/app": "components/  pages/  stores/  utils/  App.tsx  routes.ts",
      "~/yyc3-ai-code/src/app/stores": "aiServiceStore.ts  collaborationStore.ts  conversationStore.ts  databaseStore.ts  fileSystemStore.ts  layoutStore.ts  notificationStore.ts  pluginStore.ts  previewStore.ts  shortcutStore.ts  themeStore.ts  workspaceContextStore.ts",
    };
    const target = args[0] ? `${tab.cwd}/${args[0]}`.replace(/\/+/g, "/") : tab.cwd;
    return [{ type: "output", content: files[target] || files["~/yyc3-ai-code"] || "目录为空", timestamp: Date.now() }];
  },
  cd: (args, tab) => {
    if (!args[0] || args[0] === "~") {
      tab.cwd = "~/yyc3-ai-code";
    } else if (args[0] === "..") {
      const parts = tab.cwd.split("/");
      parts.pop();
      tab.cwd = parts.join("/") || "~";
    } else {
      tab.cwd = `${tab.cwd}/${args[0]}`.replace(/\/+/g, "/");
    }
    return [];
  },
  pwd: (_args, tab) => [{ type: "output", content: tab.cwd, timestamp: Date.now() }],
  echo: (args) => [{ type: "output", content: args.join(" "), timestamp: Date.now() }],
  version: () => [
    { type: "info", content: "YYC³ AI Code v2.0.0 (Phase 8)", timestamp: Date.now() },
    { type: "output", content: "Node.js v20.11.0  |  pnpm v8.15.0  |  Vite v5.4.0  |  Tauri v2.0.0", timestamp: Date.now() },
    { type: "output", content: "React 18.3.1  |  TypeScript 5.4  |  Rust 1.76.0", timestamp: Date.now() },
  ],
  date: () => [{ type: "output", content: new Date().toLocaleString("zh-CN"), timestamp: Date.now() }],
  whoami: () => [{ type: "success", content: "yyc3-developer", timestamp: Date.now() }],
  uptime: () => [{ type: "output", content: `系统运行时间: ${Math.floor(performance.now() / 1000)} 秒`, timestamp: Date.now() }],
  env: () => [
    { type: "output", content: "NODE_ENV=development", timestamp: Date.now() },
    { type: "output", content: "VITE_APP_TITLE=YYC³ AI Code", timestamp: Date.now() },
    { type: "output", content: "VITE_API_BASE=http://localhost:3000", timestamp: Date.now() },
    { type: "output", content: "TAURI_DEBUG=true", timestamp: Date.now() },
    { type: "output", content: "RUST_LOG=info", timestamp: Date.now() },
  ],
  neofetch: () => [
    { type: "info", content: "        ██╗   ██╗██╗   ██╗ ██████╗ ██████╗ ", timestamp: Date.now() },
    { type: "info", content: "        ╚██╗ ██╔╝╚██╗ ██╔╝██╔════╝ ╚════██╗", timestamp: Date.now() },
    { type: "info", content: "         ╚████╔╝  ╚████╔╝ ██║       █████╔╝", timestamp: Date.now() },
    { type: "info", content: "          ╚██╔╝    ╚██╔╝  ██║      ██╔═══╝ ", timestamp: Date.now() },
    { type: "info", content: "           ██║      ██║   ╚██████╗ ███████╗", timestamp: Date.now() },
    { type: "info", content: "           ╚═╝      ╚═╝    ╚═════╝ ╚══════╝", timestamp: Date.now() },
    { type: "output", content: "  OS: YYC³ AI Code Desktop 2.0 (Tauri)", timestamp: Date.now() },
    { type: "output", content: "  Host: YanYuCloudCube Workstation", timestamp: Date.now() },
    { type: "output", content: "  Shell: yyc3-bash v2.0", timestamp: Date.now() },
    { type: "output", content: "  Theme: Aurora (Dark)", timestamp: Date.now() },
    { type: "output", content: "  Terminal: YYC³ Terminal v2.0", timestamp: Date.now() },
    { type: "output", content: "  Memory: 512MB / 2048MB", timestamp: Date.now() },
    { type: "success", content: "  ██ ██ ██ ██ ██ ██ ██ ██", timestamp: Date.now() },
  ],
  cat: (args) => {
    if (!args[0]) return [{ type: "error", content: "cat: 缺少文件参数", timestamp: Date.now() }];
    const files: Record<string, string> = {
      "package.json": '{\n  "name": "yyc3-ai-code",\n  "version": "2.0.0",\n  "type": "module"\n}',
      ".gitignore": "node_modules/\ndist/\n.env\n*.log",
    };
    return [{ type: "output", content: files[args[0]] || `cat: ${args[0]}: 文件不存在`, timestamp: Date.now() }];
  },
  git: (args) => {
    const sub = args[0];
    if (sub === "status") return [
      { type: "output", content: "On branch feature/phase-8", timestamp: Date.now() },
      { type: "success", content: "Changes to be committed:", timestamp: Date.now() },
      { type: "output", content: "  modified:   src/app/components/panels/types/TerminalPanel.tsx", timestamp: Date.now() },
      { type: "output", content: "  modified:   src/app/components/panels/types/CodeEditorPanel.tsx", timestamp: Date.now() },
      { type: "warning", content: "Changes not staged for commit:", timestamp: Date.now() },
      { type: "output", content: "  modified:   src/app/components/panels/types/VersionControlPanel.tsx", timestamp: Date.now() },
    ];
    if (sub === "log") return [
      { type: "output", content: "a3f2b1c feat: Phase 7 — 协同 + 通知 + 状态栏  (2 days ago)", timestamp: Date.now() },
      { type: "output", content: "b5d4e2a feat: Phase 6 — 主题 + 快捷键 + 命令面板  (3 days ago)", timestamp: Date.now() },
      { type: "output", content: "c7f6a3b feat: Phase 5 — 搜索 + 调试 + 输出 + 插件  (4 days ago)", timestamp: Date.now() },
    ];
    if (sub === "branch") return [
      { type: "success", content: "* feature/phase-8", timestamp: Date.now() },
      { type: "output", content: "  main", timestamp: Date.now() },
      { type: "output", content: "  dev/phase-7", timestamp: Date.now() },
    ];
    return [{ type: "output", content: `git: '${sub || ""}' 使用 --help 查看帮助`, timestamp: Date.now() }];
  },
  tree: () => [
    { type: "output", content: "src/", timestamp: Date.now() },
    { type: "output", content: "├── app/", timestamp: Date.now() },
    { type: "output", content: "│   ├── components/", timestamp: Date.now() },
    { type: "output", content: "│   │   ├── panels/", timestamp: Date.now() },
    { type: "output", content: "│   │   │   └── types/  (13 panels)", timestamp: Date.now() },
    { type: "output", content: "│   │   ├── CommandPalette.tsx", timestamp: Date.now() },
    { type: "output", content: "│   │   ├── StatusBar.tsx", timestamp: Date.now() },
    { type: "output", content: "│   │   └── NotificationCenter.tsx", timestamp: Date.now() },
    { type: "output", content: "│   ├── pages/  (5 pages)", timestamp: Date.now() },
    { type: "output", content: "│   ├── stores/  (12 stores)", timestamp: Date.now() },
    { type: "output", content: "│   └── App.tsx", timestamp: Date.now() },
    { type: "info", content: "12 directories, 48 files", timestamp: Date.now() },
  ],
  mkdir: (args) => {
    if (!args[0]) return [{ type: "error", content: "mkdir: 缺少参数", timestamp: Date.now() }];
    return [{ type: "success", content: `mkdir: 已创建目录 '${args[0]}'`, timestamp: Date.now() }];
  },
  rm: (args) => {
    if (!args[0]) return [{ type: "error", content: "rm: 缺少参数", timestamp: Date.now() }];
    if (args[0] === "-rf" && args[1]) {
      return [{ type: "warning", content: `rm: 已递归删除 '${args[1]}'`, timestamp: Date.now() }];
    }
    return [{ type: "success", content: `rm: 已删除 '${args[0]}'`, timestamp: Date.now() }];
  },
  touch: (args) => {
    if (!args[0]) return [{ type: "error", content: "touch: 缺少文件名", timestamp: Date.now() }];
    return [{ type: "success", content: `touch: 已创建文件 '${args[0]}'`, timestamp: Date.now() }];
  },
  grep: (args) => {
    if (args.length < 2) return [{ type: "error", content: "grep: 用法: grep <pattern> <file>", timestamp: Date.now() }];
    const pattern = args[0];
    const mockResults: Record<string, string[]> = {
      import: [
        "App.tsx:1: import { RouterProvider } from \"react-router\";",
        "App.tsx:2: import { router } from \"./routes\";",
        "layoutStore.ts:1: import { create } from \"zustand\";",
      ],
      useState: [
        "ChatBox.tsx:3: const [input, setInput] = useState(\"\");",
        "PanelView.tsx:12: const [isActive, setIsActive] = useState(false);",
      ],
      export: [
        "App.tsx:4: export default function App() {",
        "layoutStore.ts:8: export type PanelType =",
        "routes.ts:5: export const router = createBrowserRouter([",
      ],
    };
    const results = mockResults[pattern] || [`(无匹配: '${pattern}')`];
    return results.map((r) => ({
      type: r.includes("(无匹配") ? "warning" as LineType : "output" as LineType,
      content: r,
      timestamp: Date.now(),
    }));
  },
  find: (args) => {
    const nameFilter = args.find((a) => a.startsWith("-name"))
      ? args[args.indexOf("-name") + 1]
      : args[0] || "*.tsx";
    const ext = nameFilter?.replace("*.", "") || "tsx";
    const mockFiles: Record<string, string[]> = {
      tsx: [
        "./src/app/App.tsx",
        "./src/app/pages/LayoutDesignerPage.tsx",
        "./src/app/components/panels/PanelView.tsx",
        "./src/app/components/panels/types/AIChatPanel.tsx",
        "./src/app/components/panels/types/TerminalPanel.tsx",
      ],
      ts: [
        "./src/app/stores/layoutStore.ts",
        "./src/app/stores/themeStore.ts",
        "./src/app/stores/aiServiceStore.ts",
        "./src/app/routes.ts",
      ],
    };
    const results = mockFiles[ext] || [`./src/app/example.${ext}`];
    return results.map((r) => ({ type: "output" as LineType, content: r, timestamp: Date.now() }));
  },
  man: (args) => {
    if (!args[0]) return [{ type: "error", content: "man: 需要命令名", timestamp: Date.now() }];
    const manPages: Record<string, string[]> = {
      ls: ["LS(1)", "", "名称", "  ls - 列出目录内容", "", "用法", "  ls [dir]", "", "说明", "  列出指定目录中的文件和子目录。"],
      cd: ["CD(1)", "", "名称", "  cd - 切换工作目录", "", "用法", "  cd <dir>  |  cd ..  |  cd ~", "", "说明", "  更改当前工作目录。使用 .. 返回上级，~ 回到项目根目录。"],
      grep: ["GREP(1)", "", "名称", "  grep - 搜索文件中的模式", "", "用法", "  grep <pattern> <file>", "", "说明", "  在文件中搜索匹配指定模式的行并显示结果。"],
    };
    const page = manPages[args[0]];
    if (!page) return [{ type: "warning", content: `man: 没有 '${args[0]}' 的手册页`, timestamp: Date.now() }];
    return page.map((l) => ({
      type: (l.startsWith("  ") ? "output" : "info") as LineType,
      content: l,
      timestamp: Date.now(),
    }));
  },
};

/* ─── 异步命令 (有加载过程) ─── */
const asyncCommands: Record<string, { steps: { content: string; type: LineType; delay: number }[] }> = {
  build: {
    steps: [
      { content: "vite v5.4.0 building for production...", type: "info", delay: 0 },
      { content: "transforming...", type: "output", delay: 600 },
      { content: "✓ 1,847 modules transformed.", type: "success", delay: 1200 },
      { content: "rendering chunks...", type: "output", delay: 1600 },
      { content: "dist/index.html            0.56 kB │ gzip: 0.35 kB", type: "output", delay: 2000 },
      { content: "dist/assets/index-a1b2.js  312.4 kB │ gzip: 98.7 kB", type: "output", delay: 2100 },
      { content: "dist/assets/index-c3d4.css  18.2 kB │ gzip: 4.1 kB", type: "output", delay: 2200 },
      { content: "✓ built in 2.84s", type: "success", delay: 2800 },
    ],
  },
  dev: {
    steps: [
      { content: "  VITE v5.4.0  ready in 247 ms", type: "info", delay: 300 },
      { content: "", type: "output", delay: 300 },
      { content: "  ➜  Local:   http://localhost:5173/", type: "success", delay: 400 },
      { content: "  ➜  Network: http://192.168.1.100:5173/", type: "output", delay: 400 },
      { content: "  ➜  press h + enter to show help", type: "output", delay: 500 },
    ],
  },
  test: {
    steps: [
      { content: " RUN  v1.3.0 ~/yyc3-ai-code", type: "info", delay: 0 },
      { content: "", type: "output", delay: 200 },
      { content: " ✓ stores/layoutStore.test.ts (12 tests) 45ms", type: "success", delay: 800 },
      { content: " ✓ stores/themeStore.test.ts (8 tests) 23ms", type: "success", delay: 1200 },
      { content: " ✓ components/StatusBar.test.tsx (5 tests) 67ms", type: "success", delay: 1600 },
      { content: " ✓ components/NotificationCenter.test.tsx (7 tests) 52ms", type: "success", delay: 2000 },
      { content: "", type: "output", delay: 2100 },
      { content: " Test Files  4 passed (4)", type: "success", delay: 2200 },
      { content: " Tests       32 passed (32)", type: "success", delay: 2200 },
      { content: " Duration    2.34s", type: "output", delay: 2300 },
    ],
  },
  lint: {
    steps: [
      { content: "Running ESLint...", type: "info", delay: 0 },
      { content: "src/app/stores/layoutStore.ts", type: "output", delay: 400 },
      { content: "  ⚠  12:5  Unexpected 'any'  @typescript-eslint/no-explicit-any", type: "warning", delay: 600 },
      { content: "", type: "output", delay: 800 },
      { content: "✖ 1 warning", type: "warning", delay: 1000 },
      { content: "✓ 47 files checked, 0 errors", type: "success", delay: 1200 },
    ],
  },
  install: {
    steps: [
      { content: "Packages: +0 -0", type: "info", delay: 0 },
      { content: "Progress: resolved 847, reused 847, downloaded 0, added 0, done", type: "output", delay: 800 },
      { content: "", type: "output", delay: 900 },
      { content: "Done in 1.2s", type: "success", delay: 1200 },
    ],
  },
};

/* ─── 创建终端 Tab ─── */
let tabCounter = 0;
function createTermTab(name?: string): TermTab {
  tabCounter++;
  return {
    id: `term-${Date.now()}-${tabCounter}`,
    name: name || `bash ${tabCounter}`,
    shell: "bash",
    cwd: "~/yyc3-ai-code",
    lines: [
      { type: "system", content: `YYC³ Terminal v2.0  •  Session ${tabCounter}`, timestamp: Date.now() },
      { type: "info", content: "输入 'help' 查看可用命令  |  Tab 键自动补全\n", timestamp: Date.now() },
    ],
    history: [],
    historyIdx: -1,
    isRunning: false,
    pid: 10000 + tabCounter,
  };
}

/* ─── 主组件 ─── */
export const TerminalPanel: React.FC = () => {
  const [tabs, setTabs] = useState<TermTab[]>([createTermTab()]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [activeTab?.lines?.length]);

  /* 自动补全 */
  const updateSuggestions = useCallback((val: string) => {
    if (!val.trim()) {
      setSuggestions([]);
      return;
    }
    const matches = allCommands.filter((c) => c.startsWith(val.trim().split(" ")[0].toLowerCase()));
    setSuggestions(val.includes(" ") ? [] : matches.slice(0, 6));
    setSelectedSuggestion(-1);
  }, []);

  const addLine = (tabId: string, line: TermLine) => {
    setTabs((prev) => prev.map((t) => t.id === tabId ? { ...t, lines: [...t.lines, line] } : t));
  };

  const setTabRunning = (tabId: string, running: boolean) => {
    setTabs((prev) => prev.map((t) => t.id === tabId ? { ...t, isRunning: running } : t));
  };

  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;
    const parts = cmd.trim().split(/\s+/);
    const base = parts[0].toLowerCase();
    const args = parts.slice(1);
    const tabId = activeTab.id;

    // 记录输入
    addLine(tabId, { type: "input", content: `${activeTab.cwd} $ ${cmd}`, timestamp: Date.now() });

    // 更新历史
    setTabs((prev) => prev.map((t) =>
      t.id === tabId ? { ...t, history: [cmd, ...t.history.slice(0, 100)], historyIdx: -1 } : t
    ));

    // clear 特殊处理
    if (base === "clear") {
      setTabs((prev) => prev.map((t) => t.id === tabId ? { ...t, lines: [] } : t));
      return;
    }

    // history
    if (base === "history") {
      const tab = tabs.find((t) => t.id === tabId);
      if (tab) {
        tab.history.slice(0, 20).forEach((h, i) => {
          addLine(tabId, { type: "output", content: `  ${i + 1}  ${h}`, timestamp: Date.now() });
        });
      }
      return;
    }

    // 异步命令
    if (asyncCommands[base]) {
      setTabRunning(tabId, true);
      for (const step of asyncCommands[base].steps) {
        await new Promise((r) => setTimeout(r, step.delay));
        addLine(tabId, { type: step.type, content: step.content, timestamp: Date.now() });
      }
      setTabRunning(tabId, false);
      return;
    }

    // 同步命令
    if (commandResponses[base]) {
      const tab = tabs.find((t) => t.id === tabId);
      if (tab) {
        const results = commandResponses[base](args, tab);
        // cd modifies tab.cwd in place
        if (base === "cd") {
          setTabs((prev) => prev.map((t) => t.id === tabId ? { ...t, cwd: tab.cwd } : t));
        }
        results.forEach((line) => addLine(tabId, line));
      }
      return;
    }

    // 未知命令
    addLine(tabId, { type: "error", content: `command not found: ${base}`, timestamp: Date.now() });
    addLine(tabId, { type: "output", content: `提示: 输入 'help' 查看可用命令`, timestamp: Date.now() });
  };

  const handleSubmit = () => {
    if (activeTab.isRunning) return;
    if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
      setInput(suggestions[selectedSuggestion] + " ");
      setSuggestions([]);
      setSelectedSuggestion(-1);
      return;
    }
    executeCommand(input);
    setInput("");
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tab 补全
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length > 0) {
        const idx = selectedSuggestion < 0 ? 0 : selectedSuggestion;
        setInput(suggestions[idx] + " ");
        setSuggestions([]);
      }
      return;
    }
    if (e.key === "Enter") { e.preventDefault(); handleSubmit(); return; }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestion((s) => Math.max(0, s - 1));
      } else {
        const tab = tabs.find((t) => t.id === activeTabId);
        if (tab && tab.history.length > 0) {
          const newIdx = Math.min((tab.historyIdx < 0 ? 0 : tab.historyIdx + 1), tab.history.length - 1);
          setTabs((prev) => prev.map((t) => t.id === activeTabId ? { ...t, historyIdx: newIdx } : t));
          setInput(tab.history[newIdx]);
        }
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestion((s) => Math.min(suggestions.length - 1, s + 1));
      } else {
        const tab = tabs.find((t) => t.id === activeTabId);
        if (tab) {
          if (tab.historyIdx <= 0) {
            setTabs((prev) => prev.map((t) => t.id === activeTabId ? { ...t, historyIdx: -1 } : t));
            setInput("");
          } else {
            const newIdx = tab.historyIdx - 1;
            setTabs((prev) => prev.map((t) => t.id === activeTabId ? { ...t, historyIdx: newIdx } : t));
            setInput(tab.history[newIdx]);
          }
        }
      }
      return;
    }
    if (e.key === "Escape") {
      setSuggestions([]);
      setSelectedSuggestion(-1);
    }
    // Ctrl+C 中断
    if (e.ctrlKey && e.key === "c") {
      if (activeTab.isRunning) {
        setTabRunning(activeTab.id, false);
        addLine(activeTab.id, { type: "error", content: "^C", timestamp: Date.now() });
      }
    }
    // Ctrl+L clear
    if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      setTabs((prev) => prev.map((t) => t.id === activeTabId ? { ...t, lines: [] } : t));
    }
  };

  const addTab = () => {
    const newTab = createTermTab();
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== tabId);
      if (activeTabId === tabId) setActiveTabId(next[next.length - 1].id);
      return next;
    });
  };

  const getLineColor = (type: LineType) => {
    const colors: Record<LineType, string> = {
      input: "#00ff87",
      output: "rgba(255,255,255,0.7)",
      error: "#ff6b6b",
      info: "#60efff",
      success: "#00ff87",
      warning: "#ffb86c",
      system: "rgba(168,85,247,0.6)",
    };
    return colors[type];
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#0d0d1a", color: "rgba(255,255,255,0.8)", fontFamily: "'SF Mono', 'Fira Code', monospace" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Tab 栏 */}
      <div className="flex items-center px-1 py-0.5" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: "30px" }}>
        <div className="flex items-center gap-0.5 flex-1 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className="flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer group transition-colors flex-shrink-0"
              style={{
                background: tab.id === activeTabId ? "rgba(255,255,255,0.06)" : "transparent",
                fontSize: "11px",
                color: tab.id === activeTabId ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)",
              }}
            >
              <Terminal size={10} style={{ color: tab.isRunning ? "#00ff87" : undefined }} />
              <span>{tab.name}</span>
              {tab.isRunning && (
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00ff87" }} />
              )}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                  className="opacity-0 group-hover:opacity-40 hover:!opacity-80 transition-opacity"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
          <button onClick={addTab} className="w-5 h-5 flex items-center justify-center rounded opacity-30 hover:opacity-60" title="新终端">
            <Plus size={12} />
          </button>
          <button
            onClick={() => setTabs((prev) => prev.map((t) => t.id === activeTabId ? { ...t, lines: [] } : t))}
            className="w-5 h-5 flex items-center justify-center rounded opacity-20 hover:opacity-50"
            title="清空"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* 输出区 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2" style={{ fontSize: "12px", lineHeight: "18px" }}>
        {activeTab.lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap" style={{ color: getLineColor(line.type) }}>
            {line.content}
          </div>
        ))}
        {activeTab.isRunning && (
          <div className="flex items-center gap-1.5 mt-1" style={{ color: "rgba(96,239,255,0.5)", fontSize: "11px" }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#60efff" }} />
            运行中...
          </div>
        )}
      </div>

      {/* 补全提示 */}
      {suggestions.length > 0 && (
        <div className="px-3 pb-1">
          <div className="flex items-center gap-1 flex-wrap" style={{ fontSize: "10.5px" }}>
            {suggestions.map((s, i) => (
              <span
                key={s}
                className="px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                style={{
                  background: i === selectedSuggestion ? "rgba(0,255,135,0.1)" : "rgba(255,255,255,0.04)",
                  color: i === selectedSuggestion ? "#00ff87" : "rgba(255,255,255,0.4)",
                  border: `1px solid ${i === selectedSuggestion ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.06)"}`,
                }}
                onClick={() => { setInput(s + " "); setSuggestions([]); inputRef.current?.focus(); }}
              >
                {s}
              </span>
            ))}
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>Tab 补全</span>
          </div>
        </div>
      )}

      {/* 输入行 */}
      <div className="flex items-center px-3 py-1.5 gap-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", minHeight: "32px" }}>
        <span style={{ color: "#a855f7", fontSize: "10px" }} className="flex-shrink-0 truncate" title={activeTab.cwd}>
          {activeTab.cwd.split("/").pop()}
        </span>
        <ChevronRight size={10} style={{ color: "#00ff87", flexShrink: 0 }} />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); updateSuggestions(e.target.value); }}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none min-w-0"
          style={{ fontSize: "12px", lineHeight: "18px", color: "rgba(255,255,255,0.9)", fontFamily: "inherit" }}
          spellCheck={false}
          autoFocus
          disabled={activeTab.isRunning}
          placeholder={activeTab.isRunning ? "运行中..." : ""}
        />
      </div>
    </div>
  );
};
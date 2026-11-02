/**
 * @file searchService.ts
 * @description 多模式搜索引擎 — 文件/内容全文/符号/命令 四种搜索模式
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-18
 * @updated 2026-03-18
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags search, content, symbol, command, full-text
 */

import type { SearchResult } from "../stores/sidebarStore";

/* ─── 模拟内容索引（全文匹配） ─── */
const CONTENT_INDEX: { file: string; line: number; text: string }[] = [
  { file: "/src/app/App.tsx", line: 5, text: "import { RouterProvider } from 'react-router';" },
  { file: "/src/app/App.tsx", line: 12, text: "export default function App() {" },
  { file: "/src/app/stores/layoutStore.ts", line: 127, text: "createPanel: (type: PanelType, title?: string) => string;" },
  { file: "/src/app/stores/layoutStore.ts", line: 139, text: "createTab: (panelId: string, type: PanelType, title?: string) => string;" },
  { file: "/src/app/stores/layoutStore.ts", line: 619, text: "toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed }))," },
  { file: "/src/app/stores/taskStore.ts", line: 15, text: "export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';" },
  { file: "/src/app/stores/taskStore.ts", line: 16, text: "export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';" },
  { file: "/src/app/stores/sidebarStore.ts", line: 264, text: "export const useSidebarStore = create<SidebarState & SidebarActions>()" },
  { file: "/src/app/components/StatusBar.tsx", line: 10, text: "export const StatusBar: React.FC = () => {" },
  { file: "/src/app/components/panels/LeftSidebar.tsx", line: 48, text: "export const LeftSidebar: React.FC = () => {" },
  { file: "/src/app/routes.ts", line: 8, text: "{ path: '/layout-designer', Component: LayoutDesignerPage }," },
  { file: "/src/app/routes.ts", line: 9, text: "{ path: '/ai-workbench', Component: WorkbenchPage }," },
  { file: "/src/app/routes.ts", line: 10, text: "{ path: '/settings', Component: SettingsPage }," },
  { file: "/src/app/stores/layoutStore.ts", line: 44, text: "export type PanelType = 'code-editor' | 'terminal' | 'preview' | 'ai-chat'" },
  { file: "/src/app/components/homepage/ChatBox.tsx", line: 77, text: "export const ChatBox: React.FC = () => {" },
  { file: "/src/app/services/gitBridgeService.ts", line: 80, text: "export const gitBridgeService = {" },
];

/* ─── 模拟符号索引 ─── */
const SYMBOL_INDEX: { name: string; kind: string; file: string; line: number }[] = [
  { name: "App", kind: "function", file: "/src/app/App.tsx", line: 12 },
  { name: "useLayoutStore", kind: "store", file: "/src/app/stores/layoutStore.ts", line: 264 },
  { name: "useSidebarStore", kind: "store", file: "/src/app/stores/sidebarStore.ts", line: 264 },
  { name: "useTaskStore", kind: "store", file: "/src/app/stores/taskStore.ts", line: 50 },
  { name: "useThemeStore", kind: "store", file: "/src/app/stores/themeStore.ts", line: 20 },
  { name: "useI18nStore", kind: "store", file: "/src/app/stores/i18nStore.ts", line: 1365 },
  { name: "LeftSidebar", kind: "component", file: "/src/app/components/panels/LeftSidebar.tsx", line: 48 },
  { name: "StatusBar", kind: "component", file: "/src/app/components/StatusBar.tsx", line: 10 },
  { name: "ActivityBar", kind: "component", file: "/src/app/components/panels/ActivityBar.tsx", line: 57 },
  { name: "ChatBox", kind: "component", file: "/src/app/components/homepage/ChatBox.tsx", line: 77 },
  { name: "BrandHeader", kind: "component", file: "/src/app/components/homepage/BrandHeader.tsx", line: 18 },
  { name: "FileNode", kind: "interface", file: "/src/app/stores/sidebarStore.ts", line: 32 },
  { name: "SearchResult", kind: "interface", file: "/src/app/stores/sidebarStore.ts", line: 47 },
  { name: "GitChange", kind: "interface", file: "/src/app/stores/sidebarStore.ts", line: 64 },
  { name: "TaskStatus", kind: "type", file: "/src/app/stores/taskStore.ts", line: 15 },
  { name: "TaskPriority", kind: "type", file: "/src/app/stores/taskStore.ts", line: 16 },
  { name: "PanelType", kind: "type", file: "/src/app/stores/layoutStore.ts", line: 44 },
  { name: "SidebarSection", kind: "type", file: "/src/app/stores/sidebarStore.ts", line: 20 },
  { name: "gitBridgeService", kind: "object", file: "/src/app/services/gitBridgeService.ts", line: 80 },
  { name: "analyzeIntent", kind: "function", file: "/src/app/utils/intentAnalyzer.ts", line: 5 },
  { name: "analyzeProgrammingDepth", kind: "function", file: "/src/app/utils/programmingDepthAnalyzer.ts", line: 10 },
];

/* ─── 命令搜索 ─── */
const COMMANDS = [
  { name: "打开设置", id: "settings" },
  { name: "切换侧栏", id: "toggle-sidebar" },
  { name: "新建文件", id: "new-file" },
  { name: "新建任务", id: "new-task" },
  { name: "打开任务看板", id: "task-board" },
  { name: "保存布局", id: "save-layout" },
  { name: "重置布局", id: "reset-layout" },
  { name: "Git 提交", id: "git-commit" },
  { name: "Git 推送", id: "git-push" },
  { name: "Git 拉取", id: "git-pull" },
  { name: "打开终端", id: "open-terminal" },
  { name: "切换主题", id: "toggle-theme" },
  { name: "切换语言", id: "toggle-language" },
];

export const searchService = {
  contentSearch(query: string): SearchResult[] {
    const q = query.toLowerCase();
    return CONTENT_INDEX
      .filter((e) => e.text.toLowerCase().includes(q))
      .map((e, i) => ({
        id: `content-${i}-${Date.now()}`,
        type: "content" as const,
        title: e.text.trim().substring(0, 80),
        filePath: e.file,
        line: e.line,
        score: e.text.toLowerCase().indexOf(q) === 0 ? 1 : 0.7,
        preview: e.text.trim(),
        description: `${e.file}:${e.line}`,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  },

  symbolSearch(query: string): SearchResult[] {
    const q = query.toLowerCase();
    return SYMBOL_INDEX
      .filter((s) => s.name.toLowerCase().includes(q))
      .map((s, i) => ({
        id: `symbol-${i}-${Date.now()}`,
        type: "symbol" as const,
        title: s.name,
        filePath: s.file,
        line: s.line,
        score: s.name.toLowerCase().startsWith(q) ? 1 : 0.65,
        description: `${s.kind} — ${s.file}:${s.line}`,
        preview: s.kind,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  },

  commandSearch(query: string): SearchResult[] {
    const q = query.toLowerCase();
    return COMMANDS
      .filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
      .map((c, i) => ({
        id: `cmd-${i}-${Date.now()}`,
        type: "command" as const,
        title: c.name,
        filePath: "",
        score: c.name.toLowerCase().startsWith(q) ? 1 : 0.7,
        description: `命令: ${c.id}`,
      }))
      .sort((a, b) => b.score - a.score);
  },
};

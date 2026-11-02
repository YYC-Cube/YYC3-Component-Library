/**
 * @file shortcutStore.ts
 * @description 全局快捷键注册 + 命令系统 + 可配置映射 + 命令面板数据
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, shortcut, keyboard, command, keybinding, hotkey
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */
export type CommandCategory =
  | "general"
  | "editor"
  | "panel"
  | "navigation"
  | "debug"
  | "ai"
  | "file"
  | "view"
  | "terminal";

export interface Command {
  id: string;
  label: string;
  description?: string;
  category: CommandCategory;
  shortcut: string;
  /** 默认快捷键 (不可修改的展示) */
  defaultShortcut: string;
  action: () => void;
  icon?: string;
  enabled: boolean;
}

export interface ShortcutConflict {
  commandId: string;
  conflictsWith: string;
  shortcut: string;
}

/* ─── 类别元数据 ─── */
export const categoryMeta: Record<CommandCategory, { label: string; icon: string }> = {
  general: { label: "通用", icon: "Zap" },
  editor: { label: "编辑器", icon: "Code" },
  panel: { label: "面板", icon: "LayoutDashboard" },
  navigation: { label: "导航", icon: "Compass" },
  debug: { label: "调试", icon: "Bug" },
  ai: { label: "AI", icon: "Bot" },
  file: { label: "文件", icon: "File" },
  view: { label: "视图", icon: "Eye" },
  terminal: { label: "终端", icon: "Terminal" },
};

/* ─── Store 接口 ─── */
interface ShortcutStore {
  commands: Command[];
  customBindings: Record<string, string>;
  commandPaletteOpen: boolean;
  recentCommands: string[];

  /* ─── 命令面板 ─── */
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;

  /* ─── 命令管理 ─── */
  registerCommand: (cmd: Omit<Command, "action"> & { action?: () => void }) => void;
  executeCommand: (id: string) => void;
  setShortcut: (commandId: string, shortcut: string) => void;
  resetShortcut: (commandId: string) => void;
  resetAllShortcuts: () => void;
  getConflicts: (shortcut: string, excludeId?: string) => ShortcutConflict[];
  getCommandsByCategory: (category: CommandCategory) => Command[];
  searchCommands: (query: string) => Command[];

  /* ─── 键盘事件处理 ─── */
  handleKeyDown: (e: KeyboardEvent) => boolean;
}

/* ─── 快捷键格式化 ─── */
const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent);

export function formatShortcut(shortcut: string): string {
  if (!shortcut) return "";
  return shortcut
    .replace(/Mod/g, isMac ? "⌘" : "Ctrl")
    .replace(/Ctrl/g, isMac ? "⌃" : "Ctrl")
    .replace(/Alt/g, isMac ? "⌥" : "Alt")
    .replace(/Shift/g, isMac ? "⇧" : "Shift")
    .replace(/\+/g, " + ");
}

export function parseKeyEvent(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push("Mod");
  if (e.altKey) parts.push("Alt");
  if (e.shiftKey) parts.push("Shift");
  const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
  if (!["Control", "Meta", "Alt", "Shift"].includes(key)) parts.push(key);
  return parts.join("+");
}

/* ─── 默认命令列表 ─── */
function createDefaultCommands(): Command[] {
  return [
    // 通用
    { id: "command-palette", label: "命令面板", category: "general", shortcut: "Mod+K", defaultShortcut: "Mod+K", action: () => {}, icon: "Search", enabled: true },
    { id: "settings", label: "打开设置", category: "general", shortcut: "Mod+,", defaultShortcut: "Mod+,", action: () => {}, icon: "Settings", enabled: true },
    { id: "save", label: "保存文件", category: "general", shortcut: "Mod+S", defaultShortcut: "Mod+S", action: () => {}, icon: "Save", enabled: true },
    { id: "save-all", label: "保存全部", category: "general", shortcut: "Mod+Shift+S", defaultShortcut: "Mod+Shift+S", action: () => {}, icon: "Save", enabled: true },

    // 文件
    { id: "new-file", label: "新建文件", category: "file", shortcut: "Mod+N", defaultShortcut: "Mod+N", action: () => {}, icon: "FilePlus", enabled: true },
    { id: "open-file", label: "打开文件", category: "file", shortcut: "Mod+O", defaultShortcut: "Mod+O", action: () => {}, icon: "FolderOpen", enabled: true },
    { id: "close-tab", label: "关闭当前标签", category: "file", shortcut: "Mod+W", defaultShortcut: "Mod+W", action: () => {}, icon: "X", enabled: true },

    // 编辑器
    { id: "find", label: "查找", category: "editor", shortcut: "Mod+F", defaultShortcut: "Mod+F", action: () => {}, icon: "Search", enabled: true },
    { id: "find-replace", label: "查找替换", category: "editor", shortcut: "Mod+H", defaultShortcut: "Mod+H", action: () => {}, icon: "Replace", enabled: true },
    { id: "global-search", label: "全局搜索", category: "editor", shortcut: "Mod+Shift+F", defaultShortcut: "Mod+Shift+F", action: () => {}, icon: "Search", enabled: true },
    { id: "goto-line", label: "跳转到行", category: "editor", shortcut: "Mod+G", defaultShortcut: "Mod+G", action: () => {}, icon: "ArrowRight", enabled: true },
    { id: "format-code", label: "格式化代码", category: "editor", shortcut: "Mod+Shift+I", defaultShortcut: "Mod+Shift+I", action: () => {}, icon: "AlignLeft", enabled: true },

    // 面板
    { id: "toggle-sidebar", label: "切换侧边栏", category: "panel", shortcut: "Mod+B", defaultShortcut: "Mod+B", action: () => {}, icon: "PanelLeft", enabled: true },
    { id: "toggle-terminal", label: "切换终端", category: "panel", shortcut: "Mod+`", defaultShortcut: "Mod+`", action: () => {}, icon: "Terminal", enabled: true },
    { id: "toggle-preview", label: "切换预览", category: "panel", shortcut: "Mod+Shift+P", defaultShortcut: "Mod+Shift+P", action: () => {}, icon: "Eye", enabled: true },
    { id: "split-horizontal", label: "水平分割", category: "panel", shortcut: "Mod+\\", defaultShortcut: "Mod+\\", action: () => {}, icon: "Columns", enabled: true },
    { id: "focus-editor", label: "聚焦编辑器", category: "panel", shortcut: "Mod+1", defaultShortcut: "Mod+1", action: () => {}, icon: "Code", enabled: true },

    // 导航
    { id: "go-home", label: "返回首页", category: "navigation", shortcut: "Alt+H", defaultShortcut: "Alt+H", action: () => {}, icon: "House", enabled: true },
    { id: "go-back", label: "后退", category: "navigation", shortcut: "Alt+ArrowLeft", defaultShortcut: "Alt+ArrowLeft", action: () => {}, icon: "ArrowLeft", enabled: true },
    { id: "quick-open", label: "快速打开文件", category: "navigation", shortcut: "Mod+P", defaultShortcut: "Mod+P", action: () => {}, icon: "File", enabled: true },

    // AI
    { id: "ai-chat", label: "打开 AI 助手", category: "ai", shortcut: "Mod+Shift+A", defaultShortcut: "Mod+Shift+A", action: () => {}, icon: "Bot", enabled: true },
    { id: "ai-explain", label: "AI 解释代码", category: "ai", shortcut: "Mod+Shift+E", defaultShortcut: "Mod+Shift+E", action: () => {}, icon: "MessageSquare", enabled: true },
    { id: "ai-generate", label: "AI 生成代码", category: "ai", shortcut: "Mod+Shift+G", defaultShortcut: "Mod+Shift+G", action: () => {}, icon: "Sparkles", enabled: true },

    // 调试
    { id: "start-debug", label: "开始调试", category: "debug", shortcut: "F5", defaultShortcut: "F5", action: () => {}, icon: "Play", enabled: true },
    { id: "step-over", label: "单步跳过", category: "debug", shortcut: "F10", defaultShortcut: "F10", action: () => {}, icon: "SkipForward", enabled: true },
    { id: "step-into", label: "单步进入", category: "debug", shortcut: "F11", defaultShortcut: "F11", action: () => {}, icon: "ArrowDownToLine", enabled: true },
    { id: "toggle-breakpoint", label: "切换断点", category: "debug", shortcut: "F9", defaultShortcut: "F9", action: () => {}, icon: "Circle", enabled: true },

    // 视图
    { id: "zoom-in", label: "放大", category: "view", shortcut: "Mod+=", defaultShortcut: "Mod+=", action: () => {}, icon: "ZoomIn", enabled: true },
    { id: "zoom-out", label: "缩小", category: "view", shortcut: "Mod+-", defaultShortcut: "Mod+-", action: () => {}, icon: "ZoomOut", enabled: true },
    { id: "reset-zoom", label: "重置缩放", category: "view", shortcut: "Mod+0", defaultShortcut: "Mod+0", action: () => {}, icon: "Maximize", enabled: true },
    { id: "fullscreen", label: "全屏", category: "view", shortcut: "F11", defaultShortcut: "F11", action: () => {}, icon: "Maximize2", enabled: true },

    // 终端
    { id: "new-terminal", label: "新建终端", category: "terminal", shortcut: "Mod+Shift+`", defaultShortcut: "Mod+Shift+`", action: () => {}, icon: "Plus", enabled: true },
    { id: "clear-terminal", label: "清除终端", category: "terminal", shortcut: "Mod+Shift+C", defaultShortcut: "Mod+Shift+C", action: () => {}, icon: "Trash2", enabled: true },
  ];
}

export const useShortcutStore = create<ShortcutStore>()(
  persist(
    (set, get) => ({
      commands: createDefaultCommands(),
      customBindings: {},
      commandPaletteOpen: false,
      recentCommands: [],

      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
      toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),

      registerCommand: (cmd) => {
        const existing = get().commands.find((c) => c.id === cmd.id);
        if (existing) return;
        const newCmd: Command = {
          ...cmd,
          action: cmd.action || (() => {}),
        };
        set({ commands: [...get().commands, newCmd] });
      },

      executeCommand: (id) => {
        const cmd = get().commands.find((c) => c.id === id);
        if (cmd?.enabled) {
          cmd.action();
          const recent = [id, ...get().recentCommands.filter((r) => r !== id)].slice(0, 10);
          set({ recentCommands: recent, commandPaletteOpen: false });
        }
      },

      setShortcut: (commandId, shortcut) => {
        set((s) => ({
          customBindings: { ...s.customBindings, [commandId]: shortcut },
          commands: s.commands.map((c) =>
            c.id === commandId ? { ...c, shortcut } : c
          ),
        }));
      },

      resetShortcut: (commandId) => {
        const cmd = get().commands.find((c) => c.id === commandId);
        if (!cmd) return;
        const { [commandId]: _, ...rest } = get().customBindings;
        set({
          customBindings: rest,
          commands: get().commands.map((c) =>
            c.id === commandId ? { ...c, shortcut: c.defaultShortcut } : c
          ),
        });
      },

      resetAllShortcuts: () => {
        set({
          customBindings: {},
          commands: get().commands.map((c) => ({ ...c, shortcut: c.defaultShortcut })),
        });
      },

      getConflicts: (shortcut, excludeId) => {
        return get()
          .commands.filter((c) => c.shortcut === shortcut && c.id !== excludeId)
          .map((c) => ({ commandId: c.id, conflictsWith: excludeId || "", shortcut }));
      },

      getCommandsByCategory: (category) =>
        get().commands.filter((c) => c.category === category),

      searchCommands: (query) => {
        if (!query.trim()) return get().commands;
        const q = query.toLowerCase();
        return get().commands.filter(
          (c) =>
            c.label.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q) ||
            (c.description || "").toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
        );
      },

      handleKeyDown: (e) => {
        const pressed = parseKeyEvent(e);
        const cmd = get().commands.find((c) => c.enabled && c.shortcut === pressed);
        if (cmd) {
          e.preventDefault();
          e.stopPropagation();
          get().executeCommand(cmd.id);
          return true;
        }
        return false;
      },
    }),
    {
      name: "yyc3-shortcuts",
      partialize: (s) => ({
        customBindings: s.customBindings,
        recentCommands: s.recentCommands,
      }),
      merge: (persisted: any, current) => {
        const merged = { ...current, ...(persisted || {}) };
        // Re-apply custom bindings
        if (persisted?.customBindings) {
          merged.commands = current.commands.map((c: Command) =>
            persisted.customBindings[c.id]
              ? { ...c, shortcut: persisted.customBindings[c.id] }
              : c
          );
        }
        return merged;
      },
    }
  )
);
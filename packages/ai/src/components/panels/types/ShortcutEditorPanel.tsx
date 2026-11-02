/**
 * @file ShortcutEditorPanel.tsx
 * @description 快捷键可视化编辑器面板 — 分类浏览/冲突检测/按键录入/搜索筛选/重置绑定
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, shortcut, keyboard, editor, keybinding, hotkey, conflict
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Keyboard, Search, RotateCcw, TriangleAlert, Check,
  X, ChevronDown, ChevronRight, Zap, Code, LayoutDashboard as LayoutIcon,
  Compass, Bug, Bot, File, Eye, Terminal,
  Circle, Pencil,
} from "lucide-react";
import {
  useShortcutStore,
  type Command,
  type CommandCategory,
  categoryMeta,
  formatShortcut,
  parseKeyEvent,
} from "../../../stores/shortcutStore";

/* ─── 类别图标映射 ─── */
const categoryIcons: Record<CommandCategory, React.ElementType> = {
  general: Zap,
  editor: Code,
  panel: LayoutIcon,
  navigation: Compass,
  debug: Bug,
  ai: Bot,
  file: File,
  view: Eye,
  terminal: Terminal,
};

/* ─── 按键录入组件 ─── */
const KeyRecorder: React.FC<{
  commandId: string;
  currentShortcut: string;
  onFinish: () => void;
}> = ({ commandId, currentShortcut, onFinish }) => {
  const [recording, setRecording] = useState(true);
  const [pressedKeys, setPressedKeys] = useState("");
  const [conflicts, setConflicts] = useState<string[]>([]);
  const { setShortcut, getConflicts } = useShortcutStore();
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (recording && inputRef.current) {
      inputRef.current.focus();
    }
  }, [recording]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const combo = parseKeyEvent(e.nativeEvent);
      if (combo === "Escape") {
        onFinish();
        return;
      }
      // Ignore modifier-only presses
      if (["Mod", "Alt", "Shift", "Control", "Meta"].includes(combo)) return;

      setPressedKeys(combo);
      const found = getConflicts(combo, commandId);
      setConflicts(found.map((c) => c.commandId));
    },
    [commandId, getConflicts, onFinish]
  );

  const handleApply = () => {
    if (pressedKeys) {
      setShortcut(commandId, pressedKeys);
    }
    onFinish();
  };

  return (
    <div
      className="flex items-center gap-2 rounded-lg px-2 py-1.5"
      style={{
        background: "rgba(96,239,255,0.06)",
        border: "1px solid rgba(96,239,255,0.2)",
      }}
    >
      <div
        ref={inputRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex-1 px-2 py-1 rounded text-center outline-none"
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: pressedKeys ? "#00ff87" : "rgba(255,255,255,0.4)",
          background: "rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.08)",
          minWidth: "120px",
        }}
      >
        {pressedKeys ? formatShortcut(pressedKeys) : "按下按键组合..."}
      </div>

      {/* 冲突警告 */}
      {conflicts.length > 0 && (
        <div className="flex items-center gap-1" style={{ color: "#ffb86c", fontSize: "10px" }}>
          <TriangleAlert size={12} />
          <span>冲突: {conflicts.join(", ")}</span>
        </div>
      )}

      <button
        onClick={handleApply}
        disabled={!pressedKeys}
        className="w-6 h-6 rounded flex items-center justify-center transition-colors"
        style={{
          background: pressedKeys ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.04)",
          color: pressedKeys ? "#00ff87" : "rgba(255,255,255,0.2)",
        }}
        title="应用"
      >
        <Check size={12} />
      </button>
      <button
        onClick={onFinish}
        className="w-6 h-6 rounded flex items-center justify-center transition-colors"
        style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}
        title="取消"
      >
        <X size={12} />
      </button>
    </div>
  );
};

/* ─── 命令行组件 ─── */
const CommandRow: React.FC<{ command: Command }> = ({ command }) => {
  const [editing, setEditing] = useState(false);
  const { resetShortcut } = useShortcutStore();
  const isCustom = command.shortcut !== command.defaultShortcut;

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group"
      style={{ background: "rgba(255,255,255,0.01)" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.01)"; }}
    >
      {/* 命令名称 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>
            {command.label}
          </span>
          {isCustom && (
            <span
              className="px-1.5 py-0.5 rounded-full"
              style={{
                fontSize: "8px",
                background: "rgba(96,239,255,0.1)",
                color: "#60efff",
                border: "1px solid rgba(96,239,255,0.15)",
              }}
            >
              已自定义
            </span>
          )}
        </div>
        {command.description && (
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
            {command.description}
          </span>
        )}
      </div>

      {/* 快捷键显示/编辑 */}
      <div className="flex items-center gap-1.5">
        {editing ? (
          <KeyRecorder
            commandId={command.id}
            currentShortcut={command.shortcut}
            onFinish={() => setEditing(false)}
          />
        ) : (
          <>
            <kbd
              className="px-2 py-0.5 rounded"
              style={{
                fontSize: "11px",
                fontWeight: 500,
                fontFamily: "monospace",
                background: "rgba(255,255,255,0.06)",
                color: isCustom ? "#60efff" : "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {formatShortcut(command.shortcut)}
            </kbd>

            {/* 编辑按钮 */}
            <button
              onClick={() => setEditing(true)}
              className="w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity"
              style={{ color: "rgba(255,255,255,0.6)" }}
              title="修改快捷键"
            >
              <Pencil size={11} />
            </button>

            {/* 重置按钮 */}
            {isCustom && (
              <button
                onClick={() => resetShortcut(command.id)}
                className="w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity"
                style={{ color: "#ffb86c" }}
                title={`恢复默认: ${formatShortcut(command.defaultShortcut)}`}
              >
                <RotateCcw size={11} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ─── 主面板 ─── */
export const ShortcutEditorPanel: React.FC = () => {
  const { commands, resetAllShortcuts, searchCommands, getCommandsByCategory } =
    useShortcutStore();
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<CommandCategory>>(
    new Set(Object.keys(categoryMeta) as CommandCategory[])
  );
  const [activeFilter, setActiveFilter] = useState<"all" | "custom">("all");

  const toggleCategory = (cat: CommandCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const filteredCommands = search ? searchCommands(search) : commands;
  const customCount = commands.filter((c) => c.shortcut !== c.defaultShortcut).length;

  const displayCommands =
    activeFilter === "custom"
      ? filteredCommands.filter((c) => c.shortcut !== c.defaultShortcut)
      : filteredCommands;

  const categories = Object.keys(categoryMeta) as CommandCategory[];

  return (
    <div className="flex flex-col h-full" style={{ background: "#14142a" }}>
      {/* 头部 */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <Keyboard size={14} style={{ color: "#a855f7" }} />
          <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
            快捷键编辑器
          </span>
          <span
            className="px-1.5 py-0.5 rounded-full"
            style={{ fontSize: "9px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}
          >
            {commands.length} 命令
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {customCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full"
              style={{
                fontSize: "9px",
                background: "rgba(96,239,255,0.08)",
                color: "#60efff",
                border: "1px solid rgba(96,239,255,0.12)",
              }}
            >
              {customCount} 已自定义
            </span>
          )}
          <button
            onClick={resetAllShortcuts}
            className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
            style={{
              fontSize: "10.5px",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ffb86c"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
            title="恢复全部默认快捷键"
          >
            <RotateCcw size={10} />
            全部重置
          </button>
        </div>
      </div>

      {/* 搜索栏 + 筛选 */}
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div
          className="flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Search size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索命令或快捷键..."
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="opacity-30 hover:opacity-70">
              <X size={12} />
            </button>
          )}
        </div>

        {/* 筛选切换 */}
        <div className="flex items-center gap-0.5 rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
          {(["all", "custom"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="px-2.5 py-1.5 transition-colors"
              style={{
                fontSize: "10.5px",
                background: activeFilter === filter ? "rgba(0,255,135,0.08)" : "transparent",
                color: activeFilter === filter ? "#00ff87" : "rgba(255,255,255,0.35)",
              }}
            >
              {filter === "all" ? "全部" : `自定义 (${customCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* 命令列表 */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}>
        {search ? (
          /* 搜索结果平铺 */
          <div className="p-2 flex flex-col gap-0.5">
            {displayCommands.length === 0 ? (
              <div className="flex items-center justify-center py-8 opacity-25" style={{ fontSize: "12px" }}>
                未找到匹配命令
              </div>
            ) : (
              displayCommands.map((cmd) => <CommandRow key={cmd.id} command={cmd} />)
            )}
          </div>
        ) : (
          /* 分类折叠 */
          <div className="p-2 flex flex-col gap-1">
            {categories.map((cat) => {
              const catCommands = displayCommands.filter((c) => c.category === cat);
              if (catCommands.length === 0) return null;
              const expanded = expandedCategories.has(cat);
              const meta = categoryMeta[cat];
              const CatIcon = categoryIcons[cat];

              return (
                <div key={cat}>
                  {/* 类别标题 */}
                  <button
                    onClick={() => toggleCategory(cat)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                  >
                    {expanded ? (
                      <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
                    ) : (
                      <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
                    )}
                    <CatIcon size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
                    <span style={{ fontSize: "11.5px", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
                      {meta.label}
                    </span>
                    <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>
                      {catCommands.length}
                    </span>
                  </button>

                  {/* 命令列表 */}
                  {expanded && (
                    <div className="ml-2 mt-0.5 flex flex-col gap-0.5">
                      {catCommands.map((cmd) => (
                        <CommandRow key={cmd.id} command={cmd} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)" }}
      >
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>
          点击编辑按钮录入新快捷键 · 按 Esc 取消
        </span>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)" }}>
          {displayCommands.length} / {commands.length}
        </span>
      </div>
    </div>
  );
};
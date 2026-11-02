/**
 * @file CommandPalette.tsx
 * @description 全局命令面板 — Ctrl+Shift+P / Mod+K 呼出，统一调度面板/布局/AI/文件操作
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags command-palette, search, shortcut, command, dispatcher
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Search, X, Clock, Zap,
  Code, LayoutDashboard, Compass, Bug, Bot, File, Eye, Terminal,
  ArrowUp, ArrowDown, CornerDownLeft,
} from "lucide-react";
import {
  useShortcutStore,
  formatShortcut,
  type Command,
  type CommandCategory,
  categoryMeta,
} from "../stores/shortcutStore";

/* ─── 分类图标映射 ─── */
const categoryIcons: Record<CommandCategory, React.ElementType> = {
  general: Zap,
  editor: Code,
  panel: LayoutDashboard,
  navigation: Compass,
  debug: Bug,
  ai: Bot,
  file: File,
  view: Eye,
  terminal: Terminal,
};

/* ─── 命令面板组件 ─── */
export const CommandPalette: React.FC = () => {
  const {
    commands,
    commandPaletteOpen,
    closeCommandPalette,
    executeCommand,
    recentCommands,
    searchCommands,
  } = useShortcutStore();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* 搜索结果 */
  const results = useMemo(() => {
    if (!query.trim()) {
      // 未输入时: 最近 + 全部(按分类分组)
      const recent = recentCommands
        .map((id) => commands.find((c) => c.id === id))
        .filter(Boolean) as Command[];
      return { recent, grouped: groupByCategory(commands), flat: [...recent, ...commands] };
    }
    const matched = searchCommands(query);
    return { recent: [], grouped: groupByCategory(matched), flat: matched };
  }, [query, commands, recentCommands, searchCommands]);

  /* 扁平化列表便于键盘导航 */
  const flatList = useMemo(() => {
    const list: (Command | { kind: "header"; label: string })[] = [];
    const recentIds = new Set(results.recent.map((c) => c.id));
    if (results.recent.length > 0 && !query.trim()) {
      list.push({ kind: "header", label: "最近使用" });
      results.recent.forEach((c) => list.push(c));
    }
    for (const [cat, cmds] of Object.entries(results.grouped)) {
      // 排除已在最近使用中显示的命令
      const filtered = query.trim() ? cmds : cmds.filter((c) => !recentIds.has(c.id));
      if (filtered.length === 0) continue;
      list.push({ kind: "header", label: categoryMeta[cat as CommandCategory]?.label || cat });
      filtered.forEach((c) => list.push(c));
    }
    return list;
  }, [results, query]);

  /* 可选择的命令索引 */
  const selectableIndices = useMemo(
    () => flatList.map((item, i) => ("kind" in item ? -1 : i)).filter((i) => i >= 0),
    [flatList]
  );

  /* 打开时聚焦 */
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [commandPaletteOpen]);

  /* 滚动到可视 */
  useEffect(() => {
    if (!listRef.current) return;
    const idx = selectableIndices[selectedIndex];
    if (idx === undefined) return;
    const el = listRef.current.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex, selectableIndices]);

  /* 键盘导航 */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, selectableIndices.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const idx = selectableIndices[selectedIndex];
        const item = flatList[idx];
        if (item && !("kind" in item)) {
          executeCommand(item.id);
          closeCommandPalette();
        }
      } else if (e.key === "Escape") {
        closeCommandPalette();
      }
    },
    [selectedIndex, selectableIndices, flatList, executeCommand, closeCommandPalette]
  );

  /* 执行命令 */
  const handleSelect = useCallback(
    (cmd: Command) => {
      executeCommand(cmd.id);
      closeCommandPalette();
    },
    [executeCommand, closeCommandPalette]
  );

  if (!commandPaletteOpen) return null;

  let selectableCount = -1;

  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 z-[100]"
        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
        onClick={closeCommandPalette}
      />

      {/* 面板 */}
      <div
        className="fixed z-[101] flex flex-col"
        style={{
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "560px",
          maxWidth: "90vw",
          maxHeight: "65vh",
          background: "rgba(16,16,32,0.97)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          backdropFilter: "blur(24px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
          animation: "commandPaletteIn 0.15s ease-out",
          overflow: "hidden",
        }}
      >
        {/* 搜索栏 */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Search size={15} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="输入命令名称或关键字..."
            className="flex-1 bg-transparent border-none outline-none"
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.85)",
              caretColor: "#00ff87",
            }}
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* 命令列表 */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto py-1"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.05) transparent" }}
        >
          {flatList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-30">
              <Search size={20} />
              <span style={{ fontSize: "12px" }}>未找到匹配命令</span>
            </div>
          ) : (
            flatList.map((item, i) => {
              if ("kind" in item) {
                /* 分类头 */
                return (
                  <div
                    key={`header-${item.label}-${i}`}
                    className="flex items-center gap-1.5 px-4 py-1.5 mt-1"
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.25)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.label === "最近使用" && <Clock size={9} />}
                    {item.label}
                  </div>
                );
              }

              /* 命令项 */
              selectableCount++;
              const currentSelectIdx = selectableCount;
              const isSelected = currentSelectIdx === selectedIndex;
              const CatIcon = categoryIcons[item.category] || Zap;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2.5 px-4 py-2 mx-1.5 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: isSelected ? "rgba(0,255,135,0.06)" : "transparent",
                    border: isSelected ? "1px solid rgba(0,255,135,0.1)" : "1px solid transparent",
                  }}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(currentSelectIdx)}
                >
                  {/* 分类图标 */}
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isSelected ? "rgba(0,255,135,0.08)" : "rgba(255,255,255,0.03)",
                      color: isSelected ? "#00ff87" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    <CatIcon size={11} />
                  </div>

                  {/* 命令名 */}
                  <div className="flex-1 min-w-0">
                    <span
                      className="truncate block"
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: isSelected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {highlightMatch(item.label, query)}
                    </span>
                    {item.description && (
                      <span
                        className="truncate block"
                        style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}
                      >
                        {item.description}
                      </span>
                    )}
                  </div>

                  {/* 快捷键 */}
                  {item.shortcut && (
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {formatShortcut(item.shortcut).split(" + ").map((key, ki) => (
                        <React.Fragment key={ki}>
                          {ki > 0 && (
                            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.1)" }}>+</span>
                          )}
                          <kbd
                            className="px-1 py-0 rounded"
                            style={{
                              fontSize: "10px",
                              fontWeight: 500,
                              color: isSelected ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.06)",
                              fontFamily: "inherit",
                            }}
                          >
                            {key}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 底部提示 */}
        <div
          className="flex items-center justify-center gap-4 px-4 py-2 flex-shrink-0"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            fontSize: "10px",
            color: "rgba(255,255,255,0.15)",
          }}
        >
          <span className="flex items-center gap-1">
            <ArrowUp size={9} />
            <ArrowDown size={9} />
            导航
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft size={9} />
            确认
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 rounded" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>Esc</kbd>
            关闭
          </span>
        </div>
      </div>

      {/* 动画 */}
      <style>{`
        @keyframes commandPaletteIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};

/* ─── 辅助函数 ─── */

/** 按分类分组 */
function groupByCategory(cmds: Command[]): Record<string, Command[]> {
  const groups: Record<string, Command[]> = {};
  cmds.forEach((c) => {
    if (!groups[c.category]) groups[c.category] = [];
    groups[c.category].push(c);
  });
  return groups;
}

/** 高亮匹配文本 */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const q = query.toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: "#00ff87", fontWeight: 600 }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}
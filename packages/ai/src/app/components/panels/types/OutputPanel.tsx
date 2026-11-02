/**
 * @file OutputPanel.tsx
 * @description 输出面板 — 构建日志、任务运行器、多通道输出、自动滚动
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, output, build-log, task-runner, channel
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FileOutput, Trash2, ArrowDown, ListFilter, X,
  Play, Square, CircleCheck, CircleAlert, Clock,
  ChevronDown, RefreshCw, Copy, Download, Search,
} from "lucide-react";

/* ─── 类型 ─── */
type OutputLevel = "info" | "warn" | "error" | "success" | "debug";

interface OutputLine {
  id: string;
  timestamp: number;
  level: OutputLevel;
  channel: string;
  message: string;
  source?: string;
}

type OutputChannel = "build" | "tasks" | "extensions" | "git" | "debug";

/* ─── 模拟构建日志 ─── */
function generateBuildLog(): OutputLine[] {
  const now = Date.now();
  return [
    { id: "o1", timestamp: now - 12000, level: "info", channel: "build", message: "[vite] v5.4.0 启动开发服务器..." },
    { id: "o2", timestamp: now - 11500, level: "info", channel: "build", message: "[vite] 正在预构建依赖..." },
    { id: "o3", timestamp: now - 10000, level: "debug", channel: "build", message: "[vite] 预构建: react, react-dom, zustand, react-router" },
    { id: "o4", timestamp: now - 9000, level: "success", channel: "build", message: "[vite] 预构建完成 (1.2s)" },
    { id: "o5", timestamp: now - 8000, level: "info", channel: "build", message: "[vite] 处理 42 个模块..." },
    { id: "o6", timestamp: now - 7000, level: "warn", channel: "build", message: "[vite] 警告: 'motion' 包大小 > 500KB，建议按需导入" },
    { id: "o7", timestamp: now - 6000, level: "info", channel: "build", message: "[TypeScript] 类型检查中..." },
    { id: "o8", timestamp: now - 5000, level: "success", channel: "build", message: "[TypeScript] 0 个错误, 2 个警告" },
    { id: "o9", timestamp: now - 4500, level: "warn", channel: "build", message: "[TypeScript] src/app/stores/pluginStore.ts:45 - 未使用的变量 'PluginHook'" },
    { id: "o10", timestamp: now - 4000, level: "info", channel: "build", message: "[Tailwind CSS] 扫描到 1,234 个工具类" },
    { id: "o11", timestamp: now - 3000, level: "success", channel: "build", message: "[vite] 开发服务器就绪 (280ms)" },
    { id: "o12", timestamp: now - 2500, level: "info", channel: "build", message: "  ➜  Local:   http://localhost:5173/" },
    { id: "o13", timestamp: now - 2000, level: "info", channel: "build", message: "  ➜  Network: http://192.168.1.100:5173/" },
    { id: "o14", timestamp: now - 1000, level: "info", channel: "build", message: "[HMR] 已连接，等待文件变更..." },
    { id: "o15", timestamp: now - 500, level: "info", channel: "tasks", message: "[Task] pnpm dev 运行中 (PID: 12345)" },
    { id: "o16", timestamp: now - 400, level: "success", channel: "tasks", message: "[Task] lint:check 通过 — 0 个问题" },
    { id: "o17", timestamp: now - 300, level: "info", channel: "extensions", message: "[Plugin] yyc3-git-integration v2.0.0 已加载" },
    { id: "o18", timestamp: now - 200, level: "info", channel: "extensions", message: "[Plugin] yyc3-local-sqlite v1.0.0 已加载" },
    { id: "o19", timestamp: now - 100, level: "info", channel: "git", message: "[Git] 当前分支: main | 8 个未提交变更" },
  ];
}

/* ─── 输出行 ─── */
const OutputLineItem: React.FC<{ line: OutputLine; showTime: boolean }> = ({ line, showTime }) => {
  const levelColors: Record<OutputLevel, string> = {
    info: "rgba(255,255,255,0.6)",
    warn: "#ffb86c",
    error: "#ff6b6b",
    success: "#00ff87",
    debug: "#a855f7",
  };
  const levelIcons: Record<OutputLevel, React.ElementType> = {
    info: FileOutput,
    warn: CircleAlert,
    error: CircleAlert,
    success: CircleCheck,
    debug: Search,
  };
  const Icon = levelIcons[line.level];

  return (
    <div
      className="flex items-start gap-1.5 px-3 py-[2px] font-mono transition-colors"
      style={{
        fontSize: "11.5px",
        lineHeight: "18px",
        color: levelColors[line.level],
        background: line.level === "error" ? "rgba(255,107,107,0.03)" : line.level === "warn" ? "rgba(255,184,108,0.02)" : "transparent",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = line.level === "error" ? "rgba(255,107,107,0.05)" : "rgba(255,255,255,0.02)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = line.level === "error" ? "rgba(255,107,107,0.03)" : line.level === "warn" ? "rgba(255,184,108,0.02)" : "transparent"; }}
    >
      {showTime && (
        <span className="opacity-20 flex-shrink-0" style={{ fontSize: "9.5px", minWidth: "55px" }}>
          {new Date(line.timestamp).toLocaleTimeString()}
        </span>
      )}
      <Icon size={11} className="flex-shrink-0 mt-[3px] opacity-50" />
      <span className="flex-1 whitespace-pre-wrap break-all">{line.message}</span>
    </div>
  );
};

/* ─── 主面板 ─── */
export const OutputPanel: React.FC = () => {
  const [lines, setLines] = useState<OutputLine[]>(generateBuildLog);
  const [activeChannel, setActiveChannel] = useState<OutputChannel | "all">("all");
  const [filterLevel, setFilterLevel] = useState<OutputLevel | "all">("all");
  const [showTimestamp, setShowTimestamp] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [lines, autoScroll]);

  const channels: { id: OutputChannel | "all"; label: string }[] = [
    { id: "all", label: "全部" },
    { id: "build", label: "构建" },
    { id: "tasks", label: "任务" },
    { id: "extensions", label: "扩展" },
    { id: "git", label: "Git" },
    { id: "debug", label: "调试" },
  ];

  const filteredLines = lines.filter((l) => {
    if (activeChannel !== "all" && l.channel !== activeChannel) return false;
    if (filterLevel !== "all" && l.level !== filterLevel) return false;
    if (searchQuery && !l.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const levelCounts = {
    error: lines.filter((l) => l.level === "error").length,
    warn: lines.filter((l) => l.level === "warn").length,
    info: lines.filter((l) => l.level === "info").length,
  };

  const addLine = useCallback((level: OutputLevel, message: string, channel: OutputChannel = "build") => {
    setLines((prev) => [
      ...prev,
      { id: `o-${Date.now()}`, timestamp: Date.now(), level, channel, message },
    ]);
  }, []);

  const handleRunBuild = () => {
    addLine("info", "[vite] 文件变更检测: src/app/App.tsx");
    setTimeout(() => addLine("info", "[HMR] 热更新 1 个模块..."), 200);
    setTimeout(() => addLine("success", "[HMR] 更新完成 (45ms)"), 500);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#0d0d1a", color: "rgba(255,255,255,0.8)" }}>
      {/* 工具栏 */}
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", minHeight: "32px" }}
      >
        {/* 通道切换 */}
        <div className="flex items-center gap-0.5">
          {channels.map((ch) => {
            const count = ch.id === "all" ? lines.length : lines.filter((l) => l.channel === ch.id).length;
            if (ch.id !== "all" && count === 0) return null;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className="px-1.5 py-0.5 rounded transition-colors"
                style={{
                  fontSize: "10px",
                  color: activeChannel === ch.id ? "#00ff87" : "rgba(255,255,255,0.35)",
                  background: activeChannel === ch.id ? "rgba(0,255,135,0.06)" : "transparent",
                }}
              >
                {ch.label}
                {count > 0 && <span className="ml-0.5 opacity-40">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* 右侧按钮 */}
        <div className="flex items-center gap-0.5">
          {/* 级别状态 */}
          {levelCounts.error > 0 && (
            <span className="flex items-center gap-0.5 px-1 rounded" style={{ fontSize: "9px", color: "#ff6b6b" }}>
              <CircleAlert size={9} />{levelCounts.error}
            </span>
          )}
          {levelCounts.warn > 0 && (
            <span className="flex items-center gap-0.5 px-1 rounded" style={{ fontSize: "9px", color: "#ffb86c" }}>
              <CircleAlert size={9} />{levelCounts.warn}
            </span>
          )}

          <button onClick={() => setShowSearch(!showSearch)} className="w-5 h-5 flex items-center justify-center rounded transition-colors" style={{ color: showSearch ? "#60efff" : "rgba(255,255,255,0.25)" }}>
            <Search size={10} />
          </button>
          <button onClick={() => setShowTimestamp(!showTimestamp)} className="w-5 h-5 flex items-center justify-center rounded transition-colors" style={{ color: showTimestamp ? "#60efff" : "rgba(255,255,255,0.25)" }} title="时间戳">
            <Clock size={10} />
          </button>
          <button onClick={() => setAutoScroll(!autoScroll)} className="w-5 h-5 flex items-center justify-center rounded transition-colors" style={{ color: autoScroll ? "#00ff87" : "rgba(255,255,255,0.25)" }} title="自动滚动">
            <ArrowDown size={10} />
          </button>
          <button onClick={handleRunBuild} className="w-5 h-5 flex items-center justify-center rounded opacity-30 hover:opacity-60" title="模拟 HMR">
            <RefreshCw size={10} />
          </button>
          <button onClick={() => setLines([])} className="w-5 h-5 flex items-center justify-center rounded opacity-25 hover:opacity-50" title="清除输出">
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      {showSearch && (
        <div className="flex items-center gap-1.5 px-3 py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(96,239,255,0.02)" }}>
          <Search size={10} className="opacity-30" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="过滤输出..."
            autoFocus
            className="flex-1 bg-transparent border-none outline-none"
            style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="opacity-30 hover:opacity-60"><X size={10} /></button>
          )}
          <span className="opacity-20" style={{ fontSize: "9px" }}>{filteredLines.length}/{lines.length}</span>
        </div>
      )}

      {/* 级别过滤 */}
      <div className="flex items-center gap-0.5 px-2 py-0.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
        {(["all", "error", "warn", "info", "success", "debug"] as const).map((level) => {
          const labels: Record<string, string> = { all: "全部", error: "错误", warn: "警告", info: "信息", success: "成功", debug: "调试" };
          const colors: Record<string, string> = { all: "rgba(255,255,255,0.5)", error: "#ff6b6b", warn: "#ffb86c", info: "rgba(255,255,255,0.6)", success: "#00ff87", debug: "#a855f7" };
          return (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className="px-1.5 py-0.5 rounded transition-colors"
              style={{
                fontSize: "9.5px",
                color: filterLevel === level ? colors[level] : "rgba(255,255,255,0.2)",
                background: filterLevel === level ? `${colors[level]}10` : "transparent",
              }}
            >
              {labels[level]}
            </button>
          );
        })}
      </div>

      {/* 输出内容 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-1" style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
        {filteredLines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 opacity-20">
            <FileOutput size={24} />
            <span style={{ fontSize: "11px" }}>暂无输出</span>
          </div>
        ) : (
          filteredLines.map((line) => (
            <OutputLineItem key={line.id} line={line} showTime={showTimestamp} />
          ))
        )}
      </div>
    </div>
  );
};
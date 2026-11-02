/**
 * @file DebugPanel.tsx
 * @description 调试面板 — 断点管理、变量监视、调用栈、执行控制
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, debug, breakpoint, variable, callstack, step
 */

import React, { useState } from "react";
import {
  Play, Pause, SkipForward, ArrowDownToLine, ArrowUpFromLine, Square,
  RotateCcw, Circle, X, ChevronRight, ChevronDown,
  FileCode, Eye, EyeOff, Plus, Trash2, Bug,
  Zap, TriangleAlert, CircleCheck,
} from "lucide-react";

/* ─── 类型 ─── */
interface Breakpoint {
  id: string;
  file: string;
  line: number;
  enabled: boolean;
  condition?: string;
  hitCount: number;
}

interface WatchVariable {
  id: string;
  name: string;
  value: string;
  type: string;
  scope: "local" | "global" | "closure";
  children?: WatchVariable[];
}

interface CallFrame {
  id: string;
  functionName: string;
  file: string;
  line: number;
  column: number;
}

type DebugState = "idle" | "running" | "paused" | "stopped";

/* ─── 模拟数据 ─── */
const mockBreakpoints: Breakpoint[] = [
  { id: "bp1", file: "App.tsx", line: 5, enabled: true, hitCount: 3 },
  { id: "bp2", file: "ChatBox.tsx", line: 42, enabled: true, condition: "input.length > 0", hitCount: 12 },
  { id: "bp3", file: "layoutStore.ts", line: 128, enabled: false, hitCount: 0 },
  { id: "bp4", file: "previewStore.ts", line: 67, enabled: true, hitCount: 7 },
];

const mockVariables: WatchVariable[] = [
  { id: "v1", name: "panels", value: "Object (5)", type: "Record<string, PanelState>", scope: "local",
    children: [
      { id: "v1-1", name: "panel-editor", value: '{id: "panel-editor", type: "code-editor", ...}', type: "PanelState", scope: "local" },
      { id: "v1-2", name: "panel-preview", value: '{id: "panel-preview", type: "preview", ...}', type: "PanelState", scope: "local" },
    ],
  },
  { id: "v2", name: "activePanelId", value: '"panel-editor"', type: "string | null", scope: "local" },
  { id: "v3", name: "layoutTree", value: '{kind: "split", direction: "horizontal", ...}', type: "LayoutNode", scope: "local" },
  { id: "v4", name: "isCompiling", value: "false", type: "boolean", scope: "global" },
  { id: "v5", name: "previewMode", value: '"realtime"', type: "PreviewMode", scope: "global" },
  { id: "v6", name: "activeProvider", value: '"openai"', type: "string", scope: "closure" },
];

const mockCallStack: CallFrame[] = [
  { id: "f1", functionName: "compileAndRender", file: "previewStore.ts", line: 67, column: 5 },
  { id: "f2", functionName: "setCode", file: "previewStore.ts", line: 52, column: 12 },
  { id: "f3", functionName: "handleCodeChange", file: "CodeEditorPanel.tsx", line: 89, column: 7 },
  { id: "f4", functionName: "onChange", file: "CodeEditorPanel.tsx", line: 142, column: 15 },
  { id: "f5", functionName: "React.dispatchEvent", file: "react-dom.js", line: 3456, column: 3 },
];

/* ─── 可展开的变量行 ─── */
const VariableRow: React.FC<{ variable: WatchVariable; depth: number }> = ({ variable, depth }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = variable.children && variable.children.length > 0;

  const typeColor: Record<string, string> = {
    string: "#ce9178",
    boolean: "#569cd6",
    number: "#b5cea8",
  };

  const valueColor = variable.value.startsWith('"') ? "#ce9178"
    : ["true", "false"].includes(variable.value) ? "#569cd6"
    : /^\d/.test(variable.value) ? "#b5cea8"
    : "rgba(255,255,255,0.6)";

  return (
    <>
      <div
        className="flex items-center gap-1.5 py-[3px] px-2 cursor-pointer transition-colors"
        style={{ paddingLeft: `${depth * 14 + 8}px`, fontSize: "11.5px" }}
        onClick={() => hasChildren && setExpanded(!expanded)}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown size={10} className="opacity-40 flex-shrink-0" /> : <ChevronRight size={10} className="opacity-40 flex-shrink-0" />
        ) : (
          <span className="w-2.5 flex-shrink-0" />
        )}
        <span style={{ color: "#9cdcfe" }}>{variable.name}</span>
        <span className="opacity-20">:</span>
        <span className="truncate" style={{ color: valueColor }}>{variable.value}</span>
        <span className="ml-auto opacity-15 flex-shrink-0" style={{ fontSize: "9px" }}>{variable.type}</span>
      </div>
      {expanded && variable.children?.map((child) => (
        <VariableRow key={child.id} variable={child} depth={depth + 1} />
      ))}
    </>
  );
};

/* ─── 主面板 ─── */
export const DebugPanel: React.FC = () => {
  const [debugState, setDebugState] = useState<DebugState>("idle");
  const [breakpoints, setBreakpoints] = useState(mockBreakpoints);
  const [activeSection, setActiveSection] = useState<"variables" | "breakpoints" | "callstack" | "watch">("variables");
  const [watchExpressions, setWatchExpressions] = useState<string[]>(["panels.length", "activePanelId"]);
  const [newWatch, setNewWatch] = useState("");

  const stateColors: Record<DebugState, string> = {
    idle: "rgba(255,255,255,0.3)",
    running: "#00ff87",
    paused: "#ffb86c",
    stopped: "#ff6b6b",
  };
  const stateLabels: Record<DebugState, string> = {
    idle: "就绪",
    running: "运行中",
    paused: "已暂停",
    stopped: "已停止",
  };

  const toggleBreakpoint = (id: string) => {
    setBreakpoints((bp) => bp.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)));
  };

  const removeBreakpoint = (id: string) => {
    setBreakpoints((bp) => bp.filter((b) => b.id !== id));
  };

  const handleStart = () => {
    setDebugState("running");
    setTimeout(() => setDebugState("paused"), 1200);
  };

  const sections = [
    { id: "variables" as const, label: "变量" },
    { id: "breakpoints" as const, label: `断点 (${breakpoints.length})` },
    { id: "callstack" as const, label: "调用栈" },
    { id: "watch" as const, label: "监视" },
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: "#14142a", color: "rgba(255,255,255,0.85)" }}>
      {/* 调试控制栏 */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex items-center gap-1">
          {debugState === "idle" || debugState === "stopped" ? (
            <button onClick={handleStart} className="w-6 h-6 flex items-center justify-center rounded transition-colors" style={{ color: "#00ff87", background: "rgba(0,255,135,0.1)" }} title="开始调试">
              <Play size={13} />
            </button>
          ) : (
            <>
              {debugState === "paused" ? (
                <button onClick={() => setDebugState("running")} className="w-6 h-6 flex items-center justify-center rounded" style={{ color: "#00ff87", background: "rgba(0,255,135,0.1)" }} title="继续">
                  <Play size={13} />
                </button>
              ) : (
                <button onClick={() => setDebugState("paused")} className="w-6 h-6 flex items-center justify-center rounded" style={{ color: "#ffb86c", background: "rgba(255,184,108,0.1)" }} title="暂停">
                  <Pause size={13} />
                </button>
              )}
              <button onClick={() => setDebugState("stopped")} className="w-6 h-6 flex items-center justify-center rounded opacity-50 hover:opacity-80" style={{ color: "#ff6b6b" }} title="停止">
                <Square size={11} />
              </button>
              <div className="w-px h-4 mx-0.5" style={{ background: "rgba(255,255,255,0.08)" }} />
              <button className="w-6 h-6 flex items-center justify-center rounded opacity-40 hover:opacity-70" title="单步跳过"><SkipForward size={12} /></button>
              <button className="w-6 h-6 flex items-center justify-center rounded opacity-40 hover:opacity-70" title="单步进入"><ArrowDownToLine size={12} /></button>
              <button className="w-6 h-6 flex items-center justify-center rounded opacity-40 hover:opacity-70" title="单步跳出"><ArrowUpFromLine size={12} /></button>
              <button onClick={() => { setDebugState("stopped"); setTimeout(handleStart, 300); }} className="w-6 h-6 flex items-center justify-center rounded opacity-40 hover:opacity-70" title="重启"><RotateCcw size={11} /></button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: stateColors[debugState] }} />
          <span style={{ fontSize: "10.5px", color: stateColors[debugState] }}>{stateLabels[debugState]}</span>
        </div>
      </div>

      {/* 区块切换 */}
      <div className="flex items-center gap-0.5 px-2 py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className="px-2 py-1 rounded transition-colors"
            style={{
              fontSize: "10.5px",
              color: activeSection === s.id ? "#00ff87" : "rgba(255,255,255,0.4)",
              background: activeSection === s.id ? "rgba(0,255,135,0.06)" : "transparent",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto">
        {/* 变量 */}
        {activeSection === "variables" && (
          debugState === "paused" ? (
            <div className="py-1">
              {["local", "global", "closure"].map((scope) => {
                const vars = mockVariables.filter((v) => v.scope === scope);
                if (vars.length === 0) return null;
                const labels: Record<string, string> = { local: "局部变量", global: "全局变量", closure: "闭包变量" };
                return (
                  <div key={scope}>
                    <div className="px-3 py-1" style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.02)" }}>
                      {labels[scope]}
                    </div>
                    {vars.map((v) => <VariableRow key={v.id} variable={v} depth={0} />)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-2 opacity-20">
              <Bug size={24} />
              <span style={{ fontSize: "11px" }}>启动调试后查看变量</span>
            </div>
          )
        )}

        {/* 断点 */}
        {activeSection === "breakpoints" && (
          <div className="py-1">
            {breakpoints.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-20">
                <Circle size={20} />
                <span style={{ fontSize: "11px" }}>暂无断点</span>
              </div>
            ) : (
              breakpoints.map((bp) => (
                <div
                  key={bp.id}
                  className="flex items-center gap-2 px-3 py-1.5 transition-colors"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <button onClick={() => toggleBreakpoint(bp.id)}>
                    <Circle
                      size={10}
                      fill={bp.enabled ? "#ff6b6b" : "transparent"}
                      style={{ color: bp.enabled ? "#ff6b6b" : "rgba(255,255,255,0.2)" }}
                    />
                  </button>
                  <FileCode size={11} className="opacity-30" />
                  <span className="flex-1 min-w-0" style={{ fontSize: "11.5px" }}>
                    <span className="opacity-70">{bp.file}</span>
                    <span className="opacity-30 mx-1">:</span>
                    <span style={{ color: "#60efff" }}>{bp.line}</span>
                  </span>
                  {bp.condition && (
                    <span className="truncate px-1 rounded" style={{ fontSize: "9px", maxWidth: "100px", background: "rgba(255,184,108,0.08)", color: "#ffb86c" }}>
                      {bp.condition}
                    </span>
                  )}
                  <span className="opacity-15" style={{ fontSize: "9px" }}>×{bp.hitCount}</span>
                  <button onClick={() => removeBreakpoint(bp.id)} className="opacity-15 hover:opacity-50 flex-shrink-0" style={{ color: "#ff6b6b" }}>
                    <X size={10} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* 调用栈 */}
        {activeSection === "callstack" && (
          debugState === "paused" ? (
            <div className="py-1">
              {mockCallStack.map((frame, i) => (
                <div
                  key={frame.id}
                  className="flex items-center gap-2 px-3 py-1.5 transition-colors cursor-pointer"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    background: i === 0 ? "rgba(255,184,108,0.04)" : "transparent",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = i === 0 ? "rgba(255,184,108,0.06)" : "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = i === 0 ? "rgba(255,184,108,0.04)" : "transparent"; }}
                >
                  <span style={{ fontSize: "11.5px", color: i === 0 ? "#ffb86c" : "rgba(255,255,255,0.5)" }}>
                    {frame.functionName}
                  </span>
                  <span className="ml-auto opacity-25" style={{ fontSize: "10px" }}>
                    {frame.file}:{frame.line}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-2 opacity-20">
              <Zap size={24} />
              <span style={{ fontSize: "11px" }}>暂停执行后查看调用栈</span>
            </div>
          )
        )}

        {/* 监视表达式 */}
        {activeSection === "watch" && (
          <div className="py-1">
            <div className="px-3 py-1.5 flex items-center gap-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <input
                value={newWatch}
                onChange={(e) => setNewWatch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newWatch.trim()) {
                    setWatchExpressions((w) => [...w, newWatch.trim()]);
                    setNewWatch("");
                  }
                }}
                placeholder="添加监视表达式..."
                className="flex-1 bg-transparent border-none outline-none"
                style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}
              />
              <button
                onClick={() => { if (newWatch.trim()) { setWatchExpressions((w) => [...w, newWatch.trim()]); setNewWatch(""); } }}
                className="opacity-30 hover:opacity-60"
              >
                <Plus size={11} />
              </button>
            </div>
            {watchExpressions.map((expr, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 transition-colors"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: "11.5px" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <Eye size={10} className="opacity-30" />
                <span style={{ color: "#9cdcfe" }}>{expr}</span>
                <span className="opacity-20">→</span>
                <span style={{ color: debugState === "paused" ? "#ce9178" : "rgba(255,255,255,0.2)" }}>
                  {debugState === "paused" ? '"evaluating..."' : "—"}
                </span>
                <button
                  onClick={() => setWatchExpressions((w) => w.filter((_, j) => j !== i))}
                  className="ml-auto opacity-15 hover:opacity-50"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
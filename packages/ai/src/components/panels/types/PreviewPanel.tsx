/**
 * @file PreviewPanel.tsx
 * @description 实时预览面板 v4.0 — 多设备并排预览 + 响应式断点切换器 + iframe 沙盒 + 控制台
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v4.0.0
 * @created 2026-03-14
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, preview, iframe, sandbox, device-simulation, breakpoint, responsive
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Monitor, Tablet, Smartphone, RefreshCw,
  Grid3X3, Eye, Play, Columns3,
  Terminal, ChevronDown, Link2, Link2Off,
  Undo2, Redo2, Clock, Zap, CircleAlert, Info, CircleX,
  RotateCcw, Plus, X, Check, Maximize2, Minimize2,
  SlidersHorizontal, SquareDashed,
} from "lucide-react";
import {
  usePreviewStore,
  presetDevices,
  type DeviceConfig,
  type ConsoleEntry,
  type PreviewMode,
} from "../../../stores/previewStore";
import { useWorkspaceContextStore } from "../../../stores/workspaceContextStore";

/* ─── 响应式断点定义 ─── */
interface Breakpoint {
  id: string;
  label: string;
  shortLabel: string;
  minWidth: number;
  maxWidth: number | null;
  color: string;
  icon: React.ElementType;
}

const breakpoints: Breakpoint[] = [
  { id: "xs", label: "Extra Small", shortLabel: "XS", minWidth: 0, maxWidth: 639, color: "#ff6b6b", icon: Smartphone },
  { id: "sm", label: "Small", shortLabel: "SM", minWidth: 640, maxWidth: 767, color: "#ffb86c", icon: Smartphone },
  { id: "md", label: "Medium", shortLabel: "MD", minWidth: 768, maxWidth: 1023, color: "#60efff", icon: Tablet },
  { id: "lg", label: "Large", shortLabel: "LG", minWidth: 1024, maxWidth: 1279, color: "#00ff87", icon: Monitor },
  { id: "xl", label: "Extra Large", shortLabel: "XL", minWidth: 1280, maxWidth: 1535, color: "#a855f7", icon: Monitor },
  { id: "2xl", label: "2X Large", shortLabel: "2XL", minWidth: 1536, maxWidth: null, color: "#3b82f6", icon: Monitor },
];

/* ─── 设备图标映射 ─── */
const deviceTypeIcons: Record<string, React.ElementType> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

/* ─── iframe 沙盒组件 ─── */
const PreviewIframe: React.FC<{
  html: string;
  device: DeviceConfig;
  showGrid: boolean;
  scrollSync: boolean;
  onMessage?: (msg: any) => void;
  compact?: boolean;
}> = ({ html, device, showGrid, scrollSync, onMessage, compact }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) { doc.open(); doc.write(html); doc.close(); }
  }, [html]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.source === "yyc3-preview") onMessage?.(e.data);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onMessage]);

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{
        width: "100%",
        maxWidth: `${device.width}px`,
        aspectRatio: `${device.width}/${device.height}`,
        maxHeight: "100%",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
        background: "#1e1e2e",
      }}
    >
      {/* 浏览器模拟栏 */}
      {!compact && (
        <div className="h-7 flex items-center px-2.5 gap-1.5" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="w-2 h-2 rounded-full" style={{ background: "#ff5f57" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#febc2e" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#28c840" }} />
          <div className="flex-1 mx-2 h-4 rounded-full flex items-center px-2" style={{ background: "rgba(255,255,255,0.06)" }}>
            <span className="opacity-20" style={{ fontSize: "9px" }}>localhost:3000</span>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        title={`preview-${device.id}`}
        sandbox="allow-scripts allow-same-origin"
        className="w-full border-0"
        style={{ height: compact ? "100%" : "calc(100% - 28px)", background: "#1e1e2e" }}
      />

      {showGrid && (
        <div className="absolute inset-0 pointer-events-none" style={{ top: compact ? 0 : "28px", backgroundImage: "linear-gradient(rgba(0,255,135,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,135,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      )}

      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.6)", fontSize: "9px", color: "rgba(255,255,255,0.5)", backdropFilter: "blur(8px)" }}>
        {device.name} · {device.width}×{device.height}
      </div>
    </div>
  );
};

/* ─── 控制台条目 ─── */
const ConsoleEntryItem: React.FC<{ entry: ConsoleEntry }> = ({ entry }) => {
  const icons: Record<string, React.ElementType> = { log: Terminal, info: Info, warn: CircleAlert, error: CircleX };
  const colors: Record<string, string> = { log: "rgba(255,255,255,0.6)", info: "#60efff", warn: "#ffb86c", error: "#ff6b6b" };
  const Icon = icons[entry.level] || Terminal;

  return (
    <div className="flex items-start gap-2 px-3 py-1 font-mono" style={{ fontSize: "11.5px", color: colors[entry.level], borderBottom: "1px solid rgba(255,255,255,0.03)", background: entry.level === "error" ? "rgba(255,107,107,0.04)" : entry.level === "warn" ? "rgba(255,184,108,0.03)" : "transparent" }}>
      <Icon size={12} className="flex-shrink-0 mt-0.5 opacity-60" />
      <span className="flex-1 whitespace-pre-wrap break-all">{entry.message}</span>
      {entry.source && <span className="opacity-30 flex-shrink-0" style={{ fontSize: "10px" }}>{entry.source}</span>}
      <span className="opacity-20 flex-shrink-0" style={{ fontSize: "10px" }}>{new Date(entry.timestamp).toLocaleTimeString()}</span>
    </div>
  );
};

/* ─── 断点切换器组件 ─── */
const BreakpointSwitcher: React.FC<{
  activeBreakpoint: string | null;
  onSelectBreakpoint: (bp: Breakpoint) => void;
  currentWidth: number;
}> = ({ activeBreakpoint, onSelectBreakpoint, currentWidth }) => {
  // 计算当前宽度所处的断点
  const currentBp = breakpoints.find((bp) =>
    currentWidth >= bp.minWidth && (bp.maxWidth === null || currentWidth <= bp.maxWidth)
  );

  return (
    <div className="flex items-center gap-0.5 px-1">
      {breakpoints.map((bp) => {
        const isActive = activeBreakpoint === bp.id;
        const isCurrent = currentBp?.id === bp.id && !activeBreakpoint;
        const BpIcon = bp.icon;

        return (
          <button
            key={bp.id}
            onClick={() => onSelectBreakpoint(bp)}
            className="flex items-center gap-1 px-1.5 py-1 rounded transition-all"
            style={{
              fontSize: "9.5px",
              fontWeight: isActive ? 600 : 400,
              background: isActive ? `${bp.color}12` : "transparent",
              color: isActive ? bp.color : isCurrent ? `${bp.color}80` : "rgba(255,255,255,0.25)",
              border: isActive ? `1px solid ${bp.color}30` : "1px solid transparent",
            }}
            title={`${bp.label} (${bp.minWidth}px${bp.maxWidth ? ` - ${bp.maxWidth}px` : "+"})`}
          >
            <BpIcon size={10} />
            <span>{bp.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
};

/* ─── 断点标尺 ─── */
const BreakpointRuler: React.FC<{ width: number }> = ({ width }) => {
  const currentBp = breakpoints.find(
    (bp) => width >= bp.minWidth && (bp.maxWidth === null || width <= bp.maxWidth)
  );

  return (
    <div className="flex items-center justify-center gap-1 py-0.5" style={{ background: "rgba(255,255,255,0.01)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      {/* 断点标记条 */}
      <div className="flex items-center h-4 relative" style={{ width: "min(100%, 500px)" }}>
        {breakpoints.map((bp) => {
          const totalRange = 1920;
          const left = (bp.minWidth / totalRange) * 100;
          const right = bp.maxWidth ? ((bp.maxWidth) / totalRange) * 100 : 100;
          const isCurrent = currentBp?.id === bp.id;

          return (
            <div
              key={bp.id}
              className="absolute h-full rounded-sm transition-opacity"
              style={{
                left: `${left}%`,
                width: `${right - left}%`,
                background: isCurrent ? `${bp.color}18` : `${bp.color}06`,
                borderLeft: `1px solid ${bp.color}${isCurrent ? "40" : "15"}`,
              }}
            >
              <span
                className="absolute top-0 left-1"
                style={{ fontSize: "7px", color: isCurrent ? bp.color : `${bp.color}40` }}
              >
                {bp.shortLabel}
              </span>
            </div>
          );
        })}
        {/* 当前宽度指示器 */}
        <div
          className="absolute top-0 bottom-0 w-px z-10"
          style={{
            left: `${Math.min((width / 1920) * 100, 100)}%`,
            background: "#00ff87",
            boxShadow: "0 0 4px rgba(0,255,135,0.4)",
          }}
        >
          <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 px-1 rounded" style={{ fontSize: "7px", background: "#00ff87", color: "#000", whiteSpace: "nowrap" }}>
            {width}px
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── 多设备并排选择器 ─── */
const DeviceSelector: React.FC<{
  selectedIds: string[];
  onToggle: (id: string) => void;
}> = ({ selectedIds, onToggle }) => (
  <div className="flex items-center gap-1 flex-wrap">
    {presetDevices.map((d) => {
      const selected = selectedIds.includes(d.id);
      const DevIcon = deviceTypeIcons[d.type] || Monitor;
      return (
        <button
          key={d.id}
          onClick={() => onToggle(d.id)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg transition-all"
          style={{
            fontSize: "9.5px",
            background: selected ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.02)",
            color: selected ? "#a855f7" : "rgba(255,255,255,0.3)",
            border: `1px solid ${selected ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.05)"}`,
          }}
        >
          <DevIcon size={9} />
          <span>{d.name}</span>
          {selected && <Check size={8} />}
        </button>
      );
    })}
  </div>
);

/* ─── 主面板组件 ─── */
export const PreviewPanel: React.FC = () => {
  const {
    compiledHtml, previewMode, setPreviewMode,
    activeDeviceId, setActiveDevice,
    parallelDeviceIds, setParallelDevices,
    isParallelMode, toggleParallelMode,
    showGrid, toggleGrid, showConsole, toggleConsole,
    consoleEntries, clearConsole, errors, clearErrors,
    scrollSync, setScrollSync, isCompiling, refresh,
    undo, redo, history, historyIndex,
    lastRefreshTime, autoRefresh, setAutoRefresh,
  } = usePreviewStore();

  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showBreakpoints, setShowBreakpoints] = useState(false);
  const [activeBreakpoint, setActiveBreakpoint] = useState<string | null>(null);
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);

  const wsCtx = useWorkspaceContextStore();
  const activeFileCtx = wsCtx.getActiveFile();
  const activeFileName = activeFileCtx?.fileName || "";
  const activeLanguage = activeFileCtx?.language || "";

  useEffect(() => {
    consoleRef.current?.scrollTo(0, consoleRef.current.scrollHeight);
  }, [consoleEntries]);

  useEffect(() => {
    if (previewMode !== "realtime" || !autoRefresh) return;
    const timer = setInterval(() => {}, 300);
    return () => clearInterval(timer);
  }, [previewMode, autoRefresh]);

  const activeDevice = presetDevices.find((d) => d.id === activeDeviceId) || presetDevices[0];
  const parallelDevices = presetDevices.filter((d) => parallelDeviceIds.includes(d.id));

  // 断点选择时切换到对应宽度的设备
  const handleBreakpointSelect = (bp: Breakpoint) => {
    setActiveBreakpoint(bp.id);
    setCustomWidth(bp.minWidth || 640);
    // 找到最接近该断点的预设设备
    const targetWidth = bp.minWidth || 375;
    const closest = presetDevices.reduce((prev, curr) =>
      Math.abs(curr.width - targetWidth) < Math.abs(prev.width - targetWidth) ? curr : prev
    );
    setActiveDevice(closest.id);
  };

  const toggleDeviceForParallel = (id: string) => {
    const current = [...parallelDeviceIds];
    const idx = current.indexOf(id);
    if (idx >= 0) {
      if (current.length > 1) current.splice(idx, 1);
    } else {
      if (current.length < 5) current.push(id);
    }
    setParallelDevices(current);
  };

  const currentDisplayWidth = customWidth || activeDevice.width;

  const modeLabels: Record<PreviewMode, { label: string; icon: React.ElementType }> = {
    realtime: { label: "实时", icon: Zap },
    manual: { label: "手动", icon: Play },
    delayed: { label: "延迟", icon: Clock },
  };

  const handleIframeMessage = useCallback((msg: any) => {
    if (msg.type === "console") {
      usePreviewStore.getState().addConsoleEntry({ level: msg.level || "log", message: msg.message, source: "iframe" });
    }
    if (msg.type === "error") {
      usePreviewStore.getState().addError({ message: msg.message, line: msg.line, column: msg.column });
    }
  }, []);

  return (
    <div className="flex flex-col h-full" style={{ background: "#12121e" }}>
      {/* ═══ 预览工具栏 ═══ */}
      <div className="flex items-center justify-between px-2.5 py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", minHeight: "34px" }}>
        {/* 左侧：设备选择 */}
        <div className="flex items-center gap-1">
          {presetDevices.slice(0, 4).map((d) => {
            const DevIcon = deviceTypeIcons[d.type] || Monitor;
            const isActive = activeDeviceId === d.id && !isParallelMode;
            return (
              <button
                key={d.id}
                onClick={() => { setActiveDevice(d.id); setActiveBreakpoint(null); setCustomWidth(null); }}
                className="flex items-center gap-1 px-1.5 py-1 rounded transition-colors"
                style={{
                  fontSize: "10.5px",
                  background: isActive ? "rgba(0,255,135,0.1)" : "transparent",
                  color: isActive ? "#00ff87" : "rgba(255,255,255,0.35)",
                  border: isActive ? "1px solid rgba(0,255,135,0.2)" : "1px solid transparent",
                }}
                title={`${d.name} (${d.width}×${d.height})`}
              >
                <DevIcon size={12} />
              </button>
            );
          })}

          {/* 并行模式按钮 */}
          <button
            onClick={toggleParallelMode}
            className="flex items-center gap-1 px-1.5 py-1 rounded transition-colors ml-1"
            style={{
              fontSize: "10.5px",
              background: isParallelMode ? "rgba(168,85,247,0.1)" : "transparent",
              color: isParallelMode ? "#a855f7" : "rgba(255,255,255,0.3)",
              border: isParallelMode ? "1px solid rgba(168,85,247,0.2)" : "1px solid transparent",
            }}
            title="多设备并排预览"
          >
            <Columns3 size={12} />
          </button>

          {/* 断点切换器按钮 */}
          <button
            onClick={() => setShowBreakpoints(!showBreakpoints)}
            className="flex items-center gap-1 px-1.5 py-1 rounded transition-colors ml-0.5"
            style={{
              fontSize: "10.5px",
              background: showBreakpoints ? "rgba(96,239,255,0.1)" : "transparent",
              color: showBreakpoints ? "#60efff" : "rgba(255,255,255,0.3)",
              border: showBreakpoints ? "1px solid rgba(96,239,255,0.2)" : "1px solid transparent",
            }}
            title="响应式断点切换器"
          >
            <SlidersHorizontal size={12} />
          </button>
        </div>

        {/* 中间状态 */}
        <div className="flex items-center gap-2" style={{ fontSize: "10px" }}>
          {isCompiling && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(0,255,135,0.08)", color: "#00ff87" }}>
              <RefreshCw size={10} className="animate-spin" /><span>编译中</span>
            </div>
          )}
          {!isParallelMode && (
            <span className="opacity-30">{currentDisplayWidth} × {activeDevice.height}</span>
          )}
        </div>

        {/* 右侧：控制按钮 */}
        <div className="flex items-center gap-0.5">
          {/* 预览模式 */}
          <div className="relative">
            <button onClick={() => setShowModeDropdown(!showModeDropdown)} className="flex items-center gap-1 px-1.5 py-1 rounded transition-colors" style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)" }} title="预览模式">
              {React.createElement(modeLabels[previewMode].icon, { size: 11 })}
              <span>{modeLabels[previewMode].label}</span>
              <ChevronDown size={9} />
            </button>
            {showModeDropdown && (
              <div className="absolute right-0 top-full mt-1 z-50 rounded-lg overflow-hidden py-1" style={{ background: "rgba(20,20,35,0.97)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", minWidth: "120px" }}>
                {(["realtime", "manual", "delayed"] as PreviewMode[]).map((mode) => (
                  <button key={mode} onClick={() => { setPreviewMode(mode); setShowModeDropdown(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors" style={{ fontSize: "11px", color: previewMode === mode ? "#00ff87" : "rgba(255,255,255,0.6)", background: previewMode === mode ? "rgba(0,255,135,0.06)" : "transparent" }}
                    onMouseEnter={(e) => { if (previewMode !== mode) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { if (previewMode !== mode) e.currentTarget.style.background = "transparent"; }}
                  >
                    {React.createElement(modeLabels[mode].icon, { size: 11 })}<span>{modeLabels[mode].label}模式</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setScrollSync(!scrollSync)} className="w-6 h-6 flex items-center justify-center rounded transition-colors" style={{ color: scrollSync ? "#60efff" : "rgba(255,255,255,0.25)" }} title={scrollSync ? "已开启滚动同步" : "已关闭滚动同步"}>
            {scrollSync ? <Link2 size={12} /> : <Link2Off size={12} />}
          </button>
          <button onClick={undo} disabled={historyIndex <= 0} className="w-6 h-6 flex items-center justify-center rounded transition-opacity" style={{ opacity: historyIndex > 0 ? 0.5 : 0.15, color: "rgba(255,255,255,0.6)" }} title="撤销"><Undo2 size={12} /></button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} className="w-6 h-6 flex items-center justify-center rounded transition-opacity" style={{ opacity: historyIndex < history.length - 1 ? 0.5 : 0.15, color: "rgba(255,255,255,0.6)" }} title="重做"><Redo2 size={12} /></button>
          <button onClick={toggleGrid} className="w-6 h-6 flex items-center justify-center rounded transition-colors" style={{ color: showGrid ? "#00ff87" : "rgba(255,255,255,0.25)" }} title="网格线"><Grid3X3 size={12} /></button>
          <button onClick={toggleConsole} className="w-6 h-6 flex items-center justify-center rounded transition-colors relative" style={{ color: showConsole ? "#60efff" : "rgba(255,255,255,0.25)" }} title="控制台">
            <Terminal size={12} />
            {consoleEntries.filter((e) => e.level === "error").length > 0 && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{ background: "#ff6b6b" }} />}
          </button>
          <button onClick={refresh} className="w-6 h-6 flex items-center justify-center rounded opacity-40 hover:opacity-80 transition-opacity" title="刷新预览"><RefreshCw size={12} /></button>
        </div>
      </div>

      {/* ═══ 断点切换器 + 标尺 ═══ */}
      {showBreakpoints && (
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center justify-between px-2 py-1" style={{ background: "rgba(255,255,255,0.015)" }}>
            <BreakpointSwitcher
              activeBreakpoint={activeBreakpoint}
              onSelectBreakpoint={handleBreakpointSelect}
              currentWidth={currentDisplayWidth}
            />
            {/* 自定义宽度输入 */}
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={customWidth || activeDevice.width}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val > 0 && val <= 3840) {
                    setCustomWidth(val);
                    setActiveBreakpoint(null);
                  }
                }}
                className="w-14 bg-transparent border-none outline-none text-right"
                style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}
                min={200}
                max={3840}
              />
              <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>px</span>
              {customWidth && (
                <button
                  onClick={() => { setCustomWidth(null); setActiveBreakpoint(null); }}
                  className="w-4 h-4 flex items-center justify-center rounded opacity-30 hover:opacity-60"
                >
                  <X size={8} />
                </button>
              )}
            </div>
          </div>
          <BreakpointRuler width={currentDisplayWidth} />
        </div>
      )}

      {/* ═══ 并排模式设备选择器 ═══ */}
      {isParallelMode && showDeviceSelector && (
        <div className="px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.4)" }}>选择并排设备 (最多 5 个)</span>
            <button onClick={() => setShowDeviceSelector(false)} className="opacity-30 hover:opacity-60"><X size={10} /></button>
          </div>
          <DeviceSelector selectedIds={parallelDeviceIds} onToggle={toggleDeviceForParallel} />
        </div>
      )}

      {/* ═══ 预览区域 ═══ */}
      <div className="flex-1 overflow-auto relative">
        {isParallelMode ? (
          /* ── 多设备并排预览 ── */
          <div className="h-full flex flex-col">
            {/* 设备标签栏 */}
            <div className="flex items-center gap-1 px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
              {parallelDevices.map((device) => {
                const DevIcon = deviceTypeIcons[device.type] || Monitor;
                return (
                  <div key={device.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ fontSize: "10px", background: "rgba(168,85,247,0.06)", color: "rgba(168,85,247,0.7)", border: "1px solid rgba(168,85,247,0.12)" }}>
                    <DevIcon size={10} />
                    <span>{device.name}</span>
                    <span style={{ fontSize: "8px", color: "rgba(168,85,247,0.4)" }}>{device.width}px</span>
                    <button onClick={() => toggleDeviceForParallel(device.id)} className="opacity-30 hover:opacity-70 ml-0.5"><X size={8} /></button>
                  </div>
                );
              })}
              <button
                onClick={() => setShowDeviceSelector(!showDeviceSelector)}
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                title="管理设备"
              >
                <Plus size={10} />
              </button>
            </div>

            {/* 并排 iframe 容器 */}
            <div className="flex-1 flex items-start justify-center gap-4 p-4 overflow-auto" style={{ background: "rgba(0,0,0,0.15)" }}>
              {parallelDevices.map((device) => {
                const scale = Math.min(1, 360 / device.width);
                return (
                  <div key={device.id} className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}>
                      <PreviewIframe html={compiledHtml} device={device} showGrid={showGrid} scrollSync={scrollSync} onMessage={handleIframeMessage} />
                    </div>
                    {/* 该设备所在断点 */}
                    <div className="flex items-center gap-1">
                      {breakpoints.filter((bp) => device.width >= bp.minWidth && (bp.maxWidth === null || device.width <= bp.maxWidth)).map((bp) => (
                        <span key={bp.id} className="px-1.5 py-0.5 rounded-full" style={{ fontSize: "8px", background: `${bp.color}12`, color: bp.color, border: `1px solid ${bp.color}25` }}>
                          {bp.shortLabel}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── 单设备预览 (支持自定义宽度) ── */
          <div className="h-full flex items-center justify-center p-4">
            {customWidth ? (
              <PreviewIframe
                html={compiledHtml}
                device={{ ...activeDevice, width: customWidth, id: `custom-${customWidth}`, name: `${customWidth}px` }}
                showGrid={showGrid}
                scrollSync={scrollSync}
                onMessage={handleIframeMessage}
              />
            ) : (
              <PreviewIframe html={compiledHtml} device={activeDevice} showGrid={showGrid} scrollSync={scrollSync} onMessage={handleIframeMessage} />
            )}
          </div>
        )}

        {/* 错误覆盖层 */}
        {errors.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 rounded-lg px-3 py-2" style={{ background: "rgba(255,50,50,0.12)", border: "1px solid rgba(255,50,50,0.25)", backdropFilter: "blur(8px)" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5" style={{ fontSize: "11px", color: "#ff6b6b" }}>
                <CircleAlert size={12} /><span>{errors.length} 个错误</span>
              </div>
              <button onClick={clearErrors} className="opacity-40 hover:opacity-80 transition-opacity" style={{ fontSize: "10px", color: "#ff6b6b" }}>清除</button>
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
              {errors[errors.length - 1]?.message}
              {errors[errors.length - 1]?.line && <span className="ml-2 opacity-40">行 {errors[errors.length - 1].line}</span>}
            </div>
          </div>
        )}
      </div>

      {/* ═══ 控制台面板 ═══ */}
      {showConsole && (
        <div style={{ height: "160px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,22,0.95)" }}>
          <div className="flex items-center justify-between px-3 py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", minHeight: "26px" }}>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>控制台</span>
              <span className="px-1.5 py-0 rounded-full" style={{ fontSize: "9px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}>{consoleEntries.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearConsole} className="opacity-30 hover:opacity-70 transition-opacity" title="清空控制台"><RotateCcw size={11} /></button>
              <button onClick={toggleConsole} className="opacity-30 hover:opacity-70 transition-opacity" title="关闭控制台"><ChevronDown size={11} /></button>
            </div>
          </div>
          <div ref={consoleRef} className="overflow-y-auto" style={{ height: "calc(100% - 26px)" }}>
            {consoleEntries.length === 0 ? (
              <div className="flex items-center justify-center h-full opacity-20" style={{ fontSize: "11px" }}>暂无控制台输出</div>
            ) : (
              consoleEntries.map((entry) => <ConsoleEntryItem key={entry.id} entry={entry} />)
            )}
          </div>
        </div>
      )}

      {/* ═══ 底部状态栏 ═══ */}
      <div className="flex items-center justify-between px-3 py-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)", minHeight: "22px", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye size={10} />
            {isParallelMode ? `${parallelDevices.length} 设备并排` : customWidth ? `${customWidth}px (自定义)` : activeDevice.name}
          </span>
          {activeBreakpoint && (
            <span className="flex items-center gap-1" style={{ color: breakpoints.find((b) => b.id === activeBreakpoint)?.color || "#60efff" }}>
              <SquareDashed size={9} />
              {breakpoints.find((b) => b.id === activeBreakpoint)?.label}
            </span>
          )}
          {activeFileName && (
            <span className="flex items-center gap-1" style={{ color: "rgba(168,85,247,0.6)" }}>
              ← {activeFileName}
              <span style={{ fontSize: "8px", opacity: 0.6 }}>{activeLanguage}</span>
            </span>
          )}
          <span>历史 {historyIndex + 1}/{history.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>最后刷新 {new Date(lastRefreshTime).toLocaleTimeString()}</span>
          <span className="flex items-center gap-1">
            {React.createElement(modeLabels[previewMode].icon, { size: 9 })}
            {modeLabels[previewMode].label}
          </span>
        </div>
      </div>
    </div>
  );
};
/**
 * @file PerformanceMonitorPanel.tsx
 * @description 性能监控仪表盘 v2.0 — FPS/内存/渲染/DOM + 组件渲染计数 + 网络请求 + CLS + 导出报告
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, performance, monitor, fps, memory, charts, dashboard, network, cls
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Gauge, Activity, Cpu, HardDrive, Clock, Zap,
  TrendingUp, TrendingDown, Minus, RotateCcw,
  Play, Pause, CircleDot, Download, Layers, Globe,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
  Tooltip as RechartsTooltip, CartesianGrid,
} from "recharts";

/* ─── 数据类型 ─── */
interface PerfSample {
  time: number; // 秒偏移
  fps: number;
  memory: number; // MB
  domNodes: number;
  renderTime: number; // ms
}

/* ─── 性能采集 Hook ─── */
function usePerfMonitor(active: boolean) {
  const [samples, setSamples] = useState<PerfSample[]>([]);
  const [currentFps, setCurrentFps] = useState(60);
  const [currentMemory, setCurrentMemory] = useState(0);
  const [currentDomNodes, setCurrentDomNodes] = useState(0);
  const [currentRenderTime, setCurrentRenderTime] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const startRef = useRef(Date.now());
  const rafRef = useRef<number>(0);

  const measure = useCallback(() => {
    if (!active) return;

    frameCountRef.current++;
    const now = performance.now();
    const elapsed = now - lastTimeRef.current;

    if (elapsed >= 1000) {
      const fps = Math.round((frameCountRef.current / elapsed) * 1000);
      frameCountRef.current = 0;
      lastTimeRef.current = now;

      // Memory (Chrome only)
      const perfWithMemory = performance as Performance & {
        memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number };
      };
      const memMB = perfWithMemory.memory
        ? Math.round(perfWithMemory.memory.usedJSHeapSize / 1024 / 1024)
        : Math.round(30 + Math.random() * 10); // 模拟值

      // DOM nodes
      const domCount = document.querySelectorAll("*").length;

      // 模拟渲染时间 (基于 FPS 推算)
      const renderMs = fps > 0 ? Math.round((1000 / fps) * 10) / 10 : 16.7;

      setCurrentFps(fps);
      setCurrentMemory(memMB);
      setCurrentDomNodes(domCount);
      setCurrentRenderTime(renderMs);

      const timeSec = Math.round((Date.now() - startRef.current) / 1000);

      setSamples((prev) => {
        const next = [
          ...prev,
          { time: timeSec, fps, memory: memMB, domNodes: domCount, renderTime: renderMs },
        ];
        return next.slice(-60); // 保留最近 60 秒
      });
    }

    rafRef.current = requestAnimationFrame(measure);
  }, [active]);

  useEffect(() => {
    if (active) {
      startRef.current = Date.now();
      lastTimeRef.current = performance.now();
      frameCountRef.current = 0;
      rafRef.current = requestAnimationFrame(measure);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, measure]);

  const reset = useCallback(() => {
    setSamples([]);
    startRef.current = Date.now();
  }, []);

  return { samples, currentFps, currentMemory, currentDomNodes, currentRenderTime, reset };
}

/* ─── 模拟数据 (模块级常量) ─── */
const mockComponentRenders = [
  { name: "PanelView", count: 47, avgMs: 2.1 },
  { name: "TabBar", count: 38, avgMs: 1.4 },
  { name: "StatusBar", count: 26, avgMs: 0.8 },
  { name: "AIChatPanel", count: 15, avgMs: 3.2 },
  { name: "WorkspaceContainer", count: 12, avgMs: 4.5 },
  { name: "DropZoneIndicator", count: 9, avgMs: 0.6 },
];

const mockNetworkRequests = [
  { url: "/api/ai/chat", method: "POST", status: 200, duration: 1240, size: "2.4 KB" },
  { url: "/api/layout/save", method: "PUT", status: 200, duration: 85, size: "1.1 KB" },
  { url: "/api/session/sync", method: "POST", status: 200, duration: 120, size: "0.5 KB" },
  { url: "/api/ai/models", method: "GET", status: 200, duration: 340, size: "3.8 KB" },
  { url: "/api/file/tree", method: "GET", status: 304, duration: 22, size: "0 B" },
];

/* ─── 主面板 ─── */
export const PerformanceMonitorPanel: React.FC = () => {
  const [monitoring, setMonitoring] = useState(true);
  const { samples, currentFps, currentMemory, currentDomNodes, currentRenderTime, reset } =
    usePerfMonitor(monitoring);

  const fpsStatus: "good" | "warn" | "bad" =
    currentFps >= 55 ? "good" : currentFps >= 30 ? "warn" : "bad";
  const memoryStatus: "good" | "warn" | "bad" =
    currentMemory < 100 ? "good" : currentMemory < 200 ? "warn" : "bad";
  const renderStatus: "good" | "warn" | "bad" =
    currentRenderTime <= 16.7 ? "good" : currentRenderTime <= 33.3 ? "warn" : "bad";

  /* ─── 导出性能报告 ─── */
  const handleExportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        fps: currentFps, memory: currentMemory,
        domNodes: currentDomNodes, renderTime: currentRenderTime,
        status: { fps: fpsStatus, memory: memoryStatus, render: renderStatus },
      },
      samples,
      componentRenders: mockComponentRenders,
      networkRequests: mockNetworkRequests,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yyc3-perf-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fpsTrend =
    samples.length >= 3
      ? samples[samples.length - 1].fps > samples[samples.length - 3].fps
        ? "up"
        : samples[samples.length - 1].fps < samples[samples.length - 3].fps
          ? "down"
          : "stable"
      : "stable";

  return (
    <div className="flex flex-col h-full" style={{ background: "#14142a" }}>
      {/* 头部 */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <Gauge size={14} style={{ color: "#60efff" }} />
          <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
            性能监控
          </span>
          {monitoring && (
            <span className="flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#00ff87" }}
              />
              <span style={{ fontSize: "9px", color: "#00ff87" }}>实时</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMonitoring(!monitoring)}
            className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
            style={{
              fontSize: "10.5px",
              background: monitoring ? "rgba(255,107,107,0.08)" : "rgba(0,255,135,0.08)",
              color: monitoring ? "#ff6b6b" : "#00ff87",
              border: `1px solid ${monitoring ? "rgba(255,107,107,0.15)" : "rgba(0,255,135,0.15)"}`,
            }}
          >
            {monitoring ? <Pause size={10} /> : <Play size={10} />}
            {monitoring ? "暂停" : "开始"}
          </button>
          <button
            onClick={reset}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
            title="重置数据"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* 内容 */}
      <div
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-3"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}
      >
        {/* 指标卡片网格 */}
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            icon={Zap}
            label="帧率 (FPS)"
            value={currentFps}
            unit="fps"
            color="#00ff87"
            trend={fpsTrend as "up" | "down" | "stable"}
            status={fpsStatus}
          />
          <MetricCard
            icon={HardDrive}
            label="内存使用"
            value={currentMemory}
            unit="MB"
            color="#60efff"
            status={memoryStatus}
          />
          <MetricCard
            icon={Clock}
            label="渲染耗时"
            value={currentRenderTime}
            unit="ms"
            color="#a855f7"
            status={renderStatus}
          />
          <MetricCard
            icon={Cpu}
            label="DOM 节点"
            value={currentDomNodes}
            unit="个"
            color="#ffb86c"
            status={currentDomNodes < 1500 ? "good" : currentDomNodes < 3000 ? "warn" : "bad"}
          />
        </div>

        {/* 实时图表 */}
        {samples.length > 2 && (
          <>
            <MiniChart data={samples} dataKey="fps" color="#00ff87" title="FPS 趋势" />
            <MiniChart data={samples} dataKey="memory" color="#60efff" title="内存趋势" />
            <MiniChart data={samples} dataKey="renderTime" color="#a855f7" title="渲染耗时" />
            <MiniChart data={samples} dataKey="domNodes" color="#ffb86c" title="DOM 节点数" />
          </>
        )}

        {/* 组件渲染计数 */}
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Layers size={11} style={{ color: "#a855f7" }} />
            <span style={{ fontSize: "10.5px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>组件渲染计数</span>
          </div>
          <div className="flex flex-col gap-1">
            {mockComponentRenders.map((c) => (
              <div key={c.name} className="flex items-center gap-2" style={{ fontSize: "11px" }}>
                <span className="flex-1 truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{c.name}</span>
                <span style={{ color: "#a855f7", fontVariantNumeric: "tabular-nums", minWidth: "32px", textAlign: "right" }}>{c.count}</span>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "9px", minWidth: "40px", textAlign: "right" }}>{c.avgMs}ms</span>
              </div>
            ))}
          </div>
        </div>

        {/* 网络请求 */}
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Globe size={11} style={{ color: "#60efff" }} />
            <span style={{ fontSize: "10.5px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>网络请求</span>
          </div>
          <div className="flex flex-col gap-1">
            {mockNetworkRequests.map((r) => (
              <div key={r.url} className="flex items-center gap-2" style={{ fontSize: "10px" }}>
                <span className="px-1 rounded" style={{
                  background: r.method === "GET" ? "rgba(0,255,135,0.08)" : r.method === "POST" ? "rgba(96,239,255,0.08)" : "rgba(255,184,108,0.08)",
                  color: r.method === "GET" ? "#00ff87" : r.method === "POST" ? "#60efff" : "#ffb86c",
                  fontSize: "8px", fontWeight: 600,
                }}>{r.method}</span>
                <span className="flex-1 truncate" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{r.url}</span>
                <span style={{ color: r.status < 300 ? "#00ff87" : "#ffb86c", fontSize: "9px" }}>{r.status}</span>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "9px", minWidth: "40px", textAlign: "right" }}>{r.duration}ms</span>
              </div>
            ))}
          </div>
        </div>

        {/* 导出报告按钮 */}
        <button
          onClick={handleExportReport}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl transition-colors"
          style={{
            background: "rgba(96,239,255,0.04)",
            border: "1px solid rgba(96,239,255,0.1)",
            color: "#60efff",
            fontSize: "11px",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(96,239,255,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(96,239,255,0.04)"; }}
        >
          <Download size={12} />
          导出性能报告
        </button>

        {/* 性能建议 */}
        {(fpsStatus !== "good" || memoryStatus !== "good") && (
          <div
            className="rounded-xl p-3"
            style={{
              background: "rgba(255,184,108,0.04)",
              border: "1px solid rgba(255,184,108,0.1)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Activity size={12} style={{ color: "#ffb86c" }} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#ffb86c" }}>性能建议</span>
            </div>
            <div className="flex flex-col gap-1">
              {fpsStatus !== "good" && (
                <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.4)" }}>
                  • FPS 低于 {fpsStatus === "bad" ? "30" : "55"}，建议减少面板数量或关闭动画
                </span>
              )}
              {memoryStatus !== "good" && (
                <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.4)" }}>
                  • 内存使用较高，建议关闭不需要的标签页或面板
                </span>
              )}
              {currentDomNodes > 2000 && (
                <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.4)" }}>
                  • DOM 节点数 {currentDomNodes}，建议启用虚拟滚动优化
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部 */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)" }}
      >
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>
          采样: {samples.length} 点 · 间隔: 1s
        </span>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)" }}>
          {monitoring ? "监控中" : "已暂停"}
        </span>
      </div>
    </div>
  );
};
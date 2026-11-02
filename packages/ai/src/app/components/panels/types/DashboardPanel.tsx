/**
 * @file DashboardPanel.tsx
 * @description 全局状态仪表盘面板 v1.0 — 汇总显示文件/终端/AI/插件/性能/Git 各子系统状态
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, dashboard, overview, status, metrics
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard, FolderTree, Terminal, Bot, Puzzle,
  Gauge, GitBranch, Database, Activity, Zap,
  TrendingUp, TrendingDown, Clock, HardDrive,
  FileCode, Eye, Search, Settings, RefreshCw,
  ChevronRight, CircleCheck, TriangleAlert, CircleX,
} from "lucide-react";
import { useLayoutStore } from "../../../stores/layoutStore";
import { useAIServiceStore } from "../../../stores/aiServiceStore";
import { usePluginStore } from "../../../stores/pluginStore";

/* ─── 模拟指标生成 ─── */
function useLiveMetrics() {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 128,
    domNodes: 2840,
    renderTime: 4.2,
    uptime: 0,
    cpuUsage: 22,
  });

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setMetrics({
        fps: 55 + Math.floor(Math.random() * 10),
        memory: 120 + Math.floor(Math.random() * 40),
        domNodes: 2700 + Math.floor(Math.random() * 300),
        renderTime: 3 + Math.random() * 4,
        uptime: Math.floor((Date.now() - start) / 1000),
        cpuUsage: 15 + Math.floor(Math.random() * 25),
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return metrics;
}

/* ─── 迷你指标卡片 ─── */
const MetricCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  trend?: "up" | "down" | "stable";
}> = ({ icon: Icon, label, value, sub, color, trend }) => (
  <div
    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all"
    style={{
      background: `${color}06`,
      border: `1px solid ${color}15`,
    }}
  >
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}12`, border: `1px solid ${color}20` }}
    >
      <Icon size={14} style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <div style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.35)" }}>{label}</div>
      <div className="flex items-center gap-1.5">
        <span style={{ fontSize: "16px", fontWeight: 600, color }}>{value}</span>
        {trend && (
          <span style={{ color: trend === "up" ? "#00ff87" : trend === "down" ? "#ff6b6b" : "rgba(255,255,255,0.2)" }}>
            {trend === "up" ? <TrendingUp size={10} /> : trend === "down" ? <TrendingDown size={10} /> : null}
          </span>
        )}
      </div>
      {sub && <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>{sub}</div>}
    </div>
  </div>
);

/* ─── 子系统状态行 ─── */
const SystemRow: React.FC<{
  icon: React.ElementType;
  label: string;
  status: "ok" | "warn" | "error";
  detail: string;
  color: string;
}> = ({ icon: Icon, label, status, detail, color }) => {
  const statusIcon = status === "ok" ? CircleCheck : status === "warn" ? TriangleAlert : CircleX;
  const StatusIcon = statusIcon;
  const statusColor = status === "ok" ? "#00ff87" : status === "warn" ? "#ffb86c" : "#ff6b6b";

  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors"
      style={{ background: "rgba(255,255,255,0.015)" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.035)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.015)"; }}
    >
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}10` }}
      >
        <Icon size={12} style={{ color }} />
      </div>
      <span className="flex-1" style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.7)" }}>{label}</span>
      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{detail}</span>
      <StatusIcon size={12} style={{ color: statusColor }} />
    </div>
  );
};

/* ─── 活动日志条目 ─── */
interface ActivityEntry {
  id: string;
  icon: React.ElementType;
  message: string;
  time: string;
  color: string;
}

const mockActivities: ActivityEntry[] = [
  { id: "a1", icon: FileCode, message: "App.tsx 已保存", time: "刚刚", color: "#00ff87" },
  { id: "a2", icon: Bot, message: "AI 请求完成 (GPT-4 Turbo)", time: "30s 前", color: "#a855f7" },
  { id: "a3", icon: GitBranch, message: "切换到 feature/phase-20 分支", time: "2m 前", color: "#60efff" },
  { id: "a4", icon: Terminal, message: "pnpm build 成功", time: "5m 前", color: "#00ff87" },
  { id: "a5", icon: Database, message: "PostgreSQL 连接已建立", time: "8m 前", color: "#336791" },
  { id: "a6", icon: Puzzle, message: "ESLint 插件已激活", time: "12m 前", color: "#a855f7" },
  { id: "a7", icon: Eye, message: "实时预览已刷新", time: "15m 前", color: "#ffb86c" },
  { id: "a8", icon: Search, message: "搜索: 'useLayoutStore' — 12 个结果", time: "20m 前", color: "#60efff" },
];

/* ─── 主面板 ─── */
export const DashboardPanel: React.FC = () => {
  const liveMetrics = useLiveMetrics();
  const { panels, tabs } = useLayoutStore();
  const { providers, metrics: aiMetrics, costEntries, activeProviderId, activeModelId } = useAIServiceStore();
  const { plugins, getStats: getPluginStats } = usePluginStore();
  const [refreshing, setRefreshing] = useState(false);

  const panelCount = Object.keys(panels).length;
  const tabCount = Object.keys(tabs).length;
  const pluginStats = getPluginStats();

  /* AI 汇总 */
  const aiSummary = useMemo(() => {
    const enabledProviders = providers.filter((p) => p.enabled).length;
    const totalModels = providers.reduce((sum, p) => sum + p.models.filter((m) => m.enabled).length, 0);
    const totalRequests = aiMetrics.reduce((sum, m) => sum + m.totalRequests, 0);
    const avgLatency = aiMetrics.length > 0
      ? aiMetrics.reduce((sum, m) => sum + m.latency, 0) / aiMetrics.length
      : 0;
    const totalCostUSD = costEntries.filter((c) => c.currency === "USD").reduce((s, c) => s + c.cost, 0);
    const totalCostCNY = costEntries.filter((c) => c.currency === "CNY").reduce((s, c) => s + c.cost, 0);
    return { enabledProviders, totalModels, totalRequests, avgLatency, totalCostUSD, totalCostCNY };
  }, [providers, aiMetrics, costEntries]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  };

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#14142a", color: "rgba(255,255,255,0.85)" }}>
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <LayoutDashboard size={16} style={{ color: "#00ff87" }} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>全局仪表盘</span>
          <span className="px-1.5 py-0 rounded-full" style={{ fontSize: "9px", background: "rgba(0,255,135,0.08)", color: "#00ff87" }}>
            实时
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
            <Clock size={9} className="inline mr-0.5" />
            运行 {formatUptime(liveMetrics.uptime)}
          </span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
            style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}
          >
            <RefreshCw size={11} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* ═══ 核心指标卡片 ═══ */}
        <section>
          <SectionTitle title="核心指标" icon={Gauge} color="#00ff87" />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <MetricCard icon={Gauge} label="帧率" value={liveMetrics.fps} sub="FPS" color="#00ff87" trend={liveMetrics.fps >= 58 ? "up" : "down"} />
            <MetricCard icon={HardDrive} label="内存" value={`${liveMetrics.memory}MB`} color="#60efff" trend={liveMetrics.memory < 150 ? "stable" : "down"} />
            <MetricCard icon={Activity} label="渲染耗时" value={`${liveMetrics.renderTime.toFixed(1)}ms`} color="#a855f7" trend={liveMetrics.renderTime < 6 ? "up" : "down"} />
            <MetricCard icon={Zap} label="CPU" value={`${liveMetrics.cpuUsage}%`} color="#ffb86c" trend={liveMetrics.cpuUsage < 30 ? "up" : "down"} />
          </div>
        </section>

        {/* ═══ 工作区概览 ═══ */}
        <section>
          <SectionTitle title="工作区" icon={LayoutDashboard} color="#60efff" />
          <div className="grid grid-cols-3 gap-2 mt-2">
            <MiniStat label="面板" value={panelCount} color="#60efff" />
            <MiniStat label="标签页" value={tabCount} color="#a855f7" />
            <MiniStat label="DOM 节点" value={liveMetrics.domNodes} color="#ffb86c" />
          </div>
        </section>

        {/* ═══ AI 服务汇总 ═══ */}
        <section>
          <SectionTitle title="AI 服务" icon={Bot} color="#a855f7" />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <MiniStat label="服务商" value={`${aiSummary.enabledProviders}/${providers.length}`} color="#a855f7" />
            <MiniStat label="模型" value={aiSummary.totalModels} color="#60efff" />
            <MiniStat label="总请求" value={aiSummary.totalRequests} color="#00ff87" />
            <MiniStat label="平均延迟" value={aiSummary.avgLatency > 0 ? `${aiSummary.avgLatency.toFixed(0)}ms` : "N/A"} color="#ffb86c" />
          </div>
          {(aiSummary.totalCostUSD > 0 || aiSummary.totalCostCNY > 0) && (
            <div className="mt-1.5 px-2 py-1 rounded-lg" style={{ background: "rgba(168,85,247,0.04)", fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>
              累计成本:
              {aiSummary.totalCostUSD > 0 && <span className="ml-1">${aiSummary.totalCostUSD.toFixed(4)}</span>}
              {aiSummary.totalCostCNY > 0 && <span className="ml-1">{"\u00A5"}{aiSummary.totalCostCNY.toFixed(4)}</span>}
            </div>
          )}
        </section>

        {/* ═══ 插件汇总 ═══ */}
        <section>
          <SectionTitle title="插件系统" icon={Puzzle} color="#ff6b6b" />
          <div className="grid grid-cols-3 gap-2 mt-2">
            <MiniStat label="总数" value={pluginStats.total} color="#a855f7" />
            <MiniStat label="活跃" value={pluginStats.active} color="#00ff87" />
            <MiniStat label="大小" value={pluginStats.totalSize} color="#ffb86c" />
          </div>
        </section>

        {/* ═══ 子系统状态 ═══ */}
        <section>
          <SectionTitle title="子系统状态" icon={Settings} color="#ffb86c" />
          <div className="space-y-1 mt-2">
            <SystemRow icon={FolderTree} label="文件系统" status="ok" detail="12 文件 · 3 目录" color="#00ff87" />
            <SystemRow icon={Terminal} label="终端" status="ok" detail="1 个活跃会话" color="#60efff" />
            <SystemRow icon={Bot} label="AI 服务" status={activeProviderId ? "ok" : "warn"} detail={activeProviderId ? `${activeProviderId}/${activeModelId}` : "未配置"} color="#a855f7" />
            <SystemRow icon={Database} label="数据库" status="ok" detail="PostgreSQL 14.5" color="#336791" />
            <SystemRow icon={GitBranch} label="版本控制" status="ok" detail="feature/phase-20" color="#50fa7b" />
            <SystemRow icon={Puzzle} label="插件引擎" status={pluginStats.active > 0 ? "ok" : "warn"} detail={`${pluginStats.active} 活跃`} color="#ff6b6b" />
            <SystemRow icon={Eye} label="预览引擎" status="ok" detail="iframe sandbox" color="#ffb86c" />
            <SystemRow icon={Gauge} label="性能监控" status={liveMetrics.fps >= 50 ? "ok" : "warn"} detail={`${liveMetrics.fps} FPS`} color="#00ff87" />
          </div>
        </section>

        {/* ═══ 最近活动 ═══ */}
        <section>
          <SectionTitle title="最近活动" icon={Clock} color="#60efff" />
          <div className="space-y-0.5 mt-2">
            {mockActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <act.icon size={10} style={{ color: act.color }} />
                <span className="flex-1 truncate" style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>
                  {act.message}
                </span>
                <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>{act.time}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

/* ─── 区域标题 ─── */
const SectionTitle: React.FC<{ title: string; icon: React.ElementType; color: string }> = ({ title, icon: Icon, color }) => (
  <div className="flex items-center gap-1.5">
    <Icon size={11} style={{ color }} />
    <span style={{ fontSize: "11.5px", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{title}</span>
    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
  </div>
);

/* ─── 迷你统计块 ─── */
const MiniStat: React.FC<{ label: string; value: string | number; color: string }> = ({ label, value, color }) => (
  <div
    className="px-2.5 py-2 rounded-lg text-center"
    style={{ background: `${color}06`, border: `1px solid ${color}10` }}
  >
    <div style={{ fontSize: "15px", fontWeight: 600, color }}>{value}</div>
    <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>{label}</div>
  </div>
);

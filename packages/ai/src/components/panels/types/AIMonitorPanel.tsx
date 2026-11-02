/**
 * @file AIMonitorPanel.tsx
 * @description AI 性能监控面板 — 延迟/吞吐/成功率可视化、错误分析、成本报告
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, ai, monitor, performance, metrics, cost, dashboard
 */

import React, { useState, useEffect } from "react";
import {
  Activity, RefreshCw, TrendingUp, TrendingDown, Zap,
  Clock, Gauge, DollarSign, TriangleAlert, CircleCheck,
  CircleX, ChartBar, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  useAIServiceStore,
  type PerformanceMetric,
  type CostEntry,
} from "../../../stores/aiServiceStore";

/* ─── 迷你柱状图 ─── */
const MiniBarChart: React.FC<{
  data: number[];
  max?: number;
  color: string;
  height?: number;
}> = ({ data, max, color, height = 32 }) => {
  const maxVal = max || Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[2px]" style={{ height: `${height}px` }}>
      {data.slice(-12).map((val, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all duration-300"
          style={{
            height: `${Math.max(2, (val / maxVal) * height)}px`,
            background: color,
            opacity: 0.3 + (i / data.length) * 0.7,
            minWidth: "3px",
          }}
        />
      ))}
    </div>
  );
};

/* ─── 指标卡片 ─── */
const MetricCard: React.FC<{
  label: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  color: string;
  trend?: "up" | "down" | "stable";
  chartData?: number[];
}> = ({ label, value, subValue, icon: Icon, color, trend, chartData }) => (
  <div
    className="rounded-xl px-3 py-2.5"
    style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-1.5">
        <Icon size={12} style={{ color }} />
        <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.45)" }}>{label}</span>
      </div>
      {trend && (
        <div className="flex items-center gap-0.5" style={{ fontSize: "9px" }}>
          {trend === "up" ? (
            <ArrowUpRight size={10} style={{ color: "#00ff87" }} />
          ) : trend === "down" ? (
            <ArrowDownRight size={10} style={{ color: "#ff6b6b" }} />
          ) : null}
        </div>
      )}
    </div>
    <div style={{ fontSize: "18px", fontWeight: 600, color }}>{value}</div>
    {subValue && (
      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
        {subValue}
      </div>
    )}
    {chartData && chartData.length > 0 && (
      <div className="mt-2">
        <MiniBarChart data={chartData} color={color} height={24} />
      </div>
    )}
  </div>
);

/* ─── Provider 性能行 ─── */
const ProviderMetricRow: React.FC<{
  providerId: string;
  metrics: PerformanceMetric[];
}> = ({ providerId, metrics }) => {
  const { providers } = useAIServiceStore();
  const provider = providers.find((p) => p.id === providerId);
  if (!provider) return null;

  const avgLatency = metrics.reduce((s, m) => s + m.latency, 0) / metrics.length;
  const avgThroughput = metrics.reduce((s, m) => s + m.throughput, 0) / metrics.length;
  const avgSuccess = metrics.reduce((s, m) => s + m.successRate, 0) / metrics.length;
  const totalRequests = metrics.reduce((s, m) => s + m.totalRequests, 0);
  const totalErrors = metrics.reduce((s, m) => s + m.errorCount, 0);

  const getSuccessColor = (rate: number) => {
    if (rate >= 0.95) return "#00ff87";
    if (rate >= 0.85) return "#ffb86c";
    return "#ff6b6b";
  };

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex-1 min-w-0">
        <span style={{ fontSize: "12px", fontWeight: 500 }}>{provider.displayName}</span>
        <div className="flex items-center gap-2 mt-0.5" style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>
          <span>{metrics.length} 条记录</span>
          <span>{totalRequests} 请求</span>
        </div>
      </div>

      {/* 延迟 */}
      <div className="text-center" style={{ minWidth: "60px" }}>
        <div style={{ fontSize: "12px", fontWeight: 500, color: avgLatency < 1000 ? "#00ff87" : avgLatency < 2000 ? "#ffb86c" : "#ff6b6b" }}>
          {avgLatency.toFixed(0)}ms
        </div>
        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>延迟</div>
      </div>

      {/* 吞吐量 */}
      <div className="text-center" style={{ minWidth: "60px" }}>
        <div style={{ fontSize: "12px", fontWeight: 500, color: "#60efff" }}>
          {avgThroughput.toFixed(0)}
        </div>
        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>tok/s</div>
      </div>

      {/* 成功率 */}
      <div className="text-center" style={{ minWidth: "50px" }}>
        <div style={{ fontSize: "12px", fontWeight: 500, color: getSuccessColor(avgSuccess) }}>
          {(avgSuccess * 100).toFixed(1)}%
        </div>
        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>成功率</div>
      </div>

      {/* 迷你图 */}
      <div style={{ width: "60px" }}>
        <MiniBarChart
          data={metrics.map((m) => m.latency)}
          color="rgba(96,239,255,0.6)"
          height={20}
        />
      </div>
    </div>
  );
};

/* ─── 成本条目 ─── */
const CostRow: React.FC<{ entry: CostEntry }> = ({ entry }) => {
  const { providers } = useAIServiceStore();
  const provider = providers.find((p) => p.id === entry.providerId);
  const model = provider?.models.find((m) => m.id === entry.modelId);

  return (
    <div
      className="flex items-center gap-3 px-3 py-1.5"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        fontSize: "11px",
      }}
    >
      <span className="flex-1 opacity-60">{provider?.displayName || entry.providerId}</span>
      <span className="opacity-40" style={{ minWidth: "80px" }}>
        {model?.displayName || entry.modelId}
      </span>
      <span className="opacity-40 text-right" style={{ minWidth: "50px" }}>
        {entry.inputTokens.toLocaleString()}
      </span>
      <span className="opacity-40 text-right" style={{ minWidth: "50px" }}>
        {entry.outputTokens.toLocaleString()}
      </span>
      <span
        className="text-right"
        style={{
          minWidth: "60px",
          color: "#ffb86c",
        }}
      >
        {entry.currency === "USD" ? "$" : "¥"}
        {entry.cost.toFixed(4)}
      </span>
    </div>
  );
};

/* ─── 主面板 ─── */
export const AIMonitorPanel: React.FC = () => {
  const { metrics, costEntries, errors, refreshMetrics, clearErrors, providers } =
    useAIServiceStore();
  const [activeTab, setActiveTab] = useState<"metrics" | "cost" | "errors">("metrics");
  const [autoRefresh, setAutoRefresh] = useState(true);

  /* 自动刷新 */
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(refreshMetrics, 15000);
    return () => clearInterval(timer);
  }, [autoRefresh, refreshMetrics]);

  /* 计算汇总数据 */
  const totalRequests = metrics.reduce((s, m) => s + m.totalRequests, 0);
  const avgLatency = metrics.length > 0 ? metrics.reduce((s, m) => s + m.latency, 0) / metrics.length : 0;
  const avgThroughput = metrics.length > 0 ? metrics.reduce((s, m) => s + m.throughput, 0) / metrics.length : 0;
  const avgSuccess = metrics.length > 0 ? metrics.reduce((s, m) => s + m.successRate, 0) / metrics.length : 0;
  const totalCostUSD = costEntries.filter((e) => e.currency === "USD").reduce((s, e) => s + e.cost, 0);
  const totalCostCNY = costEntries.filter((e) => e.currency === "CNY").reduce((s, e) => s + e.cost, 0);

  /* 按 Provider 分组 */
  const metricsByProvider = new Map<string, PerformanceMetric[]>();
  metrics.forEach((m) => {
    const list = metricsByProvider.get(m.providerId) || [];
    list.push(m);
    metricsByProvider.set(m.providerId, list);
  });

  const tabs = [
    { id: "metrics" as const, label: "性能", icon: Activity },
    { id: "cost" as const, label: "成本", icon: DollarSign },
    { id: "errors" as const, label: `错误 (${errors.length})`, icon: TriangleAlert },
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: "#14142a", color: "rgba(255,255,255,0.85)" }}>
      {/* Tab 栏 */}
      <div
        className="flex items-center justify-between px-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: "34px" }}
      >
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1 px-2 py-1.5 rounded transition-colors"
              style={{
                fontSize: "11px",
                color: activeTab === tab.id ? "#00ff87" : "rgba(255,255,255,0.4)",
                background: activeTab === tab.id ? "rgba(0,255,135,0.06)" : "transparent",
                borderBottom: activeTab === tab.id ? "2px solid #00ff87" : "2px solid transparent",
              }}
            >
              <tab.icon size={11} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="w-6 h-6 flex items-center justify-center rounded transition-colors"
            style={{ color: autoRefresh ? "#00ff87" : "rgba(255,255,255,0.25)" }}
            title={autoRefresh ? "自动刷新: 开" : "自动刷新: 关"}
          >
            <RefreshCw size={11} className={autoRefresh ? "animate-spin" : ""} style={{ animationDuration: "4s" }} />
          </button>
          <button
            onClick={refreshMetrics}
            className="w-6 h-6 flex items-center justify-center rounded opacity-40 hover:opacity-80 transition-opacity"
            title="刷新数据"
          >
            <RefreshCw size={11} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ═══ 性能指标 ═══ */}
        {activeTab === "metrics" && (
          <div className="p-3 space-y-3">
            {/* 概览卡片 */}
            <div className="grid grid-cols-2 gap-2">
              <MetricCard
                label="平均延迟"
                value={`${avgLatency.toFixed(0)}ms`}
                icon={Clock}
                color={avgLatency < 1000 ? "#00ff87" : avgLatency < 2000 ? "#ffb86c" : "#ff6b6b"}
                trend={avgLatency < 1200 ? "down" : "up"}
                chartData={metrics.slice(-12).map((m) => m.latency)}
              />
              <MetricCard
                label="平均吞吐"
                value={`${avgThroughput.toFixed(0)}`}
                subValue="tokens/s"
                icon={Gauge}
                color="#60efff"
                trend="up"
                chartData={metrics.slice(-12).map((m) => m.throughput)}
              />
              <MetricCard
                label="成功率"
                value={`${(avgSuccess * 100).toFixed(1)}%`}
                icon={CircleCheck}
                color={avgSuccess >= 0.95 ? "#00ff87" : "#ffb86c"}
                chartData={metrics.slice(-12).map((m) => m.successRate * 100)}
              />
              <MetricCard
                label="总请求"
                value={totalRequests.toLocaleString()}
                icon={ChartBar}
                color="#a855f7"
                chartData={metrics.slice(-12).map((m) => m.totalRequests)}
              />
            </div>

            {/* 按 Provider 分组 */}
            <div>
              <h4 className="mb-2" style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
                服务商性能对比
              </h4>
              <div className="space-y-1.5">
                {Array.from(metricsByProvider.entries()).map(([providerId, provMetrics]) => (
                  <ProviderMetricRow
                    key={providerId}
                    providerId={providerId}
                    metrics={provMetrics}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ 成本报告 ═══ */}
        {activeTab === "cost" && (
          <div className="p-3 space-y-3">
            {/* 成本概览 */}
            <div className="grid grid-cols-2 gap-2">
              <MetricCard
                label="USD 总成本"
                value={`$${totalCostUSD.toFixed(4)}`}
                icon={DollarSign}
                color="#ffb86c"
              />
              <MetricCard
                label="CNY 总成本"
                value={`¥${totalCostCNY.toFixed(4)}`}
                icon={DollarSign}
                color="#ff6b6b"
              />
            </div>

            {/* 明细表 */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* 表头 */}
              <div
                className="flex items-center gap-3 px-3 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                <span className="flex-1">服务商</span>
                <span style={{ minWidth: "80px" }}>模型</span>
                <span className="text-right" style={{ minWidth: "50px" }}>输入</span>
                <span className="text-right" style={{ minWidth: "50px" }}>输出</span>
                <span className="text-right" style={{ minWidth: "60px" }}>成本</span>
              </div>
              {costEntries.length === 0 ? (
                <div className="px-3 py-6 text-center" style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
                  暂无成本数据
                </div>
              ) : (
                costEntries.map((entry, i) => <CostRow key={i} entry={entry} />)
              )}
            </div>
          </div>
        )}

        {/* ═══ 错误分析 ═══ */}
        {activeTab === "errors" && (
          <div className="p-3 space-y-3">
            {errors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-30">
                <CircleCheck size={28} />
                <span style={{ fontSize: "12px" }}>暂无错误记录</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                    {errors.length} 个错误记录
                  </span>
                  <button
                    onClick={clearErrors}
                    className="px-2 py-1 rounded transition-colors"
                    style={{
                      fontSize: "10px",
                      color: "#ff6b6b",
                      background: "rgba(255,50,50,0.06)",
                      border: "1px solid rgba(255,50,50,0.12)",
                    }}
                  >
                    清除全部
                  </button>
                </div>
                <div className="space-y-2">
                  {errors.map((err) => {
                    const colorMap: Record<string, string> = {
                      network: "#ff6b6b",
                      api: "#ffb86c",
                      rate_limit: "#a855f7",
                      authentication: "#ff6b6b",
                      unknown: "rgba(255,255,255,0.4)",
                    };
                    const labelMap: Record<string, string> = {
                      network: "网络",
                      api: "API",
                      rate_limit: "限流",
                      authentication: "认证",
                      unknown: "未知",
                    };
                    return (
                      <div
                        key={err.id}
                        className="rounded-lg px-3 py-2"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <CircleX size={11} style={{ color: colorMap[err.errorType] }} />
                          <span
                            className="px-1.5 py-0 rounded"
                            style={{
                              fontSize: "9px",
                              background: `${colorMap[err.errorType]}15`,
                              color: colorMap[err.errorType],
                            }}
                          >
                            {labelMap[err.errorType]}
                          </span>
                          <span style={{ fontSize: "11px" }}>{err.errorMessage}</span>
                          <span className="ml-auto opacity-30" style={{ fontSize: "9px" }}>
                            ×{err.count}
                          </span>
                        </div>
                        {err.suggestions.length > 0 && (
                          <div className="mt-1.5 pl-5 space-y-0.5">
                            {err.suggestions.slice(0, 2).map((s, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1"
                                style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}
                              >
                                <span>💡</span>
                                <span>{s}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
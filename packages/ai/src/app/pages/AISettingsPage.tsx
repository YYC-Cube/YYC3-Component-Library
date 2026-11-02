/**
 * @file AISettingsPage.tsx
 * @description AI 服务设置页面 — 完整的 Provider/Model 配置、性能监控、成本报告
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags page, ai, settings, provider, model, performance
 */

import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Bot, Settings, Activity, DollarSign,
  Shield, Zap, Clock, Gauge, RefreshCw,
  Cloud, Server, Key, ExternalLink, ToggleLeft, ToggleRight,
  Check, ChevronDown, ChevronRight, CircleAlert,
  Eye, EyeOff, Pencil, ChartBar, CircleCheck,
} from "lucide-react";
import {
  useAIServiceStore,
  type AIProviderConfig,
  type AIModelConfig,
} from "../stores/aiServiceStore";

/* ─── 导航 Tab ─── */
type SettingsTab = "providers" | "performance" | "cost" | "config";

const AISettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>("providers");
  const {
    providers,
    activeProviderId,
    activeModelId,
    metrics,
    costEntries,
    errors,
    detectionEnabled,
    cacheEnabled,
    rateLimitEnabled,
    toggleProvider,
    setActiveProvider,
    setActiveModel,
    setApiKey,
    toggleDetection,
    toggleCache,
    toggleRateLimit,
    toggleModel,
    refreshMetrics,
    clearErrors,
    getTotalCost,
  } = useAIServiceStore();

  const costs = getTotalCost();

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "providers", label: "服务商", icon: Cloud },
    { id: "performance", label: "性能", icon: Activity },
    { id: "cost", label: "成本", icon: DollarSign },
    { id: "config", label: "配置", icon: Settings },
  ];

  return (
    <div className="h-screen flex flex-col" style={{ background: "#0a0a12", color: "rgba(255,255,255,0.9)" }}>
      {/* 顶部栏 */}
      <div
        className="flex items-center justify-between px-4 h-[48px] min-h-[48px] flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10, 10, 22, 0.95)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <ArrowLeft size={16} />
          </button>
          <Bot size={18} style={{ color: "#00ff87" }} />
          <span style={{ fontSize: "15px", fontWeight: 600 }}>AI 服务管理中心</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshMetrics}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
            style={{
              fontSize: "12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <RefreshCw size={12} />
            刷新数据
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧 Tab 导航 */}
        <div
          className="flex flex-col py-3 px-2 gap-1"
          style={{
            width: "180px",
            minWidth: "180px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(10,10,22,0.5)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-colors"
              style={{
                fontSize: "13px",
                background: activeTab === tab.id ? "rgba(0,255,135,0.08)" : "transparent",
                color: activeTab === tab.id ? "#00ff87" : "rgba(255,255,255,0.5)",
                border: activeTab === tab.id ? "1px solid rgba(0,255,135,0.12)" : "1px solid transparent",
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}

          {/* 概览信息 */}
          <div className="mt-auto px-3 py-3 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
              <div className="flex items-center justify-between mb-1">
                <span>活跃服务商</span>
                <span style={{ color: "#00ff87" }}>
                  {providers.find((p) => p.id === activeProviderId)?.displayName}
                </span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span>总成本</span>
                <span style={{ color: "#ffb86c" }}>
                  ${costs.usd.toFixed(2)} / ¥{costs.cny.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>启用 Provider</span>
                <span>{providers.filter((p) => p.enabled).length}/{providers.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1 overflow-y-auto">
          {/* ═══ 服务商管理 ═══ */}
          {activeTab === "providers" && (
            <div className="p-6 max-w-4xl">
              <h2 className="mb-4" style={{ fontSize: "18px", fontWeight: 600 }}>AI 服务商管理</h2>
              <div className="space-y-3">
                {providers.map((provider) => (
                  <ProviderDetailCard key={provider.id} provider={provider} />
                ))}
              </div>
            </div>
          )}

          {/* ═══ 性能监控 ═══ */}
          {activeTab === "performance" && (
            <div className="p-6 max-w-4xl">
              <h2 className="mb-4" style={{ fontSize: "18px", fontWeight: 600 }}>性能监控</h2>

              {/* 汇总 */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  {
                    label: "平均延迟",
                    value: `${(metrics.reduce((s, m) => s + m.latency, 0) / Math.max(metrics.length, 1)).toFixed(0)}ms`,
                    color: "#00ff87",
                    icon: Clock,
                  },
                  {
                    label: "平均吞吐",
                    value: `${(metrics.reduce((s, m) => s + m.throughput, 0) / Math.max(metrics.length, 1)).toFixed(0)} tok/s`,
                    color: "#60efff",
                    icon: Gauge,
                  },
                  {
                    label: "成功率",
                    value: `${((metrics.reduce((s, m) => s + m.successRate, 0) / Math.max(metrics.length, 1)) * 100).toFixed(1)}%`,
                    color: "#a855f7",
                    icon: CircleCheck,
                  },
                  {
                    label: "总请求",
                    value: `${metrics.reduce((s, m) => s + m.totalRequests, 0)}`,
                    color: "#ffb86c",
                    icon: ChartBar,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <item.icon size={12} style={{ color: item.color }} />
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{item.label}</span>
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 600, color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* 按 Provider 的详细表格 */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="grid gap-3 px-4 py-2"
                  style={{
                    gridTemplateColumns: "1fr 80px 80px 80px 80px 60px",
                    background: "rgba(255,255,255,0.03)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  <span>服务商 / 模型</span>
                  <span className="text-right">延迟</span>
                  <span className="text-right">吞吐</span>
                  <span className="text-right">成功率</span>
                  <span className="text-right">请求数</span>
                  <span className="text-right">错误</span>
                </div>
                {metrics.slice(0, 20).map((m) => {
                  const prov = providers.find((p) => p.id === m.providerId);
                  const model = prov?.models.find((md) => md.id === m.modelId);
                  return (
                    <div
                      key={m.id}
                      className="grid gap-3 px-4 py-2"
                      style={{
                        gridTemplateColumns: "1fr 80px 80px 80px 80px 60px",
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                        fontSize: "11.5px",
                      }}
                    >
                      <div>
                        <span className="opacity-60">{prov?.displayName}</span>
                        <span className="opacity-30 mx-1">·</span>
                        <span className="opacity-40">{model?.displayName}</span>
                      </div>
                      <span
                        className="text-right"
                        style={{ color: m.latency < 1000 ? "#00ff87" : m.latency < 2000 ? "#ffb86c" : "#ff6b6b" }}
                      >
                        {m.latency.toFixed(0)}ms
                      </span>
                      <span className="text-right" style={{ color: "#60efff" }}>
                        {m.throughput.toFixed(1)}
                      </span>
                      <span
                        className="text-right"
                        style={{ color: m.successRate >= 0.95 ? "#00ff87" : "#ffb86c" }}
                      >
                        {(m.successRate * 100).toFixed(1)}%
                      </span>
                      <span className="text-right opacity-50">{m.totalRequests}</span>
                      <span className="text-right" style={{ color: m.errorCount > 0 ? "#ff6b6b" : "rgba(255,255,255,0.2)" }}>
                        {m.errorCount}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ 成本报告 ═══ */}
          {activeTab === "cost" && (
            <div className="p-6 max-w-4xl">
              <h2 className="mb-4" style={{ fontSize: "18px", fontWeight: 600 }}>成本报告</h2>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div
                  className="rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>USD 总成本</span>
                  <div style={{ fontSize: "22px", fontWeight: 600, color: "#ffb86c" }}>${costs.usd.toFixed(4)}</div>
                </div>
                <div
                  className="rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>CNY 总成本</span>
                  <div style={{ fontSize: "22px", fontWeight: 600, color: "#ff6b6b" }}>¥{costs.cny.toFixed(4)}</div>
                </div>
                <div
                  className="rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>总令牌消耗</span>
                  <div style={{ fontSize: "22px", fontWeight: 600, color: "#a855f7" }}>
                    {costEntries.reduce((s, e) => s + e.inputTokens + e.outputTokens, 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* 明细 */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="grid gap-3 px-4 py-2"
                  style={{
                    gridTemplateColumns: "1fr 100px 80px 80px 80px",
                    background: "rgba(255,255,255,0.03)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  <span>服务商</span>
                  <span>模型</span>
                  <span className="text-right">输入令牌</span>
                  <span className="text-right">输出令牌</span>
                  <span className="text-right">成本</span>
                </div>
                {costEntries.map((entry, i) => {
                  const prov = providers.find((p) => p.id === entry.providerId);
                  const model = prov?.models.find((m) => m.id === entry.modelId);
                  return (
                    <div
                      key={i}
                      className="grid gap-3 px-4 py-2"
                      style={{
                        gridTemplateColumns: "1fr 100px 80px 80px 80px",
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                        fontSize: "11.5px",
                      }}
                    >
                      <span className="opacity-60">{prov?.displayName || entry.providerId}</span>
                      <span className="opacity-40">{model?.displayName || entry.modelId}</span>
                      <span className="text-right opacity-50">{entry.inputTokens.toLocaleString()}</span>
                      <span className="text-right opacity-50">{entry.outputTokens.toLocaleString()}</span>
                      <span className="text-right" style={{ color: "#ffb86c" }}>
                        {entry.currency === "USD" ? "$" : "¥"}{entry.cost.toFixed(4)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ 全局配置 ═══ */}
          {activeTab === "config" && (
            <div className="p-6 max-w-3xl">
              <h2 className="mb-4" style={{ fontSize: "18px", fontWeight: 600 }}>全局配置</h2>

              <div className="space-y-4">
                {/* 智能检测 */}
                <ConfigToggle
                  label="智能检测"
                  description="自动监控性能、分析错误、选择最佳 Provider"
                  icon={Gauge}
                  color="#00ff87"
                  enabled={detectionEnabled}
                  onToggle={toggleDetection}
                />

                {/* 缓存 */}
                <ConfigToggle
                  label="智能缓存"
                  description="缓存相同请求的响应，减少 API 调用和成本"
                  icon={Clock}
                  color="#60efff"
                  enabled={cacheEnabled}
                  onToggle={toggleCache}
                />

                {/* 限流 */}
                <ConfigToggle
                  label="速率限制"
                  description="控制每分钟请求频率，防止超出 API 配额"
                  icon={Shield}
                  color="#ffb86c"
                  enabled={rateLimitEnabled}
                  onToggle={toggleRateLimit}
                />
              </div>

              {/* 错误记录 */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 style={{ fontSize: "15px", fontWeight: 600 }}>错误记录</h3>
                  {errors.length > 0 && (
                    <button
                      onClick={clearErrors}
                      className="px-2 py-1 rounded transition-colors"
                      style={{ fontSize: "11px", color: "#ff6b6b", background: "rgba(255,50,50,0.06)" }}
                    >
                      清除全部
                    </button>
                  )}
                </div>
                {errors.length === 0 ? (
                  <div className="flex items-center gap-2 py-6 justify-center opacity-30" style={{ fontSize: "12px" }}>
                    <CircleCheck size={16} /> 暂无错误
                  </div>
                ) : (
                  <div className="space-y-2">
                    {errors.slice(0, 10).map((err) => (
                      <div
                        key={err.id}
                        className="rounded-lg px-3 py-2"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          fontSize: "12px",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <CircleAlert size={12} style={{ color: "#ff6b6b" }} />
                          <span className="opacity-60">{err.errorMessage}</span>
                          <span className="ml-auto opacity-25" style={{ fontSize: "10px" }}>
                            ×{err.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Provider 详情卡片 ─── */
const ProviderDetailCard: React.FC<{ provider: AIProviderConfig }> = ({ provider }) => {
  const { toggleProvider, setActiveProvider, setApiKey, activeProviderId, setActiveModel, toggleModel, activeModelId } =
    useAIServiceStore();
  const [expanded, setExpanded] = useState(provider.id === activeProviderId);
  const [showApiKey, setShowApiKey] = useState(false);
  const [editKey, setEditKey] = useState(false);
  const [keyVal, setKeyVal] = useState("");

  const isActive = activeProviderId === provider.id;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: isActive ? "rgba(0,255,135,0.03)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isActive ? "rgba(0,255,135,0.12)" : "rgba(255,255,255,0.06)"}`,
      }}
    >
      {/* 头部 */}
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        {expanded ? <ChevronDown size={14} className="opacity-40" /> : <ChevronRight size={14} className="opacity-40" />}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{
            background: provider.type === "cloud"
              ? "linear-gradient(135deg, rgba(96,239,255,0.12), rgba(168,85,247,0.12))"
              : "linear-gradient(135deg, rgba(0,255,135,0.12), rgba(96,239,255,0.12))",
          }}
        >
          {provider.type === "cloud" ? <Cloud size={16} style={{ color: "#60efff" }} /> : <Server size={16} style={{ color: "#00ff87" }} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "14px", fontWeight: 500 }}>{provider.displayName}</span>
            {provider.region && (
              <span className="px-1.5 py-0 rounded" style={{ fontSize: "9px", background: "rgba(255,184,108,0.1)", color: "#ffb86c" }}>
                {provider.region}
              </span>
            )}
            {isActive && (
              <span className="px-1.5 py-0 rounded flex items-center gap-0.5" style={{ fontSize: "9px", background: "rgba(0,255,135,0.1)", color: "#00ff87" }}>
                <Check size={8} /> 活跃
              </span>
            )}
          </div>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
            {provider.models.filter((m) => m.enabled).length} 模型 · 优先级 {provider.priority}
          </span>
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {!isActive && provider.enabled && (
            <button
              onClick={() => setActiveProvider(provider.id)}
              className="px-3 py-1.5 rounded-lg"
              style={{ fontSize: "11px", background: "rgba(0,255,135,0.08)", color: "#00ff87", border: "1px solid rgba(0,255,135,0.15)" }}
            >
              设为活跃
            </button>
          )}
          <button
            onClick={() => toggleProvider(provider.id)}
            style={{ color: provider.enabled ? "#00ff87" : "rgba(255,255,255,0.25)" }}
          >
            {provider.enabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
          </button>
        </div>
      </div>

      {/* 展开 */}
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {/* API Key */}
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>API Key</span>
              {provider.apiKeyURL && (
                <a
                  href={provider.apiKeyURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-0.5 rounded"
                  style={{ fontSize: "10px", color: "#60efff", background: "rgba(96,239,255,0.06)", textDecoration: "none" }}
                >
                  <ExternalLink size={9} /> 获取密钥
                </a>
              )}
            </div>
            {editKey ? (
              <div className="flex items-center gap-2">
                <input
                  value={keyVal}
                  onChange={(e) => setKeyVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setApiKey(provider.id, keyVal);
                      setEditKey(false);
                    }
                  }}
                  placeholder="输入 API Key..."
                  type="password"
                  autoFocus
                  className="flex-1 px-3 py-1.5 rounded-lg bg-transparent outline-none"
                  style={{ fontSize: "12px", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}
                />
                <button
                  onClick={() => { setApiKey(provider.id, keyVal); setEditKey(false); }}
                  className="px-3 py-1.5 rounded-lg"
                  style={{ fontSize: "11px", background: "rgba(0,255,135,0.1)", color: "#00ff87" }}
                >
                  保存
                </button>
                <button
                  onClick={() => setEditKey(false)}
                  className="px-3 py-1.5 rounded-lg opacity-40"
                  style={{ fontSize: "11px" }}
                >
                  取消
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                  {provider.apiKey ? (showApiKey ? provider.apiKey : "●".repeat(12)) : "未配置"}
                </div>
                {provider.apiKey && (
                  <button onClick={() => setShowApiKey(!showApiKey)} className="opacity-30 hover:opacity-60">
                    {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
                <button onClick={() => { setEditKey(true); setKeyVal(provider.apiKey); }} className="opacity-30 hover:opacity-60">
                  <Pencil size={14} />
                </button>
              </div>
            )}
          </div>

          {/* 模型列表 */}
          <div className="px-4 py-3">
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>模型</span>
            <div className="mt-2 space-y-1.5">
              {provider.models.map((model) => (
                <div
                  key={model.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{
                    background: activeModelId === model.id ? "rgba(0,255,135,0.06)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${activeModelId === model.id ? "rgba(0,255,135,0.1)" : "rgba(255,255,255,0.04)"}`,
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "12.5px", fontWeight: 500 }}>{model.displayName}</span>
                      <span className="px-1 rounded" style={{ fontSize: "8px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
                        {model.type}
                      </span>
                      {model.capabilities.map((c) => (
                        <span key={c} className="px-1 rounded" style={{ fontSize: "8px", background: "rgba(96,239,255,0.06)", color: "rgba(96,239,255,0.6)" }}>
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5" style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
                      <span>{(model.contextLength / 1000).toFixed(0)}K ctx</span>
                      <span>{model.maxTokens} max</span>
                      {model.benchmark && (
                        <>
                          <span>{model.benchmark.latency}ms</span>
                          <span>{(model.benchmark.accuracy * 100).toFixed(0)}% acc</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {model.type === "chat" && model.enabled && activeModelId !== model.id && (
                      <button
                        onClick={() => { setActiveProvider(provider.id); setActiveModel(model.id); }}
                        className="px-2 py-1 rounded"
                        style={{ fontSize: "10px", color: "#00ff87", background: "rgba(0,255,135,0.06)" }}
                      >
                        选用
                      </button>
                    )}
                    {activeModelId === model.id && <Check size={14} style={{ color: "#00ff87" }} />}
                    <button
                      onClick={() => toggleModel(provider.id, model.id)}
                      style={{ color: model.enabled ? "#00ff87" : "rgba(255,255,255,0.2)" }}
                    >
                      {model.enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── 配置开关 ─── */
const ConfigToggle: React.FC<{
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  enabled: boolean;
  onToggle: () => void;
}> = ({ label, description, icon: Icon, color, enabled, onToggle }) => (
  <div
    className="flex items-center gap-4 rounded-xl px-4 py-3"
    style={{
      background: enabled ? `${color}08` : "rgba(255,255,255,0.02)",
      border: `1px solid ${enabled ? `${color}20` : "rgba(255,255,255,0.06)"}`,
    }}
  >
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center"
      style={{ background: `${color}15` }}
    >
      <Icon size={18} style={{ color }} />
    </div>
    <div className="flex-1">
      <div style={{ fontSize: "14px", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>{description}</div>
    </div>
    <button onClick={onToggle} style={{ color: enabled ? color : "rgba(255,255,255,0.25)" }}>
      {enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
    </button>
  </div>
);

export default AISettingsPage;
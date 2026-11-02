/**
 * @file AIProviderPanel.tsx
 * @description AI 服务商管理面板 v2.0 — API Key 验证状态 + 一键获取密钥 + 模型参数滑块调节
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.0.0
 * @created 2026-03-14
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, ai, provider, model, api-key, parameter-slider, management
 */

import React, { useState } from "react";
import {
  Bot, Key, ExternalLink, ToggleLeft, ToggleRight, Settings,
  ChevronDown, ChevronRight, Cloud, Server, Zap, Shield,
  Eye, EyeOff, Check, X, CircleAlert, Copy, Trash2,
  Plus, Pencil, Activity, DollarSign, Clock, Gauge,
  SlidersHorizontal,
} from "lucide-react";
import {
  useAIServiceStore,
  type AIProviderConfig,
  type AIModelConfig,
} from "../../../stores/aiServiceStore";

/* ─── Provider 卡片 ─── */
const ProviderCard: React.FC<{
  provider: AIProviderConfig;
  isExpanded: boolean;
  onToggleExpand: () => void;
}> = ({ provider, isExpanded, onToggleExpand }) => {
  const { toggleProvider, setActiveProvider, setApiKey, activeProviderId, setActiveModel } =
    useAIServiceStore();
  const [showApiKey, setShowApiKey] = useState(false);
  const [editingKey, setEditingKey] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [validating, setValidating] = useState(false);
  const [keyValid, setKeyValid] = useState<boolean | null>(null);

  const isActive = activeProviderId === provider.id;
  const hasKey = provider.apiKey.length > 0;

  const handleSaveKey = async () => {
    setApiKey(provider.id, keyInput);
    setEditingKey(false);
    setValidating(true);
    // 模拟验证（检查长度 + 格式）
    await new Promise((r) => setTimeout(r, 1000));
    const isValid = keyInput.length > 10 && (
      keyInput.startsWith("sk-") || keyInput.startsWith("key-") || provider.type === "local" || keyInput.length > 20
    );
    setKeyValid(isValid);
    setValidating(false);
  };

  const handleCopyKey = () => {
    if (hasKey) {
      navigator.clipboard.writeText(provider.apiKey);
    }
  };

  const handleSelectProvider = () => {
    setActiveProvider(provider.id);
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: isActive ? "rgba(0,255,135,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isActive ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.06)"}`,
        transition: "all 0.2s",
      }}
    >
      {/* 卡片头部 */}
      <div
        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
        onClick={onToggleExpand}
      >
        {/* 展开图标 */}
        {isExpanded ? (
          <ChevronDown size={13} className="opacity-40 flex-shrink-0" />
        ) : (
          <ChevronRight size={13} className="opacity-40 flex-shrink-0" />
        )}

        {/* Provider 图标 */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: provider.type === "cloud"
              ? "linear-gradient(135deg, rgba(96,239,255,0.15), rgba(168,85,247,0.15))"
              : "linear-gradient(135deg, rgba(0,255,135,0.15), rgba(96,239,255,0.15))",
            border: `1px solid ${
              provider.type === "cloud" ? "rgba(96,239,255,0.2)" : "rgba(0,255,135,0.2)"
            }`,
          }}
        >
          {provider.type === "cloud" ? (
            <Cloud size={14} style={{ color: "#60efff" }} />
          ) : (
            <Server size={14} style={{ color: "#00ff87" }} />
          )}
        </div>

        {/* 名称 + 信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "13px", fontWeight: 500 }}>{provider.displayName}</span>
            {provider.region && (
              <span
                className="px-1.5 py-0 rounded-full"
                style={{
                  fontSize: "9px",
                  background: "rgba(255,184,108,0.1)",
                  color: "#ffb86c",
                  border: "1px solid rgba(255,184,108,0.15)",
                }}
              >
                {provider.region}
              </span>
            )}
            {isActive && (
              <span
                className="px-1.5 py-0 rounded-full flex items-center gap-0.5"
                style={{
                  fontSize: "9px",
                  background: "rgba(0,255,135,0.1)",
                  color: "#00ff87",
                  border: "1px solid rgba(0,255,135,0.15)",
                }}
              >
                <Check size={8} /> 活跃
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5" style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)" }}>
            <span>{provider.models.filter((m) => m.enabled).length} 个模型</span>
            {provider.pricing && (
              <span>
                {provider.pricing.currency === "USD" ? "$" : "¥"}
                {provider.pricing.inputPrice}/1K tok
              </span>
            )}
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {!isActive && provider.enabled && (
            <button
              onClick={handleSelectProvider}
              className="px-2 py-1 rounded-md transition-colors"
              style={{
                fontSize: "10px",
                background: "rgba(0,255,135,0.06)",
                color: "#00ff87",
                border: "1px solid rgba(0,255,135,0.15)",
              }}
            >
              激活
            </button>
          )}
          <button
            onClick={() => toggleProvider(provider.id)}
            className="w-7 h-7 flex items-center justify-center rounded transition-colors"
            style={{
              color: provider.enabled ? "#00ff87" : "rgba(255,255,255,0.25)",
            }}
            title={provider.enabled ? "禁用" : "启用"}
          >
            {provider.enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          </button>
        </div>
      </div>

      {/* 展开内容 */}
      {isExpanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {/* API Key 管理 */}
          <div className="px-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                <Key size={10} className="inline mr-1" />
                API Key
              </span>
              <div className="flex items-center gap-1">
                {provider.apiKeyURL && (
                  <a
                    href={provider.apiKeyURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors"
                    style={{
                      fontSize: "10px",
                      color: "#60efff",
                      background: "rgba(96,239,255,0.06)",
                      border: "1px solid rgba(96,239,255,0.12)",
                      textDecoration: "none",
                    }}
                  >
                    <ExternalLink size={9} /> 获取密钥
                  </a>
                )}
              </div>
            </div>

            {editingKey ? (
              <div className="flex items-center gap-1.5">
                <input
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSaveKey(); }}
                  placeholder="输入 API Key..."
                  className="flex-1 px-2 py-1 rounded bg-transparent outline-none"
                  style={{
                    fontSize: "11px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                  autoFocus
                  type="password"
                />
                <button
                  onClick={handleSaveKey}
                  className="w-6 h-6 flex items-center justify-center rounded"
                  style={{ background: "rgba(0,255,135,0.1)", color: "#00ff87" }}
                >
                  <Check size={11} />
                </button>
                <button
                  onClick={() => setEditingKey(false)}
                  className="w-6 h-6 flex items-center justify-center rounded opacity-40 hover:opacity-70"
                >
                  <X size={11} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 flex items-center gap-1.5 px-2 py-1 rounded"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {hasKey ? (
                    <>
                      <Shield size={10} className="flex-shrink-0" style={{ color: "#00ff87" }} />
                      <span>
                        {showApiKey
                          ? provider.apiKey
                          : `${"●".repeat(8)}...${provider.apiKey.slice(-4) || "●●●●"}`}
                      </span>
                    </>
                  ) : (
                    <span className="opacity-50">未配置</span>
                  )}
                </div>
                {hasKey && (
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="w-6 h-6 flex items-center justify-center rounded opacity-30 hover:opacity-60"
                  >
                    {showApiKey ? <EyeOff size={11} /> : <Eye size={11} />}
                  </button>
                )}
                {hasKey && (
                  <button
                    onClick={handleCopyKey}
                    className="w-6 h-6 flex items-center justify-center rounded opacity-30 hover:opacity-60"
                  >
                    <Copy size={11} />
                  </button>
                )}
                <button
                  onClick={() => { setEditingKey(true); setKeyInput(provider.apiKey); }}
                  className="w-6 h-6 flex items-center justify-center rounded opacity-30 hover:opacity-60"
                >
                  <Pencil size={11} />
                </button>
              </div>
            )}

            {validating && (
              <div className="mt-1.5 flex items-center gap-1" style={{ fontSize: "10px", color: "#60efff" }}>
                <Activity size={10} className="animate-pulse" /> 正在验证...
              </div>
            )}
            {keyValid === true && !validating && (
              <div className="mt-1.5 flex items-center gap-1" style={{ fontSize: "10px", color: "#00ff87" }}>
                <Check size={10} /> API Key 验证通过
              </div>
            )}
            {keyValid === false && !validating && (
              <div className="mt-1.5 flex items-center gap-1" style={{ fontSize: "10px", color: "#ff6b6b" }}>
                <CircleAlert size={10} /> API Key 无效
              </div>
            )}
          </div>

          {/* 模型列表 */}
          <div className="px-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>模型列表</span>
            </div>
            <div className="space-y-1">
              {provider.models.map((model) => (
                <ModelItem
                  key={model.id}
                  model={model}
                  providerId={provider.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── 参数滑块 ─── */
const ParamSlider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (v: number) => void;
}> = ({ label, value, min, max, step, color, onChange }) => (
  <div className="flex items-center gap-2">
    <span className="w-20 flex-shrink-0" style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>{label}</span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, ${color} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) ${((value - min) / (max - min)) * 100}%)`,
        accentColor: color,
      }}
    />
    <span className="w-10 text-right font-mono" style={{ fontSize: "10px", color }}>{value.toFixed(step < 1 ? (step < 0.01 ? 2 : 1) : 0)}</span>
  </div>
);

/* ─── Model 条目 (v2.0 带参数滑块) ─── */
const ModelItem: React.FC<{
  model: AIModelConfig;
  providerId: string;
}> = ({ model, providerId }) => {
  const { toggleModel, setActiveModel, activeModelId, editModel } = useAIServiceStore();
  const isActive = activeModelId === model.id;
  const [showParams, setShowParams] = useState(false);

  const updateParam = (key: keyof AIModelConfig["parameters"], value: number) => {
    editModel(providerId, {
      ...model,
      parameters: { ...model.parameters, [key]: value },
    });
  };

  return (
    <div
      className="rounded-lg overflow-hidden transition-colors"
      style={{
        background: isActive ? "rgba(0,255,135,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isActive ? "rgba(0,255,135,0.12)" : "rgba(255,255,255,0.04)"}`,
      }}
    >
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: "11.5px", color: model.enabled ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)" }}>
              {model.displayName}
            </span>
            {model.type === "embedding" && (
              <span className="px-1 rounded" style={{ fontSize: "8px", background: "rgba(168,85,247,0.1)", color: "#a855f7" }}>EMB</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5" style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.25)" }}>
            <span>{(model.contextLength / 1000).toFixed(0)}K ctx</span>
            {model.benchmark && (
              <>
                <span>{model.benchmark.latency}ms</span>
                <span>{(model.benchmark.accuracy * 100).toFixed(0)}%</span>
              </>
            )}
            {model.capabilities.slice(0, 3).map((cap) => (
              <span key={cap} className="px-1 rounded" style={{ background: "rgba(255,255,255,0.04)" }}>{cap}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          {model.type === "chat" && model.enabled && (
            <button
              onClick={() => setShowParams(!showParams)}
              className="w-5 h-5 flex items-center justify-center rounded transition-colors"
              style={{ color: showParams ? "#a855f7" : "rgba(255,255,255,0.2)" }}
              title="参数调节"
            >
              <SlidersHorizontal size={11} />
            </button>
          )}
          {model.type === "chat" && model.enabled && !isActive && (
            <button
              onClick={() => setActiveModel(model.id)}
              className="px-1.5 py-0.5 rounded transition-colors"
              style={{ fontSize: "9px", color: "#00ff87", background: "rgba(0,255,135,0.06)", border: "1px solid rgba(0,255,135,0.12)" }}
            >
              选用
            </button>
          )}
          {isActive && (
            <span className="px-1.5 py-0.5 rounded flex items-center gap-0.5" style={{ fontSize: "9px", color: "#00ff87", background: "rgba(0,255,135,0.08)" }}>
              <Check size={8} />
            </span>
          )}
          <button
            onClick={() => toggleModel(providerId, model.id)}
            className="w-5 h-5 flex items-center justify-center rounded"
            style={{ color: model.enabled ? "#00ff87" : "rgba(255,255,255,0.2)" }}
          >
            {model.enabled ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
          </button>
        </div>
      </div>

      {/* 参数滑块面板 */}
      {showParams && (
        <div className="px-3 py-2 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(168,85,247,0.02)" }}>
          <div className="flex items-center gap-1 mb-1" style={{ fontSize: "10px", color: "#a855f7" }}>
            <SlidersHorizontal size={9} /> 模型参数
          </div>
          <ParamSlider label="Temperature" value={model.parameters.temperature} min={0} max={2} step={0.1} color="#a855f7" onChange={(v) => updateParam("temperature", v)} />
          <ParamSlider label="Top-P" value={model.parameters.topP} min={0} max={1} step={0.05} color="#60efff" onChange={(v) => updateParam("topP", v)} />
          <ParamSlider label="Freq Penalty" value={model.parameters.frequencyPenalty} min={0} max={2} step={0.1} color="#ffb86c" onChange={(v) => updateParam("frequencyPenalty", v)} />
          <ParamSlider label="Pres Penalty" value={model.parameters.presencePenalty} min={0} max={2} step={0.1} color="#00ff87" onChange={(v) => updateParam("presencePenalty", v)} />
        </div>
      )}
    </div>
  );
};

/* ─── 主面板 ─── */
export const AIProviderPanel: React.FC = () => {
  const {
    providers,
    activeProviderId,
    activeModelId,
    detectionEnabled,
    cacheEnabled,
    rateLimitEnabled,
    toggleDetection,
    toggleCache,
    toggleRateLimit,
    getActiveProvider,
    getActiveModel,
    getTotalCost,
  } = useAIServiceStore();

  const [expandedProvider, setExpandedProvider] = useState<string | null>(activeProviderId);
  const activeProvider = getActiveProvider();
  const activeModel = getActiveModel();
  const costs = getTotalCost();

  return (
    <div className="flex flex-col h-full" style={{ background: "#14142a", color: "rgba(255,255,255,0.85)" }}>
      {/* 顶部概览 */}
      <div className="px-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 mb-2">
          <Bot size={16} style={{ color: "#00ff87" }} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>AI 服务管理</span>
        </div>

        {/* 当前活跃服务 */}
        {activeProvider && activeModel && (
          <div
            className="rounded-lg px-3 py-2"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,135,0.05), rgba(96,239,255,0.05))",
              border: "1px solid rgba(0,255,135,0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5" style={{ fontSize: "12px" }}>
                  <Zap size={11} style={{ color: "#00ff87" }} />
                  <span style={{ color: "#00ff87" }}>{activeProvider.displayName}</span>
                  <span className="opacity-30">·</span>
                  <span>{activeModel.displayName}</span>
                </div>
                <div className="flex items-center gap-2 mt-1" style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>
                  <span>{activeModel.contextLength.toLocaleString()} ctx</span>
                  <span>{activeModel.maxTokens.toLocaleString()} max</span>
                </div>
              </div>
              <div className="text-right" style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>
                {costs.usd > 0 && <div>${costs.usd.toFixed(4)} USD</div>}
                {costs.cny > 0 && <div>¥{costs.cny.toFixed(4)} CNY</div>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 全局开关 */}
      <div
        className="px-3 py-2 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "11px" }}
      >
        <button
          onClick={toggleDetection}
          className="flex items-center gap-1 px-2 py-1 rounded transition-colors"
          style={{
            background: detectionEnabled ? "rgba(0,255,135,0.06)" : "rgba(255,255,255,0.03)",
            color: detectionEnabled ? "#00ff87" : "rgba(255,255,255,0.35)",
            border: `1px solid ${detectionEnabled ? "rgba(0,255,135,0.12)" : "rgba(255,255,255,0.06)"}`,
          }}
        >
          <Gauge size={10} />
          智能检测
        </button>
        <button
          onClick={toggleCache}
          className="flex items-center gap-1 px-2 py-1 rounded transition-colors"
          style={{
            background: cacheEnabled ? "rgba(96,239,255,0.06)" : "rgba(255,255,255,0.03)",
            color: cacheEnabled ? "#60efff" : "rgba(255,255,255,0.35)",
            border: `1px solid ${cacheEnabled ? "rgba(96,239,255,0.12)" : "rgba(255,255,255,0.06)"}`,
          }}
        >
          <Clock size={10} />
          缓存
        </button>
        <button
          onClick={toggleRateLimit}
          className="flex items-center gap-1 px-2 py-1 rounded transition-colors"
          style={{
            background: rateLimitEnabled ? "rgba(255,184,108,0.06)" : "rgba(255,255,255,0.03)",
            color: rateLimitEnabled ? "#ffb86c" : "rgba(255,255,255,0.35)",
            border: `1px solid ${rateLimitEnabled ? "rgba(255,184,108,0.12)" : "rgba(255,255,255,0.06)"}`,
          }}
        >
          <Shield size={10} />
          限流
        </button>
      </div>

      {/* Provider 列表 */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            isExpanded={expandedProvider === provider.id}
            onToggleExpand={() =>
              setExpandedProvider(expandedProvider === provider.id ? null : provider.id)
            }
          />
        ))}
      </div>
    </div>
  );
};
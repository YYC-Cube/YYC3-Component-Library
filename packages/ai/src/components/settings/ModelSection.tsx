/**
 * @file ModelSection.tsx
 * @description 设置页面 — 模型配置管理（添加/编辑/删除模型、API Key 管理）
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings, models, api-keys
 */

import React, { useState } from "react";
import { Cpu, Plus, Key, ExternalLink, Eye, EyeOff, CircleCheck } from "lucide-react";
import { useSettingsStore, type ModelConfig } from "../../stores/settingsStore";
import {
  SectionHeader, ItemCard, Badge, ActionButton, SettingsDialog, EmptyState, GlassCard,
} from "./SettingsShared";
import { validateApiKey, type ValidationResult } from "../../services/settingsSyncService";
import { useI18nStore } from "../../stores/i18nStore";

const providerKeyUrls: Record<string, string> = {
  OpenAI: "https://platform.openai.com/api-keys",
  Anthropic: "https://console.anthropic.com/settings/keys",
  "智谱 AI": "https://open.bigmodel.cn/usercenter/apikeys",
  "百度文心": "https://console.bce.baidu.com/qianfan/ais/console/application/list",
  "阿里通义": "https://dashscope.console.aliyun.com/apiKey",
};

const ModelSection: React.FC = () => {
  const { settings, addModel, updateModel, removeModel } = useSettingsStore();
  const t = useI18nStore((s) => s.t);
  const { models } = settings;
  const [showDialog, setShowDialog] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelConfig | null>(null);
  const [draft, setDraft] = useState<Partial<ModelConfig>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [validating, setValidating] = useState<Record<string, boolean>>({});
  const [validationResults, setValidationResults] = useState<Record<string, { valid: boolean; message: string }>>({});

  const openCreate = () => {
    setEditingModel(null);
    setDraft({ provider: "OpenAI", model: "", apiKey: "", enabled: true });
    setShowDialog(true);
  };

  const openEdit = (model: ModelConfig) => {
    setEditingModel(model);
    setDraft({ ...model });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (editingModel) {
      updateModel(editingModel.id, draft);
    } else {
      addModel({
        id: `model-${Date.now()}`,
        provider: draft.provider || "OpenAI",
        model: draft.model || "",
        apiKey: draft.apiKey || "",
        enabled: draft.enabled ?? true,
      });
    }
    setShowDialog(false);
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((s) => ({ ...s, [id]: !s[id] }));
  };

  const maskKey = (key: string) => {
    if (!key) return "未配置";
    return key.slice(0, 6) + "••••••••" + key.slice(-4);
  };

  const handleValidateKey = async (model: ModelConfig) => {
    if (!model.apiKey) return;
    setValidating((s) => ({ ...s, [model.id]: true }));
    try {
      const result = await validateApiKey(model.provider, model.apiKey);
      setValidationResults((s) => ({ ...s, [model.id]: result }));
    } finally {
      setValidating((s) => ({ ...s, [model.id]: false }));
    }
  };

  // 按服务商分组
  const grouped = models.reduce<Record<string, ModelConfig[]>>((acc, m) => {
    (acc[m.provider] = acc[m.provider] || []).push(m);
    return acc;
  }, {});

  return (
    <div>
      <SectionHeader
        icon={<Cpu size={18} style={{ color: "#ffb86c" }} />}
        title={t("settings.models.title")}
        description={t("settings.models.desc")}
        action={<ActionButton icon={<Plus size={13} />} label={t("settings.models.addModel")} color="#ffb86c" onClick={openCreate} variant="filled" />}
      />

      {Object.keys(grouped).length > 0 ? (
        Object.entries(grouped).map(([provider, providerModels]) => (
          <div key={provider} className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="m-0" style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
                {provider} ({providerModels.length})
              </p>
              {providerKeyUrls[provider] && (
                <a
                  href={providerKeyUrls[provider]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 no-underline transition-colors"
                  style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}
                >
                  <Key size={10} /> {t("settings.models.getKey")} <ExternalLink size={9} />
                </a>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {providerModels.map((model) => (
                <ItemCard
                  key={model.id}
                  active={model.enabled}
                  onEdit={() => openEdit(model)}
                  onDelete={() => removeModel(model.id)}
                  onToggle={(v) => updateModel(model.id, { enabled: v })}
                  enabled={model.enabled}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Cpu size={13} style={{ color: model.enabled ? "#ffb86c" : "rgba(255,255,255,0.3)" }} />
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                      {model.model}
                    </span>
                    {model.apiKey ? (
                      <Badge text={t("settings.models.configured")} color="#00ff87" bg="rgba(0,255,135,0.1)" />
                    ) : (
                      <Badge text={t("settings.models.notConfigured")} color="#ff6464" bg="rgba(255,100,100,0.1)" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                      {showKeys[model.id] ? model.apiKey || "—" : maskKey(model.apiKey)}
                    </span>
                    <button
                      onClick={() => toggleKeyVisibility(model.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      {showKeys[model.id] ? (
                        <Eye size={12} color="rgba(255,255,255,0.3)" />
                      ) : (
                        <EyeOff size={12} color="rgba(255,255,255,0.2)" />
                      )}
                    </button>
                    {model.apiKey && (
                      <button
                        onClick={() => handleValidateKey(model)}
                        disabled={validating[model.id]}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors"
                        style={{ fontSize: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
                      >
                        {validating[model.id] ? t("common.loading") :
                         validationResults[model.id]?.valid ? <><CircleCheck size={10} color="#00ff87" /> {t("common.success")}</> :
                         validationResults[model.id] ? <><span style={{ color: "#ff6464" }}>{validationResults[model.id].message}</span></> :
                         t("settings.mcp.testConnection")}
                      </button>
                    )}
                  </div>
                </ItemCard>
              ))}
            </div>
          </div>
        ))
      ) : (
        <EmptyState
          icon={<Cpu size={20} color="rgba(255,255,255,0.2)" />}
          title={t("settings.models.empty")}
          description={t("settings.models.emptyDesc")}
          action={<ActionButton icon={<Plus size={13} />} label={t("settings.models.addModel")} color="#ffb86c" onClick={openCreate} />}
        />
      )}

      {/* 安全提示 */}
      <GlassCard className="mt-4">
        <div className="flex items-center gap-2">
          <CircleCheck size={13} style={{ color: "#00ff87" }} />
          <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.4)" }}>
            {t("settings.models.securityNote")}
          </span>
        </div>
      </GlassCard>

      <SettingsDialog
        title={editingModel ? t("common.edit") : t("common.add")}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleSave}
        confirmLabel={editingModel ? t("common.save") : t("common.add")}
      >
        <div className="flex flex-col gap-3">
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>服务商</label>
            <select
              value={draft.provider || "OpenAI"}
              onChange={(e) => setDraft({ ...draft, provider: e.target.value })}
              className="w-full px-3 py-2 rounded-lg"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            >
              {["OpenAI", "Anthropic", "智谱 AI", "百度文心", "阿里通义", "Ollama"].map((p) => (
                <option key={p} value={p} style={{ background: "#1a1a2e" }}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>模型名称</label>
            <input
              value={draft.model || ""}
              onChange={(e) => setDraft({ ...draft, model: e.target.value })}
              placeholder="如: gpt-4-turbo-preview"
              className="w-full px-3 py-2 rounded-lg"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontFamily: "monospace" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>API Key</label>
            <input
              type="password"
              value={draft.apiKey || ""}
              onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full px-3 py-2 rounded-lg"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontFamily: "monospace" }}
            />
          </div>
        </div>
      </SettingsDialog>
    </div>
  );
};

export default ModelSection;
/**
 * @file AgentSection.tsx
 * @description 设置页面 — 智能体管理（内置/自定义智能体配置、系统提示词、模型参数）
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings, agents, ai-assistant
 */

import React, { useState } from "react";
import { Bot, Plus, Sparkles, Cpu, MessageSquare } from "lucide-react";
import { useSettingsStore, type AgentConfig } from "../../stores/settingsStore";
import {
  GlassCard, SectionHeader, ItemCard, Badge, ActionButton,
  SettingsDialog, SliderRow, EmptyState,
} from "./SettingsShared";
import { useI18nStore } from "../../stores/i18nStore";

const AgentSection: React.FC = () => {
  const { settings, addAgent, updateAgent, removeAgent } = useSettingsStore();
  const t = useI18nStore((s) => s.t);
  const { agents } = settings;
  const [showDialog, setShowDialog] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentConfig | null>(null);
  const [draft, setDraft] = useState<Partial<AgentConfig>>({});

  const builtInAgents = agents.filter((a) => a.isBuiltIn);
  const customAgents = agents.filter((a) => a.isCustom);

  const openCreate = () => {
    setEditingAgent(null);
    setDraft({
      name: "",
      description: "",
      systemPrompt: "",
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      maxTokens: 4096,
      isBuiltIn: false,
      isCustom: true,
    });
    setShowDialog(true);
  };

  const openEdit = (agent: AgentConfig) => {
    setEditingAgent(agent);
    setDraft({ ...agent });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (editingAgent) {
      updateAgent(editingAgent.id, draft);
    } else {
      addAgent({
        id: `agent-${Date.now()}`,
        name: draft.name || "新智能体",
        description: draft.description || "",
        systemPrompt: draft.systemPrompt || "",
        model: draft.model || "gpt-4-turbo-preview",
        temperature: draft.temperature ?? 0.7,
        maxTokens: draft.maxTokens ?? 4096,
        isBuiltIn: false,
        isCustom: true,
      });
    }
    setShowDialog(false);
  };

  const renderAgentCard = (agent: AgentConfig) => (
    <ItemCard
      key={agent.id}
      active={true}
      onEdit={() => openEdit(agent)}
      onDelete={agent.isBuiltIn ? undefined : () => removeAgent(agent.id)}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: agent.isBuiltIn
              ? "linear-gradient(135deg, rgba(0,255,135,0.15), rgba(96,239,255,0.15))"
              : "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.15))",
          }}
        >
          <Bot size={14} style={{ color: agent.isBuiltIn ? "#00ff87" : "#a855f7" }} />
        </div>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
          {agent.name}
        </span>
        <Badge
          text={agent.isBuiltIn ? "内置" : "自定义"}
          color={agent.isBuiltIn ? "#00ff87" : "#a855f7"}
          bg={agent.isBuiltIn ? "rgba(0,255,135,0.1)" : "rgba(168,85,247,0.1)"}
        />
      </div>
      {agent.description && (
        <p className="m-0 mb-1.5" style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.4)" }}>
          {agent.description}
        </p>
      )}
      <div className="flex items-center gap-3" style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.3)" }}>
        <span className="flex items-center gap-1"><Cpu size={10} /> {agent.model}</span>
        <span>T={agent.temperature}</span>
        <span>Max={agent.maxTokens}</span>
      </div>
    </ItemCard>
  );

  return (
    <div>
      <SectionHeader
        icon={<Sparkles size={18} style={{ color: "#a855f7" }} />}
        title={t("settings.agents.title")}
        description={t("settings.agents.desc")}
        action={<ActionButton icon={<Plus size={13} />} label={t("settings.agents.create")} color="#a855f7" onClick={openCreate} variant="filled" />}
      />

      {/* 内置智能体 */}
      {builtInAgents.length > 0 && (
        <div className="mb-5">
          <p className="m-0 mb-2" style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>
            {t("settings.agents.builtIn")} ({builtInAgents.length})
          </p>
          <div className="flex flex-col gap-2.5">
            {builtInAgents.map(renderAgentCard)}
          </div>
        </div>
      )}

      {/* 自定义智能体 */}
      <div>
        <p className="m-0 mb-2" style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>
          {t("settings.agents.custom")} ({customAgents.length})
        </p>
        {customAgents.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {customAgents.map(renderAgentCard)}
          </div>
        ) : (
          <EmptyState
            icon={<Bot size={20} color="rgba(255,255,255,0.2)" />}
            title={t("settings.agents.empty")}
            description={t("settings.agents.emptyDesc")}
            action={<ActionButton icon={<Plus size={13} />} label={t("settings.agents.create")} color="#a855f7" onClick={openCreate} />}
          />
        )}
      </div>

      {/* 创建/编辑对话框 */}
      <SettingsDialog
        title={editingAgent ? t("common.edit") : t("settings.agents.create")}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleSave}
        confirmLabel={editingAgent ? t("common.save") : t("common.add")}
      >
        <div className="flex flex-col gap-3">
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>名称</label>
            <input
              value={draft.name || ""}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="智能体名称"
              className="w-full px-3 py-2 rounded-lg"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>描述</label>
            <input
              value={draft.description || ""}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="智能体描述"
              className="w-full px-3 py-2 rounded-lg"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>系统提示词</label>
            <textarea
              value={draft.systemPrompt || ""}
              onChange={(e) => setDraft({ ...draft, systemPrompt: e.target.value })}
              placeholder="输入系统提示词..."
              rows={4}
              className="w-full px-3 py-2 rounded-lg resize-none"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>模型</label>
            <select
              value={draft.model || "gpt-4-turbo-preview"}
              onChange={(e) => setDraft({ ...draft, model: e.target.value })}
              className="w-full px-3 py-2 rounded-lg"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            >
              <option value="gpt-4-turbo-preview" style={{ background: "#1a1a2e" }}>GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo" style={{ background: "#1a1a2e" }}>GPT-3.5 Turbo</option>
              <option value="claude-3-opus-20240229" style={{ background: "#1a1a2e" }}>Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229" style={{ background: "#1a1a2e" }}>Claude 3 Sonnet</option>
              <option value="glm-4" style={{ background: "#1a1a2e" }}>GLM-4</option>
            </select>
          </div>
          <SliderRow label="Temperature" value={draft.temperature ?? 0.7} min={0} max={2} step={0.1} onChange={(v) => setDraft({ ...draft, temperature: v })} />
          <SliderRow label="Max Tokens" value={draft.maxTokens ?? 4096} min={256} max={16384} step={256} onChange={(v) => setDraft({ ...draft, maxTokens: v })} />
        </div>
      </SettingsDialog>
    </div>
  );
};

export default AgentSection;
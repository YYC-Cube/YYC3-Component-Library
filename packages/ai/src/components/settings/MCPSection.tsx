/**
 * @file MCPSection.tsx
 * @description 设置页面 — MCP 连接管理（添加/编辑/删除/启停 MCP、连接测试）
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings, mcp, connections
 */

import React, { useState } from "react";
import { Plug, Plus, Globe, CircleCheck, CircleAlert, Store } from "lucide-react";
import { useSettingsStore, type MCPConfig } from "../../stores/settingsStore";
import {
  SectionHeader, ItemCard, Badge, ActionButton, SettingsDialog, ToggleRow, EmptyState,
} from "./SettingsShared";
import { testMCPConnection, type MCPTestResult } from "../../services/settingsSyncService";
import { useI18nStore } from "../../stores/i18nStore";

const MCPSection: React.FC = () => {
  const { settings, addMCP, updateMCP, removeMCP } = useSettingsStore();
  const t = useI18nStore((s) => s.t);
  const { mcpConfigs } = settings;
  const [showDialog, setShowDialog] = useState(false);
  const [editingMCP, setEditingMCP] = useState<MCPConfig | null>(null);
  const [draft, setDraft] = useState<Partial<MCPConfig>>({});
  const [testResults, setTestResults] = useState<Record<string, MCPTestResult>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});

  const openCreate = () => {
    setEditingMCP(null);
    setDraft({ name: "", type: "manual", endpoint: "", enabled: true, projectLevel: false });
    setShowDialog(true);
  };

  const openEdit = (mcp: MCPConfig) => {
    setEditingMCP(mcp);
    setDraft({ ...mcp });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (editingMCP) {
      updateMCP(editingMCP.id, draft);
    } else {
      addMCP({
        id: `mcp-${Date.now()}`,
        name: draft.name || "新 MCP",
        type: (draft.type as "market" | "manual") || "manual",
        endpoint: draft.endpoint || "",
        enabled: draft.enabled ?? true,
        projectLevel: draft.projectLevel ?? false,
      });
    }
    setShowDialog(false);
  };

  const handleTestConnection = async (mcp: MCPConfig) => {
    if (!mcp.endpoint) return;
    setTesting((s) => ({ ...s, [mcp.id]: true }));
    try {
      const result = await testMCPConnection(mcp.endpoint);
      setTestResults((s) => ({ ...s, [mcp.id]: result }));
    } finally {
      setTesting((s) => ({ ...s, [mcp.id]: false }));
    }
  };

  return (
    <div>
      <SectionHeader
        icon={<Plug size={18} style={{ color: "#60efff" }} />}
        title={t("settings.mcp.title")}
        description={t("settings.mcp.desc")}
        action={
          <div className="flex gap-2">
            <ActionButton icon={<Store size={13} />} label={t("settings.mcp.market")} color="#60efff" onClick={() => {}} />
            <ActionButton icon={<Plus size={13} />} label={t("settings.mcp.addManual")} color="#00ff87" onClick={openCreate} variant="filled" />
          </div>
        }
      />

      {mcpConfigs.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {mcpConfigs.map((mcp) => (
            <ItemCard
              key={mcp.id}
              active={mcp.enabled}
              onEdit={() => openEdit(mcp)}
              onDelete={() => removeMCP(mcp.id)}
              onToggle={(v) => updateMCP(mcp.id, { enabled: v })}
              enabled={mcp.enabled}
            >
              <div className="flex items-center gap-2 mb-1">
                <Plug size={14} style={{ color: mcp.enabled ? "#60efff" : "rgba(255,255,255,0.3)" }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                  {mcp.name}
                </span>
                <Badge
                  text={mcp.type === "market" ? "市场" : "手动"}
                  color={mcp.type === "market" ? "#ffb86c" : "#60efff"}
                  bg={mcp.type === "market" ? "rgba(255,184,108,0.1)" : "rgba(96,239,255,0.1)"}
                />
                {mcp.projectLevel && <Badge text="项目级" color="#a855f7" bg="rgba(168,85,247,0.1)" />}
              </div>
              {mcp.endpoint && (
                <p className="m-0 mb-1.5" style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                  {mcp.endpoint}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleTestConnection(mcp)}
                  disabled={testing[mcp.id]}
                  className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
                  style={{ fontSize: "11px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                >
                  {testing[mcp.id] ? (
                    <>{t("settings.mcp.testing")}</>
                  ) : testResults[mcp.id]?.success ? (
                    <><CircleCheck size={11} color="#00ff87" /> {t("settings.mcp.testSuccess")} ({testResults[mcp.id].latency}ms)</>
                  ) : testResults[mcp.id] && !testResults[mcp.id].success ? (
                    <><CircleAlert size={11} color="#ff6464" /> {testResults[mcp.id].message}</>
                  ) : (
                    <><Globe size={11} /> {t("settings.mcp.testConnection")}</>
                  )}
                </button>
                {testResults[mcp.id]?.tools && testResults[mcp.id].tools!.length > 0 && (
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
                    {testResults[mcp.id].tools!.length} 个工具可用
                  </span>
                )}
              </div>
            </ItemCard>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Plug size={20} color="rgba(255,255,255,0.2)" />}
          title={t("settings.mcp.empty")}
          description={t("settings.mcp.emptyDesc")}
          action={<ActionButton icon={<Plus size={13} />} label={t("common.add")} color="#60efff" onClick={openCreate} />}
        />
      )}

      <SettingsDialog
        title={editingMCP ? t("common.edit") : t("common.add")}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleSave}
        confirmLabel={editingMCP ? t("common.save") : t("common.add")}
      >
        <div className="flex flex-col gap-3">
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>名称</label>
            <input
              value={draft.name || ""}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="MCP 名称"
              className="w-full px-3 py-2 rounded-lg"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>端点 URL</label>
            <input
              value={draft.endpoint || ""}
              onChange={(e) => setDraft({ ...draft, endpoint: e.target.value })}
              placeholder="http://localhost:3100/mcp"
              className="w-full px-3 py-2 rounded-lg"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontFamily: "monospace" }}
            />
          </div>
          <ToggleRow label="启用" value={draft.enabled ?? true} onChange={(v) => setDraft({ ...draft, enabled: v })} />
          <ToggleRow label="项目级别" description="仅对当前项目生效" value={draft.projectLevel ?? false} onChange={(v) => setDraft({ ...draft, projectLevel: v })} />
        </div>
      </SettingsDialog>
    </div>
  );
};

export default MCPSection;
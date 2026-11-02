/**
 * @file ContextSection.tsx
 * @description 设置页面 — 上下文管理（代码索引、忽略规则、文档集）
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings, context, indexing, documents
 */

import React, { useState } from "react";
import {
  BookOpen, RefreshCw, Database, Plus, X, FileText, Globe, FolderOpen,
  CircleCheck, LoaderCircle, CircleAlert,
} from "lucide-react";
import { useSettingsStore, type DocumentSet } from "../../stores/settingsStore";
import {
  SectionHeader, GlassCard, ActionButton, ItemCard, Badge, SettingsDialog, EmptyState, ToggleRow,
} from "./SettingsShared";
import { useI18nStore } from "../../stores/i18nStore";

const ContextSection: React.FC = () => {
  const { settings, updateContextSettings, addDocumentSet, removeDocumentSet } = useSettingsStore();
  const t = useI18nStore((s) => s.t);
  const { context } = settings;
  const [newRule, setNewRule] = useState("");
  const [showDocDialog, setShowDocDialog] = useState(false);
  const [docDraft, setDocDraft] = useState<Partial<DocumentSet>>({ source: "url", enabled: true });

  const statusConfig = {
    idle: { label: t("settings.context.statusIdle"), color: "rgba(255,255,255,0.4)", icon: <Database size={14} color="rgba(255,255,255,0.4)" /> },
    indexing: { label: t("settings.context.statusIndexing"), color: "#ffb86c", icon: <LoaderCircle size={14} color="#ffb86c" className="animate-spin" /> },
    completed: { label: t("settings.context.statusCompleted"), color: "#00ff87", icon: <CircleCheck size={14} color="#00ff87" /> },
    error: { label: t("settings.context.statusError"), color: "#ff6464", icon: <CircleAlert size={14} color="#ff6464" /> },
  };

  const status = statusConfig[context.indexStatus];

  const handleRefreshIndex = () => {
    updateContextSettings({ indexStatus: "indexing" });
    setTimeout(() => {
      updateContextSettings({ indexStatus: "completed" });
    }, 3000);
  };

  const handleDeleteIndex = () => {
    updateContextSettings({ indexStatus: "idle" });
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      updateContextSettings({ ignoreRules: [...context.ignoreRules, newRule.trim()] });
      setNewRule("");
    }
  };

  const handleRemoveRule = (rule: string) => {
    updateContextSettings({ ignoreRules: context.ignoreRules.filter((r) => r !== rule) });
  };

  const handleAddDocSet = () => {
    addDocumentSet({
      id: `doc-${Date.now()}`,
      name: docDraft.name || "未命名文档集",
      source: (docDraft.source as "url" | "local") || "url",
      url: docDraft.url,
      localPath: docDraft.localPath,
      enabled: true,
    });
    setShowDocDialog(false);
    setDocDraft({ source: "url", enabled: true });
  };

  return (
    <div>
      <SectionHeader
        icon={<BookOpen size={18} style={{ color: "#60efff" }} />}
        title={t("settings.context.title")}
        description={t("settings.context.desc")}
      />

      {/* 代码索引 */}
      <GlassCard className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Database size={14} style={{ color: "#60efff" }} />
            <span style={{ fontSize: "13px", fontWeight: 600 }}>{t("settings.context.codeIndex")}</span>
          </div>
          <div className="flex items-center gap-2">
            {status.icon}
            <span style={{ fontSize: "12px", color: status.color }}>{status.label}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefreshIndex}
            disabled={context.indexStatus === "indexing"}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors"
            style={{
              fontSize: "12px",
              color: context.indexStatus === "indexing" ? "rgba(255,255,255,0.3)" : "#60efff",
              background: "rgba(96,239,255,0.06)",
              border: "1px solid rgba(96,239,255,0.12)",
              cursor: context.indexStatus === "indexing" ? "not-allowed" : "pointer",
            }}
          >
            <RefreshCw size={13} /> {t("settings.context.refreshIndex")}
          </button>
          <button
            onClick={handleDeleteIndex}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors"
            style={{ fontSize: "12px", color: "#ff6464", background: "rgba(255,100,100,0.06)", border: "1px solid rgba(255,100,100,0.12)" }}
          >
            <X size={13} /> {t("settings.context.deleteIndex")}
          </button>
        </div>
      </GlassCard>

      {/* 忽略规则 */}
      <GlassCard className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText size={14} style={{ color: "#a855f7" }} />
            <span style={{ fontSize: "13px", fontWeight: 600 }}>{t("settings.context.ignoreRules")}</span>
          </div>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
            {context.ignoreRules.length} 条规则
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {context.ignoreRules.map((rule) => (
            <div
              key={rule}
              className="flex items-center gap-1 px-2 py-1 rounded-md"
              style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}
            >
              {rule}
              <button
                onClick={() => handleRemoveRule(rule)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
              >
                <X size={10} color="rgba(255,255,255,0.3)" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddRule()}
            placeholder={t("settings.context.addIgnoreRule")}
            className="flex-1 px-3 py-1.5 rounded-lg"
            style={{ fontSize: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontFamily: "monospace" }}
          />
          <button
            onClick={handleAddRule}
            className="px-3 py-1.5 rounded-lg"
            style={{ fontSize: "12px", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.15)", color: "#a855f7" }}
          >
            <Plus size={13} />
          </button>
        </div>
      </GlassCard>

      {/* 文档集 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={14} style={{ color: "#ffb86c" }} />
            <span style={{ fontSize: "13px", fontWeight: 600 }}>{t("settings.context.docSets")}</span>
          </div>
          <ActionButton icon={<Plus size={12} />} label={t("settings.context.addDocSet")} color="#ffb86c" onClick={() => setShowDocDialog(true)} />
        </div>

        {context.documentSets.length > 0 ? (
          <div className="flex flex-col gap-2">
            {context.documentSets.map((ds) => (
              <ItemCard
                key={ds.id}
                active={ds.enabled}
                onDelete={() => removeDocumentSet(ds.id)}
                onToggle={(v) => {/* 可扩展 */}}
                enabled={ds.enabled}
              >
                <div className="flex items-center gap-2">
                  {ds.source === "url" ? <Globe size={12} color="#60efff" /> : <FolderOpen size={12} color="#ffb86c" />}
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>{ds.name}</span>
                  <Badge text={ds.source === "url" ? "URL" : "本地"} color={ds.source === "url" ? "#60efff" : "#ffb86c"} bg={ds.source === "url" ? "rgba(96,239,255,0.1)" : "rgba(255,184,108,0.1)"} />
                </div>
                <p className="m-0 mt-1" style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                  {ds.url || ds.localPath || "—"}
                </p>
              </ItemCard>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen size={20} color="rgba(255,255,255,0.2)" />}
            title={t("settings.context.emptyDocs")}
            description={t("settings.context.emptyDocsDesc")}
          />
        )}
      </div>

      <SettingsDialog
        title={t("settings.context.addDocSet")}
        open={showDocDialog}
        onClose={() => setShowDocDialog(false)}
        onConfirm={handleAddDocSet}
        confirmLabel={t("common.add")}
      >
        <div className="flex flex-col gap-3">
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>名称</label>
            <input
              value={docDraft.name || ""}
              onChange={(e) => setDocDraft({ ...docDraft, name: e.target.value })}
              placeholder="文档集名称"
              className="w-full px-3 py-2 rounded-lg"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>来源</label>
            <div className="flex gap-2">
              {(["url", "local"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setDocDraft({ ...docDraft, source: s })}
                  className="flex-1 py-2 rounded-lg"
                  style={{
                    fontSize: "12px",
                    background: docDraft.source === s ? "rgba(0,255,135,0.08)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${docDraft.source === s ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.06)"}`,
                    color: docDraft.source === s ? "#00ff87" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {s === "url" ? "URL 地址" : "本地路径"}
                </button>
              ))}
            </div>
          </div>
          {docDraft.source === "url" ? (
            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>URL</label>
              <input
                value={docDraft.url || ""}
                onChange={(e) => setDocDraft({ ...docDraft, url: e.target.value })}
                placeholder="https://docs.example.com"
                className="w-full px-3 py-2 rounded-lg"
                style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontFamily: "monospace" }}
              />
            </div>
          ) : (
            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>本地路径</label>
              <input
                value={docDraft.localPath || ""}
                onChange={(e) => setDocDraft({ ...docDraft, localPath: e.target.value })}
                placeholder="/path/to/docs"
                className="w-full px-3 py-2 rounded-lg"
                style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontFamily: "monospace" }}
              />
            </div>
          )}
        </div>
      </SettingsDialog>
    </div>
  );
};

export default ContextSection;
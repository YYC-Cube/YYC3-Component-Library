/**
 * @file ConversationSection.tsx
 * @description 设置页面 — 对话流设置（待办、自动修复、代码审查、通知、命令白名单）
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings, conversation, workflow
 */

import React, { useState } from "react";
import { MessageSquare, Bell, Terminal, Plus, X, Volume2 } from "lucide-react";
import { useSettingsStore } from "../../stores/settingsStore";
import { useI18nStore } from "../../stores/i18nStore";
import {
  SectionHeader, GlassCard, ToggleRow, SelectRow, SliderRow,
} from "./SettingsShared";

const ConversationSection: React.FC = () => {
  const { settings, updateConversationSettings } = useSettingsStore();
  const t = useI18nStore((s) => s.t);
  const { conversation } = settings;
  const [newCmd, setNewCmd] = useState("");

  const handleAddCmd = () => {
    if (newCmd.trim()) {
      updateConversationSettings({
        whitelistCommands: [...conversation.whitelistCommands, newCmd.trim()],
      });
      setNewCmd("");
    }
  };

  const handleRemoveCmd = (cmd: string) => {
    updateConversationSettings({
      whitelistCommands: conversation.whitelistCommands.filter((c) => c !== cmd),
    });
  };

  const toggleNotificationType = (type: "banner" | "sound" | "menu") => {
    const types = conversation.notificationTypes.includes(type)
      ? conversation.notificationTypes.filter((t) => t !== type)
      : [...conversation.notificationTypes, type];
    updateConversationSettings({ notificationTypes: types });
  };

  return (
    <div>
      <SectionHeader
        icon={<MessageSquare size={18} style={{ color: "#a855f7" }} />}
        title={t("settings.conversation.title")}
        description={t("settings.conversation.desc")}
      />

      {/* 智能行为 */}
      <GlassCard className="mb-4">
        <p className="m-0 mb-2" style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
          {t("settings.conversation.smartBehavior")}
        </p>
        <ToggleRow
          label={t("settings.conversation.todoList")}
          description={t("settings.conversation.todoListDesc")}
          value={conversation.useTodoList}
          onChange={(v) => updateConversationSettings({ useTodoList: v })}
        />
        <ToggleRow
          label={t("settings.conversation.autoCollapse")}
          description={t("settings.conversation.autoCollapseDesc")}
          value={conversation.autoCollapseNodes}
          onChange={(v) => updateConversationSettings({ autoCollapseNodes: v })}
        />
        <ToggleRow
          label={t("settings.conversation.autoFix")}
          description={t("settings.conversation.autoFixDesc")}
          value={conversation.autoFixCodeIssues}
          onChange={(v) => updateConversationSettings({ autoFixCodeIssues: v })}
        />
        <ToggleRow
          label={t("settings.conversation.proactive")}
          description={t("settings.conversation.proactiveDesc")}
          value={conversation.agentProactiveQuestion}
          onChange={(v) => updateConversationSettings({ agentProactiveQuestion: v })}
        />
      </GlassCard>

      {/* 代码审查 */}
      <GlassCard className="mb-4">
        <p className="m-0 mb-2" style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
          {t("settings.conversation.codeReview")}
        </p>
        <SelectRow
          label={t("settings.conversation.reviewScope")}
          value={conversation.codeReviewScope}
          options={[
            { value: "none", label: t("settings.conversation.reviewNone") },
            { value: "all", label: t("settings.conversation.reviewAll") },
            { value: "changed", label: t("settings.conversation.reviewChanged") },
          ]}
          onChange={(v) => updateConversationSettings({ codeReviewScope: v as "none" | "all" | "changed" })}
        />
        <ToggleRow
          label={t("settings.conversation.jumpAfterReview")}
          description={t("settings.conversation.jumpAfterReviewDesc")}
          value={conversation.jumpAfterReview}
          onChange={(v) => updateConversationSettings({ jumpAfterReview: v })}
        />
      </GlassCard>

      {/* 命令执行 */}
      <GlassCard className="mb-4">
        <p className="m-0 mb-2" style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
          {t("settings.conversation.commandExec")}
        </p>
        <ToggleRow
          label={t("settings.conversation.autoRunMCP")}
          description={t("settings.conversation.autoRunMCPDesc")}
          value={conversation.autoRunMCP}
          onChange={(v) => updateConversationSettings({ autoRunMCP: v })}
        />
        <SelectRow
          label={t("settings.conversation.cmdRunMode")}
          value={conversation.commandRunMode}
          options={[
            { value: "sandbox", label: t("settings.conversation.sandbox") },
            { value: "direct", label: t("settings.conversation.direct") },
          ]}
          onChange={(v) => updateConversationSettings({ commandRunMode: v as "sandbox" | "direct" })}
        />

        {/* 白名单 */}
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Terminal size={12} style={{ color: "#60efff" }} />
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{t("settings.conversation.whitelist")}</span>
            </div>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
              {conversation.whitelistCommands.length} 条
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {conversation.whitelistCommands.map((cmd) => (
              <div
                key={cmd}
                className="flex items-center gap-1 px-2 py-1 rounded-md"
                style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}
              >
                {cmd}
                <button onClick={() => handleRemoveCmd(cmd)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <X size={10} color="rgba(255,255,255,0.3)" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newCmd}
              onChange={(e) => setNewCmd(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCmd()}
              placeholder={t("settings.conversation.addCmd")}
              className="flex-1 px-3 py-1.5 rounded-lg"
              style={{ fontSize: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontFamily: "monospace" }}
            />
            <button
              onClick={handleAddCmd}
              className="px-3 py-1.5 rounded-lg"
              style={{ fontSize: "12px", background: "rgba(96,239,255,0.1)", border: "1px solid rgba(96,239,255,0.15)", color: "#60efff" }}
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* 通知设置 */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-3">
          <Bell size={14} style={{ color: "#ffb86c" }} />
          <span style={{ fontSize: "13px", fontWeight: 600 }}>{t("settings.conversation.notification")}</span>
        </div>

        <div className="flex gap-2 mb-3">
          {(["banner", "sound", "menu"] as const).map((type) => {
            const labels = {
              banner: t("settings.conversation.banner"),
              sound: t("settings.conversation.sound"),
              menu: t("settings.conversation.menubar"),
            };
            const active = conversation.notificationTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleNotificationType(type)}
                className="flex-1 py-2 rounded-lg transition-colors"
                style={{
                  fontSize: "12px",
                  background: active ? "rgba(0,255,135,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${active ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.06)"}`,
                  color: active ? "#00ff87" : "rgba(255,255,255,0.4)",
                }}
              >
                {labels[type]}
              </button>
            );
          })}
        </div>

        <SliderRow
          label={t("settings.conversation.volume")}
          value={conversation.volume}
          min={0}
          max={100}
          step={5}
          unit="%"
          onChange={(v) => updateConversationSettings({ volume: v })}
        />
      </GlassCard>
    </div>
  );
};

export default ConversationSection;
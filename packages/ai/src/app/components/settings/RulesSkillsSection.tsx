/**
 * @file RulesSkillsSection.tsx
 * @description 设置页面 — 规则和技能管理（个人/项目规则、全局/项目技能）
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings, rules, skills
 */

import React, { useState } from "react";
import { ScrollText, Zap, Plus, FileCode } from "lucide-react";
import { useSettingsStore, type RuleConfig, type SkillConfig } from "../../stores/settingsStore";
import {
  SectionHeader, ItemCard, Badge, ActionButton, SettingsDialog, ToggleRow, EmptyState, GlassCard,
} from "./SettingsShared";
import { useI18nStore } from "../../stores/i18nStore";

const RulesSkillsSection: React.FC = () => {
  const { settings, addRule, updateRule, removeRule, addSkill, updateSkill, removeSkill, updateImportSettings } = useSettingsStore();
  const t = useI18nStore((s) => s.t);
  const { rules, skills, importSettings } = settings;

  const [activeTab, setActiveTab] = useState<"rules" | "skills">("rules");
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [showSkillDialog, setShowSkillDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<RuleConfig | null>(null);
  const [editingSkill, setEditingSkill] = useState<SkillConfig | null>(null);
  const [ruleDraft, setRuleDraft] = useState<Partial<RuleConfig>>({});
  const [skillDraft, setSkillDraft] = useState<Partial<SkillConfig>>({});

  const openCreateRule = () => {
    setEditingRule(null);
    setRuleDraft({ name: "", content: "", scope: "personal", enabled: true });
    setShowRuleDialog(true);
  };

  const openEditRule = (rule: RuleConfig) => {
    setEditingRule(rule);
    setRuleDraft({ ...rule });
    setShowRuleDialog(true);
  };

  const handleSaveRule = () => {
    if (editingRule) {
      updateRule(editingRule.id, ruleDraft);
    } else {
      addRule({
        id: `rule-${Date.now()}`,
        name: ruleDraft.name || "新规则",
        content: ruleDraft.content || "",
        scope: (ruleDraft.scope as "personal" | "project") || "personal",
        enabled: true,
      });
    }
    setShowRuleDialog(false);
  };

  const openCreateSkill = () => {
    setEditingSkill(null);
    setSkillDraft({ name: "", description: "", content: "", scope: "global", enabled: true });
    setShowSkillDialog(true);
  };

  const openEditSkill = (skill: SkillConfig) => {
    setEditingSkill(skill);
    setSkillDraft({ ...skill });
    setShowSkillDialog(true);
  };

  const handleSaveSkill = () => {
    if (editingSkill) {
      updateSkill(editingSkill.id, skillDraft);
    } else {
      addSkill({
        id: `skill-${Date.now()}`,
        name: skillDraft.name || "新技能",
        description: skillDraft.description || "",
        content: skillDraft.content || "",
        scope: (skillDraft.scope as "global" | "project") || "global",
        enabled: true,
      });
    }
    setShowSkillDialog(false);
  };

  const personalRules = rules.filter((r) => r.scope === "personal");
  const projectRules = rules.filter((r) => r.scope === "project");
  const globalSkills = skills.filter((s) => s.scope === "global");
  const projectSkills = skills.filter((s) => s.scope === "project");

  return (
    <div>
      <SectionHeader
        icon={<ScrollText size={18} style={{ color: "#ec4899" }} />}
        title={t("settings.rules.title")}
        description={t("settings.rules.desc")}
      />

      {/* Tab 切换 */}
      <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {([
          { id: "rules" as const, label: t("settings.rules.tabRules"), icon: <ScrollText size={13} />, count: rules.length },
          { id: "skills" as const, label: t("settings.rules.tabSkills"), icon: <Zap size={13} />, count: skills.length },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors"
            style={{
              fontSize: "13px",
              background: activeTab === tab.id ? "rgba(0,255,135,0.08)" : "transparent",
              color: activeTab === tab.id ? "#00ff87" : "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "pointer",
            }}
          >
            {tab.icon} {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* 规则面板 */}
      {activeTab === "rules" && (
        <div>
          <div className="flex justify-end mb-3">
            <ActionButton icon={<Plus size={13} />} label={t("settings.rules.addRule")} color="#ec4899" onClick={openCreateRule} variant="filled" />
          </div>

          {/* 项目规则 */}
          {projectRules.length > 0 && (
            <div className="mb-4">
              <p className="m-0 mb-2" style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>
                {t("settings.rules.project")} ({projectRules.length})
              </p>
              <div className="flex flex-col gap-2">
                {projectRules.map((rule) => (
                  <ItemCard
                    key={rule.id}
                    active={rule.enabled}
                    onEdit={() => openEditRule(rule)}
                    onDelete={() => removeRule(rule.id)}
                    onToggle={(v) => updateRule(rule.id, { enabled: v })}
                    enabled={rule.enabled}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ScrollText size={12} style={{ color: "#ec4899" }} />
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{rule.name}</span>
                      <Badge text={t("settings.rules.project")} color="#a855f7" bg="rgba(168,85,247,0.1)" />
                    </div>
                    <p className="m-0" style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.4)" }}>
                      {rule.content.length > 80 ? rule.content.slice(0, 80) + "..." : rule.content}
                    </p>
                  </ItemCard>
                ))}
              </div>
            </div>
          )}

          {/* 个人规则 */}
          {personalRules.length > 0 && (
            <div className="mb-4">
              <p className="m-0 mb-2" style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>
                {t("settings.rules.personal")} ({personalRules.length})
              </p>
              <div className="flex flex-col gap-2">
                {personalRules.map((rule) => (
                  <ItemCard
                    key={rule.id}
                    active={rule.enabled}
                    onEdit={() => openEditRule(rule)}
                    onDelete={() => removeRule(rule.id)}
                    onToggle={(v) => updateRule(rule.id, { enabled: v })}
                    enabled={rule.enabled}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ScrollText size={12} style={{ color: "#ffb86c" }} />
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{rule.name}</span>
                      <Badge text={t("settings.rules.personal")} color="#ffb86c" bg="rgba(255,184,108,0.1)" />
                    </div>
                    <p className="m-0" style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.4)" }}>
                      {rule.content.length > 80 ? rule.content.slice(0, 80) + "..." : rule.content}
                    </p>
                  </ItemCard>
                ))}
              </div>
            </div>
          )}

          {rules.length === 0 && (
            <EmptyState
              icon={<ScrollText size={20} color="rgba(255,255,255,0.2)" />}
              title={t("settings.rules.emptyRules")}
              description={t("settings.rules.emptyRulesDesc")}
              action={<ActionButton icon={<Plus size={13} />} label={t("settings.rules.addRule")} color="#ec4899" onClick={openCreateRule} />}
            />
          )}

          {/* 导入设置 */}
          <GlassCard className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileCode size={13} style={{ color: "#60efff" }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{t("settings.rules.importRules")}</span>
            </div>
            <ToggleRow
              label={t("settings.rules.includeAgentsMD")}
              description={t("settings.rules.includeAgentsMDDesc")}
              value={importSettings.includeAgentsMD}
              onChange={(v) => updateImportSettings({ includeAgentsMD: v })}
            />
            <ToggleRow
              label={t("settings.rules.includeClaudeMD")}
              description={t("settings.rules.includeClaudeMDDesc")}
              value={importSettings.includeClaudeMD}
              onChange={(v) => updateImportSettings({ includeClaudeMD: v })}
            />
          </GlassCard>
        </div>
      )}

      {/* 技能面板 */}
      {activeTab === "skills" && (
        <div>
          <div className="flex justify-end mb-3">
            <ActionButton icon={<Plus size={13} />} label={t("settings.rules.addSkill")} color="#00ff87" onClick={openCreateSkill} variant="filled" />
          </div>

          {/* 全局技能 */}
          {globalSkills.length > 0 && (
            <div className="mb-4">
              <p className="m-0 mb-2" style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>
                {t("settings.rules.global")} ({globalSkills.length})
              </p>
              <div className="flex flex-col gap-2">
                {globalSkills.map((skill) => (
                  <ItemCard
                    key={skill.id}
                    active={skill.enabled}
                    onEdit={() => openEditSkill(skill)}
                    onDelete={() => removeSkill(skill.id)}
                    onToggle={(v) => updateSkill(skill.id, { enabled: v })}
                    enabled={skill.enabled}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Zap size={12} style={{ color: "#00ff87" }} />
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{skill.name}</span>
                      <Badge text={t("settings.rules.global")} color="#00ff87" bg="rgba(0,255,135,0.1)" />
                    </div>
                    {skill.description && (
                      <p className="m-0" style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.4)" }}>{skill.description}</p>
                    )}
                  </ItemCard>
                ))}
              </div>
            </div>
          )}

          {/* 项目技能 */}
          {projectSkills.length > 0 && (
            <div className="mb-4">
              <p className="m-0 mb-2" style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>
                {t("settings.rules.project")} ({projectSkills.length})
              </p>
              <div className="flex flex-col gap-2">
                {projectSkills.map((skill) => (
                  <ItemCard
                    key={skill.id}
                    active={skill.enabled}
                    onEdit={() => openEditSkill(skill)}
                    onDelete={() => removeSkill(skill.id)}
                    onToggle={(v) => updateSkill(skill.id, { enabled: v })}
                    enabled={skill.enabled}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Zap size={12} style={{ color: "#a855f7" }} />
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{skill.name}</span>
                      <Badge text={t("settings.rules.project")} color="#a855f7" bg="rgba(168,85,247,0.1)" />
                    </div>
                    {skill.description && (
                      <p className="m-0" style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.4)" }}>{skill.description}</p>
                    )}
                  </ItemCard>
                ))}
              </div>
            </div>
          )}

          {skills.length === 0 && (
            <EmptyState
              icon={<Zap size={20} color="rgba(255,255,255,0.2)" />}
              title={t("settings.rules.emptySkills")}
              description={t("settings.rules.emptySkillsDesc")}
              action={<ActionButton icon={<Plus size={13} />} label={t("settings.rules.addSkill")} color="#00ff87" onClick={openCreateSkill} />}
            />
          )}
        </div>
      )}

      {/* 规则对话框 */}
      <SettingsDialog
        title={editingRule ? t("common.edit") : t("settings.rules.addRule")}
        open={showRuleDialog}
        onClose={() => setShowRuleDialog(false)}
        onConfirm={handleSaveRule}
        confirmLabel={editingRule ? t("common.save") : t("common.add")}
      >
        <div className="flex flex-col gap-3">
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>名称</label>
            <input
              value={ruleDraft.name || ""}
              onChange={(e) => setRuleDraft({ ...ruleDraft, name: e.target.value })}
              placeholder="规则名称"
              className="w-full px-3 py-2 rounded-lg"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>范围</label>
            <div className="flex gap-2">
              {(["personal", "project"] as const).map((scope) => (
                <button
                  key={scope}
                  onClick={() => setRuleDraft({ ...ruleDraft, scope })}
                  className="flex-1 py-2 rounded-lg"
                  style={{
                    fontSize: "12px",
                    background: ruleDraft.scope === scope ? "rgba(0,255,135,0.08)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${ruleDraft.scope === scope ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.06)"}`,
                    color: ruleDraft.scope === scope ? "#00ff87" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {scope === "personal" ? t("settings.rules.personal") : t("settings.rules.project")}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>内容</label>
            <textarea
              value={ruleDraft.content || ""}
              onChange={(e) => setRuleDraft({ ...ruleDraft, content: e.target.value })}
              placeholder="输入规则内容..."
              rows={5}
              className="w-full px-3 py-2 rounded-lg resize-none"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
          </div>
        </div>
      </SettingsDialog>

      {/* 技能对话框 */}
      <SettingsDialog
        title={editingSkill ? t("common.edit") : t("settings.rules.addSkill")}
        open={showSkillDialog}
        onClose={() => setShowSkillDialog(false)}
        onConfirm={handleSaveSkill}
        confirmLabel={editingSkill ? t("common.save") : t("common.add")}
      >
        <div className="flex flex-col gap-3">
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>名称</label>
            <input
              value={skillDraft.name || ""}
              onChange={(e) => setSkillDraft({ ...skillDraft, name: e.target.value })}
              placeholder="技能名称"
              className="w-full px-3 py-2 rounded-lg"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>描述</label>
            <input
              value={skillDraft.description || ""}
              onChange={(e) => setSkillDraft({ ...skillDraft, description: e.target.value })}
              placeholder="技能描述"
              className="w-full px-3 py-2 rounded-lg"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>范围</label>
            <div className="flex gap-2">
              {(["global", "project"] as const).map((scope) => (
                <button
                  key={scope}
                  onClick={() => setSkillDraft({ ...skillDraft, scope })}
                  className="flex-1 py-2 rounded-lg"
                  style={{
                    fontSize: "12px",
                    background: skillDraft.scope === scope ? "rgba(0,255,135,0.08)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${skillDraft.scope === scope ? "rgba(0,255,135,0.15)" : "rgba(255,255,255,0.06)"}`,
                    color: skillDraft.scope === scope ? "#00ff87" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {scope === "global" ? t("settings.rules.global") : t("settings.rules.project")}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>内容</label>
            <textarea
              value={skillDraft.content || ""}
              onChange={(e) => setSkillDraft({ ...skillDraft, content: e.target.value })}
              placeholder="输入技能内容..."
              rows={5}
              className="w-full px-3 py-2 rounded-lg resize-none"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
          </div>
        </div>
      </SettingsDialog>
    </div>
  );
};

export default RulesSkillsSection;
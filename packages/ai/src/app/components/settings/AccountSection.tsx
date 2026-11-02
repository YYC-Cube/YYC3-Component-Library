/**
 * @file AccountSection.tsx
 * @description 设置页面 — 账号信息管理区块（头像、用户名、邮箱、简介）
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags settings, account, profile
 */

import React, { useState } from "react";
import { User, Camera, Mail, FileText } from "lucide-react";
import { useSettingsStore } from "../../stores/settingsStore";
import { useI18nStore } from "../../stores/i18nStore";
import { GlassCard, SectionHeader, InputRow } from "./SettingsShared";

const AccountSection: React.FC = () => {
  const { settings, updateUserProfile } = useSettingsStore();
  const t = useI18nStore((s) => s.t);
  const { userProfile } = settings;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(userProfile);

  const handleSave = () => {
    updateUserProfile(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(userProfile);
    setEditing(false);
  };

  return (
    <div>
      <SectionHeader
        icon={<User size={18} style={{ color: "#60efff" }} />}
        title={t("settings.account.title")}
        description={t("settings.account.desc")}
        action={
          !editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
              style={{ fontSize: "12px", color: "#60efff", background: "rgba(96,239,255,0.06)", border: "1px solid rgba(96,239,255,0.12)" }}
            >
              {t("settings.account.editProfile")}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-lg"
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 rounded-lg"
                style={{ fontSize: "12px", color: "#0a0a12", background: "#00ff87", border: "none", fontWeight: 600 }}
              >
                {t("common.save")}
              </button>
            </div>
          )
        }
      />

      {/* 头像 + 基本信息 */}
      <GlassCard className="mb-4">
        <div className="flex items-center gap-5">
          {/* 头像 */}
          <div className="relative group">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0,255,135,0.15), rgba(96,239,255,0.15))",
                border: "2px solid rgba(0,255,135,0.2)",
              }}
            >
              {userProfile.avatar ? (
                <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span style={{ fontSize: "28px", fontWeight: 700, color: "#00ff87" }}>
                  {userProfile.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {editing && (
              <div
                className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                style={{ background: "rgba(0,0,0,0.5)" }}
              >
                <Camera size={18} color="#fff" />
              </div>
            )}
          </div>

          {/* 信息 */}
          <div className="flex-1">
            {editing ? (
              <div className="flex flex-col gap-2">
                <input
                  value={draft.username}
                  onChange={(e) => setDraft({ ...draft, username: e.target.value })}
                  placeholder="用户名"
                  className="px-3 py-1.5 rounded-lg w-full"
                  style={{
                    fontSize: "14px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    outline: "none",
                    fontWeight: 600,
                  }}
                />
                <input
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  placeholder="邮箱地址"
                  className="px-3 py-1.5 rounded-lg w-full"
                  style={{
                    fontSize: "12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.6)",
                    outline: "none",
                  }}
                />
              </div>
            ) : (
              <>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                  {userProfile.username}
                </div>
                <div className="flex items-center gap-1.5 mt-1" style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                  <Mail size={11} />
                  {userProfile.email}
                </div>
                <div
                  className="flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded inline-flex"
                  style={{ fontSize: "10px", background: "rgba(0,255,135,0.08)", color: "#00ff87" }}
                >
                  ID: {userProfile.id.slice(0, 8)}...
                </div>
              </>
            )}
          </div>
        </div>
      </GlassCard>

      {/* 简介 */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-3">
          <FileText size={14} style={{ color: "#a855f7" }} />
          <span style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>{t("settings.account.bio")}</span>
        </div>
        {editing ? (
          <textarea
            value={draft.bio || ""}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            placeholder="写点什么介绍自己..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg resize-none"
            style={{
              fontSize: "13px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
              outline: "none",
            }}
          />
        ) : (
          <p className="m-0" style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
            {userProfile.bio || t("settings.account.bioEmpty")}
          </p>
        )}
      </GlassCard>
    </div>
  );
};

export default AccountSection;
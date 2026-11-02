/**
 * @file StatusBar.tsx
 * @description 全局底部状态栏 — Git 分支、编码格式、行列号、AI 状态、主题标识、协同用户、通知
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags statusbar, git, encoding, cursor, ai-status, theme, collaboration
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  GitBranch, Bot, Palette, Bell, Users, Wifi, WifiOff,
  Circle, TriangleAlert, Check, LoaderCircle, ChevronUp,
  Globe, CloudOff, Save, AppWindow,
} from "lucide-react";
import { useThemeStore, themeVariants } from "../stores/themeStore";
import { useCollaborationStore } from "../stores/collaborationStore";
import { useNotificationStore } from "../stores/notificationStore";
import { useWorkspaceContextStore } from "../stores/workspaceContextStore";
import { useI18nStore, supportedLocales } from "../stores/i18nStore";
import { useSessionStore } from "../stores/sessionStore";

/* ─── Git 模拟数据 ─── */
const mockGit = {
  branch: "main",
  ahead: 2,
  behind: 0,
  changes: 8,
};

/* ─── AI 状态模拟 ─── */
type AIStatus = "idle" | "thinking" | "streaming" | "error";

const StatusBar: React.FC = () => {
  const [aiStatus, setAiStatus] = useState<AIStatus>("idle");
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const theme = useThemeStore();
  const collab = useCollaborationStore();
  const notifications = useNotificationStore();
  const workspace = useWorkspaceContextStore();
  const { locale, setLocale, t } = useI18nStore();
  const session = useSessionStore();
  const navigate = useNavigate();

  const activeFile = workspace.getActiveFile();
  const unreadCount = notifications.getUnreadCount();
  const onlineCount = collab.getOnlineCount();

  /* 模拟 AI 状态变化 */
  useEffect(() => {
    const timer = setInterval(() => {
      const statuses: AIStatus[] = ["idle", "idle", "idle", "thinking", "idle"];
      setAiStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  /* 离线检测 */
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const aiStatusConfig: Record<AIStatus, { color: string; icon: React.ReactNode; label: string }> = {
    idle: { color: "#00ff87", icon: <Check size={10} />, label: "就绪" },
    thinking: { color: "#60efff", icon: <LoaderCircle size={10} className="animate-spin" />, label: "思考中" },
    streaming: { color: "#a855f7", icon: <LoaderCircle size={10} className="animate-spin" />, label: "生成中" },
    error: { color: "#ff6b6b", icon: <TriangleAlert size={10} />, label: "异常" },
  };

  const currentAI = aiStatusConfig[aiStatus];
  const themeInfo = themeVariants[theme.config.variant];

  return (
    <div
      className="flex items-center justify-between px-2 h-[24px] min-h-[24px] flex-shrink-0 select-none"
      style={{
        background: "rgba(10,10,22,0.98)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        fontSize: "11px",
        color: "rgba(255,255,255,0.5)",
      }}
    >
      {/* ─── 左侧 ─── */}
      <div className="flex items-center gap-0.5">
        {/* Git 分支 */}
        <StatusItem tooltip="Git 分支">
          <GitBranch size={11} style={{ color: "#a855f7" }} />
          <span style={{ color: "#a855f7" }}>{mockGit.branch}</span>
          {mockGit.changes > 0 && (
            <span
              className="px-1 rounded-sm"
              style={{ fontSize: "9px", background: "rgba(255,184,108,0.12)", color: "#ffb86c" }}
            >
              {mockGit.changes}
            </span>
          )}
          {mockGit.ahead > 0 && (
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>↑{mockGit.ahead}</span>
          )}
        </StatusItem>

        <Separator />

        {/* 协同用户 */}
        <StatusItem
          tooltip="协同用户"
          onClick={() => setShowCollaborators(!showCollaborators)}
          interactive
        >
          {collab.connectionStatus === "connected" ? (
            <Wifi size={10} style={{ color: "#00ff87" }} />
          ) : (
            <WifiOff size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
          )}
          <Users size={10} />
          <span>{collab.isCollaborating ? onlineCount : 1}</span>
        </StatusItem>

        {/* 协同用户弹出 */}
        <AnimatePresence>
          {showCollaborators && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-7 left-2 z-50 rounded-xl p-3 w-[220px]"
              style={{
                background: "rgba(14,14,28,0.97)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 -8px 30px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>在线用户</span>
                {!collab.isCollaborating ? (
                  <button
                    onClick={() => collab.connect()}
                    className="px-2 py-0.5 rounded"
                    style={{ fontSize: "9px", background: "rgba(0,255,135,0.1)", color: "#00ff87", border: "1px solid rgba(0,255,135,0.15)" }}
                  >
                    连接
                  </button>
                ) : (
                  <button
                    onClick={() => collab.disconnect()}
                    className="px-2 py-0.5 rounded"
                    style={{ fontSize: "9px", background: "rgba(255,107,107,0.08)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.12)" }}
                  >
                    断开
                  </button>
                )}
              </div>
              {/* 本地用户 */}
              <UserItem user={collab.localUser} isLocal />
              {/* 远程用户 */}
              {collab.remoteUsers.map((u) => (
                <UserItem key={u.userId} user={u} />
              ))}
              {!collab.isCollaborating && (
                <div className="text-center py-2 opacity-25" style={{ fontSize: "10px" }}>
                  点击「连接」开始协同编辑
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Separator />

        {/* AI 状态 */}
        <StatusItem tooltip={`AI: ${currentAI.label}`}>
          <Bot size={10} style={{ color: currentAI.color }} />
          <span style={{ color: currentAI.color }}>{currentAI.label}</span>
          {currentAI.icon}
        </StatusItem>
      </div>

      {/* ─── 右侧 ─── */}
      <div className="flex items-center gap-0.5">
        {/* 行列号 */}
        {activeFile && (
          <StatusItem tooltip="光标位置">
            <span>行 {activeFile.cursor.line}, 列 {activeFile.cursor.column}</span>
          </StatusItem>
        )}

        <Separator />

        {/* 编码格式 */}
        {activeFile && (
          <StatusItem tooltip="文件编码">
            <span>{activeFile.encoding}</span>
          </StatusItem>
        )}

        <Separator />

        {/* 行结束符 */}
        {activeFile && (
          <StatusItem tooltip="行结束符">
            <span>{activeFile.lineEnding}</span>
          </StatusItem>
        )}

        <Separator />

        {/* 缩进 */}
        {activeFile && (
          <StatusItem tooltip="缩进">
            <span>{activeFile.indentMode === "spaces" ? "空格" : "Tab"}: {activeFile.indentSize}</span>
          </StatusItem>
        )}

        <Separator />

        {/* 语言 */}
        {activeFile && (
          <StatusItem tooltip="文件语言">
            <span style={{ color: "rgba(255,255,255,0.6)" }}>{formatLanguage(activeFile.language)}</span>
          </StatusItem>
        )}

        <Separator />

        {/* 主题 */}
        <StatusItem tooltip={`主题: ${themeInfo.name}`}>
          <Palette size={10} style={{ color: themeInfo.colors.accent }} />
          <span style={{ color: themeInfo.colors.accent }}>{themeInfo.name.split(" ")[0]}</span>
        </StatusItem>

        <Separator />

        {/* 会话保存指示 */}
        {session.lastSavedAt && (
          <>
            <StatusItem tooltip={`${t("session.autoSave")} · ${t("session.lastSaved")}: ${new Date(session.lastSavedAt).toLocaleTimeString()}`}>
              <Save size={10} style={{ color: "rgba(0,255,135,0.5)" }} />
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px" }}>
                {new Date(session.lastSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </StatusItem>
            <Separator />
          </>
        )}

        {/* 离线状态指示 */}
        {!isOnline && (
          <>
            <StatusItem tooltip={t("status.offlineDesc")}>
              <CloudOff size={10} style={{ color: "#ffb86c" }} />
              <span style={{ color: "#ffb86c" }}>{t("status.offline")}</span>
            </StatusItem>
            <Separator />
          </>
        )}

        {/* i18n 语言标识 */}
        <StatusItem
          tooltip={locale === "zh-CN" ? "切换语言" : "Switch Language"}
          onClick={() => setLocale(locale === "zh-CN" ? "en-US" : "zh-CN")}
          interactive
        >
          <Globe size={10} style={{ color: "#60efff" }} />
          <span style={{ color: "#60efff" }}>
            {supportedLocales.find((l) => l.id === locale)?.flag}{" "}
            {locale === "zh-CN" ? "中" : "EN"}
          </span>
        </StatusItem>

        <Separator />

        {/* 多实例管理 */}
        <StatusItem
          tooltip="多窗口管理"
          onClick={() => navigate("/multi-instance")}
          interactive
        >
          <AppWindow size={10} style={{ color: "#a855f7" }} />
          <span style={{ color: "#a855f7" }}>多窗口</span>
        </StatusItem>

        <Separator />

        {/* 通知 */}
        <StatusItem
          tooltip={`${unreadCount} 条未读通知`}
          onClick={() => notifications.toggleNotificationCenter()}
          interactive
        >
          <Bell size={10} />
          {unreadCount > 0 && (
            <span
              className="flex items-center justify-center w-3.5 h-3.5 rounded-full"
              style={{ fontSize: "8px", fontWeight: 700, background: "#ff6b6b", color: "#fff" }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </StatusItem>
      </div>
    </div>
  );
};

/* ─── 子组件 ─── */

interface StatusItemProps {
  children: React.ReactNode;
  tooltip?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const StatusItem: React.FC<StatusItemProps> = ({ children, tooltip, onClick, interactive }) => (
  <div
    className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${interactive ? "cursor-pointer" : ""}`}
    style={{ color: "rgba(255,255,255,0.5)" }}
    title={tooltip}
    onClick={onClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      e.currentTarget.style.color = "rgba(255,255,255,0.7)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "rgba(255,255,255,0.5)";
    }}
  >
    {children}
  </div>
);

const Separator: React.FC = () => (
  <div className="w-px h-3 mx-0.5" style={{ background: "rgba(255,255,255,0.06)" }} />
);

interface UserItemProps {
  user: {
    userId: string;
    displayName: string;
    color: string;
    colorBg: string;
    status: "active" | "idle" | "away";
    activeFile?: string | null;
  };
  isLocal?: boolean;
}

const UserItem: React.FC<UserItemProps> = ({ user, isLocal }) => {
  const statusColors: Record<string, string> = {
    active: "#00ff87",
    idle: "#ffb86c",
    away: "rgba(255,255,255,0.2)",
  };
  return (
    <div className="flex items-center gap-2 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
      {/* 头像 */}
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 relative"
        style={{ background: user.colorBg, border: `1px solid ${user.color}30` }}
      >
        <span style={{ fontSize: "9px", color: user.color, fontWeight: 700 }}>
          {user.displayName.charAt(0).toUpperCase()}
        </span>
        <div
          className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
          style={{ background: statusColors[user.status], border: "1.5px solid #0e0e1c" }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.7)" }}>
            {user.displayName}
          </span>
          {isLocal && (
            <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.2)" }}>(我)</span>
          )}
        </div>
        {user.activeFile && (
          <span className="block truncate" style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>
            {user.activeFile.split("/").pop()}
          </span>
        )}
      </div>
    </div>
  );
};

/* ─── 辅助 ─── */
function formatLanguage(lang: string): string {
  const map: Record<string, string> = {
    typescriptreact: "TSX",
    typescript: "TypeScript",
    javascript: "JavaScript",
    javascriptreact: "JSX",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    markdown: "Markdown",
    plaintext: "纯文本",
    rust: "Rust",
    python: "Python",
  };
  return map[lang] || lang;
}

export { StatusBar };
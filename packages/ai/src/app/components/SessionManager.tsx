/**
 * @file SessionManager.tsx
 * @description 工作区会话管理器 — 自动保存/恢复面板布局+Tab状态+光标位置，恢复横幅提示
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags session, restore, auto-save, banner, persistence
 */

import React, { useEffect, useRef, useCallback } from "react";
import {
  RotateCcw, X, Clock, Check, Save,
} from "lucide-react";
import { useSessionStore } from "../stores/sessionStore";
import { useLayoutStore } from "../stores/layoutStore";
import { useNotificationStore } from "../stores/notificationStore";

/* ─── 自动保存引擎 (无 UI) ─── */
export const SessionAutoSaver: React.FC = () => {
  const {
    autoSaveEnabled, autoSaveInterval, saveSession,
  } = useSessionStore();
  const {
    activePanelId, panels, tabs, layoutTree, sidebarCollapsed,
  } = useLayoutStore();

  const saveRef = useRef(saveSession);
  saveRef.current = saveSession;

  useEffect(() => {
    if (!autoSaveEnabled) return;

    const doSave = () => {
      const openFiles = Object.values(tabs)
        .filter((t) => t.meta?.filePath)
        .map((t) => t.meta!.filePath as string);

      const activeTab = activePanelId
        ? Object.values(tabs).find((t) => t.panelId === activePanelId && t.meta?.filePath)
        : null;

      saveRef.current({
        activePanelId,
        sidebarCollapsed,
        openFiles,
        activeFile: (activeTab?.meta?.filePath as string) || null,
        lastRoute: window.location.pathname + window.location.search,
        windowSize: { width: window.innerWidth, height: window.innerHeight },
      });
    };

    // 初始保存
    const timer = setTimeout(doSave, 2000);
    // 定期保存
    const interval = setInterval(doSave, autoSaveInterval);
    // 页面卸载前保存
    const unloadHandler = () => doSave();
    window.addEventListener("beforeunload", unloadHandler);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener("beforeunload", unloadHandler);
    };
  }, [autoSaveEnabled, autoSaveInterval, activePanelId, panels, tabs, layoutTree, sidebarCollapsed]);

  return null;
};

/* ─── 会话恢复横幅 ─── */
export const SessionRestoreBanner: React.FC = () => {
  const { showRestoreBanner, dismissRestoreBanner, currentSession, lastSavedAt } = useSessionStore();
  const notifications = useNotificationStore();

  const handleDismiss = useCallback(() => {
    dismissRestoreBanner();
  }, [dismissRestoreBanner]);

  if (!showRestoreBanner || !currentSession) return null;

  const timeAgo = lastSavedAt ? formatTimeAgo(lastSavedAt) : "未知";
  const fileCount = currentSession.openFiles?.length || 0;

  return (
    <div
      className="flex items-center gap-3 px-4 py-2 mx-3 mt-2 rounded-lg"
      style={{
        background: "rgba(0,255,135,0.04)",
        border: "1px solid rgba(0,255,135,0.1)",
        animation: "sessionBannerIn 0.3s ease-out",
      }}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(0,255,135,0.08)", color: "#00ff87" }}
      >
        <RotateCcw size={13} />
      </div>
      <div className="flex-1 min-w-0">
        <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
          工作区会话已恢复
        </span>
        <div className="flex items-center gap-2 mt-0.5" style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
          <span className="flex items-center gap-0.5">
            <Clock size={8} />
            {timeAgo}保存
          </span>
          {fileCount > 0 && (
            <span className="flex items-center gap-0.5">
              <Save size={8} />
              {fileCount} 个打开文件
            </span>
          )}
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
        style={{
          fontSize: "11px",
          color: "#00ff87",
          background: "rgba(0,255,135,0.06)",
          border: "1px solid rgba(0,255,135,0.12)",
        }}
      >
        <Check size={10} />
        知道了
      </button>
      <button
        onClick={handleDismiss}
        className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/5"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        <X size={11} />
      </button>

      <style>{`
        @keyframes sessionBannerIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* ─── 会话恢复初始化钩子 ─── */
export function useSessionRestore() {
  const session = useSessionStore();

  useEffect(() => {
    if (!session.sessionRestored && session.currentSession) {
      session.restoreSession();
    }
  }, []);
}

/* ─── 辅助函数 ─── */
function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "刚刚";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`;
  return `${Math.floor(diff / 86_400_000)} 天前`;
}

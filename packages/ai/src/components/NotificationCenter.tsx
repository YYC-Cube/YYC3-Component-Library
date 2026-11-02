/**
 * @file NotificationCenter.tsx
 * @description 通知中心 — 滑出抽屉式通知列表，支持分类过滤/标记已读/清除/展开详情
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags notification, center, drawer, filter, glassmorphism
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Bell, BellOff, X, Check, CheckCheck, Trash2,
  Info, CircleCheck, TriangleAlert, CircleX, Bot,
  Settings, Users, ChevronDown, ChevronRight, Clock,
  Volume2, VolumeX,
} from "lucide-react";
import {
  useNotificationStore,
  type Notification,
  type NotificationType,
} from "../stores/notificationStore";

/* ─── 通知类型配置 ─── */
const typeConfig: Record<
  NotificationType,
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  info: { label: "信息", icon: Info, color: "#60efff", bgColor: "rgba(96,239,255,0.08)" },
  success: { label: "成功", icon: CircleCheck, color: "#00ff87", bgColor: "rgba(0,255,135,0.08)" },
  warning: { label: "警告", icon: TriangleAlert, color: "#ffb86c", bgColor: "rgba(255,184,108,0.08)" },
  error: { label: "错误", icon: CircleX, color: "#ff6b6b", bgColor: "rgba(255,107,107,0.08)" },
  ai: { label: "AI", icon: Bot, color: "#bd93f9", bgColor: "rgba(189,147,249,0.08)" },
  system: { label: "系统", icon: Settings, color: "#8be9fd", bgColor: "rgba(139,233,253,0.08)" },
  collaboration: { label: "协同", icon: Users, color: "#ff79c6", bgColor: "rgba(255,121,198,0.08)" },
};

/* ─── 相对时间 ─── */
function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "刚刚";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)} 天前`;
  return new Date(ts).toLocaleDateString("zh-CN");
}

/* ─── 优先级标签 ─── */
const priorityBadge: Record<string, { label: string; color: string }> = {
  urgent: { label: "紧急", color: "#ff6b6b" },
  high: { label: "高", color: "#ffb86c" },
  normal: { label: "", color: "" },
  low: { label: "", color: "" },
};

/* ─── 单条通知项 ─── */
const NotificationItem: React.FC<{
  notification: Notification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onRemove: (id: string) => void;
}> = ({ notification, onRead, onDismiss, onRemove }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = typeConfig[notification.type];
  const Icon = cfg.icon;
  const pBadge = priorityBadge[notification.priority];

  return (
    <div
      className="group relative px-3 py-2.5 mx-2 mb-1.5 rounded-lg transition-all duration-150 cursor-pointer"
      style={{
        background: notification.isRead ? "rgba(255,255,255,0.015)" : cfg.bgColor,
        border: `1px solid ${notification.isRead ? "rgba(255,255,255,0.04)" : `${cfg.color}15`}`,
        opacity: notification.isRead ? 0.7 : 1,
      }}
      onClick={() => {
        if (!notification.isRead) onRead(notification.id);
        if (notification.detail) setExpanded((v) => !v);
      }}
    >
      {/* 未读指示点 */}
      {!notification.isRead && (
        <div
          className="absolute top-3 left-1.5 w-1.5 h-1.5 rounded-full"
          style={{ background: cfg.color }}
        />
      )}

      <div className="flex items-start gap-2">
        {/* 图标 */}
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${cfg.color}10`, color: cfg.color }}
        >
          <Icon size={12} />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="truncate"
              style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.85)" }}
            >
              {notification.title}
            </span>
            {pBadge.label && (
              <span
                className="px-1 py-0 rounded-sm flex-shrink-0"
                style={{ fontSize: "9px", fontWeight: 600, color: pBadge.color, background: `${pBadge.color}15`, border: `1px solid ${pBadge.color}30` }}
              >
                {pBadge.label}
              </span>
            )}
          </div>
          <p
            className="mt-0.5 leading-relaxed"
            style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}
          >
            {notification.message}
          </p>

          {/* 展开详情 */}
          {notification.detail && expanded && (
            <div
              className="mt-2 px-2 py-1.5 rounded-md"
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.04)",
                lineHeight: "1.6",
              }}
            >
              {notification.detail}
            </div>
          )}

          {/* 底部元信息 */}
          <div className="flex items-center gap-2 mt-1.5">
            {notification.source && (
              <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>
                {notification.source}
              </span>
            )}
            <span className="flex items-center gap-0.5" style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>
              <Clock size={8} />
              {relativeTime(notification.createdAt)}
            </span>
            {notification.detail && (
              <span style={{ fontSize: "9px", color: cfg.color, opacity: 0.5 }}>
                {expanded ? <ChevronDown size={9} /> : <ChevronRight size={9} />}
              </span>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {!notification.isRead && (
            <button
              onClick={(e) => { e.stopPropagation(); onRead(notification.id); }}
              className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/5 transition-colors"
              title="标记已读"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <Check size={10} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(notification.id); }}
            className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/5 transition-colors"
            title="删除"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            <X size={10} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── 通知中心主组件 ─── */
export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    preferences,
    isNotificationCenterOpen,
    closeNotificationCenter,
    markAsRead,
    markAllAsRead,
    removeNotification,
    dismissNotification,
    clearAll,
    getUnreadCount,
    updatePreferences,
  } = useNotificationStore();

  const [activeFilter, setActiveFilter] = useState<"all" | NotificationType>("all");
  const panelRef = useRef<HTMLDivElement>(null);
  const unreadCount = getUnreadCount();

  /* 点击外部关闭 */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closeNotificationCenter();
      }
    };
    if (isNotificationCenterOpen) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [isNotificationCenterOpen, closeNotificationCenter]);

  /* Escape 关闭 */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isNotificationCenterOpen) {
        closeNotificationCenter();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isNotificationCenterOpen, closeNotificationCenter]);

  /* 过滤通知 */
  const filteredNotifications = useMemo(() => {
    const undismissed = notifications.filter((n) => !n.isDismissed);
    if (activeFilter === "all") return undismissed;
    return undismissed.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  /* 过滤选项卡 */
  const filterTabs: { key: "all" | NotificationType; label: string; count: number }[] = useMemo(() => {
    const undismissed = notifications.filter((n) => !n.isDismissed);
    const tabs: { key: "all" | NotificationType; label: string; count: number }[] = [
      { key: "all", label: "全部", count: undismissed.length },
    ];
    const types: NotificationType[] = ["info", "success", "warning", "error", "ai", "system", "collaboration"];
    types.forEach((t) => {
      const count = undismissed.filter((n) => n.type === t).length;
      if (count > 0) {
        tabs.push({ key: t, label: typeConfig[t].label, count });
      }
    });
    return tabs;
  }, [notifications]);

  if (!isNotificationCenterOpen) return null;

  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 z-[90]"
        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}
      />

      {/* 抽屉面板 */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 bottom-0 z-[91] flex flex-col"
        style={{
          width: "380px",
          maxWidth: "90vw",
          background: "rgba(14,14,28,0.97)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)",
          animation: "slideInRight 0.2s ease-out",
        }}
      >
        {/* 标题栏 */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <Bell size={14} style={{ color: "#00ff87" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
              通知中心
            </span>
            {unreadCount > 0 && (
              <span
                className="px-1.5 py-0 rounded-full"
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#00ff87",
                  background: "rgba(0,255,135,0.1)",
                  border: "1px solid rgba(0,255,135,0.2)",
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* 全部已读 */}
            <button
              onClick={markAllAsRead}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/5 transition-colors"
              title="全部已读"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <CheckCheck size={13} />
            </button>
            {/* 清除全部 */}
            <button
              onClick={clearAll}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/5 transition-colors"
              title="清除全部"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <Trash2 size={13} />
            </button>
            {/* Toast 开关 */}
            <button
              onClick={() => updatePreferences({ showToast: !preferences.showToast })}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/5 transition-colors"
              title={preferences.showToast ? "关闭 Toast" : "开启 Toast"}
              style={{ color: preferences.showToast ? "rgba(0,255,135,0.5)" : "rgba(255,255,255,0.15)" }}
            >
              {preferences.showToast ? <Volume2 size={13} /> : <VolumeX size={13} />}
            </button>
            {/* 关闭 */}
            <button
              onClick={closeNotificationCenter}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/5 transition-colors"
              title="关闭"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* 过滤标签栏 */}
        <div
          className="flex items-center gap-1 px-3 py-2 flex-shrink-0 overflow-x-auto"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            scrollbarWidth: "none",
          }}
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            const cfg = tab.key === "all" ? null : typeConfig[tab.key as NotificationType];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className="flex items-center gap-1 px-2 py-1 rounded-md transition-all whitespace-nowrap flex-shrink-0"
                style={{
                  fontSize: "11px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? (cfg?.color || "#00ff87")
                    : "rgba(255,255,255,0.35)",
                  background: isActive
                    ? `${cfg?.color || "#00ff87"}10`
                    : "transparent",
                  border: isActive
                    ? `1px solid ${cfg?.color || "#00ff87"}25`
                    : "1px solid transparent",
                }}
              >
                {tab.label}
                <span
                  className="px-1 rounded-sm"
                  style={{
                    fontSize: "9px",
                    color: isActive ? (cfg?.color || "#00ff87") : "rgba(255,255,255,0.2)",
                    background: isActive ? `${cfg?.color || "#00ff87"}10` : "rgba(255,255,255,0.03)",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 通知列表 */}
        <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.05) transparent" }}>
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30">
              <BellOff size={28} />
              <span style={{ fontSize: "12px" }}>暂无通知</span>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onRead={markAsRead}
                onDismiss={dismissNotification}
                onRemove={removeNotification}
              />
            ))
          )}
        </div>

        {/* 底部统计 */}
        <div
          className="flex items-center justify-between px-4 py-2 flex-shrink-0"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            fontSize: "10px",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          <span>{filteredNotifications.length} 条通知</span>
          <span>
            {unreadCount > 0 ? `${unreadCount} 条未读` : "全部已读"}
          </span>
        </div>
      </div>

      {/* 动画关键帧 */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};
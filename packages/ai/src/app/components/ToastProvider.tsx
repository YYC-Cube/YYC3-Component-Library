/**
 * @file ToastProvider.tsx
 * @description Sonner Toast 全局通知桥接 — 将 notificationStore 事件映射到 sonner Toast 视觉反馈
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags toast, sonner, notification, bridge, feedback
 */

import React, { useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import { useNotificationStore, type NotificationType } from "../stores/notificationStore";

/* ─── Toast 图标映射 ─── */
const typeEmoji: Record<NotificationType, string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "❌",
  ai: "🤖",
  system: "⚙️",
  collaboration: "👥",
};

/* ─── Toast 桥接组件 ─── */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const prevCountRef = useRef(0);
  const notifications = useNotificationStore((s) => s.notifications);
  const preferences = useNotificationStore((s) => s.preferences);

  /* 监听新通知 → 触发 sonner Toast */
  useEffect(() => {
    if (!preferences.showToast || !preferences.enabled) return;

    const currentCount = notifications.length;
    if (currentCount > prevCountRef.current && prevCountRef.current > 0) {
      const newest = notifications[0];
      if (newest && !newest.isDismissed) {
        triggerToast(newest.type, newest.title, newest.message, newest.autoCloseDelay);
      }
    }
    prevCountRef.current = currentCount;
  }, [notifications, preferences.showToast, preferences.enabled]);

  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        theme="dark"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "rgba(18,18,32,0.97)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)",
            fontSize: "12px",
            borderRadius: "12px",
          },
          className: "yyc3-toast",
        }}
        offset="60px"
        gap={8}
        visibleToasts={4}
        expand={false}
        duration={4000}
      />
    </>
  );
};

/* ─── 触发 Toast 辅助函数 ─── */
function triggerToast(
  type: NotificationType,
  title: string,
  message: string,
  autoClose?: number,
) {
  const duration = autoClose && autoClose > 0 ? autoClose : 4000;

  switch (type) {
    case "success":
      toast.success(title, { description: message, duration });
      break;
    case "error":
      toast.error(title, { description: message, duration: autoClose === 0 ? Infinity : duration });
      break;
    case "warning":
      toast.warning(title, { description: message, duration });
      break;
    case "info":
      toast.info(title, { description: message, duration });
      break;
    default:
      toast(title, {
        description: message,
        duration,
        icon: typeEmoji[type] || "📌",
      });
      break;
  }
}

/* ─── 全局 Toast 工具函数（可在组件外调用）─── */
export const yyc3Toast = {
  success: (title: string, message?: string) =>
    toast.success(title, { description: message }),
  error: (title: string, message?: string) =>
    toast.error(title, { description: message }),
  warning: (title: string, message?: string) =>
    toast.warning(title, { description: message }),
  info: (title: string, message?: string) =>
    toast.info(title, { description: message }),
  ai: (title: string, message?: string) =>
    toast(title, { description: message, icon: "🤖" }),
  loading: (title: string, message?: string) =>
    toast.loading(title, { description: message }),
  dismiss: (id?: string | number) => toast.dismiss(id),
  promise: <T,>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string },
  ) => toast.promise(promise, msgs),
};

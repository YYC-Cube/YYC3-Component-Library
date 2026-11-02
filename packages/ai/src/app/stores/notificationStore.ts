/**
 * @file notificationStore.ts
 * @description 全局通知中心 — 通知消息队列、分级管理、已读/未读、Toast 集成
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, notification, toast, message-queue, alert
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */
export type NotificationType = "info" | "success" | "warning" | "error" | "ai" | "system" | "collaboration";
export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  /** 详细描述 (可选) */
  detail?: string;
  /** 操作按钮 */
  actions?: NotificationAction[];
  /** 图标名称 (Lucide) */
  icon?: string;
  /** 来源模块 */
  source?: string;
  /** 是否已读 */
  isRead: boolean;
  /** 是否已关闭 */
  isDismissed: boolean;
  /** 是否持久 (不自动消失) */
  persistent: boolean;
  /** 自动关闭延迟 (ms, 0 = 不自动关闭) */
  autoCloseDelay: number;
  /** 创建时间 */
  createdAt: number;
  /** 已读时间 */
  readAt?: number;
  /** 关联文件 */
  relatedFile?: string;
  /** 关联面板 */
  relatedPanel?: string;
}

export interface NotificationAction {
  label: string;
  variant: "primary" | "secondary" | "danger";
  onClick: () => void;
}

export interface NotificationPreferences {
  /** 是否启用通知 */
  enabled: boolean;
  /** 是否显示 Toast */
  showToast: boolean;
  /** 是否播放提示音 */
  playSound: boolean;
  /** 最大保留通知数 */
  maxNotifications: number;
  /** 默认自动关闭延迟 */
  defaultAutoClose: number;
  /** 各类通知是否启用 */
  typeFilters: Record<NotificationType, boolean>;
}

/* ─── 模拟初始通知 ─── */
const initialNotifications: Notification[] = [
  {
    id: "n-1",
    type: "system",
    priority: "normal",
    title: "欢迎使用 YYC³ AI Code",
    message: "系统已就绪，所有模块初始化完成。",
    icon: "Sparkles",
    source: "系统",
    isRead: false,
    isDismissed: false,
    persistent: false,
    autoCloseDelay: 0,
    createdAt: Date.now() - 60000,
  },
  {
    id: "n-2",
    type: "ai",
    priority: "normal",
    title: "AI 服务就绪",
    message: "OpenAI GPT-4 Turbo 和 Anthropic Claude 3 已连接。",
    icon: "Bot",
    source: "AI 服务",
    isRead: false,
    isDismissed: false,
    persistent: false,
    autoCloseDelay: 0,
    createdAt: Date.now() - 45000,
  },
  {
    id: "n-3",
    type: "success",
    priority: "low",
    title: "布局已恢复",
    message: "上次编辑的工作区布局已自动恢复。",
    icon: "LayoutDashboard",
    source: "布局管理器",
    isRead: true,
    isDismissed: false,
    persistent: false,
    autoCloseDelay: 0,
    createdAt: Date.now() - 30000,
    readAt: Date.now() - 25000,
  },
  {
    id: "n-4",
    type: "collaboration",
    priority: "normal",
    title: "协同编辑可用",
    message: "Alice Chen 和 Bob Li 已在工作区中在线。",
    icon: "Users",
    source: "协同服务",
    isRead: false,
    isDismissed: false,
    persistent: false,
    autoCloseDelay: 0,
    createdAt: Date.now() - 15000,
  },
  {
    id: "n-5",
    type: "warning",
    priority: "high",
    title: "API 配额警告",
    message: "OpenAI API 月度用量已达 80%，请关注用量限制。",
    detail: "当前已使用 800,000 / 1,000,000 tokens。建议优化提示词或切换到更经济的模型。",
    icon: "TriangleAlert",
    source: "AI 监控",
    isRead: false,
    isDismissed: false,
    persistent: true,
    autoCloseDelay: 0,
    createdAt: Date.now() - 5000,
  },
];

/* ─── Store 接口 ─── */
interface NotificationStore {
  /* 状态 */
  notifications: Notification[];
  preferences: NotificationPreferences;
  isNotificationCenterOpen: boolean;

  /* 通知操作 */
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "isRead" | "isDismissed">) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  dismissAll: () => void;
  clearAll: () => void;

  /* 便捷方法 */
  info: (title: string, message: string, options?: Partial<Notification>) => string;
  success: (title: string, message: string, options?: Partial<Notification>) => string;
  warning: (title: string, message: string, options?: Partial<Notification>) => string;
  error: (title: string, message: string, options?: Partial<Notification>) => string;

  /* 查询 */
  getUnreadCount: () => number;
  getByType: (type: NotificationType) => Notification[];
  getUndismissed: () => Notification[];

  /* 通知中心 */
  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  toggleNotificationCenter: () => void;

  /* 偏好 */
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
}

const defaultPreferences: NotificationPreferences = {
  enabled: true,
  showToast: true,
  playSound: false,
  maxNotifications: 200,
  defaultAutoClose: 5000,
  typeFilters: {
    info: true,
    success: true,
    warning: true,
    error: true,
    ai: true,
    system: true,
    collaboration: true,
  },
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => {
      const addNotification: NotificationStore["addNotification"] = (notification) => {
        const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newNotif: Notification = {
          ...notification,
          id,
          createdAt: Date.now(),
          isRead: false,
          isDismissed: false,
          persistent: notification.persistent ?? false,
          autoCloseDelay: notification.autoCloseDelay ?? get().preferences.defaultAutoClose,
        };
        set((s) => {
          const updated = [newNotif, ...s.notifications];
          // 限制最大数量
          if (updated.length > s.preferences.maxNotifications) {
            return { notifications: updated.slice(0, s.preferences.maxNotifications) };
          }
          return { notifications: updated };
        });
        return id;
      };

      return {
        notifications: initialNotifications,
        preferences: defaultPreferences,
        isNotificationCenterOpen: false,

        addNotification,

        removeNotification: (id) => {
          set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }));
        },

        markAsRead: (id) => {
          set((s) => ({
            notifications: s.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true, readAt: Date.now() } : n
            ),
          }));
        },

        markAllAsRead: () => {
          const now = Date.now();
          set((s) => ({
            notifications: s.notifications.map((n) =>
              n.isRead ? n : { ...n, isRead: true, readAt: now }
            ),
          }));
        },

        dismissNotification: (id) => {
          set((s) => ({
            notifications: s.notifications.map((n) =>
              n.id === id ? { ...n, isDismissed: true } : n
            ),
          }));
        },

        dismissAll: () => {
          set((s) => ({
            notifications: s.notifications.map((n) => ({ ...n, isDismissed: true })),
          }));
        },

        clearAll: () => set({ notifications: [] }),

        /* 便捷方法 */
        info: (title, message, options) =>
          addNotification({ type: "info", priority: "normal", title, message, icon: "Info", ...options }),
        success: (title, message, options) =>
          addNotification({ type: "success", priority: "normal", title, message, icon: "CircleCheck", ...options }),
        warning: (title, message, options) =>
          addNotification({ type: "warning", priority: "high", title, message, icon: "TriangleAlert", ...options }),
        error: (title, message, options) =>
          addNotification({ type: "error", priority: "urgent", title, message, icon: "CircleX", persistent: true, ...options }),

        /* 查询 */
        getUnreadCount: () => get().notifications.filter((n) => !n.isRead && !n.isDismissed).length,
        getByType: (type) => get().notifications.filter((n) => n.type === type),
        getUndismissed: () => get().notifications.filter((n) => !n.isDismissed),

        /* 通知中心 */
        openNotificationCenter: () => set({ isNotificationCenterOpen: true }),
        closeNotificationCenter: () => set({ isNotificationCenterOpen: false }),
        toggleNotificationCenter: () => set((s) => ({ isNotificationCenterOpen: !s.isNotificationCenterOpen })),

        /* 偏好 */
        updatePreferences: (prefs) => {
          set((s) => ({ preferences: { ...s.preferences, ...prefs } }));
        },
      };
    },
    {
      name: "yyc3-notifications",
      partialize: (s) => ({
        notifications: s.notifications.slice(0, 50),
        preferences: s.preferences,
      }),
    }
  )
);
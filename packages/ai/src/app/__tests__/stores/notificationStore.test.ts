/**
 * @file notificationStore.test.ts
 * @description 通知中心状态管理单元测试 — 通知 CRUD、已读/未读、过滤、清理
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, unit, notification-store, zustand
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useNotificationStore, type NotificationType, type NotificationPriority } from "../../stores/notificationStore";

describe("notificationStore", () => {
  beforeEach(() => {
    useNotificationStore.getState().clearAll();
  });

  /* ─── 创建通知 ─── */
  describe("创建通知", () => {
    it("addNotification 应创建新通知", () => {
      const store = useNotificationStore.getState();
      store.addNotification({
        type: "info",
        title: "测试通知",
        message: "这是一条测试消息",
      });
      const { notifications } = useNotificationStore.getState();
      expect(notifications.length).toBe(1);
      expect(notifications[0].title).toBe("测试通知");
    });

    it("新通知默认应为未读", () => {
      useNotificationStore.getState().addNotification({
        type: "info",
        title: "未读测试",
        message: "消息",
      });
      const { notifications } = useNotificationStore.getState();
      expect(notifications[0].isRead).toBe(false);
    });

    it("应支持不同的通知类型", () => {
      const types: NotificationType[] = ["info", "success", "warning", "error", "ai", "system", "collaboration"];
      types.forEach((type) => {
        useNotificationStore.getState().addNotification({
          type,
          title: `${type} 通知`,
          message: "消息",
        });
      });
      expect(useNotificationStore.getState().notifications.length).toBe(types.length);
    });

    it("应支持不同的优先级", () => {
      const priorities: NotificationPriority[] = ["low", "normal", "high", "urgent"];
      priorities.forEach((priority) => {
        useNotificationStore.getState().addNotification({
          type: "info",
          title: "优先级测试",
          message: "消息",
          priority,
        });
      });
      expect(useNotificationStore.getState().notifications.length).toBe(priorities.length);
    });
  });

  /* ─── 已读/未读管理 ─── */
  describe("已读/未读管理", () => {
    it("markAsRead 应标记通知为已读", () => {
      useNotificationStore.getState().addNotification({
        type: "info",
        title: "已读测试",
        message: "消息",
      });
      const id = useNotificationStore.getState().notifications[0].id;
      useNotificationStore.getState().markAsRead(id);
      expect(useNotificationStore.getState().notifications[0].isRead).toBe(true);
    });

    it("markAllAsRead 应标记所有通知为已读", () => {
      for (let i = 0; i < 5; i++) {
        useNotificationStore.getState().addNotification({
          type: "info",
          title: `通知 ${i}`,
          message: "消息",
        });
      }
      useNotificationStore.getState().markAllAsRead();
      const { notifications } = useNotificationStore.getState();
      notifications.forEach((n) => {
        expect(n.isRead).toBe(true);
      });
    });

    it("unreadCount 应正确计算未读数", () => {
      for (let i = 0; i < 3; i++) {
        useNotificationStore.getState().addNotification({
          type: "info",
          title: `通知 ${i}`,
          message: "消息",
        });
      }
      // API 对齐（Phase 1 速修）：unreadCount 非状态字段 → 以 notifications 计算未读
      const countUnread = () =>
        useNotificationStore.getState().notifications.filter((n) => !n.isRead).length;
      expect(countUnread()).toBe(3);
      const id = useNotificationStore.getState().notifications[0].id;
      useNotificationStore.getState().markAsRead(id);
      expect(countUnread()).toBe(2);
    });
  });

  /* ─── 删除/清理 ─── */
  describe("删除/清理", () => {
    it("dismiss 应关闭通知", () => {
      useNotificationStore.getState().addNotification({
        type: "info",
        title: "关闭测试",
        message: "消息",
      });
      const id = useNotificationStore.getState().notifications[0].id;
      // API 对齐（Phase 1 速修）：dismiss → dismissNotification
      useNotificationStore.getState().dismissNotification(id);
      const notification = useNotificationStore.getState().notifications.find((n) => n.id === id);
      expect(notification?.isDismissed).toBe(true);
    });

    it("clearAll 应清空所有通知", () => {
      for (let i = 0; i < 5; i++) {
        useNotificationStore.getState().addNotification({
          type: "info",
          title: `通知 ${i}`,
          message: "消息",
        });
      }
      useNotificationStore.getState().clearAll();
      expect(useNotificationStore.getState().notifications.length).toBe(0);
    });
  });
});

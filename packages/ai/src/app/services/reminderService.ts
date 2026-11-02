/**
 * @file reminderService.ts
 * @description 智能提醒服务 — 截止日期提醒、依赖提醒、阻塞提醒、进度提醒，支持 CustomEvent 和 Notification API
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags service, reminder, notification, timer
 */

import { useTaskStore, type Reminder, type Task, type ReminderType } from "../stores/taskStore";

/**
 * 提醒服务类
 * 单例模式，负责定时巡检 + 触发提醒 + 发送通知
 */
class ReminderService {
  private checkTimer: ReturnType<typeof setInterval> | null = null;
  private deadlineTimers = new Map<string, ReturnType<typeof setTimeout>>();

  /** 启动提醒系统 */
  start(): void {
    // 每 60s 巡检一次
    this.checkTimer = setInterval(() => this.checkReminders(), 60_000);
    // 立即首次检查
    this.checkReminders();
    // 请求浏览器通知权限
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }

  /** 停止提醒系统 */
  stop(): void {
    if (this.checkTimer) { clearInterval(this.checkTimer); this.checkTimer = null; }
    for (const timer of this.deadlineTimers.values()) clearTimeout(timer);
    this.deadlineTimers.clear();
  }

  /** 巡检到期提醒 */
  private checkReminders(): void {
    const dueList = useTaskStore.getState().triggerDueReminders();
    for (const reminder of dueList) {
      const task = useTaskStore.getState().tasks.find((t) => t.id === reminder.taskId);
      if (task) this.dispatchReminder(reminder, task);
    }
  }

  /** 分发提醒（CustomEvent + Notification API） */
  private dispatchReminder(reminder: Reminder, task: Task): void {
    // 自定义事件，供 UI 层监听
    window.dispatchEvent(
      new CustomEvent("task-reminder", { detail: { reminder, task } })
    );
    // 浏览器原生通知
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(task.title, { body: reminder.message, tag: reminder.id });
    }
  }

  /* ─── 便捷创建提醒方法 ─── */

  /** 创建截止日期提醒（提前 24h） */
  createDeadlineReminder(taskId: string, dueDate: number): void {
    const remindAt = dueDate - 24 * 60 * 60 * 1000;
    if (remindAt <= Date.now()) return; // 已经过了提前时间

    useTaskStore.getState().addReminder({
      taskId,
      type: "deadline",
      message: "任务即将在 24 小时后到期",
      remindAt,
    });

    // 精确定时
    const delay = remindAt - Date.now();
    if (delay > 0 && delay < 2_147_483_647) {
      const timer = setTimeout(() => this.checkReminders(), delay);
      this.deadlineTimers.set(`${taskId}-deadline`, timer);
    }
  }

  /** 创建依赖完成提醒 */
  createDependencyReminder(taskId: string, depTaskId: string): void {
    const dep = useTaskStore.getState().tasks.find((t) => t.id === depTaskId);
    if (!dep || dep.status === "done") return;

    useTaskStore.getState().addReminder({
      taskId,
      type: "dependency",
      message: `依赖任务 "${dep.title}" 已完成，可以开始`,
      remindAt: Date.now(),
    });
  }

  /** 创建阻塞提醒 */
  createBlockingReminder(taskId: string, blockingTaskId: string): void {
    const blocker = useTaskStore.getState().tasks.find((t) => t.id === blockingTaskId);
    if (!blocker) return;

    useTaskStore.getState().addReminder({
      taskId,
      type: "blocking",
      message: `任务被 "${blocker.title}" 阻塞`,
      remindAt: Date.now(),
    });
  }

  /** 创建进度提醒 */
  createProgressReminder(taskId: string, progress: number): void {
    useTaskStore.getState().addReminder({
      taskId,
      type: "progress",
      message: `任务进度已达到 ${progress}%`,
      remindAt: Date.now(),
    });
  }
}

export const reminderService = new ReminderService();

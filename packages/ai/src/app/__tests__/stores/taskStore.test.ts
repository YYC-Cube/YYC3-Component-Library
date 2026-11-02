/**
 * @file taskStore.test.ts
 * @description taskStore 单元测试 — 任务 CRUD、子任务、提醒、筛选排序、批量操作、AI 推理
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-18
 * @updated 2026-03-18
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, taskStore, unit
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useTaskStore } from "../../stores/taskStore";

const resetStore = () => useTaskStore.setState({
  tasks: [],
  reminders: [],
  filter: {},
  sortBy: "priority",
  sortOrder: "asc",
  boardView: "kanban",
  selectedTaskIds: [],
  editingTaskId: null,
  showArchived: false,
  showCreateDialog: false,
  pendingInferences: [],
});

describe("taskStore", () => {
  beforeEach(resetStore);

  /* ─── CRUD ─── */

  it("addTask creates a task and returns id", () => {
    const id = useTaskStore.getState().addTask({
      title: "Test task",
      status: "todo",
      priority: "medium",
      type: "feature",
    });
    expect(id).toBeTruthy();
    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("Test task");
    expect(tasks[0].source).toBe("manual");
    expect(tasks[0].isArchived).toBe(false);
  });

  it("updateTask modifies task fields", () => {
    const id = useTaskStore.getState().addTask({ title: "A", status: "todo", priority: "low", type: "bug" });
    useTaskStore.getState().updateTask(id, { title: "B", priority: "high" });
    const t = useTaskStore.getState().tasks[0];
    expect(t.title).toBe("B");
    expect(t.priority).toBe("high");
  });

  it("deleteTask removes task and related reminders", () => {
    const id = useTaskStore.getState().addTask({ title: "X", status: "todo", priority: "low", type: "feature" });
    useTaskStore.getState().addReminder({ taskId: id, type: "deadline", message: "due", remindAt: Date.now() + 10000 });
    expect(useTaskStore.getState().reminders).toHaveLength(1);
    useTaskStore.getState().deleteTask(id);
    expect(useTaskStore.getState().tasks).toHaveLength(0);
    expect(useTaskStore.getState().reminders).toHaveLength(0);
  });

  it("archiveTask / unarchiveTask toggles isArchived", () => {
    const id = useTaskStore.getState().addTask({ title: "A", status: "todo", priority: "low", type: "feature" });
    useTaskStore.getState().archiveTask(id);
    expect(useTaskStore.getState().tasks[0].isArchived).toBe(true);
    useTaskStore.getState().unarchiveTask(id);
    expect(useTaskStore.getState().tasks[0].isArchived).toBe(false);
  });

  /* ─── Subtasks ─── */

  it("addSubtask / toggleSubtask / deleteSubtask", () => {
    const id = useTaskStore.getState().addTask({ title: "T", status: "todo", priority: "low", type: "feature" });
    useTaskStore.getState().addSubtask(id, "Sub 1");
    const subs = useTaskStore.getState().tasks[0].subtasks!;
    expect(subs).toHaveLength(1);
    expect(subs[0].isCompleted).toBe(false);

    useTaskStore.getState().toggleSubtask(id, subs[0].id);
    expect(useTaskStore.getState().tasks[0].subtasks![0].isCompleted).toBe(true);

    useTaskStore.getState().deleteSubtask(id, subs[0].id);
    expect(useTaskStore.getState().tasks[0].subtasks).toHaveLength(0);
  });

  /* ─── Reminders ─── */

  it("triggerDueReminders marks past-due reminders", () => {
    const id = useTaskStore.getState().addTask({ title: "T", status: "todo", priority: "low", type: "feature" });
    useTaskStore.getState().addReminder({ taskId: id, type: "deadline", message: "overdue", remindAt: Date.now() - 1000 });
    const due = useTaskStore.getState().triggerDueReminders();
    expect(due).toHaveLength(1);
    expect(useTaskStore.getState().reminders[0].isTriggered).toBe(true);
  });

  it("markReminderRead updates reminder", () => {
    const id = useTaskStore.getState().addTask({ title: "T", status: "todo", priority: "low", type: "feature" });
    useTaskStore.getState().addReminder({ taskId: id, type: "deadline", message: "m", remindAt: Date.now() });
    const remId = useTaskStore.getState().reminders[0].id;
    useTaskStore.getState().markReminderRead(remId);
    expect(useTaskStore.getState().reminders[0].isRead).toBe(true);
  });

  /* ─── Filtering ─── */

  it("getFilteredTasks filters by status", () => {
    useTaskStore.getState().addTask({ title: "A", status: "todo", priority: "low", type: "feature" });
    useTaskStore.getState().addTask({ title: "B", status: "done", priority: "low", type: "feature" });
    useTaskStore.getState().updateFilter({ status: "todo" });
    expect(useTaskStore.getState().getFilteredTasks()).toHaveLength(1);
    expect(useTaskStore.getState().getFilteredTasks()[0].title).toBe("A");
  });

  it("getFilteredTasks filters by searchQuery", () => {
    useTaskStore.getState().addTask({ title: "Login page", status: "todo", priority: "low", type: "feature" });
    useTaskStore.getState().addTask({ title: "Dashboard", status: "todo", priority: "low", type: "feature" });
    useTaskStore.getState().updateFilter({ searchQuery: "login" });
    expect(useTaskStore.getState().getFilteredTasks()).toHaveLength(1);
  });

  it("getFilteredTasks excludes archived by default", () => {
    const id = useTaskStore.getState().addTask({ title: "A", status: "todo", priority: "low", type: "feature" });
    useTaskStore.getState().archiveTask(id);
    expect(useTaskStore.getState().getFilteredTasks()).toHaveLength(0);
    useTaskStore.getState().setShowArchived(true);
    expect(useTaskStore.getState().getFilteredTasks()).toHaveLength(1);
  });

  /* ─── Sorting ─── */

  it("sorts by priority ascending", () => {
    useTaskStore.getState().addTask({ title: "Low", status: "todo", priority: "low", type: "feature" });
    useTaskStore.getState().addTask({ title: "Critical", status: "todo", priority: "critical", type: "feature" });
    useTaskStore.getState().updateSort("priority", "asc");
    const sorted = useTaskStore.getState().getFilteredTasks();
    expect(sorted[0].title).toBe("Critical");
    expect(sorted[1].title).toBe("Low");
  });

  /* ─── Batch ops ─── */

  it("batchUpdateStatus changes multiple tasks", () => {
    const id1 = useTaskStore.getState().addTask({ title: "A", status: "todo", priority: "low", type: "feature" });
    const id2 = useTaskStore.getState().addTask({ title: "B", status: "todo", priority: "low", type: "feature" });
    useTaskStore.getState().batchUpdateStatus([id1, id2], "done");
    expect(useTaskStore.getState().tasks.every((t) => t.status === "done")).toBe(true);
  });

  it("batchDeleteTasks removes multiple", () => {
    const id1 = useTaskStore.getState().addTask({ title: "A", status: "todo", priority: "low", type: "feature" });
    const id2 = useTaskStore.getState().addTask({ title: "B", status: "todo", priority: "low", type: "feature" });
    useTaskStore.getState().batchDeleteTasks([id1, id2]);
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });

  /* ─── AI Inference ─── */

  it("addPendingInference / acceptInference creates task", () => {
    useTaskStore.getState().addPendingInference({
      task: { title: "AI task", status: "todo", priority: "high", type: "feature" },
      confidence: 0.85,
      reasoning: "test",
      context: "test context",
    });
    expect(useTaskStore.getState().pendingInferences).toHaveLength(1);
    useTaskStore.getState().acceptInference(0);
    expect(useTaskStore.getState().pendingInferences).toHaveLength(0);
    expect(useTaskStore.getState().tasks).toHaveLength(1);
    expect(useTaskStore.getState().tasks[0].source).toBe("ai-inferred");
  });

  it("rejectInference removes pending without creating task", () => {
    useTaskStore.getState().addPendingInference({
      task: { title: "Reject me", status: "todo", priority: "low", type: "bug" },
      confidence: 0.7,
      reasoning: "test",
      context: "ctx",
    });
    useTaskStore.getState().rejectInference(0);
    expect(useTaskStore.getState().pendingInferences).toHaveLength(0);
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });

  /* ─── Duplicate ─── */

  it("duplicateTask creates a copy with (副本) suffix", () => {
    const id = useTaskStore.getState().addTask({ title: "Original", status: "done", priority: "high", type: "feature" });
    useTaskStore.getState().duplicateTask(id);
    expect(useTaskStore.getState().tasks).toHaveLength(2);
    expect(useTaskStore.getState().tasks[1].title).toBe("Original (副本)");
    expect(useTaskStore.getState().tasks[1].status).toBe("todo");
  });

  /* ─── Stats ─── */

  it("getStats returns correct counts", () => {
    useTaskStore.getState().addTask({ title: "A", status: "todo", priority: "critical", type: "bug" });
    useTaskStore.getState().addTask({ title: "B", status: "done", priority: "low", type: "feature" });
    const stats = useTaskStore.getState().getStats();
    expect(stats.total).toBe(2);
    expect(stats.byStatus.todo).toBe(1);
    expect(stats.byStatus.done).toBe(1);
    expect(stats.byPriority.critical).toBe(1);
    expect(stats.byType.bug).toBe(1);
  });

  /* ─── Selection ─── */

  it("toggleTaskSelection / clearSelection", () => {
    const id = useTaskStore.getState().addTask({ title: "A", status: "todo", priority: "low", type: "feature" });
    useTaskStore.getState().toggleTaskSelection(id);
    expect(useTaskStore.getState().selectedTaskIds).toContain(id);
    useTaskStore.getState().toggleTaskSelection(id);
    expect(useTaskStore.getState().selectedTaskIds).not.toContain(id);
  });
});

/**
 * @file taskStore.ts
 * @description AI 智能任务看板状态管理 — 任务 CRUD、子任务、提醒、筛选排序、批量操作、AI 推理集成
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, task, kanban, zustand, persistence, ai-inference
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */

export type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskType = "feature" | "bug" | "refactor" | "test" | "documentation" | "other";
export type ReminderType = "deadline" | "dependency" | "blocking" | "progress" | "custom";

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
  estimatedHours?: number;
  actualHours?: number;
  relatedMessageId?: string;
  relatedFiles?: string[];
  tags?: string[];
  subtasks?: SubTask[];
  dependencies?: string[];
  blocking?: string[];
  assigneeId?: string;
  isArchived: boolean;
  source: "manual" | "ai-inferred" | "imported";
  confidence?: number;
}

export interface Reminder {
  id: string;
  taskId: string;
  type: ReminderType;
  message: string;
  remindAt: number;
  isTriggered: boolean;
  isRead: boolean;
  createdAt: number;
}

export interface TaskInference {
  task: Omit<Task, "id" | "createdAt" | "updatedAt" | "isArchived" | "source">;
  confidence: number;
  reasoning: string;
  context: string;
}

/* ─── 看板视图 ─── */
export type BoardView = "kanban" | "list" | "timeline";

/* ─── 统计数据 ─── */
export interface TaskStats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  byType: Record<TaskType, number>;
  overdue: number;
  completedToday: number;
  aiInferred: number;
}

/* ─── Store ─── */

interface TaskState {
  tasks: Task[];
  reminders: Reminder[];
  filter: {
    status?: TaskStatus;
    priority?: TaskPriority;
    type?: TaskType;
    assigneeId?: string;
    tags?: string[];
    searchQuery?: string;
  };
  sortBy: "priority" | "dueDate" | "createdAt" | "updatedAt";
  sortOrder: "asc" | "desc";
  boardView: BoardView;
  selectedTaskIds: string[];
  editingTaskId: string | null;
  showArchived: boolean;
  showCreateDialog: boolean;
  pendingInferences: TaskInference[];
}

interface TaskActions {
  /* 任务 CRUD */
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "isArchived"> & { source?: Task["source"] }) => string;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  archiveTask: (taskId: string) => void;
  unarchiveTask: (taskId: string) => void;

  /* 子任务 */
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  /* 提醒 */
  addReminder: (reminder: Omit<Reminder, "id" | "createdAt" | "isTriggered" | "isRead">) => void;
  markReminderRead: (reminderId: string) => void;
  deleteReminder: (reminderId: string) => void;
  triggerDueReminders: () => Reminder[];

  /* 筛选与排序 */
  updateFilter: (filter: Partial<TaskState["filter"]>) => void;
  clearFilters: () => void;
  updateSort: (sortBy: TaskState["sortBy"], sortOrder: TaskState["sortOrder"]) => void;
  setBoardView: (view: BoardView) => void;

  /* 选择 */
  toggleTaskSelection: (taskId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setEditingTask: (taskId: string | null) => void;
  setShowCreateDialog: (show: boolean) => void;
  setShowArchived: (show: boolean) => void;

  /* 批量操作 */
  batchUpdateStatus: (taskIds: string[], status: TaskStatus) => void;
  batchUpdatePriority: (taskIds: string[], priority: TaskPriority) => void;
  batchDeleteTasks: (taskIds: string[]) => void;
  batchArchiveTasks: (taskIds: string[]) => void;

  /* AI 推理 */
  addPendingInference: (inference: TaskInference) => void;
  acceptInference: (index: number) => void;
  rejectInference: (index: number) => void;
  clearPendingInferences: () => void;

  /* 快捷操作 */
  duplicateTask: (taskId: string) => void;
  moveTaskStatus: (taskId: string, status: TaskStatus) => void;

  /* 统计 */
  getStats: () => TaskStats;
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState & TaskActions>()(
  persist(
    (set, get) => ({
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

      /* ═══ 任务 CRUD ═══ */

      addTask: (taskData) => {
        const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const now = Date.now();
        const newTask: Task = {
          ...taskData,
          id,
          createdAt: now,
          updatedAt: now,
          isArchived: false,
          source: taskData.source || "manual",
        };
        set((s) => ({ tasks: [...s.tasks, newTask] }));
        return id;
      },

      updateTask: (taskId, updates) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates, updatedAt: Date.now() } : t
          ),
        })),

      deleteTask: (taskId) =>
        set((s) => ({
          tasks: s.tasks.filter((t) => t.id !== taskId),
          reminders: s.reminders.filter((r) => r.taskId !== taskId),
          selectedTaskIds: s.selectedTaskIds.filter((id) => id !== taskId),
        })),

      archiveTask: (taskId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, isArchived: true, updatedAt: Date.now() } : t
          ),
        })),

      unarchiveTask: (taskId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, isArchived: false, updatedAt: Date.now() } : t
          ),
        })),

      /* ═══ 子任务 ═══ */

      addSubtask: (taskId, title) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== taskId) return t;
            const sub: SubTask = {
              id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              title,
              isCompleted: false,
              createdAt: Date.now(),
            };
            return { ...t, subtasks: [...(t.subtasks || []), sub], updatedAt: Date.now() };
          }),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              subtasks: t.subtasks?.map((st) =>
                st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
              ),
              updatedAt: Date.now(),
            };
          }),
        })),

      deleteSubtask: (taskId, subtaskId) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              subtasks: t.subtasks?.filter((st) => st.id !== subtaskId),
              updatedAt: Date.now(),
            };
          }),
        })),

      /* ═══ 提醒 ═══ */

      addReminder: (reminder) => {
        const newR: Reminder = {
          ...reminder,
          id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: Date.now(),
          isTriggered: false,
          isRead: false,
        };
        set((s) => ({ reminders: [...s.reminders, newR] }));
      },

      markReminderRead: (reminderId) =>
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === reminderId ? { ...r, isRead: true, isTriggered: true } : r
          ),
        })),

      deleteReminder: (reminderId) =>
        set((s) => ({
          reminders: s.reminders.filter((r) => r.id !== reminderId),
        })),

      triggerDueReminders: () => {
        const now = Date.now();
        const { reminders } = get();
        const due = reminders.filter((r) => !r.isTriggered && !r.isRead && r.remindAt <= now);
        if (due.length > 0) {
          set((s) => ({
            reminders: s.reminders.map((r) =>
              due.find((d) => d.id === r.id) ? { ...r, isTriggered: true } : r
            ),
          }));
        }
        return due;
      },

      /* ═══ 筛选与排序 ═══ */

      updateFilter: (filter) =>
        set((s) => ({ filter: { ...s.filter, ...filter } })),

      clearFilters: () => set({ filter: {} }),

      updateSort: (sortBy, sortOrder) => set({ sortBy, sortOrder }),

      setBoardView: (view) => set({ boardView: view }),

      /* ═══ 选择 ═══ */

      toggleTaskSelection: (taskId) =>
        set((s) => ({
          selectedTaskIds: s.selectedTaskIds.includes(taskId)
            ? s.selectedTaskIds.filter((id) => id !== taskId)
            : [...s.selectedTaskIds, taskId],
        })),

      selectAll: () => {
        const filtered = get().getFilteredTasks();
        set({ selectedTaskIds: filtered.map((t) => t.id) });
      },

      clearSelection: () => set({ selectedTaskIds: [] }),

      setEditingTask: (taskId) => set({ editingTaskId: taskId }),
      setShowCreateDialog: (show) => set({ showCreateDialog: show }),
      setShowArchived: (show) => set({ showArchived: show }),

      /* ═══ 批量操作 ═══ */

      batchUpdateStatus: (taskIds, status) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            taskIds.includes(t.id) ? { ...t, status, updatedAt: Date.now() } : t
          ),
          selectedTaskIds: [],
        })),

      batchUpdatePriority: (taskIds, priority) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            taskIds.includes(t.id) ? { ...t, priority, updatedAt: Date.now() } : t
          ),
          selectedTaskIds: [],
        })),

      batchDeleteTasks: (taskIds) =>
        set((s) => ({
          tasks: s.tasks.filter((t) => !taskIds.includes(t.id)),
          reminders: s.reminders.filter((r) => !taskIds.includes(r.taskId)),
          selectedTaskIds: [],
        })),

      batchArchiveTasks: (taskIds) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            taskIds.includes(t.id) ? { ...t, isArchived: true, updatedAt: Date.now() } : t
          ),
          selectedTaskIds: [],
        })),

      /* ═══ AI 推理 ═══ */

      addPendingInference: (inference) =>
        set((s) => ({ pendingInferences: [...s.pendingInferences, inference] })),

      acceptInference: (index) => {
        const { pendingInferences } = get();
        const inf = pendingInferences[index];
        if (!inf) return;
        get().addTask({ ...inf.task, source: "ai-inferred", confidence: inf.confidence });
        set((s) => ({
          pendingInferences: s.pendingInferences.filter((_, i) => i !== index),
        }));
      },

      rejectInference: (index) =>
        set((s) => ({
          pendingInferences: s.pendingInferences.filter((_, i) => i !== index),
        })),

      clearPendingInferences: () => set({ pendingInferences: [] }),

      /* ═══ 快捷操作 ═══ */

      duplicateTask: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;
        get().addTask({
          title: `${task.title} (副本)`,
          description: task.description,
          status: "todo",
          priority: task.priority,
          type: task.type,
          estimatedHours: task.estimatedHours,
          relatedFiles: task.relatedFiles,
          tags: task.tags,
          subtasks: task.subtasks?.map((st) => ({ ...st, id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, isCompleted: false })),
        });
      },

      moveTaskStatus: (taskId, status) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, status, updatedAt: Date.now() } : t
          ),
        })),

      /* ═══ 统计 ═══ */

      getStats: () => {
        const { tasks } = get();
        const active = tasks.filter((t) => !t.isArchived);
        const now = Date.now();
        const todayStart = new Date().setHours(0, 0, 0, 0);

        const byStatus = { todo: 0, "in-progress": 0, review: 0, done: 0, blocked: 0 } as Record<TaskStatus, number>;
        const byPriority = { critical: 0, high: 0, medium: 0, low: 0 } as Record<TaskPriority, number>;
        const byType = { feature: 0, bug: 0, refactor: 0, test: 0, documentation: 0, other: 0 } as Record<TaskType, number>;

        let overdue = 0;
        let completedToday = 0;
        let aiInferred = 0;

        for (const t of active) {
          byStatus[t.status]++;
          byPriority[t.priority]++;
          byType[t.type]++;
          if (t.dueDate && t.dueDate < now && t.status !== "done") overdue++;
          if (t.status === "done" && t.updatedAt >= todayStart) completedToday++;
          if (t.source === "ai-inferred") aiInferred++;
        }

        return { total: active.length, byStatus, byPriority, byType, overdue, completedToday, aiInferred };
      },

      /* ═══ 筛选后任务列表 ═══ */

      getFilteredTasks: () => {
        const { tasks, filter, sortBy, sortOrder, showArchived } = get();
        let result = tasks.filter((t) => (showArchived ? true : !t.isArchived));

        if (filter.status) result = result.filter((t) => t.status === filter.status);
        if (filter.priority) result = result.filter((t) => t.priority === filter.priority);
        if (filter.type) result = result.filter((t) => t.type === filter.type);
        if (filter.tags && filter.tags.length > 0) {
          result = result.filter((t) => filter.tags!.some((tag) => t.tags?.includes(tag)));
        }
        if (filter.searchQuery) {
          const q = filter.searchQuery.toLowerCase();
          result = result.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              t.description?.toLowerCase().includes(q) ||
              t.tags?.some((tag) => tag.toLowerCase().includes(q))
          );
        }

        const priorityWeight: Record<TaskPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };

        result.sort((a, b) => {
          let cmp = 0;
          switch (sortBy) {
            case "priority":
              cmp = priorityWeight[a.priority] - priorityWeight[b.priority];
              break;
            case "dueDate":
              cmp = (a.dueDate || Infinity) - (b.dueDate || Infinity);
              break;
            case "createdAt":
              cmp = a.createdAt - b.createdAt;
              break;
            case "updatedAt":
              cmp = a.updatedAt - b.updatedAt;
              break;
          }
          return sortOrder === "asc" ? cmp : -cmp;
        });

        return result;
      },
    }),
    {
      name: "yyc3-task-board",
      partialize: (state) => ({
        tasks: state.tasks,
        reminders: state.reminders,
        boardView: state.boardView,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);

/**
 * @file taskActionsService.ts
 * @description 任务快捷操作服务 — 复制/粘贴/分割/合并/导出等任务快捷操作
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags service, task, actions, clipboard, export
 */

import { useTaskStore, type Task, type TaskPriority } from "../stores/taskStore";

/* ─── 任务格式化工具 ─── */

function formatTaskForCopy(task: Task): string {
  let text = `# ${task.title}\n\n`;
  if (task.description) text += `## 描述\n${task.description}\n\n`;
  text += `## 状态\n${task.status}\n\n`;
  text += `## 优先级\n${task.priority}\n\n`;
  text += `## 类型\n${task.type}\n\n`;
  if (task.dueDate) text += `## 截止日期\n${new Date(task.dueDate).toLocaleString("zh-CN")}\n\n`;
  if (task.estimatedHours) text += `## 预估时间\n${task.estimatedHours} 小时\n\n`;
  if (task.tags && task.tags.length > 0) text += `## 标签\n${task.tags.join(", ")}\n\n`;
  if (task.subtasks && task.subtasks.length > 0) {
    text += `## 子任务\n`;
    task.subtasks.forEach((st, i) => { text += `${i + 1}. ${st.isCompleted ? "✓" : "○"} ${st.title}\n`; });
    text += "\n";
  }
  return text;
}

function formatTaskAsMarkdown(task: Task): string {
  let md = `- [${task.status === "done" ? "x" : " "}] ${task.title}\n`;
  if (task.description) md += `  - ${task.description}\n`;
  if (task.dueDate) md += `  - ${new Date(task.dueDate).toLocaleDateString("zh-CN")}\n`;
  const emoji: Record<TaskPriority, string> = { critical: "P0", high: "P1", medium: "P2", low: "P3" };
  md += `  - ${emoji[task.priority]} ${task.priority}\n`;
  return md;
}

function formatTaskAsCodeComment(task: Task, lang: string): string {
  const styles: Record<string, [string, string]> = {
    javascript: ["// TODO: ", ""],
    typescript: ["// TODO: ", ""],
    python: ["# TODO: ", ""],
    html: ["<!-- TODO: ", " -->"],
    css: ["/* TODO: ", " */"],
  };
  const [start, end] = styles[lang] || styles.javascript;
  let comment = `${start}${task.title}`;
  if (task.description) comment += ` - ${task.description}`;
  comment += ` [${task.priority}]${end}`;
  return comment;
}

function getHighestPriority(priorities: TaskPriority[]): TaskPriority {
  const order: TaskPriority[] = ["critical", "high", "medium", "low"];
  for (const p of order) { if (priorities.includes(p)) return p; }
  return "medium";
}

/* ─── 导出的操作函数 ─── */

/** 复制任务为纯文本 */
export async function copyTaskAsText(taskId: string): Promise<void> {
  const task = useTaskStore.getState().tasks.find((t) => t.id === taskId);
  if (!task) return;
  await navigator.clipboard.writeText(formatTaskForCopy(task));
}

/** 复制任务标题 */
export async function copyTaskTitle(taskId: string): Promise<void> {
  const task = useTaskStore.getState().tasks.find((t) => t.id === taskId);
  if (!task) return;
  await navigator.clipboard.writeText(task.title);
}

/** 复制任务为 Markdown */
export async function copyTaskAsMarkdown(taskId: string): Promise<void> {
  const task = useTaskStore.getState().tasks.find((t) => t.id === taskId);
  if (!task) return;
  await navigator.clipboard.writeText(formatTaskAsMarkdown(task));
}

/** 复制任务为代码注释 */
export async function copyTaskAsCodeComment(taskId: string, lang = "typescript"): Promise<void> {
  const task = useTaskStore.getState().tasks.find((t) => t.id === taskId);
  if (!task) return;
  await navigator.clipboard.writeText(formatTaskAsCodeComment(task, lang));
}

/** 分割任务：将未完成子任务提升为独立任务 */
export function splitTask(taskId: string): void {
  const { tasks, addTask, updateTask } = useTaskStore.getState();
  const task = tasks.find((t) => t.id === taskId);
  if (!task || !task.subtasks) return;

  for (const st of task.subtasks) {
    if (!st.isCompleted) {
      addTask({
        title: st.title,
        description: task.description,
        status: "todo",
        priority: task.priority,
        type: task.type,
        estimatedHours: task.estimatedHours && task.subtasks.length > 0
          ? Math.round((task.estimatedHours / task.subtasks.length) * 10) / 10
          : undefined,
        relatedFiles: task.relatedFiles,
        tags: task.tags,
      });
    }
  }
  updateTask(taskId, { status: "done" });
}

/** 合并多个任务为一个 */
export function mergeTasks(taskIds: string[]): void {
  const { tasks, addTask, deleteTask } = useTaskStore.getState();
  const toMerge = tasks.filter((t) => taskIds.includes(t.id));
  if (toMerge.length < 2) return;

  addTask({
    title: `合并任务: ${toMerge.map((t) => t.title).join(", ")}`,
    description: toMerge.map((t) => `- ${t.title}: ${t.description || ""}`).join("\n"),
    status: "todo",
    priority: getHighestPriority(toMerge.map((t) => t.priority)),
    type: toMerge[0].type,
    estimatedHours: toMerge.reduce((sum, t) => sum + (t.estimatedHours || 0), 0) || undefined,
    relatedFiles: [...new Set(toMerge.flatMap((t) => t.relatedFiles || []))],
    tags: [...new Set(toMerge.flatMap((t) => t.tags || []))],
  });

  for (const id of taskIds) deleteTask(id);
}

/** 快速创建任务 */
export function quickCreateTask(title: string, description?: string): string {
  return useTaskStore.getState().addTask({
    title,
    description,
    status: "todo",
    priority: "medium",
    type: "other",
  });
}

/** 导出全部任务为 JSON */
export function exportTasksAsJSON(): string {
  const { tasks } = useTaskStore.getState();
  return JSON.stringify(tasks.filter((t) => !t.isArchived), null, 2);
}

/** 导出全部任务为 Markdown */
export function exportTasksAsMarkdown(): string {
  const { tasks } = useTaskStore.getState();
  const active = tasks.filter((t) => !t.isArchived);
  let md = `# 任务列表\n\n> 导出时间: ${new Date().toLocaleString("zh-CN")}\n\n`;

  const grouped = new Map<string, Task[]>();
  for (const t of active) {
    const key = t.status;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(t);
  }

  const labels: Record<string, string> = {
    todo: "待办", "in-progress": "进行中", review: "审核中", done: "已完成", blocked: "阻塞",
  };

  for (const [status, list] of grouped) {
    md += `## ${labels[status] || status} (${list.length})\n\n`;
    for (const t of list) md += formatTaskAsMarkdown(t) + "\n";
    md += "\n";
  }

  return md;
}

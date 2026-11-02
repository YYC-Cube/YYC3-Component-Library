/**
 * @file taskInferenceService.ts
 * @description AI 任务推理引擎 — 从对话/代码/描述中智能提取任务、推理依赖关系、辅助分解和优先级评估
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags service, ai, task-inference, nlp, extraction
 */

import { useTaskStore, type Task, type TaskInference, type TaskPriority, type TaskType } from "../stores/taskStore";

/* ─── 系统提示词 ─── */

const SYSTEM_PROMPT = `You are an expert project manager and task analyst.
Extract actionable tasks from conversations, code, or descriptions.

Task Types: feature, bug, refactor, test, documentation, other
Task Priorities: critical, high, medium, low

Return JSON array with objects:
{ title, description, type, priority, estimatedHours, relatedFiles, tags, confidence, reasoning, context }`;

/* ─── 本地关键词推理（离线 fallback） ─── */

const KEYWORD_PATTERNS: { pattern: RegExp; type: TaskType; priority: TaskPriority }[] = [
  { pattern: /TODO:?\s*(.+)/gi,          type: "feature",  priority: "medium" },
  { pattern: /FIXME:?\s*(.+)/gi,         type: "bug",      priority: "high" },
  { pattern: /BUG:?\s*(.+)/gi,           type: "bug",      priority: "high" },
  { pattern: /HACK:?\s*(.+)/gi,          type: "refactor", priority: "medium" },
  { pattern: /OPTIMIZE:?\s*(.+)/gi,      type: "refactor", priority: "low" },
  { pattern: /NOTE:?\s*(.+)/gi,          type: "documentation", priority: "low" },
  { pattern: /需要实现(.+)/g,            type: "feature",  priority: "medium" },
  { pattern: /修复(.+)问题/g,            type: "bug",      priority: "high" },
  { pattern: /重构(.+)/g,                type: "refactor", priority: "medium" },
  { pattern: /添加(.+)功能/g,            type: "feature",  priority: "medium" },
  { pattern: /完善(.+)/g,                type: "feature",  priority: "low" },
  { pattern: /优化(.+)/g,                type: "refactor", priority: "low" },
  { pattern: /测试(.+)/g,                type: "test",     priority: "medium" },
  { pattern: /编写(.+)文档/g,            type: "documentation", priority: "low" },
];

/**
 * 从文本中使用关键词匹配提取任务（离线 fallback）
 */
export function inferTasksFromText(text: string): TaskInference[] {
  const results: TaskInference[] = [];
  const seen = new Set<string>();

  for (const { pattern, type, priority } of KEYWORD_PATTERNS) {
    // 重置 regex lastIndex
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const title = match[1]?.trim();
      if (!title || title.length < 3 || seen.has(title.toLowerCase())) continue;
      seen.add(title.toLowerCase());

      results.push({
        task: {
          title,
          description: `从文本中自动提取: "${match[0].trim()}"`,
          status: "todo",
          priority,
          type,
        },
        confidence: 0.7,
        reasoning: `匹配关键词模式: ${pattern.source}`,
        context: text.substring(Math.max(0, match.index - 50), match.index + match[0].length + 50),
      });
    }
  }

  return results;
}

/**
 * 从代码中提取 TODO/FIXME 等注释任务
 */
export function inferTasksFromCode(code: string, language: string): TaskInference[] {
  return inferTasksFromText(code).map((inf) => ({
    ...inf,
    task: {
      ...inf.task,
      relatedFiles: [language],
      description: `从 ${language} 代码注释中提取: ${inf.task.description}`,
    },
    confidence: 0.85,
  }));
}

/**
 * 从 AI 对话消息中提取任务（使用本地关键词引擎）
 * 当 AI Provider 可用时，可替换为实际 API 调用
 */
export function inferTasksFromConversation(
  messages: Array<{ role: string; content: string }>
): TaskInference[] {
  const fullText = messages.map((m) => m.content).join("\n\n");
  return inferTasksFromText(fullText).map((inf) => ({
    ...inf,
    task: {
      ...inf.task,
      description: `从 AI 对话中提取: ${inf.task.description}`,
    },
  }));
}

/**
 * 从用户描述中提取任务
 */
export function inferTasksFromDescription(description: string): TaskInference[] {
  // 尝试按行/句号/分号分割为多个任务
  const lines = description
    .split(/[\n;；。]/)
    .map((l) => l.trim())
    .filter((l) => l.length > 3);

  if (lines.length <= 1) {
    // 整体作为一个任务
    return [{
      task: {
        title: description.slice(0, 80),
        description,
        status: "todo",
        priority: "medium",
        type: "feature",
      },
      confidence: 0.75,
      reasoning: "用户直接描述",
      context: description,
    }];
  }

  // 多行分割为多个任务
  return lines.map((line, i) => ({
    task: {
      title: line.slice(0, 80),
      description: line,
      status: "todo" as const,
      priority: "medium" as TaskPriority,
      type: "feature" as TaskType,
    },
    confidence: 0.65,
    reasoning: `用户描述第 ${i + 1} 项`,
    context: line,
  }));
}

/**
 * 推理任务依赖关系（基于标题关键词简单匹配）
 */
export function inferTaskDependencies(tasks: Task[]): Map<string, string[]> {
  const deps = new Map<string, string[]>();

  for (const task of tasks) {
    const taskDeps: string[] = [];
    const titleLower = (task.title + " " + (task.description || "")).toLowerCase();

    for (const other of tasks) {
      if (other.id === task.id) continue;
      // 如果描述中提到了其他任务的标题关键词
      const otherWords = other.title.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      const matchCount = otherWords.filter((w) => titleLower.includes(w)).length;
      if (matchCount >= 2 && other.createdAt < task.createdAt) {
        taskDeps.push(other.id);
      }
    }

    if (taskDeps.length > 0) deps.set(task.id, taskDeps);
  }

  return deps;
}

/**
 * 将推理结果批量添加到 pending 队列
 */
export function submitInferencesToStore(inferences: TaskInference[]): void {
  const store = useTaskStore.getState();
  for (const inf of inferences) {
    if (inf.confidence >= 0.6) {
      store.addPendingInference(inf);
    }
  }
}

/**
 * 一键从对话提取并提交
 */
export function extractAndSubmitFromConversation(
  messages: Array<{ role: string; content: string }>
): number {
  const inferences = inferTasksFromConversation(messages);
  submitInferencesToStore(inferences);
  return inferences.length;
}

/**
 * 一键从代码提取并提交
 */
export function extractAndSubmitFromCode(code: string, language: string): number {
  const inferences = inferTasksFromCode(code, language);
  submitInferencesToStore(inferences);
  return inferences.length;
}

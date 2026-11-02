/**
 * @file quickActionsService.ts
 * @description 智能一键操作服务层 — 代码/文档/文本/AI辅助操作的统一执行引擎
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags service, quick-actions, code, document, text, ai, clipboard
 */

import {
  useQuickActionsStore,
  type ActionContext,
  type ActionType,
} from "../stores/quickActionsStore";

/* ═══════════════════════════════════════════════════════════
 * 1. 剪贴板操作
 * ═══════════════════════════════════════════════════════════ */

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // 降级方案
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

function escapeHTML(text: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (c) => entities[c]);
}

/* ═══════════════════════════════════════════════════════════
 * 2. AI 模拟引擎 (前端环境 Mock)
 * ═══════════════════════════════════════════════════════════ */

/**
 * 在 Figma Make 环境中无法调用真实 AI API，
 * 此处提供高保真模拟结果，展示完整交互流程。
 * 接入真实 AI Provider 时替换此函数即可。
 */
async function simulateAIResponse(
  systemPrompt: string,
  userPrompt: string,
  delayMs = 800
): Promise<string> {
  await new Promise((r) => setTimeout(r, delayMs + Math.random() * 400));
  return `[AI Response]\n\n${userPrompt.slice(0, 60)}...\n\n---\n\n> _此为模拟响应。接入真实 AI Provider 后将返回实际结果。_\n> System: ${systemPrompt.slice(0, 40)}...`;
}

/* ═══════════════════════════════════════════════════════════
 * 3. 代码操作
 * ═══════════════════════════════════════════════════════════ */

/** 复制代码 */
export async function copyCode(ctx: ActionContext): Promise<void> {
  if (!ctx.selection.text) throw new Error("No code selected");
  await copyToClipboard(ctx.selection.text);
  useQuickActionsStore.getState().addClipboardItem({
    content: ctx.selection.text,
    type: "code",
    language: ctx.file?.language,
    sourceFile: ctx.file?.path,
  });
}

/** 复制代码为 Markdown */
export async function copyCodeAsMarkdown(ctx: ActionContext): Promise<void> {
  if (!ctx.selection.text) throw new Error("No code selected");
  const lang = ctx.file?.language || "text";
  const md = `\`\`\`${lang}\n${ctx.selection.text}\n\`\`\``;
  await copyToClipboard(md);
  useQuickActionsStore.getState().addClipboardItem({
    content: md,
    type: "code",
    language: "markdown",
    sourceFile: ctx.file?.path,
    format: "markdown",
  });
}

/** 复制代码为 HTML */
export async function copyCodeAsHTML(ctx: ActionContext): Promise<void> {
  if (!ctx.selection.text) throw new Error("No code selected");
  const lang = ctx.file?.language || "text";
  const html = `<pre><code class="language-${lang}">${escapeHTML(ctx.selection.text)}</code></pre>`;
  await copyToClipboard(html);
  useQuickActionsStore.getState().addClipboardItem({
    content: html,
    type: "code",
    language: "html",
    sourceFile: ctx.file?.path,
    format: "html",
  });
}

/** AI 重构代码 */
export async function refactorCode(ctx: ActionContext): Promise<string> {
  if (!ctx.selection.text) throw new Error("No code selected");
  const lang = ctx.file?.language || "text";
  const prompt = [
    `Language: ${lang}`,
    `\nOriginal Code:\n\`\`\`${lang}\n${ctx.selection.text}\n\`\`\``,
    `\nRefactoring Goals:`,
    `- Improve readability`,
    `- Reduce duplication`,
    `- Apply design patterns`,
    `- Enhance maintainability`,
    `\nOnly output the refactored code, no explanations.`,
  ].join("\n");

  return simulateAIResponse(
    "You are an expert code refactoring specialist.",
    prompt
  );
}

/** AI 优化代码 */
export async function optimizeCode(ctx: ActionContext): Promise<string> {
  if (!ctx.selection.text) throw new Error("No code selected");
  const lang = ctx.file?.language || "text";
  const prompt = [
    `Language: ${lang}`,
    `\nOriginal Code:\n\`\`\`${lang}\n${ctx.selection.text}\n\`\`\``,
    `\nOptimization Goals:`,
    `- Improve performance`,
    `- Reduce memory usage`,
    `- Optimize algorithms`,
    `\nProvide optimized code with brief explanation.`,
  ].join("\n");

  return simulateAIResponse(
    "You are an expert code optimizer.",
    prompt
  );
}

/** 格式化代码 (本地简易格式化) */
export async function formatCode(ctx: ActionContext): Promise<string> {
  if (!ctx.selection.text) throw new Error("No code selected");
  // 简易格式化：修剪尾随空白、统一缩进
  const lines = ctx.selection.text.split("\n");
  const formatted = lines.map((line) => line.trimEnd()).join("\n");
  return formatted;
}

/* ═══════════════════════════════════════════════════════════
 * 4. AI 辅助操作
 * ═══════════════════════════════════════════════════════════ */

/** AI 解释代码 */
export async function explainCode(ctx: ActionContext): Promise<string> {
  if (!ctx.selection.text) throw new Error("No code selected");
  const lang = ctx.file?.language || "text";
  const prompt = [
    `Language: ${lang}`,
    `\nCode:\n\`\`\`${lang}\n${ctx.selection.text}\n\`\`\``,
    `\nPlease explain this code:`,
    `- Overall purpose and functionality`,
    `- Key components and their roles`,
    `- How the code works`,
    `- Important patterns used`,
    `\nFormat as Markdown.`,
  ].join("\n");

  return simulateAIResponse(
    "You are an expert code educator.",
    prompt
  );
}

/** AI 生成注释 */
export async function generateComments(ctx: ActionContext): Promise<string> {
  if (!ctx.selection.text) throw new Error("No code selected");
  const lang = ctx.file?.language || "text";
  const prompt = [
    `Language: ${lang}`,
    `\nCode:\n\`\`\`${lang}\n${ctx.selection.text}\n\`\`\``,
    `\nAdd comprehensive comments including:`,
    `- Function/class descriptions`,
    `- Parameter and return value explanations`,
    `- Complex logic explanations`,
    `\nOnly output the commented code.`,
  ].join("\n");

  return simulateAIResponse(
    "You are an expert code commenter.",
    prompt
  );
}

/** AI 查找代码问题 */
export async function findIssues(ctx: ActionContext): Promise<string> {
  if (!ctx.selection.text) throw new Error("No code selected");
  const lang = ctx.file?.language || "text";
  const prompt = [
    `Language: ${lang}`,
    `\nCode:\n\`\`\`${lang}\n${ctx.selection.text}\n\`\`\``,
    `\nIdentify issues:`,
    `- Bugs and errors`,
    `- Security vulnerabilities`,
    `- Performance problems`,
    `- Code smells`,
    `\nFor each, provide type, severity, location, description, and fix.`,
    `Format as Markdown.`,
  ].join("\n");

  return simulateAIResponse(
    "You are an expert code reviewer.",
    prompt
  );
}

/** AI 生成测试 */
export async function generateTests(ctx: ActionContext): Promise<string> {
  if (!ctx.selection.text) throw new Error("No code selected");
  const lang = ctx.file?.language || "text";
  const prompt = [
    `Language: ${lang}`,
    `\nCode to Test:\n\`\`\`${lang}\n${ctx.selection.text}\n\`\`\``,
    `\nGenerate comprehensive test cases:`,
    `- Unit tests`,
    `- Edge cases`,
    `- Error handling tests`,
    `\nUse Vitest framework. Only output test code.`,
  ].join("\n");

  return simulateAIResponse(
    "You are an expert test engineer.",
    prompt
  );
}

/** AI 生成文档 */
export async function generateDocumentation(ctx: ActionContext): Promise<string> {
  if (!ctx.selection.text) throw new Error("No code selected");
  const lang = ctx.file?.language || "text";
  const prompt = [
    `Language: ${lang}`,
    `\nCode to Document:\n\`\`\`${lang}\n${ctx.selection.text}\n\`\`\``,
    `\nGenerate documentation:`,
    `- Function/class description`,
    `- Parameters and return values`,
    `- Usage examples`,
    `- Edge cases and limitations`,
    `\nFormat as Markdown.`,
  ].join("\n");

  return simulateAIResponse(
    "You are an expert technical writer.",
    prompt
  );
}

/* ═══════════════════════════════════════════════════════════
 * 5. 文本操作
 * ═══════════════════════════════════════════════════════════ */

/** AI 翻译文本 */
export async function translateText(
  ctx: ActionContext,
  targetLang = "en"
): Promise<string> {
  if (!ctx.selection.text) throw new Error("No text selected");
  const prompt = [
    `Original Text:\n${ctx.selection.text}`,
    `\nTranslate to ${targetLang}. Maintain tone and meaning.`,
    `Only output the translated text.`,
  ].join("\n");

  return simulateAIResponse(
    "You are an expert translator.",
    prompt
  );
}

/** AI 改写文本 */
export async function rewriteText(ctx: ActionContext): Promise<string> {
  if (!ctx.selection.text) throw new Error("No text selected");
  const prompt = [
    `Original Text:\n${ctx.selection.text}`,
    `\nRewrite for clarity, conciseness, and impact.`,
    `Only output the rewritten text.`,
  ].join("\n");

  return simulateAIResponse(
    "You are an expert writer.",
    prompt
  );
}

/** AI 扩展文本 */
export async function expandText(ctx: ActionContext): Promise<string> {
  if (!ctx.selection.text) throw new Error("No text selected");
  const prompt = [
    `Original Text:\n${ctx.selection.text}`,
    `\nExpand with relevant details, examples, and explanations.`,
    `Only output the expanded text.`,
  ].join("\n");

  return simulateAIResponse(
    "You are an expert writer.",
    prompt
  );
}

/** AI 纠错文本 */
export async function correctText(ctx: ActionContext): Promise<string> {
  if (!ctx.selection.text) throw new Error("No text selected");
  const prompt = [
    `Original Text:\n${ctx.selection.text}`,
    `\nCorrect grammar, spelling, and punctuation errors.`,
    `Maintain original meaning and style. Only output corrected text.`,
  ].join("\n");

  return simulateAIResponse(
    "You are an expert editor.",
    prompt
  );
}

/* ═══════════════════════════════════════════════════════════
 * 6. 文档操作
 * ═══════════════════════════════════════════════════════════ */

/** AI 文档摘要 */
export async function summarizeDocument(ctx: ActionContext): Promise<string> {
  if (!ctx.selection.text) throw new Error("No text selected");
  const prompt = [
    `Original Text:\n${ctx.selection.text}`,
    `\nCreate a summary:`,
    `- Main points`,
    `- Key insights`,
    `- Important details`,
    `- Conclusions`,
    `\nFormat as Markdown.`,
  ].join("\n");

  return simulateAIResponse(
    "You are an expert document summarizer.",
    prompt
  );
}

/** AI 文档格式转换 */
export async function convertDocument(
  ctx: ActionContext,
  toFormat = "markdown"
): Promise<string> {
  if (!ctx.selection.text) throw new Error("No text selected");
  const prompt = [
    `Original Text:\n${ctx.selection.text}`,
    `\nConvert to ${toFormat} format.`,
    `Maintain all content and structure. Only output converted text.`,
  ].join("\n");

  return simulateAIResponse(
    "You are an expert document converter.",
    prompt
  );
}

/* ═══════════════════════════════════════════════════════════
 * 7. 统一执行入口
 * ═══════════════════════════════════════════════════════════ */

export async function executeAction(
  actionType: ActionType,
  ctx: ActionContext,
  params?: Record<string, string>
): Promise<string> {
  const store = useQuickActionsStore.getState();
  const execId = store.startExecution(actionType, ctx.selection.text);

  try {
    let result: string;

    switch (actionType) {
      /* 代码操作 */
      case "copy":
        await copyCode(ctx);
        result = ctx.selection.text;
        break;
      case "copy-markdown":
        await copyCodeAsMarkdown(ctx);
        result = `\`\`\`${ctx.file?.language || "text"}\n${ctx.selection.text}\n\`\`\``;
        break;
      case "copy-html":
        await copyCodeAsHTML(ctx);
        result = `<pre><code>${escapeHTML(ctx.selection.text)}</code></pre>`;
        break;
      case "format":
        result = await formatCode(ctx);
        break;
      case "refactor":
        result = await refactorCode(ctx);
        break;
      case "optimize":
        result = await optimizeCode(ctx);
        break;

      /* AI 辅助操作 */
      case "explain":
        result = await explainCode(ctx);
        break;
      case "comment":
        result = await generateComments(ctx);
        break;
      case "find-issues":
        result = await findIssues(ctx);
        break;
      case "test-generate":
        result = await generateTests(ctx);
        break;
      case "document-generate":
        result = await generateDocumentation(ctx);
        break;

      /* 文本操作 */
      case "translate":
        result = await translateText(ctx, params?.targetLang);
        break;
      case "rewrite":
        result = await rewriteText(ctx);
        break;
      case "expand":
        result = await expandText(ctx);
        break;
      case "correct":
        result = await correctText(ctx);
        break;

      /* 文档操作 */
      case "summarize":
        result = await summarizeDocument(ctx);
        break;
      case "convert":
        result = await convertDocument(ctx, params?.toFormat);
        break;

      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }

    store.completeExecution(execId, result);
    return result;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    store.failExecution(execId, msg);
    throw error;
  }
}

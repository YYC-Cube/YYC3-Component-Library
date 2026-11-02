/**
 * @file testUtils.ts
 * @description 测试工具函数 — Mock 数据生成、Store 重置、常用断言辅助
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, helpers, utils, mock-data
 */

import { useLayoutStore, type PanelType, type Tab, type PanelState } from "../../stores/layoutStore";
import { usePreviewStore } from "../../stores/previewStore";
import { useI18nStore } from "../../stores/i18nStore";

/* ─── Store 重置 ─── */
export const resetAllStores = () => {
  useLayoutStore.getState().applyDefaultLayout();
  usePreviewStore.getState().setCode("", "typescript");
  usePreviewStore.getState().clearConsole();
  usePreviewStore.getState().clearErrors();
  useI18nStore.getState().setLocale("zh-CN");
};

/* ─── Mock 数据生成 ─── */
export const createMockTab = (overrides?: Partial<Tab>): Tab => ({
  id: `tab-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  panelId: "panel-test",
  title: "测试 Tab",
  type: "code-editor",
  isPinned: false,
  isModified: false,
  isUnsaved: false,
  hasError: false,
  ...overrides,
});

export const createMockPanel = (overrides?: Partial<PanelState>): PanelState => ({
  id: `panel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  type: "code-editor",
  title: "测试面板",
  tabs: [],
  activeTabId: null,
  isLocked: false,
  isMinimized: false,
  isMaximized: false,
  ...overrides,
});

export const createMockChatMessage = (
  role: "user" | "assistant" = "user",
  content: string = "测试消息"
) => ({
  id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  role,
  content,
  timestamp: Date.now(),
});

export const createMockConversation = (messageCount: number = 3) => {
  const messages = Array.from({ length: messageCount }, (_, i) => ({
    id: `msg-${i}`,
    role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
    content: `消息 ${i + 1}`,
    timestamp: Date.now() - (messageCount - i) * 1000,
  }));
  return {
    id: `conv-${Date.now()}`,
    title: "测试对话",
    messages,
    createdAt: Date.now(),
    activePath: messages.map((m) => m.id),
  };
};

export const createMockFileAttachment = () => ({
  id: `file-${Date.now()}`,
  name: "test.tsx",
  path: "/src/test.tsx",
  language: "typescript",
  size: 1024,
  preview: "import React from 'react';\n\nexport default function Test() {",
});

/* ─── 计时工具 ─── */
export const measureTime = async (fn: () => Promise<void> | void): Promise<number> => {
  const start = performance.now();
  await fn();
  return performance.now() - start;
};

/* ─── 等待工具 ─── */
export const waitMs = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ─── 面板类型列表 ─── */
export const ALL_PANEL_TYPES: PanelType[] = [
  "code-editor", "file-browser", "preview", "terminal", "ai-chat",
  "debug", "output", "search", "database", "version-control",
  "ai-provider", "ai-monitor", "plugin-manager", "theme-editor",
  "shortcut-editor", "performance-monitor", "dashboard", "welcome",
];

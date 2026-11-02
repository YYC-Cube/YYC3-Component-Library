/**
 * @file settingsSyncService.test.ts
 * @description settingsSyncService 单元测试 — 跨 Store 同步、规则编译、MCP 注入、API Key 验证
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, vitest, sync, service
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { useSettingsStore } from "../stores/settingsStore";
import {
  compileRulesAsSystemPrompt,
  getActiveAgentSystemPrompt,
  getActiveMCPEndpoints,
  getMonacoEditorConfig,
} from "../services/settingsSyncService";

beforeEach(() => {
  useSettingsStore.getState().resetSettings();
});

/* ═══ 规则编译为系统提示词 ═══ */
describe("compileRulesAsSystemPrompt", () => {
  it("无启用规则时返回空字符串", () => {
    // 禁用所有规则
    const { settings } = useSettingsStore.getState();
    settings.rules.forEach((r) => {
      useSettingsStore.getState().updateRule(r.id, { enabled: false });
    });
    expect(compileRulesAsSystemPrompt()).toBe("");
  });

  it("编译项目规则和个人规则", () => {
    const result = compileRulesAsSystemPrompt();
    expect(result).toContain("用户自定义规则");
    expect(result).toContain("项目规则");
    expect(result).toContain("代码规范");
  });

  it("包含已启用技能", () => {
    const result = compileRulesAsSystemPrompt();
    expect(result).toContain("已启用技能");
    expect(result).toContain("React 开发");
  });

  it("添加新规则后编译结果更新", () => {
    useSettingsStore.getState().addRule({
      id: "rule-new",
      name: "新测试规则",
      content: "新测试内容XYZ",
      scope: "personal",
      enabled: true,
    });
    const result = compileRulesAsSystemPrompt();
    expect(result).toContain("新测试规则");
    expect(result).toContain("新测试内容XYZ");
  });
});

/* ═══ 智能体系统提示词（含规则注入） ═══ */
describe("getActiveAgentSystemPrompt", () => {
  it("获取默认智能体提示词", () => {
    const prompt = getActiveAgentSystemPrompt();
    expect(prompt).toContain("YYC³ AI Code");
    expect(prompt).toContain("用户自定义规则");
  });

  it("指定智能体 ID", () => {
    const prompt = getActiveAgentSystemPrompt("agent-code-review");
    expect(prompt).toContain("代码审查专家");
  });

  it("启用 AGENTS.md 导入后提示词变更", () => {
    useSettingsStore.getState().updateImportSettings({ includeAgentsMD: true });
    const prompt = getActiveAgentSystemPrompt();
    expect(prompt).toContain("AGENTS.md");
  });

  it("启用 CLAUDE.md 导入后提示词变更", () => {
    useSettingsStore.getState().updateImportSettings({ includeClaudeMD: true });
    const prompt = getActiveAgentSystemPrompt();
    expect(prompt).toContain("CLAUDE.md");
  });
});

/* ═══ MCP 端点 ═══ */
describe("getActiveMCPEndpoints", () => {
  it("返回已启用的 MCP 端点", () => {
    const endpoints = getActiveMCPEndpoints();
    expect(endpoints.length).toBeGreaterThan(0);
    expect(endpoints.every((e) => e.endpoint)).toBe(true);
  });

  it("禁用 MCP 后不返回", () => {
    useSettingsStore.getState().updateMCP("mcp-filesystem", { enabled: false });
    useSettingsStore.getState().updateMCP("mcp-git", { enabled: false });
    const endpoints = getActiveMCPEndpoints();
    expect(endpoints).toHaveLength(0);
  });

  it("添加新 MCP 后返回", () => {
    useSettingsStore.getState().addMCP({
      id: "mcp-new",
      name: "新 MCP",
      type: "manual",
      endpoint: "http://localhost:5555",
      enabled: true,
      projectLevel: false,
    });
    const endpoints = getActiveMCPEndpoints();
    expect(endpoints.find((e) => e.id === "mcp-new")).toBeDefined();
  });
});

/* ═══ Monaco Editor 配置 ═══ */
describe("getMonacoEditorConfig", () => {
  it("返回正确的字体配置", () => {
    const config = getMonacoEditorConfig();
    expect(config.fontFamily).toContain("JetBrains Mono");
    expect(config.fontSize).toBe(14);
    expect(config.wordWrap).toBe("on");
  });

  it("更新设置后配置变更", () => {
    useSettingsStore.getState().updateGeneralSettings({ editorFontSize: 18, wordWrap: false });
    const config = getMonacoEditorConfig();
    expect(config.fontSize).toBe(18);
    expect(config.wordWrap).toBe("off");
  });

  it("autoFix 影响 formatOnPaste", () => {
    useSettingsStore.getState().updateConversationSettings({ autoFixCodeIssues: false });
    const config = getMonacoEditorConfig();
    expect(config.formatOnPaste).toBe(false);
  });
});

/* ═══ 搜索结果分类 ═══ */
describe("Search Result Types", () => {
  it("搜索 MCP 名称", () => {
    useSettingsStore.getState().setSearchQuery("文件系统");
    const results = useSettingsStore.getState().searchSettings();
    expect(results.some((r) => r.type === "mcp")).toBe(true);
  });

  it("搜索对话流关键词", () => {
    useSettingsStore.getState().setSearchQuery("待办");
    const results = useSettingsStore.getState().searchSettings();
    expect(results.some((r) => r.section === "conversation")).toBe(true);
  });

  it("每个结果都有 section 字段", () => {
    useSettingsStore.getState().setSearchQuery("a");
    const results = useSettingsStore.getState().searchSettings();
    results.forEach((r) => {
      expect(r.section).toBeDefined();
      expect(typeof r.section).toBe("string");
    });
  });
});

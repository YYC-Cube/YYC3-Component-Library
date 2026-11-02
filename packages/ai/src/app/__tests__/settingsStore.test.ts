/**
 * @file settingsStore.test.ts
 * @description settingsStore 单元测试 — CRUD 操作、搜索逻辑、导入导出、重置
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-17
 * @updated 2026-03-17
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, vitest, settings, store
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useSettingsStore } from "../stores/settingsStore";

/* ─── 每次测试前重置 store ─── */
beforeEach(() => {
  useSettingsStore.getState().resetSettings();
});

/* ═══ 用户信息 ═══ */
describe("UserProfile CRUD", () => {
  it("应有默认用户信息", () => {
    const { settings } = useSettingsStore.getState();
    expect(settings.userProfile.username).toBe("YYC³ Developer");
    expect(settings.userProfile.email).toBe("dev@yyc3.ai");
  });

  it("更新用户名", () => {
    useSettingsStore.getState().updateUserProfile({ username: "TestUser" });
    expect(useSettingsStore.getState().settings.userProfile.username).toBe("TestUser");
  });

  it("更新邮箱", () => {
    useSettingsStore.getState().updateUserProfile({ email: "test@example.com" });
    expect(useSettingsStore.getState().settings.userProfile.email).toBe("test@example.com");
  });

  it("部分更新不会覆盖其他字段", () => {
    const before = useSettingsStore.getState().settings.userProfile;
    useSettingsStore.getState().updateUserProfile({ bio: "New bio" });
    const after = useSettingsStore.getState().settings.userProfile;
    expect(after.username).toBe(before.username);
    expect(after.bio).toBe("New bio");
  });
});

/* ═══ 通用设置 ═══ */
describe("GeneralSettings CRUD", () => {
  it("默认主题为 dark", () => {
    expect(useSettingsStore.getState().settings.general.theme).toBe("dark");
  });

  it("更新编辑器字体大小", () => {
    useSettingsStore.getState().updateGeneralSettings({ editorFontSize: 18 });
    expect(useSettingsStore.getState().settings.general.editorFontSize).toBe(18);
  });

  it("更新自动换行", () => {
    useSettingsStore.getState().updateGeneralSettings({ wordWrap: false });
    expect(useSettingsStore.getState().settings.general.wordWrap).toBe(false);
  });

  it("更新语言设置", () => {
    useSettingsStore.getState().updateGeneralSettings({ language: "en-US" });
    expect(useSettingsStore.getState().settings.general.language).toBe("en-US");
  });
});

/* ═══ 智能体管理 ═══ */
describe("Agent CRUD", () => {
  it("默认有内置智能体", () => {
    const { agents } = useSettingsStore.getState().settings;
    expect(agents.length).toBeGreaterThan(0);
    expect(agents.some((a) => a.isBuiltIn)).toBe(true);
  });

  it("添加自定义智能体", () => {
    useSettingsStore.getState().addAgent({
      id: "test-agent",
      name: "测试智能体",
      description: "用于测试",
      systemPrompt: "你是测试助手",
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      maxTokens: 2048,
      isBuiltIn: false,
      isCustom: true,
    });
    const { agents } = useSettingsStore.getState().settings;
    expect(agents.find((a) => a.id === "test-agent")).toBeDefined();
  });

  it("更新智能体", () => {
    useSettingsStore.getState().updateAgent("agent-default", { name: "已改名" });
    const agent = useSettingsStore.getState().settings.agents.find((a) => a.id === "agent-default");
    expect(agent?.name).toBe("已改名");
  });

  it("删除智能体", () => {
    const before = useSettingsStore.getState().settings.agents.length;
    useSettingsStore.getState().addAgent({
      id: "to-delete",
      name: "删除测试",
      systemPrompt: "",
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 4096,
      isBuiltIn: false,
      isCustom: true,
    });
    useSettingsStore.getState().removeAgent("to-delete");
    expect(useSettingsStore.getState().settings.agents.length).toBe(before);
  });
});

/* ═══ MCP 管理 ═══ */
describe("MCP CRUD", () => {
  it("添加 MCP", () => {
    useSettingsStore.getState().addMCP({
      id: "mcp-test",
      name: "测试 MCP",
      type: "manual",
      endpoint: "http://localhost:9999",
      enabled: true,
      projectLevel: false,
    });
    expect(useSettingsStore.getState().settings.mcpConfigs.find((m) => m.id === "mcp-test")).toBeDefined();
  });

  it("更新 MCP 端点", () => {
    useSettingsStore.getState().updateMCP("mcp-filesystem", { endpoint: "http://new-endpoint" });
    const mcp = useSettingsStore.getState().settings.mcpConfigs.find((m) => m.id === "mcp-filesystem");
    expect(mcp?.endpoint).toBe("http://new-endpoint");
  });

  it("删除 MCP", () => {
    useSettingsStore.getState().removeMCP("mcp-git");
    expect(useSettingsStore.getState().settings.mcpConfigs.find((m) => m.id === "mcp-git")).toBeUndefined();
  });

  it("禁用 MCP", () => {
    useSettingsStore.getState().updateMCP("mcp-filesystem", { enabled: false });
    const mcp = useSettingsStore.getState().settings.mcpConfigs.find((m) => m.id === "mcp-filesystem");
    expect(mcp?.enabled).toBe(false);
  });
});

/* ═══ 模型配置 ═══ */
describe("Model CRUD", () => {
  it("默认有预设模型", () => {
    expect(useSettingsStore.getState().settings.models.length).toBeGreaterThan(0);
  });

  it("添加模型", () => {
    useSettingsStore.getState().addModel({
      id: "model-test",
      provider: "TestProvider",
      model: "test-model",
      apiKey: "sk-test123",
      enabled: true,
    });
    const model = useSettingsStore.getState().settings.models.find((m) => m.id === "model-test");
    expect(model).toBeDefined();
    expect(model?.apiKey).toBe("sk-test123");
  });

  it("更新模型 API Key", () => {
    useSettingsStore.getState().updateModel("model-openai-gpt4", { apiKey: "sk-newkey" });
    const model = useSettingsStore.getState().settings.models.find((m) => m.id === "model-openai-gpt4");
    expect(model?.apiKey).toBe("sk-newkey");
  });

  it("删除模型", () => {
    useSettingsStore.getState().removeModel("model-zhipu-glm4");
    expect(useSettingsStore.getState().settings.models.find((m) => m.id === "model-zhipu-glm4")).toBeUndefined();
  });
});

/* ═══ 上下文设置 ═══ */
describe("Context Settings", () => {
  it("默认忽略规则", () => {
    const rules = useSettingsStore.getState().settings.context.ignoreRules;
    expect(rules).toContain("node_modules");
    expect(rules).toContain(".git");
  });

  it("添加文档集", () => {
    useSettingsStore.getState().addDocumentSet({
      id: "doc-test",
      name: "测试文档",
      source: "url",
      url: "https://docs.example.com",
      enabled: true,
    });
    expect(useSettingsStore.getState().settings.context.documentSets.find((d) => d.id === "doc-test")).toBeDefined();
  });

  it("删除文档集", () => {
    useSettingsStore.getState().addDocumentSet({
      id: "doc-delete",
      name: "待删除",
      source: "local",
      localPath: "/tmp",
      enabled: true,
    });
    useSettingsStore.getState().removeDocumentSet("doc-delete");
    expect(useSettingsStore.getState().settings.context.documentSets.find((d) => d.id === "doc-delete")).toBeUndefined();
  });

  it("更新索引状态", () => {
    useSettingsStore.getState().updateContextSettings({ indexStatus: "indexing" });
    expect(useSettingsStore.getState().settings.context.indexStatus).toBe("indexing");
  });
});

/* ═══ 对话流设置 ═══ */
describe("Conversation Settings", () => {
  it("默认启用待办清单", () => {
    expect(useSettingsStore.getState().settings.conversation.useTodoList).toBe(true);
  });

  it("更新代码审查范围", () => {
    useSettingsStore.getState().updateConversationSettings({ codeReviewScope: "changed" });
    expect(useSettingsStore.getState().settings.conversation.codeReviewScope).toBe("changed");
  });

  it("更新音量", () => {
    useSettingsStore.getState().updateConversationSettings({ volume: 50 });
    expect(useSettingsStore.getState().settings.conversation.volume).toBe(50);
  });

  it("添加白名单命令", () => {
    const before = useSettingsStore.getState().settings.conversation.whitelistCommands.length;
    useSettingsStore.getState().updateConversationSettings({
      whitelistCommands: [...useSettingsStore.getState().settings.conversation.whitelistCommands, "yarn test"],
    });
    expect(useSettingsStore.getState().settings.conversation.whitelistCommands.length).toBe(before + 1);
    expect(useSettingsStore.getState().settings.conversation.whitelistCommands).toContain("yarn test");
  });
});

/* ═══ 规则管理 ═══ */
describe("Rules CRUD", () => {
  it("默认有预设规则", () => {
    expect(useSettingsStore.getState().settings.rules.length).toBeGreaterThan(0);
  });

  it("添加规则", () => {
    useSettingsStore.getState().addRule({
      id: "rule-test",
      name: "测试规则",
      content: "测试内容",
      scope: "personal",
      enabled: true,
    });
    expect(useSettingsStore.getState().settings.rules.find((r) => r.id === "rule-test")).toBeDefined();
  });

  it("更新规则", () => {
    useSettingsStore.getState().updateRule("rule-code-standard", { content: "新内容" });
    const rule = useSettingsStore.getState().settings.rules.find((r) => r.id === "rule-code-standard");
    expect(rule?.content).toBe("新内容");
  });

  it("删除规则", () => {
    useSettingsStore.getState().removeRule("rule-naming");
    expect(useSettingsStore.getState().settings.rules.find((r) => r.id === "rule-naming")).toBeUndefined();
  });

  it("禁用规则", () => {
    useSettingsStore.getState().updateRule("rule-code-standard", { enabled: false });
    const rule = useSettingsStore.getState().settings.rules.find((r) => r.id === "rule-code-standard");
    expect(rule?.enabled).toBe(false);
  });
});

/* ═══ 技能管理 ═══ */
describe("Skills CRUD", () => {
  it("默认有预设技能", () => {
    expect(useSettingsStore.getState().settings.skills.length).toBeGreaterThan(0);
  });

  it("添加技能", () => {
    useSettingsStore.getState().addSkill({
      id: "skill-test",
      name: "测试技能",
      description: "测试",
      content: "内容",
      scope: "global",
      enabled: true,
    });
    expect(useSettingsStore.getState().settings.skills.find((s) => s.id === "skill-test")).toBeDefined();
  });

  it("删除技能", () => {
    useSettingsStore.getState().removeSkill("skill-react");
    expect(useSettingsStore.getState().settings.skills.find((s) => s.id === "skill-react")).toBeUndefined();
  });
});

/* ═══ 搜索功能 ═══ */
describe("Search Functionality", () => {
  it("空查询返回空结果", () => {
    useSettingsStore.getState().setSearchQuery("");
    expect(useSettingsStore.getState().searchSettings()).toHaveLength(0);
  });

  it("搜索智能体名称", () => {
    useSettingsStore.getState().setSearchQuery("通用助手");
    const results = useSettingsStore.getState().searchSettings();
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.type === "agent")).toBe(true);
  });

  it("搜索规则", () => {
    useSettingsStore.getState().setSearchQuery("代码规范");
    const results = useSettingsStore.getState().searchSettings();
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.type === "rule")).toBe(true);
  });

  it("搜索模型", () => {
    useSettingsStore.getState().setSearchQuery("OpenAI");
    const results = useSettingsStore.getState().searchSettings();
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.type === "model")).toBe(true);
  });

  it("搜索通用设置关键词", () => {
    useSettingsStore.getState().setSearchQuery("主题");
    const results = useSettingsStore.getState().searchSettings();
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.type === "setting")).toBe(true);
  });

  it("搜索技能", () => {
    useSettingsStore.getState().setSearchQuery("React");
    const results = useSettingsStore.getState().searchSettings();
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.type === "skill")).toBe(true);
  });

  it("不匹配时返回空", () => {
    useSettingsStore.getState().setSearchQuery("xyznonexistent");
    expect(useSettingsStore.getState().searchSettings()).toHaveLength(0);
  });
});

/* ═══ 导入导出 ═══ */
describe("Import/Export", () => {
  it("导出配置包含所有字段", () => {
    const config = useSettingsStore.getState().exportConfig();
    expect(config.userProfile).toBeDefined();
    expect(config.general).toBeDefined();
    expect(config.agents).toBeDefined();
    expect(config.mcpConfigs).toBeDefined();
    expect(config.models).toBeDefined();
    expect(config.context).toBeDefined();
    expect(config.conversation).toBeDefined();
    expect(config.rules).toBeDefined();
    expect(config.skills).toBeDefined();
    expect(config.importSettings).toBeDefined();
  });

  it("导入配置覆盖当前", () => {
    useSettingsStore.getState().importConfig({
      general: { ...useSettingsStore.getState().settings.general, editorFontSize: 20 },
    });
    expect(useSettingsStore.getState().settings.general.editorFontSize).toBe(20);
  });

  it("重置恢复默认值", () => {
    useSettingsStore.getState().updateGeneralSettings({ editorFontSize: 99 });
    useSettingsStore.getState().resetSettings();
    expect(useSettingsStore.getState().settings.general.editorFontSize).toBe(14);
  });
});

/* ═══ 导入设置 ═══ */
describe("ImportSettings", () => {
  it("默认不包含 AGENTS.md", () => {
    expect(useSettingsStore.getState().settings.importSettings.includeAgentsMD).toBe(false);
  });

  it("启用 AGENTS.md 导入", () => {
    useSettingsStore.getState().updateImportSettings({ includeAgentsMD: true });
    expect(useSettingsStore.getState().settings.importSettings.includeAgentsMD).toBe(true);
  });
});

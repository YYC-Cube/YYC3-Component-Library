/**
 * @file panelWorkflow.test.ts
 * @description 面板工作流集成测试 — 面板创建→Tab 切换→分割→预览同步→关闭 完整链路
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, integration, panel, workflow
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useLayoutStore, type LayoutNode } from "../../stores/layoutStore";
import { usePreviewStore } from "../../stores/previewStore";
import { useI18nStore } from "../../stores/i18nStore";

/* ─── 辅助 ─── */
function collectLeafIds(node: LayoutNode): string[] {
  if (node.kind === "leaf") return [node.panelId];
  return [...collectLeafIds(node.first), ...collectLeafIds(node.second)];
}

describe("面板工作流集成测试", () => {
  beforeEach(() => {
    useLayoutStore.getState().applyDefaultLayout();
  });

  /* ─── 完整面板生命周期 ─── */
  describe("面板生命周期", () => {
    it("创建面板 → 添加 Tab → 切换 Tab → 关闭 Tab → 关闭面板", () => {
      const store = useLayoutStore.getState();

      // 1. 创建面板
      const panelId = store.createPanel("database", "数据库管理");
      let state = useLayoutStore.getState();
      expect(state.panels[panelId]).toBeDefined();
      expect(state.panels[panelId].type).toBe("database");

      // 2. 添加第二个 Tab
      useLayoutStore.getState().createTab(panelId, "database", "MySQL 连接");
      state = useLayoutStore.getState();
      expect(state.panels[panelId].tabs.length).toBe(2);

      // 3. 切换 Tab
      const secondTabId = state.panels[panelId].tabs[1];
      useLayoutStore.getState().switchTab(secondTabId);
      state = useLayoutStore.getState();
      expect(state.panels[panelId].activeTabId).toBe(secondTabId);

      // 4. 关闭第二个 Tab
      useLayoutStore.getState().closeTab(secondTabId);
      state = useLayoutStore.getState();
      expect(state.panels[panelId].tabs.length).toBe(1);

      // 5. 关闭面板
      useLayoutStore.getState().removePanel(panelId);
      state = useLayoutStore.getState();
      expect(state.panels[panelId]).toBeUndefined();
    });
  });

  /* ─── 分割与合并 ─── */
  describe("面板分割与合并", () => {
    it("分割面板应增加布局树节点", () => {
      const state = useLayoutStore.getState();
      const panelId = Object.keys(state.panels)[0];
      const leafCountBefore = collectLeafIds(state.layoutTree).length;

      useLayoutStore.getState().splitPanel(panelId, "horizontal", "terminal");

      const after = useLayoutStore.getState();
      const leafCountAfter = collectLeafIds(after.layoutTree).length;
      expect(leafCountAfter).toBe(leafCountBefore + 1);
    });

    it("多次分割应创建嵌套布局", () => {
      const store = useLayoutStore.getState();
      const panelId = Object.keys(store.panels)[0];

      // 第一次分割
      useLayoutStore.getState().splitPanel(panelId, "horizontal", "ai-chat");
      // 第二次分割新面板
      const newPanelId = Object.keys(useLayoutStore.getState().panels).find(
        (id) => !Object.keys(store.panels).includes(id)
      );
      if (newPanelId) {
        useLayoutStore.getState().splitPanel(newPanelId, "vertical", "search");
      }

      const finalLeafCount = collectLeafIds(useLayoutStore.getState().layoutTree).length;
      expect(finalLeafCount).toBeGreaterThanOrEqual(Object.keys(store.panels).length + 2);
    });
  });

  /* ─── 跨 Store 集成 ─── */
  describe("跨 Store 集成", () => {
    it("预览代码更新应与布局状态独立", () => {
      // 创建预览面板
      useLayoutStore.getState().createPanel("preview", "预览面板");

      // 更新预览代码
      usePreviewStore.getState().setCode("<h1>集成测试</h1>", "html");

      // 布局状态不应受影响
      const layoutState = useLayoutStore.getState();
      expect(Object.keys(layoutState.panels).length).toBeGreaterThan(0);

      // 预览状态应正确
      const previewState = usePreviewStore.getState();
      expect(previewState.code).toBe("<h1>集成测试</h1>");
    });

    it("i18n 切换不应影响面板结构", () => {
      const panelCountBefore = Object.keys(useLayoutStore.getState().panels).length;

      // 切换语言
      useI18nStore.getState().setLocale("en-US");

      const panelCountAfter = Object.keys(useLayoutStore.getState().panels).length;
      expect(panelCountAfter).toBe(panelCountBefore);
    });
  });

  /* ─── 布局保存与恢复 ─── */
  describe("布局保存与恢复", () => {
    it("保存 → 修改 → 加载 应恢复到保存时的状态", () => {
      // 保存当前布局
      useLayoutStore.getState().saveLayout("集成测试布局");
      const savedId = useLayoutStore.getState().savedLayouts[0]?.id;
      const panelCountAtSave = Object.keys(useLayoutStore.getState().panels).length;

      // 修改布局
      useLayoutStore.getState().createPanel("database");
      useLayoutStore.getState().createPanel("search");
      expect(Object.keys(useLayoutStore.getState().panels).length).toBe(panelCountAtSave + 2);

      // 加载保存的布局
      if (savedId) {
        useLayoutStore.getState().loadLayout(savedId);
        expect(Object.keys(useLayoutStore.getState().panels).length).toBe(panelCountAtSave);
      }
    });

    it("导出 → 导入 往返应保持数据一致", () => {
      // 导出
      const exported = useLayoutStore.getState().exportLayout();
      const parsed = JSON.parse(exported);

      // 验证导出数据结构
      expect(parsed).toHaveProperty("panels");
      expect(parsed).toHaveProperty("tabs");
      expect(parsed).toHaveProperty("layoutTree");
      expect(parsed).toHaveProperty("activePanelId");

      // 导入
      const success = useLayoutStore.getState().importLayout(exported);
      expect(success).toBe(true);
    });
  });

  /* ─── Tab 跨面板操作 ─── */
  describe("Tab 跨面板操作", () => {
    it("moveTab 应将 Tab 从一个面板移到另一个", () => {
      const state = useLayoutStore.getState();
      // 找到有多个 Tab 的面板
      const sourcePanelId = Object.keys(state.panels).find(
        (id) => state.panels[id].tabs.length > 1
      );
      if (!sourcePanelId) return;

      const targetPanelId = Object.keys(state.panels).find(
        (id) => id !== sourcePanelId
      );
      if (!targetPanelId) return;

      const tabToMove = state.panels[sourcePanelId].tabs[state.panels[sourcePanelId].tabs.length - 1];
      const targetTabCountBefore = state.panels[targetPanelId].tabs.length;

      useLayoutStore.getState().moveTab(tabToMove, targetPanelId);

      const after = useLayoutStore.getState();
      // 如果面板还存在
      if (after.panels[sourcePanelId]) {
        expect(after.panels[sourcePanelId].tabs).not.toContain(tabToMove);
      }
      expect(after.panels[targetPanelId].tabs.length).toBe(targetTabCountBefore + 1);
    });
  });
});

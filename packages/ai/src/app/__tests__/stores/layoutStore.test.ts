/**
 * @file layoutStore.test.ts
 * @description 布局状态管理单元测试 — 面板 CRUD、Tab 管理、布局树操作、分割/合并
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, unit, layout-store, zustand, panel, tab
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useLayoutStore, panelTypeMeta, type PanelType, type LayoutNode } from "../../stores/layoutStore";

/* ─── 辅助：重置 store ─── */
const resetStore = () => {
  useLayoutStore.getState().applyDefaultLayout();
};

describe("layoutStore", () => {
  beforeEach(() => {
    resetStore();
  });

  /* ─── 初始状态 ─── */
  describe("初始状态", () => {
    it("应包含默认面板", () => {
      const { panels } = useLayoutStore.getState();
      const panelIds = Object.keys(panels);
      expect(panelIds.length).toBeGreaterThanOrEqual(5);
    });

    it("应包含默认 Tab", () => {
      const { tabs } = useLayoutStore.getState();
      const tabIds = Object.keys(tabs);
      expect(tabIds.length).toBeGreaterThanOrEqual(5);
    });

    it("应有活跃面板", () => {
      const { activePanelId } = useLayoutStore.getState();
      expect(activePanelId).toBeTruthy();
    });

    it("布局树应包含所有面板", () => {
      const { layoutTree, panels } = useLayoutStore.getState();
      const treeIds = collectLeafIds(layoutTree);
      const panelIds = Object.keys(panels);
      panelIds.forEach((id) => {
        expect(treeIds).toContain(id);
      });
    });

    it("侧栏默认不折叠", () => {
      const { sidebarCollapsed } = useLayoutStore.getState();
      expect(sidebarCollapsed).toBe(false);
    });
  });

  /* ─── 面板管理 ─── */
  describe("面板管理", () => {
    it("createPanel 应创建新面板并设为活跃", () => {
      const store = useLayoutStore.getState();
      const id = store.createPanel("database");
      const updated = useLayoutStore.getState();
      expect(updated.panels[id]).toBeDefined();
      expect(updated.panels[id].type).toBe("database");
      expect(updated.activePanelId).toBe(id);
    });

    it("createPanel 应同时创建关联 Tab", () => {
      const store = useLayoutStore.getState();
      const id = store.createPanel("ai-chat", "自定义标题");
      const updated = useLayoutStore.getState();
      const panel = updated.panels[id];
      expect(panel.tabs.length).toBe(1);
      const tab = updated.tabs[panel.tabs[0]];
      expect(tab.title).toBe("自定义标题");
      expect(tab.type).toBe("ai-chat");
    });

    it("removePanel 应移除面板及其 Tab", () => {
      const store = useLayoutStore.getState();
      const id = store.createPanel("search");
      const tabsBefore = Object.keys(useLayoutStore.getState().tabs).length;
      useLayoutStore.getState().removePanel(id);
      const after = useLayoutStore.getState();
      expect(after.panels[id]).toBeUndefined();
      expect(Object.keys(after.tabs).length).toBeLessThan(tabsBefore);
    });

    it("removePanel 不应移除最后一个面板", () => {
      const state = useLayoutStore.getState();
      const allIds = Object.keys(state.panels);
      // 移除除一个外的所有面板
      for (let i = 0; i < allIds.length - 1; i++) {
        useLayoutStore.getState().removePanel(allIds[i]);
      }
      const remaining = Object.keys(useLayoutStore.getState().panels);
      expect(remaining.length).toBeGreaterThanOrEqual(1);
      // 尝试移除最后一个
      useLayoutStore.getState().removePanel(remaining[0]);
      expect(Object.keys(useLayoutStore.getState().panels).length).toBeGreaterThanOrEqual(1);
    });

    it("setActivePanel 应更新活跃面板", () => {
      const state = useLayoutStore.getState();
      const ids = Object.keys(state.panels);
      const targetId = ids[ids.length - 1];
      state.setActivePanel(targetId);
      expect(useLayoutStore.getState().activePanelId).toBe(targetId);
    });

    it("lockPanel 应设置面板锁定状态", () => {
      const state = useLayoutStore.getState();
      const id = Object.keys(state.panels)[0];
      state.lockPanel(id, true);
      expect(useLayoutStore.getState().panels[id].isLocked).toBe(true);
      useLayoutStore.getState().lockPanel(id, false);
      expect(useLayoutStore.getState().panels[id].isLocked).toBe(false);
    });

    it("minimizePanel 应设置面板最小化状态", () => {
      const state = useLayoutStore.getState();
      const id = Object.keys(state.panels)[0];
      state.minimizePanel(id, true);
      expect(useLayoutStore.getState().panels[id].isMinimized).toBe(true);
    });

    it("maximizePanel 应设置面板最大化状态", () => {
      const state = useLayoutStore.getState();
      const id = Object.keys(state.panels)[0];
      state.maximizePanel(id, true);
      expect(useLayoutStore.getState().panels[id].isMaximized).toBe(true);
    });
  });

  /* ─── Tab 管理 ─── */
  describe("Tab 管理", () => {
    it("createTab 应在面板中创建新 Tab", () => {
      const state = useLayoutStore.getState();
      const panelId = Object.keys(state.panels)[0];
      const tabsBefore = state.panels[panelId].tabs.length;
      state.createTab(panelId, "code-editor", "新文件");
      const after = useLayoutStore.getState();
      expect(after.panels[panelId].tabs.length).toBe(tabsBefore + 1);
    });

    it("closeTab 应移除 Tab", () => {
      const state = useLayoutStore.getState();
      const panelId = Object.keys(state.panels).find(
        (id) => state.panels[id].tabs.length > 1
      );
      if (!panelId) return; // 跳过无多 Tab 面板的情况
      const tabId = state.panels[panelId].tabs[state.panels[panelId].tabs.length - 1];
      state.closeTab(tabId);
      const after = useLayoutStore.getState();
      expect(after.panels[panelId]?.tabs).not.toContain(tabId);
    });

    it("switchTab 应更新面板的活跃 Tab", () => {
      const state = useLayoutStore.getState();
      const panelId = Object.keys(state.panels).find(
        (id) => state.panels[id].tabs.length > 1
      );
      if (!panelId) return;
      const panel = state.panels[panelId];
      const tabId = panel.tabs.find((t) => t !== panel.activeTabId);
      if (!tabId) return;
      state.switchTab(tabId);
      expect(useLayoutStore.getState().panels[panelId].activeTabId).toBe(tabId);
    });

    it("pinTab 应设置 Tab 固定状态", () => {
      const state = useLayoutStore.getState();
      const tabId = Object.keys(state.tabs)[0];
      state.pinTab(tabId, true);
      expect(useLayoutStore.getState().tabs[tabId].isPinned).toBe(true);
      useLayoutStore.getState().pinTab(tabId, false);
      expect(useLayoutStore.getState().tabs[tabId].isPinned).toBe(false);
    });

    it("markTabModified 应标记 Tab 修改状态", () => {
      const state = useLayoutStore.getState();
      const tabId = Object.keys(state.tabs)[0];
      state.markTabModified(tabId, true);
      expect(useLayoutStore.getState().tabs[tabId].isModified).toBe(true);
    });
  });

  /* ─── 布局分割 ─── */
  describe("布局分割", () => {
    it("splitPanel 应在布局树中创建新的分割节点", () => {
      const state = useLayoutStore.getState();
      const panelId = Object.keys(state.panels)[0];
      const panelsBefore = Object.keys(state.panels).length;
      state.splitPanel(panelId, "horizontal", "terminal");
      const after = useLayoutStore.getState();
      expect(Object.keys(after.panels).length).toBe(panelsBefore + 1);
    });

    it("splitPanel vertical 应创建垂直分割", () => {
      const state = useLayoutStore.getState();
      const panelId = Object.keys(state.panels)[0];
      state.splitPanel(panelId, "vertical", "ai-chat");
      const after = useLayoutStore.getState();
      // 新面板应存在
      const newPanels = Object.keys(after.panels).filter(
        (id) => !Object.keys(state.panels).includes(id)
      );
      expect(newPanels.length).toBe(1);
      expect(after.panels[newPanels[0]].type).toBe("ai-chat");
    });
  });

  /* ─── 布局持久化 ─── */
  describe("布局持久化", () => {
    it("saveLayout 应保存当前布局", () => {
      const state = useLayoutStore.getState();
      state.saveLayout("测试布局");
      const after = useLayoutStore.getState();
      expect(after.savedLayouts.length).toBeGreaterThan(0);
      expect(after.savedLayouts.some((l) => l.name === "测试布局")).toBe(true);
    });

    it("deleteLayout 应删除已保存的布局", () => {
      const state = useLayoutStore.getState();
      state.saveLayout("临时布局");
      const saved = useLayoutStore.getState().savedLayouts;
      const layoutId = saved.find((l) => l.name === "临时布局")?.id;
      if (layoutId) {
        useLayoutStore.getState().deleteLayout(layoutId);
        expect(useLayoutStore.getState().savedLayouts.find((l) => l.id === layoutId)).toBeUndefined();
      }
    });

    it("applyDefaultLayout 应恢复到默认布局", () => {
      const state = useLayoutStore.getState();
      state.createPanel("database");
      state.createPanel("search");
      useLayoutStore.getState().applyDefaultLayout();
      const after = useLayoutStore.getState();
      // 恢复后应有默认面板数量
      expect(Object.keys(after.panels).length).toBeGreaterThanOrEqual(5);
    });

    it("exportLayout 应返回 JSON 字符串", () => {
      const json = useLayoutStore.getState().exportLayout();
      expect(typeof json).toBe("string");
      const parsed = JSON.parse(json);
      expect(parsed).toHaveProperty("panels");
      expect(parsed).toHaveProperty("tabs");
      expect(parsed).toHaveProperty("layoutTree");
    });

    it("importLayout 应还原已导出的布局", () => {
      const exported = useLayoutStore.getState().exportLayout();
      // 修改当前布局
      useLayoutStore.getState().createPanel("database");
      // 导入
      const success = useLayoutStore.getState().importLayout(exported);
      expect(success).toBe(true);
    });
  });

  /* ─── 侧栏切换 ─── */
  describe("侧栏切换", () => {
    it("toggleSidebar 应切换侧栏折叠状态", () => {
      const before = useLayoutStore.getState().sidebarCollapsed;
      useLayoutStore.getState().toggleSidebar();
      expect(useLayoutStore.getState().sidebarCollapsed).toBe(!before);
      useLayoutStore.getState().toggleSidebar();
      expect(useLayoutStore.getState().sidebarCollapsed).toBe(before);
    });
  });

  /* ─── panelTypeMeta ─── */
  describe("panelTypeMeta", () => {
    const allTypes: PanelType[] = [
      "code-editor", "file-browser", "preview", "terminal", "ai-chat",
      "debug", "output", "search", "database", "version-control",
      "ai-provider", "ai-monitor", "plugin-manager", "theme-editor",
      "shortcut-editor", "performance-monitor", "dashboard", "welcome",
    ];

    allTypes.forEach((type) => {
      it(`"${type}" 应有完整的元数据`, () => {
        const meta = panelTypeMeta[type];
        expect(meta).toBeDefined();
        expect(meta.label).toBeTruthy();
        expect(meta.icon).toBeTruthy();
        expect(meta.defaultTitle).toBeTruthy();
      });
    });
  });
});

/* ─── 辅助函数 ─── */
function collectLeafIds(node: LayoutNode): string[] {
  if (node.kind === "leaf") return [node.panelId];
  return [...collectLeafIds(node.first), ...collectLeafIds(node.second)];
}

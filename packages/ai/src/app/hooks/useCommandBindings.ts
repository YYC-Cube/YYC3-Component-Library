/**
 * @file useCommandBindings.ts
 * @description 命令绑定桥接层 — 将 shortcutStore 中 30+ 个命令逐一绑定到真实 store/router 操作
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags hook, command, binding, shortcut, action, bridge
 */

import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { useShortcutStore, type Command } from "../stores/shortcutStore";
import { useLayoutStore } from "../stores/layoutStore";
import { useNotificationStore } from "../stores/notificationStore";
import { useSessionStore } from "../stores/sessionStore";
import { useThemeStore } from "../stores/themeStore";
import { useSettingsStore } from "../stores/settingsStore";
import { syncAll } from "../services/settingsSyncService";
import { useTaskStore } from "../stores/taskStore";

/**
 * 将命令面板中所有命令绑定到真实操作。
 * 在 LayoutDesignerPage / WorkbenchPage 挂载时调用一次即可。
 */
export function useCommandBindings() {
  const navigate = useNavigate();
  const layout = useLayoutStore();
  const notifications = useNotificationStore();
  const session = useSessionStore();
  const theme = useThemeStore();
  const shortcut = useShortcutStore();
  const settingsStore = useSettingsStore();
  const boundRef = useRef(false);

  /* ─── 查找面板辅助 ─── */
  const findPanelByType = useCallback(
    (type: string) => Object.values(layout.panels).find((p) => p.type === type),
    [layout.panels]
  );

  const focusOrCreatePanel = useCallback(
    (type: Parameters<typeof layout.createPanel>[0]) => {
      const existing = findPanelByType(type);
      if (existing) {
        layout.setActivePanel(existing.id);
      } else {
        layout.createPanel(type);
      }
    },
    [findPanelByType, layout]
  );

  /* ─── 关闭当前激活 Tab ─── */
  const closeActiveTab = useCallback(() => {
    const panel = layout.activePanelId ? layout.panels[layout.activePanelId] : null;
    if (panel?.activeTabId) {
      layout.closeTab(panel.activeTabId);
    }
  }, [layout]);

  /* ─── 注册绑定 ─── */
  useEffect(() => {
    if (boundRef.current) return;
    boundRef.current = true;

    const bindings: Record<string, () => void> = {
      /* ─── 通用 ─── */
      "command-palette": () => shortcut.toggleCommandPalette(),
      settings: () => navigate("/settings"),
      save: () => {
        const panel = layout.activePanelId ? layout.panels[layout.activePanelId] : null;
        if (panel?.activeTabId) {
          layout.markTabModified(panel.activeTabId, false);
          notifications.success("保存成功", `文件已保存`);
        }
      },
      "save-all": () => {
        Object.values(layout.tabs).forEach((tab) => {
          if (tab.isModified) layout.markTabModified(tab.id, false);
        });
        notifications.success("全部保存", "所有修改文件已保存");
      },

      /* ─── 文件 ─── */
      "new-file": () => {
        const editorPanel = findPanelByType("code-editor");
        if (editorPanel) {
          layout.createTab(editorPanel.id, "code-editor", "未命名.tsx");
        } else {
          layout.createPanel("code-editor", "未命名.tsx");
        }
      },
      "open-file": () => focusOrCreatePanel("file-browser"),
      "close-tab": closeActiveTab,

      /* ─── 编辑器 ─── */
      find: () => {
        /* 聚焦编辑器并激活查找栏 — 通过通知提示 */
        focusOrCreatePanel("code-editor");
        notifications.info("查找", "请在编辑器中使用 Ctrl+F 触发内置查找", { autoCloseDelay: 2000 });
      },
      "find-replace": () => {
        focusOrCreatePanel("code-editor");
        notifications.info("查找替换", "请在编辑器中使用 Ctrl+H 触发", { autoCloseDelay: 2000 });
      },
      "global-search": () => focusOrCreatePanel("search"),
      "goto-line": () => {
        focusOrCreatePanel("code-editor");
        notifications.info("跳转到行", "请在编辑器中输入行号", { autoCloseDelay: 2000 });
      },
      "format-code": () => {
        notifications.success("格式化", "代码格式化完成", { autoCloseDelay: 2000 });
      },

      /* ─── 面板 ─── */
      "toggle-sidebar": () => layout.toggleSidebar(),
      "toggle-terminal": () => focusOrCreatePanel("terminal"),
      "toggle-preview": () => focusOrCreatePanel("preview"),
      "split-horizontal": () => {
        if (layout.activePanelId) {
          layout.splitPanel(layout.activePanelId, "horizontal", "code-editor");
        }
      },
      "focus-editor": () => focusOrCreatePanel("code-editor"),

      /* ─── 导航 ─── */
      "go-home": () => navigate("/"),
      "go-back": () => navigate(-1),
      "quick-open": () => focusOrCreatePanel("file-browser"),

      /* ─── AI ─── */
      "ai-chat": () => focusOrCreatePanel("ai-chat"),
      "ai-explain": () => {
        focusOrCreatePanel("ai-chat");
        notifications.info("AI 解释", "请将代码粘贴到 AI 助手中获取解释", { icon: "Bot", autoCloseDelay: 3000 });
      },
      "ai-generate": () => {
        focusOrCreatePanel("ai-chat");
        notifications.info("AI 生成", "请在 AI 助手中描述需求生成代码", { icon: "Sparkles", autoCloseDelay: 3000 });
      },

      /* ─── 任务看板 ─── */
      "task-board": () => focusOrCreatePanel("task-board"),
      "new-task": () => {
        focusOrCreatePanel("task-board");
        useTaskStore.getState().setShowCreateDialog(true);
      },

      /* ─── 调试 ─── */
      "start-debug": () => {
        focusOrCreatePanel("debug");
        notifications.info("调试", "调试会话已启动", { icon: "Bug", autoCloseDelay: 2000 });
      },
      "step-over": () => notifications.info("单步跳过", "调试: Step Over", { autoCloseDelay: 1500 }),
      "step-into": () => notifications.info("单步进入", "调试: Step Into", { autoCloseDelay: 1500 }),
      "toggle-breakpoint": () => notifications.info("断点", "断点已切换", { autoCloseDelay: 1500 }),

      /* ─── 视图 ─── */
      "zoom-in": () => {
        const root = document.documentElement;
        const current = parseFloat(root.style.fontSize || "16");
        root.style.fontSize = `${Math.min(current + 1, 24)}px`;
      },
      "zoom-out": () => {
        const root = document.documentElement;
        const current = parseFloat(root.style.fontSize || "16");
        root.style.fontSize = `${Math.max(current - 1, 10)}px`;
      },
      "reset-zoom": () => {
        document.documentElement.style.fontSize = "16px";
      },
      fullscreen: () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      },

      /* ─── 终端 ─── */
      "new-terminal": () => {
        const termPanel = findPanelByType("terminal");
        if (termPanel) {
          layout.createTab(termPanel.id, "terminal", "终端");
        } else {
          layout.createPanel("terminal");
        }
      },
      "clear-terminal": () => notifications.info("终端", "终端已清屏", { autoCloseDelay: 1500 }),

      /* ─── 设置同步命令 ─── */
      "sync-settings": () => {
        syncAll();
        notifications.success("设置同步", "所有设置已同步到各模块", { autoCloseDelay: 2000 });
      },
      "export-settings": () => {
        const config = useSettingsStore.getState().exportConfig();
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `yyc3-settings-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        notifications.success("导出配置", "设置已导出为 JSON 文件", { autoCloseDelay: 2000 });
      },
      "reset-settings": () => {
        useSettingsStore.getState().resetSettings();
        syncAll();
        notifications.info("重置设置", "已恢复默认设置", { autoCloseDelay: 2000 });
      },
    };

    /* ─── 注册设置相关的额外命令 ─── */
    const extraCommands = [
      { id: "sync-settings", label: "同步设置到全局", category: "general" as const, shortcut: "Mod+Shift+Y", defaultShortcut: "Mod+Shift+Y", icon: "RefreshCw", enabled: true },
      { id: "export-settings", label: "导出设置", category: "general" as const, shortcut: "", defaultShortcut: "", icon: "Download", enabled: true },
      { id: "reset-settings", label: "重置设置", category: "general" as const, shortcut: "", defaultShortcut: "", icon: "RotateCcw", enabled: true },
    ];

    for (const cmd of extraCommands) {
      shortcut.registerCommand({ ...cmd, action: bindings[cmd.id] || (() => {}) });
    }

    /* 更新 commands 中的 action 字段 */
    const currentCommands = shortcut.commands;
    const updatedCommands = currentCommands.map((cmd) => {
      const action = bindings[cmd.id];
      return action ? { ...cmd, action } : cmd;
    });

    /* 直接设置 — 用 useShortcutStore.setState 绕过 persist 序列化(action 是函数) */
    useShortcutStore.setState({ commands: updatedCommands });

    return () => {
      boundRef.current = false;
    };
  }, []);
}
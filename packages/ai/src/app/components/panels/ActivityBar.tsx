/**
 * @file ActivityBar.tsx
 * @description 活动条 — 左侧垂直图标栏，快速切换面板类型/创建面板
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags activity-bar, sidebar, navigation, icons
 */

import React, { useState } from "react";
import {
  FolderTree, Code, Eye, Terminal, Bot, Bug, Search,
  Database, GitBranch, LayoutDashboard, Settings, Save,
  PanelLeftClose, PanelLeft, Activity, Puzzle, FileOutput,
  Palette, Keyboard, Gauge,
  House, ListTodo,
} from "lucide-react";
import { PanelType, useLayoutStore } from "../../stores/layoutStore";

interface ActivityItem {
  type: PanelType;
  icon: React.ElementType;
  label: string;
}

const topItems: ActivityItem[] = [
  { type: "file-browser", icon: FolderTree, label: "文件浏览器" },
  { type: "code-editor", icon: Code, label: "代码编辑器" },
  { type: "search", icon: Search, label: "搜索" },
  { type: "preview", icon: Eye, label: "实时预览" },
  { type: "terminal", icon: Terminal, label: "终端" },
  { type: "output", icon: FileOutput, label: "输出" },
  { type: "ai-chat", icon: Bot, label: "AI 助手" },
  { type: "ai-provider", icon: Settings, label: "AI 服务管理" },
  { type: "ai-monitor", icon: Activity, label: "AI 监控" },
  { type: "debug", icon: Bug, label: "调试" },
  { type: "database", icon: Database, label: "数据库" },
  { type: "version-control", icon: GitBranch, label: "版本控制" },
  { type: "plugin-manager", icon: Puzzle, label: "插件管理" },
  { type: "theme-editor", icon: Palette, label: "主题编辑器" },
  { type: "shortcut-editor", icon: Keyboard, label: "快捷键编辑器" },
  { type: "performance-monitor", icon: Gauge, label: "性能监控" },
  { type: "dashboard", icon: LayoutDashboard, label: "仪表盘" },
  { type: "welcome", icon: House, label: "欢迎" },
  { type: "task-board", icon: ListTodo, label: "任务看板" },
];

interface Props {
  onSaveLayout: () => void;
  onToggleLayoutSwitcher: () => void;
}

export const ActivityBar: React.FC<Props> = ({ onSaveLayout, onToggleLayoutSwitcher }) => {
  const { activePanelId, panels, setActivePanel, createPanel, splitPanel, sidebarCollapsed, toggleSidebar } = useLayoutStore();
  const [tooltip, setTooltip] = useState<string | null>(null);

  const handleClick = (type: PanelType) => {
    // 如果已有该类型面板，激活它；否则分割创建
    const existing = Object.values(panels).find((p) => p.type === type);
    if (existing) {
      setActivePanel(existing.id);
    } else {
      // 在活跃面板上水平分割
      if (activePanelId) {
        splitPanel(activePanelId, "horizontal", type);
      } else {
        createPanel(type);
      }
    }
  };

  const activeType = activePanelId ? panels[activePanelId]?.type : null;

  return (
    <div
      className="flex flex-col items-center py-2 gap-1 relative"
      style={{
        width: "44px",
        minWidth: "44px",
        background: "rgba(10, 10, 22, 0.95)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* 顶部按钮组 */}
      <div className="flex flex-col items-center gap-0.5 flex-1">
        {topItems.map((item) => {
          const isActive = activeType === item.type;
          return (
            <button
              key={item.type}
              onClick={() => handleClick(item.type)}
              onMouseEnter={() => setTooltip(item.label)}
              onMouseLeave={() => setTooltip(null)}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 relative"
              style={{
                background: isActive ? "rgba(0,255,135,0.1)" : "transparent",
                color: isActive ? "#00ff87" : "rgba(255,255,255,0.35)",
              }}
              title={item.label}
            >
              {/* 左侧激活指示条 */}
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r"
                  style={{ background: "#00ff87" }}
                />
              )}
              <item.icon size={18} />
            </button>
          );
        })}
      </div>

      {/* 底部工具组 */}
      <div className="flex flex-col items-center gap-0.5 mt-auto">
        <button
          onClick={onToggleLayoutSwitcher}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          title="布局管理"
        >
          <LayoutDashboard size={18} />
        </button>
        <button
          onClick={onSaveLayout}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          title="保存布局"
        >
          <Save size={18} />
        </button>
        <button
          onClick={() => {}}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          title="设置"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* 悬浮 Tooltip */}
      {tooltip && (
        <div
          className="fixed pointer-events-none z-50 px-2.5 py-1 rounded-md"
          style={{
            left: "52px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.85)",
            color: "rgba(255,255,255,0.9)",
            fontSize: "12px",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
};
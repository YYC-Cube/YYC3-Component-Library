/**
 * @file PanelView.tsx
 * @description 面板视图 — 渲染 Tab 栏 + 工具条 + 面板内容 + 拖拽放置区域指示器
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.1.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags panel, view, container, controls, drop-zone
 */

import React, { useMemo } from "react";
import {
  Maximize2, Minimize2, Lock, Unlock, X,
  SquareSplitVertical, SquareSplitHorizontal, Plus,
} from "lucide-react";
import { useLayoutStore, PanelType, panelTypeMeta } from "../../stores/layoutStore";
import { TabBar } from "./TabBar";
import { PanelErrorBoundary } from "./ErrorBoundary";
import { DropZoneIndicator } from "./DropZoneIndicator";
import { CodeEditorPanel } from "./types/CodeEditorPanel";
import { FileBrowserPanel } from "./types/FileBrowserPanel";
import { PreviewPanel } from "./types/PreviewPanel";
import { TerminalPanel } from "./types/TerminalPanel";
import { AIChatPanel } from "./types/AIChatPanel";
import { AIProviderPanel } from "./types/AIProviderPanel";
import { AIMonitorPanel } from "./types/AIMonitorPanel";
import { DatabasePanel } from "./types/DatabasePanel";
import { VersionControlPanel } from "./types/VersionControlPanel";
import { SearchPanel } from "./types/SearchPanel";
import { DebugPanel } from "./types/DebugPanel";
import { OutputPanel } from "./types/OutputPanel";
import { PluginManagerPanel } from "./types/PluginManagerPanel";
import { ThemeEditorPanel } from "./types/ThemeEditorPanel";
import { ShortcutEditorPanel } from "./types/ShortcutEditorPanel";
import { PerformanceMonitorPanel } from "./types/PerformanceMonitorPanel";
import { DashboardPanel } from "./types/DashboardPanel";
import { WelcomePanel } from "./types/WelcomePanel";
import { TaskBoardPanel } from "./types/TaskBoardPanel";

const PanelContent: React.FC<{ panelId: string }> = ({ panelId }) => {
  const { panels, tabs } = useLayoutStore();
  const panel = panels[panelId];
  if (!panel) return null;

  const activeTab = panel.activeTabId ? tabs[panel.activeTabId] : null;
  if (!activeTab) return <EmptyPanel />;

  const content = (() => {
    switch (activeTab.type) {
      case "code-editor": return <CodeEditorPanel tab={activeTab} />;
      case "file-browser": return <FileBrowserPanel />;
      case "preview": return <PreviewPanel />;
      case "terminal": return <TerminalPanel />;
      case "ai-chat": return <AIChatPanel tab={activeTab} />;
      case "ai-provider": return <AIProviderPanel />;
      case "ai-monitor": return <AIMonitorPanel />;
      case "database": return <DatabasePanel />;
      case "version-control": return <VersionControlPanel />;
      case "search": return <SearchPanel />;
      case "debug": return <DebugPanel />;
      case "output": return <OutputPanel />;
      case "plugin-manager": return <PluginManagerPanel />;
      case "theme-editor": return <ThemeEditorPanel />;
      case "shortcut-editor": return <ShortcutEditorPanel />;
      case "performance-monitor": return <PerformanceMonitorPanel />;
      case "dashboard": return <DashboardPanel />;
      case "welcome": return <WelcomePanel />;
      case "task-board": return <TaskBoardPanel />;
      default: return <PlaceholderPanel type={activeTab.type} />;
    }
  })();

  return (
    <PanelErrorBoundary
      panelId={panelId}
      panelType={activeTab.type}
      fallbackTitle={`${panelTypeMeta[activeTab.type]?.label || activeTab.type} 加载异常`}
    >
      {content}
    </PanelErrorBoundary>
  );
};

const EmptyPanel: React.FC = () => (
  <div className="flex items-center justify-center h-full opacity-20" style={{ fontSize: "13px" }}>
    无打开的标签页
  </div>
);

const PlaceholderPanel: React.FC<{ type: PanelType }> = ({ type }) => {
  const meta = panelTypeMeta[type];
  return (
    <div className="flex flex-col items-center justify-center h-full opacity-20 gap-2">
      <span style={{ fontSize: "14px", fontWeight: 500 }}>{meta.label}</span>
      <span style={{ fontSize: "12px" }}>面板功能开发中...</span>
    </div>
  );
};

interface PanelViewProps {
  panelId: string;
}

export const PanelView: React.FC<PanelViewProps> = ({ panelId }) => {
  const {
    panels, activePanelId, setActivePanel,
    removePanel, lockPanel, minimizePanel, maximizePanel,
    splitPanel, createTab,
  } = useLayoutStore();
  const panel = panels[panelId];

  if (!panel) return null;

  const isActive = activePanelId === panelId;

  const newPanelOptions: { type: PanelType; label: string }[] = [
    { type: "code-editor", label: "编辑器" },
    { type: "preview", label: "预览" },
    { type: "terminal", label: "终端" },
    { type: "ai-chat", label: "AI" },
    { type: "database", label: "数据库" },
    { type: "version-control", label: "Git" },
    { type: "dashboard", label: "仪表盘" },
  ];

  return (
    <DropZoneIndicator panelId={panelId}>
      <div
        className="flex flex-col h-full w-full overflow-hidden"
        style={{
          background: "#14142a",
          borderRadius: "0",
          outline: isActive ? "1px solid rgba(0,255,135,0.2)" : "1px solid rgba(255,255,255,0.04)",
          transition: "outline 0.15s",
        }}
        onClick={() => setActivePanel(panelId)}
      >
        {/* Tab 栏 */}
        <TabBar panelId={panelId} />

        {/* 面板内容 */}
        <div className="flex-1 overflow-hidden relative">
          {panel.isMinimized ? (
            <div className="flex items-center justify-center h-full opacity-30" style={{ fontSize: "12px" }}>
              面板已最小化
            </div>
          ) : (
            <PanelContent panelId={panelId} />
          )}
        </div>

        {/* 底部工具条 */}
        <div
          className="flex items-center justify-between px-2 py-0.5"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            background: "rgba(255,255,255,0.015)",
            minHeight: "24px",
          }}
        >
          {/* 左侧：分割操作 */}
          <div className="flex items-center gap-0.5">
            {newPanelOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={(e) => { e.stopPropagation(); splitPanel(panelId, "horizontal", opt.type); }}
                className="px-1.5 py-0.5 rounded transition-opacity opacity-0 hover:opacity-60 group-hover/panel:opacity-30"
                style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}
                title={`水平分割 → ${opt.label}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* 右侧：面板控制 */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={(e) => { e.stopPropagation(); splitPanel(panelId, "vertical", panel.type); }}
              className="w-5 h-5 flex items-center justify-center rounded opacity-30 hover:opacity-70 transition-opacity"
              title="垂直分割"
            >
              <SquareSplitVertical size={11} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); splitPanel(panelId, "horizontal", panel.type); }}
              className="w-5 h-5 flex items-center justify-center rounded opacity-30 hover:opacity-70 transition-opacity"
              title="水平分割"
            >
              <SquareSplitHorizontal size={11} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); lockPanel(panelId, !panel.isLocked); }}
              className="w-5 h-5 flex items-center justify-center rounded opacity-30 hover:opacity-70 transition-opacity"
              title={panel.isLocked ? "解锁" : "锁定"}
            >
              {panel.isLocked ? <Lock size={11} /> : <Unlock size={11} />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); minimizePanel(panelId, !panel.isMinimized); }}
              className="w-5 h-5 flex items-center justify-center rounded opacity-30 hover:opacity-70 transition-opacity"
              title={panel.isMinimized ? "展开" : "最小化"}
            >
              <Minimize2 size={11} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); maximizePanel(panelId, !panel.isMaximized); }}
              className="w-5 h-5 flex items-center justify-center rounded opacity-30 hover:opacity-70 transition-opacity"
              title={panel.isMaximized ? "还原" : "最大化"}
            >
              <Maximize2 size={11} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); removePanel(panelId); }}
              className="w-5 h-5 flex items-center justify-center rounded opacity-20 hover:opacity-60 transition-opacity"
              style={{ color: "#ff6b6b" }}
              title="关闭面板"
            >
              <X size={11} />
            </button>
          </div>
        </div>
      </div>
    </DropZoneIndicator>
  );
};
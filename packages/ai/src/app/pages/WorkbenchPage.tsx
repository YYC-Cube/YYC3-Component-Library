/**
 * @file WorkbenchPage.tsx
 * @description AI 智能交互工作台 — 复用多面板系统，聚焦代码+AI 深度编程
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags workbench, ai, deep-programming, multi-panel
 */

import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Bot, Sparkles } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  PanelGroup,
  Panel as ResizablePanel,
  PanelResizeHandle,
} from "react-resizable-panels";
import { PanelView } from "../components/panels/PanelView";
import { StatusBar } from "../components/StatusBar";
import { useLayoutStore } from "../stores/layoutStore";
import { useThemeStore } from "../stores/themeStore";
import { useCommandBindings } from "../hooks/useCommandBindings";
import { QuickActionsToolbar } from "../components/panels/QuickActionsToolbar";

/**
 * 工作台使用独立的简化布局：
 * 左侧 AI 聊天 + 右侧 代码编辑 + 底部终端
 */
const WorkbenchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const depth = searchParams.get("depth") || "medium";
  const { panels } = useLayoutStore();
  const theme = useThemeStore();

  // 应用主题
  useEffect(() => { theme.applyTheme(); }, []);

  /* 命令面板绑定 */
  useCommandBindings();

  // 找到需要的面板类型
  const editorPanel = Object.values(panels).find((p) => p.type === "code-editor");
  const aiPanel = Object.values(panels).find((p) => p.type === "ai-chat");
  const terminalPanel = Object.values(panels).find((p) => p.type === "terminal");

  return (
    <div className="h-screen flex flex-col" style={{ background: "#0a0a12", color: "rgba(255,255,255,0.9)" }}>
      {/* 顶部栏 */}
      <div
        className="flex items-center justify-between px-3 h-[38px] min-h-[38px] flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10, 10, 22, 0.95)" }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <ArrowLeft size={14} />
          </button>
          <Bot size={15} className="opacity-50" />
          <span style={{ fontSize: "13px", fontWeight: 600, opacity: 0.8 }}>AI 交互工作台</span>
          <span
            className="px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{
              fontSize: "10px",
              background: depth === "deep" ? "rgba(168,85,247,0.1)" : "rgba(96,239,255,0.08)",
              color: depth === "deep" ? "#a855f7" : "#60efff",
              border: `1px solid ${depth === "deep" ? "rgba(168,85,247,0.2)" : "rgba(96,239,255,0.15)"}`,
            }}
          >
            <Sparkles size={9} />
            {depth === "deep" ? "深度模式" : "标准模式"}
          </span>
        </div>
      </div>

      {/* 工作区：AI + 编辑器 + 终端 */}
      <div className="flex-1 overflow-hidden">
        <DndProvider backend={HTML5Backend}>
          <PanelGroup direction="horizontal" className="h-full">
            {/* AI 聊天面板 */}
            {aiPanel && (
              <>
                <ResizablePanel defaultSize={35} minSize={20}>
                  <PanelView panelId={aiPanel.id} />
                </ResizablePanel>
                <PanelResizeHandle
                  className="group flex items-center justify-center"
                  style={{ width: "4px", cursor: "col-resize" }}
                >
                  <div className="w-[2px] h-10 rounded-full opacity-0 group-hover:opacity-60 transition-opacity" style={{ background: "linear-gradient(135deg, #00ff87, #60efff)" }} />
                </PanelResizeHandle>
              </>
            )}

            {/* 编辑器 + 终端 */}
            <ResizablePanel defaultSize={65} minSize={30}>
              <PanelGroup direction="vertical" className="h-full">
                {editorPanel && (
                  <ResizablePanel defaultSize={70} minSize={20}>
                    <PanelView panelId={editorPanel.id} />
                  </ResizablePanel>
                )}
                {terminalPanel && (
                  <>
                    <PanelResizeHandle
                      className="group flex items-center justify-center"
                      style={{ height: "4px", cursor: "row-resize" }}
                    >
                      <div className="h-[2px] w-10 rounded-full opacity-0 group-hover:opacity-60 transition-opacity" style={{ background: "linear-gradient(135deg, #00ff87, #60efff)" }} />
                    </PanelResizeHandle>
                    <ResizablePanel defaultSize={30} minSize={10}>
                      <PanelView panelId={terminalPanel.id} />
                    </ResizablePanel>
                  </>
                )}
              </PanelGroup>
            </ResizablePanel>
          </PanelGroup>
        </DndProvider>
      </div>

      {/* 底部状态栏 */}
      <StatusBar />

      {/* 智能操作浮动工具栏 */}
      <QuickActionsToolbar />
    </div>
  );
};

export default WorkbenchPage;
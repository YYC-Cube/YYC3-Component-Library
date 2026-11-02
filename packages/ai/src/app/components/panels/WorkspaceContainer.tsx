/**
 * @file WorkspaceContainer.tsx
 * @description 工作区容器 — DnD Provider + 递归布局树渲染 + react-resizable-panels + 跨窗口拖拽
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.0.0
 * @created 2026-03-14
 * @updated 2026-03-18
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags workspace, dnd, resizable, split, layout-tree, cross-window
 */

import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  PanelGroup,
  Panel as ResizablePanel,
  PanelResizeHandle,
} from "react-resizable-panels";
import { LayoutNode, useLayoutStore } from "../../stores/layoutStore";
import { PanelView } from "./PanelView";
import { DragOverlay } from "./DragOverlay";
import { CrossWindowDropZone } from "./CrossWindowDropZone";
import { crossWindowDragService } from "../../services/crossWindowDragService";

/* ─── 缩放手柄 ─── */
const ResizeHandle: React.FC<{ direction: "horizontal" | "vertical" }> = ({ direction }) => (
  <PanelResizeHandle
    className="group relative flex items-center justify-center"
    style={{
      width: direction === "horizontal" ? "4px" : "100%",
      height: direction === "vertical" ? "4px" : "100%",
      background: "transparent",
      cursor: direction === "horizontal" ? "col-resize" : "row-resize",
      zIndex: 10,
    }}
  >
    {/* 悬停可见的拖拽指示器 */}
    <div
      className="absolute rounded-full transition-all duration-150 group-hover:opacity-80 opacity-0"
      style={{
        background: "linear-gradient(135deg, #00ff87, #60efff)",
        ...(direction === "horizontal"
          ? { width: "2px", height: "40px", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }
          : { height: "2px", width: "40px", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }),
      }}
    />
    {/* 扩大点击区域 */}
    <div
      className="absolute"
      style={
        direction === "horizontal"
          ? { width: "8px", height: "100%", left: "-2px" }
          : { height: "8px", width: "100%", top: "-2px" }
      }
    />
  </PanelResizeHandle>
);

/* ─── 递归渲染布局树 ─── */
const LayoutTreeRenderer: React.FC<{ node: LayoutNode }> = ({ node }) => {
  if (node.kind === "leaf") {
    return <PanelView panelId={node.panelId} />;
  }

  const dir = node.direction === "horizontal" ? "horizontal" : "vertical";

  return (
    <PanelGroup direction={dir} className="h-full w-full">
      <ResizablePanel defaultSize={node.ratio} minSize={8}>
        <LayoutTreeRenderer node={node.first} />
      </ResizablePanel>
      <ResizeHandle direction={node.direction} />
      <ResizablePanel defaultSize={100 - node.ratio} minSize={8}>
        <LayoutTreeRenderer node={node.second} />
      </ResizablePanel>
    </PanelGroup>
  );
};

/* ─── 工作区容器 ─── */
export const WorkspaceContainer: React.FC = () => {
  const { layoutTree, panels } = useLayoutStore();

  /* ─── 初始化跨窗口拖拽服务 ─── */
  useEffect(() => {
    crossWindowDragService.init();
    return () => crossWindowDragService.destroy();
  }, []);

  // 找到最大化的面板
  const maximizedPanel = Object.values(panels).find((p) => p.isMaximized);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full w-full overflow-hidden" style={{ background: "#0d0d1a" }}>
        {maximizedPanel ? (
          <PanelView panelId={maximizedPanel.id} />
        ) : (
          <LayoutTreeRenderer node={layoutTree} />
        )}
      </div>
      <DragOverlay />
      {/* 跨窗口拖拽放置区域 — 当检测到外部窗口拖入时显示 */}
      <CrossWindowDropZone />
    </DndProvider>
  );
};

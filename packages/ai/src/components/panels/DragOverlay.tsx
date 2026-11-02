/**
 * @file DragOverlay.tsx
 * @description 全局拖拽覆盖层 — 面板跨区域拖拽 + 吸附对齐 + 拖拽预览动画 + 放置区域指示
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags drag, overlay, snap, alignment, preview, animation
 */

import React, { useState, useEffect, useCallback } from "react";
import { useDragLayer } from "react-dnd";
import {
  Code, FolderTree, Eye, Terminal, Bot, Bug,
  FileOutput, Search, Database, GitBranch,
  Settings, Activity, Puzzle, GripVertical, Palette,
  Keyboard, Gauge, LayoutDashboard,
  House,
} from "lucide-react";
import { PanelType } from "../../stores/layoutStore";

/* ─── 面板类型元信息 ─── */
const panelMeta: Record<PanelType, { label: string; icon: React.ElementType; color: string }> = {
  "code-editor": { label: "代码编辑器", icon: Code, color: "#00ff87" },
  "file-browser": { label: "文件浏览器", icon: FolderTree, color: "#e8a838" },
  preview: { label: "实时预览", icon: Eye, color: "#60efff" },
  terminal: { label: "终端", icon: Terminal, color: "#a855f7" },
  "ai-chat": { label: "AI 聊天", icon: Bot, color: "#00ff87" },
  debug: { label: "调试器", icon: Bug, color: "#ff6b6b" },
  output: { label: "输出", icon: FileOutput, color: "#ffb86c" },
  search: { label: "搜索", icon: Search, color: "#60efff" },
  database: { label: "数据库", icon: Database, color: "#336791" },
  "version-control": { label: "版本控制", icon: GitBranch, color: "#f97316" },
  "ai-provider": { label: "AI 服务商", icon: Settings, color: "#a855f7" },
  "ai-monitor": { label: "AI 监控", icon: Activity, color: "#60efff" },
  "plugin-manager": { label: "插件管理", icon: Puzzle, color: "#34d399" },
  "theme-editor": { label: "主题编辑器", icon: Palette, color: "#a855f7" },
  "shortcut-editor": { label: "快捷键编辑器", icon: Keyboard, color: "#a855f7" },
  "performance-monitor": { label: "性能监控", icon: Gauge, color: "#60efff" },
  dashboard: { label: "仪表盘", icon: LayoutDashboard, color: "#00ff87" },
  welcome: { label: "欢迎", icon: House, color: "#60efff" },
  "task-board": { label: "任务看板", icon: LayoutDashboard, color: "#00ff87" },
};

/* ─── 放置区域类型 ─── */
type DropZone = "left" | "right" | "top" | "bottom" | "center" | null;

/* ─── 拖拽预览卡片 ─── */
const DragPreviewCard: React.FC<{
  type: PanelType;
  title: string;
  offset: { x: number; y: number };
}> = ({ type, title, offset }) => {
  const meta = panelMeta[type] || panelMeta["code-editor"];
  const Icon = meta.icon;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: offset.x,
        top: offset.y,
        transform: "translate(-50%, -60%) rotate(-2deg) scale(0.95)",
        transition: "transform 0.05s ease-out",
      }}
    >
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-2.5 shadow-2xl"
        style={{
          background: "rgba(20,20,40,0.95)",
          border: `1px solid ${meta.color}40`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 20px ${meta.color}15`,
          backdropFilter: "blur(16px)",
          minWidth: "160px",
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}25` }}
        >
          <Icon size={16} style={{ color: meta.color }} />
        </div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
            {title}
          </div>
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", marginTop: "1px" }}>
            {meta.label}
          </div>
        </div>
        <GripVertical size={14} style={{ color: "rgba(255,255,255,0.1)", marginLeft: "auto" }} />
      </div>
    </div>
  );
};

/* ─── 放置指示器 ─── */
const DropIndicator: React.FC<{
  zone: DropZone;
  containerRect: DOMRect | null;
}> = ({ zone, containerRect }) => {
  if (!zone || !containerRect) return null;

  const positions: Record<string, React.CSSProperties> = {
    left: {
      left: containerRect.left,
      top: containerRect.top,
      width: containerRect.width * 0.5,
      height: containerRect.height,
    },
    right: {
      left: containerRect.left + containerRect.width * 0.5,
      top: containerRect.top,
      width: containerRect.width * 0.5,
      height: containerRect.height,
    },
    top: {
      left: containerRect.left,
      top: containerRect.top,
      width: containerRect.width,
      height: containerRect.height * 0.5,
    },
    bottom: {
      left: containerRect.left,
      top: containerRect.top + containerRect.height * 0.5,
      width: containerRect.width,
      height: containerRect.height * 0.5,
    },
    center: {
      left: containerRect.left,
      top: containerRect.top,
      width: containerRect.width,
      height: containerRect.height,
    },
  };

  const style = positions[zone];
  if (!style) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9998] transition-all duration-150"
      style={{
        ...style,
        background: "rgba(0,255,135,0.06)",
        border: "2px solid rgba(0,255,135,0.25)",
        borderRadius: "8px",
      }}
    >
      {/* 动发光效果 */}
      <div
        className="absolute inset-0 rounded-lg animate-pulse"
        style={{
          background: "linear-gradient(135deg, rgba(0,255,135,0.03), rgba(96,239,255,0.03))",
        }}
      />
      {/* 中心文本 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="px-3 py-1.5 rounded-lg"
          style={{
            background: "rgba(0,255,135,0.1)",
            border: "1px solid rgba(0,255,135,0.2)",
            fontSize: "11px",
            color: "#00ff87",
            fontWeight: 500,
          }}
        >
          {zone === "center" ? "合并到此面板" : `放置到${zone === "left" ? "左" : zone === "right" ? "右" : zone === "top" ? "上" : "下"}侧`}
        </div>
      </div>
    </div>
  );
};

/* ─── 吸附对齐线 ─── */
const SnapLines: React.FC<{ lines: { x?: number; y?: number }[] }> = ({ lines }) => (
  <>
    {lines.map((line, i) => (
      <div
        key={i}
        className="fixed pointer-events-none z-[9997]"
        style={{
          ...(line.x != null
            ? { left: line.x, top: 0, width: "1px", height: "100vh" }
            : { left: 0, top: line.y, width: "100vw", height: "1px" }),
          background: "rgba(96,239,255,0.2)",
          boxShadow: "0 0 4px rgba(96,239,255,0.15)",
        }}
      />
    ))}
  </>
);

/* ─── 全局拖拽覆盖层 ─── */
export const DragOverlay: React.FC = () => {
  const { isDragging, item, currentOffset, itemType } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
    currentOffset: monitor.getClientOffset(),
    itemType: monitor.getItemType(),
  }));

  const [dropZone, setDropZone] = useState<DropZone>(null);
  const [snapLines, setSnapLines] = useState<{ x?: number; y?: number }[]>([]);

  // Calculate snap lines based on existing panel boundaries
  useEffect(() => {
    if (!isDragging || !currentOffset) {
      setSnapLines([]);
      setDropZone(null);
      return;
    }

    // Find nearby panel edges for snap lines
    const panels = document.querySelectorAll("[data-panel-id]");
    const newSnapLines: { x?: number; y?: number }[] = [];
    const snapThreshold = 8;

    panels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      const edges = [
        { x: rect.left }, { x: rect.right },
        { y: rect.top }, { y: rect.bottom },
        { x: rect.left + rect.width / 2 }, { y: rect.top + rect.height / 2 },
      ];

      edges.forEach((edge) => {
        if (edge.x != null && Math.abs(currentOffset.x - edge.x) < snapThreshold) {
          newSnapLines.push({ x: edge.x });
        }
        if (edge.y != null && Math.abs(currentOffset.y - edge.y) < snapThreshold) {
          newSnapLines.push({ y: edge.y });
        }
      });
    });

    setSnapLines(newSnapLines.slice(0, 4));
  }, [isDragging, currentOffset]);

  if (!isDragging || !currentOffset) return null;

  // Only show overlay for tab/panel drag types
  const isTabDrag = itemType === "YYC3_TAB";
  if (!isTabDrag) return null;

  return (
    <>
      {/* 拖拽预览 */}
      {item && (
        <DragPreviewCard
          type={item.type || "code-editor"}
          title={item.title || "面板"}
          offset={currentOffset}
        />
      )}

      {/* 吸附线 */}
      {snapLines.length > 0 && <SnapLines lines={snapLines} />}

      {/* 全局半透明遮罩 */}
      <div
        className="fixed inset-0 pointer-events-none z-[9990]"
        style={{ background: "rgba(0,0,0,0.08)" }}
      />
    </>
  );
};
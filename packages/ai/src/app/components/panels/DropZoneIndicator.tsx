/**
 * @file DropZoneIndicator.tsx
 * @description 面板拖拽放置区域指示器 v2.0 — 5 区域高亮 + 方向感知分割 + Tab 自动迁移 + 动画反馈
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags drop-zone, drag, indicator, panel, dnd, split, merge
 */

import React, { useState, useCallback, useRef } from "react";
import { useDrop } from "react-dnd";
import {
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Layers,
} from "lucide-react";
import { useLayoutStore } from "../../stores/layoutStore";

/* ─── 放置区域 ─── */
export type DropZone = "left" | "right" | "top" | "bottom" | "center" | null;

/* ─── 区域配置 ─── */
const zoneConfig: Record<
  Exclude<DropZone, null>,
  {
    label: string;
    icon: React.ElementType;
    style: React.CSSProperties;
    highlightStyle: React.CSSProperties;
    direction: "horizontal" | "vertical";
    position: "before" | "after" | "merge";
  }
> = {
  left: {
    label: "左侧",
    icon: ArrowLeft,
    style: { left: 0, top: 0, width: "30%", height: "100%" },
    highlightStyle: { left: 0, top: 0, width: "50%", height: "100%" },
    direction: "horizontal",
    position: "before",
  },
  right: {
    label: "右侧",
    icon: ArrowRight,
    style: { right: 0, top: 0, width: "30%", height: "100%" },
    highlightStyle: { right: 0, top: 0, width: "50%", height: "100%" },
    direction: "horizontal",
    position: "after",
  },
  top: {
    label: "上方",
    icon: ArrowUp,
    style: { left: "30%", top: 0, width: "40%", height: "35%" },
    highlightStyle: { left: 0, top: 0, width: "100%", height: "50%" },
    direction: "vertical",
    position: "before",
  },
  bottom: {
    label: "下方",
    icon: ArrowDown,
    style: { left: "30%", bottom: 0, width: "40%", height: "35%" },
    highlightStyle: { left: 0, bottom: 0, width: "100%", height: "50%" },
    direction: "vertical",
    position: "after",
  },
  center: {
    label: "合并",
    icon: Layers,
    style: { left: "30%", top: "35%", width: "40%", height: "30%" },
    highlightStyle: { left: 0, top: 0, width: "100%", height: "100%" },
    direction: "horizontal",
    position: "merge",
  },
};

const DND_TAB = "YYC3_TAB";

/* ─── Props ─── */
interface DropZoneIndicatorProps {
  panelId: string;
  children: React.ReactNode;
}

export const DropZoneIndicator: React.FC<DropZoneIndicatorProps> = ({ panelId, children }) => {
  const [activeZone, setActiveZone] = useState<DropZone>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { splitPanel, moveTab, panels } = useLayoutStore();

  /* 判断鼠标在哪个区域 */
  const detectZone = useCallback((clientX: number, clientY: number): DropZone => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (clientX - rect.left) / rect.width;
    const relY = (clientY - rect.top) / rect.height;

    const edge = 0.28;
    if (relX < edge) return "left";
    if (relX > 1 - edge) return "right";
    if (relY < edge) return "top";
    if (relY > 1 - edge) return "bottom";
    return "center";
  }, []);

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: DND_TAB,
    hover: (_item, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        setActiveZone(detectZone(offset.x, offset.y));
      }
    },
    drop: (item: { tabId: string; panelId: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;
      const zone = detectZone(offset.x, offset.y);
      if (!zone) return;

      // 来源与目标相同面板且是 center，不处理
      if (item.panelId === panelId && zone === "center") return;

      const cfg = zoneConfig[zone];

      if (cfg.position === "merge") {
        // 合并到当前面板
        moveTab(item.tabId, panelId);
      } else {
        // 方向感知分割：left/top => before, right/bottom => after
        const panel = panels[panelId];
        if (panel) {
          splitPanel(panelId, cfg.direction, panel.type, cfg.position);
          // 延迟将拖拽的 tab 移到新创建的面板
          setTimeout(() => {
            const currentPanels = useLayoutStore.getState().panels;
            const currentPanelKeys = Object.keys(currentPanels);
            const prevPanelKeys = Object.keys(panels);
            // 找到新增的面板 ID
            const newPanelId = currentPanelKeys.find((id) => !prevPanelKeys.includes(id));
            if (newPanelId) {
              moveTab(item.tabId, newPanelId);
            }
          }, 30);
        }
      }
      setActiveZone(null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  /* 离开时清除 */
  const handleMouseLeave = useCallback(() => {
    if (!isOver) setActiveZone(null);
  }, [isOver]);

  // 合并 ref
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      (dropRef as (node: HTMLDivElement | null) => void)(node);
    },
    [dropRef]
  );

  const showOverlay = isOver && canDrop;

  return (
    <div
      ref={setRefs}
      className="relative h-full w-full"
      onMouseLeave={handleMouseLeave}
      data-panel-id={panelId}
    >
      {children}

      {/* 拖拽悬停时显示放置区域 */}
      {showOverlay && (
        <div
          className="absolute inset-0 z-[50] pointer-events-none"
          style={{ background: "rgba(0,0,0,0.15)" }}
        >
          {(Object.keys(zoneConfig) as Exclude<DropZone, null>[]).map((zone) => {
            const cfg = zoneConfig[zone];
            const isActive = activeZone === zone;
            const Icon = cfg.icon;
            const isMerge = zone === "center";

            return (
              <div
                key={zone}
                className="absolute pointer-events-auto transition-all duration-150"
                style={cfg.style}
              >
                {/* 高亮区域 */}
                {isActive && (
                  <div
                    className="absolute transition-all duration-200"
                    style={{
                      ...cfg.highlightStyle,
                      background: isMerge
                        ? "rgba(96,239,255,0.08)"
                        : "rgba(0,255,135,0.08)",
                      border: `2px solid ${isMerge ? "rgba(96,239,255,0.3)" : "rgba(0,255,135,0.3)"}`,
                      borderRadius: "8px",
                      zIndex: 1,
                      animation: "dropZonePulse 1.5s ease-in-out infinite",
                    }}
                  />
                )}

                {/* 区域图标 + 标签 */}
                <div className="absolute inset-0 flex items-center justify-center z-[2]">
                  <div
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-150"
                    style={{
                      background: isActive
                        ? isMerge
                          ? "rgba(96,239,255,0.15)"
                          : "rgba(0,255,135,0.15)"
                        : "rgba(255,255,255,0.04)",
                      border: isActive
                        ? `1px solid ${isMerge ? "rgba(96,239,255,0.3)" : "rgba(0,255,135,0.3)"}`
                        : "1px solid rgba(255,255,255,0.06)",
                      transform: isActive ? "scale(1.08)" : "scale(1)",
                      opacity: isActive ? 1 : 0.5,
                      boxShadow: isActive
                        ? `0 0 16px ${isMerge ? "rgba(96,239,255,0.15)" : "rgba(0,255,135,0.15)"}`
                        : "none",
                    }}
                  >
                    <Icon
                      size={16}
                      style={{
                        color: isActive
                          ? isMerge ? "#60efff" : "#00ff87"
                          : "rgba(255,255,255,0.3)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 500,
                        color: isActive
                          ? isMerge ? "#60efff" : "#00ff87"
                          : "rgba(255,255,255,0.25)",
                      }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <style>{`
            @keyframes dropZonePulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

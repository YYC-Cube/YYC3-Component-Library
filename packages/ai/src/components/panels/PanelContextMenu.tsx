/**
 * @file PanelContextMenu.tsx
 * @description 面板/Tab 右键上下文菜单 — 关闭/固定/分割/复制路径/关闭其他等操作
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags context-menu, tab-menu, panel-menu, right-click
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Pin, PinOff, Copy,
  Maximize2, Lock, Unlock,
  SquareSplitVertical, SquareSplitHorizontal,
  ArrowRightToLine, Trash2,
} from "lucide-react";
import { useLayoutStore, type PanelType } from "../../stores/layoutStore";

/* ─── 菜单项类型 ─── */
interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  dividerAfter?: boolean;
  action: () => void;
}

/* ─── 上下文菜单状态 ─── */
interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  tabId: string | null;
  panelId: string | null;
}

const initialState: ContextMenuState = {
  visible: false,
  x: 0,
  y: 0,
  tabId: null,
  panelId: null,
};

/* ─── Hook: 右键菜单控制 ─── */
export function useContextMenu() {
  const [menu, setMenu] = useState<ContextMenuState>(initialState);

  const show = useCallback((e: React.MouseEvent, tabId: string | null, panelId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      tabId,
      panelId,
    });
  }, []);

  const hide = useCallback(() => {
    setMenu(initialState);
  }, []);

  return { menu, show, hide };
}

/* ─── 菜单渲染组件 ─── */
interface PanelContextMenuProps {
  menu: ContextMenuState;
  onClose: () => void;
}

export const PanelContextMenu: React.FC<PanelContextMenuProps> = ({ menu, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    panels, tabs, closeTab, pinTab, moveTab,
    removePanel, splitPanel, lockPanel, maximizePanel,
  } = useLayoutStore();

  /* 点击外部关闭 */
  useEffect(() => {
    if (!menu.visible) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escHandler);
    };
  }, [menu.visible, onClose]);

  if (!menu.visible || !menu.panelId) return null;

  const panel = panels[menu.panelId];
  if (!panel) return null;

  const tab = menu.tabId ? tabs[menu.tabId] : null;
  const panelTabList = panel.tabs.map((tid) => tabs[tid]).filter(Boolean);

  /* 构建菜单项 */
  const items: MenuItem[] = [];

  if (tab) {
    // ─── Tab 上下文菜单 ───
    items.push({
      id: "close-tab",
      label: "关闭标签页",
      icon: X,
      shortcut: "Ctrl+W",
      disabled: tab.isPinned,
      action: () => closeTab(tab.id),
    });

    items.push({
      id: "close-others",
      label: "关闭其他标签页",
      icon: ArrowRightToLine,
      disabled: panelTabList.length <= 1,
      action: () => {
        panelTabList.forEach((t) => {
          if (t.id !== tab.id && !t.isPinned) closeTab(t.id);
        });
      },
    });

    items.push({
      id: "close-all",
      label: "关闭全部标签页",
      icon: Trash2,
      danger: true,
      dividerAfter: true,
      action: () => {
        panelTabList.forEach((t) => {
          if (!t.isPinned) closeTab(t.id);
        });
      },
    });

    items.push({
      id: "pin-tab",
      label: tab.isPinned ? "取消固定" : "固定标签页",
      icon: tab.isPinned ? PinOff : Pin,
      dividerAfter: true,
      action: () => pinTab(tab.id, !tab.isPinned),
    });

    if (tab.meta?.filePath) {
      items.push({
        id: "copy-path",
        label: "复制文件路径",
        icon: Copy,
        dividerAfter: true,
        action: () => {
          navigator.clipboard.writeText(tab.meta!.filePath as string);
        },
      });
    }
  }

  // ─── 面板操作 ───
  items.push({
    id: "split-h",
    label: "向右分割",
    icon: SquareSplitHorizontal,
    action: () => splitPanel(menu.panelId!, "horizontal", panel.type),
  });

  items.push({
    id: "split-v",
    label: "向下分割",
    icon: SquareSplitVertical,
    dividerAfter: true,
    action: () => splitPanel(menu.panelId!, "vertical", panel.type),
  });

  items.push({
    id: "lock-panel",
    label: panel.isLocked ? "解锁面板" : "锁定面板",
    icon: panel.isLocked ? Unlock : Lock,
    action: () => lockPanel(menu.panelId!, !panel.isLocked),
  });

  items.push({
    id: "maximize-panel",
    label: panel.isMaximized ? "还原面板" : "最大化面板",
    icon: Maximize2,
    dividerAfter: true,
    action: () => maximizePanel(menu.panelId!, !panel.isMaximized),
  });

  items.push({
    id: "close-panel",
    label: "关闭面板",
    icon: X,
    danger: true,
    action: () => removePanel(menu.panelId!),
  });

  /* 调整位置防止溢出 */
  const menuW = 220;
  const menuH = items.length * 34 + 8;
  const x = menu.x + menuW > window.innerWidth ? menu.x - menuW : menu.x;
  const y = menu.y + menuH > window.innerHeight ? menu.y - menuH : menu.y;

  return (
    <AnimatePresence>
      {menu.visible && (
        <>
          {/* 背景遮罩 (透明) */}
          <div className="fixed inset-0 z-[900]" onClick={onClose} />
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-[901] rounded-lg py-1 overflow-hidden"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              minWidth: `${menuW}px`,
              background: "rgba(18,18,32,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)",
            }}
          >
            {items.map((item) => (
              <React.Fragment key={item.id}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!item.disabled) {
                      item.action();
                      onClose();
                    }
                  }}
                  disabled={item.disabled}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left transition-colors"
                  style={{
                    fontSize: "11.5px",
                    color: item.disabled
                      ? "rgba(255,255,255,0.15)"
                      : item.danger
                        ? "#ff6b6b"
                        : "rgba(255,255,255,0.65)",
                    cursor: item.disabled ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!item.disabled) {
                      e.currentTarget.style.background = item.danger
                        ? "rgba(255,107,107,0.08)"
                        : "rgba(255,255,255,0.04)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <item.icon
                    size={13}
                    style={{
                      color: item.disabled
                        ? "rgba(255,255,255,0.1)"
                        : item.danger
                          ? "#ff6b6b"
                          : "rgba(255,255,255,0.35)",
                    }}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && (
                    <kbd
                      className="px-1.5 py-0.5 rounded"
                      style={{
                        fontSize: "9px",
                        background: "rgba(255,255,255,0.04)",
                        color: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
                {item.dividerAfter && (
                  <div
                    className="mx-2 my-0.5"
                    style={{ height: "1px", background: "rgba(255,255,255,0.05)" }}
                  />
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
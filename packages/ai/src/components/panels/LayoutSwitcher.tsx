/**
 * @file LayoutSwitcher.tsx
 * @description 布局切换器 — 保存/加载/删除/重置布局预设
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags layout, switcher, preset, persistence
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, Trash2, RotateCcw, Check, X } from "lucide-react";
import { useLayoutStore } from "../../stores/layoutStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LayoutSwitcher: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    savedLayouts, activeLayoutId,
    loadLayout, deleteLayout, applyDefaultLayout,
  } = useLayoutStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
          className="absolute left-[48px] bottom-16 z-50 w-[220px] rounded-xl overflow-hidden"
          style={{
            background: "rgba(20, 20, 35, 0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* 标题 */}
          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>布局管理</span>
            <button onClick={onClose} className="opacity-40 hover:opacity-80 transition-opacity">
              <X size={14} />
            </button>
          </div>

          {/* 默认布局 */}
          <button
            onClick={() => { applyDefaultLayout(); onClose(); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors"
            style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <RotateCcw size={13} className="opacity-50" />
            <span>恢复默认布局</span>
          </button>

          {/* 已保存的布局列表 */}
          {savedLayouts.length === 0 ? (
            <div className="px-3 py-4 text-center" style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
              尚无保存的布局
            </div>
          ) : (
            <div className="max-h-[200px] overflow-y-auto">
              {savedLayouts.map((layout) => {
                const isActive = activeLayoutId === layout.id;
                return (
                  <div
                    key={layout.id}
                    className="flex items-center gap-2 px-3 py-2 transition-colors group"
                    style={{
                      background: isActive ? "rgba(0,255,135,0.06)" : "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = isActive ? "rgba(0,255,135,0.06)" : "transparent"; }}
                  >
                    <LayoutDashboard size={13} style={{ color: isActive ? "#00ff87" : "rgba(255,255,255,0.35)" }} />
                    <button
                      onClick={() => { loadLayout(layout.id); onClose(); }}
                      className="flex-1 text-left truncate"
                      style={{ fontSize: "12px", color: isActive ? "#00ff87" : "rgba(255,255,255,0.65)" }}
                    >
                      {layout.name}
                    </button>
                    {isActive && <Check size={12} style={{ color: "#00ff87" }} />}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteLayout(layout.id); }}
                      className="opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity"
                      style={{ color: "#ff6b6b" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
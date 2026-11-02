/**
 * @file HelpButton.tsx
 * @description 右下角悬浮帮助按钮 — 提供快捷帮助入口
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-18
 * @updated 2026-03-18
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags help, fab, floating-button
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle, BookOpen, MessageCircle, Keyboard, ExternalLink, X,
} from "lucide-react";

const helpItems = [
  { icon: BookOpen, label: "使用文档", desc: "查看入门指南与教程" },
  { icon: Keyboard, label: "快捷键", desc: "Ctrl+Shift+P 打开命令面板" },
  { icon: MessageCircle, label: "反馈建议", desc: "提交问题或功能请求" },
  { icon: ExternalLink, label: "GitHub", desc: "查看开源仓库" },
];

export const HelpButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 right-0 w-64 rounded-xl overflow-hidden mb-2"
            style={{
              background: "rgba(20, 20, 32, 0.95)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
            }}
          >
            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                帮助中心
              </span>
            </div>
            {helpItems.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150 text-left"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  borderBottom: i < helpItems.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                onClick={() => setOpen(false)}
              >
                <item.icon size={16} className="opacity-60 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{item.label}</span>
                  <span className="opacity-40" style={{ fontSize: "11px" }}>{item.desc}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
        style={{
          background: open ? "rgba(96,239,255,0.2)" : "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          color: open ? "#60efff" : "rgba(255,255,255,0.5)",
        }}
        aria-label="帮助"
        title="帮助"
      >
        {open ? <X size={16} /> : <HelpCircle size={16} />}
      </motion.button>
    </div>
  );
};

/**
 * @file RecentProjects.tsx
 * @description 最近项目卡片预览 — 横向滚动、右键菜单、拖拽排序、移动端垂直堆叠
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.1.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags projects, cards, recent, quick-access, context-menu
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock, Archive, FileText, MoreHorizontal,
  FolderOpen, Trash2, Pencil, Copy, ExternalLink,
} from "lucide-react";
import { useConversationStore, Project } from "../../stores/conversationStore";

/* ─── 辅助函数 ─── */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "刚刚";
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  return `${diffDays} 天前`;
};

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "进行中", bg: "rgba(0, 255, 135, 0.15)", color: "#00ff87" },
  archived: { label: "已归档", bg: "rgba(255, 159, 64, 0.15)", color: "#ff9f40" },
  draft: { label: "草稿", bg: "rgba(255, 255, 255, 0.1)", color: "rgba(255,255,255,0.6)" },
};

const gradients = [
  "linear-gradient(135deg, #00ff87 0%, #60efff 100%)",
  "linear-gradient(135deg, #60efff 0%, #a855f7 100%)",
  "linear-gradient(135deg, #a855f7 0%, #ff6b6b 100%)",
  "linear-gradient(135deg, #ff6b6b 0%, #ffb86c 100%)",
  "linear-gradient(135deg, #00ff87 0%, #a855f7 100%)",
];

/* ─── 右键菜单组件 ─── */
interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  projectName: string;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, projectName }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  const items = [
    { icon: FolderOpen, label: "打开", color: "rgba(255,255,255,0.8)" },
    { icon: ExternalLink, label: "在新窗口打开", color: "rgba(255,255,255,0.8)" },
    { icon: Pencil, label: "重命名", color: "rgba(255,255,255,0.8)" },
    { icon: Copy, label: "复制", color: "rgba(255,255,255,0.8)" },
    { icon: Trash2, label: "删除", color: "#ff6b6b" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.15 }}
      className="fixed z-[9999] rounded-xl overflow-hidden"
      style={{
        left: x,
        top: y,
        background: "rgba(25, 25, 35, 0.96)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        minWidth: "180px",
      }}
    >
      <div className="px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="opacity-40" style={{ fontSize: "11px" }}>{projectName}</span>
      </div>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={onClose}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors duration-100 text-left"
          style={{
            color: item.color,
            fontSize: "13px",
            borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <item.icon size={14} className="opacity-60" />
          {item.label}
        </button>
      ))}
    </motion.div>
  );
};

/* ─── 项目卡片 ─── */
const ProjectCard: React.FC<{
  project: Project;
  index: number;
  onContextMenu: (e: React.MouseEvent, p: Project) => void;
}> = ({ project, index, onContextMenu }) => {
  const status = statusConfig[project.status] || statusConfig.draft;
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="flex-shrink-0 w-[260px] md:w-[280px] rounded-2xl cursor-pointer relative group max-md:w-full"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "box-shadow 0.3s ease, background 0.3s ease",
      }}
      onContextMenu={(e) => onContextMenu(e, project)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.2)";
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
        setShowMenu(false);
      }}
    >
      {/* 缩略图 */}
      <div
        className="w-full h-[140px] rounded-t-2xl relative overflow-hidden"
        style={{ background: gradients[index % gradients.length], opacity: 0.85 }}
      >
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)" }} />
        <div className="absolute bottom-3 left-3">
          <FileText size={24} color="rgba(255,255,255,0.7)" />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}
        >
          <MoreHorizontal size={14} color="white" />
        </button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-11 right-3 rounded-lg overflow-hidden z-20"
              style={{
                background: "rgba(30,30,40,0.95)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                minWidth: "120px",
              }}
            >
              {[
                { icon: FolderOpen, label: "打开" },
                { icon: Pencil, label: "重命名" },
                { icon: Trash2, label: "删除", danger: true },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 transition-colors duration-150 text-left"
                  style={{
                    fontSize: "13px",
                    color: item.danger ? "#ff6b6b" : "rgba(255,255,255,0.8)",
                    borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 信息区 */}
      <div className="p-4 flex flex-col gap-2">
        <h4 className="m-0 truncate" style={{ fontSize: "15px", fontWeight: 600, color: "var(--foreground)" }}>
          {project.name}
        </h4>
        {project.description && (
          <p className="m-0 truncate opacity-50" style={{ fontSize: "13px" }}>{project.description}</p>
        )}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 opacity-50">
            <Clock size={12} />
            <span style={{ fontSize: "12px" }}>{formatDate(project.updatedAt)}</span>
          </div>
          <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "11px", fontWeight: 500, background: status.bg, color: status.color }}>
            {status.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── 主组件 ─── */
export const RecentProjects: React.FC = () => {
  const { recentProjects } = useConversationStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; project: Project } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, project });
  };

  if (recentProjects.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="w-full max-w-[1200px] mx-auto mt-6 px-4 pb-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Archive size={18} className="opacity-50" />
        <h3 className="m-0 opacity-70" style={{ fontSize: "16px", fontWeight: 600 }}>最近项目</h3>
      </div>

      {/* 桌面端：横向滚动 / 移动端：垂直堆叠 */}
      <div
        className="flex gap-5 overflow-x-auto pb-3 max-md:flex-col max-md:overflow-x-visible"
        style={{ scrollBehavior: "smooth", scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.15) transparent" }}
      >
        {recentProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onContextMenu={handleContextMenu}
          />
        ))}
      </div>

      {/* 全局右键菜单 */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            projectName={contextMenu.project.name}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
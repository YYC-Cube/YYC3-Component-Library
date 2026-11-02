/**
 * @file BreadcrumbBar.tsx
 * @description 面包屑导航栏 — 文件路径导航/点击跳转/路径复制/图标识别/悬浮交互
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags breadcrumb, navigation, file-path, panel
 */

import React, { useState } from "react";
import {
  ChevronRight, FolderOpen, FileCode, FileText,
  FileType, Copy, Check, House,
} from "lucide-react";

/* ─── 文件类型图标推断 ─── */
function getFileIcon(name: string): React.ElementType {
  if (/\.(tsx?|jsx?)$/.test(name)) return FileCode;
  if (/\.(css|scss|less|styl)$/.test(name)) return FileType;
  return FileText;
}

function getSegmentColor(name: string, isLast: boolean): string {
  if (!isLast) return "rgba(255,255,255,0.3)";
  if (/\.tsx?$/.test(name)) return "#60efff";
  if (/\.jsx?$/.test(name)) return "#f7df1e";
  if (/\.css$/.test(name)) return "#a855f7";
  if (/\.json$/.test(name)) return "#ffb86c";
  if (/\.md$/.test(name)) return "#00ff87";
  return "rgba(255,255,255,0.7)";
}

/* ─── Props ─── */
interface BreadcrumbBarProps {
  filePath: string;
  onNavigate?: (partialPath: string) => void;
}

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ filePath, onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const segments = filePath.split("/").filter(Boolean);
  const fileName = segments[segments.length - 1] || "";
  const FileIcon = getFileIcon(fileName);

  const handleCopy = () => {
    navigator.clipboard.writeText(filePath).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleSegmentClick = (idx: number) => {
    if (!onNavigate) return;
    const partial = "/" + segments.slice(0, idx + 1).join("/");
    onNavigate(partial);
  };

  return (
    <div
      className="flex items-center gap-0.5 px-3 py-1 overflow-x-auto flex-shrink-0 group/breadcrumb"
      style={{
        background: "rgba(255,255,255,0.015)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        fontSize: "11px",
        minHeight: "26px",
        scrollbarWidth: "none",
      }}
    >
      {/* 根目录图标 */}
      <button
        onClick={() => onNavigate?.("/")}
        className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded transition-colors"
        style={{ color: "rgba(255,255,255,0.2)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.2)"; }}
        title="工作区根目录"
      >
        <House size={10} />
      </button>

      {/* 路径段 */}
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        const isFolder = !isLast;
        const color = getSegmentColor(seg, isLast);
        const isHovered = hoveredIdx === i;

        return (
          <React.Fragment key={i}>
            <ChevronRight
              size={10}
              className="flex-shrink-0"
              style={{ color: "rgba(255,255,255,0.1)" }}
            />
            <button
              onClick={() => handleSegmentClick(i)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex items-center gap-1 flex-shrink-0 px-1 py-0.5 rounded transition-colors"
              style={{
                color,
                fontWeight: isLast ? 500 : 400,
                background: isHovered ? "rgba(255,255,255,0.04)" : "transparent",
                cursor: onNavigate ? "pointer" : "default",
              }}
            >
              {isFolder ? (
                <FolderOpen
                  size={10}
                  className="flex-shrink-0"
                  style={{
                    color: isHovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
                  }}
                />
              ) : (
                <FileIcon
                  size={10}
                  className="flex-shrink-0"
                  style={{ color }}
                />
              )}
              <span>{seg}</span>
            </button>
          </React.Fragment>
        );
      })}

      {/* 间隔 + 复制按钮 */}
      <div className="flex-1" />
      <button
        onClick={handleCopy}
        className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded opacity-0 group-hover/breadcrumb:opacity-40 hover:!opacity-80 transition-opacity"
        style={{ color: copied ? "#00ff87" : "rgba(255,255,255,0.5)" }}
        title={copied ? "已复制" : "复制完整路径"}
      >
        {copied ? <Check size={10} /> : <Copy size={10} />}
      </button>
    </div>
  );
};
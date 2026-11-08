/**
 * file: progress.ts
 * description: 进度色映射与卡片表面样式 — v0 共享件 theme 对齐（自开发区 design-system 语义提取）
 * author: YYC3 Team
 * version: v0.1.0
 * created: 2026-11-09
 * updated: 2026-11-09
 * status: active
 * tags: [theme],[progress],[card]
 *
 * notes: cardSurfaces.header 修正了开发区 commonStyles.cardHeader 的 undefined 空引用（语义映射 card.header）
 */
export function getProgressColor(progress: number, status?: string): string {
  if (status === "completed") return "bg-gradient-to-r from-emerald-400 to-emerald-500";
  if (status === "cancelled") return "bg-gradient-to-r from-red-400 to-red-500";
  if (status === "critical") return "bg-gradient-to-r from-red-400 to-red-500";
  if (status === "warning") return "bg-gradient-to-r from-amber-400 to-amber-500";
  if (status === "excellent") return "bg-gradient-to-r from-emerald-400 to-emerald-500";
  if (status === "good") return "bg-gradient-to-r from-sky-400 to-sky-500";
  if (status === "at-risk") return "bg-gradient-to-r from-amber-400 to-amber-500";
  if (status === "off-track") return "bg-gradient-to-r from-red-400 to-red-500";
  if (status === "on-track") return "bg-gradient-to-r from-emerald-400 to-emerald-500";
  if (progress >= 90) return "bg-gradient-to-r from-emerald-400 to-emerald-500";
  if (progress >= 70) return "bg-gradient-to-r from-sky-400 to-sky-500";
  if (progress >= 50) return "bg-gradient-to-r from-amber-400 to-amber-500";
  return "bg-gradient-to-r from-red-400 to-red-500";
}

export const cardSurfaces = {
  base: "bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200",
  header: "p-6 border-b border-sky-100",
  enhanced:
    "bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300",
};

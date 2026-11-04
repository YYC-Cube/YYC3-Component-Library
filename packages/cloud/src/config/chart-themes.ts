// ============================================================
// YYC³ · @yyc3/cloud 图表主题（Phase 7 精度抽取补建）
// 源用法反推：interactive-chart.tsx 的 @/config/chart-themes（grid/text 色双主题）
// ============================================================
export const chartThemes = {
  light: {
    grid: 'rgba(100, 116, 139, 0.15)',
    text: 'rgba(30, 41, 59, 0.85)',
  },
  dark: {
    grid: 'rgba(148, 163, 184, 0.18)',
    text: 'rgba(226, 232, 240, 0.9)',
  },
} as const

export type ChartThemeName = keyof typeof chartThemes

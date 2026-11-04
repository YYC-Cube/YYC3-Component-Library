// ============================================================
// YYC³ Claw UI — 桶文件（Phase 3a · 2026-11-04）
// 源（S1）：personal 副本 YYC3-UI-用户界面/Button/components/yyc3/
// 主题上下文统一来源：./layout（button 已修复为 re-export）
//
// 【3a 已入】Button / Layout(+Header/Sider/Content/Footer) / Container / theme-tokens 壳
// 【3b 待入】Input / Card / Modal / Header / Sidebar / Footer（源文件已甄别，下一批）
// 【showcase】4 个展示页转 Storybook stories 于 3b 一并处理
// ============================================================

// 主题系统（统一自 layout）
export {
  YYC3ThemeProvider,
  useYYC3Theme,
  type YYC3Theme,
  type YYC3ThemeProviderProps,
} from './layout';

// 基础交互组件
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './button';

// 布局组件系统
export { Layout, type LayoutProps } from './layout';
export type {
  LayoutHeaderProps,
  LayoutContentProps,
  LayoutSiderProps,
  LayoutFooterProps,
} from './layout';
export { Container, type ContainerProps, type ContainerSize, type ContainerPadding } from './container';

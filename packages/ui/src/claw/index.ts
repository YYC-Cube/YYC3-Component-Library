// ============================================================
// YYC³ Claw UI — 桶文件（Phase 3a · 2026-11-04）
// 源（S1）：personal 副本 YYC3-UI-用户界面/Button/components/yyc3/
// 主题上下文统一来源：./layout（button 已修复为 re-export）
//
// 【3a 已入】Button / Layout(+Header/Sider/Content/Footer) / Container / theme-tokens 壳
// 【3b-1 已入】Input · 【3b-2 已入】Card · 【3b-3 已入】Modal / Footer
// 【3b-4 已入】Header / Sidebar —— Claw 主体九件全部闭环（2026-11-04）
// 【showcase】源 4 个展示页以「Claw 组件总览」交互 Story 重制替代
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
export {
  Input,
  type InputProps,
  type TextareaProps,
  type CombinedInputProps,
  type InputSize,
  type InputStatus,
  type InputType,
} from './input';
export {
  Card,
  type CardProps,
  type CardShadow,
  type CardHeaderProps,
  type CardBodyProps,
  type CardFooterProps,
  type CardImageProps,
} from './card';
export {
  Modal,
  type ModalProps,
  type ModalAnimation,
  type ModalPreset,
} from './modal';
export {
  Footer,
  type FooterProps,
  type FooterLink,
  type FooterColumn,
} from './footer';
export { Header, type HeaderProps, type NavItem } from './header';
export {
  Sidebar,
  type SidebarProps,
  type SidebarItem,
  type SidebarSection,
  type SidebarPlacement,
} from './sidebar';

// 布局组件系统
export { Layout, type LayoutProps } from './layout';
export type {
  LayoutHeaderProps,
  LayoutContentProps,
  LayoutSiderProps,
  LayoutFooterProps,
} from './layout';
export { Container, type ContainerProps, type ContainerSize, type ContainerPadding } from './container';

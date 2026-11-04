'use client';

// ============================================================
// YYC³ Claw UI · Layout（Phase 3 · S1 迁入）
// 源（D0 权威副本）：personal 副本 YYC3-UI-用户界面/Button/components/yyc3/layout.tsx
// 布局壳（Header/Sider/Content/Footer 复合）+ 全组件库单一主题上下文来源
// ============================================================

import React, {
  forwardRef,
  useContext,
  createContext,
  useEffect,
  type ReactNode,
  type CSSProperties,
  type HTMLAttributes,
} from 'react';

import {
  getThemeTokens,
  injectThemeCSSVars,
  cx,
  type YYC3Theme,
  type BaseComponentProps,
  type ThemeProps,
} from './theme-tokens';

// 主题类型再导出（button/container 经此统一引用单一 Context 与类型来源）
export type { YYC3Theme };

// ─────────────────────────────────────────────
// 主题上下文（全组件库单一来源）
// ─────────────────────────────────────────────
interface ThemeContextValue {
  theme: YYC3Theme;
}
const ThemeContext = createContext<ThemeContextValue>({ theme: 'cyberpunk' });
export const useYYC3Theme = () => useContext(ThemeContext);

export interface YYC3ThemeProviderProps {
  theme: YYC3Theme;
  children: ReactNode;
}
export const YYC3ThemeProvider: React.FC<YYC3ThemeProviderProps> = ({ theme, children }) => (
  <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
);

// ─────────────────────────────────────────────
// 类型定义（§1.1 BaseComponentProps）
// ─────────────────────────────────────────────
export interface LayoutProps
  extends BaseComponentProps,
    ThemeProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /**
   * 是否包含 Sidebar（决定是否横向排列内层）
   * @default false
   */
  hasSider?: boolean;
  /** 是否撑满视口高度 */
  fullScreen?: boolean;
}

export interface LayoutHeaderProps
  extends BaseComponentProps,
    HTMLAttributes<HTMLDivElement> {}

export interface LayoutContentProps
  extends BaseComponentProps,
    HTMLAttributes<HTMLDivElement> {
  /** 是否占满剩余高度（flex: 1） @default true */
  flex?: boolean;
}

export interface LayoutSiderProps
  extends BaseComponentProps,
    HTMLAttributes<HTMLDivElement> {
  /** 侧边栏宽度 */
  width?: number | string;
}

export interface LayoutFooterProps
  extends BaseComponentProps,
    HTMLAttributes<HTMLDivElement> {}

// ─────────────────────────────────────────────
// CSS 注入（一次性）
// ─────────────────────────────────────────────
const LAYOUT_CSS = `
/* ── 盒模型重置 ── */
.yyc3-layout, .yyc3-layout * { box-sizing: border-box; }

/* ── 滚动条 —— Cyberpunk ── */
.yyc3-layout[data-theme="cyberpunk"] .yyc3-layout-content::-webkit-scrollbar { width: 5px; }
.yyc3-layout[data-theme="cyberpunk"] .yyc3-layout-content::-webkit-scrollbar-track { background: rgba(0,10,15,0.8); }
.yyc3-layout[data-theme="cyberpunk"] .yyc3-layout-content::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.22); border-radius: 3px; }
.yyc3-layout[data-theme="cyberpunk"] .yyc3-layout-content::-webkit-scrollbar-thumb:hover { background: rgba(0,229,255,0.42); }

/* ── 滚动条 —— Liquid Glass ── */
.yyc3-layout[data-theme="liquid-glass"] .yyc3-layout-content::-webkit-scrollbar { width: 5px; }
.yyc3-layout[data-theme="liquid-glass"] .yyc3-layout-content::-webkit-scrollbar-track { background: rgba(200,215,240,0.18); }
.yyc3-layout[data-theme="liquid-glass"] .yyc3-layout-content::-webkit-scrollbar-thumb { background: rgba(100,130,200,0.28); border-radius: 3px; }
.yyc3-layout[data-theme="liquid-glass"] .yyc3-layout-content::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.45); }

/* ── 赛博朋克全局扫描线（固定，不遮内容事件） ── */
.yyc3-layout[data-theme="cyberpunk"]::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,255,255,0.007) 2px,
    rgba(0,255,255,0.007) 4px
  );
  pointer-events: none;
  z-index: 9998;
}

/* ── 响应式：移动端 Sider 隐藏 ── */
@media (max-width: 767px) {
  .yyc3-layout-sider { display: none !important; }
  .yyc3-layout-sider[data-mobile-open="true"] { display: flex !important; position: fixed; inset: 0; z-index: 500; }
}
`;

let layoutStyleInjected = false;
function ensureLayoutStyles() {
  if (layoutStyleInjected || typeof document === 'undefined') return;
  layoutStyleInjected = true;
  const el = document.createElement('style');
  el.id = 'yyc3-layout-styles';
  el.textContent = LAYOUT_CSS;
  document.head.appendChild(el);
}

// ─────────────────────────────────────────────
// Layout.Header
// ─────────────────────────────────────────────
const LayoutHeader = forwardRef<HTMLDivElement, LayoutHeaderProps>(
  ({ children, style, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx('yyc3-layout-header', className)}
      role="banner"
      style={{ flexShrink: 0, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
);
LayoutHeader.displayName = 'YYC3LayoutHeader';

// ─────────────────────────────────────────────
// Layout.Sider
// ─────────────────────────────────────────────
const LayoutSider = forwardRef<HTMLDivElement, LayoutSiderProps>(
  ({ children, width, style, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx('yyc3-layout-sider', className)}
      style={{
        flexShrink: 0,
        width: width !== undefined
          ? (typeof width === 'number' ? width + 'px' : width)
          : undefined,
        height: '100%',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
);
LayoutSider.displayName = 'YYC3LayoutSider';

// ─────────────────────────────────────────────
// Layout.Content
// ─────────────────────────────────────────────
const LayoutContent = forwardRef<HTMLDivElement, LayoutContentProps>(
  ({ children, flex = true, style, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx('yyc3-layout-content', className)}
      role="main"
      style={{
        flex: flex ? 1 : undefined,
        minHeight: 0,
        minWidth: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
);
LayoutContent.displayName = 'YYC3LayoutContent';

// ─────────────────────────────────────────────
// Layout.Footer
// ─────────────────────────────────────────────
const LayoutFooter = forwardRef<HTMLDivElement, LayoutFooterProps>(
  ({ children, style, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx('yyc3-layout-footer', className)}
      role="contentinfo"
      style={{ flexShrink: 0, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
);
LayoutFooter.displayName = 'YYC3LayoutFooter';

// ─────────────────────────────────────────────
// Layout 主组件
// ─────────────────────────────────────────────
interface LayoutComponent
  extends React.ForwardRefExoticComponent<
    LayoutProps & React.RefAttributes<HTMLDivElement>
  > {
  Header: typeof LayoutHeader;
  Sider: typeof LayoutSider;
  Content: typeof LayoutContent;
  Footer: typeof LayoutFooter;
}

const LayoutBase = forwardRef<HTMLDivElement, LayoutProps>(
  (
    {
      theme: themeProp,
      hasSider = false,
      fullScreen = false,
      children,
      style,
      className,
      ...rest
    },
    ref
  ) => {
    const { theme: ctxTheme } = useYYC3Theme();
    const theme = themeProp ?? ctxTheme;
    const tokens = getThemeTokens(theme);
    const isCyber = theme === 'cyberpunk';

    // 注入 CSS 样式 & CSS 变量
    if (typeof window !== 'undefined') {
      ensureLayoutStyles();
    }
    useEffect(() => {
      injectThemeCSSVars(theme);
    }, [theme]);

    const layoutStyle: CSSProperties = {
      display: 'flex',
      flexDirection: hasSider ? 'row' : 'column',
      width: '100%',
      height: fullScreen ? '100vh' : '100%',
      minHeight: 0,
      background: tokens.colors.background,
      color: tokens.colors.text,
      fontFamily: tokens.fontFamily,
      // 液态玻璃：轻柔渐变底色
      backgroundImage: isCyber
        ? undefined
        : 'linear-gradient(135deg,rgba(219,234,254,0.4) 0%,rgba(245,248,255,0.9) 60%,rgba(238,242,255,0.6) 100%)',
    };

    return (
      <YYC3ThemeProvider theme={theme}>
        <div
          ref={ref}
          className={cx('yyc3-layout', className)}
          data-theme={theme}
          aria-label="应用布局容器"
          style={{ ...layoutStyle, ...style }}
          {...rest}
        >
          {children}
        </div>
      </YYC3ThemeProvider>
    );
  }
);

LayoutBase.displayName = 'YYC3Layout';

export const Layout = LayoutBase as LayoutComponent;
Layout.Header = LayoutHeader;
Layout.Sider = LayoutSider;
Layout.Content = LayoutContent;
Layout.Footer = LayoutFooter;

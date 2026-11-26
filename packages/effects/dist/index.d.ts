import * as React from 'react';
import React__default, { ReactNode, CSSProperties } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

/**
 * file: CyberpunkWidget.tsx
 * description: 赛博朋克风格悬浮窗口组件
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-30
 * updated: 2026-03-30
 * status: active
 * tags: [component],[effects],[widget],[drag]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 可拖拽、可缩放的赛博朋克风格悬浮窗口组件
 *
 * details:
 * - 支持拖拽移动和边缘缩放
 * - 支持最小化、最大化、还原操作
 * - 支持多标签页切换
 * - 赛博朋克风格视觉效果
 * - 支持自定义内容渲染
 *
 * exports: CyberpunkWidget, CyberpunkWidgetProps, WidgetTab
 * dependencies: react, lucide-react
 */

/**
 * 标签页标识
 */
type WidgetTab = string;
/**
 * 标签页配置
 */
interface WidgetTabConfig {
    /** 标签页唯一标识 */
    id: WidgetTab;
    /** 标签页显示标签 */
    label: string;
    /** 标签页图标（React组件或emoji字符串） */
    icon: React__default.ComponentType<{
        className?: string;
    }> | string;
    /** 标签页主题颜色 */
    color: string;
    /** 标签页内容 */
    content: ReactNode;
}
/**
 * CyberpunkWidget 组件属性
 */
interface CyberpunkWidgetProps {
    /** 标签页配置列表 */
    tabs: WidgetTabConfig[];
    /** 默认激活的标签页ID */
    defaultActiveTab?: WidgetTab;
    /** 窗口标题 */
    title?: string;
    /** 窗口副标题 */
    subtitle?: string;
    /** 默认宽度 */
    defaultWidth?: number;
    /** 默认高度 */
    defaultHeight?: number;
    /** 最小宽度 */
    minWidth?: number;
    /** 最大宽度 */
    maxWidth?: number;
    /** 最小高度 */
    minHeight?: number;
    /** 最大高度 */
    maxHeight?: number;
    /** 切换到独立模式回调 */
    onSwitchMode?: () => void;
    /** 自定义主题颜色 */
    themeColor?: string;
    /** 是否显示快速操作栏 */
    showQuickActions?: boolean;
    /** 快速操作配置 */
    quickActions?: Array<{
        label: string;
        icon: React__default.ComponentType<{
            className?: string;
        }> | string;
        color: string;
        onClick?: () => void;
    }>;
    /** 额外的CSS类名 */
    className?: string;
}
/**
 * 赛博朋克风格悬浮窗口组件
 *
 * 可拖拽、可缩放的悬浮窗口，支持最小化、最大化操作。
 * 提供赛博朋克风格的视觉效果和多标签页支持。
 *
 * @param props - 组件属性
 * @returns 悬浮窗口组件
 *
 * @example
 * ```tsx
 * const tabs = [
 *   { id: 'chat', label: '聊天', icon: MessageCircle, color: '#00f0ff', content: <ChatPanel /> },
 *   { id: 'tools', label: '工具', icon: Wrench, color: '#00ffcc', content: <ToolsPanel /> },
 * ];
 *
 * <CyberpunkWidget
 *   tabs={tabs}
 *   defaultActiveTab="chat"
 *   title="AI助手"
 * />
 * ```
 */
declare const CyberpunkWidget: React__default.NamedExoticComponent<CyberpunkWidgetProps>;

/**
 * GlitchText 组件属性
 */
interface GlitchTextProps {
    /** 要显示的文字内容 */
    children: string;
    /** 主要霓虹颜色 */
    color?: string;
    /** 额外的CSS类名 */
    className?: string;
    /** 内联样式覆盖 */
    style?: CSSProperties;
    /** 是否显示为行内元素 */
    inline?: boolean;
    /** 随机故障间隔范围 [最小毫秒, 最大毫秒]，设为null禁用定时触发 */
    interval?: [number, number] | null;
    /** 故障强度乘数 (0-2, 默认1) */
    intensity?: number;
    /** 使用的HTML标签 */
    as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p';
    /** 是否启用故障效果 */
    enabled?: boolean;
}
/**
 * 赛博朋克风格文字故障效果组件
 *
 * 文字组件带有动画故障失真效果，
 * 强度可控制，效果尊重`prefers-reduced-motion`设置。
 *
 * @param props - 组件属性
 * @returns 故障文字组件
 *
 * @example
 * ```tsx
 * <GlitchText color="#00f0ff" intensity={1.2}>
 *   赛博朋克
 * </GlitchText>
 * ```
 */
declare const GlitchText: React.NamedExoticComponent<GlitchTextProps>;

/**
 * file: NeonCard.tsx
 * description: 霓虹发光卡片组件 - 支持赛博朋克和液态玻璃双主题
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-30
 * updated: 2026-03-30
 * status: active
 * tags: [component],[effects],[card],[theme]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 赛博朋克风格霓虹发光卡片，支持滚动入场动画
 *
 * details:
 * - 支持霓虹发光边框效果
 * - 支持赛博朋克和液态玻璃双主题
 * - 使用IntersectionObserver实现性能优化的滚动显示
 * - 支持hover交互效果
 * - 使用React.memo优化性能
 *
 * exports: NeonCard, NeonCardProps, NeonCardThemeMode
 * dependencies: react
 */

/**
 * 可视主题模式
 */
type NeonCardThemeMode = 'cyberpunk' | 'liquidGlass';
/**
 * NeonCard 组件属性
 */
interface NeonCardProps {
    /** 卡片内容 */
    children: ReactNode;
    /** 霓虹发光颜色 */
    color?: string;
    /** 额外的CSS类名 */
    className?: string;
    /** 是否启用hover效果 */
    hoverable?: boolean;
    /** 点击回调 */
    onClick?: () => void;
    /** 禁用滚动显示动画 */
    noReveal?: boolean;
    /** ARIA无障碍标签 */
    ariaLabel?: string;
    /** 主题模式 */
    themeMode?: NeonCardThemeMode;
    /** 内联样式 */
    style?: CSSProperties;
}
/**
 * 赛博朋克风格霓虹发光卡片组件
 *
 * 带有霓虹发光边框和可选滚动显示动画的赛博朋克风格卡片。
 * 使用`IntersectionObserver`实现性能优化的延迟入场，
 * 使用`will-change`提示优化渲染。
 *
 * @param props - 组件属性
 * @returns 霓虹卡片组件
 *
 * @example
 * ```tsx
 * <NeonCard color="#00f0ff" hoverable themeMode="cyberpunk">
 *   <h3>标题</h3>
 *   <p>内容</p>
 * </NeonCard>
 * ```
 */
declare const NeonCard: React__default.NamedExoticComponent<NeonCardProps>;

/**
 * 粒子画布配置选项
 */
interface ParticleCanvasConfig {
    /** 是否启用粒子动画 */
    enabled?: boolean;
    /** 霓虹强度 (0-100) */
    neonIntensity?: number;
    /** 粒子颜色数组 */
    colors?: string[];
    /** 连接距离阈值 */
    connectionDistance?: number;
    /** 粒子数量因子（每像素粒子的比例） */
    particleCountFactor?: number;
    /** 最大粒子数 */
    maxParticles?: number;
    /** 最小粒子数 */
    minParticles?: number;
    /** 画布透明度 */
    opacity?: number;
    /** 鼠标交互范围 */
    mouseInteractionRange?: number;
}
/**
 * ParticleCanvas 组件属性
 */
interface ParticleCanvasProps {
    /** 粒子画布配置 */
    config?: ParticleCanvasConfig;
    /** 额外的CSS类名 */
    className?: string;
    /** 内联样式 */
    style?: CSSProperties;
    /** 是否启用鼠标交互 */
    enableMouseInteraction?: boolean;
    /** 是否自动适应父容器大小 */
    autoResize?: boolean;
}
/**
 * Canvas粒子网络背景组件
 *
 * 使用requestAnimationFrame实现平滑的60fps动画，
 * 支持粒子间霓虹连线效果和鼠标交互吸引力。
 * 通过React.memo优化避免不必要的重新渲染。
 *
 * @param props - 组件属性
 * @returns 粒子画布组件或null（当禁用时）
 *
 * @example
 * ```tsx
 * <ParticleCanvas
 *   config={{
 *     enabled: true,
 *     neonIntensity: 80,
 *     colors: ['#00f0ff', '#00d4ff']
 *   }}
 * />
 * ```
 */
declare const ParticleCanvas: React.NamedExoticComponent<ParticleCanvasProps>;

interface ParticleEmitterProps {
    position: {
        x: number;
        y: number;
    };
    speed: number;
    color: {
        r: number;
        g: number;
        b: number;
    };
    active: boolean;
    maxParticles?: number;
    particleLife?: number;
    className?: string;
    style?: CSSProperties;
}
declare const ParticleEmitter: React.NamedExoticComponent<ParticleEmitterProps>;

interface TiltCardProps {
    children: React__default.ReactNode;
    className?: string;
    maxTilt?: number;
    scale?: number;
    speed?: number;
}
declare function TiltCard({ children, className, maxTilt, scale, speed, }: TiltCardProps): react_jsx_runtime.JSX.Element;
interface FlipCardProps {
    front: React__default.ReactNode;
    back: React__default.ReactNode;
    className?: string;
    flipOnHover?: boolean;
    flipDirection?: 'horizontal' | 'vertical';
}
declare function FlipCard({ front, back, className, flipOnHover, flipDirection, }: FlipCardProps): react_jsx_runtime.JSX.Element;
interface StackedCardsProps {
    cards: React__default.ReactNode[];
    className?: string;
    spacing?: number;
}
declare function StackedCards({ cards, className, spacing, }: StackedCardsProps): react_jsx_runtime.JSX.Element;
interface PerspectiveContainerProps {
    children: React__default.ReactNode;
    className?: string;
    perspective?: number;
}
declare function PerspectiveContainer({ children, className, perspective, }: PerspectiveContainerProps): react_jsx_runtime.JSX.Element;
interface RotatingShowcaseProps {
    items: React__default.ReactNode[];
    className?: string;
    autoRotate?: boolean;
    rotationSpeed?: number;
}
declare function RotatingShowcase({ items, className, autoRotate, rotationSpeed, }: RotatingShowcaseProps): react_jsx_runtime.JSX.Element;
interface FloatingCardProps {
    children: React__default.ReactNode;
    className?: string;
    floatRange?: number;
    duration?: number;
}
declare function FloatingCard({ children, className, floatRange, duration, }: FloatingCardProps): react_jsx_runtime.JSX.Element;
interface GlassRefractionCardProps {
    children: React__default.ReactNode;
    className?: string;
}
declare function GlassRefractionCard({ children, className, }: GlassRefractionCardProps): react_jsx_runtime.JSX.Element;
interface BookPageProps {
    pages: React__default.ReactNode[];
    className?: string;
}
declare function BookPage({ pages, className }: BookPageProps): react_jsx_runtime.JSX.Element;

interface RippleButtonProps {
    children: React__default.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
}
declare function RippleButton({ children, onClick, className, variant, }: RippleButtonProps): react_jsx_runtime.JSX.Element;
interface PulseButtonProps {
    children: React__default.ReactNode;
    onClick?: () => void;
    className?: string;
    pulseColor?: string;
}
declare function PulseButton({ children, onClick, className, pulseColor, }: PulseButtonProps): react_jsx_runtime.JSX.Element;
interface MagneticButtonProps {
    children: React__default.ReactNode;
    onClick?: () => void;
    className?: string;
    strength?: number;
}
declare function MagneticButton({ children, onClick, className, strength, }: MagneticButtonProps): react_jsx_runtime.JSX.Element;
interface AnimatedInputProps extends React__default.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React__default.ReactNode;
}
declare function AnimatedInput({ label, icon, className, ...props }: AnimatedInputProps): react_jsx_runtime.JSX.Element;
interface AnimatedSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    className?: string;
}
declare function AnimatedSwitch({ checked, onChange, label, className, }: AnimatedSwitchProps): react_jsx_runtime.JSX.Element;
interface LoadingButtonProps {
    children: React__default.ReactNode;
    loading: boolean;
    onClick?: () => void;
    className?: string;
}
declare function LoadingButton({ children, loading, onClick, className, }: LoadingButtonProps): react_jsx_runtime.JSX.Element;
interface AnimatedCounterProps {
    value: number;
    duration?: number;
    className?: string;
    prefix?: string;
    suffix?: string;
}
declare function AnimatedCounter({ value, duration, className, prefix, suffix, }: AnimatedCounterProps): react_jsx_runtime.JSX.Element;
interface AnimatedCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    className?: string;
}
declare function AnimatedCheckbox({ checked, onChange, label, className, }: AnimatedCheckboxProps): react_jsx_runtime.JSX.Element;
declare function LikeButton({ className }: {
    className?: string;
}): react_jsx_runtime.JSX.Element;

interface ParallaxProps {
    children: React__default.ReactNode;
    speed?: number;
    className?: string;
}
declare function Parallax({ children, speed, className }: ParallaxProps): react_jsx_runtime.JSX.Element;
interface ParallaxBackgroundProps {
    layers: Array<{
        content: React__default.ReactNode;
        speed: number;
        className?: string;
    }>;
    className?: string;
}
declare function ParallaxBackground({ layers, className }: ParallaxBackgroundProps): react_jsx_runtime.JSX.Element;
interface SmoothParallaxProps {
    children: React__default.ReactNode;
    className?: string;
}
declare function SmoothParallax({ children, className }: SmoothParallaxProps): react_jsx_runtime.JSX.Element;
interface ParallaxTextProps {
    text: string;
    className?: string;
    speed?: number;
}
declare function ParallaxText({ text, className, speed }: ParallaxTextProps): react_jsx_runtime.JSX.Element;
interface ParallaxImageProps {
    src: string;
    alt: string;
    speed?: number;
    className?: string;
    scale?: boolean;
}
declare function ParallaxImage({ src, alt, speed, className, scale, }: ParallaxImageProps): react_jsx_runtime.JSX.Element;
interface ParallaxStackProps {
    cards: React__default.ReactNode[];
    className?: string;
}
declare function ParallaxStack({ cards, className }: ParallaxStackProps): react_jsx_runtime.JSX.Element;
interface ParallaxRevealProps {
    children: React__default.ReactNode;
    direction?: 'left' | 'right' | 'up' | 'down';
    className?: string;
}
declare function ParallaxReveal({ children, direction, className, }: ParallaxRevealProps): react_jsx_runtime.JSX.Element;
declare function ScrollProgress({ className }: {
    className?: string;
}): react_jsx_runtime.JSX.Element;
interface ScrollTriggerProps {
    children: React__default.ReactNode;
    animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'rotate';
    threshold?: number;
    className?: string;
}
declare function ScrollTrigger({ children, animation, threshold, className, }: ScrollTriggerProps): react_jsx_runtime.JSX.Element;
interface Parallax3DCardProps {
    children: React__default.ReactNode;
    className?: string;
}
declare function Parallax3DCard({ children, className }: Parallax3DCardProps): react_jsx_runtime.JSX.Element;
interface InfiniteScrollProps {
    children: React__default.ReactNode;
    speed?: number;
    direction?: 'horizontal' | 'vertical';
    className?: string;
}
declare function InfiniteScroll({ children, speed, direction, className, }: InfiniteScrollProps): react_jsx_runtime.JSX.Element;

export { AnimatedCheckbox, AnimatedCounter, AnimatedInput, AnimatedSwitch, BookPage, CyberpunkWidget, type CyberpunkWidgetProps, FlipCard, FloatingCard, GlassRefractionCard, GlitchText, type GlitchTextProps, InfiniteScroll, LikeButton, LoadingButton, MagneticButton, NeonCard, type NeonCardProps, type NeonCardThemeMode, Parallax, Parallax3DCard, ParallaxBackground, ParallaxImage, ParallaxReveal, ParallaxStack, ParallaxText, ParticleCanvas, type ParticleCanvasConfig, type ParticleCanvasProps, ParticleEmitter, type ParticleEmitterProps, PerspectiveContainer, PulseButton, RippleButton, RotatingShowcase, ScrollProgress, ScrollTrigger, SmoothParallax, StackedCards, TiltCard, type WidgetTab, type WidgetTabConfig };

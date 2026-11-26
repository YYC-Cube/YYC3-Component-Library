---
file: README.md
description: "@yyc3/effects — YYC³ UI 特效组件库"
author: YanYuCloudCube Team <admin@0379.email>
version: 1.0.0
created: 2026-05-08
updated: 2026-05-08
status: active
tags: [effects],[cyberpunk],[liquid-glass],[3d],[particles],[react]
category: package
---

# @yyc3/effects

YYC³ UI 特效组件库 — 赛博朋克 / 液态玻璃 / 3D / 粒子 / 视差 / 微交互

## 安装

```bash
pnpm add @yyc3/effects react react-dom
```

> 3D 特效组件 (TiltCard/FlipCard) 需额外安装 `motion` (framer-motion): `pnpm add motion`

## 组件清单

### 赛博朋克特效

| 组件 | 说明 | 依赖 |
|------|------|------|
| `NeonCard` | 霓虹发光卡，支持 cyberpunk + liquidGlass 双主题 | react |
| `GlitchText` | 故障风格文字，随机/hover 触发 | react |
| `ParticleCanvas` | Canvas 粒子网络背景，鼠标交互 | react |
| `CyberpunkWidget` | 赛博朋克悬浮窗，可拖拽/多标签/最小化 | react |

### 3D 特效

| 组件 | 说明 | 依赖 |
|------|------|------|
| `TiltCard` | 鼠标跟踪 3D 倾斜卡片 | motion/react |
| `FlipCard` | 3D 翻转卡片 | motion/react |
| `StackedCards` | 堆叠卡片展开 | motion/react |
| `PerspectiveContainer` | 透视容器 | motion/react |
| `RotatingShowcase` | 旋转展示 | motion/react |
| `FloatingCard` | 浮动卡片 | motion/react |
| `GlassRefractionCard` | 玻璃折射卡片 | motion/react |
| `BookPage` | 书页翻页 | motion/react |

### 微交互

| 组件 | 说明 | 依赖 |
|------|------|------|
| `RippleButton` | 水波纹按钮 | react |
| `PulseButton` | 脉冲按钮 | react |
| `MagneticButton` | 磁性按钮 | react |
| `AnimatedInput` | 动画输入框 | react |
| `AnimatedSwitch` | 动画开关 | react |
| `LoadingButton` | 加载按钮 | react |
| `AnimatedCounter` | 动画计数器 | react |
| `AnimatedCheckbox` | 动画复选框 | react |
| `LikeButton` | 点赞按钮 | react |

### 视差滚动

| 组件 | 说明 | 依赖 |
|------|------|------|
| `Parallax` | 基础视差 | react |
| `ParallaxBackground` | 多层视差背景 | react |
| `SmoothParallax` | 平滑视差 | react |
| `ParallaxText` | 视差文字 | react |
| `ParallaxImage` | 视差图片 | react |
| `ParallaxStack` | 视差堆叠 | react |
| `ParallaxReveal` | 滚动揭示 | react |
| `ScrollProgress` | 滚动进度条 | react |
| `ScrollTrigger` | 滚动触发 | react |
| `Parallax3DCard` | 3D 视差卡片 | react |
| `InfiniteScroll` | 无限滚动 | react |

## 快速开始

```tsx
import { NeonCard, GlitchText, ParticleCanvas } from '@yyc3/effects'

export default function CyberpunkPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      <ParticleCanvas config={{ neonIntensity: 80 }} />
      <NeonCard color="#00f0ff" themeMode="cyberpunk" hoverable>
        <GlitchText color="#00f0ff" intensity={1.2}>
          赛博朋克
        </GlitchText>
      </NeonCard>
    </div>
  )
}
```

## 零依赖组件

NeonCard / GlitchText / ParticleCanvas / CyberpunkWidget 及全部微交互/视差组件 **仅依赖 react + react-dom**，无第三方运行时依赖。

3DEffects 系列 (TiltCard/FlipCard 等) 依赖 `motion` (framer-motion)，作为可选 peerDependency。

## TypeScript

完整类型导出，支持 `themeMode: 'cyberpunk' | 'liquidGlass'` 等字面量类型。

## License

MIT © YanYuCloudCube Team

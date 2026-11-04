---
file: YYC3-Claw-设计系统对接规范.md
title: YYC³ Claw UI 设计系统对接规范 — 接口 · 主题 · 无障碍 · 响应式
description: Claw 组件系强制对接规范（BaseComponentProps/ThemeVariables/无障碍四条/响应式断点六档），源 S5 迁入并加标头标尾
author: YYC³ Team <admin@0379.email>
version: v1.0.0
created: 2026-11-04
updated: 2026-11-04
status: published
tags: [claw, design-system, specification, theme, accessibility]
category: guide
language: zh-CN
audience: developers
complexity: basic
project: YYC3-Component-Library
phase: phase-3
review_status: reviewed
---

# YYC³ Claw UI 设计系统对接规范 — 接口 · 主题 · 无障碍 · 响应式

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 1.1 组件接口统一规范

所有组件必须遵循以下接口规范：

```typescript
// 基础组件Props接口
interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// 主题相关Props
interface ThemeProps {
  theme?: 'cyberpunk' | 'liquid-glass';
  primaryColor?: string;
}

// 尺寸相关Props
interface SizeProps {
  size?: 'small' | 'medium' | 'large';
}

// 状态相关Props
interface StatusProps {
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
}
```

## 1.2 主题系统集成要求

设计系统必须提供以下主题变量（真身实现见 `packages/theme/src/claw-tokens.ts`，经 `@yyc3/theme` 发布）：

```typescript
// 主题变量接口
interface ThemeVariables {
  // 颜色系统
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    text: string;
    border: string;
  };

  // 间距系统
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // 圆角系统
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };

  // 阴影系统
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };

  // 过渡系统
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}
```

## 1.3 可访问性要求

所有组件必须满足以下可访问性要求：

1. **键盘导航**：
   - 支持 Tab 键导航
   - 支持 Enter/Space 键激活
   - 支持 ESC 键关闭

2. **ARIA 属性**：
   - role 属性正确
   - aria-label 完整
   - aria-describedby 适当

3. **焦点管理**：
   - 焦点可见
   - 焦点陷阱（模态框）
   - 焦点恢复

4. **屏幕阅读器**：
   - 语义化标签
   - 隐藏装饰性元素
   - 提供文本替代

## 1.4 响应式设计要求

所有组件必须支持响应式设计：

```typescript
// 响应式断点
const breakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px'
};

// 响应式Props
interface ResponsiveProps {
  xs?: Partial<ComponentProps>;
  sm?: Partial<ComponentProps>;
  md?: Partial<ComponentProps>;
  lg?: Partial<ComponentProps>;
  xl?: Partial<ComponentProps>;
  xxl?: Partial<ComponentProps>;
}
```

---

> **迁入说明（Phase 3a · 2026-11-04）**：本文源为 personal 副本 `YYC3-UI-用户界面/Button/docs/README.md`（S5 甄别：属 Claw 体系的两篇之一）；同目录 Form/Menu/Table/Toast 四篇为 shadcn 系组件文档，归 Phase 4 随对应组件迁移。ClawButton 组件文档随 3b 批次迁入。

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.0.0 | 2026-11-04 | 自源 S5 迁入并按标规加标头标尾；迁入范围甄别说明 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

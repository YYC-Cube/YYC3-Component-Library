---
file: README.md
title: "@yyc3/theme — YYC³ 主题系统（全局样式 + Claw 设计令牌）"
description: 全局 CSS 与 Claw 双主题设计令牌（赛博朋克/液态玻璃）——Phase 3 起承载令牌真身（ThemeVariables/breakpoints/getThemeTokens/injectThemeCSSVars）
author: YYC³ Team <admin@0379.email>
version: v2.1.0
created: 2026-11-04
updated: 2026-11-04
status: published
tags: [package, theme, design-tokens, cyberpunk, liquid-glass]
category: package-readme
language: zh-CN
audience: developers
complexity: basic
---

# @yyc3/theme — YYC³ 主题系统

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 状态（2026-11-04 · Phase 3a）

- 构建 ✅ tsup（CJS+ESM+**DTS**）+ postcss（CSS 管线独立）
- 令牌真身：`src/claw-tokens.ts`（赛博朋克/液态玻璃双主题全量 ThemeVariables）
- 消费方：`@yyc3/ui-enterprise`（claw 组件系经薄壳引用，`workspace:*` 依赖）

## API

| 导出 | 说明 |
| --- | --- |
| `getThemeTokens(theme)` | 取主题全量令牌（colors/spacing/borderRadius/shadows/transitions + 扩展 fontFamily/scanline/backdropFilter/glowColor/surface*/headerBg/sidebarBg/footerBg） |
| `injectThemeCSSVars(theme)` | 将令牌注入 `:root` CSS 变量（`--yyc3-*`）+ `data-yyc3-theme` 属性 |
| `breakpoints` / `mq(bp)` | 六档响应式断点（xs~xxl）与媒体查询助手 |
| `cx` / `mergeStyles` | className / 内联样式合并工具 |
| `isCyberpunk` | 主题判定 |
| 类型 | `YYC3Theme` / `ThemeVariables` / `BaseComponentProps` / `ThemeProps` / `SizeProps` / `StatusProps` / `Breakpoint` |

```ts
import { getThemeTokens, injectThemeCSSVars } from '@yyc3/theme'
```

对接规范见 [YYC3-Claw-设计系统对接规范](../../docs/YYC3-项目组件-拆分规范/YYC3-Claw-设计系统对接规范.md)。

## 来源（D0 溯源）

personal 副本 `YYC3-UI-用户界面/Button/components/yyc3/theme-tokens.ts`（S1 · Phase 3a 迁入为真身；UI 侧 `src/claw/theme-tokens.ts` 为薄壳转发）

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v2.1.0 | 2026-11-04 | Phase 3a：Claw 设计令牌真身迁入 + TS 构建管线补齐（tsup+DTS）+ 桶导出 | YYC³ Team |
| v2.0.0 | — | CSS-only 时代（postcss 管线） | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

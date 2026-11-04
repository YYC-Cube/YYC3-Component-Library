---
file: README.md
title: "@yyc3/lib — YYC³ 共享功能库（hooks / i18n / 工具 / 类型）"
description: 零依赖工具函数与通用 Hooks 共享库——date/string/validation/data/i18n 翻译器/7 Hooks/通用类型，B1+B2a 两批滚动抽取，覆盖率过四门
author: YYC³ Team <admin@0379.email>
version: v0.2.0
created: 2026-11-04
updated: 2026-11-04
status: published
tags: [package, lib, hooks, i18n, utils]
category: package-readme
language: zh-CN
audience: developers
complexity: basic
---

# @yyc3/lib — YYC³ 共享功能库

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 状态（2026-11-04 · B2a 收口）

- 构建 ✅ tsup（CJS+ESM+**DTS**）· 测试 ✅ **47 用例全绿** · **覆盖率四门达标**（语句 89.77 / 分支 75 / 函数 89.16 / 行 93.67，门 80/75/85/80）
- React peer `^18 || ^19`；工具部分零依赖

## API 总览

| 模块 | 导出（节选） |
| --- | --- |
| `utils/date` | getGreeting / getHourlyCare / formatDate / getRelativeTime / isToday / isThisWeek |
| `utils/string` | truncate / capitalize / camelToKebab / kebabToCamel / randomString / uuid / interpolate / escapeHtml / unescapeHtml / isBlank / removeWhitespace / truncateByWords / slugify |
| `utils/validation` | isString…isURL（类型保护）/ validateConfig / deepMerge / cleanObject |
| `utils/data` | getMember / getDataSummary / deepClone / unique / groupBy / chunk |
| `hooks` | useToggle / useClickOutside（含语义修复注）/ useMediaQuery(+5 预设) / useLocalStorage / useDebounce / useDebouncedCallback / useWindowSize(+W/H) / useI18n + I18nProvider |
| `i18n` | createTranslator / mergeMessages / validateMessages / extractKeys / checkConsistency |
| `types` | 错误（AppError/ErrorStats…）/ 用户（AppUser/AppSession…）/ i18n（Locale/I18nMessages…）/ 组件状态（AsyncState/LoadingState…） |

```ts
import { useLocalStorage, createTranslator, deepMerge, formatDate } from '@yyc3/lib'
```

## 来源（D0 溯源，G9 绝对路径）

`/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-8/yyc3-reusable-components/packages/{utils,hooks,types,i18n}`（B1：utils；B2a：hooks/types/i18n）

## 变更历史与遗留

- B1（v0.1.0）：utils 四模块；color 因 Mimosa 误报暂缓
- **B2a（v0.2.0）**：hooks(7 文件)+types(节选)+i18n；`useClickOutside` 修复源级语义反转 bug（点外触发，留注）
- **B2b 待做**：error-handling（error-handler 428 行 + platform-error-filter 156 行）

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v0.2.0 | 2026-11-04 | B2a：hooks/types/i18n 并入；47 用例；覆盖率四门达标；README 对齐标规 | YYC³ Team |
| v0.1.0 | 2026-11-04 | B1：utils 四模块首发（30+ 导出/18 用例） | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>

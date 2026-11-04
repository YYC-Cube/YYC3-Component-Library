# @yyc3/lib

> YYC³ 共享功能库 — 零依赖工具函数 · 首批滚动抽取（2026-11-04）

## 状态

- src：4 模块（date/string/validation/data）+ 桶导出 · **v0.1.0**
- 构建：✅ tsup（CJS+ESM+DTS）· 测试：✅ 18 用例全绿（smoke+行为）

## 快速开始

```ts
import { formatDate, isEmail, deepMerge, chunk, slugify } from '@yyc3/lib'
```

## API（本批 30+ 导出）

| 模块 | 导出 |
| --- | --- |
| `date` | getGreeting / getHourlyCare / formatDate / getRelativeTime / isToday / isThisWeek |
| `string` | truncate / capitalize / camelToKebab / kebabToCamel / randomString / uuid（非加密）/ interpolate / escapeHtml / unescapeHtml / isBlank / removeWhitespace / truncateByWords / slugify |
| `validation` | isString / isNumber / isBoolean / isObject / isArray / isDate / isEmail / isURL / validateConfig / deepMerge / cleanObject（类型保护） |
| `data` | getMember / getDataSummary / deepClone / unique / groupBy / chunk |

## 来源（D0 溯源）

源（权威副本）：`/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-8/yyc3-reusable-components/packages/utils`（零依赖，AI Family 项目产物）

## 后续批次

- `hooks`（8）/ `types`（1）/ `error-handling`（3）/ `i18n`（2）待甄别并入；
- `color` 模块因扫描器误报（模板串判命令注入）暂缓，待复核后补入；
- 该源 monorepo 其余 24 功能包（websocket/crdt/collaboration 等）按需评估。

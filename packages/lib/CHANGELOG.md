# @yyc3/lib

## 0.4.0

### Minor Changes

- services 真身批次：ai-assistant-service / visualization-service / chart-voice-control / voice-command-engine / speech-service 等服务层完备（regenerateResponse 独立重生成路径、toolCalls 结果回写 metadata、speech 降级桩三态补齐）。
- 覆盖率：istanbul 全口径 96.23S / **87.52B** / 96.42F / 96.63L（batch1+batch2 共 359 用例，越过 85% 铁律门）。

## 0.3.0

### Minor Changes

- utils ×6 域 / 7 hooks / i18n / error-handling / contexts ×2 / adapters 与 41 条 barrel 导出成型（0.2.0 → 0.3.0 服务层骨架批次，CHANGELOG 补录）。

## 0.2.0

### Minor Changes

- 997d58e: 新增 @yyc3/lib 共享功能库 v0.1.0：零依赖工具函数首批（date/string/validation/data，30+ 导出，18 测试）。源：UI-8 yyc3-reusable-components（D0 权威副本，首批滚动抽取）。
- ecc3e4e: B2b 批次：error-handling 全量并入——ErrorHandler（错误分类矩阵/LocalStorage 存储（满载重试）/全局监听（幂等+平台过滤）/统计聚合/trySafe·trySafeSync 安全包装器）+ PlatformErrorFilter（四类规则/Figma 预设）。61 用例全绿，覆盖率四门 90.08/79.25/85.98/92.64。源：UI-8 yyc3-reusable-components（D0 权威副本）。至此 @yyc3/lib 的源包（utils/hooks/types/i18n/error-handling）全部抽取完成。

# @yyc3/lib

## 0.2.0

### Minor Changes

- 997d58e: 新增 @yyc3/lib 共享功能库 v0.1.0：零依赖工具函数首批（date/string/validation/data，30+ 导出，18 测试）。源：UI-8 yyc3-reusable-components（D0 权威副本，首批滚动抽取）。
- ecc3e4e: B2b 批次：error-handling 全量并入——ErrorHandler（错误分类矩阵/LocalStorage 存储（满载重试）/全局监听（幂等+平台过滤）/统计聚合/trySafe·trySafeSync 安全包装器）+ PlatformErrorFilter（四类规则/Figma 预设）。61 用例全绿，覆盖率四门 90.08/79.25/85.98/92.64。源：UI-8 yyc3-reusable-components（D0 权威副本）。至此 @yyc3/lib 的源包（utils/hooks/types/i18n/error-handling）全部抽取完成。

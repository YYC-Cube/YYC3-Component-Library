# @yyc3/lib

## 0.4.1

### Patch Changes

- **useDataset 死循环修复**（batch2 登记项闭环）：effect 依赖 fetchData 身份且 `isFetching` 在依赖数组内，拉取完成翻转身份形成「effect 自触发链」持续重拉；cache-first 命中路径 `setLastUpdated(new Date())` 每轮制造新对象强制 re-render——同步自触发死循环（batch2 只记录不触发的产品级隐患，修复前用例实证 worker SIGABRT）。最小修复双守卫：①请求键守卫（endpoint/page/pageSize/fetchPolicy 同键每挂载只由 effect 触发一次，refresh()/错误重试定时器直呼不受影响，换键放行）；②lastUpdated 稳定引用（缓存命中取缓存时间戳，同刻重复命中返回同一 Date 引用，Object.is bail-out）。副产物：loadMore/refresh 从外部真正可达（batch2 时代因自触发链常驻在飞而早退的结构限制随之解除）。
- 缓存命中 `lastUpdated` 语义修正：命中缓存的 lastUpdated = 数据真实入缓存时刻（此前恒为渲染时刻 new Date()）。
- 覆盖率：istanbul 全口径 96.60S / 87.59B / 96.62F / **97.01L**（修复后四项全数不回退：S +0.37 / B +0.07 / F +0.20 / L +0.38；新增 use-dataset 死循环专项 5 用例，2158 测试全绿）。

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

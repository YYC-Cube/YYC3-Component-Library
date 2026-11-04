---
'@yyc3/web-ui': minor
---

Phase 5b（web-ui 全量闭环）：NeonCard（178 行：双主题色映射/IntersectionObserver 入场显现（含 jsdom 守卫适配）/shimmer/键盘可达）+ useAI（226 行：七提供商/OpenAI 兼容 SSE 流式/30s 超时/localStorage 配置版本迁移/离线 fallback 模拟流）迁入。桶导出全量（10 组件 hooks）。技术债登记：NeonCard 无 rest 透传（data-* 不达 DOM，源样保留待上游修）。测试 7→**10 全绿**。**web-ui 15 文件全量闭环 ✅**

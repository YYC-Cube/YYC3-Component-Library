---
'@yyc3/ui': patch
---

fix(ui): zod4 兼容 + Loading 渲染修复——① @hookform/resolvers ^3.10.0 → ^5.9.2（3.x 的 zodResolver 在 zod@4 校验错误路径抛未捕获 ZodError，5.x 支持 zod4 standard schema；import 路径 @hookform/resolvers/zod 不变，form 测试补 zod4 全链回归 2 例）；② loading.tsx 恒返回 null 修复——按 13 项目多数派规范渲染居中转圈 +「加载中...」，新增 active prop（默认 true，false 显式关断）。ui 全量回归 883✅（880 基线 + 3 新增），istanbul 84.76%S/71.42%B/86.1%F/86.79%L 持平微升。同步 music/ai 两包同款 resolvers 声明升级（music/ai 未发布，无发包影响）。

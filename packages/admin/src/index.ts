// YYC³ Components
// Import UI components from @yyc3/ui
//
// 【技术债登记】（A 线分诊 · 2026-11-10）
// 本包为整应用误迁：src 下 175 个顶层条目、275 个 tsx（双导管理 + CRM/财务/绩效/
// 数据看板等应用域），包入口暂无任何导出（tsup entry = src/index.ts）。
// 已完成的修复：
//   1. 语法层 1,923 处（permissions-management 的 \u003c/\u003e/\u0026 转义 971 处、
//      行尾 '>' 丢失、'</div>' 误写 '<div>'、fragment 缺失、重复 .optional() 等）；
//   2. log-management.tsx 由两段残缺副本拼接 → 从 yyc3-management 权威副本重建；
//   3. 包内导入归一 @/components/ui/* → @yyc3/ui/*，@yyc3/hooks/* → @yyc3/ui；
//   4. 补 @yyc3/lib、recharts、next、framer-motion 依赖与 tsconfig paths。
// 剩余语义债：649 错 / 101 个文件（TS2339 155、TS7006 117、TS2322 96、TS2307 81…）。
// 缺失模块 top：@/store/widgetsSlice(9)、@/store/hooks(6)、@yyc3/lib/responsive-layout(5)、
// date-fns(3)、@/lib/sync-service-manager(3)、react-window(2)、@yyc3/lib/local-database(2)、
// @yyc3/lib/auth/permission-types(2)、@/contexts/background-context(2)、zod、
// react-hook-form、react-big-calendar、react-beautiful-dnd、moment、leaflet 各 1。
// 说明：@yyc3/lib 仅暴露根入口（dist/index），不存在 responsive-layout / local-database
// 等子路径；这些文件需随上游应用一同抽取，不能在本包就地补齐。
// 门禁口径：tsconfig.include 收敛到本文件；重建时应恢复 src/**/* 并单独出包。
export {}

// YYC³ Components
// Import UI components from @yyc3/ui
//
// 【技术债登记】（A 线分诊 · 2026-11-10）
// 本包为整应用误迁：src 下 440 个顶层条目（app/、admin/、modules/、monitoring/、
// ai/、analytics/ 与大量 *Page.tsx），依赖 next / framer-motion / lucide-react
// 以及未随迁的 src/lib/types、src/lib/data 等上游根文件。
// 整包类型错误 7,190（TS2307 3,066 / TS2322 2,082 / TS7006 911 / TS2722 331 …）。
// 本轮已修的语法层缺陷（保留）：
//   1. lib/services/workflow-api-service.ts 第 710 行截断 → 补全 createWorkflowTemplate 尾段；
//   2. lib/openapi/spec.ts 第 880 行多余右花括号 + 重复 components 键 → 合并并补 BearerAuth；
//   3. page.tsx 第 228 行 `联系邮箱: <admin@0379.email>` 被当作 JSX 标签 → 改为纯文本。
// 包入口暂无导出（tsup entry = src/index.ts），门禁口径收敛到本文件；
// 重建时应按组件库口径重新抽取，并把 tsconfig.include 恢复为 src/**/*。
export {}

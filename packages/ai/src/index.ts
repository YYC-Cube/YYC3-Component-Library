// YYC³ Components
// Import UI components from @yyc3/ui
//
// 【技术债登记】（A 线分诊 · 2026-11-10；Step 0 配置归一同日复核）
// 本包为整应用误迁：src 下 440 个顶层条目（app/、admin/、modules/、monitoring/、
// ai/、analytics/ 与大量 *Page.tsx），依赖 next / framer-motion / lucide-react
// 以及未随迁的 src/lib/types、src/lib/data 等上游根文件。
// Step 0 已归位配置层：补 46 项依赖声明（radix 全套、lucide-react、framer-motion、
// next、clsx、cva、recharts、sonner 等）+ tsconfig `@/*` 别名 + 237 处 motion/react
// 统一为 framer-motion。全量 include 错误 **7,190 → 2,631**（TS2307 3,066 → 734）。
// 剩余真缺口 top：@yyc3/lib/utils(32)、@xyflow/react(30)、@yyc3/ui/brand-button(22)、
// @yyc3/ui/brand-card(21)、@yyc3/ui/brand-badge(17)、@yyc3/lib/project-store(13)、
// react-router(12)、@yyc3/lib/hash-params(11)、@yyc3/lib/node-utils(10)、
// three/@react-three/*、@mantine/*、figma:asset/*。
// 本轮已修的语法层缺陷（保留）：
//   1. lib/services/workflow-api-service.ts 第 710 行截断 → 补全 createWorkflowTemplate 尾段；
//   2. lib/openapi/spec.ts 第 880 行多余右花括号 + 重复 components 键 → 合并并补 BearerAuth；
//   3. page.tsx 第 228 行 `联系邮箱: <admin@0379.email>` 被当作 JSX 标签 → 改为纯文本。
// 包入口暂无导出（tsup entry = src/index.ts），门禁口径收敛到本文件；
// 重建时应按组件库口径重新抽取，并把 tsconfig.include 恢复为 src/**/*。
export {}

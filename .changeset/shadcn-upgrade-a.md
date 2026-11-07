---
'@yyc3/ui-enterprise': minor
---

shadcn 新版升级批次 A（Layer1 + Layer3）：8 件对齐 shadcn 新版 + 2 处兼容 shim。

Layer1（零 token 变化/API 兼容）：toast / toaster / use-toast / use-mobile / sonner 替换为新版（引号与等价实现级差异；sonner 改用 `--normal-bg: var(--popover)` 等既有变量）。

Layer3 前置（API 破坏件带 shim 升级）：button / input / sheet 替换为新版（data-slot 结构约定 + aria-invalid 状态环 + h-9/h-8 视觉收窄 + selection: 文本选中色），配套 shim：恢复 `ButtonProps`（消费锚点 education/accessible-button + 桶 ClawButtonProps 再导出）与 `InputProps`（桶 ClawInputProps 锚点）类型导出；SheetOverlay/SheetPortal 经消费面核查为零外部需求（4 个引用文件均为包内自建副本），不补。

影响面评估（升级专项侦察，全量入档）：真实升级范围 50 件；tw4 + @theme inline 已就绪**无需 tailwind.config 同步**；全量 API 破坏仅 4 处（chart 的 BarChart/LineChart 移除待决策、button/input/sheet 本批消化）；Layer2（40 件 token 重排）与 chart 决策、sidebar 的 --sidebar-* 8 变量补齐、654 消费文件视觉走查登记为批次 B/发布前检查项。

验证：BUILD=0 · 671✅/0❌ 保持。

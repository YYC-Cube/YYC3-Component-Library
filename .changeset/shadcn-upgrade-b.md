---
'@yyc3/ui-enterprise': major
'@yyc3/theme': minor
---

shadcn 新版升级批次 B：45 件全量对齐新版（Layer2 完成）——**升级专项收官，ui 谱系对齐上游新版**。

批次 B（Layer2 + sidebar + chart）：menubar/dropdown-menu/context-menu/carousel/select/command/navigation-menu/alert-dialog/calendar/dialog/pagination/drawer/table/breadcrumb/form/card/input-otp/accordion/tabs/alert/scroll-area/toggle-group/avatar/tooltip/resizable/slider/popover/toggle/radio-group/hover-card/badge/switch/checkbox/progress/separator/label/collapsible/textarea/field/skeleton/aspect-ratio/input-group/button-group 43 件 token 重排（data-slot 结构约定/shadow-xs/outline-hidden/ring-[3px]/aria-invalid 环/rounded-xs/selection:）+ **sidebar 新件启用**（726 行，theme 包补 --sidebar-* 8×2 变量浅深两套）+ **chart 升级兼容 shim**（`export { BarChart, LineChart } from 'recharts'`——21 消费文件零改动）。

**MAJOR 依据**：button/input 默认高度 h-10→h-9、焦点环 ring-offset 移除改 border-ring/50、阴影档位下移——消费方视觉面系统性变化（671 测试逻辑面全绿，视觉走查清单另档：docs/YYC3-团队通用-标规文档/YYC3-shadcn升级-视觉走查清单.md，发布前硬检查项）。

验证：BUILD=0 · 671✅/0❌ · Storybook build 渲染冒烟通过（六域门面+ai atoms）。

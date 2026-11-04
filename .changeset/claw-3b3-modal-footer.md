---
'@yyc3/ui': minor
---

Phase 3b-3：ClawModal（852 行）+ ClawFooter（382 行）迁入。Modal：Portal 对话框/三动画/五预设命令式 API（confirm/info/success/error/warning）/Focus Trap/ESC/滚动锁定/异步确认 loading；Footer：多列链接 Grid/社交按钮/紧凑模式/赛博发光线。修复：Modal 自建第五份 ThemeContext→统一至 layout；require('react-dom/client')→静态 import（ESM/Vitest 兼容）；createPortal 从 react-dom 正确导入（源靠旧全局侥幸）。ClawModal/ClawFooter 入主桶；测试 19→26 全绿。源：personal 副本 S1（D0）。

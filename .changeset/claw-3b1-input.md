---
'@yyc3/ui': minor
---

Phase 3b-1：ClawInput 迁入（833 行）——6 类型（text/password/email/number/search/textarea）、状态校验三态（error/warning/success + role=alert）、前后缀、allowClear、密码可见性切换、字数统计（aria-live）、onPressEnter；主题上下文统一至 layout（源文件自建第三份 Context，同 3a 修复）；修复 TextareaProps 与 HTMLAttributes.prefix 的类型冲突（Omit 补 'prefix'）。ClawInput/ClawTextareaProps 以 Claw 前缀入主桶；新增 6 用例（受控/状态/清除/密码/textarea/主题）。源：personal 副本 S1（D0）。

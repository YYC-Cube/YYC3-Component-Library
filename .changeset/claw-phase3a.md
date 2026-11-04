---
'@yyc3/ui': minor
---

Phase 3a：Claw UI 首批迁入（自研零依赖双主题组件系）——ClawButton（5 变体×3 尺寸×双主题，loading/active/iconOnly/ripple/aria 完整）、ClawLayout（Header/Sider/Content/Footer 复合，主题上下文单一来源）、ClawContainer（六档响应式+Section 模式）+ 主题上下文（YYC3ThemeProvider/useYYC3Theme）+ 设计令牌 re-export；全部以 Claw 前缀导出与 shadcn 件区分。修复源级双 ThemeContext 缺陷（button/layout 各建 Context 不互通→统一至 layout）。新增双主题交互演示 Story。源：personal 副本 YYC3-UI-用户界面/Button/components/yyc3（S1·D0）。

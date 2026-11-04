# @yyc3/ui

## 2.1.0

### Minor Changes

- f296dba: Phase 3b-1：ClawInput 迁入（833 行）——6 类型（text/password/email/number/search/textarea）、状态校验三态（error/warning/success + role=alert）、前后缀、allowClear、密码可见性切换、字数统计（aria-live）、onPressEnter；主题上下文统一至 layout（源文件自建第三份 Context，同 3a 修复）；修复 TextareaProps 与 HTMLAttributes.prefix 的类型冲突（Omit 补 'prefix'）。ClawInput/ClawTextareaProps 以 Claw 前缀入主桶；新增 6 用例（受控/状态/清除/密码/textarea/主题）。源：personal 副本 S1（D0）。
- 1bf7e76: Phase 3b-2a：ClawCard 迁入（604 行）——复合卡片（Header/Body/Footer/Image 静态挂载）、四级阴影、loading 骨架屏（shimmer）、赛博朋克角饰/扫描线/顶部光带、液态玻璃高光；主题上下文统一至 layout（源自建第四份 Context，3a 同款修复）；类型修复：CardProps/CardHeaderProps 的 title?: ReactNode 与 HTMLAttributes.title: string 冲突（Omit 'title'）。ClawCard 以 Claw 前缀入主桶；新增 3 用例（19 全绿）。源：personal 副本 S1（D0）。
- 9451eb5: Phase 3b-3：ClawModal（852 行）+ ClawFooter（382 行）迁入。Modal：Portal 对话框/三动画/五预设命令式 API（confirm/info/success/error/warning）/Focus Trap/ESC/滚动锁定/异步确认 loading；Footer：多列链接 Grid/社交按钮/紧凑模式/赛博发光线。修复：Modal 自建第五份 ThemeContext→统一至 layout；require('react-dom/client')→静态 import（ESM/Vitest 兼容）；createPortal 从 react-dom 正确导入（源靠旧全局侥幸）。ClawModal/ClawFooter 入主桶；测试 19→26 全绿。源：personal 副本 S1（D0）。
- 0516e65: Phase 3b-4（Claw 主体收官）：ClawHeader（524 行：导航 activeKey/键盘可达/滚动收缩/移动端汉堡菜单）+ ClawSidebar（616 行：tree 语义分组/子菜单/徽章/折叠受控双模/双 placement）迁入，补 useRef 导入遗漏。新增「Claw 组件总览」交互 Story（Layout+Header+Sidebar+Card+Input+Button+Modal+Footer 全家桶双主题演示，替代源 showcase×4）。测试 26→31 全绿。**Claw 九件全量闭环：Button/Layout/Container/Input/Card/Modal/Header/Sidebar/Footer + 令牌真身**。源：personal 副本 S1（D0）。
- a5475f4: Phase 3a：Claw UI 首批迁入（自研零依赖双主题组件系）——ClawButton（5 变体×3 尺寸×双主题，loading/active/iconOnly/ripple/aria 完整）、ClawLayout（Header/Sider/Content/Footer 复合，主题上下文单一来源）、ClawContainer（六档响应式+Section 模式）+ 主题上下文（YYC3ThemeProvider/useYYC3Theme）+ 设计令牌 re-export；全部以 Claw 前缀导出与 shadcn 件区分。修复源级双 ThemeContext 缺陷（button/layout 各建 Context 不互通→统一至 layout）。新增双主题交互演示 Story。源：personal 副本 YYC3-UI-用户界面/Button/components/yyc3（S1·D0）。
- 569529c: Phase 4 shadcn 去重：S2 逐件 diff 完成（56 文件 D1 清单留档 docs/YYC3-Phase4-shadcn去重-D1清单.md）。**7 件缺失补入**（shadcn 新版）：ButtonGroup/Empty/Field/InputGroup/Item/Kbd/Spinner（837 行，import 适配+React 类型补齐，UI build=0 一次通过）。**49 件 SKIP**（同名保留本仓活基线；shadcn 新版整体升级列独立专项——全局 token 变化需消费方全量回归）。新增冒烟覆盖 7 件导出。

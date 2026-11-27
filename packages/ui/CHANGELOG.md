# @yyc3/ui

## 2.1.3

### Patch Changes

- **ClawInput inputRef 挂载修复**（PR#61 #1）：`inputRef` 声明后从未挂载到 JSX 元素——清除钮的原生清值/回焦与密码切换回焦全部失效（`inputRef.current` 恒 null）。合并转发外部 ref 与 inputRef（`setRefs` 回调）；清除钮走真实原生 setter + input 事件（触发真实 React onChange，单次派发）；合成 onChange 仅保留为 ref 缺失时兜底。
- **Chart tooltip payload 防御修复**（PR#61 #2）：`item.payload.fill` 在 payload 条目缺 `payload` 字段（手搓 payload/非标准 recharts 条目）时直接 TypeError → 可选链 `item.payload?.fill || item.color` 防御。
- **3D Button asChild 单子修复**（PR#61 #3）：`asChild` 时 Radix Slot 收到内容层 span + 波纹层 span 两个子元素 → `React.Children.only` 必炸。`asChild` 只透传 `children` 单子；包装层/波纹层仅在非 asChild 渲染。
- **FormControl 守卫前置修复**（PR#61 #4）：守卫在 `useFormState`/`getFieldState` 之后且 `FormFieldContext` 默认值 `{} as ...` 永为真值 → 守卫死代码。守卫前置到所有解构/调用之前，以 `!fieldContext.name` 判定，抛出正确的守卫错误。
- **Carousel 纵向分支可达修复**（PR#61 #5）：`orientation` 形参默认值 `'horizontal'` 使纵向分支不可达，且 `{...opts, axis: 'x'}` 覆盖用户 `opts.axis='y'`——纵向轮播完全不可用。形参默认值移除，显式推断 `orientationProp ?? (opts?.axis === 'y' ? 'vertical' : 'horizontal')`，显式传入仍优先。
- 协议口径：dependencies 全真实 semver（`@yyc3/theme ^2.2.0`），零 `workspace:*` 协议泄漏；发布资格 = istanbul 全口径复核 **97.47S / 94.30B / 97.12F / 98.07L** 四项过门（2.1.2 基线 84.74S/94.06B/96.64F/97.80L，PR#61 缺陷修复后四项全数不回退）。

## 2.1.2

### Patch Changes

- **zod4 兼容修复**：`@hookform/resolvers` ^3.10.0 → **^5.9.2**（resolvers 3.x 不支持 zod4，zodResolver 校验错误路径抛未捕获 ZodError；5.x peer `zod ^3.25.0 || ^4.0.0`，import 路径 `@hookform/resolvers/zod` 不变，消费方零改动）。music/ai 两包同步升级。
- **loading.tsx 渲染修复**：恒返回 null → 按多数派规范件渲染（`h-screen` 居中转圈环 +「加载中...」）；新增可选 `active` prop（默认 true 渲染，false 显式关断），Next 路由无 props 挂载不受影响。
- 覆盖率：istanbul 全口径 84.74S / **94.06B** / 96.64F / 97.80L（batch1 54 组件 0% 清零 + batch2 弱分支/claw 域冲刺，883→1032+ 用例）。

## 2.1.1

### Patch Changes

- workspace 依赖泄漏修复：theme → ^1.0.0（2.1.0 发布即发现 dependencies 泄漏 workspace:*，消费者 npm install 崩）。

## 2.1.0

### Minor Changes

- f296dba: Phase 3b-1：ClawInput 迁入（833 行）——6 类型（text/password/email/number/search/textarea）、状态校验三态（error/warning/success + role=alert）、前后缀、allowClear、密码可见性切换、字数统计（aria-live）、onPressEnter；主题上下文统一至 layout（源文件自建第三份 Context，同 3a 修复）；修复 TextareaProps 与 HTMLAttributes.prefix 的类型冲突（Omit 补 'prefix'）。ClawInput/ClawTextareaProps 以 Claw 前缀入主桶；新增 6 用例（受控/状态/清除/密码/textarea/主题）。源：personal 副本 S1（D0）。
- 1bf7e76: Phase 3b-2a：ClawCard 迁入（604 行）——复合卡片（Header/Body/Footer/Image 静态挂载）、四级阴影、loading 骨架屏（shimmer）、赛博朋克角饰/扫描线/顶部光带、液态玻璃高光；主题上下文统一至 layout（源自建第四份 Context，3a 同款修复）；类型修复：CardProps/CardHeaderProps 的 title?: ReactNode 与 HTMLAttributes.title: string 冲突（Omit 'title'）。ClawCard 以 Claw 前缀入主桶；新增 3 用例（19 全绿）。源：personal 副本 S1（D0）。
- 9451eb5: Phase 3b-3：ClawModal（852 行）+ ClawFooter（382 行）迁入。Modal：Portal 对话框/三动画/五预设命令式 API（confirm/info/success/error/warning）/Focus Trap/ESC/滚动锁定/异步确认 loading；Footer：多列链接 Grid/社交按钮/紧凑模式/赛博发光线。修复：Modal 自建第五份 ThemeContext→统一至 layout；require('react-dom/client')→静态 import（ESM/Vitest 兼容）；createPortal 从 react-dom 正确导入（源靠旧全局侥幸）。ClawModal/ClawFooter 入主桶；测试 19→26 全绿。源：personal 副本 S1（D0）。
- 0516e65: Phase 3b-4（Claw 主体收官）：ClawHeader（524 行：导航 activeKey/键盘可达/滚动收缩/移动端汉堡菜单）+ ClawSidebar（616 行：tree 语义分组/子菜单/徽章/折叠受控双模/双 placement）迁入，补 useRef 导入遗漏。新增「Claw 组件总览」交互 Story（Layout+Header+Sidebar+Card+Input+Button+Modal+Footer 全家桶双主题演示，替代源 showcase×4）。测试 26→31 全绿。**Claw 九件全量闭环：Button/Layout/Container/Input/Card/Modal/Header/Sidebar/Footer + 令牌真身**。源：personal 副本 S1（D0）。
- a5475f4: Phase 3a：Claw UI 首批迁入（自研零依赖双主题组件系）——ClawButton（5 变体×3 尺寸×双主题，loading/active/iconOnly/ripple/aria 完整）、ClawLayout（Header/Sider/Content/Footer 复合，主题上下文单一来源）、ClawContainer（六档响应式+Section 模式）+ 主题上下文（YYC3ThemeProvider/useYYC3Theme）+ 设计令牌 re-export；全部以 Claw 前缀导出与 shadcn 件区分。修复源级双 ThemeContext 缺陷（button/layout 各建 Context 不互通→统一至 layout）。新增双主题交互演示 Story。源：personal 副本 YYC3-UI-用户界面/Button/components/yyc3（S1·D0）。
- 569529c: Phase 4 shadcn 去重：S2 逐件 diff 完成（56 文件 D1 清单留档 docs/YYC3-Phase4-shadcn去重-D1清单.md）。**7 件缺失补入**（shadcn 新版）：ButtonGroup/Empty/Field/InputGroup/Item/Kbd/Spinner（837 行，import 适配+React 类型补齐，UI build=0 一次通过）。**49 件 SKIP**（同名保留本仓活基线；shadcn 新版整体升级列独立专项——全局 token 变化需消费方全量回归）。新增冒烟覆盖 7 件导出。

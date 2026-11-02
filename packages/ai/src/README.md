# Components 目录说明

`components` 目录包含 YanYuCloud AI 项目的所有自定义 React 组件。这些组件用于构建应用的用户界面，包括基础UI组件和业务逻辑组件。

## 目录结构

```
components/
├── geometric-animation.tsx    # 几何动画背景组件
├── model-selector.tsx         # AI模型选择器组件
├── theme-provider.tsx         # 主题提供者组件
├── typewriter-effect.tsx      # 打字机效果组件
├── ui/                        # 基础UI组件集合
│   ├── accordion.tsx          # 手风琴组件
│   ├── alert-dialog.tsx       # 警告对话框组件
│   ├── alert.tsx              # 提示组件
│   └── ... (更多UI组件)
└── voice-settings-dialog.tsx  # 语音设置对话框组件
```

## 组件分类

### 业务组件

- **model-selector.tsx**：用于选择不同的AI模型
- **geometric-animation.tsx**：提供几何图形动画背景效果
- **typewriter-effect.tsx**：实现打字机效果的文本展示
- **voice-settings-dialog.tsx**：语音设置对话框组件

### UI基础组件

`ui` 目录包含一系列可复用的基础UI组件，主要基于 Radix UI 实现，包括：

- **按钮组件**（button.tsx）：各种样式和状态的按钮
- **表单组件**（form.tsx、input.tsx、label.tsx 等）：表单相关组件
- **对话框组件**（dialog.tsx、alert-dialog.tsx 等）：各种对话框组件
- **导航组件**（navigation-menu.tsx、breadcrumb.tsx 等）：导航相关组件
- **状态组件**（progress.tsx、badge.tsx 等）：显示状态的组件

## 组件使用规范

- 业务组件应放在 `components` 根目录下
- 通用UI组件应放在 `components/ui` 目录下
- 组件命名应使用 PascalCase 命名法
- 组件应具有良好的可复用性和可维护性
- 组件样式应使用 Tailwind CSS 类名定义

## 开发注意事项

- 创建新组件时，请遵循现有的组件设计规范
- 组件应具备清晰的Props接口定义（使用TypeScript）
- 组件内部逻辑应尽量简单，复杂逻辑建议通过Hooks抽离
- 确保组件在不同主题（明/暗）下均能正常显示

## 主题支持

`theme-provider.tsx` 提供了主题切换功能，所有组件都应该适配主题变化。使用主题颜色和样式时，请通过主题上下文获取，以确保主题一致性。
# YYC³ Component Library

> YYC³ 统一组件库 - 企业级 React 组件集合

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发模式
pnpm dev

# 构建所有包
pnpm build

# 代码检查
pnpm lint
```

## 包结构

| 包名 | 描述 | 状态 |
|------|------|------|
| `@yyc3/ui` | 基础 UI 组件库 (shadcn/ui 风格) | 🚧 构建中 |
| `@yyc3/theme` | 主题系统 (22 套主题) | 🚧 构建中 |
| `@yyc3/business` | 业务组件库 | ⏳ 待开始 |
| `@yyc3/layouts` | 布局组件库 | ⏳ 待开始 |
| `@yyc3/effects` | 特效组件库 | ⏳ 待开始 |
| `@yyc3/icons` | 图标库 | ⏳ 待开始 |

## 技术栈

- React 19
- Next.js 15
- Tailwind CSS 4
- TypeScript 5.9
- Radix UI
- pnpm Workspace
- Turborepo

## 开发指南

### 添加新组件

1. 在 `packages/ui/src/` 创建组件文件
2. 在 `packages/ui/src/index.ts` 导出组件
3. 运行 `pnpm build:ui` 构建

### 添加新主题

1. 在 `packages/theme/src/` 创建主题 CSS 文件
2. 在 `packages/theme/src/index.css` 导入主题
3. 运行 `pnpm build:theme` 构建

## 许可

内部使用，非商用。

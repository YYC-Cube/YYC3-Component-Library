import type { StorybookConfig } from '@storybook/react-vite';
import fs from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

// ============================================================
// A3 批次（正仓会话① · 2026-11-07）：@yyc3/* 源码桶 alias
// 与根 vitest.config.ts 的 yyc3WorkspaceAlias 同架构（8 债清零批先例）：
// workspace 裸导入（stories → @yyc3/ui）不再依赖 root node_modules 的
// @yyc3 链接与 dist 产物，直接解析到 packages/*/src 源码桶。
// 根因：pnpm 不在根 node_modules 链接 workspace 包，stories 目录解析断。
// ============================================================
const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const packagesDir = join(repoRoot, "packages")
const yyc3WorkspaceAlias = Object.fromEntries(
  fs
    .readdirSync(packagesDir)
    .filter((name) => fs.existsSync(join(packagesDir, name, "package.json")))
    .map((name) => [`@yyc3/${name}`, join(packagesDir, name, "src")]),
)

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // A3 批次（2026-11-07）：显式枚举 packages（除 ai）。原因：packages/ai atoms stories
    // 引用数十个 @yyc3/lib/* 幻影子路径（ai-service / microservices / enterprise 等，
    // lib 包中不存在），基线即断（baseline worktree 复现：main 5deb33f 构建红于
    // @yyc3/ui 解析）。该域归属 refactor/adapters-domain 会话整改，storybook 侧先排除
    // 保主干构建绿；TODO(adapters-domain)：修复幻影导入后把 ai 加回本枚举。
    "../packages/{admin,business,city,cloud,design,education,effects,financial,icons,layouts,lib,medical,music,theme,ui,web-ui}/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-mcp')
  ],
  "framework": getAbsolutePath('@storybook/react-vite'),
  "docs": {
    autodocsTag: 'autodocs',
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = { ...(config.resolve.alias ?? {}), ...yyc3WorkspaceAlias };
    return config;
  },
};
export default config;

// ============================================================
// YYC³ · Storybook 门户主配置（Phase 7 apps 门户批次 · 2026-11-07）
// stories 双源：packages/ai/src（atoms 现有 3 件）+ 本 app stories/（六域门面）
// viteFinal 注入 workspace 源码别名（同 vitest.config.ts yyc3WorkspaceAlias 逻辑）：
// vite 对 workspace bare import 走 exports→dist，dev 环境无 dist 即断——别名到 src 桶。
// ============================================================
import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(ts|tsx)',
    '../../packages/ai/src/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    // storybook 编译上下文中 import.meta.url 指向临时 bundle，相对计算不可靠——
    // 从 cwd（apps/storybook）向上探测含 packages/ui 的仓库根
    let repoRoot = process.cwd()
    for (let i = 0; i < 4 && !fs.existsSync(path.join(repoRoot, 'packages', 'ui')); i++) {
      repoRoot = path.dirname(repoRoot)
    }
    const pkgRoot = path.join(repoRoot, 'packages')
    const names = fs
      .readdirSync(pkgRoot)
      .filter((n) => fs.existsSync(path.join(pkgRoot, n, 'package.json')))

    const aliases: Array<{ find: RegExp; replacement: string }> = []
    // CSS 样式入口特例（theme exports "./styles" → src/index.css）——须在通配前
    const themeCss = path.join(pkgRoot, 'theme', 'src', 'index.css')
    if (fs.existsSync(themeCss)) {
      aliases.push({ find: /^@yyc3\/theme\/styles$/, replacement: themeCss })
    }
    for (const n of names) {
      const base = path.join(pkgRoot, n, 'src')
      const entry = ['index.tsx', 'index.ts']
        .map((e) => path.join(base, e))
        .find((p) => fs.existsSync(p))
      // 主入口精确匹配
      aliases.push({ find: new RegExp(`^@yyc3/${n}$`), replacement: entry ?? base })
      // 子路径 → src/<sub>，后缀交由 vite resolve.extensions 补全
      aliases.push({ find: new RegExp(`^@yyc3/${n}/(.+)$`), replacement: `${base}/$1` })
    }

    config.resolve = config.resolve ?? {}
    config.resolve.alias = [...(config.resolve.alias ?? []), ...aliases]
    // 走查批修复：React 双实例（storybook 内置 react 与 workspace react 版本差）
    // ——与 vitest.config 同款 dedupe，强制组件/Storybook 共享单实例
    config.resolve.dedupe = ['react', 'react-dom', 'react/jsx-runtime']
    // 走查批修复：域组件携带 next/image 链（storybook deps/next_image.js 引用
    // Node 全局 process）——浏览器无 process，注入空 env 定义
    config.define = { ...(config.define ?? {}), 'process.env': '{}' }
    // 走查批修复：域组件消费 Tailwind utility 类（gray/indigo 默认色板 + CSS 变量令牌），
    // utilities 层缺失导致门面裸排——tw4 插件 + .storybook/tailwind.css（@source 扫描包源）
    config.plugins = [...(config.plugins ?? []), tailwindcss()]
    return config
  },
}

export default config

// ============================================================
// YYC³ · Playground vite 配置（Phase 7 apps 门户批次 · 2026-11-07）
// workspace 源码别名（同 apps/storybook main.ts 逻辑）：dev 无 dist 时
// vite exports→dist 解析会断，@yyc3/* 重定向到 packages/<pkg>/src。
// ============================================================
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

function yyc3WorkspaceAlias(): Plugin {
  const pkgRoot = path.resolve(dirname, '../../packages')
  const names = fs.readdirSync(pkgRoot).filter((n) => fs.existsSync(path.join(pkgRoot, n, 'package.json')))
  return {
    name: 'yyc3-workspace-alias',
    enforce: 'pre',
    resolveId(source) {
      if (!source.startsWith('@yyc3/')) return null
      const [pkg, ...rest] = source.slice(6).split('/')
      if (!names.includes(pkg)) return null
      const base = path.join(pkgRoot, pkg, 'src')
      if (rest.length === 0) {
        const entry = ['index.tsx', 'index.ts'].map((e) => path.join(base, e)).find((p) => fs.existsSync(p))
        return entry ?? null
      }
      const rel = rest.join('/')
      for (const cand of [`${rel}.tsx`, `${rel}.ts`, `${rel}/index.tsx`, `${rel}/index.ts`]) {
        const p = path.join(base, cand)
        if (fs.existsSync(p)) return p
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [react(), yyc3WorkspaceAlias()],
})

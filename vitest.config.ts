import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { defineConfig, type Plugin } from 'vitest/config';

import react from '@vitejs/plugin-react';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Phase 1 固化：还原源项目 `@/` 别名（按 importer 所属包解析）
// `@/src/x`（来自 packages/ai/…）→ packages/ai/src/x；包内不存在的路径按真实失败暴露（技术债，随滚动抽取修复）
function atAliasPerPackage(): Plugin {
  const packagesDir = path.join(dirname, 'packages');
  return {
    name: 'yyc3-at-alias-per-package',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!source.startsWith('@/') || !importer) return null;
      const m = /\/packages\/([^/]+)\//.exec(importer);
      if (!m) return null;
      return path.join(packagesDir, m[1], source.slice(2));
    },
  };
}

// Vitest 5 兼容（2026-11-04）：本文件仅含 unit 工程；
// storybook 浏览器工程拆至 vitest.storybook.config.ts（`pnpm test:storybook`），
// 避免 storybookTest 插件在默认测试启动时扫描 stories/**/*.mdx 失败而拖垮全部工程
// 8 债清零批（2026-11-07）CI 根因修复：vite 对 workspace 包 bare import 走
// package.json exports → ./dist/index.mjs；CI test job 不跑 build 无 dist → 解析断
// （本地因持续 build 有 dist 而长期被遮蔽）。此插件把 @yyc3/* 重定向到源码桶，
// 测试语义 = 测 workspace 包源码，与 dist 存在与否解耦。
function yyc3WorkspaceAlias(): Plugin {
  const pkgRoot = path.join(dirname, 'packages');
  const names = fs.readdirSync(pkgRoot).filter((n) => fs.existsSync(path.join(pkgRoot, n, 'package.json')));
  return {
    name: 'yyc3-workspace-alias',
    enforce: 'pre',
    resolveId(source) {
      if (!source.startsWith('@yyc3/')) return null;
      const [pkg, ...rest] = source.slice(6).split('/');
      if (!names.includes(pkg)) return null;
      const base = path.join(pkgRoot, pkg, 'src');
      if (rest.length === 0) {
        for (const entry of ['index.ts', 'index.tsx']) {
          const p = path.join(base, entry);
          if (fs.existsSync(p)) return p;
        }
        return null;
      }
      const rel = rest.join('/');
      for (const cand of [`${rel}.tsx`, `${rel}.ts`, `${rel}/index.tsx`, `${rel}/index.ts`]) {
        const p = path.join(base, cand);
        if (fs.existsSync(p)) return p;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [react(), atAliasPerPackage(), yyc3WorkspaceAlias()],
  resolve: {
    // 依赖升级（2026-11-04 dependabot）后出现双 React 实例（useState of null），
    // 强制去重保证组件与 RTL 共享同一 React
    dedupe: ['react', 'react-dom'],
  },
  test: {
    environment: 'jsdom',
    include: ['packages/*/src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
});

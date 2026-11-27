import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { defineConfig, type Plugin } from 'vitest/config';

import react from '@vitejs/plugin-react';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Phase 1 固化：还原源项目 `@/` 别名（按 importer 所属包解析）
// `@/src/x`（来自 packages/ai/…）→ packages/ai/src/x
// 批次 1（2026-11-27）：education（AIWidgetContext/PerformanceDashboard）以 `@/lib/…`
// 短式书写——主解析（原样拼接）不存在时回退 `src/` 前缀（additive，不改变既有解析）。
// 根锚定取多候选（importer 推导 / cwd / 配置 dirname）：config 在 vm 上下文二次求值时
// __dirname 可能为 '/'，单一锚定会合成不存在的绝对路径并被 externalize 成怪异报错。
function atAliasPerPackage(): Plugin {
  const packagesDir = path.join(dirname, 'packages');
  return {
    name: 'yyc3-at-alias-per-package',
    enforce: 'pre',
    resolveId(source, importer) {
      if (process.env.YYC3_ALIAS_DEBUG && source.startsWith('@'))
        console.log('[at-entry]', dirname, '|', source, '| imp:', String(importer).slice(-45));
      if (!source.startsWith('@/') || !importer) return null;
      const m = /\/packages\/([^/]+)\//.exec(importer);
      if (!m) return null;
      const rel = source.slice(2);
      const roots = new Set<string>();
      const pkgIdx = importer.indexOf(`/packages/${m[1]}/`);
      if (pkgIdx > 0) roots.add(importer.slice(0, pkgIdx));
      roots.add(process.cwd());
      if (dirname.length > 1) roots.add(dirname);
      for (const root of roots) {
        const base = root === dirname ? packagesDir : path.join(root, 'packages', m[1]);
        for (const relCand of [rel, path.join('src', rel)]) {
          const direct = path.join(base, relCand);
          for (const ext of ['.ts', '.tsx', '.mts', '.cts']) {
            if (fs.existsSync(direct + ext)) return direct + ext;
          }
          if (fs.existsSync(direct)) return direct;
          const index = path.join(direct, 'index');
          for (const ext of ['.ts', '.tsx']) {
            if (fs.existsSync(index + ext)) return index + ext;
          }
        }
      }
      return null;
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
    alias: [
      // 批次 1：education 组件的 `@/` 短式导入（tsconfig paths）在 vite 8
      // 原生 tsconfig 解析中先于插件 hook 且解析失败——alias 优先级最高，显式收口。
      // `@/src/x`（ai 包写法）由 atAliasPerPackage 兜底，不与此处冲突。
      {
        find: /^@\/components\/ui\/(.*)$/,
        replacement: path.join(dirname, 'packages', 'ui', 'src', '$1'),
      },
      {
        find: /^@\/(?!src\/)(.*)$/,
        replacement: path.join(dirname, 'packages', 'education', 'src', '$1'),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    include: ['packages/*/src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
});

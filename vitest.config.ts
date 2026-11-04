import path from 'node:path';
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
export default defineConfig({
  plugins: [react(), atAliasPerPackage()],
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

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, type Plugin } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';
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

// More info: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [atAliasPerPackage()],
  test: {
    projects: [
      {
        // Phase 1 固化：包级单元测试工程（jsdom）
        plugins: [react(), atAliasPerPackage()],
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['packages/*/src/**/*.{test,spec}.{ts,tsx}'],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        // Storybook 浏览器交互测试（需 playwright chromium，暂不纳入默认 test 通道）
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});

import { defineConfig } from 'tsup'

// Phase 3（Claw 设计令牌 TS 出口）：CJS+ESM+DTS；CSS 管线独立（postcss，见 build 脚本）
// A3 批次（2026-11-07）：theme-provider（next-themes 薄壳）并入 → next-themes 保持外置
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next-themes'],
})

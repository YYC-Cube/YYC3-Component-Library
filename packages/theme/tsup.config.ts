import { defineConfig } from 'tsup'

// Phase 3（Claw 设计令牌 TS 出口）：CJS+ESM+DTS；CSS 管线独立（postcss，见 build 脚本）
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
})

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true, // Phase 1 固化：基础包恢复 DTS 生成（下游包 DTS 依赖）
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'tailwindcss',
    // Radix UI
    '@radix-ui/*',
    // Other dependencies
    'lucide-react',
    'framer-motion',
    'recharts',
    'class-variance-authority',
    'cmdk',
    'date-fns',
    'embla-carousel-react',
    'input-otp',
    'react-day-picker',
    'react-resizable-panels',
    'sonner',
    'vaul',
    'clsx',
    'tailwind-merge',
    'react-hook-form',
    'zod',
    '@hookform/resolvers'
  ],
})

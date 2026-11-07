import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'lucide-react', 'framer-motion', 'next', 'next/navigation', 'next/image', 'next-themes', 'recharts', '@yyc3/ui-enterprise'],
})

// ============================================================
// YYC³ · Storybook preview 配置（Phase 7 apps 门户批次 · 2026-11-07）
// 全局装饰：@yyc3/theme 令牌 CSS（yy-* 色板变量）+ 深浅双背景支持
// ============================================================
import React from 'react'
import type { Preview } from '@storybook/react-vite'
import '@yyc3/theme/styles'
// Tailwind utilities 层（tw4 CLI 预构建产物——build 脚本串联 tailwindcss -i/-o；
// 源声明 .storybook/tailwind.css，@source 扫描 packages/*/src 类名）
import './tailwind.build.css'

// 走查批修复：next deps 链（next_image.js 等）引用 Node 全局 process——
// define 只覆盖 process.env 字面量，运行时残留引用由 global shim 兜底
window.process = window.process ?? ({ env: {} } as Process)
type Process = { env: Record<string, string> }

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      options: {
        light: { name: 'light', value: '#ffffff' },
        dark: { name: 'dark', value: '#0b0f19' },
      },
    },
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ fontFamily: 'system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif' }}>
        <Story />
      </div>
    ),
  ],
}

export default preview

// ============================================================
// YYC³ · Storybook preview 配置（Phase 7 apps 门户批次 · 2026-11-07）
// 全局装饰：@yyc3/theme 令牌 CSS（yy-* 色板变量）+ 深浅双背景支持
// ============================================================
import React from 'react'
import type { Preview } from '@storybook/react-vite'
import '@yyc3/theme/styles'

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

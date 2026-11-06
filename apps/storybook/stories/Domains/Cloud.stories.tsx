// ============================================================
// YYC³ · 门户门面 Story · @yyc3/cloud（Phase 7 apps 门户批次 · 2026-11-07）
// ServerStats 云平台统计卡（冒烟验证过的零 props 渲染件）
// ============================================================
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ServerStats } from '@yyc3/cloud'

const meta: Meta = {
  title: 'YYC3 域门面/Cloud 云平台',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const 服务器统计: Story = {
  name: 'ServerStats',
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <ServerStats />
    </div>
  ),
}

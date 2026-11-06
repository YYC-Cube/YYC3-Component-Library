// ============================================================
// YYC³ · 门户门面 Story · @yyc3/design（Phase 7 apps 门户批次 · 2026-11-07）
// CustomerSatisfaction 客户满意度看板（零 props、无 router 依赖件）
// ============================================================
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CustomerSatisfaction } from '@yyc3/design'

const meta: Meta = {
  title: 'YYC3 域门面/Design 管理设计',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const 客户满意度: Story = {
  name: 'CustomerSatisfaction',
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <CustomerSatisfaction />
    </div>
  ),
}

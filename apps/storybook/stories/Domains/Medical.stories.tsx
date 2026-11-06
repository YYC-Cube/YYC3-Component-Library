// ============================================================
// YYC³ · 门户门面 Story · @yyc3/medical（Phase 7 apps 门户批次 · 2026-11-07）
// VitalSigns 生命体征卡（零 props 渲染件）
// ============================================================
import type { Meta, StoryObj } from '@storybook/react-vite'
import { VitalSigns } from '@yyc3/medical'

const meta: Meta = {
  title: 'YYC3 域门面/Medical 医疗健康',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const 生命体征: Story = {
  name: 'VitalSigns',
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <VitalSigns />
    </div>
  ),
}

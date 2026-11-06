// ============================================================
// YYC³ · 门户门面 Story · @yyc3/financial（Phase 7 apps 门户批次 · 2026-11-07）
// CoreFeatures 核心功能看板（双语件，显式传 language）
// ============================================================
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CoreFeatures } from '@yyc3/financial'

const meta: Meta = {
  title: 'YYC3 域门面/Financial 金融',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const 核心功能: Story = {
  name: 'CoreFeatures（zh）',
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <CoreFeatures language="zh" />
    </div>
  ),
}

export const 核心功能英文: Story = {
  name: 'CoreFeatures（en）',
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <CoreFeatures language="en" />
    </div>
  ),
}

// ============================================================
// YYC³ · 门户门面 Story · @yyc3/city（Phase 7 apps 门户批次 · 2026-11-07）
// ModernCard 组合展示（children 可组合面）
// ============================================================
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ModernCard, ModernCardHeader, ModernCardContent, ModernCardFooter } from '@yyc3/city'

const meta: Meta = {
  title: 'YYC3 域门面/City 数字城市',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const 城市卡片组合: Story = {
  name: 'ModernCard 组合',
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <ModernCard>
        <ModernCardHeader>城市数据总览</ModernCardHeader>
        <ModernCardContent>
          <p style={{ margin: 0, color: '#666' }}>实时人流 / 车流 / 能耗监控数据看板。</p>
        </ModernCardContent>
        <ModernCardFooter>更新于刚刚</ModernCardFooter>
      </ModernCard>
      <ModernCard>
        <ModernCardHeader>交通态势</ModernCardHeader>
        <ModernCardContent>
          <p style={{ margin: 0, color: '#666' }}>主干道平均车速 42km/h，拥堵指数 1.3（畅通）。</p>
        </ModernCardContent>
      </ModernCard>
    </div>
  ),
}

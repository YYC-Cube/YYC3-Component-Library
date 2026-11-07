// ============================================================
// YYC³ · 门户门面 Story · @yyc3/ui-enterprise（Phase 7 apps 门户批次 · 2026-11-07）
// Claw 基础件 + 加载态展示；令牌经 preview 的 @yyc3/theme/styles 注入
// ============================================================
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ClawButton } from '@yyc3/ui-enterprise'
import { LoadingSpinner } from '@yyc3/ui-enterprise'

const meta: Meta<typeof ClawButton> = {
  title: 'YYC3 域门面/UI 基础件',
  component: ClawButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ClawButton>

export const 按钮族: Story = {
  name: 'Claw 按钮族',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <ClawButton variant="primary">主要操作</ClawButton>
      <ClawButton variant="secondary">次要操作</ClawButton>
      <ClawButton variant="outline">描边按钮</ClawButton>
      <ClawButton variant="ghost">幽灵按钮</ClawButton>
      <ClawButton disabled>禁用态</ClawButton>
      <LoadingSpinner />
    </div>
  ),
}

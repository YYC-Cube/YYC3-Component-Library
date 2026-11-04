import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ClawButton, ClawLayout, ClawContainer, YYC3ThemeProvider, type YYC3Theme } from '@yyc3/ui';

// YYC³ Claw UI 双主题演示（Phase 3a · 源 S1 showcase 甄别后重制为交互演示）
const meta: Meta<typeof ClawButton> = {
  title: 'Claw/双主题系统',
  component: ClawButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ClawButton>;

const ThemeDemo: React.FC = () => {
  const [theme, setTheme] = useState<YYC3Theme>('cyberpunk');
  const next = theme === 'cyberpunk' ? 'liquid-glass' : 'cyberpunk';
  return (
    <YYC3ThemeProvider theme={theme}>
      <ClawLayout fullScreen>
        <ClawLayout.Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px' }}>
            <strong>YYC³ Claw UI · {theme === 'cyberpunk' ? '赛博朋克' : '液态玻璃'}</strong>
            <ClawButton size="small" onClick={() => setTheme(next)}>
              切换 → {next === 'cyberpunk' ? '赛博朋克' : '液态玻璃'}
            </ClawButton>
          </div>
        </ClawLayout.Header>
        <ClawLayout.Content>
          <ClawContainer section>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <ClawButton>主要操作</ClawButton>
              <ClawButton variant="secondary">次要</ClawButton>
              <ClawButton variant="outline">描边</ClawButton>
              <ClawButton variant="ghost">幽灵</ClawButton>
              <ClawButton variant="danger">危险</ClawButton>
              <ClawButton loading>加载中</ClawButton>
              <ClawButton size="small" iconOnly aria-label="加号">+</ClawButton>
            </div>
          </ClawContainer>
        </ClawLayout.Content>
        <ClawLayout.Footer>
          <div style={{ padding: '12px 24px', opacity: 0.7 }}>
            言启象限 | 语枢未来 · 零依赖双主题组件系（Phase 3a）
          </div>
        </ClawLayout.Footer>
      </ClawLayout>
    </YYC3ThemeProvider>
  );
};

export const 双主题交互演示: Story = {
  render: () => <ThemeDemo />,
};

export const 赛博朋克主题: Story = {
  render: () => (
    <YYC3ThemeProvider theme="cyberpunk">
      <div style={{ display: 'flex', gap: 12, padding: 24, background: 'rgba(1,8,14,1)' }}>
        <ClawButton theme="cyberpunk">主要</ClawButton>
        <ClawButton theme="cyberpunk" variant="danger">危险</ClawButton>
        <ClawButton theme="cyberpunk" loading>加载</ClawButton>
      </div>
    </YYC3ThemeProvider>
  ),
};

export const 液态玻璃主题: Story = {
  render: () => (
    <YYC3ThemeProvider theme="liquid-glass">
      <div style={{ display: 'flex', gap: 12, padding: 24, background: 'linear-gradient(135deg,#dbeafe,#f8faff)' }}>
        <ClawButton theme="liquid-glass">主要</ClawButton>
        <ClawButton theme="liquid-glass" variant="danger">危险</ClawButton>
        <ClawButton theme="liquid-glass" loading>加载</ClawButton>
      </div>
    </YYC3ThemeProvider>
  ),
};

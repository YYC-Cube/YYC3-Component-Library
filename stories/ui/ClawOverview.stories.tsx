import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  ClawButton,
  ClawInput,
  ClawCard,
  ClawModal,
  ClawHeader,
  ClawSidebar,
  ClawFooter,
  ClawContainer,
  type YYC3Theme,
} from '@yyc3/ui';

// YYC³ Claw UI 组件总览（Phase 3b-4 · 源 showcase×4 甄别后重制的交互演示）
const meta: Meta = {
  title: 'Claw/组件总览',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Record<string, never>>;

const OVERVIEW_DEMO: React.FC = () => {
  const [theme, setTheme] = useState<YYC3Theme>('cyberpunk');
  const [modalOpen, setModalOpen] = useState(false);
  const next = theme === 'cyberpunk' ? 'liquid-glass' : 'cyberpunk';

  return (
    <YYC3ThemeProvider theme={theme}>
      <ClawLayout fullScreen hasSider>
        <ClawLayout.Header
          logo="YYC³"
          nav={[
            { key: 'home', label: '首页' },
            { key: 'comps', label: '组件' },
            { key: 'docs', label: '文档' },
          ]}
          activeKey="comps"
          actions={
            <ClawButton size="small" onClick={() => setTheme(next)}>
              {theme === 'cyberpunk' ? '切玻璃' : '切赛博'}
            </ClawButton>
          }
        />
        <ClawLayout.Sider width={220}>
          <ClawSidebar
            logo="☰ 导航"
            defaultCollapsed
            sections={[
              { title: '基础', items: [{ key: 'btn', label: 'Button' }, { key: 'input', label: 'Input' }] },
              { title: '反馈', items: [{ key: 'modal', label: 'Modal' }] },
            ]}
          />
        </ClawLayout.Sider>
        <ClawLayout.Content>
          <ClawContainer section>
            <div style={{ display: 'grid', gap: 16 }}>
              <ClawCard title="ClawCard" extra="3b-2a">
                <ClawCard.Body>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <ClawButton>主要</ClawButton>
                    <ClawButton variant="danger">危险</ClawButton>
                    <ClawButton variant="ghost">幽灵</ClawButton>
                    <ClawButton loading>加载</ClawButton>
                  </div>
                </ClawCard.Body>
              </ClawCard>
              <ClawCard title="ClawInput">
                <ClawCard.Body>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <ClawInput placeholder="普通输入" allowClear />
                    <ClawInput type="password" passwordToggle placeholder="密码" />
                    <ClawInput status="error" errorMessage="校验失败" defaultValue="bad" />
                  </div>
                </ClawCard.Body>
              </ClawCard>
              <div style={{ display: 'flex', gap: 10 }}>
                <ClawButton onClick={() => setModalOpen(true)}>打开 Modal</ClawButton>
              </div>
            </div>
          </ClawContainer>
        </ClawLayout.Content>
        <ClawLayout.Footer>
          <ClawFooter
            compact
            logo="YYC³ Claw UI"
            copyright="© 2026 YanYuCloudCube · 九件全量闭环"
          />
        </ClawLayout.Footer>
      </ClawLayout>

      <ClawModal
        visible={modalOpen}
        title="ClawModal 演示"
        centered
        onCancel={() => setModalOpen(false)}
        onOk={() => setModalOpen(false)}
      >
        五预设命令式 API：Modal.confirm / info / success / error / warning
      </ClawModal>
    </YYC3ThemeProvider>
  );
};

export const 全组件交互总览: Story = {
  render: () => <OVERVIEW_DEMO />,
};

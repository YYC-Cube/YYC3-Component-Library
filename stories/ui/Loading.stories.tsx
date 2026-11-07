// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// 万象归元于云枢 | 深栈智启新纪元
// All things converge in cloud pivot; Deep stacks ignite a new era of intelligence
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// Loading story — A3 移交验收（正仓会话① · 2026-11-07）
// ============================================================
import type { Meta, StoryObj } from '@storybook/react';

import { Loading } from '@yyc3/ui';

const meta: Meta<typeof Loading> = {
  title: 'UI/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Loading>;

// Loading 本体为 null 渲染占位件（家族多数派约定）：作 Suspense / 路由级 fallback 插槽使用
export const Placeholder: Story = {
  render: () => (
    <div
      style={{
        border: '1px dashed #888',
        borderRadius: 8,
        padding: 24,
        color: '#666',
        fontSize: 14,
      }}
    >
      <span>
        <Loading /> ← Loading 挂载点（null 占位，无视觉输出即验收通过）
      </span>
    </div>
  ),
};

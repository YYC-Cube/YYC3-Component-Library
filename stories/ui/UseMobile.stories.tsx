// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// 万象归元于云枢 | 深栈智启新纪元
// All things converge in cloud pivot; Deep stacks ignite a new era of intelligence
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// useIsMobile story — A3 移交验收（正仓会话① · 2026-11-07）
// use-mobile 为 shadcn 新版升级批次 A 存量（88 区同名件 diff 零功能增量），本 story 补挂桶导出演示
// ============================================================
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { useIsMobile } from '@yyc3/ui';

const meta: Meta = {
  title: 'UI/UseMobile',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

// 断点演示：拖拽视口宽度跨 768px 观察翻转（Mobile Breakpoint = 768）
export const Breakpoint: Story = {
  render: () => {
    const isMobile = useIsMobile();
    return (
      <div style={{ fontSize: 14, color: '#666' }}>
        当前视口判定：
        <strong style={{ marginLeft: 8 }}>
          {isMobile ? 'Mobile（< 768px）' : 'Desktop（≥ 768px）'}
        </strong>
      </div>
    );
  },
};

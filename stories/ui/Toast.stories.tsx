// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// 万象归元于云枢 | 深栈智启新纪元
// All things converge in cloud pivot; Deep stacks ignite a new era of intelligence
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// Toast / Toaster / useToast story — A3 移交验收（正仓会话① · 2026-11-07）
// toast 家族三件为 shadcn 新版升级批次 A 存量（88 区同名件 diff 零功能增量）
// ============================================================
import type { Meta, StoryObj } from '@storybook/react';

import {
  Button,
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toaster,
  toast,
} from '@yyc3/ui';

const meta: Meta = {
  title: 'UI/Toast',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

// 静态受控形态：ToastProvider + Toast 手动编排
export const Static: Story = {
  render: () => (
    <ToastProvider swipeDirection="right">
      <Toast>
        <div>
          <ToastTitle>YYC³ 静态 Toast</ToastTitle>
          <ToastDescription>A3 移交验收 · shadcn 新版件</ToastDescription>
        </div>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

// 命令式形态：toast() + Toaster（内部经 useToast 状态机）
export const Interactive: Story = {
  render: () => (
    <ToastProvider swipeDirection="right">
      <Button
        onClick={() =>
          toast({
            title: 'YYC³ 命令式 Toast',
            description: 'toast() + Toaster + useToast 链路',
          })
        }
      >
        触发 Toast
      </Button>
      <Toaster />
    </ToastProvider>
  ),
};

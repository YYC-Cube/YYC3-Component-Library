import type { Meta } from '@storybook/react';
import { music,  } from './music-components';

const meta: Meta<typeof music> = {
  title: 'Domains/Music',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

/**
 * YYC³  组件示例
 * 
 * 业务领域的 React 组件集合。
 */
export const Primary = {
  args: {},
};

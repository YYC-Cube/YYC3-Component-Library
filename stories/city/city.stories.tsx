import type { Meta } from '@storybook/react';
import { city,  } from './city-components';

const meta: Meta<typeof city> = {
  title: 'Domains/City',
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

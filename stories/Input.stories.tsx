import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@yyc3/ui'

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithValue: Story = {
  args: {
    value: 'Hello World',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
}

export const WithType: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
}

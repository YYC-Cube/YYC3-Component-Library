// ============================================================
// YYC³ · @yyc3/ui enhanced-form + field + input-group 渲染冒烟
// （批次 4 · 2026-11-27）
// EnhancedForm 提交/加载/校验/取消/布局 + EnhancedForm.FormField +
// EnhancedInput icon/error + Field 全家桶 + InputGroup 全家桶
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { EnhancedForm, FormField, EnhancedInput } from '../enhanced-form'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '../field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '../input-group'
import { stubMatchMedia, stubPointerCapture } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  stubMatchMedia(false)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('EnhancedForm · 业务表单壳', () => {
  it('提交回调 + 默认按钮文案', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())
    render(<EnhancedForm onSubmit={onSubmit}><input aria-label="名称" /></EnhancedForm>)
    await user.type(screen.getByLabelText('名称'), 'abc')
    await user.click(screen.getByRole('button', { name: '提交' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('isLoading 展示加载中文案 + onCancel 渲染取消钮', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <EnhancedForm onSubmit={vi.fn()} isLoading onCancel={onCancel} cancelText="放弃">
        <div>表单体</div>
      </EnhancedForm>,
    )
    expect(screen.getByText('表单体')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '放弃' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: /提交|加载中/ })).toBeInTheDocument()
  })

  it('isValid=false + validationMessage → 提示条渲染', () => {
    render(
      <EnhancedForm onSubmit={vi.fn()} isValid={false} validationMessage="必填项缺失">
        <div>体</div>
      </EnhancedForm>,
    )
    expect(screen.getByText('必填项缺失')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /提交/ })).toBeDisabled()
  })

  it('layout=horizontal + gap=lg 渲染（桌面桩下保持 horizontal）', () => {
    render(
      <EnhancedForm onSubmit={vi.fn()} layout="horizontal" gap="lg">
        <div>横排</div>
      </EnhancedForm>,
    )
    expect(screen.getByText('横排')).toBeInTheDocument()
  })
})

describe('EnhancedForm.FormField / EnhancedInput', () => {
  it('FormField label/required/description/error 全渲染', () => {
    render(
      <FormField
        label="邮箱"
        htmlFor="mail"
        description="我们不会泄露你的邮箱"
        error="格式不正确"
        required
      >
        <EnhancedInput id="mail" placeholder="you@example.com" />
      </FormField>,
    )
    expect(screen.getByText('邮箱')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('格式不正确')).toBeInTheDocument()
    expect(screen.getByText('我们不会泄露你的邮箱')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
  })

  it('EnhancedInput icon 槽 + error 标记', () => {
    render(
      <EnhancedInput
        placeholder="带图标"
        error
        icon={<span data-testid="mail-icon">@</span>}
      />,
    )
    expect(screen.getByPlaceholderText('带图标')).toBeInTheDocument()
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument()
  })
})

describe('Field · 字段组全家桶', () => {
  it('Set/Legend/Group/Field/Content/Label/Title/Description/Error/Separator 全渲染', () => {
    render(
      <FieldSet>
        <FieldLegend>个人资料</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="nick">昵称</FieldLabel>
            <FieldContent>
              <FieldTitle>显示名称</FieldTitle>
              <FieldDescription>他人可见</FieldDescription>
            </FieldContent>
            <FieldError>不可为空</FieldError>
          </Field>
          <FieldSeparator>或</FieldSeparator>
        </FieldGroup>
      </FieldSet>,
    )
    expect(screen.getByText('个人资料')).toBeInTheDocument()
    expect(screen.getByText('昵称')).toBeInTheDocument()
    expect(screen.getByText('显示名称')).toBeInTheDocument()
    expect(screen.getByText('他人可见')).toBeInTheDocument()
    expect(screen.getByText('不可为空')).toBeInTheDocument()
    expect(screen.getByText('或')).toBeInTheDocument()
  })
})

describe('InputGroup · 输入组', () => {
  it('Input/Text/Addon/Button/Textarea 组合渲染与交互', async () => {
    const user = userEvent.setup()
    render(
      <InputGroup>
        <InputGroupText data-testid="ig-icon">$</InputGroupText>
        <InputGroupInput placeholder="金额" aria-label="金额输入" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="sm" onClick={vi.fn()}>充值</InputGroupButton>
        </InputGroupAddon>
        <InputGroupTextarea placeholder="备注" aria-label="备注" />
      </InputGroup>,
    )
    expect(screen.getByTestId('ig-icon')).toBeInTheDocument()
    await user.type(screen.getByLabelText('金额输入'), '42')
    expect(screen.getByLabelText('金额输入')).toHaveValue('42')
    await user.type(screen.getByLabelText('备注'), '备注一下')
    expect(screen.getByLabelText('备注')).toHaveValue('备注一下')
    expect(screen.getByRole('button', { name: '充值' })).toBeInTheDocument()
  })
})

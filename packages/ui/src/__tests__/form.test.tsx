// ============================================================
// YYC³ · @yyc3/ui form（react-hook-form 封装）渲染冒烟（批次 4 · 2026-11-27）
// Form/FormField/FormItem/Label/Control/Description/Message 全链 +
// 校验错误显示 + aria 关联 + useFormField 导出
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
} from '../form'
import { Input } from '../input'
import { Button } from '../button'
import { stubPointerCapture } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

type Values = { username: string }

function DemoForm({ onValid }: { onValid: (v: Values) => void }) {
  // 注：历史批次的 resolvers@3.10 与 zod@4 不兼容（错误路径抛未捕获 ZodError），
  // 本链路当时以 RHF 内建 rules 驱动绕开；升级 resolvers@5 后新增 zod4 回归组见文件尾
  const form = useForm<Values>({
    defaultValues: { username: '' },
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} noValidate>
        <FormField
          control={form.control}
          name="username"
          rules={{ minLength: { value: 2, message: '用户名至少 2 个字符' } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="请输入用户名" {...field} />
              </FormControl>
              <FormDescription>这是你的公开昵称</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">提交表单</Button>
      </form>
    </Form>
  )
}

describe('Form · RHF 全链', () => {
  it('渲染 label/input/description，label 正确关联 input', () => {
    render(<DemoForm onValid={vi.fn()} />)
    const input = screen.getByPlaceholderText('请输入用户名')
    const label = screen.getByText('用户名')
    expect(label).toHaveAttribute('for', input.id)
    expect(screen.getByText('这是你的公开昵称')).toBeInTheDocument()
    // aria-describedby 指向 description（无错误时不含 message id）
    expect(input.getAttribute('aria-describedby')).toContain('form-item-description')
  })

  it('空提交 → 校验错误 → FormMessage 显示', async () => {
    const user = userEvent.setup()
    render(<DemoForm onValid={vi.fn()} />)
    // RHF 规则对空值跳过校验——输入 1 字符触发 minLength 错误
    await user.type(screen.getByPlaceholderText('请输入用户名'), 'y')
    await user.click(screen.getByRole('button', { name: '提交表单' }))
    await waitFor(() => {
      const msg = document.querySelector('[data-slot="form-message"]')
      expect(msg?.textContent).toBeTruthy()
    })
    const input = screen.getByPlaceholderText('请输入用户名')
    expect(input).toBeInvalid()
    expect(input.getAttribute('aria-describedby')).toContain('form-item-message')
  })

  it('合法提交 → onValid 回调', async () => {
    const user = userEvent.setup()
    const onValid = vi.fn()
    render(<DemoForm onValid={onValid} />)
    await user.type(screen.getByPlaceholderText('请输入用户名'), 'yyc3')
    await user.click(screen.getByRole('button', { name: '提交表单' }))
    await vi.waitFor(() => expect(onValid).toHaveBeenCalledTimes(1))
    expect(onValid.mock.calls[0][0]).toMatchObject({ username: 'yyc3' })
  })

  it('useFormField 导出可用（供外部扩展）', () => {
    expect(typeof useFormField).toBe('function')
  })
})

// ============================================================
// resolvers@5 + zod@4 回归（修复批次 · 2026-11-27）
// 产品 bug 复现：resolvers@3.10 的 zodResolver 在 zod@4 校验错误路径
// 抛未捕获 ZodError——升级 ^5.9.2 后同链路必须正常出错/出文案
// ============================================================
const zodValuesSchema = z.object({
  username: z.string().min(2, '用户名至少 2 个字符'),
})

function ZodDemoForm({ onValid }: { onValid: (v: Values) => void }) {
  const form = useForm<Values>({
    resolver: zodResolver(zodValuesSchema),
    defaultValues: { username: '' },
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} noValidate>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="请输入用户名" {...field} />
              </FormControl>
              <FormDescription>这是你的公开昵称</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">提交表单</Button>
      </form>
    </Form>
  )
}

describe('Form · zod4 + zodResolver（resolvers5 升级回归）', () => {
  it('非法提交 → zod4 校验错误渲染到 FormMessage（不再抛未捕获 ZodError）', async () => {
    const user = userEvent.setup()
    render(<ZodDemoForm onValid={vi.fn()} />)
    await user.type(screen.getByPlaceholderText('请输入用户名'), 'y')
    await user.click(screen.getByRole('button', { name: '提交表单' }))
    await waitFor(() => {
      expect(screen.getByText('用户名至少 2 个字符')).toBeInTheDocument()
    })
    const input = screen.getByPlaceholderText('请输入用户名')
    expect(input).toBeInvalid()
    expect(input.getAttribute('aria-describedby')).toContain('form-item-message')
  })

  it('合法提交 → zodResolver 校验通过 → onValid 回调', async () => {
    const user = userEvent.setup()
    const onValid = vi.fn()
    render(<ZodDemoForm onValid={onValid} />)
    await user.type(screen.getByPlaceholderText('请输入用户名'), 'yyc3')
    await user.click(screen.getByRole('button', { name: '提交表单' }))
    await vi.waitFor(() => expect(onValid).toHaveBeenCalledTimes(1))
    expect(onValid.mock.calls[0][0]).toMatchObject({ username: 'yyc3' })
  })
})

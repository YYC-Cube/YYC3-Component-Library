// ============================================================
// YYC³ · @yyc3/ui 弱分支清尾（batch2 · 2026-11-27）
// badge/button cva 默认档与 asChild / empty 默认变体 / input-group 默认
// 尺寸与按钮点击早退 / RMC 移动端 / enhanced-button 右图标 / floating-nav
// push 回退 / form 守卫与兜底消息 / input-otp 越界槽 / slider defaultValue /
// status-badge default / button-group asChild / lazy-load 失败与默认 props /
// medical-button asChild/loading / shadcn sidebar 受控开关 / 测试桩自身分支
// ============================================================
import React from 'react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { Search } from 'lucide-react'

import { Badge } from '../badge'
import { Button } from '../button'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from '../empty'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../input-group'
import {
  ResponsiveMedicalCard as RMC,
  ResponsiveMedicalCardTitle as RMCTitle,
} from '../responsive-medical-card'
import { MedicalButton } from '../medical-button'
import { EnhancedButton } from '../enhanced-button'
import { FloatingNavButtons } from '../floating-nav-buttons'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../input-otp'
import { Slider } from '../slider'
import { StatusBadge } from '../status-badge'
import { ButtonGroup, ButtonGroupText } from '../button-group'
import { LazyComponent } from '../lazy-load'
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarMenuSkeleton } from '../sidebar'
import {
  stubMatchMedia,
  stubPointerCapture,
  stubResizeObserver,
  stubIntersectionObserver,
  stubElementFromPoint,
} from './helpers'

const routerSpies = vi.hoisted(() => ({
  push: vi.fn(),
  back: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerSpies.push, back: routerSpies.back, replace: vi.fn(), prefetch: vi.fn() }),
}))

beforeAll(() => {
  stubPointerCapture()
  stubResizeObserver()
  stubIntersectionObserver()
  stubMatchMedia(false)
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

describe('badge/button · asChild Slot 分支', () => {
  it('Badge asChild → <a>', () => {
    render(
      <Badge asChild>
        <a href="/status">徽章链接</a>
      </Badge>,
    )
    expect(screen.getByRole('link', { name: '徽章链接' })).toHaveAttribute('href', '/status')
  })

  it('Button asChild → <a>', () => {
    render(
      <Button asChild>
        <a href="/go">按钮链接</a>
      </Button>,
    )
    expect(screen.getByRole('link', { name: '按钮链接' })).toBeInTheDocument()
  })
})

describe('empty · 组件族与默认变体', () => {
  it('EmptyMedia 无 variant（默认档 default-arg）+ icon 变体 + 全家桶', () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">📭</EmptyMedia>
          <EmptyTitle>暂无数据</EmptyTitle>
          <EmptyDescription>还没有任何记录</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <EmptyMedia>无变体媒体</EmptyMedia>
        </EmptyContent>
      </Empty>,
    )
    expect(screen.getByText('暂无数据')).toBeInTheDocument()
    expect(screen.getByText('无变体媒体')).toBeInTheDocument()
    expect(screen.getByText('📭')).toBeInTheDocument()
  })
})

describe('input-group · 默认尺寸与点击早退', () => {
  it('InputGroupButton 不传 size（默认 xs 分支）', () => {
    render(
      <InputGroup>
        <InputGroupButton>默认尺寸钮</InputGroupButton>
      </InputGroup>,
    )
    expect(screen.getByRole('button', { name: '默认尺寸钮' })).toHaveAttribute('data-size', 'xs')
  })

  it('addon 内点击按钮：closest(button) 命中 → 不聚焦 input（早退分支）', async () => {
    const user = userEvent.setup()
    render(
      <InputGroup>
        <InputGroupAddon>
          <button type="button">addon内钮</button>
        </InputGroupAddon>
        <InputGroupInput aria-label="组内输入" />
      </InputGroup>,
    )
    const input = screen.getByLabelText('组内输入')
    const focusSpy = vi.spyOn(input, 'focus')
    await user.click(screen.getByRole('button', { name: 'addon内钮' }))
    expect(focusSpy).not.toHaveBeenCalled()
  })
})

describe('responsive-medical-card · 移动端分支', () => {
  it('window.innerWidth=500：卡与标题走移动字号分支（useIsMobile 实际读 innerWidth）', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 500 })
    stubMatchMedia(true)
    const { getByTestId } = render(
      <RMC data-testid="rmc-m">
        <RMCTitle>移动端标题</RMCTitle>
      </RMC>,
    )
    // useIsMobile 首帧 false，effect 后翻转为 true
    await waitFor(() => expect(getByTestId('rmc-m').className).toContain('w-full'))
    expect(getByTestId('rmc-m').className).toContain('w-full')
    expect(getByTestId('rmc-m').textContent).toContain('移动端标题')
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 })
    stubMatchMedia(false)
  })
})

describe('medical-button · asChild 与 loading 分支', () => {
  it('asChild → <a>；loading 渲染 spinner', () => {
    render(
      <div>
        <MedicalButton asChild>
          <a href="/med">医疗链接</a>
        </MedicalButton>
        <MedicalButton isLoading>载入中</MedicalButton>
      </div>,
    )
    expect(screen.getByRole('link', { name: '医疗链接' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /载入中/ })).toBeDisabled()
  })
})

describe('enhanced-button · 右图标分支', () => {
  it('icon + iconPosition=right', () => {
    render(<EnhancedButton icon={Search} iconPosition="right">搜索右图</EnhancedButton>)
    expect(screen.getByRole('button', { name: /搜索右图/ })).toBeInTheDocument()
  })
})

describe('floating-nav-buttons · 历史长度回退分支', () => {
  it('history.length<=1：返回按钮走 push("/")', async () => {
    const user = userEvent.setup()
    Object.defineProperty(window.history, 'length', { configurable: true, value: 1 })
    routerSpies.push.mockClear()
    routerSpies.back.mockClear()
    render(<FloatingNavButtons />)
    const btns = screen.getAllByRole('button')
    await user.click(btns[0]) // 返回按钮
    expect(routerSpies.push).toHaveBeenCalledWith('/')
    expect(routerSpies.back).not.toHaveBeenCalled()
    await user.click(btns[1]) // 主页按钮
    expect(routerSpies.push).toHaveBeenCalledWith('/')
  })
})

describe('form · useFormField 守卫与消息兜底', () => {
  it('FormControl 脱离 FormField → 抛错（守卫 L56 实为死代码：useFormState 处先炸——batch2 记录）', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(
        <FormControl>
          <input />
        </FormControl>,
      ),
    ).toThrow()
    spy.mockRestore()
  })

  it('FormMessage children 兜底（无 error 时渲染 children）', async () => {
    function Demo() {
      const form = useForm<{ name: string }>({ defaultValues: { name: '' } })
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input {...field} aria-label="名称" />
                  </FormControl>
                  <FormMessage>无错误时的兜底提示</FormMessage>
                </FormItem>
              )}
            />
          </form>
        </Form>
      )
    }
    render(<Demo />)
    expect(screen.getByText('无错误时的兜底提示')).toBeInTheDocument()
  })
})

describe('input-otp · 越界槽位兜底分支', () => {
  it('index 超出 slots → ?? {} 兜底渲染空槽', () => {
    render(
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={9} data-testid="ghost-slot" />
        </InputOTPGroup>
      </InputOTP>,
    )
    expect(screen.getByTestId('ghost-slot')).toBeInTheDocument()
  })
})

describe('slider · defaultValue 数组分支', () => {
  it('defaultValue={[30]}', () => {
    render(<Slider defaultValue={[30]} />)
    expect(document.querySelector('[data-slot="slider"]')).not.toBeNull()
  })
})

describe('status-badge · default 兜底分支', () => {
  it('未知 status → 默认 Badge', () => {
    render(<StatusBadge status={'unknown-status' as never} />)
    expect(screen.getByText('unknown-status')).toBeInTheDocument()
  })
})

describe('button-group · Text asChild', () => {
  it('ButtonGroupText asChild → <span>', () => {
    render(
      <ButtonGroup>
        <ButtonGroupText asChild>
          <span>组内文字</span>
        </ButtonGroupText>
      </ButtonGroup>,
    )
    expect(screen.getByText('组内文字')).toBeInTheDocument()
  })
})

describe('lazy-load · 默认 props 与加载失败', () => {
  it('不传 props/fallback（默认参数分支）', async () => {
    const onLoad = vi.fn()
    render(<LazyComponent component={() => Promise.resolve({ default: () => <div>懒加载成功</div> })} onLoad={onLoad} />)
    expect(await screen.findByText('懒加载成功')).toBeInTheDocument()
    expect(onLoad).toHaveBeenCalled()
  })

  it('component 拒绝 → catch 分支（console.error）', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <LazyComponent
        component={() => Promise.reject(new Error('网络炸了'))}
        fallback={<div>加载失败占位</div>}
      />,
    )
    // 等待 rejection 处理完毕
    await new Promise((r) => setTimeout(r, 20))
    expect(errSpy).toHaveBeenCalled()
    errSpy.mockRestore()
  })
})

describe('shadcn sidebar · 受控开关与骨架默认', () => {
  it('受控 open + onOpenChange：trigger 点击只回调不落地', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <SidebarProvider open={false} onOpenChange={onOpenChange}>
        <Sidebar>
          <SidebarTrigger>开关钮</SidebarTrigger>
        </Sidebar>
      </SidebarProvider>,
    )
    await user.click(screen.getByRole('button', { name: /开关钮|Toggle Sidebar|切换侧边栏/ }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('SidebarMenuSkeleton 不传 showIcon（默认档）', () => {
    render(<SidebarMenuSkeleton data-testid="skel" />)
    expect(screen.getByTestId('skel')).toBeInTheDocument()
  })
})

describe('测试桩自身分支（helpers.ts）', () => {
  it('stubMatchMedia 无参调用（默认 false 档）', () => {
    stubMatchMedia()
    expect(window.matchMedia('(max-width: 100px)').matches).toBe(false)
    stubMatchMedia(false)
  })

  it('elementFromPoint/caretRangeFromPoint 已存在时桩早退（守卫 false 分支）', () => {
    const elFromPoint = () => null
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: elFromPoint })
    Object.defineProperty(document, 'caretRangeFromPoint', { configurable: true, value: () => null })
    stubElementFromPoint()
    expect(document.elementFromPoint).toBe(elFromPoint)
  })
})

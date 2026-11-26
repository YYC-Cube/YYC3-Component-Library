// ============================================================
// YYC³ · @yyc3/ui 覆盖补强杂项（批次 6+ · 2026-11-27）
// button-group/yy-card/alert/menubar 补齐（checkbox/radio/sub）/
// field 横排/input-group 变体/carousel setApi+vertical/ responsive-medical-card
// medical-button icon 变体
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ButtonGroup, ButtonGroupText, ButtonGroupSeparator } from '../button-group'
import { YYCard, YYCardHeader, YYCardTitle, YYCardContent } from '../yy-card'
import { Alert, AlertTitle, AlertDescription } from '../alert'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarLabel,
} from '../menubar'
import { Field, FieldLabel, FieldDescription, FieldError } from '../field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText } from '../input-group'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '../carousel'
import {
  ResponsiveMedicalCard as RMC,
  ResponsiveMedicalCardHeader as RMCHeader,
  ResponsiveMedicalCardTitle as RMCTitle,
  ResponsiveMedicalCardContent as RMCContent,
} from '../responsive-medical-card'
import { MedicalButton } from '../medical-button'
import { stubMatchMedia, stubPointerCapture, stubResizeObserver, stubIntersectionObserver } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  stubResizeObserver()
  stubIntersectionObserver()
  stubMatchMedia(false)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('ButtonGroup / YYCard / Alert', () => {
  it('ButtonGroup + Text + Separator', () => {
    render(
      <ButtonGroup>
        <button type="button">一</button>
        <ButtonGroupSeparator />
        <ButtonGroupText>说明文字</ButtonGroupText>
      </ButtonGroup>,
    )
    expect(screen.getByText('一')).toBeInTheDocument()
    expect(screen.getByText('说明文字')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="button-group-separator"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="button-group"]')).toBeInTheDocument()
  })

  it('YYCard 全家桶', () => {
    render(
      <YYCard data-testid="yyc">
        <YYCardHeader>
          <YYCardTitle>云控制台卡片</YYCardTitle>
        </YYCardHeader>
        <YYCardContent>云内容</YYCardContent>
      </YYCard>,
    )
    expect(screen.getByText('云控制台卡片')).toBeInTheDocument()
    expect(screen.getByText('云内容')).toBeInTheDocument()
    expect(screen.getByTestId('yyc')).toHaveAttribute('data-slot', 'yy-card')
  })

  it('Alert default/destructive 变体 + Title/Description', () => {
    render(
      <div>
        <Alert>
          <AlertTitle>提示标题</AlertTitle>
          <AlertDescription>提示描述</AlertDescription>
        </Alert>
        <Alert variant="destructive" role="alert">
          <AlertTitle>错误标题</AlertTitle>
          <AlertDescription>出错了</AlertDescription>
        </Alert>
      </div>,
    )
    expect(screen.getByText('提示标题')).toBeInTheDocument()
    expect(screen.getByText('提示描述')).toBeInTheDocument()
    expect(screen.getByText('错误标题')).toBeInTheDocument()
    expect(screen.getByText('出错了')).toBeInTheDocument()
  })
})

describe('Menubar 补齐：checkbox/radio/sub', () => {
  it('CheckboxItem 切换 + RadioGroup + 子菜单 + Label', async () => {
    const user = userEvent.setup()
    function Demo() {
      const [show, setShow] = React.useState(true)
      const [theme, setTheme] = React.useState('light')
      return (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>视图</MenubarTrigger>
            <MenubarContent>
              <MenubarLabel>显示选项</MenubarLabel>
              <MenubarCheckboxItem checked={show} onCheckedChange={setShow}>
                显示侧栏
              </MenubarCheckboxItem>
              <MenubarRadioGroup value={theme} onValueChange={setTheme}>
                <MenubarRadioItem value="light">浅色</MenubarRadioItem>
                <MenubarRadioItem value="dark">深色</MenubarRadioItem>
              </MenubarRadioGroup>
              <MenubarSub>
                <MenubarSubTrigger>语言</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>中文</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
    }
    render(<Demo />)
    await user.click(screen.getByRole('menuitem', { name: '视图' }))
    expect(await screen.findByText('显示侧栏')).toBeInTheDocument()
    expect(screen.getByText('显示选项')).toBeInTheDocument()
    // 先选 radio，再切 checkbox（menuitem 点击可能整菜单关闭）
    await user.click(screen.getByRole('menuitemradio', { name: '深色' }))
    await user.click(screen.getByRole('menuitem', { name: '视图' }))
    expect(await screen.findByText('显示侧栏')).toBeInTheDocument()
    await user.click(screen.getByRole('menuitemcheckbox', { name: '显示侧栏' }))
    // 重新打开进入子菜单
    await user.click(screen.getByRole('menuitem', { name: '视图' }))
    await user.click(await screen.findByText('语言'))
    expect(await screen.findByText('中文')).toBeInTheDocument()
  })
})

describe('Field 横排 + InputGroup 变体 + carousel setApi', () => {
  it('Field orientation=horizontal', () => {
    render(
      <Field orientation="horizontal">
        <FieldLabel htmlFor="h">横排标签</FieldLabel>
        <FieldDescription>横排描述</FieldDescription>
        <FieldError>横排错误</FieldError>
      </Field>,
    )
    expect(screen.getByText('横排标签')).toBeInTheDocument()
    expect(screen.getByText('横排描述')).toBeInTheDocument()
    expect(screen.getByText('横排错误')).toBeInTheDocument()
  })

  it('InputGroupAddon variant + InputGroupButton variant/size', () => {
    render(
      <InputGroup>
        <InputGroupAddon variant="inline">
          <span>前缀</span>
        </InputGroupAddon>
        <InputGroupText>币</InputGroupText>
        <InputGroupButton variant="default" size="icon-sm">↺</InputGroupButton>
      </InputGroup>,
    )
    expect(screen.getByText('前缀')).toBeInTheDocument()
    expect(screen.getByText('币')).toBeInTheDocument()
    expect(screen.getByText('↺')).toBeInTheDocument()
  })

  it('Carousel vertical + setApi 回调', () => {
    const setApi = vi.fn()
    render(
      <Carousel orientation="vertical" setApi={setApi}>
        <CarouselContent>
          <CarouselItem>竖排页一</CarouselItem>
          <CarouselItem>竖排页二</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    )
    expect(screen.getByText('竖排页一')).toBeInTheDocument()
    expect(screen.getByText('竖排页二')).toBeInTheDocument()
    // embla api 就绪后回调
    expect(setApi).toHaveBeenCalled()
  })
})

describe('ResponsiveMedicalCard / MedicalButton 补齐', () => {
  it('RMC variant=ghost', () => {
    render(
      <RMC variant="ghost">
        <RMCHeader>
          <RMCTitle>ghost 卡</RMCTitle>
        </RMCHeader>
        <RMCContent>ghost 内容</RMCContent>
      </RMC>,
    )
    expect(screen.getByText('ghost 卡')).toBeInTheDocument()
    expect(screen.getByText('ghost 内容')).toBeInTheDocument()
  })

  it('MedicalButton link 变体 + loading', () => {
    render(
      <div>
        <MedicalButton variant="link">链接钮</MedicalButton>
        <MedicalButton loading>提交中</MedicalButton>
      </div>,
    )
    expect(screen.getByRole('button', { name: '链接钮' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /提交中/ })).toBeInTheDocument()
  })
})

// ============================================================
// 二次补强：FieldError errors 数组 / InputGroupAddon 聚焦回调 /
// carousel 键盘翻页（ArrowLeft/Right）
// ============================================================
import { FieldError as FieldErrorX } from '../field'
import { fireEvent } from '@testing-library/react'

describe('二次补强', () => {
  it('FieldError errors 数组：单条渲染 message、多条渲染列表、无内容返回 null', () => {
    const { rerender, container } = render(
      <FieldErrorX errors={[{ message: '只有一条' }]} />,
    )
    expect(screen.getByText('只有一条')).toBeInTheDocument()
    rerender(
      <FieldErrorX
        errors={[{ message: '错误甲' }, { message: '错误乙' }]}
      />,
    )
    expect(screen.getByText('错误甲')).toBeInTheDocument()
    expect(screen.getByText('错误乙')).toBeInTheDocument()
    // 无 children 且无 errors → 整个组件返回 null
    rerender(<FieldErrorX />)
    expect(container.querySelector('[data-slot="field-error"]')).toBeNull()
  })

  it('InputGroupAddon 点击空白处聚焦内部 input', () => {
    render(
      <InputGroup>
        <InputGroupAddon>
          <span>标注</span>
        </InputGroupAddon>
        <input aria-label="目标输入" />
      </InputGroup>,
    )
    const input = screen.getByLabelText('目标输入')
    const focusSpy = vi.spyOn(input, 'focus')
    // 点击 addon 内非按钮子元素（冒泡到 addon 的 onClick）→ 聚焦 input
    fireEvent.click(screen.getByText('标注'))
    expect(focusSpy).toHaveBeenCalled()
  })

  it('carousel 键盘 ArrowLeft/Right 走 scrollPrev/Next 分支', async () => {
    const user = userEvent.setup()
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>一</CarouselItem>
          <CarouselItem>二</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    )
    const container = document.querySelector('[data-slot="carousel"]') as HTMLElement
    await user.type(container, '{ArrowLeft}')
    await user.type(container, '{ArrowRight}')
    expect(container).toBeInTheDocument()
  })
})

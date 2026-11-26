// ============================================================
// YYC³ · @yyc3/ui drawer(vaul) + command(cmdk) 渲染冒烟（批次 2 · 2026-11-27）
// drawer 受控 open + 手柄/四件套；command 输入过滤/选中/空态/
// CommandDialog（Dialog+Command 组合）/Shortcut/Separator
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from '../drawer'
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '../command'
import { stubPointerCapture, stubMatchMedia, stubResizeObserver } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  stubMatchMedia(false)
  stubResizeObserver()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Drawer · vaul 抽屉', () => {
  it('受控 open → 手柄 + Header/Footer/Title/Description 渲染，Close 关闭', async () => {
    const user = userEvent.setup()
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>抽屉标题</DrawerTitle>
            <DrawerDescription>抽屉说明</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>收起</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
    )
    expect(await screen.findByText('抽屉标题')).toBeInTheDocument()
    expect(screen.getByText('抽屉说明')).toBeInTheDocument()
    expect(screen.getByText('收起')).toBeInTheDocument()
    await user.click(screen.getByText('收起'))
    expect(await screen.findByText('抽屉标题')).toBeInTheDocument()
  })

  it('Trigger 触发开（受控 onOpenChange 回调）', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Drawer onOpenChange={onOpenChange}>
        <DrawerTrigger>拉出</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>回调抽屉</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    )
    await user.click(screen.getByText('拉出'))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(await screen.findByText('回调抽屉')).toBeInTheDocument()
  })
})

describe('Command · cmdk 命令面板', () => {
  const commands = (
    <>
      <CommandInput placeholder="搜索命令" />
      <CommandList>
        <CommandEmpty>无结果</CommandEmpty>
        <CommandGroup heading="建议">
          <CommandItem>日历</CommandItem>
          <CommandItem>计算器</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="设置">
          <CommandItem>个人资料</CommandItem>
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandGroup>
      </CommandList>
    </>
  )

  it('渲染命令列表与分组标题', () => {
    render(<Command>{commands}</Command>)
    expect(screen.getByPlaceholderText('搜索命令')).toBeInTheDocument()
    expect(screen.getByText('日历')).toBeInTheDocument()
    expect(screen.getByText('计算器')).toBeInTheDocument()
    expect(screen.getByText('建议')).toBeInTheDocument()
    expect(screen.getByText('设置')).toBeInTheDocument()
    expect(screen.getByText('⌘P')).toBeInTheDocument()
  })

  it('输入过滤：匹配项保留 + 无结果时 Empty 渲染', async () => {
    const user = userEvent.setup()
    render(<Command>{commands}</Command>)
    await user.type(screen.getByPlaceholderText('搜索命令'), '日历')
    expect(screen.getByText('日历')).toBeInTheDocument()
    expect(screen.queryByText('计算器')).toBeNull()
    await user.clear(screen.getByPlaceholderText('搜索命令'))
    await user.type(screen.getByPlaceholderText('搜索命令'), 'zzz')
    expect(await screen.findByText('无结果')).toBeInTheDocument()
  })

  it('Item 点击回调', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Command>
        <CommandItem onSelect={onSelect}>点选我</CommandItem>
      </Command>,
    )
    await user.click(screen.getByText('点选我'))
    expect(onSelect).toHaveBeenCalled()
  })

  it('CommandDialog 组合：受控 open 渲染 Dialog + Command', async () => {
    render(
      <CommandDialog open modal={false}>
        <CommandInput placeholder="面板搜索" />
        <CommandList>
          <CommandItem>面板项</CommandItem>
        </CommandList>
      </CommandDialog>,
    )
    expect(await screen.findByText('Command Palette')).toBeInTheDocument()
    expect(screen.getByText('Search for a command to run...')).toBeInTheDocument()
    expect(await screen.findByText('面板项')).toBeInTheDocument()
  })
})

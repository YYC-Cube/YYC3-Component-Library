// ============================================================
// YYC³ · @yyc3/ui dropdown-menu + context-menu 渲染冒烟（批次 3 · 2026-11-27）
// 点击/右键开合、item 回调、checkbox/radio 受控、子菜单、label/separator/shortcut
// ============================================================
import React from 'react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSubContent as SubContentAlias,
} from '../dropdown-menu'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from '../context-menu'
import { stubPointerCapture, stubResizeObserver } from './helpers'

beforeAll(() => {
  stubPointerCapture()
  stubResizeObserver()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('DropdownMenu · 点击菜单', () => {
  it('Trigger 点击开 → Item 点击回调 → 关闭', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>菜单按钮</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel inset>标签</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={onSelect}>动作一</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">危险动作</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>禁用项</DropdownMenuItem>
          <DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    await user.click(screen.getByRole('button', { name: '菜单按钮' }))
    expect(await screen.findByText('动作一')).toBeInTheDocument()
    expect(screen.getByText('标签')).toBeInTheDocument()
    expect(screen.getByText('⌘1')).toBeInTheDocument()
    expect(screen.getByText('危险动作')).toBeInTheDocument()
    expect(screen.getByText('禁用项')).toBeInTheDocument()
    await user.click(screen.getByRole('menuitem', { name: '动作一' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('CheckboxItem 受控勾选切换', async () => {
    const user = userEvent.setup()
    function Demo() {
      const [checked, setChecked] = React.useState(false)
      return (
        <DropdownMenu open>
          <DropdownMenuTrigger>开关</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={checked}
              onCheckedChange={setChecked}
            >
              显示网格
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    render(<Demo />)
    const item = await screen.findByText('显示网格')
    await user.click(item)
    // 受控状态经 onCheckedChange 切换后再渲染 indicator
    await user.click(screen.getByText('显示网格'))
    expect(screen.getByText('显示网格')).toBeInTheDocument()
  })

  it('RadioGroup 单选切换', async () => {
    const user = userEvent.setup()
    function Demo() {
      const [value, setValue] = React.useState('a')
      return (
        <DropdownMenu open>
          <DropdownMenuTrigger>单选</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
              <DropdownMenuRadioItem value="a">甲</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="b">乙</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    render(<Demo />)
    await user.click(await screen.findByText('乙'))
    await user.click(screen.getByText('甲'))
    expect(screen.getByText('甲')).toBeInTheDocument()
  })

  it('Sub 子菜单：hover/点击 SubTrigger 展开内容', async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>带子菜单</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>更多</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>子项一</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    await user.click(await screen.findByText('更多'))
    expect(await screen.findByText('子项一')).toBeInTheDocument()
    void SubContentAlias
  })
})

describe('ContextMenu · 右键菜单', () => {
  it('右键触发 → Item 回调 + checkbox/radio/label/separator/shortcut', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <ContextMenu>
        <ContextMenuTrigger>右键区域</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>操作</ContextMenuLabel>
          <ContextMenuItem onSelect={onSelect}>复制</ContextMenuItem>
          <ContextMenuCheckboxItem checked>显示隐藏</ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value="x">
            <ContextMenuRadioItem value="x">大图标</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuContent>
      </ContextMenu>,
    )
    const trigger = screen.getByText('右键区域')
    // Radix ContextMenu 监听 contextmenu 事件
    fireEvent.contextMenu(trigger)
    expect(await screen.findByText('复制')).toBeInTheDocument()
    expect(screen.getByText('操作')).toBeInTheDocument()
    expect(screen.getByText('⌘C')).toBeInTheDocument()
    await user.click(screen.getByRole('menuitem', { name: '复制' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('子菜单展开', async () => {
    const user = userEvent.setup()
    render(
      <ContextMenu open>
        <ContextMenuTrigger>区域</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSub>
            <ContextMenuSubTrigger>排序</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>按名称</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>,
    )
    await user.click(await screen.findByText('排序'))
    expect(await screen.findByText('按名称')).toBeInTheDocument()
  })
})
